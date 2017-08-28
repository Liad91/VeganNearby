import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import { MzModalService } from 'ng2-materialize';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ProfileComponent } from '../profile/profile.component';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
	@Input() public slim: boolean;
	public user: User;
	public isAuth = false;

	constructor(private authService: AuthService, private modalService: MzModalService) {}

	ngOnInit(): void {
		this.user = this.authService.user;
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

	public openModal(): void {
		this.modalService.open(ProfileComponent);
	}

	public singOut(): void {
		this.authService.logout();
	}
}
