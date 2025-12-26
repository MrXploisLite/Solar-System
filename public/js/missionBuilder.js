// Custom Mission Builder - Allows users to create their own missions
export class MissionBuilder {
    constructor(solarSystem, guidedTours) {
        this.solarSystem = solarSystem;
        this.guidedTours = guidedTours;
        this.customMissions = [];
        this.currentMission = null;
        this.ui = null;
        
        this.loadCustomMissions();
    }

    // Create the mission builder UI
    createUI() {
        if (this.ui) return;

        // Main container
        this.ui = document.createElement('div');
        this.ui.id = 'mission-builder-ui';
        this.ui.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            max-width: 90%;
            max-height: 80vh;
            background: rgba(15, 20, 35, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            color: white;
            font-family: 'Inter', sans-serif;
            z-index: 3000;
            display: none;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
        `;

        this.ui.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                <h2 style="margin: 0; color: #4A90E2;">🚀 Custom Mission Builder</h2>
                <button id="close-mission-builder" style="background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 6px; color: white; padding: 6px 12px; cursor: pointer;">Close</button>
            </div>

            <div id="mission-builder-tabs" style="display: flex; gap: 8px; margin-bottom: 15px;">
                <button id="tab-create" style="flex: 1; padding: 8px; background: #4A90E2; border: none; border-radius: 6px; color: white; cursor: pointer;">Create Mission</button>
                <button id="tab-my-missions" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); border: none; border-radius: 6px; color: white; cursor: pointer;">My Missions</button>
                <button id="tab-import-export" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.1); border: none; border-radius: 6px; color: white; cursor: pointer;">Import/Export</button>
            </div>

            <div id="mission-builder-content">
                <!-- Content will be dynamically loaded -->
            </div>
        `;

        document.body.appendChild(this.ui);

        // Bind events
        document.getElementById('close-mission-builder').addEventListener('click', () => this.hide());
        document.getElementById('tab-create').addEventListener('click', () => this.showCreateTab());
        document.getElementById('tab-my-missions').addEventListener('click', () => this.showMyMissionsTab());
        document.getElementById('tab-import-export').addEventListener('click', () => this.showImportExportTab());

        // Show create tab by default
        this.showCreateTab();
    }

    showCreateTab() {
        const content = document.getElementById('mission-builder-content');
        const availablePlanets = this.getAvailablePlanets();
        
        content.innerHTML = `
            <div style="display: grid; gap: 12px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; opacity: 0.8;">Mission Name</label>
                    <input id="mission-name" type="text" placeholder="e.g., Explore the Outer Planets" 
                        style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white;">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; opacity: 0.8;">Mission Description</label>
                    <textarea id="mission-description" placeholder="Describe the purpose and goals of this mission..." 
                        style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; min-height: 60px; resize: vertical;"></textarea>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; opacity: 0.8;">Difficulty</label>
                    <select id="mission-difficulty" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white;">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-size: 12px; opacity: 0.8;">Estimated Duration (minutes)</label>
                    <input id="mission-duration" type="number" value="10" min="1" max="60" 
                        style="width: 100%; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white;">
                </div>

                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Mission Steps</h3>
                    <div id="steps-container"></div>
                    <button id="add-step-btn" style="margin-top: 10px; padding: 8px 12px; background: rgba(74, 144, 226, 0.2); border: 1px solid #4A90E2; border-radius: 6px; color: #4A90E2; cursor: pointer;">+ Add Step</button>
                </div>

                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; display: flex; gap: 10px;">
                    <button id="save-mission-btn" style="flex: 1; padding: 10px; background: #4A90E2; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer;">Save Mission</button>
                    <button id="test-mission-btn" style="flex: 1; padding: 10px; background: rgba(74, 144, 226, 0.2); border: 1px solid #4A90E2; border-radius: 6px; color: #4A90E2; cursor: pointer;">Test Mission</button>
                </div>
            </div>
        `;

        // Add step functionality
        document.getElementById('add-step-btn').addEventListener('click', () => this.addStep());
        document.getElementById('save-mission-btn').addEventListener('click', () => this.saveMission());
        document.getElementById('test-mission-btn').addEventListener('click', () => this.testMission());

        // Add initial step
        this.addStep();
    }

    showMyMissionsTab() {
        const content = document.getElementById('mission-builder-content');
        
        if (this.customMissions.length === 0) {
            content.innerHTML = `
                <div style="text-align: center; padding: 40px; opacity: 0.6;">
                    <p>No custom missions created yet.</p>
                    <p style="font-size: 12px; margin-top: 10px;">Create your first mission in the "Create Mission" tab!</p>
                </div>
            `;
            return;
        }

        let missionsHTML = '<div style="display: grid; gap: 10px;">';
        
        this.customMissions.forEach((mission, index) => {
            missionsHTML += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: #4A90E2; margin-bottom: 4px;">${mission.name}</div>
                            <div style="font-size: 11px; opacity: 0.7; margin-bottom: 6px;">${mission.description}</div>
                            <div style="font-size: 10px; opacity: 0.5;">
                                ${mission.difficulty} • ${mission.duration} min • ${mission.steps.length} steps
                            </div>
                        </div>
                        <div style="display: flex; gap: 5px;">
                            <button onclick="window.missionBuilder.playMission(${index})" style="padding: 4px 8px; background: #4A90E2; border: none; border-radius: 4px; color: white; cursor: pointer; font-size: 11px;">Play</button>
                            <button onclick="window.missionBuilder.editMission(${index})" style="padding: 4px 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; cursor: pointer; font-size: 11px;">Edit</button>
                            <button onclick="window.missionBuilder.deleteMission(${index})" style="padding: 4px 8px; background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 4px; color: white; cursor: pointer; font-size: 11px;">Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        missionsHTML += '</div>';
        content.innerHTML = missionsHTML;
    }

    showImportExportTab() {
        const content = document.getElementById('mission-builder-content');
        
        content.innerHTML = `
            <div style="display: grid; gap: 15px;">
                <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Export Missions</h3>
                    <p style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">Download all your custom missions as a JSON file to share or backup.</p>
                    <button id="export-btn" style="width: 100%; padding: 10px; background: #38ef7d; border: none; border-radius: 6px; color: #0a0f19; font-weight: 600; cursor: pointer;">Export All Missions</button>
                </div>

                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Import Missions</h3>
                    <p style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">Import missions from a JSON file created by the export function.</p>
                    <input type="file" id="import-file" accept=".json" style="display: none;">
                    <button id="import-btn" style="width: 100%; padding: 10px; background: rgba(74, 144, 226, 0.2); border: 1px solid #4A90E2; border-radius: 6px; color: #4A90E2; font-weight: 600; cursor: pointer;">Choose File to Import</button>
                    <div id="import-status" style="margin-top: 10px; font-size: 12px; text-align: center;"></div>
                </div>

                <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Mission Sharing</h3>
                    <p style="font-size: 12px; opacity: 0.7; margin-bottom: 10px;">Share your missions with others by copying the JSON below:</p>
                    <textarea id="share-textarea" readonly style="width: 100%; height: 100px; padding: 8px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: #4A90E2; font-family: monospace; font-size: 10px; resize: vertical;"></textarea>
                    <button id="copy-share-btn" style="width: 100%; margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: white; cursor: pointer;">Copy to Clipboard</button>
                </div>
            </div>
        `;

        // Bind events
        document.getElementById('export-btn').addEventListener('click', () => this.exportMissions());
        document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
        document.getElementById('import-file').addEventListener('change', (e) => this.importMissions(e));
        document.getElementById('copy-share-btn').addEventListener('click', () => this.copyShareData());

        // Update share textarea
        this.updateShareData();
    }

    addStep() {
        const container = document.getElementById('steps-container');
        const stepIndex = container.children.length;
        
        const stepDiv = document.createElement('div');
        stepDiv.style.cssText = 'background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.1);';
        
        const availablePlanets = this.getAvailablePlanets();
        
        stepDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: #4A90E2;">Step ${stepIndex + 1}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 4px; color: white; padding: 2px 6px; cursor: pointer; font-size: 10px;">Remove</button>
            </div>
            
            <div style="display: grid; gap: 6px;">
                <select class="step-target" style="padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 12px;">
                    <option value="">Select Target...</option>
                    ${availablePlanets.map(p => `<option value="${p}">${p}</option>`).join('')}
                </select>
                
                <select class="step-action" style="padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 12px;">
                    <option value="focus">Focus on Target</option>
                    <option value="showInfo">Show Information</option>
                    <option value="wait">Wait (observe)</option>
                </select>
                
                <input type="number" class="step-duration" value="3000" min="1000" step="500" placeholder="Duration (ms)" 
                    style="padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 12px;">
                
                <textarea class="step-narration" placeholder="Narration text for this step..." 
                    style="padding: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: white; font-size: 12px; min-height: 40px; resize: vertical;"></textarea>
            </div>
        `;
        
        container.appendChild(stepDiv);
    }

    saveMission() {
        const name = document.getElementById('mission-name').value.trim();
        const description = document.getElementById('mission-description').value.trim();
        const difficulty = document.getElementById('mission-difficulty').value;
        const duration = parseInt(document.getElementById('mission-duration').value);

        if (!name) {
            alert('Please enter a mission name');
            return;
        }

        // Collect steps
        const steps = [];
        const stepElements = document.querySelectorAll('#steps-container > div');
        
        stepElements.forEach(stepEl => {
            const target = stepEl.querySelector('.step-target').value;
            const action = stepEl.querySelector('.step-action').value;
            const duration = parseInt(stepEl.querySelector('.step-duration').value);
            const narration = stepEl.querySelector('.step-narration').value.trim();

            if (target && narration) {
                steps.push({ target, action, duration, narration });
            }
        });

        if (steps.length === 0) {
            alert('Please add at least one step with a target and narration');
            return;
        }

        const mission = {
            id: Date.now(),
            name,
            description,
            difficulty,
            duration,
            steps,
            created: new Date().toISOString()
        };

        this.customMissions.push(mission);
        this.saveCustomMissions();
        
        // Reset form
        document.getElementById('mission-name').value = '';
        document.getElementById('mission-description').value = '';
        document.getElementById('steps-container').innerHTML = '';
        this.addStep();

        alert('✅ Mission saved successfully!');
        this.showMyMissionsTab();
    }

    testMission() {
        const name = document.getElementById('mission-name').value.trim();
        const description = document.getElementById('mission-description').value.trim();
        const difficulty = document.getElementById('mission-difficulty').value;
        const duration = parseInt(document.getElementById('mission-duration').value);

        const steps = [];
        const stepElements = document.querySelectorAll('#steps-container > div');
        
        stepElements.forEach(stepEl => {
            const target = stepEl.querySelector('.step-target').value;
            const action = stepEl.querySelector('.step-action').value;
            const duration = parseInt(stepEl.querySelector('.step-duration').value);
            const narration = stepEl.querySelector('.step-narration').value.trim();

            if (target && narration) {
                steps.push({ target, action, duration, narration });
            }
        });

        if (steps.length === 0) {
            alert('Please add at least one step to test');
            return;
        }

        const testMission = {
            name: name || 'Test Mission',
            description: description || 'Test mission',
            difficulty,
            duration,
            steps
        };

        // Use guided tours system to play the mission
        if (this.guidedTours) {
            // Convert to tour format
            const tour = {
                id: 'test-' + Date.now(),
                name: testMission.name,
                description: testMission.description,
                steps: testMission.steps.map(step => ({
                    target: step.target,
                    action: step.action,
                    duration: step.duration,
                    narration: step.narration,
                    facts: []
                }))
            };

            this.hide();
            this.guidedTours.startTour(tour);
        }
    }

    playMission(index) {
        const mission = this.customMissions[index];
        if (!mission) return;

        // Convert to tour format for guided tours system
        const tour = {
            id: 'custom-' + mission.id,
            name: mission.name,
            description: mission.description,
            steps: mission.steps.map(step => ({
                target: step.target,
                action: step.action,
                duration: step.duration,
                narration: step.narration,
                facts: []
            }))
        };

        this.hide();
        this.guidedTours.startTour(tour);
    }

    editMission(index) {
        const mission = this.customMissions[index];
        if (!mission) return;

        // Switch to create tab and populate form
        this.showCreateTab();

        document.getElementById('mission-name').value = mission.name;
        document.getElementById('mission-description').value = mission.description;
        document.getElementById('mission-difficulty').value = mission.difficulty;
        document.getElementById('mission-duration').value = mission.duration;

        // Clear existing steps and add mission steps
        const container = document.getElementById('steps-container');
        container.innerHTML = '';

        mission.steps.forEach(step => {
            this.addStep();
            const stepEl = container.lastElementChild;
            stepEl.querySelector('.step-target').value = step.target;
            stepEl.querySelector('.step-action').value = step.action;
            stepEl.querySelector('.step-duration').value = step.duration;
            stepEl.querySelector('.step-narration').value = step.narration;
        });

        // Remove the original mission (will be re-saved)
        this.customMissions.splice(index, 1);
        this.saveCustomMissions();
    }

    deleteMission(index) {
        if (confirm('Are you sure you want to delete this mission?')) {
            this.customMissions.splice(index, 1);
            this.saveCustomMissions();
            this.showMyMissionsTab();
        }
    }

    exportMissions() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            missions: this.customMissions
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar-system-missions-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    importMissions(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.missions || !Array.isArray(data.missions)) {
                    throw new Error('Invalid mission file format');
                }

                // Validate and add missions
                let imported = 0;
                data.missions.forEach(mission => {
                    if (mission.name && mission.steps && Array.isArray(mission.steps)) {
                        // Add unique ID if not present
                        if (!mission.id) mission.id = Date.now() + Math.random();
                        this.customMissions.push(mission);
                        imported++;
                    }
                });

                this.saveCustomMissions();
                
                const status = document.getElementById('import-status');
                status.textContent = `✅ Successfully imported ${imported} missions`;
                status.style.color = '#38ef7d';

                // Update share data
                this.updateShareData();

            } catch (error) {
                const status = document.getElementById('import-status');
                status.textContent = `❌ Error: ${error.message}`;
                status.style.color = '#F38181';
            }
        };

        reader.readAsText(file);
    }

    updateShareData() {
        const textarea = document.getElementById('share-textarea');
        if (!textarea) return;

        if (this.customMissions.length === 0) {
            textarea.value = 'No missions to share. Create some missions first!';
            return;
        }

        const shareData = {
            version: '1.0',
            missions: this.customMissions
        };

        textarea.value = JSON.stringify(shareData, null, 2);
    }

    copyShareData() {
        const textarea = document.getElementById('share-textarea');
        if (!textarea || !textarea.value) return;

        textarea.select();
        document.execCommand('copy');

        const btn = document.getElementById('copy-share-btn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }

    getAvailablePlanets() {
        if (!this.solarSystem || !this.solarSystem.planets) return [];
        return Object.keys(this.solarSystem.planets).filter(name => name !== 'sun');
    }

    saveCustomMissions() {
        localStorage.setItem('solarSystemCustomMissions', JSON.stringify(this.customMissions));
    }

    loadCustomMissions() {
        const saved = localStorage.getItem('solarSystemCustomMissions');
        if (saved) {
            try {
                this.customMissions = JSON.parse(saved);
            } catch (error) {
                console.warn('Failed to load custom missions:', error);
                this.customMissions = [];
            }
        }
    }

    show() {
        if (!this.ui) this.createUI();
        this.ui.style.display = 'block';
    }

    hide() {
        if (this.ui) {
            this.ui.style.display = 'none';
        }
    }

    toggle() {
        if (!this.ui || this.ui.style.display === 'none') {
            this.show();
        } else {
            this.hide();
        }
    }
}