- Tutorial step 1:
  https://docs.wasmer.io/javascript-sdk/tutorials/run

  - Nitpick: extra trailing comma in package.json scripts
  - missing `npm i --save @wasmer/sdk`
  - `initializeLogger()` : where this does function come from?
     need to add `import {initializeLogger} from "@wasmer/sdk"` statement
  - `initializeLogger` step: the shown main() is incongruent with the main from above


# simplimage

works locally:

`cat ~/image.png  | wasmer run ./target/wasm32-wasi/release/simplimage.wasm -- resize --width 100 --height 100 > /tmp/out.png`

fails in browser with an apparent panic?

* why cant the panic be caught? does it happen in the scheduler?
