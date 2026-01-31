/**
 * Test Runner for ACABAI Hero Section Redesign
 * Feature: acabai-hero-redesign
 */

const propertyTests = require('./hero-typography.test.js');
const layoutTests = require('./layout-structure.test.js');
const contentTests = require('./content-preservation.test.js');

/**
 * Run all test suites
 */
function runAllTests() {
    console.log('🚀 ACABAI Hero Section Redesign - Complete Test Suite\n');
    console.log('=' .repeat(60));
    
    let allTestsPassed = true;
    
    try {
        // Run Property-Based Tests
        console.log('\n📋 PROPERTY-BASED TESTS');
        console.log('-'.repeat(30));
        const propertyTestsResult = propertyTests.runAllPropertyTests();
        allTestsPassed = allTestsPassed && propertyTestsResult;
        
        // Run Layout Structure Tests
        console.log('\n🏗️  LAYOUT STRUCTURE TESTS');
        console.log('-'.repeat(30));
        const layoutTestsResult = layoutTests.runLayoutStructureTests();
        allTestsPassed = allTestsPassed && layoutTestsResult;
        
        // Run Content Preservation Tests
        console.log('\n📝 CONTENT PRESERVATION TESTS');
        console.log('-'.repeat(30));
        const contentTestsResult = contentTests.runContentPreservationTests();
        allTestsPassed = allTestsPassed && contentTestsResult;
        
        // Final Results
        console.log('\n' + '='.repeat(60));
        if (allTestsPassed) {
            console.log('🎉 ALL TESTS PASSED! Hero section redesign is ready for deployment.');
            console.log('\n✅ Summary:');
            console.log('   • Typography hierarchy is consistent across all viewports');
            console.log('   • Blue color palette is properly applied');
            console.log('   • CTA button meets accessibility standards');
            console.log('   • Navigation functionality is preserved');
            console.log('   • Semantic structure is compliant');
            console.log('   • Interactive feedback is smooth');
            console.log('   • Layout structure uses modern CSS Grid + Flexbox');
            console.log('   • Content integrity is maintained');
            console.log('   • Accessibility features are implemented');
        } else {
            console.log('❌ SOME TESTS FAILED! Please review the issues above.');
        }
        
        return allTestsPassed;
        
    } catch (error) {
        console.error('\n💥 Test runner encountered an error:', error.message);
        return false;
    }
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests };
}

// Run tests if called directly
if (require.main === module) {
    const success = runAllTests();
    process.exit(success ? 0 : 1);
}