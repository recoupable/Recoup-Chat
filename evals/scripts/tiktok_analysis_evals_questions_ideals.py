from criteria import tiktok_analysis_criteria, fan_segments_criteria

evals_questions_ideals = [
    {
        "eval_name": "get_tiktok_analysis",
        "question": "Analyze a tiktok account? username is officialluhtyler",
        "ideal": "",
        "criteria": tiktok_analysis_criteria,
        "instruction": "get_tiktok_analysis"
    },
    {
        "eval_name": "get_tiktok_analysis",
        "question": "officialluhtyler's fans segments list",
        "ideal": "",
        "criteria": fan_segments_criteria,
        "instruction": "get_fan_segments"
    }
]