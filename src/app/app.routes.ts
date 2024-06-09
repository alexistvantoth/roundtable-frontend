import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('../app/components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('../app/components/chat/chat.component').then(
        (mod) => mod.ChatComponent
      ),
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
