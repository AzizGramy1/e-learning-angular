import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumParUserComponent } from './forum-par-user.component';

describe('ForumParUserComponent', () => {
  let component: ForumParUserComponent;
  let fixture: ComponentFixture<ForumParUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumParUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumParUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
