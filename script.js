document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initCursorGlow();
  initTypingAnimation();
  initCounterAnimation();
  initProjectFilter();
  initNavigation();
  initMobileNav();
  initContactForm();
  initCopyButtons();
  initMusicPlayerToggle();
});

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CONTACT_EMAIL = '3054819975@qq.com';
const THEME_KEY = 'bj-home-theme';

/* ==========================================================================
   主题：深色为默认，浅色可切换（原来这个按钮是死的）
   ========================================================================== */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const meta = document.getElementById('themeColorMeta');
  if (!btn) return;

  const ICONS = { dark: '🌙', light: '☀️' };
  const COLORS = { dark: '#0f0f1a', light: '#f6f7fb' };

  let stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* 隐私模式 */ }
  let theme = stored === 'light' || stored === 'dark' ? stored : 'dark';

  function apply(next) {
    theme = next;
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', String(theme === 'light'));
    const icon = btn.querySelector('.theme-icon');
    if (icon) icon.textContent = ICONS[theme];
    if (meta) meta.setAttribute('content', COLORS[theme]);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  apply(theme);

  btn.addEventListener('click', () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 存不下就算了 */ }
  });
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/* ==========================================================================
   粒子背景：按设备像素比绘制，主题切换时跟着换色
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;

  const PALETTE = {
    dark: ['#6366f1', '#ec4899'],
    light: ['#4f46e5', '#db2777']
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;

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
      this.color = this.pickColor();
    }

    pickColor() {
      const colors = PALETTE[currentTheme()] || PALETTE.dark;
      return Math.random() > 0.5 ? colors[0] : colors[1];
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

  function paint() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
  }

  if (REDUCED_MOTION) {
    // 不动，但画一帧静态的
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => p.draw());
  } else {
    function animate() {
      paint();
      requestAnimationFrame(animate);
    }
    animate();
  }

  window.addEventListener('resize', () => {
    resize();
  });

  document.addEventListener('themechange', () => {
    particles.forEach(p => { p.color = p.pickColor(); });
  });
}

/* ==========================================================================
   鼠标光晕
   ========================================================================== */
function initCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  // 触屏没有指针，别让它停在左上角
  if (window.matchMedia('(hover: none)').matches) {
    glow.style.display = 'none';
    return;
  }

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

/* ==========================================================================
   打字机
   ========================================================================== */
function initTypingAnimation() {
  const typedElement = document.querySelector('.typing-text');
  if (!typedElement) return;

  let texts = [];
  try {
    const raw = typedElement.dataset.typed;
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) texts = parsed;
  } catch (e) {
    texts = [];
  }
  if (!texts.length) return;

  if (REDUCED_MOTION) {
    typedElement.textContent = texts[0];
    return;
  }

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

/* ==========================================================================
   数字滚动
   ========================================================================== */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-value[data-count]');
  if (!counters.length) return;

  function animateCounter(element, target) {
    if (REDUCED_MOTION) {
      element.textContent = target + '+';
      return;
    }

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

  if (!('IntersectionObserver' in window)) {
    counters.forEach(counter => animateCounter(counter, parseInt(counter.dataset.count, 10)));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count, 10));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5, rootMargin: '0px' });

  counters.forEach(counter => observer.observe(counter));

  /* 兜底：万一观察器没回调（后台标签页 / 渲染被挂起），
     也不能让「0 项目」这种假数字挂在页面上 */
  setTimeout(() => {
    counters.forEach(counter => {
      if (counter.textContent.trim() === '0') {
        counter.textContent = (parseInt(counter.dataset.count, 10) || 0) + '+';
      }
    });
  }, 2600);
}

/* ==========================================================================
   项目筛选
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        const on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });

      projectCards.forEach(card => {
        const category = card.dataset.category;
        const match = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !match);
        card.classList.remove('is-entering');
      });

      // 强制重排后重放入场动画；动画作用在 .card-inner 上，
      // 不会把卡片自身的 hover 位移吃掉
      void projectCards[0].offsetWidth;
      projectCards.forEach(card => {
        if (!card.classList.contains('hidden')) card.classList.add('is-entering');
      });
    });
  });
}

/* ==========================================================================
   导航
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
        document.querySelectorAll('.nav-links.open').forEach(nav => nav.classList.remove('open'));
        const toggle = document.getElementById('navToggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
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
        targetSection.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   移动端导航（原来手机上是直接隐藏链接，等于没法导航）
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navLinks');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

/* ==========================================================================
   联系表单：没有后端，就老老实实唤起邮件客户端，不假装「已发送」
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  const FIELDS = [
    { id: 'name', required: true, msg: '先告诉我怎么称呼你' },
    { id: 'email', required: true, msg: '留个能收到回信的邮箱' },
    { id: 'message', required: true, msg: '写一句想聊的内容' }
  ];

  function setError(input, message) {
    const group = input.closest('.form-group');
    const box = form.querySelector(`[data-error-for="${input.id}"]`);
    if (group) group.classList.toggle('has-error', Boolean(message));
    if (box) box.textContent = message || '';
  }

  function validate() {
    let firstBad = null;
    FIELDS.forEach(spec => {
      const input = document.getElementById(spec.id);
      if (!input) return;
      const value = input.value.trim();
      let message = '';

      if (spec.required && !value) {
        message = spec.msg;
      } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = '这个邮箱地址看着不太对';
      }

      setError(input, message);
      if (message && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  FIELDS.forEach(spec => {
    const input = document.getElementById(spec.id);
    if (!input) return;
    input.addEventListener('blur', () => {
      if (input.value.trim()) setError(input, '');
    });
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('has-error') && input.value.trim()) {
        setError(input, '');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const bad = validate();
    if (bad) {
      bad.focus();
      if (status) status.textContent = '还有几项没填好，已经标在上面了。';
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = '来自 bj1919810.github.io 的留言';
    const body = [`称呼：${name}`, `回信邮箱：${email}`, '', message].join('\n');
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const opened = window.open(href, '_self');

    if (status) {
      status.textContent = opened
        ? '已唤起邮件客户端 —— 写好后按「发送」，我这边就能收到。'
        : `没能唤起邮件客户端，请把内容直接发到 ${CONTACT_EMAIL}。`;
    }

    if (!opened) {
      // 退路：把内容复制出来，让人手动发
      const box = document.createElement('textarea');
      box.value = body;
      box.setAttribute('readonly', '');
      box.style.position = 'fixed';
      box.style.opacity = '0';
      document.body.appendChild(box);
      box.select();
      try {
        document.execCommand('copy');
        if (status) status.textContent = `没能唤起邮件客户端，内容已复制，请粘贴到 ${CONTACT_EMAIL}。`;
      } catch (err) {
        /* 复制也失败时，状态栏里已经有邮箱地址 */
      }
      document.body.removeChild(box);
    }
  });
}

/* ==========================================================================
   复制邮箱
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      const value = btn.dataset.copy || '';
      if (!value) return;

      function done(ok) {
        btn.textContent = ok ? '已复制' : '复制失败';
        setTimeout(() => { btn.textContent = original; }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(
          () => done(true),
          () => done(false)
        );
        return;
      }

      const box = document.createElement('textarea');
      box.value = value;
      box.setAttribute('readonly', '');
      box.style.position = 'fixed';
      box.style.opacity = '0';
      document.body.appendChild(box);
      box.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(box);
      done(ok);
    });
  });
}

/* ==========================================================================
   音乐播放器
   ========================================================================== */
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
  const orderBtn = document.getElementById('playerOrderBtn');
  const sourceLabel = document.getElementById('playerSource');

  if (!toggleBtn || !playerExpanded || !audioPlayer) return;

  const API = 'https://api.injahow.cn/meting/';

  /* 歌单源：按顺序尝试，type 可以是 playlist（歌单）或 song（单曲）。
     预检发现这条线取不到音频就自动换下一个。要换歌单只改这里的 id。 */
  const MUSIC_SOURCES = [
    { label: '网易云', server: 'netease', type: 'playlist', id: '7662773125' },
    { label: '网易云', server: 'netease', type: 'playlist', id: '5321737256' },
    { label: 'QQ', server: 'tencent', type: 'playlist', id: '9519430046' }
  ];

  let songs = [];
  let order = [];        // 播放顺序（list 模式是 0..n-1，random 模式是打乱的）
  let pos = 0;           // 当前在 order 里的位置
  let mode = 'list';
  let progressInterval = null;
  let errorStreak = 0;
  let loaded = false;
  let sourceIndex = 0;
  let sourceFailures = 0;

  function currentSource() {
    return MUSIC_SOURCES[sourceIndex] || MUSIC_SOURCES[0];
  }

  function trackTitle(song) {
    return song.title || song.name || '未知曲目';
  }

  function trackArtist(song) {
    const a = song.artist || song.author || song.singer;
    if (!a) return '未知艺术家';
    if (typeof a === 'object') return a.name || a.nickname || '未知艺术家';
    return a;
  }

  function setListMessage(text) {
    if (!playlistLoading) return;
    playlistLoading.textContent = text;
    playlistLoading.style.display = text ? 'block' : 'none';
  }

  /* 预检：这条音轨到底取不取得到。
     有些歌单接口能返回歌名封面，却取不到音频地址（上游 401），
     与其让用户点了播放才发现没声音，不如载入时先探一下。
     注意：只有「取不到」（网络错误 code 2）才换源；
     解码类报错（code 4）多半是当前浏览器没编解码器，不该把源判死。 */
  function preflight(url) {
    return new Promise((resolve) => {
      const probe = new Audio();
      probe.preload = 'metadata';
      let settled = false;

      function finish(ok) {
        if (settled) return;
        settled = true;
        try {
          probe.removeAttribute('src');
          probe.load();
        } catch (e) { /* 忽略 */ }
        resolve(ok);
      }

      probe.addEventListener('loadedmetadata', () => finish(true), { once: true });
      probe.addEventListener('canplay', () => finish(true), { once: true });
      probe.addEventListener('error', () => {
        const code = probe.error ? probe.error.code : 0;
        finish(code === 2 ? false : true);   // 2 = MEDIA_ERR_NETWORK
      }, { once: true });
      setTimeout(() => finish(true), 2500);   // 超时不当成失败

      try {
        probe.src = url;
        probe.load();
      } catch (e) {
        finish(false);
      }
    });
  }

  async function fetchPlaylist() {
    const source = currentSource();
    setListMessage('加载中...');
    try {
      const url = `${API}?server=${source.server}&type=${source.type}&id=${source.id}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();

      let list;
      if (Array.isArray(data)) {
        list = data;
      } else if (data && data.url) {
        list = [data];                       // type=song 返回的是单曲
      } else {
        throw new Error('bad payload');
      }

      songs = list.filter(song => song && song.url);
      if (!songs.length) throw new Error('no playable track');

      /* 先探一下这个源到底取不取得到音频 */
      const usable = await preflight(songs[0].url);
      if (!usable && sourceIndex < MUSIC_SOURCES.length - 1) {
        sourceIndex++;
        sourceFailures = 0;
        fetchPlaylist();
        return;
      }

      buildList();
      setListMessage('');
      loaded = true;
      sourceFailures = 0;
      resetOrder();
      showTrack(songs[order[0]], false);   // 只准备，不自动播
      if (sourceLabel) sourceLabel.textContent = source.label;
    } catch (error) {
      if (sourceIndex < MUSIC_SOURCES.length - 1) {
        sourceIndex++;
        sourceFailures = 0;
        fetchPlaylist();
        return;
      }
      setListMessage('歌单接口暂时拉不到内容，先不打扰你了。');
      trackNameEl.textContent = '未载入';
      trackArtistEl.textContent = '-';
    }
  }

  function buildList() {
    if (!playlistUl) return;
    playlistUl.innerHTML = '';

    songs.forEach((song, index) => {
      const li = document.createElement('li');
      li.dataset.index = String(index);

      // 用 textContent 拼，别把第三方接口返回的标题当 HTML 插进去
      const name = document.createElement('span');
      name.className = 'song-name';
      name.textContent = trackTitle(song);

      const artist = document.createElement('span');
      artist.className = 'song-artist';
      artist.textContent = trackArtist(song);

      li.appendChild(name);
      li.appendChild(artist);
      li.addEventListener('click', () => {
        const target = parseInt(li.dataset.index, 10);
        const at = order.indexOf(target);
        pos = at === -1 ? 0 : at;
        playCurrent();
      });
      playlistUl.appendChild(li);
    });
  }

  function resetOrder() {
    order = songs.map((_, i) => i);
    pos = 0;
  }

  function shuffleOrder() {
    const arr = order.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function showTrack(song, autoplay) {
    if (!song) return;

    trackNameEl.textContent = trackTitle(song);
    trackArtistEl.textContent = trackArtist(song);

    if (song.pic) {
      coverImage.src = song.pic;
      coverImage.style.display = 'block';
      coverPlaceholder.style.display = 'none';
    } else {
      coverImage.style.display = 'none';
      coverPlaceholder.style.display = 'flex';
    }

    audioPlayer.src = song.url;
    audioPlayer.volume = parseFloat(volumeFill.style.width) / 100 || 0.3;

    if (autoplay) {
      const attempt = audioPlayer.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => updatePlayButton(false));
      }
      updatePlayButton(true);
      startProgressTracking();
    } else {
      updatePlayButton(false);
    }

    updatePlaylistHighlight();
  }

  function playCurrent() {
    const index = order[pos];
    if (index === undefined) return;
    showTrack(songs[index], true);
  }

  function step(delta) {
    if (!songs.length) return;
    pos = (pos + delta + order.length) % order.length;
    playCurrent();
  }

  function togglePlay() {
    if (!songs.length) return;

    if (audioPlayer.paused) {
      if (!audioPlayer.src) {
        playCurrent();
        return;
      }
      const attempt = audioPlayer.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(() => updatePlayButton(false));
      }
      updatePlayButton(true);
      startProgressTracking();
    } else {
      audioPlayer.pause();
      updatePlayButton(false);
      stopProgressTracking();
    }
  }

  function updatePlayButton(isPlaying) {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    if (playIcon) playIcon.style.display = isPlaying ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isPlaying ? 'block' : 'none';
  }

  function updatePlaylistHighlight() {
    if (!playlistUl) return;
    const current = order[pos];
    playlistUl.querySelectorAll('li').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.index, 10) === current);
    });
  }

  function updateProgress() {
    if (!audioPlayer.duration) return;
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const percent = (currentTime / duration) * 100;
    progressFill.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', String(Math.round(percent)));
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
    volumeBar.setAttribute('aria-valuenow', String(Math.round(percent)));
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    const volumeMuteIcon = volumeBtn.querySelector('.volume-mute-icon');
    if (audioPlayer.volume === 0) {
      if (volumeIcon) volumeIcon.style.display = 'none';
      if (volumeMuteIcon) volumeMuteIcon.style.display = 'block';
    } else {
      if (volumeIcon) volumeIcon.style.display = 'block';
      if (volumeMuteIcon) volumeMuteIcon.style.display = 'none';
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
    const open = playlistSection.classList.toggle('active');
    playlistToggle.setAttribute('aria-expanded', String(open));
  }

  function seekTo(e) {
    if (!audioPlayer.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioPlayer.currentTime = percent * audioPlayer.duration;
  }

  audioPlayer.addEventListener('ended', () => {
    errorStreak = 0;
    sourceFailures = 0;
    step(1);
  });

  audioPlayer.addEventListener('error', () => {
    stopProgressTracking();
    updatePlayButton(false);
    errorStreak++;

    /* 只有「取不到」（网络错误）才值得换源；解码类报错多半是浏览器没编解码器 */
    const code = audioPlayer.error ? audioPlayer.error.code : 0;
    if (code === 2) sourceFailures++;

    /* 同一个源连着两条都取不到，多半是这条线上游出问题了，换下一个源 */
    if (sourceFailures >= 2 && sourceIndex < MUSIC_SOURCES.length - 1) {
      sourceIndex++;
      sourceFailures = 0;
      errorStreak = 0;
      setListMessage('当前歌单源暂时放不出声，已切到下一个源。');
      fetchPlaylist();
      return;
    }

    if (errorStreak > 6) {
      setListMessage('这几条音轨都拉不动了，点播放列表换一首吧。');
      return;
    }
    setTimeout(() => step(1), 500);
  });

  toggleBtn.addEventListener('click', () => {
    const open = playerExpanded.classList.toggle('active');
    toggleBtn.setAttribute('aria-expanded', String(open));
    if (open && !loaded) fetchPlaylist();
  });

  minBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playerExpanded.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  playlistToggle.addEventListener('click', togglePlaylist);
  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  progressBar.addEventListener('click', seekTo);
  volumeBtn.addEventListener('click', toggleMute);
  volumeBar.addEventListener('click', setVolume);

  orderBtn.addEventListener('click', () => {
    if (mode === 'list') {
      mode = 'random';
      const current = order[pos];
      order = shuffleOrder();
      // 尽量还停在同一首上
      const at = order.indexOf(current);
      pos = at === -1 ? 0 : at;
      orderBtn.classList.add('active');
      orderBtn.querySelector('.order-list-icon').style.display = 'none';
      orderBtn.querySelector('.order-random-icon').style.display = 'block';
    } else {
      mode = 'list';
      const current = order[pos];
      resetOrder();
      pos = Math.max(0, order.indexOf(current));
      orderBtn.classList.remove('active');
      orderBtn.querySelector('.order-list-icon').style.display = 'block';
      orderBtn.querySelector('.order-random-icon').style.display = 'none';
    }
    updatePlaylistHighlight();
  });

  progressBar.addEventListener('keydown', (e) => {
    if (!audioPlayer.duration) return;
    if (e.key === 'ArrowRight') audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
    else if (e.key === 'ArrowLeft') audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
    else return;
    e.preventDefault();
    updateProgress();
  });

  volumeBar.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.05);
    else if (e.key === 'ArrowLeft') audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.05);
    else return;
    e.preventDefault();
    updateVolumeUI();
  });

  document.addEventListener('click', (e) => {
    if (playerExpanded.contains(e.target) || toggleBtn.contains(e.target)) return;
    playerExpanded.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
  });

  /* 初始音量：0.3。updateVolumeUI 会按 audioPlayer.volume 回填进度条，
     所以必须先把音量定下来，否则进度条会显示成 100%。 */
  audioPlayer.volume = 0.3;
  updateVolumeUI();
}
