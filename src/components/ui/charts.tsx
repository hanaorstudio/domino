
import React from "react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import {
  Line,
  Bar,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  AreaChart as RechartsAreaChart
} from "recharts";

const config = {
  emerald: { color: "#10b981" },
  purple: { color: "#a855f7" },
  amber: { color: "#f59e0b" },
  rose: { color: "#f43f5e" },
  cyan: { color: "#06b6d4" },
  indigo: { color: "#6366f1" }
};

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export const AreaChart = ({
  data,
  index,
  categories,
  colors = ["emerald"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={config}>
      <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <ChartTooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(value as number)}
            />
          )}
        />
        {categories.map((category, i) => (
          <Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={`var(--color-${colors[i % colors.length]})`}
            stroke={`var(--color-${colors[i % colors.length]})`}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
};

export const LineChart = ({
  data,
  index,
  categories,
  colors = ["emerald"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={config}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <ChartTooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(value as number)}
            />
          )}
        />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={`var(--color-${colors[i % colors.length]})`}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 0, fill: `var(--color-${colors[i % colors.length]})` }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};

export const BarChart = ({
  data,
  index,
  categories,
  colors = ["emerald"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={config}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
        />
        <ChartTooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(value as number)}
            />
          )}
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`var(--color-${colors[i % colors.length]})`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};

export const PieChart = ({
  data,
  index,
  categories,
  colors = ["emerald", "cyan", "amber", "indigo"],
  valueFormatter = (value: number) => `${value}`,
  className,
}: ChartProps) => {
  return (
    <ChartContainer className={className} config={config}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          dataKey={categories[0]}
          nameKey={index}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          strokeWidth={1}
          stroke="#fff"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${colors[index % colors.length]})`} />
          ))}
        </Pie>
        <ChartTooltip
          content={({ active, payload }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              formatter={(value) => valueFormatter(value as number)}
              nameKey={index}
            />
          )}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </RechartsPieChart>
    </ChartContainer>
  );
};

// Add missing Cell component
import { Cell } from "recharts";
