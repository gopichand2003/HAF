import { db, auth } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let currentLanguage = 'english';
let selectedSize = "8x10";
let unsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth.checkAuth()) return;
  
  const userId = sessionStorage.getItem('loggedInUserId');
  if (userId) {
    subscribeToCartUpdates(userId);
  }
  
  setupLanguageSelector();
  setupBibleSelectors();
  setupSizeSelector();
  setupNavigation();
  updateBibleBooks();
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

function setupLanguageSelector() {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLanguage = btn.dataset.lang;
      updateBibleBooks();
      clearVerseSelections();
    });
  });
}

function updateBibleBooks() {
  const bookSelect = document.getElementById('book');
  if (!bookSelect) return;

  const books = Object.keys(bibleData[currentLanguage]);
  
  bookSelect.innerHTML = `
    <option value="">Select Book</option>
    ${books.map(book => `
      <option value="${book}">${book}</option>
    `).join('')}
  `;
}

function setupBibleSelectors() {
  const bookSelect = document.getElementById('book');
  const chapterSelect = document.getElementById('chapter');
  const verseSelect = document.getElementById('verse');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  bookSelect.addEventListener('change', () => {
    const book = bookSelect.value;
    if (book) {
      updateChapters(book);
      chapterSelect.disabled = false;
    } else {
      chapterSelect.disabled = true;
      verseSelect.disabled = true;
    }
    clearVerseSelect();
    updateButtonStates();
  });

  chapterSelect.addEventListener('change', () => {
    const book = bookSelect.value;
    const chapter = parseInt(chapterSelect.value);
    if (chapter) {
      updateVerses(book, chapter);
      verseSelect.disabled = false;
    } else {
      verseSelect.disabled = true;
    }
    updateButtonStates();
  });

  verseSelect.addEventListener('change', () => {
    if (verseSelect.value) {
      updateVerseDisplay(bookSelect.value, chapterSelect.value, verseSelect.value);
    }
    updateButtonStates();
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', handleAddToCart);
  }
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

function updateChapters(book) {
  const chapterSelect = document.getElementById('chapter');
  const numChapters = bibleData[currentLanguage][book].chapters;
  
  chapterSelect.innerHTML = `
    <option value="">Select Chapter</option>
    ${Array.from({length: numChapters}, (_, i) => i + 1).map(num => `
      <option value="${num}">${num}</option>
    `).join('')}
  `;
}

function updateVerses(book, chapter) {
  const verseSelect = document.getElementById('verse');
  const numVerses = bibleData[currentLanguage][book].verses[chapter];
  
  verseSelect.innerHTML = `
    <option value="">Select Verse</option>
    ${Array.from({length: numVerses}, (_, i) => i + 1).map(num => `
      <option value="${num}">${num}</option>
    `).join('')}
  `;
}

function updateVerseDisplay(book, chapter, verse) {
  const verseTextElement = document.getElementById('selectedVerse');
  const verseReferenceElement = document.getElementById('verseReference');

  // In a real app, you would have the actual verse text
  verseTextElement.textContent = `Sample verse text for ${book} ${chapter}:${verse}`;
  verseReferenceElement.textContent = `${book} ${chapter}:${verse}`;
}

function updateButtonStates() {
  const verseSelected = document.getElementById('selectedVerse').textContent.trim() !== '';
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  
  if (addToCartBtn) {
    addToCartBtn.disabled = !verseSelected;
  }
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

  const verseText = document.getElementById('selectedVerse').textContent;
  const verseReference = document.getElementById('verseReference').textContent;
  const addToCartBtn = document.querySelector('.add-to-cart-btn');

  if (!verseText || !verseReference) {
    showToast('Please select a verse first', false);
    return;
  }

  addToCartBtn.disabled = true;
  addToCartBtn.classList.add('loading');
  addToCartBtn.innerHTML = `
    <span class="spinner"></span>
    <span class="button-text">Adding to Cart...</span>
  `;

  const frameItem = {
    id: Date.now(),
    name: `Custom-${verseReference} (${selectedSize})`,
    price: framePrices[selectedSize],
    verse: verseText,
    reference: verseReference,
    size: selectedSize,
    image: generateVerseImage(verseText, verseReference),
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
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('Failed to add frame to cart. Please try again.', false);
  } finally {
    addToCartBtn.disabled = false;
    addToCartBtn.classList.remove('loading');
    addToCartBtn.innerHTML = `
      <span class="button-text">
        <i class="fas fa-shopping-cart"></i>
        Add to Cart
      </span>
    `;
  }
}

function generateVerseImage(verse, reference) {
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
  const words = verse.split(' ');
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

  ctx.font = '18px "Cinzel"';
  ctx.fillText(reference, canvas.width/2, y + 20);

  return canvas.toDataURL();
}

function clearVerseSelections() {
  const chapterSelect = document.getElementById('chapter');
  const verseSelect = document.getElementById('verse');
  const selectedVerse = document.getElementById('selectedVerse');
  const verseReference = document.getElementById('verseReference');

  if (chapterSelect) chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
  if (verseSelect) verseSelect.innerHTML = '<option value="">Select Verse</option>';
  if (selectedVerse) selectedVerse.textContent = '';
  if (verseReference) verseReference.textContent = '';
  updateButtonStates();
}

function clearVerseSelect() {
  const verseSelect = document.getElementById('verse');
  const selectedVerse = document.getElementById('selectedVerse');
  const verseReference = document.getElementById('verseReference');

  if (verseSelect) verseSelect.innerHTML = '<option value="">Select Verse</option>';
  if (selectedVerse) selectedVerse.textContent = '';
  if (verseReference) verseReference.textContent = '';
  updateButtonStates();
}

function updateCartCount(cart) {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Bible data structure
const bibleData = {
  english: {
    Genesis: {
      chapters: 50,
      verses: {
        1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32,
        11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18,
        21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43,
        31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23,
        41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26
      }
    },
    Exodus: {
      chapters: 40,
      verses: {
        1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29,
        11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26,
        21: 37, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38,
        31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38
      }
    }
  },
  telugu: {
    "ఆదికాండము": {
      chapters: 50,
      verses: {
        1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32,
        11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18,
        21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43,
        31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23,
        41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26
      }
    }
  }
};

const framePrices = {
  "8x10": 1499,
  "11x14": 2499,
  "16x20": 3499
};

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});