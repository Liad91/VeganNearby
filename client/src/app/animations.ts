import { animate, group, query, style, transition, trigger } from '@angular/animations';

export function fadeOut(enter: string, leave: string) {
  return [
    query(leave, style({ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: '#fff' }), { optional: true }),
    group([
      query(leave, [
        animate('500ms ease', style({ opacity: '0', transform: 'translateY(50%) scale(0)' }))
      ], { optional: true })
    ])
  ];
}

export function fadeIn(enter: string) {
  return [
    query(enter, style({ opacity: '0' }), { optional: true }),
    group([
      query(enter, animate('500ms ease'), { optional: true })
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
