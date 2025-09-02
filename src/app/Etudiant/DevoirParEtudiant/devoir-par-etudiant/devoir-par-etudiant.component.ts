import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';

@Component({
  selector: 'app-devoir-par-etudiant',
  templateUrl: './devoir-par-etudiant.component.html',
  styleUrls: ['./devoir-par-etudiant.component.scss']
})
export class DevoirParEtudiantComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  countdown: string = '2j 14h 32m restantes';
  private countdownInterval: any;

  // ✅ Liste des devoirs récupérés
  devoirs: any[] = [];
  loading: boolean = true;

  private apiUrl = 'http://127.0.0.1:8000/api/devoirs';

  constructor(
    private authService: AuthentificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.startCountdown();
    this.loadDevoirs();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // 📌 Charger les devoirs de l’étudiant connecté
  loadDevoirs(): void {
    const user = this.authService.getUser();
    if (!user) {
      console.error('Utilisateur non connecté');
      this.loading = false;
      return;
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>(`${this.apiUrl}/etudiant/${user.id}`, { headers })
      .subscribe({
        next: (data) => {
          this.devoirs = data;
          this.loading = false;
          console.log('✅ Devoirs récupérés:', this.devoirs);
        },
        error: (err) => {
          this.loading = false;
          console.error('❌ Erreur lors du chargement des devoirs', err);
        }
      });
  }

  startCountdown(): void {
    this.countdown = '2j 14h 32m restantes';
    this.countdownInterval = setInterval(() => {
      this.countdown = '2j 14h 32m restantes';
    }, 60000);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const fileUploadArea = document.querySelector('.file-upload-area');
      if (fileUploadArea) {
        fileUploadArea.innerHTML = `
          <i class="fas fa-check-circle text-3xl text-green-400 mb-2"></i>
          <p class="text-gray-400">${input.files.length} fichier(s) sélectionné(s)</p>
          <p class="text-sm text-gray-500 mt-1">Cliquez pour modifier</p>
        `;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const fileUploadArea = event.currentTarget as HTMLElement;
    fileUploadArea.style.borderColor = '#3B82F6';
    fileUploadArea.style.background = 'rgba(59, 130, 246, 0.1)';
  }

  onDragLeave(event: DragEvent): void {
    const fileUploadArea = event.currentTarget as HTMLElement;
    fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    fileUploadArea.style.background = 'transparent';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const fileUploadArea = event.currentTarget as HTMLElement;
    fileUploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    fileUploadArea.style.background = 'transparent';

    if (event.dataTransfer) {
      fileUploadArea.innerHTML = `
        <i class="fas fa-check-circle text-3xl text-green-400 mb-2"></i>
        <p class="text-gray-400">${event.dataTransfer.files.length} fichier(s) déposé(s)</p>
        <p class="text-sm text-gray-500 mt-1">Cliquez pour modifier</p>
      `;
    }
  }

  toggleSidebar(): void {
    const sidebar = document.querySelector('.sidebar-bg') as HTMLElement;
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  }
}