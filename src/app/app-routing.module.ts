import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LoginAuthentificationComponent } from './Login/login-authentification/login-authentification.component';
import { DashboardAdminComponent } from './Dashboards/dashboard-admin/dashboard-admin.component';
import { DashboardEtudiantComponent } from './Dashboards/dashboard-etudiant/dashboard-etudiant.component';
import { DashboardEnseignantComponent } from './Dashboards/dashboard-enseignant/dashboard-enseignant.component';
import { ProfilComponent } from './Etudiant/Profil/profil/profil.component';
import { CertificatsEtudiantComponent } from './Etudiant/CertificatsEtudiant/certificats-etudiant/certificats-etudiant.component';
import { DiscussionsAllUsersComponent } from './Discussions/discussions-all-users/discussions-all-users.component';

const routes: Routes = [
  // Route publique
  { path: 'welcomePage', component: WelcomePageComponent },
  { path: 'loginAuthenfication', component: LoginAuthentificationComponent },

  //  Dashboard par session - Routes protégées (nécessitent une authentification)  
  { path: 'admin-dashboard', component: DashboardAdminComponent },
  { path: 'etudiant-dashboard', component: DashboardEtudiantComponent },
  { path: 'FormateurDashboard', component: DashboardEnseignantComponent },
  {path:'login', component: LoginAuthentificationComponent},  

  // Route pour le profil de l'étudiant
  { path: 'Etudiant/Profil-detail', component: ProfilComponent },
  { path: 'Etudiant/certificatsView', component: CertificatsEtudiantComponent },
  { path: 'Etudiant/DiscussionAllUser', component: DiscussionsAllUsersComponent },








  // Redirection par défaut (racine vers welcomePage)
  { path: '', redirectTo: '/welcomePage', pathMatch: 'full' },

  // Page 404 (toutes les autres routes non définies)

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})




export class AppRoutingModule { }
