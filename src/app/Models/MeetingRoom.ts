// src/app/Models/MeetingRoom.ts
export interface MeetingRoom {
  id: number;
  name: string;
  description: string;
  status: 'live' | 'idle' | 'full';
  participants: number;
  maxParticipants: number;
  host: string;
  duration: string;
  participantsList: string[];
  createdAt?: Date;
  topic?: string;
}

export interface CreateRoomRequest {
  name: string;
  description: string;
  maxParticipants: number;
  topic?: string;
  isPrivate?: boolean;
}

export interface JoinRoomRequest {
  roomId: number;
  participantName: string;
  isHost?: boolean;
}