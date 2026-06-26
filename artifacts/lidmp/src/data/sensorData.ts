export interface SensorReading {
  id: string;
  name: string;
  instrument: string;
  band?: string;
  value: number;
  unit: string;
  confidence: number;
  status: "nominal" | "warning" | "critical";
  description: string;
  color: string;
  proof: {
    method: string;
    threshold: string;
    reference: string;
    alternatives: string[];
    rawData: string;
  };
}

export interface LandingSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  safetyScore: number;
  iceConfidence: number;
  slope: number;
  illumination: number;
  thermalVariance: number;
  elevation: number;
  status: "primary" | "backup" | "rejected";
  reason: string;
  proof: {
    method: string;
    coordinates: string;
    source: string;
    alternatives: string;
  };
}

export interface RoverWaypoint {
  id: string;
  lat: number;
  lon: number;
  type: "start" | "waypoint" | "science" | "end";
  label: string;
  distanceKm: number;
  solarHours: number;
  proof: {
    reason: string;
    terrain: string;
    science: string;
  };
}

export interface LunarCrater {
  id: string;
  name: string;
  lat: number;
  lon: number;
  diameterKm: number;
  depthM: number;
  psrArea: number;
  iceConfidence: number;
  minTempK: number;
  description: string;
  psrType: "doubly-shadowed" | "permanently-shadowed";
  highlight: string;
}

export const lunarCraters: LunarCrater[] = [
  {
    id: "shackleton",
    name: "Shackleton",
    lat: -89.9, lon: 0.0,
    diameterKm: 21, depthM: 4200,
    psrArea: 83, iceConfidence: 94,
    minTempK: 38,
    description: "Near-perfect PSR — rim receives near-continuous sunlight while interior stays frozen. LCROSS confirmed ice near south pole.",
    psrType: "doubly-shadowed",
    highlight: "Primary ISRO target — highest ice confidence of all south-pole craters",
  },
  {
    id: "haworth",
    name: "Haworth",
    lat: -87.5, lon: 355.0,
    diameterKm: 51, depthM: 3900,
    psrArea: 71, iceConfidence: 87,
    minTempK: 42,
    description: "Large PSR crater with layered ice deposits. LRO Diviner data shows stable sub-40K zones.",
    psrType: "doubly-shadowed",
    highlight: "Largest accessible PSR near south pole — excellent backup landing zone",
  },
  {
    id: "nobile",
    name: "Nobile",
    lat: -85.2, lon: 53.5,
    diameterKm: 73, depthM: 3200,
    psrArea: 67, iceConfidence: 79,
    minTempK: 45,
    description: "Extensive permanently-shadowed interior. MINI-RF CPR ratio >2.0 across 67% of floor.",
    psrType: "permanently-shadowed",
    highlight: "Largest crater in region — high volume ice but steep approach",
  },
  {
    id: "degerlache",
    name: "de Gerlache",
    lat: -88.5, lon: 272.0,
    diameterKm: 32, depthM: 3600,
    psrArea: 78, iceConfidence: 86,
    minTempK: 40,
    description: "Well-characterized PSR with Chandrayaan-1 MINISAR data confirming ice deposits.",
    psrType: "doubly-shadowed",
    highlight: "Strong DFSAR signal — secondary ISRO priority site",
  },
  {
    id: "sverdrup",
    name: "Sverdrup",
    lat: -88.3, lon: 152.0,
    diameterKm: 35, depthM: 2800,
    psrArea: 62, iceConfidence: 75,
    minTempK: 47,
    description: "Mid-size PSR with moderate ice signature. Good solar access on rim for power generation.",
    psrType: "permanently-shadowed",
    highlight: "Best rim illumination of all PSR craters — ideal for solar power",
  },
  {
    id: "cabeus",
    name: "Cabeus",
    lat: -84.9, lon: 310.9,
    diameterKm: 98, depthM: 4700,
    psrArea: 58, iceConfidence: 91,
    minTempK: 35,
    description: "LCROSS impact site (2009) — NASA directly confirmed water ice vapor 5.6% by mass. Deepest temperature recorded.",
    psrType: "doubly-shadowed",
    highlight: "DIRECT NASA confirmation of water ice — only crater with in-situ proof",
  },
];

export const sensorReadings: SensorReading[] = [
  {
    id: "dfsar",
    name: "DFSAR",
    instrument: "Dual Frequency SAR",
    band: "L+S Band",
    value: 2.14,
    unit: "CPR",
    confidence: 93,
    status: "nominal",
    description: "Circular Polarization Ratio indicating subsurface ice deposits at 1–3m depth",
    color: "#0ea5e9",
    proof: {
      method: "Radar CPR analysis — ice causes double-bounce backscatter raising the ratio above 1.8 threshold",
      threshold: "CPR > 1.8 = ice present (Chandrayaan-1 MINI-RF baseline)",
      reference: "Spudis et al. 2013, JGR Planets — MINI-RF CPR ice detection validated at poles",
      alternatives: [
        "Silicate regolith (CPR ~0.4–0.8) — ruled out",
        "Rough terrain with no ice (CPR ~1.0–1.4) — ruled out by DOP cross-check",
        "Surface ice frost (CPR ~1.6–1.9) — possible but DOP confirms volume scattering = buried ice",
      ],
      rawData: "L-band CPR: 2.14 | S-band CPR: 1.89 | Cross-pol: 0.73 | Co-pol: 0.34 | Incidence: 47°",
    },
  },
  {
    id: "dfsar-dop",
    name: "DFSAR DOP",
    instrument: "Dual Frequency SAR",
    band: "L+S Band",
    value: 0.07,
    unit: "DOP",
    confidence: 91,
    status: "nominal",
    description: "Degree of Polarization — low DOP confirms volume scattering from buried ice",
    color: "#0ea5e9",
    proof: {
      method: "DOP < 0.3 indicates depolarization from sub-surface volume scattering — hallmark of ice",
      threshold: "DOP < 0.3 = volume scatterer present (ice/regolith mix)",
      reference: "Raney 2007, IEEE GRSS — DOP metric for lunar ice discrimination",
      alternatives: [
        "Surface rock (DOP ~0.6–0.9) — eliminated",
        "Dust layers (DOP ~0.4–0.7) — eliminated by thermal correlation",
        "Hydrocarbon ice (DOP ~0.1–0.2) — possible but H2O ice dominant at these temps",
      ],
      rawData: "DOP: 0.073 | mSPD: 0.41 | μ_CPR: 2.14 | Stokes S1: 0.88 | S2: -0.31 | S3: 0.07 | S4: 0.04",
    },
  },
  {
    id: "ohrc",
    name: "OHRC",
    instrument: "Orbiter High Res Camera",
    band: "Visible",
    value: 0.25,
    unit: "m/px",
    confidence: 98,
    status: "nominal",
    description: "Surface morphology imaging at 0.25m resolution over target region",
    color: "#8b5cf6",
    proof: {
      method: "Panchromatic imaging at 0.25m GSD — detects surface boulders, slopes, and albedo anomalies",
      threshold: "Resolution sufficient for boulder-free zone verification (>2m clearance)",
      reference: "Chandrayaan-2 OHRC — Arya et al. 2021, Current Science",
      alternatives: [
        "Lower resolution (5m) would miss critical hazard boulders",
        "NIR imaging would reveal more mineralogy but OHRC confirms terrain safety",
        "SAR-only approach lacks surface-detail confidence",
      ],
      rawData: "Swath: 3km | GSD: 0.25m | Altitude: 100km | Pass: 14:23 UTC | Cloud: N/A (no atmosphere)",
    },
  },
  {
    id: "lola",
    name: "LOLA DEM",
    instrument: "Lunar Orbiter Laser Alt.",
    value: 5.0,
    unit: "m/px",
    confidence: 97,
    status: "nominal",
    description: "Digital Elevation Model — 5m resolution topographic data, South Pole",
    color: "#10b981",
    proof: {
      method: "LOLA 5-beam laser altimeter aboard LRO — slope and roughness from elevation differences",
      threshold: "Slope < 5° required for safe landing; roughness < 0.3m RMS",
      reference: "Smith et al. 2010, Science — LOLA topography of lunar poles",
      alternatives: [
        "OHRC stereo-DEM (0.5m) available but limited coverage",
        "Mini-RF DEM from InSAR — complementary source used for cross-check",
        "Earth-based radar (lower accuracy at poles) — used as sanity check only",
      ],
      rawData: "Slope: 2.1° | Roughness: 0.18m RMS | Elevation: -1240m | Shot density: 57 pts/m²",
    },
  },
  {
    id: "illum",
    name: "Illumination",
    instrument: "Illumination Map",
    value: 18.3,
    unit: "% time",
    confidence: 95,
    status: "warning",
    description: "Permanently Shadowed Region detected — 81.7% in shadow, PSR confirmed",
    color: "#f59e0b",
    proof: {
      method: "LOLA + ray-tracing over 18.6-year Metonic cycle — fraction of time each pixel receives sunlight",
      threshold: "> 70% shadow over 18.6yr = Permanently Shadowed Region (PSR)",
      reference: "Mazarico et al. 2011, Icarus — illumination conditions at lunar poles",
      alternatives: [
        "Near-permanent illumination sites (>80%) exist on ridges — unsuitable for ice",
        "Partial PSR (40–70% shadow) has ice but lower confidence",
        "Shackleton rim: 83% illuminated — ideal solar power + PSR ice access",
      ],
      rawData: "Illumination: 18.3% | Shadow: 81.7% | PSR type: Doubly-shadowed | Cycle: 18.6yr | GSD: 240m",
    },
  },
  {
    id: "diviner",
    name: "Diviner",
    instrument: "Diviner Thermal",
    value: 42.7,
    unit: "K",
    confidence: 94,
    status: "nominal",
    description: "Surface temperature 42.7K in PSR — ideal ice preservation conditions",
    color: "#f43f5e",
    proof: {
      method: "LRO Diviner thermal radiometer — measures bolometric temperature in 9 spectral channels",
      threshold: "T < 110K: ice stable; T < 50K: pristine ice preserved for billions of years",
      reference: "Paige et al. 2010, Science — coldest measured temperatures in the solar system",
      alternatives: [
        "At 42.7K — water ice sublimation rate < 1mm per billion years",
        "CO2 ice possible below 80K — present in trace amounts confirmed by Chandrayaan-1",
        "Methane ice possible below 90K — not detected at this site",
      ],
      rawData: "Tbol: 42.7K | Tmax: 388K (in sunlit region) | ΔT: 345K | Flux: 0.003 W/m² | Channels: 9",
    },
  },
  {
    id: "lroc",
    name: "LROC NAC",
    instrument: "LRO Narrow Angle Camera",
    value: 0.5,
    unit: "m proxy",
    confidence: 89,
    status: "nominal",
    description: "High-res proxy imaging confirming surface texture consistent with ice",
    color: "#6366f1",
    proof: {
      method: "Flash illumination in permanently-shadowed regions using off-axis solar illumination proxy",
      threshold: "Surface albedo > 0.15 in PSR consistent with exposed/near-surface ice",
      reference: "Zuber et al. 2012, Nature — LRO observations of permanently shadowed craters",
      alternatives: [
        "High albedo could be fresh regolith from recent impact — checked against crater density",
        "Specular reflection artefacts ruled out by multi-angle imaging",
        "Potential for frost (not buried ice) — cross-checked with CPR for depth confirmation",
      ],
      rawData: "Albedo: 0.18 | Resolution: 0.5m/px | Solar angle: 1.2° (indirect) | Phase: 156° | NAC-L+R mosaic",
    },
  },
];

export const landingSites: LandingSite[] = [
  {
    id: "LS-01",
    name: "Shackleton Rim Alpha",
    lat: -89.54, lon: 0.0,
    safetyScore: 94, iceConfidence: 93,
    slope: 2.1, illumination: 78.4,
    thermalVariance: 12.3, elevation: -1240,
    status: "primary",
    reason: "High ice confidence, optimal slope, near-continuous solar access",
    proof: {
      method: "Multi-criteria scoring: slope (LOLA), ice (DFSAR CPR+DOP), illumination (ray-trace), thermal (Diviner)",
      coordinates: "89.54°S, 0.00°E | Elevation: -1,240m | LOLA DTM tile: SP_C4H1",
      source: "Chandrayaan-2 OHRC image: ch2_ohrc_20231104_1423_SPA_001 | LRO LOLA DEM v1.3",
      alternatives: "LS-02 de Gerlache: 87% safety but 16% less illumination. LS-03 Haworth: steeper terrain.",
    },
  },
  {
    id: "LS-02",
    name: "de Gerlache Beta",
    lat: -88.3, lon: 272.0,
    safetyScore: 87, iceConfidence: 87,
    slope: 3.4, illumination: 65.2,
    thermalVariance: 18.7, elevation: -920,
    status: "backup",
    reason: "Good ice signal, slightly higher slope, acceptable illumination",
    proof: {
      method: "DFSAR CPR L-band = 1.94 (above threshold), slope from LOLA = 3.4°, Diviner = 49K",
      coordinates: "88.30°S, 272.00°E | Elevation: -920m | LOLA tile: SP_C4H7",
      source: "Chandrayaan-1 MINI-RF data: MRF_28NP_2009_342 | LRO LOLA DEM v1.3",
      alternatives: "Inferior illumination vs LS-01 limits solar power. Slope acceptable but not optimal.",
    },
  },
  {
    id: "LS-03",
    name: "Haworth Gamma",
    lat: -87.6, lon: 312.0,
    safetyScore: 71, iceConfidence: 71,
    slope: 5.8, illumination: 45.1,
    thermalVariance: 31.2, elevation: -560,
    status: "backup",
    reason: "Moderate ice signal, steeper terrain, limited solar window",
    proof: {
      method: "CPR = 1.71 (marginally above threshold). Slope 5.8° near safety limit (5°). Illumination poor.",
      coordinates: "87.60°S, 312.00°E | Elevation: -560m | LOLA tile: SP_C3H9",
      source: "LRO MINI-RF: MRFLRO_3NP_2011_089 | LOLA DEM v1.3 | Diviner channel 7",
      alternatives: "Terrain risk is primary concern. Could be activated if LS-01/02 unavailable.",
    },
  },
  {
    id: "LS-04",
    name: "Nobile Ridge",
    lat: -85.2, lon: 54.0,
    safetyScore: 38, iceConfidence: 38,
    slope: 8.9, illumination: 22.3,
    thermalVariance: 55.6, elevation: 340,
    status: "rejected",
    reason: "Low ice confidence, excessive slope gradient, poor illumination",
    proof: {
      method: "CPR = 0.93 (below ice threshold 1.8). Slope 8.9° exceeds safety limit. Diviner = 68K (marginal).",
      coordinates: "85.20°S, 54.00°E | Elevation: +340m | LOLA tile: SP_C2H2",
      source: "LRO MINI-RF + LOLA DEM v1.3 | Chandrayaan-2 CLASS X-ray spectrometer",
      alternatives: "Rejected for all parameters. Maintained in database for completeness.",
    },
  },
];

export const roverWaypoints: RoverWaypoint[] = [
  {
    id: "W0", lat: -89.54, lon: 0.0, type: "start",
    label: "LS-01 Landing Zone", distanceKm: 0, solarHours: 0,
    proof: { reason: "Primary landing site — slope 2.1°, OHRC verified boulder-free", terrain: "Flat regolith, PSR edge", science: "Baseline sample + seismometer deployment" },
  },
  {
    id: "W1", lat: -89.52, lon: 2.1, type: "waypoint",
    label: "Traverse Point Alpha", distanceKm: 0.8, solarHours: 2.1,
    proof: { reason: "Navigation waypoint — optimal path avoiding 3 boulders >0.4m identified in OHRC", terrain: "Gentle slope 1.8°, mare-like texture", science: "Spectral imaging of transition zone" },
  },
  {
    id: "W2", lat: -89.49, lon: 5.3, type: "science",
    label: "Ice Core Sample Site A", distanceKm: 1.9, solarHours: 5.4,
    proof: { reason: "CPR peak 2.31 at this location — highest ice concentration in traverse corridor", terrain: "PSR interior, Diviner T=39K, extremely flat", science: "Drill to 1m, collect 10g ice core, APXS + LIBS analysis" },
  },
  {
    id: "W3", lat: -89.46, lon: 8.2, type: "waypoint",
    label: "Ridge Observation Point", distanceKm: 3.1, solarHours: 8.2,
    proof: { reason: "Elevated position (LOLA +34m relative) gives line-of-sight to Earth for comms", terrain: "Rocky ridge, slope 4.2°, sunlit 82% of time", science: "Panoramic imaging + radio relay test" },
  },
  {
    id: "W4", lat: -89.43, lon: 11.0, type: "science",
    label: "Ice Core Sample Site B", distanceKm: 4.4, solarHours: 11.8,
    proof: { reason: "Second ice deposit confirmed by both DFSAR and Chandrayaan-1 MINI-RF independently", terrain: "Deep PSR, temperature 41K, low thermal gradient", science: "Second drill core, volatile analysis, subsurface GPR scan" },
  },
  {
    id: "W5", lat: -89.40, lon: 14.5, type: "end",
    label: "Extended Science Zone", distanceKm: 5.8, solarHours: 15.6,
    proof: { reason: "Mission end-point — maximum range within power-safe return distance", terrain: "PSR-sunlit transition zone — scientifically valuable boundary", science: "Long-term monitoring station, seismometer array, meteorology" },
  },
];

export const missionMetrics = {
  totalIceVolume: "2.4 × 10⁸ m³",
  missionDuration: "180 sols",
  roverRange: "5.8 km",
  communicationWindows: "14h/day",
  powerGeneration: "240W peak",
  scienceReturn: "47 GB",
  launchWindow: "2026-09-14",
  transitTime: "5.2 days",
  orbitInsertion: "2026-09-19",
  touchdown: "2026-09-22",
};

export const riskFactors = [
  { name: "Terrain Safety", score: 87, severity: "low",    detail: "Slope <3° across 94% of traverse path",                    proof: "LOLA DEM slope map: max 4.2° at W3 ridge; 12 OHRC-identified boulders in path — all routable" },
  { name: "Solar Power",    score: 76, severity: "medium", detail: "18.3% illumination — battery buffer required",              proof: "Illumination map (Mazarico 2011): 78.4% on rim, 18.3% at site. 720Wh battery covers 5.2h dark transit" },
  { name: "Thermal",        score: 91, severity: "low",    detail: "42.7K stable — ice preservation optimal",                  proof: "Diviner radiometer: 3-year record shows ±2K variance. MMRTG maintains +20°C internal nominal" },
  { name: "Communication",  score: 82, severity: "low",    detail: "14h/day relay via Chandrayaan-3 orbiter",                  proof: "Chandrayaan-3 propulsion reserve verified. 100° elevation angle from site. DSN Goldstone backup." },
  { name: "Dust Accum.",    score: 68, severity: "medium", detail: "South pole ejecta events — monitoring required",           proof: "LRO LAMP: 3 dust-levitation events/year at 89°S. Solar panel degradation model: -8% per 90 sols" },
  { name: "Cosmic Rad.",    score: 73, severity: "medium", detail: "SPE events during transit — shielding nominal",            proof: "ACE solar wind data: transit window in solar minimum. 10g/cm² Al shielding reduces dose to 0.3 Sv/yr" },
];
