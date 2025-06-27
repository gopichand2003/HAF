document.addEventListener('DOMContentLoaded', function() {

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
          

          chapters.forEach(ch => {
            ch.classList.remove('active');

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
          

          if (!isActive) {
            chapter.classList.add('active');
            

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
    

    chapters.forEach(ch => {
      ch.classList.remove('active');
    });
  }


  function initializeAudioPlayers() {
    console.log('Initializing audio players...');
    const audioPlayers = document.querySelectorAll('.audio-player');
    console.log('Found audio players:', audioPlayers.length);
    
    let currentlyPlaying = null;


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


      console.log('Audio source:', audio.src);


      function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
          const percent = (audio.currentTime / audio.duration) * 100;
          progressBar.style.width = `${percent}%`;
        }
      }

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

      progress.addEventListener('click', (e) => {
        console.log('Progress bar clicked');
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (audio.duration && !isNaN(audio.duration)) {
          audio.currentTime = percent * audio.duration;
          updateProgress();
        }
      });


      audio.addEventListener('timeupdate', updateProgress);


      audio.addEventListener('loadedmetadata', () => {
        console.log(`Audio metadata loaded for player ${index + 1}`);
        console.log('Audio duration:', audio.duration);
        updateProgress();
      });


      audio.addEventListener('ended', () => {
        console.log('Audio ended');
        container.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
        currentlyPlaying = null;
      });


      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.error('Error details:', audio.error);
        container.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
        currentlyPlaying = null;
      });


      progressBar.style.width = '0%';
      

      console.log(`Player ${index + 1} initialized successfully`);
    });
  }


  setTimeout(() => {
    console.log('Starting audio player initialization...');
    initializeAudioPlayers();
  }, 100);
});