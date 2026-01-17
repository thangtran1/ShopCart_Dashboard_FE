import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Input, Button, Tooltip, Popover, Avatar, Space } from "antd";
import {
  VideoCameraOutlined,
  PhoneOutlined,
  HeartOutlined,
  AudioOutlined,
  PictureOutlined,
  CameraOutlined,
  SmileOutlined,
  CloseOutlined,
  EllipsisOutlined,
  SearchOutlined,
  SendOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useChat } from "@/hooks/useChat";
import { ChatMessage, CurrentUser, Conversation } from "@/types/entity";

import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../EmptyState";
import ChatBubble from "./ChatBubble";

interface ModalChatAdminProps {
  open: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
}

const ModalChatAdmin: React.FC<ModalChatAdminProps> = ({
  open,
  onClose,
  currentUser,
}) => {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    conversations,
    selectedUserId,
    onlineUsers,
    sendMessage,
    selectUser,
    messages,
  } = useChat(currentUser);

  const activeConversation = conversations.find(
    (conv: Conversation) => conv.userId === selectedUserId
  );

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation, messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedUserId) {
      sendMessage(inputValue.trim(), selectedUserId);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
  };

  const filteredConversations = useMemo(() => {
    if (!debouncedSearchTerm) {
      return conversations;
    }

    return conversations.filter(
      (conv: Conversation) =>
        (conv.userName || conv.userEmail)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        conv.userEmail.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [conversations, debouncedSearchTerm]);

  const groupedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return {};
    const groups: { [key: string]: ChatMessage[] } = {};
    messages.forEach((msg: ChatMessage) => {
      const date = format(new Date(msg.timestamp), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  }, [messages]);

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Hôm nay";
    if (isYesterday(date)) return "Hôm qua";
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[999]" onClick={onClose} />
      <div
        className="fixed bottom-[70px] right-[70px] w-[700px] h-[600px] max-w-[90vw] max-h-[85vh] bg-background shadow-[0_15px_40px_rgba(0,0,0,0.35)] rounded-[16px] flex z-[1000] overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[35%] border-r border-border flex flex-col">
          <div className="p-[15px_20px] border-b border-border flex justify-between items-center">
            <span className="text-lg font-semibold">{t('chat.manager-chat-user')}</span>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onClose}
            />
          </div>
          <div className="p-[10px] border-b border-border">
            <Input
              placeholder={t('chat.search-user')}
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="flex-1 overflow-y-auto"
            key={`user-list-${filteredConversations.length}`}
          >
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation: Conversation) => (
                <div
                  key={conversation.userId}
                  className={`cursor-pointer gap-2 p-[12px_20px] rounded-[8px] m-[4px_8px] transition-all duration-200 border-none flex items-center
          ${selectedUserId === conversation.userId
                      ? "bg-primary/10"
                      : "hover:bg-muted/40"
                    }`}
                  onClick={() => selectUser(conversation.userId)}
                >
                  <div className="relative">
                    <Avatar
                      size={40}
                      className={`mr-1 ${onlineUsers.includes(conversation.userId)
                        ? "bg-success ring-2 ring-background"
                        : "bg-gray-400"
                        }`}
                    >
                      {conversation.userEmail.charAt(0).toUpperCase()}
                    </Avatar>
                    {onlineUsers.includes(conversation.userId) && (
                      <span className="absolute bottom-0 right-1 w-3 h-3 bg-success border-2 border-background rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 ml-2">
                    <div className="font-medium truncate text-sm">
                      {conversation.userName || conversation.userEmail}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage?.content ||
                        (conversation.hasConversation
                          ? t('management.chat.no-message')
                          : t('management.chat.no-start-chat'))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2">
                <EmptyState height="sm" title={t('chat.empty')} description={t('chat.no-user-found')} />
              </div>
            )}
          </div>
        </div>

        <div className="w-[65%] flex flex-col bg-background">
          {activeConversation ? (
            <>
              <div className="flex justify-between items-center p-[15px_20px] border-b border-border bg-background">
                <div className="flex gap-2 items-center">
                  <Avatar
                    size={40}
                    className={`mr-3 ${onlineUsers.includes(activeConversation.userId)
                      ? "bg-success"
                      : "bg-gray-400"
                      }`}
                  >
                    {activeConversation.userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <div className="font-semibold text-base">
                      {activeConversation.userName ||
                        activeConversation.userEmail}
                    </div>
                    <div
                      className={`text-xs transition-colors ${onlineUsers.includes(activeConversation.userId)
                        ? "text-success"
                        : "text-foreground"
                        }`}
                    >
                      {onlineUsers.includes(activeConversation.userId)
                        ? t("management.chat.online") : t("management.chat.offline")}
                    </div>
                  </div>
                </div>
                <Space>
                  <Tooltip title={t("management.chat.call-video")}>
                    <Button type="text" icon={<VideoCameraOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.call-phone")}>
                    <Button type="text" icon={<PhoneOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.add-to-favorites")}>
                    <Button type="text" icon={<HeartOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.add")}>
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </Tooltip>
                </Space>
              </div>

              <div
                className="flex-1 p-5 overflow-y-auto flex flex-col"
                ref={listRef}
              >
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center my-4">
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                      <span className="mx-4 bg-muted p-2 border border-dashed rounded-2xl text-foreground text-[10px] font-bold uppercase tracking-[2px] whitespace-nowrap">
                        {formatDateHeader(date)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                    </div>
                    {msgs.map((msg) => (
                      <ChatBubble
                        key={msg.id}
                        msg={msg}
                        currentUserId={currentUser.id}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center p-[12px_20px] bg-background border-t border-border">
                <Space size="small">
                  <Tooltip title={t("management.chat.add")}>
                    <Button type="text" icon={<PlusCircleOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.camera")}>
                    <Button type="text" icon={<CameraOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.image")}>
                    <Button type="text" icon={<PictureOutlined />} />
                  </Tooltip>
                  <Tooltip title={t("management.chat.mic")}>
                    <Button type="text" icon={<AudioOutlined />} />
                  </Tooltip>
                </Space>
                <div className="relative flex-1 mx-2">
                  <Input
                    className="w-full rounded-[25px] px-[48px_15px_15px] bg-background border-none shadow-none outline-none"
                    placeholder={t('chat.enter-message')}
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
                  disabled={!inputValue.trim() || !selectedUserId}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-muted-foreground p-10 bg-muted/5">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <SendOutlined className="text-3xl opacity-20" />
              </div>
              <p className="text-lg font-medium">{t("management.chat.select-user-to-start-chat")}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalChatAdmin;
