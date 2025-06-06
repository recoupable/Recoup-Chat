import json
import string
from get_instruction import get_instruction
from create_yaml_data import create_yaml, create_data
from get_pitch_report_context import get_pitch_report_context

create_yaml("instrumental_style_suggestion", "", "Instrumental Style Suggestion.")

instruction = get_instruction()
context = get_pitch_report_context()
context_str = json.dumps(context)

content = {
    "input": (
        f"\n"
        f"[Context]: {context_str}"
        f"[Instruction]: {instruction['instrumental_style_suggestion']}.\n"
        f"Make suggestions for instrumental styles based on my audiences existing work"
    ),
    "ideal": ""
}
registry_data = json.dumps(content)
create_data("instrumental_style_suggestion", registry_data)