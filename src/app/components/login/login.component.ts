import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
})
export class LoginComponent {
  username: string = '';

  constructor(private chatService: ChatService, private router: Router) {}

  login(): void {
    if (this.username.trim()) {
      //http call to fetch existing username
      //if not used yet proceed
      //else error
      localStorage.setItem('username', this.username);
      this.router.navigate(['/chat']);
    } else {
      alert('Please enter a username.');
    }
  }
}
