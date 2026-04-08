"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Input, Avatar, List, Typography, Popover } from "antd";
import { SendOutlined, CloseOutlined, UserOutlined, SmileOutlined, PictureOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { ChatMessage, CurrentUser } from "@/types/entity";
import { useChat } from "@/hooks/useChat";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { EmptyState } from "../EmptyState";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface ModalChatUserProps {
  open: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUnreadCountChange?: (count: number) => void;
}

const ModalChatUser: React.FC<ModalChatUserProps> = ({
  open,
  onClose,
  currentUser,
  onUnreadCountChange,
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    socket,
    messages,
    isConnected,
    onlineUsers,
    selectedUserId,
    userUnreadCount,
    sendMessage,
    selectUser,
    setIsReading,
  } = useChat(currentUser);

  // Báo unread count lên parent để hiển thị badge trên icon
  useEffect(() => {
    onUnreadCountChange?.(userUnreadCount);
  }, [userUnreadCount, onUnreadCountChange]);

  // Khi mở/đóng modal: quản lý trạng thái đọc
  useEffect(() => {
    if (open) {
      // Reset unread NGAY LẬP TỨC + chặn tăng unread khi đang đọc
      setIsReading(true);

      // Gọi server để persist (background, không block UI)
      if (socket && isConnected) {
        socket.emit("getChatHistory", {});
      }

      // Scroll xuống cuối
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      // Đóng modal → cho phép tăng unread lại
      setIsReading(false);
    }
  }, [open, socket, isConnected, setIsReading]);

  // Scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (open && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, open]);

  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: ChatMessage[] } = {};
    messages.forEach((msg) => {
      const date = format(new Date(msg.timestamp), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  }, [messages]);

  const renderDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hôm nay";
    if (isYesterday(date)) return "Hôm qua";
    return format(date, "dd MMMM, yyyy", { locale: vi });
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue.trim(), selectedUserId || undefined);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });


  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };
  return (
    <div
      className={`fixed inset-0 bg-background/50 z-[1000] items-center justify-center ${open ? "flex" : "hidden"
        }`}
      onClick={onClose}
    >
      <div
        className={`
          bg-background flex flex-col overflow-hidden shadow-2xl border border-border transition-all duration-300
          w-[95%] h-[85%] max-h-[90vh] rounded-xl
          sm:w-4/5 sm:max-w-xl sm:h-3/5 sm:fixed sm:right-[70px] sm:bottom-[70px] sm:rounded-lg
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="bg-blue-600 flex-shrink-0" icon={<UserOutlined />} size={38} />
            <div className="min-w-0">
              <Text strong className="block truncate text-[15px]">Hỗ trợ Trực tuyến (Admin)</Text>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <Text
                  className={`text-[12px] whitespace-nowrap ${isConnected ? "text-green-600" : "text-red-500"}`}
                >
                  {isConnected ? "Đang kết nối" : "Mất kết nối"}
                </Text>
              </div>
            </div>
          </div>
          <Button
            className="flex-shrink-0"
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </div>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {currentUser.role === "admin" && (
            <div className="hidden sm:flex w-64 border-r border-border flex-col bg-muted/20 flex-shrink-0">
              <div className="px-3 py-2 border-b border-border">
                <Text strong>Online Users</Text>
              </div>
              <div className="flex-1 overflow-auto">
                <List
                  dataSource={onlineUsers}
                  renderItem={(userId: string) => (
                    <List.Item
                      className={`cursor-pointer px-3 hover:bg-muted transition-colors ${selectedUserId === userId ? "bg-primary/10 border-r-2 border-primary" : ""
                        }`}
                      onClick={() => selectUser(userId)}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<span className="text-sm">User {userId.slice(-4)}</span>}
                        description={<span className="text-xs text-success font-medium">Online</span>}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-background min-h-0 relative">
            <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden min-h-0 scroll-smooth">
              {messages.length === 0 ? (
                <EmptyState height="sm" title="Bắt đầu trò chuyện" description="Hãy chia sẻ vấn đề của bạn, Admin sẽ trực tiếp phản hồi lại ngay!" />
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center my-4">
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                      <span className="mx-4 bg-muted p-2 border border-dashed rounded-2xl text-foreground text-[10px] font-bold uppercase tracking-[2px] whitespace-nowrap">
                        {renderDateLabel(date)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                    </div>

                    {msgs.map((message: ChatMessage) => (
                      <div
                        key={message.id}
                        className={`flex mb-2 ${message.senderId === currentUser.id ? "justify-end" : "justify-start"
                          }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${message.senderId === currentUser.id
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-muted border border-border text-foreground rounded-tl-none"
                            }`}
                        >
                          <div className="text-[14px] leading-relaxed break-words">{message.content}</div>
                          <div className={`text-[10px] ${message.senderId === currentUser.id ? "text-right" : "text-left"
                            }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-background border-t border-border p-2 sm:p-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="hidden xs:flex gap-1">
                  <Button type="text" size="small" icon={<PlusCircleOutlined />} className="opacity-60" />
                  <Button type="text" size="small" icon={<PictureOutlined />} className="opacity-60" />
                </div>

                <div className="relative flex-1">
                  <Input
                    className="w-full rounded-[20px] py-1.5 px-4 pr-10 bg-muted/50 border-none focus:bg-muted focus:ring-0"
                    placeholder={t('chat.enter-message')}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoComplete="off"
                  />
                  <Popover
                    content={
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.LIGHT}
                        width={280}
                        height={350}
                        skinTonesDisabled
                        searchDisabled
                      />
                    }
                    trigger="click"
                    placement="topRight"
                  >
                    <SmileOutlined className="absolute right-3 top-1/2 -translate-y-1/2 text-[18px] opacity-60 cursor-pointer hover:opacity-100" />
                  </Popover>
                </div>

                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0"
                />
              </div>
              <div className="h-1 sm:hidden"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChatUser;