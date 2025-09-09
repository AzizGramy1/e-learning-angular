import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';


interface TerminalCommand {
  input: string;
  output: string;
  error: boolean;
  success: boolean;
}

interface CodeOutput {
  message: string;
  type: 'info' | 'success' | 'error';
}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  active: boolean;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  courseName: string;
  lessonName: string;
}

interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

interface CourseProgress {
  percentage: number;
  completed: number;
  total: number;
}

@Component({
  selector: 'app-unity-component',
  templateUrl: './unity-component.component.html',
  styleUrls: ['./unity-component.component.scss']
})
export class UnityComponentComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalInput') terminalInput!: ElementRef;

  // Données de l'utilisateur
  userProfile: UserProfile = {
    name: 'Marie Dupont',
    role: 'Étudiante',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  };

  // Progression du cours
  courseProgress: CourseProgress = {
    percentage: 65,
    completed: 13,
    total: 20
  };

  // Leçon actuelle
  currentLesson: Lesson = {
    id: 'arrow-functions',
    title: 'Fonctions fléchées en JavaScript',
    courseName: 'Maîtrise de JavaScript Moderne',
    lessonName: '3.2 Fonctions fléchées',
    content: `
      <p>Les fonctions fléchées (arrow functions) offrent une syntaxe concisa pour écrire des fonctions en JavaScript. Elles sont particulièrement utiles pour les fonctions courtes et les callbacks.</p>
      
      <h2>Syntaxe de base</h2>
      <p>La syntaxe de base d'une fonction fléchée :</p>
      <pre><code>const functionName = (param1, param2) => {
  // corps de la fonction
  return result;
};</code></pre>
      
      <p>Si la fonction ne contient qu'une seule expression, vous pouvez omettre les accolades et le mot-clé <code>return</code> :</p>
      <pre><code>const double = (x) => x * 2;</code></pre>
      
      <h2>Différences importantes</h2>
      <p>Les fonctions fléchées diffèrent des fonctions traditionnelles sur plusieurs points :</p>
      <ul class="list-disc list-inside mb-4">
        <li>Pas de binding de <code>this</code> (elles héritent du contexte parent)</li>
        <li>Ne peuvent pas être utilisées comme constructeurs</li>
        <li>Pas d'objet <code>arguments</code></li>
      </ul>
      
      <div class="challenge-card">
        <div class="challenge-header">
          <div class="challenge-icon">
            <i class="fas fa-lightbulb"></i>
          </div>
          <h3 class="font-bold">Défi : Convertir une fonction classique</h3>
        </div>
        <p>Convertissez la fonction suivante en fonction fléchée :</p>
        <pre><code>function multiply(a, b) {
  return a * b;
}</code></pre>
        <p>Essayez de le faire dans le terminal ou l'éditeur de code à droite !</p>
      </div>
      
      <div class="hint-container">
        <div class="hint-header">
          <i class="fas fa-lightbulb mr-2"></i>
          <span>Conseil</span>
          <span class="hint-toggle" (click)="toggleHint()">
            <i class="fas fa-chevron-down"></i>
          </span>
        </div>
        <div class="hint-content" id="hintContent">
          <p>N'oubliez pas que pour une fonction fléchée avec une seule expression, vous pouvez omettre les accolades et le mot-clé <code>return</code>.</p>
          <p>La solution devrait ressembler à : <code>const multiply = (a, b) => a * b;</code></p>
        </div>
      </div>
    `
  };

  // Navigation
  navigationItems: NavigationItem[] = [
    { id: 'instructions', label: 'Instructions', icon: 'fas fa-info-circle text-blue-400', active: true },
    { id: 'terminal', label: 'Terminal', icon: 'fas fa-terminal text-green-400', active: false },
    { id: 'editor', label: 'Éditeur de code', icon: 'fas fa-code text-purple-400', active: false },
    { id: 'challenges', label: 'Défis', icon: 'fas fa-tasks text-yellow-400', active: false },
    { id: 'help', label: 'Aide', icon: 'fas fa-question-circle text-red-400', active: false }
  ];

  // Onglets
  tabs = [
    { id: 'terminal', label: 'Terminal' },
    { id: 'editor', label: 'Éditeur de code' }
  ];
  activeTab: string = 'terminal';

  // Terminal
  terminalHistory: TerminalCommand[] = [
    { 
      input: 'node welcome.js', 
      output: 'Bienvenue dans la leçon sur les fonctions fléchées!', 
      error: false, 
      success: true 
    },
    { 
      input: '// Tapez votre code ici...', 
      output: '', 
      error: false, 
      success: false 
    }
  ];

  // Éditeur de code
  codeContent: string = `// Défi: Convertir la fonction multiply en fonction fléchée
function multiply(a, b) {
  return a * b;
}

console.log(multiply(5, 3));`;

  // Sortie du code
  codeOutput: CodeOutput[] = [
    { message: '// La sortie de votre code apparaîtra ici', type: 'info' }
  ];

  // État du composant
  userMenuOpen: boolean = false;
  sidebarOpen: boolean = false;
  hintExpanded: boolean = false;

  // Navigation entre les leçons
  hasPreviousLesson: boolean = true;
  hasNextLesson: boolean = true;

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  ngAfterViewInit(): void {
    // Focus sur l'input du terminal après le rendu
    setTimeout(() => {
      if (this.terminalInput) {
        this.terminalInput.nativeElement.focus();
      }
    }, 100);
  }

  // Navigation
  navigateTo(section: string): void {
    this.navigationItems.forEach(item => item.active = item.id === section);
    // Implémenter la logique de navigation
  }

  // Terminal
  onTerminalKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = this.terminalInput.nativeElement.textContent.trim();
      
      if (input) {
        this.processCommand(input);
        this.terminalInput.nativeElement.textContent = '';
      }
    }
  }

  processCommand(command: string): void {
    let output = '';
    let error = false;
    let success = false;

    try {
      if (command.includes('=>')) {
        // Évaluer les fonctions fléchées
        const result = eval(`(${command})`);
        output = result;
        success = true;
      } else if (command === 'help') {
        output = 'Commandes disponibles:\n- Tapez une fonction fléchée pour l\'évaluer\n- help: Affiche cette aide\n- clear: Efface le terminal';
      } else if (command === 'clear') {
        this.terminalHistory = [
          { input: 'clear', output: 'Terminal cleared', error: false, success: true }
        ];
        return;
      } else {
        const result = eval(command);
        output = result;
      }
    } catch (e: any) {
      output = `Erreur: ${e.message}`;
      error = true;
    }

    this.terminalHistory.push({ input: command, output, error, success });
    
    // Scroll to bottom
    setTimeout(() => {
      const terminalOutput = document.getElementById('terminalOutput');
      if (terminalOutput) {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      }
    }, 10);
  }

  // Éditeur de code
  runCode(): void {
    this.codeOutput = [];
    
    try {
      // Capturer console.log
      const originalConsoleLog = console.log;
      const logs: any[] = [];
      
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
        originalConsoleLog.apply(console, args);
      };

      // Exécuter le code
      eval(this.codeContent);

      // Restaurer console.log
      console.log = originalConsoleLog;

      // Afficher la sortie
      if (logs.length > 0) {
        logs.forEach(log => {
          this.codeOutput.push({ message: log, type: 'info' });
        });
      } else {
        this.codeOutput.push({ message: 'Code exécuté avec succès (aucune sortie)', type: 'success' });
      }
    } catch (error: any) {
      this.codeOutput.push({ message: `Erreur: ${error.message}`, type: 'error' });
    }
  }

  resetCode(): void {
    this.codeContent = `// Défi: Convertir la fonction multiply en fonction fléchée
function multiply(a, b) {
  return a * b;
}

console.log(multiply(5, 3));`;
    this.codeOutput = [{ message: '// La sortie de votre code apparaîtra ici', type: 'info' }];
  }

  checkSolution(): void {
    if (this.codeContent.includes('=>') && !this.codeContent.includes('function multiply')) {
      this.codeOutput = [{ message: '✓ Félicitations! Vous avez correctement converti la fonction en fonction fléchée.', type: 'success' }];
    } else {
      this.codeOutput = [{ message: '⚠️ Il semble que vous n\'ayez pas encore converti la fonction en fonction fléchée. Essayez d\'utiliser la syntaxe =>.', type: 'error' }];
    }
  }

  // Onglets
  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // UI Helpers
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    const sidebar = document.querySelector('.sidebar-bg');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebar && backdrop) {
      if (this.sidebarOpen) {
        sidebar.classList.remove('hidden');
        backdrop.classList.remove('hidden');
      } else {
        sidebar.classList.add('hidden');
        backdrop.classList.add('hidden');
      }
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleHint(): void {
    this.hintExpanded = !this.hintExpanded;
    const hintContent = document.getElementById('hintContent');
    const hintToggle = document.querySelector('.hint-toggle i');
    
    if (hintContent && hintToggle) {
      if (this.hintExpanded) {
        hintContent.classList.add('expanded');
        hintToggle.classList.remove('fa-chevron-down');
        hintToggle.classList.add('fa-chevron-up');
      } else {
        hintContent.classList.remove('expanded');
        hintToggle.classList.remove('fa-chevron-up');
        hintToggle.classList.add('fa-chevron-down');
      }
    }
  }

  // Actions
  logout(): void {
    console.log('Déconnexion...');
    // Implémenter la logique de déconnexion
  }

  showHelp(): void {
    console.log('Afficher l\'aide...');
    // Implémenter l'affichage de l'aide
  }

  openSettings(): void {
    console.log('Ouvrir les paramètres...');
    // Implémenter l'ouverture des paramètres
  }

  showProgress(): void {
    console.log('Afficher la progression...');
    // Implémenter l'affichage de la progression
  }

  previousLesson(): void {
    console.log('Leçon précédente...');
    // Implémenter la navigation vers la leçon précédente
  }

  nextLesson(): void {
    console.log('Leçon suivante...');
    // Implémenter la navigation vers la leçon suivante
  }
}
