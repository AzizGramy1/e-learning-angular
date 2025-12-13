import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireComplementaireComponent } from './formulaire-complementaire.component';

describe('FormulaireComplementaireComponent', () => {
  let component: FormulaireComplementaireComponent;
  let fixture: ComponentFixture<FormulaireComplementaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireComplementaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireComplementaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
