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
import { CoursEtudiantComponent } from './Etudiant/CoursEtudiant/cours-etudiant/cours-etudiant.component';
import { ReunionEtudiantComponent } from './Etudiant/ReunionEtudion/reunion-etudiant/reunion-etudiant.component';
import { ReunionMenuEtudiantComponent } from './Etudiant/ReunionMenuEtudiant/reunion-menu-etudiant/reunion-menu-etudiant.component';
import { ReunionMeetingComponent } from './Etudiant/ReunionMeeting/reunion-meeting/reunion-meeting.component';
import { CoursEtudiantDetailComponent } from './Etudiant/CourEtudiantDetail/cours-etudiant-detail/cours-etudiant-detail.component';
import { CourInterfaceParModuleComponent } from './Etudiant/CourInterfaceParModule/cour-interface-par-module/cour-interface-par-module.component';
import { CourInterfaceQuizzComponent } from './Etudiant/CourInterfaceParModule/cour-interface-quizz/cour-interface-quizz.component';
import { AbonnementEtudiantComponent } from './Etudiant/AbonnementEtudiant/abonnement-etudiant/abonnement-etudiant.component';
import { InterfaceCommuneDePaiementComponentimplements } from './Paiement/interfaceCommuneDePaiement/interface-commune-de-paiement/interface-commune-de-paiement.component';
import { ForumParUserComponent } from './Forum/ForumParUser/forum-par-user/forum-par-user.component';
import { DevoirParEtudiantComponent } from './Etudiant/DevoirParEtudiant/devoir-par-etudiant/devoir-par-etudiant.component';
import { ListeDesDevoirAvenirComponent } from './Etudiant/DevoirParEtudiant/ListeDesDevoirAvenir/liste-des-devoir-avenir/liste-des-devoir-avenir.component';
import { DetailsDevoirAvecRenduComponent } from './Etudiant/DevoirParEtudiant/details-devoir-avec-rendu/details-devoir-avec-rendu.component';
import { ExploreMenuComponent } from './Etudiant/Explore/explore-menu/explore-menu.component';
import { DevoirCalendrierComponent } from './Etudiant/Calendrier/devoir-calendrier/devoir-calendrier.component';
import { UnityComponentComponent } from './Etudiant/CourInterfaceParModule/unity-component/unity-component.component';
import { CourInterfaceQuizzWithVideoComponent } from './Etudiant/CourInterfaceParModule/cour-interface-quizz-with-video/cour-interface-quizz-with-video.component';
import { ReunionDashboardComponent } from './Formateur/ReunionDashboard/reunion-dashboard/reunion-dashboard.component';
import { ReunionListComponent } from './Formateur/ReunionList/reunion-list/reunion-list.component';
import { VideoCallcomponentComponent } from './Etudiant/ReunionMenuEtudiant/video-callcomponent/video-callcomponent.component';
import { LivekitRoomsComponent } from './Etudiant/LiveKitRooms/livekit-rooms/livekit-rooms.component';
import { RepLivekitRoomComponent } from './Etudiant/Pre-livekit-room/rep-livekit-room/rep-livekit-room.component';
import { InscrptionFormulaireComponent } from './Inscrption/inscrption-formulaire/inscrption-formulaire.component';
import { BienvenuePageComponent } from './Inscrption/BienvenuePage/bienvenue-page/bienvenue-page.component';
import { FormulaireComplementaireComponent } from './Inscrption/FormulaireComplementaire/formulaire-complementaire/formulaire-complementaire.component';
import { PageApresFormulaireComponent } from './Etudiant/PageApresFormulaire/page-apres-formulaire/page-apres-formulaire.component';
import { StoreComponent } from './Etudiant/Store/store/store.component';
import { StatistiqueEtudiantComponent } from './Etudiant/statistiqueEtudiant/statistique-etudiant/statistique-etudiant.component';
import { DetailCourComponent } from './Etudiant/Store/DetailCour/detail-cour/detail-cour.component';
import { CalendrierComponent } from './Etudiant/Calendrier/calendrier/calendrier.component';
import { CalendrierEtudiantComponent } from './Calendrier/calendrierEtudiant/calendrier-etudiant/calendrier-etudiant.component';
import { PaiementCourComponent } from './Etudiant/Store/paiement-cour/paiement-cour.component';
import { PaiementCourSaisiecoordonneComponent } from './Etudiant/Store/paiement-cour-saisiecoordonne/paiement-cour-saisiecoordonne.component';
import { CourseEditFormulaireComponent } from './Formateur/CourseEditFormulaire/course-edit-formulaire/course-edit-formulaire.component';
import { FormulaireCreationCourseComponent } from './Formateur/FormulaireCreationCourse/formulaire-creation-course/formulaire-creation-course.component';
import { DevoirAddFormulaireComponent } from './Formateur/DevoirAddFormulaire/devoir-add-formulaire/devoir-add-formulaire.component';
import { DevoirEditAffichageComponent } from './Formateur/DevoirEditAffichage/devoir-edit-affichage/devoir-edit-affichage.component';

const routes: Routes = [
  // Route publique
  { path: 'welcomePage', component: WelcomePageComponent },
  { path: 'loginAuthenfication', component: LoginAuthentificationComponent },

  //  Dashboard par session - Routes protégées (nécessitent une authentification)  
  { path: 'admin-dashboard', component: DashboardAdminComponent },
  { path: 'etudiant-dashboard', component: DashboardEtudiantComponent },
  { path: 'FormateurDashboard', component: DashboardEnseignantComponent },
  {path:'login', component: LoginAuthentificationComponent}, 
  
  
  {path:'SignUp', component: InscrptionFormulaireComponent}, 
  {path:'BienvenuePage', component: BienvenuePageComponent}, 
  {path:'formulaireProfil', component: FormulaireComplementaireComponent},
  {path:'BienvenuePage2', component: PageApresFormulaireComponent},  
 









  // Route pour le profil de l'étudiant
  { path: 'Etudiant/Profil-detail', component: ProfilComponent },
  { path: 'Etudiant/Cours', component: CoursEtudiantComponent },
  { path: 'Etudiant/Cours/detailsCour/:id', component: CoursEtudiantDetailComponent },
  { path: 'Etudiant/Cours/detailsCour/Module', component: CourInterfaceParModuleComponent },
  { path: 'Etudiant/Cours/detailsCour/Module/Quizz', component: CourInterfaceQuizzComponent },
  { path: 'Etudiant/Cours/detailsCour/Module/QuizzVideo', component: CourInterfaceQuizzComponent },
  






 // Abonnements en general
  { path: 'Paiement', component: InterfaceCommuneDePaiementComponentimplements },

  // Abonnement de 'e-learning'
  { path: 'Etudiant/Abonnement', component: AbonnementEtudiantComponent },
  { path: 'Etudiant/Abonnement/PaiementCour', component: PaiementCourComponent },
  { path: 'Etudiant/Abonnement/PaiementCour/saisieCoordonné', component: PaiementCourSaisiecoordonneComponent },





 // Forum en general (par User mais aucune distinction entre etudiant, formateur ou admin)

  { path: 'Forum/Abonnement', component: ForumParUserComponent },



  // Devoir de l'etudiant


    { path: 'Etudiant/Devoir', component: DevoirParEtudiantComponent },
    { path: 'Etudiant/Devoir/Avenir', component:ListeDesDevoirAvenirComponent },
    { path: 'devoirs/:id/details', component: DetailsDevoirAvecRenduComponent },
    { path: 'devoirs/quizzVideo', component: CourInterfaceQuizzWithVideoComponent },
    { path: 'devoirs/:id/QuizzEtudiant', component: CourInterfaceQuizzComponent },
    { path: 'devoirs/Unity', component: UnityComponentComponent },





  // Explore Menu
    { path: 'Etudiant/Explore', component: ExploreMenuComponent },
        { path: 'Etudiant/Explore/Course', component: StoreComponent },
                  { path: 'Etudiant/Explore/Course/detailsCours', component: DetailCourComponent },





  // Calendrier des devoirs

    { path: 'Etudiant-Calendrier', component: DevoirCalendrierComponent },
    { path: 'calendrier', component: CalendrierEtudiantComponent },

    







  { path: 'Etudiant/certificatsView', component: CertificatsEtudiantComponent },
  { path: 'Etudiant/DiscussionAllUser', component: DiscussionsAllUsersComponent },

  { path: 'Etudiant/Reunion/reunionDetails', component: ReunionEtudiantComponent },
  { path: 'Etudiant/Reunions', component: ReunionMenuEtudiantComponent },
  { path: 'Etudiant/Reunion/VideoCall', component: VideoCallcomponentComponent },
  { path: 'Etudiant/Reunion/RommsList', component: LivekitRoomsComponent },
  { path: 'pre-room', component: RepLivekitRoomComponent },

  
  { path: 'Etudiant/Reunions/accessMeeting', component: ReunionMeetingComponent },





  { path: 'Formateur/ReunionDash', component: ReunionDashboardComponent },
  { path: 'Formateur/ReunionList', component: ReunionListComponent },
  { path: 'Formateur/Course/Formulaire/Edit/:id', component: CourseEditFormulaireComponent },
  { path: 'formulaire', component: FormulaireCreationCourseComponent },
  { path: 'formulaireAdd/EditDevoir', component: DevoirAddFormulaireComponent },
// Pour afficher un devoir spécifique
{ path: 'devoir/:id', component: DevoirEditAffichageComponent } ,











          { path: 'Etudiant/Perfomances', component: StatistiqueEtudiantComponent },





  // Redirection par défaut (racine vers welcomePage)
  { path: '', redirectTo: '/welcomePage', pathMatch: 'full' },

  // Page 404 (toutes les autres routes non définies)

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})




export class AppRoutingModule { }
