import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionFormulaireComponent } from './reunion-formulaire.component';

describe('ReunionFormulaireComponent', () => {
  let component: ReunionFormulaireComponent;
  let fixture: ComponentFixture<ReunionFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionFormulaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
