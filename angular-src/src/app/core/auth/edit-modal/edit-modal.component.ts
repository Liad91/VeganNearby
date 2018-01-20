import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MzBaseModal } from 'ng2-materialize';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../../store/app.reducer';
import * as authActions from '../store/auth.actions';
import { AuthService } from '../auth.service';
import { AuthSocialService } from '../auth-social/auth-social.service';
import { errorStateTrigger } from '../../../shared/animations';
import { imgPreviewStateTrigger } from '../animations';
import { ModalService } from './../../services/modal.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'vn-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
  animations: [
    errorStateTrigger,
    imgPreviewStateTrigger
  ]
})

export class EditModalComponent extends MzBaseModal implements OnInit, OnDestroy {
  @Input() user: User;
  public form: FormGroup;
  public loading: Observable<boolean>;
  public errorSubscription: Subscription;
  public formErrorMessage: string;
  public uploadErrorMessage: string;
  public uploader: FileUploader;
  public userImageFile: File;
  public userImageUrl: string;
  public hasDropZoneOver = false;
  public errorMessageResources;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5
  };

  constructor(
    private store: Store<fromRoot.AppState>,
    private authService: AuthService,
    private authSocialService: AuthSocialService,
    private modalService: ModalService) {
      super();
    }

  ngOnInit() {
    this.initializeForm();
    this.initializeUploader();
    this.userImageUrl = this.user.avatarUrl;
    this.errorMessageResources = this.authService.errorMessageResources;
    this.loading = this.store.select(fromRoot.selectAuthUpdateLoading);
    this.errorSubscription = this.authService.error.subscribe(
      error => this.formErrorMessage = this.authService.formErrorHandler(error, this.form)
    );
  }

  private initializeForm(): void {
    this.form = new FormGroup({
      'username': new FormControl(this.user.username, [Validators.required, Validators.minLength(4)]),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email])
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
      return this.authService.validateFormControls(this.form);
    }
    if (this.formErrorMessage) {
      this.formErrorMessage = null;
    }
    this.update();
  }

  private update(): void {
    if (this.userImageUrl) {
      this.form.addControl('image', new FormControl(this.userImageUrl));
    }

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
    this.store.dispatch(new authActions.Update(formData));
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
