import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursEtudiantComponent } from './cours-etudiant.component';

describe('CoursEtudiantComponent', () => {
  let component: CoursEtudiantComponent;
  let fixture: ComponentFixture<CoursEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
