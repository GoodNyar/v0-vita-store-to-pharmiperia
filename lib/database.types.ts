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
      addresses: {
        Row: {
          city: string
          country: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string | null
          postal_code: string | null
          street: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          postal_code?: string | null
          street: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          postal_code?: string | null
          street?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_name: string
          id: string
          order_id: string | null
          properties: Json
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          id?: string
          order_id?: string | null
          properties?: Json
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          id?: string
          order_id?: string | null
          properties?: Json
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          country: string | null
          created_at: string | null
          description_lv: string | null
          description_ru: string | null
          id: string
          is_featured: boolean | null
          logo_url: string | null
          name: string
          slug: string
          website_url: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description_lv?: string | null
          description_ru?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          website_url?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description_lv?: string | null
          description_ru?: string | null
          id?: string
          is_featured?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description_lv: string | null
          description_ru: string | null
          id: string
          image_url: string | null
          name_lv: string
          name_ru: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description_lv?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name_lv: string
          name_ru: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description_lv?: string | null
          description_ru?: string | null
          id?: string
          image_url?: string | null
          name_lv?: string
          name_ru?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          row_count: number
          source: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          row_count?: number
          source: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          row_count?: number
          source?: string
          status?: string
        }
        Relationships: []
      }
      feed_import_rows: {
        Row: {
          batch_id: string
          created_at: string
          external_id: string
          id: string
          product_id: string | null
          raw_payload: Json
          validation_errors: Json | null
          validation_status: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          external_id: string
          id?: string
          product_id?: string | null
          raw_payload: Json
          validation_errors?: Json | null
          validation_status?: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          external_id?: string
          id?: string
          product_id?: string | null
          raw_payload?: Json
          validation_errors?: Json | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_import_rows_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "feed_import_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_import_rows_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_reservations: {
        Row: {
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          released_at: string | null
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          released_at?: string | null
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          released_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_reservations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      market_product_prices: {
        Row: {
          created_at: string
          currency: string
          id: string
          market_id: string
          original_price_cents: number | null
          price_cents: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          market_id: string
          original_price_cents?: number | null
          price_cents: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          market_id?: string
          original_price_cents?: number | null
          price_cents?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_product_prices_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      market_shipping_methods: {
        Row: {
          carrier: string
          code: string
          cost_cents: number
          created_at: string
          currency: string
          id: string
          is_active: boolean
          market_id: string
          name: string
          sort_order: number
          supports_parcel_locker: boolean
        }
        Insert: {
          carrier: string
          code: string
          cost_cents: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          market_id: string
          name: string
          sort_order?: number
          supports_parcel_locker?: boolean
        }
        Update: {
          carrier?: string
          code?: string
          cost_cents?: number
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          market_id?: string
          name?: string
          sort_order?: number
          supports_parcel_locker?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "market_shipping_methods_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          code: string
          country_iso: string
          created_at: string
          currency: string
          default_locale: string
          id: string
          is_active: boolean
          legal_entity_name: string | null
          locales: string[]
          name: string
          oss_enabled: boolean
          stripe_tax_behavior: string
          updated_at: string
          vat_rate_bps: number
        }
        Insert: {
          code: string
          country_iso: string
          created_at?: string
          currency?: string
          default_locale: string
          id?: string
          is_active?: boolean
          legal_entity_name?: string | null
          locales: string[]
          name: string
          oss_enabled?: boolean
          stripe_tax_behavior?: string
          updated_at?: string
          vat_rate_bps: number
        }
        Update: {
          code?: string
          country_iso?: string
          created_at?: string
          currency?: string
          default_locale?: string
          id?: string
          is_active?: boolean
          legal_entity_name?: string | null
          locales?: string[]
          name?: string
          oss_enabled?: boolean
          stripe_tax_behavior?: string
          updated_at?: string
          vat_rate_bps?: number
        }
        Relationships: []
      }
      parcel_stations: {
        Row: {
          address: string
          carrier: string
          city: string
          created_at: string
          external_id: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          market_id: string
          name: string
          postal_code: string | null
        }
        Insert: {
          address: string
          carrier: string
          city: string
          created_at?: string
          external_id: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          market_id: string
          name: string
          postal_code?: string | null
        }
        Update: {
          address?: string
          carrier?: string
          city?: string
          created_at?: string
          external_id?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          market_id?: string
          name?: string
          postal_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_stations_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          quantity: number
          total_price_cents: number
          unit_price_cents: number
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          quantity: number
          total_price_cents: number
          unit_price_cents: number
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          quantity?: number
          total_price_cents?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          analytics_event_id: string | null
          confirmation_email_sent_at: string | null
          created_at: string | null
          currency: string
          discount_cents: number
          email: string
          first_name: string
          id: string
          inventory_adjusted_at: string | null
          last_name: string
          locale: string
          market_code: string
          notes: string | null
          order_number: string
          parcel_station: string | null
          payment_intent_id: string | null
          payment_status: string | null
          phone: string | null
          promo_code_id: string | null
          promo_consumed_at: string | null
          refund_notice_sent_at: string | null
          review_request_email_sent_at: string | null
          shipped_email_sent_at: string | null
          shipping_address: Json | null
          shipping_cost_cents: number
          shipping_method: string
          status: string | null
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          analytics_event_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string | null
          currency?: string
          discount_cents: number
          email: string
          first_name: string
          id?: string
          inventory_adjusted_at?: string | null
          last_name: string
          locale?: string
          market_code?: string
          notes?: string | null
          order_number: string
          parcel_station?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          phone?: string | null
          promo_code_id?: string | null
          promo_consumed_at?: string | null
          refund_notice_sent_at?: string | null
          review_request_email_sent_at?: string | null
          shipped_email_sent_at?: string | null
          shipping_address?: Json | null
          shipping_cost_cents: number
          shipping_method: string
          status?: string | null
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          analytics_event_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string | null
          currency?: string
          discount_cents?: number
          email?: string
          first_name?: string
          id?: string
          inventory_adjusted_at?: string | null
          last_name?: string
          locale?: string
          market_code?: string
          notes?: string | null
          order_number?: string
          parcel_station?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
          phone?: string | null
          promo_code_id?: string | null
          promo_consumed_at?: string | null
          refund_notice_sent_at?: string | null
          review_request_email_sent_at?: string | null
          shipped_email_sent_at?: string | null
          shipping_address?: Json | null
          shipping_cost_cents?: number
          shipping_method?: string
          status?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_analytics_event_id_fkey"
            columns: ["analytics_event_id"]
            isOneToOne: false
            referencedRelation: "analytics_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          currency: string
          id: string
          is_active: boolean
          is_default: boolean
          name_lv: string | null
          name_ru: string | null
          original_price_cents: number | null
          price_cents: number | null
          product_id: string
          sku: string
          slug_suffix: string | null
          sort_order: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name_lv?: string | null
          name_ru?: string | null
          original_price_cents?: number | null
          price_cents?: number | null
          product_id: string
          sku: string
          slug_suffix?: string | null
          sort_order?: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name_lv?: string | null
          name_ru?: string | null
          original_price_cents?: number | null
          price_cents?: number | null
          product_id?: string
          sku?: string
          slug_suffix?: string | null
          sort_order?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          created_at: string | null
          currency: string
          description_lv: string | null
          description_ru: string | null
          how_to_use_lv: string | null
          how_to_use_ru: string | null
          id: string
          ingredients: string | null
          is_active: boolean | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          name_lv: string
          name_ru: string
          original_price_cents: number | null
          price_cents: number
          rating: number | null
          review_count: number | null
          search_vector: string | null
          sku: string
          slug: string
          stock_quantity: number | null
          updated_at: string | null
          volume: string | null
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string
          description_lv?: string | null
          description_ru?: string | null
          how_to_use_lv?: string | null
          how_to_use_ru?: string | null
          id?: string
          ingredients?: string | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name_lv: string
          name_ru: string
          original_price_cents?: number | null
          price_cents: number
          rating?: number | null
          review_count?: number | null
          sku: string
          slug: string
          stock_quantity?: number | null
          updated_at?: string | null
          volume?: string | null
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string
          description_lv?: string | null
          description_ru?: string | null
          how_to_use_lv?: string | null
          how_to_use_ru?: string | null
          id?: string
          ingredients?: string | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name_lv?: string
          name_ru?: string
          original_price_cents?: number | null
          price_cents?: number
          rating?: number | null
          review_count?: number | null
          sku?: string
          slug?: string
          stock_quantity?: number | null
          updated_at?: string | null
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          currency: string
          id: string
          product_id: string
          quantity: number
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          currency?: string
          id?: string
          product_id: string
          quantity: number
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          currency?: string
          id?: string
          product_id?: string
          quantity?: number
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          abandoned_email_sent_at: string | null
          created_at: string
          guest_token: string | null
          id: string
          locale: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          abandoned_email_sent_at?: string | null
          created_at?: string
          guest_token?: string | null
          id?: string
          locale?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          abandoned_email_sent_at?: string | null
          created_at?: string
          guest_token?: string | null
          id?: string
          locale?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          balance: number
          tier: string
          total_earned: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          tier?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          tier?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points: number
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          loyalty_points: number | null
          phone: string | null
          postal_code: string | null
          preferred_language: string | null
          role: string
          updated_at: string | null
          welcome_email_sent_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          loyalty_points?: number | null
          phone?: string | null
          postal_code?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string | null
          welcome_email_sent_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          loyalty_points?: number | null
          phone?: string | null
          postal_code?: string | null
          preferred_language?: string | null
          role?: string
          updated_at?: string | null
          welcome_email_sent_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          currency: string
          discount_type: string
          discount_value_cents: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount_cents: number
          used_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          currency?: string
          discount_type: string
          discount_value_cents: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount_cents: number
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          currency?: string
          discount_type?: string
          discount_value_cents?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount_cents?: number
          used_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      return_requests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_id: string
          reason: string
          refund_amount_cents: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_id: string
          reason: string
          refund_amount_cents?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string
          reason?: string
          refund_amount_cents?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          created_at: string
          id: string
          locale: string
          query: string
          results_count: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          locale?: string
          query: string
          results_count?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          locale?: string
          query?: string
          results_count?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          id: string
          processed_at: string | null
          type: string
        }
        Insert: {
          id: string
          processed_at?: string | null
          type: string
        }
        Update: {
          id?: string
          processed_at?: string | null
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accrue_loyalty_for_order: { Args: { p_order_id: string }; Returns: boolean }
      decrement_stock: { Args: { p_order_id: string }; Returns: boolean }
      has_staff_role: { Args: { allowed_roles: string[] }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      merge_cart_item_atomic: {
        Args: {
          p_cart_id: string
          p_product_id: string
          p_add_quantity: number
          p_unit_price_cents: number
          p_currency?: string
        }
        Returns: number
      }
      validate_promo_code: {
        Args: { p_code: string; p_subtotal_cents: number }
        Returns: Json
      }
      consume_promo_code: {
        Args: { p_promo_id: string; p_order_id: string }
        Returns: boolean
      }
      search_products_vector: {
        Args: { p_query: string; p_limit?: number }
        Returns: { product_id: string; rank: number }[]
      }
      search_product_facets_vector: {
        Args: { p_query: string }
        Returns: Json
      }
      reserve_inventory_for_order: {
        Args: { p_order_id: string; p_ttl_minutes?: number }
        Returns: boolean
      }
      release_inventory_reservation: {
        Args: { p_order_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
