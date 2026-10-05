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
  AlertCircle,
  UserPlus,
  LogIn,
  Building,
  User,
  Mail,
  Phone,
  Sparkles,
  X,
  Check
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Universal Sign In State (No role switching required)
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpRole, setSignUpRole] = useState('client');
  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpTitle, setSignUpTitle] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Feedback & UI State
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMagicModal, setShowMagicModal] = useState(false);
  const [magicEmail, setMagicEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  // Quick Demo Preset Helper (Fills fields without forcing role tab lock)
  const handleFillDemo = (username, password) => {
    setSignInUsername(username);
    setSignInPassword(password);
    setError(null);
  };

  // Universal Sign In Handler: Authenticates & auto-directs based on user.role
  const handleUniversalSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      const user = await login(signInUsername, signInPassword);
      setSuccessMsg(`Authenticated as ${user.first_name || user.username}! Directing to your dashboard...`);

      setTimeout(() => {
        if (user.role === 'client') {
          navigate('/portal');
        } else if (user.role === 'staff') {
          navigate('/tasks');
        } else {
          navigate('/overview');
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || 'Invalid credentials. Please verify your username and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sign Up Handler
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match. Please re-enter matching passwords.');
      return;
    }

    if (signUpPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreedTerms) {
      setError('Please agree to the Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        username: signUpUsername || signUpEmail.split('@')[0],
        password: signUpPassword,
        email: signUpEmail,
        first_name: signUpFirstName,
        last_name: signUpLastName,
        role: signUpRole,
        phone: signUpPhone,
        company_name: signUpRole === 'client' ? signUpCompany : '',
        title: signUpRole === 'staff' ? signUpTitle : ''
      };

      const user = await register(payload);
      if (!user.is_active) {
        setSuccessMsg('Your staff/admin account request is pending administrator approval. You can sign in after it is activated.');
        return;
      }
      setSuccessMsg('Account created successfully! Directing to your workspace...');
      setTimeout(() => {
        if (user?.role === 'client') {
          navigate('/portal');
        } else if (user?.role === 'staff') {
          navigate('/tasks');
        } else {
          navigate('/overview');
        }
      }, 800);
    } catch (err) {
      console.error("Registration error:", err);
      const dataErr = err.response?.data;
      if (dataErr && typeof dataErr === 'object') {
        const firstKey = Object.keys(dataErr)[0];
        const msg = Array.isArray(dataErr[firstKey]) ? dataErr[firstKey][0] : dataErr[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError('Failed to create account. Username or email may already exist.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Magic Link Request Handler
  const handleMagicSubmit = (e) => {
    e.preventDefault();
    if (!magicEmail) return;
    setMagicSent(true);
    setTimeout(() => {
      setMagicSent(false);
      setShowMagicModal(false);
      setMagicEmail('');
      setSuccessMsg(`Instant guest token sent to ${magicEmail}! Check your email.`);
    }, 1200);
  };

  // Password Strength Meter
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#94a3b8', percent: 0 };
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pass)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444', percent: 25 };
    if (score <= 50) return { score, label: 'Fair', color: '#f59e0b', percent: 50 };
    if (score <= 75) return { score, label: 'Strong', color: '#10b981', percent: 75 };
    return { score, label: 'Bulletproof', color: '#7c3aed', percent: 100 };
  };

  const passStrength = getPasswordStrength(signUpPassword);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
      display: 'flex',
      flexDirection: 'column',
      color: '#0f172a'
    }}>
      {/* Light Mode Executive Header Bar */}
      <div style={{
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <Zap size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Vanguard</span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#4f46e5',
                backgroundColor: '#eeeefd',
                border: '1px solid #c7d2fe',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                STUDIO v2.4
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }} className="v-desktop-only">
              Client Project Management System
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#047857',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.725rem'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }}></span>
            Universal Auth Engine Live
          </span>
          <button
            onClick={() => setShowMagicModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} />
            <span>Magic Guest Token</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
          maxWidth: '1080px',
          width: '100%',
          gap: '32px'
        }} className="v-grid-auto">

          {/* Left Hero Feature Showcase Card (Light Executive White Theme) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-80px',
              left: '-80px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: '#eef2ff',
                border: '1px solid #c7d2fe',
                color: '#4338ca',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '20px'
              }}>
                <ShieldCheck size={14} />
                Universal Multi-Role Single Sign-On
              </div>

              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                lineHeight: 1.25,
                color: '#0f172a',
                marginBottom: '14px'
              }}>
                Unified Client Project Management System
              </h1>

              <p style={{
                fontSize: '0.875rem',
                color: '#475569',
                lineHeight: 1.6,
                marginBottom: '28px'
              }}>
                Simply enter your credentials below. The universal engine automatically authenticates your account role and routes you directly to your personalized workspace.
              </p>

              {/* Feature Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <CheckCircle2 size={16} color="#059669" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      Automated Dashboard Routing
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      Clients navigate to Client Portal, Staff to Task Kanban, and Directors to Overview.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <DollarSign size={16} color="#4f46e5" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      Multi-Rail Invoicing & M-Pesa
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      Instant STK push settlements, corporate cards, and transparent escrow releases.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#f5f3ff',
                    border: '1px solid #ddd6fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <MessageSquare size={16} color="#7c3aed" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                      Direct Feedback & Deliverable Audits
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      Contextual pinned comments on live builds and zero-friction client sign-offs.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Director Profile */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  ER
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Elena Rostova</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Managing Director & Founder</div>
                </div>
              </div>

              <div style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Lock size={12} color="#059669" />
                256-Bit TLS Secured
              </div>
            </div>
          </div>

          {/* Right White Card (Universal Login & Sign Up) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '36px 32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Auth Mode Toggle Tabs (Sign In vs Create Account) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              padding: '5px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: authMode === 'signin' ? '#ffffff' : 'transparent',
                  color: authMode === 'signin' ? '#0f172a' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: authMode === 'signin' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <LogIn size={16} color={authMode === 'signin' ? '#4f46e5' : '#64748b'} />
                <span>Universal Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: authMode === 'signup' ? '#ffffff' : 'transparent',
                  color: authMode === 'signup' ? '#0f172a' : '#64748b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                <UserPlus size={16} color={authMode === 'signup' ? '#059669' : '#64748b'} />
                <span>Create Account</span>
              </button>
            </div>

            {/* Success Alert Banner */}
            {successMsg && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                color: '#047857',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} flexShrink={0} />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Error Alert Banner */}
            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={18} flexShrink={0} />
                <div>{error}</div>
              </div>
            )}

            {/* UNIVERSAL SIGN IN FORM */}
            {authMode === 'signin' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '24px' }}>
                  Enter your credentials. You will be automatically routed to your assigned workspace.
                </p>

                <form onSubmit={handleUniversalSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                      Username or Handle
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8', fontSize: '0.85rem' }}>@</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. admin, marcus, or client_aura"
                        value={signInUsername}
                        onChange={(e) => setSignInUsername(e.target.value)}
                        className="v-input"
                        style={{ paddingLeft: '32px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                        Password
                      </label>
                      <a
                        href="#reset"
                        onClick={(e) => { e.preventDefault(); setError('Contact system admin or request an instant guest token.'); }}
                        style={{ fontSize: '0.725rem', color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Reset password?
                      </a>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }}>
                        <Lock size={14} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
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
                          color: '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Quick Demo Credentials Autofill Pills */}
                  <div>
                    <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                      QUICK DEMO SHORTCUTS
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleFillDemo('admin', 'password123')}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillDemo('marcus', 'password123')}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Staff
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFillDemo('client_aura', 'password123')}
                        style={{
                          padding: '6px 4px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        Client
                      </button>
                    </div>
                  </div>

                  {/* Hardware Key Indicator */}
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Key size={16} color="#4f46e5" />
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                          Hardware Security Key / 2FA
                        </div>
                        <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                          YubiKey 5C NFC detected
                        </div>
                      </div>
                    </div>
                    <span className="v-badge v-badge-success" style={{ fontSize: '0.65rem' }}>
                      READY
                    </span>
                  </div>

                  {/* Remember session */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', color: '#475569', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#4f46e5' }}
                      />
                      Remember session for 30 days
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="v-btn v-btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.9rem',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div style={{
                  margin: '20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
                    OR CONTINUE VIA SSO
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                </div>

                {/* SSO Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleUniversalSignIn}
                    className="v-btn v-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '9px' }}
                  >
                    <Globe size={14} />
                    Google Workspace
                  </button>
                  <button
                    type="button"
                    onClick={handleUniversalSignIn}
                    className="v-btn v-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '9px' }}
                  >
                    <Lock size={14} />
                    GitHub Enterprise
                  </button>
                </div>
              </div>
            )}

            {/* SIGN UP FORM (Light White Mode) */}
            {authMode === 'signup' && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Create Your Account
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
                  Client accounts are active immediately. Staff and admin accounts require administrator approval.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    Select Account Role
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { role: 'client', label: 'Client Account', Icon: Building, color: '#4f46e5', background: '#eef2ff' },
                      { role: 'staff', label: 'Staff / Lead', Icon: User, color: '#059669', background: '#ecfdf5' },
                      { role: 'admin', label: 'Agency Admin', Icon: ShieldCheck, color: '#7c3aed', background: '#f5f3ff' }
                    ].map(({ role, label, Icon, color, background }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSignUpRole(role)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '8px',
                          border: signUpRole === role ? `1px solid ${color}` : '1px solid #e2e8f0',
                          backgroundColor: signUpRole === role ? background : '#f8fafc',
                          color: signUpRole === role ? color : '#475569',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Icon size={16} color={signUpRole === role ? color : '#64748b'} />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Name Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={signUpFirstName}
                        onChange={(e) => setSignUpFirstName(e.target.value)}
                        className="v-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        className="v-input"
                      />
                    </div>
                  </div>

                  {/* Username & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Username
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8', fontSize: '0.8rem' }}>@</span>
                        <input
                          type="text"
                          required
                          placeholder="johndoe"
                          value={signUpUsername}
                          onChange={(e) => setSignUpUsername(e.target.value)}
                          className="v-input"
                          style={{ paddingLeft: '28px' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Work Email
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>
                          <Mail size={14} />
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="john@company.com"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          className="v-input"
                          style={{ paddingLeft: '32px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {signUpRole === 'client' ? (
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Company / Organization Name
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>
                          <Building size={14} />
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Apex Global Corp"
                          value={signUpCompany}
                          onChange={(e) => setSignUpCompany(e.target.value)}
                          className="v-input"
                          style={{ paddingLeft: '32px' }}
                        />
                      </div>
                    </div>
                  ) : signUpRole === 'staff' ? (
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Professional Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Frontend Architect"
                        value={signUpTitle}
                        onChange={(e) => setSignUpTitle(e.target.value)}
                        className="v-input"
                      />
                    </div>
                  ) : null}

                  {/* Phone Field */}
                  <div>
                    <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Phone Number (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}>
                        <Phone size={14} />
                      </span>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        className="v-input"
                        style={{ paddingLeft: '32px' }}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="v-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.725rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        className="v-input"
                      />
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {signUpPassword && (
                    <div style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>Password Strength</span>
                        <span style={{ fontWeight: 700, color: passStrength.color }}>{passStrength.label}</span>
                      </div>
                      <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${passStrength.percent}%`,
                          backgroundColor: passStrength.color,
                          transition: 'all 0.3s ease'
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.75rem', color: '#475569', cursor: 'pointer', marginTop: '4px' }}>
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#059669' }}
                    />
                    <span>
                      I agree to the Vanguard Service Level Agreement and Privacy Policy.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="v-btn v-btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                  >
                    <span>{isSubmitting ? 'Registering Account...' : 'Complete Sign Up'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Magic Link Guest Modal (Light Mode) */}
      {showMagicModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMagicModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#eef2ff',
              border: '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Sparkles size={20} color="#4f46e5" />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Request Instant Guest Token
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '18px' }}>
              Enter your corporate email address to receive a zero-password access link.
            </p>

            {magicSent ? (
              <div style={{
                padding: '20px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Check size={28} color="#059669" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#047857' }}>
                  Magic Link Dispatched!
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Check your email inbox for one-click access.
                </div>
              </div>
            ) : (
              <form onSubmit={handleMagicSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@enterprise.com"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    className="v-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowMagicModal(false)}
                    className="v-btn v-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="v-btn v-btn-primary">
                    Dispatch Magic Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
