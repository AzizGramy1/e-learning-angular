import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionIndexComponent } from './reunion-index.component';

describe('ReunionIndexComponent', () => {
  let component: ReunionIndexComponent;
  let fixture: ComponentFixture<ReunionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
