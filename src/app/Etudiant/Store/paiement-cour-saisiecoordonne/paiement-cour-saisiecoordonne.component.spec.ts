import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCourSaisiecoordonneComponent } from './paiement-cour-saisiecoordonne.component';

describe('PaiementCourSaisiecoordonneComponent', () => {
  let component: PaiementCourSaisiecoordonneComponent;
  let fixture: ComponentFixture<PaiementCourSaisiecoordonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementCourSaisiecoordonneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementCourSaisiecoordonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
