import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({ selector: 'img[appImgPreview]' })

export class ImagePreviewDirective implements OnChanges {

    @Input() appImgPreview: File;

    constructor(private elementRef: ElementRef) { }

    ngOnChanges(changes: SimpleChanges) {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.elementRef.nativeElement.src = reader.result;
        };

        if (this.appImgPreview) {
          reader.readAsDataURL(this.appImgPreview);
        }
    }
}