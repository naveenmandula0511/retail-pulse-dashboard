import React from "react"
import {
    Activity,
    LayoutDashboard,
    Map,
    TrendingUp,
    Settings,
    Search,
    Bell,
    MoreVertical,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingBag,
    Package,
    AlertTriangle,
    Zap,
    Cpu,
    Sparkles,
    BrainCircuit,
    ChevronRight,
    MessageSquare
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { salesData, inventoryData, regionData, type RegionData, type InventoryItem, type SaleRecord } from "@/lib/mockData"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
    // Calculate Metrics
    const totalRevenue = salesData.reduce((acc: number, curr: SaleRecord) => acc + curr.revenue, 0);
    const activeStores = regionData.length;
    const stockoutRiskCount = inventoryData.filter((item: InventoryItem) => item.status !== 'In Stock').length;

    // Simulated trend based on last 2 days
    const lastDayRevenue = salesData[salesData.length - 1].revenue;
    const prevDayRevenue = salesData[salesData.length - 2].revenue;
    const revenueTrend = ((lastDayRevenue - prevDayRevenue) / prevDayRevenue) * 100;

    return (
        <div className="flex h-screen w-full bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 text-white flex flex-col h-full shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">RetailPulse</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <NavItem icon={<LayoutDashboard />} label="Overview" active />
                    <NavItem icon={<Map />} label="Inventory Map" />
                    <NavItem icon={<TrendingUp />} label="Smart Forecast" />
                    <NavItem icon={<Settings />} label="Settings" />
                </nav>

                <div className="p-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">Premium Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search data, metrics, reports..."
                            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-500">
                            <Bell className="w-5 h-5" />
                        </Button>
                        <Avatar className="h-9 w-9 border border-slate-200 cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-mono">Command Center</h2>
                        <p className="text-slate-500 mt-1">Operational status and inventory intelligence dashboard.</p>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard
                            title="Total Revenue"
                            value={`$${(totalRevenue / 1000).toFixed(1)}k`}
                            trend={`${revenueTrend > 0 ? '+' : ''}${revenueTrend.toFixed(1)}`}
                            trendUp={revenueTrend > 0}
                            description="Monthly aggregate"
                        />
                        <KPICard
                            title="Active Stores"
                            value={activeStores}
                            trend="+0"
                            trendUp={true}
                            description="Across 4 regions"
                        />
                        <KPICard
                            title="Stockout Risk"
                            value={stockoutRiskCount}
                            trend={stockoutRiskCount > 5 ? "High" : "Low"}
                            trendUp={stockoutRiskCount < 5}
                            description="Items needing attention"
                            variant={stockoutRiskCount > 0 ? "warning" : "default"}
                        />
                        <KPICard
                            title="AI Predictions"
                            value="94.2%"
                            trend="+2.1"
                            trendUp={true}
                            description="Forecast accuracy"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Performance Chart - Takes 2 columns */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">Performance Analytics</CardTitle>
                                        <p className="text-sm text-slate-500">Revenue vs. Profit trends (Last 30 Days)</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">Revenue</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-tight">Profit</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <PerformanceChart data={salesData} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Extraordinary Feature: AI Smart Insights Hub */}
                        <div className="lg:col-span-1">
                            <SmartInsightHub inventory={inventoryData} sales={salesData} />
                        </div>
                    </div>

                    {/* Inventory Intelligence Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                        {/* Inventory Intelligence Table - 2 Columns */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">Inventory Intelligence</CardTitle>
                                        <p className="text-sm text-slate-500">Real-time stock status across top SKUs</p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-indigo-600 font-bold">Full Report</Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Product</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">SKU</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Level</th>
                                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {inventoryData.slice(0, 5).map((item: InventoryItem) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                                    <Package size={14} />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-900">{item.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.id}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3 min-w-[100px]">
                                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={cn(
                                                                            "h-full rounded-full",
                                                                            item.status === 'Critical' ? "bg-rose-500" :
                                                                                item.status === 'Low Stock' ? "bg-amber-500" : "bg-emerald-500"
                                                                        )}
                                                                        style={{ width: `${Math.max(item.stock, 5)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-600">{item.stock}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Badge
                                                                variant={item.status === 'Critical' ? 'destructive' : item.status === 'Low Stock' ? 'secondary' : 'default'}
                                                                className={cn(
                                                                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5",
                                                                    item.status === 'Low Stock' && "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
                                                                    item.status === 'In Stock' && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                                                                )}
                                                            >
                                                                {item.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Geospatial Map - 1 Column */}
                        <div className="lg:col-span-1">
                            <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">Regional Pulse</CardTitle>
                                        <p className="text-sm text-slate-500">Revenue distribution map</p>
                                    </div>
                                    <Map className="w-5 h-5 text-slate-400" />
                                </CardHeader>
                                <CardContent className="pt-6 relative">
                                    <InventoryMap regions={regionData} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

function InventoryMap({ regions }: { regions: RegionData[] }) {
    const width = 400
    const height = 300

    // Simple projection for the demonstration (fitting regions into the box)
    const maxRev = Math.max(...regions.map(r => r.revenue))

    return (
        <div className="w-full flex items-center justify-center p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                {/* Simplified Map Paths (Abstract) */}
                <path
                    d="M50,100 Q150,50 350,100 T300,250 T50,200 Z"
                    fill="#f8fafc"
                    stroke="#e2e8f0"
                    strokeWidth="2"
                />

                {regions.map((region, i) => {
                    // Logic to position buttons based on region name as a proxy for coordinates 
                    // since we are using an abstract map.
                    let x = 200, y = 150;
                    if (region.region === 'North') { x = 200; y = 80; }
                    if (region.region === 'South') { x = 200; y = 220; }
                    if (region.region === 'East') { x = 300; y = 150; }
                    if (region.region === 'West') { x = 100; y = 150; }

                    const radius = 10 + (region.revenue / maxRev) * 20

                    return (
                        <g key={i} className="cursor-pointer group/node">
                            <circle
                                cx={x}
                                cy={y}
                                r={radius}
                                fill="#6366f1"
                                className="opacity-20 group-hover/node:opacity-40 transition-opacity"
                            />
                            <circle
                                cx={x}
                                cy={y}
                                r={radius / 2}
                                fill="#6366f1"
                                className="group-hover/node:scale-110 transition-transform origin-center"
                            />
                            <text
                                x={x}
                                y={y + radius + 15}
                                textAnchor="middle"
                                className="text-[10px] font-bold fill-slate-500 uppercase tracking-tighter"
                            >
                                {region.region} (${(region.revenue / 1000).toFixed(0)}k)
                            </text>

                            {/* Hover Tooltip Placeholder */}
                            <rect
                                x={x - 40}
                                y={y - radius - 35}
                                width="80"
                                height="25"
                                rx="6"
                                className="fill-slate-900 opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none"
                            />
                            <text
                                x={x}
                                y={y - radius - 18}
                                textAnchor="middle"
                                className="text-[9px] font-bold fill-white opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none"
                            >
                                Market Leader
                            </text>
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

function PerformanceChart({ data }: { data: SaleRecord[] }) {
    const height = 320
    const width = 1000
    const padding = 50

    const maxRevenue = Math.max(...data.map((d: SaleRecord) => d.revenue))
    const chartHeight = height - padding * 2
    const chartWidth = width - padding * 2

    // Helper to map data to SVG coordinates
    const getPoints = (key: 'revenue' | 'profit') => {
        return data.map((d: SaleRecord, i: number) => {
            const x = padding + (i / (data.length - 1)) * chartWidth
            const y = height - padding - (d[key] / maxRevenue) * chartHeight
            return `${x},${y}`
        }).join(' ')
    }

    const revenuePoints = getPoints('revenue')
    const profitPoints = getPoints('profit')

    // Create a smooth area under the revenue line
    const revenueAreaPoints = `${revenuePoints} ${padding + chartWidth},${height - padding} ${padding},${height - padding}`

    return (
        <div className="w-full relative group/chart">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                    <g key={i}>
                        <line
                            x1={padding}
                            y1={height - padding - p * chartHeight}
                            x2={width - padding}
                            y2={height - padding - p * chartHeight}
                            stroke="#f1f5f9"
                            strokeWidth="1.5"
                        />
                        <text
                            x={padding - 12}
                            y={height - padding - p * chartHeight + 4}
                            textAnchor="end"
                            className="text-[11px] fill-slate-400 font-bold font-mono"
                        >
                            ${Math.floor((p * maxRevenue) / 1000)}k
                        </text>
                    </g>
                ))}

                {/* Vertical Date Labels */}
                {data.filter((_, i: number) => i % 5 === 0).map((d: SaleRecord, i: number) => {
                    const x = padding + (data.indexOf(d) / (data.length - 1)) * chartWidth
                    return (
                        <text
                            key={i}
                            x={x}
                            y={height - padding + 24}
                            textAnchor="middle"
                            className="text-[10px] fill-slate-400 font-bold uppercase tracking-wider"
                        >
                            {d.date.split('-').slice(1).join('/')}
                        </text>
                    )
                })}

                {/* Areas with Gradients */}
                <defs>
                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                    </linearGradient>
                </defs>
                <polygon
                    points={revenueAreaPoints}
                    fill="url(#revenueGradient)"
                />

                {/* Main Lines */}
                <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={revenuePoints}
                    className="drop-shadow-[0_4px_6px_rgba(99,102,241,0.2)]"
                />
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={profitPoints}
                    className="opacity-80"
                />

                {/* Interaction Points (Last Data Point) */}
                <g className="animate-pulse">
                    <circle
                        cx={padding + chartWidth}
                        cy={height - padding - (data[data.length - 1].revenue / maxRevenue) * chartHeight}
                        r="5"
                        fill="#6366f1"
                        stroke="white"
                        strokeWidth="2"
                    />
                    <circle
                        cx={padding + chartWidth}
                        cy={height - padding - (data[data.length - 1].profit / maxRevenue) * chartHeight}
                        r="5"
                        fill="#10b981"
                        stroke="white"
                        strokeWidth="2"
                    />
                </g>
            </svg>
        </div>
    )
}

function SmartInsightHub({ inventory, sales }: { inventory: InventoryItem[], sales: SaleRecord[] }) {
    const criticalItems = inventory.filter(item => item.status === 'Critical')
    const lowStockItems = inventory.filter(item => item.status === 'Low Stock')

    return (
        <Card className="border-none bg-slate-950 text-white overflow-hidden h-full relative group">
            {/* Animated Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/30 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -ml-32 -mb-32 pointer-events-none" />

            <CardHeader className="relative z-10 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                        </div>
                        <CardTitle className="text-lg font-bold">Pulse AI Hub</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] uppercase font-bold tracking-widest animate-pulse">
                        Neural Scan Active
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="relative z-10 p-6 space-y-6">
                {/* AI Demand Prediction */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>Neural Forecast</span>
                        <span className="text-indigo-400">Tomorrow @ 09:00</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-400" />
                            <span className="text-sm font-bold">Demand Surge Detected</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            AI models suggest a <span className="text-white font-bold">22.4% spike</span> in Smart Watch sales for the North region based on social sentiment logs.
                        </p>
                    </div>
                </div>

                {/* Critical Alerts */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Operations Alerts</h4>
                    <div className="space-y-2">
                        {criticalItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 group/alert cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{item.name}</p>
                                        <p className="text-[10px] text-rose-400 font-medium">Revenue Leak: -$4.2k/day</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        ))}
                        {lowStockItems.slice(0, 1).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 group/alert cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase">{item.name}</p>
                                        <p className="text-[10px] text-amber-400 font-medium">Predicted stockout in 48h</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Interaction Prompts */}
                <div className="pt-2">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/50 cursor-text group/prompt hover:bg-indigo-500/30 transition-all">
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-300">Ask Pulse AI for a strategy...</span>
                    </div>
                </div>
            </CardContent>

            {/* Bottom Graphic Decoration */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
                <BrainCircuit size={80} className="text-indigo-400" />
            </div>
        </Card>
    )
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-indigo-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
        >
            {React.cloneElement(icon as React.ReactElement, { size: 18 })}
            {label}
        </a>
    )
}

function KPICard({
    title,
    value,
    trend,
    trendUp,
    description,
    variant = "default"
}: {
    title: string,
    value: string | number,
    trend: string,
    trendUp: boolean,
    description: string,
    variant?: "default" | "warning" | "danger"
}) {
    return (
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default overflow-hidden relative group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</CardTitle>
                <MoreVertical className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </CardHeader>
            <CardContent>
                <div className={cn(
                    "text-3xl font-bold tracking-tight",
                    variant === "warning" && value !== 0 ? "text-amber-600" : "text-slate-900"
                )}>
                    {value}
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <div className={cn(
                        "flex items-center text-xs font-bold",
                        trendUp ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {trend}%
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium truncate">{description}</p>
                </div>
            </CardContent>
            {variant === "warning" && value !== 0 && (
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            )}
        </Card>
    )
}
