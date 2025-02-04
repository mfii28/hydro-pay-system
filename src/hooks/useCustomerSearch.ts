import { useState } from 'react';
import { Customer } from "@/lib/types";

export function useCustomerSearch(customers: Customer[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower)
    );
  });

  return {
    searchQuery,
    setSearchQuery,
    filteredCustomers,
  };
}