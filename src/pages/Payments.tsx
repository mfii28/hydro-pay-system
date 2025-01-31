import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

type Payment = {
  paymentId: string;
  customerId: string;
  customerName: string;
  meterId: string;
  amount: number;
  date: string;
  status: string;
};

type Customer = {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  meterNumber: string;
};

type Bill = {
  billId: string;
  customerId: string;
  amount: number;
  date: string;
};

type PaymentMethod = {
  paymentMethodId: string;
  name: string;
};

interface SelectOption {
  value: string;
  label: string;
}

export default function Payments() {
  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [bills, setBills] = useState<SelectOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SelectOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(null);
  const [selectedBill, setSelectedBill] = useState<SelectOption | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectOption | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(event.target.value);
  };

  const handlePaymentDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(new Date(event.target.value));
  };

  const handleCustomerChange = (value: string) => {
    const customer = customers.find((c) => c.value === value);
    setSelectedCustomer(customer || null);
    fetchBills(value);
  };

  const handleBillChange = (value: string) => {
    const bill = bills.find((b) => b.value === value);
    setSelectedBill(bill || null);
  };

  const handlePaymentMethodChange = (value: string) => {
    const paymentMethod = paymentMethods.find((pm) => pm.value === value);
    setSelectedPaymentMethod(paymentMethod || null);
  };

  const fetchCustomers = async () => {
    const customersData = await prisma.customers.findMany({
      select: {
        customer_id: true,
        name: true,
      },
    });
    const options = customersData.map((customer) => ({
      value: customer.customer_id.toString(),
      label: customer.name,
    }));
    setCustomers(options);
  };

  const fetchBills = async (customerId: string) => {
    const billsData = await prisma.bills.findMany({
      where: {
        customer_id: parseInt(customerId),
      },
      select: {
        bill_id: true,
      },
    });

    const options = billsData.map((bill) => ({
      value: bill.bill_id.toString(),
      label: bill.bill_id.toString(),
    }));
    setBills(options);
  };

  const fetchPaymentMethods = async () => {
    const paymentMethodsData = await prisma.paymentMethods.findMany({
      select: {
        payment_method_id: true,
        name: true,
      },
    });
    const options = paymentMethodsData.map((paymentMethod) => ({
      value: paymentMethod.payment_method_id.toString(),
      label: paymentMethod.name,
    }));
    setPaymentMethods(options);
  };
  useEffect(() => {
    fetchCustomers();
    fetchPaymentMethods();
  },[]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8"> <h1 className="text-3xl font-bold text-water-800">Payments</h1>
              <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Record Payment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Record New Payment</DialogTitle>
                    <DialogDescription>
                      Enter the payment's details below.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className='grid gap-4'>
                      <div className='grid gap-2'>
                        <Label htmlFor='customerId'>Customer</Label>
                        <Select onValueChange={handleCustomerChange} >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a customer' currentValue={selectedCustomer?.value} />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-40">
                              {customers.map((customer) => (
                                <SelectItem key={customer.value} value={customer.value}>
                                  {customer.name}
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='billId'>Bill</Label>
                        <Select onValueChange={handleBillChange} disabled={!selectedCustomer} >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a Bill' currentValue={selectedBill?.value} />
                          </SelectTrigger>
                          <SelectContent>
                            {bills.map((bill) => (
                              <SelectItem key={bill.value} value={bill.value}>
                                {bill.billId}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='paymentMethod'>Payment Method</Label> 
                        <Select onValueChange={handlePaymentMethodChange} >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a payment method' currentValue={selectedPaymentMethod?.value}/>
                          </SelectTrigger>
                          <SelectContent> {paymentMethods.map((paymentMethod) => (
                            <SelectItem key={paymentMethod.value} value={paymentMethod.value}>{paymentMethod.label}</SelectItem>
                          ))} </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" type="number" placeholder="100.00" value={paymentAmount} onChange={handlePaymentAmountChange}/>
                      </div>
                      <div className="grid gap-2" >
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Record Payment</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pending Payments Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle>Search Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input type='search' placeholder='Search by name or customer id' value={searchQuery} onChange={handleSearchChange} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Total Payments
                  </CardTitle>
                  <CardDescription>Pending Payments</CardDescription> 
                </CardHeader>
                <CardContent> 
                <p className="text-3xl font-bold">GH₵

                    {pendingPayments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </p> </CardContent>
              </Card>
            </div>

            {/* Recent Transactions Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody> 
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.payment_id}>
                        <TableCell>{transaction.payment_id}</TableCell>
                        <TableCell>{transaction.bill_id}</TableCell> 
                        <TableCell>GH₵{transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{transaction.payment_date}</TableCell>
                        <TableCell>{transaction.payment_method.name}</TableCell>
                        <TableCell>{transaction.payment_status.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Customer Payment History Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Customer Payments History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow> <TableHead>Payment ID</TableHead> <TableHead>Customer ID</TableHead> <TableHead>Amount</TableHead> <TableHead>Date</TableHead> <TableHead>Status</TableHead> </TableRow>
                  </TableHeader>
                  <TableBody> 
                    {mockCustomerPaymentsHistory.map((payment) => (
                      <TableRow key={payment.paymentId}> 
                      <TableCell>{payment.paymentId}</TableCell> 
                      <TableCell>{payment.customerId}</TableCell>
                      <TableCell>GH₵{payment.amount.toFixed(2)}</TableCell> <TableCell>{payment.date}</TableCell> <TableCell>{payment.status}</TableCell> </TableRow>
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
