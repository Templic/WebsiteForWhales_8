import React from 'react';

interface StylesProviderProps {
  children?: React.ReactNode;
  extractCritical?: boolean;
  optimizeSheets?: boolean;
  injectIntoHead?: boolean;
  deduplicate?: boolean;
  delayNonCritical?: number;
}

const StylesProvider: React.FC<StylesProviderProps> = ({ children }) => {
  return (
    <div data-component="StylesProvider" className="stub-component">
      {children}
    </div>
  );
};

export default StylesProvider;
