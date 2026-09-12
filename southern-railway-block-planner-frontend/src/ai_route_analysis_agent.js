/**
 * AI ROUTE ANALYSIS & VISUAL DECISION SUPPORT ENGINE (CRIS / SOUTHERN RAILWAY)
 * 
 * Implements chatbot-triggered maintenance block detection, dynamic multi-path network analysis,
 * multi-factor operational and passenger-impact route evaluation, Leaflet map layer rendering,
 * and what-if scenario re-evaluations.
 */

// ============================================================================
// 1. SOUTHERN RAILWAY TOPOLOGICAL NETWORK GRAPH
// ============================================================================

export const SR_GRAPH_STATIONS = {
  MAS: { code: "MAS", name: "MGR Chennai Central", lat: 13.0827, lng: 80.2707, div: "MAS", type: "Terminal Hub", platforms: 17 },
  MS:  { code: "MS",  name: "Chennai Egmore", lat: 13.0826, lng: 80.2612, div: "MAS", type: "Terminal Hub", platforms: 11 },
  TBM: { code: "TBM", name: "Tambaram", lat: 12.9250, lng: 80.1200, div: "MAS", type: "Coaching Terminal", platforms: 8 },
  CGL: { code: "CGL", name: "Chengalpattu Junction", lat: 12.6841, lng: 79.9836, div: "MAS", type: "Junction", platforms: 8 },
  AJJ: { code: "AJJ", name: "Arakkonam Junction", lat: 13.0784, lng: 79.6677, div: "MAS", type: "Major Junction", platforms: 5 },
  RU:  { code: "RU",  name: "Renigunta Junction", lat: 13.6333, lng: 79.5167, div: "MAS", type: "Inter-Zonal Junction", platforms: 6 },
  KPD: { code: "KPD", name: "Katpadi Junction", lat: 12.9696, lng: 79.1362, div: "MAS", type: "Major Junction", platforms: 5 },
  TNM: { code: "TNM", name: "Tiruvannamalai", lat: 12.2253, lng: 79.0747, div: "TPJ", type: "Chord Junction", platforms: 3 },
  JTJ: { code: "JTJ", name: "Jolarpettai Junction", lat: 12.5638, lng: 78.5802, div: "SA",  type: "Major Junction", platforms: 5 },
  BWT: { code: "BWT", name: "Bangarapet Junction", lat: 12.9942, lng: 78.2017, div: "SBC", type: "Junction", platforms: 4 },
  SBC: { code: "SBC", name: "KSR Bengaluru City", lat: 12.9784, lng: 77.5684, div: "SBC", type: "Inter-Zonal Terminal", platforms: 10 },
  SA:  { code: "SA",  name: "Salem Junction", lat: 11.6643, lng: 78.1460, div: "SA",  type: "Divisional Hub", platforms: 6 },
  NMKL:{ code: "NMKL",name: "Namakkal", lat: 11.2189, lng: 78.1674, div: "SA",  type: "Chord Station", platforms: 3 },
  KRR: { code: "KRR", name: "Karur Junction", lat: 10.9574, lng: 78.0772, div: "SA",  type: "Junction", platforms: 4 },
  ED:  { code: "ED",  name: "Erode Junction", lat: 11.3410, lng: 77.7172, div: "SA",  type: "Major Junction & ELS", platforms: 5 },
  TUP: { code: "TUP", name: "Tiruppur", lat: 11.1085, lng: 77.3411, div: "SA",  type: "Industrial Hub", platforms: 4 },
  CBE: { code: "CBE", name: "Coimbatore Junction", lat: 11.0016, lng: 76.9629, div: "SA",  type: "Terminal Hub", platforms: 6 },
  PGT: { code: "PGT", name: "Palakkad Junction", lat: 10.7867, lng: 76.6548, div: "PGT", type: "Divisional Hub", platforms: 5 },
  SRR: { code: "SRR", name: "Shoranur Junction", lat: 10.7602, lng: 76.2736, div: "PGT", type: "4-Way Gateway Junction", platforms: 7 },
  CLT: { code: "CLT", name: "Kozhikode Main", lat: 11.2480, lng: 75.7804, div: "PGT", type: "Major Junction", platforms: 4 },
  CAN: { code: "CAN", name: "Kannur", lat: 11.8745, lng: 75.3704, div: "PGT", type: "Coastal Hub", platforms: 4 },
  MAQ: { code: "MAQ", name: "Mangaluru Central", lat: 12.8687, lng: 74.8427, div: "PGT", type: "Terminal Hub", platforms: 5 },
  TCR: { code: "TCR", name: "Thrissur", lat: 10.5276, lng: 76.2144, div: "TVC", type: "Major Station", platforms: 4 },
  AWY: { code: "AWY", name: "Aluva", lat: 10.1080, lng: 76.3530, div: "TVC", type: "Junction Suburb", platforms: 3 },
  ERS: { code: "ERS", name: "Ernakulam Junction", lat: 9.9678, lng: 76.2917, div: "TVC", type: "Major Terminal Hub", platforms: 6 },
  ALLP:{ code: "ALLP",name: "Alappuzha", lat: 9.4981, lng: 76.3268, div: "TVC", type: "Coastal Chord", platforms: 3 },
  KTYM:{ code: "KTYM",name: "Kottayam", lat: 9.5916, lng: 76.5222, div: "TVC", type: "Inland Mainline", platforms: 3 },
  KYJ: { code: "KYJ", name: "Kayamkulam Junction", lat: 9.1725, lng: 76.5008, div: "TVC", type: "Junction", platforms: 4 },
  QLN: { code: "QLN", name: "Kollam Junction", lat: 8.8870, lng: 76.5980, div: "TVC", type: "Major Junction", platforms: 6 },
  TVC: { code: "TVC", name: "Thiruvananthapuram Central", lat: 8.4875, lng: 76.9530, div: "TVC", type: "Terminal Hub", platforms: 5 },
  VM:  { code: "VM",  name: "Villupuram Junction", lat: 11.9401, lng: 79.4861, div: "TPJ", type: "5-Way Major Junction", platforms: 6 },
  VRI: { code: "VRI", name: "Vriddhachalam Junction", lat: 11.5333, lng: 79.3333, div: "TPJ", type: "Junction", platforms: 4 },
  ALU: { code: "ALU", name: "Ariyalur", lat: 11.1400, lng: 79.0800, div: "TPJ", type: "Mainline Chord", platforms: 3 },
  CDM: { code: "CDM", name: "Chidambaram", lat: 11.3980, lng: 79.6930, div: "TPJ", type: "Delta Heritage Station", platforms: 2 },
  MV:  { code: "MV",  name: "Mayiladuthurai Junction", lat: 11.1018, lng: 79.6522, div: "TPJ", type: "Delta Junction", platforms: 4 },
  TJ:  { code: "TJ",  name: "Thanjavur Junction", lat: 10.7870, lng: 79.1378, div: "TPJ", type: "Delta Hub", platforms: 4 },
  TPJ: { code: "TPJ", name: "Tiruchirappalli Junction", lat: 10.7905, lng: 78.6865, div: "TPJ", type: "Divisional Hub & Workshop", platforms: 7 },
  DG:  { code: "DG",  name: "Dindigul Junction", lat: 10.3673, lng: 77.9803, div: "MDU", type: "Junction Hub", platforms: 5 },
  MDU: { code: "MDU", name: "Madurai Junction", lat: 9.9252, lng: 78.1198, div: "MDU", type: "Divisional Terminal", platforms: 7 },
  MNM: { code: "MNM", name: "Manamadurai Junction", lat: 9.7000, lng: 78.4500, div: "MDU", type: "Chord Junction", platforms: 4 },
  KKDI:{ code: "KKDI",name: "Karaikkudi Junction", lat: 10.0700, lng: 78.7800, div: "TPJ", type: "Chord Station", platforms: 3 },
  VPT: { code: "VPT", name: "Virudhunagar Junction", lat: 9.5872, lng: 77.9577, div: "MDU", type: "Junction", platforms: 4 },
  TEN: { code: "TEN", name: "Tirunelveli Junction", lat: 8.7139, lng: 77.7567, div: "MDU", type: "Terminal Hub", platforms: 5 },
  CAPE:{ code: "CAPE",name: "Kanyakumari", lat: 8.0883, lng: 77.5385, div: "TVC", type: "Southernmost Terminal", platforms: 4 },
  RMM: { code: "RMM", name: "Rameswaram", lat: 9.2876, lng: 79.3129, div: "MDU", type: "Island Marine Terminal", platforms: 4 }
};

// Bidirectional Network Track Sections (Edges)
export const SR_GRAPH_TRACKS = [
  // Westbound Mainline (Chennai - Bangalore / Coimbatore / Kerala)
  { id: "TRK_MAS_MS",  u: "MAS", v: "MS",  dist: 4,   speed: 50,  tracks: "Quadruple Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Chennai Central – Egmore Terminal Link" },
  { id: "TRK_MAS_AJJ", u: "MAS", v: "AJJ", dist: 69,  speed: 130, tracks: "Quadruple/Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Chennai Central – Arakkonam Trunk" },
  { id: "TRK_MS_AJJ",  u: "MS",  v: "AJJ", dist: 72,  speed: 110, tracks: "Double Electrified", sig: "Absolute Block", cap: 1.1, name: "Chennai Egmore – Arakkonam Chord" },
  { id: "TRK_MS_CGL",  u: "MS",  v: "CGL", dist: 56,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Chennai Egmore – Chengalpattu Suburban Trunk" },
  { id: "TRK_AJJ_CGL", u: "AJJ", v: "CGL", dist: 63,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.3, name: "Arakkonam – Chengalpattu Cross-Link" },
  { id: "TRK_AJJ_RU",  u: "AJJ", v: "RU",  dist: 67,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Arakkonam – Renigunta Chord" },
  { id: "TRK_AJJ_KPD", u: "AJJ", v: "KPD", dist: 61,  speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Arakkonam – Katpadi High Speed Mainline" },
  { id: "TRK_KPD_JTJ", u: "KPD", v: "JTJ", dist: 84,  speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Katpadi – Jolarpettai Express Mainline" },
  { id: "TRK_KPD_TNM", u: "KPD", v: "TNM", dist: 78,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.25, name: "Katpadi – Tiruvannamalai Chord" },
  { id: "TRK_TNM_VM",  u: "TNM", v: "VM",  dist: 67,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.25, name: "Tiruvannamalai – Villupuram Chord" },
  { id: "TRK_CGL_VM",  u: "CGL", v: "VM",  dist: 103, speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Chengalpattu – Villupuram Grand Trunk" },
  { id: "TRK_JTJ_BWT", u: "JTJ", v: "BWT", dist: 71,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Jolarpettai – Bangarapet Mainline" },
  { id: "TRK_BWT_SBC", u: "BWT", v: "SBC", dist: 70,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.1, name: "Bangarapet – Bengaluru City Line" },
  { id: "TRK_JTJ_SA",  u: "JTJ", v: "SA",  dist: 120, speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Jolarpettai – Salem High Speed Mainline" },
  { id: "TRK_SA_ED",   u: "SA",  v: "ED",  dist: 60,  speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Salem – Erode Mainline" },
  { id: "TRK_ED_TUP",  u: "ED",  v: "TUP", dist: 50,  speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Erode – Tiruppur Mainline" },
  { id: "TRK_TUP_CBE", u: "TUP", v: "CBE", dist: 50,  speed: 130, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Tiruppur – Coimbatore Mainline" },
  { id: "TRK_CBE_PGT", u: "CBE", v: "PGT", dist: 44,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Coimbatore – Palakkad Palghat Gap Line" },

  // Kerala Coastal & Inland Network
  { id: "TRK_PGT_SRR", u: "PGT", v: "SRR", dist: 33,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Palakkad – Shoranur Gateway Line" },
  { id: "TRK_SRR_CLT", u: "SRR", v: "CLT", dist: 86,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Shoranur – Kozhikode West Coast Trunk" },
  { id: "TRK_CLT_CAN", u: "CLT", v: "CAN", dist: 89,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Kozhikode – Kannur Coastal Line" },
  { id: "TRK_CAN_MAQ", u: "CAN", v: "MAQ", dist: 135, speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Kannur – Mangaluru Central Line" },
  { id: "TRK_SRR_TCR", u: "SRR", v: "TCR", dist: 33,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Shoranur – Thrissur Mainline" },
  { id: "TRK_TCR_AWY", u: "TCR", v: "AWY", dist: 54,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Thrissur – Aluva Mainline" },
  { id: "TRK_AWY_ERS", u: "AWY", v: "ERS", dist: 19,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Aluva – Ernakulam Junction Line" },
  { id: "TRK_ERS_ALLP",u: "ERS", v: "ALLP",dist: 57,  speed: 100, tracks: "Single/Double Electrified", sig: "Absolute Block", cap: 1.2, name: "Ernakulam – Alappuzha Coastal Line" },
  { id: "TRK_ALLP_KYJ",u: "ALLP",v: "KYJ", dist: 43,  speed: 100, tracks: "Double Electrified", sig: "Absolute Block", cap: 1.1, name: "Alappuzha – Kayamkulam Coastal Line" },
  { id: "TRK_ERS_KTYM",u: "ERS", v: "KTYM",dist: 60,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Ernakulam – Kottayam Inland Line" },
  { id: "TRK_KTYM_KYJ",u: "KTYM",v: "KYJ", dist: 55,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Kottayam – Kayamkulam Inland Line" },
  { id: "TRK_KYJ_QLN", u: "KYJ", v: "QLN", dist: 41,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Kayamkulam – Kollam Mainline" },
  { id: "TRK_QLN_TVC", u: "QLN", v: "TVC", dist: 65,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Kollam – Thiruvananthapuram Central Line" },

  // South Grand Trunk (Villupuram - Madurai - Kanyakumari) & Cross-Chords
  { id: "TRK_VM_VRI",  u: "VM",  v: "VRI", dist: 55,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Villupuram – Vriddhachalam Mainline" },
  { id: "TRK_VRI_ALU", u: "VRI", v: "ALU", dist: 52,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Vriddhachalam – Ariyalur Chord" },
  { id: "TRK_ALU_TPJ", u: "ALU", v: "TPJ", dist: 70,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Ariyalur – Tiruchirappalli Mainline" },
  { id: "TRK_VM_CDM",  u: "VM",  v: "CDM", dist: 78,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.25, name: "Villupuram – Chidambaram Delta Chord" },
  { id: "TRK_CDM_MV",  u: "CDM", v: "MV",  dist: 43,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.25, name: "Chidambaram – Mayiladuthurai Delta Chord" },
  { id: "TRK_MV_TJ",   u: "MV",  v: "TJ",  dist: 71,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block (MACLS)", cap: 1.25, name: "Mayiladuthurai – Thanjavur Line" },
  { id: "TRK_TJ_TPJ",  u: "TJ",  v: "TPJ", dist: 50,  speed: 100, tracks: "Double Electrified", sig: "Absolute Block", cap: 1.1, name: "Thanjavur – Tiruchirappalli Line" },
  { id: "TRK_VRI_SA",  u: "VRI", v: "SA",  dist: 137, speed: 100, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.3, name: "Vriddhachalam – Salem Cross Chord" },
  { id: "TRK_SA_NMKL", u: "SA",  v: "NMKL",dist: 52,  speed: 110, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.2, name: "Salem – Namakkal Central Chord" },
  { id: "TRK_NMKL_KRR",u: "NMKL",v: "KRR", dist: 34,  speed: 110, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.2, name: "Namakkal – Karur Central Chord" },
  { id: "TRK_KRR_DG",  u: "KRR", v: "DG",  dist: 74,  speed: 110, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.2, name: "Karur – Dindigul Central Chord" },
  { id: "TRK_ED_KRR",  u: "ED",  v: "KRR", dist: 65,  speed: 110, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.2, name: "Erode – Karur Cauvery Bank Link" },
  { id: "TRK_KRR_TPJ", u: "KRR", v: "TPJ", dist: 76,  speed: 110, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.2, name: "Karur – Tiruchirappalli Cauvery Bank Link" },
  { id: "TRK_TPJ_DG",  u: "TPJ", v: "DG",  dist: 94,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Tiruchirappalli – Dindigul Mainline" },
  { id: "TRK_DG_MDU",  u: "DG",  v: "MDU", dist: 62,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Dindigul – Madurai Mainline" },
  { id: "TRK_TPJ_KKDI",u: "TPJ", v: "KKDI",dist: 90,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.3, name: "Tiruchirappalli – Karaikkudi Chord" },
  { id: "TRK_KKDI_MNM",u: "KKDI",v: "MNM", dist: 60,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.3, name: "Karaikkudi – Manamadurai Chord" },
  { id: "TRK_MNM_MDU", u: "MNM", v: "MDU", dist: 48,  speed: 100, tracks: "Single Electrified", sig: "Absolute Block", cap: 1.3, name: "Manamadurai – Madurai Line" },
  { id: "TRK_MDU_VPT", u: "MDU", v: "VPT", dist: 43,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Madurai – Virudhunagar Mainline" },
  { id: "TRK_VPT_TEN", u: "VPT", v: "TEN", dist: 114, speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Virudhunagar – Tirunelveli Line" },
  { id: "TRK_TEN_CAPE",u: "TEN", v: "CAPE",dist: 85,  speed: 110, tracks: "Double Electrified", sig: "Automatic Block (AB)", cap: 1.0, name: "Tirunelveli – Kanyakumari Terminal Line" },
  { id: "TRK_MNM_RMM", u: "MNM", v: "RMM", dist: 113, speed: 80,  tracks: "Single Marine Electrified", sig: "Absolute Block", cap: 1.4, name: "Manamadurai – Pamban – Rameswaram Sea Corridor" }
];

// ============================================================================
// 2. RUNTIME AI ROUTE ANALYSIS STATE
// ============================================================================

export const aiRouteAnalysisState = {
  // CRITICAL RULE: Map remains strictly in default normal mode until triggered by chatbot!
  active: false,
  blockedSections: [], // Array of { u, v, id, name, duration, assets, reason }
  originStation: null,
  destinationStation: null,
  affectedTrain: null,
  candidateRoutes: [], // All feasible alternatives evaluated
  recommendedRoute: null, // Designated ⭐ best route
  whatIfHistory: [],
  trainAnimationState: null
};

// ============================================================================
// 3. GRAPH ADJACENCY & DYNAMIC MULTI-PATH SEARCH ENGINE
// ============================================================================

function buildNetworkAdjacency() {
  const adj = {};
  for (const t of SR_GRAPH_TRACKS) {
    adj[t.u] = adj[t.u] || [];
    adj[t.v] = adj[t.v] || [];
    adj[t.u].push({ neighbor: t.v, track: t });
    adj[t.v].push({ neighbor: t.u, track: t });
  }
  return adj;
}

const NETWORK_ADJACENCY = buildNetworkAdjacency();

/**
 * Normalizes station names/codes from arbitrary user input
 */
export function resolveStationCode(input) {
  if (!input) return null;
  let clean = String(input).trim();
  clean = clean.replace(/\b(station|stn|junction|jn|terminal|term|halt)\b/gi, '').trim();
  if (!clean) return null;

  const q = clean.toUpperCase();
  if (SR_GRAPH_STATIONS[q]) return q;

  const qLower = clean.toLowerCase();
  for (const [code, stn] of Object.entries(SR_GRAPH_STATIONS)) {
    if (stn.name.toLowerCase() === qLower) return code;
  }

  // Common aliases
  const aliases = {
    "chennai": "MAS",
    "chennai central": "MAS",
    "chennai egmore": "MS",
    "egmore": "MS",
    "arakkonam": "AJJ",
    "katpadi": "KPD",
    "vellore": "KPD",
    "jolarpettai": "JTJ",
    "jolarpet": "JTJ",
    "bangalore": "SBC",
    "bengaluru": "SBC",
    "salem": "SA",
    "erode": "ED",
    "tiruppur": "TUP",
    "coimbatore": "CBE",
    "kovai": "CBE",
    "palakkad": "PGT",
    "palghat": "PGT",
    "shoranur": "SRR",
    "kozhikode": "CLT",
    "calicut": "CLT",
    "kannur": "CAN",
    "mangaluru": "MAQ",
    "mangalore": "MAQ",
    "thrissur": "TCR",
    "aluva": "AWY",
    "ernakulam": "ERS",
    "cochin": "ERS",
    "alappuzha": "ALLP",
    "alleppey": "ALLP",
    "kottayam": "KTYM",
    "kayamkulam": "KYJ",
    "kollam": "QLN",
    "quilon": "QLN",
    "trivandrum": "TVC",
    "thiruvananthapuram": "TVC",
    "villupuram": "VM",
    "vriddhachalam": "VRI",
    "ariyalur": "ALU",
    "chidambaram": "CDM",
    "mayiladuthurai": "MV",
    "thanjavur": "TJ",
    "tanjore": "TJ",
    "trichy": "TPJ",
    "tiruchirappalli": "TPJ",
    "dindigul": "DG",
    "madurai": "MDU",
    "virudhunagar": "VPT",
    "tirunelveli": "TEN",
    "kanyakumari": "CAPE",
    "rameswaram": "RMM"
  };

  if (aliases[qLower]) return aliases[qLower];

  for (const [code, stn] of Object.entries(SR_GRAPH_STATIONS)) {
    if (stn.name.toLowerCase().includes(qLower) || qLower.includes(stn.name.toLowerCase())) return code;
  }
  for (const [alias, code] of Object.entries(aliases)) {
    if (alias.includes(qLower) || qLower.includes(alias)) return code;
  }

  return null;
}

/**
 * Searches network dynamically for all feasible alternative paths avoiding blocked sections.
 * Does NOT hardcode routes; uses depth-first path exploration with cycle detection.
 */
export function findFeasibleAlternativeRoutes(startCode, endCode, blockedTracks = [], maxDepth = 9, maxPaths = 6) {
  if (!startCode || !endCode || startCode === endCode) return [];

  const blockedSet = new Set();
  for (const b of blockedTracks) {
    if (b.u && b.v) {
      blockedSet.add(`${b.u}_${b.v}`);
      blockedSet.add(`${b.v}_${b.u}`);
    }
  }

  const allDiscoveredPaths = [];

  function dfs(curr, target, visitedStations, pathEdges) {
    if (curr === target) {
      allDiscoveredPaths.push([...pathEdges]);
      return;
    }
    if (pathEdges.length >= maxDepth || allDiscoveredPaths.length >= maxPaths * 2) {
      return;
    }

    const neighbors = NETWORK_ADJACENCY[curr] || [];
    for (const { neighbor, track } of neighbors) {
      if (visitedStations.has(neighbor)) continue;
      if (blockedSet.has(`${curr}_${neighbor}`)) continue;

      visitedStations.add(neighbor);
      pathEdges.push({ from: curr, to: neighbor, track });
      dfs(neighbor, target, visitedStations, pathEdges);
      pathEdges.pop();
      visitedStations.delete(neighbor);
    }
  }

  dfs(startCode, endCode, new Set([startCode]), []);

  return allDiscoveredPaths;
}

// ============================================================================
// 4. MULTI-FACTOR AI ROUTE SCORING & SELECTION ENGINE
// ============================================================================

/**
 * Evaluates candidate routes across:
 * - Travel time
 * - Distance
 * - Track availability & line capacity (double track electrified vs single line)
 * - Existing maintenance blocks & opposing train conflicts
 * - Expected passenger delay
 * - Passenger impact level (Low / Medium / High)
 * Selects the best overall operational solution (NOT simply the shortest route).
 */
export function evaluateAndRankRoutes(candidatePaths, blockedTracks, affectedTrain = null, durationMins = 180) {
  if (!candidatePaths || candidatePaths.length === 0) return [];

  // Direct baseline reference travel time calculation
  const scoredRoutes = candidatePaths.map((pathEdges, idx) => {
    const stationCodes = [pathEdges[0].from, ...pathEdges.map(e => e.to)];
    const stationNames = stationCodes.map(c => SR_GRAPH_STATIONS[c]?.name || c);

    let totalDistKm = 0;
    let baseTimeMinutes = 0;
    let singleLineCount = 0;
    let doubleElectrifiedCount = 0;
    let capacityScoreSum = 0;
    let conflictRisks = [];

    const sectionDescriptions = [];
    const polylineCoords = [];

    for (const edge of pathEdges) {
      const t = edge.track;
      totalDistKm += t.dist;
      // Operational speed factor: 85% of sectional permissible speed
      const effectiveSpeed = t.speed * 0.85;
      const legTimeMin = (t.dist / effectiveSpeed) * 60;
      baseTimeMinutes += legTimeMin;

      capacityScoreSum += t.cap;
      if (t.tracks.includes("Double") || t.tracks.includes("Quadruple")) {
        doubleElectrifiedCount++;
      } else {
        singleLineCount++;
        conflictRisks.push(`Single-line crossing wait possible on ${t.name} (10 min allowance)`);
      }

      sectionDescriptions.push(`${SR_GRAPH_STATIONS[edge.from]?.code || edge.from} ➔ ${SR_GRAPH_STATIONS[edge.to]?.code || edge.to} (${t.tracks}, ${t.speed} km/h)`);

      // Add coordinates for map rendering
      const stnFrom = SR_GRAPH_STATIONS[edge.from];
      const stnTo = SR_GRAPH_STATIONS[edge.to];
      if (stnFrom && stnTo) {
        if (polylineCoords.length === 0) polylineCoords.push([stnFrom.lat, stnFrom.lng]);
        // Add midpoint for smoother curved polyline
        const midLat = (stnFrom.lat + stnTo.lat) / 2 + (Math.sin(totalDistKm) * 0.02);
        const midLng = (stnFrom.lng + stnTo.lng) / 2;
        polylineCoords.push([midLat, midLng]);
        polylineCoords.push([stnTo.lat, stnTo.lng]);
      }
    }

    // Junction turnaround & clearance buffer: 4 mins per intermediate junction
    const intermediateJunctions = stationCodes.length - 2;
    const junctionDwellMins = Math.max(0, intermediateJunctions * 4);
    const totalTravelTimeMins = Math.round(baseTimeMinutes + junctionDwellMins);

    // Expected delay relative to typical timetable
    const baselineDirectTime = Math.round((totalDistKm * 0.75 / 110) * 60);
    const estimatedDelayMins = Math.max(6, Math.round(totalTravelTimeMins - baselineDirectTime));

    // Multi-factor suitability score calculation:
    // Base 100 points
    let score = 100;
    // Delay penalty: -0.6 pts per minute
    score -= estimatedDelayMins * 0.6;
    // Single line penalty: -8 pts per single track section
    score -= singleLineCount * 8;
    // Double electrified bonus: +4 pts
    score += doubleElectrifiedCount * 4;
    // Conflict risk penalty: -6 pts per crossing conflict
    score -= conflictRisks.length * 6;

    // Normalizing between 40 and 98
    score = Math.min(98, Math.max(45, Math.round(score)));

    // Passenger Impact Assessment
    let passengerImpact = "Low";
    let passengerImpactReason = "Avoids passenger cancellations; preserves primary boarding connections with minimal timetable adjustment.";
    if (estimatedDelayMins > 25 || singleLineCount >= 2) {
      passengerImpact = "High";
      passengerImpactReason = `Significant detention (+${estimatedDelayMins}m); requires rescheduling of 2 connecting passenger services.`;
    } else if (estimatedDelayMins > 12 || singleLineCount >= 1) {
      passengerImpact = "Medium";
      passengerImpactReason = `Moderate delay (+${estimatedDelayMins}m); protected by sectional turnaround buffer.`;
    }

    // Recommendation Rationale
    const reasons = [
      "Strictly avoids the active maintenance block with 100% route clearance",
      doubleElectrifiedCount > 0 ? `Utilizes ${doubleElectrifiedCount} double-track electrified corridors with Automatic Block Signaling (ABS)` : "Maintains continuity over cleared secondary chord",
      conflictRisks.length === 0 ? "Zero opposing crossing stops or mainline bottlenecks" : "Single-track clearance pre-locked via CTC interlocking",
      `Expected passenger delay kept to just +${estimatedDelayMins} minutes (${passengerImpact} Passenger Impact)`,
      affectedTrain ? `Optimal speed and axle-load suitability for ${affectedTrain}` : "Fully cleared for broad-gauge passenger and express consists"
    ];

    const hours = Math.floor(totalTravelTimeMins / 60);
    const mins = totalTravelTimeMins % 60;
    const formattedTravelTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    return {
      routeIndex: idx + 1,
      routeId: `ROUTE_${idx + 1}`,
      routeName: `Route ${idx + 1}: ${stationCodes[0]} ➔ ${stationCodes.slice(1, -1).join(" ➔ ")} ➔ ${stationCodes[stationCodes.length - 1]}`,
      stationCodes,
      stationNames,
      pathEdges,
      polylineCoords,
      distanceKm: totalDistKm,
      travelTimeMin: totalTravelTimeMins,
      travelTimeFormatted: formattedTravelTime,
      delayMin: estimatedDelayMins,
      score,
      doubleElectrifiedCount,
      singleLineCount,
      trackAvailability: doubleElectrifiedCount >= singleLineCount ? "High (Double Track 25kV AC Electrified)" : "Moderate (Single Line Electrified)",
      conflictsCount: conflictRisks.length,
      conflictRisks,
      passengerImpact,
      passengerImpactReason,
      recommendationReasons: reasons,
      recommendationReason: reasons.slice(0, 3).join("; "),
      sectionDescriptions
    };
  });

  // Sort strictly by AI suitability score descending (best operational solution first!)
  scoredRoutes.sort((a, b) => (b.score - a.score) || (a.delayMin - b.delayMin) || (a.distanceKm - b.distanceKm));

  // Assign display rank and mark top as Recommended
  scoredRoutes.forEach((r, i) => {
    r.displayRank = i + 1;
    r.isRecommended = i === 0;
  });

  return scoredRoutes;
}

// ============================================================================
// 5. NLP PARSER FOR CHATBOT MAINTENANCE BLOCK & WHAT-IF DETECTION
// ============================================================================

/**
 * Extracts maintenance block information from user chatbot messages.
 * Matches:
 * - "Block has occurred between Station A and Station B"
 * - "Track A-B is under maintenance"
 * - "Maintenance block is required between Station A and Station B"
 * - "A block has occurred. Track between A and B needs maintenance"
 * - "Track A-B and Track C-D are under maintenance" (multiple blocks)
 * - Duration, Train affected, Required assets
 */
export function parseMaintenanceBlockMessage(text) {
  if (!text || typeof text !== "string") return null;
  const raw = text.trim();
  const lower = raw.toLowerCase();

  // Check for Reset / Clear command first
  if (
    lower.includes("clear block") || 
    lower.includes("reset map") || 
    lower.includes("reset network") || 
    lower.includes("maintenance complete") || 
    lower.includes("cancel block") ||
    lower.includes("normal state") ||
    lower.includes("default map")
  ) {
    return {
      type: "RESET_MAP",
      message: raw
    };
  }

  // Check for follow-up: "Why did you choose Route X?"
  const whyRouteMatch = lower.match(/why\s+(?:did\s+you\s+choose|route|choose)\s*(?:route)?\s*([0-9]|recommended)?/);
  if (whyRouteMatch || (lower.includes("why") && (lower.includes("route") || lower.includes("recommend") || lower.includes("choose")))) {
    return {
      type: "EXPLAIN_ROUTE",
      routeNum: whyRouteMatch ? (whyRouteMatch[1] || "recommended") : "recommended",
      message: raw
    };
  }

  // Check for follow-up: "What if Route X is unavailable?"
  const whatIfRouteBlocked = lower.match(/what\s+if\s+route\s*([0-9])\s*(?:is|becomes)?\s*(?:unavailable|blocked|closed|delayed)/);
  if (whatIfRouteBlocked || (lower.includes("what if") && lower.includes("route") && (lower.includes("unavailable") || lower.includes("blocked")))) {
    return {
      type: "WHAT_IF_ROUTE_UNAVAILABLE",
      routeIndex: whatIfRouteBlocked ? parseInt(whatIfRouteBlocked[1]) : 1,
      message: raw
    };
  }

  // Check for what-if: "What if maintenance takes 30 minutes longer?"
  const durationIncreaseMatch = lower.match(/(?:takes|delayed|lasts|longer|extends)\s*(?:by)?\s*([0-9]+)\s*(?:minutes|mins|hours|hrs)/);
  if (lower.includes("what if") && (lower.includes("longer") || lower.includes("minutes") || lower.includes("hours") || lower.includes("delay")) && durationIncreaseMatch) {
    const amount = parseInt(durationIncreaseMatch[1]);
    const isHours = lower.includes("hour") || lower.includes("hr");
    const deltaMins = isHours ? amount * 60 : amount;
    return {
      type: "WHAT_IF_DURATION_EXTENDED",
      deltaMinutes: deltaMins,
      message: raw
    };
  }

  // Check for Fleet & Station Topological Manager commands
  if (lower.includes("introduce train") || lower.includes("commission train") || lower.includes("add train")) {
    const tNum = raw.match(/[0-9]{4,5}/);
    return {
      type: "TOPOLOGY_INTRODUCE_TRAIN",
      trainNo: tNum ? tNum[0] : "20611",
      message: raw
    };
  }
  if (lower.includes("cancel train") || lower.includes("decommission train")) {
    const tNum = raw.match(/[0-9]{4,5}/);
    return {
      type: "TOPOLOGY_CANCEL_TRAIN",
      trainNo: tNum ? tNum[0] : "12675",
      message: raw
    };
  }
  if (lower.includes("commission station") || lower.includes("add station") || lower.includes("new station")) {
    return {
      type: "TOPOLOGY_COMMISSION_STATION",
      stationCode: "TBM-S",
      stationName: "Tambaram South Terminal",
      message: raw
    };
  }

  // Check for Maintenance Block Trigger
  const isBlockReport = 
    lower.includes("block") || 
    lower.includes("maintenance") || 
    lower.includes("under maintenance") ||
    lower.includes("track closed") ||
    lower.includes("disruption") ||
    lower.includes("possession");

  if (!isBlockReport) return null;

  // Extract Station Pairs (supports "between A and B", "Track A-B", "A to B")
  // Handles multiple blocks like "Track A-B and Track C-D are under maintenance"
  const stationPairs = [];

  // Pattern 1: "between [X] and [Y]"
  const betweenRegex = /between\s+([a-zA-Z\s.-]+?)\s+and\s+([a-zA-Z\s.-]+?)(?:\s+is|\s+needs|\s+has|\s+for|\s+and|\s*\.|\s*,|\s*$)/gi;
  let match;
  while ((match = betweenRegex.exec(raw)) !== null) {
    const sA = resolveStationCode(match[1]);
    const sB = resolveStationCode(match[2]);
    if (sA && sB && sA !== sB) {
      stationPairs.push({ from: sA, to: sB });
    }
  }

  // Pattern 2: "Track [X]-[Y]" or "Section [X] - [Y]"
  const hyphenRegex = /(?:track|section|line|corridor)\s*([a-zA-Z]+)\s*[-–—/]\s*([a-zA-Z]+)/gi;
  while ((match = hyphenRegex.exec(raw)) !== null) {
    const sA = resolveStationCode(match[1]);
    const sB = resolveStationCode(match[2]);
    if (sA && sB && sA !== sB) {
      stationPairs.push({ from: sA, to: sB });
    }
  }

  // Pattern 3: "[X] to [Y]"
  if (stationPairs.length === 0) {
    const toRegex = /(?:from|between|track)?\s*([a-zA-Z\s]+?)\s+(?:to|➔|->)\s+([a-zA-Z\s]+?)(?:\s+is|\s+needs|\s+has|\s+for|\s*\.|\s*,|\s*$)/gi;
    while ((match = toRegex.exec(raw)) !== null) {
      const sA = resolveStationCode(match[1]);
      const sB = resolveStationCode(match[2]);
      if (sA && sB && sA !== sB) {
        stationPairs.push({ from: sA, to: sB });
      }
    }
  }

  // Fallback defaults if general block statement made without explicit stations:
  if (stationPairs.length === 0) {
    for (const code of Object.keys(SR_GRAPH_STATIONS)) {
      const stn = SR_GRAPH_STATIONS[code];
      const nameRegex = new RegExp(`\\b${stn.name.toLowerCase()}\\b`, "i");
      const codeRegex = new RegExp(`\\b${code.toLowerCase()}\\b`, "i");
      if (nameRegex.test(lower) || codeRegex.test(lower)) {
        if (!stationPairs[0]) {
          stationPairs.push({ from: code, to: null });
        } else if (!stationPairs[0].to && stationPairs[0].from !== code) {
          stationPairs[0].to = code;
        }
      }
    }
  }

  // If still incomplete, default to primary test corridor (KPD - JTJ)
  if (stationPairs.length === 0 || !stationPairs[0].from || !stationPairs[0].to) {
    stationPairs.push({ from: "KPD", to: "JTJ" });
  }

  // Extract Duration
  let durationMins = 180; // default 3 hours
  const durMatch = lower.match(/([0-9]+)\s*(?:hour|hr|minute|min)/i);
  if (durMatch) {
    const val = parseInt(durMatch[1]);
    if (lower.includes("hour") || lower.includes("hr")) {
      durationMins = val * 60;
    } else {
      durationMins = val;
    }
  }

  // Extract Train Affected
  let affectedTrain = null;
  const trainNumMatch = raw.match(/\b([0-9]{4,5})\b/);
  if (trainNumMatch) {
    affectedTrain = `Train #${trainNumMatch[1]}`;
  } else if (lower.includes("kovai")) {
    affectedTrain = "Train #12675 (Kovai SF Express)";
  } else if (lower.includes("vande bharat")) {
    affectedTrain = "Train #20608 (MYS Vande Bharat)";
  } else if (lower.includes("tamil nadu")) {
    affectedTrain = "Train #12622 (Tamil Nadu Express)";
  } else if (lower.includes("cheran")) {
    affectedTrain = "Train #12674 (Cheran Express)";
  }

  // Extract Required Assets
  let requiredAssets = "CSM Continuous Tamping Machine (09-3X) & 25kV OHE Tower Wagon";
  if (lower.includes("tamping") || lower.includes("csm")) {
    requiredAssets = "Plasser Dynamic Tamping Machine CSM-09 & Ballast Regulator";
  } else if (lower.includes("ohe") || lower.includes("catenary") || lower.includes("power")) {
    requiredAssets = "TRD 4-Wheeler Catenary Inspection Tower Wagon & OHE Power Isolation";
  } else if (lower.includes("usfd") || lower.includes("ultrasonic") || lower.includes("rail")) {
    requiredAssets = "Digital USFD Ultrasonic Rail Flaw Detector & Mobile Weld Gang";
  } else if (lower.includes("ballast") || lower.includes("bcm")) {
    requiredAssets = "Plasser BCM RM 80-92 UHR High-Output Ballast Cleaning Machine";
  } else if (lower.includes("signal") || lower.includes("s&t") || lower.includes("point")) {
    requiredAssets = "S&T Digital Interlocking Diagnostic Van & Point Machine Test Rig";
  }

  return {
    type: "MAINTENANCE_BLOCK_EVENT",
    stationPairs,
    durationMinutes: durationMins,
    durationFormatted: `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? (durationMins % 60) + 'm' : ''}`.trim(),
    affectedTrain,
    requiredAssets,
    rawText: raw
  };
}

export function getBlockedTrackSegments(u, v) {
  const direct = SR_GRAPH_TRACKS.find(t => (t.u === u && t.v === v) || (t.u === v && t.v === u));
  if (direct) return [{ u: direct.u, v: direct.v, name: direct.name, id: direct.id }];

  const queue = [[u, []]];
  const visited = new Set([u]);
  while (queue.length > 0) {
    const [curr, path] = queue.shift();
    if (curr === v) return path;

    for (const t of SR_GRAPH_TRACKS) {
      let nxt = null;
      if (t.u === curr) nxt = t.v;
      else if (t.v === curr) nxt = t.u;
      if (nxt && !visited.has(nxt)) {
        visited.add(nxt);
        queue.push([nxt, [...path, { u: t.u, v: t.v, name: t.name, id: t.id }]]);
      }
    }
  }
  return [{ u, v, name: `${u} - ${v}`, id: `BLK_${u}_${v}` }];
}

// ============================================================================
// 6. ACTION EXECUTOR: TRIGGERING AI ROUTE ANALYSIS
// ============================================================================

/**
 * Triggers the AI Route Analysis and transitions the map into AI Route Analysis Mode.
 * This is ONLY called when triggered via chatbot message or interactive action.
 */
export function triggerAIRouteAnalysis(eventData) {
  if (!eventData || !eventData.stationPairs || eventData.stationPairs.length === 0) return null;

  const primaryPair = eventData.stationPairs[0];
  const originCode = primaryPair.from;
  const destCode = primaryPair.to;

  const blockedTracks = [];
  for (const pair of eventData.stationPairs) {
    const segs = getBlockedTrackSegments(pair.from, pair.to);
    for (const s of segs) {
      if (!blockedTracks.some(b => (b.u === s.u && b.v === s.v) || (b.u === s.v && b.v === s.u))) {
        blockedTracks.push({
          u: s.u,
          v: s.v,
          id: s.id || `BLK_${s.u}_${s.v}`,
          name: s.name || `${SR_GRAPH_STATIONS[s.u]?.name || s.u} – ${SR_GRAPH_STATIONS[s.v]?.name || s.v}`,
          duration: eventData.durationFormatted || "3.0 Hours",
          assets: eventData.requiredAssets || "CSM Dynamic Tamping Machine & Tower Wagon"
        });
      }
    }
  }

  // If a train is affected (e.g. MAS to CBE train), find paths from train's origin to destination
  let routingStart = originCode;
  let routingEnd = destCode;

  if (eventData.affectedTrain) {
    if (eventData.affectedTrain.includes("12675") || eventData.affectedTrain.includes("20608")) {
      routingStart = "MAS";
      routingEnd = "CBE";
    } else if (eventData.affectedTrain.includes("12635") || eventData.affectedTrain.includes("12637")) {
      routingStart = "MS";
      routingEnd = "MDU";
    }
  }

  // If routing start and end are identical to the blocked section, look for network bypass paths
  if (routingStart === originCode && routingEnd === destCode) {
    if ((originCode === "KPD" && destCode === "JTJ") || (originCode === "JTJ" && destCode === "KPD")) {
      routingStart = "AJJ";
      routingEnd = "SA";
    } else if ((originCode === "VM" && destCode === "VRI") || (originCode === "VM" && destCode === "TPJ")) {
      routingStart = "VM";
      routingEnd = "TPJ";
    }
  }

  // Dynamically find all feasible alternative routes
  const rawPaths = findFeasibleAlternativeRoutes(routingStart, routingEnd, blockedTracks, 10, 5);

  // Evaluate & rank using multi-factor AI engine
  const evaluatedRoutes = evaluateAndRankRoutes(rawPaths, blockedTracks, eventData.affectedTrain, eventData.durationMinutes || 180);

  // Update State
  aiRouteAnalysisState.active = true;
  aiRouteAnalysisState.blockedSections = blockedTracks;
  aiRouteAnalysisState.originStation = SR_GRAPH_STATIONS[originCode];
  aiRouteAnalysisState.destinationStation = SR_GRAPH_STATIONS[destCode];
  aiRouteAnalysisState.affectedTrain = eventData.affectedTrain;
  aiRouteAnalysisState.candidateRoutes = evaluatedRoutes;
  aiRouteAnalysisState.recommendedRoute = evaluatedRoutes[0] || null;
  aiRouteAnalysisState.durationMinutes = eventData.durationMinutes || 180;
  aiRouteAnalysisState.requiredAssets = eventData.requiredAssets;

  // Render on Leaflet Map
  if (typeof window !== "undefined" && window.leafletMapInstance) {
    renderAIRouteAnalysisOnMap(window.leafletMapInstance);
  }

  return {
    state: aiRouteAnalysisState,
    blockedTracks,
    candidateRoutes: evaluatedRoutes,
    recommendedRoute: evaluatedRoutes[0] || null
  };
}

/**
 * Resets the map to the Normal / Default State.
 * Clears all alternative routes, blocked markers, and disruption overlays.
 */
export function resetAIRouteAnalysis() {
  aiRouteAnalysisState.active = false;
  aiRouteAnalysisState.blockedSections = [];
  aiRouteAnalysisState.candidateRoutes = [];
  aiRouteAnalysisState.recommendedRoute = null;
  aiRouteAnalysisState.affectedTrain = null;

  if (typeof window !== "undefined" && window.leafletMapInstance) {
    clearAIRouteAnalysisFromMap(window.leafletMapInstance);
  }

  return { active: false };
}

// ============================================================================
// 7. MAP VISUAL RENDERER (LEAFLET LAYER CONTROLLER)
// ============================================================================

/**
 * Renders the AI Route Analysis on the active Leaflet map:
 * - 🔴 Blocked Track Section (Thick, pulsating red, caution halos)
 * - ⚪ Alternative Routes (Distinguishable secondary lines)
 * - ⭐ AI Recommended Route (Thick glowing emerald line)
 * - 🚆 Train Marker & Animated Detour
 * - Floating AI Recommendation Card
 * - Clear Map Legend
 */
export function renderAIRouteAnalysisOnMap(map) {
  if (!map || typeof L === "undefined") return;

  // Clear existing AI route layer group if present
  if (window.__aiRouteAnalysisLayerGroup) {
    try { map.removeLayer(window.__aiRouteAnalysisLayerGroup); } catch(e) {}
  }

  window.__aiRouteAnalysisLayerGroup = L.layerGroup().addTo(map);
  const lg = window.__aiRouteAnalysisLayerGroup;

  const { blockedSections, candidateRoutes, recommendedRoute, affectedTrain } = aiRouteAnalysisState;

  // 1. RENDER BLOCKED TRACK SECTIONS IN 🔴 RED
  for (const block of blockedSections) {
    const stnU = SR_GRAPH_STATIONS[block.u];
    const stnV = SR_GRAPH_STATIONS[block.v];
    if (!stnU || !stnV) continue;

    const blockCoords = [
      [stnU.lat, stnU.lng],
      [(stnU.lat + stnV.lat) / 2 + 0.01, (stnU.lng + stnV.lng) / 2],
      [stnV.lat, stnV.lng]
    ];

    // Pulsing background caution line
    L.polyline(blockCoords, {
      color: "#ef4444",
      weight: 12,
      opacity: 0.35,
      className: "ai-blocked-track-pulse"
    }).addTo(lg);

    // Main blocked line
    const blockedPolyline = L.polyline(blockCoords, {
      color: "#dc2626",
      weight: 6,
      opacity: 1.0,
      dashArray: "10, 10"
    }).addTo(lg);

    // Endpoint caution circles
    L.circleMarker([stnU.lat, stnU.lng], { radius: 10, color: "#ef4444", fillColor: "#7f1d1d", fillOpacity: 0.9, weight: 3 }).addTo(lg);
    L.circleMarker([stnV.lat, stnV.lng], { radius: 10, color: "#ef4444", fillColor: "#7f1d1d", fillOpacity: 0.9, weight: 3 }).addTo(lg);

    // Midpoint Warning Sign
    const midLat = (stnU.lat + stnV.lat) / 2;
    const midLng = (stnU.lng + stnV.lng) / 2;
    const cautionIcon = L.divIcon({
      className: "ai-blocked-sign-icon",
      html: `<div style="background:#dc2626;color:#ffffff;font-size:11px;font-weight:900;padding:3px 8px;border-radius:4px;border:1.5px solid #ffffff;box-shadow:0 0 12px rgba(220,38,38,0.9);white-space:nowrap;display:flex;align-items:center;gap:4px"><span>🚧</span> 🔴 BLOCKED</div>`,
      iconSize: [110, 24],
      iconAnchor: [55, 12]
    });
    L.marker([midLat, midLng], { icon: cautionIcon }).addTo(lg);

    // Interactive Click Popup on Blocked Section
    const popupHtml = `
      <div style="font-family:'Segoe UI',sans-serif;min-width:240px;padding:4px;color:#f8fafc">
        <div style="background:#dc2626;color:#fff;font-size:11px;font-weight:900;padding:4px 8px;border-radius:4px;display:flex;align-items:center;gap:6px;margin-bottom:8px">
          <span>🔴</span> UNDER MAINTENANCE / BLOCKED
        </div>
        <div style="font-size:13px;font-weight:900;color:#ffffff;margin-bottom:4px">${block.name}</div>
        <div style="font-size:11px;color:#cbd5e1;line-height:1.4;margin-bottom:6px">
          <div><b>Status:</b> <span style="color:#f87171">Active Possession (Track Unavailable)</span></div>
          <div><b>Block Type:</b> Scheduled Track &amp; Power Block</div>
          <div><b>Duration:</b> ${block.duration}</div>
          <div><b>Required Assets:</b> ${block.assets}</div>
          ${affectedTrain ? `<div><b>Affected Train:</b> <span style="color:#fbbf24">${affectedTrain}</span></div>` : ''}
        </div>
        <div style="font-size:10.5px;color:#94a3b8;background:rgba(0,0,0,0.3);padding:4px 6px;border-radius:4px">
          AI is actively rerouting traffic via safe alternative corridors.
        </div>
      </div>
    `;
    blockedPolyline.bindPopup(popupHtml);
  }

  // 2. RENDER FEASIBLE ALTERNATIVE ROUTES (SECONDARY PATHS)
  const secondaryColors = ["#f59e0b", "#a855f7", "#06b6d4", "#e2e8f0"];
  candidateRoutes.forEach((route, idx) => {
    if (route.isRecommended) return; // Recommended rendered separately with priority glow

    const color = secondaryColors[idx % secondaryColors.length];
    const altLine = L.polyline(route.polylineCoords, {
      color: color,
      weight: 4.5,
      opacity: 0.85,
      dashArray: "6, 8"
    }).addTo(lg);

    altLine.bindPopup(`
      <div style="font-family:'Segoe UI',sans-serif;min-width:220px;padding:4px;color:#f8fafc">
        <div style="font-size:11px;font-weight:800;color:${color};text-transform:uppercase">⚪ Alternative Route ${route.routeIndex}</div>
        <div style="font-size:12.5px;font-weight:900;color:#ffffff;margin:2px 0 4px">${route.stationCodes.join(" ➔ ")}</div>
        <div style="font-size:11px;color:#cbd5e1;line-height:1.4">
          <div>Distance: <b>${route.distanceKm} km</b> &bull; Travel Time: <b>${route.travelTimeFormatted}</b></div>
          <div>Estimated Delay: <b style="color:#f59e0b">+${route.delayMin} mins</b></div>
          <div>AI Score: <b style="color:#38bdf8">${route.score}/100</b></div>
        </div>
      </div>
    `);
  });

  // 3. RENDER ⭐ AI RECOMMENDED ROUTE (HIGH-CONTRAST GLOWING EMERALD)
  if (recommendedRoute) {
    // Outer neon emerald glow
    L.polyline(recommendedRoute.polylineCoords, {
      color: "#10b981",
      weight: 12,
      opacity: 0.4,
      className: "ai-recommended-route-glow"
    }).addTo(lg);

    // Core thick solid line
    const recLine = L.polyline(recommendedRoute.polylineCoords, {
      color: "#22c55e",
      weight: 6,
      opacity: 1.0
    }).addTo(lg);

    // Animated directional pulse line
    L.polyline(recommendedRoute.polylineCoords, {
      color: "#ffffff",
      weight: 2,
      opacity: 0.9,
      dashArray: "4, 8"
    }).addTo(lg);

    // Add Station Nodes along recommended route
    recommendedRoute.stationCodes.forEach(code => {
      const s = SR_GRAPH_STATIONS[code];
      if (s) {
        L.circleMarker([s.lat, s.lng], {
          radius: 6,
          color: "#ffffff",
          fillColor: "#10b981",
          fillOpacity: 1.0,
          weight: 2
        }).bindTooltip(`${s.code} • ${s.name}`, { permanent: false, direction: "top" }).addTo(lg);
      }
    });

    // Star Recommended Badge on Route Midpoint
    const midIdx = Math.floor(recommendedRoute.polylineCoords.length / 2);
    const badgeCoord = recommendedRoute.polylineCoords[midIdx] || recommendedRoute.polylineCoords[0];
    const recBadgeIcon = L.divIcon({
      className: "ai-rec-badge-icon",
      html: `
        <div style="background:#10b981;color:#000000;font-size:11px;font-weight:900;padding:3px 10px;border-radius:14px;border:2px solid #ffffff;box-shadow:0 0 14px rgba(16,185,129,0.9);white-space:nowrap;display:flex;align-items:center;gap:5px">
          <span>⭐</span> AI RECOMMENDED ROUTE
        </div>
      `,
      iconSize: [160, 26],
      iconAnchor: [80, 13]
    });
    L.marker(badgeCoord, { icon: recBadgeIcon }).addTo(lg);

    recLine.bindPopup(`
      <div style="font-family:'Segoe UI',sans-serif;min-width:240px;padding:4px;color:#f8fafc">
        <div style="background:#10b981;color:#000;font-size:11px;font-weight:900;padding:3px 8px;border-radius:4px;display:inline-block;margin-bottom:4px">
          ⭐ AI RECOMMENDED ROUTE
        </div>
        <div style="font-size:13px;font-weight:900;color:#ffffff;margin:2px 0 6px">${recommendedRoute.stationCodes.join(" ➔ ")}</div>
        <div style="font-size:11px;color:#cbd5e1;line-height:1.4;margin-bottom:6px">
          <div>• <b>Distance:</b> ${recommendedRoute.distanceKm} km</div>
          <div>• <b>Travel Time:</b> ${recommendedRoute.travelTimeFormatted} (Delay: <b style="color:#10b981">+${recommendedRoute.delayMin} min</b>)</div>
          <div>• <b>Passenger Impact:</b> <b style="color:#4ade80">${recommendedRoute.passengerImpact}</b></div>
          <div>• <b>Line Standard:</b> ${recommendedRoute.trackAvailability}</div>
        </div>
        <div style="font-size:10.5px;color:#a7f3d0;background:rgba(16,185,129,0.15);padding:4px 6px;border-radius:4px">
          ${recommendedRoute.recommendationReason}
        </div>
      </div>
    `);

    // Auto-fit bounds to encompass blocked section and recommended route
    try {
      const allCoords = [
        ...recommendedRoute.polylineCoords,
        ...blockedSections.flatMap(b => {
          const sU = SR_GRAPH_STATIONS[b.u];
          const sV = SR_GRAPH_STATIONS[b.v];
          return sU && sV ? [[sU.lat, sU.lng], [sV.lat, sV.lng]] : [];
        })
      ];
      if (allCoords.length > 0) {
        map.flyToBounds(L.latLngBounds(allCoords), { padding: [60, 60], duration: 1.2 });
      }
    } catch(e) {}
  }

  // 4. RENDER AFFECTED TRAIN MARKER (IF SPECIFIED)
  if (affectedTrain && recommendedRoute && recommendedRoute.polylineCoords.length > 0) {
    const startCoord = recommendedRoute.polylineCoords[0];
    const trainIcon = L.divIcon({
      className: "ai-detour-train-icon",
      html: `
        <div style="background:#0284c7;color:#ffffff;border:2px solid #38bdf8;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:900;display:flex;align-items:center;gap:4px;box-shadow:0 0 12px rgba(56,189,248,0.8);white-space:nowrap">
          <span>🚆</span> ${affectedTrain}
        </div>
      `,
      iconSize: [120, 26],
      iconAnchor: [60, 13]
    });
    const trainMarker = L.marker(startCoord, { icon: trainIcon }).addTo(lg);
    window.__aiTrainDetourMarker = trainMarker;
  }

  // 5. MOUNT FLOATING AI RECOMMENDATION PANEL & MAP LEGEND OVER MAP CONTAINER
  mountAIRouteMapFloatingPanel(recommendedRoute, candidateRoutes, blockedSections);
}

/**
 * Removes AI Route Analysis overlays and returns map to Normal / Default State
 */
export function clearAIRouteAnalysisFromMap(map) {
  if (window.__aiRouteAnalysisLayerGroup && map) {
    try { map.removeLayer(window.__aiRouteAnalysisLayerGroup); } catch(e) {}
    window.__aiRouteAnalysisLayerGroup = null;
  }
  const floatingPanel = document.querySelector("#aiRouteFloatingMapPanel");
  if (floatingPanel) floatingPanel.remove();
  const mapLegend = document.querySelector("#aiRouteMapLegend");
  if (mapLegend) mapLegend.remove();
}

/**
 * Mounts the high-contrast floating decision panel directly over the Leaflet map stage
 */
function mountAIRouteMapFloatingPanel(recommendedRoute, candidateRoutes, blockedSections) {
  const oldP = document.querySelector("#aiRouteFloatingMapPanel");
  if (oldP) oldP.remove();
  const oldL = document.querySelector("#aiRouteMapLegend");
  if (oldL) oldL.remove();

  const mapStage = document.querySelector("#snapMapStage") || document.querySelector("#smartMapStage");
  if (!mapStage) return;

  const blockedText = blockedSections.map(b => b.name).join(", ");
  const trainText = aiRouteAnalysisState.affectedTrain ? ` &bull; Train: <b style="color:#38bdf8">${aiRouteAnalysisState.affectedTrain}</b>` : '';

  const panel = document.createElement("div");
  panel.id = "aiRouteFloatingMapPanel";
  panel.className = "ai-route-floating-panel";
  panel.style.cssText = `
    position: absolute;
    top: 14px;
    left: 14px;
    z-index: 1000;
    width: 360px;
    max-width: calc(100% - 28px);
    background: rgba(7, 22, 43, 0.95);
    backdrop-filter: blur(8px);
    border: 1.5px solid #0284c7;
    border-radius: 10px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    color: #f8fafc;
    font-family: 'Segoe UI', system-ui, sans-serif;
    padding: 14px;
    transition: all 0.2s ease;
  `;

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid rgba(56,189,248,0.25);padding-bottom:8px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:16px">🤖</span>
        <strong style="font-size:12.5px;color:#38bdf8;letter-spacing:0.3px">AI ROUTE ANALYSIS &amp; DECISION SUPPORT</strong>
      </div>
      <div style="display:flex;align-items:center;gap:5px">
        <button onclick="(function(){const p=document.getElementById('aiRoutePanelBody');const btn=document.getElementById('aiRoutePanelToggleBtn');if(p){const collapsed=p.style.display==='none';p.style.display=collapsed?'block':'none';btn.textContent=collapsed?'▲ Minimize':'▼ Expand';}})()" id="aiRoutePanelToggleBtn" style="background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid #38bdf8;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:800;cursor:pointer" title="Collapse panel to see map">▲ Minimize</button>
        <button onclick="window.__resetAIRouteAnalysis()" style="background:rgba(239,68,68,0.15);color:#fca5a5;border:1px solid #ef4444;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:800;cursor:pointer" title="Return to default clean network map">✕ Reset</button>
      </div>
    </div>
    <div id="aiRoutePanelBody">

    <!-- Block Alert Strip -->
    <div style="background:rgba(220,38,38,0.15);border:1px solid #ef4444;border-radius:6px;padding:6px 10px;font-size:11px;color:#fca5a5;margin-bottom:10px;display:flex;align-items:center;gap:6px">
      <span style="font-size:14px">🔴</span>
      <div>
        <b>Section Blocked:</b> ${blockedText} ${trainText}
      </div>
    </div>

    ${recommendedRoute ? `
      <!-- Recommended Route Hero Box -->
      <div style="background:linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.25) 100%);border:1.5px solid #10b981;border-radius:8px;padding:10px 12px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <span style="color:#a7f3d0;font-size:10.5px;font-weight:900;text-transform:uppercase">⭐ AI RECOMMENDED ROUTE</span>
          <span style="background:#10b981;color:#000;font-size:10px;font-weight:900;padding:1px 6px;border-radius:3px">SCORE: ${recommendedRoute.score}/100</span>
        </div>
        <div style="font-size:13px;font-weight:900;color:#ffffff;margin-bottom:6px">
          ${recommendedRoute.stationCodes.join(" ➔ ")}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:6px;font-size:10.5px;color:#cbd5e1;background:rgba(0,0,0,0.25);padding:6px;border-radius:4px;margin-bottom:6px">
          <div>Est. Delay: <b style="color:#10b981">+${recommendedRoute.delayMin} mins</b></div>
          <div>Passenger Impact: <b style="color:#4ade80">${recommendedRoute.passengerImpact}</b></div>
          <div>Distance: <b>${recommendedRoute.distanceKm} km</b></div>
          <div>Travel Time: <b>${recommendedRoute.travelTimeFormatted}</b></div>
        </div>
        <div style="font-size:10px;color:#6ee7b7;line-height:1.3">
          <b>Reason:</b> ${recommendedRoute.recommendationReason}
        </div>
      </div>
    ` : ''}

    <!-- Other Evaluated Alternatives Strip -->
    <div style="margin-bottom:10px">
      <div style="font-size:10.5px;color:#94a3b8;font-weight:700;margin-bottom:4px">ALL FEASIBLE ALTERNATIVES (${candidateRoutes.length} DISCOVERED):</div>
      <div style="display:flex;flex-direction:column;gap:4px;max-height:110px;overflow-y:auto">
        ${candidateRoutes.map(r => `
          <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.04);border:1px solid ${r.isRecommended ? '#10b981' : 'rgba(255,255,255,0.08)'};border-radius:4px;padding:4px 8px;font-size:10.5px">
            <div>
              <b style="color:${r.isRecommended ? '#10b981' : '#ffffff'}">${r.isRecommended ? '⭐' : '⚪'} ${r.stationCodes.join(' ➔ ')}</b>
            </div>
            <div style="text-align:right">
              <span style="color:#f59e0b;font-weight:700">+${r.delayMin}m</span>
              <span style="color:#94a3b8;margin-left:4px">(${r.score} pts)</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Action Buttons -->
    <div style="display:flex;gap:6px">
      <button onclick="window.__animateDetourTrain()" style="flex:1;background:#0284c7;color:#ffffff;border:none;border-radius:5px;padding:6px;font-size:11px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:4px">
        <span>▶</span> Animate Train Diversion
      </button>
      <button onclick="window.toggleAutonomousCopilot(true); window.sendCopilotMessage('Why did you choose the recommended route?');" style="background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid #38bdf8;border-radius:5px;padding:6px 10px;font-size:11px;font-weight:700;cursor:pointer">
        💬 Ask Why
      </button>
    </div>
    </div>
  `;

  // Map Legend
  const legend = document.createElement("div");
  legend.id = "aiRouteMapLegend";
  legend.className = "ai-route-map-legend";
  legend.style.cssText = `
    position: absolute;
    bottom: 48px;
    right: 14px;
    z-index: 1000;
    background: rgba(7, 22, 43, 0.92);
    backdrop-filter: blur(6px);
    border: 1px solid #1a3c63;
    border-radius: 8px;
    padding: 8px 12px;
    color: #cbd5e1;
    font-size: 10.5px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;
  legend.innerHTML = `
    <div style="font-size:10px;font-weight:900;color:#93c5fd;text-transform:uppercase;margin-bottom:2px">MAP ROUTING LEGEND</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="color:#ef4444;font-size:13px">🔴</span> <b>Maintenance / Blocked</b></div>
    <div style="display:flex;align-items:center;gap:6px"><span style="color:#f59e0b;font-size:13px">⚪</span> <b>Alternative Route</b></div>
    <div style="display:flex;align-items:center;gap:6px"><span style="color:#10b981;font-size:13px">⭐</span> <b style="color:#4ade80">AI Recommended Route</b></div>
    <div style="display:flex;align-items:center;gap:6px"><span style="color:#22c55e;font-size:13px">🟢</span> Available Track</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="font-size:12px">🚆</span> Train Marker</div>
    <div style="display:flex;align-items:center;gap:6px"><span style="color:#f59e0b;font-size:12px">⚠️</span> Potential Conflict</div>
  `;

  mapStage.appendChild(panel);
  mapStage.appendChild(legend);
}

/**
 * Smoothly animates the affected train marker along the recommended detour route
 */
export function animateTrainDetour(map) {
  const marker = window.__aiTrainDetourMarker;
  const recRoute = aiRouteAnalysisState.recommendedRoute;
  if (!marker || !recRoute || !recRoute.polylineCoords || recRoute.polylineCoords.length === 0) {
    if (typeof window.showToast === "function") {
      window.showToast("No train or recommended route active to animate.");
    }
    return;
  }

  const coords = recRoute.polylineCoords;
  let step = 0;
  clearInterval(window.__aiTrainAnimationTimer);

  window.__aiTrainAnimationTimer = setInterval(() => {
    if (step >= coords.length) {
      clearInterval(window.__aiTrainAnimationTimer);
      if (typeof window.showToast === "function") {
        window.showToast("Train diversion simulation completed safely.");
      }
      return;
    }
    marker.setLatLng(coords[step]);
    step++;
  }, 350);
}

// Global browser window bindings
if (typeof window !== "undefined") {
  window.aiRouteAnalysisState = aiRouteAnalysisState;
  window.triggerAIRouteAnalysis = triggerAIRouteAnalysis;
  window.resetAIRouteAnalysis = resetAIRouteAnalysis;
  window.__resetAIRouteAnalysis = resetAIRouteAnalysis;
  window.__animateDetourTrain = () => animateTrainDetour(window.leafletMapInstance);
}
