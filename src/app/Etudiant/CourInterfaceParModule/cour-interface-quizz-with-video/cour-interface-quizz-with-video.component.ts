import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cour-interface-quizz-with-video',
  templateUrl: './cour-interface-quizz-with-video.component.html',
  styleUrls: ['./cour-interface-quizz-with-video.component.scss'],
    animations: [
    trigger('flipIn', [
      state('void', style({ opacity: 0, transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)' })),
      transition(':enter', [
        animate('0.6s ease-out', style({ opacity: 1, transform: 'perspective(400px)' }))
      ])
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.3s ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.3s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CourInterfaceQuizzWithVideoComponent implements OnInit, AfterViewInit {
  @ViewChild('quizVideo') quizVideo!: ElementRef<HTMLVideoElement>;

  isSidebarOpen = false;
  isUserMenuOpen = false;
  isVideoControlsVisible = false;
  videoPlaying = false;
  videoProgress = 35; // Initial progress from CSS
  currentTime = 0;
  duration = 22 * 60 + 45; // 22:45 in seconds
  isMuted = false;
  playbackSpeed = 1;
  courseProgress = 65;
  currentQuestionIndex = 1;
  selectedOptionIndex: number | null = null;
  showFeedback = false;
  feedbackMessage = '';
  feedbackCorrect = false;
  isQuizPopupOpen = false;
  popupQuestion: any = null;
  popupQuestionIndex = 0;
  popupSelectedOptionIndex: number | null = null;
  quizTimer = 30;
  private timerInterval: any;
  circumference = 2 * Math.PI * 20; // For progress ring (radius 20)
  progressOffset = this.circumference - (2 / 5) * this.circumference; // 2/5 questions complete
  questionAnswered: { correct: boolean }[] = [
    { correct: true }, // Question 1 answered correctly
    { correct: false }, // Question 2 not answered yet
    { correct: false },
    { correct: false },
    { correct: false }
  ];

  questions = [
    {
      question: 'Quelle est la principale caractéristique des fonctions fléchées en JavaScript?',
      options: [
        { text: "Elles ont leur propre contexte 'this'", correct: false },
        { text: "Elles n'ont pas de contexte 'this' propre", correct: true },
        { text: "Elles ne peuvent pas être utilisées comme méthodes", correct: false },
        { text: "Elles nécessitent le mot-clé 'function'", correct: false }
      ]
    },
    {
      question: 'Quelle est la syntaxe correcte pour une fonction fléchée qui renvoie la somme de deux nombres?',
      options: [
        { text: 'function(a, b) { return a + b; }', correct: false },
        { text: '(a, b) => { a + b }', correct: false },
        { text: '(a, b) => a + b', correct: true },
        { text: 'a, b => return a + b', correct: false }
      ]
    },
    {
      question: 'Quelle est la syntaxe correcte pour une fonction fléchée avec un paramètre?',
      options: [
        { text: 'x => { return x * x }', correct: true },
        { text: 'function(x) { return x * x }', correct: false },
        { text: '(x) => return x * x', correct: false },
        { text: 'x -> x * x', correct: false }
      ]
    },
    {
      question: 'Quelle est la principale différence entre une fonction fléchée et une fonction classique?',
      options: [
        { text: 'Les fonctions fléchées sont plus lentes', correct: false },
        { text: 'Les fonctions fléchées ne lient pas leur propre this', correct: true },
        { text: 'Les fonctions fléchées ne peuvent pas être appelées', correct: false },
        { text: 'Les fonctions fléchées utilisent toujours return', correct: false }
      ]
    },
    {
      question: 'Quel est l’avantage principal des fonctions fléchées?',
      options: [
        { text: 'Syntaxe plus concise', correct: true },
        { text: 'Meilleure performance', correct: false },
        { text: 'Compatibilité avec les anciens navigateurs', correct: false },
        { text: 'Utilisation de prototypes', correct: false }
      ]
    }
  ];

  quizMarkers = [
    { question: 1, position: 25 },
    { question: 2, position: 50 },
    { question: 3, position: 75 }
  ];

  constructor() {}

  ngOnInit(): void {
    this.updateProgressRing();
  }

  ngAfterViewInit(): void {
    this.quizVideo.nativeElement.addEventListener('timeupdate', () => {
      this.currentTime = this.quizVideo.nativeElement.currentTime;
      this.videoProgress = (this.currentTime / this.duration) * 100;
    });
    this.quizVideo.nativeElement.addEventListener('loadedmetadata', () => {
      this.duration = this.quizVideo.nativeElement.duration || this.duration;
    });
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const userMenuButton = (event.target as HTMLElement).closest('.user-menu-button');
    const userMenu = (event.target as HTMLElement).closest('.user-menu');
    if (!userMenuButton && !userMenu && this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  showVideoControls(): void {
    this.isVideoControlsVisible = true;
  }

  hideVideoControls(): void {
    this.isVideoControlsVisible = false;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  navigateTo(section: string): void {
    console.log(`Navigate to ${section}`);
    // Implement navigation logic (e.g., using Angular Router)
  }

  openHelp(): void {
    console.log('Open help');
    // Implement help logic
  }

  openSettings(): void {
    console.log('Open settings');
    // Implement settings logic
  }

  togglePlayPause(): void {
    if (this.quizVideo.nativeElement.paused) {
      this.quizVideo.nativeElement.play();
      this.videoPlaying = true;
    } else {
      this.quizVideo.nativeElement.pause();
      this.videoPlaying = false;
    }
  }

  rewind(): void {
    this.quizVideo.nativeElement.currentTime = Math.max(0, this.quizVideo.nativeElement.currentTime - 10);
  }

  forward(): void {
    this.quizVideo.nativeElement.currentTime = Math.min(this.duration, this.quizVideo.nativeElement.currentTime + 10);
  }

  seekVideo(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    this.quizVideo.nativeElement.currentTime = (percentage / 100) * this.duration;
  }

  cyclePlaybackSpeed(): void {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(this.playbackSpeed);
    this.playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
    this.quizVideo.nativeElement.playbackRate = this.playbackSpeed;
  }

  toggleSubtitles(): void {
    console.log('Toggle subtitles');
    // Implement subtitle toggle logic
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.quizVideo.nativeElement.muted = this.isMuted;
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      this.quizVideo.nativeElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  selectOption(index: number): void {
    this.selectedOptionIndex = index;
  }

  selectPopupOption(index: number): void {
    this.popupSelectedOptionIndex = index;
  }

  showQuizPopup(questionNum: number): void {
    this.quizVideo.nativeElement.pause();
    this.videoPlaying = false;
    this.popupQuestionIndex = questionNum - 1;
    this.popupQuestion = this.questions[this.popupQuestionIndex];
    this.isQuizPopupOpen = true;
    this.popupSelectedOptionIndex = null;
    this.quizTimer = 30;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.quizTimer -= 0.1;
      if (this.quizTimer <= 0) {
        this.submitPopupAnswer();
      }
    }, 100);
  }

  closeQuizPopup(): void {
    this.isQuizPopupOpen = false;
    clearInterval(this.timerInterval);
    this.quizVideo.nativeElement.play();
    this.videoPlaying = true;
  }

  submitPopupAnswer(): void {
    clearInterval(this.timerInterval);
    const selectedOption = this.popupSelectedOptionIndex !== null ? this.popupQuestion.options[this.popupSelectedOptionIndex] : null;

    if (!selectedOption) {
      this.feedbackMessage = `Temps écoulé! La bonne réponse était: ${this.popupQuestion.options.find((opt: any) => opt.correct).text}`;
      this.feedbackCorrect = false;
    } else {
      this.feedbackCorrect = selectedOption.correct;
      this.feedbackMessage = this.feedbackCorrect
        ? 'Bonne réponse!'
        : `Mauvaise réponse. La bonne réponse était: ${this.popupQuestion.options.find((opt: any) => opt.correct).text}`;
    }

    this.showFeedback = true;
    this.isQuizPopupOpen = false;

    setTimeout(() => {
      this.showFeedback = false;
      this.quizVideo.nativeElement.play();
      this.videoPlaying = true;
    }, 3000);
  }

  nextQuestion(): void {
    if (this.selectedOptionIndex === null) {
      return;
    }

    const isCorrect = this.currentQuestion.options[this.selectedOptionIndex].correct;
    this.questionAnswered[this.currentQuestionIndex] = { correct: isCorrect };

    this.feedbackCorrect = isCorrect;
    this.feedbackMessage = isCorrect
      ? 'Bonne réponse!'
      : `Mauvaise réponse. La bonne réponse était: ${this.currentQuestion.options.find((opt: any) => opt.correct).text}`;
    this.showFeedback = true;

    setTimeout(() => {
      this.showFeedback = false;
      if (isCorrect && this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedOptionIndex = null;
        this.updateProgressRing();
      }
    }, 3000);
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOptionIndex = null;
      this.showFeedback = false;
      this.updateProgressRing();
    }
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  updateProgressRing(): void {
    this.progressOffset = this.circumference - ((this.currentQuestionIndex + 1) / this.questions.length) * this.circumference;
  }
}