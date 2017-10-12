import {
  trigger,
  transition,
  style,
  group,
  animate,
  query
} from '@angular/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('home => places', [
    query(':enter', style({ transform: 'translateY(150px)' }), { optional: true }),
    group([
      query(':enter', animate('150ms ease-out'), { optional: true }),
      query(':leave', style({ display: 'block' }), { optional: true })
    ])
  ]),
  transition('places => home', [
    query(':leave', style({ transform: 'translateY(0)' }), { optional: true }),
    group([
      query(':leave', animate('150ms ease-out', style({ transform: 'translateY(100%)' })), { optional: true })
    ])
  ])
]);
