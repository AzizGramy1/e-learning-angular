import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunioCheckSettingsComponent } from './reunio-check-settings.component';

describe('ReunioCheckSettingsComponent', () => {
  let component: ReunioCheckSettingsComponent;
  let fixture: ComponentFixture<ReunioCheckSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunioCheckSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunioCheckSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
