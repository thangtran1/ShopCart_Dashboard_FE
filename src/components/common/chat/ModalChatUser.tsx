"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Button, Input, Avatar, List, Typography, Space, Popover, Tooltip } from "antd";
import { SendOutlined, CloseOutlined, UserOutlined, SmileOutlined, AudioOutlined, PictureOutlined, PlusCircleOutlined, CameraOutlined } from "@ant-design/icons";
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
}

const ModalChatUser: React.FC<ModalChatUserProps> = ({
  open,
  onClose,
  currentUser,
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isConnected,
    onlineUsers,
    selectedUserId,
    sendMessage,
    selectUser,
  } = useChat(currentUser);

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

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
    className={`fixed inset-0 bg-background/50 z-[1000] items-center justify-center ${
      open ? "flex" : "hidden"
    }`}
    onClick={onClose}
  >
     <div
      className="w-4/5 max-w-xl h-3/5 bg-background rounded-lg fixed right-[70px] bottom-[70px] flex flex-col overflow-hidden shadow-2xl border border-border"
      onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-muted">
          <div>
            <Text strong>Chat Support</Text>
            <div>
              <Text
                type={isConnected ? "success" : "danger"}
                className="text-[12px]"
              >
                ● {isConnected ? "Connected" : "Disconnected"}
              </Text>
            </div>
          </div>
          <Button className="cursor-pointer" type="text" icon={<CloseOutlined />} onClick={onClose} />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {currentUser.role === "admin" && (
            <div className="w-64 border-r border-border flex flex-col bg-muted/20">
              <div className="px-3 py-2 border-b border-border">
                <Text strong>Online Users</Text>
              </div>
              <div className="flex-1 overflow-auto">
                <List
                  dataSource={onlineUsers}
                  renderItem={(userId: string) => (
                    <List.Item
                      className={`cursor-pointer px-3 hover:bg-muted transition-colors ${
                        selectedUserId === userId ? "bg-primary/10 border-r-2 border-primary" : ""
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

          <div className="flex-1 flex flex-col bg-background">
            <div className="flex-1 p-4 overflow-auto">
              {messages.length === 0 ? (
                <EmptyState height="sm" title={t('chat.empty')} description={t('chat.no_messages_yet')} />
              ) : (
                Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center my-6 px-4">
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                      <span className="mx-4 bg-muted p-2 border border-dashed rounded-2xl text-foreground text-[10px] font-bold uppercase tracking-[2px] whitespace-nowrap">
                        {renderDateLabel(date)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                    </div>

                    {msgs.map((message: ChatMessage) => (
                      <div
                        key={message.id}
                        className={`flex mb-3 ${
                          message.senderId === currentUser.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-3 py-2 rounded-2xl shadow-sm ${
                            message.senderId === currentUser.id
                              ? "bg-primary text-white rounded-tr-none"
                              : "bg-muted border border-border text-foreground rounded-tl-none"
                          }`}
                        >
                          <div className="text-[14px] leading-relaxed">{message.content}</div>
                          <div className={`text-[10px] opacity-60 mt-1 ${
                            message.senderId === currentUser.id ? "text-right" : "text-left"
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

            <div className="flex items-center p-[12px_20px] bg-background border-t border-border">
                <Space size="small">
                  <Tooltip title="Thêm">
                    <Button type="text" icon={<PlusCircleOutlined />} />
                  </Tooltip>
                  <Tooltip title="Camera">
                    <Button type="text" icon={<CameraOutlined />} />
                  </Tooltip>
                  <Tooltip title="Hình ảnh">
                    <Button type="text" icon={<PictureOutlined />} />
                  </Tooltip>
                  <Tooltip title="Mic">
                    <Button type="text" icon={<AudioOutlined />} />
                  </Tooltip>
                </Space>
                <div className="relative flex-1 mx-2">
                  <Input
                    className="w-full rounded-[25px] px-[48px_15px_15px] bg-background border-none shadow-none outline-none"
                    placeholder="Nhập tin nhắn..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <Popover
                    content={
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.LIGHT}
                        width={300}
                        height={400}
                      />
                    }
                    title="Chọn emoji"
                    trigger="click"
                    placement="topRight"
                  >
                    <SmileOutlined className="absolute right-[15px] top-1/2 -translate-y-1/2 text-[22px] text-foreground cursor-pointer" />
                  </Popover>
                </div>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChatUser;