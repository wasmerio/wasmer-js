// Class for interfacing with IO Devices on the main thread (window access).

import { IoDevices } from "@wasmer/io-devices";

export default class IoDeviceWindow {
  ioDevices: IoDevices | undefined;

  popupWindow: Window | undefined | null;
  popupCanvas: HTMLCanvasElement | undefined | null;
  popupCanvasContext: CanvasRenderingContext2D | undefined | null;
  popupContainerElement: HTMLElement | undefined | null;
  popupImageData: any;

  // Handle Key Press / Release
  oldPopupKeyCodes: Array<number> = [];
  popupKeyCodes: Array<number> = [];

  // Handle Mouse Move
  oldMouseMovePosition: { x: number; y: number } | undefined = { x: 0, y: 0 };
  mouseMovePosition: { x: number; y: number } | undefined = { x: 0, y: 0 };

  // Handle Mouse Clicks
  oldMouseLeftClickPosition: { x: number; y: number } | undefined = {
    x: 0,
    y: 0
  };
  mouseLeftClickPosition: { x: number; y: number } | undefined = { x: 0, y: 0 };
  oldMouseRightClickPosition: { x: number; y: number } | undefined = {
    x: 0,
    y: 0
  };
  mouseRightClickPosition: { x: number; y: number } | undefined = {
    x: 0,
    y: 0
  };
  oldMouseMiddleClickPosition: { x: number; y: number } | undefined = {
    x: 0,
    y: 0
  };
  mouseMiddleClickPosition: { x: number; y: number } | undefined = {
    x: 0,
    y: 0
  };

  sharedIoDeviceInput: Int32Array | undefined;

  constructor(sharedIoDeviceInputBuffer?: SharedArrayBuffer) {
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

    if (
      this.popupWindow &&
      this.popupContainerElement &&
      this.popupCanvas &&
      this.popupCanvasContext
    ) {
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
    if (this.popupWindow) {
      this.popupWindow.close();
      this.popupWindow = undefined;
    }
  }

  drawRgbaArrayToFrameBuffer(rgbaArray: Uint8Array): void {
    if (this.popupCanvas && this.popupCanvasContext && this.popupImageData) {
      this.popupImageData.data.set(rgbaArray);
      this.popupCanvasContext.putImageData(this.popupImageData, 0, 0);
    }
  }

  getInputBuffer(): Uint8Array {
    // Handle keyCodes
    const inputBytes = new Uint8Array();

    // Key Presses
    this.popupKeyCodes.forEach(keyCode => {
      if (!this.oldPopupKeyCodes.includes(keyCode)) {
        inputBytes[inputBytes.length] = 1;
        inputBytes[inputBytes.length] = keyCode;
      }
    });

    // Mouse movement
    if (
      this.oldMouseMovePosition.x !== this.mouseMovePosition.x ||
      this.oldMouseMovePosition.y !== this.mouseMovePosition.y
    ) {
      inputBytes[inputBytes.length] = 2;
      this._append32BitIntToByteArray(this.mouseMovePosition.x, inputBytes);
      this._append32BitIntToByteArray(this.mouseMovePosition.y, inputBytes);
    }
    this.oldMouseMovePosition = this.mouseMovePosition;

    // Key Releases
    this.oldPopupKeyCodes.forEach(keyCode => {
      if (!this.popupKeyCodes.includes(keyCode)) {
        inputBytes[inputBytes.length] = 3;
        inputBytes[inputBytes.length] = keyCode;
      }
    });
    this.oldPopupKeyCodes = this.popupKeyCodes.slice(0);

    // Left Mouse Click
    if (
      this.oldMouseLeftClickPosition.x !== this.mouseLeftClickPosition.x ||
      this.oldMouseLeftClickPosition.y !== this.mouseLeftClickPosition.y
    ) {
      inputBytes[inputBytes.length] = 4;
      this._append32BitIntToByteArray(
        this.mouseLeftClickPosition.x,
        inputBytes
      );
      this._append32BitIntToByteArray(
        this.mouseLeftClickPosition.y,
        inputBytes
      );
    }
    this.oldMouseLeftClickPosition = this.mouseLeftClickPosition;

    // Right Mouse Click
    if (
      this.oldMouseRightClickPosition.x !== this.mouseRightClickPosition.x ||
      this.oldMouseRightClickPosition.y !== this.mouseRightClickPosition.y
    ) {
      inputBytes[inputBytes.length] = 5;
      this._append32BitIntToByteArray(
        this.mouseRightClickPosition.x,
        inputBytes
      );
      this._append32BitIntToByteArray(
        this.mouseRightClickPosition.y,
        inputBytes
      );
    }
    this.oldMouseRightClickPosition = this.mouseRightClickPosition;

    // Middle Mouse Click
    if (
      this.oldMouseMiddleClickPosition.x !== this.mouseMiddleClickPosition.x ||
      this.oldMouseMiddleClickPosition.y !== this.mouseMiddleClickPosition.y
    ) {
      inputBytes[inputBytes.length] = 7;
      this._append32BitIntToByteArray(
        this.mouseMiddleClickPosition.x,
        inputBytes
      );
      this._append32BitIntToByteArray(
        this.mouseMiddleClickPosition.y,
        inputBytes
      );
    }
    this.oldMouseMiddleClickPosition = this.mouseMiddleClickPosition;

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
          margin-left: auto;
          margin-right: auto;
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

  _append32BitIntToByteArray(value: number, byteArray: Uint8Array) {
    for (let i = 0; i < 4; i++) {
      // Goes smallest to largest (little endian)
      let currentByte = value;
      currentByte = currentByte & (0x0f << (i * 8));
      currentByte = currentByte >> (i * 8);
      byteArray[byteArray.length] = currentByte;
    }
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
    const position = this._getPositionFromMouseEvent(event);

    if (position === undefined) {
      return;
    }

    this.mouseMovePosition = position;
  }

  _eventListenerClick(event: MouseEvent): void {
    const position = this._getPositionFromMouseEvent(event);

    if (position === undefined) {
      return;
    }

    if (event.button === 0) {
      // Left click
      this.mouseLeftClickPosition = position;
    } else if (event.button === 1) {
      // Middle click
      this.mouseMiddleClickPosition = position;
    } else if (event.button === 2) {
      // Right click
      this.mouseRightClickPosition = position;
    }
  }

  _getPositionFromMouseEvent(
    event: MouseEvent
  ): { x: number; y: number } | undefined {
    if (!this.popupContainerElement) {
      return undefined;
    }

    const popupContainerBoundingClientRect = this.popupContainerElement.getBoundingClientRect();
    const minX = popupContainerBoundingClientRect.x;
    const maxX =
      popupContainerBoundingClientRect.x +
      popupContainerBoundingClientRect.width;
    const minY = popupContainerBoundingClientRect.y;
    const maxY =
      popupContainerBoundingClientRect.y +
      popupContainerBoundingClientRect.height;

    let x = undefined;
    let y = undefined;

    if (event.x >= minX && event.x <= maxX) {
      x = event.x;
    }

    if (event.y >= minY && event.y <= maxY) {
      y = event.y;
    }

    if (x === undefined || y === undefined) {
      return undefined;
    }

    return {
      x,
      y
    };
  }
}
