import React, { useEffect, useMemo, useState } from 'react';
import { projectsApi } from '../api/projectsApi';
import { invoicesApi } from '../api/invoicesApi';
import { notificationsApi } from '../api/notificationsApi';
import {
  Download,
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  FileText
} from 'lucide-react';

export default function ReportsDeliverables() {
  const [projects, setProjects] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dispatchMessage, setDispatchMessage] = useState('');

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const [projectsData, invoicesData] = await Promise.all([
          projectsApi.getProjects(),
          invoicesApi.getInvoices()
        ]);

        const projectList = projectsData.results || projectsData || [];
        const invoiceList = invoicesData.results || invoicesData || [];

        setProjects(projectList);
        setInvoices(invoiceList);

        if (projectList.length > 0) {
          setSelectedProjectId(String(projectList[0].id));
        }
      } catch (err) {
        console.error('Failed to load report data', err);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  const selectedProject = useMemo(() => {
    return projects.find((project) => String(project.id) === String(selectedProjectId)) || projects[0] || null;
  }, [projects, selectedProjectId]);

  const projectInvoices = useMemo(() => {
    if (!selectedProject) return [];
    return invoices.filter((invoice) => {
      const invoiceProjectId = invoice.project?.id ?? invoice.project;
      return Number(invoiceProjectId) === Number(selectedProject.id);
    });
  }, [selectedProject, invoices]);

  const totals = useMemo(() => {
    const totalContract = projectInvoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);
    const totalPaid = projectInvoices.reduce((sum, invoice) => sum + Number(invoice.amount_paid || 0), 0);
    const totalBalance = projectInvoices.reduce((sum, invoice) => sum + Number(invoice.balance || 0), 0);

    return { totalContract, totalPaid, totalBalance };
  }, [projectInvoices]);

  const handleDownloadPdf = async () => {
    if (!selectedProject) return;

    setDownloading(true);

    try {
      const content = [
        `CPMTS Executive Summary`,
        `Project: ${selectedProject.name}`,
        `Client: ${selectedProject.client_detail?.first_name ? `${selectedProject.client_detail.first_name} ${selectedProject.client_detail.last_name}` : selectedProject.client_detail?.username || 'Client'}`,
        `Status: ${selectedProject.status || 'Unknown'}`,
        `Progress: ${selectedProject.progress_percent || 0}%`,
        `Budget: $${Number(selectedProject.budget || 0).toLocaleString()}`,
        '',
        `Invoice Summary`,
        `Total contract: $${totals.totalContract.toLocaleString()}`,
        `Total paid: $${totals.totalPaid.toLocaleString()}`,
        `Balance due: $${totals.totalBalance.toLocaleString()}`,
        '',
        'Invoice References:',
        ...projectInvoices.map((invoice) =>
          `- ${invoice.invoice_number}: ${invoice.status} | Total $${Number(invoice.total || 0).toLocaleString()} | Paid $${Number(invoice.amount_paid || 0).toLocaleString()} | Balance $${Number(invoice.balance || 0).toLocaleString()}`
        )
      ].join('\n');

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedProject.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-summary.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate report file', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareReport = async () => {
    if (!selectedProject) return;
    try {
      const result = await notificationsApi.createReportShare(selectedProject.id);
      await navigator.clipboard.writeText(result.url);
      setDispatchMessage('Secure report link copied. It expires in 7 days.');
    } catch (err) {
      setDispatchMessage('Unable to create a secure report link.');
    }
  };

  const handleScheduleReport = async () => {
    if (!selectedProject) return;
    const recipientEmail = window.prompt('Recipient email address');
    const scheduledFor = window.prompt('Schedule time in ISO format (for example 2026-10-01T09:00:00Z)');
    if (!recipientEmail || !scheduledFor) return;

    try {
      await notificationsApi.scheduleReport(selectedProject.id, recipientEmail, scheduledFor);
      setDispatchMessage(`Report scheduled for ${recipientEmail}.`);
    } catch (err) {
      setDispatchMessage(err.response?.data?.error || 'Unable to schedule report dispatch.');
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading report data...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            ENTERPRISE DELIVERABLES MANAGEMENT
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Executive Progress & Audit Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Client-ready project summaries compiled from current project and invoice data from the Django API.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#9ca3af' }}>
          <span>Report Data: <strong style={{ color: '#38bdf8' }}>Live API</strong></span>
          <span>•</span>
          <span>Latest Sync: <strong style={{ color: '#34d399' }}>{new Date().toLocaleDateString()}</strong></span>
        </div>
      </div>

      <div style={{
        backgroundColor: '#12141e',
        border: '1px solid #1e2233',
        borderRadius: '10px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>CLIENT & MASTER PROJECT</div>
            <select
              className="v-input"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{ width: '220px', height: '32px', fontSize: '0.75rem', marginTop: '2px' }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>REPORT ARCHETYPE</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
              Executive Summary & Audit
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#6b7280' }}>PERIOD WINDOW</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
              {selectedProject?.start_date || '—'} — {selectedProject?.deadline || '—'}
            </div>
          </div>
        </div>

        <button onClick={handleDownloadPdf} className="v-btn v-btn-primary v-btn-sm" style={{ padding: '8px 16px' }}>
          <Download size={14} />
          {downloading ? 'Compiling Report...' : 'Compile & Download Report'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '24px' }}>
        <div className="v-card" style={{ backgroundColor: '#0d0f17', border: '1px solid #202438', borderRadius: '16px', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #20263c', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Project Executive Summary</h2>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{selectedProject?.service_detail?.name || 'Project Delivery Summary'}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>
              <div style={{ color: '#f87171', fontWeight: 800 }}>● LIVE REPORT</div>
              <div>PROJECT ID: {selectedProject?.id || '—'}</div>
              <div>GENERATED: {new Date().toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
              CLIENT: {selectedProject?.client_detail?.first_name ? `${selectedProject.client_detail.first_name} ${selectedProject.client_detail.last_name}` : selectedProject?.client_detail?.username || 'Client'}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '6px 0 0' }}>
              {selectedProject?.name || 'Select a project'}
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
              <div style={{ fontSize: '0.675rem', color: '#9ca3af' }}>STATUS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>{selectedProject?.status || 'Unknown'}</div>
            </div>
            <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
              <div style={{ fontSize: '0.675rem', color: '#9ca3af' }}>PROGRESS</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>{selectedProject?.progress_percent || 0}%</div>
            </div>
            <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
              <div style={{ fontSize: '0.675rem', color: '#9ca3af' }}>BUDGET</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>$ {Number(selectedProject?.budget || 0).toLocaleString()}</div>
            </div>
            <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
              <div style={{ fontSize: '0.675rem', color: '#9ca3af' }}>INVOICES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{projectInvoices.length}</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              PROJECT SUMMARY
            </div>
            <p style={{ fontSize: '0.85rem', color: '#d1d5db', lineHeight: 1.6, margin: 0 }}>
              {selectedProject?.description || 'No project description available yet.'}
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              FINANCIAL BURNDOWN
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>CONTRACT TOTAL</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>$ {totals.totalContract.toLocaleString()}</div>
              </div>
              <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>PAID TO DATE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>$ {totals.totalPaid.toLocaleString()}</div>
              </div>
              <div style={{ backgroundColor: '#121522', padding: '16px', borderRadius: '10px', border: '1px solid #1c2032' }}>
                <div style={{ fontSize: '0.65rem', color: '#6b7280' }}>BALANCE DUE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>$ {totals.totalBalance.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="v-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={16} color="#6366f1" />
              Dispatch & Exports
            </div>

            <button onClick={handleDownloadPdf} className="v-btn v-btn-primary v-btn-sm" style={{ width: '100%', padding: '10px' }}>
              <Download size={14} />
              {downloading ? 'Compiling Report...' : 'Download Report'}
            </button>

            <button onClick={handleShareReport} className="v-btn v-btn-secondary v-btn-sm" style={{ width: '100%' }}>
              <Share2 size={14} />
              Share Secure Client Link
            </button>

            <button onClick={handleScheduleReport} className="v-btn v-btn-outline v-btn-sm" style={{ width: '100%' }}>
              <Calendar size={14} />
              Schedule Email Dispatch
            </button>
            {dispatchMessage && <div style={{ color: '#34d399', fontSize: '0.75rem' }}>{dispatchMessage}</div>}
          </div>

          <div className="v-card">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>
              REVIEW STATUS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.775rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                <span>Client Sign-off</span>
                <CheckCircle2 size={14} color="#34d399" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
                <span>Delivery Review</span>
                <CheckCircle2 size={14} color="#34d399" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Finance Audit</span>
                <Clock size={14} color="#6b7280" />
              </div>
            </div>
          </div>

          <div className="v-card">
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>
              INVOICE REFERENCES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.725rem' }}>
              {projectInvoices.length > 0 ? projectInvoices.map((invoice) => (
                <div key={invoice.id} style={{ backgroundColor: '#10121b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1b1e2c', color: '#fff' }}>
                  {invoice.invoice_number} • ${Number(invoice.total || 0).toLocaleString()} • {invoice.status}
                </div>
              )) : (
                <div style={{ backgroundColor: '#10121b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #1b1e2c', color: '#9ca3af' }}>
                  No invoices found for this project.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
