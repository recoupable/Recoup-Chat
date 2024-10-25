export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          email: string | null;
          id: string;
          is_personal_account: boolean;
          name: string;
          picture_url: string | null;
          primary_owner_user_id: string;
          public_data: Json;
          slug: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          is_personal_account?: boolean;
          name: string;
          picture_url?: string | null;
          primary_owner_user_id?: string;
          public_data?: Json;
          slug?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          email?: string | null;
          id?: string;
          is_personal_account?: boolean;
          name?: string;
          picture_url?: string | null;
          primary_owner_user_id?: string;
          public_data?: Json;
          slug?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_primary_owner_user_id_fkey";
            columns: ["primary_owner_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      accounts_memberships: {
        Row: {
          account_id: string;
          account_role: string;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
          user_id: string;
        };
        Insert: {
          account_id: string;
          account_role: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id: string;
        };
        Update: {
          account_id?: string;
          account_role?: string;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_memberships_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_memberships_account_role_fkey";
            columns: ["account_role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "accounts_memberships_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_memberships_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "accounts_memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      billing_customers: {
        Row: {
          account_id: string;
          customer_id: string;
          email: string | null;
          id: number;
          provider: Database["public"]["Enums"]["billing_provider"];
        };
        Insert: {
          account_id: string;
          customer_id: string;
          email?: string | null;
          id?: number;
          provider: Database["public"]["Enums"]["billing_provider"];
        };
        Update: {
          account_id?: string;
          customer_id?: string;
          email?: string | null;
          id?: number;
          provider?: Database["public"]["Enums"]["billing_provider"];
        };
        Relationships: [
          {
            foreignKeyName: "billing_customers_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "billing_customers_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_messages: {
        Row: {
          account_id: string;
          chat_id: number;
          content: string;
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["chat_role"];
        };
        Insert: {
          account_id: string;
          chat_id?: number;
          content: string;
          created_at?: string | null;
          id?: string;
          role: Database["public"]["Enums"]["chat_role"];
        };
        Update: {
          account_id?: string;
          chat_id?: number;
          content?: string;
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["chat_role"];
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_chat_id_fkey";
            columns: ["chat_id"];
            isOneToOne: false;
            referencedRelation: "chats";
            referencedColumns: ["id"];
          },
        ];
      };
      chats: {
        Row: {
          account_id: string;
          created_at: string | null;
          id: number;
          name: string;
          reference_id: string;
          settings: Json;
        };
        Insert: {
          account_id: string;
          created_at?: string | null;
          id?: number;
          name: string;
          reference_id: string;
          settings?: Json;
        };
        Update: {
          account_id?: string;
          created_at?: string | null;
          id?: number;
          name?: string;
          reference_id?: string;
          settings?: Json;
        };
        Relationships: [
          {
            foreignKeyName: "chats_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chats_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      config: {
        Row: {
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          enable_account_billing: boolean;
          enable_team_account_billing: boolean;
          enable_team_accounts: boolean;
        };
        Insert: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"];
          enable_account_billing?: boolean;
          enable_team_account_billing?: boolean;
          enable_team_accounts?: boolean;
        };
        Update: {
          billing_provider?: Database["public"]["Enums"]["billing_provider"];
          enable_account_billing?: boolean;
          enable_team_account_billing?: boolean;
          enable_team_accounts?: boolean;
        };
        Relationships: [];
      };
      cookie_players: {
        Row: {
          game: string | null;
          id: string | null;
          timestamp: number | null;
          uniquePlayerID: string | null;
        };
        Insert: {
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
          uniquePlayerID?: string | null;
        };
        Update: {
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
          uniquePlayerID?: string | null;
        };
        Relationships: [];
      };
      credits_usage: {
        Row: {
          account_id: string;
          id: number;
          remaining_credits: number;
        };
        Insert: {
          account_id: string;
          id?: number;
          remaining_credits?: number;
        };
        Update: {
          account_id?: string;
          id?: number;
          remaining_credits?: number;
        };
        Relationships: [
          {
            foreignKeyName: "credits_usage_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credits_usage_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "credits_usage_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      fans: {
        Row: {
          account_status: string | null;
          apple_token: string | null;
          campaign_id: string | null;
          campaign_interaction_count: string | null;
          city: string | null;
          click_through_rate: string | null;
          clientId: string | null;
          consent_given: string | null;
          country: string | null;
          custom_tags: string | null;
          discord_username: string | null;
          display_name: string | null;
          email: string | null;
          email_open_rate: string | null;
          engagement_level: string | null;
          episodes: Json[] | null;
          topTracks: Json[] | null;
          followedArtists: Json[] | null;
          topArtists: Json[] | null;
          savedAlbums: Json[] | null;
          savedAudioBooks: Json[] | null;
          savedShows: Json[] | null;
          savedTracks: Json[] | null;
          explicit_content_filter_enabled: string | null;
          explicit_content_filter_locked: string | null;
          "explicit_content.filter_enabled": string | null;
          "explicit_content.filter_locked": string | null;
          external_urls_spotify: string | null;
          "external_urls.spotify": string | null;
          facebook_profile_url: string | null;
          first_stream_date: string | null;
          followers_total: string | null;
          "followers.href": string | null;
          "followers.total": string | null;
          gamification_points: string | null;
          heavy_rotations: string | null;
          heavyRotations: string | null;
          href: string | null;
          id: string;
          images: string | null;
          instagram_handle: string | null;
          last_campaign_interaction: string | null;
          last_login: string | null;
          last_purchase_date: string | null;
          last_stream_date: string | null;
          linkedin_profile_url: string | null;
          os_type: string | null;
          playlist: string | null;
          preferences: string | null;
          preferred_artists: string | null;
          preferred_device: string | null;
          product: string | null;
          recently_played: string | null;
          recentlyPlayed: string | null;
          recommendations: string | null;
          recommended_events: string | null;
          reddit_username: string | null;
          saved_audiobooks: string | null;
          saved_podcasts: string | null;
          saved_shows: string | null;
          social_shares: string | null;
          spotify_token: string | null;
          subscription_tier: string | null;
          testField: string | null;
          tiktok_handle: string | null;
          time_zone: string | null;
          timestamp: number | null;
          top_artists_long_term: string | null;
          top_artists_medium_term: string | null;
          top_tracks_long_term: string | null;
          top_tracks_medium_term: string | null;
          top_tracks_short_term: string | null;
          total_spent: string | null;
          total_streams: string | null;
          twitter_handle: string | null;
          type: string | null;
          uri: string | null;
          youtube_channel_url: string | null;
        };
        Insert: {
          account_status: string | null;
          apple_token: string | null;
          campaign_id: string | null;
          campaign_interaction_count: string | null;
          city: string | null;
          click_through_rate: string | null;
          clientId: string | null;
          consent_given: string | null;
          country: string | null;
          custom_tags: string | null;
          discord_username: string | null;
          display_name: string | null;
          email: string | null;
          email_open_rate: string | null;
          engagement_level: string | null;
          episodes: Json[] | null;
          topTracks: Json[] | null;
          followedArtists: Json[] | null;
          topArtists: Json[] | null;
          savedAlbums: Json[] | null;
          savedAudioBooks: Json[] | null;
          savedShows: Json[] | null;
          savedTracks: Json[] | null;
          explicit_content_filter_enabled: string | null;
          explicit_content_filter_locked: string | null;
          "explicit_content.filter_enabled": string | null;
          "explicit_content.filter_locked": string | null;
          external_urls_spotify: string | null;
          "external_urls.spotify": string | null;
          facebook_profile_url: string | null;
          first_stream_date: string | null;
          followers_total: string | null;
          "followers.href": string | null;
          "followers.total": string | null;
          gamification_points: string | null;
          heavy_rotations: string | null;
          heavyRotations: string | null;
          href: string | null;
          id: string;
          images: string | null;
          instagram_handle: string | null;
          last_campaign_interaction: string | null;
          last_login: string | null;
          last_purchase_date: string | null;
          last_stream_date: string | null;
          linkedin_profile_url: string | null;
          os_type: string | null;
          playlist: string | null;
          preferences: string | null;
          preferred_artists: string | null;
          preferred_device: string | null;
          product: string | null;
          recently_played: string | null;
          recentlyPlayed: string | null;
          recommendations: string | null;
          recommended_events: string | null;
          reddit_username: string | null;
          saved_audiobooks: string | null;
          saved_podcasts: string | null;
          saved_shows: string | null;
          social_shares: string | null;
          spotify_token: string | null;
          subscription_tier: string | null;
          testField: string | null;
          tiktok_handle: string | null;
          time_zone: string | null;
          timestamp: number | null;
          top_artists_long_term: string | null;
          top_artists_medium_term: string | null;
          top_tracks_long_term: string | null;
          top_tracks_medium_term: string | null;
          top_tracks_short_term: string | null;
          total_spent: string | null;
          total_streams: string | null;
          twitter_handle: string | null;
          type: string | null;
          uri: string | null;
          youtube_channel_url: string | null;
        };
        Update: {
          account_status: string | null;
          apple_token: string | null;
          campaign_id: string | null;
          campaign_interaction_count: string | null;
          city: string | null;
          click_through_rate: string | null;
          clientId: string | null;
          consent_given: string | null;
          country: string | null;
          custom_tags: string | null;
          discord_username: string | null;
          display_name: string | null;
          email: string | null;
          email_open_rate: string | null;
          engagement_level: string | null;
          episodes: Json[] | null;
          topTracks: Json[] | null;
          followedArtists: Json[] | null;
          topArtists: Json[] | null;
          savedAlbums: Json[] | null;
          savedAudioBooks: Json[] | null;
          savedShows: Json[] | null;
          savedTracks: Json[] | null;
          explicit_content_filter_enabled: string | null;
          explicit_content_filter_locked: string | null;
          "explicit_content.filter_enabled": string | null;
          "explicit_content.filter_locked": string | null;
          external_urls_spotify: string | null;
          "external_urls.spotify": string | null;
          facebook_profile_url: string | null;
          first_stream_date: string | null;
          followers_total: string | null;
          "followers.href": string | null;
          "followers.total": string | null;
          gamification_points: string | null;
          heavy_rotations: string | null;
          heavyRotations: string | null;
          href: string | null;
          id: string;
          images: string | null;
          instagram_handle: string | null;
          last_campaign_interaction: string | null;
          last_login: string | null;
          last_purchase_date: string | null;
          last_stream_date: string | null;
          linkedin_profile_url: string | null;
          os_type: string | null;
          playlist: string | null;
          preferences: string | null;
          preferred_artists: string | null;
          preferred_device: string | null;
          product: string | null;
          recently_played: string | null;
          recentlyPlayed: string | null;
          recommendations: string | null;
          recommended_events: string | null;
          reddit_username: string | null;
          saved_audiobooks: string | null;
          saved_podcasts: string | null;
          saved_shows: string | null;
          social_shares: string | null;
          spotify_token: string | null;
          subscription_tier: string | null;
          testField: string | null;
          tiktok_handle: string | null;
          time_zone: string | null;
          timestamp: number | null;
          top_artists_long_term: string | null;
          top_artists_medium_term: string | null;
          top_tracks_long_term: string | null;
          top_tracks_medium_term: string | null;
          top_tracks_short_term: string | null;
          total_spent: string | null;
          total_streams: string | null;
          twitter_handle: string | null;
          type: string | null;
          uri: string | null;
          youtube_channel_url: string | null;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          game: string | null;
          id: string | null;
          timestamp: number | null;
        };
        Insert: {
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
        };
        Update: {
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
        };
        Relationships: [];
      };
      game_start: {
        Row: {
          clientId: string | null;
          fanId: Json | null;
          game: string | null;
          id: string | null;
          timestamp: number | null;
        };
        Insert: {
          clientId?: string | null;
          fanId?: Json | null;
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
        };
        Update: {
          clientId?: string | null;
          fanId?: Json | null;
          game?: string | null;
          id?: string | null;
          timestamp?: number | null;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          account_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: number;
          invite_token?: string;
          invited_by?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invitations_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["name"];
          },
        ];
      };
      leaderboard: {
        Row: {
          id: string | null;
          Name: string | null;
          Number: string | null;
          Score: string | null;
          Spotify: string | null;
          "Time._nanoseconds": string | null;
          "Time._seconds": string | null;
        };
        Insert: {
          id?: string | null;
          Name?: string | null;
          Number?: string | null;
          Score?: string | null;
          Spotify?: string | null;
          "Time._nanoseconds"?: string | null;
          "Time._seconds"?: string | null;
        };
        Update: {
          id?: string | null;
          Name?: string | null;
          Number?: string | null;
          Score?: string | null;
          Spotify?: string | null;
          "Time._nanoseconds"?: string | null;
          "Time._seconds"?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          account_id: string;
          body: string;
          channel: Database["public"]["Enums"]["notification_channel"];
          created_at: string;
          dismissed: boolean;
          expires_at: string | null;
          id: number;
          link: string | null;
          type: Database["public"]["Enums"]["notification_type"];
        };
        Insert: {
          account_id: string;
          body: string;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Update: {
          account_id?: string;
          body?: string;
          channel?: Database["public"]["Enums"]["notification_channel"];
          created_at?: string;
          dismissed?: boolean;
          expires_at?: string | null;
          id?: never;
          link?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
        };
        Relationships: [
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          price_amount: number | null;
          product_id: string;
          quantity: number;
          updated_at: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          order_id: string;
          price_amount?: number | null;
          product_id: string;
          quantity?: number;
          updated_at?: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          price_amount?: number | null;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          created_at: string;
          currency: string;
          id: string;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          created_at?: string;
          currency: string;
          id: string;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          billing_customer_id?: number;
          billing_provider?: Database["public"]["Enums"]["billing_provider"];
          created_at?: string;
          currency?: string;
          id?: string;
          status?: Database["public"]["Enums"]["payment_status"];
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_billing_customer_id_fkey";
            columns: ["billing_customer_id"];
            isOneToOne: false;
            referencedRelation: "billing_customers";
            referencedColumns: ["id"];
          },
        ];
      };
      plans: {
        Row: {
          name: string;
          tokens_quota: number;
          variant_id: string;
        };
        Insert: {
          name: string;
          tokens_quota: number;
          variant_id: string;
        };
        Update: {
          name?: string;
          tokens_quota?: number;
          variant_id?: string;
        };
        Relationships: [];
      };
      presave: {
        Row: {
          accessToken: string | null;
          fanId: string | null;
          "fanId.error.code": string | null;
          "fanId.error.name": string | null;
          id: string | null;
          presaveId: string | null;
          presaveReleaseDate: string | null;
          refreshToken: string | null;
          timestamp: number | null;
        };
        Insert: {
          accessToken?: string | null;
          fanId?: string | null;
          "fanId.error.code"?: string | null;
          "fanId.error.name"?: string | null;
          id?: string | null;
          presaveId?: string | null;
          presaveReleaseDate?: string | null;
          refreshToken?: string | null;
          timestamp?: number | null;
        };
        Update: {
          accessToken?: string | null;
          fanId?: string | null;
          "fanId.error.code"?: string | null;
          "fanId.error.name"?: string | null;
          id?: string | null;
          presaveId?: string | null;
          presaveReleaseDate?: string | null;
          refreshToken?: string | null;
          timestamp?: number | null;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permissions"];
          role: string;
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permissions"];
          role: string;
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permissions"];
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["name"];
          },
        ];
      };
      roles: {
        Row: {
          hierarchy_level: number;
          name: string;
        };
        Insert: {
          hierarchy_level: number;
          name: string;
        };
        Update: {
          hierarchy_level?: number;
          name?: string;
        };
        Relationships: [];
      };
      spotify_play_button_clicked: {
        Row: {
          clientId: string | null;
          fanId: string;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Insert: {
          clientId: string | null;
          fanId: string;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Update: {
          clientId: string | null;
          fanId: string;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "spotify_play_button_clicked_fanId_fkey";
            columns: ["fanId"];
            isOneToOne: false;
            referencedRelation: "fans";
            referencedColumns: ["id"];
          },
        ];
      };
      apple_play_button_clicked: {
        Row: {
          clientId: string | null;
          appleId: string;
          timestamp: number | null;
          game: string | null;
        };
        Insert: {
          clientId: string | null;
          appleId: string;
          timestamp: number | null;
          game: string | null;
        };
        Update: {
          clientId: string | null;
          appleId: string;
          timestamp: number | null;
          game: string | null;
        };
        Relationships: [];
      };
      spotify_login_button_clicked: {
        Row: {
          clientId: string | null;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Insert: {
          clientId: string | null;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Update: {
          clientId: string | null;
          timestamp: number | null;
          game: string | null;
          isPremium: boolean;
        };
        Relationships: [];
      };
      save_track: {
        Row: {
          game: string | null;
          id: string | null;
          timestamp: string | null;
        };
        Insert: {
          game?: string | null;
          id?: string | null;
          timestamp?: string | null;
        };
        Update: {
          game?: string | null;
          id?: string | null;
          timestamp?: string | null;
        };
        Relationships: [];
      };
      spotify: {
        Row: {
          clientId: string | null;
          country: string | null;
          display_name: string | null;
          email: string | null;
          "explicit_content.filter_enabled": string | null;
          "explicit_content.filter_locked": string | null;
          "external_urls.spotify": Json | null;
          fanId: string | null;
          "fanId.country": string | null;
          "fanId.display_name": string | null;
          "fanId.email": string | null;
          "fanId.explicit_content.filter_enabled": string | null;
          "fanId.explicit_content.filter_locked": string | null;
          "fanId.external_urls.spotify": string | null;
          "fanId.followers.total": string | null;
          "fanId.href": string | null;
          "fanId.id": string | null;
          "fanId.images": string | null;
          "fanId.isNewFan": string | null;
          "fanId.playlist": string | null;
          "fanId.presavedData.clientId": string | null;
          "fanId.presavedData.country": string | null;
          "fanId.presavedData.display_name": string | null;
          "fanId.presavedData.email": string | null;
          "fanId.presavedData.explicit_content.filter_enabled": string | null;
          "fanId.presavedData.explicit_content.filter_locked": string | null;
          "fanId.presavedData.external_urls.spotify": string | null;
          "fanId.presavedData.followers.total": string | null;
          "fanId.presavedData.href": string | null;
          "fanId.presavedData.id": string | null;
          "fanId.presavedData.images": string | null;
          "fanId.presavedData.playlist": string | null;
          "fanId.presavedData.product": string | null;
          "fanId.presavedData.recentlyPlayed": string | null;
          "fanId.presavedData.timestamp": string | null;
          "fanId.presavedData.type": string | null;
          "fanId.presavedData.uri": string | null;
          "fanId.product": string | null;
          "fanId.timestamp": string | null;
          "fanId.type": string | null;
          "fanId.uri": string | null;
          "followers.total": Json | null;
          game: string | null;
          href: string | null;
          id: string | null;
          images: Json | null;
          playlist: Json | null;
          product: string | null;
          syncId: string | null;
          timestamp: string | null;
          type: string | null;
          uri: string | null;
        };
        Insert: {
          clientId?: string | null;
          country?: string | null;
          display_name?: string | null;
          email?: string | null;
          "explicit_content.filter_enabled"?: string | null;
          "explicit_content.filter_locked"?: string | null;
          "external_urls.spotify"?: Json | null;
          fanId?: string | null;
          "fanId.country"?: string | null;
          "fanId.display_name"?: string | null;
          "fanId.email"?: string | null;
          "fanId.explicit_content.filter_enabled"?: string | null;
          "fanId.explicit_content.filter_locked"?: string | null;
          "fanId.external_urls.spotify"?: string | null;
          "fanId.followers.total"?: string | null;
          "fanId.href"?: string | null;
          "fanId.id"?: string | null;
          "fanId.images"?: string | null;
          "fanId.isNewFan"?: string | null;
          "fanId.playlist"?: string | null;
          "fanId.presavedData.clientId"?: string | null;
          "fanId.presavedData.country"?: string | null;
          "fanId.presavedData.display_name"?: string | null;
          "fanId.presavedData.email"?: string | null;
          "fanId.presavedData.explicit_content.filter_enabled"?: string | null;
          "fanId.presavedData.explicit_content.filter_locked"?: string | null;
          "fanId.presavedData.external_urls.spotify"?: string | null;
          "fanId.presavedData.followers.total"?: string | null;
          "fanId.presavedData.href"?: string | null;
          "fanId.presavedData.id"?: string | null;
          "fanId.presavedData.images"?: string | null;
          "fanId.presavedData.playlist"?: string | null;
          "fanId.presavedData.product"?: string | null;
          "fanId.presavedData.recentlyPlayed"?: string | null;
          "fanId.presavedData.timestamp"?: string | null;
          "fanId.presavedData.type"?: string | null;
          "fanId.presavedData.uri"?: string | null;
          "fanId.product"?: string | null;
          "fanId.timestamp"?: string | null;
          "fanId.type"?: string | null;
          "fanId.uri"?: string | null;
          "followers.total"?: Json | null;
          game?: string | null;
          href?: string | null;
          id?: string | null;
          images?: Json | null;
          playlist?: Json | null;
          product?: string | null;
          syncId?: string | null;
          timestamp?: string | null;
          type?: string | null;
          uri?: string | null;
        };
        Update: {
          clientId?: string | null;
          country?: string | null;
          display_name?: string | null;
          email?: string | null;
          "explicit_content.filter_enabled"?: string | null;
          "explicit_content.filter_locked"?: string | null;
          "external_urls.spotify"?: Json | null;
          fanId?: string | null;
          "fanId.country"?: string | null;
          "fanId.display_name"?: string | null;
          "fanId.email"?: string | null;
          "fanId.explicit_content.filter_enabled"?: string | null;
          "fanId.explicit_content.filter_locked"?: string | null;
          "fanId.external_urls.spotify"?: string | null;
          "fanId.followers.total"?: string | null;
          "fanId.href"?: string | null;
          "fanId.id"?: string | null;
          "fanId.images"?: string | null;
          "fanId.isNewFan"?: string | null;
          "fanId.playlist"?: string | null;
          "fanId.presavedData.clientId"?: string | null;
          "fanId.presavedData.country"?: string | null;
          "fanId.presavedData.display_name"?: string | null;
          "fanId.presavedData.email"?: string | null;
          "fanId.presavedData.explicit_content.filter_enabled"?: string | null;
          "fanId.presavedData.explicit_content.filter_locked"?: string | null;
          "fanId.presavedData.external_urls.spotify"?: string | null;
          "fanId.presavedData.followers.total"?: string | null;
          "fanId.presavedData.href"?: string | null;
          "fanId.presavedData.id"?: string | null;
          "fanId.presavedData.images"?: string | null;
          "fanId.presavedData.playlist"?: string | null;
          "fanId.presavedData.product"?: string | null;
          "fanId.presavedData.recentlyPlayed"?: string | null;
          "fanId.presavedData.timestamp"?: string | null;
          "fanId.presavedData.type"?: string | null;
          "fanId.presavedData.uri"?: string | null;
          "fanId.product"?: string | null;
          "fanId.timestamp"?: string | null;
          "fanId.type"?: string | null;
          "fanId.uri"?: string | null;
          "followers.total"?: Json | null;
          game?: string | null;
          href?: string | null;
          id?: string | null;
          images?: Json | null;
          playlist?: Json | null;
          product?: string | null;
          syncId?: string | null;
          timestamp?: string | null;
          type?: string | null;
          uri?: string | null;
        };
        Relationships: [];
      };
      subscription_items: {
        Row: {
          created_at: string;
          id: string;
          interval: string;
          interval_count: number;
          price_amount: number | null;
          product_id: string;
          quantity: number;
          subscription_id: string;
          type: Database["public"]["Enums"]["subscription_item_type"];
          updated_at: string;
          variant_id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          interval: string;
          interval_count: number;
          price_amount?: number | null;
          product_id: string;
          quantity?: number;
          subscription_id: string;
          type: Database["public"]["Enums"]["subscription_item_type"];
          updated_at?: string;
          variant_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          interval?: string;
          interval_count?: number;
          price_amount?: number | null;
          product_id?: string;
          quantity?: number;
          subscription_id?: string;
          type?: Database["public"]["Enums"]["subscription_item_type"];
          updated_at?: string;
          variant_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscription_items_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          cancel_at_period_end: boolean;
          created_at: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at: string | null;
          trial_starts_at: string | null;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          cancel_at_period_end: boolean;
          created_at?: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          active?: boolean;
          billing_customer_id?: number;
          billing_provider?: Database["public"]["Enums"]["billing_provider"];
          cancel_at_period_end?: boolean;
          created_at?: string;
          currency?: string;
          id?: string;
          period_ends_at?: string;
          period_starts_at?: string;
          status?: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at?: string | null;
          trial_starts_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_billing_customer_id_fkey";
            columns: ["billing_customer_id"];
            isOneToOne: false;
            referencedRelation: "billing_customers";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          account_id: string;
          created_at: string;
          description: string | null;
          done: boolean;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          account_id: string;
          created_at?: string;
          description?: string | null;
          done?: boolean;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          description?: string | null;
          done?: boolean;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_account_workspace";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "user_accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      test: {
        Row: {
          created_at: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      user_account_workspace: {
        Row: {
          id: string | null;
          name: string | null;
          picture_url: string | null;
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null;
        };
        Relationships: [];
      };
      user_accounts: {
        Row: {
          id: string | null;
          name: string | null;
          picture_url: string | null;
          role: string | null;
          slug: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_memberships_account_role_fkey";
            columns: ["role"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["name"];
          },
        ];
      };
    };
    Functions: {
      get_campaign: {
        Args: {
          clientid: string;
        };
        Returns: {
          playlist: string[];
          artists: string[];
          audio_books: string[];
          episodes: string[];
          albums: string[];
          tracks: string[];
          shows: string[];
        };
      };
      accept_invitation: {
        Args: {
          token: string;
          user_id: string;
        };
        Returns: string;
      };
      add_invitations_to_account: {
        Args: {
          account_slug: string;
          invitations: Database["public"]["CompositeTypes"]["invitation"][];
        };
        Returns: Database["public"]["Tables"]["invitations"]["Row"][];
      };
      can_action_account_member: {
        Args: {
          target_team_account_id: string;
          target_user_id: string;
        };
        Returns: boolean;
      };
      create_invitation: {
        Args: {
          account_id: string;
          email: string;
          role: string;
        };
        Returns: {
          account_id: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: number;
          invite_token: string;
          invited_by: string;
          role: string;
          updated_at: string;
        };
      };
      create_team_account: {
        Args: {
          account_name: string;
        };
        Returns: {
          created_at: string | null;
          created_by: string | null;
          email: string | null;
          id: string;
          is_personal_account: boolean;
          name: string;
          picture_url: string | null;
          primary_owner_user_id: string;
          public_data: Json;
          slug: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
      };
      deduct_credits: {
        Args: {
          account_id: string;
          amount: number;
        };
        Returns: undefined;
      };
      get_account_invitations: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: number;
          email: string;
          account_id: string;
          invited_by: string;
          role: string;
          created_at: string;
          updated_at: string;
          expires_at: string;
          inviter_name: string;
          inviter_email: string;
        }[];
      };
      get_account_members: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: string;
          user_id: string;
          account_id: string;
          role: string;
          role_hierarchy_level: number;
          primary_owner_user_id: string;
          name: string;
          email: string;
          picture_url: string;
          created_at: string;
          updated_at: string;
        }[];
      };
      get_config: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_upper_system_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_active_subscription: {
        Args: {
          target_account_id: string;
        };
        Returns: boolean;
      };
      has_credits: {
        Args: {
          account_id: string;
        };
        Returns: boolean;
      };
      has_more_elevated_role: {
        Args: {
          target_user_id: string;
          target_account_id: string;
          role_name: string;
        };
        Returns: boolean;
      };
      has_permission: {
        Args: {
          user_id: string;
          account_id: string;
          permission_name: Database["public"]["Enums"]["app_permissions"];
        };
        Returns: boolean;
      };
      has_role_on_account: {
        Args: {
          account_id: string;
          account_role?: string;
        };
        Returns: boolean;
      };
      has_same_role_hierarchy_level: {
        Args: {
          target_user_id: string;
          target_account_id: string;
          role_name: string;
        };
        Returns: boolean;
      };
      is_account_owner: {
        Args: {
          account_id: string;
        };
        Returns: boolean;
      };
      is_account_team_member: {
        Args: {
          target_account_id: string;
        };
        Returns: boolean;
      };
      is_set: {
        Args: {
          field_name: string;
        };
        Returns: boolean;
      };
      is_team_member: {
        Args: {
          account_id: string;
          user_id: string;
        };
        Returns: boolean;
      };
      team_account_workspace: {
        Args: {
          account_slug: string;
        };
        Returns: {
          id: string;
          name: string;
          picture_url: string;
          slug: string;
          role: string;
          role_hierarchy_level: number;
          primary_owner_user_id: string;
          subscription_status: Database["public"]["Enums"]["subscription_status"];
          permissions: Database["public"]["Enums"]["app_permissions"][];
        }[];
      };
      transfer_team_account_ownership: {
        Args: {
          target_account_id: string;
          new_owner_id: string;
        };
        Returns: undefined;
      };
      upsert_order: {
        Args: {
          target_account_id: string;
          target_customer_id: string;
          target_order_id: string;
          status: Database["public"]["Enums"]["payment_status"];
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          total_amount: number;
          currency: string;
          line_items: Json;
        };
        Returns: {
          account_id: string;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          created_at: string;
          currency: string;
          id: string;
          status: Database["public"]["Enums"]["payment_status"];
          total_amount: number;
          updated_at: string;
        };
      };
      upsert_subscription: {
        Args: {
          target_account_id: string;
          target_customer_id: string;
          target_subscription_id: string;
          active: boolean;
          status: Database["public"]["Enums"]["subscription_status"];
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          cancel_at_period_end: boolean;
          currency: string;
          period_starts_at: string;
          period_ends_at: string;
          line_items: Json;
          trial_starts_at?: string;
          trial_ends_at?: string;
        };
        Returns: {
          account_id: string;
          active: boolean;
          billing_customer_id: number;
          billing_provider: Database["public"]["Enums"]["billing_provider"];
          cancel_at_period_end: boolean;
          created_at: string;
          currency: string;
          id: string;
          period_ends_at: string;
          period_starts_at: string;
          status: Database["public"]["Enums"]["subscription_status"];
          trial_ends_at: string | null;
          trial_starts_at: string | null;
          updated_at: string;
        };
      };
    };
    Enums: {
      app_permissions:
        | "roles.manage"
        | "billing.manage"
        | "settings.manage"
        | "members.manage"
        | "invites.manage"
        | "tasks.write"
        | "tasks.delete";
      billing_provider: "stripe" | "lemon-squeezy" | "paddle";
      chat_role: "user" | "assistant";
      notification_channel: "in_app" | "email";
      notification_type: "info" | "warning" | "error";
      payment_status: "pending" | "succeeded" | "failed";
      subscription_item_type: "flat" | "per_seat" | "metered";
      subscription_status:
        | "active"
        | "trialing"
        | "past_due"
        | "canceled"
        | "unpaid"
        | "incomplete"
        | "incomplete_expired"
        | "paused";
    };
    CompositeTypes: {
      invitation: {
        email: string | null;
        role: string | null;
      };
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            isOneToOne: false;
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
