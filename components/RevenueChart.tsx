"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from "recharts"
import { salesData } from "../lib/mockData"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white text-sm font-black">
                    ${payload[0].value?.toLocaleString()}
                </p>
            </div>
        )
    }
    return null
}

export function RevenueChart() {
    const data = salesData.slice(-7)

    return (
        <div className="h-full w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-4 px-4 pt-4">Weekly Revenue</h3>
            <div className="h-[calc(100%-3rem)] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", { weekday: "short" })
                            }}
                            dy={10}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Bar
                            dataKey="revenue"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
