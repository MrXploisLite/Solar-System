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
            void: {
                name: 'Deep Void',
                description: 'Ultra-dark minimalist theme',
                colors: {
                    primary: '#2C3E50',
                    secondary: '#BDC3C7',
                    background: '#050505',
                    panel: 'rgba(10, 10, 10, 0.98)',
                    text: '#ECF0F1',
                    accent: '#7F8C8D',
                    success: '#27AE60',
                    warning: '#F1C40F',
                    danger: '#C0392B'
                },
                ui: {
                    panelBlur: '5px',
                    buttonRadius: '2px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                }
            },
            cyber: {
                name: 'Cyberpunk',
                description: 'Neon-infused high contrast',
                colors: {
                    primary: '#FF00FF',
                    secondary: '#00FFFF',
                    background: '#03001C',
                    panel: 'rgba(13, 10, 45, 0.9)',
                    text: '#00FFFF',
                    accent: '#FFFF00',
                    success: '#00FF00',
                    warning: '#FFFF00',
                    danger: '#FF0000'
                },
                ui: {
                    panelBlur: '15px',
                    buttonRadius: '0px',
                    fontSize: '14px',
                    fontFamily: 'Space Grotesk, sans-serif'
                }
            }
        };

        this.currentTheme = 'classic';
        this.accessibilityMode = false;
        this.highContrastMode = false;
        this.compactMode = false;

        // In v3.0, we don't create separate buttons here.
        // Logic is triggered from main.js dock.
    }

    showThemeSelector() {
        const existing = document.getElementById('theme-overlay');
        if (existing) return;

        const overlay = document.createElement('div');
        overlay.id = 'theme-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
        `;

        const panel = document.createElement('div');
        panel.className = 'glass-panel';
        panel.style.cssText = `
            padding: 30px;
            max-width: 500px;
            width: 90%;
            color: white;
        `;

        panel.innerHTML = `
            <h2 style="margin-bottom: 20px; font-family: 'Space Grotesk';">THEME SELECTOR</h2>
            <div id="theme-grid" style="display: grid; grid-template-columns: 1fr; gap: 12px;"></div>
            <button id="theme-close" class="secondary-btn" style="margin-top: 20px; width: 100%;">CLOSE</button>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        const themeGrid = document.getElementById('theme-grid');
        Object.entries(this.themes).forEach(([key, theme]) => {
            const btn = document.createElement('button');
            btn.className = 'secondary-btn';
            btn.style.justifyContent = 'space-between';
            btn.innerHTML = `
                <span>${theme.name.toUpperCase()}</span>
                <div style="display: flex; gap: 5px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${theme.colors.primary};"></div>
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${theme.colors.accent};"></div>
                </div>
            `;
            btn.onclick = () => {
                this.applyTheme(key);
                overlay.remove();
            };
            themeGrid.appendChild(btn);
        });

        document.getElementById('theme-close').onclick = () => overlay.remove();
    }

    applyTheme(themeKey) {
        if (!this.themes[themeKey]) return;
        this.currentTheme = themeKey;
        const theme = this.themes[themeKey];

        const root = document.documentElement;
        root.style.setProperty('--primary-accent', theme.colors.primary);
        root.style.setProperty('--secondary-accent', theme.colors.accent);
        root.style.setProperty('--bg-dark', theme.colors.background);
        root.style.setProperty('--glass-bg', theme.colors.panel);

        this.savePreference();
    }

    savePreference() {
        localStorage.setItem('solar-system-theme', this.currentTheme);
    }

    loadPreference() {
        const theme = localStorage.getItem('solar-system-theme');
        if (theme && this.themes[theme]) {
            this.applyTheme(theme);
        }
    }
}
