// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  // List of admin emails - in production, this should be managed in a backend
  private adminEmails = ['admin@military.mil', 'admin@navy.mil', 'admin@army.mil'];

  login(email: string, password: string): boolean {
    // For now, accept any valid .mil email with a password
    // Later you can add real authentication logic
    const milEmailPattern = /^[^\s@]+@[^\s@]+\.mil$/i;
    if (milEmailPattern.test(email) && password) {
      this.isAuthenticated = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Set admin status
      if (this.adminEmails.includes(email.toLowerCase())) {
        localStorage.setItem('isAdmin', 'true');
      }
      
      return true;
    }
    return false;
  }

  loginWithCAC(): void {
    // CAC login - bypass email/password validation
    this.isAuthenticated = true;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', 'cac.user@military.mil');
    localStorage.setItem('loginMethod', 'CAC');
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('isAdmin');
  }

  isLoggedIn(): boolean {
    // Check localStorage to persist login across page refreshes
    const loggedIn = localStorage.getItem('isLoggedIn');
    this.isAuthenticated = loggedIn === 'true';
    return this.isAuthenticated;
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isAdmin(): boolean {
    const userEmail = this.getUserEmail();
    return localStorage.getItem('isAdmin') === 'true' || 
           (userEmail ? this.adminEmails.includes(userEmail.toLowerCase()) : false);
  }
}