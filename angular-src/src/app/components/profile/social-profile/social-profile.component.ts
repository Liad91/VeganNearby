import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { QueryParams } from '../../../models/query-params.model';

@Component({
  selector: 'app-callback',
  template: 'Authorizing...'
})
export class SocialProfileComponent implements OnInit {

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
