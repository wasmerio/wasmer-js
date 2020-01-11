// Class for interfacing with IO Devices on the main thread (window access).

import { IoDevices } from "@wasmer/io-devices";

export default class IoDeviceWindow {
  ioDevices: IoDevices | undefined;

  popupWindow: Window | undefined | null;
  popupCanvas: HTMLCanvasElement | undefined | null;
  popupCanvasContext: CanvasRenderingContext2D | undefined | null;
  popupImageData: any;

  // Handle Key Press / Release
  oldPopupKeyCodes: Array<number> = [];
  popupKeyCodes: Array<number> = [];

  // Handle Mouse Move
  oldMouseMovePosition: { x: number; y: number } = { x: 0, y: 0 };
  mouseMovePosition: { x: number; y: number } = { x: 0, y: 0 };

  // Handle Mouse Clicks
  mouseLeftClickPosition: { x: number; y: number } | undefined = undefined;
  mouseRightClickPosition: { x: number; y: number } | undefined = undefined;
  mouseMiddleClickPosition: { x: number; y: number } | undefined = undefined;

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

    if (this.popupWindow && this.popupCanvas && this.popupCanvasContext) {
      // Resize the canvas
      this.popupCanvas.width = width;
      this.popupCanvas.height = height;
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
    const inputArray: number[] = [];

    // Key Presses
    this.popupKeyCodes.forEach(keyCode => {
      if (!this.oldPopupKeyCodes.includes(keyCode)) {
        inputArray.push(1);
        inputArray.push(keyCode);
      }
    });

    // Mouse movement
    if (
      this.oldMouseMovePosition.x !== this.mouseMovePosition.x ||
      this.oldMouseMovePosition.y !== this.mouseMovePosition.y
    ) {
      inputArray.push(2);
      this._append32BitIntToByteArray(this.mouseMovePosition.x, inputArray);
      this._append32BitIntToByteArray(this.mouseMovePosition.y, inputArray);
    }
    this.oldMouseMovePosition = this.mouseMovePosition;

    // Key Releases
    this.oldPopupKeyCodes.forEach(keyCode => {
      if (!this.popupKeyCodes.includes(keyCode)) {
        inputArray.push(3);
        inputArray.push(keyCode);
      }
    });
    this.oldPopupKeyCodes = this.popupKeyCodes.slice(0);

    // Left Mouse Click
    if (this.mouseLeftClickPosition) {
      inputArray.push(4);
      this._append32BitIntToByteArray(
        this.mouseLeftClickPosition.x,
        inputArray
      );
      this._append32BitIntToByteArray(
        this.mouseLeftClickPosition.y,
        inputArray
      );
      this.mouseLeftClickPosition = undefined;
    }

    // Right Mouse Click
    if (this.mouseRightClickPosition) {
      inputArray.push(5);
      this._append32BitIntToByteArray(
        this.mouseRightClickPosition.x,
        inputArray
      );
      this._append32BitIntToByteArray(
        this.mouseRightClickPosition.y,
        inputArray
      );
      this.mouseRightClickPosition = undefined;
    }

    // Middle Mouse Click
    if (this.mouseMiddleClickPosition) {
      inputArray.push(4);
      this._append32BitIntToByteArray(
        this.mouseMiddleClickPosition.x,
        inputArray
      );
      this._append32BitIntToByteArray(
        this.mouseMiddleClickPosition.y,
        inputArray
      );
      this.mouseMiddleClickPosition = undefined;
    }

    const inputBytes = new Uint8Array(inputArray);

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
    // Let's assume landscape for now:
    const widthScreenRatio = Math.floor(screen.width / width);
    const heightScreenRatio = Math.floor(screen.height / height);
    const scale = Math.min(widthScreenRatio, heightScreenRatio);

    let windowWidth = width * scale;
    let windowHeight = height * scale;

    // Open the window
    this.popupWindow = window.open(
      "about:blank",
      "WasmerExperimentalFramebuffer",
      `width=${windowWidth},height=${windowHeight}`
    ) as Window;

    // Add our html and canvas and stuff
    this.popupWindow.document.body.innerHTML = `
      <style>
        html, body {
          width: 100%;
          height: 100%;
        }

        body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          margin: 0px;
          margin-left: auto;
          margin-right: auto;
        }

        #io-device-framebuffer {

          width: 100%;
          height: auto;

          /* Will Keep pixel art looking good */
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      </style>
      <canvas id="io-device-framebuffer" width="${width}" height="${height}"></canvas>
    `;

    this.popupWindow.document.head.innerHTML = `
      <title>Wasmer Experimental Framebuffer</title>
    `;

    // Get our elements stuff
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

  _append32BitIntToByteArray(value: number, numberArray: number[]) {
    for (let i = 0; i < 4; i++) {
      // Goes smallest to largest (little endian)
      let currentByte = value;
      currentByte = currentByte & (0xff << (i * 8));
      currentByte = currentByte >> (i * 8);
      numberArray.push(currentByte);
    }
  }

  _eventListenerKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    const keyCode = event.keyCode;
    if (!this.popupKeyCodes.includes(event.keyCode)) {
      this.popupKeyCodes.push(event.keyCode);
    }
  }

  _eventListenerKeyup(event: KeyboardEvent): void {
    event.preventDefault();
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
    if (!this.popupCanvas) {
      return undefined;
    }

    const popupCanvasBoundingClientRect = this.popupCanvas.getBoundingClientRect();
    const minX = popupCanvasBoundingClientRect.x;
    const maxX =
      popupCanvasBoundingClientRect.x + popupCanvasBoundingClientRect.width;
    const minY = popupCanvasBoundingClientRect.y;
    const maxY =
      popupCanvasBoundingClientRect.y + popupCanvasBoundingClientRect.height;

    let x = undefined;
    let y = undefined;

    if (event.x >= minX && event.x <= maxX) {
      x = event.x - minX;
    }

    if (event.y >= minY && event.y <= maxY) {
      y = event.y - minY;
    }

    if (x === undefined || y === undefined) {
      return undefined;
    }

    // Find where X and Y would be accoring to the scale
    const xScale = this.popupCanvas.width / popupCanvasBoundingClientRect.width;
    const yScale =
      this.popupCanvas.height / popupCanvasBoundingClientRect.height;

    x = x * xScale;
    y = y * yScale;

    return {
      x,
      y
    };
  }
}
