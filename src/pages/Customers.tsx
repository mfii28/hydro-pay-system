import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerList } from "@/components/customers/CustomerList";
import { useCustomers } from "@/hooks/useCustomers";

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
  const {
    customers,
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
  } = useCustomers();

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