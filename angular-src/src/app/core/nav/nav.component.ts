import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MzModalService } from 'ng2-materialize';

import { AuthService } from './../../services/auth.service';
import { RegistrationComponent } from './registration/registration.component';
import { User } from './../../models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  inputs: [
    'search',
    'transparent'
  ],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {
  public user: User;
  public search: boolean;
  public transparent: boolean;
  public isAuth = false;

  constructor(private authService: AuthService, private modalService: MzModalService) {}

  ngOnInit() {
    this.user = this.authService.user;
  }

  public currentUser() {
    let user: string;

    switch (this.user.id) {
      case(''):
        user = '';
        break;
      case('1'):
        user = 'guest';
        break;
      default:
        user = 'user';
    }
    return user;
  }

  openModal() {
    this.modalService.open(RegistrationComponent);
  }

  singOut() {
    console.log('Called');
    this.authService.logout();
  }
}
