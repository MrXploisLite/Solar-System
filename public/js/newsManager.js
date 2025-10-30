import { NASA_MISSIONS, MISSION_STATS, ISS_RESEARCH_AREAS } from './missionData.js';

export class NewsManager {
  constructor() {
    this.newsItems = [];
    this.currentIndex = 0;
    this.notificationElement = document.getElementById('news-notification');
    this.missionData = NASA_MISSIONS;
  }

  async fetchSpaceNews() {
    try {
      // Fetch from multiple free RSS sources
      const sources = [
        { url: '/api/space-news', type: 'nasa' }
      ];

      for (const source of sources) {
        try {
          const response = await fetch(source.url);
          const text = await response.text();
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'text/xml');

          const items = xml.querySelectorAll('item');
          items.forEach((item, index) => {
            if (index < 10) { // Limit to 10 items per source
              const title = item.querySelector('title')?.textContent || 'No title';
              const description = item.querySelector('description')?.textContent || 'No description';
              const link = item.querySelector('link')?.textContent || '#';
              const pubDate = item.querySelector('pubDate')?.textContent || '';

              this.newsItems.push({
                title: this.cleanText(title),
                description: this.cleanText(description),
                link,
                source: source.type,
                date: pubDate
              });
            }
          });
        } catch (err) {
          console.warn(`Failed to fetch from ${source.type}:`, err);
        }
      }

      // Fallback: Add some static astronomy news if fetch fails
      if (this.newsItems.length === 0) {
        this.newsItems = this.getFallbackNews();
      }

    } catch (error) {
      console.error('Error fetching space news:', error);
      this.newsItems = this.getFallbackNews();
    }
  }

  getFallbackNews() {
    return [
      {
        title: "🛰️ ISS: 27 Years of Continuous Human Presence in Space",
        description: "The International Space Station has enabled groundbreaking research for deep space exploration. Over 3,000 scientific investigations from 108 countries have tested life support systems, studied microgravity effects, and developed technologies critical for Artemis Moon missions and future Mars exploration.",
        source: "NASA ISS Program",
        link: "https://www.nasa.gov/missions/station/iss-research/international-space-station-launching-nasa-and-humanity-into-deep-space/"
      },
      {
        title: "🌙 Artemis II: Crewed Moon Mission Set for 2025",
        description: "NASA's Artemis II will send astronauts around the Moon in September 2025, the first crewed lunar mission since Apollo 17. This paves the way for Artemis III's historic landing in 2026, targeting the lunar South Pole where water ice could support future Moon bases.",
        source: "NASA Artemis",
        link: "https://www.nasa.gov/artemis/"
      },
      {
        title: "🔴 Mars Perseverance: Collecting Samples for Earth Return",
        description: "NASA's Perseverance rover continues exploring Jezero Crater, collecting rock samples that may contain signs of ancient microbial life. These samples will be returned to Earth in the 2030s, while the mission tests technologies needed for human Mars exploration.",
        source: "NASA Mars Exploration",
        link: "https://mars.nasa.gov/mars2020/"
      },
      {
        title: "🚀 Deep Space Technology: From ISS to Mars",
        description: "Research aboard the ISS is directly enabling Mars missions. Water recycling achieves 98% efficiency, oxygen generation systems are proven, and studies on bone density loss and muscle atrophy inform countermeasures for the 6-9 month journey to Mars.",
        source: "NASA Technology",
        link: "https://www.nasa.gov/technology/"
      },
      {
        title: "🌌 James Webb Reveals Ancient Universe",
        description: "The James Webb Space Telescope continues discovering galaxies from 13.4 billion years ago, just after the Big Bang. Its observations of exoplanet atmospheres help identify potentially habitable worlds beyond our solar system.",
        source: "NASA Webb",
        link: "https://www.nasa.gov/mission_pages/webb/"
      },
      {
        title: "🛸 Ingenuity Helicopter: 60+ Flights on Mars",
        description: "NASA's Ingenuity helicopter has completed over 60 flights on Mars, proving aerial exploration is possible in the thin Martian atmosphere. This technology demonstration opens new possibilities for future Mars missions and human exploration.",
        source: "NASA JPL",
        link: "https://mars.nasa.gov/technology/helicopter/"
      },
      {
        title: "🌊 Europa Clipper: Searching for Life Beyond Earth",
        description: "Launching in 2024, NASA's Europa Clipper will investigate Jupiter's moon Europa, which harbors a vast subsurface ocean beneath its icy crust. The mission will assess whether Europa could support life in its hidden ocean.",
        source: "NASA Europa Mission",
        link: "https://europa.nasa.gov/"
      },
      {
        title: "⚡ Nuclear Propulsion for Faster Mars Transit",
        description: "NASA is developing nuclear thermal and electric propulsion systems that could cut Mars journey time from 7 months to 3-4 months, reducing crew radiation exposure and enabling more ambitious deep space missions.",
        source: "NASA Advanced Propulsion",
        link: "https://www.nasa.gov/directorates/spacetech/"
      },
      {
        title: "🏗️ Lunar Gateway: Building a Moon Space Station",
        description: "The Lunar Gateway will orbit the Moon as a staging point for Artemis missions and a testbed for Mars technologies. First modules launch in 2025, supporting sustainable lunar exploration and serving as a communications hub.",
        source: "NASA Gateway",
        link: "https://www.nasa.gov/gateway/"
      },
      {
        title: "🧪 MOXIE Success: Making Oxygen on Mars",
        description: "NASA's MOXIE experiment on Perseverance has successfully produced oxygen from Mars' CO2 atmosphere. This in-situ resource utilization technology is crucial for future human missions, providing breathable air and rocket fuel.",
        source: "NASA Mars Technology",
        link: "https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/"
      }
    ];
  }

  cleanText(text) {
    // Remove HTML tags and clean up text
    const div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent.trim().substring(0, 200);
  }

  showNotification(newsItem) {
    this.notificationElement.innerHTML = `
      <h3>🌟 ${newsItem.title}</h3>
      <p>${newsItem.description}</p>
      <div class="source">
        Source: ${newsItem.source}
        ${newsItem.date ? `• ${new Date(newsItem.date).toLocaleDateString()}` : ''}
      </div>
    `;

    this.notificationElement.classList.remove('hidden');

    // Auto-hide after 15 seconds
    setTimeout(() => {
      this.notificationElement.classList.add('hidden');
    }, 15000);

    // Add click to close
    this.notificationElement.onclick = () => {
      this.notificationElement.classList.add('hidden');
    };
  }

  startFetching() {
    // Initial fetch
    this.fetchSpaceNews().then(() => {
      if (this.newsItems.length > 0) {
        // Show first notification after 5 seconds
        setTimeout(() => this.showNextNews(), 5000);
      }
    });

    // Refresh news every hour
    setInterval(() => {
      this.fetchSpaceNews();
    }, 3600000);
  }

  showNextNews() {
    if (this.newsItems.length === 0) return;

    const newsItem = this.newsItems[this.currentIndex];
    this.showNotification(newsItem);

    this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;

    // Show next news in 5 minutes (300000ms)
    setTimeout(() => this.showNextNews(), 300000);
  }

  // Get detailed mission information
  getMissionDetails(missionName) {
    const missions = {
      'iss': this.missionData.iss,
      'artemis': this.missionData.artemis,
      'mars': this.missionData.mars,
      'deepspace': this.missionData.deepSpace
    };
    return missions[missionName.toLowerCase()] || null;
  }

  // Get all mission statistics
  getMissionStats() {
    return MISSION_STATS;
  }

  // Get ISS research areas
  getResearchAreas() {
    return ISS_RESEARCH_AREAS;
  }

  // Display detailed mission info (can be called from UI)
  showMissionDetails(missionName) {
    const mission = this.getMissionDetails(missionName);
    if (!mission) return;

    console.log(`📊 ${mission.name} Details:`, mission);
    return mission;
  }
}
