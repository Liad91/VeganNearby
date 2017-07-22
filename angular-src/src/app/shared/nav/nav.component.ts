import { Component, OnInit, OnDestroy, ComponentRef, ViewEncapsulation } from '@angular/core';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { AuthService } from './../../services/Auth.service';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  inputs: [
    'light'
  ],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit, OnDestroy {
  public light: boolean;
  public isAuth = false;

  constructor(private authService: AuthService, private modalService: MzModalService) {}
  
  ngOnInit() {
    this.authService.isAuthenticated.subscribe(
      status => this.isAuth = status
    );
  }

  openModal() {
    this.modalService.open(RegistrationComponent);
  }

  ngOnDestroy() {
    this.authService.isAuthenticated.unsubscribe();
  }

  singOut() {
    this.authService.clearStorage();
  }
}
