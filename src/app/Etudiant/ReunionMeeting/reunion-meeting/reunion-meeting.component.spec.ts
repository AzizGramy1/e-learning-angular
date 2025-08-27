import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionMeetingComponent } from './reunion-meeting.component';

describe('ReunionMeetingComponent', () => {
  let component: ReunionMeetingComponent;
  let fixture: ComponentFixture<ReunionMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
