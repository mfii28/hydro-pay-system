import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SelectOption } from "@/lib/types";

interface PaymentFormProps {
  customers: SelectOption[];
  bills: SelectOption[];
  paymentMethods: SelectOption[];
  selectedCustomer: SelectOption | null;
  selectedBill: SelectOption | null;
  selectedPaymentMethod: SelectOption | null;
  paymentAmount: string;
  paymentDate: Date | null;
  handleCustomerChange: (value: string) => void;
  handleBillChange: (value: string) => void;
  handlePaymentMethodChange: (value: string) => void;
  handlePaymentAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  isAddingPayment: boolean;
  setIsAddingPayment: (value: boolean) => void;
}

export function PaymentForm({
  customers,
  bills,
  paymentMethods,
  selectedCustomer,
  selectedBill,
  selectedPaymentMethod,
  paymentAmount,
  paymentDate,
  handleCustomerChange,
  handleBillChange,
  handlePaymentMethodChange,
  handlePaymentAmountChange,
  handlePaymentDateChange,
  handleSubmit,
  isAddingPayment,
  setIsAddingPayment
}: PaymentFormProps) {
  return (
    <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
          <DialogDescription>Enter the payment's details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='customerId'>Customer</Label>
              <Select onValueChange={handleCustomerChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a customer' />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-40">
                    {customers.map((customer) => (
                      <SelectItem key={customer.value} value={customer.value}>
                        {customer.label}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='billId'>Bill</Label>
              <Select onValueChange={handleBillChange} disabled={!selectedCustomer}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a Bill' />
                </SelectTrigger>
                <SelectContent>
                  {bills.map((bill) => (
                    <SelectItem key={bill.value} value={bill.value}>
                      {bill.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='paymentMethod'>Payment Method</Label>
              <Select onValueChange={handlePaymentMethodChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a payment method' />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100.00"
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                onChange={handlePaymentDateChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Record Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}