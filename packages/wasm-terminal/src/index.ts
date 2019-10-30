import WasmTerminal from "./wasm-terminal";
import { fetchCommandFromWAPM as fetchCommandFromWAPMImport } from "./functions/fetch-command-wapm";

export default WasmTerminal;
export const fetchCommandFromWAPM = fetchCommandFromWAPMImport;
