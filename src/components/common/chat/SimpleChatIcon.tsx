import React from "react";
import { Badge, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";

interface SimpleChatIconProps {
  onClick: () => void;
  unreadCount?: number;
}

const SimpleChatIcon: React.FC<SimpleChatIconProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}>
      <Badge count={unreadCount} offset={[-5, 5]} size="small">
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={onClick}
          style={{
            width: "60px",
            height: "60px",
            fontSize: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </Badge>
    </div>
  );
};

export default SimpleChatIcon;
