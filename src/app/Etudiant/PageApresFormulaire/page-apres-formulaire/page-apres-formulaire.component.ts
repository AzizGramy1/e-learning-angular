import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-apres-formulaire',
  templateUrl: './page-apres-formulaire.component.html',
  styleUrls: ['./page-apres-formulaire.component.scss']
})
export class PageApresFormulaireComponent implements OnInit{

  user = {
    name: 'Nouvel Utilisateur',
    progress: 25,
    completedCourses: 0,
    enrolledCourses: 3
  };

  features = [
    {
      icon: 'fas fa-rocket',
      title: 'Démarrage Rapide',
      description: 'Commencez à apprendre en 2 minutes chrono',
      color: 'from-blue-500 to-cyan-500',
      action: 'Explorer les cours'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Progression Visuelle',
      description: 'Suivez vos progrès en temps réel',
      color: 'from-green-500 to-emerald-500',
      action: 'Voir ma progression'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues',
      color: 'from-yellow-500 to-orange-500',
      action: 'Découvrir les certifications'
    },
    {
      icon: 'fas fa-users',
      title: 'Communauté',
      description: 'Rejoignez 50,000 apprenants',
      color: 'from-purple-500 to-pink-500',
      action: 'Rencontrer la communauté'
    }
  ];

  recommendedCourses = [
    {
      title: 'Angular pour Débutants',
      instructor: 'Marie Dubois',
      duration: '8h',
      students: '12,450',
      rating: 4.8,
      image: 'angular-course.jpg',
      progress: 0,
      isNew: true
    },
    {
      title: 'JavaScript Moderne',
      instructor: 'Pierre Martin',
      duration: '12h',
      students: '18,920',
      rating: 4.9,
      image: 'js-course.jpg',
      progress: 0,
      isNew: true
    },
    {
      title: 'UI/UX Design Fundamentals',
      instructor: 'Sophie Lambert',
      duration: '6h',
      students: '8,750',
      rating: 4.7,
      image: 'design-course.jpg',
      progress: 0,
      isHot: true
    }
  ];

  quickActions = [
    {
      icon: 'fas fa-play-circle',
      title: 'Reprendre ma formation',
      description: 'Continuez là où vous vous êtes arrêté',
      route: '/learning'
    },
    {
      icon: 'fas fa-search',
      title: 'Découvrir des cours',
      description: 'Parcourez notre catalogue de 500+ cours',
      route: '/courses'
    },
    {
      icon: 'fas fa-user-friends',
      title: 'Rejoindre un groupe',
      description: 'Apprenez avec d\'autres étudiants',
      route: '/community'
    },
    {
      icon: 'fas fa-calendar',
      title: 'Planifier mon apprentissage',
      description: 'Créez votre emploi du temps',
      route: '/schedule'
    }
  ];

  testimonials = [
    {
      name: 'Thomas L.',
      role: 'Développeur Full-Stack',
      text: 'J\'ai doublé mon salaire en 6 mois grâce aux formations EduTech !',
      avatar: 'avatar1.jpg',
      rating: 5
    },
    {
      name: 'Sarah M.',
      role: 'Designer UI/UX',
      text: 'La plateforme la plus intuitive que j\'ai utilisée. Les projets pratiques sont géniaux !',
      avatar: 'avatar2.jpg',
      rating: 5
    },
    {
      name: 'Kevin D.',
      role: 'Étudiant en reconversion',
      text: 'De zéro à employable en 4 mois. Merci EduTech !',
      avatar: 'avatar3.jpg',
      rating: 5
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simulation du chargement des données utilisateur
    this.loadUserData();
  }

  loadUserData(): void {
    // En pratique, vous récupéreriez ces données depuis votre API
    setTimeout(() => {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
        this.user.name = savedName;
      }
    }, 1000);
  }

  startLearning(): void {
    this.router.navigate(['/learning']);
  }

  exploreCourses(): void {
    this.router.navigate(['/courses']);
  }

  joinCommunity(): void {
    this.router.navigate(['/community']);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  getMotivationalMessage(): string {
    const messages = [
      'Votre aventure commence maintenant ! 🚀',
      'Prêt à développer vos super-pouvoirs ? 💪',
      'Le savoir est la clé de votre succès ! 🔑',
      'Bienvenue dans la communauté des apprenants ! 🌟'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

}
