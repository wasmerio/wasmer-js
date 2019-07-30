use std::env;

fn main() {
    let existing = env::var_os("WASM_EXISTING");
    println!("should be set (WASM_EXISTING): {:?}", existing);
    let unexisting = env::var_os("WASM_UNEXISTING");
    println!("shouldn't be set (WASM_UNEXISTING): {:?}", unexisting);

    env::set_var("WASM_EXISTING", "NEW_VALUE");
    let existing = env::var_os("WASM_EXISTING");
    println!("Set existing var (WASM_EXISTING): {:?}", existing);
    env::set_var("WASM_UNEXISTING", "NEW_VALUE");
    let unexisting = env::var_os("WASM_UNEXISTING");
    println!("Set unexisting var (WASM_UNEXISTING): {:?}", unexisting);

    println!("All vars in env:");
    for (key, value) in env::vars() {
        println!("{}: {}", key, value);
    }
}
