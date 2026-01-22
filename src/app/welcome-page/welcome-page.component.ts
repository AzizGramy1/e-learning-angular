import { Component, HostListener, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {

    isDarkMode: boolean = true;



  constructor(private renderer: Renderer2, private router: Router) {}

  animateAndNavigate(url: string, event?: Event): void {
    if (event) {
      const element = event.currentTarget as HTMLElement;
      this.renderer.setStyle(element, 'transform', 'scale(0.95)');
      setTimeout(() => {
        this.renderer.setStyle(element, 'transform', '');
        this.router.navigateByUrl(url);
      }, 200);
    }
  }


   /**
   * Charge la préférence de thème depuis localStorage ou détecte le thème système
   */
  loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Déterminer le thème initial
    this.isDarkMode = savedTheme === 'light' ? false : true;
    if (savedTheme === null && !prefersDark) {
      this.isDarkMode = false;
    }
    
    this.applyTheme(this.isDarkMode);
  }

  /**
   * Bascule entre mode sombre et clair
   */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  /**
   * Applique le thème sélectionné
   */
  private applyTheme(isDarkMode: boolean): void {
    const appContainer = document.getElementById('appContainer');
    
    if (appContainer) {
      if (isDarkMode) {
        this.renderer.removeClass(appContainer, 'light-mode');
        this.renderer.addClass(appContainer, 'dark-mode');
      } else {
        this.renderer.removeClass(appContainer, 'dark-mode');
        this.renderer.addClass(appContainer, 'light-mode');
      }
    }
  }

  /**
   * Écoute les changements de thème système
   */
  @HostListener('window:load')
  onWindowLoad(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Si l'utilisateur n'a pas sauvegardé de préférence, suivre le thème système
      if (!localStorage.getItem('theme')) {
        this.isDarkMode = e.matches;
        this.applyTheme(this.isDarkMode);
      }
    });
  }

  /**
   * Retourne l'icône appropriée pour le bouton thème
   */
  getThemeIcon(): string {
    return this.isDarkMode ? 'sun' : 'moon';
  }

  /**
   * Récupère le texte pour l'accessibilité du bouton thème
   */
  getThemeButtonText(): string {
    return this.isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre';
  }


}
