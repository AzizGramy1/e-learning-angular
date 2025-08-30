import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cour-interface-quizz',
  templateUrl: './cour-interface-quizz.component.html',
  styleUrls: ['./cour-interface-quizz.component.scss']
})
export class CourInterfaceQuizzComponent implements OnInit {
  @ViewChild('progressRing', { static: true }) progressRing!: ElementRef<SVGCircleElement>;

  isSidebarOpen = false;
  isUserMenuOpen = false;
  currentQuestionIndex = 1; // Start at question 2 (index 1)
  selectedOption: number | null = null;
  showFeedback = false;
  feedbackCorrect = false;
  feedbackMessage = '';
  questionStatus: string[] = ['correct', '']; // Track status of each question (correct, incorrect, or '')
  circumference = 2 * Math.PI * 20; // Radius = 20
  offset = this.circumference - (2 / 5) * this.circumference; // 40% complete for question 2/5

  questions = [
    {
      text: 'Quelle est la principale différence entre une fonction fléchée et une fonction classique en JavaScript ?',
      points: 2,
      options: [
        { text: 'function(a) { return a; }', correct: false },
        { text: 'a => a', correct: true },
        { text: '(a) => { return a }', correct: false },
        { text: 'function => a', correct: false }
      ]
    },
    {
      text: 'Quelle est la syntaxe correcte pour une fonction fléchée qui renvoie la somme de deux nombres ?',
      points: 2,
      options: [
        { text: 'function(a, b) { return a + b; }', correct: false },
        { text: '(a, b) => { a + b }', correct: false },
        { text: '(a, b) => a + b', correct: true },
        { text: 'a, b => return a + b', correct: false }
      ]
    },
    {
      text: 'Comment le mot-clé `this` se comporte-t-il dans une fonction fléchée ?',
      points: 2,
      options: [
        { text: 'Il est lié à l\'objet global', correct: false },
        { text: 'Il est lié au contexte de l\'appelant', correct: false },
        { text: 'Il hérite du contexte parent', correct: true },
        { text: 'Il est toujours undefined', correct: false }
      ]
    },
    {
      text: 'Une fonction fléchée peut-elle être utilisée comme constructeur ?',
      points: 2,
      options: [
        { text: 'Oui, comme toute fonction', correct: false },
        { text: 'Non, elle n\'a pas de prototype', correct: true },
        { text: 'Oui, si définie avec `new`', correct: false },
        { text: 'Non, sauf dans ES6', correct: false }
      ]
    },
    {
      text: 'Quel est l\'avantage principal des fonctions fléchées ?',
      points: 2,
      options: [
        { text: 'Elles sont plus rapides', correct: false },
        { text: 'Elles ont une syntaxe plus concise', correct: true },
        { text: 'Elles supportent le hoisting', correct: false },
        { text: 'Elles modifient le contexte de `this`', correct: false }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeProgressRing();
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
    if (this.selectedOption === null) {
      return;
    }

    const isCorrect = this.questions[this.currentQuestionIndex].options[this.selectedOption].correct;
    this.feedbackCorrect = isCorrect;
    this.feedbackMessage = isCorrect ? 'Bonne réponse!' : 'Mauvaise réponse. Essayez encore!';
    this.showFeedback = true;
    this.questionStatus[this.currentQuestionIndex] = isCorrect ? 'correct' : 'incorrect';

    if (isCorrect) {
      this.createConfetti();
    }

    setTimeout(() => {
      this.showFeedback = false;
      if (isCorrect) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedOption = null;
          this.updateProgressRing();
        } else {
          alert('Quiz terminé !');
          this.navigateTo('courses');
        }
      }
    }, 3000);
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

      setTimeout(() => {
        confetti.remove();
      }, 5000);
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