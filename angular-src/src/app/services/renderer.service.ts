import { Injectable } from '@angular/core';

@Injectable()
export class RendererService {
  public invokeMethod(element: any, method: string, args: any[]): void {
    element[method].apply(element, args);
  }
}
