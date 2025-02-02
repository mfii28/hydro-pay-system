import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer } from "@/lib/types";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Partial<Customer>) => void;
  customer?: Customer;
  title: string;
  description: string;
  accountTypes: { id: number; name: string; }[];
  accountStatuses: { id: number; name: string; }[];
}

export function CustomerForm({
  isOpen,
  onClose,
  onSubmit,
  customer,
  title,
  description,
  accountTypes,
  accountStatuses,
}: CustomerFormProps) {
  const [formData, setFormData] = React.useState<Partial<Customer>>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    billing_cycle: customer?.billing_cycle || '',
    account_type: customer?.account_type || null,
    account_status: customer?.account_status || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof Customer, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Input
                id="billing_cycle"
                value={formData.billing_cycle || ''}
                onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                placeholder="Monthly"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account_type">Account Type</Label>
              <Select
                value={formData.account_type?.toString()}
                onValueChange={(value) => handleInputChange('account_type', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account_status">Account Status</Label>
              <Select
                value={formData.account_status?.toString()}
                onValueChange={(value) => handleInputChange('account_status', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account status" />
                </SelectTrigger>
                <SelectContent>
                  {accountStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{customer ? 'Update' : 'Create'} Customer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}