export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'audio';
  audioUrl?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export type InputMode = 
  | { type: 'text' }
  | { type: 'options'; options: string[] | readonly string[] }
  | { type: 'link'; text: string; url: string; }
  | { type: 'disabled' };