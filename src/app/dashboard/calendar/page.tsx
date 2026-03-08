"use client";

import { useState, useEffect } from "react";
import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Wallet, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { format, isSameDay, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function CalendarPage() {
    const { events, isLoading } = useCalendar();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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
        <div className="space-y-8 animate-in fade-in duration-500">
            <style jsx global>{`
                .has-premium {
                    background-color: #d1fae5 !important;
                    color: #047857 !important;
                    font-weight: 700 !important;
                    border: 1px solid #a7f3d0 !important;
                }
                .has-expiry {
                    background-color: #fee2e2 !important;
                    color: #b91c1c !important;
                    font-weight: 700 !important;
                    border: 1px solid #fecaca !important;
                }
                .rdp-months {
                    width: 100%;
                }
            `}</style>
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">缴费与保障日历</h2>
                <p className="text-slate-500 font-medium tracking-wide">
                    为您自动推算并汇总家庭保单的每一个关键节点
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Calendar View */}
                <Card className="lg:col-span-8 overflow-hidden border-slate-200">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-emerald-600" />
                            <CardTitle>保障视图</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex justify-center flex-col sm:flex-row gap-8">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                locale={zhCN}
                                className="rounded-md border border-slate-100 shadow-sm w-full xl:w-auto overflow-x-auto pb-4"
                                modifiers={modifiers}
                                modifiersClassNames={modifiersClassNames}
                                numberOfMonths={3}
                                pagedNavigation
                                showOutsideDays={false}
                            />

                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                        图例说明
                                    </h4>
                                    <div className="grid gap-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                            <span>续期缴费扣款</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <span>保单到期提醒</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                            <span>用户自定义事件</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                    <p className="text-xs text-emerald-800/70 font-bold uppercase tracking-wider mb-1">AI 智能分析</p>
                                    <p className="text-sm text-emerald-900">
                                        根据当前保单，下一次自动扣款预计在 3 月 23 日，请确保支付卡余额充足。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Event Sidebar */}
                <Card className="lg:col-span-4 border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {selectedDate ? format(selectedDate, "PPP", { locale: zhCN }) : "待办事项"}
                        </CardTitle>
                        <CardDescription>
                            选定日期的保单事项清单
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {eventsOnSelectedDate.length > 0 ? (
                                <div className="space-y-4">
                                    {eventsOnSelectedDate.map((event) => (
                                        <div
                                            key={event.id}
                                            className="group relative p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 p-2 rounded-xl ${event.type === 'premium' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {event.type === 'premium' ? <Wallet className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-slate-900 line-clamp-1">{event.title}</p>
                                                    <p className="text-xs text-slate-500">{event.policy_description}</p>
                                                    {event.amount && (
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <span className="text-xs font-medium text-slate-500 text-slate-400">金额:</span>
                                                            <span className="text-sm font-bold text-emerald-600">¥{event.amount}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                                    <Clock className="w-10 h-10 mb-2 opacity-20" />
                                    <p className="text-sm">该日期暂无待办事项</p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
