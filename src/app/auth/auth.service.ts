import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private auth: Auth,
    private trainingService: TrainingService
  ) {}

  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  initAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
      })
      .catch((error) => {
        console.log(error);
      });

  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
