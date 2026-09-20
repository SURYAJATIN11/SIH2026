#!/usr/bin/env python3
"""Seed national Indian Railways infrastructure into the database.

Adds:
  - Major National Hub & Junction Stations across all railway zones
  - Golden Quadrilateral and National Rail Corridors
  - Associated Track Sections
  - Iconic Pan-India Passenger, Vande Bharat, Rajdhani, Shatabdi, and Freight Trains
"""

import sys
import os
import uuid
from datetime import datetime, timezone

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database.session import SessionLocal
from app.models.station import Station
from app.models.corridor import Corridor
from app.models.track_section import TrackSection
from app.models.train import Train
from app.models.enums import (
    EntityStatus, SourceType, TrainType, TrainStatus,
    TrafficLevel, AssetCriticality
)
from sqlalchemy import select

NATIONAL_STATIONS = [
    {"code": "NDLS", "name": "New Delhi", "division": "Delhi", "location": "28.6139,77.2090", "zone": "Northern Railway"},
    {"code": "DLI", "name": "Old Delhi Junction", "division": "Delhi", "location": "28.6606,77.2272", "zone": "Northern Railway"},
    {"code": "NZM", "name": "Hazrat Nizamuddin", "division": "Delhi", "location": "28.5888,77.2534", "zone": "Northern Railway"},
    {"code": "ANVT", "name": "Anand Vihar Terminal", "division": "Delhi", "location": "28.6508,77.3153", "zone": "Northern Railway"},
    {"code": "UMB", "name": "Ambala Cantt Junction", "division": "Ambala", "location": "30.3610,76.8400", "zone": "Northern Railway"},
    {"code": "LDH", "name": "Ludhiana Junction", "division": "Firozpur", "location": "30.9010,75.8573", "zone": "Northern Railway"},
    {"code": "ASR", "name": "Amritsar Junction", "division": "Firozpur", "location": "31.6330,74.8656", "zone": "Northern Railway"},
    {"code": "JAT", "name": "Jammu Tawi", "division": "Firozpur", "location": "32.7060,74.8795", "zone": "Northern Railway"},
    {"code": "SVDK", "name": "SMVD Katra", "division": "Firozpur", "location": "32.9934,74.9317", "zone": "Northern Railway"},
    {"code": "LKO", "name": "Lucknow Charbagh", "division": "Lucknow", "location": "26.8322,80.9200", "zone": "Northern Railway"},
    {"code": "BSB", "name": "Varanasi Junction", "division": "Varanasi", "location": "25.3267,82.9867", "zone": "Northern Railway"},
    {"code": "HW", "name": "Haridwar", "division": "Moradabad", "location": "29.9457,78.1488", "zone": "Northern Railway"},
    {"code": "DDN", "name": "Dehradun", "division": "Moradabad", "location": "30.3165,78.0322", "zone": "Northern Railway"},
    {"code": "CNB", "name": "Kanpur Central", "division": "Prayagraj", "location": "26.4539,80.3508", "zone": "North Central Railway"},
    {"code": "PRYJ", "name": "Prayagraj Junction", "division": "Prayagraj", "location": "25.4358,81.8463", "zone": "North Central Railway"},
    {"code": "AGC", "name": "Agra Cantt", "division": "Agra", "location": "27.1593,77.9944", "zone": "North Central Railway"},
    {"code": "GWL", "name": "Gwalior Junction", "division": "Jhansi", "location": "26.2183,78.1828", "zone": "North Central Railway"},
    {"code": "VGLB", "name": "V Lakshmibai Jhansi", "division": "Jhansi", "location": "25.4484,78.5685", "zone": "North Central Railway"},
    {"code": "JP", "name": "Jaipur Junction", "division": "Jaipur", "location": "26.9200,75.7900", "zone": "North Western Railway"},
    {"code": "AII", "name": "Ajmer Junction", "division": "Ajmer", "location": "26.4500,74.6300", "zone": "North Western Railway"},
    {"code": "JU", "name": "Jodhpur Junction", "division": "Jodhpur", "location": "26.2800,73.0200", "zone": "North Western Railway"},
    {"code": "MMCT", "name": "Mumbai Central", "division": "Mumbai WR", "location": "18.9696,72.8194", "zone": "Western Railway"},
    {"code": "BDTS", "name": "Bandra Terminus", "division": "Mumbai WR", "location": "19.0600,72.8400", "zone": "Western Railway"},
    {"code": "ST", "name": "Surat", "division": "Mumbai WR", "location": "21.2049,72.8406", "zone": "Western Railway"},
    {"code": "BRC", "name": "Vadodara Junction", "division": "Vadodara", "location": "22.3107,73.1812", "zone": "Western Railway"},
    {"code": "ADI", "name": "Ahmedabad Junction", "division": "Ahmedabad", "location": "23.0225,72.5714", "zone": "Western Railway"},
    {"code": "RTM", "name": "Ratlam Junction", "division": "Ratlam", "location": "23.3340,75.0370", "zone": "Western Railway"},
    {"code": "INDB", "name": "Indore Junction", "division": "Ratlam", "location": "22.7196,75.8577", "zone": "Western Railway"},
    {"code": "BPL", "name": "Bhopal Junction", "division": "Bhopal", "location": "23.2599,77.4126", "zone": "West Central Railway"},
    {"code": "RKMP", "name": "Rani Kamlapati", "division": "Bhopal", "location": "23.2084,77.4338", "zone": "West Central Railway"},
    {"code": "JBP", "name": "Jabalpur Junction", "division": "Jabalpur", "location": "23.1815,79.9864", "zone": "West Central Railway"},
    {"code": "KOTA", "name": "Kota Junction", "division": "Kota", "location": "25.2138,75.8648", "zone": "West Central Railway"},
    {"code": "ET", "name": "Itarsi Junction", "division": "Bhopal", "location": "22.6120,77.7644", "zone": "West Central Railway"},
    {"code": "CSMT", "name": "Mumbai CSMT", "division": "Mumbai CR", "location": "18.9401,72.8347", "zone": "Central Railway"},
    {"code": "DR", "name": "Dadar Central", "division": "Mumbai CR", "location": "19.0178,72.8478", "zone": "Central Railway"},
    {"code": "PUNE", "name": "Pune Junction", "division": "Pune", "location": "18.5284,73.8744", "zone": "Central Railway"},
    {"code": "SUR", "name": "Solapur", "division": "Solapur", "location": "17.6599,75.9064", "zone": "Central Railway"},
    {"code": "NGP", "name": "Nagpur Junction", "division": "Nagpur CR", "location": "21.1528,79.0882", "zone": "Central Railway"},
    {"code": "BSL", "name": "Bhusawal Junction", "division": "Bhusawal", "location": "21.0475,75.7956", "zone": "Central Railway"},
    {"code": "HWH", "name": "Howrah Junction", "division": "Howrah", "location": "22.5839,88.3426", "zone": "Eastern Railway"},
    {"code": "SDAH", "name": "Sealdah", "division": "Sealdah", "location": "22.5697,88.3712", "zone": "Eastern Railway"},
    {"code": "ASN", "name": "Asansol Junction", "division": "Asansol", "location": "23.6889,86.9661", "zone": "Eastern Railway"},
    {"code": "MLDT", "name": "Malda Town", "division": "Malda", "location": "25.0108,88.1411", "zone": "Eastern Railway"},
    {"code": "PNBE", "name": "Patna Junction", "division": "Danapur", "location": "25.6022,85.1376", "zone": "East Central Railway"},
    {"code": "DDU", "name": "Pt. Deen Dayal Upadhyaya Jn", "division": "Pt. DDU", "location": "25.2789,83.1189", "zone": "East Central Railway"},
    {"code": "GAYA", "name": "Gaya Junction", "division": "Pt. DDU", "location": "24.8016,85.0069", "zone": "East Central Railway"},
    {"code": "DHN", "name": "Dhanbad Junction", "division": "Dhanbad", "location": "23.7957,86.4304", "zone": "East Central Railway"},
    {"code": "KGP", "name": "Kharagpur Junction", "division": "Kharagpur", "location": "22.3380,87.3220", "zone": "South Eastern Railway"},
    {"code": "TATA", "name": "Tatanagar Junction", "division": "Chakradharpur", "location": "22.7719,86.1950", "zone": "South Eastern Railway"},
    {"code": "ROU", "name": "Rourkela Junction", "division": "Chakradharpur", "location": "22.2575,84.8828", "zone": "South Eastern Railway"},
    {"code": "BBS", "name": "Bhubaneswar", "division": "Khurda Road", "location": "20.2644,85.8400", "zone": "East Coast Railway"},
    {"code": "VSKP", "name": "Visakhapatnam Junction", "division": "Waltair", "location": "17.7215,83.2884", "zone": "East Coast Railway"},
    {"code": "R", "name": "Raipur Junction", "division": "Raipur", "location": "21.2514,81.6296", "zone": "South East Central Railway"},
    {"code": "BSP", "name": "Bilaspur Junction", "division": "Bilaspur", "location": "22.0797,82.1409", "zone": "South East Central Railway"},
    {"code": "SC", "name": "Secunderabad Junction", "division": "Secunderabad", "location": "17.4334,78.5015", "zone": "South Central Railway"},
    {"code": "HYB", "name": "Hyderabad Deccan", "division": "Hyderabad", "location": "17.3916,78.4674", "zone": "South Central Railway"},
    {"code": "BZA", "name": "Vijayawada Junction", "division": "Vijayawada", "location": "16.5186,80.6200", "zone": "South Central Railway"},
    {"code": "TPTY", "name": "Tirupati", "division": "Guntakal", "location": "13.6288,79.4192", "zone": "South Central Railway"},
    {"code": "SBC", "name": "KSR Bengaluru", "division": "Bengaluru", "location": "12.9784,77.5684", "zone": "South Western Railway"},
    {"code": "SMVB", "name": "SMVT Bengaluru", "division": "Bengaluru", "location": "12.9942,77.6533", "zone": "South Western Railway"},
    {"code": "MYS", "name": "Mysuru Junction", "division": "Mysuru", "location": "12.3167,76.6500", "zone": "South Western Railway"},
    {"code": "UBL", "name": "SSS Hubballi", "division": "Hubballi", "location": "15.3468,75.1482", "zone": "South Western Railway"},
    {"code": "GHY", "name": "Guwahati", "division": "Lumding", "location": "26.1862,91.7539", "zone": "Northeast Frontier Railway"},
    {"code": "NJP", "name": "New Jalpaiguri", "division": "Katihar", "location": "26.6858,88.4419", "zone": "Northeast Frontier Railway"},
    {"code": "MAO", "name": "Madgaon Junction", "division": "Karwar", "location": "15.2736,73.9582", "zone": "Konkan Railway"}
]

NATIONAL_CORRIDORS = [
    {
        "code": "SEC-NDLS-MMCT",
        "name": "New Delhi - Mumbai Central Mainline",
        "division": "Western / Northern",
        "from_code": "NDLS",
        "to_code": "MMCT",
        "distance": 1386.0,
        "speed": 160
    },
    {
        "code": "SEC-NDLS-HWH",
        "name": "New Delhi - Howrah Grand Chord",
        "division": "Eastern / North Central",
        "from_code": "NDLS",
        "to_code": "HWH",
        "distance": 1447.0,
        "speed": 160
    },
    {
        "code": "SEC-NDLS-MAS-GT",
        "name": "New Delhi - Chennai Central Grand Trunk",
        "division": "Central / Southern",
        "from_code": "NDLS",
        "to_code": "MAS",
        "distance": 2182.0,
        "speed": 130
    },
    {
        "code": "SEC-CSMT-HWH",
        "name": "Mumbai CSMT - Howrah Mainline",
        "division": "Central / South Eastern",
        "from_code": "CSMT",
        "to_code": "HWH",
        "distance": 1968.0,
        "speed": 130
    },
    {
        "code": "SEC-CSMT-MAS",
        "name": "Mumbai CSMT - Chennai Central Mainline",
        "division": "Central / Southern",
        "from_code": "CSMT",
        "to_code": "MAS",
        "distance": 1281.0,
        "speed": 130
    },
    {
        "code": "SEC-HWH-MAS-ECR",
        "name": "Howrah - Chennai Central East Coast Trunk",
        "division": "East Coast / Southern",
        "from_code": "HWH",
        "to_code": "MAS",
        "distance": 1662.0,
        "speed": 130
    },
    {
        "code": "SEC-NDLS-JAT",
        "name": "New Delhi - Jammu Tawi Northern Trunk",
        "division": "Northern",
        "from_code": "NDLS",
        "to_code": "JAT",
        "distance": 577.0,
        "speed": 130
    },
    {
        "code": "SEC-HWH-GHY",
        "name": "Howrah - Guwahati Northeast Frontier Trunk",
        "division": "Northeast Frontier / Eastern",
        "from_code": "HWH",
        "to_code": "GHY",
        "distance": 998.0,
        "speed": 110
    },
    {
        "code": "SEC-SBC-SC",
        "name": "KSR Bengaluru - Secunderabad Deccan Trunk",
        "division": "South Western / South Central",
        "from_code": "SBC",
        "to_code": "SC",
        "distance": 622.0,
        "speed": 110
    },
    {
        "code": "SEC-NDLS-ADI",
        "name": "New Delhi - Jaipur - Ahmedabad Mainline",
        "division": "North Western / Western",
        "from_code": "NDLS",
        "to_code": "ADI",
        "distance": 934.0,
        "speed": 130
    },
    {
        "code": "SEC-LKO-BSB-PNBE-HWH",
        "name": "Lucknow - Varanasi - Patna - Howrah Mainline",
        "division": "Northern / East Central",
        "from_code": "LKO",
        "to_code": "HWH",
        "distance": 986.0,
        "speed": 130
    }
]

NATIONAL_TRAINS = [
    {
        "no": "22436",
        "name": "Vande Bharat Express (New Delhi - Varanasi)",
        "type": TrainType.VANDE_BHARAT,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "BSB",
        "dep": "06:00:00",
        "arr": "14:00:00",
        "days": "Daily except Thu"
    },
    {
        "no": "20901",
        "name": "Vande Bharat Express (Mumbai Central - Gandhinagar)",
        "type": TrainType.VANDE_BHARAT,
        "tier": 1,
        "goods": False,
        "source": "MMCT",
        "dest": "ADI",
        "dep": "06:10:00",
        "arr": "12:25:00",
        "days": "6 Days/wk"
    },
    {
        "no": "20607",
        "name": "Vande Bharat Express (Chennai Central - Mysuru)",
        "type": TrainType.VANDE_BHARAT,
        "tier": 1,
        "goods": False,
        "source": "MAS",
        "dest": "MYS",
        "dep": "05:50:00",
        "arr": "12:20:00",
        "days": "6 Days/wk"
    },
    {
        "no": "20835",
        "name": "Vande Bharat Express (Rourkela - Puri)",
        "type": TrainType.VANDE_BHARAT,
        "tier": 1,
        "goods": False,
        "source": "ROU",
        "dest": "PURI",
        "dep": "05:15:00",
        "arr": "12:50:00",
        "days": "6 Days/wk"
    },
    {
        "no": "12951",
        "name": "Mumbai Rajdhani Express (Mumbai - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "MMCT",
        "dest": "NDLS",
        "dep": "17:00:00",
        "arr": "08:32:00",
        "days": "Daily"
    },
    {
        "no": "12952",
        "name": "New Delhi - Mumbai Rajdhani Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "MMCT",
        "dep": "16:55:00",
        "arr": "08:35:00",
        "days": "Daily"
    },
    {
        "no": "12301",
        "name": "Howrah Rajdhani Express (Howrah - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "HWH",
        "dest": "NDLS",
        "dep": "16:50:00",
        "arr": "10:05:00",
        "days": "Daily except Sun"
    },
    {
        "no": "12302",
        "name": "New Delhi - Howrah Rajdhani Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "HWH",
        "dep": "16:55:00",
        "arr": "09:55:00",
        "days": "Daily except Fri"
    },
    {
        "no": "12433",
        "name": "Chennai Rajdhani Express (Chennai - Nizamuddin)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "MAS",
        "dest": "NZM",
        "dep": "06:05:00",
        "arr": "10:30:00",
        "days": "2 Days/wk"
    },
    {
        "no": "12434",
        "name": "Hazrat Nizamuddin - Chennai Rajdhani Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NZM",
        "dest": "MAS",
        "dep": "15:35:00",
        "arr": "20:45:00",
        "days": "2 Days/wk"
    },
    {
        "no": "12615",
        "name": "Grand Trunk Express (Chennai Central - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "MAS",
        "dest": "NDLS",
        "dep": "18:50:00",
        "arr": "06:30:00",
        "days": "Daily"
    },
    {
        "no": "12616",
        "name": "Grand Trunk Express (New Delhi - Chennai Central)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "NDLS",
        "dest": "MAS",
        "dep": "16:10:00",
        "arr": "04:30:00",
        "days": "Daily"
    },
    {
        "no": "12245",
        "name": "Howrah - SMVT Bengaluru Duronto Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "HWH",
        "dest": "SMVB",
        "dep": "10:50:00",
        "arr": "15:50:00",
        "days": "5 Days/wk"
    },
    {
        "no": "12261",
        "name": "CSMT Mumbai - Howrah AC Duronto Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "CSMT",
        "dest": "HWH",
        "dep": "17:15:00",
        "arr": "20:15:00",
        "days": "4 Days/wk"
    },
    {
        "no": "12002",
        "name": "New Delhi - Rani Kamlapati (Bhopal) Shatabdi",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "RKMP",
        "dep": "06:00:00",
        "arr": "14:40:00",
        "days": "Daily"
    },
    {
        "no": "12004",
        "name": "New Delhi - Lucknow Swarna Shatabdi",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "LKO",
        "dep": "06:10:00",
        "arr": "12:40:00",
        "days": "Daily"
    },
    {
        "no": "12423",
        "name": "Dibrugarh Rajdhani Express (New Delhi - Dibrugarh)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "DBRG",
        "dep": "16:20:00",
        "arr": "07:00:00",
        "days": "Daily"
    },
    {
        "no": "12425",
        "name": "New Delhi - Jammu Tawi Rajdhani Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "NDLS",
        "dest": "JAT",
        "dep": "20:40:00",
        "arr": "05:00:00",
        "days": "Daily"
    },
    {
        "no": "12009",
        "name": "Mumbai Central - Ahmedabad Shatabdi Express",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "MMCT",
        "dest": "ADI",
        "dep": "06:20:00",
        "arr": "12:45:00",
        "days": "6 Days/wk"
    },
    {
        "no": "12839",
        "name": "Howrah - MGR Chennai Central Mail",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "HWH",
        "dest": "MAS",
        "dep": "23:55:00",
        "arr": "03:45:00",
        "days": "Daily"
    },
    {
        "no": "12621",
        "name": "Tamil Nadu Express (Chennai Central - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "MAS",
        "dest": "NDLS",
        "dep": "22:00:00",
        "arr": "07:40:00",
        "days": "Daily"
    },
    {
        "no": "12622",
        "name": "Tamil Nadu Express (New Delhi - Chennai Central)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "NDLS",
        "dest": "MAS",
        "dep": "21:05:00",
        "arr": "06:35:00",
        "days": "Daily"
    },
    {
        "no": "12625",
        "name": "Kerala Express (New Delhi - Thiruvananthapuram)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "NDLS",
        "dest": "TVC",
        "dep": "20:10:00",
        "arr": "12:05:00",
        "days": "Daily"
    },
    {
        "no": "12626",
        "name": "Kerala Express (Thiruvananthapuram - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "TVC",
        "dest": "NDLS",
        "dep": "12:30:00",
        "arr": "05:15:00",
        "days": "Daily"
    },
    {
        "no": "12393",
        "name": "Sampoorna Kranti Express (Patna - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 2,
        "goods": False,
        "source": "PNBE",
        "dest": "NDLS",
        "dep": "19:25:00",
        "arr": "07:55:00",
        "days": "Daily"
    },
    {
        "no": "12957",
        "name": "Swarna Jayanti Rajdhani (Ahmedabad - New Delhi)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "ADI",
        "dest": "NDLS",
        "dep": "17:45:00",
        "arr": "07:30:00",
        "days": "Daily"
    },
    {
        "no": "12431",
        "name": "Trivandrum Rajdhani (Thiruvananthapuram - Nizamuddin)",
        "type": TrainType.SUPERFAST,
        "tier": 1,
        "goods": False,
        "source": "TVC",
        "dest": "NZM",
        "dep": "19:15:00",
        "arr": "12:30:00",
        "days": "3 Days/wk"
    },
    {
        "no": "90001",
        "name": "WDFC Heavy Haul Freight Express (Dadri - JNPT Mumbai)",
        "type": TrainType.GOODS,
        "tier": 4,
        "goods": True,
        "source": "NDLS",
        "dest": "MMCT",
        "dep": "02:00:00",
        "arr": "18:00:00",
        "days": "Daily"
    },
    {
        "no": "90002",
        "name": "FCI Golden Grain Freight Special (Ludhiana - Howrah)",
        "type": TrainType.GOODS,
        "tier": 4,
        "goods": True,
        "source": "LDH",
        "dest": "HWH",
        "dep": "03:30:00",
        "arr": "22:00:00",
        "days": "Daily"
    },
    {
        "no": "90003",
        "name": "NTPC Coal Rake Freight Express (Dhanbad - Dadri)",
        "type": TrainType.GOODS,
        "tier": 4,
        "goods": True,
        "source": "DHN",
        "dest": "NDLS",
        "dep": "01:00:00",
        "arr": "19:30:00",
        "days": "Daily"
    }
]


def seed_national_data():
    db = SessionLocal()
    stn_added = 0
    corr_added = 0
    sec_added = 0
    trn_added = 0

    try:
        # 1. Seed Stations
        station_map = {}
        # Existing stations
        for st in db.scalars(select(Station)).all():
            station_map[st.station_code] = st

        for s in NATIONAL_STATIONS:
            code = s["code"]
            if code not in station_map:
                st = Station(
                    station_code=code,
                    station_name=s["name"],
                    division=s["division"],
                    location=s["location"],
                    zone=s["zone"],
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                db.add(st)
                db.flush()
                station_map[code] = st
                stn_added += 1

        db.commit()
        print(f"✓ Stations seeded: {stn_added} new (Total in system: {len(station_map)})")

        # 2. Seed Corridors & Track Sections
        corridor_map = {}
        for c in db.scalars(select(Corridor)).all():
            corridor_map[c.corridor_code] = c

        existing_sections = {sec.section_code for sec in db.scalars(select(TrackSection)).all()}

        for corr_data in NATIONAL_CORRIDORS:
            c_code = corr_data["code"]
            if c_code not in corridor_map:
                corridor = Corridor(
                    corridor_code=c_code,
                    corridor_name=corr_data["name"],
                    division=corr_data["division"],
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                db.add(corridor)
                db.flush()
                corridor_map[c_code] = corridor
                corr_added += 1
            else:
                corridor = corridor_map[c_code]

            # Create corresponding TrackSection
            from_stn = station_map.get(corr_data["from_code"])
            to_stn = station_map.get(corr_data["to_code"])

            if from_stn and to_stn and c_code not in existing_sections:
                sec = TrackSection(
                    section_code=c_code,
                    corridor_id=corridor.id,
                    from_station_id=from_stn.id,
                    to_station_id=to_stn.id,
                    distance_km=corr_data["distance"],
                    track_type="DOUBLE",
                    electrified=True,
                    max_speed=corr_data["speed"],
                    traffic_level=TrafficLevel.HIGH,
                    criticality=AssetCriticality.CRITICAL,
                    line_type="MAIN_TRUNK",
                    rail_profile="60kg 90UTS",
                    sleeper_type="PSC-Sleepers",
                    fastening_system="Pandrol-eClip",
                    ballast_depth_mm=350,
                    gauge_mm=1676,
                    gradient_ratio="1 in 150",
                    curvature_degrees=0.8,
                    start_km_post=0.0,
                    end_km_post=corr_data["distance"],
                    traffic_load_gmt=42.5,
                    geo_division=corr_data["division"],
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                db.add(sec)
                existing_sections.add(c_code)
                sec_added += 1

        db.commit()
        print(f"✓ Corridors seeded: {corr_added} new (Total: {len(corridor_map)})")
        print(f"✓ Track Sections seeded: {sec_added} new (Total: {len(existing_sections)})")

        # 3. Seed Trains
        existing_trains = {t.train_number for t in db.scalars(select(Train)).all()}
        for tr in NATIONAL_TRAINS:
            t_num = tr["no"]
            if t_num not in existing_trains:
                t = Train(
                    train_number=t_num,
                    train_name=tr["name"],
                    train_type=tr["type"],
                    priority_tier=tr["tier"],
                    is_goods=tr["goods"],
                    source_station=tr["source"],
                    destination_station=tr["dest"],
                    departure_time=tr["dep"],
                    arrival_time=tr["arr"],
                    days_of_run=tr["days"],
                    status=TrainStatus.RUNNING,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                db.add(t)
                existing_trains.add(t_num)
                trn_added += 1

        db.commit()
        print(f"✓ Trains seeded: {trn_added} new (Total: {len(existing_trains)})")

        print("\n🎉 National Indian Railways network successfully seeded into backend!")

    except Exception as e:
        print(f"Error seeding national data: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_national_data()
