import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirEditAffichageComponent } from './devoir-edit-affichage.component';

describe('DevoirEditAffichageComponent', () => {
  let component: DevoirEditAffichageComponent;
  let fixture: ComponentFixture<DevoirEditAffichageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirEditAffichageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoirEditAffichageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
