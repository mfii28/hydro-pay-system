import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, DollarSign } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

// Mock data type for rates
type Rate = {
  rate_id: number
  usage_tier_start: number
  usage_tier_end: number
  price_per_m3: number
  customer_type: string
  region: string | null
  tax: number
  service_fee: number
}

// Mock data for rates
const mockRates: Rate[] = [
  {
    rate_id: 1,
    usage_tier_start: 0,
    usage_tier_end: 10,
    price_per_m3: 5.0,
    customer_type: "residential",
    region: null,
    tax: 0.15,
    service_fee: 5,
  },
  {
    rate_id: 2,
    usage_tier_start: 11,
    usage_tier_end: 20,
    price_per_m3: 10.0,
    customer_type: "residential",
    region: null,
    tax: 0.15,
    service_fee: 5,
  },
  {
    rate_id: 3,
    usage_tier_start: 0,
    usage_tier_end: 10,
    price_per_m3: 7.5,
    customer_type: "commercial",
    region: null,
    tax: 0.20,
    service_fee: 10,
  },
  {
    rate_id: 4,
    usage_tier_start: 11,
    usage_tier_end: 20,
    price_per_m3: 15.0,
    customer_type: "commercial",
    region: null,
    tax: 0.20,
    service_fee: 10,
  },
]

export default function Rates() {
  const [rates, setRates] = useState<Rate[]>(mockRates)
  const [waterUsage, setWaterUsage] = useState<string>("")
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null)

  const handleCalculateCost = () => {
    const usage = parseFloat(waterUsage)
    if (isNaN(usage) || usage < 0) {
      setCalculatedCost(null)
      return
    }

    let cost = 0
    let appliedRates: Rate[] = []
    
    rates.forEach((rate) => {
        if (rate.customer_type === 'residential' && usage >= rate.usage_tier_start && usage <= rate.usage_tier_end) {
            appliedRates.push(rate);
        }
    });

    if(appliedRates.length > 0){
        const appliedRate = appliedRates[0];
        cost = usage * appliedRate.price_per_m3
        cost = cost + (cost * appliedRate.tax) + appliedRate.service_fee;
    }
    

    setCalculatedCost(cost)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between items-start gap-4 mb-8">
              <h1 className="text-3xl font-bold text-water-800">Manage Rates</h1>
              <Button className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Update Rates
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Current Base Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usage Tier Start</TableHead>
                        <TableHead>Usage Tier End</TableHead>
                        <TableHead>Price per m³</TableHead>
                        <TableHead>Customer Type</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Service Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rates.map((rate) => (
                        <TableRow key={rate.rate_id}>
                          <TableCell>{rate.usage_tier_start}</TableCell>
                          <TableCell>{rate.usage_tier_end}</TableCell>
                          <TableCell>GH₵{rate.price_per_m3.toFixed(2)}</TableCell>
                          <TableCell>{rate.customer_type}</TableCell>
                          <TableCell>
                            {rate.region ? rate.region : "N/A"}
                          </TableCell>
                          <TableCell>{rate.tax.toFixed(2)}</TableCell>
                          <TableCell>GH₵{rate.service_fee.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Add Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Add rate interface coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Water Bill Calculator */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Water Bill Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="waterUsage">Water Usage (m³)</Label>
                    <Input
                      type="number"
                      id="waterUsage"
                      placeholder="Enter water usage"
                      value={waterUsage}
                      onChange={(e) => setWaterUsage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={handleCalculateCost}>Calculate Cost</Button>

                    {calculatedCost !== null && (
                      <div>
                        <Label>
                          Estimated Cost:{" "}
                          <span className="font-bold">
                            GH₵
                            {isNaN(calculatedCost)
                              ? "Invalid Input"
                              : calculatedCost.toFixed(2)}
                          </span>
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rate History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Rate history interface coming soon...
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}