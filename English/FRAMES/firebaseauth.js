import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

function showMessage(message, divId, isSuccess = false) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    messageDiv.style.backgroundColor = isSuccess ? 'var(--auth-success)' : 'var(--auth-error)';
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Email/Password Sign Up
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;
    const mobileNumber = document.getElementById('mobileNumber').value;

    // Validate mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
        showMessage('Please enter a valid 10-digit mobile number', 'signUpMessage');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: mobileNumber
            };
            showMessage('Account Created Successfully', 'signUpMessage', true);
            const docRef = doc(db, "users", user.uid);
            return setDoc(docRef, userData)
                .then(() => {
                    setTimeout(() => {
                        sessionStorage.setItem('loggedInUserId', user.uid);
                        window.location.href = 'homepage.html';
                    }, 1000);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode == 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists', 'signUpMessage');
            } else if (errorCode === 'auth/invalid-email') {
                showMessage('Please enter a valid email address', 'signUpMessage');
            } else if (errorCode === 'auth/weak-password') {
                showMessage('Password should be at least 6 characters', 'signUpMessage');
            } else {
                showMessage('Unable to create account. Please try again.', 'signUpMessage');
            }
        });
});

// Email/Password Sign In
const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            showMessage('Login successful', 'signInMessage', true);
            setTimeout(() => {
                sessionStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'homepage.html';
            }, 1000);
        })
        .catch((error) => {
            const errorCode = error.code;
            let errorMessage;
            
            switch(errorCode) {
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account exists with this email. Please sign up first.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-login-credentials':
                    errorMessage = 'No account exists with this email. Please sign up first.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid credentials. Please check your email and password.';
                    break;
                case 'auth/missing-password':
                    errorMessage = 'Please enter your password';
                    break;
                default:
                    errorMessage = 'Login failed. Please try again.';
            }
            
            showMessage(errorMessage, 'signInMessage');
        });
});

// Google Authentication
const googleProvider = new GoogleAuthProvider();

// Google Sign In
const googleSignIn = document.getElementById('googleSignIn');
googleSignIn.addEventListener('click', () => {
    handleGoogleAuth('signInMessage');
});

// Google Sign Up
const googleSignUp = document.getElementById('googleSignUp');
googleSignUp.addEventListener('click', () => {
    handleGoogleAuth('signUpMessage');
});

async function handleGoogleAuth(messageDiv) {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if user exists in Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            // New user - create profile
            const nameParts = user.displayName ? user.displayName.split(' ') : ['User', ''];
            const userData = {
                email: user.email,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                photoURL: user.photoURL || null
            };
            
            // For Google sign-up, we'll prompt for mobile number after successful authentication
            await setDoc(userRef, userData);
            showMessage('Account Created Successfully', messageDiv, true);
            
            // Store user ID and redirect to a page to collect mobile number
            sessionStorage.setItem('loggedInUserId', user.uid);
            sessionStorage.setItem('needsMobileNumber', 'true');
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            showMessage('Login successful', messageDiv, true);
            
            setTimeout(() => {
                sessionStorage.setItem('loggedInUserId', user.uid);
                window.location.href = 'homepage.html';
            }, 1000);
        }
    } catch (error) {
        console.error("Google auth error:", error);
        let errorMessage = 'Authentication failed. Please try again.';
        
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign in was cancelled.';
        } else if (error.code === 'auth/popup-blocked') {
            errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups for this site.';
        }
        
        showMessage(errorMessage, messageDiv);
    }
}