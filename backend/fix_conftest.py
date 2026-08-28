with open("app/tests/conftest.py", "r") as f:
    data = f.read()

# Replace section_id with track_section_id
data = data.replace("section_id=sample_section.id,", "track_section_id=sample_section.id,")
data = data.replace("section_id=sample_section.id", "track_section_id=sample_section.id")

# Missing fields for train
data = data.replace("days_of_run=\"ALL\",", "days_of_run=\"ALL\", departure_time=\"10:00:00\", arrival_time=\"20:00:00\",")
data = data.replace("is_current=True", "is_current=True, change_reason='test'")
data = data.replace('conflict_type="TRAIN"', 'conflict_type="TRAIN", description="test", severity="HIGH"')

with open("app/tests/conftest.py", "w") as f:
    f.write(data)

with open("app/tests/test_models.py", "r") as f:
    data_models = f.read()

data_models = data_models.replace("is_current=True", "is_current=True, change_reason='test'")
data_models = data_models.replace('conflict_type="TRAIN"', 'conflict_type="TRAIN", description="test", severity="HIGH"')
data_models = data_models.replace('inspection_mode="FOOT"', 'inspection_mode="FOOT", rail_temperature_celsius=30.0, ride_quality_index=1.0')

with open("app/tests/test_models.py", "w") as f:
    f.write(data_models)

