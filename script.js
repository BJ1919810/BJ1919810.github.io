document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initCursorGlow();
  initTypingAnimation();
  initCounterAnimation();
  initProjectFilter();
  initNavigation();
  initContactForm();
  initMusicPlayerToggle();
});

function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = 60;
  
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#6366f1' : '#ec4899';
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  
  document.querySelectorAll('a, button, .project-card, .skill-tag').forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.opacity = '1';
    });
  });
}

function initTypingAnimation() {
  const typedElement = document.querySelector('.typing-text');
  if (!typedElement) return;
  
  const texts = JSON.parse(typedElement.dataset.typed);
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typedElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      typedElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  setTimeout(type, 1000);
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
  let current = 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  
  function update() {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(update);
    } else {
      element.textContent = target + '+';
    }
  }
  
  update();
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      projectCards.forEach(card => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(section => observer.observe(section));
  
  document.querySelectorAll('.hero-cta a').forEach(cta => {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = cta.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    console.log('Form submitted:', { name, email, message });
    
    form.reset();
    
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent!</span> ✓';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 3000);
  });
}

function initMusicPlayerToggle() {
  const toggleBtn = document.getElementById('playerToggleBtn');
  const playerExpanded = document.getElementById('playerExpanded');
  const minBtn = document.getElementById('playerMinBtn');
  const playlistToggle = document.getElementById('playerPlaylistToggle');
  const playlistSection = document.getElementById('playerPlaylistSection');
  const playBtn = document.getElementById('playerPlayBtn');
  const prevBtn = document.getElementById('playerPrevBtn');
  const nextBtn = document.getElementById('playerNextBtn');
  const progressBar = document.getElementById('playerProgressBar');
  const progressFill = document.getElementById('playerProgressFill');
  const currentTimeEl = document.getElementById('playerCurrentTime');
  const totalTimeEl = document.getElementById('playerTotalTime');
  const trackNameEl = document.getElementById('playerTrackName');
  const trackArtistEl = document.getElementById('playerTrackArtist');
  const coverImage = document.getElementById('coverImage');
  const coverPlaceholder = document.getElementById('coverPlaceholder');
  const playlistUl = document.getElementById('playlistUl');
  const playlistLoading = document.getElementById('playlistLoading');
  const audioPlayer = document.getElementById('audioPlayer');
  const volumeBtn = document.getElementById('playerVolumeBtn');
  const volumeBar = document.getElementById('playerVolumeBar');
  const volumeFill = document.getElementById('playerVolumeFill');

  if (!toggleBtn || !playerExpanded) return;

  let playlist = [];
  let currentIndex = 0;
  let isPlaylistExpanded = false;
  let progressInterval = null;
  let playOrder = 'list';
  let shuffledPlaylist = [];
  const orderBtn = document.getElementById('playerOrderBtn');

  async function fetchPlaylist() {
    playlistLoading.style.display = 'block';
    playlistUl.innerHTML = '';

    try {
      const response = await fetch(`https://api.i-meto.com/meting/api?server=tencent&type=playlist&id=9519430046&r=1234`);
      const data = await response.json();
      playlist = data || [];

      playlistLoading.style.display = 'none';

      if (playlist.length === 0) {
        playlistUl.innerHTML = '<li style="padding:1rem;text-align:center;color:var(--text-muted)">暂无歌曲</li>';
        return;
      }

      playlist.forEach((song, index) => {
        const artist = song.artist || song.author || song.singer || '未知艺术家';
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="song-name">${song.title || '未知曲目'}</span>
          <span class="song-artist">${artist}</span>
        `;
        li.addEventListener('click', () => playSong(index));
        playlistUl.appendChild(li);
      });

      playSong(0);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
      playlistLoading.style.display = 'none';
      playlistUl.innerHTML = '<li style="padding:1rem;text-align:center;color:var(--text-muted)">加载失败</li>';
    }
  }

  function playSong(index) {
    if (playlist.length === 0) return;

    currentIndex = index;
    const song = playlist[currentIndex];

    audioPlayer.src = song.url;
    audioPlayer.volume = 0.3;

    audioPlayer.play().catch(err => console.log('Play error:', err));

    const artist = song.artist || song.author || song.singer || '未知艺术家';
    trackNameEl.textContent = song.title || '未知曲目';
    trackArtistEl.textContent = artist;

    if (song.pic) {
      coverImage.src = song.pic;
      coverImage.style.display = 'block';
      coverPlaceholder.style.display = 'none';
    } else {
      coverImage.style.display = 'none';
      coverPlaceholder.style.display = 'flex';
    }

    updatePlayButton(true);
    updatePlaylistHighlight();
    startProgressTracking();
  }

  function togglePlay() {
    if (playlist.length === 0) return;

    if (audioPlayer.paused) {
      audioPlayer.play().catch(err => console.log('Play error:', err));
      updatePlayButton(true);
      startProgressTracking();
    } else {
      audioPlayer.pause();
      updatePlayButton(false);
      stopProgressTracking();
    }
  }

  function playPrev() {
    if (playlist.length === 0) return;
    if (playOrder === 'random') {
      currentIndex = Math.floor(Math.random() * shuffledPlaylist.length);
    } else {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    playSong(playOrder === 'random' ? shuffledPlaylist[currentIndex].originalIndex : currentIndex);
  }

  function playNext() {
    if (playlist.length === 0) return;
    if (playOrder === 'random') {
      currentIndex = Math.floor(Math.random() * shuffledPlaylist.length);
      playSong(shuffledPlaylist[currentIndex].originalIndex);
    } else {
      currentIndex = (currentIndex + 1) % playlist.length;
      playSong(currentIndex);
    }
  }

  function shuffleArray(array) {
    const shuffled = array.map((item, index) => ({ ...item, originalIndex: index }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function toggleOrder() {
    if (playOrder === 'list') {
      playOrder = 'random';
      shuffledPlaylist = shuffleArray(playlist);
      orderBtn.classList.add('active');
      orderBtn.querySelector('.order-list-icon').style.display = 'none';
      orderBtn.querySelector('.order-random-icon').style.display = 'block';
    } else {
      playOrder = 'list';
      orderBtn.classList.remove('active');
      orderBtn.querySelector('.order-list-icon').style.display = 'block';
      orderBtn.querySelector('.order-random-icon').style.display = 'none';
      const currentSong = playlist[currentIndex];
      currentIndex = playlist.findIndex(s => s === currentSong);
    }
  }

  function updatePlayButton(isPlaying) {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    if (isPlaying) {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  function updatePlaylistHighlight() {
    const items = playlistUl.querySelectorAll('li');
    items.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });
  }

  function updateProgress() {
    if (!audioPlayer.duration) return;
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const percent = (currentTime / duration) * 100;
    progressFill.style.width = percent + '%';
    currentTimeEl.textContent = formatTime(currentTime);
    totalTimeEl.textContent = formatTime(duration);
  }

  function startProgressTracking() {
    stopProgressTracking();
    progressInterval = setInterval(updateProgress, 250);
  }

  function stopProgressTracking() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function updateVolumeUI() {
    const percent = audioPlayer.volume * 100;
    volumeFill.style.width = percent + '%';
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    const volumeMuteIcon = volumeBtn.querySelector('.volume-mute-icon');
    if (audioPlayer.volume === 0) {
      volumeIcon.style.display = 'none';
      volumeMuteIcon.style.display = 'block';
    } else {
      volumeIcon.style.display = 'block';
      volumeMuteIcon.style.display = 'none';
    }
  }

  function setVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioPlayer.volume = percent;
    updateVolumeUI();
  }

  function toggleMute() {
    if (audioPlayer.volume > 0) {
      audioPlayer.previousVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
    } else {
      audioPlayer.volume = audioPlayer.previousVolume || 0.3;
    }
    updateVolumeUI();
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || !seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function togglePlaylist() {
    isPlaylistExpanded = !isPlaylistExpanded;
    playlistSection.classList.toggle('active', isPlaylistExpanded);
    playlistToggle.classList.toggle('active', isPlaylistExpanded);
  }

  function seekTo(e) {
    if (!audioPlayer.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
  }

  audioPlayer.addEventListener('ended', () => {
    playNext();
  });

  audioPlayer.addEventListener('error', () => {
    stopProgressTracking();
    updatePlayButton(false);
    setTimeout(() => {
      playNext();
    }, 500);
  });

  toggleBtn.addEventListener('click', () => {
    playerExpanded.classList.toggle('active');
    if (playerExpanded.classList.contains('active') && playlist.length === 0) {
      fetchPlaylist();
    }
  });

  minBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playerExpanded.classList.remove('active');
  });

  playlistToggle.addEventListener('click', togglePlaylist);
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);
  progressBar.addEventListener('click', seekTo);
  volumeBtn.addEventListener('click', toggleMute);
  volumeBar.addEventListener('click', setVolume);
  orderBtn.addEventListener('click', toggleOrder);

  document.addEventListener('click', (e) => {
    if (!playerExpanded.contains(e.target) && !toggleBtn.contains(e.target)) {
      playerExpanded.classList.remove('active');
    }
  });
}
