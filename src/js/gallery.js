document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Simply add your image paths here. Everything is categorized as 'foundation'
  const galleryData = [
    { src: 'HAF/src/images/gallery/1.png', category: 'foundation' },
    { src: '/src/images/gallery/2.jpg', category: 'foundation' },
    { src: '../src/images/gallery/3.jpg', category: 'foundation' },
    { src: '../src/images/gallery/4.jpg', category: 'foundation' },
    { src: '../src/images/gallery/5.jpg', category: 'foundation' },
    { src: '../src/images/gallery/6.jpg', category: 'foundation' },
    { src: '../src/images/gallery/7.jpg', category: 'foundation' },
    { src: '../src/images/gallery/8.jpg', category: 'foundation' },
    { src: '../src/images/gallery/9.jpg', category: 'foundation' },
    { src: '../src/images/gallery/10.jpg', category: 'foundation' },
    { src: '../src/images/gallery/11.jpg', category: 'foundation' },
    { src: '../src/images/gallery/12.jpg', category: 'foundation' },
    { src: '../src/images/gallery/13.jpg', category: 'foundation' },
    { src: '../src/images/gallery/14.jpg', category: 'foundation' },
    { src: '../src/images/gallery/15.jpg', category: 'foundation' },
    { src: '../src/images/gallery/16.jpg', category: 'foundation' },
    { src: '../src/images/gallery/17.jpg', category: 'foundation' },
    { src: '../src/images/gallery/18.jpg', category: 'foundation' },
    { src: '../src/images/gallery/19.jpg', category: 'foundation' },
    { src: '../src/images/gallery/20.jpg', category: 'foundation' },
    { src: '../src/images/gallery/21.jpg', category: 'foundation' },
    { src: '../src/images/gallery/22.jpg', category: 'foundation' },
    { src: '../src/images/gallery/23.jpg', category: 'foundation' },
    { src: '../src/images/gallery/24.jpg', category: 'foundation' }
  ];

  let currentImageIndex = 0;
  let currentFilter = 'all';
  let filteredGallery = [...galleryData];

  // Creates pure image items without text overlays
  function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.dataset.category = item.category;
    galleryItem.dataset.index = index;
    galleryItem.style.animationDelay = `${index * 0.05}s`;

    galleryItem.innerHTML = `
      <div class="gallery-item-image">
        <img src="${item.src}" alt="Church Construction Progress" loading="lazy">
      </div>
    `;

    galleryItem.addEventListener('click', () => {
      openLightbox(index);
    });

    return galleryItem;
  }

  function renderGallery() {
    galleryGrid.innerHTML = '';
    filteredGallery.forEach((item, index) => {
      const galleryItem = createGalleryItem(item, index);
      galleryGrid.appendChild(galleryItem);
    });
  }

  function filterGallery(category) {
    currentFilter = category;

    if (category === 'all') {
      filteredGallery = [...galleryData];
    } else {
      filteredGallery = galleryData.filter(item => item.category === category);
    }

    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.style.animation = 'none';
      item.offsetHeight; // trigger reflow
      item.style.animation = null;
    });

    renderGallery();
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;
      filterGallery(filter);
    });
  });

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function updateLightboxContent() {
    const item = filteredGallery[currentImageIndex];
    lightboxImg.src = item.src;
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredGallery.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredGallery.length) % filteredGallery.length;
    updateLightboxContent();
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-image-container')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPrevImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showNextImage();
      } else {
        showPrevImage();
      }
    }
  }

  renderGallery();

  // Preload images for smoother lightbox transitions
  galleryData.forEach((item, index) => {
    if (index > 0) {
      const img = new Image();
      img.src = item.src;
    }
  });
});
