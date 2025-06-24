document.addEventListener('DOMContentLoaded', function() {
  // Existing chapter functionality
  const chapters = document.querySelectorAll('.chapter');
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 120;
  
  if (chapters.length > 0) {
    chapters.forEach((chapter, index) => {
      const chapterHeader = chapter.querySelector('.chapter-header');
      
      if (chapterHeader) {
        chapterHeader.addEventListener('click', (e) => {
          e.preventDefault();
          const isActive = chapter.classList.contains('active');
          
          // Close all chapters
          chapters.forEach(ch => {
            ch.classList.remove('active');
            // Find and pause any playing audio in this chapter
            const audioElement = ch.querySelector('audio');
            const audioContainer = ch.querySelector('.audio-container');
            const playBtn = ch.querySelector('.audio-play-btn');
            
            if (audioElement) {
              audioElement.pause();
              audioElement.currentTime = 0;
              if (audioContainer) {
                audioContainer.classList.remove('playing');
              }
              if (playBtn) {
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
              }
            }
          });
          
          // Toggle current chapter
          if (!isActive) {
            chapter.classList.add('active');
            
            // Apply scrolling animation for all chapters except the first one
            if (index >= 1) {
              const chapterRect = chapter.getBoundingClientRect();
              if (chapterRect.top < headerHeight) {
                window.scrollTo({
                  top: window.scrollY + chapterRect.top - headerHeight - 20,
                  behavior: 'smooth'
                });
              }
            }
          }
        });
      }
    });
    
    // All chapters start collapsed by default
    chapters.forEach(ch => {
      ch.classList.remove('active');
    });
  }

  // Audio player functionality
  function initializeAudioPlayers() {
    console.log('Initializing audio players...');
    const audioPlayers = document.querySelectorAll('.audio-player');
    console.log('Found audio players:', audioPlayers.length);
    
    let currentlyPlaying = null;

    // Format time in MM:SS
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    audioPlayers.forEach((player, index) => {
      console.log(`Setting up player ${index + 1}`);
      
      const audio = player.querySelector('audio');
      const playBtn = player.querySelector('.audio-play-btn');
      const progressBar = player.querySelector('.audio-progress-bar');
      const progress = player.querySelector('.audio-progress');
      const container = player.closest('.audio-container');

      // Log the elements we found
      console.log('Player elements:', {
        audio: !!audio,
        playBtn: !!playBtn,
        progressBar: !!progressBar,
        progress: !!progress,
        container: !!container
      });

      if (!audio || !playBtn || !progressBar || !progress || !container) {
        console.error(`Missing required elements for audio player ${index + 1}`);
        return;
      }

      // Log audio source
      console.log('Audio source:', audio.src);

      // Update progress bar
      function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
          const percent = (audio.currentTime / audio.duration) * 100;
          progressBar.style.width = `${percent}%`;
        }
      }

      // Handle play/pause
      playBtn.addEventListener('click', () => {
        console.log(`Play button clicked for player ${index + 1}`);
        
        if (currentlyPlaying && currentlyPlaying !== audio) {
          console.log('Stopping currently playing audio');
          currentlyPlaying.pause();
          const playingContainer = currentlyPlaying.closest('.audio-container');
          if (playingContainer) {
            playingContainer.classList.remove('playing');
            const playingBtn = playingContainer.querySelector('.audio-play-btn');
            if (playingBtn) {
              playingBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
          }
        }

        if (audio.paused) {
          console.log('Attempting to play audio');
          audio.play().then(() => {
            console.log('Audio playing successfully');
            container.classList.add('playing');
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            currentlyPlaying = audio;
          }).catch(error => {
            console.error('Error playing audio:', error);
            container.classList.remove('playing');
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
          });
        } else {
          console.log('Pausing audio');
          audio.pause();
          container.classList.remove('playing');
          playBtn.innerHTML = '<i class="fas fa-play"></i>';
          currentlyPlaying = null;
        }
      });

      // Handle progress bar click
      progress.addEventListener('click', (e) => {
        console.log('Progress bar clicked');
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audio.duration && !isNaN(audio.duration)) {
          audio.currentTime = percent * audio.duration;
          updateProgress();
        }
      });

      // Update progress as audio plays
      audio.addEventListener('timeupdate', updateProgress);

      // Handle audio loading
      audio.addEventListener('loadedmetadata', () => {
        console.log(`Audio metadata loaded for player ${index + 1}`);
        console.log('Audio duration:', audio.duration);
        updateProgress();
      });

      // Reset when audio ends
      audio.addEventListener('ended', () => {
        console.log('Audio ended');
        container.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
        currentlyPlaying = null;
      });

      // Handle audio errors
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error details:', audio.error);
        container.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
        currentlyPlaying = null;
      });

      // Set initial state
      progressBar.style.width = '0%';
      
      // Log successful initialization
      console.log(`Player ${index + 1} initialized successfully`);
    });
  }

  // Initialize audio players with a slight delay to ensure DOM is ready
  setTimeout(() => {
    console.log('Starting audio player initialization...');
    initializeAudioPlayers();
  }, 100);
});