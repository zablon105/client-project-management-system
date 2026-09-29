import api from './client';

export const invoicesApi = {
  getInvoices: async () => {
    const response = await api.get('/invoices');
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },

  payInvoice: async (id, paymentPayload) => {
    const response = await api.post(`/invoices/${id}/pay`, paymentPayload);
    return response.data;
  },

  downloadInvoicePdf: async (id, filename = 'invoice.pdf') => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
