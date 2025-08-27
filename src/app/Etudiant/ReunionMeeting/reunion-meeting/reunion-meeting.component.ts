import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reunion-meeting',
  templateUrl: './reunion-meeting.component.html',
  styleUrls: ['./reunion-meeting.component.scss']
})
export class ReunionMeetingComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessagesContainer!: ElementRef;

  // Self participant
  selfParticipant = {
    name: 'Marie Dupont',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isMuted: true,
    isVideoOff: true,
    isSpeaking: false
  };

  // Other participants
  participants = [
    {
      name: 'Prof. Martin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isMuted: false,
      isVideoOff: false,
      isSpeaking: true,
      isOrganizer: true
    },
    {
      name: 'Thomas L.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isMuted: true,
      isVideoOff: false,
      isSpeaking: false,
      isOrganizer: false
    },
    {
      name: 'Sophie M.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      isMuted: false,
      isVideoOff: false,
      isSpeaking: false,
      isOrganizer: false
    },
    {
      name: 'Marc D.',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      isMuted: false,
      isVideoOff: true,
      isSpeaking: false,
      isOrganizer: false
    }
  ];

  // Chat messages
  chatMessagesList: Array<{ type: string; sender?: string; content: string; timestamp: Date }> = [];


  // Reactions
  reactions: { content: string; type: string; iconClass?: string }[] = [];
  newMessage = '';
  isSidebarOpen = true; // Sidebar visible by default on medium+ screens
  activeSidebarTab = 'chat';
  isScreenSharing = false;
  meetingTimer = new Date(0);
  private timerInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Start meeting timer
    this.startMeetingTimer();

    // Simulate speaking participants
    this.simulateSpeaking();

    // Simulate random reactions
    this.simulateReactions();
  }

  ngOnDestroy(): void {
    // Clean up intervals
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startMeetingTimer(): void {
    this.timerInterval = setInterval(() => {
      this.meetingTimer = new Date(this.meetingTimer.getTime() + 1000);
    }, 1000);
  }

  toggleMic(): void {
    this.selfParticipant.isMuted = !this.selfParticipant.isMuted;
    this.selfParticipant.isSpeaking = !this.selfParticipant.isMuted ? true : false;
    if (!this.selfParticipant.isMuted) {
      this.addReaction({ content: '', type: 'mic', iconClass: 'fa-microphone text-green-400 text-xl' });
    }
  }

  toggleVideo(): void {
    this.selfParticipant.isVideoOff = !this.selfParticipant.isVideoOff;
    if (!this.selfParticipant.isVideoOff) {
      this.addReaction({ content: '', type: 'video', iconClass: 'fa-video text-blue-400 text-xl' });
    }
  }

  toggleScreenShare(): void {
    this.isScreenSharing = !this.isScreenSharing;
    if (this.isScreenSharing) {
      this.addReaction({ content: '', type: 'screen', iconClass: 'fa-desktop text-blue-400 text-xl' });
    }
  }

  raiseHand(): void {
    this.addReaction({ content: '', type: 'hand', iconClass: 'fa-hand-paper text-yellow-400 text-xl' });
    this.addChatMessage({
      type: 'system',
      content: 'Marie a levé la main',
      timestamp: new Date()
    });
  }

  toggleSidebar(tab: string): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.setSidebarTab(tab);
    }
  }

  setSidebarTab(tab: string): void {
    this.activeSidebarTab = tab;
    this.isSidebarOpen = true;
    if (tab === 'chat') {
      setTimeout(() => {
        this.scrollChatToBottom();
      }, 0);
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.addChatMessage({
        type: 'self',
        sender: 'Vous',
        content: this.newMessage,
        timestamp: new Date()
      });
      this.newMessage = '';
      this.scrollChatToBottom();
    }
  }

  addChatMessage(message: { type: string; sender?: string; content: string; timestamp: Date }): void {
    this.chatMessagesList.push(message);
  }

  addReaction(reaction: { content: string; type: string; iconClass?: string }): void {
    this.reactions.push(reaction);
    setTimeout(() => {
      this.reactions = this.reactions.filter(r => r !== reaction);
    }, 2000);
  }

  scrollChatToBottom(): void {
    if (this.chatMessagesContainer) {
      const container = this.chatMessagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  openEmojiPicker(): void {
    // Placeholder for emoji picker functionality
    console.log('Open emoji picker');
  }

  openSettings(): void {
    // Placeholder for settings functionality
    console.log('Open settings');
  }

  openInfo(): void {
    // Placeholder for info functionality
    console.log('Open info');
  }

  minimizeCall(): void {
    // Placeholder for minimize call functionality
    console.log('Minimize call');
  }

  searchParticipants(): void {
    // Placeholder for participant search functionality
    console.log('Search participants');
  }

  leaveCall(): void {
    if (confirm('Quitter la réunion ?')) {
      this.router.navigate(['/meetings']);
    }
  }

  private simulateSpeaking(): void {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.participants.length);
      this.participants.forEach((participant, index) => {
        if (!participant.isMuted) {
          participant.isSpeaking = index === randomIndex;
        } else {
          participant.isSpeaking = false;
        }
      });
    }, 5000);
  }

  private simulateReactions(): void {
    setInterval(() => {
      if (Math.random() > 0.7) {
        const emojis = ['👍', '👏', '❤️', '😂', '😮'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.addReaction({ content: randomEmoji, type: 'emoji' });
      }
    }, 8000);
  }

    openMoreOptions() {
    // Logique pour afficher les options supplémentaires
    console.log('Options ouvertes !');
  }
}
