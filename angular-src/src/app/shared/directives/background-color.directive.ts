import {
	Directive,
	ElementRef,
	Input,
	Renderer2,
	OnInit
} from '@angular/core';

@Directive({
	selector: '[appBgColor]'
})
export class BackgroundColorDirective implements OnInit {
	@Input() appBgColor: string;

	constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

	ngOnInit(): void {
		this.renderer.addClass(this.elementRef.nativeElement, `bg-color-${this.appBgColor}`);
	}
}
