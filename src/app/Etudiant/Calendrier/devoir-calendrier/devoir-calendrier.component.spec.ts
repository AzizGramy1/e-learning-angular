import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirCalendrierComponent } from './devoir-calendrier.component';

describe('DevoirCalendrierComponent', () => {
  let component: DevoirCalendrierComponent;
  let fixture: ComponentFixture<DevoirCalendrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirCalendrierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoirCalendrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
