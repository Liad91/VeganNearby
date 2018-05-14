import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileLikeObject } from 'ng2-file-upload';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { mapTo, timeout } from 'rxjs/operators';

import { User } from './../../../models/user.model';
import { ConnectionService } from './../../services/connection.service';

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable()
export class AuthService {
  public error = new Subject<any>();
  public allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
  public maxFileSize = 1024 * 1024; // 1MB

  public errorMessageResources = {
    name: {
      required: 'Name can\'t be blank.',
      minlength: 'The entered name is too short.',
      validation: 'name is invalid.'
    },
    email: {
      required: 'Email can\'t be blank.',
      email: 'Invalid email address.',
      unique: 'The email address has already been taken.',
      validation: 'Email is invalid.'
    },
    password: {
      required: 'Password can\'t be blank.',
      minlength: 'The entered password is too short.',
      validation: 'Password is invalid.'
    }
  };

  constructor(private http: HttpClient, private connectionService: ConnectionService) { }

  public register(user: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/register`, user)
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/login`, user)
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public update(user: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/users/update`, user, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public setUserBackground(index: number): Observable<number> {
    return this.http.put(`${this.connectionService.serverUrl}/users/background`, { index }, {
      headers: new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    })
      .pipe(
        timeout(this.connectionService.reqTimeout),
        mapTo(index)
      );
  }

  public authenticate(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.connectionService.serverUrl}/auth/jwt`, {}, {
      headers: new HttpHeaders().set('Authorization', token)
    })
      .pipe(
        timeout(this.connectionService.reqTimeout)
      );
  }

  public storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  public removeToken() {
    localStorage.clear();
  }

  public validateFormControls(form: FormGroup): void {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        const control = form.controls[key];

        if (control.invalid) {
          control.markAsDirty();
        }
      }
    }
  }

  public formErrorHandler(error, form: FormGroup): string {
    switch (error.type) {
      case 'authentication':
        return 'Email or password is incorrect';
      case 'validation':
        for (const control in error.message) {
          if (error.message.hasOwnProperty(control)) {
            const err = {};

            err[error.message[control]] = true;
            form.get(control).setErrors(err);
          }
        }
        return '';
      case 'upload':
      case 'required':
        return error.message;
      default:
        return 'Oops something went wrong! Please try again later';
    }
  }

  public onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): string {
    switch (filter.name) {
      case 'fileSize':
        return `Maximum upload size exceeded (${Math.floor(this.maxFileSize / 1000000)}Mb allowed)`;
      case 'mimeType':
        const allowedTypes = this.allowedMimeType.map(type => type.substr(6)).join(', ');

        return `Type is not allowed. Allowed types: "${allowedTypes}"`;
      case 'queueLimit':
        return 'You can\'t upload more than one image';
      default:
        return 'Unknown error please try again later';
    }
  }
}
