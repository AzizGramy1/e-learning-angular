import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourInterfaceQuizzWithDocumentsComponent } from './cour-interface-quizz-with-documents.component';

describe('CourInterfaceQuizzWithDocumentsComponent', () => {
  let component: CourInterfaceQuizzWithDocumentsComponent;
  let fixture: ComponentFixture<CourInterfaceQuizzWithDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourInterfaceQuizzWithDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourInterfaceQuizzWithDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
