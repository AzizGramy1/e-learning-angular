import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {


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

}
