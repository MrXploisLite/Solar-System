// WebXR/VR Support Manager for Immersive Solar System Experience
export class WebXRManager {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.xrSession = null;
        this.xrRefSpace = null;
        this.isXRActive = false;
        this.vrButton = null;
        
        // VR-specific settings
        this.vrSettings = {
            scale: 1.0, // Scale factor for VR comfort
            enableTeleport: true,
            enableHandTracking: true,
            comfortMode: true // Smooth vs snap turning
        };
    }

    async init() {
        // Check WebXR support
        if (!navigator.xr) {
            console.warn('WebXR not supported');
            return false;
        }

        // Check if VR is supported
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (!isSupported) {
            console.warn('VR not supported on this device');
            return false;
        }

        this.createVRButton();
        return true;
    }

    createVRButton() {
        const button = document.createElement('button');
        button.textContent = 'Enter VR';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('click', () => this.toggleVR());
        
        document.body.appendChild(button);
        this.vrButton = button;
    }

    async toggleVR() {
        if (this.isXRActive) {
            await this.exitVR();
        } else {
            await this.enterVR();
        }
    }

    async enterVR() {
        try {
            const sessionInit = {
                optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
                requiredFeatures: ['local-floor']
            };

            this.xrSession = await navigator.xr.requestSession('immersive-vr', sessionInit);
            
            // Set up XR rendering
            this.renderer.xr.enabled = true;
            await this.renderer.xr.setSession(this.xrSession);
            
            // Set up reference space
            this.xrRefSpace = await this.xrSession.requestReferenceSpace('local-floor');
            
            // Set up XR frame loop
            this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
            
            // Handle session end
            this.xrSession.addEventListener('end', () => this.onSessionEnd());
            
            this.isXRActive = true;
            this.vrButton.textContent = 'Exit VR';
            this.vrButton.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
            
            // Adjust scene scale for VR comfort
            this.scene.scale.setScalar(this.vrSettings.scale);
            
            console.log('VR session started');
            
        } catch (error) {
            console.error('Failed to enter VR:', error);
            alert('Could not start VR session. Please ensure you have a VR headset connected.');
        }
    }

    async exitVR() {
        if (this.xrSession) {
            await this.xrSession.end();
        }
    }

    onSessionEnd() {
        this.isXRActive = false;
        this.xrSession = null;
        this.xrRefSpace = null;
        this.renderer.xr.enabled = false;
        this.vrButton.textContent = 'Enter VR';
        this.vrButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.scene.scale.setScalar(1.0);
        console.log('VR session ended');
    }

    onXRFrame(time, frame) {
        if (!this.xrSession) return;
        
        // Get XR pose
        const pose = frame.getViewerPose(this.xrRefSpace);
        if (pose) {
            // Update camera for each eye
            for (const view of pose.views) {
                const viewport = this.renderer.xr.getViewport(view);
                // Render scene for this view
            }
        }
        
        // Handle controller input
        this.handleXRInput(frame);
        
        // Continue XR loop
        this.xrSession.requestAnimationFrame(this.onXRFrame.bind(this));
    }

    handleXRInput(frame) {
        // Get controller states
        const session = frame.session;
        const inputSources = session.inputSources;
        
        inputSources.forEach(inputSource => {
            if (inputSource.gamepad) {
                // Handle gamepad input for navigation
                this.handleGamepadInput(inputSource.gamepad);
            }
            
            if (inputSource.hand) {
                // Handle hand tracking input
                this.handleHandTracking(inputSource);
            }
        });
    }

    handleGamepadInput(gamepad) {
        // Implement VR navigation controls
        const axes = gamepad.axes;
        const buttons = gamepad.buttons;
        
        // Left stick for movement
        if (axes[0] || axes[1]) {
            // Implement teleport or smooth movement
        }
        
        // Buttons for actions
        if (buttons[0]?.pressed) {
            // Trigger action - select planet
        }
        
        if (buttons[1]?.pressed) {
            // Grip action - grab and move solar system
        }
    }

    handleHandTracking(inputSource) {
        // Implement hand tracking gestures
        // Pinch to select, grab to move, etc.
    }

    // VR-specific scene adjustments
    adjustSceneForVR() {
        // Increase text readability in VR
        const vrElements = document.querySelectorAll('#info-panel, #credits');
        vrElements.forEach(el => {
            el.style.fontSize = '1.5em';
            el.style.padding = '20px';
        });
        
        // Enhance contrast for VR
        document.getElementById('info-panel').style.background = 'rgba(10, 15, 25, 0.98)';
    }

    // Comfort settings
    setComfortMode(enabled) {
        this.vrSettings.comfortMode = enabled;
        if (enabled) {
            // Enable snap turning, reduce motion
            this.vrSettings.scale = 0.8; // Slightly smaller scale for comfort
        } else {
            this.vrSettings.scale = 1.0;
        }
    }
}