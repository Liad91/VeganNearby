import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';

import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: 'img[vnImgPreview]'
})
export class ImagePreviewDirective implements OnInit, OnChanges, OnDestroy {
  @Input() private vnImgPreview: File;
  private reader = new FileReader();
  private readerSubscription: Subscription;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.readerSubscription = fromEvent(this.reader, 'onloadend')
      .subscribe(() => this.elementRef.nativeElement.src = this.reader.result);
  }

  ngOnChanges(): void {
    if (this.vnImgPreview) {
      this.reader.readAsDataURL(this.vnImgPreview);
    }
  }

  ngOnDestroy() {
    this.readerSubscription.unsubscribe();
  }
}
