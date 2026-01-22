import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenue-page',
  templateUrl: './bienvenue-page.component.html',
  styleUrls: ['./bienvenue-page.component.scss']
})
export class BienvenuePageComponent {

  // Dans votre script
  // Injection du Router dans le constructeur
  constructor(private router: Router) {}

  // Méthode pour rediriger vers la page de profil
  redirectToProfile() {
    this.router.navigate(['/formulaireProfil']);
  }


}
