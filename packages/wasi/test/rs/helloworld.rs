fn main() {
    println!("Hello world!");
}

#[export_name = "_wasi_asyncify_alloc"]
fn alloc(n: usize) -> *mut u32 {
    let mut data = vec![0; n];
    let ptr = data.as_mut_ptr();
    std::mem::forget(data);
    ptr
}
