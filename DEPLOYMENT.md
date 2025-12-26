# Deployment Guide

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) 1.3.0 or higher
- Modern web browser with WebGL support

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open browser
# http://localhost:3000
```

### Production Deployment
```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Deployment Options

### 1. Self-Hosted (Recommended)
- Run on any server with Bun installed
- No external dependencies required
- Full control over data and privacy

### 2. Cloud Platforms
- **Vercel**: `bun run build` then deploy
- **Netlify**: Drag and drop `dist/` folder
- **Heroku**: Use Bun buildpack
- **AWS**: Deploy to EC2 or Lambda

### 3. Docker
```dockerfile
FROM oven/bun:1.1.42-alpine
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production
COPY . .
EXPOSE 3000
CMD ["bun", "run", "start"]
```

## Environment Variables
No environment variables required! All APIs are free and public.

## Performance Tuning

### For High Traffic
- Increase server resources
- Enable CDN for static assets
- Consider caching API responses

### For Low-End Devices
- Use "Low" quality preset
- Reduce asteroid count in `solarSystem.js`
- Disable trails and bloom effects

## Monitoring

### Key Metrics
- **FPS**: Should be 60+ on modern hardware
- **Memory**: ~8MB base + ~2MB per texture
- **API Response**: < 2 seconds for all endpoints

### Health Checks
- `/` should return the main application
- All JavaScript files should load without errors
- WebGL should be supported by the browser

## Troubleshooting

### Common Issues
1. **Port already in use**: Change port in `src/server.ts`
2. **Textures not loading**: Check `public/textures/` directory
3. **API failures**: Verify internet connection, fallbacks will activate
4. **Low FPS**: Switch to "Low" quality preset

### Logs
Check browser console for:
- WebGL errors
- API failures
- Performance warnings

## Security

### Best Practices
- Keep Bun updated
- Use HTTPS in production
- Monitor API usage
- Regular dependency updates

### Firewall Rules
- No special ports required
- Outbound HTTP/HTTPS for APIs
- Inbound 3000 (or configured port)

## Backup Strategy

### Files to Backup
- `public/js/` - Application logic
- `public/css/` - Styling
- `src/` - Server code
- `package.json` - Dependencies

### Files NOT to Backup
- `node_modules/` - Can be recreated
- `dist/` - Build output
- `public/textures/` - Large files, download separately

## Scaling

### Horizontal Scaling
- Multiple instances behind load balancer
- No shared state required
- Stateless architecture

### Vertical Scaling
- Increase server resources
- Monitor memory usage
- Optimize texture loading

## Updates

### Application Updates
```bash
git pull origin main
bun install
bun run build
bun run start
```

### Dependency Updates
```bash
bun update
# Test thoroughly before deploying
```

## Support

### Documentation
- `README.md` - Quick start and features
- `TECHNICAL.md` - Architecture details
- `DEPLOYMENT.md` - This file

### Community
- GitHub Issues for bugs
- Pull requests for features
- Discussions for questions

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Status**: Production Ready