import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacePrincipaleDePaiementComponent } from './interface-principale-de-paiement.component';

describe('InterfacePrincipaleDePaiementComponent', () => {
  let component: InterfacePrincipaleDePaiementComponent;
  let fixture: ComponentFixture<InterfacePrincipaleDePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfacePrincipaleDePaiementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfacePrincipaleDePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
