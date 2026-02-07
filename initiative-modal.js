/**
 * Initiative Modal
 * Manages modal overlay for displaying full initiative content
 */

// Initiative data structure
const initiativeData = {
    naira: {
        id: 'naira',
        title: 'Nexus for Artificial Intelligence Research and Application (DOST-NAIRA)',
        subtitle: 'Mission Control for 🇵🇭 AI space',
        description: [
            'We are creating an "AI-as-a-Service" platform—an automated factory for AI development that empowers innovators to focus on their mission, not on building the rocket.',
            'By providing centralized access to high-performance computing, curated datasets, and expert guidance, we are removing the friction that has traditionally slowed down AI development. DOST-NAIRA is where government, academe, and industry converge to build the tools that will design our nation\'s future.'
        ],
        image: {
            png: 'assets-optimized/3.png',
            webp: 'assets-optimized/3.webp',
            alt: 'DOST-NAIRA'
        },
        actions: []
    },
    
    dimer: {
        id: 'dimer',
        title: 'Democratized Intelligent Model Exchange Repository (DIMER)',
        subtitle: 'Democratizing AI—One Model at a Time',
        description: [
            'DIMER is the Philippines\' first open repository of AI models, created to make machine learning accessible to those with limited resources. It provides ready-to-use AI models trained on local datasets, APIs, and datasets across strategic sectors.'
        ],
        image: {
            png: 'assets-optimized/2.png',
            webp: 'assets-optimized/2.webp',
            alt: 'DIMER Repository'
        },
        actions: [
            {
                text: 'Explore DIMER',
                url: 'https://dimer5.asti.dost.gov.ph/',
                external: true
            }
        ]
    },
    
    itanong: {
        id: 'itanong',
        title: 'iTANONG: Leveraging NLP for Inclusive Data Access',
        subtitle: 'May gusto ka bang iTANONG?',
        description: [
            'Most valuable data is locked away in complex databases or lengthy documents. iTANONG breaks down these barriers. It is a homegrown AI solution that empowers any Filipino to access information through natural language queries in English, Tagalog, or Taglish.',
            'Using advanced Text-to-SQL and Retrieval-Augmented Generation, iTANONG provides a secure, internal intelligence tool that grounds its answers in your verified data. It\'s about putting the power of data directly into the hands of decision-makers, frontline workers, and citizens—no technical skills required.'
        ],
        image: {
            png: 'assets-optimized/5.gif',
            webp: 'assets-optimized/5.webp',
            alt: 'iTANONG Interface'
        },
        actions: [
            {
                text: 'Explore iTANONG',
                url: 'https://itanong.asti.dost.gov.ph/',
                external: true
            }
        ]
    }
};

class InitiativeModal {
    constructor() {
        this.modal = document.getElementById('initiativeModal');
        if (!this.modal) {
            console.warn('Initiative modal not found');
            return;
        }
        
        this.backdrop = this.modal.querySelector('.modal-backdrop');
        this.closeBtn = this.modal.querySelector('.initiative-modal-close');
        this.modalWindow = this.modal.querySelector('.initiative-modal-window');
        
        // Content elements
        this.titleElement = this.modal.querySelector('[data-modal-title]');
        this.subtitleElement = this.modal.querySelector('[data-modal-subtitle]');
        this.descriptionElement = this.modal.querySelector('[data-modal-description]');
        this.actionsElement = this.modal.querySelector('[data-modal-actions]');
        this.imageElement = this.modal.querySelector('[data-modal-img]');
        this.imageWebpElement = this.modal.querySelector('[data-modal-img-webp]');
        
        // State
        this.isOpen = false;
        this.triggerElement = null;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupReadMoreButtons();
    }
    
    setupEventListeners() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // Prevent modal window clicks from closing
        if (this.modalWindow) {
            this.modalWindow.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    setupReadMoreButtons() {
        // Handle card clicks
        const cards = document.querySelectorAll('.initiative-card');
        cards.forEach(card => {
            // Make card clickable
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (e) => {
                // Find the initiative ID from the card's read-more button
                const button = card.querySelector('.read-more-btn');
                if (button) {
                    const initiativeId = button.getAttribute('data-initiative');
                    if (initiativeId && initiativeData[initiativeId]) {
                        this.open(initiativeData[initiativeId], card);
                    }
                }
            });
        });
        
        // Keep button handlers for backwards compatibility (though buttons are now hidden)
        const readMoreButtons = document.querySelectorAll('.read-more-btn');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent double-triggering
                const initiativeId = button.getAttribute('data-initiative');
                if (initiativeId && initiativeData[initiativeId]) {
                    this.open(initiativeData[initiativeId], button);
                }
            });
        });
    }
    
    open(data, triggerElement) {
        this.triggerElement = triggerElement;
        this.populateContent(data);
        
        // Show modal
        this.modal.classList.add('active');
        this.isOpen = true;
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Setup focus trap
        this.setupFocusTrap();
        
        // Focus close button
        if (this.closeBtn) {
            setTimeout(() => this.closeBtn.focus(), 100);
        }
    }
    
    close() {
        // Hide modal
        this.modal.classList.remove('active');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Return focus to trigger element
        if (this.triggerElement) {
            this.triggerElement.focus();
        }
    }
    
    populateContent(data) {
        // Title
        if (this.titleElement) {
            this.titleElement.textContent = data.title;
        }
        
        // Subtitle
        if (this.subtitleElement) {
            this.subtitleElement.textContent = '';
            const strong = document.createElement('strong');
            strong.textContent = data.subtitle;
            this.subtitleElement.appendChild(strong);
        }
        
        // Description
        if (this.descriptionElement) {
            this.descriptionElement.innerHTML = '';
            data.description.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                this.descriptionElement.appendChild(p);
            });
        }
        
        // Image
        if (this.imageElement && this.imageWebpElement) {
            this.imageElement.src = data.image.png;
            this.imageElement.alt = data.image.alt;
            this.imageWebpElement.srcset = data.image.webp;
        }
        
        // Actions
        if (this.actionsElement) {
            this.actionsElement.innerHTML = '';
            data.actions.forEach(action => {
                const link = document.createElement('a');
                link.href = action.url;
                link.textContent = action.text;
                link.className = 'btn btn-outline';
                if (action.external) {
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                }
                this.actionsElement.appendChild(link);
            });
        }
    }
    
    setupFocusTrap() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        
        this.focusableElements = Array.from(
            this.modalWindow.querySelectorAll(focusableSelectors)
        ).filter(el => el.offsetParent !== null);
        
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
        
        this.handleTabKey = this.handleTabKey.bind(this);
        this.modalWindow.addEventListener('keydown', this.handleTabKey);
    }
    
    removeFocusTrap() {
        if (this.modalWindow && this.handleTabKey) {
            this.modalWindow.removeEventListener('keydown', this.handleTabKey);
        }
    }
    
    handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    }
}

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const modal = new InitiativeModal();
});
