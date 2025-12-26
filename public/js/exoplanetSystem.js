import * as THREE from 'three';

// Exoplanet System - Adds realistic exoplanets to the solar system
export class ExoplanetSystem {
    constructor(scene, solarSystem) {
        this.scene = scene;
        this.solarSystem = solarSystem;
        this.exoplanets = {};
        this.enabled = false;
        
        // Realistic exoplanet data from NASA Exoplanet Archive
        this.exoplanetData = [
            {
                name: 'Kepler-186f',
                type: 'Super-Earth',
                radius: 1.17, // Earth radii
                mass: 1.4, // Earth masses
                distance: 500, // Scaled distance from sun
                orbitalPeriod: 130, // Days
                star: 'Kepler-186',
                habitable: true,
                color: 0x4A90E2,
                description: 'First Earth-sized planet in habitable zone'
            },
            {
                name: 'TRAPPIST-1e',
                type: 'Super-Earth',
                radius: 0.91,
                mass: 0.69,
                distance: 650,
                orbitalPeriod: 6.1,
                star: 'TRAPPIST-1',
                habitable: true,
                color: 0x7B68EE,
                description: 'Rocky planet in habitable zone of ultra-cool dwarf'
            },
            {
                name: 'Proxima Centauri b',
                type: 'Super-Earth',
                radius: 1.13,
                mass: 1.27,
                distance: 800,
                orbitalPeriod: 11.2,
                star: 'Proxima Centauri',
                habitable: true,
                color: 0xFF6B9D,
                description: 'Closest exoplanet to Earth'
            },
            {
                name: 'HD 209458 b',
                type: 'Hot Jupiter',
                radius: 1.38, // Jupiter radii
                mass: 0.69, // Jupiter masses
                distance: 400,
                orbitalPeriod: 3.5,
                star: 'HD 209458',
                habitable: false,
                color: 0xFFA500,
                description: 'Gas giant with evaporating atmosphere'
            },
            {
                name: '55 Cancri e',
                type: 'Super-Earth',
                radius: 1.91,
                mass: 7.99,
                distance: 350,
                orbitalPeriod: 0.7,
                star: '55 Cancri',
                habitable: false,
                color: 0xCD5C5C,
                description: 'Lava world with extreme temperatures'
            },
            {
                name: 'WASP-12b',
                type: 'Hot Jupiter',
                radius: 1.9, // Jupiter radii
                mass: 1.4, // Jupiter masses
                distance: 450,
                orbitalPeriod: 1.1,
                star: 'WASP-12',
                habitable: false,
                color: 0xFFD700,
                description: 'Being consumed by its star'
            },
            {
                name: 'Gliese 581g',
                type: 'Super-Earth',
                radius: 1.5,
                mass: 3.1,
                distance: 700,
                orbitalPeriod: 32,
                star: 'Gliese 581',
                habitable: true,
                color: 0x50C878,
                description: 'Potentially habitable super-Earth'
            },
            {
                name: 'Kepler-22b',
                type: 'Super-Earth',
                radius: 2.38,
                mass: 10.4,
                distance: 550,
                orbitalPeriod: 289,
                star: 'Kepler-22',
                habitable: true,
                color: 0x4169E1,
                description: 'First habitable-zone planet discovered by Kepler'
            }
        ];
    }

    // Initialize exoplanet system
    init() {
        if (this.enabled) return;
        
        this.enabled = true;
        this.createExoplanets();
        console.log('✅ Exoplanet system initialized');
    }

    createExoplanets() {
        this.exoplanetData.forEach((data, index) => {
            // Create scaled geometry based on radius
            const radius = Math.max(2, data.radius * 2); // Scale for visibility
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            
            // Create material with appropriate color
            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: 0.7,
                metalness: 0.1,
                emissive: data.habitable ? 0x228B22 : 0x000000,
                emissiveIntensity: data.habitable ? 0.2 : 0
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Position in a separate orbit (beyond Kuiper belt)
            const angle = (index / this.exoplanetData.length) * Math.PI * 2;
            const distance = data.distance;
            mesh.position.set(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );

            // Add orbit line
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitPoints = [];
            for (let i = 0; i <= 64; i++) {
                const a = (i / 64) * Math.PI * 2;
                orbitPoints.push(
                    Math.cos(a) * distance,
                    0,
                    Math.sin(a) * distance
                );
            }
            orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            this.scene.add(orbit);

            // Store metadata
            mesh.userData = {
                name: data.name,
                type: 'exoplanet',
                exoplanetData: data,
                orbit: orbit
            };

            // Add atmosphere for habitable planets
            if (data.habitable) {
                this.addExoplanetAtmosphere(mesh, radius, data.color);
            }

            // Add to scene and registry
            this.scene.add(mesh);
            this.exoplanets[data.name] = {
                mesh: mesh,
                data: data,
                angle: angle,
                speed: (2 * Math.PI) / data.orbitalPeriod * 0.1 // Scaled orbital speed
            };
        });
    }

    addExoplanetAtmosphere(planet, radius, color) {
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
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
    }

    // Update exoplanet positions
    update(delta) {
        if (!this.enabled) return;

        Object.values(this.exoplanets).forEach(exoplanet => {
            // Update orbital position
            exoplanet.angle += exoplanet.speed * delta;
            
            const x = Math.cos(exoplanet.angle) * exoplanet.data.distance;
            const z = Math.sin(exoplanet.angle) * exoplanet.data.distance;
            
            exoplanet.mesh.position.set(x, 0, z);
            
            // Rotate on axis
            exoplanet.mesh.rotation.y += delta * 0.5;
        });
    }

    // Show exoplanet info
    showExoplanetInfo(exoplanetName) {
        const exoplanet = this.exoplanets[exoplanetName];
        if (!exoplanet) return;

        const data = exoplanet.data;
        const infoDiv = document.getElementById('planet-info');
        
        const habitableBadge = data.habitable ? 
            '<span style="background: #228B22; padding: 2px 6px; border-radius: 4px; font-size: 10px;">HABITABLE</span>' : 
            '<span style="background: #8B0000; padding: 2px 6px; border-radius: 4px; font-size: 10px;">NON-HABITABLE</span>';

        infoDiv.innerHTML = `
            <div class="planet-header">
                <strong style="font-size: 16px; color: #fff;">${data.name}</strong>
                ${habitableBadge}
            </div>
            <div class="planet-stats">
                <div class="stat-row">
                    <span class="stat-label">Type</span>
                    <span class="stat-value">${data.type}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Star System</span>
                    <span class="stat-value">${data.star}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Radius</span>
                    <span class="stat-value">${data.radius} Earth radii</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Mass</span>
                    <span class="stat-value">${data.mass} Earth masses</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Orbital Period</span>
                    <span class="stat-value">${data.orbitalPeriod} days</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Distance (Scaled)</span>
                    <span class="stat-value">${data.distance} units</span>
                </div>
            </div>
            <div class="fun-fact">
                💡 ${data.description}
            </div>
        `;
    }

    // Toggle exoplanet visibility
    toggleExoplanets() {
        this.enabled = !this.enabled;
        
        Object.values(this.exoplanets).forEach(exoplanet => {
            exoplanet.mesh.visible = this.enabled;
            if (exoplanet.mesh.userData.orbit) {
                exoplanet.mesh.userData.orbit.visible = this.enabled;
            }
        });

        return this.enabled;
    }

    // Get exoplanet count
    getExoplanetCount() {
        return Object.keys(this.exoplanets).length;
    }

    // Clean up
    dispose() {
        Object.values(this.exoplanets).forEach(exoplanet => {
            this.scene.remove(exoplanet.mesh);
            if (exoplanet.mesh.userData.orbit) {
                this.scene.remove(exoplanet.mesh.userData.orbit);
            }
        });
        this.exoplanets = {};
    }
}