import re
path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\main.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update the 'View Board' button to call the new modal
text = text.replace(
    '''<button style="background:transparent;border:1px solid #60a5fa;color:#60a5fa;border-radius:4px;padding:2px 8px;font-size:11px;cursor:pointer" onclick="showToast('Loading live timetable for ${s.code}…')">View Board</button>''',
    '''<button style="background:#3b82f6;border:1px solid #3b82f6;color:white;border-radius:4px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer" onclick="showStationLiveBoard('${s.code}')">View Live Board</button>'''
)

# 2. Add padding to the grid
text = text.replace(
    '''<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">''',
    '''<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;padding-bottom:120px;">'''
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Stations Master page HTML.')
