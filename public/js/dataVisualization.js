// Data Visualization Charts and Analytics
export class DataVisualization {
    constructor() {
        this.charts = {};
        this.canvas = null;
        this.ctx = null;
        this.isVisible = false;
        
        this.dataHistory = {
            fps: [],
            objectCount: [],
            memory: [],
            time: []
        };
        
        this.maxHistoryLength = 100;
        this.updateInterval = null;
        
        this.createCanvas();
    }

    createCanvas() {
        // Create overlay canvas for charts
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'data-viz-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            width: 350px;
            height: 250px;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            z-index: 1000;
            display: none;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;
        
        this.canvas.width = 350;
        this.canvas.height = 250;
        this.ctx = this.canvas.getContext('2d');
        
        document.body.appendChild(this.canvas);
        
        // Create toggle button
        this.createToggle();
    }

    createToggle() {
        const button = document.createElement('button');
        button.id = 'data-viz-toggle';
        button.textContent = '📊 Analytics';
        button.style.cssText = `
            position: fixed;
            top: 16px;
            right: 16px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
            transition: all 0.3s ease;
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

    toggle() {
        this.isVisible = !this.isVisible;
        this.canvas.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.startUpdating();
        } else {
            this.stopUpdating();
        }
    }

    startUpdating() {
        if (this.updateInterval) return;
        
        this.updateInterval = setInterval(() => {
            this.update();
        }, 100); // Update 10 times per second
    }

    stopUpdating() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    update() {
        if (!this.isVisible || !this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        this.ctx.fillStyle = 'rgba(10, 15, 25, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw title
        this.ctx.fillStyle = '#11998e';
        this.ctx.font = 'bold 14px Inter, sans-serif';
        this.ctx.fillText('System Analytics', 15, 25);

        // Draw FPS chart
        this.drawFPSChart();

        // Draw object count
        this.drawObjectCount();

        // Draw memory usage
        this.drawMemoryChart();

        // Draw statistics text
        this.drawStatistics();
    }

    drawFPSChart() {
        const x = 15;
        const y = 40;
        const width = 160;
        const height = 60;

        // Chart background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.strokeRect(x, y, width, height);

        // Title
        this.ctx.fillStyle = '#4A90E2';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillText('FPS', x + 2, y + 12);

        // Draw data
        if (this.dataHistory.fps.length > 1) {
            this.ctx.strokeStyle = '#4A90E2';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            const maxFPS = Math.max(...this.dataHistory.fps, 60);
            const step = width / (this.dataHistory.fps.length - 1);

            this.dataHistory.fps.forEach((fps, i) => {
                const px = x + i * step;
                const py = y + height - (fps / maxFPS) * (height - 15);
                
                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            });

            this.ctx.stroke();

            // Draw target line (60 FPS)
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([2, 2]);
            this.ctx.beginPath();
            const targetY = y + height - (60 / maxFPS) * (height - 15);
            this.ctx.moveTo(x, targetY);
            this.ctx.lineTo(x + width, targetY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }
    }

    drawObjectCount() {
        const x = 190;
        const y = 40;
        const width = 145;
        const height = 60;

        // Chart background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.strokeRect(x, y, width, height);

        // Title
        this.ctx.fillStyle = '#F38181';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillText('Objects', x + 2, y + 12);

        // Draw data
        if (this.dataHistory.objectCount.length > 1) {
            this.ctx.strokeStyle = '#F38181';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            const maxCount = Math.max(...this.dataHistory.objectCount, 100);
            const step = width / (this.dataHistory.objectCount.length - 1);

            this.dataHistory.objectCount.forEach((count, i) => {
                const px = x + i * step;
                const py = y + height - (count / maxCount) * (height - 15);
                
                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            });

            this.ctx.stroke();
        }
    }

    drawMemoryChart() {
        const x = 15;
        const y = 115;
        const width = 160;
        const height = 50;

        // Chart background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.strokeRect(x, y, width, height);

        // Title
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillText('Memory (MB)', x + 2, y + 12);

        // Draw data
        if (this.dataHistory.memory.length > 1) {
            this.ctx.strokeStyle = '#FFE66D';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();

            const maxMem = Math.max(...this.dataHistory.memory, 50);
            const step = width / (this.dataHistory.memory.length - 1);

            this.dataHistory.memory.forEach((mem, i) => {
                const px = x + i * step;
                const py = y + height - (mem / maxMem) * (height - 15);
                
                if (i === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            });

            this.ctx.stroke();
        }
    }

    drawStatistics() {
        const x = 190;
        const y = 115;
        const lineHeight = 16;

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '10px Inter, sans-serif';

        // Current values
        const currentFPS = this.dataHistory.fps[this.dataHistory.fps.length - 1] || 0;
        const currentObjects = this.dataHistory.objectCount[this.dataHistory.objectCount.length - 1] || 0;
        const currentMemory = this.dataHistory.memory[this.dataHistory.memory.length - 1] || 0;

        this.ctx.fillText('Current Stats:', x, y);
        this.ctx.fillStyle = '#4A90E2';
        this.ctx.fillText(`FPS: ${currentFPS.toFixed(0)}`, x, y + lineHeight);
        this.ctx.fillStyle = '#F38181';
        this.ctx.fillText(`Objects: ${currentObjects}`, x, y + lineHeight * 2);
        this.ctx.fillStyle = '#FFE66D';
        this.ctx.fillText(`Memory: ${currentMemory.toFixed(1)} MB`, x, y + lineHeight * 3);

        // Quality indicator
        const quality = this.getQualityIndicator(currentFPS);
        this.ctx.fillStyle = quality.color;
        this.ctx.fillText(`Quality: ${quality.label}`, x, y + lineHeight * 4);
    }

    getQualityIndicator(fps) {
        if (fps >= 55) return { label: 'Ultra', color: '#38ef7d' };
        if (fps >= 45) return { label: 'High', color: '#4A90E2' };
        if (fps >= 30) return { label: 'Medium', color: '#FFE66D' };
        return { label: 'Low', color: '#F38181' };
    }

    // Data collection methods
    recordFPS(fps) {
        this.dataHistory.fps.push(fps);
        if (this.dataHistory.fps.length > this.maxHistoryLength) {
            this.dataHistory.fps.shift();
        }
    }

    recordObjectCount(count) {
        this.dataHistory.objectCount.push(count);
        if (this.dataHistory.objectCount.length > this.maxHistoryLength) {
            this.dataHistory.objectCount.shift();
        }
    }

    recordMemory(memoryMB) {
        this.dataHistory.memory.push(memoryMB);
        if (this.dataHistory.memory.length > this.maxHistoryLength) {
            this.dataHistory.memory.shift();
        }
    }

    // Create detailed analytics panel
    createAnalyticsPanel() {
        const panel = document.createElement('div');
        panel.id = 'analytics-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 16px;
            right: 16px;
            width: 350px;
            max-height: 200px;
            background: rgba(10, 15, 25, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 15px;
            color: white;
            font-family: 'Inter', sans-serif;
            z-index: 1000;
            display: none;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        `;

        panel.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #11998e;">Performance Analytics</h4>
            <div id="analytics-content" style="font-size: 11px; line-height: 1.6;"></div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // Generate performance report
    generateReport() {
        const fpsAvg = this.dataHistory.fps.reduce((a, b) => a + b, 0) / this.dataHistory.fps.length || 0;
        const fpsMin = Math.min(...this.dataHistory.fps);
        const fpsMax = Math.max(...this.dataHistory.fps);
        
        const objectsAvg = this.dataHistory.objectCount.reduce((a, b) => a + b, 0) / this.dataHistory.objectCount.length || 0;
        const memoryAvg = this.dataHistory.memory.reduce((a, b) => a + b, 0) / this.dataHistory.memory.length || 0;

        return {
            fps: {
                average: fpsAvg,
                min: fpsMin,
                max: fpsMax,
                stability: fpsMin > 30 ? 'Good' : 'Poor'
            },
            objects: {
                average: Math.round(objectsAvg),
                current: this.dataHistory.objectCount[this.dataHistory.objectCount.length - 1] || 0
            },
            memory: {
                average: memoryAvg,
                current: this.dataHistory.memory[this.dataHistory.memory.length - 1] || 0
            },
            timestamp: new Date().toISOString()
        };
    }

    // Export data as JSON
    exportData() {
        const report = this.generateReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar-system-analytics-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Create performance comparison chart
    createComparisonChart(baselineData) {
        if (!this.isVisible) return;

        const x = 15;
        const y = 180;
        const width = 320;
        const height = 60;

        // Background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.fillRect(x, y, width, height);

        // Border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.strokeRect(x, y, width, height);

        // Title
        this.ctx.fillStyle = '#95E1D3';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillText('Performance vs Baseline', x + 2, y + 12);

        // Draw comparison bars
        if (baselineData && this.dataHistory.fps.length > 0) {
            const currentFPS = this.dataHistory.fps[this.dataHistory.fps.length - 1];
            const baselineFPS = baselineData.fps || 60;
            
            const barWidth = width / 3;
            const maxVal = Math.max(currentFPS, baselineFPS, 60);

            // Current
            const currentHeight = (currentFPS / maxVal) * (height - 20);
            this.ctx.fillStyle = '#4A90E2';
            this.ctx.fillRect(x + 5, y + height - currentHeight - 5, barWidth - 10, currentHeight);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Current', x + 5, y + height - 2);

            // Baseline
            const baselineHeight = (baselineFPS / maxVal) * (height - 20);
            this.ctx.fillStyle = '#FFE66D';
            this.ctx.fillRect(x + barWidth + 5, y + height - baselineHeight - 5, barWidth - 10, baselineHeight);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Baseline', x + barWidth + 5, y + height - 2);

            // Target
            const targetHeight = (60 / maxVal) * (height - 20);
            this.ctx.fillStyle = '#38ef7d';
            this.ctx.fillRect(x + barWidth * 2 + 5, y + height - targetHeight - 5, barWidth - 10, targetHeight);
            this.ctx.fillStyle = 'white';
            this.ctx.fillText('Target', x + barWidth * 2 + 5, y + height - 2);
        }
    }

    // Add custom metric
    addCustomMetric(name, value, color = '#FFFFFF') {
        if (!this.dataHistory[name]) {
            this.dataHistory[name] = [];
        }
        this.dataHistory[name].push(value);
        if (this.dataHistory[name].length > this.maxHistoryLength) {
            this.dataHistory[name].shift();
        }
    }

    // Clear all data
    clearData() {
        Object.keys(this.dataHistory).forEach(key => {
            this.dataHistory[key] = [];
        });
    }

    // Destroy
    destroy() {
        this.stopUpdating();
        if (this.canvas) {
            this.canvas.remove();
        }
        const toggle = document.getElementById('data-viz-toggle');
        if (toggle) {
            toggle.remove();
        }
    }
}