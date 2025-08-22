import { Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { User } from 'src/app/Models/User';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';

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

  student: User = {
    nom: '',
    email: '',
    role: '',
    avatar_url: '',
    telephone: '',
    date_naissance: '',
    langues: [],
    niveau: '',
    progression: 0,
    heures: 0,
    skills: [],
    badges: [],
    activities: [],
    education: [],
    experience: [],
    goals: []
  };

  constructor(
    private renderer: Renderer2, 
    private sanitizer: DomSanitizer, 
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    // 1️⃣ Décoder le token pour récupérer nom + role + avatar rapidement
    const decoded = this.authService.decodeToken();
    if (decoded) {
      this.student.nom = decoded.nom ?? '';
      this.student.role = decoded.role ?? '';
      if (decoded.avatar_url) {
        this.student.avatar_url = decoded.avatar_url;
      }
    }

    // 2️⃣ Charger les détails complets de l'utilisateur depuis l'API
    this.authService.me().subscribe({
      next: (user: User) => {
        this.student = { ...this.student, ...user }; // fusion token + données DB
      },
      error: (err) => {
        console.error('Erreur lors du chargement du profil', err);
      }
    });
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
}
