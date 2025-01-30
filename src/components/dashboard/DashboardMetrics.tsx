import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, DollarSign, Droplets } from "lucide-react";

const metrics = [
  {
    title: "Total Customers",
    value: "2,345",
    icon: Users,
    description: "Active water service accounts",
  },
  {
    title: "Monthly Revenue",
    value: "$23,456",
    icon: DollarSign,
    description: "Current month collections",
  },
  {
    title: "Water Usage",
    value: "234,567",
    icon: Droplets,
    description: "Gallons this month",
  },
  {
    title: "Pending Bills",
    value: "123",
    icon: BarChart,
    description: "Awaiting payment",
  },
];

export default function DashboardMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-water-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}