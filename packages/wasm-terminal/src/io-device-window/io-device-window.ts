// Class for interfacing with IO Devices on the main thread (window access).

import { IoDevices } from "@wasmer/io-devices";

export default class IoDeviceWindow {
  ioDevices: IoDevices | undefined;

  popupWindow: Window | undefined | null;
  popupCanvas: HTMLCanvasElement | undefined | null;
  popupCanvasContext: CanvasRenderingContext2D | undefined | null;
  popupContainerElement: HTMLElement | undefined | null;
  popupImageData: any;

  resizeWindow(width: number, height: number): void {
    if (width > 0 && height > 0) {
      if (this.popupWindow && this.popupCanvas && this.popupCanvasContext) {
        this.popupWindow.resizeTo(width, height);
        this.popupContainerElement.style.width = `${width}px`;
        this.popupContainerElement.style.height = `${height}px`;
        this.popupImageData = this.popupCanvasContext.getImageData(
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
          `width=${width}px,height=${height}px`
        ) as Window;

        // Add our html and canvas and stuff
        this.popupWindow.document.body.innerHTML = `
          <style>
            body {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;

              margin: 0px;
            }

            .container {
              position: relative;
              top: 0;
              left: 0;
              flex: 1;
            }

            #io-device-framebuffer-container {
              position: absolute;
              top: 0;
              left: 0;

              width: 100%;
              height: 100%;
            }

            #io-device-framebuffer {

              /* Will Keep pixel art looking good */
              image-rendering: pixelated;
              image-rendering: -moz-crisp-edges;
              image-rendering: crisp-edges;
            }
          </style>
          <div class="container">
            <div id="io-device-framebuffer-container">
              <canvas id="io-device-framebuffer"></canvas>
            </div>
          </div>
        `;
        this.popupWindow.document.head.innerHTML = `
          <title>Wasmer Experimental Framebuffer</title>
        `;

        // Get our elements stuff
        this.popupContainerElement = this.popupWindow.document.querySelector(
          ".container"
        ) as HTMLElement;
        this.popupContainerElement.style.width = `${width}px`;
        this.popupContainerElement.style.height = `${height}px`;
        this.popupCanvas = this.popupWindow.document.querySelector(
          "#io-device-framebuffer"
        ) as HTMLCanvasElement;
        this.popupCanvasContext = this.popupCanvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
        this.popupImageData = this.popupCanvasContext.getImageData(
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
    if (this.popupCanvas && this.popupCanvasContext && this.popupImageData) {
      this.popupImageData.data.set(rgbaArray);
      this.popupCanvasContext.putImageData(this.popupImageData, 0, 0);
    }
  }

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
