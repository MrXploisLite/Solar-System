// Theme Manager for Customizable UI and Visual Modes
export class ThemeManager {
    constructor() {
        this.themes = {
            classic: {
                name: 'Classic',
                description: 'Original dark theme with blue accents',
                colors: {
                    primary: '#0B3D91',
                    secondary: '#4A90E2',
                    background: '#000000',
                    panel: 'rgba(10, 15, 25, 0.95)',
                    text: '#FFFFFF',
                    accent: '#FC3D21',
                    success: '#4ECDC4',
                    warning: '#FFE66D',
                    danger: '#F38181'
                },
                ui: {
                    panelBlur: '20px',
                    buttonRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            nebula: {
                name: 'Nebula',
                description: 'Purple and pink cosmic theme',
                colors: {
                    primary: '#7B68EE',
                    secondary: '#FF6B9D',
                    background: '#0A0014',
                    panel: 'rgba(20, 0, 40, 0.95)',
                    text: '#E0D6FF',
                    accent: '#B967FF',
                    success: '#00F5D4',
                    warning: '#FFEA00',
                    danger: '#FF2E63'
                },
                ui: {
                    panelBlur: '25px',
                    buttonRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            sunrise: {
                name: 'Sunrise',
                description: 'Warm orange and gold theme',
                colors: {
                    primary: '#FF6B35',
                    secondary: '#F7931E',
                    background: '#1A0F00',
                    panel: 'rgba(40, 20, 0, 0.95)',
                    text: '#FFF8E7',
                    accent: '#FDB813',
                    success: '#06D6A0',
                    warning: '#FFD166',
                    danger: '#EF476F'
                },
                ui: {
                    panelBlur: '18px',
                    buttonRadius: '6px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            ocean: {
                name: 'Ocean',
                description: 'Deep blue aquatic theme',
                colors: {
                    primary: '#0077B6',
                    secondary: '#00B4D8',
                    background: '#001219',
                    panel: 'rgba(0, 25, 40, 0.95)',
                    text: '#E0FBFC',
                    accent: '#90E0EF',
                    success: '#06FFA5',
                    warning: '#FFD60A',
                    danger: '#FF006E'
                },
                ui: {
                    panelBlur: '22px',
                    buttonRadius: '10px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            matrix: {
                name: 'Matrix',
                description: 'Green terminal aesthetic',
                colors: {
                    primary: '#00FF41',
                    secondary: '#008F11',
                    background: '#0D0208',
                    panel: 'rgba(0, 20, 0, 0.95)',
                    text: '#00FF41',
                    accent: '#00FF00',
                    success: '#00FF41',
                    warning: '#FFFF00',
                    danger: '#FF0000'
                },
                ui: {
                    panelBlur: '15px',
                    buttonRadius: '0px',
                    fontSize: '13px',
                    fontFamily: 'Courier New, monospace'
                }
            },
            aurora: {
                name: 'Aurora',
                description: 'Northern lights theme',
                colors: {
                    primary: '#00F5D4',
                    secondary: '#00BBF9',
                    background: '#0A0E27',
                    panel: 'rgba(10, 20, 40, 0.95)',
                    text: '#E0F7FA',
                    accent: '#9B5DE5',
                    success: '#00F5D4',
                    warning: '#F15BB5',
                    danger: '#EE5A6F'
                },
                ui: {
                    panelBlur: '24px',
                    buttonRadius: '14px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            monochrome: {
                name: 'Monochrome',
                description: 'High contrast black and white',
                colors: {
                    primary: '#FFFFFF',
                    secondary: '#CCCCCC',
                    background: '#000000',
                    panel: 'rgba(20, 20, 20, 0.95)',
                    text: '#FFFFFF',
                    accent: '#FFFFFF',
                    success: '#FFFFFF',
                    warning: '#FFFFFF',
                    danger: '#FFFFFF'
                },
                ui: {
                    panelBlur: '10px',
                    buttonRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            }
        };

        this.currentTheme = 'classic';
        this.accessibilityMode = false;
        this.highContrastMode = false;
        this.compactMode = false;

        this.createThemeSelector();
        this.createAccessibilityToggle();
    }

    createThemeSelector() {
        const container = document.createElement('div');
        container.id = 'theme-selector-container';
        container.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            z-index: 1000;
            display: flex;
            gap: 8px;
            align-items: center;
        `;

        // Theme button
        const themeBtn = document.createElement('button');
        themeBtn.id = 'theme-btn';
        themeBtn.innerHTML = '🎨 Theme';
        themeBtn.style.cssText = `
            padding: 10px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        `;

        themeBtn.addEventListener('mouseenter', () => {
            themeBtn.style.transform = 'translateY(-2px)';
            themeBtn.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
        });

        themeBtn.addEventListener('mouseleave', () => {
            themeBtn.style.transform = 'translateY(0)';
            themeBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });

        themeBtn.addEventListener('click', () => this.showThemeSelector());

        container.appendChild(themeBtn);
        document.body.appendChild(container);
    }

    createAccessibilityToggle() {
        const container = document.createElement('div');
        container.id = 'accessibility-controls';
        container.style.cssText = `
            position: fixed;
            bottom: 16px;
            left: 16px;
            z-index: 1000;
            display: flex;
            gap: 8px;
        `;

        const buttons = [
            { id: 'accessibility-toggle', label: '♿ A11y', tooltip: 'Accessibility Mode' },
            { id: 'contrast-toggle', label: '◐ Contrast', tooltip: 'High Contrast' },
            { id: 'compact-toggle', label: '▤ Compact', tooltip: 'Compact Mode' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.id = btn.id;
            button.innerHTML = btn.label;
            button.title = btn.tooltip;
            button.style.cssText = `
                padding: 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s ease;
            `;

            button.addEventListener('click', () => {
                if (btn.id === 'accessibility-toggle') this.toggleAccessibility();
                if (btn.id === 'contrast-toggle') this.toggleHighContrast();
                if (btn.id === 'compact-toggle') this.toggleCompact();
            });

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(255, 255, 255, 0.1)';
            });

            container.appendChild(button);
        });

        document.body.appendChild(container);
    }

    showThemeSelector() {
        const overlay = document.createElement('div');
        overlay.id = 'theme-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: rgba(15, 20, 35, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
        `;

        panel.innerHTML = `
            <h2 style="margin: 0 0 20px 0; color: #4A90E2;">🎨 Select Theme</h2>
            <div id="theme-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;"></div>
            <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: center;">
                <button id="theme-close" style="padding: 10px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer; font-weight: 600;">Close</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Populate theme grid
        const themeGrid = document.getElementById('theme-grid');
        Object.entries(this.themes).forEach(([key, theme]) => {
            const themeCard = document.createElement('div');
            themeCard.style.cssText = `
                padding: 16px;
                background: ${theme.colors.panel};
                border: 2px solid ${key === this.currentTheme ? theme.colors.accent : 'rgba(255,255,255,0.1)'};
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            `;

            themeCard.innerHTML = `
                <div style="font-weight: 600; color: ${theme.colors.primary}; margin-bottom: 6px;">${theme.name}</div>
                <div style="font-size: 11px; opacity: 0.7; margin-bottom: 10px;">${theme.description}</div>
                <div style="display: flex; gap: 4px; height: 20px; border-radius: 4px; overflow: hidden;">
                    <div style="flex: 1; background: ${theme.colors.primary};"></div>
                    <div style="flex: 1; background: ${theme.colors.secondary};"></div>
                    <div style="flex: 1; background: ${theme.colors.accent};"></div>
                    <div style="flex: 1; background: ${theme.colors.success};"></div>
                </div>
                ${key === this.currentTheme ? '<div style="position: absolute; top: 8px; right: 8px; color: ' + theme.colors.accent + '; font-size: 16px;">✓</div>' : ''}
            `;

            themeCard.addEventListener('mouseenter', () => {
                if (key !== this.currentTheme) {
                    themeCard.style.borderColor = theme.colors.primary;
                    themeCard.style.transform = 'translateY(-2px)';
                }
            });

            themeCard.addEventListener('mouseleave', () => {
                if (key !== this.currentTheme) {
                    themeCard.style.borderColor = 'rgba(255,255,255,0.1)';
                    themeCard.style.transform = 'translateY(0)';
                }
            });

            themeCard.addEventListener('click', () => {
                this.applyTheme(key);
                document.body.removeChild(overlay);
            });

            themeGrid.appendChild(themeCard);
        });

        // Close button
        document.getElementById('theme-close').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    applyTheme(themeKey) {
        if (!this.themes[themeKey]) return;

        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        // Apply CSS variables
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--panel-color', theme.colors.panel);
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--accent-color', theme.colors.accent);
        root.style.setProperty('--success-color', theme.colors.success);
        root.style.setProperty('--warning-color', theme.colors.warning);
        root.style.setProperty('--danger-color', theme.colors.danger);

        // Update body background
        document.body.style.background = theme.colors.background;

        // Update existing UI elements
        this.updateUIElements(theme);

        // Save preference
        this.savePreference();

        // Show notification
        this.showNotification(`Theme changed to ${theme.name}`);
    }

    updateUIElements(theme) {
        // Update info panel
        const infoPanel = document.getElementById('info-panel');
        if (infoPanel) {
            infoPanel.style.background = theme.colors.panel;
            infoPanel.style.backdropFilter = `blur(${theme.ui.panelBlur})`;
            infoPanel.style.border = `1px solid ${theme.colors.primary}33`;
        }

        // Update buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            const bg = btn.style.background;
            if (bg.includes('rgba(255, 255, 255, 0.05)') || bg.includes('#0B3D91')) {
                btn.style.background = theme.colors.primary;
                btn.style.borderRadius = theme.ui.buttonRadius;
            }
            if (btn.id.includes('planet-btn')) {
                btn.style.borderRadius = theme.ui.buttonRadius;
            }
        });

        // Update planet buttons
        const planetBtns = document.querySelectorAll('.planet-btn');
        planetBtns.forEach(btn => {
            btn.style.borderRadius = theme.ui.buttonRadius;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = theme.colors.primary + '44';
                btn.style.borderColor = theme.colors.primary;
            });
        });

        // Update text elements
        const textElements = document.querySelectorAll('#time-display, #credits');
        textElements.forEach(el => {
            if (el.id === 'time-display') {
                el.style.color = theme.colors.text;
                el.style.background = theme.colors.panel;
                el.style.border = `1px solid ${theme.colors.primary}33`;
            } else if (el.id === 'credits') {
                el.style.color = theme.colors.text + '99';
                el.style.background = theme.colors.panel;
            }
        });

        // Update tour UI if active
        const tourOverlay = document.getElementById('tour-overlay');
        if (tourOverlay) {
            tourOverlay.style.background = 'rgba(0, 0, 0, 0.85)';
            const tourPanel = tourOverlay.querySelector('div');
            if (tourPanel) {
                tourPanel.style.background = theme.colors.panel;
                tourPanel.style.border = `1px solid ${theme.colors.primary}33`;
            }
        }

        // Update data visualization
        const dataVizCanvas = document.getElementById('data-viz-canvas');
        if (dataVizCanvas) {
            dataVizCanvas.style.background = theme.colors.panel;
            dataVizCanvas.style.border = `1px solid ${theme.colors.primary}33`;
        }

        // Update theme selector button
        const themeBtn = document.getElementById('theme-btn');
        if (themeBtn) {
            themeBtn.style.background = `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`;
        }
    }

    toggleAccessibility() {
        this.accessibilityMode = !this.accessibilityMode;
        
        const root = document.documentElement;
        if (this.accessibilityMode) {
            root.style.setProperty('--font-size-multiplier', '1.2');
            root.style.setProperty('--button-size-multiplier', '1.3');
            
            // Increase font sizes
            const elements = document.querySelectorAll('button, p, div, span');
            elements.forEach(el => {
                const currentSize = window.getComputedStyle(el).fontSize;
                if (currentSize) {
                    const size = parseFloat(currentSize);
                    if (size >= 10) {
                        el.style.fontSize = (size * 1.2) + 'px';
                    }
                }
            });

            this.showNotification('Accessibility Mode: ON');
        } else {
            root.style.removeProperty('--font-size-multiplier');
            root.style.removeProperty('--button-size-multiplier');
            location.reload(); // Simple way to reset
        }
    }

    toggleHighContrast() {
        this.highContrastMode = !this.highContrastMode;
        
        if (this.highContrastMode) {
            // Apply high contrast
            const root = document.documentElement;
            root.style.setProperty('--text-color', '#FFFFFF');
            root.style.setProperty('--background-color', '#000000');
            root.style.setProperty('--panel-color', 'rgba(0, 0, 0, 0.95)');
            
            // Update borders for high visibility
            const panels = document.querySelectorAll('#info-panel, #tour-overlay, #data-viz-canvas');
            panels.forEach(panel => {
                if (panel) {
                    panel.style.border = '2px solid #FFFFFF';
                    panel.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
                }
            });

            this.showNotification('High Contrast: ON');
        } else {
            this.applyTheme(this.currentTheme);
            this.showNotification('High Contrast: OFF');
        }
    }

    toggleCompact() {
        this.compactMode = !this.compactMode;
        
        const root = document.documentElement;
        if (this.compactMode) {
            root.style.setProperty('--spacing-multiplier', '0.7');
            
            // Reduce padding and margins
            const panels = document.querySelectorAll('#info-panel, #tour-overlay');
            panels.forEach(panel => {
                if (panel) {
                    panel.style.padding = '8px';
                    panel.style.maxWidth = '280px';
                }
            });

            // Compact buttons
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.style.padding = '6px 10px';
                btn.style.fontSize = '11px';
            });

            this.showNotification('Compact Mode: ON');
        } else {
            root.style.removeProperty('--spacing-multiplier');
            location.reload();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.themes[this.currentTheme].colors.primary};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    savePreference() {
        try {
            localStorage.setItem('solar-system-theme', this.currentTheme);
            localStorage.setItem('solar-system-accessibility', this.accessibilityMode);
            localStorage.setItem('solar-system-contrast', this.highContrastMode);
            localStorage.setItem('solar-system-compact', this.compactMode);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    loadPreference() {
        try {
            const theme = localStorage.getItem('solar-system-theme');
            const accessibility = localStorage.getItem('solar-system-accessibility');
            const contrast = localStorage.getItem('solar-system-contrast');
            const compact = localStorage.getItem('solar-system-compact');

            if (theme && this.themes[theme]) {
                this.applyTheme(theme);
            }

            if (accessibility === 'true') {
                this.accessibilityMode = true;
                this.toggleAccessibility();
            }

            if (contrast === 'true') {
                this.highContrastMode = true;
                this.toggleHighContrast();
            }

            if (compact === 'true') {
                this.compactMode = true;
                this.toggleCompact();
            }
        } catch (e) {
            console.warn('Could not load theme preference:', e);
        }
    }

    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    getThemeList() {
        return Object.keys(this.themes).map(key => ({
            key,
            name: this.themes[key].name,
            description: this.themes[key].description
        }));
    }

    // Add custom theme
    addCustomTheme(key, themeData) {
        if (this.themes[key]) {
            console.warn('Theme already exists:', key);
            return false;
        }

        // Validate theme structure
        if (!themeData.colors || !themeData.ui) {
            console.error('Invalid theme data:', themeData);
            return false;
        }

        this.themes[key] = themeData;
        this.showNotification(`Custom theme "${themeData.name}" added!`);
        return true;
    }

    // Reset to defaults
    reset() {
        this.applyTheme('classic');
        this.accessibilityMode = false;
        this.highContrastMode = false;
        this.compactMode = false;
        
        try {
            localStorage.removeItem('solar-system-theme');
            localStorage.removeItem('solar-system-accessibility');
            localStorage.removeItem('solar-system-contrast');
            localStorage.removeItem('solar-system-compact');
        } catch (e) {
            console.warn('Could not clear preferences:', e);
        }

        this.showNotification('Settings reset to defaults');
    }
}