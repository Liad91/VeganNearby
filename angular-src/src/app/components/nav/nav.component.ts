import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
import { Location } from '@angular/common';
import { MzModalService } from 'ng2-materialize';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ProfileComponent } from '../profile/profile.component';
import { ResizeService } from './../../services/resize.service';
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
  public currentUser: User | void;
  public isAuth = false;
  public searchBarOpen = false;
  public mobileView: boolean;
  private userSubscription: Subscription;
  private resizeSubscription: Subscription;

  constructor(
    private location: Location,
    private authService: AuthService,
    private modalService: MzModalService,
    private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser.subscribe(
      user => this.currentUser = user
    );

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
    this.modalService.open(ProfileComponent);
  }

  public singOut(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }
}
