import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCallcomponentComponent } from './video-callcomponent.component';

describe('VideoCallcomponentComponent', () => {
  let component: VideoCallcomponentComponent;
  let fixture: ComponentFixture<VideoCallcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoCallcomponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCallcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
