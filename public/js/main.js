import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { DataVisualization } from './dataVisualization.js';
import { GuidedTours } from './guidedTours.js';
import { ParticleSystems } from './particleSystems.js';
import { SolarSystem } from './solarSystem.js';
import { ThemeManager } from './themeManager.js';
import { WebXRManager } from './webXRManager.js';

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

    // Performance tracking
    this.frameCount = 0;
    this.lastFPSTime = 0;
    this.currentFPS = 60;

    // Web Worker for physics
    this.physicsWorker = null;
    this.usePhysicsWorker = false;

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

    // Initialize new managers
    this.initNewManagers();

    // Initialize Web Worker (optional)
    this.initPhysicsWorker();

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

  initNewManagers() {
    // WebXR Manager
    this.webXRManager = new WebXRManager(this.scene, this.camera, this.renderer);
    this.webXRManager.init().then(supported => {
      if (supported) {
        console.log('✅ WebXR/VR supported');
      } else {
        console.log('❌ WebXR/VR not supported');
      }
    });

    // Particle Systems
    this.particleSystems = new ParticleSystems(this.scene);
    this.particleSystems.createNebula();
    this.particleSystems.createComets();
    this.particleSystems.createEnhancedAsteroidField();

    // Guided Tours
    this.guidedTours = new GuidedTours(this.solarSystem, this.camera, this.controls);

    // Data Visualization
    this.dataVisualization = new DataVisualization();

    // Theme Manager
    this.themeManager = new ThemeManager();
    this.themeManager.loadPreference();

    // Add Lagrange points and orbital resonance (after planets are created)
    setTimeout(() => {
      this.setupAdvancedPhysics();
    }, 2000);
  }

  setupAdvancedPhysics() {
    // Create Lagrange points for Earth-Moon system
    const earth = this.solarSystem.planets.earth;
    const moon = this.solarSystem.planets.moon;
    
    if (earth && moon) {
      this.particleSystems.createLagrangePoints(earth, moon);
    }

    // Create orbital resonance visualization for Jupiter-Saturn
    const jupiter = this.solarSystem.planets.jupiter;
    const saturn = this.solarSystem.planets.saturn;
    
    if (jupiter && saturn) {
      this.particleSystems.createOrbitalResonance(jupiter, saturn);
    }
  }

  initPhysicsWorker() {
    // Check if Web Workers are supported
    if (window.Worker) {
      try {
        // Create worker from inline code (for compatibility)
        const workerCode = `
          // Physics Worker Code (simplified)
          let planets = [];
          let timeSpeed = 1;
          
          self.onmessage = function(e) {
            const { type, data } = e.data;
            
            if (type === 'init') {
              planets = data.planets || [];
              timeSpeed = data.timeSpeed || 1;
              self.postMessage({ type: 'ready', data: { message: 'Worker ready' } });
            } else if (type === 'update') {
              // Simplified physics update
              const updates = planets.map(planet => {
                if (planet.name === 'sun') return { name: 'sun', position: { x: 0, y: 0, z: 0 } };
                
                const angle = planet.angle + (planet.speed / planet.distance) * data.delta * 0.1 * timeSpeed;
                const x = Math.cos(angle) * planet.distance;
                const z = Math.sin(angle) * planet.distance;
                planet.angle = angle;
                
                return { name: planet.name, position: { x, y: 0, z } };
              });
              
              self.postMessage({ type: 'update', data: { planets: updates, time: data.time } });
            } else if (type === 'setTimeSpeed') {
              timeSpeed = data;
            }
          };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.physicsWorker = new Worker(URL.createObjectURL(blob));
        
        this.physicsWorker.onmessage = (e) => {
          if (e.data.type === 'ready') {
            console.log('✅ Physics Worker initialized');
            this.usePhysicsWorker = true;
          } else if (e.data.type === 'update') {
            // Apply worker updates
            e.data.data.planets.forEach(update => {
              const planet = this.solarSystem.planets[update.name];
              if (planet && update.position) {
                planet.mesh.position.set(update.position.x, update.position.y, update.position.z);
              }
            });
          }
        };

        // Initialize worker
        const planetData = Object.entries(this.solarSystem.planets).map(([name, planet]) => ({
          name,
          distance: planet.data.distance || 0,
          speed: planet.data.speed || 0,
          angle: planet.angle || 0
        }));

        this.physicsWorker.postMessage({
          type: 'init',
          data: { planets: planetData, timeSpeed: this.timeSpeed }
        });

      } catch (error) {
        console.warn('Could not initialize physics worker:', error);
        this.usePhysicsWorker = false;
      }
    } else {
      console.log('❌ Web Workers not supported');
      this.usePhysicsWorker = false;
    }
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
        
        // Update physics worker if available
        if (this.physicsWorker && this.usePhysicsWorker) {
          this.physicsWorker.postMessage({ type: 'setTimeSpeed', data: this.timeSpeed });
        }
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
    
    // Add new UI controls for advanced features
    this.setupAdvancedUI();

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
      } else if (e.key === 'v' || e.key === 'V') {
        // Toggle data visualization
        if (this.dataVisualization) {
          this.dataVisualization.toggle();
        }
      } else if (e.key === 's' || e.key === 'S') {
        // Shooting star effect
        if (this.particleSystems) {
          this.particleSystems.createShootingStar();
        }
      }
    });
  }

  setupAdvancedUI() {
    // Add shooting star button
    const shootingStarBtn = document.createElement('button');
    shootingStarBtn.id = 'shooting-star-btn';
    shootingStarBtn.textContent = '☄️ Shooting Star';
    shootingStarBtn.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 16px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 11px;
      z-index: 100;
      transition: all 0.2s ease;
    `;

    shootingStarBtn.addEventListener('mouseenter', () => {
      shootingStarBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });

    shootingStarBtn.addEventListener('mouseleave', () => {
      shootingStarBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    shootingStarBtn.addEventListener('click', () => {
      if (this.particleSystems) {
        this.particleSystems.createShootingStar();
      }
    });

    document.body.appendChild(shootingStarBtn);

    // Add info about new features to the info panel
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
      const newFeatures = document.createElement('div');
      newFeatures.style.cssText = `
        margin-top: 12px;
        padding: 8px;
        background: rgba(74, 144, 226, 0.1);
        border-radius: 6px;
        font-size: 10px;
        border: 1px solid rgba(74, 144, 226, 0.3);
      `;
      newFeatures.innerHTML = `
        <strong style="color: #4A90E2;">✨ New in v2.0:</strong><br>
        • Press V for Analytics<br>
        • Press S for Shooting Stars<br>
        • Use Tours & Missions button<br>
        • Try VR if available<br>
        • Customize Themes
      `;
      infoPanel.appendChild(newFeatures);
    }
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
    const time = this.clock.getElapsedTime();

    // Performance tracking
    this.frameCount++;
    if (time - this.lastFPSTime >= 1.0) {
      this.currentFPS = Math.round(this.frameCount / (time - this.lastFPSTime));
      this.frameCount = 0;
      this.lastFPSTime = time;

      // Update data visualization
      if (this.dataVisualization && this.dataVisualization.isVisible) {
        this.dataVisualization.recordFPS(this.currentFPS);
        this.dataVisualization.recordObjectCount(this.getObjectCount());
        this.dataVisualization.recordMemory(this.getMemoryUsage());
      }
    }

    if (!this.isPaused) {
      // Update solar system
      this.solarSystem.update(delta * this.timeSpeed);
      
      // Update particle systems
      if (this.particleSystems) {
        this.particleSystems.update(delta, time);
      }

      // Update physics worker if available
      if (this.physicsWorker && this.usePhysicsWorker) {
        this.physicsWorker.postMessage({
          type: 'update',
          data: { delta: delta * this.timeSpeed, time: time }
        });
      }

      this.updateTime(delta);
    }

    // Update camera animation
    this.updateCameraAnimation(delta);
    
    // Update controls
    this.controls.update();
    
    // Render
    this.composer.render();
  }

  getObjectCount() {
    let count = 0;
    if (this.solarSystem) {
      count += Object.keys(this.solarSystem.planets).length;
      if (this.solarSystem.asteroidBelt) count += 2000; // Approximate
      if (this.solarSystem.kuiperBelt) count += 5000; // Approximate
    }
    if (this.particleSystems) {
      if (this.particleSystems.nebulaParticles) count += 5000;
      if (this.particleSystems.systems.comets) count += 100;
    }
    return count;
  }

  getMemoryUsage() {
    // Estimate memory usage (simplified)
    if (performance.memory) {
      return Math.round(performance.memory.usedJSHeapSize / 1048576);
    }
    return 0;
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
