import React from 'react';

interface ChatWidgetProps {
  children?: React.ReactNode;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ children }) => {
  return (
    <div data-component="ChatWidget" className="stub-component">
      {children}
      <div className="stub-notice">
        Component ChatWidget - Implementation pending
      </div>
    </div>
  );
};

export default ChatWidget;
