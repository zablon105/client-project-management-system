import React, { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasksApi';
import {
  Clock,
  Upload,
  Plus,
  CheckSquare,
  Square,
  MoreHorizontal
} from 'lucide-react';

export default function StaffTaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);

  const loadTasksAndMilestones = async () => {
    try {
      const [tasksRes, msRes] = await Promise.all([
        tasksApi.getTasks(),
        tasksApi.getMilestones()
      ]);
      setTasks(tasksRes.results || tasksRes || []);
      setMilestones(msRes.results || msRes || []);
    } catch (err) {
      console.error("Failed to load tasks and milestones", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasksAndMilestones();
  }, []);

  const handleToggleTask = async (taskId, isDone) => {
    try {
      await tasksApi.toggleTask(taskId, !isDone);
      loadTasksAndMilestones();
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      await tasksApi.createTask({
        project: 1, // default to main project if unselected
        title: newTaskTitle,
        is_done: false
      });
      setNewTaskTitle('');
      setShowTaskModal(false);
      loadTasksAndMilestones();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', color: '#9ca3af' }}>Loading sprint workstation...</div>;
  }

  const completedTasks = tasks.filter(t => t.is_done);
  const pendingTasks = tasks.filter(t => !t.is_done);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            STAFF WORKSTATION · Connected to Django REST API
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            My Workstation & Sprint Board
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            <strong style={{ color: '#fff' }}>{pendingTasks.length} pending tasks</strong>, {completedTasks.length} completed.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowTaskModal(true)} className="v-btn v-btn-primary v-btn-sm">
            <Plus size={14} />
            Add Task
          </button>
        </div>
      </div>

      {/* Main Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Task List Section */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Sprint Task Backlog & Checklist</h3>

          {tasks.length === 0 ? (
            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>No tasks found. Click "Add Task" to create one.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id, task.is_done)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#111422',
                    border: '1px solid #20253a',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {task.is_done ? <CheckSquare size={16} color="#34d399" /> : <Square size={16} color="#6b7280" />}
                    <span style={{ fontSize: '0.9rem', color: task.is_done ? '#9ca3af' : '#fff', textDecoration: task.is_done ? 'line-through' : 'none', fontWeight: 600 }}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`v-badge ${task.is_done ? 'v-badge-success' : 'v-badge-info'}`}>
                    {task.is_done ? 'DONE' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Milestones Overview */}
        <div className="v-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Active Milestones</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {milestones.map((ms) => (
              <div key={ms.id} style={{
                backgroundColor: '#10121b',
                border: '1px solid #1b1e2c',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{ms.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{ms.tasks?.length || 0} tasks included</span>
                  <span className="v-badge v-badge-purple">{ms.state?.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(5, 6, 10, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            width: '400px', backgroundColor: '#131622', border: '1px solid #242a3e',
            borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                required
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="v-input"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowTaskModal(false)} className="v-btn v-btn-secondary">Cancel</button>
                <button type="submit" className="v-btn v-btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
