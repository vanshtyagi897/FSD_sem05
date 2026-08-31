const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;
    const course = document.getElementById("course").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    );

    // Clear previous errors
    document.querySelectorAll("small").forEach(function (element) {
        element.textContent = "";
    });

    document.getElementById("successMessage").textContent = "";

    let isValid = true;

    // Name validation
    if (name === "") {
        document.getElementById("nameError").textContent =
            "Name is required.";
        isValid = false;
    } else if (name.length < 3) {
        document.getElementById("nameError").textContent =
            "Name must contain at least 3 characters.";
        isValid = false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        document.getElementById("emailError").textContent =
            "Email is required.";
        isValid = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent =
            "Enter a valid email address.";
        isValid = false;
    }

    // Phone validation
    const phonePattern = /^[0-9]{10}$/;

    if (phone === "") {
        document.getElementById("phoneError").textContent =
            "Phone number is required.";
        isValid = false;
    } else if (!phonePattern.test(phone)) {
        document.getElementById("phoneError").textContent =
            "Phone number must contain exactly 10 digits.";
        isValid = false;
    }

    // Date of birth validation
    if (dob === "") {
        document.getElementById("dobError").textContent =
            "Date of birth is required.";
        isValid = false;
    }

    // Gender validation
    if (!gender) {
        document.getElementById("genderError").textContent =
            "Please select your gender.";
        isValid = false;
    }

    // Course validation
    if (course === "") {
        document.getElementById("courseError").textContent =
            "Please select a course.";
        isValid = false;
    }

    // Password validation
    if (password === "") {
        document.getElementById("passwordError").textContent =
            "Password is required.";
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById("passwordError").textContent =
            "Password must contain at least 8 characters.";
        isValid = false;
    }

    // Confirm password validation
    if (confirmPassword === "") {
        document.getElementById("confirmPasswordError").textContent =
            "Please confirm your password.";
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
            "Passwords do not match.";
        isValid = false;
    }

    // Terms validation
    if (!terms) {
        document.getElementById("termsError").textContent =
            "You must agree to the terms and conditions.";
        isValid = false;
    }

    // Final result
    if (isValid) {
        document.getElementById("successMessage").textContent =
            "Registration successful!";

        form.reset();
    }
});