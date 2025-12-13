import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscrptionFormulaireComponent } from './inscrption-formulaire.component';

describe('InscrptionFormulaireComponent', () => {
  let component: InscrptionFormulaireComponent;
  let fixture: ComponentFixture<InscrptionFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscrptionFormulaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscrptionFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
