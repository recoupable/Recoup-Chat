import json
import string
from get_instruction import get_instruction
from create_yaml_data import create_yaml, create_data
from get_pitch_report_context import get_pitch_report_context

create_yaml("pitch_report_generation", "Answer should be the HTML formatted report.", "Pitch HTML Report.")

instruction = get_instruction()
context = get_pitch_report_context()
context_str = json.dumps(context)

content = {
    "input": (
        f"\n"
        f"[Context]: {context_str}"
        f"[Instruction]: {instruction['get_pitch_report']}.\n"
        f"Please create a pitch HTML report if the pitch name is Logic Pro."
    ),
    "ideal": ""
}
registry_data = json.dumps(content)
create_data("pitch_report_generation", registry_data)