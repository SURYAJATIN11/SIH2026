import sys
import os
import ast

def extract_fields(filepath):
    with open(filepath, 'r') as f:
        tree = ast.parse(f.read())
    
    classes = {}
    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            fields = []
            for item in node.body:
                if isinstance(item, ast.AnnAssign) and isinstance(item.target, ast.Name):
                    fields.append(item.target.id)
            classes[node.name] = fields
    return classes

models_dir = 'app/models'
for f in os.listdir(models_dir):
    if f.endswith('.py') and f != '__init__.py':
        path = os.path.join(models_dir, f)
        res = extract_fields(path)
        for cls, fields in res.items():
            if fields:
                print(f"{cls}: {fields}")
