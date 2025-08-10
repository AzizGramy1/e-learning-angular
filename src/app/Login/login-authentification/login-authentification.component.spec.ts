import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuthentificationComponent } from './login-authentification.component';

describe('LoginAuthentificationComponent', () => {
  let component: LoginAuthentificationComponent;
  let fixture: ComponentFixture<LoginAuthentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAuthentificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAuthentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
