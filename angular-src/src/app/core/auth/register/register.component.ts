import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store/app.reducers';
import * as authActions from '../store/auth.actions';
import { AuthService } from '../auth.service';
import { AuthSocialService } from '../auth-social/auth-social.service';
import { errorStateTrigger, imgPreviewStateTrigger } from '../animations';

@Component({
  selector: 'vn-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    errorStateTrigger,
    imgPreviewStateTrigger
  ]
})

export class RegisterComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errorSubscription: Subscription;
  public formErrorMessage: string;
  public uploadErrorMessage: string;
  public uploader: FileUploader;
  public userImageFile: File;
  public hasDropZoneOver = false;
  private allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
  private maxFileSize = 1024 * 1024; // 1MB

  public errorMessageResources = {
    username: {
      required: 'Username is required.',
      minlength: 'The entered username is too short.',
      unique: 'The username has already been taken',
      validation: 'Username is invalid'
    },
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
    this.initializeUploader();
    this.errorSubscription = this.authService.loginFailure.subscribe(error => this.errorHandler(error));
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.minLength(4)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
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
    this.register();
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

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
