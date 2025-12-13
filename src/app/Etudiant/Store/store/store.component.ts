import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';


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
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent {


    currentSlide = 0;
  searchQuery = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  selectedPrice = 'all';
  sortBy = 'popular';
  showMobileFilters = false;
  isLoading = false;

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

  // Catalogue de cours
  courses: Course[] = [
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
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Sophie Lambert",
      price: 0,
      rating: 4.7,
      students: 8750,
      duration: "8h",
      level: "beginner",
      category: "design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      tags: ["Design", "UI/UX", "Figma"],
      description: "Introduction au design d'interface et d'expérience utilisateur",
      whatYouLearn: [
        "Principes fondamentaux du design",
        "Utilisation de Figma",
        "Création de wireframes",
        "Tests d'utilisabilité"
      ]
    },
    {
      id: 4,
      title: "Python pour la Data Science",
      instructor: "Thomas Leroy",
      price: 59.99,
      originalPrice: 79.99,
      rating: 4.6,
      students: 9320,
      duration: "20h",
      level: "advanced",
      category: "development",
      image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      tags: ["Python", "Data Science", "ML"],
      description: "Utilisez Python pour l'analyse de données et le machine learning",
      whatYouLearn: [
        "Pandas pour l'analyse de données",
        "Visualisation avec Matplotlib",
        "Machine Learning basique",
        "Numpy et SciPy"
      ]
    },
    {
      id: 5,
      title: "Marketing Digital 2024",
      instructor: "Laura Petit",
      price: 29.99,
      rating: 4.5,
      students: 6540,
      duration: "10h",
      level: "beginner",
      category: "marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      tags: ["Marketing", "SEO", "Réseaux sociaux"],
      description: "Stratégies de marketing digital pour booster votre business",
      whatYouLearn: [
        "SEO et référencement naturel",
        "Marketing sur les réseaux sociaux",
        "Email marketing",
        "Analyse de données marketing"
      ]
    },
    {
      id: 6,
      title: "Photographie Professionnelle",
      instructor: "Marc Dupont",
      price: 44.99,
      originalPrice: 69.99,
      rating: 4.8,
      students: 5230,
      duration: "14h",
      level: "intermediate",
      category: "photography",
      image: "https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      tags: ["Photographie", "Lightroom", "Composition"],
      description: "Maîtrisez l'art de la photographie comme un professionnel",
      whatYouLearn: [
        "Réglages de l'appareil photo",
        "Composition et cadrage",
        "Retouche avec Lightroom",
        "Photographie de portrait"
      ]
    },
    {
      id: 7,
      title: "Node.js & Express Avancé",
      instructor: "David Moreau",
      price: 54.99,
      originalPrice: 74.99,
      rating: 4.7,
      students: 11200,
      duration: "18h",
      level: "intermediate",
      category: "development",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      tags: ["Node.js", "Express", "Backend"],
      description: "Développez des APIs robustes avec Node.js et Express",
      whatYouLearn: [
        "Architecture RESTful",
        "Middleware et authentification",
        "Bases de données MongoDB",
        "Déploiement et scaling"
      ]
    },
    {
      id: 8,
      title: "Vue.js 3 - Composition API",
      instructor: "Émilie Rousseau",
      price: 42.99,
      rating: 4.8,
      students: 8450,
      duration: "14h",
      level: "intermediate",
      category: "development",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      tags: ["Vue.js", "Composition API", "Frontend"],
      description: "Découvrez Vue.js 3 et la nouvelle Composition API",
      whatYouLearn: [
        "Vue.js 3 et Composition API",
        "Vue Router et Vuex",
        "Composants réutilisables",
        "Performance et optimisation"
      ]
    },
    {
      id: 9,
      title: "AWS Cloud Practitioner",
      instructor: "Nicolas Bernard",
      price: 69.99,
      originalPrice: 99.99,
      rating: 4.6,
      students: 7230,
      duration: "16h",
      level: "beginner",
      category: "development",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      tags: ["AWS", "Cloud", "DevOps"],
      description: "Préparez la certification AWS Cloud Practitioner",
      whatYouLearn: [
        "Services AWS fondamentaux",
        "Architecture cloud",
        "Sécurité et compliance",
        "Facturation et support"
      ]
    }
  ];

  filteredCourses: Course[] = [];
isDesktop: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCarousel();
    this.filteredCourses = this.courses;
    this.updateCategoryCounts();
  }

  // Carrousel automatique
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

  // Filtrage des cours
  filterCourses(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.filteredCourses = this.courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             course.tags.some(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        const matchesCategory = this.selectedCategory === 'all' || course.category === this.selectedCategory;
        const matchesLevel = this.selectedLevel === 'all' || course.level === this.selectedLevel;
        
        let matchesPrice = true;
        if (this.selectedPrice === 'free') {
          matchesPrice = course.price === 0;
        } else if (this.selectedPrice === 'paid') {
          matchesPrice = course.price > 0;
        } else if (this.selectedPrice === 'discount') {
          matchesPrice = course.originalPrice !== undefined;
        }
        
        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
      });

      this.sortCourses();
      this.updateCategoryCounts();
      this.isLoading = false;
    }, 300);
  }

  sortCourses(): void {
    switch (this.sortBy) {
      case 'newest':
        this.filteredCourses.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        break;
      case 'rating':
        this.filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        this.filteredCourses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredCourses.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        this.filteredCourses.sort((a, b) => b.students - a.students);
        break;
    }
  }

  updateCategoryCounts(): void {
    this.categories.forEach(category => {
      if (category.value !== 'all') {
        category.count = this.courses.filter(course => course.category === category.value).length;
      } else {
        category.count = this.courses.length;
      }
    });
  }

  // Gestion des événements
  onSearchChange(): void {
    this.filterCourses();
  }

  onCategoryChange(): void {
    this.filterCourses();
  }

  onLevelChange(): void {
    this.filterCourses();
  }

  onPriceChange(): void {
    this.filterCourses();
  }

  onSortChange(): void {
    this.sortCourses();
  }

  enrollCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  // Utilitaires
  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getCategoryIcon(category: string): string {
    const categoryObj = this.categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : 'fas fa-th';
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
