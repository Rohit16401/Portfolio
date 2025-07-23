document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('i');

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const navCenter = document.querySelector('.nav-center'); // Target the .nav-center div
    const navUlInCenter = navCenter ? navCenter.querySelector('ul') : null; // Get the ul inside .nav-center

    hamburger.addEventListener('click', () => {
        if (navUlInCenter) {
            navUlInCenter.classList.toggle('active');
        }

        const icon = hamburger.querySelector('i');
        const isActive = navUlInCenter && navUlInCenter.classList.contains('active');

        if (isActive) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close nav when a link is clicked (for mobile)
    if (navUlInCenter) {
        const navLinksForMobileClose = navUlInCenter.querySelectorAll('li a');
        navLinksForMobileClose.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navUlInCenter.classList.contains('active')) {
                    navUlInCenter.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }


    // --- Theme Toggling ---
    function setIconForTheme(theme) {
        if (theme === 'light') { // When switching TO light theme, button should show MOON to switch back to dark
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        } else { // When switching TO dark theme, button should show SUN to switch back to light
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
        }
    }

    let currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    body.classList.toggle('light-theme', currentTheme === 'light');
    setIconForTheme(currentTheme); // Set initial icon based on loaded theme


    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        setIconForTheme(currentTheme);
    });


    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                     if (window.innerWidth <= 768 && navUlInCenter && navUlInCenter.classList.contains('active')) {
                         navUlInCenter.classList.remove('active');
                         const icon = hamburger.querySelector('i');
                         icon.classList.remove('fa-times');
                         icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // --- Current Year in Footer ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
       currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Active Navigation Link Highlighting ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinksForScroll = navUlInCenter ? navUlInCenter.querySelectorAll('li a') : []; // Use the UL inside nav-center
    const headerElement = document.querySelector('header');
    const headerOffset = headerElement ? headerElement.offsetHeight + 40 : 110; // Default if header not found

    function changeNavOnScroll() {
        let currentSectionId = '';
        let bottomReached = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerOffset;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        if (bottomReached && navLinksForScroll.length > 0) {
            const lastNavLinkHref = navLinksForScroll[navLinksForScroll.length - 1].getAttribute('href');
            if (lastNavLinkHref) {
                currentSectionId = lastNavLinkHref.substring(1);
            }
        }

        navLinksForScroll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

         if (currentSectionId === '' && sections.length > 0 && window.pageYOffset < sections[0].offsetTop - headerOffset ) {
             const homeLink = navUlInCenter ? navUlInCenter.querySelector('li a[href="#hero"]') : null;
             if (homeLink) {
                navLinksForScroll.forEach(link => link.classList.remove('active'));
                homeLink.classList.add('active');
             }
         }
    }
    window.addEventListener('scroll', changeNavOnScroll);
    changeNavOnScroll();


    // --- Section Fade-in Animation ---
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.content-section').forEach(section => {
        sectionObserver.observe(section);
    });

});