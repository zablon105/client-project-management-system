import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projectsApi';
import { invoicesApi } from '../api/invoicesApi';
import { feedbackApi } from '../api/feedbackApi';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Receipt,
  MessageSquare,
  ChevronRight,
  Download,
  Plus
} from 'lucide-react';

export default function ClientPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClientData = async () => {
      try {
        const [projRes, invRes, fbRes] = await Promise.all([
          projectsApi.getProjects(),
          invoicesApi.getInvoices(),
          feedbackApi.getFeedback()
        ]);
        setProjects(projRes.results || projRes || []);
        setInvoices(invRes.results || invRes || []);
        setFeedbackList(fbRes.results || fbRes || []);
      } catch (err) {
        console.error("Failed to load client portal data", err);
      } finally {
        setLoading(false);
      }
    };
    loadClientData();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading client portal...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
          ENTERPRISE CLIENT PORTAL · Connected to Django REST API
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Welcome, {user?.first_name || user?.username || 'Client Partner'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Track active engagement milestones, review deliverables, settle milestone invoices, and submit feedback.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Projects list */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>My Active Engagements</h3>

          {projects.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No active projects assigned.</div>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                style={{
                  backgroundColor: '#111422',
                  border: '1px solid #20253a',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                    {p.service_detail?.name || 'Service Package'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="v-badge v-badge-info">{p.status?.toUpperCase()} ({p.progress_percent}%)</span>
                  <ChevronRight size={16} color="#6366f1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Invoices summary */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Invoices & Payments</h3>

          {invoices.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No invoices issued.</div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} style={{
                backgroundColor: '#10121b',
                border: '1px solid #1b1e2c',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                  <span>{inv.invoice_number}</span>
                  <span style={{ color: '#34d399' }}>${parseFloat(inv.total || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                  <span className={`v-badge ${inv.status === 'paid' ? 'v-badge-success' : 'v-badge-warning'}`}>
                    {inv.status?.toUpperCase()}
                  </span>
                  <button onClick={() => navigate('/invoices')} className="v-btn v-btn-secondary v-btn-sm" style={{ fontSize: '0.7rem' }}>
                    Pay / Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
