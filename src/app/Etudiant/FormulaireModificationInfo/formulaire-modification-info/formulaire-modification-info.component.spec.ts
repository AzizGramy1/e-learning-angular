import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireModificationInfoComponent } from './formulaire-modification-info.component';

describe('FormulaireModificationInfoComponent', () => {
  let component: FormulaireModificationInfoComponent;
  let fixture: ComponentFixture<FormulaireModificationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireModificationInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireModificationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
