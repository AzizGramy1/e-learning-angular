import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirAddFormulaireComponent } from './devoir-add-formulaire.component';

describe('DevoirAddFormulaireComponent', () => {
  let component: DevoirAddFormulaireComponent;
  let fixture: ComponentFixture<DevoirAddFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirAddFormulaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoirAddFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
