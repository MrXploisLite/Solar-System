import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { DataVisualization } from './dataVisualization.js';
import { EnhancedAnalytics } from './enhancedAnalytics.js';
import { ExoplanetSystem } from './exoplanetSystem.js';
import { GuidedTours } from './guidedTours.js';
import { KeyboardShortcuts } from './keyboardShortcuts.js';
import { LODSystem } from './lodSystem.js';
import { MissionBuilder } from './missionBuilder.js';
import { MobileAR } from './mobileAR.js';
import { ParticleSystems } from './particleSystems.js';
import { SolarSystem } from './solarSystem.js';
import { ThemeManager } from './themeManager.js';
import { WebXRManager } from './webXRManager.js';
import { AIAssistant } from './aiAssistant.js';

class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000000);
        this.timeSpeed = 1.0;
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

    this.currentFPS = 60;
    window.app = this;
    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 500, 1500);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 1000000;
    
    this.setupPostProcessing();

    this.solarSystem = new SolarSystem(this.scene);
    this.solarSystem.setCamera(this.camera);
    
    this.solarSystem.onPlanetClick = (planetName, planetMesh) => {
      this.selectPlanet(planetName, planetMesh);
    };

    this.initManagers();
    this.setupV3UI();

    window.addEventListener('resize', () => this.onWindowResize());

    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 1500);

    this.animate();
  }

  initManagers() {
    this.webXRManager = new WebXRManager(this.scene, this.camera, this.renderer);
    this.setupEventListeners();
    this.particleSystems = new ParticleSystems(this.scene);
    this.particleSystems.createNebula();
    this.particleSystems.createEnhancedAsteroidField();

    this.guidedTours = new GuidedTours(this.solarSystem, this.camera, this.controls);
    this.dataVisualization = new DataVisualization();
    this.themeManager = new ThemeManager();
    this.lodSystem = new LODSystem(this.scene, this.camera);
    this.exoplanetSystem = new ExoplanetSystem(this.scene, this.solarSystem);
    this.exoplanetSystem.init();

    this.missionBuilder = new MissionBuilder(this.solarSystem, this.guidedTours);
    this.enhancedAnalytics = new EnhancedAnalytics(this.dataVisualization);
    this.keyboardShortcuts = new KeyboardShortcuts();
    this.aiAssistant = new AIAssistant();
    this.mobileAR = new MobileAR(this.scene, this.camera, this.renderer);
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.6, 0.4, 0.85
    );
    this.composer.addPass(this.bloomPass);
  }

  setupV3UI() {
    // Dock Listeners
    document.getElementById('dock-tour').addEventListener('click', () => {
      const tour = this.guidedTours.tours.find(t => t.id === 'solar-system-overview');
      if (tour) this.guidedTours.startTour(tour);
    });

    document.getElementById('dock-mission').addEventListener('click', () => this.missionBuilder.toggle());
    document.getElementById('dock-analytics').addEventListener('click', () => this.enhancedAnalytics.toggle());
    document.getElementById('dock-exoplanets').addEventListener('click', () => this.exoplanetSystem.toggleExoplanets());
    document.getElementById('dock-star').addEventListener('click', () => this.particleSystems.createShootingStar());
    document.getElementById('dock-theme').addEventListener('click', () => this.themeManager.showThemeSelector());
    document.getElementById('dock-settings').addEventListener('click', () => this.keyboardShortcuts.toggle());

    // Panel Toggle
    const toggleBtn = document.getElementById('toggle-panel');
    const infoPanel = document.getElementById('info-panel');
    toggleBtn.addEventListener('click', () => {
      infoPanel.classList.toggle('collapsed');
      toggleBtn.querySelector('i').className = infoPanel.classList.contains('collapsed') ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
    });

    // Fly To Button
    document.getElementById('fly-to-target').addEventListener('click', () => {
      if (this.selectedPlanet) {
        this.flyToPlanet(this.selectedPlanet.name, this.selectedPlanet.mesh);
      }
    });

    // Analytics Button in Panel
    document.getElementById('view-analytics').addEventListener('click', () => {
      this.enhancedAnalytics.toggle();
    });
  }

  selectPlanet(name, mesh) {
    this.selectedPlanet = { name, mesh };
    document.getElementById('target-name').textContent = name.toUpperCase();
    document.getElementById('planet-name-display').textContent = name.toUpperCase();

    const data = mesh.userData;
    document.getElementById('planet-info-content').innerHTML = `
      <p class="description">${this.getPlanetDescription(name)}</p>
    `;

    document.getElementById('stat-gravity').textContent = `${data.gravity || '--'} m/s²`;
    document.getElementById('stat-temp').textContent = `${data.temperature || '--'} K`;
    document.getElementById('stat-radius').textContent = `${data.radius?.toLocaleString() || '--'} km`;
    document.getElementById('stat-moons').textContent = data.moons || '0';
  }

  getPlanetDescription(name) {
    const descriptions = {
      sun: "The central star of our solar system, a nearly perfect sphere of hot plasma.",
      mercury: "The smallest and innermost planet, with a surface scarred by craters.",
      venus: "Often called Earth's twin, but with a runaway greenhouse effect.",
      earth: "Our home, the only known planet to harbor life and liquid water.",
      mars: "The Red Planet, home to the largest volcano in the solar system.",
      jupiter: "The largest planet, a gas giant with a Great Red Spot storm.",
      saturn: "Famous for its spectacular ring system made of ice and rock.",
      uranus: "An ice giant that rotates on its side, nearly 90 degrees.",
      neptune: "The most distant major planet, with the strongest winds."
    };
    return descriptions[name.toLowerCase()] || "A celestial body within our solar system.";
  }

  flyToPlanet(name, mesh) {
    const planetPos = new THREE.Vector3();
    mesh.getWorldPosition(planetPos);
    
    const radius = mesh.userData.radius || 1000;
    const distance = radius * 0.05 + 200; // Adjusted for scale
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
    
    const t = this.easeInOutCubic(this.cameraAnimation.progress);
    this.camera.position.lerpVectors(this.cameraAnimation.startPos, this.cameraAnimation.endPos, t);
    this.controls.target.lerpVectors(this.cameraAnimation.startTarget, this.cameraAnimation.endTarget, t);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  updateHUD(delta) {
    // Mission Time
    const now = new Date();
    const elapsed = now - this.realTime;
    const days = Math.floor(elapsed / 86400000);
    const hours = Math.floor((elapsed % 86400000) / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    document.getElementById('mission-time').textContent =
      `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    // FPS
    if (this.clock.getElapsedTime() % 1 < 0.02) {
      this.currentFPS = Math.round(1 / delta);
      document.getElementById('fps-counter').textContent = this.currentFPS;
    }

    // Velocity (Fake but aesthetic)
    const vel = this.controls.target.distanceTo(this.camera.position) * 0.01;
    document.getElementById('cam-velocity').textContent = `${vel.toFixed(1)} km/s`;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();

    if (!this.isPaused) {
      this.solarSystem.update(delta * this.timeSpeed);
      this.particleSystems.update(delta, this.clock.getElapsedTime());
      this.exoplanetSystem.update(delta * this.timeSpeed);
      this.lodSystem.update(delta, this.clock.getElapsedTime());
      this.updateHUD(delta);
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

new App();
