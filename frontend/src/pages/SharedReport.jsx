import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function SharedReport() {
  const { token } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shared-reports/${token}`)
      .then((response) => setReport(response.data))
      .catch(() => setError('This report link is unavailable or has expired.'));
  }, [token]);

  if (error) return <div style={{ padding: '48px', color: '#f87171' }}>{error}</div>;
  if (!report) return <div style={{ padding: '48px', color: '#9ca3af' }}>Loading shared report...</div>;

  return (
    <main style={{ maxWidth: '760px', margin: '48px auto', padding: '32px', color: '#fff' }}>
      <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>SECURE CLIENT REPORT</div>
      <h1>{report.project.name}</h1>
      <p style={{ color: '#9ca3af' }}>Prepared for {report.client}. This link expires on {new Date(report.expires_at).toLocaleString()}.</p>
      <div className="v-card" style={{ marginTop: '24px' }}>
        <p>{report.project.description || 'No project description available.'}</p>
        <p><strong>Status:</strong> {report.project.status}</p>
        <p><strong>Progress:</strong> {report.project.progress_percent}%</p>
        <p><strong>Service:</strong> {report.project.service}</p>
        <p><strong>Deadline:</strong> {report.project.deadline || 'Not specified'}</p>
      </div>
    </main>
  );
}