document.addEventListener('DOMContentLoaded', () => {
  // Search functionality
  const songSearch = document.getElementById('songSearch');
  const messageSearch = document.getElementById('messageSearch');
  const songCards = document.querySelectorAll('.songs-section .video-card');
  const messageCards = document.querySelectorAll('.messages-section .video-card');

  // Initialize YouTube iframes with thumbnails first
  const iframes = document.querySelectorAll('iframe[data-video-id]');
  iframes.forEach(iframe => {
    const videoId = iframe.getAttribute('data-video-id');
    iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1&enablejsapi=1`;
  });

  // Track currently playing video
  let currentlyPlaying = null;

  // Function to create YouTube player with API
  function createYouTubePlayer(iframe) {
    const videoId = iframe.getAttribute('data-video-id');
    return new YT.Player(iframe, {
      videoId: videoId,
      playerVars: {
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
        enablejsapi: 1
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // Load YouTube API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Initialize players object to store all YouTube players
  const players = {};

  // YouTube API callback
  window.onYouTubeIframeAPIReady = function() {
    // Initialize YouTube iframes
    document.querySelectorAll('iframe[data-video-id]').forEach(iframe => {
      const videoId = iframe.getAttribute('data-video-id');
      const player = createYouTubePlayer(iframe);
      players[videoId] = player;
    });
  };

  // Function to stop currently playing video
  function stopCurrentVideo() {
    if (currentlyPlaying) {
      const videoId = currentlyPlaying.getAttribute('data-video-id');
      if (players[videoId]) {
        players[videoId].stopVideo();
      }
      currentlyPlaying = null;
    }
  }

  // Handle player state changes
  function onPlayerStateChange(event) {
    // If a video starts playing
    if (event.data === YT.PlayerState.PLAYING) {
      const currentIframe = event.target.getIframe();
      const currentSection = currentIframe.closest('.video-section');
      
      // Check if the section is collapsed
      if (currentSection && currentSection.classList.contains('collapsed')) {
        event.target.stopVideo();
        return;
      }
      
      // If it's not the currently playing video, stop all others
      if (currentlyPlaying && currentlyPlaying !== currentIframe) {
        stopCurrentVideo();
      }
      
      currentlyPlaying = currentIframe;
    }
  }

  // Section dropdown functionality
  setTimeout(() => {
    const sections = document.querySelectorAll('.video-section');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 120;
    
    if (sections.length > 0) {
      sections.forEach((section, index) => {
        const sectionHeader = section.querySelector('.section-header');
        
        if (sectionHeader) {
          sectionHeader.addEventListener('click', (e) => {
            e.preventDefault();
            const isCollapsed = section.classList.contains('collapsed');
            
            // Stop any playing videos before collapsing sections
            stopCurrentVideo();
            
            // Close all sections
            sections.forEach(s => {
              s.classList.add('collapsed');
            });
            
            // Toggle current section
            if (isCollapsed) {
              section.classList.remove('collapsed');
              
              // Apply scrolling animation for all sections except the first one
              if (index >= 1) {
                const sectionRect = section.getBoundingClientRect();
                if (sectionRect.top < headerHeight) {
                  window.scrollTo({
                    top: window.scrollY + sectionRect.top - headerHeight - 20,
                    behavior: 'smooth'
                  });
                }
              }
            }
          });
        }
      });
      
      // All sections start collapsed by default
      sections.forEach(s => {
        s.classList.add('collapsed');
      });
    }
  }, 100);

  // Add click handlers to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.closest('.video-section');
      
      // Don't play video if section is collapsed
      if (section && section.classList.contains('collapsed')) {
        return;
      }
      
      const iframe = card.querySelector('iframe');
      const videoId = iframe.getAttribute('data-video-id');
      const player = players[videoId];

      if (!player) return;

      if (currentlyPlaying === iframe) {
        // If clicking the same video, stop it
        player.stopVideo();
        currentlyPlaying = null;
      } else {
        // Stop current video if any
        stopCurrentVideo();

        // Play new video
        player.playVideo();
        currentlyPlaying = iframe;
      }
    });
  });

  // Stop video when changing categories
  document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
      stopCurrentVideo();
    });
  });

  function filterCards(searchInput, cards) {
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false;

    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const singer = card.querySelector('.singer')?.textContent.toLowerCase() || '';
      const speaker = card.querySelector('.speaker')?.textContent.toLowerCase() || '';
      const isVisible = title.includes(searchTerm) || 
                       singer.includes(searchTerm) || 
                       speaker.includes(searchTerm);
      
      // Stop video if hiding a card
      if (!isVisible && currentlyPlaying && card.contains(currentlyPlaying)) {
        stopCurrentVideo();
      }
      
      card.style.display = isVisible ? 'block' : 'none';
      if (isVisible) hasResults = true;
    });

    const section = searchInput.closest('.video-section');
    const noResults = section.querySelector('.no-results') || createNoResultsElement(section);
    noResults.classList.toggle('show', !hasResults);
  }

  function createNoResultsElement(section) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.textContent = 'No videos found matching your search';
    section.querySelector('.video-grid').after(noResults);
    return noResults;
  }

  if (songSearch) {
    songSearch.addEventListener('input', () => filterCards(songSearch, songCards));
  }

  if (messageSearch) {
    messageSearch.addEventListener('input', () => filterCards(messageSearch, messageCards));
  }

  // Category filtering
  const categoryButtons = document.querySelectorAll('.category-btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.closest('.video-section');
      section.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      button.classList.add('active');
      const selectedCategory = button.dataset.category;
      
      const videos = section.querySelectorAll('.video-card');
      let hasResults = false;

      videos.forEach(video => {
        const categories = video.dataset.category.split(' ');
        const isVisible = selectedCategory === 'all-songs' || 
                         selectedCategory === 'all-messages' || 
                         categories.includes(selectedCategory);
        
        // Stop video if hiding a card
        if (!isVisible && currentlyPlaying && video.contains(currentlyPlaying)) {
          stopCurrentVideo();
        }
        
        video.style.display = isVisible ? 'block' : 'none';
        if (isVisible) {
          video.style.animation = 'fadeIn 0.5s ease forwards';
          hasResults = true;
        }
      });

      const noResults = section.querySelector('.no-results') || createNoResultsElement(section);
      noResults.classList.toggle('show', !hasResults);
    });
  });

  // Handle page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCurrentVideo();
    }
  });

  // Stop videos when section is collapsed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('collapsed')) {
        const video = mutation.target.querySelector('iframe');
        if (video && currentlyPlaying === video) {
          stopCurrentVideo();
        }
      }
    });
  });

  // Observe all video sections for class changes
  document.querySelectorAll('.video-section').forEach((section) => {
    observer.observe(section, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
});