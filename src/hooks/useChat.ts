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
  userUnreadCount: number;
  sendMessage: (content: string, recipientId?: string) => void;
  selectUser: (userId: string) => void;
  setIsReading: (reading: boolean) => void;
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
  const [userUnreadCount, setUserUnreadCount] = useState(0);
  const isReadingRef = useRef(false);
  const selectedUserIdRef = useRef<string | null>(null);
  // Cache tin nhắn theo userId cho admin - chuyển hội thoại tức thì
  const messageCacheRef = useRef<Record<string, ChatMessage[]>>({});
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
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
      timeout: 5000,
      // Bỏ forceNew: true → tái sử dụng connection hiệu quả hơn
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
              ? prev[senderId]?.unreadCount || 0
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
          // Chỉ tăng unread khi user KHÔNG đang mở modal chat
          if (!isReadingRef.current) {
            setUserUnreadCount((prev) => prev + 1);
          }
        }
      }
    });

    newSocket.on("messageSent", (message: ChatMessage) => {
      // Reconcile: thay thế optimistic message bằng server message (cùng messageId)
      setMessages((prev) => {
        const optimisticIndex = prev.findIndex(
          (msg) => msg.messageId && msg.messageId === message.messageId
        );
        if (optimisticIndex !== -1) {
          // Đã có optimistic message → thay thế
          const updated = [...prev];
          updated[optimisticIndex] = message;
          return updated;
        }
        // Check duplicate
        const exists = prev.some(
          (msg) =>
            msg.id === message.id ||
            (message.messageId && msg.messageId === message.messageId)
        );
        if (exists) return prev;
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

    newSocket.on("chatHistory", (data: { messages: ChatMessage[]; targetUserId?: string }) => {
      setMessages(data.messages);
      // Cập nhật cache cho admin
      if (data.targetUserId && currentUser?.role === "admin") {
        messageCacheRef.current[data.targetUserId] = data.messages;
      }
      // Reset unread count cho user khi load history (= đã đọc)
      if (currentUser?.role !== "admin") {
        setUserUnreadCount(0);
      }
    });

    // Nhận unread count từ DB khi user kết nối
    newSocket.on("userUnreadCount", (data: { unreadCount: number }) => {
      setUserUnreadCount(data.unreadCount);
    });

    newSocket.on("initialOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    // Hydrate conversations từ DB khi admin kết nối (bao gồm unread count đã persist)
    newSocket.on("initialConversations", (serverConversations: any[]) => {
      if (currentUser?.role === "admin" && serverConversations?.length > 0) {
        const convMap: Record<string, Conversation> = {};
        serverConversations.forEach((conv: any) => {
          const userInfo = conv.userInfo;
          if (userInfo) {
            convMap[userInfo._id] = {
              userId: userInfo._id,
              userEmail: userInfo.email,
              userName: userInfo.name || userInfo.email,
              lastMessage: conv.lastMessage || null,
              unreadCount: conv.unreadCount || 0,
              isOnline: false, // sẽ được cập nhật bởi initialOnlineUsers
            };
          }
        });
        setConversations(convMap);
      }
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

  // 🚀 Optimistic UI: hiển thị tin nhắn ngay lập tức, không chờ server
  const sendMessage = useCallback(
    (content: string, recipientId?: string) => {
      if (!socket || !isConnected) {
        return;
      }

      if (currentUser?.role === "admin" && !recipientId) {
        return;
      }

      // Tạo optimistic message ID trùng với format BE
      const tempId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Tạo optimistic message hiển thị ngay
      const optimisticMessage: ChatMessage = {
        id: tempId,
        senderId: currentUser?.id || "",
        recipientId: recipientId || "",
        content,
        timestamp: new Date().toISOString(),
        senderRole: currentUser?.role || "user",
        messageId: tempId,
      };

      // Hiển thị ngay trên UI
      setMessages((prev) => [...prev, optimisticMessage]);

      // Cập nhật sidebar cho admin
      if (currentUser?.role === "admin" && recipientId) {
        setConversations((prev) => ({
          ...prev,
          [recipientId]: {
            ...prev[recipientId],
            lastMessage: optimisticMessage,
            unreadCount: 0,
          },
        }));
      }

      // Gửi lên server kèm tempId để reconcile
      socket.emit("sendMessage", { content, recipientId, tempId });
    },
    [socket, isConnected, currentUser?.role, currentUser?.id]
  );

  const selectUser = useCallback(
    (userId: string) => {
      // Lưu tin nhắn hiện tại vào cache trước khi chuyển
      if (selectedUserIdRef.current) {
        messageCacheRef.current[selectedUserIdRef.current] = messages;
      }

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

      // Hiển thị cached messages ngay lập tức (nếu có)
      const cached = messageCacheRef.current[userId];
      if (cached && cached.length > 0) {
        setMessages(cached);
      } else {
        setMessages([]);
      }

      // Fetch fresh từ server (background)
      if (socket) {
        socket.emit("getChatHistory", { userId });
      }
    },
    [socket, currentUser?.role, messages]
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

  // Hàm để ModalChatUser báo trạng thái đang đọc
  const setIsReading = useCallback((reading: boolean) => {
    isReadingRef.current = reading;
    if (reading) {
      // Reset ngay lập tức, không chờ server
      setUserUnreadCount(0);
    }
  }, []);

  return {
    socket,
    messages,
    conversations: conversationsList,
    isConnected,
    onlineUsers,
    selectedUserId,
    userUnreadCount,
    sendMessage,
    selectUser,
    setIsReading,
  };
};
