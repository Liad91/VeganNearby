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
      query(':enter', animate('250ms ease-out'), { optional: true }),
      query(':leave', style({ display: 'block' }), { optional: true })
    ])
  ]),
  transition('places => home', [
    query(':enter, :leave', style({ transform: 'translateY(-150px)' }), { optional: true }),
    group([
      query(':enter', animate('250ms ease-out'), { optional: true }),
      query(':leave', animate('250ms ease-out'), { optional: true })
    ])
  ])
]);
