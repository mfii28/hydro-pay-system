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
      accountstatus: {
        Row: {
          account_status_id: number
          name: string
        }
        Insert: {
          account_status_id?: never
          name: string
        }
        Update: {
          account_status_id?: never
          name?: string
        }
        Relationships: []
      }
      accounttype: {
        Row: {
          account_type_id: number
          name: string
        }
        Insert: {
          account_type_id?: never
          name: string
        }
        Update: {
          account_type_id?: never
          name?: string
        }
        Relationships: []
      }
      address: {
        Row: {
          address_id: number
          address_line: string
          city: string
          postal_code: string
          region: string
          state: string
        }
        Insert: {
          address_id?: never
          address_line: string
          city: string
          postal_code: string
          region: string
          state: string
        }
        Update: {
          address_id?: never
          address_line?: string
          city?: string
          postal_code?: string
          region?: string
          state?: string
        }
        Relationships: []
      }
      adminuser: {
        Row: {
          email: string
          id: number
          password_hash: string
        }
        Insert: {
          email?: string
          id?: never
          password_hash?: string
        }
        Update: {
          email?: string
          id?: never
          password_hash?: string
        }
        Relationships: []
      }
      bill: {
        Row: {
          bill_date: string
          bill_id: number
          bill_status: number
          customer_id: number
          due_date: string
          total_amount: number
        }
        Insert: {
          bill_date: string
          bill_id?: never
          bill_status: number
          customer_id: number
          due_date: string
          total_amount: number
        }
        Update: {
          bill_date?: string
          bill_id?: never
          bill_status?: number
          customer_id?: number
          due_date?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "bill_bill_status_fkey"
            columns: ["bill_status"]
            isOneToOne: false
            referencedRelation: "billstatus"
            referencedColumns: ["bill_status_id"]
          },
          {
            foreignKeyName: "bill_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      billitem: {
        Row: {
          amount: number
          bill_id: number
          bill_item_id: number
          description: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount: number
          bill_id: number
          bill_item_id?: never
          description: string
          quantity: number
          unit_price: number
        }
        Update: {
          amount?: number
          bill_id?: number
          bill_item_id?: never
          description?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "billitem_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill"
            referencedColumns: ["bill_id"]
          },
        ]
      }
      billstatus: {
        Row: {
          bill_status_id: number
          name: string
        }
        Insert: {
          bill_status_id?: never
          name: string
        }
        Update: {
          bill_status_id?: never
          name?: string
        }
        Relationships: []
      }
      customer: {
        Row: {
          account_status: number | null
          account_type: number | null
          billing_address_id: number | null
          billing_cycle: string | null
          customer_id: number
          email: string
          name: string
          phone: string
        }
        Insert: {
          account_status?: number | null
          account_type?: number | null
          billing_address_id?: number | null
          billing_cycle?: string | null
          customer_id?: never
          email: string
          name: string
          phone: string
        }
        Update: {
          account_status?: number | null
          account_type?: number | null
          billing_address_id?: number | null
          billing_cycle?: string | null
          customer_id?: never
          email?: string
          name?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_account_status_fkey"
            columns: ["account_status"]
            isOneToOne: false
            referencedRelation: "accountstatus"
            referencedColumns: ["account_status_id"]
          },
          {
            foreignKeyName: "customer_account_type_fkey"
            columns: ["account_type"]
            isOneToOne: false
            referencedRelation: "accounttype"
            referencedColumns: ["account_type_id"]
          },
          {
            foreignKeyName: "customer_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "address"
            referencedColumns: ["address_id"]
          },
        ]
      }
      meter: {
        Row: {
          customer_id: number
          installation_date: string
          meter_id: number
          meter_number: string
        }
        Insert: {
          customer_id: number
          installation_date: string
          meter_id?: never
          meter_number: string
        }
        Update: {
          customer_id?: number
          installation_date?: string
          meter_id?: never
          meter_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "meter_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number
          bill_id: number
          payment_date: string
          payment_id: number
          payment_method_id: number
          payment_status: number
        }
        Insert: {
          amount: number
          bill_id: number
          payment_date: string
          payment_id?: never
          payment_method_id: number
          payment_status: number
        }
        Update: {
          amount?: number
          bill_id?: number
          payment_date?: string
          payment_id?: never
          payment_method_id?: number
          payment_status?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bill"
            referencedColumns: ["bill_id"]
          },
          {
            foreignKeyName: "payment_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "paymentmethod"
            referencedColumns: ["payment_method_id"]
          },
          {
            foreignKeyName: "payment_payment_status_fkey"
            columns: ["payment_status"]
            isOneToOne: false
            referencedRelation: "paymentstatus"
            referencedColumns: ["payment_status_id"]
          },
        ]
      }
      paymentmethod: {
        Row: {
          name: string
          payment_method_id: number
        }
        Insert: {
          name: string
          payment_method_id?: never
        }
        Update: {
          name?: string
          payment_method_id?: never
        }
        Relationships: []
      }
      paymentstatus: {
        Row: {
          name: string
          payment_status_id: number
        }
        Insert: {
          name: string
          payment_status_id?: never
        }
        Update: {
          name?: string
          payment_status_id?: never
        }
        Relationships: []
      }
      rate: {
        Row: {
          customer_type: number
          price_per_m3: number
          rate_id: number
          region: string | null
          service_fee: number
          tax: number
          usage_tier_end: number
          usage_tier_start: number
        }
        Insert: {
          customer_type: number
          price_per_m3: number
          rate_id?: never
          region?: string | null
          service_fee: number
          tax: number
          usage_tier_end: number
          usage_tier_start: number
        }
        Update: {
          customer_type?: number
          price_per_m3?: number
          rate_id?: never
          region?: string | null
          service_fee?: number
          tax?: number
          usage_tier_end?: number
          usage_tier_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "rate_customer_type_fkey"
            columns: ["customer_type"]
            isOneToOne: false
            referencedRelation: "accounttype"
            referencedColumns: ["account_type_id"]
          },
        ]
      }
      waterusage: {
        Row: {
          meter_id: number
          reading_date: string
          usage_id: number
          water_usage: number
        }
        Insert: {
          meter_id: number
          reading_date: string
          usage_id?: never
          water_usage: number
        }
        Update: {
          meter_id?: number
          reading_date?: string
          usage_id?: never
          water_usage?: number
        }
        Relationships: [
          {
            foreignKeyName: "waterusage_meter_id_fkey"
            columns: ["meter_id"]
            isOneToOne: false
            referencedRelation: "meter"
            referencedColumns: ["meter_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
