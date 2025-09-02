import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Devoir } from 'src/app/Models/Devoir';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { DevoirService } from 'src/app/Service/Devoir/devoir.service';

@Component({
  selector: 'app-details-devoir-avec-rendu',
  templateUrl: './details-devoir-avec-rendu.component.html',
  styleUrls: ['./details-devoir-avec-rendu.component.scss']
})
export class DetailsDevoirAvecRenduComponent implements OnInit {
    devoirsAVenir: Devoir[] = [];
    devoir: any;



  @ViewChild('fileInput') fileInput!: ElementRef;
  sidebarVisible = false;
  activeTab = 'instructions';
  githubLink = '';
  comments = '';
  attestation = false;
  uploadedFiles: File[] = [];

  assignment = {
    title: '',
    description: '',
    status: '',
    dueDate: '',
    points: 0,
    submissionType: '',
    deadlineStatus: '',
    countdown: ''
  };

  instructions = [
    {
      title: 'Structure du projet',
      description: 'Créez une application Todo avec les fonctionnalités suivantes :',
      items: [
        'Ajout, modification et suppression de tâches',
        'Marquage des tâches comme complétées',
        'Filtrage des tâches (toutes, actives, complétées)',
        'Persistance des données avec localStorage'
      ]
    },
    {
      title: 'Technologies à utiliser',
      description: 'Utilisez les technologies et concepts modernes de JavaScript :',
      items: [
        'Fonctions fléchées et littéraux de modèle',
        'Déstructuration et paramètres par défaut',
        'Classes ES6 et modules',
        'Promesses et async/await si nécessaire'
      ]
    },
    {
      title: 'Exigences techniques',
      description: 'Respectez les exigences techniques suivantes :',
      items: [
        'Code propre et bien structuré avec des commentaires',
        'Utilisation des bonnes pratiques ES6+',
        'Interface utilisateur responsive et intuitive',
        'Gestion des erreurs et des cas limites'
      ]
    },
    {
      title: 'Critères d\'évaluation',
      description: 'Votre travail sera évalué sur :',
      items: [
        'Fonctionnalité et complétude (40 points)',
        'Qualité du code et utilisation d\'ES6+ (30 points)',
        'Expérience utilisateur et design (20 points)',
        'Structure du projet et documentation (10 points)'
      ]
    }
  ];

  resources = {
    files: [
      { name: 'Instructions_détaillées.pdf', description: 'Document détaillant les attentes et critères d\'évaluation', icon: 'pdf', iconType: 'file-pdf' },
      { name: 'Assets_design.zip', description: 'Resources graphiques et maquettes pour l\'interface', icon: 'zip', iconType: 'file-archive' },
      { name: 'Structure_de_base.js', description: 'Fichier de base avec la structure recommandée pour commencer', icon: 'js', iconType: 'file-code' }
    ],
    links: [
      { name: 'Documentation MDN JavaScript', description: 'Référence complète des fonctionnalités JavaScript modernes' },
      { name: 'Guide des bonnes pratiques ES6+', description: 'Conseils et meilleures pratiques pour le code moderne' }
    ]
  };

  submissions = [
    {
      version: 'Version 2 - Soumise',
      date: '15 juin 2023, 14:32',
      description: 'Correction des bugs signalés et amélioration de l\'interface',
      files: [{ name: 'todo_app_v2.zip', size: '2.4 MB', icon: 'zip' }],
      githubLink: 'https://github.com/marietodo/todo-app'
    },
    {
      version: 'Version 1 - Soumise',
      date: '12 juin 2023, 18:45',
      description: 'Première version de l\'application avec les fonctionnalités de base',
      files: [{ name: 'todo_app_v1.zip', size: '2.1 MB', icon: 'zip' }],
      githubLink: ''
    }
  ];

  constructor(
     private route: ActivatedRoute,
    private devoirService: DevoirService,
    private authService: AuthentificationService
  ) {}

ngOnInit(): void {
    // Récupérer l'ID du devoir depuis l'URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadDevoir(id);
    }
  }

loadDevoir(id: number): void {
  this.devoirService.searchById(id).subscribe({
    next: (data) => {
      this.devoir = data;
      console.log('📌 Devoir chargé :', this.devoir);

      // Remplir assignment pour que le template s'affiche
      this.assignment.title = data.titre;
      this.assignment.description = data.description;
      this.assignment.points = data.points;
      this.assignment.dueDate = new Date(data.date_limite).toLocaleString();
      this.assignment.submissionType = data.type_remise;
      this.assignment.status = data.statut;
      this.assignment.deadlineStatus = data.deadlineStatus || 'Ouvert';
      this.assignment.countdown = data.countdown || 'Calcul en cours';
    },
    error: (err) => {
      console.error('❌ Erreur lors du chargement du devoir', err);
    }
  });
}



  updateCountdown(): void {
    this.assignment.countdown = '2j 14h 32m restantes';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  // Drag & drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement)?.classList.add('dragover');
  }

onDragLeave(event: DragEvent): void {
  (event.currentTarget as HTMLElement)?.classList.remove('dragover');
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  (event.currentTarget as HTMLElement)?.classList.remove('dragover');
  if (event.dataTransfer?.files.length) {
    this.handleFiles(event);
  }
}


  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (!this.uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
          this.uploadedFiles.push(file);
        }
      });
      input.value = ''; // Reset input to allow re-uploading same files
    }
  }

  removeFile(file: File): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }

  getFileIconClass(fileName: string): string {
    if (fileName.endsWith('.zip') || fileName.endsWith('.rar')) return 'zip';
    if (fileName.endsWith('.pdf')) return 'pdf';
    if (fileName.endsWith('.js')) return 'js';
    return 'doc';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  saveDraft(): void {
    console.log('Draft saved:', { files: this.uploadedFiles, githubLink: this.githubLink, comments: this.comments, attestation: this.attestation });
  }

  submitAssignment(): void {
    console.log('Assignment submitted:', { files: this.uploadedFiles, githubLink: this.githubLink, comments: this.comments, attestation: this.attestation });
  }


   // 🔹 Charger les devoirs à venir non rendus pour l'étudiant
  loadDevoirsAVenir(etudiantId: number): void {
    this.devoirService.devoirsAVenirNonRendus(etudiantId).subscribe({
      next: (devoirs) => {
        this.devoirsAVenir = devoirs;
        console.log('Devoirs à venir non rendus:', this.devoirsAVenir);

        // Pré-remplir assignment avec le premier devoir pour l'affichage par défaut
        if (this.devoirsAVenir.length > 0) {
          const d = this.devoirsAVenir[0];
          this.assignment.title = d.titre;
          this.assignment.description = d.description;
          this.assignment.points = d.points;
          this.assignment.dueDate = new Date(d.date_limite).toLocaleString();
          this.assignment.submissionType = d.type_remise;
          this.assignment.status = d.statut;
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des devoirs:', err);
      }
    });
  }
}