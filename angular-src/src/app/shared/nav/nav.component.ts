import { Component, OnInit, OnDestroy, ComponentRef, ViewEncapsulation } from '@angular/core';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { AuthService } from './../../services/Auth.service';
import { RegistrationComponent } from './registration/registration.component';

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
export class NavComponent implements OnInit, OnDestroy {
  public search: boolean;
  public transparent: boolean;
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
