import { trigger, transition, state, style, animate } from '@angular/animations';

export const categoryStateTrigger = trigger('categoryState', [
  transition('void => *', [
    style({ transform: 'translateY(-100%)', opacity: '0' }),
    animate(300)
  ]),
  // transition('* => void', [
  //   style({ position: 'absolute', left: '263px' }),
  //   animate(200, style({ opacity: '0', transform: 'translateY(100%)' }))
  // ])
]);
