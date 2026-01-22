import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/Service/Authentification/authentification.service';
import { MeetingFormateurService, RoomInfo } from 'src/app/Service/MeetingFormateur/meeting-formateur.service';

@Component({
  selector: 'app-reunio-check-settings',
  templateUrl: './reunio-check-settings.component.html',
  styleUrls: ['./reunio-check-settings.component.scss']
})
export class ReunioCheckSettingsComponent {

   @Input() meeting!: RoomInfo;
  @Output() deviceCheckComplete = new EventEmitter<{joinUrl: string}>();
  @Output() deviceCheckCancel = new EventEmitter<void>();
  
  // États du composant
  currentStep: 'camera' | 'microphone' | 'summary' = 'camera';
  isChecking = false;
  errorMessage = '';
  successMessage = '';
  
  // Informations sur les périphériques
  availableCameras: MediaDeviceInfo[] = [];
  availableMicrophones: MediaDeviceInfo[] = [];
  availableSpeakers: MediaDeviceInfo[] = [];
  
  // Sélections de l'utilisateur
  selectedCameraId = '';
  selectedMicrophoneId = '';
  selectedSpeakerId = '';
  
  // Éléments média
  private videoStream: MediaStream | null = null;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  
  // Mesures audio
  audioLevel = 0;
  isAudioDetected = false;
  isVideoWorking = false;
  
  // Configuration
  cameraEnabled = true;
  microphoneEnabled = true;
  speakerEnabled = true;
  
  // Volume de test
  testSound: HTMLAudioElement | null = null;
  isTestingSpeaker = false;
  
  // Timing
  checkTimeout: any = null;
  joinTimeout: any = null;
  
  constructor(
    private router: Router,
    private liveKitService: MeetingFormateurService,
    private authService: AuthentificationService
  ) {}
  
  ngOnInit(): void {
    this.initializeDevices();
  }
  
  ngOnDestroy(): void {
    this.cleanupMedia();
    if (this.checkTimeout) clearTimeout(this.checkTimeout);
    if (this.joinTimeout) clearTimeout(this.joinTimeout);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }
  
  /** 🔹 Initialiser les périphériques */
  async initializeDevices(): Promise<void> {
    try {
      // Demander la permission d'accéder aux périphériques
      await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Obtenir la liste des périphériques
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Filtrer par type
      this.availableCameras = devices.filter(device => device.kind === 'videoinput');
      this.availableMicrophones = devices.filter(device => device.kind === 'audioinput');
      this.availableSpeakers = devices.filter(device => device.kind === 'audiooutput');
      
      // Sélectionner les périphériques par défaut
      if (this.availableCameras.length > 0) {
        this.selectedCameraId = this.availableCameras[0].deviceId;
        this.startCameraPreview();
      }
      
      if (this.availableMicrophones.length > 0) {
        this.selectedMicrophoneId = this.availableMicrophones[0].deviceId;
        this.startMicrophoneTest();
      }
      
      if (this.availableSpeakers.length > 0) {
        this.selectedSpeakerId = this.availableSpeakers[0].deviceId;
      }
      
      this.errorMessage = '';
    } catch (error) {
      console.error('Erreur lors de l\'accès aux périphériques:', error);
      this.errorMessage = 'Accès aux caméra/microphone refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.';
    }
  }
  
  /** 🔹 Démarrer la prévisualisation de la caméra */
  async startCameraPreview(): Promise<void> {
    this.stopCameraPreview();
    
    try {
      const constraints = {
        video: {
          deviceId: this.selectedCameraId ? { exact: this.selectedCameraId } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      this.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.isVideoWorking = true;
      
      // Mettre à jour l'affichage de la vidéo
      const videoElement = document.getElementById('camera-preview') as HTMLVideoElement;
      if (videoElement && this.videoStream) {
        videoElement.srcObject = this.videoStream;
      }
      
      this.errorMessage = '';
    } catch (error) {
      console.error('Erreur caméra:', error);
      this.isVideoWorking = false;
      this.errorMessage = 'Impossible d\'accéder à la caméra sélectionnée.';
    }
  }
  
  /** 🔹 Démarrer le test du microphone */
  async startMicrophoneTest(): Promise<void> {
    this.stopMicrophoneTest();
    
    try {
      const constraints = {
        audio: {
          deviceId: this.selectedMicrophoneId ? { exact: this.selectedMicrophoneId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      this.audioStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Configurer l'analyse audio
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.3;
      
      this.microphoneSource = this.audioContext.createMediaStreamSource(this.audioStream);
      this.microphoneSource.connect(this.analyser);
      
      // Démarrer la surveillance du niveau audio
      this.startAudioLevelMonitoring();
      
      this.errorMessage = '';
    } catch (error) {
      console.error('Erreur microphone:', error);
      this.errorMessage = 'Impossible d\'accéder au microphone sélectionné.';
    }
  }
  
  /** 🔹 Surveiller le niveau audio */
  startAudioLevelMonitoring(): void {
    const dataArray = new Uint8Array(this.analyser!.frequencyBinCount);
    
    const checkAudio = () => {
      if (!this.analyser) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Calculer le niveau moyen
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Convertir en pourcentage (0-100)
      this.audioLevel = Math.min(100, (average / 128) * 100);
      
      // Détecter si du son est présent
      this.isAudioDetected = this.audioLevel > 5;
      
      this.animationFrameId = requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
  }
  
  /** 🔹 Tester les haut-parleurs */
  async testSpeaker(): Promise<void> {
    if (this.isTestingSpeaker) return;
    
    this.isTestingSpeaker = true;
    
    try {
      // Créer un son de test
      this.testSound = new Audio();
      this.testSound.src = 'assets/sounds/test-tone.mp3'; // Créez ce fichier ou utilisez un générateur
      
      // Générer un ton de test si le fichier n'existe pas
      if (!this.testSound.src.includes('assets')) {
        this.testSound = this.generateTestTone();
      }
      
      // Définir le périphérique de sortie si supporté
      if ('setSinkId' in this.testSound && this.selectedSpeakerId) {
        await (this.testSound as any).setSinkId(this.selectedSpeakerId);
      }
      
      this.testSound.volume = 0.5;
      await this.testSound.play();
      
      // Arrêter après 2 secondes
      setTimeout(() => {
        if (this.testSound) {
          this.testSound.pause();
          this.testSound.currentTime = 0;
        }
        this.isTestingSpeaker = false;
      }, 2000);
      
    } catch (error) {
      console.error('Erreur test haut-parleur:', error);
      this.isTestingSpeaker = false;
    }
  }
  
  /** 🔹 Générer un ton de test */
  generateTestTone(): HTMLAudioElement {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 440; // La note A4
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.start();
    
    // Créer un élément audio pour le contrôle
    const audioElement = new Audio();
    
    // Arrêter après 2 secondes
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 2000);
    
    return audioElement;
  }
  
  /** 🔹 Passer à l'étape suivante */
  nextStep(): void {
    switch (this.currentStep) {
      case 'camera':
        this.currentStep = 'microphone';
        break;
      case 'microphone':
        this.currentStep = 'summary';
        this.saveDevicePreferences();
        break;
      case 'summary':
        this.joinMeeting();
        break;
    }
  }
  
  /** 🔹 Revenir à l'étape précédente */
  previousStep(): void {
    switch (this.currentStep) {
      case 'microphone':
        this.currentStep = 'camera';
        break;
      case 'summary':
        this.currentStep = 'microphone';
        break;
    }
  }
  
  /** 🔹 Sauvegarder les préférences des périphériques */
  saveDevicePreferences(): void {
    const preferences = {
      cameraId: this.selectedCameraId,
      microphoneId: this.selectedMicrophoneId,
      speakerId: this.selectedSpeakerId,
      cameraEnabled: this.cameraEnabled,
      microphoneEnabled: this.microphoneEnabled,
      timestamp: Date.now()
    };
    
    localStorage.setItem('device-preferences', JSON.stringify(preferences));
  }
  
  /** 🔹 Charger les préférences des périphériques */
  loadDevicePreferences(): void {
    const saved = localStorage.getItem('device-preferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        this.selectedCameraId = preferences.cameraId || this.selectedCameraId;
        this.selectedMicrophoneId = preferences.microphoneId || this.selectedMicrophoneId;
        this.selectedSpeakerId = preferences.speakerId || this.selectedSpeakerId;
        this.cameraEnabled = preferences.cameraEnabled !== false;
        this.microphoneEnabled = preferences.microphoneEnabled !== false;
      } catch (error) {
        console.error('Erreur chargement préférences:', error);
      }
    }
  }
  
  /** 🔹 Rejoindre la réunion */
  async joinMeeting(): Promise<void> {
    if (this.isChecking) return;
    
    this.isChecking = true;
    this.errorMessage = '';
    
    try {
      // Obtenir le nom du participant
      const participantName = this.authService.getUserName() || 
                             this.authService.getUserEmail()?.split('@')[0] || 
                             'Participant';
      
      // Ajouter les préférences de périphériques au token si l'API le supporte
      const joinData = {
        room_name: this.meeting.name,
        participant_name: participantName,
        device_preferences: {
          camera_id: this.cameraEnabled ? this.selectedCameraId : null,
          microphone_id: this.microphoneEnabled ? this.selectedMicrophoneId : null,
          camera_enabled: this.cameraEnabled,
          microphone_enabled: this.microphoneEnabled
        }
      };
      
      // Appeler le service pour rejoindre
      this.liveKitService.joinRoom(this.meeting.name, participantName).subscribe({
        next: (joinUrl: string) => {
          this.isChecking = false;
          this.successMessage = 'Connexion réussie ! Redirection en cours...';
          
          // Sauvegarder la salle comme rejointe
          const joinedRooms = JSON.parse(localStorage.getItem('joined-livekit-rooms') || '[]');
          if (!joinedRooms.includes(this.meeting.name)) {
            joinedRooms.push(this.meeting.name);
            localStorage.setItem('joined-livekit-rooms', JSON.stringify(joinedRooms));
          }
          
          // Émettre l'événement avec l'URL de connexion
          this.deviceCheckComplete.emit({ joinUrl });
          
          // Fermer après un délai
          this.joinTimeout = setTimeout(() => {
            this.close();
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de la jonction:', error);
          this.isChecking = false;
          this.errorMessage = error.message || 'Impossible de rejoindre la réunion.';
        }
      });
      
    } catch (error: any) {
      console.error('Erreur:', error);
      this.isChecking = false;
      this.errorMessage = error.message || 'Une erreur est survenue.';
    }
  }
  
  /** 🔹 Nettoyer les flux média */
  cleanupMedia(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.testSound) {
      this.testSound.pause();
      this.testSound = null;
    }
  }
  
  /** 🔹 Arrêter la prévisualisation de la caméra */
  stopCameraPreview(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }
  
  /** 🔹 Arrêter le test du microphone */
  stopMicrophoneTest(): void {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /** 🔹 Changer de caméra */
  onCameraChange(): void {
    this.startCameraPreview();
  }
  
  /** 🔹 Changer de microphone */
  onMicrophoneChange(): void {
    this.startMicrophoneTest();
  }
  
  /** 🔹 Basculer la caméra */
  toggleCamera(): void {
    this.cameraEnabled = !this.cameraEnabled;
    if (!this.cameraEnabled) {
      this.stopCameraPreview();
    } else {
      this.startCameraPreview();
    }
  }
  
  /** 🔹 Basculer le microphone */
  toggleMicrophone(): void {
    this.microphoneEnabled = !this.microphoneEnabled;
    if (!this.microphoneEnabled) {
      this.stopMicrophoneTest();
    } else {
      this.startMicrophoneTest();
    }
  }
  
  /** 🔹 Fermer le composant */
  close(): void {
    this.cleanupMedia();
    this.deviceCheckCancel.emit();
  }
  
  /** 🔹 Obtenir le nom du périphérique */
  getDeviceName(device: MediaDeviceInfo): string {
    return device.label || `Périphérique ${device.kind.substring(5)}`;
  }
  
  /** 🔹 Vérifier si on peut passer à l'étape suivante */
  get canProceed(): boolean {
    switch (this.currentStep) {
      case 'camera':
        return this.cameraEnabled ? this.isVideoWorking : true;
      case 'microphone':
        return this.microphoneEnabled ? this.isAudioDetected : true;
      case 'summary':
        return true;
      default:
        return false;
    }
  }
  
  /** 🔹 Obtenir le pourcentage de progression */
  get progressPercentage(): number {
    switch (this.currentStep) {
      case 'camera': return 33;
      case 'microphone': return 66;
      case 'summary': return 100;
      default: return 0;
    }
  }

  /** 🔹 Obtenir le nom de la caméra sélectionnée */
getSelectedCameraName(): string {
  if (!this.cameraEnabled || !this.selectedCameraId) {
    return 'Non utilisée';
  }
  
  const camera = this.availableCameras.find(c => c.deviceId === this.selectedCameraId);
  return camera?.label || this.getDeviceName(camera) || 'Non spécifié';
}

/** 🔹 Obtenir le nom du microphone sélectionné */
getSelectedMicrophoneName(): string {
  if (!this.microphoneEnabled || !this.selectedMicrophoneId) {
    return 'Non utilisé';
  }
  
  const microphone = this.availableMicrophones.find(m => m.deviceId === this.selectedMicrophoneId);
  return microphone?.label || this.getDeviceName(microphone) || 'Non spécifié';
}

}
