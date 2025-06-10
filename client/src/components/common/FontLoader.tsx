import React from 'react';

interface FontLoaderProps {
  children?: React.ReactNode;
  fonts?: Array<{ family: string; display: string; }>;
  display?: string;
  preload?: boolean;
  addBodyClass?: boolean;
}

const FontLoader: React.FC<FontLoaderProps> = ({ children }) => {
  return (
    <div data-component="FontLoader" className="stub-component">
      {children}
    </div>
  );
};

export default FontLoader;
