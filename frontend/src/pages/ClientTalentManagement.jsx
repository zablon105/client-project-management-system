import React, { useState, useEffect } from 'react';
import { talentApi } from '../api/talentApi';
import { Users, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';

export default function ClientTalentManagement() {
  const [staffList, setStaffList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [staffRes, clientsRes] = await Promise.all([
          talentApi.getTalent(),
          talentApi.getClients()
        ]);
        setStaffList(staffRes.results || staffRes || []);
        setClientList(clientsRes.results || clientsRes || []);
      } catch (err) {
        console.error("Failed to load talent and clients", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading agency directory...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#c084fc', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
          TALENT & ACCOUNTS DIRECTORY · Connected to Django REST API
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          Team & Client Account Directory
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
          Overview of staff architects, lead engineers, and active client account holders.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Staff Members */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Staff Architects & Leads ({staffList.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {staffList.map((s) => (
              <div key={s.id} style={{
                backgroundColor: '#111422',
                border: '1px solid #20253a',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                    {s.first_name ? `${s.first_name} ${s.last_name}` : s.username}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '2px' }}>
                    {s.staff_profile?.title || 'Staff Architect'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                    {s.email}
                  </div>
                </div>
                <span className="v-badge v-badge-purple">STAFF</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Accounts */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Client Accounts ({clientList.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {clientList.map((c) => (
              <div key={c.id} style={{
                backgroundColor: '#111422',
                border: '1px solid #20253a',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                    {c.first_name ? `${c.first_name} ${c.last_name}` : c.username}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                    Company: {c.client_profile?.company_name || 'Individual'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '4px' }}>
                    {c.email}
                  </div>
                </div>
                <span className="v-badge v-badge-info">CLIENT</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
