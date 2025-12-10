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

// ========================================
// PREMIUM GALLERY SLIDER - FIXED
// ========================================
// ========================================
// PREMIUM GALLERY SLIDER - COMPLETELY FIXED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.getElementById('galleryContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!galleryContainer || !prevBtn || !nextBtn) return;
    
    let isAnimating = false;
    let currentIndex = 0;
    
    // Calculate how many items to show at once
    function getVisibleItems() {
        const containerWidth = galleryContainer.offsetWidth;
        const itemWidth = galleryContainer.querySelector('.gallery-item')?.offsetWidth || 0;
        if (itemWidth === 0) return 1;
        return Math.floor(containerWidth / (itemWidth + 20)); // 20 is the gap
    }
    
    // Get total number of items
    function getTotalItems() {
        return galleryContainer.querySelectorAll('.gallery-item').length;
    }
    
    // Calculate the scroll amount for one "page" of items
    function getScrollAmount() {
        const item = galleryContainer.querySelector('.gallery-item');
        if (!item) return 400;
        
        const itemWidth = item.offsetWidth;
        const gap = 20;
        const visibleItems = getVisibleItems();
        
        return (itemWidth + gap) * visibleItems;
    }
    
    // Update button states based on current position
    function updateButtons() {
        const maxScroll = galleryContainer.scrollWidth - galleryContainer.clientWidth;
        const currentScroll = galleryContainer.scrollLeft;
        
        // Update prev button
        if (currentScroll <= 5) {
            prevBtn.classList.add('disabled');
            prevBtn.disabled = true;
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.disabled = false;
        }
        
        // Update next button
        if (currentScroll >= maxScroll - 5) {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        }
    }
    
    // Smooth scroll function
    function smoothScrollTo(targetPosition) {
        if (isAnimating) return;
        
        isAnimating = true;
        const startPosition = galleryContainer.scrollLeft;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let startTime = null;
        
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeProgress = easeInOutCubic(progress);
            galleryContainer.scrollLeft = startPosition + (distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                isAnimating = false;
                updateButtons();
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Handle next button click
    function handleNext() {
        if (isAnimating || nextBtn.disabled) return;
        
        const scrollAmount = getScrollAmount();
        const currentScroll = galleryContainer.scrollLeft;
        const maxScroll = galleryContainer.scrollWidth - galleryContainer.clientWidth;
        
        const targetScroll = Math.min(currentScroll + scrollAmount, maxScroll);
        smoothScrollTo(targetScroll);
    }
    
    // Handle prev button click
    function handlePrev() {
        if (isAnimating || prevBtn.disabled) return;
        
        const scrollAmount = getScrollAmount();
        const currentScroll = galleryContainer.scrollLeft;
        
        const targetScroll = Math.max(currentScroll - scrollAmount, 0);
        smoothScrollTo(targetScroll);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);
    
    // Update buttons on manual scroll
    let scrollTimeout;
    galleryContainer.addEventListener('scroll', () => {
        if (!isAnimating) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateButtons, 100);
        }
    });
    
    // Initial setup
    updateButtons();
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateButtons();
        }, 200);
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    galleryContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            handlePrev();
        } else if (e.key === 'ArrowRight') {
            handleNext();
        }
    });

    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe main sections
    const sections = document.querySelectorAll('.gallery-section, .amenities-tables, .house-rules');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        fadeInObserver.observe(section);
    });
    
    // ========================================
    // STAGGERED ANIMATIONS FOR CARDS
    // ========================================
    const ruleCards = document.querySelectorAll('.rule-card');
    ruleCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-30px)';
        card.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.12}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });
    
    // ========================================
    // GALLERY ITEMS HOVER EFFECT
    // ========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // ========================================
    // TABLE ROWS ANIMATION
    // ========================================
    const tableRows = document.querySelectorAll('.table-row');
    tableRows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        row.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
        
        const rowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    rowObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        rowObserver.observe(row);
    });
});