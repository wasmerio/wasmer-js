import { WasmFs } from '../index';

describe('wasmfs', () => {
  let wasmfs: WasmFs;

  beforeEach(async () => {
    wasmfs = new WasmFs();
  });

  it('should have stdin, stdout, and stderr', async () => {
    expect(wasmfs.fs.existsSync('/dev/stdin')).toBe(true);
    expect(wasmfs.fs.existsSync('/dev/stdout')).toBe(true);
    expect(wasmfs.fs.existsSync('/dev/stderr')).toBe(true);
  });

  it('should be able to retrieve stdout', async () => {
    const stdout = 'test';
    wasmfs.fs.writeFileSync('/dev/stdout', stdout);

    const response = await wasmfs.getStdOut();
    expect(response).toBe(stdout);
  });
});
