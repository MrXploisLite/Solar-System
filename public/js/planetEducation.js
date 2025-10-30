// Educational data for planets including missions, habitability, and comparisons
import { NASA_MISSIONS } from './missionData.js';

export const PLANET_EDUCATION = {
  mercury: {
    missions: [
      { name: "Mariner 10", year: "1974-1975", status: "Completed", achievement: "First spacecraft to visit Mercury, mapped 45% of surface" },
      { name: "MESSENGER", year: "2011-2015", status: "Completed", achievement: "First to orbit Mercury, mapped entire surface, discovered water ice" },
      { name: "BepiColombo", year: "2025 arrival", status: "En route", achievement: "ESA/JAXA mission studying Mercury's magnetic field and composition" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ No atmosphere - instant exposure to space",
        "❌ Extreme temperatures: -180°C to +430°C",
        "❌ No water or ice on surface",
        "❌ Intense solar radiation",
        "❌ No magnetic field protection"
      ],
      verdict: "Impossible for human habitation"
    },
    earthComparison: {
      size: "38% of Earth's diameter",
      gravity: "38% of Earth's gravity (you'd weigh 38% less)",
      dayLength: "176 Earth days (one Mercury day)",
      yearLength: "88 Earth days",
      temperature: "430°C day / -180°C night vs Earth's 15°C average"
    },
    funFacts: [
      "🌡️ Mercury has the most extreme temperature range of any planet",
      "🏃 Despite being closest to the Sun, it's not the hottest planet (Venus is)",
      "🌙 Mercury has no moons",
      "💨 A year on Mercury is shorter than a day on Mercury!",
      "🧲 Has a weak magnetic field, unusual for such a small planet"
    ]
  },

  venus: {
    missions: [
      { name: "Venera Program", year: "1961-1984", status: "Completed", achievement: "Soviet missions, first to land on another planet and send back images" },
      { name: "Magellan", year: "1990-1994", status: "Completed", achievement: "Mapped 98% of Venus surface using radar" },
      { name: "Venus Express", year: "2006-2014", status: "Completed", achievement: "ESA mission studied atmosphere and weather patterns" },
      { name: "Akatsuki", year: "2015-present", status: "Active", achievement: "Japanese orbiter studying Venus's atmosphere" },
      { name: "DAVINCI+", year: "2031", status: "Planned", achievement: "NASA mission to study atmosphere and surface" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ Surface temperature: 462°C (hot enough to melt lead)",
        "❌ Atmospheric pressure: 92x Earth (like being 900m underwater)",
        "❌ Atmosphere: 96% CO₂, sulfuric acid clouds",
        "❌ No water",
        "⚠️ Upper atmosphere (50km up) has Earth-like pressure and temperature"
      ],
      verdict: "Surface impossible, but floating cloud cities theoretically possible"
    },
    earthComparison: {
      size: "95% of Earth's diameter (almost twins)",
      gravity: "90% of Earth's gravity",
      dayLength: "243 Earth days (rotates backwards!)",
      yearLength: "225 Earth days",
      temperature: "462°C vs Earth's 15°C average"
    },
    funFacts: [
      "🔄 Venus rotates backwards (retrograde rotation)",
      "🌅 The Sun rises in the west on Venus",
      "☁️ Sulfuric acid rain evaporates before reaching the ground",
      "🌍 Venus is Earth's 'evil twin' - similar size but hellish conditions",
      "⚡ Lightning storms are common in the thick atmosphere"
    ]
  },

  earth: {
    missions: [
      { name: "ISS", year: "1998-present", status: "Active", achievement: "27 years of continuous human presence in space" },
      { name: "Hubble Space Telescope", year: "1990-present", status: "Active", achievement: "Revolutionary observations of universe" },
      { name: "James Webb Space Telescope", year: "2021-present", status: "Active", achievement: "Observing earliest galaxies and exoplanets" },
      { name: "Earth Observation Satellites", year: "Ongoing", status: "Active", achievement: "Monitoring climate, weather, and environmental changes" }
    ],
    habitability: {
      score: 10,
      reasons: [
        "✅ Perfect temperature range for liquid water",
        "✅ Protective atmosphere with oxygen",
        "✅ Magnetic field shields from radiation",
        "✅ Abundant water (71% surface coverage)",
        "✅ Only known planet with life"
      ],
      verdict: "The only known habitable planet in the universe"
    },
    earthComparison: {
      size: "Baseline (12,742 km diameter)",
      gravity: "Baseline (9.8 m/s²)",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperature: "15°C average"
    },
    funFacts: [
      "🌊 Earth is the only planet with liquid water on its surface",
      "🧲 Earth's magnetic field protects us from solar radiation",
      "🌍 70% of Earth's surface is covered by water",
      "🌱 Earth is the only known planet with life",
      "🌙 Earth's Moon is unusually large compared to the planet"
    ]
  },

  mars: {
    missions: [
      { name: "Viking 1 & 2", year: "1976", status: "Completed", achievement: "First successful Mars landings" },
      { name: "Spirit & Opportunity", year: "2004-2018", status: "Completed", achievement: "Rovers confirmed Mars once had liquid water" },
      { name: "Curiosity", year: "2012-present", status: "Active", achievement: "Found evidence Mars was once habitable" },
      { name: "Perseverance", year: "2021-present", status: "Active", achievement: "Collecting samples for return to Earth, testing MOXIE oxygen production" },
      { name: "Ingenuity", year: "2021-present", status: "Active", achievement: "First powered flight on another planet (60+ flights)" },
      { name: "Mars Sample Return", year: "2030s", status: "Planned", achievement: "Bring Perseverance samples back to Earth" },
      { name: "Human Mission", year: "2030s-2040s", status: "Planned", achievement: "First humans on Mars" }
    ],
    habitability: {
      score: 4,
      reasons: [
        "✅ Water ice at poles and subsurface",
        "✅ Day length similar to Earth (24.6 hours)",
        "✅ Evidence of past habitability",
        "⚠️ Thin atmosphere (1% of Earth's)",
        "⚠️ Cold: average -60°C",
        "⚠️ High radiation (no magnetic field)",
        "⚠️ Low pressure (can't breathe, water boils)"
      ],
      verdict: "Most promising for human colonization with proper technology"
    },
    earthComparison: {
      size: "53% of Earth's diameter",
      gravity: "38% of Earth's gravity (easier to move around)",
      dayLength: "24.6 hours (very similar to Earth!)",
      yearLength: "687 Earth days (1.9 Earth years)",
      temperature: "-60°C average vs Earth's 15°C"
    },
    funFacts: [
      "🏔️ Olympus Mons: tallest volcano in solar system (21 km high)",
      "🌊 Mars once had rivers, lakes, and possibly oceans",
      "🔴 Red color comes from iron oxide (rust) in the soil",
      "🌙 Mars has two tiny moons: Phobos and Deimos",
      "🚁 Ingenuity helicopter proved flight is possible on Mars"
    ],
    colonization: {
      challenges: [
        "6-9 month journey from Earth",
        "Radiation exposure during transit and on surface",
        "Need to produce oxygen, water, and fuel locally",
        "Psychological effects of isolation",
        "Communication delay: 4-24 minutes"
      ],
      solutions: [
        "MOXIE: produces oxygen from CO₂ atmosphere",
        "Extract water from ice deposits",
        "Underground habitats for radiation protection",
        "Nuclear power for energy",
        "Grow food in greenhouses"
      ],
      timeline: NASA_MISSIONS.mars.timeline
    }
  },

  jupiter: {
    missions: [
      { name: "Pioneer 10 & 11", year: "1973-1974", status: "Completed", achievement: "First spacecraft to visit Jupiter" },
      { name: "Voyager 1 & 2", year: "1979", status: "Completed", achievement: "Discovered Jupiter's rings and active volcanoes on Io" },
      { name: "Galileo", year: "1995-2003", status: "Completed", achievement: "Orbited Jupiter, discovered subsurface ocean on Europa" },
      { name: "Juno", year: "2016-present", status: "Active", achievement: "Studying Jupiter's atmosphere, magnetic field, and interior" },
      { name: "Europa Clipper", year: "2024 launch", status: "Planned", achievement: "Investigate Europa's potential for life" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ No solid surface (gas giant)",
        "❌ Extreme pressure and temperature in atmosphere",
        "❌ Deadly radiation belts",
        "❌ Crushing gravity",
        "⭐ Moon Europa may have habitable subsurface ocean"
      ],
      verdict: "Jupiter itself uninhabitable, but moons are interesting"
    },
    earthComparison: {
      size: "1,120% of Earth's diameter (11x wider)",
      gravity: "253% of Earth's gravity (you'd weigh 2.5x more)",
      dayLength: "10 hours (fastest rotation of any planet)",
      yearLength: "12 Earth years",
      temperature: "-145°C at cloud tops"
    },
    funFacts: [
      "🌪️ Great Red Spot: storm larger than Earth, raging for 400+ years",
      "🌙 Jupiter has 95 known moons",
      "🛡️ Jupiter's gravity protects Earth by deflecting asteroids",
      "⚡ Lightning on Jupiter is 3x more powerful than Earth's",
      "🌊 Europa's ocean may contain 2x more water than all Earth's oceans"
    ]
  },

  saturn: {
    missions: [
      { name: "Pioneer 11", year: "1979", status: "Completed", achievement: "First spacecraft to visit Saturn" },
      { name: "Voyager 1 & 2", year: "1980-1981", status: "Completed", achievement: "Detailed images of rings and moons" },
      { name: "Cassini-Huygens", year: "2004-2017", status: "Completed", achievement: "13 years orbiting Saturn, Huygens landed on Titan" },
      { name: "Dragonfly", year: "2027 launch, 2034 arrival", status: "Planned", achievement: "Rotorcraft to explore Titan's surface" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ No solid surface (gas giant)",
        "❌ Extreme cold and pressure",
        "❌ Deadly radiation",
        "⭐ Moon Titan has thick atmosphere and liquid methane lakes",
        "⭐ Moon Enceladus has subsurface ocean with potential for life"
      ],
      verdict: "Saturn uninhabitable, but Titan is fascinating for exploration"
    },
    earthComparison: {
      size: "945% of Earth's diameter (9.5x wider)",
      gravity: "106% of Earth's gravity (similar to Earth!)",
      dayLength: "10.7 hours",
      yearLength: "29 Earth years",
      temperature: "-178°C average"
    },
    funFacts: [
      "💍 Saturn's rings are made of billions of ice particles",
      "🪶 Saturn is the least dense planet - it would float in water!",
      "🌙 Saturn has 146 known moons",
      "🌊 Titan is the only moon with a dense atmosphere",
      "💨 Hexagonal storm at Saturn's north pole"
    ]
  },

  uranus: {
    missions: [
      { name: "Voyager 2", year: "1986", status: "Completed", achievement: "Only spacecraft to visit Uranus" },
      { name: "Uranus Orbiter", year: "2030s", status: "Proposed", achievement: "Detailed study of Uranus and its moons" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ No solid surface (ice giant)",
        "❌ Extreme cold: -224°C",
        "❌ Toxic atmosphere (hydrogen, helium, methane)",
        "❌ Extreme pressure",
        "❌ 84-year seasons due to sideways tilt"
      ],
      verdict: "Completely uninhabitable"
    },
    earthComparison: {
      size: "400% of Earth's diameter (4x wider)",
      gravity: "90% of Earth's gravity",
      dayLength: "17 hours",
      yearLength: "84 Earth years",
      temperature: "-224°C average"
    },
    funFacts: [
      "🔄 Uranus rotates on its side (98° tilt)",
      "🌀 Rolls like a ball as it orbits the Sun",
      "💎 It may rain diamonds on Uranus",
      "🌙 Uranus has 27 known moons, named after Shakespeare characters",
      "💨 Coldest planetary atmosphere in the solar system"
    ]
  },

  neptune: {
    missions: [
      { name: "Voyager 2", year: "1989", status: "Completed", achievement: "Only spacecraft to visit Neptune" },
      { name: "Neptune Orbiter", year: "2030s+", status: "Proposed", achievement: "Study Neptune's atmosphere and moon Triton" }
    ],
    habitability: {
      score: 0,
      reasons: [
        "❌ No solid surface (ice giant)",
        "❌ Extreme cold: -214°C",
        "❌ Strongest winds in solar system (2,100 km/h)",
        "❌ Toxic atmosphere",
        "❌ Extreme pressure"
      ],
      verdict: "Completely uninhabitable"
    },
    earthComparison: {
      size: "388% of Earth's diameter (3.9x wider)",
      gravity: "114% of Earth's gravity",
      dayLength: "16 hours",
      yearLength: "165 Earth years",
      temperature: "-214°C average"
    },
    funFacts: [
      "💨 Fastest winds in the solar system: 2,100 km/h",
      "🔵 Blue color from methane in atmosphere",
      "🌙 Moon Triton orbits backwards (retrograde)",
      "❄️ Triton has nitrogen geysers",
      "🌌 Neptune was discovered by mathematics before observation"
    ]
  }
};

// Habitability scoring system
export function getHabitabilityColor(score) {
  if (score >= 8) return '#00ff00'; // Green
  if (score >= 5) return '#ffff00'; // Yellow
  if (score >= 3) return '#ff9900'; // Orange
  return '#ff0000'; // Red
}

export function getHabitabilityLabel(score) {
  if (score >= 8) return 'Habitable';
  if (score >= 5) return 'Potentially Habitable';
  if (score >= 3) return 'Challenging';
  if (score >= 1) return 'Extremely Difficult';
  return 'Impossible';
}
