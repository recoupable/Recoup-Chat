export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_artist_ids: {
        Row: {
          account_id: string | null
          artist_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          artist_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          artist_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_artist_ids_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_artist_ids_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_emails: {
        Row: {
          account_id: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_info: {
        Row: {
          account_id: string | null
          id: string
          image: string | null
          instruction: string | null
          knowledges: Json | null
          label: string | null
          organization: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          id?: string
          image?: string | null
          instruction?: string | null
          knowledges?: Json | null
          label?: string | null
          organization?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          id?: string
          image?: string | null
          instruction?: string | null
          knowledges?: Json | null
          label?: string | null
          organization?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_info_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_phone_numbers: {
        Row: {
          account_id: string
          id: string
          phone_number: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          id?: string
          phone_number: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          id?: string
          phone_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_phone_numbers_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      account_socials: {
        Row: {
          account_id: string | null
          id: string
          social_id: string
        }
        Insert: {
          account_id?: string | null
          id?: string
          social_id?: string
        }
        Update: {
          account_id?: string | null
          id?: string
          social_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_socials_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_socials_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          id: string
          name: string | null
          timestamp: number | null
        }
        Insert: {
          id?: string
          name?: string | null
          timestamp?: number | null
        }
        Update: {
          id?: string
          name?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      accounts_memberships: {
        Row: {
          account_id: string
          account_role: string
          created_at: string
          created_by: string | null
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          account_id: string
          account_role: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          account_id?: string
          account_role?: string
          created_at?: string
          created_by?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_role_fkey"
            columns: ["account_role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      agent_status: {
        Row: {
          agent_id: string
          id: string
          progress: number | null
          social_id: string
          status: number | null
          updated_at: string
        }
        Insert: {
          agent_id?: string
          id?: string
          progress?: number | null
          social_id: string
          status?: number | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          id?: string
          progress?: number | null
          social_id?: string
          status?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_status_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_status_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          id: string
          updated_at: string
        }
        Insert: {
          id?: string
          updated_at?: string
        }
        Update: {
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_store_link_clicked: {
        Row: {
          clientId: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          clientId?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          clientId?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      apple_login_button_clicked: {
        Row: {
          campaignId: string | null
          clientId: string | null
          fanId: string | null
          game: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "apple_login_button_clicked_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      apple_music: {
        Row: {
          fanId: string | null
          game: string | null
          id: string | null
          syncid: string | null
          syncId: string | null
          timestamp: number | null
        }
        Insert: {
          fanId?: string | null
          game?: string | null
          id?: string | null
          syncid?: string | null
          syncId?: string | null
          timestamp?: number | null
        }
        Update: {
          fanId?: string | null
          game?: string | null
          id?: string | null
          syncid?: string | null
          syncId?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      apple_play_button_clicked: {
        Row: {
          appleId: string | null
          campaignId: string | null
          clientId: string | null
          fanId: string | null
          game: string | null
          id: string
          timestamp: number | null
        }
        Insert: {
          appleId?: string | null
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string
          timestamp?: number | null
        }
        Update: {
          appleId?: string | null
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string
          timestamp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "apple_play_button_clicked_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_fan_segment: {
        Row: {
          artist_social_id: string | null
          fan_social_id: string | null
          id: string
          segment_name: string | null
          updated_at: string
        }
        Insert: {
          artist_social_id?: string | null
          fan_social_id?: string | null
          id?: string
          segment_name?: string | null
          updated_at?: string
        }
        Update: {
          artist_social_id?: string | null
          fan_social_id?: string | null
          id?: string
          segment_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_fan_segment_artist_social_id_fkey"
            columns: ["artist_social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_fan_segment_fan_social_id_fkey"
            columns: ["fan_social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_segments: {
        Row: {
          artist_account_id: string
          id: string
          segment_id: string
          updated_at: string | null
        }
        Insert: {
          artist_account_id: string
          id?: string
          segment_id: string
          updated_at?: string | null
        }
        Update: {
          artist_account_id?: string
          id?: string
          segment_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_segments_artist_account_id_fkey"
            columns: ["artist_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_customers: {
        Row: {
          account_id: string
          customer_id: string
          email: string | null
          id: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Insert: {
          account_id: string
          customer_id: string
          email?: string | null
          id?: number
          provider: Database["public"]["Enums"]["billing_provider"]
        }
        Update: {
          account_id?: string
          customer_id?: string
          email?: string | null
          id?: number
          provider?: Database["public"]["Enums"]["billing_provider"]
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          artist_id: string | null
          clientId: string | null
          id: string
          timestamp: number | null
        }
        Insert: {
          artist_id?: string | null
          clientId?: string | null
          id?: string
          timestamp?: number | null
        }
        Update: {
          artist_id?: string | null
          clientId?: string | null
          id?: string
          timestamp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      config: {
        Row: {
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing: boolean
          enable_team_account_billing: boolean
          enable_team_accounts: boolean
        }
        Insert: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Update: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          enable_account_billing?: boolean
          enable_team_account_billing?: boolean
          enable_team_accounts?: boolean
        }
        Relationships: []
      }
      cookie_players: {
        Row: {
          game: string | null
          id: string | null
          timestamp: number | null
          uniquePlayerID: string | null
        }
        Insert: {
          game?: string | null
          id?: string | null
          timestamp?: number | null
          uniquePlayerID?: string | null
        }
        Update: {
          game?: string | null
          id?: string | null
          timestamp?: number | null
          uniquePlayerID?: string | null
        }
        Relationships: []
      }
      credits_usage: {
        Row: {
          account_id: string
          id: number
          remaining_credits: number
          timestamp: string | null
        }
        Insert: {
          account_id: string
          id?: number
          remaining_credits?: number
          timestamp?: string | null
        }
        Update: {
          account_id?: string
          id?: number
          remaining_credits?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_usage_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      cta_redirect: {
        Row: {
          clientId: string
          id: number
          timestamp: string | null
          url: string | null
        }
        Insert: {
          clientId: string
          id?: number
          timestamp?: string | null
          url?: string | null
        }
        Update: {
          clientId?: string
          id?: number
          timestamp?: string | null
          url?: string | null
        }
        Relationships: []
      }
      fan_segments: {
        Row: {
          fan_social_id: string
          id: string
          segment_id: string
          updated_at: string | null
        }
        Insert: {
          fan_social_id: string
          id?: string
          segment_id: string
          updated_at?: string | null
        }
        Update: {
          fan_social_id?: string
          id?: string
          segment_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fan_segments_fan_social_id_fkey"
            columns: ["fan_social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fan_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      fans: {
        Row: {
          account_status: string | null
          apple_token: string | null
          campaign_id: string | null
          campaign_interaction_count: number | null
          campaignId: string | null
          city: string | null
          click_through_rate: number | null
          clientId: string | null
          consent_given: boolean | null
          country: string | null
          custom_tags: Json | null
          discord_username: string | null
          display_name: string | null
          email: string | null
          email_open_rate: number | null
          engagement_level: string | null
          episodes: Json | null
          explicit_content_filter_enabled: boolean | null
          explicit_content_filter_locked: boolean | null
          "explicit_content.filter_enabled": boolean | null
          "explicit_content.filter_locked": boolean | null
          external_urls_spotify: string | null
          "external_urls.spotify": string | null
          facebook_profile_url: string | null
          first_stream_date: string | null
          followedArtists: Json | null
          followers_total: number | null
          "followers.href": string | null
          "followers.total": number | null
          gamification_points: number | null
          genres: Json | null
          heavyRotations: Json | null
          href: string | null
          id: string
          images: Json | null
          instagram_handle: string | null
          last_campaign_interaction: string | null
          last_login: string | null
          last_purchase_date: string | null
          last_stream_date: string | null
          linkedin_profile_url: string | null
          os_type: string | null
          playlist: Json | null
          preferences: Json | null
          preferred_artists: Json | null
          preferred_device: string | null
          product: string | null
          recentlyPlayed: Json | null
          recommendations: Json | null
          recommended_events: Json | null
          reddit_username: string | null
          saved_podcasts: Json | null
          savedAlbums: Json | null
          savedAudioBooks: Json | null
          savedShows: Json | null
          savedTracks: Json | null
          social_shares: number | null
          spotify_token: string | null
          subscription_tier: string | null
          testField: string | null
          tiktok_handle: string | null
          time_zone: string | null
          timestamp: string | null
          top_artists_long_term: Json | null
          top_artists_medium_term: Json | null
          top_tracks_long_term: Json | null
          top_tracks_medium_term: Json | null
          top_tracks_short_term: Json | null
          topArtists: Json | null
          topTracks: Json | null
          total_spent: number | null
          total_streams: number | null
          twitter_handle: string | null
          type: string | null
          uri: string | null
          youtube_channel_url: string | null
        }
        Insert: {
          account_status?: string | null
          apple_token?: string | null
          campaign_id?: string | null
          campaign_interaction_count?: number | null
          campaignId?: string | null
          city?: string | null
          click_through_rate?: number | null
          clientId?: string | null
          consent_given?: boolean | null
          country?: string | null
          custom_tags?: Json | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          email_open_rate?: number | null
          engagement_level?: string | null
          episodes?: Json | null
          explicit_content_filter_enabled?: boolean | null
          explicit_content_filter_locked?: boolean | null
          "explicit_content.filter_enabled"?: boolean | null
          "explicit_content.filter_locked"?: boolean | null
          external_urls_spotify?: string | null
          "external_urls.spotify"?: string | null
          facebook_profile_url?: string | null
          first_stream_date?: string | null
          followedArtists?: Json | null
          followers_total?: number | null
          "followers.href"?: string | null
          "followers.total"?: number | null
          gamification_points?: number | null
          genres?: Json | null
          heavyRotations?: Json | null
          href?: string | null
          id?: string
          images?: Json | null
          instagram_handle?: string | null
          last_campaign_interaction?: string | null
          last_login?: string | null
          last_purchase_date?: string | null
          last_stream_date?: string | null
          linkedin_profile_url?: string | null
          os_type?: string | null
          playlist?: Json | null
          preferences?: Json | null
          preferred_artists?: Json | null
          preferred_device?: string | null
          product?: string | null
          recentlyPlayed?: Json | null
          recommendations?: Json | null
          recommended_events?: Json | null
          reddit_username?: string | null
          saved_podcasts?: Json | null
          savedAlbums?: Json | null
          savedAudioBooks?: Json | null
          savedShows?: Json | null
          savedTracks?: Json | null
          social_shares?: number | null
          spotify_token?: string | null
          subscription_tier?: string | null
          testField?: string | null
          tiktok_handle?: string | null
          time_zone?: string | null
          timestamp?: string | null
          top_artists_long_term?: Json | null
          top_artists_medium_term?: Json | null
          top_tracks_long_term?: Json | null
          top_tracks_medium_term?: Json | null
          top_tracks_short_term?: Json | null
          topArtists?: Json | null
          topTracks?: Json | null
          total_spent?: number | null
          total_streams?: number | null
          twitter_handle?: string | null
          type?: string | null
          uri?: string | null
          youtube_channel_url?: string | null
        }
        Update: {
          account_status?: string | null
          apple_token?: string | null
          campaign_id?: string | null
          campaign_interaction_count?: number | null
          campaignId?: string | null
          city?: string | null
          click_through_rate?: number | null
          clientId?: string | null
          consent_given?: boolean | null
          country?: string | null
          custom_tags?: Json | null
          discord_username?: string | null
          display_name?: string | null
          email?: string | null
          email_open_rate?: number | null
          engagement_level?: string | null
          episodes?: Json | null
          explicit_content_filter_enabled?: boolean | null
          explicit_content_filter_locked?: boolean | null
          "explicit_content.filter_enabled"?: boolean | null
          "explicit_content.filter_locked"?: boolean | null
          external_urls_spotify?: string | null
          "external_urls.spotify"?: string | null
          facebook_profile_url?: string | null
          first_stream_date?: string | null
          followedArtists?: Json | null
          followers_total?: number | null
          "followers.href"?: string | null
          "followers.total"?: number | null
          gamification_points?: number | null
          genres?: Json | null
          heavyRotations?: Json | null
          href?: string | null
          id?: string
          images?: Json | null
          instagram_handle?: string | null
          last_campaign_interaction?: string | null
          last_login?: string | null
          last_purchase_date?: string | null
          last_stream_date?: string | null
          linkedin_profile_url?: string | null
          os_type?: string | null
          playlist?: Json | null
          preferences?: Json | null
          preferred_artists?: Json | null
          preferred_device?: string | null
          product?: string | null
          recentlyPlayed?: Json | null
          recommendations?: Json | null
          recommended_events?: Json | null
          reddit_username?: string | null
          saved_podcasts?: Json | null
          savedAlbums?: Json | null
          savedAudioBooks?: Json | null
          savedShows?: Json | null
          savedTracks?: Json | null
          social_shares?: number | null
          spotify_token?: string | null
          subscription_tier?: string | null
          testField?: string | null
          tiktok_handle?: string | null
          time_zone?: string | null
          timestamp?: string | null
          top_artists_long_term?: Json | null
          top_artists_medium_term?: Json | null
          top_tracks_long_term?: Json | null
          top_tracks_medium_term?: Json | null
          top_tracks_short_term?: Json | null
          topArtists?: Json | null
          topTracks?: Json | null
          total_spent?: number | null
          total_streams?: number | null
          twitter_handle?: string | null
          type?: string | null
          uri?: string | null
          youtube_channel_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fans_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          game: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      funnel_analytics: {
        Row: {
          artist_id: string | null
          handle: string | null
          id: string
          pilot_id: string | null
          status: number | null
          type: Database["public"]["Enums"]["social_type"] | null
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          handle?: string | null
          id?: string
          pilot_id?: string | null
          status?: number | null
          type?: Database["public"]["Enums"]["social_type"] | null
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          handle?: string | null
          id?: string
          pilot_id?: string | null
          status?: number | null
          type?: Database["public"]["Enums"]["social_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funnel_analytics_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_analytics_accounts: {
        Row: {
          account_id: string | null
          analysis_id: string | null
          created_at: string
          id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          analysis_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          analysis_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_funnel_analytics_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_funnel_analytics_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "funnel_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_analytics_segments: {
        Row: {
          analysis_id: string | null
          created_at: string
          icon: string | null
          id: string
          name: string | null
          size: number | null
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string | null
          size?: number | null
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string | null
          size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funnel_analytics_segments_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "funnel_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      funnel_reports: {
        Row: {
          id: string
          next_steps: string | null
          report: string | null
          stack_unique_id: string | null
          timestamp: string
          type: Database["public"]["Enums"]["social_type"] | null
        }
        Insert: {
          id?: string
          next_steps?: string | null
          report?: string | null
          stack_unique_id?: string | null
          timestamp?: string
          type?: Database["public"]["Enums"]["social_type"] | null
        }
        Update: {
          id?: string
          next_steps?: string | null
          report?: string | null
          stack_unique_id?: string | null
          timestamp?: string
          type?: Database["public"]["Enums"]["social_type"] | null
        }
        Relationships: []
      }
      game_start: {
        Row: {
          clientId: string | null
          fanId: Json | null
          game: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          clientId?: string | null
          fanId?: Json | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          clientId?: string | null
          fanId?: Json | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: number
          invite_token: string
          invited_by: string
          role: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: number
          invite_token?: string
          invited_by?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      ios_redirect: {
        Row: {
          clientId: string | null
          fanId: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          clientId?: string | null
          fanId?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          clientId?: string | null
          fanId?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          id: string | null
          Name: string | null
          Number: string | null
          Score: string | null
          Spotify: string | null
          "Time._nanoseconds": string | null
          "Time._seconds": string | null
        }
        Insert: {
          id?: string | null
          Name?: string | null
          Number?: string | null
          Score?: string | null
          Spotify?: string | null
          "Time._nanoseconds"?: string | null
          "Time._seconds"?: string | null
        }
        Update: {
          id?: string | null
          Name?: string | null
          Number?: string | null
          Score?: string | null
          Spotify?: string | null
          "Time._nanoseconds"?: string | null
          "Time._seconds"?: string | null
        }
        Relationships: []
      }
      leaderboard_boogie: {
        Row: {
          clientId: string | null
          displayName: string | null
          fanId: string | null
          gameType: string | null
          id: string | null
          score: number | null
          timestamp: string | null
        }
        Insert: {
          clientId?: string | null
          displayName?: string | null
          fanId?: string | null
          gameType?: string | null
          id?: string | null
          score?: number | null
          timestamp?: string | null
        }
        Update: {
          clientId?: string | null
          displayName?: string | null
          fanId?: string | null
          gameType?: string | null
          id?: string | null
          score?: number | null
          timestamp?: string | null
        }
        Relationships: []
      }
      leaderboard_luh_tyler_3d: {
        Row: {
          FanId: string | null
          id: string | null
          Score: string | null
          ScorePerTime: string | null
          Time: string | null
          timestamp: string | null
          UserName: string | null
        }
        Insert: {
          FanId?: string | null
          id?: string | null
          Score?: string | null
          ScorePerTime?: string | null
          Time?: string | null
          timestamp?: string | null
          UserName?: string | null
        }
        Update: {
          FanId?: string | null
          id?: string | null
          Score?: string | null
          ScorePerTime?: string | null
          Time?: string | null
          timestamp?: string | null
          UserName?: string | null
        }
        Relationships: []
      }
      leaderboard_luv: {
        Row: {
          f: string | null
          id: string | null
        }
        Insert: {
          f?: string | null
          id?: string | null
        }
        Update: {
          f?: string | null
          id?: string | null
        }
        Relationships: []
      }
      memories: {
        Row: {
          artist_id: string | null
          content: Json
          id: string
          room_id: string | null
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          content: Json
          id?: string
          room_id?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          content?: Json
          id?: string
          room_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memories_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memories_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          account_id: string
          body: string
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          dismissed: boolean
          expires_at: string | null
          id: number
          link: string | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          account_id: string
          body: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          account_id?: string
          body?: string
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          dismissed?: boolean
          expires_at?: string | null
          id?: never
          link?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_amount: number | null
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          order_id: string
          price_amount?: number | null
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_amount?: number | null
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at?: string
        }
        Update: {
          account_id?: string
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          created_at?: string
          currency?: string
          id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          name: string
          tokens_quota: number
          variant_id: string
        }
        Insert: {
          name: string
          tokens_quota: number
          variant_id: string
        }
        Update: {
          name?: string
          tokens_quota?: number
          variant_id?: string
        }
        Relationships: []
      }
      popup_open: {
        Row: {
          campaignId: string | null
          clientId: string | null
          fanId: string | null
          game: string | null
          id: string | null
          timestamp: string | null
        }
        Insert: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: string | null
        }
        Update: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          comment: string | null
          commented_at: string
          id: string
          post_id: string | null
          social_id: string | null
        }
        Insert: {
          comment?: string | null
          commented_at: string
          id?: string
          post_id?: string | null
          social_id?: string | null
        }
        Update: {
          comment?: string | null
          commented_at?: string
          id?: string
          post_id?: string | null
          social_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          id: string
          post_url: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_url: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      presave: {
        Row: {
          accessToken: string | null
          fanId: string | null
          "fanId.error.code": string | null
          "fanId.error.name": string | null
          id: string | null
          presaveId: string | null
          presaveReleaseDate: string | null
          refreshToken: string | null
          timestamp: number | null
        }
        Insert: {
          accessToken?: string | null
          fanId?: string | null
          "fanId.error.code"?: string | null
          "fanId.error.name"?: string | null
          id?: string | null
          presaveId?: string | null
          presaveReleaseDate?: string | null
          refreshToken?: string | null
          timestamp?: number | null
        }
        Update: {
          accessToken?: string | null
          fanId?: string | null
          "fanId.error.code"?: string | null
          "fanId.error.name"?: string | null
          id?: string | null
          presaveId?: string | null
          presaveReleaseDate?: string | null
          refreshToken?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permissions"]
          role: string
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permissions"]
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["name"]
          },
        ]
      }
      roles: {
        Row: {
          hierarchy_level: number
          name: string
        }
        Insert: {
          hierarchy_level: number
          name: string
        }
        Update: {
          hierarchy_level?: number
          name?: string
        }
        Relationships: []
      }
      room_reports: {
        Row: {
          id: string
          report_id: string
          room_id: string | null
        }
        Insert: {
          id?: string
          report_id?: string
          room_id?: string | null
        }
        Update: {
          id?: string
          report_id?: string
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_reports_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "segment_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_reports_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          account_id: string | null
          id: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          id?: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          id?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      save_track: {
        Row: {
          game: string | null
          id: string | null
          timestamp: string | null
        }
        Insert: {
          game?: string | null
          id?: string | null
          timestamp?: string | null
        }
        Update: {
          game?: string | null
          id?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      segment_reports: {
        Row: {
          artist_id: string | null
          id: string
          next_steps: string | null
          report: string | null
          updated_at: string | null
        }
        Insert: {
          artist_id?: string | null
          id?: string
          next_steps?: string | null
          report?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_id?: string | null
          id?: string
          next_steps?: string | null
          report?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "segment_reports_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          id: string
          post_id: string | null
          social_id: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          social_id?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          social_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_posts_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      social_spotify_albums: {
        Row: {
          album_id: string | null
          id: string
          social_id: string | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          id?: string
          social_id?: string | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          id?: string
          social_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_spotify_albums_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "spotify_albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_spotify_albums_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
        ]
      }
      social_spotify_tracks: {
        Row: {
          id: string
          social_id: string
          track_id: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          social_id?: string
          track_id?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          social_id?: string
          track_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_spotify_tracks_social_id_fkey"
            columns: ["social_id"]
            isOneToOne: false
            referencedRelation: "socials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_spotify_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "spotify_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      socials: {
        Row: {
          avatar: string | null
          bio: string | null
          followerCount: number | null
          followingCount: number | null
          id: string
          profile_url: string
          region: string | null
          updated_at: string
          username: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          followerCount?: number | null
          followingCount?: number | null
          id?: string
          profile_url: string
          region?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          followerCount?: number | null
          followingCount?: number | null
          id?: string
          profile_url?: string
          region?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      spotify: {
        Row: {
          clientId: string | null
          country: string | null
          display_name: string | null
          email: string | null
          "explicit_content.filter_enabled": string | null
          "explicit_content.filter_locked": string | null
          "external_urls.spotify": Json | null
          fanId: string | null
          "fanId.country": string | null
          "fanId.display_name": string | null
          "fanId.email": string | null
          "fanId.explicit_content.filter_enabled": string | null
          "fanId.explicit_content.filter_locked": string | null
          "fanId.external_urls.spotify": string | null
          "fanId.followers.total": string | null
          "fanId.href": string | null
          "fanId.id": string | null
          "fanId.images": string | null
          "fanId.isNewFan": string | null
          "fanId.playlist": string | null
          "fanId.presavedData.clientId": string | null
          "fanId.presavedData.country": string | null
          "fanId.presavedData.display_name": string | null
          "fanId.presavedData.email": string | null
          "fanId.presavedData.explicit_content.filter_enabled": string | null
          "fanId.presavedData.explicit_content.filter_locked": string | null
          "fanId.presavedData.external_urls.spotify": string | null
          "fanId.presavedData.followers.total": string | null
          "fanId.presavedData.href": string | null
          "fanId.presavedData.id": string | null
          "fanId.presavedData.images": string | null
          "fanId.presavedData.playlist": string | null
          "fanId.presavedData.product": string | null
          "fanId.presavedData.recentlyPlayed": string | null
          "fanId.presavedData.timestamp": string | null
          "fanId.presavedData.type": string | null
          "fanId.presavedData.uri": string | null
          "fanId.product": string | null
          "fanId.timestamp": string | null
          "fanId.type": string | null
          "fanId.uri": string | null
          "followers.total": Json | null
          game: string | null
          href: string | null
          id: string | null
          images: Json | null
          playlist: Json | null
          product: string | null
          syncId: string | null
          timestamp: string | null
          type: string | null
          uri: string | null
        }
        Insert: {
          clientId?: string | null
          country?: string | null
          display_name?: string | null
          email?: string | null
          "explicit_content.filter_enabled"?: string | null
          "explicit_content.filter_locked"?: string | null
          "external_urls.spotify"?: Json | null
          fanId?: string | null
          "fanId.country"?: string | null
          "fanId.display_name"?: string | null
          "fanId.email"?: string | null
          "fanId.explicit_content.filter_enabled"?: string | null
          "fanId.explicit_content.filter_locked"?: string | null
          "fanId.external_urls.spotify"?: string | null
          "fanId.followers.total"?: string | null
          "fanId.href"?: string | null
          "fanId.id"?: string | null
          "fanId.images"?: string | null
          "fanId.isNewFan"?: string | null
          "fanId.playlist"?: string | null
          "fanId.presavedData.clientId"?: string | null
          "fanId.presavedData.country"?: string | null
          "fanId.presavedData.display_name"?: string | null
          "fanId.presavedData.email"?: string | null
          "fanId.presavedData.explicit_content.filter_enabled"?: string | null
          "fanId.presavedData.explicit_content.filter_locked"?: string | null
          "fanId.presavedData.external_urls.spotify"?: string | null
          "fanId.presavedData.followers.total"?: string | null
          "fanId.presavedData.href"?: string | null
          "fanId.presavedData.id"?: string | null
          "fanId.presavedData.images"?: string | null
          "fanId.presavedData.playlist"?: string | null
          "fanId.presavedData.product"?: string | null
          "fanId.presavedData.recentlyPlayed"?: string | null
          "fanId.presavedData.timestamp"?: string | null
          "fanId.presavedData.type"?: string | null
          "fanId.presavedData.uri"?: string | null
          "fanId.product"?: string | null
          "fanId.timestamp"?: string | null
          "fanId.type"?: string | null
          "fanId.uri"?: string | null
          "followers.total"?: Json | null
          game?: string | null
          href?: string | null
          id?: string | null
          images?: Json | null
          playlist?: Json | null
          product?: string | null
          syncId?: string | null
          timestamp?: string | null
          type?: string | null
          uri?: string | null
        }
        Update: {
          clientId?: string | null
          country?: string | null
          display_name?: string | null
          email?: string | null
          "explicit_content.filter_enabled"?: string | null
          "explicit_content.filter_locked"?: string | null
          "external_urls.spotify"?: Json | null
          fanId?: string | null
          "fanId.country"?: string | null
          "fanId.display_name"?: string | null
          "fanId.email"?: string | null
          "fanId.explicit_content.filter_enabled"?: string | null
          "fanId.explicit_content.filter_locked"?: string | null
          "fanId.external_urls.spotify"?: string | null
          "fanId.followers.total"?: string | null
          "fanId.href"?: string | null
          "fanId.id"?: string | null
          "fanId.images"?: string | null
          "fanId.isNewFan"?: string | null
          "fanId.playlist"?: string | null
          "fanId.presavedData.clientId"?: string | null
          "fanId.presavedData.country"?: string | null
          "fanId.presavedData.display_name"?: string | null
          "fanId.presavedData.email"?: string | null
          "fanId.presavedData.explicit_content.filter_enabled"?: string | null
          "fanId.presavedData.explicit_content.filter_locked"?: string | null
          "fanId.presavedData.external_urls.spotify"?: string | null
          "fanId.presavedData.followers.total"?: string | null
          "fanId.presavedData.href"?: string | null
          "fanId.presavedData.id"?: string | null
          "fanId.presavedData.images"?: string | null
          "fanId.presavedData.playlist"?: string | null
          "fanId.presavedData.product"?: string | null
          "fanId.presavedData.recentlyPlayed"?: string | null
          "fanId.presavedData.timestamp"?: string | null
          "fanId.presavedData.type"?: string | null
          "fanId.presavedData.uri"?: string | null
          "fanId.product"?: string | null
          "fanId.timestamp"?: string | null
          "fanId.type"?: string | null
          "fanId.uri"?: string | null
          "followers.total"?: Json | null
          game?: string | null
          href?: string | null
          id?: string | null
          images?: Json | null
          playlist?: Json | null
          product?: string | null
          syncId?: string | null
          timestamp?: string | null
          type?: string | null
          uri?: string | null
        }
        Relationships: []
      }
      spotify_albums: {
        Row: {
          id: string
          name: string | null
          release_date: string | null
          updated_at: string
          uri: string
        }
        Insert: {
          id?: string
          name?: string | null
          release_date?: string | null
          updated_at?: string
          uri: string
        }
        Update: {
          id?: string
          name?: string | null
          release_date?: string | null
          updated_at?: string
          uri?: string
        }
        Relationships: []
      }
      spotify_analytics_albums: {
        Row: {
          analysis_id: string | null
          artist_name: string | null
          created_at: string
          id: string
          name: string | null
          release_date: number | null
          uri: string | null
        }
        Insert: {
          analysis_id?: string | null
          artist_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          release_date?: number | null
          uri?: string | null
        }
        Update: {
          analysis_id?: string | null
          artist_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          release_date?: number | null
          uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spotify_analytics_albums_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "funnel_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      spotify_analytics_tracks: {
        Row: {
          analysis_id: string | null
          artist_name: string | null
          created_at: string
          id: string
          name: string | null
          popularity: number | null
          uri: string | null
        }
        Insert: {
          analysis_id?: string | null
          artist_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          popularity?: number | null
          uri?: string | null
        }
        Update: {
          analysis_id?: string | null
          artist_name?: string | null
          created_at?: string
          id?: string
          name?: string | null
          popularity?: number | null
          uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spotify_analytics_tracks_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "funnel_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      spotify_login_button_clicked: {
        Row: {
          campaignId: string | null
          clientId: string | null
          fanId: string | null
          game: string | null
          id: string | null
          timestamp: number | null
        }
        Insert: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Update: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string | null
          timestamp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spotify_login_button_clicked_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      spotify_play_button_clicked: {
        Row: {
          campaignId: string | null
          clientId: string | null
          fanId: string | null
          game: string | null
          id: string
          isPremium: boolean | null
          timestamp: number | null
        }
        Insert: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string
          isPremium?: boolean | null
          timestamp?: number | null
        }
        Update: {
          campaignId?: string | null
          clientId?: string | null
          fanId?: string | null
          game?: string | null
          id?: string
          isPremium?: boolean | null
          timestamp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "spotify_play_button_clicked_campaignId_fkey"
            columns: ["campaignId"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spotify_play_button_clicked_fanId_fkey"
            columns: ["fanId"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      spotify_tracks: {
        Row: {
          id: string
          name: string | null
          popularity: number | null
          updated_at: string
          uri: string
        }
        Insert: {
          id?: string
          name?: string | null
          popularity?: number | null
          updated_at?: string
          uri: string
        }
        Update: {
          id?: string
          name?: string | null
          popularity?: number | null
          updated_at?: string
          uri?: string
        }
        Relationships: []
      }
      subscription_items: {
        Row: {
          created_at: string
          id: string
          interval: string
          interval_count: number
          price_amount: number | null
          product_id: string
          quantity: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          id: string
          interval: string
          interval_count: number
          price_amount?: number | null
          product_id: string
          quantity?: number
          subscription_id: string
          type: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interval?: string
          interval_count?: number
          price_amount?: number | null
          product_id?: string
          quantity?: number
          subscription_id?: string
          type?: Database["public"]["Enums"]["subscription_item_type"]
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at?: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          active?: boolean
          billing_customer_id?: number
          billing_provider?: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end?: boolean
          created_at?: string
          currency?: string
          id?: string
          period_ends_at?: string
          period_starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_billing_customer_id_fkey"
            columns: ["billing_customer_id"]
            isOneToOne: false
            referencedRelation: "billing_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          account_id: string
          created_at: string
          description: string | null
          done: boolean
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          description?: string | null
          done?: boolean
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          description?: string | null
          done?: boolean
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          token: string
          user_id: string
        }
        Returns: string
      }
      add_invitations_to_account: {
        Args: {
          account_slug: string
          invitations: Database["public"]["CompositeTypes"]["invitation"][]
        }
        Returns: Database["public"]["Tables"]["invitations"]["Row"][]
      }
      can_action_account_member: {
        Args: {
          target_team_account_id: string
          target_user_id: string
        }
        Returns: boolean
      }
      create_invitation: {
        Args: {
          account_id: string
          email: string
          role: string
        }
        Returns: {
          account_id: string
          created_at: string
          email: string
          expires_at: string
          id: number
          invite_token: string
          invited_by: string
          role: string
          updated_at: string
        }
      }
      deduct_credits: {
        Args: {
          account_id: string
          amount: number
        }
        Returns: undefined
      }
      get_account_invitations: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: number
          email: string
          account_id: string
          invited_by: string
          role: string
          created_at: string
          updated_at: string
          expires_at: string
          inviter_name: string
          inviter_email: string
        }[]
      }
      get_account_members: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: string
          user_id: string
          account_id: string
          role: string
          role_hierarchy_level: number
          primary_owner_user_id: string
          name: string
          email: string
          picture_url: string
          created_at: string
          updated_at: string
        }[]
      }
      get_campaign:
        | {
            Args: {
              clientid: string
            }
            Returns: Json
          }
        | {
            Args: {
              email: string
              artistid: string
              campaignid: string
            }
            Returns: Json
          }
      get_campaign_fans: {
        Args: {
          artistid: string
          email: string
        }
        Returns: Json
      }
      get_config: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_fans_listening_top_songs: {
        Args: {
          artistid: string
          email: string
        }
        Returns: Json
      }
      get_upper_system_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_active_subscription: {
        Args: {
          target_account_id: string
        }
        Returns: boolean
      }
      has_credits: {
        Args: {
          account_id: string
        }
        Returns: boolean
      }
      has_more_elevated_role: {
        Args: {
          target_user_id: string
          target_account_id: string
          role_name: string
        }
        Returns: boolean
      }
      has_permission: {
        Args: {
          user_id: string
          account_id: string
          permission_name: Database["public"]["Enums"]["app_permissions"]
        }
        Returns: boolean
      }
      has_role_on_account: {
        Args: {
          account_id: string
          account_role?: string
        }
        Returns: boolean
      }
      has_same_role_hierarchy_level: {
        Args: {
          target_user_id: string
          target_account_id: string
          role_name: string
        }
        Returns: boolean
      }
      is_account_owner: {
        Args: {
          account_id: string
        }
        Returns: boolean
      }
      is_account_team_member: {
        Args: {
          target_account_id: string
        }
        Returns: boolean
      }
      is_set: {
        Args: {
          field_name: string
        }
        Returns: boolean
      }
      is_team_member: {
        Args: {
          account_id: string
          user_id: string
        }
        Returns: boolean
      }
      team_account_workspace: {
        Args: {
          account_slug: string
        }
        Returns: {
          id: string
          name: string
          picture_url: string
          slug: string
          role: string
          role_hierarchy_level: number
          primary_owner_user_id: string
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          permissions: Database["public"]["Enums"]["app_permissions"][]
        }[]
      }
      transfer_team_account_ownership: {
        Args: {
          target_account_id: string
          new_owner_id: string
        }
        Returns: undefined
      }
      upsert_order: {
        Args: {
          target_account_id: string
          target_customer_id: string
          target_order_id: string
          status: Database["public"]["Enums"]["payment_status"]
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          total_amount: number
          currency: string
          line_items: Json
        }
        Returns: {
          account_id: string
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          created_at: string
          currency: string
          id: string
          status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          updated_at: string
        }
      }
      upsert_subscription: {
        Args: {
          target_account_id: string
          target_customer_id: string
          target_subscription_id: string
          active: boolean
          status: Database["public"]["Enums"]["subscription_status"]
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          currency: string
          period_starts_at: string
          period_ends_at: string
          line_items: Json
          trial_starts_at?: string
          trial_ends_at?: string
        }
        Returns: {
          account_id: string
          active: boolean
          billing_customer_id: number
          billing_provider: Database["public"]["Enums"]["billing_provider"]
          cancel_at_period_end: boolean
          created_at: string
          currency: string
          id: string
          period_ends_at: string
          period_starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
        }
      }
    }
    Enums: {
      app_permissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
        | "tasks.write"
        | "tasks.delete"
      billing_provider: "stripe" | "lemon-squeezy" | "paddle"
      chat_role: "user" | "assistant"
      notification_channel: "in_app" | "email"
      notification_type: "info" | "warning" | "error"
      payment_status: "pending" | "succeeded" | "failed"
      social_type:
        | "TIKTOK"
        | "YOUTUBE"
        | "INSTAGRAM"
        | "TWITTER"
        | "SPOTIFY"
        | "APPLE"
      subscription_item_type: "flat" | "per_seat" | "metered"
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused"
    }
    CompositeTypes: {
      invitation: {
        email: string | null
        role: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
