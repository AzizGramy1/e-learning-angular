import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


interface CourseProgress {
  id: number;
  title: string;
  category: string;
  progress: number;
  duration: string;
  level: string;
  lastActivity: Date;
  completionDate?: Date;
  grade?: number;
  timeSpent: number;
  estimatedTime: number;
  startDate: Date;
  quizzes: number;
  completedQuizzes: number;
  assignments: number;
  completedAssignments: number;
}

interface StudentStats {
  name: string;
  email: string;
  joinDate: Date;
  level: string;
  avatar: string;
  totalCourses: number;
  completedCourses: number;
  averageGrade: number;
  totalTimeSpent: number;
  weeklyGoal: number;
  streak: number;
  rank: string;
  points: number;
  nextRank: string;
  pointsNeeded: number;
  weeklyActivity: number[];
  monthlyProgress: number[];
  learningStyle: string;
  strengths: string[];
  improvementAreas: string[];
}

interface SkillMetric {
  name: string;
  category: string;
  level: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  lastAssessment: Date;
}

interface TimeDistribution {
  category: string;
  hours: number;
  percentage: number;
  trend: number;
}


@Component({
  selector: 'app-statistique-etudiant',
  templateUrl: './statistique-etudiant.component.html',
  styleUrls: ['./statistique-etudiant.component.scss']
})
export class StatistiqueEtudiantComponent {

 @ViewChild('activityChart') activityChart!: ElementRef;
  @ViewChild('skillChart') skillChart!: ElementRef;

  currentView = 'overview';
  selectedPeriod = 'week';
  isLoading = false;
  showAchievements = false;
  showAnalytics = false;
  selectedMetric = 'progress';

  // Données de l'étudiant
  student: StudentStats = {
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    joinDate: new Date('2024-01-15'),
    level: 'Intermédiaire',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    totalCourses: 12,
    completedCourses: 6,
    averageGrade: 4.7,
    totalTimeSpent: 156,
    weeklyGoal: 10,
    streak: 14,
    rank: 'Explorateur',
    points: 1250,
    nextRank: 'Expert',
    pointsNeeded: 750,
    weeklyActivity: [2, 3, 1, 4, 2, 3, 5],
    monthlyProgress: [15, 28, 42, 35, 58, 72, 65, 78, 82, 75, 88, 92],
    learningStyle: 'Visuel',
    strengths: ['Développement Frontend', 'Résolution de problèmes', 'Apprentissage rapide'],
    improvementAreas: ['Design UI/UX', 'Backend Development', 'Tests unitaires']
  };

  // Métriques détaillées
  skillMetrics: SkillMetric[] = [
    { name: 'Angular', category: 'development', level: 4, progress: 85, trend: 'up', lastAssessment: new Date('2024-03-20') },
    { name: 'TypeScript', category: 'development', level: 4, progress: 80, trend: 'up', lastAssessment: new Date('2024-03-18') },
    { name: 'JavaScript', category: 'development', level: 5, progress: 92, trend: 'stable', lastAssessment: new Date('2024-03-15') },
    { name: 'UI/UX Design', category: 'design', level: 2, progress: 45, trend: 'up', lastAssessment: new Date('2024-03-22') },
    { name: 'Figma', category: 'design', level: 3, progress: 65, trend: 'up', lastAssessment: new Date('2024-03-21') },
    { name: 'Python', category: 'development', level: 3, progress: 70, trend: 'up', lastAssessment: new Date('2024-03-19') },
    { name: 'Data Analysis', category: 'data', level: 2, progress: 40, trend: 'stable', lastAssessment: new Date('2024-03-17') },
    { name: 'React', category: 'development', level: 3, progress: 75, trend: 'up', lastAssessment: new Date('2024-03-16') }
  ];

  // Distribution du temps
  timeDistribution: TimeDistribution[] = [
    { category: 'Développement', hours: 89, percentage: 57, trend: 12 },
    { category: 'Design', hours: 32, percentage: 21, trend: 8 },
    { category: 'Data Science', hours: 18, percentage: 12, trend: 15 },
    { category: 'Marketing', hours: 12, percentage: 8, trend: -5 },
    { category: 'Business', hours: 5, percentage: 3, trend: 3 }
  ];

  // Cours en progression
  coursesInProgress: CourseProgress[] = [
    {
      id: 1,
      title: 'Angular - De Zéro à Expert',
      category: 'development',
      progress: 75,
      duration: '12h',
      level: 'intermediate',
      lastActivity: new Date('2024-03-20'),
      timeSpent: 9,
      estimatedTime: 12,
      startDate: new Date('2024-02-10'),
      quizzes: 8,
      completedQuizzes: 6,
      assignments: 4,
      completedAssignments: 3,
      grade: 4.8
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      category: 'design',
      progress: 45,
      duration: '8h',
      level: 'beginner',
      lastActivity: new Date('2024-03-22'),
      timeSpent: 3.5,
      estimatedTime: 8,
      startDate: new Date('2024-03-01'),
      quizzes: 6,
      completedQuizzes: 2,
      assignments: 3,
      completedAssignments: 1
    },
    {
      id: 3,
      title: 'JavaScript Moderne ES6+',
      category: 'development',
      progress: 90,
      duration: '10h',
      level: 'beginner',
      lastActivity: new Date('2024-03-23'),
      timeSpent: 8,
      estimatedTime: 10,
      startDate: new Date('2024-02-20'),
      quizzes: 10,
      completedQuizzes: 9,
      assignments: 5,
      completedAssignments: 4,
      grade: 4.9
    },
    {
      id: 4,
      title: 'Python pour la Data Science',
      category: 'development',
      progress: 30,
      duration: '20h',
      level: 'advanced',
      lastActivity: new Date('2024-03-21'),
      timeSpent: 6,
      estimatedTime: 20,
      startDate: new Date('2024-03-05'),
      quizzes: 12,
      completedQuizzes: 3,
      assignments: 6,
      completedAssignments: 1
    }
  ];

  // Cours terminés
  completedCourses: CourseProgress[] = [
    {
      id: 5,
      title: 'Introduction à HTML/CSS',
      category: 'development',
      progress: 100,
      duration: '6h',
      level: 'beginner',
      lastActivity: new Date('2024-02-15'),
      completionDate: new Date('2024-02-15'),
      timeSpent: 5.5,
      estimatedTime: 6,
      startDate: new Date('2024-01-20'),
      quizzes: 5,
      completedQuizzes: 5,
      assignments: 3,
      completedAssignments: 3,
      grade: 4.5
    },
    {
      id: 6,
      title: 'Figma pour Débutants',
      category: 'design',
      progress: 100,
      duration: '5h',
      level: 'beginner',
      lastActivity: new Date('2024-02-28'),
      completionDate: new Date('2024-02-28'),
      timeSpent: 4.5,
      estimatedTime: 5,
      startDate: new Date('2024-02-10'),
      quizzes: 4,
      completedQuizzes: 4,
      assignments: 2,
      completedAssignments: 2,
      grade: 4.7
    },
    {
      id: 7,
      title: 'Marketing Digital 101',
      category: 'marketing',
      progress: 100,
      duration: '7h',
      level: 'beginner',
      lastActivity: new Date('2024-03-10'),
      completionDate: new Date('2024-03-10'),
      timeSpent: 6,
      estimatedTime: 7,
      startDate: new Date('2024-02-25'),
      quizzes: 6,
      completedQuizzes: 6,
      assignments: 3,
      completedAssignments: 3,
      grade: 4.6
    }
  ];

  // Données pour graphiques
  performanceData = {
    weekly: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      progress: [15, 28, 42, 35, 58, 72, 65],
      time: [2, 3, 1, 4, 2, 3, 5],
      quizzes: [3, 5, 2, 6, 4, 3, 7]
    },
    monthly: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      progress: [15, 42, 65, 88],
      time: [12, 18, 15, 22],
      quizzes: [15, 22, 18, 25]
    },
    yearly: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
      progress: [0, 15, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      time: [0, 45, 67, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      quizzes: [0, 25, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  };

  learningAnalytics = {
    peakHours: [6, 7, 8, 14, 15, 16, 20, 21],
    completionRate: 78,
    avgQuizScore: 4.6,
    assignmentCompletion: 82,
    retentionRate: 92,
    learningVelocity: 1.2
  };

  // Récompenses et succès
  achievements = [
    { id: 1, name: 'Premier Cours', description: 'Terminez votre premier cours', icon: 'fas fa-trophy', color: 'from-yellow-500 to-orange-500', unlocked: true, date: new Date('2024-02-15'), points: 100 },
    { id: 2, name: 'Étudiant Assidu', description: '10 jours consécutifs de connexion', icon: 'fas fa-fire', color: 'from-red-500 to-pink-500', unlocked: true, date: new Date('2024-03-10'), points: 150 },
    { id: 3, name: 'Spécialiste Dev', description: 'Terminez 5 cours de développement', icon: 'fas fa-code', color: 'from-blue-500 to-cyan-500', unlocked: true, date: new Date('2024-03-18'), points: 200 },
    { id: 4, name: 'Perfectionniste', description: 'Obtenez une note de 4.8+', icon: 'fas fa-star', color: 'from-purple-500 to-pink-500', unlocked: true, date: new Date('2024-03-20'), points: 180 },
    { id: 5, name: 'Marathonien', description: '100 heures de formation', icon: 'fas fa-running', color: 'from-green-500 to-emerald-500', unlocked: true, date: new Date('2024-03-22'), points: 250 },
    { id: 6, name: 'Polyvalent', description: 'Terminez un cours dans 3 catégories', icon: 'fas fa-shapes', color: 'from-indigo-500 to-purple-500', unlocked: true, date: new Date('2024-03-25'), points: 300 },
    { id: 7, name: 'Quiz Master', description: 'Terminez 50 quiz avec 90%+', icon: 'fas fa-brain', color: 'from-teal-500 to-blue-500', unlocked: false, points: 350 },
    { id: 8, name: 'Expert Certifié', description: 'Obtenez 3 certifications', icon: 'fas fa-award', color: 'from-amber-500 to-orange-500', unlocked: false, points: 500 }
  ];

  // Objectifs hebdomadaires
  weeklyGoals = [
    { day: 'Lun', target: 2, actual: 2, completed: true, quizzes: 3, assignments: 1 },
    { day: 'Mar', target: 2, actual: 3, completed: true, quizzes: 5, assignments: 2 },
    { day: 'Mer', target: 2, actual: 1, completed: false, quizzes: 2, assignments: 0 },
    { day: 'Jeu', target: 2, actual: 2, completed: true, quizzes: 6, assignments: 1 },
    { day: 'Ven', target: 2, actual: 3, completed: true, quizzes: 4, assignments: 2 },
    { day: 'Sam', target: 1, actual: 0, completed: false, quizzes: 0, assignments: 0 },
    { day: 'Dim', target: 1, actual: 0, completed: false, quizzes: 0, assignments: 0 }
  ];

  filteredCourses: CourseProgress[] = [];
  categories = [
    { value: 'all', label: 'Tous les cours', icon: 'fas fa-th', count: 0 },
    { value: 'development', label: 'Développement', icon: 'fas fa-code', count: 0 },
    { value: 'design', label: 'Design', icon: 'fas fa-palette', count: 0 },
    { value: 'business', label: 'Business', icon: 'fas fa-chart-line', count: 0 },
    { value: 'marketing', label: 'Marketing', icon: 'fas fa-bullhorn', count: 0 },
    { value: 'data', label: 'Data Science', icon: 'fas fa-database', count: 0 }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredCourses = [...this.coursesInProgress, ...this.completedCourses];
    this.updateCategoryCounts();
    this.startProgressAnimation();
    this.initializeCharts();
  }

  initializeCharts(): void {
    // Les graphiques seront initialisés après le rendu
    setTimeout(() => {
      this.renderActivityChart();
      this.renderSkillChart();
    }, 1000);
  }

  renderActivityChart(): void {
    // Implémentation du graphique d'activité avec Canvas
    const canvas = this.activityChart?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner le graphique d'activité
    const data = this.performanceData.weekly.time;
    const maxValue = Math.max(...data);
    const barWidth = (width - 100) / data.length;

    // Grille de fond
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (height - 50) - (i * (height - 50) / 5);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 50, y);
      ctx.stroke();
      
      // Labels Y
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px Arial';
      ctx.fillText((maxValue * i / 5).toString(), 20, y + 4);
    }

    // Barres
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 100);
      const x = 50 + (index * barWidth);
      const y = height - 50 - barHeight;

      // Gradient pour les barres
      const gradient = ctx.createLinearGradient(0, y, 0, height - 50);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 10, barHeight);

      // Labels X
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px Arial';
      ctx.fillText(this.performanceData.weekly.labels[index], x + barWidth/2 - 10, height - 25);
    });
  }

  renderSkillChart(): void {
    // Graphique radar des compétences
    const canvas = this.skillChart?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 50;

    ctx.clearRect(0, 0, width, height);

    // Dessiner le graphique radar
    const skills = this.skillMetrics.slice(0, 6);
    const angleStep = (2 * Math.PI) / skills.length;

    // Cercles concentriques
    for (let i = 1; i <= 5; i++) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Lignes radiales
    skills.forEach((_, index) => {
      const angle = index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Données
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    skills.forEach((skill, index) => {
      const angle = index * angleStep;
      const skillRadius = radius * (skill.progress / 100);
      const x = centerX + skillRadius * Math.cos(angle);
      const y = centerY + skillRadius * Math.sin(angle);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Points et labels
    skills.forEach((skill, index) => {
      const angle = index * angleStep;
      const skillRadius = radius * (skill.progress / 100);
      const x = centerX + skillRadius * Math.cos(angle);
      const y = centerY + skillRadius * Math.sin(angle);

      // Points
      ctx.fillStyle = 'rgba(59, 130, 246, 1)';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Labels
      const labelRadius = radius + 20;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.name, labelX, labelY);
    });
  }

  startProgressAnimation(): void {
    setTimeout(() => {
      document.querySelectorAll('.progress-bar').forEach((bar, index) => {
        setTimeout(() => {
          bar.classList.add('animate-progress');
        }, index * 200);
      });
    }, 500);
  }

  updateCategoryCounts(): void {
    this.categories.forEach(category => {
      if (category.value !== 'all') {
        category.count = this.filteredCourses.filter(course => course.category === category.value).length;
      } else {
        category.count = this.filteredCourses.length;
      }
    });
  }

  // Navigation et filtres
  setView(view: string): void {
    this.currentView = view;
    setTimeout(() => {
      this.renderActivityChart();
      this.renderSkillChart();
    }, 300);
  }

  setPeriod(period: string): void {
    this.selectedPeriod = period;
    setTimeout(() => this.renderActivityChart(), 300);
  }

  setMetric(metric: string): void {
    this.selectedMetric = metric;
    setTimeout(() => this.renderActivityChart(), 300);
  }

  filterByCategory(category: string): void {
    if (category === 'all') {
      this.filteredCourses = [...this.coursesInProgress, ...this.completedCourses];
    } else {
      this.filteredCourses = [...this.coursesInProgress, ...this.completedCourses]
        .filter(course => course.category === category);
    }
    this.updateCategoryCounts();
  }

  toggleAchievements(): void {
    this.showAchievements = !this.showAchievements;
  }

  toggleAnalytics(): void {
    this.showAnalytics = !this.showAnalytics;
  }

  // Calculs et utilitaires
  getOverallProgress(): number {
    const totalProgress = this.coursesInProgress.reduce((sum, course) => sum + course.progress, 0);
    return totalProgress / this.coursesInProgress.length;
  }

  getWeeklyProgress(): number {
    const completed = this.weeklyGoals.filter(day => day.completed).length;
    return (completed / this.weeklyGoals.length) * 100;
  }

  getTimePerDay(): number {
    return this.student.totalTimeSpent / 30;
  }

  getNextLevel(): string {
    const levels = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
    const currentIndex = levels.indexOf(this.student.level);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'Maître';
  }

  getDaysSinceJoin(): number {
    const diff = new Date().getTime() - this.student.joinDate.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }

  getCategoryIcon(category: string): string {
    const categoryObj = this.categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.icon : 'fas fa-th';
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-blue-500 to-cyan-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 90) return 'from-green-500 to-emerald-500';
    if (progress >= 70) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  }

  getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up text-green-400';
      case 'down': return 'fas fa-arrow-down text-red-400';
      default: return 'fas fa-minus text-gray-400';
    }
  }

  getPerformanceData(): number[] {
    const data = this.performanceData[this.selectedPeriod as keyof typeof this.performanceData];
    return data[this.selectedMetric as keyof typeof data] as number[];
  }

  getPerformanceLabels(): string[] {
    return this.performanceData[this.selectedPeriod as keyof typeof this.performanceData].labels;
  }

  getCompletionRate(course: CourseProgress): number {
    const totalItems = course.quizzes + course.assignments;
    const completedItems = course.completedQuizzes + course.completedAssignments;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  }

  // Navigation
  goToCourse(courseId: number): void {
    this.router.navigate(['/course', courseId]);
  }

  continueLearning(course: CourseProgress): void {
    this.router.navigate(['/learn', course.id]);
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

  @HostListener('window:resize')
  onResize() {
    this.renderActivityChart();
    this.renderSkillChart();
  }


  // Ajoutez ces méthodes au composant
getViewIcon(view: string): string {
    switch (view) {
        case 'overview': return 'fas fa-chart-pie';
        case 'courses': return 'fas fa-book-open';
        case 'progress': return 'fas fa-chart-line';
        case 'skills': return 'fas fa-code';
        default: return 'fas fa-chart-pie';
    }
}

getViewLabel(view: string): string {
    switch (view) {
        case 'overview': return 'Tableau de Bord';
        case 'courses': return 'Mes Cours';
        case 'progress': return 'Progression';
        case 'skills': return 'Compétences';
        default: return 'Tableau de Bord';
    }
}

getMetricLabel(metric: string): string {
    switch (metric) {
        case 'time': return 'Temps';
        case 'progress': return 'Progression';
        case 'quizzes': return 'Quiz';
        default: return 'Temps';
    }
}

getTimeDistributionColor(category: string): string {
    switch (category) {
        case 'Développement': return 'bg-blue-500';
        case 'Design': return 'bg-purple-500';
        case 'Data Science': return 'bg-green-500';
        case 'Marketing': return 'bg-yellow-500';
        case 'Business': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

getLevelColorByLevel(level: number): string {
    if (level >= 4) return 'from-purple-500 to-pink-500';
    if (level >= 3) return 'from-blue-500 to-cyan-500';
    return 'from-green-500 to-emerald-500';
}

getTotalWeeklyQuizzes(): number {
    return this.weeklyGoals.reduce((sum, day) => sum + day.quizzes, 0);
}

getTotalWeeklyAssignments(): number {
    return this.weeklyGoals.reduce((sum, day) => sum + day.assignments, 0);
}

getWeeklyStudyTime(): number {
    return this.weeklyGoals.reduce((sum, day) => sum + day.actual, 0);
}

getPeakHours(): string {
    const hours = this.learningAnalytics.peakHours;
    return hours.map(h => `${h}h`).join(', ');
}

getLearningInsights() {
    return [
        {
            title: 'Optimisation du Temps',
            subtitle: 'Efficacité maximale',
            description: 'Vous apprenez plus efficacement entre 14h et 16h. Planifiez vos sessions importantes pendant ces créneaux.',
            icon: 'fas fa-clock',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Force en Développement',
            subtitle: 'Compétences techniques',
            description: 'Vos compétences en développement frontend sont excellentes. Pensez à explorer le backend pour devenir full-stack.',
            icon: 'fas fa-code',
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Progression Constante',
            subtitle: 'Rythme soutenu',
            description: 'Votre vitesse d\\apprentissage est 20% supérieure à la moyenne. Maintenez ce rythme pour atteindre vos objectifs plus rapidement.',
            color: 'from-purple-500 to-pink-500'
        }
    ];
}
}
