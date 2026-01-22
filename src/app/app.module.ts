import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';

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
import { DiscussionsAllUsersComponent } from './Discussions/discussions-all-users/discussions-all-users.component';
import { NavbarEtudiantComponent } from './Etudiant/NavbarEtudiant/navbar-etudiant/navbar-etudiant.component';
import { FormulaireModificationInfoComponent } from './Etudiant/FormulaireModificationInfo/formulaire-modification-info/formulaire-modification-info.component';
import { ReunionEtudiantComponent } from './Etudiant/ReunionEtudion/reunion-etudiant/reunion-etudiant.component';
import { FaireReclamationComponent } from './Etudiant/Reclamation/faire-reclamation/faire-reclamation.component';
import { ReunionMenuEtudiantComponent } from './Etudiant/ReunionMenuEtudiant/reunion-menu-etudiant/reunion-menu-etudiant.component';
import { CalendrierComponent } from './Etudiant/Calendrier/calendrier/calendrier.component';
import { ReunionMeetingComponent } from './Etudiant/ReunionMeeting/reunion-meeting/reunion-meeting.component';
import { CoursEtudiantDetailComponent } from './Etudiant/CourEtudiantDetail/cours-etudiant-detail/cours-etudiant-detail.component';
import { CourInterfaceParModuleComponent } from './Etudiant/CourInterfaceParModule/cour-interface-par-module/cour-interface-par-module.component';
import { CourInterfaceQuizzComponent } from './Etudiant/CourInterfaceParModule/cour-interface-quizz/cour-interface-quizz.component';
import { CourInterfaceQuizzWithVideoComponent } from './Etudiant/CourInterfaceParModule/cour-interface-quizz-with-video/cour-interface-quizz-with-video.component';
import { CourInterfaceQuizzWithDocumentsComponent } from './Etudiant/CourInterfaceParModule/cour-interface-quizz-with-documents/cour-interface-quizz-with-documents.component';
import { AbonnementEtudiantComponent } from './Etudiant/AbonnementEtudiant/abonnement-etudiant/abonnement-etudiant.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InterfaceCommuneDePaiementComponentimplements } from './Paiement/interfaceCommuneDePaiement/interface-commune-de-paiement/interface-commune-de-paiement.component';
import { InterfacePrincipaleDePaiementComponent } from './Forum/interfacePrincipaleDePaiement/interface-principale-de-paiement/interface-principale-de-paiement.component';
import { ForumParUserComponent } from './Forum/ForumParUser/forum-par-user/forum-par-user.component';
import { ControlPannelForAdminComponent } from './Forum/control-pannel-for-admin/control-pannel-for-admin.component';
import { DevoirParEtudiantComponent } from './Etudiant/DevoirParEtudiant/devoir-par-etudiant/devoir-par-etudiant.component';
import { ListeDesDevoirAvenirComponent } from './Etudiant/DevoirParEtudiant/ListeDesDevoirAvenir/liste-des-devoir-avenir/liste-des-devoir-avenir.component';
import { DetailsDevoirAvecRenduComponent } from './Etudiant/DevoirParEtudiant/details-devoir-avec-rendu/details-devoir-avec-rendu.component';
import { ExploreMenuComponent } from './Etudiant/Explore/explore-menu/explore-menu.component';
import { DevoirCalendrierComponent } from './Etudiant/Calendrier/devoir-calendrier/devoir-calendrier.component';
import { SharedModule } from "./Models/ShareModule";
import { UnityComponentComponent } from './Etudiant/CourInterfaceParModule/unity-component/unity-component.component';
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
import { CalendrierEtudiantComponent } from './Calendrier/calendrierEtudiant/calendrier-etudiant/calendrier-etudiant.component';
import { PaiementCourComponent } from './Etudiant/Store/paiement-cour/paiement-cour.component';
import { PaiementCourSaisiecoordonneComponent } from './Etudiant/Store/paiement-cour-saisiecoordonne/paiement-cour-saisiecoordonne.component';
import { CourseEditFormulaireComponent } from './Formateur/CourseEditFormulaire/course-edit-formulaire/course-edit-formulaire.component';
import { FormulaireCreationCourseComponent } from './Formateur/FormulaireCreationCourse/formulaire-creation-course/formulaire-creation-course.component';
import { DevoirAddFormulaireComponent } from './Formateur/DevoirAddFormulaire/devoir-add-formulaire/devoir-add-formulaire.component';
import { DevoirEditAffichageComponent } from './Formateur/DevoirEditAffichage/devoir-edit-affichage/devoir-edit-affichage.component';
import { PaiementCoursComponent } from './Etudiant/Store/paiement-cours/paiement-cours.component';
import { PaiementCourSaisieCoordonneComponent } from './Etudiant/Store/paiement-cour-saisie-coordonne/paiement-cour-saisie-coordonne.component';
import { PageDePaiementAbonnementComponent } from './Etudiant/Store/page-de-paiement-abonnement/page-de-paiement-abonnement.component';
import { ReunionIndexComponent } from './Formateur/ReunionIndex/reunion-index/reunion-index.component';
import { ReunionFormulaireComponent } from './Formateur/ReuinionFormulaire/reunion-formulaire/reunion-formulaire.component';
import { ReunioCheckSettingsComponent } from './Formateur/ReunionCheckSettings/reunio-check-settings/reunio-check-settings.component';
import { VideoCallFormateurComponent } from './Formateur/VideoCallFormateur/video-call-formateur/video-call-formateur.component';


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
    DiscussionsAllUsersComponent,
    NavbarEtudiantComponent,
    FormulaireModificationInfoComponent,
    ReunionEtudiantComponent,
    FaireReclamationComponent,
    ReunionMenuEtudiantComponent,
    CalendrierComponent,
    ReunionMeetingComponent,
    CoursEtudiantDetailComponent,
    CourInterfaceParModuleComponent,
    CourInterfaceQuizzComponent,
    CourInterfaceQuizzWithVideoComponent,
    CourInterfaceQuizzWithDocumentsComponent,
    AbonnementEtudiantComponent,
    InterfaceCommuneDePaiementComponentimplements,
    InterfacePrincipaleDePaiementComponent,
    ForumParUserComponent,
    ControlPannelForAdminComponent,
    DevoirParEtudiantComponent,
    ListeDesDevoirAvenirComponent,
    DetailsDevoirAvecRenduComponent,
    ExploreMenuComponent,
    DevoirCalendrierComponent,
    UnityComponentComponent,
    ReunionDashboardComponent,
    ReunionListComponent,
    VideoCallcomponentComponent,
    LivekitRoomsComponent,
    RepLivekitRoomComponent,
    InscrptionFormulaireComponent,
    BienvenuePageComponent,
    FormulaireComplementaireComponent,
    PageApresFormulaireComponent,
    StoreComponent,
    StatistiqueEtudiantComponent,
    DetailCourComponent,
    CalendrierEtudiantComponent,
    PaiementCourComponent,
    PaiementCourSaisiecoordonneComponent,
    CourseEditFormulaireComponent,
    FormulaireCreationCourseComponent,
    DevoirAddFormulaireComponent,
    DevoirEditAffichageComponent,
    PaiementCoursComponent,
    PaiementCourSaisieCoordonneComponent,
    PageDePaiementAbonnementComponent,
    ReunionIndexComponent,
    ReunionFormulaireComponent,
    ReunioCheckSettingsComponent,
    VideoCallFormateurComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    CommonModule,
    SharedModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
