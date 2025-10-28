import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SolarSystem } from './solarSystem.js';
import { NewsManager } from './newsManager.js';
import { SaveManager } from './saveManager.js';

class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });

    this.clock = new THREE.Clock();
    this.isPaused = false;
    this.timeSpeed = 1;
    this.realTime = new Date();
    
    // Camera animation
    this.cameraAnimation = {
      active: false,
      startPos: new THREE.Vector3(),
      endPos: new THREE.Vector3(),
      startTarget: new THREE.Vector3(),
      endTarget: new THREE.Vector3(),
      progress: 0,
      duration: 2.0
    };
    
    // Performance monitoring
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsUpdateInterval = 1000;
    
    // Quality settings
    this.qualitySettings = {
      bloom: true,
      trails: true,
      atmosphere: true,
      antialiasing: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    };

    this.init();
  }

  init() {
    // Renderer setup with optimization
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false; // Disabled for performance
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    document.body.appendChild(this.renderer.domElement);

    // Camera position
    this.camera.position.set(0, 500, 1000);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 50000;
    
    // Post-processing
    this.setupPostProcessing();

    // Solar System
    this.solarSystem = new SolarSystem(this.scene);
    this.solarSystem.setCamera(this.camera);
    this.solarSystem.onPlanetClick = (planetName, planetMesh) => {
      this.flyToPlanet(planetName, planetMesh);
    };

    // News Manager
    this.newsManager = new NewsManager();
    this.newsManager.startFetching();
    
    // Save Manager
    this.saveManager = new SaveManager();
    this.loadSavedState();

    // UI Setup
    this.setupUI();

    // Event listeners
    window.addEventListener('resize', () => this.onWindowResize());

    // Hide loading screen
    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 1000);

    // Start animation
    this.animate();
  }
  
  setupPostProcessing() {
    // Create composer
    this.composer = new EffectComposer(this.renderer);
    
    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Add bloom pass for glowing effects
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6,  // strength
      0.4,  // radius
      0.85  // threshold
    );
    this.composer.addPass(this.bloomPass);
  }

  setupUI() {
    const playPauseBtn = document.getElementById('play-pause');
    const resetViewBtn = document.getElementById('reset-view');
    const toggleTrailsBtn = document.getElementById('toggle-trails');
    const clearTrailsBtn = document.getElementById('clear-trails');
    const speedControl = document.getElementById('speed-control');
    const speedValue = document.getElementById('speed-value');

    playPauseBtn.addEventListener('click', () => {
      this.isPaused = !this.isPaused;
      playPauseBtn.textContent = this.isPaused ? 'Play Simulation' : 'Pause Simulation';
    });

    resetViewBtn.addEventListener('click', () => {
      this.resetCamera();
    });

    toggleTrailsBtn.addEventListener('click', () => {
      const showing = this.solarSystem.toggleTrails();
      toggleTrailsBtn.textContent = showing ? 'Hide Trails' : 'Show Trails';
    });

    clearTrailsBtn.addEventListener('click', () => {
      this.solarSystem.clearTrails();
    });
    
    const saveStateBtn = document.getElementById('save-state');
    saveStateBtn.addEventListener('click', () => {
      this.saveCurrentState();
    });

    speedControl.addEventListener('input', (e) => {
      this.timeSpeed = parseFloat(e.target.value);
      speedValue.textContent = `${this.timeSpeed}x`;
    });
    
    // Planet selector buttons
    document.querySelectorAll('.planet-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const planetName = btn.dataset.planet;
        const planet = this.solarSystem.planets[planetName];
        if (planet) {
          this.flyToPlanet(planetName, planet.mesh);
          this.solarSystem.showPlanetInfo(planet.mesh.userData);
        }
      });
    });
    
    // Quality preset selector
    const qualityPreset = document.getElementById('quality-preset');
    qualityPreset.addEventListener('change', (e) => {
      this.setQualityPreset(e.target.value);
    });
    
    // Help overlay
    const helpButton = document.getElementById('help-button');
    const helpOverlay = document.getElementById('help-overlay');
    const closeHelp = document.getElementById('close-help');
    
    helpButton.addEventListener('click', () => {
      helpOverlay.classList.toggle('hidden');
    });
    
    closeHelp.addEventListener('click', () => {
      helpOverlay.classList.add('hidden');
    });
    
    helpOverlay.addEventListener('click', (e) => {
      if (e.target === helpOverlay) {
        helpOverlay.classList.add('hidden');
      }
    });
    
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.resetCamera();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.isPaused = !this.isPaused;
        playPauseBtn.textContent = this.isPaused ? 'Play Simulation' : 'Pause Simulation';
      } else if (e.key === 't' || e.key === 'T') {
        const showing = this.solarSystem.toggleTrails();
        toggleTrailsBtn.textContent = showing ? 'Hide Trails' : 'Show Trails';
      } else if (e.key === 'c' || e.key === 'C') {
        this.solarSystem.clearTrails();
      } else if (e.key === 'p' || e.key === 'P') {
        const perfPanel = document.getElementById('performance-panel');
        perfPanel.style.display = perfPanel.style.display === 'none' ? 'block' : 'none';
      } else if (e.key === 'h' || e.key === 'H') {
        const helpOverlay = document.getElementById('help-overlay');
        helpOverlay.classList.toggle('hidden');
      }
    });
  }
  
  resetCamera() {
    this.animateCamera(
      new THREE.Vector3(0, 500, 1000),
      new THREE.Vector3(0, 0, 0)
    );
  }
  
  flyToPlanet(planetName, planetMesh) {
    const planetPos = planetMesh.position.clone();
    const planetRadius = this.solarSystem.planets[planetName].data.radius;
    
    // Calculate camera position based on planet size
    const distance = planetRadius * 4;
    const offset = new THREE.Vector3(distance, distance * 0.5, distance);
    const cameraPos = planetPos.clone().add(offset);
    
    this.animateCamera(cameraPos, planetPos);
  }
  
  animateCamera(targetPos, targetLookAt) {
    this.cameraAnimation.active = true;
    this.cameraAnimation.progress = 0;
    this.cameraAnimation.startPos.copy(this.camera.position);
    this.cameraAnimation.endPos.copy(targetPos);
    this.cameraAnimation.startTarget.copy(this.controls.target);
    this.cameraAnimation.endTarget.copy(targetLookAt);
  }
  
  updateCameraAnimation(delta) {
    if (!this.cameraAnimation.active) return;
    
    this.cameraAnimation.progress += delta / this.cameraAnimation.duration;
    
    if (this.cameraAnimation.progress >= 1) {
      this.cameraAnimation.progress = 1;
      this.cameraAnimation.active = false;
    }
    
    // Smooth easing function
    const t = this.easeInOutCubic(this.cameraAnimation.progress);
    
    this.camera.position.lerpVectors(
      this.cameraAnimation.startPos,
      this.cameraAnimation.endPos,
      t
    );
    
    this.controls.target.lerpVectors(
      this.cameraAnimation.startTarget,
      this.cameraAnimation.endTarget,
      t
    );
    
    this.controls.update();
  }
  
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  saveCurrentState() {
    const state = {
      camera: {
        position: this.camera.position,
        target: this.controls.target
      },
      timeSpeed: this.timeSpeed,
      isPaused: this.isPaused,
      showTrails: this.solarSystem.showTrails,
      quality: document.getElementById('quality-preset').value
    };
    
    if (this.saveManager.saveState(state)) {
      this.showNotification('State saved successfully!');
    }
  }
  
  loadSavedState() {
    const saved = this.saveManager.loadState();
    if (!saved) return;
    
    // Restore settings
    if (saved.settings) {
      this.timeSpeed = saved.settings.timeSpeed || 1;
      this.isPaused = saved.settings.isPaused || false;
      
      if (saved.settings.quality) {
        document.getElementById('quality-preset').value = saved.settings.quality;
        this.setQualityPreset(saved.settings.quality);
      }
    }
  }
  
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  updateTime(delta) {
    if (!this.isPaused) {
      // Real-time simulation: 1 second = 1 hour in space
      const hoursToAdd = delta * this.timeSpeed * 3600;
      this.realTime = new Date(this.realTime.getTime() + hoursToAdd * 1000);

      const timeDisplay = document.getElementById('time-display');
      timeDisplay.textContent = `TIME: ${this.realTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }
  }

  updatePerformanceStats() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;
    
    if (elapsed >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      const fpsDisplay = document.getElementById('fps-counter');
      if (fpsDisplay) {
        fpsDisplay.textContent = `${this.fps} FPS`;
        
        // Color code based on performance
        if (this.fps >= 50) {
          fpsDisplay.style.color = '#4CAF50';
        } else if (this.fps >= 30) {
          fpsDisplay.style.color = '#FFC107';
        } else {
          fpsDisplay.style.color = '#F44336';
        }
      }
    }
  }
  
  setQualityPreset(preset) {
    switch(preset) {
      case 'low':
        this.qualitySettings.bloom = false;
        this.qualitySettings.trails = false;
        this.qualitySettings.atmosphere = false;
        this.qualitySettings.antialiasing = false;
        this.qualitySettings.pixelRatio = 1;
        this.bloomPass.enabled = false;
        this.solarSystem.showTrails = false;
        this.solarSystem.toggleTrails();
        break;
      case 'medium':
        this.qualitySettings.bloom = true;
        this.qualitySettings.trails = true;
        this.qualitySettings.atmosphere = false;
        this.qualitySettings.antialiasing = true;
        this.qualitySettings.pixelRatio = 1;
        this.bloomPass.enabled = true;
        this.bloomPass.strength = 0.4;
        break;
      case 'high':
        this.qualitySettings.bloom = true;
        this.qualitySettings.trails = true;
        this.qualitySettings.atmosphere = true;
        this.qualitySettings.antialiasing = true;
        this.qualitySettings.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.bloomPass.enabled = true;
        this.bloomPass.strength = 0.6;
        break;
      case 'ultra':
        this.qualitySettings.bloom = true;
        this.qualitySettings.trails = true;
        this.qualitySettings.atmosphere = true;
        this.qualitySettings.antialiasing = true;
        this.qualitySettings.pixelRatio = window.devicePixelRatio;
        this.bloomPass.enabled = true;
        this.bloomPass.strength = 0.8;
        break;
    }
    
    this.renderer.setPixelRatio(this.qualitySettings.pixelRatio);
    console.log(`Quality preset set to: ${preset.toUpperCase()}`);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (!this.isPaused) {
      this.solarSystem.update(delta * this.timeSpeed);
      this.updateTime(delta);
    }
    
    this.updateCameraAnimation(delta);
    this.updatePerformanceStats();
    this.controls.update();
    this.composer.render();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Start the application
new App();
