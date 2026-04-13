export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: "buyer" | "seller" | "both";
          preferred_language: string;
          preferred_currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: "buyer" | "seller" | "both";
          preferred_language?: string;
          preferred_currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: "buyer" | "seller" | "both";
          preferred_language?: string;
          preferred_currency?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sellers: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          shop_slug: string;
          shop_description: string | null;
          shop_logo_url: string | null;
          shop_banner_url: string | null;
          tap_destination_id: string | null;
          tap_business_id: string | null;
          tap_onboarding_complete: boolean;
          rating_average: number;
          rating_count: number;
          total_sales: number;
          is_verified: boolean;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_name: string;
          shop_slug: string;
          shop_description?: string | null;
          shop_logo_url?: string | null;
          shop_banner_url?: string | null;
          tap_destination_id?: string | null;
          tap_business_id?: string | null;
          tap_onboarding_complete?: boolean;
          rating_average?: number;
          rating_count?: number;
          total_sales?: number;
          is_verified?: boolean;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          shop_name?: string;
          shop_slug?: string;
          shop_description?: string | null;
          shop_logo_url?: string | null;
          shop_banner_url?: string | null;
          tap_destination_id?: string | null;
          tap_business_id?: string | null;
          tap_onboarding_complete?: boolean;
          rating_average?: number;
          rating_count?: number;
          total_sales?: number;
          is_verified?: boolean;
          country?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          icon?: string | null;
          parent_id?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          currency: string;
          sku: string | null;
          stock_quantity: number;
          low_stock_threshold: number;
          images: string[];
          thumbnail_url: string | null;
          tags: string[];
          is_active: boolean;
          is_featured: boolean;
          is_flash_deal: boolean;
          flash_deal_ends_at: string | null;
          rating_average: number;
          rating_count: number;
          total_sold: number;
          shipping_weight: number | null;
          shipping_free: boolean;
          shipping_origin_country: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          category_id?: string | null;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          currency?: string;
          sku?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          images?: string[];
          thumbnail_url?: string | null;
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          is_flash_deal?: boolean;
          flash_deal_ends_at?: string | null;
          rating_average?: number;
          rating_count?: number;
          total_sold?: number;
          shipping_weight?: number | null;
          shipping_free?: boolean;
          shipping_origin_country?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          seller_id?: string;
          category_id?: string | null;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          currency?: string;
          sku?: string | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          images?: string[];
          thumbnail_url?: string | null;
          tags?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          is_flash_deal?: boolean;
          flash_deal_ends_at?: string | null;
          rating_average?: number;
          rating_count?: number;
          total_sold?: number;
          shipping_weight?: number | null;
          shipping_free?: boolean;
          shipping_origin_country?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_modifier: number;
          stock_quantity: number;
          attributes: Json;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku?: string | null;
          price_modifier?: number;
          stock_quantity?: number;
          attributes: Json;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          product_id?: string;
          name?: string;
          sku?: string | null;
          price_modifier?: number;
          stock_quantity?: number;
          attributes?: Json;
          image_url?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          product_id?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          full_name: string;
          phone: string | null;
          street_address: string;
          apartment: string | null;
          city: string;
          state: string | null;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          full_name: string;
          phone?: string | null;
          street_address: string;
          apartment?: string | null;
          city: string;
          state?: string | null;
          postal_code: string;
          country: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          label?: string;
          full_name?: string;
          phone?: string | null;
          street_address?: string;
          apartment?: string | null;
          city?: string;
          state?: string | null;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_id: string | null;
          seller_id: string | null;
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          currency: string;
          shipping_address: Json;
          shipping_method: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          estimated_delivery_date: string | null;
          payment_method: "whish" | "tap" | "cod";
          payment_ref_id: string | null;
          tap_transfer_id: string | null;
          cod_confirmed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          buyer_id?: string | null;
          seller_id?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          shipping_cost?: number;
          tax?: number;
          total: number;
          currency?: string;
          shipping_address: Json;
          shipping_method?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          estimated_delivery_date?: string | null;
          payment_method?: "whish" | "tap" | "cod";
          payment_ref_id?: string | null;
          tap_transfer_id?: string | null;
          cod_confirmed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          order_number?: string;
          buyer_id?: string | null;
          seller_id?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          total?: number;
          currency?: string;
          shipping_address?: Json;
          shipping_method?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          estimated_delivery_date?: string | null;
          payment_method?: "whish" | "tap" | "cod";
          payment_ref_id?: string | null;
          tap_transfer_id?: string | null;
          cod_confirmed_at?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_snapshot: Json;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_snapshot: Json;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_snapshot?: Json;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          body: string | null;
          images: string[];
          is_verified_purchase: boolean;
          helpful_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          body?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          helpful_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          user_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          body?: string | null;
          images?: string[];
          is_verified_purchase?: boolean;
          helpful_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          buyer_id: string | null;
          seller_id: string | null;
          product_id: string | null;
          last_message_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id?: string | null;
          seller_id?: string | null;
          product_id?: string | null;
          last_message_at?: string;
          created_at?: string;
        };
        Update: {
          buyer_id?: string | null;
          seller_id?: string | null;
          product_id?: string | null;
          last_message_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string | null;
          body: string;
          image_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id?: string | null;
          body: string;
          image_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          conversation_id?: string;
          sender_id?: string | null;
          body?: string;
          image_url?: string | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          link: string | null;
          is_read: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          link?: string | null;
          is_read?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          link?: string | null;
          is_read?: boolean;
          metadata?: Json;
        };
        Relationships: [];
      };
      review_replies: {
        Row: {
          id: string;
          review_id: string;
          seller_id: string;
          body: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          seller_id: string;
          body: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          review_id?: string;
          seller_id?: string;
          body?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      review_helpful_votes: {
        Row: {
          id: string;
          review_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          review_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
