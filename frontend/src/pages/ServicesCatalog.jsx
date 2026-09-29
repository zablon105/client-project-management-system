import React, { useState, useEffect } from 'react';
import { servicesApi } from '../api/servicesApi';
import {
  Briefcase,
  TrendingUp,
  Clock,
  Plus,
  FileText,
  CheckCircle2,
  DollarSign,
  Copy,
  ChevronRight,
  MoreVertical,
  Layers,
  X
} from 'lucide-react';

export default function ServicesCatalog() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  const loadServices = async () => {
    try {
      const data = await servicesApi.getServices();
      const list = data.results || data || [];
      setServices(list);
      if (list.length > 0 && !selectedService) {
        setSelectedService(list[0]);
      }
    } catch (err) {
      console.error("Failed to load services", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    try {
      const created = await servicesApi.createService({
        name: newServiceName,
        description: newServiceDesc,
        is_active: true
      });
      setShowModal(false);
      setNewServiceName('');
      setNewServiceDesc('');
      loadServices();
      setSelectedService(created);
    } catch (err) {
      console.error("Failed to create service", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading services catalog...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            ENTERPRISE CATALOG V2.4 · Connected to Django REST API
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Services & SOW Catalog
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Define and manage core agency offerings, baseline milestone packages, and deliverable scopes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowModal(true)} className="v-btn v-btn-primary v-btn-sm">
            <Plus size={14} />
            Create New Service Tier
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="v-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>ACTIVE OFFERINGS</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1e2338', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={14} color="#6366f1" />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            {services.length} <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>Packages</span>
          </div>
        </div>
        <div className="v-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>DATABASE STATUS</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#1e2338', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={14} color="#34d399" />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>Synced</div>
        </div>
      </div>

      {/* Main Grid: Services List + Configurator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {services.map((srv) => (
            <div
              key={srv.id}
              onClick={() => setSelectedService(srv)}
              className="v-card"
              style={{
                borderColor: selectedService?.id === srv.id ? '#6366f1' : '#202436',
                backgroundColor: selectedService?.id === srv.id ? '#141727' : '#12141f',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: '#1d2238',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Layers size={14} color="#6366f1" />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>{srv.name}</h3>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '14px 0', lineHeight: 1.5 }}>
                {srv.description || 'No detailed scope description provided.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1e2235', paddingTop: '12px', fontSize: '0.75rem', color: '#9ca3af' }}>
                <div>{srv.milestone_templates?.length || 0} Milestone Templates Configured</div>
                <div style={{ color: '#6366f1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>View Details</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Service Configurator */}
        {selectedService && (
          <div className="v-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SERVICE DETAILS
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {selectedService.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '6px' }}>
                {selectedService.description}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>
                MILESTONE TEMPLATES
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedService.milestone_templates && selectedService.milestone_templates.length > 0 ? (
                  selectedService.milestone_templates.map((tpl, idx) => (
                    <div key={tpl.id || idx} style={{
                      backgroundColor: '#10121b',
                      border: '1px solid #1b1e2c',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#1d2238', fontSize: '0.65rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {tpl.order || idx + 1}
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{tpl.name}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No milestone templates associated with this service.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Service Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(5, 6, 10, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            width: '440px', backgroundColor: '#131622', border: '1px solid #242a3e',
            borderRadius: '16px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', position: 'relative'
          }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Create Service Tier
            </h2>
            <form onSubmit={handleCreateService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Service Name</label>
                <input type="text" required value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} className="v-input" placeholder="e.g. AI & Machine Learning Integration" />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea rows={3} value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} className="v-input" placeholder="Service scope description..." />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="v-btn v-btn-secondary">Cancel</button>
                <button type="submit" className="v-btn v-btn-primary">Create Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
