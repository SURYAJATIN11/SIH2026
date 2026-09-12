/**
 * SOUTHERN RAILWAY - MASTER GIS CORRIDOR ASSET REGISTRY
 * 
 * Contains detailed engineering, sensor telemetry (USFD, TRD, S&T),
 * historical maintenance, and operational risk specifications for every asset
 * across all 8 Southern Railway Corridors.
 */

export const CORRIDOR_ASSETS_REGISTRY = [
  // ==========================================================================
  // 1. CHENNAI - BENGALURU TRUNK (MAS - SBC)
  // ==========================================================================
  {
    id: "SR-BRG-AR-0017",
    name: "Arakkonam Palar River Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Major Steel Girder & Concrete Pier Bridge",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Arakkonam – Katpadi",
    river: "Palar River",
    km: "Km. 1042/8-9",
    div: "MAS",
    coords: [12.9850, 79.6200],
    year: 1910,
    length: "298.45 m",
    spans: "12 Spans @ 24.8m",
    health_score: 96,
    condition: "Good • Normal Line Speed (130 km/h)",
    speed_limit: "130 km/h",
    desc: "Vital multi-span arterial bridge across Palar River on MAS-SBC trunk line with electronic track circuits and continuous piezometric scour sensors.",
    specs: {
      rdso_standard: "RDSO/B-1021-R2 Heavy Mineral Loading Standard",
      load_class: "25t Axle Load Compliant",
      rail_weight: "60kg 90UTS Continuous Welded Rail",
      substructure: "Monolithic stone masonry piers with reinforced concrete jackets",
      superstructure: "Prestressed concrete slabs with steel composite girders"
    },
    sensor_telemetry: {
      usfd_status: "Pass - Zero Transverse Defects (Scanned 02-Sep-2026)",
      wear_index: "0.32 mm rail head wear (Permissible: 2.5 mm)",
      scour_depth: "0.18 m scour depth (Warning threshold: 1.20 m)",
      tgi_index: 96.2,
      vibration_rms: "0.08g at 130 km/h"
    },
    history: [
      { year: "1910", text: "Bridge constructed with stone masonry piers and steel truss girders" },
      { year: "1965", text: "Strengthening work executed for steam-to-diesel transition" },
      { year: "1988", text: "Major repair & underwater pier scour protection with concrete rip-rap" },
      { year: "2001", text: "Deck replacement with prestressed concrete slabs (PSC)" },
      { year: "2015", text: "Structural painting & ultrasonic weld defect testing (USFD)" },
      { year: "2021", text: "Detailed inspection & 25kV OHE mast re-alignment" },
      { year: "2024", text: "Line speed upgraded to 130 km/h for Vande Bharat operations" }
    ],
    blocks: [
      { id: "BLK-2024-1021", from: "15/07/24", to: "18/07/24", type: "Maintenance", dur: "3 Days" },
      { id: "BLK-2023-0890", from: "10/06/23", to: "12/06/23", type: "Inspection", dur: "2 Days" },
      { id: "BLK-2022-0712", from: "22/05/22", to: "24/05/22", type: "Maintenance", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Shadow Block (Nocturnal Gap)",
      duration: "150 min (01:30 – 04:00 AM IST)",
      machine: "CSM 09-32 Tamper + Tower Wagon",
      crew: "12 SSE/P-Way Staff",
      estimated_cost: "₹48,500",
      train_impact: "0.0 min delay • Scheduled during nocturnal freight lull"
    }
  },
  {
    id: "SR-TRD-TSS-012",
    name: "Tiruvallur 25kV Traction Substation (TSS)",
    category: "Traction & OHE",
    icon: "⚡",
    type: "132kV / 25kV AC Traction Substation",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Tiruvallur – Arakkonam",
    river: "Ennore-Cooum Basin",
    km: "Km. 41.8",
    div: "MAS",
    coords: [13.1420, 79.9100],
    year: 1979,
    length: "Feeding Zone: 48.5 km",
    spans: "Dual 30 MVA Scott Transformers",
    health_score: 92,
    condition: "Good • SCADA Remote Controlled",
    speed_limit: "130 km/h Line Voltage 26.5 kV",
    desc: "Heavy-duty TRD sub-station providing 25kV 50Hz single-phase traction power to the high-density MAS-AJJ quadrupled line and EMU suburban grid.",
    specs: {
      rdso_standard: "TI/SPC/OHE/25KV/01 (RDSO TRD Standard)",
      load_class: "Peak Load: 42 MVA (during simultaneous freight acceleration)",
      rail_weight: "107 mm² hard-drawn grooved copper contact wire",
      substructure: "Oil-retention pit with automated nitrogen fire extinguishing system",
      superstructure: "SF6 Gas Insulated Circuit Breakers (ABB Type)"
    },
    sensor_telemetry: {
      usfd_status: "N/A (Electrical TRD)",
      wear_index: "Contact wire thickness: 11.2 mm (condemning limit 8.2 mm)",
      scour_depth: "Transformer Oil Temp: 58°C (Normal < 75°C)",
      tgi_index: 98.4,
      vibration_rms: "OHE Tension: 1000 kgf ± 2%"
    },
    history: [
      { year: "1979", text: "Commissioned with 20 MVA BHEL transformers" },
      { year: "2004", text: "Upgraded to dual 30 MVA Scott-connected units for 25kV OHE" },
      { year: "2018", text: "Microprocessor-based numerical relay and SCADA tele-control installed" },
      { year: "2025", text: "Automated neutral section transition monitoring commissioned" }
    ],
    blocks: [
      { id: "BLK-TRD-2024-03", from: "04/05/24", to: "05/05/24", type: "Transformer Oil Filtration", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Power Block (No Traffic Disruption)",
      duration: "120 min (02:00 – 04:00 AM IST)",
      machine: "Tower Wagon 8-Wheeler RU-14",
      crew: "8 TRD Electrical Staff",
      estimated_cost: "₹34,000",
      train_impact: "Power transferred seamlessly to feeding post SP-04"
    }
  },
  {
    id: "SR-SIG-RRI-001",
    name: "Arakkonam Route Relay Interlocking (RRI)",
    category: "Signalling & Telecom",
    icon: "🔴",
    type: "Centralized Route Relay & Solid State Interlocking",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Arakkonam Junction",
    river: "Junction Hub",
    km: "Km. 68.5",
    div: "MAS",
    coords: [13.0784, 79.6677],
    year: 1982,
    length: "142 Signalled Routes",
    spans: "6 Platform Roads + 12 Yard Lines",
    health_score: 94,
    condition: "Good • Fail-Safe Redundant (SIL-4)",
    speed_limit: "Main: 130 km/h, Turnout: 30-50 km/h",
    desc: "Critical signalling nerve center governing the convergence of Chennai Central, Renigunta (SCR), Katpadi, and Chengalpattu lines with high-speed route locking.",
    specs: {
      rdso_standard: "IRS:S 36/2004 Electronic Interlocking Standard",
      load_class: "Dual-redundant Warm Standby Architecture",
      rail_weight: "Multi-aspect color light signalling (MACLS) with LED aspects",
      substructure: "Integrated lightning and surge protection class B & C",
      superstructure: "Digital Axle Counters (HASSDAC) across all detection zones"
    },
    sensor_telemetry: {
      usfd_status: "Digital Axle Counter Health: 99.98% availability",
      wear_index: "Point machine operating current: 2.1A (RDSO limit: 2.8A)",
      scour_depth: "Relay room humidity: 48% (Regulated < 60%)",
      tgi_index: 99.1,
      vibration_rms: "Signal feed loop resistance: 1.8 ohms"
    },
    history: [
      { year: "1982", text: "First British-type relay interlocking installed with 88 routes" },
      { year: "2010", text: "Modernized to Electronic Interlocking (EI) with 142 routes" },
      { year: "2022", text: "High-Availability Single Section Digital Axle Counters (HASSDAC) commissioned" }
    ],
    blocks: [
      { id: "BLK-SIG-2024-08", from: "18/08/24", to: "19/08/24", type: "Point Machine Overhaul", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Signalling Disconnection (Non-Peak)",
      duration: "90 min (11:15 – 12:45 PM IST)",
      machine: "Point Overhaul Kit & S&T Test Van",
      crew: "6 S&T Technicians",
      estimated_cost: "₹26,000",
      train_impact: "Manual route clamping standby available"
    }
  },
  {
    id: "SR-TRK-TO-014B",
    name: "Katpadi Junction High-Speed Turnout #14B",
    category: "Points & Turnouts",
    icon: "🛤️",
    type: "1-in-12 Curved Switch with Thick Web Switch (TWS)",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Katpadi Junction Yard",
    river: "Vellore Chord",
    km: "Km. 129.4",
    div: "MAS",
    coords: [12.9696, 79.1362],
    year: 2019,
    length: "Turnout Length: 49.5 m",
    spans: "Permitted Speed on Divergence: 50 km/h",
    health_score: 72,
    condition: "Fair • Switch Blade Tongue Wear (Block Due)",
    speed_limit: "Main: 130 km/h, Turnout: 50 km/h",
    desc: "Heavy-traffic turnout diverting southbound express trains towards Jolarpettai and Bengaluru. Tongue rail wear currently approaching 4.2mm.",
    specs: {
      rdso_standard: "RDSO/T-4732 1-in-12 60kg Curved Switch",
      load_class: "25t Axle Load Heavy Haul",
      rail_weight: "60kg 1080 Head Hardened Rail (HH)",
      substructure: "Cast Manganese Steel (CMS) monoblock crossing",
      superstructure: "Non-lubricated spherical bearing clamp point lock"
    },
    sensor_telemetry: {
      usfd_status: "USFD Pass • Surface micro-gouge on stock rail (attention)",
      wear_index: "Tongue rail lateral wear: 4.1 mm (Limit 5.0 mm - Schedule replacement)",
      scour_depth: "Track cross level error: +2.1 mm",
      tgi_index: 82.5,
      vibration_rms: "Point throw force: 410 kg"
    },
    history: [
      { year: "2019", text: "Installed with Thick Web Switch for 50 km/h high-speed divergence" },
      { year: "2023", text: "CMS crossing re-conditioned with robotic weld deposition" }
    ],
    blocks: [
      { id: "BLK-TRK-2024-02", from: "14/02/24", to: "15/02/24", type: "Switch Replacement", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Traffic Block (Shadow Nocturnal)",
      duration: "180 min (01:15 – 04:15 AM IST)",
      machine: "Unimat 08-4S Switch Tamper",
      crew: "14 P-Way Track Staff",
      estimated_cost: "₹65,000",
      train_impact: "Avoids 45 km/h TSR restriction if executed within 7 days"
    }
  },
  {
    id: "SR-SHD-RPM-002",
    name: "Royapuram Electric Loco Shed (ELS/RPM)",
    category: "Loco Sheds",
    icon: "🚂",
    type: "Premier Electric Locomotive Maintenance Shed",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Chennai Central – Royapuram",
    river: "Bay of Bengal Shore",
    km: "Km. 2.1",
    div: "MAS",
    coords: [13.1090, 80.2940],
    year: 1978,
    length: "Holding Capacity: 125 Locomotives",
    spans: "5 Inspection Bays & Wheel Lathe",
    health_score: 98,
    condition: "Pristine • ISO 9001/14001 Certified",
    speed_limit: "Yard: 15 km/h",
    desc: "The nerve center powering the South Indian high-speed fleet, maintaining 110+ state-of-the-art 3-phase WAP-7 (6000 HP) passenger locomotives.",
    specs: {
      rdso_standard: "RDSO Indian Railways Loco Maintenance Manual Part II",
      load_class: "6,000 HP 3-Phase IGBT Traction Converted",
      rail_weight: "Dedicated 25kV test track & underfloor wheel pit lathe",
      substructure: "Overhead 50-tonne EOT gantry cranes (DEMAG)",
      superstructure: "Micro-processor based diagnostics testing bay"
    },
    sensor_telemetry: {
      usfd_status: "Loco Wheel Axle USFD: 100% compliant",
      wear_index: "Wheel flange wear average: 29.4 mm (Safe > 22 mm)",
      scour_depth: "Bogie spring deflection: Nominal (112 mm)",
      tgi_index: 99.5,
      vibration_rms: "Traction motor bearing acoustic analysis: Normal"
    },
    history: [
      { year: "1978", text: "Established as first AC electric loco shed in Southern Railway" },
      { year: "2007", text: "Upgraded for 3-Phase WAP-7 locomotives" },
      { year: "2023", text: "Commissioned automated regenerative braking test rig" }
    ],
    blocks: [
      { id: "BLK-SHD-2024-05", from: "12/06/24", to: "14/06/24", type: "Pit Line Gantry Overhaul", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Internal Depot Window",
      duration: "240 min (Weekly Maintenance)",
      machine: "Depot Maintenance Jacks",
      crew: "22 Shed Technicians",
      estimated_cost: "₹88,000",
      train_impact: "Zero mainline traffic impact"
    }
  },
  {
    id: "SR-DPT-BBQ-001",
    name: "Basin Bridge Coaching Care Depot (BBQ)",
    category: "Coach Depots",
    icon: "🧰",
    type: "Mega Primary Coaching Maintenance Terminal",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "MGR Chennai Central Outer",
    river: "Otteri Nullah Basin",
    km: "Km. 3.4",
    div: "MAS",
    coords: [13.0970, 80.2670],
    year: 1965,
    length: "18 Pit Lines (Capacity: 48 Rakes/Day)",
    spans: "Automatic Coach Washing Plant (ACWP)",
    health_score: 95,
    condition: "Good • 24/7 Primary Maintenance Facility",
    speed_limit: "Yard: 15 km/h",
    desc: "Primary depot responsible for Chennai's premier long-distance rakes including Vande Bharat Express, Rajdhani, Shatabdi, and LHB Superfast fleets.",
    specs: {
      rdso_standard: "CAMTECH LHB Coach Maintenance Manual",
      load_class: "24-Coach LHB Rakes Primary Examination",
      rail_weight: "Covered CAMTECH pit lines with high-pressure water jet piping",
      substructure: "Automated bio-toilet evacuation & vacuum recharge system",
      superstructure: "Optical wheel profile measurement system (OWPMS)"
    },
    sensor_telemetry: {
      usfd_status: "LHB Wheel Axle Ultrasonic testing: 100% Pass",
      wear_index: "Composite K-Type brake pad wear: 34 mm (limit 10 mm)",
      scour_depth: "Air brake pipe leakage rate: 0.12 kg/cm²/min (RDSO limit: 0.20)",
      tgi_index: 97.8,
      vibration_rms: "Secondary air spring pressure: 6.0 bar"
    },
    history: [
      { year: "1965", text: "Established for ICF wooden & steel coaches" },
      { year: "2014", text: "Complete overhaul to LHB maintenance infrastructure" },
      { year: "2023", text: "Commissioned dedicated Vande Bharat Express 16-car servicing pit" }
    ],
    blocks: [
      { id: "BLK-DPT-2024-01", from: "05/01/24", to: "06/01/24", type: "Pit Track Re-grouting", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Pit Line Stabling Slot",
      duration: "360 min (06:00 – 12:00 PM)",
      machine: "Pit Rig & Testing Console",
      crew: "28 C&W Technicians",
      estimated_cost: "₹59,580",
      train_impact: "Concurrent with passenger turnaround dwell"
    }
  },
  {
    id: "SR-LC-MAS-014",
    name: "Arakkonam Outer Special Class LC Gate #14",
    category: "Level Crossings",
    icon: "🚧",
    type: "Interlocked Special Class Level Crossing Gate",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Arakkonam – Katpadi",
    river: "SH-61 Crossing",
    km: "Km. 72.3",
    div: "MAS",
    coords: [13.0450, 79.5800],
    year: 1974,
    length: "4-Track Quadrupled Crossing",
    spans: "TVU: 145,000 Train Vehicle Units",
    health_score: 76,
    condition: "Attention • High TVU Road Congestion (ROB Sanctioned)",
    speed_limit: "Train: 130 km/h, Road: Interlocked Signals",
    desc: "High-density interlocked level crossing gate on 4-track trunk. Mechanized boom barrier synchronized with automatic block signalling.",
    specs: {
      rdso_standard: "Indian Railways P-Way Manual Section on LC Gates",
      load_class: "Special Class (TVU > 50,000)",
      rail_weight: "Check rails with 51mm clearance gap on PSC sleepers",
      substructure: "Reinforced concrete approach slabs",
      superstructure: "Electrically operated lifting barriers (EOLB) with LED boom lights"
    },
    sensor_telemetry: {
      usfd_status: "Check rail flangeway clearance: 52 mm (Standard 51-57 mm)",
      wear_index: "Boom closing time: 14 seconds",
      scour_depth: "Road surface roughness: Needs resurfacing",
      tgi_index: 84.1,
      vibration_rms: "Interlocking relay pickup voltage: 24.2 V"
    },
    history: [
      { year: "1974", text: "Commissioned as mechanical winched gate" },
      { year: "2012", text: "Upgraded to motorized electrically operated lifting barrier" }
    ],
    blocks: [
      { id: "BLK-LC-2024-04", from: "22/04/24", to: "23/04/24", type: "Road Surface Resurfacing", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Traffic & Road Diversion Block",
      duration: "180 min (01:00 – 04:00 AM IST)",
      machine: "Asphalt Paver & Track Jack",
      crew: "10 P-Way Staff",
      estimated_cost: "₹42,000",
      train_impact: "0 train delay • Local road traffic diverted"
    }
  },
  {
    id: "SR-TNL-SBC-001",
    name: "Makali Durgam Rail Cutting & Tunnel",
    category: "Tunnels",
    icon: "🚇",
    type: "Solid Granite Rock Cutting & Reinforced Tunnel",
    corridor_id: "MAS-SBC",
    corridor_name: "Chennai - Bengaluru",
    section: "Bangarapet – KSR Bengaluru",
    river: "Deccan Plateau Escarpment",
    km: "Km. 338.2",
    div: "MAS",
    coords: [12.9820, 77.7200],
    year: 1968,
    length: "420 m",
    spans: "Clearance: Standard Broad Gauge 25kV OHE",
    health_score: 95,
    condition: "Good • Shotcreted Rock Face with Catch Water Drains",
    speed_limit: "110 km/h",
    desc: "Scenic escarpment cutting with reinforced shotcrete lining, rock-fall net fencing, and automated seismic/rockslide tilt sensors.",
    specs: {
      rdso_standard: "RDSO Tunnel Design Guidelines 2018",
      load_class: "Broad Gauge Double Line Standard",
      rail_weight: "60kg PSC-12 sleeper track on deep ballast cushion",
      substructure: "Prestressed rock bolts (32mm dia) anchored 4m into granite",
      superstructure: "Reinforced fiber-mesh shotcrete 100mm"
    },
    sensor_telemetry: {
      usfd_status: "Rock face tilt sensor telemetry: 0.002° (Static/Safe)",
      wear_index: "Drainage water discharge: Normal (Dry weather)",
      scour_depth: "OHE clearance from tunnel crown: 5.62 m (Compliant)",
      tgi_index: 94.8,
      vibration_rms: "Track settlement: 0 mm"
    },
    history: [
      { year: "1968", text: "Blasted during Bangalore double-tracking" },
      { year: "2017", text: "Comprehensive rock-fall wire mesh stabilization executed" }
    ],
    blocks: [
      { id: "BLK-TNL-2024-09", from: "14/09/24", to: "15/09/24", type: "Rock Bolt Pull Testing", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Nocturnal Track Maintenance",
      duration: "120 min (01:45 – 03:45 AM IST)",
      machine: "Drainage Sump Pump & Gantry Inspection Vehicle",
      crew: "8 Tunnel Engineering Staff",
      estimated_cost: "₹38,000",
      train_impact: "Zero traffic disruption"
    }
  },

  // ==========================================================================
  // 2. CHENNAI - COIMBATORE TRUNK (MAS - CBE)
  // ==========================================================================
  {
    id: "SR-SHD-AJJ-003",
    name: "Arakkonam Electric Loco Shed (ELS/AJJ)",
    category: "Loco Sheds",
    icon: "🚂",
    type: "Heavy Freight & Passenger Loco Shed",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Arakkonam Junction",
    river: "Palar Basin",
    km: "Km. 69.2",
    div: "MAS",
    coords: [13.0650, 79.6720],
    year: 1985,
    length: "Holding Capacity: 185 Locomotives",
    spans: "Heavy Lifting Bay & Traction Motor Shop",
    health_score: 97,
    condition: "Good • High Reliability Index",
    speed_limit: "Yard: 15 km/h",
    desc: "Houses one of Indian Railways' largest fleets of high-adhesion WAG-9 heavy haul freight locos (6,000 HP) and WAP-4 workhorses.",
    specs: {
      rdso_standard: "RDSO Electric Locomotive Maintenance Code",
      load_class: "6,000 HP Freight & 5,000 HP Passenger Locomotives",
      rail_weight: "5 Heavy Repair Pit Roads with 60t Overhead Cranes",
      substructure: "Automated axle load balancing & traction motor testing bed",
      superstructure: "Heavy bogie drops table"
    },
    sensor_telemetry: {
      usfd_status: "Loco Axle Testing: 100% compliant",
      wear_index: "Carbon brush wear: Inspected and certified",
      scour_depth: "Transformer winding insulation: > 1000 Megohms",
      tgi_index: 98.2,
      vibration_rms: "Bearing vibration: Within permissible envelope"
    },
    history: [
      { year: "1985", text: "Commissioned to service WAM-4 freight locomotives" },
      { year: "2016", text: "Upgraded for 6000 HP WAG-9 multi-unit locomotives" }
    ],
    blocks: [
      { id: "BLK-AJJ-2024-02", from: "10/03/24", to: "12/03/24", type: "Crane Load Testing", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Shed Internal Window",
      duration: "180 min (Depot Internal)",
      machine: "Heavy Drop Pit Table",
      crew: "18 Electrical Mechanics",
      estimated_cost: "₹52,000",
      train_impact: "Internal servicing"
    }
  },
  {
    id: "SR-YRD-JTJ-002",
    name: "Jolarpettai Junction Marshalling Yard & Flyovers",
    category: "Railway Yards",
    icon: "🚉",
    type: "Zonal Handoff & Marshalling Yard",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Jolarpettai Junction",
    river: "Yelagiri Foothills",
    km: "Km. 214.0",
    div: "MAS",
    coords: [12.5638, 78.5802],
    year: 1958,
    length: "14 Sorting & Stabling Tracks",
    spans: "2 Grade-Separated Flyovers (SWR Chord)",
    health_score: 93,
    condition: "Good • Continuous 24/7 Operations",
    speed_limit: "Main: 130 km/h, Yard: 30 km/h",
    desc: "Major operational convergence hub where Chennai-Coimbatore and Chennai-Bengaluru traffic bifurcates, featuring automated hump retarders and crew changing lobbies.",
    specs: {
      rdso_standard: "Indian Railways Yard Operating Manual",
      load_class: "Heavy BCNHL / BOXNHL 58-Wagon Freight Rakes",
      rail_weight: "60kg PSC Yard Sleepers with rubber pads",
      substructure: "Pneumatic point machines and clamp lock devices",
      superstructure: "High-mast yard illumination towers (LED 400W)"
    },
    sensor_telemetry: {
      usfd_status: "Yard diamond crossing USFD tested Pass",
      wear_index: "Flyover rail expansion joint clearance: 18 mm (Normal)",
      scour_depth: "Track cross level: Within ±3mm",
      tgi_index: 91.5,
      vibration_rms: "Flyover deflection: 1.2 mm under loaded freight"
    },
    history: [
      { year: "1958", text: "Established during Southern Railway zonal restructuring" },
      { year: "2018", text: "Grade-separated Bangalore flyover commissioned to eliminate surface conflicts" }
    ],
    blocks: [
      { id: "BLK-JTJ-2024-06", from: "18/06/24", to: "20/06/24", type: "Yard Re-sleepering", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Yard Road Track Block",
      duration: "240 min (Daytime Freight Gap)",
      machine: "T-28 Points & Crossing Relaying Machine",
      crew: "16 Track Men",
      estimated_cost: "₹72,000",
      train_impact: "Freights routed via bypass loops"
    }
  },
  {
    id: "SR-BRG-SA-0042",
    name: "Cauvery River Rail Bridge (Erode)",
    category: "Bridges",
    icon: "⛩️",
    type: "Major Heavy Steel Truss Bridge",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Erode – Karur / Salem",
    river: "River Cauvery",
    km: "Km. 388/4-8",
    div: "SA",
    coords: [11.3500, 77.7300],
    year: 1935,
    length: "1,210 m",
    spans: "16 Spans @ 75.6 m Steel Truss",
    health_score: 95,
    condition: "Good • Monitored with Acoustic Emission Sensors",
    speed_limit: "110 km/h",
    desc: "Massive multi-span steel truss bridge over River Cauvery linking Salem and Tiruchirappalli divisions with 25kV OHE portal electrification.",
    specs: {
      rdso_standard: "RDSO Steel Bridge Code & IRS Bridge Rules",
      load_class: "25t Heavy Axle Load",
      rail_weight: "60kg rails on steel channel sleepers",
      substructure: "Cast-iron twin cylinder piers sunk to bedrock",
      superstructure: "Warren type through steel truss with riveted gusset plates"
    },
    sensor_telemetry: {
      usfd_status: "Acoustic emission defect scan: Zero micro-crack growth",
      wear_index: "Gusset plate corrosion index: 0.05 mm (Pass)",
      scour_depth: "River bed scour: 0.4 m (Pier footing safety factor > 2.8)",
      tgi_index: 95.1,
      vibration_rms: "Mid-span deflection under freight: 3.4 mm (Permissible: 6.8 mm)"
    },
    history: [
      { year: "1935", text: "Constructed for South Indian Railway heavy traffic" },
      { year: "1978", text: "Pier strengthening and rivet re-tightening" },
      { year: "2012", text: "25kV OHE portal erection and electrification" },
      { year: "2023", text: "Acoustic emission structural health monitoring deployed" }
    ],
    blocks: [
      { id: "BLK-SA-2024-04", from: "12/04/24", to: "14/04/24", type: "Pier Hydro-Audit", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "150 min (01:30 – 04:00 AM IST)",
      machine: "Bridge Inspection Unit (MBIU)",
      crew: "10 Bridge Inspectors",
      estimated_cost: "₹54,000",
      train_impact: "0 delay to passenger express"
    }
  },
  {
    id: "SR-SHD-ED-001",
    name: "Erode Electric Loco Shed (ELS/ED)",
    category: "Loco Sheds",
    icon: "🚂",
    type: "High-Capacity Electric & Diesel Locomotive Hub",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Erode Junction",
    river: "Cauvery Basin",
    km: "Km. 396.0",
    div: "SA",
    coords: [11.3320, 77.7120],
    year: 1982,
    length: "Holding Capacity: 195 Locomotives",
    spans: "8 Heavy Overhaul Bays & Diesel Pit",
    health_score: 98,
    condition: "Pristine • Highest Punctuality Rating in Zone 07",
    speed_limit: "Yard: 15 km/h",
    desc: "Renowned locomotive workshop powering Southern Railway's southern express and heavy mineral trains with WAP-7, WAG-9, and WAP-4 engines.",
    specs: {
      rdso_standard: "RDSO Schedule TI/TO/POH Overhaul Specification",
      load_class: "6,000 HP 3-Phase Electric Locomotives",
      rail_weight: "Automated oil testing lab with gas chromatography",
      substructure: "50t gantry cranes & pantograph testing jig",
      superstructure: "Micro-processor test consoles with digital download"
    },
    sensor_telemetry: {
      usfd_status: "Loco Axle & Bogie USFD: 100% Pass",
      wear_index: "Pantograph metallized carbon strip wear: Monitored (< 3mm)",
      scour_depth: "Battery bank float voltage: 110.4 V (Nominal)",
      tgi_index: 99.2,
      vibration_rms: "Compressor vibration: Normal (0.15g)"
    },
    history: [
      { year: "1982", text: "Established initially for diesel locomotives" },
      { year: "1994", text: "Converted and expanded for 25kV electric locomotives" },
      { year: "2024", text: "Ranked #1 Electric Loco Shed in Indian Railways for zero en-route failures" }
    ],
    blocks: [
      { id: "BLK-ED-2024-07", from: "20/07/24", to: "22/07/24", type: "Sub-station Transformer Servicing", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Depot Internal Maintenance",
      duration: "180 min (Internal)",
      machine: "Loco Test Bench",
      crew: "24 Technicians",
      estimated_cost: "₹62,000",
      train_impact: "Zero mainline block required"
    }
  },
  {
    id: "SR-TRK-XNG-004D",
    name: "Erode Junction Diamond Crossing #04D",
    category: "Points & Turnouts",
    icon: "🛤️",
    type: "Double Slip & Diamond Crossing (60kg CMS)",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Erode Junction West Throat",
    river: "Junction Throat",
    km: "Km. 395.8",
    div: "SA",
    coords: [11.3410, 77.7172],
    year: 2021,
    length: "Crossing Length: 64.2 m",
    spans: "Permitted Speed: 30 km/h Cross-over",
    health_score: 68,
    condition: "Critical • Flange Wear at Nose of CMS Crossing (Block Due)",
    speed_limit: "Main: 130 km/h, Loop Cross: 30 km/h",
    desc: "High-density convergence point connecting Salem-Coimbatore main lines with the Trichy-Karur branch. High traffic has caused 3.8mm CMS nose batter.",
    specs: {
      rdso_standard: "RDSO/T-4218 60kg Diamond Crossing Specification",
      load_class: "25t Axle Load Heavy Haul",
      rail_weight: "Explosively depth-hardened Cast Manganese Steel (EDH CMS)",
      substructure: "Steel baseplates with elastic rail clips (ERC-J)",
      superstructure: "Dual point motors with integrated route feedback"
    },
    sensor_telemetry: {
      usfd_status: "Surface metal flow detected at crossing nose (Attention)",
      wear_index: "Nose wear depth: 3.8 mm (Maintenance threshold: 3.5 mm)",
      scour_depth: "Cross level gauge variation: +3.2 mm",
      tgi_index: 78.4,
      vibration_rms: "Dynamic vertical acceleration: 0.38g"
    },
    history: [
      { year: "2021", text: "Installed with modern Thick Web switches and CMS crossing" },
      { year: "2024", text: "Robotic plasma weld resurfacing executed" }
    ],
    blocks: [
      { id: "BLK-ED-2024-01", from: "14/01/24", to: "15/01/24", type: "Nose Weld Reconditioning", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Traffic & Power Block (Urgent Priority)",
      duration: "180 min (01:15 – 04:15 AM IST)",
      machine: "Unimat Switch Tamper + Rail Profile Grinder",
      crew: "16 P-Way Welders & Fitters",
      estimated_cost: "₹74,000",
      train_impact: "Avoids 20 km/h TSR on main throat line"
    }
  },
  {
    id: "SR-GDS-CBE-002",
    name: "Coimbatore North Container Freight Terminal",
    category: "Goods Sheds",
    icon: "📦",
    type: "Modernized Multi-Modal Rail Freight Complex",
    corridor_id: "MAS-CBE",
    corridor_name: "Chennai - Coimbatore Trunk",
    section: "Coimbatore North – Irugur",
    river: "Noyyal River Basin",
    km: "Km. 494.0",
    div: "SA",
    coords: [11.0200, 76.9600],
    year: 1992,
    length: "4 Full-Rake BCNHL Handling Tracks",
    spans: "High-level all-weather loading platforms",
    health_score: 91,
    condition: "Good • High Commercial Revenue Terminal",
    speed_limit: "Yard: 15 km/h",
    desc: "Industrial freight artery serving western Tamil Nadu textile, heavy engineering, and automotive clusters with dedicated container block trains.",
    specs: {
      rdso_standard: "Indian Railways Freight Terminal Standards 2020",
      load_class: "CC+8+2 Freight Rakes (Heavy Axle)",
      rail_weight: "52kg / 60kg mixed yard tracks with concrete aprons",
      substructure: "Reinforced concrete wharf with LED high-bay lighting",
      superstructure: "FOIS (Freight Operating Information System) RFID scanners"
    },
    sensor_telemetry: {
      usfd_status: "Yard siding USFD scan: Pass",
      wear_index: "Loading dock apron integrity: 98%",
      scour_depth: "Wharf drainage capacity: 100%",
      tgi_index: 89.2,
      vibration_rms: "Low-speed shunting: Smooth"
    },
    history: [
      { year: "1992", text: "Commissioned as regional goods shed" },
      { year: "2019", text: "Upgraded with full concrete wharves and round-the-clock merchant handling" }
    ],
    blocks: [
      { id: "BLK-CBE-2024-03", from: "11/05/24", to: "12/05/24", type: "Wharf Track Realignment", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Siding Maintenance Window",
      duration: "180 min (Daytime Empty Window)",
      machine: "Track Relaying Gang Kit",
      crew: "12 P-Way Staff",
      estimated_cost: "₹36,000",
      train_impact: "No mainline disruption"
    }
  },

  // ==========================================================================
  // 3. CHENNAI EGMORE - MADURAI GRAND TRUNK (MS - MDU)
  // ==========================================================================
  {
    id: "SR-DPT-TBM-002",
    name: "Tambaram Coaching & EMU Depot (TBM)",
    category: "Coach Depots",
    icon: "🧰",
    type: "Suburban EMU & Broad Gauge Coaching Complex",
    corridor_id: "MS-MDU",
    corridor_name: "Chennai - Madurai Grand Trunk",
    section: "Tambaram – Chengalpattu",
    river: "Adyar River Basin",
    km: "Km. 25.0",
    div: "MAS",
    coords: [12.9250, 80.1200],
    year: 1931,
    length: "12 Pit Lines (8 EMU + 4 LHB)",
    spans: "Automatic Bogie Wash & Heavy Lifting Bay",
    health_score: 95,
    condition: "Good • High Turnaround Efficiency",
    speed_limit: "Yard: 15 km/h",
    desc: "Historic depot that pioneered South India's electric suburban train system, now maintaining EMU sets and Southern express passenger fleets.",
    specs: {
      rdso_standard: "CAMTECH EMU Maintenance Handbook",
      load_class: "12-Car EMU & 22-Coach LHB Rakes",
      rail_weight: "Covered elevated pit tracks with 3-phase catenary test lines",
      substructure: "Bogie overhaul turntables and wheel wear laser profilometer",
      superstructure: "Automated air compressor testing bench"
    },
    sensor_telemetry: {
      usfd_status: "EMU Axle Ultrasonic testing: 100% compliant",
      wear_index: "Wheel flange thickness: 31 mm (Safe)",
      scour_depth: "Pantograph contact strip: Certified",
      tgi_index: 97.2,
      vibration_rms: "Brake cylinder leakage: Zero"
    },
    history: [
      { year: "1931", text: "India's first metre-gauge DC electric depot commissioned" },
      { year: "2004", text: "Converted to Broad Gauge 25kV AC electric facility" }
    ],
    blocks: [
      { id: "BLK-TBM-2024-06", from: "14/06/24", to: "15/06/24", type: "Pit Track Re-levelling", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Depot Internal Slot",
      duration: "240 min (Turnaround Window)",
      machine: "Pit Testing Rig",
      crew: "20 Technicians",
      estimated_cost: "₹45,000",
      train_impact: "No mainline disruption"
    }
  },
  {
    id: "SR-BRG-TPJ-0019",
    name: "Coleroon River Rail Bridge (Srirangam)",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestressed Concrete Arch & Pier Bridge",
    corridor_id: "MS-MDU",
    corridor_name: "Chennai - Madurai Grand Trunk",
    section: "Srirangam – Golden Rock (Trichy)",
    river: "River Coleroon (Kollidam)",
    km: "Km. 334/1-6",
    div: "TPJ",
    coords: [10.8500, 78.7000],
    year: 1927,
    length: "1,420 m",
    spans: "28 Spans @ 50.7 m PSC Arches",
    health_score: 96,
    condition: "Good • High Speed 130 km/h Cleared",
    speed_limit: "130 km/h",
    desc: "Majestic bridge across the wide Coleroon floodway connecting North and South Tamil Nadu on the Chennai-Trichy-Madurai Grand Trunk Chord.",
    specs: {
      rdso_standard: "IRS Concrete Bridge Code (CBC)",
      load_class: "25t Axle Load Standard",
      rail_weight: "60kg UIC rails on prestressed monoblock concrete sleepers",
      substructure: "Mass concrete circular well piers sunk 18m below scour line",
      superstructure: "Post-tensioned concrete box girders"
    },
    sensor_telemetry: {
      usfd_status: "Rail welds scanned: 0 defects",
      wear_index: "Expansion joint gap: 24 mm at 36°C (Designed: 20-30 mm)",
      scour_depth: "River bed level telemetry: Stable (Scour < 0.25m)",
      tgi_index: 96.8,
      vibration_rms: "Natural structural frequency: 4.8 Hz (Within design envelope)"
    },
    history: [
      { year: "1927", text: "Built during the construction of the Trichy Chord Line" },
      { year: "1995", text: "Concrete jacketing of piers for enhanced seismic and hydraulic stability" },
      { year: "2022", text: "Digital water-level and pier tilt sensors deployed" }
    ],
    blocks: [
      { id: "BLK-TPJ-2024-03", from: "18/02/24", to: "20/02/24", type: "Bed Block Maintenance", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "150 min (01:30 – 04:00 AM IST)",
      machine: "Bridge Inspection Gantry",
      crew: "10 Bridge Mechanics",
      estimated_cost: "₹52,000",
      train_impact: "Zero delay to passenger traffic"
    }
  },
  {
    id: "SR-WRK-GOC-003",
    name: "Golden Rock Central Railway Workshop (GOC)",
    category: "Workshops",
    icon: "🔧",
    type: "National Heritage Locomotive & Wagon POH Complex",
    corridor_id: "MS-MDU",
    corridor_name: "Chennai - Madurai Grand Trunk",
    section: "Tiruchirappalli Junction Outer",
    river: "Cauvery Delta",
    km: "Km. 342.0",
    div: "TPJ",
    coords: [10.7850, 78.7180],
    year: 1928,
    length: "Sprawling 200-Acre Industrial Complex",
    spans: "POH Capacity: 180 Locos + 3,000 Wagons/Year",
    health_score: 99,
    condition: "Exemplary • National Energy Conservation Award Winner",
    speed_limit: "Workshop: 10 km/h",
    desc: "Historic 96-year-old railway manufacturing powerhouse handling Periodical Overhaul (POH) of steam locos for Nilgiri Mountain Railway, electric engines, and high-capacity wagons.",
    specs: {
      rdso_standard: "RDSO Workshop Overhaul Manual POH-01",
      load_class: "Heavy Industrial Manufacturing & POH",
      rail_weight: "14 internal rail tracks with automated traverser cars",
      substructure: "100-tonne heavy lift gantry cranes & CNC wheel lathes",
      superstructure: "Certified Green Workshop with 2 MW rooftop solar array"
    },
    sensor_telemetry: {
      usfd_status: "Workshop Wheel POH USFD: 100% Defect-Free Certified",
      wear_index: "Wheel turning accuracy: ±0.05 mm",
      scour_depth: "Overhaul cycle time: 18 days (Industry benchmark: 22 days)",
      tgi_index: 99.8,
      vibration_rms: "Dynamic balancing of wheelsets: ISO 1940 Grade G2.5"
    },
    history: [
      { year: "1928", text: "Founded by the South Indian Railway Company (SIR)" },
      { year: "1942", text: "Manufactured munitions and hospital trains during WWII" },
      { year: "2010", text: "Exported locomotives and wagons to Mozambique and Myanmar" },
      { year: "2024", text: "Manufactured eco-friendly X-Class steam locos for Nilgiri Mountain Railway" }
    ],
    blocks: [
      { id: "BLK-GOC-2024-05", from: "10/05/24", to: "12/05/24", type: "Traverser Track Maintenance", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Workshop Facility Window",
      duration: "300 min (Shift Change)",
      machine: "CNC Machine Maintenance Team",
      crew: "32 Specialized Engineers",
      estimated_cost: "₹1,25,000",
      train_impact: "Depot internal works"
    }
  },
  {
    id: "SR-BRG-MDU-0021",
    name: "Vaigai River Rail Bridge (Madurai)",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestressed Concrete Girder Rail Bridge",
    corridor_id: "MS-MDU",
    corridor_name: "Chennai - Madurai Grand Trunk",
    section: "Madurai Junction – Koodal Nagar",
    river: "River Vaigai",
    km: "Km. 492.5",
    div: "MDU",
    coords: [9.9320, 78.1250],
    year: 1972,
    length: "620 m",
    spans: "14 Spans @ 44.2 m",
    health_score: 94,
    condition: "Good • Normal Speed (110 km/h)",
    speed_limit: "110 km/h",
    desc: "Key southern link spanning the historic Vaigai River approaching Madurai Junction with continuous seismic elastomeric bearing pads.",
    specs: {
      rdso_standard: "IRS Concrete Bridge Code (25t Loading)",
      load_class: "25t Axle Load Heavy Broad Gauge",
      rail_weight: "60kg 90UTS Continuous Welded Rail",
      substructure: "Circular well foundations anchored in sandstone",
      superstructure: "Prestressed I-girders with reinforced deck slab"
    },
    sensor_telemetry: {
      usfd_status: "USFD Pass • No internal rail fractures",
      wear_index: "Elastomeric bearing distortion: 1.4 mm (Tolerable < 5 mm)",
      scour_depth: "River bed profile: Stable sandy bed",
      tgi_index: 94.6,
      vibration_rms: "Bridge vibration: 0.12g at 110 km/h"
    },
    history: [
      { year: "1972", text: "Constructed during southern trunk broad-gauge alignment" },
      { year: "2018", text: "Electrification 25kV OHE portals anchored" }
    ],
    blocks: [
      { id: "BLK-MDU-2024-01", from: "08/03/24", to: "09/03/24", type: "Bearing Pad Replacement", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "120 min (01:45 – 03:45 AM IST)",
      machine: "Hydraulic Jacking Unit",
      crew: "8 Bridge Fitters",
      estimated_cost: "₹42,000",
      train_impact: "0 delay to passenger traffic"
    }
  },

  // ==========================================================================
  // 4. PALAKKAD - TRIVANDRUM COASTLINE (PGT - TVC)
  // ==========================================================================
  {
    id: "SR-BRG-PGT-0024",
    name: "Bharathapuzha River Bridge (Shoranur)",
    category: "Bridges",
    icon: "⛩️",
    type: "Heavy Steel Truss & Concrete Substructure",
    corridor_id: "PGT-TVC",
    corridor_name: "Palakkad - Trivandrum Coastline",
    section: "Palakkad – Shoranur Junction",
    river: "River Bharathapuzha (Nila)",
    km: "Km. 578/2-6",
    div: "PGT",
    coords: [10.7620, 76.2750],
    year: 1932,
    length: "890 m",
    spans: "18 Spans @ 49.4 m Steel Truss",
    health_score: 92,
    condition: "Good • High-Yield River Crossing",
    speed_limit: "110 km/h",
    desc: "Crucial rail lifeline across the iconic Bharathapuzha River carrying 110+ trains daily into northern and central Kerala.",
    specs: {
      rdso_standard: "RDSO Standard Steel Girder Bridge Code",
      load_class: "25t Axle Load Standard",
      rail_weight: "60kg rails on steel channel bridge sleepers",
      substructure: "Twin circular well masonry piers with concrete caps",
      superstructure: "Riveted mild steel Pratt truss girders"
    },
    sensor_telemetry: {
      usfd_status: "Acoustic emission USFD scan: Pass",
      wear_index: "Steel member thickness: 98.4% of original",
      scour_depth: "Scour monitoring: 0.32m (Safety margin: 2.1m)",
      tgi_index: 92.4,
      vibration_rms: "Vibration under train load: 0.14g"
    },
    history: [
      { year: "1932", text: "Built during South Indian Railway broad-gauge extension" },
      { year: "1998", text: "Electrification 25kV OHE commissioned" },
      { year: "2023", text: "Under-water ultrasonic sonar pier audit completed" }
    ],
    blocks: [
      { id: "BLK-PGT-2024-04", from: "14/04/24", to: "16/04/24", type: "Steel Girder Painting", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "150 min (01:15 – 03:45 AM IST)",
      machine: "Bridge Inspection Unit (MBIU)",
      crew: "10 Bridge Staff",
      estimated_cost: "₹48,000",
      train_impact: "Zero delay to passenger traffic"
    }
  },
  {
    id: "SR-BRG-TVC-0008",
    name: "Vembanad Rail Bridge (Vallarpadam)",
    category: "Bridges",
    icon: "⛩️",
    type: "Longest Dedicated Railway Freight Bridge in India",
    corridor_id: "PGT-TVC",
    corridor_name: "Palakkad - Trivandrum Coastline",
    section: "Edappally – Vallarpadam ICTT (Kochi)",
    river: "Vembanad Lake / Arabian Sea Backwaters",
    km: "Km. 4.62",
    div: "TVC",
    coords: [10.0135, 76.2625],
    year: 2011,
    length: "4,620 m (4.62 km)",
    spans: "132 Spans of Prestressed Concrete Girders",
    health_score: 97,
    condition: "Pristine • Marine Cathodic Anti-Corrosion Protection",
    speed_limit: "80 km/h (Freight Lines)",
    desc: "Engineering marvel spanning the serene Vembanad backwaters, providing vital dedicated rail connectivity to the International Container Transshipment Terminal (ICTT).",
    specs: {
      rdso_standard: "Special Marine Concrete Structure Code IRS:CBC-2010",
      load_class: "Dedicated Heavy Haul Double-Stack Container",
      rail_weight: "60kg 1080 Head Hardened rails on Ballastless Track",
      substructure: "Driven precast concrete cylinder piles with epoxy-coated steel",
      superstructure: "Post-tensioned PSC box girders with marine waterproofing"
    },
    sensor_telemetry: {
      usfd_status: "Rail USFD: Pass • Marine ballastless track in optimal state",
      wear_index: "Chloride penetration depth: 0 mm (Marine sealant intact)",
      scour_depth: "Tidal scour telemetry: 0.15 m (Monitored via IoT buoys)",
      tgi_index: 98.6,
      vibration_rms: "Dynamic box girder deflection: 1.8 mm under 4,500t freight"
    },
    history: [
      { year: "2011", text: "Inaugurated as India's longest railway bridge (4.62 km)" },
      { year: "2018", text: "Withstood massive Kerala flood currents with 100% structural stability" },
      { year: "2024", text: "Comprehensive automated marine drone acoustic audit completed" }
    ],
    blocks: [
      { id: "BLK-TVC-2024-09", from: "10/05/24", to: "12/05/24", type: "Expansion Joint Servicing", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Port Siding Window",
      duration: "180 min (Ship Loading Gap)",
      machine: "Marine Inspection Catamaran + Track Gantry",
      crew: "12 Marine Engineers",
      estimated_cost: "₹78,000",
      train_impact: "No mainline disruption"
    }
  },
  {
    id: "SR-SHD-ERS-005",
    name: "Ernakulam Marshalling Yard & Diesel Depot",
    category: "Loco Sheds",
    icon: "🚂",
    type: "Coastal Fleet Maintenance Depot & Marshalling Yard",
    corridor_id: "PGT-TVC",
    corridor_name: "Palakkad - Trivandrum Coastline",
    section: "Ernakulam Junction",
    river: "Cochin Estuary",
    km: "Km. 685.0",
    div: "TVC",
    coords: [9.9680, 76.2920],
    year: 1980,
    length: "8 Pit Lines & 12 Marshalling Roads",
    spans: "Holding Capacity: 95 Locos",
    health_score: 93,
    condition: "Good • High Coastal Fleet Readiness",
    speed_limit: "Yard: 15 km/h",
    desc: "Strategically located operational center maintaining diesel and electric locomotives for the Arabian Sea coastal route, Kochi Port traffic, and Alappuzha/Kottayam branch lines.",
    specs: {
      rdso_standard: "RDSO Diesel & Electric Maintenance Manual",
      load_class: "WDM-3D, WDG-4, and WAP-7 Locomotives",
      rail_weight: "52kg/60kg yard tracks with fueling decanting facility",
      substructure: "Automated fuel injection testing laboratory",
      superstructure: "Heavy wheel lathe & oil re-conditioning unit"
    },
    sensor_telemetry: {
      usfd_status: "Loco Axle Testing: 100% compliant",
      wear_index: "Wheel flange wear: 30.1 mm (Safe)",
      scour_depth: "Fuel pipe pressure: 4.2 bar",
      tgi_index: 92.8,
      vibration_rms: "Engine vibration: Nominal"
    },
    history: [
      { year: "1980", text: "Commissioned as prime diesel depot for Central Kerala" },
      { year: "2015", text: "Upgraded with electric locomotive trip inspection bays" }
    ],
    blocks: [
      { id: "BLK-ERS-2024-03", from: "14/03/24", to: "16/03/24", type: "Fueling Line Upgradation", dur: "2 Days" }
    ],
    maintenance_req: {
      block_type: "Depot Internal Window",
      duration: "180 min (Internal)",
      machine: "Testing Jig",
      crew: "16 Technicians",
      estimated_cost: "₹48,000",
      train_impact: "No mainline disruption"
    }
  },
  {
    id: "SR-BRG-QLN-0014",
    name: "Ashtamudi Lake Rail Viaduct (Kollam)",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestessed Concrete Marine Rail Viaduct",
    corridor_id: "PGT-TVC",
    corridor_name: "Palakkad - Trivandrum Coastline",
    section: "Perinad – Kollam Junction",
    river: "Ashtamudi Lake (Ramsar Wetland)",
    km: "Km. 768.4",
    div: "TVC",
    coords: [8.9250, 76.5820],
    year: 1976,
    length: "940 m",
    spans: "22 Spans @ 42.7 m",
    health_score: 91,
    condition: "Good • Anti-Saline Polymer Coated",
    speed_limit: "100 km/h",
    desc: "Scenic marine viaduct traversing the Ashtamudi estuary with specialized polymer-coated concrete piers resistant to high saline backwater exposure.",
    specs: {
      rdso_standard: "IRS Concrete Bridge Code for Marine Environments",
      load_class: "25t Axle Load Standard",
      rail_weight: "60kg continuous welded rails on PSC bridge sleepers",
      substructure: "High-density sulphate-resistant cement well piers",
      superstructure: "Post-tensioned PSC I-girders with ballast retainers"
    },
    sensor_telemetry: {
      usfd_status: "Rail ultrasonic test: Pass",
      wear_index: "Pier concrete carbonation depth: 2.1 mm (Safe < 15 mm)",
      scour_depth: "Lake bed scour: Stable (0.2m)",
      tgi_index: 93.5,
      vibration_rms: "Viaduct vibration: 0.11g"
    },
    history: [
      { year: "1976", text: "Built during Kollam broad-gauge track realignment" },
      { year: "2019", text: "Polymer anti-corrosion coating applied to all submerged piers" }
    ],
    blocks: [
      { id: "BLK-QLN-2024-02", from: "19/02/24", to: "20/02/24", type: "Pier Cap Inspection", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "120 min (02:00 – 04:00 AM IST)",
      machine: "Bridge Inspection Pontoon",
      crew: "8 Marine Inspectors",
      estimated_cost: "₹36,000",
      train_impact: "Zero delay to passenger traffic"
    }
  },

  // ==========================================================================
  // 5. MADURAI - RAMESWARAM PAMBAN (MDU - RMM)
  // ==========================================================================
  {
    id: "SR-BRG-MDU-0001",
    name: "Pamban Railway Sea Lift Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Marine Vertical Lift Sea Bridge (World Heritage Feat)",
    corridor_id: "MDU-RMM",
    corridor_name: "Madurai - Rameswaram Pamban",
    section: "Mandapam – Rameswaram Island",
    river: "Palk Strait & Gulf of Mannar (Indian Ocean)",
    km: "Km. 2.06",
    div: "MDU",
    coords: [9.2825, 79.1983],
    year: 1914,
    length: "2,065 m (2.06 km)",
    spans: "143 Spans + 72.5m Vertical Lift Navigation Span",
    health_score: 84,
    condition: "Active Caution • Automated Wind Anemometer Interlocked",
    speed_limit: "30 km/h (Marine Crossing)",
    desc: "India's historic first sea bridge spanning the open ocean to Rameswaram Island. Upgraded with India's first electro-mechanical Vertical Lift Span clearing 22m for naval ship traffic.",
    specs: {
      rdso_standard: "Special IRS Severe Marine Environment Structural Standard",
      load_class: "Broad Gauge 25t Axle Load Electrified Dual-Track Ready",
      rail_weight: "Marine-grade stainless steel & galvanized 60kg rails",
      substructure: "145 composite steel-cased concrete piers sunk into ocean reef",
      superstructure: "Corrosion-resistant weathering steel with zinc metallization"
    },
    sensor_telemetry: {
      usfd_status: "Automated ultrasonic flaw sensors: 100% Pass",
      wear_index: "Wind speed anemometer live: 28 km/h (Interlock cutoff at 58 km/h)",
      scour_depth: "Ocean current velocity: 1.8 knots (Piers designed for 8.0 knots)",
      tgi_index: 86.4,
      vibration_rms: "Lift span counter-weight rope tension: Balanced within 0.5%"
    },
    history: [
      { year: "1914", text: "Historic Scherzer rolling lift bridge commissioned by SIR" },
      { year: "1964", text: "Heroic reconstruction in 46 days after catastrophic cyclone" },
      { year: "2007", text: "Broad Gauge conversion & structural strengthening" },
      { year: "2024", text: "New state-of-the-art automated vertical lift rail sea bridge built by RVNL" }
    ],
    blocks: [
      { id: "BLK-RMM-2024-01", from: "02/08/24", to: "06/08/24", type: "Vertical Lift Testing", dur: "4 Days" }
    ],
    maintenance_req: {
      block_type: "Traffic & Sea Block (Planned Window)",
      duration: "240 min (Tidal Neap Window)",
      machine: "RVNL Heavy Lift Maintenance Barge",
      crew: "18 Marine & Structural Engineers",
      estimated_cost: "₹1,45,000",
      train_impact: "Shuttle trains halted at Mandapam during lift calibration"
    }
  },
  {
    id: "SR-SIG-ANM-001",
    name: "Pamban Marine Anemometer Interlocking System",
    category: "Signalling & Telecom",
    icon: "🔴",
    type: "Automated Wind Speed Warning & Signal Tripping System",
    corridor_id: "MDU-RMM",
    corridor_name: "Madurai - Rameswaram Pamban",
    section: "Mandapam Outer – Pamban Pier",
    river: "Palk Strait Coast",
    km: "Km. 2.05",
    div: "MDU",
    coords: [9.2830, 79.1850],
    year: 2020,
    length: "Dual Anemometer Array (North & South)",
    spans: "Fail-Safe Direct Signal Interlock",
    health_score: 98,
    condition: "Good • Real-Time Satellite Telemetry",
    speed_limit: "Trips Signal to Danger if Wind > 58 km/h",
    desc: "Critical life-safety device that automatically turns entry signals to red and alerts the Station Masters at Mandapam and Pamban if ocean gale winds exceed 58 km/h.",
    specs: {
      rdso_standard: "RDSO Specification for Ultrasonic Wind Anemometers",
      load_class: "Fail-Safe Electronic Logic (CENELEC SIL-4)",
      rail_weight: "Solid-state solar powered with dual backup batteries",
      substructure: "Titanium casing with anti-saline marine coating",
      superstructure: "Direct optic-fiber link to Central Dispatch Cab"
    },
    sensor_telemetry: {
      usfd_status: "Anemometer response latency: 40 milliseconds",
      wear_index: "Sensor calibration drift: 0.1% (Certified)",
      scour_depth: "Battery float voltage: 27.6 V DC",
      tgi_index: 99.4,
      vibration_rms: "Signal interlocking relay status: Normal Green"
    },
    history: [
      { year: "2020", text: "Digital ultrasonic anemometers deployed replacing mechanical cups" }
    ],
    blocks: [
      { id: "BLK-ANM-2024-01", from: "15/05/24", to: "16/05/24", type: "Sensor Calibration", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "S&T Inspection Window",
      duration: "60 min (Non-Peak)",
      machine: "Calibration Wind Tunnel Rig",
      crew: "4 S&T Signal Engineers",
      estimated_cost: "₹18,000",
      train_impact: "Zero delay to trains"
    }
  },

  // ==========================================================================
  // 6. MALABAR WEST COAST LINE (PGT - MAQ)
  // ==========================================================================
  {
    id: "SR-BRG-CLT-0012",
    name: "Kadalundi River Rail Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Steel Girder on Concrete Well Piers",
    corridor_id: "PGT-MAQ",
    corridor_name: "Malabar West Coast Line",
    section: "Parappanangadi – Kadalundi",
    river: "River Kadalundi",
    km: "Km. 642.0",
    div: "PGT",
    coords: [11.1250, 75.8300],
    year: 2002,
    length: "520 m",
    spans: "16 Spans @ 32.5 m",
    health_score: 95,
    condition: "Good • High Safety Factor",
    speed_limit: "110 km/h",
    desc: "Robust modern bridge rebuilt with high-strength reinforced concrete piers and composite girders over the Kadalundi estuary with continuous seismic telemetry.",
    specs: {
      rdso_standard: "IRS Bridge Rules & Concrete Code 2000",
      load_class: "25t Axle Load Compliant",
      rail_weight: "60kg UIC Continuous Welded Rail",
      substructure: "Cast-in-situ reinforced concrete well piers sunk to granite",
      superstructure: "Steel plate girders with reinforced concrete deck"
    },
    sensor_telemetry: {
      usfd_status: "Rail weld scan: Pass 100%",
      wear_index: "Pier tilt monitoring: 0.001° (Stable)",
      scour_depth: "Scour telemetry: 0.18 m",
      tgi_index: 95.2,
      vibration_rms: "Deck vibration: 0.09g"
    },
    history: [
      { year: "2002", text: "New ultra-modern double-line bridge commissioned" },
      { year: "2020", text: "Acoustic pier health monitoring installed" }
    ],
    blocks: [
      { id: "BLK-CLT-2024-02", from: "14/02/24", to: "15/02/24", type: "Girder Painting & Audit", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "120 min (01:30 – 03:30 AM IST)",
      machine: "Bridge Inspection Gantry",
      crew: "8 Bridge Mechanics",
      estimated_cost: "₹38,000",
      train_impact: "0 delay"
    }
  },
  {
    id: "SR-DPT-MAQ-001",
    name: "Mangaluru Central Coaching Depot (MAQ)",
    category: "Coach Depots",
    icon: "🧰",
    type: "Terminal Coastal Coaching Maintenance Complex",
    corridor_id: "PGT-MAQ",
    corridor_name: "Malabar West Coast Line",
    section: "Mangaluru Central Outer",
    river: "Netravati River Basin",
    km: "Km. 887.0",
    div: "PGT",
    coords: [12.8687, 74.8427],
    year: 1988,
    length: "6 Pit Lines (Capacity: 18 Rakes/Day)",
    spans: "Automated Bio-Toilet Discharge & Pit Lathes",
    health_score: 93,
    condition: "Good • High Turnaround Capability",
    speed_limit: "Yard: 15 km/h",
    desc: "Northern gateway coaching facility connecting Southern Railway with Konkan Railway (KRCL) and South Western Railway (SWR).",
    specs: {
      rdso_standard: "CAMTECH LHB & ICF Maintenance Code",
      load_class: "Broad Gauge 24-Coach Rakes",
      rail_weight: "Covered CAMTECH pits with compressed air pipelines",
      substructure: "Effluent treatment plant with 95% water recycling",
      superstructure: "Overhead 25kV catenary isolation switches"
    },
    sensor_telemetry: {
      usfd_status: "Coach Axle Ultrasonic scan: 100% compliant",
      wear_index: "Wheel flange profile: Certified",
      scour_depth: "Brake testing rig pressure: 5.0 kg/cm²",
      tgi_index: 94.0,
      vibration_rms: "Water recycling efficiency: 96%"
    },
    history: [
      { year: "1988", text: "Established for Malabar coastal trains" },
      { year: "2018", text: "Upgraded with automated coach washing plant (ACWP)" }
    ],
    blocks: [
      { id: "BLK-MAQ-2024-05", from: "12/05/24", to: "13/05/24", type: "Pit Line Grouting", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Depot Stabling Window",
      duration: "240 min (Turnaround Window)",
      machine: "Pit Testing Unit",
      crew: "18 Technicians",
      estimated_cost: "₹48,000",
      train_impact: "No mainline disruption"
    }
  },
// ==========================================================================
  // 7. TIRUCHIRAPPALLI - DELTA CHORD (TPJ - DELTA)
  // ==========================================================================
  {
    id: "SR-BRG-TJ-0005",
    name: "Vennar River Rail Bridge (Thanjavur)",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestressed Concrete Girder Bridge",
    corridor_id: "TPJ-DELTA",
    corridor_name: "Tiruchirappalli - Delta Chord",
    section: "Thanjavur – Budalur",
    river: "River Vennar (Cauvery Tributary)",
    km: "Km. 352.0",
    div: "TPJ",
    coords: [10.7920, 79.1350],
    year: 1984,
    length: "380 m",
    spans: "10 Spans @ 38.0 m",
    health_score: 93,
    condition: "Good • Normal Speed (100 km/h)",
    speed_limit: "100 km/h",
    desc: "Vital rail link carrying rice grain and delta passenger traffic across the Vennar River between Thanjavur and Tiruchirappalli.",
    specs: {
      rdso_standard: "IRS Concrete Bridge Code",
      load_class: "25t Axle Load Standard",
      rail_weight: "52kg / 60kg Continuous Welded Rail",
      substructure: "Circular well foundations with reinforced concrete caps",
      superstructure: "Post-tensioned PSC I-girders"
    },
    sensor_telemetry: {
      usfd_status: "Rail USFD: Pass",
      wear_index: "0.28 mm rail head wear",
      scour_depth: "Scour: 0.15 m",
      tgi_index: 93.1,
      vibration_rms: "0.09g"
    },
    history: [
      { year: "1984", text: "Constructed during broad-gauge conversion of delta mainline" },
      { year: "2019", text: "Electrification 25kV OHE commissioned" }
    ],
    blocks: [
      { id: "BLK-TJ-2024-02", from: "14/03/24", to: "15/03/24", type: "Pier Inspection", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "120 min (02:00 – 04:00 AM IST)",
      machine: "Bridge Inspection Pontoon",
      crew: "8 Bridge Fitters",
      estimated_cost: "₹32,000",
      train_impact: "0 delay"
    }
  },
  {
    id: "SR-TRD-SSP-019",
    name: "Mayiladuthurai TRD Sub-Sectioning Post (SSP)",
    category: "Traction & OHE",
    icon: "⚡",
    type: "25kV AC Traction Sub-Sectioning Post",
    corridor_id: "TPJ-DELTA",
    corridor_name: "Tiruchirappalli - Delta Chord",
    section: "Mayiladuthurai Junction",
    river: "Delta Basin",
    km: "Km. 281.0",
    div: "TPJ",
    coords: [11.1018, 79.6522],
    year: 2020,
    length: "Feeding Sector: 32 km",
    spans: "Interrupter & Bridging Switch Panel",
    health_score: 96,
    condition: "Good • SCADA Monitored",
    speed_limit: "100 km/h Line Voltage 26.0 kV",
    desc: "Enables rapid electrical isolation and sector switching across the Delta chord line, protecting the Chidambaram and Cuddalore branches.",
    specs: {
      rdso_standard: "TI/SPC/OHE/SWITCH/01 (RDSO TRD Standard)",
      load_class: "Continuous 600A Current Rating",
      rail_weight: "107 mm² Contact wire with motorized vacuum circuit breakers",
      substructure: "Galvanized steel gantry masts",
      superstructure: "Composite polymer insulators"
    },
    sensor_telemetry: {
      usfd_status: "N/A",
      wear_index: "Contact wire thickness: 11.4 mm",
      scour_depth: "Insulation resistance: > 2500 Megohms",
      tgi_index: 97.5,
      vibration_rms: "OHE tension: 1000 kgf"
    },
    history: [
      { year: "2020", text: "Commissioned with the 100% electrification of the Delta Main Line" }
    ],
    blocks: [
      { id: "BLK-MV-2024-01", from: "08/04/24", to: "09/04/24", type: "Vacuum Circuit Breaker POH", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Power Block",
      duration: "90 min (01:30 – 03:00 AM IST)",
      machine: "Tower Wagon RU-08",
      crew: "6 TRD Linemen",
      estimated_cost: "₹24,000",
      train_impact: "Power back-fed from Villupuram TSS"
    }
  },
  {
    id: "SR-GDS-KIK-001",
    name: "Karaikal Port Bulk Cargo Rail Siding",
    category: "Goods Sheds",
    icon: "📦",
    type: "Deep-Water Port Bulk Mineral Rail Terminal",
    corridor_id: "TPJ-DELTA",
    corridor_name: "Tiruchirappalli - Delta Chord",
    section: "Nagore – Karaikal Port",
    river: "Coromandel Coast",
    km: "Km. 312.0",
    div: "TPJ",
    coords: [10.8350, 79.8450],
    year: 2011,
    length: "6 Full-Length Wagon Handling Lines",
    spans: "Rotary Car Dumper & Rapid Loading System",
    health_score: 92,
    condition: "Good • High Tonnage Terminal",
    speed_limit: "Yard: 15 km/h",
    desc: "Key freight terminal moving imported thermal coal, gypsum, and fertilizers to cement plants and thermal power stations in central Tamil Nadu.",
    specs: {
      rdso_standard: "Indian Railways Private Freight Terminal (PFT) Manual",
      load_class: "CC+8+2 Heavy Axle Load BOXNHL Rakes",
      rail_weight: "60kg UIC rails on reinforced concrete yard track",
      substructure: "High-capacity automated in-motion weighbridge",
      superstructure: "Overhead dust suppression mist cannons"
    },
    sensor_telemetry: {
      usfd_status: "Yard track USFD: Pass",
      wear_index: "Weighbridge calibration: Certified by Weights & Measures",
      scour_depth: "Track drainage: 100% operational",
      tgi_index: 90.4,
      vibration_rms: "Low speed shunting"
    },
    history: [
      { year: "2011", text: "Commissioned as deep-water port railway siding" },
      { year: "2021", text: "Upgraded for 25t heavy axle mineral hopper rakes" }
    ],
    blocks: [
      { id: "BLK-KIK-2024-03", from: "19/06/24", to: "20/06/24", type: "Weighbridge Sensor Calibration", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Port Siding Window",
      duration: "180 min (Berth Idle Gap)",
      machine: "P-Way Relaying Kit",
      crew: "10 Staff",
      estimated_cost: "₹35,000",
      train_impact: "No mainline impact"
    }
  },

  // ==========================================================================
  // 8. MADURAI - TIRUNELVELI SOUTH TRUNK (MDU - TEN)
  // ==========================================================================
  {
    id: "SR-BRG-TEN-0011",
    name: "Thamirabarani River Rail Bridge (Tirunelveli)",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestressed Concrete Box Girder Bridge",
    corridor_id: "MDU-TEN",
    corridor_name: "Madurai - Tirunelveli South Trunk",
    section: "Tirunelveli Junction – Palayamkottai",
    river: "River Thamirabarani",
    km: "Km. 156.2",
    div: "MDU",
    coords: [8.7150, 77.7450],
    year: 1978,
    length: "540 m",
    spans: "14 Spans @ 38.5 m",
    health_score: 95,
    condition: "Good • Normal Speed (110 km/h)",
    speed_limit: "110 km/h",
    desc: "Major southern bridge crossing the perennial Thamirabarani River connecting Tirunelveli with Nagercoil and Kanyakumari.",
    specs: {
      rdso_standard: "IRS Concrete Bridge Code (25t Loading)",
      load_class: "25t Heavy Axle Load",
      rail_weight: "60kg 90UTS Continuous Welded Rail",
      substructure: "Reinforced concrete well foundations anchored to bedrock",
      superstructure: "Post-tensioned PSC box girders with ballast retainers"
    },
    sensor_telemetry: {
      usfd_status: "Rail USFD: Pass • No defects",
      wear_index: "Expansion joint: Nominal (22 mm)",
      scour_depth: "Scour depth: 0.22 m (Safe)",
      tgi_index: 95.8,
      vibration_rms: "0.10g at 110 km/h"
    },
    history: [
      { year: "1978", text: "Built during Tirunelveli-Kanyakumari broad-gauge extension" },
      { year: "2017", text: "Electrification 25kV OHE commissioned" }
    ],
    blocks: [
      { id: "BLK-TEN-2024-02", from: "20/04/24", to: "21/04/24", type: "Hydrological Inspection", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Shadow Block",
      duration: "120 min (01:45 – 03:45 AM IST)",
      machine: "Bridge Inspection Gantry",
      crew: "8 Bridge Staff",
      estimated_cost: "₹34,000",
      train_impact: "Zero delay to passenger traffic"
    }
  },
  {
    id: "SR-TRD-TSS-052",
    name: "Vanchi Maniyachchi 25kV Traction Substation",
    category: "Traction & OHE",
    icon: "⚡",
    type: "110kV / 25kV Traction Power Substation",
    corridor_id: "MDU-TEN",
    corridor_name: "Madurai - Tirunelveli South Trunk",
    section: "Vanchi Maniyachchi Junction",
    river: "South Plains",
    km: "Km. 128.0",
    div: "MDU",
    coords: [8.8600, 77.8700],
    year: 2015,
    length: "Feeding Range: 54 km",
    spans: "Dual 21.6 MVA Traction Transformers",
    health_score: 96,
    condition: "Good • Fully Automated SCADA",
    speed_limit: "110 km/h Line Voltage 26.2 kV",
    desc: "Powers the junction bifurcation point feeding trains continuing to Tirunelveli as well as container and bulk traffic to V.O. Chidambaranar Port (Tuticorin).",
    specs: {
      rdso_standard: "TI/SPC/OHE/25KV/01",
      load_class: "Peak Load: 28 MVA",
      rail_weight: "107 mm² Contact wire with auto-tensioning device (ATD)",
      substructure: "Earth resistance grid: 0.42 ohms (RDSO standard < 0.5 ohms)",
      superstructure: "Gas-insulated SF6 circuit breakers"
    },
    sensor_telemetry: {
      usfd_status: "N/A",
      wear_index: "Contact wire thickness: 11.5 mm",
      scour_depth: "Transformer winding temperature: 52°C",
      tgi_index: 97.1,
      vibration_rms: "OHE ATD tension: 1000 kgf"
    },
    history: [
      { year: "2015", text: "Commissioned under the Madurai-Tuticorin-Tirunelveli electrification project" }
    ],
    blocks: [
      { id: "BLK-MEJ-2024-01", from: "11/02/24", to: "12/02/24", type: "Transformer Oil Testing", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Power Block",
      duration: "90 min (02:00 – 03:30 AM IST)",
      machine: "Tower Wagon 8W",
      crew: "6 TRD Linemen",
      estimated_cost: "₹26,000",
      train_impact: "Power transferred seamlessly"
    }
  },
  {
    id: "SR-YRD-MEJ-001",
    name: "Vanchi Maniyachchi Junction Yard & Triangle",
    category: "Railway Yards",
    icon: "🚉",
    type: "Bifurcation Junction Yard & Wye Triangle",
    corridor_id: "MDU-TEN",
    corridor_name: "Madurai - Tirunelveli South Trunk",
    section: "Vanchi Maniyachchi Junction",
    river: "South Trunk Triangle",
    km: "Km. 127.5",
    div: "MDU",
    coords: [8.8650, 77.8680],
    year: 1965,
    length: "8 Station & Stabling Roads + Direct Wye Chord",
    spans: "Direct bypass chord to VOC Port (Tuticorin)",
    health_score: 93,
    condition: "Good • Electronic Interlocking with Dual VDU",
    speed_limit: "Main: 110 km/h, Wye Chord: 40 km/h",
    desc: "Historic railway junction where Tuticorin container traffic and Tirunelveli-Kanyakumari passenger traffic diverge, featuring a direct non-reversal chord line.",
    specs: {
      rdso_standard: "IRS:S 36/2004 Electronic Interlocking",
      load_class: "Heavy Container & Freight Rakes",
      rail_weight: "60kg UIC rails on PSC sleepers with rubber pads",
      substructure: "Digital axle counters across all 8 yard roads",
      superstructure: "Centralized relay cab with LED mimic diagram"
    },
    sensor_telemetry: {
      usfd_status: "Yard turnouts USFD: Pass",
      wear_index: "Tongue rail wear: 1.8 mm (Safe)",
      scour_depth: "Point operating time: 4.8 seconds",
      tgi_index: 92.0,
      vibration_rms: "Smooth divergence"
    },
    history: [
      { year: "1965", text: "Broad gauge conversion and triangle chord laid" },
      { year: "2019", text: "Electronic Interlocking commissioned replacing mechanical levers" }
    ],
    blocks: [
      { id: "BLK-MEJ-2024-04", from: "15/07/24", to: "16/07/24", type: "Chord Track Re-alignment", dur: "1 Day" }
    ],
    maintenance_req: {
      block_type: "Yard Road Track Block",
      duration: "150 min (Afternoon Lull)",
      machine: "T-28 Relaying Machine",
      crew: "12 P-Way Staff",
      estimated_cost: "₹38,000",
      train_impact: "No mainline disruption"
    }
  }
];


// ============================================================================
// AI CORRIDOR & ASSET INTELLIGENCE ENGINE
// ============================================================================

export function generateAssetAIDossier(asset) {
  if (!asset) return "Asset not found in CRIS Southern Railway Registry.";

  const historyLines = (asset.history || []).map(h => "* **" + h.year + ":** " + h.text).join("\n");
  const usfd = asset.sensor_telemetry?.usfd_status || "Pass - No Defects Detected";
  const wear = asset.sensor_telemetry?.wear_index || "Within Permissible Envelope";
  const scour = asset.sensor_telemetry?.scour_depth || "Nominal Safe Margin";
  const tgi = asset.sensor_telemetry?.tgi_index || 95.0;
  const vib = asset.sensor_telemetry?.vibration_rms || "Within RDSO Dynamics Envelope";

  return "### 🛡️ CRIS AI Asset Intelligence Dossier: " + asset.name + " (" + asset.id + ")\n\n" +
    "**Classification:** " + asset.category + " • " + asset.type + "\n" +
    "**Location:** " + asset.section + " (" + (asset.km || "") + ") • Division: **" + asset.div + "** • Corridor: **" + (asset.corridor_name || asset.corridor_id) + "**\n" +
    "**Operational Health Index:** **" + asset.health_score + "%** — *" + asset.condition + "*\n" +
    "**Permitted Line Speed:** " + asset.speed_limit + " • **Commissioned:** " + asset.year + "\n\n" +
    "---\n\n" +
    "#### 📐 1. Physical & Structural Baseline\n" +
    "* **RDSO Specification Standard:** " + (asset.specs?.rdso_standard || "RDSO Indian Railways Code") + "\n" +
    "* **Load Capacity:** " + (asset.specs?.load_class || "25t Axle Load Standard") + "\n" +
    "* **Track / Rail Profile:** " + (asset.specs?.rail_weight || "60kg 90UTS Continuous Welded Rail") + "\n" +
    "* **Substructure:** " + (asset.specs?.substructure || "Reinforced concrete / masonry") + "\n" +
    "* **Superstructure / Equipment:** " + (asset.specs?.superstructure || "Standard RDSO compliant design") + "\n" +
    "* **Dimensions:** Length: " + asset.length + " | Spans / Holding: " + asset.spans + "\n\n" +
    "---\n\n" +
    "#### 🩺 2. Live Sensor Telemetry & USFD Inspection Log\n" +
    "* **Ultrasonic Flaw Detection (USFD):** `" + usfd + "`\n" +
    "* **Mechanical / Rail Wear:** `" + wear + "`\n" +
    "* **Scour / Temperature / Oil:** `" + scour + "`\n" +
    "* **Track Geometry Index (TGI):** `" + tgi + " / 100`\n" +
    "* **Vibration & Dynamics:** `" + vib + "`\n\n" +
    "---\n\n" +
    "#### 📜 3. Chronological Overhaul & Maintenance History\n" +
    historyLines + "\n\n" +
    "---\n\n" +
    "#### 🛠️ 4. Recommended Maintenance & Block Window\n" +
    "* **Required Block Type:** `" + (asset.maintenance_req?.block_type || "Shadow Block") + "`\n" +
    "* **Optimal Window Duration:** **" + (asset.maintenance_req?.duration || "150 min") + "**\n" +
    "* **Machinery Deployed:** " + (asset.maintenance_req?.machine || "CSM 09-32 Tamper + Tower Wagon") + "\n" +
    "* **Specialized Crew Allocation:** " + (asset.maintenance_req?.crew || "10 Specialized Railway Technicians") + "\n" +
    "* **Estimated Direct Job Cost:** **" + (asset.maintenance_req?.estimated_cost || "₹48,000") + "**\n" +
    "* **Operational Traffic Impact:** *" + (asset.maintenance_req?.train_impact || "0 minutes passenger delay") + "*\n";
}

export function generateCorridorAIAudit(corridorId) {
  let assets = CORRIDOR_ASSETS_REGISTRY;
  if (corridorId && corridorId !== "ALL") {
    assets = CORRIDOR_ASSETS_REGISTRY.filter(a => a.corridor_id === corridorId);
  }

  const total = assets.length;
  if (total === 0) return "No assets registered on corridor " + corridorId;

  const good = assets.filter(a => a.health_score >= 90).length;
  const fair = assets.filter(a => a.health_score >= 75 && a.health_score < 90).length;
  const critical = assets.filter(a => a.health_score < 75);
  const avgHealth = Math.round(assets.reduce((s, a) => s + a.health_score, 0) / total);
  const corridorName = assets[0]?.corridor_name || (corridorId === "ALL" ? "All Zone 07 Corridors" : corridorId);

  let critText = "";
  if (critical.length > 0) {
    critText = "\n---\n#### ⚠️ Critical Assets Requiring Block Preemption:\n" +
      critical.map(c => "* **[" + c.id + "] " + c.name + "** (" + c.section + ", " + (c.km || "") + "): Health Score **" + c.health_score + "%** — *" + c.condition + "*\n  * **Recommended Action:** Sanction " + (c.maintenance_req?.block_type || "Shadow Block") + " (" + (c.maintenance_req?.duration || "150m") + ") with " + (c.maintenance_req?.machine || "Maintenance Unit") + ".").join("\n");
  } else {
    critText = "\n---\n#### ✅ Corridor Health Status:\nAll monitored assets are currently operating within nominal RDSO safety thresholds with zero critical derailment or failure risks.";
  }

  return "### 🧠 CRIS Autonomous AI Corridor Asset Audit: " + corridorName + "\n\n" +
    "Chief Controller, I have completed a multi-disciplinary audit across all **" + total + " monitored assets** on this corridor:\n\n" +
    "* **Overall Network Health Index:** **" + avgHealth + "%**\n" +
    "* **Asset Condition Breakdown:**\n" +
    "  * 🟢 **Good Condition (≥90%):** " + good + " assets\n" +
    "  * 🟡 **Fair / Attention (75–89%):** " + fair + " assets\n" +
    "  * 🔴 **Critical / Block Due (<75%):** " + critical.length + " assets\n" +
    critText + "\n\n" +
    "---\n" +
    "#### ⚡ AI Recommended Bundled Shadow Block:\n" +
    "During the upcoming nocturnal freight lull (01:15 – 04:00 IST), I recommend bundling Civil track tamping and TRD catenary inspections to maximize possession efficiency with **0.0 minutes knock-on delay to passenger traffic**.\n";
}
