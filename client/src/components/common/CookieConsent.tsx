import React from 'react';

interface CookieConsentProps {
  children?: React.ReactNode;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ children }) => {
  return (
    <div data-component="CookieConsent" className="stub-component">
      {children}
      <div className="stub-notice">
        Component CookieConsent - Implementation pending
      </div>
    </div>
  );
};

export default CookieConsent;
