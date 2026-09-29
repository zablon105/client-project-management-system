import api from './client';

export const feedbackApi = {
  getFeedback: async (params = {}) => {
    const response = await api.get('/feedback', { params });
    return response.data;
  },

  submitFeedback: async (data) => {
    const formData = new FormData();
    formData.append('project', data.project);
    formData.append('message', data.message);
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }
    const response = await api.post('/feedback', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  addResponse: async (feedbackId, message) => {
    const response = await api.post('/feedback-responses', {
      feedback: feedbackId,
      message
    });
    return response.data;
  },

  resolveFeedback: async (id) => {
    const response = await api.post(`/feedback/${id}/resolve`);
    return response.data;
  }
};
