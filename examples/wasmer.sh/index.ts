import "xterm/css/xterm.css";

import type { Instance } from "@wasmer/sdk";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

const encoder = new TextEncoder();
const params = new URLSearchParams(window.location.search);

const packageName = params.get("package") || "sharrattj/bash";
const uses = packageName == "sharrattj/bash" ? ["wasmer/neatvi"] : params.getAll("use");

const args = params.getAll("arg");
const logFilter = params.get("log") || "trace";

async function main() {
  // Note: We dynamically import the Wasmer SDK to make sure the bundler puts
  // it in its own chunk. This works around an issue where just importing
  // xterm.js runs top-level code which accesses the DOM, and if it's in the
  // same chunk as @wasmer/sdk, each Web Worker will try to run this code and
  // crash.
  // See https://github.com/wasmerio/wasmer-js/issues/373
  const { Wasmer, init, Directory } = await import("@wasmer/sdk");

  await init({log: logFilter});

  const term = new Terminal({ cursorBlink: true, convertEol: true });
  const fit = new FitAddon();
  term.loadAddon(fit);
  term.open(document.getElementById("terminal")!);
  fit.fit();

  term.writeln("Starting...");
  const pkg = await Wasmer.fromRegistry(packageName);
  term.reset();
  const home = new Directory();
  await home.writeFile("example.c",
  `#include<stdio.h>
  
  int main() {
    printf("Hello World from WebAssembly!\\n");
    return 0;
  }
  `);
  await home.writeFile("donut.c", `
#include <stdio.h>
#include <string.h>

             k;double sin()
         ,cos();main(){float A=
       0,B=0,i,j,z[1760];char b[
     1760];printf("\x1b[2J");for(;;
  ){memset(b,32,1760);memset(z,0,7040)
  ;for(j=0;6.28>j;j+=0.07)for(i=0;6.28
 >i;i+=0.02){float c=sin(i),d=cos(j),e=
 sin(A),f=sin(j),g=cos(A),h=d+2,D=1/(c*
 h*e+f*g+5),l=cos      (i),m=cos(B),n=s\
in(B),t=c*h*g-f*        e;int x=40+30*D*
(l*h*m-t*n),y=            12+15*D*(l*h*n
+t*m),o=x+80*y,          N=8*((f*e-c*d*g
 )*m-c*d*e-f*g-l        *d*n);if(22>y&&
 y>0&&x>0&&80>x&&D>z[o]){z[o]=D;;;b[o]=
 ".,-~:;=!*#$@"[N>0?N:0];}}/*#****!!-*/
  printf("\x1b[H");for(k=0;1761>k;k++)
   putchar(k%80?b[k]:10);A+=0.04;B+=
     0.02;}}/*****####*******!!=;:~
       ~::==!!!**********!!!==::-
         .,~~;;;========;;;:~-.
             ..,--------,*/
`);
  
  const instance = await pkg.entrypoint!.run({ args, uses,  mount: { "/home": home }, cwd: "/home"});
  connectStreams(instance, term);
}

function connectStreams(instance: Instance, term: Terminal) {
  const stdin = instance.stdin?.getWriter();
  term.onData(data => stdin?.write(encoder.encode(data)));
  instance.stdout.pipeTo(
    new WritableStream({ write: chunk => term.write(chunk) }),
  );
  instance.stderr.pipeTo(
    new WritableStream({ write: chunk => term.write(chunk) }),
  );
}

main();
