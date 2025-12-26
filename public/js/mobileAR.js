// Mobile AR Support Detection and Basic AR Mode
export class MobileAR {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.isSupported = false;
        this.isActive = false;
        this.arSession = null;
        
        this.checkSupport();
    }

    async checkSupport() {
        // Check for WebXR support
        if ('xr' in navigator) {
            try {
                const supported = await navigator.xr.isSessionSupported('immersive-ar');
                this.isSupported = supported;
                console.log(`✅ Mobile AR support: ${supported ? 'Available' : 'Not available'}`);
                return supported;
            } catch (error) {
                console.log('❌ AR support check failed:', error);
                this.isSupported = false;
                return false;
            }
        } else {
            console.log('❌ WebXR not available');
            this.isSupported = false;
            return false;
        }
    }

    async startAR() {
        if (!this.isSupported) {
            console.warn('AR not supported on this device');
            this.showARNotSupportedMessage();
            return false;
        }

        try {
            // Request AR session
            this.arSession = await navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['local'],
                optionalFeatures: ['dom-overlay'],
                domOverlay: { root: document.body }
            });

            // Configure renderer for AR
            this.renderer.xr.enabled = true;
            await this.renderer.xr.setSession(this.arSession);

            // Set up AR session events
            this.arSession.addEventListener('end', () => this.onSessionEnd());

            // Update camera for AR
            this.camera.layers.enable(0); // Enable all layers

            this.isActive = true;
            console.log('✅ AR session started');
            
            // Show AR UI
            this.showARUI();
            
            return true;

        } catch (error) {
            console.error('❌ Failed to start AR session:', error);
            this.showARErrorMessage(error);
            return false;
        }
    }

    async endAR() {
        if (this.arSession) {
            try {
                await this.arSession.end();
                this.isActive = false;
                this.arSession = null;
                console.log('✅ AR session ended');
                this.hideARUI();
            } catch (error) {
                console.error('❌ Error ending AR session:', error);
            }
        }
    }

    onSessionEnd() {
        this.isActive = false;
        this.arSession = null;
        this.renderer.xr.enabled = false;
        this.hideARUI();
        console.log('AR session ended');
    }

    // Create AR-specific UI
    showARUI() {
        // Remove existing AR UI if any
        this.hideARUI();

        const arUI = document.createElement('div');
        arUI.id = 'ar-ui';
        arUI.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            z-index: 9999;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        `;

        arUI.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 8px; height: 8px; background: #38ef7d; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
                <span>AR Mode Active</span>
                <button id="exit-ar-btn" style="margin-left: 15px; padding: 4px 12px; background: rgba(255,100,100,0.3); border: 1px solid rgba(255,100,100,0.6); border-radius: 4px; color: white; cursor: pointer; font-size: 12px;">Exit AR</button>
            </div>
        `;

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(arUI);

        // Bind exit button
        document.getElementById('exit-ar-btn').addEventListener('click', () => this.endAR());
    }

    hideARUI() {
        const arUI = document.getElementById('ar-ui');
        if (arUI) {
            arUI.remove();
        }
    }

    showARNotSupportedMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 100, 100, 0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        message.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">AR Not Supported</h3>
            <p style="margin: 0; font-size: 14px;">Your device doesn't support WebXR AR or the feature is not enabled. AR mode requires a compatible device with WebXR support.</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: white; color: #ff6464; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }

    showARErrorMessage(error) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 100, 100, 0.95);
            color: white;
            padding: 20px;
            border-radius: 12px;
            font-family: 'Inter', sans-serif;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        message.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">AR Error</h3>
            <p style="margin: 0; font-size: 14px;">Failed to start AR session: ${error.message}</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: white; color: #ff6464; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 5000);
    }

    // Basic AR mode for devices without full WebXR (using device orientation)
    async startBasicAR() {
        if (!window.DeviceOrientationEvent) {
            console.warn('Device orientation not supported');
            return false;
        }

        console.log('Starting basic AR mode using device orientation');
        
        // Request permission for device orientation (iOS 13+)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission !== 'granted') {
                    console.warn('Device orientation permission denied');
                    return false;
                }
            } catch (error) {
                console.error('Permission request failed:', error);
                return false;
            }
        }

        // Listen to device orientation
        window.addEventListener('deviceorientation', this.handleOrientation.bind(this));
        
        this.isActive = true;
        this.showARUI();
        
        return true;
    }

    handleOrientation(event) {
        if (!this.isActive) return;

        // Convert device orientation to camera rotation
        const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0;
        const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
        const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0;

        // Apply orientation to camera
        this.camera.rotation.set(beta - Math.PI/2, alpha, -gamma, 'YXZ');
    }

    // Check if device is mobile
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Get AR status info
    getStatus() {
        return {
            supported: this.isSupported,
            active: this.isActive,
            mobile: this.isMobileDevice(),
            session: this.arSession !== null
        };
    }

    // Create AR detection badge
    createARBadge() {
        if (!this.isMobileDevice()) return null;

        const badge = document.createElement('div');
        badge.id = 'ar-badge';
        badge.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        `;

        badge.innerHTML = `
            <span>📱 AR Ready</span>
            <span style="opacity: 0.7;">|</span>
            <span style="font-size: 10px;">${this.isSupported ? 'Enable' : 'Not Supported'}</span>
        `;

        if (!this.isSupported) {
            badge.style.opacity = '0.5';
            badge.style.cursor = 'not-allowed';
        } else {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'translateY(-2px)';
                badge.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
            });

            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'translateY(0)';
                badge.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            });

            badge.addEventListener('click', () => {
                if (this.isActive) {
                    this.endAR();
                } else {
                    this.startAR();
                }
            });
        }

        document.body.appendChild(badge);
        return badge;
    }
}