import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GeminiInsight() {
    return (
        <Card className="border-none shadow-xl shadow-purple-500/10 bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-900/20 overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 fill-purple-600/20" />
                </div>
                <div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white pb-0.5">Gemini Intelligence</CardTitle>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600/70 dark:text-purple-400/70">Live Analysis</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Strategic Insight</h4>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                        Revenue dipped <span className="text-rose-500">8%</span> on Wednesday. Primary Cause: Stockout of "Wireless Earbuds" in the East Region.
                    </p>
                </div>

                <div className="bg-purple-500/5 dark:bg-purple-500/10 rounded-xl p-4 border border-purple-100 dark:border-purple-500/20">
                    <div className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 shrink-0" />
                        <div className="space-y-3 w-full">
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-purple-700 dark:text-purple-300 mb-1">Recommended Action</h4>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Re-route <span className="font-bold text-slate-900 dark:text-white">500 units</span> from the South Warehouse to prevent further loss.
                                </p>
                            </div>
                            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 border-none group">
                                Execute Transfer
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
