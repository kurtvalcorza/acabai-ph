// Chatbot Configuration with Load Balancing Options
class ChatbotManager {
    constructor() {
        this.urls = [
            'https://ai-readiness-assessment-eta.vercel.app/',
            'https://main.d2rz9a4li16ohv.amplifyapp.com/'
        ];
        this.strategy = 'fallback'; // Options: 'fallback', 'random', 'round-robin'
        this.currentIndex = 0;
    }

    // Get URL based on strategy
    getUrl() {
        switch (this.strategy) {
            case 'random':
                return this.urls[Math.floor(Math.random() * this.urls.length)];
            
            case 'round-robin':
                const url = this.urls[this.currentIndex];
                this.currentIndex = (this.currentIndex + 1) % this.urls.length;
                return url;
            
            case 'fallback':
            default:
                return this.urls[0]; // Primary URL for fallback strategy
        }
    }

    // Load chatbot with selected strategy
    loadChatbot(iframe) {
        if (this.strategy === 'fallback') {
            this.loadWithFallback(iframe);
        } else {
            iframe.src = this.getUrl();
        }
    }

    // Fallback implementation with improved error detection
    loadWithFallback(iframe, urlIndex = 0) {
        if (urlIndex >= this.urls.length) {
            this.showErrorMessage(iframe);
            return;
        }

        console.log(`Attempting to load chatbot from URL ${urlIndex + 1}: ${this.urls[urlIndex]}`);
        iframe.src = this.urls[urlIndex];
        
        let hasLoaded = false;
        let timeoutId;
        
        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            iframe.removeEventListener('error', errorHandler);
            iframe.removeEventListener('load', loadHandler);
        };
        
        const errorHandler = () => {
            if (hasLoaded) return;
            hasLoaded = true;
            cleanup();
            console.warn(`Chatbot URL ${urlIndex + 1} failed with error, trying fallback...`);
            this.loadWithFallback(iframe, urlIndex + 1);
        };
        
        const loadHandler = () => {
            if (hasLoaded) return;
            hasLoaded = true;
            cleanup();
            console.log(`Chatbot URL ${urlIndex + 1} loaded successfully`);
        };
        
        iframe.addEventListener('error', errorHandler);
        iframe.addEventListener('load', loadHandler);
        
        // Shorter timeout for faster fallback
        timeoutId = setTimeout(() => {
            if (hasLoaded) return;
            hasLoaded = true;
            cleanup();
            console.warn(`Chatbot URL ${urlIndex + 1} timed out after 5 seconds, trying fallback...`);
            this.loadWithFallback(iframe, urlIndex + 1);
        }, 5000); // Reduced from 10 seconds to 5 seconds
        
        // Additional check: Monitor if iframe content actually loads
        setTimeout(() => {
            if (hasLoaded) return;
            try {
                // Check if iframe has any content or if it's still loading
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc || iframeDoc.readyState === 'loading') {
                    // Still loading after 2 seconds, might be connection issue
                    return;
                }
                if (iframeDoc.body && iframeDoc.body.innerHTML.trim() === '') {
                    // Empty body might indicate failed load
                    console.warn(`Chatbot URL ${urlIndex + 1} appears to have failed loading (empty content), trying fallback...`);
                    if (!hasLoaded) {
                        hasLoaded = true;
                        cleanup();
                        this.loadWithFallback(iframe, urlIndex + 1);
                    }
                }
            } catch (e) {
                // Cross-origin restrictions prevent access, which is normal
                // This means the iframe is likely loading correctly
            }
        }, 2000);
    }

    showErrorMessage(iframe) {
        iframe.srcdoc = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-family: Inter, sans-serif; text-align: center; padding: 2rem;">
                <div>
                    <h3 style="color: #1e40af; margin-bottom: 1rem;">Service Temporarily Unavailable</h3>
                    <p style="color: #6b7280;">Please try again later or contact us at <a href="mailto:info@asti.dost.gov.ph">info@asti.dost.gov.ph</a></p>
                </div>
            </div>
        `;
    }
}

// Export for use in main script
window.ChatbotManager = ChatbotManager;