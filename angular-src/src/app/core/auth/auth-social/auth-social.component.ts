import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'vn-callback',
  template: 'Authorizing...'
})
export class AuthSocialComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        const event = new CustomEvent('socialCallback', { detail: params });

        window.opener.dispatchEvent(event);
        window.close();
      }
    )
  }
}
