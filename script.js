document.addEventListener('DOMContentLoaded', () => {
    // Fixed floating logo scroll behavior
    const floatingLogo = document.querySelector('.floating-logo-fixed');
    
    const handleLogoScroll = () => {
        if (window.scrollY > 100) {
            floatingLogo?.classList.add('scrolled');
        } else {
            floatingLogo?.classList.remove('scrolled');
        }
    };
    
    // Add click functionality to logo (scroll to top)
    floatingLogo?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', handleLogoScroll);
    
    // Reveal animations on scroll
    const reveals = document.querySelectorAll('[data-reveal]');
    
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('revealed');
            }
        });
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    revealOnScroll(); // Trigger once on load
    
    // Assistant Modal logic
    const assistantBtn = document.getElementById('chatbotBtn');
    const assistantPopup = document.getElementById('chatbotPopup');
    const closeModal = document.getElementById('closeModal');
    
    if (assistantBtn && assistantPopup && closeModal) {
        assistantBtn.addEventListener('click', (e) => {
            e.preventDefault();
            assistantPopup.classList.add('active');
            assistantBtn.classList.add('hidden');
        });
        
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            assistantPopup.classList.remove('active');
            assistantBtn.classList.remove('hidden');
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!assistantPopup.contains(e.target) && 
                !assistantBtn.contains(e.target) && 
                assistantPopup.classList.contains('active')) {
                assistantPopup.classList.remove('active');
                assistantBtn.classList.remove('hidden');
            }
        });
        
        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && assistantPopup.classList.contains('active')) {
                assistantPopup.classList.remove('active');
                assistantBtn.classList.remove('hidden');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            // Add a subtle loading indicator
            const originalText = this.textContent;
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
    
    // Intersection Observer for better performance on reveal animations
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once revealed
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Remove scroll listener and use Intersection Observer instead
        window.removeEventListener('scroll', handleScroll);
        
        reveals.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in modal when open
    assistantPopup?.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableContent = assistantPopup.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Preload iframe when modal is about to be opened (on hover)
    let iframePreloaded = false;
    assistantBtn?.addEventListener('mouseenter', () => {
        if (!iframePreloaded) {
            const iframe = assistantPopup?.querySelector('.assessment-iframe');
            if (iframe && !iframe.src) {
                iframe.src = 'https://ai-readiness-assessment-eta.vercel.app/';
                iframePreloaded = true;
            }
        }
    });
});