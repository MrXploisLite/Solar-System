export class LiveDataUI {
  constructor(liveDataManager) {
    this.dataManager = liveDataManager;
    this.createUI();
    this.setupListeners();
  }

  createUI() {
    const panel = document.createElement('div');
    panel.id = 'live-data-panel';
    panel.className = 'live-data-panel';
    panel.innerHTML = `
      <div class="live-data-header">
        <h3>🛰️ Live Data</h3>
        <button id="toggle-live-data" class="toggle-btn">−</button>
      </div>
      <div class="live-data-content">
        <div class="data-section">
          <div class="section-title"><span class="status-dot"></span>ISS</div>
          <div id="iss-data" class="data-content"><div class="loading">Loading...</div></div>
        </div>
        <div class="data-section">
          <div class="section-title">👨‍🚀 Astronauts</div>
          <div id="astronauts-data" class="data-content"><div class="loading">Loading...</div></div>
        </div>
        <div class="data-section">
          <div class="section-title">☄️ Asteroids</div>
          <div id="neo-data" class="data-content"><div class="loading">Loading...</div></div>
        </div>
        <div class="data-section">
          <div class="section-title">📰 News</div>
          <div id="space-news-data" class="data-content"><div class="loading">Loading...</div></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    document.getElementById('toggle-live-data').addEventListener('click', () => {
      panel.classList.toggle('collapsed');
      document.getElementById('toggle-live-data').textContent = panel.classList.contains('collapsed') ? '+' : '−';
    });
  }

  setupListeners() {
    this.dataManager.subscribe((type, data) => {
      if (type === 'iss-position') this.updateISSData(data);
      else if (type === 'astronauts') this.updateAstronautsData(data);
      else if (type === 'near-earth-objects') this.updateNEOData(data);
      else if (type === 'space-news') this.updateSpaceNews(data);
    });
  }

  updateISSData(data) {
    const container = document.getElementById('iss-data');
    if (!data) {
      container.innerHTML = '<div class="error">Failed</div>';
      return;
    }
    container.innerHTML = `
      <div class="iss-info">
        <div class="info-row"><span class="label">Position:</span><span class="value">${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°</span></div>
        <div class="info-row"><span class="label">Altitude:</span><span class="value">${data.altitude} km</span></div>
        <div class="info-row"><span class="label">Speed:</span><span class="value">${data.velocity.toLocaleString()} km/h</span></div>
        <div class="last-update">Updated: ${new Date(data.timestamp * 1000).toLocaleTimeString()}</div>
      </div>
      <button id="iss-pass-btn" class="action-btn">🔭 When Can I See It?</button>
    `;
    document.getElementById('iss-pass-btn')?.addEventListener('click', () => this.showISSPassTimes());
  }

  updateAstronautsData(data) {
    const container = document.getElementById('astronauts-data');
    if (!data) {
      container.innerHTML = '<div class="error">Failed</div>';
      return;
    }
    const issCount = data.people.filter(p => p.craft === 'ISS').length;
    container.innerHTML = `
      <div class="astronaut-summary">
        <div class="big-number">${data.number}</div>
        <div class="summary-text">people in space</div>
      </div>
      <div class="crew-breakdown">
        <div class="crew-item"><span class="craft-name">ISS:</span><span class="crew-count">${issCount}</span></div>
      </div>
      <button id="show-crew-btn" class="action-btn">👥 Show Names</button>
    `;
    document.getElementById('show-crew-btn')?.addEventListener('click', () => this.showCrewDetails(data.people));
  }

  updateNEOData(data) {
    const container = document.getElementById('neo-data');
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="info-text">No asteroids today</div>';
      return;
    }
    container.innerHTML = `
      <div class="neo-summary">
        <div class="neo-count">${data.length}</div>
        <div class="neo-text">asteroids today</div>
      </div>
      <div class="neo-list">
        ${data.slice(0, 2).map(neo => `
          <div class="neo-item ${neo.isPotentiallyHazardous ? 'hazardous' : ''}">
            <div class="neo-name">${neo.name}</div>
            <div class="neo-details">
              <span>${neo.diameter.max.toFixed(1)} km</span>
              <span>${(neo.closeApproach.distance / 1000000).toFixed(1)}M km</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  updateSpaceNews(data) {
    const container = document.getElementById('space-news-data');
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="error">Failed</div>';
      return;
    }
    container.innerHTML = `
      <div class="news-list">
        ${data.slice(0, 2).map(article => `
          <div class="news-item">
            <div class="news-title">${article.title.substring(0, 60)}...</div>
            <a href="${article.url}" target="_blank" class="news-link">Read →</a>
          </div>
        `).join('')}
      </div>
    `;
  }

  async showISSPassTimes() {
    try {
      const location = await this.dataManager.getUserLocation();
      const passes = await this.dataManager.fetchISSPassTimes(location.latitude, location.longitude);
      if (!passes || passes.length === 0) {
        this.showNotification('No visible passes');
        return;
      }
      const html = passes.map(p => `<div class="pass-item"><div>${p.risetime.toLocaleString()}</div><div>${Math.floor(p.duration / 60)} min</div></div>`).join('');
      this.showModal('ISS Pass Times', `<div class="pass-times"><p>Next passes:</p>${html}</div>`);
    } catch (error) {
      this.showNotification('Enable location access');
    }
  }

  showCrewDetails(people) {
    const html = people.map(p => `<div class="crew-member"><span>${p.name}</span><span>${p.craft}</span></div>`).join('');
    this.showModal('People in Space', `<div class="crew-list">${html}</div>`);
  }

  showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'live-data-modal';
    modal.innerHTML = `<div class="modal-content"><div class="modal-header"><h3>${title}</h3><button class="modal-close">×</button></div><div class="modal-body">${content}</div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  showNotification(message) {
    const n = document.createElement('div');
    n.className = 'live-data-notification';
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.classList.add('fade-out'); setTimeout(() => n.remove(), 300); }, 3000);
  }
}
