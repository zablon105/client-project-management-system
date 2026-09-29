import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle({
  theme: customTheme,
  onChange,
  showLabel = false,
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) {
  let themeState, setThemeState;
  
  try {
    const context = useTheme();
    themeState = customTheme !== undefined ? customTheme : context.theme;
    setThemeState = onChange || context.setTheme;
  } catch (e) {
    // Fallback if used outside ThemeProvider
    themeState = customTheme || 'dark';
    setThemeState = onChange || (() => {});
  }

  const isDark = themeState === 'dark';

  return (
    <div className={`kinetic-theme-toggle-wrapper ${className}`}>
      {showLabel && <span className="kinetic-toggle-label">Mode</span>}
      <div 
        className={`kinetic-segmented-toggle kinetic-toggle-${size}`} 
        role="radiogroup" 
        aria-label="Theme selection mode"
      >
        {/* Animated Sliding Active Indicator Pill */}
        <div 
          className={`kinetic-toggle-indicator ${isDark ? 'is-dark' : 'is-light'}`}
        />

        {/* Light Option Button */}
        <button
          type="button"
          role="radio"
          aria-checked={!isDark}
          onClick={() => setThemeState('light')}
          className={`kinetic-toggle-btn ${!isDark ? 'active' : ''}`}
        >
          <Sun className="kinetic-toggle-icon sun-icon" size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />
          <span>Light</span>
        </button>

        {/* Dark Option Button */}
        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          onClick={() => setThemeState('dark')}
          className={`kinetic-toggle-btn ${isDark ? 'active' : ''}`}
        >
          <Moon className="kinetic-toggle-icon moon-icon" size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15} />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
}
