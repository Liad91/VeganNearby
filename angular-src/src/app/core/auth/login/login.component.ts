import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store/app.reducers';
import * as authActions from '../store/auth.actions';
import { AuthService } from '../auth.service';
import { AuthSocialService } from '../auth-social/auth-social.service';
import { errorStateTrigger } from '../animations';

@Component({
  selector: 'vn-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    errorStateTrigger
  ]
})

export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errorSubscription: Subscription;
  public formErrorMessage: string;
  public socialNetworks = ['google', 'twitter', 'facebook'];

  public errorMessageResources = {
    email: {
      required: 'Email is required.',
      email: 'Invalid email address.',
      unique: 'The email address has already been taken',
      validation: 'Email is invalid'
    },
    password: {
      required: 'Password is required.',
      minlength: 'The entered password is too short.',
      validation: 'Password is invalid'
    }
  };

  constructor(private store: Store<fromRoot.AppState>, private authService: AuthService, private authSocialService: AuthSocialService) {}

  ngOnInit() {
    this.initializeForm();
    this.errorSubscription = this.authService.loginFailure.subscribe(error => this.errorHandler(error));
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  public onSocialLogin(network: string): void {
    this.store.dispatch(new authActions.SocialLogin());
    this.authSocialService.login(network);
  }

  private errorHandler(error): void {
    switch (error.type) {
      case 'authentication':
        this.formErrorMessage = 'Email or password is incorrect';
        break;
      case 'validation':
        for (const control in error.message) {
          if ((error.message as Object).hasOwnProperty(control)) {
            const err = {};

            err[error.message[control]] = true;
            this.form.get(control).setErrors(err);
          }
        }
        break;
      case 'upload':
      case 'required':
        this.formErrorMessage = error.message;
        break;
      default:
        this.formErrorMessage = 'Oops something went wrong! Please try again later';
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.validateFormControls();
      return;
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = null;
    }
    this.store.dispatch(new authActions.Register(this.form.value));
  }

  private validateFormControls(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.controls[key];

      if (control.invalid) {
        control.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
