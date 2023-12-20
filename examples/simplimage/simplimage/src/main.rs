use std::io::{Read, Seek, Write};

use clap::Parser;

fn main() -> std::io::Result<()> {
    let args = Args::parse();

    match args.cmd {
        Cmd::Resize(resize) => {
            let data = {
                let mut data = Vec::new();
                std::io::stdin().read_to_end(&mut data)?;
                data
            };

            let img = image::load_from_memory(&data).expect("could not load image");

            let resized = img.resize_exact(
                resize.width,
                resize.height,
                image::imageops::FilterType::Nearest,
            );

            let tmpdir = std::path::Path::new("/tmp/imgdata");
            let outpath = tmpdir.join("out.png");

            std::fs::create_dir_all(&tmpdir).expect("could not create tmp dir");
            let mut f = std::fs::File::create(&outpath).expect("could not create file");

            resized
                .write_to(&mut f, image::ImageOutputFormat::Png)
                .expect("could not write image to file");

            f.seek(std::io::SeekFrom::Start(0))
                .expect("could not seek image file position");

            f.sync_all().expect("could not sync image file");

            let out_data = std::fs::read(&outpath).expect("could not read image file");

            let mut stdout = std::io::stdout().lock();
            stdout
                .write_all(&out_data)
                .expect("could not write image to stdout");
        }
    }

    Ok(())
}

#[derive(clap::Parser)]
struct Args {
    #[clap(subcommand)]
    cmd: Cmd,
}

#[derive(clap::Subcommand)]
enum Cmd {
    Resize(Resize),
}

#[derive(clap::Parser)]
struct Resize {
    #[clap(long)]
    width: u32,
    #[clap(long)]
    height: u32,
}
