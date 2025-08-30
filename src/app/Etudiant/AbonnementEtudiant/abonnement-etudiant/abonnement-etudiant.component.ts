import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-abonnement-etudiant',
  templateUrl: './abonnement-etudiant.component.html',
  styleUrls: ['./abonnement-etudiant.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInLeft', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeInRight', [
      state('void', style({ opacity: 0, transform: 'translateX(20px)' })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('zoomIn', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('fadeInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AbonnementEtudiantComponent implements OnInit {
  isSidebarOpen = false;
  isUserMenuOpen = false;
  isSuccessModalOpen = false;
  isAnnual = false;
  selectedPaymentMethod = 'credit-card';
  cardNumber = '';
  cardHolder = '';
  cardMonth = '01';
  cardYear = '2023';
  cardCVV = '';
  saveCard = false;

  plans = [
    {
      name: 'Basique',
      price: 'Gratuit',
      term: '/ toujours',
      features: [
        { text: 'Accès à 3 cours gratuits', disabled: false },
        { text: 'Support communautaire', disabled: false },
        { text: 'Exercices basiques', disabled: false },
        { text: 'Certifications', disabled: true },
        { text: 'Projets pratiques', disabled: true },
        { text: 'Support prioritaire', disabled: true }
      ]
    },
    {
      name: 'Premium',
      price: '9,99€',
      term: '/ mois',
      features: [
        { text: 'Accès à tous les cours', disabled: false },
        { text: 'Certifications incluses', disabled: false },
        { text: 'Projets pratiques avancés', disabled: false },
        { text: 'Support prioritaire', disabled: false },
        { text: 'Ressources téléchargeables', disabled: false },
        { text: 'Accès early aux nouveaux cours', disabled: false }
      ]
    },
    {
      name: 'Étudiant',
      price: '4,99€',
      term: '/ mois',
      features: [
        { text: 'Accès à tous les cours', disabled: false },
        { text: 'Certifications incluses', disabled: false },
        { text: 'Projets pratiques', disabled: false },
        { text: 'Support prioritaire', disabled: false },
        { text: 'Ressources téléchargeables', disabled: false },
        { text: 'Verification étudiante requise', disabled: false }
      ]
    }
  ];

  faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Si vous souhaitez passer à un plan inférieur, cela prendra effet à la fin de votre période de facturation actuelle.',
      expanded: false
    },
    {
      question: 'Y a-t-il des frais d\'annulation ?',
      answer: 'Non, vous pouvez annuler votre abonnement à tout moment sans frais. Vous conserverez l\'accès jusqu\'à la fin de votre période de facturation.',
      expanded: false
    },
    {
      question: 'Comment fonctionne la garantie satisfait ou remboursé ?',
      answer: 'Nous offrons une garantie de remboursement de 30 jours. Si vous n\'êtes pas satisfait de notre plateforme, contactez-nous dans les 30 jours suivant votre achat pour un remboursement intégral.',
      expanded: false
    }
  ];

  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2023', '2024', '2025', '2026', '2027', '2028'];

  constructor() {}

  ngOnInit(): void {}

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    const modal = (event.target as HTMLElement).closest('.success-modal');
    if (!modal && this.isSuccessModalOpen) {
      this.isSuccessModalOpen = false;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  navigateTo(section: string): void {
    console.log(`Navigate to ${section}`);
    // Implement navigation logic (e.g., using Angular Router)
  }

  openNotifications(): void {
    console.log('Open notifications');
    // Implement notifications logic
  }

  openSettings(): void {
    console.log('Open settings');
    // Implement settings logic
  }

  updatePricing(): void {
    if (this.isAnnual) {
      this.plans[1].price = '99,99€';
      this.plans[1].term = '/ an';
      this.plans[2].price = '49,99€';
      this.plans[2].term = '/ an';
    } else {
      this.plans[1].price = '9,99€';
      this.plans[1].term = '/ mois';
      this.plans[2].price = '4,99€';
      this.plans[2].term = '/ mois';
    }
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  toggleFaq(index: number): void {
    this.faqs[index].expanded = !this.faqs[index].expanded;
  }

  subscribe(plan: string): void {
    console.log(`Subscribed to ${plan} plan`);
    if (plan === 'premium') {
      this.subscribePremium();
    }
  }

  subscribePremium(): void {
    this.createConfetti();
    setTimeout(() => {
      this.isSuccessModalOpen = true;
    }, 1500);
  }

  closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
  }

  createConfetti(): void {
    const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
  }
}