// Environment-based configuration
const CONFIG = {
    development: {
        chatbotUrls: [
            'http://localhost:3000', // Local development
            'https://ai-readiness-assessment-eta.vercel.app/'
        ],
        strategy: 'fallback'
    },
    staging: {
        chatbotUrls: [
            'https://main.d2rz9a4li16ohv.amplifyapp.com/',
            'https://ai-readiness-assessment-eta.vercel.app/'
        ],
        strategy: 'random'
    },
    production: {
        chatbotUrls: [
            'https://ai-readiness-assessment-eta.vercel.app/',
            'https://main.d2rz9a4li16ohv.amplifyapp.com/'
        ],
        strategy: 'fallback'
    }
};

// Detect environment
function getEnvironment() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'development';
    } else if (hostname.includes('staging') || hostname.includes('dev')) {
        return 'staging';
    } else {
        return 'production';
    }
}

// Get current config
const currentConfig = CONFIG[getEnvironment()];

// Export config
window.CHATBOT_CONFIG = currentConfig;