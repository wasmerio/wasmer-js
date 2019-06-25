import React from 'react'
import { Terminal, ITerminalOptions } from 'xterm'
import parse_ from 'shell-parse'
import { Volume, createFsFromVolume, IFs } from 'memfs'

import { Duplex } from 'stream'
import { PassThrough } from 'stream'
import './polyfills'
import WASI from './wasi'
import BrowserBindings, { WASIExitError, WASIKillError } from './bindings/browser'
// declare function parse(moduleName: string): any;

const parse = parse_

const merge = (...streams: Duplex[]) => {
  let pass = new PassThrough()
  let waiting = streams.length
  for (let stream of streams) {
    pass = stream.pipe(
      pass,
      { end: false }
    )
    stream.once('end', () => --waiting === 0 && pass.emit('end'))
  }
  return pass
}

export type CommandOptions = {
  args: string[]
  env: { [key: string]: string }
}

export class Command {
  args: string[]
  env: { [key: string]: string }

  constructor({ args, env }: CommandOptions) {
    this.args = args
    this.env = env
  }
  run() {
    throw new Error('Not implemented')
  }
  instantiate(): Promise<Duplex> | Duplex {
    throw new Error('Not implemented')
  }
  async kill() {}
}

export type WASMCommandOptions = CommandOptions & {
  module: WebAssembly.Module
}

const assert = (cond: boolean, message: string) => {
  if (!cond) {
    throw new Error(message)
  }
}

export class WASICommand extends Command {
  wasi: WASI
  promisedInstance: Promise<WebAssembly.Instance>
  instance: WebAssembly.Instance | undefined
  memfs: IFs

  constructor(options: WASMCommandOptions) {
    super(options)
    let vol = Volume.fromJSON({
      // '/dev/tty': '',
      // '/dev/tty1': '',
      '/dev/stderr': '',
      '/dev/stdout': '',
      '/dev/stdin': ''
    })
    vol.releasedFds = [0, 1, 2]
    let memfs = createFsFromVolume(vol)
    // memfs.symlinkSync('/dev/tty', '/dev/stdout')
    // memfs.symlinkSync('/dev/tty', '/dev/stdin')
    // memfs.symlinkSync('/dev/tty1', '/dev/stderr')

    const fd_err = memfs.openSync('/dev/stderr', 'w')
    const fd_out = memfs.openSync('/dev/stdout', 'w')
    const fd_in = memfs.openSync('/dev/stdin', 'r')
    // @ts-ignore
    let readCounter = 0
    vol.fds[0].read = function(
      buf: Buffer | Uint8Array,
      offset: number = 0,
      length: number = buf.byteLength,
      position?: number
    ) {
      // console.log('read');
      // console.log(buf, offset, length, position);
      if (readCounter !== 0) {
        readCounter = ++readCounter % 3
        return 0
      }
      let input = prompt('Input: ')
      if (input === null || input === '') {
        readCounter++
        return 0
      }
      let buffer = Buffer.from(input, 'utf-8')
      for (let x = 0; x < buffer.length; ++x) {
        buf[x] = buffer[x]
      }
      readCounter++
      // We write as it was an enter
      // memfs.writeSync(1, "\r\n");
      return buffer.length + 1
    }
    assert(fd_err === 2, `invalid handle for stderr: ${fd_err}`)
    assert(fd_out === 1, `invalid handle for stdout: ${fd_out}`)
    assert(fd_in === 0, `invalid handle for stdin: ${fd_in}`)

    this.wasi = new WASI({
      preopenDirectories: {},
      env: options.env,
      args: options.args,
      bindings: {
        ...BrowserBindings,
        fs: memfs
      }
    })
    this.memfs = memfs
    this.promisedInstance = WebAssembly.instantiate(options.module, {
      wasi_unstable: this.wasi.exports
    })
  }

  async instantiate(): Promise<Duplex> {
    let instance = await Promise.resolve(this.promisedInstance)
    this.instance = instance
    this.wasi.setMemory((instance as any).exports.memory)
    let stdoutRead = this.memfs.createReadStream('/dev/stdout')
    let stderrRead = this.memfs.createReadStream('/dev/stderr')
    let stdinWrite = this.memfs.createReadStream('/dev/stdin')
    // We join the stdout and stderr together
    let stream = merge((stdoutRead as unknown) as Duplex, (stderrRead as unknown) as Duplex)
    return stream
  }

  run() {
    if (!this.instance) {
      throw new Error('You need to call instantiate first.')
    }
    this.instance.exports._start()
    // this.pipe.write("abc");
    // return returned;
  }
}

export class EmscriptenCommand extends Command {}

export interface XTermProps {
  options?: ITerminalOptions
  onSetup?: (term: XTerm) => void
  getCommand: (options: {
    args: string[]
    env: { [key: string]: string }
  }) => Command | Promise<Command>
}

export default class XTerm extends React.Component<XTermProps> {
  xterm: Terminal
  container: HTMLElement | null

  constructor(props: XTermProps) {
    super(props)
    this.container = null
    this.xterm = new Terminal(this.props.options)
  }
  componentDidMount() {
    if (!this.container) {
      return
    }
    console.log(this.xterm)
    this.xterm.open(this.container)
    this.prompt()
    this.xterm.on('key', this.onKey.bind(this))
    this.xterm.on('paste', this.onPaste.bind(this))
    this.xterm.focus()
    if (this.props.onSetup) {
      this.props.onSetup(this)
    }
  }
  onPaste(data: string) {
    this.xterm.write(data)
  }
  onKey(key: string, ev: KeyboardEvent) {
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey
    if (ev.keyCode === 13) {
      // ENTER
      // console.log(term.markers[term.markers.length-1].line);
      // let line = term.markers[term.markers.length-1].line;
      let line = this.xterm.buffer.baseY + this.xterm.buffer.cursorY
      // console.log(term.buffer.getLine(line).translateToString());
      let bufferLine = this.xterm.buffer.getLine(line)
      if (!bufferLine) {
        return
      }
      let bashCommand = bufferLine
        .translateToString()
        .substr(2)
        .trim()
      this.xterm.write('\r\n')
      if (bashCommand === '') {
        this.prompt()
        return
      }
      try {
        const bashAst = parse(bashCommand)
        if (bashAst.length > 1) {
          throw new Error('Only one command permitted')
        }
        if (bashAst[0].type !== 'command') {
          throw new Error('Only commands allowed')
        }
        let command = bashAst[0].command.value
        let commandArgs = bashAst[0].args.map((arg: any) => arg.value)
        let args = [command, ...commandArgs]
        // let env = {}
        let env = Object.fromEntries(
          Object.entries(bashAst[0].env).map(([key, value]: [string, any]) => [key, value.value])
        )
        this.runCommand({ args, env })
      } catch (c) {
        console.log(c)
        this.xterm.write(`wapm shell: parse error (${c.toString()})\r\n$ `)
      }
      // term.prompt();
    } else if (ev.keyCode === 8) {
      // DELETE
      // Do not delete the prompt
      // @ts-ignore
      if (this.xterm._core.buffer.x > 2) {
        this.xterm.write('\b \b')
      }
    } else if (printable && !ev.key.startsWith('Arrow')) {
      // console.log(key, ev.key.startsWith("Arrow"));
      this.xterm.write(key)
    }
  }
  async runCommand(options: { args: string[]; env: { [key: string]: string } }) {
    let command: Command
    try {
      let maybePromiseCommand = this.props.getCommand(options)
      command = await Promise.resolve(maybePromiseCommand)
      let commandPipe = await command.instantiate()
      let xterm = this.xterm
      let termPipe = new Duplex({
        read() {},
        write(data: any, _: any, done: Function) {
          // console.log('write pipe')
          let dataStr = data.toString('utf8')
          xterm.write(dataStr.replace(/\n/g, '\r\n'))
        }
      })
      commandPipe.once('end', () => {
        // console.log(xterm.buffer.cursorX);
        let haveNewLine = xterm.buffer.cursorX == 0
        // let haveNewLine = dataStr.endsWith("\n");
        if (!haveNewLine) {
          xterm.write('\u001b[1m\u001b[30;47m%\u001b[0m\r\n')
        }
        this.prompt()
      })
      commandPipe.pipe(termPipe)
      command.run()
    } catch (e) {
      let commandName = options.args.join(' ')
      if (e instanceof WASIExitError) {
        console.log(`Program "${commandName}" exitted with code: ${e.code}`)
        // this.prompt()
        return
      } else if (e instanceof WASIKillError) {
        console.log(`Program "${commandName}" killed with signal: ${e.signal}`)
        // this.prompt()
        return
      }
      console.error(`Error while running "${commandName}"\n${e}`)
      this.xterm.writeln(`wapm shell error: ${e.toString()}`)
      this.prompt()
      return
    }
    // command.run().pipe(this.terminalWriter)
  }
  prompt() {
    this.xterm.write(`$ `)
  }
  componentWillUnmount() {
    this.xterm.destroy()
    delete this.xterm
  }
  getTerminal() {
    return this.xterm
  }
  render() {
    return <div ref={ref => (this.container = ref)} />
  }
}

export { Terminal, XTerm }
