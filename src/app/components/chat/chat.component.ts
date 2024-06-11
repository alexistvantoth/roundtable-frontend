import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Message } from '../../models/message.model';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private readonly mainChatRoom: string = 'Main Chat Room';

  form!: UntypedFormGroup;
  messages: Message[] = [];
  currentUser!: string;

  currentChannel: string = this.mainChatRoom;
  channels: Channel[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem('username') || '{}';

    this.form = new UntypedFormGroup({
      message: new FormControl(''),
    });

    this.form.controls['message'].valueChanges.subscribe((value) => {
      if (!value) {
        this.form.markAsPristine();
      }
    });

    this.channels.push(new Channel(this.mainChatRoom));

    this.getMessages(this.currentChannel);

    this.getChatRooms();

    this.addEventListeners();
  }

  sendMessage(to: string = this.mainChatRoom) {
    this.chatService.sendMessage(
      new Message(this.currentUser, to, this.form.get('message')!.value)
    );
    this.form.reset();
  }

  selectChannel(channel: Channel): void {
    this.currentChannel = channel.name;
    this.form.reset();
    this.getMessages(this.currentChannel);
  }

  logout() {
    this.chatService.logout(this.currentUser);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private getMessages(channel: string = this.mainChatRoom) {
    this.chatService.getMessages().subscribe({
      next: (messages) => {
        if (channel === this.mainChatRoom) {
          this.messages = messages.filter((msg) => msg.to === channel);
        } else {
          this.messages = messages.filter(
            (msg) =>
              (msg.to === channel && msg.from === this.currentUser) ||
              (msg.from === channel && msg.to === this.currentUser)
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private getChatRooms() {
    this.chatService.getChannels().subscribe({
      next: (channels) => {
        this.channels.push(
          ...channels.filter((channel) => channel.name !== this.currentUser)
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private addEventListeners() {
    this.chatService.getNewMessage().subscribe((message: Message) => {
      if (
        message.to === this.currentChannel ||
        message.from === this.currentChannel
      )
        this.messages.push(message);
    });

    this.chatService.handleJoinEvent().subscribe((joinedUserName: string) => {
      if (this.currentUser !== joinedUserName)
        this.channels.push(new Channel(joinedUserName));
    });

    this.chatService
      .handleDisconnectEvent()
      .subscribe((disconnectedUserName: string) => {
        this.channels = this.channels.filter(
          (channel) => channel.name !== disconnectedUserName
        );

        if (this.currentChannel === disconnectedUserName)
          this.selectChannel(
            this.channels.find((c) => c.name === this.mainChatRoom)!
          );
      });
  }
}
