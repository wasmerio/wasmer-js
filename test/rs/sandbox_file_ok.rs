use std::fs::File;
use std::io::prelude::*;

fn main()  {
    let mut file = File::open("/sandbox/../outside.txt");
    // assert_eq!(file.is_err(), "It should return an error");
}
