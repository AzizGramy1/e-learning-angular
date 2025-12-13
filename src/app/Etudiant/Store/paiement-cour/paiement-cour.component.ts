import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paiement-cour',
  templateUrl: './paiement-cour.component.html',
  styleUrls: ['./paiement-cour.component.scss']
})
export class PaiementCourComponent implements OnInit {

   billingCycle: 'monthly' | 'yearly' = 'monthly';
  
  // Données pour la comparaison des plans
  comparisonFeatures = [
    { name: 'Accès à tous les cours', basique: false, professionnel: true, entreprise: true },
    { name: 'Nouveaux cours chaque mois', basique: true, professionnel: true, entreprise: true },
    { name: 'Certifications incluses', basique: true, professionnel: true, entreprise: true },
    { name: 'Support par email', basique: true, professionnel: true, entreprise: true },
    { name: 'Support prioritaire 24/7', basique: false, professionnel: true, entreprise: true },
    { name: 'Téléchargements illimités', basique: false, professionnel: true, entreprise: true },
    { name: 'Projets pratiques', basique: false, professionnel: true, entreprise: true },
    { name: 'Mentorat individuel', basique: false, professionnel: false, entreprise: true },
    { name: 'Tableau de bord équipe', basique: false, professionnel: false, entreprise: true },
    { name: 'Analyses avancées', basique: false, professionnel: false, entreprise: true },
    { name: 'API d\'intégration', basique: false, professionnel: false, entreprise: true }
  ];

  // FAQ
  faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez améliorer ou réduire votre plan à tout moment. Les changements prennent effet immédiatement.'
    },
    {
      question: 'Y a-t-il un engagement ?',
      answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment sans frais.'
    },
    {
      question: 'Proposez-vous un essai gratuit ?',
      answer: 'Oui, nous offrons un essai gratuit de 14 jours pour tous nos plans. Aucune carte de crédit requise.'
    },
    {
      question: 'Les prix sont-ils TTC ?',
      answer: 'Oui, tous les prix affichés sont TTC. La TVA est incluse dans le montant affiché.'
    },
    {
      question: 'Puis-je obtenir un remboursement ?',
      answer: 'Nous offrons une garantie satisfait ou remboursé de 30 jours pour tous nos abonnements.'
    },
    {
      question: 'Support technique inclus ?',
      answer: 'Oui, tous les plans incluent un support technique. Le support prioritaire est disponible sur les plans Pro et Entreprise.'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectPlan(plan: string): void {
    console.log(`Plan sélectionné: ${plan}`);
    // Ici vous pouvez rediriger vers la page de paiement
    // this.router.navigate(['/checkout'], { queryParams: { plan: plan, cycle: this.billingCycle } });
    
    // Pour l'instant, on affiche une alerte
    alert(`Vous avez sélectionné le plan ${plan} (${this.billingCycle})`);
  }

  scrollToPlans(): void {
    const plansSection = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  contactSales(): void {
    // Redirection vers la page de contact ou ouverture d'un modal
    alert('Redirection vers le service commercial...');
  }

}
