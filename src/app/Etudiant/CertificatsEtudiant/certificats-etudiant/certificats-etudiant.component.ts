import { AfterViewInit, Component, ElementRef, QueryList, Renderer2, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-certificats-etudiant',
  templateUrl: './certificats-etudiant.component.html',
  styleUrls: ['./certificats-etudiant.component.scss']
})
export class CertificatsEtudiantComponent implements AfterViewInit {
  stats = {
    certificates: 7,
    level: 'Intermédiaire',
    progress: '65%',
    nextGoal: 'Expert'
  };

  certificates = [
    {
      title: 'Maîtrise de JavaScript',
      category: 'Développement',
      categoryClass: 'bg-blue-900 bg-opacity-50 text-blue-400',
      badgeClass: 'bg-gradient-to-r from-blue-600 to-blue-800',
      level: 'Niveau avancé',
      description: 'Certificat obtenu pour la complétion du cours avancé de JavaScript avec une note de 92%',
      date: '15 juin 2024',
      hours: '32 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: true,
      ribbon: 'Excellent'
    },
    {
      title: 'Data Science Fondamentale',
      category: 'Data Science',
      categoryClass: 'bg-green-900 bg-opacity-50 text-green-400',
      badgeClass: 'bg-gradient-to-r from-green-600 to-green-800',
      level: 'Niveau intermédiaire',
      description: 'Certificat obtenu pour la complétion du cours fondamental de Data Science avec une note de 85%',
      date: '2 mai 2024',
      hours: '24 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: false,
      ribbon: 'Honorable'
    },
    {
      title: 'UI/UX Design Moderne',
      category: 'Design',
      categoryClass: 'bg-purple-900 bg-opacity-50 text-purple-400',
      badgeClass: 'bg-gradient-to-r from-purple-600 to-purple-800',
      level: 'Niveau avancé',
      description: 'Certificat obtenu pour la complétion du cours avancé de design UI/UX avec une note de 96%',
      date: '12 avril 2024',
      hours: '18 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: false,
      ribbon: null
    },
    {
      title: 'Fondamentaux Sécurité',
      category: 'Cybersécurité',
      categoryClass: 'bg-red-900 bg-opacity-50 text-red-400',
      badgeClass: 'bg-gradient-to-r from-red-600 to-red-800',
      level: 'Niveau débutant',
      description: 'Certificat obtenu pour la complétion du cours d\'introduction à la cybersécurité avec une note de 88%',
      date: '30 mars 2024',
      hours: '16 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: false,
      ribbon: 'Nouveau'
    },
    {
      title: 'AWS Essentials',
      category: 'Cloud',
      categoryClass: 'bg-indigo-900 bg-opacity-50 text-indigo-400',
      badgeClass: 'bg-gradient-to-r from-indigo-600 to-indigo-800',
      level: 'Niveau intermédiaire',
      description: 'Certificat obtenu pour la complétion du cours sur les fondamentaux AWS avec une note de 89%',
      date: '15 février 2024',
      hours: '28 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: false,
      ribbon: null
    },
    {
      title: 'Marketing Digital',
      category: 'Marketing',
      categoryClass: 'bg-yellow-900 bg-opacity-50 text-yellow-400',
      badgeClass: 'bg-gradient-to-r from-yellow-600 to-yellow-800',
      level: 'Niveau avancé',
      description: 'Certificat obtenu pour la complétion du cours avancé de marketing digital avec une note de 94%',
      date: '5 janvier 2024',
      hours: '20 heures',
      stars: ['fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star', 'fas fa-star'],
      halfStar: false,
      ribbon: 'Top 10%'
    }
  ];

  currentPage = 1;
  pages = [1, 2, 3];
  
  @ViewChildren('certificateCard') certificateCards!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.certificateCards.forEach((card) => {
      this.renderer.listen(card.nativeElement, 'mouseenter', () => {
        this.renderer.addClass(card.nativeElement, 'shadow-lg');
      });
      this.renderer.listen(card.nativeElement, 'mouseleave', () => {
        this.renderer.removeClass(card.nativeElement, 'shadow-lg');
      });
    });
  }

  viewCertificate(certificate: any) {
    alert(`Viewing certificate: ${certificate.title}`);
    // Placeholder for viewing certificate details (e.g., navigate to a details page)
  }

  downloadCertificate(certificate: any) {
    // Placeholder for generating PDF (LaTeX generation below)
    console.log(`Generating PDF for certificate: ${certificate.title}`);
    // Call a method to generate LaTeX and trigger download
  }

  shareCertificate(certificate: any) {
    alert(`Sharing certificate: ${certificate.title}`);
    // Placeholder for sharing functionality (e.g., generate shareable link)
  }

  exportAllCertificates() {
    alert('Exporting all certificates as PDF');
    // Placeholder for exporting all certificates
  }

  shareProfile() {
    alert('Sharing profile');
    // Placeholder for sharing profile functionality
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}