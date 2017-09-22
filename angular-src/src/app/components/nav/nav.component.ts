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
  public user: User;
  public isAuth = false;
  public searchBarOpen = false;
  public mobileView: boolean;
  private resizeSubscription: Subscription;

  constructor(
    private location: Location,
    private authService: AuthService,
    private modalService: MzModalService,
    private resizeService: ResizeService) {}

  ngOnInit(): void {
    this.user = this.authService.user;
    this.resizeSubscription = this.resizeService.screenSize.subscribe(
      size => {
        this.mobileView = size === 'xs';
        if (this.searchBarOpen && !this.mobileView) {
          this.searchBarOpen = false;
        }
      }
    );
  }

  public getCurrentUser(): string {
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
    this.resizeSubscription.unsubscribe();
  }
}
