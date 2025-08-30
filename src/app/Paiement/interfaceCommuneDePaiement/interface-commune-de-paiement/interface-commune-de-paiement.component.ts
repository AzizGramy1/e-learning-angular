import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interface-commune-de-paiement',
  templateUrl: './interface-commune-de-paiement.component.html',
  styleUrls: ['./interface-commune-de-paiement.component.scss']
  
  
})
export class InterfaceCommuneDePaiementComponentimplements implements OnInit {


   // Define animations in the component class
  animations: AnimationTriggerMetadata[] = [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('flipCard', [
      state('front', style({ transform: 'rotateY(0deg)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front <=> back', [
        animate('0.6s cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ];

  activeTab: 'card' | 'link' | 'direct-debit' = 'card';
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvv = '';
  saveCard = false;
  email = 'marie@example.com';
  iban = '';
  bic = '';
  accountName = '';
  acceptMandate = false;
  cardState: 'front' | 'back' = 'front';
  cardNumberDisplay = '•••• •••• •••• ••••';
  cardNameDisplay = 'NOM PRÉNOM';
  cardExpiryDisplay = '••/••';
  cardCvvDisplay = '•••';

  constructor() {}

  ngOnInit(): void {}

  get tabIndicatorTransform(): string {
    const index = this.activeTab === 'card' ? 0 : this.activeTab === 'link' ? 1 : 2;
    return `translateX(${index * 100}%)`;
  }

  setActiveTab(tab: 'card' | 'link' | 'direct-debit'): void {
    this.activeTab = tab;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(section: string): void {
    console.log(`Navigate to ${section}`);
    // Implement navigation logic (e.g., using Angular Router)
  }

  formatCardNumber(): void {
    let value = this.cardNumber.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    this.cardNumber = formatted;
    this.cardNumberDisplay = formatted || '•••• •••• •••• ••••';
  }

  updateCardName(): void {
    this.cardNameDisplay = this.cardName.toUpperCase() || 'NOM PRÉNOM';
  }

  formatCardExpiry(): void {
    let value = this.cardExpiry.replace(/\//g, '').replace(/[^0-9]/gi, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 4; i++) {
      if (i === 2) formatted += '/';
      formatted += value[i];
    }
    this.cardExpiry = formatted;
    this.cardExpiryDisplay = formatted || '••/••';
  }

  formatCardCvv(): void {
    let value = this.cardCvv.replace(/[^0-9]/gi, '').substring(0, 3);
    this.cardCvv = value;
    this.cardCvvDisplay = value || '•••';
  }

  flipCard(showBack: boolean): void {
    this.cardState = showBack ? 'back' : 'front';
  }

  onSubmit(): void {
    console.log('Payment processing...');
    // Implement payment processing logic (e.g., integrate with payment gateway)
    alert('Paiement en cours de traitement...');
  }

  sendPaymentLink(): void {
    console.log(`Sending payment link to ${this.email}`);
    // Implement payment link logic
  }

  activateDirectDebit(): void {
    console.log('Activating direct debit...');
    // Implement direct debit logic
  }
}
 
  