(function() {
    'use strict';

    // ========================================
    // PAGE TRANSITION HANDLER
    // ========================================
    
    function initPageTransitions() {
        // Create transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        
       
        document.body.appendChild(transitionOverlay);

        // Handle all internal links
        document.querySelectorAll('a').forEach(link => {
            // Skip external links, anchors, and special links
            if (
                link.hostname === window.location.hostname &&
                !link.getAttribute('href')?.startsWith('#') &&
                !link.getAttribute('href')?.startsWith('mailto:') &&
                !link.getAttribute('href')?.startsWith('tel:') &&
                !link.hasAttribute('target')
            ) {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Skip if it's the current page
                    if (href && !href.includes(window.location.pathname.split('/').pop())) {
                        e.preventDefault();
                        
                        // Trigger transition
                        transitionOverlay.classList.add('active');
                        
                        // Navigate after animation
                        setTimeout(() => {
                            window.location.href = href;
                        }, 600);
                    }
                });
            }
        });

        // Remove transition overlay on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                transitionOverlay.classList.remove('active');
            }, 100);
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // For cards, add animate-in class
                    if (entry.target.classList.contains('package-card')) {
                        entry.target.classList.add('animate-in');
                    }
                }
            });
        }, observerOptions);

        // Observe all elements that should animate on scroll
        const elementsToObserve = [
            '.fade-in-section',
            '.intro-content',
            '.section-title',
            '.tour-header',
            '.package-card',
            '.note-item',
            '.cta-content',
            '.site-footer'
        ];

        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                observer.observe(el);
            });
        });
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 100;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // PARALLAX EFFECT FOR HERO IMAGES
    // ========================================
    
    function initParallax() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const heroImage = heroSection.querySelector('img');
        if (!heroImage) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            if (scrolled <= window.innerHeight) {
                heroImage.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
        });
    }

    // ========================================
    // CARDS HOVER EFFECT ENHANCEMENT
    // ========================================
    
    function initCardEffects() {
        document.querySelectorAll('.package-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(195, 160, 92, 0.1);
                    width: 100px;
                    height: 100px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    
    function initNavbarScroll() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 100) {
                header.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = 'none';
            } else {
                header.style.background = 'rgba(19, 51, 44, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            }

            lastScroll = currentScroll;
        });
    }

    // ========================================
    // PRELOAD CRITICAL IMAGES
    // ========================================
    
    function preloadImages() {
        const imagesToPreload = [
            'assets/media/logo-white.png',
            'assets/media/room-hero.jpg'
        ];

        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // ========================================
    // PAGE VISIBILITY HANDLING
    // ========================================
    
    function handlePageVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden
                document.body.classList.add('page-hidden');
            } else {
                // Page is visible
                document.body.classList.remove('page-hidden');
            }
        });
    }

    // ========================================
    // INITIALIZE ALL
    // ========================================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initializeAll();
            });
        } else {
            initializeAll();
        }
    }

    function initializeAll() {
        preloadImages();
        initPageTransitions();
        initScrollReveal();
        initSmoothScroll();
        initParallax();
        initCardEffects();
        initNavbarScroll();
        handlePageVisibility();

        // Add loaded class to body
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    }

    // Start initialization
    init();

})();