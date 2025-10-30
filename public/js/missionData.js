// NASA Mission Data - ISS, Artemis, Mars Exploration
// Updated: October 2025

export const NASA_MISSIONS = {
  iss: {
    name: "International Space Station",
    status: "Active",
    launchDate: "November 20, 1998",
    yearsActive: 27,
    altitude: 408, // km
    speed: 27600, // km/h
    orbitalPeriod: 92.68, // minutes
    crew: 7,
    description: "The ISS has enabled 25+ years of continuous human presence in space, serving as a testbed for deep space exploration technologies and conducting groundbreaking research impossible on Earth.",
    achievements: [
      "Over 3,000 scientific investigations from 108 countries",
      "Testing life support systems for deep space missions",
      "Studying effects of microgravity on human physiology",
      "Developing advanced materials and medical treatments",
      "International cooperation among 5 space agencies"
    ],
    futureGoals: [
      "Continue research until at least 2030",
      "Transition to commercial space stations",
      "Support Artemis lunar missions",
      "Enable Mars mission preparation"
    ]
  },
  
  artemis: {
    name: "Artemis Program",
    status: "In Progress",
    goal: "Return humans to the Moon and establish sustainable presence",
    targetDate: "2026-2028",
    description: "NASA's Artemis program will land the first woman and first person of color on the Moon, establishing a long-term lunar presence as a stepping stone to Mars.",
    missions: [
      {
        name: "Artemis I",
        status: "Completed",
        date: "November 2022",
        achievement: "Uncrewed test flight of Orion spacecraft and SLS rocket - successful"
      },
      {
        name: "Artemis II",
        status: "Planned",
        date: "September 2025",
        goal: "First crewed flight around the Moon since Apollo 17"
      },
      {
        name: "Artemis III",
        status: "Planned",
        date: "2026",
        goal: "First crewed lunar landing since 1972, targeting South Pole region"
      },
      {
        name: "Artemis IV+",
        status: "Future",
        date: "2028+",
        goal: "Establish Lunar Gateway space station and sustainable Moon base"
      }
    ],
    technology: [
      "Space Launch System (SLS) - Most powerful rocket ever built",
      "Orion spacecraft - Deep space crew vehicle",
      "Lunar Gateway - Moon-orbiting space station",
      "Human Landing System (HLS) - SpaceX Starship variant",
      "Advanced spacesuits for lunar surface operations"
    ],
    whyTheMoon: [
      "Test technologies for Mars missions",
      "Learn to live and work on another world",
      "Utilize lunar resources (water ice at poles)",
      "Conduct unique scientific research",
      "Inspire next generation of explorers"
    ]
  },
  
  mars: {
    name: "Mars Exploration Program",
    status: "Active",
    goal: "Prepare for human missions to Mars in the 2030s-2040s",
    description: "NASA is conducting robotic exploration of Mars while developing technologies needed to send humans to the Red Planet.",
    currentMissions: [
      {
        name: "Perseverance Rover",
        status: "Active",
        landed: "February 18, 2021",
        location: "Jezero Crater",
        mission: "Search for signs of ancient microbial life, collect rock samples for future return to Earth",
        achievement: "First to collect samples for Mars Sample Return mission"
      },
      {
        name: "Ingenuity Helicopter",
        status: "Active",
        landed: "February 18, 2021",
        mission: "First powered flight on another planet",
        achievement: "Completed 60+ flights, proving aerial exploration is possible on Mars"
      },
      {
        name: "Curiosity Rover",
        status: "Active",
        landed: "August 6, 2012",
        location: "Gale Crater",
        mission: "Study Mars' climate and geology, assess habitability",
        achievement: "Confirmed Mars once had conditions suitable for microbial life"
      },
      {
        name: "Mars Reconnaissance Orbiter",
        status: "Active",
        arrived: "March 10, 2006",
        mission: "High-resolution imaging, climate monitoring, communications relay"
      }
    ],
    humanMissionChallenges: [
      "Journey duration: 6-9 months each way",
      "Radiation exposure during transit and on surface",
      "Life support systems for 2-3 year missions",
      "Landing large payloads on Mars",
      "In-situ resource utilization (making fuel, water, oxygen on Mars)",
      "Psychological effects of isolation and confinement",
      "Communication delay: 4-24 minutes one-way"
    ],
    technologies: [
      "Nuclear propulsion for faster transit",
      "Advanced radiation shielding",
      "Closed-loop life support systems",
      "Mars oxygen production (MOXIE experiment)",
      "Autonomous systems and AI",
      "3D printing with Martian materials"
    ],
    timeline: [
      "2020s: Robotic sample return missions",
      "Late 2020s: Lunar Gateway and Moon base operational",
      "2030s: First crewed Mars orbital mission",
      "Late 2030s-2040s: First humans land on Mars"
    ]
  },
  
  deepSpace: {
    name: "Deep Space Exploration",
    description: "Beyond the Moon and Mars, NASA is exploring the outer solar system and beyond",
    missions: [
      {
        name: "James Webb Space Telescope",
        status: "Active",
        launched: "December 25, 2021",
        achievement: "Observing the earliest galaxies, studying exoplanet atmospheres, revealing universe's secrets"
      },
      {
        name: "Europa Clipper",
        status: "Launching 2024",
        target: "Jupiter's moon Europa",
        goal: "Investigate potential for life in Europa's subsurface ocean"
      },
      {
        name: "Dragonfly",
        status: "Planned 2027",
        target: "Saturn's moon Titan",
        goal: "Rotorcraft mission to explore prebiotic chemistry"
      }
    ]
  }
};

// Key statistics for visualization
export const MISSION_STATS = {
  issOrbitsPerDay: 15.5,
  issDistanceTraveled: 4e9, // km since launch
  artemisCrewSize: 4,
  marsJourneyTime: 7, // months average
  marsDistanceMin: 54.6e6, // km at closest approach
  marsDistanceMax: 401e6, // km at farthest
  moonDistance: 384400 // km average
};

// Research areas enabled by ISS for deep space
export const ISS_RESEARCH_AREAS = {
  humanHealth: {
    name: "Human Health & Performance",
    importance: "Understanding how long-duration spaceflight affects the human body",
    discoveries: [
      "Bone density loss countermeasures",
      "Muscle atrophy prevention through exercise",
      "Vision changes from fluid shifts",
      "Immune system alterations",
      "Cardiovascular adaptation"
    ],
    application: "Critical for 2-3 year Mars missions"
  },
  
  lifeSupportSystems: {
    name: "Life Support & Sustainability",
    importance: "Developing closed-loop systems for long missions",
    technologies: [
      "Water recycling (98% efficiency)",
      "Oxygen generation from water",
      "CO2 removal and conversion",
      "Waste management and recycling",
      "Food production in microgravity"
    ],
    application: "Essential for Mars missions and lunar bases"
  },
  
  materials: {
    name: "Materials Science",
    importance: "Creating advanced materials in microgravity",
    research: [
      "Protein crystal growth for drug development",
      "Fiber optics manufacturing",
      "Metal alloys with unique properties",
      "3D printing in space",
      "Self-healing materials"
    ],
    application: "Both space applications and Earth benefits"
  },
  
  technology: {
    name: "Technology Demonstration",
    importance: "Testing systems before deep space deployment",
    systems: [
      "Robotic systems and AI",
      "Advanced propulsion concepts",
      "Radiation shielding materials",
      "Communication systems",
      "Autonomous operations"
    ],
    application: "Reduces risk for Artemis and Mars missions"
  }
};
