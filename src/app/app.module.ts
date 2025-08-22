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
import { ProfilComponent } from './Etudiant/Profil/profil/profil.component';
import { CoursEtudiantComponent } from './Etudiant/CoursEtudiant/cours-etudiant/cours-etudiant.component';
import { CertificatsEtudiantComponent } from './Etudiant/CertificatsEtudiant/certificats-etudiant/certificats-etudiant.component';
import { MenuAdminComponent } from './Admin/MenuAdmin/menu-admin/menu-admin.component';
import { ProfilFormateurComponent } from './Formateur/ProfilFormateur/profil-formateur/profil-formateur.component';
import { FormulaireInscriptionComponent } from './Inscription/formulaire-inscription/formulaire-inscription.component';
import { DiscussionsAllUsersComponent } from './Discussions/discussions-all-users/discussions-all-users.component';
import { NavbarEtudiantComponent } from './Etudiant/NavbarEtudiant/navbar-etudiant/navbar-etudiant.component';
import { FormulaireModificationInfoComponent } from './Etudiant/FormulaireModificationInfo/formulaire-modification-info/formulaire-modification-info.component';
import { ReunionEtudiantComponent } from './Etudiant/ReunionEtudion/reunion-etudiant/reunion-etudiant.component';
import { FaireReclamationComponent } from './Etudiant/Reclamation/faire-reclamation/faire-reclamation.component';

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
    DashboardEnseignantComponent,
    ProfilComponent,
    CoursEtudiantComponent,
    CertificatsEtudiantComponent,
    MenuAdminComponent,
    ProfilFormateurComponent,
    FormulaireInscriptionComponent,
    DiscussionsAllUsersComponent,
    NavbarEtudiantComponent,
    FormulaireModificationInfoComponent,
    ReunionEtudiantComponent,
    FaireReclamationComponent
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
