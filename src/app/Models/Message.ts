export interface Message {
  id: number;
  text: string;
  isSent: boolean;
  time: string;
  read?: boolean;
  isTyping?: boolean;
  attachment?: { name: string; type: string; size: string };
}