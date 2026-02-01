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
    const otherCheckbox = document.querySelector('#other-checkbox');
    const otherGroup = document.querySelector('#other-description-group');

    if (form) {
        // Toggle "Other" description field
        otherCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                otherGroup.classList.remove('hidden');
            } else {
                otherGroup.classList.add('hidden');
            }
        });

        // Email Validation
        form.addEventListener('submit', (e) => {
            const email = emailInput.value.toLowerCase();
            const forbiddenDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
            const domain = email.split('@')[1];

            if (forbiddenDomains.includes(domain)) {
                e.preventDefault();
                emailError.classList.add('visible');
                emailInput.style.borderColor = '#ff4d4d';
            } else {
                emailError.classList.remove('visible');
                emailInput.style.borderColor = 'var(--border)';
                // Form would submit normally here or via fetch
                alert('Analysis request sent. An architect will review your setup.');
            }
        });
    }
});
