import { db, auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let unsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupNavigation();
    setupHeaderScroll();
});

function setupNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navClose = document.querySelector('.nav-close');
    const mainNav = document.querySelector('.main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (menuToggle && navClose && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('active');
        });

        navClose.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
            }
        });
    }
}

function checkAuth() {
    const loggedInUserId = sessionStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
        window.location.href = 'index.html';
        return;
    }

    const docRef = doc(db, "users", loggedInUserId);
    
    // Set up real-time listener for user data
    unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('loggedUserFName').innerText = userData.firstName;
            document.getElementById('loggedUserLName').innerText = userData.lastName;
            
            // Check for unread messages
            const helpButton = document.getElementById('helpButton');
            const unreadCount = document.querySelector('.floating-help-btn .unread-count');
            
            if (userData.chat && userData.chat.length > 0) {
                const unreadMessages = userData.chat.filter(msg => 
                    msg.sender === 'admin' && !msg.readByUser
                ).length;
                
                if (unreadMessages > 0) {
                    helpButton.style.display = 'flex';
                    unreadCount.textContent = unreadMessages;

                    // Add click handler to mark messages as read when clicking the help button
                    helpButton.onclick = async (e) => {
                        const updatedChat = userData.chat.map(msg => ({
                            ...msg,
                            readByUser: true
                        }));
                        
                        try {
                            await updateDoc(docRef, { chat: updatedChat });
                            helpButton.style.display = 'none';
                        } catch (error) {
                            console.error('Error marking messages as read:', error);
                        }
                    };
                } else {
                    helpButton.style.display = 'none';
                }
            } else {
                helpButton.style.display = 'none';
            }
        } else {
            console.log("No document found matching id");
            sessionStorage.removeItem('loggedInUserId');
            window.location.href = 'index.html';
        }
    });
}

function setupHeaderScroll() {
    let lastScroll = 0;
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('hidden')) {
            header.classList.add('hidden');
        } else if (currentScroll < lastScroll && header.classList.contains('hidden')) {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });
}

// Setup logout button event listener
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            if (unsubscribe) {
                unsubscribe();
            }
            sessionStorage.removeItem('loggedInUserId');
            signOut(auth)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error('Error signing out:', error);
                });
        });
    }
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (unsubscribe) {
        unsubscribe();
    }
});