import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditFormulaireComponent } from './course-edit-formulaire.component';

describe('CourseEditFormulaireComponent', () => {
  let component: CourseEditFormulaireComponent;
  let fixture: ComponentFixture<CourseEditFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseEditFormulaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEditFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
