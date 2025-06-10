import React from 'react';

interface TaskadeWidgetProps {
  children?: React.ReactNode;
}

const TaskadeWidget: React.FC<TaskadeWidgetProps> = ({ children }) => {
  return (
    <div data-component="TaskadeWidget" className="stub-component">
      {children}
      <div className="stub-notice">
        Component TaskadeWidget - Implementation pending
      </div>
    </div>
  );
};

export default TaskadeWidget;
