document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const loggedInUserId = sessionStorage.getItem('loggedInUserId');
  const adminLoggedIn = sessionStorage.getItem('adminLoggedIn');
  
  if (loggedInUserId) {
    window.location.href = 'homepage.html';
    return;
  } else if (adminLoggedIn) {
    window.location.href = 'admin-dashboard.html';
    return;
  }

  const signUpButton = document.getElementById('signUpButton');
  const signInButton = document.getElementById('signInButton');
  const signInForm = document.getElementById('signIn');
  const signUpForm = document.getElementById('signup');

  signUpButton.addEventListener('click', function(e) {
    e.preventDefault();
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    signUpForm.style.animation = 'slideUp 0.5s ease-out';
  });

  signInButton.addEventListener('click', function(e) {
    e.preventDefault();
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    signInForm.style.animation = 'slideUp 0.5s ease-out';
  });
});