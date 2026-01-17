import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Input,
  Button,
  Tooltip,
  Popover,
  Avatar,
  Space,
  Typography,
} from "antd";
import {
  VideoCameraOutlined,
  PhoneOutlined,
  HeartOutlined,
  AudioOutlined,
  PictureOutlined,
  CameraOutlined,
  PlusCircleOutlined,
  SmileOutlined,
  EllipsisOutlined,
  SearchOutlined,
  SendOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useChat } from "@/hooks/useChat";
import { ChatMessage, CurrentUser } from "@/types/entity";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useUserInfo } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/common/EmptyState";

const { Title } = Typography;

interface ManagerChatUserProps { }

const ChatBubble = ({
  msg,
  currentAdminId,
}: {
  msg: ChatMessage;
  currentAdminId: string;
  showTimestamp?: boolean;
}) => {
  const isAdmin = msg.senderId === currentAdminId;
  const timeStr = format(new Date(msg.timestamp), "HH:mm");

  return (
    <div className={`flex mb-3 ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-2xl shadow-sm flex flex-col ${isAdmin
          ? "bg-primary text-white rounded-tr-none"
          : "bg-muted border border-border text-foreground rounded-tl-none"
          }`}
      >
        <div className="text-[14px] leading-relaxed break-words">
          {msg.content}
        </div>

        <div
          className={`text-[10px] mt-1 opacity-70 select-none ${isAdmin ? "text-right text-white" : "text-left text-muted-foreground"
            }`}
        >
          {timeStr}
        </div>
      </div>
    </div>
  );
};

const ManagerChatUser: React.FC<ManagerChatUserProps> = () => {
  const userInfo = useUserInfo();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentUser: CurrentUser = useMemo(
    () => ({
      id: userInfo?.id || "",
      email: userInfo?.email || "",
      username: userInfo?.username || "",
      role: (userInfo?.role as string) || "user",
    }),
    [userInfo]
  );

  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    selectedUserId,
    messages,
    sendMessage,
    selectUser,
    onlineUsers,
  } = useChat(currentUser);

  const isSelectedUserOnline =
    selectedUserId && onlineUsers?.includes(selectedUserId);

  const handleSend = () => {
    if (inputValue.trim() && selectedUserId) {
      sendMessage(inputValue, selectedUserId);
      setInputValue("");
    } else {
      console.log("❌ Cannot send message:", {
        hasContent: !!inputValue.trim(),
        hasSelectedUser: !!selectedUserId,
      });
    }
  };

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

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [groupedMessages]);

  if (!userInfo || userInfo.role !== "admin") {
    return (
      <div className="text-center text-muted-foreground text-sm p-4">
        {t("management.chat.please-login")}
      </div>
    );
  }

  const selectedConversation = (conversations ?? []).find(
    (c) => c.userId === selectedUserId
  );

  const filteredConversations = conversations.filter((convo) =>
    convo.userName.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] text-card-foreground rounded-xl border shadow-sm overflow-hidden bg-background">
      <div className="flex h-full">
        <div
          className={`border-r border-border flex flex-col bg-background transition-all duration-300 ease-in-out ${isCollapsed ? "w-[80px]" : "w-[350px]"
            }`}
        >
          <div className="px-4 py-0 border-b border-border bg-background flex items-center justify-between min-h-[60px]">
            {!isCollapsed && (
              <Title
                level={4}
                style={{ margin: 0, fontSize: '18px' }}
                className="whitespace-nowrap overflow-hidden animate-in fade-in duration-500"
              >
                {t("management.chat.manager-chat-user")}
              </Title>
            )}
            <Button
              type="text"
              icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (!isCollapsed) setSearchValue(""); 
                setIsCollapsed(!isCollapsed);
              }}
              className={`flex-shrink-0 ${isCollapsed ? "mx-auto" : ""}`}
            />
          </div>
          <div className={`p-3 border-b border-border transition-opacity duration-200 ${isCollapsed ? "opacity-0 h-0 p-0 overflow-hidden" : "opacity-100"}`}>
            <Input
              prefix={<SearchOutlined className="text-muted-foreground" />}
              placeholder={t("management.chat.search-user")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="filled"
            />
          </div>

          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((convo) => {
                const isOnline = onlineUsers?.includes(convo.userId);
                const userDisplayName = convo.userName || convo.userEmail;

                return (
                  <Tooltip
                    key={convo.userId}
                    title={isCollapsed ? userDisplayName : ""}
                    placement="right"
                  >
                    <div
                      className={`group cursor-pointer px-4 py-2 rounded-lg mx-2 my-1 transition-all duration-200 flex items-center relative ${selectedUserId === convo.userId
                        ? "bg-primary/10 border-none"
                        : "hover:bg-muted/50"
                        } ${isCollapsed ? "justify-center px-0" : ""}`}
                      onClick={() => selectUser(convo.userId)}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar
                          size={45}
                          className={`transition-transform duration-200 group-hover:scale-105 ${isOnline ? "ring-2 ring-success ring-offset-2" : "bg-gray-400"
                            }`}
                        >
                          {convo.userEmail.charAt(0).toUpperCase()}
                        </Avatar>
                        {isOnline && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-background rounded-full"></span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="ml-3 flex-1 min-w-0 animate-in slide-in-from-left-2 duration-300">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-sm truncate pr-2">
                              {userDisplayName}
                            </div>
                            {convo.unreadCount > 0 && (
                              <div className="bg-error text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold">
                                {convo.unreadCount}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-foreground truncate mt-1 opacity-80">
                            {convo.lastMessage?.content || t("management.chat.no-message")}
                          </div>
                        </div>
                      )}

                      {isCollapsed && selectedUserId === convo.userId && (
                        <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                      )}
                    </div>
                  </Tooltip>
                );
              })
            ) : (
              <div className="p-2">
                <EmptyState height="sm" title={t('chat.empty')} description={t('chat.no-user-found')} />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-background">
          {selectedConversation ? (
            <>
              <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-background shadow-sm z-10">
                <div className="flex gap-3 items-center">
                  <Avatar
                    size={42}
                    className={isSelectedUserOnline ? "bg-success" : "bg-gray-400"}
                  >
                    {selectedConversation.userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <div className="font-bold text-base leading-tight text-foreground">
                      {selectedConversation.userName || selectedConversation.userEmail}
                    </div>
                    <div className={`text-xs flex items-center gap-1.5 mt-1 ${isSelectedUserOnline ? "text-success font-medium" : "text-muted-foreground"
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${isSelectedUserOnline ? "bg-success animate-pulse" : "bg-gray-400"}`}></span>
                      {isSelectedUserOnline ? t("management.chat.online") : t("management.chat.offline")}
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

              <div className="flex-1 p-5 overflow-y-auto flex flex-col bg-muted/20" ref={listRef}>
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center my-6 px-4">
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                      <span className="mx-4 bg-muted p-2 border border-dashed rounded-2xl text-foreground text-[10px] font-bold uppercase tracking-[2px] whitespace-nowrap">
                        {formatDateHeader(date)}
                      </span>
                      <div className="flex-1 border-t border-dashed border-primary/30"></div>
                    </div>
                    {msgs.map((msg) => (
                      <ChatBubble key={msg.id} msg={msg} currentAdminId={currentUser.id} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2">
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
                  <div className="relative flex-1">
                    <Input
                      className="w-full rounded-2xl px-5 py-2.5 bg-muted/50 border-none focus:bg-background transition-all outline-none"
                      placeholder={t("management.chat.enter-message")}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onPressEnter={handleSend}
                    />
                    <Popover
                      content={<EmojiPicker onEmojiClick={(data) => setInputValue(p => p + data.emoji)} theme={Theme.LIGHT} />}
                      trigger="click"
                      placement="topRight"
                    >
                      <SmileOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                    </Popover>
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="shadow-md shadow-primary/20"
                  />
                </div>
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
    </div>
  );
};

export default ManagerChatUser;
