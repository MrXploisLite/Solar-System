export class SaveManager {
    constructor() {
        this.storageKey = 'nasa_solar_system_save';
    }

    saveState(state) {
        try {
            const saveData = {
                version: '3.0.0',
                timestamp: Date.now(),
                camera: {
                    position: state.camera.position.toArray(),
                    target: state.camera.target.toArray()
                },
                settings: {
                    timeSpeed: state.timeSpeed,
                    isPaused: state.isPaused,
                    showTrails: state.showTrails,
                    quality: state.quality
                },
                favorites: state.favorites || []
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Failed to save state:', error);
            return false;
        }
    }

    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return null;

            const data = JSON.parse(saved);
            return data;
        } catch (error) {
            console.error('Failed to load state:', error);
            return null;
        }
    }

    saveFavorite(name, camera, target) {
        try {
            const saved = this.loadState() || { favorites: [] };

            const favorite = {
                name,
                timestamp: Date.now(),
                camera: camera.toArray(),
                target: target.toArray()
            };

            saved.favorites = saved.favorites || [];
            saved.favorites.push(favorite);

            localStorage.setItem(this.storageKey, JSON.stringify(saved));
            return true;
        } catch (error) {
            console.error('Failed to save favorite:', error);
            return false;
        }
    }

    getFavorites() {
        const saved = this.loadState();
        return saved?.favorites || [];
    }

    deleteFavorite(index) {
        try {
            const saved = this.loadState();
            if (!saved || !saved.favorites) return false;

            saved.favorites.splice(index, 1);
            localStorage.setItem(this.storageKey, JSON.stringify(saved));
            return true;
        } catch (error) {
            console.error('Failed to delete favorite:', error);
            return false;
        }
    }

    exportData() {
        const data = this.loadState();
        if (!data) return null;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `solar-system-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return true;
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    localStorage.setItem(this.storageKey, JSON.stringify(data));
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    clearAll() {
        localStorage.removeItem(this.storageKey);
    }
}
