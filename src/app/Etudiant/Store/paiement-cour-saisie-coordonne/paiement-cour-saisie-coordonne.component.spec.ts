import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCourSaisieCoordonneComponent } from './paiement-cour-saisie-coordonne.component';

describe('PaiementCourSaisieCoordonneComponent', () => {
  let component: PaiementCourSaisieCoordonneComponent;
  let fixture: ComponentFixture<PaiementCourSaisieCoordonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementCourSaisieCoordonneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementCourSaisieCoordonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
