import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paiement-cour-saisiecoordonne',
  templateUrl: './paiement-cour-saisiecoordonne.component.html',
  styleUrls: ['./paiement-cour-saisiecoordonne.component.scss']
})
export class PaiementCourSaisiecoordonneComponent implements OnInit {

  // Données du cours sélectionné
  selectedCourse: any = {
    title: 'Angular Avancé - Formation Complète',
    price: 79,
    originalPrice: 129,
    discount: 50
  };

  // Informations personnelles
  personalInfo = {
    firstName: '',
    lastName: '',
    email: ''
  };

  // Méthode de paiement sélectionnée
  paymentMethod: 'card' | 'sepa' | 'transfer' = 'card';

  // Informations carte bancaire
  cardInfo = {
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    type: '',
    recurringPayment: false
  };

  // Informations SEPA
  sepaInfo = {
    iban: '',
    bic: '',
    mandateAccepted: false
  };

  // Vérification
  verificationCode: string = '';
  showVerification: boolean = false;
  termsAccepted: boolean = false;

  // Confirmation
  showConfirmation: boolean = false;
  paymentReference: string = '';
  paymentDate: Date = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer les données du cours depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      if (params['course']) {
        this.selectedCourse = JSON.parse(params['course']);
      }
    });
  }

  selectPaymentMethod(method: 'card' | 'sepa' | 'transfer'): void {
    this.paymentMethod = method;
    
    // Pour les cartes, on simule l'envoi du code de vérification
    if (method === 'card') {
      setTimeout(() => {
        this.showVerification = true;
      }, 1000);
    } else {
      this.showVerification = false;
    }
  }

  formatCardNumber(): void {
    // Formatage du numéro de carte (ajout d'espaces)
    let value = this.cardInfo.number.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches ? matches[0] : '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      this.cardInfo.number = parts.join(' ');
    } else {
      this.cardInfo.number = value;
    }

    // Détection du type de carte
    if (value.startsWith('4')) {
      this.cardInfo.type = 'visa';
    } else if (value.startsWith('5')) {
      this.cardInfo.type = 'mastercard';
    } else if (value.startsWith('3')) {
      this.cardInfo.type = 'amex';
    } else {
      this.cardInfo.type = '';
    }
  }

  formatExpiry(): void {
    // Formatage de la date d'expiration (MM/AA)
    let value = this.cardInfo.expiry.replace(/\D/g, '');
    
    if (value.length >= 2) {
      this.cardInfo.expiry = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
      this.cardInfo.expiry = value;
    }
  }

  formatIBAN(): void {
    // Formatage de l'IBAN (groupes de 4 caractères)
    let value = this.sepaInfo.iban.replace(/\s+/g, '').toUpperCase();
    const matches = value.match(/.{1,4}/g);
    
    if (matches) {
      this.sepaInfo.iban = matches.join(' ');
    }
  }

  generateMandateReference(): string {
    return 'MDT' + Date.now().toString().slice(-8);
  }

  generateTransferReference(): string {
    return 'VIR' + Date.now().toString().slice(-10);
  }

  resendCode(): void {
    // Simulation du renvoi de code
    this.verificationCode = '';
    // Ici, on appellerait l'API pour renvoyer le code
  }

  isFormValid(): boolean {
    // Validation basique du formulaire
    const personalValid = this.personalInfo.firstName && 
                         this.personalInfo.lastName && 
                         this.personalInfo.email;

    if (!personalValid || !this.termsAccepted) {
      return false;
    }

    switch (this.paymentMethod) {
      case 'card':
        return this.cardInfo.number.replace(/\s/g, '').length >= 16 &&
               this.cardInfo.expiry.length === 5 &&
               this.cardInfo.cvv.length >= 3 &&
               this.cardInfo.name.length > 0 &&
               (this.showVerification ? this.verificationCode.length === 6 : true);
      
      case 'sepa':
        return this.sepaInfo.iban.replace(/\s/g, '').length >= 14 &&
               this.sepaInfo.bic.length >= 8 &&
               this.sepaInfo.mandateAccepted;
      
      case 'transfer':
        return true; // Pour le virement, on suppose que l'utilisateur a pris note des infos
      
      default:
        return false;
    }
  }

  processPayment(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Simulation du traitement du paiement
    this.paymentReference = 'PAY' + Date.now().toString().slice(-10);
    this.paymentDate = new Date();

    // Ici, on appellerait l'API de paiement
    setTimeout(() => {
      this.showConfirmation = true;
    }, 2000);
  }

  goToCourse(): void {
    this.router.navigate(['/course', this.selectedCourse.id]);
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }


}
