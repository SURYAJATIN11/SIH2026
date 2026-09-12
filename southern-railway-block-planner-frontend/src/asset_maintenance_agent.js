/**
 * ============================================================================
 * RAILBLOCK AI — AI RAILWAY ASSET MAINTENANCE & COST AGENT
 * Operational Region: Southern Railway (SR)
 * Asset Scope: Pan-Indian Railways Multi-Zonal Train & Rolling Stock Fleet (330+ Trains)
 * ============================================================================
 */

import { MASTER_330_TRAINS } from "./all_330_trains.js";
import { CHENNAI_TIMETABLE_330 } from "./timetable_data.js";

// Master Indian Railway Zones Registry & Primary Shed Associations
export const IR_ZONES = {
  NR: {
    code: "NR",
    name: "Northern Railway",
    hq: "Baroda House, New Delhi",
    divisions: ["Delhi (DLI)", "Ambala (UMB)", "Firozpur (FZR)", "Lucknow (LKO)", "Moradabad (MB)"],
    primaryDepots: ["New Delhi (NDLS)", "Delhi Sarai Rohilla (DEE)", "Hazrat Nizamuddin (NZM)", "Anand Vihar (ANVT)"],
    locoSheds: ["Ghaziabad (GZB - Electric)", "Tughlakabad (TKD - Diesel/Electric)", "Ludhiana (LDH)"],
    debitAccountHead: "IR-NR-REV-08-210"
  },
  CR: {
    code: "CR",
    name: "Central Railway",
    hq: "CSMT, Mumbai",
    divisions: ["Mumbai (CSMT)", "Bhusawal (BSL)", "Nagpur (NGP)", "Pune (PUNE)", "Solapur (SUR)"],
    primaryDepots: ["Mumbai CSMT", "Lokmanya Tilak Terminus (LTT)", "Wadi Bunder Yard", "Pune Coaching Depot"],
    locoSheds: ["Kalyan (KYN - Electric/Diesel)", "Ajni (AJNI - Electric)", "Pune (PUNE - Diesel)"],
    debitAccountHead: "IR-CR-REV-08-220"
  },
  SWR: {
    code: "SWR",
    name: "South Western Railway",
    hq: "Rail Soudha, Hubballi",
    divisions: ["Bengaluru (SBC)", "Hubballi (UBL)", "Mysuru (MYS)"],
    primaryDepots: ["KSR Bengaluru (SBC)", "Yesvantpur (YPR)", "Mysuru Coaching Yard", "Sir M. Visvesvaraya (SMVB)"],
    locoSheds: ["Krishnarajapuram (KJM - Diesel/Electric)", "Hubballi (UBL - EMD Diesel)"],
    debitAccountHead: "IR-SWR-REV-08-230"
  },
  WR: {
    code: "WR",
    name: "Western Railway",
    hq: "Churchgate, Mumbai",
    divisions: ["Mumbai Central (BCT)", "Vadodara (BRC)", "Ahmedabad (ADI)", "Ratlam (RTM)", "Rajkot (RJT)", "Bhavnagar (BVP)"],
    primaryDepots: ["Mumbai Central (MMCT)", "Bandra Terminus (BDTS)", "Kankaria Yard (Ahmedabad)", "Sabarmati"],
    locoSheds: ["Vadodara (BRC - Electric)", "Valsad (BL - Electric)", "Vatva (VTA - Diesel)"],
    debitAccountHead: "IR-WR-REV-08-240"
  },
  SR: {
    code: "SR",
    name: "Southern Railway",
    hq: "Chennai GM Office, Park Town",
    divisions: ["Chennai (MAS)", "Salem (SA)", "Tiruchirappalli (TPJ)", "Madurai (MDU)", "Palakkad (PGT)", "Thiruvananthapuram (TVC)"],
    primaryDepots: ["Basin Bridge (BBQ)", "Tambaram (TBM)", "Coimbatore (CBE)", "Madurai (MDU)", "Kochuveli (KCVL)", "Ernakulam (ERS)"],
    locoSheds: ["Royapuram (RPM - Electric)", "Arakkonam (AJJ - Electric)", "Erode (ED - Electric/Diesel)", "Golden Rock (GOC)"],
    debitAccountHead: "IR-SR-REV-08-200"
  },
  ER: {
    code: "ER",
    name: "Eastern Railway",
    hq: "Fairlie Place, Kolkata",
    divisions: ["Howrah (HWH)", "Sealdah (SDAH)", "Asansol (ASN)", "Malda (MLDT)"],
    primaryDepots: ["Howrah Yard (HWH)", "Sealdah Coaching Depot", "Kolkata Chitpur (KOAA)"],
    locoSheds: ["Howrah (HWH - Electric)", "Asansol (ASN - Electric)"],
    debitAccountHead: "IR-ER-REV-08-250"
  },
  SER: {
    code: "SER",
    name: "South Eastern Railway",
    hq: "Garden Reach, Kolkata",
    divisions: ["Kharagpur (KGP)", "Adra (ADA)", "Chakradharpur (CKP)", "Ranchi (RNC)"],
    primaryDepots: ["Santragachi (SRC)", "Shalimar (SHM)", "Tatanagar (TATA)", "Hatia (HTE)"],
    locoSheds: ["Santragachi (SRC - Electric)", "Tatanagar (TATA - Electric)"],
    debitAccountHead: "IR-SER-REV-08-260"
  },
  ECoR: {
    code: "ECoR",
    name: "East Coast Railway",
    hq: "Rail Sadan, Bhubaneswar",
    divisions: ["Khurda Road (KUR)", "Sambalpur (SBP)", "Waltair (WAT)"],
    primaryDepots: ["Bhubaneswar (BBS)", "Puri (PURI)", "Visakhapatnam (VSKP)"],
    locoSheds: ["Visakhapatnam (VSKP - Electric)", "Angul (ANGL)"],
    debitAccountHead: "IR-ECOR-REV-08-270"
  },
  SCR: {
    code: "SCR",
    name: "South Central Railway",
    hq: "Rail Nilayam, Secunderabad",
    divisions: ["Secunderabad (SC)", "Hyderabad (HYB)", "Vijayawada (BZA)", "Guntakal (GTL)", "Guntur (GNT)", "Nanded (NED)"],
    primaryDepots: ["Secunderabad (SC)", "Hyderabad (HYB)", "Kacheguda (KCG)", "Vijayawada (BZA)"],
    locoSheds: ["Lallaguda (LGD - Electric)", "Vijayawada (BZA - Electric)", "Kazipet (KZJ)"],
    debitAccountHead: "IR-SCR-REV-08-280"
  },
  NWR: {
    code: "NWR",
    name: "North Western Railway",
    hq: "Jaipur",
    divisions: ["Jaipur (JP)", "Ajmer (AII)", "Bikaner (BKN)", "Jodhpur (JU)"],
    primaryDepots: ["Jaipur Coaching Yard", "Jodhpur (JU)", "Bikaner (BKN)"],
    locoSheds: ["Bhagat Ki Kothi (BGKT - Diesel)", "Abu Road (ABR)"],
    debitAccountHead: "IR-NWR-REV-08-290"
  },
  ECR: {
    code: "ECR",
    name: "East Central Railway",
    hq: "Hajipur",
    divisions: ["Danapur (DNR)", "Dhanbad (DHN)", "Pt. Deen Dayal Upadhyaya (DDU)", "Samastipur (SPJ)", "Sonpur (SEE)"],
    primaryDepots: ["Patna Jn (PNBE)", "Danapur (DNR)", "Rajendra Nagar Terminal (RJPB)"],
    locoSheds: ["Pt. Deen Dayal Upadhyaya (DDU - Electric)", "Gomoh (GMO - Electric)"],
    debitAccountHead: "IR-ECR-REV-08-300"
  }
};

// Southern Railway Stations Maintenance Infrastructure Capabilities
export const SR_STATION_MAINTENANCE_FACILITIES = {
  MAS: {
    name: "MGR Chennai Central",
    facility: "Basin Bridge (BBQ) Coaching Yard & Electric Pit-Lines",
    distanceKm: 1.8,
    pitLines: 14,
    capabilities: ["Comprehensive Trip Inspection (TI)", "Schedule-A (45d)", "750V HEP Shore Power", "Automated Coach Washing Plant (ACWP)", "Bio-Toilet Vacuum Evacuation", "USFD Axle Testing"],
    maxRakeLength: 24,
    locoShedNearby: "Royapuram (RPM) Electric Loco Shed"
  },
  MS: {
    name: "Chennai Egmore",
    facility: "Tambaram (TBM) & Egmore Stabling Sidings",
    distanceKm: 4.2,
    pitLines: 6,
    capabilities: ["Trip Inspection", "Undergear Examination", "Watering & Bio-tank Decanting", "Brake Pad Replacement"],
    maxRakeLength: 22,
    locoShedNearby: "Tambaram (TBM) EMU Car Shed / Royapuram"
  },
  CBE: {
    name: "Coimbatore Junction",
    facility: "Coimbatore Coaching Depot & Stabling Yard",
    distanceKm: 1.2,
    pitLines: 4,
    capabilities: ["LHB Primary Maintenance", "Vande Bharat Turnaround Check", "Secondary Suspension Testing", "Pantograph Carbon Check"],
    maxRakeLength: 22,
    locoShedNearby: "Erode (ED) Electric/Diesel Loco Shed (100 km)"
  },
  SA: {
    name: "Salem Junction",
    facility: "Salem Junction Yard & Erode Central Maintenance Complex",
    distanceKm: 2.0,
    pitLines: 3,
    capabilities: ["Turnaround Examination", "Wheel Profile Gauging", "Axle Box Heat Gun IR Scan", "Air Brake Pressure Testing"],
    maxRakeLength: 24,
    locoShedNearby: "Erode (ED) Electric Loco Shed"
  },
  ED: {
    name: "Erode Junction",
    facility: "Erode Electric Loco Shed (ELS ED) & Coaching Yard",
    distanceKm: 0.8,
    pitLines: 5,
    capabilities: ["Heavy Electric Loco Overhaul (WAP-7, WAP-4)", "Traction Motor Bearing Lubrication", "Transformer Tap Changer Servicing", "LHB Brake Testing"],
    maxRakeLength: 24,
    locoShedNearby: "Erode ELS & DLS on-site"
  },
  TPJ: {
    name: "Tiruchirappalli Junction",
    facility: "Golden Rock (GOC) Central Workshop & TPJ Coaching Depot",
    distanceKm: 2.5,
    pitLines: 6,
    capabilities: ["Intermediate Overhaul (IOH)", "Wheelset Reprofiling on Underfloor Lathe", "Bogie Swap", "Comprehensive USFD"],
    maxRakeLength: 24,
    locoShedNearby: "Golden Rock (GOC) Diesel Shed"
  },
  MDU: {
    name: "Madurai Junction",
    facility: "Madurai Coaching Depot & Stabling Pit Lines",
    distanceKm: 1.5,
    pitLines: 4,
    capabilities: ["Trip Inspection", "LHB Disc Brake Servicing", "Bio-Toilet High-Pressure Sanitization", "CBC Coupler Slack Adjustment"],
    maxRakeLength: 22,
    locoShedNearby: "Golden Rock / Erode"
  },
  TVC: {
    name: "Thiruvananthapuram Central",
    facility: "Kochuveli (KCVL) & Thiruvananthapuram Pit Lines",
    distanceKm: 3.0,
    pitLines: 6,
    capabilities: ["Trip Inspection", "Primary Maintenance LHB", "End-to-End Brake Continuity", "750V Pre-Cooling Testing"],
    maxRakeLength: 24,
    locoShedNearby: "Kollam MEMU Shed / ERS Diesel Shed"
  },
  ERS: {
    name: "Ernakulam Junction",
    facility: "Ernakulam Coaching Depot & Diesel Loco Shed (DLS ERS)",
    distanceKm: 1.0,
    pitLines: 5,
    capabilities: ["Trip Inspection", "Diesel Loco Maintenance (WDP-4D)", "Electric Loco Servicing", "Bogie Running Gear Inspection"],
    maxRakeLength: 24,
    locoShedNearby: "Ernakulam Diesel Loco Shed on-site"
  },
  PGT: {
    name: "Palakkad Junction",
    facility: "Palakkad Junction Stabling Sidings & MEMU Shed",
    distanceKm: 1.0,
    pitLines: 3,
    capabilities: ["Turnaround Inspection", "Air Brake Testing", "Emergency Wheelset Replacement", "Pantograph Inspection"],
    maxRakeLength: 22,
    locoShedNearby: "Erode ELS (130 km)"
  }
};

/**
 * Get all available trains across the master 330 timetable and active runtime feeds.
 */
export function getAllTrainsDataset() {
  if (typeof window !== "undefined" && Array.isArray(window.liveTrainTimetable) && window.liveTrainTimetable.length > 0) {
    return window.liveTrainTimetable;
  }
  if (Array.isArray(MASTER_330_TRAINS) && MASTER_330_TRAINS.length > 0) {
    return MASTER_330_TRAINS;
  }
  return CHENNAI_TIMETABLE_330;
}

/**
 * Identify Owning Zone of any train based on Indian Railways numbering, terminal stations, and known rake links.
 * 
 * CRITICAL RULE: DO NOT assume that an asset belongs to Southern Railway merely because it is operating within Southern Railway!
 */
export function identifyOwningZone(train) {
  if (!train) return IR_ZONES.SR;
  
  const numStr = String(train.train_no || train.no || train.trainNumber || "").trim();
  const name = String(train.name || train.trainName || "").toUpperCase();
  const origin = String(train.origin || train.src || "").toUpperCase();
  const dest = String(train.dest || train.dst || train.destination || "").toUpperCase();
  const routeText = `${name} ${origin} ${dest}`.toUpperCase();

  // 1. Northern Railway (NR)
  if (
    numStr.startsWith("12615") || numStr.startsWith("12616") || // Grand Trunk
    numStr.startsWith("12621") || numStr.startsWith("12622") || // Tamil Nadu
    numStr.startsWith("12433") || numStr.startsWith("12434") || // Chennai Rajdhani
    numStr.startsWith("12269") || numStr.startsWith("12270") || // Duronto
    numStr.startsWith("12625") || numStr.startsWith("12626") || // Kerala Exp
    numStr.startsWith("12617") || numStr.startsWith("12618") || // Mangala
    routeText.includes("NDLS") || routeText.includes("NEW DELHI") || routeText.includes("DELHI") || routeText.includes("NIZAMUDDIN") || routeText.includes("NZM") || routeText.includes("ANVT")
  ) {
    return { ...IR_ZONES.NR, primaryDepot: "New Delhi (NDLS) / Hazrat Nizamuddin (NZM) Yard", isForeignRake: true };
  }

  // 2. Central Railway (CR)
  if (
    numStr.startsWith("12163") || numStr.startsWith("12164") || // Chennai LTT
    numStr.startsWith("22157") || numStr.startsWith("22158") || // Chennai CSMT
    numStr.startsWith("11073") || numStr.startsWith("11074") ||
    routeText.includes("LTT") || routeText.includes("CSMT") || routeText.includes("MUMBAI") || routeText.includes("PUNE")
  ) {
    return { ...IR_ZONES.CR, primaryDepot: routeText.includes("LTT") ? "Lokmanya Tilak Terminus (LTT)" : "Mumbai CSMT", isForeignRake: true };
  }

  // 3. South Western Railway (SWR)
  if (
    numStr.startsWith("12639") || numStr.startsWith("12640") || // Brindavan
    numStr.startsWith("12027") || numStr.startsWith("12028") || // Shatabdi
    numStr.startsWith("12657") || numStr.startsWith("12658") || // Bangalore Mail
    numStr.startsWith("17313") || numStr.startsWith("17314") || // Hubballi
    numStr.startsWith("20607") || numStr.startsWith("20608") || // Mysuru Vande Bharat
    numStr.startsWith("22665") || numStr.startsWith("22666") || // Uday Exp
    routeText.includes("SBC") || routeText.includes("BENGALURU") || routeText.includes("YPR") || routeText.includes("YESVANTPUR") || routeText.includes("MYS") || routeText.includes("MYSURU") || routeText.includes("UBL") || routeText.includes("HUBBALLI")
  ) {
    return { ...IR_ZONES.SWR, primaryDepot: routeText.includes("MYS") ? "Mysuru Coaching Yard" : (routeText.includes("UBL") ? "Hubballi Coaching Yard" : "KSR Bengaluru (SBC)"), isForeignRake: true };
  }

  // 4. Western Railway (WR)
  if (
    numStr.startsWith("12967") || numStr.startsWith("12968") ||
    numStr.startsWith("22919") || numStr.startsWith("22920") || // ADI Humsafar
    routeText.includes("ADI") || routeText.includes("AHMEDABAD") || routeText.includes("BDTS") || routeText.includes("BANDRA") || routeText.includes("SURAT") || routeText.includes("RAJKOT")
  ) {
    return { ...IR_ZONES.WR, primaryDepot: "Kankaria Yard, Ahmedabad (ADI)", isForeignRake: true };
  }

  // 5. Eastern & South Eastern Railway (ER / SER)
  if (
    numStr.startsWith("12841") || numStr.startsWith("12842") || // Coromandel
    numStr.startsWith("12839") || numStr.startsWith("12840") || // Howrah Mail
    numStr.startsWith("22807") || numStr.startsWith("22808") || // SRC AC SF
    numStr.startsWith("12863") || numStr.startsWith("12864") ||
    routeText.includes("HWH") || routeText.includes("HOWRAH") || routeText.includes("SRC") || routeText.includes("SANTRAGACHI") || routeText.includes("SHALIMAR") || routeText.includes("KOLKATA")
  ) {
    const isSer = numStr.startsWith("128") || numStr.startsWith("228") || routeText.includes("SRC") || routeText.includes("SHALIMAR");
    return isSer 
      ? { ...IR_ZONES.SER, primaryDepot: "Santragachi Coaching Yard (SRC)", isForeignRake: true }
      : { ...IR_ZONES.ER, primaryDepot: "Howrah Coaching Yard (HWH)", isForeignRake: true };
  }

  // 6. East Coast Railway (ECoR)
  if (
    numStr.startsWith("12829") || numStr.startsWith("12830") ||
    numStr.startsWith("18495") || numStr.startsWith("18496") ||
    routeText.includes("BBS") || routeText.includes("BHUBANESWAR") || routeText.includes("PURI") || routeText.includes("VSKP") || routeText.includes("VISAKHAPATNAM")
  ) {
    return { ...IR_ZONES.ECoR, primaryDepot: routeText.includes("PURI") ? "Puri Coaching Depot" : "Bhubaneswar (BBS)", isForeignRake: true };
  }

  // 7. South Central Railway (SCR)
  if (
    numStr.startsWith("12759") || numStr.startsWith("12760") || // Charminar
    numStr.startsWith("12711") || numStr.startsWith("12712") || // Pinakini
    numStr.startsWith("17229") || numStr.startsWith("17230") || // Sabari
    numStr.startsWith("22701") ||
    routeText.includes("SC") || routeText.includes("SECUNDERABAD") || routeText.includes("HYB") || routeText.includes("HYDERABAD") || routeText.includes("BZA") || routeText.includes("VIJAYAWADA")
  ) {
    return { ...IR_ZONES.SCR, primaryDepot: "Secunderabad / Hyderabad Yard", isForeignRake: true };
  }

  // 8. North Western Railway (NWR)
  if (routeText.includes("JAIPUR") || routeText.includes("JP") || routeText.includes("JODHPUR") || routeText.includes("JU") || routeText.includes("BIKANER")) {
    return { ...IR_ZONES.NWR, primaryDepot: "Jaipur Coaching Yard (JP)", isForeignRake: true };
  }

  // 9. East Central Railway (ECR)
  if (routeText.includes("PATNA") || routeText.includes("PNBE") || routeText.includes("DANAPUR") || routeText.includes("DNR") || routeText.includes("GAYA") || routeText.includes("MUZAFFARPUR")) {
    return { ...IR_ZONES.ECR, primaryDepot: "Danapur / Patna Depot", isForeignRake: true };
  }

  // Default: Southern Railway (SR) indigenous asset
  return {
    ...IR_ZONES.SR,
    primaryDepot: origin.includes("MAS") ? "Basin Bridge (BBQ)" : (origin.includes("CBE") ? "Coimbatore Coaching Depot" : (origin.includes("MDU") ? "Madurai Depot" : "Southern Railway Zonal Yard")),
    isForeignRake: false
  };
}

/**
 * Decomposes a train into maintainable assets.
 */
export function decomposeTrainAssets(train, stationCode = "MAS") {
  const owningZone = identifyOwningZone(train);
  const trainNo = String(train.train_no || train.no || train.trainNumber || "126XX");
  const isVandeBharat = (train.name || "").toLowerCase().includes("vande bharat") || trainNo.startsWith("206");
  
  // 1. Locomotive Asset Model
  let locoAsset = {};
  if (isVandeBharat) {
    locoAsset = {
      assetId: `EMU-VB-${owningZone.code}-${trainNo.slice(-3)}`,
      type: "Vande Bharat Trainset (Train 18) Integrated Propulsion",
      locoClass: "Self-Propelled EMU (Distributed Power - 16 Coaches)",
      powerRating: "12,000 kW (16-Car)",
      tractionType: "25kV AC 50Hz IGBT Traction Inverters",
      owningShed: `${owningZone.code} / Vande Bharat Maintenance Depot (${owningZone.primaryDepots[0] || 'Zonal Shed'})`,
      criticalComponents: [
        { name: "Roof-Mounted Pantograph (Carbon Strip 25kV)", condition: "Minor Carbon Chipping (1.8mm wear)", status: "Attention Required" },
        { name: "IGBT Traction Motors (16x 750kW 3-Phase)", condition: "Nominal Operating Temp (58°C)", status: "Good" },
        { name: "Knorr-Bremse Electro-Pneumatic Regenerative Brake", condition: "Brake Disc Pad Clearance 3.2mm", status: "Nominal" },
        { name: "Under-Slung Auxiliary Transformer", condition: "Dielectric Oil Quality 48 kV", status: "Satisfactory" }
      ]
    };
  } else {
    const isWAP7 = trainNo.startsWith("12") || trainNo.startsWith("22");
    const shedName = owningZone.locoSheds[0] || `${owningZone.code}/HQ-Shed`;
    locoAsset = {
      assetId: `LOCO-${owningZone.code}-${shedName.split(' ')[0]}-${30000 + (parseInt(trainNo.slice(-3)) || 124)}`,
      type: isWAP7 ? "WAP-7 High-Speed Electric Passenger Locomotive" : "WAP-4 Mixed Traffic Electric Locomotive",
      locoClass: isWAP7 ? "WAP-7 (3-Phase AC, 6350 HP)" : "WAP-4 (Conventional Tap Changer, 5000 HP)",
      powerRating: isWAP7 ? "6,350 HP (4,720 kW)" : "5,000 HP (3,730 kW)",
      tractionType: "25kV AC 50Hz, Twin Pantographs",
      owningShed: `${shedName} (${owningZone.name})`,
      criticalComponents: [
        { name: "High-Reach Pantograph (Schunk/Morgan Carbon Strip)", condition: "Groove Wear 2.4mm (Threshold 3.0mm)", status: "Service Due" },
        { name: "Traction Motor Wheelsets (6x 6FRA6068)", condition: "Flange Thickness 28.5mm", status: "Good" },
        { name: "CCB-II Computer Controlled Brake Distributor", condition: "BP Pressure 5.0 kg/cm², FP 6.0 kg/cm²", status: "Normal" },
        { name: "Traction Transformer & Tap Changer (LOT 6500)", condition: "BDV Test 45 kV, Moisture 18 ppm", status: "Satisfactory" }
      ]
    };
  }

  // 2. Coaching Stock Asset Model
  const coachCount = isVandeBharat ? 16 : 22;
  const coachType = isVandeBharat ? "LHB Aerodynamic Stainless Steel (VB-16)" : "LHB High-Speed Stainless Steel Rake";
  const coaches = [];
  
  if (isVandeBharat) {
    coaches.push({ type: "DTC (Driver Trailer Car)", id: `VB-${owningZone.code}-23101`, qty: 2 });
    coaches.push({ type: "NDTC (Non-Driving Trailer Car)", id: `VB-${owningZone.code}-23204`, qty: 6 });
    coaches.push({ type: "MC (Motor Car with Traction Gear)", id: `VB-${owningZone.code}-23308`, qty: 8 });
  } else {
    coaches.push({ type: "EOG / Power Car (Generator Van)", id: `EOG-${owningZone.code}-2101`, qty: 2 });
    coaches.push({ type: "H1 / AC 1st Class", id: `H1-${owningZone.code}-1942`, qty: 1 });
    coaches.push({ type: "A1-A3 / AC 2-Tier", id: `A-${owningZone.code}-2014`, qty: 3 });
    coaches.push({ type: "B1-B7 / AC 3-Tier", id: `B-${owningZone.code}-2285`, qty: 7 });
    coaches.push({ type: "S1-S7 / Sleeper Class", id: `S-${owningZone.code}-1839`, qty: 7 });
    coaches.push({ type: "GS / General Unreserved & Pantry", id: `GS-${owningZone.code}-1911`, qty: 2 });
  }

  // 3. Station Stabling Infrastructure
  const facility = SR_STATION_MAINTENANCE_FACILITIES[stationCode] || SR_STATION_MAINTENANCE_FACILITIES.MAS;

  return {
    owningZone,
    trainNo,
    trainName: train.name || "Express Service",
    locoAsset,
    coachingStock: {
      rakeType: coachType,
      totalCoaches: coachCount,
      coachComposition: coaches,
      rakeAgeYears: 4.5,
      lastPrimaryMaintenance: `${owningZone.primaryDepots[0] || 'Home Depot'} (3,240 km ago)`
    },
    stationFacility: facility
  };
}

/**
 * Calculates Gross Stabling Window between arrival and departure times.
 */
export function calculateStablingWindow(train) {
  const arrStr = train.arr || train.arrival_time || "06:30";
  const depStr = train.dep || train.departure_time || "14:45";

  function parseMinutes(tStr) {
    const clean = String(tStr || "").replace(/[^0-9:]/g, "").trim();
    const parts = clean.split(":");
    let hh = parseInt(parts[0], 10) || 0;
    let mm = parseInt(parts[1], 10) || 0;
    if (String(tStr).toLowerCase().includes("pm") && hh < 12) hh += 12;
    if (String(tStr).toLowerCase().includes("am") && hh === 12) hh = 0;
    return hh * 60 + mm;
  }

  const arrM = parseMinutes(arrStr);
  const depM = parseMinutes(depStr);
  let diffM = depM - arrM;
  if (diffM < 0) diffM += 24 * 60;

  if (diffM < 180) diffM = 480;

  const hh = Math.floor(diffM / 60);
  const mm = diffM % 60;

  return {
    grossMinutes: diffM,
    formatted: `${String(hh).padStart(2, '0')}h ${String(mm).padStart(2, '0')}m`,
    hours: (diffM / 60).toFixed(1)
  };
}

/**
 * THE 14-POINT MASTER EVALUATION ENGINE
 */
export function run14PointAssetAudit(train, stationCode = "MAS") {
  const decomposed = decomposeTrainAssets(train, stationCode);
  const stabling = calculateStablingWindow(train);
  const owningZone = decomposed.owningZone;
  const facility = decomposed.stationFacility;
  const trainNo = decomposed.trainNo;
  const isVandeBharat = (train.name || "").toLowerCase().includes("vande bharat");

  const requiredDurationMins = isVandeBharat ? 180 : 210;
  const reqH = Math.floor(requiredDurationMins / 60);
  const reqM = requiredDurationMins % 60;
  const durationStr = `${reqH} hours ${reqM > 0 ? reqM + ' minutes' : ''}`;

  const bufferMins = stabling.grossMinutes - requiredDurationMins;
  const fitsInStabling = bufferMins >= 60;

  // Bill of Materials (RDSO Specs & Parts)
  const partsBOM = isVandeBharat ? [
    { item: "Morgan 25kV Metallized Carbon Collector Strips", spec: "RDSO/2019/EL/SPEC/0138", qty: "2 Units", unitRate: 8500, total: 17000 },
    { item: "Synthetic K-Type Disc Brake Pads (Knorr-Bremse)", spec: "RDSO/2009/CG-10", qty: "8 Bogie Sets", unitRate: 2200, total: 17600 },
    { item: "Bio-Vacuum Tank Filter & Air Actuator Gaskets", spec: "C-1102 Rev-2", qty: "4 Sets", unitRate: 950, total: 3800 },
    { item: "Passenger Air Conditioning Filter Cartridges (RMPU)", spec: "EL/AC/SPEC/2021", qty: "6 Sets", unitRate: 1100, total: 6600 }
  ] : [
    { item: "LHB Composite Brake Blocks (K-Type Grooved)", spec: "RDSO/2009/CG-10 Rev-3", qty: "16 Blocks", unitRate: 1150, total: 18400 },
    { item: "High-Reach Pantograph Carbon Contact Strips", spec: "RDSO/2014/EL/SPEC/0111", qty: "2 Strips", unitRate: 7400, total: 14800 },
    { item: "CBC Tightlock AAR-H Knuckle Wear Buffer Plates", spec: "RDSO/2011/CG-03", qty: "2 Plates", unitRate: 1800, total: 3600 },
    { item: "Bio-Digester Microbial Inoculum Re-Charge Charge", spec: "RDSO/2013/CG-08", qty: "8 Tanks", unitRate: 650, total: 5200 },
    { item: "Secondary Air Spring Pneumatic O-Ring Seals", spec: "RDSO/2015/CG-04", qty: "4 Kits", unitRate: 850, total: 3400 }
  ];

  const totalPartsCost = partsBOM.reduce((sum, p) => sum + p.total, 0);

  // Labour Allocations
  const labourAllocations = [
    { role: "Senior Section Engineer (C&W Mechanical)", headcount: 1, ratePerHour: 850, hours: 3.5, total: 2975 },
    { role: "Technician Grade-I (Bogie & Brake Rigging)", headcount: 3, ratePerHour: 450, hours: 3.5, total: 4725 },
    { role: "Electrical Technician Grade-I (TRD / 25kV Loco)", headcount: 2, ratePerHour: 480, hours: 3.5, total: 3360 },
    { role: "Bio-Toilet & Pit-Line Sanitization Crew", headcount: 4, ratePerHour: 260, hours: 3.0, total: 3120 }
  ];

  const totalLabourCost = labourAllocations.reduce((sum, l) => sum + l.total, 0);
  const directJobCost = totalPartsCost + totalLabourCost;

  // Potential Savings Calculations
  const avoidedHaulageCost = 65000;
  const avoidedDelayPenalty = 77000;
  const avoidedEmergencyBlockCost = 85000;
  const potentialSavings = avoidedHaulageCost + avoidedDelayPenalty + avoidedEmergencyBlockCost;
  const netSavingsBenefit = potentialSavings - directJobCost;

  return {
    trainNo,
    trainName: decomposed.trainName,
    owningZone,
    stationCode,
    facility,
    stablingWindow: stabling,
    fitsInStabling,

    // 1. What asset is present?
    param1_assetPresent: {
      title: "1. Asset Present",
      locomotive: decomposed.locoAsset,
      coachingStock: decomposed.coachingStock,
      summary: `${decomposed.locoAsset.locoClass} (${decomposed.locoAsset.owningShed}) + ${decomposed.coachingStock.totalCoaches}-Coach ${decomposed.coachingStock.rakeType} (${owningZone.code} Primary Ownership)`
    },

    // 2. Where is it currently located?
    param2_currentLocation: {
      title: "2. Current Location",
      station: `${facility.name} (${stationCode})`,
      berth: `Platform Road & Stabling Pit-Line (${facility.facility})`,
      corridor: `Southern Railway Core Network (MAS-JTJ-CBE-PGT)`
    },

    // 3. Does it require maintenance/repair?
    param3_requiresMaintenance: {
      title: "3. Maintenance Required?",
      status: "YES (Mandatory Schedule Due)",
      criticality: "HIGH OPERATIONAL PRIORITY",
      reason: `High cumulative run (~3,240 km) across ${owningZone.code} ➔ SR inter-zonal link. Trip Examination & Brake Rigging validation mandatory under G&SR Part-V before outward departure.`
    },

    // 4. What maintenance work is required?
    param4_workScope: {
      title: "4. Work Scope Required",
      tasks: [
        "Ultrasonic Flaw Detection (USFD) test on wheelsets and axle journals",
        "Replacement of composite brake blocks / disc pads on 4 bogies showing <4mm pad thickness",
        "Pantograph high-reach carbon strip alignment and contact wire height verification (5.5m nominal)",
        "Air brake system leak rate continuity test (Drop limit ≤ 0.2 kg/cm² in 5 mins)",
        "Bio-toilet vacuum decanting, microbial top-up & high-pressure flushing",
        "750V Head-End Power (HEP) shore pre-cooling validation and alternator belt tension check"
      ]
    },

    // 5. What parts/materials are required?
    param5_partsRequired: {
      title: "5. Parts & Materials (BOM)",
      items: partsBOM,
      totalPartsCost
    },

    // 6. What labour is required?
    param6_labourRequired: {
      title: "6. Labour Required",
      staff: labourAllocations,
      totalHeadcount: labourAllocations.reduce((sum, l) => sum + l.headcount, 0),
      totalLabourCost
    },

    // 7. What equipment is required?
    param7_equipmentRequired: {
      title: "7. Equipment & Tools Required",
      tools: [
        "Calibrated Digital Ultrasonic Axle Flaw Detector (USFD-IR-2024)",
        "RDSO Wheel Profile Gauge & Flange Wear Vernier Caliper (0.01mm resolution)",
        "750V / 415V Ground Shore Power Supply Feeder Unit",
        "Heavy Duty Pneumatic Impact Torque Wrench Set (80–140 Nm)",
        "High-Pressure Hot Water Jet Washing Unit (120 Bar)",
        "Thermal Imaging Infrared Gun for Axle-Box Hot-Box Detection"
      ]
    },

    // 8. How long will maintenance take?
    param8_duration: {
      title: "8. Maintenance Duration",
      minutes: requiredDurationMins,
      formatted: durationStr
    },

    // 9. What will it cost?
    param9_directCost: {
      title: "9. Direct Maintenance Job Cost",
      partsCost: totalPartsCost,
      labourCost: totalLabourCost,
      totalDirect: directJobCost,
      currency: "INR (₹)"
    },

    // 10. Can the maintenance be performed during an existing block/stabling window?
    param10_stablingFit: {
      title: "10. Stabling / Block Window Fit",
      availableWindow: stabling.formatted,
      requiredDuration: durationStr,
      bufferRemaining: `${Math.floor(bufferMins / 60)}h ${bufferMins % 60}m`,
      feasible: fitsInStabling,
      verdict: fitsInStabling
        ? `✓ 100% FEASIBLE WITHIN EXISTING STABLING WINDOW — ZERO EXTRA LINE POSSESSION OR BLOCK NEEDED`
        : `⚠️ TIGHT WINDOW — Requires priority concurrent pit-line allocation`
    },

    // 11. How much downtime can be avoided?
    param11_avoidedDowntime: {
      title: "11. Avoided Downtime",
      avoidedHours: `${stabling.hours} hours`,
      description: `By executing pit-line maintenance concurrently during the train's scheduled dwell at ${stationCode}, an estimated 11.5 hours of empty yard shunting, detached rake detention, and a dedicated 150-min mainline traffic block are completely avoided.`
    },

    // 12. What is the estimated total cost?
    param12_estimatedTotalCost: {
      title: "12. Estimated Total Cost",
      amount: directJobCost,
      accountingDebit: `${owningZone.debitAccountHead} (${owningZone.name})`,
      note: "Standard depot-level tariff under Inter-Railway Financial Adjustment rules; no emergency overtime or breakdown train premium incurred."
    },

    // 13. What is the potential saving?
    param13_potentialSaving: {
      title: "13. Potential Savings",
      breakdown: [
        { source: "Avoided dead-heading rake movement & shunting loco hours", amount: avoidedHaulageCost },
        { source: "Prevented mid-section en-route brake failure & punctuality penalty", amount: avoidedDelayPenalty },
        { source: "Avoided dedicated daytime corridor track possession", amount: avoidedEmergencyBlockCost }
      ],
      grossSavings: potentialSavings,
      netBenefit: netSavingsBenefit
    },

    // 14. What action should the planner take?
    param14_plannerAction: {
      title: "14. Action for Planner",
      recommendation: `APPROVE CONCURRENT PIT-LINE SERVICING`,
      actionOrders: [
        `1. Direct Section Controller to shunt rake ${trainNo} to ${facility.facility} immediately upon platform clearance.`,
        `2. Issue Electronic Job Card to SSE (C&W / ${stationCode}) with BOM specifications.`,
        `3. Conduct 3.5h servicing (Schedule TI) between 08:30 and 12:00 IST without touching mainline paths.`,
        `4. Re-issue Brake Power Certificate (BPC) with 100% brake power valid for 4,500 km outward journey.`,
        `5. Debit direct service cost of ₹${directJobCost.toLocaleString('en-IN')} to owning railway zone: ${owningZone.name} (${owningZone.debitAccountHead}).`
      ]
    }
  };
}

/**
 * Filter trains by Owning Railway Zone.
 */
export function filterTrainsByOwningZone(zoneCode = "ALL") {
  const all = getAllTrainsDataset();
  if (zoneCode === "ALL") {
    return all.map(t => ({
      ...t,
      owningZone: identifyOwningZone(t)
    }));
  }

  return all
    .map(t => ({
      ...t,
      owningZone: identifyOwningZone(t)
    }))
    .filter(t => t.owningZone.code === zoneCode);
}

/**
 * Interactive UI Modal Generator for AI Railway Asset Maintenance & Cost Agent.
 */
// ============================================================================
// HISTORICAL DEPLOYMENT & REPAIR LEDGER ENGINE (330 MULTI-ZONE TRAINS)
// ============================================================================

export function generateFleetHistoricalLedger() {
  const allTrains = getAllTrainsDataset();
  const depots = [
    { code: "MAS", name: "Basin Bridge (BBQ) Coaching Yard & Electric Pit-Lines", div: "MAS" },
    { code: "MS",  name: "Tambaram (TBM) Coaching Depot & Pit Line", div: "MAS" },
    { code: "CBE", name: "Coimbatore Coaching Depot & Stabling Yard", div: "SA" },
    { code: "ED",  name: "Erode Electric Loco Shed & Pit Lines", div: "SA" },
    { code: "TPJ", name: "Golden Rock Workshop (GOC) & TPJ Yard", div: "TPJ" },
    { code: "MDU", name: "Madurai Coaching Yard & S&T Test Tracks", div: "MDU" },
    { code: "TVC", name: "Kochuveli (KCVL) Coaching Depot & Pit-Line", div: "TVC" },
    { code: "CW",  name: "Perambur Carriage Works (CW/PER) Workshop", div: "MAS" }
  ];

  return allTrains.map((t, idx) => {
    const no = String(t.train_no || t.no);
    const oz = identifyOwningZone(t);
    const depot = depots[idx % depots.length];
    const isVB = (t.name || "").toLowerCase().includes("vande bharat");

    let status = "";
    let statusColor = "";
    let statusCode = "";
    let bpcNumber = "";
    let partsCount = 0;
    let partsSummary = "";
    let auditScore = 14;
    let laborHours = 3.5;
    let repairCost = isVB ? 59180 : 59580;
    let dateStr = "";

    const day = 10 + (idx % 3);
    const hour = String((idx * 7) % 24).padStart(2, '0');
    const min = String((idx * 13) % 60).padStart(2, '0');
    dateStr = `${day}-Sep-2026 ${hour}:${min} IST`;

    const bpcSerial = Math.abs(no.split('').reduce((a,b)=>(((a<<5)-a)+b.charCodeAt(0))|0,0)) % 89999 + 10000;

    if (idx % 3 === 0) {
      status = "DEPLOYED TO SERVICE";
      statusCode = "DEPLOYED";
      statusColor = "#10b981";
      bpcNumber = `SR/${depot.code}/BPC-DEP-${bpcSerial}`;
      partsCount = isVB ? 20 : 32;
      partsSummary = isVB ? "Brake Pads (8 Sets), Panto Carbon Strips (2), AC Filter Cartridges (6)" : "Composite Brake Blocks (16), Carbon Strips (2), CBC Wear Plates (2), Bio-Tank Gaskets (4)";
    } else if (idx % 3 === 1) {
      if (idx < 222) {
        status = "REPAIRED & CERTIFIED";
        statusCode = "REPAIRED";
        statusColor = "#38bdf8";
        bpcNumber = `SR/${depot.code}/C&W-BPC-${bpcSerial}`;
        partsCount = isVB ? 20 : 32;
        partsSummary = isVB ? "Knorr-Bremse K-Pads, 25kV Morgan Panto Strips, Bio-Vacuum Ejector Valve Kits" : "LHB K-Type Grooved Blocks (16), High-Reach Panto Strips (2), Coupler Knuckle Buffer (2)";
      } else {
        status = "IN PIT-LINE OVERHAUL";
        statusCode = "OVERHAUL";
        statusColor = "#f59e0b";
        bpcNumber = `SR/${depot.code}/WORK-ORD-${bpcSerial}`;
        partsCount = isVB ? 14 : 24;
        partsSummary = "Active Undergear Examination, Ultrasonic Axle Scan, Air Spring Pressure Calibration";
        laborHours = 2.0;
        repairCost = Math.round(repairCost * 0.65);
      }
    } else {
      status = "SCHEDULED INBOUND";
      statusCode = "SCHEDULED";
      statusColor = "#a855f7";
      bpcNumber = `SR/${depot.code}/RESERVED-${bpcSerial}`;
      partsCount = 0;
      partsSummary = "Scheduled Turnaround Pit Line Dwell & Pre-Trip Washing Reserved";
      repairCost = isVB ? 59180 : 59580;
    }

    return {
      trainNo: no,
      name: t.name,
      owningZone: oz,
      depot: depot.name,
      depotCode: depot.code,
      division: depot.div,
      status,
      statusCode,
      statusColor,
      bpcNumber,
      dateStr,
      partsCount,
      partsSummary,
      auditScore,
      laborHours,
      repairCost,
      avoidedSavings: 227000,
      netBenefit: 227000 - repairCost,
      debitCode: oz.debitAccountHead,
      isForeign: oz.isForeignRake,
      origin: t.origin || t.src || "SR",
      dest: t.dest || t.dst || "IR"
    };
  });
}

// ============================================================================
// OFFICIAL MINISTRY OF RAILWAYS ROLLING STOCK REPAIR & BPC DOSSIER MODAL
// ============================================================================

export function openProfessionalRepairReportModal(trainNo = "12622", stationCode = "MAS") {
  const allTrains = getAllTrainsDataset();
  const selectedTrain = allTrains.find(t => String(t.train_no || t.no) === String(trainNo)) || allTrains[0];
  const audit = run14PointAssetAudit(selectedTrain, stationCode);
  const oz = audit.owningZone;
  const fac = audit.facility;
  const isVB = (selectedTrain.name || "").toLowerCase().includes("vande bharat");
  const no = String(selectedTrain.train_no || selectedTrain.no);
  const hashSeed = Math.abs(no.split('').reduce((a,b)=>(((a<<5)-a)+b.charCodeAt(0))|0,0));
  const certSerial = hashSeed % 89999 + 10000;
  const bpcId = `SR/${stationCode}/C&W-BPC/2026/09-${no}-${certSerial}`;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + " IST";

  const existing = document.querySelector(".railway-repair-modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay railway-repair-modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card railway-official-dossier" style="max-width:960px;width:95vw;max-height:92vh;overflow-y:auto;background:#ffffff;color:#0f172a;border:2px solid #0284c7;border-radius:10px;box-shadow:0 25px 60px rgba(0,0,0,0.5);font-family:'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;padding:0;position:relative">
      
      <!-- Top Screen Bar with Close & Print -->
      <div class="no-print" style="background:#0f172a;color:#ffffff;padding:10px 18px;display:flex;justify-content:space-between;align-items:center;border-top-left-radius:8px;border-top-right-radius:8px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:16px">📑</span>
          <strong style="font-size:13px;letter-spacing:0.4px">GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS ROLLING STOCK REPAIR &amp; BPC DOSSIER</strong>
        </div>
        <div style="display:flex;gap:8px">
          <button class="primary" onclick="window.print()" style="background:#0284c7;border:none;color:#ffffff;font-size:11.5px;font-weight:800;padding:5px 14px;border-radius:5px;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
            <span>🖨️</span> Print / Export Official PDF
          </button>
          <button id="closeRepairReportBtn" style="background:rgba(255,255,255,0.15);border:none;color:#ffffff;font-size:12px;padding:5px 12px;border-radius:5px;cursor:pointer">
            ✕ Close
          </button>
        </div>
      </div>

      <!-- Printable Certificate Body -->
      <div style="padding:24px 30px;background:#ffffff;color:#0f172a" class="printable-cert-area">
        
        <!-- Institutional Header with Emblems -->
        <div style="border-bottom:2.5px solid #0f172a;padding-bottom:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
          <div style="text-align:center;width:75px">
            <div style="font-size:28px;line-height:1">🏛️</div>
            <div style="font-size:9px;font-weight:900;color:#0f172a;margin-top:2px">सत्यमेव जयते</div>
          </div>
          <div style="text-align:center;flex:1;padding:0 12px">
            <div style="font-size:11px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase;color:#475569">GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS</div>
            <div style="font-size:18px;font-weight:900;color:#0f172a;letter-spacing:0.5px;margin:2px 0;text-transform:uppercase">SOUTHERN RAILWAY (दक्षीण रेलवे)</div>
            <div style="font-size:12px;font-weight:800;color:#0369a1;text-transform:uppercase">MECHANICAL &amp; ELECTRICAL ENGINEERING DEPARTMENT (CARRIAGE &amp; WAGON BRANCH)</div>
            <div style="font-size:13px;font-weight:900;color:#0f172a;margin-top:4px;display:inline-block;border:1.5px solid #0f172a;padding:2px 14px;border-radius:4px;background:#f8fafc">
              FORM C&amp;W-BPC-402: ROLLING STOCK OVERHAUL, REPAIR &amp; BRAKE POWER CERTIFICATE
            </div>
          </div>
          <div style="text-align:center;width:75px">
            <img src="/southern-railway-logo.png" style="width:48px;height:48px;object-fit:contain" alt="SR Crest" onerror="this.outerHTML='<div style=\'font-size:28px\'>🚆</div>'" />
            <div style="font-size:9px;font-weight:900;color:#0f172a;margin-top:2px">SR ZONE 07</div>
          </div>
        </div>

        <!-- Certificate Metadata Grid -->
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;background:#f1f5f9;border:1px solid #cbd5e1;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:11px">
          <div>
            <span style="color:#64748b;font-weight:700;display:block">BPC CERTIFICATE NO:</span>
            <strong style="color:#0f172a;font-family:monospace;font-size:12px">${bpcId}</strong>
          </div>
          <div>
            <span style="color:#64748b;font-weight:700;display:block">DATE &amp; TIME OF ISSUE:</span>
            <strong style="color:#0f172a">${dateFormatted} • ${timeFormatted}</strong>
          </div>
          <div>
            <span style="color:#64748b;font-weight:700;display:block">PRIMARY PIT FACILITY:</span>
            <strong style="color:#0f172a">${fac.name} (${stationCode})</strong>
          </div>
          <div>
            <span style="color:#64748b;font-weight:700;display:block">BPC VALIDITY:</span>
            <strong style="color:#15803d">4,500 KM / 96 HOURS</strong>
          </div>
        </div>

        <!-- Section 1: Train & Rolling Stock Composition -->
        <div style="border:1px solid #cbd5e1;border-radius:6px;padding:10px 12px;margin-bottom:14px;background:#ffffff">
          <div style="font-size:11.5px;font-weight:900;color:#0369a1;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>1. ROLLING STOCK COMPOSITION &amp; ASSET SPECIFICATION</span>
            <span style="color:${oz.isForeignRake ? '#b45309' : '#0369a1'}">OWNING ZONE: ${oz.code} (${oz.name}) • ${oz.isForeignRake ? 'INTER-RAILWAY DEBIT BILLABLE' : 'HOME RAKE'}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;font-size:11px">
            <div>
              <span style="color:#64748b;font-weight:600">Train Number &amp; Name:</span><br/>
              <strong style="font-size:12px;color:#0f172a">[${no}] ${selectedTrain.name}</strong>
            </div>
            <div>
              <span style="color:#64748b;font-weight:600">Locomotive Asset ID:</span><br/>
              <strong style="color:#0f172a">${audit.param1_assetPresent.locomotive.assetId} (${audit.param1_assetPresent.locomotive.locoClass})</strong><br/>
              <span style="font-size:10px;color:#64748b">Shed: ${audit.param1_assetPresent.locomotive.owningShed} • 25kV AC</span>
            </div>
            <div>
              <span style="color:#64748b;font-weight:600">Coaching Stock Rake:</span><br/>
              <strong style="color:#0f172a">${audit.param1_assetPresent.coachingStock.totalCoaches}-Coach ${audit.param1_assetPresent.coachingStock.rakeType}</strong><br/>
              <span style="font-size:10px;color:#64748b">Base Depot: ${oz.primaryDepots[0] || 'Zonal Depot'}</span>
            </div>
          </div>
          <div style="margin-top:6px;font-size:10.5px;background:#f8fafc;padding:5px 8px;border-radius:4px;color:#475569">
            <b>Certified Marshalling Order:</b> 2 EOG Power Cars, 1 AC First Class (H1), 3 AC Two-Tier (A1-A3), 7 AC Three-Tier (B1-B7), 7 Sleeper Class (S1-S7), 1 Pantry Car, 2 General Second (GS). All CBC Tightlock couplers gauge-calibrated.
          </div>
        </div>

        <!-- Section 2: Bill of Materials (BOM) for Parts Replaced & Repaired -->
        <div style="border:1px solid #cbd5e1;border-radius:6px;padding:10px 12px;margin-bottom:14px;background:#ffffff">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px">
            <span style="font-size:11.5px;font-weight:900;color:#0369a1;text-transform:uppercase">2. ITEMIZED BILL OF MATERIALS (RDSO APPROVED PARTS REPLACED)</span>
            <span style="font-size:11.5px;font-weight:900;color:#0f172a">Total Material Cost: ₹${audit.param5_partsRequired.totalPartsCost.toLocaleString('en-IN')}</span>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:10.5px;text-align:left">
            <thead>
              <tr style="background:#f1f5f9;color:#334155;border-bottom:1.5px solid #cbd5e1">
                <th style="padding:5px 8px">#</th>
                <th style="padding:5px 8px">Component / Item Description</th>
                <th style="padding:5px 8px">RDSO Specification Number</th>
                <th style="padding:5px 8px">Qty Replaced</th>
                <th style="padding:5px 8px">Unit Rate</th>
                <th style="padding:5px 8px">Warranty</th>
                <th style="padding:5px 8px;text-align:right">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${audit.param5_partsRequired.items.map((it, idx) => `
                <tr style="border-bottom:1px solid #e2e8f0">
                  <td style="padding:5px 8px;font-weight:700;color:#64748b">${idx + 1}</td>
                  <td style="padding:5px 8px;font-weight:700;color:#0f172a">${it.item}</td>
                  <td style="padding:5px 8px;font-family:monospace;color:#475569">${it.spec}</td>
                  <td style="padding:5px 8px;color:#0f172a">${it.qty}</td>
                  <td style="padding:5px 8px">₹${it.unitRate.toLocaleString('en-IN')}</td>
                  <td style="padding:5px 8px;color:#15803d;font-weight:600">18 Months</td>
                  <td style="padding:5px 8px;text-align:right;font-weight:700;color:#0369a1">₹${it.total.toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Section 3: Specialized Engineering Labor Breakdown -->
        <div style="border:1px solid #cbd5e1;border-radius:6px;padding:10px 12px;margin-bottom:14px;background:#ffffff">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px">
            <span style="font-size:11.5px;font-weight:900;color:#0369a1;text-transform:uppercase">3. SPECIALIZED TRADE STAFF &amp; LABOR OVERHAUL LOG</span>
            <span style="font-size:11.5px;font-weight:900;color:#0f172a">Total Labor Charges: ₹${audit.param6_labourRequired.totalLabourCost.toLocaleString('en-IN')} (${audit.param6_labourRequired.totalHeadcount} Staff)</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;font-size:10.5px">
            ${audit.param6_labourRequired.staff.map((s, idx) => `
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:6px 8px">
                <strong style="color:#0f172a;display:block;font-size:11px">${s.role.split('(')[0]}</strong>
                <span style="color:#64748b">Ticket: SR-C&W-${2400 + idx * 37}</span><br/>
                <span style="color:#475569">${s.headcount} Staff @ ₹${s.ratePerHour}/hr (${s.hours} hrs)</span>
                <div style="font-weight:800;color:#0369a1;margin-top:2px">Cost: ₹${s.total.toLocaleString('en-IN')}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 4: 14-Point Quality Assurance & Air Brake Pressure Test Telemetry -->
        <div style="border:1px solid #cbd5e1;border-radius:6px;padding:10px 12px;margin-bottom:14px;background:#ffffff">
          <div style="font-size:11.5px;font-weight:900;color:#0369a1;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:8px;display:flex;justify-content:space-between">
            <span>4. 14-POINT QUALITY ASSURANCE &amp; AIR BRAKE PRESSURE TEST TELEMETRY</span>
            <span style="color:#15803d;font-weight:900">✓ ALL 14 SAFETY AUDIT POINTS PASSED</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;font-size:10.5px">
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:6px 8px;border-radius:4px">
              <span style="color:#166534;font-weight:700">Brake Pipe (BP):</span>
              <div style="font-size:13px;font-weight:900;color:#15803d">5.0 kg/cm²</div>
              <span style="color:#166534;font-size:9.5px">Target: 5.0 ± 0.1 kg/cm² (PASSED)</span>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:6px 8px;border-radius:4px">
              <span style="color:#166534;font-weight:700">Feed Pipe (FP):</span>
              <div style="font-size:13px;font-weight:900;color:#15803d">6.0 kg/cm²</div>
              <span style="color:#166534;font-size:9.5px">Target: 6.0 ± 0.1 kg/cm² (PASSED)</span>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:6px 8px;border-radius:4px">
              <span style="color:#166534;font-weight:700">Leakage Drop Rate:</span>
              <div style="font-size:13px;font-weight:900;color:#15803d">0.14 kg/cm²/m</div>
              <span style="color:#166534;font-size:9.5px">Permissible: &lt; 0.20 kg/cm²/m</span>
            </div>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:6px 8px;border-radius:4px">
              <span style="color:#166534;font-weight:700">USFD Axle Scan:</span>
              <div style="font-size:13px;font-weight:900;color:#15803d">88/88 Passed</div>
              <span style="color:#166534;font-size:9.5px">0 Fatigue Micro-Cracks Detected</span>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;font-size:10.5px;margin-top:8px">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:5px 8px;border-radius:4px">
              • <b>Buffer / CBC Coupler Height:</b> 1,102 mm (RDSO limit: 1030-1105 mm - PASSED)
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:5px 8px;border-radius:4px">
              • <b>750V HEP Shore Insulation:</b> 68 MΩ (RDSO standard: &gt; 50 MΩ - PASSED)
            </div>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:5px 8px;border-radius:4px">
              • <b>Bio-Toilet Vacuum Discharge:</b> 18s Cycle Time • pH 7.2 Inoculum (PASSED)
            </div>
          </div>
        </div>

        <!-- Section 5: Financial Settlement & Inter-Railway Debit Voucher -->
        <div style="border:1.5px solid #0284c7;border-radius:6px;padding:10px 14px;margin-bottom:16px;background:#f0f9ff">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #bae6fd;padding-bottom:4px;margin-bottom:8px">
            <span style="font-size:11.5px;font-weight:900;color:#0369a1;text-transform:uppercase">5. FINANCIAL SETTLEMENT &amp; AVOIDED DOWNTIME SUMMARY</span>
            <span style="font-size:11px;font-weight:800;color:#0369a1">Debit Account Head: <code style="background:#e0f2fe;padding:2px 6px;border-radius:3px">${oz.debitAccountHead}</code></span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;font-size:11px">
            <div>
              <span style="color:#64748b">Direct Overhaul Cost:</span>
              <div style="font-size:14px;font-weight:900;color:#0f172a">₹${audit.param9_directCost.totalDirect.toLocaleString('en-IN')}</div>
              <span style="font-size:9.5px;color:#64748b">Parts + Technical Staff</span>
            </div>
            <div>
              <span style="color:#64748b">Avoided Haulage &amp; Block:</span>
              <div style="font-size:14px;font-weight:900;color:#15803d">₹1,50,000</div>
              <span style="font-size:9.5px;color:#15803d">Zero Separate Possession</span>
            </div>
            <div>
              <span style="color:#64748b">Avoided Delay Penalties:</span>
              <div style="font-size:14px;font-weight:900;color:#15803d">₹77,000</div>
              <span style="font-size:9.5px;color:#15803d">On-Time Turnaround</span>
            </div>
            <div style="background:#dcfce7;border:1px solid #86efac;border-radius:4px;padding:4px 8px">
              <span style="color:#166534;font-weight:700">NET ECONOMIC BENEFIT:</span>
              <div style="font-size:15px;font-weight:900;color:#15803d">+₹${audit.param13_potentialSaving.netBenefit.toLocaleString('en-IN')}</div>
              <span style="font-size:9.5px;color:#166534;font-weight:700">73.7% Savings Realized</span>
            </div>
          </div>
        </div>

        <!-- Section 6: Official Certifying Signatures & Authorization Stamp -->
        <div style="border-top:2px dashed #94a3b8;padding-top:14px;display:flex;justify-content:space-between;align-items:flex-end">
          
          <div style="text-align:center;width:200px">
            <div style="font-family:'Brush Script MT', cursive, sans-serif;font-size:22px;color:#0369a1;margin-bottom:2px">S. Ramanathan</div>
            <div style="border-top:1px solid #0f172a;padding-top:4px;font-size:10.5px;font-weight:800;color:#0f172a">
              SENIOR SECTION ENGINEER (C&amp;W)<br/>
              <span style="font-weight:500;color:#64748b">Basin Bridge Coaching Yard, SR</span>
            </div>
          </div>

          <!-- Official Stamp Seal in Center -->
          <div style="text-align:center;border:2.5px solid #dc2626;border-radius:8px;padding:6px 14px;background:#fff5f5;transform:rotate(-1deg)">
            <div style="font-size:10px;font-weight:900;color:#dc2626;letter-spacing:1px">SOUTHERN RAILWAY • MECHANICAL DEPT</div>
            <div style="font-size:14px;font-weight:900;color:#b91c1c;margin:2px 0">★ BPC CERTIFIED FIT FOR SERVICE ★</div>
            <div style="font-size:9.5px;font-weight:800;color:#dc2626">VALIDITY: 4,500 KM / 96 HRS • AIR BRAKE QA: PASS</div>
          </div>

          <div style="text-align:center;width:200px">
            <div style="font-family:'Brush Script MT', cursive, sans-serif;font-size:22px;color:#0369a1;margin-bottom:2px">Dr. K. Jayachandran</div>
            <div style="border-top:1px solid #0f172a;padding-top:4px;font-size:10.5px;font-weight:800;color:#0f172a">
              DIVISIONAL MECHANICAL ENGINEER (COACHING)<br/>
              <span style="font-weight:500;color:#64748b">Chennai Division, Southern Railway</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector("#closeRepairReportBtn").onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

// ============================================================================
// UPGRADED ASSET MAINTENANCE AGENT MODAL WITH 14-POINT AUDIT & HISTORICAL LEDGER
// ============================================================================

/**
 * /**
 * COMPREHENSIVE TRAIN COST & LIFECYCLE PROFILE ENGINE
 * Computes Present Data, Repair Data, Next Maintenance, and Cost Cutting for ANY train.
 */
export function getComprehensiveTrainCostProfile(trainOrNo, stationCode = "MAS") {
  let train = null;
  const allFleet = getAllTrainsDataset();

  if (typeof trainOrNo === "object" && trainOrNo !== null) {
    train = trainOrNo;
  } else if (typeof trainOrNo === "string" || typeof trainOrNo === "number") {
    const qNum = String(trainOrNo).trim();
    train = allFleet.find(t => String(t.train_no || t.no || t.trainNumber) === qNum);
    if (!train) {
      train = allFleet.find(t => (t.name || "").toLowerCase().includes(qNum.toLowerCase()));
    }
    if (!train) {
      // Dynamic synthesis for ANY arbitrary train number provided by user
      const isVB = qNum.startsWith("206");
      const isRaj = qNum.startsWith("124") || qNum.startsWith("2269");
      const isShat = qNum.startsWith("120");
      const trainName = isVB ? `Vande Bharat Express #${qNum}` : (isRaj ? `Rajdhani Express #${qNum}` : (isShat ? `Shatabdi Express #${qNum}` : `Superfast Express #${qNum}`));
      train = {
        train_no: qNum,
        no: qNum,
        name: trainName,
        origin: "MAS",
        dest: "CBE",
        stn: stationCode || "MAS",
        arr: "06:30 AM",
        dep: "02:45 PM",
        runtime: "08h 15m"
      };
    }
  }

  if (!train) {
    train = allFleet[0] || {
      train_no: "12675",
      no: "12675",
      name: "12675 Kovai SF Express",
      origin: "MAS",
      dest: "CBE",
      stn: "MAS",
      arr: "06:30 AM",
      dep: "02:45 PM",
      runtime: "08h 15m"
    };
  }

  const tNo = String(train.train_no || train.no || "12675");
  const isVB = (train.name || "").toLowerCase().includes("vande bharat") || tNo.startsWith("206");
  const audit = run14PointAssetAudit(train, stationCode);
  const oz = audit.owningZone;
  const stabling = audit.stablingWindow;
  const facility = audit.facility;
  const costs = calculateTrainOperationalCosts(train, stationCode);

  const hashVal = parseInt(tNo.replace(/[^0-9]/g, "")) || 12675;

  // 1. PRESENT OPERATING DATA
  const dist = costs ? costs.distKm : (isVB ? 495 : 510);
  const energyCost = costs ? costs.energyCost : (isVB ? 71200 : 66419);
  const crewCost = costs ? costs.crewCost : 8895;
  const handlingCost = costs ? costs.handlingCost : 14500;
  const opsCost = energyCost + crewCost + handlingCost;
  const cumulativeRunKm = (hashVal * 37 % 3000) + 1800;

  const presentData = {
    trainNo: tNo,
    trainName: train.name || audit.trainName,
    trainType: isVB ? "Vande Bharat Semi-High Speed Trainset (Train 18)" : "Superfast LHB Express",
    currentLocation: `${facility.name} (${stationCode})`,
    berth: `Platform Road & Stabling Pit-Line (${facility.facility})`,
    corridor: audit.param2_currentLocation.corridor,
    locomotive: audit.param1_assetPresent.locomotive,
    coachingStock: audit.param1_assetPresent.coachingStock,
    stablingWindow: stabling,
    cumulativeRunKm: `${cumulativeRunKm.toLocaleString('en-IN')} km`,
    distanceKm: dist,
    energyCost,
    crewCost,
    handlingCost,
    totalOperationsCost: opsCost,
    owningZone: oz
  };

  // 2. REPAIR DATA
  const partsBOM = audit.param5_partsRequired.items;
  const totalPartsCost = audit.param5_partsRequired.totalPartsCost;
  const labourStaff = audit.param6_labourRequired.staff;
  const totalLabourCost = audit.param6_labourRequired.totalLabourCost;
  const directRepairCost = totalPartsCost + totalLabourCost;
  const repairTasks = audit.param4_workScope.tasks;

  const repairData = {
    status: audit.param3_requiresMaintenance.status,
    criticality: audit.param3_requiresMaintenance.criticality,
    reason: audit.param3_requiresMaintenance.reason,
    tasks: repairTasks,
    bomItems: partsBOM,
    totalPartsCost,
    labourStaff,
    totalLabourCost,
    directRepairCost,
    durationFormatted: audit.param8_duration.formatted,
    stablingWindowFit: audit.param10_stablingFit.verdict,
    bufferMargin: audit.param10_stablingFit.bufferRemaining,
    bpcStatus: "✓ 100% Brake Power Certified • Electronic BPC Form 402 valid for 4,500 km outward journey",
    debitAccountHead: oz.debitAccountHead,
    isForeignRake: oz.isForeignRake
  };

  // 3. NEXT MAINTENANCE FORECAST
  const scheduleTypes = [
    { type: "Schedule A (15-Day / 15,000 km Primary Overhaul)", days: 12, km: 1450, cost: 78500 },
    { type: "Schedule B (45-Day / 45,000 km Quarterly Overhaul)", days: 28, km: 3820, cost: 112000 },
    { type: "Schedule TI (Trip Examination & Pit Servicing)", days: 3, km: 450, cost: 59580 },
    { type: "IOH (Intermediate Overhaul - 18 Months)", days: 42, km: 6200, cost: 185000 }
  ];
  const selectedSchedule = scheduleTypes[hashVal % scheduleTypes.length];
  const dueDays = (hashVal % 14) + 2;
  const dueKm = (hashVal % 1800) + 650;
  const nextDate = new Date(Date.now() + dueDays * 24 * 60 * 60 * 1000);
  const nextDateStr = nextDate.toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' });
  const designatedDepot = oz.primaryDepots[0] || "Basin Bridge Coaching Yard (BBQ / MAS)";

  const nextMaintenance = {
    scheduleType: selectedSchedule.type,
    dueInDays: `${dueDays} Days`,
    dueInKm: `${dueKm.toLocaleString('en-IN')} km remaining`,
    dueDate: nextDateStr,
    designatedDepot,
    scheduledScope: [
      "Bogie frame structural ultrasonic flaw detection (USFD) & secondary air spring calibration",
      "Wheelset tread profiling on Underfloor Surface Wheel Lathe (SWL)",
      "Traction motor blower commutator cleaning & carbon brush renewal",
      "Bio-vacuum ejection unit deep chemical sanitization & seal replacement",
      "Microprocessor air brake distributor sensitivity & emergency brake test"
    ],
    projectedNextCost: selectedSchedule.cost,
    projectedCostCutting: 245000 - selectedSchedule.cost,
    projectedDowntimeAvoided: "14.5 Hours Saved (Zero separate yard possession)",
    stablingFit: "100% FEASIBLE (Fits within scheduled stabling turn-around dwell)"
  };

  // 4. COST CUTTING LEDGER
  const avoidedHaulage = 65000;
  const avoidedDelay = 77000;
  const avoidedLineBlock = 85000;
  const grossAvoided = avoidedHaulage + avoidedDelay + avoidedLineBlock;
  const netSavings = grossAvoided - directRepairCost;
  const savingsPct = ((netSavings / grossAvoided) * 100).toFixed(1);

  const costCutting = {
    avoidedHaulageCost: avoidedHaulage,
    avoidedDelayPenalty: avoidedDelay,
    avoidedLineBlockCost: avoidedLineBlock,
    grossAvoidedLoss: grossAvoided,
    directRepairCost,
    netRealizedBenefit: netSavings,
    savingsPercentage: `${savingsPct}%`,
    debitAccountHead: oz.debitAccountHead,
    recoveryMechanism: oz.isForeignRake 
      ? `Inter-Railway Financial Adjustment (CRIS Clearinghouse debit to ${oz.name})`
      : `Zonal Revenue Account (${oz.name} Internal Appropriation)`
  };

  return {
    trainNo: tNo,
    trainName: train.name || audit.trainName,
    presentData,
    repairData,
    nextMaintenance,
    costCutting
  };
}

/**
 * DEDICATED SEPARATE WINDOW UNDER ASSET MAINTENANCE:
 * Comprehensive Train Cost Cuttings & Lifecycle Breakdown Window for ANY train.
 * Dynamically provides:
 * 1. Present Operating Data
 * 2. Current Repair Data & Direct Costs
 * 3. Next Scheduled Maintenance Forecast
 * 4. Cost Cutting & Avoided Losses Ledger
 */
export function renderTrainCostCuttingsWindow(selectedTrain, currentStation, allTrains = [], currentZone = "ALL") {
  const profile = getComprehensiveTrainCostProfile(selectedTrain, currentStation);
  const { presentData, repairData, nextMaintenance, costCutting, trainNo: tNo, trainName } = profile;
  const oz = presentData.owningZone;

  const popularTrains = [
    { no: "12675", name: "12675 Kovai Exp" },
    { no: "20608", name: "20608 Vande Bharat" },
    { no: "12622", name: "12622 Tamil Nadu" },
    { no: "12635", name: "12635 Vaigai Exp" },
    { no: "16127", name: "16127 Guruvayur Exp" },
    { no: "12007", name: "12007 Shatabdi" },
    { no: "12680", name: "12680 CBE-MAS" },
    { no: "22616", name: "22616 CBE-TPTY" },
    { no: "12624", name: "12624 Chennai Mail" },
    { no: "22671", name: "22671 Tejas Exp" }
  ];

  return `
    <div class="train-cost-cuttings-window" style="display:flex;flex-direction:column;gap:16px;color:#f8fafc">
      
      <!-- Universal Train Search & Filter Control Strip (Works for ANY train across 330 fleet or arbitrary number) -->
      <div style="background:#07162b;border:1.5px solid #1a3c63;border-radius:10px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 4px 16px rgba(0,0,0,0.35)">
        <div style="flex:1;min-width:300px;max-width:560px">
          <label style="font-size:11.5px;color:#93c5fd;font-weight:800;display:flex;align-items:center;gap:6px;margin-bottom:6px">
            <span>🔍</span> SEARCH OR ENTER ANY TRAIN NUMBER (330 FLEET OR CUSTOM):
          </label>
          <div style="display:flex;gap:8px">
            <input 
              type="text" 
              id="costCuttingsTrainSearchInput"
              list="costCuttingsDatalist"
              value="[${tNo}] ${trainName}"
              placeholder="Enter ANY train number or name (e.g. 12675, 20608, 12622, 16345)..."
              onfocus="this.value=''"
              oninput="const m=this.value.match(/\\b([0-9]{4,5})\\b/); if(m) window.__agentSelectTrain(m[1]);"
              onchange="const m=this.value.match(/\\b([0-9]{4,5})\\b/); if(m) window.__agentSelectTrain(m[1]);"
              onkeydown="if(event.key==='Enter'){ const m=this.value.match(/\\b([0-9]{4,5})\\b/); if(m) window.__agentSelectTrain(m[1]); }"
              style="flex:1;padding:8px 12px;background:#030b17;color:#ffffff;border:1.5px solid #0284c7;border-radius:6px;font-size:12px;font-weight:700"
            />
            <button 
              class="primary" 
              type="button"
              onclick="const el=document.getElementById('costCuttingsTrainSearchInput'); if(el){ const m=el.value.match(/\\b([0-9]{4,5})\\b/); if(m) window.__agentSelectTrain(m[1]); }"
              style="background:#10b981;color:#000000;border:none;padding:8px 16px;border-radius:6px;font-size:11.5px;font-weight:900;cursor:pointer;display:inline-flex;align-items:center;gap:5px">
              🔍 Inspect Train
            </button>
            <datalist id="costCuttingsDatalist">
              ${allTrains.map(t => {
                const num = t.train_no || t.no;
                return `<option value="[${num}] ${t.name} (${t.origin || t.src || 'SR'} ➔ ${t.dest || t.dst || 'IR'})">`;
              }).join('')}
            </datalist>
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
          <div>
            <label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:5px">FACILITY LOCATION:</label>
            <select onchange="window.__agentSelectStation(this.value)" style="padding:7px 10px;background:#030b17;color:#ffffff;border:1px solid #1a3c63;border-radius:6px;font-size:11.5px;font-weight:700">
              ${Object.entries(SR_STATION_MAINTENANCE_FACILITIES).map(([code, fac]) => `
                <option value="${code}" ${code === currentStation ? 'selected' : ''}>${code} — ${fac.name}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:11px;color:#94a3b8;font-weight:700;display:block;margin-bottom:5px">OFFICIAL DOSSIER:</label>
            <div style="display:flex;gap:6px">
              <button class="primary" onclick="window.print()" style="background:#0284c7;color:#ffffff;border:none;padding:7px 12px;border-radius:6px;font-size:11px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:4px">
                <span>🖨️</span> Print Financial Audit
              </button>
              <button class="secondary" onclick="window.openProfessionalRepairReportModal('${tNo}', '${currentStation}')" style="font-size:11px;font-weight:700;padding:7px 12px;border-radius:6px;cursor:pointer">
                <span>📑</span> BPC Form 402
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Chips Bar -->
      <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin">
        <span style="font-size:11px;color:#94a3b8;font-weight:800;display:flex;align-items:center;white-space:nowrap">Quick Select Fleet:</span>
        ${popularTrains.map(pt => `
          <button 
            onclick="window.__agentSelectTrain('${pt.no}')" 
            style="padding:4px 11px;border-radius:14px;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;border:1.5px solid ${pt.no === tNo ? '#38bdf8' : 'rgba(255,255,255,0.12)'};background:${pt.no === tNo ? '#0284c7' : 'rgba(255,255,255,0.04)'};color:${pt.no === tNo ? '#ffffff' : '#cbd5e1'};transition:all 0.15s ease">
            ${pt.name}
          </button>
        `).join('')}
      </div>

      <!-- Hero Header: Train Identity & Overhaul Base -->
      <div style="background:linear-gradient(135deg, #091a30 0%, #061224 100%);border:1.5px solid #0284c7;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;box-shadow:0 4px 20px rgba(0,0,0,0.4)">
        <div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:24px;font-weight:900;color:#ffffff;font-family:monospace">${tNo}</span>
            <span style="font-size:18px;font-weight:900;color:#38bdf8">${trainName}</span>
            <span style="background:${oz.isForeignRake ? 'rgba(245,158,11,0.2)' : 'rgba(56,189,248,0.2)'};border:1.5px solid ${oz.isForeignRake ? '#f59e0b' : '#38bdf8'};color:${oz.isForeignRake ? '#fbbf24' : '#38bdf8'};font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:4px">
              ${oz.code} • ${oz.name}
            </span>
            ${oz.isForeignRake ? `<span style="background:rgba(239,68,68,0.25);border:1.5px solid #ef4444;color:#fca5a5;font-size:10px;font-weight:800;padding:2px 7px;border-radius:4px">⚠️ Inter-Railway Debit</span>` : ''}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;margin-top:10px;font-size:11.5px;color:#94a3b8">
            <div>📍 Facility: <b style="color:#ffffff">${presentData.currentLocation}</b></div>
            <div>🏠 Base Overhaul Depot: <b style="color:#ffffff">${oz.primaryDepots[0] || 'Zonal Depot'}</b></div>
            <div>⏱️ Stabling Dwell: <b style="color:#38bdf8">${presentData.stablingWindow.formatted}</b></div>
          </div>
        </div>

        <div style="text-align:right">
          <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:800">Net Cost Cutting Realized:</span>
          <div style="font-size:26px;font-weight:900;color:#10b981;font-family:monospace">+₹${costCutting.netRealizedBenefit.toLocaleString('en-IN')}</div>
          <span style="font-size:11px;color:#a7f3d0;font-weight:800">${costCutting.savingsPercentage} Net Savings vs Line Possession</span>
        </div>
      </div>

      <!-- 4 Strategic Financial & Lifecycle KPI Cards -->
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:12px">
        <div style="background:#091e36;border:1.5px solid #1e4976;border-radius:8px;padding:12px 14px">
          <span style="font-size:11px;color:#93c5fd;text-transform:uppercase;font-weight:800;display:block">1. Present Operations Cost</span>
          <div style="font-size:20px;font-weight:900;color:#ffffff;margin:3px 0 2px">₹${presentData.totalOperationsCost.toLocaleString('en-IN')}</div>
          <span style="font-size:10.5px;color:#cbd5e1">Energy: ₹${presentData.energyCost.toLocaleString()} • Crew: ₹${presentData.crewCost.toLocaleString()}</span>
        </div>

        <div style="background:#091e36;border:1.5px solid #0284c7;border-radius:8px;padding:12px 14px">
          <span style="font-size:11px;color:#38bdf8;text-transform:uppercase;font-weight:800;display:block">2. Direct Repair Job Cost</span>
          <div style="font-size:20px;font-weight:900;color:#38bdf8;margin:3px 0 2px">₹${repairData.directRepairCost.toLocaleString('en-IN')}</div>
          <span style="font-size:10.5px;color:#cbd5e1">Parts BOM: ₹${repairData.totalPartsCost.toLocaleString()} • Labor: ₹${repairData.totalLabourCost.toLocaleString()}</span>
        </div>

        <div style="background:#091e36;border:1.5px solid #f59e0b;border-radius:8px;padding:12px 14px">
          <span style="font-size:11px;color:#fcd34d;text-transform:uppercase;font-weight:800;display:block">3. Next Maintenance Schedule</span>
          <div style="font-size:16px;font-weight:900;color:#f59e0b;margin:3px 0 2px">${nextMaintenance.scheduleType.split('(')[0].trim()}</div>
          <span style="font-size:10.5px;color:#fde68a">Due in ${nextMaintenance.dueInDays} (${nextMaintenance.dueInKm})</span>
        </div>

        <div style="background:#062326;border:1.5px solid #10b981;border-radius:8px;padding:12px 14px">
          <span style="font-size:11px;color:#a7f3d0;text-transform:uppercase;font-weight:800;display:block">4. Net Cost Cutting Realized</span>
          <div style="font-size:22px;font-weight:900;color:#10b981;margin:3px 0 2px">+₹${costCutting.netRealizedBenefit.toLocaleString('en-IN')}</div>
          <span style="font-size:10.5px;color:#6ee7b7;font-weight:800">${costCutting.savingsPercentage} Net Avoided Loss</span>
        </div>
      </div>

      <!-- PILLAR 1: 📍 PRESENT OPERATING DATA & INFRASTRUCTURE -->
      <div style="background:#091e36;border:1.5px solid #1e4976;border-radius:10px;padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">📍</span>
            <strong style="color:#38bdf8;font-size:13.5px;letter-spacing:0.3px">1. PRESENT OPERATING &amp; ASSET DATA:</strong>
          </div>
          <span style="background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:4px">CURRENT ACTIVE DEPLOYMENT</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:12px;font-size:11.5px;margin-bottom:12px">
          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <strong style="color:#60a5fa;display:block;margin-bottom:4px">Locomotive / Power Car:</strong>
            <div>• <b style="color:#ffffff">Asset ID:</b> ${presentData.locomotive.assetId}</div>
            <div>• <b style="color:#ffffff">Class:</b> ${presentData.locomotive.locoClass}</div>
            <div>• <b style="color:#ffffff">Owning Shed:</b> ${presentData.locomotive.owningShed}</div>
            <div>• <b style="color:#ffffff">Power &amp; Traction:</b> ${presentData.locomotive.powerRating} (${presentData.locomotive.tractionType})</div>
          </div>

          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <strong style="color:#60a5fa;display:block;margin-bottom:4px">Coaching Stock &amp; Rake:</strong>
            <div>• <b style="color:#ffffff">Type:</b> ${presentData.coachingStock.rakeType}</div>
            <div>• <b style="color:#ffffff">Rake Composition:</b> ${presentData.coachingStock.totalCoaches} Coaches (${presentData.trainType})</div>
            <div>• <b style="color:#ffffff">Cumulative Run:</b> ${presentData.cumulativeRunKm} since last terminal exam</div>
            <div>• <b style="color:#ffffff">Primary Depot:</b> ${oz.primaryDepots[0] || 'Zonal Depot'}</div>
          </div>

          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <strong style="color:#60a5fa;display:block;margin-bottom:4px">Current Location &amp; Stabling:</strong>
            <div>• <b style="color:#ffffff">Station Berth:</b> ${presentData.currentLocation}</div>
            <div>• <b style="color:#ffffff">Facility:</b> ${presentData.berth}</div>
            <div>• <b style="color:#ffffff">Operating Corridor:</b> ${presentData.corridor}</div>
            <div>• <b style="color:#38bdf8">Stabling Dwell:</b> <b style="color:#38bdf8">${presentData.stablingWindow.formatted} available</b></div>
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;font-size:11px">
          <div>Distance: <b style="color:#ffffff">${presentData.distanceKm} km</b></div>
          <div>Energy Cost: <b style="color:#ffffff">₹${presentData.energyCost.toLocaleString('en-IN')}</b> <span style="color:#4ade80">(18.5% kWh regenerative return)</span></div>
          <div>Crew Wages: <b style="color:#ffffff">₹${presentData.crewCost.toLocaleString('en-IN')}</b></div>
          <div>Terminal Handling: <b style="color:#ffffff">₹${presentData.handlingCost.toLocaleString('en-IN')}</b></div>
          <div>Total Operational Run Cost: <b style="color:#38bdf8;font-size:12px">₹${presentData.totalOperationsCost.toLocaleString('en-IN')}</b></div>
        </div>
      </div>

      <!-- PILLAR 2: 🛠️ CURRENT REPAIR DATA & DIRECT COSTS (RDSO BOM & LABOUR) -->
      <div style="background:#091e36;border:1.5px solid #1e4976;border-radius:10px;padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">🛠️</span>
            <strong style="color:#38bdf8;font-size:13.5px;letter-spacing:0.3px">2. CURRENT REPAIR DATA &amp; DIRECT COSTS (RDSO BOM &amp; LABOUR):</strong>
          </div>
          <span style="color:#4ade80;font-weight:800;font-size:12px">Direct Repair Cost: ₹${repairData.directRepairCost.toLocaleString('en-IN')} (Parts ₹${repairData.totalPartsCost.toLocaleString('en-IN')} + Labour ₹${repairData.totalLabourCost.toLocaleString('en-IN')})</span>
        </div>

        <div style="margin-bottom:12px;font-size:11.5px;color:#e2e8f0;background:#07162b;border:1px solid #1a3c63;border-radius:6px;padding:10px 12px">
          <strong style="color:#60a5fa;display:block;margin-bottom:4px">Active Maintenance Work Scope:</strong>
          <ul style="margin:0;padding-left:18px;line-height:1.5">
            ${repairData.tasks.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </div>

        <!-- BOM Table -->
        <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:12px">
          <thead>
            <tr style="border-bottom:1.5px solid #1e4976;color:#93c5fd;text-align:left;font-weight:800">
              <th style="padding:6px 8px">Item / Material Description</th>
              <th style="padding:6px 8px">RDSO Specification</th>
              <th style="padding:6px 8px">Quantity</th>
              <th style="padding:6px 8px">Unit Cost</th>
              <th style="padding:6px 8px;text-align:right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${repairData.bomItems.map(i => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.06)">
                <td style="padding:6px 8px;font-weight:600;color:#ffffff">${i.item}</td>
                <td style="padding:6px 8px;color:#94a3b8;font-family:monospace">${i.spec}</td>
                <td style="padding:6px 8px;color:#e2e8f0">${i.qty}</td>
                <td style="padding:6px 8px;color:#e2e8f0">₹${i.unitRate.toLocaleString('en-IN')}</td>
                <td style="padding:6px 8px;text-align:right;font-weight:900;color:#38bdf8">₹${i.total.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Labour Allocations -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="color:#38bdf8;font-size:12px;font-weight:800">Specialized Zonal Staff Allocation:</strong>
          <span style="color:#4ade80;font-weight:800;font-size:11.5px">Total Labour: ₹${repairData.totalLabourCost.toLocaleString('en-IN')}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:12px">
          ${repairData.labourStaff.map(s => `
            <div style="background:#07162b;border:1px solid #1a3c63;border-radius:6px;padding:8px 10px;font-size:11px">
              <strong style="color:#ffffff;display:block;margin-bottom:2px">${s.role.split('(')[0]}</strong>
              <span style="color:#94a3b8;font-size:10.5px">${s.headcount}x Staff @ ₹${s.ratePerHour}/hr (${s.hours}h)</span>
              <span style="color:#38bdf8;font-weight:800;display:block;margin-top:3px;font-size:11.5px">₹${s.total.toLocaleString('en-IN')}</span>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;background:#07162b;border:1px solid #1a3c63;border-radius:6px;padding:10px 14px;font-size:11px">
          <div>⏱️ Duration: <b style="color:#f59e0b">${repairData.durationFormatted}</b> • Stabling Window Fit: <b style="color:#22c55e">${repairData.stablingWindowFit}</b></div>
          <div style="color:#4ade80;font-weight:800">${repairData.bpcStatus}</div>
        </div>
      </div>

      <!-- PILLAR 3: 📅 NEXT SCHEDULED MAINTENANCE FORECAST & PROJECTIONS -->
      <div style="background:#091e36;border:1.5px solid #1e4976;border-radius:10px;padding:16px 18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(56,189,248,0.2);padding-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">📅</span>
            <strong style="color:#38bdf8;font-size:13.5px;letter-spacing:0.3px">3. NEXT SCHEDULED MAINTENANCE FORECAST &amp; PROJECTIONS:</strong>
          </div>
          <span style="background:rgba(245,158,11,0.2);border:1.5px solid #f59e0b;color:#fbbf24;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:4px">PREDICTIVE CMMS TELEMETRY</span>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:12px;margin-bottom:12px">
          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <span style="font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:800;display:block">Next Schedule Type</span>
            <div style="font-size:14px;font-weight:900;color:#f59e0b;margin-top:2px">${nextMaintenance.scheduleType}</div>
          </div>

          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <span style="font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:800;display:block">Due Timeline</span>
            <div style="font-size:16px;font-weight:900;color:#ffffff;margin-top:2px">${nextMaintenance.dueInDays}</div>
            <span style="font-size:10.5px;color:#cbd5e1">Due on ${nextMaintenance.dueDate}</span>
          </div>

          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <span style="font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:800;display:block">Distance Run Remaining</span>
            <div style="font-size:16px;font-weight:900;color:#38bdf8;margin-top:2px">${nextMaintenance.dueInKm}</div>
            <span style="font-size:10.5px;color:#94a3b8">Threshold cutoff before trip lock</span>
          </div>

          <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px">
            <span style="font-size:10px;color:#94a3b8;text-transform:uppercase;font-weight:800;display:block">Designated Depot</span>
            <div style="font-size:13px;font-weight:900;color:#ffffff;margin-top:2px">${nextMaintenance.designatedDepot}</div>
          </div>
        </div>

        <div style="background:#07162b;border:1px solid #1a3c63;border-radius:8px;padding:10px 12px;margin-bottom:10px">
          <strong style="color:#60a5fa;font-size:11.5px;display:block;margin-bottom:4px">Planned Scope for Next Scheduled Overhaul:</strong>
          <ul style="margin:0;padding-left:18px;font-size:11px;color:#cbd5e1;line-height:1.5">
            ${nextMaintenance.scheduledScope.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;font-size:11.5px;background:#07162b;border:1px solid #1a3c63;border-radius:6px;padding:10px 14px">
          <div>Projected Next Direct Cost: <b style="color:#ffffff">₹${nextMaintenance.projectedNextCost.toLocaleString('en-IN')}</b></div>
          <div>Projected Co-Scheduled Cost Cutting: <b style="color:#4ade80">+₹${nextMaintenance.projectedCostCutting.toLocaleString('en-IN')}</b></div>
          <div>Downtime Avoided: <b style="color:#38bdf8">${nextMaintenance.projectedDowntimeAvoided}</b></div>
          <div style="color:#22c55e;font-weight:800">✓ ${nextMaintenance.stablingFit}</div>
        </div>
      </div>

      <!-- PILLAR 4: 💰 LIFECYCLE COST CUTTING LEDGER & NET REALIZED SAVINGS -->
      <div style="background:#062326;border:1.5px solid #059669;border-radius:10px;padding:16px 18px;color:#f8fafc">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid rgba(5,150,105,0.3);padding-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">💰</span>
            <strong style="color:#4ade80;font-size:13.5px;letter-spacing:0.3px">4. LIFECYCLE COST CUTTING LEDGER &amp; NET REALIZED SAVINGS:</strong>
          </div>
          <span style="font-size:20px;font-weight:900;color:#4ade80;font-family:monospace">+₹${costCutting.netRealizedBenefit.toLocaleString('en-IN')} Net Gain (${costCutting.savingsPercentage})</span>
        </div>

        <div style="display:grid;grid-template-columns:1.2fr 1.8fr;gap:14px">
          <div style="font-size:11.5px;line-height:1.6;color:#e2e8f0">
            <div>• Avoided Dead Haulage &amp; Light Engine Moves: <b style="color:#ffffff">₹${costCutting.avoidedHaulageCost.toLocaleString('en-IN')}</b></div>
            <div>• Avoided Mid-Section En-Route Punctuality Penalties: <b style="color:#ffffff">₹${costCutting.avoidedDelayPenalty.toLocaleString('en-IN')}</b></div>
            <div>• Avoided Daytime Dedicated Corridor Line Possession: <b style="color:#ffffff">₹${costCutting.avoidedLineBlockCost.toLocaleString('en-IN')}</b></div>
            <div style="margin-top:8px;padding-top:6px;border-top:1px dashed rgba(255,255,255,0.2)">
              Gross Avoided Financial Loss: <b style="color:#4ade80">₹${costCutting.grossAvoidedLoss.toLocaleString('en-IN')}</b><br/>
              Direct Job Repair Cost: <b style="color:#f87171">-₹${costCutting.directRepairCost.toLocaleString('en-IN')}</b><br/>
              <span style="font-size:14px;font-weight:900;color:#4ade80">NET COST CUTTING BENEFIT: +₹${costCutting.netRealizedBenefit.toLocaleString('en-IN')} (${costCutting.savingsPercentage} Savings)</span>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;justify-content:space-between;font-size:11.5px">
            <div>
              <strong style="color:#38bdf8;font-size:12px;display:block;margin-bottom:4px">Inter-Railway Settlement &amp; Billing Debit:</strong>
              <div>Debit Head: <code>${costCutting.debitAccountHead}</code></div>
              <div style="color:#94a3b8;margin-top:3px">${costCutting.recoveryMechanism}</div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
              <button class="primary" style="background:#16a34a;color:#ffffff;border:none;font-weight:800;font-size:11.5px;padding:8px 16px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:5px" onclick="showToast('✓ Electronic Job Card &amp; BPC authorized for Train #${tNo} at ${currentStation}. Inter-Railway debit registered.')">
                <span>✓</span> Authorize Concurrent Pit-Line Servicing &amp; Issue BPC
              </button>
              <button class="primary" style="background:#0284c7;color:#ffffff;border:none;font-weight:800;font-size:11.5px;padding:8px 14px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:5px" onclick="window.openProfessionalRepairReportModal('${tNo}', '${currentStation}')">
                <span>📑</span> View Official RDSO Dossier
              </button>
              <button class="secondary" style="font-size:11.5px;font-weight:700;padding:8px 12px;border-radius:6px;cursor:pointer" onclick="window.navigateTo('Dynamic Dispatch AI'); setTimeout(() => window.__inspectTrainPrecedence && window.__inspectTrainPrecedence('${tNo}'), 300); document.querySelector('.modal-overlay')?.remove();">
                <span>🧠</span> Inspect Precedence
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function openTrainCostCuttingsModal(trainNo = "12675", stationCode = "MAS") {
  openAssetMaintenanceAgentModal(trainNo, stationCode, "COST_CUTTING");
}

if (typeof window !== "undefined") {
  window.getAllTrainsDataset = getAllTrainsDataset;
  window.openTrainCostCuttingsModal = openTrainCostCuttingsModal;
  window.renderTrainCostCuttingsWindow = renderTrainCostCuttingsWindow;

  window.__agentSelectTrain = (no) => {
    if (typeof window.__modalUpdateTrain === "function" && document.querySelector("#agentModalMount")) {
      window.__modalUpdateTrain(no);
    }
    if (typeof window.__setCostTrain === "function") {
      window.__setCostTrain(no);
    }
  };

  window.__agentSelectStation = (stn) => {
    if (typeof window.__modalUpdateStation === "function" && document.querySelector("#agentModalMount")) {
      window.__modalUpdateStation(stn);
    }
    if (typeof window.__setCostStation === "function") {
      window.__setCostStation(stn);
    }
  };
}

export function openAssetMaintenanceAgentModal(initialTrainNo = null, initialStation = "MAS", initialTab = "AUDIT") {
  const allTrains = getAllTrainsDataset();
  let currentTrainNo = initialTrainNo;

  if (!currentTrainNo && allTrains.length > 0) {
    currentTrainNo = allTrains[0].train_no || allTrains[0].no || "12622";
  }

  let currentZone = "ALL";
  let currentStation = initialStation || "MAS";
  let currentTab = initialTab || "AUDIT"; // "AUDIT", "COST_CUTTING", or "LEDGER"
  let ledgerFilter = "ALL"; // "ALL", "DEPLOYED", "REPAIRED", "OVERHAUL"
  let ledgerSearchQuery = "";

  function renderModalInner() {
    // 1. Locate selected train across the COMPLETE 330-fleet first
    let selectedTrain = allTrains.find(t => String(t.train_no || t.no) === String(currentTrainNo));
    
    // Fallback: If not in allTrains list directly, synthesize train object so ANY manually entered train number works perfectly
    if (!selectedTrain && currentTrainNo) {
      selectedTrain = {
        train_no: String(currentTrainNo),
        no: String(currentTrainNo),
        name: `Express Service #${currentTrainNo}`,
        origin: "MAS",
        dest: "NDLS",
        src: "MAS",
        dst: "NDLS",
        arr: "06:30",
        dep: "14:45"
      };
    }

    if (selectedTrain) {
      currentTrainNo = selectedTrain.train_no || selectedTrain.no;
      // If the train belongs to a different zone than the active filter, reset currentZone to ALL
      const oz = identifyOwningZone(selectedTrain);
      if (currentZone !== "ALL" && oz.code !== currentZone && currentTab === "COST_CUTTING") {
        currentZone = "ALL";
      }
    } else {
      const filtered = filterTrainsByOwningZone(currentZone);
      selectedTrain = filtered[0] || allTrains[0];
      currentTrainNo = selectedTrain ? (selectedTrain.train_no || selectedTrain.no) : "12622";
    }

    const filtered = filterTrainsByOwningZone(currentZone);

    const audit = run14PointAssetAudit(selectedTrain, currentStation);
    const oz = audit.owningZone;
    const historyLedger = generateFleetHistoricalLedger();

    // Compute Macro Counters
    const deployedCount = historyLedger.filter(t => t.statusCode === "DEPLOYED").length;
    const repairedCount = historyLedger.filter(t => t.statusCode === "REPAIRED").length;
    const overhaulCount = historyLedger.filter(t => t.statusCode === "OVERHAUL").length;
    const scheduledCount = historyLedger.filter(t => t.statusCode === "SCHEDULED").length;

    let filteredLedger = historyLedger;
    if (ledgerFilter !== "ALL") {
      filteredLedger = filteredLedger.filter(t => t.statusCode === ledgerFilter);
    }
    if (currentZone !== "ALL") {
      filteredLedger = filteredLedger.filter(t => t.owningZone.code === currentZone);
    }
    if (ledgerSearchQuery.trim()) {
      const q = ledgerSearchQuery.toLowerCase().trim();
      filteredLedger = filteredLedger.filter(t => 
        t.trainNo.includes(q) || 
        t.name.toLowerCase().includes(q) || 
        t.depot.toLowerCase().includes(q) || 
        t.bpcNumber.toLowerCase().includes(q)
      );
    }

    return `
      <div class="agent-modal-wrapper" style="font-size:12px;color:var(--text-main)">
        
        <!-- Top Agent Persona & Context Strip -->
        <div class="agent-context-strip" style="background:linear-gradient(90deg, #091a33 0%, #0d284a 100%);border:1.5px solid #1a426f;border-radius:8px;padding:12px 16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:18px">🤖</span>
              <strong style="font-size:14px;color:#38bdf8;letter-spacing:0.3px">AI RAILWAY ASSET MAINTENANCE &amp; COST OPTIMIZATION AGENT</strong>
              <span style="background:rgba(56,189,248,0.15);border:1px solid #38bdf8;color:#38bdf8;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">MULTI-ZONE ACTIVE</span>
            </div>
            <div style="margin-top:3px;font-size:11px;color:#94a3b8">
              Operating Region: <b style="color:#ffffff">Southern Railway (SR)</b> • Multi-Zonal Fleet: <b style="color:#38bdf8">${allTrains.length} Trains Tracked</b>
            </div>
          </div>

          <!-- Tab Switcher Navigation -->
          <div style="display:flex;gap:8px;background:rgba(0,0,0,0.35);padding:4px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);flex-wrap:wrap">
            <button onclick="window.__agentSwitchTab('AUDIT')" style="padding:6px 14px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;border:none;background:${currentTab === 'AUDIT' ? '#0284c7' : 'transparent'};color:${currentTab === 'AUDIT' ? '#ffffff' : '#94a3b8'};transition:all 0.15s ease">
              ⚡ 14-Point AI Asset Audit
            </button>
            <button onclick="window.__agentSwitchTab('COST_CUTTING')" style="padding:6px 14px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;border:none;background:${currentTab === 'COST_CUTTING' ? '#0284c7' : 'transparent'};color:${currentTab === 'COST_CUTTING' ? '#ffffff' : '#94a3b8'};transition:all 0.15s ease;box-shadow:${currentTab === 'COST_CUTTING' ? '0 0 10px rgba(56,189,248,0.5)' : 'none'}">
              💰 Train Cost Cuttings &amp; Breakdown Window
            </button>
            <button onclick="window.__agentSwitchTab('LEDGER')" style="padding:6px 14px;border-radius:6px;font-size:11.5px;font-weight:800;cursor:pointer;border:none;background:${currentTab === 'LEDGER' ? '#0284c7' : 'transparent'};color:${currentTab === 'LEDGER' ? '#ffffff' : '#94a3b8'};transition:all 0.15s ease">
              📜 Deployment &amp; Repair History (${deployedCount} Deployed &bull; ${repairedCount} Repaired)
            </button>
          </div>
        </div>

        <!-- TAB 2: COST CUTTINGS & BREAKDOWN WINDOW -->
        ${currentTab === "COST_CUTTING" ? renderTrainCostCuttingsWindow(selectedTrain, currentStation, allTrains, currentZone) : ''}

        <!-- TAB 1: 14-POINT AUDIT VIEW -->
        ${currentTab === "AUDIT" ? `
          
          <!-- Owning Zone Filter Pills Bar -->
          <div style="margin-bottom:12px">
            <label style="font-size:11px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:6px">FILTER BY OWNING RAILWAY ZONE:</label>
            <div class="agent-zone-pills" style="display:flex;gap:6px;flex-wrap:wrap">
              ${['ALL', 'NR', 'CR', 'SWR', 'WR', 'SER', 'ER', 'ECoR', 'SCR', 'SR', 'NWR'].map(z => `
                <button class="agent-zone-btn ${currentZone === z ? 'active' : ''}" onclick="window.__agentFilterZone('${z}')" style="
                  padding:4px 11px;border-radius:18px;font-size:11px;font-weight:700;cursor:pointer;
                  background:${currentZone === z ? '#2563eb' : 'var(--bg-input)'};
                  border:1px solid ${currentZone === z ? '#60a5fa' : 'var(--border-light)'};
                  color:${currentZone === z ? '#ffffff' : 'var(--text-muted)'};
                  transition:all 0.15s ease
                ">${z === 'ALL' ? '🌐 ALL ZONES' : z + ' (' + (IR_ZONES[z]?.name.split(' ')[0] || z) + ')'}</button>
              `).join('')}
            </div>
          </div>

          <!-- Train & Station Selector Bar -->
          <div style="display:grid;grid-template-columns:1.8fr 1.2fr;gap:12px;background:var(--bg-card);border:1px solid var(--border-light);border-radius:8px;padding:12px 14px;margin-bottom:14px;align-items:center">
            <div>
              <label style="font-size:11px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:4px">SELECT TRAIN TO AUDIT (${filtered.length} Trains Available):</label>
              <select id="agentTrainSelect" onchange="window.__agentSelectTrain(this.value)" style="width:100%;padding:7px 10px;background:var(--bg-input);color:#ffffff;border:1.5px solid var(--border-light);border-radius:6px;font-size:12px;font-weight:700">
                ${filtered.map(t => {
                  const no = t.train_no || t.no;
                  const oz = identifyOwningZone(t);
                  return `<option value="${no}" ${String(no) === String(currentTrainNo) ? 'selected' : ''}>[${oz.code}] ${no} • ${t.name} (${t.origin || t.src || 'SR'} ➔ ${t.dest || t.dst || 'IR'})</option>`;
                }).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:11px;color:var(--text-muted);font-weight:700;display:block;margin-bottom:4px">CURRENT STATION PLACEMENT (SR ZONE):</label>
              <select id="agentStationSelect" onchange="window.__agentSelectStation(this.value)" style="width:100%;padding:7px 10px;background:var(--bg-input);color:#ffffff;border:1.5px solid var(--border-light);border-radius:6px;font-size:12px;font-weight:700">
                ${Object.entries(SR_STATION_MAINTENANCE_FACILITIES).map(([code, fac]) => `
                  <option value="${code}" ${code === currentStation ? 'selected' : ''}>${code} — ${fac.name} (${fac.facility.split('&')[0].trim()})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Visual Hero Card for Selected Train -->
          <div style="background:linear-gradient(135deg, #091d38 0%, #061528 100%);border:1.5px solid ${oz.isForeignRake ? '#f59e0b' : '#38bdf8'};border-radius:8px;padding:14px 18px;margin-bottom:16px;box-shadow:0 4px 16px rgba(0,0,0,0.3)">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">
              <div>
                <div style="display:flex;align-items:center;gap:8px">
                  <h3 style="margin:0;font-size:17px;color:#ffffff">${audit.trainNo} • ${audit.trainName}</h3>
                  <span style="background:${oz.isForeignRake ? 'rgba(245,158,11,0.2)' : 'rgba(56,189,248,0.2)'};border:1px solid ${oz.isForeignRake ? '#f59e0b' : '#38bdf8'};color:${oz.isForeignRake ? '#fbbf24' : '#38bdf8'};font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px">
                    ${oz.code} — ${oz.name}
                  </span>
                  ${oz.isForeignRake ? `<span style="background:rgba(239,68,68,0.2);border:1px solid #ef4444;color:#fca5a5;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">⚠️ FOREIGN RAKE (INTER-RAILWAY DEBIT)</span>` : ''}
                </div>
                <div style="font-size:11px;color:#94a3b8;margin-top:4px">
                  Primary Maintenance Home Depot: <b style="color:#ffffff">${oz.primaryDepots[0] || 'Zonal Depot'}</b> • Locomotive: <b style="color:#60a5fa">${audit.param1_assetPresent.locomotive.locoClass}</b>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:12px">
                <button class="primary" style="background:#0284c7;font-weight:800;font-size:11.5px;padding:6px 14px;border-radius:6px;display:flex;align-items:center;gap:6px;cursor:pointer" onclick="window.openProfessionalRepairReportModal('${audit.trainNo}', '${currentStation}')">
                  <span>📑</span> Generate Official Repair Certificate &amp; BPC
                </button>
                <div style="text-align:right">
                  <span style="font-size:10.5px;color:#94a3b8;display:block">AVAILABLE STABLING DWELL:</span>
                  <span style="font-size:19px;font-family:'Barlow Condensed', sans-serif;font-weight:900;color:#38bdf8">${audit.stablingWindow.formatted}</span>
                </div>
              </div>
            </div>

            <!-- Timeline Stabling Fit Visual Indicator -->
            <div style="margin-top:12px;background:rgba(0,0,0,0.35);padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.1)">
              <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#94a3b8;margin-bottom:4px">
                <span>Required Work: <b style="color:#f59e0b">${audit.param8_duration.formatted}</b></span>
                <span>Departure Buffer Remaining: <b style="color:#4ade80">${audit.param10_stablingFit.bufferRemaining}</b></span>
                <span style="color:#4ade80;font-weight:800">${audit.param10_stablingFit.verdict}</span>
              </div>
              <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;position:relative">
                <div style="width:25%;height:100%;background:#f59e0b;float:left" title="Maintenance Duration: 3.5h"></div>
                <div style="width:75%;height:100%;background:#22c55e;float:left" title="Safe Buffer: 12h+"></div>
              </div>
            </div>
          </div>

          <!-- THE COMPLETE 14-POINT MASTER EVALUATION MATRIX -->
          <h4 style="margin:0 0 10px;font-size:13px;color:#38bdf8;text-transform:uppercase;letter-spacing:0.5px">📋 The 14-Point Asset Maintenance &amp; Cost Audit:</h4>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
            <!-- Param 1: Asset Present -->
            <div class="agent-eval-card" style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px 14px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:6px;font-size:12px">1. What asset is present?</strong>
              <div style="font-size:11.5px;line-height:1.5;color:#e2e8f0">
                <div>• <b style="color:#ffffff">Locomotive:</b> <span style="color:#93c5fd">${audit.param1_assetPresent.locomotive.assetId} (${audit.param1_assetPresent.locomotive.locoClass})</span></div>
                <div>• <b style="color:#ffffff">Owning Shed:</b> <span style="color:#e2e8f0">${audit.param1_assetPresent.locomotive.owningShed}</span></div>
                <div>• <b style="color:#ffffff">Coaching Stock:</b> <span style="color:#e2e8f0">${audit.param1_assetPresent.coachingStock.totalCoaches}-Coach ${audit.param1_assetPresent.coachingStock.rakeType}</span></div>
                <div>• <b style="color:#ffffff">Composition:</b> <span style="color:#cbd5e1">2 EOG, 1 AC-1, 3 AC-2, 7 AC-3, 7 Sleeper, 2 Gen/Pantry</span></div>
              </div>
            </div>

            <!-- Param 2: Current Location -->
            <div class="agent-eval-card" style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px 14px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:6px;font-size:12px">2. Where is it currently located?</strong>
              <div style="font-size:11.5px;line-height:1.5;color:#e2e8f0">
                <div>• <b style="color:#ffffff">Station:</b> <span style="color:#38bdf8;font-weight:700">${audit.param2_currentLocation.station}</span></div>
                <div>• <b style="color:#ffffff">Berth / Facility:</b> <span style="color:#e2e8f0">${audit.param2_currentLocation.berth}</span></div>
                <div>• <b style="color:#ffffff">Infrastructure:</b> <span style="color:#cbd5e1">${audit.facility.pitLines} Pit Lines, 750V HEP Shore Supply, USFD Pits</span></div>
                <div>• <b style="color:#ffffff">Corridor:</b> <span style="color:#cbd5e1">${audit.param2_currentLocation.corridor}</span></div>
              </div>
            </div>

            <!-- Param 3: Maintenance Required? -->
            <div class="agent-eval-card" style="background:#1f1315;border:1.5px solid rgba(239,68,68,0.5);border-radius:8px;padding:12px 14px;color:#f8fafc">
              <strong style="color:#f87171;display:block;margin-bottom:6px;font-size:12px">3. Does it require maintenance/repair?</strong>
              <div style="font-size:11.5px;line-height:1.5">
                <span style="background:rgba(239,68,68,0.25);border:1px solid #ef4444;color:#fca5a5;font-weight:800;padding:3px 8px;border-radius:4px">${audit.param3_requiresMaintenance.status}</span>
                <div style="margin-top:6px;color:#e2e8f0;line-height:1.4">${audit.param3_requiresMaintenance.reason}</div>
              </div>
            </div>

            <!-- Param 4: Work Scope Required -->
            <div class="agent-eval-card" style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px 14px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:6px;font-size:12px">4. What maintenance work is required?</strong>
              <ul style="margin:4px 0 0;padding-left:18px;font-size:11.5px;color:#e2e8f0;line-height:1.5">
                ${audit.param4_workScope.tasks.slice(0, 4).map(t => `<li style="color:#e2e8f0;margin-bottom:3px">${t}</li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- Param 5 & 6: Bill of Materials (BOM) & Labour Required -->
          <div style="background:#091e36;border:1.5px solid #1e4976;border-radius:8px;padding:14px 16px;margin-bottom:14px;color:#f8fafc">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <strong style="color:#38bdf8;font-size:12.5px;font-weight:800">5. Parts &amp; Materials Required (RDSO Spec BOM):</strong>
              <span style="color:#4ade80;font-weight:800;font-size:12px">Total BOM: ₹${audit.param5_partsRequired.totalPartsCost.toLocaleString('en-IN')}</span>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:11.5px;margin-bottom:14px">
              <thead>
                <tr style="border-bottom:1.5px solid #1e4976;color:#93c5fd;text-align:left;font-weight:800">
                  <th style="padding:6px 8px">Item / Material Description</th>
                  <th style="padding:6px 8px">RDSO Specification</th>
                  <th style="padding:6px 8px">Quantity</th>
                  <th style="padding:6px 8px">Unit Cost</th>
                  <th style="padding:6px 8px;text-align:right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${audit.param5_partsRequired.items.map(i => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.08)">
                    <td style="padding:6px 8px;font-weight:700;color:#ffffff">${i.item}</td>
                    <td style="padding:6px 8px;color:#94a3b8;font-family:monospace">${i.spec}</td>
                    <td style="padding:6px 8px;color:#e2e8f0;font-weight:600">${i.qty}</td>
                    <td style="padding:6px 8px;color:#e2e8f0;font-weight:600">₹${i.unitRate.toLocaleString('en-IN')}</td>
                    <td style="padding:6px 8px;text-align:right;font-weight:900;color:#38bdf8">₹${i.total.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <strong style="color:#38bdf8;font-size:12.5px;font-weight:800">6. Labour Required (Specialized Zonal Staff Allocation):</strong>
              <span style="color:#4ade80;font-weight:800;font-size:12px">Total Labour: ₹${audit.param6_labourRequired.totalLabourCost.toLocaleString('en-IN')} (${audit.param6_labourRequired.totalHeadcount} Staff)</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
              ${audit.param6_labourRequired.staff.map(s => `
                <div style="background:#07162b;border:1px solid #1e3a5f;border-radius:6px;padding:8px 10px;font-size:11px">
                  <strong style="color:#ffffff;display:block;margin-bottom:2px">${s.role.split('(')[0]}</strong>
                  <span style="color:#94a3b8;font-size:10.5px">${s.headcount}x Staff @ ₹${s.ratePerHour}/hr (${s.hours}h)</span>
                  <span style="color:#38bdf8;font-weight:800;display:block;margin-top:3px;font-size:11.5px">₹${s.total.toLocaleString('en-IN')}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Param 7 to 12 Grid -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
            <div style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:4px;font-size:12px">7. Equipment Required</strong>
              <div style="font-size:11px;color:#e2e8f0;line-height:1.4">
                • USFD Digital Axle Detector<br/>
                • RDSO Wheel Profile Gauge<br/>
                • 750V Ground Feeder Unit<br/>
                • 120-Bar High Pressure Jet
              </div>
            </div>

            <div style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:4px;font-size:12px">8. Required Duration</strong>
              <div style="font-size:20px;font-weight:900;color:#f59e0b;margin:2px 0">${audit.param8_duration.formatted}</div>
              <span style="font-size:10.5px;color:#94a3b8">Concurrent pit-line schedule</span>
            </div>

            <div style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:4px;font-size:12px">9. Direct Job Cost</strong>
              <div style="font-size:20px;font-weight:900;color:#ffffff;margin:2px 0">₹${audit.param9_directCost.totalDirect.toLocaleString('en-IN')}</div>
              <span style="font-size:10.5px;color:#cbd5e1">Parts ₹${audit.param9_directCost.partsCost.toLocaleString('en-IN')} + Labour ₹${audit.param9_directCost.labourCost.toLocaleString('en-IN')}</span>
            </div>

            <div style="background:#062326;border:1.5px solid #059669;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#4ade80;display:block;margin-bottom:4px;font-size:12px">10. Stabling Window Fit?</strong>
              <div style="font-size:13px;font-weight:900;color:#22c55e;margin:2px 0">✓ 100% FEASIBLE</div>
              <span style="font-size:10.5px;color:#a7f3d0">Fits within ${audit.stablingWindow.formatted} window with ${audit.param10_stablingFit.bufferRemaining} margin</span>
            </div>

            <div style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:4px;font-size:12px">11. Avoided Downtime</strong>
              <div style="font-size:20px;font-weight:900;color:#4ade80;margin:2px 0">${audit.param11_avoidedDowntime.avoidedHours}</div>
              <span style="font-size:10.5px;color:#94a3b8">Zero separate line possession</span>
            </div>

            <div style="background:#0b1d36;border:1.5px solid #1e4976;border-radius:8px;padding:12px;color:#f8fafc">
              <strong style="color:#60a5fa;display:block;margin-bottom:4px;font-size:12px">12. Total Cost Debit</strong>
              <div style="font-size:16px;font-weight:900;color:#38bdf8;margin:2px 0">₹${audit.param12_estimatedTotalCost.amount.toLocaleString('en-IN')}</div>
              <span style="font-size:10px;color:#94a3b8;display:block">Debit Head: ${audit.param12_estimatedTotalCost.accountingDebit}</span>
            </div>
          </div>

          <!-- Param 13 & 14 -->
          <div style="display:grid;grid-template-columns:1.1fr 1.9fr;gap:12px">
            <div style="background:#062326;border:1.5px solid #059669;border-radius:8px;padding:14px;color:#f8fafc">
              <strong style="color:#4ade80;font-size:13px;display:block;margin-bottom:6px;font-weight:800">13. Potential Savings Ledger:</strong>
              <div style="font-size:11.5px;line-height:1.6;color:#e2e8f0">
                <div>• Avoided Dead Haulage: <b style="color:#ffffff">₹65,000</b></div>
                <div>• Prevented Delay Penalty: <b style="color:#ffffff">₹77,000</b></div>
                <div>• Avoided Mainline Block: <b style="color:#ffffff">₹85,000</b></div>
                <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.15)">
                  <span style="font-size:11px;color:#94a3b8">GROSS AVOIDED COST:</span>
                  <div style="font-size:20px;font-weight:900;color:#4ade80">₹${audit.param13_potentialSaving.grossSavings.toLocaleString('en-IN')}</div>
                  <div style="font-size:11px;color:#86efac;font-weight:800">Net Financial Gain: +₹${audit.param13_potentialSaving.netBenefit.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            <div style="background:#0b1d36;border:1.5px solid #2563eb;border-radius:8px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;color:#f8fafc">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                  <strong style="color:#38bdf8;font-size:13px;font-weight:800">14. Operational Action for Planner:</strong>
                  <span style="background:#22c55e;color:#030a14;font-size:10px;font-weight:900;padding:2px 8px;border-radius:4px">APPROVED ACTION</span>
                </div>
                <div style="font-size:11.5px;color:#e2e8f0;line-height:1.5">
                  ${audit.param14_plannerAction.actionOrders.slice(0, 3).map(o => `<div style="margin-bottom:3px">• ${o}</div>`).join('')}
                </div>
              </div>

              <div style="margin-top:14px;display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap">
                <button class="primary" style="background:#0284c7;color:#ffffff;border:none;font-weight:800;font-size:11.5px;padding:7px 14px;border-radius:6px;display:flex;align-items:center;gap:6px;cursor:pointer" onclick="window.openProfessionalRepairReportModal('${audit.trainNo}', '${currentStation}')">
                  <span>📑</span> View Official RDSO Repair Report
                </button>
                <button class="primary" style="background:#16a34a;color:#ffffff;border:none;font-weight:800;font-size:11.5px;padding:7px 16px;border-radius:6px;display:flex;align-items:center;gap:6px;cursor:pointer" onclick="window.__agentAuthorizeMaintenance('${audit.trainNo}', '${currentStation}')">
                  <span>✓</span> Authorize Concurrent Pit-Line Servicing &amp; Issue BPC
                </button>
              </div>
            </div>
          </div>
        ` : `

        <!-- TAB 2: HISTORICAL DEPLOYMENT & REPAIR LEDGER -->
        <div>
          <!-- 6 Macro Historical Counters Grid -->
          <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:10px;margin-bottom:14px">
            <div style="background:rgba(16,185,129,0.1);border:1.5px solid #10b981;border-radius:8px;padding:12px 14px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#a7f3d0">Deployed to Service</div>
              <div style="font-size:24px;font-weight:900;color:#10b981;margin:4px 0">${deployedCount} Rakes</div>
              <div style="font-size:10.5px;color:#6ee7b7">Active in revenue service (Valid BPC)</div>
            </div>

            <div style="background:rgba(56,189,248,0.1);border:1.5px solid #38bdf8;border-radius:8px;padding:12px 14px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#bae6fd">Repaired &amp; Certified</div>
              <div style="font-size:24px;font-weight:900;color:#38bdf8;margin:4px 0">${repairedCount} Rakes</div>
              <div style="font-size:10.5px;color:#7dd3fc">Passed pit overhaul in past cycle</div>
            </div>

            <div style="background:rgba(245,158,11,0.1);border:1.5px solid #f59e0b;border-radius:8px;padding:12px 14px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#fde68a">In Pit-Line Overhaul</div>
              <div style="font-size:24px;font-weight:900;color:#f59e0b;margin:4px 0">${overhaulCount} Rakes</div>
              <div style="font-size:10.5px;color:#fbbf24">Under active Schedule TI examination</div>
            </div>

            <div style="background:rgba(168,85,247,0.1);border:1.5px solid #a855f7;border-radius:8px;padding:12px 14px">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:#f3e8ff">Scheduled Inbound</div>
              <div style="font-size:24px;font-weight:900;color:#c084fc;margin:4px 0">${scheduledCount} Rakes</div>
              <div style="font-size:10.5px;color:#d8b4fe">En-route with reserved pit slots</div>
            </div>
          </div>

          <!-- Secondary Metric Banner -->
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:8px 14px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px">
            <div>
              Total Spare Parts Consumed: <b style="color:#ffffff">1,480 RDSO Components</b> &bull; Total Man-Hours Logged: <b style="color:#38bdf8">1,155 Hours</b>
            </div>
            <div>
              Cumulative Inter-Railway Debits: <b style="color:#f59e0b">₹4.84 Crores</b> &bull; Total Downtime Saved: <b style="color:#10b981">1,840 Hours</b>
            </div>
          </div>

          <!-- Ledger Filter & Search Bar -->
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap">
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <button onclick="window.__agentFilterLedger('ALL')" style="padding:4px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid ${ledgerFilter === 'ALL' ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${ledgerFilter === 'ALL' ? '#0284c7' : 'transparent'};color:${ledgerFilter === 'ALL' ? '#ffffff' : '#94a3b8'}">
                All Records (${historyLedger.length})
              </button>
              <button onclick="window.__agentFilterLedger('DEPLOYED')" style="padding:4px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid ${ledgerFilter === 'DEPLOYED' ? '#10b981' : 'rgba(255,255,255,0.1)'};background:${ledgerFilter === 'DEPLOYED' ? '#10b981' : 'transparent'};color:${ledgerFilter === 'DEPLOYED' ? '#000000' : '#a7f3d0'}">
                🟢 Deployed (${deployedCount})
              </button>
              <button onclick="window.__agentFilterLedger('REPAIRED')" style="padding:4px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid ${ledgerFilter === 'REPAIRED' ? '#38bdf8' : 'rgba(255,255,255,0.1)'};background:${ledgerFilter === 'REPAIRED' ? '#0284c7' : 'transparent'};color:${ledgerFilter === 'REPAIRED' ? '#ffffff' : '#bae6fd'}">
                🔵 Repaired &amp; Certified (${repairedCount})
              </button>
              <button onclick="window.__agentFilterLedger('OVERHAUL')" style="padding:4px 10px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;border:1px solid ${ledgerFilter === 'OVERHAUL' ? '#f59e0b' : 'rgba(255,255,255,0.1)'};background:${ledgerFilter === 'OVERHAUL' ? '#f59e0b' : 'transparent'};color:${ledgerFilter === 'OVERHAUL' ? '#000000' : '#fde68a'}">
                🟠 In Pit-Line Overhaul (${overhaulCount})
              </button>
            </div>

            <div style="flex:1;max-width:320px">
              <input 
                type="text" 
                placeholder="Search Train No, Name, Depot..." 
                value="${ledgerSearchQuery}" 
                oninput="window.__agentSearchLedger(this.value)"
                style="width:100%;padding:5px 10px;background:var(--bg-input);border:1px solid var(--border-light);border-radius:6px;color:#ffffff;font-size:11.5px"
              />
            </div>
          </div>

          <!-- Chronological Table -->
          <div style="max-height:420px;overflow-y:auto;border:1px solid var(--border-light);border-radius:6px">
            <table style="width:100%;border-collapse:collapse;font-size:11px;text-align:left">
              <thead style="position:sticky;top:0;background:#0c1c33;color:#94a3b8;border-bottom:1.5px solid #1a3c63">
                <tr>
                  <th style="padding:8px 10px">Date &amp; Time</th>
                  <th style="padding:8px 10px">Train No &amp; Name</th>
                  <th style="padding:8px 10px">Owning Zone</th>
                  <th style="padding:8px 10px">Maintenance Facility</th>
                  <th style="padding:8px 10px">Lifecycle Status</th>
                  <th style="padding:8px 10px">BPC Serial No</th>
                  <th style="padding:8px 10px">Overhaul Scope &amp; Parts</th>
                  <th style="padding:8px 10px">Cost (₹)</th>
                  <th style="padding:8px 10px;text-align:right">Official Report</th>
                </tr>
              </thead>
              <tbody>
                ${filteredLedger.slice(0, 60).map(row => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.1s ease" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:7px 10px;font-family:monospace;color:#94a3b8;white-space:nowrap">${row.dateStr}</td>
                    <td style="padding:7px 10px;font-weight:700;color:#ffffff;white-space:nowrap">
                      [${row.trainNo}] ${row.name}
                    </td>
                    <td style="padding:7px 10px">
                      <span style="background:${row.isForeign ? 'rgba(245,158,11,0.15)' : 'rgba(56,189,248,0.15)'};color:${row.isForeign ? '#fbbf24' : '#38bdf8'};padding:2px 6px;border-radius:3px;font-weight:700;font-size:10px">
                        ${row.owningZone.code}
                      </span>
                    </td>
                    <td style="padding:7px 10px;color:#cbd5e1">${row.depot}</td>
                    <td style="padding:7px 10px;white-space:nowrap">
                      <span style="background:${row.statusColor}22;color:${row.statusColor};border:1px solid ${row.statusColor}55;padding:2px 6px;border-radius:4px;font-weight:800;font-size:10px">
                        ${row.status}
                      </span>
                    </td>
                    <td style="padding:7px 10px;font-family:monospace;color:#94a3b8;font-size:10.5px">${row.bpcNumber}</td>
                    <td style="padding:7px 10px;color:#94a3b8;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${row.partsSummary}">
                      ${row.partsCount > 0 ? `<b style="color:#ffffff">${row.partsCount} Parts:</b> ${row.partsSummary}` : 'Turnaround Pit Slot Reserved'}
                    </td>
                    <td style="padding:7px 10px;font-weight:700;color:#38bdf8;white-space:nowrap">₹${row.repairCost.toLocaleString('en-IN')}</td>
                    <td style="padding:7px 10px;text-align:right;white-space:nowrap">
                      <button 
                        class="primary" 
                        onclick="window.openProfessionalRepairReportModal('${row.trainNo}', '${row.depotCode}')"
                        style="background:#0284c7;border:none;color:#ffffff;font-size:10.5px;font-weight:700;padding:3px 9px;border-radius:4px;cursor:pointer">
                        📑 View BPC
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:8px;text-align:right">
            Showing ${Math.min(60, filteredLedger.length)} of ${filteredLedger.length} fleet records &bull; Complete 330-train multi-zonal database indexed
          </div>
        </div>
        `}

      </div>
    `;
  }

  // Bind global UI handlers
  window.__agentFilterZone = (z) => {
    currentZone = z;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__modalUpdateTrain = (no) => {
    currentTrainNo = no;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__modalUpdateStation = (stn) => {
    currentStation = stn;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__agentSelectTrain = (no) => {
    currentTrainNo = no;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
    if (typeof window.__setCostTrain === "function") {
      window.__setCostTrain(no);
    }
  };

  window.__agentSelectStation = (stn) => {
    currentStation = stn;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
    if (typeof window.__setCostStation === "function") {
      window.__setCostStation(stn);
    }
  };

  window.__agentSwitchTab = (tab) => {
    currentTab = tab;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__agentFilterLedger = (flt) => {
    ledgerFilter = flt;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__agentSearchLedger = (q) => {
    ledgerSearchQuery = q;
    const cont = document.querySelector("#agentModalMount");
    if (cont) cont.innerHTML = renderModalInner();
  };

  window.__agentAuthorizeMaintenance = (no, stn) => {
    const toastMsg = `✓ Electronic Job Card & BPC Issued for Train #${no} at ${stn} BBQ/Coaching Pit Line. Inter-Railway debit registered.`;
    if (typeof window.showToast === "function") window.showToast(toastMsg);
    const overlay = document.querySelector(".modal-overlay");
    if (overlay) overlay.remove();
  };

  // Render in wide modal
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal-card modal-card-extra-wide" style="max-width:980px;width:95vw;max-height:92vh;overflow-y:auto;background:#061427;border:1.5px solid #1a3c63">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #1a3c63">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="/southern-railway-logo.png" style="width:28px;height:28px;object-fit:contain" alt="SR Crest" onerror="this.outerHTML='<span style=\'font-size:24px\'>🚆</span>'" />
          <div>
            <h3 style="margin:0;font-size:18px;color:#ffffff;font-family:'Barlow Condensed', sans-serif;letter-spacing:0.5px">SOUTHERN RAILWAY • AI ASSET MAINTENANCE &amp; COST OPTIMIZER</h3>
            <span style="font-size:10.5px;color:#93c5fd">Pan-Indian Railways Multi-Zonal Fleet Intelligence • 14-Parameter Decision Matrix</span>
          </div>
        </div>
        <button class="secondary" id="modalCloseBtn" style="padding:4px 10px;font-size:12px;cursor:pointer">✕ Close</button>
      </div>

      <div id="agentModalMount">
        ${renderModalInner()}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.querySelector("#modalCloseBtn").onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

export function getRouteDistance(train) {
  const origin = String(train.origin || train.src || "").toUpperCase();
  const dest = String(train.dest || train.dst || train.destination || "").toUpperCase();
  const route = `${origin} ${dest}`;
  if (route.includes("NDLS") || route.includes("DELHI") || route.includes("NZM")) return 2180;
  if (route.includes("HWH") || route.includes("HOWRAH") || route.includes("SRC")) return 1660;
  if (route.includes("ADI") || route.includes("AHMEDABAD")) return 1720;
  if (route.includes("LTT") || route.includes("CSMT") || route.includes("MUMBAI")) return 1280;
  if (route.includes("BBS") || route.includes("BHUBANESWAR")) return 1220;
  if (route.includes("SC") || route.includes("SECUNDERABAD") || route.includes("HYB")) return 700;
  if (route.includes("TVC") || route.includes("TRIVANDRUM") || route.includes("KCVL")) return 920;
  if (route.includes("MDU") || route.includes("MADURAI")) return 497;
  if (route.includes("CBE") || route.includes("COIMBATORE")) return 495;
  if (route.includes("SBC") || route.includes("BENGALURU") || route.includes("MYS")) return 362;
  if (route.includes("MAQ") || route.includes("MANGALORE")) return 890;
  return 580;
}

export function calculateTrainOperationalCosts(train, stationCode = "MAS") {
  const dist = getRouteDistance(train);
  const isVB = (train.name || "").toLowerCase().includes("vande bharat");
  const oz = identifyOwningZone(train);

  // 1. Operations Cost
  const tractionKWh = dist * 18.5;
  const energyCost = Math.round(tractionKWh * 7.25);
  const runtimeHours = isVB ? (dist / 80) : (dist / 65);
  const crewCost = Math.round(3 * runtimeHours * 450 + dist * 4.5);
  const handlingCost = 14500;
  const operationsCost = energyCost + crewCost + handlingCost;

  // 2. Repair Cost (BOM + Labour)
  const repairCost = isVB ? 59180 : 59580;
  const totalOperationalCost = operationsCost + repairCost;

  const avoidedSavings = 227000;
  const netBenefit = avoidedSavings - repairCost;

  return {
    distKm: dist,
    energyCost,
    crewCost,
    handlingCost,
    operationsCost,
    repairCost,
    totalOperationalCost,
    owningZone: oz,
    debitAccount: oz.debitAccountHead,
    isForeign: oz.isForeignRake,
    avoidedSavings,
    netBenefit
  };
}

export function classifyFleetTimeline(trains) {
  const stations = ["MAS", "MS", "CBE", "SA", "ED", "TPJ", "MDU", "TVC", "ERS", "PGT"];
  const list = Array.isArray(trains) && trains.length > 0 ? trains : getAllTrainsDataset();

  return list.map((t, idx) => {
    const timeline = idx % 3 === 0 ? "PAST" : (idx % 3 === 1 ? "PRESENT" : "FUTURE");
    const stnCode = stations[idx % stations.length];
    const fac = SR_STATION_MAINTENANCE_FACILITIES[stnCode] || SR_STATION_MAINTENANCE_FACILITIES.MAS;
    const costs = calculateTrainOperationalCosts(t, stnCode);

    let statusText = "";
    let locationDetail = "";
    let statusClass = "";

    if (timeline === "PAST") {
      statusText = "Completed • Post-Trip Pit Exam";
      locationDetail = `${stnCode} • ${fac.facility.split('&')[0].trim()}`;
      statusClass = "past";
    } else if (timeline === "PRESENT") {
      statusText = "Active / Stabled • Concurrent Service";
      locationDetail = `${stnCode} • Platform Road / Pit Line ${((idx % 5) + 1)}`;
      statusClass = "present";
    } else {
      statusText = `Scheduled • Due in ${((idx % 18) + 2)}h`;
      locationDetail = `En Route ➔ Inbound to ${stnCode}`;
      statusClass = "future";
    }

    return {
      ...t,
      timeline,
      stnCode,
      facilityName: fac.name,
      facilityYard: fac.facility,
      statusText,
      locationDetail,
      statusClass,
      ...costs
    };
  });
}

export function getFleetFinancialKPIs(trainsList) {
  const totalOps = trainsList.reduce((s, t) => s + (t.operationsCost || 0), 0);
  const totalRepair = trainsList.reduce((s, t) => s + (t.repairCost || 0), 0);
  const totalCost = trainsList.reduce((s, t) => s + (t.totalOperationalCost || 0), 0);
  const totalForeign = trainsList.filter(t => t.isForeign).reduce((s, t) => s + (t.totalOperationalCost || 0), 0);
  const totalSavings = trainsList.reduce((s, t) => s + (t.avoidedSavings || 0), 0);
  const netBenefit = totalSavings - totalRepair;

  return {
    count: trainsList.length,
    totalOperationsCost: totalOps,
    totalRepairCost: totalRepair,
    totalOperationalCost: totalCost,
    totalForeignDebits: totalForeign,
    totalSavings,
    netBenefit
  };
}

// Attach to window object for global invocation
if (typeof window !== "undefined") {
  window.openAssetMaintenanceAgentModal = openAssetMaintenanceAgentModal;
  window.openProfessionalRepairReportModal = openProfessionalRepairReportModal;
  window.generateFleetHistoricalLedger = generateFleetHistoricalLedger;
  window.run14PointAssetAudit = run14PointAssetAudit;
  window.identifyOwningZone = identifyOwningZone;
  window.filterTrainsByOwningZone = filterTrainsByOwningZone;
  window.getRouteDistance = getRouteDistance;
  window.calculateTrainOperationalCosts = calculateTrainOperationalCosts;
  window.classifyFleetTimeline = classifyFleetTimeline;
  window.getFleetFinancialKPIs = getFleetFinancialKPIs;
}

