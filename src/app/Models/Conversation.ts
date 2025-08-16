export interface Conversation {
  id: number;
  name: string;
  image?: string;
  initials?: string;
  online: boolean;
  lastMessage: string;
  time: string;
  unreadCount?: number;
}