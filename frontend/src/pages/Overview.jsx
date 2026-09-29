import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projectsApi';
import { invoicesApi } from '../api/invoicesApi';
import { notificationsApi } from '../api/notificationsApi';
import { useAuth } from '../context/AuthContext';
import { formatKsh } from '../utils/pricing';
import {
  TrendingUp,
  FolderKanban,
  Receipt,
  Zap,
  Users,
  AlertTriangle,
  Send,
  Plus,
  ArrowUpRight,
  FileText,
  UserPlus
} from 'lucide-react';

export default function Overview() {
  const { onOpenNewProject, refreshTrigger } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, invoicesRes, notificationsRes] = await Promise.all([
          projectsApi.getProjects(),
          invoicesApi.getInvoices(),
          notificationsApi.getNotifications()
        ]);
        setProjects(projectsRes.results || projectsRes || []);
        setInvoices(invoicesRes.results || invoicesRes || []);
        setNotifications(notificationsRes.results || notificationsRes || []);
      } catch (err) {
        console.error("Failed to load overview metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const totalInvoiced = invoices.reduce((acc, inv) => acc + parseFloat(inv.total || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + parseFloat(inv.amount_paid || 0), 0);
  const totalBalance = invoices.reduce((acc, inv) => acc + parseFloat(inv.balance || 0), 0);
  const activeCount = projects.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '4px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            EXECUTIVE COMMAND MATRIX · Connected to Django REST API
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Welcome back, {user?.first_name || user?.username || 'Partner'} —
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Agency Performance Overview: {activeCount} active engagements, total invoiced {formatKsh(totalInvoiced)}, balance pending {formatKsh(totalBalance)}.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onOpenNewProject} className="v-btn v-btn-primary v-btn-sm">
            <Plus size={14} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* Active Projects */}
        <div className="v-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ACTIVE PROJECTS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{activeCount}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>Live API</span>
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderKanban size={18} color="var(--primary)" />
            </div>
          </div>
        </div>

        {/* Monthly Invoiced */}
        <div className="v-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                TOTAL INVOICED
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatKsh(totalInvoiced)}
                </span>
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={18} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
            <span>Collected: {formatKsh(totalPaid)}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Due: {formatKsh(totalBalance)}</span>
          </div>
        </div>

        {/* Milestone Velocity */}
        <div className="v-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SYSTEM HEALTH
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>100%</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>Operational</span>
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="var(--accent-purple)" />
            </div>
          </div>
        </div>

        {/* Notifications Count */}
        <div className="v-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                NOTIFICATIONS
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{notifications.length}</span>
              </div>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color="var(--accent-emerald)" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Engagements Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="v-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Active Client Engagements</h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>Live Django database query results</p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>No active engagements found.</div>
          ) : (
            <table className="v-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/projects/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.service_detail?.name || 'Service'}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {item.client_detail?.first_name ? `${item.client_detail.first_name} ${item.client_detail.last_name}` : item.client_detail?.username || 'Client'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>
                        {formatKsh(item.budget || 0)}
                      </span>
                    </td>
                    <td>
                      <span className="v-badge v-badge-info">
                        ● {item.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Live System Notifications Widget */}
        <div className="v-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recent Notifications</h3>
            <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.05em' }}>
              LIVE API
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8rem' }}>
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <strong style={{ color: 'var(--primary)' }}>{n.type}</strong>
                  <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div style={{ color: 'var(--text-primary)', marginTop: '2px', fontSize: '0.775rem' }}>
                  {n.payload?.title || n.payload?.content || 'System notification dispatch'}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/notifications')} className="v-btn v-btn-secondary v-btn-sm" style={{ width: '100%', marginTop: 'auto' }}>
            Open Notifications Center
          </button>
        </div>
      </div>
    </div>
  );
}
