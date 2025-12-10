// ========================================
// HAMBURGER MENU
// ========================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navigation');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.navigation a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Add this script to the bottom of rates-and-packages.html (before closing </body> tag)
// Or add to your existing assets/js/index.js file

document.addEventListener('DOMContentLoaded', function() {
    
    // Map each "BOOK NOW" button to the correct package ID
    const packageButtons = [
        // Day Tour packages
        { section: 'day-tour', index: 0, packageId: 'day-tour-no-room' },
        { section: 'day-tour', index: 1, packageId: 'day-tour-one-room' },
        { section: 'day-tour', index: 2, packageId: 'day-tour-two-rooms' },
        
        // Night Tour packages
        { section: 'night-tour', index: 0, packageId: 'night-tour-no-room' },
        { section: 'night-tour', index: 1, packageId: 'night-tour-one-room' },
        { section: 'night-tour', index: 2, packageId: 'night-tour-two-rooms' },
        
        // Big Event packages
        { section: 'big-event', index: 0, packageId: 'big-event-no-room' },
        { section: 'big-event', index: 1, packageId: 'big-event-one-room' },
        { section: 'big-event', index: 2, packageId: 'big-event-two-rooms' },
        
        // Overnight packages
        { section: 'overnight', index: 0, packageId: 'overnight-one-room' },
        { section: 'overnight', index: 1, packageId: 'overnight-two-rooms' },
        
        // Big Event with Overnight packages
        { section: 'big-event-overnight', index: 0, packageId: 'big-event-overnight-one-room' },
        { section: 'big-event-overnight', index: 1, packageId: 'big-event-overnight-two-rooms' }
    ];
    
    // Add click handlers to all BOOK NOW buttons
    packageButtons.forEach(config => {
        const section = document.getElementById(config.section);
        if (section) {
            const buttons = section.querySelectorAll('.book-btn');
            if (buttons[config.index]) {
                buttons[config.index].addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = `book.html?package=${config.packageId}`;
                });
            }
        }
    });
    
    // Also handle CTA button at the bottom
    const ctaButton = document.querySelector('.cta-btn.primary');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'book.html';
        });
    }
});
