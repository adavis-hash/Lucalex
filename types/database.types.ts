export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'customer' | 'admin';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          name: string;
          subtitle: string | null;
          image: string;
          featured_badge: string | null;
          item_count: string | null;
          accent_color: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          subtitle?: string | null;
          image: string;
          featured_badge?: string | null;
          item_count?: string | null;
          accent_color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subtitle?: string | null;
          image?: string;
          featured_badge?: string | null;
          item_count?: string | null;
          accent_color?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          set_number: string;
          name: string;
          collection_id: string | null;
          collection_name: string | null;
          pieces: number;
          age: string;
          price: number;
          is_new: boolean;
          is_featured: boolean;
          badge: string | null;
          image: string;
          tagline: string | null;
          dimensions: string | null;
          features: Json;
          difficulty: string | null;
          stock: number;
          created_at: string;
        };
        Insert: {
          id: string;
          set_number: string;
          name: string;
          collection_id?: string | null;
          collection_name?: string | null;
          pieces: number;
          age: string;
          price: number;
          is_new?: boolean;
          is_featured?: boolean;
          badge?: string | null;
          image: string;
          tagline?: string | null;
          dimensions?: string | null;
          features?: Json;
          difficulty?: string | null;
          stock?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          set_number?: string;
          name?: string;
          collection_id?: string | null;
          collection_name?: string | null;
          pieces?: number;
          age?: string;
          price?: number;
          is_new?: boolean;
          is_featured?: boolean;
          badge?: string | null;
          image?: string;
          tagline?: string | null;
          dimensions?: string | null;
          features?: Json;
          difficulty?: string | null;
          stock?: number;
        };
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          }
        ];
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          total_amount: number;
          total_pieces: number;
          shipping_address: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          total_amount: number;
          total_pieces?: number;
          shipping_address?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: OrderStatus;
          total_amount?: number;
          total_pieces?: number;
          shipping_address?: Json | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          unit_price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          unit_price?: number;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      create_order: {
        Args: {
          p_shipping_address?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
