import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { X, Check } from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { talentApi } from '../api/talentApi';
import { servicesApi } from '../api/servicesApi';

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [budget, setBudget] = useState('45000');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [clientsData, servicesData] = await Promise.all([
          talentApi.getClients(),
          servicesApi.getServices()
        ]);
        setClients(clientsData.results || clientsData || []);
        setServices(servicesData.results || servicesData || []);
        if ((clientsData.results || clientsData || []).length > 0) {
          setSelectedClientId((clientsData.results || clientsData)[0].id);
        }
        if ((servicesData.results || servicesData || []).length > 0) {
          setSelectedServiceId((servicesData.results || servicesData)[0].id);
        }
      } catch (err) {
        console.error("Failed to load project creation dropdowns", err);
      }
    };
    loadFormData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName || !selectedClientId || !selectedServiceId) return;
    setIsSubmitting(true);
    try {
      await projectsApi.createProject({
        name: projectName,
        client: selectedClientId,
        service: selectedServiceId,
        budget: parseFloat(budget) || 0,
        description: description || 'New project created via workspace',
        status: 'pending'
      });
      setSuccessMessage(true);
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => {
        setSuccessMessage(false);
        setShowNewProjectModal(false);
        setProjectName('');
        setDescription('');
      }, 1200);
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-darker)', position: 'relative' }}>
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          onOpenNewProject={() => setShowNewProjectModal(true)}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet context={{ refreshTrigger, onOpenNewProject: () => setShowNewProjectModal(true) }} />
        </main>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 6, 10, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowNewProjectModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Create New Client Engagement
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Initialize SOW parameters, assign client account, and select service catalog item.
            </p>

            {successMessage ? (
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <Check size={32} color="#34d399" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                  Project Provisioned Successfully!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Connected to Django REST API & database saved.
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Trading Engine Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="v-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Client Account
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="v-input"
                    style={{ height: '42px' }}
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.first_name ? `${c.first_name} ${c.last_name}` : c.username} ({c.client_profile?.company_name || 'Client'})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Target Budget ($)
                    </label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="v-input"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Service Catalog
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="v-input"
                      style={{ height: '42px' }}
                    >
                      {services.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Scope & Description
                  </label>
                  <input
                    type="text"
                    placeholder="Brief scope summary..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="v-input"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="v-btn v-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="v-btn v-btn-primary">
                    {isSubmitting ? 'Provisioning...' : 'Provision Project'}
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
