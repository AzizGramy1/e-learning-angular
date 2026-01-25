import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User } from 'src/app/Models/User';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { UserService } from 'src/app/Service/User/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit  {

  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  activeTab = 'Aperçu';
  tabs = ['Aperçu', 'Certificats', 'Cours', 'Projets', 'Paramètres'];

  // États pour les modals
  isEditModalOpen = false;
  isSkillsModalOpen = false;
  isEducationModalOpen = false;
  isExperienceModalOpen = false;
  isGoalsModalOpen = false;
  isLoading = false;
  
  editProfileForm!: FormGroup;
  educationForm!: FormGroup;
  experienceForm!: FormGroup;
  goalForm!: FormGroup;

  student: User = {
    nom: '',
    email: '',
    role: '',
    avatar_url: '',
    telephone: '',
    date_naissance: '',
    langues: [],
    niveau: '',
    adresse: '',
    progression: 0,
    heures: 0,
    skills: [],
    badges: [],
    activities: [],
    education: [],
    experience: [],
    goals: []
  };

  // Listes disponibles
  availableSkills = [
    'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js',
    'Node.js', 'Python', 'Java', 'PHP', 'Laravel',
    'HTML/CSS', 'SQL', 'MongoDB', 'Docker', 'Git',
    'AWS', 'Azure', 'Machine Learning', 'AI', 'Design UI/UX',
    'Photoshop', 'Figma', 'Agile', 'Scrum', 'Leadership',
    'Communication', 'Gestion de projet', 'Marketing Digital'
  ];

  // Sélections temporaires
  selectedSkills: string[] = [];
  editingEducationIndex: number = -1;
  editingExperienceIndex: number = -1;
  editingGoalIndex: number = -1;

  @ViewChild('fileInput') fileInput: any;

  constructor(
    private renderer: Renderer2, 
    private sanitizer: DomSanitizer, 
    private authService: AuthentificationService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const decoded = this.authService.decodeToken();
    if (decoded) {
      this.student.nom = decoded.nom ?? '';
      this.student.role = decoded.role ?? '';
      if (decoded.avatar_url) {
        this.student.avatar_url = decoded.avatar_url;
      }
    }

    this.initEditForm();
    this.initEducationForm();
    this.initExperienceForm();
    this.initGoalForm();

    this.authService.me().subscribe({
      next: (user: User) => {
        user = this.normalizeUserData(user);
        this.student = { ...this.student, ...user };
        this.updateFormWithUserData();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil', err);
      }
    });
  }

  /**
   * Normalise les données utilisateur
   */
  private normalizeUserData(user: User): User {
    const langues = user.langues;
    
    if (langues !== undefined && langues !== null) {
      if (typeof langues === 'string') {
        const languesStr: string = langues;
        if (languesStr.trim() !== '') {
          user.langues = languesStr
            .split(',')
            .map((lang: string) => lang.trim())
            .filter((lang: string) => lang !== '');
        } else {
          user.langues = [];
        }
      } else if (!Array.isArray(langues)) {
        user.langues = [];
      }
    } else {
      user.langues = [];
    }

    user.skills = Array.isArray(user.skills) ? user.skills : [];
    user.badges = Array.isArray(user.badges) ? user.badges : [];
    user.activities = Array.isArray(user.activities) ? user.activities : [];
    user.education = Array.isArray(user.education) ? user.education : [];
    user.experience = Array.isArray(user.experience) ? user.experience : [];
    user.goals = Array.isArray(user.goals) ? user.goals : [];

    return user;
  }

  initEditForm(): void {
    this.editProfileForm = this.fb.group({
      nom: [this.student.nom || '', [Validators.required]],
      email: [this.student.email || '', [Validators.required, Validators.email]],
      telephone: [this.student.telephone || ''],
      date_naissance: [this.student.date_naissance || ''],
      niveau: [this.student.niveau || ''],
      langues: [this.getLanguesAsString(this.student.langues)],
      adresse: [this.student.adresse || ''],
      avatar_url: [this.student.avatar_url || '']
    });
  }

  initEducationForm(): void {
    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      institution: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  initExperienceForm(): void {
    this.experienceForm = this.fb.group({
      role: ['', Validators.required],
      company: ['', Validators.required],
      period: ['', Validators.required]
    });
  }

  initGoalForm(): void {
    this.goalForm = this.fb.group({
      name: ['', Validators.required],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      color: ['text-blue-400'],
      progressBarClass: ['bg-gradient-to-r from-blue-500 to-blue-300']
    });
  }

  private getLanguesAsString(langues: any): string {
    if (Array.isArray(langues)) {
      return langues.join(', ');
    }
    if (typeof langues === 'string') {
      return langues;
    }
    return '';
  }

  updateFormWithUserData(): void {
    if (this.editProfileForm) {
      this.editProfileForm.patchValue({
        nom: this.student.nom || '',
        email: this.student.email || '',
        telephone: this.student.telephone || '',
        date_naissance: this.student.date_naissance || '',
        niveau: this.student.niveau || '',
        langues: this.getLanguesAsString(this.student.langues),
        adresse: this.student.adresse || '',
        avatar_url: this.student.avatar_url || ''
      });
    }
  }

  // ==================== MODAL PROFIL ====================
  
  openEditModal(): void {
    this.updateFormWithUserData();
    this.isEditModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 5MB)');
        return;
      }

      if (!file.type.match('image.*')) {
        alert('Veuillez sélectionner une image');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editProfileForm.patchValue({
          avatar_url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.editProfileForm.invalid) {
      this.editProfileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData: any = { ...this.editProfileForm.value };
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('ID utilisateur non trouvé');
      this.isLoading = false;
      alert('Erreur : ID utilisateur non trouvé');
      return;
    }

    this.userService.updateUser(userId, formData).subscribe({
      next: (response: any) => {
        let updatedUser: User = response.success && response.data ? response.data : response;
        updatedUser = this.normalizeUserData(updatedUser);
        
        this.student = { 
          ...this.student, 
          ...updatedUser,
          skills: updatedUser.skills || this.student.skills,
          badges: updatedUser.badges || this.student.badges,
          activities: updatedUser.activities || this.student.activities,
          education: updatedUser.education || this.student.education,
          experience: updatedUser.experience || this.student.experience,
          goals: updatedUser.goals || this.student.goals
        };
        
        this.updateFormWithUserData();
        this.closeEditModal();
        this.isLoading = false;
        alert('Profil mis à jour avec succès !');
      },
      error: (err) => {
        this.isLoading = false;
        let errorMessage = 'Erreur inconnue';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.errors) {
          const errors = Object.values(err.error.errors).flat();
          errorMessage = errors.join(', ');
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        alert(`Erreur lors de la mise à jour du profil: ${errorMessage}`);
      }
    });
  }

  // ==================== MODAL COMPÉTENCES ====================
  
  openSkillsModal(): void {
    this.selectedSkills = [...(this.student.skills || [])];
    this.isSkillsModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSkillsModal(): void {
    this.isSkillsModalOpen = false;
    document.body.style.overflow = 'auto';
  }

  toggleSkill(skill: string): void {
    const index = this.selectedSkills.indexOf(skill);
    if (index > -1) {
      this.selectedSkills.splice(index, 1);
    } else {
      this.selectedSkills.push(skill);
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.selectedSkills.includes(skill);
  }

  saveSkills(): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      alert('Erreur : ID utilisateur non trouvé');
      this.isLoading = false;
      return;
    }

    const data = { skills: this.selectedSkills };

    this.userService.updateUser(userId, data).subscribe({
      next: (response: any) => {
        this.student.skills = this.selectedSkills;
        this.closeSkillsModal();
        this.isLoading = false;
        alert('Compétences mises à jour avec succès !');
      },
      error: (err) => {
        this.isLoading = false;
        alert('Erreur lors de la mise à jour des compétences');
      }
    });
  }

  // ==================== MODAL FORMATION ====================
  
  openEducationModal(index: number = -1): void {
    this.editingEducationIndex = index;
    
    if (index >= 0 && this.student.education && this.student.education[index]) {
      const edu = this.student.education[index];
      this.educationForm.patchValue({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || ''
      });
    } else {
      this.educationForm.reset();
    }
    
    this.isEducationModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeEducationModal(): void {
    this.isEducationModalOpen = false;
    this.editingEducationIndex = -1;
    document.body.style.overflow = 'auto';
  }

  saveEducation(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    const newEducation = this.educationForm.value;
    let educationList = [...(this.student.education || [])];

    if (this.editingEducationIndex >= 0) {
      educationList[this.editingEducationIndex] = newEducation;
    } else {
      educationList.push(newEducation);
    }

    this.updateUserData({ education: educationList });
  }

  deleteEducation(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      const educationList = [...(this.student.education || [])];
      educationList.splice(index, 1);
      this.updateUserData({ education: educationList });
    }
  }

  // ==================== MODAL EXPÉRIENCE ====================
  
  openExperienceModal(index: number = -1): void {
    this.editingExperienceIndex = index;
    
    if (index >= 0 && this.student.experience && this.student.experience[index]) {
      const exp = this.student.experience[index];
      this.experienceForm.patchValue({
        role: exp.role || '',
        company: exp.company || '',
        period: exp.period || ''
      });
    } else {
      this.experienceForm.reset();
    }
    
    this.isExperienceModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeExperienceModal(): void {
    this.isExperienceModalOpen = false;
    this.editingExperienceIndex = -1;
    document.body.style.overflow = 'auto';
  }

  saveExperience(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    const newExperience = this.experienceForm.value;
    let experienceList = [...(this.student.experience || [])];

    if (this.editingExperienceIndex >= 0) {
      experienceList[this.editingExperienceIndex] = newExperience;
    } else {
      experienceList.push(newExperience);
    }

    this.updateUserData({ experience: experienceList });
  }

  deleteExperience(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette expérience ?')) {
      const experienceList = [...(this.student.experience || [])];
      experienceList.splice(index, 1);
      this.updateUserData({ experience: experienceList });
    }
  }

  // ==================== MODAL OBJECTIFS ====================
  
  openGoalsModal(index: number = -1): void {
    this.editingGoalIndex = index;
    
    if (index >= 0 && this.student.goals && this.student.goals[index]) {
      const goal = this.student.goals[index];
      this.goalForm.patchValue({
        name: goal.name || '',
        progress: goal.progress || 0,
        color: goal.color || 'text-blue-400',
        progressBarClass: goal.progressBarClass || 'bg-gradient-to-r from-blue-500 to-blue-300'
      });
    } else {
      this.goalForm.reset({
        progress: 0,
        color: 'text-blue-400',
        progressBarClass: 'bg-gradient-to-r from-blue-500 to-blue-300'
      });
    }
    
    this.isGoalsModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeGoalsModal(): void {
    this.isGoalsModalOpen = false;
    this.editingGoalIndex = -1;
    document.body.style.overflow = 'auto';
  }

  saveGoal(): void {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }

    const newGoal = this.goalForm.value;
    let goalsList = [...(this.student.goals || [])];

    if (this.editingGoalIndex >= 0) {
      goalsList[this.editingGoalIndex] = newGoal;
    } else {
      goalsList.push(newGoal);
    }

    this.updateUserData({ goals: goalsList });
  }

  deleteGoal(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet objectif ?')) {
      const goalsList = [...(this.student.goals || [])];
      goalsList.splice(index, 1);
      this.updateUserData({ goals: goalsList });
    }
  }

  // ==================== HELPER ====================
  
  private updateUserData(data: any): void {
    this.isLoading = true;
    const userId = this.authService.getUserId();

    if (!userId) {
      alert('Erreur : ID utilisateur non trouvé');
      this.isLoading = false;
      return;
    }

    this.userService.updateUser(userId, data).subscribe({
      next: (response: any) => {
        Object.assign(this.student, data);
        this.closeEducationModal();
        this.closeExperienceModal();
        this.closeGoalsModal();
        this.isLoading = false;
        alert('Données mises à jour avec succès !');
      },
      error: (err) => {
        this.isLoading = false;
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  getLanguesDisplay(): string {
    if (Array.isArray(this.student.langues)) {
      return this.student.langues.join(', ');
    }
    if (typeof this.student.langues === 'string') {
      return this.student.langues;
    }
    return 'Non renseigné';
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getSafeSvg(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  onSkillHover(event: Event, isHover: boolean) {
    const element = event.target as HTMLElement;
    if (isHover) {
      this.renderer.addClass(element, 'shadow-md');
    } else {
      this.renderer.removeClass(element, 'shadow-md');
    }
  }

  getDefaultBadgeIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;
  }

  getDefaultActivityIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>`;
  }

  getBadgeIcon(badge: any): SafeHtml {
    const icon = badge?.icon || this.getDefaultBadgeIcon();
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  getActivityIcon(activity: any): SafeHtml {
    const icon = activity?.icon || this.getDefaultActivityIcon();
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}