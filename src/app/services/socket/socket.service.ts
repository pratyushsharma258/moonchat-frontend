import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private connected = false;

  connect(url: string, endpoints: string[], messageHandler: (message: IMessage) => void): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      this.connected = true;

      endpoints.forEach(endpoint => {
        this.stompClient?.subscribe(endpoint, (message: IMessage) => {
          messageHandler(message);
        });
      });

    };

    this.stompClient.onDisconnect = () => {
      console.log('Disconnected');
      this.connected = false;
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate().then(() => {
        this.stompClient = null;
      });
      console.log('Disconnected from WebSocket');
      this.connected = false;
    }
  }

  sendMessage(destination: string, message: string): void {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: destination,
        body: message,
      });
    }
  }

  getSessionId(): string | null {
    if (this.stompClient && this.stompClient.webSocket) {
      const url = this.stompClient.webSocket.url;
      const sessionId = url.substring(url.lastIndexOf('/') + 1);
      return sessionId;
    }
    return null;
  }
}
