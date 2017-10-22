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

import * as fromRoot from './../../store/app.reducers';
import * as authActions from './../auth/store/auth.actions';
import { User } from './../../models/user.model';
import { AuthModalComponent } from '../auth/auth-modal/auth-modal.component';
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
  @Input() public activatedRoute: 'home' | 'places';
  public user: Observable<User>;
  public mobileView: boolean;
  public searchBarOpen = false;
  private resizeSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.AppState>,
    private location: Location,
    private modalService: MzModalService,
    private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.user = this.store.select(fromRoot.selectAuthUser);

    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs';
        if (this.searchBarOpen && !this.mobileView) {
          this.searchBarOpen = false;
        }
      }
    );
  }

  public goBack(): void {
    this.location.back();
  }

  public openModal(): void {
    this.modalService.open(AuthModalComponent);
  }

  public logout(): void {
    this.store.dispatch(new authActions.Logout())
  }

  public setBackground(index: number): void {
    this.store.dispatch(new authActions.SetUserBackground(index));
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}
