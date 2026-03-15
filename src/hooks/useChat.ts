import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useUserToken } from "@/store/userStore";
import { ChatMessage, Conversation, CurrentUser } from "@/types/entity";

interface UseChatReturn {
  socket: Socket | null;
  messages: ChatMessage[];
  conversations: any[]; 
  isConnected: boolean;
  onlineUsers: string[];
  selectedUserId: string | null;
  sendMessage: (content: string, recipientId?: string) => void;
  selectUser: (userId: string) => void;
}

export const useChat = (currentUser: CurrentUser | null): UseChatReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<
    Record<string, Conversation>
  >({});
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUserIdRef = useRef<string | null>(null);
  const userToken = useUserToken();
  const API_URL = import.meta.env.VITE_API_URL || "";
  const fetchAllUsers = async () => {
    try {
      const token = userToken.accessToken;
      const response = await fetch(`${API_URL}/chat/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllUsers(data.data);
        }
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (!currentUser?.id) {
      return;
    }

    const token = userToken.accessToken;

    const socketUrl = import.meta.env.DEV
      ? window.location.origin
      : import.meta.env.VITE_API_URL;

    const newSocket = io(socketUrl, {
      auth: { token },
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      transports: ["websocket"],
      timeout: 10000,
      forceNew: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("getChatHistory", {});

      if (currentUser?.role === "admin") {
        fetchAllUsers();
      }
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (_error) => {
      setIsConnected(false);
    });

    newSocket.on("newMessage", (message: ChatMessage) => {
      if (currentUser.role === "admin") {
        // Luôn cập nhật sidebar conversations cho admin
        const senderId = message.senderId;
        const isFromSelectedUser = senderId === selectedUserIdRef.current;

        setConversations((prev) => ({
          ...prev,
          [senderId]: {
            userId: senderId,
            userEmail: message.senderId,
            lastMessage: message,
            // Nếu đang xem chat của user này thì không tăng unread
            unreadCount: isFromSelectedUser
              ? (prev[senderId]?.unreadCount || 0)
              : (prev[senderId]?.unreadCount || 0) + 1,
            isOnline: prev[senderId]?.isOnline || false,
          },
        }));

        // Chỉ thêm tin nhắn vào chat window nếu đúng user đang được chọn
        if (isFromSelectedUser) {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.id === message.id || msg.messageId === message.messageId
            );
            if (exists) return prev;
            return [...prev, message];
          });
        }
      } else {
        // User nhận tin nhắn từ admin
        if (message.recipientId === currentUser.id) {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) =>
                msg.id === message.id || msg.messageId === message.messageId
            );
            if (exists) return prev;
            return [...prev, message];
          });
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

      // Update conversations for admin when they send a message
      if (currentUser?.role === "admin" && message.recipientId) {
        setConversations((prev) => ({
          ...prev,
          [message.recipientId]: {
            ...prev[message.recipientId],
            lastMessage: message,
            unreadCount: 0,
          },
        }));
      }
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

        if (currentUser?.role === "admin" && data.userId !== currentUser.id) {
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
  }, [currentUser?.id, userToken.accessToken]);

  const sendMessage = useCallback(
    (content: string, recipientId?: string) => {
      if (!socket || !isConnected) {
        return;
      }

      if (currentUser?.role === "admin" && !recipientId) {
        return;
      }

      socket.emit("sendMessage", { content, recipientId });
    },
    [socket, isConnected, currentUser?.role]
  );

  const selectUser = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);
      selectedUserIdRef.current = userId;

      if (currentUser?.role === "admin") {
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
    [socket, currentUser?.role]
  );

  const getConversations = useMemo(() => {
    if (currentUser?.role !== "admin") {
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
    }

    const userMap = new Map();

    allUsers.forEach((user) => {
      userMap.set(user._id, {
        userId: user._id,
        userEmail: user.email,
        userName: user.name || user.email,
        lastMessage: null,
        unreadCount: 0,
        isOnline: onlineUsers.includes(user._id),
        hasConversation: false,
      });
    });

    Object.values(conversations).forEach((conv) => {
      if (userMap.has(conv.userId)) {
        userMap.set(conv.userId, {
          ...userMap.get(conv.userId),
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount,
          hasConversation: true,
        });
      }
    });

    const result = Array.from(userMap.values()).sort((a, b) => {
      if (a.isOnline !== b.isOnline) {
        return a.isOnline ? -1 : 1;
      }
      if (a.hasConversation !== b.hasConversation) {
        return a.hasConversation ? -1 : 1;
      }
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
        );
      }
      return a.userEmail.localeCompare(b.userEmail);
    });

    return result;
  }, [conversations, allUsers, onlineUsers, currentUser?.role]);

  const conversationsList = getConversations;

  return {
    socket,
    messages,
    conversations: conversationsList,
    isConnected,
    onlineUsers,
    selectedUserId,
    sendMessage,
    selectUser,
  };
};
