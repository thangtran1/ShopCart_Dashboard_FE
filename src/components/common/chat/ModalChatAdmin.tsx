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

import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";

interface ModalChatAdminProps {
  open: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
}

const ChatBubble = ({
  msg,
  currentUserId,
  showTimestamp,
}: {
  msg: ChatMessage;
  currentUserId: string;
  showTimestamp: boolean;
}) => {
  const isAdmin = msg.senderId === currentUserId;
  const time = new Date(msg.timestamp);
  const timeStr = format(time, "HH:mm");

  return (
    <div className={`flex mt-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-[70%] ${isAdmin ? "items-end" : "items-start"
          }`}
      >
        <div
          className={`p-[10px_14px] rounded-[18px] break-words shadow-[0_1px_2px_rgba(0,0,0,0.1)] 
            ${isAdmin
              ? "bg-primary text-primary-foreground rounded-br-[4px]"
              : "bg-background text-muted-foreground rounded-bl-[4px]"
            }`}
        >
          {msg.content}
        </div>
        {showTimestamp && (
          <div className="text-[11px] text-muted-foreground mt-[5px] px-[5px]">
            {timeStr}
          </div>
        )}
      </div>
    </div>
  );
};

const ModalChatAdmin: React.FC<ModalChatAdminProps> = ({
  open,
  onClose,
  currentUser,
}) => {
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
            <span className="text-lg font-semibold">Danh sách khách hàng</span>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onClose}
            />
          </div>
          <div className="p-[10px] border-b border-border">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            className="flex-1 overflow-y-auto"
            key={`user-list-${filteredConversations.length}`}
          >
            {filteredConversations.map((conversation: Conversation) => (
              <div
                key={conversation.userId}
                className={`cursor-pointer gap-2 p-[12px_20px] rounded-[8px] m-[4px_8px] transition-colors duration-200 border-none flex items-center
                  ${selectedUserId === conversation.userId
                    ? "bg-primary/10"
                    : "hover:bg-muted/40"
                  }`}
                onClick={() => selectUser(conversation.userId)}
              >
                <Avatar
                  size={40}
                  className={`mr-3 ${onlineUsers.includes(conversation.userId)
                      ? "bg-success"
                      : "bg-gray-400"
                    }`}
                >
                  {conversation.userEmail.charAt(0).toUpperCase()}
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">
                    {conversation.userName || conversation.userEmail}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    {conversation.lastMessage?.content ||
                      (conversation.hasConversation
                        ? "Chưa có tin nhắn"
                        : "Chưa bắt đầu chat")}
                  </div>
                </div>
              </div>
            ))}
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
                        ? "Trực tuyến"
                        : "Ngoại tuyến"}
                    </div>
                  </div>
                </div>
                <Space>
                  <Tooltip title="Gọi video">
                    <Button type="text" icon={<VideoCameraOutlined />} />
                  </Tooltip>
                  <Tooltip title="Gọi thoại">
                    <Button type="text" icon={<PhoneOutlined />} />
                  </Tooltip>
                  <Tooltip title="Thêm vào yêu thích">
                    <Button type="text" icon={<HeartOutlined />} />
                  </Tooltip>
                  <Tooltip title="Thêm">
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
                    <div className="text-center my-3">
                      <span className="text-xs text-foreground px-[10px] py-[2px] bg-background  rounded-[12px]">
                        {formatDateHeader(date)}
                      </span>
                    </div>
                    {msgs.map((msg, index) => {
                      const prevMsg = index > 0 ? msgs[index - 1] : null;
                      const currentTime = new Date(msg.timestamp);
                      const prevTime = prevMsg
                        ? new Date(prevMsg.timestamp)
                        : null;
                      const showTimestamp =
                        !prevTime ||
                        differenceInMinutes(currentTime, prevTime) >= 5;

                      return (
                        <ChatBubble
                          key={msg.id}
                          msg={msg}
                          currentUserId={currentUser.id}
                          showTimestamp={showTimestamp}
                        />
                      );
                    })}
                  </div>
                ))}
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
                  disabled={!inputValue.trim() || !selectedUserId}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex justify-center items-center text-muted-foreground text-sm">
              Chọn một khách hàng để bắt đầu trò chuyện
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalChatAdmin;
