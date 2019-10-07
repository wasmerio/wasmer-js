// An alternative fs for the browser and testing

import { createFsFromVolume, IFs } from './index';
import { Volume, filenameToSteps } from './volume';

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message);
  }
};

export class WasmFs {
  volume: Volume;
  fs: IFs;

  constructor() {
    this.volume = new Volume();
    this.fs = createFsFromVolume(this.volume);
    this.fromJSON({
      '/dev/stdin': '',
      '/dev/stdout': '',
      '/dev/stderr': '',
      // "/hello": atob("iVBORw0KGgoAAAANSUhEUgAAABQAAABkCAYAAACGqxDMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TS0WqgnYQcchQnSyIFnHUKhShQqgVWnUweekfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfExdVJ0UVKvK8ptIjxwuN9nHfP4b37AKFeZprVNQFoum2mEnExk10Vg68IwIcB9CEmM8uYk6QkPOvrnnqp7qI8y7vvz+pVcxYDfCLxLDNMm3iDeHrTNjjvE4dZUVaJz4nHTbog8SPXFZffOBeaLPDMsJlOzROHicVCBysdzIqmRhwjjqiaTvlCxmWV8xZnrVxlrXvyF4Zy+soy12mNIIFFLEGCCAVVlFCGjSjtOikWUnQe9/APN/0SuRRylcDIsYAKNMhNP/gf/J6tlZ+adJNCcSDw4jgfo0BwF2jUHOf72HEaJ4D/GbjS2/5KHZj5JL3W1iJHQP82cHHd1pQ94HIHGHoyZFNuSn5aQj4PvJ/RN2WBwVugZ82dW+scpw9AmmaVvAEODoGxAmWve7y7u3Nu//a05vcDSBxyluxHhCQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfjBQESGyJPrNb5AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAX5JREFUWMPtmcGSwyAMQ7GHW///e72ndtI0gCUr3c1OOLcvAoKQHWutRRuMiLAGDpsBGXAKiIAdmo7Z8uEWEekfZ5S+gKiSEfQQmAUfQb2yCUcPdOUrk95lBOrVnd1P25t43MAvAkenZr/7rnIZyZThs4yqWwJnsNHJcSVsCESnuR1d5dQfQMadh1NWwU5xbFNHEVfCLmJf2ctHdpYpc2ASwlIhu6vTKU9jWlKlQ9kvAXU4UC6g1EmZQel8OIKW3IYKnCi0nA9L5pA593/Xvp4qYeBqLSmFcHK4I/ENPAFIG+xXFK4KILnCrli37dnuFVBaYaUp1CvR7cjGoGZaxhO7CiS99SCFaG7sypLilGr0H5QVFFAR1qGyAoF+9GCrxbijf6CqgAqULsCpKuBX2s576LTTzlxUMj98PgxSeI0oco3QLl1DuqJnYBFhroSlFSIe2at3Srp1zzZ4O3t/pNKXrO1cVfW2hmYWLR6yrsgywdY+FG6URoTJvoBX8uEPgfcizoFx4TgAAAAASUVORK5CYII=")
    });

    let base64_string =
      'iVBORw0KGgoAAAANSUhEUgAAABQAAABkCAYAAACGqxDMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw1AUhU9TS0WqgnYQcchQnSyIFnHUKhShQqgVWnUweekfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfExdVJ0UVKvK8ptIjxwuN9nHfP4b37AKFeZprVNQFoum2mEnExk10Vg68IwIcB9CEmM8uYk6QkPOvrnnqp7qI8y7vvz+pVcxYDfCLxLDNMm3iDeHrTNjjvE4dZUVaJz4nHTbog8SPXFZffOBeaLPDMsJlOzROHicVCBysdzIqmRhwjjqiaTvlCxmWV8xZnrVxlrXvyF4Zy+soy12mNIIFFLEGCCAVVlFCGjSjtOikWUnQe9/APN/0SuRRylcDIsYAKNMhNP/gf/J6tlZ+adJNCcSDw4jgfo0BwF2jUHOf72HEaJ4D/GbjS2/5KHZj5JL3W1iJHQP82cHHd1pQ94HIHGHoyZFNuSn5aQj4PvJ/RN2WBwVugZ82dW+scpw9AmmaVvAEODoGxAmWve7y7u3Nu//a05vcDSBxyluxHhCQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfjBQESGyJPrNb5AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAX5JREFUWMPtmcGSwyAMQ7GHW///e72ndtI0gCUr3c1OOLcvAoKQHWutRRuMiLAGDpsBGXAKiIAdmo7Z8uEWEekfZ5S+gKiSEfQQmAUfQb2yCUcPdOUrk95lBOrVnd1P25t43MAvAkenZr/7rnIZyZThs4yqWwJnsNHJcSVsCESnuR1d5dQfQMadh1NWwU5xbFNHEVfCLmJf2ctHdpYpc2ASwlIhu6vTKU9jWlKlQ9kvAXU4UC6g1EmZQel8OIKW3IYKnCi0nA9L5pA593/Xvp4qYeBqLSmFcHK4I/ENPAFIG+xXFK4KILnCrli37dnuFVBaYaUp1CvR7cjGoGZaxhO7CiS99SCFaG7sypLilGr0H5QVFFAR1qGyAoF+9GCrxbijf6CqgAqULsCpKuBX2s576LTTzlxUMj98PgxSeI0oco3QLl1DuqJnYBFhroSlFSIe2at3Srp1zzZ4O3t/pNKXrO1cVfW2hmYWLR6yrsgywdY+FG6URoTJvoBX8uEPgfcizoFx4TgAAAAASUVORK5CYII=';
    this.fs.writeFileSync('/hella', Uint8Array.from(atob(base64_string), c => c.charCodeAt(0)));
  }

  toJSON() {
    return this.volume.toJSON();
  }

  fromJSON(fsJson: any) {
    this.volume = Volume.fromJSON(fsJson);
    // @ts-ignore
    this.volume.releasedFds = [0, 1, 2];

    const fdErr = this.volume.openSync('/dev/stderr', 'w');
    const fdOut = this.volume.openSync('/dev/stdout', 'w');
    const fdIn = this.volume.openSync('/dev/stdin', 'r');
    assert(fdErr === 2, `invalid handle for stderr: ${fdErr}`);
    assert(fdOut === 1, `invalid handle for stdout: ${fdOut}`);
    assert(fdIn === 0, `invalid handle for stdin: ${fdIn}`);

    this.fs = createFsFromVolume(this.volume);
  }

  async getStdOut() {
    let promise = new Promise(resolve => {
      resolve(this.fs.readFileSync('/dev/stdout', 'utf8'));
    });
    return promise;
  }
}
