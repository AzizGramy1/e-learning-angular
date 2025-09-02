import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface Forum {
  id: number;
  title: string;
  description: string;
}

interface Message {
  id: number;
  content: string;
  created_at: string;
  user?: { name: string }; }


@Component({
  selector: 'app-control-pannel-for-admin',
  templateUrl: './control-pannel-for-admin.component.html',
  styleUrls: ['./control-pannel-for-admin.component.scss']
})
export class ControlPannelForAdminComponent implements OnInit {
  apiBaseUrl = '/api/forums';
  forums: Forum[] = [];
  currentForum: Forum | null = null;
  messages: Message[] = [];
  newMessageContent = '';
  isLoadingForums = true;
  isLoadingMessages = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadForums();
  }

  loadForums(): void {
    this.isLoadingForums = true;
    this.http.get<{ data: Forum[] }>(this.apiBaseUrl).subscribe({
      next: (response) => {
        this.forums = response.data;
        this.isLoadingForums = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des forums:', error);
        this.isLoadingForums = false;
      }
    });
  }

  showForumMessages(forum: Forum): void {
    this.currentForum = forum;
    this.isLoadingMessages = true;
    this.http.get<Message[]>(`${this.apiBaseUrl}/${forum.id}/messages`).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoadingMessages = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des messages:', error);
        this.isLoadingMessages = false;
      }
    });
  }

  hideForumDetails(): void {
    this.currentForum = null;
    this.messages = [];
    this.newMessageContent = '';
  }

  postMessage(): void {
    if (!this.newMessageContent || !this.currentForum) return;

    this.http
      .post(`${this.apiBaseUrl}/${this.currentForum.id}/messages`, {
        content: this.newMessageContent,
        user_id: 1 // Replace with actual user ID
      })
      .subscribe({
        next: () => {
          this.newMessageContent = '';
          this.showForumMessages(this.currentForum!);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi du message:', error);
        }
      });
  }
}
