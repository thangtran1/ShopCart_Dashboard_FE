import React from "react";
import { Badge, Button, Tooltip } from "antd";
import { CustomerServiceOutlined } from "@ant-design/icons";

interface SimpleChatIconProps {
  onClick: () => void;
  unreadCount?: number;
}

const SimpleChatIcon: React.FC<SimpleChatIconProps> = ({ onClick, unreadCount = 0 }) => {
  return (
    <>
      <style>{`
        @keyframes admin-pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.6), 0 4px 12px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 0 15px rgba(24, 144, 255, 0), 0 4px 12px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0), 0 4px 12px rgba(0,0,0,0.3); }
        }
        @keyframes admin-wiggle {
          0%, 80% { transform: rotate(0deg); }
          82% { transform: rotate(-15deg) scale(1.15); }
          84% { transform: rotate(12deg) scale(1.15); }
          86% { transform: rotate(-12deg) scale(1.15); }
          88% { transform: rotate(8deg) scale(1.15); }
          90% { transform: rotate(-6deg) scale(1.15); }
          92%, 100% { transform: rotate(0deg) scale(1); }
        }
        .admin-chat-btn {
          animation: admin-pulse-glow 2.5s infinite;
          transition: all 0.3s ease;
        }
        .admin-chat-btn:hover {
          transform: scale(1.08) translateY(-4px);
          animation: none;
          box-shadow: 0 12px 24px rgba(24, 144, 255, 0.5) !important;
        }
        .admin-chat-btn .anticon {
          animation: admin-wiggle 4s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}>
        <Tooltip title="Chat trực tiếp với Admin" placement="left">
        <Badge count={unreadCount} offset={[-5, 5]} size="small">
          <Button
            className="admin-chat-btn"
            type="primary"
            shape="circle"
            size="large"
            icon={<CustomerServiceOutlined />}
            onClick={onClick}
            style={{
              width: "60px",
              height: "60px",
              fontSize: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              background: "linear-gradient(135deg, #1890ff, #0050b3)",
              border: "none",
            }}
          />
        </Badge>
      </Tooltip>
    </div>
    </>
  );
};

export default SimpleChatIcon;
