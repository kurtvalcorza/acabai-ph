// Chatbot Configuration with Load Balancing Options
class ChatbotManager {
    constructor() {
        this.urls = [
            'https://main.d2rz9a4li16ohv.amplifyapp.com/',
            'https://ai-readiness-assessment-eta.vercel.app/'
        ];
        this.strategy = 'fallback'; // Options: 'fallback', 'random', 'round-robin'
        this.currentIndex = 0;
        this.allowedHostnames = [
            'ai-readiness-assessment-eta.vercel.app',
            'main.d2rz9a4li16ohv.amplifyapp.com',
            'localhost'
        ];
    }

    // Validate URL before loading
    isValidUrl(url) {
        try {
            const parsed = new URL(url);
            // Check protocol
            if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
                return false;
            }
            // Check if hostname is in the exact allowlist
            return this.allowedHostnames.includes(parsed.hostname);
        } catch {
            return false;
        }
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

        const url = this.urls[urlIndex];
        
        // Validate URL before loading
        if (!this.isValidUrl(url)) {
            console.error(`Invalid or untrusted URL detected: ${url}`);
            this.loadWithFallback(iframe, urlIndex + 1);
            return;
        }

        console.log(`Attempting to load chatbot from URL ${urlIndex + 1}: ${url}`);
        iframe.src = url;
        
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
        // Use textContent to prevent XSS
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; font-family: Inter, sans-serif; text-align: center; padding: 2rem;';
        
        const contentDiv = document.createElement('div');
        
        const heading = document.createElement('h3');
        heading.style.cssText = 'color: #1e40af; margin-bottom: 1rem;';
        heading.textContent = 'Service Temporarily Unavailable';
        
        const paragraph = document.createElement('p');
        paragraph.style.cssText = 'color: #6b7280;';
        paragraph.textContent = 'Please try again later or contact us at ';
        
        const emailLink = document.createElement('a');
        emailLink.href = 'mailto:info@asti.dost.gov.ph';
        emailLink.textContent = 'info@asti.dost.gov.ph';
        
        paragraph.appendChild(emailLink);
        contentDiv.appendChild(heading);
        contentDiv.appendChild(paragraph);
        errorDiv.appendChild(contentDiv);
        
        iframe.srcdoc = errorDiv.outerHTML;
    }
}

// Export for use in main script
window.ChatbotManager = ChatbotManager;