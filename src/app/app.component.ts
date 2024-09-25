// app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import {WebSocketService} from "./services/socket/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  message: string = '';

  constructor(private webSocketService: WebSocketService) {}

  // connect(): void {
  //   this.webSocketService.connect('http://localhost:8080/ws');
  // }
  //
  // disconnect(): void {
  //   this.webSocketService.disconnect();
  // }
  //
  // sendMessage(message: string) {
  //   this.webSocketService.sendMessage('/app/chat/send', JSON.stringify({ type: 'CHAT', content: message, sender: 'user' }));
  // }
}
