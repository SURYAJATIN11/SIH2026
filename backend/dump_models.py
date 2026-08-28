import inspect
from sqlalchemy.orm import class_mapper
import app.models as models
from app.database.base import Base

def get_columns(model):
    mapper = class_mapper(model)
    return [prop.key for prop in mapper.iterate_properties]

for name, obj in inspect.getmembers(models):
    if inspect.isclass(obj) and issubclass(obj, Base) and obj != Base:
        print(f"Model: {name}")
        try:
            print("  Fields:", get_columns(obj))
        except Exception as e:
            print(f"  Error: {e}")
