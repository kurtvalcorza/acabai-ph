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
        this.isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
        
        this.init();
    }
    
    // Sanitize error details for production
    sanitizeError(errorDetails) {
        if (this.isProduction) {
            return {
                code: 'VIDEO_ERROR',
                message: 'An error occurred loading the video',
                timestamp: Date.now()
            };
        }
        return errorDetails;
    }
    
    // Safe logging that respects environment
    safeLog(level, message, data = null) {
        if (this.isProduction && level === 'error') {
            // In production, only log sanitized errors
            console.error(message, this.sanitizeError(data));
        } else if (!this.isProduction) {
            // In development, log everything
            if (level === 'error') {
                console.error(message, data);
            } else if (level === 'warn') {
                console.warn(message, data);
            } else {
                console.log(message, data);
            }
        }
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
            this.safeLog('warn', 'Video background elements not found');
            return;
        }
        
        // Check for video support and user preferences
        if (!this.shouldUseVideo()) {
            this.useStaticFallback('User preferences or device limitations');
            return;
        }
        
        // Set up global error handling
        this.setupGlobalErrorHandling();
        
        // Set up video event listeners
        this.setupVideoEvents();
        
        // Set up loading timeout
        this.setupLoadingTimeout();
        
        // Monitor network conditions
        this.monitorNetworkConditions();
        
        this.safeLog('log', 'Video background manager initialized');
    }
    
    setupGlobalErrorHandling() {
        // Handle unhandled promise rejections related to video
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.toString().toLowerCase().includes('video')) {
                this.safeLog('warn', 'Video-related promise rejection:', event.reason);
                this.trackVideoError({
                    code: 'promise_rejection',
                    message: event.reason.toString(),
                    networkState: this.video?.networkState || 'unknown',
                    readyState: this.video?.readyState || 'unknown',
                    timestamp: Date.now()
                });
                this.useStaticFallback('Promise rejection');
                event.preventDefault();
            }
        });
        
        // Handle general errors that might affect video
        window.addEventListener('error', (event) => {
            if (event.filename && event.filename.includes('video-background')) {
                this.safeLog('warn', 'Video background script error:', event.error);
                this.useStaticFallback('Script error');
            }
        });
    }
    
    shouldUseVideo() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.safeLog('log', 'Reduced motion preferred - using static background');
            return false;
        }
        
        // Check for video support
        if (!this.video.canPlayType) {
            this.safeLog('log', 'Video not supported - using static background');
            return false;
        }
        
        // Check for WebM or MP4 support
        const webmSupport = this.video.canPlayType('video/webm; codecs="vp9"');
        const mp4Support = this.video.canPlayType('video/mp4; codecs="avc1.42E01E"');
        
        if (!webmSupport && !mp4Support) {
            this.safeLog('log', 'Required video formats not supported - using static background');
            return false;
        }
        
        return true;
    }
    
    setupVideoEvents() {
        // Track loading start time for performance metrics
        this.loadStartTime = performance.now();
        
        // Video loading events
        this.video.addEventListener('loadstart', () => {
            this.safeLog('log', 'Video loading started');
            this.trackVideoEvent('loadstart');
        });
        
        this.video.addEventListener('canplay', () => {
            this.safeLog('log', 'Video can start playing');
            this.trackVideoEvent('canplay');
            this.onVideoReady();
        });
        
        this.video.addEventListener('canplaythrough', () => {
            this.safeLog('log', 'Video can play through without buffering');
            this.trackVideoEvent('canplaythrough');
        });
        
        // Enhanced error handling
        this.video.addEventListener('error', (e) => {
            const errorDetails = {
                code: e.target.error?.code || 'unknown',
                message: e.target.error?.message || 'Unknown video error',
                networkState: e.target.networkState,
                readyState: e.target.readyState,
                timestamp: Date.now()
            };
            
            this.safeLog('error', 'Video loading error:', errorDetails);
            this.trackVideoError(errorDetails);
            this.useStaticFallback('Video loading error');
        });
        
        this.video.addEventListener('stalled', () => {
            this.safeLog('warn', 'Video loading stalled');
            this.trackVideoEvent('stalled');
        });
        
        this.video.addEventListener('suspend', () => {
            this.safeLog('warn', 'Video loading suspended');
            this.trackVideoEvent('suspend');
        });
        
        this.video.addEventListener('abort', () => {
            this.safeLog('warn', 'Video loading aborted');
            this.trackVideoEvent('abort');
        });
        
        // Playback events
        this.video.addEventListener('play', () => {
            this.safeLog('log', 'Video playback started');
            this.trackVideoEvent('play');
        });
        
        this.video.addEventListener('pause', () => {
            this.safeLog('log', 'Video playback paused');
            this.trackVideoEvent('pause');
        });
        
        this.video.addEventListener('ended', () => {
            this.safeLog('log', 'Video playback ended');
            this.trackVideoEvent('ended');
        });
    }
    
    setupLoadingTimeout() {
        setTimeout(() => {
            if (this.video.readyState < 3) { // HAVE_FUTURE_DATA
                this.safeLog('warn', 'Video loading timeout - using static fallback');
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
                this.safeLog('log', 'Slow connection detected - using static background');
                this.useStaticFallback('Slow connection');
                return;
            }
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    this.safeLog('log', 'Connection became slow - switching to static background');
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
                    this.safeLog('log', 'Video playback successful');
                    this.onVideoSuccess();
                })
                .catch((error) => {
                    this.safeLog('error', 'Video playback failed:', error);
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
        this.safeLog('log', `Using static fallback: ${reason}`);
        
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
        const loadTime = performance.now() - this.loadStartTime;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_background_success', {
                event_category: 'performance',
                event_label: 'hero_video',
                load_time: Math.round(loadTime),
                video_resolution: `${this.video.videoWidth}x${this.video.videoHeight}`,
                video_duration: Math.round(this.video.duration || 0)
            });
        }
        
        // Log performance metrics (only in development)
        if (!this.isProduction) {
            console.log(`Video loaded successfully in ${Math.round(loadTime)}ms`);
        }
    }
    
    trackVideoError(errorDetails) {
        // Track video errors for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_background_error', {
                event_category: 'error',
                event_label: errorDetails.code,
                error_message: errorDetails.message,
                network_state: errorDetails.networkState,
                ready_state: errorDetails.readyState
            });
        }
    }
    
    trackVideoEvent(eventType) {
        // Track video events for debugging
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_background_event', {
                event_category: 'video_lifecycle',
                event_label: eventType,
                timestamp: Date.now()
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

// Expose to global scope for debugging (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.videoManager = videoManager;
}

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