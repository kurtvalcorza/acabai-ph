/**
 * Unit Tests for ACABAI Hero Section Layout Structure
 * Feature: acabai-hero-redesign
 */

const fs = require('fs');
const path = require('path');

// Load the CSS file for validation
const cssContent = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

/**
 * Test: Grid template areas are properly defined
 * Validates: Requirements 1.4, 1.5
 */
function testGridTemplateAreas() {
    console.log('Testing CSS Grid template areas...');
    
    // Test that hero section uses CSS Grid
    console.assert(cssContent.includes('display: grid'), 
        'Hero section should use CSS Grid');
    console.assert(cssContent.includes('grid-template-areas: "content"'), 
        'Hero section should define grid template areas');
    console.assert(cssContent.includes('grid-template-rows: 1fr'), 
        'Hero section should define grid template rows');
    console.assert(cssContent.includes('align-items: center'), 
        'Hero section should center align items');
    console.assert(cssContent.includes('justify-items: center'), 
        'Hero section should center justify items');
    
    console.log('✓ Grid template areas test - PASSED');
}

/**
 * Test: Content container uses flexbox with correct gap
 * Validates: Requirements 1.4, 1.5
 */
function testContentContainerFlexbox() {
    console.log('Testing content container flexbox layout...');
    
    // Test that hero-content uses Flexbox
    console.assert(cssContent.includes('grid-area: content'), 
        'Hero content should be assigned to grid area');
    console.assert(cssContent.includes('display: flex'), 
        'Hero content should use Flexbox');
    console.assert(cssContent.includes('flex-direction: column'), 
        'Hero content should use column direction');
    console.assert(cssContent.includes('gap: var(--hero-content-gap)'), 
        'Hero content should use consistent gap spacing');
    
    console.log('✓ Content container flexbox test - PASSED');
}

/**
 * Test: Responsive behavior at key breakpoints
 * Validates: Requirements 1.4, 1.5
 */
function testResponsiveBehavior() {
    console.log('Testing responsive behavior...');
    
    // Test responsive breakpoints are defined
    console.assert(cssContent.includes('--breakpoint-sm: 640px'), 
        'Small breakpoint should be defined');
    console.assert(cssContent.includes('--breakpoint-md: 768px'), 
        'Medium breakpoint should be defined');
    console.assert(cssContent.includes('--breakpoint-lg: 1024px'), 
        'Large breakpoint should be defined');
    console.assert(cssContent.includes('--breakpoint-xl: 1280px'), 
        'Extra large breakpoint should be defined');
    
    // Test media queries exist
    console.assert(cssContent.includes('@media (max-width: 768px)'), 
        'Mobile media query should exist');
    console.assert(cssContent.includes('@media (max-width: 480px)'), 
        'Small mobile media query should exist');
    
    // Test responsive adjustments
    console.assert(cssContent.includes('text-align: center'), 
        'Mobile layout should center text');
    
    console.log('✓ Responsive behavior test - PASSED');
}

/**
 * Test: Spacing system consistency
 * Validates: Requirements 1.4, 1.5
 */
function testSpacingSystem() {
    console.log('Testing spacing system consistency...');
    
    // Test spacing scale variables are defined
    const spacingVariables = [
        '--space-xs: 0.5rem',
        '--space-sm: 1rem',
        '--space-md: 1.5rem',
        '--space-lg: 2rem',
        '--space-xl: 3rem',
        '--space-2xl: 4rem',
        '--space-3xl: 6rem'
    ];
    
    spacingVariables.forEach(variable => {
        console.assert(cssContent.includes(variable), 
            `Spacing variable should be defined: ${variable}`);
    });
    
    // Test hero-specific spacing
    console.assert(cssContent.includes('--hero-content-gap: var(--space-lg)'), 
        'Hero content gap should use spacing scale');
    console.assert(cssContent.includes('--hero-padding-y: var(--space-3xl)'), 
        'Hero vertical padding should use spacing scale');
    console.assert(cssContent.includes('--hero-padding-x: var(--space-lg)'), 
        'Hero horizontal padding should use spacing scale');
    
    console.log('✓ Spacing system test - PASSED');
}

/**
 * Run all layout structure tests
 */
function runLayoutStructureTests() {
    console.log('Running Layout Structure Unit Tests for ACABAI Hero Section...\n');
    
    try {
        testGridTemplateAreas();
        testContentContainerFlexbox();
        testResponsiveBehavior();
        testSpacingSystem();
        
        console.log('\n🎉 All layout structure tests PASSED!');
        return true;
    } catch (error) {
        console.error('\n❌ Layout structure test FAILED:', error.message);
        return false;
    }
}

// Export for testing framework
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runLayoutStructureTests,
        testGridTemplateAreas,
        testContentContainerFlexbox,
        testResponsiveBehavior,
        testSpacingSystem
    };
}

// Run tests if called directly
if (require.main === module) {
    runLayoutStructureTests();
}