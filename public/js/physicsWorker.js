// Web Worker for Physics Calculations
// This runs in a separate thread to avoid blocking the main thread

let planets = [];
let time = 0;
let timeSpeed = 1;

// Listen for messages from main thread
self.onmessage = function(e) {
    const { type, data } = e.data;
    
    switch(type) {
        case 'init':
            init(data);
            break;
        case 'update':
            update(data.delta, data.timeSpeed);
            break;
        case 'addPlanet':
            addPlanet(data);
            break;
        case 'removePlanet':
            removePlanet(data);
            break;
        case 'setTimeSpeed':
            timeSpeed = data;
            break;
        case 'calculateOrbitalPosition':
            const position = calculateOrbitalPosition(data);
            self.postMessage({ type: 'orbitalPosition', data: position });
            break;
        case 'calculateLagrangePoints':
            const lagrangePoints = calculateLagrangePoints(data);
            self.postMessage({ type: 'lagrangePoints', data: lagrangePoints });
            break;
        case 'calculateResonance':
            const resonance = calculateResonance(data);
            self.postMessage({ type: 'resonance', data: resonance });
            break;
    }
};

function init(data) {
    planets = data.planets || [];
    time = data.initialTime || 0;
    timeSpeed = data.timeSpeed || 1;
    
    self.postMessage({ 
        type: 'ready', 
        data: { 
            message: 'Physics worker initialized',
            planetCount: planets.length 
        } 
    });
}

function update(delta, newTimeSpeed) {
    if (newTimeSpeed !== undefined) {
        timeSpeed = newTimeSpeed;
    }
    
    time += delta * timeSpeed;
    
    // Update all planet positions using simplified Kepler's laws
    const updates = planets.map(planet => {
        if (planet.name === 'sun') {
            return { name: planet.name, position: { x: 0, y: 0, z: 0 } };
        }
        
        // Calculate orbital position
        const angle = planet.angle + (planet.speed / planet.distance) * delta * 0.1 * timeSpeed;
        const x = Math.cos(angle) * planet.distance;
        const z = Math.sin(angle) * planet.distance;
        
        // Store updated angle
        planet.angle = angle;
        
        return {
            name: planet.name,
            position: { x, y: 0, z },
            rotation: planet.rotation || 0
        };
    });
    
    // Update moons
    const moonUpdates = [];
    planets.forEach(planet => {
        if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach(moon => {
                moon.angle = (moon.angle || 0) + moon.speed * delta * 0.1 * timeSpeed;
                const x = Math.cos(moon.angle) * moon.distance;
                const z = Math.sin(moon.angle) * moon.distance;
                
                moonUpdates.push({
                    planet: planet.name,
                    moon: moon.name,
                    position: { x, y: 0, z }
                });
            });
        }
    });
    
    self.postMessage({
        type: 'update',
        data: {
            planets: updates,
            moons: moonUpdates,
            time: time
        }
    });
}

function addPlanet(planetData) {
    planets.push(planetData);
    self.postMessage({ 
        type: 'planetAdded', 
        data: { name: planetData.name, totalPlanets: planets.length } 
    });
}

function removePlanet(planetName) {
    planets = planets.filter(p => p.name !== planetName);
    self.postMessage({ 
        type: 'planetRemoved', 
        data: { name: planetName, totalPlanets: planets.length } 
    });
}

function calculateOrbitalPosition(data) {
    const { distance, speed, angle, delta } = data;
    const newAngle = angle + (speed / distance) * delta * 0.1 * timeSpeed;
    const x = Math.cos(newAngle) * distance;
    const z = Math.sin(newAngle) * distance;
    
    return {
        angle: newAngle,
        position: { x, y: 0, z }
    };
}

function calculateLagrangePoints(data) {
    const { p1, p2 } = data;
    
    // Calculate positions
    const p1Pos = p1.position;
    const p2Pos = p2.position;
    
    const distance = Math.sqrt(
        Math.pow(p2Pos.x - p1Pos.x, 2) + 
        Math.pow(p2Pos.z - p1Pos.z, 2)
    );
    
    const dx = (p2Pos.x - p1Pos.x) / distance;
    const dz = (p2Pos.z - p1Pos.z) / distance;
    
    // L1: Between the two bodies
    const l1 = {
        x: p1Pos.x + dx * distance * 0.3,
        z: p1Pos.z + dz * distance * 0.3
    };
    
    // L2: Beyond the smaller body
    const l2 = {
        x: p2Pos.x + dx * distance * 0.1,
        z: p2Pos.z + dz * distance * 0.1
    };
    
    // L3: Opposite side of larger body
    const l3 = {
        x: p1Pos.x - dx * distance * 0.5,
        z: p1Pos.z - dz * distance * 0.5
    };
    
    // L4 & L5: 60 degrees ahead and behind
    const perpX = -dz;
    const perpZ = dx;
    
    const l4 = {
        x: p1Pos.x + dx * distance * 0.5 + perpX * distance * 0.866,
        z: p1Pos.z + dz * distance * 0.5 + perpZ * distance * 0.866
    };
    
    const l5 = {
        x: p1Pos.x + dx * distance * 0.5 - perpX * distance * 0.866,
        z: p1Pos.z + dz * distance * 0.5 - perpZ * distance * 0.866
    };
    
    return { l1, l2, l3, l4, l5 };
}

function calculateResonance(data) {
    const { p1, p2 } = data;
    
    // Calculate orbital period ratio
    const period1 = (2 * Math.PI * p1.distance) / p1.speed;
    const period2 = (2 * Math.PI * p2.distance) / p2.speed;
    const ratio = period1 / period2;
    
    // Find closest simple ratio
    const simpleRatios = [
        { ratio: 1/2, label: '2:1' },
        { ratio: 2/3, label: '3:2' },
        { ratio: 3/4, label: '4:3' },
        { ratio: 1/1, label: '1:1' },
        { ratio: 3/5, label: '5:3' }
    ];
    
    let closest = simpleRatios[0];
    let minDiff = Math.abs(ratio - closest.ratio);
    
    for (let sr of simpleRatios) {
        const diff = Math.abs(ratio - sr.ratio);
        if (diff < minDiff) {
            minDiff = diff;
            closest = sr;
        }
    }
    
    return {
        ratio: ratio,
        simpleRatio: closest.label,
        isResonant: minDiff < 0.1,
        period1: period1,
        period2: period2
    };
}

// Performance monitoring
let lastPerformanceUpdate = Date.now();
let frameCount = 0;

function monitorPerformance() {
    frameCount++;
    const now = Date.now();
    const elapsed = now - lastPerformanceUpdate;
    
    if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        
        self.postMessage({
            type: 'performance',
            data: {
                fps: fps,
                workerLoad: (fps / 60) * 100,
                timestamp: now
            }
        });
        
        frameCount = 0;
        lastPerformanceUpdate = now;
    }
}

// Add performance monitoring to update loop
const originalUpdate = update;
update = function(delta, timeSpeed) {
    originalUpdate(delta, timeSpeed);
    monitorPerformance();
};

// Error handling
self.onerror = function(error) {
    self.postMessage({
        type: 'error',
        data: {
            message: error.message,
            stack: error.stack
        }
    });
};

// Handle unhandled promises
self.onunhandledrejection = function(event) {
    self.postMessage({
        type: 'error',
        data: {
            message: 'Unhandled promise rejection',
            reason: event.reason
        }
    });
};