// ===================================
// Particle Canvas Animation
// ===================================
class ParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.animate();
        this.setupEventListeners();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', debounce(() => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }, 250));
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // Connect particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance / 120})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    
    update(mouse) {
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceX = dx / distance;
                const forceY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                
                this.x += forceX * force * 3;
                this.y += forceY * force * 3;
            }
        }
        
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off walls
        if (this.x > this.canvasWidth || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > this.canvasHeight || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===================================
// Typing Effect
// ===================================
class TypingEffect {
    constructor(element, words, typeSpeed = 150, deleteSpeed = 100, delayBetween = 2000) {
        this.element = element;
        this.words = words;
        this.typeSpeed = typeSpeed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetween = delayBetween;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;
        
        if (!this.isDeleting && this.charIndex === currentWord.length) {
            speed = this.delayBetween;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// ===================================
// Scroll Reveal Animation
// ===================================
class ScrollReveal {
    constructor() {
        this.sections = document.querySelectorAll('section > .container');
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
        this.init();
    }
    
    init() {
        this.sections.forEach(section => {
            section.classList.add('reveal');
            this.observer.observe(section);
        });
    }
    
    handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }
}

// ===================================
// Navigation
// ===================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.updateActiveLink();
        }, 100));
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
                this.navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
            });
        });
        
        // Smooth scroll
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateActiveLink() {
        let current = '';
        
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===================================
// Counter Animation
// ===================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.about-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
    }
}

// ===================================
// Skill Card Animation
// ===================================
class SkillCardAnimation {
    constructor() {
        this.cards = document.querySelectorAll('.skill-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            // Stagger animation
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Mouse move effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// ===================================
// Project Card Animation
// ===================================
class ProjectCardAnimation {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            // Stagger animation
            card.style.animationDelay = `${index * 0.15}s`;
            
            // 3D Tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// ===================================
// Contact Form
// ===================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            this.showSuccessMessage();
            this.form.reset();
        });
    }
    
    showSuccessMessage() {
        const btn = this.form.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;
        
        btn.querySelector('.btn-text').textContent = 'Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00ffff 100%)';
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = originalText;
            btn.style.background = '';
        }, 3000);
    }
}

// ===================================
// Cursor Effect (Optional Enhancement)
// ===================================
class CursorEffect {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursorFollower = document.createElement('div');
        this.init();
    }
    
    init() {
        // Only add cursor effect on desktop
        if (window.innerWidth < 768) return;
        
        this.cursor.className = 'custom-cursor';
        this.cursorFollower.className = 'cursor-follower';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorFollower);
        
        this.addStyles();
        this.addEventListeners();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                width: 10px;
                height: 10px;
                background: var(--primary-color);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 10000;
                mix-blend-mode: difference;
                transition: transform 0.2s ease;
            }
            
            .cursor-follower {
                width: 40px;
                height: 40px;
                border: 2px solid var(--primary-color);
                border-radius: 50%;
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.3s ease;
                opacity: 0.5;
            }
            
            .custom-cursor.clicking {
                transform: scale(1.5);
            }
            
            .cursor-follower.clicking {
                transform: scale(0.8);
            }
        `;
        document.head.appendChild(style);
    }
    
    addEventListeners() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });
        
        // Smooth follower animation
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            this.cursorFollower.style.left = (followerX - 20) + 'px';
            this.cursorFollower.style.top = (followerY - 20) + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();
        
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('clicking');
            this.cursorFollower.classList.add('clicking');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('clicking');
            this.cursorFollower.classList.remove('clicking');
        });
        
        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'scale(1.5)';
                this.cursorFollower.style.transform = 'scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = '';
                this.cursorFollower.style.transform = '';
            });
        });
    }
}

// ===================================
// Initialize All Components
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle canvas
    new ParticleCanvas('particleCanvas');
    
    // Initialize typing effect
    const typingElement = document.getElementById('typingText');
    if (typingElement) {
        const words = [
            'Full Stack Developer',
            'UI/UX Designer',
            'Creative Coder',
            'Problem Solver',
            'Tech Enthusiast'
        ];
        new TypingEffect(typingElement, words);
    }
    
    // Initialize scroll reveal
    new ScrollReveal();
    
    // Initialize navigation
    new Navigation();
    
    // Initialize counter animation
    new CounterAnimation();
    
    // Initialize skill cards
    new SkillCardAnimation();
    
    // Initialize project cards
    new ProjectCardAnimation();
    
    // Initialize contact form
    new ContactForm();
    
    // Initialize custom cursor (optional)
    // Uncomment the line below to enable custom cursor
    // new CursorEffect();
    
    // Add loading animation (respects prefers-reduced-motion)
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
    }
});

// ===================================
// Performance Optimization
// ===================================
// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
}
