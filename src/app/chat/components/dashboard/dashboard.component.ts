import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebSocketService} from "../../../services/socket/socket.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  messages: Array<string> = [];
  message: string = '';
  sidebarVisible: boolean = false;
  userDetails: any = {};

  constructor(private webSocketService: WebSocketService, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.webSocketService.connect('http://localhost:8080/ws');
    this.http.get(
      'http://localhost:8080/api/user/me'
    ).subscribe({
      next: (response: any) => {
        this.userDetails = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
  }

  onSubmit() {
    this.webSocketService.sendMessage('/app/chat/send', JSON.stringify({
      type: 'CHAT',
      content: this.message,
      sender: this.userDetails.username
    }));
  }
}
