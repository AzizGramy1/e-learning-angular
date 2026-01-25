import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

interface TerminalCommand {
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  content: string;
  timestamp: Date;
}

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  lessonName: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  theory: string;
  exampleTitle: string;
  exampleCode: string;
  concepts: Array<{ icon: string; name: string; description: string }>;
  practices: Array<{ title: string; description: string }>;
  hints: string[];
  starterCode: string;
  solution: string;
  tests: Array<{ input: string; expected: string; description: string }>;
}

interface CodeOutput {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface ConsoleOutput {
  message: string;
  type: 'log' | 'error' | 'warn' | 'info';
}

interface InteractiveExercise {
  id: string;
  question: string;
  description: string;
  type: 'code' | 'multiple-choice' | 'fill-blanks' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  codeTemplate?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hints: string[];
  timeLimit?: number;
  resources?: Array<{ type: 'doc' | 'example' | 'video'; title: string; content: string }>;
}

interface UserProgress {
  exerciseId: string;
  completed: boolean;
  attempts: number;
  score: number;
  timeSpent: number;
  lastAttempt: Date;
  codeAttempts: string[];
}


@Component({
  selector: 'app-unity-component',
  templateUrl: './unity-component.component.html',
  styleUrls: ['./unity-component.component.scss']
})
export class UnityComponentComponent implements OnInit, AfterViewInit {
 @ViewChild('terminalInput') terminalInput!: ElementRef;
  @ViewChild('terminalContent') terminalContent!: ElementRef;

  // Données utilisateur
  userProfile = {
    name: 'Azizt',
    role: 'Etudiant',
    avatar: 'https://www.freelances.tn/wp-content/uploads/2024/10/2742429639260218-300x300.jpg'
  };

  // Progression du cours
  courseProgress = {
    percentage: 75,
    completed: 15,
    total: 20
  };

  // État de l'UI
  activeTab: 'lesson' | 'editor' | 'terminal' | 'preview' = 'lesson';
  activeDocTab: 'commands' | 'react' | 'hooks' | 'examples' = 'commands';
  sidebarOpen = false;

  // État du terminal
  terminalHistory: TerminalCommand[] = [
    { type: 'info', content: '✓ Bienvenue dans le terminal React!', timestamp: new Date() },
    { type: 'info', content: 'Tapez "help" pour voir les commandes disponibles', timestamp: new Date() }
  ];
  terminalInputValue = '';

  // État de l'éditeur
  editorContent = '';
  codeOutput: CodeOutput[] = [];
  consoleOutput: ConsoleOutput[] = [];

  // Mode interactif
  interactiveMode = {
    enabled: true,
    currentExerciseIndex: 0,
    showExercise: true,
    showFeedback: false,
    timerActive: false,
    timerRemaining: 0,
    timerInterval: null as any
  };

  // Exercices interactifs
  interactiveExercises: InteractiveExercise[] = [
    {
      id: 'ex1',
      question: 'Implémentez un compteur avec useReducer',
      description: 'Créez un composant Counter qui utilise useReducer pour gérer l\'état. Le compteur doit pouvoir incrémenter, décrémenter et réinitialiser.',
      type: 'code',
      difficulty: 'medium',
      points: 100,
      codeTemplate: `import { useReducer } from 'react';

const initialState = { count: 0 };

// TODO: Complétez la fonction reducer
const reducer = (state, action) => {
  switch(action.type) {
    // Ajoutez les cases manquants
  }
};

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Compteur: {state.count}</h2>
      <div>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>
          +
        </button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>
          -
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })}>
          Reset
        </button>
      </div>
    </div>
  );
}`,
      correctAnswer: `const reducer = (state, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
};`,
      explanation: 'Le reducer gère trois types d\'actions : INCREMENT, DECREMENT et RESET. Chaque action retourne un nouvel état basé sur l\'action reçue.',
      hints: [
        'Pensez à retourner un nouvel objet à chaque fois',
        'N\'oubliez pas le cas par défaut qui retourne l\'état actuel',
        'Les actions doivent avoir une propriété "type"'
      ],
      resources: [
        {
          type: 'doc',
          title: 'Documentation useReducer',
          content: 'https://reactjs.org/docs/hooks-reference.html#usereducer'
        },
        {
          type: 'example',
          title: 'Exemple de compteur',
          content: 'Compteur avec trois boutons et gestion d\'état complexe'
        }
      ]
    }
  ];

  // Progrès utilisateur
  userProgress: UserProgress[] = [];

  // Cache en mémoire pour remplacer localStorage
  private progressCache: any = null;

  // Documentation interactive
  interactiveDocs = {
    sections: [
      {
        id: 'hooks',
        title: 'React Hooks',
        content: `# React Hooks Guide

## useState
Gère l'état local dans un composant fonctionnel.

\`\`\`javascript
const [state, setState] = useState(initialValue);
\`\`\`

## useEffect
Exécute des effets de bord après le rendu.

\`\`\`javascript
useEffect(() => {
  // Code d'effet
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

## useReducer
Alternative à useState pour état complexe.

\`\`\`javascript
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`

## Règles des Hooks
1. Appelez les hooks seulement au niveau racine
2. Appelez les hooks seulement dans des fonctions React
3. Préfixez les hooks personnalisés avec "use"`,
        examples: [
          {
            title: 'Compteur simple',
            code: `const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
};`
          }
        ]
      }
    ],
    currentSection: 'hooks',
    searchQuery: ''
  };

  // Code des étudiants
  studentCode = '';
  codeValidation = {
    passed: false,
    errors: [] as string[],
    warnings: [] as string[],
    hints: [] as string[]
  };

  // Leçon actuelle
  currentLesson: Lesson = {
    id: 'hooks-advanced',
    title: 'Hooks React Avancés',
    subtitle: 'Maîtrisez les hooks personnalisés et optimisez vos performances',
    lessonName: '5.3 Hooks Avancés',
    duration: 45,
    difficulty: 'advanced',
    points: 500,
    theory: `
      Les hooks avancés vous permettent de créer des fonctionnalités complexes tout en conservant votre code propre et maintenable.
      Le hook useReducer est particulièrement utile pour gérer des états complexes avec plusieurs transitions.
      Les hooks personnalisés vous permettent d'extraire la logique et de la réutiliser dans plusieurs composants.
    `,
    exampleTitle: 'useReducer - Gestion d\'état avancée',
    exampleCode: `
const reducer = (state, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
};

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
    `,
    concepts: [
      {
        icon: 'fas fa-code-branch',
        name: 'useReducer',
        description: 'Gérez des états complexes avec une logique prévisible'
      },
      {
        icon: 'fas fa-cube',
        name: 'Hooks personnalisés',
        description: 'Créez vos propres hooks pour partager la logique'
      },
      {
        icon: 'fas fa-zap',
        name: 'Optimisation',
        description: 'Évitez les re-rendus inutiles avec useMemo et useCallback'
      },
      {
        icon: 'fas fa-layer-group',
        name: 'Composition',
        description: 'Composez des hooks pour créer des fonctionnalités puissantes'
      }
    ],
    practices: [
      {
        title: 'Gardez vos hooks petits et fonctionnels',
        description: 'Un hook doit faire une seule chose, et la faire bien. Composez plusieurs hooks si nécessaire.'
      },
      {
        title: 'Nommez vos hooks avec "use"',
        description: 'Le préfixe "use" aide React et les autres développeurs à identifier que c\'est un hook.'
      },
      {
        title: 'Évitez les appels conditionnels',
        description: 'N\'appelez jamais les hooks de manière conditionnelle. Mettez la condition à l\'intérieur.'
      },
      {
        title: 'Testez vos hooks personnalisés',
        description: 'Utilisez des librairies comme @testing-library/react-hooks pour tester vos hooks.'
      }
    ],
    hints: [
      'useReducer est idéal quand vous avez plusieurs types d\'actions',
      'Créez un hook personnalisé pour réutiliser la logique entre composants',
      'Utilisez useMemo pour mémoriser les calculs coûteux',
      'useCallback mémorise les fonctions pour éviter les re-rendus enfants'
    ],
    starterCode: `import { useReducer } from 'react';

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Compteur: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>
        Augmenter
      </button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>
        Diminuer
      </button>
    </div>
  );
}
    `,
    solution: `import { useReducer } from 'react';

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
};

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Compteur: {state.count}</h2>
      <div>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>
          +
        </button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>
          -
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })}>
          Reset
        </button>
      </div>
    </div>
  );
}
    `,
    tests: [
      { input: 'state.count === 0', expected: 'true', description: 'L\'état initial est 0' },
      { input: 'dispatch({ type: "INCREMENT" }); state.count', expected: '1', description: 'INCREMENT incrémente le compteur' },
      { input: 'dispatch({ type: "DECREMENT" }); state.count', expected: '0', description: 'DECREMENT décrémente le compteur' }
    ]
  };

  // Navigation
  hasPreviousLesson = true;
  hasNextLesson = true;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.editorContent = this.currentLesson.starterCode;
    this.studentCode = this.interactiveExercises[0].codeTemplate || '';
  }

  ngOnInit() {
    // Initialiser le progrès
    this.interactiveExercises.forEach(ex => {
      this.userProgress.push({
        exerciseId: ex.id,
        completed: false,
        attempts: 0,
        score: 0,
        timeSpent: 0,
        lastAttempt: new Date(),
        codeAttempts: []
      });
    });
    
    // Charger la progression sauvegardée
    this.loadProgress();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.terminalInput) {
        this.terminalInput.nativeElement.focus();
      }
    }, 100);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  // ===== NAVIGATION =====

  switchTab(tab: 'lesson' | 'editor' | 'terminal' | 'preview') {
    this.activeTab = tab;
    
    if (tab === 'terminal') {
      setTimeout(() => {
        if (this.terminalInput?.nativeElement) {
          this.terminalInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  switchDocTab(tab: 'commands' | 'react' | 'hooks' | 'examples') {
    this.activeDocTab = tab;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  previousLesson() {
    if (this.hasPreviousLesson) {
      console.log('Leçon précédente');
    }
  }

  nextLesson() {
    if (this.hasNextLesson) {
      console.log('Leçon suivante');
    }
  }

  logout() {
    this.router.navigate(['/Etudiant/Cours']);
  }

  // ===== TERMINAL =====

  onTerminalKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.executeTerminalCommand(this.terminalInputValue);
      this.terminalInputValue = '';
    } else if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.executeTerminalCommand('run');
      this.terminalInputValue = '';
    } else if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      this.terminalHistory = [];
    }
  }

  executeTerminalCommand(command: string) {
    if (!command.trim()) return;

    this.terminalHistory.push({
      type: 'command',
      content: command,
      timestamp: new Date()
    });

    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case 'run':
        this.runCodeFromEditor();
        break;
      case 'help':
        this.showTerminalHelp();
        break;
      case 'clear':
        this.terminalHistory = [];
        break;
      case 'docs':
        this.showDocumentation();
        break;
      case 'solution':
        this.showSolutionInTerminal();
        break;
      case 'test':
        this.runTests();
        break;
      case 'exercise':
        const exIndex = parseInt(parts[1]) - 1;
        if (!isNaN(exIndex) && exIndex >= 0 && exIndex < this.interactiveExercises.length) {
          this.startExercise(exIndex);
          this.terminalHistory.push({
            type: 'success',
            content: `✅ Démarrage de l'exercice ${exIndex + 1}: ${this.interactiveExercises[exIndex].question}`,
            timestamp: new Date()
          });
        }
        break;
      case 'hint':
        this.getHint();
        break;
      case 'format':
        this.autoFormatCode();
        this.terminalHistory.push({
          type: 'success',
          content: '✅ Code formaté automatiquement',
          timestamp: new Date()
        });
        break;
      case 'progress':
        this.showProgressInTerminal();
        break;
      default:
        this.evaluateJavaScript(command);
    }

    setTimeout(() => {
      if (this.terminalContent?.nativeElement) {
        this.terminalContent.nativeElement.scrollTop = 
          this.terminalContent.nativeElement.scrollHeight;
      }
    }, 50);
  }

  showProgressInTerminal() {
    const completed = this.userProgress.filter(p => p.completed).length;
    const total = this.userProgress.length;
    const score = this.userProgress.reduce((sum, p) => sum + p.score, 0);
    const attempts = this.userProgress.reduce((sum, p) => sum + p.attempts, 0);
    
    this.terminalHistory.push({
      type: 'info',
      content: `📊 Progression: ${completed}/${total} exercices\n   Score total: ${score} points\n   Tentatives: ${attempts}`,
      timestamp: new Date()
    });
  }

  evaluateJavaScript(code: string) {
    try {
      const result = eval(code);
      
      if (result !== undefined) {
        this.terminalHistory.push({
          type: 'success',
          content: String(result),
          timestamp: new Date()
        });
      }
    } catch (error: any) {
      this.terminalHistory.push({
        type: 'error',
        content: `Erreur: ${error.message}`,
        timestamp: new Date()
      });
    }
  }

  runCodeFromEditor() {
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      
      console.log = (...args: any[]) => {
        logs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a) : String(a)
        ).join(' '));
      };

      eval(this.editorContent);

      console.log = originalLog;

      if (logs.length > 0) {
        logs.forEach(log => {
          this.terminalHistory.push({
            type: 'output',
            content: log,
            timestamp: new Date()
          });
        });
      }

      this.terminalHistory.push({
        type: 'success',
        content: '✓ Code exécuté avec succès',
        timestamp: new Date()
      });
    } catch (error: any) {
      this.terminalHistory.push({
        type: 'error',
        content: `✗ Erreur: ${error.message}`,
        timestamp: new Date()
      });
    }
  }

  showTerminalHelp() {
    const help = `Commandes disponibles:
• run - Exécute le code de l'éditeur
• help - Affiche cette aide
• clear - Efface le terminal
• docs - Affiche la documentation React
• solution - Affiche la solution
• test - Lance les tests
• exercise [num] - Démarrer un exercice
• hint - Obtenir un indice
• format - Formater le code
• progress - Voir votre progression

Raccourcis:
• Ctrl + K: Exécuter le code
• Ctrl + L: Effacer le terminal`;

    this.terminalHistory.push({
      type: 'info',
      content: help,
      timestamp: new Date()
    });
  }

  showDocumentation() {
    const docs = `📖 Documentation React - Hooks Avancés

useReducer:
  - Syntaxe: const [state, dispatch] = useReducer(reducer, initialState);
  - Utilisé pour les états complexes
  - Plus prévisible que useState pour les transitions

Hooks Personnalisés:
  - Commencent par "use"
  - Composent d'autres hooks
  - Partagent la logique entre composants

useMemo:
  - Mémorise une valeur calculée
  - Evite les calculs inutiles

useCallback:
  - Mémorise une fonction
  - Evite les re-rendus enfants`;

    this.terminalHistory.push({
      type: 'info',
      content: docs,
      timestamp: new Date()
    });
  }

  showSolutionInTerminal() {
    this.terminalHistory.push({
      type: 'info',
      content: '📋 Voici la solution proposée:',
      timestamp: new Date()
    });

    this.terminalHistory.push({
      type: 'output',
      content: this.currentLesson.solution,
      timestamp: new Date()
    });
  }

  runTests() {
    this.terminalHistory.push({
      type: 'info',
      content: '🧪 Exécution des tests...',
      timestamp: new Date()
    });

    try {
      eval(this.editorContent);
      
      let passed = 0;
      this.currentLesson.tests.forEach((test, index) => {
        try {
          const result = eval(test.input);
          const success = String(result) === test.expected;
          
          if (success) {
            passed++;
            this.terminalHistory.push({
              type: 'success',
              content: `✓ Test ${index + 1}: ${test.description}`,
              timestamp: new Date()
            });
          } else {
            this.terminalHistory.push({
              type: 'error',
              content: `✗ Test ${index + 1}: ${test.description} (attendu: ${test.expected}, obtenu: ${result})`,
              timestamp: new Date()
            });
          }
        } catch (e: any) {
          this.terminalHistory.push({
            type: 'error',
            content: `✗ Test ${index + 1}: ${test.description} - ${e.message}`,
            timestamp: new Date()
          });
        }
      });

      this.terminalHistory.push({
        type: passed === this.currentLesson.tests.length ? 'success' : 'info',
        content: `Résultat: ${passed}/${this.currentLesson.tests.length} tests passés`,
        timestamp: new Date()
      });
    } catch (error: any) {
      this.terminalHistory.push({
        type: 'error',
        content: `Erreur: ${error.message}`,
        timestamp: new Date()
      });
    }
  }

  // ===== ÉDITEUR =====

  runCode() {
    this.codeOutput = [];
    
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
      };

      eval(this.editorContent);

      console.log = originalLog;

      if (logs.length > 0) {
        logs.forEach(log => {
          this.codeOutput.push({ message: log, type: 'info' });
        });
      } else {
        this.codeOutput.push({ message: '✓ Code exécuté avec succès', type: 'success' });
      }
    } catch (error: any) {
      this.codeOutput.push({ message: `Erreur: ${error.message}`, type: 'error' });
    }
  }

  executeInTerminal() {
    this.switchTab('terminal');
    this.executeTerminalCommand('run');
  }

  checkSolution() {
    this.codeOutput = [];
    
    if (this.editorContent.includes('useReducer') && 
        this.editorContent.includes('reducer') && 
        this.editorContent.includes('dispatch')) {
      this.codeOutput.push({ 
        message: '✓ Excellente solution! Vous utilisez tous les éléments importants.',
        type: 'success' 
      });
    } else {
      this.codeOutput.push({ 
        message: '⚠️ Votre code ne semble pas complet. Vérifiez que vous utilisez useReducer.',
        type: 'warning' 
      });
    }
  }

  resetCode() {
    this.editorContent = this.currentLesson.starterCode;
    this.codeOutput = [];
  }

  formatCode() {
    try {
      const formatted = this.editorContent
        .replace(/\n\s+/g, '\n')
        .trim();
      this.editorContent = formatted;
    } catch (error) {
      console.error('Erreur de formatage:', error);
    }
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      this.codeOutput.push({ 
        message: '✓ Code copié dans le presse-papiers',
        type: 'success' 
      });
    });
  }

  // ===== MODE INTERACTIF =====

  startExercise(exerciseIndex: number) {
    this.interactiveMode.currentExerciseIndex = exerciseIndex;
    this.interactiveMode.showExercise = true;
    this.interactiveMode.showFeedback = false;
    
    const exercise = this.interactiveExercises[exerciseIndex];
    this.studentCode = exercise.codeTemplate || '';
    
    if (exercise.timeLimit) {
      this.startTimer(exercise.timeLimit);
    }
  }

  submitAnswer() {
    const exercise = this.getCurrentExercise();
    const progress = this.getCurrentProgress();
    
    progress.attempts++;
    progress.lastAttempt = new Date();
    progress.codeAttempts.push(this.studentCode);
    
    if (exercise.type === 'code') {
      this.validateCodeExercise(exercise);
    }
    
    this.interactiveMode.showFeedback = true;
    
    if (this.codeValidation.passed) {
      progress.completed = true;
      progress.score = exercise.points;
    }
    
    this.saveProgress();
  }

  validateCodeExercise(exercise: InteractiveExercise) {
    this.codeValidation = {
      passed: false,
      errors: [],
      warnings: [],
      hints: []
    };
    
    try {
      const code = this.studentCode.toLowerCase();
      
      if (exercise.id === 'ex1' && !code.includes('usereducer')) {
        this.codeValidation.errors.push('Vous devez utiliser useReducer');
      }
      
      if (exercise.id === 'ex1') {
        const requiredActions = ['increment', 'decrement', 'reset'];
        const missingActions = requiredActions.filter(action => 
          !code.includes(action.toLowerCase())
        );
        
        if (missingActions.length > 0) {
          this.codeValidation.errors.push(
            `Actions manquantes: ${missingActions.join(', ')}`
          );
        }
      }
      
      if (!code.includes('return')) {
        this.codeValidation.errors.push('La fonction reducer doit retourner un état');
      }
      
      if (!code.includes('switch') && !code.includes('case')) {
        this.codeValidation.errors.push('Utilisez un switch statement pour gérer les actions');
      }
      
      const expected = (exercise.correctAnswer as string).toLowerCase();
      const similarity = this.calculateSimilarity(code, expected);
      
      if (similarity > 0.7) {
        this.codeValidation.passed = true;
        this.codeValidation.hints.push('✅ Excellent! Votre solution est correcte.');
      } else {
        this.codeValidation.hints.push(`Similarité avec la solution: ${Math.round(similarity * 100)}%`);
        this.codeValidation.hints.push(...exercise.hints);
      }
      
    } catch (error) {
      this.codeValidation.errors.push('Erreur lors de la validation');
    }
  }

  calculateSimilarity(code1: string, code2: string): number {
    const words1 = code1.split(/\s+/);
    const words2 = code2.split(/\s+/);
    
    const commonWords = words1.filter(word => 
      words2.includes(word) && word.length > 3
    ).length;
    
    return commonWords / Math.max(words1.length, words2.length);
  }

  getCurrentExercise(): InteractiveExercise {
    return this.interactiveExercises[this.interactiveMode.currentExerciseIndex];
  }

  getCurrentProgress(): UserProgress {
    return this.userProgress[this.interactiveMode.currentExerciseIndex];
  }

  startTimer(seconds: number) {
    this.interactiveMode.timerActive = true;
    this.interactiveMode.timerRemaining = seconds;
    
    this.interactiveMode.timerInterval = setInterval(() => {
      this.interactiveMode.timerRemaining--;
      
      if (this.interactiveMode.timerRemaining <= 0) {
        this.stopTimer();
        this.submitAnswer();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.interactiveMode.timerInterval) {
      clearInterval(this.interactiveMode.timerInterval);
      this.interactiveMode.timerActive = false;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  saveProgress() {
    this.progressCache = {
      progress: this.userProgress,
      lastUpdated: new Date()
    };
    console.log('Progression sauvegardée en mémoire');
  }

  loadProgress() {
    if (this.progressCache) {
      try {
        this.userProgress = this.progressCache.progress || [];
      } catch (e) {
        console.error('Erreur de chargement', e);
      }
    }
  }

  nextExercise() {
    if (this.interactiveMode.currentExerciseIndex < this.interactiveExercises.length - 1) {
      this.interactiveMode.currentExerciseIndex++;
      this.startExercise(this.interactiveMode.currentExerciseIndex);
    }
  }

  previousExercise() {
    if (this.interactiveMode.currentExerciseIndex > 0) {
      this.interactiveMode.currentExerciseIndex--;
      this.startExercise(this.interactiveMode.currentExerciseIndex);
    }
  }

  showSolutionExercise() {
    const exercise = this.getCurrentExercise();
    this.studentCode = exercise.correctAnswer as string;
  }

  resetStudentCode() {
    const exercise = this.getCurrentExercise();
    this.studentCode = exercise.codeTemplate || '';
  }

  getHint() {
    const exercise = this.getCurrentExercise();
    const randomHint = exercise.hints[Math.floor(Math.random() * exercise.hints.length)];
    
    this.terminalHistory.push({
      type: 'info',
      content: `💡 Indice: ${randomHint}`,
      timestamp: new Date()
    });
  }

  runTestCode() {
    try {
      const testCode = `
        ${this.studentCode}
        
        const state = { count: 0 };
        const testReducer = reducer;
        
        console.log('Test 1 - État initial:', JSON.stringify(state));
        
        const incrementState = testReducer(state, { type: 'INCREMENT' });
        console.log('Test 2 - Après INCREMENT:', JSON.stringify(incrementState));
        
        const decrementState = testReducer(incrementState, { type: 'DECREMENT' });
        console.log('Test 3 - Après DECREMENT:', JSON.stringify(decrementState));
        
        const resetState = testReducer(decrementState, { type: 'RESET' });
        console.log('Test 4 - Après RESET:', JSON.stringify(resetState));
      `;
      
      const logs: string[] = [];
      const originalLog = console.log;
      
      console.log = (...args: any[]) => {
        logs.push(args.map(a => 
          typeof a === 'object' ? JSON.stringify(a) : String(a)
        ).join(' '));
      };
      
      eval(testCode);
      console.log = originalLog;
      
      logs.forEach(log => {
        this.terminalHistory.push({
          type: 'output',
          content: log,
          timestamp: new Date()
        });
      });
      
    } catch (error: any) {
      this.terminalHistory.push({
        type: 'error',
        content: `Erreur: ${error.message}`,
        timestamp: new Date()
      });
    }
  }

  autoFormatCode() {
    try {
      let formatted = this.studentCode
        .replace(/\s+/g, ' ')
        .replace(/\s*{\s*/g, ' { ')
        .replace(/\s*}\s*/g, ' } ')
        .replace(/\s*\(\s*/g, ' (')
        .replace(/\s*\)\s*/g, ') ')
        .replace(/;\s*/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      
      let indentLevel = 0;
      const lines = formatted.split('\n');
      formatted = lines.map(line => {
        line = line.trim();
        if (line.includes('}')) indentLevel--;
        const indented = '  '.repeat(Math.max(0, indentLevel)) + line;
        if (line.includes('{')) indentLevel++;
        return indented;
      }).join('\n');
      
      this.studentCode = formatted;
    } catch (error) {
      console.error('Erreur de formatage', error);
    }
  }

  getCurrentDocContent(): SafeHtml {
    const section = this.interactiveDocs.sections.find(s => s.id === this.interactiveDocs.currentSection);
    const content = section ? section.content : '';
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // ===== UTILITAIRES =====

  getOutputIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'success': 'fa-check-circle',
      'error': 'fa-times-circle',
      'info': 'fa-info-circle',
      'warning': 'fa-exclamation-circle'
    };
    return icons[type] || 'fa-circle';
  }

  formatTimeDate(date: Date): string {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }

  showHelp() {
    alert('Aide - Utilisez le terminal pour exécuter du code et apprendre React!');
  }

  openDocumentation() {
    this.switchTab('terminal');
    this.executeTerminalCommand('docs');
  }

  showProgress() {
    alert(`Progression: ${this.courseProgress.percentage}%`);
  }

  refreshPreview() {
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = '<p class="preview-placeholder"><i class="fas fa-sync"></i> Actualisation...</p>';
      
      setTimeout(() => {
        previewContainer.innerHTML = '<p class="preview-placeholder"><i class="fas fa-cube"></i> Aperçu du composant</p>';
      }, 500);
    }
  }

}