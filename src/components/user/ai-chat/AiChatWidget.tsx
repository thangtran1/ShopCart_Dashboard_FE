import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Tooltip, Popconfirm } from "antd";
import { Icon } from "@/components/icon";
import { aiChatApi } from "@/api/services/aiChatApi";
import type { AiChatMessage, ProductSuggestion } from "@/api/services/aiChatApi";
import { useUserToken } from "@/store/userStore";
import "./ai-chat.css";

// ============ Product Card ============
function ProductCard({ product }: { product: ProductSuggestion }) {
  const navigate = useNavigate();
  const finalPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="ai-product-card group"
    >
      {product.image ? (
        <img src={product.image} alt={product.name} className="ai-product-img" />
      ) : (
        <div className="ai-product-img-placeholder">
          <Icon icon="lucide:package" size={18} />
        </div>
      )}
      <div className="ai-product-info">
        <p className="ai-product-name">{product.name}</p>
        <div className="ai-product-price-row">
          {product.discount > 0 ? (
            <>
              <span className="ai-price-final">{finalPrice.toLocaleString("vi-VN")}đ</span>
              <span className="ai-price-original">{product.price.toLocaleString("vi-VN")}đ</span>
              <span className="ai-discount-badge">-{product.discount}%</span>
            </>
          ) : (
            <span className="ai-price-final">{product.price.toLocaleString("vi-VN")}đ</span>
          )}
        </div>
      </div>
      <Icon icon="lucide:arrow-right" size={14} className="ai-product-arrow" />
    </div>
  );
}

// ============ Typing Indicator ============
function TypingIndicator() {
  return (
    <div className="ai-msg-row ai-msg-assistant">
      <div className="ai-avatar">
        <Icon icon="lucide:sparkles" size={13} />
      </div>
      <div className="ai-bubble ai-bubble-assistant">
        <div className="ai-typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

// ============ Message Bubble ============
function MessageBubble({ msg }: { msg: AiChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`ai-msg-row ${isUser ? "ai-msg-user" : "ai-msg-assistant"}`}>
      {!isUser && (
        <div className="ai-avatar">
          <Icon icon="lucide:sparkles" size={13} />
        </div>
      )}
      <div className="ai-msg-content">
        <div className={`ai-bubble ${isUser ? "ai-bubble-user" : "ai-bubble-assistant"}`}>
          {msg.content}
        </div>
        {!isUser && msg.productSuggestions?.length > 0 && (
          <div className="ai-products">
            <p className="ai-products-label">
              <Icon icon="lucide:package" size={12} /> Sản phẩm gợi ý
            </p>
            {msg.productSuggestions.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Quick Suggestions ============
const QUICK_SUGGESTIONS = [
  "Sản phẩm bán chạy nhất?",
  "Gợi ý sản phẩm dưới 10 triệu",
  "Khuyến mãi hiện tại?",
];

// ============ Main Widget ============
export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const userToken = useUserToken();

  if (!userToken?.accessToken) return null;

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ["ai-chat-history"],
    queryFn: async () => {
      const res = await aiChatApi.getHistory();
      return (res as any) || [];
    },
    enabled: isOpen,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
  });

  const { data: usage } = useQuery({
    queryKey: ["ai-chat-usage"],
    queryFn: async () => {
      const res = await aiChatApi.getUsage();
      return res as any;
    },
    enabled: isOpen,
  });

  const sendMutation = useMutation({
    mutationFn: (message: string) => aiChatApi.sendMessage(message),
    onMutate: async (newMessageText) => {
      await queryClient.cancelQueries({ queryKey: ["ai-chat-history"] });
      const previousHistory = queryClient.getQueryData(["ai-chat-history"]);

      // Optimistically push the user's message to UI history
      queryClient.setQueryData(["ai-chat-history"], (old: any) => {
        const historyArray = Array.isArray(old) ? old : [];
        return [
          ...historyArray,
          {
            _id: `temp-${Date.now()}`,
            role: "user",
            content: newMessageText,
            timestamp: new Date().toISOString(),
          },
        ];
      });

      return { previousHistory };
    },
    onError: (error: any, _variables, context) => {
      const msg = error?.response?.data?.message || error?.message || "Không thể gửi tin nhắn";
      
      queryClient.setQueryData(["ai-chat-history"], (old: any) => {
        // If optimistic update failed or didn't run, fallback to previous
        const historyArray = Array.isArray(old) ? old : (Array.isArray(context?.previousHistory) ? context.previousHistory : []);
        
        return [
          ...historyArray,
          {
            _id: `error-${Date.now()}`,
            role: "assistant", // Render as AI bot
            content: `🛑 ${msg}`,
            timestamp: new Date().toISOString(),
            productSuggestions: []
          }
        ];
      });
    },
    onSuccess: () => {
      // Invalidate history to get real DB IDs on success
      queryClient.invalidateQueries({ queryKey: ["ai-chat-history"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-chat-usage"] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => aiChatApi.clearHistory(),
    onSuccess: () => {
      queryClient.setQueryData(["ai-chat-history"], []);
      toast.success("Đã xóa lịch sử chat");
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isOpen, sendMutation.isPending, scrollToBottom]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSend = () => {
    const msg = input.trim();
    if (!msg || sendMutation.isPending) return;
    setInput("");
    sendMutation.mutate(msg);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleQuickSuggest = (q: string) => {
    setInput(q);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const usagePercent = usage
    ? Math.min((usage.messagesCount / (usage.maxMessagesPerDay || 100)) * 100, 100)
    : 0;

  const isEmpty = (history as AiChatMessage[]).length === 0 && !sendMutation.isPending;

  return (
    <>
      {/* Floating Button */}
      <Tooltip title={isOpen ? "Đóng AI" : "Trợ lý AI Thông minh"} placement="right" color="#7c3aed">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className={`ai-fab ${isOpen ? "ai-fab-open" : ""}`}
          aria-label="Mở AI Chat"
        >
          <Icon icon={isOpen ? "lucide:x" : "lucide:sparkles"} size={22} />
          {!isOpen && (
            <span className="ai-fab-label">AI</span>
          )}
        </button>
      </Tooltip>

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-panel">
          {/* Header */}
          <div className="ai-header">
            <div className="ai-header-left">
              <div className="ai-header-icon">
                <Icon icon="lucide:sparkles" size={16} />
              </div>
              <div>
                <h3 className="ai-header-title">AI Assistant</h3>
                <span className="ai-header-subtitle">✦ Powered by Gemini</span>
              </div>
            </div>
            <div className="ai-header-actions">
              <Popconfirm
                title="Xóa cuộc trò chuyện?"
                description="Hành động này không thể hoàn tác."
                onConfirm={() => clearMutation.mutate()}
                okText="Xóa"
                cancelText="Hủy"
                placement="bottomRight"
                zIndex={99999}
              >
                <button
                  className="ai-icon-btn"
                  title="Xoá lịch sử"
                  disabled={clearMutation.isPending}
                >
                  <Icon icon="lucide:rotate-ccw" size={14} />
                </button>
              </Popconfirm>
              <button onClick={() => setIsOpen(false)} className="ai-icon-btn" title="Thu nhỏ">
                <Icon icon="lucide:minus" size={14} />
              </button>
            </div>
          </div>

          {/* Usage bar */}
          {usage && (
            <div className="ai-usage-bar">
              <div className="ai-usage-track">
                <div className="ai-usage-fill" style={{ width: `${usagePercent}%` }} />
              </div>
              <span className="ai-usage-text">
                {usage.messagesCount}/{usage.maxMessagesPerDay} tin nhắn hôm nay
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="ai-messages">
            {historyLoading ? (
              <div className="ai-center">
                <Icon icon="lucide:loader-2" size={24} className="animate-spin" style={{ color: "var(--ai-purple)" }} />
              </div>
            ) : isEmpty ? (
              <div className="ai-empty">
                <div className="ai-empty-icon">
                  <Icon icon="lucide:sparkles" size={26} />
                </div>
                <p className="ai-empty-title">Xin chào! 👋</p>
                <p className="ai-empty-desc">
                  Tôi có thể tư vấn sản phẩm, so sánh giá và gợi ý phù hợp với nhu cầu của bạn.
                </p>
                <div className="ai-quick-btns">
                  {QUICK_SUGGESTIONS.map((q) => (
                    <button key={q} onClick={() => handleQuickSuggest(q)} className="ai-quick-btn">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {(history as AiChatMessage[]).map((msg) => (
                  <MessageBubble key={msg._id} msg={msg} />
                ))}
                {sendMutation.isPending && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-input-area">
            <div className="ai-input-row">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi về sản phẩm..."
                rows={1}
                className="ai-textarea"
                disabled={sendMutation.isPending}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sendMutation.isPending}
                className="ai-send-btn"
                aria-label="Gửi"
              >
                <Icon
                  icon={sendMutation.isPending ? "lucide:loader-2" : "lucide:send"}
                  size={15}
                  className={sendMutation.isPending ? "animate-spin" : ""}
                />
              </button>
            </div>
            <p className="ai-footer-note">Enter để gửi • Shift+Enter xuống dòng</p>
          </div>
        </div>
      )}
    </>
  );
}
