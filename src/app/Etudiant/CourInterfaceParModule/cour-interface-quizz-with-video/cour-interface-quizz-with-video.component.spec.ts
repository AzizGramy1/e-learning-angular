import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourInterfaceQuizzWithVideoComponent } from './cour-interface-quizz-with-video.component';

describe('CourInterfaceQuizzWithVideoComponent', () => {
  let component: CourInterfaceQuizzWithVideoComponent;
  let fixture: ComponentFixture<CourInterfaceQuizzWithVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourInterfaceQuizzWithVideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourInterfaceQuizzWithVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
