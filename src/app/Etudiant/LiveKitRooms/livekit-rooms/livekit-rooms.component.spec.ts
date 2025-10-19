import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivekitRoomsComponent } from './livekit-rooms.component';

describe('LivekitRoomsComponent', () => {
  let component: LivekitRoomsComponent;
  let fixture: ComponentFixture<LivekitRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivekitRoomsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivekitRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
