import { Payment } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentTransactionsProps {
  transactions: Payment[];
  formatDate: (date: string | Date) => string;
}

export function RecentTransactions({ transactions, formatDate }: RecentTransactionsProps) {
  return (
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
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.payment_id}>
                <TableCell>{transaction.payment_id}</TableCell>
                <TableCell>{transaction.customer_id}</TableCell>
                <TableCell>GH₵{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(transaction.payment_date)}</TableCell>
                <TableCell>{transaction.payment_method?.name}</TableCell>
                <TableCell>{transaction.payment_status_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}