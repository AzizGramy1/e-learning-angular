import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsDevoirAvecRenduComponent } from './details-devoir-avec-rendu.component';

describe('DetailsDevoirAvecRenduComponent', () => {
  let component: DetailsDevoirAvecRenduComponent;
  let fixture: ComponentFixture<DetailsDevoirAvecRenduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsDevoirAvecRenduComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsDevoirAvecRenduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
