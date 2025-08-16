import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Conversation } from 'src/app/Models/Conversation';
import { ConversationGroup } from 'src/app/Models/ConversationGroup';
import { Message } from 'src/app/Models/Message';


@Component({
  selector: 'app-discussions-all-users',
  templateUrl: './discussions-all-users.component.html',
  styleUrls: ['./discussions-all-users.component.scss']
})
export class DiscussionsAllUsersComponent implements AfterViewInit {
  searchQuery = '';
  selectedConversation: Conversation | null = null;
  isLoading = false;
  newMessage = '';
  messages: Message[] = [
    {
      id: 1,
      text: 'Salut Marie ! Comment avance ton projet React ?',
      isSent: false,
      time: '12:30'
    },
    {
      id: 2,
      text: 'Ça avance bien ! J\'ai presque terminé les composants principaux. Je bloque un peu sur le système de routage dynamique.',
      isSent: true,
      time: '12:32',
      read: false
    },
    {
      id: 3,
      text: 'Ah oui, c\'est un point délicat. Tu utilises React Router ? Je peux t\'envoyer un exemple de code si tu veux.',
      isSent: false,
      time: '12:33'
    },
    {
      id: 4,
      text: 'Oui, ce serait super merci ! J\'utilise la v6 de React Router.',
      isSent: true,
      time: '12:34',
      read: false
    },
    {
      id: 5,
      isTyping: true,
      isSent: false,
      time: '',
      text: ''
    },
    {
      id: 6,
      text: 'Voici un exemple de configuration de routes dynamiques :',
      isSent: false,
      time: '12:36',
      attachment: { name: 'exemple-routes.js', type: 'Fichier JavaScript', size: '2.1KB' }
    },
    {
      id: 7,
      text: 'Merci beaucoup ! Je regarde ça tout de suite.',
      isSent: true,
      time: '12:37',
      read: false
    },
    {
      id: 8,
      text: 'Je te fais un retour dès que j\'ai testé.',
      isSent: true,
      time: '12:37',
      read: true
    }
  ];

  conversationGroups: ConversationGroup[] = [
    {
      title: 'En ligne',
      conversations: [
        {
          id: 1,
          name: 'Asma Zoghlami',
          image: 'https://randomuser.me/api/portraits/women/32.jpg',
          online: true,
          lastMessage: 'Salut, comment vas-tu ?',
          time: '12:30',
          unreadCount: 3
        },
        {
          id: 2,
          name: 'Jean Dupont',
          image: 'https://randomuser.me/api/portraits/men/45.jpg',
          online: true,
          lastMessage: 'J\'ai terminé le projet',
          time: '11:45'
        }
      ]
    },
    {
      title: 'Récemment',
      conversations: [
        {
          id: 3,
          name: 'Groupe React',
          image: 'https://randomuser.me/api/portraits/men/22.jpg',
          online: false,
          lastMessage: 'Pierre: J\'ai un problème avec...',
          time: 'Hier',
          unreadCount: 12
        },
        {
          id: 4,
          name: 'Mentorat',
          image: 'https://randomuser.me/api/portraits/women/65.jpg',
          online: false,
          lastMessage: 'Notre prochaine session est...',
          time: 'Lun.'
        },
        {
          id: 5,
          name: 'Thomas Leroy',
          image: 'https://randomuser.me/api/portraits/men/33.jpg',
          online: false,
          lastMessage: 'Merci pour ton aide !',
          time: 'Sam.'
        }
      ]
    },
    {
      title: 'Anciens messages',
      conversations: [
        {
          id: 6,
          name: 'Data Science FR',
          initials: 'DS',
          online: false,
          lastMessage: 'Nouveau dataset disponible',
          time: '5 juin'
        }
      ]
    }
  ];

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('inputContainer') inputContainer!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.selectConversation(this.conversationGroups[0].conversations[0]);
    this.simulateIncomingMessage();
  }

  selectConversation(conv: Conversation) {
    this.isLoading = true;
    this.selectedConversation = conv;

    setTimeout(() => {
      this.messages = [
        {
          id: 1,
          text: `Nouvelle conversation avec ${conv.name}`,
          isSent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      this.isLoading = false;
      this.scrollToBottom();
    }, 1000);
  }

  filterConversations() {
    // Placeholder for search functionality
    console.log('Filtering conversations with query:', this.searchQuery);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const newMsg: Message = {
        id: this.messages.length + 1,
        text: this.newMessage,
        isSent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      this.messages.push(newMsg);
      this.newMessage = '';
      this.scrollToBottom();

      // Simulate typing indicator and reply
      setTimeout(() => {
        this.messages.push({
          id: this.messages.length + 1,
          isTyping: true,
          isSent: false,
          time: '',
          text: ''
        });
        this.scrollToBottom();

        setTimeout(() => {
          this.messages = this.messages.filter(msg => !msg.isTyping);
          this.messages.push({
            id: this.messages.length + 1,
            text: 'Merci pour ton message ! Je te réponds dès que possible.',
            isSent: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          this.scrollToBottom();
        }, 2000);
      }, 1000);
    }
  }

  simulateIncomingMessage() {
    setTimeout(() => {
      const typingIndex = this.messages.findIndex(msg => msg.isTyping);
      if (typingIndex !== -1) {
        this.messages.splice(typingIndex, 1);
        this.messages.push({
          id: this.messages.length + 1,
          text: 'Avec plaisir ! N\'hésite pas si tu as d\'autres questions.',
          isSent: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.scrollToBottom();
      }
    }, 3000);
  }

  onInputFocus() {
    this.renderer.addClass(this.inputContainer.nativeElement, 'ring-2');
    this.renderer.addClass(this.inputContainer.nativeElement, 'ring-blue-500');
    this.renderer.addClass(this.inputContainer.nativeElement, 'rounded-full');
  }

  onInputBlur() {
    this.renderer.removeClass(this.inputContainer.nativeElement, 'ring-2');
    this.renderer.removeClass(this.inputContainer.nativeElement, 'ring-blue-500');
    this.renderer.removeClass(this.inputContainer.nativeElement, 'rounded-full');
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  startCall() {
    alert('Starting voice call...');
  }

  startVideoCall() {
    alert('Starting video call...');
  }

  openOptions() {
    alert('Opening options...');
  }

  attachFile() {
    alert('Attaching file...');
  }

  addEmoji() {
    alert('Adding emoji...');
  }

  sendVoiceMessage() {
    alert('Recording voice message...');
  }

  downloadAttachment(attachment: any) {
    alert(`Downloading ${attachment.name}...`);
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTo({
        top: this.messagesContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 0);
  }
}
