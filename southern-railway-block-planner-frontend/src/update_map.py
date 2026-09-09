import re
path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\main.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'(const line = L\.polyline\(c\.coords, \{\s*color: c\.color,\s*weight: isActive \? )(\d+)( : )(\d+)(,\s*opacity: isActive \? )([\d\.]+)( : )([\d\.]+)(,\s*dashArray: isActive \? null : \x22\d+,\d+\x22)(\s*\})'

def repl(m):
    return m.group(1) + '6' + m.group(3) + '3' + m.group(5) + '1.0' + m.group(7) + '0.4' + m.group(9) + r', className: isActive ? "corridor-active-glow" : ""' + m.group(10)

text = re.sub(pattern, repl, text)

# Add mock blocks to the corridor map
blocks_render = '''
    // Render Maintenance Block Nodes
    if (isActive && c.blocks && c.blocks.live > 0) {
      c.coords.forEach((coord, i) => {
        if (i % 2 === 1) {
          const blHtml = `<div style="width:16px;height:16px;background:rgba(239,68,68,0.2);border:2px solid #ef4444;border-radius:3px;box-shadow:0 0 10px #ef4444;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" style="width:10px;height:10px;stroke:#ef4444;fill:none;stroke-width:3"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>`;
          L.marker(coord, { icon: L.divIcon({ html: blHtml, className: "", iconSize: [16,16], iconAnchor: [8,8] }) }).addTo(map)
           .bindPopup(`<div style="font-size:12px"><b>Live Block</b><br>Track Maintenance in progress</div>`);
        }
      });
    }
'''

if 'Render Maintenance Block Nodes' not in text:
    text = text.replace('map.flyToBounds(L.latLngBounds(active.coords), { padding: [30, 30], duration: 0.8 });', blocks_render + '\n    map.flyToBounds(L.latLngBounds(active.coords), { padding: [30, 30], duration: 0.8 });')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated main.js with corridor map enhancements')
