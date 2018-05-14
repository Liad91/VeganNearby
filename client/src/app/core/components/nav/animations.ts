import {
  trigger,
  transition,
  style,
  animate,
  query
} from '@angular/animations';

export const searchStateTrigger = trigger('searchState', [
  transition('0 => 1', [
    query(':enter, .search-btn', style({
      transform: 'translateY(-100%)',
    }), { optional: true }),
    query(':enter, .search-btn', animate('250ms ease-out'), { optional: true })
  ]),
  transition('1 => 0', [
    query(':enter, .search-btn', style({
      transform: 'translateY(100%)',
    }), { optional: true }),
    query(':enter, .search-btn', animate('250ms ease-out'), { optional: true })
  ])
]);
