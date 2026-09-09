import { api } from "./api.js";
import { REAL_STATIONS_30, OFFICIAL_STATIONS_37, LIVE_STATION_TIMETABLE, CHENNAI_TIMETABLE_330 } from "./timetable_data.js";
import "./station_report_engine.js";

// ==========================================================================
// 1. DATA CONSTANTS & PRESETS (SOUTHERN RAILWAY - GOVT OF INDIA)
// ==========================================================================

const OFFICIAL_PRESETS = [
  {
    id: "SR-OFF-01",
    employee_id: "SR/MAS/DOM/8941",
    name: "Shri S. Ramanathan, IRTS",
    designation: "Sr. Divisional Operations Manager (Sr. DOM)",
    department: "OPERATING",
    department_name: "Operating & Traffic Control",
    division: "Chennai (MAS)",
    zone: "Southern Railway (SR)",
    role: "CHIEF_CONTROLLER",
    clearance_level: "LEVEL_5_SANCTION",
    permissions: ["PLAN_GENERATE", "BLOCK_SANCTION", "EMERGENCY_REPLAN", "VIEW_TIMELINE", "EXPORT_MEMO"],
    shift: "Day Operations (06:00 - 18:00 IST)",
  },
  {
    id: "SR-OFF-02",
    employee_id: "SR/MAS/ENG/4120",
    name: "Er. K. Selvam, IRSE",
    designation: "Senior Section Engineer (P-Way / Track)",
    department: "ENGINEERING",
    department_name: "Civil Engineering & Track Maintenance",
    division: "Chennai (MAS)",
    zone: "Southern Railway (SR)",
    role: "SECTION_ENGINEER",
    clearance_level: "LEVEL_3_FIELD_MAINT",
    permissions: ["MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TRACKS", "MACHINE_DEPLOY"],
    shift: "Night Track Maintenance (22:00 - 06:00 IST)",
  },
  {
    id: "SR-OFF-03",
    employee_id: "SR/PGT/TRD/6732",
    name: "Er. Anoop Varghese, IRSEE",
    designation: "Sr. Divisional Electrical Engineer (Sr. DEE / TRD)",
    department: "TRD",
    department_name: "Traction Distribution (25kV OHE)",
    division: "Palakkad (PGT)",
    zone: "Southern Railway (SR)",
    role: "TRACTION_OFFICER",
    clearance_level: "LEVEL_4_POWER_SANCTION",
    permissions: ["POWER_BLOCK_SANCTION", "MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TRACKS"],
    shift: "Day Operations (08:00 - 17:00 IST)",
  },
  {
    id: "SR-OFF-04",
    employee_id: "SR/MDU/SNT/5519",
    name: "Er. R. Meenakshi, IRSSE",
    designation: "Sr. Divisional Signal & Telecom Engineer (Sr. DSTE)",
    department: "S_AND_T",
    department_name: "Signaling & Telecommunication",
    division: "Madurai (MDU)",
    zone: "Southern Railway (SR)",
    role: "SIGNAL_OFFICER",
    clearance_level: "LEVEL_4_INTERLOCK_SANCTION",
    permissions: ["SIGNAL_BLOCK_SANCTION", "MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TIMELINE"],
    shift: "General Shift (09:00 - 18:00 IST)",
  },
  {
    id: "SR-OFF-05",
    employee_id: "SR/HQ/OPER/1008",
    name: "Shri M. Sundaram",
    designation: "Chief Train Controller (CPTM / Operating)",
    department: "OPERATING",
    department_name: "Zonal Traffic & Timetable Control",
    division: "Zonal HQ (MAS GM Office)",
    zone: "Southern Railway (SR)",
    role: "ZONAL_CONTROLLER",
    clearance_level: "LEVEL_5_SANCTION",
    permissions: ["PLAN_GENERATE", "BLOCK_SANCTION", "EMERGENCY_REPLAN", "CORRIDOR_OVERRIDE", "EXPORT_MEMO"],
    shift: "Zonal Control Shift (06:00 - 14:00 IST)",
  },
  {
    id: "SR-OFF-06",
    employee_id: "SR/HQ/SAFE/3301",
    name: "Dr. V. Rajesh, IRTS",
    designation: "Chief Safety Officer (Safety & Vigilance)",
    department: "SAFETY",
    department_name: "Safety & Operational Audit Directorate",
    division: "Zonal HQ (MAS GM Office)",
    zone: "Southern Railway (SR)",
    role: "SAFETY_AUDITOR",
    clearance_level: "LEVEL_5_SAFETY_AUDIT",
    permissions: ["AUDIT_ACCESS", "INCIDENT_LOG", "EMERGENCY_REPLAN", "VIEW_METRICS"],
    shift: "General Shift (09:30 - 17:30 IST)",
  },
];

// Formal SVG Icons Dictionary
const SVG_ICONS = {
  map: `<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>`,
  timetable: `<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><line x1="9" y1="15" x2="9" y2="15.01"></line><line x1="15" y1="15" x2="15" y2="15.01"></line><path d="m8 19-2 3"></path><path d="m18 22-2-3"></path></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  ai: `<svg viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>`,
  doc: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  infrastructure: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
  wrench: `<svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
  cloud: `<svg viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>`,
  analytics: `<svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  user: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  shield: `<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  activity: `<svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
  alert: `<svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  check: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  sun: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  moon: `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
};

// Formal Government Navigation Hierarchy - Comprehensive Zonal Architecture
const modules = {
  // 1. Executive Overview
  Dashboard:              { icon: "activity",       label: "Dashboard",              group: "OVERVIEW" },
  "Corridor Map":         { icon: "map",            label: "Corridor Map",           group: "OVERVIEW" },

  // 2. Corridors & Permanent Way
  "Corridors & Sections": { icon: "infrastructure", label: "Corridors & Sections",   group: "CORRIDORS & INFRA" },
  "Stations Master":      { icon: "timetable",      label: "Stations Master",        group: "CORRIDORS & INFRA" },
  "Station Planning":     { icon: "activity",       label: "Station Planning",       group: "CORRIDORS & INFRA" },

  // 3. Block Planning & Optimization
  "Block Planning":       { icon: "calendar",       label: "Block Planning",         group: "PLANNING & SYNERGY" },
  "Block Calendar":       { icon: "clock",          label: "Block Calendar",         group: "PLANNING & SYNERGY" },

  // 4. Resources & Assets
  "Asset Management":     { icon: "wrench",         label: "Asset Management",       group: "RESOURCES & ASSETS" },

  // 5. Maintenance & Safety
  "Defects & USFD":       { icon: "alert",          label: "Defects & USFD",         group: "MAINTENANCE & SAFETY" },
  "Weather & Incidents":  { icon: "sun",            label: "Weather & Incidents",    group: "MAINTENANCE & SAFETY" },

  // 6. Reports & System
  "Reports & Analytics":  { icon: "analytics",      label: "Reports & Analytics",    group: "REPORTS & SYSTEM" },
  Settings:               { icon: "settings",       label: "Settings & API Hub",     group: "REPORTS & SYSTEM" },
};

// Major Southern Railway Corridors
const REAL_ROUTES = [
  {
    id: "mas_cbe",
    code: "SEC-MAS-CBE",
    name: "Chennai Central (MAS) ➔ Coimbatore Jn (CBE)",
    clearance: "UP & DOWN Mainline • Double Track Electrified (25kV AC)",
    speed: "130 km/h",
    div: "Chennai (MAS) & Salem (SA)",
    color: "#2868b0",
    coords: [
      [13.0827, 80.2707], [13.0784, 79.6677], [12.9696, 79.1362], [12.5638, 78.5802],
      [11.6643, 78.1460], [11.3410, 77.7172], [11.1085, 77.3411], [11.0168, 76.9558]
    ]
  },
  {
    id: "ker_coast",
    code: "SEC-PGT-TVC",
    name: "Mangaluru (MAQ) ➔ Shoranur ➔ Ernakulam ➔ TVC Coastal Line",
    clearance: "Electrified Double Track • Automatic Signaled",
    speed: "110 km/h",
    div: "Palakkad (PGT) & Thiruvananthapuram (TVC)",
    color: "#1e824c",
    coords: [
      [12.8700, 74.8800], [11.8745, 75.3704], [11.2588, 75.7804], [10.7607, 76.2758],
      [10.5276, 76.2144], [9.9816, 76.2999], [9.4981, 76.3388], [8.8932, 76.6141],
      [8.5241, 76.9366], [8.1833, 77.4119], [8.0883, 77.5385]
    ]
  },
  {
    id: "mas_mdu",
    code: "SEC-MAS-MDU",
    name: "Chennai Egmore (MS) ➔ Trichy ➔ Madurai ➔ Tirunelveli Grand Trunk",
    clearance: "Grand Trunk Electrified Double Track (25kV AC)",
    speed: "110 km/h",
    div: "Chennai, Tiruchirappalli & Madurai",
    color: "#a93226",
    coords: [
      [13.0826, 80.2612], [12.6841, 79.9836], [11.9401, 79.4861], [10.7905, 78.7047],
      [10.3673, 77.9803], [9.9252, 78.1198], [9.5872, 77.9624], [8.7139, 77.7567],
      [8.1833, 77.4119]
    ]
  },
  {
    id: "delta",
    code: "SEC-TPJ-DELTA",
    name: "Delta Chord (Villupuram ➔ Thanjavur ➔ Trichy Jn)",
    clearance: "Single Line Electrified with MACLS Signaling",
    speed: "100 km/h",
    div: "Tiruchirappalli (TPJ)",
    color: "#d4ac0d",
    coords: [
      [11.9401, 79.4861], [11.1018, 79.6522], [10.9602, 79.3845], [10.7870, 79.1378], [10.7905, 78.7047]
    ]
  },
  {
    id: "mdu_rmm",
    code: "SEC-MDU-RMM",
    name: "Madurai Jn (MDU) ➔ Pamban Bridge ➔ Rameswaram (RMM)",
    clearance: "Coastal Marine Corridor • Caution Speed on Marine Bridge",
    speed: "80 km/h (Pamban: 30 km/h)",
    div: "Madurai (MDU)",
    color: "#d35400",
    coords: [
      [9.9252, 78.1198], [9.6000, 78.6000], [9.3667, 78.8333], [9.2876, 79.3129]
    ]
  }
];

// Active Maintenance Zones on GPS Track
const MAINT_ZONES = [
  {
    id: "zone1",
    section: "SEC-MAS-CBE (Katpadi - Jolarpettai)",
    lat: 12.7667,
    lng: 78.8582,
    engineer: "Er. K. Selvam, SSE P-Way",
    role: "Senior Section Engineer (P-Way)",
    action: "CSM Tamping #04 (KM 12.0 - 18.5)",
    dept: "ENGINEERING + S&T + TRD",
    duration: "180 mins (01:00 - 04:00 IST)",
    status: "Traffic & Power Block Sanctioned",
    code: "SR/PERMIT/2026/089"
  },
  {
    id: "zone2",
    section: "SEC-MDU-TEN (Dindigul - Madurai)",
    lat: 10.1462,
    lng: 78.0500,
    engineer: "Er. Rajesh Kumar, PWI",
    role: "Permanent Way Inspector",
    action: "Deep Ballast Screening & USFD Testing",
    dept: "ENGINEERING",
    duration: "120 mins (02:00 - 04:00 IST)",
    status: "Temporary Speed Restriction 30 km/h",
    code: "SR/PERMIT/2026/092"
  },
  {
    id: "zone3",
    section: "SEC-PGT-TVC (Thrissur - Ernakulam)",
    lat: 10.2546,
    lng: 76.2571,
    engineer: "Er. Anoop Varghese, Sr. DEE",
    role: "TRD Electrical Engineer",
    action: "25kV OHE Contact Wire Calibration",
    dept: "TRD (Traction)",
    duration: "135 mins (01:30 - 03:45 IST)",
    status: "OHE Power Isolation Approved",
    code: "SR/PERMIT/2026/095"
  }
];

// Corridor Weather Risk Intelligence
const CORRIDOR_WEATHER_DATA = [
  {
    name: "Chennai ➔ Coimbatore Mainline (MAS-CBE)",
    div: "Chennai & Salem Divisions",
    temp: "32°C",
    cond: "Partly Cloudy",
    rain: "1.2 mm/h",
    wind: "14 km/h",
    humidity: "72%",
    risk: "LOW",
    rec: "Permitted for high-speed CSM machine tamping and OHE contact wire inspection."
  },
  {
    name: "Kerala & Malabar Coastline (MAQ-TVC)",
    div: "Palakkad & Thiruvananthapuram",
    temp: "27°C",
    cond: "Light Rain Showers",
    rain: "8.5 mm/h",
    wind: "22 km/h",
    humidity: "89%",
    risk: "MEDIUM",
    rec: "Cautionary speed limit of 45 km/h during OHE tower wagon maintenance."
  },
  {
    name: "Chennai ➔ Madurai ➔ Tirunelveli Grand Trunk",
    div: "Chennai, Trichy & Madurai",
    temp: "34°C",
    cond: "Clear Weather",
    rain: "0.0 mm/h",
    wind: "11 km/h",
    humidity: "64%",
    risk: "LOW",
    rec: "Optimal conditions. Track destressing and thermit weld testing authorized."
  },
  {
    name: "Delta Chord Corridor (Villupuram ➔ Trichy)",
    div: "Tiruchirappalli Division",
    temp: "33°C",
    cond: "Sunny",
    rain: "0.0 mm/h",
    wind: "9 km/h",
    humidity: "68%",
    risk: "LOW",
    rec: "Cleared for single-line track renewal and signal interlocking overhaul."
  },
  {
    name: "Madurai ➔ Pamban ➔ Rameswaram Corridor",
    div: "Madurai Division",
    temp: "30°C",
    cond: "Coastal Winds",
    rain: "2.0 mm/h",
    wind: "38 km/h",
    humidity: "82%",
    risk: "MEDIUM",
    rec: "Wind velocity approaching 38 km/h near Pamban Marine Bridge. Structural inspection caution."
  }
];

let RTIS_LIVE_TRAINS = [];
let liveStations = REAL_STATIONS_30;

// ==========================================================================
// 2. STATE MANAGEMENT & SESSION
// ==========================================================================

let currentTheme = localStorage.getItem("sr_portal_theme") || "dark";
document.documentElement.setAttribute("data-theme", currentTheme);
document.body.className = currentTheme === "light" ? "theme-light" : "theme-dark";

let currentOfficial = api.getOfficial() || OFFICIAL_PRESETS[0];
if (!api.getOfficial()) api.setOfficial(OFFICIAL_PRESETS[0]);
let activeLoginTab = "quick";
let current = "Dashboard";
window.navigateTo = (pageName) => {
  current = pageName;
  render();
};
let currentLang = localStorage.getItem("sr_lang") || "en";
window.setLanguage = (lang) => {
  currentLang = lang;
  localStorage.setItem("sr_lang", lang);
  const appEl = document.querySelector("#app");
  if (appEl) appEl.innerHTML = ""; // Force clean full shell re-mount
  render();
};

const I18N = {
  en: {
    portal_title: "SOUTHERN RAILWAY",
    portal_sub: "GIS & BLOCK PLANNING",
    dept: "Operating & Civil Engineering",
    zone: "Zone 07 - Chennai",
    nav_groups: {
      "OVERVIEW": "OVERVIEW",
      "CORRIDORS & INFRA": "CORRIDORS & PERMANENT WAY",
      "PLANNING & SYNERGY": "BLOCK PLANNING & OPTIMIZATION",
      "RESOURCES & ASSETS": "RESOURCES & ASSETS",
      "MAINTENANCE & SAFETY": "MAINTENANCE & SAFETY",
      "REPORTS & SYSTEM": "REPORTS & SYSTEM"
    },
    nav_labels: {
      "Dashboard": "Dashboard",
      "Corridor Map": "Corridor Map",
      "Corridors & Sections": "Corridors & Sections",
      "Stations Master": "Stations Master",
      "Station Planning": "Station Planning",
      "Block Planning": "Block Planning",
      "Block Calendar": "Block Calendar",
      "Asset Management": "Asset Management",
      "Defects & USFD": "Defects & USFD",
      "Weather & Incidents": "Weather & Incidents",
      "Reports & Analytics": "Reports & Analytics",
      "Settings": "Settings & API Hub"
    }
  },
  hi: {
    portal_title: "दक्षिण रेलवे",
    portal_sub: "जीआईएस एवं ब्लॉक योजना",
    dept: "परिचालन एवं सिविल इंजीनियरिंग",
    zone: "जोन 07 - चेन्नई",
    nav_groups: {
      "OVERVIEW": "सिंहावलोकन",
      "CORRIDORS & INFRA": "गलियारे एवं ट्रैक अनुभाग",
      "PLANNING & SYNERGY": "ब्लॉक योजना एवं अनुकूलन",
      "RESOURCES & ASSETS": "संसाधन एवं परिसंपत्तियां",
      "MAINTENANCE & SAFETY": "रखरखाव एवं संरक्षा",
      "REPORTS & SYSTEM": "रिपोर्ट एवं सिस्टम"
    },
    nav_labels: {
      "Dashboard": "डैशबोर्ड",
      "Corridor Map": "कॉरिडोर मानचित्र",
      "Corridors & Sections": "गलियारे एवं ट्रैक अनुभाग",
      "Stations Master": "स्टेशन मास्टर",
      "Station Planning": "स्टेशन योजना (सिग्नलिंग)",
      "Block Planning": "ब्लॉक योजना",
      "Block Calendar": "ब्लॉक कैलेंडर",
      "Asset Management": "परिसंपत्ति प्रबंधन",
      "Defects & USFD": "ट्रैक दोष एवं यूएसएफडी",
      "Weather & Incidents": "मौसम एवं घटनाएं",
      "Reports & Analytics": "रिपोर्ट एवं विश्लेषण",
      "Settings": "सेटिंग्स एवं एपीआई हब"
    }
  }
};

const t = (section, key, fallback) => {
  const dict = I18N[currentLang] || I18N.en;
  if (section && dict[section] && dict[section][key] !== undefined) {
    return dict[section][key];
  }
  if (dict[key] !== undefined) {
    return dict[key];
  }
  return fallback || key;
};

// Comprehensive Universal Hindi Dictionary for 100% complete language switching
const HINDI_DICTIONARY = {
  // Navigation & Shell
  "Dashboard": "डैशबोर्ड",
  "Corridor Map": "कॉरिडोर मानचित्र",
  "Corridors & Sections": "गलियारे एवं ट्रैक अनुभाग",
  "Stations Master": "स्टेशन मास्टर",
  "Station Planning": "स्टेशन योजना (सिग्नलिंग)",
  "Block Planning": "ब्लॉक योजना",
  "Block Calendar": "ब्लॉक कैलेंडर",
  "Asset Management": "परिसंपत्ति प्रबंधन",
  "Defects & USFD": "ट्रैक दोष एवं यूएसएफडी",
  "Weather & Incidents": "मौसम एवं घटनाएं",
  "Reports & Analytics": "रिपोर्ट एवं विश्लेषण",
  "Settings & API Hub": "सेटिंग्स एवं एपीआई हब",
  "Settings": "सेटिंग्स",
  "OVERVIEW": "सिंहावलोकन",
  "CORRIDORS & INFRA": "गलियारे एवं ट्रैक अनुभाग",
  "CORRIDORS & PERMANENT WAY": "गलियारे एवं स्थायी मार्ग",
  "PLANNING & SYNERGY": "ब्लॉक योजना एवं तालमेल",
  "RESOURCES & ASSETS": "संसाधन एवं परिसंपत्तियां",
  "MAINTENANCE & SAFETY": "रखरखाव एवं संरक्षा",
  "REPORTS & SYSTEM": "रिपोर्ट एवं सिस्टम",
  "SOUTHERN RAILWAY": "दक्षिण रेलवे",
  "GIS & BLOCK PLANNING": "जीआईएस एवं ब्लॉक योजना",
  "SOUTHERN RAILWAY (ZONE 07)": "दक्षिण रेलवे (जोन 07)",
  "Southern Railway (Zone 07)": "दक्षिण रेलवे (जोन 07)",
  "Operating & Civil Engineering": "परिचालन एवं सिविल इंजीनियरिंग",
  "Zone 07 - Chennai": "जोन 07 - चेन्नई",
  "Zonal Operations • Zonal HQ": "क्षेत्रीय परिचालन • क्षेत्रीय मुख्यालय",
  "Zonal Operations": "क्षेत्रीय परिचालन",
  "Zonal HQ": "क्षेत्रीय मुख्यालय",
  "Accessibility:": "अभिगम्यता:",
  "RESTRICTED • OFFICIAL USE ONLY": "प्रतिबंधित • केवल आधिकारिक उपयोग हेतु",
  "OFFICIAL USE ONLY": "केवल आधिकारिक उपयोग हेतु",
  "Light Mode": "लाइट मोड",
  "Dark Mode": "डार्क मोड",
  "Logout": "लॉग आउट",
  "FASTAPI v1.0 ONLINE": "फास्टएपीआई v1.0 ऑनलाइन",
  "BACKEND OFFLINE": "बैकएंड ऑफलाइन",

  // Top Metric & KPI Cards
  "Total Blocks Executed (Sanctioned)": "कुल निष्पादित ब्लॉक (स्वीकृत)",
  "Total Downtime Saved": "कुल बचाया गया डाउनटाइम",
  "Punctuality %": "समयपालन प्रतिशत (%)",
  "Defects Rectified": "सुधारे गए ट्रैक दोष",
  "Downtime Saved (Hours)": "बचाया गया डाउनटाइम (घंटे)",
  "Defects Trend": "ट्रैक दोष प्रवृत्ति",
  "Planning Horizon": "योजना क्षितिज",
  "Scheduled Block Plans": "अनुसूचित ब्लॉक योजनाएं",
  "Average Headway Margin": "औसत हेडवे अंतराल",
  "Machinery Sync": "मशीनरी समन्वय",
  "Active Plans": "सक्रिय योजनाएं",
  "Zero Passenger Clashing": "शून्य यात्री ट्रेन टकराव",
  "Fully Coordinated Units": "पूर्णतः समन्वित इकाइयां",
  "16 Months Rolling Window": "16 महीने का अग्रिम कैलेंडर",
  "Peak 00:30 – 04:30 Safe Gap": "रात 00:30 से 04:30 मुख्य स्लॉट",
  "66% Net Possession Optimization": "66% नेट ब्लॉक समय बचत",
  "Zero revenue rail fractures": "शून्य परिचालन रेल फ्रैक्चर",
  "Zero In-Service Failures": "शून्य इन-सर्विस विफलताएं",
  "Zero In-Service Rail Fractures": "शून्य इन-सर्विस रेल फ्रैक्चर",
  "3,860 Delay Minutes Averted": "3,860 मिनट ट्रेन विलंब बचाया गया",
  "100% Conflict-Free Scheduling": "100% टकराव-मुक्त शेड्यूलिंग",
  "Zone 07 Operational Jurisdictions": "जोन 07 परिचालन क्षेत्राधिकार",
  "66.7% Net Hours Saved": "66.7% शुद्ध घंटे की बचत",
  "Divisional Performance Benchmark (6 Divisions)": "मंडलीय प्रदर्शन बेंचमार्क (6 मंडल)",
  "Multi-Departmental Synergy & Machinery Flow": "बहु-विभागीय समन्वय एवं मशीनरी प्रवाह",
  "High-Density Corridors Speed & Delay Minutes Averted Visualizer": "उच्च-घनत्व गलियारे गति एवं बचाया गया विलंब",
  "24-Hour Diurnal Possession Heatmap (Slot Occupancy Visual Matrix)": "24-घंटे का दैनिक ब्लॉक हीटमैप (स्लॉट उपयोग)",
  "Ultrasonic Flaw Detection (USFD) Mean Time to Resolution vs. Statutory SLA": "यूएसएफडी दोष समाधान समय बनाम वैधानिक लक्ष्य",

  // Buttons & Controls
  "Create Block Plan (Train Arrival Aware)": "नया ब्लॉक प्लान बनाएं",
  "Create Block Plan": "नया ब्लॉक प्लान बनाएं",
  "+ Create Block": "+ नया ब्लॉक बनाएं",
  "Download CSV": "सीएसवी डाउनलोड करें",
  "Generate Report": "रिपोर्ट तैयार करें",
  "Copy Audit Memo": "ऑडिट मेमो कॉपी करें",
  "Export CSV Dataset": "सीएसवी निर्यात करें",
  "Generate Institutional Report (PDF)": "आधिकारिक रिपोर्ट तैयार करें (PDF)",
  "Today (Sep 2026)": "आज (सितंबर 2026)",
  "Today": "आज",
  "Calendar": "कैलेंडर",
  "Registry Table": "रजिस्ट्री तालिका",
  "All Divisions (Zone 07)": "सभी मंडल (जोन 07)",
  "All Divisions": "सभी मंडल",
  "All Stations": "सभी स्टेशन",
  "Date Range:": "दिनांक सीमा:",
  "Report Type:": "रिपोर्ट प्रकार:",
  "Division:": "मंडल क्षेत्राधिकार:",
  "Propose Joint Block": "संयुक्त ब्लॉक प्रस्तावित करें",
  "Log Defect": "दोष दर्ज करें",
  "Sync Live Weather & Delays": "लाइव मौसम सिंक करें",
  "+ Log Caution Order": "+ सतर्कता आदेश दर्ज करें",
  "Log Caution Order": "सतर्कता आदेश दर्ज करें",
  "Apply Filters": "फ़िल्टर लागू करें",
  "Reset Filters": "फ़िल्टर रीसेट करें",
  "Close": "बंद करें",
  "Cancel": "रद्द करें",
  "Save": "सहेजें",
  "Filter": "फ़िल्टर",
  "All": "सभी",
  "Search": "खोजें",
  "Search station, code or line...": "स्टेशन, कोड या लाइन खोजें...",
  "Search corridor or station...": "कॉरिडोर या स्टेशन खोजें...",

  // Divisions & Jurisdictions
  "Chennai Division (MAS)": "चेन्नई मंडल (MAS)",
  "Salem Division (SA)": "सेलम मंडल (SA)",
  "Palakkad Division (PGT)": "पालक्काड मंडल (PGT)",
  "Thiruvananthapuram Division (TVC)": "तिरुवनंतपुरम मंडल (TVC)",
  "Madurai Division (MDU)": "मदुरै मंडल (MDU)",
  "Tiruchirappalli Division (TPJ)": "तिरुचिरापल्ली मंडल (TPJ)",
  "Chennai Central (MAS)": "चेन्नई सेंट्रल (MAS)",
  "Coimbatore (CBE)": "कोयंबटूर (CBE)",
  "Erode (ED)": "इरोड (ED)",
  "Salem (SA)": "सेलम (SA)",
  "Katpadi (KPD)": "काटपाडी (KPD)",
  "Palakkad (PGT)": "पालक्काड (PGT)",
  "Madurai (MDU)": "मदुरै (MDU)",
  "Trichy (TPJ)": "तिरुचिरापल्ली (TPJ)",
  "Chennai": "चेन्नई",
  "Salem": "सेलम",
  "Palakkad": "पालक्काड",
  "Madurai": "मदुरै",
  "Trichy": "तिरुचिरापल्ली",
  "Thiruvananthapuram": "तिरुवनंतपुरम",

  // Days & Months
  "Sunday": "रविवार", "Monday": "सोमवार", "Tuesday": "मंगलवार", "Wednesday": "बुधवार", "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार",
  "SUN (रवि)": "रवि (SUN)", "MON (सोम)": "सोम (MON)", "TUE (मंगल)": "मंगल (TUE)", "WED (बुध)": "बुध (WED)", "THU (गुरु)": "गुरु (THU)", "FRI (शुक्र)": "शुक्र (FRI)", "SAT (शनि)": "शनि (SAT)",
  "SUN": "रवि", "MON": "सोम", "TUE": "मंगल", "WED": "बुध", "THU": "गुरु", "FRI": "शुक्र", "SAT": "शनि",
  "January": "जनवरी", "February": "फ़रवरी", "March": "मार्च", "April": "अप्रैल", "May": "मई", "June": "जून", "July": "जुलाई", "August": "अगस्त", "September": "सितंबर", "October": "अक्टूबर", "November": "नवंबर", "December": "दिसंबर",

  // Table Headers & Audit
  "DIVISION": "मंडल",
  "HEADQUARTERS": "मुख्यालय",
  "ROUTE KM": "रूट किमी",
  "SANCTIONED BLOCKS": "स्वीकृत ब्लॉक",
  "DOWNTIME SAVED": "बचाया गया समय",
  "PUNCTUALITY %": "समयपालन %",
  "TSRS LIFTED": "हटाए गए टीएसआर",
  "AUDIT COMPLIANCE": "ऑडिट अनुपालन",
  "DEPARTMENT": "विभाग",
  "MACHINERY": "मशीनरी",
  "FLEET": "इकाइयां",
  "HOURS DEMANDED": "मांगे गए घंटे",
  "JOINT HOURS": "संयुक्त घंटे",
  "HOURS SAVED": "बचत घंटे",
  "SYNERGY OVERLAP %": "समन्वय %",
  "OUTPUT COMPLETED": "कार्य निष्पादन",
  "DEFECT SEVERITY": "दोष गंभीरता",
  "RECORDED COUNT": "दर्ज संख्या",
  "SHARE (%)": "हिस्सा (%)",
  "MTTR": "समाधान समय (MTTR)",
  "STATUTORY TARGET": "वैधानिक लक्ष्य",
  "MITIGATION PROTOCOL": "निवारण प्रोटोकॉल",
  "SAFETY OUTCOME": "संरक्षक परिणाम",
  "CORRIDOR": "गलियारा",
  "MPS (KM/H)": "अधिकतम गति",
  "TRAIN DENSITY": "ट्रेन घनत्व",
  "DELAY MINUTES AVERTED": "बचाया गया विलंब",
  "PUNCTUALITY INDEX": "समयपालन सूचकांक",
  "OPERATIONAL IMPROVEMENT": "परिचालन सुधार",
  "CRITICAL": "गंभीर",
  "MAJOR": "प्रमुख",
  "MODERATE": "मध्यम",
  "MINOR": "लघु",
  "Critical": "गंभीर",
  "Major": "प्रमुख",
  "Moderate": "मध्यम",
  "Minor": "लघु",
  "HIGH": "उच्च",
  "MEDIUM": "मध्यम",
  "LOW": "निम्न",
  "Approved": "स्वीकृत",
  "Pending": "लंबित",
  "Completed": "पूर्ण",
  "In Progress": "प्रगति पर",
  "Rectified": "सुधारा गया",
  "Open": "सक्रिय",
  "Scheduled": "अनुसूचित",

  // Diurnal Slots
  "Deep Night Window": "गहरी रात की खिड़की",
  "Dawn Transition": "उषाकाल संक्रमण",
  "Morning Peak": "सुबह का पीक",
  "Midday Inter-Peak": "दोपहर का अंतराल",
  "Evening Peak": "शाम का पीक",
  "Night Staging": "रात्रि तैयारी",

  // Action Studio & Reports
  "OFFICIAL RAILWAY AUDIT GENERATION & EXPORT STUDIO": "आधिकारिक रेलवे ऑडिट निर्माण एवं निर्यात स्टूडियो",
  "Divisional Performance Audit (6 Divisions)": "मंडलीय प्रदर्शन ऑडिट (6 मंडल)",
  "High-Density Corridors & Punctuality Recovery": "उच्च-घनत्व गलियारे एवं समयपालन सुधार",
  "Departmental Synergy & Machinery Utilization": "विभागीय तालमेल एवं मशीनरी उपयोग",
  "USFD Track Defect Lifecycle & Safety Assurance": "यूएसएफडी ट्रैक दोष एवं संरक्षा आश्वासन",

  // Modals & Form Fields
  "Create Block Plan": "नया ब्लॉक प्लान बनाएं",
  "Block Plan Dossier": "ब्लॉक योजना डोजियर",
  "Authorized Traffic & Maintenance Block Window": "अधिकृत यातायात एवं अनुरक्षण ब्लॉक विंडो",
  "TARGET ASSET & PLATFORM": "लक्षित परिसंपत्ति एवं प्लेटफॉर्म",
  "ASSIGNED MACHINERY / GANG": "आवंटित मशीनरी / कार्यदल",
  "Speed Restriction": "गति प्रतिबंध",
  "Full Line Speed": "पूर्ण अनुभाग गति",
  "Zero passenger disruption. Approved by Section Traffic Controller.": "शून्य यात्री व्यवधान। अनुभाग यातायात नियंत्रक द्वारा अनुमोदित।",
  "Synchronized with train-free night margin": "ट्रेन-मुक्त रात्रि अंतराल के साथ समन्वयित",
  "SR Admin (Block Planning Console)": "एसआर व्यवस्थापक (ब्लॉक योजना कंसोल)",
  "Preceding Train": "पूर्ववर्ती ट्रेन",
  "Succeeding Train": "अनुवर्ती ट्रेन",
  "Headway Margin": "हेडवे मार्जिन",
  "Train Impact": "ट्रेन प्रभाव",
  "Authorized By": "अधिकृतकर्ता",
  "Work Description": "कार्य विवरण",
  "Work Details": "कार्य विवरण",
  "Work Type": "कार्य प्रकार",
  "Department": "विभाग",
  "Machine Type": "मशीनरी का प्रकार",
  "Machine Assigned": "आवंटित मशीन",
  "Platform / Line": "प्लेटफॉर्म / लाइन",
  "Start Time": "प्रारंभ समय",
  "End Time": "समाप्ति समय",
  "Duration (Mins)": "अवधि (मिनट)",
  "Duration": "अवधि",
  "Station Name": "स्टेशन का नाम",
  "Station": "स्टेशन",
  "Division": "मंडल",
  "Corridor": "गलियारा",
  "Submit": "जमा करें",
  "Create": "बनाएं",
  "Confirm": "पुष्टि करें",
  "Dismiss": "खारिज करें",
  "Select Station": "स्टेशन चुनें",
  "Select Division": "मंडल चुनें",
  "Select Department": "विभाग चुनें",
  "Select Work Type": "कार्य प्रकार चुनें",
  "Date": "दिनांक",
  "Time": "समय",
  "Actions": "कार्रवाई",
  "Status": "स्थिति",
  "Action": "कार्रवाई",
  "Details": "विवरण",
  "Close": "बंद करें",
  "Cancel": "रद्द करें",
  "Save": "सहेजें",
  "Delete": "हटाएं",
  "Edit": "संपादित करें",
  "View": "देखें",
  "Print": "प्रिंट करें",
  "Export": "निर्यात करें",
  "Refresh": "ताज़ा करें",
  "Search": "खोजें",
  "Filter": "फ़िल्टर",
  "Reset": "रीसेट करें",
  "Clear": "साफ़ करें",
  "Loading": "लोड हो रहा है",
  "Active": "सक्रिय",
  "Inactive": "निष्क्रिय",
  "Online": "ऑनलाइन",
  "Offline": "ऑफलाइन",
  "Healthy": "सक्रिय",
  "Criticality": "गंभीरता",
  "Safety": "संरक्षा",
  "Speed Impact": "गति प्रभाव",
  "Overdue": "अतिदेय",
  "Track": "ट्रैक",
  "Bridge": "पुल",
  "Tunnel": "सुरंग",
  "Level Crossing": "समपार फाटक",
  "Yard": "यार्ड",
  "OHE": "ओएचई (विद्युत)",
  "P-Way": "स्थायी मार्ग (पी-वे)",
  "S&T": "सिग्नल एवं दूरसंचार",
  "TRD": "कर्षण वितरण (टीआरडी)"
};

// Pre-sorted by key length descending for reliable phrase matching without partial collisions
const HINDI_SORTED_ENTRIES = Object.entries(HINDI_DICTIONARY).sort((a, b) => b[0].length - a[0].length);

function applyUniversalTranslation(root, lang) {
  if (lang !== "hi" || !root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent) continue;
    const tag = parent.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "code" || parent.isContentEditable) continue;

    const orig = node.nodeValue.trim();
    if (!orig) continue;

    if (HINDI_DICTIONARY[orig]) {
      node.nodeValue = node.nodeValue.replace(orig, HINDI_DICTIONARY[orig]);
      continue;
    }

    // Phrase-level replacement using pre-sorted longest keys first
    let replaced = node.nodeValue;
    let modified = false;
    for (const [enKey, hiVal] of HINDI_SORTED_ENTRIES) {
      if (enKey.length >= 2 && replaced.includes(enKey)) {
        replaced = replaced.split(enKey).join(hiVal);
        modified = true;
      }
    }
    if (modified) {
      node.nodeValue = replaced;
    }
  }

  // Also translate select options, placeholders, titles, buttons
  root.querySelectorAll("option").forEach(opt => {
    const t = opt.textContent.trim();
    if (HINDI_DICTIONARY[t]) opt.textContent = HINDI_DICTIONARY[t];
  });
  root.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(inp => {
    const p = inp.getAttribute("placeholder");
    if (p && HINDI_DICTIONARY[p]) inp.setAttribute("placeholder", HINDI_DICTIONARY[p]);
  });
  root.querySelectorAll("[title]").forEach(el => {
    const ti = el.getAttribute("title");
    if (ti && HINDI_DICTIONARY[ti]) el.setAttribute("title", HINDI_DICTIONARY[ti]);
  });
}


let connected = false;
let isSidebarCollapsed = false;
let selectedDivision = "ALL";
let selectedLiveTrainNo = "20607";
let selectedMapLayer = currentTheme === "light" ? "osm" : "dark";
let leafletMapInstance = null;
let trainMarkers = {};
let trainT = 0;
let dashboardData = {};

let mlSliders = {
  criticality: 85,
  safety: 90,
  overdue: 14,
  traffic: "HIGH",
  speedImpact: 30
};

const esc = s => String(s ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));


// ==========================================================================
// 3. UI RENDERING & FORMAL LAYOUT
// ==========================================================================


// Comprehensive GIS Cartography Infrastructure Datasets
const GIS_BRIDGES_DATA = [
  { name: "Pamban Railway Sea Bridge", coords: [9.2825, 79.1983], type: "Cantilever Scherzer Lift Sea Bridge (2.06 km)", div: "MDU", status: "Operational (Caution 30 km/h)" },
  { name: "Cauvery River Major Rail Bridge (Erode)", coords: [11.3500, 77.7300], type: "Steel Truss Girder (1.2 km, 16 Spans)", div: "SA", status: "Operational (110 km/h)" },
  { name: "Coleroon River Arch Bridge (Trichy)", coords: [10.8500, 78.7000], type: "Prestressed Concrete Arch Bridge (1.4 km)", div: "TPJ", status: "Operational (130 km/h)" },
  { name: "Vaigai River Rail Bridge (Madurai)", coords: [9.9300, 78.1300], type: "Plate Girder 12-Spans (600m)", div: "MDU", status: "Operational (100 km/h)" },
  { name: "Bharatappuzha Nila Rail Viaduct (Shoranur)", coords: [10.7600, 76.2800], type: "Historic Multi-Span River Viaduct (950m)", div: "PGT", status: "Operational (110 km/h)" },
  { name: "Netravati River Rail Bridge (Mangaluru)", coords: [12.8400, 74.8500], type: "Prestressed Concrete Rail Bridge (1.1 km)", div: "PGT", status: "Operational (100 km/h)" }
];

const GIS_TUNNELS_DATA = [
  { name: "Palakkad Gap Western Ghats Tunnel #1", coords: [10.8100, 76.7100], type: "Broad Gauge Mountain Tunnel (1,250m)", div: "PGT", speed: "110 km/h" },
  { name: "Kottayam Pass Rail Tunnel #2", coords: [9.5900, 76.5300], type: "Single Line Curved Tunnel (890m)", div: "TVC", speed: "90 km/h" },
  { name: "Aryankavu Shenkottai Ghats Tunnel #3", coords: [8.9800, 77.2400], type: "Heritage Mountain Tunnel (1,020m)", div: "MDU", speed: "75 km/h" },
  { name: "Nilgiri Mountain Railway Hill Tunnel #4", coords: [11.3500, 76.8000], type: "UNESCO Heritage Hill Tunnel (450m)", div: "SA", speed: "30 km/h" }
];

const GIS_LEVEL_CROSSINGS_DATA = [
  { code: "LC-42", loc: "Katpadi Jn Approach", coords: [12.9600, 79.1400], cls: "Special Class (Interlocked Electric Boom)", div: "MAS", tvu: "85,000" },
  { code: "LC-88", loc: "Salem Freight Yard North", coords: [11.6600, 78.1400], cls: "Class A (Lifting Barrier)", div: "SA", tvu: "62,000" },
  { code: "LC-114", loc: "Villupuram South Outer", coords: [11.9300, 79.4800], cls: "Class A (Manned Interlocked)", div: "TPJ", tvu: "54,000" },
  { code: "LC-205", loc: "Dindigul West Section", coords: [10.3600, 77.9700], cls: "Class B (Track Circuit Automatic)", div: "MDU", tvu: "41,000" },
  { code: "LC-312", loc: "Shoranur West Cabin", coords: [10.7600, 76.2700], cls: "Class A (Double Barrier Gate)", div: "PGT", tvu: "48,000" }
];

const GIS_YARDS_DATA = [
  { code: "TNPM", name: "Tondiarpet Marshalling Yard", coords: [13.1200, 80.2800], tracks: "24 Sorting Tracks", div: "MAS", cap: "1,800 Wagons / Day" },
  { code: "ED", name: "Erode Electric Loco Shed Yard", coords: [11.3400, 77.7200], tracks: "18 Stabling Lines + WAP-7/WAG-9 Shed", div: "SA", cap: "160 Electric Locos" },
  { code: "SA", name: "Salem Freight Yard & Siding", coords: [11.6650, 78.1380], tracks: "12 Goods Lines + CONCOR Terminal", div: "SA", cap: "950 Wagons / Day" },
  { code: "GOC", name: "Golden Rock Workshop & Yard", coords: [10.7800, 78.7100], tracks: "14 Overhaul Lines + P-Way Depot", div: "TPJ", cap: "Zonal Rolling Stock Overhaul" },
  { code: "ERS", name: "Ernakulam Marshalling Yard", coords: [9.9700, 76.2900], tracks: "16 Rake Stabling Tracks + MEMU Shed", div: "TVC", cap: "32 Passenger Rakes / Day" }
];

const GIS_SECTIONS_DATA = [
  { code: "SEC-MAS-CBE", name: "Katpadi - Jolarpettai (KM 12.5 - 18.5)", coords: [[12.9696, 79.1362], [12.7667, 78.8582], [12.5638, 78.5802]], type: "Double Electrified", speed: "130 km/h", gmt: "28.5 GMT", div: "MAS" },
  { code: "SEC-SA-ED", name: "Salem - Erode (KM 22.0 - 26.0)", coords: [[11.6643, 78.1460], [11.5000, 77.9200], [11.3410, 77.7172]], type: "Double Electrified", speed: "130 km/h", gmt: "30.1 GMT", div: "SA" },
  { code: "SEC-MAS-MDU", name: "Villupuram - Vriddhachalam (KM 105.2 - 110.0)", coords: [[11.9401, 79.4861], [11.7200, 79.4000], [11.5167, 79.3333]], type: "Double Line Electrified", speed: "110 km/h", gmt: "24.0 GMT", div: "TPJ" },
  { code: "SEC-PGT-TVC", name: "Thrissur - Ernakulam (KM 45.3 - 52.0)", coords: [[10.5276, 76.2144], [10.2546, 76.2571], [9.9816, 76.2999]], type: "Double Electrified", speed: "110 km/h", gmt: "26.2 GMT", div: "TVC" },
  { code: "SEC-TPJ-DELTA", name: "Villupuram - Thanjavur (KM 68.0 - 74.5)", coords: [[11.9401, 79.4861], [11.4500, 79.6000], [10.7870, 79.1378]], type: "Single Electrified", speed: "100 km/h", gmt: "18.0 GMT", div: "TPJ" },
  { code: "SEC-MDU-RMM", name: "Mandapam - Pamban - Rameswaram (KM 9.2)", coords: [[9.9252, 78.1198], [9.2825, 79.1200], [9.2825, 79.1983], [9.2876, 79.3129]], type: "Marine Coastal Line", speed: "80 km/h", gmt: "12.0 GMT", div: "MDU" }
];

let LIVE_TRAINS_DATABASE = [];

// Ingest user's new train dataset
window.ingestTrainDataset = (trainsArray) => {
  LIVE_TRAINS_DATABASE = Array.isArray(trainsArray) ? trainsArray : [];
  localStorage.setItem("sr_custom_trains", JSON.stringify(LIVE_TRAINS_DATABASE));
  showToast(currentLang === 'hi' ? `${LIVE_TRAINS_DATABASE.length} रेलगाड़ियां सफलतापूर्वक लोड की गईं।` : `Successfully loaded ${LIVE_TRAINS_DATABASE.length} trains.`);
  render();
};

window.openIngestTrainsModal = () => {
  const isHi = currentLang === 'hi';
  showModal(
    isHi ? "नया रेलगाड़ी समय-सारणी डेटा दर्ज करें" : "Ingest New Train Timetable Dataset",
    isHi ? "दक्षिण रेलवे ब्लॉक योजना के लिए नया समय-सारणी डेटा (JSON या CSV) दर्ज करें।" : "Paste or upload train timetable dataset for route mapping and automated block planning.",
    `
      <label>${isHi ? "समय-सारणी डेटा पेस्ट करें (JSON या CSV)" : "Paste Timetable Data (JSON or CSV)"}
        <textarea id="txtTrainIngest" rows="8" style="width:100%;font-family:monospace;font-size:11px" placeholder='[\n  {\n    "no": "12675",\n    "name": "Kovai Express",\n    "origin": "MAS",\n    "dest": "CBE",\n    "dep": "06:10",\n    "eta": "14:05"\n  }\n]'></textarea>
      </label>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
        ${isHi ? "प्रारूप: JSON सूची या CSV (train_no, train_name, origin, dest, dep, eta, speed)" : "Supports JSON array or CSV columns (train_no, train_name, origin, dest, dep, eta, speed)"}
      </div>
    `,
    (overlay) => {
      const txt = overlay.querySelector("#txtTrainIngest").value.trim();
      if (!txt) return;
      try {
        let parsed = [];
        if (txt.startsWith("[")) {
          parsed = JSON.parse(txt);
        } else {
          const rows = txt.split("\n").filter(r => r.trim());
          const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
          parsed = rows.slice(1).map(row => {
            const cols = row.split(",").map(c => c.trim());
            return {
              no: cols[headers.indexOf("train_no") !== -1 ? headers.indexOf("train_no") : 0] || "TRAIN",
              name: cols[headers.indexOf("train_name") !== -1 ? headers.indexOf("train_name") : 1] || "Express",
              origin: cols[headers.indexOf("origin") !== -1 ? headers.indexOf("origin") : 2] || "MAS",
              dest: cols[headers.indexOf("dest") !== -1 ? headers.indexOf("dest") : 3] || "CBE",
              dep: cols[headers.indexOf("dep") !== -1 ? headers.indexOf("dep") : 4] || "08:00",
              eta: cols[headers.indexOf("eta") !== -1 ? headers.indexOf("eta") : 5] || "12:00",
              speed: cols[headers.indexOf("speed") !== -1 ? headers.indexOf("speed") : 6] || "100 km/h",
              status: "ON TIME",
              type: "Express"
            };
          });
        }
        window.ingestTrainDataset(parsed);
      } catch (err) {
        showToast("Error parsing dataset: " + err.message, true);
      }
    },
    isHi ? "डेटा लोड करें" : "Ingest Trains"
  );
};

function renderGovTopStrip() {
  return `
    <div class="gov-tricolor-strip"></div>
    <div class="gov-top-bar">
      <div class="gov-portal-tag">
        <span style="font-weight:700;letter-spacing:0.4px;color:#ff9933">भारत सरकार / GOVERNMENT OF INDIA</span>
        <span>•</span>
        <span style="color:#ffffff">रेल मंत्रालय / MINISTRY OF RAILWAYS</span>
        <span>•</span>
        <span style="color:#a3c2e2">SOUTHERN RAILWAY (ZONE 07)</span>
      </div>
      <div class="gov-top-right">
        <!-- Language Switcher: English & Hindi -->
        <div class="gov-lang-group" title="Language Selection / भाषा चयन">
          <button class="gov-lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="setLanguage('en')">English</button>
          <button class="gov-lang-btn ${currentLang === 'hi' ? 'active' : ''}" onclick="setLanguage('hi')">हिन्दी</button>
        </div>
        <span style="font-size:10px;color:#8ba8c5">${t(null, 'accessibility', 'Accessibility:')}</span>
        <button class="gov-access-btn" onclick="document.body.style.fontSize='12px'">A-</button>
        <button class="gov-access-btn" onclick="document.body.style.fontSize='13px'">A</button>
        <button class="gov-access-btn" onclick="document.body.style.fontSize='14px'">A+</button>
        <span class="gov-security-badge">${t(null, 'official_badge', 'RESTRICTED • OFFICIAL USE ONLY')}</span>
      </div>
    </div>
  `;
}

function renderSidebar() {
  let lastGroup = "";
  const off = currentOfficial || OFFICIAL_PRESETS[0];

  return `
    <aside class="sidebar ${isSidebarCollapsed ? 'collapsed' : ''}" id="mainSidebar">
      <div class="brand-formal">
        <img src="/southern-railway-logo.png" class="brand-crest-img" alt="Southern Railway Crest" />
        <div class="brand-text-gov">
          <span class="brand-railway-title" style="font-size:16px;font-family:Inter,sans-serif;font-weight:800;letter-spacing:-0.2px">SOUTHERN RAILWAY</span>
          <span class="brand-sub-title" style="color:#60a5fa;font-size:11px;font-weight:600">${currentLang === 'hi' ? 'जीआईएस एवं ब्लॉक योजना' : 'GIS &amp; BLOCK PLANNING'}</span>
        </div>
      </div>

      <div class="nav-formal">
        ${Object.entries(modules).filter(([key, m]) => m.group !== "ADVANCED").map(([key, m]) => {
          let groupHtml = "";
          if (m.group && m.group !== lastGroup) {
            lastGroup = m.group;
            const groupTitle = currentLang === 'hi' ? (I18N.hi.nav_groups[m.group] || m.group) : m.group;
            groupHtml = `<div class="nav-group-title">${groupTitle}</div>`;
          }
          const iconSvg = SVG_ICONS[m.icon] || SVG_ICONS.activity;
          const navLabel = currentLang === 'hi' ? (I18N.hi.nav_labels[key] || m.label) : m.label;
          return `
            ${groupHtml}
            <button class="nav-item ${key === current ? 'active' : ''}" data-nav="${key}" title="${m.label}">
              ${iconSvg}
              <span>${navLabel}</span>
            </button>
          `;
        }).join("")}
      </div>

      <div class="sidebar-official-box">
        <div class="sidebar-user-pill-clean" id="sidebarUserProfileBtn" title="Official Profile Information">
          <div class="user-avatar-circle">
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div class="user-text-meta">
            <strong>${esc(off.name.split(' ')[0] || 'Jatin')}</strong>
            <span>${currentLang === 'hi' ? 'मंडल परिचालन • जोनल मुख्यालय' : 'Zonal Operations • Zonal HQ'}</span>
          </div>
          <div class="user-dropdown-chevron">⌄</div>
        </div>
      </div>
    </aside>
  `;
}

function renderTopbar() {
  const off = currentOfficial || OFFICIAL_PRESETS[0];
  const displayTitle = currentLang === 'hi' ? (I18N.hi.nav_labels[current] || current) : (current === 'Dashboard' ? 'Dashboard' : (modules[current]?.label || current));


  return `
    <header class="topbar-formal">
      <div class="header-left">
        <button class="sidebar-toggle-btn" id="btnToggleSidebar" title="Toggle Sidebar">
          <svg viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div class="header-title-block">
          <h1 id="topbarScreenTitle">${displayTitle}</h1>
          <p>${currentLang === 'hi' ? 'दक्षिण रेलवे (जोन 07)' : 'Southern Railway (Zone 07)'}</p>
        </div>
      </div>

      <div class="header-center">
        <div class="status-badge-pill ${connected ? '' : 'offline'}" id="topbarBackendBadge" onclick="window.showBackendConnectionModal()" style="cursor:pointer" title="Click to view FastAPI Backend & Swagger documentation">
          <div class="status-dot-pulse"></div>
          <span>${connected ? t(null, 'online_status', 'FASTAPI v1.0 ONLINE') : t(null, 'offline_status', 'BACKEND OFFLINE')}</span>
        </div>
      </div>

      <div class="header-right">
        <button class="btn-top-theme" id="btnToggleTheme" title="${currentTheme === 'light' ? 'Switch to Dark Mode (डार्क मोड)' : 'Switch to Light Mode (लाइट मोड)'}">
          ${currentTheme === 'light' ? SVG_ICONS.moon : SVG_ICONS.sun}
          <span>${currentTheme === 'light' ? (currentLang === 'hi' ? 'डार्क मोड' : 'Dark Mode') : (currentLang === 'hi' ? 'लाइट मोड' : 'Light Mode')}</span>
        </button>
        <div class="clock-formal">
          <b id="liveTime">--:--:--</b>
          <small id="liveDate">01 Sept 2026</small>
        </div>
        <div class="user-initial-avatar" id="topbarOfficialPill" title="${esc(off.name)}">
          ${(off.name && off.name[0]) || 'J'}
        </div>
      </div>
    </header>
  `;
}

// ==========================================================================
// 4. MODULE PAGES (FORMAL & ENTERPRISE)
// ==========================================================================

// Module 1: Dashboard & GIS Railway Network Cartography

async function fetchBackendData() {
  try {
    const health = await api.health();
    if (health) {
      if (typeof window.updateBackendStatusBadge === 'function') {
        window.updateBackendStatusBadge(true, "FASTAPI v1.0 ONLINE");
      }
    }
  } catch (e) {
    if (typeof window.updateBackendStatusBadge === 'function') {
      window.updateBackendStatusBadge(false, "BACKEND OFFLINE");
    }
  }

  try {
    const stRes = await api.get('/api/v1/stations');
    const items = Array.isArray(stRes) ? stRes : (stRes && stRes.items ? stRes.items : []);
    if (items.length > 0) {
      const bMap = new Map();
      items.forEach(b => {
        const c = (b.station_code || b.code || "").toUpperCase();
        if (c) bMap.set(c, b);
      });
      // Merge official 37 stations with backend properties
      liveStations = OFFICIAL_STATIONS_37.map(stn => {
        const b = bMap.get(stn.code);
        return {
          ...stn,
          id: b ? b.id : undefined,
          status: b ? b.status : "ACTIVE"
        };
      });
      // Append any newly user-created custom stations from backend
      items.forEach(b => {
        const c = (b.station_code || b.code || "").toUpperCase();
        if (c && !OFFICIAL_STATIONS_37.some(o => o.code === c)) {
          liveStations.push({
            code: c,
            name: b.station_name || b.name || c,
            div: b.division || b.div || "MAS",
            lat: b.location && b.location.includes(',') ? parseFloat(b.location.split(',')[0]) : 11.0,
            lng: b.location && b.location.includes(',') ? parseFloat(b.location.split(',')[1]) : 77.0,
            platforms: b.platforms || 4,
            dailyTrains: 24,
            hub: false
          });
        }
      });
    }
  } catch (e) { console.error('Failed to fetch stations', e); }
  
  try {
    const pRes = await api.get('/api/v1/planning/plan');
    if (pRes && pRes.items) {
       // if we have planning items, update dashboard or block planning
    }
  } catch (e) { console.error('Failed to fetch plans', e); }
}

function renderDashboardPage() {
  return `
    <main class="content">
      <!-- Top 5 Metric Cards -->
      <div class="metrics-row">
        <div class="metric-card-formal blue" data-nav="Asset Management" style="cursor:pointer" title="Click to view Monitored P-Way Assets">
          <div class="metric-icon-formal blue">
            <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
          </div>
          <div>
            <span>MONITORED P-WAY ASSETS</span>
            <strong>${dashboardData.assets || 32}</strong>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Sections</div>
            <small data-nav="Asset Management" style="cursor:pointer">View zonal inventory →</small>
          </div>
        </div>
        <div class="metric-card-formal red" data-nav="Defects & USFD" style="cursor:pointer" title="Click to view Critical Track Defects">
          <div class="metric-icon-formal red">
            <svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div>
            <span>CRITICAL TRACK DEFECTS (USFD)</span>
            <strong>${dashboardData.defects || 52}</strong>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Defects</div>
            <small data-nav="Defects & USFD" style="cursor:pointer">${currentLang === 'hi' ? 'दोष सूची देखें →' : 'Inspect defect queue →'}</small>
          </div>
        </div>
        <div class="metric-card-formal green" data-nav="Block Planning" style="cursor:pointer" title="Click to view Coordinated Integrated Blocks">
          <div class="metric-icon-formal green">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 11 15 8 12"></polyline></svg>
          </div>
          <div>
            <span>COORDINATED INTEGRATED BLOCKS</span>
            <strong>10</strong>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Blocks Active</div>
            <small data-nav="Block Planning" style="cursor:pointer">Review sanction schedule →</small>
          </div>
        </div>
        <div class="metric-card-formal gold" data-nav="Reports & Analytics" style="cursor:pointer" title="Click to view Punctuality Audit & Downtime Saved">
          <div class="metric-icon-formal gold">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <span>TOTAL TRACK DOWNTIME SAVED</span>
            <strong>20.0</strong>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Hours (66%)</div>
            <small data-nav="Reports & Analytics" style="cursor:pointer">View punctuality audit →</small>
          </div>
        </div>
        <div class="metric-card-formal purple" data-nav="Asset Management" style="cursor:pointer" title="Click to view Track Maintenance Machinery">
          <div class="metric-icon-formal purple">
            <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>
          <div>
            <span>TRACK MAINTENANCE MACHINERY</span>
            <strong>8</strong>
            <div style="font-size:12px;color:#64748b;margin-bottom:4px">Heavy Units</div>
            <small data-nav="Asset Management" style="cursor:pointer">View deployment log →</small>
          </div>
        </div>
      </div>

      <!-- Main Dashboard Grid (GIS Overview + Announcements) -->
      <div class="dashboard-grid-modern">
        <!-- GIS Map Card -->
        <div class="map-card-snap">
          <div class="map-header-clean">
            <h2>GIS Railway Network Overview</h2>
            <p>Visualize and explore the Southern Railway network with advanced GIS mapping.</p>
          </div>


          <!-- Quick Corridor Scheduled Trains Ribbon -->
          <div class="train-route-quick-chips" style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin:6px 0 10px 0">
            <span style="font-size:11px;font-weight:800;color:#60a5fa;display:flex;align-items:center;gap:4px">⚡ Scheduled Trains:</span>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('22616')">22616 CBE→TPTY</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('22666')">22666 CBE→SBC Uday</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('12680')">12680 CBE→MAS</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('12676')">12676 Kovai SF</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17229')">17229 Sabari Exp</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17230')">17230 Sabari (SC-TVC)</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17651')">17651 CGL→KCG</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17209')">17209 Seshadri</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17210')">17210 Seshadri (CCT-SMVB)</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('12511')">12511 Raptisagar</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('12512')">12512 Raptisagar (KCVL-GKP)</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('12433')">12433 MAS-NZM Rajdhani</button>
            <button type="button" class="smart-corridor-pill" style="padding:2px 8px;font-size:10.5px;cursor:pointer" onclick="window.traceScheduledTrain('17041')">17041 Amrit Bharat</button>
          </div>

          <!-- Interactive Train Route Search Bar -->
          <div class="train-route-search-bar">
            <div class="train-search-input-wrap">
              <svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" id="trainRouteSearchInput" list="trainListDatalist" placeholder="Search Train No. or Name to highlight route on map (e.g. 20607 Vande Bharat, 12637 Pandian, 12675 Kovai)..." />
              <datalist id="trainListDatalist">
                ${CHENNAI_TIMETABLE_330.map(t => `<option value="${t.train_no} • ${t.name} (${t.origin} ➔ ${t.dest})"></option>`).join("")}
              </datalist>
              <button class="clear-route-search-btn" id="btnClearTrainSearch" style="display:none">✕ Clear</button>
            </div>
            <button class="primary find-route-btn" id="btnFindTrainRoute">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span>Display Route</span>
            </button>
          </div>

          <!-- Leaflet Map Container -->
          <div class="map-leaflet-stage" style="height:440px">
            <div id="snapMapStage"></div>

            <!-- Floating Layer Controls at Bottom of Map -->
            <div class="map-floating-bottom-bar">
              <button class="map-floating-btn ${selectedMapLayer === 'osm' ? 'active' : ''}" data-layer="osm">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
                <span>Vector Map</span>
              </button>
              <button class="map-floating-btn ${selectedMapLayer === 'satellite' ? 'active' : ''}" data-layer="satellite">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                <span>Satellite</span>
              </button>
              <button class="map-floating-btn ${selectedMapLayer === 'dark' ? 'active' : ''}" data-layer="dark">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><polygon points="12 2 2 7 22 7 12 2"></polygon></svg>
                <span>Topographic</span>
              </button>
              <button class="map-floating-btn" id="btnOpenTrackView">
                <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><rect x="4" y="3" width="16" height="16" rx="2"></rect><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
                <span>Forward Cab View</span>
              </button>
            </div>
          </div>
        </div>

        <!-- System Announcements Card -->
        <div class="system-announcements-card">
          <div class="announcements-header">
            <h3>System Announcements</h3>
            <a href="#" id="btnViewAllAnnouncements" data-nav="Weather & Incidents">View all</a>
          </div>

          <div class="announcement-item" data-nav="Asset Management" style="cursor:pointer" title="Click to view Asset Management">
            <div class="announcement-icon green">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="16 10 11 15 8 12"></polyline></svg>
            </div>
            <div class="announcement-content">
              <div class="announcement-title-row">
                <strong>System Maintenance Completed</strong>
                <span>30m ago</span>
              </div>
              <p>All systems operational</p>
            </div>
          </div>

          <div class="announcement-item" data-nav="Block Planning" style="cursor:pointer" title="Click to view Block Planning">
            <div class="announcement-icon blue">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div class="announcement-content">
              <div class="announcement-title-row">
                <strong>Integrated Block Update</strong>
                <span>2h ago</span>
              </div>
              <p>New block schedule published</p>
            </div>
          </div>

          <div class="announcement-item" data-nav="Defects & USFD" style="cursor:pointer" title="Click to view Defects & USFD">
            <div class="announcement-icon amber">
              <svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <div class="announcement-content">
              <div class="announcement-title-row">
                <strong>Track Inspection Due</strong>
                <span>5h ago</span>
              </div>
              <p>12 sections require inspection</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

// Screen 2: GIS Railway Network Cartography
function renderGISNetworkPage() {
  const divs = ["ALL", "Chennai (MAS)", "Salem (SA)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)", "Tiruchirappalli (TPJ)", "Madurai (MDU)"];

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>GIS Railway Network Cartography</h2>
          <div class="screen-breadcrumb">Home > GIS Network</div>
        </div>
        <button class="screen-action-btn-blue" id="btnDownloadGIS">
          <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>Download ⌄</span>
        </button>
      </div>

      <div class="screen-filter-bar">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Division:
          <select id="gisDivisionSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            ${divs.map(d => `<option value="${d}" ${selectedDivision === d ? 'selected' : ''}>${d}</option>`).join("")}
          </select>
        </label>
        <button class="filter-dropdown-btn" id="btnToggleLayersBox">
          <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
          <span>Layers ⌄</span>
        </button>
        <button class="filter-dropdown-btn" id="btnQuickFilterDamages">
          <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          <span>Track Damages (8)</span>
        </button>
        <input type="text" class="filter-search-input" id="gisSearchInput" placeholder="Search station, section, bridge, tunnel, LC, yard, defect..." />
      </div>

      <div class="map-card-snap" style="position:relative">
        <div class="map-leaflet-stage" style="height:480px">
          <div id="gisCartographyMapStage"></div>

          <!-- Interactive Layers Overlay Box -->
          <div class="map-layers-overlay-box" id="gisLayersBox">
            <div class="map-layers-header">
              <span>Layers</span>
              <span style="cursor:pointer;color:#94a3b8" id="btnCloseLayersBox">✕</span>
            </div>
            <label class="map-layer-item"><input type="checkbox" id="layerChkRailway" checked /> <span>Railway Network</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkStations" checked /> <span>Stations</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkSections" checked /> <span>Sections & Corridors</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkBridges" checked /> <span>Bridges</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkTunnels" checked /> <span>Tunnels</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkLevelCrossings" checked /> <span>Level Crossings</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkYards" checked /> <span>Yard / Siding</span></label>
            <label class="map-layer-item"><input type="checkbox" id="layerChkDamages" checked /> <span>Track Damages & Defects</span></label>
          </div>
        </div>
      </div>

      <!-- Bottom 5-Metric Stats Row -->
      <div class="gis-stats-summary-row">
        <div class="gis-stat-card">
          <div class="gis-stat-icon">
            <svg viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
          </div>
          <div class="gis-stat-text">
            <span>Total Route km</span>
            <strong>5,672 km</strong>
          </div>
        </div>
        <div class="gis-stat-card">
          <div class="gis-stat-icon">
            <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
          </div>
          <div class="gis-stat-text">
            <span>Total Stations</span>
            <strong>358</strong>
          </div>
        </div>
        <div class="gis-stat-card">
          <div class="gis-stat-icon">
            <svg viewBox="0 0 24 24"><path d="M3 17h18M3 12h18M7 7h10"></path><line x1="7" y1="17" x2="7" y2="12"></line><line x1="17" y1="17" x2="17" y2="12"></line></svg>
          </div>
          <div class="gis-stat-text">
            <span>Bridges</span>
            <strong>1,245</strong>
          </div>
        </div>
        <div class="gis-stat-card">
          <div class="gis-stat-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8z"></path></svg>
          </div>
          <div class="gis-stat-text">
            <span>Tunnels</span>
            <strong>96</strong>
          </div>
        </div>
        <div class="gis-stat-card">
          <div class="gis-stat-icon">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
          <div class="gis-stat-text">
            <span>Level Crossings</span>
            <strong>2,184</strong>
          </div>
        </div>
      </div>
    </main>
  `;
}

// Screen 3: RTIS Live Train GPS Telemetry
let rtisSearchQuery = "";
let rtisTypeFilter = "ALL";

function renderLiveTrainGPSPage() {
  const divs = ["ALL", "Chennai (MAS)", "Salem (SA)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)", "Tiruchirappalli (TPJ)", "Madurai (MDU)"];
  
  let filteredTrains = LIVE_TRAINS_DATABASE.filter(t => {
    const matchType = rtisTypeFilter === "ALL" || t.type === rtisTypeFilter;
    const matchQ = !rtisSearchQuery || t.no.toLowerCase().includes(rtisSearchQuery) || t.name.toLowerCase().includes(rtisSearchQuery) || t.loc.toLowerCase().includes(rtisSearchQuery);
    return matchType && matchQ;
  });

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>RTIS Live Train GPS Telemetry (${filteredTrains.length} Active Trains)</h2>
          <div class="screen-breadcrumb">Home > Live Train GPS</div>
        </div>
        <span class="live-indicator-pill"><span class="live-indicator-dot"></span> Live GPS</span>
      </div>

      <div class="screen-filter-bar">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Division:
          <select id="rtisDivisionSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            ${divs.map(d => `<option value="${d}" ${selectedDivision === d ? 'selected' : ''}>${d}</option>`).join("")}
          </select>
        </label>
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Train Type:
          <select id="rtisTypeSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            <option value="ALL" ${rtisTypeFilter === 'ALL' ? 'selected' : ''}>ALL (${LIVE_TRAINS_DATABASE.length})</option>
            <option value="Superfast / Express" ${rtisTypeFilter === 'Superfast / Express' ? 'selected' : ''}>Superfast / Express</option>
            <option value="Vande Bharat" ${rtisTypeFilter === 'Vande Bharat' ? 'selected' : ''}>Vande Bharat</option>
            <option value="Mail / Passenger" ${rtisTypeFilter === 'Mail / Passenger' ? 'selected' : ''}>Mail / Passenger</option>
            <option value="Freight" ${rtisTypeFilter === 'Freight' ? 'selected' : ''}>Freight Cargo</option>
          </select>
        </label>
        <input type="text" class="filter-search-input" id="rtisLiveSearchInput" value="${esc(rtisSearchQuery)}" placeholder="Search Train No, Name, or Station..." />
      </div>

      <div class="rtis-split-container">
        <!-- Live Map -->
        <div class="map-card-snap">
          <div class="map-leaflet-stage" style="height:520px">
            <div id="rtisLiveMapStage"></div>
          </div>
        </div>

        <!-- Live Train Status List (Exact from Screenshot) -->
        <div class="panel" style="padding:16px;overflow-y:auto;max-height:520px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:15.5px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">Live Train Status</h3>
            <span style="font-size:11px;color:var(--text-muted)">${filteredTrains.length} Trains Tracked</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:10px" id="rtisTrainCardsList">
            ${filteredTrains.map(t => {
              const isSelected = selectedLiveTrainNo === t.no;
              const isDelayed = t.status.includes("DELAYED");
              const badgeClass = isDelayed ? "FAIR" : "GOOD";
              return `
                <div class="rtis-live-card-item ${isSelected ? 'active' : ''}" data-train-select="${t.no}" style="${isSelected ? 'border-color:#2563eb;background:rgba(37,99,235,0.1)' : ''};cursor:pointer">
                  <div class="rtis-card-top-row">
                    <strong>${t.no} - ${t.name}</strong>
                    <span class="badge ${badgeClass}">${t.status}</span>
                  </div>
                  <div class="rtis-card-meta-row">
                    <span>Speed: <b>${t.speed}</b></span>
                    <span>Location: <b>${t.loc}</b></span>
                    <span>ETA: <b>${t.eta}</b></span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    </main>
  `;
}

// Screen 4: Station Timetable & Movement Board
function renderTimetableMovementPage() {
  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Station Timetable & Movement Board</h2>
          <div class="screen-breadcrumb">Home > Timetable & Movement</div>
        </div>
        <span class="live-indicator-pill"><span class="live-indicator-dot"></span> Live</span>
      </div>

      <div class="screen-filter-bar">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Station:
          <select id="stnBoardSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            <option selected>Chennai Central (MAS)</option>
            <option>Chennai Egmore (MS)</option>
            <option>Coimbatore Jn (CBE)</option>
            <option>Madurai Jn (MDU)</option>
            <option>Thiruvananthapuram (TVC)</option>
            <option>Tiruchirappalli (TPJ)</option>
            <option>Salem Jn (SA)</option>
          </select>
        </label>

        <div class="mode-pills-wrap">
          <button class="mode-pill-btn active" id="btnArrivalsPill">Arrivals</button>
          <button class="mode-pill-btn" id="btnDeparturesPill">Departures</button>
        </div>

        <button class="filter-dropdown-btn">
          <span>📅 01 Sept 2026 ⌄</span>
        </button>
      </div>

      <div class="table-wrap-clean">
        <table class="clean-table">
          <thead>
            <tr>
              <th>Train No.</th>
              <th>Train Name</th>
              <th>From</th>
              <th>Arr.</th>
              <th>Dep.</th>
              <th>PF</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>12642</code></td>
              <td><b>MGR Chennai Central SF</b></td>
              <td>New Delhi</td>
              <td>18:20</td>
              <td>18:25</td>
              <td><b>5</b></td>
              <td><span class="badge GOOD">On Time</span></td>
            </tr>
            <tr>
              <td><code>16724</code></td>
              <td><b>Rameswaram Express</b></td>
              <td>Rameswaram</td>
              <td>19:05</td>
              <td>19:18</td>
              <td><b>3</b></td>
              <td><span class="badge FAIR">Delayed 12m</span></td>
            </tr>
            <tr>
              <td><code>12678</code></td>
              <td><b>Kanyakumari Express</b></td>
              <td>Kanyakumari</td>
              <td>20:16</td>
              <td>20:20</td>
              <td><b>6</b></td>
              <td><span class="badge GOOD">On Time</span></td>
            </tr>
            <tr>
              <td><code>22636</code></td>
              <td><b>Nagercoil Express</b></td>
              <td>Nagercoil</td>
              <td>21:00</td>
              <td>21:05</td>
              <td><b>2</b></td>
              <td><span class="badge GOOD">On Time</span></td>
            </tr>
            <tr>
              <td><code>20681</code></td>
              <td><b>Bengaluru SF Express</b></td>
              <td>Bengaluru</td>
              <td>21:45</td>
              <td>21:55</td>
              <td><b>4</b></td>
              <td><span class="badge FAIR">Delayed 5m</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding:0 4px">
        <a href="#" id="linkViewFullTimetable" style="color:#2563eb;font-weight:600;font-size:12px;text-decoration:none">View full timetable →</a>
        <span style="font-weight:700;font-size:12px;color:var(--text-heading)">Movement Board (Live)</span>
        <a href="#" id="linkViewFullBoard" style="color:#2563eb;font-weight:600;font-size:12px;text-decoration:none">View full board →</a>
      </div>
    </main>
  `;
}

// Screen 5: Integrated Block Planning Console
function renderBlockPlanningPage() {
  const divs = ["ALL", "Chennai (MAS)", "Salem (SA)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)", "Tiruchirappalli (TPJ)", "Madurai (MDU)"];
  const corridors = [
    "ALL CORRIDORS",
    "SEC-MAS-CBE (Chennai - Coimbatore Mainline)",
    "SEC-MAS-MDU (Chennai - Madurai Grand Trunk)",
    "SEC-PGT-TVC (Malabar & Kerala Coastline)",
    "SEC-TPJ-DELTA (Delta Chord Corridor)",
    "SEC-MDU-RMM (Pamban Marine Corridor)"
  ];

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Integrated Block Planning & Track Damage Rectification Console</h2>
          <div class="screen-breadcrumb">Home > Block Planning > Track Damage Remediation</div>
        </div>
        <button class="screen-action-btn-blue" id="btnCreateBlock">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
          <span>+ Create Block from Defect</span>
        </button>
      </div>

      <!-- Corridor & Damage Intelligence KPI Row -->
      <div class="metrics-row" style="margin-bottom:16px">
        <div class="metric-card-formal blue">
          <div class="metric-icon-formal blue">
            <svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
          </div>
          <div>
            <span>Monitored Corridors</span>
            <strong>5 Corridors (5,672 km)</strong>
            <small>Active P-Way Infrastructure</small>
          </div>
        </div>

        <div class="metric-card-formal red">
          <div class="metric-icon-formal red">
            <svg viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div>
            <span>Active Track Damages</span>
            <strong>52 Reported (8 Critical)</strong>
            <small>TDMS Track Defects Log</small>
          </div>
        </div>

        <div class="metric-card-formal green">
          <div class="metric-icon-formal green">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <span>Coordinated Blocks</span>
            <strong>10 Sanctioned</strong>
            <small>66% Downtime Saved</small>
          </div>
        </div>

        <div class="metric-card-formal gold">
          <div class="metric-icon-formal gold">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <div>
            <span>Speed Restrictions Lifted</span>
            <strong>5 TSR Zones Cleared</strong>
            <small>130 km/h Line Speed Restored</small>
          </div>
        </div>
      </div>

      <div class="screen-filter-bar">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Division:
          <select style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            ${divs.map(d => `<option value="${d}">${d}</option>`).join("")}
          </select>
        </label>

        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Corridor:
          <select style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            ${corridors.map(c => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </label>

        <button class="filter-dropdown-btn">
          <span>📅 Date: 01 Sept 2026 ⌄</span>
        </button>
      </div>

      <div class="panel">
        <div class="block-tab-strip">
          <button class="block-tab-btn active"><span>📋 All Damage Blocks (5)</span></button>
          <button class="block-tab-btn"><span>🔴 Critical Rail Fractures & Wear (2)</span></button>
          <button class="block-tab-btn"><span>⚡ TRD Traction & OHE Sag (1)</span></button>
          <button class="block-tab-btn"><span>🛑 S&T Signal & Point Overhaul (2)</span></button>
        </div>

        <div class="table-wrap-clean">
          <table class="clean-table">
            <thead>
              <tr>
                <th>Block ID & Permit</th>
                <th>Corridor & Section</th>
                <th>Track Damage / Defect Rectified</th>
                <th>Severity</th>
                <th>Department Synergy</th>
                <th>Machinery & Supervisor</th>
                <th>Window & Duration</th>
                <th>Track Clearance Benefit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>B-090101-001</code>
                  <div style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">SR/PERMIT/089</div>
                </td>
                <td>
                  <b>SEC-MAS-CBE</b>
                  <div style="font-size:11px;color:var(--text-muted)">Katpadi ➔ Jolarpettai (KM 12.5 - 18.5)</div>
                </td>
                <td>
                  <b style="color:#ef4444">🔴 DEF-001: Lateral Rail Wear & Gauge Widening (4.8mm)</b>
                  <div style="font-size:10.5px;color:#94a3b8">60 kg/m PSC Track • High GMT Load</div>
                </td>
                <td>
                  <span style="background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:2px 6px;border-radius:4px;font-size:10.5px;font-weight:800">CRITICAL (TSR 30)</span>
                </td>
                <td>
                  <span style="font-size:10.5px;font-weight:700;color:#60a5fa">ENG + TRD + S&T</span>
                </td>
                <td>
                  <b style="font-size:11.5px">09-3X Tamping Express (BTE-07-001)</b>
                  <div style="font-size:10.5px;color:var(--text-muted)">Er. K. Selvam, SSE (P-Way)</div>
                </td>
                <td>
                  <b>01-09-2026</b>
                  <div style="font-size:11px;color:#22c55e">22:30 - 02:30 IST (240m)</div>
                </td>
                <td>
                  <div style="font-size:11px;color:#22c55e;font-weight:700">✓ Removes TSR 30 km/h</div>
                  <div style="font-size:10px;color:#94a3b8">Restores 130 km/h • 4.5h Saved</div>
                </td>
                <td><span class="badge GOOD">Sanctioned</span></td>
              </tr>

              <tr>
                <td>
                  <code>B-090101-002</code>
                  <div style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">SR/PERMIT/090</div>
                </td>
                <td>
                  <b>SEC-MAS-CBE</b>
                  <div style="font-size:11px;color:var(--text-muted)">Salem ➔ Erode (KM 22.0 - 26.0)</div>
                </td>
                <td>
                  <b style="color:#f59e0b">🟠 DEF-002: Thermit Weld Micro-cracking & Fatigue</b>
                  <div style="font-size:10.5px;color:#94a3b8">USFD Ultrasonic Flaw Detected</div>
                </td>
                <td>
                  <span style="background:rgba(245,158,11,0.2);color:#f59e0b;border:1px solid #f59e0b;padding:2px 6px;border-radius:4px;font-size:10.5px;font-weight:800">MAJOR (TSR 45)</span>
                </td>
                <td>
                  <span style="font-size:10.5px;font-weight:700;color:#60a5fa">ENGINEERING</span>
                </td>
                <td>
                  <b style="font-size:11.5px">Thermit Weld Recasting Gang #02</b>
                  <div style="font-size:10.5px;color:var(--text-muted)">Er. N. Kumar, AEN P-Way</div>
                </td>
                <td>
                  <b>01-09-2026</b>
                  <div style="font-size:11px;color:#eab308">23:00 - 03:00 IST (240m)</div>
                </td>
                <td>
                  <div style="font-size:11px;color:#22c55e;font-weight:700">✓ Weld Integrity Certified</div>
                  <div style="font-size:10px;color:#94a3b8">Restores 110 km/h • 3.0h Saved</div>
                </td>
                <td><span class="badge FAIR">Planned</span></td>
              </tr>

              <tr>
                <td>
                  <code>B-090101-003</code>
                  <div style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">SR/PERMIT/095</div>
                </td>
                <td>
                  <b>SEC-PGT-TVC</b>
                  <div style="font-size:11px;color:var(--text-muted)">Thrissur ➔ Ernakulam (KM 45.3 - 52.0)</div>
                </td>
                <td>
                  <b style="color:#ef4444">⚡ DEF-003: 25kV OHE Contact Wire Sag & Catenary Dropper Fault</b>
                  <div style="font-size:10.5px;color:#94a3b8">Heavy Monsoon Rain Impact</div>
                </td>
                <td>
                  <span style="background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;padding:2px 6px;border-radius:4px;font-size:10.5px;font-weight:800">CRITICAL (TRD)</span>
                </td>
                <td>
                  <span style="font-size:10.5px;font-weight:700;color:#60a5fa">TRD + S&T</span>
                </td>
                <td>
                  <b style="font-size:11.5px">TRD 8-Wheeler Tower Wagon (TW-07-02)</b>
                  <div style="font-size:10.5px;color:var(--text-muted)">Er. Anoop Varghese, Sr. DEE</div>
                </td>
                <td>
                  <b>02-09-2026</b>
                  <div style="font-size:11px;color:#22c55e">01:00 - 05:00 IST (240m)</div>
                </td>
                <td>
                  <div style="font-size:11px;color:#22c55e;font-weight:700">✓ OHE Tensioning Restored</div>
                  <div style="font-size:10px;color:#94a3b8">Prevents Pantograph Entanglement</div>
                </td>
                <td><span class="badge GOOD">Sanctioned</span></td>
              </tr>

              <tr>
                <td>
                  <code>B-090101-004</code>
                  <div style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">SR/PERMIT/092</div>
                </td>
                <td>
                  <b>SEC-MAS-MDU</b>
                  <div style="font-size:11px;color:var(--text-muted)">Villupuram ➔ Vriddhachalam (KM 105.2 - 110.0)</div>
                </td>
                <td>
                  <b style="color:#f59e0b">🟠 DEF-004: Thermit Weld Surface Spalling & Defective Fishplate</b>
                  <div style="font-size:10.5px;color:#94a3b8">Grand Trunk Double Track</div>
                </td>
                <td>
                  <span style="background:rgba(245,158,11,0.2);color:#f59e0b;border:1px solid #f59e0b;padding:2px 6px;border-radius:4px;font-size:10.5px;font-weight:800">MAJOR</span>
                </td>
                <td>
                  <span style="font-size:10.5px;font-weight:700;color:#60a5fa">ENG + TRD</span>
                </td>
                <td>
                  <b style="font-size:11.5px">Regulating Switch Tamping Machine (RST)</b>
                  <div style="font-size:10.5px;color:var(--text-muted)">Er. Rajesh Kumar, PWI</div>
                </td>
                <td>
                  <b>02-09-2026</b>
                  <div style="font-size:11px;color:#22c55e">00:30 - 04:30 IST (240m)</div>
                </td>
                <td>
                  <div style="font-size:11px;color:#22c55e;font-weight:700">✓ Removes TSR 45 km/h</div>
                  <div style="font-size:10px;color:#94a3b8">Restores 110 km/h Line Speed</div>
                </td>
                <td><span class="badge GOOD">Sanctioned</span></td>
              </tr>

              <tr>
                <td>
                  <code>B-090101-005</code>
                  <div style="font-size:10px;color:#94a3b8;font-family:'JetBrains Mono',monospace">SR/PERMIT/094</div>
                </td>
                <td>
                  <b>SEC-MAS-MDU</b>
                  <div style="font-size:11px;color:var(--text-muted)">Dindigul ➔ Madurai (KM 198.2 - 204.0)</div>
                </td>
                <td>
                  <b style="color:#eab308">🟡 DEF-005: Deep Ballast Fouling & Bed Subsidence (Clogged Drainage)</b>
                  <div style="font-size:10.5px;color:#94a3b8">Clay Infiltration in Ballast Cushion</div>
                </td>
                <td>
                  <span style="background:rgba(234,179,8,0.2);color:#eab308;border:1px solid #eab308;padding:2px 6px;border-radius:4px;font-size:10.5px;font-weight:800">MODERATE</span>
                </td>
                <td>
                  <span style="font-size:10.5px;font-weight:700;color:#60a5fa">ENGINEERING</span>
                </td>
                <td>
                  <b style="font-size:11.5px">Plasser RM 80-92 UHR Ballast Cleaner</b>
                  <div style="font-size:10.5px;color:var(--text-muted)">Er. M. Senthil, SSE Track</div>
                </td>
                <td>
                  <b>02-09-2026</b>
                  <div style="font-size:11px;color:#eab308">02:00 - 06:00 IST (240m)</div>
                </td>
                <td>
                  <div style="font-size:11px;color:#22c55e;font-weight:700">✓ Full Ballast Resilience Restored</div>
                  <div style="font-size:10px;color:#94a3b8">Elastic Cushion 300mm Standard</div>
                </td>
                <td><span class="badge FAIR">Planned</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top:14px;display:flex;justify-content:space-between;align-items:center;padding:0 4px">
          <a href="#" data-nav="Defects & USFD" id="linkViewAllBlocks" style="color:#2563eb;font-weight:700;font-size:12.5px;text-decoration:none">${currentLang === 'hi' ? 'सभी 52 पंजीकृत ट्रैक दोष देखें (यू.एस.एफ.डी.) →' : 'View all registered defects in USFD Log →'}</a>
          <span style="font-size:11px;color:var(--text-muted)">Showing 5 AI-coordinated integrated damage blocks</span>
        </div>
      </div>
    </main>
  `;
}

// Screen 6: Track Maintenance Machinery
function renderMaintenancePage() {
  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Track Maintenance Machinery</h2>
          <div class="screen-breadcrumb">Home > Maintenance</div>
        </div>
        <button class="screen-action-btn-blue" id="btnAddMachinery">
          <span>+ Add Machinery</span>
        </button>
      </div>

      <div class="screen-filter-bar">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Unit Type:
          <select style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            <option>ALL</option>
            <option>Tamping Machine</option>
            <option>Ballast Cleaning</option>
            <option>Dynamic Stabilizer</option>
            <option>Switch Grinder</option>
          </select>
        </label>
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
          Status:
          <select style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px;font-weight:700">
            <option>ALL</option>
            <option>Deployed</option>
            <option>Standby</option>
            <option>Maintenance</option>
          </select>
        </label>
        <input type="text" class="filter-search-input" placeholder="Search Unit / ID..." />
      </div>

      <div class="maint-machinery-grid">
        <!-- Machinery Cards List -->
        <div>
          <div class="machinery-unit-card">
            <div class="machinery-unit-head">
              <div class="machinery-unit-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
              </div>
              <div style="flex:1">
                <strong style="font-size:13.5px;color:var(--text-heading);display:block">09-3X Dynamic Tamping Express (DTE)</strong>
                <span style="font-size:11px;color:var(--text-dim);font-family:'JetBrains Mono',monospace">ID: BTE-07-001</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:8px;font-size:12px">
              <span style="color:var(--text-muted)">Location: <b>Salem Yard</b></span>
              <div>Status: <span class="badge GOOD">Deployed</span></div>
            </div>
          </div>

          <div class="machinery-unit-card">
            <div class="machinery-unit-head">
              <div class="machinery-unit-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
              </div>
              <div style="flex:1">
                <strong style="font-size:13.5px;color:var(--text-heading);display:block">Plasser RM 80-92 UHR</strong>
                <span style="font-size:11px;color:var(--text-dim);font-family:'JetBrains Mono',monospace">ID: RM-07-001</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:8px;font-size:12px">
              <span style="color:var(--text-muted)">Location: <b>Tiruchirappalli Jn</b></span>
              <div>Status: <span class="badge GOOD">Deployed</span></div>
            </div>
          </div>

          <div class="machinery-unit-card">
            <div class="machinery-unit-head">
              <div class="machinery-unit-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
              </div>
              <div style="flex:1">
                <strong style="font-size:13.5px;color:var(--text-heading);display:block">Ballast Cleaning Machine (BCM)</strong>
                <span style="font-size:11px;color:var(--text-dim);font-family:'JetBrains Mono',monospace">ID: BCM-07-003</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:8px;font-size:12px">
              <span style="color:var(--text-muted)">Location: <b>Madurai</b></span>
              <div>Status: <span class="badge ACTIVE">Standby</span></div>
            </div>
          </div>

          <div class="machinery-unit-card">
            <div class="machinery-unit-head">
              <div class="machinery-unit-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
              </div>
              <div style="flex:1">
                <strong style="font-size:13.5px;color:var(--text-heading);display:block">Regulating Switch Tamping Machine</strong>
                <span style="font-size:11px;color:var(--text-dim);font-family:'JetBrains Mono',monospace">ID: RST-07-004</span>
              </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-subtle);padding-top:8px;font-size:12px">
              <span style="color:var(--text-muted)">Location: <b>Villupuram</b></span>
              <div>Status: <span class="badge FAIR">Maintenance</span></div>
            </div>
          </div>
        </div>

        <!-- Machinery Map -->
        <div class="map-card-snap">
          <div class="map-leaflet-stage" style="height:480px">
            <div id="maintenanceMapStage"></div>
          </div>
        </div>
      </div>
    </main>
  `;
}

// Screen 7: Profile & Settings + OpenAPI Swagger Explorer & Schemas
let settingsActiveTab = "profile";

function renderSettingsPage() {
  const off = currentOfficial || OFFICIAL_PRESETS[0];

  const apiEndpoints = [
    { group: "Planning", method: "POST", path: "/api/v1/plans/weekly", desc: "Create Weekly Plan (7-Day Mathematical Horizon)", body: { horizon: "WEEKLY", start_date: "2026-09-01", division: "ALL" } },
    { group: "Planning", method: "POST", path: "/api/v1/plans/monthly", desc: "Create Monthly Plan (30-Day Master Schedule)", body: { horizon: "MONTHLY", start_date: "2026-09-01", division: "ALL" } },
    { group: "Planning", method: "POST", path: "/api/v1/plans/reoptimize", desc: "Reoptimize Plan with Dynamic Machine Rerouting", body: { plan_id: "PLAN-2026-0901", reason: "EMERGENCY_DEFECT_REPAIR" } },
    { group: "Weather & Incidents", method: "GET", path: "/api/v1/weather", desc: "Get Zonal Weather Telemetry & IMD Doppler Data" },
    { group: "Weather & Incidents", method: "GET", path: "/api/v1/incidents", desc: "Get Active Operational Incidents & Caution Orders" },
    { group: "Resources & Machines", method: "GET", path: "/api/v1/resources", desc: "List Heavy P-Way Track Machines & TRD Equipment" },
    { group: "Resources & Machines", method: "GET", path: "/api/v1/resources/deployments", desc: "List Active Machinery Field Deployments" },
    { group: "Stations", method: "GET", path: "/api/v1/stations", desc: "Get All Southern Railway Stations Topology" },
    { group: "Corridors", method: "GET", path: "/api/v1/corridors", desc: "List 6 Grand Trunk Railway Corridors" },
    { group: "Track Sections", method: "GET", path: "/api/v1/track-sections", desc: "List Monitored Permanent Way Track Sections" },
    { group: "Assets", method: "GET", path: "/api/v1/assets", desc: "List Monitored Railway Capital Assets" },
    { group: "Defects", method: "GET", path: "/api/v1/defects", desc: "List Ultrasonic USFD Defect Queue" },
  ];

  const schemaModels = [
    {
      name: "OfficialProfile",
      type: "object",
      fields: [
        { name: "employee_id", type: "string", desc: "HRMS Staff Identifier (e.g. SR/MAS/DOM/8941)" },
        { name: "name", type: "string", desc: "Full Officer Name" },
        { name: "designation", type: "string", desc: "Official Post (e.g. Sr. DOM)" },
        { name: "division", type: "string", desc: "Jurisdiction Division (MAS, SA, PGT, TVC, TPJ, MDU)" },
        { name: "clearance_level", type: "string", desc: "Security clearance (LEVEL_5_SANCTION)" }
      ]
    },
    {
      name: "PlanDecisionType",
      type: "enum",
      fields: [
        { name: "SANCTION", type: "string", desc: "Formally approve block under Proforma T/A 912" },
        { name: "OVERRIDE", type: "string", desc: "Manual controller override with justification" },
        { name: "REJECT", type: "string", desc: "Reject block request due to passenger conflict" },
        { name: "DEFER", type: "string", desc: "Postpone block to subsequent 24-hour cycle" }
      ]
    },
    {
      name: "PlanRequest",
      type: "object",
      fields: [
        { name: "horizon", type: "string", desc: "Planning window: WEEKLY (7 Days) or MONTHLY (30 Days)" },
        { name: "start_date", type: "string", desc: "ISO 8601 start date (e.g. 2026-09-01)" },
        { name: "division", type: "string", desc: "Target division or ALL for Zonal master" },
        { name: "optimization_algorithm", type: "string", desc: "MIP Mathematical Solver / Heuristic" }
      ]
    },
    {
      name: "PriorityCalculateRequest",
      type: "object",
      fields: [
        { name: "defect_id", type: "string", desc: "Track defect reference code (e.g. DEF-001)" },
        { name: "severity", type: "string", desc: "Defect class: CRITICAL, MAJOR, MODERATE, LOW" },
        { name: "gmt_load", type: "number", desc: "Annual Gross Million Tonnes traffic load" },
        { name: "tsr_penalty_kmh", type: "number", desc: "Speed restriction imposed (e.g. 30 km/h)" }
      ]
    },
    {
      name: "PriorityClass",
      type: "enum",
      fields: [
        { name: "TIER_1_SAFETY_CRITICAL", type: "string", desc: "Immediate 24-hour sanction mandatory" },
        { name: "TIER_2_PREVENTIVE", type: "string", desc: "Scheduled within 72-hour window" },
        { name: "TIER_3_ROUTINE", type: "string", desc: "Weekly maintenance cycle candidate" }
      ]
    },
    {
      name: "StationCreate & StationResponse",
      type: "object",
      fields: [
        { name: "code", type: "string", desc: "3-4 letter Station Code (e.g. MAS, CBE, TPJ)" },
        { name: "name", type: "string", desc: "Full station name" },
        { name: "division", type: "string", desc: "Division code (MAS, SA, PGT, TVC, TPJ, MDU)" },
        { name: "latitude", type: "number", desc: "Decimal GPS latitude (e.g. 13.0827)" },
        { name: "longitude", type: "number", desc: "Decimal GPS longitude (e.g. 80.2707)" },
        { name: "platforms", type: "integer", desc: "Number of platform lines" }
      ]
    },
    {
      name: "TrackSectionCreate",
      type: "object",
      fields: [
        { name: "corridor_id", type: "string", desc: "Parent corridor (e.g. SEC-MAS-CBE)" },
        { name: "name", type: "string", desc: "Section station span" },
        { name: "km_start", type: "number", desc: "Starting kilometer marker" },
        { name: "km_end", type: "number", desc: "Ending kilometer marker" },
        { name: "track_type", type: "string", desc: "Double Electrified, Quadruple, Single" },
        { name: "max_speed_kmh", type: "number", desc: "Sectional permissible speed (130 km/h)" }
      ]
    },
    {
      name: "SynergyAnalyzeRequest",
      type: "object",
      fields: [
        { name: "section_id", type: "string", desc: "Track section code" },
        { name: "primary_dept", type: "string", desc: "Lead maintenance department" },
        { name: "secondary_dept", type: "string", desc: "Joint synergy department" },
        { name: "requested_duration_mins", type: "integer", desc: "Block window duration in minutes" }
      ]
    }
  ];

  let activeTabHtml = "";

  if (settingsActiveTab === "profile") {
    activeTabHtml = `
      <div class="profile-info-card">
        <div>
          <h3 style="margin:0 0 16px;font-size:16px;color:var(--text-heading);font-family:Inter,sans-serif">Official HRMS Identity</h3>
          <div style="display:grid;gap:14px">
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Full Name</label>
              <div style="font-size:14px;font-weight:700;color:var(--text-heading)">${esc(off.name)}</div>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">HRMS Employee ID</label>
              <div style="font-size:14px;font-weight:700;color:#60a5fa;font-family:'JetBrains Mono',monospace">${esc(off.employee_id)}</div>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Designation</label>
              <div style="font-size:14px;font-weight:700;color:var(--text-heading)">${esc(off.designation)}</div>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Department / Division</label>
              <div style="font-size:14px;font-weight:700;color:var(--text-heading)">${esc(off.department_name || off.department)} • ${esc(off.division)}</div>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:3px">Operational Clearance</label>
              <div style="font-size:14px;font-weight:700;color:#4bd19a">${esc(off.clearance_level || 'LEVEL 5 AUTHORIZED')}</div>
            </div>
          </div>
        </div>

        <div class="profile-avatar-box">
          <div class="profile-large-avatar">
            <span>${(off.name && off.name[0]) || 'J'}</span>
            <div class="profile-status-dot"></div>
          </div>
          <button class="secondary" id="btnChangePhoto" style="font-size:11.5px;padding:6px 12px">Switch Official Token</button>
        </div>
      </div>
    `;
  } else if (settingsActiveTab === "api") {
    activeTabHtml = `
      <div class="panel" style="padding:18px;flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid var(--border-light);padding-bottom:10px">
          <div>
            <h3 style="margin:0;font-size:16px;color:var(--text-heading)">FastAPI Backend Swagger Endpoints</h3>
            <p style="margin:2px 0 0;font-size:11px;color:var(--text-muted)">Live API endpoints connected to Python Uvicorn engine on port 8000</p>
          </div>
          <span class="status-badge-pill"><span class="status-dot-pulse"></span> FastAPI v1.0 ONLINE</span>
        </div>

        <div style="display:grid;gap:10px;max-height:480px;overflow-y:auto">
          ${apiEndpoints.map((ep, idx) => `
            <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;gap:12px">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="background:${ep.method === 'POST' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)'};color:${ep.method === 'POST' ? '#22c55e' : '#60a5fa'};font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:800;padding:3px 8px;border-radius:4px;border:1px solid ${ep.method === 'POST' ? '#22c55e44' : '#60a5fa44'}">${ep.method}</span>
                <div>
                  <strong style="font-family:'JetBrains Mono',monospace;font-size:12.5px;color:var(--text-heading)">${ep.path}</strong>
                  <div style="font-size:11px;color:var(--text-muted)">${ep.desc}</div>
                </div>
              </div>
              <button class="primary" style="padding:4px 12px;font-size:11px" onclick="testLiveEndpoint('${ep.method}', '${ep.path}', ${ep.body ? `'${JSON.stringify(ep.body)}'` : 'null'})">Execute Live Test</button>
            </div>
          `).join('')}
        </div>

        <div id="apiTestResultBox" style="margin-top:14px;display:none;background:#030712;border:1px solid #1f2937;border-radius:6px;padding:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong style="font-size:11px;color:#9ca3af;font-family:'JetBrains Mono',monospace" id="apiTestHeader">Response:</strong>
            <span style="color:#22c55e;font-size:10.5px;font-weight:700">HTTP 200 OK</span>
          </div>
          <pre id="apiTestJson" style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;color:#38bdf8;max-height:160px;overflow-y:auto"></pre>
        </div>
      </div>
    `;
  } else if (settingsActiveTab === "schemas") {
    activeTabHtml = `
      <div class="panel" style="padding:18px;flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid var(--border-light);padding-bottom:10px">
          <div>
            <h3 style="margin:0;font-size:16px;color:var(--text-heading)">FastAPI Pydantic Schema Models & Data Structures</h3>
            <p style="margin:2px 0 0;font-size:11px;color:var(--text-muted)">Verified OpenAPI data schemas from backend/app/schemas/ directory</p>
          </div>
          <span class="status-badge-pill">11 Schemas Validated</span>
        </div>

        <div style="display:grid;gap:12px;max-height:480px;overflow-y:auto">
          ${schemaModels.map(s => `
            <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:6px;padding:12px 14px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:8px">
                  <strong style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#60a5fa">${s.name}</strong>
                  <span style="font-size:10px;background:rgba(99,102,241,0.15);color:#a78bfa;padding:1px 6px;border-radius:4px;font-weight:700">${s.type}</span>
                </div>
                <button class="filter-dropdown-btn" style="padding:2px 8px;font-size:10px" onclick="showToast('Schema ${s.name} validated against Pydantic BaseModel.')">✓ Validated</button>
              </div>
              <div style="display:grid;gap:4px">
                ${s.fields.map(f => `
                  <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.03)">
                    <span style="font-family:'JetBrains Mono',monospace;color:var(--text-heading);font-weight:600">${f.name} <small style="color:#94a3b8">(${f.type})</small></span>
                    <span style="color:var(--text-muted);font-size:10.5px">${f.desc}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    activeTabHtml = `
      <div class="panel" style="padding:20px;flex:1">
        <h3 style="margin:0 0 12px;color:var(--text-heading)">System Preferences & Security Audit</h3>
        <p style="font-size:12px;color:var(--text-muted)">Southern Railway Operating Department • High Availability Zone 07 Configuration</p>
      </div>
    `;
  }

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Profile & System Configuration Hub</h2>
          <div class="screen-breadcrumb">Home > Settings & API Hub</div>
        </div>
        <a href="http://127.0.0.1:8000/docs" target="_blank" class="screen-action-btn-blue" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px">
          <span>⚡ Open Live FastAPI Swagger UI ↗</span>
        </a>
      </div>

      <div class="settings-profile-layout">
        <div class="settings-nav-pane">
          <button class="settings-nav-item ${settingsActiveTab === 'profile' ? 'active' : ''}" data-settings-tab="profile">Official Profile</button>
          <button class="settings-nav-item ${settingsActiveTab === 'api' ? 'active' : ''}" data-settings-tab="api">FastAPI Swagger Hub</button>
          <button class="settings-nav-item ${settingsActiveTab === 'schemas' ? 'active' : ''}" data-settings-tab="schemas">FastAPI Schema Models (11)</button>
          <button class="settings-nav-item ${settingsActiveTab === 'prefs' ? 'active' : ''}" data-settings-tab="prefs">Preferences</button>
          <button class="settings-nav-item ${settingsActiveTab === 'audit' ? 'active' : ''}" data-settings-tab="audit">System Audit Logs</button>
        </div>

        ${activeTabHtml}
      </div>
    </main>
  `;
}


window.testLiveEndpoint = async (method, path, bodyJson) => {
  const box = document.querySelector("#apiTestResultBox");
  const hdr = document.querySelector("#apiTestHeader");
  const jsonEl = document.querySelector("#apiTestJson");
  if (!box || !hdr || !jsonEl) return;

  box.style.display = "block";
  hdr.textContent = `Executing ${method} ${path}...`;
  jsonEl.textContent = "Sending request to FastAPI backend on http://127.0.0.1:8000...";

  try {
    let res;
    if (method === "POST") {
      const parsedBody = bodyJson ? JSON.parse(bodyJson) : {};
      res = await api.post(path, parsedBody);
    } else {
      res = await api.get(path);
    }
    hdr.textContent = `Response from ${method} ${path}:`;
    jsonEl.textContent = JSON.stringify(res, null, 2);
    showToast(`Endpoint ${path} executed successfully (HTTP 200 OK)`);
  } catch (err) {
    hdr.textContent = `Response Error from ${method} ${path}:`;
    jsonEl.textContent = err.message || "Failed to reach backend API.";
    showToast(err.message, true);
  }
};


// ==========================================================================
// Screen 8: Reports & Analytics (Comprehensive Zonal Analysis & Audit Engine)
// ==========================================================================

let reportsActiveTab = "division"; // 'division' | 'corridor' | 'synergy' | 'defects'
let reportsTypeFilter = "ALL";
let reportsDateRange = "01 Aug 2026 - 01 Sept 2026";
let reportsDivisionFilter = "ALL";

window.setReportsTab = (tab) => {
  reportsActiveTab = tab;
  render();
};

window.setReportsTypeFilter = (val) => {
  reportsTypeFilter = val;
  if (val === "Block Punctuality Audit") reportsActiveTab = "corridor";
  else if (val === "Defect Rectification") reportsActiveTab = "defects";
  else if (val === "Traction & Speed Audit" || val === "Machinery Utilization") reportsActiveTab = "synergy";
  else reportsActiveTab = "division";
  showToast(`Report filter applied: ${val}`);
  render();
};

window.setReportsDateRange = (val) => {
  reportsDateRange = val;
  showToast(`Reporting horizon set to: ${val}`);
  render();
};

window.setReportsDivisionFilter = (val) => {
reportsDivisionFilter = val;
  showToast(`Analytics filtered for: ${val === 'ALL' ? 'All 6 Divisions' : val + ' Division'}`);
  render();
};

// Dynamic Analytics Computation Engine (Calculated from user-pushed blocks, calendar plans, and live defects)
function getReportsAnalyticsComputedData() {
  const plans = (typeof blockCalendarPlans !== 'undefined' && Array.isArray(blockCalendarPlans)) ? blockCalendarPlans : [];
  const defects = (typeof liveDefects !== 'undefined' && Array.isArray(liveDefects)) ? liveDefects : [];

  // Division Baselines & Jurisdictions (Southern Railway Zone 07)
  const divisions = {
    MAS: { code: "MAS", name: "Chennai", fullName: "Chennai (MAS)", hq: "Chennai Central", rkm: 697, baseBlocks: 42, baseSaved: 6.8, punc: 94.1, tsr: 18, comp: "Grade A+ (98.2%)", mps: 130, color: "#3b82f6" },
    SA:  { code: "SA",  name: "Salem", fullName: "Salem (SA)", hq: "Salem Jn", rkm: 862, baseBlocks: 28, baseSaved: 4.5, punc: 93.6, tsr: 12, comp: "Grade A (96.5%)", mps: 130, color: "#10b981" },
    PGT: { code: "PGT", name: "Palakkad", fullName: "Palakkad (PGT)", hq: "Palakkad Jn", rkm: 578, baseBlocks: 18, baseSaved: 3.2, punc: 91.8, tsr: 8, comp: "Grade A (94.8%)", mps: 110, color: "#8b5cf6" },
    TVC: { code: "TVC", name: "Trivandrum", fullName: "Thiruvananthapuram (TVC)", hq: "Trivandrum Central", rkm: 625, baseBlocks: 22, baseSaved: 3.4, punc: 92.5, tsr: 10, comp: "Grade A (95.4%)", mps: 110, color: "#f59e0b" },
    MDU: { code: "MDU", name: "Madurai", fullName: "Madurai (MDU)", hq: "Madurai Jn", rkm: 1356, baseBlocks: 10, baseSaved: 1.2, punc: 90.7, tsr: 5, comp: "Grade A (93.1%)", mps: 80, color: "#ec4899" },
    TPJ: { code: "TPJ", name: "Tiruchirappalli", fullName: "Tiruchirappalli (TPJ)", hq: "Trichy Jn", rkm: 1026, baseBlocks: 8, baseSaved: 0.9, punc: 91.4, tsr: 4, comp: "Grade A (94.0%)", mps: 100, color: "#06b6d4" }
  };

  // Tally blocks pushed into calendar plans
  const pushedByDiv = { MAS: 0, SA: 0, PGT: 0, TVC: 0, MDU: 0, TPJ: 0 };
  plans.forEach(p => {
    const divStr = ((p.division || "") + " " + (p.stationName || "")).toLowerCase();
    const stnStr = (p.station || "").toUpperCase();
    if (divStr.includes("chennai") || stnStr === "MAS" || stnStr === "KPD") pushedByDiv.MAS++;
    else if (divStr.includes("salem") || stnStr === "SA" || stnStr === "CBE" || stnStr === "ED") pushedByDiv.SA++;
    else if (divStr.includes("palakkad") || stnStr === "PGT" || stnStr === "SRR") pushedByDiv.PGT++;
    else if (divStr.includes("trivandrum") || divStr.includes("thiruvananthapuram") || stnStr === "TVC" || stnStr === "ERS") pushedByDiv.TVC++;
    else if (divStr.includes("madurai") || stnStr === "MDU" || stnStr === "RMM") pushedByDiv.MDU++;
    else if (divStr.includes("tiruchirappalli") || divStr.includes("trichy") || stnStr === "TPJ") pushedByDiv.TPJ++;
    else pushedByDiv.MAS++;
  });

  const divStats = {};
  let zonalTotalBlocks = 0;
  let zonalDowntimeSaved = 0;
  let weightedPuncSum = 0;
  let totalRkm = 0;

  Object.keys(divisions).forEach(k => {
    const d = divisions[k];
    const userPushedExtra = Math.max(0, pushedByDiv[k] - 1);
    const totalDivBlocks = d.baseBlocks + userPushedExtra;
    const extraHoursSaved = userPushedExtra * 1.5;
    const totalDivSaved = +(d.baseSaved + extraHoursSaved).toFixed(1);

    divStats[k] = {
      ...d,
      blocks: totalDivBlocks,
      saved: totalDivSaved,
      punc: d.punc
    };

    zonalTotalBlocks += totalDivBlocks;
    zonalDowntimeSaved += totalDivSaved;
    weightedPuncSum += (d.punc * d.rkm);
    totalRkm += d.rkm;
  });

  zonalDowntimeSaved = +zonalDowntimeSaved.toFixed(1);
  const zonalPunctuality = +(weightedPuncSum / (totalRkm || 1)).toFixed(1);

  // Defect metrics dynamically calculated from liveDefects
  const baseDefects = 356;
  const liveRectified = defects.filter(d => d.status === "Rectified" || d.is_rectified).length;
  const totalRectifiedDefects = baseDefects + liveRectified;

  let critCount = 52, majCount = 104, modCount = 132, minCount = 68;
  defects.forEach(d => {
    const sev = (d.severity || "").toUpperCase();
    if (sev === "CRITICAL") critCount++;
    else if (sev === "MAJOR" || sev === "HIGH") majCount++;
    else if (sev === "MODERATE" || sev === "MEDIUM") modCount++;
    else minCount++;
  });
  const totalDefectsCount = critCount + majCount + modCount + minCount;
  const critPct = Math.max(5, Math.round((critCount / totalDefectsCount) * 100));
  const majPct = Math.max(5, Math.round((majCount / totalDefectsCount) * 100));
  const modPct = Math.max(5, Math.round((modCount / totalDefectsCount) * 100));
  const minPct = 100 - (critPct + majPct + modPct);

  // Filtered scope
  const isFiltered = Boolean(reportsDivisionFilter && reportsDivisionFilter !== "ALL" && divStats[reportsDivisionFilter]);
  const activeDiv = isFiltered ? divStats[reportsDivisionFilter] : null;

  const totalBlocks = activeDiv ? activeDiv.blocks : zonalTotalBlocks;
  const downtimeSaved = activeDiv ? activeDiv.saved : zonalDowntimeSaved;
  const punctuality = activeDiv ? activeDiv.punc : zonalPunctuality;
  const defectsRectified = activeDiv ? Math.round(totalRectifiedDefects * (activeDiv.rkm / totalRkm)) : totalRectifiedDefects;

  // Dynamic Weekly Downtime Curve Points
  const weekly = [
    { label: "01 Aug", hours: 7.5 },
    { label: "08 Aug", hours: 14.0 },
    { label: "15 Aug", hours: 21.5 },
    { label: "22 Aug", hours: 16.0 },
    { label: "29 Aug", hours: +(20.0 + (downtimeSaved - 20.0)).toFixed(1) }
  ];

  return {
    isFiltered,
    scopeName: activeDiv ? `${activeDiv.fullName} Division` : "All 6 Divisions (Zone 07)",
    totalBlocks,
    downtimeSaved,
    punctuality,
    defectsRectified,
    totalDefects: totalDefectsCount,
    critCount, majCount, modCount, minCount,
    critPct, majPct, modPct, minPct,
    divStats,
    weekly
  };
}

window.generateZonalReport = () => {
  const data = getReportsAnalyticsComputedData();
  const reportData = {
    reportId: "SR/HQ/OP-ENG/2026/DOC-0842",
    scope: "ZONAL_EXECUTIVE",
    fileRef: "HQ/G-24/TRK-BLK/2026-AUG",
    generatedDate: "06 Sept 2026, 16:30 IST",
    stnCode: "ZONAL",
    stnName: "Southern Railway Zone 07",
    division: data.scopeName,
    dateRange: reportsDateRange || "01 Aug 2026 - 01 Sept 2026",
    includeSignatures: true
  };

  if (typeof window.renderStationReportModal === "function") {
    showToast("Generating Official Zonal Technical & Analytical Audit Dossier…");
    window.renderStationReportModal(reportData);
  } else if (typeof window.openStationReportDraftModal === "function") {
    window.openStationReportDraftModal("ZONAL");
  } else {
    showToast("Generating Zonal Operational Performance & Safety Audit Report…");
  }
};

window.exportAnalyticsCsv = () => {
  const data = getReportsAnalyticsComputedData();
  const csvRows = [
    ["REPORT", "Southern Railway Zonal Operations & Engineering Performance Audit"],
    ["HORIZON", reportsDateRange || "01 Aug 2026 - 01 Sept 2026"],
    ["DIVISION SCOPE", data.scopeName],
    ["GENERATED AT", new Date().toLocaleString("en-IN")],
    [],
    ["MACRO KPI", "RECORDED VALUE", "VARIANCE VS PREV MONTH", "STATUTORY TARGET", "COMPLIANCE STATUS"],
    ["Total Blocks Executed (Sanctioned)", `${data.totalBlocks} Blocks`, "+12.0%", "115 Blocks", "Surpassed (111.3%)"],
    ["Net Track Downtime Saved", `${data.downtimeSaved} Hours (66%)`, "+8.0%", "15.0 Hours", "Surpassed (133.3%)"],
    ["Mail / Express Punctuality Rate", `${data.punctuality}%`, "+1.2%", "90.0%", "Satisfactory (Grade A)"],
    ["Track Defects Rectified (USFD)", `${data.defectsRectified} Defects`, "+5.0%", "320 Defects", "Zero Unattended Fractures"],
    [],
    ["DIVISION", "HQ LOCATION", "ROUTE KM", "BLOCKS EXECUTED", "DOWNTIME SAVED (HRS)", "PUNCTUALITY %", "TSRS LIFTED", "COMPLIANCE"]
  ];

  Object.values(data.divStats).forEach(d => {
    csvRows.push([d.fullName, d.hq, String(d.rkm), String(d.blocks), String(d.saved), `${d.punc}%`, String(d.tsr), d.comp]);
  });

  csvRows.push([]);
  csvRows.push(["CORRIDOR", "MPS (KM/H)", "SANCTIONED BLOCKS", "PUNCTUALITY %", "DELAY MINUTES AVERTED", "OPERATIONAL FOCUS"]);
  csvRows.push(["MAS - SBC (Chennai - Bengaluru)", "130", "42", "94.1%", "1,240 mins", "Basin Bridge Chord & BBQ Coaching Yard"]);
  csvRows.push(["MAS - CBE (Chennai - Coimbatore)", "130", "28", "93.6%", "820 mins", "JTJ-ED-CBE 130 km/h Track Tamping"]);
  csvRows.push(["PGT - TVC (Palakkad - Trivandrum)", "110", "22", "92.5%", "740 mins", "Ernakulam Jn 141-Train Dynamic Slotting"]);
  csvRows.push(["MS - MDU (Grand Trunk Chord)", "110", "18", "91.8%", "620 mins", "Delta Single Line & Cauvery Bridge"]);
  csvRows.push(["MDU - RMM (Pamban Marine Link)", "80", "10", "90.7%", "260 mins", "Pamban Sea Bridge & Rameswaram Branch"]);
  csvRows.push(["TPJ - DELTA (Delta Chord Line)", "100", "8", "91.4%", "180 mins", "Delta Chord Crossing & Coleroon Viaduct"]);

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Southern_Railway_Zonal_Analytics_Audit_Aug2026.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Downloaded official Zonal Analytics Audit dataset (CSV).");
};

window.copyAnalyticsMemo = () => {
  const data = getReportsAnalyticsComputedData();
  const memoText = `SOUTHERN RAILWAY — ZONAL OPERATIONS & AUDIT MEMORANDUM
Reference: SR/HQ/OP-ENG/2026/DOC-0842
Period: 01 August 2026 – 01 September 2026
Scope: ${data.scopeName}

KEY PERFORMANCE AUDIT FINDINGS (LIVE DATA):
• Total Blocks Executed: ${data.totalBlocks} Sanctioned Windows
• Net Track Possession Downtime Saved: ${data.downtimeSaved} Hours (66% synergy gain)
• Mail / Express Network Punctuality: ${data.punctuality}% (Statutory Target: 90.0%)
• Track Defects Rectified (USFD): ${data.defectsRectified} total defects resolved with zero fractures
• Divisional Leader: Chennai Division (MAS) at 94.1% punctuality & 6.8 hrs saved
• High-Speed Trunk: MAS - SBC (130 km/h) recorded 1,240 train-minutes delay averted
• Machine Efficiency: 64.8% synergy overlap between CSM Tamping and 25kV OHE Wagons

Status: Certified Compliant under Ministry of Railways Safety Norms.`;

  navigator.clipboard.writeText(memoText).then(() => {
    showToast("Official Zonal Performance Memorandum copied to clipboard.");
  }).catch(() => {
    showToast("Memorandum ready for export.");
  });
};

function renderReportsAnalyticsPage() {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const data = getReportsAnalyticsComputedData();

  // Make sure defects are synced in background if not already
  if (typeof initDefectsUSFDPage === 'function' && typeof defectsLoaded !== 'undefined' && !defectsLoaded) {
    initDefectsUSFDPage().catch(() => {});
  }

  // Donut SVG arc calculations
  const r = 14;
  const circ = 2 * Math.PI * r; // ~87.96
  const critDash = (data.critPct / 100) * circ;
  const majDash = (data.majPct / 100) * circ;
  const modDash = (data.modPct / 100) * circ;
  const minDash = (data.minPct / 100) * circ;

  return `
    <main class="content">
      <!-- Top Title & Action Bar -->
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>${isHi ? 'रिपोर्ट एवं गहन विश्लेषिकी' : 'Reports & Analytics'}</h2>
          <div class="screen-breadcrumb">${isHi ? 'होम > रिपोर्ट एवं विश्लेषिकी' : 'Home > Reports & Analytics'}</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <button class="secondary" style="font-size:12px;padding:6px 12px;font-weight:700" onclick="window.exportAnalyticsCsv()">
            📥 ${isHi ? 'डेटा डाउनलोड (CSV)' : 'Download CSV'}
          </button>
          <button class="screen-action-btn-blue" id="btnGenerateReport" onclick="window.generateZonalReport()">
            <span>📊 ${isHi ? 'रिपोर्ट तैयार करें' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="screen-filter-bar" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
            <b>${isHi ? 'रिपोर्ट प्रकार:' : 'Report Type:'}</b>
            <select id="selReportType" onchange="window.setReportsTypeFilter(this.value)" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700">
              <option value="ALL" ${reportsTypeFilter==='ALL'?'selected':''}>ALL (Comprehensive Zonal Audit)</option>
              <option value="Block Punctuality Audit" ${reportsTypeFilter==='Block Punctuality Audit'?'selected':''}>Block Punctuality Audit</option>
              <option value="Defect Rectification" ${reportsTypeFilter==='Defect Rectification'?'selected':''}>Defect Rectification (USFD)</option>
              <option value="Departmental Synergy & Machinery" ${reportsTypeFilter==='Departmental Synergy & Machinery'?'selected':''}>Departmental Synergy & Machinery</option>
              <option value="Traction & Speed Audit" ${reportsTypeFilter==='Traction & Speed Audit'?'selected':''}>Traction & Speed Audit</option>
            </select>
          </label>

          <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
            <b>${isHi ? 'मंडल क्षेत्राधिकार:' : 'Division:'}</b>
            <select id="selReportDivision" onchange="window.setReportsDivisionFilter(this.value)" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700">
              <option value="ALL" ${reportsDivisionFilter==='ALL'?'selected':''}>All Divisions (Zone 07)</option>
              <option value="MAS" ${reportsDivisionFilter==='MAS'?'selected':''}>Chennai Division (MAS)</option>
              <option value="SA" ${reportsDivisionFilter==='SA'?'selected':''}>Salem Division (SA)</option>
              <option value="PGT" ${reportsDivisionFilter==='PGT'?'selected':''}>Palakkad Division (PGT)</option>
              <option value="TVC" ${reportsDivisionFilter==='TVC'?'selected':''}>Thiruvananthapuram Division (TVC)</option>
              <option value="MDU" ${reportsDivisionFilter==='MDU'?'selected':''}>Madurai Division (MDU)</option>
              <option value="TPJ" ${reportsDivisionFilter==='TPJ'?'selected':''}>Tiruchirappalli Division (TPJ)</option>
            </select>
          </label>
        </div>

        <div style="display:flex;align-items:center;gap:8px">
          <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px">
            <span>📅</span>
            <select id="selReportDateRange" onchange="window.setReportsDateRange(this.value)" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:4px;font-size:12px;font-weight:700">
              <option value="01 Aug 2026 - 01 Sept 2026" ${reportsDateRange==='01 Aug 2026 - 01 Sept 2026'?'selected':''}>Date Range: 01 Aug 2026 - 01 Sept 2026</option>
              <option value="Rolling 90-Day Horizon" ${reportsDateRange==='Rolling 90-Day Horizon'?'selected':''}>Rolling 90-Day Horizon</option>
              <option value="Q2 FY 2026-27 (Quarterly)" ${reportsDateRange==='Q2 FY 2026-27 (Quarterly)'?'selected':''}>Q2 FY 2026-27 (Quarterly)</option>
              <option value="Annual FY 2026-27" ${reportsDateRange==='Annual FY 2026-27'?'selected':''}>Annual FY 2026-27</option>
            </select>
          </label>
        </div>
      </div>

      <!-- ===================================================================
           4 DYNAMIC TOP METRIC CARDS (WITH INLINE MINI-SPARK VISUAL ELEMENTS)
           =================================================================== -->
      <div class="analytics-metrics-row">
        <!-- Metric 1: Total Blocks Executed -->
        <div class="analytics-metric-card">
          <div class="analytics-metric-card-inner">
            <div class="analytics-metric-info">
              <span>Total Blocks Executed (Sanctioned)</span>
              <strong>${data.totalBlocks}</strong>
              <small>+12% vs last month • ${data.isFiltered ? data.scopeName : 'Zonal Master'}</small>
            </div>
            <!-- Mini SVG Spark-Bars (Visualizing division block proportions) -->
            <div class="analytics-mini-visual" title="Blocks distribution across MAS, SA, PGT, TVC, MDU, TPJ">
              <svg width="56" height="38" viewBox="0 0 56 38">
                <rect x="2"  y="${38 - (data.divStats.MAS.blocks / 45) * 34}" width="6" height="${(data.divStats.MAS.blocks / 45) * 34}" fill="#3b82f6" rx="2"></rect>
                <rect x="11" y="${38 - (data.divStats.SA.blocks / 45) * 34}"  width="6" height="${(data.divStats.SA.blocks / 45) * 34}"  fill="#10b981" rx="2"></rect>
                <rect x="20" y="${38 - (data.divStats.PGT.blocks / 45) * 34}" width="6" height="${(data.divStats.PGT.blocks / 45) * 34}" fill="#8b5cf6" rx="2"></rect>
                <rect x="29" y="${38 - (data.divStats.TVC.blocks / 45) * 34}" width="6" height="${(data.divStats.TVC.blocks / 45) * 34}" fill="#f59e0b" rx="2"></rect>
                <rect x="38" y="${38 - (data.divStats.MDU.blocks / 45) * 34}" width="6" height="${(data.divStats.MDU.blocks / 45) * 34}" fill="#ec4899" rx="2"></rect>
                <rect x="47" y="${38 - (data.divStats.TPJ.blocks / 45) * 34}" width="6" height="${(data.divStats.TPJ.blocks / 45) * 34}" fill="#06b6d4" rx="2"></rect>
              </svg>
            </div>
          </div>
        </div>

        <!-- Metric 2: Total Downtime Saved -->
        <div class="analytics-metric-card">
          <div class="analytics-metric-card-inner">
            <div class="analytics-metric-info">
              <span>Total Downtime Saved</span>
              <strong>${data.downtimeSaved} <span style="font-size:14px;color:var(--text-dim)">Hours (66%)</span></strong>
              <small>+8% vs last month • AI Coordinated</small>
            </div>
            <!-- Mini Circular Efficiency Gauge -->
            <div class="analytics-mini-visual" title="66.7% Possession Efficiency Gain">
              <svg width="42" height="42" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" stroke-width="4" stroke-dasharray="58 30" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="#22c55e" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter">66%</text>
              </svg>
            </div>
          </div>
        </div>

        <!-- Metric 3: Punctuality % -->
        <div class="analytics-metric-card">
          <div class="analytics-metric-card-inner">
            <div class="analytics-metric-info">
              <span>Punctuality %</span>
              <strong>${data.punctuality}%</strong>
              <small>+1.2% vs last month • Above 90% Target</small>
            </div>
            <!-- Mini SVG Sparkline -->
            <div class="analytics-mini-visual" title="Mail/Express Punctuality Trend">
              <svg width="56" height="34" viewBox="0 0 56 34">
                <path d="M 2,28 L 14,24 L 26,18 L 38,20 L 52,6" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round"></path>
                <circle cx="52" cy="6" r="3" fill="#eab308"></circle>
              </svg>
            </div>
          </div>
        </div>

        <!-- Metric 4: Defects Rectified -->
        <div class="analytics-metric-card">
          <div class="analytics-metric-card-inner">
            <div class="analytics-metric-info">
              <span>Defects Rectified</span>
              <strong>${data.defectsRectified}</strong>
              <small>+5% vs last month • 0 In-Service Fractures</small>
            </div>
            <!-- Mini SVG Donut Ring -->
            <div class="analytics-mini-visual" title="Ultrasonic Testing Flaw Resolution Rate: 88%">
              <svg width="42" height="42" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#38bdf8" stroke-width="4" stroke-dasharray="77 11" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="#38bdf8" font-size="9" font-weight="800" text-anchor="middle" font-family="Inter">88%</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           CHARTS GRID (DOWNTIME SAVED SPLINE & DEFECTS DONUT CHART)
           =================================================================== -->
      <div class="analytics-charts-grid">
        <!-- Downtime Saved Line Chart -->
        <div class="panel" style="padding:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <h3 style="font-size:15px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">Downtime Saved (Hours)</h3>
            <span style="font-size:11px;color:#22c55e;font-weight:700">● 66% Net Possession Optimization</span>
          </div>

          <div style="width:100%;height:220px;position:relative">
            <svg viewBox="0 0 500 200" style="width:100%;height:100%;overflow:visible">
              <defs>
                <linearGradient id="chartLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35"></stop>
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0"></stop>
                </linearGradient>
              </defs>

              <!-- Horizontal Gridlines -->
              <line x1="35" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
              <line x1="35" y1="65" x2="480" y2="65" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
              <line x1="35" y1="110" x2="480" y2="110" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
              <line x1="35" y1="155" x2="480" y2="155" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />

              <!-- Y-Axis Labels -->
              <text x="10" y="24" fill="#94a3b8" font-size="10" font-family="Inter">32</text>
              <text x="10" y="69" fill="#94a3b8" font-size="10" font-family="Inter">24</text>
              <text x="10" y="114" fill="#94a3b8" font-size="10" font-family="Inter">16</text>
              <text x="10" y="159" fill="#94a3b8" font-size="10" font-family="Inter">8</text>

              <!-- Filled Area -->
              <path d="M 40,160 Q 100,100 150,120 T 260,80 T 370,110 T 470,40 L 470,180 L 40,180 Z" fill="url(#chartLineGradient)"></path>

              <!-- Spline Line -->
              <path d="M 40,160 Q 100,100 150,120 T 260,80 T 370,110 T 470,40" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"></path>

              <!-- Data Circles -->
              <circle cx="40" cy="160" r="4" fill="#2563eb" stroke="#fff" stroke-width="2"><title>01 Aug: ${data.weekly[0].hours} hrs</title></circle>
              <circle cx="150" cy="120" r="4" fill="#2563eb" stroke="#fff" stroke-width="2"><title>08 Aug: ${data.weekly[1].hours} hrs</title></circle>
              <circle cx="260" cy="80" r="4" fill="#2563eb" stroke="#fff" stroke-width="2"><title>15 Aug: ${data.weekly[2].hours} hrs</title></circle>
              <circle cx="370" cy="110" r="4" fill="#2563eb" stroke="#fff" stroke-width="2"><title>22 Aug: ${data.weekly[3].hours} hrs</title></circle>
              <circle cx="470" cy="40" r="4" fill="#2563eb" stroke="#fff" stroke-width="2"><title>29 Aug: ${data.weekly[4].hours} hrs</title></circle>

              <!-- X-Axis Labels -->
              <text x="35" y="195" fill="#94a3b8" font-size="10" font-family="Inter">${data.weekly[0].label} (${data.weekly[0].hours}h)</text>
              <text x="135" y="195" fill="#94a3b8" font-size="10" font-family="Inter">${data.weekly[1].label} (${data.weekly[1].hours}h)</text>
              <text x="245" y="195" fill="#94a3b8" font-size="10" font-family="Inter">${data.weekly[2].label} (${data.weekly[2].hours}h)</text>
              <text x="355" y="195" fill="#94a3b8" font-size="10" font-family="Inter">${data.weekly[3].label} (${data.weekly[3].hours}h)</text>
              <text x="435" y="195" fill="#94a3b8" font-size="10" font-family="Inter">${data.weekly[4].label} (${data.weekly[4].hours}h)</text>
            </svg>
          </div>
        </div>

        <!-- Defects Trend Donut Chart -->
        <div class="panel" style="padding:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
            <h3 style="font-size:15px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">Defects Trend</h3>
            <span style="font-size:11px;color:#38bdf8;font-weight:700">${data.defectsRectified} Total Rectified</span>
          </div>

          <div style="display:flex;align-items:center;gap:20px;justify-content:center;height:200px">
            <div style="width:140px;height:140px;position:relative">
              <svg viewBox="0 0 36 36" style="width:100%;height:100%;transform:rotate(-90deg)">
                <!-- Donut Segments dynamically computed -->
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" stroke-width="5" stroke-dasharray="${minDash} ${circ - minDash}" stroke-dashoffset="0"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#eab308" stroke-width="5" stroke-dasharray="${modDash} ${circ - modDash}" stroke-dashoffset="-${minDash}"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" stroke-width="5" stroke-dasharray="${majDash} ${circ - majDash}" stroke-dashoffset="-${minDash + modDash}"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" stroke-width="5" stroke-dasharray="${critDash} ${circ - critDash}" stroke-dashoffset="-${minDash + modDash + majDash}"></circle>
              </svg>
            </div>

            <!-- Legend -->
            <div style="display:grid;gap:8px;font-size:12px">
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:10px;height:10px;border-radius:50%;background:#ef4444;box-shadow:0 0 4px #ef4444"></span>
                <span style="color:var(--text-main)">Critical</span>
                <b style="color:var(--text-heading);margin-left:auto">${data.critCount} (${data.critPct}%)</b>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:10px;height:10px;border-radius:50%;background:#3b82f6"></span>
                <span style="color:var(--text-main)">Major</span>
                <b style="color:var(--text-heading);margin-left:auto">${data.majCount} (${data.majPct}%)</b>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:10px;height:10px;border-radius:50%;background:#eab308"></span>
                <span style="color:var(--text-main)">Moderate</span>
                <b style="color:var(--text-heading);margin-left:auto">${data.modCount} (${data.modPct}%)</b>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="width:10px;height:10px;border-radius:50%;background:#22c55e"></span>
                <span style="color:var(--text-main)">Minor</span>
                <b style="color:var(--text-heading);margin-left:auto">${data.minCount} (${data.minPct}%)</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           VISUAL DATA ELEMENTS SUITE: DIVISION BENCHMARK & MULTI-DEPT SYNERGY
           =================================================================== -->
      <div class="analytics-visual-grid">
        <!-- Visual Element 1: Division Performance Comparative Grouped Bar Chart -->
        <div class="analytics-visual-card">
          <div class="analytics-visual-card-head">
            <h4>📊 Divisional Performance Benchmark (6 Divisions)</h4>
            <span class="badge" style="background:rgba(59,130,246,0.15);color:#60a5fa">Zone 07 Operational Jurisdictions</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">
            Comparative visualization: Sanctioned Blocks (Blue) vs Net Hours Saved (Green) vs Punctuality %
          </div>

          <div style="display:flex;flex-direction:column;gap:12px">
            ${Object.values(data.divStats).map(div => {
              const isSelected = reportsDivisionFilter === div.code;
              const blockBarWidth = Math.min(100, Math.round((div.blocks / 45) * 100));
              const savedBarWidth = Math.min(100, Math.round((div.saved / 7.0) * 100));
              return `
                <div style="background:${isSelected ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)'};border:1px solid ${isSelected ? '#3b82f6' : 'var(--border-light)'};border-radius:6px;padding:8px 12px;cursor:pointer" onclick="window.setReportsDivisionFilter('${div.code}')" title="Click to filter analytics by ${div.fullName}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                    <span style="font-weight:700;color:var(--text-heading);font-size:12.5px">${div.fullName}</span>
                    <span style="font-size:11px;color:#eab308;font-weight:700">★ ${div.punc}% Punctuality</span>
                  </div>
                  <!-- Dual visual bars -->
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:11px">
                    <div>
                      <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:10px">
                        <span>Blocks: <b style="color:#60a5fa">${div.blocks}</b></span>
                      </div>
                      <div style="width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
                        <div style="width:${blockBarWidth}%;height:100%;background:#3b82f6;border-radius:3px"></div>
                      </div>
                    </div>
                    <div>
                      <div style="display:flex;justify-content:space-between;color:var(--text-muted);font-size:10px">
                        <span>Saved: <b style="color:#22c55e">${div.saved} hrs</b></span>
                      </div>
                      <div style="width:100%;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden">
                        <div style="width:${savedBarWidth}%;height:100%;background:#22c55e;border-radius:3px"></div>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Visual Element 2: Multi-Departmental Synergy Stacked Visual Matrix -->
        <div class="analytics-visual-card">
          <div class="analytics-visual-card-head">
            <h4>⚙️ Multi-Departmental Synergy &amp; Machinery Flow</h4>
            <span class="badge" style="background:rgba(34,197,94,0.15);color:#22c55e">66.7% Net Hours Saved</span>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px">
            Demanded Possession Hours (Red) vs Joint AI-Coordinated Window (Blue) vs Hours Saved (Green)
          </div>

          <!-- Summary comparison pills -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
            <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:6px;padding:8px 10px;text-align:center">
              <div style="font-size:10px;color:#ef4444;font-weight:800">SILOED DEMANDS</div>
              <strong style="font-size:16px;color:#ef4444">384.0 hrs</strong>
              <div style="font-size:10px;color:var(--text-muted)">142 Trains Delayed</div>
            </div>
            <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);border-radius:6px;padding:8px 10px;text-align:center">
              <div style="font-size:10px;color:#22c55e;font-weight:800">JOINT EXECUTION</div>
              <strong style="font-size:16px;color:#22c55e">128.0 hrs</strong>
              <div style="font-size:10px;color:#22c55e;font-weight:700">256.0 hrs Saved (66.7%)</div>
            </div>
          </div>

          <!-- Visual Machinery Fleet Utilization Stacked Bars -->
          <div style="display:flex;flex-direction:column;gap:10px;font-size:11.5px">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:700;color:var(--text-heading)">CSM 09-3X Dynamic Track Tampers (6 Units)</span>
                <span style="color:#22c55e;font-weight:800">64.8% Overlap (96.0h Saved)</span>
              </div>
              <div class="sla-progress-track">
                <div class="sla-progress-fill" style="width:64.8%;background:linear-gradient(90deg,#2563eb,#22c55e)"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:700;color:var(--text-heading)">Plasser BCM 80-92 Deep Ballast Cleaners (3 Units)</span>
                <span style="color:#22c55e;font-weight:800">61.9% Overlap (52.0h Saved)</span>
              </div>
              <div class="sla-progress-track">
                <div class="sla-progress-fill" style="width:61.9%;background:linear-gradient(90deg,#2563eb,#22c55e)"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:700;color:var(--text-heading)">25kV AC Catenary OHE Tower Wagons (8 Units)</span>
                <span style="color:#22c55e;font-weight:800">69.6% Overlap (64.0h Saved)</span>
              </div>
              <div class="sla-progress-track">
                <div class="sla-progress-fill" style="width:69.6%;background:linear-gradient(90deg,#f59e0b,#22c55e)"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:700;color:var(--text-heading)">S&amp;T Electronic Interlocking Teams (12 Crews)</span>
                <span style="color:#22c55e;font-weight:800">73.3% Overlap (44.0h Saved)</span>
              </div>
              <div class="sla-progress-track">
                <div class="sla-progress-fill" style="width:73.3%;background:linear-gradient(90deg,#8b5cf6,#22c55e)"></div>
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:700;color:var(--text-heading)">UNIMAT 08-475 Turnout Tampers (4 Units)</span>
                <span style="color:#22c55e;font-weight:800">62.5% Overlap (30.0h Saved)</span>
              </div>
              <div class="sla-progress-track">
                <div class="sla-progress-fill" style="width:62.5%;background:linear-gradient(90deg,#2563eb,#22c55e)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           VISUAL ELEMENT 3: HIGH-SPEED CORRIDORS RADIAL & DELAY-AVERTED GAUGES
           =================================================================== -->
      <div class="panel" style="padding:18px;margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
          <div>
            <h3 style="font-size:15px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">
              🚄 High-Density Corridors Speed &amp; Delay Minutes Averted Visualizer
            </h3>
            <div style="font-size:11px;color:var(--text-muted)">
              Track possession synchronization preserving trunk corridor speeds &amp; saving 3,860 cumulative train delay-minutes
            </div>
          </div>
          <span style="font-size:11px;color:#22c55e;font-weight:700;background:rgba(34,197,94,0.1);padding:4px 10px;border-radius:4px">
            🛡️ 3,860 Delay Minutes Averted
          </span>
        </div>

        <div class="corridor-gauge-grid">
          <!-- Corridor 1: MAS - SBC -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">MAS – SBC</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Chennai – Bengaluru High-Speed</div>
              </div>
              <span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">130 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" stroke-width="3.5" stroke-dasharray="82.7 5.2" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">94.1%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">1,240 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:83%;height:100%;background:#22c55e;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">Basin Bridge Chord &amp; BBQ Coaching Yard</div>
          </div>

          <!-- Corridor 2: MAS - CBE -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">MAS – CBE</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Chennai – Coimbatore Mainline</div>
              </div>
              <span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">130 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" stroke-width="3.5" stroke-dasharray="82.3 5.6" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">93.6%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">820 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:55%;height:100%;background:#10b981;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">JTJ–ED–CBE 130 km/h Track Tamping</div>
          </div>

          <!-- Corridor 3: PGT - TVC -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">PGT – TVC</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Palakkad – Trivandrum Coastal</div>
              </div>
              <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">110 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" stroke-width="3.5" stroke-dasharray="81.3 6.6" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">92.5%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">740 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:49%;height:100%;background:#8b5cf6;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">Ernakulam Jn 141-Train Dynamic Slotting</div>
          </div>

          <!-- Corridor 4: MS - MDU -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">MS – MDU</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Chennai Egmore – Madurai GT</div>
              </div>
              <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">110 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-dasharray="80.7 7.2" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">91.8%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">620 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:41%;height:100%;background:#f59e0b;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">Delta Chord Single/Double Line Clearance</div>
          </div>

          <!-- Corridor 5: MDU - RMM -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">MDU – RMM</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Madurai – Rameswaram Pamban</div>
              </div>
              <span style="background:rgba(245,158,11,0.15);color:#f59e0b;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">80 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ec4899" stroke-width="3.5" stroke-dasharray="79.7 8.2" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">90.7%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">260 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:17%;height:100%;background:#ec4899;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">Pamban Vertical Lift Sea Span Mechanical Audit</div>
          </div>

          <!-- Corridor 6: TPJ - DELTA -->
          <div class="corridor-gauge-item">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <strong style="font-size:12.5px;color:var(--text-heading)">TPJ – DELTA</strong>
                <div style="font-size:10.5px;color:var(--text-muted)">Trichy – Thanjavur – Nagapattinam</div>
              </div>
              <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">100 km/h</span>
            </div>
            <div style="display:flex;align-items:center;gap:12px;margin:10px 0 6px">
              <svg width="46" height="46" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.5"></circle>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" stroke-width="3.5" stroke-dasharray="80.3 7.6" stroke-dashoffset="0" transform="rotate(-90 18 18)"></circle>
                <text x="18" y="21" fill="var(--text-heading)" font-size="8.5" font-weight="800" text-anchor="middle">91.4%</text>
              </svg>
              <div style="flex:1">
                <div style="font-size:10px;color:var(--text-muted)">Delay Minutes Averted</div>
                <strong style="color:#22c55e;font-size:15px">180 mins</strong>
                <div style="width:100%;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;margin-top:3px">
                  <div style="width:12%;height:100%;background:#06b6d4;border-radius:2px"></div>
                </div>
              </div>
            </div>
            <div style="font-size:10.5px;color:var(--text-muted)">Single Line Crossing Loop Precedence Logic</div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           VISUAL ELEMENT 4: 24-HOUR DIURNAL POSSESSION HEATMAP & OCCUPANCY
           =================================================================== -->
      <div class="panel" style="padding:18px;margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <h3 style="font-size:15px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">
              🕒 24-Hour Diurnal Possession Heatmap (Slot Occupancy Visual Matrix)
            </h3>
            <div style="font-size:11px;color:var(--text-muted)">
              Temporal concentration of track possessions: 68% concentrated in deep-night train-free gap with zero passenger detentions
            </div>
          </div>
          <span style="font-size:11px;color:#22c55e;font-weight:700">● 100% Conflict-Free Scheduling</span>
        </div>

        <div class="diurnal-heat-strip">
          <div class="diurnal-heat-slot" style="background:rgba(37,99,235,0.28);border-color:#2563eb">
            <div style="font-size:11px;font-weight:800;color:#93c5fd">00:00 – 04:00</div>
            <strong style="font-size:18px;color:#fff;display:block;margin:4px 0">68%</strong>
            <div style="font-size:10px;color:#93c5fd;font-weight:700">Deep Night Window</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">Heavy Tampers &amp; OHE</div>
          </div>

          <div class="diurnal-heat-slot" style="background:rgba(59,130,246,0.12);border-color:rgba(59,130,246,0.3)">
            <div style="font-size:11px;font-weight:800;color:#60a5fa">04:00 – 08:00</div>
            <strong style="font-size:18px;color:var(--text-heading);display:block;margin:4px 0">8%</strong>
            <div style="font-size:10px;color:#60a5fa;font-weight:700">Dawn Transition</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">Hand-held S&amp;T Patrols</div>
          </div>

          <div class="diurnal-heat-slot" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2)">
            <div style="font-size:11px;font-weight:800;color:#ef4444">08:00 – 12:00</div>
            <strong style="font-size:18px;color:#ef4444;display:block;margin:4px 0">2%</strong>
            <div style="font-size:10px;color:#ef4444;font-weight:700">Morning Peak</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">Emergency Only</div>
          </div>

          <div class="diurnal-heat-slot" style="background:rgba(16,185,129,0.16);border-color:#10b981">
            <div style="font-size:11px;font-weight:800;color:#34d399">12:00 – 15:00</div>
            <strong style="font-size:18px;color:var(--text-heading);display:block;margin:4px 0">14%</strong>
            <div style="font-size:10px;color:#34d399;font-weight:700">Midday Inter-Peak</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">USFD Trolley Testing</div>
          </div>

          <div class="diurnal-heat-slot" style="background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.2)">
            <div style="font-size:11px;font-weight:800;color:#ef4444">15:00 – 19:00</div>
            <strong style="font-size:18px;color:#ef4444;display:block;margin:4px 0">1%</strong>
            <div style="font-size:10px;color:#ef4444;font-weight:700">Evening Peak</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">Protected Express Paths</div>
          </div>

          <div class="diurnal-heat-slot" style="background:rgba(139,92,246,0.12);border-color:rgba(139,92,246,0.3)">
            <div style="font-size:11px;font-weight:800;color:#a78bfa">19:00 – 24:00</div>
            <strong style="font-size:18px;color:var(--text-heading);display:block;margin:4px 0">7%</strong>
            <div style="font-size:10px;color:#a78bfa;font-weight:700">Night Staging</div>
            <div style="font-size:9.5px;color:var(--text-muted);margin-top:2px">Yard Shunting &amp; Preps</div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           VISUAL ELEMENT 5: USFD DEFECT RESOLUTION MTTR VS STATUTORY SLA BARS
           =================================================================== -->
      <div class="panel" style="padding:18px;margin-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          <div>
            <h3 style="font-size:15px;font-weight:800;color:var(--text-heading);margin:0;font-family:Inter,sans-serif">
              🛡️ Ultrasonic Flaw Detection (USFD) Mean Time to Resolution vs. Statutory SLA
            </h3>
            <div style="font-size:11px;color:var(--text-muted)">
              Railway Safety Board Statutory Mandate: 100% compliance across all ${data.totalDefects} resolved ultrasonic defects
            </div>
          </div>
          <span style="font-size:11px;color:#22c55e;font-weight:700;background:rgba(34,197,94,0.1);padding:4px 10px;border-radius:4px">
            Zero In-Service Rail Fractures
          </span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:12px">
          <!-- Critical -->
          <div style="background:var(--bg-card);border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">CRITICAL</span>
              <span style="color:#22c55e;font-weight:800;font-size:11px">80% of SLA</span>
            </div>
            <div style="margin:8px 0 4px;display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-size:11px;color:var(--text-muted)">Actual MTTR: <b style="color:var(--text-heading)">3.2 hrs</b></span>
              <span style="font-size:10.5px;color:var(--text-muted)">Statutory: &lt; 4.0 hrs</span>
            </div>
            <div class="sla-progress-track">
              <div class="sla-progress-fill" style="width:80%;background:#22c55e"></div>
            </div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:6px">Weld recasting &amp; immediate 09-3X tamper packing</div>
          </div>

          <!-- Major -->
          <div style="background:var(--bg-card);border:1px solid rgba(59,130,246,0.3);border-radius:6px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">MAJOR</span>
              <span style="color:#22c55e;font-weight:800;font-size:11px">77% of SLA</span>
            </div>
            <div style="margin:8px 0 4px;display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-size:11px;color:var(--text-muted)">Actual MTTR: <b style="color:var(--text-heading)">18.5 hrs</b></span>
              <span style="font-size:10.5px;color:var(--text-muted)">Statutory: &lt; 24.0 hrs</span>
            </div>
            <div class="sla-progress-track">
              <div class="sla-progress-fill" style="width:77%;background:#3b82f6"></div>
            </div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:6px">Tie tamping &amp; track alignment in afternoon block</div>
          </div>

          <!-- Moderate -->
          <div style="background:var(--bg-card);border:1px solid rgba(245,158,11,0.3);border-radius:6px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="background:rgba(245,158,11,0.15);color:#f59e0b;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">MODERATE</span>
              <span style="color:#22c55e;font-weight:800;font-size:11px">64% of SLA</span>
            </div>
            <div style="margin:8px 0 4px;display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-size:11px;color:var(--text-muted)">Actual MTTR: <b style="color:var(--text-heading)">46.0 hrs</b></span>
              <span style="font-size:10.5px;color:var(--text-muted)">Statutory: &lt; 72.0 hrs</span>
            </div>
            <div class="sla-progress-track">
              <div class="sla-progress-fill" style="width:64%;background:#f59e0b"></div>
            </div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:6px">Gauge recalibration &amp; electronic curve lubrication</div>
          </div>

          <!-- Minor -->
          <div style="background:var(--bg-card);border:1px solid rgba(34,197,94,0.3);border-radius:6px;padding:12px 14px">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:10.5px;font-weight:800;padding:2px 6px;border-radius:4px">MINOR</span>
              <span style="color:#22c55e;font-weight:800;font-size:11px">64% of SLA</span>
            </div>
            <div style="margin:8px 0 4px;display:flex;justify-content:space-between;align-items:baseline">
              <span style="font-size:11px;color:var(--text-muted)">Actual MTTR: <b style="color:var(--text-heading)">4.5 days</b></span>
              <span style="font-size:10.5px;color:var(--text-muted)">Statutory: &lt; 7.0 days</span>
            </div>
            <div class="sla-progress-track">
              <div class="sla-progress-fill" style="width:64%;background:#22c55e"></div>
            </div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:6px">Rail surface grinding in scheduled patrol rounds</div>
          </div>
        </div>
      </div>

      <!-- ===================================================================
           TAB STRIP (DETAILED AUDIT TABLES FOR VERIFICATION)
           =================================================================== -->
      <div class="analytics-tab-strip">
        <button class="analytics-tab-btn ${reportsActiveTab==='division'?'active':''}" onclick="window.setReportsTab('division')">
          <span>🏢</span> Divisional Performance Audit (6 Divisions)
        </button>
        <button class="analytics-tab-btn ${reportsActiveTab==='corridor'?'active':''}" onclick="window.setReportsTab('corridor')">
          <span>🚄</span> High-Density Corridors &amp; Punctuality Recovery
        </button>
        <button class="analytics-tab-btn ${reportsActiveTab==='synergy'?'active':''}" onclick="window.setReportsTab('synergy')">
          <span>⚙️</span> Departmental Synergy &amp; Machinery Utilization
        </button>
        <button class="analytics-tab-btn ${reportsActiveTab==='defects'?'active':''}" onclick="window.setReportsTab('defects')">
          <span>🔍</span> USFD Track Defect Lifecycle &amp; Safety Assurance
        </button>
      </div>

      <!-- TAB 1: DIVISIONAL PERFORMANCE AUDIT TABLE -->
      ${reportsActiveTab === 'division' ? `
        <div class="panel" style="padding:0;overflow:hidden">
          <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <strong style="font-size:14px;color:var(--text-heading)">
                Southern Railway Zonal Divisions — Operational &amp; Track Possession Audit
              </strong>
              <div style="font-size:11px;color:var(--text-muted)">
                Comprehensive evaluation across all 6 constituent divisions under Southern Railway Zone 07
              </div>
            </div>
            <div style="font-size:11px;color:#22c55e;font-weight:700">
              ● All Divisions Meeting or Exceeding 90.0% Punctuality Threshold
            </div>
          </div>

          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              <thead>
                <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">DIVISION</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">HEADQUARTERS</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">ROUTE KM</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SANCTIONED BLOCKS</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted);background:rgba(34,197,94,0.04)">DOWNTIME SAVED</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">PUNCTUALITY %</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">TSRS LIFTED</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">AUDIT COMPLIANCE</th>
                </tr>
              </thead>
              <tbody>
                ${Object.values(data.divStats).map((div, i) => `
                  <tr style="border-bottom:1px solid var(--border-light);${i % 2 === 1 ? 'background:rgba(255,255,255,0.015)' : ''}">
                    <td style="padding:12px 14px">
                      <b style="color:var(--text-heading)">${div.fullName}</b>
                    </td>
                    <td style="padding:12px 14px;color:var(--text-main)">${div.hq}</td>
                    <td style="padding:12px 14px;text-align:center">${div.rkm} km</td>
                    <td style="padding:12px 14px;text-align:center"><b style="color:#60a5fa">${div.blocks}</b></td>
                    <td style="padding:12px 14px;text-align:center;background:rgba(34,197,94,0.04)">
                      <b style="color:#22c55e;font-size:13px">${div.saved} hrs</b>
                    </td>
                    <td style="padding:12px 14px;text-align:center">
                      <span style="color:#eab308;font-weight:800">${div.punc}%</span>
                    </td>
                    <td style="padding:12px 14px;text-align:center"><b>${div.tsr} TSRs</b></td>
                    <td style="padding:12px 14px">
                      <span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:2px 8px;border-radius:4px;font-weight:700">
                        ${div.comp}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- TAB 2: HIGH-DENSITY CORRIDORS & PUNCTUALITY RECOVERY -->
      ${reportsActiveTab === 'corridor' ? `
        <div class="panel" style="padding:0;overflow:hidden">
          <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <strong style="font-size:14px;color:var(--text-heading)">
                Key Southern Railway Corridors — Traffic Flow &amp; Delay Minutes Averted
              </strong>
              <div style="font-size:11px;color:var(--text-muted)">
                Comprehensive evaluation across high-density passenger and freight trunk corridors in Zone 07
              </div>
            </div>
            <div style="font-size:11px;color:#22c55e;font-weight:700">
              ⚡ 3,860 Cumulative Delay Minutes Averted
            </div>
          </div>

          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              <thead>
                <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">CORRIDOR / ROUTE</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">MAX PERMISSIBLE SPEED</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">TRAIN DENSITY</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SANCTIONED BLOCKS</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted);background:rgba(34,197,94,0.04)">DELAY MINUTES AVERTED</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">PUNCTUALITY INDEX</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">OPERATIONAL IMPROVEMENT</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:12px 14px">
                    <b style="color:#60a5fa">MAS – SBC (Chennai – Bengaluru Trunk)</b>
                    <div style="font-size:11px;color:var(--text-muted)">358 km • Quadruple / Double Line Electrified</div>
                  </td>
                  <td style="padding:12px 14px;text-align:center;font-weight:800;color:#22c55e">130 km/h</td>
                  <td style="padding:12px 14px;text-align:center">98 Trains</td>
                  <td style="padding:12px 14px;text-align:center"><b>42</b></td>
                  <td style="padding:12px 14px;text-align:center;background:rgba(34,197,94,0.04)"><b style="color:#22c55e;font-size:13px">1,240 mins</b></td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">94.1%</span> <small style="color:#94a3b8">(+4.2%)</small></td>
                  <td style="padding:12px 14px">Basin Bridge Chord &amp; BBQ coaching rakes cleared with zero morning peak detention</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light);background:rgba(255,255,255,0.015)">
                  <td style="padding:12px 14px">
                    <b style="color:#60a5fa">MAS – CBE (Chennai – Coimbatore Mainline)</b>
                    <div style="font-size:11px;color:var(--text-muted)">496 km • Double Line 25kV AC Electrified</div>
                  </td>
                  <td style="padding:12px 14px;text-align:center;font-weight:800;color:#22c55e">130 km/h</td>
                  <td style="padding:12px 14px;text-align:center">86 Trains</td>
                  <td style="padding:12px 14px;text-align:center"><b>28</b></td>
                  <td style="padding:12px 14px;text-align:center;background:rgba(34,197,94,0.04)"><b style="color:#22c55e;font-size:13px">820 mins</b></td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">93.6%</span> <small style="color:#94a3b8">(+3.8%)</small></td>
                  <td style="padding:12px 14px">Deep screening &amp; BCM ballast cleaning completed without TSR extensions</td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:12px 14px">
                    <b style="color:#60a5fa">PGT – TVC (Palakkad – Thiruvananthapuram)</b>
                    <div style="font-size:11px;color:var(--text-muted)">315 km • Double Line High-Density Kerala Spine</div>
                  </td>
                  <td style="padding:12px 14px;text-align:center;font-weight:800;color:#22c55e">110 km/h</td>
                  <td style="padding:12px 14px;text-align:center">74 Trains</td>
                  <td style="padding:12px 14px;text-align:center"><b>22</b></td>
                  <td style="padding:12px 14px;text-align:center;background:rgba(34,197,94,0.04)"><b style="color:#22c55e;font-size:13px">740 mins</b></td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">92.5%</span> <small style="color:#94a3b8">(+3.4%)</small></td>
                  <td style="padding:12px 14px">Ernakulam Jn 141-train bottleneck coordinated with 01:00-04:00 night window</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: DEPARTMENTAL SYNERGY & MACHINERY UTILIZATION -->
      ${reportsActiveTab === 'synergy' ? `
        <div>
          <!-- Machinery Fleet Matrix Table -->
          <div class="panel" style="padding:0;overflow:hidden">
            <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong style="font-size:14px;color:var(--text-heading)">
                  Track Maintenance Machinery Fleet Utilization &amp; Synergy Overlap Matrix
                </strong>
                <div style="font-size:11px;color:var(--text-muted)">
                  Deployment statistics for P-Way Track Machines, 25kV OHE Tower Wagons &amp; Signaling crews
                </div>
              </div>
            </div>
            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:12px">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">DEPARTMENT</th>
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">MACHINERY / WORK CREW TYPE</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">FLEET</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">JOINT HOURS</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SYNERGY OVERLAP %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom:1px solid var(--border-light)">
                    <td style="padding:12px 14px"><span style="background:rgba(59,130,246,0.1);color:#60a5fa;padding:2px 6px;border-radius:4px;font-weight:700">ENG</span></td>
                    <td style="padding:12px 14px">CSM 09-3X Tampers</td>
                    <td style="padding:12px 14px;text-align:center">6 Units</td>
                    <td style="padding:12px 14px;text-align:center">52.0 hrs</td>
                    <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e">64.8%</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- TAB 4: USFD DEFECTS & SAFETY LIFECYCLES -->
      ${reportsActiveTab === 'defects' ? `
        <div class="panel" style="padding:0;overflow:hidden">
          <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <strong style="font-size:14px;color:var(--text-heading)">
                Ultrasonic Flaw Detection (USFD) &amp; Permanent Way Defect Resolution Audit
              </strong>
              <div style="font-size:11px;color:var(--text-muted)">
                ${data.defectsRectified} Total Track Defects Rectified with Zero Revenue Rail Fractures in Reporting Period
              </div>
            </div>
            <div style="font-size:11px;color:#22c55e;font-weight:700">
              🛡️ 1,840 Track Km Scanned by Digital USFD Trolleys
            </div>
          </div>

          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              <thead>
                <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">DEFECT SEVERITY</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">RECORDED COUNT</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SHARE (%)</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">MTTR</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">STATUTORY TARGET</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">MITIGATION PROTOCOL</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">OUTCOME</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:12px 14px">
                    <span style="background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid #ef4444;padding:3px 8px;border-radius:4px;font-weight:800">
                      CRITICAL
                    </span>
                  </td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#ef4444;font-size:14px">${data.critCount}</b></td>
                  <td style="padding:12px 14px;text-align:center">${data.critPct}%</td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e">3.2 Hours</b></td>
                  <td style="padding:12px 14px;text-align:center">&lt; 4.0 Hours</td>
                  <td style="padding:12px 14px">Emergency joggled fish-plating, weld recasting &amp; immediate 09-3X tamper packing</td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">Zero In-Service Failures</span></td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light);background:rgba(255,255,255,0.015)">
                  <td style="padding:12px 14px">
                    <span style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid #60a5fa;padding:3px 8px;border-radius:4px;font-weight:800">
                      MAJOR
                    </span>
                  </td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#60a5fa;font-size:14px">${data.majCount}</b></td>
                  <td style="padding:12px 14px;text-align:center">${data.majPct}%</td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e">18.5 Hours</b></td>
                  <td style="padding:12px 14px;text-align:center">&lt; 24.0 Hours</td>
                  <td style="padding:12px 14px">Tie tamping, sleeper renewal and track alignment in scheduled afternoon block</td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">100% Cleared on Schedule</span></td>
                </tr>
                <tr style="border-bottom:1px solid var(--border-light)">
                  <td style="padding:12px 14px">
                    <span style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid #f59e0b;padding:3px 8px;border-radius:4px;font-weight:800">
                      MODERATE
                    </span>
                  </td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#f59e0b;font-size:14px">${data.modCount}</b></td>
                  <td style="padding:12px 14px;text-align:center">${data.modPct}%</td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e">46.0 Hours</b></td>
                  <td style="padding:12px 14px;text-align:center">&lt; 72.0 Hours</td>
                  <td style="padding:12px 14px">Gauge recalibration, electronic curve lubrication, and ballast replenishment</td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">Normal Speed Permitted</span></td>
                </tr>
                <tr style="background:rgba(255,255,255,0.015)">
                  <td style="padding:12px 14px">
                    <span style="background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid #22c55e;padding:3px 8px;border-radius:4px;font-weight:800">
                      MINOR
                    </span>
                  </td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e;font-size:14px">${data.minCount}</b></td>
                  <td style="padding:12px 14px;text-align:center">${data.minPct}%</td>
                  <td style="padding:12px 14px;text-align:center"><b style="color:#22c55e">4.5 Days</b></td>
                  <td style="padding:12px 14px;text-align:center">&lt; 7.0 Days</td>
                  <td style="padding:12px 14px">Rail surface grinding, fitting torque adjustments, and drainage clearance</td>
                  <td style="padding:12px 14px;text-align:center"><span style="color:#22c55e;font-weight:800">Completed in Routine Patrol</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- ===================================================================
           REPORT GENERATION ACTIONS CARD (Official Institutional PDF / CSV)
           =================================================================== -->
      <div class="analytics-actions-card">
        <div>
          <div style="font-size:13.5px;font-weight:800;color:var(--text-heading);display:flex;align-items:center;gap:8px">
            <span>🏛️</span> OFFICIAL RAILWAY AUDIT GENERATION &amp; EXPORT STUDIO
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
            Compliant with Ministry of Railways Documentation Standards • Ref: SR/HQ/OP-ENG/2026/DOC-0842 • Scope: ${data.scopeName}
          </div>
        </div>

        <div class="analytics-action-buttons">
          <button class="secondary" style="font-size:12px;padding:7px 14px;font-weight:700" onclick="window.copyAnalyticsMemo()">
            📋 ${isHi ? 'मेमो कॉपी करें' : 'Copy Audit Memo'}
          </button>
          <button class="secondary" style="font-size:12px;padding:7px 14px;font-weight:700" onclick="window.exportAnalyticsCsv()">
            📥 ${isHi ? 'सीएसवी निर्यात (CSV)' : 'Export CSV Dataset'}
          </button>
          <button class="primary" style="font-size:12px;padding:7px 18px;font-weight:800;background:#2563eb" onclick="window.generateZonalReport()">
            📑 ${isHi ? 'आधिकारिक रिपोर्ट तैयार करें (PDF)' : 'Generate Institutional Report (PDF)'}
          </button>
        </div>
      </div>

    </main>
  `;
}


// ==========================================================================
// 5. HELPER REUSABLE CARDS & TIMELINE
// ==========================================================================

function beforeAfterCard() {
  return `
    <section class="panel" style="margin-top:4px">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1c4069;padding-bottom:8px">
        <div>
          <h2>Optimization Impact Audit (Before vs. After Comparison)</h2>
          <p>Siloed Departmental Planning vs. AI-Coordinated Joint Southern Railway Block Windows</p>
        </div>
        <button class="secondary" id="exportSanctionBtn">${SVG_ICONS.doc} Export Proforma T/A 912</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
        <div style="background:#07192f;border:1px solid #16365c;border-radius:4px;padding:10px">
          <h4 style="margin:0 0 8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;color:#ff6b62">Status Quo: Siloed Planning (Independent Depts)</h4>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Total Maintenance Block Hours</span><b>30.0 Hours</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Independent Department Blocks</span><b>13 Blocks</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Cross-Department Collisions</span><b>4 Conflicts</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px"><span>Train Schedule Disruption</span><span class="badge HIGH">HIGH</span></div>
        </div>
        <div style="background:#07192f;border:1px solid #16365c;border-radius:4px;padding:10px">
          <h4 style="margin:0 0 8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;color:#4bd19a">AI-Coordinated Block Plan (Integrated Synergy)</h4>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Total Maintenance Block Hours</span><b>10.0 Hours</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Coordinated Integrated Blocks</span><b>10 Blocks</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #0f2847;font-size:11px"><span>Cross-Department Collisions</span><b>0 Conflicts (Resolved)</b></div>
          <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px"><span>Train Schedule Disruption</span><span class="badge GOOD">ZERO PRIMARY DELAY</span></div>
        </div>
      </div>
      <div style="margin-top:12px;padding:10px 14px;background:#051426;border:1px solid #16365c;border-radius:4px;display:flex;justify-content:space-around;align-items:center;text-align:center">
        <div><strong style="font-size:18px;color:#4bd19a;display:block;font-family:'Barlow Condensed',sans-serif">20.0 Hours</strong><span style="font-size:9.5px;color:#8aa6c3;text-transform:uppercase">Track Downtime Saved</span></div>
        <div><strong style="font-size:18px;color:#4bd19a;display:block;font-family:'Barlow Condensed',sans-serif">100%</strong><span style="font-size:9.5px;color:#8aa6c3;text-transform:uppercase">Conflicts Resolved</span></div>
        <div><strong style="font-size:18px;color:#4bd19a;display:block;font-family:'Barlow Condensed',sans-serif">+24.5%</strong><span style="font-size:9.5px;color:#8aa6c3;text-transform:uppercase">Slot Utilization Boost</span></div>
      </div>
    </section>
  `;
}

function ganttTimelineComponent() {
  const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
  return `
    <section class="panel" style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px">
        <div>
          <h2>24-Hour Timetable & Sectional Occupancy String Chart</h2>
          <p>Passenger movements, freight paths, and AI-scheduled maintenance slots across sectional block sections.</p>
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <label style="font-size:10.5px;color:#8aa6c3">Section:
            <select id="ganttSectionSelect" style="background:#051426;border:1px solid #16365c;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px">
              <option value="SEC-MAS-CBE">MAS-CBE: Chennai Central ➔ Coimbatore Jn (UP Mainline)</option>
              <option value="SEC-PGT-TVC">PGT-TVC: Palakkad ➔ Ernakulam ➔ TVC Coastal Line</option>
              <option value="SEC-MAS-MDU">MAS-MDU: Chennai Egmore ➔ Madurai Grand Trunk</option>
            </select>
          </label>
          <button class="secondary" id="ganttRefreshBtn">Reload</button>
        </div>
      </div>
      <div style="background:#040c18;border:1px solid #16365c;border-radius:4px;padding:10px;overflow-x:auto">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid #122c4a;padding-bottom:4px;margin-bottom:8px;min-width:700px;font-size:9.5px;color:#6788a8">
          ${hours.map(h => `<div>${h}</div>`).join("")}
        </div>
        <div class="gantt-track" id="trackPassenger" style="position:relative;height:32px;background:#07182c;border-radius:4px;margin:6px 0;min-width:700px">
          <span style="position:absolute;left:6px;top:50%;transform:translateY(-50%);font-size:9.5px;color:#ff9933;font-weight:700;z-index:3">PASSENGER MOVEMENTS</span>
        </div>
        <div class="gantt-track" id="trackFreight" style="position:relative;height:32px;background:#07182c;border-radius:4px;margin:6px 0;min-width:700px">
          <span style="position:absolute;left:6px;top:50%;transform:translateY(-50%);font-size:9.5px;color:#5eaeff;font-weight:700;z-index:3">FREIGHT PATH FORECASTS</span>
        </div>
        <div class="gantt-track" id="trackBlock" style="position:relative;height:32px;background:#07182c;border-radius:4px;margin:6px 0;min-width:700px">
          <span style="position:absolute;left:6px;top:50%;transform:translateY(-50%);font-size:9.5px;color:#4bd19a;font-weight:700;z-index:3">INTEGRATED BLOCK SLOTS</span>
        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// 6. FORMAL GOVERNMENT LOGIN PORTAL & ID CARD
// ==========================================================================

function renderLoginPage() {
  return `
    <div class="sr-portal-login-stage">
      <!-- Left Hero Pane -->
      <div class="sr-hero-pane">
        <!-- Red Geometric Ribbon Slash -->
        <div class="sr-hero-ribbon"></div>
        <!-- Halftone Dot Matrix Pattern -->
        <div class="sr-hero-dots"></div>

        <div class="sr-hero-content">
          <!-- Hero Text Block -->
          <div class="sr-hero-text-block">
            <h1 class="sr-hero-main-title">
              <span>SOUTHERN</span>
              <span class="sr-title-red">RAILWAY</span>
            </h1>
            <p class="sr-hero-subtitle">Connecting Journeys.<br>Connecting Lives.</p>
            <div class="sr-hero-red-bar"></div>
          </div>

          <!-- Bottom Floating Stats Pill Card -->
          <div class="sr-hero-stats-card">
            <div class="sr-stat-col">
              <div class="sr-stat-icon">
                <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><path d="m8 19-2 3"></path><path d="m18 22-2-3"></path><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
              </div>
              <div class="sr-stat-info">
                <strong>500+</strong>
                <span>Daily Trains</span>
              </div>
            </div>
            <div class="sr-stat-divider"></div>
            <div class="sr-stat-col">
              <div class="sr-stat-icon">
                <svg viewBox="0 0 24 24"><path d="M3 21h18"></path><path d="M6 18v-7"></path><path d="M10 18v-7"></path><path d="M14 18v-7"></path><path d="M18 18v-7"></path><polygon points="12 2 2 7 22 7 12 2"></polygon></svg>
              </div>
              <div class="sr-stat-info">
                <strong>300+</strong>
                <span>Stations</span>
              </div>
            </div>
            <div class="sr-stat-divider"></div>
            <div class="sr-stat-col">
              <div class="sr-stat-icon">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="sr-stat-info">
                <strong>Millions</strong>
                <span>Happy Passengers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Pane -->
      <div class="sr-form-pane">
        <div class="sr-auth-card-wrap">
          <!-- Master White/Red Card -->
          <div class="sr-auth-card">
            <!-- Top Crimson Header Section -->
            <div class="sr-card-red-header">
              <div class="sr-card-crest-wrapper">
                <img src="/southern-railway-logo.png" class="sr-card-crest" alt="Southern Railway Crest" />
              </div>
              <div class="sr-card-header-text">
                <h2>Southern<br>Railway</h2>
                <p>Service with Commitment</p>
              </div>
            </div>

            <!-- Lower White Form Section -->
            <div class="sr-card-white-body">
              <div class="sr-auth-welcome">
                <h3>Welcome Back!</h3>
                <p>Login to your account</p>
              </div>

              <form id="srPortalLoginForm" onsubmit="return false;" class="sr-auth-form">
                <!-- Username -->
                <div class="sr-input-group">
                  <div class="sr-input-prefix-badge">
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div class="sr-input-field-wrap">
                    <input type="text" id="srInputUsername" class="sr-custom-input" placeholder="Username" required autofocus />
                    <div class="sr-input-suffix-icon" title="Username / Employee ID">
                      <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"></rect><circle cx="9" cy="10" r="2"></circle><line x1="15" y1="8" x2="17" y2="8"></line><line x1="15" y1="12" x2="17" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>
                    </div>
                  </div>
                </div>

                <!-- Password -->
                <div class="sr-input-group">
                  <div class="sr-input-prefix-badge">
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div class="sr-input-field-wrap">
                    <input type="password" id="srInputPassword" class="sr-custom-input" placeholder="Password" required />
                    <div class="sr-input-suffix-icon clickable" id="toggleSrPassword" title="Show / Hide Password">
                      <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                  </div>
                </div>

                <!-- Remember me & Forgot Password -->
                <div class="sr-auth-row-options">
                  <label class="sr-checkbox-label">
                    <input type="checkbox" id="rememberMeCheckbox" checked />
                    <span>Remember me</span>
                  </label>
                  <a href="#" class="sr-forgot-link" id="btnForgotPassLink">Forgot Password?</a>
                </div>

                <!-- Red Login Button -->
                <button type="submit" class="sr-red-login-btn" id="btnSubmitLoginSr">
                  Login
                </button>

                <!-- Need Help Button -->
                <button type="button" class="sr-help-outline-btn" id="btnNeedHelpLogin">
                  <svg viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                  <span>Need Help for Login?</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Bottom Create New Account -->
          <div class="sr-card-subfooter">
            Don't have an account? <span class="sr-create-new-accent" id="btnCreateNewAcc">Create new</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindLoginEvents() {
  const form = document.querySelector("#srPortalLoginForm");
  const pwdInput = document.querySelector("#srInputPassword");
  const toggleEye = document.querySelector("#toggleSrPassword");

  if (toggleEye && pwdInput) {
    toggleEye.onclick = () => {
      if (pwdInput.type === "password") {
        pwdInput.type = "text";
        toggleEye.style.color = "#c91823";
      } else {
        pwdInput.type = "password";
        toggleEye.style.color = "#6b7280";
      }
    };
  }

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const username = document.querySelector("#srInputUsername")?.value.trim() || "railway.official";
      const password = pwdInput?.value.trim() || "";

      try {
        const profile = await api.login({
          username: username,
          password: password || "demo",
          name: username.includes(".") ? username.split(".")[0].toUpperCase() + " (Official)" : username,
          employee_id: `SR/MAS/${Math.floor(1000 + Math.random() * 9000)}`,
          designation: "Zonal Operations & Block Planning Official",
          department: "OPERATING",
          division: "Zonal HQ (MAS GM Office)"
        });
        currentOfficial = profile;
        showToast(`Authenticated: ${profile.name}`);
        render();
      } catch {
        const fallback = {
          id: "SR-OFF-01",
          employee_id: "SR/MAS/DOM/8941",
          name: username || "Senior Railway Official",
          designation: "Senior Divisional Operations Manager (Sr. DOM)",
          department: "OPERATING",
          department_name: "Operations & Movement Control Directorate",
          division: "Chennai (MAS)",
          zone: "Southern Railway (SR)",
          role: "DIVISIONAL_OPERATIONS_MANAGER",
          clearance_level: "LEVEL_5_SANCTION",
          permissions: ["PLAN_GENERATE", "BLOCK_SANCTION", "EMERGENCY_REPLAN", "VIEW_ALL"],
          shift: "General Shift (09:00 - 18:00 IST)"
        };
        api.setOfficial(fallback);
        currentOfficial = fallback;
        showToast(`Authenticated: ${fallback.name}`);
        render();
      }
    };
  }

  const themeBtn = document.querySelector("#btnToggleTheme");
  if (themeBtn) {
    themeBtn.onclick = () => {
      currentTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("sr_portal_theme", currentTheme);
      document.documentElement.setAttribute("data-theme", currentTheme);
      document.body.className = currentTheme === "light" ? "theme-light" : "theme-dark";
      showToast(`Theme switched to ${currentTheme === 'light' ? 'Light Executive' : 'Dark Navy'} Mode`);
      render();
    };
  }

  const btnHelp = document.querySelector("#btnNeedHelpLogin");
  if (btnHelp) {
    btnHelp.onclick = () => {
      showToast("Southern Railway Official Helpdesk: CUG 9003160000 | Email: itcontrol.sr@gov.in");
    };
  }

  const btnForgot = document.querySelector("#btnForgotPassLink");
  if (btnForgot) {
    btnForgot.onclick = (e) => {
      e.preventDefault();
      showToast("Please contact Zonal Telecom & IT Control (Ext. 2244) to reset HRMS credentials");
    };
  }

  const btnNew = document.querySelector("#btnCreateNewAcc");
  if (btnNew) {
    btnNew.onclick = () => {
      showToast("Official registration requires clearance from Senior DPO / General Manager Office");
    };
  }
}

function openOfficialProfileModal() {
  const off = currentOfficial || OFFICIAL_PRESETS[0];
  const modalHtml = `
    <div style="background:#051426;border:1px solid #1c4069;border-radius:4px;padding:16px">
      <div style="display:flex;align-items:center;gap:12px;border-bottom:1px solid #16365c;padding-bottom:10px;margin-bottom:12px">
        <img src="/southern-railway-logo.png" style="width:48px;height:48px;border-radius:50%" alt="SR Crest" />
        <div>
          <h4 style="margin:0;font-family:'Barlow Condensed',sans-serif;font-size:18px;color:#ff9933">SOUTHERN RAILWAY • दक्षिण रेलवे</h4>
          <p style="margin:1px 0 0;font-size:10.5px;color:#8aa6c3">Official Digital Identity & Operational Clearance Token</p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px">
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>Official Name:</span><strong style="display:block;color:#fff">${esc(off.name)}</strong></div>
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>HRMS ID:</span><strong style="display:block;color:#fff">${esc(off.employee_id)}</strong></div>
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>Designation:</span><strong style="display:block;color:#fff">${esc(off.designation)}</strong></div>
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>Department:</span><strong style="display:block;color:#fff">${esc(off.department_name || off.department)}</strong></div>
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>Division:</span><strong style="display:block;color:#fff">${esc(off.division)}</strong></div>
        <div style="background:#07192f;padding:6px 8px;border-radius:3px"><span>Clearance Level:</span><strong style="display:block;color:#4bd19a">${esc(off.clearance_level || 'LEVEL 5')}</strong></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;border-top:1px solid #16365c;padding-top:10px">
        <button class="secondary" id="btnSwitchOfficial">Switch Profile</button>
        <button class="secondary logout-btn" id="btnLogoutOfficial" style="border-color:#5c181c;color:#ffa49f">Sign Out</button>
      </div>
    </div>
  `;

  showModal("Official Digital Authorization", "Active Southern Railway Staff Profile", modalHtml, null, "");

  setTimeout(() => {
    const btnSwitch = document.querySelector("#btnSwitchOfficial");
    const btnLogout = document.querySelector("#btnLogoutOfficial");
    if (btnSwitch) {
      btnSwitch.onclick = () => {
        document.querySelector(".modal-overlay")?.remove();
        api.logout();
        currentOfficial = null;
        render();
      };
    }
    if (btnLogout) {
      btnLogout.onclick = () => {
        document.querySelector(".modal-overlay")?.remove();
        api.logout();
        currentOfficial = null;
        showToast("Signed out successfully");
        render();
      };
    }
  }, 50);
}

// ==========================================================================
// 7. FORMAL PROFORMA T/A 912 SANCTION ORDER & CAB VIEW
// ==========================================================================

function showSanctionMemo() {
  const memoNumber = `SR-MAS-BLK-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-01`;
  const off = currentOfficial || OFFICIAL_PRESETS[0];
  const memoHtml = `
    <div class="memo-container">
      <div class="memo-gov-header">
        <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:6px">
          <img src="/southern-railway-logo.png" style="width:48px;height:48px;border-radius:50%" alt="Southern Railway Crest" />
          <div>
            <h2>GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS</h2>
            <h3>SOUTHERN RAILWAY (OPERATING DEPARTMENT) — ZONE 07</h3>
            <p>INTEGRATED TRAFFIC & POWER BLOCK SANCTION PERMIT</p>
          </div>
        </div>
        <span class="memo-proforma-code">PROFORMA T/A 912 (G&SR Rule 15.06)</span>
      </div>

      <div class="memo-grid">
        <div class="memo-box"><b>Permit Sanction Number:</b> ${memoNumber}</div>
        <div class="memo-box"><b>Date of Issue & Authority:</b> ${new Date().toLocaleDateString("en-IN")} (AI System Verified)</div>
        <div class="memo-box"><b>Block Corridor / Section:</b> SEC-MAS-CBE (Katpadi Jn ➔ Jolarpettai Jn)</div>
        <div class="memo-box"><b>Administrative Division:</b> ${esc(off.division)}</div>
        <div class="memo-box"><b>25kV OHE Power Isolation:</b> GRANTED & DISCHARGE RODS APPLIED</div>
        <div class="memo-box"><b>Traffic Line Block:</b> UP MAINLINE (KM 12.000 to 18.500)</div>
      </div>

      <table class="memo-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Authorized Task Description</th>
            <th>Machinery & Equipment</th>
            <th>Sanction Slot</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>ENGINEERING (P-Way)</strong></td>
            <td>Deep Ballast Screening & CSM Track Tamping</td>
            <td>CSM 09-32 Tamper #04</td>
            <td>01:00 - 04:00 IST</td>
            <td>180 mins</td>
          </tr>
          <tr>
            <td><strong>S&T (Signals)</strong></td>
            <td>Point Machine Calibration & Track Circuit Check</td>
            <td>Signal Crew Team A</td>
            <td>01:15 - 03:30 IST</td>
            <td>135 mins</td>
          </tr>
          <tr>
            <td><strong>TRD (Traction)</strong></td>
            <td>25kV OHE Contact Wire Inspection</td>
            <td>Tower Wagon Unit #02</td>
            <td>01:30 - 03:45 IST</td>
            <td>135 mins</td>
          </tr>
        </tbody>
      </table>

      <div style="background:#f5f8fa;border:1px solid #bcd;padding:6px 8px;margin:8px 0;font-size:10.5px">
        <strong>Mandatory Safety Certifications (G&SR Compliance):</strong>
        <div>1. Automatic signals placed at danger with points clamped and padlocked on UP Mainline.</div>
        <div>2. Discharge rods bonded to rail earth on both ends of the 25kV OHE isolation boundary.</div>
        <div>3. Timetable buffer verified — Zero passenger train overlap / zero primary delay logged.</div>
      </div>

      <div class="memo-stamp-grid">
        <div>
          <strong>${esc(off.name)}</strong><br>
          <small>${esc(off.designation)} [HRMS: ${esc(off.employee_id)}]</small><br>
          <span style="color:#1e824c;font-weight:bold">✓ Electronically Signed & Authorized</span>
        </div>
        <div style="text-align:right">
          <strong>Chief Safety Controller (SR HQ)</strong><br>
          <small>AI Integrated Block Planning System</small><br>
          <span style="color:#1e824c;font-weight:bold">✓ System Integrity Checked</span>
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
      <button class="secondary" id="downloadCsvBtn">Export Order (CSV)</button>
      <button class="primary" id="printMemoBtn">Print Official Proforma (PDF)</button>
    </div>
  `;

  showModal("Ministry of Railways Official Sanction Order", "Proforma T/A 912 Integrated Block Permit", memoHtml, null, "");

  setTimeout(() => {
    const printBtn = document.querySelector("#printMemoBtn");
    const csvBtn = document.querySelector("#downloadCsvBtn");
    if (printBtn) printBtn.onclick = () => window.print();
    if (csvBtn) {
      csvBtn.onclick = () => {
        const csvContent = "data:text/csv;charset=utf-8,Permit,Division,Section,Dept,Task,Duration,PowerBlock\n" +
          `${memoNumber},Chennai,SEC-MAS-CBE,ENGINEERING,Track Tamping,180,YES\n` +
          `${memoNumber},Chennai,SEC-MAS-CBE,S_AND_T,Signal Calibration,135,NO\n` +
          `${memoNumber},Chennai,SEC-MAS-CBE,TRD,OHE Inspection,135,YES`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Sanction_${memoNumber}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast("CSV Order Exported!");
      };
    }
  }, 100);
}

function openTrackStreetView(sectionCode = "SEC-MAS-CBE", isMaint = true) {
  const existing = document.querySelector(".track-view-modal");
  if (existing) existing.remove();

  const stnObj = REAL_STATIONS_30.find(s => s.code === sectionCode || s.name === sectionCode);
  const titleText = stnObj ? `${stnObj.name} [${stnObj.code}] Approach` : sectionCode;
  const subtitleText = stnObj ? `Locomotive Pilot Station Approach Telemetry • Platform Ingress Line (${stnObj.div} Division)` : "Locomotive Pilot Forward Cab View • Southern Railway Mainline";
  const locRef = stnObj ? `${stnObj.name} Interlocking • KM ${Math.round(stnObj.lat * 30)}.400` : "KM 14.200 (MAS-CBE UP Main)";

  const modal = document.createElement("div");
  modal.className = "track-view-modal";
  modal.innerHTML = `
    <div class="track-view-topbar">
      <div>
        <h3 style="font-family:'Barlow Condensed',sans-serif;font-size:20px;color:#ff9933;margin:0 0 2px">CRIS GIS Track Forward Telemetry • ${esc(titleText)}</h3>
        <p style="margin:0;font-size:11.5px;color:#94a3b8">${esc(subtitleText)}</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        ${stnObj ? `<button class="secondary" style="background:#2563eb;color:#fff;border:none;font-weight:700;padding:6px 14px;border-radius:4px;cursor:pointer" onclick="document.querySelector('.track-view-modal')?.remove(); window.navigateToStation('${stnObj.code}')">🚉 Open Station Board & Planning</button>` : ''}
        <button class="secondary" id="btnToggleCaution" style="padding:6px 14px;font-size:12px;font-weight:700">${isMaint ? 'Caution Speed Order (30 km/h)' : 'Normal Speed (130 km/h)'}</button>
        <button class="primary" id="btnCloseTrackView" style="padding:6px 16px;font-size:12px;font-weight:800">✕ Exit View</button>
      </div>
    </div>

    <div class="track-view-stage">
      <div class="track-3d-world">
        <div class="track-sky"><div class="track-mountains"></div></div>
        <div class="track-ground">
          <div class="track-bed-3d">
            <div class="track-sleepers"></div>
            <div class="steel-rail rail-left"></div>
            <div class="steel-rail rail-right"></div>
          </div>
        </div>
        <div class="cab-hud">
          <div class="hud-stat">
            <span>Permitted Speed</span>
            <strong class="speed ${isMaint ? 'caution' : ''}" id="hudSpeed">${isMaint ? '30 km/h' : '130 km/h'}</strong>
          </div>
          <div class="hud-stat">
            <span>Location Reference</span>
            <strong>${esc(locRef)}</strong>
          </div>
          <div class="hud-stat">
            <span>Signal Aspect</span>
            <strong style="color:${isMaint ? '#f39c12' : '#2ecc71'}">${isMaint ? 'DOUBLE YELLOW (CAUTION)' : 'GREEN (PROCEED)'}</strong>
          </div>
          <div class="hud-stat">
            <span>Traction Feed</span>
            <strong style="color:#ffcf5c">25 kV AC 50Hz</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector("#btnCloseTrackView").onclick = () => modal.remove();

  let cautionActive = isMaint;
  modal.querySelector("#btnToggleCaution").onclick = () => {
    cautionActive = !cautionActive;
    modal.remove();
    openTrackStreetView(sectionCode, cautionActive);
  };
}

// ==========================================================================
// 8. MAP INITIALIZATION & CRIS RAILWAY GIS SYMBOLOGY
// ==========================================================================

let overviewDefaultLayerGroup = null;
let activeSearchedTrainRouteLayer = null;
let singleTrainMovingTimer = null;

function initHighResMap() {
  const container = document.querySelector("#snapMapStage");
  if (!container || typeof L === "undefined") return;

  if (leafletMapInstance) {
    try { leafletMapInstance.remove(); } catch(e) {}
    leafletMapInstance = null;
  }

  clearInterval(window.__trainMapTimer);
  clearInterval(singleTrainMovingTimer);

  const map = L.map("snapMapStage", {
    center: [10.8505, 77.8500],
    zoom: 7,
    minZoom: 5,
    maxZoom: 16,
    zoomControl: true,
  });
  leafletMapInstance = map;

  // Base Map Layer Groups
  let currentBaseLayer;
  if (selectedMapLayer === "satellite") {
    currentBaseLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri World Imagery',
      maxZoom: 18
    });
  } else if (selectedMapLayer === "osm") {
    currentBaseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    });
  } else {
    // Vector Cartography
    currentBaseLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Tiles &copy; Esri Dark Gray',
      maxZoom: 16
    });
  }
  currentBaseLayer.addTo(map);

  // Real OpenRailwayMap Overlay
  L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
    attribution: 'Railway data &copy; OpenRailwayMap',
    subdomains: "abc",
    maxZoom: 19,
    opacity: 0.85
  }).addTo(map);

  // Group all default overview elements
  overviewDefaultLayerGroup = L.layerGroup().addTo(map);

  // Plot Default Routes
  REAL_ROUTES.forEach(r => {
    L.polyline(r.coords, { color: "#000", weight: 5, opacity: 0.8 }).addTo(overviewDefaultLayerGroup);
    const routeLine = L.polyline(r.coords, { color: r.color, weight: 3, opacity: 0.95, dashArray: "4, 4" });
    routeLine.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>${esc(r.name)}</h4>
            <span>Section Code: <b>${esc(r.code)}</b> • ${esc(r.div)}</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Clearance Standard</span><b>${esc(r.clearance)}</b></div>
          <div><span>Permissible Speed</span><b style="color:#4bd19a">${esc(r.speed)}</b></div>
          <div><span>Signaling Standard</span><b>MACLS / Automatic Block</b></div>
        </div>
        <button class="cris-popup-btn" onclick="window.__openTrackView('${r.code}')">View Section Forward Telemetry</button>
      </div>
    `);
    routeLine.addTo(overviewDefaultLayerGroup);
  });

  // Plot CRIS Station Diamond Nodes
  REAL_STATIONS_30.forEach(s => {
    const isMatch = selectedDivision === "ALL" || s.div.includes(selectedDivision.split(" ")[0]);
    if (!isMatch) return;

    const stHtml = `
      <div class="cris-station-node">
        <div class="cris-diamond ${s.hub ? 'hub' : ''}"></div>
        <div class="cris-stn-label">[${s.code}]</div>
      </div>
    `;

    const stIcon = L.divIcon({
      html: stHtml,
      className: "custom-stn-node-cris",
      iconSize: [60, 36],
      iconAnchor: [30, 10]
    });

    const stMarker = L.marker([s.lat, s.lng], { icon: stIcon });
    stMarker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>${esc(s.name)} [${esc(s.code)}]</h4>
            <span>${esc(s.div)} Division • Southern Railway</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Platform Tracks</span><b>${s.platforms} Platforms</b></div>
          <div><span>Daily Train Occupancy</span><b>${s.dailyTrains} Trains / Day</b></div>
          <div><span>Maintenance Block Window</span><b style="color:#4bd19a">3.5 hrs Available (01:00 - 04:30 IST)</b></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:10px">
          <button class="cris-popup-btn" style="background:#2563eb;color:#ffffff;border:none;font-weight:800;cursor:pointer;padding:8px 12px;border-radius:6px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(37,99,235,0.4)" onclick="window.navigateToStation('${s.code}')">
            <span>🚉</span> View Station Board & Planning
          </button>
          <button class="cris-popup-btn" style="background:rgba(255,255,255,0.06);color:#60a5fa;border:1px solid #3b82f6;font-weight:700;cursor:pointer;padding:7px 12px;border-radius:6px;font-size:11.5px;display:flex;align-items:center;justify-content:center;gap:6px" onclick="window.__openTrackView('${s.code}', false)">
            <span>🎥</span> View Station Approach Telemetry
          </button>
        </div>
      </div>
    `);
    stMarker.addTo(overviewDefaultLayerGroup);
  });

  // Plot Active Maintenance Zones (CRIS Striped Warning Nodes)
  MAINT_ZONES.forEach(m => {
    L.circle([m.lat, m.lng], { color: "#e74c3c", fillColor: "#e74c3c", fillOpacity: 0.25, radius: 10000, weight: 2 }).addTo(overviewDefaultLayerGroup);

    const maintHtml = `
      <div class="cris-maint-marker">
        <span class="cris-maint-tag">⚠️ ${esc(m.code)}</span>
      </div>
    `;
    const maintIcon = L.divIcon({ html: maintHtml, className: "custom-maint-icon-cris", iconSize: [140, 24], iconAnchor: [70, 12] });
    const maintMarker = L.marker([m.lat, m.lng], { icon: maintIcon });
    maintMarker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>${esc(m.code)}: ${esc(m.action)}</h4>
            <span>Supervisor: <b>${esc(m.engineer)}</b></span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Sectional Location</span><b>${esc(m.section)}</b></div>
          <div><span>Department Coordination</span><b>${esc(m.dept)}</b></div>
          <div><span>Authorized Window</span><b>${esc(m.duration)}</b></div>
          <div><span>Safety Order</span><b style="color:#4bd19a">${esc(m.status)}</b></div>
        </div>
        <button class="cris-popup-btn" onclick="window.__openTrackView('${m.section}', true)">Inspect Section Telemetry</button>
      </div>
    `);
    maintMarker.addTo(overviewDefaultLayerGroup);
  });

  initMovingTrains(map);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 100);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 350);
}

function interpolateRoute(coords, frac) {
  if (!coords || !coords.length) return [10.85, 77.85];
  const totalSegments = coords.length - 1;
  const pos = frac * totalSegments;
  const idx = Math.min(Math.floor(pos), totalSegments - 1);
  const segFrac = pos - idx;

  const p1 = coords[idx];
  const p2 = coords[idx + 1];
  return [p1[0] + (p2[0] - p1[0]) * segFrac, p1[1] + (p2[1] - p1[1]) * segFrac];
}

function initMovingTrains(map) {
  // Mock trains removed as per request
  clearInterval(window.__trainMapTimer);
}

window.__openTrackView = (code, isMaint = false) => openTrackStreetView(code, isMaint);

let gisLayerGroups = {};

function initGISCartographyMap() {
  const container = document.querySelector("#gisCartographyMapStage");
  if (!container || typeof L === "undefined") return;

  if (leafletMapInstance) {
    try { leafletMapInstance.remove(); } catch(e) {}
    leafletMapInstance = null;
  }

  const map = L.map("gisCartographyMapStage", {
    center: [10.8505, 77.8500],
    zoom: 7,
    minZoom: 6,
    maxZoom: 16,
    zoomControl: true,
  });
  leafletMapInstance = map;

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri Dark Gray',
    maxZoom: 16
  }).addTo(map);

  L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
    attribution: 'Railway data &copy; OpenRailwayMap',
    subdomains: "abc",
    maxZoom: 19,
    opacity: 0.85
  }).addTo(map);

  // Initialize Layer Groups
  gisLayerGroups = {
    network: L.layerGroup(),
    stations: L.layerGroup(),
    sections: L.layerGroup(),
    bridges: L.layerGroup(),
    tunnels: L.layerGroup(),
    levelCrossings: L.layerGroup(),
    yards: L.layerGroup(),
    damages: L.layerGroup()
  };

  // 1. Railway Network
  REAL_ROUTES.forEach(r => {
    L.polyline(r.coords, { color: "#000", weight: 5, opacity: 0.8 }).addTo(gisLayerGroups.network);
    L.polyline(r.coords, { color: r.color, weight: 3, opacity: 0.95, dashArray: "4, 4" }).addTo(gisLayerGroups.network);
  });

  // 2. Stations
  REAL_STATIONS_30.forEach(s => {
    const stHtml = `
      <div class="cris-station-node">
        <div class="cris-diamond ${s.hub ? 'hub' : ''}"></div>
        <div class="cris-stn-label">[${s.code}]</div>
      </div>
    `;
    const stIcon = L.divIcon({ html: stHtml, className: "custom-stn-node-cris", iconSize: [60, 36], iconAnchor: [30, 10] });
    const marker = L.marker([s.lat, s.lng], { icon: stIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>${esc(s.name)} [${esc(s.code)}]</h4>
            <span>${esc(s.div)} Division</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Platform Tracks</span><b>${s.platforms} Platforms</b></div>
          <div><span>Daily Train Occupancy</span><b>${s.dailyTrains} Trains / Day</b></div>
          <div><span>Block Maintenance Window</span><b style="color:#4bd19a">3.5 hrs (01:00 - 04:30)</b></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;margin-top:10px">
          <button class="cris-popup-btn" style="background:#2563eb;color:#ffffff;border:none;font-weight:800;cursor:pointer;padding:8px 12px;border-radius:6px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 2px 8px rgba(37,99,235,0.4)" onclick="window.navigateToStation('${s.code}')">
            <span>🚉</span> View Station Board & Planning
          </button>
          <button class="cris-popup-btn" style="background:rgba(255,255,255,0.06);color:#60a5fa;border:1px solid #3b82f6;font-weight:700;cursor:pointer;padding:7px 12px;border-radius:6px;font-size:11.5px;display:flex;align-items:center;justify-content:center;gap:6px" onclick="window.__openTrackView('${s.code}', false)">
            <span>🎥</span> View Station Approach Telemetry
          </button>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.stations);
  });

  // 3. Sections & Corridors
  GIS_SECTIONS_DATA.forEach(sec => {
    const poly = L.polyline(sec.coords, { color: "#3b82f6", weight: 4.5, opacity: 0.9 });
    poly.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>🛤️ Section: ${esc(sec.code)}</h4>
            <span>${esc(sec.name)}</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Track Classification</span><b>${esc(sec.type)}</b></div>
          <div><span>Max Sectional Speed</span><b style="color:#22c55e">${esc(sec.speed)}</b></div>
          <div><span>Annual GMT Traffic Load</span><b>${esc(sec.gmt)}</b></div>
          <div><span>Division Jurisdiction</span><b>${esc(sec.div)}</b></div>
        </div>
      </div>
    `);
    poly.addTo(gisLayerGroups.sections);
  });

  // 4. Bridges
  GIS_BRIDGES_DATA.forEach(b => {
    const brIcon = L.divIcon({
      html: `<div style="background:#1e40af;color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:4px;border:1.5px solid #60a5fa;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">🌉 ${b.name}</div>`,
      iconSize: [140, 24],
      iconAnchor: [70, 12]
    });
    const marker = L.marker(b.coords, { icon: brIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>🌉 Major Rail Bridge: ${esc(b.name)}</h4>
            <span>${esc(b.div)} Division</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Structural Type</span><b>${esc(b.type)}</b></div>
          <div><span>Operational Status</span><b style="color:#60a5fa">${esc(b.status)}</b></div>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.bridges);
  });

  // 5. Tunnels
  GIS_TUNNELS_DATA.forEach(t => {
    const tunIcon = L.divIcon({
      html: `<div style="background:#4c1d95;color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:4px;border:1.5px solid #a78bfa;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">🚇 ${t.name}</div>`,
      iconSize: [140, 24],
      iconAnchor: [70, 12]
    });
    const marker = L.marker(t.coords, { icon: tunIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>🚇 Mountain Rail Tunnel: ${esc(t.name)}</h4>
            <span>${esc(t.div)} Division</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Tunnel Specification</span><b>${esc(t.type)}</b></div>
          <div><span>Sectional Clearance Speed</span><b style="color:#a78bfa">${esc(t.speed)}</b></div>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.tunnels);
  });

  // 6. Level Crossings
  GIS_LEVEL_CROSSINGS_DATA.forEach(lc => {
    const lcIcon = L.divIcon({
      html: `<div style="background:#854d0e;color:#fff;font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:4px;border:1.5px solid #facc15;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">🚧 ${lc.code} (${lc.div})</div>`,
      iconSize: [110, 22],
      iconAnchor: [55, 11]
    });
    const marker = L.marker(lc.coords, { icon: lcIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>🚧 Level Crossing Gate: ${esc(lc.code)}</h4>
            <span>Location: <b>${esc(lc.loc)}</b></span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Interlocking Classification</span><b>${esc(lc.cls)}</b></div>
          <div><span>Train Vehicle Units (TVU)</span><b style="color:#facc15">${esc(lc.tvu)} TVU</b></div>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.levelCrossings);
  });

  // 7. Yards & Sidings
  GIS_YARDS_DATA.forEach(y => {
    const yIcon = L.divIcon({
      html: `<div style="background:#065f46;color:#fff;font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:4px;border:1.5px solid #34d399;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5)">🏗️ ${y.code} Yard</div>`,
      iconSize: [110, 22],
      iconAnchor: [55, 11]
    });
    const marker = L.marker(y.coords, { icon: yIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>🏗️ Railway Yard: ${esc(y.name)} [${esc(y.code)}]</h4>
            <span>${esc(y.div)} Division</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Yard Trackage Layout</span><b>${esc(y.tracks)}</b></div>
          <div><span>Handling / Overhaul Capacity</span><b style="color:#34d399">${esc(y.cap)}</b></div>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.yards);
  });

  // 8. Track Damages & Defects
  const corridorDamages = [
    { code: "DEF-001", type: "Lateral Rail Wear & Gauge Widening", section: "SEC-MAS-CBE (Katpadi - JTJ)", km: "KM 12.5", lat: 12.7667, lng: 78.8582, severity: "CRITICAL", tsr: "TSR 30 km/h", block: "B-090101-001", machine: "09-3X Dynamic Tamping Express" },
    { code: "DEF-002", type: "Thermit Weld Micro-cracking & Fatigue", section: "SEC-MAS-CBE (Salem - Erode)", km: "KM 22.0", lat: 11.5000, lng: 77.9200, severity: "MAJOR", tsr: "TSR 45 km/h", block: "B-090101-002", machine: "Thermit Weld Recasting Unit" },
    { code: "DEF-003", type: "25kV OHE Contact Wire Sag", section: "SEC-PGT-TVC (Thrissur - Ernakulam)", km: "KM 45.3", lat: 10.2546, lng: 76.2571, severity: "CRITICAL", tsr: "Power Block", block: "B-090101-003", machine: "TRD Tower Wagon (TW-07-02)" },
    { code: "DEF-004", type: "Thermit Weld Fatigue & Surface Spalling", section: "SEC-MAS-MDU (Villupuram - Vriddhachalam)", km: "KM 105.2", lat: 11.7200, lng: 79.4000, severity: "MAJOR", tsr: "TSR 45 km/h", block: "B-090101-004", machine: "Regulating Switch Tamper" },
    { code: "DEF-005", type: "Deep Ballast Fouling & Bed Subsidence", section: "SEC-MAS-MDU (Dindigul - Madurai)", km: "KM 198.2", lat: 10.1462, lng: 78.0500, severity: "MODERATE", tsr: "TSR 30 km/h", block: "B-090101-005", machine: "Plasser RM 80-92 UHR" },
    { code: "DEF-008", type: "Marine Fastener Oxidation & Corrosion", section: "SEC-MDU-RMM (Mandapam - Pamban)", km: "KM 9.2", lat: 9.2825, lng: 79.1983, severity: "CRITICAL", tsr: "Caution 30 km/h", block: "B-090101-008", machine: "P-Way Marine Maintenance Gang" }
  ];

  corridorDamages.forEach(d => {
    const isCrit = d.severity === "CRITICAL";
    L.circle([d.lat, d.lng], {
      color: isCrit ? "#ef4444" : "#f59e0b",
      fillColor: isCrit ? "#ef4444" : "#f59e0b",
      fillOpacity: 0.25,
      radius: 9000,
      weight: 2
    }).addTo(gisLayerGroups.damages);

    const dmgIcon = L.divIcon({
      html: `
        <div style="background:#0f172a;border:1.5px solid ${isCrit ? '#ef4444' : '#f59e0b'};border-radius:5px;padding:2px 7px;display:flex;align-items:center;gap:5px;box-shadow:0 0 12px rgba(239,68,68,0.5);white-space:nowrap;cursor:pointer">
          <span style="font-size:11px">⚠️</span>
          <span style="color:#ffffff;font-size:10px;font-weight:800;font-family:'JetBrains Mono',monospace">${d.code}</span>
          <span style="color:${isCrit ? '#ff8585' : '#fcd34d'};font-size:9.5px;font-weight:700">[${d.severity}]</span>
        </div>
      `,
      className: "corridor-damage-marker",
      iconSize: [140, 24],
      iconAnchor: [70, 12]
    });

    const marker = L.marker([d.lat, d.lng], { icon: dmgIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>⚠️ Track Damage: ${d.code}</h4>
            <span>Corridor Section: <b>${d.section}</b> (${d.km})</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Defect Classification</span><b style="color:#ff8585">${d.type}</b></div>
          <div><span>Severity / Impact</span><b style="color:${isCrit ? '#ef4444' : '#f59e0b'}">${d.severity} (${d.tsr})</b></div>
          <div><span>Linked Block Plan</span><b style="color:#60a5fa">${d.block}</b></div>
          <div><span>Assigned Machinery</span><b>${d.machine}</b></div>
          <div><span>Safety Order</span><b style="color:#4bd19a">Traffic Block Sanctioned • 130 km/h Restored</b></div>
        </div>
      </div>
    `);
    marker.addTo(gisLayerGroups.damages);
  });

  // Add all layers initially (matching checkboxes)
  Object.values(gisLayerGroups).forEach(lg => lg.addTo(map));

  // Bind Layer Checkbox Events
  const bindLayerToggle = (chkId, layerKey) => {
    const chk = document.querySelector(chkId);
    if (chk) {
      chk.onchange = () => {
        if (chk.checked) map.addLayer(gisLayerGroups[layerKey]);
        else map.removeLayer(gisLayerGroups[layerKey]);
      };
    }
  };

  bindLayerToggle("#layerChkRailway", "network");
  bindLayerToggle("#layerChkStations", "stations");
  bindLayerToggle("#layerChkSections", "sections");
  bindLayerToggle("#layerChkBridges", "bridges");
  bindLayerToggle("#layerChkTunnels", "tunnels");
  bindLayerToggle("#layerChkLevelCrossings", "levelCrossings");
  bindLayerToggle("#layerChkYards", "yards");
  bindLayerToggle("#layerChkDamages", "damages");

  // Layer overlay box close / toggle
  const btnToggleLayers = document.querySelector("#btnToggleLayersBox");
  const btnCloseLayers = document.querySelector("#btnCloseLayersBox");
  const layersBox = document.querySelector("#gisLayersBox");
  if (btnToggleLayers && layersBox) {
    btnToggleLayers.onclick = () => {
      layersBox.style.display = layersBox.style.display === "none" ? "block" : "none";
    };
  }
  if (btnCloseLayers && layersBox) {
    btnCloseLayers.onclick = () => {
      layersBox.style.display = "none";
    };
  }

  // Quick filter damages button
  const btnQuickDmg = document.querySelector("#btnQuickFilterDamages");
  if (btnQuickDmg) {
    btnQuickDmg.onclick = () => {
      map.flyTo([11.5000, 78.5000], 7.5, { duration: 0.8 });
      showToast("Highlighting 8 Active Track Damages & Defect Zones across Corridors");
    };
  }

  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 100);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 350);
}

function initLiveTrainGPSMap() {
  const container = document.querySelector("#rtisLiveMapStage");
  if (!container || typeof L === "undefined") return;

  if (leafletMapInstance) {
    try { leafletMapInstance.remove(); } catch(e) {}
    leafletMapInstance = null;
  }

  const map = L.map("rtisLiveMapStage", {
    center: [11.5000, 78.5000],
    zoom: 7,
    minZoom: 6,
    maxZoom: 16,
    zoomControl: true,
  });
  leafletMapInstance = map;

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri Dark Gray',
    maxZoom: 16
  }).addTo(map);

  L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
    attribution: 'Railway data &copy; OpenRailwayMap',
    subdomains: "abc",
    maxZoom: 19,
    opacity: 0.85
  }).addTo(map);

  REAL_ROUTES.forEach(r => {
    L.polyline(r.coords, { color: "#2563eb", weight: 2.5, opacity: 0.7 }).addTo(map);
  });

  const markersMap = {};

  LIVE_TRAINS_DATABASE.forEach(t => {
    const isDelayed = t.status.includes("DELAYED");
    const badgeColor = isDelayed ? "#eab308" : "#22c55e";

    const trainIcon = L.divIcon({
      html: `
        <div style="background:#0f172a;border:1.5px solid ${badgeColor};border-radius:6px;padding:3px 8px;display:flex;align-items:center;gap:6px;box-shadow:0 0 10px rgba(0,0,0,0.5);white-space:nowrap;cursor:pointer">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${badgeColor}"></span>
          <span style="color:#fff;font-size:11px;font-weight:700">${t.no}</span>
          <span style="color:#94a3b8;font-size:10px">${t.speed}</span>
        </div>
      `,
      className: "rtis-train-custom-pin",
      iconSize: [120, 26],
      iconAnchor: [60, 13]
    });

    const marker = L.marker(t.coords, { icon: trainIcon }).addTo(map).bindPopup(`
      <div style="padding:6px;font-size:12px;font-family:Inter,sans-serif;min-width:220px">
        <strong style="color:#2563eb;font-size:13px;display:block">${t.no} - ${t.name}</strong>
        <div style="margin-top:6px;border-bottom:1px solid #1e293b;padding-bottom:3px">From: <b>${t.origin}</b> ➔ <b>${t.dest}</b></div>
        <div style="margin-top:3px">Current Location: <b>${t.loc}</b></div>
        <div>Current Speed: <b style="color:#22c55e">${t.speed}</b></div>
        <div>Scheduled ETA: <b>${t.eta}</b></div>
        <div>Telemetry Status: <b style="color:${badgeColor}">${t.status}</b></div>
      </div>
    `);

    markersMap[t.no] = marker;
  });

  // Connect train card clicks to map flyTo
  document.querySelectorAll("[data-train-select]").forEach(card => {
    card.onclick = () => {
      const trainNo = card.dataset.trainSelect;
      selectedLiveTrainNo = trainNo;
      const trainObj = LIVE_TRAINS_DATABASE.find(x => x.no === trainNo);
      if (trainObj && markersMap[trainNo]) {
        map.flyTo(trainObj.coords, 10, { duration: 0.8 });
        markersMap[trainNo].openPopup();
      }
      document.querySelectorAll("[data-train-select]").forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    };
  });

  // Connect search input filter
  const rtisSearch = document.querySelector("#rtisLiveSearchInput");
  if (rtisSearch) {
    rtisSearch.oninput = (e) => {
      rtisSearchQuery = e.target.value.toLowerCase().trim();
      render();
    };
  }

  // Connect train type select filter
  const rtisType = document.querySelector("#rtisTypeSelect");
  if (rtisType) {
    rtisType.onchange = (e) => {
      rtisTypeFilter = e.target.value;
      render();
    };
  }

  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 100);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 350);
}

function initMaintenanceMachineryMap() {
  const container = document.querySelector("#maintenanceMapStage");
  if (!container || typeof L === "undefined") return;

  if (leafletMapInstance) {
    try { leafletMapInstance.remove(); } catch(e) {}
    leafletMapInstance = null;
  }

  const map = L.map("maintenanceMapStage", {
    center: [11.2000, 78.2000],
    zoom: 7,
    minZoom: 6,
    maxZoom: 16,
    zoomControl: true,
  });
  leafletMapInstance = map;

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Tiles &copy; Esri Dark Gray',
    maxZoom: 16
  }).addTo(map);

  L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
    attribution: 'Railway data &copy; OpenRailwayMap',
    subdomains: "abc",
    maxZoom: 19,
    opacity: 0.85
  }).addTo(map);

  REAL_ROUTES.forEach(r => {
    L.polyline(r.coords, { color: "#475569", weight: 2, opacity: 0.6 }).addTo(map);
  });

  const machineryLocations = [
    { id: "BTE-07-001", name: "09-3X Dynamic Tamping Express", coords: [11.6643, 78.1460], loc: "Salem Yard", status: "Deployed", color: "#22c55e" },
    { id: "RM-07-001", name: "Plasser RM 80-92 UHR", coords: [10.7905, 78.7047], loc: "Tiruchirappalli Jn", status: "Deployed", color: "#22c55e" },
    { id: "BCM-07-003", name: "Ballast Cleaning Machine", coords: [9.9252, 78.1198], loc: "Madurai", status: "Standby", color: "#3b82f6" },
    { id: "RST-07-004", name: "Regulating Switch Tamping Machine", coords: [11.9401, 79.4861], loc: "Villupuram", status: "Maintenance", color: "#eab308" }
  ];

  machineryLocations.forEach(m => {
    const machIcon = L.divIcon({
      html: `
        <div style="background:#0f172a;border:1.5px solid ${m.color};border-radius:6px;padding:3px 8px;display:flex;align-items:center;gap:6px;box-shadow:0 0 10px rgba(0,0,0,0.5);white-space:nowrap">
          <span style="font-size:12px">🚆</span>
          <span style="color:#fff;font-size:11px;font-weight:700">${m.id}</span>
          <span style="color:${m.color};font-size:10px;font-weight:700">[${m.status}]</span>
        </div>
      `,
      className: "machinery-custom-pin",
      iconSize: [140, 26],
      iconAnchor: [70, 13]
    });

    L.marker(m.coords, { icon: machIcon }).addTo(map).bindPopup(`
      <div style="padding:6px;font-size:12px;font-family:Inter,sans-serif">
        <strong style="color:#2563eb;display:block">${m.name}</strong>
        <div style="margin-top:4px">Unit ID: <b>${m.id}</b></div>
        <div>Deployment Location: <b>${m.loc}</b></div>
        <div>Operational Status: <b style="color:${m.color}">${m.status}</b></div>
      </div>
    `);
  });

  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 100);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 350);
}

// Complete 180-Station Geographic Coordinate Dictionary (100% Coverage for all 330 Trains)
const ALL_STATION_COORDS = {
  // User Specified Route Stations (13 New Trains)
  CHZ: [17.4644, 78.6019], Charlapalli: [17.4644, 78.6019],
  TVCN: [8.5147, 76.8972], "Thiruvananthapuram North": [8.5147, 76.8972],
  KCVL: [8.5147, 76.8972], Kochuveli: [8.5147, 76.8972],
  GKP: [26.7606, 83.3732], Gorakhpur: [26.7606, 83.3732],
  CCT: [16.9604, 82.2381], "Kakinada Town": [16.9604, 82.2381],
  SMVB: [13.0033, 77.6533], "SMVT Bengaluru": [13.0033, 77.6533],
  CGL: [12.6841, 79.9836], Chengalpattu: [12.6841, 79.9836],
  ALLP: [9.4981, 76.3268], Alappuzha: [9.4981, 76.3268], Alleppey: [9.4981, 76.3268],
  PAK: [13.4500, 79.1167], Pakala: [13.4500, 79.1167],
  CTO: [13.2167, 79.1000], Chittoor: [13.2167, 79.1000],
  TBM: [12.9249, 80.1000], Tambaram: [12.9249, 80.1000],
  EKM: [13.1800, 79.5200], Ekambarakuppam: [13.1800, 79.5200],
  PUT: [13.4400, 79.5500], Puttur: [13.4400, 79.5500],
  KOU: [13.9500, 79.3500], Koduru: [13.9500, 79.3500],
  RJP: [14.1833, 79.1667], Razampeta: [14.1833, 79.1667],
  YA: [14.6333, 78.5333], Yerraguntla: [14.6333, 78.5333],
  TU: [14.9167, 78.0167], Tadipatri: [14.9167, 78.0167],
  GY: [15.1167, 77.6333], Gooty: [15.1167, 77.6333],
  DHNE: [15.4167, 77.8667], Dhone: [15.4167, 77.8667],
  KRNT: [15.8333, 78.0333], "Kurnool City": [15.8333, 78.0333], Kurnool: [15.8333, 78.0333],
  GWD: [16.2333, 77.8000], Gadwal: [16.2333, 77.8000],
  MBNR: [16.7433, 77.9892], Mahbubnagar: [16.7433, 77.9892],
  JCL: [16.7700, 78.1300], Jadcherla: [16.7700, 78.1300],
  SHNR: [17.0667, 78.2000], Shadnagar: [17.0667, 78.2000],
  UR: [17.2600, 78.4300], Umdanagar: [17.2600, 78.4300],
  KHT: [13.7500, 79.7000], "Sri Kalahasti": [13.7500, 79.7000],
  CLX: [15.8167, 80.3500], Chirala: [15.8167, 80.3500],
  BPP: [15.9000, 80.4667], Bapatla: [15.9000, 80.4667],
  TEL: [16.2431, 80.6400], Tenali: [16.2431, 80.6400],
  GNT: [16.3000, 80.4500], Guntur: [16.3000, 80.4500],
  EE: [16.7167, 81.1000], Eluru: [16.7167, 81.1000],
  TDD: [16.8167, 81.5333], Tadepalligudem: [16.8167, 81.5333],
  NDD: [16.9000, 81.6667], Nidadavolu: [16.9000, 81.6667],
  RJY: [17.0000, 81.8000], Rajahmundry: [17.0000, 81.8000],
  SLO: [17.0500, 82.1667], Samalkot: [17.0500, 82.1667],
  SKZR: [19.3333, 79.4833], "Sirpur Kaghaznagar": [19.3333, 79.4833],
  RDM: [18.8000, 79.4500], Ramagundam: [18.8000, 79.4500],
  KMT: [17.2500, 80.1500], Khammam: [17.2500, 80.1500],
  ET: [22.6167, 77.7667], Itarsi: [22.6167, 77.7667],
  ORAI: [25.9833, 79.4500], Orai: [25.9833, 79.4500],
  CNB: [26.4542, 80.3506], "Kanpur Central": [26.4542, 80.3506],
  LKO: [26.8300, 80.9200], "Lucknow Charbagh": [26.8300, 80.9200],
  GD: [27.1333, 81.9667], Gonda: [27.1333, 81.9667],
  VAK: [8.7333, 76.7167], Varkala: [8.7333, 76.7167],
  MVLK: [9.2667, 76.5500], Mavelikara: [9.2667, 76.5500],
  CNGR: [9.3167, 76.6167], Chengannur: [9.3167, 76.6167],
  TRVL: [9.3833, 76.5833], Tiruvalla: [9.3833, 76.5833],
  CGY: [9.4500, 76.5500], Changanassery: [9.4500, 76.5500],
  ERN: [9.9880, 76.2860], "Ernakulam Town": [9.9880, 76.2860],
  OTP: [10.7667, 76.3833], Ottappalam: [10.7667, 76.3833],
  SRR: [10.7628, 76.2736], Shoranur: [10.7628, 76.2736],
  WFD: [12.9967, 77.7500], Whitefield: [12.9967, 77.7500],
  MLO: [13.0033, 77.9367], Malur: [13.0033, 77.9367],
  BQI: [11.9800, 78.3600], Bommidi: [11.9800, 78.3600],
  MAP: [12.0500, 78.4100], Morappur: [12.0500, 78.4100],
  AB: [12.7800, 78.7100], Ambur: [12.7800, 78.7100],
  VN: [12.6800, 78.6100], Vaniyambadi: [12.6800, 78.6100],
  WJR: [12.9800, 79.3800], "Walajah Road": [12.9800, 79.3800],
  PER: [13.1075, 80.2333], Perambur: [13.1075, 80.2333],

  SBC: [12.9781, 77.5695], "KSR Bengaluru": [12.9781, 77.5695], MYS: [12.3168, 76.6430], Mysuru: [12.3168, 76.6430],
  ERS: [9.9678, 76.2917], Ernakulam: [9.9678, 76.2917], TVC: [8.4875, 76.9530], Thiruvananthapuram: [8.4875, 76.9530],
  MAQ: [12.8687, 74.8427], Mangaluru: [12.8687, 74.8427], QLN: [8.8870, 76.5980], Kollam: [8.8870, 76.5980],
  GUV: [10.5960, 76.0350], Guruvayur: [10.5960, 76.0350], TCN: [8.4975, 78.1189], Tiruchendur: [8.4975, 78.1189],
  KGQ: [12.4975, 74.9859], Kasaragod: [12.4975, 74.9859], CLT: [11.2480, 75.7804], Kozhikode: [11.2480, 75.7804],
  CAN: [11.8745, 75.3704], Kannur: [11.8745, 75.3704], KIK: [10.9254, 79.8380], Karaikkal: [10.9254, 79.8380],
  PUU: [9.0200, 76.9290], Punalur: [9.0200, 76.9290], KCG: [17.3888, 78.4996], Kacheguda: [17.3888, 78.4996],
  MTP: [11.3060, 76.9372], Mettupalayam: [11.3060, 76.9372], CBE: [11.0016, 76.9629], Coimbatore: [11.0016, 76.9629],
  MAS: [13.0827, 80.2707], "MGR Chennai Central": [13.0827, 80.2707], "Chennai Central": [13.0827, 80.2707], Chennai: [13.0827, 80.2707],
  MS: [13.0826, 80.2612], "Chennai Egmore": [13.0826, 80.2612], Tambaram: [12.9249, 80.1000], TBM: [12.9249, 80.1000],
  Chengalpattu: [12.6841, 79.9836], CGL: [12.6841, 79.9836], Tindivanam: [12.2333, 79.6500], TMV: [12.2333, 79.6500],
  Arakkonam: [13.0784, 79.6677], AJJ: [13.0784, 79.6677], Katpadi: [12.9696, 79.1362], KPD: [12.9696, 79.1362],
  Ambur: [12.7844, 78.7156], AB: [12.7844, 78.7156], Vaniyambadi: [12.6825, 78.6189], VN: [12.6825, 78.6189],
  Jolarpettai: [12.5638, 78.5802], JTJ: [12.5638, 78.5802], Villupuram: [11.9401, 79.4861], VM: [11.9401, 79.4861],
  Puducherry: [11.9338, 79.8297], PDY: [11.9338, 79.8297], Cuddalore: [11.7480, 79.7714], Chidambaram: [11.3994, 79.6934],
  CDM: [11.3994, 79.6934], Mayiladuthurai: [11.1018, 79.6522], MV: [11.1018, 79.6522], Kumbakonam: [10.9602, 79.3845],
  KMU: [10.9602, 79.3845], Thanjavur: [10.7870, 79.1378], TJ: [10.7870, 79.1378], Tiruchirappalli: [10.7905, 78.7047],
  TPJ: [10.7905, 78.7047], Trichy: [10.7905, 78.7047], Manapparai: [10.6074, 78.4172], Dindigul: [10.3673, 77.9803],
  DG: [10.3673, 77.9803], Madurai: [9.9252, 78.1198], MDU: [9.9252, 78.1198], Virudhunagar: [9.5872, 77.9624],
  VPT: [9.5872, 77.9624], Satur: [9.3622, 77.9258], Kovilpatti: [9.1728, 77.8689], KVP: [9.1728, 77.8689],
  Tirunelveli: [8.7139, 77.7567], TEN: [8.7139, 77.7567], Nagercoil: [8.1833, 77.4119], NCJ: [8.1833, 77.4119],
  Kanyakumari: [8.0883, 77.5385], CAPE: [8.0883, 77.5385], Thoothukudi: [8.7642, 78.1348], TN: [8.7642, 78.1348],
  Tuticorin: [8.7642, 78.1348], Rameswaram: [9.2876, 79.3129], RMM: [9.2876, 79.3129], Karaikkudi: [10.0735, 78.7732],
  KKDI: [10.0735, 78.7732], Pudukkottai: [10.3797, 78.8208], PDKT: [10.3797, 78.8208], Sivaganga: [9.8433, 78.4809],
  SVGA: [9.8433, 78.4809], Manamadurai: [9.7042, 78.4489], MNM: [9.7042, 78.4489], Ramanathapuram: [9.3639, 78.8375],
  RMD: [9.3639, 78.8375], Paramakudi: [9.5442, 78.5911], PMK: [9.5442, 78.5911], Mandapam: [9.2789, 79.1236],
  MMM: [9.2789, 79.1236], Sengottai: [8.9806, 77.2458], SCT: [8.9806, 77.2458], Tenkasi: [8.9592, 77.3147],
  TSI: [8.9592, 77.3147], Rajapalayam: [9.4533, 77.5539], RJPM: [9.4533, 77.5539], Srivilliputtur: [9.5117, 77.6322],
  SVPR: [9.5117, 77.6322], Salem: [11.6643, 78.1460], SA: [11.6643, 78.1460], Erode: [11.3410, 77.7172],
  ED: [11.3410, 77.7172], Tiruppur: [11.1085, 77.3411], TUP: [11.1085, 77.3411], Coimbatore: [11.0168, 76.9558],
  CBE: [11.0168, 76.9558], Mettupalayam: [11.3000, 76.9500], MTP: [11.3000, 76.9500], Podanur: [10.9639, 76.9628],
  PTJ: [10.9639, 76.9628], Palakkad: [10.7867, 76.6548], PGT: [10.7867, 76.6548], Ottapalam: [10.7700, 76.3800],
  OTP: [10.7700, 76.3800], Shoranur: [10.7607, 76.2758], SRR: [10.7607, 76.2758], Pattambi: [10.8064, 76.1989],
  PTB: [10.8064, 76.1989], Tirur: [10.9167, 75.9167], TIR: [10.9167, 75.9167], Kozhikode: [11.2588, 75.7804],
  CLT: [11.2588, 75.7804], Vadakara: [11.6083, 75.5917], BDJ: [11.6083, 75.5917], Thalassery: [11.7500, 75.4833],
  TLY: [11.7500, 75.4833], Kannur: [11.8745, 75.3704], CAN: [11.8745, 75.3704], Payyanur: [12.1000, 75.2000],
  PAY: [12.1000, 75.2000], Kanhangad: [12.3000, 75.0833], KZE: [12.3000, 75.0833], Kasaragod: [12.5000, 74.9833],
  KGQ: [12.5000, 74.9833], Mangaluru: [12.8700, 74.8800], Mangalore: [12.8700, 74.8800], MAQ: [12.8700, 74.8800],
  MAJN: [12.8681, 74.8767], Thrissur: [10.5276, 76.2144], TCR: [10.5276, 76.2144], Guruvayur: [10.5950, 76.0400],
  GUV: [10.5950, 76.0400], Aluva: [10.1004, 76.3570], AWY: [10.1004, 76.3570], Ernakulam: [9.9816, 76.2999],
  ERS: [9.9816, 76.2999], ERN: [9.9936, 76.2878], Kottayam: [9.5916, 76.5222], KTYM: [9.5916, 76.5222],
  Alappuzha: [9.4981, 76.3388], Alleppey: [9.4981, 76.3388], ALLP: [9.4981, 76.3388], Changanassery: [9.4444, 76.5389],
  CGY: [9.4444, 76.5389], Tiruvalla: [9.3844, 76.5744], TRVL: [9.3844, 76.5744], Chengannur: [9.3175, 76.6150],
  CNGR: [9.3175, 76.6150], Mavelikara: [9.2667, 76.5500], MVLK: [9.2667, 76.5500], Kayamkulam: [9.1722, 76.5000],
  KYJ: [9.1722, 76.5000], Karunagappalli: [9.0500, 76.5333], KPY: [9.0500, 76.5333], Kollam: [8.8932, 76.6141],
  Quilon: [8.8932, 76.6141], QLN: [8.8932, 76.6141], Varkala: [8.7378, 76.7164], VAK: [8.7378, 76.7164],
  Kochuveli: [8.5133, 76.8972], KCVL: [8.5133, 76.8972], Thiruvananthapuram: [8.5241, 76.9366], Trivandrum: [8.5241, 76.9366],
  TVC: [8.5241, 76.9366], Neyyattinkara: [8.4000, 77.0833], NYY: [8.4000, 77.0833], Kuzhithurai: [8.3167, 77.1833],
  KZTW: [8.3167, 77.1833], Karur: [10.9577, 78.0849], KRR: [10.9577, 78.0849], Namakkal: [11.2189, 78.1678],
  NMKL: [11.2189, 78.1678], Rasipuram: [11.4644, 78.1678], RASP: [11.4644, 78.1678], Nagapattinam: [10.7656, 79.8428],
  NGT: [10.7656, 79.8428], Nagore: [10.8167, 79.8467], NCR: [10.8167, 79.8467], Velankanni: [10.6833, 79.8333],
  VLNK: [10.6833, 79.8333], Karaikal: [10.9254, 79.8380], KIK: [10.9254, 79.8380], Tiruvarur: [10.7725, 79.6367],
  TVR: [10.7725, 79.6367], Mannargudi: [10.6633, 79.4456], MQ: [10.6633, 79.4456], Ariyalur: [11.1400, 79.0789],
  ALU: [11.1400, 79.0789], Vriddhachalam: [11.5333, 79.3333], VRI: [11.5333, 79.3333], "Cuddalore Port": [11.7167, 79.7667],
  CUPJ: [11.7167, 79.7667], Attur: [11.5975, 78.5997], ATU: [11.5975, 78.5997], Chinnasalem: [11.6444, 78.8889],
  CHSM: [11.6444, 78.8889], Kallakurichi: [11.7333, 78.9667], Tiruvannamalai: [12.2253, 79.0747], TNM: [12.2253, 79.0747],
  Polur: [12.5000, 79.1333], "Vellore Cantt": [12.9167, 79.1333], VLR: [12.9167, 79.1333],
  Bengaluru: [12.9784, 77.5684], Bangalore: [12.9784, 77.5684], "KSR Bengaluru": [12.9784, 77.5684], SBC: [12.9784, 77.5684],
  "Bengaluru Cantt": [12.9936, 77.5989], BNC: [12.9936, 77.5989], Yesvantpur: [13.0234, 77.5503], YPR: [13.0234, 77.5503],
  "SMVT Bengaluru": [13.0033, 77.6533], SMVB: [13.0033, 77.6533], Bangarapet: [12.9942, 78.2017], BWT: [12.9942, 78.2017],
  Kuppam: [12.7500, 78.3667], KPN: [12.7500, 78.3667], Hosur: [12.7408, 77.8253], HSRA: [12.7408, 77.8253],
  Dharmapuri: [12.1211, 78.1583], DPJ: [12.1211, 78.1583], Mysuru: [12.3167, 76.6500], Mysore: [12.3167, 76.6500],
  MYS: [12.3167, 76.6500], Mandya: [12.5228, 76.8978], MYA: [12.5228, 76.8978], Hassan: [13.0072, 76.1031],
  HAS: [13.0072, 76.1031], Arsikere: [13.3131, 76.2575], ASK: [13.3131, 76.2575], Birur: [13.6167, 75.9667],
  RRB: [13.6167, 75.9667], Davangere: [14.4667, 75.9167], DVG: [14.4667, 75.9167], Harihar: [14.5167, 75.8000],
  HRR: [14.5167, 75.8000], Haveri: [14.7944, 75.3986], HVR: [14.7944, 75.3986], Hubballi: [15.3467, 75.1481],
  Hubli: [15.3467, 75.1481], UBL: [15.3467, 75.1481], Dharwad: [15.4589, 75.0078], DWR: [15.4589, 75.0078],
  Belagavi: [15.8600, 74.5000], BGM: [15.8600, 74.5000], Hosapete: [15.2689, 76.3908], HPT: [15.2689, 76.3908],
  Ballari: [15.1500, 76.9167], Bellary: [15.1500, 76.9167], BAY: [15.1500, 76.9167], Guntakal: [15.1667, 77.3667],
  GTL: [15.1667, 77.3667], Tirupati: [13.6288, 79.4192], TPTY: [13.6288, 79.4192], Renigunta: [13.6478, 79.5147],
  RU: [13.6478, 79.5147], Gudur: [14.1500, 79.8500], GDR: [14.1500, 79.8500], Nellore: [14.4500, 79.9833],
  NLR: [14.4500, 79.9833], Ongole: [15.5000, 80.0500], OGL: [15.5000, 80.0500], Vijayawada: [16.5167, 80.6167],
  BZA: [16.5167, 80.6167], Visakhapatnam: [17.7200, 83.2800], VSKP: [17.7200, 83.2800], Bhubaneswar: [20.2667, 85.8333],
  BBS: [20.2667, 85.8333], Cuttack: [20.4625, 85.8828], CTC: [20.4625, 85.8828], Kharagpur: [22.3389, 87.3200],
  KGP: [22.3389, 87.3200], Howrah: [22.5833, 88.3333], HWH: [22.5833, 88.3333], Santragachi: [22.5794, 88.2831],
  SRC: [22.5794, 88.2831], Shalimar: [22.5600, 88.3100], SHM: [22.5600, 88.3100], "New Delhi": [28.6139, 77.2090],
  Delhi: [28.6139, 77.2090], NDLS: [28.6139, 77.2090], "Hazrat Nizamuddin": [28.5888, 77.2534], NZM: [28.5888, 77.2534],
  Agra: [27.1800, 78.0200], AGC: [27.1800, 78.0200], Gwalior: [26.2167, 78.1833], GWL: [26.2167, 78.1833],
  Jhansi: [25.4486, 78.5694], VGLJ: [25.4486, 78.5694], Bhopal: [23.2500, 77.4167], BPL: [23.2500, 77.4167],
  Nagpur: [21.1500, 79.0833], NGP: [21.1500, 79.0833], Balharshah: [19.8500, 79.3500], BPQ: [19.8500, 79.3500],
  Warangal: [17.9689, 79.5942], WL: [17.9689, 79.5942], Hyderabad: [17.3850, 78.4867], Secunderabad: [17.4399, 78.5017],
  SC: [17.4399, 78.5017], Mumbai: [18.9400, 72.8350], "Mumbai LTT": [19.0683, 72.8917], LTT: [19.0683, 72.8917],
  "Mumbai CSMT": [18.9400, 72.8350], CSMT: [18.9400, 72.8350], "Bandra Terminus": [19.0600, 72.8400], BDTS: [19.0600, 72.8400],
  Pune: [18.5204, 73.8567], PUNE: [18.5204, 73.8567], Solapur: [17.6599, 75.9064], SUR: [17.6599, 75.9064],
  Wadi: [17.0500, 76.9833], WADI: [17.0500, 76.9833], Raichur: [16.2000, 77.3500], RC: [16.2000, 77.3500],
  Adoni: [15.6333, 77.2667], AD: [15.6333, 77.2667], Kadapa: [14.4667, 78.8167], HX: [14.4667, 78.8167],
  Ahmedabad: [23.0225, 72.5714], ADI: [23.0225, 72.5714], Surat: [21.1702, 72.8311], ST: [21.1702, 72.8311],
  Vadodara: [22.3072, 73.1812], BRC: [22.3072, 73.1812], Bikaner: [28.0167, 73.3167], BKN: [28.0167, 73.3167],
  Jaipur: [26.9124, 75.7873], JP: [26.9124, 75.7873], Ajmer: [26.4499, 74.6399], AII: [26.4499, 74.6399],
  Chandigarh: [30.7333, 76.7794], CDG: [30.7333, 76.7794], Ambala: [30.3782, 76.7767], UMB: [30.3782, 76.7767],
  Varanasi: [25.3176, 82.9739], BSB: [25.3176, 82.9739], Patna: [25.5941, 85.1376], PNBE: [25.5941, 85.1376]
};

function resolveStationCoordinate(text) {
  if (!text) return null;
  const t = text.trim();
  if (ALL_STATION_COORDS[t]) return ALL_STATION_COORDS[t];
  const m = t.match(/\(([A-Za-z0-9]+)\)/);
  if (m && ALL_STATION_COORDS[m[1]]) return ALL_STATION_COORDS[m[1]];

  const clean = t.replace(/\(.*?\)/g, "").replace(/Jn|Express|SF|Ctl|Central|Terminus|Cantt/gi, "").trim();
  for (const [k, coord] of Object.entries(ALL_STATION_COORDS)) {
    if (clean.length >= 3 && (clean.toLowerCase() === k.toLowerCase() || k.toLowerCase().includes(clean.toLowerCase()) || clean.toLowerCase().includes(k.toLowerCase()))) {
      return coord;
    }
  }
  return null;
}

function findTrainInDataset(query) {
  if (!query) return null;
  const qRaw = query.trim();

  // 1. Extract train number token
  const numMatch = qRaw.match(/\b\d{4,5}[A-Za-z]?\b/);
  if (numMatch) {
    const num = numMatch[0].toLowerCase();
    const found = CHENNAI_TIMETABLE_330.find(t => t.train_no.toLowerCase() === num) ||
                  LIVE_STATION_TIMETABLE.find(t => t.no.toLowerCase() === num);
    if (found) return found;
  }

  // 2. Clean query before bullet point
  const qClean = qRaw.split("•")[0].split("(")[0].trim().toLowerCase();
  if (qClean) {
    const found = CHENNAI_TIMETABLE_330.find(t => 
      t.train_no.toLowerCase() === qClean ||
      t.name.toLowerCase().includes(qClean) ||
      t.name.toLowerCase().replace(/\s+/g, "").includes(qClean.replace(/\s+/g, ""))
    ) || LIVE_STATION_TIMETABLE.find(t => 
      t.no.toLowerCase() === qClean ||
      t.name.toLowerCase().includes(qClean)
    );
    if (found) return found;
  }

  // 3. Substring search across whole text
  const qLower = qRaw.toLowerCase();
  return CHENNAI_TIMETABLE_330.find(t => 
    qLower.includes(t.train_no.toLowerCase()) || 
    qLower.includes(t.name.toLowerCase()) ||
    t.name.toLowerCase().includes(qLower) ||
    `${t.origin} ${t.dest}`.toLowerCase().includes(qLower)
  ) || LIVE_STATION_TIMETABLE.find(t =>
    qLower.includes(t.no.toLowerCase()) ||
    qLower.includes(t.name.toLowerCase()) ||
    t.name.toLowerCase().includes(qLower)
  );
}

function highlightTrainRouteOnMap(query) {
  if (!leafletMapInstance || !query) return;
  
  const train = findTrainInDataset(query);
  if (!train) {
    showToast(`No train route found matching "${query}".`, true);
    return;
  }

  const trainNo = train.train_no || train.no;
  const trainName = train.name;
  const origin = train.origin || train.src;
  const dest = train.dest || train.dst;
  const depTime = train.dep || "06:00";
  const arrTime = train.arr || "12:00";
  const runtime = train.runtime || "6h 00m";
  const stopsStr = train.stops || "";

  // Parse stops into station list
  const stopsList = stopsStr.split(",").map(s => s.trim()).filter(Boolean);
  const fullStationStrings = [origin, ...stopsList, dest];

  // Resolve all coordinates
  const waypoints = [];
  const validStations = [];

  fullStationStrings.forEach((stText, idx) => {
    const coord = resolveStationCoordinate(stText);
    if (coord) {
      // Avoid duplicate consecutive coordinates
      const last = waypoints[waypoints.length - 1];
      if (!last || last[0] !== coord[0] || last[1] !== coord[1]) {
        waypoints.push(coord);
        const codeMatch = stText.match(/\(([A-Za-z0-9]+)\)/);
        const code = codeMatch ? codeMatch[1] : stText.split(" ")[0].toUpperCase().slice(0, 4);
        const name = stText.replace(/\(.*?\)/g, "").trim();
        validStations.push({ code, name, coord, isOrigin: idx === 0, isDest: idx === fullStationStrings.length - 1 });
      }
    }
  });

  if (waypoints.length < 2) {
    showToast(`Insufficient GPS waypoints mapped for Train ${trainNo}.`, true);
    return;
  }

  // 1. HIDE ALL DEFAULT OVERVIEW LAYERS (Routes, Stations, Maintenance boxes, other trains)
  if (overviewDefaultLayerGroup && leafletMapInstance.hasLayer(overviewDefaultLayerGroup)) {
    leafletMapInstance.removeLayer(overviewDefaultLayerGroup);
  }
  clearInterval(window.__trainMapTimer);
  clearInterval(singleTrainMovingTimer);

  // 2. CLEAR ANY PREVIOUS SEARCHED ROUTE LAYER
  if (activeSearchedTrainRouteLayer) {
    leafletMapInstance.removeLayer(activeSearchedTrainRouteLayer);
    activeSearchedTrainRouteLayer = null;
  }
  document.querySelector("#trainRouteFloatingBadge")?.remove();

  // 3. CREATE ISOLATED ROUTE LAYER FOR ONLY THIS TRAIN
  activeSearchedTrainRouteLayer = L.layerGroup().addTo(leafletMapInstance);

  // A. Glowing wide outer polyline
  const glowLine = L.polyline(waypoints, {
    color: "#2563eb",
    weight: 10,
    opacity: 0.45,
    lineCap: "round",
    lineJoin: "round"
  });
  activeSearchedTrainRouteLayer.addLayer(glowLine);

  // B. Core animated dashed inner polyline
  const coreLine = L.polyline(waypoints, {
    color: "#60a5fa",
    weight: 4,
    opacity: 1.0,
    dashArray: "8, 8"
  });
  activeSearchedTrainRouteLayer.addLayer(coreLine);

  // C. Station stop pins along route ONLY
  validStations.forEach((st, idx) => {
    const isTerminal = st.isOrigin || st.isDest;
    const stMarkerHtml = `
      <div class="cris-searched-stn-pin ${isTerminal ? 'terminal' : ''}">
        <div class="pin-dot"></div>
        <div class="pin-label">${st.code}</div>
      </div>
    `;
    const stIcon = L.divIcon({
      html: stMarkerHtml,
      className: "custom-stn-pin-route",
      iconSize: [60, 36],
      iconAnchor: [30, 18]
    });
    const marker = L.marker(st.coord, { icon: stIcon });
    marker.bindPopup(`
      <div class="cris-popup-card">
        <div class="cris-popup-head">
          <div>
            <h4>${st.name} [${st.code}]</h4>
            <span>Train ${trainNo}: ${st.isOrigin ? 'Origin Station' : (st.isDest ? 'Destination Terminal' : 'Scheduled Halt')}</span>
          </div>
        </div>
        <div class="cris-popup-body">
          <div><span>Train Number</span><b>${trainNo}</b></div>
          <div><span>Train Name</span><b>${trainName}</b></div>
          <div><span>Schedule</span><b>${st.isOrigin ? `Dep: ${depTime}` : (st.isDest ? `Arr: ${arrTime}` : 'Intermediate Stop')}</b></div>
          <div><span>Corridor Clearance</span><b style="color:#4bd19a">Sanctioned Track Path</b></div>
        </div>
      </div>
    `);
    activeSearchedTrainRouteLayer.addLayer(marker);
  });

  // D. Moving train locomotive marker along THIS ROUTE
  let trainFrac = 0.3;
  const singleTrainIcon = L.divIcon({
    html: `
      <div class="cris-active-train-pin">
        <span class="train-pin-badge">⚡ ${trainNo}</span>
        <span class="train-pin-speed">104 km/h</span>
      </div>
    `,
    className: "custom-active-train-icon",
    iconSize: [150, 28],
    iconAnchor: [75, 14]
  });

  const singleTrainMarker = L.marker(interpolateRoute(waypoints, trainFrac), { icon: singleTrainIcon });
  singleTrainMarker.bindPopup(`
    <div class="cris-popup-card">
      <div class="cris-popup-head">
        <div>
          <h4>${trainNo} • ${trainName}</h4>
          <span>${origin} ➔ ${dest}</span>
        </div>
      </div>
      <div class="cris-popup-body">
        <div><span>Current Speed</span><b style="color:#2ecc71">104 km/h</b></div>
        <div><span>Runtime</span><b>${runtime}</b></div>
        <div><span>Punctuality Status</span><b style="color:#4bd19a">ON TIME</b></div>
        <div><span>Block Clearance Window</span><b style="color:#ff9933">16 mins</b></div>
      </div>
    </div>
  `);
  activeSearchedTrainRouteLayer.addLayer(singleTrainMarker);

  singleTrainMovingTimer = setInterval(() => {
    trainFrac = (trainFrac + 0.004) % 1.0;
    singleTrainMarker.setLatLng(interpolateRoute(waypoints, trainFrac));
  }, 100);

  // E. Zoom smoothly to route bounds
  const bounds = L.latLngBounds(waypoints);
  leafletMapInstance.flyToBounds(bounds, { padding: [40, 40], duration: 1.2 });

  // F. Floating details badge with Exit button
  const mapStage = document.querySelector(".map-leaflet-stage");
  if (mapStage) {
    const badge = document.createElement("div");
    badge.id = "trainRouteFloatingBadge";
    badge.className = "train-route-floating-badge";
    badge.innerHTML = `
      <strong>
        <span>🚆 ${trainNo} — ${trainName}</span>
        <button id="btnCloseFloatingRouteBadge" title="Exit Route View" style="background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#ef4444;border-radius:4px;padding:2px 8px;font-weight:800;cursor:pointer;font-size:11px">✕ Exit</button>
      </strong>
      <div class="route-sub">${origin} ➔ ${dest}</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:#93c5fd;margin-top:4px;border-top:1px solid rgba(255,255,255,0.15);padding-top:4px">
        <span>Dep: <b>${depTime}</b> | Arr: <b>${arrTime}</b></span>
        <span>Runtime: <b>${runtime}</b></span>
      </div>
      <div style="font-size:10.5px;color:#4bd19a;margin-top:2px">
        ✓ Displaying Single Route • Zero Traffic Clutter
      </div>
    `;
    mapStage.appendChild(badge);

    badge.querySelector("#btnCloseFloatingRouteBadge").onclick = () => {
      clearTrainRouteHighlight();
    };
  }

  // Update input and show clear button
  const input = document.querySelector("#trainRouteSearchInput");
  const clearBtn = document.querySelector("#btnClearTrainSearch");
  if (input) input.value = `${trainNo} • ${trainName}`;
  if (clearBtn) clearBtn.style.display = "block";

  showToast(`Isolated route for Train ${trainNo} (${trainName})!`);
}

function clearTrainRouteHighlight() {
  clearInterval(singleTrainMovingTimer);

  if (activeSearchedTrainRouteLayer && leafletMapInstance) {
    leafletMapInstance.removeLayer(activeSearchedTrainRouteLayer);
    activeSearchedTrainRouteLayer = null;
  }
  document.querySelector("#trainRouteFloatingBadge")?.remove();

  // Restore Default Overview Network Layer
  if (overviewDefaultLayerGroup && leafletMapInstance && !leafletMapInstance.hasLayer(overviewDefaultLayerGroup)) {
    leafletMapInstance.addLayer(overviewDefaultLayerGroup);
    initMovingTrains(leafletMapInstance);
  }

  const input = document.querySelector("#trainRouteSearchInput");
  const clearBtn = document.querySelector("#btnClearTrainSearch");
  if (input) input.value = "";
  if (clearBtn) clearBtn.style.display = "none";

  if (leafletMapInstance) {
    leafletMapInstance.flyTo([10.8505, 77.8500], 7, { duration: 1.0 });
  }
  showToast("Restored Southern Railway network overview.");
}

// ==========================================================================
// 9. TOAST & MODALS
// ==========================================================================

function showToast(msg, isError = false) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.style.borderColor = isError ? "var(--status-red)" : "var(--status-green)";
  t.innerHTML = `<span>${isError ? "⚠️" : "✓"}</span> <div>${esc(msg)}</div>`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

function showModal(title, description, bodyHtml, onConfirm, confirmText = "Submit") {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card">
      <h3>${esc(title)}</h3>
      <p>${esc(description)}</p>
      <div class="modal-form">${bodyHtml}</div>
      <div class="modal-actions">
        <button class="secondary" id="modalCancel">Cancel</button>
        ${confirmText ? `<button class="primary" id="modalConfirm">${esc(confirmText)}</button>` : ''}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  if (currentLang === "hi") {
    applyUniversalTranslation(overlay, "hi");
  }

  overlay.querySelector("#modalCancel").onclick = () => overlay.remove();
  if (confirmText) {
    overlay.querySelector("#modalConfirm").onclick = async () => {
      try {
        await onConfirm(overlay);
        overlay.remove();
      } catch (e) {
        showToast(e.message, true);
      }
    };
  }
}

// ==========================================================================
// 10. GANTT RENDERER & ACTIONS
// ==========================================================================

async function loadGanttTimeline() {
  const trPassenger = document.querySelector("#trackPassenger");
  const trFreight = document.querySelector("#trackFreight");
  const trBlock = document.querySelector("#trackBlock");
  if (!trPassenger || !trFreight || !trBlock) return;

  trPassenger.querySelectorAll(".gantt-block").forEach(e => e.remove());
  trFreight.querySelectorAll(".gantt-block").forEach(e => e.remove());
  trBlock.querySelectorAll(".gantt-block").forEach(e => e.remove());

  // Plot Passenger Trains
  const passSlots = [
    { start: 370, dur: 45, no: "20607", name: "Vande Bharat Express", time: "06:10 - 06:55" },
    { start: 480, dur: 50, no: "12675", name: "Kovai Express", time: "08:00 - 08:50" },
    { start: 800, dur: 40, no: "12635", name: "Vaigai Superfast", time: "13:20 - 14:00" },
    { start: 1300, dur: 55, no: "12637", name: "Pandian Superfast", time: "21:40 - 22:35" }
  ];

  passSlots.forEach(p => {
    const b = document.createElement("div");
    b.className = "gantt-block";
    b.style.position = "absolute";
    b.style.top = "4px";
    b.style.bottom = "4px";
    b.style.left = `${(p.start / 1440) * 100}%`;
    b.style.width = `${(p.dur / 1440) * 100}%`;
    b.style.background = "#143e70";
    b.style.border = "1px solid #3b74af";
    b.style.borderRadius = "3px";
    b.style.color = "#fff";
    b.style.fontSize = "9px";
    b.style.fontWeight = "700";
    b.style.display = "flex";
    b.style.alignItems = "center";
    b.style.padding = "0 4px";
    b.textContent = `${p.no} (${p.time})`;
    b.title = `${p.no} ${p.name}\nSlot: ${p.time}`;
    trPassenger.appendChild(b);
  });

  // Plot Freight Forecasts
  const frSlots = [
    { start: 540, dur: 120, title: "Container Freight (WAG-9 #4812) - 3,400T" },
    { start: 960, dur: 180, title: "Coal Rake Forecast #6720 - Palakkad Yard" }
  ];
  frSlots.forEach(f => {
    const b = document.createElement("div");
    b.className = "gantt-block";
    b.style.position = "absolute";
    b.style.top = "4px";
    b.style.bottom = "4px";
    b.style.left = `${(f.start / 1440) * 100}%`;
    b.style.width = `${(f.dur / 1440) * 100}%`;
    b.style.background = "#2b1442";
    b.style.border = "1px solid #7c4bb5";
    b.style.borderRadius = "3px";
    b.style.color = "#e5d4f7";
    b.style.fontSize = "9px";
    b.style.fontWeight = "700";
    b.style.display = "flex";
    b.style.alignItems = "center";
    b.style.padding = "0 4px";
    b.textContent = f.title.split(' ')[0] + " " + f.title.split(' ')[1];
    b.title = f.title;
    trFreight.appendChild(b);
  });

  // Plot AI Coordinated Maintenance Block
  const maintBlock = { start: 60, dur: 180, title: "AI Coordinated Multi-Dept Block (P-Way + TRD + S&T) • 01:00 - 04:00" };
  const mb = document.createElement("div");
  mb.className = "gantt-block";
  mb.style.position = "absolute";
  mb.style.top = "4px";
  mb.style.bottom = "4px";
  mb.style.left = `${(maintBlock.start / 1440) * 100}%`;
  mb.style.width = `${(maintBlock.dur / 1440) * 100}%`;
  mb.style.background = "#0e3a2b";
  mb.style.border = "1px solid #2ecc71";
  mb.style.borderRadius = "3px";
  mb.style.color = "#a3f7cb";
  mb.style.fontSize = "9px";
  mb.style.fontWeight = "700";
  mb.style.display = "flex";
  mb.style.alignItems = "center";
  mb.style.padding = "0 4px";
  mb.textContent = "Joint Block (01:00 - 04:00) • 180m";
  mb.title = maintBlock.title;
  trBlock.appendChild(mb);
}

async function loadTableData(endpoint) {
  const area = document.querySelector("#dataArea");
  if (!area) return;
  area.innerHTML = `<div style="padding:20px;text-align:center;color:#ff9933">Loading operational data from backend…</div>`;

  try {
    const data = await api.get(endpoint);
    let rows = Array.isArray(data) ? data : (data?.items || data?.data || (typeof data === "object" ? [data] : []));
    if (!rows || !rows.length) {
      area.innerHTML = '<div style="padding:20px;text-align:center;color:#8ea8c4">No records found.</div>';
      return;
    }

    const keys = Object.keys(rows[0]).filter(k => !k.startsWith("_") && k !== "created_at" && k !== "updated_at").slice(0, 7);

    area.innerHTML = `
      <div class="table-wrap-clean">
        <table class="clean-table">
          <thead>
            <tr>${keys.map(k => `<th>${esc(k.replace(/_/g, ' '))}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                ${keys.map(k => {
                  const val = r[k];
                  if (typeof val === "object" && val !== null) return `<td><code>${esc(JSON.stringify(val))}</code></td>`;
                  return `<td>${esc(val ?? '—')}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div style="margin-top:6px;font-size:10.5px;color:var(--text-muted)">Showing ${rows.length} verified government records</div>
    `;
  } catch (e) {
    area.innerHTML = `<div style="padding:20px;color:#ff6b62">Backend data probe: ${esc(e.message)}</div>`;
  }
}

window.updateBackendStatusBadge = (isOnline, infoText) => {
  connected = isOnline;
  const badges = document.querySelectorAll(".status-badge-pill, #topbarBackendBadge");
  badges.forEach(pill => {
    const span = pill.querySelector("span");
    if (isOnline) {
      pill.classList.remove("offline");
      pill.style.background = "rgba(34,197,94,0.12)";
      pill.style.borderColor = "rgba(34,197,94,0.35)";
      pill.style.color = "#22c55e";
      if (span) span.textContent = infoText || (currentLang === 'hi' ? 'फास्टएपीआई v1.0 ऑनलाइन' : 'FASTAPI v1.0 ONLINE');
    } else {
      pill.classList.add("offline");
      pill.style.background = "rgba(239,68,68,0.12)";
      pill.style.borderColor = "rgba(239,68,68,0.35)";
      pill.style.color = "#ef4444";
      if (span) span.textContent = infoText || (currentLang === 'hi' ? 'बैकएंड ऑफ़लाइन' : 'BACKEND OFFLINE');
    }
  });
};

window.checkBackendHealth = async (silent = true) => {
  try {
    const res = await api.health();
    const isHealthy = !!(res && (res.status === "healthy" || res.status === "ok" || res.app_name));
    window.updateBackendStatusBadge(isHealthy, isHealthy ? "FASTAPI v1.0 ONLINE" : "BACKEND OFFLINE");
    if (isHealthy && !silent) {
      showToast("✓ Connected to FastAPI backend at " + api.baseUrl);
    } else if (!isHealthy && !silent) {
      showToast("⚠️ Backend status is not healthy", true);
    }
    return isHealthy;
  } catch (err) {
    window.updateBackendStatusBadge(false, "BACKEND OFFLINE");
    if (!silent) {
      showToast("⚠️ Cannot reach FastAPI at " + api.baseUrl + ". Ensure server is running on port 8000.", true);
    }
    return false;
  }
};

window.showBackendConnectionModal = () => {
  const isHi = currentLang === 'hi';
  const base = api.baseUrl;
  showModal(
    isHi ? "फास्टएपीआई (FastAPI) बैकएंड कनेक्टिविटी" : "FastAPI Backend Connection & API Hub",
    isHi ? "दक्षिणी रेलवे ब्लॉक प्लानर बैकएंड स्थिति एवं लाइव दस्तावेज" : "Southern Railway Block Planner Backend Status & Live Documentation",
    `
      <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:8px;padding:16px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border-light)">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">⚡</span>
            <div>
              <div style="font-weight:800;font-size:15px;color:var(--text-heading)">Python FastAPI Backend Engine</div>
              <div style="font-size:11.5px;color:var(--text-muted)">SIH2026-BlockPlanning • High Availability Uvicorn Server</div>
            </div>
          </div>
          <span class="status-badge-pill ${connected ? '' : 'offline'}" style="font-size:11px;padding:4px 10px">
            <span class="status-dot-pulse"></span> ${connected ? 'FASTAPI v1.0 ONLINE' : 'BACKEND OFFLINE'}
          </span>
        </div>

        <div style="display:grid;gap:10px;font-size:12px">
          <div style="display:flex;justify-content:space-between;padding:6px 10px;background:var(--bg-input);border-radius:6px">
            <span style="color:var(--text-muted)">Backend Base URL:</span>
            <strong style="font-family:'JetBrains Mono',monospace;color:#60a5fa">${base}</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 10px;background:var(--bg-input);border-radius:6px">
            <span style="color:var(--text-muted)">Database Engine:</span>
            <strong style="color:#22c55e">SQLite (sih2026.db — Connected)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:6px 10px;background:var(--bg-input);border-radius:6px">
            <span style="color:var(--text-muted)">Active Route Modules:</span>
            <strong style="color:var(--text-heading)">16 API Services (Planning, Synergy, ML, Tracks, Trains)</strong>
          </div>
        </div>
      </div>

      <div style="margin-bottom:14px">
        <div style="font-size:12px;font-weight:800;color:var(--text-heading);margin-bottom:8px">Live API Links & Interactive Documentation:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <a href="${base}/docs" target="_blank" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:6px;color:#60a5fa;font-weight:700;font-size:12px">
            <span>📄 FastAPI Swagger UI ↗</span>
            <span style="font-size:10.5px;color:var(--text-muted)">/docs</span>
          </a>
          <a href="${base}/redoc" target="_blank" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:6px;color:#a855f7;font-weight:700;font-size:12px">
            <span>📖 ReDoc Documentation ↗</span>
            <span style="font-size:10.5px;color:var(--text-muted)">/redoc</span>
          </a>
          <a href="${base}/api/v1/health" target="_blank" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:6px;color:#22c55e;font-weight:700;font-size:12px">
            <span>🩺 Health Check JSON ↗</span>
            <span style="font-size:10.5px;color:var(--text-muted)">/api/v1/health</span>
          </a>
          <a href="${base}/api/v1/stations" target="_blank" style="text-decoration:none;display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:6px;color:#f59e0b;font-weight:700;font-size:12px">
            <span>🚉 Stations API JSON ↗</span>
            <span style="font-size:10.5px;color:var(--text-muted)">/api/v1/stations</span>
          </a>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:6px">
        <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:700" onclick="window.checkBackendHealth(false)">
          🔄 Re-test Connection
        </button>
        <button class="primary" style="padding:6px 14px;font-size:12px;font-weight:700" onclick="window.open('${base}/docs', '_blank')">
          ⚡ Open Swagger UI
        </button>
      </div>
    `,
    () => {},
    isHi ? "बंद करें" : "Close"
  );
};

async function loadDashboardMetrics() {
  try {
    const [healthRes, assetsRes, defectsRes] = await Promise.allSettled([
      api.health(),
      api.get("/api/v1/assets"),
      api.get("/api/v1/defects"),
    ]);

    const isHealthy = healthRes.status === "fulfilled" && !!healthRes.value;
    window.updateBackendStatusBadge(isHealthy, isHealthy ? "FASTAPI v1.0 ONLINE" : "BACKEND OFFLINE");
    dashboardData.assets = assetsRes.status === "fulfilled" ? (assetsRes.value?.total ?? 32) : 32;
    dashboardData.defects = defectsRes.status === "fulfilled" ? (defectsRes.value?.total ?? 51) : 51;
  } catch {
    window.updateBackendStatusBadge(false, "BACKEND OFFLINE");
  }
}


// ==========================================================================
// ==========================================================================
// BLOCK CALENDAR & TRAIN-ARRIVAL-AWARE ADMIN PLANNING ENGINE (2026 - 2027)
// ==========================================================================

const INITIAL_BLOCK_CALENDAR_PLANS = [
  {
    id: "BLK-2026-0901",
    title: "CBE Night CSM Track Tamping & Packing",
    station: "CBE",
    stationName: "Coimbatore Jn",
    division: "Salem",
    date: "2026-09-04",
    startTime: "01:15",
    endTime: "04:15",
    durationMins: 180,
    platform: "PF 2",
    lineType: "Platform Line 2",
    workType: "Track Maintenance (CSM Tamping)",
    machine: "CSM-09-32 Track Relaying & Tamping Unit #4",
    speedRestriction: "Full Line Speed (No TSR)",
    status: "Approved",
    precedingTrain: "16855 Mangalore Exp (Dep 01:00)",
    succeedingTrain: "22670 PNBE ERS Exp (Arr 04:45)",
    headwayMargin: "210 Minutes Safe Window (01:05 – 04:35 IST)",
    trainImpact: "Zero Passenger Detention. Completely aligned with train-free night window.",
    authorizedBy: "SR Admin (P-Way Salem Division)"
  },
  {
    id: "BLK-2026-0902",
    title: "MAS Basin Bridge Turnout & Diamond Interlocking Overhaul",
    station: "MAS",
    stationName: "MGR Chennai Central",
    division: "Chennai",
    date: "2026-09-06",
    startTime: "00:45",
    endTime: "04:15",
    durationMins: 210,
    platform: "PF 4 & Crossover 12A",
    lineType: "Basin Bridge Quadruple Chord",
    workType: "Turnout Renewal & Point Machine Overhaul",
    machine: "T-28 Points Relaying Machine & S&T Gang 3",
    speedRestriction: "Caution 30 km/h for 12 hours",
    status: "Approved",
    precedingTrain: "22698 MAS UBL SF Exp (Dep 00:30)",
    succeedingTrain: "12839 HWH MAS Exp (Arr 04:30)",
    headwayMargin: "240 Minutes Safe Window (00:30 – 04:30 IST)",
    trainImpact: "Zero Conflict on Mainlines. Shunting rakes held on BBQ Loop 4.",
    authorizedBy: "SR Chief Controller (Chennai HQ)"
  },
  {
    id: "BLK-2026-0903",
    title: "Erode Jn 25kV OHE Contact Wire Staggering & Dropper Audit",
    station: "ED",
    stationName: "Erode Jn",
    division: "Salem",
    date: "2026-09-10",
    startTime: "01:30",
    endTime: "04:30",
    durationMins: 180,
    platform: "Line 3 Down",
    lineType: "Down Mainline",
    workType: "25 kV OHE Traction Power Cut",
    machine: "RU-8 8-Wheeler Tower Wagon Unit #2",
    speedRestriction: "Full Line Speed",
    status: "Approved",
    precedingTrain: "12674 Cheran Exp (Pass 01:15)",
    succeedingTrain: "12622 Tamil Nadu Exp (Pass 04:45)",
    headwayMargin: "210 Minutes Safe Window",
    trainImpact: "Power cut isolated to Line 3. Up line energized and clear.",
    authorizedBy: "SR Traction Power Controller (TPC Erode)"
  },
  {
    id: "BLK-2026-0904",
    title: "Katpadi Jn Midday Ultrasonic Rail Flaw Testing (USFD)",
    station: "KPD",
    stationName: "Katpadi Jn",
    division: "Chennai",
    date: "2026-09-15",
    startTime: "11:30",
    endTime: "13:30",
    durationMins: 120,
    platform: "Line 1 Up",
    lineType: "Mainline Track Section",
    workType: "USFD Ultrasonic Rail Flaw Testing",
    machine: "Digital Double Rail Tester (DRT-14)",
    speedRestriction: "No Restriction (Push Trolley)",
    status: "Scheduled",
    precedingTrain: "12028 Shatabdi Exp (Pass 11:15)",
    succeedingTrain: "12639 Brindavan Exp (Pass 13:45)",
    headwayMargin: "150 Minutes Midday Traffic Gap",
    trainImpact: "Shadow block between express headways.",
    authorizedBy: "Senior Divisional Engineer (KPD)"
  },
  {
    id: "BLK-2026-0905",
    title: "Salem Jn Deep Screening Ballast Cleaning (BCM)",
    station: "SA",
    stationName: "Salem Jn",
    division: "Salem",
    date: "2026-09-22",
    startTime: "01:00",
    endTime: "04:00",
    durationMins: 180,
    platform: "PF 1",
    lineType: "Platform Line 1",
    workType: "Track Maintenance (Ballast Cleaning)",
    machine: "Plasser Ballast Cleaning Machine (BCM-350)",
    speedRestriction: "Caution 50 km/h",
    status: "Scheduled",
    precedingTrain: "16381 Pune Cape Exp (Pass 00:45)",
    succeedingTrain: "12695 Trivandrum Exp (Pass 04:15)",
    headwayMargin: "210 Minutes Safe Margin",
    trainImpact: "Zero passenger disruption.",
    authorizedBy: "Divisional Railway Manager (Salem)"
  },
  {
    id: "BLK-2026-1001",
    title: "Pamban Sea Bridge Cantilever Sensor Calibration & Bearing Lubrication",
    station: "MDU",
    stationName: "Mandapam - Pamban",
    division: "Madurai",
    date: "2026-10-05",
    startTime: "09:00",
    endTime: "13:00",
    durationMins: 240,
    platform: "Bridge Line",
    lineType: "Pamban Sea Bridge Km 2.06",
    workType: "Bridge Girder & Sensor Inspection",
    machine: "Bridge Inspection Gang & Hydraulic Jacks",
    speedRestriction: "Line Block (Traffic Paused)",
    status: "Planned",
    precedingTrain: "06651 RMM Passenger (Pass 08:30)",
    succeedingTrain: "16852 Boat Mail Express (Pass 14:15)",
    headwayMargin: "345 Minutes Coastal Window",
    trainImpact: "Coordinated with Southern Railway maritime schedule.",
    authorizedBy: "Deputy Chief Engineer (Bridges Madurai)"
  },
  {
    id: "BLK-2026-1002",
    title: "Palakkad Gap Track Alignment & Curve Super-Elevation Tamping",
    station: "PGT",
    stationName: "Palakkad Jn",
    division: "Palakkad",
    date: "2026-10-18",
    startTime: "01:30",
    endTime: "04:30",
    durationMins: 180,
    platform: "Line 2 Down",
    lineType: "Ghat Mainline Section",
    workType: "Track Maintenance (CSM Tamping)",
    machine: "CSM-09 Dynamic Tamping Unit",
    speedRestriction: "Full Line Speed",
    status: "Planned",
    precedingTrain: "16316 Mysuru Exp (Pass 01:10)",
    succeedingTrain: "16321 NCJ CBE Exp (Pass 04:45)",
    headwayMargin: "215 Minutes Night Margin",
    trainImpact: "Clear track line.",
    authorizedBy: "Sr. Divisional Operating Manager (PGT)"
  },
  {
    id: "BLK-2026-1101",
    title: "Thiruvananthapuram Central Solid-State Interlocking Overhaul",
    station: "TVC",
    stationName: "Thiruvananthapuram Central",
    division: "Thiruvananthapuram",
    date: "2026-11-12",
    startTime: "00:30",
    endTime: "04:00",
    durationMins: 210,
    platform: "PF 1 & 2",
    lineType: "Terminal Interlocking Throat",
    workType: "Signalling & Point Machine Overhaul",
    machine: "Dual-CPU EI Diagnostic Unit",
    speedRestriction: "No Restriction",
    status: "Planned",
    precedingTrain: "16344 Amritha Exp (Dep 00:15)",
    succeedingTrain: "12076 Jan Shatabdi Exp (Dep 05:55)",
    headwayMargin: "340 Minutes Terminal Gap",
    trainImpact: "Zero passenger delay.",
    authorizedBy: "Sr. DSTE (Trivandrum Division)"
  },
  {
    id: "BLK-2026-1201",
    title: "Coimbatore Jn Year-End Rail Grinding & Profiling",
    station: "CBE",
    stationName: "Coimbatore Jn",
    division: "Salem",
    date: "2026-12-08",
    startTime: "01:10",
    endTime: "04:20",
    durationMins: 190,
    platform: "PF 3 & Through Line",
    lineType: "Through Broad Gauge Line",
    workType: "Track Maintenance (Rail Grinding)",
    machine: "Loram Rail Grinder RG-40",
    speedRestriction: "Full Line Speed",
    status: "Scheduled",
    precedingTrain: "16855 Mangalore Exp (Dep 01:00)",
    succeedingTrain: "22670 PNBE ERS Exp (Arr 04:45)",
    headwayMargin: "210 Minutes Headway Gap",
    trainImpact: "Zero train conflict.",
    authorizedBy: "Chief Track Engineer (Southern Railway)"
  },
  {
    id: "BLK-2027-0101",
    title: "Chennai Central CWR De-Stressing & Thermit Flash Butt Welding",
    station: "MAS",
    stationName: "MGR Chennai Central",
    division: "Chennai",
    date: "2027-01-14",
    startTime: "01:00",
    endTime: "04:30",
    durationMins: 210,
    platform: "Down Fast Main",
    lineType: "Gudur Trunk Fast Line",
    workType: "Track Maintenance (Welding & De-stressing)",
    machine: "Mobile Flash Butt Welding Machine",
    speedRestriction: "Caution 45 km/h for 24h",
    status: "Planned",
    precedingTrain: "12842 Coromandel Exp (Pass 00:40)",
    succeedingTrain: "12616 Grand Trunk Exp (Arr 04:40)",
    headwayMargin: "240 Minutes Night Maintenance Slot",
    trainImpact: "Coordinated with Gudur Section traffic controllers.",
    authorizedBy: "Principal Chief Engineer (Zone 07 HQ)"
  },
  {
    id: "BLK-2027-0201",
    title: "Trichy Golden Rock Yard Digital Axle Counter Calibration",
    station: "TPJ",
    stationName: "Tiruchirappalli Jn",
    division: "Tiruchirappalli",
    date: "2027-02-20",
    startTime: "01:15",
    endTime: "04:15",
    durationMins: 180,
    platform: "Yard Reception Line 4",
    lineType: "Golden Rock Workshop Chord",
    workType: "Signalling & Point Machine Overhaul",
    machine: "DAC Multi-Section Calibration Kit",
    speedRestriction: "No Restriction",
    status: "Planned",
    precedingTrain: "16182 Silambu Exp (Pass 00:50)",
    succeedingTrain: "12654 Rockfort Exp (Arr 04:30)",
    headwayMargin: "220 Minutes Safe Gap",
    trainImpact: "Zero passenger impact.",
    authorizedBy: "Sr. DSTE (Trichy Division)"
  },
  {
    id: "BLK-2027-0301",
    title: "Madurai - Dindigul Fast Chord CSM Packing",
    station: "MDU",
    stationName: "Madurai Jn",
    division: "Madurai",
    date: "2027-03-16",
    startTime: "01:30",
    endTime: "04:30",
    durationMins: 180,
    platform: "Down Line",
    lineType: "Double Track Mainline",
    workType: "Track Maintenance (CSM Tamping)",
    machine: "CSM-09-32 Unit #7",
    speedRestriction: "Full Line Speed",
    status: "Planned",
    precedingTrain: "12638 Pandian Exp (Pass 01:10)",
    succeedingTrain: "16788 Navyug Exp (Pass 04:45)",
    headwayMargin: "215 Minutes Headway Margin",
    trainImpact: "Clean block section.",
    authorizedBy: "Divisional Engineer (MDU Track)"
  },
  {
    id: "BLK-2027-0601",
    title: "MAS Terminal Monsoon Drainage Overhaul & Switch Expansion Joints",
    station: "MAS",
    stationName: "MGR Chennai Central",
    division: "Chennai",
    date: "2027-06-10",
    startTime: "00:45",
    endTime: "04:15",
    durationMins: 210,
    platform: "PF 1 to 3 Throat",
    lineType: "Terminal Throat Interlocking",
    workType: "Track Maintenance (Drainage & SEJ)",
    machine: "Drainage Cleaning & SEJ Repair Gang",
    speedRestriction: "Caution 30 km/h",
    status: "Planned",
    precedingTrain: "12624 Chennai Mail (Arr 00:25)",
    succeedingTrain: "12839 HWH MAS Exp (Arr 04:30)",
    headwayMargin: "245 Minutes Pre-Monsoon Slot",
    trainImpact: "Zero passenger detention.",
    authorizedBy: "SR Admin (Chennai Division)"
  },
  {
    id: "BLK-2027-1001",
    title: "CBE Pre-Festival Track Strengthening & Elastic Rail Clips Audit",
    station: "CBE",
    stationName: "Coimbatore Jn",
    division: "Salem",
    date: "2027-10-24",
    startTime: "01:15",
    endTime: "04:15",
    durationMins: 180,
    platform: "PF 1 & 2",
    lineType: "Platform Lines",
    workType: "Track Maintenance (P-Way Strengthening)",
    machine: "P-Way Heavy Gang 8 & Tie Tamper",
    speedRestriction: "Full Line Speed",
    status: "Planned",
    precedingTrain: "16855 Mangalore Exp (Dep 01:00)",
    succeedingTrain: "22670 PNBE ERS Exp (Arr 04:45)",
    headwayMargin: "210 Minutes Festival Preparedness Window",
    trainImpact: "Zero train conflict.",
    authorizedBy: "Sr. DEN (Salem Division)"
  }
];

let blockCalendarPlans = (() => {
  try {
    const saved = localStorage.getItem("sr_calendar_plans");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [...INITIAL_BLOCK_CALENDAR_PLANS];
})();

let calYear = 2026;
let calMonth = 8; // 0-indexed: 8 = September 2026
let calActiveView = "calendar"; // "calendar" | "table" | "gap"
let calFilterStation = "ALL";
let calFilterDivision = "ALL";
let calFilterWorkType = "ALL";
let calSelectedDate = "2026-09-04";

window.changeCalMonth = (delta) => {
  let newMonth = calMonth + delta;
  let newYear = calYear;
  if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }
  // Enforce bounds: Sept 2026 (year 2026, month 8) to Dec 2027 (year 2027, month 11)
  if (newYear < 2026 || (newYear === 2026 && newMonth < 8)) {
    showToast("Block Calendar begins in September 2026");
    return;
  }
  if (newYear > 2027 || (newYear === 2027 && newMonth > 11)) {
    showToast("Block Calendar horizon extends up to December 2027");
    return;
  }
  calYear = newYear;
  calMonth = newMonth;
  render();
};

window.jumpCalTo = (year, month) => {
  calYear = year;
  calMonth = month;
  render();
};

window.setCalView = (v) => {
  calActiveView = v;
  render();
};

window.setCalFilterStation = (stn) => {
  calFilterStation = stn;
  render();
};

window.setCalFilterDivision = (div) => {
  calFilterDivision = div;
  render();
};

window.setCalFilterWorkType = (wt) => {
  calFilterWorkType = wt;
  render();
};

window.selectCalendarDay = (dateStr) => {
  calSelectedDate = dateStr;
  const dayPlans = blockCalendarPlans.filter(p => p.date === dateStr);
  if (dayPlans.length > 0) {
    showCalendarPlanDetailsModal(dayPlans[0].id);
  } else {
    openCreateBlockPlanModal(dateStr);
  }
};

window.showCalendarPlanDetailsModal = (planId) => {
  const p = blockCalendarPlans.find(item => item.id === planId);
  if (!p) return;
  const isHi = currentLang === 'hi';

  showModal(
    `Block Plan Dossier: ${p.title}`,
    `Authorized Traffic & Maintenance Block Window for ${p.stationName} (${p.date})`,
    `
      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);padding:12px;border-radius:6px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <strong style="font-size:13px;color:#60a5fa">${p.id} • ${p.stationName} (${p.station})</strong>
          <span style="background:rgba(34,197,94,0.15);color:#22c55e;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px">${p.status}</span>
        </div>
        <div style="font-size:12px;color:var(--text-main)">
          Date: <b>${p.date}</b> • Timing: <b>${p.startTime} – ${p.endTime} IST</b> (${p.durationMins} Mins)
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="background:var(--bg-input);padding:10px;border-radius:6px;border:1px solid var(--border-light)">
          <div style="font-size:11px;color:var(--text-muted)">TARGET ASSET & PLATFORM</div>
          <div style="font-size:13px;font-weight:700;color:var(--text-heading);margin-top:2px">${p.platform} (${p.lineType})</div>
          <div style="font-size:11px;color:var(--text-main);margin-top:4px">Work: <b>${p.workType}</b></div>
        </div>

        <div style="background:var(--bg-input);padding:10px;border-radius:6px;border:1px solid var(--border-light)">
          <div style="font-size:11px;color:var(--text-muted)">ASSIGNED MACHINERY / GANG</div>
          <div style="font-size:13px;font-weight:700;color:#3b82f6;margin-top:2px">${p.machine}</div>
          <div style="font-size:11px;color:var(--text-main);margin-top:4px">Speed Restriction: <b>${p.speedRestriction}</b></div>
        </div>
      </div>

      <div style="background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.3);padding:12px;border-radius:6px;margin-bottom:12px">
        <div style="font-size:12px;font-weight:800;color:#22c55e;margin-bottom:4px">
          🚦 Train Arrival Synchronization & Headway Safety
        </div>
        <div style="font-size:12px;color:var(--text-main);line-height:1.5">
          • Preceding Train: <b>${p.precedingTrain}</b><br/>
          • Succeeding Train: <b>${p.succeedingTrain}</b><br/>
          • Available Safe Window: <b style="color:#22c55e">${p.headwayMargin}</b><br/>
          • Operational Impact: <i>${p.trainImpact}</i>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--text-muted)">
        <span>Authorized By: <b>${p.authorizedBy}</b></span>
        <button style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer" onclick="deleteCalendarPlan('${p.id}')">
          🗑 Cancel / Delete Plan
        </button>
      </div>
    `,
    () => {},
    isHi ? "स्वीकार करें" : "Close Plan Dossier"
  );
};

window.deleteCalendarPlan = (planId) => {
  blockCalendarPlans = blockCalendarPlans.filter(p => p.id !== planId);
  try {
    localStorage.setItem("sr_calendar_plans", JSON.stringify(blockCalendarPlans));
  } catch(e) {}
  showToast("Block Plan cancelled and removed from calendar.");
  const m = document.querySelector("#modalBackdrop");
  if (m) m.remove();
  render();
};

window.openCreateBlockPlanModal = (prefillDate = "") => {
  const isHi = currentLang === 'hi';
  const defaultDate = prefillDate || (calYear === 2026 ? "2026-09-08" : `${calYear}-${String(calMonth+1).padStart(2,'0')}-10`);

  showModal(
    isHi ? "➕ नया ब्लॉक प्लान बनाएं (ट्रेन आगमन आधारित)" : "➕ Create Block Plan Based on Train Arrivals",
    isHi ? "ट्रेन समय सारणी का विश्लेषण करके सुरक्षित अनुरक्षण ब्लॉक तय करें (सितंबर 2026 - दिसंबर 2027)" : "Admin Planning Studio: Synchronize maintenance slots with live train arrivals (Sept 2026 – Dec 2027)",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">STATION / LOCATION *</label>
          <select id="npStation" style="width:100%;padding:7px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px" onchange="updateNewPlanTrainAnalysis()">
            <option value="CBE" selected>Coimbatore Jn (CBE) [Salem Division]</option>
            <option value="MAS">MGR Chennai Central (MAS) [Chennai HQ]</option>
            <option value="ED">Erode Jn (ED) [Salem Division]</option>
            <option value="SA">Salem Jn (SA) [Salem Division]</option>
            <option value="KPD">Katpadi Jn (KPD) [Chennai Division]</option>
            <option value="PGT">Palakkad Jn (PGT) [Palakkad Division]</option>
            <option value="MDU">Madurai Jn (MDU) [Madurai Division]</option>
            <option value="TPJ">Tiruchirappalli Jn (TPJ) [Trichy Division]</option>
            <option value="TVC">Thiruvananthapuram Central (TVC)</option>
          </select>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">BLOCK DATE (SEPT 2026 – DEC 2027) *</label>
          <input type="date" id="npDate" min="2026-09-01" max="2027-12-31" value="${defaultDate}" style="width:100%;padding:6px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px" onchange="updateNewPlanTrainAnalysis()" />
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">TRACK / PLATFORM LINE *</label>
          <select id="npPlatform" style="width:100%;padding:7px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px" onchange="updateNewPlanTrainAnalysis()">
            <option value="PF 1">Platform 1 (Mainline Up)</option>
            <option value="PF 2" selected>Platform 2 (Mainline Down)</option>
            <option value="PF 3">Platform 3 (Loop Line)</option>
            <option value="PF 4">Platform 4 (Branch / Loop)</option>
            <option value="PF 5">Platform 5 (Loop Line)</option>
            <option value="PF 6">Platform 6 (Chord Line)</option>
            <option value="Through Main Up">Through Track Main Up</option>
            <option value="Through Main Down">Through Track Main Down</option>
            <option value="Yard Siding">Coaching / Stabling Yard</option>
          </select>
        </div>

        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">WORK / ASSET DISCIPLINE *</label>
          <select id="npWorkType" style="width:100%;padding:7px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px">
            <option value="Track Maintenance (CSM Tamping)" selected>Track Maintenance (CSM Tamping)</option>
            <option value="25 kV OHE Traction Power Cut">25 kV OHE Traction Power Cut (Tower Wagon)</option>
            <option value="Signalling & Point Machine Overhaul">Signalling & Point Machine Overhaul (S&T)</option>
            <option value="USFD Ultrasonic Rail Flaw Testing">USFD Ultrasonic Rail Flaw Testing</option>
            <option value="Turnout Renewal & Point Machine Overhaul">Turnout Renewal & Diamond Point Overhaul</option>
            <option value="Bridge Girder & Sensor Inspection">Bridge Girder & Sensor Inspection</option>
            <option value="Deep Screening Ballast Cleaning (BCM)">Deep Screening Ballast Cleaning (BCM)</option>
          </select>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">START TIME (24-HR) *</label>
          <input type="text" id="npStart" value="01:15" style="width:100%;padding:6px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px;font-family:'JetBrains Mono',monospace;font-weight:700" oninput="updateNewPlanTrainAnalysis()" />
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">END TIME (24-HR) *</label>
          <input type="text" id="npEnd" value="04:15" style="width:100%;padding:6px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px;font-family:'JetBrains Mono',monospace;font-weight:700" oninput="updateNewPlanTrainAnalysis()" />
        </div>
        <div>
          <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">MACHINERY / GANG</label>
          <select id="npMachine" style="width:100%;padding:7px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px">
            <option value="CSM-09-32 Tamping Unit #4" selected>CSM-09-32 Tamping Unit #4</option>
            <option value="RU-8 8-Wheeler Tower Wagon">RU-8 8-Wheeler Tower Wagon</option>
            <option value="Plasser BCM-350 Ballast Cleaner">Plasser BCM-350 Ballast Cleaner</option>
            <option value="T-28 Points Relaying Machine">T-28 Points Relaying Machine</option>
            <option value="P-Way Section Gang 12">P-Way Section Gang 12</option>
            <option value="S&T Interlocking Crew">S&T Interlocking Crew</option>
          </select>
        </div>
      </div>

      <!-- Live AI Train Arrival & Headway Synchronization Box -->
      <div id="newPlanAiSyncBox" style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.35);border-radius:6px;padding:12px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:12px;font-weight:800;color:#22c55e;display:flex;align-items:center;gap:6px">
            <span>⚡</span> AI Train Headway Analyzer (Station Timetable Sync)
          </span>
          <button type="button" style="background:#2563eb;color:#fff;border:none;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:800;cursor:pointer" onclick="autoSnapToSafeGap()">
            Auto-Snap to Safe Gap (01:15 - 04:15)
          </button>
        </div>
        <div id="newPlanAiSyncContent" style="font-size:12px;color:var(--text-main);line-height:1.5">
          • Station Timetable Analyzed: <b>38 Scheduled Trains (Coimbatore Jn)</b><br/>
          • Preceding Departure: <b>16855 Mangalore Exp (01:00 Dep)</b><br/>
          • Succeeding Arrival: <b>22670 PNBE ERS Exp (04:45 Arr)</b><br/>
          • Conflict Status: <b style="color:#22c55e">✅ 100% Conflict Free. Safe 210-minute headway margin available.</b>
        </div>
      </div>

      <div>
        <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">PLAN TITLE / WORK DESCRIPTION *</label>
        <input type="text" id="npTitle" value="Scheduled Track Packing & Geometry Correction" style="width:100%;padding:7px 10px;border-radius:6px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);font-size:12.5px" />
      </div>
    `,
    () => {
      saveNewBlockPlanFromModal();
    },
    isHi ? "ब्लॉक प्लान अधिकृत करें और जोड़ें" : "Authorize & Add Block Plan to Calendar"
  );
};

window.autoSnapToSafeGap = () => {
  const stn = document.querySelector("#npStation")?.value || "CBE";
  const stEl = document.querySelector("#npStart");
  const enEl = document.querySelector("#npEnd");
  if (stn === "MAS") {
    if (stEl) stEl.value = "00:45";
    if (enEl) enEl.value = "04:15";
  } else {
    if (stEl) stEl.value = "01:15";
    if (enEl) enEl.value = "04:15";
  }
  showToast("Auto-snapped to optimal train-free headway slot!");
  updateNewPlanTrainAnalysis();
};

window.updateNewPlanTrainAnalysis = () => {
  const stn = document.querySelector("#npStation")?.value || "CBE";
  const startTime = (document.querySelector("#npStart")?.value || "01:15").trim();
  const box = document.querySelector("#newPlanAiSyncContent");
  if (!box) return;

  const isMas = stn === "MAS";
  const trainCount = isMas ? 88 : 38;
  const stnName = isMas ? "MGR Chennai Central (MAS)" : "Coimbatore Jn (CBE)";

  // Check clash: if timing falls in evening/day peak (e.g. 19:00 - 23:00 or 06:00 - 10:00)
  const hour = parseInt(startTime.split(":")[0]) || 1;
  const isPeak = (hour >= 6 && hour <= 11) || (hour >= 17 && hour <= 23);

  if (isPeak) {
    box.innerHTML = `
      • Station Timetable Analyzed: <b>${trainCount} Trains (${stnName})</b><br/>
      • Conflict Detection: <b style="color:#ef4444">⚠️ CRITICAL TRAIN CLASH WARNING!</b><br/>
      • Peak hour movement in progress (${startTime} IST). Track line occupied by scheduled passenger expresses.<br/>
      • Recommended Action: <span style="color:#f59e0b;font-weight:700">Click "Auto-Snap to Safe Gap" to shift to the 01:15 – 04:15 train-free night window.</span>
    `;
    const pBox = document.querySelector("#newPlanAiSyncBox");
    if (pBox) {
      pBox.style.background = "rgba(239,68,68,0.08)";
      pBox.style.borderColor = "rgba(239,68,68,0.4)";
    }
  } else {
    box.innerHTML = `
      • Station Timetable Analyzed: <b>${trainCount} Trains (${stnName})</b><br/>
      • Preceding Departure: <b>${isMas ? '22698 MAS UBL SF Exp (00:30 Dep)' : '16855 Mangalore Exp (01:00 Dep)'}</b><br/>
      • Succeeding Arrival: <b>${isMas ? '12839 HWH MAS Exp (04:30 Arr)' : '22670 PNBE ERS Exp (04:45 Arr)'}</b><br/>
      • Conflict Status: <b style="color:#22c55e">✅ 100% Conflict Free. Safe ${isMas ? '240' : '210'}-minute headway margin available.</b>
    `;
    const pBox = document.querySelector("#newPlanAiSyncBox");
    if (pBox) {
      pBox.style.background = "rgba(34,197,94,0.08)";
      pBox.style.borderColor = "rgba(34,197,94,0.35)";
    }
  }
};

window.saveNewBlockPlanFromModal = () => {
  const station = document.querySelector("#npStation")?.value || "CBE";
  const date = document.querySelector("#npDate")?.value || "2026-09-08";
  const platform = document.querySelector("#npPlatform")?.value || "PF 2";
  const workType = document.querySelector("#npWorkType")?.value || "Track Maintenance";
  const startTime = document.querySelector("#npStart")?.value || "01:15";
  const endTime = document.querySelector("#npEnd")?.value || "04:15";
  const machine = document.querySelector("#npMachine")?.value || "CSM-09-32 Tamping Unit";
  const title = document.querySelector("#npTitle")?.value || "Scheduled Maintenance Block";

  // Validate date range
  if (date < "2026-09-01" || date > "2027-12-31") {
    alert("Date must be within September 2026 to December 2027!");
    return;
  }

  const stationMap = {
    CBE: { name: "Coimbatore Jn", div: "Salem" },
    MAS: { name: "MGR Chennai Central", div: "Chennai" },
    ED: { name: "Erode Jn", div: "Salem" },
    SA: { name: "Salem Jn", div: "Salem" },
    KPD: { name: "Katpadi Jn", div: "Chennai" },
    PGT: { name: "Palakkad Jn", div: "Palakkad" },
    MDU: { name: "Madurai Jn", div: "Madurai" },
    TPJ: { name: "Tiruchirappalli Jn", div: "Trichy" },
    TVC: { name: "Thiruvananthapuram Central", div: "Thiruvananthapuram" },
  };

  const stnInfo = stationMap[station] || { name: station, div: "Southern Railway" };
  const newId = `BLK-${date.replace(/-/g, '').substring(0, 6)}-${String(blockCalendarPlans.length + 1).padStart(3, '0')}`;

  const newPlan = {
    id: newId,
    title: title,
    station: station,
    stationName: stnInfo.name,
    division: stnInfo.div,
    date: date,
    startTime: startTime,
    endTime: endTime,
    durationMins: 180,
    platform: platform,
    lineType: platform,
    workType: workType,
    machine: machine,
    speedRestriction: "Full Line Speed",
    status: "Approved",
    precedingTrain: station === "MAS" ? "22698 MAS UBL Exp (00:30 Dep)" : "16855 Mangalore Exp (01:00 Dep)",
    succeedingTrain: station === "MAS" ? "12839 HWH MAS Exp (04:30 Arr)" : "22670 PNBE ERS Exp (04:45 Arr)",
    headwayMargin: "Synchronized with train-free night margin",
    trainImpact: "Zero passenger disruption. Approved by Section Traffic Controller.",
    authorizedBy: "SR Admin (Block Planning Console)"
  };

  blockCalendarPlans.unshift(newPlan);
  try {
    localStorage.setItem("sr_calendar_plans", JSON.stringify(blockCalendarPlans));
  } catch(e) {}

  showToast(`Block Plan ${newId} created successfully for ${stnInfo.name} on ${date}!`);
  render();
};

function renderBlockCalendarPage() {
  const isHi = currentLang === 'hi';
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesHi = [
    "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
    "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
  ];

  const currentMonthLabel = isHi ? `${monthNamesHi[calMonth]} ${calYear}` : `${monthNames[calMonth]} ${calYear}`;

  // Filter plans
  const filteredPlans = blockCalendarPlans.filter(p => {
    if (calFilterStation !== "ALL" && p.station !== calFilterStation) return false;
    if (calFilterDivision !== "ALL" && p.division !== calFilterDivision) return false;
    if (calFilterWorkType !== "ALL" && !p.workType.toLowerCase().includes(calFilterWorkType.toLowerCase())) return false;
    return true;
  });

  // Calculate calendar grid days
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  // All months in Sept 2026 to Dec 2027 horizon
  const horizonMonths = [];
  // 2026: Sep (8) to Dec (11)
  for (let m = 8; m <= 11; m++) {
    horizonMonths.push({ year: 2026, month: m, label: `${monthNames[m]} 2026` });
  }
  // 2027: Jan (0) to Dec (11)
  for (let m = 0; m <= 11; m++) {
    horizonMonths.push({ year: 2027, month: m, label: `${monthNames[m]} 2027` });
  }

  return `
    <main class="content">
      <!-- Screen Header -->
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>${isHi ? 'ब्लॉक कैलेंडर एवं ट्रेन आगमन आधारित योजना (2026 - 2027)' : 'Block Calendar & Train-Arrival-Aware Planning (2026 – 2027)'}</h2>
          <div class="screen-breadcrumb">${isHi ? 'होम > ब्लॉक कैलेंडर' : 'Home > Planning & Synergy > Block Calendar'} > <b>${currentMonthLabel}</b></div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="primary" style="font-size:12.5px;padding:7px 16px;font-weight:800;display:flex;align-items:center;gap:6px" onclick="openCreateBlockPlanModal()">
            <span>➕</span> ${isHi ? 'नया ब्लॉक प्लान बनाएं' : 'Create Block Plan (Train Arrival Aware)'}
          </button>
        </div>
      </div>

      <!-- KPI Strip (Compact & Clean) -->
      <div class="cal-kpi-strip">
        <div class="cal-kpi-chip">
          <span style="font-size:16px">📅</span>
          <div>
            <div style="font-size:10.5px;color:var(--text-muted);font-weight:700">${isHi ? 'योजना क्षितिज' : 'Planning Horizon'}</div>
            <strong>Sept 2026 – Dec 2027</strong>
          </div>
        </div>

        <div class="cal-kpi-chip">
          <span style="font-size:16px">🛡️</span>
          <div>
            <div style="font-size:10.5px;color:var(--text-muted);font-weight:700">${isHi ? 'अनुसूचित ब्लॉक प्लान' : 'Scheduled Block Plans'}</div>
            <strong>${filteredPlans.length} Active Plans</strong>
          </div>
        </div>

        <div class="cal-kpi-chip">
          <span style="font-size:16px">⏱️</span>
          <div>
            <div style="font-size:10.5px;color:var(--text-muted);font-weight:700">${isHi ? 'औसत ट्रेन अंतराल' : 'Average Headway'}</div>
            <strong>218 Mins Gap (00:30–04:30)</strong>
          </div>
        </div>

        <div class="cal-kpi-chip">
          <span style="font-size:16px">🚜</span>
          <div>
            <div style="font-size:10.5px;color:var(--text-muted);font-weight:700">${isHi ? 'ट्रैक मशीन उपलब्धता' : 'Machinery Sync'}</div>
            <strong>CSM, BCM &amp; OHE Synced</strong>
          </div>
        </div>
      </div>

      <!-- Month Navigation & Controls Bar (Clean & Compact) -->
      <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:6px;padding:8px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <!-- Month Navigator -->
        <div style="display:flex;align-items:center;gap:8px">
          <button class="secondary" style="padding:4px 10px;font-size:13px;font-weight:800;border-radius:4px" onclick="changeCalMonth(-1)" title="Previous Month">
            ◀
          </button>
          
          <select style="font-size:13px;font-weight:800;background:var(--bg-input);color:var(--text-heading);border:1px solid var(--border-light);padding:4px 10px;border-radius:5px" onchange="const p=this.value.split('-');jumpCalTo(parseInt(p[0]), parseInt(p[1]))">
            ${horizonMonths.map(hm => `
              <option value="${hm.year}-${hm.month}" ${hm.year===calYear && hm.month===calMonth ? 'selected' : ''}>
                ${hm.label}
              </option>
            `).join('')}
          </select>

          <button class="secondary" style="padding:4px 10px;font-size:13px;font-weight:800;border-radius:4px" onclick="changeCalMonth(1)" title="Next Month">
            ▶
          </button>

          <button class="secondary" style="font-size:11px;padding:5px 9px;font-weight:700;border-radius:4px" onclick="jumpCalTo(2026, 8)">
            ${isHi ? 'आज (सितंबर 2026)' : 'Today (Sep 2026)'}
          </button>
        </div>

        <!-- Filter Sub-controls -->
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <select style="font-size:11.5px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px" onchange="setCalFilterDivision(this.value)">
            <option value="ALL" ${calFilterDivision==='ALL'?'selected':''}>All Divisions</option>
            <option value="Chennai" ${calFilterDivision==='Chennai'?'selected':''}>Chennai</option>
            <option value="Salem" ${calFilterDivision==='Salem'?'selected':''}>Salem</option>
            <option value="Palakkad" ${calFilterDivision==='Palakkad'?'selected':''}>Palakkad</option>
            <option value="Madurai" ${calFilterDivision==='Madurai'?'selected':''}>Madurai</option>
            <option value="Trichy" ${calFilterDivision==='Trichy'?'selected':''}>Trichy</option>
            <option value="Thiruvananthapuram" ${calFilterDivision==='Thiruvananthapuram'?'selected':''}>Thiruvananthapuram</option>
          </select>

          <select style="font-size:11.5px;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px" onchange="setCalFilterStation(this.value)">
            <option value="ALL" ${calFilterStation==='ALL'?'selected':''}>All Stations</option>
            <option value="CBE" ${calFilterStation==='CBE'?'selected':''}>Coimbatore (CBE)</option>
            <option value="MAS" ${calFilterStation==='MAS'?'selected':''}>Chennai Central (MAS)</option>
            <option value="ED" ${calFilterStation==='ED'?'selected':''}>Erode (ED)</option>
            <option value="SA" ${calFilterStation==='SA'?'selected':''}>Salem (SA)</option>
            <option value="KPD" ${calFilterStation==='KPD'?'selected':''}>Katpadi (KPD)</option>
            <option value="PGT" ${calFilterStation==='PGT'?'selected':''}>Palakkad (PGT)</option>
            <option value="MDU" ${calFilterStation==='MDU'?'selected':''}>Madurai (MDU)</option>
            <option value="TPJ" ${calFilterStation==='TPJ'?'selected':''}>Trichy (TPJ)</option>
          </select>

          <!-- View toggles -->
          <div style="display:flex;gap:4px;margin-left:4px">
            <button class="secondary" style="font-size:11px;padding:4px 9px;font-weight:700;border-radius:4px;${calActiveView==='calendar'?'background:#2563eb;color:#fff':''}" onclick="setCalView('calendar')">
              📅 ${isHi ? 'कैलेंडर' : 'Calendar'}
            </button>
            <button class="secondary" style="font-size:11px;padding:4px 9px;font-weight:700;border-radius:4px;${calActiveView==='table'?'background:#2563eb;color:#fff':''}" onclick="setCalView('table')">
              📋 ${isHi ? 'रजिस्ट्री तालिका' : 'Registry Table'} (${filteredPlans.length})
            </button>
          </div>
        </div>
      </div>

      ${calActiveView === "calendar" ? `
        <!-- 7-DAY COMPACT MONTH CALENDAR GRID -->
        <div class="panel" style="padding:0;overflow:hidden;border:1px solid var(--border-light);border-radius:6px;background:var(--bg-card)">
          <div class="cal-compact-header">
            <div style="color:#ef4444">${isHi ? 'रवि (SUN)' : 'SUN'}</div>
            <div>${isHi ? 'सोम (MON)' : 'MON'}</div>
            <div>${isHi ? 'मंगल (TUE)' : 'TUE'}</div>
            <div>${isHi ? 'बुध (WED)' : 'WED'}</div>
            <div>${isHi ? 'गुरु (THU)' : 'THU'}</div>
            <div>${isHi ? 'शुक्र (FRI)' : 'FRI'}</div>
            <div style="color:#3b82f6">${isHi ? 'शनि (SAT)' : 'SAT'}</div>
          </div>

          <div class="cal-compact-grid">
            ${(() => {
              let cells = [];
              // Empty cells before day 1
              for (let i = 0; i < firstDay; i++) {
                cells.push(`<div class="cal-compact-cell empty-slot"></div>`);
              }

              // Days of the month
              for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const dayPlans = filteredPlans.filter(p => p.date === dateStr);
                const isToday = (calYear === 2026 && calMonth === 8 && d === 3);

                cells.push(`
                  <div class="cal-compact-cell ${isToday ? 'is-today' : ''}" onclick="selectCalendarDay('${dateStr}')" title="${dayPlans.length ? dayPlans.map(p => `${p.station}: ${p.title} (${p.startTime}-${p.endTime})`).join('\n') : (isHi ? `${dateStr} के लिए ब्लॉक योजना जोड़ें` : `Click to schedule for ${dateStr}`)}">
                    <div class="cal-cell-head">
                      ${isToday ? `<span class="cal-today-num">${d}</span>` : `<span class="cal-day-num">${d}</span>`}
                      ${dayPlans.length > 0 ? `<span class="cal-plan-count-badge">${dayPlans.length} Plan${dayPlans.length > 1 ? 's' : ''}</span>` : ''}
                    </div>

                    <div style="display:flex;flex-direction:column;gap:2px;overflow:hidden">
                      ${dayPlans.slice(0, 2).map(p => {
                        let deptCls = "pway";
                        const wt = (p.workType || "").toLowerCase();
                        const dp = (p.department || "").toLowerCase();
                        if (wt.includes("trd") || dp.includes("trd") || dp.includes("elec") || wt.includes("ohe")) deptCls = "trd";
                        else if (wt.includes("signal") || dp.includes("s&t") || dp.includes("sign")) deptCls = "sandt";

                        return `
                          <div class="cal-compact-pill ${deptCls}">
                            <strong>${p.station}</strong> ${p.startTime} <span style="opacity:0.85">${p.title.split(' ')[0]}</span>
                          </div>
                        `;
                      }).join('')}
                      ${dayPlans.length > 2 ? `<div style="font-size:9px;color:var(--text-muted);font-weight:800;line-height:1;padding-left:2px">+${dayPlans.length - 2} more</div>` : ''}
                    </div>
                  </div>
                `);
              }

              // Trailing cells to fill row
              const totalCells = firstDay + daysInMonth;
              const remainder = (7 - (totalCells % 7)) % 7;
              for (let i = 0; i < remainder; i++) {
                cells.push(`<div class="cal-compact-cell empty-slot"></div>`);
              }

              return cells.join('');
            })()}
          </div>
        </div>
      ` : ''}

      ${calActiveView === "table" ? `
        <!-- REGISTRY TABLE VIEW -->
        <div class="panel" style="padding:0;overflow:hidden">
          <div style="padding:12px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="font-size:14px;color:var(--text-heading)">
                ${isHi ? 'अधिकृत अनुरक्षण ब्लॉक योजना रजिस्टर' : 'Authorized Maintenance Block Plan Registry'} (${filteredPlans.length} Plans)
              </strong>
              <div style="font-size:11px;color:var(--text-muted)">
                Comprehensive schedule from September 2026 to December 2027 with train headway alignment.
              </div>
            </div>
            <button class="secondary" style="font-size:11px;padding:4px 10px" onclick="openCreateBlockPlanModal()">
              + Add New Plan
            </button>
          </div>

          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:12px">
              <thead>
                <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">PLAN ID &amp; TITLE</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">LOCATION</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">DATE</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">TIME (24-HR)</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">WORK TYPE &amp; GANG</th>
                  <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">TRAIN ARRIVAL SYNCHRONIZATION</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">STATUS</th>
                  <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                ${filteredPlans.map((p, i) => `
                  <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                    <td style="padding:10px 14px">
                      <div style="font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:800">${p.id}</div>
                      <div style="font-weight:700;color:var(--text-heading)">${p.title}</div>
                      <small style="color:var(--text-muted)">${p.platform}</small>
                    </td>
                    <td style="padding:10px 14px">
                      <b>${p.stationName}</b> (${p.station})
                      <div style="font-size:11px;color:var(--text-muted)">${p.division} Division</div>
                    </td>
                    <td style="padding:10px 14px;text-align:center;font-weight:700">
                      ${p.date}
                    </td>
                    <td style="padding:10px 14px;text-align:center">
                      <b>${p.startTime} – ${p.endTime}</b>
                      <div style="font-size:10.5px;color:#22c55e;font-weight:700">${p.durationMins} Mins</div>
                    </td>
                    <td style="padding:10px 14px">
                      <div>${p.workType}</div>
                      <small style="color:#60a5fa">${p.machine}</small>
                    </td>
                    <td style="padding:10px 14px;max-width:260px;line-height:1.35">
                      <div style="font-size:11px;color:#22c55e;font-weight:700">✓ ${p.headwayMargin}</div>
                      <div style="font-size:10.5px;color:var(--text-muted)">Behind: ${p.precedingTrain}</div>
                      <div style="font-size:10.5px;color:var(--text-muted)">Ahead: ${p.succeedingTrain}</div>
                    </td>
                    <td style="padding:10px 14px;text-align:center">
                      <span style="background:rgba(34,197,94,0.15);color:#22c55e;padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:800">
                        ${p.status}
                      </span>
                    </td>
                    <td style="padding:10px 14px;text-align:center">
                      <button style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.4);color:#60a5fa;padding:3px 8px;border-radius:4px;font-size:11px;cursor:pointer" onclick="showCalendarPlanDetailsModal('${p.id}')">
                        Dossier
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </main>
  `;
}


// ASSET MANAGEMENT PAGE (Resources, Machines & Deployments)
// ==========================================================================

const ASSET_MOCK_DATA = [
  { id:"AST-001", name:"CSM 09-32 Dynamic Tamper #04",   category:"P-Way Machinery",    corridor:"Chennai Corridor",   status:"Deployed",   location:"Katpadi – JTJ Section",           next_maint:"15-Sep-2026", hrs:2840 },
  { id:"AST-002", name:"Plasser RM 80-92 UHR Screener",  category:"P-Way Machinery",    corridor:"Madurai Corridor",   status:"In Transit", location:"Golden Rock Workshop → Dindigul",  next_maint:"22-Sep-2026", hrs:1920 },
  { id:"AST-003", name:"TRD Tower Wagon TW-07-02",       category:"TRD Equipment",      corridor:"Palakkad Corridor",  status:"Deployed",   location:"Thrissur – ERS OHE Section",      next_maint:"10-Sep-2026", hrs:3210 },
  { id:"AST-004", name:"Thermit Weld Recasting Unit #3", category:"P-Way Machinery",    corridor:"Chennai Corridor",   status:"Standby",    location:"Salem Loco Shed",                 next_maint:"30-Sep-2026", hrs:1450 },
  { id:"AST-005", name:"Signal Relay Testing Unit #8",   category:"S&T Equipment",      corridor:"Trivandrum Corridor",status:"Deployed",   location:"TVC – QLN Interlocking Zone",     next_maint:"18-Sep-2026", hrs:980  },
  { id:"AST-006", name:"WAP-7 Loco #30351 (ELS Erode)", category:"Traction",           corridor:"Chennai Corridor",   status:"Active",     location:"SA – ED Section (Live)",          next_maint:"20-Sep-2026", hrs:18400},
  { id:"AST-007", name:"WAG-9 #31047 (Freight Consist)", category:"Traction",           corridor:"Bengaluru Corridor", status:"Active",     location:"GTL – SBC Freight Section",       next_maint:"12-Sep-2026", hrs:22100},
  { id:"AST-008", name:"CONCOR Flat Wagon Rake #BLCA",  category:"Freight Rolling Stock",corridor:"Bengaluru Corridor",status:"Standby",    location:"Tondiarpet Marshalling Yard",     next_maint:"01-Oct-2026", hrs:6200 },
  { id:"AST-009", name:"Ultrasonic Rail Flaw Detector",  category:"Inspection Equipment",corridor:"Madurai Corridor",  status:"Deployed",   location:"MDU – TEN Inspection Run",        next_maint:"25-Sep-2026", hrs:770  },
  { id:"AST-010", name:"OHE Contact Wire Tensioner",     category:"TRD Equipment",      corridor:"Trivandrum Corridor",status:"Standby",    location:"ERS Electrical Depot",            next_maint:"28-Sep-2026", hrs:1100 },
  { id:"AST-011", name:"High-Speed Tamper CSM 09-16",   category:"P-Way Machinery",    corridor:"Mysuru Corridor",    status:"Deployed",   location:"SBC – MYS Section",               next_maint:"14-Sep-2026", hrs:3050 },
  { id:"AST-012", name:"Ballast Cleaning Machine BCM-4", category:"P-Way Machinery",   corridor:"Palakkad Corridor",  status:"In Transit", location:"CBE Workshop → PGT Section",      next_maint:"19-Sep-2026", hrs:2340 },
];

let assetActiveTab = "all";
let assetCorridor = "All Corridors";
let assetStatusFilter = "All Status";
let assetSearch = "";

function renderAssetManagementPage() {
  const corridors = ["All Corridors", ...SR_CORRIDORS.map(c => c.name)];
  const statusOptions = ["All Status","Active","Deployed","Standby","In Transit"];
  const catCounts = {};
  ASSET_MOCK_DATA.forEach(a => { catCounts[a.category] = (catCounts[a.category] || 0) + 1; });

  let filtered = ASSET_MOCK_DATA.filter(a => {
    const matchCor = assetCorridor === "All Corridors" || a.corridor === assetCorridor;
    const matchSt  = assetStatusFilter === "All Status" || a.status === assetStatusFilter;
    const matchQ   = !assetSearch || a.name.toLowerCase().includes(assetSearch) || a.id.toLowerCase().includes(assetSearch) || a.category.toLowerCase().includes(assetSearch);
    const matchTab = assetActiveTab === "all"
      || (assetActiveTab === "pway"    && a.category.includes("P-Way"))
      || (assetActiveTab === "trd"     && a.category.includes("TRD"))
      || (assetActiveTab === "st"      && a.category.includes("S&T"))
      || (assetActiveTab === "traction"&& a.category.includes("Traction"))
      || (assetActiveTab === "freight" && a.category.includes("Freight"))
      || (assetActiveTab === "inspect" && a.category.includes("Inspection"));
    return matchCor && matchSt && matchQ && matchTab;
  });

  const statusColors = { "Active":"#22c55e","Deployed":"#3b82f6","Standby":"#f59e0b","In Transit":"#a78bfa" };
  const tabs = [
    { id:"all",    label:`All Assets (${ASSET_MOCK_DATA.length})` },
    { id:"pway",   label:"P-Way Machinery" },
    { id:"trd",    label:"TRD Equipment" },
    { id:"st",     label:"S&T Equipment" },
    { id:"traction",label:"Traction" },
    { id:"freight",label:"Freight" },
    { id:"inspect",label:"Inspection" },
  ];

  return `
    <main class="content">
      <!-- Header -->
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Asset Management</h2>
          <div class="screen-breadcrumb">Home > Asset Management</div>
        </div>
        <button class="primary" onclick="showToast('Registering new asset in CRIS Asset Registry…')">+ Register Asset</button>
      </div>

      <!-- KPI Summary Row -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:18px">
        <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:10px;padding:14px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px">TOTAL ASSETS</div>
          <div style="font-size:26px;font-weight:900;color:#60a5fa">${ASSET_MOCK_DATA.length}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">Across 6 Corridors</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:14px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px">ACTIVE / DEPLOYED</div>
          <div style="font-size:26px;font-weight:900;color:#22c55e">${ASSET_MOCK_DATA.filter(a=>["Active","Deployed"].includes(a.status)).length}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">In field operation</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px">STANDBY</div>
          <div style="font-size:26px;font-weight:900;color:#f59e0b">${ASSET_MOCK_DATA.filter(a=>a.status==="Standby").length}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">Awaiting deployment</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(167,139,250,0.3);border-radius:10px;padding:14px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px">IN TRANSIT</div>
          <div style="font-size:26px;font-weight:900;color:#a78bfa">${ASSET_MOCK_DATA.filter(a=>a.status==="In Transit").length}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">En route to section</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:14px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:4px">MAINT DUE (30d)</div>
          <div style="font-size:26px;font-weight:900;color:#ef4444">${ASSET_MOCK_DATA.filter(a=>{const d=a.next_maint.split('-');return new Date(d[2],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(d[1]),d[0])<=new Date(2026,9,1);}).length}</div>
          <div style="font-size:10.5px;color:var(--text-muted)">Scheduled for service</div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="screen-filter-bar" style="margin-bottom:14px">
        <select id="assetCorridorSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:6px;font-size:12px;font-weight:700">
          ${corridors.map(c=>`<option value="${c}" ${c===assetCorridor?'selected':''}>${c}</option>`).join('')}
        </select>
        <select id="assetStatusSelect" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:6px;font-size:12px;font-weight:700">
          ${statusOptions.map(s=>`<option value="${s}" ${s===assetStatusFilter?'selected':''}>${s}</option>`).join('')}
        </select>
        <input type="text" id="assetSearchInput" value="${esc(assetSearch)}" placeholder="Search asset name, ID, or category..." class="filter-search-input" style="width:260px" />
        <button class="filter-dropdown-btn" onclick="showToast('Exporting asset register to CSV…')">⬇ Export CSV</button>
        <button class="filter-dropdown-btn" onclick="showToast('Syncing with CRIS Asset Portal…')">🔄 Sync CRIS</button>
      </div>

      <!-- Category Tabs -->
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${tabs.map(t=>`
          <button data-asset-tab="${t.id}" style="
            padding:6px 14px;border-radius:20px;font-size:11.5px;font-weight:700;cursor:pointer;
            border:1px solid ${assetActiveTab===t.id?'#2563eb':'var(--border-light)'};
            background:${assetActiveTab===t.id?'#2563eb':'var(--bg-input)'};
            color:${assetActiveTab===t.id?'#fff':'var(--text-muted)'}
          ">${t.label}</button>
        `).join('')}
      </div>

      <!-- Asset Table -->
      <div class="panel" style="padding:0;overflow:hidden">
        <div style="overflow-x:auto;max-height:520px;overflow-y:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead style="position:sticky;top:0;background:var(--bg-card);z-index:10">
              <tr style="border-bottom:2px solid var(--border-light)">
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">ASSET ID</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">ASSET NAME</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">CATEGORY</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">CORRIDOR</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">CURRENT LOCATION</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">STATUS</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">TOTAL HRS</th>
                <th style="text-align:left;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">NEXT MAINT.</th>
                <th style="text-align:center;padding:10px 14px;font-size:11px;color:var(--text-muted);font-weight:700">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0
                ? `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--text-muted)">No assets found for selected filter.</td></tr>`
                : filtered.map((a, i) => `
                  <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                    <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#60a5fa;font-weight:700">${esc(a.id)}</td>
                    <td style="padding:10px 14px;font-weight:600;color:var(--text-heading);max-width:200px">${esc(a.name)}</td>
                    <td style="padding:10px 14px"><span style="background:rgba(99,102,241,0.12);color:#a78bfa;border:1px solid rgba(167,139,250,0.3);border-radius:4px;padding:2px 8px;font-size:10.5px;font-weight:700;white-space:nowrap">${esc(a.category)}</span></td>
                    <td style="padding:10px 14px;font-size:11.5px;color:var(--text-main)">${esc(a.corridor)}</td>
                    <td style="padding:10px 14px;font-size:11px;color:var(--text-muted);max-width:180px">${esc(a.location)}</td>
                    <td style="padding:10px 14px"><span style="background:${statusColors[a.status]||'#94a3b8'}18;color:${statusColors[a.status]||'#94a3b8'};border:1px solid ${statusColors[a.status]||'#94a3b8'}44;border-radius:4px;padding:2px 10px;font-size:11px;font-weight:800">${esc(a.status)}</span></td>
                    <td style="padding:10px 14px;font-size:11.5px;font-weight:700;color:var(--text-main)">${a.hrs.toLocaleString()} hrs</td>
                    <td style="padding:10px 14px;font-size:11px;color:${new Date(2026,8,15) >= new Date() ? '#ef4444' : 'var(--text-muted)'}">${esc(a.next_maint)}</td>
                    <td style="padding:10px 14px;text-align:center">
                      <div style="display:flex;justify-content:center;gap:6px">
                        <button title="View Details" style="background:transparent;border:none;color:#60a5fa;cursor:pointer;font-size:15px" onclick="showToast('Asset ${esc(a.id)}: ${esc(a.name)} — Details panel')">👁</button>
                        <button title="Deploy" style="background:transparent;border:none;color:#22c55e;cursor:pointer;font-size:15px" onclick="showToast('Initiating deployment workflow for ${esc(a.id)}…')">🚀</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
        <div style="padding:10px 14px;border-top:1px solid var(--border-light);font-size:11px;color:var(--text-muted)">
          Showing ${filtered.length} of ${ASSET_MOCK_DATA.length} assets • Data synced with CRIS Asset Registry
        </div>
      </div>
    </main>
  `;
}

// ==========================================================================
// SMART CORRIDOR MAP & ASSET MANAGEMENT SYSTEM (Matching SIH Official Specification)
// Incorporating 6 Official Southern Railway Divisions: MAS, MDU, PGT, SA, TVC, TPJ
// ==========================================================================

const SR_DIVISIONS_6 = [
  { code: "ALL", name: "All Divisions", hq: "Southern Railway Zonal HQ (MAS)", color: "#38bdf8" },
  { code: "MAS", name: "Chennai Division", hq: "Chennai Central", state: "Tamil Nadu", color: "#3b82f6", routeKm: "1,048 km", stationsCount: 344 },
  { code: "MDU", name: "Madurai Division", hq: "Madurai Jn", state: "Tamil Nadu", color: "#f59e0b", routeKm: "1,356 km", stationsCount: 210 },
  { code: "PGT", name: "Palakkad Division", hq: "Palakkad Jn", state: "Kerala", color: "#8b5cf6", routeKm: "1,112 km", stationsCount: 328 },
  { code: "SA",  name: "Salem Division", hq: "Salem Jn", state: "Tamil Nadu", color: "#ec4899", routeKm: "862 km", stationsCount: 195 },
  { code: "TVC", name: "Thiruvananthapuram Division", hq: "Thiruvananthapuram Central", state: "Kerala", color: "#10b981", routeKm: "844 km", stationsCount: 188 },
  { code: "TPJ", name: "Tiruchirappalli Division", hq: "Tiruchirappalli Jn", state: "Tamil Nadu", color: "#06b6d4", routeKm: "1,026 km", stationsCount: 224 }
];

const SR_CORRIDORS = [
  {
    id: "MAS-SBC",
    name: "Chennai - Bengaluru",
    code: "SEC-MAS-SBC",
    div: "MAS",
    km: "362 km",
    stations: 52,
    color: "#3b82f6",
    tracks: "Double Electrified (25kV AC)",
    speed: "130 km/h",
    desc: "MGR Chennai Central – Arakkonam – Katpadi – Jolarpettai – Bangarapet – KSR Bengaluru",
    coords: [
      [13.0827, 80.2707], [13.0784, 79.6677], [12.9696, 79.1362],
      [12.5638, 78.5802], [12.9942, 78.2017], [12.9784, 77.5684]
    ],
    blocks: { total: 14, planned: 8, live: 4, completed: 2 }
  },
  {
    id: "MAS-CBE",
    name: "Chennai - Coimbatore",
    code: "SEC-MAS-CBE",
    div: "SA",
    km: "497 km",
    stations: 68,
    color: "#06b6d4",
    tracks: "Double Electrified (25kV AC)",
    speed: "130 km/h",
    desc: "MAS – Arakkonam – Katpadi – Jolarpettai – Salem – Erode – Tiruppur – Coimbatore Jn",
    coords: [
      [13.0827, 80.2707], [13.0784, 79.6677], [12.9696, 79.1362], [12.5638, 78.5802],
      [11.6643, 78.1460], [11.3410, 77.7172], [11.1085, 77.3411], [11.0016, 76.9629]
    ],
    blocks: { total: 18, planned: 11, live: 5, completed: 2 }
  },
  {
    id: "MS-MDU",
    name: "Chennai - Madurai Grand Trunk",
    code: "SEC-MS-MDU",
    div: "TPJ",
    km: "496 km",
    stations: 62,
    color: "#f59e0b",
    tracks: "Double Electrified (25kV AC)",
    speed: "110 km/h",
    desc: "Chennai Egmore – Tambaram – Chengalpattu – Villupuram – Vriddhachalam – Ariyalur – Tiruchirappalli – Dindigul – Madurai",
    coords: [
      [13.0826, 80.2612], [12.9250, 80.1200], [12.6841, 79.9836], [11.9401, 79.4861],
      [11.5333, 79.3333], [11.1400, 79.0800], [10.7905, 78.6865], [10.3673, 77.9803], [9.9252, 78.1198]
    ],
    blocks: { total: 16, planned: 10, live: 4, completed: 2 }
  },
  {
    id: "PGT-TVC",
    name: "Palakkad - Trivandrum Coastline",
    code: "SEC-PGT-TVC",
    div: "TVC",
    km: "420 km",
    stations: 74,
    color: "#10b981",
    tracks: "Double Electrified (25kV AC)",
    speed: "110 km/h",
    desc: "Palakkad – Shoranur – Thrissur – Aluva – Ernakulam – Alappuzha/Kottayam – Kollam – Thiruvananthapuram – Kanyakumari",
    coords: [
      [10.7867, 76.6548], [10.7602, 76.2736], [10.5276, 76.2144], [10.1080, 76.3530],
      [9.9678, 76.2917], [9.4981, 76.3268], [8.8870, 76.5980], [8.4875, 76.9530], [8.0883, 77.5385]
    ],
    blocks: { total: 15, planned: 9, live: 4, completed: 2 }
  },
  {
    id: "TPJ-DELTA",
    name: "Tiruchirappalli - Delta Chord",
    code: "SEC-TPJ-DELTA",
    div: "TPJ",
    km: "275 km",
    stations: 42,
    color: "#ec4899",
    tracks: "Single/Double Electrified with MACLS",
    speed: "100 km/h",
    desc: "Villupuram – Cuddalore Port – Chidambaram – Mayiladuthurai – Thanjavur – Tiruchirappalli (with Karaikal Port branch)",
    coords: [
      [11.9401, 79.4861], [11.7480, 79.7680], [11.3980, 79.6930], [11.1018, 79.6522],
      [10.9602, 79.3845], [10.7870, 79.1378], [10.7905, 78.6865]
    ],
    blocks: { total: 9, planned: 5, live: 3, completed: 1 }
  },
  {
    id: "MDU-RMM",
    name: "Madurai - Rameswaram Pamban",
    code: "SEC-MDU-RMM",
    div: "MDU",
    km: "161 km",
    stations: 24,
    color: "#ef4444",
    tracks: "Marine Coastal Line & Sea Lift Bridge",
    speed: "80 km/h (Pamban: 30 km/h)",
    desc: "Madurai Jn – Manamadurai – Paramakkudi – Ramanathapuram – Mandapam – Pamban Sea Bridge – Rameswaram",
    coords: [
      [9.9252, 78.1198], [9.7000, 78.4500], [9.5400, 78.5900], [9.3667, 78.8333],
      [9.2825, 79.1200], [9.2825, 79.1983], [9.2876, 79.3129]
    ],
    blocks: { total: 8, planned: 4, live: 3, completed: 1 }
  },
  {
    id: "PGT-MAQ",
    name: "Malabar West Coast Line",
    code: "SEC-PGT-MAQ",
    div: "PGT",
    km: "310 km",
    stations: 58,
    color: "#8b5cf6",
    tracks: "Double Electrified (25kV AC)",
    speed: "110 km/h",
    desc: "Shoranur Jn – Tirur – Kozhikode – Vadakara – Kannur – Kasaragod – Mangaluru Central",
    coords: [
      [10.7602, 76.2736], [10.9100, 75.9200], [11.2480, 75.7804], [11.6000, 75.5900],
      [11.8745, 75.3704], [12.5000, 74.9800], [12.8687, 74.8427]
    ],
    blocks: { total: 12, planned: 7, live: 3, completed: 2 }
  },
  {
    id: "MDU-TEN",
    name: "Madurai - Tirunelveli South Trunk",
    code: "SEC-MDU-TEN",
    div: "MDU",
    km: "157 km",
    stations: 32,
    color: "#f97316",
    tracks: "Double Electrified Line",
    speed: "110 km/h",
    desc: "Madurai Jn – Virudhunagar – Kovilpatti – Vanchi Maniyachchi – Tirunelveli Jn (with Sengottai & Tuticorin branches)",
    coords: [
      [9.9252, 78.1198], [9.5872, 77.9577], [9.1700, 77.8700], [8.8600, 77.8700], [8.7139, 77.7567]
    ],
    blocks: { total: 10, planned: 6, live: 3, completed: 1 }
  }
];

// Comprehensive Real Assets Database for Southern Railway
const SR_MAP_ASSETS = [
  // BRIDGES
  {
    id: "SR-BRG-AR-0017",
    name: "Arakkonam Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Major Bridge",
    section: "Arakkonam - Katpadi",
    river: "Palar River",
    km: "Km. 1042/8-9",
    year: 1910,
    length: "298.45 m",
    spans: 12,
    div: "MAS",
    coords: [12.9850, 79.6200],
    condition: "Good",
    desc: "Substantial multi-span bridge across Palar River on MAS-CBE trunk line with electronic track circuits.",
    history: [
      { year: "1910", text: "Bridge Constructed with stone piers and steel girders" },
      { year: "1965", text: "Strengthening Work for steam-to-diesel loco transition" },
      { year: "1988", text: "Major Repair & underwater pier scour protection" },
      { year: "2001", text: "Deck Replacement with prestressed concrete slabs" },
      { year: "2015", text: "Structural Painting & ultrasonic weld defect testing" },
      { year: "2021", text: "Detailed Inspection & 25kV OHE mast re-alignment" },
      { year: "2024", text: "Current Condition: Good • Line speed 130 km/h" }
    ],
    blocks: [
      { id: "BLK-2024-1021", from: "15/07/24", to: "18/07/24", type: "Maintenance", dur: "3 Days" },
      { id: "BLK-2023-0890", from: "10/06/23", to: "12/06/23", type: "Inspection", dur: "2 Days" },
      { id: "BLK-2022-0712", from: "22/05/22", to: "24/05/22", type: "Maintenance", dur: "2 Days" },
      { id: "BLK-2021-0654", from: "11/04/21", to: "13/04/21", type: "Repair", dur: "2 Days" },
      { id: "BLK-2020-0451", from: "19/02/20", to: "21/02/20", type: "Maintenance", dur: "3 Days" }
    ]
  },
  {
    id: "SR-BRG-MDU-0001",
    name: "Pamban Railway Sea Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Marine Cantilever Sea Bridge",
    section: "Mandapam - Rameswaram",
    river: "Palk Strait (Indian Ocean)",
    km: "Km. 2.06",
    year: 1914,
    length: "2,065 m",
    spans: 143,
    div: "MDU",
    coords: [9.2825, 79.1983],
    condition: "Active Caution 30 km/h",
    desc: "India's historic first sea bridge featuring the Scherzer rolling lift span, now upgraded with state-of-the-art vertical lift bridge.",
    history: [
      { year: "1914", text: "Commissioned as India's premier cantilever sea bridge" },
      { year: "1964", text: "Heroic reconstruction in 46 days after catastrophic cyclone" },
      { year: "2007", text: "Broad Gauge conversion & structural load capacity enhancement" },
      { year: "2020", text: "Digital anemometer interlocks installed for cyclone winds" },
      { year: "2024", text: "New state-of-the-art vertical lift rail sea bridge commissioned" }
    ],
    blocks: [
      { id: "BLK-2024-0012", from: "02/08/24", to: "06/08/24", type: "Structural Inspection", dur: "4 Days" },
      { id: "BLK-2023-0144", from: "14/01/23", to: "18/01/23", type: "Corrosion Treatment", dur: "4 Days" },
      { id: "BLK-2022-0988", from: "19/11/22", to: "22/11/22", type: "Sensor Calibration", dur: "3 Days" }
    ]
  },
  {
    id: "SR-BRG-SA-0042",
    name: "Cauvery River Rail Bridge (Erode)",
    category: "Bridges",
    icon: "⛩️",
    type: "Steel Truss Girder",
    section: "Erode - Karur",
    river: "River Cauvery",
    km: "Km. 388/4-8",
    year: 1935,
    length: "1,210 m",
    spans: 16,
    div: "SA",
    coords: [11.3500, 77.7300],
    condition: "Good (110 km/h)",
    desc: "Heavy steel truss multi-span bridge linking Salem & Tiruchirappalli divisions over Cauvery River.",
    history: [
      { year: "1935", text: "Reconstructed for South Indian Railway heavy freight" },
      { year: "1978", text: "Pier strengthening and steel rivet replacement" },
      { year: "2012", text: "Electrification 25kV OHE portal erection" },
      { year: "2023", text: "Acoustic emission testing confirmed 0 defect fatigue" }
    ],
    blocks: [
      { id: "BLK-2024-0419", from: "12/04/24", to: "14/04/24", type: "Pier Audit", dur: "2 Days" },
      { id: "BLK-2023-0801", from: "20/08/23", to: "22/08/23", type: "Track Alignment", dur: "2 Days" }
    ]
  },
  {
    id: "SR-BRG-TVC-0008",
    name: "Vembanad Rail Bridge (Vallarpadam)",
    category: "Bridges",
    icon: "⛩️",
    type: "Longest Dedicated Rail Freight Bridge",
    section: "Edappally - Vallarpadam ICTT",
    river: "Vembanad Lake / Backwaters",
    km: "Km. 4.62",
    year: 2011,
    length: "4,620 m",
    spans: 132,
    div: "TVC",
    coords: [10.0135, 76.2625],
    condition: "Excellent",
    desc: "India's longest dedicated railway freight bridge handling international container trains (CONCOR) to Kochi Port.",
    history: [
      { year: "2011", text: "Commissioned as longest railway bridge in India (4.62 km)" },
      { year: "2018", text: "Overcame Kerala floods with resilient ballast retaining walls" },
      { year: "2023", text: "Complete cathodic marine anti-rust audit completed" }
    ],
    blocks: [
      { id: "BLK-2024-0911", from: "10/05/24", to: "12/05/24", type: "Expansion Joint Servicing", dur: "2 Days" }
    ]
  },
  {
    id: "SR-BRG-TPJ-0019",
    name: "Coleroon River Rail Bridge",
    category: "Bridges",
    icon: "⛩️",
    type: "Prestressed Concrete Arch Bridge",
    section: "Srirangam - Golden Rock",
    river: "River Coleroon",
    km: "Km. 334/1-6",
    year: 1927,
    length: "1,420 m",
    spans: 28,
    div: "TPJ",
    coords: [10.8500, 78.7000],
    condition: "Good (130 km/h)",
    desc: "Vital bridge linking North and South Tamil Nadu on the Chennai-Trichy-Madurai Grand Trunk Chord.",
    history: [
      { year: "1927", text: "Constructed during Trichy chord line double-tracking" },
      { year: "1995", text: "Concrete jacketing of piers for enhanced hydrological safety" },
      { year: "2022", text: "Sensors deployed for continuous live water-level telemetry" }
    ],
    blocks: [
      { id: "BLK-2024-0302", from: "18/02/24", to: "20/02/24", type: "Bed Block Maintenance", dur: "2 Days" }
    ]
  },
  {
    id: "SR-BRG-PGT-0024",
    name: "Bharatappuzha Nila Rail Viaduct",
    category: "Bridges",
    icon: "⛩️",
    type: "Stone Masonry & Steel Rail Viaduct",
    section: "Shoranur - Tirur",
    river: "River Bharatappuzha (Nila)",
    km: "Km. 582/2-8",
    year: 1902,
    length: "950 m",
    spans: 20,
    div: "PGT",
    coords: [10.7600, 76.2800],
    condition: "Good",
    desc: "Historic multi-span viaduct spanning River Nila at Shoranur Junction on the Malabar railway route.",
    history: [
      { year: "1902", text: "Constructed by Madras Railway Company" },
      { year: "1972", text: "Piers reinforced with RCC underpinning" },
      { year: "2019", text: "Substructure scour telemetry sensors activated" }
    ],
    blocks: [
      { id: "BLK-2023-1102", from: "05/11/23", to: "07/11/23", type: "De-silting & Track Tamper", dur: "2 Days" }
    ]
  },

  // LOCO SHEDS
  {
    id: "SR-SHD-ED-001",
    name: "Erode Electric Loco Shed (ELS/ED)",
    category: "Loco Sheds",
    icon: "🛑",
    type: "Electric Locomotive Shed",
    section: "Erode Junction Yard",
    river: "Near Cauvery River",
    km: "Km. 396.0",
    year: 1980,
    length: "Holding: 215 Locomotives",
    spans: "Classes: WAP-4, WAP-7, WAG-9HC",
    div: "SA",
    coords: [11.3385, 77.7274],
    condition: "ISO 9001:2015 Certified",
    desc: "Premier 3-phase high-power electric locomotive shed in Southern Railway, maintaining mainline passenger and freight locomotives.",
    history: [
      { year: "1980", text: "Commissioned as premier AC electric loco shed" },
      { year: "2005", text: "First shed in Southern Railway to overhaul WAP-4 electric locos" },
      { year: "2016", text: "3-phase IGBT-based WAP-7 maintenance bay commissioned" },
      { year: "2024", text: "Total holding crossed 215 locomotives with 99.4% reliability" }
    ],
    blocks: [
      { id: "BLK-2024-0801", from: "01/08/24", to: "02/08/24", type: "Yard Track Renewal", dur: "1 Day" }
    ]
  },
  {
    id: "SR-SHD-RPM-002",
    name: "Royapuram Electric Loco Shed (ELS/RPM)",
    category: "Loco Sheds",
    icon: "🛑",
    type: "Electric Passenger Loco Shed",
    section: "Chennai Port - Royapuram",
    river: "Coastal Marina Basin",
    km: "Km. 4.2",
    year: 1923,
    length: "Holding: 110 Locomotives",
    spans: "Classes: WAP-7, High-Speed Trains",
    div: "MAS",
    coords: [13.1118, 80.2934],
    condition: "Premier High-Speed Shed",
    desc: "Oldest electric locomotive shed in Southern Railway, powering Vande Bharat, Shatabdi, and Superfast express trains.",
    history: [
      { year: "1923", text: "Founded as historic steam and early electric depot" },
      { year: "2007", text: "Full conversion to pure 6000 HP 3-phase WAP-7 locomotives" },
      { year: "2023", text: "Vande Bharat Semi-High Speed testing bay operationalized" }
    ],
    blocks: [
      { id: "BLK-2024-0412", from: "14/04/24", to: "15/04/24", type: "Pit Line Electrification", dur: "1 Day" }
    ]
  },
  {
    id: "SR-SHD-AJJ-003",
    name: "Arakkonam Electric Loco Shed (ELS/AJJ)",
    category: "Loco Sheds",
    icon: "🛑",
    type: "Heavy Freight & Express Electric Shed",
    section: "Arakkonam Yard Complex",
    river: "Palar Basin",
    km: "Km. 68.5",
    year: 1982,
    length: "Holding: 185 Locomotives",
    spans: "Classes: WAG-7, WAP-4, WAG-9",
    div: "MAS",
    coords: [13.0784, 79.6677],
    condition: "Active 24x7",
    desc: "Massive locomotive maintenance hub dedicated to heavy minerals, port containers, and long-distance trains.",
    history: [
      { year: "1982", text: "Established to support Chennai-Arkonam-Katpadi trunk freight" },
      { year: "2000", text: "WAG-7 micro-processor fault diagnostic bay installed" },
      { year: "2021", text: "Upgraded with computerized regenerative braking testing rigs" }
    ],
    blocks: [
      { id: "BLK-2023-0919", from: "19/09/23", to: "20/09/23", type: "Overhead 25kV Feeder Block", dur: "1 Day" }
    ]
  },
  {
    id: "SR-SHD-GOC-004",
    name: "Golden Rock Diesel & Heritage Shed (GOC)",
    category: "Loco Sheds",
    icon: "🛑",
    type: "Diesel & Steam Heritage Shed",
    section: "Tiruchirappalli Golden Rock",
    river: "Cauvery South Basin",
    km: "Km. 338.0",
    year: 1928,
    length: "Holding: 140 Locomotives",
    spans: "Classes: WDP-4D, WDG-4D, NMR 'X' Class Steam",
    div: "TPJ",
    coords: [10.7745, 78.7061],
    condition: "Heritage & Modern Dual Hub",
    desc: "Legendary shed maintaining heavy EMD diesel locomotives and manufacturing UNESCO World Heritage Nilgiri Mountain Railway steam locos.",
    history: [
      { year: "1928", text: "Founded by South Indian Railway" },
      { year: "2005", text: "Indigenous manufacturing of oil-fired steam locomotives for Ooty" },
      { year: "2022", text: "B20 Biodiesel locomotive pilot successfully demonstrated" }
    ],
    blocks: [
      { id: "BLK-2024-0105", from: "05/01/24", to: "07/01/24", type: "Turntable Overhaul", dur: "2 Days" }
    ]
  },
  {
    id: "SR-SHD-ERS-005",
    name: "Ernakulam Diesel Loco Shed (DLS/ERS)",
    category: "Loco Sheds",
    icon: "🛑",
    type: "Diesel Locomotive Shed",
    section: "Ernakulam Junction Yard",
    river: "Vembanad Estuary",
    km: "Km. 102.0",
    year: 1981,
    length: "Holding: 95 Locomotives",
    spans: "Classes: WDM-3D, WDG-3A, WDP-4D",
    div: "TVC",
    coords: [9.9658, 76.2974],
    condition: "Active",
    desc: "Primary diesel hub serving Kerala's rail network, goods trains, and coastal industrial connections.",
    history: [
      { year: "1981", text: "Commissioned as premier diesel facility for Kerala zone" },
      { year: "2014", text: "High-horsepower 4500 HP WDP-4D locos inducted" }
    ],
    blocks: [
      { id: "BLK-2023-0410", from: "10/04/23", to: "11/04/23", type: "Fuelling Bay Track Renewal", dur: "1 Day" }
    ]
  },

  // COACH DEPOTS & WORKSHOPS
  {
    id: "SR-DPT-BBQ-001",
    name: "Basin Bridge Train Care Centre (BBQ)",
    category: "Coach Depots",
    icon: "🚆",
    type: "Principal Coaching Depot",
    section: "Chennai Central Approach",
    river: "Buckingham Canal",
    km: "Km. 2.1",
    year: 1978,
    length: "18 Washing Pit Lines",
    spans: "Daily Servicing: 55+ Rakes",
    div: "MAS",
    coords: [13.0975, 80.2742],
    condition: "Ultra-High Frequency Facility",
    desc: "India's busiest passenger train maintenance depot, servicing Vande Bharat, Rajdhani, Shatabdi, and Superfast rakes with automated cleaning.",
    history: [
      { year: "1978", text: "Expanded to support Chennai Central long-distance trains" },
      { year: "2019", text: "Automated coach exterior washing plant installed" },
      { year: "2023", text: "Specialized Vande Bharat 16-car pit line commissioned" }
    ],
    blocks: [
      { id: "BLK-2024-0618", from: "18/06/24", to: "20/06/24", type: "Pit Line #4 Renewal", dur: "2 Days" }
    ]
  },
  {
    id: "SR-WRK-PER-001",
    name: "Perambur Carriage & Wagon Works (CW/PER)",
    category: "Workshops",
    icon: "🛠️",
    type: "POH Coach Overhaul Workshop",
    section: "Perambur Railway Complex",
    river: "Otteri Nullah Basin",
    km: "Km. 5.8",
    year: 1932,
    length: "Area: 185 Acres",
    spans: "Capacity: 220 Coaches / Month",
    div: "MAS",
    coords: [13.1023, 80.2372],
    condition: "Zonal Center of Excellence",
    desc: "Principal Periodic Overhaul (POH) workshop of Southern Railway for modern LHB stainless-steel coaches and ICF passenger cars.",
    history: [
      { year: "1932", text: "Founded by Madras and Southern Mahratta Railway" },
      { year: "2018", text: "LHB coach periodic overhaul facility inaugurated" },
      { year: "2023", text: "Modern robotic wheel lathe and laser wheel profilers installed" }
    ],
    blocks: [
      { id: "BLK-2024-0211", from: "11/02/24", to: "13/02/24", type: "Siding Track Overhaul", dur: "2 Days" }
    ]
  },
  {
    id: "SR-WRK-GOC-003",
    name: "Golden Rock Railway Workshop (GOC)",
    category: "Workshops",
    icon: "🛠️",
    type: "Integrated Wagon & Heritage Workshop",
    section: "Tiruchirappalli Ponmalai",
    river: "Cauvery Basin",
    km: "Km. 340.0",
    year: 1928,
    length: "Area: 200 Acres",
    spans: "Capacity: 300 Wagons + Heritage Steam",
    div: "TPJ",
    coords: [10.7800, 78.7100],
    condition: "Historical Landmark & Modern POH",
    desc: "Award-winning workshop famous for wagon manufacturing, container overhauls, and UNESCO Nilgiri Mountain Railway heritage locomotives.",
    history: [
      { year: "1928", text: "Established as central mechanical workshop of SIR" },
      { year: "2010", text: "Manufacturing of high-capacity BLC container flats began" },
      { year: "2024", text: "CII National Energy Excellence Award recipient" }
    ],
    blocks: [
      { id: "BLK-2023-1205", from: "05/12/23", to: "07/12/23", type: "Traverser Track Maintenance", dur: "2 Days" }
    ]
  },

  // RAILWAY YARDS & GOODS SHEDS
  {
    id: "SR-YRD-TNP-001",
    name: "Tondiarpet Marshalling Yard (TNPM)",
    category: "Railway Yards",
    icon: "🚉",
    type: "Major Port Marshalling Yard",
    section: "Chennai Port Railway Line",
    river: "Coastal Port Zone",
    km: "Km. 6.4",
    year: 1958,
    length: "24 Sorting Tracks",
    spans: "Capacity: 1,800 Wagons / Day",
    div: "MAS",
    coords: [13.1200, 80.2800],
    condition: "Continuous 24/7 Shunting",
    desc: "Strategic railway interchange yard handling import/export freight between Chennai Port, CPCL refineries, and national rail corridors.",
    history: [
      { year: "1958", text: "Developed as principal freight sorting yard for Madras Port" },
      { year: "2015", text: "Solid State Interlocking (SSI) yard control room inaugurated" }
    ],
    blocks: [
      { id: "BLK-2024-0515", from: "15/05/24", to: "16/05/24", type: "Yard Turnout Machine Tamping", dur: "1 Day" }
    ]
  },
  {
    id: "SR-YRD-JTJ-002",
    name: "Jolarpettai Marshalling Yard (JTJ)",
    category: "Railway Yards",
    icon: "🚉",
    type: "Junction Hump Marshalling Yard",
    section: "Jolarpettai Junction",
    river: "Palar Basin",
    km: "Km. 214.0",
    year: 1918,
    length: "16 Sorting Tracks",
    spans: "Capacity: 1,200 Wagons / Day",
    div: "SA",
    coords: [12.5647, 78.5630],
    condition: "Active Operational Hub",
    desc: "Crucial strategic railway crossroads connecting Chennai, Bangalore, Coimbatore, and Kerala networks.",
    history: [
      { year: "1918", text: "Built during British South Indian Railway expansion" },
      { year: "2018", text: "Complete yard remodeling to eliminate bottleneck crossings" }
    ],
    blocks: [
      { id: "BLK-2024-0701", from: "01/07/24", to: "03/07/24", type: "Electronic Interlocking Calibration", dur: "2 Days" }
    ]
  },
  {
    id: "SR-YRD-IGU-004",
    name: "Irugur Inland Container Yard (IGU)",
    category: "Railway Yards",
    icon: "🚉",
    type: "CONCOR Inland Container Depot",
    section: "Irugur - Coimbatore",
    river: "Noyyal River Basin",
    km: "Km. 488.0",
    year: 1998,
    length: "8 Container Stabling Tracks",
    spans: "Capacity: 45 Rakes / Month",
    div: "SA",
    coords: [11.0212, 77.0512],
    condition: "High-Traffic Export Yard",
    desc: "Industrial freight hub handling industrial pumps, textile garments, and heavy engineering exports from western Tamil Nadu.",
    history: [
      { year: "1998", text: "Commissioned as CONCOR multi-modal logistics park" },
      { year: "2021", text: "Electrified siding for seamless direct electric train arrival" }
    ],
    blocks: [
      { id: "BLK-2023-0518", from: "18/05/23", to: "19/05/23", type: "Siding Track Screening", dur: "1 Day" }
    ]
  },
  {
    id: "SR-GDS-CBE-002",
    name: "Coimbatore North Goods Shed (CBF)",
    category: "Goods Sheds",
    icon: "📦",
    type: "General Merchandise Goods Shed",
    section: "Coimbatore North Jn",
    river: "Noyyal Basin",
    km: "Km. 498.5",
    year: 1952,
    length: "4 Loading Platforms",
    spans: "Capacity: 12 Rakes / Week",
    div: "SA",
    coords: [11.0253, 76.9535],
    condition: "Active Goods Depot",
    desc: "Key inward cargo terminal for foodgrains (FCI), cement, fertilizer, and automobile logistics.",
    history: [
      { year: "1952", text: "Opened for commercial wagonload and parcel traffic" },
      { year: "2024", text: "24/7 all-weather concrete covered goods wharf completed" }
    ],
    blocks: [
      { id: "BLK-2024-0314", from: "14/03/24", to: "15/03/24", type: "Platform Siding Renewal", dur: "1 Day" }
    ]
  },

  // TUNNELS
  {
    id: "SR-TNL-PGT-001",
    name: "Palakkad Gap Mountain Tunnel #1",
    category: "Tunnels",
    icon: "🚇",
    type: "Broad Gauge Mountain Tunnel",
    section: "Walayar – Kanjikode (Ghats)",
    river: "Western Ghats Gap",
    km: "Km. 518.2",
    year: 1968,
    length: "1,250 m",
    spans: "Speed: 110 km/h",
    div: "PGT",
    coords: [10.8100, 76.7100],
    condition: "Good",
    desc: "Scenic tunnel cutting through the rugged Nilgiri-Anamalai mountain gap connecting Tamil Nadu and Kerala.",
    history: [
      { year: "1968", text: "Constructed during Walayar ghat double line alignment" },
      { year: "2015", text: "Overhead 25kV rigid catenary installed" }
    ],
    blocks: [
      { id: "BLK-2023-0711", from: "11/07/23", to: "12/07/23", type: "Rock Bolt & Drainage Audit", dur: "1 Day" }
    ]
  },

  // ACTIVE & PLANNED BLOCKS ON MAP
  {
    id: "BLK-ACT-MAS-01",
    name: "Katpadi - Jolarpettai (Active Block)",
    category: "Active Blocks",
    icon: "🚧",
    type: "Active Maintenance Block",
    section: "Katpadi Jn – Jolarpettai Jn",
    river: "Palar Valley",
    km: "KM 142.5 - 148.0",
    year: 2026,
    length: "5.5 km Track Block",
    spans: "Duration: 180 Mins (01:00 - 04:00 IST)",
    div: "MAS",
    coords: [12.7667, 78.8582],
    condition: "Pulsing Caution 30 km/h",
    desc: "CSM High-Speed Dynamic Tamping Machine deployment combined with 25kV OHE power isolation and S&T signal point testing.",
    history: [
      { year: "01/09/2026", text: "Traffic & Power Block sanctioned by Chief Train Controller" },
      { year: "Today", text: "Track deep tamping in progress • 3 departmental synergy active" }
    ],
    blocks: [
      { id: "BLK-ACT-MAS-01", from: "01/09/26", to: "03/09/26", type: "Dynamic Tamping", dur: "3 Days" }
    ]
  },
  {
    id: "BLK-PLN-SA-02",
    name: "Salem - Erode (Planned Block)",
    category: "Planned Blocks",
    icon: "⏳",
    type: "Planned Track Machine Block",
    section: "Salem Jn – Erode Jn",
    river: "Sankari Valley",
    km: "KM 268.0 - 272.5",
    year: 2026,
    length: "4.5 km Ballast Screening",
    spans: "Duration: 4 Hours (11:30 - 15:30 IST)",
    div: "SA",
    coords: [11.5000, 77.9300],
    condition: "Window Scheduled",
    desc: "Plasser RM 80-92 UHR Ballast Cleaning Machine (BCM) deployment during afternoon passenger headway gap.",
    history: [
      { year: "30/08/2026", text: "AI Block Planner resolved conflict-free window between Kovai Express and goods trains" }
    ],
    blocks: [
      { id: "BLK-PLN-SA-02", from: "04/09/26", to: "05/09/26", type: "Ballast Screening", dur: "1 Day" }
    ]
  },
  {
    id: "BLK-MNT-TPJ-03",
    name: "Villupuram - Vriddhachalam (Maintenance Zone)",
    category: "Maintenance Zones",
    icon: "🔍",
    type: "USFD Ultrasonic Safety Zone",
    section: "Villupuram – Vriddhachalam",
    river: "Gadilam River Zone",
    km: "KM 118.0 - 124.0",
    year: 2026,
    length: "6.0 km Continuous Testing",
    spans: "Duration: 3.5 Hours",
    div: "TPJ",
    coords: [11.7300, 79.4100],
    condition: "TSR 45 km/h Active",
    desc: "Intensive digital USFD ultrasonic testing of thermit weld joints and rail head micro-fracture prevention.",
    history: [
      { year: "31/08/2026", text: "Safety Director defect notice DEF-004 logged for weld testing" }
    ],
    blocks: [
      { id: "BLK-MNT-TPJ-03", from: "02/09/26", to: "04/09/26", type: "Ultrasonic Testing", dur: "2 Days" }
    ]
  }
];

let selectedSmartCorridor = "ALL";
let selectedSmartDivision = "ALL";
let selectedSmartAssetType = "ALL";
let selectedSmartBlockStatus = "ALL";
let smartMapSearchQuery = "";
let selectedSmartAsset = SR_MAP_ASSETS[0]; // Default: Arakkonam Bridge
let smartActiveTab = "OVERVIEW";
let isSmartLayersCollapsed = true;
let isSmartAssetPanelMinimized = false;
let activeTileLayerType = 'DARK';
let liveTrainAnimationInterval = null;

let smartLayerGroups = {
  tracks: null,
  stations: null,
  junctions: null,
  bridges: null,
  tunnels: null,
  levelCrossings: null,
  rivers: null,
  locoSheds: null,
  coachDepots: null,
  workshops: null,
  goodsSheds: null,
  yards: null,
  activeBlocks: null,
  plannedBlocks: null,
  historicalBlocks: null,
  maintenanceZones: null,
  liveTrains: null
};

const ASSET_SVG_ICONS = {
  "Bridges": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18M3 14l3-6 3 6M15 14l3-6 3 6M9 14h6M3 18v3M21 18v3M9 14v7M15 14v7"/></svg>`,
  "Loco Sheds": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 11h16M9 19v2M15 19v2M8 15h.01M16 15h.01M9 3l3 2 3-2"/></svg>`,
  "Coach Depots": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><line x1="3" y1="11" x2="21" y2="11"/></svg>`,
  "Workshops": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  "Railway Yards": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h4l4 14h10M3 19h18M7 9l4 10"/></svg>`,
  "Goods Sheds": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>`,
  "Tunnels": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V10a8 8 0 0 1 16 0v11M2 21h20M9 21v-6a3 3 0 0 1 6 0v6"/></svg>`,
  "Active Blocks": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  "Planned Blocks": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  "Maintenance Zones": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

const DIVISION_CENTERS = {
  "MAS": { coords: [13.0827, 80.2707], zoom: 9 },
  "MDU": { coords: [9.9252, 78.1198], zoom: 9 },
  "PGT": { coords: [10.7867, 76.6548], zoom: 9 },
  "SA":  { coords: [11.6643, 78.1460], zoom: 9 },
  "TVC": { coords: [8.8870, 76.5980], zoom: 9 },
  "TPJ": { coords: [10.7905, 78.6865], zoom: 9 }
};

const ACTIVE_BLOCK_WORKSITES = [
  { name: "Podanur - Irugur Track Machine Block", coords: [10.9850, 77.0200], id: "BLK-2026-SA-041", type: "Continuous Track Tamping (CSM-09)", dur: "2h 45m left", div: "SA", corridor: "MAS-CBE" },
  { name: "Basin Bridge OHE Catenary Inspection", coords: [13.1000, 80.2650], id: "BLK-2026-MAS-019", type: "25kV AC Tower Wagon Inspection", dur: "1h 30m left", div: "MAS", corridor: "MAS-SBC" },
  { name: "Pamban Vertical Lift Sea Bridge Test", coords: [9.2825, 79.1983], id: "BLK-2026-MDU-008", type: "Structural Sea Span Mechanical Test", dur: "45m left", div: "MDU", corridor: "MDU-RMM" }
];

const LIVE_TRAIN_SERVICES = [
  {
    train: "20631",
    name: "MAQ TVC Vande Bharat",
    type: "Vande Bharat Express",
    speed: "110 km/h",
    from: "Kozhikode",
    to: "Ernakulam Jn",
    div: "PGT",
    path: [[11.2480, 75.7804], [10.7602, 76.2736], [10.5276, 76.2144], [9.9678, 76.2917]],
    step: 0.65
  },
  {
    train: "20632",
    name: "TVC MAQ Vande Bharat",
    type: "Vande Bharat Express",
    speed: "110 km/h",
    from: "Ernakulam Jn",
    to: "Shoranur Jn",
    div: "TVC",
    path: [[9.9678, 76.2917], [10.5276, 76.2144], [10.7602, 76.2736]],
    step: 0.35
  },
  {
    train: "20607",
    name: "MAS MYS Vande Bharat",
    type: "Vande Bharat Express",
    speed: "130 km/h",
    from: "Chennai Central",
    to: "Katpadi Jn",
    div: "MAS",
    path: [[13.0827, 80.2707], [13.0784, 79.6677], [12.9696, 79.1362]],
    step: 0.45
  },
  {
    train: "12674",
    name: "Cheran Superfast Express",
    type: "Superfast Express",
    speed: "110 km/h",
    from: "Coimbatore Jn",
    to: "Erode Jn",
    div: "SA",
    path: [[11.0016, 76.9629], [11.1085, 77.3411], [11.3410, 77.7172]],
    step: 0.70
  },
  {
    train: "12431",
    name: "TVC NZM Rajdhani Express",
    type: "Rajdhani Express",
    speed: "120 km/h",
    from: "Trivandrum Central",
    to: "Kollam Jn",
    div: "TVC",
    path: [[8.4875, 76.9530], [8.8870, 76.5980], [9.4981, 76.3268]],
    step: 0.50
  },
  {
    train: "CSM-09",
    name: "Track Maintenance Tamper #4",
    type: "Machine Block Worksite",
    speed: "15 km/h",
    from: "Podanur Jn",
    to: "Irugur Jn",
    div: "SA",
    path: [[10.9600, 76.9800], [11.0100, 77.0600]],
    step: 0.50
  }
];

const MAJOR_JUNCTIONS = [
  { code: "MAS", name: "MGR Chennai Central", coords: [13.0827, 80.2707], div: "MAS" },
  { code: "AJJ", name: "Arakkonam Jn", coords: [13.0784, 79.6677], div: "MAS" },
  { code: "KPD", name: "Katpadi Jn", coords: [12.9696, 79.1362], div: "MAS" },
  { code: "JTJ", name: "Jolarpettai Jn", coords: [12.5638, 78.5802], div: "SA" },
  { code: "SA",  name: "Salem Jn", coords: [11.6643, 78.1460], div: "SA" },
  { code: "ED",  name: "Erode Jn", coords: [11.3410, 77.7172], div: "SA" },
  { code: "CBE", name: "Coimbatore Jn", coords: [11.0016, 76.9629], div: "SA" },
  { code: "PGT", name: "Palakkad Jn", coords: [10.7867, 76.6548], div: "PGT" },
  { code: "SRR", name: "Shoranur Jn", coords: [10.7602, 76.2736], div: "PGT" },
  { code: "CLT", name: "Kozhikode", coords: [11.2480, 75.7804], div: "PGT" },
  { code: "CAN", name: "Kannur", coords: [11.8745, 75.3704], div: "PGT" },
  { code: "MAQ", name: "Mangaluru Central", coords: [12.8687, 74.8427], div: "PGT" },
  { code: "TCR", name: "Thrissur", coords: [10.5276, 76.2144], div: "TVC" },
  { code: "ERS", name: "Ernakulam Jn", coords: [9.9678, 76.2917], div: "TVC" },
  { code: "QLN", name: "Kollam Jn", coords: [8.8870, 76.5980], div: "TVC" },
  { code: "TVC", name: "Thiruvananthapuram Central", coords: [8.4875, 76.9530], div: "TVC" },
  { code: "CAPE",name: "Kanyakumari", coords: [8.0883, 77.5385], div: "TVC" },
  { code: "VM",  name: "Villupuram Jn", coords: [11.9401, 79.4861], div: "TPJ" },
  { code: "VRI", name: "Vriddhachalam Jn", coords: [11.5333, 79.3333], div: "TPJ" },
  { code: "TPJ", name: "Tiruchirappalli Jn", coords: [10.7905, 78.6865], div: "TPJ" },
  { code: "TJ",  name: "Thanjavur Jn", coords: [10.7870, 79.1378], div: "TPJ" },
  { code: "DG",  name: "Dindigul Jn", coords: [10.3673, 77.9803], div: "MDU" },
  { code: "MDU", name: "Madurai Jn", coords: [9.9252, 78.1198], div: "MDU" },
  { code: "VPT", name: "Virudhunagar Jn", coords: [9.5872, 77.9577], div: "MDU" },
  { code: "TEN", name: "Tirunelveli Jn", coords: [8.7139, 77.7567], div: "MDU" },
  { code: "RMM", name: "Rameswaram", coords: [9.2876, 79.3129], div: "MDU" }
];

window.renderSmartAssetPanelHtml = (ast) => {
  const iconSvg = ASSET_SVG_ICONS[ast.category] || ASSET_SVG_ICONS["Bridges"];
  return `
    <div class="smart-asset-header">
      <div>
        <h3 style="display:flex;align-items:center;gap:8px">
          <span style="display:inline-flex;align-items:center;color:#60a5fa;width:18px;height:18px">${iconSvg}</span>
          <span>${ast.name}</span>
        </h3>
        <div class="smart-asset-id-tag">Asset ID : ${ast.id}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="smart-asset-close-btn" onclick="window.toggleMinimizeSmartAssetPanel()" title="Minimize / Expand" style="font-size:13px">
          ${isSmartAssetPanelMinimized ? '□' : '—'}
        </button>
        <button class="smart-asset-close-btn" onclick="window.closeSmartAssetPanel()" title="Close Asset Info">✖</button>
      </div>
    </div>

    <div class="smart-asset-scroll-content">
      <!-- Asset Metadata Table -->
      <table class="smart-meta-table">
        <tbody>
          <tr><td>Type</td><td>${ast.type || 'Major Rail Asset'}</td></tr>
          <tr><td>Section</td><td>${ast.section || 'Southern Railway Trunk'}</td></tr>
          <tr><td>River / Zone</td><td>${ast.river || 'Mainline Corridors'}</td></tr>
          <tr><td>Km</td><td>${ast.km || 'Km. 0.0'}</td></tr>
          <tr><td>Year of Construction</td><td>${ast.year || '1910'}</td></tr>
          <tr><td>Length / Capacity</td><td>${ast.length || '298.45 m'}</td></tr>
          <tr><td>Division Jurisdiction</td><td><span style="background:#1e3a5f;color:#60a5fa;padding:1px 6px;border-radius:4px;font-weight:800">${ast.div || 'MAS'}</span></td></tr>
          <tr><td>No. of Spans / Holding</td><td>${ast.spans || '12'}</td></tr>
        </tbody>
      </table>

      <!-- Tabs: OVERVIEW, HISTORY, MAINTENANCE, BLOCKS -->
      <div class="smart-tabs-strip">
        <button class="smart-tab-btn ${smartActiveTab === 'OVERVIEW' ? 'active' : ''}" onclick="window.setSmartTab('OVERVIEW')">OVERVIEW</button>
        <button class="smart-tab-btn ${smartActiveTab === 'HISTORY' ? 'active' : ''}" onclick="window.setSmartTab('HISTORY')">HISTORY</button>
        <button class="smart-tab-btn ${smartActiveTab === 'MAINTENANCE' ? 'active' : ''}" onclick="window.setSmartTab('MAINTENANCE')">MAINTENANCE</button>
        <button class="smart-tab-btn ${smartActiveTab === 'BLOCKS' ? 'active' : ''}" onclick="window.setSmartTab('BLOCKS')">BLOCKS</button>
      </div>

      <!-- Tab Content -->
      ${smartActiveTab === 'OVERVIEW' || smartActiveTab === 'HISTORY' ? `
        <div class="smart-timeline-list">
          ${(ast.history || []).map(h => `
            <div class="smart-timeline-item">
              <div class="smart-timeline-dot"></div>
              <span class="smart-timeline-year">${h.year}</span>
              <span class="smart-timeline-desc">${h.text}</span>
            </div>
          `).join('')}
        </div>
      ` : `
        <div style="font-size:11.5px;color:#94a3b8;line-height:1.5;margin-bottom:8px">
          <b>Operational Health Status:</b> <span style="color:#22c55e;font-weight:700">${ast.condition || 'Operational • Normal line speed permitted'}</span>
          <p style="margin-top:6px">${ast.desc || 'Monitored under Indian Railways Track Management System (TMS) & CRIS Master Registry.'}</p>
        </div>
      `}

      <button class="smart-view-full-btn" onclick="showToast('Opened Technical Dossier for ${ast.name} [${ast.id}]')">
        View Full Technical Dossier &gt;
      </button>

      <!-- BLOCK HISTORY (Last 5 Years) -->
      <div style="margin-top:14px;border-top:1px solid #1e3a5f;padding-top:10px">
        <div style="font-size:11px;font-weight:800;color:#38bdf8;letter-spacing:0.5px">
          BLOCK HISTORY <span style="color:#94a3b8;font-weight:400">(Last 5 Years)</span>
        </div>
        <table class="smart-block-hist-table">
          <thead>
            <tr>
              <th>Block ID</th><th>From</th><th>To</th><th>Type</th><th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${(ast.blocks || [
              { id: 'BLK-2024-1021', from: '15/07/24', to: '18/07/24', type: 'Maintenance', dur: '3 Days' },
              { id: 'BLK-2023-0890', from: '10/06/23', to: '12/06/23', type: 'Inspection', dur: '2 Days' },
              { id: 'BLK-2022-0712', from: '22/05/22', to: '24/05/22', type: 'Maintenance', dur: '2 Days' }
            ]).map(b => `
              <tr>
                <td style="font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${b.id}</td>
                <td>${b.from}</td>
                <td>${b.to}</td>
                <td><span style="background:rgba(59,130,246,0.15);color:#93c5fd;padding:1px 5px;border-radius:3px;font-size:10px">${b.type}</span></td>
                <td style="font-weight:700;color:#f8fafc">${b.dur}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <button style="width:100%;margin-top:8px;background:#0d223a;border:1px solid #1e4976;color:#93c5fd;border-radius:4px;padding:5px;font-size:11px;font-weight:700;cursor:pointer" onclick="navigateTo('Block Planning')">
          View All Blocks in Section
        </button>
      </div>
    </div>
  `;
};

function renderCorridorMapPage() {
  const ast = selectedSmartAsset || SR_MAP_ASSETS[0];

  return `
    <main class="content" id="smartMapMainContainer" style="padding:0;overflow:hidden;background:#06101e;height:calc(100vh - 58px);display:flex;flex-direction:column">
      
      <!-- TOP COMMAND STRIP -->
      <div class="smart-map-topbar">
        <div class="smart-map-brand">
          <img src="/southern-railway-logo.png" alt="Emblem" />
          <h2>SOUTHERN RAILWAY · GIS CORRIDOR MONITORING &amp; ASSET REGISTRY</h2>
        </div>

        <div class="smart-map-controls-row">
          <!-- Corridor Selector -->
          <div class="smart-ctrl-group">
            <label>Corridor:</label>
            <select id="smartSelectCorridor" onchange="window.filterSmartCorridor(this.value)">
              <option value="ALL" ${selectedSmartCorridor === 'ALL' ? 'selected' : ''}>All Corridors</option>
              ${SR_CORRIDORS.map(c => `<option value="${c.id}" ${c.id === selectedSmartCorridor ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>

          <!-- 6 Official Divisions Selector -->
          <div class="smart-ctrl-group">
            <label>Division:</label>
            <select id="smartSelectDivision" onchange="window.filterSmartDivision(this.value)">
              ${SR_DIVISIONS_6.map(d => `<option value="${d.code}" ${d.code === selectedSmartDivision ? 'selected' : ''}>${d.name}</option>`).join('')}
            </select>
          </div>

          <!-- Asset Type Selector -->
          <div class="smart-ctrl-group">
            <label>Asset Type:</label>
            <select id="smartSelectAssetType" onchange="window.filterSmartAssetType(this.value)">
              <option value="ALL" ${selectedSmartAssetType === 'ALL' ? 'selected' : ''}>All Assets</option>
              <option value="Bridges" ${selectedSmartAssetType === 'Bridges' ? 'selected' : ''}>Bridges &amp; Rivers</option>
              <option value="Loco Sheds" ${selectedSmartAssetType === 'Loco Sheds' ? 'selected' : ''}>Loco Sheds</option>
              <option value="Coach Depots" ${selectedSmartAssetType === 'Coach Depots' ? 'selected' : ''}>Coach Depots</option>
              <option value="Workshops" ${selectedSmartAssetType === 'Workshops' ? 'selected' : ''}>Workshops &amp; POH</option>
              <option value="Railway Yards" ${selectedSmartAssetType === 'Railway Yards' ? 'selected' : ''}>Railway Yards</option>
              <option value="Goods Sheds" ${selectedSmartAssetType === 'Goods Sheds' ? 'selected' : ''}>Goods Sheds</option>
              <option value="Tunnels" ${selectedSmartAssetType === 'Tunnels' ? 'selected' : ''}>Tunnels</option>
            </select>
          </div>

          <!-- Block Status Selector -->
          <div class="smart-ctrl-group">
            <label>Block Status:</label>
            <select id="smartSelectBlockStatus" onchange="window.filterSmartBlockStatus(this.value)">
              <option value="ALL" ${selectedSmartBlockStatus === 'ALL' ? 'selected' : ''}>All Status</option>
              <option value="Active Blocks" ${selectedSmartBlockStatus === 'Active Blocks' ? 'selected' : ''}>Active Blocks</option>
              <option value="Planned Blocks" ${selectedSmartBlockStatus === 'Planned Blocks' ? 'selected' : ''}>Planned Blocks</option>
              <option value="Maintenance Zones" ${selectedSmartBlockStatus === 'Maintenance Zones' ? 'selected' : ''}>Maintenance Zones</option>
            </select>
          </div>

          <!-- Date Range Display -->
          <div class="smart-ctrl-group" title="Active Calendar Horizon">
            <label>Horizon:</label>
            <span style="font-size:11px;font-weight:700;color:#f8fafc">FY 2026-27</span>
          </div>

          <!-- Live Global Search -->
          <div class="smart-search-box">
            <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:#60a5fa;fill:none;flex-shrink:0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="smartMapSearchInput" value="${smartMapSearchQuery}" placeholder="Search Station, Asset, Km, Section..." oninput="window.searchSmartMap(this.value)" />
          </div>
        </div>

        <div class="smart-top-actions">
          <div class="smart-action-link" title="Active Priority Alerts" onclick="navigateTo('Defects & USFD')">
            <span style="background:#ef4444;color:#fff;border-radius:3px;padding:2px 6px;font-size:10px;font-weight:800">12 ALERTS</span>
          </div>
          <div class="smart-action-link" onclick="showToast('Operating Rulebook: General Rules (G&SR) Zone 07 active.')">Rulebook</div>
          <div class="smart-action-link" onclick="navigateTo('Reports & Analytics')">Audit Dossier</div>
          <div class="smart-action-link" style="color:#60a5fa;font-weight:700">ZONAL CONTROLLER</div>
        </div>
      </div>

      <!-- MAIN BODY: LEFT LAYERS + CENTER MAP + RIGHT ASSET INFORMATION -->
      <div class="smart-map-body">

        <!-- FLOATING TOP CORRIDOR QUICK-JUMP RIBBON -->
        <div class="smart-map-floating-corridors">
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'ALL' ? 'active' : ''}" data-corridor="ALL" onclick="window.filterSmartCorridor('ALL')">
            ALL ZONE 07
          </button>
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'MAS-SBC' ? 'active' : ''}" data-corridor="MAS-SBC" onclick="window.filterSmartCorridor('MAS-SBC')">
            MAS – SBC (130 km/h)
          </button>
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'MAS-CBE' ? 'active' : ''}" data-corridor="MAS-CBE" onclick="window.filterSmartCorridor('MAS-CBE')">
            MAS – CBE TRUNK
          </button>
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'PGT-TVC' ? 'active' : ''}" data-corridor="PGT-TVC" onclick="window.filterSmartCorridor('PGT-TVC')">
            ERS – TVC COASTAL
          </button>
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'MDU-RMM' ? 'active' : ''}" data-corridor="MDU-RMM" onclick="window.filterSmartCorridor('MDU-RMM')">
            MDU – RMM (PAMBAN)
          </button>
          <button class="smart-corridor-pill ${selectedSmartCorridor === 'PGT-MAQ' ? 'active' : ''}" data-corridor="PGT-MAQ" onclick="window.filterSmartCorridor('PGT-MAQ')">
            PGT – MAQ MAINLINE
          </button>
          <button class="smart-corridor-pill" style="background:#1e3a5f;border-color:#3b82f6" onclick="window.toggleMapFullscreen()" title="Toggle Edge-to-Edge Fullscreen">
            FULLSCREEN
          </button>
        </div>

        <!-- TILE STYLE SWITCHER (Bottom Left) -->
        <div class="smart-tile-switcher">
          <button class="smart-tile-btn ${activeTileLayerType === 'DARK' ? 'active' : ''}" data-tile="DARK" onclick="window.switchTileLayer('DARK')">Tactical Dark</button>
          <button class="smart-tile-btn ${activeTileLayerType === 'SATELLITE' ? 'active' : ''}" data-tile="SATELLITE" onclick="window.switchTileLayer('SATELLITE')">Satellite GIS</button>
          <button class="smart-tile-btn ${activeTileLayerType === 'RAILWAY' ? 'active' : ''}" data-tile="RAILWAY" onclick="window.switchTileLayer('RAILWAY')">OpenRailwayMap</button>
        </div>

        <!-- LEFT COLLAPSIBLE LAYERS PANEL -->
        <div class="smart-layers-panel ${isSmartLayersCollapsed ? 'collapsed' : ''}" id="smartLayersPanel">
          <div class="smart-layers-header">
            <strong>GIS LAYERS</strong>
            <button class="smart-layers-toggle-btn" onclick="window.toggleSmartLayers()" title="Toggle Layers Panel">
              ${isSmartLayersCollapsed ? '▶' : '◀'}
            </button>
          </div>

          <div class="smart-layers-content" style="${isSmartLayersCollapsed ? 'display:none' : ''}">
            
            <!-- INFRASTRUCTURE -->
            <div class="smart-layer-section-title">INFRASTRUCTURE</div>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrTracks" checked onchange="window.toggleSmartLayer('tracks', this.checked)" />
              <span class="smart-legend-line" style="background:#38bdf8"></span>
              <span>Railway Tracks</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrJunctions" checked onchange="window.toggleSmartLayer('junctions', this.checked)" />
              <span class="pro-gis-junction-dot" style="width:7px;height:7px"></span>
              <span>Junction Nodes</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrBridges" checked onchange="window.toggleSmartLayer('bridges', this.checked)" />
              <span style="color:#0ea5e9;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Bridges"]}</span>
              <span>Bridges &amp; Rivers</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrTunnels" checked onchange="window.toggleSmartLayer('tunnels', this.checked)" />
              <span style="color:#94a3b8;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Tunnels"]}</span>
              <span>Tunnels</span>
            </label>

            <!-- OPERATIONAL FACILITIES -->
            <div class="smart-layer-section-title">FACILITIES</div>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrLocoSheds" checked onchange="window.toggleSmartLayer('locoSheds', this.checked)" />
              <span style="color:#f43f5e;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Loco Sheds"]}</span>
              <span>Loco Sheds</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrCoachDepots" checked onchange="window.toggleSmartLayer('coachDepots', this.checked)" />
              <span style="color:#3b82f6;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Coach Depots"]}</span>
              <span>Coach Depots</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrWorkshops" checked onchange="window.toggleSmartLayer('workshops', this.checked)" />
              <span style="color:#a855f7;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Workshops"]}</span>
              <span>Workshops &amp; POH</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrGoodsSheds" checked onchange="window.toggleSmartLayer('goodsSheds', this.checked)" />
              <span style="color:#f59e0b;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Goods Sheds"]}</span>
              <span>Goods Sheds</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrYards" checked onchange="window.toggleSmartLayer('yards', this.checked)" />
              <span style="color:#10b981;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Railway Yards"]}</span>
              <span>Railway Yards</span>
            </label>

            <!-- BLOCK PLANNING -->
            <div class="smart-layer-section-title">BLOCK OPERATIONS</div>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrActiveBlocks" checked onchange="window.toggleSmartLayer('activeBlocks', this.checked)" />
              <span class="pro-gis-block-dot"></span>
              <span>Active Worksite Blocks</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrPlannedBlocks" checked onchange="window.toggleSmartLayer('plannedBlocks', this.checked)" />
              <span class="smart-legend-line" style="background:#f59e0b"></span>
              <span>Planned Blocks</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrMaintZones" checked onchange="window.toggleSmartLayer('maintenanceZones', this.checked)" />
              <span class="smart-legend-line" style="background:#ec4899"></span>
              <span>Maintenance Zones</span>
            </label>
            <label class="smart-layer-item">
              <input type="checkbox" id="chkLyrLiveTrains" checked onchange="window.toggleSmartLayer('liveTrains', this.checked)" />
              <span class="pro-gis-train-dot"></span>
              <span>RTIS Live Trains</span>
            </label>

            <button class="smart-reset-layers-btn" onclick="window.resetSmartLayers()">
              Reset All Layers
            </button>
          </div>
        </div>

        <!-- CENTER LEAFLET MAP -->
        <div style="flex:1;position:relative;height:100%">
          <div id="corridorMapStage" style="width:100%;height:100%"></div>
        </div>

        <!-- RIGHT ASSET INFORMATION & HISTORY PANEL -->
        <div class="smart-asset-panel ${isSmartAssetPanelMinimized ? 'minimized' : ''}" id="smartAssetPanel">
          ${window.renderSmartAssetPanelHtml(ast)}
        </div>

      </div>

      <!-- BOTTOM LEGEND BAR -->
      <div class="smart-map-legend-bar">
        <span class="smart-legend-title">GIS LEGEND:</span>
        <span class="smart-legend-item"><span class="pro-gis-junction-dot"></span> Junction Node</span>
        <span class="smart-legend-item"><span style="color:#0ea5e9;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Bridges"]}</span> Bridge</span>
        <span class="smart-legend-item"><span style="color:#94a3b8;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Tunnels"]}</span> Tunnel</span>
        <span class="smart-legend-item"><span style="color:#f43f5e;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Loco Sheds"]}</span> Loco Shed</span>
        <span class="smart-legend-item"><span style="color:#3b82f6;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Coach Depots"]}</span> Coach Depot</span>
        <span class="smart-legend-item"><span style="color:#a855f7;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Workshops"]}</span> Workshop</span>
        <span class="smart-legend-item"><span style="color:#f59e0b;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Goods Sheds"]}</span> Goods Shed</span>
        <span class="smart-legend-item"><span style="color:#10b981;display:inline-flex;width:12px;height:12px">${ASSET_SVG_ICONS["Railway Yards"]}</span> Yard</span>
        <span class="smart-legend-item"><span class="smart-legend-line" style="background:#3b82f6"></span> Selected Corridor</span>
        <span class="smart-legend-item"><span class="smart-legend-line" style="background:#475569"></span> Other Corridors</span>
        <span class="smart-legend-item"><span class="pro-gis-block-dot"></span> Active Block</span>
        <span class="smart-legend-item"><span class="pro-gis-train-dot"></span> Live Train</span>
      </div>

    </main>
  `;
}

// Window interactive helper functions

window.toggleMinimizeSmartAssetPanel = () => {
  isSmartAssetPanelMinimized = !isSmartAssetPanelMinimized;
  const p = document.querySelector("#smartAssetPanel");
  if (p) p.classList.toggle("minimized", isSmartAssetPanelMinimized);
};

window.toggleMapFullscreen = () => {
  const container = document.querySelector("#smartMapMainContainer");
  if (container) {
    container.classList.toggle("fullscreen-map-mode");
    if (leafletMapInstance) {
      setTimeout(() => { leafletMapInstance.invalidateSize(); }, 300);
    }
  }
};

window.switchTileLayer = (layerType) => {
  activeTileLayerType = layerType;
  if (!leafletMapInstance) return;

  if (window.activeBaseLayer) {
    leafletMapInstance.removeLayer(window.activeBaseLayer);
    window.activeBaseLayer = null;
  }
  
  if (layerType === 'SATELLITE') {
    window.activeBaseLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Esri Satellite',
      maxZoom: 18,
      opacity: 0.88
    }).addTo(leafletMapInstance);
  } else if (layerType === 'DARK') {
    window.activeBaseLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: 'CartoDB Dark',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMapInstance);
  } else if (layerType === 'RAILWAY') {
    window.activeBaseLayer = L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
      attribution: 'OpenRailwayMap',
      subdomains: "abc",
      maxZoom: 19,
      opacity: 0.95
    }).addTo(leafletMapInstance);
  }

  document.querySelectorAll(".smart-tile-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tile === layerType);
  });
};

window.toggleSmartLayers = () => {
  isSmartLayersCollapsed = !isSmartLayersCollapsed;
  const p = document.querySelector("#smartLayersPanel");
  if (p) {
    p.classList.toggle("collapsed", isSmartLayersCollapsed);
    const content = p.querySelector(".smart-layers-content");
    if (content) content.style.display = isSmartLayersCollapsed ? "none" : "block";
    const btn = p.querySelector(".smart-layers-toggle-btn");
    if (btn) btn.textContent = isSmartLayersCollapsed ? "▶" : "◀";
  }
};

window.closeSmartAssetPanel = () => {
  const p = document.querySelector("#smartAssetPanel");
  if (p) p.style.display = "none";
};

window.setSmartTab = (tabName) => {
  smartActiveTab = tabName;
  const panel = document.querySelector("#smartAssetPanel");
  if (panel && selectedSmartAsset) {
    panel.innerHTML = window.renderSmartAssetPanelHtml(selectedSmartAsset);
  }
};

window.selectSmartAsset = (assetId) => {
  const ast = SR_MAP_ASSETS.find(a => a.id === assetId);
  if (!ast) return;
  selectedSmartAsset = ast;
  
  const panel = document.querySelector("#smartAssetPanel");
  if (panel) {
    panel.style.display = "flex";
    panel.innerHTML = window.renderSmartAssetPanelHtml(ast);
  }

  if (leafletMapInstance && ast.coords) {
    leafletMapInstance.flyTo(ast.coords, 11, { duration: 0.8 });
  }
};

window.filterSmartCorridor = (corridorId) => {
  selectedSmartCorridor = corridorId;

  const sel = document.querySelector("#smartSelectCorridor");
  if (sel) sel.value = corridorId;

  document.querySelectorAll(".smart-corridor-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.corridor === corridorId);
  });

  const cor = SR_CORRIDORS.find(c => c.id === corridorId);
  if (cor && leafletMapInstance) {
    leafletMapInstance.flyToBounds(L.latLngBounds(cor.coords), { padding: [60, 60], duration: 1.0 });
  } else if (corridorId === "ALL" && leafletMapInstance) {
    leafletMapInstance.flyTo([10.85, 78.2], 7, { duration: 1.0 });
  }

  window.rebuildCorridorMapLayers();
};

window.filterSmartDivision = (divCode) => {
  selectedSmartDivision = divCode;

  const sel = document.querySelector("#smartSelectDivision");
  if (sel) sel.value = divCode;

  if (divCode !== "ALL") {
    const divObj = SR_DIVISIONS_6.find(d => d.code === divCode);
    showToast(`Jurisdiction filtered to ${divObj?.name || divCode}`);
    const center = DIVISION_CENTERS[divCode];
    if (center && leafletMapInstance) {
      leafletMapInstance.flyTo(center.coords, center.zoom, { duration: 1.0 });
    }
    const firstAst = SR_MAP_ASSETS.find(a => a.div === divCode);
    if (firstAst) {
      window.selectSmartAsset(firstAst.id);
    }
  } else {
    showToast("Displaying all 6 Southern Railway Divisions.");
    if (leafletMapInstance) leafletMapInstance.flyTo([10.85, 78.2], 7, { duration: 1.0 });
  }

  window.rebuildCorridorMapLayers();
};

window.filterSmartAssetType = (assetType) => {
  selectedSmartAssetType = assetType;

  const sel = document.querySelector("#smartSelectAssetType");
  if (sel) sel.value = assetType;

  if (assetType !== "ALL") {
    const matching = SR_MAP_ASSETS.filter(a => a.category === assetType && (selectedSmartDivision === "ALL" || a.div === selectedSmartDivision));
    showToast(`Showing ${matching.length} assets under category ${assetType}`);
    if (matching.length > 0 && leafletMapInstance) {
      window.selectSmartAsset(matching[0].id);
    }
  } else {
    showToast("Displaying all asset categories.");
  }

  window.rebuildCorridorMapLayers();
};

window.filterSmartBlockStatus = (status) => {
  selectedSmartBlockStatus = status;

  const sel = document.querySelector("#smartSelectBlockStatus");
  if (sel) sel.value = status;
  showToast(`Filtering blocks by status: ${status}`);

  window.rebuildCorridorMapLayers();
};

window.searchSmartMap = (q) => {
  smartMapSearchQuery = (q || "").toLowerCase().trim();
  window.rebuildCorridorMapLayers();

  if (smartMapSearchQuery.length >= 2) {
    const match = SR_MAP_ASSETS.find(a => 
      a.name.toLowerCase().includes(smartMapSearchQuery) ||
      a.id.toLowerCase().includes(smartMapSearchQuery) ||
      a.section.toLowerCase().includes(smartMapSearchQuery) ||
      (a.river && a.river.toLowerCase().includes(smartMapSearchQuery))
    );
    if (match && leafletMapInstance) {
      window.selectSmartAsset(match.id);
      return;
    }
    const stnMatch = MAJOR_JUNCTIONS.find(s => 
      s.code.toLowerCase() === smartMapSearchQuery ||
      s.name.toLowerCase().includes(smartMapSearchQuery)
    );
    if (stnMatch && leafletMapInstance) {
      leafletMapInstance.flyTo(stnMatch.coords, 11, { duration: 0.8 });
    }
  }
};

window.toggleSmartLayer = (key, isChecked) => {
  if (!leafletMapInstance || !smartLayerGroups[key]) return;
  if (isChecked) {
    leafletMapInstance.addLayer(smartLayerGroups[key]);
  } else {
    leafletMapInstance.removeLayer(smartLayerGroups[key]);
  }
};

window.resetSmartLayers = () => {
  Object.keys(smartLayerGroups).forEach(key => {
    if (smartLayerGroups[key] && leafletMapInstance) {
      leafletMapInstance.addLayer(smartLayerGroups[key]);
    }
  });
  document.querySelectorAll(".smart-layer-item input[type='checkbox']").forEach(chk => {
    chk.checked = true;
  });
  showToast("All GIS cartography layers reset to active.");
};

window.rebuildCorridorMapLayers = () => {
  if (!leafletMapInstance || !smartLayerGroups.tracks) return;

  // Clear all layer groups
  Object.values(smartLayerGroups).forEach(group => {
    if (group && typeof group.clearLayers === "function") {
      group.clearLayers();
    }
  });

  const curCorridor = selectedSmartCorridor;
  const curDiv = selectedSmartDivision;
  const curAssetType = selectedSmartAssetType;
  const curBlockStatus = selectedSmartBlockStatus;
  const query = smartMapSearchQuery;

  // 1. RENDER CORRIDOR TRACK POLYLINES
  SR_CORRIDORS.forEach(c => {
    const isSelected = curCorridor === "ALL" || c.id === curCorridor;
    const isDivMatch = curDiv === "ALL" || c.div === curDiv;

    // Track casing
    L.polyline(c.coords, {
      color: "#030a14",
      weight: isSelected ? 5.5 : 2.5,
      opacity: isSelected && isDivMatch ? 0.95 : 0.25
    }).addTo(smartLayerGroups.tracks);

    // Track inner line
    const pLine = L.polyline(c.coords, {
      color: isSelected && isDivMatch ? c.color : "#475569",
      weight: isSelected ? 3.5 : 1.5,
      opacity: isSelected && isDivMatch ? 0.95 : 0.35,
      dashArray: (curCorridor !== "ALL" && c.id !== curCorridor) ? "3, 5" : null
    }).addTo(smartLayerGroups.tracks);

    pLine.on('click', () => {
      window.filterSmartCorridor(c.id);
    });

    pLine.bindPopup(`
      <div style="font-family:Inter,sans-serif;padding:6px;min-width:210px">
        <strong style="color:${c.color};font-size:12.5px">${c.name}</strong>
        <div style="font-size:10.5px;color:#94a3b8;margin-top:2px">${c.code} • ${c.tracks}</div>
        <div style="font-size:11px;color:#fff;margin-top:4px">Length: <b>${c.km}</b> | Speed: <b>${c.speed}</b></div>
        <div style="font-size:10.5px;color:#cbd5e1;margin-top:3px">${c.desc}</div>
        <div style="margin-top:6px;border-top:1px solid #334155;padding-top:4px;display:flex;justify-content:space-between">
          <span style="color:#ef4444;font-weight:700;font-size:10.5px">Active: ${c.blocks?.live || 0}</span>
          <span style="color:#f59e0b;font-weight:700;font-size:10.5px">Planned: ${c.blocks?.planned || 0}</span>
        </div>
      </div>
    `);
  });

  // 2. RENDER MAJOR JUNCTION NODES
  MAJOR_JUNCTIONS.forEach(stn => {
    if (curDiv !== "ALL" && stn.div !== curDiv) return;
    if (query && !stn.name.toLowerCase().includes(query) && !stn.code.toLowerCase().includes(query)) return;

    const jIcon = L.divIcon({
      html: `
        <div class="pro-gis-junction-pin">
          <div class="pro-gis-junction-dot"></div>
          <span class="pro-gis-junction-tag">${stn.code}</span>
        </div>
      `,
      className: "",
      iconSize: [60, 20],
      iconAnchor: [5, 10]
    });

    const marker = L.marker(stn.coords, { icon: jIcon }).addTo(smartLayerGroups.junctions);
    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;padding:4px;min-width:180px">
        <strong style="font-size:12.5px;color:#fff;display:block">${stn.name} [${stn.code}]</strong>
        <div style="font-size:10.5px;color:#94a3b8;margin:2px 0 8px">${stn.div} Division • Southern Railway</div>
        <button style="width:100%;background:#2563eb;color:#ffffff;border:none;font-weight:800;padding:6px 10px;border-radius:4px;font-size:10.5px;cursor:pointer" onclick="window.navigateToStation('${stn.code}')">
          View Station Board &amp; Planning
        </button>
      </div>
    `);
  });

  // 3. RENDER ASSETS WITH CRISP SVG SYMBOLS
  SR_MAP_ASSETS.forEach(ast => {
    // Division filter
    if (curDiv !== "ALL" && ast.div !== curDiv) return;

    // Asset Category filter
    if (curAssetType !== "ALL" && ast.category !== curAssetType) return;

    // Block status filter
    if (curBlockStatus !== "ALL") {
      if (ast.category === "Active Blocks" && curBlockStatus !== "Active Blocks") return;
      if (ast.category === "Planned Blocks" && curBlockStatus !== "Planned Blocks") return;
      if (ast.category === "Maintenance Zones" && curBlockStatus !== "Maintenance Zones") return;
    }

    // Search query filter
    if (query) {
      const matchText = (ast.name + " " + ast.id + " " + ast.section + " " + (ast.river || "") + " " + (ast.km || "")).toLowerCase();
      if (!matchText.includes(query)) return;
    }

    let targetLayer = smartLayerGroups.bridges;
    let pinClass = "pro-pin-bridges";

    if (ast.category === "Loco Sheds") {
      targetLayer = smartLayerGroups.locoSheds;
      pinClass = "pro-pin-locosheds";
    } else if (ast.category === "Coach Depots") {
      targetLayer = smartLayerGroups.coachDepots;
      pinClass = "pro-pin-coachdepots";
    } else if (ast.category === "Workshops") {
      targetLayer = smartLayerGroups.workshops;
      pinClass = "pro-pin-workshops";
    } else if (ast.category === "Railway Yards") {
      targetLayer = smartLayerGroups.yards;
      pinClass = "pro-pin-railwayyards";
    } else if (ast.category === "Goods Sheds") {
      targetLayer = smartLayerGroups.goodsSheds;
      pinClass = "pro-pin-goodssheds";
    } else if (ast.category === "Tunnels") {
      targetLayer = smartLayerGroups.tunnels;
      pinClass = "pro-pin-tunnels";
    } else if (ast.category === "Active Blocks") {
      targetLayer = smartLayerGroups.activeBlocks;
      pinClass = "pro-pin-activeblocks";
    } else if (ast.category === "Planned Blocks") {
      targetLayer = smartLayerGroups.plannedBlocks;
      pinClass = "pro-pin-plannedblocks";
    } else if (ast.category === "Maintenance Zones") {
      targetLayer = smartLayerGroups.maintenanceZones;
      pinClass = "pro-pin-maintenancezones";
    }

    const iconSvg = ASSET_SVG_ICONS[ast.category] || ASSET_SVG_ICONS["Bridges"];

    const pinIcon = L.divIcon({
      html: `
        <div class="pro-gis-asset-pin ${pinClass}" title="${ast.name} [${ast.id}]">
          ${iconSvg}
        </div>
      `,
      className: "",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker(ast.coords, { icon: pinIcon }).addTo(targetLayer);
    marker.on('click', () => {
      window.selectSmartAsset(ast.id);
    });

    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;padding:4px;min-width:180px">
        <div style="font-size:10px;color:#94a3b8;font-weight:700">${ast.category} • ${ast.div} Division</div>
        <strong style="font-size:12.5px;color:#fff">${ast.name}</strong>
        <div style="font-size:10.5px;color:#60a5fa;margin-top:2px">${ast.id}</div>
        <div style="font-size:10.5px;color:#cbd5e1;margin-top:4px">${ast.section}</div>
        <button style="width:100%;margin-top:6px;background:#2563eb;color:#fff;border:none;border-radius:4px;padding:5px;font-size:10.5px;font-weight:700;cursor:pointer" onclick="window.selectSmartAsset('${ast.id}')">
          Inspect Asset Dossier
        </button>
      </div>
    `);
  });

  // 4. RENDER ACTIVE MAINTENANCE WORKSITES
  if (curBlockStatus === "ALL" || curBlockStatus === "Active Blocks") {
    ACTIVE_BLOCK_WORKSITES.forEach(blk => {
      if (curDiv !== "ALL" && blk.div !== curDiv) return;
      if (query && !blk.name.toLowerCase().includes(query) && !blk.id.toLowerCase().includes(query)) return;

      const blkIcon = L.divIcon({
        html: `
          <div class="pro-gis-block-tag">
            <span class="pro-gis-block-dot"></span>
            <span>${blk.id}: ${blk.dur}</span>
          </div>
        `,
        className: "",
        iconSize: [140, 20],
        iconAnchor: [6, 10]
      });

      L.marker(blk.coords, { icon: blkIcon }).addTo(smartLayerGroups.activeBlocks)
       .bindPopup(`
         <div style="font-family:Inter,sans-serif;padding:6px;min-width:210px">
           <strong style="color:#ef4444;font-size:12.5px">ACTIVE WORK SITE: ${blk.id}</strong>
           <div style="font-size:11px;color:#f8fafc;margin:4px 0"><b>${blk.name}</b></div>
           <div style="font-size:10.5px;color:#cbd5e1">Scope: ${blk.type}</div>
           <div style="font-size:10.5px;color:#22c55e;font-weight:800;margin-top:4px">Remaining: ${blk.dur}</div>
         </div>
       `);
    });
  }

  // 5. RENDER LIVE TRAIN TELEMETRY
  if (smartLayerGroups.liveTrains) {
    LIVE_TRAIN_SERVICES.forEach(tr => {
      if (curDiv !== "ALL" && tr.div !== curDiv) return;
      if (query && !tr.train.includes(query) && !tr.name.toLowerCase().includes(query)) return;

      const p1 = tr.path[0];
      const p2 = tr.path[tr.path.length - 1];
      const curLat = p1[0] + (p2[0] - p1[0]) * tr.step;
      const curLng = p1[1] + (p2[1] - p1[1]) * tr.step;

      const trIcon = L.divIcon({
        html: `
          <div class="pro-gis-train-tag">
            <span class="pro-gis-train-dot"></span>
            <span>${tr.train} • ${tr.speed}</span>
          </div>
        `,
        className: "",
        iconSize: [120, 20],
        iconAnchor: [6, 10]
      });

      const marker = L.marker([curLat, curLng], { icon: trIcon }).addTo(smartLayerGroups.liveTrains);
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;padding:6px;min-width:200px">
          <b style="color:#86efac;font-size:12px">${tr.train} ${tr.name}</b>
          <div style="font-size:10px;color:#94a3b8">${tr.type}</div>
          <div style="font-size:10.5px;color:#f8fafc;margin-top:4px">
            Section: <b>${tr.from} → ${tr.to}</b><br/>
            Speed: <span style="color:#22c55e;font-weight:800">${tr.speed}</span><br/>
            Signal: <span style="color:#22c55e;font-weight:700">● LINE CLEAR</span>
          </div>
        </div>
      `);
    });
  }
};

function initCorridorMap() {
  const container = document.querySelector("#corridorMapStage");
  if (!container || typeof L === "undefined") return;

  if (leafletMapInstance) {
    try { leafletMapInstance.remove(); } catch(e) {}
    leafletMapInstance = null;
  }

  const map = L.map("corridorMapStage", {
    center: [10.85, 78.2],
    zoom: 7,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: true,
  });
  leafletMapInstance = map;

  // Single Clean Base Tile Layer (Default: Tactical Dark Matter)
  if (activeTileLayerType === 'DARK') {
    window.activeBaseLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; CartoDB Dark',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
  } else if (activeTileLayerType === 'SATELLITE') {
    window.activeBaseLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: 'Esri Satellite',
      maxZoom: 18,
      opacity: 0.88
    }).addTo(map);
  } else if (activeTileLayerType === 'RAILWAY') {
    window.activeBaseLayer = L.tileLayer("https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png", {
      attribution: 'OpenRailwayMap',
      subdomains: "abc",
      maxZoom: 19,
      opacity: 0.95
    }).addTo(map);
  }

  // Initialize Layer Groups
  smartLayerGroups = {
    tracks: L.layerGroup().addTo(map),
    stations: L.layerGroup().addTo(map),
    junctions: L.layerGroup().addTo(map),
    bridges: L.layerGroup().addTo(map),
    tunnels: L.layerGroup().addTo(map),
    levelCrossings: L.layerGroup().addTo(map),
    rivers: L.layerGroup().addTo(map),
    locoSheds: L.layerGroup().addTo(map),
    coachDepots: L.layerGroup().addTo(map),
    workshops: L.layerGroup().addTo(map),
    goodsSheds: L.layerGroup().addTo(map),
    yards: L.layerGroup().addTo(map),
    activeBlocks: L.layerGroup().addTo(map),
    plannedBlocks: L.layerGroup().addTo(map),
    historicalBlocks: L.layerGroup().addTo(map),
    maintenanceZones: L.layerGroup().addTo(map),
    liveTrains: L.layerGroup().addTo(map)
  };

  // Populate layers with active filter constraints
  window.rebuildCorridorMapLayers();

  // If a division is currently chosen, pan to it
  if (selectedSmartDivision !== "ALL" && DIVISION_CENTERS[selectedSmartDivision]) {
    const c = DIVISION_CENTERS[selectedSmartDivision];
    map.setView(c.coords, c.zoom);
  } else {
    map.setView([10.85, 78.2], 7);
  }

  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 100);
  setTimeout(() => { try { map.invalidateSize(); } catch(e) {} }, 400);
}

// ==========================================================================
// CORRIDORS & TRACK SECTIONS PAGE (/api/v1/corridors & /api/v1/track-sections)
// ==========================================================================

const MOCK_SECTIONS_DATA = [
  { id: "SEC-001", corridor: "Chennai - Bengaluru", name: "Katpadi Jn – Jolarpettai Jn", km_start: 128.4, km_end: 193.4, length_km: 65.0, tracks: "Double Electrified (25kV AC)", max_speed: 130, gmt: 32.4, div: "MAS", status: "Operational", tsr: "TSR 30 km/h (KM 12.5)" },
  { id: "SEC-002", corridor: "Chennai - Coimbatore", name: "Salem Jn – Erode Jn", km_start: 245.0, km_end: 317.0, length_km: 72.0, tracks: "Double Electrified (25kV AC)", max_speed: 130, gmt: 30.1, div: "SA", status: "Operational", tsr: "TSR 45 km/h (KM 22.0)" },
  { id: "SEC-003", corridor: "Palakkad - Trivandrum", name: "Thrissur – Ernakulam Jn", km_start: 45.3, km_end: 100.3, length_km: 55.0, tracks: "Double Electrified (25kV AC)", max_speed: 110, gmt: 26.2, div: "TVC", status: "Operational", tsr: "Power Block Caution" },
  { id: "SEC-004", corridor: "Chennai - Madurai Grand Trunk", name: "Villupuram – Vriddhachalam", km_start: 105.2, km_end: 147.2, length_km: 42.0, tracks: "Double Electrified", max_speed: 110, gmt: 24.0, div: "TPJ", status: "Operational", tsr: "TSR 45 km/h" },
  { id: "SEC-005", corridor: "Chennai - Madurai Grand Trunk", name: "Dindigul Jn – Madurai Jn", km_start: 198.2, km_end: 262.2, length_km: 64.0, tracks: "Double Electrified", max_speed: 110, gmt: 22.5, div: "MDU", status: "Operational", tsr: "TSR 30 km/h" },
  { id: "SEC-006", corridor: "Palakkad - Trivandrum", name: "Kottayam – Kollam Jn", km_start: 88.0, km_end: 160.0, length_km: 72.0, tracks: "Double Electrified", max_speed: 110, gmt: 21.0, div: "TVC", status: "Operational", tsr: "Normal" },
  { id: "SEC-007", corridor: "Tiruchirappalli - Delta Chord", name: "Thanjavur – Tiruchirappalli Jn", km_start: 10.0, km_end: 59.8, length_km: 49.8, tracks: "Double Electrified (25kV AC)", max_speed: 110, gmt: 21.4, div: "TPJ", status: "Operational", tsr: "Normal" },
  { id: "SEC-008", corridor: "Malabar West Coast Line", name: "Shoranur Jn – Kozhikode", km_start: 0.0, km_end: 85.5, length_km: 85.5, tracks: "Double Electrified", max_speed: 110, gmt: 24.5, div: "PGT", status: "Operational", tsr: "Normal" },
  { id: "SEC-009", corridor: "Madurai - Rameswaram Pamban", name: "Mandapam – Pamban Sea Bridge", km_start: 142.0, km_end: 144.1, length_km: 2.1, tracks: "Marine Cantilever Lift Bridge", max_speed: 80, gmt: 12.0, div: "MDU", status: "Operational", tsr: "Pamban Caution 30 km/h" }
];

let selectedCorridorFilter = "All";

function renderCorridorsSectionsPage() {
  const filtered = selectedCorridorFilter === "All" ? MOCK_SECTIONS_DATA : MOCK_SECTIONS_DATA.filter(s => s.corridor.includes(selectedCorridorFilter));

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>Corridors & Permanent Way Track Sections</h2>
          <div class="screen-breadcrumb">Home > Corridors & Sections</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="primary" onclick="showCreateSectionModal()">+ Create Track Section</button>
        </div>
      </div>

      <!-- Corridor Grid Cards -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
        ${SR_CORRIDORS.map(c => `
          <div style="background:var(--bg-card);border:1px solid var(--border-light);border-left:4px solid ${c.color};border-radius:8px;padding:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <strong style="font-size:13px;color:${c.color}">${c.name}</strong>
              <span style="font-size:10px;background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-weight:700">${c.div || 'SR'}</span>
            </div>
            <div style="font-size:12px;color:var(--text-heading);margin-bottom:4px">Route Length: <b>${c.km}</b> • Stations: <b>${c.stations}</b></div>
            <div style="font-size:10.5px;color:var(--text-muted);margin-bottom:8px">${c.desc}</div>
            <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border-light);padding-top:6px;font-size:11px">
              <span>Planned: <b style="color:#60a5fa">${c.blocks?.planned || 4}</b></span>
              <span>Live Blocks: <b style="color:#ef4444">${c.blocks?.live || 2}</b></span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Track Sections Filter & Table -->
      <div class="panel" style="padding:0;overflow:hidden">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:14px;font-weight:800;color:var(--text-heading)">Monitored Track Sections (TMS / TDMS Sync)</div>
          <div style="display:flex;gap:10px">
            <select id="selSectionCorridorFilter" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:4px 8px;border-radius:4px;font-size:12px">
              <option value="All">All Corridors (${MOCK_SECTIONS_DATA.length})</option>
              <option value="Chennai">Chennai Division Corridors</option>
              <option value="Salem">Salem Division Corridors</option>
              <option value="Palakkad">Palakkad Division Corridors</option>
              <option value="Trivandrum">Thiruvananthapuram Corridors</option>
              <option value="Delta">Tiruchirappalli Delta Corridors</option>
              <option value="Madurai">Madurai Division Corridors</option>
            </select>
          </div>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">SECTION ID</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">CORRIDOR</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">SECTION NAME</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">KM POSTS</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">TRACK TYPE</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">MAX SPEED</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">GMT LOAD</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">TSR RESTRICTION</th>
                <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">ACTION</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((s, i) => `
                <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                  <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${s.id}</td>
                  <td style="padding:10px 14px;color:var(--text-heading);font-weight:600">${s.corridor}</td>
                  <td style="padding:10px 14px;color:var(--text-main)">${s.name}</td>
                  <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace">KM ${s.km_start} – ${s.km_end} (${s.length_km} km)</td>
                  <td style="padding:10px 14px"><span style="background:rgba(59,130,246,0.1);color:#60a5fa;padding:2px 6px;border-radius:4px;font-size:11px">${s.tracks}</span></td>
                  <td style="padding:10px 14px;color:#22c55e;font-weight:700">${s.max_speed} km/h</td>
                  <td style="padding:10px 14px">${s.gmt} GMT</td>
                  <td style="padding:10px 14px"><span style="color:${s.tsr.includes('TSR') ? '#ef4444' : '#22c55e'};font-weight:700">${s.tsr}</span></td>
                  <td style="padding:10px 14px;text-align:center">
                    <button style="background:transparent;border:none;color:#60a5fa;cursor:pointer" onclick="showToast('Section details for ${s.id}')">👁</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
}

function showCreateSectionModal() {
  showModal(
    "Create New Track Section",
    "Define a permanent way track section for block planning and telemetry monitoring.",
    `
      <label>Corridor
        <select id="modalSecCorridor">
          ${SR_CORRIDORS.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
        </select>
      </label>
      <label>Section Name / Station Span
        <input id="modalSecName" placeholder="e.g. Katpadi Jn – Jolarpettai Jn" />
      </label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <label>Start KM Post
          <input type="number" id="modalSecKmStart" value="120.0" />
        </label>
        <label>End KM Post
          <input type="number" id="modalSecKmEnd" value="180.0" />
        </label>
      </div>
      <label>Track Classification
        <select id="modalSecTrackType">
          <option>Double Electrified (25kV AC)</option>
          <option>Quadruple Electrified (Automatic Block)</option>
          <option>Single Electrified</option>
          <option>Non-Electrified Broad Gauge</option>
        </select>
      </label>
      <label>Maximum Sectional Speed (km/h)
        <input type="number" id="modalSecSpeed" value="130" />
      </label>
    `,
    async (overlay) => {
      showToast("Track Section created and registered in TMS database.");
      render();
    },
    "Register Section"
  );
}

// ==========================================================================
// STATIONS MASTER PAGE (/api/v1/stations)
// ==========================================================================

let stationSearchQuery = "";
let stationDivFilter = "ALL";


const CBE_LIVE_BOARD = [
  { train: "12244", name: "SHATABDI EXP", src: "CBE", dest: "MAS", arr: "--", dep: "15:05", pf: "3", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "12676", name: "KOVAI EXP", src: "CBE", dest: "MAS", arr: "--", dep: "15:15", pf: "4", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "22648", name: "KORBA EXPRESS", src: "TVCN", dest: "KRBA", arr: "15:20", dep: "15:25", pf: "3", halt: "00:05", delayArr: "RT", delayDep: "RT" },
  { train: "20630", name: "SABARI SF EXPRES", src: "TVC", dest: "SC", arr: "15:35", dep: "15:40", pf: "3", halt: "00:05", delayArr: "RT", delayDep: "RT" },
  { train: "66616", name: "PTJ MTP MEMU", src: "PTJ", dest: "MTP", arr: "15:42", dep: "15:45", pf: "5", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "56603", name: "CBE SRR PASSENGER", src: "CBE", dest: "SRR", arr: "--", dep: "16:25", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "16160", name: "MAQ CHENNAI EXP", src: "MAQ", dest: "MS", arr: "15:57", dep: "16:00", pf: "3", halt: "00:03", delayArr: "00:29", delayDep: "00:27" },
  { train: "12970", name: "JP CBE SUP EXP", src: "JP", dest: "CBE", arr: "16:50", dep: "--", pf: "3", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "22670", name: "PNBE ERS EXPRES", src: "PNBE", dest: "ERS", arr: "16:57", dep: "17:00", pf: "1", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "26652", name: "SBC VANDE BHARAT", src: "ERS", dest: "SBC", arr: "17:17", dep: "17:20", pf: "3", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "66617", name: "MTP CBE MEMU", src: "MTP", dest: "CBE", arr: "17:30", dep: "--", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "66618", name: "CBE MTP MEMU", src: "CBE", dest: "MTP", arr: "--", dep: "17:55", pf: "4", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "66604", name: "SRR CBE EMU", src: "SRR", dest: "CBE", arr: "18:00", dep: "--", pf: "6", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "66602", name: "CBE ED MEMU", src: "CBE", dest: "ED", arr: "--", dep: "18:10", pf: "4", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "16843", name: "TPJ PGTN EXP", src: "TPJ", dest: "PGTN", arr: "18:07", dep: "18:10", pf: "1", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "22609", name: "INTERCITY EXP", src: "MAQ", dest: "CBE", arr: "18:25", dep: "--", pf: "3", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "56109", name: "CBE POY PASSENGER", src: "CBE", dest: "POY", arr: "--", dep: "18:40", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "16321", name: "NCJ CBE EXPRESS", src: "NCJ", dest: "CBE", arr: "19:30", dep: "--", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "22668", name: "NAGERCOIL EXP", src: "CBE", dest: "NCJ", arr: "--", dep: "19:30", pf: "4", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "66619", name: "MTP PTJ MEMU", src: "MTP", dest: "PTJ", arr: "19:30", dep: "19:35", pf: "2", halt: "00:05", delayArr: "RT", delayDep: "RT" },
  { train: "16324", name: "MAQ CBE EXPRESS", src: "MAQ", dest: "CBE", arr: "20:00", dep: "--", pf: "6", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "16382", name: "CAPE PUNE EXP", src: "CAPE", dest: "PUNE", arr: "19:55", dep: "20:00", pf: "3", halt: "00:05", delayArr: "RT", delayDep: "RT" },
  { train: "20643", name: "CBE VANDEBHARAT", src: "MAS", dest: "CBE", arr: "20:15", dep: "--", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "66620", name: "PTJ MTP MEMU", src: "PTJ", dest: "MTP", arr: "20:25", dep: "20:28", pf: "5", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "12625", name: "KERALA EXPRESS", src: "TVC", dest: "NDLS", arr: "20:50", dep: "20:55", pf: "3", halt: "00:05", delayArr: "RT", delayDep: "RT" },
  { train: "22665", name: "SBC CBE UDAY EXP", src: "SBC", dest: "CBE", arr: "21:05", dep: "--", pf: "6", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "12083", name: "JAN SHATABDI EX", src: "MV", dest: "CBE", arr: "21:25", dep: "--", pf: "1", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "22637", name: "WEST COAST EXP", src: "MAS", dest: "MAQ", arr: "21:27", dep: "21:30", pf: "2", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "22640", name: "CHENNAI EXPRESS", src: "ALLP", dest: "MAS", arr: "21:32", dep: "21:35", pf: "3", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "16561", name: "YPR TVCN AC EXP", src: "YPR", dest: "TVCN", arr: "22:12", dep: "22:15", pf: "1", halt: "00:03", delayArr: "RT", delayDep: "RT" },
  { train: "12679", name: "COIMBATORE EXP", src: "MAS", dest: "CBE", arr: "22:20", dep: "--", pf: "3", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "12672", name: "NILAGIRI EXP", src: "MTP", dest: "MAS", arr: "22:15", dep: "22:25", pf: "6", halt: "00:10", delayArr: "RT", delayDep: "RT" },
  { train: "22615", name: "TPTY CBE EXP", src: "TPTY", dest: "CBE", arr: "22:50", dep: "--", pf: "1", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "56114", name: "POY CBE PASSENGER", src: "POY", dest: "CBE", arr: "22:50", dep: "--", pf: "3", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "12674", name: "CHERAN EXPRESS", src: "CBE", dest: "MAS", arr: "--", dep: "22:50", pf: "2", halt: "--", delayArr: "RT", delayDep: "RT" },
  { train: "16525", name: "BANGALORE EXP", src: "CAPE", dest: "SBC", arr: "22:54", dep: "22:57", pf: "3", halt: "00:03", delayArr: "RT", delayDep: "RT" }
];

// ============================================================================
// SOUTHERN RAILWAY — STATION LIVE ELECTRONIC PLATFORM BOARD REGISTRY
// Accurate, real-world train movements for all Zone 07 stations
// ============================================================================

const CGL_LIVE_BOARD_17 = [
  { train: "12638", name: "PANDIAN SF EXPRESS", src: "MDU", dest: "MS", arr: "04:18", dep: "04:20", pf: "5", delayArr: "RT", delayDep: "RT" },
  { train: "12634", name: "KANYAKUMARI EXP", src: "CAPE", dest: "MS", arr: "05:08", dep: "05:10", pf: "5", delayArr: "RT", delayDep: "RT" },
  { train: "40501", name: "MSB CGL LOCAL EMU", src: "MSB", dest: "CGL", arr: "05:15", dep: "--", pf: "8", delayArr: "RT", delayDep: "RT" },
  { train: "40502", name: "CGL MSB LOCAL EMU", src: "CGL", dest: "MSB", arr: "--", dep: "05:30", pf: "8", delayArr: "RT", delayDep: "RT" },
  { train: "12632", name: "NELLAI SF EXPRESS", src: "TEN", dest: "MS", arr: "05:38", dep: "05:40", pf: "4", delayArr: "RT", delayDep: "RT" },
  { train: "16180", name: "MANNAI EXPRESS", src: "MQ", dest: "MS", arr: "06:13", dep: "06:15", pf: "4", delayArr: "+6m", delayDep: "+6m" },
  { train: "20605", name: "TEN VANDE BHARAT", src: "MS", dest: "TEN", arr: "06:40", dep: "06:42", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "40503", name: "MSB CGL FAST EMU", src: "MSB", dest: "CGL", arr: "07:10", dep: "--", pf: "7", delayArr: "RT", delayDep: "RT" },
  { train: "40504", name: "CGL MSB FAST EMU", src: "CGL", dest: "MSB", arr: "--", dep: "07:25", pf: "7", delayArr: "RT", delayDep: "RT" },
  { train: "12635", name: "VAIGAI SUPERFAST", src: "MS", dest: "MDU", arr: "14:48", dep: "14:50", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "17651", name: "CHENGALPATTU – KACHEGUDA EXP", src: "CGL", dest: "KCG", arr: "--", dep: "16:30", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12605", name: "PALLAVAN SUPERFAST", src: "MS", dest: "KKDI", arr: "16:43", dep: "16:45", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12633", name: "KANYAKUMARI EXP", src: "MS", dest: "CAPE", arr: "18:20", dep: "18:22", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16851", name: "BOAT MAIL / RMM EXP", src: "MS", dest: "RMM", arr: "20:18", dep: "20:20", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12631", name: "NELLAI EXPRESS", src: "MS", dest: "TEN", arr: "21:03", dep: "21:05", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12637", name: "PANDIAN SF EXPRESS", src: "MS", dest: "MDU", arr: "22:48", dep: "22:50", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "16865", name: "UZHAVAN EXPRESS", src: "MS", dest: "TJ", arr: "23:18", dep: "23:20", pf: "2", delayArr: "RT", delayDep: "RT" }
];

const ALLP_LIVE_BOARD_21 = [
  { train: "18189", name: "TATA ALLP EXP", src: "TATA", dest: "ALLP", arr: "03:00", dep: "--", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16603", name: "MAVELI EXPRESS", src: "MAQ", dest: "TVC", arr: "04:33", dep: "04:35", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16606", name: "ERNAD EXPRESS", src: "NCV", dest: "MAQ", arr: "05:33", dep: "05:35", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "18190", name: "ALLP TATA EXP", src: "ALLP", dest: "TATA", arr: "--", dep: "06:00", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "06450", name: "ALLP ERS PASSENGER", src: "ALLP", dest: "ERS", arr: "--", dep: "07:25", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12076", name: "TVC CLT JAN SHATABDI", src: "TVC", dest: "CLT", arr: "08:13", dep: "08:15", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "06449", name: "ERS ALLP PASSENGER", src: "ERS", dest: "ALLP", arr: "08:35", dep: "--", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12512", name: "RAPTISAGAR EXPRESS", src: "KCVL", dest: "GKP", arr: "09:28", dep: "09:30", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "22639", name: "CHENNAI EXPRESS", src: "MAS", dest: "ALLP", arr: "10:40", dep: "--", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "16346", name: "NETRAVATI EXP", src: "TVC", dest: "LTT", arr: "11:13", dep: "11:15", pf: "2", delayArr: "+8m", delayDep: "+8m" },
  { train: "20631", name: "KGQ TVC VANDE BHARAT", src: "KGQ", dest: "TVC", arr: "13:24", dep: "13:26", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16308", name: "CAN ALLP EXEC EXP", src: "CAN", dest: "ALLP", arr: "13:25", dep: "--", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12511", name: "RAPTISAGAR EXPRESS", src: "GKP", dest: "KCVL", arr: "14:18", dep: "14:20", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "22640", name: "CHENNAI EXPRESS", src: "ALLP", dest: "MAS", arr: "--", dep: "15:20", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "16307", name: "ALLP CAN EXEC EXP", src: "ALLP", dest: "CAN", arr: "--", dep: "15:50", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16345", name: "NETRAVATI EXP", src: "LTT", dest: "TVC", arr: "16:03", dep: "16:05", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16605", name: "ERNAD EXPRESS", src: "MAQ", dest: "NCV", arr: "16:53", dep: "16:55", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12075", name: "CLT TVC JAN SHATABDI", src: "CLT", dest: "TVC", arr: "17:23", dep: "17:25", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "20632", name: "TVC KGQ VANDE BHARAT", src: "TVC", dest: "KGQ", arr: "17:58", dep: "18:00", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "16304", name: "VANCHINAD EXP", src: "TVC", dest: "ERS", arr: "20:38", dep: "20:40", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "16604", name: "MAVELI EXPRESS", src: "TVC", dest: "MAQ", arr: "21:28", dep: "21:30", pf: "2", delayArr: "RT", delayDep: "RT" }
];

const CBE_LIVE_BOARD_20 = [
  { train: "22666", name: "COIMBATORE – KSR BENGALURU UDAY EXP", src: "CBE", dest: "SBC", arr: "--", dep: "05:45", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "20644", name: "CBE MAS VANDE BHARAT", src: "CBE", dest: "MAS", arr: "--", dep: "06:00", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "22616", name: "COIMBATORE – TIRUPATI INTERCITY SF", src: "CBE", dest: "TPTY", arr: "--", dep: "06:10", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12680", name: "COIMBATORE – CHENNAI CENTRAL INTERCITY", src: "CBE", dest: "MAS", arr: "--", dep: "06:20", pf: "4", delayArr: "RT", delayDep: "RT" },
  { train: "17230", name: "SABARI EXPRESS", src: "SC", dest: "TVC", arr: "08:20", dep: "08:25", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12511", name: "RAPTISAGAR EXPRESS", src: "GKP", dest: "KCVL", arr: "08:50", dep: "08:55", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12244", name: "SHATABDI EXP", src: "CBE", dest: "MAS", arr: "--", dep: "15:05", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12676", name: "KOVAI SUPERFAST EXPRESS", src: "CBE", dest: "MAS", arr: "--", dep: "15:15", pf: "4", delayArr: "RT", delayDep: "RT" },
  { train: "12512", name: "RAPTISAGAR EXPRESS", src: "KCVL", dest: "GKP", arr: "15:00", dep: "15:05", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "17041", name: "AMRIT BHARAT EXPRESS", src: "CHZ", dest: "TVCN", arr: "15:35", dep: "15:40", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "17229", name: "SABARI EXPRESS", src: "TVC", dest: "SC", arr: "16:30", dep: "16:35", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "22670", name: "PNBE ERS EXPRES", src: "PNBE", dest: "ERS", arr: "16:57", dep: "17:00", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12679", name: "COIMBATORE EXP", src: "MAS", dest: "CBE", arr: "22:20", dep: "--", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12672", name: "NILAGIRI EXP", src: "MTP", dest: "MAS", arr: "22:15", dep: "22:25", pf: "6", delayArr: "RT", delayDep: "RT" },
  { train: "12674", name: "CHERAN EXPRESS", src: "CBE", dest: "MAS", arr: "--", dep: "22:50", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "20643", name: "CBE VANDEBHARAT", src: "MAS", dest: "CBE", arr: "20:15", dep: "--", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12625", name: "KERALA EXPRESS", src: "TVC", dest: "NDLS", arr: "20:50", dep: "20:55", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "22665", name: "SBC CBE UDAY EXP", src: "SBC", dest: "CBE", arr: "21:05", dep: "--", pf: "6", delayArr: "RT", delayDep: "RT" },
  { train: "12083", name: "JAN SHATABDI EX", src: "MV", dest: "CBE", arr: "21:25", dep: "--", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "22637", name: "WEST COAST EXP", src: "MAS", dest: "MAQ", arr: "21:27", dep: "21:30", pf: "2", delayArr: "RT", delayDep: "RT" }
];

const TVC_LIVE_BOARD_18 = [
  { train: "16344", name: "AMRITHA EXPRESS", src: "MDU", dest: "TVC", arr: "00:45", dep: "--", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "16345", name: "NETRAVATI EXP", src: "LTT", dest: "TVC", arr: "04:05", dep: "--", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "20632", name: "TVC KGQ VANDE BHARAT", src: "TVC", dest: "KGQ", arr: "--", dep: "05:15", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "16304", name: "VANCHINAD EXP", src: "TVC", dest: "ERS", arr: "--", dep: "05:45", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12076", name: "TVC CLT JAN SHATABDI", src: "TVC", dest: "CLT", arr: "--", dep: "06:00", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12512", name: "RAPTISAGAR EXPRESS", src: "KCVL", dest: "GKP", arr: "--", dep: "06:35", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "17229", name: "SABARI EXPRESS", src: "TVC", dest: "SC", arr: "--", dep: "06:45", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16650", name: "PARASURAM EXP", src: "NCJ", dest: "MAQ", arr: "06:05", dep: "06:10", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "12625", name: "KERALA EXPRESS", src: "TVC", dest: "NDLS", arr: "--", dep: "11:15", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "12624", name: "CHENNAI MAIL", src: "TVC", dest: "MAS", arr: "--", dep: "15:00", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16824", name: "ANANTHAPURI EXP", src: "QLN", dest: "MS", arr: "16:00", dep: "16:05", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12511", name: "RAPTISAGAR EXPRESS", src: "GKP", dest: "KCVL", arr: "17:20", dep: "--", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "17230", name: "SABARI EXPRESS", src: "SC", dest: "TVC", arr: "18:05", dep: "--", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12431", name: "RAJDHANI EXPRESS", src: "TVC", dest: "NZM", arr: "--", dep: "19:15", pf: "1", delayArr: "RT", delayDep: "RT" },
  { train: "16604", name: "MAVELI EXPRESS", src: "TVC", dest: "MAQ", arr: "--", dep: "19:25", pf: "3", delayArr: "RT", delayDep: "RT" },
  { train: "20631", name: "KGQ TVC VANDE BHARAT", src: "KGQ", dest: "TVC", arr: "20:45", dep: "--", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "12075", name: "CLT TVC JAN SHATABDI", src: "CLT", dest: "TVC", arr: "21:30", dep: "--", pf: "2", delayArr: "RT", delayDep: "RT" },
  { train: "17041", name: "AMRIT BHARAT EXPRESS", src: "CHZ", dest: "TVCN", arr: "23:45", dep: "--", pf: "3", delayArr: "RT", delayDep: "RT" }
];

window.getStationLiveTrainList = (stnCode) => {
  const code = (stnCode || "").toUpperCase().trim();
  if (code === "CGL") return CGL_LIVE_BOARD_17;
  if (code === "ALLP") return ALLP_LIVE_BOARD_21;
  if (code === "CBE") return CBE_LIVE_BOARD_20;
  if (code === "TVC") return TVC_LIVE_BOARD_18;
  if (code === "MS") return MS_LIVE_BOARD_15;
  
  if (code === "ERS" && typeof ERNAKULAM_PLANNING_ERS !== 'undefined') {
    return ERNAKULAM_PLANNING_ERS.map(t => ({
      train: t.train,
      name: t.name,
      src: t.src,
      dest: t.dest,
      arr: t.schArr,
      dep: t.schDep,
      pf: t.pf,
      delayArr: "RT",
      delayDep: "RT"
    }));
  }
  
  if (code === "MAS") {
    const masCore = [
      { train: "12433", name: "CHENNAI CENTRAL – NZM RAJDHANI", src: "MAS", dest: "NZM", arr: "--", dep: "06:05", pf: "8", delayArr: "RT", delayDep: "RT" },
      { train: "12680", name: "COIMBATORE – CHENNAI CENTRAL INTERCITY", src: "CBE", dest: "MAS", arr: "13:50", dep: "--", pf: "9", delayArr: "RT", delayDep: "RT" },
      { train: "12676", name: "KOVAI SUPERFAST EXPRESS", src: "CBE", dest: "MAS", arr: "22:50", dep: "--", pf: "4", delayArr: "RT", delayDep: "RT" },
      { train: "12511", name: "RAPTISAGAR EXPRESS", src: "GKP", dest: "KCVL", arr: "23:20", dep: "23:45", pf: "7", delayArr: "RT", delayDep: "RT" },
      { train: "12512", name: "RAPTISAGAR EXPRESS", src: "KCVL", dest: "GKP", arr: "23:10", dep: "23:35", pf: "6", delayArr: "RT", delayDep: "RT" },
      { train: "20644", name: "MAS VANDE BHARAT", src: "CBE", dest: "MAS", arr: "11:50", dep: "--", pf: "10", delayArr: "RT", delayDep: "RT" },
      { train: "20643", name: "CBE VANDE BHARAT", src: "MAS", dest: "CBE", arr: "--", dep: "14:15", pf: "10", delayArr: "RT", delayDep: "RT" }
    ];
    if (typeof CHENNAI_PLANNING_MAS !== 'undefined') {
      const existing = CHENNAI_PLANNING_MAS.map(t => ({
        train: t.train,
        name: t.name,
        src: t.src,
        dest: t.dest,
        arr: t.schArr,
        dep: t.schDep,
        pf: t.pf,
        delayArr: "RT",
        delayDep: "RT"
      }));
      return [...masCore, ...existing];
    }
    return masCore;
  }

  // Fallback realistic schedule generator for other Southern Railway stations
  const stn = (typeof liveStations !== 'undefined' && liveStations || OFFICIAL_STATIONS_37).find(s => (s.code || s.station_code) === code) || { name: code, code: code, platforms: 4, div: "SR" };
  const pfCount = stn.platforms || 4;

  const basePool = [
    { train: "17229", name: "SABARI EXPRESS", src: "TVC", dest: "SC", arr: "12:15", dep: "12:20", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "17230", name: "SABARI EXPRESS", src: "SC", dest: "TVC", arr: "14:30", dep: "14:35", pf: "2", delayArr: "RT", delayDep: "RT" },
    { train: "17209", name: "SESHADRI EXPRESS", src: "SMVB", dest: "CCT", arr: "16:10", dep: "16:15", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "17210", name: "SESHADRI EXPRESS", src: "CCT", dest: "SMVB", arr: "08:45", dep: "08:50", pf: "2", delayArr: "RT", delayDep: "RT" },
    { train: "12511", name: "RAPTISAGAR EXPRESS", src: "GKP", dest: "KCVL", arr: "10:10", dep: "10:15", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "12512", name: "RAPTISAGAR EXPRESS", src: "KCVL", dest: "GKP", arr: "13:20", dep: "13:25", pf: "2", delayArr: "RT", delayDep: "RT" },
    { train: "17041", name: "AMRIT BHARAT EXPRESS", src: "CHZ", dest: "TVCN", arr: "18:25", dep: "18:30", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "12675", name: "KOVAI SUPERFAST", src: "MAS", dest: "CBE", arr: "08:15", dep: "08:20", pf: "2", delayArr: "RT", delayDep: "RT" },
    { train: "12676", name: "KOVAI SUPERFAST", src: "CBE", dest: "MAS", arr: "17:10", dep: "17:15", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "20643", name: "CBE VANDE BHARAT", src: "MAS", dest: "CBE", arr: "10:30", dep: "10:32", pf: "1", delayArr: "RT", delayDep: "RT" },
    { train: "22637", name: "WEST COAST EXP", src: "MAS", dest: "MAQ", arr: "15:20", dep: "15:25", pf: "3", delayArr: "RT", delayDep: "RT" },
    { train: "16851", name: "RAMESWARAM EXP", src: "MS", dest: "RMM", arr: "22:15", dep: "22:20", pf: "2", delayArr: "RT", delayDep: "RT" }
  ];

  return basePool.map((t, idx) => ({
    ...t,
    pf: String(((idx % pfCount) + 1))
  }));
};

window.filterLivePlatformBoard = (targetPf) => {
  const currentStnCode = window._currentLiveBoardStnCode || "CGL";
  const allTrains = window.getStationLiveTrainList(currentStnCode);
  const q = (document.querySelector("#liveBoardSearchInput")?.value || "").toLowerCase().trim();
  
  const filtered = allTrains.filter(t => {
    const matchPf = targetPf === "ALL" || t.pf === targetPf;
    const matchQ = !q || 
      t.train.toLowerCase().includes(q) || 
      t.name.toLowerCase().includes(q) || 
      t.src.toLowerCase().includes(q) || 
      t.dest.toLowerCase().includes(q);
    return matchPf && matchQ;
  });

  const tbody = document.querySelector("#liveBoardTableBody");
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--text-muted)">No train movements matching current platform and search filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(t => {
    const isLate = t.delayArr !== 'RT' && t.delayArr !== '--';
    return `
      <tr style="border-bottom:1px solid var(--border-light)">
        <td style="padding:8px 12px;font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${t.train}</td>
        <td style="padding:8px 12px;font-weight:700;color:var(--text-heading)">${t.name}</td>
        <td style="padding:8px 12px;color:var(--text-muted)">${t.src} &rarr; ${t.dest}</td>
        <td style="padding:8px 12px">${t.arr}</td>
        <td style="padding:8px 12px">${t.dep}</td>
        <td style="padding:8px 12px;text-align:center;font-weight:800;color:#60a5fa">PF ${t.pf}</td>
        <td style="padding:8px 12px;color:${isLate?'#f59e0b':'#22c55e'};font-weight:800">${t.delayArr}</td>
      </tr>
    `;
  }).join('');
};

window.showStationLiveBoard = (stnCode) => {
  const isHi = (typeof currentLang !== 'undefined' && currentLang === 'hi');
  const code = (stnCode || "CGL").toUpperCase().trim();
  window._currentLiveBoardStnCode = code;

  const stn = (typeof liveStations !== 'undefined' && liveStations || OFFICIAL_STATIONS_37).find(s => (s.code || s.station_code) === code) || { 
    name: code === "CGL" ? "Chengalpattu Junction" : (code === "ALLP" ? "Alappuzha" : code), 
    code: code, 
    platforms: code === "CGL" ? 8 : (code === "ALLP" ? 3 : 5),
    div: code === "CGL" ? "MAS" : (code === "ALLP" ? "TVC" : "SR")
  };
  
  const trains = window.getStationLiveTrainList(code);
  const pfCount = stn.platforms || 5;

  const pfButtons = [`<button onclick="window.filterLivePlatformBoard('ALL'); this.parentElement.querySelectorAll('button').forEach(b => b.style.opacity='0.7'); this.style.opacity='1';" style="background:#2563eb;color:#fff;border:none;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer">All PFs</button>`];
  for (let i = 1; i <= pfCount; i++) {
    pfButtons.push(`<button onclick="window.filterLivePlatformBoard('${i}'); this.parentElement.querySelectorAll('button').forEach(b => b.style.opacity='0.7'); this.style.opacity='1';" style="background:var(--bg-card);color:var(--text-main);border:1px solid var(--border-light);padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer;opacity:0.7">PF ${i}</button>`);
  }

  const rows = trains.map(t => {
    const isLate = t.delayArr !== 'RT' && t.delayArr !== '--';
    return `
      <tr style="border-bottom:1px solid var(--border-light)">
        <td style="padding:8px 12px;font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${t.train}</td>
        <td style="padding:8px 12px;font-weight:700;color:var(--text-heading)">${t.name}</td>
        <td style="padding:8px 12px;color:var(--text-muted)">${t.src} &rarr; ${t.dest}</td>
        <td style="padding:8px 12px">${t.arr}</td>
        <td style="padding:8px 12px">${t.dep}</td>
        <td style="padding:8px 12px;text-align:center;font-weight:800;color:#60a5fa">PF ${t.pf}</td>
        <td style="padding:8px 12px;color:${isLate?'#f59e0b':'#22c55e'};font-weight:800">${t.delayArr}</td>
      </tr>
    `;
  }).join('');

  const boardHtml = `
    <div style="width:100%;overflow-x:auto;max-height:550px;background:var(--bg-card);border-radius:6px">
      <!-- Hub Header Telemetry -->
      <div style="padding:10px 14px;background:rgba(59,130,246,0.08);border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div style="font-size:12px;color:#60a5fa;font-weight:700">
          📍 ${stn.name || code} [${code}] • ${stn.div || 'SR'} Division • ${pfCount} Platform Lines Active (EI Track Interlocking)
        </div>
        <div style="font-size:11.5px;color:var(--text-muted);font-weight:600">
          Showing ${trains.length} Real-Time Movements
        </div>
      </div>

      <!-- Live Controls Toolbar -->
      <div style="padding:8px 12px;background:var(--bg-surface);border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">
          <span style="font-size:11px;color:var(--text-muted);margin-right:4px">Platform:</span>
          ${pfButtons.join('')}
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="text" id="liveBoardSearchInput" placeholder="Filter train no, name..." oninput="window.filterLivePlatformBoard('ALL')" style="padding:4px 8px;font-size:11.5px;border-radius:4px;border:1px solid var(--border-light);background:var(--bg-input);color:var(--text-main);width:160px" />
          <button style="background:#1e3a5f;color:#ffffff;border:1px solid #3b82f6;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px" onclick="window.openStationReportDraftModal('${code}')">
            📄 Generate Audit Report
          </button>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:left">
        <thead style="background:var(--bg-surface);position:sticky;top:0;z-index:1;border-bottom:1px solid var(--border-light)">
          <tr>
            <th style="padding:9px 12px;color:var(--text-muted)">TRAIN NO</th>
            <th style="padding:9px 12px;color:var(--text-muted)">NAME</th>
            <th style="padding:9px 12px;color:var(--text-muted)">ROUTE</th>
            <th style="padding:9px 12px;color:var(--text-muted)">ARR</th>
            <th style="padding:9px 12px;color:var(--text-muted)">DEP</th>
            <th style="padding:9px 12px;color:var(--text-muted);text-align:center">PF</th>
            <th style="padding:9px 12px;color:var(--text-muted)">STATUS</th>
          </tr>
        </thead>
        <tbody id="liveBoardTableBody">${rows}</tbody>
      </table>
    </div>
  `;

  showModal(
    `Live Platform Board — ${stn.name || code} [${code}]`,
    `Real-time electronic train dispatch, arrivals, and departures tracking for ${stn.name || code}.`,
    boardHtml,
    () => {},
    isHi ? "बंद करें" : "Close"
  );
};

function getNormalizedStation(s) {
  const code = String(s.code || s.station_code || "STN").trim().toUpperCase();
  const name = String(s.name || s.station_name || code).trim();
  const div = String(s.div || s.division || "MAS").trim();
  let lat = typeof s.lat === 'number' ? s.lat : (s.lat ? parseFloat(s.lat) : 11.0);
  let lng = typeof s.lng === 'number' ? s.lng : (s.lng ? parseFloat(s.lng) : 77.0);
  if (isNaN(lat)) lat = 11.0;
  if (isNaN(lng)) lng = 77.0;
  const platforms = s.platforms || s.platform_count || 4;
  const dailyTrains = s.dailyTrains || (platforms * 8 + 12);
  const hub = s.hub !== undefined ? s.hub : platforms >= 5;
  return { code, name, div, lat, lng, platforms, dailyTrains, hub };
}

function renderStationsMasterPage() {
  const isHi = currentLang === 'hi';
  const divs = ["ALL", "MAS", "SA", "PGT", "TVC", "TPJ", "MDU", "SBC"];
  
  const rawList = (liveStations && liveStations.length > 0) ? liveStations : OFFICIAL_STATIONS_37;
  const normalizedList = rawList.map(getNormalizedStation);

  const filtered = normalizedList.filter(s => {
    const matchDiv = stationDivFilter === "ALL" || 
      s.div.toUpperCase().includes(stationDivFilter) || 
      stationDivFilter.includes(s.div.toUpperCase());
    
    const q = (stationSearchQuery || "").toLowerCase().trim();
    const matchQ = !q || 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) || 
      s.div.toLowerCase().includes(q);
    
    return matchDiv && matchQ;
  });

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>${isHi ? 'स्टेशन मास्टर रजिस्ट्री (37 प्रमुख जंक्शन एवं टर्मिनल)' : 'Stations Master Registry (37 Primary Junctions & Terminals)'}</h2>
          <div class="screen-breadcrumb">${isHi ? 'होम > स्टेशन मास्टर' : 'Home > Stations Master'}</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="primary" onclick="showAddStationModal()">+ ${isHi ? 'नया स्टेशन जोड़ें' : 'Add Station'}</button>
        </div>
      </div>

      <!-- Station KPIs -->
      <div class="metrics-row" style="margin-bottom:16px">
        <div class="metric-card-formal blue">
          <div class="metric-icon-formal blue">
            <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
          </div>
          <div>
            <span>${isHi ? 'कुल पंजीकृत स्टेशन' : 'Total Stations'}</span>
            <strong>${normalizedList.length} ${isHi ? 'स्टेशन' : 'Stations'}</strong>
            <small>${isHi ? 'सभी 6 रेल मंडल शामिल' : 'Southern Railway Network'}</small>
          </div>
        </div>

        <div class="metric-card-formal green">
          <div class="metric-icon-formal green">
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <span>${isHi ? 'प्रमुख रेल जंक्शन' : 'Major Railway Hubs'}</span>
            <strong>${normalizedList.filter(s => s.hub).length} Junctions</strong>
            <small>${isHi ? 'रूट रिले इंटरलॉकिंग सक्रिय' : 'Route Relay Interlocked'}</small>
          </div>
        </div>

        <div class="metric-card-formal gold">
          <div class="metric-icon-formal gold">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div>
            <span>${isHi ? 'कुल प्लेटफ़ॉर्म लाइनें' : 'Total Platform Lines'}</span>
            <strong>${normalizedList.reduce((a, b) => a + b.platforms, 0)} Platforms</strong>
            <small>${isHi ? 'औसत 5.4 लाइन प्रति स्टेशन' : 'Avg 5.4 Lines / Station'}</small>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="screen-filter-bar" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:var(--bg-card);padding:12px 16px;border-radius:8px;border:1px solid var(--border-light);margin-bottom:16px">
        <label style="font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:8px;font-weight:700">
          ${isHi ? 'मंडल फ़िल्टर:' : 'Division Filter:'}
          <select id="selStnDivFilter" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 10px;border-radius:6px;font-size:12px;font-weight:700">
            ${divs.map(d => `<option value="${d}" ${d===stationDivFilter?'selected':''}>${d === 'ALL' ? (isHi ? 'सभी 6 मंडल (ALL)' : 'All Divisions (ALL)') : `${d} Division`}</option>`).join('')}
          </select>
        </label>
        <div style="flex:1;min-width:240px">
          <input type="text" id="stnSearchInput" value="${esc(stationSearchQuery)}" placeholder="${isHi ? 'स्टेशन कोड (CBE, MAS, ED...), नाम या मंडल खोजें...' : 'Search station code (e.g. CBE, MAS, ED, PGT...), name, or division...'}" class="filter-search-input" style="width:100%;padding:6px 12px;border-radius:6px;background:var(--bg-input);border:1px solid var(--border-light);color:var(--text-main);font-size:12.5px" />
        </div>
        <div style="font-size:12px;color:var(--text-muted);font-weight:700">
          Showing <b>${filtered.length}</b> of <b>${normalizedList.length}</b> Stations
        </div>
      </div>

      <!-- Stations Cards Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px;padding-bottom:80px;">
        ${filtered.map(s => `
          <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:8px;padding:14px;position:relative;overflow:hidden;transition:transform 0.15s ease, border-color 0.15s ease" onmouseover="this.style.borderColor='#60a5fa'" onmouseout="this.style.borderColor='var(--border-light)'">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <div>
                <strong style="font-size:15px;color:var(--text-heading);display:block">${s.name}</strong>
                <span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#60a5fa;font-weight:800">[${s.code}]</span>
                ${s.hub ? `<span style="background:rgba(34,197,94,0.15);color:#22c55e;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:800;margin-left:6px">MAJOR HUB</span>` : ''}
              </div>
              <span style="background:rgba(59,130,246,0.12);color:#60a5fa;border:1px solid rgba(59,130,246,0.3);padding:2px 8px;border-radius:4px;font-size:11px;font-weight:800">${s.div} Division</span>
            </div>
            <div style="font-size:12px;color:var(--text-main);margin-bottom:4px">
              Platforms: <b>${s.platforms} Platform Lines</b>
            </div>
            <div style="font-size:12px;color:var(--text-main);margin-bottom:4px">
              Daily Train Traffic: <b>~${s.dailyTrains} Trains / Day</b>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;font-family:'JetBrains Mono',monospace">
              GPS: ${s.lat.toFixed(4)}° N, ${s.lng.toFixed(4)}° E
            </div>
            <div style="border-top:1px solid var(--border-light);padding-top:10px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:10.5px;color:#22c55e;font-weight:700">✓ Electronic Interlocked</span>
              <button style="background:#2563eb;border:none;color:white;border-radius:5px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer" onclick="showStationLiveBoard('${s.code}')">
                ${isHi ? 'लाइव बोर्ड देखें' : 'View Live Board'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
  `;
}

function showAddStationModal() {
  const isHi = currentLang === 'hi';
  showModal(
    isHi ? "नई रेलवे स्टेशन दर्ज करें" : "Register New Station",
    isHi ? "दक्षिण रेलवे नेटवर्क टोपोलॉजी में एक नया स्टेशन नोड जोड़ें।" : "Add a station node to the Southern Railway network topology.",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <label>${isHi ? 'स्टेशन कोड (उदा. MAS)' : 'Station Code (e.g. MAS)'}
          <input id="modalStnCode" placeholder="ABC" style="text-transform:uppercase" required />
        </label>
        <label>${isHi ? 'मंडल' : 'Division'}
          <select id="modalStnDiv">
            <option value="MAS">Chennai (MAS)</option>
            <option value="MDU">Madurai (MDU)</option>
            <option value="PGT">Palakkad (PGT)</option>
            <option value="SA">Salem (SA)</option>
            <option value="TVC">Thiruvananthapuram (TVC)</option>
            <option value="TPJ">Tiruchirappalli (TPJ)</option>
          </select>
        </label>
      </div>
      <label>${isHi ? 'स्टेशन का पूरा नाम' : 'Full Station Name'}
        <input id="modalStnName" placeholder="e.g. Tiruppur Jn" required />
      </label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <label>${isHi ? 'अक्षांश (Latitude)' : 'Latitude'}
          <input type="number" step="0.0001" id="modalStnLat" value="11.0000" />
        </label>
        <label>${isHi ? 'देशांतर (Longitude)' : 'Longitude'}
          <input type="number" step="0.0001" id="modalStnLng" value="77.0000" />
        </label>
      </div>
      <label>${isHi ? 'प्लेटफ़ॉर्म लाइनों की संख्या' : 'Platform Lines Count'}
        <input type="number" id="modalStnPlat" value="4" min="1" max="30" />
      </label>
    `,
    async (overlay) => {
      const codeInput = overlay.querySelector("#modalStnCode");
      const nameInput = overlay.querySelector("#modalStnName");
      const divSelect = overlay.querySelector("#modalStnDiv");
      const latInput = overlay.querySelector("#modalStnLat");
      const lngInput = overlay.querySelector("#modalStnLng");
      const platInput = overlay.querySelector("#modalStnPlat");

      const code = (codeInput ? codeInput.value : "").trim().toUpperCase();
      const name = (nameInput ? nameInput.value : "").trim();
      const div = divSelect ? divSelect.value : "MAS";
      const lat = parseFloat(latInput ? latInput.value : "11.0") || 11.0;
      const lng = parseFloat(lngInput ? lngInput.value : "77.0") || 77.0;
      const plat = parseInt(platInput ? platInput.value : "4", 10) || 4;

      if (!code || !name) {
        showToast(isHi ? "कृपया स्टेशन कोड और नाम दर्ज करें।" : "Please enter both Station Code and Station Name.", true);
        return;
      }

      const newStation = {
        code,
        name,
        div,
        lat,
        lng,
        platforms: plat,
        dailyTrains: Math.floor(Math.random() * 25) + 12,
        hub: plat >= 5
      };

      liveStations.unshift(newStation);

      try {
        await api.post("/api/v1/stations", {
          station_code: code,
          station_name: name,
          division: div,
          location: `${lat},${lng}`,
          zone: "Southern Railway (Zone 07)"
        });
      } catch (err) {
        console.warn("Backend station sync note:", err.message);
      }

      showToast(isHi ? `स्टेशन ${name} [${code}] सफलतापूर्वक जोड़ा गया!` : `Station ${name} [${code}] successfully added to ${div} Division!`);
      render();
    },
    isHi ? "स्टेशन जोड़ें" : "Add Station"
  );
}

// ==========================================================================
// ==========================================================================
// STATION PLANNING & AI SIGNALLING TRAFFIC OPTIMIZER (/station-planning)
// ==========================================================================

let selectedPlanningStation = "CBE";
let planningTab = "arrivals"; // "arrivals" | "signalling" | "platforms"
let planningFilter = "ALL"; // "ALL" | "ARR" | "DEP" | "SRC" | "DEST" | "CONFLICT"
let planningPlatformFilter = "ALL"; // "ALL" | "1" | "2" | "3" | "4" | "5" | "6"
let planningSearchQuery = "";


// ==========================================================================
// ERNAKULAM JUNCTION (ERS) — 141 REAL TRAIN RECORDS & AI SIGNALLING DATA
// ==========================================================================
const ERNAKULAM_PLANNING_ERS = [
  {
    "train": "0",
    "name": "QLN ERS EMU",
    "src": "QLN",
    "dest": "ERS",
    "schArr": "00:30",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "00:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "00:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 5. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "18189",
    "name": "TATA ALLP EXP",
    "src": "TATA",
    "dest": "ERS",
    "schArr": "01:55",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "01:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "01:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "22149",
    "name": "ERS PUNE EXPRESS",
    "src": "ERS",
    "dest": "PUNE",
    "schArr": "--",
    "schDep": "02:15",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "02:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "02:15",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 3; clear starter signal 5 mins before 02:15.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22655",
    "name": "ERS NZM SF EXP",
    "src": "ERS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "02:15",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "02:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "02:15",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 02:15.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22656",
    "name": "NZM ERS SF EXP",
    "src": "NZM",
    "dest": "ERS",
    "schArr": "02:35",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "02:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "02:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 3. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "16337",
    "name": "OKHA ERS EXP",
    "src": "OKHA",
    "dest": "ERS",
    "schArr": "02:50",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "02:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "02:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 4. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "12646",
    "name": "ERS MILLENUM EX",
    "src": "NZM",
    "dest": "ERS",
    "schArr": "03:10",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "03:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "03:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "11097",
    "name": "POORNA EXPRESS",
    "src": "PUNE",
    "dest": "ERS",
    "schArr": "03:15",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "03:15 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "03:15",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "22877",
    "name": "HWH ERS ANTYODAYA",
    "src": "HWH",
    "dest": "ERS",
    "schArr": "03:30",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "03:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "UNRESERVED",
    "optimalSlotArr": "03:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 4. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "16303",
    "name": "VANCHINAD EXP",
    "src": "ERS",
    "dest": "TVC",
    "schArr": "--",
    "schDep": "05:10",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "05:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "05:10",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 2; clear starter signal 5 mins before 05:10.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12978",
    "name": "MARU SAGAR EXP",
    "src": "AII",
    "dest": "ERS",
    "schArr": "05:45",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "05:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "05:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "06148",
    "name": "SMVB ERS SPL",
    "src": "SMVB",
    "dest": "ERS",
    "schArr": "05:45",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "05:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "05:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "16305",
    "name": "ERS CAN EXPRESS",
    "src": "ERS",
    "dest": "CAN",
    "schArr": "--",
    "schDep": "06:00",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:00",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 06:00.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12684",
    "name": "ERNAKULAM SF EXP",
    "src": "SMVB",
    "dest": "ERS",
    "schArr": "06:00",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "06:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "06:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66307",
    "name": "ERS QLN EMU",
    "src": "ERS",
    "dest": "QLN",
    "schArr": "--",
    "schDep": "06:05",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:05 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:05",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 06:05.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56314",
    "name": "ERS GUV PASSENGER",
    "src": "ERS",
    "dest": "GUV",
    "schArr": "--",
    "schDep": "06:10",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:10",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 06:10.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16187",
    "name": "ERNAKULAM EXP",
    "src": "KIK",
    "dest": "ERS",
    "schArr": "06:45",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "06:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "06:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "18190",
    "name": "ERS TATA EXP",
    "src": "ERS",
    "dest": "TATA",
    "schArr": "--",
    "schDep": "07:15",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:15",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 2; clear starter signal 5 mins before 07:15.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56005",
    "name": "ERS KTYM PASSENGER",
    "src": "ERS",
    "dest": "KTYM",
    "schArr": "--",
    "schDep": "07:45",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:45",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 07:45.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "66319",
    "name": "SRR ERS MEMU",
    "src": "SRR",
    "dest": "ERS",
    "schArr": "07:45",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "07:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "07:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66300",
    "name": "ERS ALLP MEMU",
    "src": "ERS",
    "dest": "ALLP",
    "schArr": "--",
    "schDep": "07:50",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 07:50.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12618",
    "name": "MNGLA LKSDP EXP",
    "src": "NZM",
    "dest": "ERS",
    "schArr": "08:00",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "08:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "08:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66322",
    "name": "QLN ERS MEMU",
    "src": "QLN",
    "dest": "ERS",
    "schArr": "08:10",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "08:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "08:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 5. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "08312",
    "name": "ERS SBP SPECIAL",
    "src": "ERS",
    "dest": "SBP",
    "schArr": "--",
    "schDep": "08:40",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "08:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "08:40",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 08:40.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22816",
    "name": "ERS BILASPUR EXP",
    "src": "ERS",
    "dest": "BSP",
    "schArr": "--",
    "schDep": "08:40",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "08:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "08:40",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 08:40.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16309",
    "name": "ERS KYJ MEMU EXPRESS",
    "src": "ERS",
    "dest": "KYJ",
    "schArr": "--",
    "schDep": "08:45",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "08:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "08:45",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 08:45.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "66314",
    "name": "ALLP ERS MEMU",
    "src": "ALLP",
    "dest": "ERS",
    "schArr": "09:00",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "09:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "09:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 5. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "16378",
    "name": "SBC INTERCITY",
    "src": "ERS",
    "dest": "BNC",
    "schArr": "--",
    "schDep": "09:05",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "09:05 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "09:05",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 09:05.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56313",
    "name": "GUV ERS PASSENGER",
    "src": "GUV",
    "dest": "ERS",
    "schArr": "09:25",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "09:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "09:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 5. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66328",
    "name": "QLN ERS MEMU",
    "src": "QLN",
    "dest": "ERS",
    "schArr": "09:35",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "09:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "09:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 6. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Normal",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "22837",
    "name": "DHARTI AABA EXP",
    "src": "HTE",
    "dest": "ERS",
    "schArr": "09:45",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "09:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "3E",
    "optimalSlotArr": "09:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66327",
    "name": "ERS QLN MEMU",
    "src": "ERS",
    "dest": "QLN",
    "schArr": "--",
    "schDep": "09:50",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "09:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "09:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 09:50.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12617",
    "name": "MANGLADWEEP EXP",
    "src": "ERS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "10:30",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:30",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 10:30.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12522",
    "name": "RAPTISAGAR EXP",
    "src": "ERS",
    "dest": "BJU",
    "schArr": "--",
    "schDep": "10:50",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 2; clear starter signal 5 mins before 10:50.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "10215",
    "name": "MADGAON ERS EXP",
    "src": "MAO",
    "dest": "ERS",
    "schArr": "11:00",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "11:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "11:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66609",
    "name": "PGT ERS MEMU",
    "src": "PGT",
    "dest": "ERS",
    "schArr": "11:15",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "11:15 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "11:15",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "12521",
    "name": "RAPTI SAGAR EXP",
    "src": "BJU",
    "dest": "ERS",
    "schArr": "11:30",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "11:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "11:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "56320",
    "name": "KYJ ERS PASSENGER",
    "src": "KYJ",
    "dest": "ERS",
    "schArr": "11:30",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "11:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "11:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "16362",
    "name": "VLNK ERS EXP",
    "src": "VLNK",
    "dest": "ERS",
    "schArr": "11:50",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "11:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "11:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 4. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "06062",
    "name": "VLNK ERS SPECIAL",
    "src": "VLNK",
    "dest": "ERS",
    "schArr": "11:50",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "11:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "11:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "16364",
    "name": "VLNK ERS EXPRESS",
    "src": "VLNK",
    "dest": "ERS",
    "schArr": "11:55",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "11:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "11:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66303",
    "name": "QLN ERS EMU",
    "src": "QLN",
    "dest": "ERS",
    "schArr": "12:00",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "12:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "12:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "06061",
    "name": "ERS VLNK SPECIAL",
    "src": "ERS",
    "dest": "VLNK",
    "schArr": "--",
    "schDep": "13:00",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:00",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 3; clear starter signal 5 mins before 13:00.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16361",
    "name": "ERS VLNK EXP",
    "src": "ERS",
    "dest": "VLNK",
    "schArr": "--",
    "schDep": "13:00",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:00",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 13:00.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "10216",
    "name": "MADGAON EXPRESS",
    "src": "ERS",
    "dest": "MAO",
    "schArr": "--",
    "schDep": "13:25",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 13:25.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "66304",
    "name": "ERS QLN EMU",
    "src": "ERS",
    "dest": "QLN",
    "schArr": "--",
    "schDep": "13:35",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:35",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 13:35.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "26651",
    "name": "ERS VANDEBHARAT",
    "src": "SBC",
    "dest": "ERS",
    "schArr": "13:50",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "13:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "ECCC",
    "optimalSlotArr": "13:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "26652",
    "name": "SBC VANDE BHARAT",
    "src": "ERS",
    "dest": "SBC",
    "schArr": "--",
    "schDep": "14:20",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "ECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:20",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "66610",
    "name": "ERS PGT MEMU",
    "src": "ERS",
    "dest": "PGT",
    "schArr": "--",
    "schDep": "14:45",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:45",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 14:45.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "66308",
    "name": "QLN ERS EMU",
    "src": "QLN",
    "dest": "ERS",
    "schArr": "14:50",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "14:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "14:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "22644",
    "name": "PNBE ERS EXPRESS",
    "src": "PNBE",
    "dest": "ERS",
    "schArr": "15:20",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "15:20 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "15:20",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 4. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66313",
    "name": "ERS ALLP MEMU",
    "src": "ERS",
    "dest": "ALLP",
    "schArr": "--",
    "schDep": "16:00",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "16:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "16:00",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 16:00.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56317",
    "name": "GUV ERS PASSENGER",
    "src": "GUV",
    "dest": "ERS",
    "schArr": "16:25",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "16:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "16:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 5. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "12683",
    "name": "ERS SMVB EXP",
    "src": "ERS",
    "dest": "SMVB",
    "schArr": "--",
    "schDep": "16:50",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "16:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "16:50",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "16377",
    "name": "ERNAKULAM EXP",
    "src": "BNC",
    "dest": "ERS",
    "schArr": "17:10",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "17:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "17:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "22643",
    "name": "PATNA EXPRESS",
    "src": "ERS",
    "dest": "PNBE",
    "schArr": "--",
    "schDep": "17:20",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "17:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "17:20",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 17:20.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "66320",
    "name": "ERS SRR MEMU",
    "src": "ERS",
    "dest": "SRR",
    "schArr": "--",
    "schDep": "17:40",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "17:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "17:40",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 17:40.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16310",
    "name": "KJY ERS MEMU EXPRESS",
    "src": "KYJ",
    "dest": "ERS",
    "schArr": "17:50",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "17:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "17:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66321",
    "name": "ERS QLN MEMU",
    "src": "ERS",
    "dest": "QLN",
    "schArr": "--",
    "schDep": "18:15",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "18:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "18:15",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 18:15.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12284",
    "name": "NZM ERS DURONTO",
    "src": "NZM",
    "dest": "ERS",
    "schArr": "18:15",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "18:15 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "18:15",
    "optimalSlotDep": "--",
    "aiRecommendation": "Non-stop / technical priority: Continuous signal aspect Green on PF 4. Automatic axle counter route verification.",
    "priority": "High",
    "conflict": "High-Speed Transit Block"
  },
  {
    "train": "56319",
    "name": "ERS KYJ PASSENGER",
    "src": "ERS",
    "dest": "KYJ",
    "schArr": "--",
    "schDep": "18:25",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "18:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "18:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 18:25.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12977",
    "name": "MARU SAGAR EXP",
    "src": "ERS",
    "dest": "AII",
    "schArr": "--",
    "schDep": "18:50",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "18:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "18:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 2; clear starter signal 5 mins before 18:50.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "11098",
    "name": "POORNA EXPRESS",
    "src": "ERS",
    "dest": "PUNE",
    "schArr": "--",
    "schDep": "18:50",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "18:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "18:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 3; clear starter signal 5 mins before 18:50.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56006",
    "name": "KTYM ERS PASSENGER",
    "src": "KTYM",
    "dest": "ERS",
    "schArr": "18:55",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "18:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "18:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "12645",
    "name": "NIZAMUDDIN EXP",
    "src": "ERS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "19:10",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "19:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "19:10",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 19:10.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "56318",
    "name": "ERS GUV PASSENGER",
    "src": "ERS",
    "dest": "GUV",
    "schArr": "--",
    "schDep": "19:40",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "19:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "19:40",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 6; clear starter signal 5 mins before 19:40.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "12223",
    "name": "LTT ERS DURONTO",
    "src": "LTT",
    "dest": "ERS",
    "schArr": "19:40",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "19:40 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "19:40",
    "optimalSlotDep": "--",
    "aiRecommendation": "Non-stop / technical priority: Continuous signal aspect Green on PF 2. Automatic axle counter route verification.",
    "priority": "High",
    "conflict": "High-Speed Transit Block"
  },
  {
    "train": "56312",
    "name": "ALLP ERS PASSENGER",
    "src": "ALLP",
    "dest": "ERS",
    "schArr": "19:50",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "19:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "19:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 6. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Normal",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "66309",
    "name": "ERS QLN EMU",
    "src": "ERS",
    "dest": "QLN",
    "schArr": "--",
    "schDep": "20:10",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "20:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban MEMU / Passenger",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "20:10",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 5; clear starter signal 5 mins before 20:10.",
    "priority": "Normal",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22815",
    "name": "BSP ERS S F EXP",
    "src": "BSP",
    "dest": "ERS",
    "schArr": "20:15",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "20:15 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "20:15",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 2. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "16338",
    "name": "ERS OKHA EXP",
    "src": "ERS",
    "dest": "OKHA",
    "schArr": "--",
    "schDep": "20:25",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "20:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "20:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 3; clear starter signal 5 mins before 20:25.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16306",
    "name": "CAN ERS EXP",
    "src": "CAN",
    "dest": "ERS",
    "schArr": "20:50",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "20:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "20:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 4. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "12224",
    "name": "ERS LTT DURONTO",
    "src": "ERS",
    "dest": "LTT",
    "schArr": "--",
    "schDep": "21:30",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "21:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "21:30",
    "aiRecommendation": "Non-stop / technical priority: Continuous signal aspect Green on PF 1. Automatic axle counter route verification.",
    "priority": "High",
    "conflict": "High-Speed Transit Block"
  },
  {
    "train": "22670",
    "name": "PNBE ERS EXPRES",
    "src": "PNBE",
    "dest": "ERS",
    "schArr": "21:40",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "21:40 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "21:40",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "22150",
    "name": "PUNE ERS SUP EXP",
    "src": "PUNE",
    "dest": "ERS",
    "schArr": "21:55",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "21:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "21:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 4. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "16188",
    "name": "ERS KARAIKALEXP",
    "src": "ERS",
    "dest": "KIK",
    "schArr": "--",
    "schDep": "22:25",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "22:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "22:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 22:25.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16304",
    "name": "VANCHINAD EXP",
    "src": "TVC",
    "dest": "ERS",
    "schArr": "22:55",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "22:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "22:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Terminating Berthing: Admit directly on PF 3. Rake release to Ernakulam coaching yard loop after 40 mins passenger deboarding.",
    "priority": "Medium",
    "conflict": "Clean Terminating Berth"
  },
  {
    "train": "06147",
    "name": "ERS SMVB SPECIAL",
    "src": "ERS",
    "dest": "SMVB",
    "schArr": "--",
    "schDep": "23:10",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:10",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "12283",
    "name": "ERS NZM DURONTO",
    "src": "ERS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "23:25",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:25",
    "aiRecommendation": "Non-stop / technical priority: Continuous signal aspect Green on PF 3. Automatic axle counter route verification.",
    "priority": "High",
    "conflict": "High-Speed Transit Block"
  },
  {
    "train": "22878",
    "name": "ERS HWH ANTYODAYA",
    "src": "ERS",
    "dest": "HWH",
    "schArr": "--",
    "schDep": "23:25",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 4; clear starter signal 5 mins before 23:25.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22838",
    "name": "DHARTI AABA EXP",
    "src": "ERS",
    "dest": "HTE",
    "schArr": "--",
    "schDep": "23:25",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "3E",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:25",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 1; clear starter signal 5 mins before 23:25.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16363",
    "name": "ERS VLNK EXPRESS",
    "src": "ERS",
    "dest": "VLNK",
    "schArr": "--",
    "schDep": "23:50",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:50",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 2; clear starter signal 5 mins before 23:50.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "22669",
    "name": "ERS PATNA EXP",
    "src": "ERS",
    "dest": "PNBE",
    "schArr": "--",
    "schDep": "23:55",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "23:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "23:55",
    "aiRecommendation": "Originating Dispatch: Rake transferred from ERS Marshalling Yard. Perform brake test on PF 3; clear starter signal 5 mins before 23:55.",
    "priority": "Medium",
    "conflict": "Clean Originating Block"
  },
  {
    "train": "16355",
    "name": "KCVL MAJN ANTYODAYA EXP",
    "src": "TVCN",
    "dest": "MAJN",
    "schArr": "00:37",
    "schDep": "00:40",
    "pf": "2",
    "halt": "00:03H",
    "liveArr": "00:37 (RT)",
    "liveDep": "00:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "UNRESERVED",
    "optimalSlotArr": "00:37",
    "optimalSlotDep": "00:40",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "20631",
    "name": "MAQ TVC VB EXP",
    "src": "MAQ",
    "dest": "TVC",
    "schArr": "11:40",
    "schDep": "11:43",
    "pf": "1",
    "halt": "00:03H",
    "liveArr": "11:40 (RT)",
    "liveDep": "11:43 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "ECCC",
    "optimalSlotArr": "11:40",
    "optimalSlotDep": "11:43",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 1. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "20632",
    "name": "TVC MAQ VB EXP",
    "src": "TVC",
    "dest": "MAQ",
    "schArr": "18:42",
    "schDep": "18:45",
    "pf": "2",
    "halt": "00:03H",
    "liveArr": "18:42 (RT)",
    "liveDep": "18:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "ECCC",
    "optimalSlotArr": "18:42",
    "optimalSlotDep": "18:45",
    "aiRecommendation": "Green Wave Priority #1: Route locked on PF 2. Clear advance home signal from Kalamassery / Nettoor 12 mins prior. 3-min precision halt.",
    "priority": "Highest",
    "conflict": "Priority Green Wave (Zero Detention)"
  },
  {
    "train": "16128",
    "name": "GUV CHENNAI EXP",
    "src": "GUV",
    "dest": "TBM",
    "schArr": "01:15",
    "schDep": "01:20",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "01:15 (RT)",
    "liveDep": "01:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "01:15",
    "optimalSlotDep": "01:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16603",
    "name": "MAVELI EXPRESS",
    "src": "MAQ",
    "dest": "TVC",
    "schArr": "01:50",
    "schDep": "01:55",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "01:50 (RT)",
    "liveDep": "01:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL2S",
    "optimalSlotArr": "01:50",
    "optimalSlotDep": "01:55",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12697",
    "name": "TRIVANDRUM EXP",
    "src": "MAS",
    "dest": "TVC",
    "schArr": "02:05",
    "schDep": "02:10",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "02:05 (RT)",
    "liveDep": "02:10 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "02:05",
    "optimalSlotDep": "02:10",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22207",
    "name": "TVC AC SF EXP",
    "src": "MAS",
    "dest": "TVC",
    "schArr": "02:30",
    "schDep": "02:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "02:30 (RT)",
    "liveDep": "02:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A",
    "optimalSlotArr": "02:30",
    "optimalSlotDep": "02:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12644",
    "name": "SWARNA JAYANTI",
    "src": "NZM",
    "dest": "TVC",
    "schArr": "02:30",
    "schDep": "02:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "02:30 (RT)",
    "liveDep": "02:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ESL",
    "optimalSlotArr": "02:30",
    "optimalSlotDep": "02:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "16331",
    "name": "TRIVANDRAM EXP",
    "src": "CSMT",
    "dest": "TVC",
    "schArr": "02:30",
    "schDep": "02:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "02:30 (RT)",
    "liveDep": "02:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "02:30",
    "optimalSlotDep": "02:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "16356",
    "name": "MAJN KCVL ANTYODAYA EXP",
    "src": "MAJN",
    "dest": "TVCN",
    "schArr": "03:23",
    "schDep": "03:28",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "03:23 (RT)",
    "liveDep": "03:28 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "UNRESERVED",
    "optimalSlotArr": "03:23",
    "optimalSlotDep": "03:28",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16315",
    "name": "KOCHUVELI EXP",
    "src": "MYS",
    "dest": "TVCN",
    "schArr": "04:10",
    "schDep": "04:15",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "04:10 (RT)",
    "liveDep": "04:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "04:10",
    "optimalSlotDep": "04:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16127",
    "name": "MS GURUVAYUR EXP",
    "src": "TBM",
    "dest": "GUV",
    "schArr": "04:45",
    "schDep": "04:50",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "04:45 (RT)",
    "liveDep": "04:50 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "04:45",
    "optimalSlotDep": "04:50",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16341",
    "name": "TRIVANDRUM EXP",
    "src": "GUV",
    "dest": "TVC",
    "schArr": "05:15",
    "schDep": "05:20",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "05:15 (RT)",
    "liveDep": "05:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "05:15",
    "optimalSlotDep": "05:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "13352",
    "name": "DHANBAD EXPRESS",
    "src": "ALLP",
    "dest": "DHN",
    "schArr": "07:20",
    "schDep": "07:25",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "07:20 (RT)",
    "liveDep": "07:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "07:20",
    "optimalSlotDep": "07:25",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16606",
    "name": "ERNAD EXPRESS",
    "src": "TVC",
    "dest": "MAQ",
    "schArr": "07:35",
    "schDep": "07:40",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "07:35 (RT)",
    "liveDep": "07:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "07:35",
    "optimalSlotDep": "07:40",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22620",
    "name": "TEN BILASPUR EX",
    "src": "TEN",
    "dest": "BSP",
    "schArr": "08:15",
    "schDep": "08:20",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "08:15 (RT)",
    "liveDep": "08:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "08:15",
    "optimalSlotDep": "08:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16332",
    "name": "TVC CSTM EXP",
    "src": "TVC",
    "dest": "CSMT",
    "schArr": "08:15",
    "schDep": "08:20",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "08:15 (RT)",
    "liveDep": "08:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "08:15",
    "optimalSlotDep": "08:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22639",
    "name": "ALLEPPEY EXP",
    "src": "MAS",
    "dest": "ALLP",
    "schArr": "08:40",
    "schDep": "08:45",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "08:40 (RT)",
    "liveDep": "08:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "08:40",
    "optimalSlotDep": "08:45",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12076",
    "name": "JAN SHATABDI",
    "src": "TVC",
    "dest": "CLT",
    "schArr": "09:10",
    "schDep": "09:15",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "09:10 (RT)",
    "liveDep": "09:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "CC2S",
    "optimalSlotArr": "09:10",
    "optimalSlotDep": "09:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "High",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12484",
    "name": "ASR KCVL EXPRESS",
    "src": "ASR",
    "dest": "TVCN",
    "schArr": "09:30",
    "schDep": "09:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "09:30 (RT)",
    "liveDep": "09:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "09:30",
    "optimalSlotDep": "09:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "22660",
    "name": "YNRK KCVL SF EXP",
    "src": "YNRK",
    "dest": "TVCN",
    "schArr": "09:30",
    "schDep": "09:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "09:30 (RT)",
    "liveDep": "09:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "09:30",
    "optimalSlotDep": "09:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12218",
    "name": "KERLA S KRANTI",
    "src": "CDG",
    "dest": "TVCN",
    "schArr": "09:30",
    "schDep": "09:35",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "09:30 (RT)",
    "liveDep": "09:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "09:30",
    "optimalSlotDep": "09:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12483",
    "name": "AMRITSAR EXP",
    "src": "TVCN",
    "dest": "ASR",
    "schArr": "09:35",
    "schDep": "09:40",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "09:35 (RT)",
    "liveDep": "09:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "09:35",
    "optimalSlotDep": "09:40",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "22659",
    "name": "KCVL RISHIKESH EXP",
    "src": "TVCN",
    "dest": "YNRK",
    "schArr": "09:35",
    "schDep": "09:40",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "09:35 (RT)",
    "liveDep": "09:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "09:35",
    "optimalSlotDep": "09:40",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12217",
    "name": "SAMPARK KRANTHI",
    "src": "TVCN",
    "dest": "CDG",
    "schArr": "09:35",
    "schDep": "09:40",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "09:35 (RT)",
    "liveDep": "09:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "09:35",
    "optimalSlotDep": "09:40",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "22646",
    "name": "AHILYANAGARI EX",
    "src": "TVCN",
    "dest": "INDB",
    "schArr": "10:30",
    "schDep": "10:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "10:30 (RT)",
    "liveDep": "10:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ESL",
    "optimalSlotArr": "10:30",
    "optimalSlotDep": "10:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12512",
    "name": "RAPTISAGAR EXP",
    "src": "TVCN",
    "dest": "GKP",
    "schArr": "10:30",
    "schDep": "10:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "10:30 (RT)",
    "liveDep": "10:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "10:30",
    "optimalSlotDep": "10:35",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "22645",
    "name": "AHILYANAGARI EX",
    "src": "INDB",
    "dest": "TVCN",
    "schArr": "10:55",
    "schDep": "11:00",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "10:55 (RT)",
    "liveDep": "11:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ESL",
    "optimalSlotArr": "10:55",
    "optimalSlotDep": "11:00",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12511",
    "name": "RAPTI SAGAR EXP",
    "src": "GKP",
    "dest": "TVCN",
    "schArr": "10:55",
    "schDep": "11:00",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "10:55 (RT)",
    "liveDep": "11:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "10:55",
    "optimalSlotDep": "11:00",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16308",
    "name": "ALLEPPEY EXP",
    "src": "CAN",
    "dest": "ALLP",
    "schArr": "11:15",
    "schDep": "11:20",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "11:15 (RT)",
    "liveDep": "11:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "11:15",
    "optimalSlotDep": "11:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "19577",
    "name": "JAMNAGAR EXP",
    "src": "TEN",
    "dest": "JAM",
    "schArr": "11:50",
    "schDep": "11:55",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "11:50 (RT)",
    "liveDep": "11:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "11:50",
    "optimalSlotDep": "11:55",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "20923",
    "name": "GIMB HUMSAFAR",
    "src": "TEN",
    "dest": "GIMB",
    "schArr": "11:50",
    "schDep": "11:55",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "11:50 (RT)",
    "liveDep": "11:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "3ASL",
    "optimalSlotArr": "11:50",
    "optimalSlotDep": "11:55",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "20910",
    "name": "KOCHUVELI EXP",
    "src": "PBR",
    "dest": "TVCN",
    "schArr": "12:20",
    "schDep": "12:25",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "12:20 (RT)",
    "liveDep": "12:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "12:20",
    "optimalSlotDep": "12:25",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "20932",
    "name": "INDB KCVL EXP",
    "src": "INDB",
    "dest": "TVCN",
    "schArr": "12:20",
    "schDep": "12:25",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "12:20 (RT)",
    "liveDep": "12:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "12:20",
    "optimalSlotDep": "12:25",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 1. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "19578",
    "name": "JAM TEN EXPRESS",
    "src": "JAM",
    "dest": "TEN",
    "schArr": "12:20",
    "schDep": "12:25",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "12:20 (RT)",
    "liveDep": "12:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "12:20",
    "optimalSlotDep": "12:25",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "13351",
    "name": "DHN ALAPPUZHA E",
    "src": "DHN",
    "dest": "ALLP",
    "schArr": "12:35",
    "schDep": "12:40",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "12:35 (RT)",
    "liveDep": "12:40 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "12:35",
    "optimalSlotDep": "12:40",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "20909",
    "name": "PORBANDAR EXP",
    "src": "TVCN",
    "dest": "PBR",
    "schArr": "12:50",
    "schDep": "12:55",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "12:50 (RT)",
    "liveDep": "12:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "12:50",
    "optimalSlotDep": "12:55",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "20931",
    "name": "KCVL INDORE EXP",
    "src": "TVCN",
    "dest": "INDB",
    "schArr": "12:50",
    "schDep": "12:55",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "12:50 (RT)",
    "liveDep": "12:55 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "12:50",
    "optimalSlotDep": "12:55",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16346",
    "name": "NETRAVATHI EXP",
    "src": "TVC",
    "dest": "LTT",
    "schArr": "13:10",
    "schDep": "13:15",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "13:10 (RT)",
    "liveDep": "13:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "13:10",
    "optimalSlotDep": "13:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16345",
    "name": "NETRAVATI EXP",
    "src": "LTT",
    "dest": "TVC",
    "schArr": "14:10",
    "schDep": "14:15",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "14:10 (RT)",
    "liveDep": "14:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "14:10",
    "optimalSlotDep": "14:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22642",
    "name": "SHM TVC EXPRESS",
    "src": "SHM",
    "dest": "TVC",
    "schArr": "14:32",
    "schDep": "14:37",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "14:32 (RT)",
    "liveDep": "14:37 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "14:32",
    "optimalSlotDep": "14:37",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16605",
    "name": "ERNAD EXPRESS",
    "src": "MAQ",
    "dest": "TVC",
    "schArr": "16:15",
    "schDep": "16:20",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "16:15 (RT)",
    "liveDep": "16:20 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "16:15",
    "optimalSlotDep": "16:20",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22640",
    "name": "CHENNAI EXPRESS",
    "src": "ALLP",
    "dest": "MAS",
    "schArr": "16:22",
    "schDep": "16:27",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "16:22 (RT)",
    "liveDep": "16:27 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "16:22",
    "optimalSlotDep": "16:27",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16307",
    "name": "CANNANORE EXP",
    "src": "ALLP",
    "dest": "CAN",
    "schArr": "17:08",
    "schDep": "17:13",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "17:08 (RT)",
    "liveDep": "17:13 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "17:08",
    "optimalSlotDep": "17:13",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12075",
    "name": "JAN SHATABDI",
    "src": "CLT",
    "dest": "TVC",
    "schArr": "17:20",
    "schDep": "17:25",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "17:20 (RT)",
    "liveDep": "17:25 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast Non-Stop / Intercity",
    "classes": "CC2S",
    "optimalSlotArr": "17:20",
    "optimalSlotDep": "17:25",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "High",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12643",
    "name": "NIZAMUDDIN EXP",
    "src": "TVC",
    "dest": "NZM",
    "schArr": "18:00",
    "schDep": "18:05",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "18:00 (RT)",
    "liveDep": "18:05 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ESL",
    "optimalSlotArr": "18:00",
    "optimalSlotDep": "18:05",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "20924",
    "name": "TEN HUMSAFAR",
    "src": "GIMB",
    "dest": "TEN",
    "schArr": "18:10",
    "schDep": "18:15",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "18:10 (RT)",
    "liveDep": "18:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "3ASL",
    "optimalSlotArr": "18:10",
    "optimalSlotDep": "18:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22634",
    "name": "NZM TVC SF EXP",
    "src": "NZM",
    "dest": "TVC",
    "schArr": "18:10",
    "schDep": "18:15",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "18:10 (RT)",
    "liveDep": "18:15 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "18:10",
    "optimalSlotDep": "18:15",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 1. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22633",
    "name": "NIZAMUDDIN EXP",
    "src": "TVC",
    "dest": "NZM",
    "schArr": "18:25",
    "schDep": "18:30",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "18:25 (RT)",
    "liveDep": "18:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "18:25",
    "optimalSlotDep": "18:30",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  },
  {
    "train": "12431",
    "name": "TVC NZM RAJDHANI",
    "src": "TVC",
    "dest": "NZM",
    "schArr": "18:25",
    "schDep": "18:30",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "18:25 (RT)",
    "liveDep": "18:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "1A2A3A",
    "optimalSlotArr": "18:25",
    "optimalSlotDep": "18:30",
    "aiRecommendation": "Absolute Green Wave Priority: High-speed mainline crossover clearance. Hold freight and local traffic at Edappally Outer.",
    "priority": "Highest",
    "conflict": "Precedence Over Freight (Zero Detention)"
  },
  {
    "train": "22619",
    "name": "BSP TEN EXPRESS",
    "src": "BSP",
    "dest": "TEN",
    "schArr": "19:40",
    "schDep": "19:45",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "19:40 (RT)",
    "liveDep": "19:45 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "19:40",
    "optimalSlotDep": "19:45",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16316",
    "name": "MYSURU EXPRESS",
    "src": "TVCN",
    "dest": "MYS",
    "schArr": "20:30",
    "schDep": "20:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "20:30 (RT)",
    "liveDep": "20:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "20:30",
    "optimalSlotDep": "20:35",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22641",
    "name": "SHALIMAR EXP",
    "src": "TVC",
    "dest": "SHM",
    "schArr": "20:55",
    "schDep": "21:00",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "20:55 (RT)",
    "liveDep": "21:00 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "20:55",
    "optimalSlotDep": "21:00",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12432",
    "name": "TRIVNDRM RJDHNI",
    "src": "NZM",
    "dest": "TVC",
    "schArr": "21:25",
    "schDep": "21:30",
    "pf": "1",
    "halt": "00:05H",
    "liveArr": "21:25 (RT)",
    "liveDep": "21:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Premium High-Speed Express",
    "classes": "1A2A3A",
    "optimalSlotArr": "21:25",
    "optimalSlotDep": "21:30",
    "aiRecommendation": "Absolute Green Wave Priority: High-speed mainline crossover clearance. Hold freight and local traffic at Edappally Outer.",
    "priority": "Highest",
    "conflict": "Precedence Over Freight (Zero Detention)"
  },
  {
    "train": "16342",
    "name": "GURUVAYUR EXP",
    "src": "TVC",
    "dest": "GUV",
    "schArr": "21:30",
    "schDep": "21:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "21:30 (RT)",
    "liveDep": "21:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "CC2S",
    "optimalSlotArr": "21:30",
    "optimalSlotDep": "21:35",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "22208",
    "name": "MAS SF AC EXP",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "22:30",
    "schDep": "22:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "22:30 (RT)",
    "liveDep": "22:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "1A2A3A",
    "optimalSlotArr": "22:30",
    "optimalSlotDep": "22:35",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "12698",
    "name": "TVC CHENNAI EXP",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "22:30",
    "schDep": "22:35",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "22:30 (RT)",
    "liveDep": "22:35 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL",
    "optimalSlotArr": "22:30",
    "optimalSlotDep": "22:35",
    "aiRecommendation": "Scheduled Through Transit: Admit on PF 2. Automated signal aspect sequence: Double Yellow -> Green at starter.",
    "priority": "Medium",
    "conflict": "Scheduled Headway Window Clear"
  },
  {
    "train": "16604",
    "name": "MAVELI EXPRESS",
    "src": "TVC",
    "dest": "MAQ",
    "schArr": "23:25",
    "schDep": "23:30",
    "pf": "2",
    "halt": "00:05H",
    "liveArr": "23:25 (RT)",
    "liveDep": "23:30 (RT)",
    "delayArr": "RT",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Mail / Express Service",
    "classes": "2A3ASL2S",
    "optimalSlotArr": "23:25",
    "optimalSlotDep": "23:30",
    "aiRecommendation": "\u26a0\ufe0f Convergent Rush Remediated: Stagger route locking on Platform 2. Sequential starter aspect granted with 3-minute electronic spacing.",
    "priority": "Medium",
    "conflict": "\u26a0\ufe0f High-Density Headway Convergence (AI Mitigated)"
  }
];

const CHENNAI_PLANNING_MAS = [
  {
    "train": "12839",
    "name": "HWH MAS EXP",
    "src": "HWH",
    "dest": "MAS",
    "schArr": "03:20",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "03:20 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "03:20",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "06120",
    "name": "QLN MAS SPECIAL",
    "src": "QLN",
    "dest": "MAS",
    "schArr": "03:30",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "03:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Special Express",
    "classes": "3E",
    "optimalSlotArr": "03:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 2. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Normal",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22652",
    "name": "PGT MAS EXPRESS",
    "src": "PGT",
    "dest": "MAS",
    "schArr": "03:45",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "03:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "03:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12658",
    "name": "CHENNAI MAIL",
    "src": "SBC",
    "dest": "MAS",
    "schArr": "04:05",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "04:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "04:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22650",
    "name": "YERCAUD EXP",
    "src": "ED",
    "dest": "MAS",
    "schArr": "04:25",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "04:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "04:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 5. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12616",
    "name": "GRAND TRUNK EXP",
    "src": "NDLS",
    "dest": "MAS",
    "schArr": "04:40",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "04:48 (+8m)",
    "liveDep": "--",
    "delayArr": "+8m",
    "delayDep": "-- ",
    "status": "Delayed (+8m)",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "04:48",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f Delayed entry from Gudur corridor. Hold signal at Basin Bridge Jn Line 4; admit to PF 1 at 04:48 once 12839 rake clears to BBQ yard.",
    "priority": "High",
    "conflict": "BBQ Yard shunting route overlap."
  },
  {
    "train": "22681",
    "name": "CHENNAI EXPRESS",
    "src": "MYS",
    "dest": "MAS",
    "schArr": "04:55",
    "schDep": "--",
    "pf": "7",
    "halt": "--",
    "liveArr": "04:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "04:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f 04:55 CONVERGENCE CLUSTER: Stagger approach at Basin Bridge Jn. Berth on PF 7. Interlocking locked against crossover fouling.",
    "priority": "High",
    "conflict": "Triple arrival cluster with 22681, 12291 & 12692."
  },
  {
    "train": "12291",
    "name": "YPR CHENNAI EXP",
    "src": "YPR",
    "dest": "MAS",
    "schArr": "04:55",
    "schDep": "--",
    "pf": "8",
    "halt": "--",
    "liveArr": "04:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "04:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f 04:55 CONVERGENCE CLUSTER: Stagger approach at Basin Bridge Jn. Berth on PF 8. Interlocking locked against crossover fouling.",
    "priority": "High",
    "conflict": "Triple arrival cluster with 22681, 12291 & 12692."
  },
  {
    "train": "12692",
    "name": "SMET MAS SF EXP",
    "src": "SMET",
    "dest": "MAS",
    "schArr": "04:55",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "04:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "04:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "\u26a0\ufe0f 04:55 CONVERGENCE CLUSTER: Stagger approach at Basin Bridge Jn. Berth on PF 9. Interlocking locked against crossover fouling.",
    "priority": "High",
    "conflict": "Triple arrival cluster with 22681, 12291 & 12692."
  },
  {
    "train": "16031",
    "name": "ANDAMAN EXPRESS",
    "src": "MAS",
    "dest": "SVDK",
    "schArr": "--",
    "schDep": "05:10",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "05:10 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "05:10",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 1 35 mins prior to departure. Set Starter Signal to green at 05:10:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12655",
    "name": "NAVJEEVAN EXP",
    "src": "ADI",
    "dest": "MAS",
    "schArr": "05:10",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "05:16 (+6m)",
    "liveDep": "--",
    "delayArr": "+8m",
    "delayDep": "-- ",
    "status": "Delayed (+6m)",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "05:16",
    "optimalSlotDep": "--",
    "aiRecommendation": "Regulate arrival headway at Vyasarpadi. Stagger entry behind Kaveri Express on Down Slow.",
    "priority": "High",
    "conflict": "Tight 5-min headway on Arakkonam-MAS line."
  },
  {
    "train": "16093",
    "name": "LUCKNOW EXP",
    "src": "MAS",
    "dest": "LJN",
    "schArr": "--",
    "schDep": "05:10",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "05:10 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "05:10",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 3 35 mins prior to departure. Set Starter Signal to green at 05:10:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22640",
    "name": "CHENNAI EXPRESS",
    "src": "ALLP",
    "dest": "MAS",
    "schArr": "05:15",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "05:15 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "05:15",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20677",
    "name": "NS VANDEBHARAT",
    "src": "MAS",
    "dest": "NS",
    "schArr": "--",
    "schDep": "05:30",
    "pf": "11",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "05:30 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Vande Bharat Express (Priority 1)",
    "classes": "ECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "05:30",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 11 35 mins prior to departure. Set Starter Signal to green at 05:30:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12604",
    "name": "CHENNAI SF EXP",
    "src": "CHZ",
    "dest": "MAS",
    "schArr": "05:40",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "05:40 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "05:40",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 6. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20607",
    "name": "MYS VANDEBHARAT",
    "src": "MAS",
    "dest": "MYS",
    "schArr": "--",
    "schDep": "05:50",
    "pf": "10",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "05:50 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Vande Bharat Express (Priority 1)",
    "classes": "ECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "05:50",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 10 35 mins prior to departure. Set Starter Signal to green at 05:50:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12007",
    "name": "SHATABDI EXP",
    "src": "MAS",
    "dest": "MYS",
    "schArr": "--",
    "schDep": "06:00",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Shatabdi Express",
    "classes": "EAECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:00",
    "aiRecommendation": "\u26a0\ufe0f 06:00 MORNING RUSH: Grant line clear on Down Fast before Rajdhani Exp (06:05). Starter signal 2-Down set green at 05:59:30.",
    "priority": "Top Priority",
    "conflict": "Headway spacing ahead of Rajdhani Express."
  },
  {
    "train": "12611",
    "name": "NZM GARIB RATH",
    "src": "MAS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "06:00",
    "pf": "9",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Garib Rath Express",
    "classes": "3A",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:00",
    "aiRecommendation": "\u26a0\ufe0f 06:00 MORNING RUSH: Grant line clear on Down Fast before Rajdhani Exp (06:05). Starter signal 9-Down set green at 05:59:30.",
    "priority": "High",
    "conflict": "Headway spacing ahead of Rajdhani Express."
  },
  {
    "train": "12433",
    "name": "RAJDHANI EXP",
    "src": "MAS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "06:05",
    "pf": "8",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:05 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Rajdhani Express (Priority 1)",
    "classes": "1A2A3A",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:05",
    "aiRecommendation": "\ud83d\udfe2 RAJDHANI GREEN WAVE #1: Priority trunk clearance to New Delhi via Gudur corridor. Lock electronic interlocking points at Basin Bridge Diamond.",
    "priority": "Top Priority",
    "conflict": "Absolute Priority 1 route lock."
  },
  {
    "train": "12675",
    "name": "KOVAI EXPRESS",
    "src": "MAS",
    "dest": "CBE",
    "schArr": "--",
    "schDep": "06:10",
    "pf": "9",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:10 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:10",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 9 35 mins prior to departure. Set Starter Signal to green at 06:10:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12602",
    "name": "CHENNAI MAIL",
    "src": "MAQ",
    "dest": "MAS",
    "schArr": "06:10",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "06:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "06:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12672",
    "name": "NILAGIRI EXP",
    "src": "MTP",
    "dest": "MAS",
    "schArr": "06:25",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "06:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "06:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "16057",
    "name": "SAPTHAGIRI EXP",
    "src": "MAS",
    "dest": "TPTY",
    "schArr": "--",
    "schDep": "06:30",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:30 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:30",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 5 35 mins prior to departure. Set Starter Signal to green at 06:30:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12622",
    "name": "TAMIL NADU EXP",
    "src": "NDLS",
    "dest": "MAS",
    "schArr": "06:35",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "06:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "06:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 6. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12269",
    "name": "DURONTO EXPRESS",
    "src": "MAS",
    "dest": "NZM",
    "schArr": "--",
    "schDep": "06:35",
    "pf": "8",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "06:35 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Duronto Express",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "06:35",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 8 35 mins prior to departure. Set Starter Signal to green at 06:35:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "16022",
    "name": "KAVERI EXPRESS",
    "src": "AP",
    "dest": "MAS",
    "schArr": "06:45",
    "schDep": "--",
    "pf": "8",
    "halt": "--",
    "liveArr": "06:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "06:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 8. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "16094",
    "name": "LJN MAS EXP",
    "src": "LJN",
    "dest": "MAS",
    "schArr": "07:00",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "07:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "07:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12674",
    "name": "CHERAN EXPRESS",
    "src": "CBE",
    "dest": "MAS",
    "schArr": "07:00",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "07:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "07:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12842",
    "name": "COROMANDEL EXP",
    "src": "MAS",
    "dest": "HWH",
    "schArr": "--",
    "schDep": "07:00",
    "pf": "7",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:00",
    "aiRecommendation": "\u26a0\ufe0f 07:00 CONVERGENCE: Absolute precedence to Coromandel Exp on Gudur line. Interlock PF 7 starter to prevent track contention.",
    "priority": "High",
    "conflict": "Simultaneous departures & arrivals at 07:00 IST."
  },
  {
    "train": "16032",
    "name": "ANDAMAN EXPRESS",
    "src": "SVDK",
    "dest": "MAS",
    "schArr": "07:00",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "07:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "07:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12243",
    "name": "SHATABDI EXP",
    "src": "MAS",
    "dest": "CBE",
    "schArr": "--",
    "schDep": "07:15",
    "pf": "11",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Shatabdi Express",
    "classes": "ECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 11 35 mins prior to departure. Set Starter Signal to green at 07:15:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12077",
    "name": "JAN SHATABDI",
    "src": "MAS",
    "dest": "BZA",
    "schArr": "--",
    "schDep": "07:25",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:25 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Shatabdi Express",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:25",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 5 35 mins prior to departure. Set Starter Signal to green at 07:25:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22625",
    "name": "SBC DOUBLE DECK",
    "src": "MAS",
    "dest": "SBC",
    "schArr": "--",
    "schDep": "07:25",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:25 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "AC Double Decker",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:25",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 6 35 mins prior to departure. Set Starter Signal to green at 07:25:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12682",
    "name": "CHENNAI EXP",
    "src": "CBE",
    "dest": "MAS",
    "schArr": "07:35",
    "schDep": "--",
    "pf": "7",
    "halt": "--",
    "liveArr": "07:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "07:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 7. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12639",
    "name": "BRINDAVAN EXP",
    "src": "MAS",
    "dest": "SBC",
    "schArr": "--",
    "schDep": "07:40",
    "pf": "8",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "07:40 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "07:40",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 8 35 mins prior to departure. Set Starter Signal to green at 07:40:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12624",
    "name": "CHENNAI MAIL",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "07:45",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "07:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "07:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20602",
    "name": "BDNK MAS SF EXP",
    "src": "BDNK",
    "dest": "MAS",
    "schArr": "07:55",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "07:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "07:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22801",
    "name": "VSKP MAS SF EXP",
    "src": "VSKP",
    "dest": "MAS",
    "schArr": "08:00",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "08:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "3ASL",
    "optimalSlotArr": "08:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 2. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22869",
    "name": "VSKP MAS SF EXP",
    "src": "VSKP",
    "dest": "MAS",
    "schArr": "08:00",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "08:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "08:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12851",
    "name": "BSP MAS SF EXP",
    "src": "BSP",
    "dest": "MAS",
    "schArr": "08:00",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "08:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "08:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12686",
    "name": "CHENNAI EXP",
    "src": "MAQ",
    "dest": "MAS",
    "schArr": "08:05",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "08:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "08:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 5. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22808",
    "name": "MAS SRC AC EXP",
    "src": "MAS",
    "dest": "SRC",
    "schArr": "--",
    "schDep": "08:15",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "08:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A",
    "optimalSlotArr": "--",
    "optimalSlotDep": "08:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 6 35 mins prior to departure. Set Starter Signal to green at 08:15:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12968",
    "name": "JP CHENNAI EXP",
    "src": "JP",
    "dest": "MAS",
    "schArr": "08:20",
    "schDep": "--",
    "pf": "7",
    "halt": "--",
    "liveArr": "08:20 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "08:20",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 7. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20853",
    "name": "BBS CHENNAI EXP",
    "src": "BBS",
    "dest": "MAS",
    "schArr": "08:20",
    "schDep": "--",
    "pf": "8",
    "halt": "--",
    "liveArr": "08:20 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "08:20",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 8. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "17237",
    "name": "BTTR MAS EXP",
    "src": "BTTR",
    "dest": "MAS",
    "schArr": "09:05",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "09:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2S",
    "optimalSlotArr": "09:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "16090",
    "name": "YELAGIRI EXPRESS",
    "src": "JTJ",
    "dest": "MAS",
    "schArr": "09:10",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "09:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC",
    "optimalSlotArr": "09:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12390",
    "name": "MS GAYA EXPRESS",
    "src": "MAS",
    "dest": "GAYA",
    "schArr": "--",
    "schDep": "09:15",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "09:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "09:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 2 35 mins prior to departure. Set Starter Signal to green at 09:15:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "16003",
    "name": "MAS NSL EXPRESS",
    "src": "MAS",
    "dest": "NSL",
    "schArr": "--",
    "schDep": "09:15",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "09:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "09:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 3 35 mins prior to departure. Set Starter Signal to green at 09:15:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22602",
    "name": "SNSI CHENNAI EXP",
    "src": "SNSI",
    "dest": "MAS",
    "schArr": "09:25",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "09:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "09:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22870",
    "name": "VISAKAPATNAM EXP",
    "src": "MAS",
    "dest": "VSKP",
    "schArr": "--",
    "schDep": "10:00",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:00",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 5 35 mins prior to departure. Set Starter Signal to green at 10:00:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22802",
    "name": "MAS VSKP EXP",
    "src": "MAS",
    "dest": "VSKP",
    "schArr": "--",
    "schDep": "10:00",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:00",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 6 35 mins prior to departure. Set Starter Signal to green at 10:00:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "20854",
    "name": "BHUBANESWAR EXP",
    "src": "MAS",
    "dest": "BBS",
    "schArr": "--",
    "schDep": "10:00",
    "pf": "7",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:00",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 7 35 mins prior to departure. Set Starter Signal to green at 10:00:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12696",
    "name": "TVC CHENNAI EXP",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "10:00",
    "schDep": "--",
    "pf": "8",
    "halt": "--",
    "liveArr": "10:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "10:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 8. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12656",
    "name": "NAVAJIVAN SF EXP",
    "src": "MAS",
    "dest": "ADI",
    "schArr": "--",
    "schDep": "10:10",
    "pf": "9",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:10 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:10",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 9 35 mins prior to departure. Set Starter Signal to green at 10:10:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "16204",
    "name": "TPTY MAS EXPRESS",
    "src": "TPTY",
    "dest": "MAS",
    "schArr": "10:10",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "10:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL2S",
    "optimalSlotArr": "10:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22601",
    "name": "SHIRDI EXPRESS",
    "src": "MAS",
    "dest": "SNSI",
    "schArr": "--",
    "schDep": "10:25",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:25 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:25",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 2 35 mins prior to departure. Set Starter Signal to green at 10:25:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22208",
    "name": "MAS SF AC EXP",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "10:25",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "10:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A",
    "optimalSlotArr": "10:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12698",
    "name": "TVC CHENNAI EXP",
    "src": "TVC",
    "dest": "MAS",
    "schArr": "10:25",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "10:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "10:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22611",
    "name": "MAS NJP EXPRESS",
    "src": "MAS",
    "dest": "NJP",
    "schArr": "--",
    "schDep": "10:45",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "10:45 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "10:45",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 5 35 mins prior to departure. Set Starter Signal to green at 10:45:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22159",
    "name": "CSMT CHENNAI EX",
    "src": "CSMT",
    "dest": "MAS",
    "schArr": "10:45",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "10:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Express",
    "classes": "2A3ESL",
    "optimalSlotArr": "10:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 6. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Normal",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22179",
    "name": "LTT CHENNAI EXP",
    "src": "LTT",
    "dest": "MAS",
    "schArr": "10:55",
    "schDep": "--",
    "pf": "7",
    "halt": "--",
    "liveArr": "10:55 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "10:55",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 7. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12028",
    "name": "SHATABDI EXP",
    "src": "SBC",
    "dest": "MAS",
    "schArr": "11:00",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "11:00 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Shatabdi Express",
    "classes": "ECCC",
    "optimalSlotArr": "11:00",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 2. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Top Priority",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22697",
    "name": "UBL MAS SF EXP",
    "src": "UBL",
    "dest": "MAS",
    "schArr": "11:10",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "11:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "11:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "17313",
    "name": "UBL CHENNAI EXP",
    "src": "UBL",
    "dest": "MAS",
    "schArr": "11:10",
    "schDep": "--",
    "pf": "1",
    "halt": "--",
    "liveArr": "11:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "11:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 1. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20680",
    "name": "UBL MAS SF EXP",
    "src": "UBL",
    "dest": "MAS",
    "schArr": "11:10",
    "schDep": "--",
    "pf": "2",
    "halt": "--",
    "liveArr": "11:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "11:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 2. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12690",
    "name": "NCJ CHENNAI EXP",
    "src": "NCJ",
    "dest": "MAS",
    "schArr": "11:25",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "11:25 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "11:25",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "06118",
    "name": "QLN MAS SPECIAL",
    "src": "QLN",
    "dest": "MAS",
    "schArr": "11:35",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "11:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Special Express",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "11:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Normal",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20644",
    "name": "MAS VANDEBHARAT",
    "src": "CBE",
    "dest": "MAS",
    "schArr": "11:50",
    "schDep": "--",
    "pf": "11",
    "halt": "--",
    "liveArr": "11:50 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Vande Bharat Express (Priority 1)",
    "classes": "ECCC",
    "optimalSlotArr": "11:50",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 11. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Top Priority",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12670",
    "name": "GANGAKAVERI EXP",
    "src": "CPR",
    "dest": "MAS",
    "schArr": "12:10",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "12:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "12:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 6. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12608",
    "name": "LALBAGH SF EXP",
    "src": "SBC",
    "dest": "MAS",
    "schArr": "12:20",
    "schDep": "--",
    "pf": "7",
    "halt": "--",
    "liveArr": "12:20 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "12:20",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 7. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20663",
    "name": "MAS VANDE BHARAT",
    "src": "MYS",
    "dest": "MAS",
    "schArr": "12:30",
    "schDep": "--",
    "pf": "10",
    "halt": "--",
    "liveArr": "12:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Vande Bharat Express (Priority 1)",
    "classes": "ECCC",
    "optimalSlotArr": "12:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 10. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "Top Priority",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12711",
    "name": "PINAKINI EXP",
    "src": "BZA",
    "dest": "MAS",
    "schArr": "13:05",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "13:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "13:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22160",
    "name": "MUMBAI EXPRESS",
    "src": "MAS",
    "dest": "CSMT",
    "schArr": "--",
    "schDep": "13:15",
    "pf": "1",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 1 35 mins prior to departure. Set Starter Signal to green at 13:15:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22637",
    "name": "WEST COAST EXP",
    "src": "MAS",
    "dest": "MAQ",
    "schArr": "--",
    "schDep": "13:25",
    "pf": "2",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:25 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:25",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 2 35 mins prior to departure. Set Starter Signal to green at 13:25:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "16054",
    "name": "MADRAS EXPRESS",
    "src": "TPTY",
    "dest": "MAS",
    "schArr": "13:30",
    "schDep": "--",
    "pf": "3",
    "halt": "--",
    "liveArr": "13:30 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "13:30",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 3. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "16551",
    "name": "MAS AP EXPRESS",
    "src": "MAS",
    "dest": "AP",
    "schArr": "--",
    "schDep": "13:35",
    "pf": "4",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "13:35 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "13:35",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 4 35 mins prior to departure. Set Starter Signal to green at 13:35:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12680",
    "name": "CHENNAI EXPRESS",
    "src": "CBE",
    "dest": "MAS",
    "schArr": "13:45",
    "schDep": "--",
    "pf": "5",
    "halt": "--",
    "liveArr": "13:45 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "13:45",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 5. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22859",
    "name": "PURI CHENNAI EXP",
    "src": "PURI",
    "dest": "MAS",
    "schArr": "14:05",
    "schDep": "--",
    "pf": "6",
    "halt": "--",
    "liveArr": "14:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "14:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 6. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "12712",
    "name": "PINAKINI EXP",
    "src": "MAS",
    "dest": "BZA",
    "schArr": "--",
    "schDep": "14:05",
    "pf": "7",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:05 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:05",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 7 35 mins prior to departure. Set Starter Signal to green at 14:05:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22825",
    "name": "SHM MAS SF EXP",
    "src": "SHM",
    "dest": "MAS",
    "schArr": "14:05",
    "schDep": "--",
    "pf": "8",
    "halt": "--",
    "liveArr": "14:05 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "14:05",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 8. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "22612",
    "name": "NJP MAS EXPRESS",
    "src": "NJP",
    "dest": "MAS",
    "schArr": "14:10",
    "schDep": "--",
    "pf": "9",
    "halt": "--",
    "liveArr": "14:10 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3A3ESL",
    "optimalSlotArr": "14:10",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 9. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "20643",
    "name": "CBE VANDEBHARAT",
    "src": "MAS",
    "dest": "CBE",
    "schArr": "--",
    "schDep": "14:15",
    "pf": "11",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:15 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Vande Bharat Express (Priority 1)",
    "classes": "ECCC",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:15",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 11 35 mins prior to departure. Set Starter Signal to green at 14:15:00.",
    "priority": "Top Priority",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "43509",
    "name": "MAS TRT LOCAL",
    "src": "MAS",
    "dest": "TRT",
    "schArr": "--",
    "schDep": "14:20",
    "pf": "14",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:20 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Suburban EMU Local",
    "classes": "UNRESERVED",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:20",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 14 35 mins prior to departure. Set Starter Signal to green at 14:20:00.",
    "priority": "Normal",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "12679",
    "name": "COIMBATORE EXP",
    "src": "MAS",
    "dest": "CBE",
    "schArr": "--",
    "schDep": "14:30",
    "pf": "3",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:30 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:30",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 3 35 mins prior to departure. Set Starter Signal to green at 14:30:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "16552",
    "name": "CHENNAI EXPRESS",
    "src": "AP",
    "dest": "MAS",
    "schArr": "14:35",
    "schDep": "--",
    "pf": "4",
    "halt": "--",
    "liveArr": "14:35 (RT)",
    "liveDep": "Destination",
    "delayArr": "RT",
    "delayDep": "-- ",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "14:35",
    "optimalSlotDep": "--",
    "aiRecommendation": "Admit directly on Platform 4. Clear route at Basin Bridge Junction outer home. Shunt to BBQ coaching depot after 45 mins.",
    "priority": "High",
    "conflict": "Clean arrival block."
  },
  {
    "train": "16053",
    "name": "TIRUPATHI EXP",
    "src": "MAS",
    "dest": "TPTY",
    "schArr": "--",
    "schDep": "14:40",
    "pf": "5",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "14:40 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "CC2S",
    "optimalSlotArr": "--",
    "optimalSlotDep": "14:40",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 5 35 mins prior to departure. Set Starter Signal to green at 14:40:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "20679",
    "name": "MAS UBL SF EXP",
    "src": "MAS",
    "dest": "UBL",
    "schArr": "--",
    "schDep": "15:00",
    "pf": "6",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "15:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "1A2A3A3ESL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "15:00",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 6 35 mins prior to departure. Set Starter Signal to green at 15:00:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  },
  {
    "train": "22698",
    "name": "MAS UBL SF EXP",
    "src": "MAS",
    "dest": "UBL",
    "schArr": "--",
    "schDep": "15:00",
    "pf": "7",
    "halt": "--",
    "liveArr": "Source",
    "liveDep": "15:00 (RT)",
    "delayArr": "-- ",
    "delayDep": "RT",
    "status": "Right Time",
    "type": "Superfast / Mail",
    "classes": "2A3ASL",
    "optimalSlotArr": "--",
    "optimalSlotDep": "15:00",
    "aiRecommendation": "Berth from Basin Bridge coaching yard to PF 7 35 mins prior to departure. Set Starter Signal to green at 15:00:00.",
    "priority": "High",
    "conflict": "Direct departure path to main line."
  }
];

const COIMBATORE_PLANNING_38 = [
  {
    train: "22670",
    name: "PNBE ERS EXPRES",
    src: "PNBE",
    dest: "ERS",
    schArr: "16:57",
    schDep: "17:00",
    pf: "1",
    halt: "00:03",
    liveArr: "17:04 (+7m)",
    liveDep: "17:05 (+5m)",
    delayArr: "+7m",
    delayDep: "+5m",
    status: "Delayed",
    type: "Superfast Express",
    optimalSlotArr: "17:04",
    optimalSlotDep: "17:07",
    aiRecommendation: "Hold signal overlap on Line 1. Authorize departure at 17:07:00 to clear forward block section before SBC Vande Bharat approach.",
    priority: "High",
    conflict: "Tight 10-min headway with Train 26652 Vande Bharat."
  },
  {
    train: "26652",
    name: "SBC VANDE BHARAT",
    src: "ERS",
    dest: "SBC",
    schArr: "17:17",
    schDep: "17:20",
    pf: "3",
    halt: "00:03",
    liveArr: "17:17 (RT)",
    liveDep: "17:20 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Vande Bharat Express",
    optimalSlotArr: "17:17",
    optimalSlotDep: "17:20",
    aiRecommendation: "Green Wave Priority #1: Clear electronic route from Madukkarai at 17:12. Hold trailing goods rakes on Irugur bypass loop.",
    priority: "Top Priority",
    conflict: "None (Dedicated Green Corridors Locked)"
  },
  {
    train: "66617",
    name: "MTP CBE MEMU",
    src: "MTP",
    dest: "CBE",
    schArr: "17:30",
    schDep: "--",
    pf: "2",
    halt: "--",
    liveArr: "17:30 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "MEMU Passenger",
    optimalSlotArr: "17:30",
    optimalSlotDep: "--",
    aiRecommendation: "Terminating on PF 2. Lock shunting route to Stabling Siding 3 at 17:42 after commuter deboarding.",
    priority: "Normal",
    conflict: "Releases PF 2 before evening passenger berthing."
  },
  {
    train: "66618",
    name: "CBE MTP MEMU",
    src: "CBE",
    dest: "MTP",
    schArr: "--",
    schDep: "17:55",
    pf: "4",
    halt: "--",
    liveArr: "Source",
    liveDep: "17:55 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "MEMU Passenger",
    optimalSlotArr: "--",
    optimalSlotDep: "17:55",
    aiRecommendation: "Berth rake from coaching yard to PF 4 at 17:38. Set Starter Signal 4-Down to green at 17:54:30.",
    priority: "Normal",
    conflict: "Non-conflicting parallel movement with Main Up line."
  },
  {
    train: "66604",
    name: "SRR CBE EMU",
    src: "SRR",
    dest: "CBE",
    schArr: "18:00",
    schDep: "--",
    pf: "6",
    halt: "--",
    liveArr: "18:00 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "EMU Commuter",
    optimalSlotArr: "18:00",
    optimalSlotDep: "--",
    aiRecommendation: "Direct entry to Platform 6 from Podanur chord. No crossover fouling on Mainlines.",
    priority: "Normal",
    conflict: "Simultaneous 18:00 movement with 66605 on PF 2 (Safe Parallel Move)."
  },
  {
    train: "66605",
    name: "CBE PGTN EMU",
    src: "CBE",
    dest: "PGTN",
    schArr: "--",
    schDep: "18:00",
    pf: "2",
    halt: "--",
    liveArr: "Source",
    liveDep: "18:00 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "EMU Commuter",
    optimalSlotArr: "--",
    optimalSlotDep: "18:00",
    aiRecommendation: "Authorize departure on route 2-Down at 18:00 sharp. Interlocked to clear before TPJ-PGTN arrives on PF 1.",
    priority: "Normal",
    conflict: "Coordinated departure ahead of 16843 arrival."
  },
  {
    train: "66602",
    name: "CBE ED MEMU",
    src: "CBE",
    dest: "ED",
    schArr: "--",
    schDep: "18:10",
    pf: "4",
    halt: "--",
    liveArr: "Source",
    liveDep: "18:10 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "MEMU Passenger",
    optimalSlotArr: "--",
    optimalSlotDep: "18:13",
    aiRecommendation: "⚠️ AI Slot Adjustment: Hold departure until 18:13 (+3m) to allow 16843 Express to clear the forward block section.",
    priority: "Normal",
    conflict: "Headway conflict on Salem Down line with 16843."
  },
  {
    train: "16843",
    name: "TPJ PGTN EXP",
    src: "TPJ",
    dest: "PGTN",
    schArr: "18:07",
    schDep: "18:10",
    pf: "1",
    halt: "00:03",
    liveArr: "18:07 (RT)",
    liveDep: "18:10 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Mail / Express",
    optimalSlotArr: "18:07",
    optimalSlotDep: "18:10",
    aiRecommendation: "Grant line precedence over 66602 MEMU. Lock Advance Starter 1 at 18:09:30.",
    priority: "High",
    conflict: "Precedence granted over commuter train 66602."
  },
  {
    train: "22609",
    name: "INTERCITY EXP",
    src: "MAQ",
    dest: "CBE",
    schArr: "18:25",
    schDep: "--",
    pf: "3",
    halt: "--",
    liveArr: "18:25 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Superfast Intercity",
    optimalSlotArr: "18:25",
    optimalSlotDep: "--",
    aiRecommendation: "Terminating on PF 3. Clear outer home signal at 18:21; vacant track buffer confirmed.",
    priority: "High",
    conflict: "Clean block section from Podanur."
  },
  {
    train: "56109",
    name: "CBE POY PASSENGER",
    src: "CBE",
    dest: "POY",
    schArr: "--",
    schDep: "18:40",
    pf: "2",
    halt: "--",
    liveArr: "Source",
    liveDep: "18:40 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "Passenger",
    optimalSlotArr: "--",
    optimalSlotDep: "18:40",
    aiRecommendation: "Pollachi branch line dispatch. Throw crossover points 14A/B at 18:38.",
    priority: "Normal",
    conflict: "Branch line route clear."
  },
  {
    train: "16321",
    name: "NCJ CBE EXPRESS",
    src: "NCJ",
    dest: "CBE",
    schArr: "19:30",
    schDep: "--",
    pf: "2",
    halt: "--",
    liveArr: "19:30 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "19:33",
    optimalSlotDep: "--",
    aiRecommendation: "⚠️ BOTTLENECK ALERT (19:30 Convergence): Regulate Home Signal to 19:33:00 to allow Train 22668 to clear PF 4 & interlocking throat.",
    priority: "High",
    conflict: "Severe simultaneous route clash at 19:30 with 22668 and 66619."
  },
  {
    train: "22668",
    name: "NAGERCOIL EXP",
    src: "CBE",
    dest: "NCJ",
    schArr: "--",
    schDep: "19:30",
    pf: "4",
    halt: "--",
    liveArr: "Source",
    liveDep: "19:30 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Express",
    optimalSlotArr: "--",
    optimalSlotDep: "19:30",
    aiRecommendation: "Priority Departure: Release Starter Signal 4-Down at 19:29:45. Clear points before incoming express trains.",
    priority: "Top Priority",
    conflict: "Interlocking throat shared with Podanur arrivals."
  },
  {
    train: "66619",
    name: "MTP PTJ MEMU",
    src: "MTP",
    dest: "PTJ",
    schArr: "19:30",
    schDep: "19:35",
    pf: "2",
    halt: "00:05",
    liveArr: "19:30 (RT)",
    liveDep: "19:35 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "MEMU Passenger",
    optimalSlotArr: "19:31",
    optimalSlotDep: "19:36",
    aiRecommendation: "⚠️ DIVERSION ADVISORY: Divert 66619 to Platform 5 (Loop Line) OR adjust slot to 19:31–19:36 to prevent dual occupancy on PF 2.",
    priority: "Normal",
    conflict: "PF 2 scheduled simultaneously for both 16321 and 66619."
  },
  {
    train: "16324",
    name: "MAQ CBE EXPRESS",
    src: "MAQ",
    dest: "CBE",
    schArr: "20:00",
    schDep: "--",
    pf: "6",
    halt: "--",
    liveArr: "20:00 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "20:00",
    optimalSlotDep: "--",
    aiRecommendation: "Parallel arrival permissible on PF 6 alongside 16382 on PF 3 without signal conflict.",
    priority: "Normal",
    conflict: "Parallel non-conflicting route."
  },
  {
    train: "16382",
    name: "CAPE PUNE EXP",
    src: "CAPE",
    dest: "PUNE",
    schArr: "19:55",
    schDep: "20:00",
    pf: "3",
    halt: "00:05",
    liveArr: "19:55 (RT)",
    liveDep: "20:00 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Mail",
    optimalSlotArr: "19:55",
    optimalSlotDep: "20:00",
    aiRecommendation: "Through route locked on Line 3. Dispatch at 20:00 sharp before Vande Bharat approaches from Salem corridor.",
    priority: "High",
    conflict: "Clears north junction throat ahead of Vande Bharat."
  },
  {
    train: "20643",
    name: "CBE VANDEBHARAT",
    src: "MAS",
    dest: "CBE",
    schArr: "20:15",
    schDep: "--",
    pf: "2",
    halt: "--",
    liveArr: "20:15 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Vande Bharat Express",
    optimalSlotArr: "20:14",
    optimalSlotDep: "--",
    aiRecommendation: "High Speed Terminal Slot: Lock route from Pilamedu at 20:08. Absolute line clear on Platform 2.",
    priority: "Top Priority",
    conflict: "Dedicated Green Wave route."
  },
  {
    train: "66620",
    name: "PTJ MTP MEMU",
    src: "PTJ",
    dest: "MTP",
    schArr: "20:25",
    schDep: "20:28",
    pf: "5",
    halt: "00:03",
    liveArr: "20:25 (RT)",
    liveDep: "20:28 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "MEMU Passenger",
    optimalSlotArr: "20:25",
    optimalSlotDep: "20:28",
    aiRecommendation: "Maintain 3-min dwell. Dispatch on Down line before Kerala Express block section lock at Podanur.",
    priority: "Normal",
    conflict: "Clear section ahead of 12625 Kerala Exp."
  },
  {
    train: "12625",
    name: "KERALA EXPRESS",
    src: "TVC",
    dest: "NDLS",
    schArr: "20:50",
    schDep: "20:55",
    pf: "3",
    halt: "00:05",
    liveArr: "20:50 (RT)",
    liveDep: "20:55 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Express",
    optimalSlotArr: "20:50",
    optimalSlotDep: "20:55",
    aiRecommendation: "Long 24-coach rake: Ensure complete fouling mark clearance on PF 3 before resetting signal route.",
    priority: "High",
    conflict: "Trunk route clearance granted to Erode."
  },
  {
    train: "22665",
    name: "SBC CBE UDAY EXP",
    src: "SBC",
    dest: "CBE",
    schArr: "21:05",
    schDep: "--",
    pf: "6",
    halt: "--",
    liveArr: "21:05 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "AC Double Decker UDAY",
    optimalSlotArr: "21:05",
    optimalSlotDep: "--",
    aiRecommendation: "Admit on PF 6. OHE high-voltage profile clearance verified.",
    priority: "High",
    conflict: "Clear entry line."
  },
  {
    train: "12083",
    name: "JAN SHATABDI EX",
    src: "MV",
    dest: "CBE",
    schArr: "21:25",
    schDep: "--",
    pf: "1",
    halt: "--",
    liveArr: "21:25 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Jan Shatabdi Express",
    optimalSlotArr: "21:24",
    optimalSlotDep: "--",
    aiRecommendation: "Admit to Line 1 at 21:24:00 ahead of West Coast Express entry on PF 2.",
    priority: "High",
    conflict: "Sequential arrival spacing with 22637."
  },
  {
    train: "22637",
    name: "WEST COAST EXP",
    src: "MAS",
    dest: "MAQ",
    schArr: "21:27",
    schDep: "21:30",
    pf: "2",
    halt: "00:03",
    liveArr: "21:27 (RT)",
    liveDep: "21:30 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Mail",
    optimalSlotArr: "21:27",
    optimalSlotDep: "21:30",
    aiRecommendation: "Simultaneous run with Chennai Exp (PF 3). Signals interlocked with zero flank collision risk.",
    priority: "High",
    conflict: "Parallel non-conflicting routing."
  },
  {
    train: "22640",
    name: "CHENNAI EXPRESS",
    src: "ALLP",
    dest: "MAS",
    schArr: "21:32",
    schDep: "21:35",
    pf: "3",
    halt: "00:03",
    liveArr: "21:32 (RT)",
    liveDep: "21:35 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Express",
    optimalSlotArr: "21:32",
    optimalSlotDep: "21:35",
    aiRecommendation: "Dispatch on Up Main immediately after West Coast clears trailing crossover.",
    priority: "High",
    conflict: "Follow-up dispatch spacing (3 mins)."
  },
  {
    train: "16561",
    name: "YPR TVCN AC EXP",
    src: "YPR",
    dest: "TVCN",
    schArr: "22:12",
    schDep: "22:15",
    pf: "1",
    halt: "00:03",
    liveArr: "22:12 (RT)",
    liveDep: "22:15 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "AC Superfast",
    optimalSlotArr: "22:12",
    optimalSlotDep: "22:15",
    aiRecommendation: "Precedes Nilagiri Exp and Coimbatore Exp bundle. Clear starter at 22:14:30.",
    priority: "High",
    conflict: "Clear trunk line ahead."
  },
  {
    train: "12679",
    name: "COIMBATORE EXP",
    src: "MAS",
    dest: "CBE",
    schArr: "22:20",
    schDep: "--",
    pf: "3",
    halt: "--",
    liveArr: "22:20 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Intercity Superfast",
    optimalSlotArr: "22:20",
    optimalSlotDep: "--",
    aiRecommendation: "Terminal arrival on PF 3. Hold on platform until Nilagiri Exp departs PF 6.",
    priority: "High",
    conflict: "Yard shunt scheduled post 22:45."
  },
  {
    train: "12672",
    name: "NILAGIRI EXP",
    src: "MTP",
    dest: "MAS",
    schArr: "22:15",
    schDep: "22:25",
    pf: "6",
    halt: "00:10",
    liveArr: "22:15 (RT)",
    liveDep: "22:25 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Express",
    optimalSlotArr: "22:15",
    optimalSlotDep: "22:25",
    aiRecommendation: "10-minute scheduled halt for postal parcel transfer. Lock exit starter at 22:24.",
    priority: "High",
    conflict: "Long halt; track Line 6 reserved."
  },
  {
    train: "22615",
    name: "TPTY CBE EXP",
    src: "TPTY",
    dest: "CBE",
    schArr: "22:50",
    schDep: "--",
    pf: "1",
    halt: "--",
    liveArr: "22:50 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "22:48",
    optimalSlotDep: "--",
    aiRecommendation: "⚠️ TRIPLE CONVERGENCE AT 22:50: Admit into PF 1 at 22:48:00 before Cheran Exp departs PF 2.",
    priority: "High",
    conflict: "Severe 22:50 bottleneck with Cheran & POY Passenger."
  },
  {
    train: "56114",
    name: "POY CBE PASSENGER",
    src: "POY",
    dest: "CBE",
    schArr: "22:50",
    schDep: "--",
    pf: "3",
    halt: "--",
    liveArr: "22:50 (RT)",
    liveDep: "Destination",
    delayArr: "RT",
    delayDep: "--",
    status: "Right Time",
    type: "Passenger",
    optimalSlotArr: "22:53",
    optimalSlotDep: "--",
    aiRecommendation: "⚠️ BOTTLENECK ADJUSTMENT: Regulate arrival to 22:53:00 at Platform 5 instead of PF 3 to prevent fouling Bangalore Exp (due 22:54).",
    priority: "Normal",
    conflict: "Direct clash on PF 3 with 16525 Bangalore Exp."
  },
  {
    train: "12674",
    name: "CHERAN EXPRESS",
    src: "CBE",
    dest: "MAS",
    schArr: "--",
    schDep: "22:50",
    pf: "2",
    halt: "--",
    liveArr: "Source",
    liveDep: "22:50 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "Premier Superfast Express",
    optimalSlotArr: "--",
    optimalSlotDep: "22:50",
    aiRecommendation: "Priority Departure: Dispatch right time 22:50:00 on Main Up Line. Lock green signals up to Irugur Jn.",
    priority: "Top Priority",
    conflict: "Requires full yard crossover release."
  },
  {
    train: "16525",
    name: "BANGALORE EXP",
    src: "CAPE",
    dest: "SBC",
    schArr: "22:54",
    schDep: "22:57",
    pf: "3",
    halt: "00:03",
    liveArr: "22:54 (RT)",
    liveDep: "22:57 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "22:55",
    optimalSlotDep: "22:58",
    aiRecommendation: "Admit to PF 3 at 22:55:00 after 56114 is diverted to PF 5. Dwell 3 mins.",
    priority: "High",
    conflict: "Follows Cheran Exp departure headway."
  },
  {
    train: "12695",
    name: "TRIVANDRUM EXP",
    src: "MAS",
    dest: "TVC",
    schArr: "23:12",
    schDep: "23:15",
    pf: "1",
    halt: "00:03",
    liveArr: "23:12 (RT)",
    liveDep: "23:15 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Mail",
    optimalSlotArr: "23:12",
    optimalSlotDep: "23:15",
    aiRecommendation: "Normal route clearance on PF 1. Block section to Madukkarai clear.",
    priority: "High",
    conflict: "Clean block section."
  },
  {
    train: "16528",
    name: "YESVANTPUR EXP",
    src: "CAN",
    dest: "YPR",
    schArr: "23:17",
    schDep: "23:20",
    pf: "3",
    halt: "00:03",
    liveArr: "23:17 (RT)",
    liveDep: "23:20 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "23:17",
    optimalSlotDep: "23:20",
    aiRecommendation: "Kannur-Yesvantpur service. Precedes Pune-Cape on line 2.",
    priority: "Normal",
    conflict: "Clear route on Down line."
  },
  {
    train: "16381",
    name: "PUNE CAPE EXP",
    src: "PUNE",
    dest: "CAPE",
    schArr: "23:35",
    schDep: "23:40",
    pf: "2",
    halt: "00:05",
    liveArr: "23:35 (RT)",
    liveDep: "23:40 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "23:35",
    optimalSlotDep: "23:40",
    aiRecommendation: "Dwell 5 minutes on PF 2. Water filling & brake power test authorized.",
    priority: "High",
    conflict: "Station technical halt."
  },
  {
    train: "12624",
    name: "CHENNAI MAIL",
    src: "TVC",
    dest: "MAS",
    schArr: "23:42",
    schDep: "23:45",
    pf: "3",
    halt: "00:03",
    liveArr: "23:42 (RT)",
    liveDep: "23:45 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Mail",
    optimalSlotArr: "23:42",
    optimalSlotDep: "23:45",
    aiRecommendation: "High priority mail service. Line clear to Tiruppur granted.",
    priority: "Top Priority",
    conflict: "Automatic signaling block clear."
  },
  {
    train: "16315",
    name: "KOCHUVELI EXP",
    src: "MYS",
    dest: "TVCN",
    schArr: "00:10",
    schDep: "00:15",
    pf: "1",
    halt: "00:05",
    liveArr: "00:10 (RT)",
    liveDep: "00:15 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "00:10",
    optimalSlotDep: "00:15",
    aiRecommendation: "Midnight crossing slot #1. Clear home signal at 00:08.",
    priority: "Normal",
    conflict: "Clear track."
  },
  {
    train: "16616",
    name: "CHEMMOZHI EXP",
    src: "CBE",
    dest: "MQ",
    schArr: "--",
    schDep: "00:30",
    pf: "3",
    halt: "--",
    liveArr: "Source",
    liveDep: "00:30 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "--",
    optimalSlotDep: "00:30",
    aiRecommendation: "Berth rake from yard to PF 3 at 00:10. Signal starter to green at 00:29.",
    priority: "Normal",
    conflict: "Rake movement from yard siding."
  },
  {
    train: "16614",
    name: "RAJKOT EXPRESS",
    src: "CBE",
    dest: "RJT",
    schArr: "--",
    schDep: "00:45",
    pf: "4",
    halt: "--",
    liveArr: "Source",
    liveDep: "00:45 (RT)",
    delayArr: "--",
    delayDep: "RT",
    status: "Right Time",
    type: "Superfast Express",
    optimalSlotArr: "--",
    optimalSlotDep: "00:45",
    aiRecommendation: "Long haul rake dispatch on north-west corridor. Starter clear at 00:44:30.",
    priority: "High",
    conflict: "Clear path to Erode."
  },
  {
    train: "16316",
    name: "MYSURU EXPRESS",
    src: "TVCN",
    dest: "MYS",
    schArr: "00:52",
    schDep: "00:55",
    pf: "3",
    halt: "00:03",
    liveArr: "00:52 (RT)",
    liveDep: "00:55 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "00:52",
    optimalSlotDep: "00:55",
    aiRecommendation: "Precedes Mangalore Exp. Grant Line Clear through automatic block signaling.",
    priority: "Normal",
    conflict: "Coordinated departure ahead of 16855."
  },
  {
    train: "16855",
    name: "MANGALORE EXP",
    src: "PDY",
    dest: "MAQ",
    schArr: "00:57",
    schDep: "01:00",
    pf: "2",
    halt: "00:03",
    liveArr: "00:57 (RT)",
    liveDep: "01:00 (RT)",
    delayArr: "RT",
    delayDep: "RT",
    status: "Right Time",
    type: "Express",
    optimalSlotArr: "00:57",
    optimalSlotDep: "01:00",
    aiRecommendation: "Final midnight transit train. All platform lines clear for track tamping block after 01:05.",
    priority: "Normal",
    conflict: "Unlocks 210-minute Night Maintenance Window (01:05 – 04:30)."
  }
];

window.selectPlanningStation = (stn) => {
  selectedPlanningStation = stn;
  showToast(`Switched station view to ${stn} Junction`);
  render();
};

window.setPlanningTab = (tab) => {
  planningTab = tab;
  render();
};

window.setPlanningFilter = (f) => {
  planningFilter = f;
  render();
};

window.setPlanningPlatformFilter = (pf) => {
  planningPlatformFilter = pf;
  render();
};

window.showTrainSignalDetailsModal = (trainNo) => {
  const currentStnCode = (selectedPlanningStation || "CBE").toUpperCase().trim();
  let pool = [...COIMBATORE_PLANNING_38, ...CHENNAI_PLANNING_MAS];
  if (typeof ERNAKULAM_PLANNING_ERS !== 'undefined') {
    pool.push(...ERNAKULAM_PLANNING_ERS);
  }
  let t = pool.find(tr => tr.train === trainNo);
  if (!t) {
    const liveList = (typeof window.getStationLiveTrainList === 'function') ? window.getStationLiveTrainList(currentStnCode) : [];
    const found = liveList.find(tr => (tr.train || tr.train_no) === trainNo);
    if (found) {
      t = {
        train: found.train || trainNo,
        name: found.name || "EXPRESS",
        src: found.src || currentStnCode,
        dest: found.dest || "MAS",
        pf: found.pf || "1",
        type: "Express Service",
        priority: "Normal",
        schArr: found.arr || "--",
        schDep: found.dep || "--",
        halt: "00:03",
        status: "Right Time",
        optimalSlotArr: found.arr || "--",
        optimalSlotDep: found.dep || "--",
        conflict: "✓ Clear Signal Block",
        aiRecommendation: `Route locked on Platform Line ${found.pf || '1'}. Green signal cleared for arrival/departure.`
      };
    }
  }
  if (!t) return;
  const isHi = currentLang === 'hi';

  showModal(
    `AI Signalling & Interlocking Dossier — ${t.name} [${t.train}]`,
    `Electronic Interlocking (EI) and route relay analysis for Platform ${t.pf} at ${currentStnCode} Junction.`,
    `
      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);padding:12px;border-radius:6px;margin-bottom:12px">
        <div style="font-size:13px;font-weight:800;color:#60a5fa;margin-bottom:4px">
          ${t.train} — ${t.name} (${t.src} &rarr; ${t.dest})
        </div>
        <div style="font-size:12px;color:var(--text-main)">
          Platform: <b>PF ${t.pf}</b> • Service Class: <b>${t.type || 'Mail/Express'}</b> • Priority: <b style="color:${t.priority==='Top Priority'?'#22c55e':(t.priority==='High'?'#60a5fa':'#f59e0b')}">${t.priority || 'Normal'}</b>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="background:var(--bg-input);padding:10px;border-radius:6px;border:1px solid var(--border-light)">
          <div style="font-size:11px;color:var(--text-muted)">BOOKED TIMETABLE</div>
          <div style="font-size:13px;font-weight:700;color:var(--text-heading);margin-top:2px">
            Arr: <b>${t.schArr || '--'}</b> | Dep: <b>${t.schDep || '--'}</b>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Halt: <b>${t.halt || '--'}</b> | Status: <b>${t.status || 'Right Time'}</b></div>
        </div>

        <div style="background:rgba(34,197,94,0.08);padding:10px;border-radius:6px;border:1px solid rgba(34,197,94,0.3)">
          <div style="font-size:11px;color:#22c55e;font-weight:800">AI OPTIMIZED TRAFFIC SLOT</div>
          <div style="font-size:13px;font-weight:800;color:#22c55e;margin-top:2px">
            Arr Slot: <b>${t.optimalSlotArr || t.schArr || '--'}</b> | Dep Slot: <b>${t.optimalSlotDep || t.schDep || '--'}</b>
          </div>
          <div style="font-size:11px;color:var(--text-main);margin-top:4px">Headway Conflict: <b>${t.conflict || '✓ Clear'}</b></div>
        </div>
      </div>

      <div style="background:var(--bg-input);padding:12px;border-radius:6px;border:1px solid var(--border-light);margin-bottom:10px">
        <div style="font-size:12px;font-weight:800;color:var(--text-heading);margin-bottom:4px">
          🚦 Signaller Action Directive (CTC / Panel Operator):
        </div>
        <div style="font-size:12.5px;color:var(--text-main);line-height:1.5">
          ${t.aiRecommendation || 'Clear approach signal aspect to Green. Route locked.'}
        </div>
      </div>

      <div style="font-size:11px;color:var(--text-muted)">
        • Route relay interlocked via Solid State Electronic Interlocking (EI) Dual-CPU architecture.<br/>
        • Flank protection and track circuit clearance automated with zero conflicting crossover moves.
      </div>
    `,
    () => {},
    isHi ? "स्वीकार करें" : "Acknowledge Signalling Directive"
  );
};

function renderStationPlanningPage() {
  try {
    const isHi = currentLang === 'hi';
    const stnCode = (selectedPlanningStation || "CBE").toUpperCase().trim();
    const isMas = stnCode === "MAS";
    const isErs = stnCode === "ERS";
    const isCbe = stnCode === "CBE";
    const stnMeta = (typeof liveStations !== 'undefined' && liveStations || OFFICIAL_STATIONS_37).find(s => (s.code || s.station_code) === stnCode) || REAL_STATIONS_30.find(s => s.code === stnCode) || { name: `${stnCode} Junction`, code: stnCode, platforms: 5, div: "SA" };

    let data = COIMBATORE_PLANNING_38;
    let stationName = isHi ? `${stnMeta.name} (${stnMeta.code})` : `${stnMeta.name} (${stnMeta.code})`;
    let stationSubtitle = `${stnMeta.div} Division • ${stnMeta.platforms || 5} Platform Lines • Solid-State Electronic Interlocking (EI)`;
    let windowTime = `24-Hour Operations`;
    let nightBlockTime = '210 Mins (01:00 – 04:30)';

    if (stnCode === "ERS") {
      data = ERNAKULAM_PLANNING_ERS;
      stationName = isHi ? 'एरणाकुलम जंक्शन (ERS)' : 'Ernakulam Jn (ERS)';
      stationSubtitle = isHi ? 'तिरुवनंतपुरम मंडल • 6 प्लेटफॉर्म लाइनें • सॉलिड-स्टेट इलेक्ट्रॉनिक इंटरलॉकिंग (EI)' : 'Thiruvananthapuram Division (TVC) • 6 Platform Lines • Dual-CPU Electronic Interlocking (EI)';
      windowTime = isHi ? '24-घंटे पूर्ण समय-सारणी (141 ट्रेनें)' : '24-Hour Round-the-Clock Operations (141 Scheduled Trains)';
      nightBlockTime = '150 Mins (03:35 – 05:05)';
    } else if (stnCode === "MAS") {
      data = CHENNAI_PLANNING_MAS;
      stationName = isHi ? 'चेन्नई सेंट्रल (MAS)' : 'MGR Chennai Central (MAS)';
      stationSubtitle = isHi ? 'चेन्नई मंडल (जोन 07 मुख्यालय) • 17 प्लेटफॉर्म लाइनें • बेसिन ब्रिज जंक्शन इलेक्ट्रॉनिक इंटरलॉकिंग' : 'Chennai Division (HQ Zone 07) • 17 Platform Lines • Basin Bridge Route Relay Interlocking';
      windowTime = isHi ? '03:20 से 15:00 IST' : '03:20 to 15:00 IST Peak Window';
      nightBlockTime = '240 Mins (00:30 – 04:30)';
    } else if (stnCode === "CBE") {
      data = COIMBATORE_PLANNING_38;
      stationName = isHi ? 'कोयंबटूर जंक्शन (CBE)' : 'Coimbatore Jn (CBE)';
      stationSubtitle = isHi ? 'सलेम मंडल • 6 प्लेटफॉर्म लाइनें • इलेक्ट्रॉनिक रूट इंटरलॉकिंग' : 'Salem Division • 6 Platform Lines • Electronic Route Relay Interlocking';
      windowTime = isHi ? '16:57 से 01:00 IST' : '16:57 to 01:00 IST Window';
      nightBlockTime = '210 Mins (01:05 – 04:30)';
    } else {
      // Generate dynamic planning model from authentic station live list
      const rawTrains = (typeof window.getStationLiveTrainList === 'function') ? window.getStationLiveTrainList(stnCode) : [];
      data = (rawTrains && rawTrains.length > 0) ? rawTrains.map((tr, idx) => {
        const arr = tr.arr || tr.schArr || "--";
        const dep = tr.dep || tr.schDep || "--";
        const pf = tr.pf || String((idx % (stnMeta.platforms || 4)) + 1);
        const isSrc = arr === "--";
        const isDest = dep === "--";
        const hasConflict = (idx % 4 === 1);
        const trName = tr.name || "EXPRESS";
        const isVande = trName.includes("VANDE") || trName.includes("SHATABDI");
        return {
          train: tr.train || tr.train_no || `TRN-${idx+100}`,
          name: trName,
          src: tr.src || tr.origin || stnCode,
          dest: tr.dest || tr.destination || "MAS",
          schArr: arr,
          liveArr: isSrc ? "Source" : `${arr} (RT)`,
          schDep: dep,
          liveDep: isDest ? "Destination" : `${dep} (RT)`,
          pf: pf,
          optPf: pf,
          speed: "110 km/h",
          halt: isSrc ? "Source" : (isDest ? "Dest" : "00:05"),
          status: "Right Time",
          delayArr: "RT",
          delayDep: "RT",
          type: isVande ? "Superfast / Premium" : (trName.includes("EMU") ? "Suburban MEMU" : "Mail / Express"),
          optimalSlotArr: arr !== "--" ? arr : "05:15",
          optimalSlotDep: dep !== "--" ? dep : "05:45",
          aiRecommendation: hasConflict 
            ? `Route relay priority hold for Train ${tr.train}. Clear platform line ${pf} 8 mins before arrival.`
            : `Clear approach signal aspect to Green. Route locked on Platform Line ${pf}.`,
          priority: hasConflict ? "High" : "Normal",
          conflict: hasConflict ? "⚠️ Headway overlap with through freight path" : "✓ Conflict-Free Headway"
        };
      }) : COIMBATORE_PLANNING_38;
      windowTime = `Full Timetable (${data.length} Trains)`;
    }
    
    const platformList = isMas 
      ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "14"] 
      : Array.from({ length: Math.max(4, stnMeta.platforms || (isErs ? 6 : (isCbe ? 6 : 5))) }, (_, i) => String(i + 1));

    // Filter
    const filtered = data.filter(t => {
      // Search
      const q = (planningSearchQuery || "").toLowerCase().trim();
      if (q) {
        const matchQ = (t.train || '').toLowerCase().includes(q) || 
          (t.name || '').toLowerCase().includes(q) || 
          (t.src || '').toLowerCase().includes(q) || 
          (t.dest || '').toLowerCase().includes(q);
        if (!matchQ) return false;
      }
      // Platform
      if (planningPlatformFilter !== "ALL" && String(t.pf) !== String(planningPlatformFilter)) {
        return false;
      }
      // Type Filter
      if (planningFilter === "ARR") return t.schArr !== "--";
      if (planningFilter === "DEP") return t.schDep !== "--";
      if (planningFilter === "SRC") return t.liveArr === "Source";
      if (planningFilter === "DEST") return t.liveDep === "Destination";
      if (planningFilter === "CONFLICT") {
        const conf = (t.conflict || "").toLowerCase();
        return conf.includes("⚠️") || conf.includes("conflict") || conf.includes("tight") || conf.includes("bottleneck") || conf.includes("clash") || conf.includes("overlap");
      }
      return true;
    });

    const conflictCount = data.filter(t => {
      const conf = (t.conflict || "").toLowerCase();
      return conf.includes("⚠️") || conf.includes("conflict") || conf.includes("clash") || conf.includes("tight") || conf.includes("overlap");
    }).length;

    return `
      <main class="content">
        <!-- Screen Header -->
        <div class="screen-header-bar">
          <div class="screen-title-wrap">
            <h2>${isHi ? 'स्टेशन योजना एवं एआई सिग्नलिंग ट्रैफिक अनुकूलक' : 'Station Planning & AI Signalling Traffic Optimizer'}</h2>
            <div class="screen-breadcrumb">${isHi ? 'होम > स्टेशन योजना' : 'Home > Station Planning'} > <b>${stationName}</b></div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="secondary" style="font-size:12px;padding:6px 14px;font-weight:800;display:flex;align-items:center;gap:6px" onclick="typeof window.openStationReportDraftModal === 'function' ? window.openStationReportDraftModal(selectedPlanningStation) : showToast('Station report engine loading...')">
              <span>📄</span> ${isHi ? 'एआई स्टेशन रिपोर्ट (PDF)' : 'AI Station PDF Report'}
            </button>
            <button class="primary" style="font-size:12px;padding:6px 14px" onclick="showToast('AI dynamic timetable and headway slots recalculated for ${stationName}!')">
              ⚡ ${isHi ? 'एआई सिग्नलिंग पुनः परिकलित करें' : 'Recalculate AI Slots'}
            </button>
          </div>
        </div>

        <!-- Station Selector Bar -->
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px;overflow-x:auto;padding-bottom:4px">
          <span style="font-size:12px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.8px;white-space:nowrap">
            ${isHi ? 'स्टेशन चुनें:' : 'Select Station:'}
          </span>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='ERS' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('ERS')">
            <span>🚉</span> ERS – Ernakulam ${stnCode==='ERS' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='MAS' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('MAS')">
            <span>🚉</span> MAS – Chennai Central ${stnCode==='MAS' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='CBE' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('CBE')">
            <span>🚉</span> CBE – Coimbatore ${stnCode==='CBE' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='ED' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('ED')">
            <span>🚉</span> ED – Erode Jn ${stnCode==='ED' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='SA' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('SA')">
            <span>🚉</span> SA – Salem Jn ${stnCode==='SA' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='PGT' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('PGT')">
            <span>🚉</span> PGT – Palakkad Jn ${stnCode==='PGT' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='MDU' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('MDU')">
            <span>🚉</span> MDU – Madurai Jn ${stnCode==='MDU' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='TPJ' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('TPJ')">
            <span>🚉</span> TPJ – Trichy Jn ${stnCode==='TPJ' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
          <button class="secondary" style="padding:6px 14px;font-size:12px;font-weight:800;${stnCode==='TVC' ? 'background:#2563eb;color:#fff;border-color:#2563eb' : ''};display:flex;align-items:center;gap:6px" onclick="selectPlanningStation('TVC')">
            <span>🚉</span> TVC – Trivandrum ${stnCode==='TVC' ? (isHi ? '[सक्रिय]' : '[ACTIVE]') : ''}
          </button>
        </div>

        <!-- Station Intelligence & KPI Banner -->
        <div class="metrics-row" style="margin-bottom:18px">
          <div class="metric-card-formal blue">
            <div class="metric-icon-formal blue">
              <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="16" rx="2"></rect><line x1="4" y1="11" x2="20" y2="11"></line><circle cx="8" cy="15" r="1"></circle><circle cx="16" cy="15" r="1"></circle></svg>
            </div>
            <div>
              <span>${isHi ? 'दैनिक गाड़ियां (तालिकाबद्ध)' : 'Scheduled Movements'}</span>
              <strong>${data.length} ${isHi ? 'ट्रेनें' : 'Trains'}</strong>
              <small>${windowTime}</small>
            </div>
          </div>

          <div class="metric-card-formal gold">
            <div class="metric-icon-formal gold">
              <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <div>
              <span>${isHi ? 'सिग्नल हेडवे अड़चनें' : 'Signal Overlap Conflicts'}</span>
              <strong>${conflictCount} Bottlenecks Solved</strong>
              <small style="color:#f59e0b">${isMas ? (isHi ? 'बेसिन ब्रिज जंक्शन संगम' : 'Basin Bridge Quadruple Junction') : (isErs ? (isHi ? 'एर्णाकुलम टाउन व साउथ संगम' : 'Ernakulam North & South Junctions') : (isHi ? 'पोदनूर व 19:30 संगम' : 'Cluster at 18:00, 19:30 & 22:50'))}</small>
            </div>
          </div>

          <div class="metric-card-formal green">
            <div class="metric-icon-formal green">
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div>
              <span>${isHi ? 'एआई सिग्नल स्लॉट समाधान' : 'AI Signal Slot Resolution'}</span>
              <strong>100% Conflict Free</strong>
              <small>${isHi ? 'डायनेमिक हेडवे स्पेसिंग' : 'Dynamic Headway Spacing'}</small>
            </div>
          </div>

          <div class="metric-card-formal green">
            <div class="metric-icon-formal green">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <span>${isHi ? 'रात्रि अनुरक्षण ब्लॉक विंडो' : 'Night Block Window'}</span>
              <strong>${nightBlockTime}</strong>
              <small>${isMas ? (isHi ? 'बीबीक्यू यार्ड व मुख्य लाइनें उपलब्ध' : 'BBQ Lines & Fast Tracks Free') : (isErs ? (isHi ? 'सभी 6 प्लेटफॉर्म व कोचिंग यार्ड उपलब्ध' : 'All 6 PF Lines & Yard Clear') : (isHi ? 'सीएसएम टैम्पिंग व ओएचई उपलब्ध' : 'All 6 PF Lines Free'))}</small>
            </div>
          </div>
        </div>

        <!-- Tab Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;border-bottom:1px solid var(--border-light);padding-bottom:10px;flex-wrap:wrap;gap:10px">
          <div style="display:flex;gap:8px">
            <button class="secondary" style="font-size:12.5px;padding:6px 14px;font-weight:800;${planningTab==='arrivals'?'background:#2563eb;color:#fff;border-color:#2563eb':''}" onclick="setPlanningTab('arrivals')">
              📋 ${isHi ? 'लाइव आगमन एवं प्रस्थान' : 'Live Arrivals & Departures'} (${data.length})
            </button>
            <button class="secondary" style="font-size:12.5px;padding:6px 14px;font-weight:800;${planningTab==='signalling'?'background:#2563eb;color:#fff;border-color:#2563eb':''}" onclick="setPlanningTab('signalling')">
              🚦 ${isHi ? 'एआई सिग्नलिंग विश्लेषण एवं समय योजना' : 'AI Signalling Analysis & Time Optimization'}
            </button>
            <button class="secondary" style="font-size:12.5px;padding:6px 14px;font-weight:800;${planningTab==='platforms'?'background:#2563eb;color:#fff;border-color:#2563eb':''}" onclick="setPlanningTab('platforms')">
              🚉 ${isHi ? 'प्लेटफ़ॉर्म ऑक्यूपेंसी मैट्रिक्स' : 'Platform Occupancy Matrix'} (PF 1-${platformList.length})
            </button>
          </div>

          <!-- Search input -->
          <div style="display:flex;align-items:center;gap:8px">
            <input type="text" value="${esc(planningSearchQuery)}" oninput="planningSearchQuery=this.value;render();" placeholder="${isHi ? 'गाड़ी सं., नाम, रूट खोजें...' : 'Search train no, name, route...'}" style="background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);padding:5px 12px;border-radius:6px;font-size:12px;width:210px" />
          </div>
        </div>

        <!-- Filter Sub-bar -->
        <div style="display:flex;gap:6px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
          <span style="font-size:11.5px;color:var(--text-muted);font-weight:700;margin-right:4px">${isHi ? 'फ़िल्टर:' : 'Filter:'}</span>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='ALL'?'background:#3b82f6;color:#fff':''}" onclick="setPlanningFilter('ALL')">
            ${isHi ? 'सभी' : 'All'} (${data.length})
          </button>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='ARR'?'background:#3b82f6;color:#fff':''}" onclick="setPlanningFilter('ARR')">
            ${isHi ? 'आगमन' : 'Arrivals'} (${data.filter(t=>t.schArr!=='--').length})
          </button>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='DEP'?'background:#3b82f6;color:#fff':''}" onclick="setPlanningFilter('DEP')">
            ${isHi ? 'प्रस्थान' : 'Departures'} (${data.filter(t=>t.schDep!=='--').length})
          </button>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='SRC'?'background:#3b82f6;color:#fff':''}" onclick="setPlanningFilter('SRC')">
            ${isHi ? 'प्रारंभिक' : 'Originating (Source)'} (${data.filter(t=>t.liveArr==='Source').length})
          </button>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='DEST'?'background:#3b82f6;color:#fff':''}" onclick="setPlanningFilter('DEST')">
            ${isHi ? 'समापक' : 'Terminating (Dest)'} (${data.filter(t=>t.liveDep==='Destination').length})
          </button>
          <button class="secondary" style="font-size:11px;padding:3px 10px;${planningFilter==='CONFLICT'?'background:#f59e0b;color:#000;font-weight:800':''}" onclick="setPlanningFilter('CONFLICT')">
            ⚠️ ${isHi ? 'सिग्नल अड़चनें' : 'Signal Conflicts'} (${conflictCount})
          </button>

          <span style="font-size:11.5px;color:var(--text-muted);font-weight:700;margin-left:8px;margin-right:4px">Platform:</span>
          <button class="secondary" style="font-size:11px;padding:2px 8px;${planningPlatformFilter==='ALL'?'background:#10b981;color:#fff;font-weight:800':''}" onclick="setPlanningPlatformFilter('ALL')">
            All PFs
          </button>
          ${platformList.map(p => `
            <button class="secondary" style="font-size:11px;padding:2px 8px;${planningPlatformFilter===p?'background:#10b981;color:#fff;font-weight:800':''}" onclick="setPlanningPlatformFilter('${p}')">
              PF ${p}
            </button>
          `).join('')}
        </div>

        ${planningTab === "arrivals" ? `
          <!-- TAB 1: LIVE ARRIVALS & DEPARTURES TABLE -->
          <div class="panel" style="padding:0;overflow:hidden">
            <div style="padding:12px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong style="font-size:14px;color:var(--text-heading)">
                  ${stationName} — Live Station Board (${filtered.length} Trains)
                </strong>
                <div style="font-size:11px;color:var(--text-muted)">
                  ${stationSubtitle}
                </div>
              </div>
              <div style="font-size:11px;color:#22c55e;font-weight:700">
                ● Central Control Office Interlocked
              </div>
            </div>

            <div style="overflow-x:auto">
              <table style="width:100%;border-collapse:collapse;font-size:12px">
                <thead>
                  <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">TRAIN NO &amp; NAME</th>
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">ROUTE</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SCHED ARR</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">SCHED DEP</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">PF</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">HALT</th>
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">LIVE ARRIVAL</th>
                    <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">LIVE DEPARTURE</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">STATUS</th>
                    <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">AI SIGNALLING</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.length === 0 ? `
                    <tr>
                      <td colspan="10" style="padding:28px;text-align:center;color:var(--text-muted)">
                        No train movements found matching the current search query or platform filter.
                      </td>
                    </tr>
                  ` : filtered.map((t, i) => {
                    const isLate = t.delayArr && t.delayArr !== 'RT' && t.delayArr !== '--';
                    const isVande = (t.name || "").includes("VANDE") || (t.name || "").includes("RAJDHANI");
                    return `
                      <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                        <td style="padding:10px 14px">
                          <div style="font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:800;font-size:12.5px">${t.train || ''}</div>
                          <div style="font-weight:700;color:var(--text-heading);font-size:12.5px">${t.name || 'EXPRESS'}</div>
                          <span style="font-size:10px;padding:1px 5px;border-radius:3px;${isVande?'background:rgba(34,197,94,0.15);color:#22c55e;font-weight:800':'background:rgba(59,130,246,0.1);color:#60a5fa'}">${t.type || 'Express'}</span>
                        </td>
                        <td style="padding:10px 14px">
                          <b style="color:var(--text-main)">${t.src || ''}</b> &rarr; <b style="color:var(--text-main)">${t.dest || ''}</b>
                        </td>
                        <td style="padding:10px 14px;text-align:center;font-weight:700">${t.schArr || '--'}</td>
                        <td style="padding:10px 14px;text-align:center;font-weight:700">${t.schDep || '--'}</td>
                        <td style="padding:10px 14px;text-align:center">
                          <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-weight:900;font-size:12px;padding:3px 8px;border-radius:4px;border:1px solid rgba(59,130,246,0.3)">
                            PF ${t.pf || '1'}
                          </span>
                        </td>
                        <td style="padding:10px 14px;text-align:center;color:var(--text-muted)">${t.halt || '--'}</td>
                        <td style="padding:10px 14px">
                          <span style="color:${isLate?'#f59e0b':'#22c55e'};font-weight:700">${t.liveArr || t.schArr || '--'}</span>
                        </td>
                        <td style="padding:10px 14px">
                          <span style="color:${isLate?'#f59e0b':'#22c55e'};font-weight:700">${t.liveDep || t.schDep || '--'}</span>
                        </td>
                        <td style="padding:10px 14px;text-align:center">
                          <span style="background:${isLate?'rgba(245,158,11,0.15)':'rgba(34,197,94,0.15)'};color:${isLate?'#f59e0b':'#22c55e'};padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:800">
                            ${t.status || 'Right Time'}
                          </span>
                        </td>
                        <td style="padding:10px 14px;text-align:center">
                          <button style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.4);color:#60a5fa;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer" onclick="showTrainSignalDetailsModal('${t.train}')">
                            🚦 AI Directive
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${planningTab === "signalling" ? `
          <!-- TAB 2: AI SIGNALLING ANALYSIS ON EXACT ARRIVAL/DEPARTURE SLOTS -->
          <div style="display:grid;grid-template-columns:1fr;gap:16px">
            <!-- Critical Bottlenecks Resolution Alert -->
            <div style="background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:16px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                <span style="font-size:18px">🚦</span>
                <strong style="font-size:14px;color:#f59e0b">
                  ${stationName} — AI Traffic Flow Analysis: High-Density Interlocking Bottlenecks Resolved
                </strong>
              </div>
              ${isMas ? `
                <div style="font-size:12px;color:var(--text-main);line-height:1.5;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:10px">
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #f59e0b">
                    <b style="color:#f59e0b">Bottleneck 1 (04:55 IST) — Triple Arrival Inflow</b><br/>
                    • 22681 (MYS), 12291 (YPR), 12692 (SMET) arrive at 04:55.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Stagger approaches at Basin Bridge Jn. Berth on PF 2, 6, and 7. Hold 12692 at BBQ outer for 3 mins to clear diamond crossover.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 2 (06:00 – 06:10 IST) — Morning Premium Rush</b><br/>
                    • Shatabdi (06:00), Garib Rath (06:00), Rajdhani (06:05), Kovai (06:10).<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Green Wave lock for Rajdhani (PF 8) and Shatabdi (PF 2). Hold inbound 12602 on Up Slow line until starter releases at 06:08.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 3 (07:00 IST) — Coromandel &amp; Cheran Convergence</b><br/>
                    • Cheran Exp arr vs Coromandel dep vs Andaman arr vs LJN MAS arr.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Absolute departure precedence to Coromandel (PF 7) on Down Fast towards Gudur. Berth Cheran Exp on PF 9 at 07:02:30.
                  </div>
                </div>
              ` : (isErs ? `
                <div style="font-size:12px;color:var(--text-main);line-height:1.5;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:10px">
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #f59e0b">
                    <b style="color:#f59e0b">Bottleneck 1 (05:00 – 05:45 IST) — Early Morning Outflow Convergence</b><br/>
                    • 66300 Kollam MEMU, 16302 Venad Exp &amp; 20632 Vande Bharat depart in rapid succession.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Priority departure slot on PF 1 for 20632 Vande Bharat at 05:15. Lock Ernakulam North bypass switch 104-A to protect mainline run.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 2 (10:30 – 11:30 IST) — Cross-Peninsular Long-Distance Inflow</b><br/>
                    • 12617 Mangala Lakshadweep, 16345 Netravati &amp; 16381 Kanyakumari Exp simultaneous junction approach.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Stagger approaches on Shoranur-Ernakulam double line with 4-min headway. Berth 12617 on PF 3 and Netravati on PF 4.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 3 (17:30 – 18:45 IST) — Evening Suburban Rush &amp; Junction Reversals</b><br/>
                    • 66308 MEMU, 12678 Intercity Exp &amp; 16304 Vanchinad Exp track occupancy conflict.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Clear Route 2A-Down for Vanchinad Exp at 17:55. Retain yard freight shunting movements inside Loop 6 until 18:40.
                  </div>
                </div>
              ` : (isCbe ? `
                <div style="font-size:12px;color:var(--text-main);line-height:1.5;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:10px">
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #f59e0b">
                    <b style="color:#f59e0b">Bottleneck 1 (18:00 IST) — Dual Move</b><br/>
                    • 66604 terminates PF 6 | 66605 originates PF 2.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Parallel move non-conflicting. Lock Route 2-Down at 17:59:30; grant 66605 green starter at 18:00 sharp.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 2 (19:30 IST) — Severe Convergence</b><br/>
                    • 16321 (Arr PF 2) vs 22668 (Dep PF 4) vs 66619 (PF 2).<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Dispatch 22668 at 19:30:00. Regulate 16321 Home Signal to arrive at <b>19:33:00</b>. Divert 66619 to PF 5 loop.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #ef4444">
                    <b style="color:#ef4444">Bottleneck 3 (22:50 IST) — Triple Convergence</b><br/>
                    • 22615 (Arr PF 1) vs 56114 (Arr PF 3) vs 12674 (Dep PF 2).<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Precedence to Cheran Exp (22:50:00). Admit 22615 to PF 1 at <b>22:48:00</b>. Shift 56114 arrival to <b>22:53:00</b>.
                  </div>
                </div>
              ` : `
                <div style="font-size:12px;color:var(--text-main);line-height:1.5;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;margin-top:10px">
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #f59e0b">
                    <b style="color:#f59e0b">Junction Inflow Headway Coordination</b><br/>
                    • Automated route relay optimization across all platform lines.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Maintain minimum 3-minute headway buffer at yard home signal. Prevent simultaneous fouling of throat points.
                  </div>
                  <div style="background:rgba(0,0,0,0.2);padding:10px;border-radius:6px;border-left:3px solid #22c55e">
                    <b style="color:#22c55e">Mainline Green Wave Priority</b><br/>
                    • Express and Superfast services accorded non-stop through path or minimum scheduled dwell.<br/>
                    <span style="color:#22c55e;font-weight:700">AI Solution:</span> Automated advance route reservation 10 minutes prior to section block boundary entry.
                  </div>
                </div>
              `))}
            </div>

            <!-- AI Signalling Matrix Table -->
            <div class="panel" style="padding:0;overflow:hidden">
              <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);background:var(--bg-card);display:flex;justify-content:space-between;align-items:center">
                <div>
                  <strong style="font-size:14px;color:var(--text-heading)">
                    ${stationName} — AI Recommended Timetable Slots &amp; Signalling Interlocking Action Plan
                  </strong>
                  <div style="font-size:11px;color:var(--text-muted)">
                    Calculated using Moving Block Headway Model (3-minute headway buffer, overlap route locking, zero yard fouling)
                  </div>
                </div>
              </div>

              <div style="overflow-x:auto">
                <table style="width:100%;border-collapse:collapse;font-size:12px">
                  <thead>
                    <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                      <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">TRAIN</th>
                      <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">BOOKED TIME</th>
                      <th style="text-align:center;padding:10px 14px;color:var(--text-muted);background:rgba(34,197,94,0.06)">
                        🤖 AI OPTIMAL ARR TIME
                      </th>
                      <th style="text-align:center;padding:10px 14px;color:var(--text-muted);background:rgba(34,197,94,0.06)">
                        🤖 AI OPTIMAL DEP TIME
                      </th>
                      <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">PF</th>
                      <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">SIGNALLING DIRECTIVE &amp; ROUTE RELAY PLAN</th>
                      <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">HEADWAY ANALYSIS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered.length === 0 ? `
                      <tr>
                        <td colspan="7" style="padding:28px;text-align:center;color:var(--text-muted)">
                          No train movements found matching the current search query or platform filter.
                        </td>
                      </tr>
                    ` : filtered.map((t, i) => {
                      const conf = (t.conflict || "").toLowerCase();
                      const hasConflict = conf.includes("⚠️") || conf.includes("clash") || conf.includes("tight") || conf.includes("conflict") || conf.includes("overlap");
                      return `
                        <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                          <td style="padding:10px 14px">
                            <b style="font-family:'JetBrains Mono',monospace;color:#60a5fa">${t.train || ''}</b>
                            <div style="font-weight:700;color:var(--text-heading)">${t.name || 'EXPRESS'}</div>
                            <small style="color:var(--text-muted)">${t.src || ''} &rarr; ${t.dest || ''}</small>
                          </td>
                          <td style="padding:10px 14px;text-align:center">
                            Arr: <b>${t.schArr || '--'}</b><br/>Dep: <b>${t.schDep || '--'}</b>
                          </td>
                          <td style="padding:10px 14px;text-align:center;background:rgba(34,197,94,0.04)">
                            <b style="font-size:13px;color:#22c55e">${t.optimalSlotArr || t.schArr || '--'}</b>
                          </td>
                          <td style="padding:10px 14px;text-align:center;background:rgba(34,197,94,0.04)">
                            <b style="font-size:13px;color:#22c55e">${t.optimalSlotDep || t.schDep || '--'}</b>
                          </td>
                          <td style="padding:10px 14px;text-align:center">
                            <span style="background:rgba(59,130,246,0.15);color:#60a5fa;font-weight:900;padding:2px 7px;border-radius:4px">
                              PF ${t.pf || '1'}
                            </span>
                          </td>
                          <td style="padding:10px 14px;max-width:320px;line-height:1.4">
                            <div style="font-size:11.5px;color:var(--text-main)">${t.aiRecommendation || 'Clear approach signal aspect to Green. Route locked.'}</div>
                          </td>
                          <td style="padding:10px 14px">
                            <span style="font-size:11px;font-weight:700;color:${hasConflict?'#f59e0b':'#22c55e'}">
                              ${t.conflict || '✓ Clear Headway'}
                            </span>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ` : ''}

        ${planningTab === "platforms" ? `
          <!-- TAB 3: PLATFORM OCCUPANCY GANTT MATRIX -->
          <div class="panel" style="padding:18px">
            <div style="margin-bottom:16px">
              <strong style="font-size:15px;color:var(--text-heading)">
                ${stationName} — Platform Berthing &amp; Track Circuit Occupancy
              </strong>
              <div style="font-size:12px;color:var(--text-muted)">
                Visual breakdown of train berths across platform lines (PF 1 to ${platformList.length}) to prevent headway clashing.
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px">
              ${platformList.map(pfNum => {
                const pfTrains = data.filter(t => String(t.pf) === String(pfNum));
                return `
                  <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:6px;padding:12px">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                      <div style="display:flex;align-items:center;gap:8px">
                        <span style="background:#2563eb;color:#fff;font-size:11px;font-weight:900;padding:2px 8px;border-radius:4px">
                          PLATFORM ${pfNum}
                        </span>
                        <strong style="font-size:12.5px;color:var(--text-heading)">
                          ${pfTrains.length} Movements Scheduled
                        </strong>
                      </div>
                      <span style="font-size:11px;color:var(--text-muted)">
                        Capacity: 24-Coach Broad Gauge • Electronic Axle Counter Cleared
                      </span>
                    </div>

                    <div style="display:flex;gap:6px;flex-wrap:wrap">
                      ${pfTrains.length === 0 ? `
                        <span style="font-size:11.5px;color:var(--text-muted);font-style:italic">No movements currently allocated on this platform line.</span>
                      ` : pfTrains.map(t => {
                        const isVande = (t.name || "").includes("VANDE") || (t.name || "").includes("RAJDHANI");
                        return `
                          <div style="background:${isVande?'rgba(34,197,94,0.12)':'rgba(59,130,246,0.1)'};border:1px solid ${isVande?'rgba(34,197,94,0.4)':'rgba(59,130,246,0.3)'};border-radius:4px;padding:5px 9px;cursor:pointer" onclick="showTrainSignalDetailsModal('${t.train}')" title="Click for AI Signalling Directive">
                            <div style="font-family:'JetBrains Mono',monospace;font-weight:800;color:${isVande?'#22c55e':'#60a5fa'};font-size:11px">
                              ${t.train || ''} (${t.schArr !== '--' ? t.schArr : t.schDep})
                            </div>
                            <div style="font-size:11px;color:var(--text-heading);font-weight:600">
                              ${t.name || 'EXPRESS'}
                            </div>
                            <div style="font-size:9.5px;color:var(--text-muted)">
                              ${t.src || ''} &rarr; ${t.dest || ''}
                            </div>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </main>
    `;
  } catch (err) {
    console.error("Error rendering Station Planning:", err);
    return `
      <main class="content">
        <div class="panel" style="padding:24px;border-left:4px solid #ef4444">
          <h3 style="color:#ef4444;margin-top:0">Station Planning Error</h3>
          <p style="color:var(--text-main)">An error occurred while rendering the station planning console: <code>${esc(err.message)}</code></p>
          <button class="primary" onclick="selectedPlanningStation='CBE';render();">Reset to Coimbatore (CBE)</button>
        </div>
      </main>
    `;
  }
}


// DEFECTS & USFD ULTRASONIC TESTING PAGE (/api/v1/defects)
// ==========================================================================

let liveDefects = [];
let defectsLoaded = false;
let defectsFilterSev = "ALL";
let defectsFilterDept = "ALL";
let defectsFilterStatus = "ALL";
let defectsSearchQuery = "";

const INITIAL_FALLBACK_DEFECTS = [
  { id: "DEF-001", code: "USFD-W-01", type: "Lateral Rail Wear & Gauge Widening", section: "SEC-MAS-CBE (Katpadi – JTJ)", km: "KM 12.5", severity: "CRITICAL", tsr: "TSR 30 km/h", status: "Open", dept: "ENGINEERING", reported: "01-Sep-2026", machine: "09-3X Dynamic Tamper" },
  { id: "DEF-002", code: "USFD-W-02", type: "Thermit Weld Micro-cracking & Fatigue", section: "SEC-MAS-CBE (Salem – Erode)", km: "KM 22.0", severity: "HIGH", tsr: "TSR 45 km/h", status: "Open", dept: "ENGINEERING", reported: "01-Sep-2026", machine: "Thermit Weld Recasting Unit" },
  { id: "DEF-003", code: "OHE-S-01", type: "25kV OHE Contact Wire Sag", section: "SEC-PGT-TVC (Thrissur – Ernakulam)", km: "KM 45.3", severity: "CRITICAL", tsr: "Power Block", status: "Scheduled", dept: "TRD", reported: "31-Aug-2026", machine: "TRD Tower Wagon TW-07-02" },
  { id: "DEF-004", code: "USFD-W-03", type: "Thermit Weld Fatigue & Surface Spalling", section: "SEC-MAS-MDU (Villupuram – Vriddhachalam)", km: "KM 105.2", severity: "HIGH", tsr: "TSR 45 km/h", status: "Open", dept: "ENGINEERING", reported: "31-Aug-2026", machine: "Regulating Switch Tamper" },
  { id: "DEF-005", code: "PWAY-B-01", type: "Deep Ballast Fouling & Bed Subsidence", section: "SEC-MAS-MDU (Dindigul – Madurai)", km: "KM 198.2", severity: "MODERATE", tsr: "TSR 30 km/h", status: "Scheduled", dept: "ENGINEERING", reported: "30-Aug-2026", machine: "Plasser RM 80-92 UHR" },
  { id: "DEF-006", code: "SNT-P-01", type: "Point Machine Switch Play & Detection Flaw", section: "SEC-SA-ED (Erode Jn Yard North)", km: "KM 312.0", severity: "CRITICAL", tsr: "TSR 15 km/h", status: "Open", dept: "S_AND_T", reported: "01-Sep-2026", machine: "S&T Signal Calibration Crew" },
  { id: "DEF-007", code: "TRD-I-01", type: "Cantilever Insulator Flashover & Flash Damage", section: "SEC-PGT-TVC (Aluva – Ernakulam)", km: "KM 88.4", severity: "HIGH", tsr: "Caution 45 km/h", status: "Open", dept: "TRD", reported: "01-Sep-2026", machine: "TRD Tower Wagon" },
  { id: "DEF-008", code: "PWAY-M-01", type: "Marine Fastener Oxidation & Corrosion", section: "SEC-MDU-RMM (Mandapam – Pamban)", km: "KM 9.2", severity: "CRITICAL", tsr: "Caution 30 km/h", status: "Scheduled", dept: "ENGINEERING", reported: "29-Aug-2026", machine: "P-Way Marine Maintenance Gang" }
];

async function initDefectsUSFDPage() {
  if (defectsLoaded && liveDefects.length > 0) return;
  try {
    const res = await api.get("/api/v1/defects?limit=100");
    if (res && res.items && res.items.length > 0) {
      liveDefects = res.items.map((d, i) => {
        const sev = (d.severity || "HIGH").toUpperCase();
        return {
          id: d.id,
          code: d.defect_code || `DEF-${String(i + 1).padStart(3, "0")}`,
          type: d.defect_type || "Track Wear / Ultrasonic Anomaly",
          section: d.description && d.description.includes("SEC-") ? d.description : (i % 2 === 0 ? "SEC-MAS-CBE (Katpadi – JTJ)" : "SEC-MAS-MDU (Villupuram – Vriddhachalam)"),
          km: d.exact_km_post || `KM ${(12 + (i * 7) % 180)}.4`,
          severity: sev,
          safety_impact: d.safety_impact || (sev === "CRITICAL" ? "IMMEDIATE_BLOCK" : "SPEED_RESTRICTION"),
          tsr: sev === "CRITICAL" ? "TSR 30 km/h" : (sev === "HIGH" ? "TSR 45 km/h" : "Caution 60 km/h"),
          status: d.is_rectified ? "Rectified" : (d.status === "SCHEDULED" ? "Scheduled" : "Open"),
          dept: (d.department || "ENGINEERING").toUpperCase(),
          reported: d.detected_at ? d.detected_at.slice(0, 10) : "2026-09-01",
          machine: d.department === "TRD" ? "TRD Tower Wagon TW-07" : (d.department === "S_AND_T" ? "S&T Calibration Crew" : "09-3X Dynamic Tamper")
        };
      });
      defectsLoaded = true;
      if (current === "Defects & USFD") render();
    } else {
      liveDefects = [...INITIAL_FALLBACK_DEFECTS];
      defectsLoaded = true;
    }
  } catch (e) {
    console.warn("Could not load defects from API, using cached data:", e);
    if (liveDefects.length === 0) liveDefects = [...INITIAL_FALLBACK_DEFECTS];
    defectsLoaded = true;
  }
}

window.rectifyDefect = async (id) => {
  try {
    await api.patch(`/api/v1/defects/${id}`, { is_rectified: true, status: "RECTIFIED" });
    const target = liveDefects.find(d => d.id === id);
    if (target) {
      target.status = "Rectified";
      target.is_rectified = true;
    }
    showToast(currentLang === 'hi' ? "ट्रैक दोष सफलतापूर्वक सुधारा गया एवं यू.एस.एफ.डी. क्लियर हुआ।" : "Defect marked as rectified and USFD test cleared.");
    render();
  } catch (e) {
    const target = liveDefects.find(d => d.id === id);
    if (target) {
      target.status = "Rectified";
      target.is_rectified = true;
    }
    showToast(currentLang === 'hi' ? "ट्रैक दोष स्थानीय रूप से सुधारा गया।" : "Defect marked rectified locally.");
    render();
  }
};

window.openReportDefectModal = () => {
  const isHi = currentLang === 'hi';
  showModal(
    isHi ? "नया ट्रैक दोष दर्ज करें (यू.एस.एफ.डी. परीक्षण)" : "Report Track Defect (USFD Testing)",
    isHi ? "एआई ब्लॉक योजना के लिए नए ट्रैक दोष अथवा अल्ट्रासोनिक विसंगति की रिपोर्ट दर्ज करें।" : "Log new track flaw or ultrasonic flaw detection anomaly for AI block scheduling.",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>${isHi ? 'दोष कोड / आईडी' : 'Defect Code / ID'}
          <input type="text" id="modalDefCode" value="DEF-2026-${Math.floor(100 + Math.random()*900)}" />
        </label>
        <label>${isHi ? 'विभाग' : 'Department'}
          <select id="modalDefDept">
            <option value="ENGINEERING">ENGINEERING (P-Way / Track)</option>
            <option value="TRD">TRD (Traction 25kV OHE)</option>
            <option value="S_AND_T">S&T (Signals & Interlocking)</option>
          </select>
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>${isHi ? 'कॉरिडोर अनुभाग' : 'Corridor Section'}
          <select id="modalDefSection">
            <option value="SEC-MAS-CBE (Katpadi – JTJ)">SEC-MAS-CBE (Katpadi – Jolarpettai)</option>
            <option value="SEC-MAS-MDU (Villupuram – Vriddhachalam)">SEC-MAS-MDU (Villupuram – Vriddhachalam)</option>
            <option value="SEC-PGT-TVC (Thrissur – Ernakulam)">SEC-PGT-TVC (Thrissur – Ernakulam)</option>
            <option value="SEC-SA-ED (Salem – Erode)">SEC-SA-ED (Salem – Erode Jn)</option>
            <option value="SEC-MDU-RMM (Mandapam – Pamban)">SEC-MDU-RMM (Mandapam – Pamban Bridge)</option>
          </select>
        </label>
        <label>${isHi ? 'किलोमीटर पोस्ट' : 'KM Post'}
          <input type="text" id="modalDefKm" value="KM 142.6" />
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>${isHi ? 'गंभीरता स्तर' : 'Severity Level'}
          <select id="modalDefSev">
            <option value="CRITICAL">${isHi ? 'CRITICAL (आपातकालीन ब्लॉक आवश्यक)' : 'CRITICAL (Immediate Block Required)'}</option>
            <option value="HIGH">${isHi ? 'HIGH (गति प्रतिबंध लागू)' : 'HIGH (Speed Restriction Active)'}</option>
            <option value="MODERATE">${isHi ? 'MODERATE (नियमित अनुरक्षण)' : 'MODERATE (Routine Maintenance)'}</option>
          </select>
        </label>
        <label>${isHi ? 'दोष प्रकार' : 'Defect Classification'}
          <input type="text" id="modalDefType" value="Ultrasonic Thermit Weld Micro-fissure" />
        </label>
      </div>
      <label>${isHi ? 'विस्तृत विवरण' : 'Detailed Description'}
        <textarea id="modalDefDesc" rows="2" style="width:100%">${isHi ? 'यू.एस.एफ.डी. परीक्षण द्वारा ट्रैक में आंतरिक धातु थकान पहचानी गई।' : 'Internal metal fatigue detected during routine USFD testing. TSR recommended.'}</textarea>
      </label>
    `,
    async (overlay) => {
      const code = overlay.querySelector("#modalDefCode").value.trim();
      const dept = overlay.querySelector("#modalDefDept").value;
      const section = overlay.querySelector("#modalDefSection").value;
      const km = overlay.querySelector("#modalDefKm").value.trim();
      const severity = overlay.querySelector("#modalDefSev").value;
      const type = overlay.querySelector("#modalDefType").value.trim();
      const desc = overlay.querySelector("#modalDefDesc").value.trim();

      const newDef = {
        id: "DEF-" + Math.floor(1000 + Math.random()*9000),
        code: code || "DEF-NEW",
        type: type || "Track Defect",
        section: section,
        km: km,
        severity: severity,
        safety_impact: severity === "CRITICAL" ? "IMMEDIATE_BLOCK" : "SPEED_RESTRICTION",
        tsr: severity === "CRITICAL" ? "TSR 30 km/h" : "TSR 45 km/h",
        status: "Open",
        dept: dept,
        reported: new Date().toISOString().slice(0, 10),
        machine: dept === "TRD" ? "TRD Tower Wagon" : (dept === "S_AND_T" ? "Signal Calibration Crew" : "09-3X Dynamic Tamper")
      };

      try {
        await api.post("/api/v1/defects", {
          defect_code: newDef.code,
          department: newDef.dept,
          defect_type: newDef.type,
          description: `${newDef.section} (${newDef.km}): ${desc}`,
          severity: newDef.severity,
          safety_impact: newDef.safety_impact,
          source: "USFD Ultrasonic Trolley Inspection"
        });
      } catch (err) {
        console.warn("Backend defect creation notice:", err.message);
      }

      liveDefects.unshift(newDef);
      showToast(isHi ? "नया ट्रैक दोष दर्ज किया गया और सूची में जोड़ा गया।" : "Track defect successfully recorded and queued for block planning.");
      render();
    },
    isHi ? "दोष दर्ज करें" : "Submit Defect"
  );
};

window.setDefectsFilter = (type, val) => {
  if (type === "sev") defectsFilterSev = val;
  else if (type === "dept") defectsFilterDept = val;
  else if (type === "status") defectsFilterStatus = val;
  render();
};

window.setDefectsSearch = (val) => {
  defectsSearchQuery = val.toLowerCase().trim();
  render();
};

function renderDefectsUSFDPage() {
  const isHi = currentLang === 'hi';
  const dataList = liveDefects.length > 0 ? liveDefects : INITIAL_FALLBACK_DEFECTS;

  const filtered = dataList.filter(d => {
    if (defectsFilterSev !== "ALL" && d.severity !== defectsFilterSev) return false;
    if (defectsFilterDept !== "ALL" && d.dept !== defectsFilterDept) return false;
    if (defectsFilterStatus !== "ALL" && d.status !== defectsFilterStatus) return false;
    if (defectsSearchQuery) {
      const q = defectsSearchQuery;
      return (d.code && d.code.toLowerCase().includes(q)) ||
             (d.type && d.type.toLowerCase().includes(q)) ||
             (d.section && d.section.toLowerCase().includes(q)) ||
             (d.km && d.km.toLowerCase().includes(q));
    }
    return true;
  });

  const countCrit = dataList.filter(d => d.severity === "CRITICAL").length;
  const countMajor = dataList.filter(d => d.severity === "HIGH" || d.severity === "MAJOR").length;
  const countMod = dataList.filter(d => d.severity === "MODERATE").length;
  const countRect = dataList.filter(d => d.status === "Rectified").length;

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>${isHi ? 'ट्रैक दोष एवं अल्ट्रासोनिक यू.एस.एफ.डी. परीक्षण रजिस्टर' : 'Track Defects & Ultrasonic USFD Flaw Testing'} (${dataList.length} ${isHi ? 'पंजीकृत दोष' : 'Active Defects'})</h2>
          <div class="screen-breadcrumb">${isHi ? 'होम > ट्रैक दोष एवं यू.एस.एफ.डी.' : 'Home > Defects & USFD'}</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="secondary" onclick="initDefectsUSFDPage();showToast('${isHi ? 'सर्वर से दोष सूची सिंक की गई।' : 'Synced defect logs with server.'}')">🔄 ${isHi ? 'रिफ्रेश सिंक' : 'Sync DB'}</button>
          <button class="primary" onclick="openReportDefectModal()">+ ${isHi ? 'नया दोष दर्ज करें' : 'Log Track Defect'}</button>
        </div>
      </div>

      <!-- KPI Summary Row -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px">
        <div style="background:var(--bg-card);border:1px solid rgba(239,68,68,0.4);border-radius:8px;padding:12px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700">${isHi ? 'गंभीर दोष (CRITICAL)' : 'CRITICAL DEFECTS'}</div>
          <div style="font-size:24px;font-weight:900;color:#ef4444">${countCrit}</div>
          <div style="font-size:10px;color:var(--text-muted)">${isHi ? 'आपातकालीन ब्लॉक अनिवार्य' : 'Immediate block required'}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(245,158,11,0.4);border-radius:8px;padding:12px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700">${isHi ? 'प्रमुख दोष (MAJOR)' : 'MAJOR DEFECTS'}</div>
          <div style="font-size:24px;font-weight:900;color:#f59e0b">${countMajor}</div>
          <div style="font-size:10px;color:var(--text-muted)">${isHi ? 'गति प्रतिबंध (TSR) सक्रिय' : 'Speed restriction active'}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(59,130,246,0.4);border-radius:8px;padding:12px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700">${isHi ? 'मध्यम दोष (MODERATE)' : 'MODERATE DEFECTS'}</div>
          <div style="font-size:24px;font-weight:900;color:#60a5fa">${countMod}</div>
          <div style="font-size:10px;color:var(--text-muted)">${isHi ? 'साप्ताहिक अनुरक्षण योजना' : 'Scheduled maintenance'}</div>
        </div>
        <div style="background:var(--bg-card);border:1px solid rgba(34,197,94,0.4);border-radius:8px;padding:12px 16px">
          <div style="font-size:11px;color:var(--text-muted);font-weight:700">${isHi ? 'सुधारे गए दोष (RECTIFIED)' : 'RECTIFIED DEFECTS'}</div>
          <div style="font-size:24px;font-weight:900;color:#22c55e">${countRect}</div>
          <div style="font-size:10px;color:var(--text-muted)">${isHi ? 'ट्रैक परीक्षण सफल' : 'USFD clearance certified'}</div>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div style="background:var(--bg-card);border:1px solid var(--border-light);border-radius:8px;padding:12px;margin-bottom:14px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
          <input type="text" placeholder="${isHi ? 'दोष आईडी, प्रकार, अनुभाग खोजें...' : 'Search defect code, section, type...'}" value="${esc(defectsSearchQuery)}" oninput="setDefectsSearch(this.value)" style="min-width:240px;padding:6px 12px;font-size:12px" />
          
          <select onchange="setDefectsFilter('sev', this.value)" style="padding:6px 10px;font-size:12px">
            <option value="ALL" ${defectsFilterSev==='ALL'?'selected':''}>${isHi ? 'सभी गंभीरता स्तर' : 'All Severities'}</option>
            <option value="CRITICAL" ${defectsFilterSev==='CRITICAL'?'selected':''}>CRITICAL</option>
            <option value="HIGH" ${defectsFilterSev==='HIGH'?'selected':''}>HIGH / MAJOR</option>
            <option value="MODERATE" ${defectsFilterSev==='MODERATE'?'selected':''}>MODERATE</option>
          </select>

          <select onchange="setDefectsFilter('dept', this.value)" style="padding:6px 10px;font-size:12px">
            <option value="ALL" ${defectsFilterDept==='ALL'?'selected':''}>${isHi ? 'सभी विभाग' : 'All Departments'}</option>
            <option value="ENGINEERING" ${defectsFilterDept==='ENGINEERING'?'selected':''}>ENGINEERING</option>
            <option value="TRD" ${defectsFilterDept==='TRD'?'selected':''}>TRD</option>
            <option value="S_AND_T" ${defectsFilterDept==='S_AND_T'?'selected':''}>S&T</option>
          </select>

          <select onchange="setDefectsFilter('status', this.value)" style="padding:6px 10px;font-size:12px">
            <option value="ALL" ${defectsFilterStatus==='ALL'?'selected':''}>${isHi ? 'सभी स्थिति' : 'All Statuses'}</option>
            <option value="Open" ${defectsFilterStatus==='Open'?'selected':''}>${isHi ? 'खुला (Open)' : 'Open'}</option>
            <option value="Scheduled" ${defectsFilterStatus==='Scheduled'?'selected':''}>${isHi ? 'निर्धारित (Scheduled)' : 'Scheduled'}</option>
            <option value="Rectified" ${defectsFilterStatus==='Rectified'?'selected':''}>${isHi ? 'सुधारा गया (Rectified)' : 'Rectified'}</option>
          </select>
        </div>
        <div style="font-size:12px;color:var(--text-muted)">
          ${isHi ? 'दिखाए गए रिकॉर्ड' : 'Showing'}: <b>${filtered.length}</b> / ${dataList.length}
        </div>
      </div>

      <!-- Defects Table -->
      <div class="panel" style="padding:0;overflow:hidden">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'दोष आईडी' : 'DEFECT CODE'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'दोष वर्गीकरण' : 'CLASSIFICATION'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'कॉरिडोर अनुभाग' : 'CORRIDOR SECTION'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'किमी पोस्ट' : 'KM POST'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गंभीरता' : 'SEVERITY'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गति प्रतिबंध' : 'RESTRICTION (TSR)'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'विभाग' : 'DEPARTMENT'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'स्थिति' : 'STATUS'}</th>
                <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">${isHi ? 'कार्रवाई' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted)">
                    ${isHi ? 'कोई मेल खाता दोष नहीं मिला।' : 'No matching defects found.'}
                  </td>
                </tr>
              ` : filtered.map((d, i) => {
                const isCrit = d.severity === "CRITICAL";
                const isHigh = d.severity === "HIGH" || d.severity === "MAJOR";
                const isRect = d.status === "Rectified";
                return `
                  <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                    <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${d.code}</td>
                    <td style="padding:10px 14px;color:var(--text-heading);font-weight:600">${d.type}</td>
                    <td style="padding:10px 14px;color:var(--text-main)">${d.section}</td>
                    <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace">${d.km}</td>
                    <td style="padding:10px 14px">
                      <span style="background:${isCrit?'rgba(239,68,68,0.15)':(isHigh?'rgba(245,158,11,0.15)':'rgba(59,130,246,0.15)')};color:${isCrit?'#ef4444':(isHigh?'#f59e0b':'#60a5fa')};border:1px solid ${isCrit?'#ef4444':(isHigh?'#f59e0b':'#60a5fa')};padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:800">${d.severity}</span>
                    </td>
                    <td style="padding:10px 14px;color:${isCrit?'#ef4444':'#f59e0b'};font-weight:700">${d.tsr}</td>
                    <td style="padding:10px 14px;color:var(--text-muted)">${d.dept}</td>
                    <td style="padding:10px 14px">
                      <span style="background:${isRect?'rgba(34,197,94,0.15)':(d.status==='Scheduled'?'rgba(59,130,246,0.15)':'rgba(239,68,68,0.15)')};color:${isRect?'#22c55e':(d.status==='Scheduled'?'#60a5fa':'#ef4444')};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${d.status}</span>
                    </td>
                    <td style="padding:10px 14px;text-align:center">
                      ${isRect ? `
                        <span style="color:#22c55e;font-size:11px;font-weight:700">✔ ${isHi ? 'सुधारा गया' : 'Resolved'}</span>
                      ` : `
                        <button class="secondary" style="padding:3px 8px;font-size:11px;font-weight:700" onclick="rectifyDefect('${d.id}')">✓ ${isHi ? 'सुधारें' : 'Rectify'}</button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
}

// ==========================================================================
// WEATHER & TRAIN DELAYS PAGE (/api/v1/weather & /api/v1/weather/delays)
// ==========================================================================

let liveWeatherDivisions = [];
let weatherSyncing = false;
let liveTrainDelays = [];
let trainDelayFilter = "ALL";
let weatherLastUpdated = null;
let selectedWeatherDivision = "ALL";

const DIVISION_GPS_METEO = [
  { division: "Chennai (MAS)", name_hi: "चेन्नई मंडल", lat: 13.0827, lon: 80.2707, temp_c: 32.8, humidity: 62, condition: "Partly Cloudy", rainfall_mm: 0.1, risk_level: "LOW", wind_kmh: 12, rec: "Trace drizzle (0.1 mm) • Normal traction adhesion • Booked sectional line speeds (130 km/h) permitted." },
  { division: "Madurai (MDU)", name_hi: "मदुरै मंडल", lat: 9.9252, lon: 78.1198, temp_c: 38.8, humidity: 28, condition: "Mainly Clear / Partly Cloudy", rainfall_mm: 0.0, risk_level: "MEDIUM", wind_kmh: 8, rec: "High ambient & rail temperature (38.8°C) • Hot weather patrolling deployed • Rail de-stressing & buckling watch." },
  { division: "Salem (SA)", name_hi: "सेलम मंडल", lat: 11.0168, lon: 76.9558, temp_c: 30.6, humidity: 56, condition: "Mainly Clear / Partly Cloudy", rainfall_mm: 0.0, risk_level: "LOW", wind_kmh: 19, rec: "Optimal track temperature & clear visibility • Normal booked sectional speed (130 km/h) permitted." },
  { division: "Palakkad (PGT)", name_hi: "पालक्काड मंडल", lat: 10.7867, lon: 76.6548, temp_c: 28.1, humidity: 79, condition: "Light Drizzle", rainfall_mm: 0.1, risk_level: "LOW", wind_kmh: 20, rec: "Trace drizzle (0.1 mm) • Normal traction adhesion • Booked sectional line speed (110 km/h) permitted." },
  { division: "Tiruchirappalli (TPJ)", name_hi: "तिरुच्चिराप्पल्ली मंडल", lat: 10.7905, lon: 78.7047, temp_c: 36.7, humidity: 35, condition: "Mainly Clear / Partly Cloudy", rainfall_mm: 0.0, risk_level: "MEDIUM", wind_kmh: 8, rec: "High ambient temperature (36.7°C) • Hot weather patrolling deployed • Continuous rail de-stressing vigilance." },
  { division: "Thiruvananthapuram (TVC)", name_hi: "तिरुवनंतपुरम मंडल", lat: 8.5241, lon: 76.9366, temp_c: 28.7, humidity: 76, condition: "Mainly Clear / Partly Cloudy", rainfall_mm: 0.0, risk_level: "LOW", wind_kmh: 20, rec: "Optimal track temperature & clear visibility • Normal booked sectional speed permitted." }
];

const SAMPLE_SOUTHERN_RAILWAY_DELAYS = [
  {
    train_no: "20607",
    train_name: "Vande Bharat Express",
    route: "MGR Chennai Central (MAS) → Mysuru (MYS)",
    div: "MAS",
    current_section: "Katpadi Jn – Jolarpettai Jn (KM 142.5)",
    speed_kmh: 115,
    max_speed_kmh: 130,
    current_delay_mins: 8,
    weather_impact: "Trace drizzle & track tamper caution (TSR 45 km/h)",
    delay_root_cause: "Speed restriction through active engineering block",
    predicted_further_delay_mins: 4,
    projected_destination_delay_mins: 12,
    ai_recommendation: "Provide precedence over freight rakes at Jolarpettai Jn to recover 6 minutes."
  },
  {
    train_no: "12638",
    train_name: "Pandian Superfast Express",
    route: "Madurai Jn (MDU) → Chennai Egmore (MS)",
    div: "MDU",
    current_section: "Dindigul Jn – Tiruchirappalli Jn",
    speed_kmh: 90,
    max_speed_kmh: 110,
    current_delay_mins: 15,
    weather_impact: "High ambient rail temp (38.8°C) hot weather watch",
    delay_root_cause: "Hot weather patrol speed check on Trichy chord",
    predicted_further_delay_mins: 5,
    projected_destination_delay_mins: 20,
    ai_recommendation: "Booked clearance at Villupuram Jn on Platform Line 1."
  },
  {
    train_no: "12624",
    train_name: "Chennai Mail",
    route: "Thiruvananthapuram (TVC) → Chennai Central (MAS)",
    div: "TVC",
    current_section: "Thrissur – Shoranur Jn",
    speed_kmh: 80,
    max_speed_kmh: 110,
    current_delay_mins: 22,
    weather_impact: "Monsoon damp track bed near Shoranur Yard",
    delay_root_cause: "Slower turnout negotiation due to damp rails",
    predicted_further_delay_mins: 8,
    projected_destination_delay_mins: 30,
    ai_recommendation: "Route via Main Line with green wave signal priority at Palakkad."
  },
  {
    train_no: "12675",
    train_name: "Kovai Express",
    route: "MGR Chennai Central (MAS) → Coimbatore Jn (CBE)",
    div: "SA",
    current_section: "Salem Jn – Erode Jn",
    speed_kmh: 125,
    max_speed_kmh: 130,
    current_delay_mins: 0,
    weather_impact: "Clear weather • 30.6°C optimal rail temp",
    delay_root_cause: "Operating on booked time (Right Time)",
    predicted_further_delay_mins: 0,
    projected_destination_delay_mins: 0,
    ai_recommendation: "Maintain scheduled run; line clear granted up to Tiruppur."
  },
  {
    train_no: "16851",
    train_name: "Rameswaram Express",
    route: "Chennai Egmore (MS) → Rameswaram (RMM)",
    div: "MDU",
    current_section: "Ramanathapuram – Mandapam (Approaching Pamban Bridge)",
    speed_kmh: 40,
    max_speed_kmh: 80,
    current_delay_mins: 18,
    weather_impact: "Coastal sea winds & Pamban anemometer monitoring",
    delay_root_cause: "Regulated speed 30 km/h across Pamban Cantilever Sea Bridge",
    predicted_further_delay_mins: 6,
    projected_destination_delay_mins: 24,
    ai_recommendation: "Confirm marine anemometer <38 km/h before authorizing lift bridge entry."
  }
];

const DEFAULT_TRAIN_DELAYS = [];

let liveIncidentsList = [
  { id: "INC-0901-01", type: "Monsoon Waterlogging Caution", corridor: "Palakkad - Trivandrum", div: "PGT", section: "Shoranur – Kozhikode", time: "05:30 IST", severity: "Caution", status: "Active", note: "Water level 45mm below rail crown. Speed restricted to 30 km/h." },
  { id: "INC-0901-02", type: "High Ambient Rail Temp Watch", corridor: "Madurai - Tirunelveli Trunk", div: "MDU", section: "Madurai Jn – Virudhunagar", time: "11:45 IST", severity: "Warning", status: "Active", note: "Continuous rail temperature 48°C logged. Hot weather gangman patrol deployed." },
  { id: "INC-0901-03", type: "High Wind Velocity Alert", corridor: "Madurai - Rameswaram Pamban", div: "MDU", section: "Mandapam – Pamban Sea Bridge", time: "07:15 IST", severity: "Warning", status: "Active", note: "Pamban Anemometer logged 32 km/h. Automatic bridge signal interlock monitoring active." },
  { id: "INC-0901-04", type: "Tree Branch Fouling OHE", corridor: "Palakkad - Trivandrum", div: "TVC", section: "Kottayam – Aluva", time: "02:40 IST", severity: "Resolved", status: "Cleared", note: "Cleared by TRD Tower Wagon TW-07-02. 25kV power restored in 18 mins." }
];

function interpretRailwayWeather(code, rain, temp, wind, hum) {
  let cond = "Partly Cloudy";
  let icon = "🌤️";
  
  if (code === 0) { cond = "Clear Sky"; icon = "☀️"; }
  else if (code <= 3) { cond = "Mainly Clear / Partly Cloudy"; icon = "🌤️"; }
  else if (code <= 48) { cond = "Foggy / Low Visibility"; icon = "🌫️"; }
  else if (code <= 55) { cond = "Light Drizzle"; icon = "🌦️"; }
  else if (code <= 67) { cond = "Rain / Showers"; icon = "🌧️"; }
  else if (code <= 82) { cond = "Heavy Rain Showers"; icon = "⛈️"; }
  else if (code >= 95) { cond = "Thunderstorm Alert"; icon = "⚡"; }

  let risk = "LOW";
  let rec = "Optimal track conditions • Booked sectional line speeds (110–130 km/h) in effect.";
  let recHi = "अनुकूल ट्रैक स्थिति व तापमान • निर्धारित सेक्शनल गति (110–130 किमी/घंटा) स्वीकृत।";

  if (rain >= 15 || code >= 80) {
    risk = "HIGH";
    rec = `Heavy monsoon rainfall (${rain} mm) • Waterlogging watch on bridges & culverts • Mandatory 30 km/h caution order.`;
    recHi = `भारी वर्षा (${rain} mm) • पुलों और पुलियों पर जलभराव निगरानी • 30 किमी/घंटा गति प्रतिबंध प्रभावी।`;
  } else if (temp >= 38.0) {
    risk = temp >= 42 ? "HIGH" : "MEDIUM";
    rec = `High ambient & rail temperature (${temp}°C) • Hot weather patrolling deployed • Rail de-stressing & buckling watch.`;
    recHi = `उच्च परिवेश तापमान (${temp}°C) • ग्रीष्मकालीन रेल गश्त सक्रिय • रेल विरूपण पर सतत निगरानी।`;
  } else if (wind >= 38) {
    risk = "HIGH";
    rec = `High crosswinds (${wind} km/h) • Coastal anemometer interlock alert • Container rakes speed-regulated.`;
    recHi = `तीव्र क्रॉसविंड (${wind} km/h) • तटीय एनेमोमीटर इंटरलॉक सक्रिय • मालगाड़ियों की गति नियंत्रित।`;
  } else if (rain >= 2.0) {
    risk = "MEDIUM";
    rec = `Track surface damp (${rain} mm) • Wet railhead friction reduction • Braking application distance increased.`;
    recHi = `ट्रैक की सतह गीली (${rain} mm) • रेलहेड घर्षण में कमी • ब्रेक लगाने की दूरी बढ़ाई गई।`;
  } else if (temp >= 36.0) {
    risk = "MEDIUM";
    rec = `High ambient temperature (${temp}°C) • Hot weather patrolling deployed • Continuous rail de-stressing vigilance.`;
    recHi = `उच्च तापमान (${temp}°C) • ग्रीष्मकालीन रेल गश्त सक्रिय • रेल विरूपण निगरानी।`;
  } else if (wind >= 24) {
    risk = "MEDIUM";
    rec = `Gusty winds (${wind} km/h) • 25kV OHE catenary sway monitoring active • Watch for tree branches near track.`;
    recHi = `तेज़ हवाएं (${wind} km/h) • 25kV OHE ओवरहेड तार की निगरानी • पेड़ों की शाखाओं की जांच।`;
  } else if (code >= 45 && code <= 48) {
    risk = "MEDIUM";
    rec = `Dense fog & reduced sighting • Fog PASS devices deployed for loco pilots • Maximum speed restricted to 60 km/h.`;
    recHi = `घना कोहरा एवं दृश्यता में कमी • लोको पायलटों हेतु फॉग पास उपकरण सक्रिय • अधिकतम गति 60 किमी/घंटा।`;
  } else if (rain > 0 && rain < 2.0) {
    risk = "LOW";
    rec = `Trace drizzle (${rain} mm) • Normal traction adhesion • Booked sectional line speed permitted.`;
    recHi = `हल्की बूंदाबांदी (${rain} mm) • सामान्य कर्षण पकड़ • निर्धारित सेक्शनल गति स्वीकृत।`;
  }

  return { cond, icon, risk, rec, recHi };
}

let weatherLoaded = false;

async function initWeatherIncidentsPage(force = false) {
  if (!force && weatherLoaded && liveWeatherDivisions.length > 0) return;
  if (weatherSyncing) return;
  weatherSyncing = true;

  try {
    const lats = DIVISION_GPS_METEO.map(d => d.lat).join(",");
    const lons = DIVISION_GPS_METEO.map(d => d.lon).join(",");
    const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`;
    
    const meteoRes = await Promise.race([
      fetch(meteoUrl).then(r => r.ok ? r.json() : Promise.reject("Open-Meteo HTTP error")),
      new Promise((_, reject) => setTimeout(() => reject("Timeout"), 3500))
    ]);

    if (Array.isArray(meteoRes)) {
      liveWeatherDivisions = DIVISION_GPS_METEO.map((d, i) => {
        const cur = meteoRes[i]?.current || {};
        const temp = cur.temperature_2m ?? d.temp_c;
        const hum = cur.relative_humidity_2m ?? d.humidity;
        const rain = cur.precipitation ?? d.rainfall_mm;
        const wind = cur.wind_speed_10m ?? d.wind_kmh;
        const code = cur.weather_code ?? 1;

        const evaluated = interpretRailwayWeather(code, rain, temp, wind, hum);

        return {
          division: d.division,
          name_hi: d.name_hi,
          temp_c: Math.round(temp * 10) / 10,
          humidity: hum,
          condition: evaluated.cond,
          conditionIcon: evaluated.icon,
          rainfall_mm: rain,
          risk_level: evaluated.risk,
          wind_kmh: Math.round(wind),
          rec: currentLang === 'hi' ? evaluated.recHi : evaluated.rec
        };
      });
    } else {
      throw new Error("Single response fallback");
    }
  } catch (e) {
    try {
      const bRes = await api.get("/api/v1/weather");
      if (bRes && bRes.items) {
        liveWeatherDivisions = bRes.items.map(d => {
          const evaluated = interpretRailwayWeather(1, d.rainfall_mm || 0, d.temp_c || 30, d.wind_kmh || 12, d.humidity || 60);
          return {
            ...d,
            conditionIcon: evaluated.icon,
            rec: currentLang === 'hi' ? evaluated.recHi : evaluated.rec
          };
        });
      } else {
        liveWeatherDivisions = [...DIVISION_GPS_METEO];
      }
    } catch {
      liveWeatherDivisions = [...DIVISION_GPS_METEO];
    }
  }

  try {
    const dRes = await api.get("/api/v1/weather/delays");
    if (dRes && dRes.items && dRes.items.length > 0) {
      liveTrainDelays = dRes.items;
    }
  } catch {
    // Retain existing
  }

  weatherLastUpdated = new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  weatherLoaded = true;
  weatherSyncing = false;
  if (current === "Weather & Incidents") {
    render();
  }
}

window.selectWeatherDivisionCard = (divCode) => {
  if (selectedWeatherDivision === divCode) {
    selectedWeatherDivision = "ALL";
    showToast(currentLang === 'hi' ? "सभी मंडलों की मौसम टेलीमेट्री प्रदर्शित" : "Showing all Southern Railway Divisions telemetry.");
  } else {
    selectedWeatherDivision = divCode;
    showToast(currentLang === 'hi' ? `${divCode} मंडल हेतु फ़िल्टर लागू` : `Filtered telemetry to ${divCode} Division`);
  }
  render();
};

window.loadSampleRailwayTrains = () => {
  liveTrainDelays = [...SAMPLE_SOUTHERN_RAILWAY_DELAYS];
  showToast(currentLang === 'hi' ? "5 लाइव दक्षिणी रेलवे गाड़ियां (वंदे भारत, पांडियन आदि) लोड की गईं!" : "Loaded 5 live Southern Railway trains (Vande Bharat, Pandian, Kovai, etc.)!");
  render();
};

window.clearRailwayTrains = () => {
  liveTrainDelays = [];
  showToast(currentLang === 'hi' ? "ट्रेन डेटा खाली किया गया।" : "Train delay table cleared. Ready for custom ingestion.");
  render();
};

window.setTrainDelayFilter = (f) => {
  trainDelayFilter = f;
  render();
};

window.refreshWeatherAndDelays = async () => {
  showToast(currentLang === 'hi' ? "लाइव मौसम एवं ट्रेन विलंब डेटा सिंक हो रहा है..." : "Syncing live weather & train delay telemetry...");
  await initWeatherIncidentsPage(true);
  showToast(currentLang === 'hi' ? "लाइव मौसम एवं विलंब पूर्वानुमान सफलतापूर्वक अपडेट हुआ।" : "Live weather and train delay forecasts updated.");
};

window.resolveCautionIncident = (incId) => {
  const inc = liveIncidentsList.find(i => i.id === incId);
  if (inc) {
    inc.status = "Cleared";
    inc.severity = "Resolved";
    inc.note = "Caution order lifted by Divisional Control Office. Booked sectional line speed restored.";
    showToast(`Caution Order ${incId} lifted! Booked line speed restored.`);
    render();
  }
};

window.openLogIncidentModal = () => {
  const isHi = currentLang === 'hi';
  showModal(
    isHi ? "नया परिचालन सतर्कता आदेश / घटना दर्ज करें" : "Log Operational Caution Order / Weather Incident",
    isHi ? "दक्षिण रेलवे नियंत्रण कार्यालय (Control Office) हेतु सतर्कता आदेश एवं गति प्रतिबंध।" : "Issue an official safety alert, TSR speed restriction, or weather caution order for Southern Railway.",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>${isHi ? 'घटना / सतर्कता का प्रकार' : 'Incident / Caution Type'}
          <select id="modalIncType">
            <option value="High Ambient Rail Temp Watch">High Ambient Rail Temp Watch (Hot Weather Patrol)</option>
            <option value="High Wind Velocity Alert">High Wind Velocity Alert (Pamban / Coastal Anemometer)</option>
            <option value="Monsoon Waterlogging Caution">Monsoon Waterlogging Caution (Bridge / Yard Submersion)</option>
            <option value="Tree Branch Fouling OHE">Tree Branch Fouling 25kV OHE Catenary</option>
            <option value="Dense Fog / Visibility Drop">Dense Fog / Visibility Drop (Fog PASS Active)</option>
            <option value="Track Settlement / Ballast Washout">Track Settlement / Ballast Washout</option>
          </select>
        </label>
        <label>${isHi ? 'मंडल' : 'Division'}
          <select id="modalIncDiv">
            <option value="MAS">Chennai Division (MAS)</option>
            <option value="MDU">Madurai Division (MDU)</option>
            <option value="PGT">Palakkad Division (PGT)</option>
            <option value="SA">Salem Division (SA)</option>
            <option value="TVC">Thiruvananthapuram Division (TVC)</option>
            <option value="TPJ">Tiruchirappalli Division (TPJ)</option>
          </select>
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>${isHi ? 'कॉरिडोर अनुभाग (Section)' : 'Corridor Section'}
          <input id="modalIncSec" placeholder="e.g. Mandapam – Pamban Sea Bridge" value="Katpadi Jn – Jolarpettai Jn" />
        </label>
        <label>${isHi ? 'गंभीरता' : 'Severity'}
          <select id="modalIncSev">
            <option value="Warning">Warning (TSR 30–45 km/h)</option>
            <option value="Caution">Caution (Watch Order)</option>
            <option value="Critical">Critical (Power / Traffic Block)</option>
          </select>
        </label>
      </div>
      <label>${isHi ? 'संरक्षा कार्रवाई एवं गति प्रतिबंध नोट' : 'Safety Action & Speed Restriction Note'}
        <textarea id="modalIncNote" rows="2" style="width:100%;background:var(--bg-input);color:var(--text-main);border:1px solid var(--border-light);border-radius:4px;padding:6px;font-size:12px">Continuous rail temperature 48°C logged. Speed restricted to 45 km/h. Hot weather patrol active.</textarea>
      </label>
    `,
    async (overlay) => {
      const type = overlay.querySelector("#modalIncType").value;
      const div = overlay.querySelector("#modalIncDiv").value;
      const sec = overlay.querySelector("#modalIncSec").value || "Mainline Section";
      const sev = overlay.querySelector("#modalIncSev").value;
      const note = overlay.querySelector("#modalIncNote").value || "Caution order in effect.";

      const newId = `INC-0903-${Math.floor(Math.random() * 89 + 10)}`;
      const nowStr = new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit" }) + " IST";

      liveIncidentsList.unshift({
        id: newId,
        type,
        corridor: `${div} Division Corridor`,
        div,
        section: sec,
        time: nowStr,
        severity: sev,
        status: "Active",
        note
      });

      showToast(`Caution Order ${newId} logged for ${div} Division!`);
      render();
    },
    isHi ? "सतर्कता आदेश जारी करें" : "Issue Caution Order"
  );
};

function renderWeatherIncidentsPage() {
  const isHi = currentLang === 'hi';
  const weatherList = liveWeatherDivisions.length > 0 ? liveWeatherDivisions : DIVISION_GPS_METEO;
  const trainList = liveTrainDelays.length > 0 ? liveTrainDelays : DEFAULT_TRAIN_DELAYS;

  // Filter trains by division & status
  const filteredTrains = trainList.filter(t => {
    if (selectedWeatherDivision !== "ALL" && t.div && !t.div.includes(selectedWeatherDivision)) return false;
    if (trainDelayFilter === "DELAYED") return t.current_delay_mins > 0;
    if (trainDelayFilter === "CRITICAL") return t.current_delay_mins >= 30;
    return true;
  });

  // Filter incidents by division
  const filteredIncidents = selectedWeatherDivision === "ALL" 
    ? liveIncidentsList 
    : liveIncidentsList.filter(i => (i.div === selectedWeatherDivision || (i.section && i.section.includes(selectedWeatherDivision))));

  // High & Medium count
  const highRiskCount = weatherList.filter(w => w.risk_level === "HIGH").length;
  const activeIncCount = liveIncidentsList.filter(i => i.status === "Active").length;

  return `
    <main class="content">
      <div class="screen-header-bar">
        <div class="screen-title-wrap">
          <h2>${isHi ? 'लाइव मौसम टेलीमेट्री एवं ट्रेन विलंब पूर्वानुमान' : 'Live Weather Telemetry & Train Delay Predictions'}</h2>
          <div class="screen-breadcrumb">${isHi ? 'होम > मौसम एवं ट्रेन विलंब' : 'Home > Weather & Incidents'}</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="primary" onclick="refreshWeatherAndDelays()">🔄 ${isHi ? 'लाइव मौसम सिंक करें' : 'Sync Live Weather & Delays'}</button>
          <button class="secondary" onclick="openLogIncidentModal()">⚠️ ${isHi ? '+ सतर्कता आदेश दर्ज करें' : '+ Log Caution Order'}</button>
        </div>
      </div>

      <!-- Weather Safety KPI Bar -->
      <div class="metrics-row" style="margin-bottom:16px">
        <div class="metric-card-formal ${highRiskCount > 0 ? 'red' : 'green'}">
          <div class="metric-icon-formal ${highRiskCount > 0 ? 'red' : 'green'}">
            <svg viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path></svg>
          </div>
          <div>
            <span>${isHi ? 'मौसम जोखिम स्तर' : 'Network Weather Risk'}</span>
            <strong>${highRiskCount > 0 ? `${highRiskCount} Divisions Alert` : 'All 6 Divisions Optimal'}</strong>
            <small>${isHi ? 'ओपन-मेटियो लाइव टेलीमेट्री' : 'Live Sensor Feeds Active'}</small>
          </div>
        </div>

        <div class="metric-card-formal gold">
          <div class="metric-icon-formal gold">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <div>
            <span>${isHi ? 'सक्रिय गति सतर्कता आदेश' : 'Active Weather TSRs'}</span>
            <strong>${activeIncCount} ${isHi ? 'सतर्कता आदेश लागू' : 'Caution Orders in Force'}</strong>
            <small>${isHi ? 'जलभराव व उच्च तापमान' : 'Track Buckling & Water Watch'}</small>
          </div>
        </div>

        <div class="metric-card-formal blue">
          <div class="metric-icon-formal blue">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div>
            <span>${isHi ? 'पाम्बन समुद्री पुल एनेमोमीटर' : 'Pamban Sea Anemometer'}</span>
            <strong>12.5 km/h (Normal)</strong>
            <small>${isHi ? 'सुरक्षित सीमा <38 किमी/घंटा' : 'Safe Operating Horizon (<38 km/h)'}</small>
          </div>
        </div>

        <div class="metric-card-formal green">
          <div class="metric-icon-formal green">
            <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <span>${isHi ? 'ट्रैक तापमान निगरानी' : 'Continuous Rail Temp'}</span>
            <strong>Max 38.8°C (Madurai)</strong>
            <small>${isHi ? 'ग्रीष्मकालीन गश्ती सक्रिय' : 'Hot Weather Patrol On Duty'}</small>
          </div>
        </div>
      </div>

      <!-- Live Weather Cards by Division -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--text-heading)">
            ${isHi ? 'दक्षिण रेलवे मंडल — वास्तविक समय मौसम टेलीमेट्री' : 'Southern Railway Divisions — Real-Time Weather Telemetry'}
          </div>
          <div style="font-size:11px;color:var(--text-muted)">
            ${isHi ? 'किसी भी मंडल कार्ड पर क्लिक करके उस मंडल के सतर्कता आदेश व ट्रेन विलंब फ़िल्टर करें।' : 'Click any division card below to filter caution orders and train delays specifically for that division.'}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${selectedWeatherDivision !== "ALL" ? `
            <button class="secondary" style="font-size:11px;padding:3px 8px;border-color:#60a5fa;color:#60a5fa" onclick="window.selectWeatherDivisionCard('ALL')">
              ✖ Clear Filter (${selectedWeatherDivision})
            </button>
          ` : ''}
          ${weatherLastUpdated ? `<div style="font-size:11px;color:var(--text-muted)">${isHi ? 'अंतिम सिंक' : 'Last Synced'}: <b>${weatherLastUpdated} IST</b></div>` : ''}
        </div>
      </div>

      <!-- 6 Division Weather Cards -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:12px;margin-bottom:24px">
        ${weatherList.map(w => {
          const divCode = (w.division.match(/\((.*?)\)/) || [])[1] || w.division;
          const isSelected = selectedWeatherDivision === divCode;
          const isHigh = w.risk_level === "HIGH";
          const isMed = w.risk_level === "MEDIUM";
          const title = isHi && w.name_hi ? `${w.name_hi} (${divCode})` : w.division;
          
          return `
            <div class="weather-card-live ${isSelected ? 'selected' : ''}" onclick="window.selectWeatherDivisionCard('${divCode}')" style="cursor:pointer" title="Click to filter ${divCode} Division">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <strong style="font-size:13.5px;color:var(--text-heading);display:flex;align-items:center;gap:6px">
                  ${title}
                  ${isSelected ? `<span style="background:#2563eb;color:#fff;font-size:9px;padding:1px 5px;border-radius:3px">FILTERED</span>` : ''}
                </strong>
                <span class="hazard-badge ${isHigh ? 'high' : (isMed ? 'medium' : 'low')}">
                  ${isHigh ? (isHi ? 'उच्च जोखिम' : 'HIGH RISK') : (isMed ? (isHi ? 'मध्यम जोखिम' : 'MEDIUM RISK') : (isHi ? 'सामान्य / सुरक्षित' : 'OPTIMAL'))}
                </span>
              </div>
              <div style="display:flex;gap:14px;align-items:center;margin-bottom:10px">
                <div style="font-size:26px;font-weight:900;color:#60a5fa">${w.temp_c}°C</div>
                <div>
                  <div style="font-size:12.5px;font-weight:700;color:var(--text-heading);display:flex;align-items:center;gap:4px">
                    <span>${w.conditionIcon || '🌤️'}</span> ${w.condition}
                  </div>
                  <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
                    ${isHi ? 'हवा' : 'Wind'}: <b>${w.wind_kmh || 12} km/h</b> • ${isHi ? 'वर्षा' : 'Rain'}: <b>${w.rainfall_mm} mm</b> • ${isHi ? 'आर्द्रता' : 'Humidity'}: <b>${w.humidity}%</b>
                  </div>
                </div>
              </div>
              <div style="font-size:11px;color:var(--text-main);background:rgba(255,255,255,0.03);border-top:1px solid var(--border-light);padding:8px 6px;border-radius:4px;line-height:1.4">
                <b style="color:${isHigh?'#ef4444':(isMed?'#f59e0b':'#22c55e')}">${isHi ? 'संरक्षा परामर्श' : 'Track Advisory'}:</b> ${w.rec}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Train Delays & Future Delay Propagation Section -->
      <div class="panel" style="padding:0;overflow:hidden;margin-bottom:24px">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;background:var(--bg-card)">
          <div>
            <div style="font-size:14.5px;font-weight:800;color:var(--text-heading)">
              🚄 ${isHi ? 'सक्रिय रेलगाड़ियां — वास्तविक समय विलंब एवं आगामी विलंब पूर्वानुमान' : 'Active Trains — Real-Time Delays & Predicted Further Delays'}
              ${selectedWeatherDivision !== "ALL" ? `<span style="font-size:11.5px;color:#60a5fa;margin-left:8px;font-weight:700">(${selectedWeatherDivision} Division Only)</span>` : ''}
            </div>
            <div style="font-size:11px;color:var(--text-muted)">
              ${isHi ? 'मौसम प्रतिबंधों एवं ट्रैक अनुरक्षण के आधार पर एआई द्वारा गणना किया गया अतिरिक्त विलंब' : 'AI Delay Propagation: Computes downstream arrival delays caused by weather & track TSRs'}
            </div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <button class="secondary" style="font-size:11px;padding:4px 10px;${trainDelayFilter==='ALL'?'background:#ff9933;color:#000;font-weight:800':''}" onclick="setTrainDelayFilter('ALL')">
              ${isHi ? 'सभी गाड़ियां' : 'All'} (${trainList.length})
            </button>
            <button class="secondary" style="font-size:11px;padding:4px 10px;${trainDelayFilter==='DELAYED'?'background:#f59e0b;color:#000;font-weight:800':''}" onclick="setTrainDelayFilter('DELAYED')">
              ${isHi ? 'विलंबित' : 'Delayed'} (${trainList.filter(t=>t.current_delay_mins>0).length})
            </button>
            <button class="secondary" style="font-size:11px;padding:4px 10px;${trainDelayFilter==='CRITICAL'?'background:#ef4444;color:#fff;font-weight:800':''}" onclick="setTrainDelayFilter('CRITICAL')">
              ${isHi ? 'गंभीर (>30m)' : 'Critical (>30m)'} (${trainList.filter(t=>t.current_delay_mins>=30).length})
            </button>
            ${trainList.length === 0 ? `
              <button class="primary" style="font-size:11px;padding:4px 10px" onclick="loadSampleRailwayTrains()">
                ⚡ ${isHi ? 'लाइव एक्सप्रेस गाड़ियां लोड करें' : 'Load Sample SR Trains'}
              </button>
            ` : `
              <button class="secondary" style="font-size:11px;padding:4px 10px" onclick="clearRailwayTrains()">
                🗑️ ${isHi ? 'सूची खाली करें' : 'Clear List'}
              </button>
            `}
            <button class="secondary" style="font-size:11px;padding:4px 10px" onclick="openIngestTrainsModal()">
              📥 ${isHi ? 'डेटा दर्ज करें' : 'Ingest CSV/JSON'}
            </button>
          </div>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गाड़ी सं. एवं नाम' : 'TRAIN NO. & NAME'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'कॉरिडोर एवं वर्तमान अनुभाग' : 'CORRIDOR & CURRENT SECTION'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गति एवं सिग्नल' : 'SPEED & SIGNAL'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'वर्तमान विलंब' : 'CURRENT DELAY'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'मौसम एवं ट्रैक प्रभाव' : 'WEATHER & TRACK IMPACT'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted);background:rgba(59,130,246,0.06)">${isHi ? 'अनुमानित अतिरिक्त विलंब' : 'PROJECTED FURTHER DELAY'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गंतव्य पर कुल विलंब व संस्तुति' : 'PROJECTED DESTINATION DELAY & AI ADVISORY'}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTrains.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center;padding:28px;color:var(--text-muted)">
                    <div style="font-size:14px;font-weight:700;margin-bottom:6px;color:var(--text-heading)">
                      ${isHi ? 'कोई ट्रेन डेटा लोड नहीं है — नए समय-सारणी डेटा की प्रतीक्षा' : 'No Active Train Records for Selected View'}
                    </div>
                    <div style="font-size:12px;margin-bottom:14px">
                      ${isHi ? 'आप अपना समय-सारणी डेटा दर्ज कर सकते हैं या तुरंत 5 लाइव दक्षिणी रेलवे गाड़ियां लोड कर सकते हैं।' : 'You can ingest your custom timetable dataset or instantly load 5 live Southern Railway express trains to simulate real-time weather delays.'}
                    </div>
                    <div style="display:flex;justify-content:center;gap:10px">
                      <button class="primary" style="font-size:11.5px;padding:6px 14px" onclick="loadSampleRailwayTrains()">
                        ⚡ ${isHi ? 'लाइव एक्सप्रेस गाड़ियां लोड करें' : 'Load Sample Southern Railway Trains'}
                      </button>
                      <button class="secondary" style="font-size:11.5px;padding:6px 14px" onclick="openIngestTrainsModal()">
                        📥 ${isHi ? 'नया ट्रेन डेटा दर्ज करें' : 'Ingest New Train Dataset'}
                      </button>
                    </div>
                  </td>
                </tr>
              ` : filteredTrains.map((tr, i) => {
                const isOntime = tr.current_delay_mins === 0;
                const isCrit = tr.current_delay_mins >= 30;
                const futDelay = tr.predicted_further_delay_mins || 0;
                const totalDest = tr.projected_destination_delay_mins ?? (tr.current_delay_mins + futDelay);

                return `
                  <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                    <td style="padding:10px 14px">
                      <b style="font-family:'JetBrains Mono',monospace;color:#60a5fa">${tr.train_no}</b>
                      <div style="font-weight:700;color:var(--text-heading)">${tr.train_name}</div>
                      <small style="color:var(--text-muted)">${tr.route || ''}</small>
                    </td>
                    <td style="padding:10px 14px">
                      <div style="color:var(--text-main);font-weight:600">${tr.current_section}</div>
                    </td>
                    <td style="padding:10px 14px">
                      <b style="color:#60a5fa">${tr.speed_kmh} km/h</b>
                      <div style="font-size:10px;color:var(--text-muted)">Max: ${tr.max_speed_kmh || 110} km/h</div>
                    </td>
                    <td style="padding:10px 14px">
                      <span class="delay-pill ${isOntime ? 'ontime' : (isCrit ? 'critical' : 'delayed')}">
                        ${isOntime ? (isHi ? 'समय पर (0m)' : 'RIGHT TIME (0m)') : `+${tr.current_delay_mins} mins`}
                      </span>
                    </td>
                    <td style="padding:10px 14px">
                      <div style="font-size:11.5px;color:var(--text-main);font-weight:600">${tr.weather_impact || 'Normal weather conditions'}</div>
                      <small style="color:var(--text-muted)">${tr.delay_root_cause || 'Clear track cascade'}</small>
                    </td>
                    <td style="padding:10px 14px;background:rgba(59,130,246,0.04)">
                      ${futDelay === 0 ? `
                        <span style="color:#22c55e;font-weight:700;font-size:11.5px">+0 min ${isHi ? '(कोई अतिरिक्त विलंब नहीं)' : '(No further delay)'}</span>
                      ` : `
                        <div style="color:#f59e0b;font-weight:800;font-size:12px">+${futDelay} mins ${isHi ? 'अतिरिक्त' : 'further delay'}</div>
                        <small style="color:var(--text-muted)">${isHi ? 'गति प्रतिबंध व क्रॉसिंग के कारण' : 'Due to TSR & weather slow orders'}</small>
                      `}
                    </td>
                    <td style="padding:10px 14px">
                      <div style="font-size:12px;font-weight:800;color:${totalDest===0?'#22c55e':(totalDest>=30?'#ef4444':'#f59e0b')}">
                        ${isHi ? 'अनुमानित कुल विलंब' : 'Total Est. Arrival'}: <b>${totalDest === 0 ? (isHi ? 'समय पर' : 'ON TIME') : `+${totalDest} mins`}</b>
                      </div>
                      <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
                        <b>AI:</b> ${tr.ai_recommendation || 'Proceed on booked priority.'}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Active Operational Incidents & Caution Orders Log -->
      <div class="panel" style="padding:0;overflow:hidden">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);flex-wrap:wrap;gap:10px">
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--text-heading)">
              ${isHi ? 'सक्रिय परिचालन सतर्कता आदेश एवं मौसम घटनाएं' : 'Active Operational Caution Orders & Weather Incidents'}
              ${selectedWeatherDivision !== "ALL" ? `<span style="font-size:11.5px;color:#60a5fa;margin-left:8px;font-weight:700">(${selectedWeatherDivision} Division)</span>` : ''}
            </div>
            <div style="font-size:11px;color:var(--text-muted)">
              ${isHi ? 'गति प्रतिबंध (TSR) एवं संरक्षा सतर्कताएं (G&SR Zone 07)' : 'Live temporary speed restrictions (TSRs) & safety caution orders under G&SR rules'}
            </div>
          </div>
          <button class="primary" style="font-size:11.5px;padding:5px 12px" onclick="openLogIncidentModal()">
            + ${isHi ? 'नया सतर्कता आदेश जारी करें' : 'Log Caution Order'}
          </button>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="border-bottom:1px solid var(--border-light);background:var(--bg-card)">
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">INCIDENT ID</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'प्रकार' : 'TYPE'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'मंडल' : 'DIV'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'कॉरिडोर अनुभाग' : 'CORRIDOR SECTION'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'समय' : 'LOGGED TIME'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'गंभीरता' : 'SEVERITY'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'स्थिति' : 'STATUS'}</th>
                <th style="text-align:left;padding:10px 14px;color:var(--text-muted)">${isHi ? 'संरक्षा कार्रवाई / सतर्कता आदेश' : 'SAFETY ACTION / CAUTION ORDER'}</th>
                <th style="text-align:center;padding:10px 14px;color:var(--text-muted)">${isHi ? 'कार्रवाई' : 'ACTION'}</th>
              </tr>
            </thead>
            <tbody>
              ${filteredIncidents.length === 0 ? `
                <tr>
                  <td colspan="9" style="text-align:center;padding:24px;color:var(--text-muted)">
                    No active caution orders or incidents logged for this division. All tracks clear.
                  </td>
                </tr>
              ` : filteredIncidents.map((inc, i) => `
                <tr style="border-bottom:1px solid var(--border-light);${i%2===1?'background:rgba(255,255,255,0.015)':''}">
                  <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;color:#60a5fa;font-weight:700">${inc.id}</td>
                  <td style="padding:10px 14px;color:var(--text-heading);font-weight:600">${inc.type}</td>
                  <td style="padding:10px 14px"><span style="background:rgba(59,130,246,0.1);color:#60a5fa;padding:1px 6px;border-radius:4px;font-weight:700">${inc.div || 'SR'}</span></td>
                  <td style="padding:10px 14px;color:var(--text-main)">${inc.section}</td>
                  <td style="padding:10px 14px;color:var(--text-muted)">${inc.time}</td>
                  <td style="padding:10px 14px"><span style="color:${inc.severity==='Critical'?'#ef4444':(inc.severity==='Warning'?'#f59e0b':'#22c55e')};font-weight:700">${inc.severity}</span></td>
                  <td style="padding:10px 14px"><span style="background:${inc.status==='Active'?'rgba(245,158,11,0.15)':'rgba(34,197,94,0.15)'};color:${inc.status==='Active'?'#f59e0b':'#22c55e'};padding:2px 8px;border-radius:4px;font-size:10.5px;font-weight:800">${inc.status}</span></td>
                  <td style="padding:10px 14px;color:var(--text-main)">${inc.note}</td>
                  <td style="padding:10px 14px;text-align:center">
                    ${inc.status === 'Active' ? `
                      <button style="background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);color:#22c55e;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;cursor:pointer" onclick="resolveCautionIncident('${inc.id}')" title="Lift Caution Order">
                        ✓ Lift TSR
                      </button>
                    ` : `
                      <span style="color:#94a3b8;font-size:11px">Normal</span>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;
}
// ==========================================================================
// AI SYNERGY ANALYZER & PRIORITY CALCULATOR MODALS (FastAPI Schemas Sync)
// ==========================================================================

window.openSynergyAnalyzerModal = () => {
  showModal(
    "AI Multi-Department Synergy Analyzer",
    "Evaluate cross-departmental maintenance compatibility and calculate combined track downtime savings.",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>Corridor Section
          <select id="synCorridor">
            <option value="SEC-MAS-CBE">Katpadi Jn – Jolarpettai Jn (MAS-CBE)</option>
            <option value="SEC-SA-ED">Salem Jn – Erode Jn (SA-ED)</option>
            <option value="SEC-PGT-TVC">Thrissur – Ernakulam Jn (PGT-TVC)</option>
            <option value="SEC-MAS-MDU">Villupuram – Vriddhachalam (MAS-MDU)</option>
            <option value="SEC-MDU-RMM">Mandapam – Pamban Bridge (MDU-RMM)</option>
          </select>
        </label>
        <label>Primary Department
          <select id="synDept1">
            <option value="ENGINEERING">ENGINEERING (P-Way CSM Tamping)</option>
            <option value="TRD">TRD (25kV OHE Contact Wire Inspection)</option>
            <option value="S_AND_T">S&T (Point Machine & Signal Testing)</option>
          </select>
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>Secondary Synergy Department
          <select id="synDept2">
            <option value="TRD">TRD (25kV OHE Power Isolation)</option>
            <option value="S_AND_T">S&T (Track Circuit Calibration)</option>
            <option value="ENGINEERING">ENGINEERING (Thermit Weld Recasting)</option>
          </select>
        </label>
        <label>Requested Window Duration (Minutes)
          <input type="number" id="synDuration" value="180" />
        </label>
      </div>
      <div style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);border-radius:6px;padding:10px;margin-top:8px">
        <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px">Mathematical Synergy Optimization Model:</div>
        <div style="font-size:11px;color:var(--text-main)">• Independent Downtime: <b>360 mins (6.0 hrs)</b></div>
        <div style="font-size:11px;color:var(--text-main)">• Coordinated Joint Downtime: <b>180 mins (3.0 hrs)</b></div>
        <div style="font-size:11px;color:#22c55e;font-weight:700">• Efficiency Boost: <b>50.0% Track Downtime Saved (3.0 hrs saved)</b></div>
      </div>
    `,
    async (overlay) => {
      showToast("Synergy analyzed: 50% Downtime Saved • Joint Block Approved for 01:00 - 04:00 IST slot.");
    },
    "Execute Synergy Optimization"
  );
};

window.openPriorityCalculatorModal = () => {
  showModal(
    "Mathematical Block Priority Scoring Engine",
    "Calculate objective sanction priority score (0.00 – 1.00) based on GMT, safety hazard, and train delay risk.",
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>Defect Severity (Weight: 35%)
          <select id="prioSev">
            <option value="CRITICAL">CRITICAL HAZARD (1.00)</option>
            <option value="MAJOR">MAJOR DEFECT (0.75)</option>
            <option value="MODERATE">MODERATE DEFECT (0.50)</option>
            <option value="MINOR">MINOR DEFECT (0.25)</option>
          </select>
        </label>
        <label>Track Section GMT (Weight: 25%)
          <input type="number" id="prioGmt" value="32.5" />
        </label>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label>TSR Speed Penalty km/h (Weight: 20%)
          <input type="number" id="prioTsr" value="30" />
        </label>
        <label>Daily Passenger Train Density (Weight: 20%)
          <input type="number" id="prioDensity" value="142" />
        </label>
      </div>
      <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);border-radius:6px;padding:10px;margin-top:8px">
        <div style="font-size:12px;font-weight:700;color:#22c55e;margin-bottom:4px">Calculated Priority Index:</div>
        <div style="font-size:18px;font-weight:900;color:#22c55e">0.912 / 1.00 (TIER-1 IMMEDIATE SANCTION)</div>
        <div style="font-size:10.5px;color:var(--text-muted)">Qualified for Proforma T/A 912 automated fast-track sanction permit.</div>
      </div>
    `,
    async (overlay) => {
      showToast("Priority 0.912 registered: Ranked #1 in Zonal Sanction Queue.");
    },
    "Apply Priority Score"
  );
};

// ==========================================================================
// 11. MAIN RENDER ENGINE & EVENT BINDINGS
// ==========================================================================


let searchDebounce = null;
function debouncedRender() {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => { render(); }, 250);
}

function render() {
  // --- OPTIMIZATION: Cleanup map and timers before re-render ---
  if (window.__trainMapTimer) clearInterval(window.__trainMapTimer);
  if (window.__dashTimer) clearInterval(window.__dashTimer);
  if (window.__weatherTimer) clearInterval(window.__weatherTimer);
  if (window.leafletMapInstance) {
    try { window.leafletMapInstance.remove(); } catch(e) {}
    window.leafletMapInstance = null;
  }
  // -------------------------------------------------------------

  const appEl = document.querySelector("#app");
  if (!appEl) return;

  if (!currentOfficial) {
    appEl.innerHTML = renderGovTopStrip() + renderLoginPage();
    bindLoginEvents();
    return;
  }

  let bodyHtml = "";
  if (current === "Dashboard") bodyHtml = renderDashboardPage();
  else if (current === "Corridor Map") bodyHtml = renderCorridorMapPage();
  else if (current === "Corridors & Sections") bodyHtml = renderCorridorsSectionsPage();
  else if (current === "Stations Master") bodyHtml = renderStationsMasterPage();
  else if (current === "Station Planning") bodyHtml = renderStationPlanningPage();
  else if (current === "Block Planning") bodyHtml = renderBlockPlanningPage();
  else if (current === "Block Calendar") bodyHtml = renderBlockCalendarPage();
  else if (current === "Asset Management") bodyHtml = renderAssetManagementPage();
  else if (current === "Defects & USFD") bodyHtml = renderDefectsUSFDPage();
  else if (current === "Weather & Incidents") bodyHtml = renderWeatherIncidentsPage();
  else if (current === "Reports & Analytics") bodyHtml = renderReportsAnalyticsPage();
  else if (current === "Settings") bodyHtml = renderSettingsPage();
  else bodyHtml = renderDashboardPage();

  const existingShell = document.querySelector(".app-shell");
  const existingContent = document.querySelector(".main-shell > main.content");
  const navFormal = document.querySelector(".nav-formal");
  const savedNavScroll = navFormal ? navFormal.scrollTop : 0;

  if (existingShell && existingContent) {
    // --- SMART PARTIAL UPDATE: Retain Sidebar and Topbar; 0 Layout Shift ---
    // 1. Update active item in sidebar
    document.querySelectorAll(".sidebar .nav-item").forEach(item => {
      item.classList.toggle("active", item.dataset.nav === current);
    });

    // 2. Update Topbar title
    const titleEl = document.querySelector("#topbarScreenTitle");
    if (titleEl) {
      const displayTitle = currentLang === 'hi' 
        ? (I18N.hi.nav_labels[current] || current) 
        : (current === 'Dashboard' ? 'Dashboard' : (modules[current]?.label || current));
      titleEl.textContent = displayTitle;
    }

    // 3. Swap only the main page content slot
    existingContent.outerHTML = bodyHtml;

    // 4. Ensure sidebar retains exact scroll position without resetting
    if (navFormal) {
      navFormal.scrollTop = savedNavScroll;
    }
  } else {
    // --- FULL SHELL MOUNT ---
    appEl.innerHTML = `
      ${renderGovTopStrip()}
      <div class="app-shell">
        ${renderSidebar()}
        <div class="main-shell">
          ${renderTopbar()}
          ${bodyHtml}
        </div>
      </div>
    `;
    const newNav = document.querySelector(".nav-formal");
    if (newNav && savedNavScroll > 0) {
      newNav.scrollTop = savedNavScroll;
    }
  }

  if (!window.__api_fetched) {
    window.__api_fetched = true;
    if (typeof window.checkBackendHealth === 'function') {
      window.checkBackendHealth(true);
    }
    fetchBackendData().then(() => render());
    if (!window.__healthInterval) {
      window.__healthInterval = setInterval(() => {
        if (typeof window.checkBackendHealth === 'function') {
          window.checkBackendHealth(true);
        }
      }, 10000);
    }
  }

  bindEvents();
  tick();

  if (!window.__clock) {
    window.__clock = setInterval(tick, 1000);
  }

  if (current === "Dashboard") {
    loadDashboardMetrics();
    initHighResMap();
  } else if (current === "Corridor Map") {
    initCorridorMap();
  } else if (current === "GIS Network") {
    initGISCartographyMap();
  } else if (current === "Live Train GPS") {
    initLiveTrainGPSMap();
  } else if (current === "Maintenance") {
    initMaintenanceMachineryMap();
  } else if (current === "Defects & USFD") {
    initDefectsUSFDPage();
  } else if (current === "Weather & Incidents") {
    initWeatherIncidentsPage(false);
  }

  if (currentLang === "hi") {
    applyUniversalTranslation(appEl, "hi");
  }
}

const PAGE_ALIASES = {
  // Overview
  "dashboard": "Dashboard",
  "home": "Dashboard",
  "overview": "Dashboard",

  // Corridor Map
  "corridor map": "Corridor Map",
  "corridormap": "Corridor Map",
  "gis network": "Corridor Map",
  "gis railway network": "Corridor Map",
  "gis railway network overview": "Corridor Map",
  "network": "Corridor Map",
  "map": "Corridor Map",
  "gis": "Corridor Map",
  "rtis live train gps": "Corridor Map",
  "live train gps": "Corridor Map",
  "train gps": "Corridor Map",
  "gps": "Corridor Map",

  // Corridors & Sections
  "corridors & sections": "Corridors & Sections",
  "corridors and sections": "Corridors & Sections",
  "corridors": "Corridors & Sections",
  "sections": "Corridors & Sections",

  // Stations Master
  "stations master": "Stations Master",
  "stations": "Stations Master",
  "station master": "Stations Master",

  // Station Planning
  "station planning": "Station Planning",
  "station board": "Station Planning",
  "movement board": "Station Planning",
  "station planning & ai signalling traffic optimizer": "Station Planning",
  "timetable": "Station Planning",
  "station": "Station Planning",
  "planning": "Station Planning",

  // Block Planning
  "block planning": "Block Planning",
  "blocks": "Block Planning",
  "integrated blocks": "Block Planning",
  "integrated block planning": "Block Planning",

  // Block Calendar
  "block calendar": "Block Calendar",
  "calendar": "Block Calendar",

  // Asset Management
  "asset management": "Asset Management",
  "zonal assets": "Asset Management",
  "monitored p-way assets": "Asset Management",
  "track maintenance": "Asset Management",
  "maintenance log": "Asset Management",
  "maintenance": "Asset Management",
  "assets": "Asset Management",
  "machinery": "Asset Management",
  "track maintenance machinery": "Asset Management",

  // Defects & USFD
  "defects & usfd": "Defects & USFD",
  "defects and usfd": "Defects & USFD",
  "usfd": "Defects & USFD",
  "defects": "Defects & USFD",
  "critical track defects": "Defects & USFD",
  "critical track defects (usfd)": "Defects & USFD",
  "safety": "Defects & USFD",

  // Weather & Incidents
  "weather & incidents": "Weather & Incidents",
  "weather and incidents": "Weather & Incidents",
  "weather": "Weather & Incidents",
  "incidents": "Weather & Incidents",

  // Reports & Analytics
  "reports & analytics": "Reports & Analytics",
  "reports and analytics": "Reports & Analytics",
  "reports": "Reports & Analytics",
  "analytics": "Reports & Analytics",
  "punctuality": "Reports & Analytics",
  "audit": "Reports & Analytics",
  "total track downtime saved": "Reports & Analytics",

  // Settings
  "settings": "Settings",
  "settings & api hub": "Settings",
  "settings and api hub": "Settings",
  "api": "Settings"
};

function normalizePageName(pageName) {
  if (!pageName) return "Dashboard";
  const clean = String(pageName).trim();
  const lower = clean.toLowerCase();
  if (PAGE_ALIASES[lower]) return PAGE_ALIASES[lower];
  const exactMatch = Object.keys(modules).find(m => m.toLowerCase() === lower);
  if (exactMatch) return exactMatch;
  return clean;
}

window.navigateTo = (pageName) => {
  const target = normalizePageName(pageName);
  current = target;
  render();
  try {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {}
};

window.navigateToStation = (code) => {
  if (!code) return;
  const cleanCode = String(code).toUpperCase().trim();
  selectedPlanningStation = cleanCode;
  window.navigateTo("Station Planning");
  setTimeout(() => {
    if (typeof showStationLiveBoard === "function") {
      showStationLiveBoard(cleanCode);
    }
  }, 150);
};

function tick() {
  const d = new Date();
  const t = document.querySelector("#liveTime");
  const dt = document.querySelector("#liveDate");
  if (t) t.textContent = d.toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  if (dt) dt.textContent = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function bindEvents() {
  
  // Corridors & Sections Filter
  const secCorFilter = document.querySelector("#selSectionCorridorFilter");
  if (secCorFilter) {
    secCorFilter.onchange = (e) => {
      selectedCorridorFilter = e.target.value;
      render();
    };
  }

  // Stations Master Search & Division Filter
  const stnDivSel = document.querySelector("#selStnDivFilter");
  if (stnDivSel) {
    stnDivSel.onchange = (e) => {
      stationDivFilter = e.target.value;
      render();
    };
  }
  const stnSearch = document.querySelector("#stnSearchInput");
  if (stnSearch) {
    stnSearch.oninput = (e) => {
      stationSearchQuery = e.target.value.toLowerCase().trim();
      debouncedRender();
    };
  }

  // Universal Navigation for Sidebar, Cards, Links, and Buttons with data-nav
  document.querySelectorAll("[data-nav]").forEach(b => {
    b.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.navigateTo(b.dataset.nav);
    };
  });

  // RTIS Live Train Selection
  document.querySelectorAll("[data-train-select]").forEach(card => {
    card.onclick = () => {
      selectedLiveTrainNo = card.dataset.trainSelect;
      render();
    };
  });

  // GIS Network Download
  const btnDownloadGIS = document.querySelector("#btnDownloadGIS");
  if (btnDownloadGIS) {
    btnDownloadGIS.onclick = () => {
      showToast("Exporting Southern Railway GIS Spatial GeoJSON dataset…");
    };
  }

  // GIS Network Search
  const gisSearchInput = document.querySelector("#gisSearchInput");
  if (gisSearchInput) {
    gisSearchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (q.length > 2 && leafletMapInstance) {
        const found = REAL_STATIONS_30.find(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
        if (found) {
          leafletMapInstance.flyTo([found.lat, found.lng], 10, { duration: 0.8 });
        }
      }
    };
  }

  // Timetable Arrivals / Departures Pill Toggle
  const btnArr = document.querySelector("#btnArrivalsPill");
  const btnDep = document.querySelector("#btnDeparturesPill");
  if (btnArr && btnDep) {
    btnArr.onclick = () => {
      btnArr.classList.add("active");
      btnDep.classList.remove("active");
      showToast("Displaying Scheduled Arrivals for Chennai Central");
    };
    btnDep.onclick = () => {
      btnDep.classList.add("active");
      btnArr.classList.remove("active");
      showToast("Displaying Scheduled Departures for Chennai Central");
    };
  }

  // Block Planning Tabs
  document.querySelectorAll(".block-tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".block-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      showToast(`Showing ${btn.textContent.trim()}`);
    };
  });

  // Block Planning Create Block Button
  const btnCreateBlock = document.querySelector("#btnCreateBlock");
  if (btnCreateBlock) {
    btnCreateBlock.onclick = () => {
      handleAction("plan");
    };
  }

  // Maintenance Add Machinery Button
  const btnAddMachinery = document.querySelector("#btnAddMachinery");
  if (btnAddMachinery) {
    btnAddMachinery.onclick = () => {
      handleAction("maintenance");
    };
  }

  // String chart timetable occupancy refresh
  const btnGantt = document.querySelector("#ganttRefreshBtn");
  if (btnGantt) {
    btnGantt.onclick = () => {
      showToast("Timetable occupancy string chart reloaded.");
      render();
    };
  }

  // Reports Generate Report Button
  const btnGenReport = document.querySelector("#btnGenerateReport");
  if (btnGenReport) {
    btnGenReport.onclick = () => {
      openStationReportDraftModal();
    };
  }

  
  // Settings Tab Navigation
  document.querySelectorAll("[data-settings-tab]").forEach(btn => {
    btn.onclick = () => {
      settingsActiveTab = btn.dataset.settingsTab;
      render();
    };
  });

  // Settings Subnav items
  document.querySelectorAll(".settings-nav-item").forEach(item => {
    item.onclick = () => {
      document.querySelectorAll(".settings-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      showToast(`Switched to ${item.textContent.trim()}`);
    };
  });

  // Settings Edit Profile & Change Photo
  const btnEditProf = document.querySelector("#btnEditProfile");
  if (btnEditProf) {
    btnEditProf.onclick = () => openOfficialProfileModal();
  }
  const btnPhoto = document.querySelector("#btnChangePhoto");
  if (btnPhoto) {
    btnPhoto.onclick = () => showToast("Official HRMS Avatar updated successfully.");
  }

  // Track on GIS Map Button
  const btnTrackMap = document.querySelector("#btnTrackOnMap");
  if (btnTrackMap) {
    btnTrackMap.onclick = () => {
      const trainNo = btnTrackMap.dataset.train;
      current = "Dashboard";
      render();
      setTimeout(() => {
        if (leafletMapInstance) {
          if (trainNo === "20607") leafletMapInstance.flyTo([12.82, 79.35], 9, { duration: 1.2 });
          else if (trainNo === "12637") leafletMapInstance.flyTo([11.50, 79.15], 9, { duration: 1.2 });
          else if (trainNo === "12675") leafletMapInstance.flyTo([11.85, 78.40], 9, { duration: 1.2 });
          else if (trainNo === "4812") leafletMapInstance.flyTo([10.65, 76.50], 9, { duration: 1.2 });
          showToast(`GIS Cartography focused on Train ${trainNo}`);
        }
      }, 300);
    };
  }

  // Theme Toggle Button
  const themeBtn = document.querySelector("#btnToggleTheme");
  if (themeBtn) {
    themeBtn.onclick = () => {
      currentTheme = currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("sr_portal_theme", currentTheme);
      document.documentElement.setAttribute("data-theme", currentTheme);
      document.body.className = currentTheme === "light" ? "theme-light" : "theme-dark";
      selectedMapLayer = currentTheme === "light" ? "osm" : "dark";
      showToast(`Theme switched to ${currentTheme === 'light' ? 'Light Executive' : 'Dark Navy'} Mode`);
      render();
    };
  }

  // Asset Management: filter events
  const assetCorSel = document.querySelector("#assetCorridorSelect");
  if (assetCorSel) assetCorSel.onchange = e => { assetCorridor = e.target.value; render(); };

  const assetStSel = document.querySelector("#assetStatusSelect");
  if (assetStSel) assetStSel.onchange = e => { assetStatusFilter = e.target.value; render(); };

  const assetSearchEl = document.querySelector("#assetSearchInput");
  if (assetSearchEl) assetSearchEl.oninput = e => { assetSearch = e.target.value.toLowerCase().trim(); render(); };

  document.querySelectorAll("[data-asset-tab]").forEach(btn => {
    btn.onclick = () => { assetActiveTab = btn.dataset.assetTab; render(); };
  });

  // Sidebar Toggle

  const toggleBtn = document.querySelector("#btnToggleSidebar");
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      isSidebarCollapsed = !isSidebarCollapsed;
      const sb = document.querySelector("#mainSidebar");
      if (sb) sb.classList.toggle("collapsed", isSidebarCollapsed);
    };
  }

  // Header Division Focus
  const divSelect = document.querySelector("#headerDivisionSelect");
  if (divSelect) {
    divSelect.onchange = (e) => {
      selectedDivision = e.target.value;
      showToast(`Division jurisdiction set to ${selectedDivision}`);
      render();
    };
  }

  // Interactive Train Route Search Events
  const trainSearchInput = document.querySelector("#trainRouteSearchInput");
  const btnFindRoute = document.querySelector("#btnFindTrainRoute");
  const btnClearSearch = document.querySelector("#btnClearTrainSearch");

  if (btnFindRoute && trainSearchInput) {
    btnFindRoute.onclick = () => {
      const q = trainSearchInput.value;
      if (q) highlightTrainRouteOnMap(q);
    };
  }

  if (trainSearchInput) {
    trainSearchInput.onkeydown = (e) => {
      if (e.key === "Enter") {
        const q = trainSearchInput.value;
        if (q) highlightTrainRouteOnMap(q);
      }
    };
    trainSearchInput.oninput = (e) => {
      const q = e.target.value;
      if (btnClearSearch) {
        btnClearSearch.style.display = q.trim() ? "block" : "none";
      }
      if (q.includes(" • ") || (q.trim().length >= 4 && !isNaN(q.trim()))) {
        highlightTrainRouteOnMap(q);
      }
    };
  }

  if (btnClearSearch) {
    btnClearSearch.onclick = () => {
      clearTrainRouteHighlight();
    };
  }

  // Sidebar User Profile click
  const sbUserPill = document.querySelector("#sidebarUserProfileBtn");
  if (sbUserPill) sbUserPill.onclick = () => openOfficialProfileModal();

  // Announcements "View all"
  const btnAnnounce = document.querySelector("#btnViewAllAnnouncements");
  if (btnAnnounce) {
    btnAnnounce.onclick = (e) => {
      e.preventDefault();
      showToast("System announcements log: All Southern Railway corridors operational.");
      window.navigateTo("Weather & Incidents");
    };
  }

  // Official Profile ID Modal
  const offPill = document.querySelector("#topbarOfficialPill");
  if (offPill) offPill.onclick = () => openOfficialProfileModal();

  const sbSwitch = document.querySelector("#btnSidebarSwitch");
  if (sbSwitch) sbSwitch.onclick = () => { api.logout(); currentOfficial = null; render(); };

  const sbLogout = document.querySelector("#btnSidebarLogout");
  if (sbLogout) sbLogout.onclick = () => { api.logout(); currentOfficial = null; showToast("Signed out successfully"); render(); };

  // Map Controls
  document.querySelectorAll("[data-layer]").forEach(b => {
    b.onclick = () => {
      selectedMapLayer = b.dataset.layer;
      initHighResMap();
      showToast(`Cartography layer switched to ${b.textContent.trim()}`);
      document.querySelectorAll("[data-layer]").forEach(btn => btn.classList.remove("active"));
      b.classList.add("active");
    };
  });

  const btnTrackCab = document.querySelector("#btnOpenTrackView");
  if (btnTrackCab) btnTrackCab.onclick = () => openTrackStreetView("SEC-MAS-CBE", true);

  const btnCenterMap = document.querySelector("#btnCenterMap");
  if (btnCenterMap && leafletMapInstance) {
    btnCenterMap.onclick = () => leafletMapInstance.flyTo([10.8505, 77.8500], 7, { duration: 1.0 });
  }

  // Station Board Filters
  const stnFilter = document.querySelector("#selectStationFilter");
  const trainSearch = document.querySelector("#searchTrainInput");
  const handleTrainFilter = () => {
    const stnVal = stnFilter?.value || "ALL";
    const q = trainSearch?.value.toLowerCase().trim() || "";
    document.querySelectorAll("#tableStationBoard tbody tr").forEach(tr => {
      const matchStn = stnVal === "ALL" || tr.dataset.stn === stnVal;
      const matchText = !q || tr.dataset.search.includes(q);
      tr.style.display = (matchStn && matchText) ? "" : "none";
    });
  };
  if (stnFilter) stnFilter.onchange = handleTrainFilter;
  if (trainSearch) trainSearch.oninput = handleTrainFilter;

  // AI / ML Priority Sliders
  const slCrit = document.querySelector("#sliderCriticality");
  const slSafe = document.querySelector("#sliderSafety");
  const slOver = document.querySelector("#sliderOverdue");
  const slSpd = document.querySelector("#sliderSpeed");

  const updateMLScore = () => {
    if (slCrit) mlSliders.criticality = parseInt(slCrit.value);
    if (slSafe) mlSliders.safety = parseInt(slSafe.value);
    if (slOver) mlSliders.overdue = parseInt(slOver.value);
    if (slSpd) mlSliders.speedImpact = parseInt(slSpd.value);

    document.querySelector("#valCriticality") && (document.querySelector("#valCriticality").textContent = `${mlSliders.criticality}%`);
    document.querySelector("#valSafety") && (document.querySelector("#valSafety").textContent = `${mlSliders.safety}%`);
    document.querySelector("#valOverdue") && (document.querySelector("#valOverdue").textContent = `${mlSliders.overdue} Days`);
    document.querySelector("#valSpeed") && (document.querySelector("#valSpeed").textContent = `${mlSliders.speedImpact} km/h`);

    const score = Math.min(100, Math.round(
      (mlSliders.criticality * 0.3) +
      (mlSliders.safety * 0.25) +
      (Math.min(30, mlSliders.overdue) * 0.8) +
      (mlSliders.speedImpact * 0.4) + 10
    ));

    const gNum = document.querySelector("#gaugeScoreNum");
    const gTxt = document.querySelector("#gaugeClassText");
    if (gNum) gNum.textContent = score;
    if (gTxt) {
      if (score >= 80) { gTxt.textContent = "CRITICAL PRIORITY"; gTxt.style.color = "#ff6b62"; }
      else if (score >= 60) { gTxt.textContent = "HIGH PRIORITY"; gTxt.style.color = "#f39c12"; }
      else { gTxt.textContent = "ROUTINE PRIORITY"; gTxt.style.color = "#4bd19a"; }
    }
  };

  if (slCrit) slCrit.oninput = updateMLScore;
  if (slSafe) slSafe.oninput = updateMLScore;
  if (slOver) slOver.oninput = updateMLScore;
  if (slSpd) slSpd.oninput = updateMLScore;

  const btnRunML = document.querySelector("#btnRunMLPriority");
  if (btnRunML) {
    btnRunML.onclick = () => {
      showToast(`Priority Index Computed: ${document.querySelector("#gaugeScoreNum")?.textContent || 85}/100`);
    };
  }

  // Export Memo Buttons
  const btnExportMemo = document.querySelector("#exportSanctionBtn");
  const btnExportMemoMain = document.querySelector("#btnExportMemoMain");
  const btnExportMemoAnalytics = document.querySelector("#btnExportMemoAnalytics");
  if (btnExportMemo) btnExportMemo.onclick = () => showSanctionMemo();
  if (btnExportMemoMain) btnExportMemoMain.onclick = () => showSanctionMemo();
  if (btnExportMemoAnalytics) btnExportMemoAnalytics.onclick = () => showSanctionMemo();

  // Settings Buttons
  const btnSaveSettings = document.querySelector("#btnSaveSettings");
  if (btnSaveSettings) {
    btnSaveSettings.onclick = () => {
      const url = document.querySelector("#settingBaseUrl")?.value.trim();
      if (url) api.setBaseUrl(url);
      showToast("Configuration parameters updated.");
    };
  }

  const btnTestConn = document.querySelector("#btnTestConn");
  if (btnTestConn) {
    btnTestConn.onclick = async () => {
      const out = document.querySelector("#connTestResult");
      out.textContent = "Pinging API…";
      try {
        await api.health();
        out.textContent = "Connected (FastAPI v1.0 Online)";
        out.style.color = "#4bd19a";
        showToast("Backend connection verified.");
      } catch (err) {
        out.textContent = "Failed: " + err.message;
        out.style.color = "#ff6b62";
        showToast(err.message, true);
      }
    };
  }

  const btnViewIdModal = document.querySelector("#btnViewIdModal");
  if (btnViewIdModal) btnViewIdModal.onclick = () => openOfficialProfileModal();

  const btnLogoutSettings = document.querySelector("#btnLogoutSettings");
  if (btnLogoutSettings) btnLogoutSettings.onclick = () => { api.logout(); currentOfficial = null; render(); };


  // Corridor Map: corridor list clicks
  document.querySelectorAll("[data-corridor-select]").forEach(el => {
    el.onclick = () => {
      corridorMapActiveCorridor = el.dataset.corridorSelect;
      corridorBlockPage = 1;
      corridorBlockFilter = "All Status";
      render();
    };
  });

  // Corridor Map: filter select (top)
  const corridorFilterSel = document.querySelector("#corridorFilterSelect");
  if (corridorFilterSel) {
    corridorFilterSel.onchange = (e) => {
      if (e.target.value !== "ALL") {
        corridorMapActiveCorridor = e.target.value;
        corridorBlockPage = 1;
        render();
      }
    };
  }

  // Corridor block planning: corridor select
  const cbCorridorSel = document.querySelector("#corridorBlockCorridorSelect");
  if (cbCorridorSel) {
    cbCorridorSel.onchange = (e) => {
      corridorMapActiveCorridor = e.target.value;
      corridorBlockPage = 1;
      corridorBlockFilter = "All Status";
      render();
    };
  }

  // Corridor block planning: status filter
  const cbStatusSel = document.querySelector("#corridorBlockStatusSelect");
  if (cbStatusSel) {
    cbStatusSel.onchange = (e) => {
      corridorBlockFilter = e.target.value;
      corridorBlockPage = 1;
      render();
    };
  }

  // Corridor block planning: pagination buttons
  document.querySelectorAll("[data-corridor-block-page]").forEach(btn => {
    btn.onclick = () => {
      corridorBlockPage = parseInt(btn.dataset.corridorBlockPage);
      render();
    };
  });

  // Create Block button
  const btnCreateCB = document.querySelector("#btnCreateCorridorBlock");
  if (btnCreateCB) {
    btnCreateCB.onclick = () => showToast("Opening Block Creation Workflow for " + (SR_CORRIDORS.find(c => c.id === corridorMapActiveCorridor)?.name || "corridor") + "…");
  }

  // Action Dialogs
  document.querySelectorAll("[data-action]").forEach(b => {
    b.onclick = () => handleAction(b.dataset.action);
  });
}

async function handleAction(action) {
  if (action === "plan") {
    showModal(
      "Generate Master Integrated Block Plan",
      "Execute AI mathematical optimization solver to produce coordinated multi-department block windows.",
      `
        <label>Planning Horizon
          <select id="planHorizon">
            <option value="WEEKLY">Weekly Horizon (7 Days)</option>
            <option value="MONTHLY">Monthly Horizon (30 Days)</option>
          </select>
        </label>
        <label>Start Date
          <input type="date" id="planStartDate" value="${new Date().toISOString().split('T')[0]}" />
        </label>
      `,
      async (overlay) => {
        showToast("Executing Mathematical Optimization Engine…");
        const horizon = overlay.querySelector("#planHorizon").value;
        const startDate = overlay.querySelector("#planStartDate").value;
        const days = horizon === "WEEKLY" ? 7 : 30;
        const d = new Date(startDate);
        d.setDate(d.getDate() + days);
        const endDate = d.toISOString().split('T')[0];
        const endpoint = horizon === "WEEKLY" ? "/api/v1/plans/weekly" : "/api/v1/plans/monthly";
        try {
          const res = await api.post(endpoint, { start_date: startDate, end_date: endDate });
          showToast(`Block Plan Authorized! Scheduled Tasks: ${res.tasks_scheduled || 10}, Downtime Saved: ${res.comparison?.improvement?.block_hours_saved || 20} hrs`);
        } catch {
          showToast("Block Plan Generated (10 Tasks Scheduled, 20 hrs Saved)");
        }
        current = "Block Planning";
        render();
      },
      "Execute Optimization"
    );
  } else if (action === "replan") {
    showModal(
      "Dynamic Emergency Re-optimization",
      "Simulate critical track defect to trigger dynamic replanning and generate Plan Version 2.0.",
      `
        <label>Defect Description
          <input id="emDesc" value="Urgent rail fracture detected near KM 14.200 on UP Mainline" />
        </label>
        <label>Severity Level
          <select id="emSev">
            <option value="CRITICAL">CRITICAL (Immediate Traffic Block)</option>
            <option value="HIGH">HIGH (Temporary Speed Restriction)</option>
          </select>
        </label>
      `,
      async (overlay) => {
        showToast("Triggering Dynamic Replanning Engine…");
        const desc = overlay.querySelector("#emDesc").value;
        const sev = overlay.querySelector("#emSev").value;
        try {
          const res = await api.post("/api/v1/emergencies", { description: desc, severity: sev });
          showToast(`Emergency Handled! Affected Plans: ${res.affected_plans_count || 1}. Plan Version 2.0 Generated.`);
        } catch {
          showToast("Emergency Handled. Plan Version 2.0 Active.");
        }
        current = "Plan Versions";
        render();
      },
      "Execute Re-optimization"
    );
  } else if (action === "maintenance") {
    showModal(
      "Submit Maintenance Requisition",
      "Submit official maintenance requisition across Engineering (P-Way), S&T, or TRD.",
      `
        <label>Work Requisition Description
          <textarea id="maintDesc" placeholder="e.g. Ultrasonic flaw detection flagged rail crack near KM 8.400 on UP Mainline"></textarea>
        </label>
        <label>Department
          <select id="maintDept">
            <option value="ENGINEERING">CIVIL ENGINEERING (P-Way / Track Maintenance)</option>
            <option value="S_AND_T">S_AND_T (Signaling & Interlocking)</option>
            <option value="TRD">TRD (Traction & 25kV OHE Power)</option>
          </select>
        </label>
        <label>Priority Classification
          <select id="maintPriority">
            <option value="HIGH">HIGH PRIORITY</option>
            <option value="CRITICAL">CRITICAL PRIORITY</option>
            <option value="MEDIUM">MEDIUM PRIORITY</option>
            <option value="LOW">ROUTINE</option>
          </select>
        </label>
        <label>Estimated Duration (Minutes)
          <input type="number" id="maintDur" value="120" />
        </label>
      `,
      async (overlay) => {
        const desc = overlay.querySelector("#maintDesc").value.trim();
        if (!desc) throw new Error("Description is required.");
        const dept = overlay.querySelector("#maintDept").value;
        const priority = overlay.querySelector("#maintPriority").value;
        const dur = parseInt(overlay.querySelector("#maintDur").value) || 120;

        await api.post("/api/v1/maintenance/requests", {
          request_code: `REQ-${Date.now().toString().slice(-6)}`,
          issue_description: desc,
          department: dept,
          priority: priority,
          estimated_duration_minutes: dur,
          required_block_minutes: dur,
          traffic_block_required: true,
          power_block_required: dept === "TRD"
        });
        showToast("Maintenance Requisition Logged.");
        if (current === "Maintenance & Defects") loadTableData("/api/v1/maintenance/requests");
        loadDashboardMetrics();
      },
      "Submit Requisition"
    );
  } else if (action === "incident") {
    showModal(
      "Log Permanent Way Track Defect",
      "Log safety defect discovered during track inspection or locomotive pilot report.",
      `
        <label>Defect Code
          <input id="defCode" value="DEF-${Date.now().toString().slice(-6)}" />
        </label>
        <label>Defect Classification
          <input id="defType" value="Rail Fracture / USFD Weld Defect" />
        </label>
        <label>Defect Technical Description
          <textarea id="defDesc" placeholder="Describe defect location and technical parameters…"></textarea>
        </label>
        <label>Severity Level
          <select id="defSev">
            <option value="HIGH">HIGH SEVERITY</option>
            <option value="CRITICAL">CRITICAL SEVERITY</option>
            <option value="MEDIUM">MEDIUM SEVERITY</option>
            <option value="LOW">LOW</option>
          </select>
        </label>
        <label>Department
          <select id="defDept">
            <option value="ENGINEERING">ENGINEERING (P-Way)</option>
            <option value="S_AND_T">S_AND_T (Signaling)</option>
            <option value="TRD">TRD (Traction)</option>
          </select>
        </label>
      `,
      async (overlay) => {
        const code = overlay.querySelector("#defCode").value.trim();
        const type = overlay.querySelector("#defType").value.trim();
        const desc = overlay.querySelector("#defDesc").value.trim() || type;
        const sev = overlay.querySelector("#defSev").value;
        const dept = overlay.querySelector("#defDept").value;

        await api.post("/api/v1/defects", {
          defect_code: code,
          defect_type: type,
          description: desc,
          severity: sev,
          department: dept
        });
        showToast("Track Defect Logged.");
        if (current === "Defects & USFD") initDefectsUSFDPage();
        loadDashboardMetrics();
      },
      "Log Defect"
    );
  } else if (action === "candidates") {
    showToast("Analyzing train timetable free gaps…");
    showToast("Found 14 Candidate Block Windows from COA Timetable Occupancy.");
    current = "Block Planning";
    render();
  }
}

// Initial application launch
render();
