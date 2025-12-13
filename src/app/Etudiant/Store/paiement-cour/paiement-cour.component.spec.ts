import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementCourComponent } from './paiement-cour.component';

describe('PaiementCourComponent', () => {
  let component: PaiementCourComponent;
  let fixture: ComponentFixture<PaiementCourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaiementCourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
