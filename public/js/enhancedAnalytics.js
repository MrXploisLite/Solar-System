// Enhanced Analytics Dashboard - Advanced performance monitoring and insights
export class EnhancedAnalytics {
    constructor(dataVisualization) {
        this.dataViz = dataVisualization;
        this.panel = null;
        this.metrics = {
            fps: [],
            objectCount: [],
            memory: [],
            lodMetrics: null,
            exoplanetCount: 0,
            particleCount: 0,
            frameTime: [],
            drawCalls: []
        };
        this.updateInterval = null;
        this.isVisible = false;
        
        this.createPanel();
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'enhanced-analytics-panel';
        this.panel.className = 'glass-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            max-width: 95%;
            max-height: 85vh;
            padding: 30px;
            color: white;
            z-index: 2500;
            display: none;
            overflow-y: auto;
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-family: 'Space Grotesk';">SCIENCE TELEMETRY</h2>
                <button id="close-analytics-btn" class="secondary-btn" style="width: auto; padding: 5px 15px;">CLOSE</button>
            </div>
            <div id="analytics-content">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="stat-box">
                        <span class="stat-label">FPS STABILITY</span>
                        <div id="perf-overview" class="stat-value">--</div>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">MEMORY LOAD</span>
                        <div id="system-load" class="stat-value">--</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="stat-box">
                        <span class="stat-label">LOD EFFICIENCY</span>
                        <div id="lod-metrics" class="stat-value" style="font-size: 14px;">--</div>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">EXOPLANET DISCOVERY</span>
                        <div id="exoplanet-count" class="stat-value">--</div>
                    </div>
                </div>

                <div class="stat-box" style="margin-bottom: 15px;">
                    <span class="stat-label">PERFORMANCE TRENDS</span>
                    <canvas id="analytics-chart" width="600" height="200" style="width: 100%; height: 200px; margin-top: 10px;"></canvas>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
        document.getElementById('close-analytics-btn').onclick = () => this.hide();
    }

    startUpdating() {
        if (this.updateInterval) return;
        this.updateInterval = setInterval(() => this.update(), 500);
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        if (!this.isVisible) return;
        
        const fps = this.dataViz.dataHistory.fps.slice(-1)[0] || 0;
        const mem = this.dataViz.dataHistory.memory.slice(-1)[0] || 0;
        
        document.getElementById('perf-overview').textContent = `${fps.toFixed(0)} FPS`;
        document.getElementById('system-load').textContent = `${mem.toFixed(1)} MB`;

        if (window.app) {
            if (window.app.lodSystem) {
                const lod = window.app.lodSystem.getMetrics();
                document.getElementById('lod-metrics').textContent =
                    `${lod.visibleObjects}/${lod.totalObjects} OBJS (H:${lod.lodLevels.high || 0}, M:${lod.lodLevels.medium || 0}, L:${lod.lodLevels.low || 0})`;
            }
            if (window.app.exoplanetSystem) {
                document.getElementById('exoplanet-count').textContent = window.app.exoplanetSystem.getExoplanetCount();
            }
        }
        
        this.updateChart();
    }

    updateChart() {
        const canvas = document.getElementById('analytics-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const data = this.dataViz.dataHistory.fps.slice(-60);
        const step = w / 60;
        data.forEach((val, i) => {
            const x = i * step;
            const y = h - (val / 120) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    show() {
        this.panel.style.display = 'block';
        this.isVisible = true;
        this.startUpdating();
    }

    hide() {
        this.panel.style.display = 'none';
        this.isVisible = false;
        this.stopUpdating();
    }

    toggle() {
        if (this.isVisible) this.hide();
        else this.show();
    }

    recordLODMetrics() {}
    recordExoplanetCount() {}
    recordParticleCount() {}
}
