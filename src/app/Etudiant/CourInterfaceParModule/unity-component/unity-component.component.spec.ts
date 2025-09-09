import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnityComponentComponent } from './unity-component.component';

describe('UnityComponentComponent', () => {
  let component: UnityComponentComponent;
  let fixture: ComponentFixture<UnityComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnityComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnityComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
