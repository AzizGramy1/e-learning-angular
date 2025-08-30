import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cours-etudiant-detail',
  templateUrl: './cours-etudiant-detail.component.html',
  styleUrls: ['./cours-etudiant-detail.component.scss']
})
export class CoursEtudiantDetailComponent implements OnInit {
  isSidebarOpen = false;
  isUserMenuOpen = false;
  searchQuery = '';
  activeTab = 'Contenu du cours';
  tabs = ['Contenu du cours', 'Aperçu', 'Instructeur', 'Notes', 'Avis', 'Ressources'];
  
  modules = [
    {
      title: 'Module 1: Les bases de JavaScript',
      completed: 8,
      total: 10,
      isOpen: true,
      lessons: [
        { title: '1.1 Introduction à JavaScript', completed: true, duration: '15 min', type: 'video' },
        { title: '1.2 Variables et types de données', completed: true, duration: '22 min', type: 'video' },
        { title: '1.3 Structures de contrôle', completed: false, duration: '18 min', type: 'video' },
        { title: '1.4 Quiz: Les bases', completed: false, duration: '10 min', type: 'quiz' }
      ]
    },
    {
      title: 'Module 2: JavaScript Moderne (ES6+)',
      completed: 3,
      total: 12,
      isOpen: true,
      lessons: [
        { title: '2.1 Introduction à ES6', completed: true, duration: '12 min', type: 'video' },
        { title: '2.2 Arrow functions', completed: true, duration: '20 min', type: 'video' },
        { title: '2.3 Destructuring', completed: true, duration: '15 min', type: 'video' },
        { title: '2.4 Modules et imports', completed: false, duration: '25 min', type: 'video' },
        { title: '2.5 Async/Await', completed: false, duration: '30 min', type: 'video' }
      ]
    }
  ];

  reviews = [
    {
      name: 'Sophie Martin',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 5,
      comment: 'Ce cours est exceptionnel! Les explications sont claires et les projets pratiques m\'ont vraiment aidé à consolider mes connaissances. Je recommande vivement!',
      date: 'Il y a 2 semaines'
    },
    {
      name: 'Thomas Bernard',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 4.5,
      comment: 'J\'ai beaucoup appris grâce à ce cours. Le formateur explique très bien et le rythme est parfait. Les exercices pratiques sont pertinents et utiles.',
      date: 'Il y a 1 mois'
    }
  ];

  instructor = {
    name: 'Pierre Martin',
    title: 'Développeur Full-Stack',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    students: '24,589',
    courses: 12,
    bio: 'Développeur avec 10 ans d\'expérience, spécialisé dans JavaScript et les technologies modernes. Passionné par l\'enseignement et le partage de connaissances.'
  };

  progress = {
    lessonsCompleted: 11,
    totalLessons: 32,
    quizzesCompleted: 2,
    totalQuizzes: 5,
    timeSpent: '8h 30m',
    timeSpentPercent: 27
  };

  resources = [
    { name: 'Guide de référence JavaScript.pdf', iconClass: 'fas fa-file-pdf text-blue-400', iconBgClass: 'bg-blue-500 bg-opacity-20' },
    { name: 'Projets pratiques.zip', iconClass: 'fas fa-file-code text-green-400', iconBgClass: 'bg-green-500 bg-opacity-20' },
    { name: 'Liens utiles.html', iconClass: 'fas fa-link text-purple-400', iconBgClass: 'bg-purple-500 bg-opacity-20' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeProgressBars();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleModule(module: any): void {
    module.isOpen = !module.isOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Implement logout logic
    this.router.navigate(['login']);
  }

  continueCourse(): void {
    // Implement course continuation logic
    console.log('Continuing course...');
  }

  saveCourse(): void {
    // Implement save course logic
    console.log('Saving course...');
  }

  shareCourse(): void {
    // Implement share course logic
    console.log('Sharing course...');
  }

  viewNotifications(): void {
    // Implement notifications logic
    console.log('Viewing notifications...');
  }

  openSettings(): void {
    // Implement settings logic
    this.router.navigate(['settings']);
  }

  viewInstructorProfile(): void {
    // Implement instructor profile logic
    console.log('Viewing instructor profile...');
  }

  downloadResource(resource: any): void {
    // Implement resource download logic
    console.log('Downloading resource:', resource.name);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const userMenu = document.getElementById('userMenu');
    const userMenuButton = document.getElementById('userMenuButton');
    if (userMenu && userMenuButton && !userMenu.contains(event.target as Node) && !userMenuButton.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const elements = document.querySelectorAll('.review-card, .instructor-card, .resource-card');
    const screenPosition = window.innerHeight / 1.3;

    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < screenPosition) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translateY(0)';
      }
    });
  }

  private initializeProgressBars(): void {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
      const percent = (bar.querySelector('div') as HTMLElement).style.width;
      (bar.querySelector('div') as HTMLElement).style.width = '0';
      setTimeout(() => {
        (bar.querySelector('div') as HTMLElement).style.transition = 'width 1.5s ease';
        (bar.querySelector('div') as HTMLElement).style.width = percent;
      }, 500);
    });
  }
}