import { trigger, transition, group, query, style, animate } from '@angular/animations';

function slideContentDown(enter: string) {
  return [
    query('nav', style({ zIndex: '100' }), { optional: true }),
    query(`${enter} .content, ${enter} header`, [
      style({ transform: 'translateY(-50px)' }),
      animate('300ms ease-out')
    ], { optional: true })
  ];
}

function fadeOut(enter: string, leave: string) {
  return [
    query('nav', style({ backgroundColor: '#fff' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query('nav', animate('250ms ease-out', style({ backgroundColor: 'transparent' })), { optional: true }),
      query(`${leave}`, [
        animate('250ms ease-out', style({ opacity: '0', transform: 'scale(0.4)' }))
      ], { optional: true })
    ])
  ];
}

function slideInUp(enter: string, leave: string) {
  return [
    query('nav', style({ zIndex: '200' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    query(`header`, style({ marginTop: '0' }), { optional: true }),
    group([
      query(`${enter}`, [
        style({ top: '50%', zIndex: '100', backgroundColor: '#f9f9f9', minHeight: '100vh'}),
        animate('250ms ease-out', style({ top: '56px' }))
      ], { optional: true }),
      query(`${leave}`, style({ display: 'block' }), { optional: true })
    ])
  ];
}

function slideOutDown(enter: string, leave: string) {
  return [
    query('nav', style({  backgroundColor: '#fff', zIndex: '200' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    query(`header`, style({ marginTop: '0' }), { optional: true }),
    group([
      query('nav', animate('250ms ease-out', style({ backgroundColor: 'transparent' })), { optional: true }),
      query(`${enter}`, style({ display: 'block' }), { optional: true }),
      query(`${leave}`, [
        style({ top: '56px', zIndex: '100', backgroundColor: '#f9f9f9', minHeight: '100vh'}),
        animate('250ms ease-out', style({ top: '100%' }))
      ], { optional: true })
    ])
  ];
}

function slideInRight(enter: string, leave: string) {
  return [
    query('nav', style({ position: 'absolute', zIndex: '300' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(`${enter}`, [
        style({ left: '100%', zIndex: '200', backgroundColor: '#f9f9f9', minHeight: '100vh' }),
        animate('250ms ease-out', style({ left: '0' }))
      ], { optional: true }),
      query(`${leave}`, style({ display: 'block', zIndex: '100', backgroundColor: '#f9f9f9' }), { optional: true })
    ])
  ];
}

function slideOutRight(enter: string, leave: string) {
  return [
    query('nav', style({ position: 'absolute', zIndex: '300' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(`${enter}`, style({ display: 'block', zIndex: '100', backgroundColor: '#f9f9f9' }), { optional: true }),
      query(`${leave}`, [
        style({ left: '0', zIndex: '200', backgroundColor: '#f9f9f9', minHeight: '100vh' }),
        animate('250ms ease-out', style({ left: '100%' }))
      ], { optional: true })
    ])
  ];
}

function slideInLeft(enter: string, leave: string) {
  return [
    query('nav', style({ position: 'absolute', zIndex: '300' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(`${enter}`, [
        style({ right: '100%', zIndex: '200', backgroundColor: '#f9f9f9', minHeight: '100vh' }),
        animate('250ms ease-out', style({ right: '0' }))
      ], { optional: true }),
      query(`${leave}`, style({ display: 'block', zIndex: '100', backgroundColor: '#f9f9f9' }), { optional: true })
    ])
  ];
}

function slideOutLeft(enter: string, leave: string) {
  return [
    query('nav', style({ position: 'absolute', zIndex: '300' }), { optional: true }),
    query(`${enter}, ${leave}`, style({ position: 'absolute', width: '100%' }), { optional: true }),
    group([
      query(`${enter}`, style({ display: 'block', zIndex: '100', backgroundColor: '#f9f9f9' }), { optional: true }),
      query(`${leave}`, [
        style({ right: '0', zIndex: '200', backgroundColor: '#f9f9f9', minHeight: '100vh' }),
        animate('250ms ease-out', style({ right: '100%' }))
      ], { optional: true })
    ])
  ];
}

export const mobileRouteStateTrigger = trigger('mobileRouteState', [
  transition('home => list', slideContentDown('vn-place-list')),
  transition('m-home => list', slideContentDown('vn-place-list')),
  transition('nma-home => list', slideContentDown('vn-place-list')),
  transition('m-home => m-list', slideInUp('vn-place-list', 'vn-home')),
  transition('home => m-list', slideInUp('vn-place-list', 'vn-home')),
  transition('nma-home => m-list', slideInUp('vn-place-list', 'vn-home')),

  transition('list => home', fadeOut('vn-home', 'vn-place-list')),
  transition('m-list => home', fadeOut('vn-home', 'vn-place-list')),
  transition('m-list => m-home', slideOutDown('vn-home', 'vn-place-list')),
  transition('list => m-home', slideOutDown('vn-home', 'vn-place-list')),

  transition('home => place', slideContentDown('vn-place-detail')),
  transition('m-home => place', slideContentDown('vn-place-detail')),
  transition('nma-home => place', slideContentDown('vn-place-detail')),
  transition('m-home => m-place', slideInUp('vn-place-detail', 'vn-home')),
  transition('home => m-place', slideInUp('vn-place-detail', 'vn-home')),
  transition('nma-home => m-place', slideInUp('vn-place-detail', 'vn-home')),

  transition('place => home', fadeOut('vn-home', 'vn-place-detail')),
  transition('m-place => home', fadeOut('vn-home', 'vn-place-detail')),
  transition('m-place => m-home', slideOutDown('vn-home', 'vn-place-detail')),
  transition('place => m-home', slideOutDown('vn-home', 'vn-place-detail')),

  transition('home => favorites', slideContentDown('vn-favorites')),
  transition('m-home => favorites', slideContentDown('vn-favorites')),
  transition('nma-home => favorites', slideContentDown('vn-favorites')),
  transition('m-home => m-favorites', slideInUp('vn-favorites', 'vn-home')),
  transition('home => m-favorites', slideInUp('vn-favorites', 'vn-home')),
  transition('nma-home => m-favorites', slideInUp('vn-favorites', 'vn-home')),

  transition('favorites => home', fadeOut('vn-home', 'vn-favorites')),
  transition('m-favorites => home', fadeOut('vn-home', 'vn-favorites')),
  transition('nma-favorites => home', fadeOut('vn-home', 'vn-favorites')),
  transition('m-favorites => m-home', slideOutDown('vn-home', 'vn-favorites')),
  transition('favorites => m-home', slideOutDown('vn-home', 'vn-favorites')),
  transition('nma-favorites => m-home', slideOutDown('vn-home', 'vn-favorites')),

  transition('favorites => place', slideContentDown('vn-place-detail')),
  transition('m-favorites => place', slideContentDown('vn-place-detail')),
  transition('nma-favorites => place', slideContentDown('vn-place-detail')),
  transition('m-favorites => m-place', slideInRight('vn-place-detail', 'vn-favorites')),
  transition('favorites => m-place', slideInRight('vn-place-detail', 'vn-favorites')),
  transition('nma-favorites => m-place', slideInRight('vn-place-detail', 'vn-favorites')),

  transition('place => favorites', slideContentDown('vn-favorites')),
  transition('m-place => favorites', slideContentDown('vn-favorites')),
  transition('m-place => m-favorites', slideOutRight('vn-favorites', 'vn-place-detail')),
  transition('place => m-favorites', slideOutRight('vn-favorites', 'vn-place-detail')),

  transition('list => favorites', slideContentDown('vn-favorites')),
  transition('m-list => favorites', slideContentDown('vn-favorites')),
  transition('m-list => m-favorites', slideInLeft('vn-favorites', 'vn-place-list')),
  transition('list => m-favorites', slideInLeft('vn-favorites', 'vn-place-list')),

  transition('favorites => list', slideContentDown('vn-place-list')),
  transition('m-favorites => list', slideContentDown('vn-place-list')),
  transition('nma-favorites => list', slideContentDown('vn-place-list')),
  transition('m-favorites => m-list', slideOutLeft('vn-place-list', 'vn-favorites')),
  transition('favorites => m-list', slideOutLeft('vn-place-list', 'vn-favorites')),
  transition('nma-favorites => m-list', slideOutLeft('vn-place-list', 'vn-favorites')),

  transition('list => place', slideContentDown('vn-place-detail')),
  transition('m-list => place', slideContentDown('vn-place-detail')),
  transition('m-list => m-place', slideInRight('vn-place-detail', 'vn-place-list')),
  transition('list => m-place', slideInRight('vn-place-detail', 'vn-place-list')),

  transition('place => list', slideContentDown('vn-place-list')),
  transition('m-place => list', slideContentDown('vn-place-list')),
  transition('m-place => m-list', slideOutRight('vn-place-list', 'vn-place-detail')),
  transition('place => m-list', slideOutRight('vn-place-list', 'vn-place-detail'))
]);
