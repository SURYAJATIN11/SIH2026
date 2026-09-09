import re

path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\timetable_data.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

if '"code": "CBE"' not in text:
    cbe_station = '''  {
    "code": "CBE",
    "name": "Coimbatore Jn",
    "div": "Salem (SA)",
    "lat": 10.9996,
    "lng": 76.9637,
    "platforms": 6,
    "hub": true,
    "dailyTrains": 95
  },'''
    text = text.replace('export const REAL_STATIONS_30 = [', 'export const REAL_STATIONS_30 = [\n' + cbe_station)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print('Injected CBE into REAL_STATIONS_30.')
else:
    print('CBE is already present.')
