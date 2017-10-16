import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  Validators
} from '@angular/forms';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/take';


import * as fromRoot from './../../store/app.reducers';
import * as authActions from './store/auth.actions';
import { State } from './store/auth.reducers';
import { AuthService } from './auth.service';
import { AuthSocialService } from './auth-social/auth-social.service';
import { socialBtnStateTrigger, errorStateTrigger, imgPreviewStateTrigger } from './animations';

@Component({
  selector: 'vn-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    socialBtnStateTrigger,
    errorStateTrigger,
    imgPreviewStateTrigger
  ]
})
export class AuthComponent implements OnInit, OnDestroy {
  @Input() mode: 'login' | 'register';
  public form: FormGroup;
  public loading: Observable<boolean>;
  public errorSubscription: Subscription;
  public formErrorMessage: string;
  public uploadErrorMessage: string;
  public uploader: FileUploader;
  public userImageFile: File;
  public hasDropZoneOver = false;
  public socialNetworks = ['twitter', 'google', 'facebook'];
  private allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
  private maxFileSize = 1024 * 1024; // 1MB

  public errorMessageResources = {
    email: {
      required: 'Email is required.',
      email: 'Invalid email address.',
      unique: 'The email address has already been taken',
      validation: 'Email is invalid'
    },
    username: {
      required: 'Username is required.',
      minlength: 'The entered username is too short.',
      unique: 'The username has already been taken',
      validation: 'Username is invalid'
    },
    password: {
      required: 'Password is required.',
      minlength: 'The entered password is too short.',
      validation: 'Password is invalid'
    }
  };

  constructor(private store: Store<fromRoot.AppState>, private authService: AuthService, private authSocialService: AuthSocialService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.initializeUploader();

    this.loading = this.store.select(fromRoot.selectAuthLoading);
    this.errorSubscription = this.authService.loginFailure.subscribe(error => this.errorHandler(error));
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    if (this.mode === 'register') {
      const username = new FormControl(null, [Validators.required, Validators.minLength(4)]);

      this.form.addControl('username', username);
    }
  }

  private initializeUploader(): void {
    this.uploader = new FileUploader({
      allowedMimeType: this.allowedMimeType,
      queueLimit: 1,
      maxFileSize: this.maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
  }

  private onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): void {
    switch (filter.name) {
      case 'fileSize':
        this.uploadErrorMessage = `Maximum upload size exceeded (${Math.floor(this.maxFileSize / 1000000)}Mb allowed)`;
        break;
      case 'mimeType':
        const allowedTypes = this.allowedMimeType.map(type => type.substr(6) ).join(', ');

        this.uploadErrorMessage = `Type is not allowed. Allowed types: "${allowedTypes}"`;
        break;
      case 'queueLimit':
        this.uploadErrorMessage = 'You can\'t upload more than one image';
        break;
      default:
        this.uploadErrorMessage = 'Unknown error please try again later';
    }
  }

  private onAfterAddingFile(item: FileItem): void {
    if (this.uploadErrorMessage) {
      this.uploadErrorMessage = '';
    }
    this.userImageFile = item._file;
  }

  public onResetUploader(): void {
    this.uploader.clearQueue();
    this.uploadErrorMessage = '';
    delete(this.userImageFile);
  }

  public onFileOver(event: any): void {
    this.hasDropZoneOver = event;
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.validateFormControls();
      return;
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = '';
    }
    this.mode === 'login' ?  this.login() : this.register();
  }

  private validateFormControls(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.controls[key];

      if (control.invalid) {
        control.markAsDirty();
      }
    });
  }

  private register(): void {
    const formData = new FormData();
    const form = this.form.value;

    for (const control in form) {
      if ((form as Object).hasOwnProperty(control)) {
        formData.append(control, form[control]);
      }
    }
    if (this.userImageFile) {
      formData.append('avatar', this.userImageFile);
    }
    this.store.dispatch(new authActions.Register(formData));
  }

  private login(): void {
    this.store.dispatch(new authActions.Register(this.form.value));
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

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
