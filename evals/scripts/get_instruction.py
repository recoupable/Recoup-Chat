import json
import os

CURRENT_DIR = os.path.dirname(__file__)
INSTRUCTION_FILE_PATH = os.path.join(CURRENT_DIR, "instructions.json")

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def get_instruction():
    instruction = load_json(INSTRUCTION_FILE_PATH)
    return instruction