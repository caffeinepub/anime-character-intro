import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowUp,
  Bot,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  PenSquare,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

const CANNED_RESPONSES = [
  "That's a great question! Here's what I think — the key is to break it down into smaller parts and tackle each one methodically. Would you like me to walk you through the steps?",
  "I can help with that! Let me give you a clear and concise answer. The short version is: yes, this is absolutely doable with the right approach.",
  "Interesting! Let me think about that... From what I understand, there are a few different angles you could approach this from. The most effective one depends on your specific goals.",
  "Great point! This is actually something I find fascinating. The underlying principle here is that complexity often hides simplicity — once you see the pattern, everything clicks into place.",
  "Absolutely, happy to help! Based on what you've shared, I'd suggest starting with a clear objective and working backwards from there. That tends to produce the best results.",
  "That's a nuanced topic! The answer really depends on context, but in most cases the best practice is to prioritize clarity over cleverness. Simple solutions tend to be more robust.",
  "Good question — this comes up often. The key insight is that consistency matters more than perfection. Small, steady progress compounds into significant results over time.",
  "I love this kind of question! Here's my take: there isn't a single right answer, but there are definitely better and worse approaches. Let me outline the trade-offs for you.",
];

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    title: "How does React state work?",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How does React state work?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "React state is a built-in object that stores data which can change over time. When state changes, React re-renders the component automatically, keeping your UI in sync with your data.",
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
      },
    ],
  },
  {
    id: "2",
    title: "Best practices for TypeScript",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [
      {
        id: "m3",
        role: "user",
        content: "What are the best practices for TypeScript?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Great question! Key TypeScript best practices include: enabling strict mode, preferring interfaces over type aliases for objects, using discriminated unions for complex state, and avoiding `any` in favor of `unknown` when the type is truly unknown.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ],
  },
  {
    id: "3",
    title: "Explain async/await",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5),
    messages: [
      {
        id: "m5",
        role: "user",
        content: "Can you explain async/await in JavaScript?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
      {
        id: "m6",
        role: "assistant",
        content:
          "Async/await is syntactic sugar over Promises that makes asynchronous code look and behave more like synchronous code. The `async` keyword marks a function as asynchronous, and `await` pauses execution until a Promise resolves.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ],
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messages: [],
  },
  {
    id: "5",
    title: "Building REST APIs",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48),
    messages: [],
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 px-4 py-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
        <Sparkles className="h-4 w-4 text-primary" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0,
            }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.2,
            }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex items-end gap-3 px-4 py-2",
        isUser && "flex-row-reverse",
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-card border border-border text-foreground",
        )}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
          <span className="text-xs font-bold text-muted-foreground">U</span>
        </div>
      )}
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"
      >
        <Bot className="h-10 w-10 text-primary" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How can I help you?
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ask me anything — I'm here to help with code, writing, analysis, or
          just a good conversation.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid w-full max-w-sm grid-cols-2 gap-2"
      >
        {[
          "Explain a concept",
          "Help me write code",
          "Review my work",
          "Brainstorm ideas",
        ].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

export default function App() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("1");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? chats[0];

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New conversation",
      messages: [],
      lastUpdated: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setInput("");
    textareaRef.current?.focus();
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const titleFromMsg =
      trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.messages.length === 0 ? titleFromMsg : c.title,
              lastUpdated: new Date(),
            }
          : c,
      ),
    );
    setInput("");
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const response =
      CANNED_RESPONSES[Math.floor(Math.random() * CANNED_RESPONSES.length)];
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, aiMsg], lastUpdated: new Date() }
          : c,
      ),
    );
    setIsTyping(false);
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }, [input, isTyping, activeChatId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    },
    [],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar"
            data-ocid="chat.panel"
          >
            <div className="flex h-14 shrink-0 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  CaffeineAI
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={createNewChat}
                data-ocid="chat.open_modal_button"
                aria-label="New chat"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-3 pb-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-border bg-transparent text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={createNewChat}
                data-ocid="chat.primary_button"
              >
                <PenSquare className="h-4 w-4" />
                New chat
              </Button>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-0.5 py-2">
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Recent
                </p>
                {chats.map((chat, i) => (
                  <button
                    key={chat.id}
                    type="button"
                    data-ocid={`chat.item.${i + 1}`}
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      chat.id === activeChatId
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
                    <span className="truncate">{chat.title}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4">
              <p className="text-center text-[10px] text-muted-foreground/40">
                © {new Date().getFullYear()}.{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-muted-foreground"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen((o) => !o)}
            data-ocid="chat.toggle"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <h1 className="truncate text-sm font-medium text-foreground">
            {activeChat?.title ?? "New conversation"}
          </h1>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl">
            {activeChat?.messages.length === 0 && !isTyping ? (
              <div
                className="h-[calc(100vh-8rem)]"
                data-ocid="chat.empty_state"
              >
                <EmptyState />
              </div>
            ) : (
              <div className="py-6">
                {activeChat?.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      data-ocid="chat.loading_state"
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input bar */}
        <div className="shrink-0 border-t border-border bg-background px-4 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message CaffeineAI..."
                rows={1}
                className="max-h-[180px] min-h-[24px] flex-1 resize-none border-0 bg-transparent p-0 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                data-ocid="chat.input"
              />
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="h-8 w-8 shrink-0 rounded-xl bg-primary text-primary-foreground shadow-none transition-all hover:bg-primary/90 disabled:opacity-30"
                data-ocid="chat.submit_button"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground/40">
              CaffeineAI can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
