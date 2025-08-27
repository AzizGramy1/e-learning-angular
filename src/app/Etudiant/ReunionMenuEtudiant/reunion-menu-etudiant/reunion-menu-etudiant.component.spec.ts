import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReunionMenuEtudiantComponent } from './reunion-menu-etudiant.component';

describe('ReunionMenuEtudiantComponent', () => {
  let component: ReunionMenuEtudiantComponent;
  let fixture: ComponentFixture<ReunionMenuEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReunionMenuEtudiantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReunionMenuEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
