import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';
import { MzModalService } from 'ng2-materialize';

import { AuthService } from './../../services/auth.service';
import { RegistrationComponent } from './registration/registration.component';
import { User } from './../../models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit {
  @Input()
  public search: boolean;
  @Input()
  public transparent: boolean;
  public user: User;
  public isAuth = false;

  constructor(private authService: AuthService, private modalService: MzModalService) {}

  ngOnInit(): void {
    this.user = this.authService.user;
  }

  public currentUser(): string {
    let user: string;
    switch (this.user._id) {
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

  public openModal(): void {
    this.modalService.open(RegistrationComponent);
  }

  public singOut(): void {
    this.authService.logout();
  }
}
