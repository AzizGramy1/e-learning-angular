import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConnectionEvent, OpenVidu, Publisher, PublisherProperties, Session, StreamEvent, StreamManager } from 'openvidu-browser';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { VideoCallServiceService } from 'src/app/Service/VideoCall/video-call-service.service';


@Component({
  selector: 'app-video-callcomponent',
  templateUrl: './video-callcomponent.component.html',
  styleUrls: ['./video-callcomponent.component.scss']
})
export class VideoCallcomponentComponent implements OnInit, OnDestroy {
@ViewChild('subscriberContainer', { static: true }) subscriberContainer!: ElementRef;

  sessionId: string = 'demoSessionAziz322';
  OV!: OpenVidu;
  session!: Session;
  isConnected: boolean = false;
  isCallActive: boolean = false;
  errorMessage: string = '';

  constructor(private ovService: VideoCallServiceService) { }

  ngOnInit(): void {
    this.startVideoCall();
  }

  private async startVideoCall(): Promise<void> {
    try {
      console.log('🧪 Test OpenVidu avec backend Laravel');

      // 1️⃣ Créer la session via le service
      const sessionData: any = await this.ovService.createSession(this.sessionId).toPromise();
      this.sessionId = sessionData.session?.id || this.sessionId;
      console.log('✅ Session créée:', this.sessionId);

      // 2️⃣ Générer le token via le service
      const token: string = await this.ovService.generateToken(this.sessionId).toPromise();
      console.log('🔍 Token OpenVidu reçu du backend:', token);

      // 3️⃣ Initialiser OpenVidu et la session
      this.OV = new OpenVidu();
      this.session = this.OV.initSession();

      // 4️⃣ Listeners pour les streams distants
      this.session.on('streamCreated', (event: StreamEvent) => {
        const subscriber = this.session.subscribe(event.stream, this.subscriberContainer.nativeElement);
        subscriber.on('videoElementCreated', () => console.log('✅ Vidéo distante ajoutée'));
      });

      this.session.on('streamDestroyed', (event: StreamEvent) =>
        console.log('🗑️ Stream distant supprimé')
      );
      this.session.on('connectionCreated', (event: ConnectionEvent) =>
        console.log('👤 Nouvelle connexion:', event.connection.connectionId)
      );

      // 5️⃣ Connexion à la session
     (this.OV as any).wsUri = `ws://192.168.1.18:4443/openvidu`;
await this.session.connect(token, { clientData: 'UserAziz' });
      console.log('🎉 Connexion réussie à la session OpenVidu !');

      // 6️⃣ Publier le publisher local
      const publisher = this.OV.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        mirror: false
      });
      await this.session.publish(publisher);

      this.isConnected = true;
      this.isCallActive = true;

    } catch (error: any) {
      console.error('💥 Erreur startVideoCall:', error);
      this.errorMessage = `Erreur lors de la connexion : ${error.message || 'Problème inconnu'}`;
      this.isConnected = false;
      this.isCallActive = false;
    }
  }

  
  

  leaveCall(): void {
    if (this.session) this.session.disconnect();
    this.isConnected = false;
    this.isCallActive = false;
    console.log('📞 Appel terminé');
  }

  ngOnDestroy(): void {
    this.leaveCall();
  }
}

