import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementEtudiantComponent } from './abonnement-etudiant.component';

describe('AbonnementEtudiantComponent', () => {
  let component: AbonnementEtudiantComponent;
  let fixture: ComponentFixture<AbonnementEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonnementEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbonnementEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
