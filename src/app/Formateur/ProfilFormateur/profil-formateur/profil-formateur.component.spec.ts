import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFormateurComponent } from './profil-formateur.component';

describe('ProfilFormateurComponent', () => {
  let component: ProfilFormateurComponent;
  let fixture: ComponentFixture<ProfilFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
