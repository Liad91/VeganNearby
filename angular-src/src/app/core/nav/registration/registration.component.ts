import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
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
import { MzBaseModal } from 'ng2-materialize';
import { FileUploader, FileLikeObject, FileItem } from 'ng2-file-upload';

import { UsersService } from './../../../services/users.service';
import { AuthService } from './../../../services/auth.service';
import { slideIn, slideOut, popIn } from './../../../animations/slides';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('social', [
      transition(':enter', group([
        query('#facebook', slideIn('-20px', '180ms')),
        query('#google', slideIn('0, 20px', '180ms')),
        query('#twitter', slideIn('20px', '180ms'))
      ]))
    ]),
    trigger('error', [
      transition(':enter', slideIn('0, -20px', '200ms')),
      transition(':leave', slideOut('0, -20px', '200ms'))
    ]),
    trigger('preview', [
      transition(':enter', popIn('0.8', '150ms'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationComponent extends MzBaseModal implements OnInit {
  @ViewChild('modal')
  public modal;
  public mode = 'signIn';
  public form: FormGroup;
  public formErrorMessage: string;
  public uploadErrorMessage: string;
  public uploader: FileUploader;
  public userImageFile: File;
  public loading = false;
  public hasDropZoneOver = false;
  private allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg', ''];
  private maxFileSize = 1024 * 1024; // 1MB

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
    this.initializeUploader();
  }

  public onSwitchMode() {
    const username = new FormControl(null, [Validators.required, Validators.minLength(4)]);

    this.mode = this.mode === 'signIn' ? 'signUp' : 'signIn';
    if (this.formErrorMessage) {
      this.formErrorMessage = '';
    }
    if (this.uploadErrorMessage || this.uploader.queue.length > 0) {
      this.resetUploader();
    }
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
    if (this.formErrorMessage) {
      this.formErrorMessage = '';
    }
    this.loading = true;
    this.mode === 'signUp' ? this.signUp() : this.signIn();
  }

  public fileOver(e: any): void {
    this.hasDropZoneOver = e;
  }

  public resetUploader() {
    this.uploader.clearQueue();
    this.uploadErrorMessage = '';
    delete(this.userImageFile);
  }

  private initializeUploader() {
    this.uploader = new FileUploader({
      allowedMimeType: this.allowedMimeType,
      queueLimit: 1,
      maxFileSize: this.maxFileSize
    });

    this.uploader.onWhenAddingFileFailed = (item, filter, options) => this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onAfterAddingFile = item => this.onAfterAddingFile(item);
  }

  private onAfterAddingFile(item: FileItem) {
    if (this.uploadErrorMessage) {
      this.uploadErrorMessage = '';
    }
    this.userImageFile = item._file;
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

    if (error.type === 'authentication') {
      this.formErrorMessage = 'Email or password is incorrect';
    }
    else if (validationRegex.test(error.message)) {
      /** Handle validation errors */
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
    else if (error.type === 'upload') {
      this.formErrorMessage = error.message;
    }
    else {
      /** Handle server connection error */
      this.formErrorMessage = 'Oops something went wrong! Please try again later';
    }
  }

  private signUp() {
    const formData = new FormData();
    const form = this.form.value;

    for (const control in form) {
      if ((form as Object).hasOwnProperty(control)) {
        console.log(control, form[control]);
        formData.append(control, form[control]);
      }
    }
    if (this.userImageFile) {
      formData.append('avatar', this.userImageFile);
    }
    this.usersService.signUp(formData)
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
    this.authService.login(data);
    this.modal.close();
  }
}
