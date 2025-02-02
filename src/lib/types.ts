export interface AccountStatus {
  account_status_id: number;
  name: string;
}

export interface AccountType {
  account_type_id: number;
  name: string;
}

export interface Address {
  address_id: number;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  region: string;
}

export interface BillItem {
  bill_item_id: number;
  bill_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Bill {
  bill_id: number;
  customer_id: number;
  customer_name: string;
  bill_details: string;
  bill_date: Date;
  due_date: Date;
  total_amount: number;
  bill_status: number;
  rate_id: number;
  date: Date;
}

export interface BillStatus {
  bill_status_id: number;
  name: string;
}

export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  billing_address_id: number | null;
  billing_cycle: string | null;
  account_type: number | null;
  account_status: number | null;
  region?: string;
}

export interface Meter {
  meter_id: number;
  customer_id: number;
  meter_number: string;
  installation_date: string; // Changed from Date to string to match Supabase
}

export interface PaymentMethod {
  payment_method_id: number;
  name: string;
}

export interface Payment {
  payment_id: number;
  bill_id: number;
  payment_method_id: number;
  payment_date: string;
  amount: number;
  payment_status: number;
  customer_id: number;
  payment_method: {
    name: string;
  };
  payment_status_name: string;
}

export interface PaymentStatus {
  payment_status_id: number;
  name: string;
}

export interface Rate {
  rate_id: number;
  usage_tier_start: number;
  usage_tier_end: number;
  price_per_m3: number;
  customer_type: string | number;
  region: string | null;
  tax: number;
  service_fee: number;
}

export interface WaterUsage {
  usage_id: number;
  meter_id: number;
  reading_date: Date;
  water_usage: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

// For Bills.tsx
export interface BillsRow extends Bill {}
export interface CustomersRow extends Customer {}
