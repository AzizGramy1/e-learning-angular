import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarEtudiantComponent } from './navbar-etudiant.component';

describe('NavbarEtudiantComponent', () => {
  let component: NavbarEtudiantComponent;
  let fixture: ComponentFixture<NavbarEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
