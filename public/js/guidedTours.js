import * as THREE from 'three';

// Interactive Guided Tours and Educational Missions
export class GuidedTours {
    constructor(solarSystem, camera, controls) {
        this.solarSystem = solarSystem;
        this.camera = camera;
        this.controls = controls;
        
        this.tours = [];
        this.currentTour = null;
        this.currentStep = 0;
        this.isActive = false;
        
        this.tourUI = null;
        this.tourOverlay = null;
        
        this.initializeTours();
        this.createTourUI();
    }

    initializeTours() {
        // Define educational tours
        this.tours = [
            {
                id: 'solar-system-overview',
                name: 'Solar System Grand Tour',
                description: 'A comprehensive journey through our solar system',
                duration: '15 minutes',
                difficulty: 'Beginner',
                steps: [
                    {
                        target: 'sun',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Welcome to the Sun, the heart of our solar system. This G-type main sequence star contains 99.86% of the system\'s mass.',
                        facts: [
                            'Surface temperature: 5,778 K',
                            'Age: 4.6 billion years',
                            'Could fit 1.3 million Earths inside'
                        ]
                    },
                    {
                        target: 'mercury',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Mercury, the smallest and fastest planet, orbits the Sun in just 88 Earth days.',
                        facts: [
                            'Closest to the Sun',
                            'No atmosphere',
                            'Temperature extremes: -173°C to 427°C'
                        ]
                    },
                    {
                        target: 'venus',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Venus, Earth\'s twin in size, has a toxic atmosphere and the hottest surface in the solar system.',
                        facts: [
                            'Hottest planet: 462°C',
                            'Rotates backwards',
                            'Thick CO₂ atmosphere'
                        ]
                    },
                    {
                        target: 'earth',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Earth, our home - the only known planet with liquid water and life.',
                        facts: [
                            'Perfect distance from Sun',
                            '71% water coverage',
                            'Only planet with plate tectonics'
                        ]
                    },
                    {
                        target: 'mars',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Mars, the Red Planet, has fascinated humans for centuries and may hold clues to past life.',
                        facts: [
                            'Home to Olympus Mons (largest volcano)',
                            'Thin atmosphere',
                            'Future colonization target'
                        ]
                    },
                    {
                        target: 'jupiter',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Jupiter, the giant protector, has a mass 2.5 times all other planets combined.',
                        facts: [
                            'Largest planet',
                            'Great Red Spot storm (400+ years old)',
                            '79 known moons'
                        ]
                    },
                    {
                        target: 'saturn',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Saturn, famous for its spectacular rings made of billions of ice and rock particles.',
                        facts: [
                            'Rings span 282,000 km',
                            'Least dense planet',
                            'Titan has liquid lakes'
                        ]
                    },
                    {
                        target: 'uranus',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Uranus rotates on its side, making it unique among the planets.',
                        facts: [
                            'Rotates at 98° tilt',
                            'Coldest atmosphere',
                            '27 known moons'
                        ]
                    },
                    {
                        target: 'neptune',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Neptune, the windiest planet, has supersonic winds reaching 2,100 km/h.',
                        facts: [
                            'Strongest winds in solar system',
                            'Discovered by mathematics',
                            '14 known moons'
                        ]
                    }
                ]
            },
            {
                id: 'earth-mars-comparison',
                name: 'Earth vs Mars Mission',
                description: 'Compare Earth and Mars for potential colonization',
                duration: '10 minutes',
                difficulty: 'Intermediate',
                steps: [
                    {
                        target: 'earth',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Earth has all the ingredients for life: liquid water, protective atmosphere, and moderate temperatures.',
                        facts: [
                            'Gravity: 9.8 m/s²',
                            'Atmosphere: 78% N₂, 21% O₂',
                            'Average temp: 15°C'
                        ]
                    },
                    {
                        target: 'mars',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Mars presents challenges but also opportunities for human settlement.',
                        facts: [
                            'Gravity: 3.7 m/s² (38% of Earth)',
                            'Atmosphere: 95% CO₂',
                            'Average temp: -63°C'
                        ]
                    },
                    {
                        target: 'mars',
                        action: 'showInfo',
                        duration: 3000,
                        narration: 'Mars colonization challenges include radiation protection, water extraction, and terraforming.',
                        facts: [
                            'Need pressurized habitats',
                            'Water ice at poles and underground',
                            'Potential for terraforming'
                        ]
                    }
                ]
            },
            {
                id: 'gas-giants-tour',
                name: 'Gas Giants Exploration',
                description: 'Deep dive into the outer solar system giants',
                duration: '12 minutes',
                difficulty: 'Advanced',
                steps: [
                    {
                        target: 'jupiter',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Jupiter is a failed star - if it had 80x more mass, it would ignite nuclear fusion.',
                        facts: [
                            'Composition: 90% hydrogen, 10% helium',
                            'Strong magnetic field',
                            'Europa may have subsurface ocean'
                        ]
                    },
                    {
                        target: 'saturn',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Saturn\'s rings are incredibly thin - only 10 meters thick but 282,000 km wide!',
                        facts: [
                            'Ring composition: 99.9% ice',
                            'Titan has thick atmosphere',
                            'Enceladus has ice geysers'
                        ]
                    },
                    {
                        target: 'uranus',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Uranus was the first planet discovered with a telescope.',
                        facts: [
                            'Tilted rotation axis',
                            'Methane gives blue color',
                            'Extreme seasonal changes'
                        ]
                    },
                    {
                        target: 'neptune',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Neptune\'s winds are the fastest in the solar system.',
                        facts: [
                            'Wind speeds: 2,100 km/h',
                            'Triton orbits backwards',
                            'May have diamond rain'
                        ]
                    }
                ]
            },
            {
                id: 'dwarf-planets-discovery',
                name: 'Dwarf Planet Discovery',
                description: 'Explore the reclassified dwarf planets',
                duration: '8 minutes',
                difficulty: 'Beginner',
                steps: [
                    {
                        target: 'ceres',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Ceres is the largest object in the asteroid belt and the only dwarf planet there.',
                        facts: [
                            '1/4 the size of Earth\'s Moon',
                            'May have subsurface water',
                            'Visited by Dawn mission'
                        ]
                    },
                    {
                        target: 'pluto',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Pluto was considered the 9th planet until 2006, when the IAU redefined planet criteria.',
                        facts: [
                            '5 known moons',
                            'Heart-shaped glacier',
                            'Atmosphere freezes periodically'
                        ]
                    },
                    {
                        target: 'eris',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Eris is slightly smaller than Pluto but more massive, leading to Pluto\'s reclassification.',
                        facts: [
                            'Most massive dwarf planet',
                            'Highly elliptical orbit',
                            'One known moon: Dysnomia'
                        ]
                    }
                ]
            }
        ];

        // Mission simulations
        this.missions = [
            {
                id: 'mission-mars-base',
                name: 'Mars Base Alpha',
                description: 'Establish the first permanent Mars colony',
                objectives: [
                    'Deploy habitat modules',
                    'Extract water ice',
                    'Generate oxygen',
                    'Maintain life support'
                ],
                difficulty: 'Hard',
                duration: '20 minutes'
            },
            {
                id: 'mission-asteroid-mining',
                name: 'Asteroid Mining Operation',
                description: 'Extract valuable resources from the asteroid belt',
                objectives: [
                    'Locate metal-rich asteroids',
                    'Deploy mining drones',
                    'Process materials',
                    'Return to Earth orbit'
                ],
                difficulty: 'Medium',
                duration: '15 minutes'
            },
            {
                id: 'mission-jupiter-explorer',
                name: 'Jupiter Deep Atmosphere',
                description: 'Study Jupiter\'s atmosphere and magnetic field',
                objectives: [
                    'Navigate radiation belts',
                    'Sample atmospheric composition',
                    'Study Great Red Spot',
                    'Investigate moon Europa'
                ],
                difficulty: 'Expert',
                duration: '25 minutes'
            }
        ];
    }

    createTourUI() {
        // Create tour overlay
        this.tourOverlay = document.createElement('div');
        this.tourOverlay.id = 'tour-overlay';
        this.tourOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 2000;
            display: none;
            backdrop-filter: blur(10px);
        `;

        // Create tour panel
        const tourPanel = document.createElement('div');
        tourPanel.style.cssText = `
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            max-width: 90%;
            background: rgba(15, 20, 35, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            color: white;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;

        tourPanel.innerHTML = `
            <div id="tour-content">
                <div id="tour-header" style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                    <h3 id="tour-title" style="margin: 0; color: #4A90E2;">Tour Title</h3>
                    <p id="tour-description" style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">Description</p>
                </div>
                <div id="tour-narration" style="margin: 15px 0; font-size: 14px; line-height: 1.6; min-height: 60px;">
                    Narration text...
                </div>
                <div id="tour-facts" style="margin: 10px 0; font-size: 12px; opacity: 0.8;">
                    <!-- Facts will be inserted here -->
                </div>
                <div id="tour-progress" style="margin-top: 15px; font-size: 11px; opacity: 0.6;">
                    Step 1 of 1
                </div>
                <div id="tour-controls" style="margin-top: 15px; display: flex; gap: 8px; justify-content: center;">
                    <button id="tour-prev" style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">Previous</button>
                    <button id="tour-next" style="padding: 8px 16px; background: #4A90E2; border: none; border-radius: 6px; color: white; cursor: pointer;">Next</button>
                    <button id="tour-exit" style="padding: 8px 16px; background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 6px; color: white; cursor: pointer;">Exit</button>
                </div>
            </div>
            <div id="tour-selection" style="display: none;">
                <h3 style="margin: 0 0 15px 0; color: #4A90E2;">Select a Tour or Mission</h3>
                <div id="tour-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 15px;"></div>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button id="tour-close" style="padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">Close</button>
                </div>
            </div>
        `;

        this.tourOverlay.appendChild(tourPanel);
        document.body.appendChild(this.tourOverlay);

        // Create tour launcher button
        this.createTourLauncher();

        // Bind events
        this.bindTourEvents();
    }

    createTourLauncher() {
        const launcher = document.createElement('div');
        launcher.id = 'tour-launcher';
        launcher.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 150;
            display: flex;
            gap: 8px;
        `;

        launcher.innerHTML = `
            <button id="start-tour-btn" style="padding: 10px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                🚀 Tours & Missions
            </button>
            <button id="start-mission-btn" style="padding: 10px 16px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);">
                🎯 Missions
            </button>
        `;

        document.body.appendChild(launcher);

        document.getElementById('start-tour-btn').addEventListener('click', () => this.showTourSelection('tour'));
        document.getElementById('start-mission-btn').addEventListener('click', () => this.showTourSelection('mission'));
    }

    bindTourEvents() {
        // Tour controls
        document.getElementById('tour-prev')?.addEventListener('click', () => this.previousStep());
        document.getElementById('tour-next')?.addEventListener('click', () => this.nextStep());
        document.getElementById('tour-exit')?.addEventListener('click', () => this.exitTour());
        document.getElementById('tour-close')?.addEventListener('click', () => this.hideTourSelection());
    }

    showTourSelection(type) {
        const selectionDiv = document.getElementById('tour-selection');
        const contentDiv = document.getElementById('tour-content');
        const listDiv = document.getElementById('tour-list');
        
        selectionDiv.style.display = 'block';
        contentDiv.style.display = 'none';

        listDiv.innerHTML = '';

        const items = type === 'tour' ? this.tours : this.missions;
        const icon = type === 'tour' ? '🗺️' : '🎯';

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = `
                padding: 12px;
                margin: 8px 0;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            `;

            itemDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #4A90E2; margin-bottom: 4px;">${icon} ${item.name}</div>
                        <div style="font-size: 11px; opacity: 0.7; margin-bottom: 4px;">${item.description}</div>
                        <div style="font-size: 10px; opacity: 0.5;">⏱️ ${item.duration} • 📊 ${item.difficulty}</div>
                    </div>
                    <div style="padding: 4px 8px; background: rgba(74, 144, 226, 0.2); border-radius: 4px; font-size: 10px; color: #4A90E2;">Start</div>
                </div>
            `;

            itemDiv.addEventListener('mouseenter', () => {
                itemDiv.style.background = 'rgba(255,255,255,0.1)';
                itemDiv.style.borderColor = 'rgba(74, 144, 226, 0.5)';
            });

            itemDiv.addEventListener('mouseleave', () => {
                itemDiv.style.background = 'rgba(255,255,255,0.05)';
                itemDiv.style.borderColor = 'rgba(255,255,255,0.1)';
            });

            itemDiv.addEventListener('click', () => {
                if (type === 'tour') {
                    this.startTour(item);
                } else {
                    this.startMission(item);
                }
            });

            listDiv.appendChild(itemDiv);
        });

        this.tourOverlay.style.display = 'block';
    }

    hideTourSelection() {
        this.tourOverlay.style.display = 'none';
        document.getElementById('tour-selection').style.display = 'none';
        document.getElementById('tour-content').style.display = 'block';
    }

    startTour(tour) {
        this.currentTour = tour;
        this.currentStep = 0;
        this.isActive = true;

        // Show tour UI
        this.tourOverlay.style.display = 'block';
        document.getElementById('tour-selection').style.display = 'none';
        document.getElementById('tour-content').style.display = 'block';

        // Update UI
        document.getElementById('tour-title').textContent = tour.name;
        document.getElementById('tour-description').textContent = tour.description;

        this.updateTourStep();
    }

    startMission(mission) {
        // For missions, we'll show objectives and track progress
        this.currentTour = mission;
        this.isActive = true;

        this.tourOverlay.style.display = 'block';
        document.getElementById('tour-selection').style.display = 'none';
        document.getElementById('tour-content').style.display = 'block';

        document.getElementById('tour-title').textContent = `🎯 ${mission.name}`;
        document.getElementById('tour-description').textContent = mission.description;

        const narrationDiv = document.getElementById('tour-narration');
        const factsDiv = document.getElementById('tour-facts');
        const progressDiv = document.getElementById('tour-progress');

        narrationDiv.innerHTML = `
            <strong>Mission Objectives:</strong><br>
            ${mission.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('<br>')}
        `;

        factsDiv.innerHTML = `
            <div style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                <strong>Mission Parameters:</strong><br>
                Duration: ${mission.duration}<br>
                Difficulty: ${mission.difficulty}<br>
                Status: <span style="color: #4ECDC4;">Ready to Launch</span>
            </div>
        `;

        progressDiv.textContent = 'Mission Ready - Click Next to Begin';

        // Hide navigation buttons for mission overview
        document.getElementById('tour-prev').style.display = 'none';
        document.getElementById('tour-next').textContent = 'Launch Mission';
    }

    updateTourStep() {
        if (!this.currentTour || !this.currentTour.steps) return;

        const step = this.currentTour.steps[this.currentStep];
        const narrationDiv = document.getElementById('tour-narration');
        const factsDiv = document.getElementById('tour-facts');
        const progressDiv = document.getElementById('tour-progress');

        // Update narration
        narrationDiv.innerHTML = `<em>"${step.narration}"</em>`;

        // Update facts
        if (step.facts && step.facts.length > 0) {
            factsDiv.innerHTML = `
                <div style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                    <strong>Key Facts:</strong><br>
                    ${step.facts.map(fact => `• ${fact}`).join('<br>')}
                </div>
            `;
        } else {
            factsDiv.innerHTML = '';
        }

        // Update progress
        progressDiv.textContent = `Step ${this.currentStep + 1} of ${this.currentTour.steps.length}`;

        // Update button states
        document.getElementById('tour-prev').style.display = this.currentStep === 0 ? 'none' : 'block';
        document.getElementById('tour-next').textContent = this.currentStep === this.currentTour.steps.length - 1 ? 'Finish' : 'Next';

        // Execute step action
        this.executeStepAction(step);
    }

    executeStepAction(step) {
        if (!step.target) return;

        const planet = this.solarSystem.planets[step.target];
        if (!planet) return;

        // Focus on target
        if (step.action === 'focus') {
            this.animateCameraToTarget(planet.mesh, step.duration);
        } else if (step.action === 'showInfo') {
            this.solarSystem.showPlanetInfo(planet.mesh.userData);
        }

        // Add visual feedback
        this.highlightTarget(planet.mesh);
    }

    animateCameraToTarget(targetMesh, duration) {
        const targetPos = targetMesh.position.clone();
        const distance = targetMesh.userData.radius ? targetMesh.userData.radius * 4 : 100;
        
        const cameraPos = targetPos.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));

        // Use existing camera animation from main.js
        if (window.app && window.app.animateCamera) {
            window.app.animateCamera(cameraPos, targetPos);
        }
    }

    highlightTarget(mesh) {
        // Create temporary highlight effect
        const originalScale = mesh.scale.clone();
        const highlightMaterial = mesh.material.clone();
        
        if (highlightMaterial.emissive) {
            highlightMaterial.emissive.setHex(0x4A90E2);
            highlightMaterial.emissiveIntensity = 0.5;
        }

        mesh.material = highlightMaterial;
        mesh.scale.multiplyScalar(1.1);

        setTimeout(() => {
            mesh.material = mesh.userData.originalMaterial || mesh.material;
            mesh.scale.copy(originalScale);
        }, 2000);
    }

    nextStep() {
        if (!this.currentTour) return;

        // Handle mission completion
        if (!this.currentTour.steps && this.currentTour.objectives) {
            this.completeMission();
            return;
        }

        if (this.currentStep < this.currentTour.steps.length - 1) {
            this.currentStep++;
            this.updateTourStep();
        } else {
            this.completeTour();
        }
    }

    previousStep() {
        if (!this.currentTour || !this.currentTour.steps) return;
        
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateTourStep();
        }
    }

    completeTour() {
        const narrationDiv = document.getElementById('tour-narration');
        const factsDiv = document.getElementById('tour-facts');
        const progressDiv = document.getElementById('tour-progress');

        narrationDiv.innerHTML = `<strong style="color: #4ECDC4;">🎉 Tour Complete!</strong><br><br>Thank you for exploring our solar system. You can start another tour or continue exploring on your own.`;
        
        factsDiv.innerHTML = `
            <div style="margin-top: 15px; padding: 12px; background: rgba(78, 205, 196, 0.1); border: 1px solid rgba(78, 205, 196, 0.3); border-radius: 8px;">
                <strong>What you've learned:</strong><br>
                • Planetary characteristics and features<br>
                • Orbital mechanics and relationships<br>
                • Unique properties of each world<br>
                • Future exploration possibilities
            </div>
        `;

        progressDiv.textContent = 'Tour Completed';
        document.getElementById('tour-next').textContent = 'Close';
        document.getElementById('tour-next').onclick = () => this.exitTour();
    }

    completeMission() {
        const narrationDiv = document.getElementById('tour-narration');
        const factsDiv = document.getElementById('tour-facts');
        const progressDiv = document.getElementById('tour-progress');

        narrationDiv.innerHTML = `<strong style="color: #f5576c;">🚀 Mission Complete!</strong><br><br>Congratulations! You've successfully completed the mission objectives.`;
        
        factsDiv.innerHTML = `
            <div style="margin-top: 15px; padding: 12px; background: rgba(245, 87, 108, 0.1); border: 1px solid rgba(245, 87, 108, 0.3); border-radius: 8px;">
                <strong>Mission Summary:</strong><br>
                • All objectives completed<br>
                • Data collected successfully<br>
                • Mission parameters achieved<br>
                • Ready for next assignment
            </div>
        `;

        progressDiv.textContent = 'Mission Accomplished';
        document.getElementById('tour-next').textContent = 'Close';
        document.getElementById('tour-next').onclick = () => this.exitTour();
    }

    exitTour() {
        this.isActive = false;
        this.currentTour = null;
        this.currentStep = 0;
        
        this.tourOverlay.style.display = 'none';
        
        // Reset button
        document.getElementById('tour-next').textContent = 'Next';
        document.getElementById('tour-next').onclick = () => this.nextStep();
        document.getElementById('tour-prev').style.display = 'block';
    }

    // Auto-play feature for hands-free tours
    startAutoPlay(tour) {
        this.startTour(tour);
        this.autoPlayInterval = setInterval(() => {
            if (this.currentStep < this.currentTour.steps.length - 1) {
                this.nextStep();
            } else {
                this.stopAutoPlay();
            }
        }, 5000); // 5 seconds per step
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Get available tours
    getTours() {
        return this.tours;
    }

    getMissions() {
        return this.missions;
    }

    // Add custom tour (for future extensibility)
    addCustomTour(tourData) {
        if (tourData && tourData.name && tourData.steps) {
            tourData.id = 'custom-' + Date.now();
            this.tours.push(tourData);
            return tourData.id;
        }
        return null;
    }
}