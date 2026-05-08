  document.addEventListener('DOMContentLoaded', () => {

  const galleryGrid = document.getElementById('galleryGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  // Gallery Data
  const galleryData = [
    { src: 'https://i.ibb.co/nqV5jZDd/1.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/zVwpyC1j/17.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/7NKLYx2h/16.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/9mB1wZPW/8.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/d034gP99/18.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/RGQtjndy/13.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/35NC71TD/14.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/spRcvvx1/19.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/Ndqq8z3f/20.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/7NtfTSKx/21.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/C3sFFcgB/22.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/sp58mfH0/23.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/d0cJhpC9/24.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/S4xH572Q/5.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/LX6zFw6Y/10.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/Q3JTJTF2/11.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/bqdnV08/6.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/nHJQFPw/12.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/dshpk190/15.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/yF6sFdmh/7.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/zVJFBBqz/9.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/Jwz12DGM/4.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/gM3FxSDm/2.webp', category: 'foundation' },
    { src: 'https://i.ibb.co/ymLnvY3P/3.webp', category: 'foundation' }
  ];

  let currentImageIndex = 0;
  let currentFilter = 'all';
  let filteredGallery = [...galleryData];

  // Create Gallery Item
  function createGalleryItem(item, index) {

    const galleryItem = document.createElement('div');

    galleryItem.className = 'gallery-item';
    galleryItem.dataset.category = item.category;
    galleryItem.dataset.index = index;

    galleryItem.innerHTML = `
      <div class="gallery-item-image">
        <img
          src="${item.src}"
          alt="Church Construction Progress"
          loading="${index < 4 ? 'eager' : 'lazy'}"
          decoding="async"
          width="400"
          height="300"
        >
      </div>
    `;

    galleryItem.addEventListener('click', () => {
      openLightbox(index);
    });

    return galleryItem;
  }

  // Render Gallery Optimized
  function renderGallery() {

    galleryGrid.innerHTML = '';

    const fragment = document.createDocumentFragment();

    filteredGallery.forEach((item, index) => {
      const galleryItem = createGalleryItem(item, index);
      fragment.appendChild(galleryItem);
    });

    galleryGrid.appendChild(fragment);
  }

  // Filter Gallery
  function filterGallery(category) {

    currentFilter = category;

    if (category === 'all') {
      filteredGallery = [...galleryData];
    } else {
      filteredGallery = galleryData.filter(item => item.category === category);
    }

    renderGallery();
  }

  // Filter Button Events
  filterButtons.forEach(button => {

    button.addEventListener('click', () => {

      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      const filter = button.dataset.filter;

      filterGallery(filter);
    });
  });

  // Open Lightbox
  function openLightbox(index) {

    currentImageIndex = index;

    updateLightboxContent();

    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
  }

  // Close Lightbox
  function closeLightbox() {

    lightbox.classList.remove('active');

    document.body.style.overflow = 'auto';
  }

  // Update Lightbox Image
  function updateLightboxContent() {

    const item = filteredGallery[currentImageIndex];

    lightboxImg.src = item.src;
  }

  // Next Image
  function showNextImage() {

    currentImageIndex =
      (currentImageIndex + 1) % filteredGallery.length;

    updateLightboxContent();
  }

  // Previous Image
  function showPrevImage() {

    currentImageIndex =
      (currentImageIndex - 1 + filteredGallery.length) %
      filteredGallery.length;

    updateLightboxContent();
  }

  // Close Button
  closeBtn.addEventListener('click', (e) => {

    e.stopPropagation();

    closeLightbox();
  });

  // Close On Background Click
  lightbox.addEventListener('click', (e) => {

    if (
      e.target === lightbox ||
      e.target.classList.contains('lightbox-image-container')
    ) {
      closeLightbox();
    }
  });

  // Prev Button
  prevBtn.addEventListener('click', (e) => {

    e.stopPropagation();

    showPrevImage();
  });

  // Next Button
  nextBtn.addEventListener('click', (e) => {

    e.stopPropagation();

    showNextImage();
  });

  // Keyboard Controls
  document.addEventListener('keydown', (e) => {

    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {

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

  // Swipe Support
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

  // Initial Render
  renderGallery();

});
