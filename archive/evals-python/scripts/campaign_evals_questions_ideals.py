from criteria import count_query_criteria, format_match_criteria, subset_criteria

evals_questions_ideals = [
    {
        "question": "What is the email count for users with an Apple Music account?",
        "ideal": "Due to Apple's policy, we do not collect Apple Music emails.",
        "eval_name": "get_email_count_of_apple",
        "criteria": "The main points explained in the reference answer and the actual answer should be the same."
    },
    {
        "question": "What is the total number of fans with a premium Spotify account?",
        "ideal": "premium_spotify_fans_count",
        "eval_name": "get_premium_fans",
        "criteria": count_query_criteria
    },
    {
        "question": "How many fans have a free Spotify account??",
        "ideal": "free_spotify_fans_count",
        "eval_name": "get_free_spotify_fans",
        "criteria": count_query_criteria
    },
    {
        "question": "How many unique fans have participated in this campaign?",
        "ideal": "total_unique_fans_count",
        "eval_name": "get_total_unique_fans",
        "criteria": count_query_criteria
    },
    {
        "question": "What are the top five artists that fans are listening to on aggregate?",
        "ideal": "artists",
        "eval_name": "get_top_five_artist",
        "criteria": subset_criteria
    },
    {
        "question": "What are the top five playlists among users?",
        "ideal": "playlists",
        "eval_name": "get_top_five_playlists",
        "criteria": subset_criteria
    },
    {
        "question": "How many total playlists are fans engaging with?",
        "ideal": "playlists_count",
        "eval_name": "get_playlists_count",
        "criteria": count_query_criteria
    },
    {
        "question": "What are the top three genres that fans listen to outside of hip hop?",
        "ideal": "genres",
        "eval_name": "get_top_genres",
        "criteria": subset_criteria
       
    },
    {
        "question": "What is the country distribution of fans?",
        "ideal": "Example: \n• US\n\t• Premium: 12\n\t• Free: 11",
        "eval_name": "get_country_distribution",
        "criteria": format_match_criteria
    },
    {
        "question": "How many fans logged in with Spotify to participate in this campaign?",
        "ideal": "spotify_fans_count",
        "eval_name": "get_spotify_fans_count",
        "criteria": count_query_criteria
    },
    {
        "question": "What is the breakdown of Spotify premium versus free users by country?",
        "ideal": "Example: \n• US\n\t• Premium: 12\n\t• Free: 11",
        "eval_name": "get_breakdown_premium_vs_free",
        "criteria": format_match_criteria
    },
    {
        "question": "What are the top podcasts fans are listening to?",
        "ideal": "episodes",
        "eval_name": "get_top_podcasts",
        "criteria": subset_criteria
    },
    {
        "question": "What are the most common podcast genres among fans?",
        "ideal": "",
        "eval_name": "get_common_podcasts_genres",
        "criteria": "answer should be the list of genre list."
    },
    {
        "question": "How many fans have listened to this artist's top song in the last month?",
        "ideal": "artist_top_song_fans_listening_count",
        "eval_name": "get_fans_listening_top_song",
        "criteria": count_query_criteria
    },
    {
        "eval_name": "get_average_streams_count",
        "question": "How many times has the average fan streamed the campaign song?",
        "ideal": "average_fan_streamed_count",
        "criteria": count_query_criteria
    },
    {
        "eval_name": "get_total_streams_count",
        "question": "What is the number of total streams generated from the campaign?",
        "ideal": "total_streams_generated_count",
        "criteria": count_query_criteria
    }
]