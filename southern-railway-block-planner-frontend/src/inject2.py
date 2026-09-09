import re

path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\main.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

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
    text = text.replace('map.flyToBounds(L.latLngBounds(active.coords), { padding: [30, 30], duration: 0.8 });', render_logic + '\n  map.flyToBounds(L.latLngBounds(active.coords), { padding: [30, 30], duration: 0.8 });')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Injected map asset rendering.")
else:
    print("Already injected.")
