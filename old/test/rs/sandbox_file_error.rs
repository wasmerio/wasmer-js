use std::fs::File;
use std::io::prelude::*;

fn main()  {
    let mut file = File::open("/sandbox/../outside.txt");
    println!("{:?}", file.is_err());
}
