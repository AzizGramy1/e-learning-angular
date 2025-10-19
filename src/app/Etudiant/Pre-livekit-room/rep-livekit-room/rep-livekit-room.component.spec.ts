import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepLivekitRoomComponent } from './rep-livekit-room.component';

describe('RepLivekitRoomComponent', () => {
  let component: RepLivekitRoomComponent;
  let fixture: ComponentFixture<RepLivekitRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepLivekitRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepLivekitRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
