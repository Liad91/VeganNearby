import { Component,ViewChild } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { FormGroupDirective, FormGroup, FormControl, Validators } from '@angular/forms'

import { UsersService } from './../../services/users.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styles: [`
    .mat-typography h3 {
      margin-bottom: 0;
    }
    .mat-button {
      color: #fff;
    }
    md-progress-spinner.mat-progress-spinner.mat-primary {
      display: inline-flex;
      width: 20px;
      height: 20px;
    }
  `]
})
export class LogComponent {
  
}
