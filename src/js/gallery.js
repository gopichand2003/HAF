document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxCategory = document.getElementById('lightbox-category');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  const galleryData = [
    {
      src: 'https://images.pexels.com/photos/8468/guitar-music-musician-musical-instrument.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Worship Through Music',
      // description: 'Hearts united in melodious praise, lifting our voices to the heavens in perfect harmony',
      category: 'worship'
    },
    {
      src: 'https://images.pexels.com/photos/8468633/pexels-photo-8468633.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Community Prayer',
      description: 'Gathering in unity, seeking divine guidance through collective prayer and meditation',
      category: 'community'
    },
    {
      src: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Youth Ministry',
      description: 'Empowering the next generation with faith, hope, and divine purpose',
      category: 'community'
    },
    {
      src: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Baptism Ceremony',
      description: 'Sacred moments of spiritual rebirth and commitment to Christ',
      category: 'milestones'
    },
    {
      src: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Fellowship Gathering',
      description: 'Building lasting bonds through shared faith and Christian brotherhood',
      category: 'community'
    },
    {
      src: 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Christmas Celebration',
      description: 'Celebrating the birth of our Savior with joy, love, and thanksgiving',
      category: 'events'
    },
    {
      src: 'https://images.pexels.com/photos/1708988/pexels-photo-1708988.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Community Outreach',
      description: 'Serving our neighbors with Christ\'s love through acts of compassion',
      category: 'outreach'
    },
    {
      src: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sunday Service',
      description: 'Weekly gathering for worship, teaching, and spiritual nourishment',
      category: 'worship'
    },
    {
      src: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Founding Anniversary',
      description: 'Celebrating 25 years of faithful service and divine blessings',
      category: 'milestones'
    },
    {
      src: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Children\'s Ministry',
      description: 'Nurturing young hearts with biblical truths and Christ\'s love',
      category: 'community'
    },
    {
      src: 'https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Easter Sunrise Service',
      description: 'Welcoming the risen Savior with joyful hearts at dawn',
      category: 'events'
    },
    {
      src: 'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Food Distribution',
      description: 'Feeding the hungry and sharing God\'s abundant provision',
      category: 'outreach'
    },
    {
      src: 'https://images.pexels.com/photos/8815965/pexels-photo-8815965.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Praise & Worship Night',
      description: 'An evening devoted to glorifying God through song and dance',
      category: 'worship'
    },
    {
      src: 'https://images.pexels.com/photos/3860307/pexels-photo-3860307.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'New Building Dedication',
      description: 'Consecrating our new sanctuary to the Lord\'s service',
      category: 'milestones'
    },
    {
      src: 'https://images.pexels.com/photos/5206040/pexels-photo-5206040.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Family Camp',
      description: 'Strengthening family bonds through faith-centered activities',
      category: 'events'
    },
    {
      src: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Street Ministry',
      description: 'Taking the Gospel to the streets and sharing hope with the lost',
      category: 'outreach'
    }
  ];

  let currentImageIndex = 0;
  let currentFilter = 'all';
  let filteredGallery = [...galleryData];

  function createGalleryItem(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('gallery-item');
    galleryItem.dataset.category = item.category;
    galleryItem.dataset.index = index;
    galleryItem.style.animationDelay = `${index * 0.05}s`;

    galleryItem.innerHTML = `
      <div class="gallery-item-image">
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-description">${item.description}</div>
        </div>
        <span class="gallery-item-category">${getCategoryLabel(item.category)}</span>
      </div>
    `;

    galleryItem.addEventListener('click', () => {
      openLightbox(index);
    });

    return galleryItem;
  }

  function getCategoryLabel(category) {
    const labels = {
      worship: 'Worship',
      milestones: 'Milestones',
      community: 'Community',
      events: 'Events',
      outreach: 'Outreach'
    };
    return labels[category] || category;
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
      item.offsetHeight;
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
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;
    lightboxCategory.textContent = getCategoryLabel(item.category);
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
    if (e.target === lightbox) {
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

  galleryData.forEach((item, index) => {
    if (index > 0) {
      const img = new Image();
      img.src = item.src;
    }
  });
});
