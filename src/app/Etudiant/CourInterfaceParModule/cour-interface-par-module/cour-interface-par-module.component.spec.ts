import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourInterfaceParModuleComponent } from './cour-interface-par-module.component';

describe('CourInterfaceParModuleComponent', () => {
  let component: CourInterfaceParModuleComponent;
  let fixture: ComponentFixture<CourInterfaceParModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourInterfaceParModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourInterfaceParModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
