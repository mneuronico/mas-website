document.addEventListener('DOMContentLoaded', () => {
    loadExamples();
    setupTabs();
});

async function loadExamples() {
    const grid = document.getElementById('examples-grid');

    try {
        const response = await fetch('data/examples.json');
        if (!response.ok) {
            throw new Error('Failed to load examples');
        }
        const examples = await response.json();

        examples.forEach(example => {
            const card = document.createElement('div');
            card.className = 'example-card';

            card.innerHTML = `
                <div class="example-content-wrapper">
                    <img src="${example.logo}" alt="${example.name} Logo" class="example-logo">
                    <h3>${example.name}</h3>
                    <p class="example-desc">${example.description}</p>
                </div>
                <img src="${example.example}" alt="${example.name} Example" class="example-image-overlay">
            `;

            const overlayImage = card.querySelector('.example-image-overlay');

            card.addEventListener('mousemove', (event) => {
                if (!overlayImage) return;
                const rect = card.getBoundingClientRect();
                const relativeY = (event.clientY - rect.top) / rect.height;
                const clamped = Math.min(Math.max(relativeY, 0), 1);
                overlayImage.style.objectPosition = `center ${clamped * 100}%`;
            });

            card.addEventListener('mouseleave', () => {
                if (!overlayImage) return;
                overlayImage.style.objectPosition = 'center 50%';
            });

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading examples:', error);
        grid.innerHTML = '<p class="error-msg">Could not load examples. Please check the console.</p>';
    }
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.code-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Show corresponding pane
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}
