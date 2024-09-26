import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebSocketService} from "../../../services/socket/socket.service";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserInfo} from "../../../models/user-info";
import {AuthService} from "../../../services/auth/auth.service";
import {IMessage} from '@stomp/stompjs';
import {ChatMessage} from "../../../models/chat-message";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  messages: Array<ChatMessage> = [];
  message: string = '';
  sidebarVisible: boolean = false;
  userDetails: UserInfo = {};
  users: Array<UserInfo> = [];
  currentUser: UserInfo = {};

  constructor(private webSocketService: WebSocketService,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService,
              private datePipe: DatePipe) {
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

    this.http.get('http://localhost:8080/api/user/messages').subscribe({
      next: (response: any) => {
        this.messages = response
          .sort((a: ChatMessage, b: ChatMessage) => {
            const dateA = new Date(a.sentAt ?? 0).getTime();
            const dateB = new Date(b.sentAt ?? 0).getTime();
            return dateA - dateB;
          })
          .filter((message: { sentAt: any; }, index: any, self: any[]) =>
            index === self.findIndex((m) => m.sentAt === message.sentAt)
          );
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
      receiver: this.currentUser.username,
      sessionId: this.webSocketService.getSessionId(),
      sentAt: new Date().toISOString(),
    }));
  }

  logOut() {
    this.authService.clearToken();
    this.router.navigate(['/auth/login']).then(r => r);
  }

  setCurrentUser(user: UserInfo) {
    this.currentUser = user;
    // console.log('Selected user: ', user);
    // console.log('Current user: ', this.userDetails);
  }

  private handleIncomingMessage(message: IMessage) {
    const parsedMessage = JSON.parse(message.body);
    console.log('Received message: ', parsedMessage.content);
    this.messages.push(parsedMessage.content);
  }

  formatDateTimeToTime(dateTime: string | undefined): string {
    if (!dateTime) {
      return '';
    }
    const date = new Date(dateTime);
    const formattedTime = this.datePipe.transform(date, 'h:mm a');
    return formattedTime ? formattedTime : dateTime;
  }

  formatDateTimeToDate(dateTime: string | undefined): string {
    if (!dateTime) {
      return '';
    }
    const date = new Date(dateTime);
    const formattedDate = this.datePipe.transform(date, 'd\'th\' MMM yyyy');
    return formattedDate ? formattedDate : dateTime;
  }

  hasDateChanged(currentMessage: ChatMessage, previousMessage: ChatMessage | null): boolean {
    if (!previousMessage) {
      return true;
    }
    if (!currentMessage.sentAt || !previousMessage.sentAt) {
      return false;
    }
    const currentDate = new Date(currentMessage.sentAt).toDateString();
    const previousDate = new Date(previousMessage.sentAt).toDateString();
    return currentDate !== previousDate;
  }
}
