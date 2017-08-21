import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  FormControl,
  Validators
} from '@angular/forms';
import {
  trigger,
  group,
  query,
  transition
} from '@angular/animations';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { MzBaseModal } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription'

import { ProfileService } from './profile.service';
import { SocialProfileService } from './social-profile/social-profile.service';
import { AuthService } from './../../services/auth.service';
import { socialBtnStateTrigger, errorStateTrigger, imgPreviewStateTrigger } from './animations';
import { AuthSuccessResponse, AuthFailedResponse } from './../../../models/auth-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    socialBtnStateTrigger,
    errorStateTrigger,
    imgPreviewStateTrigger
  ]
})
export class ProfileComponent extends MzBaseModal implements OnInit, OnDestroy {
  @ViewChild('modal')
  public modal;
  public mode = 'signIn';
  public form: FormGroup;
  public socialSubscription: Subscription;
  public formErrorMessage: string;
  public uploadErrorMessage: string;
  public uploader: FileUploader;
  public userImageFile: File;
  public loading = false;
  public hasDropZoneOver = false;
  private allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
  public socialNetworks = ['twitter', 'google', 'facebook'];
  private maxFileSize = 1024 * 1024; // 1MB

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false,
    opacity: 0.5
  };

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

  constructor(private profileService: ProfileService,
              private authService: AuthService,
              private socialProfileService: SocialProfileService) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.createUploader();

    this.socialSubscription = this.socialProfileService.response.subscribe(
      data => this.onSocialLoginSuccess(data),
      error => this.onSocialLoginFailed()
    )
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  private createUploader(): void {
    this.uploader = new FileUploader({
      allowedMimeType: this.allowedMimeType,
      queueLimit: 1,
      maxFileSize: this.maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
  }

  private onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): void {
    console.log(item)
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

  public onSwitchMode(): void {
    const username = new FormControl(null, [Validators.required, Validators.minLength(4)]);

    this.mode = this.mode === 'signIn' ? 'signUp' : 'signIn';
    if (this.formErrorMessage) {
      this.formErrorMessage = '';
    }
    if (this.mode === 'signUp') {
      this.form.addControl('username', username);
    }
    else {
      this.form.removeControl('username');
      if (this.uploadErrorMessage || this.uploader.queue.length > 0) {
        this.onResetUploader();
      }
    }
    this.form.reset();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = '';
    }
    this.loading = true;
    this.mode === 'signUp' ? this.signUp() : this.signIn();
  }

  private signUp(): void {
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
    this.profileService.signUp(formData)
      .subscribe(
        data => this.signIn(),
        error => this.errorHandler(error)
      );
  }

  private signIn(): void {
    this.profileService.signIn(this.form.value)
      .subscribe(
        response => this.onSignInSuccess(response),
        error => this.errorHandler(error)
      )
  }

  private onSignInSuccess(response: AuthSuccessResponse): void {
    this.authService.login(response);
    this.modal.close();
  }

  public onSocialLogin(network: string): void {
    this.loading = true;
    this.socialProfileService.login(network);
  }

  private onSocialLoginFailed(): void {
    this.loading = false;
  }

  private onSocialLoginSuccess(data): void {
    this.loading = false;

    if (!data.failed) {
      this.onSignInSuccess(data);
    }
  }

  private errorHandler(error): void {
    this.loading = false;

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
    this.socialSubscription.unsubscribe();
  }
}
