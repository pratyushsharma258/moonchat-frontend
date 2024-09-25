import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebSocketService} from "../../../services/socket/socket.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserInfo} from "../../../models/user-info";
import {AuthService} from "../../../services/auth/auth.service";
import {IMessage} from '@stomp/stompjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  messages: Array<string> = [];
  message: string = '';
  sidebarVisible: boolean = false;
  userDetails: UserInfo = {};
  users: Array<UserInfo> = [];
  currentUser: UserInfo = {};

  constructor(private webSocketService: WebSocketService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.http.get('http://localhost:8080/api/user/me').subscribe({
      next: (response: any) => {
        this.userDetails = response;
        this.webSocketService.connect('http://localhost:8080/ws', [`/topic/private/${this.userDetails.username}`], this.handleIncomingMessage.bind(this));
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.http.get('http://localhost:8080/api/user/users').subscribe({
      next: (response: any) => {
        this.users = response;
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
    this.webSocketService.sendMessage('/app/chat/private', JSON.stringify({
      type: 'CHAT',
      content: this.message,
      sender: this.userDetails.username,
      receiver: this.currentUser.username
    }));
  }

  logOut() {
    this.authService.clearToken();
    this.router.navigate(['/auth/login']).then(r => r);
  }

  setCurrentUser(user: UserInfo) {
    this.currentUser = user;
  }

  private handleIncomingMessage(message: IMessage) {
    const parsedMessage = JSON.parse(message.body);
    console.log('Received message: ', parsedMessage.content);
    this.messages.push(parsedMessage.content);
  }
}
