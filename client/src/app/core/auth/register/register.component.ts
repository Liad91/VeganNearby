import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store/app.reducer';
import * as authActions from '../store/auth.actions';
import { AuthService } from '../auth.service';
import { AuthSocialService } from '../auth-social/auth-social.service';
import { errorStateTrigger } from '../../../shared/animations';
import { imgPreviewStateTrigger } from '../animations';
import { ModalService } from './../../services/modal.service';

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
  public errorMessageResources;

  constructor(
    private store: Store<fromRoot.AppState>,
    private authService: AuthService,
    private authSocialService: AuthSocialService,
    private modalService: ModalService) {}

  ngOnInit() {
    this.initializeForm();
    this.initializeUploader();
    this.errorMessageResources = this.authService.errorMessageResources;
    this.errorSubscription = this.authService.error.subscribe(
      error => this.formErrorMessage = this.authService.formErrorHandler(error, this.form)
    );
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
      allowedMimeType: this.authService.allowedMimeType,
      queueLimit: 1,
      maxFileSize: this.authService.maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => {
      this.uploadErrorMessage = this.authService.onWhenAddingFileFailed(item, filter, options);
    };
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
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

  public onClose(): void {
    this.modalService.close();
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.authService.validateFormControls(this.form);
      return;
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = null;
    }
    this.register();
  }

  private register(): void {
    const formData = new FormData();
    const form = this.form.value;

    for (const control in form) {
      if (form.hasOwnProperty(control)) {
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
