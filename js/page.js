
function initPageFeatures() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const themeToggleButton = document.getElementById('theme-toggle');
    const logVisitButton = document.getElementById('log-visit-btn');
    const visitorFormSection = document.getElementById('visitor-form-section');

    let darkThemeLink;

    if (!navToggle || !navMenu || !themeToggleButton || !logVisitButton || !visitorFormSection) {
        console.error('One or more DOM elements are missing.');
        return;
    }

    function toggleMenu() {
        navMenu.classList.toggle('active'); 
        console.log('Navigation menu toggled. Active state:', navMenu.classList.contains('active'));
    }

    function toggleTheme() {
        if (darkThemeLink) {
            darkThemeLink.remove();
            darkThemeLink = null;
            themeToggleButton.textContent = 'Dark Mode';
            console.log('Switched to Light Mode');
        } else {
            darkThemeLink = document.createElement('link');
            darkThemeLink.rel = 'stylesheet';
            darkThemeLink.href = 'css/dark-theme.css';
            document.head.appendChild(darkThemeLink);
            themeToggleButton.textContent = 'Light Mode';
            console.log('Switched to Dark Mode');
        }
    }

    function toggleVisitorForm() {
        if (visitorFormSection.style.display === 'none' || visitorFormSection.style.display === '') {
            visitorFormSection.style.display = 'block';
            console.log('Visitor form displayed.');
        } else {
            visitorFormSection.style.display = 'none';
            console.log('Visitor form hidden.');
        }
    }

    navToggle.addEventListener('click', toggleMenu);
    navToggle.addEventListener('touchstart', function(event) {
        event.preventDefault();
        toggleMenu();
    });

    themeToggleButton.addEventListener('click', toggleTheme);

    logVisitButton.addEventListener('click', toggleVisitorForm);

    console.log('Page features initialized successfully.');
}
