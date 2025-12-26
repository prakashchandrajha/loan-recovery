import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_USERS } from './mock-users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any;

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      this.currentUser = user;
      switch (user.role) {
        case 'Division':
          this.router.navigate(['/division-dashboard']);
          break;
        case 'Recovery':
          this.router.navigate(['/recovery-dashboard']);
          break;
        case 'Legal':
          this.router.navigate(['/legal-dashboard']);
          break;
        case 'RegionalOffice1':
          this.router.navigate(['/regional-office-1-dashboard']);
          break;
        case 'RegionalOffice2':
          this.router.navigate(['/regional-office-2-dashboard']);
          break;
        case 'AuthorizedOfficer':
          this.router.navigate(['/officer-dashboard']);
          break;
        case 'Admin':
          this.router.navigate(['/admin-dashboard']);
          break;
        default:
          this.router.navigate(['/']);
          break;
      }
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    this.router.navigate(['/']);
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
