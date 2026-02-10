// ===================================
// Navigation
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}));

document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
});

// ===================================
// Scroll Reveal (staggered)
// ===================================
function initReveal() {
    const els = document.querySelectorAll(
        '.reveal, .project-card, .skill-category, .leadership-card, .exp-card, ' +
        '.highlight-card, .contact-item, .pillar-item, .growth-banner'
    );
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // Stagger siblings
            const parent = entry.target.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children).filter(el =>
                    el.matches('.project-card, .skill-category, .leadership-card, .exp-card, .highlight-card, .contact-item, .pillar-item')
                );
                const idx = siblings.indexOf(entry.target);
                if (idx > 0) entry.target.style.transitionDelay = `${idx * 0.08}s`;
            }
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => obs.observe(el));
}

// ===================================
// Hero Word Cycle
// ===================================
function initCycle() {
    const el = document.getElementById('heroCycle');
    if (!el) return;
    const words = ['data & strategy.', 'insight & action.', 'analysis & impact.', 'problems & solutions.'];
    let i = 0;
    el.textContent = words[0];
    setInterval(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        setTimeout(() => {
            i = (i + 1) % words.length;
            el.textContent = words[i];
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    }, 2800);
}

// ===================================
// Active Nav
// ===================================
function highlightNav() {
    const pos = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop, h = sec.offsetHeight, id = sec.id;
        if (pos >= top && pos < top + h) {
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
    });
}
window.addEventListener('scroll', highlightNav);

// ===================================
// Contact Form
// ===================================
const form = document.getElementById('contactForm');
if (form) form.addEventListener('submit', (e) => { e.preventDefault(); notify('Message sent! I\'ll get back to you soon.'); form.reset(); });

// ===================================
// Notifications
// ===================================
function notify(msg, type = 'success') {
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText = `position:fixed;top:100px;right:30px;background:${type==='success'?'#06b6d4':'#ef4444'};color:#fff;padding:18px 28px;border-radius:8px;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:10000;animation:slideInR .4s ease-out`;
    document.body.appendChild(n);
    setTimeout(() => { n.style.animation = 'slideOutR .4s ease-out'; setTimeout(() => n.remove(), 400); }, 3000);
}
const ns = document.createElement('style');
ns.textContent = `@keyframes slideInR{from{transform:translateX(300px);opacity:0}to{transform:none;opacity:1}}@keyframes slideOutR{from{transform:none;opacity:1}to{transform:translateX(300px);opacity:0}}`;
document.head.appendChild(ns);

// ===================================
// Resume Download
// ===================================
const dlBtn = document.getElementById('downloadResume');
if (dlBtn) dlBtn.addEventListener('click', () => { notify('Resume download started!'); });

// ===================================
// Footer Year
// ===================================
const ft = document.querySelector('.footer-text');
if (ft) ft.textContent = `\u00A9 ${new Date().getFullYear()} Henry Tasker. Designed and built with purpose.`;

// ===================================
// Carousel
// ===================================
class Carousel {
    constructor(id) {
        this.track = document.querySelector(`.carousel-track[data-carousel="${id}"]`);
        if (!this.track) return;
        this.imgs = Array.from(this.track.querySelectorAll('.carousel-image'));
        this.prev = document.querySelector(`.carousel-prev[data-carousel="${id}"]`);
        this.next = document.querySelector(`.carousel-next[data-carousel="${id}"]`);
        this.dots = Array.from((document.querySelector(`.carousel-dots[data-carousel="${id}"]`) || {querySelectorAll:()=>[]}).querySelectorAll('.dot'));
        this.i = 0; this.iv = null; this.init();
    }
    init() {
        if (this.prev) this.prev.addEventListener('click', () => { this.stop(); this.go((this.i - 1 + this.imgs.length) % this.imgs.length); this.play(); });
        if (this.next) this.next.addEventListener('click', () => { this.stop(); this.go((this.i + 1) % this.imgs.length); this.play(); });
        this.dots.forEach((d, j) => d.addEventListener('click', () => { this.stop(); this.go(j); this.play(); }));
        const c = this.track.closest('.carousel-container') || this.track.parentElement;
        c.addEventListener('mouseenter', () => this.stop());
        c.addEventListener('mouseleave', () => this.play());
        this.play();
    }
    go(n) {
        this.imgs[this.i].classList.remove('active');
        if (this.dots[this.i]) this.dots[this.i].classList.remove('active');
        this.i = n;
        this.imgs[this.i].classList.add('active');
        if (this.dots[this.i]) this.dots[this.i].classList.add('active');
    }
    play() { this.iv = setInterval(() => this.go((this.i + 1) % this.imgs.length), 4000); }
    stop() { clearInterval(this.iv); }
}
new Carousel('bcap');
new Carousel('athletics');
new Carousel('ames');

// ===================================
// Modal
// ===================================
class Modal {
    constructor(id) {
        this.m = document.getElementById(`modal-${id}`);
        if (!this.m) return;
        this.imgs = Array.from(this.m.querySelectorAll('.modal-carousel-image'));
        this.i = 0;
        this.m.querySelector('.modal-close')?.addEventListener('click', () => this.close());
        this.m.addEventListener('click', (e) => { if (e.target === this.m) this.close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.m.classList.contains('active')) this.close(); });
        this.m.querySelector('.modal-carousel-prev')?.addEventListener('click', () => this.nav(1));
        this.m.querySelector('.modal-carousel-next')?.addEventListener('click', () => this.nav(-1));
    }
    open() { this.m.classList.add('active'); document.body.style.overflow = 'hidden'; }
    close() { this.m.classList.remove('active'); document.body.style.overflow = ''; }
    nav(dir) {
        if (!this.imgs.length) return;
        this.imgs[this.i].classList.remove('active');
        this.i = (this.i + dir + this.imgs.length) % this.imgs.length;
        this.imgs[this.i].classList.add('active');
    }
}
const modals = { mcdonalds: new Modal('mcdonalds'), athletics: new Modal('athletics'), ames: new Modal('ames') };
document.querySelectorAll('.project-link').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); modals[btn.dataset.modal]?.open(); });
});

// ===================================
// Init
// ===================================
document.addEventListener('DOMContentLoaded', () => { initReveal(); initCycle(); });

// ===================================
// Easter Egg
// ===================================
let kc = [];
const kp = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => { kc.push(e.key); kc = kc.slice(-10); if (kc.join(',') === kp.join(',')) { notify('You found the secret! Henry approves.'); document.body.style.animation = 'rainbow 2s linear infinite'; } });
const rs = document.createElement('style'); rs.textContent = `@keyframes rainbow{0%{filter:hue-rotate(0)}100%{filter:hue-rotate(360deg)}}`; document.head.appendChild(rs);
