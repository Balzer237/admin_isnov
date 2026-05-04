import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/navigation.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/40x40?text=JD'
  });

  currentUser$: Observable<User> = this.currentUserSubject.asObservable();

  constructor() {}

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  logout(): void {
    // Implement logout logic
    console.log('User logged out');
  }
}
