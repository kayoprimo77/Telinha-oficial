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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, inputMode]);

  const handleSendText = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendText();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efe7dd]">
      {/* Header */}
      <div className="bg-[#f0f2f5] h-[60px] px-4 py-2 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col cursor-pointer">
            <span className="text-[#111b21] text-[16px] leading-tight font-normal">{contact.name}</span>
            <span className="text-[#667781] text-[13px]">
              {isTyping ? <span className="text-[#00a884] font-medium">digitando...</span> : 'online'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-[#54656f]">
            <div className="hidden sm:flex gap-6">
                <Video size={20} className="cursor-pointer" />
                <Phone size={20} className="cursor-pointer" />
            </div>
            <div className="h-6 w-[1px] bg-gray-300 hidden sm:block"></div>
            <Search size={20} className="cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto whatsapp-bg p-4 sm:px-9 relative">
        <div className="bg-[#ffeecd] text-[12.5px] text-[#54656f] text-center p-1.5 rounded-lg mb-4 shadow-sm w-fit mx-auto select-none">
          🔒 As mensagens são protegidas com a criptografia de ponta a ponta.
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
             <div className="flex w-full mb-1 justify-start">
                 <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-3 flex-shrink-0 min-h-[62px] z-20">
        
        {/* Dynamic Input Content based on inputMode */}
        {inputMode.type === 'text' && (
          <>
            <div className="flex gap-4 text-[#54656f]">
              <Smile size={24} className="cursor-pointer hover:text-gray-600" />
              <Paperclip size={24} className="cursor-pointer hover:text-gray-600" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center">
              <input
                type="text"
                className="w-full outline-none text-[15px] placeholder:text-[#667781]"
                placeholder="Digite seu nome..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <div className="text-[#54656f] flex items-center justify-center">
              {inputText.trim() ? (
                  <button onClick={handleSendText} className="text-[#54656f] hover:text-[#00a884] transition-colors">
                      <Send size={24} />
                  </button>
              ) : (
                  <Mic size={24} className="cursor-pointer hover:text-gray-600" />
              )}
            </div>
          </>
        )}

        {inputMode.type === 'options' && (
          <div className="w-full flex flex-col sm:flex-row gap-2 justify-center items-center py-2">
            {inputMode.options.map((option, idx) => (
               <button
                 key={idx}
                 onClick={() => onSendMessage(option)}
                 className="bg-white hover:bg-[#d9fdd3] text-[#00a884] font-medium py-3 px-6 rounded-full shadow-sm border border-gray-200 transition-all active:scale-95 w-full sm:w-auto"
               >
                 {option}
               </button>
            ))}
          </div>
        )}

        {inputMode.type === 'link' && (
          <div className="w-full flex justify-center py-2">
            <a 
              href={inputMode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25d366] hover:bg-[#1caa55] text-white font-bold py-3 px-8 rounded-full shadow-md flex items-center gap-2 transition-all active:scale-95 animate-pulse"
            >
              {inputMode.text}
              <ExternalLink size={20} />
            </a>
          </div>
        )}
        
        {inputMode.type === 'disabled' && (
             <div className="w-full text-center text-gray-500 italic text-sm">
                Theodoro está digitando...
             </div>
        )}

      </div>
    </div>
  );
};

export default ChatWindow;