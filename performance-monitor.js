/**
 * ACABAI-PH Performance Monitoring
 * Tracks and reports performance metrics for the hero section
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: {},
            videoLoad: {},
            imageLoad: {},
            userInteraction: {}
        };
        
        this.isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
        this.maxStorageSize = 5000; // 5KB limit
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.trackPageLoadMetrics();
        this.trackVideoPerformance();
        this.trackImageLoadPerformance();
        this.trackUserInteractions();
        this.setupPerformanceObserver();
        
        // Only log in development
        if (!this.isProduction) {
            console.log('Performance monitoring initialized');
        }
    }
    
    trackPageLoadMetrics() {
        // Use Performance API to track page load metrics
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            this.metrics.pageLoad = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
            };
            
            this.reportMetrics('page_load', this.metrics.pageLoad);
        });
    }
    
    trackVideoPerformance() {
        const video = document.querySelector('.hero-video');
        if (!video) return;
        
        const startTime = performance.now();
        
        video.addEventListener('loadstart', () => {
            this.metrics.videoLoad.loadStart = performance.now() - startTime;
        });
        
        video.addEventListener('canplay', () => {
            this.metrics.videoLoad.canPlay = performance.now() - startTime;
        });
        
        video.addEventListener('canplaythrough', () => {
            this.metrics.videoLoad.canPlayThrough = performance.now() - startTime;
            this.reportMetrics('video_load', this.metrics.videoLoad);
        });
        
        video.addEventListener('error', () => {
            this.metrics.videoLoad.error = performance.now() - startTime;
            this.reportMetrics('video_error', this.metrics.videoLoad);
        });
    }
    
    trackImageLoadPerformance() {
        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;
        const startTime = performance.now();
        
        images.forEach((img, index) => {
            const imageStartTime = performance.now();
            
            img.addEventListener('load', () => {
                loadedImages++;
                const loadTime = performance.now() - imageStartTime;
                
                this.metrics.imageLoad[`image_${index}`] = {
                    src: img.src,
                    loadTime: loadTime,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight
                };
                
                if (loadedImages === totalImages) {
                    this.metrics.imageLoad.totalTime = performance.now() - startTime;
                    this.reportMetrics('images_loaded', this.metrics.imageLoad);
                }
            });
            
            img.addEventListener('error', () => {
                this.metrics.imageLoad[`image_${index}_error`] = {
                    src: img.src,
                    error: true,
                    loadTime: performance.now() - imageStartTime
                };
            });
        });
    }
    
    trackUserInteractions() {
        // Track CTA button clicks
        const ctaButton = document.querySelector('.hero-actions .btn');
        if (ctaButton) {
            ctaButton.addEventListener('click', () => {
                this.metrics.userInteraction.ctaClick = performance.now();
                this.reportMetrics('cta_click', {
                    timestamp: this.metrics.userInteraction.ctaClick,
                    element: 'hero_cta_button'
                });
            });
        }
        
        // Track scroll to main content
        const mainContent = document.querySelector('#main-content');
        if (mainContent) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.metrics.userInteraction.scrollToMain) {
                        this.metrics.userInteraction.scrollToMain = performance.now();
                        this.reportMetrics('scroll_to_main', {
                            timestamp: this.metrics.userInteraction.scrollToMain
                        });
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(mainContent);
        }
        
        // Track assistant bubble interaction
        const assistantBtn = document.getElementById('chatbotBtn');
        if (assistantBtn) {
            assistantBtn.addEventListener('click', () => {
                this.metrics.userInteraction.assistantClick = performance.now();
                this.reportMetrics('assistant_click', {
                    timestamp: this.metrics.userInteraction.assistantClick
                });
            });
        }
    }
    
    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            // Observe Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.reportMetrics('largest_contentful_paint', {
                    value: lastEntry.startTime,
                    element: lastEntry.element?.tagName || 'unknown'
                });
            });
            
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Observe Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.reportMetrics('cumulative_layout_shift', {
                    value: clsValue
                });
            });
            
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    reportMetrics(eventName, data) {
        // Report to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'performance',
                custom_parameter: JSON.stringify(data)
            });
        }
        
        // Log to console for debugging (development only)
        if (!this.isProduction) {
            console.log(`Performance Metric - ${eventName}:`, data);
        }
        
        // Store in local storage for debugging with size limit
        try {
            const existingMetrics = JSON.parse(localStorage.getItem('acabai_performance_metrics') || '{}');
            existingMetrics[eventName] = {
                timestamp: Date.now(),
                data: data
            };
            
            const serialized = JSON.stringify(existingMetrics);
            
            // Check size limit
            if (serialized.length > this.maxStorageSize) {
                // Keep only the last 5 metrics
                const entries = Object.entries(existingMetrics);
                const recentEntries = entries.slice(-5);
                const trimmedMetrics = Object.fromEntries(recentEntries);
                localStorage.setItem('acabai_performance_metrics', JSON.stringify(trimmedMetrics));
            } else {
                localStorage.setItem('acabai_performance_metrics', serialized);
            }
        } catch (e) {
            // Storage failed, silently ignore in production
            if (!this.isProduction) {
                console.warn('Failed to store performance metrics:', e);
            }
        }
    }
    
    // Public method to get all metrics
    getAllMetrics() {
        return {
            current: this.metrics,
            stored: JSON.parse(localStorage.getItem('acabai_performance_metrics') || '{}')
        };
    }
    
    // Public method to clear stored metrics
    clearMetrics() {
        localStorage.removeItem('acabai_performance_metrics');
        this.metrics = {
            pageLoad: {},
            videoLoad: {},
            imageLoad: {},
            userInteraction: {}
        };
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();

// Expose to global scope for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.performanceMonitor = performanceMonitor;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}