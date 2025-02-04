import { Payment, SelectOption } from "@/lib/types";
import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { RecentTransactions } from "@/components/payments/RecentTransactions";
import { CustomerPaymentHistory } from "@/components/payments/CustomerPaymentHistory";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function Payments() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<SelectOption[]>([]);
  const [bills, setBills] = useState<SelectOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SelectOption[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<SelectOption | null>(null);
  const [selectedBill, setSelectedBill] = useState<SelectOption | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectOption | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<Date | null>(null);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Payment[]>([]);
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customer')
        .select('customer_id, name');
      
      if (error) throw error;
      
      const options = data.map((customer) => ({
        value: customer.customer_id.toString(),
        label: customer.name,
      }));
      setCustomers(options);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from('paymentmethod')
        .select('payment_method_id, name');
      
      if (error) throw error;

      const options = data.map((method) => ({
        value: method.payment_method_id.toString(),
        label: method.name,
      }));
      setPaymentMethods(options);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment methods",
        variant: "destructive",
      });
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('payment')
        .select(`
          *,
          payment_method:paymentmethod(name),
          payment_status_name:paymentstatus(name)
        `)
        .order('payment_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecentTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recent transactions",
        variant: "destructive",
      });
    }
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

  const handlePaymentAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(event.target.value);
  };

  const handlePaymentDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDate(new Date(event.target.value));
  };

  const handleSubmitPayment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedBill || !selectedPaymentMethod || !paymentAmount || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('payment')
        .insert({
          bill_id: parseInt(selectedBill.value),
          payment_method_id: parseInt(selectedPaymentMethod.value),
          payment_date: paymentDate.toISOString(),
          amount: parseFloat(paymentAmount),
          payment_status: 1 // Assuming 1 is for 'Completed' status
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });
      
      setIsAddingPayment(false);
      fetchRecentTransactions();
      resetForm();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setSelectedCustomer(null);
    setSelectedBill(null);
    setSelectedPaymentMethod(null);
    setPaymentAmount('');
    setPaymentDate(null);
  };

  const fetchBills = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('bill')
        .select('bill_id, total_amount')
        .eq('customer_id', parseInt(customerId));
      
      if (error) throw error;

      const options = data.map((bill) => ({
        value: bill.bill_id.toString(),
        label: `Bill #${bill.bill_id} - GH₵${bill.total_amount}`,
      }));
      setBills(options);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bills",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchPaymentMethods();
    fetchRecentTransactions();
  }, []);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-water-800">Payments</h1>
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsAddingPayment(true)}
              >
                <Plus className="h-4 w-4" />
                Record Payment
              </Button>
            </div>

            <PaymentForm
              customers={customers}
              bills={bills}
              paymentMethods={paymentMethods}
              selectedCustomer={selectedCustomer}
              selectedBill={selectedBill}
              selectedPaymentMethod={selectedPaymentMethod}
              paymentAmount={paymentAmount}
              paymentDate={paymentDate}
              handleCustomerChange={handleCustomerChange}
              handleBillChange={handleBillChange}
              handlePaymentMethodChange={handlePaymentMethodChange}
              handlePaymentAmountChange={handlePaymentAmountChange}
              handlePaymentDateChange={handlePaymentDateChange}
              handleSubmit={handleSubmitPayment}
              isAddingPayment={isAddingPayment}
              setIsAddingPayment={setIsAddingPayment}
            />

            <RecentTransactions
              transactions={recentTransactions}
              formatDate={formatDate}
            />

            <CustomerPaymentHistory
              payments={pendingPayments}
              formatDate={formatDate}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}