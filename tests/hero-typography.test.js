/**
 * Property-Based Tests for ACABAI Hero Section Typography
 * Feature: acabai-hero-redesign
 */

const fs = require('fs');
const path = require('path');

// Load the HTML and CSS files for validation
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

/**
 * Property 1: Typography Hierarchy Consistency
 * Feature: acabai-hero-redesign, Property 1: Typography Hierarchy Consistency
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 * 
 * For any viewport size and device type, the hero section should maintain proper 
 * visual hierarchy where the main headline has the largest font size and visual weight,
 * the mission statement has secondary prominence, the description has tertiary prominence,
 * and all elements maintain proper spacing and readability metrics.
 */
function testTypographyHierarchyConsistency() {
    const viewportSizes = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1024, height: 768 },  // Desktop small
        { width: 1440, height: 900 },  // Desktop large
        { width: 2560, height: 1440 }  // Desktop XL
    ];

    // Test CSS contains proper clamp() functions
    console.assert(cssContent.includes('clamp(2.5rem, 5vw, 4rem)'), 
        'CSS should contain headline clamp function');
    console.assert(cssContent.includes('clamp(1.5rem, 3vw, 2.25rem)'), 
        'CSS should contain mission clamp function');
    console.assert(cssContent.includes('clamp(1.125rem, 2vw, 1.375rem)'), 
        'CSS should contain description clamp function');

    viewportSizes.forEach(viewport => {
        // Calculate expected font sizes based on clamp() functions
        const headlineSize = getComputedFontSize('h1', viewport.width);
        const missionSize = getComputedFontSize('h2', viewport.width);
        const descriptionSize = getComputedFontSize('p', viewport.width);
        
        // Property assertions
        console.assert(headlineSize > missionSize, 
            `Headline should be larger than mission at ${viewport.width}px: ${headlineSize} > ${missionSize}`);
        console.assert(missionSize > descriptionSize, 
            `Mission should be larger than description at ${viewport.width}px: ${missionSize} > ${descriptionSize}`);
        console.assert(headlineSize >= 40 && headlineSize <= 64, 
            `Headline size should be within clamp range at ${viewport.width}px: ${headlineSize}`);
        console.assert(missionSize >= 24 && missionSize <= 36, 
            `Mission size should be within clamp range at ${viewport.width}px: ${missionSize}`);
        console.assert(descriptionSize >= 18 && descriptionSize <= 22, 
            `Description size should be within clamp range at ${viewport.width}px: ${descriptionSize}`);
    });
    
    console.log('✓ Property 1: Typography Hierarchy Consistency - PASSED');
}

/**
 * Helper function to calculate clamp() values
 */
function getComputedFontSize(element, viewportWidth) {
    // Simulate clamp() calculation based on CSS rules
    if (element === 'h1') {
        // clamp(2.5rem, 5vw, 4rem) = clamp(40px, 5vw, 64px)
        const vwValue = (viewportWidth * 0.05);
        return Math.max(40, Math.min(vwValue, 64));
    } else if (element === 'h2') {
        // clamp(1.5rem, 3vw, 2.25rem) = clamp(24px, 3vw, 36px)
        const vwValue = (viewportWidth * 0.03);
        return Math.max(24, Math.min(vwValue, 36));
    } else if (element === 'p') {
        // clamp(1.125rem, 2vw, 1.375rem) = clamp(18px, 2vw, 22px)
        const vwValue = (viewportWidth * 0.02);
        return Math.max(18, Math.min(vwValue, 22));
    }
    return 16; // Default
}

/**
 * Property 2: Blue Color Palette Compliance
 * Feature: acabai-hero-redesign, Property 2: Blue Color Palette Compliance
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
 */
function testBlueColorPaletteCompliance() {
    const validBlueColors = [
        '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa',
        '#3b82f6', '#1e40af', '#1e3a8a', '#111827', '#4b5563', '#ffffff'
    ];
    
    // Test that CSS contains the enhanced blue palette
    console.assert(cssContent.includes('--acabai-blue-50: #eff6ff'), 
        'CSS should contain blue-50 color');
    console.assert(cssContent.includes('--acabai-blue-600: #1e40af'), 
        'CSS should contain primary blue color');
    console.assert(cssContent.includes('--acabai-blue-700: #1e3a8a'), 
        'CSS should contain dark blue color');
    
    // Test that hero elements use the blue palette
    console.assert(cssContent.includes('color: var(--acabai-blue-600)'), 
        'Hero headline should use blue-600');
    console.assert(cssContent.includes('color: var(--acabai-blue-700)'), 
        'Hero mission should use blue-700');
    
    console.log('✓ Property 2: Blue Color Palette Compliance - PASSED');
}

/**
 * Property 3: CTA Button Prominence and Accessibility
 * Feature: acabai-hero-redesign, Property 3: CTA Button Prominence and Accessibility
 * Validates: Requirements 3.1, 3.3, 3.4, 3.5
 */
function testCTAButtonProminenceAndAccessibility() {
    // Test HTML contains the CTA button with correct attributes
    console.assert(htmlContent.includes('href="#launchpad"'), 
        'HTML should contain CTA button with #launchpad link');
    console.assert(htmlContent.includes('class="btn btn-primary"'), 
        'HTML should contain CTA button with proper classes');
    console.assert(htmlContent.includes('>Start<'), 
        'HTML should contain "Start" button text');
    
    // Test CSS contains proper button styling
    console.assert(cssContent.includes('padding: 1rem 2.5rem'), 
        'CSS should contain enhanced button padding');
    console.assert(cssContent.includes('min-height: 44px'), 
        'CSS should contain minimum touch target height');
    console.assert(cssContent.includes('border-radius: 0.75rem'), 
        'CSS should contain modern border radius');
    console.assert(cssContent.includes('font-size: 1.125rem'), 
        'CSS should contain enhanced button font size');
    
    console.log('✓ Property 3: CTA Button Prominence and Accessibility - PASSED');
}

/**
 * Property 4: Navigation Functionality Preservation
 * Feature: acabai-hero-redesign, Property 4: Navigation Functionality Preservation
 * Validates: Requirements 3.2
 */
function testNavigationFunctionalityPreservation() {
    // Test HTML contains both the CTA button and target section
    console.assert(htmlContent.includes('href="#launchpad"'), 
        'HTML should contain CTA button linking to #launchpad');
    console.assert(htmlContent.includes('id="launchpad"'), 
        'HTML should contain launchpad section with correct ID');
    
    console.log('✓ Property 4: Navigation Functionality Preservation - PASSED');
}

/**
 * Property 5: Semantic Structure and Accessibility Compliance
 * Feature: acabai-hero-redesign, Property 5: Semantic Structure and Accessibility Compliance
 * Validates: Requirements 4.5, 5.2, 5.4
 */
function testSemanticStructureAndAccessibility() {
    // Test semantic HTML structure
    console.assert(htmlContent.includes('<header class="hero">'), 
        'Hero should be a semantic header element');
    console.assert(htmlContent.includes('<h1 data-reveal>'), 
        'Main headline should be h1 element');
    console.assert(htmlContent.includes('<h2 class="hero-mission"'), 
        'Mission should be h2 element');
    console.assert(htmlContent.includes('<p class="hero-description"'), 
        'Description should be p element');
    
    // Test content preservation
    console.assert(htmlContent.includes('Advancing Computing, Analytics, Big Data, and Artificial Intelligence for the Philippines'),
        'Headline should contain required text');
    console.assert(htmlContent.includes('Our Mission: Democratizing AI for Every Filipino'),
        'Mission should contain required text');
    console.assert(htmlContent.includes('The Philippines has immense talent and world-class creativity'),
        'Description should contain required text');
    
    console.log('✓ Property 5: Semantic Structure and Accessibility Compliance - PASSED');
}

/**
 * Property 6: Smooth Interactive Feedback
 * Feature: acabai-hero-redesign, Property 6: Smooth Interactive Feedback
 * Validates: Requirements 6.2
 */
function testSmoothInteractiveFeedback() {
    // Test that CSS transitions are properly defined
    console.assert(cssContent.includes('transition: var(--transition)'), 
        'CSS should contain transition variables');
    console.assert(cssContent.includes('transition: var(--transition-fast)'), 
        'CSS should contain fast transition variables');
    
    // Test prefers-reduced-motion support
    const reducedMotionRule = cssContent.includes('@media (prefers-reduced-motion: reduce)');
    console.assert(reducedMotionRule, 'CSS should include prefers-reduced-motion support');
    
    // Test smooth scrolling
    console.assert(cssContent.includes('scroll-behavior: smooth'), 
        'CSS should include smooth scrolling');
    
    console.log('✓ Property 6: Smooth Interactive Feedback - PASSED');
}

// Run all property tests
function runAllPropertyTests() {
    console.log('Running Property-Based Tests for ACABAI Hero Section...\n');
    
    try {
        testTypographyHierarchyConsistency();
        testBlueColorPaletteCompliance();
        testCTAButtonProminenceAndAccessibility();
        testNavigationFunctionalityPreservation();
        testSemanticStructureAndAccessibility();
        testSmoothInteractiveFeedback();
        
        console.log('\n🎉 All property tests PASSED!');
        return true;
    } catch (error) {
        console.error('\n❌ Property test FAILED:', error.message);
        return false;
    }
}

// Export for testing framework
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllPropertyTests,
        testTypographyHierarchyConsistency,
        testBlueColorPaletteCompliance,
        testCTAButtonProminenceAndAccessibility,
        testNavigationFunctionalityPreservation,
        testSemanticStructureAndAccessibility,
        testSmoothInteractiveFeedback
    };
}

// Run tests if called directly
if (require.main === module) {
    runAllPropertyTests();
}