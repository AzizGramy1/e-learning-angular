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
  @ViewChild('progressRing', { static: true }) progressRing!: ElementRef<SVGCircleElement>;

  isSidebarOpen = false;
  isUserMenuOpen = false;
  currentQuestionIndex = 0; // Start at question 1
  selectedOption: number | null = null;
  showFeedback = false;
  feedbackCorrect = false;
  feedbackMessage = '';
  questionStatus: string[] = []; // Track status of each question (correct, incorrect, or '')
  circumference = 2 * Math.PI * 20; // Radius = 20
  offset = this.circumference;



  quizId!: number;
  questions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizzService: QuestionQuizzServiceService,
    private router: Router
  ) {}

ngOnInit(): void {
  // Récupère l'ID du quiz à partir du cours
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
        // Parse les champs JSON pour options et reponse_correcte
        this.questions = data.data.map((q: any) => ({
          ...q,
          options: JSON.parse(q.options),
          reponse_correcte: JSON.parse(q.reponse_correcte)
        }));
        console.log('Questions after parsing:', this.questions);

        // Initialisation de l'état pour chaque question
        this.currentQuestionIndex = 0;
        this.selectedOption = null;
        this.showFeedback = false;
        this.feedbackMessage = '';
        this.feedbackCorrect = false;
        this.questionStatus = new Array(this.questions.length).fill(null);
      }
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des questions:', err);
    }
  });
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

  nextQuestion(): void {
    if (this.selectedOption === null) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];
    const selectedAnswer = currentQuestion.options[this.selectedOption];
    const correctAnswer = currentQuestion.reponse_correcte[0];

    this.feedbackCorrect = selectedAnswer === correctAnswer;
    this.feedbackMessage = this.feedbackCorrect
      ? 'Bonne réponse!'
      : 'Mauvaise réponse. Essayez encore!';
    this.showFeedback = true;
    this.questionStatus[this.currentQuestionIndex] = this.feedbackCorrect ? 'correct' : 'incorrect';

    if (this.feedbackCorrect) this.createConfetti();

    setTimeout(() => {
      this.showFeedback = false;
      if (this.feedbackCorrect) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedOption = null;
          this.updateProgressRing();
        } else {
          alert('Quiz terminé !');
          this.navigateTo('courses');
        }
      }
    }, 2000);
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOption = null;
      this.showFeedback = false;
      this.updateProgressRing();
    }
  }

  updateProgressRing(): void {
    this.offset = this.circumference - ((this.currentQuestionIndex + 1) / this.questions.length) * this.circumference;
    const circle = this.progressRing.nativeElement;
    circle.style.strokeDashoffset = `${this.offset}`;
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
}