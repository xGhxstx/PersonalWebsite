document.addEventListener("DOMContentLoaded", () => {
 
  // ── Smooth Scroll ──
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
 
  // ── Particle Background ──
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
 
  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
 
  let particlesArray = [];
  const colors = ['#00ffff','#00eaff','#ffffff'];
  let mouse = { x: null, y: null };
 
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
 
  class Particle {
    constructor() {
      this.x      = Math.random() * canvas.width;
      this.y      = Math.random() * canvas.height;
      this.size   = Math.random() * 2 + 1;
      this.speedX = Math.random() - 0.5;
      this.speedY = Math.random() - 0.5;
      this.color  = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x > canvas.width)  this.x = 0;
      if (this.x < 0)             this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0)             this.y = canvas.height;
      if (mouse.x && mouse.y) {
        const dx   = mouse.x - this.x;
        const dy   = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
 
  function init() {
    particlesArray = [];
    for (let i = 0; i < 150; i++) particlesArray.push(new Particle());
  }
 
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
 
  init();
  animate();
 
  window.addEventListener('resize', () => { resizeCanvas(); init(); });
 
  // ── Logo easter egg (cycling phrases instead of a plain alert) ──
document.querySelector('.logo-ghost').addEventListener('click', () => {
  // Create popup
  const popup = document.createElement('div');
  popup.textContent = 'Boo!';
  popup.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #0a0a0a;
    color: #00ffff;
    font-family: 'Orbitron', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 6px;
    padding: 16px 40px;
    border: 1px solid #00ffff;
    box-shadow: 0 0 30px #00ffff;
    z-index: 9999;
    pointer-events: none;
    animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(popup);

  // Remove after 1.5 seconds
  setTimeout(() => popup.remove(), 1500);
});
 
  // ── Contact form ──
  const sendBtn  = document.getElementById('send-btn');
  const feedback = document.getElementById('form-feedback');
 
  function setFeedback(msg, isError) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className   = 'form-feedback' + (isError ? ' error' : '');
  }
 
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name  = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg   = document.getElementById('cf-msg').value.trim();
 
      if (!name || !email || !msg) {
        setFeedback('Please fill out all fields.', true);
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        setFeedback('Please enter a valid email address.', true);
        return;
      }
 
      // Opens the user's mail client pre-filled — no backend needed
      const subject = encodeURIComponent('Message from ' + name + ' via hassanabkow.com');
      const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:your@email.com?subject=' + subject + '&body=' + body;
 
      setFeedback('Opening your mail client — message is ready to send.', false);
      document.getElementById('cf-name').value  = '';
      document.getElementById('cf-email').value = '';
      document.getElementById('cf-msg').value   = '';
    });
  }
 
});

