import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Search, Paperclip, Smile, Mic, Send, Phone, Video, ExternalLink } from 'lucide-react';
import { Contact, Message, InputMode } from '../types';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => void;
  inputMode: InputMode;
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage, inputMode, isTyping }) => {
  const [inputText, setInputText] = useState('');
  // Local state to block double clicks
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Whenever inputMode changes, we allow interaction again
    setIsProcessing(false);
  }, [messages, isTyping, inputMode]);

  const handleSendText = () => {
    if (inputText.trim() && !isProcessing) {
      setIsProcessing(true); // Block immediately
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleOptionClick = (option: string) => {
    if (!isProcessing) {
      setIsProcessing(true); // Block double clicks
      onSendMessage(option);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendText();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efe7dd]">
      {/* Header - Altura aumentada e paddings ajustados */}
      <div className="bg-[#f0f2f5] min-h-[70px] px-3 py-2 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar maior e com flex-shrink para não amassar */}
          <div className="w-12 h-12 rounded-full overflow-hidden cursor-pointer flex-shrink-0 border border-gray-200">
            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center cursor-pointer min-w-0">
            {/* Nome com fonte maior e truncate para não quebrar layout */}
            <span className="text-[#111b21] text-[19px] leading-tight font-medium truncate block">
              {contact.name}
            </span>
            <span className="text-[#667781] text-[14px] mt-0.5 block truncate">
              {isTyping ? <span className="text-[#00a884] font-medium">digitando...</span> : 'online'}
            </span>
          </div>
        </div>
        
        {/* Ícones da direita - Ajuste de gap para mobile */}
        <div className="flex items-center gap-4 sm:gap-5 text-[#00a884] sm:text-[#54656f] pl-2 flex-shrink-0">
            <div className="hidden sm:flex gap-6">
                <Video size={22} className="cursor-pointer" />
                <Phone size={22} className="cursor-pointer" />
            </div>
            <div className="h-6 w-[1px] bg-gray-300 hidden sm:block"></div>
            {/* Em mobile, mostramos menos ícones para dar espaço ao nome */}
            <div className="flex gap-4">
               <Video size={24} className="cursor-pointer sm:hidden text-[#111b21]" />
               <Phone size={22} className="cursor-pointer sm:hidden text-[#111b21]" />
               <MoreVertical size={22} className="cursor-pointer text-[#111b21]" />
            </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto whatsapp-bg p-3 sm:px-9 relative">
        <div className="bg-[#ffeecd] text-[13px] text-[#54656f] text-center p-2 rounded-lg mb-5 shadow-sm w-[90%] mx-auto select-none mt-2">
          🔒 As mensagens são protegidas com a criptografia de ponta a ponta.
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
             <div className="flex w-full mb-1 justify-start">
                 <div className="bg-white rounded-lg rounded-tl-none px-4 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-2 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 flex-shrink-0 min-h-[62px] z-20 pb-safe">
        
        {/* Dynamic Input Content based on inputMode */}
        {inputMode.type === 'text' && (
          <>
            <div className="hidden sm:flex gap-4 text-[#54656f]">
              <Smile size={26} className="cursor-pointer hover:text-gray-600" />
              <Paperclip size={26} className="cursor-pointer hover:text-gray-600" />
            </div>
            {/* Botão + do iOS no mobile */}
            <div className="sm:hidden text-[#007aff] px-1">
               <span className="text-3xl leading-none font-light">+</span>
            </div>

            <div className="flex-1 bg-white rounded-2xl sm:rounded-lg px-4 py-2.5 flex items-center border border-transparent focus-within:border-gray-300">
              <input
                type="text"
                className="w-full outline-none text-[16px] placeholder:text-[#667781]"
                placeholder="Digite seu nome..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={isProcessing}
              />
            </div>
            <div className="text-[#54656f] flex items-center justify-center min-w-[40px]">
              {inputText.trim() ? (
                  <button onClick={handleSendText} disabled={isProcessing} className="bg-[#00a884] rounded-full p-2.5 text-white hover:bg-[#008f6f] transition-colors disabled:opacity-50 shadow-sm">
                      <Send size={18} className="ml-0.5" />
                  </button>
              ) : (
                  <div className="p-2">
                    <Mic size={26} className="cursor-pointer text-[#54656f]" />
                  </div>
              )}
            </div>
          </>
        )}

        {inputMode.type === 'options' && (
          <div className="w-full flex flex-col gap-2 justify-center items-center py-2 px-1">
            {inputMode.options.map((option, idx) => (
               <button
                 key={idx}
                 onClick={() => handleOptionClick(option)}
                 disabled={isProcessing}
                 className="bg-white hover:bg-[#d9fdd3] text-[#00a884] font-medium text-[16px] py-3.5 px-6 rounded-xl shadow-sm border border-gray-200 transition-all active:scale-95 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
               >
                 {option}
               </button>
            ))}
          </div>
        )}

        {inputMode.type === 'link' && (
          <div className="w-full flex justify-center py-2 px-2">
            <a 
              href={inputMode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:bg-[#1caa55] text-white font-bold text-[16px] py-4 px-8 rounded-full shadow-md flex items-center justify-center w-full sm:w-auto gap-2 transition-all active:scale-95 animate-pulse"
            >
              {inputMode.text}
              <ExternalLink size={22} />
            </a>
          </div>
        )}
        
        {inputMode.type === 'disabled' && (
             <div className="w-full text-center text-gray-500 italic text-[15px] py-2">
                Theodoro está digitando...
             </div>
        )}

      </div>
    </div>
  );
};

export default ChatWindow;
