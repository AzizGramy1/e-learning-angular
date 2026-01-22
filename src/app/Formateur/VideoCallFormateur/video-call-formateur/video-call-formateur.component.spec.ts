import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallFormateurComponent } from './video-call-formateur.component';

describe('VideoCallFormateurComponent', () => {
  let component: VideoCallFormateurComponent;
  let fixture: ComponentFixture<VideoCallFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCallFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
