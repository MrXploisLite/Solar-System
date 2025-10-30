import * as THREE from 'three';
import { REAL_PLANET_DATA } from './planetData.js';

// Realistic planetary data (scaled for visualization)
const PLANET_DATA = {
  sun: { radius: 50, color: 0xFDB813, emissive: 0xFDB813, distance: 0 },
  mercury: { radius: 3.8, color: 0x8C7853, distance: 150, speed: 4.74, tilt: 0.034 },
  venus: { radius: 9.5, color: 0xFFC649, distance: 220, speed: 3.50, tilt: 177.4 },
  earth: { radius: 10, color: 0x2233FF, distance: 300, speed: 2.98, tilt: 23.4 },
  mars: { radius: 5.3, color: 0xCD5C5C, distance: 400, speed: 2.41, tilt: 25.2 },
  jupiter: { radius: 35, color: 0xC88B3A, distance: 600, speed: 1.31, tilt: 3.1 },
  saturn: { radius: 29, color: 0xFAD5A5, distance: 850, speed: 0.97, tilt: 26.7 },
  uranus: { radius: 20, color: 0x4FD0E7, distance: 1100, speed: 0.68, tilt: 97.8 },
  neptune: { radius: 19, color: 0x4166F5, distance: 1350, speed: 0.54, tilt: 28.3 }
};

// Dwarf planets data
const DWARF_PLANET_DATA = {
  ceres: { radius: 2.4, color: 0x9B8B7E, distance: 480, speed: 1.78, tilt: 4, type: 'dwarf' },
  pluto: { radius: 2.4, color: 0xC4A582, distance: 1600, speed: 0.47, tilt: 122.5, type: 'dwarf' },
  eris: { radius: 2.3, color: 0xD4D4D4, distance: 2200, speed: 0.35, tilt: 44, type: 'dwarf' },
  makemake: { radius: 1.8, color: 0xB8967D, distance: 1900, speed: 0.41, tilt: 0, type: 'dwarf' },
  haumea: { radius: 2.0, color: 0xE8D4C0, distance: 1850, speed: 0.43, tilt: 0, type: 'dwarf' }
};

// Major moons data
const MOONS_DATA = {
  mars: [
    { name: 'Phobos', radius: 0.3, distance: 15, speed: 8, color: 0x8B7355 },
    { name: 'Deimos', radius: 0.2, distance: 25, speed: 5, color: 0x9B8B7E }
  ],
  jupiter: [
    { name: 'Io', radius: 1.8, distance: 50, speed: 6, color: 0xFFD700 },
    { name: 'Europa', radius: 1.6, distance: 65, speed: 5, color: 0xE8E8E8 },
    { name: 'Ganymede', radius: 2.6, distance: 85, speed: 4, color: 0xB8B8B8 },
    { name: 'Callisto', radius: 2.4, distance: 105, speed: 3, color: 0x8B8B8B }
  ],
  saturn: [
    { name: 'Titan', radius: 2.6, distance: 70, speed: 4, color: 0xFFA500 },
    { name: 'Rhea', radius: 0.8, distance: 50, speed: 5, color: 0xD3D3D3 },
    { name: 'Iapetus', radius: 0.7, distance: 90, speed: 3, color: 0xA9A9A9 }
  ],
  uranus: [
    { name: 'Titania', radius: 0.8, distance: 45, speed: 4, color: 0xC0C0C0 },
    { name: 'Oberon', radius: 0.8, distance: 60, speed: 3.5, color: 0xB0B0B0 }
  ],
  neptune: [
    { name: 'Triton', radius: 1.4, distance: 40, speed: 5, color: 0xE0E0E0 }
  ]
};

export class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.planets = {};
    this.orbits = [];
    this.trails = {};
    this.time = 0;
    this.textures = {};
    this.onPlanetClick = null;
    this.showTrails = true;
    this.maxTrailPoints = 500;

    this.setupTextureLoader();
    this.loadTextures().then(() => {
      this.createStarfield();
      this.createSun();
      this.createPlanets();
      this.createDwarfPlanets();
      this.createAsteroidBelt();
      this.createKuiperBelt();
      this.setupLighting();
      this.setupRaycaster();
      this.initializeTrails();
    });
  }

  setupTextureLoader() {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingManager.onStart = (url, loaded, total) => {
      console.log(`Loading textures: ${loaded}/${total}`);
    };
    this.loadingManager.onProgress = (url, loaded, total) => {
      const progress = (loaded / total) * 100;
      console.log(`Loading progress: ${progress.toFixed(0)}%`);
    };
    this.loadingManager.onLoad = () => {
      console.log('All textures loaded!');
    };
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
  }

  async loadTextures() {
    const texturePromises = [
      this.loadTexture('sun', '/textures/2k_sun.jpg'),
      this.loadTexture('mercury', '/textures/2k_mercury.jpg'),
      this.loadTexture('venus', '/textures/2k_venus_surface.jpg'),
      this.loadTexture('venusAtmosphere', '/textures/2k_venus_atmosphere.jpg'),
      this.loadTexture('earth', '/textures/2k_earth_daymap.jpg'),
      this.loadTexture('earthNight', '/textures/2k_earth_nightmap.jpg'),
      this.loadTexture('earthClouds', '/textures/2k_earth_clouds.jpg'),
      this.loadTexture('mars', '/textures/2k_mars.jpg'),
      this.loadTexture('jupiter', '/textures/2k_jupiter.jpg'),
      this.loadTexture('saturn', '/textures/2k_saturn.jpg'),
      this.loadTexture('saturnRing', '/textures/2k_saturn_ring_alpha.png'),
      this.loadTexture('uranus', '/textures/2k_uranus.jpg'),
      this.loadTexture('neptune', '/textures/2k_neptune.jpg'),
      this.loadTexture('moon', '/textures/2k_moon.jpg'),
      this.loadTexture('stars', '/textures/2k_stars_milky_way.jpg')
    ];

    await Promise.all(texturePromises);
  }

  loadTexture(name, path) {
    return new Promise((resolve) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.textures[name] = texture;
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Error loading texture ${name}:`, error);
          resolve(null);
        }
      );
    });
  }

  createStarfield() {
    // Create skybox with milky way texture
    const skyGeometry = new THREE.SphereGeometry(15000, 64, 64);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: this.textures.stars,
      side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);
  }

  createSun() {
    const sunGeometry = new THREE.SphereGeometry(PLANET_DATA.sun.radius, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: this.textures.sun,
      color: 0xFFFFFF
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { name: 'sun', ...PLANET_DATA.sun };
    this.scene.add(sun);
    this.planets.sun = { mesh: sun, data: PLANET_DATA.sun };

    // Enhanced sun corona with shader
    const coronaGeometry = new THREE.SphereGeometry(PLANET_DATA.sun.radius * 1.2, 64, 64);
    const coronaMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float intensity = pow(0.5 - dot(viewDirection, vNormal), 3.0);
          vec3 glow = vec3(1.0, 0.8, 0.3) * intensity * 2.0;
          gl_FragColor = vec4(glow, intensity);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sun.add(corona);
  }

  createPlanets() {
    Object.entries(PLANET_DATA).forEach(([name, data]) => {
      if (name === 'sun') return;

      // Create orbit line
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      this.scene.add(orbit);
      this.orbits.push(orbit);

      // Create planet with realistic PBR materials
      const planetGeometry = new THREE.SphereGeometry(data.radius, 128, 128);
      const planetMaterial = this.createPlanetMaterial(name, data);

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.userData = { name, ...data };

      // Apply axial tilt
      planet.rotation.z = THREE.MathUtils.degToRad(data.tilt);

      this.scene.add(planet);
      this.planets[name] = {
        mesh: planet,
        data: data,
        angle: Math.random() * Math.PI * 2 // Random starting position
      };

      // Add atmospheric glow for planets with atmosphere
      const atmospherePlanets = {
        earth: 0x4A90E2,
        venus: 0xFFC649,
        mars: 0xFF6B4A,
        jupiter: 0xC88B3A,
        saturn: 0xFAD5A5,
        uranus: 0x4FD0E7,
        neptune: 0x4166F5
      };

      if (atmospherePlanets[name]) {
        this.addAtmosphere(planet, data.radius, atmospherePlanets[name]);
      }

      // Add Saturn's rings
      if (name === 'saturn') {
        this.addSaturnRings(planet, data.radius);
      }

      // Add Earth's moon and clouds
      if (name === 'earth') {
        this.addEarthClouds(planet, data.radius);
        this.addMoon(planet);
      }

      // Add moons for other planets
      if (MOONS_DATA[name]) {
        this.addMoons(planet, name, MOONS_DATA[name]);
      }
    });
  }

  createPlanetMaterial(name, data) {
    const materialConfig = {};

    // Planet-specific textures and PBR properties
    switch (name) {
      case 'mercury':
        materialConfig.map = this.textures.mercury;
        materialConfig.roughness = 0.9;
        materialConfig.metalness = 0.1;
        break;
      case 'venus':
        materialConfig.map = this.textures.venus;
        materialConfig.roughness = 0.7;
        materialConfig.metalness = 0.0;
        materialConfig.emissive = new THREE.Color(0xFFC649);
        materialConfig.emissiveIntensity = 0.15;
        break;
      case 'earth':
        materialConfig.map = this.textures.earth;
        materialConfig.roughness = 0.7;
        materialConfig.metalness = 0.1;
        break;
      case 'mars':
        materialConfig.map = this.textures.mars;
        materialConfig.roughness = 0.95;
        materialConfig.metalness = 0.0;
        break;
      case 'jupiter':
        materialConfig.map = this.textures.jupiter;
        materialConfig.roughness = 0.6;
        materialConfig.metalness = 0.0;
        materialConfig.emissive = new THREE.Color(0xC88B3A);
        materialConfig.emissiveIntensity = 0.05;
        break;
      case 'saturn':
        materialConfig.map = this.textures.saturn;
        materialConfig.roughness = 0.65;
        materialConfig.metalness = 0.0;
        materialConfig.emissive = new THREE.Color(0xFAD5A5);
        materialConfig.emissiveIntensity = 0.05;
        break;
      case 'uranus':
        materialConfig.map = this.textures.uranus;
        materialConfig.roughness = 0.5;
        materialConfig.metalness = 0.0;
        materialConfig.emissive = new THREE.Color(0x4FD0E7);
        materialConfig.emissiveIntensity = 0.1;
        break;
      case 'neptune':
        materialConfig.map = this.textures.neptune;
        materialConfig.roughness = 0.5;
        materialConfig.metalness = 0.0;
        materialConfig.emissive = new THREE.Color(0x4166F5);
        materialConfig.emissiveIntensity = 0.1;
        break;
      default:
        materialConfig.color = data.color;
        materialConfig.roughness = 0.8;
        materialConfig.metalness = 0.2;
    }

    return new THREE.MeshStandardMaterial(materialConfig);
  }

  addSaturnRings(planet, planetRadius) {
    const ringGeometry = new THREE.RingGeometry(planetRadius * 1.2, planetRadius * 2, 128);
    const ringMaterial = new THREE.MeshStandardMaterial({
      map: this.textures.saturnRing,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      roughness: 0.9,
      metalness: 0.0
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    planet.add(ring);
  }

  addAtmosphere(planet, planetRadius, color) {
    const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.15, 64, 64);

    // Custom shader for atmospheric glow
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float intensity = pow(0.7 - dot(viewDirection, vNormal), 2.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(color) }
      },
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planet.add(atmosphere);
    planet.userData.atmosphere = atmosphere;
  }

  addEarthClouds(planet, planetRadius) {
    const cloudsGeometry = new THREE.SphereGeometry(planetRadius * 1.01, 128, 128);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: this.textures.earthClouds,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    planet.add(clouds);
    planet.userData.clouds = clouds;
  }

  addMoon(planet) {
    const moonGeometry = new THREE.SphereGeometry(2.7, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: this.textures.moon,
      roughness: 0.95,
      metalness: 0.0
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(25, 0, 0);
    moon.userData = { name: 'Moon', type: 'moon', parent: 'earth' };
    planet.add(moon);
    planet.userData.moon = moon;
  }

  addMoons(planet, planetName, moonsData) {
    if (!planet.userData.moons) {
      planet.userData.moons = [];
    }

    moonsData.forEach(moonData => {
      const moonGeometry = new THREE.SphereGeometry(moonData.radius, 32, 32);
      const moonMaterial = new THREE.MeshStandardMaterial({
        color: moonData.color,
        roughness: 0.9,
        metalness: 0.1
      });

      const moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.userData = {
        name: moonData.name,
        type: 'moon',
        parent: planetName,
        distance: moonData.distance,
        speed: moonData.speed,
        angle: Math.random() * Math.PI * 2
      };

      planet.add(moon);
      planet.userData.moons.push(moon);
    });
  }

  createAsteroidBelt() {
    const asteroidGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    // Create instanced mesh for performance
    const instancedMesh = new THREE.InstancedMesh(asteroidGeometry, asteroidMaterial, 2000);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < 2000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 480 + Math.random() * 60; // Between Mars and Jupiter
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = (Math.random() - 0.5) * 20;

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    this.scene.add(instancedMesh);
    this.asteroidBelt = instancedMesh;
  }

  createDwarfPlanets() {
    Object.entries(DWARF_PLANET_DATA).forEach(([name, data]) => {
      // Create orbit line
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        orbitPoints.push(
          Math.cos(angle) * data.distance,
          0,
          Math.sin(angle) * data.distance
        );
      }
      orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x666666,
        transparent: true,
        opacity: 0.2
      });
      const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
      this.scene.add(orbit);
      this.orbits.push(orbit);

      // Create dwarf planet
      const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.9,
        metalness: 0.1
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.userData = { name, ...data };
      planet.rotation.z = THREE.MathUtils.degToRad(data.tilt);

      this.scene.add(planet);
      this.planets[name] = {
        mesh: planet,
        data: data,
        angle: Math.random() * Math.PI * 2
      };
    });
  }

  createKuiperBelt() {
    const kuiperGeometry = new THREE.BufferGeometry();
    const kuiperMaterial = new THREE.PointsMaterial({
      color: 0x888888,
      size: 1.5,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });

    const kuiperVertices = [];
    for (let i = 0; i < 5000; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 1500 + Math.random() * 800; // Beyond Neptune
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = (Math.random() - 0.5) * 100;
      kuiperVertices.push(x, y, z);
    }

    kuiperGeometry.setAttribute('position', new THREE.Float32BufferAttribute(kuiperVertices, 3));
    const kuiperBelt = new THREE.Points(kuiperGeometry, kuiperMaterial);
    this.scene.add(kuiperBelt);
    this.kuiperBelt = kuiperBelt;
  }

  setupLighting() {
    // Ambient light - increased significantly for better planet visibility
    const ambientLight = new THREE.AmbientLight(0x404040, 2.0);
    this.scene.add(ambientLight);

    // Main sun light - much stronger to properly illuminate planets
    const sunLight = new THREE.PointLight(0xFFFFFF, 10, 50000);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = false;
    this.scene.add(sunLight);

    // Hemisphere light for better overall illumination
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 1, 0);
    this.scene.add(hemiLight);

    // Additional directional light from sun
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2);
    dirLight.position.set(0, 0, 0);
    this.scene.add(dirLight);
  }

  setupRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = null; // Will be set from main.js

    window.addEventListener('click', (event) => {
      if (!this.camera) return;

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const planetMeshes = Object.values(this.planets).map(p => p.mesh);
      const intersects = this.raycaster.intersectObjects(planetMeshes, true);

      if (intersects.length > 0) {
        // Find the root planet object by traversing up
        let clickedObject = intersects[0].object;
        while (clickedObject.parent && !clickedObject.userData.name) {
          clickedObject = clickedObject.parent;
        }

        // Only show info if we found a valid planet
        if (clickedObject.userData && clickedObject.userData.name) {
          this.showPlanetInfo(clickedObject.userData);

          // Trigger fly-to animation
          if (this.onPlanetClick) {
            this.onPlanetClick(clickedObject.userData.name, clickedObject);
          }
        }
      }
    });
  }

  setCamera(camera) {
    this.camera = camera;
  }

  showPlanetInfo(data) {
    const infoDiv = document.getElementById('planet-info');

    // Validate data
    if (!data || !data.name) {
      return;
    }

    // Get real NASA data
    const realData = REAL_PLANET_DATA[data.name];

    // Handle sun
    if (data.name === 'sun') {
      infoDiv.innerHTML = `
        <div class="planet-header">
          <strong style="font-size: 18px; color: #FDB813;">☉ SUN</strong>
        </div>
        <div class="planet-stats">
          <div class="stat-row">
            <span class="stat-label">Type</span>
            <span class="stat-value">G-type Main Sequence Star</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Surface Temp</span>
            <span class="stat-value">${realData.temperature.toLocaleString()} K (${(realData.temperature - 273.15).toFixed(0)}°C)</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Radius</span>
            <span class="stat-value">${realData.radius.toLocaleString()} km</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Mass</span>
            <span class="stat-value">${(realData.mass / 1e30).toFixed(2)} × 10³⁰ kg</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Rotation Period</span>
            <span class="stat-value">${realData.rotationPeriod.toFixed(1)} days</span>
          </div>
        </div>
        <div class="fun-fact">
          💡 The Sun contains 99.86% of the mass in our Solar System and could fit 1.3 million Earths inside it!
        </div>
      `;
      return;
    }

    // Handle moons
    if (data.type === 'moon') {
      const moonFacts = {
        'Moon': "Earth's Moon is the fifth largest moon in the Solar System and the only one humans have visited!",
        'Phobos': "Phobos orbits so close to Mars that it rises and sets twice per Martian day!",
        'Deimos': "Deimos is so small that an astronaut could jump off its surface and escape into space!",
        'Io': "Io is the most volcanically active body in the Solar System with over 400 active volcanoes!",
        'Europa': "Europa has a subsurface ocean that may contain twice as much water as Earth's oceans!",
        'Ganymede': "Ganymede is the largest moon in the Solar System, even bigger than Mercury!",
        'Callisto': "Callisto is the most heavily cratered object in the Solar System!",
        'Titan': "Titan is the only moon with a dense atmosphere and liquid lakes on its surface!",
        'Rhea': "Rhea may have its own ring system, making it unique among moons!",
        'Iapetus': "Iapetus has one bright side and one dark side, creating a yin-yang appearance!",
        'Titania': "Titania is the largest moon of Uranus with massive canyons and fault systems!",
        'Oberon': "Oberon is heavily cratered and may have a subsurface ocean!",
        'Triton': "Triton orbits Neptune backwards (retrograde) and has nitrogen geysers!"
      };

      infoDiv.innerHTML = `
        <div class="planet-header">
          <strong style="font-size: 18px; color: #AAA;">🌙 ${data.name.toUpperCase()}</strong>
          <span style="font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 8px;">Moon of ${data.parent.charAt(0).toUpperCase() + data.parent.slice(1)}</span>
        </div>
        <div class="planet-stats">
          <div class="stat-row">
            <span class="stat-label">Parent Planet</span>
            <span class="stat-value">${data.parent.charAt(0).toUpperCase() + data.parent.slice(1)}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Orbital Distance</span>
            <span class="stat-value">${data.distance ? data.distance + ' (scaled)' : 'N/A'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Type</span>
            <span class="stat-value">Natural Satellite</span>
          </div>
        </div>
        <div class="fun-fact">
          💡 ${moonFacts[data.name] || 'One of the fascinating moons in our Solar System!'}
        </div>
      `;
      return;
    }

    // Handle dwarf planets
    if (data.type === 'dwarf') {
      const dwarfFacts = {
        ceres: "Ceres is the largest object in the asteroid belt and was the first dwarf planet to be visited by a spacecraft (Dawn mission)!",
        pluto: "Pluto was considered the 9th planet until 2006. It has 5 known moons and a heart-shaped glacier!",
        eris: "Eris is slightly smaller than Pluto but more massive. Its discovery led to Pluto's reclassification!",
        makemake: "Makemake is named after the creator god of the Rapa Nui people of Easter Island.",
        haumea: "Haumea is egg-shaped due to its rapid rotation and has two moons and a ring system!"
      };

      infoDiv.innerHTML = `
        <div class="planet-header">
          <strong style="font-size: 18px; color: #888;">⚫ ${data.name.toUpperCase()}</strong>
          <span style="font-size: 10px; color: rgba(255,255,255,0.4); margin-left: 8px;">Dwarf Planet</span>
        </div>
        <div class="planet-stats">
          <div class="stat-row">
            <span class="stat-label">Distance from Sun</span>
            <span class="stat-value">${data.distance} million km</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Orbital Speed</span>
            <span class="stat-value">${data.speed} km/s</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Radius</span>
            <span class="stat-value">~${(data.radius * 100).toFixed(0)} km</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Axial Tilt</span>
            <span class="stat-value">${data.tilt}°</span>
          </div>
        </div>
        <div class="fun-fact">
          💡 ${dwarfFacts[data.name]}
        </div>
      `;
      return;
    }

    // Handle planets with real NASA data
    if (!realData) return;

    const funFacts = {
      mercury: "Mercury has no atmosphere and experiences temperature swings of over 600°C between day and night!",
      venus: "Venus rotates backwards and has the hottest surface of any planet, even hotter than Mercury!",
      earth: "Earth is the only known planet with liquid water on its surface and the only one known to harbor life.",
      mars: "Mars has the largest volcano in the Solar System - Olympus Mons, which is 21 km high!",
      jupiter: "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years!",
      saturn: "Saturn's rings are made of billions of pieces of ice and rock, some as small as grains of sand.",
      uranus: "Uranus rotates on its side at 98°, making it roll like a ball as it orbits the Sun!",
      neptune: "Neptune has the strongest winds in the Solar System, reaching speeds of 2,100 km/h!"
    };

    const tempC = (realData.meanTemperature - 273.15).toFixed(0);
    const orbitalPeriodYears = (realData.orbitalPeriod / 365.25).toFixed(2);
    const distanceAU = (realData.semiMajorAxis / 149597870.7).toFixed(2);

    infoDiv.innerHTML = `
      <div class="planet-header">
        <strong style="font-size: 18px; color: #fff;">${data.name.toUpperCase()}</strong>
      </div>
      <div class="planet-stats">
        <div class="stat-row">
          <span class="stat-label">Distance from Sun</span>
          <span class="stat-value">${(realData.semiMajorAxis / 1000000).toFixed(1)} million km (${distanceAU} AU)</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Orbital Period</span>
          <span class="stat-value">${realData.orbitalPeriod.toFixed(1)} days (${orbitalPeriodYears} years)</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Orbital Speed</span>
          <span class="stat-value">${realData.meanOrbitalVelocity.toFixed(2)} km/s</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Radius</span>
          <span class="stat-value">${realData.radius.toLocaleString()} km</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Mass</span>
          <span class="stat-value">${(realData.mass / 1e24).toFixed(2)} × 10²⁴ kg</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Surface Gravity</span>
          <span class="stat-value">${realData.surfaceGravity.toFixed(2)} m/s²</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Mean Temperature</span>
          <span class="stat-value">${realData.meanTemperature} K (${tempC}°C)</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Axial Tilt</span>
          <span class="stat-value">${realData.axialTilt.toFixed(2)}°</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">Rotation Period</span>
          <span class="stat-value">${Math.abs(realData.rotationPeriod).toFixed(2)} days${realData.rotationPeriod < 0 ? ' (retrograde)' : ''}</span>
        </div>
      </div>
      <div class="fun-fact">
        💡 ${funFacts[data.name]}
      </div>
    `;
  }

  initializeTrails() {
    const trailColors = {
      mercury: 0x8C7853,
      venus: 0xFFC649,
      earth: 0x2233FF,
      mars: 0xCD5C5C,
      jupiter: 0xC88B3A,
      saturn: 0xFAD5A5,
      uranus: 0x4FD0E7,
      neptune: 0x4166F5,
      ceres: 0x9B8B7E,
      pluto: 0xC4A582,
      eris: 0xD4D4D4,
      makemake: 0xB8967D,
      haumea: 0xE8D4C0
    };

    Object.entries(this.planets).forEach(([name, planet]) => {
      if (name === 'sun') return;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(this.maxTrailPoints * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.LineBasicMaterial({
        color: trailColors[name],
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });

      const trail = new THREE.Line(geometry, material);
      trail.frustumCulled = false;
      this.scene.add(trail);

      this.trails[name] = {
        line: trail,
        positions: [],
        geometry: geometry
      };
    });
  }

  updateTrails() {
    if (!this.showTrails) return;

    Object.entries(this.planets).forEach(([name, planet]) => {
      if (name === 'sun' || !this.trails[name]) return;

      const trail = this.trails[name];
      const pos = planet.mesh.position.clone();

      // Add new position
      trail.positions.push(pos);

      // Limit trail length
      if (trail.positions.length > this.maxTrailPoints) {
        trail.positions.shift();
      }

      // Update geometry
      const positions = trail.geometry.attributes.position.array;
      for (let i = 0; i < trail.positions.length; i++) {
        positions[i * 3] = trail.positions[i].x;
        positions[i * 3 + 1] = trail.positions[i].y;
        positions[i * 3 + 2] = trail.positions[i].z;
      }

      // Fill remaining positions with last point to avoid artifacts
      for (let i = trail.positions.length; i < this.maxTrailPoints; i++) {
        const lastPos = trail.positions[trail.positions.length - 1] || new THREE.Vector3();
        positions[i * 3] = lastPos.x;
        positions[i * 3 + 1] = lastPos.y;
        positions[i * 3 + 2] = lastPos.z;
      }

      trail.geometry.attributes.position.needsUpdate = true;
      trail.geometry.setDrawRange(0, trail.positions.length);
    });
  }

  toggleTrails() {
    this.showTrails = !this.showTrails;
    Object.values(this.trails).forEach(trail => {
      trail.line.visible = this.showTrails;
    });
    return this.showTrails;
  }

  clearTrails() {
    Object.values(this.trails).forEach(trail => {
      trail.positions = [];
      const positions = trail.geometry.attributes.position.array;
      positions.fill(0);
      trail.geometry.attributes.position.needsUpdate = true;
      trail.geometry.setDrawRange(0, 0);
    });
  }

  update(delta) {
    this.time += delta;

    // Update planet positions using realistic orbital mechanics
    Object.entries(this.planets).forEach(([name, planet]) => {
      if (name === 'sun') return;

      const data = planet.data;

      // Calculate orbital position (simplified Kepler's laws)
      planet.angle += (data.speed / data.distance) * delta * 0.1;

      const x = Math.cos(planet.angle) * data.distance;
      const z = Math.sin(planet.angle) * data.distance;

      planet.mesh.position.set(x, 0, z);

      // Rotate planet on its axis
      planet.mesh.rotation.y += delta * 0.5;

      // Rotate Earth's clouds slightly faster for realism
      if (planet.mesh.userData.clouds) {
        planet.mesh.userData.clouds.rotation.y += delta * 0.6;
      }

      // Rotate Earth's moon around planet
      if (planet.mesh.userData.moon) {
        planet.mesh.userData.moon.rotation.y += delta * 2;
      }

      // Animate other moons
      if (planet.mesh.userData.moons) {
        planet.mesh.userData.moons.forEach(moon => {
          const moonData = moon.userData;
          moonData.angle += moonData.speed * delta * 0.1;

          const x = Math.cos(moonData.angle) * moonData.distance;
          const z = Math.sin(moonData.angle) * moonData.distance;
          moon.position.set(x, 0, z);
          moon.rotation.y += delta;
        });
      }
    });

    // Update trails
    this.updateTrails();
  }
}
