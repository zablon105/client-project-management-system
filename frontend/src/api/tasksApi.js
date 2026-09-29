import api from './client';

export const tasksApi = {
  getTasks: async (params = {}) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  getMilestones: async (params = {}) => {
    const response = await api.get('/milestones', { params });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  toggleTask: async (id, isDone) => {
    const response = await api.patch(`/tasks/${id}`, { is_done: isDone });
    return response.data;
  },

  updateMilestone: async (id, milestoneData) => {
    const response = await api.patch(`/milestones/${id}`, milestoneData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};
