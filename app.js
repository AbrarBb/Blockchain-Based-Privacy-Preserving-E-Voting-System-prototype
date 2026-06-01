(function () {
  'use strict';
  // MOCK DATABASE & STATE
  const S = {
    page: 'landing',
    theme: localStorage.getItem('theme') || 'light',
    currentUser: null, // null = logged out. Object = logged in.
    voterHistory: {}, // { [userId]: { [electionId]: { txHash, nullifier, time, block } } }

    // Simulated Roles: 'voter', 'official', 'admin', 'auditor'
    users: [
      { id: 'u1', name: 'Alice Citizen', role: 'voter', wallet: '0x1A2B...3C4D', status: 'approved' },
      { id: 'u2', name: 'Bob Official', role: 'official', wallet: '0xOFFI...CIAL', status: 'approved' },
      { id: 'u3', name: 'Carol Admin', role: 'admin', wallet: '0xADMI...N123', status: 'approved' },
      { id: 'u4', name: 'Dave Auditor', role: 'auditor', wallet: '0xAUDI...T456', status: 'approved' }
    ],

    elections: [
      {
        id: 1,
        title: '2026 National General Election',
        phase: 'Voting',
        startTime: Date.now() - 86400000,
        endTime: Date.now() + 86400000,
        candidates: [
          { id: 1, name: 'Sarah Mitchell', party: 'Progressive Alliance', bio: 'Former public policy director with 15 years of experience in governance reform.', votes: 248271 },
          { id: 2, name: 'James Rodriguez', party: 'Democratic Union', bio: 'Civil rights advocate and constitutional law professor.', votes: 183651 },
          { id: 3, name: 'Amara Osei', party: 'Innovation Coalition', bio: 'Technology researcher specializing in digital governance.', votes: 112984 }
        ],
        votes: [] // array of { nullifier, timestamp, txHash, voter, block }
      },
      {
        id: 2,
        title: 'Regional Council Election',
        phase: 'Registration',
        startTime: Date.now() + 86400000 * 7,
        endTime: Date.now() + 86400000 * 14,
        candidates: [],
        votes: []
      }
    ],

    logs: [
      { time: Date.now() - 3600000 * 24 * 2, user: 'System', action: 'ElectionManager contract deployed at 0x8f...1a' },
      { time: Date.now() - 3600000 * 24, user: '0xOFFI...CIAL', action: 'Created 2026 National General Election' },
      { time: Date.now() - 3600000 * 12, user: '0xOFFI...CIAL', action: 'Started Voting Phase for Election #1' },
      { time: Date.now() - 360000, user: '0x1A2B...3C4D', action: 'Cast Vote via ZKP (Nullifier: 0x9b...4f)' }
    ]
  };
  window.S = S;

  // THEME MANAGEMENT
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', S.theme);
    const sun = document.querySelector('.sun-icon');
    const moon = document.querySelector('.moon-icon');
    if (S.theme === 'dark') {
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else {
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  }
  function toggleTheme() {
    S.theme = S.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', S.theme);
    applyTheme();
  }

  // ROUTER & RBAC
  function route() {
    let h = location.hash.slice(2) || 'landing';

    // RBAC Checks
    if (h.startsWith('dashboard')) {
      if (!S.currentUser) { h = 'login'; location.hash = '/login'; }
      else if (S.currentUser.role === 'voter') h = 'voter_dashboard';
      else if (S.currentUser.role === 'official') h = 'official_dashboard';
      else if (S.currentUser.role === 'admin') h = 'admin_dashboard';
      else if (S.currentUser.role === 'auditor') h = 'auditor_dashboard';
    }

    if (h.startsWith('voter_') && (!S.currentUser || S.currentUser.role !== 'voter')) { h = 'login'; location.hash = '/login'; }
    if (h.startsWith('official_') && (!S.currentUser || S.currentUser.role !== 'official')) { h = 'login'; location.hash = '/login'; }
    if (h.startsWith('admin_') && (!S.currentUser || S.currentUser.role !== 'admin')) { h = 'login'; location.hash = '/login'; }
    if (h.startsWith('auditor_') && (!S.currentUser || S.currentUser.role !== 'auditor')) { h = 'login'; location.hash = '/login'; }

    S.page = h;
    const basePath = h.split('?')[0]; // Strip query parameters for function lookup

    const app = document.getElementById('app');
    app.style.opacity = '0';
    setTimeout(() => {
      const fn = window.PAGES[basePath];
      app.innerHTML = fn ? fn() : window.PAGES['landing']();
      app.style.opacity = '1';
      updateNav();
      if (window.PAGES['init_' + basePath]) window.PAGES['init_' + basePath]();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 150);
  }

  window.navigate = function (p) { location.hash = '/' + p; };

  // AUTH METHODS
  window.login = function (userId) {
    S.currentUser = S.users.find(u => u.id === userId);
    navigate('dashboard');
  };
  window.logout = function () {
    S.currentUser = null;
    navigate('landing');
  };

  function updateNav() {
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === S.page || (a.dataset.page === 'dashboard' && S.page.includes('dashboard')));
    });

    const btnLogin = document.getElementById('nav-login-btn');
    const userMenu = document.getElementById('nav-user-menu');
    const authLinks = document.querySelectorAll('.nav-item-auth');
    const pubLinks = document.querySelectorAll('.nav-item-public');

    if (S.currentUser) {
      btnLogin.classList.add('hidden');
      userMenu.classList.remove('hidden');
      document.getElementById('nav-user-name').textContent = S.currentUser.name;
      document.getElementById('nav-user-role').textContent = S.currentUser.role;
      document.getElementById('nav-user-avatar').textContent = S.currentUser.name.charAt(0);

      authLinks.forEach(el => el.classList.remove('hidden'));
      pubLinks.forEach(el => el.classList.add('hidden')); // Hide home/security when logged in
    } else {
      btnLogin.classList.remove('hidden');
      userMenu.classList.add('hidden');
      authLinks.forEach(el => el.classList.add('hidden'));
      pubLinks.forEach(el => el.classList.remove('hidden'));
    }
  }

  // Particles
  function initParticles() {
    const c = document.getElementById('particles-canvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h, pts = [];
    function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 60; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 2 + 1 });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = S.theme === 'dark';
      const color = isDark ? '59,130,246' : '37,99,235'; // Lighter blue in dark mode

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.2)`; ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${color}, ${(1 - d / 150) * 0.1})`; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // Modal helpers
  window.showModal = function (html) {
    const m = document.getElementById('modal-overlay');
    m.innerHTML = '<div class="modal-card">' + html + '</div>';
    m.classList.remove('hidden');
  };
  window.hideModal = function () { document.getElementById('modal-overlay').classList.add('hidden') };

  // Init
  window.addEventListener('hashchange', route);
  window.addEventListener('DOMContentLoaded', function () {
    applyTheme();
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('nav-toggle').addEventListener('click', function () {
      document.getElementById('nav-links').classList.toggle('open');
    });
    initParticles();
    route();
  });
})();
