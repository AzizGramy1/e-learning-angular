import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { LoginResponse } from 'src/app/Models/LoginResponse';




@Component({
  selector: 'app-login-authentification',
  templateUrl: './login-authentification.component.html',
  styleUrls: ['./login-authentification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('hoverAnimation', [
      state('hover', style({ transform: 'scale(1.05)', boxShadow: '0 0 10px rgba(0,0,0,0.2)' })),
      state('leave', style({ transform: 'scale(1)', boxShadow: 'none' })),
      transition('leave <=> hover', animate('0.3s ease'))
    ]),
    trigger('pulse', [
      state('true', style({ transform: 'scale(1)' })),
      state('false', style({ transform: 'scale(1)' })),
      transition('false => true', [
        animate('0.5s ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('0.5s ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})



export class LoginAuthentificationComponent  {

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage: string | null = null;
  googleHover: 'hover' | 'leave' = 'leave';
  facebookHover: 'hover' | 'leave' = 'leave';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthentificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  validateField(field: string): void {
    const control = this.loginForm.get(field);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.errorMessage = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        this.isLoading = false;

        // Sauvegarde du token
        this.authService.saveToken(response.access_token);

        // Redirection selon le rôle
        const role = response.user.role.toLowerCase();

        if (role === 'administrateur') {
          this.router.navigate(['/admin-dashboard']);
        } 
        else if (role === 'formateur') {
          this.router.navigate(['/formateur-dashboard']);
        } 
        else if (role === 'etudiant' || role === 'étudiant') { // Gestion avec accent ou sans
          this.router.navigate(['/etudiant-dashboard']);
        } 
        else {
          // Si rôle inconnu → page d'accueil
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message ||
                            Object.values(error.error?.errors || {})[0] ||
                            'Échec de la connexion';
        this.triggerShakeAnimation();
      }
    });
  } else {
    this.errorMessage = 'Veuillez remplir tous les champs correctement';
    this.triggerShakeAnimation();
  }
}


  loginWithGoogle(): void {
    console.log('Login with Google');
    // Implémentation Google OAuth
  }

  loginWithFacebook(): void {
    console.log('Login with Facebook');
    // Implémentation Facebook OAuth
  }

  private triggerShakeAnimation(): void {
    const form = document.querySelector('form');
    if (form) {
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    }
  }  

}
