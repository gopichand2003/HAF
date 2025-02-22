import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import config from './config.js';

const firebaseConfig = config.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function showMessage(message, isSuccess = false) {
    const messageDiv = document.getElementById('resetMessage');
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    messageDiv.style.backgroundColor = isSuccess ? 'var(--auth-success)' : 'var(--auth-error)';
    
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const resetForm = document.getElementById('submitReset');
resetForm.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            showMessage('Password reset email sent successfully!', true);
            // Clear the form
            document.getElementById('resetEmail').value = '';
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage = 'An error occurred. Please try again.';
            
            switch(errorCode) {
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email address.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
            }
            
            showMessage(errorMessage);
        });
});