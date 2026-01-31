/**
 * ACABAI-PH Video Background Enhancement
 * Handles video loading, fallbacks, and performance optimization
 */

class VideoBackgroundManager {
    constructor() {
        this.video = null;
        this.heroSection = null;
        this.fallbackElement = null;
        this.isVideoSupported = true;
        this.loadTimeout = 10000; // 10 seconds timeout
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.video = document.querySelector('.hero-video');
        this.heroSection = document.querySelector('.hero');
        this.fallbackElement = document.querySelector('.hero-fallback');
        
        if (!this.video || !this.heroSection) {
            console.warn('Video background elements not found');
            return;
        }
        
        // Check for video support and user preferences
        if (!this.shouldUseVideo()) {
            this.useStaticFallback('User preferences or device limitations');
            return;
        }
        
        // Set up video event listeners
        this.setupVideoEvents();
        
        // Set up loading timeout
        this.setupLoadingTimeout();
        
        // Monitor network conditions
        this.monitorNetworkConditions();
        
        console.log('Video background manager initialized');
    }
    
    shouldUseVideo() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Reduced motion preferred - using static background');
            return false;
        }
        
        // Check for video support
        if (!this.video.canPlayType) {
            console.log('Video not supported - using static background');
            return false;
        }
        
        // Check for WebM or MP4 support
        const webmSupport = this.video.canPlayType('video/webm; codecs="vp9"');
        const mp4Support = this.video.canPlayType('video/mp4; codecs="avc1.42E01E"');
        
        if (!webmSupport && !mp4Support) {
            console.log('Required video formats not supported - using static background');
            return false;
        }
        
        return true;
    }
    
    setupVideoEvents() {
        // Video loading events
        this.video.addEventListener('loadstart', () => {
            console.log('Video loading started');
        });
        
        this.video.addEventListener('canplay', () => {
            console.log('Video can start playing');
            this.onVideoReady();
        });
        
        this.video.addEventListener('canplaythrough', () => {
            console.log('Video can play through without buffering');
        });
        
        // Error handling
        this.video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            this.useStaticFallback('Video loading error');
        });
        
        this.video.addEventListener('stalled', () => {
            console.warn('Video loading stalled');
        });
        
        // Playback events
        this.video.addEventListener('play', () => {
            console.log('Video playback started');
        });
        
        this.video.addEventListener('pause', () => {
            console.log('Video playback paused');
        });
    }
    
    setupLoadingTimeout() {
        setTimeout(() => {
            if (this.video.readyState < 3) { // HAVE_FUTURE_DATA
                console.warn('Video loading timeout - using static fallback');
                this.useStaticFallback('Loading timeout');
            }
        }, this.loadTimeout);
    }
    
    monitorNetworkConditions() {
        // Use Network Information API if available
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Check for slow connections
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                console.log('Slow connection detected - using static background');
                this.useStaticFallback('Slow connection');
                return;
            }
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    console.log('Connection became slow - switching to static background');
                    this.useStaticFallback('Connection became slow');
                }
            });
        }
    }
    
    onVideoReady() {
        // Ensure video is playing
        const playPromise = this.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Video playback successful');
                    this.onVideoSuccess();
                })
                .catch((error) => {
                    console.error('Video playback failed:', error);
                    this.useStaticFallback('Playback failed');
                });
        }
    }
    
    onVideoSuccess() {
        // Video is playing successfully
        this.heroSection.classList.remove('no-video');
        
        // Optional: Add analytics tracking
        this.trackVideoSuccess();
    }
    
    useStaticFallback(reason) {
        console.log(`Using static fallback: ${reason}`);
        
        // Add class to show fallback
        this.heroSection.classList.add('no-video');
        
        // Hide video element
        if (this.video) {
            this.video.style.display = 'none';
        }
        
        // Optional: Add analytics tracking
        this.trackVideoFallback(reason);
    }
    
    trackVideoSuccess() {
        // Track successful video loading for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_background_success', {
                event_category: 'performance',
                event_label: 'hero_video'
            });
        }
    }
    
    trackVideoFallback(reason) {
        // Track fallback usage for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_background_fallback', {
                event_category: 'performance',
                event_label: reason
            });
        }
    }
    
    // Public methods for manual control
    pauseVideo() {
        if (this.video && !this.video.paused) {
            this.video.pause();
        }
    }
    
    playVideo() {
        if (this.video && this.video.paused) {
            this.video.play();
        }
    }
    
    toggleVideo() {
        if (this.video) {
            if (this.video.paused) {
                this.playVideo();
            } else {
                this.pauseVideo();
            }
        }
    }
}

// Initialize video background manager
const videoManager = new VideoBackgroundManager();

// Expose to global scope for debugging
window.videoManager = videoManager;

// Handle visibility changes to pause/resume video
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        videoManager.pauseVideo();
    } else {
        videoManager.playVideo();
    }
});

// Handle window focus/blur for performance
window.addEventListener('blur', () => {
    videoManager.pauseVideo();
});

window.addEventListener('focus', () => {
    videoManager.playVideo();
});