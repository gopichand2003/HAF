// 3D Slideshow Gallery JavaScript - Fixed version
document.addEventListener('DOMContentLoaded', () => {
  const slideshowContainer = document.querySelector('.slideshow-container');
  const slides3DContainer = document.querySelector('.slides-3d-container');
  const timeline = document.querySelector('.timeline');
  const prevArrow = document.querySelector('.prev-arrow');
  const nextArrow = document.querySelector('.next-arrow');

  const slidesData = [
    { 
      src: 'https://images.pexels.com/photos/8468/guitar-music-musician-musical-instrument.jpg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Worship Through Music',
      caption: 'Hearts united in melodious praise, lifting our voices to the heavens in perfect harmony'
    },
    { 
      src: 'https://images.pexels.com/photos/8468633/pexels-photo-8468633.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Community Prayer',
      caption: 'Gathering in unity, seeking divine guidance through collective prayer and meditation'
    },
    { 
      src: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Youth Ministry',
      caption: 'Empowering the next generation with faith, hope, and divine purpose'
    },
    { 
      src: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Baptism Ceremony',
      caption: 'Sacred moments of spiritual rebirth and commitment to Christ'
    },
    { 
      src: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Fellowship Gathering',
      caption: 'Building lasting bonds through shared faith and Christian brotherhood'
    },
    { 
      src: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Christmas Celebration',
      caption: 'Celebrating the birth of our Savior with joy, love, and thanksgiving'
    },
    { 
      src: 'https://images.pexels.com/photos/1708988/pexels-photo-1708988.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Community Outreach',
      caption: 'Serving our neighbors with Christ\'s love through acts of compassion'
    },
    { 
      src: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 
      title: 'Sunday Service',
      caption: 'Weekly gathering for worship, teaching, and spiritual nourishment'
    }
  ];

  let currentIndex = 0;
  let isTransitioning = false;
  let slides = [];
  let dots = [];

  // Create slides and timeline dots
  slidesData.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.classList.add('slide');
    slideElement.setAttribute('tabindex', '0');
    slideElement.setAttribute('role', 'button');
    slideElement.setAttribute('aria-label', `View ${slide.title}`);
    slideElement.innerHTML = `
      <img src="${slide.src}" alt="${slide.title}" loading="lazy">
    `;
    
    // Add click event listener once during creation
    slideElement.addEventListener('click', (e) => {
      // Only handle click if this is the active slide
      if (slideElement.classList.contains('active') && !isTransitioning) {
        openLightbox(slideElement, slide);
      }
    });
    
    slideElement.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && slideElement.classList.contains('active') && !isTransitioning) {
        e.preventDefault();
        openLightbox(slideElement, slide);
      }
    });
    
    slides3DContainer.appendChild(slideElement);

    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}: ${slide.title}`);
    if (index === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => goToSlide(index));
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToSlide(index);
      }
    });
    
    timeline.appendChild(dot);
  });

  // Get references to created elements
  slides = document.querySelectorAll('.slide');
  dots = document.querySelectorAll('.dot');

  function updateSlides() {
    if (isTransitioning) return;
    
    isTransitioning = true;

    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'next', 'prev');
      slide.setAttribute('aria-hidden', 'true');
      
      if (index === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else if (index === (currentIndex + 1) % slidesData.length) {
        slide.classList.add('next');
      } else if (index === (currentIndex - 1 + slidesData.length) % slidesData.length) {
        slide.classList.add('prev');
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.setAttribute('aria-selected', index === currentIndex);
    });

    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioning = false;
    }, 800); // Match the CSS transition duration
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    currentIndex = (index + slidesData.length) % slidesData.length;
    updateSlides();
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentIndex = (currentIndex + 1) % slidesData.length;
    updateSlides();
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + slidesData.length) % slidesData.length;
    updateSlides();
  }

  // Event listeners for manual navigation
  prevArrow.addEventListener('click', (e) => {
    e.preventDefault();
    prevSlide();
  });

  nextArrow.addEventListener('click', (e) => {
    e.preventDefault();
    nextSlide();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only handle if not in lightbox and not transitioning
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) return;
    if (isTransitioning) return;
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  });

  // Arrow key navigation for arrows
  prevArrow.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isTransitioning) prevSlide();
    }
  });

  nextArrow.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isTransitioning) nextSlide();
    }
  });

  // Touch/swipe support with improved handling
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  let isSwiping = false;

  slides3DContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    isSwiping = false;
  }, { passive: true });

  slides3DContainer.addEventListener('touchmove', (e) => {
    if (!isSwiping) {
      const currentX = e.changedTouches[0].screenX;
      const currentY = e.changedTouches[0].screenY;
      const diffX = Math.abs(currentX - touchStartX);
      const diffY = Math.abs(currentY - touchStartY);
      
      // Determine if this is a horizontal swipe
      if (diffX > diffY && diffX > 10) {
        isSwiping = true;
        e.preventDefault(); // Prevent scrolling only for horizontal swipes
      }
    } else {
      e.preventDefault(); // Continue preventing scroll during swipe
    }
  }, { passive: false });

  slides3DContainer.addEventListener('touchend', (e) => {
    if (isSwiping) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }
    isSwiping = false;
  }, { passive: true });

  function handleSwipe() {
    if (isTransitioning) return;
    
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only handle horizontal swipes
    if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold * 1.5) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Enhanced Lightbox functionality
  function openLightbox(slideElement, slideData) {
    const img = slideElement.querySelector('img');
    const lightbox = document.getElementById('lightbox');

    if (!img || !lightbox) return;

    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-img').alt = slideData.title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const closeButton = lightbox.querySelector('.close-lightbox');
    if (closeButton) closeButton.focus();
  }

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    
    // Add exit animation
    if (lightboxContent) {
      lightboxContent.style.animation = 'lightboxSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    setTimeout(() => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
      if (lightboxContent) {
        lightboxContent.style.animation = '';
      }
      
      // Return focus to the active slide
      const activeSlide = document.querySelector('.slide.active');
      if (activeSlide) activeSlide.focus();
    }, 300);
  };

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    }
  });

  // Initialize
  updateSlides();

  // Preload images for better performance
  slidesData.forEach((slide, index) => {
    if (index > 0) { // Skip first image as it's already loaded
      const img = new Image();
      img.src = slide.src;
    }
  });

  // Add exit animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes lightboxSlideOut {
      from {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      to {
        transform: scale(0.8) translateY(50px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Prevent context menu on slides to avoid accidental interactions
  slides3DContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Prevent drag on images
  slides3DContainer.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Prevent selection on slides
  slides3DContainer.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
});