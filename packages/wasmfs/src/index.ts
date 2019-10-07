import Stats from './Stats';
import Dirent from './Dirent';
import { Volume as _Volume, StatWatcher, FSWatcher, toUnixTimestamp, IReadStream, IWriteStream } from './volume';
import { IPromisesAPI } from './promises';
export { WasmFs } from './wasm';
const { fsSyncMethods, fsAsyncMethods } = require('fs-monkey/lib/util/lists');
import { constants } from './constants';
const { F_OK, R_OK, W_OK, X_OK } = constants;

export const Volume = _Volume;

// Default volume.
export const vol = new _Volume();

export interface IFs extends _Volume {
  constants: typeof constants;
  Stats: new (...args: any[]) => Stats;
  Dirent: new (...arg: any[]) => Dirent;
  StatWatcher: new () => StatWatcher;
  FSWatcher: new () => FSWatcher;
  ReadStream: new (...args: any[]) => IReadStream;
  WriteStream: new (...args: any[]) => IWriteStream;
  promises: IPromisesAPI;
  _toUnixTimestamp: any;
}

export function createFsFromVolume(vol: _Volume): IFs {
  const fs = ({ F_OK, R_OK, W_OK, X_OK, constants, Stats, Dirent } as any) as IFs;

  // Bind FS methods.
  for (const method of fsSyncMethods)
    if (typeof (vol as any)[method] === 'function') (fs as any)[method] = (vol as any)[method].bind(vol);
  for (const method of fsAsyncMethods)
    if (typeof (vol as any)[method] === 'function') (fs as any)[method] = (vol as any)[method].bind(vol);

  fs.StatWatcher = vol.StatWatcher;
  fs.FSWatcher = vol.FSWatcher;
  fs.WriteStream = vol.WriteStream;
  fs.ReadStream = vol.ReadStream;
  fs.promises = vol.promises;

  fs._toUnixTimestamp = toUnixTimestamp;

  return fs;
}

export const fs: IFs = createFsFromVolume(vol);
// @ts-ignore
declare let module;
module.exports = { ...module.exports, ...fs };

module.exports.semantic = true;
