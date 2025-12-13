import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
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
  selector: 'app-explore-menu',
  templateUrl: './explore-menu.component.html',
  styleUrls: ['./explore-menu.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ExploreMenuComponent implements OnInit {
  currentSlide = 0;
  searchQuery = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  selectedPrice = 'all';
  sortBy = 'popular';

  categories = [
    { value: 'all', label: 'Tous les cours', icon: 'fas fa-th' },
    { value: 'development', label: 'Développement', icon: 'fas fa-code' },
    { value: 'design', label: 'Design', icon: 'fas fa-palette' },
    { value: 'business', label: 'Business', icon: 'fas fa-chart-line' },
    { value: 'marketing', label: 'Marketing', icon: 'fas fa-bullhorn' },
    { value: 'photography', label: 'Photographie', icon: 'fas fa-camera' }
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

  heroSlides = [
    {
      title: "Débuter avec Angular",
      subtitle: "Maîtrisez le framework frontend le plus demandé",
      description: "Apprenez à créer des applications web modernes avec Angular, TypeScript et les meilleures pratiques",
      image: "angular-hero.jpg",
      buttonText: "Commencer maintenant",
      badge: "NOUVEAU",
      price: 49.99,
      originalPrice: 89.99,
      students: 12450
    },
    {
      title: "Expert en UI/UX Design",
      subtitle: "Devenez un designer d'expérience recherché",
      description: "Formation complète en design d'interface et expérience utilisateur avec Figma et Adobe XD",
      image: "design-hero.jpg",
      buttonText: "Découvrir",
      badge: "BESTSELLER",
      price: 59.99,
      originalPrice: 99.99,
      students: 8920
    },
    {
      title: "JavaScript Moderne Gratuit",
      subtitle: "Les fondamentaux pour tous",
      description: "Apprenez JavaScript de zéro avec ce cours gratuit et devenez un développeur web compétent",
      image: "javascript-hero.jpg",
      buttonText: "Apprendre Gratuitement",
      badge: "GRATUIT",
      price: 0,
      students: 35600
    }
  ];

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
      image: "angular-course.jpg",
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
      image: "react-course.jpg",
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
      image: "design-course.jpg",
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
      image: "python-course.jpg",
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
      image: "marketing-course.jpg",
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
      image: "photography-course.jpg",
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
    }
  ];

  filteredCourses: Course[] = [];

  constructor(private router: Router) {}

// Animation d'entrée améliorée
ngOnInit(): void {
  this.startCarousel();
  this.filteredCourses = this.courses;
  this.generateParticles(); // Optionnel
}

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

  filterCourses(): void {
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
    // Ici vous implémenteriez la logique d'inscription
    console.log('Enrollment for course:', courseId);
    this.router.navigate(['/course', courseId]);
  }

  getDiscountPercentage(originalPrice: number, currentPrice: number): number {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }

  getCategoryIcon(category: string): string {
    const categoryObj = this.categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : 'fas fa-th';
  }

  // store.component.ts - Méthodes supplémentaires

getSlidePoints(slideIndex: number): string[] {
  const points = [
    ['Certification incluse', 'Accès à vie', 'Support 24/7', 'Projets pratiques'],
    ['Design moderne', 'Figma inclus', 'Portfolio ready', 'Mentorat'],
    ['JavaScript ES6+', 'Projets réels', 'Communauté active', 'Carrière garantie']
  ];
  return points[slideIndex] || points[0];
}

// Méthode pour générer des particules (optionnel)
generateParticles(): void {
  // Implémentation optionnelle pour des effets de particules
}

getSortLabel(): string {
  const option = this.sortOptions.find(opt => opt.value === this.sortBy);
  return option ? option.label : 'Populaires';
}


}