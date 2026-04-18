import re

with open('style.css', 'r') as f:
    content = f.read()

# Root vars
content = re.sub(r'--bg-color: #050505;', '--bg-color: #f5f5f7;', content)
content = re.sub(r'--text-color: #f0f0f0;', '--text-color: #1d1d1f;', content)
content = re.sub(r'--accent-color: #333333;', '--accent-color: #d2d2d7;', content)
content = re.sub(r'--card-bg: #111111;', '--card-bg: #ffffff;', content)
content = re.sub(r'--card-hover: #1a1a1a;', '--card-hover: #fcfcfc;', content)
content = re.sub(r'--border-color: rgba\(255, 255, 255, 0.08\);', '--border-color: rgba(0, 0, 0, 0.08);', content)

# Logo
content = content.replace('color: #fff;\n    mix-blend-mode: difference;', 'color: #111;')

# Hero
content = content.replace('background: linear-gradient(180deg, #FFFFFF 0%, #777777 100%);', 'background: linear-gradient(180deg, #111111 0%, #666666 100%);')
content = content.replace('color: #a0a0a0;', 'color: #555;')

# Marquee
content = content.replace('background: rgba(5, 5, 5, 0.5);', 'background: rgba(255, 255, 255, 0.5);')
content = content.replace('color: #888;', 'color: #444;')
content = content.replace('color: #333;', 'color: #aaa;')

# About
content = content.replace('color: #e0e0e0;', 'color: #333;')

# Expertise
content = content.replace('color: #fff;', 'color: #111;')
content = content.replace('color: #999;', 'color: #555;')

# Edu
content = content.replace('color: #aaa;', 'color: #555;')

# Contact
content = content.replace('background: linear-gradient(90deg, #fff, #555);', 'background: linear-gradient(90deg, #111, #555);')
content = content.replace('.contact-link {\n    color: #aaa;', '.contact-link {\n    color: #555;')
content = content.replace('.contact-link:hover {\n    color: #fff;', '.contact-link:hover {\n    color: #111;')
content = content.replace('background-color: #fff;', 'background-color: #111;')

# Premium elements
content = content.replace('color: #fff;\n    padding: 0.8rem 1.5rem;', 'color: #111;\n    padding: 0.8rem 1.5rem;')
content = content.replace('background: #fff;\n    color: #000;', 'background: #111;\n    color: #fff;')
content = content.replace('background: #e0e0e0;', 'background: #333;')

# Experience CSS replace
exp_css = """
.experience-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto;
}

.experience-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 24px;
    padding: 3rem;
    transition: var(--transition-smooth);
}

.experience-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.exp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.exp-header h3 {
    font-size: 1.5rem;
    color: #111;
}

.exp-date {
    font-size: 0.9rem;
    color: #666;
    background: var(--bg-color);
    padding: 0.4rem 1rem;
    border-radius: 20px;
    border: 1px solid var(--border-color);
}

.exp-company {
    color: #888;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    font-weight: 500;
}

.exp-bullets {
    list-style-type: none;
    padding-left: 0;
}

.exp-bullets li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
    color: #444;
    line-height: 1.5;
}

.exp-bullets li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #888;
}

/* --- Education Section --- */
"""
content = re.sub(r'\.experience-layout \{.*?/\* --- Education Section ---\ \*/', exp_css, content, flags=re.DOTALL)

with open('style.css', 'w') as f:
    f.write(content)
