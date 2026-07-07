/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ChartItemConfig {
  key: string;
  name: string;
  color: string;
  type: "area" | "bar" | "line";
}

interface ChartEngineProps {
  data: any[];
  items: ChartItemConfig[];
  xAxisKey: string;
  height?: number;
  title?: string;
  subtitle?: string;
}

export function ChartEngine({
  data,
  items,
  xAxisKey,
  height = 200,
  title,
  subtitle,
}: ChartEngineProps) {
  // Determine global chart structure based on type of first item
  const chartType = items[0]?.type || "area";

  const renderChartContent = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#fff",
              }}
            />
            {items.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.name}
                fill={item.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#fff",
              }}
            />
            {items.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={2}
                dot={{ r: 2, fill: item.color }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );

      case "area":
      default:
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {items.map((item) => (
                <linearGradient key={item.key} id={`gradient-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={item.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={item.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "10px",
                fontFamily: "monospace",
                color: "#fff",
              }}
            />
            {items.map((item) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#gradient-${item.key})`}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-5 backdrop-blur-xl flex flex-col gap-3">
      {(title || subtitle) && (
        <div className="flex flex-col gap-0.5">
          {title && (
            <h4 className="font-sans font-bold text-xs uppercase tracking-tight text-white/95">
              {title}
            </h4>
          )}
          {subtitle && (
            <span className="text-[9.5px] font-mono font-light text-white/35">
              {subtitle}
            </span>
          )}
        </div>
      )}

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          {renderChartContent()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
