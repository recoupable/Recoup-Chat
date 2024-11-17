import json
import os
import string
from create_yaml_data import create_yaml, create_data
from create_general_campaign_registry_data import create_general_campaign_registry_data

CURRENT_DIR = os.path.dirname(__file__)
FILE_PATH = os.path.join(CURRENT_DIR, "evals_questions_ideals/general_campaign_evals_questions_ideals.json")

with open(FILE_PATH, 'r') as file:
    evals_questions_ideals = json.load(file) 

for item in evals_questions_ideals:
    question = item["question"]
    ideal = item["ideal"]
    eval_name = item["eval_name"]
    criteria = item["criteria"]

    create_yaml(eval_name, criteria)
    registry_data = create_general_campaign_registry_data(ideal, question)
    create_data(eval_name, registry_data)