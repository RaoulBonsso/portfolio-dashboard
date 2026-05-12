"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartBarProps {
  data: { name: string; value: number }[];
  className?: string;
  color?: string;
}

export function ChartBar({
  data,
  className,
  color = "#3b82f6",
}: ChartBarProps) {
  return (
    <div className={cn("h-[300px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#112240",
              border: "1px solid rgba(100, 255, 218, 0.1)",
              borderRadius: "8px",
              color: "#e6f1ff",
            }}
            itemStyle={{ color: "#3b82f6" }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
