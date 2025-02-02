import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Customer, Meter, Address } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerList } from "@/components/customers/CustomerList";

const accountTypes = [
  { id: 1, name: "Residential" },
  { id: 2, name: "Commercial" },
];

const accountStatuses = [
  { id: 1, name: "Active" },
  { id: 2, name: "Suspended" },
  { id: 3, name: "Overdue" },
];

export default function Customers() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
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
      // Create address first
      const { data: addressData, error: addressError } = await supabase
        .from("address")
        .insert([
          {
            address_line: "",
            city: "",
            state: "",
            postal_code: "",
            region: "",
          },
        ])
        .select()
        .single();

      if (addressError) throw addressError;

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

      if (customerError) throw customerError;

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

      if (meterError) throw meterError;

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-water-800">
                Manage Customers
              </h1>
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsAddingCustomer(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add New Customer
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{customers.length}</p>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Search Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="search"
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerList
                  customers={customers}
                  addresses={addresses}
                  meters={meters}
                  accountTypes={accountTypes}
                  accountStatuses={accountStatuses}
                  onEdit={setEditingCustomer}
                  onDelete={handleDeleteCustomer}
                />
              </CardContent>
            </Card>
          </div>
        </main>

        <CustomerForm
          isOpen={isAddingCustomer}
          onClose={() => setIsAddingCustomer(false)}
          onSubmit={handleCreateCustomer}
          title="Add New Customer"
          description="Enter the customer's details below."
          accountTypes={accountTypes}
          accountStatuses={accountStatuses}
        />

        {editingCustomer && (
          <CustomerForm
            isOpen={!!editingCustomer}
            onClose={() => setEditingCustomer(null)}
            onSubmit={handleUpdateCustomer}
            customer={editingCustomer}
            title="Edit Customer"
            description="Update the customer's details below."
            accountTypes={accountTypes}
            accountStatuses={accountStatuses}
          />
        )}
      </div>
    </SidebarProvider>
  );
}