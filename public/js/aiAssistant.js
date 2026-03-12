import { REAL_PLANET_DATA } from './planetData.js';
import { PLANET_EDUCATION } from './planetEducation.js';

export class AIAssistant {
  constructor() {
    this.chatWindow = document.getElementById('ai-chat-window');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('ai-input');
    this.sendBtn = document.getElementById('send-ai');
    this.closeBtn = document.getElementById('close-ai');
    this.dockBtn = document.getElementById('dock-ai');

    this.init();
  }

  init() {
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.handleMessage());
    }
    if (this.chatInput) {
      this.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleMessage();
      });
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.toggle(false));
    }
    if (this.dockBtn) {
      this.dockBtn.addEventListener('click', () => this.toggle());
    }
  }

  toggle(force) {
    if (force !== undefined) {
      if (force) this.chatWindow.classList.remove('hidden');
      else this.chatWindow.classList.add('hidden');
    } else {
      this.chatWindow.classList.toggle('hidden');
    }
    if (!this.chatWindow.classList.contains('hidden')) {
      this.chatInput.focus();
    }
  }

  handleMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.addMessage(text, 'user');
    this.chatInput.value = '';

    // Simple NLP logic
    setTimeout(() => {
      const response = this.generateResponse(text.toLowerCase());
      this.addMessage(response, 'ai');
    }, 500);
  }

  addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}-message`;
    msg.textContent = text;
    this.chatMessages.appendChild(msg);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  generateResponse(input) {
    // Check for planets
    for (const planetName in REAL_PLANET_DATA) {
      if (input.includes(planetName)) {
        const data = REAL_PLANET_DATA[planetName];
        const edu = PLANET_EDUCATION[planetName] || {};

        if (input.includes('gravity') || input.includes('weight')) {
          return `${data.name}'s surface gravity is ${data.surfaceGravity} m/s². On Earth, it's 9.81 m/s².`;
        }
        if (input.includes('temperature') || input.includes('hot') || input.includes('cold')) {
          return `${data.name} has a mean temperature of ${data.meanTemperature}K. ${edu.funFacts ? edu.funFacts[0] : ''}`;
        }
        if (input.includes('mission') || input.includes('visit')) {
          if (edu.missions && edu.missions.length > 0) {
            return `Key missions to ${data.name} include ${edu.missions[0].name} (${edu.missions[0].year}).`;
          }
          return `There are limited or no recorded landing missions to ${data.name}.`;
        }
        if (input.includes('fact')) {
          if (edu.funFacts) return edu.funFacts[Math.floor(Math.random() * edu.funFacts.length)];
        }

        return `${data.name} is a fascinating world. It orbits at ${data.semiMajorAxis.toLocaleString()} km from the Sun. What specific data would you like?`;
      }
    }

    if (input.includes('hello') || input.includes('hi')) {
      return "Greetings, Commander. I am your onboard AI. Ask me about any planet or celestial body.";
    }
    if (input.includes('who are you') || input.includes('help')) {
      return "I am the v3.0 Solar Assistant. I can provide physical data, mission history, and habitability analysis for our solar system.";
    }

    return "I'm not sure about that. Try asking about a specific planet like 'Tell me about Mars' or 'What is Jupiter's gravity?'.";
  }
}
