import {
  style,
  animate,
  trigger,
  transition,
  group,
  query
} from '@angular/animations';

const slideLeft = group([
  query(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('250ms ease-out')
  ], { optional: true }),
  query(':leave', animate('250ms ease-out', style({ transform: 'translateX(-100%)' })), { optional: true })
]);

const slideRight = group([
  query(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('250ms ease-out')
  ], { optional: true }),
  query(':leave', animate('250ms ease-out', style({ transform: 'translateX(100%)' })), { optional: true })
]);

export const imageStateTrigger = trigger('imageState', [
  transition('0 => 1', slideLeft),
  transition('1 => 2', slideLeft),
  transition('2 => 0', slideLeft),
  transition('0 => 2', slideRight),
  transition('2 => 1', slideRight),
  transition('1 => 0', slideRight)
]);
