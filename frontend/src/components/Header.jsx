import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Header({ onOpenNewProject, onToggleSidebar }) {
  const { user, activeRole, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (!user) return 'U';
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest User';
    if (user.first_name || user.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    }
    return user.username;
  };

  return (
    <header style={{
      minHeight: '64px',
      backgroundColor: 'var(--bg-dark)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      {/* Left Title / Mobile Toggle / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleSidebar}
          className="v-mobile-only"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-card)'
          }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>Vanguard</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }} className="v-desktop-only">
            Client Portal & Hub
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Theme Toggle Button */}
        <ThemeToggle size="sm" />

        {/* Global Search Bar (Desktop) */}
        <div className="v-desktop-only" style={{
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '6px 12px',
          width: '200px'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search projects..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              width: '100%'
            }}
          />
        </div>

        {/* Mobile Search Toggle Icon */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="v-mobile-only"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '7px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Search size={16} />
        </button>

        {/* New Project Button */}
        <button
          onClick={onOpenNewProject}
          className="v-btn v-btn-primary v-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>

        {/* Role Badge */}
        <div className="v-desktop-only" style={{
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '6px 10px',
          fontSize: '0.725rem',
          fontWeight: 700,
          color: 'var(--accent-purple)'
        }}>
          <span>ROLE: {activeRole}</span>
        </div>

        {/* Bell Icon */}
        <div
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={16} color="var(--text-secondary)" />
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingLeft: '6px',
              borderLeft: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              color: '#ffffff'
            }}>
              {getInitials()}
            </div>
            <div className="v-desktop-only" style={{ flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {getUserDisplayName()}
              </span>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>
                {user?.email || activeRole}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              minWidth: '170px',
              zIndex: 30
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{getUserDisplayName()}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role: {activeRole}</div>
              </div>
              <div
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)'
                }}
              >
                Profile & Settings
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: '10px 14px',
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {showMobileSearch && (
        <div className="v-mobile-only" style={{
          width: '100%',
          padding: '8px 0',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            width: '100%'
          }}>
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search projects, tasks, invoices..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                width: '100%'
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
