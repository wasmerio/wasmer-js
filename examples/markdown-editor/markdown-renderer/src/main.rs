use pulldown_cmark::{Options, Parser};
use std::io::Read;

fn main() -> std::io::Result<()> {
    let mut markdown_input = String::new();
    std::io::stdin().read_to_string(&mut markdown_input)?;
    let parser = Parser::new_ext(&markdown_input, Options::all());

    pulldown_cmark::html::write_html(std::io::stdout(), parser)?;
    Ok(())
}
