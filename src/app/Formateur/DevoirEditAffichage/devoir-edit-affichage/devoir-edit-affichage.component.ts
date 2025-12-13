import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Devoir } from 'src/app/Models/Devoir';
import { Course } from 'src/app/Models/Course';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { DevoirService } from 'src/app/Service/Devoir/devoir.service';
import { EnseignantCourService } from 'src/app/Service/EnseignantCour/enseignant-cour.service';

@Component({
  selector: 'app-devoir-edit-affichage',
  templateUrl: './devoir-edit-affichage.component.html',
  styleUrls: ['./devoir-edit-affichage.component.scss']
})
export class DevoirEditAffichageComponent implements OnInit {

  devoirId: number = 0;
  courseId: number = 0;
  devoir: Devoir | null = null;
  course: Course | null = null;
  isLoading = true;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Variables pour la soumission (si nécessaire pour les étudiants)
  submissionLink: string = '';
  selectedFile: File | null = null;
  showStudentSection = false; // À adapter selon le contexte utilisateur

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthentificationService,
    private devoirService: DevoirService,
    private enseignantCourService: EnseignantCourService
  ) {}

  ngOnInit(): void {
    // Vérifier l'authentification avant de charger
    if (!this.authService.isLoggedIn()) {
      console.error('❌ Utilisateur non authentifié');
      this.errorMessage = 'Vous devez être connecté pour accéder à cette page';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.loadRouteParameters();
  }

  private loadRouteParameters(): void {
    this.route.paramMap.subscribe(params => {
      // Essayer de récupérer l'ID du devoir depuis différentes sources
      const devoirIdParam = params.get('id') || params.get('devoirId');
      const courseIdParam = params.get('courseId');
      
      console.log('🔍 Paramètres de route:', {
        devoirId: devoirIdParam,
        courseId: courseIdParam,
        allParams: params
      });

      if (devoirIdParam && !isNaN(+devoirIdParam)) {
        this.devoirId = +devoirIdParam;
        console.log('🔄 Chargement du devoir ID:', this.devoirId);
        this.loadDevoirDetails();
      } else if (courseIdParam && !isNaN(+courseIdParam)) {
        this.courseId = +courseIdParam;
        console.log('📚 Chargement des devoirs du cours ID:', this.courseId);
        this.loadDevoirsByCourse();
      } else {
        console.error('❌ Aucun ID valide trouvé dans les paramètres');
        this.errorMessage = 'ID de devoir ou de cours manquant';
        this.isLoading = false;
      }
    });
  }

  private loadDevoirDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📡 Chargement des détails du devoir...');

    // Utiliser la méthode appropriée selon votre service
    this.devoirService.getByCourseId(this.devoirId).subscribe({
      next: (response: any) => {
        console.log('✅ Réponse API détails devoir:', response);
        this.handleDevoirResponse(response);
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement détails devoir:', error);
        this.handleLoadError(error);
      }
    });
  }

  private loadDevoirsByCourse(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📡 Chargement des devoirs du cours...');

    // Charger d'abord les détails du cours
    this.enseignantCourService.getCourse(this.courseId).subscribe({
      next: (courseResponse: any) => {
        console.log('✅ Cours chargé:', courseResponse);
        this.course = this.mapApiToCourse(courseResponse);
        
        // Ensuite charger les devoirs du cours
        this.devoirService.getByCourseId(this.courseId).subscribe({
          next: (devoirsResponse: any) => {
            console.log('✅ Devoirs du cours chargés:', devoirsResponse);
            this.handleDevoirsResponse(devoirsResponse);
          },
          error: (error: any) => {
            console.error('❌ Erreur chargement devoirs du cours:', error);
            this.handleLoadError(error);
          }
        });
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement cours:', error);
        this.handleLoadError(error);
      }
    });
  }

  private handleDevoirResponse(response: any): void {
    try {
      // Adapter selon la structure de votre API
      this.devoir = response.devoir || response.data || response;
      
      if (!this.devoir) {
        throw new Error('Aucune donnée de devoir reçue');
      }

      // Si on a un devoir, charger aussi les infos du cours associé
      if (this.devoir.course_id) {
        this.loadCourseDetails(this.devoir.course_id);
      } else {
        this.isLoading = false;
      }
      
      console.log('📚 Devoir chargé:', this.devoir);
    } catch (error) {
      console.error('❌ Erreur traitement des données:', error);
      this.errorMessage = 'Erreur lors du traitement des données du devoir';
      this.isLoading = false;
    }
  }

  private handleDevoirsResponse(response: any): void {
    try {
      const devoirs = response.devoirs || response.data || response;
      
      if (!devoirs || !Array.isArray(devoirs) || devoirs.length === 0) {
        this.errorMessage = 'Aucun devoir trouvé pour ce cours';
        this.isLoading = false;
        return;
      }

      // Pour l'instant, on prend le premier devoir (vous pourriez adapter pour en afficher plusieurs)
      this.devoir = devoirs[0];
      console.log('📚 Premier devoir chargé:', this.devoir);
      
      this.isLoading = false;
    } catch (error) {
      console.error('❌ Erreur traitement des données:', error);
      this.errorMessage = 'Erreur lors du traitement des données des devoirs';
      this.isLoading = false;
    }
  }

  private loadCourseDetails(courseId: number): void {
    this.enseignantCourService.getCourse(courseId).subscribe({
      next: (response: any) => {
        console.log('✅ Détails du cours chargés:', response);
        this.course = this.mapApiToCourse(response);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement cours:', error);
        // On continue même si le cours ne charge pas
        this.isLoading = false;
      }
    });
  }

  private mapApiToCourse(apiData: any): Course {
    const courseData = apiData.course || apiData.data || apiData;
    
    return {
      id: courseData.id,
      title: courseData.titre || courseData.title || 'Titre non disponible',
      description: courseData.description || 'Description non disponible',
      image: courseData.image || courseData.image_url || '',
      status: courseData.statut || courseData.status || 'draft',
      statusLabel: this.getStatusLabel(courseData.statut || courseData.status),
      category: courseData.categorie || courseData.category || 'Non catégorisé',
      difficulty: courseData.difficulte || courseData.difficulty || 'débutant',
      note: this.normalizeNote(courseData.note || courseData.rating),
      hoursCompleted: courseData.heures_completes || courseData.hoursCompleted || 0,
      hoursTotal: courseData.duree_totale || courseData.hoursTotal || 0,
      chaptersCompleted: courseData.chapitres_completes || courseData.chaptersCompleted || 0,
      chaptersTotal: courseData.chapitres_total || courseData.chaptersTotal || 0,
      progress: this.normalizeProgress(courseData.progression || courseData.progress),
      progressColor: this.getProgressColor(courseData.progression || courseData.progress),
      certificateObtained: courseData.certificat_obtenu || courseData.certificateObtained || false,
      instructor: courseData.auteur || courseData.instructor || 'Enseignant non spécifié',
      tags: this.normalizeTags(courseData.tags)
    };
  }

  private normalizeNote(note: any): number {
    if (note === null || note === undefined) return 0;
    const num = Number(note);
    return isNaN(num) ? 0 : Math.max(0, Math.min(5, num));
  }

  private normalizeProgress(progress: any): number {
    if (progress === null || progress === undefined) return 0;
    const num = Number(progress);
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
  }

  private normalizeTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.map(tag => tag?.toString().trim()).filter(tag => tag !== '');
    }
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          return parsed.map(tag => tag.toString().trim()).filter(tag => tag !== '');
        }
        return [parsed.toString().trim()];
      } catch {
        return tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
      }
    }
    return [tags.toString().trim()];
  }

  private getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'draft': 'Brouillon',
      'published': 'Publié',
      'archived': 'Archivé',
      'En cours': 'En cours',
      'Terminé': 'Terminé',
      'Nouveau': 'Nouveau',
      'Favori': 'Favori'
    };
    return labels[status] || status;
  }

  private getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-blue-500';
    return 'text-yellow-500';
  }

  private handleLoadError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'Devoir non trouvé';
    } else if (error.status === 401) {
      this.errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else if (error.status === 0) {
      this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.errorMessage = 'Erreur de connexion au serveur. Veuillez réessayer.';
    }
    
    this.isLoading = false;
  }

  // ==================== MÉTHODES DU TEMPLATE ====================

  onBack(): void {
    if (this.courseId) {
      this.router.navigate(['/Formateur/Course/Formulaire/Edit', this.courseId]);
    } else if (this.devoir?.course_id) {
      this.router.navigate(['/Formateur/Course/Formulaire/Edit', this.devoir.course_id]);
    } else {
      this.router.navigate(['/FormateurDashboard']);
    }
  }

  onEditDevoir(): void {
    if (this.devoir?.id) {
      console.log('✏️ Redirection vers édition du devoir:', this.devoir.id);
      this.router.navigate(['/devoir', this.devoir.id, 'edit']);
    } else {
      this.errorMessage = 'Impossible de modifier: devoir non chargé';
    }
  }

  onExportDevoir(): void {
    console.log('📤 Export du devoir:', this.devoirId);
    
    if (!this.devoir) {
      this.errorMessage = 'Aucun devoir à exporter';
      return;
    }
    
    // Logique d'export simple
    const data = JSON.stringify(this.devoir, null, 2);
    this.downloadFile(data, `devoir-${this.devoir.titre}.json`);
    this.showSuccessMessage('Devoir exporté avec succès');
  }

  onDuplicateDevoir(): void {
    console.log('📋 Duplication du devoir:', this.devoirId);
    this.showSuccessMessage('Fonctionnalité de duplication à implémenter');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('📄 Fichier sélectionné:', file.name);
      this.showSuccessMessage(`Fichier "${file.name}" sélectionné`);
    }
  }


  onSubmitDevoir(): void {
    console.log('📝 Soumission du devoir');
    this.showSuccessMessage('Fonctionnalité de soumission à implémenter');
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  getStatusBadgeClass(): string {
    if (!this.devoir) return 'bg-gray-500 text-white';
    
    const status = this.devoir.statut?.toLowerCase();
    switch (status) {
      case 'terminé': return 'bg-green-500 text-white';
      case 'en_retard': return 'bg-red-500 text-white';
      case 'en_attente': return 'bg-yellow-500 text-gray-900';
      case 'actif': return 'bg-blue-500 text-white';
      case 'brouillon': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }

  getStatusText(): string {
    if (!this.devoir) return 'Inconnu';
    
    const status = this.devoir.statut?.toLowerCase();
    switch (status) {
      case 'terminé': return 'Terminé';
      case 'en_retard': return 'En retard';
      case 'en_attente': return 'En attente';
      case 'actif': return 'Actif';
      case 'brouillon': return 'Brouillon';
      default: return this.devoir.statut || 'Non défini';
    }
  }

  isDeadlinePassed(): boolean {
    if (!this.devoir?.date_limite) return false;
    try {
      return new Date() > new Date(this.devoir.date_limite);
    } catch {
      return false;
    }
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'Non définie';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date invalide';
    }
  }

  getDeadlineStatus(): string {
    if (!this.devoir?.date_limite) return 'Aucune date limite';
    
    try {
      const deadline = new Date(this.devoir.date_limite);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return `Retard de ${Math.abs(diffDays)} jour(s)`;
      if (diffDays === 0) return 'Aujourd\'hui';
      if (diffDays === 1) return 'Demain';
      return `Dans ${diffDays} jours`;
    } catch {
      return 'Date invalide';
    }
  }

  getTypeRemiseText(): string {
    if (!this.devoir?.type_remise) return 'Non spécifié';
    
    switch (this.devoir.type_remise) {
      case 'fichier': return 'Fichier';
      case 'lien': return 'Lien';
      case 'fichier_et_lien': return 'Fichier et Lien';
     
      default: return this.devoir.type_remise;
    }
  }

  getFileName(filePath: string): string {
    if (!filePath) return 'Fichier inconnu';
    return filePath.split('/').pop() || filePath.split('\\').pop() || filePath;
  }

  canSubmit(): boolean {
    // Logique simplifiée pour la démo
    return !!this.devoir && this.showStudentSection;
  }

  getCourseTitle(): string {
    return this.course?.title || 'Cours associé';
  }

  private downloadFile(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // ==================== MÉTHODES DE MESSAGE ====================

  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}