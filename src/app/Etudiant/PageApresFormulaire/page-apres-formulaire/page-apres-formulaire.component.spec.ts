import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageApresFormulaireComponent } from './page-apres-formulaire.component';

describe('PageApresFormulaireComponent', () => {
  let component: PageApresFormulaireComponent;
  let fixture: ComponentFixture<PageApresFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageApresFormulaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageApresFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
