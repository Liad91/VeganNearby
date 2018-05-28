import {
  Directive,
  ElementRef,
  Input,
  OnChanges
} from '@angular/core';

@Directive({
  selector: 'img[vnImgPreview]'
})
export class ImagePreviewDirective implements OnChanges {
  @Input() private vnImgPreview: File;
  private reader = new FileReader();

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(): void {
    this.reader.onloadend = () => {
      this.elementRef.nativeElement.src = this.reader.result;
    };

    if (this.vnImgPreview) {
      this.reader.readAsDataURL(this.vnImgPreview);
    }
  }
}
