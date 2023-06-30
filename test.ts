const blob = new Blob([new TextEncoder().encode('export function greet(name) {console.log(`hello ${name}`);}')], { type: "text/javascript" });
console.log(blob);
const url = URL.createObjectURL(blob);
console.log(url);

await import(url).then((module) => {
    console.log(module.greet.toString());
}).catch((err) => {
    console.error(err);
});
URL.revokeObjectURL(url);
export { }
