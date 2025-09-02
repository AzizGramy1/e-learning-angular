import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-explore-menu',
  templateUrl: './explore-menu.component.html',
  styleUrls: ['./explore-menu.component.scss']
})
export class ExploreMenuComponent implements OnInit, AfterViewInit {
  @ViewChild('cubeContainer') cubeContainer!: ElementRef;
  activeCubeIndex = 0;
  currentYear = new Date().getFullYear();
  lastScrollY = 0;

  cubes = [
    {
      class: 'cube-1',
      faces: {
        front: { title: 'Réalité Virtuelle', description: 'Nouveau cours immersif avec casque VR offert', icon: 'vr-cardboard', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: '-30%', description: 'Sur tous les abonnements annuels', icon: 'tag' },
        right: { title: 'Pack Full Stack', description: '12 cours complets à prix spécial', icon: 'gem', badge: 'PROMO', badgeClass: 'badge-promo' },
        left: { title: 'Certification IA', description: 'Nouveau programme avec certification', icon: 'medal' },
        top: { title: 'Boost Carrière', description: 'Coaching personnalisé inclus', icon: 'rocket', badge: 'POPULAIRE', badgeClass: 'badge-popular' },
        bottom: { title: 'Pack Étudiant', description: '-50% avec vérification étudiante', icon: 'users' }
      }
    },
    {
      class: 'cube-2',
      faces: {
        front: { title: 'IA Générative', description: 'Maîtrisez DALL-E, GPT et Midjourney', icon: 'robot', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: 'Formation Express', description: 'Apprenez Python en 30 jours', icon: 'bolt' },
        right: { title: 'Dev Mobile', description: 'React Native + Flutter bundle', icon: 'mobile', badge: 'PROMO', badgeClass: 'badge-promo' },
        left: { title: 'Cloud AWS', description: 'Certification incluse', icon: 'cloud' },
        top: { title: 'Game Development', description: 'Unity & Unreal Engine spécialisation', icon: 'gamepad', badge: 'POPULAIRE', badgeClass: 'badge-popular' },
        bottom: { title: 'Cybersécurité', description: 'Nouveau programme avancé', icon: 'shield-alt' }
      }
    },
    {
      class: 'cube-3',
      faces: {
        front: { title: 'Data Science', description: 'Avec projets réels et portfolio', icon: 'chart-line', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: 'UI/UX Design', description: 'Cours avancé avec Figma Pro', icon: 'paint-brush' },
        right: { title: '', description: '', icon: '' },
        left: { title: '', description: '', icon: '' },
        top: { title: '', description: '', icon: '' },
        bottom: { title: '', description: '', icon: '' }
      }
    },
    {
      class: 'cube-4',
      faces: {
        front: { title: 'Web3 & Blockchain', description: 'Développement DApps et Smart Contracts', icon: 'code', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: 'DevOps', description: 'Intégration et déploiement continus', icon: 'server' },
        right: { title: '', description: '', icon: '' },
        left: { title: '', description: '', icon: '' },
        top: { title: '', description: '', icon: '' },
        bottom: { title: '', description: '', icon: '' }
      }
    },
    {
      class: 'cube-5',
      faces: {
        front: { title: 'Anglais Tech', description: 'Spécialisation pour développeurs', icon: 'language', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: 'Carrière Boost', description: 'Préparation aux entretiens techniques', icon: 'briefcase' },
        right: { title: '', description: '', icon: '' },
        left: { title: '', description: '', icon: '' },
        top: { title: '', description: '', icon: '' },
        bottom: { title: '', description: '', icon: '' }
      }
    },
    {
      class: 'cube-6',
      faces: {
        front: { title: 'Montage Vidéo', description: 'Adobe Premiere Pro avancé', icon: 'video', badge: 'NOUVEAU', badgeClass: 'badge-new' },
        back: { title: 'Photographie Pro', description: 'Techniques studio et extérieur', icon: 'camera' },
        right: { title: '', description: '', icon: '' },
        left: { title: '', description: '', icon: '' },
        top: { title: '', description: '', icon: '' },
        bottom: { title: '', description: '', icon: '' }
      }
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Scroll-based rotation
    fromEvent(window, 'scroll').subscribe(() => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - this.lastScrollY;
      const currentRotation = this.cubeContainer.nativeElement.style.transform
        ? parseInt(this.cubeContainer.nativeElement.style.transform.match(/rotateY\(([^)]+)deg\)/)?.[1] || 0)
        : 0;
      const newRotation = (currentRotation + scrollDelta * 0.2) % 360;
      this.cubeContainer.nativeElement.style.transform = `rotateY(${newRotation}deg)`;
      this.lastScrollY = scrollY;
    });
  }

  setActiveCube(index: number): void {
    this.activeCubeIndex = index;
    const cubes = document.querySelectorAll('.cube');
    cubes.forEach((cube, i) => {
      cube.setAttribute('style', `opacity: ${i === index ? 1 : 0.5}; z-index: ${i === index ? 10 : 1}`);
    });
  }

  pauseCube(index: number): void {
    const cube = document.querySelectorAll('.cube')[index];
    if (cube) {
      cube.setAttribute('style', `animation-play-state: paused; transform: scale(1.1); z-index: 20; opacity: 1`);
      document.querySelectorAll('.cube').forEach((c, i) => {
        if (i !== index) c.setAttribute('style', `z-index: 1; opacity: 0.5`);
      });
    }
  }

  resumeCube(index: number): void {
    const cube = document.querySelectorAll('.cube')[index];
    if (cube) {
      cube.setAttribute('style', `animation-play-state: running; z-index: ${index === this.activeCubeIndex ? 10 : 1}; opacity: ${index === this.activeCubeIndex ? 1 : 0.5}`);
    }
  }
}