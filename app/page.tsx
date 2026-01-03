"use client"

import React, { useState, useEffect, useRef } from "react"
import { RevenueChart } from "@/components/RevenueChart"
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
    Download,
    MapPin,
    Plus,
    Trash2,
    Users,
    CreditCard,
    FileText,
    Clock,
    Coins,
    Percent,
    Store,
    Lock,
    Send,
    Filter,
    Calendar,
    ChevronDown,
    Edit3,
    ArrowUp,
    ArrowDown,
    CheckCircle2,
    XCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react"
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Annotation
} from "react-simple-maps"
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts"
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

// --- Types ---
interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface StoreLocation {
    id: string;
    name: string;
    state: string;
    revenue: number;
    coordinates: [number, number];
}

export default function DashboardPage() {
    // Basic Navigation & UI State
    const [activeTab, setActiveTab] = useState('Overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState(3);
    const [toast, setToast] = useState<{ message: string, type: 'info' | 'success' } | null>(null);

    // Global Filters
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [tableFilter, setTableFilter] = useState<string | null>(null);

    // Data State
    const [localInventory, setLocalInventory] = useState<InventoryItem[]>(inventoryData);
    const [localSales, setLocalSales] = useState<SaleRecord[]>(salesData);
    const [localRegions, setLocalRegions] = useState<RegionData[]>(regionData);

    // AI Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'ai', content: "Hello! I'm your RetailPulse Advisor. I've detected a possible stockout risk in the Audio category. Should we review the Seattle hub performance?", timestamp: new Date() }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Table State
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem, direction: 'asc' | 'desc' } | null>({ key: 'stock', direction: 'asc' });

    // Modals
    const [isAddSKUModalOpen, setIsAddSKUModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // AI Chat Logic
    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const newUserMsg: ChatMessage = {
            id: Math.random().toString(),
            role: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, newUserMsg]);
        setChatInput('');
        setIsChatLoading(true);

        // Simulate AI Response
        await new Promise(resolve => setTimeout(resolve, 1500));

        const aiResponse: ChatMessage = {
            id: Math.random().toString(),
            role: 'ai',
            content: "Based on the Last 30 Days data and Current Region filters, your conversion rate is up by 4.2%. However, 'Quantum Headphones' in the South region are at critical levels. I've prepared a restock draft for you.",
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, aiResponse]);
        setIsChatLoading(false);
    };

    // Sorting Logic
    const handleSort = (key: keyof InventoryItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedInventory = [...localInventory]
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = !tableFilter || item.status === tableFilter || (tableFilter === 'Critical' && item.stock <= 5);
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const showActionToast = (message: string) => {
        setToast({ message, type: 'info' });
        setTimeout(() => setToast(null), 3000);
    };

    // Metrics calculation
    const totalRevenue = 128400; // Simulated
    const revenueTrend = 12.4;
    const activeStoresCount = 4;
    const stockoutRiskCount = localInventory.filter(i => i.status !== 'In Stock').length;


    return (
        <div className="flex h-screen w-full bg-[#f8fafc]">
            {/* Sidebar (Dark Mode) */}
            <aside className="w-72 bg-slate-950 text-white flex flex-col h-full shrink-0 shadow-2xl z-20">
                <div className="p-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight uppercase italic">Pulse<span className="text-indigo-500">Center</span></span>
                </div>

                <nav className="flex-1 px-6 pt-4 space-y-2">
                    <NavItem
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        label="Command Center"
                        active={activeTab === 'Overview'}
                        onClick={() => setActiveTab('Overview')}
                    />
                    <NavItem
                        icon={<Map className="w-5 h-5" />}
                        label="Regional Intel"
                        active={activeTab === 'Inventory Map'}
                        onClick={() => setActiveTab('Inventory Map')}
                    />
                    <NavItem
                        icon={<TrendingUp className="w-5 h-5" />}
                        label="AI Forecast"
                        active={activeTab === 'Smart Forecast'}
                        onClick={() => setActiveTab('Smart Forecast')}
                    />
                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label="System Config"
                        active={activeTab === 'Settings'}
                        onClick={() => setActiveTab('Settings')}
                    />
                </nav>

                <div className="p-8 mt-auto border-t border-white/5 bg-white/[0.02]">
                    <div className="bg-indigo-600/10 rounded-2xl p-4 border border-indigo-500/20 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Pro Authority</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">Advanced predictive models are currently active.</p>
                    </div>

                    <button
                        onClick={() => setActiveTab('Profile')}
                        className={cn(
                            "flex items-center gap-4 w-full p-2 rounded-2xl transition-all text-left",
                            activeTab === 'Profile' ? "bg-white/10" : "hover:bg-white/5"
                        )}
                    >
                        <Avatar className="h-10 w-10 border-2 border-slate-800 rounded-xl">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="bg-slate-800">NM</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">Naveen M.</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sr. Operations</p>
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Modern Header */}
                <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10">
                    <div className="flex items-center gap-10">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search inventory, sales, hubs..."
                                className="w-96 bg-slate-100/50 border-2 border-transparent rounded-2xl pl-12 pr-6 py-3 text-sm text-slate-900 focus:bg-white focus:border-indigo-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                            />
                        </div>

                        <div className="h-10 w-px bg-slate-200" />

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl text-xs font-bold gap-2 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-none transition-all"
                                >
                                    <Calendar className="w-4 h-4" />
                                    {dateRange}
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 rounded-xl text-xs font-bold gap-2 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-none transition-all"
                                >
                                    <Filter className="w-4 h-4" />
                                    {regionFilter}
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-slate-100/50 rounded-2xl h-12 w-12 text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all relative"
                            onClick={() => { setNotifications(0); showActionToast("Alerts Clear"); }}
                        >
                            <Bell className="w-5 h-5" />
                            {notifications > 0 && (
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                        </Button>
                        <div className="h-12 w-px bg-slate-200" />
                        <div className="flex items-center gap-4 bg-slate-100/50 pr-4 pl-1.5 py-1.5 rounded-2xl border border-slate-200/50 hover:bg-slate-100 transition-all cursor-pointer">
                            <Avatar className="h-9 w-9 rounded-xl border border-white shadow-sm">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Production Hub</p>
                                <p className="text-[10px] text-emerald-600 font-bold">Online</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                    {/* View Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-indigo-600 text-white rounded-lg px-2 py-0.5 text-[10px] uppercase font-black tracking-widest">v4.0.2 Stable</Badge>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing with Node 14...</span>
                                </div>
                            </div>
                            <h2 className="text-5xl font-black text-slate-900 tracking-tightest">
                                {activeTab === 'Overview' ? 'Command Center' :
                                    activeTab === 'Inventory Map' ? 'Regional Intelligence' :
                                        activeTab === 'Smart Forecast' ? 'Pulse AI Forecast' : 'System Administration'}
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl h-14 px-8 shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-95 gap-3"
                                onClick={() => { setEditingItem(null); setIsAddSKUModalOpen(true); }}
                            >
                                <Plus className="w-5 h-5" />
                                Register New SKU
                            </Button>
                        </div>
                    </div>

                    {activeTab === 'Overview' && (
                        <div className="space-y-10 animate-in fade-in duration-700">
                            {/* Dashboard Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <KPICard
                                    title="NET REVENUE"
                                    value={`$${(totalRevenue / 1000).toFixed(1)}k`}
                                    trend={`${revenueTrend > 0 ? '+' : ''}${revenueTrend.toFixed(1)}%`}
                                    trendUp={revenueTrend > 0}
                                    icon={<Activity className="w-5 h-5" />}
                                    description="Simulated 30-day velocity"
                                />
                                <KPICard
                                    title="OPERATIONAL HUBS"
                                    value={activeStoresCount}
                                    trend="+2"
                                    trendUp={true}
                                    icon={<MapPin className="w-5 h-5" />}
                                    description="Global distribution points"
                                />
                                <KPICard
                                    title="STOCKOUT RISK"
                                    value={stockoutRiskCount}
                                    trend={stockoutRiskCount > 5 ? "CRITICAL" : "LOW"}
                                    trendUp={stockoutRiskCount < 5}
                                    icon={<AlertTriangle className="w-5 h-5" />}
                                    description="Click to isolate risks"
                                    variant={stockoutRiskCount > 5 ? "warning" : "default"}
                                    onClick={() => setTableFilter('Stockout Risk')}
                                />
                                <KPICard
                                    title="CUSTOMER CSAT"
                                    value="94.2%"
                                    trend="+0.8"
                                    trendUp={true}
                                    icon={<Users className="w-5 h-5" />}
                                    description="Experience satisfaction"
                                />
                            </div>

                            {/* Center Panel (Analytics & AI Chat) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2">
                                    <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden h-[400px] bg-white">
                                        <RevenueChart />
                                    </Card>
                                </div>
                                <div className="lg:col-span-1">
                                    <AIChatHub
                                        messages={chatMessages}
                                        input={chatInput}
                                        setInput={setChatInput}
                                        onSend={handleSendMessage}
                                        isLoading={isChatLoading}
                                        scrollRef={chatEndRef}
                                    />
                                </div>
                            </div>

                            {/* Secondary Layer (Category Distribution & Conversion) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-1">
                                    <CategoryDistributionChart inventory={localInventory} />
                                </div>
                                <div className="lg:col-span-2">
                                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden h-full bg-white">
                                        <CardHeader className="bg-white border-b border-slate-50 p-8 flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle className="text-2xl font-black italic">Conversion Efficiency</CardTitle>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Lifecycle Tracking</p>
                                            </div>
                                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <RevenueChart />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Primary Data Grid */}
                            <div className="pb-20">
                                <InventoryTable
                                    data={sortedInventory}
                                    onSort={handleSort}
                                    sortConfig={sortConfig}
                                    onAction={showActionToast}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Inventory Map' && (
                        <div className="animate-in fade-in duration-700 h-full pb-20">
                            <StoreManagementView onAction={showActionToast} />
                        </div>
                    )}

                    {activeTab === 'Smart Forecast' && (
                        <div className="animate-in fade-in duration-700 h-full pb-20">
                            <SmartForecastView onAction={showActionToast} />
                        </div>
                    )}

                    {activeTab === 'Settings' && (
                        <div className="animate-in slide-in-from-bottom-6 duration-700 pb-20">
                            <SystemSettingsView
                                onAction={showActionToast}
                                isSaving={isSaving}
                                setIsSaving={setIsSaving}
                                onOpenSecurity={() => setIsSecurityModalOpen(true)}
                                onOpenInvite={() => setIsInviteModalOpen(true)}
                                onOpenPayment={() => setIsPaymentModalOpen(true)}
                            />
                        </div>
                    )}

                    {activeTab === 'Profile' && (
                        <div className="animate-in slide-in-from-right-10 duration-700 pb-20">
                            <ProfileView onAction={showActionToast} />
                        </div>
                    )}
                </div>

                {/* Common Modals */}
                {isAddSKUModalOpen && (
                    <SKUModal
                        item={editingItem}
                        onClose={() => setIsAddSKUModalOpen(false)}
                        onSave={(newItem: InventoryItem) => {
                            if (editingItem) {
                                setLocalInventory(prev => prev.map(i => i.id === editingItem.id ? newItem : i));
                                showActionToast(`Updated SKU: ${newItem.id}`);
                            } else {
                                setLocalInventory(prev => [newItem, ...prev]);
                                showActionToast(`Registered New SKU: ${newItem.id}`);
                            }
                            setIsAddSKUModalOpen(false);
                        }}
                    />
                )}

                {isSecurityModalOpen && (
                    <SecurityModal onClose={() => setIsSecurityModalOpen(false)} onAction={showActionToast} />
                )}

                {isInviteModalOpen && (
                    <InviteModal onClose={() => setIsInviteModalOpen(false)} onAction={showActionToast} />
                )}

                {isPaymentModalOpen && (
                    <PaymentUpdateModal onClose={() => setIsPaymentModalOpen(false)} onAction={showActionToast} />
                )}

                {/* Global Notification Toast */}
                {toast && (
                    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-10 duration-500">
                        <div className="bg-slate-900/95 backdrop-blur-xl text-white px-8 py-4 rounded-3xl shadow-2xl shadow-indigo-200 border border-white/10 flex items-center gap-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-sm font-black tracking-tight">{toast.message}</span>
                            <button onClick={() => setToast(null)} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

// --- Sub-Components ---

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
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300",
                active
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
        >
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
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
    icon,
    variant = "default",
    onClick
}: {
    title: string,
    value: string | number,
    trend: string,
    trendUp: boolean,
    description: string,
    icon?: React.ReactNode,
    variant?: "default" | "warning" | "danger",
    onClick?: () => void
}) {
    return (
        <Card
            className={cn(
                "border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl relative",
                onClick && "active:scale-95"
            )}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white p-6">
                <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
                <div className={cn(
                    "p-2.5 rounded-2xl",
                    variant === 'warning' ? "bg-amber-50 text-amber-500" :
                        variant === 'danger' ? "bg-rose-50 text-rose-500" : "bg-indigo-50 text-indigo-500"
                )}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent className="bg-white px-6 pb-6 pt-0">
                <div className="flex items-end gap-3 mb-2">
                    <div className="text-3xl font-black text-slate-900 tracking-tightest">{value}</div>
                    <div className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 mb-1.5",
                        trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                        {trendUp ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                        {trend}
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{description}</p>
            </CardContent>
            {variant === 'warning' && <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500" />}
            {variant === 'danger' && <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500" />}
        </Card>
    )
}

function PerformanceAnalytics({ data }: { data: SaleRecord[] }) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden h-full bg-white">
            <CardHeader className="bg-white border-b border-slate-50 p-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-black italic">Sales Velocity</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Performance Monitoring</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight">Profit</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[400px] p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b_8', fontSize: 10, fontWeight: 700 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                color: '#fff'
                            }}
                            itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorProf)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

function AIChatHub({
    messages,
    input,
    setInput,
    onSend,
    isLoading,
    scrollRef
}: {
    messages: ChatMessage[],
    input: string,
    setInput: (v: string) => void,
    onSend: () => void,
    isLoading: boolean,
    scrollRef?: React.RefObject<HTMLDivElement>
}) {
    return (
        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden h-full flex flex-col bg-white">
            <CardHeader className="bg-slate-950 text-white p-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center animate-pulse shadow-xl shadow-indigo-500/20">
                        <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black italic">Pulse AI Advisor</CardTitle>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link Synchronized</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((m) => (
                    <div key={m.id} className={cn(
                        "flex flex-col max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                        m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}>
                        <div className={cn(
                            "px-6 py-4 rounded-3xl text-sm font-bold leading-relaxed shadow-xl",
                            m.role === 'user'
                                ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100"
                                : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-slate-100"
                        )}>
                            {m.content}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 mt-2 uppercase tracking-tighter">
                            {m.role === 'user' ? 'Operator Authenticated' : 'Pulse Intelligence Core'} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-3 text-indigo-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Decision Matrix...</span>
                    </div>
                )}
                <div ref={scrollRef} />
            </CardContent>
            <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
                <div className="relative">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSend()}
                        placeholder="Inquire about store performance..."
                        className="w-full h-16 bg-white border border-slate-200 rounded-2xl pl-6 pr-16 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm"
                    />
                    <Button
                        size="icon"
                        onClick={onSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl shadow-indigo-200 transition-all active:scale-90"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}

function CategoryDistributionChart({ inventory }: { inventory: InventoryItem[] }) {
    const categories = [
        { name: 'Audio', color: 'bg-indigo-500' },
        { name: 'Computing', color: 'bg-emerald-500' },
        { name: 'Mobile', color: 'bg-amber-500' },
        { name: 'Peripherals', color: 'bg-rose-500' }
    ]

    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden h-full bg-white p-8">
            <CardTitle className="text-xl font-black italic mb-6">Category Distribution</CardTitle>
            <div className="space-y-6">
                {categories.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{cat.name}</span>
                            <span className="text-sm font-black text-slate-900">25%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all duration-1000", cat.color)} style={{ width: '25%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
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
    )
}

function ConversionFunnel({ data }: { data: SaleRecord[] }) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden h-full bg-white p-8">
            <CardTitle className="text-xl font-black italic mb-8 text-center">Conversion Funnel</CardTitle>
            <div className="space-y-12 max-w-md mx-auto">
                <FunnelStep label="Reach" value="1.2M" sub="Total Impressions" color="bg-slate-900" width="100%" />
                <FunnelStep label="Intent" value="450k" sub="Product Views" color="bg-indigo-600" width="80%" />
                <FunnelStep label="Checkouts" value="82k" sub="Cart Addition" color="bg-indigo-500" width="60%" />
                <FunnelStep label="Sales" value="12.4k" sub="Completed Orders" color="bg-emerald-500" width="40%" />
            </div>
        </Card>
    )
}

function InventoryItemRow({ item }: { item: InventoryItem }) {
    const statusConfig = {
        'In Stock': { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: <CheckCircle2 className="w-3 h-3" /> },
        'Low Stock': { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <AlertCircle className="w-3 h-3" /> },
        'Critical': { color: 'text-rose-600 bg-rose-50 border-rose-100', icon: <XCircle className="w-3 h-3" /> }
    }
    const config = statusConfig[item.status]

    return (
        <tr className="group hover:bg-slate-50/50 transition-colors">
            <td className="py-6 pl-8">
                <div>
                    <div className="text-sm font-black text-slate-900">{item.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{item.id}</div>
                </div>
            </td>
            <td className="py-6">
                <div className="text-sm font-black text-slate-900">{item.stock} Units</div>
            </td>
            <td className="py-6">
                <Badge className={cn("rounded-lg px-3 py-1 border flex items-center gap-1.5 w-fit", config.color)}>
                    {config.icon}
                    <span className="text-[10px] uppercase font-black tracking-tight">{item.status}</span>
                </Badge>
            </td>
            <td className="py-6 pr-8 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                        <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-emerald-50 hover:text-emerald-600">
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    )
}

function InventoryTable({
    data,
    onSort,
    sortConfig,
    onAction
}: {
    data: InventoryItem[],
    onSort: (key: keyof InventoryItem) => void,
    sortConfig: { key: keyof InventoryItem; direction: 'asc' | 'desc' } | null,
    onAction: (message: string) => void
}) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-50">
                        <th className="py-6 pl-8 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('name')}>
                            Product Intelligence {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('stock')}>
                            Global Stock {sortConfig?.key === 'stock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('status')}>
                            Neural Status {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="py-6 pr-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Matrix</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {data.map((item) => (
                        <InventoryItemRow key={item.id} item={item} />
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-20 text-center">
                                <div className="flex flex-col items-center gap-4 text-slate-300">
                                    <Search className="w-12 h-12 opacity-20" />
                                    <p className="text-sm font-black uppercase tracking-widest opacity-40">No matching assets in local hub</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </Card>
    )
}

function StoreManagementView({ onAction }: { onAction: (msg: string) => void }) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white h-[600px] flex items-center justify-center">
            <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-slate-200 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Regional Intelligence Map</h3>
                <p className="text-slate-400 font-bold">Geospatial data visualization module active</p>
                <Button onClick={() => onAction("Map Interaction")} variant="outline">
                    Explore Regions
                </Button>
            </div>
        </Card>
    )
}

function SmartForecastView({ onAction }: { onAction: (msg: string) => void }) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white h-[600px] flex items-center justify-center">
            <div className="text-center space-y-4">
                <BrainCircuit className="w-16 h-16 text-slate-200 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Neural Forecast Engine</h3>
                <p className="text-slate-400 font-bold">Predictive modeling in progress</p>
                <Button onClick={() => onAction("Forecast Generated")} className="bg-indigo-600 text-white">
                    Run Simulation
                </Button>
            </div>
        </Card>
    )
}

function SystemSettingsView({ onAction, isSaving, setIsSaving, onOpenSecurity, onOpenInvite, onOpenPayment }: any) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-8">System Configuration</h3>
            <div className="grid gap-6 max-w-2xl">
                <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <Lock className="w-6 h-6 text-slate-400" />
                        <div>
                            <p className="font-bold text-slate-900">Security Protocol</p>
                            <p className="text-xs text-slate-400 font-bold">2FA & Access Keys</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={onOpenSecurity}>Configure</Button>
                </div>
                <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <Users className="w-6 h-6 text-slate-400" />
                        <div>
                            <p className="font-bold text-slate-900">Team Access</p>
                            <p className="text-xs text-slate-400 font-bold">Manage Roles</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={onOpenInvite}>Invite</Button>
                </div>
                <div className="flex items-center justify-between p-6 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6 text-slate-400" />
                        <div>
                            <p className="font-bold text-slate-900">Billing Matrix</p>
                            <p className="text-xs text-slate-400 font-bold">Payment Methods</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={onOpenPayment}>Update</Button>
                </div>
            </div>
        </Card>
    )
}

function ProfileView({ onAction }: { onAction: (msg: string) => void }) {
    return (
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white p-10">
            <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-black text-slate-300">AD</span>
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900">Admin User</h3>
                    <p className="text-slate-400 font-bold">admin@retailpulse.com</p>
                </div>
            </div>
        </Card>
    )
}

function SKUModal({ item, onClose, onSave }: any) {
    const [formData, setFormData] = useState(item || { id: '', name: '', stock: 0, status: 'In Stock' })
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-black mb-4">{item ? 'Edit SKU' : 'New SKU'}</h3>
                <div className="space-y-4">
                    <input className="w-full p-3 border rounded-xl" placeholder="SKU ID" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} />
                    <input className="w-full p-3 border rounded-xl" placeholder="Product Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input className="w-full p-3 border rounded-xl" type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} />
                </div>
                <div className="flex gap-3 mt-6">
                    <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-indigo-600 text-white" onClick={() => onSave(formData)}>Save</Button>
                </div>
            </Card>
        </div>
    )
}

function SecurityModal({ onClose, onAction }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-black mb-4">Security Settings</h3>
                <p className="text-slate-500 mb-6 font-bold">Two-Factor Authentication is currently enabled.</p>
                <Button className="w-full bg-indigo-600 text-white" onClick={onClose}>Done</Button>
            </Card>
        </div>
    )
}

function InviteModal({ onClose, onAction }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-black mb-4">Invite Team Member</h3>
                <input className="w-full p-3 border rounded-xl mb-6" placeholder="Email Address" />
                <div className="flex gap-3">
                    <Button className="flex-1" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-indigo-600 text-white" onClick={() => { onAction("Invitation Sent"); onClose(); }}>Send Invite</Button>
                </div>
            </Card>
        </div>
    )
}

function PaymentUpdateModal({ onClose, onAction }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md bg-white p-6 rounded-3xl">
                <h3 className="text-xl font-black mb-4">Update Payment Method</h3>
                <div className="p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                    <p className="font-black text-slate-900">Visa ending in 4242</p>
                    <p className="text-xs text-slate-400 font-bold">Expires 12/28</p>
                </div>
                <Button className="w-full bg-indigo-600 text-white" onClick={() => { onAction("Payment Method Updated"); onClose(); }}>Add New Card</Button>
            </Card>
        </div>
    )
}
