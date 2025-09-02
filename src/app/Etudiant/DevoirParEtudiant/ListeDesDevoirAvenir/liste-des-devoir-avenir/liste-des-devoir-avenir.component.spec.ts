import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDesDevoirAvenirComponent } from './liste-des-devoir-avenir.component';

describe('ListeDesDevoirAvenirComponent', () => {
  let component: ListeDesDevoirAvenirComponent;
  let fixture: ComponentFixture<ListeDesDevoirAvenirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeDesDevoirAvenirComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDesDevoirAvenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
