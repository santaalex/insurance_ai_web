"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "@/hooks/use-calendar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Wallet, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function CalendarPage() {
    const { events } = useCalendar();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedDate(new Date());
    }, []);

    if (!mounted) return null;

    // Group events by date for the small indicators
    const eventsOnSelectedDate = events.filter(event =>
        selectedDate && isSameDay(parseISO(event.date), selectedDate)
    );

    // Custom calendar modifiers to show dots
    const modifiers = {
        hasEvent: (date: Date) => events.some(e => isSameDay(parseISO(e.date), date)),
        hasPremium: (date: Date) => events.some(e => e.type === 'premium' && isSameDay(parseISO(e.date), date)),
        hasExpiry: (date: Date) => events.some(e => e.type === 'expiry' && isSameDay(parseISO(e.date), date)),
    };

    const modifiersClassNames = {
        hasPremium: "has-premium",
        hasExpiry: "has-expiry",
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
            <style jsx global>{`
                .has-premium {
                    background-color: #d1fae5 !important;
                    color: #047857 !important;
                    font-weight: 700 !important;
                    border: 1px solid #10b981 !important;
                }
                .has-expiry {
                    background-color: #fee2e2 !important;
                    color: #b91c1c !important;
                    font-weight: 700 !important;
                    border: 1px solid #ef4444 !important;
                }
                .rdp-months {
                    width: 100%;
                    justify-content: space-around;
                }
                .rdp-selected .rdp-day_button {
                    background-color: #059669 !important;
                    color: white !important;
                    font-weight: bold !important;
                    border-radius: 0.5rem !important;
                    box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.4) !important;
                }
                .rdp-today .rdp-day_button {
                    background-color: #f1f5f9 !important;
                    color: #0f172a !important;
                    border: 2px solid #059669 !important;
                    font-weight: 900 !important;
                    border-radius: 0.5rem !important;
                }
            `}</style>

            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">缴费与保障日历</h2>
                <p className="text-slate-500 font-medium tracking-wide">
                    为您自动推算并汇总家庭保单的每一个关键节点
                </p>
            </div>

            {/* Top Legend Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-emerald-600" /> 图例说明
                    </span>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <div className="w-5 h-5 rounded-md bg-[#d1fae5] border border-[#10b981] flex items-center justify-center text-xs text-[#047857] font-bold">¥</div>
                        <span>续期缴费扣款</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <div className="w-5 h-5 rounded-md bg-[#fee2e2] border border-[#ef4444] flex items-center justify-center text-xs text-[#b91c1c] font-bold">!</div>
                        <span>保单到期提醒</span>
                    </div>
                </div>
                <div className="flex-1 max-w-md bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-start gap-3">
                    <div className="mt-0.5"><Clock className="w-4 h-4 text-emerald-600" /></div>
                    <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-0.5">AI 智能分析</p>
                        <p className="text-xs text-emerald-700">根据当前保单，下一次自动扣款预计在 3 月 23 日，请确保支付卡余额充足。</p>
                    </div>
                </div>
            </div>

            {/* Calendar View (Full Width) */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-6 overflow-x-auto">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={zhCN}
                        className="w-full min-w-[800px]"
                        modifiers={modifiers}
                        modifiersClassNames={modifiersClassNames}
                        numberOfMonths={3}
                        pagedNavigation
                        showOutsideDays={false}
                    />
                </CardContent>
            </Card>

            {/* Event List (Bottom) */}
            <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                <CardHeader className="pb-4 border-b border-slate-200 bg-white rounded-t-xl">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {selectedDate ? format(selectedDate, "PPP", { locale: zhCN }) : "待办事项"}
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">
                            {eventsOnSelectedDate.length} 项日程
                        </Badge>
                    </CardTitle>
                    <CardDescription>选定日期的保单事项清单</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {eventsOnSelectedDate.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {eventsOnSelectedDate.map((event) => (
                                <div
                                    key={event.id}
                                    className="group relative p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
                                >
                                    <div className={`shrink-0 p-3 rounded-xl ${event.type === 'premium' ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
                                        {event.type === 'premium' ? <Wallet className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1.5 flex-1 pr-6">
                                        <p className="font-bold text-slate-900 text-base leading-tight">{event.title}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2">{event.policy_description}</p>
                                        {event.amount && (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md mt-1 border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">金额</span>
                                                <span className="text-sm font-black text-emerald-600">¥{event.amount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                            <Clock className="w-12 h-12 mb-3 text-slate-200" />
                            <p className="text-base font-medium text-slate-500">该日期暂无待办事项</p>
                            <p className="text-sm mt-1">您可以选择带有颜色标记的日期查看详情</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
