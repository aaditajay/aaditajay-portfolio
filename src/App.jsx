import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {

    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const favicon = document.getElementById('favicon');
    const body = document.body;
    
    const updateThemeAssets = (isDark) => {
        const themeToggleImg = document.getElementById('theme-toggle');
        const favIconLink = document.getElementById('favicon');
        
        if (isDark) {
            if (themeToggleImg) themeToggleImg.src = '/images/theme/sun/pngtree-vector-sun-icon-png-image_1638731-removebg-preview.png';
            if (favIconLink) favIconLink.href = '/images/webicon/dark/favicon-dark.png';
        } else {
            if (themeToggleImg) themeToggleImg.src = '/images/theme/moon/moon-icon-33-removebg-preview.png';
            if (favIconLink) favIconLink.href = '/images/webicon/light/favicon-light.png';
        }
    };

    // Initialize theme from localStorage or default to dark
    let isDarkMode = localStorage.getItem('theme') !== 'light-mode';
    
    const applyTheme = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        body.classList.toggle('light-mode', !isDark);
        document.documentElement.classList.toggle('dark-theme-active', isDark);
        updateThemeAssets(isDark);
    };

    // Apply initial theme
    applyTheme(isDarkMode);
    
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
        applyTheme(isDarkMode);
    });

    // Listen for theme changes in other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            isDarkMode = e.newValue === 'dark-mode';
            applyTheme(isDarkMode);
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
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hero Section Scroll Blur Effect
    gsap.to('.new-hero-container', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'top top',
            scrub: true
        },
        filter: 'blur(15px)',
        opacity: 0.3,
        ease: 'none'
    });

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

    // --- Preloader Logic ---
    const preloader = document.querySelector('.preloader');
    const loaderText = document.querySelector('.loader-text');
    const progressBar = document.querySelector('.progress-bar');
    
    if (preloader) {
        if (sessionStorage.getItem('portfolioLoaded')) {
            preloader.style.display = 'none';
        } else {
            const pt = gsap.timeline({
                onComplete: () => {
                    sessionStorage.setItem('portfolioLoaded', 'true');
                }
            });
            pt.fromTo(loaderText, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            )
            .to(progressBar, {
                width: "100%",
                duration: 1.5,
                ease: "power2.inOut"
            })
            .to(preloader, {
                y: "-100%",
                opacity: 0,
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => preloader.style.display = 'none'
            });
        }
    }

    // --- New Hero Interactivity Removed ---

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0, 0);


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

    gsap.from('.build-box', {
        scrollTrigger: {
            trigger: '.build-columns',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.out'
    });

    gsap.from('.ground-box', {
        scrollTrigger: {
            trigger: '.ground-columns',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
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
    
    const hoverElements = document.querySelectorAll('a, button, .exp-item, .expertise-pill, #theme-toggle, .social-icon');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // --- Logo Click to Top ---
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
        headerLogo.addEventListener('click', () => {
            lenis.scrollTo(0);
        });
    }

    // --- Contact Social Icons Interactivity ---
    const socialIcons = document.querySelectorAll('.social-icon');
    const barUsername = document.getElementById('bar-username');
    const barConnectBtn = document.getElementById('bar-connect-btn');
    const contactBar = document.getElementById('contact-bar');

    let fixedPlatform = null;
    let activeLink = "#";

    socialIcons.forEach(icon => {
        const platform = icon.dataset.platform;
        const username = icon.dataset.user;
        const link = icon.dataset.link;

        // Hover Effect
        icon.addEventListener('mouseenter', () => {
            if (!fixedPlatform) {
                barUsername.textContent = username;
                activeLink = link;
                contactBar.style.opacity = "1";
                contactBar.style.borderColor = "var(--text-color)";
            }
        });

        icon.addEventListener('mouseleave', () => {
            if (!fixedPlatform) {
                barUsername.textContent = "Select a platform";
                activeLink = "#";
                contactBar.style.opacity = "0.8";
                contactBar.style.borderColor = "var(--border-color)";
            }
        });

        // Click Logic
        icon.addEventListener('click', () => {
            socialIcons.forEach(i => i.classList.remove('active'));
            
            if (fixedPlatform === platform) {
                fixedPlatform = null;
                barUsername.textContent = "Select a platform";
                activeLink = "#";
                contactBar.style.opacity = "0.8";
                contactBar.style.borderColor = "var(--border-color)";
            } else {
                fixedPlatform = platform;
                icon.classList.add('active');
                barUsername.textContent = username;
                activeLink = link;
                contactBar.style.opacity = "1";
                contactBar.style.borderColor = "var(--text-color)";
                
                gsap.fromTo(contactBar, 
                    { scale: 0.98 }, 
                    { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" }
                );
            }
        });
    });

    // Handle "Connect" click using window.open
    barConnectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (activeLink && activeLink !== "#") {
            if (activeLink.startsWith('mailto:')) {
                window.location.href = activeLink;
            } else {
                window.open(activeLink, '_blank');
            }
        } else {
            // Subtle shake if no platform selected
            gsap.to(contactBar, { 
                x: 5, 
                repeat: 3, 
                yoyo: true, 
                duration: 0.05, 
                onComplete: () => gsap.to(contactBar, { x: 0 }) 
            });
        }
    });

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);

    return () => {
        lenis.destroy();
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.ticker.remove(raf);
    };

  }, []);

  return (
    <>

    
    <div id="preloader" className="preloader">
        <div className="loader-box">
            <h1 className="loader-text">LOADING PORTFOLIO</h1>
            <div className="progress-bar" id="progress-bar"></div>
        </div>
    </div>

    <img src="/images/theme/moon/moon-icon-33-removebg-preview.png" alt="Toggle Theme" className="theme-toggle"
        id="theme-toggle" />
    <div className="custom-cursor"></div>
    <a href="#landing" className="logo-img-wrapper" id="header-logo" style={{'cursor': 'pointer', 'position': 'fixed', 'top': '2rem', 'left': '2rem', 'zIndex': '1000'}}>
        <img src="/images/icon/light/logo-light.png" className="logo-img light-logo" alt="Logo" style={{ width: '40px', height: 'auto' }} />
        <img src="/images/icon/dark/logo-dark.png" className="logo-img dark-logo" alt="Logo" style={{ width: '40px', height: 'auto' }} />
    </a>
    <nav className="main-nav">
        <a href="#about" className="nav-link">About</a>
        <a href="#expertise" className="nav-link">Expertise</a>
        <a href="#experience" className="nav-link">Experience</a>
        <a href="#contact" className="nav-link">Contact</a>
        <a href="https://drive.google.com/file/d/1aBwnuR7WtrjlnrsXIZ_RFB6dnIhhogyc/view?usp=sharing" className="nav-link" target="_blank" rel="noopener noreferrer">
            Resume 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V3M12 15L8 11M12 15L16 11M21 21H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </a>
    </nav>
    <div id="smooth-wrapper">
        <div id="smooth-content">

            
            <section className="landing new-hero-container" id="landing">
                
                <div className="new-hero-bg-text">
                    <div className="bg-text-line">PROJECT</div>
                    <div className="bg-text-line">MANAGER</div>
                </div>

                <div className="new-hero-left">
                    <div className="new-hero-row">
                        <span className="hero-primary">A</span><span className="hero-secondary">ADIT</span>
                    </div>
                    <div className="new-hero-row">
                        <span className="hero-primary">A</span><span className="hero-secondary">JAY</span>
                    </div>
                </div>

                <div className="new-hero-img-wrap">
                    <img src="/images/hero/pfp/1000340495.png" alt="Aadit Ajay" className="new-hero-img" />
                </div>

                <div className="new-hero-right">
                    <div className="right-line" style={{ fontSize: '48px', letterSpacing: '0.58em', whiteSpace: 'nowrap', marginRight: '-0.58em' }}>
                        <span className="hero-secondary">PROJE</span><span className="hero-primary">CT</span>
                    </div>
                    <div className="right-line" style={{ fontSize: '48px', letterSpacing: '0.58em', whiteSpace: 'nowrap', marginRight: '-0.58em' }}>
                        <span className="hero-secondary">MANAG</span><span className="hero-primary">ER</span>
                    </div>
                    <div className="right-line" style={{ fontSize: '48px', letterSpacing: '0', whiteSpace: 'nowrap', WebkitTextStrokeWidth: '1px', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                        <span className="hero-secondary-stroke">& DEVELOP</span><span className="hero-primary-stroke">ER</span>
                    </div>
                </div>
            </section>

            <div className="content-overlay" style={{'position': 'relative', 'zIndex': '10', 'marginTop': '100vh'}}>
                


                
                <section className="about overlay" id="about">
                    <div className="about-container">
                        <div className="about-content-split">
                            <div className="about-text-wrap">
                                <h2 className="section-title" style={{'marginBottom': '2rem'}}>About Me</h2>
                                <p className="about-text">
                                    I’m Aadit Ajay, a third-year Computer Science and Engineering student who naturally
                                    steps
                                    into roles where things need to be led, organized or built. I focus on creating
                                    structured,
                                    high-energy environments where people collaborate, execute ideas and grow together.
                                </p>
                                <p className="about-text">
                                    My work revolves around managing communities, leading initiatives and turning intent
                                    into
                                    action — consistently building systems that sustain momentum and impact.
                                </p>
                            </div>
                            <div className="about-image-wrap">
                                <img src="/images/about/1000316139 (2).png" alt="Aadit Ajay" className="about-img" />
                            </div>
                        </div>
                    </div>
                </section>



                
                <section className="expertise" id="expertise">
                    <h2 className="section-title" style={{'textAlign': 'center'}}>What I Do</h2>
                    <div className="expertise-grid">
                        <div className="expertise-pill">
                            <h3>Project Manager</h3>
                            <p className="pill-desc">Planning, organizing and executing initiatives with clarity, timelines
                                and measurable outcomes.</p>
                        </div>
                        <div className="expertise-pill">
                            <h3>Developer</h3>
                            <p className="pill-desc">Engaging with Python and development concepts to build, understand and
                                contribute to technical systems.</p>
                        </div>
                        <div className="expertise-pill">
                            <h3>Public Speaker</h3>
                            <p className="pill-desc">Engaging audiences, delivering ideas clearly and representing teams in
                                high-impact environments.</p>
                        </div>
                        <div className="expertise-pill">
                            <h3>Strategic Thinker</h3>
                            <p className="pill-desc">Structuring ideas, aligning goals and ensuring execution follows a
                                clear direction.</p>
                        </div>
                        <div className="expertise-pill">
                            <h3>Community Builder</h3>
                            <p className="pill-desc">Creating and scaling communities that encourage participation,
                                collaboration and growth.</p>
                        </div>
                        <div className="expertise-pill">
                            <h3>Team Coordinator</h3>
                            <p className="pill-desc">Managing people, responsibilities and workflows to ensure smooth and
                                efficient execution.</p>
                        </div>
                    </div>
                </section>


                
                <section className="experience" id="experience">
                    <h2 className="section-title">What I’ve Led</h2>
                    <div className="experience-layout">

                        <div className="experience-left">

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Project Management Intern</h3>
                                        <p className="exp-org">µLearn Foundation</p>
                                    </div>
                                    <span className="exp-date">Feb 2026 – Present</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Driving end-to-end project execution including planning, task allocation,
                                            and progress tracking</li>
                                        <li>Collaborating with cross-functional teams across campuses, volunteers, and
                                            partners</li>
                                        <li>Aligning stakeholders, ensuring clarity in deliverables and timelines across
                                            initiatives</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Campus Lead</h3>
                                        <p className="exp-org">µLearn SBC</p>
                                    </div>
                                    <span className="exp-date">March 2026 – Present</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Leading campus-wide strategy and execution for one of the most active
                                            student learning communities</li>
                                        <li>Designing systems to improve onboarding, engagement, and retention</li>
                                        <li>Managing teams and ensuring alignment with broader ecosystem goals</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Chairman</h3>
                                        <p className="exp-org">Industry Applications Society, IEEE SB SBCE</p>
                                    </div>
                                    <span className="exp-date">March 2026 – Present</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Driving industry-focused initiatives connecting students with real-world
                                            applications</li>
                                        <li>Organizing high-impact sessions, collaborations, and technical engagements
                                        </li>
                                        <li>Strengthening the applied learning culture within IEEE</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">District Lead - Alappuzha</h3>
                                        <p className="exp-org">µLearn Foundation</p>
                                    </div>
                                    <span className="exp-date">Aug 2025 – Present</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Overseeing operations across 5+ campuses, ensuring smooth coordination and
                                            execution</li>
                                        <li>Building and scaling a campus lead network improving inter-campus
                                            collaboration</li>
                                        <li>Enabling leadership growth across institutions through structured support
                                            systems</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Strategic Team Lead</h3>
                                        <p className="exp-org">The Purple Movement</p>
                                    </div>
                                    <span className="exp-date">May 2025 – Dec 2025</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Executed strategies for large-scale, student-driven initiatives</li>
                                        <li>Contributed to frameworks redefining community-powered learning</li>
                                        <li>Worked closely with cross-community leaders to drive unified impact</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Campus Co-Lead</h3>
                                        <p className="exp-org">µLearn SBC</p>
                                    </div>
                                    <span className="exp-date">Jan 2025 – Jan 2026</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Organized 15+ campus-wide events and challenges engaging 100+ students</li>
                                        <li>Led a 15-member core team handling planning, logistics, and communication
                                        </li>
                                        <li>Strengthened execution systems for consistent and scalable operations</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Membership Development Coordinator</h3>
                                        <p className="exp-org">IEEE SBCE</p>
                                    </div>
                                    <span className="exp-date">Feb 2025 – Feb 2026</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Led outreach strategies increasing engagement by 60% within a year</li>
                                        <li>Designed and executed initiatives improving participation and visibility
                                        </li>
                                        <li>Built structured communication channels within the student branch</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="exp-item">
                                <div className="exp-header-row">
                                    <div className="exp-role-org">
                                        <h3 className="exp-role">Digital Marketing Intern</h3>
                                        <p className="exp-org">µLearn Foundation</p>
                                    </div>
                                    <span className="exp-date">Aug 2025 – Jan 2026</span>
                                </div>
                                <div className="exp-details">
                                    <ul className="exp-bullets">
                                        <li>Managed digital operations for a community of 50,000+ learners across Kerala
                                        </li>
                                        <li>Streamlined content workflows, reducing turnaround time</li>
                                        <li>Coordinated with multiple creative teams ensuring consistent branding and
                                            delivery</li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div className="experience-right">
                            <ul className="metrics-list">
                                <li><span className="counter" data-target="10">0</span>+ Projects Led</li>
                                <li><span className="counter" data-target="35">0</span>+ Events Managed</li>
                                <li><span className="counter" data-target="5">0</span>+ Communities Driven</li>
                                <li><span className="counter" data-target="500">0</span>+ Students Engaged</li>
                            </ul>
                        </div>

                    </div>
                </section>



                
                <section className="build-log" id="build-log">
                    <h2 className="section-title">Build Log</h2>
                    <div className="build-columns">
                        <a href="/dark-netra.html" className="build-box" style={{'textDecoration': 'none', 'color': 'inherit', 'display': 'block'}}>
                            <h3>Dark Netra</h3>
                            <p className="edu-degree">A malicious URL detection system</p>
                            <p className="edu-year">Machine Learning & Web Deployment</p>
                        </a>
                    </div>
                </section>
                
                
                <section className="on-the-ground" id="on-the-ground">
                    <h2 className="section-title">On The Ground</h2>
                    <div className="ground-columns">
                        <a href="/mutate-26.html" className="ground-box" style={{'textDecoration': 'none', 'color': 'inherit', 'display': 'block'}}>
                            <h3>Mutate '26</h3>
                            <p className="edu-degree">by µLearn Foundation</p>
                        </a>
                        <a href="/beyond-80.html" className="ground-box" style={{'textDecoration': 'none', 'color': 'inherit', 'display': 'block'}}>
                            <h3>Beyond:80</h3>
                            <p className="edu-degree">by The Purple Movement</p>
                        </a>
                        <a href="/comiccon-kochi.html" className="ground-box" style={{'textDecoration': 'none', 'color': 'inherit', 'display': 'block'}}>
                            <h3>ComicCon Kochi</h3>
                            <p className="edu-degree">by ComicCon India</p>
                        </a>
                        <a href="/kes.html" className="ground-box" style={{'textDecoration': 'none', 'color': 'inherit', 'display': 'block'}}>
                            <h3>Kerala Esports Series</h3>
                            <p className="edu-degree">by All Kerala Esports Federation</p>
                        </a>
                    </div>
                </section>

                
                <section className="education" id="education">
                    <h2 className="section-title">Education</h2>
                    <div className="education-columns">
                        <div className="edu-col">
                            <h3>Sree Buddha College of Engineering</h3>
                            <p className="edu-degree">B.Tech in Computer Science and Engineering</p>
                            <p className="edu-year">2023 – 2027</p>
                        </div>
                        <div className="edu-col right">
                            <h3>Sree Buddha Central School</h3>
                            <p className="edu-degree">Computer Science Stream</p>
                            <p className="edu-year">Graduated 2023</p>
                        </div>
                    </div>
                </section>

                
                <section className="contact" id="contact">
                    <div className="contact-content">
                        <h2 className="closing-line">Let’s build something meaningful.</h2>
                        
                        <div className="social-icons-container">
                            <div className="social-icon" data-platform="instagram" data-user="instagram.com/sulthaaaannnn" data-link="https://www.instagram.com/sulthaaaannnn/">
                                <i className="fab fa-instagram"></i>
                            </div>
                            <div className="social-icon" data-platform="linkedin" data-user="linkedin.com/in/aaditajay" data-link="https://www.linkedin.com/in/aaditajay/">
                                <i className="fab fa-linkedin-in"></i>
                            </div>
                            <div className="social-icon" data-platform="gmail" data-user="aaditajay@gmail.com" data-link="mailto:aaditajay@gmail.com">
                                <i className="far fa-envelope"></i>
                            </div>
                            <div className="social-icon" data-platform="x" data-user="x.com/AaditAjay" data-link="https://x.com/AaditAjay">
                                <i className="fab fa-x-twitter"></i>
                            </div>
                        </div>

                        <div className="contact-bar-wrap">
                            <div className="contact-bar" id="contact-bar">
                                <span className="bar-username" id="bar-username">Select a platform</span>
                                <a href="#" className="bar-connect-btn" id="bar-connect-btn" target="_blank">Connect</a>
                            </div>
                        </div>
                    </div>
                    <footer className="footer">
                        <div className="footer-content">
                            <div className="footer-left">
                                <p>&copy; 2026 Aadit Ajay. All rights reserved. | Branded in <i className="fab fa-figma"></i> Figma</p>
                            </div>
                            <div className="footer-right">
                                <p>Made with 
                                    <span className="ag-logo-wrapper">
                                        <img src="/images/antigravity/light/antigravity-icon__one-color.png" className="ag-img light-logo" alt="Antigravity" />
                                        <img src="/images/antigravity/dark/antigravity-icon__white.png" className="ag-img dark-logo" alt="Antigravity" />
                                    </span>
                                    & <i className="fas fa-mug-hot"></i> Caffeine
                                </p>
                            </div>
                        </div>
                    </footer>
                </section>

            </div>
        </div>
    </div>

    


    </>
  );
}

export default App;
