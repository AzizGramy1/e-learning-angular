import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireCreationCourseComponent } from './formulaire-creation-course.component';

describe('FormulaireCreationCourseComponent', () => {
  let component: FormulaireCreationCourseComponent;
  let fixture: ComponentFixture<FormulaireCreationCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireCreationCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireCreationCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
