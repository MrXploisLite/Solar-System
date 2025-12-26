// Keyboard Shortcuts Reference Panel
export class KeyboardShortcuts {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.createPanel();
    }

    createPanel() {
        // Main shortcuts panel
        this.panel = document.createElement('div');
        this.panel.id = 'keyboard-shortcuts-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-width: 90%;
            background: rgba(15, 20, 35, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            color: white;
            font-family: 'Inter', sans-serif;
            z-index: 2800;
            display: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                <h2 style="margin: 0; color: #4A90E2;">⌨️ Keyboard Shortcuts</h2>
                <button id="close-shortcuts-btn" style="background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 6px; color: white; padding: 6px 12px; cursor: pointer;">Close</button>
            </div>

            <div style="display: grid; gap: 15px;">
                <!-- Basic Controls -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Basic Controls</h3>
                    <div style="display: grid; gap: 6px; font-size: 12px;">
                        ${this.createShortcutRow('Space', 'Pause/Resume simulation')}
                        ${this.createShortcutRow('R', 'Reset camera to default view')}
                        ${this.createShortcutRow('T', 'Toggle planet trails')}
                        ${this.createShortcutRow('C', 'Clear all trails')}
                        ${this.createShortcutRow('H', 'Show/hide this help panel')}
                    </div>
                </div>

                <!-- View & Visualization -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #F38181;">View & Visualization</h3>
                    <div style="display: grid; gap: 6px; font-size: 12px;">
                        ${this.createShortcutRow('V', 'Toggle data visualization/analytics')}
                        ${this.createShortcutRow('P', 'Show/hide performance panel')}
                        ${this.createShortcutRow('S', 'Create shooting star effect')}
                        ${this.createShortcutRow('E', 'Toggle exoplanet system')}
                        ${this.createShortcutRow('L', 'Toggle LOD system')}
                    </div>
                </div>

                <!-- Educational Features -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #FFE66D;">Educational Features</h3>
                    <div style="display: grid; gap: 6px; font-size: 12px;">
                        ${this.createShortcutRow('M', 'Open Mission Builder')}
                        ${this.createShortcutRow('G', 'Start Grand Tour')}
                        ${this.createShortcutRow('A', 'Toggle Advanced Analytics')}
                        ${this.createShortcutRow('K', 'Show keyboard shortcuts')}
                    </div>
                </div>

                <!-- VR & Advanced -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #95E1D3;">VR & Advanced</h3>
                    <div style="display: grid; gap: 6px; font-size: 12px;">
                        ${this.createShortcutRow('X', 'Enter/Exit VR Mode')}
                        ${this.createShortcutRow('O', 'Toggle quality settings')}
                        ${this.createShortcutRow('I', 'Toggle info panel')}
                        ${this.createShortcutRow('D', 'Toggle debug mode')}
                    </div>
                </div>

                <!-- Mouse Controls Info -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #7B68EE;">Mouse Controls</h3>
                    <div style="display: grid; gap: 6px; font-size: 12px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Left Click + Drag</span>
                            <span style="opacity: 0.7;">Rotate View</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Right Click + Drag</span>
                            <span style="opacity: 0.7;">Pan View</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Mouse Wheel</span>
                            <span style="opacity: 0.7;">Zoom In/Out</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Click on Planet</span>
                            <span style="opacity: 0.7;">Select & Focus</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Tips -->
                <div style="background: rgba(74, 144, 226, 0.1); border: 1px solid rgba(74, 144, 226, 0.3); border-radius: 8px; padding: 12px; margin-top: 10px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #4A90E2;">💡 Quick Tips</h4>
                    <ul style="margin: 0; padding-left: 15px; font-size: 11px; line-height: 1.5; opacity: 0.8;">
                        <li>Press 'V' to see real-time performance analytics</li>
                        <li>Use 'M' to create custom educational missions</li>
                        <li>Try 'S' for beautiful shooting star effects</li>
                        <li>Enable 'E' to explore exoplanets beyond our solar system</li>
                        <li>Use 'X' for immersive VR experience (if supported)</li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);

        // Bind close event
        document.getElementById('close-shortcuts-btn').addEventListener('click', () => this.hide());
    }

    createShortcutRow(key, description) {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-family: monospace; font-weight: 600; font-size: 11px;">${key}</span>
                <span style="opacity: 0.8;">${description}</span>
            </div>
        `;
    }

    createToggle() {
        // Create floating help button
        const button = document.createElement('button');
        button.id = 'keyboard-shortcuts-toggle';
        button.innerHTML = '⌨️';
        button.style.cssText = `
            position: fixed;
            bottom: 16px;
            left: 16px;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) rotate(5deg)';
            button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('click', () => this.toggle());
        document.body.appendChild(button);
    }

    show() {
        if (!this.panel) this.createPanel();
        if (!document.getElementById('keyboard-shortcuts-toggle')) this.createToggle();
        
        this.panel.style.display = 'block';
        this.isVisible = true;
    }

    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }

    toggle() {
        if (!this.isVisible) {
            this.show();
        } else {
            this.hide();
        }
    }

    // Method to show a specific section (useful for context-sensitive help)
    showSection(sectionName) {
        this.show();
        // Could scroll to specific section or highlight it
        console.log(`Showing help for: ${sectionName}`);
    }
}