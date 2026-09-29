import api from './client';

export const notificationsApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/mark_read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark_all_read');
    return response.data;
  },

  createReportShare: async (projectId) => {
    const response = await api.post('/notifications/report-share', { project: projectId });
    return response.data;
  },

  scheduleReport: async (projectId, recipientEmail, scheduledFor) => {
    const response = await api.post('/notifications/report-schedule', {
      project: projectId,
      recipient_email: recipientEmail,
      scheduled_for: scheduledFor
    });
    return response.data;
  }
};
