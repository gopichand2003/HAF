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


  slidesData.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.classList.add('slide');
    slideElement.setAttribute('tabindex', '0');
    slideElement.setAttribute('role', 'button');
    slideElement.setAttribute('aria-label', `View ${slide.title}`);
    slideElement.innerHTML = `
      <img src="${slide.src}" alt="${slide.title}" loading="lazy">
    `;
    

    slideElement.addEventListener('click', (e) => {

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


    setTimeout(() => {
      isTransitioning = false;
    }, 800); 
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


  prevArrow.addEventListener('click', (e) => {
    e.preventDefault();
    prevSlide();
  });

  nextArrow.addEventListener('click', (e) => {
    e.preventDefault();
    nextSlide();
  });


  document.addEventListener('keydown', (e) => {

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
      
      
      if (diffX > diffY && diffX > 10) {
        isSwiping = true;
        e.preventDefault(); 
      }
    } else {
      e.preventDefault(); 
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
    
    
    if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold * 1.5) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  
  function openLightbox(slideElement, slideData) {
    const img = slideElement.querySelector('img');
    const lightbox = document.getElementById('lightbox');

    if (!img || !lightbox) return;

    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-img').alt = slideData.title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    
    const closeButton = lightbox.querySelector('.close-lightbox');
    if (closeButton) closeButton.focus();
  }

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    
    
    if (lightboxContent) {
      lightboxContent.style.animation = 'lightboxSlideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    setTimeout(() => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
      if (lightboxContent) {
        lightboxContent.style.animation = '';
      }
      
      
      const activeSlide = document.querySelector('.slide.active');
      if (activeSlide) activeSlide.focus();
    }, 300);
  };

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    }
  });

  
  updateSlides();

  
  slidesData.forEach((slide, index) => {
    if (index > 0) { 
      const img = new Image();
      img.src = slide.src;
    }
  });

  
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

   
  slides3DContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });


  slides3DContainer.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });


  slides3DContainer.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });
});