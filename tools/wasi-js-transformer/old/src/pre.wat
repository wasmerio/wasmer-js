(module
  (type $t0 (func))
  (type $t1 (func (param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32)))
  (import "wasi_unstable" "path_open" (func $path_open (type $t1)))
  (func $_start (type $t0)
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i32.const 12
    i64.const 12
    i64.const 12
    i32.const 12
    i32.const 12
    call $path_open
  )
  (memory $memory 17)
  (export "memory" (memory 0))
  (export "_start" (func $_start))
)
