import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let selectedSize = "8x12";
let unsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth.checkAuth()) return;
  
  const userId = sessionStorage.getItem('loggedInUserId');
  if (userId) {
    subscribeToCartUpdates(userId);
  }
  
  setupTextInput();
  setupSizeSelector();
  setupNavigation();
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

function subscribeToCartUpdates(userId) {
  if (unsubscribe) {
    unsubscribe();
  }

  const userRef = doc(db, "users", userId);
  unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      updateCartCount(userData.cart || []);
    }
  });
}

function setupTextInput() {
  const frameText = document.getElementById('frameText');
  const customText = document.getElementById('customText');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  frameText.addEventListener('input', () => {
    const text = frameText.value.trim();
    customText.textContent = text;
    addToCartBtn.disabled = !text;
  });
}

function setupSizeSelector() {
  const sizeButtons = document.querySelectorAll('.size-btn');
  const framePriceDisplay = document.querySelector('.frame-price');
  
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
      const price = framePrices[selectedSize];
      framePriceDisplay.textContent = `₹${price.toLocaleString()}`;
    });
  });
}

function showToast(message, isSuccess = true) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    ${message}
  `;
  document.body.appendChild(toast);

  toast.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeOut') {
      toast.remove();
    }
  });
}

async function handleAddToCart() {
  const userId = sessionStorage.getItem('loggedInUserId');
  if (!userId) return;

  const customText = document.getElementById('frameText').value.trim();
  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  if (!customText) {
    showToast('Please enter your text first', false);
    return;
  }

  // Disable button and show loading state
  addToCartBtn.disabled = true;
  addToCartBtn.classList.add('loading');

  const frameItem = {
    id: Date.now().toString(),
    name: 'Custom Frame',
    price: framePrices[selectedSize],
    customText: customText,
    size: selectedSize,
    image: generateTextImage(customText),
    quantity: 1,
    isCustomFrame: true
  };

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const cart = userData.cart || [];
      cart.push(frameItem);
      await updateDoc(userRef, { cart });
      
      showToast('Added to cart!');
      
      // Clear the text input after successful add
      document.getElementById('frameText').value = '';
      document.getElementById('customText').textContent = '';
      addToCartBtn.disabled = true;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add frame to cart. Please try again.', false);
  } finally {
    // Reset button state
    addToCartBtn.disabled = false;
    addToCartBtn.classList.remove('loading');
  }
}

function generateTextImage(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 400;
  canvas.height = 300;

  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#2c4a7c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = '20px "Playfair Display"';
  const words = text.split(' ');
  let lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < canvas.width - 40) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  let y = 150 - (lines.length * 15);
  lines.forEach(line => {
    ctx.fillText(line, canvas.width/2, y);
    y += 30;
  });

  return canvas.toDataURL();
}

function updateCartCount(cart) {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

const framePrices = {
  "8x12": 200,
  "10x15": 320,
  "8x18": 280,
  "12x18": 380,
  "12x24": 700,
  "18x36": 2800
};

// Add event listener for the Add to Cart button
document.querySelector('.add-to-cart-btn')?.addEventListener('click', handleAddToCart);

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});