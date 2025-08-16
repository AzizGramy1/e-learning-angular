import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionsAllUsersComponent } from './discussions-all-users.component';

describe('DiscussionsAllUsersComponent', () => {
  let component: DiscussionsAllUsersComponent;
  let fixture: ComponentFixture<DiscussionsAllUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscussionsAllUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionsAllUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
