// src/app/Inscrption/FormulaireComplementaire/formulaire-complementaire/formulaire-complementaire.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { InscriptionService, UserUpdateData } from 'src/app/Service/Inscription/inscription.service';
import { User } from 'src/app/Models/User';

@Component({
  selector: 'app-formulaire-complementaire',
  templateUrl: './formulaire-complementaire.component.html',
  styleUrls: ['./formulaire-complementaire.component.scss']
})
export class FormulaireComplementaireComponent implements OnInit {
 user: User = {
    nom: '',
    email: '',
    role: 'student'
  };
  
  isLoading = false;
  isSubmitting = false;
  selectedFile: File | null = null;
  avatarPreview: string | null = null;
  activeTab: string = 'personal';
  showSaveIndicator: boolean = false;

  // Données pour les sélecteurs
  languagesList: string[] = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Arabe'];
  skillsList: string[] = ['JavaScript', 'Angular', 'React', 'Vue.js', 'Node.js', 'Laravel', 'PHP', 'Python', 'Java'];
  levelsList: string[] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

  constructor(
    private authService: AuthentificationService,
    private inscriptionService: InscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Charger le profil utilisateur
  loadUserProfile(): void {
    console.log('🔍 Début chargement profil...');
    
    // Vérifier d'abord si l'utilisateur est connecté
    const token = localStorage.getItem('access_token');
    console.log('🔐 Token présent:', !!token);
    
    if (!this.authService.isLoggedIn()) {
      console.warn('❌ Utilisateur non connecté');
      alert('Vous devez être connecté pour accéder à cette page');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;

    // Utiliser le service d'authentification pour récupérer le profil
    this.authService.me().subscribe({
      next: (user: User) => {
        console.log('✅ Profil chargé avec succès:', user);
        this.user = user;
        this.avatarPreview = this.user.avatar_url || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erreur chargement profil:', error);
        
        if (error.status === 401) {
          // Token invalide ou expiré
          this.authService.clearToken();
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/login']);
        } else {
          // Autre erreur - utiliser des données mockées en développement
          this.useMockData();
          console.log('📝 Mode développement: données mockées chargées');
        }
        
        this.isLoading = false;
      }
    });
  }

  // Données mockées pour le développement
  private useMockData(): void {
    this.user = {
      id: 1,
      nom: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'student',
      telephone: '+33 1 23 45 67 89',
      date_naissance: '1990-01-15',
      adresse: '123 Rue de la République, Paris',
      niveau: 'Intermédiaire',
      langues: ['Français', 'Anglais'],
      skills: ['JavaScript', 'Angular'],
      avatar_url: null,
      progression: 65,
      heures: 120
    };
    this.avatarPreview = null;
  }

  // Changer d'onglet
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Gestion de la sélection de fichier avatar
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 2MB');
        return;
      }

      this.selectedFile = file;

      // Prévisualisation
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Supprimer l'avatar
  removeAvatar(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
  }

  // Gestion des langues
  onLanguageChange(language: string, event: any): void {
    if (!this.user.langues) {
      this.user.langues = [];
    }

    if (event.target.checked) {
      if (!this.user.langues.includes(language)) {
        this.user.langues.push(language);
      }
    } else {
      const index = this.user.langues.indexOf(language);
      if (index > -1) {
        this.user.langues.splice(index, 1);
      }
    }
  }

  // Gestion des compétences
  onSkillChange(skill: string, event: any): void {
    if (!this.user.skills) {
      this.user.skills = [];
    }

    if (event.target.checked) {
      if (!this.user.skills.includes(skill)) {
        this.user.skills.push(skill);
      }
    } else {
      const index = this.user.skills.indexOf(skill);
      if (index > -1) {
        this.user.skills.splice(index, 1);
      }
    }
  }

  // Vérifier si une langue est sélectionnée
  isLanguageSelected(language: string): boolean {
    return this.user.langues ? this.user.langues.includes(language) : false;
  }

  // Vérifier si une compétence est sélectionnée
  isSkillSelected(skill: string): boolean {
    return this.user.skills ? this.user.skills.includes(skill) : false;
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Préparer les données de mise à jour
    const updateData: UserUpdateData = {
      nom: this.user.nom,
      email: this.user.email,
      telephone: this.user.telephone,
      date_naissance: this.user.date_naissance,
      adresse: this.user.adresse,
      niveau: this.user.niveau,
      langues: this.user.langues,
      skills: this.user.skills,
      // Inclure l'avatar si un fichier a été sélectionné
      ...(this.selectedFile && { avatar: this.selectedFile })
    };

    this.inscriptionService.updateProfile(updateData).subscribe({
      next: (response) => {
        console.log('✅ Profil mis à jour avec succès:', response);
        
        // Afficher l'indicateur de sauvegarde
        this.showSaveIndicator = true;
        setTimeout(() => {
          this.showSaveIndicator = false;
        }, 3000);

        this.isSubmitting = false;
        this.selectedFile = null;
        
        // Recharger les données pour avoir les dernières infos
        this.loadUserProfile();
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour profil:', error);
        alert('Erreur lors de la mise à jour: ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  // Calculer la progression du formulaire
  calculateProgress(): number {
    let filledFields = 0;
    const totalFields = 8;

    if (this.user.nom && this.user.nom.trim() !== '') filledFields++;
    if (this.user.email && this.user.email.trim() !== '') filledFields++;
    if (this.user.telephone && this.user.telephone.trim() !== '') filledFields++;
    if (this.user.date_naissance) filledFields++;
    if (this.user.adresse && this.user.adresse.trim() !== '') filledFields++;
    if (this.user.niveau && this.user.niveau.trim() !== '') filledFields++;
    if (this.user.langues && this.user.langues.length > 0) filledFields++;
    if (this.user.skills && this.user.skills.length > 0) filledFields++;

    return (filledFields / totalFields) * 100;
  }
}