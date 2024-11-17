import json
import string
import requests
from get_context import get_context
from get_instruction import get_instruction
from mock_data import mock_data

def create_general_campaign_registry_data(ideal_key_or_value, question):
    registry_data = ""

    for artist_id, email in mock_data:
        url = f"https://chat.recoupable.com/api/get_campaign_general_info?email={email}&artistId={artist_id}"
        response = requests.get(url)
        data = response.json()
        if data['data']['context']:
            context_str = data['data']['context']
        else:
            context_str = "No context available."
        ideal_value = data['data'].get(ideal_key_or_value, ideal_key_or_value)
        content = {
            "input": (
                f"\n"
                f"Context: {context_str}\n\n"
                f"Question: ${question}\n\n"
            ),
            "ideal": ideal_value
        }

        registry_data += json.dumps(content) + "\n"
        
    return registry_data