# NASA Solar System Explorer - Interactive 3D Visualization

A stunning, real-time 3D solar system visualization with realistic physics, NASA-accurate data, atmospheric effects, and comprehensive educational information.

**Created by**: Romy Rianata  
**Tech Stack**: Bun + Three.js + WebGL + Post-Processing  
**Data Source**: NASA JPL Horizons System & Solar System Scope

## ✨ Features

### Celestial Bodies
- **8 Major Planets** with accurate NASA data and realistic textures
- **5 Dwarf Planets** (Ceres, Pluto, Eris, Makemake, Haumea)
- **Sun** with enhanced corona shader and glow effects
- **Earth's Moon** with detailed lunar surface texture
- **Saturn's Rings** with alpha transparency
- **2,000 Asteroids** in the asteroid belt (instanced rendering)
- **5,000 Kuiper Belt objects** beyond Neptune

### Visual Effects
- **Realistic 2K Planet Textures** from NASA/ESA data
- **Atmospheric Glow** with custom shaders for 7 planets
- **Bloom Post-Processing** for cinematic sun glow
- **Planet Trails** with color-coded paths (500 points per planet)
- **PBR Materials** with proper roughness and metalness
- **Earth Cloud Layer** with independent rotation
- **Milky Way Skybox** background

### Interactive Features
- **Smooth Camera Controls** with OrbitControls
- **Fly-to-Planet Animation** with easing (2s duration)
- **Quick Navigation Panel** with 14 celestial body buttons
- **Click-to-Info** system with comprehensive NASA data
- **Real-time Orbital Mechanics** with Kepler's laws
- **Adjustable Time Speed** (0.1x to 10x)

### Performance & Quality
- **Real-time FPS Monitor** with color-coded display
- **4 Quality Presets** (Low/Medium/High/Ultra)
- **Optimized Rendering** with 60+ FPS target
- **Adaptive Pixel Ratio** based on quality settings
- **Efficient Trail System** with buffer geometry

### Educational Content
- **Detailed Planet Information** (mass, gravity, temperature, etc.)
- **Fun Facts** for each celestial body
- **Orbital Data** (distance, speed, period, tilt)
- **Temperature** in both Kelvin and Celsius
- **Astronomical Units** (AU) for distances

## Quick Start

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Open browser
http://localhost:3000
```

## 🎮 Controls

### Mouse Controls
| Action | Control |
|--------|---------|
| Rotate View | Left mouse drag |
| Pan View | Right mouse drag |
| Zoom In/Out | Mouse wheel |
| Select Planet | Click on planet |

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| **Space** | Pause/Resume simulation |
| **R** | Reset camera to default view |
| **T** | Toggle planet trails on/off |
| **C** | Clear all planet trails |
| **P** | Toggle performance panel |

### UI Controls
- **Play/Pause Button** - Control simulation
- **Reset Camera** - Return to overview
- **Hide/Show Trails** - Toggle trail visibility
- **Clear Trails** - Reset all trail paths
- **Speed Slider** - Adjust time speed (0.1x-10x)
- **Planet Buttons** - Quick navigation to any body
- **Quality Dropdown** - Adjust graphics quality

## 🎨 Customization

### Adjust Graphics Quality
Use the quality dropdown in the performance panel:
- **Low**: Best for older devices (bloom off, trails off)
- **Medium**: Balanced performance (bloom on, atmosphere off)
- **High**: Recommended (all effects on, 2x pixel ratio)
- **Ultra**: Maximum quality (native pixel ratio, max bloom)

### Modify Planet Properties
Edit `public/js/solarSystem.js`:
```javascript
const PLANET_DATA = {
  earth: { 
    radius: 10,      // Visual size
    color: 0x2233FF, // Hex color
    distance: 300,   // Distance from sun
    speed: 2.98      // Orbital speed
  }
};
```

### Change Trail Length
```javascript
this.maxTrailPoints = 500; // Increase for longer trails
```

### Adjust Camera Animation Speed
```javascript
this.cameraAnimation.duration = 2.0; // Seconds for fly-to animation
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | Change port in `src/server.ts` |
| **Black screen** | Check browser console (F12), verify WebGL support |
| **Low FPS** | Switch to Low/Medium quality preset |
| **Textures not loading** | Check `public/textures/` folder exists |
| **Trails lagging** | Reduce `maxTrailPoints` or disable trails |
| **No news showing** | Check internet connection, fallback news will display |

## 📊 Performance Tips

1. **Use Quality Presets**: Start with "High" and adjust down if needed
2. **Disable Trails**: Press T to toggle trails for +10-15 FPS
3. **Lower Pixel Ratio**: Switch to Medium quality for 2x performance
4. **Close Other Tabs**: Free up GPU resources
5. **Monitor FPS**: Press P to show/hide performance panel

## Documentation

- `README.md` - This file (quick start & usage)
- `TECHNICAL.md` - Implementation details & architecture
- `PROJECT_SUMMARY.md` - Complete project overview
- `CHANGELOG.md` - Version history
- `ISSUES.md` - Known issues & solutions
- `WELCOME.txt` - ASCII art welcome screen

## System Info

- **Bun Version**: 1.3.0
- **Three.js**: 0.170.0
- **Node Modules**: ES Modules
- **Target**: Modern browsers with WebGL

---

**Created by Romy Rianata**  
**Powered by NASA Public Data**
