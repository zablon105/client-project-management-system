import React, { useState, useEffect } from 'react';
import { invoicesApi } from '../api/invoicesApi';
import { formatKsh } from '../utils/pricing';
import {
  Receipt,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Send,
  Download,
  Settings,
  Plus,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function InvoicesBilling() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [paymentRail, setPaymentRail] = useState('mpesa');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [phone, setPhone] = useState('+254 712 904 882');
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      const data = await invoicesApi.getInvoices();
      const list = data.results || data || [];
      setInvoices(list);
      if (list.length > 0 && !selectedInvoice) {
        setSelectedInvoice(list[0]);
        setPaymentAmount(list[0].balance || list[0].total);
      }
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balance || inv.total);
    setStatusMessage(null);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    setStatusMessage({ type: 'info', text: 'Processing payment transaction...' });
    try {
      const updated = await invoicesApi.payInvoice(selectedInvoice.id, {
        amount: paymentAmount || selectedInvoice.balance,
        method: paymentRail,
        reference: paymentRail === 'mpesa' ? 'MP-STK-' + Date.now().toString().slice(-6) : 'CARD-' + Date.now().toString().slice(-6)
      });
      setStatusMessage({ type: 'success', text: `Payment of $${paymentAmount} processed successfully!` });
      loadInvoices();
      setSelectedInvoice(updated);
    } catch (err) {
      console.error("Payment failed", err);
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Payment processing failed.' });
    }
  };

  const handleDownloadPdf = async (inv) => {
    try {
      await invoicesApi.downloadInvoicePdf(inv.id, `${inv.invoice_number || 'invoice'}.pdf`);
    } catch (err) {
      console.error("PDF download failed", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading financial invoices...</div>;
  }

  const filteredInvoices = invoices.filter(inv => {
    if (activeTab === 'PAID') return inv.status === 'paid';
    if (activeTab === 'UNPAID') return inv.status === 'unpaid' || inv.status === 'partially_paid';
    if (activeTab === 'OVERDUE') return inv.status === 'overdue';
    return true;
  });

  const totalInvoiced = invoices.reduce((acc, i) => acc + parseFloat(i.total || 0), 0);
  const totalCollected = invoices.reduce((acc, i) => acc + parseFloat(i.amount_paid || 0), 0);
  const totalBalance = invoices.reduce((acc, i) => acc + parseFloat(i.balance || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            FINANCIAL OPERATIONS · Connected to Django REST API
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Invoices & Billing Hub
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Real-time settlement orchestration, automated PDF invoice generation, and M-Pesa / Card payment processing.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="v-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>TOTAL INVOICED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {formatKsh(totalInvoiced)}
          </div>
        </div>

        <div className="v-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>TOTAL COLLECTED</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
            {formatKsh(totalCollected)}
          </div>
        </div>

        <div className="v-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>PENDING BALANCE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            {formatKsh(totalBalance)}
          </div>
        </div>

        <div className="v-card">
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>INVOICE COUNT</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {invoices.length} <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Items</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Left Column: Invoices Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#12141e',
            border: '1px solid #1e2233',
            borderRadius: '10px',
            padding: '8px 16px'
          }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'ALL', label: `All (${invoices.length})` },
                { id: 'PAID', label: 'Paid' },
                { id: 'UNPAID', label: 'Unpaid / Pending' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.725rem',
                    fontWeight: activeTab === t.id ? 800 : 600,
                    backgroundColor: activeTab === t.id ? '#6366f1' : 'transparent',
                    color: activeTab === t.id ? '#fff' : '#9ca3af',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="v-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="v-table">
              <thead>
                <tr>
                  <th>INVOICE #</th>
                  <th>CLIENT & PROJECT</th>
                  <th>DUE DATE</th>
                  <th>TOTAL</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => handleSelectInvoice(inv)}
                    style={{
                      backgroundColor: selectedInvoice?.id === inv.id ? '#161928' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <td>
                      <div style={{ fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>● {inv.invoice_number}</div>
                      <div style={{ fontSize: '0.675rem', color: '#6b7280' }}>Issue: {inv.issue_date}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{inv.client_name || 'Client'}</div>
                      <div style={{ fontSize: '0.725rem', color: '#9ca3af' }}>{inv.project_name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{inv.due_date}</div>
                      <span className={`v-badge ${inv.status === 'paid' ? 'v-badge-success' : 'v-badge-warning'}`}>
                        {inv.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>
                        {formatKsh(inv.total || 0)}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: '#6b7280' }}>
                        Bal: {formatKsh(inv.balance || 0)}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadPdf(inv);
                        }}
                        className="v-btn v-btn-secondary v-btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                      >
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Column: Payment Processing */}
        {selectedInvoice && (
          <div className="v-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={16} color="#38bdf8" />
                Instant Payment Processing
              </div>
              <button onClick={() => handleDownloadPdf(selectedInvoice)} className="v-btn v-btn-secondary v-btn-sm">
                <Download size={12} /> Download PDF
              </button>
            </div>

            {/* Document Details */}
            <div style={{ backgroundColor: '#0d0f18', border: '1px solid #1b1e2c', borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: '#6b7280' }}>
                <span>INVOICE NUMBER</span>
                <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'monospace' }}>{selectedInvoice.invoice_number}</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                {formatKsh(selectedInvoice.total || 0)} <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>KSh</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                <span>Client: {selectedInvoice.client_name}</span>
                <span style={{ color: '#38bdf8' }}>Bal: {formatKsh(selectedInvoice.balance || 0)}</span>
              </div>
            </div>

            {/* Status Alert */}
            {statusMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.775rem',
                backgroundColor: statusMessage.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)',
                color: statusMessage.type === 'success' ? '#34d399' : '#a5b4fc',
                border: '1px solid currentColor'
              }}>
                {statusMessage.text}
              </div>
            )}

            {/* Rail Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setPaymentRail('mpesa')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: paymentRail === 'mpesa' ? '#1c2032' : '#0e1018',
                  color: paymentRail === 'mpesa' ? '#38bdf8' : '#9ca3af',
                  border: '1px solid #232a40',
                  cursor: 'pointer'
                }}
              >
                M-Pesa STK
              </button>
              <button
                type="button"
                onClick={() => setPaymentRail('card')}
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: paymentRail === 'card' ? '#1c2032' : '#0e1018',
                  color: paymentRail === 'card' ? '#6366f1' : '#9ca3af',
                  border: '1px solid #232a40',
                  cursor: 'pointer'
                }}
              >
                Credit Card
              </button>
            </div>

            <form onSubmit={handleProcessPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="v-input"
                />
              </div>

              {paymentRail === 'mpesa' && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '4px' }}>
                    M-Pesa Handset Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="v-input"
                  />
                </div>
              )}

              <button type="submit" className="v-btn v-btn-primary" style={{ padding: '11px', width: '100%' }}>
                <Send size={14} />
                <span>Process Payment via Django API</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
