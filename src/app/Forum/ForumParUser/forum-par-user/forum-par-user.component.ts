import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface Category {
  name: string;
  count: number;
  isActive: boolean;
}

interface TrendingTopic {
  rank: number;
  title: string;
  discussions: number;
}

interface Discussion {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  authorColor: string;
  time: string;
  replies: number;
  views: number;
  category: string;
  categoryColor: string;
  upVotes: number;
  downVotes: number;
  isResolved?: boolean;
}




@Component({
  selector: 'app-forum-par-user',
  templateUrl: './forum-par-user.component.html',
  styleUrls: ['./forum-par-user.component.scss'],
  animations: [
    trigger('float', [
      state('start', style({ transform: 'translateY(0px)' })),
      state('end', style({ transform: 'translateY(-10px)' })),
      transition('start <=> end', animate('3s ease-in-out'))
    ]),
    trigger('pulse', [
      state('normal', style({ transform: 'scale(1)' })),
      state('pulsed', style({ transform: 'scale(1.05)' })),
      transition('normal <=> pulsed', animate('1s ease'))
    ]),
    trigger('replyBox', [
      state('closed', style({ maxHeight: '0px', overflow: 'hidden' })),
      state('open', style({ maxHeight: '300px' })),
      transition('closed <=> open', animate('0.3s ease-out'))
    ])
  ]
})
export class ForumParUserComponent  implements OnInit {
  categories: Category[] = [
    { name: 'Toutes les discussions', count: 128, isActive: true },
    { name: 'JavaScript', count: 42, isActive: false },
    { name: 'React', count: 28, isActive: false },
    { name: 'Python', count: 19, isActive: false },
    { name: 'Développement Web', count: 15, isActive: false },
    { name: 'Data Science', count: 12, isActive: false },
    { name: 'Cybersécurité', count: 8, isActive: false }
  ];

  trendingTopics: TrendingTopic[] = [
    { rank: 1, title: 'Nouveautés React 18', discussions: 15 },
    { rank: 2, title: 'Transition vers TypeScript', discussions: 12 },
    { rank: 3, title: 'Meilleures pratiques API REST', discussions: 9 },
    { rank: 4, title: 'Tests unitaires en JavaScript', discussions: 7 },
    { rank: 5, title: 'Optimisation des performances', discussions: 6 }
  ];

  discussions: Discussion[] = [
    {
      id: 1,
      title: 'Problème avec useState et les tableaux',
      author: 'Jean Dupont',
      authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      authorColor: 'blue-400',
      time: 'il y a 2 heures',
      replies: 8,
      views: 124,
      category: 'React',
      categoryColor: 'blue-400',
      upVotes: 12,
      downVotes: 2
    },
    {
      id: 2,
      title: 'Meilleure façon de structurer un projet React en 2024',
      author: 'Sophie Martin',
      authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      authorColor: 'purple-400',
      time: 'il y a 5 heures',
      replies: 14,
      views: 312,
      category: 'React',
      categoryColor: 'purple-400',
      upVotes: 24,
      downVotes: 3
    },
    {
      id: 3,
      title: '[Résolu] Problème d\'authentification avec Firebase',
      author: 'Thomas Leroy',
      authorAvatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      authorColor: 'green-400',
      time: 'il y a 1 jour',
      replies: 5,
      views: 87,
      category: 'Firebase',
      categoryColor: 'green-400',
      upVotes: 8,
      downVotes: 0,
      isResolved: true
    },
    {
      id: 4,
      title: 'Comparaison : Next.js vs Remix en 2024',
      author: 'Emma Laurent',
      authorAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      authorColor: 'yellow-400',
      time: 'il y a 2 jours',
      replies: 23,
      views: 421,
      category: 'Framework',
      categoryColor: 'yellow-400',
      upVotes: 17,
      downVotes: 2
    }
  ];

  stats = {
    members: 4821,
    discussions: 1245,
    replies: 5673,
    online: 243
  };

  tabs = [
    { name: 'Récentes', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', active: true },
    { name: 'Populaires', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', active: false },
    { name: 'Non résolues', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', active: false },
    { name: 'Suivies', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', active: false }
  ];

  searchQuery = '';
  selectedDiscussionId: number | null = null;
  floatState = 'start';
  pulseState = 'normal';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Simulate API calls or load mock data
    this.startFloatAnimation();
    // Uncomment for real API
    // this.loadCategories();
    // this.loadTrendingTopics();
    // this.loadDiscussions();
  }

  startFloatAnimation(): void {
    setInterval(() => {
      this.floatState = this.floatState === 'start' ? 'end' : 'start';
    }, 3000);
  }

  selectTab(tab: any): void {
    this.tabs.forEach(t => t.active = false);
    tab.active = true;
    // Add API call to filter discussions based on tab
  }

  toggleReplyBox(discussionId: number): void {
    this.selectedDiscussionId = this.selectedDiscussionId === discussionId ? null : discussionId;
  }

  vote(discussionId: number, type: 'up' | 'down'): void {
    const discussion = this.discussions.find(d => d.id === discussionId);
    if (discussion) {
      if (type === 'up') discussion.upVotes++;
      else discussion.downVotes++;
      // Add API call to update votes
    }
  }

  // Placeholder for API calls
  loadCategories(): void {
    this.http.get<Category[]>('/api/categories').subscribe({
      next: (data) => this.categories = data,
      error: (error) => console.error('Erreur lors du chargement des catégories:', error)
    });
  }

  loadTrendingTopics(): void {
    this.http.get<TrendingTopic[]>('/api/trending').subscribe({
      next: (data) => this.trendingTopics = data,
      error: (error) => console.error('Erreur lors du chargement des sujets tendance:', error)
    });
  }

  loadDiscussions(): void {
    this.http.get<Discussion[]>('/api/discussions').subscribe({
      next: (data) => this.discussions = data,
      error: (error) => console.error('Erreur lors du chargement des discussions:', error)
    });
  }
}