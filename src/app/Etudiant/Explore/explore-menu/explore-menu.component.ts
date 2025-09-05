import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

interface Course {
  title: string;
  description: string;
  image: string;
  badge: string;
  badgeClass: string;
  salePrice: number;
  originalPrice?: number;
  category: string;
}

@Component({
  selector: 'app-explore-menu',
  templateUrl: './explore-menu.component.html',
  styleUrls: ['./explore-menu.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ExploreMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  
  private currentSlide = 0;
  private slideCount = 3;
  private sliderInterval: any;
  private observer!: IntersectionObserver;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initSlider();
    this.initAnimationObserver();
  }

  ngOnDestroy(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initSlider(): void {
    const dots = this.sliderContainer.nativeElement.querySelectorAll('.slider-dot');
    const prevBtn = this.sliderContainer.nativeElement.querySelector('.slider-btn.prev');
    const nextBtn = this.sliderContainer.nativeElement.querySelector('.slider-btn.next');

    // Fonction pour mettre à jour le slider
    const updateSlider = () => {
      this.slider.nativeElement.style.transform = `translateX(-${this.currentSlide * 100}%)`;
      
      // Mettre à jour les points de navigation
      dots.forEach((dot: HTMLElement, index: number) => {
        if (index === this.currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    // Événements pour les boutons de navigation
    prevBtn.addEventListener('click', () => {
      this.currentSlide = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
      this.currentSlide = (this.currentSlide + 1) % this.slideCount;
      updateSlider();
    });

    // Événements pour les points de navigation
    dots.forEach((dot: HTMLElement, index: number) => {
      dot.addEventListener('click', () => {
        this.currentSlide = index;
        updateSlider();
      });
    });

    // Défilement automatique
    this.sliderInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slideCount;
      updateSlider();
    }, 5000);
  }

  private initAnimationObserver(): void {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    // Observer les éléments à animer
    const cards = this.sliderContainer.nativeElement.querySelectorAll('.course-card');
    cards.forEach((card: HTMLElement) => {
      this.observer.observe(card);
    });
  }
}