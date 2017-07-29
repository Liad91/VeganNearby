export class RendererService {
  invokeMethod(el: any, method: string, args: any[]): void {
    el[method].apply(el, args);
  }
}
