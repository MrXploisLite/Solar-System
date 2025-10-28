export class NewsManager {
  constructor() {
    this.newsItems = [];
    this.currentIndex = 0;
    this.notificationElement = document.getElementById('news-notification');
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
        title: "International Space Station Celebrates 25 Years",
        description: "NASA and its international partners mark 25 years of continuous human presence aboard the ISS, enabling groundbreaking research.",
        source: "NASA",
        link: "https://www.nasa.gov/missions/station/"
      },
      {
        title: "James Webb Telescope Discovers Ancient Galaxies",
        description: "The James Webb Space Telescope has identified some of the oldest galaxies in the universe, dating back 13.4 billion years.",
        source: "NASA",
        link: "https://www.nasa.gov/mission_pages/webb/"
      },
      {
        title: "Artemis Program Prepares for Moon Landing",
        description: "NASA's Artemis program continues preparations for landing astronauts on the Moon, paving the way for Mars exploration.",
        source: "NASA",
        link: "https://www.nasa.gov/artemis/"
      },
      {
        title: "New Exoplanet Discovered in Habitable Zone",
        description: "Astronomers have discovered a potentially habitable exoplanet orbiting a nearby star, raising hopes for finding life beyond Earth.",
        source: "Space.com",
        link: "https://www.space.com/"
      },
      {
        title: "Solar Activity Reaches Peak of 11-Year Cycle",
        description: "The Sun is approaching the peak of its 11-year activity cycle, with increased solar flares and auroras visible on Earth.",
        source: "NASA",
        link: "https://www.nasa.gov/sun/"
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
}
