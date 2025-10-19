export interface Room {
  // Propriétés de l'API LiveKit
  sid: string;
  name: string;
  empty_timeout: number;
  departure_timeout: number;
  max_participants: number;
  creation_time: number;
  turn_password: string;
  enabled_codecs: any[];
  metadata: string;
  num_participants: number;
  num_publishers: number;
  active_recording: boolean;
  version: number;
  
  // Propriétés optionnelles pour votre app
  description?: string;
  topic?: string;
  host?: string;
  participantsList?: string[];
  isPrivate?: boolean;
  duration?: string;
  
  // Alias pour compatibilité (optionnel)
  id?: string;           // alias de sid
  room_name?: string;    // alias de name
  maxParticipants?: number; // alias de max_participants
  participants?: number; // alias de num_participants
  status?: string;       // à calculer
}