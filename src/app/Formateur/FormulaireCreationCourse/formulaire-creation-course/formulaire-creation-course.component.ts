import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/Models/Course';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { EnseignantCourService } from 'src/app/Service/EnseignantCour/enseignant-cour.service';

@Component({
  selector: 'app-formulaire-creation-course',
  templateUrl: './formulaire-creation-course.component.html',
  styleUrls: ['./formulaire-creation-course.component.scss']
})
export class FormulaireCreationCourseComponent {

    courseForm: FormGroup;
  isLoading = false;
  isUploading = false;
  errorMessage: string;
  successMessage: string;
  
  // Gestion des fichiers
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private enseignantCourService: EnseignantCourService,
    private authService: AuthentificationService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  private initializeForm(): void {
    this.courseForm = this.fb.group({
      // Champs requis
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      instructor: ['', Validators.required],
      
      // Champs avec valeurs par défaut
      difficulty: ['débutant'],
      status: ['draft'],
      hoursTotal: [0],
      chaptersTotal: [0],
      chaptersCompleted: [0],
      hoursCompleted: [0],
      progress: [0],
      note: [0],
      certificateObtained: [false],
      image: [''],
      tags: ['']
    });
  }

  // === GESTION DES FICHIERS ===

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  private validateAndSetFile(file: File): void {
    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage = 'Type de fichier non supporté. Utilisez JPEG, PNG ou GIF.';
      return;
    }

    // Validation de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.errorMessage = 'Fichier trop volumineux. Maximum 5MB autorisé.';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';

    // Générer l'aperçu
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);

    // Effacer l'URL d'image si un fichier est sélectionné
    this.courseForm.patchValue({ image: '' });
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // === UPLOAD D'IMAGE ===

  private async uploadImage(): Promise<string> {
    if (!this.selectedFile) {
      return this.courseForm.get('image')?.value || '';
    }

    this.isUploading = true;

    try {
      // Ici vous appelleriez votre service d'upload
      // Pour l'instant, nous simulons un upload
      const uploadedUrl = await this.simulateImageUpload();
      return uploadedUrl;
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw new Error('Échec de l\'upload de l\'image');
    } finally {
      this.isUploading = false;
    }
  }

  private simulateImageUpload(): Promise<string> {
    return new Promise((resolve) => {
      // Simulation d'un upload qui prend 2 secondes
      setTimeout(() => {
        // En production, vous utiliseriez l'URL retournée par votre API
        const fakeUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
        resolve(fakeUrl);
      }, 2000);
    });
  }

  // === CRÉATION DU COURS ===

  async onSubmit(): Promise<void> {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    await this.createCourse();
  }

  async saveAsDraft(): Promise<void> {
    this.courseForm.patchValue({ status: 'draft' });
    await this.createCourse();
  }

  private async createCourse(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      // Upload de l'image si un fichier est sélectionné
      let imageUrl = this.courseForm.get('image')?.value;
      
      if (this.selectedFile) {
        imageUrl = await this.uploadImage();
      }

      const formValue = this.courseForm.value;

      // Préparer les données pour l'API
      const courseData: Partial<Course> = {
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        difficulty: formValue.difficulty,
        status: formValue.status,
        instructor: formValue.instructor,
        hoursTotal: formValue.hoursTotal || 0,
        hoursCompleted: formValue.hoursCompleted || 0,
        chaptersTotal: formValue.chaptersTotal || 0,
        chaptersCompleted: formValue.chaptersCompleted || 0,
        progress: formValue.progress || 0,
        note: formValue.note || 0,
        certificateObtained: formValue.certificateObtained || false,
        image: imageUrl || this.getDefaultCourseImage(formValue.category),
        tags: this.parseTags(formValue.tags),
        // Champs calculés
        statusLabel: this.getStatusLabel(formValue.status),
        progressColor: this.getProgressColor(formValue.progress || 0)
      };

      console.log('📤 Création du cours:', courseData);

      this.enseignantCourService.createCourse(courseData).subscribe({
        next: (response) => {
          console.log('✅ Cours créé avec succès:', response);
          this.isLoading = false;
          this.successMessage = 'Cours créé avec succès !';
          
          // Redirection après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/FormateurDashboard']);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Erreur création cours:', error);
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error);
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      this.isLoading = false;
      this.errorMessage = 'Erreur lors de l\'upload de l\'image';
    }
  }

  // === MÉTHODES UTILITAIRES ===

  private parseTags(tagsInput: string): string[] {
    if (!tagsInput || tagsInput.trim() === '') {
      return [];
    }
    
    return tagsInput.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    if (error.status === 401) {
      return 'Non autorisé. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      return 'Accès refusé. Vous n\'avez pas les droits pour créer un cours.';
    } else if (error.status === 422) {
      return 'Données invalides. Vérifiez les informations saisies.';
    } else if (error.status === 0) {
      return 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      return 'Erreur lors de la création du cours. Veuillez réessayer.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach(key => {
      this.courseForm.get(key)?.markAsTouched();
    });
  }

  onBack(): void {
    this.router.navigate(['/FormateurDashboard']);
  }

  onImageError(event: any): void {
    console.log('❌ Erreur de chargement de l\'image');
    event.target.style.display = 'none';
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get title() { return this.courseForm.get('title'); }
  get description() { return this.courseForm.get('description'); }
  get category() { return this.courseForm.get('category'); }
  get instructor() { return this.courseForm.get('instructor'); }

}
