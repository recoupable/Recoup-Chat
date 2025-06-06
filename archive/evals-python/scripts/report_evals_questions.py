from criteria import segments_report_criteria, segments_report_summary_criteria

evals_questions_ideals = [
    {
        "eval_name": "get_segments_report",
        "question": "Please, create a fan segment report.",
        "ideal": "",
        "criteria": segments_report_criteria,
        "instruction": "get_segements_report"
    },
    {
        "eval_name": "get_segments_report_summary",
        "question": "Please, create a fan segment report summary.",
        "ideal": "",
        "criteria": segments_report_summary_criteria,
        "instruction": "get_segments_report_summary"
    }
]