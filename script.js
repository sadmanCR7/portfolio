document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Dark Mode Toggle
    // ==========================================
 const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const icon = themeToggle.querySelector("i");

    // Logic: If the user previously chose "light", switch to light.
    // Otherwise (if "dark" or null/first visit), keep it Dark.
    if (localStorage.getItem("theme") === "light") {
        body.removeAttribute("data-theme"); // Remove dark attribute -> becomes Light
        icon.classList.replace("fa-sun", "fa-moon"); // Show Moon icon
    } else {
        body.setAttribute("data-theme", "dark"); // Ensure Dark is active
        icon.classList.replace("fa-moon", "fa-sun"); // Show Sun icon
    }

    themeToggle.addEventListener("click", () => {
        // If currently Dark, switch to Light
        if (body.getAttribute("data-theme") === "dark") {
            body.removeAttribute("data-theme");
            icon.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        } 
        // If currently Light, switch to Dark
        else {
            body.setAttribute("data-theme", "dark");
            icon.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        }
    });

    // ==========================================
    // 2. Mobile Navigation (Hamburger Menu)
    // ==========================================
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
        hamburger.classList.toggle("toggle"); 
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("nav-active");
            hamburger.classList.remove("toggle");
        });
    });

    // ==========================================
    // 3. Scroll Animations (Fade In)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));

    // ==========================================
    // 4. Active Link Highlight on Scroll
    // ==========================================
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav-links li a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Offset logic to trigger active state slightly before reaching section
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navItems.forEach(a => {
            a.classList.remove("active");
            if (a.getAttribute("href").includes(current)) {
                a.classList.add("active");
            }
        });
    });
// --- Contact Form Handling with Formspree ---
    const form = document.getElementById("contact-form");
    
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name");
            const email = document.getElementById("email");
            const subject = document.getElementById("subject"); // NEW
            const message = document.getElementById("message");
            const btn = document.getElementById("submit-btn");
            
            let isValid = true;

            // --- Validation ---
            if(name.value.trim() === "") { setError(name); isValid = false; } else { setSuccess(name); }

            if(email.value.trim() === "" || !isValidEmail(email.value)) { setError(email); isValid = false; } else { setSuccess(email); }

            // NEW: Subject Validation
            if(subject.value.trim() === "") { setError(subject); isValid = false; } else { setSuccess(subject); }

            if(message.value.trim() === "") { setError(message); isValid = false; } else { setSuccess(message); }

            // --- Send Data ---
            if(isValid) {
                const originalText = btn.innerText;
                btn.innerText = "Sending...";
                btn.disabled = true;

                try {
                    // REPLACE WITH YOUR FORMSPREE ID
                    const response = await fetch("https://formspree.io/f/xrepwnvl", {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: name.value,
                            email: email.value,
                            subject: subject.value, // NEW: Include subject in data
                            message: message.value
                        })
                    });

                    if (response.ok) {
                        alert("Message sent successfully!");
                        form.reset();
                        [name, email, subject, message].forEach(input => input.parentElement.classList.remove("error"));
                    } else {
                        alert("Oops! Problem sending message.");
                    }
                } catch (error) {
                    alert("Error: Could not send message.");
                } finally {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            }
        });
    }

    // --- Helper Functions ---
    function setError(input) {
        input.parentElement.classList.add("error");
    }

    function setSuccess(input) {
        input.parentElement.classList.remove("error");
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});