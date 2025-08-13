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

  user = {
    name: 'Marie Dupont',
    role: 'Étudiante',
    progress: 42
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
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
      iconColor: 'text-purple-400',
      active: false
    },
    // Add other menu items similarly
  ];

  stats = [
    {
      label: 'Cours en cours',
      value: '3',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />`,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500 bg-opacity-20',
      progress: 65,
      progressColor: 'bg-blue-500',
      subtext: '65% complété en moyenne',
      animationDelay: ''
    },
    // Add other stats similarly
  ];

  courses = [
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Développement',
      tagBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      rating: '4.9',
      title: 'Maîtrise de JavaScript Moderne',
      description: 'Apprenez ES6+, React, Node.js et plus encore',
      hours: '12/32h',
      progress: 60,
      progressColor: 'stroke-blue-500',
      progressOffset: 40,
      animationDelay: ''
    },
    // Add other courses similarly
  ];

  recommendedCourses = [
    {
      image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      category: 'Développement',
      tagBg: 'bg-blue-900 bg-opacity-50 text-blue-400',
      rating: '4.9',
      title: 'React Avancé',
      hours: '16h',
      animationDelay: ''
    },
    // Add other recommended courses similarly
  ];

  recentActivities = [
    {
      iconBg: 'bg-blue-500 bg-opacity-20',
      icon: 'fas fa-book text-blue-400',
      description: `<span class="font-semibold">Vous</span> avez terminé le chapitre "Composants React" dans <span class="text-blue-400">Maîtrise de JavaScript Moderne</span>`,
      time: 'Il y a 2 heures',
      dotColor: 'bg-blue-500',
      animationDelay: ''
    },
    // Add other activities similarly
  ];

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    this.animateProgressRings();
    this.addCardHoverEffects();
    this.addButtonPressEffects();
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



}
