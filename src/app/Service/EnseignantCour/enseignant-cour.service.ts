import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Course } from 'src/app/Models/Course';
import { User } from '../Inscription/inscription.service';
import { AuthentificationService } from '../Authentification/authentification.service';










export interface Teacher extends User {
  part_revenus?: number;
  date_association?: string;
  course_role?: 'formateur' | 'assistant' | 'co_formateur';
}

export interface CourseTeachersResponse {
  total_enseignants: number;
  enseignants: Teacher[];
  part_revenus_totale: number;
}

export interface AddTeacherData {
  teacher_id: number;
  role: string;
  part_revenus: number;
}

export interface UpdateRoleData {
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class EnseignantCourService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient,
        private authService: AuthentificationService // Injection du service d'auth

  ) {}

    // Méthode privée pour obtenir les headers avec authentification
  private getAuthHeaders(): HttpHeaders {
    // Utiliser le service d'authentification pour récupérer le token
    const token = this.authService.getToken();
    console.log('🔐 Token récupéré via AuthService:', token ? 'Présent' : 'Absent');
    
    if (!token) {
      console.error('❌ Aucun token trouvé via AuthService');
      // Optionnel: Rediriger vers la page de login
      // this.router.navigate(['/login']);
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

 // 📌 CORRIGÉ : Récupérer un cours par ID avec gestion d'erreur améliorée
  getCourse(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/courses/${id}`;
    
    console.log('📡 Requête GET cours ID:', id);
    console.log('🔐 URL:', url);
    
    return this.http.get(url, { headers }).pipe(
      map(response => {
        console.log('✅ Réponse API reçue:', response);
        return response;
      }),
      catchError(error => this.handleError(error))
    );
  }


  // === GESTION DES COURS ===

  getCourses(): Observable<Course[]> {
    return this.http.get<{data: Course[]}>(`${this.apiUrl}/courses`).pipe(
      map(response => response.data)
    );
  }

 

  // Dans enseignant-cour.service.ts

// Remplacer PATCH par PUT
updateCoursePartial(courseId: number, updates: any): Observable<any> {
  const headers = this.getAuthHeaders();
  const apiData = this.mapToApiFormat(updates);

  console.log('📤 Mise à jour partielle (PUT):', apiData);

  return this.http.put<any>(
    `${this.apiUrl}/courses/${courseId}`, 
    apiData,
    { headers }
  ).pipe(
    map(response => {
      console.log('✅ Mise à jour partielle réussie:', response);
      return response;
    }),
    catchError(error => this.handleError(error))
  );
}

 

  deleteCourse(courseId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/courses/${courseId}`);
  }

  // === GESTION DES ENSEIGNANTS ===

  getCourseTeachers(courseId: number): Observable<CourseTeachersResponse> {
    return this.http.get<{data: CourseTeachersResponse}>(`${this.apiUrl}/courses/${courseId}/teachers`).pipe(
      map(response => response.data)
    );
  }

  addTeacherToCourse(courseId: number, teacherData: AddTeacherData): Observable<{message: string; teacher: Teacher}> {
    return this.http.post<{message: string; data: {teacher: Teacher}}>(
      `${this.apiUrl}/courses/${courseId}/teachers`, 
      teacherData
    ).pipe(
      map(response => ({
        message: response.message,
        teacher: response.data.teacher
      }))
    );
  }

  updateTeacherRole(courseId: number, teacherId: number, roleData: UpdateRoleData): Observable<{message: string; nouveau_role: string}> {
    return this.http.put<{message: string; data: {role: string}}>(
      `${this.apiUrl}/courses/${courseId}/teachers/${teacherId}`, 
      roleData
    ).pipe(
      map(response => ({
        message: response.message,
        nouveau_role: response.data.role
      }))
    );
  }

  removeTeacherFromCourse(courseId: number, teacherId: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/courses/${courseId}/teachers/${teacherId}`);
  }

  // === STATISTIQUES ENSEIGNANT ===

  getTeacherStats(teacherId: number): Observable<{
    total_courses: number;
    total_students: number;
    total_revenue: number;
    average_rating: number;
    recent_courses: Course[];
    monthly_stats: { month: string; revenue: number; students: number }[];
  }> {
    return this.http.get<{data: any}>(`${this.apiUrl}/teachers/${teacherId}/stats`).pipe(
      map(response => response.data)
    );
  }

  getTeacherCourses(teacherId: number): Observable<Course[]> {
    return this.http.get<{data: Course[]}>(`${this.apiUrl}/teachers/${teacherId}/courses`).pipe(
      map(response => response.data)
    );
  }

  // === RECHERCHE ET FILTRES ===

  searchCourses(params: {
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Observable<{data: Course[]; total: number; current_page: number}> {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<{data: Course[]; total: number; current_page: number}>(
      `${this.apiUrl}/courses/search`,
      { params: httpParams }
    );
  }

  getCourseCategories(): Observable<string[]> {
    return this.http.get<{data: string[]}>(`${this.apiUrl}/courses/categories`).pipe(
      map(response => response.data)
    );
  }

  // === PROGRESSION ÉTUDIANT ===

  updateCourseProgress(courseId: number, progressData: {
    hoursCompleted: number;
    chaptersCompleted: number;
    progress: number;
  }): Observable<{message: string; progress: number}> {
    return this.http.put<{message: string; data: {progress: number}}>(
      `${this.apiUrl}/courses/${courseId}/progress`,
      progressData
    ).pipe(
      map(response => ({
        message: response.message,
        progress: response.data.progress
      }))
    );
  }

  // === GESTION DES FAVORIS ===

  toggleCourseFavorite(courseId: number): Observable<{is_favorite: boolean}> {
    return this.http.post<{data: {is_favorite: boolean}}>(
      `${this.apiUrl}/courses/${courseId}/favorite`,
      {}
    ).pipe(
      map(response => response.data)
    );
  }

  getFavoriteCourses(): Observable<Course[]> {
    return this.http.get<{data: Course[]}>(`${this.apiUrl}/courses/favorites`).pipe(
      map(response => response.data)
    );
  }

 // === CORRECTION : Récupérer les cours d'un enseignant avec token ===
  getCoursEnseignant(teacherId: number): Observable<any> {
    // Récupérer le token depuis le service d'authentification
    const token = this.authService.getToken();
    
    if (!token) {
      console.error('❌ Token manquant dans getCoursEnseignant');
      throw new Error('Token d\'authentification manquant');
    }

    // Créer les headers avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('🔐 Token envoyé avec la requête:', `${token.substring(0, 20)}...`);
    
    return this.http.get<any>(`${this.apiUrl}/enseignants/${teacherId}/cours`, { headers });
  }


  private selectedCourseId: number | null = null;

setSelectedCourseId(courseId: number): void {
  this.selectedCourseId = courseId;
  // Optionnel: stocker aussi dans le localStorage pour persister
  localStorage.setItem('selectedCourseId', courseId.toString());
}

getSelectedCourseId(): number | null {
  // Priorité à la variable en mémoire, sinon au localStorage
  return this.selectedCourseId || parseInt(localStorage.getItem('selectedCourseId') || '0');
}

clearSelectedCourseId(): void {
  this.selectedCourseId = null;
  localStorage.removeItem('selectedCourseId');
}

// Dans CoursesService - la méthode existe déjà, vérifions son utilisation
getCourseA(id: number): Observable<any> {
  console.log('📡 Appel API pour cours ID:', id);
  return this.http.get(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('❌ Erreur API getCourse:', error);
      return throwError(error);
    })
  );
}


// Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Erreur HTTP CoursesService:', error);
    
    let errorMessage = 'Erreur inconnue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 401:
          errorMessage = 'Non authentifié. Token manquant ou invalide.';
          // Optionnel: Déconnexion automatique
          // this.authService.clearToken();
          // window.location.href = '/login';
          break;
        case 403:
          errorMessage = 'Accès refusé. Vous n\'avez pas les permissions.';
          break;
        case 404:
          errorMessage = 'Cours non trouvé.';
          break;
        case 500:
          errorMessage = 'Erreur interne du serveur.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }
    
    console.error('💥 Erreur détaillée:', {
      status: error.status,
      message: error.message,
      url: error.url,
      headers: error.headers
    });
    
    return throwError(() => new Error(errorMessage));
  }


  // Laravel: inscrire()
enrollUser(courseId: number, userId: number): Observable<{message: string}> {
  return this.http.post<{message: string}>(
    `${this.apiUrl}/courses/${courseId}/enroll`,
    { user_id: userId }
  );
}

// Laravel: desinscrire()
unenrollUser(courseId: number, userId: number): Observable<{message: string}> {
  return this.http.delete<{message: string}>(
    `${this.apiUrl}/courses/${courseId}/unenroll/${userId}`
  );
}

// Laravel: detail()
getCourseDetail(courseId: number, userId?: number): Observable<{course: Course, isInscrit: boolean}> {
  let params = new HttpParams();
  if (userId) {
    params = params.set('user_id', userId.toString());
  }
  
  return this.http.get<{data: {course: Course, isInscrit: boolean}}>(
    `${this.apiUrl}/courses/${courseId}/detail`,
    { params }
  ).pipe(
    map(response => response.data)
  );
}


// Dans enseignant-cour.service.ts

// === MÉTHODES CRUD COMPLÈTES ===





// Mapper les données Angular vers le format API Laravel
private mapToApiFormat(courseData: any): any {
  return {
    titre: courseData.title,
    description: courseData.description,
    image: courseData.image,
    categorie: courseData.category,
    difficulte: courseData.difficulty,
    note: courseData.note,
    statut: courseData.status,
    duree_totale: courseData.hoursTotal?.toString(), // Convertir en string si nécessaire
    chapitres_total: courseData.chaptersTotal,
    chapitres_completes: courseData.chaptersCompleted,
    progression: courseData.progress,
    certificat_obtenu: courseData.certificateObtained,
    auteur: courseData.instructor,
    tags: courseData.tags
  };
}

// Dans EnseignantCourService
updateCourse(courseId: number, courseData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  const apiData = this.mapToApiFormat(courseData);
  
  return this.http.put<any>(
    `${this.apiUrl}/courses/${courseId}`, 
    apiData,
    { headers }
  );
}



createCourse(courseData: any): Observable<any> {
  const headers = this.getAuthHeaders();
  const apiData = this.mapToApiFormat(courseData);
  
  return this.http.post<any>(
    `${this.apiUrl}/courses`, 
    apiData,
    { headers }
  );
}
}
