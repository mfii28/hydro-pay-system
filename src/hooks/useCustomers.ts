import { useState, useEffect } from 'react';
import { Customer } from "@/lib/types";
import { useCustomerData } from './useCustomerData';
import { useCustomerOperations } from './useCustomerOperations';
import { useCustomerSearch } from './useCustomerSearch';

export function useCustomers() {
  const { customers, meters, addresses, fetchCustomers } = useCustomerData();
  const { createCustomer, updateCustomer, deleteCustomer } = useCustomerOperations(fetchCustomers);
  const { searchQuery, setSearchQuery, filteredCustomers } = useCustomerSearch(customers);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (customerData: Partial<Customer>) => {
    await createCustomer(customerData);
    setIsAddingCustomer(false);
  };

  const handleUpdateCustomer = async (customerData: Partial<Customer>) => {
    if (!editingCustomer) return;
    await updateCustomer(editingCustomer.customer_id, customerData);
    setEditingCustomer(null);
  };

  return {
    customers: filteredCustomers,
    meters,
    addresses,
    searchQuery,
    setSearchQuery,
    isAddingCustomer,
    setIsAddingCustomer,
    editingCustomer,
    setEditingCustomer,
    handleCreateCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer: deleteCustomer,
  };
}