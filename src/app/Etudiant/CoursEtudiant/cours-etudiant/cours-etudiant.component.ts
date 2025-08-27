import { Component, ElementRef, QueryList, Renderer2, ViewChildren, OnInit } from '@angular/core';
import { Course } from 'src/app/Models/Course';
import { UserService } from 'src/app/Service/User/user.service';  // ✅ importer ton service
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';

@Component({
  selector: 'app-cours-etudiant',
  templateUrl: './cours-etudiant.component.html',
  styleUrls: ['./cours-etudiant.component.scss']
})
export class CoursEtudiantComponent implements OnInit {

  isSidebarOpen = false;
  isUserMenuOpen = false;
  searchQuery = '';
  currentFilter = 'all';
  currentPage = 1;
  coursesPerPage = 6;
  userProgress = 0;

  courses: Course[] = [];   // 🔹 Maintenant vide au départ
  loading: boolean = true;
  error: string = '';

  @ViewChildren('courseCard') courseCards!: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2,
    private userService: UserService,
    private authentificationService: AuthentificationService   // ✅ injection du service
  ) {}

 ngOnInit(): void {
    const user = this.authentificationService.getUser(); // 🔹 récupérer l'utilisateur stocké
    if (user) {
      this.loadUserCourses(user.id);
    } else {
      this.loading = false;
      this.error = 'Utilisateur non connecté.';
    }
  }

 loadUserCourses(userId: number) {
  this.userService.getUserCourses(userId).subscribe({
    next: (res: any) => {
      const rawCourses = res.data ? res.data : res;

      // 🔹 Mapper les champs pour correspondre à ton interface
this.courses = rawCourses.map((c: any) => ({
  id: c.id,
  title: c.titre,                        // Laravel => "titre"
  description: c.description,
  image: c.image,
  status: c.statut,                      // Laravel => "statut"
  statusLabel: this.getStatusLabel(c.statut),  // 🔹 mieux gérer un label lisible
  category: c.categorie?.nom || 'N/A',   // relation catégorie
  rating: parseFloat(c.note || '0'),
  hoursCompleted: c.chapitres_completes || 0,
  hoursTotal: c.chapitres_total || 0,
  chaptersCompleted: c.chapitres_completes || 0,
  chaptersTotal: c.chapitres_total || 0,
  progress: c.progression || 0,
  progressColor: this.getProgressColor(c.progression || 0)
}));

      this.loading = false;

      setTimeout(() => {
        this.animateProgressRings();
        this.applyCardHoverEffects();
        this.applyButtonPressEffects();
      }, 100);
    },
    error: (err) => {
      console.error('❌ Erreur lors du chargement des cours: ', err);
      this.error = 'Impossible de charger vos cours.';
      this.loading = false;
    }
  });
}

// 🔹 À placer à l’intérieur de la classe CoursEtudiantComponent
getProgressColor(progress: number): string {
  if (progress >= 75) return '#4caf50'; // vert
  if (progress >= 50) return '#ff9800'; // orange
  return '#f44336'; // rouge
}


getStatusLabel(status: string): string {
  switch (status) {
    case 'en_cours': return 'En cours';
    case 'termine': return 'Terminé';
    case 'nouveau': return 'Nouveau';
    case 'favori': return 'Favori';
    default: return status;
  }
}



  // ======================
  //   Ton code existant
  // ======================

  get filteredCourses() {
    let filtered = this.courses;
    if (this.currentFilter !== 'all') {
      filtered = this.courses.filter(course => course.status === this.currentFilter);
    }
    if (this.searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    return filtered.slice((this.currentPage - 1) * this.coursesPerPage, this.currentPage * this.coursesPerPage);
  }

  get totalPages() {
    const filtered = this.currentFilter === 'all' 
      ? this.courses 
      : this.courses.filter(course => course.status === this.currentFilter);
    return Math.ceil(filtered.length / this.coursesPerPage);
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleUserMenu() { this.isUserMenuOpen = !this.isUserMenuOpen; }
  navigate(section: string) { alert(`Navigating to ${section}...`); }
  logout() { alert('Logging out...'); }
  viewNotifications() { alert('Viewing notifications...'); }
  openSettings() { alert('Opening settings...'); }

  filterCourses(filter: string = this.currentFilter) {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.courseCards.forEach(card => {
      this.renderer.removeClass(card.nativeElement, 'animate__fadeIn');
      setTimeout(() => {
        this.renderer.addClass(card.nativeElement, 'animate__fadeIn');
      }, 10);
    });
  }

  continueCourse(course: Course) {
    alert(`Continuing course: ${course.title}`);
  }

  reviewCourse(course: Course) {
    alert(`Reviewing course: ${course.title}`);
  }

  setPage(page: number) {
    this.currentPage = page;
    this.filterCourses();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterCourses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterCourses();
    }
  }

  animateProgressRings() {
    this.courseCards.forEach(card => {
      const circle = card.nativeElement.querySelector('.progress-ring');
      const text = card.nativeElement.querySelector('text');
      const percent = parseInt(text.textContent.replace('%', ''));
      const radius = 16;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (percent / 100) * circumference;

      this.renderer.setStyle(circle, 'strokeDasharray', `${circumference} ${circumference}`);
      this.renderer.setStyle(circle, 'strokeDashoffset', circumference);
      setTimeout(() => {
        this.renderer.setStyle(circle, 'strokeDashoffset', offset);
      }, 200);
    });
  }

  applyCardHoverEffects() {
    this.courseCards.forEach(card => {
      card.nativeElement.addEventListener('mouseenter', () => {
        this.renderer.setStyle(card.nativeElement, 'transform', 'translateY(-5px)');
        this.renderer.setStyle(card.nativeElement, 'boxShadow', '0 15px 25px rgba(0, 0, 0, 0.2)');
      });
      card.nativeElement.addEventListener('mouseleave', () => {
        this.renderer.setStyle(card.nativeElement, 'transform', '');
        this.renderer.setStyle(card.nativeElement, 'boxShadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
      });
    });
  }

  applyButtonPressEffects() {
    const buttons = document.querySelectorAll('.btn-press');
    buttons.forEach(button => {
      button.addEventListener('mousedown', () => {
        this.renderer.setStyle(button, 'transform', 'scale(0.98)');
      });
      button.addEventListener('mouseup', () => {
        this.renderer.setStyle(button, 'transform', '');
      });
      button.addEventListener('mouseleave', () => {
        this.renderer.setStyle(button, 'transform', '');
      });
    });
  }
}
