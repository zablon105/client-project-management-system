import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { getDashboardPricing, setDashboardPricing } from '../utils/pricing';
import { User, Save, Lock, ShieldCheck, Sun } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function UserSettings() {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [minPrice, setMinPrice] = useState(12000);
  const [maxPrice, setMaxPrice] = useState(24500);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPricing = async () => {
      const pricing = await getDashboardPricing();
      setMinPrice(pricing.min);
      setMaxPrice(pricing.max);
    };

    loadPricing();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await authApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone
      });
      setUser(updated);

      if (user?.role === 'admin') {
        await setDashboardPricing({ min: Number(minPrice), max: Number(maxPrice) });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
          USER SETTINGS · Connected to Django REST API
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          Account & Profile Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal details, workspace theme preferences, and role parameters.
        </p>
      </div>

      {/* Theme & Appearance Card */}
      <div className="v-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Interface Theme
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Switch between Kinetic Dark Obsidian and Pristine White Mode.
          </p>
        </div>
        <ThemeToggle showLabel={true} size="md" />
      </div>

      <div className="v-card" style={{ padding: '28px' }}>
        {saveSuccess && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: '8px',
            color: '#34d399',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            Profile details saved to PostgreSQL database!
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="v-input"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="v-input"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="v-input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="v-input"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
              Assigned Role
            </label>
            <input
              type="text"
              disabled
              value={user?.role?.toUpperCase() || 'CLIENT'}
              className="v-input"
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          {user?.role === 'admin' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '8px', borderTop: '1px solid #1f2336' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Dashboard Min Price (KSh)
                </label>
                <input
                  type="number"
                  min="12000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="v-input"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                  Dashboard Max Price (KSh)
                </label>
                <input
                  type="number"
                  max="24500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="v-input"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" disabled={isSubmitting} className="v-btn v-btn-primary">
              <Save size={14} />
              <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
