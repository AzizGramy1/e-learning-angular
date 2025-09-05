import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../Authentification/authentification.service';
import { InstructionDevoir } from 'src/app/Models/InstructionDevoir';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstructionServiceService {

private apiUrl = 'http://127.0.0.1:8000/api/instructions';

  constructor(
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<InstructionDevoir[]> {
    return this.http.get<InstructionDevoir[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<InstructionDevoir> {
    return this.http.get<InstructionDevoir>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getByName(title: string): Observable<InstructionDevoir> {
    return this.http.get<InstructionDevoir>(`${this.apiUrl}/name/${title}`, { headers: this.getHeaders() });
  }

  create(instruction: InstructionDevoir): Observable<InstructionDevoir> {
    return this.http.post<InstructionDevoir>(this.apiUrl, instruction, { headers: this.getHeaders() });
  }

  update(id: number, instruction: InstructionDevoir): Observable<InstructionDevoir> {
    return this.http.put<InstructionDevoir>(`${this.apiUrl}/${id}`, instruction, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // 🔹 récupérer toutes les instructions d’un devoir
  getByDevoir(devoirId: number): Observable<InstructionDevoir[]> {
    return this.http.get<InstructionDevoir[]>(`http://127.0.0.1:8000/api/devoirs/${devoirId}/instructions`, { 
      headers: this.getHeaders() 
    });
  }  
}
