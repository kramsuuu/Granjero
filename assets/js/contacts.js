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

const form = document.querySelector("form");

let namePattern = /^[A-Z][a-z]{2,20}(?:\s[A-Z][a-z]{2,20})*$/
let contactPattern = /^09[0-9]{9}$/;
let inquiryPattern = /^[\s\S]{5,1000}$/;
let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

let users = [];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let fNameResult = namePattern.test(form.firstName.value);
    let lNameResult = namePattern.test(form.lastName.value);
    let emailResult = emailPattern.test(form.email.value);
    let contactResult = contactPattern.test(form.contact.value);
    let inquiryResult = inquiryPattern.test(form.inquiry.value);

    let message = document.querySelector("span");

    if (fNameResult && lNameResult && emailResult && contactResult && inquiryResult) {
        message.innerHTML = "Form Submitted Successfully!";
        message.setAttribute("class", "success");

        users.push({
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            contact: form.contact.value,
            inquirybio: form.inquiry.value
        });

        console.log(users);

        resetForm();

    } else {
        message.innerHTML = "Please fill out the form correctly.";
        message.setAttribute("class", "error");
    }
});

form.firstName.addEventListener("keyup", (event) => {
    let fNameResult = namePattern.test(event.target.value);
    if (fNameResult) {
        form.firstName.setAttribute("class", "accepted");
    } else {
        form.firstName.setAttribute("class", "rejected");
    }
});

form.lastName.addEventListener("keyup", (event) => {
    let lNameResult = namePattern.test(event.target.value);
    if (lNameResult) {
        form.lastName.setAttribute("class", "accepted");
    } else {
        form.lastName.setAttribute("class", "rejected");
    }
});

form.email.addEventListener("keyup", (event) => {
    let emailResult = emailPattern.test(event.target.value);
    if (emailResult) {
        form.email.setAttribute("class", "accepted");
    } else {
        form.email.setAttribute("class", "rejected");
    }
});

form.contact.addEventListener("keyup", (event) => {
    let contactResult = contactPattern.test(event.target.value);
    if (contactResult) {
        form.contact.setAttribute("class", "accepted");
    } else {
        form.contact.setAttribute("class", "rejected");
    }
});

form.inquiry.addEventListener("keyup", (event) => {
    let inquiryResult = inquiryPattern.test(event.target.value);
    if (inquiryResult) {
        form.inquiry.setAttribute("class", "accepted");
    } else {
        form.inquiry.setAttribute("class", "rejected");
    }
});


