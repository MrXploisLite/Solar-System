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
                        duration: 2000,
                        narration: 'Mercury is the smallest and innermost planet. Despite being closest to the Sun, it is not the hottest planet.',
                        facts: [
                            'Orbit: 88 Earth days',
                            'Extreme temperature swings',
                            'Iron-rich core'
                        ]
                    },
                    {
                        target: 'venus',
                        action: 'focus',
                        duration: 2000,
                        narration: 'Venus is the hottest planet in our solar system, with surface temperatures hot enough to melt lead due to a runaway greenhouse effect.',
                        facts: [
                            'Rotates backwards (retrograde)',
                            'Atmospheric pressure 92x Earth',
                            'Thick sulfuric acid clouds'
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
                        narration: 'Jupiter is the largest planet in our solar system. It is a gas giant primarily composed of hydrogen and helium.',
                        facts: [
                            'Great Red Spot is a 400-year storm',
                            '79+ moons',
                            'Powerful magnetic field'
                        ]
                    },
                    {
                        target: 'saturn',
                        action: 'focus',
                        duration: 3000,
                        narration: 'Saturn is most famous for its spectacular ring system, which is made mostly of ice and rock particles.',
                        facts: [
                            'Least dense planet (could float in water)',
                            'Enceladus has water geysers',
                            'Titan has liquid methane lakes'
                        ]
                    },
                    {
                        target: 'uranus',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Uranus is an ice giant that rotates on its side, making it unique among planets.',
                        facts: [
                            'Coldest planetary atmosphere',
                            'Faint ring system',
                            'Discovered in 1781'
                        ]
                    },
                    {
                        target: 'neptune',
                        action: 'focus',
                        duration: 2500,
                        narration: 'Neptune is the most distant major planet and has the strongest winds in the solar system.',
                        facts: [
                            '165 Earth years to orbit Sun',
                            'Deep blue color from methane',
                            'Triton moon orbits backwards'
                        ]
                    }
                ]
            },
            {
                id: 'inner-planets',
                name: 'Inner Rocky Worlds',
                description: 'Explore the terrestrial planets close to the Sun',
                duration: '8 minutes',
                difficulty: 'Intermediate',
                steps: [
                    {
                        target: 'mercury',
                        action: 'focus',
                        narration: 'The innermost planet, Mercury, is a world of extremes.'
                    },
                    {
                        target: 'venus',
                        action: 'focus',
                        narration: 'Venus, often called Earth\'s twin, but with a deadly atmosphere.'
                    },
                    {
                        target: 'earth',
                        action: 'focus',
                        narration: 'Earth, the cradle of life.'
                    },
                    {
                        target: 'mars',
                        action: 'focus',
                        narration: 'Mars, the frontier of human exploration.'
                    }
                ]
            },
            {
                id: 'gas-giants',
                name: 'The Outer Giants',
                description: 'Journey to the massive gas and ice giants',
                duration: '10 minutes',
                difficulty: 'Intermediate',
                steps: [
                    {
                        target: 'jupiter',
                        action: 'focus',
                        narration: 'The king of planets, Jupiter.'
                    },
                    {
                        target: 'saturn',
                        action: 'focus',
                        narration: 'The ringed wonder, Saturn.'
                    },
                    {
                        target: 'uranus',
                        action: 'focus',
                        narration: 'The tilted ice giant, Uranus.'
                    },
                    {
                        target: 'neptune',
                        action: 'focus',
                        narration: 'The windy blue world, Neptune.'
                    }
                ]
            }
        ];
    }

    createTourUI() {
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
            backdrop-filter: blur(8px);
        `;

        const tourPanel = document.createElement('div');
        tourPanel.className = 'glass-panel';
        tourPanel.style.cssText = `
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            width: 600px;
            max-width: 90%;
            padding: 30px;
            color: white;
        `;

        tourPanel.innerHTML = `
            <div id="tour-content">
                <h2 id="tour-title" style="margin-bottom: 10px; font-family: 'Space Grotesk'; color: var(--primary-accent);">TOUR TITLE</h2>
                <div id="tour-narration" style="margin-bottom: 20px; font-size: 16px; line-height: 1.6;">Narration...</div>
                <div id="tour-controls" style="display: flex; gap: 10px; justify-content: center;">
                    <button id="tour-prev" class="secondary-btn">PREVIOUS</button>
                    <button id="tour-next" class="primary-btn">NEXT</button>
                    <button id="tour-exit" class="secondary-btn">EXIT</button>
                </div>
            </div>
        `;

        this.tourOverlay.appendChild(tourPanel);
        document.body.appendChild(this.tourOverlay);

        document.getElementById('tour-prev').onclick = () => this.previousStep();
        document.getElementById('tour-next').onclick = () => this.nextStep();
        document.getElementById('tour-exit').onclick = () => this.exitTour();
    }

    startTour(tour) {
        this.currentTour = tour;
        this.currentStep = 0;
        this.isActive = true;
        this.tourOverlay.style.display = 'block';
        this.updateTourStep();
    }

    updateTourStep() {
        if (!this.currentTour) return;
        const step = this.currentTour.steps[this.currentStep];

        document.getElementById('tour-title').textContent = this.currentTour.name.toUpperCase();
        document.getElementById('tour-narration').textContent = step.narration;
        document.getElementById('tour-prev').style.display = this.currentStep === 0 ? 'none' : 'block';
        document.getElementById('tour-next').textContent = this.currentStep === this.currentTour.steps.length - 1 ? 'FINISH' : 'NEXT';

        this.executeStepAction(step);
    }

    executeStepAction(step) {
        if (!step.target) return;
        const planet = this.solarSystem.planets[step.target];
        if (planet && window.app) {
            window.app.selectPlanet(step.target, planet.mesh);
            window.app.flyToPlanet(step.target, planet.mesh);
        }
    }

    nextStep() {
        if (this.currentStep < this.currentTour.steps.length - 1) {
            this.currentStep++;
            this.updateTourStep();
        } else {
            this.exitTour();
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateTourStep();
        }
    }

    exitTour() {
        this.isActive = false;
        this.tourOverlay.style.display = 'none';
    }
}
