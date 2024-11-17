import os
from supabase import create_client

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

def limit_collection(collection, limit=20):
    if collection is None:
        return []
    return collection[:limit]

def get_context(artist_id, email):
    response = supabase.rpc('get_campaign', {'artistid': artist_id, 'email': email, 'clientid': ''}).execute()
    campaign = response.data
    premium_count = len([fan for fan in campaign.get("fans", []) if fan.get("product") == "premium"])
    free_count = len([fan for fan in campaign.get("fans", []) if fan.get("product") == "free"])
   
    return {
        "tracks": limit_collection(campaign.get("tracks", [])),
        "artists": limit_collection(campaign.get("artists", [])),
        "playlists": limit_collection(campaign.get("playlists", [])),
        "albums": limit_collection(campaign.get("albums", [])),
        "audioBooks": limit_collection(campaign.get("audio_books", [])),
        "episodes": limit_collection(campaign.get("episodes", [])),
        "shows": limit_collection(campaign.get("shows", [])),
        "premium_fans_count": premium_count,
        "free_fans_count": free_count,
        "total_unique_fans_count": len(campaign.get("fans", [])),
        "fans": limit_collection(campaign.get('fans', []), 100)
    }