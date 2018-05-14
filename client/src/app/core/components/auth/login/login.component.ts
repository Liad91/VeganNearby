import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { errorStateTrigger } from '../../../../shared/animations';
import * as fromRoot from '../../../../store/app.reducer';
import { AuthSocialService } from '../auth-social/auth-social.service';
import { AuthService } from '../auth.service';
import * as authActions from '../store/auth.actions';

@Component({
  selector: 'vn-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [errorStateTrigger]
})

export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errorSubscription: Subscription;
  public formErrorMessage: string;
  public errorMessageResources;

  constructor(private store: Store<fromRoot.AppState>, private authService: AuthService, private authSocialService: AuthSocialService) { }

  ngOnInit() {
    this.initializeForm();
    this.errorMessageResources = this.authService.errorMessageResources;
    this.errorSubscription = this.authService.error.subscribe(
      error => this.formErrorMessage = this.authService.formErrorHandler(error, this.form)
    );
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

  public onSubmit(): void {
    if (this.form.invalid) {
      this.authService.validateFormControls(this.form);
      return;
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = null;
    }
    this.store.dispatch(new authActions.Login(this.form.value));
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
