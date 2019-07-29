import * as fs from 'fs'
import { WASI } from '../src'
import { createFsFromVolume, IFs } from 'memfs'
import { Volume } from 'memfs/lib/volume'
import NodeBindings from '../src/bindings/node'

const TextEncoder = require('text-encoder-lite').TextEncoderLite

const bytesConverter = (buffer: Buffer): Buffer => {
  // Help debugging: https://webassembly.github.io/wabt/demo/wat2wasm/index.html
  let wasi_unstable = new TextEncoder().encode('wasi_unstable')
  let path_open = new TextEncoder().encode('path_open')
  var tmp = new Uint8Array(1 + wasi_unstable.byteLength + 1 + path_open.byteLength + 1)
  tmp[0] = 0x0d
  tmp.set(new Uint8Array(wasi_unstable), 1)
  tmp[wasi_unstable.byteLength + 1] = 0x09
  tmp.set(new Uint8Array(path_open), wasi_unstable.byteLength + 2)
  tmp[1 + wasi_unstable.byteLength + 1 + path_open.byteLength + 1] = 0x00
  let index = buffer.indexOf(tmp)
  console.log(index)
  // let signatureIndex = buffer[index+path_open.length+1];

  // 0000043: 60                                        ; func
  // 0000044: 09                                        ; num params
  // 0000045: 7f                                        ; i32
  // 0000046: 7f                                        ; i32
  // 0000047: 7f                                        ; i32
  // 0000048: 7f                                        ; i32
  // 0000049: 7f                                        ; i32
  // 000004a: 7e                                        ; i64
  // 000004b: 7e                                        ; i64
  // 000004c: 7f                                        ; i32
  // 000004d: 7f                                        ; i32
  // 000004e: 01                                        ; num results
  // 000004f: 7f                                        ; i32

  let functionTypeIndex = buffer.indexOf(
    new Uint8Array([0x60, 0x09, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7e, 0x7e, 0x7f, 0x7f, 0x01, 0x7f])
  )

  console.log(functionTypeIndex)
  // console.log(path_open, );

  // Patch the signature

  // Patch the calls to that signature
  return buffer
}
const instantiateWasi = async (
  file: string,
  memfs: IFs,
  args: string[] = [],
  env: { [key: string]: string } = {}
) => {
  let wasi = new WASI({
    preopenDirectories: {
      '/sandbox': '/sandbox'
    },
    env: env,
    args: args,
    bindings: {
      ...NodeBindings,
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
  // console.log(memfs.toJSON("/dev/stdout"))
  let promise = new Promise((resolve, reject) => {
    const rs_out = memfs.createReadStream('/dev/stdout', 'utf8')
    // let prevData = ''
    rs_out.on('data', data => {
      // prevData = prevData + data.toString('utf8')
      resolve(data.toString('utf8'))
    })
  })
  return promise
}

describe('WASI interaction', () => {
  let memfs: IFs
  let vol: Volume
  beforeEach(async () => {
    vol = Volume.fromJSON({
      '/dev/stdin': '',
      '/dev/stdout': '',
      '/dev/stderr': '',
      '/sandbox/file1': 'contents1'
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

  it('WASI env work', async () => {
    let { instance, wasi } = await instantiateWasi('test/rs/env.wasm', memfs, [], {
      WASM_EXISTING: 'VALUE'
    })
    instance.exports._start()
    expect(await getStdout(memfs)).toMatchInlineSnapshot(`
      "should be set (WASM_EXISTING): Some(\\"VALUE\\")
      shouldn't be set (WASM_UNEXISTING): None
      Set existing var (WASM_EXISTING): Some(\\"NEW_VALUE\\")
      Set unexisting var (WASM_UNEXISTING): Some(\\"NEW_VALUE\\")
      All vars in env:
      WASM_EXISTING: NEW_VALUE
      WASM_UNEXISTING: NEW_VALUE
      "
    `)
  })

  it('converts path_open', async () => {
    let originalBuffer = fs.readFileSync('test/rs/sandbox_file_ok.wasm')
    bytesConverter(originalBuffer)
  })
  // it('WASI sandbox error', async () => {
  //   let { instance, wasi } = await instantiateWasi('test/rs/sandbox_file_error.wasm', memfs, [], {})
  //   // console.log("instantiated");
  //   instance.exports._start()
  //   expect(await getStdout(memfs)).toMatchInlineSnapshot()
  // })
})
