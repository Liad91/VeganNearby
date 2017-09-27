import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Location } from '@angular/common';
import { MzModalService } from 'ng2-materialize';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from './../../store/app.reducers';
import { State } from './../auth/store/auth.reducers';
import { AuthService } from './../auth/auth.service';
import * as AuthActions from './../auth/store/auth.actions';
import { User } from './../../models/user.model';
import { AuthComponent } from './../auth/auth.component';
import { ResizeService } from './../services/resize.service';
import { searchStateTrigger } from './animations';

@Component({
  selector: 'vn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    searchStateTrigger
  ]
})
export class NavComponent implements OnInit, OnDestroy {
  @Input() public mode: 'home' | 'page';
  public user: User;
  public mobileView: boolean;
  public searchBarOpen = false;
  public stateSubscription: Subscription;
  private resizeSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private location: Location,
    private authService: AuthService,
    private modalService: MzModalService,
    private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.stateSubscription = this.store.select('auth').subscribe(state => {
      this.user = state.user;
    });

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs';
        if (this.searchBarOpen && !this.mobileView) {
          this.searchBarOpen = false;
        }
      }
    );
  }

  public goBack() {
    this.location.back();
  }

  public openModal(): void {
    this.modalService.open(AuthComponent);
  }

  public logout(): void {
    this.store.dispatch(new AuthActions.Logout())
  }

  ngOnDestroy() {
    this.stateSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }
}
