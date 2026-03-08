import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
}

interface ChatState {
    messages: Message[];
    addMessage: (message: Message) => void;
    updateMessage: (id: string, content: string, isStreaming?: boolean) => void;
    clearChat: () => void;
}

const initialMessages: Message[] = [
    {
        id: "1",
        role: "assistant",
        content: "您好！我是您的智能保单管家。基于您的真实保单条款和专属保单数据，您可以向我提问，例如：\n- 『我下个月需要交多少保费？』\n- 『如果我不幸得了重疾，目前哪些保单可以赔付？』\n- 『我的招商信诺两全险什么时候到期？』\n\n请问有什么可以帮您？"
    }
];

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: initialMessages,
            addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
            updateMessage: (id, content, isStreaming) =>
                set((state) => ({
                    messages: state.messages.map((msg) =>
                        msg.id === id
                            ? { ...msg, content, isStreaming: isStreaming !== undefined ? isStreaming : msg.isStreaming }
                            : msg
                    )
                })),
            clearChat: () => set({ messages: initialMessages }),
        }),
        {
            name: "chat-storage", // stores chat history in localStorage
        }
    )
);
