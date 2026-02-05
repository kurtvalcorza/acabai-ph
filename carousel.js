/**
 * Initiative Carousel
 * Manages infinite scrolling carousel with overlapping cards
 */
class InitiativeCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.warn('Carousel container not found');
            return;
        }
        
        this.track = this.container.querySelector('.carousel-track');
        this.cards = Array.from(this.track.querySelectorAll('.initiative-card'));
        this.prevBtn = this.container.querySelector('.carousel-control.prev');
        this.nextBtn = this.container.querySelector('.carousel-control.next');
        this.dots = Array.from(this.container.querySelectorAll('.dot'));
        
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.transitionDuration = 400; // ms
        this.autoPlayTimer = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        // Touch gesture properties
        this.touchStartX = null;
        this.touchCurrentX = null;
        this.swipeThreshold = 50; // Minimum swipe distance in pixels
        
        // Responsive breakpoints
        this.BREAKPOINTS = {
            mobile: 768,
            tablet: 1024
        };
        this.currentBreakpoint = this.detectBreakpoint();
        
        this.init();
    }
    
    init() {
        if (!this.track || this.cards.length === 0) {
            console.warn('Carousel track or cards not found');
            return;
        }
        
        this.setupNavigation();
        this.setupKeyboardControls();
        this.setupTouchGestures();
        this.setupResizeHandler();
        this.setupAutoPlay();
        this.setupIntersectionObserver();
        
        // Initialize card positions
        this.updateCardTransforms();
    }
    
    /**
     * Set up Intersection Observer for viewport visibility
     */
    setupIntersectionObserver() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            return;
        }
        
        const options = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of carousel must be visible
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Carousel is visible, resume auto-play
                    this.startAutoPlay();
                } else {
                    // Carousel is not visible, pause auto-play
                    this.stopAutoPlay();
                }
            });
        }, options);
        
        this.intersectionObserver.observe(this.container);
    }
    
    /**
     * Wrap index to valid range [0, totalCards-1]
     * @param {number} index - The index to wrap
     * @returns {number} Wrapped index
     */
    wrapIndex(index) {
        const total = this.cards.length;
        return ((index % total) + total) % total;
    }
    
    /**
     * Calculate relative position from center card
     * @param {number} cardIndex - Index of the card
     * @param {number} centerIndex - Index of the center card
     * @returns {number} Relative position (-1, 0, 1, etc.)
     */
    getRelativePosition(cardIndex, centerIndex) {
        const total = this.cards.length;
        let diff = cardIndex - centerIndex;
        
        // Normalize to shortest path
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        
        return diff;
    }
    
    /**
     * Calculate card position class based on relative position
     * @param {number} relativePosition - Position relative to center
     * @returns {string} Position class name
     */
    calculateCardPosition(relativePosition) {
        switch(relativePosition) {
            case 0:
                return 'position-center';
            case 1:
                return 'position-adjacent-right';
            case -1:
                return 'position-adjacent-left';
            case 2:
            case -2:
                // For 3 cards, position 2 wraps to -1 (left side)
                return relativePosition === 2 ? 'position-adjacent-left' : 'position-adjacent-right';
            default:
                return relativePosition > 0 ? 'position-far-right' : 'position-far-left';
        }
    }
    
    /**
     * Update transforms for all cards based on current index
     */
    updateCardTransforms() {
        this.cards.forEach((card, cardIndex) => {
            const relativePos = this.getRelativePosition(cardIndex, this.currentIndex);
            const positionClass = this.calculateCardPosition(relativePos);
            
            // Remove all position classes
            card.classList.remove(
                'position-center',
                'position-adjacent-left',
                'position-adjacent-right',
                'position-far-left',
                'position-far-right'
            );
            
            // Add new position class
            card.classList.add(positionClass);
        });
        
        this.updateDots();
        this.updateARIA();
    }
    
    setupNavigation() {
        // Arrow button navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigatePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateNext());
        }
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.navigateToCard(index);
                this.stopAutoPlay();
            });
        });
        
        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Only handle if carousel is in viewport
            const rect = this.container.getBoundingClientRect();
            const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!inViewport) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigatePrev();
                    this.stopAutoPlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateNext();
                    this.stopAutoPlay();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.navigateToCard(0);
                    this.stopAutoPlay();
                    break;
                case 'End':
                    e.preventDefault();
                    this.navigateToCard(this.cards.length - 1);
                    this.stopAutoPlay();
                    break;
            }
        });
    }
    
    setupAutoPlay() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Disable transitions for reduced motion
            this.transitionDuration = 0;
            this.cards.forEach(card => {
                card.style.transition = 'none';
            });
            return;
        }
        
        this.startAutoPlay();
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); // Clear any existing timer
        
        this.autoPlayTimer = setInterval(() => {
            this.navigateNext();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    /**
     * Navigate to a specific card
     * @param {number} targetIndex - Index of target card
     */
    navigateToCard(targetIndex) {
        if (this.isTransitioning) {
            console.warn('Navigation blocked: transition in progress');
            return;
        }
        
        this.isTransitioning = true;
        this.currentIndex = this.wrapIndex(targetIndex);
        
        this.updateCardTransforms();
        
        // Release lock after transition
        setTimeout(() => {
            this.isTransitioning = false;
        }, this.transitionDuration);
    }
    
    /**
     * Navigate to next card
     */
    navigateNext() {
        if (this.isTransitioning) return;
        
        const nextIndex = this.wrapIndex(this.currentIndex + 1);
        this.navigateToCard(nextIndex);
    }
    
    /**
     * Navigate to previous card
     */
    navigatePrev() {
        if (this.isTransitioning) return;
        
        const prevIndex = this.wrapIndex(this.currentIndex - 1);
        this.navigateToCard(prevIndex);
    }
    
    /**
     * Detect current breakpoint
     * @returns {string} Breakpoint name ('mobile', 'tablet', or 'desktop')
     */
    detectBreakpoint() {
        const width = window.innerWidth;
        if (width < this.BREAKPOINTS.mobile) {
            return 'mobile';
        } else if (width < this.BREAKPOINTS.tablet) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Set up debounced resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(() => {
                try {
                    const newBreakpoint = this.detectBreakpoint();
                    if (newBreakpoint !== this.currentBreakpoint) {
                        this.currentBreakpoint = newBreakpoint;
                        this.updateCardTransforms();
                    }
                } catch (error) {
                    console.error('Resize handling error:', error);
                }
            }, 150); // Wait 150ms after last resize event
        });
    }
    
    /**
     * Set up touch/swipe gesture handlers
     */
    setupTouchGestures() {
        this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }
    
    /**
     * Handle touch start event
     * @param {TouchEvent} event
     */
    handleTouchStart(event) {
        try {
            this.touchStartX = event.touches[0].clientX;
            this.touchCurrentX = this.touchStartX;
            this.stopAutoPlay();
        } catch (error) {
            console.error('Touch start error:', error);
        }
    }
    
    /**
     * Handle touch move event
     * @param {TouchEvent} event
     */
    handleTouchMove(event) {
        try {
            if (this.touchStartX === null) return;
            this.touchCurrentX = event.touches[0].clientX;
        } catch (error) {
            console.error('Touch move error:', error);
        }
    }
    
    /**
     * Handle touch end event
     * @param {TouchEvent} event
     */
    handleTouchEnd(event) {
        try {
            if (this.touchStartX === null) return;
            
            const deltaX = this.touchCurrentX - this.touchStartX;
            
            // Check if swipe threshold is exceeded
            if (Math.abs(deltaX) > this.swipeThreshold) {
                // Swipe left = next, swipe right = prev
                if (deltaX > 0) {
                    this.navigatePrev();
                } else {
                    this.navigateNext();
                }
            }
        } catch (error) {
            console.error('Touch end error:', error);
            // Ensure carousel returns to valid state
            this.updateCardTransforms();
        } finally {
            // Always reset touch state
            this.touchStartX = null;
            this.touchCurrentX = null;
        }
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }
    
    updateARIA() {
        // Update cards
        this.cards.forEach((card, index) => {
            if (index === this.currentIndex) {
                card.setAttribute('aria-current', 'true');
                card.setAttribute('aria-label', `Initiative ${index + 1} of ${this.cards.length}, currently focused`);
            } else {
                card.removeAttribute('aria-current');
                card.setAttribute('aria-label', `Initiative ${index + 1} of ${this.cards.length}`);
            }
        });
        
        // Update navigation controls
        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 'Previous initiative');
        }
        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 'Next initiative');
        }
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new InitiativeCarousel('.carousel-container');
});
