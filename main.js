document.addEventListener('DOMContentLoaded', () => {
    // sticky nav
    const nav = document.querySelector('#sticky-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // scroll reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // active link highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => activeObserver.observe(section));

    // parallax effect
    window.addEventListener('scroll', () => {
        const parallax = document.querySelector('.parallax');
        if (parallax) {
            let offset = window.scrollY;
            parallax.style.transform = `translateY(calc(-50% + ${offset * 0.1}px))`;
        }
    });

    // smooth scroll for nav links with offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top functionality
    const backToTopBtn = document.querySelector('#back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Validation and Logic
    const form = document.querySelector('#risk-review-form');
    const emailInput = document.querySelector('#email');
    const emailError = document.querySelector('#email-error');
    const checkboxError = document.querySelector('#checkbox-error');
    const otherCheckbox = document.querySelector('#other-checkbox');
    const otherGroup = document.querySelector('#other-description-group');
    const successModal = document.querySelector('#success-modal');
    const closeModal = document.querySelector('#close-modal');

    if (form) {
        // Toggle "Other" description field
        otherCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                otherGroup.classList.remove('hidden');
            } else {
                otherGroup.classList.add('hidden');
            }
        });

        // Modal Close logic
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                successModal.classList.add('hidden');
            });
        }

        // Form Submission via AJAX (Formspree)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let hasError = false;

            // Email Validation
            const email = emailInput.value.toLowerCase();
            const forbiddenDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
            const domain = email.split('@')[1];

            if (forbiddenDomains.includes(domain)) {
                emailError.classList.add('visible');
                emailInput.style.borderColor = '#ff4d4d';
                hasError = true;
            } else {
                emailError.classList.remove('visible');
                emailInput.style.borderColor = 'var(--border)';
            }

            // Checkbox Validation (At least one)
            const agentCheckboxes = form.querySelectorAll('input[name="agent-type[]"]');
            const isAnyChecked = Array.from(agentCheckboxes).some(cb => cb.checked);

            if (!isAnyChecked) {
                checkboxError.classList.add('visible');
                hasError = true;
            } else {
                checkboxError.classList.remove('visible');
            }

            if (hasError) return;

            // Prepare Data for Formspree
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show attractive modal instead of alert
                    successModal.classList.remove('hidden');
                    // Trigger reveal animations inside modal
                    successModal.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
                    form.reset();
                    otherGroup.classList.add('hidden');
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Oops! There was a problem submitting your form. Please try again.');
                    }
                }
            } catch (error) {
                alert('Connection error. Please check your network and try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
