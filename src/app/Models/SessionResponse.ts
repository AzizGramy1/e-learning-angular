export interface SessionResponse {
    id: string;                    // "session-68d80796dcb1d"
    object?: string;               // "session"
    sessionId?: string;            // Alternative à id
    status?: string;               // "active"
    createdAt?: number;
    // ... autres propriétés que retourne Laravel
}