import { Component, Input, OnInit } from '@angular/core';
import { MzBaseModal } from 'ng2-materialize';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../../store/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'vn-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent extends MzBaseModal implements OnInit {
  @Input() mode: 'login' | 'register';
  public loading: Observable<boolean>;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5
  };

  constructor(private store: Store<fromRoot.AppState>) {
    super();
  }

  ngOnInit(): void {
    this.loading = this.store.select(fromRoot.selectAuthLoading);
  }
}
