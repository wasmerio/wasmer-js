await Bun.build({
    entrypoints: ['./src/demo.ts'],
    outdir: './build',
    minify: true,
});
  