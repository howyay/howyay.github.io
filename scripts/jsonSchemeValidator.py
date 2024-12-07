from jsonschema import validate
from yaml import safe_load, dump
import sys

def validate_yaml(schema_file, yaml_file):
    with open(yaml_file, 'r') as f:
        data = safe_load(f)
    with open(schema_file, 'r') as f:
        schema = safe_load(f)
    validate(data, schema)

print(sys.argv[1], sys.argv[2])
validate_yaml(sys.argv[1], sys.argv[2])
