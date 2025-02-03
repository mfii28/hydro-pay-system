import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Customer, Address, Meter } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export function useCustomers() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    checkSession();
    fetchCustomers();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

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

  const handleCreateCustomer = async (customerData: Partial<Customer>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
        return;
      }

      // Create address with null values
      const { data: addressData, error: addressError } = await supabase
        .from("address")
        .insert([
          {
            address_line: null,
            city: null,
            state: null,
            postal_code: null,
            region: null,
          },
        ])
        .select()
        .single();

      if (addressError) {
        console.error("Error creating address:", addressError);
        toast({
          title: "Error",
          description: "Failed to create address",
          variant: "destructive",
        });
        return;
      }

      if (!addressData) {
        toast({
          title: "Error",
          description: "Failed to create address - no data returned",
          variant: "destructive",
        });
        return;
      }

      // Create customer with the new address ID
      const { data: customerResult, error: customerError } = await supabase
        .from("customer")
        .insert([
          {
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            billing_address_id: addressData.address_id,
            billing_cycle: customerData.billing_cycle,
            account_type: customerData.account_type,
            account_status: customerData.account_status,
          },
        ])
        .select()
        .single();

      if (customerError) {
        console.error("Error creating customer:", customerError);
        toast({
          title: "Error",
          description: "Failed to create customer",
          variant: "destructive",
        });
        return;
      }

      if (!customerResult) {
        toast({
          title: "Error",
          description: "Failed to create customer - no data returned",
          variant: "destructive",
        });
        return;
      }

      // Create meter for the new customer
      const { error: meterError } = await supabase
        .from("meter")
        .insert([
          {
            customer_id: customerResult.customer_id,
            meter_number: `M${customerResult.customer_id}`,
            installation_date: new Date().toISOString(),
          },
        ]);

      if (meterError) {
        console.error("Error creating meter:", meterError);
        toast({
          title: "Error",
          description: "Failed to create meter",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Customer created successfully",
      });

      setIsAddingCustomer(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return;

    try {
      const { error } = await supabase
        .from("customer")
        .update({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          billing_cycle: customerData.billing_cycle,
          account_type: customerData.account_type,
          account_status: customerData.account_status,
        })
        .eq("customer_id", editingCustomer.customer_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      setEditingCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      const { error: meterError } = await supabase
        .from("meter")
        .delete()
        .eq("customer_id", customer.customer_id);

      if (meterError) throw meterError;

      const { error: customerError } = await supabase
        .from("customer")
        .delete()
        .eq("customer_id", customer.customer_id);

      if (customerError) throw customerError;

      if (customer.billing_address_id) {
        const { error: addressError } = await supabase
          .from("address")
          .delete()
          .eq("address_id", customer.billing_address_id);

        if (addressError) throw addressError;
      }

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    );
  });

  return {
    customers: filteredCustomers,
    meters,
    addresses,
    searchQuery,
    setSearchQuery,
    isAddingCustomer,
    setIsAddingCustomer,
    editingCustomer,
    setEditingCustomer,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
  };
}