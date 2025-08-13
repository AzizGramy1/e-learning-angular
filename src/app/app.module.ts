import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllTemplateComponent } from './all-template/all-template.component';
import { NavbarComponent } from './FrontOffice/navbar/navbar.component';
import { SidebarComponent } from './FrontOffice/sidebar/sidebar.component';
import { FooterComponent } from './FrontOffice/footer/footer.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LoginAuthentificationComponent } from './Login/login-authentification/login-authentification.component';
import { DashboardEtudiantComponent } from './Dashboards/dashboard-etudiant/dashboard-etudiant.component';
import { DashboardAdminComponent } from './Dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardEnseignantComponent } from './Dashboards/dashboard-enseignant/dashboard-enseignant.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AllTemplateComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    WelcomePageComponent,
    LoginAuthentificationComponent,
    DashboardEtudiantComponent,
    DashboardAdminComponent,
    DashboardEnseignantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
