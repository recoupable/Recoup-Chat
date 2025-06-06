import requests
from consts import agent_endpoint

def get_demo_comments():
    response = requests.get(f"{agent_endpoint}/api/get_dataset_items?datasetId=lHul8Z9l1ybBIXweG")
    data = response.json()
    if len(data['data']) > 0:
        return data['data']
    else:
        return None

def get_demo_profile():
    response = requests.get(f"{agent_endpoint}/api/get_dataset_items?datasetId=B6lBIpd8gQqbYCg39")
    data = response.json()
    if data['data']:
        return data['data'][0]
    else:
        return None