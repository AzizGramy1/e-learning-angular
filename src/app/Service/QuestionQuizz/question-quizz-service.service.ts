import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionQuizz } from 'src/app/Models/QuestionQuizz';
import { AuthentificationService } from '../Authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionQuizzServiceService {

  private apiUrl = 'http://localhost:8000/api'; // ✅ racine API

  constructor(private http: HttpClient, private authService: AuthentificationService) {}

  // Récupérer toutes les questions d’un quiz
  getAllQuestions(quizId: number): Observable<QuestionQuizz[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<QuestionQuizz[]>(`${this.apiUrl}/quizzes/${quizId}/questions`, { headers });
  }

  // Récupérer une question par ID
  getQuestion(quizId: number, questionId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}`, { headers });
  }

  // Créer une nouvelle question
  createQuestion(quizId: number, data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/questions`, data, { headers });
  }

  // Mettre à jour une question
  updateQuestion(quizId: number, questionId: number, data: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}`, data, { headers });
  }

  // Supprimer une question
  deleteQuestion(quizId: number, questionId: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}`, { headers });
  }

  // Vérifier la réponse de l’utilisateur
  checkAnswer(quizId: number, questionId: number, reponse: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/quizzes/${quizId}/questions/${questionId}/check`, { reponse }, { headers });
  }
}
