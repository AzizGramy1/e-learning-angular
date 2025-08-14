import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements AfterViewInit {


  isSidebarOpen = false;
  isUserMenuOpen = false;
  searchQuery = '';

  admin = {
    name: 'Jean Martin',
    role: 'Administrateur',
    systemHealth: 95
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
      label: 'Utilisateurs',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
      iconColor: 'text-purple-400',
      active: false
    },
    {
      label: 'Cours',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
      iconColor: 'text-green-400',
      active: false
    },
    {
      label: 'Analytique',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />`,
      iconColor: 'text-yellow-400',
      active: false
    },
    {
      label: 'Paramètres',
      link: '#',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />`,
      iconColor: 'text-red-400',
      active: false
    }
  ];

  stats = [
    {
      label: 'Utilisateurs actifs',
      value: '1,245',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />`,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500 bg-opacity-20',
      progress: 78,
      progressColor: 'bg-blue-500',
      subtext: '12% d\'augmentation ce mois',
      animationDelay: ''
    },
    {
      label: 'Cours publiés',
      value: '156',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500 bg-opacity-20',
      progress: 92,
      progressColor: 'bg-purple-500',
      subtext: '8 nouveaux cours ce mois',
      animationDelay: 'animate__delay-1s'
    },
    {
      label: 'Certificats délivrés',
      value: '3,890',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500 bg-opacity-20',
      progress: 65,
      progressColor: 'bg-green-500',
      subtext: '450 délivrés cette semaine',
      animationDelay: 'animate__delay-2s'
    },
    {
      label: 'Taux de connexion',
      value: '85%',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500 bg-opacity-20',
      progress: 85,
      progressColor: 'bg-yellow-500',
      subtext: 'Stable depuis 7 jours',
      animationDelay: 'animate__delay-3s'
    }
  ];

  pendingCourses = [
    {
      image: 'https://images.unsplash.com/photo-1555431189-0fabf2667795?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      category: 'Développement',
      tagBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      rating: '4.8',
      title: 'Fondamentaux de TypeScript',
      description: 'Apprenez les bases de TypeScript pour le développement web',
      hours: '10/20h',
      progress: 50,
      progressColor: 'stroke-blue-500',
      progressOffset: 50,
      animationDelay: ''
    },
    {
      image: 'https://images.unsplash.com/photo-1581094794329-c811329a7272?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      category: 'Data Science',
      tagBg: 'bg-green-900 bg-opacity-50 text-green-400',
      rating: '4.6',
      title: 'Deep Learning Avancé',
      description: 'Explorez les réseaux neuronaux avec TensorFlow',
      hours: '15/30h',
      progress: 45,
      progressColor: 'stroke-green-500',
      progressOffset: 55,
      animationDelay: 'animate__delay-1s'
    },
    {
      image: 'https://images.unsplash.com/photo-1581094794329-c811329a7272?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      category: 'Design',
      tagBg: 'bg-purple-900 bg-opacity-50 text-purple-400',
      rating: '4.9',
      title: 'Design d\'Interaction',
      description: 'Créez des expériences utilisateur immersives',
      hours: '8/16h',
      progress: 30,
      progressColor: 'stroke-purple-500',
      progressOffset: 70,
      animationDelay: 'animate__delay-2s'
    }
  ];

  users = [
    {
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      role: 'Étudiant',
      roleBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      name: 'Sophie Laurent',
      email: 'sophie.laurent@example.com',
      animationDelay: ''
    },
    {
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      role: 'Instructeur',
      roleBg: 'bg-green-900 bg-opacity-50 text-green-400',
      name: 'Luc Dubois',
      email: 'luc.dubois@example.com',
      animationDelay: 'animate__delay-1s'
    },
    {
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      role: 'Étudiant',
      roleBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      name: 'Claire Moreau',
      email: 'claire.moreau@example.com',
      animationDelay: 'animate__delay-2s'
    },
    {
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80&fit=facearea&facepad=3',
      role: 'Instructeur',
      roleBg: 'bg-green-900 bg-opacity-50 text-green-400',
      name: 'Pierre Lefèvre',
      email: 'pierre.lefevre@example.com',
      animationDelay: 'animate__delay-3s'
    }
  ];

  recentActivities = [
    {
      iconBg: 'bg-blue-500 bg-opacity-20',
      icon: 'fas fa-user-plus text-blue-400',
      description: `<span class="font-semibold">Vous</span> avez ajouté un nouvel utilisateur <span class="text-blue-400">Sophie Laurent</span>`,
      time: 'Il y a 1 heure',
      dotColor: 'bg-blue-500',
      animationDelay: ''
    },
    {
      iconBg: 'bg-green-500 bg-opacity-20',
      icon: 'fas fa-check-circle text-green-400',
      description: `<span class="font-semibold">Vous</span> avez approuvé le cours <span class="text-green-400">Fondamentaux de Python</span>`,
      time: 'Il y a 3 heures',
      dotColor: '',
      animationDelay: 'animate__delay-1s'
    },
    {
      iconBg: 'bg-purple-500 bg-opacity-20',
      icon: 'fas fa-chart-line text-purple-400',
      description: `<span class="font-semibold">Système</span> a signalé une augmentation de <span class="text-purple-400">15%</span> des connexions`,
      time: 'Hier à 14:30',
      dotColor: 'bg-purple-500',
      animationDelay: 'animate__delay-2s'
    },
    {
      iconBg: 'bg-yellow-500 bg-opacity-20',
      icon: 'fas fa-exclamation-circle text-yellow-400',
      description: `<span class="font-semibold">Alerte</span> : Maintenance du serveur planifiée pour demain`,
      time: 'Hier à 09:00',
      dotColor: '',
      animationDelay: 'animate__delay-3s'
    }
  ];

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.animateProgressRings();
    this.addCardHoverEffects();
    this.addButtonPressEffects();
    this.addBackdropClickListener();
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
}