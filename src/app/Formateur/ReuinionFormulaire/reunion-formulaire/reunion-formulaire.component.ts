import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reunion-formulaire',
  templateUrl: './reunion-formulaire.component.html',
  styleUrls: ['./reunion-formulaire.component.scss']
})
export class ReunionFormulaireComponent implements OnInit {
  


   meetingForm: FormGroup;
  meetingTypes = [
    { value: 'course', label: 'Cours', icon: '📚' },
    { value: 'tutorial', label: 'Tutoriel', icon: '🎓' },
    { value: 'review', label: 'Révision', icon: '🔄' },
    { value: 'qa', label: 'Q&A', icon: '❓' }
  ];
  participants: string[] = [];
  newParticipant: string = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  createdMeeting: any = null;
  durationText = '60 minutes';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.meetingForm = this.createForm();
  }

  ngOnInit(): void {
    // Définir la date minimale comme aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    this.meetingForm.get('date')?.setValidators([
      Validators.required,
      this.futureDateValidator
    ]);
    this.meetingForm.get('date')?.updateValueAndValidity();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      date: ['', Validators.required],
      startTime: ['14:00', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(240)]],
      type: ['course', Validators.required]
    });
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  updateDurationText(event: any): void {
    const minutes = event.target.value;
    if (minutes < 60) {
      this.durationText = `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      this.durationText = remainingMinutes > 0 
        ? `${hours}h${remainingMinutes}`
        : `${hours} heure${hours > 1 ? 's' : ''}`;
    }
  }

  addParticipant(): void {
    if (this.newParticipant && this.validateEmail(this.newParticipant)) {
      if (!this.participants.includes(this.newParticipant)) {
        this.participants.push(this.newParticipant);
        this.newParticipant = '';
      }
    }
  }

  removeParticipant(email: string): void {
    this.participants = this.participants.filter(p => p !== email);
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  onSubmit(): void {
    if (this.meetingForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Simulation de création de réunion
      setTimeout(() => {
        const formValue = this.meetingForm.value;
        
        this.createdMeeting = {
          id: 'MTG-' + Date.now(),
          title: formValue.title,
          description: formValue.description,
          date: formValue.date,
          startTime: formValue.startTime,
          duration: formValue.duration,
          type: formValue.type,
          participants: this.participants,
          meetingLink: `https://edutech-meet.com/room/${Date.now()}`,
          status: 'planned',
          createdAt: new Date().toISOString()
        };
        
        // Enregistrer dans le localStorage (simulation)
        const meetings = JSON.parse(localStorage.getItem('edutech-meetings') || '[]');
        meetings.push(this.createdMeeting);
        localStorage.setItem('edutech-meetings', JSON.stringify(meetings));
        
        this.successMessage = 'Réunion créée avec succès !';
        this.isLoading = false;
        
        // Réinitialiser le formulaire après succès
        setTimeout(() => {
          this.meetingForm.reset({
            title: '',
            description: '',
            date: '',
            startTime: '14:00',
            duration: 60,
            type: 'course'
          });
          this.participants = [];
          this.durationText = '60 minutes';
        }, 3000);
      }, 1500);
    }
  }

  copyMeetingLink(): void {
    if (this.createdMeeting?.meetingLink) {
      navigator.clipboard.writeText(this.createdMeeting.meetingLink)
        .then(() => {
          alert('Lien copié dans le presse-papier !');
        })
        .catch(err => {
          console.error('Erreur lors de la copie : ', err);
        });
    }
  }



}
