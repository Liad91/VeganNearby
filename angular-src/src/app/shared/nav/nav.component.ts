import { Component, OnInit, OnDestroy, ComponentRef, ViewEncapsulation } from '@angular/core';
import { MzModalService, MzBaseModal } from 'ng2-materialize';

import { NavigationService } from './../../services/navigation.service';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent implements OnInit, OnDestroy {
  signInStrategy: string;
  currentPage: string;  
  pages = ['restaurant', 'cafe', 'bar'];

  constructor(private navigationService: NavigationService, private modalService: MzModalService) {}
  
  ngOnInit() {
    this.navigationService.navigator.subscribe(
      page => {
        if (this.currentPage !== page) {
          this.currentPage = page;
        }
      }
    );
    this.navigationService.redirect(this.pages[0]);
  }

  openModal() {
    const modal: ComponentRef<MzBaseModal> = this.modalService.open(RegistrationComponent);
    modal.onDestroy(() => {
      console.log('Destroyed');
    });
  }

  redirect(page: string) {
    this.navigationService.redirect(page);
  }

  isActive(page: string) {
    return this.currentPage === page;
  }

  ngOnDestroy() {
    this.navigationService.navigator.unsubscribe();
  }
}
