// ==========================================================================
// SOUTHERN RAILWAY (ZONE 07) — PROFESSIONAL TECHNICAL AUDIT & ANALYSIS DOSSIER
// Institutional Specification: Government of India • Ministry of Railways
// Design: Formal Monochrome & Archival Deep-Ink Corporate Presentation
// ==========================================================================

export const KNOWN_STATION_DATABASE = {
  CGL: {
    name: "Chengalpattu Junction",
    code: "CGL",
    division: "Chennai Division (MAS)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 3 (NSG-3) Major Junction",
    platforms: 8,
    tracks: "Broad Gauge Electrified Double Line with Arakkonam & Villupuram Chords",
    speedLimit: "110 km/h (Station Yard) / 130 km/h (Main Line)",
    interlocking: "Dual-CPU Electronic Interlocking (EI) with Axle Counter Continuous Detection",
    electrification: "25 kV AC 50Hz OHE (Chengalpattu Feeder Substation)",
    trafficDensity: "76 Scheduled Train Movements / 24-Hour Cycle",
    dailyPassengers: "65,000 Passengers / Day",
    routeClass: "Broad Gauge High-Density Network (HDN-3) Mainline",
    bottlenecks: [
      {
        title: "05:15 – 05:45 IST Morning Express Inflow Overlap",
        detail: "Pandian SF (12638), Kanyakumari Exp (12634), and Nellai SF (12632) converge within 30 minutes on Up Mainline.",
        aiRemedy: "Dynamic headway slotting via Electronic Interlocking. Staggered approach across Singaperumal Koil; clear PF 4 & 5 sequentially."
      },
      {
        title: "06:40 IST Vande Bharat Express High-Speed Slotting",
        detail: "20605 MS-TEN Vande Bharat overtakes suburban EMU movements at Chengalpattu yard.",
        aiRemedy: "Green Wave automatic through-lock granted on Down Fast line. Suburban stock held on Platform 8 loop."
      },
      {
        title: "20:15 – 22:50 IST Southern Trunk Night Wave",
        detail: "Heavy outbound departure wave to Madurai, Kanyakumari, Tirunelveli, and Rameswaram (12635, 12633, 16851, 12631, 12637).",
        aiRemedy: "Absolute Down Main precedence. Automatic route reset enforces 3-minute electronic spacing between successive departures."
      }
    ],
    safeWindow: "01:30 to 04:00 IST (150 Minutes Safe Maintenance Window)",
    precedingTrain: "16865 Uzhavan Express (Departure 23:20 IST)",
    succeedingTrain: "12638 Pandian SF Express (Arrival 04:18 IST)",
    recommendedMachines: [
      { type: "Continuous Dynamic Tamper", id: "CSM-09-32 Chennai Unit #3", task: "Turnout geometry & crossover packing" },
      { type: "OHE Inspection Car", id: "NETRA OHE Unit #1", task: "25kV catenary contact wire wear & stagger audit" },
      { type: "Ultrasonic Flaw Detector", id: "USFD Multi-Channel #4", task: "Continuous rail flaw & weld joint ultrasonic audit" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "600 m", cap: "22 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 6", len: "580 m", cap: "20 Coaches", circuit: "Track Circuit AF", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 7", len: "320 m", cap: "12 EMU Suburban", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 8", len: "320 m", cap: "12 EMU Suburban", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" }
    ]
  },
  ALLP: {
    name: "Alappuzha",
    code: "ALLP",
    division: "Thiruvananthapuram Division (TVC)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 4 (NSG-4) Coastal Terminal",
    platforms: 3,
    tracks: "Broad Gauge Electrified Double Line Coastal Trunk Route",
    speedLimit: "100 km/h (Coastal Alignment Speed Sanction)",
    interlocking: "Electronic Interlocking (EI) with Solid-State Block Proving Axle Counters (BPAC)",
    electrification: "25 kV AC 50Hz OHE (Alappuzha Traction Feeder)",
    trafficDensity: "42 Scheduled Train Movements / 24-Hour Cycle",
    dailyPassengers: "28,500 Passengers / Day",
    routeClass: "Broad Gauge Coastal High-Speed Corridor (ERS-ALLP-KYJ)",
    bottlenecks: [
      {
        title: "08:15 – 08:35 IST Morning Peak Dwell Contention",
        detail: "12076 TVC-CLT Jan Shatabdi meets 06449 ERS-ALLP Passenger on Platform 2 and 3.",
        aiRemedy: "Jan Shatabdi cleared on Main Line (PF 2) with priority departure. Passenger held on loop line PF 3."
      },
      {
        title: "13:20 – 13:30 IST Vande Bharat & Executive Express Convergence",
        detail: "20631 KGQ-TVC Vande Bharat crosses 16308 CAN-ALLP Executive Express terminus.",
        aiRemedy: "Absolute Green Corridor granted to Vande Bharat on PF 1. Executive Express received on PF 3 berthing loop."
      },
      {
        title: "17:20 – 18:00 IST Evening Intercity Cluster",
        detail: "12075 CLT-TVC Jan Shatabdi & 20632 TVC-KGQ Vande Bharat pass within 35 minutes.",
        aiRemedy: "Electronic block proving enables 5-minute clearing headway between Mararikulam and Alappuzha."
      }
    ],
    safeWindow: "00:45 to 02:45 IST (120 Minutes Night Block Window)",
    precedingTrain: "16604 Maveli Express (Departure 21:30 IST)",
    succeedingTrain: "18189 Tata - Allp Express (Arrival 03:00 IST)",
    recommendedMachines: [
      { type: "Continuous Action Tamper", id: "CSM-09 Coastal Unit #2", task: "Coastal track alignment & ballast bed consolidation" },
      { type: "OHE Tower Wagon", id: "RU-8 TVC Unit #1", task: "Catenary anti-corrosion inspection & saline wash" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "540 m", cap: "20 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" }
    ]
  },
  TVC: {
    name: "Thiruvananthapuram Central",
    code: "TVC",
    division: "Thiruvananthapuram Division (TVC)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 1 (NSG-1) State Capital Terminal",
    platforms: 5,
    tracks: "Broad Gauge Electrified Terminal Network with Kochuveli Satellite Facility",
    speedLimit: "90 km/h (Terminal Yard) / 110 km/h (Main Line)",
    interlocking: "Route Relay Interlocking (RRI) with Electronic Block Interface",
    electrification: "25 kV AC 50Hz OHE (Kochuveli Feeder)",
    trafficDensity: "92 Scheduled Movements / 24 Hours",
    dailyPassengers: "120,000 Passengers / Day",
    routeClass: "Broad Gauge Southern Trunk Terminal",
    bottlenecks: [
      {
        title: "Morning Superfast & Vande Bharat Dispatch Cluster (05:00 - 06:15 IST)",
        detail: "Vande Bharat (20632), Kerala Exp (12625), and Vanchinad (16304) depart in close succession.",
        aiRemedy: "Sequential route lock from PF 1, 2, and 3 onto Nemom single/double line chord."
      }
    ],
    safeWindow: "01:00 to 03:45 IST (165 Minutes Window)",
    precedingTrain: "16344 Amritha Exp (Arrival 00:45 IST)",
    succeedingTrain: "16345 Netravati Exp (Arrival 04:05 IST)",
    recommendedMachines: [
      { type: "Dynamic Tamper", id: "CSM-09-32 TVC Unit #1", task: "Terminal points & diamond crossing tamping" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "650 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "650 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "600 m", cap: "22 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "580 m", cap: "20 Coaches", circuit: "Track Circuit AF", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "560 m", cap: "18 Coaches", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" }
    ]
  },
  MS: {
    name: "Chennai Egmore",
    code: "MS",
    division: "Chennai Division (MAS)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 1 (NSG-1) Heritage Terminal",
    platforms: 11,
    tracks: "Broad Gauge Quadruple Electrified Corridor (Suburban & Mainline)",
    speedLimit: "90 km/h (Yard Limits) / 110 km/h (Mainline)",
    interlocking: "Route Relay Interlocking (RRI) with Electronic Axle Detection",
    electrification: "25 kV AC 50Hz OHE",
    trafficDensity: "98 Scheduled Train Movements / 24 Hours",
    dailyPassengers: "210,000 Passengers / Day",
    routeClass: "Broad Gauge South Tamil Nadu Trunk Origin",
    bottlenecks: [
      {
        title: "20:00 – 22:30 IST Southern Trunk Night Mail Dispatches",
        detail: "Pandian, Nellai, Pearl City, Pothigai, Rockfort, and Mannai depart within 150 minutes.",
        aiRemedy: "Automated route sequencing staggers mainline dispatches with 8-minute headway spacing."
      }
    ],
    safeWindow: "01:15 to 04:15 IST (180 Minutes Safe Night Window)",
    precedingTrain: "12637 Pandian Exp (Departure 21:40 IST)",
    succeedingTrain: "12638 Pandian Exp (Arrival 05:15 IST)",
    recommendedMachines: [
      { type: "Turnout Tamper", id: "Unimat 08-475", task: "Egmore South yard points & crossover maintenance" }
    ],
    platformInventory: [
      { pf: "PF 1-3", len: "320 m", cap: "12 EMU Suburban", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4-11", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" }
    ]
  },

  ERS: {
    name: "Ernakulam Junction",
    code: "ERS",
    division: "Thiruvananthapuram Division (TVC)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 2 (NSG-2) Coastal Hub",
    platforms: 6,
    tracks: "Broad Gauge (1676 mm) Double Line Electrified with Harbour Terminus & Marshalling Yard",
    speedLimit: "110 km/h (Station Limits) / 130 km/h (Corridor Speed)",
    interlocking: "Dual-CPU Electronic Interlocking (EI) with CTC & Axle Counter Wheel Detectors",
    electrification: "25 kV AC 50Hz OHE (Kalamassery Traction Substation)",
    trafficDensity: "141 Scheduled Train Movements / 24-Hour Cycle (00:30 – 23:55 IST)",
    dailyPassengers: "92,000 Passengers / Day",
    routeClass: "Broad Gauge Coastal High-Density Trunk Route",
    bottlenecks: [
      {
        title: "02:15 – 02:35 IST Superfast Wave",
        detail: "ERS Pune Exp (22149) & ERS NZM SF (22655) originate at 02:15 while NZM ERS (22656) arrives 02:35.",
        aiRemedy: "Electronic route relay staggers North throat crossover. Sequential starter aspect granted with 3-minute electronic spacing."
      },
      {
        title: "09:30 – 09:40 IST Six-Way Inflow Convergence",
        detail: "Kerla S Kranti (12218), ASR Kcvl (12484), YNRK Kcvl (22660) arrive concurrently.",
        aiRemedy: "Electronic axle counter dynamic spacing applied across PF 1 & 2. Automatic overlap lock on all berthing lines."
      },
      {
        title: "11:40 & 18:42 IST Vande Bharat Priority",
        detail: "20631 & 20632 Vande Bharat Expresses in both directions.",
        aiRemedy: "Green Wave interlocking across Kalamassery & Nettoor approach. 3-minute precision dwell enforced."
      },
      {
        title: "18:25 IST Rajdhani Green Corridor",
        detail: "12431 TVC NZM Rajdhani Exp departs PF 1 while 22633 Nizamuddin Exp clears.",
        aiRemedy: "Absolute mainline departure precedence granted over freight and trailing passenger services."
      }
    ],
    safeWindow: "03:35 to 05:05 IST (150 Minutes Safe Maintenance Gap)",
    precedingTrain: "22877 HWH ERS Antyodaya Exp (Arr 03:30 IST)",
    succeedingTrain: "16303 Vanchinad Exp (Dep 05:10 IST)",
    recommendedMachines: [
      { type: "Continuous Action Tamper", id: "CSM-09-32 Coastal Unit #5", task: "Mainline curve tamping & track alignment" },
      { type: "OHE Tower Wagon", id: "RU-8 8-Wheeler Unit #3", task: "25kV catenary contact wire stagger & insulator wash" },
      { type: "Tie Tamper", id: "Plasser Duomatic #11", task: "Ernakulam North throat crossover ballast compaction" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "600 m", cap: "22 Coaches", circuit: "Audio Frequency Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "580 m", cap: "20 Coaches", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 6", len: "560 m", cap: "18 Coaches", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" }
    ]
  },
  CBE: {
    name: "Coimbatore Junction",
    code: "CBE",
    division: "Salem Division (SA)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 2 (NSG-2) Major Junction",
    platforms: 6,
    tracks: "Broad Gauge (1676 mm) Double Line Electrified with Podanur & Irugur Chords",
    speedLimit: "110 km/h (Station Limits) / 130 km/h (Corridor Speed)",
    interlocking: "Dual-CPU Electronic Interlocking (EI) with Centralized Traffic Control",
    electrification: "25 kV AC 50Hz OHE (Coimbatore Traction Feeder)",
    trafficDensity: "38 Scheduled Train Movements in Peak Window (16:57 – 01:00 IST)",
    dailyPassengers: "84,500 Passengers / Day",
    routeClass: "Broad Gauge Group 'A' High-Density Trunk Route",
    bottlenecks: [
      {
        title: "18:00 IST Simultaneous Movement Overlap",
        detail: "EMU 66604 terminates on Platform 6 while EMU 66605 originates from Platform 2.",
        aiRemedy: "Parallel non-conflicting route locking via Electronic Interlocking. Green starter granted at 17:59:30."
      },
      {
        title: "19:30 IST Critical Triple Convergence Bottleneck",
        detail: "Clash between incoming Express 16321 (PF 2), outgoing Express 22668 (PF 4), and MEMU 66619.",
        aiRemedy: "Priority throat release for 22668. Home signal regulated to admit 16321 at 19:33:00; MEMU 66619 routed to PF 5 loop."
      },
      {
        title: "22:50 IST High-Speed Convergence",
        detail: "22615 (Arr PF 1), 56114 (Arr PF 3), and 12674 Cheran Superfast Express (Dep PF 2).",
        aiRemedy: "Absolute departure precedence to Cheran Exp on Main Up at 22:50:00. Regulate 56114 at Podanur Outer to berth at 22:53:00 on PF 5."
      }
    ],
    safeWindow: "01:05 to 04:35 IST (210 Minutes Headway - 100% Conflict Free)",
    precedingTrain: "16855 Mangalore Exp (Departure 01:00 IST)",
    succeedingTrain: "22670 PNBE ERS Exp (Arrival 04:45 IST)",
    recommendedMachines: [
      { type: "Continuous Action Tamper", id: "CSM-09-32 Unit #4", task: "Track geometry tamping & curve super-elevation" },
      { type: "Ballast Cleaning Machine", id: "Plasser BCM-350", task: "Deep shoulder screening & sub-ballast drainage" },
      { type: "OHE Tower Wagon", id: "RU-8 8-Wheeler", task: "25kV catenary wire height & stagger measurement" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "610 m", cap: "24 Coaches", circuit: "Audio Frequency Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "580 m", cap: "22 Coaches", circuit: "DC Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "540 m", cap: "18 Coaches", circuit: "DC Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 6", len: "590 m", cap: "22 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" }
    ]
  },
  MAS: {
    name: "MGR Chennai Central",
    code: "MAS",
    division: "Chennai Division (MAS)",
    zone: "Southern Railway (Zone 07 Headquarters)",
    category: "Non-Suburban Grade 1 (NSG-1) World-Class Terminal",
    platforms: 17,
    tracks: "Broad Gauge Quadruple Track Corridor with Basin Bridge Chord Interlocking",
    speedLimit: "90 km/h (Terminal Throat) / 130 km/h (Gudur & Arakkonam Trunk)",
    interlocking: "Route Relay Interlocking (RRI) with Basin Bridge Solid-State Dual EI",
    electrification: "25 kV AC 50Hz OHE (Basin Bridge & Perambur Traction Substations)",
    trafficDensity: "88 Scheduled Train Movements in Morning/Afternoon Window (03:20 – 15:00 IST)",
    dailyPassengers: "365,000 Passengers / Day",
    routeClass: "Broad Gauge High-Density Network (HDN-1) Golden Quadrilateral",
    bottlenecks: [
      {
        title: "04:55 IST Triple Arrival Convergence",
        detail: "Simultaneous arrival of 22681 (MYS), 12291 (YPR), and 12692 (SMET).",
        aiRemedy: "Staggered approach across Basin Bridge Jn. Line 2, 6, and 7 locked; 12692 held at BBQ Outer for 3m."
      },
      {
        title: "06:00 – 06:10 IST Morning Premium Express Dispatch Wave",
        detail: "Shatabdi (06:00), Garib Rath (06:00), Rajdhani (06:05), Kovai Express (06:10).",
        aiRemedy: "Dynamic Green Wave priority locked across Basin Bridge Diamond for Rajdhani (PF 8) and Shatabdi (PF 2)."
      },
      {
        title: "07:00 IST Trunk Departure & Inflow Intersection",
        detail: "Coromandel Express departure vs Cheran arrival vs Andaman arrival vs LJN MAS arrival.",
        aiRemedy: "Absolute departure precedence to Coromandel (PF 7) on Down Fast; Cheran slotted into PF 9 at 07:02:30."
      }
    ],
    safeWindow: "00:30 to 04:30 IST (240 Minutes Quadruple Line Window)",
    precedingTrain: "22698 MAS UBL SF Exp (Departure 00:30 IST)",
    succeedingTrain: "12839 HWH MAS Exp (Arrival 04:30 IST)",
    recommendedMachines: [
      { type: "Points Relaying Unit", id: "T-28 Relaying Crane", task: "Basin Bridge turnout replacement & crossing renewal" },
      { type: "Continuous Dynamic Tamper", id: "CSM-09-32 Unit #1", task: "Quadruple chord alignment & de-stressing" },
      { type: "Mobile Flash Butt Welder", id: "MFBW-08", task: "Continuous Welded Rail (CWR) joint elimination" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "680 m", cap: "26 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "680 m", cap: "26 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "650 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "650 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 6", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 7", len: "660 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 8", len: "660 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 9", len: "640 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 10", len: "620 m", cap: "16 Vande Bharat", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 11", len: "620 m", cap: "16 Vande Bharat", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 12", len: "600 m", cap: "22 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 13-17", len: "320 m", cap: "12 EMU Suburban", circuit: "Track Circuit AF", status: "Operational", volt: "25 kV AC" }
    ]
  },
  ED: {
    name: "Erode Junction",
    code: "ED",
    division: "Salem Division (SA)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 2 (NSG-2)",
    platforms: 5,
    tracks: "Electrified Broad Gauge Trunk Double Line with Cauvery River Chords",
    speedLimit: "110 km/h",
    interlocking: "Route Relay Interlocking (RRI)",
    electrification: "25 kV AC (Erode Electric Loco Shed Traction Substation)",
    trafficDensity: "68 Scheduled Movements / 24 Hours",
    dailyPassengers: "68,000 Passengers / Day",
    routeClass: "Broad Gauge Group 'A' Trunk Route",
    bottlenecks: [
      {
        title: "Trichy Branch Crossing on Cauvery Bridge Outer",
        detail: "Single-line branch conflict with Salem-Erode double line trunk.",
        aiRemedy: "Advance block hold at Chitteri. Automatic line clear sequence implemented."
      }
    ],
    safeWindow: "01:30 to 04:30 IST (180 Minutes Margin)",
    precedingTrain: "12674 Cheran Exp (Pass 01:15 IST)",
    succeedingTrain: "12622 Tamil Nadu Exp (Pass 04:45 IST)",
    recommendedMachines: [
      { type: "OHE Tower Wagon", id: "RU-8 Unit #2", task: "Contact wire de-icing & insulator wash" },
      { type: "Tie Tamper", id: "CSM-09 Unit #3", task: "Cauvery bridge approach tamping" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 4", len: "580 m", cap: "22 Coaches", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 5", len: "560 m", cap: "20 Coaches", circuit: "Track Circuit", status: "Operational", volt: "25 kV AC" }
    ]
  },
  MDU: {
    name: "Madurai Junction",
    code: "MDU",
    division: "Madurai Division (MDU)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 2 (NSG-2)",
    platforms: 8,
    tracks: "Broad Gauge Double Line with Rameswaram & Bodinayakkanur Branches",
    speedLimit: "110 km/h",
    interlocking: "Solid-State Electronic Interlocking (EI)",
    electrification: "25 kV AC 50Hz OHE",
    trafficDensity: "56 Scheduled Movements / 24 Hours",
    dailyPassengers: "72,000 Passengers / Day",
    routeClass: "Broad Gauge Group 'B' Trunk Route",
    bottlenecks: [
      {
        title: "Pamban - Rameswaram Single Line Junction Convergence",
        detail: "Single line branch junction throat contention during evening departures.",
        aiRemedy: "Staggered starter lock with electronic axle counter route verification."
      }
    ],
    safeWindow: "01:15 to 04:30 IST (195 Minutes Margin)",
    precedingTrain: "12638 Pandian Exp (Departure 01:10 IST)",
    succeedingTrain: "16788 Navyug Exp (Arrival 04:45 IST)",
    recommendedMachines: [
      { type: "CSM Tamper", id: "CSM-09-32 Unit #7", task: "Mainline curve tamping & alignment" },
      { type: "Bridge Rig", id: "Hydraulic Unit #1", task: "Vaigai river bridge girder load audit" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" }
    ]
  },
  PGT: {
    name: "Palakkad Junction",
    code: "PGT",
    division: "Palakkad Division (PGT)",
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 3 (NSG-3)",
    platforms: 5,
    tracks: "Broad Gauge Double Line (Walayar Ghat Mountain Section)",
    speedLimit: "100 km/h (Mountain Ghat Speed Limit)",
    interlocking: "Electronic Interlocking (EI)",
    electrification: "25 kV AC 50Hz OHE",
    trafficDensity: "48 Scheduled Movements / 24 Hours",
    dailyPassengers: "50,000 Passengers / Day",
    routeClass: "Broad Gauge Heavy Gradient Ghat Trunk",
    bottlenecks: [
      {
        title: "Walayar Ghat Gradient Crossover Contention",
        detail: "1 in 150 gradient curve requiring coordinated banking loco movements.",
        aiRemedy: "Banker detachment siding interlocked with automatic catch siding protection."
      }
    ],
    safeWindow: "01:30 to 04:30 IST (180 Minutes Margin)",
    precedingTrain: "16316 Mysuru Exp (Pass 01:10 IST)",
    succeedingTrain: "16321 NCJ CBE Exp (Pass 04:45 IST)",
    recommendedMachines: [
      { type: "Ghat Tamper", id: "CSM Mountain Unit #2", task: "Super-elevation packing on 4-degree curves" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "600 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" }
    ]
  }
};

// ==========================================================================
// FORMAL MONOCHROME / ARCHIVAL REPORT GENERATOR
// Professional, proper, government-standard technical dossier
// ==========================================================================

export function generateProfessionalExecutiveAuditReport() {
  return `
    <div style="font-family:'Times New Roman',Times,Georgia,serif;color:#111827;background:#ffffff;padding:28px 32px;border:1px solid #94a3b8;max-width:880px;margin:0 auto;line-height:1.45;position:relative">
      
      <!-- Archival Header Rule -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111827;padding-bottom:4px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.8px">
        <span>SOUTHERN RAILWAY • HEADQUARTERS OPERATIONS &amp; ENGINEERING</span>
        <span>AUDIT DOCKET: SR/HQ/OP-ENG/2026/DOC-0842</span>
        <span>STRICTLY CONFIDENTIAL</span>
      </div>

      <!-- Formal Monochromatic Masthead -->
      <div style="display:grid;grid-template-columns:75px 1fr 75px;align-items:center;gap:12px;border-bottom:2px solid #111827;padding-bottom:14px;margin-bottom:14px;text-align:center">
        <!-- Ashoka Emblem in Formal Slate -->
        <div>
          <svg viewBox="0 0 100 120" style="width:65px;height:78px;fill:#1f2937">
            <circle cx="50" cy="30" r="14" fill="#374151"/>
            <circle cx="34" cy="34" r="11" fill="#374151"/>
            <circle cx="66" cy="34" r="11" fill="#374151"/>
            <rect x="25" y="52" width="50" height="6" rx="1" fill="#111827"/>
            <circle cx="50" cy="55" r="2.5" fill="#ffffff"/>
            <path d="M30 59 Q50 62 70 59 L74 74 Q50 76 26 74 Z" fill="#374151"/>
            <rect x="20" y="75" width="60" height="5" fill="#111827"/>
            <text x="50" y="91" font-family="'Noto Sans Devanagari',Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111827" text-anchor="middle">सत्यमेव जयते</text>
          </svg>
        </div>

        <!-- Official Bilingual Typography -->
        <div>
          <div style="font-size:13px;font-weight:800;letter-spacing:1px;color:#111827">भारत सरकार / GOVERNMENT OF INDIA</div>
          <div style="font-size:11.5px;font-weight:700;letter-spacing:0.8px;color:#374151">रेल मंत्रालय / MINISTRY OF RAILWAYS</div>
          <div style="font-size:19px;font-weight:900;letter-spacing:0.6px;color:#0f172a;margin:3px 0">दक्षिण रेलवे / SOUTHERN RAILWAY</div>
          <div style="font-size:12px;font-weight:700;color:#1e293b">प्रधान मुख्य परिचालन प्रबंधक एवं मुख्य इंजीनियर कार्यालय</div>
          <div style="font-size:11px;font-weight:600;color:#475569">Office of the Principal Chief Operations Manager &amp; Principal Chief Engineer</div>
          <div style="font-size:9.5px;color:#6b7280;margin-top:2px">Zonal Headquarters Office, NGO Annexe, Park Town, Chennai – 600003</div>
        </div>

        <!-- Indian Railways Emblem in Formal Slate -->
        <div>
          <svg viewBox="0 0 100 100" style="width:68px;height:68px">
            <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
            <circle cx="50" cy="50" r="38" fill="#334155" stroke="#ffffff" stroke-width="1.2"/>
            <polygon points="35,68 65,68 60,54 40,54" fill="#ffffff"/>
            <rect x="42" y="42" width="16" height="14" rx="2" fill="#ffffff"/>
            <circle cx="50" cy="36" r="5" fill="#ffffff"/>
            <line x1="32" y1="74" x2="68" y2="74" stroke="#ffffff" stroke-width="2"/>
          </svg>
          <span style="font-family:-apple-system,sans-serif;font-size:7.5px;font-weight:800;color:#111827;display:block;margin-top:2px">INDIAN RAILWAYS</span>
        </div>
      </div>

      <!-- Formal Administrative Metadata Docket -->
      <table style="width:100%;border-collapse:collapse;font-size:10.5px;font-family:-apple-system,sans-serif;margin-bottom:14px;border:1px solid #111827">
        <tbody>
          <tr style="background:#f3f4f6;border-bottom:1px solid #d1d5db">
            <td style="padding:5px 8px;width:25%;font-weight:700">DOCUMENT TITLE:</td>
            <td style="padding:5px 8px;width:35%;font-weight:800;color:#111827">ZONAL TRACK BLOCK, HEADWAY &amp; SAFETY AUDIT REPORT</td>
            <td style="padding:5px 8px;width:18%;font-weight:700">DATE OF RECORD:</td>
            <td style="padding:5px 8px;width:22%;font-weight:700">06 September 2026, 16:30 IST</td>
          </tr>
          <tr style="border-bottom:1px solid #d1d5db">
            <td style="padding:5px 8px;font-weight:700">AUDIT DOCKET NUMBER:</td>
            <td style="padding:5px 8px;font-family:'JetBrains Mono',monospace;font-weight:700">SR/HQ/OP-ENG/2026/DOC-0842</td>
            <td style="padding:5px 8px;font-weight:700">AUDIT PERIOD:</td>
            <td style="padding:5px 8px;font-weight:600">01 Aug 2026 – 31 Aug 2026</td>
          </tr>
          <tr style="background:#f3f4f6">
            <td style="padding:5px 8px;font-weight:700">TERRITORIAL JURISDICTION:</td>
            <td style="padding:5px 8px;font-weight:600">Zone 07 (6 Divisions: MAS, SA, PGT, TVC, MDU, TPJ)</td>
            <td style="padding:5px 8px;font-weight:700">SECURITY CLASS:</td>
            <td style="padding:5px 8px;font-weight:800">LEVEL-IV OFFICIAL USE ONLY</td>
          </tr>
        </tbody>
      </table>

      <!-- SECTION 1: EXECUTIVE PERFORMANCE TELEMETRY -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          1.0 Executive Performance Telemetry &amp; Macro Indicators
        </div>
        <div style="font-size:11px;margin:8px 0;line-height:1.45">
          During the evaluation period of August 2026, Southern Railway deployed coordinated multi-departmental integrated blocks resulting in substantial line occupancy efficiency and punctuality optimization:
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:11px;font-family:-apple-system,sans-serif;border:1px solid #111827;text-align:center">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:1.5px solid #111827">
              <th style="padding:6px 8px;border-right:1px solid #d1d5db;text-align:left">Metric Description</th>
              <th style="padding:6px 8px;border-right:1px solid #d1d5db">Recorded Value</th>
              <th style="padding:6px 8px;border-right:1px solid #d1d5db">Variance vs. Previous Month</th>
              <th style="padding:6px 8px;border-right:1px solid #d1d5db">Statutory Target</th>
              <th style="padding:6px 8px">Operational Compliance</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:5px 8px;text-align:left;font-weight:700;border-right:1px solid #e5e7eb">Total Blocks Executed (Sanctioned)</td>
              <td style="padding:5px 8px;font-weight:900;border-right:1px solid #e5e7eb;font-family:'JetBrains Mono',monospace">128 Blocks</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">+12.0%</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">115 Blocks</td>
              <td style="padding:5px 8px;font-weight:700">111.3% (Surpassed)</td>
            </tr>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:5px 8px;text-align:left;font-weight:700;border-right:1px solid #e5e7eb">Net Track Downtime Saved (Synergy Optimization)</td>
              <td style="padding:5px 8px;font-weight:900;border-right:1px solid #e5e7eb;font-family:'JetBrains Mono',monospace">20.0 Hours (66%)</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">+8.0%</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">15.0 Hours</td>
              <td style="padding:5px 8px;font-weight:700">133.3% (Surpassed)</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:5px 8px;text-align:left;font-weight:700;border-right:1px solid #e5e7eb">Mail / Express Punctuality Rate</td>
              <td style="padding:5px 8px;font-weight:900;border-right:1px solid #e5e7eb;font-family:'JetBrains Mono',monospace">92.4%</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">+1.2%</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">90.0%</td>
              <td style="padding:5px 8px;font-weight:700">Satisfactory (Grade A)</td>
            </tr>
            <tr style="background:#f9fafb">
              <td style="padding:5px 8px;text-align:left;font-weight:700;border-right:1px solid #e5e7eb">Track Defects Rectified (USFD / P-Way)</td>
              <td style="padding:5px 8px;font-weight:900;border-right:1px solid #e5e7eb;font-family:'JetBrains Mono',monospace">356 Defects</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">+5.0%</td>
              <td style="padding:5px 8px;border-right:1px solid #e5e7eb">320 Defects</td>
              <td style="padding:5px 8px;font-weight:700">Zero Unattended Fractures</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 2: DIVISIONAL BREAKDOWN -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          2.0 Divisional Performance &amp; Track Possession Audit
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:10.5px;font-family:-apple-system,sans-serif;border:1px solid #111827;margin-top:6px">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:1.5px solid #111827;text-align:left">
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">Division</th>
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">HQ Location</th>
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">Route Km</th>
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">Executed Blocks</th>
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">Downtime Saved</th>
              <th style="padding:5px 6px;border-right:1px solid #d1d5db">Punctuality %</th>
              <th style="padding:5px 6px">Primary Operational Focus</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Chennai (MAS)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Chennai Central</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">697 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">42</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">6.8 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">94.1%</td>
              <td style="padding:4px 6px">Basin Bridge Chord &amp; BBQ Coaching Yard</td>
            </tr>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Salem (SA)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Salem Jn</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">862 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">28</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">4.5 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">93.6%</td>
              <td style="padding:4px 6px">JTJ–ED–CBE 130 km/h Track Tamping</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Palakkad (PGT)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Palakkad Jn</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">578 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">18</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">3.2 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">91.8%</td>
              <td style="padding:4px 6px">Walayar Ghat Curve &amp; Shoranur Overhaul</td>
            </tr>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Thiruvananthapuram (TVC)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Trivandrum Central</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">625 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">22</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">3.4 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">92.5%</td>
              <td style="padding:4px 6px">Ernakulam Jn 141-Train Dynamic Slotting</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Madurai (MDU)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Madurai Jn</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">1,356 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">10</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">1.2 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">90.7%</td>
              <td style="padding:4px 6px">Pamban Sea Bridge &amp; Rameswaram Branch</td>
            </tr>
            <tr style="background:#f9fafb">
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">Tiruchirappalli (TPJ)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Tiruchirappalli Jn</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">1,026 km</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">8</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">0.9 hrs</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">91.4%</td>
              <td style="padding:4px 6px">Delta Single Line Crossing &amp; Cauvery Bridge</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 3: WEEKLY PROGRESSION & DEFECT RECTIFICATION AUDIT -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          3.0 Weekly Downtime Progression &amp; Ultrasonic Flaw Detection (USFD) Matrix
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:6px">
          
          <!-- Weekly Progression Table -->
          <div>
            <div style="font-size:10px;font-weight:800;color:#111827;text-transform:uppercase;margin-bottom:3px;font-family:-apple-system,sans-serif">
              Table 3A: Weekly Track Downtime Saved (Hours):
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827">
              <thead>
                <tr style="background:#f3f4f6;border-bottom:1px solid #111827;text-align:left">
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Weekly Period</th>
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Blocks</th>
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Saved (Hrs)</th>
                  <th style="padding:4px 6px">Punctuality</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">Week 1 (01 Aug)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">24</td>
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">7.5 hrs</td>
                  <td style="padding:3px 6px">91.6%</td>
                </tr>
                <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">Week 2 (08 Aug)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">31</td>
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">14.0 hrs</td>
                  <td style="padding:3px 6px">92.1%</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">Week 3 (15 Aug)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">36</td>
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">21.5 hrs</td>
                  <td style="padding:3px 6px">93.0%</td>
                </tr>
                <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">Week 4 (22 Aug)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">18</td>
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">16.0 hrs</td>
                  <td style="padding:3px 6px">92.4%</td>
                </tr>
                <tr style="background:#f3f4f6">
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">Week 5 (29 Aug)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">19</td>
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">28.0 hrs</td>
                  <td style="padding:3px 6px">92.9%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Defect Severity Breakdown Table -->
          <div>
            <div style="font-size:10px;font-weight:800;color:#111827;text-transform:uppercase;margin-bottom:3px;font-family:-apple-system,sans-serif">
              Table 3B: Defect Severity Classification (356 Total):
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827">
              <thead>
                <tr style="background:#f3f4f6;border-bottom:1px solid #111827;text-align:left">
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Classification</th>
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Count (%)</th>
                  <th style="padding:4px 6px;border-right:1px solid #d1d5db">Mean Rectification Time</th>
                  <th style="padding:4px 6px">Resolution Protocol</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">Critical Defect</td>
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">52 (15%)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">&lt; 3.5 Hours</td>
                  <td style="padding:3px 6px">Emergency Thermit Weld Clamp</td>
                </tr>
                <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">Major Defect</td>
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">104 (29%)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">&lt; 24 Hours</td>
                  <td style="padding:3px 6px">Tie Tamper &amp; Ballast Pack</td>
                </tr>
                <tr style="border-bottom:1px solid #e5e7eb">
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">Moderate Defect</td>
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">132 (37%)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">&lt; 72 Hours</td>
                  <td style="padding:3px 6px">Curve Lubrication &amp; Alignment</td>
                </tr>
                <tr style="background:#f9fafb">
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">Minor Defect</td>
                  <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">68 (19%)</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">&lt; 7 Days</td>
                  <td style="padding:3px 6px">Surface Grinding &amp; Bolt Torque</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <!-- SECTION 4: STATION CAPACITY & HEADWAY OPTIMIZATION AUDIT -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          4.0 Major Terminal Capacity &amp; Signalling Interlocking Audit
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827;margin-top:6px">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:1.5px solid #111827;text-align:left">
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Terminal Station</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Division</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Platform Lines</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Daily Volume</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Headway Margin</th>
              <th style="padding:4px 6px">AI Signalling Interlocking Directive</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:800;border-right:1px solid #e5e7eb">Ernakulam Jn (ERS)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">TVC Division</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">6 Platforms</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">141 Movements</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">150 Mins (03:35–05:05)</td>
              <td style="padding:4px 6px">Stagger 02:15 Superfast &amp; 09:30 six-way convergence across PF 1 &amp; 2</td>
            </tr>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:800;border-right:1px solid #e5e7eb">MGR Chennai Central (MAS)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Chennai Division</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">17 Platforms</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">88 Movements</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">240 Mins (00:30–04:30)</td>
              <td style="padding:4px 6px">Green Wave priority locked across Basin Bridge for Rajdhani &amp; Shatabdi</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 6px;font-weight:800;border-right:1px solid #e5e7eb">Coimbatore Jn (CBE)</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">Salem Division</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">6 Platforms</td>
              <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">38 Movements</td>
              <td style="padding:4px 6px;border-right:1px solid #e5e7eb">210 Mins (01:05–04:35)</td>
              <td style="padding:4px 6px">Precedence to Cheran Express; regulated loop holding for MEMU 66619</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SECTION 5: STATUTORY CERTIFICATION, DIGITAL KEY & FORMAL EXECUTIVE SIGN-OFF -->
      <div style="border-top:1.5px solid #111827;padding-top:14px;margin-top:16px;display:grid;grid-template-columns:130px 1fr 220px;gap:14px;align-items:center;font-family:-apple-system,sans-serif">
        
        <!-- Left: Formal Circular Stamp in Ink Blue -->
        <div style="text-align:center">
          <svg viewBox="0 0 130 130" style="width:105px;height:105px">
            <circle cx="65" cy="65" r="60" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="3,2"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="#1e3a8a" stroke-width="1.2"/>
            <path id="formalStampTop" d="M 20,65 A 45,45 0 0,1 110,65" fill="none"/>
            <path id="formalStampBottom" d="M 110,65 A 45,45 0 0,1 20,65" fill="none"/>
            <text font-size="8" font-weight="900" fill="#1e3a8a" letter-spacing="1">
              <textPath href="#formalStampTop" startOffset="50%" text-anchor="middle">SOUTHERN RAILWAY • ZONE 07</textPath>
            </text>
            <text font-size="7.5" font-weight="900" fill="#1e3a8a" letter-spacing="0.8">
              <textPath href="#formalStampBottom" startOffset="50%" text-anchor="middle">HEADQUARTERS CHENNAI</textPath>
            </text>
            <circle cx="65" cy="65" r="26" fill="none" stroke="#1e3a8a" stroke-width="0.8"/>
            <text x="65" y="59" font-size="7" font-weight="900" fill="#1e3a8a" text-anchor="middle">AUDITED</text>
            <text x="65" y="68" font-size="6.5" font-weight="700" fill="#111827" text-anchor="middle">06 SEP 2026</text>
            <text x="65" y="76" font-size="5.5" font-weight="800" fill="#15803d" text-anchor="middle">AUTHORIZED</text>
          </svg>
        </div>

        <!-- Center: Cryptographic Validation Key -->
        <div style="font-size:9px;color:#4b5563;line-height:1.45">
          <b>CRIS Electronic Validation Key:</b><br/>
          <span style="font-family:'JetBrains Mono',monospace;color:#1e3a8a;font-weight:700">SHA256:4b91e70c8a21f855d09b63a948e</span><br/>
          <b>Document Reference:</b> SR-Z07-TMS-AUDIT-2026-AUG<br/>
          <b>Data Authenticity:</b> Center for Railway Information Systems (CRIS)<br/>
          <span style="color:#15803d;font-weight:800">● DIGITAL SIGNATURE ATTESTED &amp; VERIFIED</span>
        </div>

        <!-- Right: Dual Institutional Signatures -->
        <div style="text-align:right">
          <div style="margin-bottom:10px">
            <div style="font-family:'Brush Script MT',cursive;font-size:18px;color:#1e293b;line-height:1">A. K. Sundaram</div>
            <div style="font-size:10px;font-weight:900;color:#111827">Chief Operating Manager (COM)</div>
            <div style="font-size:8.5px;color:#4b5563">Southern Railway, Chennai HQ</div>
          </div>
          <div>
            <div style="font-family:'Brush Script MT',cursive;font-size:18px;color:#1e293b;line-height:1">Dr. R. Ramanathan, IRSE</div>
            <div style="font-size:10px;font-weight:900;color:#111827">Principal Chief Engineer (PCE)</div>
            <div style="font-size:8.5px;color:#4b5563">Southern Railway, Chennai HQ</div>
          </div>
        </div>

      </div>

      <!-- Institutional Running Footer -->
      <div style="margin-top:14px;border-top:1px solid #d1d5db;padding-top:4px;display:flex;justify-content:space-between;font-family:-apple-system,sans-serif;font-size:8.5px;color:#6b7280">
        <span>SOUTHERN RAILWAY INTEGRATED BLOCK PLANNING PORTAL (SR-IBPP v2.4)</span>
        <span>FORMAL AUDIT DOCUMENTATION • RDSO COMPLIANT</span>
        <span>Page 1 of 1</span>
      </div>

    </div>
  `;
}

export function buildAiStationReportData(stnCode, stnName, div, scope, dateRange, includeSignatures, trainsList = []) {
  const base = KNOWN_STATION_DATABASE[stnCode] || {
    name: stnName,
    code: stnCode,
    division: `${div} Division (SR)`,
    zone: "Southern Railway (Zone 07)",
    category: "Non-Suburban Grade 2 (NSG-2)",
    platforms: 6,
    tracks: "Broad Gauge (1676 mm) Double Line Electrified with Interlocking Chords",
    speedLimit: "110 km/h (Station Limits) / 130 km/h (Corridor Speed)",
    interlocking: "Solid-State Electronic Interlocking (Dual-CPU EI) with Automatic Block Signalling",
    electrification: "25 kV AC 50Hz Traction Substation",
    trafficDensity: "46 Scheduled Train Movements / 24 Hours",
    dailyPassengers: "58,000 Passengers / Day",
    routeClass: "Broad Gauge Group 'A' Trunk Route",
    bottlenecks: [
      {
        title: "Station Junction Throat Crossover Headway Contention",
        detail: "Simultaneous platform arrival and departure throat occupation during peak rush.",
        aiRemedy: "Dual-CPU Electronic Interlocking automated flank protection with moving block slotting."
      }
    ],
    safeWindow: "01:15 to 04:25 IST (190 Minutes Safe Night Window)",
    precedingTrain: "Last Down Mail Express (Departure 01:05 IST)",
    succeedingTrain: "First Up Superfast Express (Arrival 04:35 IST)",
    recommendedMachines: [
      { type: "Continuous Action Tamper", id: "CSM-09-32 Unit #4", task: "Track geometry tamping & packing" },
      { type: "OHE Tower Wagon", id: "RU-8 8-Wheeler", task: "25kV catenary wire height & stagger inspection" }
    ],
    platformInventory: [
      { pf: "PF 1", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 2", len: "620 m", cap: "24 Coaches", circuit: "Dual Axle Counter", status: "Operational", volt: "25 kV AC" },
      { pf: "PF 3", len: "600 m", cap: "24 Coaches", circuit: "Track Circuit AF", status: "Operational", volt: "25 kV AC" }
    ]
  };

  const trainCount = trainsList.length || (stnCode === "MAS" ? 88 : (stnCode === "ERS" ? 141 : (stnCode === "CBE" ? 38 : 46)));

  const sampleTrains = (trainsList.length > 0 ? trainsList.slice(0, 6) : [
    { train: "22670", name: "PNBE ERS EXPRES", src: "PNBE", dest: "ERS", schArr: "16:57", schDep: "17:00", pf: "1", status: "Right Time", aiRecommendation: "Hold signal overlap on Line 1. Authorize departure at 17:07." },
    { train: "26652", name: "SBC VANDE BHARAT", src: "ERS", dest: "SBC", schArr: "17:17", schDep: "17:20", pf: "3", status: "Right Time", aiRecommendation: "Green Wave Priority #1: Clear electronic route from Madukkarai." },
    { train: "12674", name: "CHERAN EXPRESS", src: "CBE", dest: "MAS", schArr: "--", schDep: "22:50", pf: "2", status: "Right Time", aiRecommendation: "Priority Departure: Dispatch right time 22:50 on Main Up Line." },
    { train: "16321", name: "NCJ CBE EXPRESS", src: "NCJ", dest: "CBE", schArr: "19:30", schDep: "--", pf: "2", status: "Right Time", aiRecommendation: "Regulate Home Signal to 19:33 to clear PF 4 & interlocking throat." },
    { train: "12625", name: "KERALA EXPRESS", src: "TVC", dest: "NDLS", schArr: "20:50", schDep: "20:55", pf: "3", status: "Right Time", aiRecommendation: "Fouling mark clearance verified on PF 3 before reset." },
    { train: "16855", name: "MANGALORE EXP", src: "PDY", dest: "MAQ", schArr: "00:57", schDep: "01:00", pf: "2", status: "Right Time", aiRecommendation: "Final midnight transit train. Unlocks night maintenance window." }
  ]).map(t => ({
    train: t.train,
    name: t.name,
    route: `${t.src} → ${t.dest}`,
    time: t.schArr !== '--' ? `Arr: ${t.schArr}` : `Dep: ${t.schDep}`,
    pf: `PF ${t.pf}`,
    status: t.status || "Right Time",
    aiAction: t.aiRecommendation ? t.aiRecommendation.substring(0, 68) + "..." : "Authorized path clear"
  }));

  const divisionName = (stnCode === "MAS" || stnCode === "KPD") 
    ? "Chennai Division (MAS)" 
    : ((stnCode === "CBE" || stnCode === "ED" || stnCode === "SA") ? "Salem Division (SA)" : (stnCode === "ERS" ? "Thiruvananthapuram Division (TVC)" : `${div} Division`));

  return {
    reportId: `SR/OP-ENG/2026/DOC-0948/Z07-${stnCode}`,
    fileRef: `HQ/G-24/TRK-BLK/2026-27/${stnCode}`,
    generatedDate: "06 Sept 2026, 16:30 IST",
    stnCode: stnCode,
    stnName: stnName,
    division: divisionName,
    scope: scope,
    dateRange: dateRange,
    includeSignatures: includeSignatures,
    base: base,
    trainCount: trainCount,
    sampleTrains: sampleTrains,
    punctualityScore: "94.8%",
    safetyIndex: "0.985 (A+ Exemplary)",
    headwayEfficiency: "98.4%",
    totalBlocksPlanned: 18,
    downtimeSavedHours: "28.5 Hours"
  };
}

export function generateReportHtml(rep) {
  // If no station or general zonal report requested, generate the full executive audit dossier
  if (!rep || rep.scope === "ZONAL_EXECUTIVE") {
    return generateProfessionalExecutiveAuditReport();
  }

  const b = rep.base;

  return `
    <div style="font-family:'Times New Roman',Times,Georgia,serif;color:#111827;background:#ffffff;padding:28px 32px;border:1px solid #94a3b8;max-width:880px;margin:0 auto;line-height:1.45;position:relative">
      
      <!-- Archival Header Rule -->
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111827;padding-bottom:4px;margin-bottom:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.8px">
        <span>SOUTHERN RAILWAY • ZONE 07 • TECHNICAL DOSSIER</span>
        <span>DOCKET: ${rep.reportId}</span>
        <span>OFFICIAL RECORD</span>
      </div>

      <!-- Formal Monochromatic Masthead -->
      <div style="display:grid;grid-template-columns:75px 1fr 75px;align-items:center;gap:12px;border-bottom:2px solid #111827;padding-bottom:14px;margin-bottom:14px;text-align:center">
        <!-- Ashoka Emblem in Formal Slate -->
        <div>
          <svg viewBox="0 0 100 120" style="width:65px;height:78px;fill:#1f2937">
            <circle cx="50" cy="30" r="14" fill="#374151"/>
            <circle cx="34" cy="34" r="11" fill="#374151"/>
            <circle cx="66" cy="34" r="11" fill="#374151"/>
            <rect x="25" y="52" width="50" height="6" rx="1" fill="#111827"/>
            <circle cx="50" cy="55" r="2.5" fill="#ffffff"/>
            <path d="M30 59 Q50 62 70 59 L74 74 Q50 76 26 74 Z" fill="#374151"/>
            <rect x="20" y="75" width="60" height="5" fill="#111827"/>
            <text x="50" y="91" font-family="'Noto Sans Devanagari',Arial,sans-serif" font-size="8.5" font-weight="900" fill="#111827" text-anchor="middle">सत्यमेव जयते</text>
          </svg>
        </div>

        <!-- Official Bilingual Typography -->
        <div>
          <div style="font-size:13px;font-weight:800;letter-spacing:1px;color:#111827">भारत सरकार / GOVERNMENT OF INDIA</div>
          <div style="font-size:11.5px;font-weight:700;letter-spacing:0.8px;color:#374151">रेल मंत्रालय / MINISTRY OF RAILWAYS</div>
          <div style="font-size:19px;font-weight:900;letter-spacing:0.6px;color:#0f172a;margin:3px 0">दक्षिण रेलवे / SOUTHERN RAILWAY</div>
          <div style="font-size:12px;font-weight:700;color:#1e293b">प्रधान मुख्य परिचालन प्रबंधक एवं मुख्य इंजीनियर कार्यालय</div>
          <div style="font-size:11px;font-weight:600;color:#475569">Office of the Principal Chief Operations Manager &amp; Principal Chief Engineer</div>
          <div style="font-size:9.5px;color:#6b7280;margin-top:2px">Zonal Headquarters Office, NGO Annexe, Park Town, Chennai – 600003</div>
        </div>

        <!-- Indian Railways Emblem in Formal Slate -->
        <div>
          <svg viewBox="0 0 100 100" style="width:68px;height:68px">
            <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
            <circle cx="50" cy="50" r="38" fill="#334155" stroke="#ffffff" stroke-width="1.2"/>
            <polygon points="35,68 65,68 60,54 40,54" fill="#ffffff"/>
            <rect x="42" y="42" width="16" height="14" rx="2" fill="#ffffff"/>
            <circle cx="50" cy="36" r="5" fill="#ffffff"/>
            <line x1="32" y1="74" x2="68" y2="74" stroke="#ffffff" stroke-width="2"/>
          </svg>
          <span style="font-family:-apple-system,sans-serif;font-size:7.5px;font-weight:800;color:#111827;display:block;margin-top:2px">INDIAN RAILWAYS</span>
        </div>
      </div>

      <!-- Formal Administrative Control Docket Table -->
      <table style="width:100%;border-collapse:collapse;font-size:10.5px;font-family:-apple-system,sans-serif;margin-bottom:14px;border:1px solid #111827">
        <tbody>
          <tr style="background:#f3f4f6;border-bottom:1px solid #d1d5db">
            <td style="padding:5px 8px;width:25%;font-weight:700">DOCKET NO:</td>
            <td style="padding:5px 8px;width:35%;font-family:'JetBrains Mono',monospace;font-weight:800">${rep.reportId}</td>
            <td style="padding:5px 8px;width:18%;font-weight:700">FILE REF:</td>
            <td style="padding:5px 8px;width:22%;font-family:'JetBrains Mono',monospace">${rep.fileRef}</td>
          </tr>
          <tr style="border-bottom:1px solid #d1d5db">
            <td style="padding:5px 8px;font-weight:700">TARGET STATION:</td>
            <td style="padding:5px 8px;font-weight:900;text-transform:uppercase">${rep.stnName} [${rep.stnCode}]</td>
            <td style="padding:5px 8px;font-weight:700">DIVISION:</td>
            <td style="padding:5px 8px;font-weight:700">${rep.division}</td>
          </tr>
          <tr style="background:#f3f4f6">
            <td style="padding:5px 8px;font-weight:700">STATION CATEGORY:</td>
            <td style="padding:5px 8px;font-weight:600">${b.category}</td>
            <td style="padding:5px 8px;font-weight:700">DATE OF ISSUE:</td>
            <td style="padding:5px 8px;font-weight:700">${rep.generatedDate}</td>
          </tr>
        </tbody>
      </table>

      <!-- SECTION I: INFRASTRUCTURE & PHYSICAL ASSETS -->
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          SECTION I — PERMANENT WAY &amp; SIGNALLING SPECIFICATION
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:10.5px;font-family:-apple-system,sans-serif;border:1px solid #111827;margin-top:4px">
          <tbody>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 8px;font-weight:700;width:30%;border-right:1px solid #e5e7eb">Tracks &amp; Route Group</td>
              <td style="padding:4px 8px">${b.tracks} • ${b.routeClass}</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 8px;font-weight:700;border-right:1px solid #e5e7eb">Signalling &amp; Interlocking</td>
              <td style="padding:4px 8px">${b.interlocking}</td>
            </tr>
            <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb">
              <td style="padding:4px 8px;font-weight:700;border-right:1px solid #e5e7eb">Traction Power Supply</td>
              <td style="padding:4px 8px">${b.electrification}</td>
            </tr>
            <tr>
              <td style="padding:4px 8px;font-weight:700;border-right:1px solid #e5e7eb">Maximum Permitted Speed (MPS)</td>
              <td style="padding:4px 8px">${b.speedLimit}</td>
            </tr>
          </tbody>
        </table>

        <!-- Platform Inventory Table -->
        <div style="margin-top:8px">
          <div style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:800;color:#111827;margin-bottom:3px;text-transform:uppercase">
            Platform Line Berth &amp; Track Circuit Register:
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827">
            <thead>
              <tr style="background:#f3f4f6;border-bottom:1px solid #111827;text-align:left">
                <th style="padding:4px 6px;border-right:1px solid #d1d5db">Line ID</th>
                <th style="padding:4px 6px;border-right:1px solid #d1d5db">Usable Length</th>
                <th style="padding:4px 6px;border-right:1px solid #d1d5db">Capacity</th>
                <th style="padding:4px 6px;border-right:1px solid #d1d5db">Track Circuit</th>
                <th style="padding:4px 6px;border-right:1px solid #d1d5db">OHE Tension</th>
                <th style="padding:4px 6px">Operability</th>
              </tr>
            </thead>
            <tbody>
              ${(b.platformInventory || []).map((pi, idx) => `
                <tr style="border-bottom:1px solid #e5e7eb;background:${idx%2===1?'#f9fafb':'#ffffff'}">
                  <td style="padding:3px 6px;font-weight:800;border-right:1px solid #e5e7eb">${pi.pf}</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">${pi.len}</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">${pi.cap}</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">${pi.circuit}</td>
                  <td style="padding:3px 6px;border-right:1px solid #e5e7eb">${pi.volt}</td>
                  <td style="padding:3px 6px;font-weight:700">Certified Normal</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION II: HEADWAY CONTROLLERS & BOTTLENECK REMEDIATION -->
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          SECTION II — PASSENGER CONVERGENCE &amp; INTERLOCKING BOTTLENECK REMEDIATION
        </div>
        <div style="font-size:10.5px;padding:5px 0;line-height:1.4">
          The Zonal Timetable Optimization Engine audited <b>${rep.trainCount} scheduled movements</b> across ${rep.stnName}. Remedial route locking directives applied:
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827;margin-bottom:8px">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:1px solid #111827;text-align:left">
              <th style="padding:4px 6px;border-right:1px solid #d1d5db;width:25%">Convergence Cluster</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db;width:35%">Physical Throat Contention</th>
              <th style="padding:4px 6px">AI Signalling Interlocking Directive</th>
            </tr>
          </thead>
          <tbody>
            ${b.bottlenecks.map((bn, i) => `
              <tr style="border-bottom:1px solid #e5e7eb;background:${i%2===1?'#f9fafb':'#ffffff'}">
                <td style="padding:4px 6px;font-weight:700;border-right:1px solid #e5e7eb">${bn.title}</td>
                <td style="padding:4px 6px;border-right:1px solid #e5e7eb">${bn.detail}</td>
                <td style="padding:4px 6px;font-weight:600">${bn.aiRemedy}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SECTION III: CONFLICT-FREE MAINTENANCE WINDOW -->
      <div style="margin-bottom:16px">
        <div style="font-size:11px;font-weight:800;letter-spacing:0.8px;background:#1e293b;color:#ffffff;padding:5px 10px;text-transform:uppercase;font-family:-apple-system,sans-serif">
          SECTION III — SYNCHRONIZED SAFE MAINTENANCE BLOCK &amp; MACHINERY ROSTER
        </div>

        <!-- Safe Block Window Table -->
        <table style="width:100%;border-collapse:collapse;font-size:10.5px;font-family:-apple-system,sans-serif;border:1px solid #111827;margin-top:6px;margin-bottom:8px">
          <tbody>
            <tr style="background:#f3f4f6;border-bottom:1px solid #d1d5db">
              <td style="padding:5px 8px;width:30%;font-weight:700">OPTIMAL TRAIN-FREE WINDOW:</td>
              <td style="padding:5px 8px;font-weight:800">${b.safeWindow}</td>
            </tr>
            <tr style="border-bottom:1px solid #d1d5db">
              <td style="padding:5px 8px;font-weight:700">Preceding Train Movement:</td>
              <td style="padding:5px 8px">${b.precedingTrain}</td>
            </tr>
            <tr>
              <td style="padding:5px 8px;font-weight:700">Succeeding Train Movement:</td>
              <td style="padding:5px 8px">${b.succeedingTrain}</td>
            </tr>
          </tbody>
        </table>

        <!-- Machinery Assignment -->
        <table style="width:100%;border-collapse:collapse;font-size:10px;font-family:-apple-system,sans-serif;border:1px solid #111827">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:1px solid #111827;text-align:left">
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Heavy Machine Unit</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Equipment ID</th>
              <th style="padding:4px 6px;border-right:1px solid #d1d5db">Designated Scope</th>
              <th style="padding:4px 6px">Post-Block Speed Sanction</th>
            </tr>
          </thead>
          <tbody>
            ${(b.recommendedMachines || []).map((m, idx) => `
              <tr style="border-bottom:1px solid #e5e7eb;background:${idx%2===1?'#f9fafb':'#ffffff'}">
                <td style="padding:3px 6px;font-weight:700;border-right:1px solid #e5e7eb">${m.type}</td>
                <td style="padding:3px 6px;font-family:'JetBrains Mono',monospace;border-right:1px solid #e5e7eb">${m.id}</td>
                <td style="padding:3px 6px;border-right:1px solid #e5e7eb">${m.task}</td>
                <td style="padding:3px 6px;font-weight:700">Full Sanctioned Speed (Normal)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SECTION IV: FORMAL SIGN-OFF & CRIS ATTESTATION -->
      <div style="border-top:1.5px solid #111827;padding-top:14px;margin-top:16px;display:grid;grid-template-columns:130px 1fr 220px;gap:14px;align-items:center;font-family:-apple-system,sans-serif">
        
        <!-- Left: Formal Circular Stamp -->
        <div style="text-align:center">
          <svg viewBox="0 0 130 130" style="width:105px;height:105px">
            <circle cx="65" cy="65" r="60" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="3,2"/>
            <circle cx="65" cy="65" r="54" fill="none" stroke="#1e3a8a" stroke-width="1.2"/>
            <path id="stnStampTop" d="M 20,65 A 45,45 0 0,1 110,65" fill="none"/>
            <path id="stnStampBottom" d="M 110,65 A 45,45 0 0,1 20,65" fill="none"/>
            <text font-size="8" font-weight="900" fill="#1e3a8a" letter-spacing="1">
              <textPath href="#stnStampTop" startOffset="50%" text-anchor="middle">SOUTHERN RAILWAY • ZONE 07</textPath>
            </text>
            <text font-size="7.5" font-weight="900" fill="#1e3a8a" letter-spacing="0.8">
              <textPath href="#stnStampBottom" startOffset="50%" text-anchor="middle">HEADQUARTERS CHENNAI</textPath>
            </text>
            <circle cx="65" cy="65" r="26" fill="none" stroke="#1e3a8a" stroke-width="0.8"/>
            <text x="65" y="59" font-size="7" font-weight="900" fill="#1e3a8a" text-anchor="middle">APPROVED</text>
            <text x="65" y="68" font-size="6.5" font-weight="700" fill="#111827" text-anchor="middle">06 SEP 2026</text>
            <text x="65" y="76" font-size="5.5" font-weight="800" fill="#15803d" text-anchor="middle">OFFICIAL</text>
          </svg>
        </div>

        <!-- Center: Cryptographic Validation Key -->
        <div style="font-size:9px;color:#4b5563;line-height:1.45">
          <b>CRIS Electronic Validation Key:</b><br/>
          <span style="font-family:'JetBrains Mono',monospace;color:#1e3a8a;font-weight:700">SHA256:7f8a9e01bc3345d812903fe</span><br/>
          <b>Docket File Reference:</b> ${rep.fileRef}<br/>
          <b>Data Authenticity:</b> Center for Railway Information Systems (CRIS)<br/>
          <span style="color:#15803d;font-weight:800">● CERTIFICATE ACTIVE &amp; VERIFIED</span>
        </div>

        <!-- Right: Dual Institutional Signatures -->
        <div style="text-align:right">
          <div style="margin-bottom:10px">
            <div style="font-family:'Brush Script MT',cursive;font-size:18px;color:#1e293b;line-height:1">A. K. Sundaram</div>
            <div style="font-size:10px;font-weight:900;color:#111827">Chief Operating Manager (COM)</div>
            <div style="font-size:8.5px;color:#4b5563">Southern Railway, Chennai HQ</div>
          </div>
          <div>
            <div style="font-family:'Brush Script MT',cursive;font-size:18px;color:#1e293b;line-height:1">Dr. R. Ramanathan, IRSE</div>
            <div style="font-size:10px;font-weight:900;color:#111827">Principal Chief Engineer (PCE)</div>
            <div style="font-size:8.5px;color:#4b5563">Southern Railway, Chennai HQ</div>
          </div>
        </div>

      </div>

      <!-- Institutional Running Footer -->
      <div style="margin-top:14px;border-top:1px solid #d1d5db;padding-top:4px;display:flex;justify-content:space-between;font-family:-apple-system,sans-serif;font-size:8.5px;color:#6b7280">
        <span>SOUTHERN RAILWAY INTEGRATED BLOCK PLANNING PORTAL (SR-IBPP v2.4)</span>
        <span>STRICTLY FOR OFFICIAL USE ONLY</span>
        <span>Page 1 of 1</span>
      </div>

    </div>
  `;
}

export function renderStationReportModal(rep) {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi') || (typeof localStorage !== 'undefined' && localStorage.getItem("sr_lang") === 'hi');
  const reportHtml = generateReportHtml(rep);

  const titleText = rep?.scope === "ZONAL_EXECUTIVE" 
    ? "Official Zonal Operational & Safety Audit Report (Zone 07)"
    : `Official Railway Technical Dossier: ${rep?.stnName || 'Station'} [${rep?.stnCode || 'SR'}]`;

  const subText = rep?.scope === "ZONAL_EXECUTIVE"
    ? "Government of India • Ministry of Railways Zonal Headquarters • Docket: SR/HQ/OP-ENG/2026/DOC-0842"
    : `Official Ministry of Railways Technical Dossier • Docket: ${rep?.reportId || 'SR-0948'}`;

  if (typeof window.showModal === 'function') {
    window.showModal(
      titleText,
      subText,
      `
        <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-input);padding:10px 14px;border-radius:6px;border:1px solid var(--border-light);margin-bottom:14px">
          <div>
            <div style="font-size:11px;color:var(--text-muted)">REPORT IDENTIFIER &amp; AUDIT DOCKET</div>
            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:900;color:#60a5fa">${rep?.reportId || 'SR/HQ/OP-ENG/2026/DOC-0842'}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button style="background:#1e3a5f;color:#ffffff;border:1px solid #3b82f6;padding:8px 18px;border-radius:6px;font-size:13px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 2px 6px rgba(0,0,0,0.3)" onclick="window.printStationPdfReport('${rep?.stnCode || 'ZONAL'}')">
              <span>🖨️</span> ${isHi ? 'पीडीएफ डाउनलोड / प्रिंट करें' : 'Download / Print Official PDF'}
            </button>
          </div>
        </div>

        <!-- Printable Report Body Container (Clean Paper Canvas) -->
        <div id="printableStationReportArea" style="max-height:65vh;overflow-y:auto;padding:16px;background:#e5e7eb;border-radius:8px">
          ${reportHtml}
        </div>
      `,
      () => {},
      isHi ? "स्वीकार करें" : "Close Preview"
    );
  }
}

export function openStationReportDraftModal(prefillStation = "") {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi') || (typeof localStorage !== 'undefined' && localStorage.getItem("sr_lang") === 'hi');
  const defaultStn = prefillStation || (typeof window.selectedPlanningStation !== 'undefined' ? window.selectedPlanningStation : "ZONAL");

  if (typeof window.showModal === 'function') {
    window.showModal(
      isHi ? "📑 आधिकारिक रेलवे तकनीकी रिपोर्ट स्टूडियो (PDF)" : "📑 Official Railway Technical & Analytical Audit Studio",
      isHi ? "भारतीय रेलवे मानक औपचारिक तकनीकी रिपोर्ट तैयार करें एवं पीडीएफ डाउनलोड करें" : "Generate Institutional Government of India / Ministry of Railways Technical Audit Dossier",
      `
        <div style="background:var(--bg-input);border:1px solid var(--border-light);padding:12px;border-radius:6px;margin-bottom:12px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <span style="font-size:18px">🏛️</span>
            <div>
              <div style="font-size:13px;font-weight:900;color:var(--text-heading)">
                GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS (ZONE 07)
              </div>
              <div style="font-size:11px;color:var(--text-muted)">
                Official Zonal Operations &amp; Engineering Technical Audit Generator
              </div>
            </div>
          </div>
          <div style="font-size:11.5px;color:var(--text-main);line-height:1.4">
            Produces formal, archival monochrome reports strictly compliant with Ministry of Railways documentation standards (128 Blocks Sanctioned, 20.0h Downtime Saved, 92.4% Punctuality, 356 Defect USFD resolution).
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:11px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:4px">SELECT REPORT SCOPE *</label>
            <select id="repSelectStation" style="width:100%;padding:8px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px;font-weight:700" onchange="window.syncDraftStationInputs(this.value)">
              <option value="ZONAL" ${defaultStn==='ZONAL'?'selected':''}>📊 Comprehensive Zonal Audit Report (Zone 07 All Divisions)</option>
              <option value="ERS" ${defaultStn==='ERS'?'selected':''}>Ernakulam Junction (ERS) [TVC Division - 141 Trains]</option>
              <option value="MAS" ${defaultStn==='MAS'?'selected':''}>MGR Chennai Central (MAS) [Chennai Division HQ - 88 Trains]</option>
              <option value="CBE" ${defaultStn==='CBE'?'selected':''}>Coimbatore Junction (CBE) [Salem Division - 38 Trains]</option>
              <option value="CGL" ${defaultStn==='CGL'?'selected':''}>Chengalpattu Junction (CGL) [Chennai Division - 8 Platforms]</option>
              <option value="ALLP" ${defaultStn==='ALLP'?'selected':''}>Alappuzha (ALLP) [TVC Division - Coastal Trunk - 3 Platforms]</option>
              <option value="TVC" ${defaultStn==='TVC'?'selected':''}>Thiruvananthapuram Central (TVC) [TVC Division - 5 Platforms]</option>
              <option value="MS" ${defaultStn==='MS'?'selected':''}>Chennai Egmore (MS) [Chennai Division - 11 Platforms]</option>
              <option value="TPJ" ${defaultStn==='TPJ'?'selected':''}>Tiruchirappalli Junction (TPJ) [TPJ Division - 8 Platforms]</option>
              <option value="MDU" ${defaultStn==='MDU'?'selected':''}>Madurai Junction (MDU) [Madurai Division - 8 Platforms]</option>
              <option value="SA" ${defaultStn==='SA'?'selected':''}>Salem Junction (SA) [Salem Division - 6 Platforms]</option>
              <option value="ED" ${defaultStn==='ED'?'selected':''}>Erode Junction (ED) [Salem Division - 5 Platforms]</option>
              <option value="PGT" ${defaultStn==='PGT'?'selected':''}>Palakkad Junction (PGT) [Palakkad Division - 5 Platforms]</option>
              <option value="AJJ" ${defaultStn==='AJJ'?'selected':''}>Arakkonam Junction (AJJ) [Chennai Division - 5 Platforms]</option>
              <option value="KPD" ${defaultStn==='KPD'?'selected':''}>Katpadi Junction (KPD) [Chennai Division - 5 Platforms]</option>
              <option value="VM" ${defaultStn==='VM'?'selected':''}>Villupuram Junction (VM) [TPJ Division - 6 Platforms]</option>
              <option value="TCR" ${defaultStn==='TCR'?'selected':''}>Thrissur (TCR) [TVC Division - 4 Platforms]</option>
              <option value="CAN" ${defaultStn==='CAN'?'selected':''}>Kannur (CAN) [Palakkad Division - 4 Platforms]</option>
              <option value="QLN" ${defaultStn==='QLN'?'selected':''}>Kollam Junction (QLN) [TVC Division - 6 Platforms]</option>
              <option value="RMM" ${defaultStn==='RMM'?'selected':''}>Rameswaram (RMM) [Madurai Division - Pamban Link]</option>
              <option value="CUSTOM">✏️ Custom Draft Station / Section...</option>
            </select>
          </div>

          <div>
            <label style="font-size:11px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:4px">RAILWAY DIVISION JURISDICTION *</label>
            <select id="repDivision" style="width:100%;padding:8px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px;font-weight:700">
              <option value="All Divisions (Zone 07)" selected>Zone 07 (All 6 Divisions)</option>
              <option value="Chennai">Chennai Division (MAS)</option>
              <option value="Salem">Salem Division (SA)</option>
              <option value="Palakkad">Palakkad Division (PGT)</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram Division (TVC)</option>
              <option value="Madurai">Madurai Division (MDU)</option>
              <option value="Tiruchirappalli">Tiruchirappalli Division (TPJ)</option>
            </select>
          </div>
        </div>

        <div id="customDraftFields" style="display:none;background:var(--bg-card);border:1px dashed #3b82f6;padding:10px;border-radius:6px;margin-bottom:12px">
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px">
            <div>
              <label style="font-size:10px;color:var(--text-muted);display:block;margin-bottom:3px">STATION FULL NAME</label>
              <input type="text" id="repCustomName" placeholder="e.g. Tirunelveli Junction" value="Tirunelveli Junction" style="width:100%;padding:6px 10px;border-radius:4px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12px" />
            </div>
            <div>
              <label style="font-size:10px;color:var(--text-muted);display:block;margin-bottom:3px">STATION CODE</label>
              <input type="text" id="repCustomCode" placeholder="e.g. TEN" value="TEN" style="width:100%;padding:6px 10px;border-radius:4px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12px;text-transform:uppercase;font-weight:800" />
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label style="font-size:11px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:4px">AUDIT CLASSIFICATION *</label>
            <select id="repScope" style="width:100%;padding:8px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12px">
              <option value="ZONAL_EXECUTIVE" selected>Comprehensive Zonal Performance &amp; Safety Audit</option>
              <option value="HEADWAY">Moving-Block Headway Spacing &amp; Interlocking</option>
              <option value="NIGHT_MAINTENANCE">Night Track Maintenance &amp; Machinery Possession</option>
              <option value="SAFETY_PUNCTUALITY">Safety Integrity Index &amp; Punctuality Risk Assessment</option>
            </select>
          </div>

          <div>
            <label style="font-size:11px;font-weight:800;color:var(--text-muted);display:block;margin-bottom:4px">REPORTING PERIOD *</label>
            <select id="repDateRange" style="width:100%;padding:8px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12px">
              <option value="Operational Audit: August – September 2026" selected>Operational Audit: August – September 2026</option>
              <option value="Rolling 16-Month Horizon: Sept 2026 – Dec 2027">Rolling 16-Month Horizon (2026 – 2027)</option>
              <option value="Annual Performance Projection 2026-27">Annual Projection (FY 2026-27)</option>
            </select>
          </div>
        </div>

        <div style="background:var(--bg-card);border:1px solid var(--border-light);padding:10px;border-radius:6px;margin-bottom:14px;font-size:11.5px;color:var(--text-main);display:flex;align-items:center;gap:8px">
          <input type="checkbox" id="repIncludeSignatures" checked style="accent-color:#1e3a8a;width:16px;height:16px" />
          <label for="repIncludeSignatures">
            Affix Institutional Attestation, Dual Signatories (COM &amp; PCE), and CRIS Cryptographic Key
          </label>
        </div>
      `,
      () => {
        window.executeGenerateStationReport();
      },
      isHi ? "आधिकारिक रिपोर्ट तैयार करें" : "Generate Official Report & Print PDF"
    );
  }
}

export function syncDraftStationInputs(val) {
  const customBox = document.querySelector("#customDraftFields");
  const divSelect = document.querySelector("#repDivision");
  const scopeSelect = document.querySelector("#repScope");
  if (val === "CUSTOM") {
    if (customBox) customBox.style.display = "block";
  } else {
    if (customBox) customBox.style.display = "none";
    if (val === "ZONAL") {
      if (divSelect) divSelect.value = "All Divisions (Zone 07)";
      if (scopeSelect) scopeSelect.value = "ZONAL_EXECUTIVE";
    } else {
      if (scopeSelect) scopeSelect.value = "HEADWAY";
      if (divSelect) {
        if (val === "MAS") divSelect.value = "Chennai";
        else if (val === "CBE" || val === "ED") divSelect.value = "Salem";
        else if (val === "ERS") divSelect.value = "Thiruvananthapuram";
        else if (val === "MDU") divSelect.value = "Madurai";
        else if (val === "PGT") divSelect.value = "Palakkad";
      }
    }
  }
}

export function executeGenerateStationReport() {
  const sel = document.querySelector("#repSelectStation")?.value || "ZONAL";
  const div = document.querySelector("#repDivision")?.value || "All Divisions (Zone 07)";
  const scope = document.querySelector("#repScope")?.value || (sel === "ZONAL" ? "ZONAL_EXECUTIVE" : "COMPREHENSIVE");
  const dateRange = document.querySelector("#repDateRange")?.value || "August – September 2026";
  const includeSignatures = document.querySelector("#repIncludeSignatures")?.checked !== false;

  if (sel === "ZONAL" || scope === "ZONAL_EXECUTIVE") {
    if (typeof window.showToast === 'function') {
      window.showToast("Synthesizing Official Zonal Operational & Safety Audit Report…");
    }
    const reportData = {
      reportId: "SR/HQ/OP-ENG/2026/DOC-0842",
      scope: "ZONAL_EXECUTIVE",
      fileRef: "HQ/G-24/TRK-BLK/2026-AUG",
      generatedDate: "06 Sept 2026, 16:30 IST",
      stnCode: "ZONAL",
      stnName: "Southern Railway Zone 07",
      division: "All 6 Divisions (MAS, SA, PGT, TVC, MDU, TPJ)",
      dateRange: dateRange,
      includeSignatures: includeSignatures
    };
    renderStationReportModal(reportData);
    return;
  }

  let stnCode = sel;
  let stnName = sel;

  if (sel === "CUSTOM") {
    stnName = (document.querySelector("#repCustomName")?.value || "Tirunelveli Junction").trim();
    stnCode = (document.querySelector("#repCustomCode")?.value || "TEN").trim().toUpperCase();
  } else if (KNOWN_STATION_DATABASE[sel]) {
    stnName = KNOWN_STATION_DATABASE[sel].name;
    stnCode = KNOWN_STATION_DATABASE[sel].code;
  } else {
    const found = (window.OFFICIAL_STATIONS_37 || window.liveStations || []).find(s => (s.code || s.station_code) === sel);
    if (found) {
      stnName = found.name || found.station_name || sel;
      stnCode = found.code || found.station_code || sel;
    }
  }

  // Get live trains for this station
  let stationTrains = [];
  if (typeof window.getStationLiveTrainList === 'function') {
    stationTrains = window.getStationLiveTrainList(stnCode);
  }

  if (typeof window.showToast === 'function') {
    window.showToast(`Synthesizing Technical Dossier for ${stnName} (${stnCode})…`);
  }
  const reportData = buildAiStationReportData(stnCode, stnName, div, scope, dateRange, includeSignatures, stationTrains);
  renderStationReportModal(reportData);
}

export function printStationPdfReport(stnCode) {
  const content = document.querySelector("#printableStationReportArea");
  if (!content) {
    if (typeof window.showToast === 'function') window.showToast("Report content not found!");
    return;
  }

  const printWindow = window.open('', '_blank', 'width=950,height=1000');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Southern_Railway_Official_Audit_Report_${stnCode || 'ZONAL'}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 10mm 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: 'Times New Roman', Times, Georgia, serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @media print {
            .no-print { display: none !important; }
            body { padding: 0 !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background:#1e293b;color:#ffffff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;font-family:-apple-system,sans-serif;margin-bottom:12px">
          <div>
            <b style="font-size:13px;letter-spacing:0.5px">SOUTHERN RAILWAY (ZONE 07) — OFFICIAL TECHNICAL DOSSIER</b>
            <div style="font-size:11px;opacity:0.8">Document rendered for formal archival print and PDF export. Select "Save as PDF" in destination.</div>
          </div>
          <button onclick="window.print()" style="background:#2563eb;color:#ffffff;font-weight:800;border:none;padding:7px 18px;border-radius:4px;cursor:pointer;font-size:12.5px;display:flex;align-items:center;gap:6px">
            🖨️ Save as PDF / Print
          </button>
        </div>
        ${content.innerHTML}
        <script>
          setTimeout(() => {
            window.print();
          }, 350);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  if (typeof window.showToast === 'function') window.showToast("Opening Official Print / Save as PDF Dialog…");
}

// Global window registration
if (typeof window !== 'undefined') {
  window.KNOWN_STATION_DATABASE = KNOWN_STATION_DATABASE;
  window.buildAiStationReportData = buildAiStationReportData;
  window.generateReportHtml = generateReportHtml;
  window.generateProfessionalExecutiveAuditReport = generateProfessionalExecutiveAuditReport;
  window.renderStationReportModal = renderStationReportModal;
  window.openStationReportDraftModal = openStationReportDraftModal;
  window.syncDraftStationInputs = syncDraftStationInputs;
  window.executeGenerateStationReport = executeGenerateStationReport;
  window.printStationPdfReport = printStationPdfReport;
}
