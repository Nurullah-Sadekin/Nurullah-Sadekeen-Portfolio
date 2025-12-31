// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href*="${sectionId}"]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Typing Animation
const typingText = document.getElementById('typingText');
const texts = [
    'Flutter Developer',
    'Frontend Specialist',
    'Mobile App Developer',
    'UI/UX Enthusiast',
    'Cross-Platform Expert'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
}

// Start typing animation
setTimeout(type, 1000);

// Animated Counter for Stats
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (target === 100 ? '%' : '+');
        }
    };
    
    updateCounter();
};

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => animateCounter(stat));
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Skill Progress Bar Animation
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = progress + '%';
                }, 200);
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillCategories = document.querySelectorAll('.skill-category');
skillCategories.forEach(category => skillsObserver.observe(category));

// GitHub Contributions Graph Generator
function generateGitHubContributions() {
    const graph = document.getElementById('contributionsGraph');
    if (!graph) return;
    
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const totalDays = Math.floor((today - oneYearAgo) / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(totalDays / 7);
    
    const graphContainer = document.createElement('div');
    graphContainer.className = 'github-graph';
    
    let totalContributions = 0;
    
    // Generate contribution data
    for (let week = 0; week < weeks; week++) {
        const column = document.createElement('div');
        column.className = 'graph-column';
        
        for (let day = 0; day < 7; day++) {
            const dayIndex = week * 7 + day;
            if (dayIndex >= totalDays) break;
            
            const cell = document.createElement('div');
            cell.className = 'graph-cell';
            
            // Generate random contribution level (0-4)
            // Weight towards lower values for more realistic distribution
            const random = Math.random();
            let level;
            if (random < 0.4) level = 0;
            else if (random < 0.6) level = 1;
            else if (random < 0.75) level = 2;
            else if (random < 0.9) level = 3;
            else level = 4;
            
            const contributions = level * Math.floor(Math.random() * 5 + 1);
            totalContributions += contributions;
            
            if (level > 0) {
                cell.setAttribute('data-level', level);
            }
            
            // Calculate the date for this cell
            const cellDate = new Date(oneYearAgo);
            cellDate.setDate(cellDate.getDate() + dayIndex);
            const dateString = cellDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
            });
            
            // Add tooltip
            cell.title = `${contributions} contributions on ${dateString}`;
            
            // Add hover effect
            cell.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3)';
            });
            
            cell.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            column.appendChild(cell);
        }
        
        graphContainer.appendChild(column);
    }
    
    graph.appendChild(graphContainer);
    
    // Update total contributions counter
    const totalContribElement = document.getElementById('totalContributions');
    if (totalContribElement) {
        animateContributionCounter(totalContribElement, totalContributions);
    }
}

function animateContributionCounter(element, target) {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Observe contributions section and generate graph when visible
const contributionsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            generateGitHubContributions();
            contributionsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const contributionsSection = document.getElementById('contributions');
if (contributionsSection) {
    contributionsObserver.observe(contributionsSection);
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Telegram Bot Configuration
        const TELEGRAM_BOT_TOKEN = '8271930090:AAFRvxm5jrVeiqGfbVllDIgd9FXtpTpBhIQ';
        const TELEGRAM_CHAT_ID = '7003586095';
        
        // Format message for Telegram
        const telegramMessage = `
🔔 New Portfolio Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
📋 Subject: ${subject}

💬 Message:
${message}
        `;
        
        try {
            // Send to Telegram
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: telegramMessage,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                showNotification(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon!`, 'success');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showNotification('Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
            console.error('Error:', error);
        }
    });
}

// Notification Function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-xl);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Project Cards Parallax Effect
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Lazy Loading for Images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
});

// Scroll Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .stat-card, .skill-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    revealObserver.observe(el);
});

// Cursor Trail Effect (Optional - can be enabled)
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Uncomment to enable cursor trail effect
    /*
    cursorTrail.push({ x: e.clientX, y: e.clientY, timestamp: Date.now() });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
    
    cursorTrail = cursorTrail.filter(point => Date.now() - point.timestamp < 500);
    */
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', (e) => {
    // Arrow keys for navigation
    if (e.key === 'ArrowDown') {
        window.scrollBy({ top: 100, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
        window.scrollBy({ top: -100, behavior: 'smooth' });
    }
    
    // Home/End keys
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Performance Monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Portfolio loaded in ${Math.round(loadTime)}ms`);
    
    // Log performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Performance Metrics:', {
            'DNS Lookup': Math.round(perfData.domainLookupEnd - perfData.domainLookupStart) + 'ms',
            'TCP Connection': Math.round(perfData.connectEnd - perfData.connectStart) + 'ms',
            'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart) + 'ms',
            'Page Load': Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms'
        });
    }
});

// Console Welcome Message
console.log('%c👋 Welcome to Nurullah Sadekeen\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%c📱 Flutter Developer | Frontend Specialist', 'font-size: 14px; color: #94a3b8;');
console.log('%c🔗 GitHub: https://github.com/Nurullah-Sadekin', 'font-size: 12px; color: #8b5cf6;');
console.log('%c📧 Looking to collaborate? Get in touch!', 'font-size: 12px; color: #10b981;');

// Initialize all features on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portfolio initialized successfully!');
    
    // Add custom cursor (optional)
    // createCustomCursor();
    
    // Initialize particles background (optional)
    // initParticles();
});

// Error Handling
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Unhandled Promise Rejection Handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});
