import * as THREE from 'three';

// Advanced Particle Systems for Nebula, Comets, and Visual Effects
export class ParticleSystems {
    constructor(scene) {
        this.scene = scene;
        this.systems = {};
        this.comets = [];
        this.nebulaParticles = null;
        this.asteroidField = null;
        
        // Particle configurations
        this.configs = {
            nebula: {
                count: 5000,
                size: 20,
                color: new THREE.Color(0x4A90E2),
                opacity: 0.15,
                spread: 8000
            },
            comets: {
                count: 100,
                size: 3,
                color: new THREE.Color(0xFFFFFF),
                opacity: 0.8,
                trailLength: 50
            },
            asteroidFieldEnhanced: {
                count: 10000,
                size: 1,
                color: new THREE.Color(0x888888),
                spread: 2000
            }
        };
    }

    // Create beautiful nebula background
    createNebula() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const opacities = [];

        const color1 = new THREE.Color(0x4A90E2); // Blue
        const color2 = new THREE.Color(0x7B68EE); // Purple
        const color3 = new THREE.Color(0xFF6B9D); // Pink

        for (let i = 0; i < this.configs.nebula.count; i++) {
            // Create nebula cloud shape
            const radius = Math.random() * this.configs.nebula.spread;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions.push(x, y, z);

            // Gradient colors
            const mixRatio = Math.random();
            const mixedColor = color1.clone().lerp(color2, mixRatio).lerp(color3, Math.random() * 0.3);
            colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            sizes.push(this.configs.nebula.size * (0.5 + Math.random() * 1.5));
            opacities.push(this.configs.nebula.opacity * (0.3 + Math.random() * 0.7));
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('opacity', new THREE.Float32BufferAttribute(opacities, 1));

        // Custom shader material for nebula
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vOpacity;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vOpacity = opacity * (0.8 + 0.2 * sin(time * 0.5 + position.x * 0.001));
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vOpacity;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    
                    float alpha = (1.0 - dist * 2.0) * vOpacity;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        this.nebulaParticles = new THREE.Points(geometry, material);
        this.scene.add(this.nebulaParticles);
        this.systems.nebula = this.nebulaParticles;
    }

    // Create comet system with trails
    createComets() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        const colors = [];

        for (let i = 0; i < this.configs.comets.count; i++) {
            // Random starting positions in outer solar system
            const distance = 1500 + Math.random() * 1000;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = (Math.random() - 0.5) * 200;

            positions.push(x, y, z);

            // Velocity towards inner solar system
            const speed = 20 + Math.random() * 30;
            const vx = -Math.cos(angle) * speed * 0.3;
            const vz = -Math.sin(angle) * speed * 0.3;
            const vy = (Math.random() - 0.5) * 5;

            velocities.push(vx, vy, vz);

            // Comet colors (white with blue tint)
            colors.push(0.9, 0.95, 1.0);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: this.configs.comets.size,
            color: 0xFFFFFF,
            transparent: true,
            opacity: this.configs.comets.opacity,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        const comets = new THREE.Points(geometry, material);
        this.scene.add(comets);
        this.systems.comets = comets;

        // Create trails for each comet
        this.createCometTrails();
    }

    createCometTrails() {
        const geometry = this.systems.comets.geometry;
        const positions = geometry.attributes.position.array;
        const velocities = geometry.attributes.velocity.array;

        for (let i = 0; i < positions.length / 3; i++) {
            const comet = {
                position: new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]),
                velocity: new THREE.Vector3(velocities[i*3], velocities[i*3+1], velocities[i*3+2]),
                trail: [],
                maxTrailLength: this.configs.comets.trailLength
            };
            this.comets.push(comet);
        }
    }

    // Enhanced asteroid field with more detail
    createEnhancedAsteroidField() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const sizes = [];
        const rotations = [];

        for (let i = 0; i < this.configs.asteroidFieldEnhanced.count; i++) {
            // Asteroid belt region
            const distance = 480 + Math.random() * 60;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = (Math.random() - 0.5) * 30;

            positions.push(x, y, z);

            // Varying colors for realism
            const grayValue = 0.6 + Math.random() * 0.4;
            colors.push(grayValue, grayValue, grayValue);

            sizes.push(0.5 + Math.random() * 2);

            rotations.push(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('rotation', new THREE.Float32BufferAttribute(rotations, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                attribute vec3 rotation;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Simple rotation animation
                    float t = rotation.y * 0.1;
                    float cosT = cos(t);
                    float sinT = sin(t);
                    float x = pos.x * cosT - pos.z * sinT;
                    float z = pos.x * sinT + pos.z * cosT;
                    pos.x = x;
                    pos.z = z;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - dist * 2.0;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        this.asteroidField = new THREE.Points(geometry, material);
        this.scene.add(this.asteroidField);
        this.systems.asteroidField = this.asteroidField;
    }

    // Create Lagrange point visualizations
    createLagrangePoints(planet1, planet2) {
        const lagrangePoints = [];
        
        // Calculate L1, L2, L3, L4, L5 points
        const p1Pos = planet1.mesh.position;
        const p2Pos = planet2.mesh.position;
        
        const distance = p1Pos.distanceTo(p2Pos);
        const direction = new THREE.Vector3().subVectors(p2Pos, p1Pos).normalize();
        
        // L1: Between the two bodies
        const l1Pos = p1Pos.clone().add(direction.clone().multiplyScalar(distance * 0.3));
        lagrangePoints.push({ position: l1Pos, name: 'L1', color: 0xFF6B6B });
        
        // L2: Beyond the smaller body
        const l2Pos = p2Pos.clone().add(direction.clone().multiplyScalar(distance * 0.1));
        lagrangePoints.push({ position: l2Pos, name: 'L2', color: 0x4ECDC4 });
        
        // L3: Opposite side of larger body
        const l3Pos = p1Pos.clone().add(direction.clone().multiplyScalar(-distance * 0.5));
        lagrangePoints.push({ position: l3Pos, name: 'L3', color: 0xFFE66D });
        
        // L4 & L5: 60 degrees ahead and behind
        const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x);
        const l4Pos = p1Pos.clone().add(direction.clone().multiplyScalar(distance * 0.5))
            .add(perpendicular.clone().multiplyScalar(distance * 0.866));
        lagrangePoints.push({ position: l4Pos, name: 'L4', color: 0x95E1D3 });
        
        const l5Pos = p1Pos.clone().add(direction.clone().multiplyScalar(distance * 0.5))
            .add(perpendicular.clone().multiplyScalar(-distance * 0.866));
        lagrangePoints.push({ position: l5Pos, name: 'L5', color: 0xF38181 });

        // Create visual markers
        lagrangePoints.forEach(point => {
            const geometry = new THREE.SphereGeometry(3, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: point.color,
                transparent: true,
                opacity: 0.6,
                emissive: point.color,
                emissiveIntensity: 0.5
            });
            
            const marker = new THREE.Mesh(geometry, material);
            marker.position.copy(point.position);
            marker.userData = { type: 'lagrange', name: point.name };
            
            this.scene.add(marker);
            
            // Add pulsing animation
            this.systems[point.name] = { mesh: marker, pulse: 0 };
        });

        return lagrangePoints;
    }

    // Create orbital resonance visualization
    createOrbitalResonance(planet1, planet2) {
        const resonance = {
            planet1: planet1,
            planet2: planet2,
            ratio: planet1.data.speed / planet2.data.speed,
            line: null
        };

        // Create visual connection line
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(6); // 2 points * 3 coordinates
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0x00FF00,
            transparent: true,
            opacity: 0.3,
            linewidth: 2
        });

        resonance.line = new THREE.Line(geometry, material);
        this.scene.add(resonance.line);

        this.systems[`resonance_${planet1.data.name}_${planet2.data.name}`] = resonance;
    }

    // Update all particle systems
    update(delta, time) {
        // Update nebula
        if (this.systems.nebula) {
            this.systems.nebula.material.uniforms.time.value = time;
        }

        // Update comets
        if (this.systems.comets) {
            const geometry = this.systems.comets.geometry;
            const positions = geometry.attributes.position.array;
            const velocities = geometry.attributes.velocity.array;

            for (let i = 0; i < this.comets.length; i++) {
                const comet = this.comets[i];
                
                // Update position
                comet.position.add(comet.velocity.clone().multiplyScalar(delta));
                
                // Update trail
                comet.trail.push(comet.position.clone());
                if (comet.trail.length > comet.maxTrailLength) {
                    comet.trail.shift();
                }

                // Reset if too close to sun or out of bounds
                const distFromSun = comet.position.length();
                if (distFromSun < 100 || distFromSun > 5000) {
                    // Reset comet
                    const distance = 1500 + Math.random() * 1000;
                    const angle = Math.random() * Math.PI * 2;
                    comet.position.set(
                        Math.cos(angle) * distance,
                        (Math.random() - 0.5) * 200,
                        Math.sin(angle) * distance
                    );
                    comet.velocity.set(
                        -Math.cos(angle) * (20 + Math.random() * 30) * 0.3,
                        (Math.random() - 0.5) * 5,
                        -Math.sin(angle) * (20 + Math.random() * 30) * 0.3
                    );
                    comet.trail = [];
                }

                // Update geometry
                positions[i * 3] = comet.position.x;
                positions[i * 3 + 1] = comet.position.y;
                positions[i * 3 + 2] = comet.position.z;
            }

            geometry.attributes.position.needsUpdate = true;

            // Update comet trails (create separate trail rendering)
            this.updateCometTrails();
        }

        // Update asteroid field rotation
        if (this.systems.asteroidField) {
            this.systems.asteroidField.material.uniforms.time.value = time;
            this.systems.asteroidField.rotation.y += delta * 0.01;
        }

        // Update Lagrange point pulsing
        Object.keys(this.systems).forEach(key => {
            if (key.startsWith('L')) {
                const system = this.systems[key];
                system.pulse += delta * 2;
                const scale = 1 + Math.sin(system.pulse) * 0.2;
                system.mesh.scale.setScalar(scale);
                system.mesh.material.opacity = 0.4 + Math.sin(system.pulse) * 0.2;
            }
        });

        // Update orbital resonance lines
        Object.keys(this.systems).forEach(key => {
            if (key.startsWith('resonance_')) {
                const resonance = this.systems[key];
                const positions = resonance.line.geometry.attributes.position.array;
                
                // Update line positions
                positions[0] = resonance.planet1.mesh.position.x;
                positions[1] = resonance.planet1.mesh.position.y;
                positions[2] = resonance.planet1.mesh.position.z;
                positions[3] = resonance.planet2.mesh.position.x;
                positions[4] = resonance.planet2.mesh.position.y;
                positions[5] = resonance.planet2.mesh.position.z;
                
                resonance.line.geometry.attributes.position.needsUpdate = true;
                
                // Pulse based on resonance
                const pulse = Math.sin(time * resonance.ratio) * 0.5 + 0.5;
                resonance.line.material.opacity = 0.2 + pulse * 0.3;
            }
        });
    }

    updateCometTrails() {
        // Create visual trails for comets
        // This would create line segments following each comet's path
        // For performance, we'll create a simplified version
        this.comets.forEach((comet, index) => {
            if (comet.trail.length < 2) return;
            
            // Create or update trail geometry
            if (!comet.trailLine) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(this.configs.comets.trailLength * 3);
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                const material = new THREE.LineBasicMaterial({
                    color: 0x88CCFF,
                    transparent: true,
                    opacity: 0.4,
                    blending: THREE.AdditiveBlending
                });
                
                comet.trailLine = new THREE.Line(geometry, material);
                this.scene.add(comet.trailLine);
            }
            
            const positions = comet.trailLine.geometry.attributes.position.array;
            for (let i = 0; i < comet.trail.length; i++) {
                positions[i * 3] = comet.trail[i].x;
                positions[i * 3 + 1] = comet.trail[i].y;
                positions[i * 3 + 2] = comet.trail[i].z;
            }
            
            // Fill remaining with last point
            const lastPoint = comet.trail[comet.trail.length - 1];
            for (let i = comet.trail.length; i < this.configs.comets.trailLength; i++) {
                positions[i * 3] = lastPoint.x;
                positions[i * 3 + 1] = lastPoint.y;
                positions[i * 3 + 2] = lastPoint.z;
            }
            
            comet.trailLine.geometry.attributes.position.needsUpdate = true;
            comet.trailLine.geometry.setDrawRange(0, comet.trail.length);
        });
    }

    // Add shooting star effect
    createShootingStar() {
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 1.0
        });
        
        const star = new THREE.Mesh(geometry, material);
        
        // Random start position
        const angle = Math.random() * Math.PI * 2;
        const distance = 1000 + Math.random() * 1000;
        star.position.set(
            Math.cos(angle) * distance,
            (Math.random() - 0.5) * 500,
            Math.sin(angle) * distance
        );
        
        // Velocity towards center
        const velocity = new THREE.Vector3(
            -star.position.x * 0.01,
            -star.position.y * 0.01,
            -star.position.z * 0.01
        ).normalize().multiplyScalar(200);
        
        this.scene.add(star);
        
        // Animate and remove
        const animate = () => {
            star.position.add(velocity.clone().multiplyScalar(0.016));
            star.material.opacity *= 0.98;
            star.scale.multiplyScalar(1.02);
            
            if (star.material.opacity > 0.01 && star.position.length() > 50) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(star);
                star.geometry.dispose();
                star.material.dispose();
            }
        };
        
        animate();
    }

    // Clean up resources
    dispose() {
        Object.values(this.systems).forEach(system => {
            if (system.geometry) system.geometry.dispose();
            if (system.material) system.material.dispose();
            if (system.mesh) this.scene.remove(system.mesh);
        });
        
        this.comets.forEach(comet => {
            if (comet.trailLine) {
                comet.trailLine.geometry.dispose();
                comet.trailLine.material.dispose();
                this.scene.remove(comet.trailLine);
            }
        });
    }
}