import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SolarSystem } from './solarSystem.js';

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
    // Get UI elements with error handling
    const playPauseBtn = document.getElementById('play-pause');
    const resetViewBtn = document.getElementById('reset-view');
    const toggleTrailsBtn = document.getElementById('toggle-trails');
    const clearTrailsBtn = document.getElementById('clear-trails');
    const speedControl = document.getElementById('speed-control');
    const speedValue = document.getElementById('speed-value');
    
    // Panel collapse/expand
    const togglePanelBtn = document.getElementById('toggle-panel');
    const infoPanel = document.getElementById('info-panel');
    
    if (togglePanelBtn && infoPanel) {
      togglePanelBtn.addEventListener('click', () => {
        infoPanel.classList.toggle('collapsed');
        togglePanelBtn.textContent = infoPanel.classList.contains('collapsed') ? '+' : '−';
      });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        playPauseBtn.textContent = this.isPaused ? 'Play Simulation' : 'Pause Simulation';
      });
    }

    if (resetViewBtn) {
      resetViewBtn.addEventListener('click', () => {
        this.resetCamera();
      });
    }

    if (toggleTrailsBtn) {
      toggleTrailsBtn.addEventListener('click', () => {
        const showing = this.solarSystem.toggleTrails();
        toggleTrailsBtn.textContent = showing ? 'Hide Trails' : 'Show Trails';
      });
    }

    if (clearTrailsBtn) {
      clearTrailsBtn.addEventListener('click', () => {
        this.solarSystem.clearTrails();
      });
    }

    if (speedControl && speedValue) {
      speedControl.addEventListener('input', (e) => {
        this.timeSpeed = parseFloat(e.target.value);
        speedValue.textContent = `${this.timeSpeed}x`;
      });
    }
    
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
    
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.resetCamera();
      } else if (e.key === ' ') {
        e.preventDefault();
        this.isPaused = !this.isPaused;
        if (playPauseBtn) {
          playPauseBtn.textContent = this.isPaused ? 'Play Simulation' : 'Pause Simulation';
        }
      } else if (e.key === 't' || e.key === 'T') {
        const showing = this.solarSystem.toggleTrails();
        if (toggleTrailsBtn) {
          toggleTrailsBtn.textContent = showing ? 'Hide Trails' : 'Show Trails';
        }
      } else if (e.key === 'c' || e.key === 'C') {
        this.solarSystem.clearTrails();
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

  updateTime(delta) {
    if (!this.isPaused) {
      // Real-time simulation: 1 second = 1 hour in space
      const hoursToAdd = delta * this.timeSpeed * 3600;
      this.realTime = new Date(this.realTime.getTime() + hoursToAdd * 1000);

      const timeDisplay = document.getElementById('time-display');
      if (timeDisplay) {
        timeDisplay.textContent = `TIME: ${this.realTime.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`;
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (!this.isPaused) {
      this.solarSystem.update(delta * this.timeSpeed);
      this.updateTime(delta);
    }
    this.updateCameraAnimation(delta);
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
