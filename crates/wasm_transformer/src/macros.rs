#[macro_export]
#[cfg(test)]
macro_rules! println_debug {
    ($fmt:expr) => {
        println!($fmt);
    };
    ($fmt:expr, $($arg:tt)*) => {
        println!($fmt, $($arg)*);
    }
}

/// Prints a log message with args, similar to println, when the trace feature is enabled.
/// If the trace feature is disabled, arguments are not evaluated or printed.
#[macro_export]
#[cfg(not(test))]
macro_rules! println_debug {
    ($fmt:expr) => {};
    ($fmt:expr, $($arg:tt)*) => {};
}
