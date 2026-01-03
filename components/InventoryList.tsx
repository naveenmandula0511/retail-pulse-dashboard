import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { inventoryData } from "@/lib/mockData"
import { cn } from "@/lib/utils"

export function InventoryList() {
    return (
        <div className="h-[350px] overflow-auto relative">
            <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow>
                        <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Product Name</TableHead>
                        <TableHead className="text-right font-bold text-slate-400 uppercase tracking-wider text-[10px]">Stock Level</TableHead>
                        <TableHead className="text-right font-bold text-slate-400 uppercase tracking-wider text-[10px]">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventoryData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium text-sm text-slate-900">{item.name}</TableCell>
                            <TableCell className="text-right font-bold text-slate-600">{item.stock}</TableCell>
                            <TableCell className="text-right">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "capitalize border-transparent font-bold",
                                        item.status === 'In Stock' && "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                                        item.status === 'Low Stock' && "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
                                        item.status === 'Critical' && "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                    )}
                                >
                                    {item.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
