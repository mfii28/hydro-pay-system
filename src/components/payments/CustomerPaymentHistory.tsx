import { Payment } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerPaymentHistoryProps {
  payments: Payment[];
  formatDate: (date: string | Date) => string;
}

export function CustomerPaymentHistory({ payments, formatDate }: CustomerPaymentHistoryProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Customer Payments History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.payment_id}>
                <TableCell>{payment.payment_id}</TableCell>
                <TableCell>{payment.customer_id}</TableCell>
                <TableCell>GH₵{payment.amount.toFixed(2)}</TableCell>
                <TableCell>{formatDate(payment.payment_date)}</TableCell>
                <TableCell>{payment.payment_status_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}