import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: Socket,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  sendMessage(message: Message): void {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>('http://localhost:3000/chat');
  }

  sendPrivateMessage(message: Message) {
    this.socket.emit('privateMessage', message);
  }

  getPrivateMessages(): Observable<Message> {
    return this.socket.fromEvent<Message>('privateMessage');
  }

  logout(user: string) {
    if (user) {
      // http delete call to this user from the db
    }
  }
}
