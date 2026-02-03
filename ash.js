// Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('nav');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.innerHTML = nav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if(nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if(mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });

    // Grade button functionality (for both desktop and mobile)
    function setupGradeButtons() {
        const allGradeButtons = document.querySelectorAll('.grade-btn');
        const grade11Content = document.getElementById('grade11-content');
        const grade12Content = document.getElementById('grade12-content');

        allGradeButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all grade buttons (both desktop and mobile)
                document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('active'));
                
                // Get the grade value
                const grade = this.getAttribute('data-grade');
                
                // Add active class to both desktop and mobile buttons of same grade
                document.querySelectorAll(`[data-grade="${grade}"]`).forEach(btn => {
                    btn.classList.add('active');
                });
                
                // Switch content
                if (grade === '12') {
                    grade11Content.classList.remove('active');
                    grade12Content.classList.add('active');
                    console.log('Grade 12 selected - content coming soon!');
                } else {
                    grade12Content.classList.remove('active');
                    grade11Content.classList.add('active');
                    console.log('Grade 11 selected');
                }
                
                // Close mobile menu if open
                if(nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if(mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Scroll to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // FORCE UPDATE OF NAV HIGHLIGHTING AFTER GRADE SWITCH
                setTimeout(() => {
                    updateActiveNavLink();
                }, 100);
            });
        });
    }

    // Initialize grade buttons
    setupGradeButtons();

    // Add interactive effects to module cards
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 25px rgba(215, 94, 145, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });

    // Header scroll effect - Different thresholds for mobile vs desktop
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Mobile: Snappy 10px threshold for floating effect
        // Desktop: Keep 50px threshold for just color change
        const scrollThreshold = window.innerWidth <= 768 ? 10 : 50;
        
        if (scrollPosition > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink();
    });

    // ================================================
    // ACTIVE NAVIGATION LINK BASED ON SCROLL POSITION
    // ================================================

    function updateActiveNavLink() {
        // Determine which grade content is currently active
        const grade11Active = document.getElementById('grade11-content').classList.contains('active');
        const grade12Active = document.getElementById('grade12-content').classList.contains('active');
        
        // Get all sections that have an id WITHIN THE ACTIVE GRADE CONTENT
        let sections;
        if (grade11Active) {
            sections = document.querySelectorAll('#grade11-content section[id]');
        } else if (grade12Active) {
            sections = document.querySelectorAll('#grade12-content section[id]');
        } else {
            return; // No active grade content
        }
        
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + 150; // Offset for better accuracy
        
        // Find which section we're currently in
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update nav links - remove all active classes first
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            
            // Add active class to the link that matches current section
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active-link');
            }
        });
        
        // Special case: if at the very top, highlight "Home"
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === '#home' || link.getAttribute('href') === '#') {
                    link.classList.add('active-link');
                }
            });
        }
    }

    // ================================================
    // SCROLL-BASED FADE ANIMATIONS
    // ================================================

    function initScrollAnimations() {
        // Select all elements that should fade
        const elementsToAnimate = document.querySelectorAll(`
            .module-card,
            .photo-item,
            .reflection-accordion,
            .coverage-item,
            .quote-item,
            .w4-text,
            .w4-certificate,
            .section-title
        `);
        
        // Add fade-element class to all selected elements
        elementsToAnimate.forEach(element => {
            element.classList.add('fade-element');
        });
        
        // Create Intersection Observer
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.10 // Trigger when 15% of element is visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is entering viewport from bottom
                    entry.target.classList.add('fade-in');
                    entry.target.classList.remove('fade-out');
                } else {
                    // Check if element is above viewport (scrolled past)
                    const rect = entry.target.getBoundingClientRect();
                    if (rect.bottom < 0) {
                        // Element is above viewport (scrolled past)
                        entry.target.classList.add('fade-out');
                        entry.target.classList.remove('fade-in');
                    } else {
                        // Element is below viewport (not reached yet)
                        entry.target.classList.remove('fade-in');
                        entry.target.classList.remove('fade-out');
                    }
                }
            });
        }, observerOptions);
        
        // Observe all elements
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // ================================================
    // BACK TO TOP BUTTON FUNCTIONALITY WITH DIRECTION-BASED ICON
    // ================================================

    // Get the back to top button
    const backToTopBtn = document.getElementById('backToTop');
    let lastScrollPosition = 0;
    let isScrollingDown = true;

    // Show/hide button and change icon based on scroll position and direction
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollPosition > lastScrollPosition) {
            // Scrolling down
            isScrollingDown = true;
            backToTopBtn.querySelector('i').className = 'fa-solid fa-arrow-down';
        } else {
            // Scrolling up
            isScrollingDown = false;
            backToTopBtn.querySelector('i').className = 'fa-solid fa-arrow-up';
        }
        
        // Show/hide button based on scroll position
        if (currentScrollPosition > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
        
        lastScrollPosition = currentScrollPosition;
    });

    // Scroll to top/bottom when clicked based on current direction
    backToTopBtn.addEventListener('click', function() {
        if (isScrollingDown) {
            // If scrolling down, jump to bottom
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            // If scrolling up, jump to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize scroll animations
        initScrollAnimations();
        
        // Initialize active nav link
        updateActiveNavLink();
        
        // Ensure smooth transitions for header
        if (header) {
            header.style.transition = 'all 0.4s ease';
        }
        
        // Initialize mobile menu button state
        if (mobileMenuBtn && nav) {
            if (nav.classList.contains('active')) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
        
        // ================================================
        // ACCORDION FUNCTIONALITY WITH AUTO-CLOSE ON SCROLL
        // ================================================
        
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        let isScrolling;
        
        // Helper function to close all accordions
        function closeAllAccordions() {
            accordionHeaders.forEach(header => {
                const accordion = header.parentElement;
                const content = header.nextElementSibling;
                const icon = header.querySelector('.accordion-icon');
                
                accordion.classList.remove('active');
                content.classList.remove('active');
                content.style.maxHeight = null;
                icon.textContent = '+';
            });
        }
        
        // Helper function for accordion click
        function handleAccordionClick() {
            // Get the parent accordion and content
            const accordion = this.parentElement;
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            
            // FIRST, CLOSE ALL OTHER ACCORDIONS
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherAccordion = otherHeader.parentElement;
                    const otherContent = otherHeader.nextElementSibling;
                    const otherIcon = otherHeader.querySelector('.accordion-icon');
                    
                    // Close other accordion
                    otherAccordion.classList.remove('active');
                    otherContent.classList.remove('active');
                    otherContent.style.maxHeight = null;
                    otherIcon.textContent = '+';
                }
            });
            
            // THEN, TOGGLE THE CLICKED ACCORDION
            if (accordion.classList.contains('active')) {
                // If already active, close it
                accordion.classList.remove('active');
                content.classList.remove('active');
                content.style.maxHeight = null;
                icon.textContent = '+';
            } else {
                // If not active, open it
                accordion.classList.add('active');
                content.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.textContent = '-';
            }
        }
        
        // Add click handlers to all accordion headers
        accordionHeaders.forEach(header => {
            // Remove any existing click handlers to prevent duplicates
            header.removeEventListener('click', handleAccordionClick);
            
            // Add the click handler
            header.addEventListener('click', handleAccordionClick);
        });
        
        // ================================================
        // AUTO-CLOSE ACCORDIONS ON SCROLL
        // ================================================
        
        window.addEventListener('scroll', function() {
            // Clear timeout if user keeps scrolling
            window.clearTimeout(isScrolling);
            
            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(function() {
                // Check if any accordion is open
                const hasOpenAccordion = document.querySelector('.reflection-accordion.active');
                
                if (hasOpenAccordion) {
                    // Close all accordions after user stops scrolling
                    closeAllAccordions();
                }
            }, 150); // Wait 150ms after scroll stops
        });
        
    // ================================================
    // BOOKTALK SLIDESHOW WITH SEAMLESS CROSS-FADE
    // ================================================

    const slideshowContainer = document.querySelector('.slideshow-container');

    if (slideshowContainer) {
        const images = slideshowContainer.querySelectorAll('.slideshow-image');
        let currentIndex = 0;
        
        // Make sure first image is visible
        images[0].classList.add('active');
        
        function showNextImage() {
            // Calculate next index
            const nextIndex = (currentIndex + 1) % images.length;
            
            // Add active class to next image (start fading in)
            // This image fades in OVER the current one
            images[nextIndex].classList.add('active');
            
            // After the fade completes, remove active from current image
            setTimeout(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = nextIndex;
            }, 1500); // Wait for full fade transition (matches CSS transition time)
        }
        
        // Change image every 4 seconds
        setInterval(showNextImage, 4000);
    }
    });

    // ================================================
    // SVG ANIMATION CONTROL - NO CHANGES NEEDED
    // The CSS now handles continuous animation with infinite loop
    // ================================================

    // ================================================
    // CERTIFICATE MODAL FUNCTIONALITY - BOTH GRADES
    // ================================================

    // Get all certificate frames and modals
    const certificateFrames = document.querySelectorAll('.certificate-frame');
    const certificateModals = document.querySelectorAll('.certificate-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Open modal when any certificate frame is clicked
    certificateFrames.forEach((frame, index) => {
        frame.addEventListener('click', function() {
            // Find the closest modal in the same grade content section
            const modal = this.closest('.grade-content').querySelector('.certificate-modal');
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    // Close modal when X is clicked
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.certificate-modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    });

    // Close modal when clicking outside the image
    certificateModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            certificateModals.forEach(modal => {
                if (modal.classList.contains('show')) {
                    modal.classList.remove('show');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });