import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


export interface User {
  id?: number;
  nom: string;
  email: string;
  role: string;
  password?: string;
  avatar_url?: string;
  adresse?: string;
  niveau?: string;
  telephone?: string;
  date_naissance?: string;
  langues?: string[];
  progression?: number;
  heures?: number;
  skills?: string[];
  badges?: string[];
  social_links?: { icon: string; link: string }[];
  activities?: { icon: string; description: string; time: string }[];
  education?: { degree: string; institution: string; year: string }[];
  experience?: { role: string; company: string; period: string }[];
  goals?: { name: string; progress: number; color: string; progressBarClass: string }[];
  created_at?: string;
  updated_at?: string;
}


// Interface séparée pour les données de mise à jour avec fichier
export interface UserUpdateData extends Omit<Partial<User>, 'avatar_url'> {
  avatar?: File;
}

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

   private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  checkEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/check-email`, { email });
  }



  // Récupérer le profil utilisateur (si besoin)
  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/auth/me`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  
  // Helper pour convertir un tableau en string
  private arrayToString(array: any[]): string {
    return array.join(',');
  }

  // Mettre à jour le profil utilisateur
  // Mettre à jour le profil utilisateur - CORRIGÉ
  updateProfile(userData: UserUpdateData): Observable<any> {
    const token = this.getToken();
    
    // Créer FormData pour gérer les fichiers et données
    const formData = new FormData();

    // Ajouter les champs de base
    if (userData.nom) formData.append('nom', userData.nom);
    if (userData.email) formData.append('email', userData.email);
    if (userData.telephone) formData.append('telephone', userData.telephone);
    if (userData.date_naissance) formData.append('date_naissance', userData.date_naissance);
    if (userData.adresse) formData.append('adresse', userData.adresse);
    if (userData.niveau) formData.append('niveau', userData.niveau);

    // Gérer les tableaux
    if (userData.langues) {
      formData.append('langues', this.arrayToString(userData.langues));
    }
    if (userData.skills) {
      formData.append('skills', JSON.stringify(userData.skills));
    }
    if (userData.education) {
      formData.append('education', JSON.stringify(userData.education));
    }
    if (userData.experience) {
      formData.append('experience', JSON.stringify(userData.experience));
    }
    if (userData.goals) {
      formData.append('goals', JSON.stringify(userData.goals));
    }

    // Gérer l'avatar - CORRECTION ICI
    if (userData.avatar) {
      formData.append('avatar', userData.avatar, userData.avatar.name);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/update-profile`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Upload d'avatar séparé
  uploadAvatar(avatarFile: File): Observable<any> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('avatar', avatarFile, avatarFile.name);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/update-profile`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Changer le mot de passe
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const passwordData = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword
    };

    return this.http.post(`${this.apiUrl}/change-password`, passwordData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer le token
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Gestion des erreurs
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Non authentifié. Veuillez vous reconnecter.';
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée.';
      } else if (error.status === 422) {
        errorMessage = 'Données invalides.';
        if (error.error.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      } else if (error.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }
}
