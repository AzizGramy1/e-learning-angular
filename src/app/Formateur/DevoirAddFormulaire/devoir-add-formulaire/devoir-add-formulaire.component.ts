import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Devoir } from 'src/app/Models/Devoir';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { CoursesService } from 'src/app/Service/Courses/courses.service';
import { DevoirService } from 'src/app/Service/Devoir/devoir.service';

@Component({
  selector: 'app-devoir-add-formulaire',
  templateUrl: './devoir-add-formulaire.component.html',
  styleUrls: ['./devoir-add-formulaire.component.scss']
})
export class DevoirAddFormulaireComponent implements OnInit, OnDestroy {

  devoirForm: FormGroup;
  courseId: number;
  courseTitle: string = '';
  isEditMode: boolean = false;
  devoirId: number | null = null;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  today: Date = new Date();

  // Options pour les sélecteurs
  categories: string[] = ['Devoir Maison', 'Projet', 'Exercice', 'Examen', 'Quiz', 'Rédaction'];
  statuts: string[] = ['en_attente', 'en_retard', 'terminé', 'actif'];
  typesRemise: string[] = ['fichier', 'lien', 'fichier_et_lien'];

  // Gestion de la destruction du composant
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private devoirService: DevoirService,
    private authService: AuthentificationService,
    private courseService: CoursesService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getRouteParams();
    this.loadCourseDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialisation du formulaire réactif basé sur l'interface Devoir
   */
  initializeForm(): void {
    this.devoirForm = this.fb.group({
      // Champs obligatoires selon l'interface
      course_id: ['', Validators.required],
      user_id: ['', Validators.required],
      titre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      
      // Champs optionnels
      description: ['', Validators.maxLength(1000)],
      module: ['', Validators.maxLength(255)],
      points: [0, [
        Validators.min(0),
        Validators.max(1000)
      ]],
      date_limite: [''],
      categorie: ['Devoir Maison'],
      statut: ['en_attente'],
      instructions: [''],
      type_remise: ['fichier'],
      fichiers_joints: this.fb.array([]),
      fichier_url: ['', Validators.pattern(/https?:\/\/.+/)],
    });

    // Gestion de la validation conditionnelle pour l'URL
    this.devoirForm.get('type_remise')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        const fichierUrlControl = this.devoirForm.get('fichier_url');
        if (type === 'fichier') {
          fichierUrlControl?.clearValidators();
        } else {
          fichierUrlControl?.setValidators([Validators.pattern(/https?:\/\/.+/)]);
        }
        fichierUrlControl?.updateValueAndValidity();
      });

    // Calcul automatique du statut basé sur la date limite
    this.devoirForm.get('date_limite')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(dateLimite => {
        if (dateLimite) {
          this.updateStatutBasedOnDate(dateLimite);
        }
      });
  }

  /**
   * Mise à jour automatique du statut basé sur la date limite
   */
  private updateStatutBasedOnDate(dateLimite: string): void {
    const now = new Date();
    const limitDate = new Date(dateLimite);
    
    if (limitDate < now) {
      this.devoirForm.patchValue({ statut: 'en_retard' });
    } else if (this.devoirForm.get('statut')?.value === 'en_retard') {
      this.devoirForm.patchValue({ statut: 'actif' });
    }
  }

  /**
   * Récupération des paramètres de la route
   */
  getRouteParams(): void {
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    
    // Vérification du mode édition
    const devoirIdParam = this.route.snapshot.paramMap.get('devoirId');
    if (devoirIdParam) {
      this.isEditMode = true;
      this.devoirId = +devoirIdParam;
      this.loadDevoirData();
    }
  }

  /**
   * Chargement des détails du cours
   */
  loadCourseDetails(): void {
    this.isLoading = true;
    
    this.courseService.getCourse(this.courseId).subscribe({
      next: (course: any) => {
        this.courseTitle = course.title || course.nom || `Cours #${this.courseId}`;
        
        // Pré-remplissage des champs liés au cours - CORRECTION ICI
        const currentUser = this.authService.getUser(); // Utilisation de getUser() au lieu de getCurrentUser()
        if (!currentUser) {
          this.errorMessage = 'Utilisateur non connecté';
          this.isLoading = false;
          return;
        }

        this.devoirForm.patchValue({
          course_id: this.courseId,
          user_id: currentUser.id
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement cours:', error);
        this.errorMessage = 'Erreur lors du chargement du cours';
        this.isLoading = false;
      }
    });
  }

  /**
   * Chargement des données du devoir en mode édition
   */
  loadDevoirData(): void {
    if (!this.devoirId) return;
    
    this.isLoading = true;
    
    this.devoirService.getById(this.devoirId).subscribe({
      next: (devoir: Devoir) => {
        // Vérification que le devoir appartient bien au cours
        if (devoir.course_id !== this.courseId) {
          this.errorMessage = 'Ce devoir ne fait pas partie du cours sélectionné';
          this.isLoading = false;
          return;
        }

        // Patch des valeurs dans le formulaire
        this.devoirForm.patchValue({
          titre: devoir.titre,
          description: devoir.description || '',
          module: devoir.module || '',
          points: devoir.points || 0,
          date_limite: devoir.date_limite ? this.formatDateForInput(devoir.date_limite) : '',
          categorie: devoir.categorie || 'Devoir Maison',
          statut: devoir.statut || 'en_attente',
          instructions: devoir.instructions || '',
          type_remise: devoir.type_remise || 'fichier',
          fichier_url: devoir.fichier_url || '',
        });

        // Gestion des fichiers joints (tableau de strings)
        if (devoir.fichiers_joints && Array.isArray(devoir.fichiers_joints)) {
          this.fichiersJointes.clear();
          devoir.fichiers_joints.forEach((fichier: string) => {
            this.fichiersJointes.push(this.fb.control(fichier));
          });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement devoir:', error);
        this.errorMessage = 'Erreur lors du chargement du devoir';
        this.isLoading = false;
      }
    });
  }

  /**
   * Gestion des fichiers joints (FormArray de strings)
   */
  get fichiersJointes(): FormArray {
    return this.devoirForm.get('fichiers_joints') as FormArray;
  }

  /**
   * Ajout d'un fichier via l'input file
   */
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validation de la taille (10MB max)
        if (file.size > 10 * 1024 * 1024) {
          this.errorMessage = `Le fichier "${file.name}" dépasse la taille maximale de 10MB`;
          continue;
        }

        // Validation du type
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'application/zip'
        ];

        if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip)$/)) {
          this.errorMessage = `Le format du fichier "${file.name}" n'est pas supporté`;
          continue;
        }

        // Simulation d'upload
        this.simulateFileUpload(file).then((fileUrl: string) => {
          this.fichiersJointes.push(this.fb.control(fileUrl));
          this.successMessage = `Fichier "${file.name}" ajouté avec succès`;
        }).catch(error => {
          this.errorMessage = `Erreur lors de l'upload du fichier "${file.name}"`;
        });
      }
      
      // Réinitialiser l'input file
      event.target.value = '';
    }
  }

  /**
   * Simulation d'upload de fichier
   */
  private simulateFileUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fakeFileUrl = `/uploads/${Date.now()}_${file.name}`;
        resolve(fakeFileUrl);
      }, 1000);
    });
  }

  /**
   * Suppression d'un fichier de la liste
   */
  supprimerFichier(index: number): void {
    this.fichiersJointes.removeAt(index);
  }

  /**
   * Soumission du formulaire
   */
  onSubmit(): void {
    if (this.devoirForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.prepareFormData();

      const apiCall = this.isEditMode && this.devoirId
        ? this.devoirService.update(this.devoirId, formData)
        : this.devoirService.create(formData);

      apiCall.subscribe({
        next: (response: Devoir) => {
          this.successMessage = this.isEditMode 
            ? 'Devoir modifié avec succès!' 
            : 'Devoir créé avec succès!';
          
          this.isSubmitting = false;
          
          setTimeout(() => {
            this.router.navigate(['/courses', this.courseId, 'devoirs']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur soumission devoir:', error);
          this.errorMessage = this.getErrorMessage(error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      this.scrollToFirstError();
    }
  }

  /**
   * Préparation des données pour l'API selon l'interface Devoir
   */
  prepareFormData(): Devoir {
    const formValue = this.devoirForm.value;
    
    const devoirData: Devoir = {
      course_id: this.courseId,
      user_id: formValue.user_id,
      titre: formValue.titre,
      description: formValue.description || undefined,
      module: formValue.module || undefined,
      points: formValue.points || 0,
      date_limite: formValue.date_limite ? new Date(formValue.date_limite).toISOString() : undefined,
      categorie: formValue.categorie,
      statut: formValue.statut,
      instructions: formValue.instructions || undefined,
      type_remise: formValue.type_remise,
      fichiers_joints: formValue.fichiers_joints.length > 0 ? formValue.fichiers_joints : undefined,
      fichier_url: formValue.fichier_url || undefined
    };

    return devoirData;
  }

  /**
   * Sauvegarde en tant que brouillon
   */
  onSaveDraft(): void {
    this.devoirForm.patchValue({ statut: 'en_attente' });
    this.onSubmit();
  }

  /**
   * Marquer comme actif
   */
  onActivate(): void {
    this.devoirForm.patchValue({ statut: 'actif' });
    this.onSubmit();
  }

  /**
   * Duplication du devoir
   */
  onDuplicate(): void {
    const duplicatedDevoir = { ...this.devoirForm.value };
    duplicatedDevoir.titre = `${duplicatedDevoir.titre} (Copie)`;
    duplicatedDevoir.statut = 'en_attente';
    
    this.devoirForm.patchValue(duplicatedDevoir);
    this.isEditMode = false;
    this.devoirId = null;
    this.successMessage = 'Devoir dupliqué - Modifiez les informations et sauvegardez';
  }

  /**
   * Aperçu du devoir
   */
  onPreview(): void {
    console.log('Aperçu du devoir:', this.devoirForm.value);
    this.successMessage = 'Fonctionnalité d\'aperçu à implémenter';
  }

  /**
   * Annulation et retour
   */
  onCancel(): void {
    if (this.devoirForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.')) {
        this.goBack();
      }
    } else {
      this.goBack();
    }
  }

  private goBack(): void {
    this.location.back();
  }

  /**
   * Réinitialisation du formulaire - CORRECTION ICI
   */
  onReset(): void {
    if (confirm('Voulez-vous vraiment réinitialiser le formulaire ? Toutes les modifications seront perdues.')) {
      const currentUser = this.authService.getUser(); // Utilisation de getUser()
      if (!currentUser) {
        this.errorMessage = 'Utilisateur non connecté';
        return;
      }

      this.devoirForm.reset({
        course_id: this.courseId,
        user_id: currentUser.id,
        points: 0,
        categorie: 'Devoir Maison',
        statut: 'en_attente',
        type_remise: 'fichier'
      });
      this.fichiersJointes.clear();
    }
  }

  /**
   * Méthodes de validation et d'erreur
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.devoirForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.devoirForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est obligatoire';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
      if (field.errors['min']) return `La valeur minimale est ${field.errors['min'].min}`;
      if (field.errors['max']) return `La valeur maximale est ${field.errors['max'].max}`;
      if (field.errors['pattern']) return 'Format invalide';
    }
    return '';
  }

  markFormGroupTouched(): void {
    Object.keys(this.devoirForm.controls).forEach(key => {
      const control = this.devoirForm.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched();
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched();
          } else {
            arrayControl.markAsTouched();
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  scrollToFirstError(): void {
    const firstErrorElement = document.querySelector('.error-message');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /**
   * Gestion des erreurs API
   */
  getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    if (error.status === 401) {
      return 'Erreur d\'authentification - Veuillez vous reconnecter';
    }
    
    if (error.status === 403) {
      return 'Vous n\'avez pas les permissions pour effectuer cette action';
    }
    
    if (error.status === 404) {
      return 'Ressource non trouvée';
    }
    
    if (error.status >= 500) {
      return 'Erreur serveur - Veuillez réessayer plus tard';
    }
    
    return 'Erreur lors de la création du devoir';
  }

  /**
   * Méthodes utilitaires pour l'interface
   */
  getDateLimitBadgeClass(): string {
    const dateLimite = this.devoirForm.get('date_limite')?.value;
    if (!dateLimite) return 'badge badge-warning';

    const now = new Date();
    const limitDate = new Date(dateLimite);
    const diffTime = limitDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'badge badge-error';
    if (diffDays <= 7) return 'badge badge-warning';
    return 'badge badge-success';
  }

  getDateLimitDisplay(): string {
    const dateLimite = this.devoirForm.get('date_limite')?.value;
    if (!dateLimite) return 'Non définie';
    
    return new Date(dateLimite).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeRemaining(): string {
    const dateLimite = this.devoirForm.get('date_limite')?.value;
    if (!dateLimite) return 'Date non définie';

    const now = new Date();
    const limitDate = new Date(dateLimite);
    const diffTime = limitDate.getTime() - now.getTime();

    if (diffTime < 0) return 'Délai dépassé';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''} et ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  }

  /**
   * Formatage de la date pour l'input datetime-local
   */
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  /**
   * Vérification si le formulaire est valide pour soumission
   */
  canSubmit(): boolean {
    return this.devoirForm.valid && !this.isSubmitting;
  }

  /**
   * Calcul du nombre de caractères restants
   */
  getRemainingChars(fieldName: string, maxLength: number): number {
    const field = this.devoirForm.get(fieldName);
    const currentLength = field?.value?.length || 0;
    return maxLength - currentLength;
  }

  /**
   * Vérification si un champ approche de la limite
   */
  isNearLimit(fieldName: string, maxLength: number): boolean {
    const remaining = this.getRemainingChars(fieldName, maxLength);
    return remaining <= 20 && remaining > 0;
  }

  /**
   * Vérification si un champ dépasse la limite
   */
  isOverLimit(fieldName: string, maxLength: number): boolean {
    const remaining = this.getRemainingChars(fieldName, maxLength);
    return remaining < 0;
  }

  /**
   * Obtention du nom du fichier à partir de l'URL (pour l'affichage)
   */
  getFileName(fileUrl: string): string {
    if (!fileUrl) return '';
    return fileUrl.split('/').pop() || fileUrl;
  }

  /**
   * Vérification si la date limite est dans le passé
   */
  isDateLimitPassed(): boolean {
    const dateLimite = this.devoirForm.get('date_limite')?.value;
    if (!dateLimite) return false;

    const now = new Date();
    const limitDate = new Date(dateLimite);
    return limitDate < now;
  }

  /**
   * Suggestions de catégories basées sur le titre
   */
  onTitleChange(): void {
    const titre = this.devoirForm.get('titre')?.value?.toLowerCase() || '';
    
    if (titre.includes('examen') || titre.includes('test')) {
      this.devoirForm.patchValue({ categorie: 'Examen' });
    } else if (titre.includes('projet')) {
      this.devoirForm.patchValue({ categorie: 'Projet' });
    } else if (titre.includes('quiz')) {
      this.devoirForm.patchValue({ categorie: 'Quiz' });
    }
  }
}