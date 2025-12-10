// ========================================
// AVAILABILITY CHECKER FUNCTIONALITY
// ========================================

const packageOptions = document.querySelectorAll('.package-option');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const continueBtn = document.getElementById('continueBtn');
const backBtn = document.getElementById('backBtn');
const checkAvailabilityBtn = document.getElementById('checkAvailabilityBtn');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const checkOutGroup = document.getElementById('checkOutGroup');
const guestsSelect = document.getElementById('guests');
const timeSlotSelect = document.getElementById('timeSlot');
const selectedPackageName = document.getElementById('selectedPackageName');
const checkInLabel = document.getElementById('checkInLabel');
const dateInstruction = document.getElementById('dateInstruction');
const progressSteps = document.querySelectorAll('.progress-step');
const largeGroup1 = document.getElementById('largeGroup1');
const largeGroup2 = document.getElementById('largeGroup2');

let selectedPackage = null;
let selectedDuration = null;

// Package configurations
const packageConfigs = {
    'day-tour': {
        name: 'Day Tour',
        duration: 'single',
        maxGuests: 50,
        timeSlots: [
            { value: '9am-5pm', label: '9:00 AM - 5:00 PM' },
            { value: '11am-7pm', label: '11:00 AM - 7:00 PM' }
        ]
    },
    'night-tour': {
        name: 'Night Tour',
        duration: 'single',
        maxGuests: 50,
        timeSlots: [
            { value: '1pm-11pm', label: '1:00 PM - 11:00 PM' },
            { value: '3pm-11pm', label: '3:00 PM - 11:00 PM' }
        ]
    },
    'overnight': {
        name: 'Overnight',
        duration: 'multi',
        maxGuests: 50,
        timeSlots: [
            { value: '12nn-8am', label: '12:00 NN - 8:00 AM (Next Day)' },
            { value: '2pm-10am', label: '2:00 PM - 10:00 AM (Next Day)' }
        ]
    },
    'big-event': {
        name: 'Big Event',
        duration: 'multi',
        maxGuests: 150,
        timeSlots: [
            { value: '9am-5pm', label: '9:00 AM - 5:00 PM' },
            { value: '1pm-9pm', label: '1:00 PM - 9:00 PM' }
        ]
    }
};

// Initialize
function init() {
    setMinDate();
    setupEventListeners();
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
}

// Setup all event listeners
function setupEventListeners() {
    // Package selection
    packageOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectPackage(this);
        });
    });

    // Continue button
    continueBtn.addEventListener('click', goToStep2);

    // Back button
    backBtn.addEventListener('click', goToStep1);

    // Check availability button
    checkAvailabilityBtn.addEventListener('click', checkAvailability);

    // Date inputs
    checkInInput.addEventListener('change', handleCheckInChange);
    checkOutInput.addEventListener('change', validateDates);

    // Form validation
    guestsSelect.addEventListener('change', validateForm);
    timeSlotSelect.addEventListener('change', validateForm);
}

// Package selection handler
function selectPackage(element) {
    // Remove previous selection
    packageOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Add selection to clicked package
    element.classList.add('selected');
    
    // Store selected package info
    selectedPackage = element.dataset.package;
    selectedDuration = element.dataset.duration;
    
    // Enable continue button
    continueBtn.disabled = false;
    continueBtn.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
        continueBtn.style.animation = '';
    }, 500);
}

// Navigate to step 2
function goToStep2() {
    if (!selectedPackage) return;

    const config = packageConfigs[selectedPackage];

    // Update UI based on package type
    selectedPackageName.textContent = config.name;
    
    // Configure date fields based on duration
    if (config.duration === 'single') {
        // Single day package
        checkOutGroup.classList.add('hidden');
        checkInLabel.textContent = 'SELECT DATE';
        dateInstruction.textContent = 'Choose your preferred date for this single-day experience';
        checkOutInput.removeAttribute('required');
        checkOutInput.value = '';
    } else {
        // Multi-day package
        checkOutGroup.classList.remove('hidden');
        checkInLabel.textContent = 'CHECK-IN DATE';
        dateInstruction.textContent = 'Choose your check-in and check-out dates';
        checkOutInput.setAttribute('required', 'required');
    }

    // Configure guest capacity
    if (config.maxGuests === 50) {
        largeGroup1.style.display = 'none';
        largeGroup2.style.display = 'none';
    } else {
        largeGroup1.style.display = 'block';
        largeGroup2.style.display = 'block';
    }

    // Populate time slots
    populateTimeSlots(config.timeSlots);

    // Reset form
    resetForm();

    // Animate transition
    step1.classList.add('hidden');
    setTimeout(() => {
        step2.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        continueBtn.classList.add('hidden');
        checkAvailabilityBtn.classList.remove('hidden');
        
        // Update progress indicator
        progressSteps[0].classList.remove('active');
        progressSteps[1].classList.add('active');
    }, 300);
}

// Navigate back to step 1
function goToStep1() {
    step2.classList.add('hidden');
    setTimeout(() => {
        step1.classList.remove('hidden');
        backBtn.classList.add('hidden');
        continueBtn.classList.remove('hidden');
        checkAvailabilityBtn.classList.add('hidden');
        
        // Update progress indicator
        progressSteps[0].classList.add('active');
        progressSteps[1].classList.remove('active');
    }, 300);
}

// Populate time slot dropdown
function populateTimeSlots(slots) {
    timeSlotSelect.innerHTML = '<option value="">Select time slot</option>';
    slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.label;
        timeSlotSelect.appendChild(option);
    });
}

// Handle check-in date change
function handleCheckInChange() {
    const config = packageConfigs[selectedPackage];
    
    if (config.duration === 'multi') {
        // For multi-day packages, set minimum checkout date
        const checkInDate = new Date(checkInInput.value);
        checkInDate.setDate(checkInDate.getDate() + 1);
        const minCheckOut = checkInDate.toISOString().split('T')[0];
        checkOutInput.setAttribute('min', minCheckOut);
        
        // Clear checkout if it's before the new minimum
        if (checkOutInput.value && checkOutInput.value < minCheckOut) {
            checkOutInput.value = '';
        }
    }
    
    validateForm();
}

// Validate dates
function validateDates() {
    const config = packageConfigs[selectedPackage];
    
    if (config.duration === 'single') {
        return true; // Single day packages only need check-in date
    }
    
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
        showNotification('Check-in date cannot be in the past.', 'error');
        checkInInput.value = '';
        return false;
    }
    
    if (checkOutDate <= checkInDate) {
        showNotification('Check-out date must be after check-in date.', 'error');
        checkOutInput.value = '';
        return false;
    }
    
    validateForm();
    return true;
}

// Validate entire form
function validateForm() {
    const config = packageConfigs[selectedPackage];
    const checkInValid = checkInInput.value !== '';
    const checkOutValid = config.duration === 'single' || checkOutInput.value !== '';
    const guestsValid = guestsSelect.value !== '';
    const timeSlotValid = timeSlotSelect.value !== '';
    
    const isValid = checkInValid && checkOutValid && guestsValid && timeSlotValid;
    checkAvailabilityBtn.disabled = !isValid;
    
    if (isValid) {
        checkAvailabilityBtn.style.opacity = '1';
        checkAvailabilityBtn.style.cursor = 'pointer';
    } else {
        checkAvailabilityBtn.style.opacity = '0.6';
        checkAvailabilityBtn.style.cursor = 'not-allowed';
    }
}

// Reset form
function resetForm() {
    checkInInput.value = '';
    checkOutInput.value = '';
    guestsSelect.value = '';
    timeSlotSelect.value = '';
    checkAvailabilityBtn.disabled = true;
}

// Check availability
function checkAvailability() {
    const config = packageConfigs[selectedPackage];
    
    // Final validation
    if (!checkInInput.value || !guestsSelect.value || !timeSlotSelect.value) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (config.duration === 'multi' && !checkOutInput.value) {
        showNotification('Please select a check-out date.', 'error');
        return;
    }
    
    // Show loading state
    const originalHTML = checkAvailabilityBtn.innerHTML;
    checkAvailabilityBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CHECKING...';
    checkAvailabilityBtn.disabled = true;
    checkAvailabilityBtn.style.cursor = 'wait';
    
    // Simulate API call
    setTimeout(() => {
        checkAvailabilityBtn.innerHTML = originalHTML;
        checkAvailabilityBtn.disabled = false;
        checkAvailabilityBtn.style.cursor = 'pointer';
        
        // Get booking details
        const bookingDetails = getBookingDetails();
        
        // Show success notification
        showNotification(
            `Great news! ${config.name} is available for your selected ${config.duration === 'single' ? 'date' : 'dates'}!`,
            'success'
        );
        
        // Store booking details in sessionStorage
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Redirect to booking page after brief delay
        setTimeout(() => {
            window.location.href = 'book.html';
        }, 1500);
    }, 2000);
}

// Get booking details
function getBookingDetails() {
    const config = packageConfigs[selectedPackage];
    const timeSlotLabel = timeSlotSelect.options[timeSlotSelect.selectedIndex].text;
    
    const details = {
        package: config.name,
        packageType: selectedPackage,
        duration: config.duration,
        checkIn: checkInInput.value,
        guests: guestsSelect.options[guestsSelect.selectedIndex].text,
        timeSlot: timeSlotLabel
    };
    
    if (config.duration === 'multi') {
        details.checkOut = checkOutInput.value;
    }
    
    return details;
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 30px;
                right: 30px;
                background: white;
                padding: 20px 30px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 3.5s;
                min-width: 300px;
                max-width: 500px;
            }
            
            .notification-success {
                border-left: 5px solid #4CAF50;
            }
            
            .notification-error {
                border-left: 5px solid #f44336;
            }
            
            .notification-info {
                border-left: 5px solid #2196F3;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
                font-family: 'Roboto', sans-serif;
                font-size: 15px;
                color: var(--primary-green);
            }
            
            .notification-content i {
                font-size: 24px;
            }
            
            .notification-success .notification-content i {
                color: #4CAF50;
            }
            
            .notification-error .notification-content i {
                color: #f44336;
            }
            
            .notification-info .notification-content i {
                color: #2196F3;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            @media (max-width: 768px) {
                .notification {
                    top: 20px;
                    right: 20px;
                    left: 20px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Add pulse animation for buttons
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(pulseStyle);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========================================
// REVIEWS CAROUSEL FUNCTIONALITY - FIXED
// ========================================

// ========================================
// ENHANCED REVIEWS CAROUSEL - SMOOTH ANIMATIONS
// ========================================

let currentReview = 0;
const reviewCards = document.querySelectorAll('.review-card');
const totalReviews = reviewCards.length;
const prevBtn = document.getElementById('prevReview');
const nextBtn = document.getElementById('nextReview');
const reviewDots = document.querySelectorAll('.dot');
let isAnimating = false;
let reviewInterval;

// Initialize: Show first review with animation
function initializeReviews() {
    if (reviewCards.length > 0) {
        reviewCards[0].classList.add('active');
        if (reviewDots[0]) {
            reviewDots[0].classList.add('active');
        }
    }
    
    // Start auto-advance
    startAutoAdvance();
}

function showReview(index, direction = 'next') {
    // Prevent multiple animations at once
    if (isAnimating || index === currentReview) return;
    
    // Set animation flag
    isAnimating = true;
    
    const currentCard = reviewCards[currentReview];
    const nextCard = reviewCards[index];
    
    // Clear all animation classes from all cards
    reviewCards.forEach(card => {
        card.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
    });
    
    // Apply appropriate animation classes based on direction
    if (direction === 'next') {
        currentCard.classList.add('slide-out-left');
        nextCard.classList.add('slide-in-left');
    } else {
        currentCard.classList.add('slide-out-right');
        nextCard.classList.add('slide-in-right');
    }
    
    // Update dots immediately for better feedback
    updateDots(index);
    
    // Wait for animation to complete
    setTimeout(() => {
        // Clean up old card
        currentCard.classList.remove('active', 'slide-out-left', 'slide-out-right');
        
        // Activate new card
        nextCard.classList.remove('slide-in-left', 'slide-in-right');
        nextCard.classList.add('active');
        
        // Update current index
        currentReview = index;
        
        // Reset animation flag
        isAnimating = false;
    }, 600); // Match animation duration
}

function updateDots(index) {
    reviewDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextReview() {
    if (isAnimating) return;
    const nextIndex = (currentReview + 1) % totalReviews;
    showReview(nextIndex, 'next');
}

function prevReview() {
    if (isAnimating) return;
    const prevIndex = (currentReview - 1 + totalReviews) % totalReviews;
    showReview(prevIndex, 'prev');
}

function startAutoAdvance() {
    // Clear any existing interval
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
    
    // Start new interval
    reviewInterval = setInterval(nextReview, 5000);
}

function stopAutoAdvance() {
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
}

// Event listeners for navigation buttons
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextReview();
        // Restart auto-advance after manual navigation
        stopAutoAdvance();
        startAutoAdvance();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevReview();
        // Restart auto-advance after manual navigation
        stopAutoAdvance();
        startAutoAdvance();
    });
}

// Dot navigation with smooth transitions
reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        if (index !== currentReview && !isAnimating) {
            const direction = index > currentReview ? 'next' : 'prev';
            showReview(index, direction);
            
            // Restart auto-advance after manual navigation
            stopAutoAdvance();
            startAutoAdvance();
        }
    });
});

// Pause auto-advance on hover for better user experience
const reviewsSection = document.querySelector('.reviews-section');
if (reviewsSection) {
    reviewsSection.addEventListener('mouseenter', function() {
        stopAutoAdvance();
    });
    
    reviewsSection.addEventListener('mouseleave', function() {
        startAutoAdvance();
    });
}

// Pause auto-advance when page is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoAdvance();
    } else {
        startAutoAdvance();
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (!reviewsSection) return;
    
    // Check if reviews section is in viewport
    const rect = reviewsSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isInViewport && !isAnimating) {
        if (e.key === 'ArrowLeft') {
            prevReview();
            stopAutoAdvance();
            startAutoAdvance();
        } else if (e.key === 'ArrowRight') {
            nextReview();
            stopAutoAdvance();
            startAutoAdvance();
        }
    }
});

// Initialize reviews when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReviews);
} else {
    initializeReviews();
}

// Add touch support for mobile swipe gestures
let touchStartX = 0;
let touchEndX = 0;

if (reviewsSection) {
    reviewsSection.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    reviewsSection.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const difference = touchStartX - touchEndX;
    
    if (Math.abs(difference) > swipeThreshold && !isAnimating) {
        if (difference > 0) {
            // Swipe left - next review
            nextReview();
        } else {
            // Swipe right - previous review
            prevReview();
        }
        
        // Restart auto-advance after swipe
        stopAutoAdvance();
        startAutoAdvance();
    }
}
// ========================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// SCROLL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animatedElements = document.querySelectorAll('.amenity-card, .package-card, .welcome-content');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// CHATBOT FUNCTIONALITY
// ========================================

const faqDatabase = {
    packages: {
        question: "What packages do you offer?",
        answer: "We provide a variety of options to suit different occasions:\n\n• Day Tour\n• Night Tour\n• Overnight\n• Big Event Packages\n\nEach package is available in No Room, 1 Room, or 2 Room configurations to accommodate your group's specific needs."
    },
    capacity: {
        question: "How many people can the resort accommodate?",
        answer: "Our standard packages can comfortably host up to 50 guests, while our Big Event Package is designed to accommodate larger gatherings of up to 150 guests."
    },
    schedule: {
        question: "What are the check-in and check-out schedules?",
        answer: "Our schedules are as follows:\n\n• Day Tour: 9:00 AM – 6:00 PM or 11:00 AM – 7:00 PM\n• Night Tour: 1:00 PM – 11:00 PM or 3:00 PM – 11:00 PM\n• Overnight: 12:00 NN – 8:00 AM or 2:00 PM – 10:00 AM\n• Big Event + Overnight: 12:00 NN – 8:00 AM\n\nThese schedules may vary based on availability and confirmed arrangements."
    },
    amenities: {
        question: "What amenities are included?",
        answer: "All bookings include full private access to our facilities:\n\n• Function hall\n• Swimming pool\n• Jacuzzi\n• Modern CRs\n• Dining area\n• Kitchen\n• Cooking and grilling areas\n• Gazebo\n• Kubo\n• Parking space\n• Recreational board games\n\nRooms with private bathrooms are included when selecting 1 Room or 2 Room packages."
    },
    rooms: {
        question: "Are rooms included in all packages?",
        answer: "Rooms are available only when booking our 1 Room or 2 Room package options. Guests who choose the No Room package will still enjoy access to all shared resort amenities, excluding bedroom use."
    },
    location: {
        question: "Where are you located?",
        answer: "We are located at Lambakin, Jaen, Nueva Ecija. Our resort is easily accessible and perfect for a quick getaway from the city!"
    },
    booking: {
        question: "How do I make a booking?",
        answer: "You can book through:\n\n1. Click the 'BOOK NOW' button on our website\n2. Contact us via phone or Facebook\n3. Visit us in person\n\nWe recommend booking in advance, especially during weekends and holidays!"
    },
    contact: {
        question: "How can I contact you?",
        answer: "You can reach us through:\n\n📱 Phone: [Your phone number]\n📧 Email: [Your email]\n📍 Facebook: Granjero Private Resort\n\nWe're happy to answer any questions you may have!"
    }
};

const keywordMapping = {
    'package': 'packages', 'packages': 'packages', 'options': 'packages', 'tour': 'packages', 
    'day': 'packages', 'night': 'packages', 'overnight': 'packages', 'event': 'packages',
    'capacity': 'capacity', 'people': 'capacity', 'guests': 'capacity', 'accommodate': 'capacity', 
    'how many': 'capacity', 'big': 'capacity',
    'schedule': 'schedule', 'time': 'schedule', 'check-in': 'schedule', 'check-out': 'schedule', 
    'checkin': 'schedule', 'checkout': 'schedule', 'hours': 'schedule',
    'amenity': 'amenities', 'amenities': 'amenities', 'facility': 'amenities', 'facilities': 'amenities', 
    'pool': 'amenities', 'include': 'amenities', 'jacuzzi': 'amenities',
    'room': 'rooms', 'rooms': 'rooms', 'bedroom': 'rooms', 'bedrooms': 'rooms',
    'location': 'location', 'where': 'location', 'address': 'location', 'direction': 'location',
    'book': 'booking', 'booking': 'booking', 'reserve': 'booking', 'reservation': 'booking', 
    'how to book': 'booking',
    'contact': 'contact', 'phone': 'contact', 'email': 'contact', 'reach': 'contact', 
    'facebook': 'contact'
};

const chatButton = document.getElementById('chatButton');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const suggestedQuestions = document.getElementById('suggestedQuestions');

// Initialize chatbot with attention-grabbing features
function initializeChatbot() {
    // Set initial timestamp
    const initialTimeElement = document.getElementById('initialTime');
    if (initialTimeElement) {
        initialTimeElement.textContent = getCurrentTime();
    }
    
    // Add initial bounce animation to chat button
    chatButton.classList.add('initial-bounce');
    
    // Create and show tooltip after 3 seconds
    setTimeout(() => {
        showTooltip();
    }, 3000);
    
    // Remove tooltip after 8 seconds
    setTimeout(() => {
        hideTooltip();
    }, 11000);
    
    // Show tooltip again periodically if chat hasn't been opened
    setInterval(() => {
        if (!localStorage.getItem('chatOpened')) {
            showTooltip();
            setTimeout(hideTooltip, 5000);
        }
    }, 30000); // Every 30 seconds
}

// Create and show tooltip
function showTooltip() {
    let tooltip = document.querySelector('.chat-tooltip');
    
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'chat-tooltip';
        tooltip.textContent = '💬 Need help? Chat with us!';
        chatButton.parentElement.appendChild(tooltip);
    }
    
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 100);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.chat-tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

// Toggle chat with enhanced animations
if (chatButton) {
    chatButton.addEventListener('click', function() {
        const isOpening = !chatContainer.classList.contains('active');
        
        chatContainer.classList.toggle('active');
        chatButton.classList.toggle('active');
        
        if (isOpening) {
            // Mark chat as opened
            chatButton.classList.add('chat-opened');
            localStorage.setItem('chatOpened', 'true');
            
            // Hide tooltip
            hideTooltip();
            
            // Focus input
            setTimeout(() => {
                chatInput.focus();
            }, 400);
            
            // Play a subtle sound effect (optional)
            // playSound('open');
        }
    });
}

if (closeChat) {
    closeChat.addEventListener('click', function() {
        chatContainer.classList.remove('active');
        chatButton.classList.remove('active');
        // playSound('close');
    });
}

// Enhanced suggested questions with smooth hide
document.querySelectorAll('.question-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const question = this.dataset.question;
        handleUserMessage(faqDatabase[question].question, question);
        
        // Smoothly hide suggestions after first interaction
        setTimeout(() => {
            if (suggestedQuestions) {
                suggestedQuestions.style.animation = 'suggestionsSlideOut 0.3s ease forwards';
                setTimeout(() => {
                    suggestedQuestions.style.display = 'none';
                }, 300);
            }
        }, 500);
    });
});

// Send message with enter key
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        handleUserMessage(message);
        chatInput.value = '';
        
        // Hide suggestions after first user message
        if (suggestedQuestions && suggestedQuestions.style.display !== 'none') {
            suggestedQuestions.style.animation = 'suggestionsSlideOut 0.3s ease forwards';
            setTimeout(() => {
                suggestedQuestions.style.display = 'none';
            }, 300);
        }
    }
}

function handleUserMessage(message, directKey = null) {
    addMessage(message, 'user');
    showTypingIndicator();

    setTimeout(function() {
        hideTypingIndicator();
        
        let responseKey = directKey;
        
        if (!responseKey) {
            const messageLower = message.toLowerCase();
            for (const [keyword, key] of Object.entries(keywordMapping)) {
                if (messageLower.includes(keyword)) {
                    responseKey = key;
                    break;
                }
            }
        }

        if (responseKey && faqDatabase[responseKey]) {
            addMessage(faqDatabase[responseKey].answer, 'bot');
        } else {
            addMessage("I'm sorry, I didn't quite understand that. Here are some topics I can help you with:\n\n• Packages & Options\n• Guest Capacity\n• Schedules\n• Amenities & Facilities\n• Room Options\n• Location\n• Booking Process\n• Contact Information\n\nPlease try asking about one of these, or feel free to contact us directly for more specific inquiries!", 'bot');
        }
    }, 1200); // Slightly longer for more realistic feel
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/media/tab-icon.png" alt="Granjero">
            </div>
            <div>
                <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
                <div class="timestamp">${getCurrentTime()}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div>
                <div class="message-content">${text}</div>
                <div class="timestamp">${getCurrentTime()}</div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
        <div class="message-avatar">
            <img src="assets/media/tab-icon.png" alt="Granjero">
        </div>
        <div class="typing-indicator active">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatMessages.appendChild(indicator);
    
    // Smooth scroll to bottom
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Add CSS animation for suggestions slide out
const style = document.createElement('style');
style.textContent = `
    @keyframes suggestionsSlideOut {
        from {
            opacity: 1;
            max-height: 300px;
        }
        to {
            opacity: 0;
            max-height: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    initializeChatbot();
}

// Close chat when clicking outside
document.addEventListener('click', function(e) {
    if (chatContainer.classList.contains('active') && 
        !chatContainer.contains(e.target) && 
        !chatButton.contains(e.target)) {
        chatContainer.classList.remove('active');
        chatButton.classList.remove('active');
    }
});

// Keyboard shortcut to open chat (Ctrl/Cmd + K)
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        chatButton.click();
    }
});

// Log initialization
console.log('%c💬 Chatbot Ready!', 'color: #13332C; font-size: 16px; font-weight: bold;');
console.log('%cPress Ctrl/Cmd + K to open chat', 'color: #C3A05C; font-size: 12px;');

// ========================================
// HEADER SCROLL EFFECT
// ========================================

let lastScrollTop = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(19, 51, 44, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

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
// IMAGE LAZY LOADING
// ========================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c🌿 Welcome to Granjero Private Resort! 🌿', 'color: #13332C; font-size: 20px; font-weight: bold;');
console.log('%cWhere nature takes the lead', 'color: #C3A05C; font-size: 14px; font-style: italic;');