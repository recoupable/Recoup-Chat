import json
import string
from get_instruction import get_instruction
from create_yaml_data import create_yaml, create_data
from get_pitch_report_context import get_pitch_report_context

create_yaml("instrumental_suggestion_trigger", "Answer should be equal to the ideal value in terms of meaning.", "Trigger evaluation of questions related to instrumental styles.")

instruction = get_instruction()
context = get_pitch_report_context()
context_str = json.dumps(context)

content = {
    "input": (
        f"\n"
        f"[Instruction]: {instruction['instrumental_style_trigger']}\n\n\n"
        f"[Question List]:\n"
        f"1.How can I best pitch Logic Pro?\n"
        f"2.What is the listening habits?\n"
        f"3.Analyze a tiktok account.\n"
        f"4.Write Celebrity Relationship Commentators Pitch.\n\n\n"
        f"5.Make suggestions for instrumental styles based on my audiences existing work."
        f"Based on instruction, I will evaluate the tool triggers according to the instructions.\n"
        f"Please tell us which questions from the list of questions can trigger this tool.\n"
    ),
    "ideal": "Make suggestions for instrumental styles based on my audiences existing work."
}
registry_data = json.dumps(content)
create_data("instrumental_suggestion_trigger", registry_data)