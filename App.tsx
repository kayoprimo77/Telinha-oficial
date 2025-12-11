import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import { Message, InputMode } from './types';
import { THEODORO_CONTACT, FUNNEL_SCRIPT, WHATSAPP_NUMBER } from './constants';
import { sendLeadToWaseller } from './services/wasellerService';
import { initMetaPixel, trackPageView, trackQualifiedLead, trackCustomEvent } from './services/pixelService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>({ type: 'disabled' });
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Helper to format current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  };

  // Initialize Chat & Pixel
  useEffect(() => {
    // Inicia o Pixel
    initMetaPixel();
    trackPageView();
    
    // Inicia o Funil
    startFunnel();
  }, []);

  const startFunnel = async () => {
    setIsTyping(true);
    setInputMode({ type: 'disabled' });
    
    // Initial delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const firstStep = FUNNEL_SCRIPT[0];
    const hasAudio = 'audioUrl' in firstStep;
    
    const initialMessage: Message = {
      id: 'init-1',
      text: firstStep.getMessage(),
      sender: 'them',
      timestamp: getCurrentTime(),
      status: 'read',
      type: hasAudio ? 'audio' : 'text',
      // @ts-ignore
      audioUrl: hasAudio ? firstStep.audioUrl : undefined
    };

    setMessages([initialMessage]);
    setIsTyping(false);
    setInputMode({ type: 'text' });
  };

  const handleUserResponse = async (response: string) => {
    // 1. Capture Answer
    const currentStep = FUNNEL_SCRIPT[stepIndex];
    const updatedAnswers = { ...answers, [currentStep.key]: response };
    setAnswers(updatedAnswers);

    // Track button click interaction (Custom Event for funnel progression)
    trackCustomEvent('FunnelInteraction', {
      step: currentStep.key,
      response: response
    });

    // 2. Add user message to chat
    const userMsg: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'me',
      timestamp: getCurrentTime(),
      status: 'read'
    };
    setMessages(prev => [...prev, userMsg]);

    // 3. Prepare for next step
    const nextStepIdx = stepIndex + 1;
    
    if (nextStepIdx < FUNNEL_SCRIPT.length) {
      setIsTyping(true);
      setInputMode({ type: 'disabled' });

      // Random delay for realism
      const delay = 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      const nextStep = FUNNEL_SCRIPT[nextStepIdx];
      
      // Determine message text (inject name if needed from updatedAnswers)
      let nextText = '';
      if (nextStepIdx === 1) { // Step 2 (index 1) uses name
         // @ts-ignore
         nextText = nextStep.getMessage(updatedAnswers['nome']); 
      } else {
         // @ts-ignore
         nextText = nextStep.getMessage();
      }
      
      const hasAudio = 'audioUrl' in nextStep;

      const systemMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: nextText,
        sender: 'them',
        timestamp: getCurrentTime(),
        status: 'read',
        type: hasAudio ? 'audio' : 'text',
        // @ts-ignore
        audioUrl: hasAudio ? nextStep.audioUrl : undefined
      };

      setMessages(prev => [...prev, systemMsg]);
      setStepIndex(nextStepIdx);
      setIsTyping(false);

      // Set input mode for the new step
      if (nextStep.inputType === 'options') {
        setInputMode({ type: 'options', options: nextStep.options || [] });
      } else if (nextStep.inputType === 'link') {
        // --- FINAL STEP LOGIC ---
        
        // 1. Send data to CRM (Waseller) in background
        sendLeadToWaseller(updatedAnswers as any);

        // 2. DISPARAR PIXEL DE LEAD QUALIFICADO (SOMENTE AQUI NO FINAL)
        // Isso garante que apenas quem viu o botão final é marcado
        trackQualifiedLead({
          name: updatedAnswers['nome'],
          custom_data: {
            objetivo: updatedAnswers['objetivo'],
            budget: updatedAnswers['budget']
          }
        });

        // 3. Generate Dynamic WhatsApp Link with Data
        
        const textMessage = `Olá, vim pelo Chat do Site! Gostaria de agendar uma reunião.\n\n*Meus Dados:*\n👤 Nome: ${updatedAnswers['nome']}\n🏠 Objetivo: ${updatedAnswers['objetivo']}\n📈 Investidor: ${updatedAnswers['experiencia']}\n🏢 Tipo: ${updatedAnswers['tipo_imovel']}\n💰 Budget: ${updatedAnswers['budget']}`;
        
        const encodedText = encodeURIComponent(textMessage);
        
        // Sanitize phone number: remove anything that isn't a digit
        const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, '');
        
        // Use full api link which is often more reliable for pre-filled text than short links
        const finalUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;

        console.log("Generated WhatsApp Link:", finalUrl);

        setInputMode({ 
            type: 'link', 
            text: nextStep.linkText || 'Click here', 
            url: finalUrl 
        });
      } else {
        setInputMode({ type: 'text' });
      }

    } else {
      // End of funnel
      setInputMode({ type: 'disabled' });
    }
  };

  return (
    // Usa 100dvh para lidar melhor com barras de navegador mobile
    <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden bg-white xl:bg-[#d1d7db] xl:px-8 xl:py-5">
      {/* Container Principal: Em mobile ocupa 100%, em desktop tem sombra e tamanho fixo */}
      <div className="w-full h-full flex bg-white shadow-none xl:shadow-lg overflow-hidden xl:rounded-lg xl:max-w-[1200px] xl:mx-auto">
        <div className="flex-1 bg-[#222e35] relative w-full h-full">
            <ChatWindow 
              contact={THEODORO_CONTACT}
              messages={messages}
              onSendMessage={handleUserResponse}
              inputMode={inputMode}
              isTyping={isTyping}
            />
        </div>
      </div>
      {/* Faixa verde de fundo apenas no desktop */}
      <div className="absolute top-0 left-0 w-full h-[127px] bg-[#00a884] -z-10 hidden xl:block"></div>
    </div>
  );
};

export default App;
