import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatsEtudiantComponent } from './certificats-etudiant.component';

describe('CertificatsEtudiantComponent', () => {
  let component: CertificatsEtudiantComponent;
  let fixture: ComponentFixture<CertificatsEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatsEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatsEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
