import re

path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\main.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Define the assets array
assets_js = '''
const SR_INFRA_ASSETS = [
  { type: 'locoshed', name: 'Erode Electric Loco Shed', lat: 11.3385, lng: 77.7274, history: [{date: '2023-11', desc: 'Major overhaul of WAP-4 fleet'}, {date: '2020-04', desc: 'Capacity expansion to 200 locos'}, {date: '1980', desc: 'Commissioned'}] },
  { type: 'locoshed', name: 'Royapuram Electric Loco Shed', lat: 13.1118, lng: 80.2934, history: [{date: '2024-01', desc: 'Three-phase loco maintenance bay opened'}, {date: '2005', desc: 'Converted to Electric Shed'}, {date: '1856', desc: 'Original station built'}] },
  { type: 'locoshed', name: 'Ernakulam Diesel Shed', lat: 9.9658, lng: 76.2974, history: [{date: '2022-09', desc: 'Started maintaining WDP-4D locos'}, {date: '1981', desc: 'Shed established'}] },
  { type: 'locoshed', name: 'Golden Rock Loco Shed (GOC)', lat: 10.7745, lng: 78.7061, history: [{date: '2023', desc: 'Heritage loco restoration completed'}, {date: '1928', desc: 'Workshop established'}] },
  { type: 'depot', name: 'Perambur Carriage Works', lat: 13.1023, lng: 80.2372, history: [{date: '2023-08', desc: 'LHB coach periodic overhaul facility inaugurated'}, {date: '1932', desc: 'Established as principal workshop'}] },
  { type: 'depot', name: 'Basin Bridge Train Care Centre', lat: 13.0975, lng: 80.2742, history: [{date: '2024-02', desc: 'Automatic coach washing plant installed'}, {date: '2019', desc: 'Vande Bharat maintenance pit upgraded'}] },
  { type: 'yard', name: 'Jolarpettai Marshalling Yard', lat: 12.5647, lng: 78.5630, history: [{date: '2023-10', desc: 'Yard remodeling completed, speed restricted relaxed'}, {date: '2018', desc: 'RRI (Route Relay Interlocking) upgraded'}] },
  { type: 'yard', name: 'Tondiarpet Marshalling Yard', lat: 13.1311, lng: 80.2882, history: [{date: '2022-05', desc: 'Freight terminal mechanization'}, {date: '1990', desc: 'Primary freight sorting for Chennai Port'}] },
  { type: 'goods', name: 'Coimbatore North Goods Shed', lat: 11.0253, lng: 76.9535, history: [{date: '2024-01', desc: 'New cement handling platform added'}, {date: '2021', desc: 'Night handling facilities installed'}] },
  { type: 'bridge', name: 'Pamban Railway Bridge', lat: 9.2818, lng: 79.2066, history: [{date: '2024', desc: 'New vertical lift bridge nearing completion'}, {date: '1964', desc: 'Rebuilt in 46 days after cyclone'}, {date: '1914', desc: 'Original cantilever bridge opened'}] },
  { type: 'bridge', name: 'Vembanad Rail Bridge', lat: 10.0135, lng: 76.2625, history: [{date: '2023', desc: 'Structural integrity audit passed'}, {date: '2011', desc: 'Longest rail bridge in India (4.62km) opened'}] },
  { type: 'bridge', name: 'Cauvery Railway Bridge', lat: 10.8407, lng: 78.6922, history: [{date: '2021', desc: 'Pier strengthening works'}, {date: '1935', desc: 'Bridge reconstructed'}] },
  { type: 'maintenance', name: 'Track Renewal Block (Salem-Erode)', lat: 11.5173, lng: 77.9404, history: [{date: 'Currently Active', desc: 'Deep screening of ballast'}, {date: 'Last Week', desc: 'Sleeper replacement completed'}] },
  { type: 'maintenance', name: 'USFD Flaw Detection (TVC-QLN)', lat: 8.7183, lng: 76.7743, history: [{date: 'Currently Active', desc: 'Ultrasonic testing of welds'}, {date: '2024-01', desc: 'Minor fracture repaired'}] }
];
'''

if 'const SR_INFRA_ASSETS' not in text:
    text = text.replace('function initCorridorMap() {', assets_js + '\nfunction initCorridorMap() {')

# Now inject the rendering logic inside initCorridorMap
render_logic = '''
  // RENDER INFRASTRUCTURE ASSETS
  SR_INFRA_ASSETS.forEach(asset => {
    let iconHtml = "";
    let color = "#fff";
    if (asset.type === 'locoshed') {
      color = "#f59e0b"; // amber
      iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M4 15V9a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6M3 15h18M6 15v4M18 15v4M9 15v-4M15 15v-4"/></svg>`;
    } else if (asset.type === 'depot') {
      color = "#8b5cf6"; // purple
      iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    } else if (asset.type === 'yard' || asset.type === 'goods') {
      color = "#eab308"; // yellow
      iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`;
    } else if (asset.type === 'bridge') {
      color = "#06b6d4"; // cyan
      iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="M22 10v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4M2 10h20M7 16v4M17 16v4M10 10l-2-6M14 10l2-6"/></svg>`;
    } else if (asset.type === 'maintenance') {
      color = "#ef4444"; // red
      iconHtml = `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    }

    const cssClass = asset.type === 'maintenance' ? 'corridor-active-glow' : '';
    const style = `width:24px;height:24px;background:rgba(15,23,42,0.8);border:2px solid ${color};border-radius:4px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 8px ${color}`;
    
    const divIcon = L.divIcon({
      html: `<div style="${style}" class="${cssClass}">${iconHtml}</div>`,
      className: "",
      iconSize: [24,24],
      iconAnchor: [12,12]
    });

    const historyHtml = asset.history.map(h => `<div style="margin-bottom:6px;border-left:2px solid ${color};padding-left:8px">
      <div style="font-size:10px;color:var(--text-muted);font-weight:bold">${h.date}</div>
      <div style="font-size:12px;color:#fff">${h.desc}</div>
    </div>`).join('');

    const popupHtml = `
      <div style="min-width:220px;background:var(--bg-surface);padding:4px">
        <h4 style="margin:0 0 4px 0;color:${color}">${asset.name}</h4>
        <span style="font-size:10px;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:12px;letter-spacing:1px">${asset.type}</span>
        <div style="max-height:200px;overflow-y:auto;padding-right:4px">
          ${historyHtml}
        </div>
      </div>
    `;

    L.marker([asset.lat, asset.lng], { icon: divIcon })
      .addTo(map)
      .bindPopup(popupHtml, { closeButton: false, className: 'dark-popup' });
  });
'''

if 'RENDER INFRASTRUCTURE ASSETS' not in text:
    # Let's find map.fitBounds
    text = text.replace('map.fitBounds(bounds, { padding: [20, 20] });', render_logic + '\n  map.fitBounds(bounds, { padding: [20, 20] });')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

# We should also add CSS for .dark-popup to make sure the popup background looks good
css_append = '''
/* Dark Popup for Corridor Assets */
.dark-popup .leaflet-popup-content-wrapper,
.dark-popup .leaflet-popup-tip {
  background: var(--bg-surface) !important;
  color: #fff !important;
  border: 1px solid var(--border) !important;
  box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
}
'''
path_css = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\styles.css'
with open(path_css, 'a', encoding='utf-8') as f:
    f.write(css_append)

print("Injected Corridor Assets logic successfully.")
