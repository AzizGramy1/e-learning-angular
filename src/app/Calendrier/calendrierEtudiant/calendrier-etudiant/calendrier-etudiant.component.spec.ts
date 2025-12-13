import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierEtudiantComponent } from './calendrier-etudiant.component';

describe('CalendrierEtudiantComponent', () => {
  let component: CalendrierEtudiantComponent;
  let fixture: ComponentFixture<CalendrierEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendrierEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendrierEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
