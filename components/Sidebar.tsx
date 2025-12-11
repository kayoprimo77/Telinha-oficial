import React from 'react';
import { Search, MessageSquarePlus, MoreVertical, Users, CircleDashed } from 'lucide-react';
import { Contact } from '../types';

interface SidebarProps {
  contacts: Contact[];
  activeContactId: string | null;
  onSelectContact: (id: string) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ contacts, activeContactId, onSelectContact, className }) => {
  return (
    <div className={`flex flex-col border-r border-gray-200 h-full bg-white ${className}`}>
      {/* Header */}
      <div className="bg-[#f0f2f5] px-4 py-2.5 flex justify-between items-center h-[60px] flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
           <img src="https://picsum.photos/id/1005/200/200" alt="My Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-5 text-[#54656f]">
          <Users size={20} className="cursor-pointer" />
          <CircleDashed size={20} className="cursor-pointer" />
          <MessageSquarePlus size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 border-b border-gray-100">
        <div className="bg-[#f0f2f5] rounded-lg px-3 py-1.5 flex items-center gap-3">
          <Search size={18} className="text-[#54656f]" />
          <input 
            type="text" 
            placeholder="Pesquisar ou começar uma nova conversa" 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#54656f]"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-gray-100 hover:bg-[#f5f6f6] ${activeContactId === contact.id ? 'bg-[#f0f2f5]' : ''}`}
          >
            <div className="relative">
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="w-12 h-12 rounded-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-baseline mb-0.5">
                <span className="text-[#111b21] font-normal text-[17px] truncate">{contact.name}</span>
                <span className={`text-xs ${contact.unreadCount > 0 ? 'text-[#00a884] font-medium' : 'text-[#667781]'}`}>
                  {contact.lastMessageTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667781] text-[14px] truncate block max-w-[90%]">
                  {contact.lastMessage}
                </span>
                {contact.unreadCount > 0 && (
                  <span className="bg-[#25d366] text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Footer info */}
        <div className="p-8 text-center text-xs text-gray-400 flex flex-col items-center gap-2">
            <p>Sua mensagem pessoal é protegida com criptografia de ponta a ponta.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;