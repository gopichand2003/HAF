import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let unsubscribe = null;
let currentCart = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth.checkAuth()) return;
  
  const userId = sessionStorage.getItem('loggedInUserId');
  if (userId) {
    subscribeToCartUpdates(userId);
    loadUserAddresses(userId);
    setupCheckoutForm();
    setupNavigation();
  }
});

function setupNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navClose = document.querySelector('.nav-close');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && navClose && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.add('active');
    });

    navClose.addEventListener('click', () => {
      mainNav.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mainNav.classList.remove('active');
      }
    });
  }
}

function setupCheckoutForm() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', handleCheckout);
  }
}

function showMessage(message, isError = true) {
  removeMessages();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = isError ? 'error-message' : 'success-message';
  messageDiv.innerHTML = `
    <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
    ${message}
  `;
  
  const submitButton = document.querySelector('.place-order-btn');
  submitButton.parentNode.insertBefore(messageDiv, submitButton);

  // If error, reset button state
  if (isError) {
    setButtonLoading(submitButton, false);
  }
}

function removeMessages() {
  const existingError = document.querySelector('.error-message');
  const existingSuccess = document.querySelector('.success-message');
  
  if (existingError) existingError.remove();
  if (existingSuccess) existingSuccess.remove();
}

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.classList.add('loading');
    button.innerHTML = '<span class="button-text">Processing Payment...</span>';
  } else {
    button.disabled = false;
    button.classList.remove('loading');
    button.innerHTML = '<span class="button-text">Complete Payment <i class="fas fa-lock"></i></span>';
  }
}

async function handleCheckout(e) {
  e.preventDefault();

  const userId = sessionStorage.getItem('loggedInUserId');
  if (!userId) return;

  const submitButton = document.querySelector('.place-order-btn');
  if (!submitButton) return;
  
  setButtonLoading(submitButton, true);
  removeMessages();

  try {
    if (currentCart.length === 0) {
      throw new Error('Your cart is empty');
    }

    // Get user data for prefill
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Verify stock availability before proceeding
    for (const item of currentCart) {
      const itemRef = doc(db, 'items', item.id.toString());
      const itemDoc = await getDoc(itemRef);
      
      if (!itemDoc.exists()) {
        throw new Error(`Item ${item.name} is no longer available`);
      }
      
      const currentStock = itemDoc.data().stock;
      if (currentStock < item.quantity) {
        throw new Error(`Only ${currentStock} units available for ${item.name}. Please adjust your quantity.`);
      }
    }

    const savedAddressSelect = document.getElementById('saved-addresses');
    let addressData;

    if (savedAddressSelect && savedAddressSelect.value && savedAddressSelect.value !== 'new') {
      // Use selected saved address
      const addresses = userData.addresses || [];
      addressData = addresses.find(addr => addr.id === savedAddressSelect.value);
      
      if (!addressData) {
        throw new Error('Selected address not found. Please try again.');
      }
    } else {
      // Validate new address form
      const name = document.getElementById('name').value;
      const addressLine1 = document.getElementById('address').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const pincode = document.getElementById('pincode').value;
      const phone = document.getElementById('phone').value;

      if (!name || !addressLine1 || !city || !state || !pincode || !phone) {
        throw new Error('Please fill in all required address fields');
      }

      if (!/^\d{10}$/.test(phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      if (!/^\d{6}$/.test(pincode)) {
        throw new Error('Please enter a valid 6-digit PIN code');
      }

      addressData = {
        id: Date.now().toString(),
        name,
        addressLine1,
        addressLine2: document.getElementById('addressLine2').value || '',
        city,
        state,
        pincode,
        phone
      };

      if (document.getElementById('saveAddress')?.checked) {
        await saveNewAddress(userId, addressData);
      }
    }

    const subtotal = currentCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    // Create order object first
    const orderNumber = `ORD${Date.now()}`;
    const order = {
      id: orderNumber,
      orderNumber,
      items: currentCart,
      address: addressData,
      subtotal,
      tax,
      total,
      status: 'Pending',
      date: new Date().toISOString(),
      customerName: `${userData.firstName} ${userData.lastName}`,
      customerEmail: userData.email
    };

    // Initialize Razorpay payment
    const options = {
      key: "rzp_test_YVw0YnwdzULYFw",
      amount: Math.round(total * 100), // Amount in paise
      currency: "INR",
      name: "Holy Army Fellowship",
      description: "Frame Purchase",
      prefill: {
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        contact: addressData.phone
      },
      notes: {
        orderId: orderNumber,
        userId: userId
      },
      handler: async function(response) {
        try {
          showMessage('Payment successful! Processing your order...', false);

          // Update order with payment details
          order.status = 'Confirmed';
          order.paymentId = response.razorpay_payment_id;
          order.paymentMethod = 'Online Payment';

          // Update stock for each item
          for (const item of currentCart) {
            const itemRef = doc(db, 'items', item.id.toString());
            const itemDoc = await getDoc(itemRef);
            const currentStock = itemDoc.data().stock;
            await updateDoc(itemRef, {
              stock: currentStock - item.quantity
            });
          }

          // Save order to user's orders
          const orders = userData.orders || [];
          orders.push(order);
          await updateDoc(userRef, { 
            orders,
            cart: [] // Clear cart after successful order
          });

          // Redirect to success page
          window.location.href = `order-success.html?orderId=${order.id}`;
        } catch (error) {
          console.error('Error processing order:', error);
          showMessage('Error processing your order. Please contact support.', true);
          setButtonLoading(submitButton, false);
        }
      },
      modal: {
        ondismiss: function() {
          showMessage('Payment cancelled. Please try again.', true);
          setButtonLoading(submitButton, false);
        },
        escape: true,
        confirm_close: true,
        handleback: true,
        ondismiss: function() {
          showMessage('Payment cancelled. Please try again.', true);
          setButtonLoading(submitButton, false);
        },
        onerror: function(error) {
          showMessage(`Payment failed: ${error.description || 'Please try again.'}`, true);
          setButtonLoading(submitButton, false);
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
      showMessage(`Payment failed: ${response.error.description}`, true);
      setButtonLoading(submitButton, false);
    });
    
    rzp.open();
    
  } catch (error) {
    console.error('Checkout error:', error);
    showMessage(error.message || 'An error occurred while processing your order. Please try again.', true);
    setButtonLoading(submitButton, false);
  }
}

async function saveNewAddress(userId, addressData) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  let addresses = userDoc.data().addresses || [];
  
  // If this is the first address, make it default
  if (addresses.length === 0) {
    addressData.isDefault = true;
  }
  
  addresses.push(addressData);
  await updateDoc(userRef, { addresses });
}

function subscribeToCartUpdates(userId) {
  if (unsubscribe) {
    unsubscribe();
  }

  const userRef = doc(db, "users", userId);
  unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      currentCart = userData.cart || [];
      renderCheckoutItems(currentCart);
      updateCartCount(currentCart);
    }
  });
}

function renderCheckoutItems(cart) {
  const checkoutItems = document.getElementById('checkout-items');
  if (!checkoutItems) return;

  // Check if we're in the process of completing an order
  const isProcessingOrder = document.querySelector('.place-order-btn')?.disabled;

  // Only redirect if cart is empty and we're not processing an order
  if (cart.length === 0 && !isProcessingOrder) {
    window.location.href = 'cart-english.html';
    return;
  }

  checkoutItems.innerHTML = cart.map(item => `
    <div class="checkout-item">
      <div class="item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <div class="item-specs">
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="item-quantity-price">
          <span class="quantity">Qty: ${item.quantity}</span>
          <span class="price">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');

  updateOrderSummary(cart);
}

function updateOrderSummary(cart) {
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString()}`;
  document.getElementById('checkout-tax').textContent = `₹${tax.toLocaleString()}`;
  document.getElementById('checkout-total').textContent = `₹${total.toLocaleString()}`;
}

async function loadUserAddresses(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = doc.data();
      const addresses = userData.addresses || [];
      
      const savedAddressesSection = document.getElementById('saved-addresses-section');
      const savedAddressesSelect = document.getElementById('saved-addresses');
      const newAddressSection = document.getElementById('new-address-section');
      
      if (addresses.length > 0) {
        savedAddressesSection.style.display = 'block';
        savedAddressesSelect.innerHTML = `
          <option value="">Choose a delivery address</option>
          ${addresses.map(addr => `
            <option value="${addr.id}" ${addr.isDefault ? 'selected' : ''}>
              ${addr.addressLine1}, ${addr.city}, ${addr.state} - ${addr.pincode}
            </option>
          `).join('')}
          <option value="new">+ Add New Address</option>
        `;
        
        // Hide new address form if we have a default address
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          newAddressSection.style.display = 'none';
        }
        
        // Handle address selection change
        savedAddressesSelect.addEventListener('change', (e) => {
          if (e.target.value === 'new') {
            newAddressSection.style.display = 'block';
          } else {
            newAddressSection.style.display = 'none';
          }
        });
      }
    }
  } catch (error) {
    console.error("Error loading addresses:", error);
  }
}

function updateCartCount(cart) {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});