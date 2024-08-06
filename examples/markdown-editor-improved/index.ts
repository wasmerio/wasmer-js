import { init, Wasmer, Command } from "@wasmer/sdk";

async function initialize() {
  await init();
  return await Wasmer.fromRegistry("wasmer-examples/markdown-renderer");
}

function debounce(
  func: (...args: any[]) => void,
  delay: number,
): (...args: any[]) => void {
  let debounceTimer: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

async function renderMarkdown(cmd: Command, markdown: string) {
  const instance = await cmd.run();
  const stdin = instance.stdin.getWriter();
  const encoder = new TextEncoder();
  await stdin.write(encoder.encode(markdown));
  await stdin.close();

  const result = await instance.wait();
  return result.ok ? result.stdout : null;
}

async function main() {
  const pkg = await initialize();
  const output = document.getElementById("html-output") as HTMLIFrameElement;
  const markdownInput = document.getElementById(
    "markdown-input",
  ) as HTMLTextAreaElement;

  const debouncedRender = debounce(async () => {
    const renderedHtml = await renderMarkdown(
      pkg.entrypoint!,
      markdownInput.value,
    );
    if (renderedHtml) {
      output.srcdoc = renderedHtml;
    }
  }, 500); // 500 milliseconds debounce period

  markdownInput.addEventListener("input", debouncedRender);
}

main();
