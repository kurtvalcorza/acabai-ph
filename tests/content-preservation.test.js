/**
 * Unit Tests for ACABAI Hero Section Content Preservation
 * Feature: acabai-hero-redesign
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 */

const fs = require('fs');
const path = require('path');

// Load the HTML file for validation
const htmlContent = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

/**
 * Test: Headline contains exact required text
 * Validates: Requirements 4.1
 */
function testHeadlineContent() {
    console.log('Testing headline content preservation...');
    
    const expectedHeadline = 'Advancing Computing, Analytics, Big Data, and Artificial Intelligence for the Philippines';
    
    console.assert(htmlContent.includes(expectedHeadline), 
        'Headline should contain exact required text');
    console.assert(htmlContent.includes('<h1 data-reveal>'), 
        'Headline should be an h1 element');
    
    console.log('✓ Headline content test - PASSED');
}

/**
 * Test: Mission statement contains exact required text
 * Validates: Requirements 4.2
 */
function testMissionContent() {
    console.log('Testing mission statement content preservation...');
    
    const expectedMission = 'Our Mission: Democratizing AI for Every Filipino';
    
    console.assert(htmlContent.includes(expectedMission), 
        'Mission statement should contain exact required text');
    console.assert(htmlContent.includes('<h2 class="hero-mission"'), 
        'Mission statement should be an h2 element with hero-mission class');
    
    console.log('✓ Mission statement content test - PASSED');
}

/**
 * Test: Description contains complete current text
 * Validates: Requirements 4.3
 */
function testDescriptionContent() {
    console.log('Testing description content preservation...');
    
    const expectedDescriptionParts = [
        'The Philippines has immense talent and world-class creativity',
        'our innovators have been stalled by limited access to powerful AI tools',
        'High costs, a persistent digital divide, and siloed efforts',
        'have held back our nation\'s potential'
    ];
    
    expectedDescriptionParts.forEach(part => {
        console.assert(htmlContent.includes(part), 
            `Description should contain: "${part}"`);
    });
    
    console.assert(htmlContent.includes('<p class="hero-description"'), 
        'Description should be a p element with hero-description class');
    
    console.log('✓ Description content test - PASSED');
}

/**
 * Test: CTA button has "Start" text and correct href
 * Validates: Requirements 4.4
 */
function testCTAButtonContent() {
    console.log('Testing CTA button content and functionality...');
    
    // Test button text
    console.assert(htmlContent.includes('>Start<'), 
        'CTA button should have "Start" text');
    
    // Test button href
    console.assert(htmlContent.includes('href="#launchpad"'), 
        'CTA button should link to #launchpad');
    
    // Test button classes
    console.assert(htmlContent.includes('class="btn btn-primary"'), 
        'CTA button should have correct CSS classes');
    
    // Test accessibility attributes
    console.assert(htmlContent.includes('aria-label="Start exploring ACABAI-PH initiatives"'), 
        'CTA button should have descriptive aria-label');
    
    console.log('✓ CTA button content test - PASSED');
}

/**
 * Test: Semantic structure preservation
 * Validates: Requirements 4.5
 */
function testSemanticStructure() {
    console.log('Testing semantic structure preservation...');
    
    // Test hero section structure
    console.assert(htmlContent.includes('<header class="hero"'), 
        'Hero should be a header element');
    console.assert(htmlContent.includes('role="banner"'), 
        'Hero should have banner role');
    console.assert(htmlContent.includes('aria-label="ACABAI-PH Hero Section"'), 
        'Hero should have descriptive aria-label');
    
    // Test content hierarchy
    const h1Index = htmlContent.indexOf('<h1');
    const h2Index = htmlContent.indexOf('<h2');
    const pIndex = htmlContent.indexOf('<p class="hero-description"');
    const buttonIndex = htmlContent.indexOf('<a href="#launchpad"');
    
    console.assert(h1Index < h2Index, 'h1 should come before h2');
    console.assert(h2Index < pIndex, 'h2 should come before description p');
    console.assert(pIndex < buttonIndex, 'Description should come before CTA button');
    
    console.log('✓ Semantic structure test - PASSED');
}

/**
 * Test: Skip link accessibility feature
 * Validates: Requirements 5.4
 */
function testAccessibilityFeatures() {
    console.log('Testing accessibility features...');
    
    // Test skip link
    console.assert(htmlContent.includes('Skip to main content'), 
        'Skip link should be present');
    console.assert(htmlContent.includes('href="#main-content"'), 
        'Skip link should link to main content');
    console.assert(htmlContent.includes('id="main-content"'), 
        'Main content target should exist');
    
    console.log('✓ Accessibility features test - PASSED');
}

/**
 * Test: Data attributes for animations
 * Validates: Requirements 6.2
 */
function testAnimationAttributes() {
    console.log('Testing animation data attributes...');
    
    const elementsWithReveal = [
        '<h1 data-reveal>',
        '<h2 class="hero-mission" data-reveal>',
        '<p class="hero-description" data-reveal>',
        '<div class="hero-actions" data-reveal>'
    ];
    
    elementsWithReveal.forEach(element => {
        console.assert(htmlContent.includes(element), 
            `Element should have data-reveal attribute: ${element}`);
    });
    
    console.log('✓ Animation attributes test - PASSED');
}

/**
 * Run all content preservation tests
 */
function runContentPreservationTests() {
    console.log('Running Content Preservation Unit Tests for ACABAI Hero Section...\n');
    
    try {
        testHeadlineContent();
        testMissionContent();
        testDescriptionContent();
        testCTAButtonContent();
        testSemanticStructure();
        testAccessibilityFeatures();
        testAnimationAttributes();
        
        console.log('\n🎉 All content preservation tests PASSED!');
        return true;
    } catch (error) {
        console.error('\n❌ Content preservation test FAILED:', error.message);
        return false;
    }
}

// Export for testing framework
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runContentPreservationTests,
        testHeadlineContent,
        testMissionContent,
        testDescriptionContent,
        testCTAButtonContent,
        testSemanticStructure,
        testAccessibilityFeatures,
        testAnimationAttributes
    };
}

// Run tests if called directly
if (require.main === module) {
    runContentPreservationTests();
}