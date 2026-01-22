import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Abonnement } from 'src/app/Service/paiement.service';


interface AbonnementData {
  type: string;               // Type de transaction ('abonnement' ou 'ponctuel')
  planId: string;             // ID unique du plan
  planName: string;           // Nom du plan (ex: "Abonnement Mensuel")
  planType: string;           // Type d'abonnement ('mensuel', 'annuel', 'ponctuel')
  price: number;              // Prix du plan
  period: string;             // Période (ex: "par mois", "accès à vie")
  features: string[];         // Caractéristiques du plan
  courseId: number;           // ID du cours (0 pour abonnements mensuel/annuel)
  courseTitle: string;        // Titre du cours
  coursePrice: number;        // Prix du cours
  courseOriginalPrice?: number; // Prix original si promotion
  userId: number;             // ID de l'utilisateur
  timestamp: string;          // Date de sélection
} 

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
export class DetailCourComponent implements OnInit {
  // Propriétés principales
  courseId!: number;
  course!: Course;
  activeTab = 'overview';
  showEnrollmentModal = false;
  isVideoPlaying = false;
  currentImageIndex = 0;
  relatedCourses: Course[] = [];

  // Propriétés pour les abonnements
  showAbonnementModal = false;
  currentUser: any = null;
  userAbonnements: Abonnement[] = [];
  userHasActiveAbonnement = false;
  isLoading = false;
  
  // Message pour les utilisateurs sans abonnement
  abonnementMessage = 'Pour accéder à ce cours, vous avez besoin d\'un abonnement actif.';

  // Options d'abonnement
  abonnementPlans = [
    {
      id: 'mensuel',
      name: 'Abonnement Mensuel',
      price: 19.99,
      period: 'par mois',
      features: ['Accès à tous les cours', 'Support prioritaire', 'Certificats inclus', 'Nouveaux cours mensuels'],
      popular: false,
      type: 'mensuel'
    },
    {
      id: 'annuel',
      name: 'Abonnement Annuel',
      price: 199.99,
      period: 'par an',
      features: ['Économisez 17%', 'Accès à tous les cours', 'Support prioritaire', 'Certificats inclus', 'Cours premium'],
      popular: true,
      type: 'annuel'
    },
    {
      id: 'ponctuel',
      name: 'Abonnement Ponctuel',
      price: 49.99,
      period: 'pour ce cours',
      features: ['Accès illimité à ce cours', 'Certificat inclus', 'Mises à jour gratuites'],
      popular: false,
      type: 'ponctuel'
    }
  ];

  // Données de paiement
  paymentData = {
    type_paiement: 'carte_bancaire' as 'carte_bancaire' | 'virement_bancaire' | 'mobile_money',
    donnees_carte: {
      numero: '',
      expiration: '',
      cvv: '',
      nom: ''
    },
    coupon_code: ''
  };

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
    this.checkUserStatus();
  }

  // Méthodes d'initialisation
  loadCourse(): void {
    this.course = this.courses.find(c => c.id === this.courseId) || this.courses[0];
  }

  loadRelatedCourses(): void {
    this.relatedCourses = this.courses
      .filter(c => c.id !== this.courseId && c.category === this.course.category)
      .slice(0, 3);
  }

  // Vérifier le statut de l'utilisateur (simulation)
  checkUserStatus(): void {
    // Simulation d'utilisateur connecté
    this.currentUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    // Simulation d'abonnements (vide par défaut)
    this.userAbonnements = [];
    this.userHasActiveAbonnement = false;
  }

  // ==================== MÉTHODES D'ABONNEMENT ====================

  // Méthode appelée lors du clic sur "Acheter maintenant"
  goToPayment(): void {
    if (!this.currentUser) {
      // Rediriger vers la page de connexion
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url,
          courseId: this.course.id 
        } 
      });
      return;
    }

    // Vérifier les abonnements de l'utilisateur
    this.isLoading = true;
    
    // Simulation de vérification d'abonnement
    setTimeout(() => {
      this.isLoading = false;
      
      if (this.userAbonnements.length > 0) {
        // L'utilisateur a des abonnements actifs
        const hasValidAbonnement = this.userAbonnements.some(abonnement => 
          abonnement.statut === 'actif' && 
          (abonnement.type_abonnement === 'mensuel' || 
           abonnement.type_abonnement === 'annuel' || 
           (abonnement.type_abonnement === 'ponctuel' && abonnement.course_id === this.course.id))
        );

        if (hasValidAbonnement) {
          // L'utilisateur a déjà un abonnement valide pour ce cours
          this.enrollCourse();
        } else {
          // L'utilisateur a un abonnement mais pas pour ce cours
          this.showAbonnementModal = true;
          this.abonnementMessage = 'Votre abonnement actif ne couvre pas ce cours. Choisissez un plan approprié.';
        }
      } else {
        // L'utilisateur n'a pas d'abonnements actifs
        this.showAbonnementModal = true;
        this.abonnementMessage = 'Pour accéder à ce cours, vous avez besoin d\'un abonnement actif.';
      }
    }, 1000);
  }

  // Valider les données de la carte bancaire
  validerDonneesCarte(): boolean {
    if (this.paymentData.type_paiement !== 'carte_bancaire') return true;
    
    const carte = this.paymentData.donnees_carte;
    
    // Vérifier le numéro de carte (simple validation)
    if (!carte.numero || carte.numero.replace(/\s/g, '').length !== 16) {
      alert('Numéro de carte invalide (16 chiffres requis)');
      return false;
    }
    
    // Vérifier la date d'expiration
    if (!carte.expiration || !carte.expiration.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      alert('Format de date d\'expiration invalide (MM/AA)');
      return false;
    }
    
    // Vérifier le CVV
    if (!carte.cvv || carte.cvv.length < 3 || carte.cvv.length > 4) {
      alert('CVV invalide (3 ou 4 chiffres requis)');
      return false;
    }
    
    // Vérifier le nom
    if (!carte.nom || carte.nom.trim().length < 3) {
      alert('Nom sur la carte invalide');
      return false;
    }
    
    return true;
  }

  // Souscrire à un plan d'abonnement
  souscrireAbonnement(planId: string): void {
    if (!this.currentUser) {
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url,
          courseId: this.course.id 
        } 
      });
      return;
    }

    // Valider les données de paiement
    if (!this.validerDonneesCarte()) {
      return;
    }

    const plan = this.abonnementPlans.find(p => p.id === planId);
    if (!plan) return;

    this.isLoading = true;

    // Préparer les données pour l'API
    const abonnementData: any = {
      user_id: this.currentUser.id,
      type_abonnement: plan.type,
      montant: plan.price,
      course_id: plan.type === 'ponctuel' ? this.course.id : null
    };

    // Ajouter les données de paiement selon la méthode choisie
    const donneesPaiement: any = {
      type_paiement: this.paymentData.type_paiement
    };

    if (this.paymentData.type_paiement === 'carte_bancaire') {
      donneesPaiement.donnees_carte = {
        ...this.paymentData.donnees_carte,
        // Masquer les chiffres pour la sécurité
        numero: '****' + this.paymentData.donnees_carte.numero.slice(-4)
      };
    }

    if (this.paymentData.coupon_code) {
      donneesPaiement.coupon_code = this.paymentData.coupon_code;
    }

    abonnementData.donnees_paiement = donneesPaiement;

    // Simulation d'appel API réussi
    setTimeout(() => {
      this.isLoading = false;
      this.showAbonnementModal = false;
      
      // Ajouter le nouvel abonnement à la liste
      const nouvelAbonnement: Abonnement = this.mapApiAbonnement({
        id: Date.now(),
        ...abonnementData,
        statut: 'actif',
        date_debut: new Date().toISOString(),
        date_fin: this.calculerDateFin(plan.type),
        est_actif: true,
        est_recurrent: plan.type !== 'ponctuel',
        course: plan.type === 'ponctuel' ? {
          id: this.course.id,
          title: this.course.title,
          description: this.course.description,
          image_url: this.course.image,
          instructor_name: this.course.instructor
        } : undefined
      });

      this.userAbonnements.push(nouvelAbonnement);
      this.userHasActiveAbonnement = true;

      // Montrer un message de succès
      alert(`Abonnement ${plan.name} activé avec succès !`);

      // Inscrire automatiquement au cours
      this.enrollCourse();
    }, 2000);
  }

  // Mapper les données d'abonnement de l'API
  private mapApiAbonnement(apiAbonnement: any): Abonnement {
    return {
      id: apiAbonnement.id || 0,
      user_id: apiAbonnement.user_id || 0,
      course_id: apiAbonnement.course_id || null,
      type_abonnement: apiAbonnement.type_abonnement || 'mensuel',
      statut: apiAbonnement.statut || 'en_attente',
      montant: apiAbonnement.montant || 0,
      date_debut: apiAbonnement.date_debut || new Date().toISOString(),
      date_fin: apiAbonnement.date_fin || new Date().toISOString(),
      jours_restants: apiAbonnement.jours_restants || 0,
      est_actif: apiAbonnement.est_actif || false,
      est_recurrent: apiAbonnement.est_recurrent || false,
      course: apiAbonnement.course ? {
        id: apiAbonnement.course.id,
        title: apiAbonnement.course.title,
        description: apiAbonnement.course.description,
        image_url: apiAbonnement.course.image_url,
        instructor_name: apiAbonnement.course.instructor_name
      } : undefined
    };
  }

  // Calculer la date de fin selon le type d'abonnement
  private calculerDateFin(typeAbonnement: string): string {
    const date = new Date();
    switch(typeAbonnement) {
      case 'mensuel':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'annuel':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'ponctuel':
        // Abonnement ponctuel = 1 an pour le cours spécifique
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString().split('T')[0];
  }

  // Inscription au cours
  enrollCourse(): void {
    this.isLoading = true;
    
    // Simulation d'inscription
    setTimeout(() => {
      this.isLoading = false;
      this.showEnrollmentModal = false;
      this.router.navigate(['/learn', this.courseId]);
    }, 1500);
  }

  // ==================== MÉTHODES UTILITAIRES ABONNEMENT ====================

  // Afficher les abonnements actifs (debug)
  afficherAbonnementsActifs(): void {
    console.log('Abonnements actifs:', this.userAbonnements);
    
    if (this.userAbonnements.length === 0) {
      console.log('Aucun abonnement actif');
      return;
    }

    this.userAbonnements.forEach((abonnement, index) => {
      console.log(`Abonnement ${index + 1}:`, {
        type: abonnement.type_abonnement,
        statut: abonnement.statut,
        date_fin: abonnement.date_fin,
        course: abonnement.course_id ? `Cours #${abonnement.course_id}` : 'Tous les cours'
      });
    });
  }

  // Méthode pour vérifier si un abonnement est expiré
  isAbonnementExpire(abonnement: Abonnement): boolean {
    if (!abonnement.date_fin) return true;
    return new Date(abonnement.date_fin) < new Date();
  }

  // Méthode pour obtenir le type d'abonnement en français
  getTypeAbonnementLibelle(type: string): string {
    const types: {[key: string]: string} = {
      'mensuel': 'Mensuel',
      'annuel': 'Annuel',
      'ponctuel': 'Ponctuel'
    };
    return types[type] || type;
  }

  // Méthode pour obtenir le statut avec couleur
  getStatutAbonnementColor(statut: string): string {
    const colors: {[key: string]: string} = {
      'actif': 'text-green-400',
      'en_attente': 'text-yellow-400',
      'expire': 'text-red-400',
      'annule': 'text-gray-400',
      'echec': 'text-red-500',
      'suspendu': 'text-orange-400'
    };
    return colors[statut] || 'text-gray-400';
  }

  // Gestion des erreurs d'abonnement
  gestionErreurAbonnement(error: any): void {
    console.error('Erreur abonnement:', error);
    
    let message = 'Une erreur est survenue lors du traitement de votre abonnement.';
    
    if (error.status === 401) {
      message = 'Votre session a expiré. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
    } else if (error.status === 402) {
      message = 'Paiement refusé. Veuillez vérifier vos informations de paiement.';
    } else if (error.status === 409) {
      message = 'Vous avez déjà un abonnement actif pour ce cours.';
    }
    
    alert(message);
    this.isLoading = false;
  }

  // ==================== MÉTHODES EXISTANTES ====================

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

  // Fermer le modal d'abonnement
  closeAbonnementModal(): void {
    this.showAbonnementModal = false;
  }

  // Changer la méthode de paiement
  changePaymentMethod(method: 'carte_bancaire' | 'virement_bancaire' | 'mobile_money'): void {
    this.paymentData.type_paiement = method;
  }






// AJOUTEZ CETTE MÉTHODE UTILITAIRE
private generatePlanId(planType: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `plan_${planType}_${timestamp}_${random}`;
}


// Méthode pour sauvegarder le choix d'abonnement et rediriger vers le paiement
choisirPlanEtRediriger(planId: string): void {
  console.log('Plan sélectionné:', planId);
  
  if (!this.currentUser) {
    // Rediriger vers la page de connexion si non connecté
    this.router.navigate(['/login'], { 
      queryParams: { 
        returnUrl: this.router.url,
        courseId: this.course.id 
      } 
    });
    return;
  }

  // Récupérer le plan sélectionné
  const plan = this.abonnementPlans.find(p => p.id === planId);
  if (!plan) {
    console.error('Plan non trouvé:', planId);
    return;
  }

  // Déterminer le prix selon le plan
  let prixPlan = plan.price;
  if (planId === 'ponctuel') {
    // Pour l'achat ponctuel, utiliser le prix du cours
    prixPlan = this.course.price;
  }

  // Structure des données de l'abonnement
  const abonnementData: AbonnementData = {
    type: 'abonnement',
    planId: this.generatePlanId(planId), // UTILISER LA NOUVELLE MÉTHODE
    planName: plan.name,
    planType: plan.type,
    price: prixPlan,
    period: plan.period,
    features: plan.features,
    courseId: planId === 'ponctuel' ? this.course.id : 0,
    courseTitle: planId === 'ponctuel' ? this.course.title : 'Tous les cours',
    coursePrice: planId === 'ponctuel' ? this.course.price : 0,
    courseOriginalPrice: planId === 'ponctuel' ? this.course.originalPrice : undefined,
    userId: this.currentUser.id,
    timestamp: new Date().toISOString()
  };

  // Sauvegarder dans localStorage
  localStorage.setItem('selectedAbonnement', JSON.stringify(abonnementData));
  console.log('Données sauvegardées:', abonnementData);
  
  // Fermer le modal si ouvert
  this.showAbonnementModal = false;
  
  // Rediriger vers la page de paiement
this.router.navigate(['/Etudiant/Explore/Course/detailsCours/paiement']);
}


// Méthode pour le bouton "Acheter maintenant" (achat ponctuel)
acheterMaintenant(): void {
  console.log('Achat ponctuel du cours:', this.course.title);
  
  // Créer l'objet de données pour l'achat ponctuel
  const abonnementData: AbonnementData = {
    type: 'ponctuel',
    planId: `course_${this.course.id}_${Date.now()}`,
    planName: this.course.title,
    planType: 'ponctuel',
    price: this.course.price,
    period: 'Accès à vie',
    features: [
      'Accès permanent au cours',
      'Certification incluse',
      'Ressources téléchargeables',
      'Support Q&A'
    ],
    courseId: this.course.id,
    courseTitle: this.course.title,
    coursePrice: this.course.price,
    courseOriginalPrice: this.course.originalPrice,
    userId: this.currentUser?.id || 0,
    timestamp: new Date().toISOString()
  };

  // Sauvegarder dans localStorage
  localStorage.setItem('selectedAbonnement', JSON.stringify(abonnementData));
  console.log('Données sauvegardées:', abonnementData);
  
  // Rediriger vers la page de paiement
  this.router.navigate(['/Etudiant/Store/page-de-paiement-abonnement']);
}
}