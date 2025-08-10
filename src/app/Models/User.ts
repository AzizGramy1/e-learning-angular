export interface User {
  id?: number;        // facultatif, souvent assigné par le backend
  nom: string;
  email: string;
  role: string;
  password?: string;  // optionnel, utilisé uniquement à la création ou modification
}