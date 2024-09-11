"use client";

import { useEffect, useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MainTitle from "@/components/mainTitle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@nextui-org/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Chart configuration for stock and threshold colors
const chartConfig = {
  stock: {
    label: "In Stock",
    color: "hsl(var(--chart-1))",
  },
  threshold: {
    label: "Low Stock Threshold",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface IProduct {
  _id: string;
  name: string;
  quantity: number;
  low_stock_threshold: number;
}

// Fetch stock data from the API and display stock details
export default function StockDashboard() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/inventory"); // Your API route to fetch product data
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading stock data...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MainTitle>Inventory Stock Overview</MainTitle>
      {products.map((product) => (
        <StockDetails key={product._id} product={product} />
      ))}
    </div>
  );
}

export function StockDetails({ product }: { product: IProduct }) {
  const stockPercentage =
    (product.quantity / product.low_stock_threshold) * 100;
  const isLowStock = product.quantity < product.low_stock_threshold;

  return (
    <Card className="flex flex-col bg-background border rounded-lg shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <CardDescription className="text-sm">
          Stock vs Threshold Levels
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={[
              {
                quantity: product.quantity,
                low_stock_threshold: product.low_stock_threshold,
              },
            ]}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {product.quantity}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          In Stock
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="quantity"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-stock)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="low_stock_threshold"
              fill="var(--color-threshold)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* Stock Details */}
        <div className="flex items-center gap-2 font-medium leading-none">
          {isLowStock ? (
            <Badge color="danger">
              <AlertTriangle className="h-4 w-4" /> Low Stock!
            </Badge>
          ) : (
            <Badge color="success">Stock is Healthy</Badge>
          )}
        </div>

        {/* Additional Info */}
        <div className="leading-none text-muted-foreground">
          Stock levels for <span className="font-semibold">{product.name}</span>
          <br />
          <span className="text-sm">
            Threshold: {product.low_stock_threshold}
          </span>
        </div>

        {/* Action Button */}
        <Button variant="shadow" size="sm" className="mt-4">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
