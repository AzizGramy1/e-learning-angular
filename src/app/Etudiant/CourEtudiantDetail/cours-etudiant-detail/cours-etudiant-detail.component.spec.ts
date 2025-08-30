import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursEtudiantDetailComponent } from './cours-etudiant-detail.component';

describe('CoursEtudiantDetailComponent', () => {
  let component: CoursEtudiantDetailComponent;
  let fixture: ComponentFixture<CoursEtudiantDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursEtudiantDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursEtudiantDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
