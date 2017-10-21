import {
  trigger,
  transition,
  style,
  animate,
  query,
  keyframes
} from '@angular/animations';

export const routeStateTrigger = trigger('routeState', [
  transition('home => places', [
    query(':enter:not(vn-search), :leave:not(vn-search)', style({ position: 'fixed', width: '100%' }), { optional: true }),
    query(':enter:not(vn-search)', style({ zIndex: '9999' }), { optional: true }),
    query(':enter:not(vn-search)', [
      style({ opacity: '0', transform: 'translateY(80%)'}),
      animate('200ms ease-in-out', keyframes([
        style({ opacity: '0.4', transform: 'translateY(60%)', offset: 0.25 }),
        style({ opacity: '0.8', transform: 'translateY(40%)', offset: 0.50 }),
        style({ opacity: '1', transform: 'translateY(20%)', offset: 0.75 }),
        style({ transform: 'translateY(0)', offset: 1 })
      ]))
    ], { optional: true })
 ]),
  transition('places => home', [
    query('vn-home, vn-places', style({ position: 'fixed', width: '100%' }), { optional: true }),
    query('vn-places', style({ zIndex: '9999' }), { optional: true }),
    query('vn-home .background-image', style({ top: '-64px' }), { optional: true }),
    query('vn-places', [
      style({ transform: 'translateY(0%)' }),
      animate('180ms ease-out', style({ transform: 'translateY(100%)', opacity: '0' }))
    ], { optional: true })
  ])
]);
