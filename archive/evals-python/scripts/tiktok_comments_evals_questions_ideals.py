from criteria import count_query_criteria, tiktok_analysis_criteria

evals_questions_ideals = [
    {
        "eval_name": "get_tiktok_video_comments_count",
        "question": "How many comments does this video have?",
        "ideal": "total_video_comments_count",
        "criteria": count_query_criteria
    }
]