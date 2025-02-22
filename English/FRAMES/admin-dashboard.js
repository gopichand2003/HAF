import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, orderBy, doc, getDoc, updateDoc, onSnapshot, arrayUnion, Timestamp, deleteDoc, addDoc, runTransaction } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

let allOrders = [];
let selectedUserId = null;
let chatUnsubscribe = null;
let editingItemId = null;
let currentFilter = 'all';
let totalUnreadMessages = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    loadOrders();
    loadItems();
    setupEventListeners();
    setupNavigation();
    loadUsers();
    updateUnreadMessageCount();
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

function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Filters
    document.getElementById('statusFilter')?.addEventListener('change', filterOrders);
    document.getElementById('searchOrders')?.addEventListener('input', filterOrders);
    document.getElementById('searchRequests')?.addEventListener('input', filterUsers);
    document.getElementById('searchItems')?.addEventListener('input', filterItems);

    // Order Status Filter Buttons
    const statusFilterBtns = document.querySelectorAll('.status-filter-btn');
    statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            statusFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            filterOrders();
        });
    });

    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const section = btn.dataset.section;
            document.getElementById('ordersSection').style.display = section === 'orders' ? 'block' : 'none';
            document.getElementById('requestsSection').style.display = section === 'requests' ? 'block' : 'none';
            document.getElementById('itemsSection').style.display = section === 'items' ? 'block' : 'none';
            
            if (section === 'requests') {
                loadUsers();
            } else if (section === 'items') {
                loadItems();
            }
        });
    });

    // Item Form
    const itemForm = document.getElementById('itemForm');
    if (itemForm) {
        itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleItemSubmit(e);
        });
    }

    // Admin Chat Form
    const adminChatForm = document.getElementById('adminChatForm');
    if (adminChatForm) {
        adminChatForm.addEventListener('submit', handleAdminReply);
    }
}

async function handleLogout() {
    try {
        await signOut(auth);
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    } catch (error) {
        console.error("Error signing out:", error);
    }
}

async function loadItems() {
    try {
        const itemsRef = collection(db, 'items');
        const snapshot = await getDocs(itemsRef);
        const itemsGrid = document.getElementById('itemsGrid');
        
        const items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });

        itemsGrid.innerHTML = items.map(item => `
            <div class="item-card">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-price">₹${item.price.toLocaleString()}</p>
                    <p class="item-stock ${item.stock < 10 ? 'low' : ''}">
                        Stock: ${item.stock} units
                    </p>
                    <div class="item-actions">
                        <button class="item-btn edit-item-btn" onclick="editItem('${item.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="item-btn delete-item-btn" onclick="deleteItem('${item.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

window.showAddItemModal = function() {
    editingItemId = null;
    document.getElementById('itemModalTitle').textContent = 'Add New Item';
    document.getElementById('itemForm').reset();
    document.getElementById('itemModal').classList.add('active');
};

window.closeItemModal = function() {
    document.getElementById('itemModal').classList.remove('active');
    document.getElementById('itemForm').reset();
    editingItemId = null;
};

window.editItem = async function(itemId) {
    try {
        const itemRef = doc(db, 'items', itemId);
        const itemDoc = await getDoc(itemRef);
        
        if (itemDoc.exists()) {
            const item = itemDoc.data();
            editingItemId = itemId;
            
            document.getElementById('itemModalTitle').textContent = 'Edit Item';
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemStock').value = item.stock;
            document.getElementById('itemImage').value = item.image;
            document.getElementById('itemDescription').value = item.description;
            document.getElementById('itemMaterial').value = item.material;
            document.getElementById('itemSize').value = item.size;
            
            document.getElementById('itemModal').classList.add('active');
        }
    } catch (error) {
        console.error("Error loading item:", error);
    }
};

window.deleteItem = async function(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
        await deleteDoc(doc(db, 'items', itemId));
        loadItems();
    } catch (error) {
        console.error("Error deleting item:", error);
    }
};

async function handleItemSubmit(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    
    const itemData = {
        name: document.getElementById('itemName').value,
        price: Number(document.getElementById('itemPrice').value),
        stock: Number(document.getElementById('itemStock').value),
        image: document.getElementById('itemImage').value,
        description: document.getElementById('itemDescription').value,
        material: document.getElementById('itemMaterial').value,
        size: document.getElementById('itemSize').value,
        timestamp: Timestamp.now()
    };

    try {
        if (editingItemId) {
            await updateDoc(doc(db, 'items', editingItemId), itemData);
        } else {
            await addDoc(collection(db, 'items'), itemData);
        }
        
        closeItemModal();
        loadItems();
        alert(editingItemId ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (error) {
        console.error("Error saving item:", error);
        alert('Error saving item. Please try again.');
    } finally {
        submitButton.disabled = false;
    }
}

function filterItems() {
    const searchQuery = document.getElementById('searchItems').value.toLowerCase();
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const visible = name.includes(searchQuery);
        card.style.display = visible ? 'block' : 'none';
    });
}

async function loadOrders() {
    try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        allOrders = [];

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            if (userData.orders) {
                userData.orders.forEach(order => {
                    allOrders.push({
                        ...order,
                        customerName: `${userData.firstName} ${userData.lastName}`,
                        customerEmail: userData.email,
                        customerPhone: userData.phone || 'Not provided',
                        userId: userDoc.id
                    });
                });
            }
        }

        // Sort orders by date (most recent first)
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filterOrders();
    } catch (error) {
        console.error("Error loading orders:", error);
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = document.getElementById('searchOrders').value.toLowerCase();
    
    let filteredOrders = allOrders;

    // Apply status filter
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // Apply shipping status filter
    if (currentFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => {
            if (currentFilter === 'pending') return !order.shipped;
            if (currentFilter === 'shipped') return order.shipped;
            return true;
        });
    }

    // Apply search filter
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order => 
            order.customerName.toLowerCase().includes(searchQuery) ||
            order.orderNumber.toLowerCase().includes(searchQuery) ||
            order.customerEmail.toLowerCase().includes(searchQuery)
        );
    }

    // Render filtered orders
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (ordersTableBody) {
        ordersTableBody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>${order.orderNumber}</td>
                <td>${order.customerName}</td>
                <td>${new Date(order.date).toLocaleDateString('en-IN')}</td>
                <td>₹${order.total.toLocaleString()}</td>
                <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <span class="shipping-status ${order.shipped ? 'shipped' : 'pending'}">
                        ${order.shipped ? 'Shipped' : 'Pending'}
                    </span>
                    ${!order.shipped ? `
                        <button class="ship-btn" onclick="markAsShipped('${order.userId}', '${order.orderNumber}')">
                            Mark as Shipped
                        </button>
                    ` : ''}
                </td>
                <td>
                    <button class="view-details-btn" onclick="viewOrderDetails('${order.orderNumber}')">
                        View Details
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

window.markAsShipped = async function(userId, orderNumber) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedOrders = userData.orders.map(order => {
                if (order.orderNumber === orderNumber) {
                    return { ...order, shipped: true };
                }
                return order;
            });
            
            await updateDoc(userRef, { orders: updatedOrders });
            loadOrders();
        }
    } catch (error) {
        console.error("Error marking order as shipped:", error);
    }
};

window.viewOrderDetails = function(orderNumber) {
    const order = allOrders.find(o => o.orderNumber === orderNumber);
    if (!order) return;

    const modalContent = document.getElementById('orderModalContent');
    modalContent.innerHTML = `
        <div class="order-info-grid">
            <div class="info-group">
                <h4>Order Information</h4>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleString('en-IN')}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Shipping Status:</strong> ${order.shipped ? 'Shipped' : 'Pending'}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                ${order.paymentId ? `<p><strong>Payment ID:</strong> ${order.paymentId}</p>` : ''}
            </div>
            <div class="info-group">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> ${order.customerName}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Phone:</strong> ${order.customerPhone}</p>
            </div>
            <div class="info-group">
                <h4>Shipping Address</h4>
                <p><strong>Recipient:</strong> ${order.address.name}</p>
                <p><strong>Phone:</strong> ${order.address.phone}</p>
                <p>${order.address.addressLine1}</p>
                ${order.address.addressLine2 ? `<p>${order.address.addressLine2}</p>` : ''}
                <p>${order.address.city}, ${order.address.state} - ${order.address.pincode}</p>
            </div>
        </div>

        <div class="order-items-list">
            <h4>Order Items</h4>
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: ₹${item.price.toLocaleString()}</p>
                    </div>
                    <div class="item-total">
                        ₹${(item.price * item.quantity).toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Tax (18%):</span>
                <span>₹${order.tax.toLocaleString()}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>₹${order.total.toLocaleString()}</span>
            </div>
        </div>
    `;

    document.getElementById('orderModal').classList.add('active');
};

window.closeOrderModal = function() {
    document.getElementById('orderModal').classList.remove('active');
};

async function loadUsers() {
    try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersList = document.getElementById('usersList');
        let usersWithChat = [];
        totalUnreadMessages = 0;

        usersSnapshot.forEach(userDoc => {
            const userData = userDoc.data();
            if (userData.chat && userData.chat.length > 0) {
                const unreadCount = userData.chat.filter(msg => 
                    msg.sender === 'user' && !msg.readByAdmin
                ).length;
                
                totalUnreadMessages += unreadCount;
                
                usersWithChat.push({
                    id: userDoc.id,
                    name: `${userData.firstName} ${userData.lastName}`,
                    email: userData.email,
                    lastMessage: userData.chat[userData.chat.length - 1],
                    unreadCount
                });
            }
        });

        // Sort by latest message and unread count
        usersWithChat.sort((a, b) => {
            if (a.unreadCount !== b.unreadCount) {
                return b.unreadCount - a.unreadCount;
            }
            return b.lastMessage.timestamp.seconds - a.lastMessage.timestamp.seconds;
        });

        // Update users list
        if (usersList) {
            usersList.innerHTML = usersWithChat.map(user => `
                <div class="user-item ${user.unreadCount > 0 ? 'unread' : ''} ${user.id === selectedUserId ? 'active' : ''}"
                     onclick="selectUser('${user.id}')">
                    <div class="user-info">
                        <h4>
                            ${user.name}
                            ${user.unreadCount > 0 ? `<span class="unread-badge">${user.unreadCount}</span>` : ''}
                        </h4>
                        <p>${user.email}</p>
                        <div class="last-message">
                            <p>${user.lastMessage.text.substring(0, 50)}${user.lastMessage.text.length > 50 ? '...' : ''}</p>
                            <span>${new Date(user.lastMessage.timestamp.seconds * 1000).toLocaleString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        updateUnreadMessageCount();
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

window.selectUser = async function(userId) {
    selectedUserId = userId;
    
    // Update UI to show active user
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(userId)) {
            item.classList.add('active');
        }
    });

    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const chatHeader = document.getElementById('chatHeader');
            const chatMessages = document.getElementById('chatMessages');
            const messageInput = document.getElementById('adminMessageInput');
            const sendButton = document.querySelector('#adminChatForm button');
            
            // Update chat header
            chatHeader.innerHTML = `
                <h4>${userData.firstName} ${userData.lastName}</h4>
                <p>${userData.email}</p>
            `;

            // Enable message input
            messageInput.disabled = false;
            sendButton.disabled = false;

            // Mark messages as read
            const updatedChat = userData.chat.map(msg => ({
                ...msg,
                readByAdmin: msg.sender === 'user' ? true : msg.readByAdmin
            }));
            
            await updateDoc(userRef, { chat: updatedChat });

            // Subscribe to chat updates
            if (chatUnsubscribe) {
                chatUnsubscribe();
            }

            chatUnsubscribe = onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    const updatedUserData = doc.data();
                    renderMessages(updatedUserData.chat || []);
                }
            });

            // Initial render
            renderMessages(userData.chat || []);
        }
    } catch (error) {
        console.error("Error selecting user:", error);
    }
};

function renderMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    chatMessages.innerHTML = messages.map(msg => `
        <div class="chat-message ${msg.sender}">
            <div class="message-content">${msg.text}</div>
            <div class="message-time">
                ${new Date(msg.timestamp.seconds * 1000).toLocaleString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    day: 'numeric',
                    month: 'short'
                })}
            </div>
        </div>
    `).join('');

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleAdminReply(e) {
    e.preventDefault();
    
    if (!selectedUserId) return;

    const messageInput = document.getElementById('adminMessageInput');
    const message = messageInput.value.trim();
    if (!message) return;

    try {
        const userRef = doc(db, "users", selectedUserId);
        await updateDoc(userRef, {
            chat: arrayUnion({
                text: message,
                sender: 'admin',
                timestamp: Timestamp.now(),
                readByUser: false
            })
        });

        messageInput.value = '';
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

function updateUnreadMessageCount() {
    const requestsBtn = document.querySelector('.nav-btn[data-section="requests"]');
    if (requestsBtn) {
        const countSpan = requestsBtn.querySelector('.request-count') || document.createElement('span');
        countSpan.className = 'request-count';
        
        if (totalUnreadMessages > 0) {
            countSpan.textContent = totalUnreadMessages;
            countSpan.style.display = 'block';
            if (!requestsBtn.contains(countSpan)) {
                requestsBtn.appendChild(countSpan);
            }
        } else {
            countSpan.style.display = 'none';
        }
    }
}

function filterUsers() {
    const searchQuery = document.getElementById('searchRequests').value.toLowerCase();
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const email = item.querySelector('p').textContent.toLowerCase();
        const visible = name.includes(searchQuery) || email.includes(searchQuery);
        item.style.display = visible ? 'block' : 'none';
    });
}

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (chatUnsubscribe) {
        chatUnsubscribe();
    }
});