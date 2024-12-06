import os
from typing import List, Optional
from supabase import create_client

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

def get_streams_count(artist_id, email):
    client_ids: List[str] = []

    if artist_id:
        response = supabase.table("campaigns").select("*").eq("artistId", artist_id).execute()
        data = response.data
        if data:
            client_ids.append(data[0]['clientId'])
    else:
        response = supabase.table("accounts").select("*").eq("email", email).execute()
        data = response.data
        
        if data:
            artist_ids = data[0]['artistIds']
            campaigns_response = supabase.table("campaigns").select("*").in_("artistId", artist_ids).execute()
            campaigns = campaigns_response.data
            
            if campaigns:
                client_ids = [campaign['clientId'] for campaign in campaigns]

    spotify_response = supabase.table("spotify_play_button_clicked").select("*", count="exact").in_("clientId", client_ids).execute()
    spotify_count = spotify_response.count

    apple_response = supabase.table("apple_play_button_clicked").select("*", count="exact").in_("clientId", client_ids).execute()
    apple_count = apple_response.count

    return (spotify_count or 0) + (apple_count or 0)