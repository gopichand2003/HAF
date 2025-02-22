import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc, onSnapshot, arrayUnion, Timestamp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

let currentUser = null;
let unsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth.checkAuth()) return;
  
  const userId = sessionStorage.getItem('loggedInUserId');
  if (userId) {
    setupChat(userId);
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

async function setupChat(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    currentUser = {
      id: userId,
      ...userDoc.data()
    };

    // Initialize chat collection if it doesn't exist
    if (!userDoc.data().chat) {
      await updateDoc(userRef, {
        chat: []
      });
    }

    // Mark all admin messages as read when opening the chat
    const userData = userDoc.data();
    if (userData.chat && userData.chat.length > 0) {
      const updatedChat = userData.chat.map(msg => ({
        ...msg,
        readByUser: true
      }));
      
      await updateDoc(userRef, { chat: updatedChat });
    }

    // Subscribe to chat updates
    subscribeToChat(userId);
    setupChatForm();
  }
}

function subscribeToChat(userId) {
  if (unsubscribe) {
    unsubscribe();
  }

  const userRef = doc(db, "users", userId);
  unsubscribe = onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      const userData = doc.data();
      renderMessages(userData.chat || []);
    }
  });
}

function renderMessages(messages) {
  const chatMessages = document.getElementById('chatMessages');
  
  chatMessages.innerHTML = messages.map(msg => `
    <div class="message ${msg.sender === 'user' ? 'user' : 'admin'}">
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

function setupChatForm() {
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    if (!message) return;

    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, {
        chat: arrayUnion({
          text: message,
          sender: 'user',
          timestamp: Timestamp.now(),
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userEmail: currentUser.email,
          readByAdmin: false
        })
      });

      messageInput.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
}

// Cleanup on page unload
window.addEventListener('unload', () => {
  if (unsubscribe) {
    unsubscribe();
  }
});