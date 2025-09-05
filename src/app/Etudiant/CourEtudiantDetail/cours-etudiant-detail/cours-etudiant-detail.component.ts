import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/Models/Course';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';

@Component({
  selector: 'app-cours-etudiant-detail',
  templateUrl: './cours-etudiant-detail.component.html',
  styleUrls: ['./cours-etudiant-detail.component.scss']
})
export class CoursEtudiantDetailComponent implements OnInit {
  course: Course | undefined;
  courseId!: number;
  loading = false;
  error: string | null = null;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Course ID:', this.courseId);
    if (this.courseId && !isNaN(this.courseId)) {
      this.loadCourse(this.courseId);
    } else {
      this.error = 'Invalid course ID';
      console.error('Invalid course ID:', this.courseId);
    }
  }

  loadCourse(id: number) {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`http://127.0.0.1:8000/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (data) => {
        console.log('API Response:', data);

        // Explicitly map API response to Course interface
        const course: Course = {
          id: data.id,
          title: data.titre || 'Untitled Course', // Fallback if title is missing
          description: data.description || '',
          image: data.image || '',
          status: data.status || 'Nouveau',
          statusLabel: data.statusLabel || data.status || 'Nouveau',
          category: data.category || 'Unknown',
          difficulty: data.difficulty || 'Beginner',
          note: data.rating || 0,
          hoursCompleted: data.hoursCompleted || 0,
          hoursTotal: data.hoursTotal || 0,
          chaptersCompleted: data.chaptersCompleted || 0,
          chaptersTotal: data.chaptersTotal || 0,
          progress: data.progress || 0,
          progressColor: data.progressColor || 'bg-blue-500',
          certificateObtained: data.certificateObtained || false,
          instructor: data.auteur || 'Unknown Instructor',
          tags: data.tags || []
        };

        this.course = course;
        console.log('Course assigned:', this.course);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load course. Please try again later.';
        this.loading = false;
        console.error('API Error:', err);
      }
    });
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
    this.router.navigate(['login']);
  }

  continueCourse(): void {
    console.log('Continuing course...');
  }

  saveCourse(): void {
    console.log('Saving course...');
  }

  shareCourse(): void {
    console.log('Sharing course...');
  }

  viewNotifications(): void {
    console.log('Viewing notifications...');
  }

  openSettings(): void {
    this.router.navigate(['settings']);
  }

  viewInstructorProfile(): void {
    console.log('Viewing instructor profile...');
  }

  downloadResource(resource: any): void {
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

  createArray(n: number | undefined): number[] {
    return Array.from({ length: n && n > 0 ? n : 0 }, (_, i) => i);
  }
}