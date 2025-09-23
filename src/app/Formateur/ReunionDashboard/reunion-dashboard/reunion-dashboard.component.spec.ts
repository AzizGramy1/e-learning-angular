import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionDashboardComponent } from './reunion-dashboard.component';

describe('ReunionDashboardComponent', () => {
  let component: ReunionDashboardComponent;
  let fixture: ComponentFixture<ReunionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
