import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Zap,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Globe,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRoleTab, setSelectedRoleTab] = useState('Admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (roleKey) => {
    setSelectedRoleTab(roleKey);
    setError(null);
    if (roleKey === 'Admin') {
      setUsername('admin');
      setPassword('password123');
    } else if (roleKey === 'Staff') {
      setUsername('marcus');
      setPassword('password123');
    } else if (roleKey === 'Client') {
      setUsername('client_aura');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login(username, password);
      if (user.role === 'client') {
        navigate('/portal');
      } else if (user.role === 'staff') {
        navigate('/tasks');
      } else {
        navigate('/overview');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || 'Invalid username or password. Please check backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08090d',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
      display: 'flex',
      flexDirection: 'column',
      color: '#f3f4f6'
    }}>
      {/* Top Bar */}
      <div style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #141724'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Vanguard</span>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '2px 8px',
            borderRadius: '9999px'
          }}>
            STUDIO v2.4
          </span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '6px' }}>
            Client Project Management System
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem' }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontWeight: 600
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Zero WhatsApp Latency · Escrow v2 Live
          </span>
          <a href="#security" style={{ color: '#9ca3af', textDecoration: 'none' }}>Security & Trust</a>
          <a href="#docs" style={{ color: '#9ca3af', textDecoration: 'none' }}>Documentation</a>
        </div>
      </div>

      {/* Main Login Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          maxWidth: '1080px',
          width: '100%',
          gap: '32px'
        }}>
          {/* Left Feature Card */}
          <div style={{
            backgroundColor: '#12141e',
            border: '1px solid #202436',
            borderRadius: '20px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '24px'
              }}>
                <ShieldCheck size={14} />
                Cryptographic Sign-Off & Escrow
              </div>

              <h1 style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                lineHeight: 1.25,
                color: '#ffffff',
                marginBottom: '16px'
              }}>
                Client Project Management System: Unified workspace for clients, architects, and studio partners.
              </h1>

              <p style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                lineHeight: 1.6,
                marginBottom: '32px'
              }}>
                Eliminate communication fragmentation. Track deliverables through 6 standardized stages, verify live Next.js builds, annotate design tokens, and approve milestones with instant multi-rail settlements.
              </p>

              {/* Feature Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={16} color="#34d399" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f3f4f6' }}>
                      Real-Time Milestone Verification
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#9ca3af' }}>
                      Interactive Gantt schedules, staging URLs, and ISO-9001 audit trails.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <DollarSign size={16} color="#a5b4fc" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f3f4f6' }}>
                      Multi-Rail Invoicing & M-Pesa
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#9ca3af' }}>
                      One-click STK push payments, Stripe corporate cards, and escrow releases.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MessageSquare size={16} color="#c084fc" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f3f4f6' }}>
                      Direct In-App Feedback Loops
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#9ca3af' }}>
                      Contextual comment pins on live builds, Figma token links, and 0-loss specs.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom User Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '24px',
              borderTop: '1px solid #1e2235',
              marginTop: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  ER
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Elena Rostova</div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Managing Partner</div>
                </div>
              </div>

              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={12} color="#10b981" />
                256-Bit TLS
              </div>
            </div>
          </div>

          {/* Right Login Form Card */}
          <div style={{
            backgroundColor: '#12141e',
            border: '1px solid #202436',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
              SELECT YOUR PORTAL ROLE
            </div>

            {/* Role Selector Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '6px',
              backgroundColor: '#0c0d13',
              padding: '4px',
              borderRadius: '10px',
              marginBottom: '28px',
              border: '1px solid #1c2030'
            }}>
              <button
                type="button"
                onClick={() => handleRoleSelect('Admin')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedRoleTab === 'Admin' ? '#1c2032' : 'transparent',
                  color: selectedRoleTab === 'Admin' ? '#fff' : '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>Admin / Partner</div>
                <div style={{ fontSize: '0.625rem', color: selectedRoleTab === 'Admin' ? '#a5b4fc' : '#6b7280', fontWeight: 500 }}>Command Center</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('Staff')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedRoleTab === 'Staff' ? '#1c2032' : 'transparent',
                  color: selectedRoleTab === 'Staff' ? '#fff' : '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>Staff & Leads</div>
                <div style={{ fontSize: '0.625rem', color: selectedRoleTab === 'Staff' ? '#a5b4fc' : '#6b7280', fontWeight: 500 }}>Workstation & Kanban</div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('Client')}
                style={{
                  padding: '8px 4px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedRoleTab === 'Client' ? '#1c2032' : 'transparent',
                  color: selectedRoleTab === 'Client' ? '#fff' : '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div>Enterprise Client</div>
                <div style={{ fontSize: '0.625rem', color: selectedRoleTab === 'Client' ? '#a5b4fc' : '#6b7280', fontWeight: 500 }}>Progress & Sign-off</div>
              </button>
            </div>

            {/* Login Header */}
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              Welcome back, {selectedRoleTab === 'Admin' ? 'Director' : selectedRoleTab === 'Staff' ? 'Lead Architect' : 'Valued Client'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '24px' }}>
              Authenticate into the Vanguard Executive Command Center with your credentials or SSO.
            </p>

            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={18} flexShrink={0} />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                    Username or Handle
                  </label>
                  <span style={{ fontSize: '0.725rem', color: '#6366f1', fontFamily: 'monospace' }}>
                    {username}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#6b7280', fontSize: '0.85rem' }}>@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="v-input"
                    style={{ paddingLeft: '32px' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af' }}>
                    Password
                  </label>
                  <a href="#reset" style={{ fontSize: '0.725rem', color: '#6366f1', textDecoration: 'none' }}>
                    Reset password?
                  </a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '12px', color: '#6b7280' }}>
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="v-input"
                    style={{ paddingLeft: '34px', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Hardware Security Key Badge */}
              <div style={{
                backgroundColor: '#0c0e16',
                border: '1px solid #1c2030',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Key size={16} color="#6366f1" />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f3f4f6' }}>
                      Hardware Security Key / 2FA
                    </div>
                    <div style={{ fontSize: '0.675rem', color: '#6b7280' }}>
                      YubiKey 5C NFC detected on USB-C
                    </div>
                  </div>
                </div>
                <span className="v-badge v-badge-success" style={{ fontSize: '0.65rem' }}>
                  READY
                </span>
              </div>

              {/* Remember session */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', color: '#9ca3af', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#6366f1' }}
                  />
                  Remember session for 30 days
                </label>
                <span style={{ fontSize: '0.7rem', color: '#4b5563', fontFamily: 'monospace' }}>
                  Node: NYC-EAST-01
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="v-btn v-btn-primary"
                style={{ width: '100%', padding: '12px', opacity: isSubmitting ? 0.7 : 1 }}
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Command Center'}</span>
                <ArrowRight size={16} />
              </button>
            </form>


            <div style={{
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e2233' }}></div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.05em' }}>
                OR CONTINUE VIA SSO
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#1e2233' }}></div>
            </div>

            {/* SSO Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={handleSubmit}
                className="v-btn v-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '9px' }}
              >
                <Globe size={14} />
                Google Workspace
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="v-btn v-btn-secondary"
                style={{ fontSize: '0.75rem', padding: '9px' }}
              >
                <Lock size={14} />
                GitHub Enterprise
              </button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: '#6b7280' }}>
              Need client guest access or magic link?{' '}
              <a href="#magic" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                Request Instant Client Token
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
