import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CertificatService } from 'src/app/Service/Certificat/certificat.service';

type UICertificateCard = {
  id: number;
  title: string;
  category: string;
  categoryClass: string;
  badgeClass: string;
  level: string;
  description: string;
  date: string;         // affiché tel quel (ou pipe date côté template)
  hours: string;        // ex: "18 heures"
  stars: string[];      // icônes pleines
  halfStar: boolean;    // demi-étoile
  ribbon: string | null;
  // détails en plus
  code: string;
  note?: number | null;
  mention?: string | null;
  courseTitle?: string | null;
};

@Component({
  selector: 'app-certificats-etudiant',
  templateUrl: './certificats-etudiant.component.html',
  styleUrls: ['./certificats-etudiant.component.scss']
})
export class CertificatsEtudiantComponent implements OnInit, AfterViewInit {

  stats = {
    certificates: 0,
    level: 'N/A',
    progress: '0%',
    nextGoal: '—'
  };

  // ⚠️ maintenant ce tableau contient des "cards" prêtes pour le HTML
  certificates: UICertificateCard[] = [];
  errorMessage = '';

  currentPage = 1;
  pages: number[] = [];

  @ViewChildren('certificateCard') certificateCards!: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2,
    private certificatService: CertificatService
  ) {}

  ngOnInit(): void {
    this.loadUserCertificates();
  }

  ngAfterViewInit() {
    // attache au premier rendu
    this.attachHoverListeners();
    // ré-attache quand *ngFor* se met à jour (après la réponse HTTP)
    this.certificateCards.changes.subscribe(() => this.attachHoverListeners());
  }

  private attachHoverListeners() {
    if (!this.certificateCards) return;
    this.certificateCards.forEach((card) => {
      const el = card.nativeElement;
      const enter = this.renderer.listen(el, 'mouseenter', () => {
        this.renderer.addClass(el, 'shadow-lg');
      });
      const leave = this.renderer.listen(el, 'mouseleave', () => {
        this.renderer.removeClass(el, 'shadow-lg');
      });
      // Optionnel: si tu veux garder des refs pour enlever plus tard: stocke enter/leave
    });
  }

  // 🔹 Charger les certificats de l’utilisateur connecté
  loadUserCertificates() {
    this.certificatService.getMyCertificats().subscribe({
      next: (res) => {
        // backend peut renvoyer soit un array direct, soit {data: [...]}
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        this.certificates = list.map((c: any) => this.toCard(c));
        this.stats.certificates = this.certificates.length;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des certificats', err);
        this.errorMessage = err?.status === 401
          ? 'Vous devez être connecté pour voir vos certificats.'
          : 'Impossible de charger vos certificats.';
      }
    });
  }

  // 🧠 Mapper un certificat "API" -> carte UI (ton design)
  private toCard(c: any): UICertificateCard {
  const note = typeof c?.note === 'number' ? c.note : null;
  const courseTitle =
    c?.cours?.titre || c?.cours?.title || c?.cours?.name || 'Certificat';
  const level = this.levelFromNote(note);
  const starsInfo = this.starsFromNote(note);

  return {
    id: c?.id,
    title: courseTitle,
    category: c?.cours?.categorie?.name || 'Formation',
    categoryClass: this.categoryClassFromCategory(c?.cours?.categorie?.name),
    // 🔹 badge dépend du statut maintenant
    badgeClass: this.badgeClassFromStatus(c?.statut || c?.etat || 'inconnu'),
    level,
    description:
      c?.description_obtention ||
      `Certificat obtenu${note != null ? ` avec ${note}%` : ''}`,
    date: c?.date_emission || c?.date_émission || c?.created_at || '—',
    hours: c?.heures ? `${c.heures} heures` : '—',
    stars: starsInfo.stars,
    halfStar: starsInfo.half,
    ribbon: c?.mention || null,
    code: c?.code_certificat || '—',
    note,
    mention: c?.mention || null,
    courseTitle,
  };
}
  private levelFromNote(note: number | null): string {
    if (note == null) return 'Niveau débutant';
    if (note >= 85) return 'Niveau avancé';
    if (note >= 60) return 'Niveau intermédiaire';
    return 'Niveau débutant';
  }

  private starsFromNote(note: number | null): { stars: string[]; half: boolean } {
    if (note == null) return { stars: ['fas fa-star','fas fa-star','fas fa-star'], half: false };
    const outOf5 = Math.max(0, Math.min(5, (note / 100) * 5));
    const full = Math.floor(outOf5);
    const half = outOf5 - full >= 0.5;
    const stars = Array(full).fill('fas fa-star');
    return { stars, half };
  }

  private categoryClassFromCategory(cat?: string): string {
    // mapping simple -> mêmes couleurs que tes exemples
    switch ((cat || '').toLowerCase()) {
      case 'développement':
      case 'developpement':
        return 'bg-blue-900 bg-opacity-50 text-blue-400';
      case 'data science':
        return 'bg-green-900 bg-opacity-50 text-green-400';
      case 'design':
        return 'bg-purple-900 bg-opacity-50 text-purple-400';
      case 'cybersécurité':
      case 'cybersecurite':
        return 'bg-red-900 bg-opacity-50 text-red-400';
      case 'cloud':
        return 'bg-indigo-900 bg-opacity-50 text-indigo-400';
      case 'marketing':
        return 'bg-yellow-900 bg-opacity-50 text-yellow-400';
      default:
        return 'bg-gray-700 bg-opacity-50 text-gray-300';
    }
  }

  private badgeClassFromCategory(cat?: string): string {
    switch ((cat || '').toLowerCase()) {
      case 'développement':
      case 'developpement':
        return 'bg-gradient-to-r from-blue-600 to-blue-800';
      case 'data science':
        return 'bg-gradient-to-r from-green-600 to-green-800';
      case 'design':
        return 'bg-gradient-to-r from-purple-600 to-purple-800';
      case 'cybersécurité':
      case 'cybersecurite':
        return 'bg-gradient-to-r from-red-600 to-red-800';
      case 'cloud':
        return 'bg-gradient-to-r from-indigo-600 to-indigo-800';
      case 'marketing':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-800';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-800';
    }
  }


  // 🔹 Badge coloré selon le statut
private badgeClassFromStatus(status?: string): string {
  switch ((status || '').toLowerCase()) {
    case 'validé':
    case 'valide':
      return 'bg-green-600 text-white';
    case 'en attente':
    case 'pending':
      return 'bg-yellow-500 text-black';
    case 'refusé':
    case 'refuse':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }}

  // 🔹 Télécharger le PDF d’un certificat
  downloadCertificate(certificate: UICertificateCard) {
    this.certificatService.downloadCertificat(certificate.id).subscribe((file: Blob) => {
      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificat-${certificate.code}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Juste des placeholders conservés
  shareCertificate(certificate: UICertificateCard) {
    alert(`Sharing certificate: ${certificate.code}`);
  }

  exportAllCertificates() {
    alert('Exporter tous les certificats en PDF');
  }

  shareProfile() {
    alert('Partager mon profil');
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.pages.length) this.currentPage++;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }
}
