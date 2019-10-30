// Return our buffer depending on browser or node

/*ROLLUP_REPLACE_BROWSER
// @ts-ignore
import { Buffer } from "buffer-es6";
ROLLUP_REPLACE_BROWSER*/

const isomorphicBuffer = Buffer;
export default isomorphicBuffer;
