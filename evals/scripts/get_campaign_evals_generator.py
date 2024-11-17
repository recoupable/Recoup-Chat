import json
import os
from create_yaml_data import create_yaml, create_data
from create_campaign_registry_data import create_campaign_registry_data

CURRENT_DIR = os.path.dirname(__file__)
FILE_PATH = os.path.join(CURRENT_DIR, "evals_questions_ideals/campaign_evals_questions_ideals.json")

with open(FILE_PATH, 'r') as file:
    evals_questions_ideals = json.load(file) 

for item in evals_questions_ideals:
    question = item["question"]
    ideal = item["ideal"]
    eval_name = item["eval_name"]

    create_yaml(eval_name, "The answer should be numerically correct and include appropriate units (if applicable). The solution should match exactly with the reference answer.")
    registry_data = create_campaign_registry_data(ideal, question)
    create_data(eval_name, registry_data)