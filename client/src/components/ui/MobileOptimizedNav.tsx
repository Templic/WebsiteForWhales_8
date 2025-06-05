/**
 * Mobile-Optimized Navigation Component
 * Cross-browser compatible navigation with touch optimization
 */

import React, { useState, useEffect, useRef } from 'react';
import { useBrowserOptimization } from '../../hooks/useBrowserOptimization';
import { Link, useLocation } from 'wouter';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileOptimizedNavProps {
  items: NavItem[];
  className?: string;
}

export const MobileOptimizedNav: React.FC<MobileOptimizedNavProps> = ({
  items,
  className = ''
}) => {
  const {
    isMobile,
    isTouch,
    browserName,
    shouldEnableFeature,
    config
  } = useBrowserOptimization();

  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('');
  const [location] = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Update active item based on current location
  useEffect(() => {
    setActiveItem(location);
  }, [location]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Browser-specific menu animation classes
  const getAnimationClasses = () => {
    if (!shouldEnableFeature('advanced-animations')) {
      return 'transition-transform duration-200';
    }

    switch (browserName) {
      case 'safari':
        return 'transition-transform duration-300 ease-out';
      case 'firefox':
        return 'transition-transform duration-250 ease-in-out';
      default:
        return 'transition-all duration-300 ease-out';
    }
  };

  // Touch-optimized button styling
  const getTouchButtonClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-lg font-medium transition-colors';
    
    if (isTouch) {
      return `${baseClasses} min-h-[44px] min-w-[44px] px-4 py-3 text-base`;
    }
    
    return `${baseClasses} px-3 py-2 text-sm`;
  };

  return (
    <nav 
      ref={navRef}
      className={`relative ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className={`
            ${getTouchButtonClasses()}
            bg-white/10 hover:bg-white/20 text-white
            backdrop-blur-sm border border-white/20
            ${browserName === 'safari' ? 'shadow-sm' : 'shadow-md'}
          `}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {/* Desktop Navigation */}
      {!isMobile && (
        <div className="flex space-x-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                ${getTouchButtonClasses()}
                ${activeItem === item.href
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
                }
                backdrop-blur-sm border border-white/20
              `}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <div
          id="mobile-menu"
          className={`
            absolute top-full left-0 right-0 mt-2 z-50
            bg-white/95 backdrop-blur-md border border-white/20 rounded-lg
            ${browserName === 'safari' ? 'shadow-lg' : 'shadow-xl'}
            ${getAnimationClasses()}
            ${isOpen 
              ? 'transform translate-y-0 opacity-100' 
              : 'transform -translate-y-2 opacity-0 pointer-events-none'
            }
          `}
          role="menu"
          aria-hidden={!isOpen}
        >
          <div className="py-2">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`
                  flex items-center w-full px-4 py-3 text-left
                  ${activeItem === item.href
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  transition-colors duration-150
                  ${isTouch ? 'min-h-[44px]' : 'min-h-[36px]'}
                `}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
              >
                {item.icon && (
                  <span className="mr-3 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Overlay for mobile menu */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};