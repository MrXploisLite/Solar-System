// Keyboard Shortcuts Reference Panel
export class KeyboardShortcuts {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.createPanel();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'keyboard-shortcuts-panel';
        this.panel.className = 'glass-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 90%;
            padding: 30px;
            color: white;
            z-index: 2800;
            display: none;
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-family: 'Space Grotesk';">KEYBOARD COMMANDS</h2>
                <button id="close-shortcuts-btn" class="secondary-btn" style="width: auto; padding: 5px 15px;">CLOSE</button>
            </div>

            <div style="display: grid; gap: 10px; font-size: 14px;">
                ${this.createRow('G', 'Start Grand Tour')}
                ${this.createRow('M', 'Open Mission Builder')}
                ${this.createRow('A', 'Toggle Science Analytics')}
                ${this.createRow('E', 'Toggle Exoplanets')}
                ${this.createRow('S', 'Launch Shooting Star')}
                ${this.createRow('SPACE', 'Pause/Resume Simulation')}
                ${this.createRow('R', 'Reset Camera')}
            </div>
        `;

        document.body.appendChild(this.panel);
        document.getElementById('close-shortcuts-btn').onclick = () => this.hide();
    }

    createRow(key, desc) {
        return `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">
                <span style="color: var(--primary-accent); font-weight: 700;">${key}</span>
                <span style="opacity: 0.8;">${desc}</span>
            </div>
        `;
    }

    show() {
        this.panel.style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        this.panel.style.display = 'none';
        this.isVisible = false;
    }

    toggle() {
        if (this.isVisible) this.hide();
        else this.show();
    }

    handleKeyPress(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key.toLowerCase();
        const app = window.app;

        switch (key) {
            case 'g':
                const tour = app.guidedTours.tours.find(t => t.id === 'solar-system-overview');
                if (tour) app.guidedTours.startTour(tour);
                break;
            case 'm':
                app.missionBuilder.toggle();
                break;
            case 'a':
                app.enhancedAnalytics.toggle();
                break;
            case 'e':
                app.exoplanetSystem.toggleExoplanets();
                break;
            case 's':
                app.particleSystems.createShootingStar();
                break;
            case 'r':
                app.resetCamera();
                break;
            case ' ':
                e.preventDefault();
                app.togglePause();
                break;
            case '?':
            case '/':
                this.toggle();
                break;
        }
    }
}
