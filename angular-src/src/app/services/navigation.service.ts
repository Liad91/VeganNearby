import { Subject } from 'rxjs/Subject';

export class NavigationService {
  currentPage: string;
  navigator = new Subject<string>();

  redirect(page: string) {
    this.navigator.next(page);
    this.currentPage = page;
  }
} 