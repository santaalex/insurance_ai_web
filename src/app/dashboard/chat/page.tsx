"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { getBaseUrl } from "@/lib/request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";

export default function ChatPage() {
    const masterPhone = useAuthStore(state => state.masterPhone);
    const { messages, addMessage, updateMessage, clearChat } = useChatStore();

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
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
        addMessage({ id: newMessageId, role: "user", content: userText });

        const assistantMessageId = (Date.now() + 1).toString();
        addMessage({ id: assistantMessageId, role: "assistant", content: "", isStreaming: true });

        setIsLoading(true);

        try {
            const apiUrl = getBaseUrl();

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

            let assistantContent = "";

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
                                    assistantContent += data.text;
                                    updateMessage(assistantMessageId, assistantContent);
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
            updateMessage(assistantMessageId, "抱歉，由于网络波动，系统暂时无法响应，请稍后再试。");
        } finally {
            setIsLoading(false);
            updateMessage(assistantMessageId, useChatStore.getState().messages.find(m => m.id === assistantMessageId)?.content || "", false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto pt-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-xl">
                            <Bot className="w-8 h-8 text-emerald-600" />
                        </div>
                        智能理赔管家
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">基于您的真实保单条款，解答缴费、理赔、续保全方位疑问。</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearChat}
                    className="text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清空历史
                </Button>
            </div>

            <Card className="flex-1 flex flex-col shadow-xl border-slate-200 overflow-hidden ring-1 ring-slate-900/5 bg-white/50 backdrop-blur-sm">
                <CardContent className="flex-1 p-0 overflow-hidden relative">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>

                    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-6 relative z-10" ref={scrollRef}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-4 max-w-[85%] ${message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                    }`}
                            >
                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 shadow-sm ${message.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                    }`}>
                                    {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                </div>
                                <div
                                    className={`rounded-3xl p-4 md:p-5 text-sm md:text-base shadow-sm whitespace-pre-wrap leading-relaxed ${message.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                                        }`}
                                >
                                    {message.content}
                                    {message.isStreaming && (
                                        <span className="inline-block w-2 h-5 ml-1 align-middle bg-emerald-500 animate-pulse"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length - 1]?.role === 'user' && (
                            <div className="flex gap-4 max-w-[85%] mr-auto">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mt-1 shadow-sm border border-emerald-200">
                                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                                </div>
                                <div className="rounded-3xl p-5 bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-4 md:p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-20">
                    <form
                        className="flex w-full items-center space-x-3 relative max-w-4xl mx-auto"
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    >
                        <Input
                            placeholder="输入您的问题，如：如果我不幸得了重疾，目前哪些保单可以赔付？"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="flex-1 rounded-full pl-6 pr-14 py-6 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 shadow-inner text-base"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 shrink-0 shadow-md transition-all hover:scale-105"
                        >
                            <Send className="w-5 h-5 text-white ml-0.5" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}
