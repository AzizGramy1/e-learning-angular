import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesService } from 'src/app/Service/Courses/courses.service';

interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  image: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
  description: string;
  whatYouLearn: string[];
  created_at?: string;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  // Propriétés pour les nouveaux cours
  newCourses: any[] = [];
  isLoadingNewCourses = false;
  showAllNewCourses = false;
  
  // Propriétés pour le catalogue complet
  filteredCourses: any[] = [];
  allCourses: any[] = [];
  isLoading = false;
  searchQuery = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  selectedPrice = 'all';
  sortBy = 'popular';
  showMobileFilters = false;
  isDesktop = window.innerWidth >= 1024;
  currentSlide = 0;

  // Données pour les filtres
  categories = [
    { value: 'all', label: 'Tous les cours', icon: 'fas fa-th', count: 9 },
    { value: 'development', label: 'Développement', icon: 'fas fa-code', count: 6 },
    { value: 'design', label: 'Design', icon: 'fas fa-palette', count: 1 },
    { value: 'business', label: 'Business', icon: 'fas fa-chart-line', count: 1 },
    { value: 'marketing', label: 'Marketing', icon: 'fas fa-bullhorn', count: 1 },
    { value: 'photography', label: 'Photographie', icon: 'fas fa-camera', count: 1 }
  ];

  levels = [
    { value: 'all', label: 'Tous niveaux' },
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' }
  ];

  priceRanges = [
    { value: 'all', label: 'Tous les prix' },
    { value: 'free', label: 'Gratuit' },
    { value: 'paid', label: 'Payant' },
    { value: 'discount', label: 'En promotion' }
  ];

  sortOptions = [
    { value: 'popular', label: 'Populaires' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'price-low', label: 'Prix croissant' },
    { value: 'price-high', label: 'Prix décroissant' }
  ];

  // Carrousel Hero
  heroSlides = [
    {
      title: "Débuter avec Angular",
      subtitle: "Maîtrisez le framework frontend le plus demandé",
      description: "Apprenez à créer des applications web modernes avec Angular, TypeScript et les meilleures pratiques de l'industrie",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Commencer maintenant",
      badge: "NOUVEAU",
      price: 49.99,
      originalPrice: 89.99,
      students: 12450,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: "Expert en UI/UX Design",
      subtitle: "Devenez un designer d'expérience recherché",
      description: "Formation complète en design d'interface et expérience utilisateur avec Figma, Adobe XD et les méthodologies Agile",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Découvrir",
      badge: "BESTSELLER",
      price: 59.99,
      originalPrice: 99.99,
      students: 8920,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: "JavaScript Moderne Gratuit",
      subtitle: "Les fondamentaux pour tous",
      description: "Apprenez JavaScript de zéro avec ce cours gratuit et devenez un développeur web compétent. Pas de prérequis nécessaire !",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Apprendre Gratuitement",
      badge: "GRATUIT",
      price: 0,
      students: 35600,
      color: 'from-green-500 to-emerald-600'
    }
  ];

  // Catalogue de cours (pour fallback ou démo)
  demoCourses: Course[] = [
    {
      id: 1,
      title: "Angular - De Zéro à Expert",
      instructor: "Marie Dubois",
      price: 49.99,
      originalPrice: 89.99,
      rating: 4.8,
      students: 12450,
      duration: "12h",
      level: "intermediate",
      category: "development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      tags: ["Angular", "TypeScript", "Frontend"],
      description: "Maîtrisez Angular pour créer des applications web modernes et performantes",
      whatYouLearn: [
        "Créer des applications Angular complètes",
        "Utiliser TypeScript comme un pro",
        "Gérer l'état avec NgRx",
        "Déployer votre application"
      ]
    },
    {
      id: 2,
      title: "React - Le Guide Complet",
      instructor: "Pierre Martin",
      price: 39.99,
      rating: 4.9,
      students: 18720,
      duration: "15h",
      level: "beginner",
      category: "development",
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      tags: ["React", "JavaScript", "Frontend"],
      description: "Apprenez React et son écosystème pour devenir un développeur frontend compétent",
      whatYouLearn: [
        "Les bases de React et JSX",
        "Hooks et état local",
        "Routing avec React Router",
        "Intégration d'APIs"
      ]
    }
  ];

  constructor(
    private coursesService: CoursesService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNewCourses();
    this.loadAllCourses();
    this.startCarousel();
  }

  // Charger les nouveaux cours
  loadNewCourses(): void {
    this.isLoadingNewCourses = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.newCourses = courses
          .filter((course: any) => course.isNew)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, this.showAllNewCourses ? 100 : 8);
        this.isLoadingNewCourses = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des nouveaux cours:', error);
        this.newCourses = this.demoCourses.filter(course => course.isNew);
        this.isLoadingNewCourses = false;
      }
    });
  }

  // Charger tous les cours pour le catalogue
  loadAllCourses(): void {
    this.isLoading = true;
    this.coursesService.getCourses().subscribe({
      next: (courses) => {
        this.allCourses = courses;
        this.applyFilters();
        this.updateCategoryCounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cours:', error);
        this.allCourses = this.demoCourses;
        this.applyFilters();
        this.updateCategoryCounts();
        this.isLoading = false;
      }
    });
  }

  // Basculer l'affichage de tous les nouveaux cours
  toggleAllNewCourses(): void {
    this.showAllNewCourses = !this.showAllNewCourses;
    this.loadNewCourses();
  }

  // Appliquer les filtres sur le catalogue
  applyFilters(): void {
    let filtered = [...this.allCourses];

    // Filtrer par recherche
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        (course.description && course.description.toLowerCase().includes(query)) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    // Filtrer par catégorie
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    // Filtrer par niveau
    if (this.selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === this.selectedLevel);
    }

    // Filtrer par prix
    if (this.selectedPrice !== 'all') {
      switch(this.selectedPrice) {
        case 'free':
          filtered = filtered.filter(course => course.price === 0);
          break;
        case 'paid':
          filtered = filtered.filter(course => course.price > 0);
          break;
        case 'discount':
          filtered = filtered.filter(course => course.originalPrice && course.originalPrice > course.price);
          break;
      }
    }

    // Trier
    this.filteredCourses = this.sortCoursesArray(filtered, this.sortBy);
  }

  // Méthode de tri générique
  sortCoursesArray(courses: any[], sortBy: string): any[] {
    const sorted = [...courses];
    
    switch(sortBy) {
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.students - a.students);
        break;
    }
    
    return sorted;
  }

  // Mettre à jour les compteurs de catégories
  updateCategoryCounts(): void {
    this.categories.forEach(category => {
      if (category.value !== 'all') {
        category.count = this.allCourses.filter(course => course.category === category.value).length;
      } else {
        category.count = this.allCourses.length;
      }
    });
  }

  // Méthodes pour le carousel
  startCarousel(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Gestion des événements de filtrage
  onSearchChange(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onLevelChange(): void {
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  enrollCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  // Méthodes utilitaires
  formatDate(dateString: string): string {
    if (!dateString) return 'Récemment';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'développement': 'fas fa-code',
      'design': 'fas fa-paint-brush',
      'business': 'fas fa-chart-line',
      'marketing': 'fas fa-bullhorn',
      'photographie': 'fas fa-camera',
      'musique': 'fas fa-music',
      'santé': 'fas fa-heartbeat',
      'langues': 'fas fa-language',
      'development': 'fas fa-code',
      'photography': 'fas fa-camera',
      'default': 'fas fa-graduation-cap'
    };
    return icons[category] || icons['default'];
  }

  getDiscountPercentage(original: number, current: number): number {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  getSortLabel(): string {
    const option = this.sortOptions.find(opt => opt.value === this.sortBy);
    return option ? option.label : 'Populaires';
  }

  getSlidePoints(slideIndex: number): string[] {
    const points = [
      ['Certification incluse', 'Accès à vie', 'Support 24/7', 'Projets pratiques'],
      ['Design moderne', 'Figma inclus', 'Portfolio ready', 'Mentorat'],
      ['JavaScript ES6+', 'Projets réels', 'Communauté active', 'Carrière garantie']
    ];
    return points[slideIndex] || points[0];
  }

  // Gestion du scroll pour la navbar
  @HostListener('window:scroll')
  onWindowScroll() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 100) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}