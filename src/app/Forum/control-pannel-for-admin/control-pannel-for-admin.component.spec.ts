import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPannelForAdminComponent } from './control-pannel-for-admin.component';

describe('ControlPannelForAdminComponent', () => {
  let component: ControlPannelForAdminComponent;
  let fixture: ComponentFixture<ControlPannelForAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlPannelForAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlPannelForAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
