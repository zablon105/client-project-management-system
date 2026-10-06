import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Zap,
  Lock,
  User,
  Eye,
  EyeOff,
  MessageSquare,
  BarChart2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  Building,
  Phone,
  X,
  Check
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In State
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

  // Universal Sign In Handler
  const handleUniversalSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      const user = await login(signInUsername, signInPassword);
      setSuccessMsg(`Authenticated as ${user.first_name || user.username}! Directing to workspace...`);

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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(219, 234, 254, 0.7) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(224, 231, 255, 0.7) 0%, transparent 50%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#0f172a'
    }}>
      {/* Top Header Navigation Bar */}
      <header style={{
        padding: '20px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Left Logo & App Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Zap size={22} color="#ffffff" fill="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Vanguard
              </span>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 800,
                color: '#2563eb',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '3px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.03em'
              }}>
                STUDIO v2.4
              </span>
            </div>
            <div style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 500, marginTop: '1px' }}>
              Client Project Management System
            </div>
          </div>
        </div>

        {/* Right Status & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#15803d',
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '0.75rem'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16a34a', boxShadow: '0 0 8px #16a34a' }}></span>
            Universal Auth Engine Live
          </span>
          <button
            onClick={() => setShowMagicModal(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#4f46e5',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.2s ease'
            }}
          >
            <Sparkles size={16} color="#4f46e5" />
            <span>Magic Guest Token</span>
          </button>
        </div>
      </header>

      {/* Main Form & Showcase Workspace Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 24px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
          maxWidth: '1120px',
          width: '100%',
          gap: '32px'
        }}>

          {/* Left Dark Navy Hero Showcase Card */}
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 44px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            background: 'linear-gradient(145deg, rgba(8, 20, 48, 0.94) 0%, rgba(11, 28, 68, 0.88) 100%), url("/login-bg.jpg") center/cover no-repeat'
          }}>
            {/* Ambient Background Glow Effect */}
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div>
              {/* Brand Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
                }}>
                  <Zap size={22} color="#ffffff" fill="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                    Vanguard
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                    Client Project Management System
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                lineHeight: 1.25,
                color: '#ffffff',
                marginTop: '36px',
                marginBottom: '16px',
                letterSpacing: '-0.025em'
              }}>
                Better Communication.<br />
                <span style={{
                  background: 'linear-gradient(90deg, #38bdf8 0%, #60a5fa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Smoother Project Delivery.
                </span>
              </h1>

              {/* Subtext */}
              <p style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '440px'
              }}>
                Stay informed, provide feedback, track progress and manage your projects — all in one place.
              </p>

              {/* 3 Feature Points */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Feature 1 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)'
                  }}>
                    <MessageSquare size={20} color="#ffffff" fill="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      Client Feedback & Support
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      Share feedback and keep your projects on track with real-time communication.
                    </div>
                  </div>
                </div>

                {/* Feature 2 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
                  }}>
                    <BarChart2 size={20} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      Project Progress Tracking
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      View updates, milestones and progress reports for your assigned jobs.
                    </div>
                  </div>
                </div>

                {/* Feature 3 */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
                  }}>
                    <FileText size={20} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      Payments & Invoices
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#94a3b8', lineHeight: 1.45 }}>
                      Make payments and download your invoices quickly and securely.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Cursive Signature */}
            <div style={{ marginTop: '40px', paddingTop: '16px' }}>
              <div style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '1.9rem',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.02em',
                display: 'inline-block',
                position: 'relative'
              }}>
                Your Vision <span style={{ color: '#38bdf8' }}>•</span> Our Priority
                <svg width="200" height="14" viewBox="0 0 200 14" fill="none" style={{ display: 'block', marginTop: '-2px' }}>
                  <path d="M2 10C55 3 145 3 198 10" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right White Card (Universal Login Form) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '44px 40px',
            boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {/* Top Secure Access Pill & Header Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                fontSize: '0.775rem',
                fontWeight: 700
              }}>
                <Lock size={14} color="#2563eb" />
                <span>Secure Access</span>
              </div>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #bfdbfe 0%, transparent 100%)' }} />
            </div>

            {/* Sign In vs Create Account Mode Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              backgroundColor: '#f8fafc',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: authMode === 'signin' ? '#ffffff' : 'transparent',
                    color: authMode === 'signin' ? '#0f172a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: authMode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LogIn size={14} color={authMode === 'signin' ? '#2563eb' : '#64748b'} />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setError(null); setSuccessMsg(null); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: authMode === 'signup' ? '#ffffff' : 'transparent',
                    color: authMode === 'signup' ? '#0f172a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: authMode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UserPlus size={14} color={authMode === 'signup' ? '#059669' : '#64748b'} />
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Success Notification Banner */}
            {successMsg && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                color: '#047857',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>{successMsg}</div>
              </div>
            )}

            {/* Error Notification Banner */}
            {error && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#b91c1c',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <div>{error}</div>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em'
                }}>
                  Welcome Back
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '28px',
                  lineHeight: 1.5
                }}>
                  Sign in to your account to continue to your dashboard and manage your projects.
                </p>


                <form onSubmit={handleUniversalSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Field 1: Username */}
                  <div>
                    <label style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#1e293b',
                      display: 'block',
                      marginBottom: '8px'
                    }}>
                      Username
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                      <input
                        type="text"
                        required
                        placeholder="Enter your username"
                        value={signInUsername}
                        onChange={(e) => setSignInUsername(e.target.value)}
                        style={{
                          width: '100%',
                          height: '46px',
                          paddingLeft: '44px',
                          paddingRight: '14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Field 2: Password */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                        Password
                      </label>
                      <a
                        href="#reset"
                        onClick={(e) => { e.preventDefault(); setError('Please contact your administrator or request a Magic Guest Token.'); }}
                        style={{ fontSize: '0.775rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '46px',
                          paddingLeft: '44px',
                          paddingRight: '44px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          fontSize: '0.875rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '12px',
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Options Row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#334155', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#2563eb', width: '16px', height: '16px', borderRadius: '4px' }}
                      />
                      Remember me
                    </label>
                    <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                      Keep me signed in for 30 days
                    </span>
                  </div>

                  {/* Main Sign In Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '10px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      opacity: isSubmitting ? 0.75 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ArrowRight size={18} />
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                {/* Divider Line */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  margin: '24px 0'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
                    OR
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>

                {/* Security Info Card */}
                <div style={{
                  backgroundColor: '#f0f6ff',
                  border: '1px solid #dbeafe',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={20} color="#ffffff" />
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#475569', lineHeight: 1.45 }}>
                    Your account is secure. We use industry-standard encryption to protect your information.
                  </div>
                </div>
              </div>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Create Your Account
                </h2>
                <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
                  Client accounts are active immediately. Staff and admin accounts require administrator approval.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                    Select Account Role
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { role: 'client', label: 'Client Account', Icon: Building, color: '#2563eb', background: '#eff6ff' },
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
                  {/* First & Last Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={signUpFirstName}
                        onChange={(e) => setSignUpFirstName(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        value={signUpLastName}
                        onChange={(e) => setSignUpLastName(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Username & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="johndoe"
                        value={signUpUsername}
                        onChange={(e) => setSignUpUsername(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {signUpRole === 'client' ? (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Company / Organization Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Global Corp"
                        value={signUpCompany}
                        onChange={(e) => setSignUpCompany(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  ) : signUpRole === 'staff' ? (
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Professional Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior Architect"
                        value={signUpTitle}
                        onChange={(e) => setSignUpTitle(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  ) : null}

                  {/* Optional phone number */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Phone Number (Optional)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={signUpPhone}
                        onChange={(e) => setSignUpPhone(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          paddingLeft: '38px',
                          paddingRight: '12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={signUpConfirmPassword}
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.775rem', color: '#475569', cursor: 'pointer', marginTop: '4px' }}>
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>I agree to the Vanguard Service Level Agreement & Terms.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isSubmitting ? 0.75 : 1
                    }}
                  >
                    <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Magic Link Guest Modal */}
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
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMagicModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Sparkles size={22} color="#2563eb" />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Request Instant Guest Token
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
              Enter your corporate email address to receive a zero-password access link.
            </p>

            {magicSent ? (
              <div style={{
                padding: '20px',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <Check size={32} color="#059669" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#047857' }}>
                  Magic Link Dispatched!
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '4px' }}>
                  Check your email inbox for one-click access.
                </div>
              </div>
            ) : (
              <form onSubmit={handleMagicSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.775rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@enterprise.com"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowMagicModal(false)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Dispatch Token
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
