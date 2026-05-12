"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

interface ChartPieProps {
  data: { name: string; value: number }[];
  className?: string;
}

const COLORS = ["#64ffda", "#3b82f6", "#a8b2d1", "#4cc9b0", "#8892b0", "#e6f1ff"];

export function ChartPie({ data, className }: ChartPieProps) {
  return (
    <div className={cn("h-[300px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#112240",
              border: "1px solid rgba(100, 255, 218, 0.1)",
              borderRadius: "8px",
              color: "#e6f1ff",
            }}
          />
          <Legend
            wrapperStyle={{ color: "#8892b0" }}
            formatter={(value) => (
              <span style={{ color: "#a8b2d1" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
