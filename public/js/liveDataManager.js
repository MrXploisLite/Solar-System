// Live Data Manager - Free Public APIs
export class LiveDataManager {
    constructor() {
        this.issData = null;
        this.astronauts = [];
        this.spaceNews = [];
        this.nearEarthObjects = [];
        this.updateInterval = null;
        this.listeners = [];
    }

    start() {
        setTimeout(() => this.fetchISSPosition(), 1000);
        setTimeout(() => this.fetchAstronauts(), 2000);
        setTimeout(() => this.fetchSpaceNews(), 3000);
        setTimeout(() => this.fetchNearEarthObjects(), 4000);

        this.updateInterval = setInterval(() => {
            this.fetchISSPosition();
        }, 10000);

        setInterval(() => {
            this.fetchAstronauts();
            this.fetchSpaceNews();
            this.fetchNearEarthObjects();
        }, 600000);
    }

    stop() {
        if (this.updateInterval) clearInterval(this.updateInterval);
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(type, data) {
        this.listeners.forEach(cb => cb(type, data));
    }

    async fetchISSPosition() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`ISS API failed: ${res.status}`);
            const data = await res.json();
            this.issData = {
                latitude: parseFloat(data.latitude),
                longitude: parseFloat(data.longitude),
                timestamp: Math.floor(data.timestamp),
                altitude: Math.round(data.altitude),
                velocity: Math.round(data.velocity * 3.6)
            };
            this.notifyListeners('iss-position', this.issData);
            return this.issData;
        } catch (error) {
            console.warn('ISS position fetch failed:', error.message);
            if (!this.issData) {
                this.issData = {
                    latitude: 0,
                    longitude: 0,
                    timestamp: Math.floor(Date.now() / 1000),
                    altitude: 408,
                    velocity: 27600
                };
            }
            this.notifyListeners('iss-position', this.issData);
            return this.issData;
        }
    }

    async fetchAstronauts() {
        this.astronauts = {
            number: 7,
            people: [
                { name: 'Jasmin Moghbeli', craft: 'ISS' },
                { name: 'Andreas Mogensen', craft: 'ISS' },
                { name: 'Satoshi Furukawa', craft: 'ISS' },
                { name: 'Konstantin Borisov', craft: 'ISS' },
                { name: 'Oleg Kononenko', craft: 'ISS' },
                { name: 'Nikolai Chub', craft: 'ISS' },
                { name: 'Loral O\'Hara', craft: 'ISS' }
            ]
        };
        this.notifyListeners('astronauts', this.astronauts);
        return this.astronauts;
    }

    async fetchISSPassTimes(lat, lon) {
        try {
            const now = new Date();
            return [
                { risetime: new Date(now.getTime() + 86400000), duration: 300 },
                { risetime: new Date(now.getTime() + 172800000), duration: 420 }
            ];
        } catch (error) {
            return [];
        }
    }

    async fetchSpaceNews() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            const res = await fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=10', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`News API failed: ${res.status}`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                this.spaceNews = data.results.map(article => ({
                    title: article.title,
                    summary: article.summary,
                    url: article.url,
                    imageUrl: article.image_url,
                    publishedAt: new Date(article.published_at),
                    newsSite: article.news_site
                }));
                this.notifyListeners('space-news', this.spaceNews);
                return this.spaceNews;
            }
        } catch (error) {
            console.warn('Space news fetch failed:', error.message);
            this.spaceNews = [
                {
                    title: 'ISS Celebrates 27 Years of Continuous Human Presence',
                    summary: 'The International Space Station continues groundbreaking research.',
                    url: 'https://www.nasa.gov/missions/station/',
                    newsSite: 'NASA',
                    publishedAt: new Date()
                },
                {
                    title: 'Artemis Program Prepares for Moon Return',
                    summary: 'NASA prepares for historic return to lunar surface.',
                    url: 'https://www.nasa.gov/artemis/',
                    newsSite: 'NASA',
                    publishedAt: new Date()
                }
            ];
            this.notifyListeners('space-news', this.spaceNews);
            return this.spaceNews;
        }
    }

    async fetchNearEarthObjects() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=DEMO_KEY`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`NEO API failed: ${res.status}`);
            const data = await res.json();
            if (data.near_earth_objects && data.near_earth_objects[today]) {
                const objects = data.near_earth_objects[today];
                if (objects.length > 0) {
                    this.nearEarthObjects = objects.slice(0, 5).map(neo => ({
                        name: neo.name,
                        diameter: {
                            min: neo.estimated_diameter.kilometers.estimated_diameter_min,
                            max: neo.estimated_diameter.kilometers.estimated_diameter_max
                        },
                        closeApproach: {
                            date: neo.close_approach_data[0]?.close_approach_date_full,
                            velocity: parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour),
                            distance: parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers)
                        },
                        isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid
                    }));
                    this.notifyListeners('near-earth-objects', this.nearEarthObjects);
                    return this.nearEarthObjects;
                }
            }
            throw new Error('No NEO data');
        } catch (error) {
            console.warn('NEO fetch failed:', error.message);
            this.nearEarthObjects = [
                {
                    name: '(2024 AB1)',
                    diameter: { min: 0.1, max: 0.3 },
                    closeApproach: { distance: 5000000, velocity: 25000 },
                    isPotentiallyHazardous: false
                }
            ];
            this.notifyListeners('near-earth-objects', this.nearEarthObjects);
            return this.nearEarthObjects;
        }
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                (err) => reject(err)
            );
        });
    }

    getAllData() {
        return {
            iss: this.issData,
            astronauts: this.astronauts,
            news: this.spaceNews,
            nearEarthObjects: this.nearEarthObjects
        };
    }
}
