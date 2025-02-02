import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Customer, Address, Meter } from "@/lib/types";

interface CustomerListProps {
  customers: Customer[];
  addresses: Address[];
  meters: Meter[];
  accountTypes: { id: number; name: string; }[];
  accountStatuses: { id: number; name: string; }[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerList({
  customers,
  addresses,
  meters,
  accountTypes,
  accountStatuses,
  onEdit,
  onDelete,
}: CustomerListProps) {
  return (
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
        {customers.map((customer) => (
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
                  onClick={() => onEdit(customer)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onDelete(customer)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}