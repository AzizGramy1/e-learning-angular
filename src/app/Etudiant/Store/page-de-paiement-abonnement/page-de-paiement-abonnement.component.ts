import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { Observable, of, delay } from 'rxjs';

// Interfaces
interface AbonnementData {
  type: string;
  planId: string;
  planName: string;
  planType: 'mensuel' | 'annuel' | 'ponctuel';
  price: number;
  period: string;
  features: string[];
  courseId?: number;
  courseTitle?: string;
  coursePrice?: number;
  courseOriginalPrice?: number;
  userId: number;
  timestamp: string;
}

interface PaiementMetadata {
  ip_adresse?: string;
  user_agent?: string;
  device_id?: string;
  mode_simulation?: boolean;
  adresse_facturation?: any;
  details_facture?: any;
  logs?: any[];
}

interface DonneesCarte {
  numero: string;
  expiration: string;
  cvv: string;
  nom: string;
}

interface PaiementData {
  type_paiement: 'carte_bancaire' | 'virement_bancaire' | 'mobile_money';
  donnees_carte: DonneesCarte;
  coupon_code: string;
}

export interface DonneesSimulationPaiement {
  course_id: number;
  type_abonnement: 'mensuel' | 'annuel' | 'ponctuel';
  donnees_carte: {
    numero: string;
    expiration: string;
    cvv: string;
    nom: string;
  };
  coupon_code?: string;
}

export interface DonneesCreationLienPaiement {
  course_id: number;
  type_abonnement: 'ponctuel' | 'mensuel' | 'annuel';
  email: string;
  montant_personnalise?: number;
  date_expiration?: string;
  message_personnalise?: string;
}

interface Abonnement {
  id: number;
  user_id: number;
  course_id: number;
  type_abonnement: string;
  date_debut: string;
  date_fin: string;
  statut: string;
  montant: number;
  mode_paiement: string;
  reference_paiement: string;
}

interface FiltresAbonnement {
  statut?: string;
  per_page?: number;
}

// Service de simulation
class PaiementSimulationService {
  // Simuler un paiement réussi
  simulerPaiementNouvelAbonnement(donnees: any): Observable<any> {
    console.log('🎮 SIMULATION FRONT-END - Données reçues:', donnees);
    
    const transactionId = 'SIM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const response = {
      success: true,
      message: 'Paiement simulé avec succès ! (Front-end seulement)',
      data: {
        simulation: {
          transaction_id: transactionId,
          status: 'complete',
          mode: 'frontend_simulation',
          timestamp: new Date().toISOString()
        },
        abonnement: {
          id: Math.floor(Math.random() * 10000) + 1000,
          course_id: donnees.course_id,
          type_abonnement: donnees.type_abonnement,
          date_debut: new Date().toISOString(),
          date_fin: this.calculerDateFin(donnees.type_abonnement),
          statut: 'actif',
          mode_simulation: true
        },
        paiement: {
          id: Math.floor(Math.random() * 10000) + 1000,
          reference: transactionId,
          montant: this.calculerMontant(donnees),
          devise: 'TND',
          statut: 'complete',
          mode_paiement: 'carte_bancaire_simule',
          date_paiement: new Date().toISOString()
        }
      }
    };
    
    return of(response).pipe(delay(1500));
  }
  
  // Simuler un renouvellement
  renouvelerAbonnement(abonnementId: number, donnees: any): Observable<any> {
    console.log('🔄 SIMULATION FRONT-END - Renouvellement:', { abonnementId, donnees });
    
    const transactionId = 'REN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const response = {
      success: true,
      message: 'Renouvellement simulé avec succès ! (Front-end seulement)',
      data: {
        paiement: {
          reference: transactionId,
          statut: 'complete',
          mode_simulation: true
        },
        nouvelle_date_fin: this.calculerDateFin(donnees.type_abonnement || 'mensuel'),
        abonnement: {
          id: abonnementId,
          statut: 'actif',
          mode_simulation: true
        }
      }
    };
    
    return of(response).pipe(delay(1500));
  }
  
  // Méthodes utilitaires pour la simulation
  private calculerDateFin(typeAbonnement: string): string {
    const date = new Date();
    
    switch(typeAbonnement) {
      case 'mensuel':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'annuel':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'ponctuel':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    
    return date.toISOString();
  }
  
  private calculerMontant(donnees: any): number {
    switch(donnees.type_abonnement) {
      case 'mensuel': return 29.99;
      case 'annuel': return 299.99;
      case 'ponctuel': return 99.99;
      default: return 99.99;
    }
  }
  
  // Simuler la vérification d'accès au cours
  verifierAccesCours(courseId: number): Observable<any> {
    return of({
      success: true,
      has_access: false,
      message: 'Vérification simulée'
    }).pipe(delay(500));
  }
  
  // Simuler la récupération des abonnements
  getAbonnements(filtres?: any): Observable<any> {
    return of({
      success: true,
      abonnements: [],
      message: 'Abonnements simulés'
    }).pipe(delay(500));
  }
}

@Component({
  selector: 'app-page-de-paiement-abonnement',
  templateUrl: './page-de-paiement-abonnement.component.html',
  styleUrls: ['./page-de-paiement-abonnement.component.scss']
})
export class PageDePaiementAbonnementComponent implements OnInit {
  paiementForm: FormGroup;
  abonnementData: AbonnementData | null = null;

  paiementData: PaiementData = {
    type_paiement: 'carte_bancaire',
    donnees_carte: {
      numero: '',
      expiration: '',
      cvv: '',
      nom: ''
    },
    coupon_code: ''
  };

  isLoading = false;
  currentUser: any = null;
  abonnementActuel: Abonnement | null = null;
  cardFlip = false;
  highlightCardNumber = false;
  showCardValidation = false;

  paymentMethods = [
    { id: 'carte_bancaire', label: 'Carte Bancaire', icon: 'fas fa-credit-card', description: 'Saisie directe de carte' },
    { id: 'virement_bancaire', label: 'Virement Bancaire', icon: 'fas fa-university', description: 'Transfert bancaire' },
    { id: 'mobile_money', label: 'Mobile Money', icon: 'fas fa-mobile-alt', description: 'Paiement via mobile' }
  ];

  private paiementSimulationService = new PaiementSimulationService();

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthentificationService
  ) {
    this.paiementForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.checkUserStatus();
    this.setupFormListeners();
  }

  private initializeForm(): FormGroup {
    const form = this.fb.group({
      type_paiement: ['carte_bancaire', Validators.required],
      donnees_carte: this.fb.group({
        numero: ['', [
          Validators.required,
          Validators.pattern(/^[0-9\s]{13,19}$/),
          Validators.minLength(13),
          Validators.maxLength(19)
        ]],
        expiration: ['', [
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        ]],
        cvv: ['', [
          Validators.required,
          Validators.pattern(/^\d{3,4}$/),
          Validators.minLength(3),
          Validators.maxLength(4)
        ]],
        nom: ['', [
          Validators.required,
          Validators.minLength(2)
        ]]
      }),
      adresse_facturation: this.fb.group({
        nom_complet: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', Validators.required],
        adresse: ['', Validators.required],
        ville: ['', Validators.required],
        code_postal: ['', Validators.required],
        pays: ['Tunisie', Validators.required]
      }),
      coupon_code: [''],
      course_id: [''],
      plan_type: [''],
      montant: [0],
      user_id: [0]
    });
    return form;
  }

  private setupFormListeners(): void {
    this.paiementForm.valueChanges.subscribe(formValue => {
      if (formValue.type_paiement) {
        this.paiementData.type_paiement = formValue.type_paiement;
      }
      if (formValue.donnees_carte) {
        this.paiementData.donnees_carte = formValue.donnees_carte;
      }
      if (formValue.coupon_code !== undefined) {
        this.paiementData.coupon_code = formValue.coupon_code;
      }
    });
    
    this.donnees_carte?.get('numero')?.valueChanges.subscribe(value => {
      if (value) {
        this.formatCardNumber(value);
      }
    });
    
    this.donnees_carte?.get('expiration')?.valueChanges.subscribe(value => {
      if (value) {
        this.formatExpirationDate(value);
      }
    });
  }

  // Getters pour le formulaire
  get type_paiement() {
    return this.paiementForm.get('type_paiement');
  }
  get donnees_carte() {
    return this.paiementForm.get('donnees_carte') as FormGroup;
  }
  get numero() {
    return this.donnees_carte?.get('numero');
  }
  get expiration() {
    return this.donnees_carte?.get('expiration');
  }
  get cvv() {
    return this.donnees_carte?.get('cvv');
  }
  get nom() {
    return this.donnees_carte?.get('nom');
  }
  get coupon_code() {
    return this.paiementForm.get('coupon_code');
  }
  get adresse_facturation() {
    return this.paiementForm.get('adresse_facturation') as FormGroup;
  }
  get nom_complet() {
    return this.adresse_facturation?.get('nom_complet');
  }
  get telephone() {
    return this.adresse_facturation?.get('telephone');
  }
  get adresse() {
    return this.adresse_facturation?.get('adresse');
  }
  get ville() {
    return this.adresse_facturation?.get('ville');
  }
  get code_postal() {
    return this.adresse_facturation?.get('code_postal');
  }
  get pays() {
    return this.adresse_facturation?.get('pays');
  }
  get email() {
    return this.adresse_facturation?.get('email');
  }
  get course_id() {
    return this.paiementForm.get('course_id');
  }
  get plan_type() {
    return this.paiementForm.get('plan_type');
  }
  get montant() {
    return this.paiementForm.get('montant');
  }
  get user_id() {
    return this.paiementForm.get('user_id');
  }

  checkUserStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: this.router.url,
          message: 'Veuillez vous connecter pour effectuer un paiement'
        }
      });
      return;
    }
    this.currentUser = this.authService.getUser();

    if (this.currentUser) {
      this.loadAbonnementData();
      this.loadAbonnementActuel();
      this.prefillUserData();
      this.updateHiddenFields();
    } else {
      this.authService.me().subscribe({
        next: (user) => {
          this.currentUser = user;
          this.authService.saveUser(user);
          this.loadAbonnementData();
          this.loadAbonnementActuel();
          this.prefillUserData();
          this.updateHiddenFields();
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          this.router.navigate(['/login']);
        }
      });
    }
  }

  private prefillUserData(): void {
    if (this.currentUser && this.adresse_facturation) {
      this.adresse_facturation.patchValue({
        nom_complet: this.currentUser.name || '',
        email: this.currentUser.email || '',
        telephone: this.currentUser.phone || '',
        adresse: this.currentUser.address || '',
        ville: this.currentUser.city || 'Tunis',
        code_postal: this.currentUser.zip_code || '',
        pays: this.currentUser.country || 'Tunisie'
      });

      if (this.currentUser.name && this.donnees_carte) {
        this.donnees_carte.get('nom')?.setValue(this.currentUser.name.toUpperCase());
      }
    }
  }

  private updateHiddenFields(): void {
    if (this.abonnementData) {
      this.course_id?.setValue(this.abonnementData.courseId || '');
      this.plan_type?.setValue(this.abonnementData.planType || '');
      this.montant?.setValue(this.abonnementData.price || 0);
    }

    if (this.currentUser) {
      this.user_id?.setValue(this.currentUser.id || 0);
    }
  }

  loadAbonnementData(): void {
    const savedData = localStorage.getItem('selectedAbonnement');
    if (savedData) {
      try {
        this.abonnementData = JSON.parse(savedData);
        this.updateHiddenFields();
      } catch (error) {
        console.error('Erreur lors du parsing des données d\'abonnement:', error);
        alert('Données d\'abonnement invalides. Veuillez recommencer.');
        this.router.navigate(['/store']);
      }
    } else {
      alert('Aucun abonnement sélectionné. Veuillez choisir un plan.');
      this.router.navigate(['/store']);
    }
  }

  loadAbonnementActuel(): void {
    if (!this.currentUser) return;
    
    this.paiementSimulationService.getAbonnements().subscribe({
      next: (response) => {
        console.log('📊 Abonnements simulés:', response);
        
        if (response.success && response.abonnements && response.abonnements.length > 0) {
          if (this.abonnementData?.courseId) {
            this.abonnementActuel = response.abonnements.find((ab: Abonnement) =>
              ab.course_id === this.abonnementData?.courseId
            ) || null;
          } else {
            this.abonnementActuel = response.abonnements[0];
          }

          if (this.abonnementActuel) {
            this.verifierCompatibiliteAbonnement();
          }
        }
      },
      error: (error) => {
        console.warn('⚠️ Aucun abonnement actuel trouvé (simulation)');
      }
    });
  }

  verifierCompatibiliteAbonnement(): void {
    if (!this.abonnementActuel || !this.abonnementData) return;
    if (this.abonnementActuel.course_id === this.abonnementData.courseId) {
      const confirmer = confirm(
        `🎮 Paiement en cours\n\n` +
        `Vous avez déjà un abonnement actif pour ce cours (${this.abonnementActuel.type_abonnement}).\n` +
        `Voulez-vous simuler un renouvellement d'abonnement ?`
      );

      if (confirmer) {
        console.log('Renouvellement simulé choisi');
      } else {
        this.router.navigate(['/course', this.abonnementData.courseId]);
      }
    }
  }

  verifierAccesCours(): void {
    if (!this.abonnementData?.courseId) return;
    
    this.paiementSimulationService.verifierAccesCours(this.abonnementData.courseId).subscribe({
      next: (response) => {
        if (response.success && response.has_access) {
          const confirmer = confirm('🎮 \n\nVous avez déjà accès à ce cours. Souhaitez-vous quand même simuler un achat ?');
          if (!confirmer) {
            this.router.navigate(['/learn', this.abonnementData!.courseId]);
          }
        }
      },
      error: (error) => {
        console.warn('⚠️ Vérification d\'accès  échouée');
      }
    });
  }

  formatCardNumber(value: string): void {
    if (!this.numero) return;

    const cleanValue = value.replace(/\D/g, '');
    let formatted = '';

    for (let i = 0; i < cleanValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleanValue[i];
    }

    this.numero.setValue(formatted.substring(0, 19), { emitEvent: false });
  }

  formatExpirationDate(value: string): void {
    if (!this.expiration) return;

    const cleanValue = value.replace(/\D/g, '');
    let formatted = cleanValue;

    if (cleanValue.length >= 2) {
      formatted = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }

    this.expiration.setValue(formatted.substring(0, 5), { emitEvent: false });
  }

  changePaymentMethod(method: 'carte_bancaire' | 'virement_bancaire' | 'mobile_money'): void {
    this.type_paiement?.setValue(method);
  }

  validerDonneesCarteForm(carte: DonneesCarte): boolean {
    if (!carte) {
      alert('Données de carte manquantes');
      return false;
    }

    if (!carte.numero || !carte.expiration || !carte.cvv || !carte.nom) {
      alert('Veuillez remplir tous les champs de la carte bancaire');
      return false;
    }

    const numeroNettoye = carte.numero.replace(/\s/g, '');
    if (numeroNettoye.length !== 16 || !/^\d+$/.test(numeroNettoye)) {
      alert('Numéro de carte invalide (16 chiffres requis)');
      return false;
    }

    if (!carte.expiration.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      alert('Format de date d\'expiration invalide (MM/AA requis, ex: 12/25)');
      return false;
    }

    const [mois, annee] = carte.expiration.split('/');
    const dateExpiration = new Date(2000 + parseInt(annee), parseInt(mois) - 1);
    if (dateExpiration < new Date()) {
      alert('Carte expirée');
      return false;
    }

    if (carte.cvv.length < 3 || carte.cvv.length > 4 || !/^\d+$/.test(carte.cvv)) {
      alert('CVV invalide (3 ou 4 chiffres requis)');
      return false;
    }

    if (carte.nom.trim().length < 2) {
      alert('Nom sur la carte invalide (minimum 2 caractères)');
      return false;
    }

    return true;
  }

  validerLuhn(numeroCarte: string): boolean {
    const numeroNettoye = numeroCarte.replace(/\s/g, '');
    let somme = 0;
    let double = false;

    for (let i = numeroNettoye.length - 1; i >= 0; i--) {
      let chiffre = parseInt(numeroNettoye.charAt(i), 10);

      if (double) {
        chiffre *= 2;
        if (chiffre > 9) {
          chiffre -= 9;
        }
      }

      somme += chiffre;
      double = !double;
    }

    return somme % 10 === 0;
  }

  getTypeTransaction(): 'achat_cours' | 'abonnement_mensuel' | 'abonnement_annuel' | 'renouvellement' | 'upgrade' {
    if (!this.abonnementData) return 'achat_cours';

    if (this.abonnementActuel && this.abonnementActuel.course_id === this.abonnementData.courseId) {
      return 'renouvellement';
    }

    switch (this.abonnementData.planType) {
      case 'mensuel': return 'abonnement_mensuel';
      case 'annuel': return 'abonnement_annuel';
      default: return 'achat_cours';
    }
  }

  getCarteType(numero: string): string {
    const cleanNumero = numero.replace(/\s/g, '');

    if (cleanNumero.startsWith('4')) return 'Visa';
    if (cleanNumero.startsWith('5')) return 'Mastercard';
    if (cleanNumero.startsWith('34') || cleanNumero.startsWith('37')) return 'American Express';
    if (cleanNumero.startsWith('6')) return 'Discover';
    if (cleanNumero.startsWith('3')) return 'JCB';

    return 'Carte bancaire';
  }

  genererReference(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `SIM-${timestamp}-${random}`.toUpperCase();
  }

  preparePaiementData(): any {
    const typeTransaction = this.getTypeTransaction();
    const montant = this.getPriceWithDiscount();
    const montantTaxe = montant * 0.19;
    const montantTotal = montant + montantTaxe;
    const formValues = this.paiementForm.value;

    return {
      user_id: this.currentUser.id,
      abonnement_id: this.abonnementActuel?.id || null,
      course_id: this.abonnementData?.courseId || null,
      montant: montant,
      devise: 'TND',
      montant_taxe: montantTaxe,
      montant_total: montantTotal,
      type_paiement: formValues.type_paiement,
      type_transaction: typeTransaction,
      statut: 'en_attente',
      reference: this.genererReference(),
      mode_simulation: true,
      metadata: {
        ip_adresse: '127.0.0.1',
        user_agent: navigator.userAgent,
        mode_simulation: true,
        adresse_facturation: formValues.adresse_facturation,
        details_facture: {
          plan_name: this.abonnementData?.planName,
          course_title: this.abonnementData?.courseTitle,
          features: this.abonnementData?.features,
          coupon_code: formValues.coupon_code || null
        }
      }
    };
  }

  // MÉTHODE PRINCIPALE POUR PROCÉDER AU PAIEMENT (SIMULATION)
  procederAuPaiement(): void {
    console.log('=== DÉBUT DE LA TRANSACTION ===');

    // 1. Vérifications des données essentielles
    if (!this.abonnementData?.courseId) {
      alert('ID du cours manquant');
      this.router.navigate(['/store']);
      return;
    }
    if (!this.abonnementData?.planType) {
      alert('Type d\'abonnement manquant');
      this.router.navigate(['/store']);
      return;
    }
    if (!this.currentUser?.id) {
      alert('ID utilisateur manquant');
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    // 2. Marquer tous les champs comme touchés
    this.paiementForm.markAllAsTouched();

    // 3. Valider le formulaire
    if (this.paiementForm.invalid) {
      this.showDetailedValidationErrors();
      return;
    }

    // 4. Récupérer les valeurs du formulaire
    const formValues = this.paiementForm.value;

    // 5. Valider selon la méthode de paiement
    if (formValues.type_paiement === 'carte_bancaire') {
      const carteData = formValues.donnees_carte;
      if (!carteData) {
        alert('Données de carte manquantes');
        return;
      }
      if (!this.validerDonneesCarteForm(carteData)) {
        return;
      }
      if (!this.validerLuhn(carteData.numero)) {
        alert('Numéro de carte invalide selon la vérification standard');
        return;
      }
    }

    // 6. Confirmation avant simulation
    const montantTotal = this.getPriceWithDiscount() * 1.19;
    const confirmation = confirm(
      `🎮 \n\n` +
      `Confirmez-vous le paiement de ${this.formatPrice(montantTotal)} ?\n\n` +
      `Plan: ${this.abonnementData.planName}\n` +
      `Méthode: ${this.paymentMethods.find(m => m.id === formValues.type_paiement)?.label}\n\n` +
      `Cliquez sur OK pour continuer le paiement.`
    );

    if (!confirmation) {
      return;
    }

    // 7. Démarrer le chargement
    this.isLoading = true;
    console.log('Paiement en cours...');

    // 8. Mettre à jour paiementData
    this.paiementData = {
      type_paiement: formValues.type_paiement,
      donnees_carte: formValues.donnees_carte || {
        numero: '',
        expiration: '',
        cvv: '',
        nom: ''
      },
      coupon_code: formValues.coupon_code || ''
    };

    // 9. Décider si c'est un renouvellement ou un nouvel abonnement
    if (this.abonnementActuel && this.abonnementActuel.course_id === this.abonnementData.courseId) {
      this.renouvelerAbonnement();
    } else {
      this.creerNouvelAbonnement();
    }
  }

  private debugFormValidation(): void {
    console.log('=== DEBUG FORMULAIRE ===');
    console.log('Formulaire global - Valid:', this.paiementForm.valid, 'Invalid:', this.paiementForm.invalid);

    Object.keys(this.paiementForm.controls).forEach(key => {
      const control = this.paiementForm.get(key);
      console.log(`Champ ${key}:`, {
        valid: control?.valid,
        invalid: control?.invalid,
        errors: control?.errors,
        value: control?.value
      });

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          const subControl = control.get(subKey);
          console.log(` Sous-champ ${subKey}:`, {
            valid: subControl?.valid,
            invalid: subControl?.invalid,
            errors: subControl?.errors,
            value: subControl?.value
          });
        });
      }
    });
  }

  private logAllFormErrors(): void {
    console.log('=== ERREURS DU FORMULAIRE ===');

    Object.keys(this.paiementForm.controls).forEach(key => {
      const control = this.paiementForm.get(key);
      if (control?.invalid) {
        console.log(`Erreurs sur ${key}:`, control.errors);
      }

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          const subControl = control.get(subKey);
          if (subControl?.invalid) {
            console.log(` Erreurs sur ${key}.${subKey}:`, subControl.errors);
          }
        });
      }
    });
  }

  private showDetailedValidationErrors(): void {
    const errors: string[] = [];

    if (this.type_paiement?.invalid) {
      errors.push('Méthode de paiement requise');
    }

    if (this.paiementData.type_paiement === 'carte_bancaire') {
      if (this.numero?.invalid) {
        if (this.numero?.errors?.['required']) {
          errors.push('Numéro de carte requis');
        } else if (this.numero?.errors?.['pattern']) {
          errors.push('Format de carte invalide (chiffres seulement)');
        } else if (this.numero?.errors?.['minlength']) {
          errors.push('Numéro de carte trop court (13-19 chiffres)');
        } else if (this.numero?.errors?.['maxlength']) {
          errors.push('Numéro de carte trop long (maximum 19 caractères)');
        }
      }

      if (this.expiration?.invalid) {
        if (this.expiration?.errors?.['required']) {
          errors.push('Date d\'expiration requise');
        } else if (this.expiration?.errors?.['pattern']) {
          errors.push('Format de date invalide (MM/AA, ex: 12/25)');
        }
      }

      if (this.cvv?.invalid) {
        if (this.cvv?.errors?.['required']) {
          errors.push('Code CVV requis');
        } else if (this.cvv?.errors?.['pattern']) {
          errors.push('CVV invalide (3 ou 4 chiffres)');
        } else if (this.cvv?.errors?.['minlength']) {
          errors.push('CVV trop court (3-4 chiffres)');
        }
      }

      if (this.nom?.invalid) {
        if (this.nom?.errors?.['required']) {
          errors.push('Nom sur la carte requis');
        } else if (this.nom?.errors?.['minlength']) {
          errors.push('Nom trop court (minimum 2 caractères)');
        }
      }
    }

    if (this.adresse_facturation?.invalid) {
      if (this.nom_complet?.invalid) {
        errors.push('Nom complet requis');
      }
      if (this.email?.invalid) {
        if (this.email?.errors?.['required']) {
          errors.push('Email requis');
        } else if (this.email?.errors?.['email']) {
          errors.push('Format d\'email invalide');
        }
      }
      if (this.telephone?.invalid) {
        errors.push('Téléphone requis');
      }
      if (this.adresse?.invalid) {
        errors.push('Adresse requise');
      }
      if (this.ville?.invalid) {
        errors.push('Ville requise');
      }
      if (this.code_postal?.invalid) {
        errors.push('Code postal requis');
      }
    }

    if (errors.length > 0) {
      const message = 'Veuillez corriger les erreurs suivantes :\n\n' +
                     errors.map((err, index) => `${index + 1}. ${err}`).join('\n');
      alert(message);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  // Créer un nouvel abonnement via SIMULATION
  private creerNouvelAbonnement(): void {
    if (!this.abonnementData?.courseId || !this.abonnementData?.planType) {
      alert('Données d\'abonnement incomplètes');
      this.isLoading = false;
      return;
    }
    
    console.log('🎮 Création d\'un nouvel abonnement simulé...');

    const donneesPaiement: DonneesSimulationPaiement = {
      course_id: this.abonnementData.courseId,
      type_abonnement: this.abonnementData.planType,
      donnees_carte: {
        numero: this.paiementData.donnees_carte.numero.replace(/\s/g, ''),
        expiration: this.paiementData.donnees_carte.expiration,
        cvv: this.paiementData.donnees_carte.cvv,
        nom: this.paiementData.donnees_carte.nom
      },
      coupon_code: this.paiementData.coupon_code || undefined
    };

    this.paiementSimulationService.simulerPaiementNouvelAbonnement(donneesPaiement).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Réponse  création abonnement:', response);

        if (response.success) {
          this.processerSuccesPaiement(response);
        } else {
          alert('Erreur lors de la  de création: ' + (response.message || 'Veuillez réessayer'));
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur  création abonnement:', error);
        alert('Erreur lors de la . Veuillez réessayer.');
      }
    });
  }

  // Renouveler un abonnement existant via SIMULATION
  private renouvelerAbonnement(): void {
    if (!this.abonnementActuel) {
      alert('Aucun abonnement à renouveler');
      this.isLoading = false;
      return;
    }
    
    console.log('🔄  Renouvellement d\'abonnement...');

    const donneesRenouvellement: any = {
      type_paiement: this.paiementData.type_paiement,
      coupon_code: this.paiementData.coupon_code || undefined,
      type_abonnement: this.abonnementData?.planType || 'mensuel'
    };

    if (this.paiementData.type_paiement === 'carte_bancaire') {
      donneesRenouvellement.donnees_carte = {
        numero: this.paiementData.donnees_carte.numero.replace(/\s/g, ''),
        expiration: this.paiementData.donnees_carte.expiration,
        cvv: this.paiementData.donnees_carte.cvv,
        nom: this.paiementData.donnees_carte.nom
      };
    }

    this.paiementSimulationService.renouvelerAbonnement(this.abonnementActuel.id, donneesRenouvellement).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('✅ Réponse  renouvellement:', response);

        if (response.success) {
          this.processerSuccesRenouvellement(response);
        } else {
          alert('Erreur lors de la  de renouvellement: ' + (response.message || 'Veuillez réessayer'));
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur  renouvellement:', error);
        alert('Erreur lors du de renouvellement. Veuillez réessayer.');
      }
    });
  }

  private processerSuccesPaiement(response: any): void {
    const transactionData = {
      transactionId: response.data?.simulation?.transaction_id || `SIM_${Date.now()}`,
      stripeId: 'simulation_frontend_' + Date.now(),
      planId: this.abonnementData?.planId,
      planName: this.abonnementData?.planName,
      courseId: this.abonnementData?.courseId,
      courseTitle: this.abonnementData?.courseTitle,
      amount: this.getPriceWithDiscount(),
      taxAmount: this.getPriceWithDiscount() * 0.19,
      totalAmount: this.getPriceWithDiscount() * 1.19,
      date: new Date().toISOString(),
      type: 'nouveau',
      paymentMethod: this.paiementData.type_paiement,
      status: 'complete',
      couponCode: this.paiementData.coupon_code || null,
      abonnementId: response.data?.abonnement?.id,
      paiementId: response.data?.paiement?.id,
      modeSimulation: true,
      message: '🎮 Paiement effectué avec succès (Front-end uniquement)'
    };

    alert(`
      🎉 Paiement RÉUSSIE !
      
      📋 Référence: ${transactionData.transactionId}
      
      📦 Plan: ${transactionData.planName}
      💰 Montant: ${this.formatPrice(transactionData.totalAmount)}
      📅 Date: ${new Date().toLocaleDateString('fr-FR')}
      
      
      Vous allez être redirigé vers la page de confirmation...
    `);

    localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
    localStorage.removeItem('selectedAbonnement');

    setTimeout(() => {
      this.router.navigate(['/confirmation-paiement'], {
        queryParams: {
          ...transactionData,
          simulation: 'true'
        }
      });
    }, 2000);
  }

  private processerSuccesRenouvellement(response: any): void {
    const transactionData = {
      transactionId: response.data?.paiement?.reference || `REN_${Date.now()}`,
      stripeId: 'simulation_frontend_' + Date.now(),
      planId: this.abonnementData?.planId,
      planName: this.abonnementData?.planName,
      courseId: this.abonnementData?.courseId,
      courseTitle: this.abonnementData?.courseTitle,
      amount: this.getPriceWithDiscount(),
      taxAmount: this.getPriceWithDiscount() * 0.19,
      totalAmount: this.getPriceWithDiscount() * 1.19,
      date: new Date().toISOString(),
      type: 'renouvellement',
      paymentMethod: this.paiementData.type_paiement,
      status: 'complete',
      couponCode: this.paiementData.coupon_code || null,
      nouvelleDateFin: response.data?.nouvelle_date_fin,
      abonnementId: response.data?.abonnement?.id,
      modeSimulation: true
    };

    localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
    localStorage.removeItem('selectedAbonnement');

    const message = `
      ✅ Renouvellement réussie !
     
      📋 Référence: ${transactionData.transactionId}
      📦 Plan: ${transactionData.planName}
      💰 Montant: ${this.formatPrice(transactionData.totalAmount)}
      📅 Date: ${new Date().toLocaleDateString('fr-FR')}
     
      
      Vous allez être redirigé vers l'accueil...
    `;
    alert(message);

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);
  }

  private showApiValidationErrors(errors: any): void {
    let errorMessages = [];

    if (errors.donnees_carte) {
      if (errors.donnees_carte.numero) {
        errorMessages.push('Numéro de carte: ' + errors.donnees_carte.numero.join(', '));
      }
      if (errors.donnees_carte.expiration) {
        errorMessages.push('Date expiration: ' + errors.donnees_carte.expiration.join(', '));
      }
      if (errors.donnees_carte.cvv) {
        errorMessages.push('CVV: ' + errors.donnees_carte.cvv.join(', '));
      }
      if (errors.donnees_carte.nom) {
        errorMessages.push('Nom: ' + errors.donnees_carte.nom.join(', '));
      }
    }

    if (errorMessages.length > 0) {
      alert('Erreurs de validation:\n' + errorMessages.join('\n'));
    }
  }

  annulerPaiement(): void {
    if (confirm('🎮 Êtes-vous sûr de vouloir annuler  ? Votre sélection sera perdue.')) {
      localStorage.removeItem('selectedAbonnement');
      if (this.abonnementData?.courseId) {
        this.router.navigate(['/course', this.abonnementData.courseId]);
      } else {
        this.router.navigate(['/store']);
      }
    }
  }

  getPriceWithDiscount(): number {
    if (!this.abonnementData) return 0;

    let prix = this.abonnementData.price;

    if (this.paiementData.coupon_code) {
      const code = this.paiementData.coupon_code.toUpperCase();

      switch (code) {
        case 'EDUTECH10':
          prix *= 0.9;
          break;
        case 'EDUTECH20':
          prix *= 0.8;
          break;
        case 'EDUTECH50':
          prix *= 0.5;
          break;
        default:
          const match = code.match(/SAVE(\d+)/);
          if (match) {
            const reduction = parseInt(match[1], 10);
            if (!isNaN(reduction) && reduction < prix) {
              prix -= reduction;
            }
          }
      }
    }

    return Math.round(prix * 100) / 100;
  }

  getCourseImage(courseId?: number): string {
    if (!courseId) return 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    const courseImages: { [key: number]: string } = {
      1: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      2: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      3: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };

    return courseImages[courseId] || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }

  applyCoupon(): void {
    const code = this.coupon_code?.value?.trim();
    if (!code) {
      alert('Veuillez entrer un code promo');
      return;
    }
    const codeUpper = code.toUpperCase();
    let message = '';
    let valide = false;
    switch (codeUpper) {
      case 'EDUTECH10':
        message = 'Code promo appliqué ! Réduction de 10%';
        valide = true;
        break;
      case 'EDUTECH20':
        message = 'Code promo appliqué ! Réduction de 20%';
        valide = true;
        break;
      case 'EDUTECH50':
        message = 'Code promo appliqué ! Réduction de 50%';
        valide = true;
        break;
      case 'SAVE10':
        message = 'Code promo appliqué ! 10€ de réduction';
        valide = true;
        break;
      case 'SAVE20':
        message = 'Code promo appliqué ! 20€ de réduction';
        valide = true;
        break;
      default:
        message = 'Code promo invalide ou expiré';
        valide = false;
    }
    if (valide) {
      if (this.abonnementData && codeUpper === 'EDUTECH50' && this.abonnementData.price < 100) {
        message = 'Ce code promo ne s\'applique qu\'aux abonnements de 100€ ou plus';
        this.coupon_code?.setValue('');
      } else {
        alert(message);
      }
    } else {
      alert(message);
      this.coupon_code?.setValue('');
    }
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',') + ' TND';
  }

  getPlanTypeInFrench(): string {
    switch (this.abonnementData?.planType) {
      case 'mensuel': return 'Mensuel';
      case 'annuel': return 'Annuel';
      case 'ponctuel': return 'Accès ponctuel';
      default: return 'Abonnement';
    }
  }

  getCardNumberSegments(): string[] {
    const numero = this.numero?.value || '';
    if (!numero) {
      return ['****', '****', '****', '****'];
    }

    const cleanNumber = numero.replace(/\s/g, '');
    const segments = [];

    for (let i = 0; i < 4; i++) {
      const start = i * 4;
      const segment = cleanNumber.substring(start, start + 4);
      segments.push(segment || '****');
    }

    return segments;
  }

  validateCard(): void {
    this.showCardValidation = true;
    setTimeout(() => {
      this.showCardValidation = false;
    }, 3000);
  }

  // ============ MÉTHODES DE TEST ============
  prefillTestData(): void {
    console.log('=== PRÉREMPLISSAGE AVEC DONNÉES DE TEST ===');

    if (!this.abonnementData) {
      console.warn('AbonnementData non disponible - chargement...');
      this.loadAbonnementData();
      setTimeout(() => this.prefillTestData(), 1000);
      return;
    }
    if (!this.currentUser) {
      console.warn('Utilisateur non disponible - vérification...');
      this.checkUserStatus();
      setTimeout(() => this.prefillTestData(), 1000);
      return;
    }

    const testData = {
      type_paiement: 'carte_bancaire' as 'carte_bancaire',
      donnees_carte: {
        numero: '4242 4242 4242 4242',
        expiration: '12/30',
        cvv: '123',
        nom: 'JEAN DUPONT'
      },
      coupon_code: 'EDUTECH10',
      adresse_facturation: {
        nom_complet: this.currentUser.name || 'Jean Dupont',
        email: this.currentUser.email || 'test@example.com',
        telephone: this.currentUser.phone || '+21650123456',
        adresse: this.currentUser.address || '123 Rue de Tunis',
        ville: this.currentUser.city || 'Tunis',
        code_postal: this.currentUser.zip_code || '1000',
        pays: this.currentUser.country || 'Tunisie'
      },
      course_id: this.abonnementData.courseId || 1,
      plan_type: this.abonnementData.planType || 'mensuel',
      montant: this.abonnementData.price || 99.99,
      user_id: this.currentUser.id || 1
    };

    console.log('Données de test appliquées:', testData);

    this.paiementForm.patchValue(testData);

    this.paiementData = {
      type_paiement: testData.type_paiement,
      donnees_carte: testData.donnees_carte,
      coupon_code: testData.coupon_code
    };

    this.paiementForm.markAllAsTouched();

    Object.keys(this.paiementForm.controls).forEach(key => {
      const control = this.paiementForm.get(key);
      control?.updateValueAndValidity();
    });

    console.log('✅ Préremplissage terminé avec succès');

    setTimeout(() => {
      this.debugFormValidation();
    }, 500);
  }

  genererDonneesTestRealistes(): void {
    console.log('🎲 Génération de données de test réalistes');
    
    const cartesTest = [
      { numero: '4242 4242 4242 4242', nom: 'JEAN DUPONT', cvv: '123' },
      { numero: '5555 5555 5555 4444', nom: 'MARIE DURAND', cvv: '456' },
      { numero: '3782 822463 10005', nom: 'PIERRE MARTIN', cvv: '789' },
      { numero: '6011 1111 1111 1117', nom: 'JULIE BERNARD', cvv: '321' }
    ];
    
    const carteAleatoire = cartesTest[Math.floor(Math.random() * cartesTest.length)];
    const dateExpiration = new Date();
    dateExpiration.setFullYear(dateExpiration.getFullYear() + 2);
    const moisExp = (dateExpiration.getMonth() + 1).toString().padStart(2, '0');
    const anneeExp = dateExpiration.getFullYear().toString().slice(-2);
    
    const coupons = ['', 'EDUTECH10', 'EDUTECH20', 'SAVE10'];
    const couponAleatoire = coupons[Math.floor(Math.random() * coupons.length)];
    
    const testData = {
      type_paiement: 'carte_bancaire' as 'carte_bancaire',
      donnees_carte: {
        numero: carteAleatoire.numero,
        expiration: `${moisExp}/${anneeExp}`,
        cvv: carteAleatoire.cvv,
        nom: carteAleatoire.nom
      },
      coupon_code: couponAleatoire,
      adresse_facturation: {
        nom_complet: this.currentUser?.name || 'Utilisateur Test',
        email: this.currentUser?.email || 'test@example.com',
        telephone: '+216' + Math.floor(Math.random() * 90000000 + 10000000),
        adresse: Math.random() > 0.5 ? '123 Rue de Tunis' : '456 Avenue Habib Bourguiba',
        ville: Math.random() > 0.5 ? 'Tunis' : 'Sousse',
        code_postal: Math.random() > 0.5 ? '1000' : '4000',
        pays: 'Tunisie'
      }
    };
    
    console.log('🎯 Données générées:', testData);
    
    this.paiementForm.patchValue(testData);
    this.paiementData = {
      type_paiement: testData.type_paiement,
      donnees_carte: testData.donnees_carte,
      coupon_code: testData.coupon_code
    };
    
    setTimeout(() => {
      this.paiementForm.markAllAsTouched();
      Object.keys(this.paiementForm.controls).forEach(key => {
        const control = this.paiementForm.get(key);
        control?.updateValueAndValidity();
      });
      console.log('✅ Données de test aléatoires appliquées');
    }, 100);
  }

  testPaiementComplet(): void {
    console.log('=== TEST COMPLET DE SIMULATION ===');

    this.genererDonneesTestRealistes();

    setTimeout(() => {
      console.log('Simulation du clic sur "Procéder au paiement"');

      if (this.paiementForm.valid) {
        console.log('✅ Formulaire valide - prêt pour la simulation');
        
        const montantTotal = this.getPriceWithDiscount() * 1.19;
        console.log(`Montant total: ${this.formatPrice(montantTotal)}`);

        const donneesSimulation = {
          course_id: this.abonnementData?.courseId,
          type_abonnement: this.abonnementData?.planType,
          donnees_carte: {
            numero: this.paiementData.donnees_carte.numero.replace(/\s/g, ''),
            expiration: this.paiementData.donnees_carte.expiration,
            cvv: this.paiementData.donnees_carte.cvv,
            nom: this.paiementData.donnees_carte.nom
          },
          coupon_code: this.paiementData.coupon_code || undefined
        };

        console.log('Données prêtes pour la simulation:', donneesSimulation);
        console.log('✅ Test complet réussi - Prêt à simuler');
        
        alert('🎮 TEST COMPLET RÉUSSI\n\nLes données sont prêtes pour la simulation.\nCliquez sur "Payer" pour lancer la simulation.');
      } else {
        console.error('❌ Formulaire invalide - impossible de procéder');
        this.debugFormValidation();
        alert('❌ Formulaire invalide. Veuillez vérifier les données.');
      }
    }, 1500);
  }

  testValidationComplete(): void {
    console.log('=== TEST VALIDATION COMPLÈTE ===');

    this.debugFormValidation();
    console.log('Données abonnement:', this.abonnementData);
    console.log('Utilisateur:', this.currentUser);
    console.log('Abonnement actuel:', this.abonnementActuel);
    console.log('Données paiement:', this.paiementData);
    console.log('Formulaire complet:', this.paiementForm.value);

    const donneesPourAPI = this.preparePaiementData();
    console.log('Données préparées pour la simulation:', donneesPourAPI);

    const numeroCarte = this.paiementData.donnees_carte.numero?.replace(/\s/g, '');
    if (numeroCarte) {
      const luhnValide = this.validerLuhn(numeroCarte);
      console.log('Validation Luhn:', luhnValide ? '✅ Valide' : '❌ Invalide');
    }

    alert('✅ Test de validation complète terminé\n\nVoir la console pour les détails.');
    console.log('=== FIN TEST ===');
  }
}