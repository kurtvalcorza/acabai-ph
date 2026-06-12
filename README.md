# ACABAI-PH Website

**Advancing Computing, Analytics, Big Data, and Artificial Intelligence for the Philippines**

A modern, responsive website showcasing the Philippines' AI initiatives under DOST-ASTI, featuring NAIRA, DIMER, and iTANONG platforms.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd acabai-ph

# Start local development server
npm run dev
# or
python -m http.server 8000

# Open browser to http://localhost:8000
```

## 📁 Project Structure

```
acabai-ph/
├── index.html                     # Main HTML file
├── style.css                      # Styles and responsive design
├── script.js                      # Interactive functionality and chatbot modal
├── chatbot-config.js              # Chatbot failover and load balancing
├── carousel.js                    # Infinite-scrolling initiative carousel
├── initiative-modal.js            # Modal overlay for initiative content
├── video-background.js            # Video background management
├── performance-monitor.js         # Performance optimization
├── vercel-analytics-init.js       # Vercel Analytics bootstrap
├── vercel-speed-insights-init.js  # Vercel Speed Insights bootstrap
├── assets-optimized/              # Optimized images and media
├── vercel.json                    # Vercel deployment config and security headers
├── amplify.yml                    # AWS Amplify deployment config (mirror, currently paused)
└── package.json                   # Project configuration
```

## 🛠 Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Fonts**: Inter (Google Fonts)
- **Performance**: Optimized assets, lazy loading
- **Analytics**: Vercel Analytics and Speed Insights
- **Server**: Python HTTP server for development

## ✨ Features

- Responsive design for all device sizes
- Interactive hero section with video background
- **AI chatbot with URL validation and automatic failover support** (Amplify backup temporarily paused for cost savings)
- Performance monitoring and optimization
- SEO-optimized with Open Graph metadata
- Accessibility-compliant design
- Fast loading with optimized assets

## Advancing Computing, Analytics, Big Data, and Artificial Intelligence for the Philippines

### 🎯 Our Mission: Democratize AI for Every Filipino

The Philippines has immense talent and world-class creativity. Yet, for too long, our innovators have been stalled by limited access to powerful AI tools. High costs, a persistent digital divide, and siloed efforts have held back our nation's potential.

### Your Launchpad for AI Innovation

ACABAI-PH is our strategic response. We are building the national launchpad for Filipino AI innovation, providing the infrastructure, tools, and collaborative environment needed to turn brilliant ideas into high-impact solutions. Our goal is to ensure that the next world-changing innovation doesn't stay grounded, but achieves escape velocity to benefit every corner of the archipelago.

Learn more about ACABAI-PH: 
https://www.youtube.com/watch?v=-S1wofdiRr4

## Key Initiatives

### Nexus for Artificial Intelligence Research and Application (DOST-NAIRA)

**Mission Control for 🇵🇭 AI space**

We are creating an "AI-as-a-Service" platform—an automated factory for AI development that empowers innovators to focus on their mission, not on building the rocket.

By providing centralized access to high-performance computing, curated datasets, and expert guidance, we are removing the friction that has traditionally slowed down AI development. DOST-NAIRA is where government, academe, and industry converge to build the tools that will design our nation's future.

#### Democratized Intelligent Model Exchange Repository (DIMER)

**Democratizing AI—One Model at a Time**

DIMER is the Philippines’ first open repository of AI models, created to make machine learning accessible to those with limited resources. It provides ready-to-use AI models trained on local datasets, APIs, and datasets across strategic sectors.
- **Disaster Resilience:** Rapidly identify landslide-affected zones from satellite imagery
- **Urban Planning:** Analyze traffic flow with models that understand our unique mix of vehicles
- **Food Security:** Accelerate the mapping of every rice field in the country to safeguard our food supply

Explore DIMER (public beta): 
https://launchstaging.dimer1.asti.dost.gov.ph/

### iTANONG: Leveraging NLP for Inclusive Data Access

**May gusto ka bang iTANONG?**

Most valuable data is locked away in complex databases or lengthy documents. iTANONG breaks down these barriers. It is a homegrown AI solution that empowers any Filipino to access information through natural language queries in English, Tagalog, or Taglish.

Using advanced Text-to-SQL and Retrieval-Augmented Generation, iTANONG provides a secure, internal intelligence tool that grounds its answers in your verified data. It's about putting the power of data directly into the hands of decision-makers, frontline workers, and citizens—no technical skills required.

Explore iTANONG: 
https://itanong.asti.dost.gov.ph/

## 🎯 Get Started with Your AI Readiness Assessment 

Be empowered to leverage AI in addressing real-world challenges! 

Interact with our Self-Service AI Readiness Assessment Tool—an intelligent chatbot designed to help organizations quickly assess their readiness to adopt and deploy AI solutions. 

Through a guided, conversational experience, the chatbot will:
- Identify your organization’s current AI maturity and capabilities
- Highlight potential use cases aligned with your needs
- Surface areas where support, partnerships, or pilot projects may be most impactful

For partnership inquiries, pilot collaborations, or follow-up discussions, you may also contact us at info@asti.dost.gov.ph.

### Connect with DOST-ASTI

- **Email:** info@asti.dost.gov.ph
- **Website:** https://asti.dost.gov.ph/
- **Facebook:** https://www.facebook.com/DOSTASTI
- **LinkedIn:** https://www.linkedin.com/company/dost-asti/
- **X (Twitter):** https://x.com/dostasti
- **YouTube:** https://www.youtube.com/@DOST-ASTI
- **Instagram:** https://www.instagram.com/dost_asti

## 🏗 Development

### Prerequisites
- Python 3.x (for local server)
- Modern web browser
- Git

### Local Development
```bash
# Start development server
npm run dev

# Alternative methods
python -m http.server 8000
# or
python3 -m http.server 8000
```

### Performance Monitoring
The site includes built-in performance monitoring via `performance-monitor.js` that tracks:
- Page load times
- Resource loading
- User interactions
- Core Web Vitals

### Chatbot Hosting & Redundancy

The AI Readiness Assessment chatbot is served from Vercel, with failover support built in for a backup instance:

- **Primary Instance:** Vercel (https://ai-readiness-assessment-eta.vercel.app/)
- **Backup Instance:** AWS Amplify (https://main.d2rz9a4li16ohv.amplifyapp.com/) — **temporarily paused to stop billing** and removed from the failover rotation in `chatbot-config.js`

#### Automatic Failover System

The website implements an intelligent fallback system:

1. **URL Validation:** Every chatbot URL is validated against an HTTPS hostname allowlist before it is loaded, regardless of the selected strategy
2. **Default Behavior:** Attempts to load the Vercel instance first (primary)
3. **Automatic Fallback:** Each host is probed for network reachability before loading; if a host is unreachable, fails, or times out (5 seconds), the next configured URL is tried
4. **Error Handling:** If all configured instances fail, displays a user-friendly error message with contact information
5. **Performance Optimization:** Preloads the chatbot on hover; the chatbot also loads when the modal is opened by click or keyboard, so no input method depends on hover

#### Cost Optimization Strategy

- **Primary Traffic:** Routed to Vercel to minimize AWS costs
- **AWS Amplify:** Currently paused in AWS Console to stop billing; its hostname remains in the code allowlist and CSP headers so no security config changes are needed to bring it back
- **Disaster Recovery:** To re-enable the backup, restore the Amplify app and re-add its URL to `urls` in `chatbot-config.js` (a commented-out entry marks the spot)

#### Configuration Options

The chatbot manager supports multiple load balancing strategies (configured in `chatbot-config.js`):

- **`fallback`** (Default): Primary → Backup sequence
- **`random`**: Random selection between both instances
- **`round-robin`**: Alternates between instances for load distribution

#### Testing Failover

To test the fallback functionality (requires more than one URL configured in `chatbot-config.js`):
1. Open browser Developer Tools → Network tab
2. Block requests to the primary Vercel URL
3. Open the chatbot - it should automatically fall back to the next configured URL
4. Check console for fallback process warnings

With only the Vercel instance configured (current state), blocking it shows the "Service Temporarily Unavailable" message instead.

## 🚀 Deployment

The site is deployed on multiple platforms:

- **Primary:** Vercel - https://acabai-ph.vercel.app/ (default deployment)
- **Mirror:** AWS Amplify - https://master.d3bx5uqqofxvve.amplifyapp.com/ — **temporarily paused to stop billing**; `amplify.yml` is kept for when it is re-enabled

### Deployment Strategy

**Normal Operations:**
- Vercel serves as the primary deployment for both static site and chatbot
- AWS Amplify can be paused in AWS Console to reduce costs
- TinyURL or custom short links can point to Vercel deployment

**Disaster Recovery:**
- If Vercel experiences downtime, re-enable the AWS Amplify deployments
- Update TinyURL/short links to point to AWS Amplify URL
- Re-add the Amplify chatbot URL to `urls` in `chatbot-config.js` to restore automatic failover

For manual deployment:
1. Build optimized assets
2. Upload to web server
3. Ensure proper MIME types for all assets

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT — built with AI. See [LICENSE](LICENSE) for the full text.
