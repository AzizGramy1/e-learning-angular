import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificat } from 'src/app/Models/Certificat';
import { AuthentificationService } from '../Authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {

private apiUrl = 'http://127.0.0.1:8000/api/certificats';

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService // ✅ injection du service auth
  ) {}

  /** 🔹 Récupérer tous les certificats */
  getAllCertificats(): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(this.apiUrl, {
      headers: this.authService['getAuthHeaders']()
    });
  }

  /** 🔹 Créer un certificat */
  createCertificat(certificat: Certificat): Observable<any> {
    return this.http.post(this.apiUrl, certificat, {
      headers: this.authService['getAuthHeaders']()
    });
  }

  /** 🔹 Récupérer un certificat par ID */
  getCertificatById(id: number): Observable<Certificat> {
    return this.http.get<Certificat>(`${this.apiUrl}/${id}`, {
      headers: this.authService['getAuthHeaders']()
    });
  }

  /** 🔹 Mettre à jour un certificat */
  updateCertificat(id: number, certificat: Certificat): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, certificat, {
      headers: this.authService['getAuthHeaders']()
    });
  }

  /** 🔹 Supprimer un certificat */
  deleteCertificat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.authService['getAuthHeaders']()
    });
  }



/** 🔹 Récupérer les certificats de l’utilisateur connecté */
getMyCertificats(): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // ✅ corrige l’URL → pas besoin du /certificats
  return this.http.get<any>('http://127.0.0.1:8000/api/certificats', { headers });
}

/** 🔹 Télécharger un certificat en PDF */
downloadCertificat(id: number): Observable<Blob> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  // ✅ corrige l’URL → retire le double certificats
  return this.http.get(`http://127.0.0.1:8000/api/certificats/${id}/download`, {
    headers,
    responseType: 'blob'
  });
}

}
