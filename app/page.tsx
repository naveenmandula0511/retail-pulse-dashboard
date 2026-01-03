"use client"

import React, { useState, useEffect } from "react"
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
    MessageSquare,
    Radio,
    Loader2,
    Download
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
    // State Management
    const [activeTab, setActiveTab] = useState('Overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState(3);
    const [toast, setToast] = useState<{ message: string, type: 'info' | 'success' } | null>(null);

    // Application Data State (Lifting mock data to state for CRUD)
    const [localInventory, setLocalInventory] = useState<InventoryItem[]>(inventoryData);
    const [localSales, setLocalSales] = useState<SaleRecord[]>(salesData);
    const [localRegions, setLocalRegions] = useState<RegionData[]>(regionData);

    // Modal & Selection State
    const [isAddSKUModalOpen, setIsAddSKUModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
    const [loadingSKU, setLoadingSKU] = useState<string | null>(null);

    const handleAutoReorder = async (sku: string, productName: string) => {
        setLoadingSKU(sku);
        try {
            const res = await fetch(`/api/restock/${sku}`, { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                setLocalInventory((prev: InventoryItem[]) => prev.map((item: InventoryItem) => {
                    if (item.id === sku) {
                        const newStock = item.stock + 50;
                        return {
                            ...item,
                            stock: newStock,
                            status: 'In Stock'
                        };
                    }
                    return item;
                }));
                showActionToast(`Success: Order placed for ${productName}`);
            }
        } catch (error) {
            console.error('Restock failed:', error);
            showActionToast('Error: Failed to place restock order.');
        } finally {
            setLoadingSKU(null);
        }
    };

    // Toast Timer
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showActionToast = (message: string) => {
        setToast({ message, type: 'info' });
    };

    // Calculate Metrics (Derived from state)
    const totalRevenue = localSales.reduce((acc: number, curr: SaleRecord) => acc + curr.revenue, 0);
    const activeStores = localRegions.length;
    const stockoutRiskCount = localInventory.filter((item: InventoryItem) => item.status !== 'In Stock').length;

    // Simulated trend based on last 2 days
    const lastDayRevenue = localSales[localSales.length - 1]?.revenue || 0;
    const prevDayRevenue = localSales[localSales.length - 2]?.revenue || 0;
    const revenueTrend = prevDayRevenue ? ((lastDayRevenue - prevDayRevenue) / prevDayRevenue) * 100 : 0;

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
                    <NavItem
                        icon={<LayoutDashboard />}
                        label="Overview"
                        active={activeTab === 'Overview'}
                        onClick={() => setActiveTab('Overview')}
                    />
                    <NavItem
                        icon={<Map />}
                        label="Inventory Map"
                        active={activeTab === 'Inventory Map'}
                        onClick={() => setActiveTab('Inventory Map')}
                    />
                    <NavItem
                        icon={<TrendingUp />}
                        label="Smart Forecast"
                        active={activeTab === 'Smart Forecast'}
                        onClick={() => setActiveTab('Smart Forecast')}
                    />
                    <NavItem
                        icon={<Settings />}
                        label="Settings"
                        active={activeTab === 'Settings'}
                        onClick={() => setActiveTab('Settings')}
                    />
                </nav>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={() => setActiveTab('Profile')}
                        className={cn(
                            "flex items-center gap-3 w-full p-2 rounded-xl transition-all text-left group",
                            activeTab === 'Profile' ? "bg-white/10" : "hover:bg-white/5"
                        )}
                    >
                        <Avatar className="h-8 w-8 border border-white/20 group-hover:border-white/40 transition-colors">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">Admin User</p>
                            <p className="text-xs text-slate-400 truncate">Store Owner</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                    <form
                        onSubmit={(e: React.FormEvent) => {
                            e.preventDefault();
                            if (searchQuery) showActionToast(`Searching for "${searchQuery}"...`);
                        }}
                        className="relative w-96"
                    >
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            placeholder="Search data, metrics, reports..."
                            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </form>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-500"
                                onClick={() => {
                                    setNotifications(0);
                                    showActionToast("Opening Notifications...");
                                }}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                                )}
                            </Button>
                        </div>
                        <Avatar
                            className="h-9 w-9 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-500/20 transition-all"
                            onClick={() => showActionToast("User Avatar clicked - Opening Menu...")}
                        >
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
                            {activeTab === 'Overview' ? 'Command Center' :
                                activeTab === 'Inventory Map' ? 'Regional Intelligence' :
                                    activeTab === 'Smart Forecast' ? 'Predictive Analytics' :
                                        activeTab === 'Profile' ? 'Account Authority' : 'System Settings'}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {activeTab === 'Overview' ? 'Operational status and inventory intelligence dashboard.' :
                                activeTab === 'Inventory Map' ? 'Geospatial distribution and regional performance metrics.' :
                                    activeTab === 'Smart Forecast' ? 'AI-powered demand projections and risk assessment.' :
                                        activeTab === 'Profile' ? 'Administrative identity and security control.' : 'Configure your pulse preferences and system parameters.'}
                        </p>
                    </div>

                    {/* Global Search Overlay */}
                    {searchQuery && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                            <Card className="border-indigo-200 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border-2 mb-8">
                                <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 p-6 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                                            <Search className="w-5 h-5" />
                                            Search Results for "{searchQuery}"
                                        </CardTitle>
                                        <p className="text-sm text-indigo-600 font-medium">Found {localInventory.filter((i: InventoryItem) => i.name.toLowerCase().includes(searchQuery.toLowerCase())).length} items across the network</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSearchQuery('')}
                                        className="text-indigo-600 hover:bg-indigo-100 font-bold"
                                    >
                                        Clear Search
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-96 overflow-y-auto">
                                        <table className="w-full text-left">
                                            <tbody className="divide-y divide-slate-100">
                                                {localInventory
                                                    .filter((item: InventoryItem) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                                    .map((item: InventoryItem) => (
                                                        <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                                                            <td className="px-8 py-4 font-mono text-xs text-slate-400">{item.id}</td>
                                                            <td className="px-8 py-4 font-bold text-slate-900">{item.name}</td>
                                                            <td className="px-8 py-4">
                                                                <Badge
                                                                    variant={item.status === 'In Stock' ? 'default' : item.status === 'Low Stock' ? 'secondary' : 'destructive'}
                                                                >
                                                                    {item.status} ({item.stock} in stock)
                                                                </Badge>
                                                            </td>
                                                            <td className="px-8 py-4 text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-indigo-600 font-bold"
                                                                    onClick={() => {
                                                                        setActiveTab('Overview');
                                                                        setSearchQuery(item.name); // Keep search but focus overview
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Dynamic View Rendering */}
                    {!searchQuery && activeTab === 'Overview' && (
                        <>
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
                                    title="Customer Satisfaction"
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
                                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                    Performance Analytics
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-500">Source: Real-time State</Badge>
                                                </CardTitle>
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
                                            <PerformanceChart data={localSales} />
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Deep Analytics: Category Share */}
                                <div className="lg:col-span-1">
                                    <CategoryDistributionChart inventory={localInventory} />
                                </div>
                            </div>

                            {/* Additional Analytics: Visitor Conversion */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <SmartInsightHub
                                        inventory={localInventory}
                                        sales={localSales}
                                        onAction={showActionToast}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <Card className="border-slate-200 shadow-sm h-full overflow-hidden">
                                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                            <CardTitle className="text-lg font-bold">Vistor-to-Sale Conversion</CardTitle>
                                            <p className="text-sm text-slate-500">Engagement efficiency across electronics categories</p>
                                        </CardHeader>
                                        <CardContent className="pt-8">
                                            <ConversionFunnel data={localSales} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Inventory Intelligence Table */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                                <div className="lg:col-span-3">
                                    <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
                                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <CardTitle className="text-lg font-bold text-slate-900">Inventory Intelligence</CardTitle>
                                                    <p className="text-sm text-slate-500">Manage real-time stock and product information</p>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setEditingItem(null);
                                                        setIsAddSKUModalOpen(true);
                                                    }}
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-4 rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                                >
                                                    <Package className="w-4 h-4 mr-2" />
                                                    Add New SKU
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-100">
                                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Internal SKU</th>
                                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Product Designation</th>
                                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Availability</th>
                                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Status</th>
                                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Operations</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {localInventory
                                                            .filter((item: InventoryItem) => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
                                                            .map((item: InventoryItem) => (
                                                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                                                                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{item.id}</td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" />
                                                                            <span className="font-bold text-slate-900">{item.name}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                                <div
                                                                                    className={cn(
                                                                                        "h-full rounded-full transition-all duration-1000",
                                                                                        item.stock > 50 ? "bg-emerald-500" :
                                                                                            item.stock > 10 ? "bg-amber-500" : "bg-rose-500"
                                                                                    )}
                                                                                    style={{ width: `${Math.min(item.stock, 100)}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-xs font-bold text-slate-600 font-mono">{item.stock}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <Badge
                                                                            variant={
                                                                                item.status === 'In Stock' ? 'default' :
                                                                                    item.status === 'Low Stock' ? 'secondary' : 'destructive'
                                                                            }
                                                                            className="shadow-none rounded-full px-3"
                                                                        >
                                                                            {item.status}
                                                                        </Badge>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            {item.status === 'In Stock' ? (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold"
                                                                                    onClick={() => {
                                                                                        setEditingItem(item);
                                                                                        setIsAddSKUModalOpen(true);
                                                                                    }}
                                                                                >
                                                                                    Edit Details
                                                                                </Button>
                                                                            ) : (
                                                                                <Button
                                                                                    variant="default"
                                                                                    size="sm"
                                                                                    disabled={loadingSKU === item.id}
                                                                                    className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold min-w-[110px]"
                                                                                    onClick={() => handleAutoReorder(item.id, item.name)}
                                                                                >
                                                                                    {loadingSKU === item.id ? (
                                                                                        <Loader2 className="w-3 h-3 animate-spin mr-2" />
                                                                                    ) : null}
                                                                                    Auto-Reorder
                                                                                </Button>
                                                                            )}

                                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-white"
                                                                                    onClick={() => {
                                                                                        setEditingItem(item);
                                                                                        setIsAddSKUModalOpen(true);
                                                                                    }}
                                                                                >
                                                                                    <Settings className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-white"
                                                                                    onClick={() => {
                                                                                        setLocalInventory((prev: InventoryItem[]) => prev.filter((i: InventoryItem) => i.id !== item.id));
                                                                                        showActionToast(`Successfully removed ${item.name} from inventory.`);
                                                                                    }}
                                                                                >
                                                                                    <AlertTriangle className="w-4 h-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </>
                    )}

                    {!searchQuery && activeTab === 'Inventory Map' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50 p-8">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Regional Distribution Map</CardTitle>
                                        <p className="text-sm text-slate-500 font-medium">Geospatial revenue and inventory density analysis</p>
                                    </div>
                                    <Map className="w-8 h-8 text-indigo-500" />
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col md:flex-row p-0 relative bg-slate-50 min-h-[500px]">
                                    <div className="flex-1 p-12">
                                        <InventoryMap
                                            regions={localRegions}
                                            onAction={(msg: string, region?: RegionData) => {
                                                showActionToast(msg);
                                                if (region) setSelectedRegion(region);
                                            }}
                                        />
                                    </div>
                                    {selectedRegion && (
                                        <div className="w-full md:w-80 border-l border-slate-200 bg-white p-8 animate-in slide-in-from-right duration-300 overflow-y-auto">
                                            <div className="flex justify-between items-start mb-6">
                                                <h4 className="text-xl font-bold text-slate-900">{selectedRegion.region} Region</h4>
                                                <Button variant="ghost" size="icon" onClick={() => setSelectedRegion(null)} className="h-6 w-6">×</Button>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                                    <p className="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-1">Total Revenue</p>
                                                    <p className="text-2xl font-extrabold text-indigo-900">${(selectedRegion.revenue / 1000).toFixed(1)}k</p>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Regional Breakdown</h5>
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-slate-500">Market Share</span>
                                                        <span className="text-slate-900">24.5%</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-slate-500">Active Stores</span>
                                                        <span className="text-slate-900">12</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className="text-slate-500">Growth Index</span>
                                                        <span className="text-emerald-600">+8.2 points</span>
                                                    </div>
                                                </div>
                                                <Button className="w-full bg-slate-900 text-white rounded-xl font-bold py-6 text-xs uppercase tracking-widest mt-4">
                                                    View Detailed Report
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'Smart Forecast' && (
                        <SmartForecastView onAction={showActionToast} />
                    )}

                    {activeTab === 'Settings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">System Preferences</h3>
                                    <p className="text-slate-500">Configure your dashboard environment and security</p>
                                </div>
                                <Button className="bg-slate-900 text-white font-bold rounded-xl px-6">Save Changes</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-indigo-500" />
                                            Interface Options
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900">Dark Mode (Experimental)</p>
                                                <p className="text-sm text-slate-500">Enable high-performance dark theme</p>
                                            </div>
                                            <div className="w-14 h-7 bg-slate-200 rounded-full relative p-1 cursor-not-allowed">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-md" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-900">Push Notifications</p>
                                                <p className="text-sm text-slate-500">Browser alerts for critical stockouts</p>
                                            </div>
                                            <div className="w-14 h-7 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                                                <div className="w-5 h-5 bg-white rounded-full shadow-md translate-x-7" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-indigo-500" />
                                            Security & Verification
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-colors font-bold text-slate-700">
                                            <ArrowUpRight className="w-4 h-4 mr-3 text-indigo-500" />
                                            Two-Factor Authentication (2FA)
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start h-14 rounded-2xl border-slate-200 hover:bg-slate-50 transition-colors font-bold text-slate-700">
                                            <Bell className="w-4 h-4 mr-3 text-indigo-500" />
                                            Manage Security Keys
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-slate-200 shadow-2xl overflow-hidden max-w-3xl rounded-3xl bg-white">
                                <div className="h-40 bg-gradient-to-r from-indigo-600 to-indigo-900 relative">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                    <div className="absolute -bottom-16 left-12 flex items-end gap-6">
                                        <Avatar className="h-32 w-32 border-8 border-white shadow-2xl rounded-3xl">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback className="text-3xl font-bold bg-slate-900 text-white">AD</AvatarFallback>
                                        </Avatar>
                                        <div className="mb-4">
                                            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">Admin Management</h2>
                                            <p className="text-indigo-100 font-bold opacity-80 uppercase tracking-widest text-xs">RetailPulse Platform Owner</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="pt-24 px-12 pb-12">
                                    <div className="flex justify-between items-start mb-12">
                                        <div>
                                            <p className="text-slate-500 font-medium mb-1">Authenticated Account Access</p>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold uppercase tracking-tighter shadow-none">Live Status: Verified</Badge>
                                                <Badge variant="outline" className="font-bold border-slate-200">Owner Access</Badge>
                                            </div>
                                        </div>
                                        <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 shadow-xl shadow-indigo-100 transition-all">
                                            Edit Secure Profile
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Primary Email Address</label>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600 flex items-center justify-between">
                                                admin@retailpulse.ai
                                                <Settings className="w-4 h-4 opacity-30" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Store Capacity</label>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600">
                                                10,000 Product SKUs
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Account Password</label>
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-600 flex items-center justify-between">
                                                ••••••••••••••••
                                                <Button variant="ghost" className="h-auto p-0 text-indigo-600 font-bold text-xs uppercase tracking-widest">Change</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <Button className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-bold rounded-xl h-12 px-6">Log Out From Terminal</Button>
                                            <Button variant="ghost" className="text-slate-400 font-bold hover:text-slate-600 rounded-xl h-12 px-6">Deactivate Store</Button>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-300 uppercase">Version 2.4.0 Alpha Build</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>

            {/* SKU Management Modal (Add/Edit) */}
            {isAddSKUModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
                    <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden scale-in-center transition-transform">
                        <CardHeader className="bg-slate-950 text-white p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold">{editingItem ? 'Update Secure SKU' : 'Register New SKU'}</CardTitle>
                                    <p className="text-slate-400 text-sm mt-1">{editingItem ? 'Modify existing inventory parameters' : 'Onboard new product to Pulse network'}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Cpu className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 bg-white space-y-6">
                            <form
                                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const name = formData.get('name') as string;
                                    const stock = parseInt(formData.get('stock') as string);
                                    const status = stock === 0 ? 'Critical' : stock < 15 ? 'Low Stock' : 'In Stock';

                                    if (editingItem) {
                                        setLocalInventory((prev: InventoryItem[]) => prev.map((item: InventoryItem) => item.id === editingItem.id ? { ...item, name, stock, status } : item));
                                        showActionToast(`Successfully updated ${name}`);
                                    } else {
                                        const newSKUIntoState: InventoryItem = {
                                            id: `SKU-${Math.floor(Math.random() * 1000 + 100).toString()}`,
                                            name,
                                            stock,
                                            status
                                        };
                                        setLocalInventory((prev: InventoryItem[]) => [newSKUIntoState, ...prev]);
                                        showActionToast(`Added new product: ${name}`);
                                    }
                                    setIsAddSKUModalOpen(false);
                                    setEditingItem(null);
                                }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product Full Name</label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={editingItem?.name}
                                        placeholder="e.g. Next-Gen Gaming Mouse"
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initial Stock Quantity</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        required
                                        defaultValue={editingItem?.stock}
                                        placeholder="Units available"
                                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            setIsAddSKUModalOpen(false);
                                            setEditingItem(null);
                                        }}
                                        className="flex-1 h-12 rounded-2xl font-bold text-slate-500"
                                    >
                                        Dismiss
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95"
                                    >
                                        Execute Action
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Global Interaction Toast */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-sm font-bold tracking-tight">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function InventoryMap({
    regions,
    onAction
}: {
    regions: RegionData[],
    onAction: (msg: string, region?: RegionData) => void
}) {
    const width = 400
    const height = 300
    const maxRev = Math.max(...regions.map((r: RegionData) => r.revenue))

    return (
        <div className="w-full flex items-center justify-center p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
                <path
                    d="M50,100 Q150,50 350,100 T300,250 T50,200 Z"
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                />

                {regions.map((region: RegionData, i: number) => {
                    let x = 200, y = 150;
                    if (region.region === 'North') { x = 200; y = 80; }
                    if (region.region === 'South') { x = 200; y = 220; }
                    if (region.region === 'East') { x = 300; y = 150; }
                    if (region.region === 'West') { x = 100; y = 150; }

                    const radius = 10 + (region.revenue / maxRev) * 20

                    return (
                        <g
                            key={i}
                            className="cursor-pointer group/node"
                            onClick={() => onAction(`Analyzing ${region.region} region performance...`, region)}
                        >
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
                        </g>
                    )
                })}
            </svg>
        </div>
    )
}

function PerformanceChart({ data }: { data: SaleRecord[] }) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const height = 320
    const width = 1000
    const padding = 50

    const maxRevenue = Math.max(...data.map((d: SaleRecord) => d.revenue))
    const chartHeight = height - padding * 2
    const chartWidth = width - padding * 2

    const getPoints = (key: 'revenue' | 'profit') => {
        return data.map((d: SaleRecord, i: number) => {
            const x = padding + (i / (data.length - 1)) * chartWidth
            const y = height - padding - (d[key] / maxRevenue) * chartHeight
            return `${x},${y}`
        }).join(' ')
    }

    const revenuePoints = getPoints('revenue')
    const profitPoints = getPoints('profit')
    const revenueAreaPoints = `${revenuePoints} ${padding + chartWidth},${height - padding} ${padding},${height - padding}`

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = e.currentTarget
        const rect = svg.getBoundingClientRect()
        const x = e.clientX - rect.left
        const ratio = (x - padding) / chartWidth
        const index = Math.round(ratio * (data.length - 1))

        if (index >= 0 && index < data.length) {
            setHoverIndex(index)
        } else {
            setHoverIndex(null)
        }
    }

    return (
        <div className="w-full relative group/chart">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto overflow-visible select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverIndex(null)}
            >
                <defs>
                    <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                    </linearGradient>
                </defs>

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

                <polygon points={revenueAreaPoints} fill="url(#revGrad)" />
                <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={revenuePoints}
                />
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={profitPoints}
                    className="opacity-70"
                />

                {hoverIndex !== null && (
                    <g>
                        <line
                            x1={padding + (hoverIndex / (data.length - 1)) * chartWidth}
                            y1={padding}
                            x2={padding + (hoverIndex / (data.length - 1)) * chartWidth}
                            y2={height - padding}
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                        <circle
                            cx={padding + (hoverIndex / (data.length - 1)) * chartWidth}
                            cy={height - padding - (data[hoverIndex].revenue / maxRevenue) * chartHeight}
                            r="6"
                            fill="#6366f1"
                            stroke="white"
                            strokeWidth="3"
                        />
                        <g transform={`translate(${padding + (hoverIndex / (data.length - 1)) * chartWidth + (hoverIndex > data.length / 2 ? -160 : 20)}, ${height / 2 - 40})`}>
                            <rect width="140" height="60" rx="12" className="fill-slate-900 shadow-2xl" />
                            <text x="15" y="25" className="fill-slate-400 text-[10px] font-bold uppercase tracking-wider">{data[hoverIndex].date}</text>
                            <text x="15" y="45" className="fill-white text-xs font-bold">Revenue: ${(data[hoverIndex].revenue / 1000).toFixed(1)}k</text>
                        </g>
                    </g>
                )}
            </svg>
        </div>
    )
}

function SmartInsightHub({
    inventory,
    sales,
    onAction
}: {
    inventory: InventoryItem[],
    sales: SaleRecord[],
    onAction: (msg: string) => void
}) {
    const criticalItems = inventory.filter(item => item.status === 'Critical')
    const [demandData, setDemandData] = useState<{ region: string, category: string } | null>(null)
    const [isPulsing, setIsPulsing] = useState(false)

    useEffect(() => {
        const fetchDemand = async () => {
            try {
                const res = await fetch('/api/ai/demand-velocity')
                const data = await res.json()
                setDemandData(data)
                setIsPulsing(true)
                setTimeout(() => setIsPulsing(false), 2000)
            } catch (error) {
                console.error('Failed to fetch demand velocity:', error)
            }
        }

        fetchDemand()
        const interval = setInterval(fetchDemand, 30000)
        return () => clearInterval(interval)
    }, [])

    return (
        <Card className="border-none bg-slate-950 text-white overflow-hidden h-full relative group shadow-2xl">
            <style jsx global>{`
                @keyframes pulse-ring {
                    0% { transform: scale(.33); }
                    80%, 100% { opacity: 0; }
                }
                @keyframes pulse-dot {
                    0% { transform: scale(.8); }
                    50% { transform: scale(1); }
                    100% { transform: scale(.8); }
                }
                .pulse-animation {
                    animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
                }
            `}</style>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <CardHeader className="relative z-10 border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        <CardTitle className="text-lg font-bold">Pulse AI Hub</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 p-6 space-y-6">
                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-2">
                            <Radio className={cn("w-5 h-5 text-indigo-400", isPulsing && "pulse-animation text-rose-400")} />
                            <span className="text-sm font-bold">Neural Demand Scan</span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Higher velocity detected in <span className="text-white font-bold underline">{demandData?.region || "Scanning..."}</span> for {demandData?.category || "Analyzing Trends..."}.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Critical Response</h4>
                        {criticalItems.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <div>
                                    <p className="text-xs font-bold text-white mb-0.5">{item.name}</p>
                                    <p className="text-[10px] text-rose-400">Out of Stock - Urgent</p>
                                </div>
                                <Activity className="w-4 h-4 text-rose-500" />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => onAction("Activating AI Strategy Advisor...")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all font-bold group/btn"
                >
                    <span className="text-sm">Ask Advisor</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </CardContent>
        </Card>
    )
}

function NavItem({
    icon,
    label,
    active = false,
    onClick
}: {
    icon: React.ReactNode,
    label: string,
    active?: boolean,
    onClick?: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                active
                    ? "bg-white/10 text-white shadow-xl shadow-black/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            {React.cloneElement(icon as React.ReactElement, { size: 18 })}
            {label}
        </button>
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
        <Card className="border-slate-200 shadow-sm relative group overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</CardTitle>
                <div className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1",
                    trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                    {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {trend}%
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-extrabold text-slate-900 mb-1">{value}</div>
                <p className="text-[10px] text-slate-500 font-medium">{description}</p>
            </CardContent>
            {variant === 'warning' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500" />
            )}
        </Card>
    )
}

function CategoryDistributionChart({ inventory }: { inventory: InventoryItem[] }) {
    const categories = ['Audio', 'Computing', 'Mobile', 'Peripherals'];
    const counts = categories.map(cat => {
        return inventory.filter((_, i: number) => (i % 4) === categories.indexOf(cat)).length;
    });
    const total = counts.reduce((a, b) => a + b, 0);

    return (
        <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg font-bold">Category Share</CardTitle>
                <p className="text-sm text-slate-500">Inventory volume by sector</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                {categories.map((cat, i) => (
                    <div key={cat} className="space-y-1.5" id={`cat-row-${cat}`}>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                            <span>{cat}</span>
                            <span>{total > 0 ? Math.round((counts[i] / total) * 100) : 0}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    i === 0 ? "bg-indigo-500" : i === 1 ? "bg-emerald-500" : i === 2 ? "bg-amber-500" : "bg-rose-500"
                                )}
                                style={{ width: `${total > 0 ? (counts[i] / total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function ConversionFunnel({ data }: { data: SaleRecord[] }) {
    const totalVisitors = data.reduce((acc, curr) => acc + curr.visitors, 0);
    const convertedVisitors = Math.floor(totalVisitors * 0.12);

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="w-full max-w-md space-y-8">
                <FunnelStep
                    label="Reach"
                    value={totalVisitors.toLocaleString()}
                    sub="Total Unique Visitors"
                    color="bg-indigo-500"
                    width="100%"
                />
                <FunnelStep
                    label="Intent"
                    value={Math.floor(totalVisitors * 0.45).toLocaleString()}
                    sub="Product View Rate (45%)"
                    color="bg-indigo-400"
                    width="75%"
                />
                <FunnelStep
                    label="Sales"
                    value={convertedVisitors.toLocaleString()}
                    sub="Checkout Completion (12%)"
                    color="bg-indigo-600"
                    width="50%"
                />
            </div>
            <div className="grid grid-cols-3 gap-8 w-full border-t border-slate-100 pt-8">
                <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">CAC</p>
                    <p className="text-xl font-extrabold text-slate-900">$14.20</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">ROAS</p>
                    <p className="text-xl font-extrabold text-emerald-600">4.2x</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">LTV</p>
                    <p className="text-xl font-extrabold text-slate-900">$210</p>
                </div>
            </div>
        </div>
    );
}

function SmartForecastView({ onAction }: { onAction: (msg: string) => void }) {
    const [scenario, setScenario] = useState<'Realistic' | 'Optimistic' | 'Pessimistic'>('Realistic');
    const [historicalData, setHistoricalData] = useState<{ x: number, y: number }[]>([]);
    const [projectionData, setProjectionData] = useState<{ x: number, y: number }[]>([]);

    // AI Model Activation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showModel, setShowModel] = useState(false);

    useEffect(() => {
        // Generate 6 months (180 days) of historical data
        const history = Array.from({ length: 180 }, (_, i) => ({
            x: i,
            y: 5000 + Math.random() * 2000 + (i * 15) // Slight upward trend
        }));
        setHistoricalData(history);

        // Linear Regression calculation
        const n = history.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        history.forEach(p => {
            sumX += p.x;
            sumY += p.y;
            sumXY += p.x * p.y;
            sumX2 += p.x * p.x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Growth multipliers
        const multipliers = {
            Optimistic: 1.15,
            Realistic: 1.0,
            Pessimistic: 0.85
        };

        const multiplier = multipliers[scenario];

        // Project next 90 days if in advanced mode, otherwise 30
        const projectionLength = showModel ? 90 : 30;
        const totalLength = 180 + projectionLength;
        const projection = Array.from({ length: projectionLength }, (_, i) => {
            const x = 180 + i;
            // For advanced model, use a target growth of 12.4% (multiplier 1.124)
            const growthFactor = showModel ? 1.124 : multiplier;
            const y = (slope * x + intercept) * growthFactor;
            return { x, y };
        });

        setProjectionData(projection);
    }, [scenario, showModel]);

    const handleGenerateModel = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setShowModel(true);
        }, 2000);
    };

    const handleExportPDF = () => {
        setIsExporting(true);
        setTimeout(() => {
            const blob = new Blob(["Dummy PDF content for Retail Pulse Q1 Forecast"], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'RetailPulse_Q1_Forecast.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
            onAction("Report downloaded successfully.");
            setIsExporting(false);
        }, 3000);
    };

    const width = 1000;
    const height = 400;
    const padding = 60;
    const totalX = showModel ? 270 : 210;

    const allData = [...historicalData, ...projectionData];
    const maxY = Math.max(...allData.map(d => d.y)) * 1.1;
    const minY = Math.min(...allData.map(d => d.y)) * 0.9;

    const mapX = (x: number) => padding + (x / totalX) * (width - padding * 2);
    const mapY = (y: number) => height - padding - ((y - minY) / (maxY - minY)) * (height - padding * 2);

    const historyPoints = historicalData.map(d => `${mapX(d.x)},${mapY(d.y)}`).join(' ');
    const projectionPoints = projectionData.map(d => `${mapX(d.x)},${mapY(d.y)}`).join(' ');

    // Confidence Area: 98.2% Confidence (±2% margin)
    const confidenceAreaPoints = (() => {
        if (!showModel) return "";
        const upper = projectionData.map(d => `${mapX(d.x)},${mapY(d.y * 1.02)}`);
        const lower = [...projectionData].reverse().map(d => `${mapX(d.x)},${mapY(d.y * 0.98)}`);
        return [...upper, ...lower].join(' ');
    })();

    if (!showModel) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="border-slate-200 shadow-xl overflow-hidden p-8 bg-indigo-900 text-white relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] -mr-48 -mt-48" />
                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-10 h-10 text-amber-400" />
                                <h2 className="text-4xl font-bold tracking-tight">AI Demand Projections</h2>
                            </div>
                            <p className="text-xl text-indigo-100 leading-relaxed font-medium">
                                Our Pulse AI models have processed the last 30 days of sales data and predicted a
                                <span className="text-white font-bold mx-2 px-2 py-1 bg-white/10 rounded-lg">12.4% increase</span>
                                in revenue for the upcoming Q1 retail window.
                            </p>
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Confidence Score</p>
                                    <p className="text-3xl font-bold font-mono text-emerald-400">98.2%</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2">Target Growth</p>
                                    <p className="text-3xl font-bold font-mono text-white">+$142k</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleGenerateModel}
                                disabled={isGenerating}
                                className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-8 text-xl rounded-2xl shadow-2xl transition-all active:scale-95 mt-4 group/gen"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                                        Processing...
                                    </>
                                ) : (
                                    "Generate Full AI Prediction Model"
                                )}
                            </Button>
                        </div>
                        <div className="w-full md:w-96 aspect-square bg-white/5 rounded-full border border-indigo-400/20 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent animate-pulse" />
                            <BrainCircuit className="w-56 h-56 text-indigo-300 relative z-10 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                    </div>
                </Card>

                {/* Secondary 'Realistic' View (Visible before full model) */}
                <Card className="border-slate-200 shadow-xl overflow-hidden p-8 bg-white relative opacity-50 grayscale pointer-events-none">
                    <p className="text-center font-bold text-slate-400 flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4" />
                        Activate Advanced AI Model to Unlock Full Workspace
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-slate-200 shadow-2xl overflow-hidden p-8 bg-white relative">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-indigo-600 text-[10px] uppercase tracking-wider">Advanced Model Active</Badge>
                            <span className="text-xs font-bold text-emerald-600">98.2% Accuracy</span>
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Q1 Predicted Revenue Velocity</h3>
                        <p className="text-slate-500 font-medium">90-Day Full Spectrum Forecast (Last 180 Days Baseline)</p>
                    </div>
                    <Button variant="ghost" onClick={() => setShowModel(false)} className="text-slate-400 hover:text-slate-600 font-bold">Reset Analysis</Button>
                </div>

                <div className="relative w-full h-[450px]">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="confGrad" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.05" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                            <g key={i}>
                                <line
                                    x1={padding}
                                    y1={height - padding - p * (height - padding * 2)}
                                    x2={width - padding}
                                    y2={height - padding - p * (height - padding * 2)}
                                    stroke="#f1f5f9"
                                    strokeWidth="1.5"
                                />
                                <text
                                    x={padding - 12}
                                    y={height - padding - p * (height - padding * 2) + 4}
                                    textAnchor="end"
                                    className="text-[11px] fill-slate-400 font-bold font-mono"
                                >
                                    ${Math.floor((minY + p * (maxY - minY)) / 1000)}k
                                </text>
                            </g>
                        ))}

                        {/* Confidence Interval Shaded Area */}
                        <polygon points={confidenceAreaPoints} fill="url(#confGrad)" className="animate-in fade-in duration-1000" />

                        {/* X-Axis Labels */}
                        <text x={padding} y={height - padding + 25} className="text-[11px] fill-slate-400 font-bold uppercase tracking-widest">History (-6 Months)</text>
                        <text x={mapX(180)} y={height - padding + 25} textAnchor="middle" className="text-[11px] fill-indigo-600 font-extrabold uppercase tracking-widest bg-indigo-50">Pulse Baseline</text>
                        <text x={width - padding} y={height - padding + 25} textAnchor="end" className="text-[11px] fill-slate-400 font-bold uppercase tracking-widest">Q1 Projection (+90d)</text>

                        {/* Historical Line (Solid) */}
                        <polyline
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="2"
                            points={historyPoints}
                        />

                        {/* Projection Line (Dashed) */}
                        <polyline
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="4"
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={projectionPoints}
                            className="animate-in slide-in-from-left-full duration-1000"
                        />

                        {/* Intersection Marker */}
                        <circle
                            cx={mapX(180)}
                            cy={mapY(historicalData[historicalData.length - 1].y)}
                            r="6"
                            fill="#6366f1"
                            stroke="white"
                            strokeWidth="3"
                            className="drop-shadow-lg"
                        />
                    </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 border-t border-slate-100 pt-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 text-indigo-600">Strategic Driver 01</p>
                        <p className="font-bold text-slate-900 text-sm mb-1">Seasonal Uptick</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Historical Q1 performance shows a consistent 8.4% volume surge in home electronics.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 text-indigo-600">Strategic Driver 02</p>
                        <p className="font-bold text-slate-900 text-sm mb-1">Competitor Stockout</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Cross-market scanning detects inventory shortages in 3 primary regional competitors.</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2 text-indigo-600">Strategic Driver 03</p>
                        <p className="font-bold text-slate-900 text-sm mb-1">Stock Optimization</p>
                        <p className="text-xs text-slate-500 leading-relaxed">New inventory arrival cycles are synchronized with high-velocity demand clusters.</p>
                    </div>
                    <div className="bg-emerald-500 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100">
                        <p className="text-[10px] font-bold uppercase text-emerald-100 tracking-widest mb-2">Growth Metric</p>
                        <p className="text-3xl font-extrabold">+12.4%</p>
                        <p className="text-xs font-medium text-emerald-100 leading-relaxed mt-1">Net Revenue Impact</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mt-8 pt-8 border-t border-slate-100">
                    <Button
                        variant="outline"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 h-14 px-8 min-w-[200px]"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF Report
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function FunnelStep({ label, value, sub, color, width }: { label: string, value: string, sub: string, color: string, width: string }) {
    return (
        <div className="flex items-center gap-6">
            <div className="w-24 text-right">
                <p className="text-sm font-extrabold text-slate-900">{label}</p>
            </div>
            <div className="flex-1 relative">
                <div className={cn("h-12 rounded-2xl relative z-10 overflow-hidden shadow-lg", color)} style={{ width }}>
                    <div className="absolute inset-0 bg-white/10" />
                    <div className="absolute inset-0 flex items-center justify-between px-6">
                        <span className="text-white font-extrabold">{value}</span>
                        <TrendingUp className="w-4 h-4 text-white/40" />
                    </div>
                </div>
                <p className="absolute -bottom-6 left-0 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{sub}</p>
            </div>
        </div>
    );
}
