import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionEtudiantComponent } from './reunion-etudiant.component';

describe('ReunionEtudiantComponent', () => {
  let component: ReunionEtudiantComponent;
  let fixture: ComponentFixture<ReunionEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
