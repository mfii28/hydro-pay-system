import { createClient } from '@supabase/supabase-js';
import { Customer, Meter, Address } from "@/lib/types";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const supabaseUrl = "https://oabmmrxoogccnuyppfmu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hYm1tcnhvb2djY251eXBwZm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMjI0NjMsImV4cCI6MjA1Mzg5ODQ2M30.G1hyI7CPwhd_q0vAXbyfODPvjGiyv587_3nemXFkLI0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing from environment variables.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define AccountType and AccountStatus as arrays for dropdown options
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [isDeletingCustomer, setIsDeletingCustomer] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [editingCustomer, setEditingCustomer] = useState<{
    customer_id: number;
    name: string;
    email: string;
    phone: string;
    billing_address_id?: number | null;
    billing_cycle?: string | null;
    account_type?: number | null;
    account_status?: number | null;
    meterNumber?: string | null
  } | null>(null);

  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "customer_id">>({
    name: "",
    email: "",
    phone: "",
    billing_cycle: "",
    billing_address_id: null,
    account_type: null,
    account_status: null,
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from("Customer").select("*");

      if (error) {
        console.error("Error fetching customers:", error);
        return;
      }

      if (data) {
        setCustomers(data as Customer[]);
        await fetchMeters();
        await fetchAddresses();
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchMeters = async () => {
    try {
      const { data, error } = await supabase.from("meter").select("*");

      if (error) {
        console.error("Error fetching meters:", error);
        return;
      }

      if (data) {
        setMeters(data as Meter[]);
      }
    } catch (error) {
      console.error("Error fetching meters:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase.from("address").select("*");

      if (error) {
        console.error("Error fetching addresses:", error);
        return;
      }

      if (data) {
        setAddresses(data as Address[]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    const customerMeter = meters.find((meter) => meter.customer_id === customer.customer_id)
    setEditingCustomer({
      customer_id: customer.customer_id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      billing_address_id: customer.billing_address_id,
      billing_cycle: customer.billing_cycle,
      account_type: customer.account_type,
      account_status: customer.account_status,
      meterNumber: customerMeter?.meter_number || ''
    });
    setIsEditingCustomer(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      setDeletingCustomer(customer);
      setIsDeletingCustomer(true);
      const { error } = await supabase
        .from("Customer")
        .delete()
        .eq("customer_id", customer.customer_id);

      if (error) {
        console.error("Error deleting customer:", error);
        return;
      }

      if (!error) {
        const { error: errorMeter } = await supabase
          .from("meter")
          .delete()
          .eq("customer_id", customer.customer_id);
        if (errorMeter) {
          console.error("Error deleting meter:", errorMeter);
          return;
        }
        setCustomers(customers.filter((c) => c.customer_id !== customer.customer_id));
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeletingCustomer(false);
      setDeletingCustomer(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeletingCustomer(false);
    setDeletingCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    const billingAddress = addresses.find(
      (address) => address.address_id === customer.billing_address_id
    )?.address_line || "";

    const meterNumber = meters.find(
      (meter) => meter.customer_id === customer.customer_id
    )?.meter_number || "";

    return (
      customer.name.toLowerCase().includes(lowerCaseQuery) ||
      customer.email.toLowerCase().includes(lowerCaseQuery) ||
      customer.billing_cycle?.toLowerCase().includes(lowerCaseQuery) ||
      billingAddress.toLowerCase().includes(lowerCaseQuery) ||
      meterNumber.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = event.target;
    setNewCustomer((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data: addressData, error: addressError } = await supabase
        .from("address")
        .insert([
          {
            address_line: newCustomer.billing_address_id?.toString() || "",
            city: "",
            state: "",
            postal_code: "",
            region: "",
          },
        ])
        .select();

      if (addressError) {
        console.error("Error adding address:", addressError);
        return;
      }

      const { data: customerData, error: customerError } = await supabase
        .from("Customer")
        .insert([
          {
            ...newCustomer,
            billing_address_id: addressData![0].address_id,
            account_status: 1,
            account_type: 1,
          },
        ])
        .select();

      if (customerError) {
        console.error("Error adding customer:", customerError);
        return;
      }

      const { data: meterData, error: meterError } = await supabase
      .from("meter")
      .insert([{}])
      .select();
      if (meterError) {
        console.error("Error adding meter:", meterError);
        return;
      }
      if (customerData) {
        setCustomers([...customers, customerData[0]]);
        setIsAddingCustomer(false);
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          billing_cycle: "",
          billing_address_id: null,
          account_type: null,
          account_status: null,
        });
        const { error } = await supabase
        .from("meter")
        .update({
          customer_id: customerData[0].customer_id,
          meter_number: `M${customerData[0].customer_id}`,
          status: 1,
          type: 1,
          last_reading: 0,
          current_reading: 0
        })
        .eq("meter_id", meterData![0].meter_id);

      if (error) {
        console.error("Error updating meter:", error);
        return;
      }
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const handleUpdateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
    const { meterNumber, ...updatedCustomer } = editingCustomer;
    const { billing_address_id, ...restCustomer } = updatedCustomer;

    try {
      if (billing_address_id) {
        const { error: errorAddress } = await supabase
          .from("address")
          .update({
            address_line: editingCustomer.billing_address_id,
          })
          .eq("address_id", billing_address_id);
        if (errorAddress) {
          console.error("Error updating address:", errorAddress);
          return;
        }
      }

      const { error } = await supabase
        .from("Customer")
        .update({
          ...restCustomer
        })
        .eq("customer_id", editingCustomer.customer_id);

      if (error) throw error;

      fetchCustomers();
      setIsEditingCustomer(false);
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

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
              <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add New Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                      Enter the customer's details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleAddCustomer}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={newCustomer.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={newCustomer.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={newCustomer.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_address_id">Address</Label>
                        <Input
                          id="billing_address_id"
                          placeholder="123 Main St"
                          value={newCustomer.billing_address_id?.toString() || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="billing_cycle">Billing Cycle</Label>
                        <Input
                          id="billing_cycle"
                          placeholder="e.g., monthly, quarterly"
                          value={newCustomer.billing_cycle}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account_type">Account Type</Label>
                        <select
                          id="account_type"
                          className="border rounded-md"
                          value={newCustomer.account_type || ""}
                          onChange={handleInputChange}
                        >
                          {accountTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="account_status">Account Status</Label>
                        <select
                          id="account_status"
                          className="border rounded-md"
                          value={newCustomer.account_status || ""}
                          onChange={handleInputChange}
                        >
                          {accountStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddingCustomer(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Add Customer</Button>
                      </DialogFooter>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                    placeholder="Search by name, email, or meter number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Billing Address</TableHead>
                      <TableHead>Meter Number</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Account Type</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.customer_id}>
                        <TableCell>{customer.customer_id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>
                          {addresses.find(
                            (address) => address.address_id === customer.billing_address_id
                          )?.address_line}
                        </TableCell>
                        <TableCell>
                          {meters.find(
                            (meter) => meter.customer_id === customer.customer_id
                          )?.meter_number}
                        </TableCell>
                        <TableCell>{customer.billing_cycle}</TableCell>
                        <TableCell>
                          {accountTypes.find(
                            (type) => type.id === customer.account_type
                          )?.name}
                        </TableCell>
                        <TableCell>
                          {accountStatuses.find(
                            (status) => status.id === customer.account_status
                          )?.name}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleDeleteCustomer(customer)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
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