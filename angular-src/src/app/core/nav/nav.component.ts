import { Component, ViewChild, Input, OnDestroy, OnInit } from '@angular/core';
import { MzModalService } from 'ng2-materialize';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as fromRoot from './../../store/app.reducers';
import * as authActions from './../auth/store/auth.actions';
import { User } from './../../models/user.model';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';
import { ResizeService } from './../services/resize.service';
import { searchStateTrigger } from './animations';
import { SidenavButtonDirective } from '../../shared/directives/sidenav-button.directive';

@Component({
  selector: 'vn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    searchStateTrigger
  ]
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild(SidenavButtonDirective) sidenavBtn: SidenavButtonDirective;
  @Input() public activatedRoute: 'home' | 'places';
  public user: Observable<User>;
  public mobileView: boolean;
  public searchBarOpen = false;
  public backgroundLoading: Observable<boolean>;
  private resizeSubscription: Subscription;

  constructor(private store: Store<fromRoot.AppState>, private modalService: MzModalService, private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.user = this.store.select(fromRoot.selectAuthUser);
    this.backgroundLoading = this.store.select(fromRoot.selectAuthUserBackgroundLoading);

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs';
        if (this.searchBarOpen && !this.mobileView) {
          this.searchBarOpen = false;
        }
      }
    );
  }

  public openModal(event: Event): void {
    /** prevent sidenav from closing */
    event.stopPropagation();
    this.modalService.open(AuthModalComponent);
  }

  public logout(): void {
    this.store.dispatch(new authActions.Logout());
    this.sidenavBtn.hide();
  }

  public setBackground(selected: number): void {
    this.user.take(1).subscribe(user => {
      if (user.background !== selected) {
        this.store.dispatch(new authActions.SetUserBackground(selected));
      }
    });
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
