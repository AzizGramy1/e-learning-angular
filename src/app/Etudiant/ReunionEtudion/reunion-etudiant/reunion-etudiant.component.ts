import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reunion-etudiant',
  templateUrl: './reunion-etudiant.component.html',
  styleUrls: ['./reunion-etudiant.component.scss']
})
export class ReunionEtudiantComponent implements OnInit {
  rooms = [
    { id: 1, number: '101', title: 'JavaScript Avancé', description: 'Promesses, async/await et modules', schedule: 'En cours jusqu\'à 12:00', isLive: true },
    { id: 2, number: '102', title: 'React Masterclass', description: 'Hooks avancés et performance', schedule: 'Démarre à 14:30', isLive: false },
    { id: 3, number: '103', title: 'Python pour la Data Science', description: 'Pandas et NumPy avancés', schedule: 'Demain 09:00', isLive: false },
    { id: 4, number: '104', title: 'Développement Web Moderne', description: 'HTML5, CSS3 et JavaScript ES6+', schedule: 'Tous les jours 16:00', isLive: false },
    { id: 5, number: '105', title: 'Session de Mentorat', description: 'Questions/Réponses avec experts', schedule: 'Vendredi 18:00', isLive: false }
  ];

  upcomingSessions = [
    { title: 'React Masterclass', room: 'Salle 102', time: '14:30 - 16:00', category: 'react' },
    { title: 'Python Data Science', room: 'Salle 103', time: 'Demain 09:00', category: 'python' },
    { title: 'Développement Web', room: 'Salle 104', time: 'Mercredi 16:00', category: 'web' }
  ];

  filteredRooms = [...this.rooms];
  selectedRoom = this.rooms[0];
  searchQuery = '';

  ngOnInit() {
    this.setupCardAnimations();
  }

  setupCardAnimations() {
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

    document.querySelectorAll('.bg-gray-700.bg-opacity-50.rounded-lg').forEach(room => {
      room.addEventListener('click', () => {
        document.querySelectorAll('.bg-gray-700.bg-opacity-50.rounded-lg').forEach(r => {
          r.classList.remove('ring-2', 'ring-blue-500');
        });
        room.classList.add('ring-2', 'ring-blue-500');
      });
    });
  }

  selectRoom(room: any) {
    this.selectedRoom = room;
  }

  filterRooms() {
    this.filteredRooms = this.rooms.filter(room =>
      room.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleUserMenu() {
    console.log('User menu toggled');
  }

  toggleMobileMenu() {
    console.log('Mobile menu toggled');
  }

  joinRoom() {
    console.log(`Joining room ${this.selectedRoom.number}`);
  }
}
