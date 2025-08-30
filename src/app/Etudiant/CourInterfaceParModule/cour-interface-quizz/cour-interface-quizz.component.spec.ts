import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourInterfaceQuizzComponent } from './cour-interface-quizz.component';

describe('CourInterfaceQuizzComponent', () => {
  let component: CourInterfaceQuizzComponent;
  let fixture: ComponentFixture<CourInterfaceQuizzComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourInterfaceQuizzComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourInterfaceQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
