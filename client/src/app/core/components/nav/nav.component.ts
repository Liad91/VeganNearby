import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';

import { SidenavButtonDirective } from './../../directives/sidenav-button.directive';
import { AuthModalComponent } from '../modals/auth-modal/auth-modal.component';
import { EditModalComponent } from '../auth/edit-modal/edit-modal.component';
import { User } from './../../../models/user.model';
import * as fromRoot from './../../../store/app.reducer';
import * as authActions from './../auth/store/auth.actions';
import { ModalService } from './../../services/modal.service';
import { UtilitiesService } from './../../services/utilities.service';
import { searchStateTrigger } from './animations';

@Component({
  selector: 'vn-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  animations: [
    searchStateTrigger
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild(SidenavButtonDirective) sidenavBtn: SidenavButtonDirective;
  @Input() public activatedRoute: string;
  public sticky = false;
  public user: User;
  private userSubscription: Subscription;
  public mobileView: boolean;
  public searchBarOpen = false;
  public backgroundLoading: boolean;
  private backgroundLoadingSubscription: Subscription;
  private scroll: Observable<any>;
  private scrollSubscription: Subscription;
  private resizeSubscription: Subscription;

  constructor(
    private location: Location,
    private store: Store<fromRoot.AppState>,
    private modalService: ModalService,
    private utilitiesService: UtilitiesService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userSubscription = this.store.select(fromRoot.selectAuthUser).subscribe(
      user => {
        this.user = user;
        this.changeDetectorRef.markForCheck();
      }
    );

    this.backgroundLoadingSubscription = this.store.select(fromRoot.selectAuthUserBackgroundLoading).subscribe(
      loading => {
        this.backgroundLoading = loading;
        this.changeDetectorRef.markForCheck();
      }
    );

    this.scroll = fromEvent(window, 'scroll');

    this.resizeSubscription = this.utilitiesService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'sm' || size === 'xs';

        if (this.mobileView) {
          this.scrollHandler();
          this.scrollSubscription = this.scroll.subscribe(() => this.scrollHandler());
        }
        else {
          if (this.scrollSubscription) {
            this.scrollSubscription.unsubscribe();
            this.sticky = false;
          }
          if (this.searchBarOpen) {
            this.searchBarOpen = false;
          }
          this.changeDetectorRef.markForCheck();
        }
      }
    );
  }

  private scrollHandler() {
    this.sticky = window.pageYOffset === 0 ? false : true;
    this.changeDetectorRef.markForCheck();
  }

  public navigate(url: string, data?: any) {
    this.utilitiesService.navigate([url], {}, { scroll: true, ...data });
  }

  public goBack() {
    this.utilitiesService.referrer ? this.location.back() : this.navigate('/');
  }

  public openAuthModal(event: Event, mode: 'login' | 'register'): void {
    /** prevent sidenav from closing */
    event.stopPropagation();
    this.modalService.openAuth(AuthModalComponent, mode);
  }

  public openEditModal(event: Event): void {
    /** prevent sidenav from closing */
    event.stopPropagation();

    this.modalService.open(EditModalComponent, { user: this.user });
  }

  public logout(): void {
    this.store.dispatch(new authActions.Logout());

    /** close sidenav */
    if (this.sidenavBtn) {
      this.sidenavBtn.hide();
    }
  }

  public setBackground(selected: number): void {
    if (this.user.background !== selected) {
      this.store.dispatch(new authActions.SetUserBackground(selected));
    }
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.backgroundLoadingSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();

    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }
}
