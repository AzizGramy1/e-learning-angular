import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCoursComponent } from './paiement-cours.component';

describe('PaiementCoursComponent', () => {
  let component: PaiementCoursComponent;
  let fixture: ComponentFixture<PaiementCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementCoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
