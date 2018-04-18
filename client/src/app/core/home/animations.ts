import { trigger, transition, state, style, animate } from '@angular/animations';

export const categoryStateTrigger = trigger('categoryState', [
  transition('void => *', [
    style({ transform: 'rotateX(180deg) scale(0.8)', opacity: '0' }),
    animate(250)
  ])
]);
