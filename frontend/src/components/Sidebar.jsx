import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Columns,
  Globe,
  Receipt,
  FileBarChart,
  Bell,
  Settings,
  Users,
  Zap,
  X
} from 'lucide-react';

export default function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const coreModules = [
    { name: 'Overview', path: '/overview', icon: LayoutDashboard },
    { name: 'Projects & Milestones', path: '/projects', icon: FolderKanban },
    { name: 'Services Management', path: '/services', icon: Briefcase },
    { name: 'Staff & Task Board', path: '/tasks', icon: Columns },
    { name: 'Client Portal', path: '/portal', icon: Globe },
    { name: 'Invoices & Billing', path: '/invoices', icon: Receipt },
    { name: 'Reports & Deliverables', path: '/reports', icon: FileBarChart },
  ];

  const systemModules = [
    { name: 'Notifications Center', path: '/notifications', icon: Bell, badge: '14' },
    { name: 'User Profile & Settings', path: '/settings', icon: Settings },
    { name: 'Client & Staff Management', path: '/talent', icon: Users },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 992) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
          className="v-mobile-only"
        />
      )}

      <aside
        style={{
          width: '260px',
          minWidth: '260px',
          backgroundColor: 'var(--bg-dark)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: '20px 14px',
          zIndex: 999,
          transition: 'transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease'
        }}
        className={`sidebar-container ${mobileOpen ? 'mobile-expanded' : ''}`}
      >
        {/* Mobile Header Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingLeft: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)'
            }}>
              <Zap size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Vanguard
              </div>
              <div style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AGENCY WORKSPACE
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="v-mobile-only"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Group: CORE MODULES */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '8px' }}>
            CORE MODULES
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {coreModules.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Navigation Group: SYSTEM */}
        <div style={{ marginBottom: 'auto' }}>
          <div style={{ fontSize: '0.675rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '8px' }}>
            SYSTEM
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {systemModules.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                    borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.675rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '9999px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Status */}
        <div style={{
          marginTop: '24px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>All Systems Live</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>v2.4.0</span>
        </div>
      </aside>

      <style>{`
        @media (max-width: 991px) {
          .sidebar-container {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
          }
          .sidebar-container.mobile-expanded {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
