import React, { useState, useEffect } from 'react';
import { notificationsApi } from '../api/notificationsApi';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  Moon
} from 'lucide-react';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data.results || data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      loadNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading notification stream...</div>;
  }

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f43f5e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            ● LIVE ACTIVITY STREAM · Connected to Django REST API
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Notifications & Audit Center{' '}
            <span style={{ fontSize: '0.8rem', backgroundColor: '#f43f5e', color: '#fff', padding: '3px 10px', borderRadius: '9999px', verticalAlign: 'middle' }}>
              {unreadCount} Unread
            </span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleMarkAllRead} className="v-btn v-btn-secondary v-btn-sm">
            <CheckCheck size={14} />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '24px' }}>
        {/* Left Column: Notification Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.length === 0 ? (
            <div className="v-card" style={{ padding: '24px', color: '#9ca3af' }}>No notifications found.</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="v-card" style={{
                border: n.read_at ? '1px solid #1f253e' : '1px solid #6366f1',
                backgroundColor: n.read_at ? '#12141f' : '#15192c',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                    ● {n.payload?.title || n.type}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '6px' }}>
                  {n.payload?.content || JSON.stringify(n.payload)}
                </p>

                {!n.read_at && (
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleMarkRead(n.id)} className="v-btn v-btn-secondary v-btn-sm" style={{ fontSize: '0.7rem' }}>
                      Mark Read
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Column: Settings summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="v-card">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Delivery Channels</h3>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Notifications are automatically dispatched when payments are processed, feedback is submitted, or milestone updates occur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
