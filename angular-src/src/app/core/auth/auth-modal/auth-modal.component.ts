import {
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize/dist';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../../store/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'vn-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent extends MzBaseModal implements OnInit, OnDestroy {
  @ViewChild('modal')	public modal: MzModalComponent;
  @Input() mode = 'login';
  public loading: Observable<boolean>;
  private closeSubscription: Subscription;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    endingTop: '0',
    opacity: 0.5
  };

  constructor(private store: Store<fromRoot.AppState>, private authService: AuthService, private zone: NgZone) {
    super();
  }

  ngOnInit(): void {
    this.loading = this.store.select(fromRoot.selectAuthLoading);
    this.closeSubscription = this.authService.closeModal.subscribe(() => {
      this.zone.run(() => this.modal.close());
    });
  }

  ngOnDestroy(): void {
    this.closeSubscription.unsubscribe();
  }
}
