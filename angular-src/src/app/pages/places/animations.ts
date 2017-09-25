import { trigger, transition, group, query, style, stagger, animate } from '@angular/animations';

import { slideIn, slideOut } from '../../shared/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('list <=> favorites', [
    query(':enter', style({ transform: 'translateY(-30%)', opacity: 0 }), { optional: true }),
    group([
      query(':enter', animate('250ms ease-out'), { optional: true }),
      query(':leave', [], { optional: true })
    ])
  ])
]);

export const sidebarStateTrigger = trigger('sidebarState', [
  transition('void => open', slideIn('-345px, 0', '200ms ease-out')),
  transition('open => void', slideOut('-345px, 0', '200ms ease-in'))
]);

export const listStateTrigger = trigger('listState', [
  transition('* => *', [
    query(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(-20%)'
      }),
      stagger(100, [
        animate('150ms ease-out'),
      ])
    ], { optional: true })
  ]),
]);
