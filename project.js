document.addEventListener("DOMContentLoaded", () => {
    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const favicon = document.getElementById('favicon');
    const body = document.body;
    
    if (themeToggle) {
        const updateThemeAssets = (isDark) => {
            if (isDark) {
                themeToggle.src = 'public/images/theme/sun/pngtree-vector-sun-icon-png-image_1638731-removebg-preview.png';
                favicon.href = 'public/images/icon/dark_favicon.png';
            } else {
                themeToggle.src = 'public/images/theme/moon/moon-icon-33-removebg-preview.png';
                favicon.href = 'public/images/icon/light_favicon.png';
            }
        };

        // Initialize state
        let isDarkMode = body.classList.contains('dark-mode');
        updateThemeAssets(isDarkMode);
        
        themeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            body.classList.toggle('dark-mode', isDarkMode);
            updateThemeAssets(isDarkMode);
        });
    }

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
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0, 0);

    // 3. Canvas Frame Sequence Animation (Auto-play loop)
    const canvas = document.getElementById("project-canvas");
    if (canvas) {
        const context = canvas.getContext("2d");

        // High resolution for clear display
        canvas.width = 1920;
        canvas.height = 1080;

        const frameCount = 639;
        const currentFrame = index => (
            `public/images/build/darknetra/frames/${index + 1}.jpg`
        );

        const images = [];
        let loadedImages = 0;
        let currentFrameIndex = 0;
        let isPlaying = false;

        // Render specific frame
        function renderFrame(index) {
            const img = images[index];
            if (img && img.complete) {
                // Clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw image scaled to fit canvas covering it (like object-fit: cover)
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                context.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        }

        // Loop animation loop at 30 fps (~33ms per frame)
        function playFrames() {
            renderFrame(currentFrameIndex);
            currentFrameIndex = (currentFrameIndex + 1) % frameCount;
            setTimeout(() => {
                requestAnimationFrame(playFrames);
            }, 33); // Adjust for playback speed
        }

        // Preload images
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedImages++;
                // When at least 10 images are loaded, start playing so we don't wait forever
                if (loadedImages === 10 && !isPlaying) {
                    isPlaying = true;
                    playFrames();
                }
            };
            images.push(img);
        }
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
        
        const hoverElements = document.querySelectorAll('a, button, #theme-toggle');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }

    // 5. Initial Entrance Animations
    gsap.from('.project-logo', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.project-title-area', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
    gsap.from('.project-text-content p, .info-block', { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
});
