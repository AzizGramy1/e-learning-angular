import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { HttpHeaders } from '@angular/common/http';

export interface Abonnement {
  id: number;
  user_id: number;
  course_id: number;
  type_abonnement: 'mensuel' | 'annuel' | 'ponctuel';
  statut: 'actif' | 'en_attente' | 'expire' | 'annule' | 'echec' | 'suspendu';
  montant: number;
  date_debut: string;
  date_fin: string;
  jours_restants?: number;
  est_actif?: boolean;
  est_recurrent?: boolean;
  course?: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    instructor_name: string;
  };
}

export interface FiltresAbonnement {
  statut?: string;
  type?: string;
  course_id?: number;
  date_debut?: string;
  date_fin?: string;
  per_page?: number;
  page?: number;
}

export interface DonneesRenouvellement {
  donnees_carte?: {
    numero: string;
    expiration: string;
    cvv: string;
    nom: string;
  };
  type_paiement: 'carte_bancaire' | 'virement_bancaire' | 'mobile_money';
  coupon_code?: string;
}

export interface DonneesAnnulation {
  raison: string;
  demande_remboursement: boolean;
  raison_remboursement?: string;
}

export interface DonneesUpgrade {
  nouveau_type: 'mensuel' | 'annuel';
  donnees_carte?: {
    numero: string;
    expiration: string;
    cvv: string;
    nom: string;
  };
  type_paiement: 'carte_bancaire' | 'virement_bancaire' | 'mobile_money';
  coupon_code?: string;
}

// Ajoutez ces interfaces
export interface DonneesSimulationPaiement {
  course_id: number;
  type_abonnement: 'mensuel' | 'annuel' | 'ponctuel';
  donnees_carte: {
    numero: string;
    expiration: string;
    cvv: string;
    nom: string;
  };
  coupon_code?: string;
}

export interface DonneesCreationLienPaiement {
  course_id: number;
  type_abonnement: 'ponctuel' | 'mensuel' | 'annuel';
  email: string;
  montant_personnalise?: number;
  date_expiration?: string;
  message_personnalise?: string;
}

export interface PaiementResponse {
  success: boolean;
  message: string;
  data?: {
    paiement: any;
    abonnement: any;
    facture: any;
    acces_immediat: boolean;
    simulation: {
      transaction_id: string;
      mode: string;
    };
  };
  errors?: any;
}

export interface LienPaiementResponse {
  success: boolean;
  message: string;
  data?: {
    lien_paiement: string;
    token: string;
    date_expiration: string;
    montant: number;
  };
}


@Injectable({
  providedIn: 'root'
})
export class AbonnementService {

  private apiUrl = 'http://127.0.0.1:8000/api/abonnements';
  private paiementApiUrl = 'http://127.0.0.1:8000/api/paiements';

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // ==================== FONCTIONS UTILISATEUR ====================

  /**
   * Dashboard des abonnements
   */
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers: this.getAuthHeaders() });
  }

  /**
   * Liste de tous les abonnements de l'utilisateur
   */
  getAbonnements(filtres?: FiltresAbonnement): Observable<any> {
    let params = new HttpParams();
    
    if (filtres) {
      Object.keys(filtres).forEach(key => {
        const value = filtres[key as keyof FiltresAbonnement];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params, headers: this.getAuthHeaders() });
  }

  /**
   * Mes abonnements actifs
   */
  getAbonnementsActifs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/actifs`, { headers: this.getAuthHeaders() });
  }

  /**
   * Détails d'un abonnement spécifique
   */
  getAbonnement(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Renouveler un abonnement
   */
  renouvelerAbonnement(id: number, donnees: DonneesRenouvellement): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/renouveler`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Annuler un abonnement
   */
  annulerAbonnement(id: number, donnees: DonneesAnnulation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/annuler`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Upgrader un abonnement
   */
  upgraderAbonnement(id: number, donnees: DonneesUpgrade): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/upgrader`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Vérifier l'accès à un cours
   */
  verifierAccesCours(courseId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cours/${courseId}/acces`, { headers: this.getAuthHeaders() });
  }

  // ==================== FONCTIONS ADMIN ====================

  /**
   * Liste tous les abonnements (admin)
   */
  getAbonnementsAdmin(filtres?: any): Observable<any> {
    let params = new HttpParams();
    
    if (filtres) {
      Object.keys(filtres).forEach(key => {
        const value = filtres[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(`${this.apiUrl}/admin`, { params, headers: this.getAuthHeaders() });
  }

  /**
   * Statistiques globales des abonnements (admin)
   */
  getStatistiquesAdmin(periode?: string, dateDebut?: string, dateFin?: string): Observable<any> {
    let params = new HttpParams();
    
    if (periode) params = params.set('periode', periode);
    if (dateDebut) params = params.set('date_debut', dateDebut);
    if (dateFin) params = params.set('date_fin', dateFin);

    return this.http.get<any>(`${this.apiUrl}/admin/statistiques`, { params, headers: this.getAuthHeaders() });
  }

  /**
   * Forcer la modification d'un abonnement (admin)
   */
  modifierAbonnementAdmin(id: number, modifications: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/${id}`, modifications, { headers: this.getAuthHeaders() });
  }

  /**
   * Forcer l'expiration d'un abonnement (admin)
   */
  forcerExpirationAdmin(id: number, raison: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/${id}/expirer`, { raison }, { headers: this.getAuthHeaders() });
  }

  /**
   * Exporter les abonnements (admin)
   */
  exporterAbonnementsAdmin(format: string = 'csv', filtres?: any): Observable<any> {
    let params = new HttpParams().set('format', format);
    
    if (filtres) {
      Object.keys(filtres).forEach(key => {
        const value = filtres[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(`${this.apiUrl}/admin/export`, { 
      params,
      headers: this.getAuthHeaders(),
      responseType: 'blob' as 'json'
    });
  }

  /**
   * Créer un nouvel abonnement via simulation de paiement
   */
  simulerPaiementNouvelAbonnement(donnees: DonneesSimulationPaiement): Observable<PaiementResponse> {
    return this.http.post<PaiementResponse>(`${this.paiementApiUrl}/simuler-carte`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Créer un lien de paiement
   */
  creerLienPaiement(donnees: DonneesCreationLienPaiement): Observable<LienPaiementResponse> {
    return this.http.post<LienPaiementResponse>(`${this.paiementApiUrl}/creer-lien`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Vérifier l'état d'un lien de paiement
   */
  verifierLienPaiement(token: string): Observable<any> {
    return this.http.get<any>(`${this.paiementApiUrl}/lien/${token}`, { headers: this.getAuthHeaders() });
  }

  /**
   * Payer via un lien de paiement
   */
  payerViaLien(token: string, donnees: any): Observable<any> {
    return this.http.post<any>(`${this.paiementApiUrl}/lien/${token}/payer`, donnees, { headers: this.getAuthHeaders() });
  }

  /**
   * Obtenir l'historique des paiements
   */
  getHistoriquePaiements(filtres?: any): Observable<any> {
    let params = new HttpParams();
    
    if (filtres) {
      Object.keys(filtres).forEach(key => {
        const value = filtres[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(`${this.paiementApiUrl}/historique`, { params, headers: this.getAuthHeaders() });
  }

  /**
   * Obtenir le tableau de bord des paiements
   */
  getDashboardPaiements(filtres?: any): Observable<any> {
    let params = new HttpParams();
    
    if (filtres) {
      Object.keys(filtres).forEach(key => {
        const value = filtres[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<any>(`${this.paiementApiUrl}/dashboard`, { params, headers: this.getAuthHeaders() });
  }
}