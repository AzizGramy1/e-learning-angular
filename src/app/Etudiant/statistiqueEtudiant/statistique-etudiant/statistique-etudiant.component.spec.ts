import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueEtudiantComponent } from './statistique-etudiant.component';

describe('StatistiqueEtudiantComponent', () => {
  let component: StatistiqueEtudiantComponent;
  let fixture: ComponentFixture<StatistiqueEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiqueEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
