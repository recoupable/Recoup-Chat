import json
import string
from get_instruction import get_instruction
from create_yaml_data import create_yaml, create_data

create_yaml("pitch_question_tool_trigger", "Answer should include ideal values.", "Trigger evaluation of questions related to pitch reports.")

instruction = get_instruction()
content = {
    "input": (
        f"\n"
        f"[Instruction]: {instruction['pitch_report_trigger']}\n\n\n"
        f"[Question List]:\n"
        f"1.How can I best pitch Logic Pro?\n"
        f"2.What is the listening habits?\n"
        f"3.Analyze a tiktok account.\n"
        f"4.Write Celebrity Relationship Commentators Pitch.\n\n\n"
        f"Based on instruction, I will evaluate the tool triggers according to the instructions.\n"
        f"Please tell us which questions from the list of questions can trigger this tool.\n"
        f"Please answer in the following format: [Full question sentence]: [Pitch name]"
    ),
    "ideal": "Logic Pro, Celebrity Relationship Commentators"
}
registry_data = json.dumps(content)
create_data("pitch_question_tool_trigger", registry_data)