// LOD (Level of Detail) System for Performance Optimization
export class LODSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.lodObjects = new Map();
        this.updateInterval = 0.1; // Update every 100ms
        this.lastUpdateTime = 0;
        
        // Distance thresholds for different LOD levels
        this.lodLevels = {
            high: { distance: 0, segments: 128, textureSize: 2048 },
            medium: { distance: 1000, segments: 64, textureSize: 1024 },
            low: { distance: 2500, segments: 32, textureSize: 512 },
            ultraLow: { distance: 5000, segments: 16, textureSize: 256 }
        };
    }

    // Register an object for LOD management
    registerObject(name, mesh, data, updateCallback) {
        this.lodObjects.set(name, {
            mesh: mesh,
            data: data,
            updateCallback: updateCallback,
            currentLOD: 'high',
            distance: 0,
            visible: true
        });
    }

    // Update LOD based on camera distance
    update(delta, time) {
        this.lastUpdateTime += delta;
        
        // Only update periodically for performance
        if (this.lastUpdateTime < this.updateInterval) return;
        this.lastUpdateTime = 0;

        this.lodObjects.forEach((lodObj, name) => {
            if (!lodObj.mesh || !lodObj.mesh.visible) return;

            // Calculate distance from camera
            const distance = this.camera.position.distanceTo(lodObj.mesh.position);
            lodObj.distance = distance;

            // Determine appropriate LOD level
            let newLOD = 'high';
            if (distance > this.lodLevels.ultraLow.distance) {
                newLOD = 'ultraLow';
            } else if (distance > this.lodLevels.low.distance) {
                newLOD = 'low';
            } else if (distance > this.lodLevels.medium.distance) {
                newLOD = 'medium';
            } else {
                newLOD = 'high';
            }

            // Only update if LOD changed
            if (newLOD !== lodObj.currentLOD) {
                this.applyLOD(name, newLOD);
            }

            // Update visibility based on distance
            this.updateVisibility(lodObj, distance);
        });
    }

    applyLOD(name, lodLevel) {
        const lodObj = this.lodObjects.get(name);
        if (!lodObj) return;

        const oldLOD = lodObj.currentLOD;
        lodObj.currentLOD = lodLevel;

        // Update geometry detail
        if (lodObj.updateCallback) {
            lodObj.updateCallback(lodLevel, lodObj);
        }

        // Log LOD changes (useful for debugging)
        if (window.app && window.app.debug) {
            console.log(`LOD: ${name} switched from ${oldLOD} to ${lodLevel}`);
        }
    }

    updateVisibility(lodObj, distance) {
        // Hide objects that are very far away to save performance
        const maxDistance = 8000;
        
        if (distance > maxDistance) {
            if (lodObj.mesh.visible) {
                lodObj.mesh.visible = false;
                lodObj.visible = false;
            }
        } else {
            if (!lodObj.visible) {
                lodObj.mesh.visible = true;
                lodObj.visible = true;
            }
        }
    }

    // Get current performance metrics
    getMetrics() {
        let visibleCount = 0;
        let totalDistance = 0;
        
        this.lodObjects.forEach(lodObj => {
            if (lodObj.visible) {
                visibleCount++;
                totalDistance += lodObj.distance;
            }
        });

        return {
            totalObjects: this.lodObjects.size,
            visibleObjects: visibleCount,
            avgDistance: visibleCount > 0 ? totalDistance / visibleCount : 0,
            lodLevels: Array.from(this.lodObjects.values()).reduce((acc, obj) => {
                acc[obj.currentLOD] = (acc[obj.currentLOD] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Clean up resources
    dispose() {
        this.lodObjects.clear();
    }
}