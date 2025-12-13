import { Component, HostListener, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/Models/Course';
import { User } from 'src/app/Models/User';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { EnseignantCourService } from 'src/app/Service/EnseignantCour/enseignant-cour.service';

@Component({
  selector: 'app-dashboard-enseignant',
  templateUrl: './dashboard-enseignant.component.html',
  styleUrls: ['./dashboard-enseignant.component.scss']
})
export class DashboardEnseignantComponent {

  // AJOUTER CES PROPRIÉTÉS
  realTaughtCourses: any[] = [];
  loadingCourses = false;
  coursesError = '';

  isSidebarOpen = false;
  isUserMenuOpen = false;
  searchQuery = '';


  isCreateMenuOpen = false;


  teacher = {
    name: 'Prof. Luc Dubois',
    role: 'Enseignant',
    engagement: 82
  };

  menuItems = [
    {
      label: 'Tableau de bord',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />`,
      iconColor: 'text-blue-400',
      active: true
    },
    {
      label: 'Mes cours',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-join="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
      iconColor: 'text-purple-400',
      active: false
    },
    {
      label: 'Étudiants',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
      iconColor: 'text-green-400',
      active: false
    },
    {
      label: 'Corrections',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />`,
      iconColor: 'text-yellow-400',
      active: false
    },
    {
      label: 'Discussions',
      link: 'Etudiant/DiscussionAllUser',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />`,
      iconColor: 'text-red-400',
      active: false
    },
    {
      label: 'Mon compte',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />`,
      iconColor: 'text-pink-400',
      active: false
    }
  ];

  stats = [
    {
      label: 'Cours enseignés',
      value: '5',
      icon: `<path stroke-linecap="round" stroke-join="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500 bg-opacity-20',
      progress: 80,
      progressColor: 'bg-blue-500',
      subtext: '80% d\'engagement moyen',
      animationDelay: ''
    },
    {
      label: 'Étudiants inscrits',
      value: '120',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500 bg-opacity-20',
      progress: 75,
      progressColor: 'bg-purple-500',
      subtext: '+10 étudiants ce mois',
      animationDelay: 'animate__delay-1s'
    },
    {
      label: 'Devoirs corrigés',
      value: '45',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500 bg-opacity-20',
      progress: 60,
      progressColor: 'bg-green-500',
      subtext: '15 en attente',
      animationDelay: 'animate__delay-2s'
    },
    {
      label: 'Taux de satisfaction',
      value: '92%',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500 bg-opacity-20',
      progress: 92,
      progressColor: 'bg-yellow-500',
      subtext: 'Basé sur les évaluations',
      animationDelay: 'animate__delay-3s'
    }
  ];

  taughtCourses = [
    {
      image: 'https://images.unsplash.com/photo-1516321310764-5f3e8600ebfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Data Science',
      tagBg: 'bg-green-900 bg-opacity-50 text-green-400',
      rating: '4.8',
      title: 'Machine Learning Avancé',
      description: 'Enseignez les techniques avancées de ML',
      hours: '20/40h',
      progress: 85,
      progressColor: 'stroke-green-500',
      progressOffset: 15,
      animationDelay: ''
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Développement',
      tagBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      rating: '4.7',
      title: 'Développement Web Full Stack',
      description: 'Formez vos étudiants au développement web',
      hours: '15/30h',
      progress: 60,
      progressColor: 'stroke-blue-500',
      progressOffset: 40,
      animationDelay: 'animate__delay-1s'
    },
    {
      image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Design',
      tagBg: 'bg-purple-900 bg-opacity-50 text-purple-400',
      rating: '4.9',
      title: 'Design UX/UI',
      description: 'Guidez vos étudiants dans la conception UX',
      hours: '10/20h',
      progress: 50,
      progressColor: 'stroke-purple-500',
      progressOffset: 50,
      animationDelay: 'animate__delay-2s'
    }
  ];

  gradingTasks = [
    {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Data Science',
      tagBg: 'bg-green-900 bg-opacity-50 text-green-400',
      title: 'Projet ML Final',
      dueDate: '20 Août 2025',
      animationDelay: ''
    },
    {
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Développement',
      tagBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      title: 'Application Web',
      dueDate: '22 Août 2025',
      animationDelay: 'animate__delay-1s'
    },
    {
      image: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Design',
      tagBg: 'bg-purple-900 bg-opacity-50 text-purple-400',
      title: 'Prototype UX',
      dueDate: '25 Août 2025',
      animationDelay: 'animate__delay-2s'
    },
    {
      image: 'https://images.unsplash.com/photo-1516321310764-5f3e8600ebfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Data Science',
      tagBg: 'bg-green-900 bg-opacity-50 text-green-400',
      title: 'Analyse de Données',
      dueDate: '28 Août 2025',
      animationDelay: 'animate__delay-3s'
    }
  ];

  recentActivities = [
    {
      iconBg: 'bg-blue-500 bg-opacity-20',
      icon: 'fas fa-book text-blue-400',
      description: `<span class="font-semibold">Vous</span> avez publié un nouveau chapitre dans <span class="text-blue-400">Machine Learning Avancé</span>`,
      time: 'Il y a 2 heures',
      dotColor: 'bg-blue-500',
      animationDelay: ''
    },
    {
      iconBg: 'bg-green-500 bg-opacity-20',
      icon: 'fas fa-check-circle text-green-400',
      description: `<span class="font-semibold">Vous</span> avez corrigé le devoir de <span class="text-green-400">Clara Lefèvre</span>`,
      time: 'Hier à 14:00',
      dotColor: '',
      animationDelay: 'animate__delay-1s'
    },
    {
      iconBg: 'bg-purple-500 bg-opacity-20',
      icon: 'fas fa-comment-alt text-purple-400',
      description: `<span class="font-semibold">Sophie Laurent</span> a posé une question dans <span class="text-purple-400">Développement Web</span>`,
      time: 'Hier à 10:30',
      dotColor: 'bg-purple-500',
      animationDelay: 'animate__delay-2s'
    },
    {
      iconBg: 'bg-yellow-500 bg-opacity-20',
      icon: 'fas fa-star text-yellow-400',
      description: `<span class="font-semibold">Étudiants</span> ont évalué votre cours à <span class="text-yellow-400">4.8/5</span>`,
      time: 'Avant-hier à 08:45',
      dotColor: '',
      animationDelay: 'animate__delay-3s'
    }
  ];

  constructor(private renderer: Renderer2, 
    private sanitizer: DomSanitizer,
    private authService: AuthentificationService, // Injecter le service
    private enseignantCourService: EnseignantCourService,
    private router: Router,
    private route: ActivatedRoute // Ajouter ActivatedRoute



) {}



  // Remplacer l'objet teacher par l'utilisateur connecté
  currentUser: User | null = null;

  // Ajouter une propriété pour l'engagement
  engagement = 82;

 ngOnInit() {
    this.loadCurrentUser(); // Charger l'utilisateur au démarrage
  }

    loadCurrentUser(): void {
  this.currentUser = this.authService.getUser();
  
  if (this.currentUser) {
    console.log('✅ Utilisateur chargé:', this.currentUser);
    // AJOUTER CET APPEL
    this.loadTeacherCourses();
  } else {
    console.log('🔄 Chargement utilisateur depuis API...');
    this.authService.me().subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.authService.saveUser(user);
        console.log('✅ Utilisateur chargé depuis API:', user);
        // AJOUTER CET APPEL
        this.loadTeacherCourses();
      },
      error: (error) => {
        console.error('❌ Erreur chargement utilisateur:', error);
      }
    });
  }
}


/**
 * Charger les cours réels de l'enseignant connecté
 */
loadTeacherCourses(): void {
  if (!this.currentUser?.id) {
    console.error('❌ Impossible de charger les cours: ID enseignant manquant');
    return;
  }

  this.loadingCourses = true;
  this.coursesError = '';

  console.log('🔄 Chargement des cours avec la bonne URL...');

  // UTILISER LA BONNE MÉTHODE
  this.enseignantCourService.getCoursEnseignant(this.currentUser.id).subscribe({
    next: (response: any) => {
      console.log('✅ Réponse API cours enseignés:', response);
      
      // Extraire les cours depuis la réponse
      // Selon votre contrôleur Laravel, les cours sont dans response.cours
      const coursesData = response.cours || response.data || response;
      
      console.log('📊 Cours extraits:', coursesData);
      
      if (coursesData && coursesData.length > 0) {
        this.realTaughtCourses = this.mapCoursesToDisplayFormat(coursesData);
        console.log(`✅ ${this.realTaughtCourses.length} cours chargés avec succès`);
      } else {
        console.log('ℹ️ Aucun cours trouvé dans la réponse');
        this.useDemoData();
      }
      
      this.loadingCourses = false;
    },
    error: (error) => {
      console.error('❌ Erreur chargement des cours enseignés:', error);
      
      // Afficher plus de détails sur l'erreur
      if (error.status === 404) {
        this.coursesError = 'Route API non trouvée. Vérifiez la configuration.';
      } else if (error.status === 401) {
        this.coursesError = 'Non autorisé. Vérifiez votre authentification.';
      } else {
        this.coursesError = 'Erreur de connexion au serveur';
      }
      
      // Utiliser les données de démo en fallback
      console.log('🔄 Utilisation des données de démo en raison de l\'erreur');
      this.useDemoData();
      this.loadingCourses = false;
    }
  });
}

/**
 * Utiliser des données de démonstration quand l'API ne fonctionne pas
 */
private useDemoData(): void {
  const demoCourses = [
    {
      id: 1,
      titre: 'Angular Avancé',
      description: 'Maîtrisez les concepts avancés du framework Angular',
      categorie: 'Développement',
      progression: 75,
      note: 4.5,
      heures_completes: 15,
      duree_totale: 20,
      chapitres_completes: 6,
      chapitres_total: 8,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      auteur: this.getUserName(),
      statut: 'published',
      difficulte: 'intermédiaire',
      certificat_obtenu: false,
      tags: ['Angular', 'TypeScript', 'Frontend']
    },
    {
      id: 2,
      titre: 'Data Science Fundamentals',
      description: 'Introduction à la data science et au machine learning',
      categorie: 'Data Science',
      progression: 40,
      note: 4.2,
      heures_completes: 8,
      duree_totale: 20,
      chapitres_completes: 3,
      chapitres_total: 10,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      auteur: this.getUserName(),
      statut: 'published',
      difficulte: 'débutant',
      certificat_obtenu: false,
      tags: ['Python', 'Machine Learning', 'Data']
    },
    {
      id: 3,
      titre: 'UI/UX Design Moderne',
      description: 'Maîtrisez les principes du design d\'interface utilisateur moderne',
      categorie: 'Design',
      progression: 90,
      note: 4.8,
      heures_completes: 18,
      duree_totale: 20,
      chapitres_completes: 9,
      chapitres_total: 10,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      auteur: this.getUserName(),
      statut: 'published',
      difficulte: 'avancé',
      certificat_obtenu: true,
      tags: ['UI Design', 'UX Research', 'Figma']
    }
  ];
  
  this.realTaughtCourses = this.mapCoursesToDisplayFormat(demoCourses);
  console.log('✅ Données de démonstration chargées');
}

private mapCoursesToDisplayFormat(courses: any[]): any[] {
  return courses.map((course, index) => {
    // ADAPTER LES CHAMPS FRANÇAIS → ANGLAIS
    const courseData = {
      id: course.id,
      title: course.titre || course.title, // 'titre' en français
      description: course.description,
      category: course.categorie || course.category,
      progress: course.progression || course.progress,
      note: course.note || course.rating,
      hoursCompleted: course.heures_completes || course.hoursCompleted,
      hoursTotal: course.duree_totale || course.hoursTotal,
      chaptersCompleted: course.chapitres_completes || course.chaptersCompleted,
      chaptersTotal: course.chapitres_total || course.chaptersTotal,
      image: course.image,
      instructor: course.auteur || course.instructor,
      status: course.statut || course.status,
      difficulty: course.difficulte || course.difficulty,
      certificateObtained: course.certificat_obtenu || course.certificateObtained,
      tags: course.tags
    };

    const tagConfig = this.getTagConfig(courseData.category || 'Général');
    const progressConfig = this.getProgressConfig(courseData.progress || 0);
    const animationDelay = this.getAnimationDelay(index);

    // CORRECTION : Convertir la note en nombre et gérer les cas null/undefined
    const noteNumber = Number(courseData.note) || 0;
    const ratingDisplay = noteNumber > 0 ? noteNumber.toFixed(1) : 'N/A';

    return {
      ...courseData,
      tagBg: tagConfig.bg,
      tagColor: tagConfig.color,
      progressColor: progressConfig.color,
      progressOffset: 100 - (courseData.progress || 0),
      animationDelay: animationDelay,
      rating: ratingDisplay, // Utiliser la version corrigée
      hours: `${courseData.hoursCompleted || 0}/${courseData.hoursTotal || 0}h`,
      image: courseData.image || this.getDefaultCourseImage(courseData.category || 'Général')
    };
  });
}
private getAnimationDelay(index: number): string {
  const delays = ['', 'animate__delay-1s', 'animate__delay-2s', 'animate__delay-3s'];
  return delays[index] || '';
}

// AJOUTER CES MÉTHODES UTILITAIRES
private getTagConfig(category: string): { bg: string; color: string } {
  const configs: { [key: string]: { bg: string; color: string } } = {
    'Développement': { bg: 'bg-blue-900 bg-opacity-50', color: 'text-blue-400' },
    'Data Science': { bg: 'bg-green-900 bg-opacity-50', color: 'text-green-400' },
    'Design': { bg: 'bg-purple-900 bg-opacity-50', color: 'text-purple-400' }
  };
  return configs[category] || { bg: 'bg-gray-900 bg-opacity-50', color: 'text-gray-400' };
}

private getProgressConfig(progress: number): { color: string } {
  if (progress >= 80) return { color: 'stroke-green-500' };
  if (progress >= 50) return { color: 'stroke-blue-500' };
  return { color: 'stroke-yellow-500' };
}

private getDefaultCourseImage(category: string): string {
  const images: { [key: string]: string } = {
    'Développement': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };
  return images[category] || 'https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
}









  ngAfterViewInit() {
    this.animateProgressRings();
    this.addCardHoverEffects();
    this.addButtonPressEffects();
    this.addBackdropClickListener();
  }


 /**
   * Obtenir l'URL de l'avatar
   */
  getAvatarUrl(): string {
    if (!this.currentUser) {
      return this.generateDefaultAvatar();
    }

    // Vérifier si avatar_url existe et n'est pas vide
    if (this.currentUser.avatar_url && this.currentUser.avatar_url.trim() !== '') {
      console.log('🎯 Utilisation avatar URL:', this.currentUser.avatar_url);
      return this.currentUser.avatar_url;
    }

    console.log('🔄 Utilisation avatar par défaut');
    return this.generateDefaultAvatar();
  }

  /**
   * Générer un avatar par défaut basé sur le nom
   */
  private generateDefaultAvatar(): string {
    const name = this.getUserName();
    const initials = name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3B82F6&color=ffffff&size=128`;
  }

  /**
   * Gérer les erreurs de chargement d'image
   */
  onImageError(event: any): void {
    console.log('❌ Erreur chargement image, utilisation avatar par défaut');
    event.target.src = this.generateDefaultAvatar();
  }


  /**
   * Obtenir le nom complet de l'utilisateur
   */
  getUserName(): string {
    return this.currentUser?.nom || 'Enseignant';
  }

  /**
   * Obtenir le rôle de l'utilisateur
   */
  getUserRole(): string {
    return this.currentUser?.role || 'Formateur';
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearToken();
        // Rediriger vers la page de login
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Erreur déconnexion:', error);
        // Nettoyer quand même le local storage en cas d'erreur
        this.authService.clearToken();
        window.location.href = '/login';
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  getSafeSvg(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  private animateProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring');
    progressRings.forEach((ring: any) => {
      const circle = ring.querySelector('circle:last-child');
      const radius = circle.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const percent = parseInt(circle.nextElementSibling.textContent);
      const offset = circumference - (percent / 100) * circumference;

      this.renderer.setStyle(circle, 'strokeDasharray', `${circumference} ${circumference}`);
      this.renderer.setStyle(circle, 'strokeDashoffset', circumference);

      setTimeout(() => {
        this.renderer.setStyle(circle, 'strokeDashoffset', offset);
      }, 200);
    });
  }

  private addCardHoverEffects() {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card: any) => {
      this.renderer.listen(card, 'mouseenter', () => {
        this.renderer.setStyle(card, 'transform', 'translateY(-5px)');
        this.renderer.setStyle(card, 'boxShadow', '0 15px 25px rgba(0, 0, 0, 0.2)');
      });
      this.renderer.listen(card, 'mouseleave', () => {
        this.renderer.setStyle(card, 'transform', '');
        this.renderer.setStyle(card, 'boxShadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
      });
    });
  }

  private addButtonPressEffects() {
    const buttons = document.querySelectorAll('.btn-press');
    buttons.forEach((button: any) => {
      this.renderer.listen(button, 'mousedown', () => {
        this.renderer.setStyle(button, 'transform', 'scale(0.98)');
      });
      this.renderer.listen(button, 'mouseup', () => {
        this.renderer.setStyle(button, 'transform', '');
      });
      this.renderer.listen(button, 'mouseleave', () => {
        this.renderer.setStyle(button, 'transform', '');
      });
    });
  }

  private addBackdropClickListener() {
    const backdrop = document.getElementById('sidebarBackdrop');
    if (backdrop) {
      this.renderer.listen(backdrop, 'click', () => {
        this.isSidebarOpen = false;
      });
    }
  }


  // Méthode pour toggle le menu de création
  toggleCreateMenu() {
    this.isCreateMenuOpen = !this.isCreateMenuOpen;
    // Fermer le menu utilisateur si ouvert
    if (this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  // Méthode pour créer une réunion
  createMeeting() {
    this.isCreateMenuOpen = false;
    console.log('Création d\'une nouvelle réunion...');
    // Implémentez la logique de création de réunion
    // this.router.navigate(['/create-meeting']);
    // Ou ouvrir un modal de création de réunion
  }

  // Méthode pour créer un cours
  createCourse() {
    this.isCreateMenuOpen = false;
    console.log('Création d\'un nouveau cours...');
    // Implémentez la logique de création de cours
    // this.router.navigate(['/create-course']);
  }

  // Méthode pour créer un devoir
  createAssignment() {
    this.isCreateMenuOpen = false;
    console.log('Création d\'un nouveau devoir...');
    // Implémentez la logique de création de devoir
    // this.router.navigate(['/create-assignment']);
  }

  // Méthode pour explorer le contenu
  exploreContent() {
    console.log('Exploration des ressources...');
    // this.router.navigate(['/explore']);
  }

  // Ajoutez aussi cette méthode pour fermer les menus quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Fermer le menu création si on clique ailleurs
    if (!target.closest('#createMenuButton') && !target.closest('#createDropdownMenu')) {
      this.isCreateMenuOpen = false;
    }
    
    // Fermer le menu utilisateur si on clique ailleurs
    if (!target.closest('#userMenuButton') && !target.closest('#userMenu')) {
      this.isUserMenuOpen = false;
    }
  }

// Dans DashboardEnseignantComponent
navigateToEdit(courseId: number): void {
  console.log('🎯 Navigation vers édition du cours ID:', courseId);
  
  // Stocker l'ID temporairement pour le composant d'édition
  localStorage.setItem('currentEditingCourseId', courseId.toString());
  
  // Navigation vers le composant d'édition
  this.router.navigate(['/Formateur/Course/Formulaire/Edit', courseId]);
}

// Méthodes de création
  createMeetingNavBar() {
    this.isCreateMenuOpen = false;
    console.log('🔄 Navigation vers création de réunion...');
    // this.router.navigate(['/Formateur/Meeting/Create']);
  }

  createCourseNavbar() {
    this.isCreateMenuOpen = false;
    console.log('🔄 Navigation vers création de cours...');
    this.router.navigate(['/formulaire']);
  }

  createAssignmentNavBar() {
    this.isCreateMenuOpen = false;
    console.log('🔄 Navigation vers création de devoir...');
    this.router.navigate(['/Formateur/Assignment/Create']);
  }

  exploreContentNavbar() {
    console.log('Exploration des ressources...');
     this.router.navigate(['/Formateur/Explore']);
  }


}
