// Real NASA planetary data - accurate as of 2025
// Source: NASA JPL Horizons System & Planetary Fact Sheets

export const REAL_PLANET_DATA = {
  sun: {
    name: 'Sun',
    radius: 696000, // km
    mass: 1.989e30, // kg
    rotationPeriod: 25.38, // days
    color: 0xFDB813,
    temperature: 5778, // K
    luminosity: 3.828e26 // watts
  },
  mercury: {
    name: 'Mercury',
    radius: 2439.7, // km
    mass: 3.3011e23, // kg
    semiMajorAxis: 57909050, // km
    eccentricity: 0.205630,
    inclination: 7.005, // degrees
    orbitalPeriod: 87.969, // days
    rotationPeriod: 58.646, // days
    axialTilt: 0.034, // degrees
    meanOrbitalVelocity: 47.36, // km/s
    albedo: 0.142,
    surfaceGravity: 3.7, // m/s²
    escapeVelocity: 4.25, // km/s
    meanTemperature: 440, // K
    textureMap: '/textures/mercury_8k.jpg',
    bumpMap: '/textures/mercury_bump_8k.jpg'
  },
  venus: {
    name: 'Venus',
    radius: 6051.8, // km
    mass: 4.8675e24, // kg
    semiMajorAxis: 108208000, // km
    eccentricity: 0.006772,
    inclination: 3.39458, // degrees
    orbitalPeriod: 224.701, // days
    rotationPeriod: -243.025, // days (retrograde)
    axialTilt: 177.36, // degrees
    meanOrbitalVelocity: 35.02, // km/s
    albedo: 0.689,
    surfaceGravity: 8.87, // m/s²
    escapeVelocity: 10.36, // km/s
    meanTemperature: 737, // K
    atmosphere: true,
    atmosphereColor: 0xFFC649,
    textureMap: '/textures/venus_8k.jpg',
    atmosphereMap: '/textures/venus_atmosphere_8k.jpg'
  },
  earth: {
    name: 'Earth',
    radius: 6371.0, // km
    mass: 5.97237e24, // kg
    semiMajorAxis: 149598023, // km (1 AU)
    eccentricity: 0.0167086,
    inclination: 0.00005, // degrees
    orbitalPeriod: 365.256, // days
    rotationPeriod: 0.99726968, // days
    axialTilt: 23.4392811, // degrees
    meanOrbitalVelocity: 29.78, // km/s
    albedo: 0.306,
    surfaceGravity: 9.807, // m/s²
    escapeVelocity: 11.186, // km/s
    meanTemperature: 288, // K
    atmosphere: true,
    atmosphereColor: 0x4A90E2,
    textureMap: '/textures/earth_8k.jpg',
    nightMap: '/textures/earth_night_8k.jpg',
    specularMap: '/textures/earth_specular_8k.jpg',
    bumpMap: '/textures/earth_bump_8k.jpg',
    cloudsMap: '/textures/earth_clouds_8k.jpg'
  },
  mars: {
    name: 'Mars',
    radius: 3389.5, // km
    mass: 6.4171e23, // kg
    semiMajorAxis: 227939200, // km
    eccentricity: 0.0934,
    inclination: 1.850, // degrees
    orbitalPeriod: 686.980, // days
    rotationPeriod: 1.025957, // days
    axialTilt: 25.19, // degrees
    meanOrbitalVelocity: 24.07, // km/s
    albedo: 0.170,
    surfaceGravity: 3.711, // m/s²
    escapeVelocity: 5.027, // km/s
    meanTemperature: 210, // K
    atmosphere: true,
    atmosphereColor: 0xCD5C5C,
    textureMap: '/textures/mars_8k.jpg',
    bumpMap: '/textures/mars_bump_8k.jpg'
  },
  jupiter: {
    name: 'Jupiter',
    radius: 69911, // km
    mass: 1.8982e27, // kg
    semiMajorAxis: 778570000, // km
    eccentricity: 0.0489,
    inclination: 1.303, // degrees
    orbitalPeriod: 4332.589, // days
    rotationPeriod: 0.41354, // days
    axialTilt: 3.13, // degrees
    meanOrbitalVelocity: 13.07, // km/s
    albedo: 0.503,
    surfaceGravity: 24.79, // m/s²
    escapeVelocity: 59.5, // km/s
    meanTemperature: 165, // K
    atmosphere: true,
    atmosphereColor: 0xC88B3A,
    textureMap: '/textures/jupiter_8k.jpg'
  },
  saturn: {
    name: 'Saturn',
    radius: 58232, // km
    mass: 5.6834e26, // kg
    semiMajorAxis: 1433530000, // km
    eccentricity: 0.0565,
    inclination: 2.485, // degrees
    orbitalPeriod: 10759.22, // days
    rotationPeriod: 0.44401, // days
    axialTilt: 26.73, // degrees
    meanOrbitalVelocity: 9.68, // km/s
    albedo: 0.499,
    surfaceGravity: 10.44, // m/s²
    escapeVelocity: 35.5, // km/s
    meanTemperature: 134, // K
    rings: true,
    ringInnerRadius: 74500, // km
    ringOuterRadius: 140220, // km
    atmosphere: true,
    atmosphereColor: 0xFAD5A5,
    textureMap: '/textures/saturn_8k.jpg',
    ringMap: '/textures/saturn_ring_8k.png'
  },
  uranus: {
    name: 'Uranus',
    radius: 25362, // km
    mass: 8.6810e25, // kg
    semiMajorAxis: 2872460000, // km
    eccentricity: 0.046381,
    inclination: 0.773, // degrees
    orbitalPeriod: 30688.5, // days
    rotationPeriod: -0.71833, // days (retrograde)
    axialTilt: 97.77, // degrees
    meanOrbitalVelocity: 6.80, // km/s
    albedo: 0.488,
    surfaceGravity: 8.87, // m/s²
    escapeVelocity: 21.3, // km/s
    meanTemperature: 76, // K
    atmosphere: true,
    atmosphereColor: 0x4FD0E7,
    textureMap: '/textures/uranus_8k.jpg'
  },
  neptune: {
    name: 'Neptune',
    radius: 24622, // km
    mass: 1.02413e26, // kg
    semiMajorAxis: 4495060000, // km
    eccentricity: 0.009456,
    inclination: 1.767975, // degrees
    orbitalPeriod: 60182, // days
    rotationPeriod: 0.67125, // days
    axialTilt: 28.32, // degrees
    meanOrbitalVelocity: 5.43, // km/s
    albedo: 0.442,
    surfaceGravity: 11.15, // m/s²
    escapeVelocity: 23.5, // km/s
    meanTemperature: 72, // K
    atmosphere: true,
    atmosphereColor: 0x4166F5,
    textureMap: '/textures/neptune_8k.jpg'
  }
};

// Moon data
export const MOON_DATA = {
  moon: {
    name: 'Moon',
    radius: 1737.4, // km
    mass: 7.342e22, // kg
    semiMajorAxis: 384400, // km from Earth
    orbitalPeriod: 27.321661, // days
    rotationPeriod: 27.321661, // days (tidally locked)
    axialTilt: 6.687, // degrees
    albedo: 0.136,
    surfaceGravity: 1.62, // m/s²
    textureMap: '/textures/moon_8k.jpg',
    bumpMap: '/textures/moon_bump_8k.jpg'
  }
};

// Scale factors for visualization (real distances are too large)
export const SCALE_FACTORS = {
  distance: 0.00001, // Scale down distances
  radius: 0.00005, // Scale down radii
  speed: 0.1 // Speed multiplier for animation
};
