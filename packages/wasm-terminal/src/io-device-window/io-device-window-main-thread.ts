// Class for interfacing with IO Devices on the main thread (window access).

export class IoDeviceWindowMainThread {
  popupWindow: Window;

  resizeWindow(windowX: string, windowY: string): void {
    if (windowX > 0 && windowY > 0) {
      if (popupWindow) {
        this.popupWindow.resizeTo(parseInt(windowX, 10), parseInt(windowY, 10));
      } else {
        // Open the window
        this.popupWindow = window.open(
          "about:blank",
          "Wasmer Experimental Framebuffer",
          `width=${windowX},height=${windowY}`
        );

        // TODO: Add our html and canvas and stuff

        // Add the neccessary events
        this.popupWindow.document.addEventListener(
          "keydown",
          this.eventListenerKeydown.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "keyup",
          this.eventListenerKeydown.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "mousemove",
          this.eventListenerKeydown.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "click",
          this.eventListenerKeydown.bind(this)
        );
      }
      return;
    }

    // We want to close the window.
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupWindow = undefined;
      return;
    }
  }

  eventListenerKeydown(event: KeyboardEvent): void {}

  eventListenerKeyup(event: KeyboardEvent): void {}

  eventListenerMousemove(event: MouseEvent): void {}

  eventListenerClick(event: MouseEvent): void {}
}
