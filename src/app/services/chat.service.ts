import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { Channel } from '../models/channel.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket, private http: HttpClient) {}

  sendMessage(message: Message): void {
    this.socket.emit('sendMessage', message);
  }

  handleJoinEvent(): Observable<string> {
    return this.socket.fromEvent<string>('userJoined');
  }

  handleDisconnectEvent(): Observable<string> {
    return this.socket.fromEvent<string>('userDisconnected');
  }

  getNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${environment.serverBaseUrl}:${environment.port}/chat`
    );
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get<Channel[]>(
      `${environment.serverBaseUrl}:${environment.port}/chat/channels`
    );
  }

  isUserNameTaken(username: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${environment.serverBaseUrl}:${environment.port}/chat/${username}`
    );
  }

  login(user: string) {
    if (user) {
      this.socket.emit('login', user);
    }
  }

  logout(user: string) {
    if (user) {
      this.socket.emit('logout', user);
    }
  }
}
