import json
import string
from get_instruction import get_instruction
from create_yaml_data import create_yaml, create_data
from get_pitch_report_context import get_pitch_report_context

create_yaml("content_calendar_generation", "Answer should be the content calendar.", "Content Calendar.")

instruction = get_instruction()
context = get_pitch_report_context()
context_str = json.dumps(context)

content = {
    "input": (
        f"\n"
        f"[Context]: {context_str}"
        f"[Instruction]: {instruction['content_calendar']}.\n"
    ),
    "ideal": ""
}
registry_data = json.dumps(content)
create_data("content_calendar_generation", registry_data)