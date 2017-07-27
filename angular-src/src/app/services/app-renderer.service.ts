export class AppRenderer {
  invokeMethod(el: any, method: string, args: any[]): void {
    el[method].apply(el, args);
  }
}