const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.55 });
counters.forEach((counter) => counterObserver.observe(counter));

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
menuButton.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.classList.toggle('active', isOpen);
});
mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.classList.remove('active');
  });
});

// Soft ambient particles
const canvas = document.getElementById('ambientCanvas');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  particles = Array.from({ length: Math.min(34, Math.floor(window.innerWidth / 28)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: (Math.random() * 2.6 + 1) * devicePixelRatio,
    vx: (Math.random() - .5) * .16 * devicePixelRatio,
    vy: (Math.random() - .5) * .12 * devicePixelRatio,
    a: Math.random() * .14 + .05
  }));
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -10 || p.x > width + 10) p.vx *= -1;
    if (p.y < -10 || p.y > height + 10) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(105,127,104,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
resize();
draw();
window.addEventListener('resize', resize);
