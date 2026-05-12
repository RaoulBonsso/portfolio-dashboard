"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartLineProps {
  data: { name: string; value: number }[];
  className?: string;
  color?: string;
}

export function ChartLine({
  data,
  className,
  color = "#64ffda",
}: ChartLineProps) {
  return (
    <div className={cn("h-[300px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(100, 255, 218, 0.05)"
          />
          <XAxis
            dataKey="name"
            stroke="#8892b0"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#8892b0"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#112240",
              border: "1px solid rgba(100, 255, 218, 0.1)",
              borderRadius: "8px",
              color: "#e6f1ff",
            }}
            itemStyle={{ color: "#64ffda" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
