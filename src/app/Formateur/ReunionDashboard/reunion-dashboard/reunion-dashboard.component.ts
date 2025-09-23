import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reunion-dashboard',
  templateUrl: './reunion-dashboard.component.html',
  styleUrls: ['./reunion-dashboard.component.scss']
})
export class ReunionDashboardComponent implements OnInit {
  teacherRooms = [
    { 
      id: 1, 
      number: '101', 
      title: 'JavaScript Avancé', 
      description: 'Promesses, async/await et modules', 
      students: 28,
      nextSession: 'Aujourd\'hui 14:30',
      isLive: true 
    },
    { 
      id: 2, 
      number: '102', 
      title: 'React Masterclass', 
      description: 'Hooks avancés et performance', 
      students: 24,
      nextSession: 'Demain 10:00',
      isLive: false 
    },
    { 
      id: 3, 
      number: '103', 
      title: 'Python pour la Data Science', 
      description: 'Pandas et NumPy avancés', 
      students: 32,
      nextSession: '22/01 09:00',
      isLive: false 
    },
    { 
      id: 4, 
      number: '104', 
      title: 'Développement Web Moderne', 
      description: 'HTML5, CSS3 et JavaScript ES6+', 
      students: 45,
      nextSession: 'Tous les jours 16:00',
      isLive: false 
    },
    { 
      id: 5, 
      number: '105', 
      title: 'Architecture Logicielle', 
      description: 'Design Patterns et bonnes pratiques', 
      students: 18,
      nextSession: 'Vendredi 18:00',
      isLive: false 
    }
  ];

  selectedRoom = this.teacherRooms[0];

  ngOnInit() {
    this.setupCardAnimations();
  }

  setupCardAnimations() {
    // Mêmes animations que l'interface étudiant
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const roomNumber = card.querySelector('.room-number');
        if (roomNumber) {
          roomNumber.classList.add('animate__animated', 'animate__pulse');
        }
      });
      card.addEventListener('mouseleave', () => {
        const roomNumber = card.querySelector('.room-number');
        if (roomNumber) {
          roomNumber.classList.remove('animate__animated', 'animate__pulse');
        }
      });
    });
  }

  selectRoom(room: any) {
    this.selectedRoom = room;
  }

  startSession() {
    console.log(`Démarrage de la session ${this.selectedRoom.number}`);
    // Logique pour démarrer une session
  }

  toggleUserMenu() {
    console.log('User menu toggled');
  }

  toggleMobileMenu() {
    console.log('Mobile menu toggled');
  }
}
