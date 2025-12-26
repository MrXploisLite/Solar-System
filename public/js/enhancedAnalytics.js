// Enhanced Analytics Dashboard - Advanced performance monitoring and insights
export class EnhancedAnalytics {
    constructor(dataVisualization) {
        this.dataViz = dataVisualization;
        this.panel = null;
        this.metrics = {
            fps: [],
            objectCount: [],
            memory: [],
            lodMetrics: [],
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
        // Main analytics panel
        this.panel = document.createElement('div');
        this.panel.id = 'enhanced-analytics-panel';
        this.panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            max-width: 95%;
            max-height: 85vh;
            background: rgba(10, 15, 25, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            color: white;
            font-family: 'Inter', sans-serif;
            z-index: 2500;
            display: none;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8);
        `;

        this.panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
                <div>
                    <h2 style="margin: 0; color: #11998e;">📊 Enhanced Analytics Dashboard</h2>
                    <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.7;">Real-time performance monitoring and system insights</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="export-analytics-btn" style="padding: 6px 12px; background: rgba(56, 239, 125, 0.2); border: 1px solid #38ef7d; border-radius: 6px; color: #38ef7d; cursor: pointer; font-size: 12px;">Export Data</button>
                    <button id="close-analytics-btn" style="padding: 6px 12px; background: rgba(255,100,100,0.2); border: 1px solid rgba(255,100,100,0.4); border-radius: 6px; color: white; cursor: pointer;">Close</button>
                </div>
            </div>

            <div id="analytics-content">
                <!-- Real-time metrics -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #4A90E2;">Performance Overview</h3>
                        <div id="perf-overview" style="font-size: 12px; line-height: 1.6;"></div>
                    </div>

                    <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #F38181;">System Load</h3>
                        <div id="system-load" style="font-size: 12px; line-height: 1.6;"></div>
                    </div>
                </div>

                <!-- Charts -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #FFE66D;">Performance Trends</h3>
                    <canvas id="analytics-chart" width="660" height="200" style="width: 100%; background: rgba(0,0,0,0.3); border-radius: 6px;"></canvas>
                </div>

                <!-- LOD Analysis -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #95E1D3;">LOD Distribution</h3>
                    <div id="lod-analysis" style="font-size: 12px; line-height: 1.6;"></div>
                </div>

                <!-- Exoplanet Stats -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #7B68EE;">Exoplanet System</h3>
                    <div id="exoplanet-stats" style="font-size: 12px; line-height: 1.6;"></div>
                </div>

                <!-- Quality Assessment -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; border: 1px solid rgba(255,255,255,0.1);">
                    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #38ef7d;">Quality Assessment</h3>
                    <div id="quality-assessment" style="font-size: 12px; line-height: 1.6;"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);

        // Bind events
        document.getElementById('close-analytics-btn').addEventListener('click', () => this.hide());
        document.getElementById('export-analytics-btn').addEventListener('click', () => this.exportData());
    }

    createToggle() {
        // Create floating toggle button
        const button = document.createElement('button');
        button.id = 'enhanced-analytics-toggle';
        button.innerHTML = '📈 Advanced Analytics';
        button.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            border: none;
            border-radius: 8px;
            color: #0a0f19;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
            transition: all 0.3s ease;
            font-size: 12px;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(17, 153, 142, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(17, 153, 142, 0.4)';
        });

        button.addEventListener('click', () => this.toggle());
        document.body.appendChild(button);
    }

    startUpdating() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            this.update();
        }, 500); // Update every 500ms
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        if (!this.isVisible) return;

        // Update performance overview
        this.updatePerformanceOverview();
        
        // Update system load
        this.updateSystemLoad();
        
        // Update LOD analysis
        this.updateLODAnalysis();
        
        // Update exoplanet stats
        this.updateExoplanetStats();
        
        // Update quality assessment
        this.updateQualityAssessment();
        
        // Update chart
        this.updateChart();
    }

    updatePerformanceOverview() {
        const container = document.getElementById('perf-overview');
        if (!container) return;

        const currentFPS = this.dataViz.dataHistory.fps[this.dataViz.dataHistory.fps.length - 1] || 0;
        const avgFPS = this.calculateAverage(this.dataViz.dataHistory.fps);
        const minFPS = Math.min(...this.dataViz.dataHistory.fps, 0);
        const maxFPS = Math.max(...this.dataViz.dataHistory.fps, 0);

        const fpsColor = currentFPS >= 55 ? '#38ef7d' : currentFPS >= 45 ? '#4A90E2' : currentFPS >= 30 ? '#FFE66D' : '#F38181';

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                    <div style="opacity: 0.6;">Current FPS</div>
                    <div style="font-size: 18px; font-weight: 600; color: ${fpsColor};">${currentFPS.toFixed(0)}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Average FPS</div>
                    <div style="font-size: 18px; font-weight: 600; color: #4A90E2;">${avgFPS.toFixed(0)}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Min FPS</div>
                    <div style="font-size: 14px; color: #F38181;">${minFPS.toFixed(0)}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Max FPS</div>
                    <div style="font-size: 14px; color: #38ef7d;">${maxFPS.toFixed(0)}</div>
                </div>
            </div>
        `;
    }

    updateSystemLoad() {
        const container = document.getElementById('system-load');
        if (!container) return;

        const currentMemory = this.dataViz.dataHistory.memory[this.dataViz.dataHistory.memory.length - 1] || 0;
        const currentObjects = this.dataViz.dataHistory.objectCount[this.dataViz.dataHistory.objectCount.length - 1] || 0;
        
        const avgMemory = this.calculateAverage(this.dataViz.dataHistory.memory);
        const avgObjects = this.calculateAverage(this.dataViz.dataHistory.objectCount);

        // Memory usage assessment
        let memoryStatus = 'Optimal';
        let memoryColor = '#38ef7d';
        if (currentMemory > 15) {
            memoryStatus = 'High';
            memoryColor = '#FFE66D';
        }
        if (currentMemory > 25) {
            memoryStatus = 'Critical';
            memoryColor = '#F38181';
        }

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                    <div style="opacity: 0.6;">Memory Usage</div>
                    <div style="font-size: 16px; font-weight: 600; color: ${memoryColor};">${currentMemory.toFixed(1)} MB</div>
                    <div style="font-size: 10px; opacity: 0.5;">Avg: ${avgMemory.toFixed(1)} MB</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Active Objects</div>
                    <div style="font-size: 16px; font-weight: 600; color: #4A90E2;">${currentObjects}</div>
                    <div style="font-size: 10px; opacity: 0.5;">Avg: ${avgObjects.toFixed(0)}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Status</div>
                    <div style="font-size: 14px; font-weight: 600; color: ${memoryColor};">${memoryStatus}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Frame Time</div>
                    <div style="font-size: 14px; font-weight: 600; color: #FFE66D;">${this.calculateFrameTime()} ms</div>
                </div>
            </div>
        `;
    }

    updateLODAnalysis() {
        const container = document.getElementById('lod-analysis');
        if (!container) return;

        // Get LOD metrics if available
        const lodMetrics = this.metrics.lodMetrics[this.metrics.lodMetrics.length - 1];
        
        if (!lodMetrics) {
            container.innerHTML = '<div style="opacity: 0.6;">LOD system not active</div>';
            return;
        }

        const lodLevels = lodMetrics.lodLevels || {};
        
        let html = '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">';
        
        const levels = ['high', 'medium', 'low', 'ultraLow'];
        const colors = {
            high: '#38ef7d',
            medium: '#4A90E2',
            low: '#FFE66D',
            ultraLow: '#F38181'
        };

        levels.forEach(level => {
            const count = lodLevels[level] || 0;
            html += `
                <div style="text-align: center; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px;">
                    <div style="font-size: 10px; opacity: 0.6; text-transform: uppercase;">${level}</div>
                    <div style="font-size: 16px; font-weight: 600; color: ${colors[level]};">${count}</div>
                </div>
            `;
        });
        
        html += '</div>';
        
        if (lodMetrics.avgDistance !== undefined) {
            html += `<div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">Avg Distance: ${lodMetrics.avgDistance.toFixed(0)} units</div>`;
        }
        
        container.innerHTML = html;
    }

    updateExoplanetStats() {
        const container = document.getElementById('exoplanet-stats');
        if (!container) return;

        const exoplanetCount = this.metrics.exoplanetCount || 0;
        const particleCount = this.metrics.particleCount || 0;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                    <div style="opacity: 0.6;">Exoplanets</div>
                    <div style="font-size: 18px; font-weight: 600; color: #7B68EE;">${exoplanetCount}</div>
                    <div style="font-size: 10px; opacity: 0.5;">Active System</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Particles</div>
                    <div style="font-size: 18px; font-weight: 600; color: #95E1D3;">${particleCount.toLocaleString()}</div>
                    <div style="font-size: 10px; opacity: 0.5;">Visual Effects</div>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; opacity: 0.7;">
                ${exoplanetCount > 0 ? '✅ Exoplanet system active - exploring beyond our solar system!' : 'ℹ️ Enable exoplanets to explore distant worlds'}
            </div>
        `;
    }

    updateQualityAssessment() {
        const container = document.getElementById('quality-assessment');
        if (!container) return;

        const currentFPS = this.dataViz.dataHistory.fps[this.dataViz.dataHistory.fps.length - 1] || 0;
        const currentMemory = this.dataViz.dataHistory.memory[this.dataViz.dataHistory.memory.length - 1] || 0;
        const currentObjects = this.dataViz.dataHistory.objectCount[this.dataViz.dataHistory.objectCount.length - 1] || 0;

        // Calculate quality score
        let score = 100;
        
        // FPS impact
        if (currentFPS < 30) score -= 40;
        else if (currentFPS < 45) score -= 20;
        else if (currentFPS < 55) score -= 10;
        
        // Memory impact
        if (currentMemory > 25) score -= 30;
        else if (currentMemory > 15) score -= 15;
        
        // Object count impact
        if (currentObjects > 15000) score -= 20;
        else if (currentObjects > 10000) score -= 10;

        let rating = 'Excellent';
        let color = '#38ef7d';
        
        if (score < 40) {
            rating = 'Poor';
            color = '#F38181';
        } else if (score < 60) {
            rating = 'Fair';
            color = '#FFE66D';
        } else if (score < 80) {
            rating = 'Good';
            color = '#4A90E2';
        }

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <div style="opacity: 0.6;">Overall Score</div>
                    <div style="font-size: 24px; font-weight: 700; color: ${color};">${score}/100</div>
                    <div style="font-size: 14px; font-weight: 600; color: ${color}; margin-top: 4px;">${rating}</div>
                </div>
                <div>
                    <div style="opacity: 0.6;">Recommendations</div>
                    <div style="font-size: 11px; line-height: 1.4; margin-top: 4px;">
                        ${this.getRecommendations(currentFPS, currentMemory, currentObjects)}
                    </div>
                </div>
            </div>
        `;
    }

    getRecommendations(fps, memory, objects) {
        const recommendations = [];
        
        if (fps < 45) {
            recommendations.push('• Reduce quality settings');
            recommendations.push('• Enable LOD system');
        }
        
        if (memory > 20) {
            recommendations.push('• Close other applications');
            recommendations.push('• Reduce particle effects');
        }
        
        if (objects > 12000) {
            recommendations.push('• Use LOD for distant objects');
            recommendations.push('• Hide far celestial bodies');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ System running optimally');
        }

        return recommendations.join('<br>');
    }

    updateChart() {
        const canvas = document.getElementById('analytics-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw FPS line
        const fpsData = this.dataViz.dataHistory.fps.slice(-50); // Last 50 data points
        if (fpsData.length > 1) {
            ctx.strokeStyle = '#4A90E2';
            ctx.lineWidth = 2;
            ctx.beginPath();

            const maxFPS = Math.max(...fpsData, 60);
            const step = width / (fpsData.length - 1);

            fpsData.forEach((fps, i) => {
                const x = i * step;
                const y = height - (fps / maxFPS) * height;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });

            ctx.stroke();

            // Draw memory line
            const memoryData = this.dataViz.dataHistory.memory.slice(-50);
            if (memoryData.length > 1) {
                ctx.strokeStyle = '#FFE66D';
                ctx.lineWidth = 1.5;
                ctx.beginPath();

                const maxMemory = Math.max(...memoryData, 50);
                
                memoryData.forEach((mem, i) => {
                    const x = i * step;
                    const y = height - (mem / maxMemory) * height;
                    
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                });

                ctx.stroke();
            }

            // Legend
            ctx.fillStyle = '#4A90E2';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText('FPS', 5, 12);
            
            ctx.fillStyle = '#FFE66D';
            ctx.fillText('Memory (MB)', 5, 24);
        }
    }

    calculateAverage(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }

    calculateFrameTime() {
        const fps = this.dataViz.dataHistory.fps[this.dataViz.dataHistory.fps.length - 1] || 60;
        return fps > 0 ? (1000 / fps).toFixed(1) : 0;
    }

    // Data collection methods
    recordLODMetrics(metrics) {
        this.metrics.lodMetrics.push(metrics);
        if (this.metrics.lodMetrics.length > 50) {
            this.metrics.lodMetrics.shift();
        }
    }

    recordExoplanetCount(count) {
        this.metrics.exoplanetCount = count;
    }

    recordParticleCount(count) {
        this.metrics.particleCount = count;
    }

    // Export functionality
    exportData() {
        const report = {
            timestamp: new Date().toISOString(),
            version: '3.0.0',
            performance: {
                fps: {
                    current: this.dataViz.dataHistory.fps[this.dataViz.dataHistory.fps.length - 1] || 0,
                    average: this.calculateAverage(this.dataViz.dataHistory.fps),
                    history: this.dataViz.dataHistory.fps
                },
                memory: {
                    current: this.dataViz.dataHistory.memory[this.dataViz.dataHistory.memory.length - 1] || 0,
                    average: this.calculateAverage(this.dataViz.dataHistory.memory),
                    history: this.dataViz.dataHistory.memory
                },
                objects: {
                    current: this.dataViz.dataHistory.objectCount[this.dataViz.dataHistory.objectCount.length - 1] || 0,
                    average: this.calculateAverage(this.dataViz.dataHistory.objectCount),
                    history: this.dataViz.dataHistory.objectCount
                }
            },
            system: {
                exoplanets: this.metrics.exoplanetCount,
                particles: this.metrics.particleCount,
                lodMetrics: this.metrics.lodMetrics[this.metrics.lodMetrics.length - 1] || null
            },
            quality: this.getQualityScore()
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar-system-analytics-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    getQualityScore() {
        const currentFPS = this.dataViz.dataHistory.fps[this.dataViz.dataHistory.fps.length - 1] || 0;
        const currentMemory = this.dataViz.dataHistory.memory[this.dataViz.dataHistory.memory.length - 1] || 0;
        const currentObjects = this.dataViz.dataHistory.objectCount[this.dataViz.dataHistory.objectCount.length - 1] || 0;

        let score = 100;
        
        if (currentFPS < 30) score -= 40;
        else if (currentFPS < 45) score -= 20;
        else if (currentFPS < 55) score -= 10;
        
        if (currentMemory > 25) score -= 30;
        else if (currentMemory > 15) score -= 15;
        
        if (currentObjects > 15000) score -= 20;
        else if (currentObjects > 10000) score -= 10;

        return {
            score: Math.max(0, score),
            rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
        };
    }

    show() {
        if (!this.panel) this.createPanel();
        if (!document.getElementById('enhanced-analytics-toggle')) this.createToggle();
        
        this.panel.style.display = 'block';
        this.isVisible = true;
        this.startUpdating();
        this.update(); // Immediate update
    }

    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
            this.stopUpdating();
        }
    }

    toggle() {
        if (!this.isVisible) {
            this.show();
        } else {
            this.hide();
        }
    }

    destroy() {
        this.stopUpdating();
        if (this.panel) this.panel.remove();
        const toggle = document.getElementById('enhanced-analytics-toggle');
        if (toggle) toggle.remove();
    }
}