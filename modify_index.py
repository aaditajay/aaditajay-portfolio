import re

with open('index.html', 'r') as f:
    html = f.read()

# 1. Remove font link
html = html.replace('<link href="https://fonts.cdnfonts.com/css/enigma" rel="stylesheet">\n', '')

# 2. Add content-overlay wrapper and About Me heading
html = html.replace('<!-- Scroll Interaction Image Section -->', '<div class="content-overlay" style="position: relative; z-index: 10;">\n            <!-- Scroll Interaction Image Section -->')
# We need to close it before scripts
html = html.replace('        </div>\n    </div>\n\n    <script src="main.js"></script>', '        </div>\n    </div>\n    </div>\n\n    <script src="main.js"></script>')

# Add About Me heading
html = html.replace('<section class="about overlay" id="about">\n                <div class="about-container">', '<section class="about overlay" id="about">\n                <div class="about-container">\n                    <h2 class="section-title" style="text-align: center; margin-bottom: 2rem;">About Me</h2>')

# 3. Replace experience section
new_experience = """
            <!-- Experience Section -->
            <section class="experience" id="experience">
                <h2 class="section-title">What I’ve Led</h2>
                <div class="experience-layout">
                    
                    <div class="experience-left">
                        <div class="exp-item">
                            <h3 class="exp-title">Project Management Intern — µLearn Foundation</h3>
                            <div class="exp-details">
                                <span class="exp-date">Feb 2026 – Present</span>
                                <ul class="exp-bullets">
                                    <li>Driving end-to-end project execution including planning, task allocation, and progress tracking</li>
                                    <li>Collaborating with cross-functional teams across campuses, volunteers, and partners</li>
                                    <li>Aligning stakeholders, ensuring clarity in deliverables and timelines across initiatives</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Campus Lead — µLearn SBC</h3>
                            <div class="exp-details">
                                <span class="exp-date">March 2026 – Present</span>
                                <ul class="exp-bullets">
                                    <li>Leading campus-wide strategy and execution for one of the most active student learning communities</li>
                                    <li>Designing systems to improve onboarding, engagement, and retention</li>
                                    <li>Managing teams and ensuring alignment with broader ecosystem goals</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Chairman — IAS — IEEE SB SBCE</h3>
                            <div class="exp-details">
                                <span class="exp-date">March 2026 – Present</span>
                                <ul class="exp-bullets">
                                    <li>Driving industry-focused initiatives connecting students with real-world applications</li>
                                    <li>Organizing high-impact sessions, collaborations, and technical engagements</li>
                                    <li>Strengthening the applied learning culture within IEEE</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">District Lead - Alappuzha — µLearn Foundation</h3>
                            <div class="exp-details">
                                <span class="exp-date">Aug 2025 – Present</span>
                                <ul class="exp-bullets">
                                    <li>Oversaw operations across 5+ campuses, ensuring smooth coordination and execution</li>
                                    <li>Built and scaled a campus lead network improving inter-campus collaboration</li>
                                    <li>Enabled leadership growth across institutions through structured support systems</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Strategic Team Lead — The Purple Movement</h3>
                            <div class="exp-details">
                                <span class="exp-date">May 2025 – Dec 2025</span>
                                <ul class="exp-bullets">
                                    <li>Executing strategies for large-scale, student-driven initiatives</li>
                                    <li>Contributing to frameworks redefining community-powered learning</li>
                                    <li>Working closely with cross-community leaders to drive unified impact</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Campus Co-Lead — µLearn SBC</h3>
                            <div class="exp-details">
                                <span class="exp-date">Jan 2025 – Jan 2026</span>
                                <ul class="exp-bullets">
                                    <li>Organized 15+ campus-wide events and challenges engaging 100+ students</li>
                                    <li>Led a 15-member core team handling planning, logistics, and communication</li>
                                    <li>Strengthened execution systems for consistent and scalable operations</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Membership Development Coordinator — IEEE SBCE</h3>
                            <div class="exp-details">
                                <span class="exp-date">Feb 2025 – Feb 2026</span>
                                <ul class="exp-bullets">
                                    <li>Led outreach strategies increasing engagement by 60% within a year</li>
                                    <li>Designed and executed initiatives improving participation and visibility</li>
                                    <li>Built structured communication channels within the student branch</li>
                                </ul>
                            </div>
                        </div>

                        <div class="exp-item">
                            <h3 class="exp-title">Digital Marketing Intern — µLearn Foundation</h3>
                            <div class="exp-details">
                                <span class="exp-date">Aug 2025 – Jan 2026</span>
                                <ul class="exp-bullets">
                                    <li>Managed digital operations for a community of 50,000+ learners across Kerala</li>
                                    <li>Streamlined content workflows, reducing turnaround time</li>
                                    <li>Coordinated with multiple creative teams ensuring consistent branding and delivery</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div class="experience-right">
                        <ul class="metrics-list">
                            <li><span class="counter" data-target="10">0</span>+ Projects Led</li>
                            <li><span class="counter" data-target="35">0</span>+ Events Managed</li>
                            <li><span class="counter" data-target="5">0</span>+ Communities Driven</li>
                            <li><span class="counter" data-target="500">0</span>+ Students Engaged</li>
                        </ul>
                    </div>

                </div>
            </section>
"""

# Replace the experience section
html = re.sub(r'<!-- Experience Section -->.*?<!-- Education Section -->', new_experience + '\n            <!-- Education Section -->', html, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(html)
