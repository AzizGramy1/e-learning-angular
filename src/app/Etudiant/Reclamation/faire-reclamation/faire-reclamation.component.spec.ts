import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaireReclamationComponent } from './faire-reclamation.component';

describe('FaireReclamationComponent', () => {
  let component: FaireReclamationComponent;
  let fixture: ComponentFixture<FaireReclamationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaireReclamationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaireReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
