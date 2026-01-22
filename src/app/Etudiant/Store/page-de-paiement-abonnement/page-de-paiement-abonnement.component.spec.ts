import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageDePaiementAbonnementComponent } from './page-de-paiement-abonnement.component';

describe('PageDePaiementAbonnementComponent', () => {
  let component: PageDePaiementAbonnementComponent;
  let fixture: ComponentFixture<PageDePaiementAbonnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageDePaiementAbonnementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageDePaiementAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
