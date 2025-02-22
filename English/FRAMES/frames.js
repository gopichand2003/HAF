import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let unsubscribeProducts = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth.checkAuth()) return;
  setupProductsListener();
  setupFilterToggle();
  setupFilters();
  updateCartCount();
});

// Setup filter toggle
function setupFilterToggle() {
  const filterToggle = document.querySelector('.filter-toggle');
  const filtersSection = document.querySelector('.filters-section');
  
  if (filterToggle && filtersSection) {
    filterToggle.addEventListener('click', () => {
      filtersSection.classList.toggle('active');
      filterToggle.classList.toggle('active');
      const icon = filterToggle.querySelector('i');
      icon.classList.toggle('fa-times');
      icon.classList.toggle('fa-filter');
    });

    // Close filters when clicking outside
    document.addEventListener('click', (e) => {
      if (!filtersSection.contains(e.target) && !filterToggle.contains(e.target)) {
        filtersSection.classList.remove('active');
        filterToggle.classList.remove('active');
        const icon = filterToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-filter');
      }
    });
  }
}

function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const priceFilter = document.getElementById('price-filter');
  const sizeFilter = document.getElementById('size-filter');
  const materialFilter = document.getElementById('material-filter');
  const styleFilter = document.getElementById('style-filter');

  const filters = [searchInput, priceFilter, sizeFilter, materialFilter, styleFilter];

  filters.forEach(filter => {
    if (filter) {
      filter.addEventListener('change', refreshProducts);
      if (filter === searchInput) {
        filter.addEventListener('input', refreshProducts);
      }
    }
  });
}

async function refreshProducts() {
  const itemsRef = collection(db, "items");
  const q = query(itemsRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  
  const products = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });
  
  renderProducts(products);
}

// Update cart count
async function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  const userId = sessionStorage.getItem('loggedInUserId');
  
  if (userId) {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      const userData = docSnap.data();
      const cart = userData.cart || [];
      if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
      }
    }
  }
}

// Setup real-time products listener
function setupProductsListener() {
  if (unsubscribeProducts) {
    unsubscribeProducts();
  }

  const itemsRef = collection(db, "items");
  const q = query(itemsRef, orderBy("timestamp", "desc"));
  
  unsubscribeProducts = onSnapshot(q, (snapshot) => {
    let products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    renderProducts(products);
  }, (error) => {
    console.error("Error listening to products:", error);
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <h3>Error loading frames</h3>
          <p>Please try again later</p>
        </div>
      `;
    }
  });
}

// Render products with filters
function renderProducts(products) {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;

  try {
    // Apply filters
    const priceFilter = document.getElementById('price-filter')?.value;
    const sizeFilter = document.getElementById('size-filter')?.value;
    const materialFilter = document.getElementById('material-filter')?.value;
    const styleFilter = document.getElementById('style-filter')?.value;
    const searchQuery = document.getElementById('search-input')?.value.toLowerCase();

    let filteredProducts = [...products];

    // Filter by search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(searchQuery) ||
        product.description?.toLowerCase().includes(searchQuery)
      );
    }

    // Filter by price range
    if (priceFilter) {
      const [min, max] = priceFilter.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }

    // Filter by size
    if (sizeFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.size?.toLowerCase().includes(sizeFilter.toLowerCase())
      );
    }

    // Filter by material
    if (materialFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.material?.toLowerCase() === materialFilter.toLowerCase()
      );
    }

    // Filter by style
    if (styleFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.style?.toLowerCase() === styleFilter.toLowerCase()
      );
    }

    // Display message if no products found
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products-message">
          <i class="fas fa-box-open"></i>
          <h3>No frames found</h3>
          <p>Try adjusting your filters</p>
        </div>
      `;
      return;
    }

    // Render products
    productsGrid.innerHTML = filteredProducts.map(product => `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${product.stock <= 0 ? `
            <div class="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          ` : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">₹${product.price.toLocaleString()}</p>
          <p class="dimensions">${product.size}</p>
          <p class="description">${product.description}</p>
          <p class="stock-status ${product.stock <= 5 ? 'low-stock' : ''}">
            ${product.stock <= 0 ? 'Out of Stock' : 
              product.stock <= 5 ? `Only ${product.stock} left in stock!` : 
              `${product.stock} in stock`}
          </p>
          <button 
            onclick="addToCart('${product.id}')" 
            class="add-to-cart" 
            id="addToCart-${product.id}"
            ${product.stock <= 0 ? 'disabled' : ''}
          >
            <span class="spinner"></span>
            <span class="button-text">
              <i class="fas fa-shopping-cart"></i>
              ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("Error rendering products:", error);
    productsGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <h3>Error loading frames</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
}

// Show toast message
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

  // Remove toast after animation
  toast.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeOut') {
      toast.remove();
    }
  });
}

// Add to cart functionality
window.addToCart = async function(productId) {
  const userId = sessionStorage.getItem('loggedInUserId');
  if (!userId) return;

  const button = document.getElementById(`addToCart-${productId}`);
  if (!button || button.disabled) return;

  // Disable button and show loading state
  button.disabled = true;
  button.classList.add('loading');

  try {
    const productRef = doc(db, "items", productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      const product = productSnap.data();
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const cart = userData.cart || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        }
        
        await updateDoc(userRef, { cart });
        updateCartCount();
        
        // Show success message
        showToast('Added to cart!', true);
      }
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showToast('Failed to add to cart. Please try again.', false);
  } finally {
    // Re-enable button and remove loading state
    button.disabled = false;
    button.classList.remove('loading');
  }
};

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (unsubscribeProducts) {
    unsubscribeProducts();
  }
});