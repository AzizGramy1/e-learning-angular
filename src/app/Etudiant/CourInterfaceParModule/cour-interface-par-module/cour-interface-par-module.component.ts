import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cour-interface-par-module',
  templateUrl: './cour-interface-par-module.component.html',
  styleUrls: ['./cour-interface-par-module.component.scss']
})
export class CourInterfaceParModuleComponent implements OnInit {
openSettings() {
throw new Error('Method not implemented.');
}
  @ViewChild('courseVideo', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  isSidebarOpen = false;
  isUserMenuOpen = false;
  isSpeedMenuOpen = false;
  videoPlaying = false;
  videoMuted = false;
  subtitlesOn = false;
  isFullscreen = false;
  playbackSpeed = 1;
  progressPercent = 35;
  currentTime = '0:00';
  duration = '22:45';
  activeTab = 'Ressources';
  playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  tabs = ['Ressources', 'Notes', 'Discussion', 'Transcript'];

  modules = [
    {
      title: 'Module 1: Les bases de JavaScript',
      percent: 100,
      isCurrent: false,
      lessons: [
        { title: '1.1 Introduction à JavaScript', completed: true, isActive: false, duration: '15 min' },
        { title: '1.2 Variables et types de données', completed: true, isActive: false, duration: '22 min' }
      ]
    },
    {
      title: 'Module 2: Fonctions et portée',
      percent: 100,
      isCurrent: false,
      lessons: [
        { title: '2.1 Déclaration de fonctions', completed: true, isActive: false, duration: '18 min' }
      ]
    },
    {
      title: 'Module 3: JavaScript Moderne (ES6+)',
      percent: 40,
      isCurrent: true,
      lessons: [
        { title: '3.1 Introduction à ES6', completed: true, isActive: false, duration: '12 min' },
        { title: '3.2 Fonctions fléchées', completed: false, isActive: true, duration: '22 min' },
        { title: '3.3 Destructuring', completed: false, isActive: false, duration: '15 min' }
      ]
    },
    {
      title: 'Module 4: Programmation asynchrone',
      percent: 0,
      isCurrent: false,
      lessons: [
        { title: '4.1 Callbacks', completed: false, isActive: false, duration: '20 min' }
      ]
    }
  ];

  resources = [
    { name: 'Guide des fonctions fléchées', type: 'PDF • 2.3 MB', iconClass: 'fas fa-file-pdf text-blue-400', iconBgClass: 'bg-blue-500 bg-opacity-20', buttonText: 'Télécharger', buttonIcon: 'fa-download' },
    { name: 'Exercices pratiques', type: 'ZIP • 1.1 MB', iconClass: 'fas fa-file-code text-green-400', iconBgClass: 'bg-green-500 bg-opacity-20', buttonText: 'Télécharger', buttonIcon: 'fa-download' },
    { name: 'Documentation MDN', type: 'Lien externe', iconClass: 'fas fa-link text-purple-400', iconBgClass: 'bg-purple-500 bg-opacity-20', buttonText: 'Ouvrir', buttonIcon: 'fa-external-link-alt' },
    { name: 'Sandbox de code', type: 'JSFiddle', iconClass: 'fas fa-laptop-code text-yellow-400', iconBgClass: 'bg-yellow-500 bg-opacity-20', buttonText: 'Ouvrir', buttonIcon: 'fa-external-link-alt' }
  ];

  instructor = {
    name: 'Pierre Martin',
    title: 'Développeur Full-Stack',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Développeur avec 10 ans d\'expérience, spécialisé dans JavaScript et les technologies modernes.'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeVideo();
  }

  initializeVideo(): void {
    const video = this.videoElement.nativeElement;
    video.addEventListener('timeupdate', () => {
      this.progressPercent = (video.currentTime / video.duration) * 100 || 35;
      const minutes = Math.floor(video.currentTime / 60);
      const seconds = Math.floor(video.currentTime % 60);
      this.currentTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSpeedMenu(): void {
    this.isSpeedMenuOpen = !this.isSpeedMenuOpen;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  playPause(): void {
    const video = this.videoElement.nativeElement;
    if (video.paused) {
      video.play();
      this.videoPlaying = true;
    } else {
      video.pause();
      this.videoPlaying = false;
    }
  }

  rewind(): void {
    const video = this.videoElement.nativeElement;
    video.currentTime = Math.max(0, video.currentTime - 10);
  }

  forward(): void {
    const video = this.videoElement.nativeElement;
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  }

  seekVideo(event: MouseEvent): void {
    const video = this.videoElement.nativeElement;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  }

  toggleVolume(): void {
    const video = this.videoElement.nativeElement;
    video.muted = !video.muted;
    this.videoMuted = video.muted;
  }

  setPlaybackSpeed(speed: number): void {
    const video = this.videoElement.nativeElement;
    video.playbackRate = speed;
    this.playbackSpeed = speed;
    this.isSpeedMenuOpen = false;
  }

  toggleSubtitles(): void {
    this.subtitlesOn = !this.subtitlesOn;
  }

  toggleFullscreen(): void {
    const container = document.querySelector('.video-container');
    if (!document.fullscreenElement) {
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any)?.webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any)?.msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
      this.isFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      this.isFullscreen = false;
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  continueLesson(): void {
    console.log('Continuing lesson...');
  }

  downloadResources(): void {
    console.log('Downloading resources...');
  }

  askQuestion(): void {
    console.log('Asking a question...');
  }

  quitCourse(): void {
    this.router.navigate(['courses']);
  }

  bookmarkLesson(): void {
    console.log('Bookmarking lesson...');
  }

  markAsCompleted(): void {
    console.log('Marking lesson as completed...');
  }

  downloadResource(resource: any): void {
    console.log('Downloading resource:', resource.name);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const speedToggle = document.querySelector('.speed-toggle');
    const speedMenu = document.querySelector('.playback-speed-menu');
    const userMenu = document.getElementById('userMenu');
    const userMenuButton = document.getElementById('userMenuButton');
    
    if (speedToggle && speedMenu && !speedToggle.contains(event.target as Node) && !speedMenu.contains(event.target as Node)) {
      this.isSpeedMenuOpen = false;
    }
    
    if (userMenu && userMenuButton && !userMenu.contains(event.target as Node) && !userMenuButton.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }
}