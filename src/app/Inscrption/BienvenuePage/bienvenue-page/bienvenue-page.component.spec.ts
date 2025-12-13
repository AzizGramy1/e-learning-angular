import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienvenuePageComponent } from './bienvenue-page.component';

describe('BienvenuePageComponent', () => {
  let component: BienvenuePageComponent;
  let fixture: ComponentFixture<BienvenuePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BienvenuePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BienvenuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
