import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MzBaseModal, MzModalComponent } from 'ng2-materialize/dist';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../../store/app.reducers';
import { AuthService } from '../auth.service';

@Component({
  selector: 'vn-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent extends MzBaseModal implements OnInit, OnDestroy {
  @ViewChild('modal')	public modal: MzModalComponent;
  @ViewChild('tabs')	public tabs: ElementRef;
  public mode = 'login';
  public loading: Observable<boolean>;
  private closeSubscription: Subscription;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: true,
    endingTop: '0',
    opacity: 0.5
  };

  constructor(private store: Store<fromRoot.AppState>, private authService: AuthService) {
    super();
  }

  ngOnInit(): void {
    /** Allows the tabs indicator to initialize properly */
    setTimeout(() => this.initializeTabs(), 250);

    this.loading = this.store.select(fromRoot.selectAuthLoading);
    this.closeSubscription = this.authService.closeModal.subscribe(() => this.modal.close());
  }

  initializeTabs() {
    $(this.tabs.nativeElement).tabs();
    $(this.tabs.nativeElement).tabs('select_tab', 'login');
  }

  changeMode(mode: string): void {
    this.mode = mode;
    if (this.mode === 'register') {
    }
  }

  ngOnDestroy(): void {
    this.closeSubscription.unsubscribe();
  }
}
