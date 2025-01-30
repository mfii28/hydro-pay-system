import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: 'Jan', usage: 4000 },
  { month: 'Feb', usage: 3000 },
  { month: 'Mar', usage: 2000 },
  { month: 'Apr', usage: 2780 },
  { month: 'May', usage: 1890 },
  { month: 'Jun', usage: 2390 },
];

export default function UsageChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Water Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="#0ea5e9" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}