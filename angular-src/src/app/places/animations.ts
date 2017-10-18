import { trigger, transition, group, query, style, animate } from '@angular/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('list <=> favorites', [
    query(':enter', style({ transform: 'translateY(-30%)', opacity: 0 }), { optional: true }),
    group([
      query(':enter', animate('250ms ease-out'), { optional: true }),
      query(':leave', [], { optional: true })
    ])
  ])
]);
