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

export default function Payments() {
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
    const { data, error } = await supabase
      .from('Customers')
      .select('customer_id, name');
    
    if (error) {
      console.error('Error fetching customers:', error);
      return;
    }
    
    const options = data.map((customer) => ({
      value: customer.customer_id.toString(),
      label: customer.name,
    }));
    setCustomers(options);
  };

  const fetchPaymentMethods = async () => {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('payment_method_id, name');
    
    if (error) {
      console.error('Error fetching payment methods:', error);
      return;
    }

    const options = data.map((method) => ({
      value: method.payment_method_id.toString(),
      label: method.name,
    }));
    setPaymentMethods(options);
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

  const fetchBills = async (customerId: string) => {
    const { data, error } = await supabase
      .from('Bills')
      .select('bill_id')
      .eq('customer_id', parseInt(customerId));
    
    if (error) {
      console.error('Error fetching bills:', error);
      return;
    }

    const options = data.map((bill) => ({
      value: bill.bill_id.toString(),
      label: `Bill #${bill.bill_id}`,
    }));
    setBills(options);
  };

  useEffect(() => {
    fetchCustomers();
    fetchPaymentMethods();
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