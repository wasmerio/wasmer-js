// Class for interfacing with IO Devices on the main thread (window access).

import { IoDevices } from "@wasmer/io-devices";

export default class IoDeviceWindow {
  ioDevices: IoDevices | undefined;

  popupWindow: Window | undefined | null;
  popupCanvas: HTMLCanvasElement | undefined | null;
  popupCanvasContext: CanvasRenderingContext2D | undefined | null;
  popupContainerElement: HTMLElement | undefined | null;
  popupImageData: any;

  oldPopupKeyCodes: Array<number> = [];
  popupKeyCodes: Array<number> = [];

  sharedIoDeviceInput: Int32Array | undefined;

  constructor(sharedIoDeviceInputBuffer: SharedArrayBuffer | undefined) {
    if (sharedIoDeviceInputBuffer) {
      this.sharedIoDeviceInput = new Int32Array(sharedIoDeviceInputBuffer);
    }
  }

  resize(width: number, height: number): void {
    // Close the window
    if (width === 0 && height === 0) {
      this.close();
      return;
    }

    if (this.popupWindow && this.popupCanvas && this.popupCanvasContext) {
      // Resize the open window
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
      // Open a new window
      this._open(width, height);
    }
  }

  close(): void {
    this.popupWindow.close();
    this.popupWindow = undefined;
  }

  drawRgbaArrayToFrameBuffer(rgbaArray: Uint8Array): void {
    if (this.popupCanvas && this.popupCanvasContext && this.popupImageData) {
      this.popupImageData.data.set(rgbaArray);
      this.popupCanvasContext.putImageData(this.popupImageData, 0, 0);
    }
  }

  getInputBuffer(): Uint8Array {
    // Handle keyCodes
    const inputBuffer = [];

    // Key Presses
    this.popupKeyCodes.forEach(keyCode => {
      if (!this.oldPopupKeyCodes.includes(keyCode)) {
        inputBuffer.push(1);
        inputBuffer.push(keyCode);
      }
    });
    // Key Releases
    this.oldPopupKeyCodes.forEach(keyCode => {
      if (!this.popupKeyCodes.includes(keyCode)) {
        inputBuffer.push(3);
        inputBuffer.push(keyCode);
      }
    });
    this.oldPopupKeyCodes = this.popupKeyCodes.slice(0);

    const inputBytes = new Uint8Array(inputBuffer);

    if (this.sharedIoDeviceInput) {
      // Write the buffer to the memory
      for (let i = 0; i < inputBytes.length; i++) {
        this.sharedIoDeviceInput[i + 1] = inputBytes[i];
      }

      // Write our number of elements
      this.sharedIoDeviceInput[0] = inputBytes.length;

      Atomics.notify(this.sharedIoDeviceInput, 0, 1);
    }

    return inputBytes;
  }

  _open(width: number, height: number): void {
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

  _eventListenerKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    this.popupKeyCodes.push(event.keyCode);
  }

  _eventListenerKeyup(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const keyCodeIndex = this.popupKeyCodes.indexOf(event.keyCode);
    if (keyCodeIndex > -1) {
      this.popupKeyCodes.splice(keyCodeIndex, 1);
    }
  }

  _eventListenerMousemove(event: MouseEvent): void {
    console.log(event);
  }

  _eventListenerClick(event: MouseEvent): void {
    console.log(event);
  }
}
