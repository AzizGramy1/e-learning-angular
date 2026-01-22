import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { InscriptionService } from 'src/app/Service/Inscription/inscription.service';

@Component({
  selector: 'app-inscrption-formulaire',
  templateUrl: './inscrption-formulaire.component.html',
  styleUrls: ['./inscrption-formulaire.component.scss']
})
export class InscrptionFormulaireComponent implements OnInit {
signupForm: FormGroup;
  showPassword = false;
  isLoading = false;
  isCheckingEmail = false;
  errorMessage = '';
  successMessage = '';
  mobileMenuOpen = false;

  // Ajoutez après les autres déclarations de variables
  verificationSent = false;
  verificationEmail = '';
  
  // États de validation email
  emailStatus: 'idle' | 'checking' | 'available' | 'taken' = 'idle';
  
  // Password strength properties
  passwordStrength = 0;
  passwordStrengthText = 'Faible';
  passwordStrengthClass = 'bg-red-500 w-0';
  
  // Password validation states
  passwordValidations = {
    minLength: false,
    uppercase: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private inscriptionService: InscriptionService,
    private authService: AuthentificationService
  ) {
    this.signupForm = this.createSignupForm();
  }

  ngOnInit(): void {
    this.setupPasswordValidation();
    this.setupEmailValidation();
  }

  private createSignupForm(): FormGroup {
    return this.fb.group({
      role: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
  };

  // Validation email en temps réel
  private setupEmailValidation(): void {
    this.signupForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => {
          if (this.isValidEmail(email)) {
            this.isCheckingEmail = true;
            this.emailStatus = 'checking';
            return this.inscriptionService.checkEmail(email);
          } else {
            return [];
          }
        })
      )
      .subscribe({
        next: (response) => {
          this.isCheckingEmail = false;
          if (response.success) {
            if (response.data.available) {
              this.emailStatus = 'available';
              this.signupForm.get('email')?.setErrors(null);
            } else {
              this.emailStatus = 'taken';
              this.signupForm.get('email')?.setErrors({ emailTaken: true });
            }
          }
        },
        error: (error) => {
          this.isCheckingEmail = false;
          this.emailStatus = 'idle';
          console.error('Erreur vérification email:', error);
        }
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private setupPasswordValidation(): void {
    this.signupForm.get('password')?.valueChanges.subscribe(password => {
      if (password) {
        this.checkPasswordStrength();
      }
    });
  }

  checkPasswordStrength(): void {
    const password = this.signupForm.get('password')?.value;
    
    if (!password) {
      this.passwordStrength = 0;
      this.updatePasswordStrengthDisplay();
      return;
    }

    // Reset validations
    this.passwordValidations = {
      minLength: false,
      uppercase: false,
      number: false,
      special: false
    };

    let strength = 0;

    // Check length
    if (password.length >= 8) {
      strength++;
      this.passwordValidations.minLength = true;
    }

    // Check uppercase
    if (/[A-Z]/.test(password)) {
      strength++;
      this.passwordValidations.uppercase = true;
    }

    // Check numbers
    if (/[0-9]/.test(password)) {
      strength++;
      this.passwordValidations.number = true;
    }

    // Check special characters
    if (/[^A-Za-z0-9]/.test(password)) {
      strength++;
      this.passwordValidations.special = true;
    }

    this.passwordStrength = strength;
    this.updatePasswordStrengthDisplay();
  }

  private updatePasswordStrengthDisplay(): void {
    switch (this.passwordStrength) {
      case 0:
      case 1:
        this.passwordStrengthText = 'Faible';
        this.passwordStrengthClass = 'bg-red-500 w-1/4';
        break;
      case 2:
        this.passwordStrengthText = 'Moyen';
        this.passwordStrengthClass = 'bg-yellow-500 w-1/2';
        break;
      case 3:
        this.passwordStrengthText = 'Bon';
        this.passwordStrengthClass = 'bg-blue-500 w-3/4';
        break;
      case 4:
        this.passwordStrengthText = 'Fort';
        this.passwordStrengthClass = 'bg-green-500 w-full';
        break;
    }
  }

  getValidationClass(type: string): string {
    const isValid = this.passwordValidations[type as keyof typeof this.passwordValidations];
    return isValid ? 'bg-green-500' : 'bg-gray-600';
  }

  // Propriétés calculées pour la validation du mot de passe
  get passwordHasMinLength(): boolean {
    const password = this.signupForm.get('password')?.value;
    return password && password.length >= 8;
  }

  get passwordHasUppercase(): boolean {
    const password = this.signupForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  get passwordHasNumber(): boolean {
    const password = this.signupForm.get('password')?.value;
    return password && /[0-9]/.test(password);
  }

  get passwordHasSpecial(): boolean {
    const password = this.signupForm.get('password')?.value;
    return password && /[^A-Za-z0-9]/.test(password);
  }

  getPasswordStrengthClass(): string {
    const password = this.signupForm.get('password')?.value;
    if (!password) return 'strength-0';

    let strength = 0;
    
    if (this.passwordHasMinLength) strength++;
    if (this.passwordHasUppercase) strength++;
    if (this.passwordHasNumber) strength++;
    if (this.passwordHasSpecial) strength++;

    return `strength-${strength}`;
  }

  // Méthodes pour le statut email
  getEmailStatusMessage(): string {
    switch (this.emailStatus) {
      case 'checking': return 'Vérification de l\'email...';
      case 'available': return '✅ Email disponible';
      case 'taken': return '❌ Email déjà utilisé';
      default: return '';
    }
  }

  getEmailStatusClass(): string {
    switch (this.emailStatus) {
      case 'checking': return 'text-yellow-500';
      case 'available': return 'text-green-500';
      case 'taken': return 'text-red-500';
      default: return 'text-gray-500';
    }
  }

  onRoleChange(role: string): void {
    console.log('Rôle sélectionné:', role);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  loginWithGitHub(): void {
    console.log('Connexion avec GitHub');
    alert('Fonctionnalité GitHub à implémenter');
  }

  loginWithLinkedIn(): void {
    console.log('Connexion avec LinkedIn');
    alert('Fonctionnalité LinkedIn à implémenter');
  }

  // SOUMISSION DU FORMULAIRE AVEC ENVOI D'EMAIL DE VÉRIFICATION
onSubmit(): void {
  if (this.signupForm.valid && this.emailStatus === 'available') {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.verificationSent = false;
    this.verificationEmail = this.signupForm.value.email;

    // Préparer les données pour l'API
    const formData = {
      nom: `${this.signupForm.value.firstName} ${this.signupForm.value.lastName}`,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      role: this.signupForm.value.role,
      password_confirmation: this.signupForm.value.confirmPassword // Ajouté
    };

    console.log('📤 Données envoyées:', formData);

    // 1. Appel du service d'inscription
    this.inscriptionService.register(formData).subscribe({
      next: (response) => {
        console.log('✅ Inscription réussie:', response);
        
        // Sauvegarder le token si retourné
        if (response.token) {
          this.authService.saveToken(response.token);
        } else if (response.access_token) {
          this.authService.saveToken(response.access_token);
        }
        
        // 2. Envoyer l'email de vérification
        this.sendVerificationEmail();
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error);
      }
    });
  } else {
    this.markFormGroupTouched();
    if (this.emailStatus === 'taken') {
      this.errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
    } else {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    }
  }
}

// Méthode pour renvoyer l'email de vérification
resendVerificationEmail(): void {
  if (this.verificationEmail) {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.inscriptionService.resendVerificationEmail().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = '📧 Un nouvel email de vérification a été envoyé à ' + this.verificationEmail;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = '❌ Erreur lors de l\'envoi de l\'email. Veuillez réessayer.';
      }
    });
  }
}


// Méthode pour envoyer l'email de vérification
private sendVerificationEmail(): void {
  this.inscriptionService.resendVerificationEmail().subscribe({
    next: (response) => {
      this.isLoading = false;
      this.verificationSent = true;
      this.successMessage = '🎉 Inscription réussie ! Un email de vérification a été envoyé à ' + this.verificationEmail;
      
      console.log('✅ Email de vérification envoyé:', response);
      
      // Redirection vers la page de confirmation après 3 secondes
      setTimeout(() => {
        this.router.navigate(['/verification-sent'], {
          queryParams: { 
            email: this.verificationEmail,
            message: 'Veuillez vérifier votre boîte email pour activer votre compte.'
          }
        });
      }, 3000);
    },
    error: (error) => {
      this.isLoading = false;
      console.error('❌ Erreur envoi email de vérification:', error);
      
      // L'inscription a réussi mais l'email n'a pas pu être envoyé
      this.successMessage = '✅ Inscription réussie ! Cependant, nous n\'avons pas pu envoyer l\'email de vérification.';
      this.errorMessage = '⚠️ Vous pouvez demander un nouvel email de vérification depuis votre profil une fois connecté.';
      
      // Redirection vers la page de bienvenue quand même
      setTimeout(() => {
        this.router.navigate(['/BienvenuePage'], {
          queryParams: { 
            message: 'Inscription réussie! Veuillez vérifier votre email pour activer votre compte.',
            email: this.verificationEmail,
            verificationSent: false
          }
        });
      }, 3000);
    }
  });
}

  private handleError(error: any): void {
    console.error('❌ Erreur inscription:', error);
    
    if (error.error?.message) {
      this.errorMessage = error.error.message;
    } else if (error.status === 422 && error.error?.errors) {
      const errors = error.error.errors;
      this.errorMessage = Object.values(errors)[0] as string;
    } else if (error.status === 500) {
      this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
    } else if (error.status === 0) {
      this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    } else {
      this.errorMessage = 'Une erreur inattendue est survenue.';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  }
