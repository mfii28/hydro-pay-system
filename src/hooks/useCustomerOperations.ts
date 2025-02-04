import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useCustomerAuth } from './useCustomerAuth';

export function useCustomerOperations(refetchCustomers: () => Promise<void>) {
  const { toast } = useToast();
  const { checkSession } = useCustomerAuth();

  const createCustomer = async (customerData: Partial<Customer> & { meter_number?: string }) => {
    try {
      const isAuthenticated = await checkSession();
      if (!isAuthenticated) return;

      // Check if email already exists
      const { data: existingCustomer } = await supabase
        .from("customer")
        .select("email")
        .eq("email", customerData.email)
        .maybeSingle();

      if (existingCustomer) {
        toast({
          title: "Error",
          description: "A customer with this email already exists",
          variant: "destructive",
        });
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
        // Check specifically for duplicate email error
        if (customerError.code === '23505' && customerError.message?.includes('customer_email_key')) {
          toast({
            title: "Error",
            description: "A customer with this email already exists",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to create customer",
            variant: "destructive",
          });
        }
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
            meter_number: customerData.meter_number || `M${customerResult.customer_id}`,
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

      refetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async (customerId: number, customerData: Partial<Customer>) => {
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
        .eq("customer_id", customerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer updated successfully",
      });

      refetchCustomers();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (customer: Customer) => {
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

      refetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  return {
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}