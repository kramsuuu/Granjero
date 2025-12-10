// ============================================
// BOOKING STATE
// ============================================
const bookingState = {
  currentStep: 1,
  package: null,
  date: null,
  timeSlot: null,
  guests: null,
  addons: {
    videoke: false,
    lpg: false,
    bonfire: false,
    tent: false,
    extraChair: 0,
    extraTable: 0,
    extraGuest: 0,
    extraTime: 0,
  },
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  },
  payment: {
    method: "",
  },
};

// ============================================
// PACKAGE DATA
// ============================================
const PACKAGES = {
  "day-tour-no-room": {
    name: "Day Tour - No Room",
    price: 5000,
    category: "day-tour",
    guests: 50,
  },
  "day-tour-one-room": {
    name: "Day Tour - One Room",
    price: 6000,
    category: "day-tour",
    guests: 50,
  },
  "day-tour-two-rooms": {
    name: "Day Tour - Two Rooms",
    price: 7000,
    category: "day-tour",
    guests: 50,
  },
  "night-tour-no-room": {
    name: "Night Tour - No Room",
    price: 6000,
    category: "night-tour",
    guests: 50,
  },
  "night-tour-one-room": {
    name: "Night Tour - One Room",
    price: 7000,
    category: "night-tour",
    guests: 50,
  },
  "night-tour-two-rooms": {
    name: "Night Tour - Two Rooms",
    price: 8000,
    category: "night-tour",
    guests: 50,
  },
  "big-event-no-room": {
    name: "Big Event - No Room",
    price: 8000,
    category: "big-event",
    guests: 150,
  },
  "big-event-one-room": {
    name: "Big Event - One Room",
    price: 9000,
    category: "big-event",
    guests: 150,
  },
  "big-event-two-rooms": {
    name: "Big Event - Two Rooms",
    price: 10000,
    category: "big-event",
    guests: 150,
  },
  "overnight-one-room": {
    name: "Overnight - One Room",
    price: 9000,
    category: "overnight",
    guests: 50,
  },
  "overnight-two-rooms": {
    name: "Overnight - Two Rooms",
    price: 10000,
    category: "overnight",
    guests: 50,
  },
  "big-event-overnight-one-room": {
    name: "Big Event Overnight - One Room",
    price: 11000,
    category: "big-event-overnight",
    guests: 150,
  },
  "big-event-overnight-two-rooms": {
    name: "Big Event Overnight - Two Rooms",
    price: 12000,
    category: "big-event-overnight",
    guests: 150,
  },
};

const TIME_SLOTS = {
  "day-tour": ["9:00 AM - 5:00 PM", "11:00 AM - 7:00 PM"],
  "night-tour": ["1:00 PM - 9:00 PM", "3:00 PM - 11:00 PM"],
  overnight: ["12:00 NN - 8:00 AM", "2:00 PM - 10:00 AM"],
  "big-event": ["9:00 AM - 5:00 PM", "1:00 PM - 9:00 PM"],
  "big-event-overnight": ["12:00 NN - 8:00 AM", "2:00 PM - 10:00 AM"],
};

const ADDON_PRICES = {
  videoke: 500,
  lpg: 200,
  bonfire: 100,
  tent: 500,
  extraChair: 10,
  extraTable: 100,
  extraGuest: 1000,
  extraTime: 500,
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  initializeHamburgerMenu();
  checkForCheckerData();
  initializePackageSelection();
  initializeDateTimeSelection();
  initializeCustomization();
  initializeReview();
  initializePayment();
  setupNavigation();
});

// ============================================
// HAMBURGER MENU
// ============================================
function initializeHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navigation = document.querySelector(".navigation");

  if (!hamburger || !navigation) return;

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    navigation.classList.toggle("active");
    document.body.style.overflow = navigation.classList.contains("active")
      ? "hidden"
      : "";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navigation.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  document.addEventListener("click", function (event) {
    if (
      !navigation.contains(event.target) &&
      !hamburger.contains(event.target) &&
      navigation.classList.contains("active")
    ) {
      hamburger.classList.remove("active");
      navigation.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}

// ============================================
// CHECK FOR CHECKER DATA
// ============================================
function checkForCheckerData() {
  const urlParams = new URLSearchParams(window.location.search);
  const packageId = urlParams.get("package");
  const date = urlParams.get("date");
  const timeSlot = urlParams.get("time");
  const guests = urlParams.get("guests");

  if (packageId && PACKAGES[packageId]) {
    bookingState.package = packageId;
    if (date) bookingState.date = date;
    if (timeSlot) bookingState.timeSlot = decodeURIComponent(timeSlot);
    if (guests) bookingState.guests = guests;

    // Pre-select package
    setTimeout(() => {
      const packageElement = document.querySelector(
        `[data-package="${packageId}"]`
      );
      if (packageElement) {
        packageElement.classList.add("selected");
        document.getElementById("continueToDateTime").disabled = false;
      }
    }, 100);
  }
}

// ============================================
// STEP 1: PACKAGE SELECTION
// ============================================
function initializePackageSelection() {
  const packageOptions = document.querySelectorAll(".package-option");
  const continueBtn = document.getElementById("continueToDateTime");

  packageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      packageOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");

      bookingState.package = this.dataset.package;
      continueBtn.disabled = false;

      // Animate button
      continueBtn.style.animation = "pulse 0.5s ease";
      setTimeout(() => (continueBtn.style.animation = ""), 500);
    });
  });
}

// ============================================
// STEP 2: DATE & TIME SELECTION
// ============================================
function initializeDateTimeSelection() {
  const dateInput = document.getElementById("bookingDate");
  const guestSelect = document.getElementById("guestCount");
  const continueBtn = document.getElementById("continueToCustomize");

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) {
    dateInput.min = today;

    // Pre-fill if from checker
    if (bookingState.date) {
      dateInput.value = bookingState.date;
    }

    dateInput.addEventListener("change", function () {
      bookingState.date = this.value;
      validateDateTimeStep();
    });
  }

  // Pre-fill guests if from checker
  if (bookingState.guests && guestSelect) {
    guestSelect.value = bookingState.guests;
  }

  if (guestSelect) {
    guestSelect.addEventListener("change", function () {
      bookingState.guests = this.value;
      validateDateTimeStep();
    });
  }

  // Generate time slots based on package category
  if (bookingState.package) {
    generateTimeSlots();
  }

  function validateDateTimeStep() {
    const isValid =
      bookingState.date && bookingState.timeSlot && bookingState.guests;
    if (continueBtn) {
      continueBtn.disabled = !isValid;
    }
  }
}

function generateTimeSlots() {
  const timeSlotsContainer = document.getElementById("timeSlots");
  if (!timeSlotsContainer || !bookingState.package) return;

  const packageData = PACKAGES[bookingState.package];
  const slots = TIME_SLOTS[packageData.category] || [];

  timeSlotsContainer.innerHTML = slots
    .map(
      (slot) => `
        <div class="time-slot ${
          bookingState.timeSlot === slot ? "selected" : ""
        }" data-time="${slot}">
            ${slot}
        </div>
    `
    )
    .join("");

  // Add event listeners to time slots
  timeSlotsContainer.querySelectorAll(".time-slot").forEach((slot) => {
    slot.addEventListener("click", function () {
      timeSlotsContainer
        .querySelectorAll(".time-slot")
        .forEach((s) => s.classList.remove("selected"));
      this.classList.add("selected");
      bookingState.timeSlot = this.dataset.time;

      // Validate step
      const continueBtn = document.getElementById("continueToCustomize");
      const isValid =
        bookingState.date && bookingState.timeSlot && bookingState.guests;
      if (continueBtn) {
        continueBtn.disabled = !isValid;
      }
    });
  });
}

// ============================================
// STEP 3: CUSTOMIZATION
// ============================================
function initializeCustomization() {
  // Checkbox add-ons
  const checkboxes = document.querySelectorAll(
    '.addon-card input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      bookingState.addons[this.id] = this.checked;
    });
  });

  // Counter add-ons
  const counterBtns = document.querySelectorAll(".counter-btn");
  counterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const target = this.dataset.target;
      const input = document.getElementById(target);
      if (!input) return;

      const currentValue = parseInt(input.value) || 0;

      if (this.classList.contains("plus")) {
        input.value = currentValue + 1;
      } else if (this.classList.contains("minus") && currentValue > 0) {
        input.value = currentValue - 1;
      }

      bookingState.addons[target] = parseInt(input.value);
    });
  });
}

// ============================================
// STEP 4: REVIEW
// ============================================
function initializeReview() {
  const customerForm = document.getElementById("customerForm");
  const continueBtn = document.getElementById("continueToPayment");

  if (customerForm) {
    // Form validation
    const inputs = customerForm.querySelectorAll("input[required], textarea");
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        bookingState.customer[this.id] = this.value;
        validateReviewStep();
      });
    });

    // Phone number formatting
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, "").substring(0, 11);
      });
    }

    // Email validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
          this.style.borderColor = "red";
          showNotification("Please enter a valid email address", "error");
        } else {
          this.style.borderColor = "";
        }
      });
    }
  }

  function validateReviewStep() {
    const isValid =
      bookingState.customer.firstName &&
      bookingState.customer.lastName &&
      bookingState.customer.email &&
      bookingState.customer.phone &&
      bookingState.customer.phone.length === 11;

    if (continueBtn) {
      continueBtn.disabled = !isValid;
    }
  }
}

function populateReview() {
  // Package details
  const reviewPackage = document.getElementById("reviewPackage");
  if (reviewPackage && bookingState.package) {
    const pkg = PACKAGES[bookingState.package];
    reviewPackage.innerHTML = `
            <p><strong>Package:</strong> ${pkg.name}</p>
            <p><strong>Price:</strong> ₱${pkg.price.toLocaleString()}</p>
            <p><strong>Max Guests:</strong> ${pkg.guests} guests</p>
        `;
  }

  // Date & Time
  const reviewDateTime = document.getElementById("reviewDateTime");
  if (reviewDateTime) {
    reviewDateTime.innerHTML = `
            <p><strong>Date:</strong> ${formatDate(bookingState.date)}</p>
            <p><strong>Time:</strong> ${bookingState.timeSlot}</p>
            <p><strong>Guests:</strong> ${bookingState.guests}</p>
        `;
  }

  // Add-ons
  const reviewAddons = document.getElementById("reviewAddons");
  if (reviewAddons) {
    let addonsHTML = "";
    let hasAddons = false;

    // Checkboxes
    if (bookingState.addons.videoke) {
      addonsHTML += "<p>Videoke System - ₱500</p>";
      hasAddons = true;
    }
    if (bookingState.addons.lpg) {
      addonsHTML += "<p>LPG Tank - ₱200</p>";
      hasAddons = true;
    }
    if (bookingState.addons.bonfire) {
      addonsHTML += "<p>Bonfire Wood - ₱100</p>";
      hasAddons = true;
    }
    if (bookingState.addons.tent) {
      addonsHTML += "<p>Camping Tent - ₱500</p>";
      hasAddons = true;
    }

    // Counters
    if (bookingState.addons.extraChair > 0) {
      addonsHTML += `<p>Extra Chairs (${bookingState.addons.extraChair}) - ₱${
        bookingState.addons.extraChair * 10
      }</p>`;
      hasAddons = true;
    }
    if (bookingState.addons.extraTable > 0) {
      addonsHTML += `<p>Extra Tables (${bookingState.addons.extraTable}) - ₱${
        bookingState.addons.extraTable * 100
      }</p>`;
      hasAddons = true;
    }
    if (bookingState.addons.extraGuest > 0) {
      addonsHTML += `<p>Extra Guests (${bookingState.addons.extraGuest}) - ₱${
        bookingState.addons.extraGuest * 1000
      }</p>`;
      hasAddons = true;
    }
    if (bookingState.addons.extraTime > 0) {
      addonsHTML += `<p>Extra Time (${bookingState.addons.extraTime}h) - ₱${
        bookingState.addons.extraTime * 500
      }</p>`;
      hasAddons = true;
    }

    reviewAddons.innerHTML = hasAddons
      ? addonsHTML
      : '<p style="color: #888;">No add-ons selected</p>';
  }

  // Price summary
  updatePriceSummary();
}

function updatePriceSummary() {
  const priceSummary = document.getElementById("priceSummary");
  const totalPrice = document.getElementById("totalPrice");

  if (!priceSummary || !bookingState.package) return;

  let summaryHTML = "";
  let total = 0;

  // Package price
  const pkg = PACKAGES[bookingState.package];
  summaryHTML += `
        <div class="summary-row">
            <span>${pkg.name}</span>
            <span>₱${pkg.price.toLocaleString()}</span>
        </div>
    `;
  total += pkg.price;

  // Add-ons
  if (bookingState.addons.videoke) {
    summaryHTML +=
      '<div class="summary-row"><span>Videoke</span><span>₱500</span></div>';
    total += 500;
  }
  if (bookingState.addons.lpg) {
    summaryHTML +=
      '<div class="summary-row"><span>LPG</span><span>₱200</span></div>';
    total += 200;
  }
  if (bookingState.addons.bonfire) {
    summaryHTML +=
      '<div class="summary-row"><span>Bonfire Wood</span><span>₱100</span></div>';
    total += 100;
  }
  if (bookingState.addons.tent) {
    summaryHTML +=
      '<div class="summary-row"><span>Camping Tent</span><span>₱500</span></div>';
    total += 500;
  }

  if (bookingState.addons.extraChair > 0) {
    const amount = bookingState.addons.extraChair * 10;
    summaryHTML += `<div class="summary-row"><span>Extra Chairs (${bookingState.addons.extraChair})</span><span>₱${amount}</span></div>`;
    total += amount;
  }
  if (bookingState.addons.extraTable > 0) {
    const amount = bookingState.addons.extraTable * 100;
    summaryHTML += `<div class="summary-row"><span>Extra Tables (${bookingState.addons.extraTable})</span><span>₱${amount}</span></div>`;
    total += amount;
  }
  if (bookingState.addons.extraGuest > 0) {
    const amount = bookingState.addons.extraGuest * 1000;
    summaryHTML += `<div class="summary-row"><span>Extra Guests (${bookingState.addons.extraGuest})</span><span>₱${amount}</span></div>`;
    total += amount;
  }
  if (bookingState.addons.extraTime > 0) {
    const amount = bookingState.addons.extraTime * 500;
    summaryHTML += `<div class="summary-row"><span>Extra Time (${bookingState.addons.extraTime}h)</span><span>₱${amount}</span></div>`;
    total += amount;
  }

  priceSummary.innerHTML = summaryHTML;
  if (totalPrice) {
    totalPrice.textContent = `₱${total.toLocaleString()}`;
  }

  // Update payment summary
  const paymentSubtotal = document.getElementById("paymentSubtotal");
  const paymentTotal = document.getElementById("paymentTotal");
  if (paymentSubtotal)
    paymentSubtotal.textContent = `₱${total.toLocaleString()}`;
  if (paymentTotal) paymentTotal.textContent = `₱${total.toLocaleString()}`;
}

// ============================================
// STEP 5: PAYMENT
// ============================================
function initializePayment() {
  const paymentOptions = document.querySelectorAll(
    '.payment-option input[type="radio"]'
  );
  const completeBtn = document.getElementById("completeBooking");

  paymentOptions.forEach((radio) => {
    radio.addEventListener("change", function () {
      // Hide all payment forms
      document
        .querySelectorAll(".payment-form")
        .forEach((form) => form.classList.add("hidden"));

      // Show selected payment form
      const selectedForm = document.getElementById(this.value + "Form");
      if (selectedForm) {
        selectedForm.classList.remove("hidden");
      }

      bookingState.payment.method = this.value;

      if (completeBtn) {
        completeBtn.disabled = false;
      }
    });
  });

  // Card number formatting
  const cardInput = document.querySelector(
    '#cardForm input[placeholder*="1234"]'
  );
  if (cardInput) {
    cardInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      e.target.value = formattedValue.substring(0, 19);
    });
  }

  // Expiry date formatting
  const expiryInput = document.querySelector(
    '#cardForm input[placeholder*="MM/YY"]'
  );
  if (expiryInput) {
    expiryInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  if (completeBtn) {
    completeBtn.addEventListener("click", completeBooking);
  }
}

function completeBooking() {
  if (!bookingState.payment.method) {
    showNotification("Please select a payment method", "error");
    return;
  }

  // Validate payment form
  const paymentForm = document.getElementById(
    bookingState.payment.method + "Form"
  );
  if (paymentForm) {
    const requiredInputs = paymentForm.querySelectorAll("input[required]");
    let isValid = true;

    requiredInputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        input.style.borderColor = "red";
      } else {
        input.style.borderColor = "";
      }
    });

    if (!isValid) {
      showNotification("Please fill in all required payment details", "error");
      return;
    }
  }

  // Show loading
  const btn = document.getElementById("completeBooking");
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';
  btn.disabled = true;

  // Simulate processing
  setTimeout(() => {
    showReceipt();
    createConfetti();
  }, 2000);
}

// ============================================
// STEP 6: RECEIPT
// ============================================
function showReceipt() {
  goToStep(6);

  // Generate booking reference
  const bookingRef =
    "GRJ-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(Math.random() * 900000 + 100000);
  document.getElementById("bookingReference").textContent = bookingRef;

  // Guest information
  const receiptGuest = document.getElementById("receiptGuest");
  if (receiptGuest) {
    receiptGuest.innerHTML = `
            <p><strong>Name:</strong> ${bookingState.customer.firstName} ${bookingState.customer.lastName}</p>
            <p><strong>Email:</strong> ${bookingState.customer.email}</p>
            <p><strong>Phone:</strong> ${bookingState.customer.phone}</p>
        `;
  }

  // Booking details
  const receiptDetails = document.getElementById("receiptDetails");
  if (receiptDetails) {
    const pkg = PACKAGES[bookingState.package];
    receiptDetails.innerHTML = `
            <p><strong>Package:</strong> ${pkg.name}</p>
            <p><strong>Date:</strong> ${formatDate(bookingState.date)}</p>
            <p><strong>Time:</strong> ${bookingState.timeSlot}</p>
            <p><strong>Guests:</strong> ${bookingState.guests}</p>
        `;
  }

  // Payment summary
  const receiptSummary = document.getElementById("receiptSummary");
  const receiptTotal = document.getElementById("receiptTotal");

  if (receiptSummary) {
    let summaryHTML = "";
    let total = 0;

    // Package
    const pkg = PACKAGES[bookingState.package];
    summaryHTML += `<p>${pkg.name} - ₱${pkg.price.toLocaleString()}</p>`;
    total += pkg.price;

    // Add-ons
    if (bookingState.addons.videoke) {
      summaryHTML += "<p>Videoke - ₱500</p>";
      total += 500;
    }
    if (bookingState.addons.lpg) {
      summaryHTML += "<p>LPG - ₱200</p>";
      total += 200;
    }
    if (bookingState.addons.bonfire) {
      summaryHTML += "<p>Bonfire Wood - ₱100</p>";
      total += 100;
    }
    if (bookingState.addons.tent) {
      summaryHTML += "<p>Camping Tent - ₱500</p>";
      total += 500;
    }

    if (bookingState.addons.extraChair > 0) {
      const amount = bookingState.addons.extraChair * 10;
      summaryHTML += `<p>Extra Chairs (${bookingState.addons.extraChair}) - ₱${amount}</p>`;
      total += amount;
    }
    if (bookingState.addons.extraTable > 0) {
      const amount = bookingState.addons.extraTable * 100;
      summaryHTML += `<p>Extra Tables (${bookingState.addons.extraTable}) - ₱${amount}</p>`;
      total += amount;
    }
    if (bookingState.addons.extraGuest > 0) {
      const amount = bookingState.addons.extraGuest * 1000;
      summaryHTML += `<p>Extra Guests (${bookingState.addons.extraGuest}) - ₱${amount}</p>`;
      total += amount;
    }
    if (bookingState.addons.extraTime > 0) {
      const amount = bookingState.addons.extraTime * 500;
      summaryHTML += `<p>Extra Time (${bookingState.addons.extraTime}h) - ₱${amount}</p>`;
      total += amount;
    }

    receiptSummary.innerHTML = summaryHTML;
    if (receiptTotal) {
      receiptTotal.textContent = `₱${total.toLocaleString()}`;
    }
  }

  // Initialize receipt buttons
  document
    .getElementById("downloadReceipt")
    .addEventListener("click", () => window.print());
  document
    .getElementById("printReceipt")
    .addEventListener("click", () => window.print());
}

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
  // Step 1 -> Step 2
  const continueToDateTime = document.getElementById("continueToDateTime");
  if (continueToDateTime) {
    continueToDateTime.addEventListener("click", () => {
      if (!bookingState.package) {
        showNotification("Please select a package", "error");
        return;
      }
      generateTimeSlots();
      goToStep(2);
    });
  }

  // Step 2 -> Step 1
  const backToPackage = document.getElementById("backToPackage");
  if (backToPackage) {
    backToPackage.addEventListener("click", () => goToStep(1));
  }

  // Step 2 -> Step 3
  const continueToCustomize = document.getElementById("continueToCustomize");
  if (continueToCustomize) {
    continueToCustomize.addEventListener("click", () => {
      if (
        !bookingState.date ||
        !bookingState.timeSlot ||
        !bookingState.guests
      ) {
        showNotification("Please fill in all required fields", "error");
        return;
      }
      goToStep(3);
    });
  }

  // Step 3 -> Step 2
  const backToDateTime = document.getElementById("backToDateTime");
  if (backToDateTime) {
    backToDateTime.addEventListener("click", () => goToStep(2));
  }

  // Step 3 -> Step 4
  const continueToReview = document.getElementById("continueToReview");
  if (continueToReview) {
    continueToReview.addEventListener("click", () => {
      populateReview();
      goToStep(4);
    });
  }

  // Step 4 -> Step 3
  const backToCustomize = document.getElementById("backToCustomize");
  if (backToCustomize) {
    backToCustomize.addEventListener("click", () => goToStep(3));
  }

  // Step 4 -> Step 5
  const continueToPayment = document.getElementById("continueToPayment");
  if (continueToPayment) {
    continueToPayment.addEventListener("click", () => {
      if (
        !bookingState.customer.firstName ||
        !bookingState.customer.lastName ||
        !bookingState.customer.email ||
        !bookingState.customer.phone
      ) {
        showNotification(
          "Please fill in all required customer information",
          "error"
        );
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingState.customer.email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Phone validation
      if (bookingState.customer.phone.length !== 11) {
        showNotification("Please enter a valid 11-digit phone number", "error");
        return;
      }

      updatePriceSummary();
      goToStep(5);
    });
  }

  // Step 5 -> Step 4
  const backToReview = document.getElementById("backToReview");
  if (backToReview) {
    backToReview.addEventListener("click", () => goToStep(4));
  }
}

function goToStep(stepNumber) {
  // Hide all steps
  document
    .querySelectorAll(".booking-section, .receipt-section")
    .forEach((section) => {
      section.classList.add("hidden");
    });

  // Show target step
  const targetStep = document.getElementById(
    `step${stepNumber}-${getStepName(stepNumber)}`
  );
  if (targetStep) {
    targetStep.classList.remove("hidden");
  }

  // Hide hero on steps 2+
  const hero = document.getElementById("heroSection");
  if (hero) {
    hero.classList.toggle("hidden", stepNumber > 1);
  }

  // Update current step
  bookingState.currentStep = stepNumber;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getStepName(stepNumber) {
  const names = {
    1: "package",
    2: "datetime",
    3: "customize",
    4: "review",
    5: "payment",
    6: "receipt",
  };
  return names[stepNumber] || "package";
}

// ============================================
// CONFETTI ANIMATION
// ============================================
function createConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) return;

  const colors = [
    "#C3A05C",
    "#13332C",
    "#F7F3E8",
    "#D4AF37",
    "#8B7355",
    "#4CAF50",
  ];
  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 10 + 5 + "px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = "-20px";
      confetti.style.opacity = Math.random() * 0.7 + 0.3;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";

      canvas.appendChild(confetti);

      // Animate
      const duration = Math.random() * 3000 + 2000;
      const fallDistance = window.innerHeight + 100;
      const horizontalMovement = (Math.random() - 0.5) * 200;

      confetti.animate(
        [
          {
            transform: `translate(0, 0) rotate(0deg)`,
            opacity: confetti.style.opacity,
          },
          {
            transform: `translate(${horizontalMovement}px, ${fallDistance}px) rotate(${
              Math.random() * 720
            }deg)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      ).onfinish = () => confetti.remove();
    }, i * 20);
  }

  // Create floating confetti that stays on screen
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = Math.random() * 8 + 4 + "px";
      confetti.style.height = Math.random() * 8 + 4 + "px";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.top = Math.random() * 100 + "%";
      confetti.style.opacity = Math.random() * 0.6 + 0.2;
      confetti.style.borderRadius = "50%";
      confetti.style.pointerEvents = "none";

      canvas.appendChild(confetti);

      // Float animation
      const floatAnimation = confetti.animate(
        [
          {
            transform: `translate(0, 0) scale(1)`,
            opacity: confetti.style.opacity,
          },
          {
            transform: `translate(${(Math.random() - 0.5) * 50}px, ${
              (Math.random() - 0.5) * 50
            }px) scale(${Math.random() * 0.5 + 0.8})`,
            opacity: Math.random() * 0.4 + 0.2,
          },
          {
            transform: `translate(0, 0) scale(1)`,
            opacity: confetti.style.opacity,
          },
        ],
        {
          duration: Math.random() * 3000 + 2000,
          iterations: Infinity,
          easing: "ease-in-out",
        }
      );

      // Remove after 10 seconds
      setTimeout(() => {
        floatAnimation.cancel();
        confetti.remove();
      }, 10000);
    }, i * 100);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(dateString) {
  if (!dateString) return "Not selected";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", options);
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existing = document.querySelectorAll(".notification");
  existing.forEach((n) => n.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    info: "#2196F3",
  };

  notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas ${icons[type]}" style="font-size: 24px; color: ${colors[type]};"></i>
            <span style="font-family: 'Roboto', sans-serif; font-size: 15px; color: var(--primary-green);">${message}</span>
        </div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        min-width: 300px;
        max-width: 500px;
        border-left: 5px solid ${colors[type]};
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease";
    setTimeout(() => notification.remove(), 500);
  }, 3500);
}

// Add animation styles
if (!document.getElementById("notification-animations")) {
  const style = document.createElement("style");
  style.id = "notification-animations";
  style.textContent = `
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
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 20px !important;
                right: 20px !important;
                left: 20px !important;
                min-width: auto !important;
            }
        }
    `;
  document.head.appendChild(style);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe package categories
setTimeout(() => {
  const categories = document.querySelectorAll(".package-category");
  categories.forEach((category, index) => {
    category.style.opacity = "0";
    category.style.transform = "translateY(30px)";
    category.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(category);
  });
}, 100);

// ============================================
// HEADER SCROLL EFFECT
// ============================================
let lastScrollTop = 0;
const header = document.querySelector(".main-header");

window.addEventListener("scroll", function () {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 100) {
    header.style.background = "rgba(19, 51, 44, 0.95)";
    header.style.backdropFilter = "blur(10px)";
    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
  } else {
    header.style.background =
      "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)";
    header.style.backdropFilter = "none";
    header.style.boxShadow = "none";
  }

  lastScrollTop = scrollTop;
});

// ============================================
// PREVENT FORM SUBMISSION
// ============================================
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });
});

// ============================================
// PAGE VISIBILITY - SAVE STATE
// ============================================
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Save booking state to sessionStorage
    sessionStorage.setItem(
      "granjeroBookingState",
      JSON.stringify(bookingState)
    );
  }
});

// Restore state on page load
window.addEventListener("load", function () {
  const savedState = sessionStorage.getItem("granjeroBookingState");
  if (savedState && bookingState.currentStep === 1) {
    try {
      const restored = JSON.parse(savedState);
      // Only restore if package is selected
      if (restored.package) {
        Object.assign(bookingState, restored);
      }
    } catch (e) {
      console.error("Failed to restore booking state:", e);
    }
  }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener("keydown", function (e) {
  // ESC to close mobile menu
  if (e.key === "Escape") {
    const hamburger = document.querySelector(".hamburger");
    const navigation = document.querySelector(".navigation");
    if (navigation && navigation.classList.contains("active")) {
      hamburger.classList.remove("active");
      navigation.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach((img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
  document.body.appendChild(script);
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log(
  "%c🌿 Welcome to Granjero Private Resort Booking! 🌿",
  "color: #13332C; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cWhere nature takes the lead",
  "color: #C3A05C; font-size: 14px; font-style: italic;"
);
console.log("%cBooking System v2.0", "color: #666; font-size: 12px;");

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener("error", function (e) {
  console.error("An error occurred:", e.error);
  // You can add error reporting here
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled promise rejection:", e.reason);
  // You can add error reporting here
});

// ============================================
// PERFORMANCE MONITORING
// ============================================
window.addEventListener("load", function () {
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(
      `%cPage loaded in ${pageLoadTime}ms`,
      "color: #4CAF50; font-weight: bold;"
    );
  }
});

// ============================================
// BROWSER COMPATIBILITY CHECK
// ============================================
function checkBrowserCompatibility() {
  const isCompatible =
    "Promise" in window && "fetch" in window && "querySelector" in document;

  if (!isCompatible) {
    alert(
      "Your browser may not be fully compatible with this booking system. Please use a modern browser like Chrome, Firefox, Safari, or Edge."
    );
  }
}

checkBrowserCompatibility();

// ============================================
// EXPORT FOR DEBUGGING (Development only)
// ============================================
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  window.granjeroDebug = {
    bookingState,
    PACKAGES,
    TIME_SLOTS,
    ADDON_PRICES,
    goToStep,
    showNotification,
  };
  console.log(
    "%cDebug mode enabled. Access window.granjeroDebug",
    "color: #2196F3;"
  );
}
