import api from './client';

export const talentApi = {
  getTalent: async () => {
    const response = await api.get('/users?role=staff');
    return response.data;
  },

  getClients: async () => {
    const response = await api.get('/users?role=client');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  setUserActive: async (userId, isActive) => {
    const response = await api.patch(`/users/${userId}`, { is_active: isActive });
    return response.data;
  }
};
