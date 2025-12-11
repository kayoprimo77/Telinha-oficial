import { Contact } from './types';

export const WASELLER_TOKEN = '1765468872672-d03eb3424f7e2c53c44e1f25d5d9b0f4';

// ==============================================================================
// ⚠️ CONFIGURAÇÃO REALIZADA ⚠️
// Número atualizado conforme solicitado.
// ==============================================================================
export const WHATSAPP_NUMBER = '5511913670303'; 

export const THEODORO_CONTACT: Contact = {
  id: 'theodoro',
  name: 'Theodoro - Statux Realty',
  avatar: 'https://i.ibb.co/3Yrp1pCX/Captura-de-tela-2025-12-10-110227.png',
  lastMessage: 'Digitando...',
  lastMessageTime: 'Agora',
  unreadCount: 1,
  isOnline: true
};

export const FUNNEL_SCRIPT = [
  {
    id: 1,
    key: 'nome',
    getMessage: () => "Áudio", // Fallback text
    audioUrl: 'https://s31.aconvert.com/convert/p3r68-cdx67/l9v51-d85lk.mp3',
    inputType: 'text' as const
  },
  {
    id: 2,
    key: 'objetivo',
    getMessage: (name: string) => `Prazer, ${name}! Você está buscando imóvel para moradia ou para investimento?`,
    inputType: 'options' as const,
    options: ['Moradia', 'Investimento']
  },
  {
    id: 3,
    key: 'experiencia',
    getMessage: () => "Você já investiu no mercado ou seria o seu primeiro?",
    inputType: 'options' as const,
    options: ['Sim, sou investidor', 'Não, esse seria o meu primeiro']
  },
  {
    id: 4,
    key: 'tipo_imovel',
    getMessage: () => "O seu interesse seria em imóveis Lançamento ou Pronto?",
    inputType: 'options' as const,
    options: ['Lançamento', 'Pronto']
  },
  {
    id: 5,
    key: 'budget',
    getMessage: () => "Qual Budget você está buscando investir?",
    inputType: 'options' as const,
    options: ['De R$ 350mil a R$ 400mil', 'De R$ 450 a R$ 550mil', 'De R$ 650mil +']
  },
  {
    id: 6,
    key: 'final',
    getMessage: () => "Perfeito! Selecionei algumas oportunidades exclusivas para o seu perfil. Clique abaixo para falar agora com nosso gerente:",
    inputType: 'link' as const,
    linkText: "Agendar agora reunião com o gerente",
    // O link será gerado dinamicamente usando o WHATSAPP_NUMBER no App.tsx
  }
] as const;