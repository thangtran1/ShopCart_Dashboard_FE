import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useUserInfo, useUserToken } from "@/store/userStore";
import SimpleChatIcon from "./SimpleChatIcon";

const ModalChatUser = lazy(() => import("./ModalChatUser"));
const ModalChatAdmin = lazy(() => import("./ModalChatAdmin"));

const SimpleChatWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userInfo = useUserInfo();
  const token = useUserToken();

  const currentUser = useMemo(() => {
    if (!userInfo?.id || !token.accessToken) return null;
    return {
      id: userInfo.id,
      email: userInfo.email as string,
      username: userInfo.username as string,
      role: userInfo.role as string,
    };
  }, [userInfo?.id, userInfo?.email, userInfo?.username, userInfo?.role]);

  const handleUnreadCountChange = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!currentUser) return null;

  return (
    <>
      <SimpleChatIcon
        onClick={handleOpen}
        unreadCount={unreadCount}
      />
      
      {/* Luôn render để duy trì kết nối Socket ngầm */}
      <Suspense fallback={null}>
        {currentUser.role === "admin" ? (
          <ModalChatAdmin
            open={isOpen}
            onClose={handleClose}
            currentUser={currentUser}
            onUnreadCountChange={handleUnreadCountChange}
          />
        ) : (
          <ModalChatUser
            open={isOpen}
            onClose={handleClose}
            currentUser={currentUser}
            onUnreadCountChange={handleUnreadCountChange}
          />
        )}
      </Suspense>
    </>
  );
};

export default SimpleChatWrapper;