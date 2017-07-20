import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MzBaseModal } from 'ng2-materialize';

import { UsersService } from './../../../services/users.service';
import { slideBottom } from './../../../animations/slides';

@Component({
  selector: 'registration-modal',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    slideBottom
  ],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent extends MzBaseModal {
  @ViewChild('f')
  public ngForm: FormGroupDirective;
  public mode = 'signIn';
  public form: FormGroup;
  public registered = false;
  public submitting = false;
  public errorAnimationData = {
    value: 'inactive',
    params: { position: '-10px', duration: '150ms' }
  };
  public modalOptions: Materialize.ModalOptions = {
    dismissible: false,
    opacity: 0.5
  };  

  constructor(private usersService: UsersService) {
    super();
  }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    let username = new FormControl(null, [Validators.required, Validators.minLength(4)]);

    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    if (this.mode === 'signUp') {
      this.form.addControl('username', username);
    }
  }

  private registrationSucceeded(email) {
    this.submitting = false;
    this.onSwitchMode();
    this.form.get('email').setValue(email);
    this.registered = true;
  }

  private errorHandler(error) {
    this.submitting = false;

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

  onClose() {
   
  }

  errorMessage(control: string) {
    const errors = this.form.get(control).errors;
    let message: string;

    // this.submitting = false;
    if (errors) {
      if (errors.required) {
        message = 'The filed is required';
      }
      else if (errors.email) {
        message = 'Invalid email address';
      }
      else if (errors.minlength) {
        if (control === 'password' && this.mode === 'signIn') {
          message = 'The entered password is too short';
        }
        else {
          message = `Use at least ${errors.minlength.requiredLength} characters`;
        }
      }
      else if (errors.unique) {
        message = `The ${errors.unique} has already been taken`;
      }
      else {
        message = 'The filed is invalid';
      }
    }
    return message;
  }

  controlStatus(controlName: string) {
    const control = this.form.get(controlName);

    if ((control.invalid && (control.touched || control.dirty)) || (this.ngForm.submitted && control.invalid)) {
      return 'invalid';
    }
    else if (control.valid && (control.touched || control.dirty)) {
      return 'valid';
    }
  }

  onSwitchMode() {
    this.mode = this.mode === 'signIn' ? 'signUp' : 'signIn';
    // this.dialogRef.disableClose = this.mode === 'signIn' ? false : true;
    this.registered = false;
    /** Reset the submitted state of the form */
    this.ngForm.resetForm();    
    this.initializeForm();
  }

  onSubmit() {  
    if (this.form.invalid) {
      return;
    }
    this.submitting = true;
    if (this.mode === 'signUp') {
      this.usersService.signUp(this.form.value)
        .subscribe(
          response => this.registrationSucceeded(response.email),
          error => this.errorHandler(error)
        );
    }
    else {
      this.usersService.signIn(this.form.value)
        .subscribe(
          // response => this.dialogRef.close(),
          // error => this.errorHandler(error)
        )
    }
  }
}
