// https://kripken.github.io/blog/wasm/2019/07/16/asyncify.html
// Way to slow to run on the client, however, leaving here for a possible server side implementation

const binaryenPromise: Promise<any> = fetch("assets/binaryen-88.0.0.js")
  .then(response => {
    return response.text();
  })
  .then(binaryenScript => {
    const binaryen = new Function(binaryenScript + "; return Binaryen")();
    binaryen.setOptimizeLevel(1);
    return binaryen;
  });

const asyncify = async (binaryArray: Uint8Array) => {
  const binaryen = await binaryenPromise;

  const binaryenModule = new binaryen.readBinary(binaryArray);

  // Asyncify the module
  binaryenModule.runPasses(["asyncify"]);

  // Asyncify function signature
  const asyncifySignature = binaryenModule.addFunctionType(
    "void",
    binaryen.none,
    []
  );
  const asyncifyCall = binaryenModule.call(
    "asyncify_fd_read",
    [],
    binaryen.none
  );

  // Insert functions we want to asyncify
  binaryenModule.addFunctionImport(
    "asyncify_fd_read",
    "env",
    "asyncify_fd_read",
    asyncifySignature
  );

  // TODO: Place the asyncify call in fron of all fd_reads

  // console.log('module', binaryenModule);
  // console.log('test', binaryenModule.emitText());

  return binaryenModule.emitBinary();
};

export default asyncify;
