import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projectsApi';
import { tasksApi } from '../api/tasksApi';
import { feedbackApi } from '../api/feedbackApi';
import { formatKsh } from '../utils/pricing';
import {
  Download,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  Send,
  FileText,
  ShieldCheck,
  CheckSquare,
  Square,
  Paperclip,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');
  const [newUpdateNote, setNewUpdateNote] = useState('');
  const [newFeedbackNote, setNewFeedbackNote] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);

  const loadProjectData = async () => {
    try {
      const targetId = id === 'aura-fintech' ? 1 : id;
      const projData = await projectsApi.getProjectById(targetId);
      setProject(projData);

      const [msData, fbData] = await Promise.all([
        tasksApi.getMilestones({ project: targetId }),
        feedbackApi.getFeedback({ project: targetId })
      ]);
      setMilestones(msData.results || msData || []);
      setFeedbackList(fbData.results || fbData || []);
    } catch (err) {
      console.error("Failed to load project details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await tasksApi.toggleTask(taskId, !currentStatus);
      loadProjectData();
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const handleAddProgressUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdateNote.trim()) return;
    try {
      await projectsApi.addProgressUpdate(project.id, {
        note: newUpdateNote,
        file: fileToUpload
      });
      setNewUpdateNote('');
      setFileToUpload(null);
      loadProjectData();
    } catch (err) {
      console.error("Failed to add progress update", err);
    }
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedbackNote.trim()) return;
    try {
      await feedbackApi.submitFeedback({
        project: project.id,
        message: newFeedbackNote,
        attachment: fileToUpload
      });
      setNewFeedbackNote('');
      setFileToUpload(null);
      loadProjectData();
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading project details...</div>;
  }

  if (!project) {
    return (
      <div style={{ padding: '24px', color: '#f87171' }}>
        Project not found. <button onClick={() => navigate('/overview')} className="v-btn v-btn-secondary v-btn-sm">Return Overview</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span onClick={() => navigate('/overview')} style={{ cursor: 'pointer' }}>Projects</span>
            <span>/</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>{project.name}</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            {project.name}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate('/invoices')} className="v-btn v-btn-secondary v-btn-sm">
            <Download size={14} />
            View Invoices
          </button>
        </div>
      </div>

      {/* Hero Project Banner */}
      <div className="v-card" style={{
        background: 'linear-gradient(135deg, #121524 0%, #171b2d 100%)',
        border: '1px solid #232a42',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span className="v-badge v-badge-info">
            ● STATUS: {project.status?.toUpperCase()} ({project.progress_percent}%)
          </span>
          <span style={{ fontSize: '0.75rem', color: '#6366f1', fontFamily: 'monospace' }}>
            Service: {project.service_detail?.name || 'Custom'}
          </span>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#d1d5db', lineHeight: 1.6, maxWidth: '900px', marginBottom: '20px' }}>
          {project.description || 'No detailed scope description provided.'}
        </p>

        {/* Metric Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #20263c'
        }}>
          <div>
            <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>CLIENT ACCOUNT</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {project.client_detail?.first_name ? `${project.client_detail.first_name} ${project.client_detail.last_name}` : project.client_detail?.username}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>START / DEADLINE</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {project.start_date || 'TBD'} – {project.deadline || 'TBD'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>BUDGET</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
              {formatKsh(project.budget || 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase' }}>ASSIGNED SQUAD</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {project.members && project.members.length > 0
                ? project.members.map(m => m.staff_detail?.first_name || m.staff_detail?.username).join(', ')
                : 'Unassigned'}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1f2336', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`v-btn v-btn-sm ${activeTab === 'overview' ? 'v-btn-primary' : 'v-btn-secondary'}`}
        >
          Milestones & Deliverables
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`v-btn v-btn-sm ${activeTab === 'feed' ? 'v-btn-primary' : 'v-btn-secondary'}`}
        >
          Progress Updates ({project.updates?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`v-btn v-btn-sm ${activeTab === 'feedback' ? 'v-btn-primary' : 'v-btn-secondary'}`}
        >
          Client Feedback Stream ({feedbackList.length})
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Milestones List */}
          <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Milestones Roadmap</h3>

            {milestones.length === 0 ? (
              <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No milestones created yet.</div>
            ) : (
              milestones.map((ms) => (
                <div key={ms.id} style={{
                  backgroundColor: '#141829',
                  border: '1px solid #1e2336',
                  borderRadius: '12px',
                  padding: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                      {ms.name}
                    </div>
                    <span className="v-badge v-badge-info">{ms.state?.toUpperCase()}</span>
                  </div>

                  {/* Tasks */}
                  {ms.tasks && ms.tasks.length > 0 && (
                    <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {ms.tasks.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleToggleTask(t.id, t.is_done)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#0d0f18',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: t.is_done ? '#9ca3af' : '#fff'
                          }}
                        >
                          {t.is_done ? <CheckSquare size={14} color="#34d399" /> : <Square size={14} color="#6b7280" />}
                          <span style={{ textDecoration: t.is_done ? 'line-through' : 'none' }}>
                            {t.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Files / Attachments */}
          <div className="v-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Project Assets & Files</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.files && project.files.length > 0 ? (
                project.files.map((f) => (
                  <div key={f.id} style={{
                    backgroundColor: '#10121b',
                    border: '1px solid #1b1e2c',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                        {f.file ? f.file.split('/').pop() : 'Attachment'}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: '#6b7280' }}>
                        Uploaded by {f.uploaded_by_detail?.username || 'User'}
                      </div>
                    </div>
                    {f.file && (
                      <a href={f.file} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>
                        <Download size={14} />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>No project files uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Updates Feed */}
      {activeTab === 'feed' && (
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Progress Updates Feed</h3>

          <form onSubmit={handleAddProgressUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              rows={3}
              required
              placeholder="Post a progress update note for this project..."
              value={newUpdateNote}
              onChange={(e) => setNewUpdateNote(e.target.value)}
              className="v-input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} style={{ color: '#9ca3af', fontSize: '0.8rem' }} />
              <button type="submit" className="v-btn v-btn-primary v-btn-sm">
                <span>Post Update</span>
                <Send size={12} />
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {project.updates && project.updates.map((u) => (
              <div key={u.id} style={{
                backgroundColor: '#111422',
                border: '1px solid #20253a',
                borderRadius: '10px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>
                  <strong style={{ color: '#fff' }}>{u.author_detail?.first_name || u.author_detail?.username || 'Author'}</strong>
                  <span>{new Date(u.created_at).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>{u.note}</div>
                {u.file && (
                  <div style={{ marginTop: '8px' }}>
                    <a href={u.file} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Paperclip size={12} /> View Attached File
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Stream */}
      {activeTab === 'feedback' && (
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Client Feedback Stream</h3>

          <form onSubmit={handleAddFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              rows={3}
              required
              placeholder="Submit feedback or review note..."
              value={newFeedbackNote}
              onChange={(e) => setNewFeedbackNote(e.target.value)}
              className="v-input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input type="file" onChange={(e) => setFileToUpload(e.target.files[0])} style={{ color: '#9ca3af', fontSize: '0.8rem' }} />
              <button type="submit" className="v-btn v-btn-primary v-btn-sm">
                <span>Submit Feedback</span>
                <Send size={12} />
              </button>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {feedbackList.map((fb) => (
              <div key={fb.id} style={{
                backgroundColor: '#111422',
                border: '1px solid #20253a',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {fb.sender_detail?.first_name ? `${fb.sender_detail.first_name} ${fb.sender_detail.last_name}` : fb.sender_detail?.username}
                  </div>
                  <span className={`v-badge ${fb.status === 'resolved' ? 'v-badge-success' : 'v-badge-warning'}`}>
                    {fb.status?.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#d1d5db' }}>{fb.message}</p>
                {fb.attachment && (
                  <a href={fb.attachment} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                    <Paperclip size={12} /> Attached Deliverable
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
