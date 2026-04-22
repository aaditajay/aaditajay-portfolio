document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);

    // 3. Canvas Frame Sequence Animation
    const canvas = document.getElementById("project-canvas");
    if (canvas) {
        const context = canvas.getContext("2d");

        // Set high resolution for canvas
        canvas.width = 1920;
        canvas.height = 1080;

        const frameCount = 639;
        const currentFrame = index => (
            `public/images/build/darknetra/frames/${index + 1}.jpg`
        );

        const images = [];
        const imageSeq = {
            frame: 0
        };

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        // Render function
        function render() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const img = images[imageSeq.frame];
            if (img && img.complete) {
                // Draw image scaled to fit canvas covering it (like object-fit: cover)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        }

        images[0].onload = render;

        // Create ScrollTrigger to animate frames
        gsap.to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                trigger: ".project-media",
                start: "top 10%", // Pin when the section reaches top 10% of viewport
                end: "+=3000", // Scroll distance for the animation
                scrub: 0.5,
                pin: true
            },
            onUpdate: render
        });
        
        // Initial render fallback if onload misses
        setTimeout(render, 500);
    }

    // 4. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
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
        
        const hoverElements = document.querySelectorAll('a, button, .team-member');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 5. Initial Animations
    gsap.from('.project-logo', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.project-title-area', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
    gsap.from('.project-text-content p', { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
});
