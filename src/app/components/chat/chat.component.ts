import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { Message } from '../../models/message.model';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Channel } from '../../models/channel.model';
import { Router } from '@angular/router';

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
  form!: UntypedFormGroup;
  messageContent!: string;
  recipient!: string;
  messages: Message[] = [];
  currentUser!: string;
  newMessage$!: Observable<Message>;

  channels: Channel[] = [];

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem('username') || '{}';

    this.form = new UntypedFormGroup({
      message: new FormControl(''),
    });

    this.channels.push(new Channel('RoundTable', this.messages));

    this.chatService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (err) => {
        console.error(err);
      },
    });

    return this.chatService.getNewMessage().subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

  sendMessage(to: string = 'RoundTable') {
    this.chatService.sendMessage(
      new Message(this.currentUser, to, this.form.get('message')?.value)
    );
    this.form.reset();
  }

  sendDirectMessage(to: string) {}

  selectChannel(channel: Channel): void {}

  logout() {
    this.chatService.logout(this.currentUser);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
