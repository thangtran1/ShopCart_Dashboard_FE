import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useUserToken } from "@/store/userStore";
import { ChatMessage, Conversation, CurrentUser } from "@/types/entity";

interface UseChatDebugReturn {
  socket: Socket | null;
  messages: ChatMessage[];
  conversations: Conversation[];
  isConnected: boolean;
  onlineUsers: string[];
  selectedUserId: string | null;
  sendMessage: (content: string, recipientId?: string) => void;
  selectUser: (userId: string) => void;
  connectionCount: number;
}

export const useChatDebug = (currentUser: CurrentUser): UseChatDebugReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({});
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const userToken = useUserToken();

  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    setConnectionCount((prev) => prev + 1);

    const token = userToken.accessToken;

    const socketUrl = import.meta.env.DEV
      ? window.location.origin
      : import.meta.env.VITE_API_URL;

    const newSocket = io(socketUrl, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("getChatHistory", {});
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (_error) => {
      setIsConnected(false);
    });

    newSocket.on("newMessage", (message: ChatMessage) => {
      let shouldDisplay = false;
      if (currentUser.role === "admin") {
        shouldDisplay = message.senderId !== currentUser.id;
      } else {
        shouldDisplay =
          message.senderId !== currentUser.id &&
          message.recipientId === currentUser.id;
      }

      if (shouldDisplay) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.id === message.id ||
              (message.messageId && msg.messageId === message.messageId)
          );
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });

        if (currentUser.role === "admin") {
          const senderId = message.senderId;
          setConversations((prev) => ({
            ...prev,
            [senderId]: {
              userId: senderId,
              userEmail: message.senderId,
              lastMessage: message,
              unreadCount: (prev[senderId]?.unreadCount || 0) + 1,
              isOnline: prev[senderId]?.isOnline || false,
            },
          }));
        }
      }
    });

    newSocket.on("messageSent", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg.id === message.id ||
            (message.messageId && msg.messageId === message.messageId)
        );
        if (exists) {
          return prev;
        }
        return [...prev, message];
      });
    });

    newSocket.on("chatHistory", (data: { messages: ChatMessage[] }) => {
      setMessages(data.messages);
    });

    newSocket.on("initialOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    newSocket.on(
      "userStatusChanged",
      (data: { userId: string; isOnline: boolean; userEmail?: string }) => {
        setOnlineUsers((prev) => {
          if (data.isOnline) {
            return [...prev.filter((id) => id !== data.userId), data.userId];
          } else {
            return prev.filter((id) => id !== data.userId);
          }
        });

        if (currentUser.role === "admin" && data.userId !== currentUser.id) {
          setConversations((prev) => ({
            ...prev,
            [data.userId]: {
              ...prev[data.userId],
              userId: data.userId,
              userEmail:
                data.userEmail || prev[data.userId]?.userEmail || data.userId,
              isOnline: data.isOnline,
              unreadCount: prev[data.userId]?.unreadCount || 0,
            },
          }));
        }
      }
    );

    newSocket.on("error", (_error: { message: string }) => {});

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.id, userToken.accessToken]);

  const sendMessage = useCallback(
    (content: string, recipientId?: string) => {
      if (!socket || !isConnected) {
        return;
      }

      if (currentUser.role === "admin" && !recipientId) {
        return;
      }

      socket.emit("sendMessage", { content, recipientId });
    },
    [socket, isConnected, currentUser.role]
  );

  const selectUser = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);

      if (currentUser.role === "admin") {
        setConversations((prev) => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            unreadCount: 0,
          },
        }));
      }

      if (socket) {
        socket.emit("getChatHistory", { userId });
      }
    },
    [socket, currentUser.role]
  );

  const getConversations = useCallback(() => {
    return Object.values(conversations).sort((a, b) => {
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      }
      return 0;
    });
  }, [conversations]);

  return {
    socket,
    messages,
    conversations: getConversations(),
    isConnected,
    onlineUsers,
    selectedUserId,
    sendMessage,
    selectUser,
    connectionCount,
  };
};
