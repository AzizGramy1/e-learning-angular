import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoirParEtudiantComponent } from './devoir-par-etudiant.component';

describe('DevoirParEtudiantComponent', () => {
  let component: DevoirParEtudiantComponent;
  let fixture: ComponentFixture<DevoirParEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoirParEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoirParEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
