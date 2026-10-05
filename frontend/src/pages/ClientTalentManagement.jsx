import React, { useState, useEffect } from 'react';
import { talentApi } from '../api/talentApi';
import { useAuth } from '../context/AuthContext';

export default function ClientTalentManagement() {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalError, setApprovalError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const [staffRes, clientsRes, usersRes] = await Promise.all([
          talentApi.getTalent(),
          talentApi.getClients(),
          talentApi.getAllUsers()
        ]);
        const staff = staffRes.results || staffRes || [];
        const clients = clientsRes.results || clientsRes || [];
        const users = usersRes.results || usersRes || [];
        setStaffList(staff.filter((account) => account.is_active));
        setClientList(clients.filter((account) => account.is_active));
        setPendingUsers(users.filter((account) =>
          !account.is_active && ['staff', 'admin'].includes(account.role)
        ));
      } catch (err) {
        console.error("Failed to load talent and clients", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const approveUser = async (account) => {
    setApprovalError('');
    try {
      await talentApi.setUserActive(account.id, true);
      setPendingUsers((current) => current.filter((pending) => pending.id !== account.id));
      if (account.role === 'staff') {
        setStaffList((current) => [...current, account]);
      }
    } catch (err) {
      console.error('Failed to approve account', err);
      setApprovalError('The account could not be approved. Please try again.');
    }
  };

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

      {user?.role === 'admin' && (
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Pending Staff/Admin Approvals ({pendingUsers.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '6px 0 0' }}>
              These accounts cannot sign in until approved.
            </p>
          </div>
          {approvalError && <div role="alert" style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{approvalError}</div>}
          {pendingUsers.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No accounts are waiting for approval.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingUsers.map((account) => (
                <div key={account.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#111422',
                  border: '1px solid #20253a',
                  borderRadius: '10px'
                }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                      {account.first_name ? `${account.first_name} ${account.last_name}` : account.username}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                      {account.email} · {account.role.toUpperCase()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="v-btn v-btn-primary"
                    onClick={() => approveUser(account)}
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
