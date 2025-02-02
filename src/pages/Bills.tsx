import { Customer, Bill, BillsRow, CustomersRow } from "../lib/types";
import React, { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import {
  Card,
  CardContent,
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  Download,
  Search,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function Bills() {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bills, setBills] = useState<BillsRow[]>([]);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from("bill")  
        .select("*") as { data: BillsRow[] | null; error: any }; 
      if (error) {
        console.error("Error fetching bills:", error);
        return;
      }
      if (data) {
        const fetchedBills = data as BillsRow[];
        setBills(fetchedBills);
      }
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customer")  
        .select("*") as { data: CustomersRow[] | null; error: any };
      if (error) {
        console.error("Error fetching customers:", error);
        return;
      }
      if (data) {
        const fetchedCustomers = data as Customer[];
        setCustomers(fetchedCustomers);
      }
    }  catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleCustomerSelect = (customerId: string) => {   
    setSelectedCustomers((prev) => {
      if (prev.includes(customerId)) {
        return prev.filter((id) => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  React.useEffect(() => {
    fetchCustomers();
    fetchBills();
  }, []);

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((customer) => customer.customer_id.toString()));
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();  
    return (
      customer.name.toLowerCase().includes(lowerCaseQuery) ||
      customer.email.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h1 className="text-3xl font-bold text-water-800">
                Generate Bills
              </h1>
              <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                <Button
                  className="flex items-center gap-2"
                  disabled={selectedCustomers.length === 0}
                >
                  <FileText className="h-4 w-4" />
                  Generate for {selectedCustomers.length} Selected
                </Button>
                <Button className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  Generate All
                </Button>
                <Button
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Bills Total  
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                  </p>
                  {bills.reduce((sum, bill) => sum + (bill.total_amount || 0), 0).toFixed(2)}
                </CardContent> 
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customers List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Checkbox
                          checked={
                            selectedCustomers.length ===
                              filteredCustomers.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.customer_id}>
                        <TableCell className="font-medium">
                           <Checkbox
                            checked={selectedCustomers.includes(customer.customer_id.toString())} 
                            onCheckedChange={() => handleCustomerSelect(customer.customer_id.toString())}
                          />
                        </TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell className="text-right">...</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
