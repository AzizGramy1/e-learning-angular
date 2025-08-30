import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceCommuneDePaiementComponent } from './interface-commune-de-paiement.component';

describe('InterfaceCommuneDePaiementComponent', () => {
  let component: InterfaceCommuneDePaiementComponent;
  let fixture: ComponentFixture<InterfaceCommuneDePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceCommuneDePaiementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceCommuneDePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
