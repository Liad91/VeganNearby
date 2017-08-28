import {
	animation,
	style,
	animate,
	trigger,
	transition,
	useAnimation
} from '@angular/animations';

const inAnimation = animation([
	style({
		opacity: 0,
		transform: '{{ position }}'
	}),
	animate('{{ duration }}')
]);

const outAnimation = animation([
	animate('{{ duration }}', style({
		opacity: 0,
		transform: '{{ position }}'
	}))
]);

export function slideIn(position: string, duration: string) {
	return useAnimation(inAnimation, { params: { position: `translate(${position})`, duration: duration } } );
}

export function slideOut(position: string, duration: string) {
	return useAnimation(outAnimation, { params: { position: `translate(${position})`, duration: duration } } );
}

export function zoomIn(position: string, duration: string) {
	return useAnimation(inAnimation, { params: { position: `scale(${position})`, duration: duration } } );
}

export function zoomOut(position: string, duration: string) {
	return useAnimation(outAnimation, { params: { position: `scale(${position})`, duration: duration } } );
}
