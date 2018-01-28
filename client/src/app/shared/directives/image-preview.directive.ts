import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'img[vnImgPreview]'
})
export class ImagePreviewDirective implements OnChanges {
  @Input() private vnImgPreview: File;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.elementRef.nativeElement.src = reader.result;
      };

      if (this.vnImgPreview) {
        reader.readAsDataURL(this.vnImgPreview);
      }
  }
}
