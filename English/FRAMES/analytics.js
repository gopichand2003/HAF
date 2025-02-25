import { db, auth } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Check admin authentication
    if (!sessionStorage.getItem('adminLoggedIn')) {
        window.location.href = 'admin-login.html';
        return;
    }

    loadAnalytics();
    setupNavigation();
    setupEventListeners();
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
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            sessionStorage.removeItem('adminLoggedIn');
            window.location.href = 'admin-login.html';
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });

    // Export button
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
}

async function loadAnalytics() {
    try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const users = [];
        let totalOrders = 0;
        let totalRevenue = 0;
        let activeUsers = 0;

        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            // Only include users who haven't been deleted
            if (!userData.deleted) {
                const userOrders = userData.orders || [];
                const userRevenue = userOrders.reduce((sum, order) => sum + order.total, 0);
                
                users.push({
                    id: doc.id,
                    name: `${userData.firstName} ${userData.lastName}`,
                    email: userData.email,
                    phone: userData.phone || '-',
                    orderCount: userOrders.length,
                    orders: userOrders
                });

                totalOrders += userOrders.length;
                totalRevenue += userRevenue;
                if (userOrders.length > 0) {
                    activeUsers++;
                }
            }
        });

        // Update statistics
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;

        // Sort users by name
        users.sort((a, b) => a.name.localeCompare(b.name));

        // Update users table
        const usersTableBody = document.querySelector('#usersTable tbody');
        if (usersTableBody) {
            usersTableBody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.orderCount}</td>
                </tr>
            `).join('');
        }

        // Update orders table
        const ordersTableBody = document.querySelector('#ordersTable tbody');
        if (ordersTableBody) {
            const allOrders = users.flatMap(user => 
                user.orders.map(order => ({
                    ...order,
                    customerName: user.name,
                    customerEmail: user.email
                }))
            );

            allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

            ordersTableBody.innerHTML = allOrders.map(order => `
                <tr>
                    <td>${order.orderNumber}</td>
                    <td>${order.customerName}</td>
                    <td>${new Date(order.date).toLocaleDateString('en-IN')}</td>
                    <td><span class="order-status status-${order.status.toLowerCase()}">${order.status}</span></td>
                    <td>₹${order.total.toLocaleString()}</td>
                </tr>
            `).join('');
        }

    } catch (error) {
        console.error("Error loading analytics:", error);
        alert('Error loading analytics data. Please try refreshing the page.');
    }
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    
    const usersWS = XLSX.utils.table_to_sheet(document.getElementById('usersTable'));
    XLSX.utils.book_append_sheet(wb, usersWS, "Users");
    
    const ordersWS = XLSX.utils.table_to_sheet(document.getElementById('ordersTable'));
    XLSX.utils.book_append_sheet(wb, ordersWS, "Orders");
    
    XLSX.writeFile(wb, "HAF_Analytics.xlsx");
}