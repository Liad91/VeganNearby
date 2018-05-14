import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { MzBaseModal } from 'ng2-materialize';
import { Subscription } from 'rxjs';

import * as fromRoot from '../../../../store/app.reducer';
import { ModalService } from './../../../services/modal.service';

@Component({
  selector: 'vn-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent extends MzBaseModal implements OnInit, OnDestroy {
  @Input() mode: 'login' | 'register';
  public loading: boolean;
  private loadingSubscription: Subscription;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    opacity: 0.5
  };

  constructor(private store: Store<fromRoot.AppState>, private modalService: ModalService) {
    super();
  }

  ngOnInit(): void {
    this.loadingSubscription = this.store.select(fromRoot.selectAuthLoading).subscribe(
      loading => this.loading = loading
    );
  }

  public onClose(): void {
    this.modalService.close();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
