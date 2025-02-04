import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Customer, Address, Meter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from './useCustomerAuth';

export function useCustomerData() {
  const { toast } = useToast();
  const { checkSession } = useCustomerAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const fetchCustomers = async () => {
    try {
      const isAuthenticated = await checkSession();
      if (!isAuthenticated) return;

      const { data: customerData, error: customerError } = await supabase
        .from("customer")
        .select("*");

      if (customerError) throw customerError;

      const { data: meterData, error: meterError } = await supabase
        .from("meter")
        .select("*");

      if (meterError) throw meterError;

      const { data: addressData, error: addressError } = await supabase
        .from("address")
        .select("*");

      if (addressError) throw addressError;

      setCustomers(customerData || []);
      setMeters(meterData || []);
      setAddresses(addressData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers data",
        variant: "destructive",
      });
    }
  };

  return {
    customers,
    meters,
    addresses,
    fetchCustomers,
  };
}