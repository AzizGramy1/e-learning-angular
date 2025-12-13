import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


interface Course {
  id: number;
  title: string;
  subtitle: string;
  instructor: string;
  instructorAvatar: string;
  instructorBio: string;
  instructorRating: number;
  instructorStudents: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  image: string;
  videoPreview?: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
  description: string;
  longDescription: string;
  whatYouLearn: string[];
  requirements: string[];
  targetAudience: string[];
  includes: string[];
  curriculum: Module[];
  reviewsList: Review[];
}

interface Module {
  title: string;
  duration: string;
  lessons: Lesson[];
  completed?: boolean;
  expanded?: boolean;
}

interface Lesson {
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz' | 'assignment';
  preview: boolean;
  completed?: boolean;
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: Date;
  comment: string;
  helpful: number;
}


@Component({
  selector: 'app-detail-cour',
  templateUrl: './detail-cour.component.html',
  styleUrls: ['./detail-cour.component.scss']
})
export class DetailCourComponent {


    courseId!: number;
  course!: Course;
  activeTab = 'overview';
  showEnrollmentModal = false;
  isVideoPlaying = false;
  currentImageIndex = 0;
  relatedCourses: Course[] = [];

  // Données simulées pour le cours
  courses: Course[] = [
    {
      id: 1,
      title: "Angular - De Zéro à Expert 2024",
      subtitle: "Maîtrisez le framework frontend le plus demandé avec TypeScript, RxJS et les meilleures pratiques",
      instructor: "Marie Dubois",
      instructorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      instructorBio: "Développeuse Fullstack Senior avec 8 ans d'expérience, spécialiste Angular chez Google. J'ai formé plus de 50,000 étudiants à travers le monde.",
      instructorRating: 4.9,
      instructorStudents: 125000,
      price: 49.99,
      originalPrice: 89.99,
      rating: 4.8,
      reviews: 3247,
      students: 12450,
      duration: "12h 30min",
      level: "intermediate",
      category: "development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      videoPreview: "https://player.vimeo.com/video/76979871",
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      tags: ["Angular", "TypeScript", "Frontend", "RxJS", "Components"],
      description: "Maîtrisez Angular pour créer des applications web modernes et performantes",
      longDescription: `Dans ce cours complet, vous apprendrez à développer des applications web modernes avec Angular, le framework JavaScript de Google. 
      
Ce cours couvre tout ce dont vous avez besoin pour devenir un développeur Angular compétent, des bases fondamentales aux concepts avancés comme les observables RxJS, la gestion d'état avec NgRx, et les performances d'application.

Vous construirez 3 projets réels : une application de gestion de tâches, un clone de Netflix, et une application e-commerce complète avec authentification et paiement.

À la fin de ce cours, vous serez capable de créer des applications Angular professionnelles, de les déployer en production, et de répondre aux exigences du marché actuel.`,
      whatYouLearn: [
        "Créer des applications Angular complètes from scratch",
        "Maîtriser TypeScript comme un développeur professionnel",
        "Gérer l'état complexe avec NgRx et Services",
        "Déployer votre application sur les platforms cloud",
        "Optimiser les performances de vos applications",
        "Intégrer des APIs REST et GraphQL",
        "Mettre en place l'authentification JWT",
        "Tester vos applications avec Jasmine et Karma"
      ],
      requirements: [
        "Connaissances de base en HTML, CSS et JavaScript",
        "Aucune expérience préalable avec Angular requise",
        "Un ordinateur avec connection internet",
        "Enthusiasme pour apprendre !"
      ],
      targetAudience: [
        "Débutants en développement frontend",
        "Développeurs React/Vue.js voulant apprendre Angular",
        "Étudiants en informatique",
        "Professionnels voulant booster leur carrière"
      ],
      includes: [
        "12.5 heures de vidéo à la demande",
        "35 articles ressources",
        "18 exercices pratiques",
        "3 projets complets",
        "Certificat de completion",
        "Accès à vie",
        "Support sur mobile et TV"
      ],
      curriculum: [
        {
          title: "Introduction à Angular",
          duration: "45min",
          completed: true,
          lessons: [
            { title: "Pourquoi Angular en 2024 ?", duration: "8min", type: "video", preview: true, completed: true },
            { title: "Configuration de l'environnement", duration: "12min", type: "video", preview: false, completed: true },
            { title: "Votre première application", duration: "15min", type: "video", preview: false, completed: true },
            { title: "Quiz: Concepts fondamentaux", duration: "10min", type: "quiz", preview: false, completed: true }
          ]
        },
        {
          title: "TypeScript Essentials",
          duration: "1h 20min",
          completed: true,
          lessons: [
            { title: "Types et Interfaces", duration: "15min", type: "video", preview: true, completed: true },
            { title: "Classes et Decorators", duration: "20min", type: "video", preview: false, completed: true },
            { title: "Génériques et Advanced Types", duration: "25min", type: "video", preview: false, completed: true },
            { title: "Exercice pratique TypeScript", duration: "20min", type: "assignment", preview: false, completed: true }
          ]
        },
        {
          title: "Components et Templates",
          duration: "2h 15min",
          completed: false,
          lessons: [
            { title: "Création de Components", duration: "18min", type: "video", preview: false, completed: false },
            { title: "Data Binding et Directives", duration: "25min", type: "video", preview: false, completed: false },
            { title: "Component Communication", duration: "22min", type: "video", preview: false, completed: false },
            { title: "Content Projection", duration: "20min", type: "video", preview: false, completed: false },
            { title: "Lifecycle Hooks", duration: "30min", type: "video", preview: false, completed: false },
            { title: "Projet: Component Library", duration: "20min", type: "assignment", preview: false, completed: false }
          ]
        },
        {
          title: "Services et Dependency Injection",
          duration: "1h 45min",
          completed: false,
          lessons: [
            { title: "Understanding Services", duration: "15min", type: "video", preview: false, completed: false },
            { title: "Dependency Injection", duration: "25min", type: "video", preview: false, completed: false },
            { title: "HTTP Client et APIs", duration: "35min", type: "video", preview: false, completed: false },
            { title: "Interceptors et Error Handling", duration: "30min", type: "video", preview: false, completed: false }
          ]
        },
        {
          title: "Routing et Navigation",
          duration: "1h 30min",
          completed: false,
          lessons: [
            { title: "Router Configuration", duration: "20min", type: "video", preview: false, completed: false },
            { title: "Route Parameters", duration: "25min", type: "video", preview: false, completed: false },
            { title: "Guards et Resolvers", duration: "30min", type: "video", preview: false, completed: false },
            { title: "Lazy Loading", duration: "15min", type: "video", preview: false, completed: false }
          ]
        },
        {
          title: "State Management avec NgRx",
          duration: "2h",
          completed: false,
          lessons: [
            { title: "Introduction à NgRx", duration: "20min", type: "video", preview: false, completed: false },
            { title: "Actions et Reducers", duration: "30min", type: "video", preview: false, completed: false },
            { title: "Selectors et Effects", duration: "35min", type: "video", preview: false, completed: false },
            { title: "Projet: State Management", duration: "35min", type: "assignment", preview: false, completed: false }
          ]
        },
        {
          title: "Projet Final: Application E-commerce",
          duration: "3h",
          completed: false,
          lessons: [
            { title: "Setup et Architecture", duration: "25min", type: "video", preview: false, completed: false },
            { title: "Authentication System", duration: "35min", type: "video", preview: false, completed: false },
            { title: "Product Catalog", duration: "40min", type: "video", preview: false, completed: false },
            { title: "Shopping Cart", duration: "30min", type: "video", preview: false, completed: false },
            { title: "Checkout Process", duration: "30min", type: "video", preview: false, completed: false },
            { title: "Deployment", duration: "20min", type: "video", preview: false, completed: false }
          ]
        }
      ],
      reviewsList: [
        {
          id: 1,
          user: "Thomas Martin",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          rating: 5,
          date: new Date('2024-03-15'),
          comment: "Ce cours a transformé ma carrière ! Les explications sont claires et les projets pratiques m'ont permis de construire un portfolio impressionnant. Je recommande à 100% !",
          helpful: 24
        },
        {
          id: 2,
          user: "Sophie Laurent",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          rating: 5,
          date: new Date('2024-03-10'),
          comment: "Marie est une formatrice exceptionnelle. Sa manière d'expliquer les concepts complexes les rend accessibles à tous. Les exercices sont bien pensés et le support est réactif.",
          helpful: 18
        },
        {
          id: 3,
          user: "David Petit",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          rating: 4,
          date: new Date('2024-03-08'),
          comment: "Excellent contenu, bien structuré. J'aurais aimé plus d'exercices sur les tests unitaires, mais globalement c'est un cours de très haute qualité.",
          helpful: 12
        }
      ]
    }
  ];

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCourse();
    this.loadRelatedCourses();
  }

  loadCourse(): void {
    this.course = this.courses.find(c => c.id === this.courseId) || this.courses[0];
  }

  loadRelatedCourses(): void {
    this.relatedCourses = this.courses
      .filter(c => c.id !== this.courseId && c.category === this.course.category)
      .slice(0, 3);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleEnrollmentModal(): void {
    this.showEnrollmentModal = !this.showEnrollmentModal;
  }

  playVideo(): void {
    this.isVideoPlaying = true;
  }

  closeVideo(): void {
    this.isVideoPlaying = false;
  }

  enrollCourse(): void {
    this.toggleEnrollmentModal();
    // Simulation d'enrollment
    setTimeout(() => {
      this.router.navigate(['/learn', this.courseId]);
    }, 2000);
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getLevelLabel(level: string): string {
    switch (level) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return level;
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  getRatingStars(rating: number): number[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 1 : i - rating < 1 ? 0.5 : 0);
    }
    return stars;
  }

  getTotalLessons(): number {
    return this.course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
  }

  getTotalDuration(): string {
    const totalMinutes = this.course.curriculum.reduce((total, module) => {
      const minutes = parseInt(module.duration);
      return total + (isNaN(minutes) ? 0 : minutes);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}min`;
  }

  getCompletedLessons(): number {
    return this.course.curriculum.reduce((total, module) => {
      return total + module.lessons.filter(lesson => lesson.completed).length;
    }, 0);
  }

  // Méthodes pour les templates
  getTabIcon(tab: string): string {
    switch (tab) {
      case 'overview': return 'fas fa-info-circle';
      case 'curriculum': return 'fas fa-list-ol';
      case 'instructor': return 'fas fa-user-tie';
      case 'reviews': return 'fas fa-star';
      default: return 'fas fa-info-circle';
    }
  }

  getTabLabel(tab: string): string {
    switch (tab) {
      case 'overview': return 'Aperçu';
      case 'curriculum': return 'Programme';
      case 'instructor': return 'Formateur';
      case 'reviews': return 'Avis';
      default: return 'Aperçu';
    }
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'video': return 'fas fa-play';
      case 'article': return 'fas fa-file-text';
      case 'quiz': return 'fas fa-question-circle';
      case 'assignment': return 'fas fa-tasks';
      default: return 'fas fa-play';
    }
  }

  getRatingPercentage(rating: number): number {
    // Simulation des pourcentages de notes
    const distribution: {[key: number]: number} = {5: 65, 4: 20, 3: 10, 2: 3, 1: 2};
    return distribution[rating] || 0;
  }

  getCourseHighlights(): any[] {
    return [
      {
        icon: 'fas fa-play-circle',
        color: 'text-blue-400',
        title: 'Accès à vie',
        subtitle: 'Apprenez à votre rythme'
      },
      {
        icon: 'fas fa-mobile-alt',
        color: 'text-green-400',
        title: 'Accès mobile et TV',
        subtitle: 'Sur tous vos appareils'
      },
      {
        icon: 'fas fa-certificate',
        color: 'text-yellow-400',
        title: 'Certificat de completion',
        subtitle: 'Validez vos compétences'
      },
      {
        icon: 'fas fa-download',
        color: 'text-purple-400',
        title: 'Ressources téléchargeables',
        subtitle: 'Fiches et exercices inclus'
      }
    ];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}
