import React from 'react';

interface ServiceWorkerManagerProps {
  children?: React.ReactNode;
  registerOnMount?: boolean;
  showUpdateNotification?: boolean;
  showOfflineNotification?: boolean;
}

const ServiceWorkerManager: React.FC<ServiceWorkerManagerProps> = ({ children }) => {
  return (
    <div data-component="ServiceWorkerManager" className="stub-component">
      {children}
    </div>
  );
};

export default ServiceWorkerManager;
