document.addEventListener("DOMContentLoaded", () => {
    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    let isDarkMode = false;
    
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            body.classList.add('dark-mode');
            themeToggle.src = 'public/images/theme/sun/pngtree-vector-sun-icon-png-image_1638731-removebg-preview.png';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.src = 'public/images/theme/moon/moon-icon-33-removebg-preview.png';
        }
    });

    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target) {
                lenis.scrollTo(target, { offset: -50 });
            }
        });
    });

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // 3. Landing Section Blur on Scroll
    gsap.to('.landing', {
        scrollTrigger: {
            trigger: '.image-transition',
            start: 'top 95%',
            end: 'top -50%', // blurred slowly over a longer distance
            scrub: true,
        },
        filter: 'blur(20px)',
        opacity: 0.2,
    });

    // 4. Portrait Image Scroll Interaction (3D Rotation & Slide)
    const imgContainer = document.querySelector('.image-container');
    const portraitImg = document.querySelector('.portrait-img');

    // Initial state
    gsap.set(portraitImg, {
        opacity: 0,
        rotationY: -180,
        scale: 0.5,
        y: 200
    });

    // Animation timeline linked to scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.image-transition',
            start: 'top 95%', 
            end: 'top 55%', // finish arriving much sooner
            scrub: 1, // smooth scrubbing
        }
    });

    // 1. First, bring it up and fade it in
    tl.fromTo('.portrait-img', 
        { 
            y: 200, 
            opacity: 0, 
            scale: 0.8,
            rotationY: -90
        }, 
        { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            ease: "power1.out",
            duration: 1
        }
    );

    // 2. Delay the rotation to happen as it settles (offset by 0.4s into the 1s timeline)
    tl.to('.portrait-img', {
        rotationY: 0,
        ease: "power1.inOut",
        duration: 0.6
    }, 0.4);

    // 5. About Overlay slide up effect
    // As we scroll past the image, the About section slides over
    gsap.fromTo('.about.overlay', 
        { y: 100 },
        {
            y: 0,
            scrollTrigger: {
                trigger: '.about.overlay',
                start: 'top bottom',
                end: 'top center',
                scrub: true
            }
        }
    );

    // 6. Experience Counters Animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
            scrollTrigger: {
                trigger: '.experience-layout',
                start: 'top 80%', // trigger when section comes into view
                toggleActions: 'play none none reverse' // play animation normally
            },
            innerHTML: target,
            duration: 2, // 2 seconds animation
            snap: { innerHTML: 1 },
            ease: 'power2.out',
            onUpdate: function() {
                counter.innerHTML = Math.round(this.targets()[0].innerHTML);
            }
        });
    });

    // 7. Subtle Reveal Animations for Sections
    const sectionTitles = gsap.utils.toArray('.section-title');
    sectionTitles.forEach(sec => {
        gsap.from(sec, {
            scrollTrigger: {
                trigger: sec,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    });

    // Smooth Staggered Animation for Items
    const expertiseGrid = document.querySelector('.expertise-grid');
    if (expertiseGrid) {
        gsap.fromTo('.expertise-pill', 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.expertise-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: 'expo.out'
            }
        );
    }

    const expLeft = document.querySelector('.experience-left');
    if (expLeft) {
        gsap.fromTo('.exp-item', 
            { x: -30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.experience-left',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: 'expo.out'
            }
        );
    }
    
    gsap.from('.edu-col', {
        scrollTrigger: {
            trigger: '.education-columns',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });

    // 8. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };
    
    const renderCursor = () => {
        cursorX = lerp(cursorX, mouseX, 0.15);
        cursorY = lerp(cursorY, mouseY, 0.15);
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    };
    renderCursor();
    
    const hoverElements = document.querySelectorAll('a, button, .exp-item, .expertise-pill, #theme-toggle');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

});
