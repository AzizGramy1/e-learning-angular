import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Course } from 'src/app/Models/Course';
import { EnseignantCourService } from 'src/app/Service/EnseignantCour/enseignant-cour.service';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { Devoir } from 'src/app/Models/Devoir';
import { DevoirService } from 'src/app/Service/Devoir/devoir.service';

@Component({
  selector: 'app-course-edit-formulaire',
  templateUrl: './course-edit-formulaire.component.html',
  styleUrls: ['./course-edit-formulaire.component.scss']
})
export class CourseEditFormulaireComponent implements OnInit {
  courseId: number;
  course: Course;
  isLoading = true;
  errorMessage: string;
  successMessage: string;
  courseForm: FormGroup;


  
  devoirs: Devoir[] = [];
  showDevoirsModal = false;  // ← Cette variable contrôle l'affichage de la modal
  isLoadingDevoirs = false;
  
  // Variables d'état pour gérer l'édition
  editingImage = false;
  editingBasicInfo = false;
  editingProgress = false;
  editingChapters = false;
  editingRating = false;
  editingCertificate = false;
  editingCourseInfo = false;
  editingStatistics = false;
  editingTags = false;
  editingForm = false;

  // Variable temporaire pour l'édition des tags
  tagsInput = '';

  // Sauvegarde des données originales pour annulation
  private originalCourse: Course;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private enseignantCourService: EnseignantCourService,
    private devoirService: DevoirService,
    private authService: AuthentificationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Vérifier l'authentification avant de charger
    if (!this.authService.isLoggedIn()) {
      console.error('❌ Utilisateur non authentifié');
      this.errorMessage = 'Vous devez être connecté pour accéder à cette page';
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      this.courseId = +params['id'];
      console.log('🔄 Chargement des détails du cours ID:', this.courseId);
      
      // Debug: Vérifier le token
      const token = this.authService.getToken();
      console.log('🔐 Token récupéré:', token ? `Présent (${token.length} caractères)` : 'Absent');
      
      if (this.courseId && !isNaN(this.courseId)) {
        this.loadCourseDetails();
      } else {
        console.error('❌ ID de cours invalide:', params['id']);
        this.errorMessage = 'ID de cours invalide';
        this.isLoading = false;
      }
    });
  }

  private initializeForm(): void {
    this.courseForm = this.fb.group({
      title: [{ value: '', disabled: true }],
      description: [{ value: '', disabled: true }],
      category: [{ value: '', disabled: true }],
      difficulty: [{ value: '', disabled: true }],
      hoursTotal: [{ value: 0, disabled: true }],
      status: [{ value: '', disabled: true }],
      image: [{ value: '', disabled: true }],
      note: [{ value: 0, disabled: true }],
      certificateObtained: [{ value: false, disabled: true }],
      instructor: [{ value: '', disabled: true }],
      tags: [{ value: '', disabled: true }]
    });
  }

  private loadCourseDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    console.log('📡 Chargement des détails du cours via EnseignantCourService...');

    this.enseignantCourService.getCourse(this.courseId).subscribe({
      next: (apiResponse: any) => {
        console.log('✅ Réponse API détails cours:', apiResponse);
        
        try {
          // Convertir les données API vers l'interface Course
          this.course = this.mapApiToCourse(apiResponse);
          this.originalCourse = { ...this.course }; // Sauvegarder pour annulation
          console.log('📚 Cours mappé:', this.course);
          
          this.initializeFormWithData(this.course);
          this.isLoading = false;
        } catch (error) {
          console.error('❌ Erreur lors du mapping des données:', error);
          this.errorMessage = 'Erreur lors du traitement des données du cours';
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('❌ Erreur chargement détails cours:', error);
        
        if (error.message && error.details) {
          this.errorMessage = `${error.message}: ${error.details}`;
        } else {
          this.errorMessage = this.getErrorMessage(error);
        }
        
        this.isLoading = false;
        
        // Rediriger vers login si erreur 401
        if (error.status === 401) {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      }
    });
  }

  /**
   * Convertir les données API (français) vers l'interface Course (anglais)
   */
  private mapApiToCourse(apiData: any): Course {
    console.log('🔍 Données brutes API reçues:', apiData);
    
    const courseData = apiData.course || apiData.data || apiData;
    
    if (!courseData) {
      console.error('❌ Aucune donnée de cours trouvée dans la réponse API');
      throw new Error('Format de réponse API invalide');
    }

    console.log('🔍 Données du cours extraites:', courseData);
    console.log('🔍 Tags bruts:', courseData.tags, 'Type:', typeof courseData.tags);

    // Normaliser les tags pour garantir que c'est un tableau
    const normalizedTags = this.normalizeTags(courseData.tags);

    return {
      id: courseData.id,
      title: courseData.titre || courseData.title || 'Titre non disponible',
      description: courseData.description || 'Description non disponible',
      image: courseData.image || courseData.image_url || this.getDefaultCourseImage(courseData.categorie),
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
      tags: normalizedTags
    };
  }

  /**
   * Normaliser les tags pour s'assurer que c'est toujours un tableau de string
   */
  private normalizeTags(tags: any): string[] {
    console.log('🔄 Normalisation des tags:', tags);
    
    if (!tags) {
      console.log('📝 Tags null/undefined, retour tableau vide');
      return [];
    }
    
    if (Array.isArray(tags)) {
      console.log('📝 Tags est déjà un tableau, nettoyage...');
      const cleanedTags = tags.map(tag => {
        if (tag === null || tag === undefined) return '';
        return tag.toString().trim();
      }).filter(tag => tag !== '');
      
      console.log('📝 Tags nettoyés:', cleanedTags);
      return cleanedTags;
    }
    
    if (typeof tags === 'string') {
      console.log('📝 Tags est une string, traitement...');
      try {
        const parsed = JSON.parse(tags);
        console.log('📝 Tags parsés comme JSON:', parsed);
        
        if (Array.isArray(parsed)) {
          const cleanedTags = parsed.map(tag => tag.toString().trim()).filter(tag => tag !== '');
          console.log('📝 Tags JSON nettoyés:', cleanedTags);
          return cleanedTags;
        }
        console.log('📝 Tags JSON non-tableau, conversion en tableau');
        return [parsed.toString().trim()];
      } catch {
        console.log('📝 Tags string simple, split par virgules');
        const splitTags = tags.split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== '');
        console.log('📝 Tags splités:', splitTags);
        return splitTags;
      }
    }
    
    console.log('📝 Tags autre type, conversion en string');
    return [tags.toString().trim()];
  }

  /**
   * Normaliser la note pour s'assurer que c'est un nombre
   */
  private normalizeNote(note: any): number {
    if (note === null || note === undefined) return 0;
    
    const num = Number(note);
    return isNaN(num) ? 0 : Math.max(0, Math.min(5, num));
  }

  /**
   * Normaliser la progression pour s'assurer que c'est un nombre entre 0 et 100
   */
  private normalizeProgress(progress: any): number {
    if (progress === null || progress === undefined) return 0;
    
    const num = Number(progress);
    return isNaN(num) ? 0 : Math.max(0, Math.min(100, num));
  }

  private initializeFormWithData(course: Course): void {
    console.log('📝 Remplissage du formulaire avec les données du cours:', course);
    console.log('🏷️ Tags normalisés:', course.tags);
    
    const tagsValue = course.tags.length > 0 ? course.tags.join(', ') : 'Aucun tag';

    this.courseForm.patchValue({
      title: course.title || 'Non spécifié',
      description: course.description || 'Aucune description',
      category: course.category || 'Non catégorisé',
      difficulty: course.difficulty || 'Non spécifié',
      hoursTotal: course.hoursTotal || 0,
      status: course.status || 'Non spécifié',
      image: course.image || '',
      note: course.note || 0,
      certificateObtained: course.certificateObtained || false,
      instructor: course.instructor || 'Non spécifié',
      tags: tagsValue
    });

    console.log('✅ Formulaire rempli avec succès');
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

  private getDefaultCourseImage(category: string): string {
    const images: { [key: string]: string } = {
      'Développement': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Business': 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    };
    return images[category] || 'https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'Cours non trouvé. Vérifiez que le cours existe.';
    } else if (error.status === 401) {
      return 'Non autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      return 'Accès refusé. Vous n\'avez pas les droits pour voir ce cours.';
    } else if (error.status === 0) {
      return 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      return 'Erreur de connexion au serveur. Veuillez réessayer.';
    }
  }

  // ==================== MÉTHODES DE MISE À JOUR RÉELLES ====================

  /**
   * Méthode principale pour mettre à jour le cours complet
   */
  updateCourse(): void {
    console.log('🔄 Début mise à jour du cours:', this.course);
    
    this.enseignantCourService.updateCourse(this.courseId, this.course).subscribe({
      next: (response) => {
        console.log('✅ Cours mis à jour avec succès:', response);
        
        // Mettre à jour les données locales avec la réponse du serveur
        if (response.data) {
          this.course = this.mapApiToCourse(response.data);
          this.originalCourse = { ...this.course }; // Mettre à jour la sauvegarde
        }
        
        this.showSuccessMessage('Cours mis à jour avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour cours:', error);
        this.showErrorMessage('Erreur lors de la mise à jour du cours');
        
        // Recharger les données originales en cas d'erreur
        this.loadCourseDetails();
      }
    });
  }

  /**
   * Méthode pour les mises à jour partielles (plus efficace)
   */
  updateCoursePartial(updates: any): void {
    console.log('🔄 Mise à jour partielle:', updates);
    
    this.enseignantCourService.updateCoursePartial(this.courseId, updates).subscribe({
      next: (response) => {
        console.log('✅ Mise à jour partielle réussie:', response);
        
        // Mettre à jour localement seulement les champs modifiés
        if (response.data) {
          Object.assign(this.course, this.mapApiToCourse(response.data));
          this.originalCourse = { ...this.course }; // Mettre à jour la sauvegarde
        }
        
        this.showSuccessMessage('Modification enregistrée');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour partielle:', error);
        this.showErrorMessage('Erreur lors de la modification');
      }
    });
  }

  // ==================== MÉTHODES DE SAUVEGARDE CONNECTÉES À L'API ====================

  saveImage() {
    const updates = { image: this.course.image };
    this.updateCoursePartial(updates);
    this.editingImage = false;
  }

  saveBasicInfo() {
    const updates = {
      title: this.course.title,
      description: this.course.description
    };
    this.updateCoursePartial(updates);
    this.editingBasicInfo = false;
  }

  saveProgress() {
    const updates = { progress: this.course.progress };
    this.updateCoursePartial(updates);
    this.editingProgress = false;
  }

  saveChapters() {
    const updates = {
      chaptersCompleted: this.course.chaptersCompleted,
      chaptersTotal: this.course.chaptersTotal
    };
    this.updateCoursePartial(updates);
    this.editingChapters = false;
  }

  saveRating() {
    const updates = { note: this.course.note };
    this.updateCoursePartial(updates);
    this.editingRating = false;
  }

  saveCertificate() {
    const updates = { certificateObtained: this.course.certificateObtained };
    this.updateCoursePartial(updates);
    this.editingCertificate = false;
  }

  saveCourseInfo() {
    const updates = {
      instructor: this.course.instructor,
      hoursTotal: this.course.hoursTotal,
      hoursCompleted: this.course.hoursCompleted,
      difficulty: this.course.difficulty,
      status: this.course.status
    };
    this.updateCoursePartial(updates);
    this.editingCourseInfo = false;
  }

  saveStatistics() {
    const updates = {
      progress: this.course.progress,
      note: this.course.note,
      chaptersCompleted: this.course.chaptersCompleted,
      chaptersTotal: this.course.chaptersTotal,
      certificateObtained: this.course.certificateObtained
    };
    this.updateCoursePartial(updates);
    this.editingStatistics = false;
  }

  saveTags() {
    this.course.tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const updates = { tags: this.course.tags };
    this.updateCoursePartial(updates);
    this.editingTags = false;
  }

  saveForm() {
    const formValue = this.courseForm.value;
    
    const updates = {
      title: formValue.title,
      category: formValue.category,
      instructor: formValue.instructor,
      difficulty: formValue.difficulty,
      description: formValue.description,
      tags: formValue.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    this.updateCoursePartial(updates);
    this.editingForm = false;
  }

  // ==================== MÉTHODES D'ÉDITION ====================

  onEditImage() {
    console.log('Modifier l\'image du cours', this.courseId);
    this.editingImage = true;
  }

  onEditBasicInfo() {
    console.log('Modifier les informations de base', this.courseId);
    this.editingBasicInfo = true;
  }

  onEditProgress() {
    console.log('Modifier la progression', this.courseId);
    this.editingProgress = true;
  }

  onEditChapters() {
    console.log('Modifier les chapitres', this.courseId);
    this.editingChapters = true;
  }

  onEditRating() {
    console.log('Modifier la note', this.courseId);
    this.editingRating = true;
  }

  onEditCertificate() {
    console.log('Modifier le certificat', this.courseId);
    this.editingCertificate = true;
  }

  onEditCourseInfo() {
    console.log('Modifier les informations du cours', this.courseId);
    this.editingCourseInfo = true;
  }

  onEditStatistics() {
    console.log('Modifier les statistiques', this.courseId);
    this.editingStatistics = true;
  }

  onEditTags() {
    console.log('Modifier les tags', this.courseId);
    this.tagsInput = this.course.tags ? this.course.tags.join(', ') : '';
    this.editingTags = true;
  }

  onEditForm() {
    console.log('Modifier le formulaire complet', this.courseId);
    
    // Activer l'édition du formulaire
    Object.keys(this.courseForm.controls).forEach(key => {
      this.courseForm.get(key)?.enable();
    });
    
    this.editingForm = true;
  }

  // ==================== MÉTHODES D'ANNULATION ====================

  cancelEditImage() {
    // Restaurer l'image originale
    this.course.image = this.originalCourse.image;
    this.editingImage = false;
  }

  cancelEditBasicInfo() {
    // Restaurer les informations de base originales
    this.course.title = this.originalCourse.title;
    this.course.description = this.originalCourse.description;
    this.editingBasicInfo = false;
  }

  cancelEditProgress() {
    // Restaurer la progression originale
    this.course.progress = this.originalCourse.progress;
    this.editingProgress = false;
  }

  cancelEditChapters() {
    // Restaurer les chapitres originaux
    this.course.chaptersCompleted = this.originalCourse.chaptersCompleted;
    this.course.chaptersTotal = this.originalCourse.chaptersTotal;
    this.editingChapters = false;
  }

  cancelEditRating() {
    // Restaurer la note originale
    this.course.note = this.originalCourse.note;
    this.editingRating = false;
  }

  cancelEditCertificate() {
    // Restaurer le statut certificat original
    this.course.certificateObtained = this.originalCourse.certificateObtained;
    this.editingCertificate = false;
  }

  cancelEditCourseInfo() {
    // Restaurer les informations du cours originales
    this.course.instructor = this.originalCourse.instructor;
    this.course.hoursTotal = this.originalCourse.hoursTotal;
    this.course.hoursCompleted = this.originalCourse.hoursCompleted;
    this.course.difficulty = this.originalCourse.difficulty;
    this.course.status = this.originalCourse.status;
    this.editingCourseInfo = false;
  }

  cancelEditStatistics() {
    // Restaurer les statistiques originales
    this.course.progress = this.originalCourse.progress;
    this.course.note = this.originalCourse.note;
    this.course.chaptersCompleted = this.originalCourse.chaptersCompleted;
    this.course.chaptersTotal = this.originalCourse.chaptersTotal;
    this.course.certificateObtained = this.originalCourse.certificateObtained;
    this.editingStatistics = false;
  }

  cancelEditTags() {
    // Restaurer les tags originaux
    this.course.tags = [...this.originalCourse.tags];
    this.editingTags = false;
  }

  cancelEditForm() {
    // Restaurer toutes les données du formulaire
    this.course = { ...this.originalCourse };
    this.initializeFormWithData(this.course);
    
    // Désactiver l'édition du formulaire
    Object.keys(this.courseForm.controls).forEach(key => {
      this.courseForm.get(key)?.disable();
    });
    
    this.editingForm = false;
  }

  // ==================== MÉTHODES D'ACTION ====================

  onPublishCourse() {
    console.log('📢 Publication du cours', this.courseId);
    
    const updates = { status: 'published' };
    
    this.enseignantCourService.updateCoursePartial(this.courseId, updates).subscribe({
      next: (response) => {
        console.log('✅ Cours publié avec succès:', response);
        this.course.status = 'published';
        this.course.statusLabel = this.getStatusLabel('published');
        this.showSuccessMessage('Cours publié avec succès');
      },
      error: (error) => {
        console.error('❌ Erreur publication cours:', error);
        this.showErrorMessage('Erreur lors de la publication du cours');
      }
    });
  }

  onDuplicateCourse() {
    console.log('📋 Duplication du cours', this.courseId);
    
    // Créer une copie du cours avec un nouveau titre
    const duplicateData = {
      ...this.course,
      title: `${this.course.title} (Copie)`,
      status: 'draft'
    };
    
    // Supprimer l'ID pour créer un nouveau cours
    delete duplicateData.id;
    
    this.enseignantCourService.createCourse(duplicateData).subscribe({
      next: (newCourse) => {
        console.log('✅ Cours dupliqué avec succès:', newCourse);
        this.showSuccessMessage('Cours dupliqué avec succès');
        
        // Rediriger vers le nouveau cours
        this.router.navigate([`/course-edit/${newCourse.id}`]);
      },
      error: (error) => {
        console.error('❌ Erreur duplication cours:', error);
        this.showErrorMessage('Erreur lors de la duplication du cours');
      }
    });
  }

  onExportData() {
    console.log('📤 Export des données du cours', this.courseId);
    
    // Créer un blob avec les données du cours
    const courseData = JSON.stringify(this.course, null, 2);
    const blob = new Blob([courseData], { type: 'application/json' });
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cours-${this.course.title}-${new Date().toISOString().split('T')[0]}.json`;
    
    // Déclencher le téléchargement
    link.click();
    
    // Nettoyer
    window.URL.revokeObjectURL(url);
    
    this.showSuccessMessage('Données exportées avec succès');
  }

  onBack(): void {
    this.router.navigate(['/FormateurDashboard']);
  }

  // ==================== MÉTHODES UTILITAIRES ====================

  // Méthode pour formater la durée
  formatDuration(hours: number): string {
    if (!hours || hours === 0) return 'Non spécifié';
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    }
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }

  // Méthode pour formater la note
  formatRating(note: number): string {
    if (!note || note === 0) return 'Non noté';
    return `${note.toFixed(1)}/5`;
  }

  // Méthode pour formater la progression
  formatProgress(progress: number): string {
    return `${progress}%`;
  }

  // Méthode pour vérifier si l'image existe
  imageExists(url: string): boolean {
    return url && url.trim() !== '' && url !== 'undefined';
  }

  // Méthode pour gérer les erreurs d'image
  onImageError(event: any): void {
    console.log('❌ Erreur de chargement de l\'image, utilisation image par défaut');
    event.target.src = this.getDefaultCourseImage(this.course?.category);
  }

  // Méthodes pour les messages
  private showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = null;
    
    // Cacher le message après 5 secondes
    setTimeout(() => {
      this.successMessage = null;
    }, 5000);
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = null;
    
    // Cacher le message après 5 secondes
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }









/**
 * Ouvre le modal pour afficher les devoirs du cours
 */
onManageAssignment(): void {
  console.log('📝 Gestion des devoirs pour le cours:', this.courseId);
  this.loadDevoirs();
  this.showDevoirsModal = true;
}

// Dans CourseEditFormulaireComponent

private loadDevoirs(): void {
  this.isLoadingDevoirs = true;
  console.log('🔍 Début chargement devoirs - Service:', this.devoirService);
  console.log('🔍 Course ID:', this.courseId);

  this.devoirService.getByCourseId(this.courseId).subscribe({
    next: (response: any) => {
      console.log('🔍 Réponse complète:', response);
      console.log('🔍 Type de réponse:', typeof response);
      
      // Essayez différentes structures
      if (response && response.devoirs) {
        console.log('🔍 Devoirs trouvés dans response.devoirs');
        this.devoirs = response.devoirs;
      } else if (response && Array.isArray(response)) {
        console.log('🔍 Devoirs trouvés dans response (array)');
        this.devoirs = response;
      } else if (response && response.data) {
        console.log('🔍 Devoirs trouvés dans response.data');
        this.devoirs = response.data;
      } else {
        console.warn('⚠️ Aucune structure reconnue:', response);
        this.devoirs = [];
      }
      
      this.isLoadingDevoirs = false;
    },
    error: (error) => {
      console.error('❌ Erreur détaillée:', error);
      console.error('❌ Statut:', error.status);
      console.error('❌ Message:', error.message);
      this.isLoadingDevoirs = false;
      this.devoirs = [];
    }
  });
}

/**
 * Ferme le modal des devoirs
 */
onCloseDevoirsModal(): void {
  this.showDevoirsModal = false;
  this.devoirs = [];
}

/**
 * Ouvre la page de création d'un nouveau devoir
 */
onCreateDevoir(): void {
  this.router.navigate(['/formulaireAdd/EditDevoir'], {
    queryParams: { courseId: this.courseId }
  });
}

/**
 * Affiche les détails d'un devoir
 */
onViewDevoir(devoirId: number): void {
  console.log('👁️ Affichage du devoir:', devoirId);
  this.router.navigate(['/devoir', devoirId]);
}

/**
 * Modifie un devoir existant
 */
onEditDevoir(devoirId: number): void {
  console.log('✏️ Modification du devoir:', devoirId);
  this.router.navigate(['/formulaireAdd/EditDevoir'], {
    queryParams: { 
      courseId: this.courseId,
      devoirId: devoirId 
    }
  });
}


}