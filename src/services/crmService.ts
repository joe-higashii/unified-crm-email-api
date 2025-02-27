//crmService.ts

import axios from 'axios';

export const getLeadsFromCRM = async (config: { provider: string; token: string; /* outros parâmetros */ }) => {
  try {
    // Exemplo: chamada à API do Salesforce
    const response = await axios.get('https://api.salesforce.com/leads', {
      headers: { Authorization: `Bearer ${config.token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao integrar com CRM:', error);
    throw new Error('CRM_INTEGRATION_FAILURE');
  }
};

