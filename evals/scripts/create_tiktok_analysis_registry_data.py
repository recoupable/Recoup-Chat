import json
import string
from get_instruction import get_instruction
from get_tiktok_demo_context import get_demo_comments, get_demo_profile

def create_tiktok_analysis_registry_data(ideal_key_or_value, instruction_key, question):
    registry_data = ""
    instruction = get_instruction()

    videos_comments = get_demo_comments()
    profile = get_demo_profile()

    profile_with_fans_comments = {
        **profile,
        "videos": videos_comments["videos"],
        "total_video_comments_count": videos_comments["total_video_comments_count"]
    }
    context_str = json.dumps(profile_with_fans_comments)

    ideal_value = profile_with_fans_comments.get(ideal_key_or_value, ideal_key_or_value)
    ideal_value_str = json.dumps(ideal_value) if isinstance(ideal_value, (dict, list)) else ideal_value

    content = {
        "input": (
            f"\n"
            f"Context: {context_str}\n\n"
            f"Question: ${question}\n\n"
            f"{instruction[instruction_key]}"
        ),
        "ideal": ideal_value_str
    }

    registry_data += json.dumps(content) + "\n"
        
    return registry_data