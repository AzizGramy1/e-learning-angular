import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionQuizz } from 'src/app/Models/QuestionQuizz';
import { QuestionQuizzServiceService } from 'src/app/Service/QuestionQuizz/question-quizz-service.service';

@Component({
  selector: 'app-cour-interface-quizz',
  templateUrl: './cour-interface-quizz.component.html',
  styleUrls: ['./cour-interface-quizz.component.scss']
})
export class CourInterfaceQuizzComponent implements OnInit {
  @ViewChild('progressRing', { static: false }) progressRing!: ElementRef<SVGCircleElement>;

  // UI State
  isSidebarOpen = false;
  isUserMenuOpen = false;

  // Quiz State
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  showFeedback = false;
  feedbackCorrect = false;
  feedbackMessage = '';
  questionStatus: string[] = [];

  // Progress Ring
  circumference = 2 * Math.PI * 20;
  offset = this.circumference;

  // Data
  quizId!: number;
  questions: QuestionQuizz[] = [];
  currentQuestion: any = null;

  // Modal Completion
  showCompletionModal = false;
  score = 0;
  correctCount = 0;
  totalQuestions = 0;
  completionDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private quizzService: QuestionQuizzServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Quiz for course ID:', courseId);

    if (courseId && !isNaN(courseId)) {
      this.loadQuestions(courseId);
    }
  }

  loadQuestions(courseId: number) {
    this.quizzService.getAllQuestions(courseId).subscribe({
      next: (data: any) => {
        if (data.success) {
          this.questions = data.data.map((q: any) => {
            try {
              let options = [];
              if (q.options) {
                if (typeof q.options === 'string') {
                  options = JSON.parse(q.options);
                } else if (Array.isArray(q.options)) {
                  options = q.options;
                }
              }
              
              let reponse_correcte = [];
              if (q.reponse_correcte) {
                if (typeof q.reponse_correcte === 'string') {
                  reponse_correcte = JSON.parse(q.reponse_correcte);
                } else if (Array.isArray(q.reponse_correcte)) {
                  reponse_correcte = q.reponse_correcte;
                }
              }
              
              return {
                ...q,
                options: options,
                reponse_correcte: reponse_correcte
              };
            } catch (error) {
              console.error('Erreur lors du parsing de la question:', q, error);
              return {
                ...q,
                options: [],
                reponse_correcte: []
              };
            }
          });
          
          console.log('Questions after parsing:', this.questions);
          
          this.questions = this.questions.map(q => ({
            ...q,
            options: q.options || [],
            reponse_correcte: q.reponse_correcte || []
          }));

          this.currentQuestionIndex = 0;
          this.selectedOption = null;
          this.showFeedback = false;
          this.feedbackMessage = '';
          this.feedbackCorrect = false;
          this.questionStatus = new Array(this.questions.length).fill(null);
          
          this.updateCurrentQuestion();
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des questions:', err);
      }
    });
  }

  updateCurrentQuestion() {
    if (this.questions.length > 0 && this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      
      if (!this.currentQuestion.options || !Array.isArray(this.currentQuestion.options)) {
        this.currentQuestion.options = [];
      }
      
      console.log('Question courante:', this.currentQuestion);
      console.log('Options:', this.currentQuestion.options);
      console.log('Réponse correcte:', this.currentQuestion.reponse_correcte);
    }
  }

  initializeProgressRing(): void {
    const circle = this.progressRing.nativeElement;
    circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    circle.style.strokeDashoffset = `${this.offset}`;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  selectOption(index: number): void {
    this.selectedOption = index;
  }

  // Méthode helper pour utiliser String.fromCharCode dans le template
  getLetterForIndex(index: number): string {
    return String.fromCharCode(65 + index);
  }

  nextQuestion(): void {
    if (this.selectedOption === null) return;

    if (!this.currentQuestion || !this.currentQuestion.options || !this.currentQuestion.reponse_correcte) {
      console.error('Données de question manquantes');
      return;
    }

    const selectedAnswer = this.currentQuestion.options[this.selectedOption];
    const correctAnswer = this.currentQuestion.reponse_correcte[0];

    this.feedbackCorrect = selectedAnswer === correctAnswer;
    this.feedbackMessage = this.feedbackCorrect
      ? 'Bonne réponse!'
      : `Mauvaise réponse. La réponse correcte est: ${correctAnswer}`;
    this.showFeedback = true;
    this.questionStatus[this.currentQuestionIndex] = this.feedbackCorrect ? 'correct' : 'incorrect';

    if (this.feedbackCorrect) this.createConfetti();

    setTimeout(() => {
      this.showFeedback = false;
      if (this.feedbackCorrect) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedOption = null;
          this.updateCurrentQuestion();
          this.updateProgressRing();
        }
      }
    }, 2000);
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOption = null;
      this.showFeedback = false;
      this.updateCurrentQuestion();
      this.updateProgressRing();
    }
  }

  updateProgressRing(): void {
    if (this.questions.length === 0) return;
    
    this.offset = this.circumference - ((this.currentQuestionIndex + 1) / this.questions.length) * this.circumference;
    const circle = this.progressRing.nativeElement;
    if (circle) {
      circle.style.strokeDashoffset = `${this.offset}`;
    }
  }

  finishQuiz(): void {
    if (this.selectedOption === null) {
      alert('Veuillez sélectionner une réponse avant de terminer le quiz.');
      return;
    }

    const selectedAnswer = this.currentQuestion.options[this.selectedOption];
    const correctAnswer = this.currentQuestion.reponse_correcte[0];
    this.feedbackCorrect = selectedAnswer === correctAnswer;
    this.questionStatus[this.currentQuestionIndex] = this.feedbackCorrect ? 'correct' : 'incorrect';

    // Calculer le score
    this.correctCount = this.questionStatus.filter(status => status === 'correct').length;
    this.totalQuestions = this.questions.length;
    this.score = Math.round((this.correctCount / this.totalQuestions) * 100);
    this.completionDate = new Date();

    // Afficher le modal
    this.showCompletionModal = true;
  }

  closeCompletionModal(): void {
    this.showCompletionModal = false;
  }

  downloadCertificate(): void {
    console.log('Téléchargement du certificat...');
    // TODO: Implémentez le téléchargement du certificat en PDF
    // Vous pouvez utiliser jsPDF ou html2pdf
  }

  shareCertificate(): void {
    console.log('Partage du certificat...');
    // TODO: Implémentez le partage sur les réseaux sociaux
  }

  continueLearning(): void {
    this.showCompletionModal = false;
    this.navigateTo('/devoirs/Unity');
  }

  createConfetti(): void {
    const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 5000);
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  returnToLesson(): void {
    this.navigateTo('course/javascript-moderne/arrow-functions');
  }

  downloadResources(): void {
    console.log('Downloading resources...');
  }

  askQuestion(): void {
    console.log('Asking a question...');
  }

  quitCourse(): void {
    this.navigateTo('courses');
  }

  openSettings(): void {
    this.navigateTo('settings');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const userMenu = document.getElementById('userMenu');
    const userMenuButton = document.getElementById('userMenuButton');
    if (userMenu && userMenuButton && !userMenu.contains(event.target as Node) && !userMenuButton.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }

  // Ajoutez cette méthode dans votre composant TypeScript
quitLesson(): void {
  // Fermer le modal
  this.showCompletionModal = false;
  
  // Navigation vers la liste des cours ou page d'accueil
  this.navigateTo('courses');
}


}