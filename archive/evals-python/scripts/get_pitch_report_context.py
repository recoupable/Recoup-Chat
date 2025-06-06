import requests
from consts import api_endpoint

def get_pitch_report_context():
    response = requests.get(f"{api_endpoint}/api/funnel_analysis?chatId=ef4a26fc-e913-4c5a-8227-bf01219b2678")
    data = response.json()

    analysis = data['data']

    all_comments = []
    all_segments = []
    for item in analysis:
        if "funnel_analytics_segments" in item:
            for segment in item["funnel_analytics_segments"]:
                all_segments.append(segment)
        if "funnel_analytics_comments" in item:
            for comment in item["funnel_analytics_comments"]:
                all_comments.append(comment)


    return {
        "segments": all_segments,
        "comments": all_comments[:100]
    }