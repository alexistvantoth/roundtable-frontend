import { Component, importProvidersFrom } from '@angular/core';
import { socketIoConfig } from '../../socket-io.config';
import { ChatService } from '../app/services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { Message } from '../app/models/message.model';
import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

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
  messages: string[] = [];
  username!: string;
  newMessage$!: Observable<Message>;

  constructor(
    private chatService: ChatService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      message: new FormControl(''),
    });

    this.username = this.cookieService.get('username');
    return this.chatService.getNewMessage().subscribe((message: Message) => {
      this.messages.push(message.content);
    });
  }

  sendMessage() {
    this.chatService.sendMessage(
      new Message('Sender', 'Recipient', this.form.get('message')?.value, false)
    );
    this.form.reset();
  }

  logout() {
    this.chatService.logout();
  }
}
