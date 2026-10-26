import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  private readonly auth =
    inject(Auth);

  private readonly router =
    inject(Router);


  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }


  getEmail(): string | null {
    return this.auth.getEmail();
  }


  getRole(): string | null {
    return this.auth.getRole();
  }


  logout(): void {

    this.auth.logout()
      .subscribe({
        next: () => {
          this.router.navigate([
            '/login'
          ]);
        },

        error: () => {
          this.router.navigate([
            '/login'
          ]);
        }
      });
  }
}