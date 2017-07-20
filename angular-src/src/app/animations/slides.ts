import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

const slideIn = animation([
  style({
    opacity: 0,
    transform: '{{ position }}'
  }),
  animate('{{ duration }}')
]);

const slideOut = animation([
  animate('{{ duration }}', style({
    opacity: 0,
    transform: '{{ position }}'
  }))
]);

export const slideBottom = trigger('slideBottom', [
  transition(':enter', useAnimation(slideIn, { params: { position: 'translateY({{ position }})', duration: '{{ duration }}' } } )),
  transition(':leave', useAnimation(slideOut, { params: { position: 'translateY({{ position }})', duration: '{{ duration }}' } } ))
]);