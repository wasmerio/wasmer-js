(module

  ;; Import an i64, clock_time_get, wasi fucntion
  ;; But change the i64s to i32s. 
  (import "wasi_unstable" "clock_time_get" (func $~lib/bindings/wasi_unstable/clock_time_get (param i32 i64 i32) (result i32)))

  (import "wasi_unstable" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

  ;; Write a string to memory at an offset (pointer) of 8 bytes
  ;; Note the trailing newline which is required for the text to appear
  (data (i32.const 8) "Done!\n")

  ;; Set up memory for output
  (memory 1)
  (export "memory" (memory 0))

  ;; Export our wasi _start function
  (func $main (export "_start")

    ;;---i64 lowering---

    ;; Make a call to clock_time_get with random params
    ;; However, this should be changed to the trampoline function
    i32.const 0
    i64.const 1000
    i32.const 100
    call $~lib/bindings/wasi_unstable/clock_time_get
    drop ;; Discard the number of bytes written from the top the stack

    ;; ---Printing Done---

    ;; Creating a new io vector within linear memory
    (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'Done!\n' string
    (i32.store (i32.const 4) (i32.const 6))  ;; iov.iov_len - The length of the 'Done!\n' string

    (call $fd_write
        (i32.const 1) ;; file_descriptor - 1 for stdout
        (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
        (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
        (i32.const 20) ;; nwritten - A place in memory to store the number of bytes writen
    )
    drop ;; Discard the number of bytes written from the top the stack
  )
)
