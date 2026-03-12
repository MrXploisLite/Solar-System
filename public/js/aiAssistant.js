import { PLANET_EDUCATION } from './planetEducation.js';
import { REAL_PLANET_DATA } from './planetData.js';

export class AIAssistant {
  constructor(solarSystem) {
    this.solarSystem = solarSystem;
    this.isVisible = false;
    this.messages = [];
    this.createUI();
  }

  createUI() {
    this.container = document.createElement('div');
    this.container.id = 'ai-assistant';
    this.container.className = 'ai-assistant hidden';
    this.container.innerHTML = `
      <div class="ai-header">
        <h3>✨ Space Assistant</h3>
        <button id="ai-close">×</button>
      </div>
      <div id="ai-messages" class="ai-messages">
        <div class="ai-message bot">Hello! I'm your AI Space Assistant. Ask me anything about the solar system! Try asking about "Earth's habitability" or "Mars missions".</div>
      </div>
      <div class="ai-input-area">
        <input type="text" id="ai-input" placeholder="Ask a question...">
        <button id="ai-send">Send</button>
      </div>
    `;
    document.body.appendChild(this.container);

    document.getElementById('ai-close').addEventListener('click', () => this.toggle());
    document.getElementById('ai-send').addEventListener('click', () => this.handleInput());
    document.getElementById('ai-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleInput();
    });
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.container.classList.toggle('hidden', !this.isVisible);
    if (this.isVisible) {
      document.getElementById('ai-input').focus();
    }
  }

  handleInput() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    this.addMessage(text, 'user');
    input.value = '';

    setTimeout(() => {
      const response = this.generateResponse(text);
      this.addMessage(response, 'bot');
    }, 500);
  }

  addMessage(text, sender) {
    const messagesDiv = document.getElementById('ai-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  generateResponse(input) {
    const query = input.toLowerCase();

    // Find the planet mentioned
    const planets = Object.keys(REAL_PLANET_DATA);
    const planet = planets.find(p => query.includes(p));

    if (planet) {
      const data = REAL_PLANET_DATA[planet];
      const edu = PLANET_EDUCATION[planet];

      if (query.includes('habitability')) {
        return `${planet.toUpperCase()} habitability score: ${edu.habitability.score}/10. ${edu.habitability.verdict}`;
      }
      if (query.includes('mission')) {
        return `Key missions to ${planet}: ${edu.missions.map(m => m.name).join(', ')}.`;
      }
      if (query.includes('temperature') || query.includes('hot') || query.includes('cold')) {
        return `The mean temperature of ${planet} is ${data.meanTemperature}K (${(data.meanTemperature - 273.15).toFixed(1)}°C).`;
      }
      if (query.includes('distance')) {
        return `${planet.toUpperCase()} is ${(data.semiMajorAxis / 1e6).toFixed(1)} million km from the Sun.`;
      }
      if (query.includes('gravity')) {
        return `Surface gravity on ${planet} is ${data.surfaceGravity} m/s².`;
      }
      if (query.includes('fact')) {
        const fact = edu.funFacts[Math.floor(Math.random() * edu.funFacts.length)];
        return fact;
      }

      // Default planet response
      return `${planet.toUpperCase()} is a fascinating world. It has a radius of ${data.radius} km and an orbital period of ${data.orbitalPeriod} days. What else would you like to know?`;
    }

    if (query.includes('who are you') || query.includes('what can you do')) {
      return "I'm your AI Space Assistant. I can tell you all about the planets, their missions, habitability, and more!";
    }

    if (query.includes('iss')) {
      return "The International Space Station (ISS) orbits Earth at about 400km altitude. It's been continuously inhabited for over 20 years!";
    }

    return "I'm sorry, I don't quite understand. Try asking about a specific planet or its features!";
  }
}
