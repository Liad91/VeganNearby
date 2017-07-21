import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { trigger, group, query, transition } from '@angular/animations';
import { MzBaseModal } from 'ng2-materialize';

import { UsersService } from './../../../services/users.service';
import { AuthService } from './../../../services/Auth.service';
import { slideIn } from './../../../animations/slides';

@Component({
  selector: 'registration-modal',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('social', [
      transition(':enter', group([
        query('#facebook', slideIn('-20px', '180ms')),
        query('#google', slideIn('0, 20px', '180ms')),
        query('#twitter', slideIn('20px', '180ms'))
      ]))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent extends MzBaseModal {
  @ViewChild('modal')
  public modal;
  public mode = 'signIn';
  public form: FormGroup;
  public loading = false;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false,
    opacity: 0.5
  };

  public errorMessageResources = {
    email: {
      required: 'Email is required.',
      email: 'Invalid email address.',
      unique: 'The email address has already been taken'
    },
    username: {
      required: 'Username is required.',
      minlength: 'The entered username is too short.',
      unique: 'The username has already been taken'
    },
    password: {
      required: 'Password is required.',
      minlength: 'The entered password is too short.'
    }
  };

  constructor(private usersService: UsersService, private authService: AuthService) {
    super();
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  private errorHandler(error) {
    this.loading = false;

    const validationRegex = /^User validation failed:/;
    const uniqueRegex = /Unique validation failed:/;

    if (error.message === 'Authentication failed') {
      this.form.setErrors({error: 'Email or password is incorrect'});
    }
    /** Handle validation errors */
    else if (validationRegex.test(error.message)) {
      if (uniqueRegex.test(error.message)) {
        /** Handle unique errors */
        const controls = error.message.split(':')[3].split(',');

        controls.forEach(control => {
          this.form.get(control.trim()).setErrors({unique: control});
        });
      }
      else {
        /** Handle validation errors */
        const control = error.message.split(':')[1].trim();

        this.form.get(control).setErrors({validation: true});
      }
    }
    else {
      /** Handle server connection error */
      this.form.setErrors({error: 'Oops something went wrong! Please try again later'});
    }
  }

  private signUp() {
    this.usersService.signUp(this.form.value)
      .subscribe(
        data => this.signIn(),
        error => this.errorHandler(error)
      );
  }

  private signIn() {
    this.usersService.signIn(this.form.value)
      .subscribe(
        data => this.signInSucceeded(data),
        error => this.errorHandler(error)
      )
  }

  private signInSucceeded(data) {
    this.authService.setUserData(data);
    this.modal.close();
  }

  public onSwitchMode() {
    let username = new FormControl(null, [Validators.required, Validators.minLength(4)]);
    
    this.mode = this.mode === 'signIn' ? 'signUp' : 'signIn';    
    if (this.mode === 'signUp') {
      this.form.addControl('username', username);
    }
    else {
      this.form.removeControl('username');
    }
    this.form.reset(); 
  }

  public onSubmit() {  
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.mode === 'signUp' ? this.signUp() : this.signIn();
  }
}
