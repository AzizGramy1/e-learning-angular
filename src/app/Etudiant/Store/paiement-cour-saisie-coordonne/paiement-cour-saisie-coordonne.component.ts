import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonnementService, DonneesRenouvellement } from 'src/app/Service/paiement.service';

@Component({
  selector: 'app-paiement-cour-saisie-coordonne',
  templateUrl: './paiement-cour-saisie-coordonne.component.html',
  styleUrls: ['./paiement-cour-saisie-coordonne.component.scss']
})
export class PaiementCourSaisieCoordonneComponent {


 paiementForm: FormGroup;
  isLoading = false;
  currentStep = 1;
  totalSteps = 3;

  // Types d'abonnements disponibles
  abonnements = [
    {
      id: 'mensuel',
      nom: 'Mensuel',
      prix: 29.99,
      periode: '/mois',
      avantages: [
        'Accès à tous les cours',
        'Support prioritaire',
        'Certificats inclus',
        'Mises à jour régulières'
      ],
      populaire: false
    },
    {
      id: 'annuel',
      nom: 'Annuel',
      prix: 299.99,
      periode: '/an',
      avantages: [
        '2 mois gratuits',
        'Certificats premium',
        'Mentorat personnalisé',
        'Projets avancés',
        'Accès anticipé aux nouveautés'
      ],
      populaire: true
    },
    {
      id: 'ponctuel',
      nom: 'Ponctuel',
      prix: 99.99,
      periode: 'une fois',
      avantages: [
        'Accès à vie à un cours',
        'Sans engagement',
        'Mises à jour gratuites',
        'Support standard'
      ],
      populaire: false
    }
  ];

  selectedAbonnement = this.abonnements[0]; // Abonnement mensuel par défaut

  // Méthodes de paiement
  methodesPaiement = [
    { id: 'carte', nom: 'Carte bancaire', icon: 'fa-credit-card', color: 'text-blue-400' },
    { id: 'paypal', nom: 'PayPal', icon: 'fa-paypal', color: 'text-blue-500' },
    { id: 'mobile', nom: 'Mobile Money', icon: 'fa-mobile-alt', color: 'text-green-400' },
    { id: 'virement', nom: 'Virement bancaire', icon: 'fa-university', color: 'text-purple-400' }
  ];

  selectedMethode = 'carte';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private abonnementService: AbonnementService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        const type = params['type'];
        const abonnement = this.abonnements.find(a => a.id === type);
        if (abonnement) {
          this.selectedAbonnement = abonnement;
        }
      }
    });
  }

  initForm(): void {
    this.paiementForm = this.fb.group({
      // Informations personnelles
      nomComplet: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      
      // Adresse
      adresse: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      codePostal: ['', [Validators.required]],
      pays: ['France', [Validators.required]],
      
      // Informations de carte
      numeroCarte: [''],
      dateExpiration: [''],
      cvv: [''],
      nomCarte: [''],
      
      // Coupon
      couponCode: [''],
      
      // Conditions
      acceptCGV: [false, [Validators.requiredTrue]],
      acceptCGU: [false, [Validators.requiredTrue]],
      acceptNewsletter: [true]
    });
  }

  // Changer d'étape
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Sélectionner un abonnement
  selectAbonnement(abonnement: any): void {
    this.selectedAbonnement = abonnement;
  }

  // Sélectionner une méthode de paiement
  selectMethode(methode: string): void {
    this.selectedMethode = methode;
    
    // Mettre à jour les validations selon la méthode
    const carteControls = ['numeroCarte', 'dateExpiration', 'cvv', 'nomCarte'];
    
    if (methode === 'carte') {
      carteControls.forEach(control => {
        this.paiementForm.get(control)?.setValidators([Validators.required]);
        this.paiementForm.get(control)?.updateValueAndValidity();
      });
    } else {
      carteControls.forEach(control => {
        this.paiementForm.get(control)?.clearValidators();
        this.paiementForm.get(control)?.updateValueAndValidity();
      });
    }
  }

  // Appliquer un coupon
  appliquerCoupon(): void {
    const code = this.paiementForm.get('couponCode')?.value;
    if (code) {
      // Logique pour appliquer le coupon
      console.log('Coupon appliqué:', code);
    }
  }

  // Calculer le total
  getTotal(): number {
    let total = this.selectedAbonnement.prix;
    // Ajouter ici la logique des taxes ou réductions
    return total;
  }

  // Soumettre le paiement
  soumettrePaiement(): void {
    if (this.paiementForm.invalid) {
      this.marquerChampsTouches();
      return;
    }

    this.isLoading = true;

    // Préparer les données pour l'API
    const formData = this.paiementForm.value;
    
    // Créer l'objet DonneesRenouvellement selon l'interface
    const donneesPaiement: DonneesRenouvellement = {
      type_paiement: this.getTypePaiementAPI(),
      coupon_code: formData.couponCode || undefined
    };

    // Ajouter les données de carte si la méthode est carte_bancaire
    if (this.selectedMethode === 'carte') {
      donneesPaiement.donnees_carte = {
        numero: formData.numeroCarte,
        expiration: formData.dateExpiration,
        cvv: formData.cvv,
        nom: formData.nomCarte
      };
    }

    // Appeler le service
    // Note: Nous utilisons 0 comme ID temporaire, à adapter selon votre logique
    this.abonnementService.renouvelerAbonnement(0, donneesPaiement).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/paiement-success'], {
          queryParams: {
            reference: response.reference,
            montant: this.getTotal(),
            type: this.selectedAbonnement.nom
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur de paiement:', error);
        // Afficher un message d'erreur
      }
    });
  }

  // Convertir le type de paiement pour l'API
  private getTypePaiementAPI(): 'carte_bancaire' | 'virement_bancaire' | 'mobile_money' {
    switch(this.selectedMethode) {
      case 'carte': return 'carte_bancaire';
      case 'paypal': return 'carte_bancaire'; // PayPal est traité comme carte
      case 'mobile': return 'mobile_money';
      case 'virement': return 'virement_bancaire';
      default: return 'carte_bancaire';
    }
  }

  // Marquer tous les champs comme touchés
  private marquerChampsTouches(): void {
    Object.values(this.paiementForm.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.marquerChampsTouches();
      }
    });
  }

  // Retour à l'accueil
  annuler(): void {
    this.router.navigate(['/']);
  }

}
