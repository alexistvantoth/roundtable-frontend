import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket, private cookieService: CookieService) {}

  sendMessage(message: Message): void {
    this.socket.emit('sendMessage', message);
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  // getMessages(): Observable<Message> {
  //   //todo
  // }

  sendPrivateMessage(message: Message) {
    this.socket.emit('privateMessage', message);
  }

  getPrivateMessages(): Observable<Message> {
    return this.socket.fromEvent<Message>('privateMessage');
  }

  login(username: string) {
    this.cookieService.set('username', username);
    this.socket.emit('login', username);
  }

  logout() {
    const username = this.cookieService.get('username');
    if (username) {
      this.socket.emit('logout', username);
      this.cookieService.delete('username');
    }
  }
}
