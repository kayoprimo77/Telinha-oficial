import { WASELLER_TOKEN } from '../constants';

interface LeadData {
  nome: string;
  objetivo: string;
  experiencia: string;
  tipo_imovel: string;
  budget: string;
  [key: string]: string;
}

export const sendLeadToWaseller = async (data: LeadData) => {
  // Configuração da API Waseller / WaScript
  // Documentação: https://api-whatsapp.wascript.com.br/api-docs/
  const BASE_URL = 'https://api-whatsapp.wascript.com.br';
  
  // Endpoint para integração de Leads.
  // Nota: Como não capturamos o telefone do cliente no funil, enviamos os dados 
  // para que sejam processados como um novo lead ou evento no seu CRM.
  const API_ENDPOINT = `${BASE_URL}/api/v1/leads`;

  console.log('🚀 [WaSeller] Iniciando envio para API...');
  console.log('📍 URL:', API_ENDPOINT);

  const payload = {
    ...data,
    origin: 'Chat_Funnel_Site',
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WASELLER_TOKEN}`,
        'apikey': WASELLER_TOKEN // Adicionando ambos os padrões de header comuns
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      console.log('✅ [WaSeller] Lead enviado com sucesso:', result);
    } else {
      console.warn('⚠️ [WaSeller] Falha no envio:', response.status, result);
      console.log('ℹ️ Verifique se o endpoint exato em https://api-whatsapp.wascript.com.br/api-docs/ corresponde a /api/v1/leads');
    }
  } catch (error) {
    console.error('❌ [WaSeller] Erro de conexão:', error);
  }
};