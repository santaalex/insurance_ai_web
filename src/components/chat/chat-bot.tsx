"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
}

export function ChatBot() {
    const masterPhone = useAuthStore(state => state.masterPhone);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "您好！我是您的智能保单管家。基于您的真实保单条款和专属保单数据，您可以向我提问，例如：\n- 『我下个月需要交多少保费？』\n- 『如果我不幸得了重疾，目前哪些保单可以赔付？』\n- 『我的招商信诺两全险什么时候到期？』\n\n请问有什么可以帮您？"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !masterPhone || isLoading) return;

        const userText = input.trim();
        setInput("");

        const newMessageId = Date.now().toString();
        setMessages(prev => [...prev, { id: newMessageId, role: "user", content: userText }]);

        const assistantMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", content: "", isStreaming: true }]);

        setIsLoading(true);

        try {
            // Point to the AI Gateway
            // In a real prod environment this would go through Next.js rewrite or direct URL
            // Since gateway is on 8000, we hardcode for local/poc
            // Better: use NEXT_PUBLIC_API_URL or relative if reverse-proxied
            const apiUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://127.0.0.1:8000";

            const response = await fetch(`${apiUrl}/api/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: userText,
                    phone: masterPhone,
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error("Failed to connect to AI Agent");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.slice(6).trim();
                            if (dataStr === '[DONE]') continue;
                            if (!dataStr) continue;

                            try {
                                const data = JSON.parse(dataStr);
                                if (data.text) {
                                    setMessages(prev => prev.map(msg =>
                                        msg.id === assistantMessageId
                                            ? { ...msg, content: msg.content + data.text }
                                            : msg
                                    ));
                                } else if (data.error) {
                                    console.error("AI Agent Error:", data.error);
                                }
                            } catch (e) {
                                console.error("Error parsing SSE chunk", e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                    ? { ...msg, content: "抱歉，由于网络波动，系统暂时无法响应，请稍后再试。" }
                    : msg
            ));
        } finally {
            setIsLoading(false);
            setMessages(prev => prev.map(msg =>
                msg.id === assistantMessageId
                    ? { ...msg, isStreaming: false }
                    : msg
            ));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all p-0 flex items-center justify-center animate-in fade-in slide-in-from-bottom-5 z-50 ring-4 ring-emerald-50"
                >
                    <MessageSquare className="w-6 h-6 text-white" />
                </Button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
                    <CardHeader className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4 py-3 flex flex-row items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-bold">智能保单管家</CardTitle>
                                <p className="text-xs text-emerald-100 font-medium opacity-90">基于真实保险条款的 RAG 问答引擎</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 hover:text-white rounded-full w-8 h-8"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 relative">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>

                        <div className="h-full overflow-y-auto p-4 space-y-4 relative z-10" ref={scrollRef}>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 max-w-[90%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                        }`}
                                >
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 shadow-sm ${message.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                        }`}>
                                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div
                                        className={`rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${message.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                            }`}
                                    >
                                        {message.content}
                                        {message.isStreaming && (
                                            <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-emerald-500 animate-pulse"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                <div className="flex gap-3 max-w-[85%] mr-auto">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mt-1 shadow-sm border border-emerald-200">
                                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                                    </div>
                                    <div className="rounded-2xl p-4 bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t border-slate-100 shadow-lg z-20">
                        <form
                            className="flex w-full items-center space-x-2 relative"
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        >
                            <Input
                                placeholder="输入您的问题，如：我的重疾险保额..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="flex-1 rounded-full pl-4 pr-12 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-inner h-10"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1 w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 shrink-0 shadow-sm"
                            >
                                <Send className="w-4 h-4 text-white ml-0.5" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </>
    );
}
