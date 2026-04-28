export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      authors: {
        Row: {
          bio: string | null
          birth_date: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string
          photo: string | null
          specialty: string | null
        }
        Insert: {
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name: string
          photo?: string | null
          specialty?: string | null
        }
        Update: {
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string
          photo?: string | null
          specialty?: string | null
        }
        Relationships: []
      }
      book_authors: {
        Row: {
          author_id: string
          book_id: string
          id: string
        }
        Insert: {
          author_id: string
          book_id: string
          id?: string
        }
        Update: {
          author_id?: string
          book_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_authors_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_authors_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author_id: string | null
          back_cover: string | null
          collection_id: string | null
          cover: string | null
          created_at: string
          currency: string | null
          description: string | null
          genre: string | null
          id: string
          is_new: boolean | null
          isbn: string | null
          pages: number | null
          price: number | null
          published_date: string | null
          sub_genre: string | null
          title: string
        }
        Insert: {
          author_id?: string | null
          back_cover?: string | null
          collection_id?: string | null
          cover?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          is_new?: boolean | null
          isbn?: string | null
          pages?: number | null
          price?: number | null
          published_date?: string | null
          sub_genre?: string | null
          title: string
        }
        Update: {
          author_id?: string | null
          back_cover?: string | null
          collection_id?: string | null
          cover?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          genre?: string | null
          id?: string
          is_new?: boolean | null
          isbn?: string | null
          pages?: number | null
          price?: number | null
          published_date?: string | null
          sub_genre?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          genre: string | null
          id: string
          name: string
          position: number
          sub_genre_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          name: string
          position?: number
          sub_genre_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          name?: string
          position?: number
          sub_genre_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collections_sub_genre_id_fkey"
            columns: ["sub_genre_id"]
            isOneToOne: false
            referencedRelation: "sub_genres"
            referencedColumns: ["id"]
          },
        ]
      }
      distributors: {
        Row: {
          city: string | null
          country: string | null
          description: string | null
          id: string
          logo: string | null
          name: string
          postal_code: string | null
          street: string | null
          street_complement: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name: string
          postal_code?: string | null
          street?: string | null
          street_complement?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
          postal_code?: string | null
          street?: string | null
          street_complement?: string | null
          website?: string | null
        }
        Relationships: []
      }
      families: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      genres: {
        Row: {
          family_id: string | null
          id: string
          is_hidden: boolean
          name: string
          position: number
        }
        Insert: {
          family_id?: string | null
          id?: string
          is_hidden?: boolean
          name: string
          position?: number
        }
        Update: {
          family_id?: string | null
          id?: string
          is_hidden?: boolean
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "genres_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          date: string | null
          event_type: string
          excerpt: string | null
          id: string
          image: string | null
          title: string
          type: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          event_type?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          title: string
          type?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string | null
          event_type?: string
          excerpt?: string | null
          id?: string
          image?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      news_images: {
        Row: {
          id: string
          image_url: string
          news_article_id: string
          position: number | null
        }
        Insert: {
          id?: string
          image_url: string
          news_article_id: string
          position?: number | null
        }
        Update: {
          id?: string
          image_url?: string
          news_article_id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "news_images_news_article_id_fkey"
            columns: ["news_article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_genres: {
        Row: {
          genre_id: string
          id: string
          is_hidden: boolean
          name: string
          position: number
        }
        Insert: {
          genre_id: string
          id?: string
          is_hidden?: boolean
          name: string
          position?: number
        }
        Update: {
          genre_id?: string
          id?: string
          is_hidden?: boolean
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "sub_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          first_name: string | null
          id: string
          last_name: string
          photo: string | null
          role: string | null
        }
        Insert: {
          bio?: string | null
          first_name?: string | null
          id?: string
          last_name: string
          photo?: string | null
          role?: string | null
        }
        Update: {
          bio?: string | null
          first_name?: string | null
          id?: string
          last_name?: string
          photo?: string | null
          role?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
