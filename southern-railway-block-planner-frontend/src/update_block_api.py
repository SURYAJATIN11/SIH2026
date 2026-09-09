import re

path = r'e:\OneDrive\Desktop\SIH 2026\southern-railway-block-planner-frontend\src\main.js'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace block button logic
old_block_logic = r'btnCreateBlock\.onclick = \(\) => \{\n\s*showToast\("Opening Integrated Block Creation Workflow\."\);\n\s*\};'
new_block_logic = '''btnCreateBlock.onclick = () => {
      showModal('Create Block Plan', 'Submit a plan request to the backend API', 
      `<label style="margin-bottom:8px;display:block;">Track Section ID<input id="blkSectionId" placeholder="e.g. SEC-MAS-KPD" style="width:100%;margin-top:4px;" /></label>
       <label style="display:block;">Duration (mins)<input type="number" id="blkDuration" value="120" style="width:100%;margin-top:4px;" /></label>`, 
      async () => {
        try {
          const req = { 
            track_section_id: document.getElementById('blkSectionId').value || 'SEC-01', 
            requested_duration_mins: parseInt(document.getElementById('blkDuration').value) || 120, 
            dependencies: [] 
          };
          await api.post('/api/v1/planning/plan', req);
          showToast('Block Plan created via API successfully!');
        } catch (e) { 
          showToast('API Error: ' + e.message, true); 
        }
      }, 'Submit Plan');
    };'''

text = re.sub(old_block_logic, new_block_logic, text)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Block logic injected successfully")
