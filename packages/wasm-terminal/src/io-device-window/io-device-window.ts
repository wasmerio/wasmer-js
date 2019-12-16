// Class for interfacing with IO Devices on the main thread (window access).

export default class IoDeviceWindow {
  popupWindow: Window;
  popupCanvas: HTMLCanvasElement;
  popupCanvasContext: CanvasRenderingContext2D;
  popupImageData: any;

  resizeWindow(windowX: string, windowY: string): void {
    const width = parseInt(windowX, 10);
    const height = parseInt(windowY, 10);
    if (width > 0 && height > 0) {
      if (this.popupWindow) {
        this.popupWindow.resizeTo(width, height);
        this.popupImageData = this.popupCanvas.getImageData(
          0,
          0,
          width,
          height
        );
      } else {
        // Open the window
        this.popupWindow = window.open(
          "about:blank",
          "WasmerExperimentalFramebuffer",
          `width=${windowX},height=${windowY}`
        );

        // Add our html and canvas and stuff
        this.popupWindow.document.body.innerHTML = `
          <style>
            #io-device-framebuffer {
              position: fixed;
              top: 0;
              left: 0;

              width: 100vw;
              height: 100vh;

              /* Will Keep pixel art looking good */
              image-rendering: pixelated;
              image-rendering: -moz-crisp-edges;
              image-rendering: crisp-edges;
            }
          </style>
          <canvas id="io-device-framebuffer"></canvas>
        `;
        this.popupWindow.document.head.innerHTML = `
          <title>Wasmer Experimental Framebuffer</title>
        `;

        // Get our canvas stuff
        this.popupCanvas = this.popupWindow.document.querySelector(
          "#io-device-framebuffer"
        ) as HTMLCanvasElement;
        this.popupCanvasContext = this.popupCanvas.getContext("2d");
        this.popupImageData = this.popupCanvas.getImageData(
          0,
          0,
          width,
          height
        );

        // Add the neccessary events
        this.popupWindow.document.addEventListener(
          "keydown",
          this._eventListenerKeydown.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "keyup",
          this._eventListenerKeyup.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "mousemove",
          this._eventListenerMousemove.bind(this)
        );
        this.popupWindow.document.addEventListener(
          "click",
          this._eventListenerClick.bind(this)
        );
      }
      return;
    } else if (this.popupWindow) {
      // We want to close the window.
      this.popupWindow.close();
      this.popupWindow = undefined;
      return;
    }
  }

  drawRgbaArrayToFrameBuffer(rgbaArray: Uint8Array): void {
    console.log(this.popupImageData.data);
    this.popupImageData.data.set(rgbaArray);
  }

  getInputAsBytes(): Array<number> {}

  clearInput(): void {}

  _eventListenerKeydown(event: KeyboardEvent): void {
    console.log(event);
  }

  _eventListenerKeyup(event: KeyboardEvent): void {
    console.log(event);
  }

  _eventListenerMousemove(event: MouseEvent): void {
    console.log(event);
  }

  _eventListenerClick(event: MouseEvent): void {
    console.log(event);
  }
}
