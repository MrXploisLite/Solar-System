// Enhanced info panel manager for educational content
import { PLANET_EDUCATION, getHabitabilityColor, getHabitabilityLabel } from './planetEducation.js';
import { REAL_PLANET_DATA } from './planetData.js';

export class InfoPanelManager {
  constructor() {
    this.currentPanel = null;
    this.createPanelContainer();
  }

  createPanelContainer() {
    // Check if panel already exists
    if (document.getElementById('edu-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'edu-panel';
    panel.className = 'edu-panel hidden';
    panel.innerHTML = `
      <div class="edu-panel-header">
        <h2 id="edu-panel-title"></h2>
        <button id="edu-panel-close" class="close-btn">×</button>
      </div>
      <div class="edu-panel-tabs">
        <button class="tab-btn active" data-tab="overview">Overview</button>
        <button class="tab-btn" data-tab="missions">Missions</button>
        <button class="tab-btn" data-tab="habitability">Habitability</button>
        <button class="tab-btn" data-tab="comparison">vs Earth</button>
      </div>
      <div class="edu-panel-content" id="edu-panel-content"></div>
    `;
    document.body.appendChild(panel);

    // Setup event listeners
    document.getElementById('edu-panel-close').addEventListener('click', () => this.hide());
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.showTab(e.target.dataset.tab);
      });
    });
  }

  show(planetName) {
    const panel = document.getElementById('edu-panel');
    const education = PLANET_EDUCATION[planetName];
    const realData = REAL_PLANET_DATA[planetName];

    if (!education || !realData) return;

    this.currentPlanet = planetName;
    this.currentEducation = education;
    this.currentRealData = realData;

    document.getElementById('edu-panel-title').textContent = planetName.toUpperCase();
    
    // Reset to overview tab
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-tab="overview"]').classList.add('active');
    
    this.showTab('overview');
    panel.classList.remove('hidden');
  }

  hide() {
    document.getElementById('edu-panel').classList.add('hidden');
  }

  showTab(tabName) {
    const content = document.getElementById('edu-panel-content');
    
    switch(tabName) {
      case 'overview':
        content.innerHTML = this.renderOverview();
        break;
      case 'missions':
        content.innerHTML = this.renderMissions();
        break;
      case 'habitability':
        content.innerHTML = this.renderHabitability();
        break;
      case 'comparison':
        content.innerHTML = this.renderComparison();
        break;
    }
  }

  renderOverview() {
    const data = this.currentRealData;
    const edu = this.currentEducation;
    
    const tempC = (data.meanTemperature - 273.15).toFixed(0);
    const orbitalPeriodYears = (data.orbitalPeriod / 365.25).toFixed(2);
    const distanceAU = (data.semiMajorAxis / 149597870.7).toFixed(2);

    return `
      <div class="overview-section">
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-label">Distance from Sun</div>
            <div class="stat-value">${(data.semiMajorAxis / 1000000).toFixed(1)}M km</div>
            <div class="stat-sub">${distanceAU} AU</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Orbital Period</div>
            <div class="stat-value">${orbitalPeriodYears} years</div>
            <div class="stat-sub">${data.orbitalPeriod.toFixed(0)} days</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Radius</div>
            <div class="stat-value">${data.radius.toLocaleString()} km</div>
            <div class="stat-sub">${(data.radius / 6371).toFixed(2)}x Earth</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Gravity</div>
            <div class="stat-value">${data.surfaceGravity.toFixed(1)} m/s²</div>
            <div class="stat-sub">${(data.surfaceGravity / 9.807 * 100).toFixed(0)}% of Earth</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Temperature</div>
            <div class="stat-value">${tempC}°C</div>
            <div class="stat-sub">${data.meanTemperature}K</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Day Length</div>
            <div class="stat-value">${Math.abs(data.rotationPeriod).toFixed(1)} days</div>
            <div class="stat-sub">${data.rotationPeriod < 0 ? 'Retrograde' : 'Prograde'}</div>
          </div>
        </div>

        <div class="fun-facts-section">
          <h3>🌟 Fun Facts</h3>
          <ul class="fun-facts-list">
            ${edu.funFacts.map(fact => `<li>${fact}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  renderMissions() {
    const edu = this.currentEducation;
    
    const statusColors = {
      'Active': '#00ff00',
      'Completed': '#4a9eff',
      'Planned': '#ffaa00',
      'En route': '#ff00ff',
      'Proposed': '#888888'
    };

    return `
      <div class="missions-section">
        <h3>🚀 Space Missions</h3>
        <div class="missions-timeline">
          ${edu.missions.map(mission => `
            <div class="mission-card">
              <div class="mission-header">
                <span class="mission-name">${mission.name}</span>
                <span class="mission-status" style="color: ${statusColors[mission.status] || '#888'}">
                  ${mission.status}
                </span>
              </div>
              <div class="mission-year">${mission.year}</div>
              <div class="mission-achievement">${mission.achievement}</div>
            </div>
          `).join('')}
        </div>
        
        ${this.currentPlanet === 'mars' && edu.colonization ? `
          <div class="colonization-section">
            <h3>🏗️ Mars Colonization Plans</h3>
            
            <div class="challenges-solutions">
              <div class="challenge-box">
                <h4>⚠️ Challenges</h4>
                <ul>
                  ${edu.colonization.challenges.map(c => `<li>${c}</li>`).join('')}
                </ul>
              </div>
              
              <div class="solution-box">
                <h4>✅ Solutions</h4>
                <ul>
                  ${edu.colonization.solutions.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
            </div>
            
            <div class="timeline-box">
              <h4>📅 Timeline</h4>
              <ul>
                ${edu.colonization.timeline.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderHabitability() {
    const edu = this.currentEducation;
    const hab = edu.habitability;
    const color = getHabitabilityColor(hab.score);
    const label = getHabitabilityLabel(hab.score);

    return `
      <div class="habitability-section">
        <div class="habitability-score">
          <h3>Could Humans Live Here?</h3>
          <div class="score-display">
            <div class="score-circle" style="border-color: ${color}">
              <span class="score-number" style="color: ${color}">${hab.score}/10</span>
            </div>
            <div class="score-label" style="color: ${color}">${label}</div>
          </div>
        </div>

        <div class="habitability-reasons">
          <h4>Analysis:</h4>
          <ul class="reasons-list">
            ${hab.reasons.map(reason => `<li>${reason}</li>`).join('')}
          </ul>
        </div>

        <div class="habitability-verdict">
          <strong>Verdict:</strong> ${hab.verdict}
        </div>

        ${hab.score >= 3 ? `
          <div class="habitability-note">
            <strong>Note:</strong> With current or near-future technology, ${this.currentPlanet} 
            ${hab.score >= 5 ? 'could potentially support' : 'presents significant challenges for'} 
            human habitation.
          </div>
        ` : ''}
      </div>
    `;
  }

  renderComparison() {
    const edu = this.currentEducation;
    const comp = edu.earthComparison;

    return `
      <div class="comparison-section">
        <h3>🌍 Comparison with Earth</h3>
        
        <div class="comparison-grid">
          <div class="comparison-card">
            <div class="comparison-icon">📏</div>
            <div class="comparison-label">Size</div>
            <div class="comparison-value">${comp.size}</div>
          </div>
          
          <div class="comparison-card">
            <div class="comparison-icon">⚖️</div>
            <div class="comparison-label">Gravity</div>
            <div class="comparison-value">${comp.gravity}</div>
          </div>
          
          <div class="comparison-card">
            <div class="comparison-icon">☀️</div>
            <div class="comparison-label">Day Length</div>
            <div class="comparison-value">${comp.dayLength}</div>
          </div>
          
          <div class="comparison-card">
            <div class="comparison-icon">🌍</div>
            <div class="comparison-label">Year Length</div>
            <div class="comparison-value">${comp.yearLength}</div>
          </div>
          
          <div class="comparison-card">
            <div class="comparison-icon">🌡️</div>
            <div class="comparison-label">Temperature</div>
            <div class="comparison-value">${comp.temperature}</div>
          </div>
        </div>

        <div class="comparison-visual">
          <h4>What would it be like?</h4>
          ${this.renderExperienceDescription()}
        </div>
      </div>
    `;
  }

  renderExperienceDescription() {
    const planet = this.currentPlanet;
    const descriptions = {
      mercury: "You'd experience extreme temperature swings and need constant protection from solar radiation. Walking would feel lighter, but the lack of atmosphere means no sound and instant exposure to space.",
      venus: "The crushing pressure would instantly kill you, and the heat would melt your spacecraft. However, floating cities in the upper atmosphere could theoretically work where conditions are Earth-like.",
      earth: "Perfect! This is home. Comfortable temperature, breathable air, and just the right gravity.",
      mars: "You'd feel lighter and could jump higher. Days are similar to Earth, but you'd need a spacesuit for the thin atmosphere and protection from radiation. The red landscape would be hauntingly beautiful.",
      jupiter: "There's no surface to stand on - you'd fall forever through layers of gas until crushed by pressure. The radiation would be lethal within minutes.",
      saturn: "Similar to Jupiter - no solid surface and deadly radiation. However, the view of the rings would be spectacular from orbit!",
      uranus: "Freezing cold with no solid surface. The sideways rotation means extreme seasons lasting 21 years each.",
      neptune: "The coldest and windiest place in the solar system. Supersonic winds would tear apart any spacecraft trying to enter the atmosphere."
    };

    return `<p class="experience-text">${descriptions[planet]}</p>`;
  }
}
