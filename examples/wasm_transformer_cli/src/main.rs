use std::*;
use clap::{Arg, App};

const NAME: &str = env!("CARGO_PKG_NAME");
const AUTHORS: &str = env!("CARGO_PKG_AUTHORS");
const VERSION: &str = env!("CARGO_PKG_VERSION");

fn main() {
    let matches = App::new(NAME)
        .version(VERSION)
        .author(AUTHORS)
        .about("Very simple CLI example for the wasm_transformer crate. Outputs to ./out.wasm")
        .arg(Arg::with_name("WASM_FILE")
                 .required(true)
                 .takes_value(true)
                 .index(1)
                 .help("wasm file to transformer"))
        .get_matches();
    let wasm_file_path = matches.value_of("WASM_FILE").unwrap();

    println!(" ");
    println!("Using wasm_transformer version: {}", wasm_transformer::version());
    println!(" ");

    // Run the transformation on the file
    let wasm = fs::read(wasm_file_path).unwrap();
    let lowered_wasm = wasm_transformer::lower_i64_imports(wasm);
    fs::write("./out.wasm", &lowered_wasm).expect("Unable to write file");

    println!(" ");
    println!("Wrote resulting Wasm to: ./out.wasm");
    println!(" ");
}
