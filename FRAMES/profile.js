import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let currentUser = null;
let editingAddressId = null;
let unsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!window.auth.checkAuth()) return;
    
    const loggedInUserId = sessionStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        loadUserProfile(loggedInUserId);
        subscribeToUserData(loggedInUserId);
    }
    
    setupAddressModal();
    setupPhoneModal();
    setupNavigation();
    
    // Check if user needs to add mobile number (for Google sign-in users)
    if (sessionStorage.getItem('needsMobileNumber') === 'true') {
        // Show phone modal automatically
        document.getElementById('phoneModal').classList.add('active');
        // Add a message to inform the user
        const phoneForm = document.getElementById('phoneForm');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'phone-prompt-message';
        messageDiv.innerHTML = 'Please add your mobile number to complete your profile.';
        phoneForm.insertBefore(messageDiv, phoneForm.firstChild);
        
        // Remove the flag from session storage
        sessionStorage.removeItem('needsMobileNumber');
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

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
            }
        });

        // Setup logout button
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.signOut().then(() => {
                    sessionStorage.removeItem('loggedInUserId');
                    window.location.href = 'index.html';
                }).catch((error) => {
                    console.error('Error signing out:', error);
                });
            });
        }
    }
}

function subscribeToUserData(userId) {
    if (unsubscribe) {
        unsubscribe();
    }

    const userRef = doc(db, "users", userId);
    unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            const userData = doc.data();
            updateCartCount(userData.cart || []);
            loadOrders(userData.orders || []);
        }
    });
}

async function loadUserProfile(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const userData = docSnap.data();
            currentUser = { id: userId, ...userData };
            
            // Update profile information
            document.getElementById('profileFullName').textContent = `${userData.firstName} ${userData.lastName}`;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('profilePhone').textContent = userData.phone || 'Not added';
            
            // Load addresses
            loadAddresses(userData.addresses || []);
            
            // Load orders
            loadOrders(userData.orders || []);
            
            // Update cart count
            updateCartCount(userData.cart || []);
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
    }
}

function loadOrders(orders) {
    const orderHistorySection = document.getElementById('orderHistorySection');
    const noOrdersMessage = document.getElementById('noOrdersMessage');
    const ordersList = document.getElementById('ordersList');
    
    orderHistorySection.style.display = 'block';
    
    if (!orders || orders.length === 0) {
        noOrdersMessage.style.display = 'block';
        ordersList.style.display = 'none';
        return;
    }
    
    noOrdersMessage.style.display = 'none';
    ordersList.style.display = 'block';
    
    // Sort orders by date (most recent first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersList.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
                <span class="order-status">${order.status}</span>
                <a href="order-success.html?orderId=${order.id}" class="download-invoice-btn">
                    <i class="fas fa-download"></i> Download Invoice
                </a>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                        <div class="item-price">
                            ₹${(item.price * item.quantity).toLocaleString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: ₹${order.total.toLocaleString()}
            </div>
        </div>
    `).join('');
}

function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function setupAddressModal() {
    const addAddressBtn = document.getElementById('addAddressBtn');
    const addressModal = document.getElementById('addressModal');
    const addressForm = document.getElementById('addressForm');
    
    addAddressBtn.addEventListener('click', () => {
        editingAddressId = null;
        document.getElementById('modalTitle').textContent = 'Add New Address';
        addressForm.reset();
        addressModal.classList.add('active');
    });
    
    addressForm.addEventListener('submit', handleAddressSubmit);
}

async function handleAddressSubmit(e) {
    e.preventDefault();
    
    const addressData = {
        id: editingAddressId || Date.now().toString(),
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        pincode: document.getElementById('pincode').value,
        phone: document.getElementById('phone').value,
        isDefault: document.getElementById('isDefault').checked
    };
    
    try {
        const userRef = doc(db, "users", currentUser.id);
        const userDoc = await getDoc(userRef);
        let addresses = userDoc.data().addresses || [];
        
        if (editingAddressId) {
            // Update existing address
            addresses = addresses.map(addr => 
                addr.id === editingAddressId ? addressData : addr
            );
        } else {
            // Add new address
            if (addressData.isDefault) {
                addresses = addresses.map(addr => ({...addr, isDefault: false}));
            }
            addresses.push(addressData);
        }
        
        // If this is the first address, make it default
        if (addresses.length === 1) {
            addresses[0].isDefault = true;
        }
        
        await updateDoc(userRef, { addresses });
        loadAddresses(addresses);
        closeAddressModal();
    } catch (error) {
        console.error("Error saving address:", error);
    }
}

function loadAddresses(addresses) {
    const addressList = document.getElementById('addressList');
    const noAddressMessage = document.getElementById('noAddressMessage');
    
    if (!addresses || addresses.length === 0) {
        noAddressMessage.style.display = 'block';
        addressList.style.display = 'none';
        return;
    }
    
    noAddressMessage.style.display = 'none';
    addressList.style.display = 'grid';
    
    addressList.innerHTML = addresses.map((address, index) => `
        <div class="address-card ${address.isDefault ? 'default' : ''}">
            ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
            <div class="address-content">
                <h4>Address ${index + 1}</h4>
                <p>${address.addressLine1}</p>
                ${address.addressLine2 ? `<p>${address.addressLine2}</p>` : ''}
                <p>${address.city}, ${address.state} - ${address.pincode}</p>
                <p>Phone: ${address.phone}</p>
            </div>
            <div class="address-actions">
                <button class="address-btn edit-btn" onclick="editAddress('${address.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="address-btn delete-btn" onclick="deleteAddress('${address.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ${!address.isDefault ? `
                    <button class="address-btn set-default-btn" onclick="setDefaultAddress('${address.id}')">
                        Set as Default
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

window.editAddress = async function(addressId) {
    const userRef = doc(db, "users", currentUser.id);
    const userDoc = await getDoc(userRef);
    const addresses = userDoc.data().addresses || [];
    const address = addresses.find(addr => addr.id === addressId);
    
    if (address) {
        editingAddressId = addressId;
        document.getElementById('modalTitle').textContent = 'Edit Address';
        document.getElementById('addressLine1').value = address.addressLine1;
        document.getElementById('addressLine2').value = address.addressLine2 || '';
        document.getElementById('city').value = address.city;
        document.getElementById('state').value = address.state;
        document.getElementById('pincode').value = address.pincode;
        document.getElementById('phone').value = address.phone;
        document.getElementById('isDefault').checked = address.isDefault;
        document.getElementById('addressModal').classList.add('active');
    }
};

window.deleteAddress = async function(addressId) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
        const userRef = doc(db, "users", currentUser.id);
        const userDoc = await getDoc(userRef);
        let addresses = userDoc.data().addresses || [];
        
        const addressToDelete = addresses.find(addr => addr.id === addressId);
        addresses = addresses.filter(addr => addr.id !== addressId);
        
        // If we deleted the default address, make the first remaining address default
        if (addressToDelete.isDefault && addresses.length > 0) {
            addresses[0].isDefault = true;
        }
        
        await updateDoc(userRef, { addresses });
        loadAddresses(addresses);
    } catch (error) {
        console.error("Error deleting address:", error);
    }
};

window.setDefaultAddress = async function(addressId) {
    try {
        const userRef = doc(db, "users", currentUser.id);
        const userDoc = await getDoc(userRef);
        let addresses = userDoc.data().addresses || [];
        
        addresses = addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));
        
        await updateDoc(userRef, { addresses });
        loadAddresses(addresses);
    } catch (error) {
        console.error("Error setting default address:", error);
    }
};

window.closeAddressModal = function() {
    document.getElementById('addressModal').classList.remove('active');
    document.getElementById('addressForm').reset();
    editingAddressId = null;
};

function setupPhoneModal() {
    const editPhoneBtn = document.getElementById('editPhoneBtn');
    const phoneModal = document.getElementById('phoneModal');
    const phoneForm = document.getElementById('phoneForm');
    
    editPhoneBtn.addEventListener('click', () => {
        const currentPhone = document.getElementById('profilePhone').textContent;
        if (currentPhone !== 'Not added') {
            document.getElementById('personalPhone').value = currentPhone;
        }
        phoneModal.classList.add('active');
    });
    
    phoneForm.addEventListener('submit', handlePhoneSubmit);
}

async function handlePhoneSubmit(e) {
    e.preventDefault();
    
    const phone = document.getElementById('personalPhone').value;
    if (!/^\d{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }
    
    try {
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, { phone });
        document.getElementById('profilePhone').textContent = phone;
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'phone-success-message';
        successMessage.textContent = 'Phone number updated successfully!';
        const phoneForm = document.getElementById('phoneForm');
        phoneForm.insertBefore(successMessage, phoneForm.firstChild);
        
        // Remove message after 2 seconds and close modal
        setTimeout(() => {
            successMessage.remove();
            closePhoneModal();
        }, 2000);
    } catch (error) {
        console.error("Error updating phone number:", error);
        alert('Failed to update phone number. Please try again.');
    }
}

window.closePhoneModal = function() {
    document.getElementById('phoneModal').classList.remove('active');
    document.getElementById('phoneForm').reset();
    
    // Remove any messages
    const messages = document.querySelectorAll('.phone-prompt-message, .phone-success-message');
    messages.forEach(msg => msg.remove());
};

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});