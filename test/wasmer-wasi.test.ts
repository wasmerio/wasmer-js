import * as fs from 'fs'
import { WASI } from '../src'
import '../src/webassembly.d'
import { createFsFromVolume, IFs } from 'memfs'
import { Volume } from 'memfs/lib/volume'

const instantiateWasi = async (file: string, memfs: IFs, args: string[] = []) => {
  let wasi = new WASI({
    preopenDirectories: {},
    env: {},
    args: args,
    bindings: {
      ...WASI.defaultConfig.bindings,
      fs: memfs
    }
  })
  const buf = fs.readFileSync(file)
  let bytes = new Uint8Array(buf as any).buffer
  let { instance } = await WebAssembly.instantiate(bytes, { wasi_unstable: wasi.exports })
  wasi.setMemory(instance.exports.memory)
  return { wasi, instance }
}

const getStdout = (memfs: IFs) => {
  let promise = new Promise((resolve, reject) => {
    const rs_out = memfs.createReadStream('/dev/stdout', 'utf8')
    rs_out.on('data', data => {
      resolve(data.toString('utf8'))
    })
  })
  return promise
}

describe('WASI interaction', () => {
  let memfs: IFs
  beforeEach(async () => {
    let vol = Volume.fromJSON({
      '/dev/stdin': '',
      '/dev/stdout': '',
      '/dev/stderr': ''
    })
    vol.releasedFds = [0, 1, 2]
    memfs = createFsFromVolume(vol)

    const fd_err = vol.openSync('/dev/stderr', 'w')
    const fd_out = vol.openSync('/dev/stdout', 'w')
    const fd_in = vol.openSync('/dev/stdin', 'w')
    expect(fd_err).toBe(2)
    expect(fd_out).toBe(1)
    expect(fd_in).toBe(0)
  })

  it('Helloworld can be run', async () => {
    let { instance, wasi } = await instantiateWasi('test/rs/helloworld.wasm', memfs)
    instance.exports._start()
    expect(await getStdout(memfs)).toMatchInlineSnapshot(`
      "Hello world!
      "
    `)
  })

  it('WASI args work', async () => {
    let { instance, wasi } = await instantiateWasi('test/rs/args.wasm', memfs, [
      'demo',
      '-h',
      '--help',
      '--',
      'other'
    ])
    instance.exports._start()
    expect(await getStdout(memfs)).toMatchInlineSnapshot(`
      "[\\"demo\\", \\"-h\\", \\"--help\\", \\"--\\", \\"other\\"]
      "
    `)
  })
})
