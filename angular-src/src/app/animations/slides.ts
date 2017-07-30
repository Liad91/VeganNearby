import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations';

const slideInAnimation = animation([
  style({
    opacity: 0,
    transform: '{{ position }}'
  }),
  animate('{{ duration }}')
]);

const slideOutAnimation = animation([
  animate('{{ duration }}', style({
    opacity: 0,
    transform: '{{ position }}'
  }))
]);

export function slideIn(position: string, duration: string) {
  return useAnimation(slideInAnimation, { params: { position: `translate(${position})`, duration: duration } } );

}

export function slideOut(position: string, duration: string) {
  return useAnimation(slideOutAnimation, { params: { position: `translate(${position})`, duration: duration } } );
}

export function popIn(position: string, duration: string) {
  return useAnimation(slideInAnimation, { params: { position: `scale(${position})`, duration: duration } } );

}

export function popOut(position: string, duration: string) {
  return useAnimation(slideOutAnimation, { params: { position: `scale(${position})`, duration: duration } } );
}
