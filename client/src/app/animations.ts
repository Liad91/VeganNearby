import { trigger, transition, group, query, style, animate } from '@angular/animations';

export function fadeOut(enter: string, leave: string) {
  return [
    query('nav', style({ backgroundColor: '#fff' }), { optional: true }),
    query(leave, style({ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0' }), { optional: true }),
    group([
      query('nav', animate('200ms', style({ backgroundColor: 'transparent' })), { optional: true }),
      query(`${leave}`, [
        animate('200ms', style({ opacity: '0', transform: 'translateY(100%)' }))
      ], { optional: true })
    ])
  ];
}

export function fadeIn(enter: string) {
  return [
    query('nav', style({ backgroundColor: 'transparent' }), { optional: true }),
    query(enter, style({ opacity: '0' }), { optional: true }),
    group([
      query('nav', animate('250ms', style({ backgroundColor: '#fff' })), { optional: true }),
      query(enter, animate('250ms'), { optional: true })
    ])
  ];
}

export const routeStateTrigger = trigger('routeState', [
  transition('home => list', fadeIn('vn-place-list')),
  transition('home => favorites', fadeIn('vn-favorites')),
  transition('home => place', fadeIn('vn-place-detail')),

  transition('list => home', fadeOut('vn-home', 'vn-place-list')),
  transition('list => favorites', fadeIn('vn-favorites')),
  transition('list => place', fadeIn('vn-place-detail')),

  transition('favorites => home', fadeOut('vn-home', 'vn-favorites')),
  transition('favorites => list', fadeIn('vn-place-list')),
  transition('favorites => place', fadeIn('vn-place-detail')),

  transition('place => home', fadeOut('vn-home', 'vn-place-detail')),
  transition('place => favorites', fadeIn('vn-favorites')),
  transition('place => list', fadeIn('vn-place-list'))
]);
