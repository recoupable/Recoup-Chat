import json
import string
import requests
from get_instruction import get_instruction
from consts import mock_data, api_endpoint

def create_campaign_registry_data(ideal_key_or_value, question):
    registry_data = ""

    for artist_id, email in mock_data:
        url = f"{api_endpoint}/api/get_campaign?email={email}&artistId={artist_id}"
        response = requests.get(url)
        data = response.json()
        instruction = get_instruction()

        if data['data']:
            context = {
                **data['data'],
                "fans": data["data"]["fans"][:100]
            }
            context_str = json.dumps(context)
        else:
            context_str = "No context available."

        ideal_value = data['data'].get(ideal_key_or_value, ideal_key_or_value)
        ideal_value_str = json.dumps(ideal_value) if isinstance(ideal_value, (dict, list)) else ideal_value

        content = {
            "input": (
                f"\n"
                f"*****\n"
                f"[Context]: {context_str}\n"
                f"*****\n"
                f"[Question]: {question}\n\n"
                f"*****\n"
                f"[Instruction]: {json.dumps(instruction['get_campaign'])}"
            ),
            "ideal": ideal_value_str,
        }
        
        registry_data += json.dumps(content) + "\n"

    return registry_data