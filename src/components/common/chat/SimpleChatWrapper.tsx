import React, { useState, useMemo, lazy, Suspense } from "react";
import { useUserInfo, useUserToken } from "@/store/userStore";
import SimpleChatIcon from "./SimpleChatIcon";

const ModalChatUser = lazy(() => import("./ModalChatUser"));
const ModalChatAdmin = lazy(() => import("./ModalChatAdmin"));

const SimpleChatWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useUserInfo();
  const token = useUserToken()


  const currentUser = useMemo(() => {
    if (!userInfo?.id || !token.accessToken) return null;

    return {
      id: userInfo.id,
      email: userInfo.email as string,
      username: userInfo.username as string,
      role: userInfo.role as string,
    };
  }, [userInfo?.id, userInfo?.email, userInfo?.username, userInfo?.role]);

  if (!currentUser) return null;

  return (
    <>
      <SimpleChatIcon onClick={() => setIsOpen(true)} />
      {isOpen && (
        <Suspense fallback={<div>Loading chat...</div>}>
          {currentUser.role === "admin" ? (
            <ModalChatAdmin
              open={isOpen}
              onClose={() => setIsOpen(false)}
              currentUser={currentUser}
            />
          ) : (
            <ModalChatUser
              open={isOpen}
              onClose={() => setIsOpen(false)}
              currentUser={currentUser}
            />
          )}
        </Suspense>
      )}
    </>
  );
};

export default SimpleChatWrapper;
