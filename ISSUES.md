# Known Issues & Solutions

## Fixed Issues

### ✅ THREE.Material 'emissive' Error
**Fixed**: Removed emissive property from MeshBasicMaterial (not supported)

### ✅ Space.com CORS Error
**Fixed**: Removed Space.com RSS feed (CORS blocked), using NASA RSS only

## Common Issues

### 1. Port 3000 Already in Use
**Solution**: Change port in `src/server.ts`
```typescript
const server = Bun.serve({
  port: 3001, // Change this
  // ...
});
```

### 2. Black Screen on Load
**Causes**:
- WebGL not supported
- Graphics drivers outdated
- Browser compatibility

**Solutions**:
- Check browser console (F12)
- Update graphics drivers
- Try different browser (Chrome recommended)
- Verify WebGL: https://get.webgl.org/

### 3. News Not Loading
**Causes**:
- No internet connection
- RSS feeds temporarily down
- CORS issues

**Solutions**:
- Check internet connection
- Wait 5 minutes for retry
- Fallback news will display automatically
- Check browser console for errors

### 4. Low FPS / Laggy Performance
**Solutions**:
- Close other browser tabs
- Reduce simulation speed (use slider)
- Lower asteroid count in `public/js/solarSystem.js`:
  ```javascript
  // Change 2000 to 500
  const instancedMesh = new THREE.InstancedMesh(geometry, material, 500);
  ```
- Disable other browser extensions
- Use hardware acceleration

### 5. Planets Not Moving
**Cause**: Simulation is paused

**Solution**: Click the "Play" button in UI

### 6. Can't Click Planets
**Causes**:
- Raycaster not initialized
- Camera reference missing

**Solution**: Refresh the page

### 7. News Appears Too Frequently
**Solution**: Edit `public/js/newsManager.js`
```javascript
// Change 300000 (5 min) to desired milliseconds
setTimeout(() => this.showNextNews(), 600000); // 10 minutes
```

## Browser-Specific Issues

### Safari
- May have WebGL performance issues
- Try enabling "Experimental Features" in Develop menu

### Firefox
- Hardware acceleration must be enabled
- Check: about:config → webgl.force-enabled

### Edge
- Should work out of the box
- Update to latest version if issues

## Performance Optimization

### For Low-End Devices
1. Reduce asteroid count (see issue #4)
2. Lower star count in `public/js/solarSystem.js`:
   ```javascript
   for (let i = 0; i < 5000; i++) { // Changed from 10000
   ```
3. Disable orbit lines:
   ```javascript
   // Comment out orbit creation in createPlanets()
   ```

### For High-End Devices
1. Increase detail:
   ```javascript
   const planetGeometry = new THREE.SphereGeometry(radius, 64, 64); // Higher segments
   ```
2. Add shadows (performance impact):
   ```javascript
   this.renderer.shadowMap.enabled = true;
   ```

## Development Issues

### Hot Reload Not Working
**Solution**: Restart dev server
```bash
# Stop server (Ctrl+C)
bun run dev
```

### Dependencies Not Installing
**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules
rm bun.lockb
bun install
```

### TypeScript Errors
**Solution**: Bun handles TypeScript automatically, but if issues persist:
```bash
bun add -d @types/three
```

## Reporting New Issues

If you encounter a new issue:

1. Check browser console (F12)
2. Note your system info:
   - OS and version
   - Browser and version
   - Bun version (`bun --version`)
3. Try to reproduce the issue
4. Document steps to reproduce

## Need Help?

- Check `TECHNICAL.md` for implementation details
- Review code comments in source files
- Test in different browser
- Check internet connection for news features

---

**Last Updated**: October 2025
