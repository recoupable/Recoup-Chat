import json
import string
from get_instruction import get_instruction
from get_tiktok_demo_context import get_demo_comments

def create_tiktok_vi_comments_registry_data(ideal_key_or_value, question):
    registry_data = ""
    instruction = get_instruction()
    data = get_demo_comments()
    fans_comments = {
        "comments": data[0:10],
        "total_video_comments_count": len(data)
    }
    if data != None:
        context_str = json.dumps(fans_comments)
    else:
        context_str = "No context available."

    ideal_value = fans_comments.get(ideal_key_or_value, ideal_key_or_value)
    ideal_value_str = json.dumps(ideal_value) if isinstance(ideal_value, (dict, list)) else ideal_value

    content = {
        "input": (
            f"\n"
            f"Context: {context_str}\n\n"
            f"Question: ${question}\n\n"
            f"{instruction['get_tiktok_video_comments']}"
        ),
        "ideal": ideal_value_str
    }

    registry_data += json.dumps(content) + "\n"
        
    return registry_data