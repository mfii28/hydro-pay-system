import { Bill, Customer, Rate } from "@/lib/types";
import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, File, FileDown, FilePlus, Printer, Settings, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const mockRates: Rate[] = [ {
    rate_id: 1,
    usage_tier_start: 0,
    usage_tier_end: 10,
    price_per_m3: 5.0,
    customer_type: "residential",
    region: null,
    tax: 0.15,
    service_fee: 5,
  },
  {
    rate_id: 2,
    usage_tier_start: 11,
    usage_tier_end: 20,
    price_per_m3: 10.0,
    customer_type: "residential",
    region: null,
    tax: 0.15,
    service_fee: 5,
  },
  {
    rate_id: 3,
    usage_tier_start: 0,
    usage_tier_end: 10,
    price_per_m3: 7.5,
    customer_type: "commercial",
    region: null,
    tax: 0.20,
    service_fee: 10,
  },
  {
    rate_id: 4,
    usage_tier_start: 11,
    usage_tier_end: 20,
    price_per_m3: 15.0,
    customer_type: "commercial",
    region: null,
    tax: 0.20,
    service_fee: 10,
  },
];

  {
    customer_id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    region: "Region B",
  },
  {
    customer_id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    region: "Region A",
  },
  {
    customer_id: 4,
    name: "Bob Williams",
    email: "bob.williams@example.com",
    region: "Region C",
  },
];

const mockBills: Bill[] = [
  {
    bill_id: 1,
    customer_id: 1,
    customer_name: "John Doe",
    bill_details: "Bill details for John Doe",
    rate_id: 1,
    date: new Date(),
  },
];

export default function GenerateBills() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);
  const [previewBill, setPreviewBill] = useState<Bill | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(lowerCaseQuery) ||
      customer.email.toLowerCase().includes(lowerCaseQuery) ||
      customer.region.toLowerCase().includes(lowerCaseQuery)
    );
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomers((prevSelectedCustomers) =>
      prevSelectedCustomers.includes(customerId)
        ? prevSelectedCustomers.filter((id) => id !== customerId)
        : [...prevSelectedCustomers, customerId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer) => customer.customer_id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const generateBillsForSelected = () => {
    const newBills = selectedCustomers.map((customerId) => {
      const customer = customers.find((c) => c.customer_id === customerId);
      const newBillId =
        Math.max(...bills.map((bill) => bill.bill_id), 0) + 1;
      return {
        bill_id: newBillId,
        customer_id: customerId,
        customer_name: customer?.name || "N/A",
        bill_details: `Bill for ${customer?.name || "N/A"}`,
        rate_id: 1,
        date: new Date(),
      };
    });
    setBills([...bills, ...newBills]);
  };

  const generateAllBills = () => {
    const newBills = customers.map((customer) => {
      const newBillId =
        Math.max(...bills.map((bill) => bill.bill_id), 0) + 1;
      return {
        bill_id: newBillId,
        customer_id: customer.customer_id,
        customer_name: customer.name,
        bill_details: `Bill for ${customer.name}`,
        rate_id: 1,
        date: new Date(),
      };
    });
    setBills([...bills, ...newBills]);
  };

  const openBillPreview = (bill: Bill) => {
    setPreviewBill(bill);
    setIsBillPreviewOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-water-800">
                Generate Bills
              </h1>
            </div>

            <div className="mb-8 flex items-center justify-start gap-4">
              <Button className="flex items-center gap-2" onClick={generateBillsForSelected}>
                  <FilePlus className="h-4 w-4"/>
                  Generate for Selected
              </Button>
              <Button className="flex items-center gap-2" onClick={generateAllBills}>
                <FilePlus className="h-4 w-4"/>
                Generate All
              </Button>
                <Button className="flex items-center gap-2" >
                    <FileDown className="h-4 w-4"/>
                    Download All
                </Button>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    type="search"
                    placeholder="Search by name or region"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Checkbox
                          id="selectAll"
                          checked={
                            selectedCustomers.length === customers.length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Region</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.customer_id}>
                        <TableCell>
                          <Checkbox
                            id={`customer-${customer.customer_id}`}
                            checked={selectedCustomers.includes(
                              customer.customer_id
                            )}
                            onCheckedChange={() =>
                              handleCustomerSelect(customer.customer_id)
                            }
                          />
                        </TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.region}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Generated Bills</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Bill Details</TableHead>
                      <TableHead>Rate ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.bill_id}>
                        <TableCell>{bill.bill_id}</TableCell>
                        <TableCell>{bill.customer_name}</TableCell>
                        <TableCell>{bill.bill_details}</TableCell>
                        <TableCell>{bill.rate_id}</TableCell>
                        <TableCell>{format(bill.date, "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openBillPreview(bill)}>
                                <File className="h-4 w-4"/>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={isBillPreviewOpen} onOpenChange={setIsBillPreviewOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bill Preview</DialogTitle>
                  <DialogDescription>
                    {previewBill ? `Previewing bill for ${previewBill.customer_name}` : ""}
                  </DialogDescription>
                </DialogHeader>
                  {previewBill && (
                      <div>
                        <Label className="text-base">Bill ID: {previewBill.bill_id}</Label>
                        <br />
                        <Label className="text-base">Customer Name: {previewBill.customer_name}</Label>
                        <br />
                        <Label className="text-base">Bill Details: {previewBill.bill_details}</Label>
                        <br />
                        <Label className="text-base">Rate ID: {previewBill.rate_id}</Label>
                        <br />
                        <Label className="text-base">Date: {format(previewBill.date, "dd/MM/yyyy")}</Label>
                      </div>
                  )}
                  <DialogFooter>
                    <Button onClick={()=>setIsBillPreviewOpen(false)}>Close</Button>
                  </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}