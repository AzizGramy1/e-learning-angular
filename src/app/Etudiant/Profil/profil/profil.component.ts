import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent  {

  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  activeTab = 'Aperçu';
  tabs = ['Aperçu', 'Certificats', 'Cours', 'Projets', 'Paramètres'];

  student = {
    name: 'Clara Lefèvre',
    role: 'Étudiante',
    profileImage: 'https://randomuser.me/api/portraits/women/67.jpg',
    location: 'Lyon, France',
    joinYear: '2023',
    level: 'Niveau Intermédiaire',
    email: 'clara.lefevre@example.com',
    phone: '+33 6 98 76 54 32',
    birthDate: '22 avril 2001',
    languages: 'Français, Anglais',
    progress: 68,
    stats: {
      courses: '8',
      hours: '92',
      certificates: '4'
    },
    skills: [
      { name: 'JavaScript', badgeClass: 'bg-blue-900 bg-opacity-50 text-blue-400 px-3 py-1 rounded-full text-sm' },
      { name: 'Python', badgeClass: 'bg-red-900 bg-opacity-50 text-red-400 px-3 py-1 rounded-full text-sm' },
      { name: 'HTML/CSS', badgeClass: 'bg-green-900 bg-opacity-50 text-green-400 px-3 py-1 rounded-full text-sm' },
      { name: 'React', badgeClass: 'bg-purple-900 bg-opacity-50 text-purple-400 px-3 py-1 rounded-full text-sm' },
      { name: 'SQL', badgeClass: 'bg-yellow-900 bg-opacity-50 text-yellow-400 px-3 py-1 rounded-full text-sm' }
    ],
    badges: [
      {
        name: 'Étudiant assidu',
        gradientClass: 'bg-gradient-to-br from-yellow-500 to-yellow-300',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
      },
      {
        name: 'Top 10%',
        gradientClass: 'bg-gradient-to-br from-blue-500 to-blue-300',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />`
      },
      {
        name: 'Débutant prometteur',
        gradientClass: 'bg-gradient-to-br from-purple-500 to-purple-300',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
      }
    ],
    socialLinks: [
      { link: '#', icon: 'fab fa-github' },
      { link: '#', icon: 'fab fa-linkedin-in' },
      { link: '#', icon: 'fab fa-twitter' },
      { link: '#', icon: 'fas fa-globe' }
    ],
    activities: [
      {
        iconBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
        icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
        description: `A obtenu un certificat <span class="text-blue-400">Introduction à Python</span>`,
        time: '10 août 2025 - Note: 88%'
      },
      {
        iconBg: 'bg-green-900 bg-opacity-50 text-green-400',
        icon: `<path stroke-linecap="round" stroke-join="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
        description: `A commencé un nouveau cours <span class="text-green-400">JavaScript Avancé</span>`,
        time: '5 août 2025 - Progression: 25%'
      },
      {
        iconBg: 'bg-purple-900 bg-opacity-50 text-purple-400',
        icon: `<path stroke-linecap="round" stroke-join="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />`,
        description: `A commenté le cours <span class="text-purple-400">HTML/CSS Fondamentaux</span>`,
        time: '1 août 2025 - "Super cours, très clair !'
      }
    ],
    education: [
      { degree: 'Licence en Informatique', year: '2023-Présent', institution: 'Université de Lyon' },
      { degree: 'Baccalauréat Scientifique', year: '2020', institution: 'Lycée Jean Moulin' }
    ],
    experience: [
      { role: 'Stagiaire Développeur Web', period: 'Été 2024', company: 'TechStart Solutions' },
      { role: 'Assistante Tutorat Informatique', period: '2023-2024', company: 'Université de Lyon' }
    ],
    goals: [
      { name: 'Certification JavaScript', progress: 70, color: 'text-blue-400', progressBarClass: 'bg-blue-600' },
      { name: 'Projet Web Personnel', progress: 50, color: 'text-green-400', progressBarClass: 'bg-green-600' },
      { name: '500 heures d\'apprentissage', progress: 20, color: 'text-purple-400', progressBarClass: 'bg-purple-600' }
    ]
  };

  footerSocialLinks = [
    { link: '#', icon: 'fab fa-facebook-f' },
    { link: '#', icon: 'fab fa-twitter' },
    { link: '#', icon: 'fab fa-linkedin-in' },
    { link: '#', icon: 'fab fa-instagram' }
  ];

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  

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
