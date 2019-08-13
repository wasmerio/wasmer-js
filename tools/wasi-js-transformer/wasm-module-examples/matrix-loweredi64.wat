(module
 (type $FUNCSIG$v (func))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$viii (func (param i32 i32 i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$iiiii (func (param i32 i32 i32 i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$i (func (result i32)))
 (type $FUNCSIG$iiji (func (param i32 i64 i32) (result i32)))
 (type $FUNCSIG$iiii (func (param i32 i32 i32) (result i32)))
 (type $FUNCSIG$di (func (param i32) (result f64)))
 (type $clock_time_get_trampoline_SIG (func (param i32 i64 i32) (result i32)))
 (import "wasi_unstable" "fd_write" (func $~lib/bindings/wasi_unstable/fd_write (param i32 i32 i32 i32) (result i32)))
 (import "wasi_unstable" "args_sizes_get" (func $~lib/bindings/wasi_unstable/args_sizes_get (param i32 i32) (result i32)))
 (import "wasi_unstable" "args_get" (func $~lib/bindings/wasi_unstable/args_get (param i32 i32) (result i32)))
 (import "wasi_unstable" "random_get" (func $~lib/bindings/wasi_unstable/random_get (param i32 i32) (result i32)))
 (import "wasi_unstable" "clock_time_get" (func $~lib/bindings/wasi_unstable/clock_time_get (param i32 i32 i32) (result i32)))
 (memory $0 1)
 (data (i32.const 8) "\02\00\00\00\1b\00[")
 (data (i32.const 16) "\03\00\00\003\002\00m")
 (data (i32.const 32) "\04\00\00\00n\00u\00l\00l")
 (data (i32.const 48) "\0e\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s")
 (data (i32.const 88) "\17\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s")
 (data (i32.const 144) "\03\00\00\003\007\00m")
 (data (i32.const 160) "\03\00\00\003\001\00m")
 (data (i32.const 176) "\03\00\00\003\006\00m")
 (data (i32.const 192) "\02\00\00\000\00m")
 (data (i32.const 200) "\04\00\00\00?\002\005\00h")
 (data (i32.const 224) "\d8")
 (data (i32.const 232) "\0d\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 264) "\1c\00\00\00~\00l\00i\00b\00/\00i\00n\00t\00e\00r\00n\00a\00l\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 328) "\0b\00\00\00w\00a\00s\00m\00-\00m\00a\00t\00r\00i\00x")
 (data (i32.const 360) "\06\00\00\00U\00S\00A\00G\00E\00:")
 (data (i32.const 376) ",\00\00\00[\00w\00a\00p\00m\00 \00r\00u\00n\00]\00 \00w\00a\00s\00m\00-\00m\00a\00t\00r\00i\00x\00 \00-\00l\00 \00$\00L\00I\00N\00E\00S\00 \00-\00c\00 \00$\00C\00O\00L\00U\00M\00N\00S")
 (data (i32.const 472) "\06\00\00\00F\00L\00A\00G\00S\00:")
 (data (i32.const 488) "\0c\00\00\00-\00l\00,\00 \00-\00-\00l\00i\00n\00e\00s\00 ")
 (data (i32.const 520) "\n\00\00\00(\00R\00E\00Q\00U\00I\00R\00E\00D\00)")
 (data (i32.const 544) "+\00\00\00N\00u\00m\00b\00e\00r\00 \00o\00f\00 \00l\00i\00n\00e\00s\00 \00(\00r\00o\00w\00s\00)\00 \00t\00o\00 \00r\00e\00n\00d\00e\00r\00 \00t\00h\00e\00 \00m\00a\00t\00r\00i\00x")
 (data (i32.const 640) ".\00\00\00S\00u\00g\00g\00e\00s\00t\00e\00d\00:\00 \00$\00L\00I\00N\00E\00S\00 \00[\00B\00a\00s\00h\00 \00V\00a\00r\00i\00a\00b\00l\00e\00]\00,\00 \00D\00e\00f\00a\00u\00l\00t\00:\00 \002\004")
 (data (i32.const 736) "\0e\00\00\00-\00c\00,\00 \00-\00-\00c\00o\00l\00u\00m\00n\00s\00 ")
 (data (i32.const 768) "&\00\00\00N\00u\00m\00b\00e\00r\00 \00o\00f\00 \00c\00o\00l\00u\00m\00n\00s\00 \00t\00o\00 \00r\00e\00n\00d\00e\00r\00 \00t\00h\00e\00 \00m\00a\00t\00r\00i\00x")
 (data (i32.const 848) "0\00\00\00S\00u\00g\00g\00e\00s\00t\00e\00d\00:\00 \00$\00C\00O\00L\00U\00M\00N\00S\00 \00[\00B\00a\00s\00h\00 \00V\00a\00r\00i\00a\00b\00l\00e\00]\00,\00 \00D\00e\00f\00a\00u\00l\00t\00:\00 \008\000")
 (data (i32.const 952) "\0b\00\00\00-\00s\00,\00 \00-\00-\00s\00p\00e\00e\00d")
 (data (i32.const 984) "\13\00\00\00S\00p\00e\00e\00d\00 \00o\00f\00 \00t\00h\00e\00 \00m\00a\00t\00r\00i\00x")
 (data (i32.const 1032) "\18\00\00\00S\00u\00g\00g\00e\00s\00t\00e\00d\00:\00 \001\00,\00 \00D\00e\00f\00a\00u\00l\00t\00:\00 \001")
 (data (i32.const 1088) "\02\00\00\00-\00l")
 (data (i32.const 1096) "\07\00\00\00-\00-\00l\00i\00n\00e\00s")
 (data (i32.const 1120) "&\00\00\00P\00l\00e\00a\00s\00e\00 \00e\00n\00t\00e\00r\00 \00a\00 \00l\00i\00n\00e\00s\00 \00g\00r\00e\00a\00t\00e\00r\00 \00t\00h\00a\00n\00 \00z\00e\00r\00o")
 (data (i32.const 1200) "\02\00\00\00-\00c")
 (data (i32.const 1208) "\t\00\00\00-\00-\00c\00o\00l\00u\00m\00n\00s")
 (data (i32.const 1232) "\'\00\00\00P\00l\00e\00a\00s\00e\00 \00e\00n\00t\00e\00r\00 \00a\00 \00c\00o\00l\00u\00m\00n\00 \00g\00r\00e\00a\00t\00e\00r\00 \00t\00h\00a\00n\00 \00z\00e\00r\00o")
 (data (i32.const 1320) "\02\00\00\00-\00s")
 (data (i32.const 1328) "\07\00\00\00-\00-\00s\00p\00e\00e\00d")
 (data (i32.const 1352) "\"\00\00\00P\00l\00e\00a\00s\00e\00 \00e\00n\00t\00e\00r\00 \00a\00 \00s\00p\00e\00e\00d\00 \00>\00=\001\00 \00a\00n\00d\00 \00<\00=\00 \002\000")
 (data (i32.const 1424) "\02\00\00\00-\00h")
 (data (i32.const 1432) "\06\00\00\00-\00-\00h\00e\00l\00p")
 (data (i32.const 1448) "\02\00\00\002\00J")
 (data (i32.const 1456) "\01\00\00\000")
 (data (i32.const 1464) "(\00\00\00\00\00\00\00\01\00\00\00\n\00\00\00d\00\00\00\e8\03\00\00\10\'\00\00\a0\86\01\00@B\0f\00\80\96\98\00\00\e1\f5\05\00\ca\9a;")
 (data (i32.const 1528) "\b8\05\00\00\n")
 (data (i32.const 1536) "\01\00\00\00;")
 (data (i32.const 1544) "\01\00\00\00H")
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $~lib/allocator/arena/startOffset (mut i32) (i32.const 0))
 (global $~lib/allocator/arena/offset (mut i32) (i32.const 0))
 (global $assembly/ansi/GREEN (mut i32) (i32.const 0))
 (global $assembly/ansi/WHITE (mut i32) (i32.const 0))
 (global $assembly/ansi/RED (mut i32) (i32.const 0))
 (global $assembly/ansi/CYAN (mut i32) (i32.const 0))
 (global $assembly/ansi/RESET (mut i32) (i32.const 0))
 (global $assembly/ansi/HIDE_CURSOR (mut i32) (i32.const 0))
 (global $assembly/utils/randomBytePointer (mut i32) (i32.const 0))
 (global $assembly/utils/timeCounterPointer (mut i32) (i32.const 0))
 (global $~lib/argc (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "_start" (func $assembly/index/_start))
 (export "_setargc" (func $~lib/setargc))
 (export "wasiabort" (func $assembly/env/wasiabort|trampoline))
 (start $start)
 (func $~lib/string/String#get:lengthUTF8 (; 5 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 1
  local.set $1
  local.get $0
  i32.load
  local.set $4
  loop $continue|0
   local.get $2
   local.get $4
   i32.lt_u
   if
    local.get $0
    local.get $2
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u offset=4
    local.tee $3
    i32.const 128
    i32.lt_u
    if (result i32)
     local.get $1
     i32.const 1
     i32.add
     local.set $1
     local.get $2
     i32.const 1
     i32.add
    else     
     local.get $3
     i32.const 2048
     i32.lt_u
     if (result i32)
      local.get $1
      i32.const 2
      i32.add
      local.set $1
      local.get $2
      i32.const 1
      i32.add
     else      
      block (result i32)
       local.get $3
       i32.const 64512
       i32.and
       i32.const 55296
       i32.eq
       local.tee $3
       if
        local.get $2
        i32.const 1
        i32.add
        local.get $4
        i32.lt_u
        local.set $3
       end
       local.get $3
      end
      if (result i32)
       local.get $0
       local.get $2
       i32.const 1
       i32.add
       i32.const 1
       i32.shl
       i32.add
       i32.load16_u offset=4
       i32.const 64512
       i32.and
       i32.const 56320
       i32.eq
      else       
       local.get $3
      end
      if (result i32)
       local.get $1
       i32.const 4
       i32.add
       local.set $1
       local.get $2
       i32.const 2
       i32.add
      else       
       local.get $1
       i32.const 3
       i32.add
       local.set $1
       local.get $2
       i32.const 1
       i32.add
      end
     end
    end
    local.set $2
    br $continue|0
   end
  end
  local.get $1
 )
 (func $~lib/allocator/arena/__memory_allocate (; 6 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.const 1073741824
  i32.gt_u
  if
   unreachable
  end
  local.get $0
  i32.const 1
  local.tee $1
  local.get $0
  local.get $1
  i32.gt_u
  select
  global.get $~lib/allocator/arena/offset
  local.tee $0
  i32.add
  i32.const 7
  i32.add
  i32.const -8
  i32.and
  local.tee $1
  current_memory
  local.tee $2
  i32.const 16
  i32.shl
  i32.gt_u
  if
   local.get $2
   local.get $1
   local.get $0
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.tee $4
   local.get $2
   local.get $4
   i32.gt_s
   select
   grow_memory
   i32.const 0
   i32.lt_s
   if
    local.get $3
    grow_memory
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $1
  global.set $~lib/allocator/arena/offset
  local.get $0
 )
 (func $~lib/string/String#toUTF8 (; 7 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  call $~lib/string/String#get:lengthUTF8
  call $~lib/allocator/arena/__memory_allocate
  local.set $5
  local.get $0
  i32.load
  local.set $7
  loop $continue|0
   local.get $3
   local.get $7
   i32.lt_u
   if
    local.get $0
    local.get $3
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u offset=4
    local.tee $1
    i32.const 128
    i32.lt_u
    if
     local.get $2
     local.get $5
     i32.add
     local.get $1
     i32.store8
     local.get $2
     i32.const 1
     i32.add
     local.set $2
    else     
     local.get $1
     i32.const 2048
     i32.lt_u
     if
      local.get $2
      local.get $5
      i32.add
      local.tee $4
      local.get $1
      i32.const 6
      i32.shr_u
      i32.const 192
      i32.or
      i32.store8
      local.get $4
      local.get $1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=1
      local.get $2
      i32.const 2
      i32.add
      local.set $2
     else      
      local.get $2
      local.get $5
      i32.add
      local.set $4
      local.get $1
      i32.const 64512
      i32.and
      i32.const 55296
      i32.eq
      local.tee $6
      if (result i32)
       local.get $3
       i32.const 1
       i32.add
       local.get $7
       i32.lt_u
      else       
       local.get $6
      end
      if
       local.get $0
       local.get $3
       i32.const 1
       i32.add
       i32.const 1
       i32.shl
       i32.add
       i32.load16_u offset=4
       local.tee $6
       i32.const 64512
       i32.and
       i32.const 56320
       i32.eq
       if
        local.get $4
        local.get $1
        i32.const 1023
        i32.and
        i32.const 10
        i32.shl
        i32.const 65536
        i32.add
        local.get $6
        i32.const 1023
        i32.and
        i32.add
        local.tee $1
        i32.const 18
        i32.shr_u
        i32.const 240
        i32.or
        i32.store8
        local.get $4
        local.get $1
        i32.const 12
        i32.shr_u
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=1
        local.get $4
        local.get $1
        i32.const 6
        i32.shr_u
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=2
        local.get $4
        local.get $1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=3
        local.get $2
        i32.const 4
        i32.add
        local.set $2
        local.get $3
        i32.const 2
        i32.add
        local.set $3
        br $continue|0
       end
      end
      local.get $4
      local.get $1
      i32.const 12
      i32.shr_u
      i32.const 224
      i32.or
      i32.store8
      local.get $4
      local.get $1
      i32.const 6
      i32.shr_u
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=1
      local.get $4
      local.get $1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=2
      local.get $2
      i32.const 3
      i32.add
      local.set $2
     end
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $continue|0
   end
  end
  local.get $2
  local.get $5
  i32.add
  i32.const 0
  i32.store8
  local.get $5
 )
 (func $assembly/wasa/IO.writeStringLn (; 8 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  call $~lib/string/String#get:lengthUTF8
  i32.const 1
  i32.sub
  local.set $2
  local.get $1
  call $~lib/string/String#toUTF8
  local.set $3
  i32.const 16
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $3
  i32.store
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.store
  i32.const 1
  call $~lib/allocator/arena/__memory_allocate
  local.tee $2
  i32.const 10
  i32.store8
  local.get $1
  i32.const 8
  i32.add
  local.get $2
  i32.store
  local.get $1
  i32.const 12
  i32.add
  i32.const 1
  i32.store
  local.get $0
  local.get $1
  i32.const 2
  i32.const 4
  call $~lib/allocator/arena/__memory_allocate
  call $~lib/bindings/wasi_unstable/fd_write
  drop
 )
 (func $assembly/wasa/IO.writeString (; 9 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $2
  if
   local.get $0
   local.get $1
   call $assembly/wasa/IO.writeStringLn
   return
  end
  local.get $1
  call $~lib/string/String#get:lengthUTF8
  i32.const 1
  i32.sub
  local.set $2
  local.get $1
  call $~lib/string/String#toUTF8
  local.set $3
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $3
  i32.store
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.store
  local.get $0
  local.get $1
  i32.const 1
  i32.const 4
  call $~lib/allocator/arena/__memory_allocate
  call $~lib/bindings/wasi_unstable/fd_write
  drop
 )
 (func $assembly/env/wasiabort (; 10 ;) (type $FUNCSIG$vi) (param $0 i32)
  i32.const 2
  local.get $0
  i32.const 1
  call $assembly/wasa/IO.writeString
 )
 (func $~lib/internal/string/allocateUnsafe (; 11 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 0
  i32.gt_s
  local.tee $1
  if (result i32)
   local.get $0
   i32.const 536870910
   i32.le_s
  else   
   local.get $1
  end
  i32.eqz
  if
   block
    i32.const 0
    call $assembly/env/wasiabort
   end
   unreachable
  end
  local.get $0
  i32.const 1
  i32.shl
  i32.const 4
  i32.add
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $0
  i32.store
  local.get $1
 )
 (func $~lib/internal/memory/memcpy (; 12 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $continue|0
   local.get $1
   i32.const 3
   i32.and
   local.get $2
   local.get $2
   select
   if
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $3
    block (result i32)
     local.get $1
     local.tee $3
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     i32.load8_u
    end
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $continue|0
   end
  end
  local.get $0
  i32.const 3
  i32.and
  i32.eqz
  if
   loop $continue|1
    local.get $2
    i32.const 16
    i32.ge_u
    if
     local.get $0
     local.get $1
     i32.load
     i32.store
     local.get $0
     i32.const 4
     i32.add
     local.get $1
     i32.const 4
     i32.add
     i32.load
     i32.store
     local.get $0
     i32.const 8
     i32.add
     local.get $1
     i32.const 8
     i32.add
     i32.load
     i32.store
     local.get $0
     i32.const 12
     i32.add
     local.get $1
     i32.const 12
     i32.add
     i32.load
     i32.store
     local.get $1
     i32.const 16
     i32.add
     local.set $1
     local.get $0
     i32.const 16
     i32.add
     local.set $0
     local.get $2
     i32.const 16
     i32.sub
     local.set $2
     br $continue|1
    end
   end
   local.get $2
   i32.const 8
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $0
    i32.const 4
    i32.add
    local.get $1
    i32.const 4
    i32.add
    i32.load
    i32.store
    local.get $1
    i32.const 8
    i32.add
    local.set $1
    local.get $0
    i32.const 8
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 4
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $1
    i32.const 4
    i32.add
    local.set $1
    local.get $0
    i32.const 4
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 2
   i32.and
   if
    local.get $0
    local.get $1
    i32.load16_u
    i32.store16
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    local.get $0
    i32.const 2
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 1
   i32.and
   if
    local.get $0
    local.get $1
    i32.load8_u
    i32.store8
   end
   return
  end
  local.get $2
  i32.const 32
  i32.ge_u
  if
   block $break|2
    block $case2|2
     block $case1|2
      block $case0|2
       local.get $0
       i32.const 3
       i32.and
       i32.const 1
       i32.sub
       br_table $case0|2 $case1|2 $case2|2 $break|2
      end
      local.get $1
      i32.load
      local.set $4
      local.get $0
      local.get $1
      i32.load8_u
      i32.store8
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      i32.const 1
      i32.add
      local.set $3
      local.get $0
      block (result i32)
       local.get $1
       i32.const 1
       i32.add
       local.tee $0
       i32.const 1
       i32.add
       local.set $5
       local.get $0
       i32.load8_u
      end
      i32.store8
      local.get $3
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      local.get $5
      i32.load8_u
      i32.store8
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $continue|3
       local.get $2
       i32.const 17
       i32.ge_u
       if
        local.get $0
        local.get $1
        i32.const 1
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        local.get $4
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 4
        i32.add
        local.get $1
        i32.const 5
        i32.add
        i32.load
        local.tee $4
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 8
        i32.add
        local.get $1
        i32.const 9
        i32.add
        i32.load
        local.tee $3
        i32.const 8
        i32.shl
        local.get $4
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        i32.const 12
        i32.add
        local.get $1
        i32.const 13
        i32.add
        i32.load
        local.tee $4
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $1
        i32.const 16
        i32.add
        local.set $1
        local.get $0
        i32.const 16
        i32.add
        local.set $0
        local.get $2
        i32.const 16
        i32.sub
        local.set $2
        br $continue|3
       end
      end
      br $break|2
     end
     local.get $1
     i32.load
     local.set $4
     local.get $0
     local.get $1
     i32.load8_u
     i32.store8
     local.get $0
     i32.const 1
     i32.add
     local.tee $3
     i32.const 1
     i32.add
     local.set $0
     local.get $3
     block (result i32)
      local.get $1
      i32.const 1
      i32.add
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      i32.load8_u
     end
     i32.store8
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $continue|4
      local.get $2
      i32.const 18
      i32.ge_u
      if
       local.get $0
       local.get $1
       i32.const 2
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       local.get $4
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 4
       i32.add
       local.get $1
       i32.const 6
       i32.add
       i32.load
       local.tee $4
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 8
       i32.add
       local.get $1
       i32.const 10
       i32.add
       i32.load
       local.tee $3
       i32.const 16
       i32.shl
       local.get $4
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       i32.const 12
       i32.add
       local.get $1
       i32.const 14
       i32.add
       i32.load
       local.tee $4
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $1
       i32.const 16
       i32.add
       local.set $1
       local.get $0
       i32.const 16
       i32.add
       local.set $0
       local.get $2
       i32.const 16
       i32.sub
       local.set $2
       br $continue|4
      end
     end
     br $break|2
    end
    local.get $1
    i32.load
    local.set $4
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $3
    block (result i32)
     local.get $1
     local.tee $3
     i32.const 1
     i32.add
     local.set $1
     local.get $3
     i32.load8_u
    end
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $continue|5
     local.get $2
     i32.const 19
     i32.ge_u
     if
      local.get $0
      local.get $1
      i32.const 3
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      local.get $4
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 4
      i32.add
      local.get $1
      i32.const 7
      i32.add
      i32.load
      local.tee $4
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 8
      i32.add
      local.get $1
      i32.const 11
      i32.add
      i32.load
      local.tee $3
      i32.const 24
      i32.shl
      local.get $4
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      i32.const 12
      i32.add
      local.get $1
      i32.const 15
      i32.add
      i32.load
      local.tee $4
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $1
      i32.const 16
      i32.add
      local.set $1
      local.get $0
      i32.const 16
      i32.add
      local.set $0
      local.get $2
      i32.const 16
      i32.sub
      local.set $2
      br $continue|5
     end
    end
   end
  end
  local.get $2
  i32.const 16
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
  end
  local.get $2
  i32.const 8
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
  end
  local.get $2
  i32.const 4
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
  end
  local.get $2
  i32.const 2
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $3
   i32.const 1
   i32.add
   local.set $0
   local.get $3
   block (result i32)
    local.get $1
    i32.const 1
    i32.add
    local.tee $3
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    i32.load8_u
   end
   i32.store8
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
  end
 )
 (func $~lib/internal/memory/memmove (; 13 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   return
  end
  local.get $1
  local.get $2
  i32.add
  local.get $0
  i32.le_u
  local.tee $3
  if (result i32)
   local.get $3
  else   
   local.get $0
   local.get $2
   i32.add
   local.get $1
   i32.le_u
  end
  if
   local.get $0
   local.get $1
   local.get $2
   call $~lib/internal/memory/memcpy
   return
  end
  local.get $0
  local.get $1
  i32.lt_u
  if
   local.get $1
   i32.const 7
   i32.and
   local.get $0
   i32.const 7
   i32.and
   i32.eq
   if
    loop $continue|0
     local.get $0
     i32.const 7
     i32.and
     if
      local.get $2
      i32.eqz
      if
       return
      end
      local.get $2
      i32.const 1
      i32.sub
      local.set $2
      local.get $0
      local.tee $3
      i32.const 1
      i32.add
      local.set $0
      local.get $3
      block (result i32)
       local.get $1
       local.tee $3
       i32.const 1
       i32.add
       local.set $1
       local.get $3
       i32.load8_u
      end
      i32.store8
      br $continue|0
     end
    end
    loop $continue|1
     local.get $2
     i32.const 8
     i32.ge_u
     if
      local.get $0
      local.get $1
      i64.load
      i64.store
      local.get $2
      i32.const 8
      i32.sub
      local.set $2
      local.get $0
      i32.const 8
      i32.add
      local.set $0
      local.get $1
      i32.const 8
      i32.add
      local.set $1
      br $continue|1
     end
    end
   end
   loop $continue|2
    local.get $2
    if
     local.get $0
     local.tee $3
     i32.const 1
     i32.add
     local.set $0
     local.get $3
     block (result i32)
      local.get $1
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $3
      i32.load8_u
     end
     i32.store8
     local.get $2
     i32.const 1
     i32.sub
     local.set $2
     br $continue|2
    end
   end
  else   
   local.get $1
   i32.const 7
   i32.and
   local.get $0
   i32.const 7
   i32.and
   i32.eq
   if
    loop $continue|3
     local.get $0
     local.get $2
     i32.add
     i32.const 7
     i32.and
     if
      local.get $2
      i32.eqz
      if
       return
      end
      local.get $0
      local.get $2
      i32.const 1
      i32.sub
      local.tee $2
      i32.add
      local.get $1
      local.get $2
      i32.add
      i32.load8_u
      i32.store8
      br $continue|3
     end
    end
    loop $continue|4
     local.get $2
     i32.const 8
     i32.ge_u
     if
      local.get $2
      i32.const 8
      i32.sub
      local.tee $2
      local.get $0
      i32.add
      local.get $1
      local.get $2
      i32.add
      i64.load
      i64.store
      br $continue|4
     end
    end
   end
   loop $continue|5
    local.get $2
    if
     local.get $0
     local.get $2
     i32.const 1
     i32.sub
     local.tee $2
     i32.add
     local.get $1
     local.get $2
     i32.add
     i32.load8_u
     i32.store8
     br $continue|5
    end
   end
  end
 )
 (func $~lib/internal/string/copyUnsafe (; 14 ;) (type $FUNCSIG$viiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $0
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.const 4
  i32.add
  local.get $2
  i32.const 4
  i32.add
  local.get $3
  i32.const 1
  i32.shl
  call $~lib/internal/memory/memmove
 )
 (func $~lib/string/String#concat (; 15 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.eqz
  if
   block
    i32.const 0
    call $assembly/env/wasiabort
   end
   unreachable
  end
  local.get $0
  i32.load
  local.tee $3
  local.get $1
  i32.const 32
  local.get $1
  select
  local.tee $1
  i32.load
  local.tee $4
  i32.add
  local.tee $2
  i32.eqz
  if
   i32.const 80
   return
  end
  local.get $2
  call $~lib/internal/string/allocateUnsafe
  local.tee $2
  i32.const 0
  local.get $0
  local.get $3
  call $~lib/internal/string/copyUnsafe
  local.get $2
  local.get $3
  local.get $1
  local.get $4
  call $~lib/internal/string/copyUnsafe
  local.get $2
 )
 (func $~lib/string/String.__concat (; 16 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.const 32
  local.get $0
  select
  local.get $1
  call $~lib/string/String#concat
 )
 (func $start:assembly/ansi (; 17 ;) (type $FUNCSIG$v)
  i32.const 8
  i32.const 16
  call $~lib/string/String.__concat
  global.set $assembly/ansi/GREEN
  i32.const 8
  i32.const 144
  call $~lib/string/String.__concat
  global.set $assembly/ansi/WHITE
  i32.const 8
  i32.const 160
  call $~lib/string/String.__concat
  global.set $assembly/ansi/RED
  i32.const 8
  i32.const 176
  call $~lib/string/String.__concat
  global.set $assembly/ansi/CYAN
  i32.const 8
  i32.const 192
  call $~lib/string/String.__concat
  global.set $assembly/ansi/RESET
  i32.const 8
  i32.const 200
  call $~lib/string/String.__concat
  global.set $assembly/ansi/HIDE_CURSOR
 )
 (func $~lib/string/String.fromUTF8 (; 18 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $1
  i32.const 1
  i32.lt_u
  if
   i32.const 80
   return
  end
  local.get $1
  i32.const 1
  i32.shl
  call $~lib/allocator/arena/__memory_allocate
  local.set $6
  block $folding-inner0
   loop $continue|0
    local.get $2
    local.get $1
    i32.lt_u
    if
     block (result i32)
      local.get $2
      local.tee $3
      i32.const 1
      i32.add
      local.set $2
      local.get $0
      local.get $3
      i32.add
      i32.load8_u
      local.tee $5
      i32.const 128
      i32.lt_u
     end
     if
      local.get $4
      local.get $6
      i32.add
      local.get $5
      i32.store16
     else      
      local.get $5
      i32.const 191
      i32.gt_u
      local.tee $3
      if (result i32)
       local.get $5
       i32.const 224
       i32.lt_u
      else       
       local.get $3
      end
      if
       local.get $2
       i32.const 1
       i32.add
       local.get $1
       i32.gt_u
       if
        br $folding-inner0
       end
       local.get $2
       local.tee $3
       i32.const 1
       i32.add
       local.set $2
       local.get $4
       local.get $6
       i32.add
       local.get $0
       local.get $3
       i32.add
       i32.load8_u
       i32.const 63
       i32.and
       local.get $5
       i32.const 31
       i32.and
       i32.const 6
       i32.shl
       i32.or
       i32.store16
      else       
       local.get $5
       i32.const 239
       i32.gt_u
       local.tee $3
       if (result i32)
        local.get $5
        i32.const 365
        i32.lt_u
       else        
        local.get $3
       end
       if
        local.get $2
        i32.const 3
        i32.add
        local.get $1
        i32.gt_u
        if
         br $folding-inner0
        end
        local.get $2
        i32.const 1
        i32.add
        local.tee $7
        i32.const 1
        i32.add
        local.set $3
        local.get $4
        local.get $6
        i32.add
        local.get $5
        i32.const 7
        i32.and
        i32.const 18
        i32.shl
        local.get $0
        local.get $2
        i32.add
        i32.load8_u
        i32.const 63
        i32.and
        i32.const 12
        i32.shl
        i32.or
        local.get $0
        local.get $7
        i32.add
        i32.load8_u
        i32.const 63
        i32.and
        i32.const 6
        i32.shl
        i32.or
        block (result i32)
         local.get $3
         i32.const 1
         i32.add
         local.set $2
         local.get $0
         local.get $3
         i32.add
         i32.load8_u
         i32.const 63
         i32.and
        end
        i32.or
        i32.const 65536
        i32.sub
        local.tee $3
        i32.const 10
        i32.shr_u
        i32.const 55296
        i32.add
        i32.store16
        local.get $4
        i32.const 2
        i32.add
        local.tee $4
        local.get $6
        i32.add
        local.get $3
        i32.const 1023
        i32.and
        i32.const 56320
        i32.add
        i32.store16
       else        
        local.get $2
        i32.const 2
        i32.add
        local.get $1
        i32.gt_u
        if
         br $folding-inner0
        end
        local.get $4
        local.get $6
        i32.add
        local.get $5
        i32.const 15
        i32.and
        i32.const 12
        i32.shl
        local.get $0
        local.get $2
        i32.add
        i32.load8_u
        i32.const 63
        i32.and
        i32.const 6
        i32.shl
        i32.or
        block (result i32)
         local.get $2
         i32.const 1
         i32.add
         local.tee $3
         i32.const 1
         i32.add
         local.set $2
         local.get $0
         local.get $3
         i32.add
         i32.load8_u
         i32.const 63
         i32.and
        end
        i32.or
        i32.store16
       end
      end
     end
     local.get $4
     i32.const 2
     i32.add
     local.set $4
     br $continue|0
    end
   end
   local.get $1
   local.get $2
   i32.ne
   if
    br $folding-inner0
   end
   local.get $4
   i32.const 1
   i32.shr_u
   call $~lib/internal/string/allocateUnsafe
   local.tee $0
   i32.const 4
   i32.add
   local.get $6
   local.get $4
   call $~lib/internal/memory/memmove
   local.get $0
   return
  end
  i32.const 0
  call $assembly/env/wasiabort
  unreachable
 )
 (func $assembly/wasa/StringUtils.fromCString (; 19 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  loop $continue|0
   local.get $0
   local.get $1
   i32.add
   i32.load8_u
   if
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $continue|0
   end
  end
  local.get $0
  local.get $1
  call $~lib/string/String.fromUTF8
 )
 (func $~lib/internal/arraybuffer/computeSize (; 20 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  i32.const 1
  i32.const 32
  local.get $0
  i32.const 7
  i32.add
  i32.clz
  i32.sub
  i32.shl
 )
 (func $~lib/internal/arraybuffer/allocateUnsafe (; 21 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741816
  i32.gt_u
  if
   block
    i32.const 0
    call $assembly/env/wasiabort
   end
   unreachable
  end
  local.get $0
  call $~lib/internal/arraybuffer/computeSize
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  local.get $0
  i32.store
  local.get $1
 )
 (func $~lib/internal/memory/memset (; 22 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $1
  i32.eqz
  if
   return
  end
  local.get $0
  i32.const 0
  i32.store8
  local.get $0
  local.get $1
  i32.add
  i32.const 1
  i32.sub
  i32.const 0
  i32.store8
  local.get $1
  i32.const 2
  i32.le_u
  if
   return
  end
  local.get $0
  i32.const 1
  i32.add
  i32.const 0
  i32.store8
  local.get $0
  i32.const 2
  i32.add
  i32.const 0
  i32.store8
  local.get $0
  local.get $1
  i32.add
  i32.const 2
  i32.sub
  i32.const 0
  i32.store8
  local.get $0
  local.get $1
  i32.add
  i32.const 3
  i32.sub
  i32.const 0
  i32.store8
  local.get $1
  i32.const 6
  i32.le_u
  if
   return
  end
  local.get $0
  i32.const 3
  i32.add
  i32.const 0
  i32.store8
  local.get $0
  local.get $1
  i32.add
  i32.const 4
  i32.sub
  i32.const 0
  i32.store8
  local.get $1
  i32.const 8
  i32.le_u
  if
   return
  end
  i32.const 0
  local.get $0
  i32.sub
  i32.const 3
  i32.and
  local.tee $2
  local.get $0
  i32.add
  local.tee $0
  i32.const 0
  i32.store
  local.get $1
  local.get $2
  i32.sub
  i32.const -4
  i32.and
  local.tee $1
  local.get $0
  i32.add
  i32.const 4
  i32.sub
  i32.const 0
  i32.store
  local.get $1
  i32.const 8
  i32.le_u
  if
   return
  end
  local.get $0
  i32.const 4
  i32.add
  i32.const 0
  i32.store
  local.get $0
  i32.const 8
  i32.add
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 12
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 8
  i32.sub
  i32.const 0
  i32.store
  local.get $1
  i32.const 24
  i32.le_u
  if
   return
  end
  local.get $0
  i32.const 12
  i32.add
  i32.const 0
  i32.store
  local.get $0
  i32.const 16
  i32.add
  i32.const 0
  i32.store
  local.get $0
  i32.const 20
  i32.add
  i32.const 0
  i32.store
  local.get $0
  i32.const 24
  i32.add
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 28
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 24
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 20
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  local.get $1
  i32.add
  i32.const 16
  i32.sub
  i32.const 0
  i32.store
  local.get $0
  i32.const 4
  i32.and
  i32.const 24
  i32.add
  local.tee $2
  local.get $0
  i32.add
  local.set $0
  local.get $1
  local.get $2
  i32.sub
  local.set $1
  loop $continue|0
   local.get $1
   i32.const 32
   i32.ge_u
   if
    local.get $0
    i64.const 0
    i64.store
    local.get $0
    i32.const 8
    i32.add
    i64.const 0
    i64.store
    local.get $0
    i32.const 16
    i32.add
    i64.const 0
    i64.store
    local.get $0
    i32.const 24
    i32.add
    i64.const 0
    i64.store
    local.get $1
    i32.const 32
    i32.sub
    local.set $1
    local.get $0
    i32.const 32
    i32.add
    local.set $0
    br $continue|0
   end
  end
 )
 (func $~lib/internal/arraybuffer/reallocateUnsafe (; 23 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $2
  i32.gt_s
  if
   local.get $1
   i32.const 1073741816
   i32.gt_s
   if
    i32.const 0
    call $assembly/env/wasiabort
    unreachable
   end
   local.get $1
   local.get $2
   call $~lib/internal/arraybuffer/computeSize
   i32.const 8
   i32.sub
   i32.le_s
   if
    local.get $0
    local.get $1
    i32.store
   else    
    local.get $1
    call $~lib/internal/arraybuffer/allocateUnsafe
    local.tee $3
    i32.const 8
    i32.add
    local.get $0
    i32.const 8
    i32.add
    local.get $2
    call $~lib/internal/memory/memmove
    local.get $3
    local.set $0
   end
   local.get $0
   i32.const 8
   i32.add
   local.get $2
   i32.add
   local.get $1
   local.get $2
   i32.sub
   call $~lib/internal/memory/memset
  else   
   local.get $1
   local.get $2
   i32.lt_s
   if
    local.get $1
    i32.const 0
    i32.lt_s
    if
     i32.const 0
     call $assembly/env/wasiabort
     unreachable
    end
    local.get $0
    local.get $1
    i32.store
   end
  end
  local.get $0
 )
 (func $~lib/array/Array<~lib/string/String>#push (; 24 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  i32.load offset=4
  local.tee $2
  i32.const 1
  i32.add
  local.set $4
  local.get $2
  local.get $0
  i32.load
  local.tee $3
  i32.load
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   local.get $2
   i32.const 268435454
   i32.ge_u
   if
    block
     i32.const 0
     call $assembly/env/wasiabort
    end
    unreachable
   end
   local.get $0
   local.get $3
   local.get $4
   i32.const 2
   i32.shl
   call $~lib/internal/arraybuffer/reallocateUnsafe
   local.tee $3
   i32.store
  end
  local.get $0
  local.get $4
  i32.store offset=4
  local.get $2
  i32.const 2
  i32.shl
  local.get $3
  i32.add
  local.get $1
  i32.store offset=8
 )
 (func $assembly/wasa/CommandLine#constructor (; 25 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 4
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  i32.const 0
  i32.store
  local.get $1
  i32.const 224
  i32.store
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $0
  local.get $0
  i32.const 4
  i32.add
  call $~lib/bindings/wasi_unstable/args_sizes_get
  i32.const 65535
  i32.and
  if
   i32.const 80
   call $assembly/env/wasiabort
  end
  local.get $0
  i32.const 4
  i32.add
  i32.load
  local.set $2
  local.get $0
  i32.load
  local.tee $3
  i32.const 1
  i32.add
  i32.const 2
  i32.shl
  call $~lib/allocator/arena/__memory_allocate
  local.tee $4
  local.get $2
  call $~lib/allocator/arena/__memory_allocate
  call $~lib/bindings/wasi_unstable/args_get
  i32.const 65535
  i32.and
  if
   i32.const 80
   call $assembly/env/wasiabort
  end
  i32.const 0
  local.set $0
  loop $repeat|0
   local.get $0
   local.get $3
   i32.lt_u
   if
    local.get $4
    local.get $0
    i32.const 2
    i32.shl
    i32.add
    i32.load
    call $assembly/wasa/StringUtils.fromCString
    local.set $2
    local.get $1
    i32.load
    local.get $2
    call $~lib/array/Array<~lib/string/String>#push
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
   end
  end
  local.get $1
 )
 (func $assembly/wasa/Console.write (; 26 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  i32.const 1
  local.get $0
  local.get $1
  call $assembly/wasa/IO.writeString
 )
 (func $assembly/wasa/Console.log (; 27 ;) (type $FUNCSIG$vi) (param $0 i32)
  local.get $0
  i32.const 1
  call $assembly/wasa/Console.write
 )
 (func $assembly/ansi/printColor (; 28 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  local.get $1
  local.get $0
  call $~lib/string/String.__concat
  global.get $assembly/ansi/RESET
  call $~lib/string/String.__concat
  i32.const 0
  call $assembly/wasa/Console.write
 )
 (func $assembly/cli/showHelp (; 29 ;) (type $FUNCSIG$v)
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 328
  global.get $assembly/ansi/GREEN
  call $assembly/ansi/printColor
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 360
  global.get $assembly/ansi/CYAN
  call $assembly/ansi/printColor
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 376
  call $assembly/wasa/Console.log
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 472
  global.get $assembly/ansi/CYAN
  call $assembly/ansi/printColor
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 488
  global.get $assembly/ansi/RED
  call $~lib/string/String.__concat
  i32.const 520
  call $~lib/string/String.__concat
  global.get $assembly/ansi/RESET
  call $~lib/string/String.__concat
  call $assembly/wasa/Console.log
  i32.const 544
  call $assembly/wasa/Console.log
  i32.const 640
  call $assembly/wasa/Console.log
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 736
  global.get $assembly/ansi/RED
  call $~lib/string/String.__concat
  i32.const 520
  call $~lib/string/String.__concat
  global.get $assembly/ansi/RESET
  call $~lib/string/String.__concat
  call $assembly/wasa/Console.log
  i32.const 768
  call $assembly/wasa/Console.log
  i32.const 848
  call $assembly/wasa/Console.log
  i32.const 80
  call $assembly/wasa/Console.log
  i32.const 952
  call $assembly/wasa/Console.log
  i32.const 984
  call $assembly/wasa/Console.log
  i32.const 1032
  call $assembly/wasa/Console.log
  i32.const 80
  call $assembly/wasa/Console.log
 )
 (func $~lib/array/Array<~lib/string/String>#__get (; 30 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $0
  i32.load
  i32.const 2
  i32.shr_u
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 2
   i32.shl
   local.get $0
   i32.add
   i32.load offset=8
  else   
   unreachable
  end
 )
 (func $~lib/internal/string/compareUnsafe (; 31 ;) (type $FUNCSIG$iiii) (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  loop $continue|0
   local.get $2
   if (result i32)
    local.get $0
    i32.load16_u offset=4
    local.get $1
    i32.load16_u offset=4
    i32.sub
    local.tee $3
    i32.eqz
   else    
    local.get $2
   end
   if
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    local.get $0
    i32.const 2
    i32.add
    local.set $0
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    br $continue|0
   end
  end
  local.get $3
 )
 (func $~lib/string/String.__eq (; 32 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  local.get $0
  local.get $1
  i32.eq
  if
   i32.const 1
   return
  end
  local.get $0
  i32.eqz
  local.tee $2
  if (result i32)
   local.get $2
  else   
   local.get $1
   i32.eqz
  end
  if
   i32.const 0
   return
  end
  local.get $0
  i32.load
  local.tee $2
  local.get $1
  i32.load
  i32.ne
  if
   i32.const 0
   return
  end
  local.get $0
  local.get $1
  local.get $2
  call $~lib/internal/string/compareUnsafe
  i32.eqz
 )
 (func $~lib/internal/string/parse<f64> (; 33 ;) (type $FUNCSIG$di) (param $0 i32) (result f64)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 f64)
  (local $6 f64)
  local.get $0
  i32.load
  local.tee $2
  i32.eqz
  if
   f64.const nan:0x8000000000000
   return
  end
  local.get $0
  i32.load16_u offset=4
  local.tee $1
  i32.const 45
  i32.eq
  if (result f64)
   local.get $2
   i32.const 1
   i32.sub
   local.tee $2
   i32.eqz
   if
    f64.const nan:0x8000000000000
    return
   end
   local.get $0
   i32.const 2
   i32.add
   local.tee $0
   i32.load16_u offset=4
   local.set $1
   f64.const -1
  else   
   local.get $1
   i32.const 43
   i32.eq
   if
    local.get $2
    i32.const 1
    i32.sub
    local.tee $2
    i32.eqz
    if
     f64.const nan:0x8000000000000
     return
    end
    local.get $0
    i32.const 2
    i32.add
    local.tee $0
    i32.load16_u offset=4
    local.set $1
   end
   f64.const 1
  end
  local.set $6
  local.get $1
  i32.const 48
  i32.eq
  local.tee $1
  if (result i32)
   local.get $2
   i32.const 2
   i32.gt_s
  else   
   local.get $1
  end
  if (result i32)
   block $break|0 (result i32)
    block $case6|0
     block $case5|0
      block $case3|0
       local.get $0
       i32.const 2
       i32.add
       i32.load16_u offset=4
       local.tee $1
       i32.const 66
       i32.eq
       local.get $1
       i32.const 98
       i32.eq
       i32.or
       i32.eqz
       if
        local.get $1
        i32.const 79
        i32.eq
        local.get $1
        i32.const 111
        i32.eq
        i32.or
        br_if $case3|0
        local.get $1
        i32.const 88
        i32.eq
        local.get $1
        i32.const 120
        i32.eq
        i32.or
        br_if $case5|0
        br $case6|0
       end
       local.get $0
       i32.const 4
       i32.add
       local.set $0
       local.get $2
       i32.const 2
       i32.sub
       local.set $2
       i32.const 2
       br $break|0
      end
      local.get $0
      i32.const 4
      i32.add
      local.set $0
      local.get $2
      i32.const 2
      i32.sub
      local.set $2
      i32.const 8
      br $break|0
     end
     local.get $0
     i32.const 4
     i32.add
     local.set $0
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     i32.const 16
     br $break|0
    end
    i32.const 10
   end
  else   
   i32.const 10
  end
  local.set $4
  loop $continue|1
   block (result i32)
    local.get $2
    local.tee $1
    i32.const 1
    i32.sub
    local.set $2
    local.get $1
   end
   if
    block $break|1
     local.get $0
     i32.load16_u offset=4
     local.tee $3
     i32.const 48
     i32.ge_s
     local.tee $1
     if (result i32)
      local.get $3
      i32.const 57
      i32.le_s
     else      
      local.get $1
     end
     if (result i32)
      local.get $3
      i32.const 48
      i32.sub
     else      
      local.get $3
      i32.const 65
      i32.ge_s
      local.tee $1
      if (result i32)
       local.get $3
       i32.const 90
       i32.le_s
      else       
       local.get $1
      end
      if (result i32)
       local.get $3
       i32.const 55
       i32.sub
      else       
       local.get $3
       i32.const 97
       i32.ge_s
       local.tee $1
       if (result i32)
        local.get $3
        i32.const 122
        i32.le_s
       else        
        local.get $1
       end
       if (result i32)
        local.get $3
        i32.const 87
        i32.sub
       else        
        br $break|1
       end
      end
     end
     local.tee $1
     local.get $4
     i32.ge_s
     br_if $break|1
     local.get $5
     local.get $4
     f64.convert_i32_s
     f64.mul
     local.get $1
     f64.convert_i32_s
     f64.add
     local.set $5
     local.get $0
     i32.const 2
     i32.add
     local.set $0
     br $continue|1
    end
   end
  end
  local.get $6
  local.get $5
  f64.mul
 )
 (func $~lib/array/Array<assembly/droplet/Droplet>#constructor (; 34 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 268435454
  i32.gt_u
  if
   i32.const 0
   call $assembly/env/wasiabort
   unreachable
  end
  local.get $0
  i32.const 2
  i32.shl
  local.tee $3
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.set $2
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  i32.const 0
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  local.get $2
  i32.store
  local.get $1
  local.get $0
  i32.store offset=4
  local.get $2
  i32.const 8
  i32.add
  local.get $3
  call $~lib/internal/memory/memset
  local.get $1
 )
 (func $assembly/droplet/Droplet#constructor (; 35 ;) (type $FUNCSIG$i) (result i32)
  (local $0 i32)
  i32.const 20
  call $~lib/allocator/arena/__memory_allocate
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 0
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
 )
 (func $assembly/utils/getRandomNumber (; 36 ;) (type $FUNCSIG$i) (result i32)
  global.get $assembly/utils/randomBytePointer
  i32.const 1
  call $~lib/bindings/wasi_unstable/random_get
  i32.const 65535
  i32.and
  if
   i32.const 80
   call $assembly/env/wasiabort
  end
  global.get $assembly/utils/randomBytePointer
  i32.load8_u
 )
 (func $~lib/array/Array<u8>#constructor (; 37 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.const 1073741816
  i32.gt_u
  if
   i32.const 0
   call $assembly/env/wasiabort
   unreachable
  end
  local.get $0
  call $~lib/internal/arraybuffer/allocateUnsafe
  local.set $2
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  local.tee $1
  i32.const 0
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  local.get $2
  i32.store
  local.get $1
  local.get $0
  i32.store offset=4
  local.get $2
  i32.const 8
  i32.add
  local.get $0
  call $~lib/internal/memory/memset
  local.get $1
 )
 (func $assembly/characters/getRandomCharacterCode (; 38 ;) (type $FUNCSIG$i) (result i32)
  call $assembly/utils/getRandomNumber
  i32.const 93
  i32.rem_s
  i32.const 33
  i32.add
 )
 (func $~lib/array/Array<u8>#__set (; 39 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $3
  i32.load
  i32.ge_u
  if
   local.get $1
   i32.const 1073741816
   i32.ge_u
   if
    block
     i32.const 0
     call $assembly/env/wasiabort
    end
    unreachable
   end
   local.get $0
   local.get $3
   local.get $1
   i32.const 1
   i32.add
   call $~lib/internal/arraybuffer/reallocateUnsafe
   local.tee $3
   i32.store
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.store offset=4
  end
  local.get $1
  local.get $3
  i32.add
  local.get $2
  i32.store8 offset=8
 )
 (func $assembly/droplet/createDroplet (; 40 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  call $assembly/droplet/Droplet#constructor
  local.tee $2
  local.get $0
  i32.store
  local.get $2
  call $assembly/utils/getRandomNumber
  local.get $1
  i32.rem_s
  i32.store offset=4
  local.get $2
  call $assembly/utils/getRandomNumber
  local.get $1
  i32.const 2
  i32.div_s
  i32.rem_s
  i32.const 3
  i32.add
  i32.store offset=16
  local.get $2
  call $assembly/utils/getRandomNumber
  i32.const 2
  i32.rem_s
  i32.const 1
  i32.add
  i32.store offset=12
  local.get $2
  local.get $2
  i32.load offset=16
  call $~lib/array/Array<u8>#constructor
  i32.store offset=8
  i32.const 0
  local.set $0
  loop $repeat|0
   block $break|0
    local.get $0
    local.get $2
    i32.load offset=16
    i32.ge_s
    br_if $break|0
    local.get $2
    i32.load offset=8
    local.get $0
    call $assembly/characters/getRandomCharacterCode
    call $~lib/array/Array<u8>#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
   end
  end
  local.get $2
 )
 (func $~lib/array/Array<assembly/droplet/Droplet>#__set (; 41 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $3
  i32.load
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   local.get $1
   i32.const 268435454
   i32.ge_u
   if
    block
     i32.const 0
     call $assembly/env/wasiabort
    end
    unreachable
   end
   local.get $0
   local.get $3
   local.get $1
   i32.const 1
   i32.add
   i32.const 2
   i32.shl
   call $~lib/internal/arraybuffer/reallocateUnsafe
   local.tee $3
   i32.store
   local.get $0
   local.get $1
   i32.const 1
   i32.add
   i32.store offset=4
  end
  local.get $1
  i32.const 2
  i32.shl
  local.get $3
  i32.add
  local.get $2
  i32.store offset=8
 )
 (func $~lib/array/Array<u8>#__get (; 42 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load
  local.tee $0
  i32.load
  i32.lt_u
  if (result i32)
   local.get $0
   local.get $1
   i32.add
   i32.load8_u offset=8
  else   
   unreachable
  end
 )
 (func $assembly/utils/rotateArrayRight (; 43 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $break|0
   loop $repeat|0
    local.get $1
    local.get $0
    i32.load offset=4
    i32.const 1
    i32.sub
    i32.ge_s
    br_if $break|0
    local.get $0
    local.get $1
    i32.const 1
    i32.add
    call $~lib/array/Array<u8>#__get
    local.set $2
    local.get $0
    local.get $1
    i32.const 1
    i32.add
    local.get $0
    local.get $1
    call $~lib/array/Array<u8>#__get
    call $~lib/array/Array<u8>#__set
    local.get $0
    local.get $1
    local.get $2
    call $~lib/array/Array<u8>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|0
    unreachable
   end
   unreachable
  end
 )
 (func $assembly/droplet/updateDroplet (; 44 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  local.get $0
  local.get $0
  i32.load offset=4
  local.get $0
  i32.load offset=12
  i32.add
  i32.store offset=4
  local.get $0
  i32.load offset=4
  local.get $0
  i32.load offset=16
  local.get $1
  i32.add
  i32.ge_s
  if
   local.get $0
   i32.const 0
   local.get $0
   i32.load offset=16
   i32.sub
   i32.store offset=4
  end
  i32.const 0
  local.set $1
  loop $repeat|0
   block $break|0
    local.get $1
    local.get $0
    i32.load offset=12
    i32.ge_s
    br_if $break|0
    local.get $0
    i32.load offset=8
    call $assembly/utils/rotateArrayRight
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|0
   end
  end
  i32.const 0
  local.set $1
  loop $repeat|1
   block $break|1
    local.get $1
    local.get $0
    i32.load offset=12
    i32.ge_s
    br_if $break|1
    local.get $0
    i32.load offset=8
    local.get $1
    call $assembly/characters/getRandomCharacterCode
    call $~lib/array/Array<u8>#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $repeat|1
   end
  end
 )
 (func $~lib/internal/number/decimalCount32 (; 45 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  i32.const 32
  local.get $0
  i32.clz
  i32.sub
  i32.const 1233
  i32.mul
  i32.const 12
  i32.shr_u
  local.tee $1
  local.get $0
  i32.const 1528
  i32.load
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load offset=8
  i32.lt_u
  i32.sub
  i32.const 1
  i32.add
 )
 (func $~lib/internal/number/utoa_simple<u32> (; 46 ;) (type $FUNCSIG$viii) (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  loop $continue|0
   local.get $1
   i32.const 10
   i32.rem_u
   local.set $3
   local.get $1
   i32.const 10
   i32.div_u
   local.set $1
   local.get $0
   local.get $2
   i32.const 1
   i32.sub
   local.tee $2
   i32.const 1
   i32.shl
   i32.add
   local.get $3
   i32.const 48
   i32.add
   i32.store16 offset=4
   local.get $1
   br_if $continue|0
  end
 )
 (func $~lib/internal/number/itoa32 (; 47 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.eqz
  if
   i32.const 1456
   return
  end
  block (result i32)
   local.get $0
   i32.const 0
   i32.lt_s
   local.tee $1
   if
    i32.const 0
    local.get $0
    i32.sub
    local.set $0
   end
   local.get $0
  end
  call $~lib/internal/number/decimalCount32
  local.get $1
  i32.add
  local.tee $3
  call $~lib/internal/string/allocateUnsafe
  local.tee $2
  local.get $0
  local.get $3
  call $~lib/internal/number/utoa_simple<u32>
  local.get $1
  if
   local.get $2
   i32.const 45
   i32.store16 offset=4
  end
  local.get $2
 )
 (func $assembly/ansi/moveCursorToPosition (; 48 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  i32.const 8
  local.get $1
  call $~lib/internal/number/itoa32
  call $~lib/string/String.__concat
  i32.const 1536
  call $~lib/string/String.__concat
  local.get $0
  call $~lib/internal/number/itoa32
  call $~lib/string/String.__concat
  i32.const 1544
  call $~lib/string/String.__concat
  i32.const 0
  call $assembly/wasa/Console.write
  global.get $assembly/ansi/HIDE_CURSOR
  i32.const 0
  call $assembly/wasa/Console.write
 )
 (func $assembly/droplet/drawDroplet (; 49 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $repeat|0
   local.get $3
   local.get $0
   i32.load offset=8
   i32.load offset=4
   i32.lt_s
   if
    local.get $0
    i32.load offset=4
    local.get $3
    i32.add
    local.tee $2
    i32.const 0
    i32.ge_s
    local.tee $4
    if (result i32)
     local.get $2
     local.get $1
     i32.le_s
    else     
     local.get $4
    end
    if
     local.get $0
     i32.load
     local.get $2
     call $assembly/ansi/moveCursorToPosition
     global.get $assembly/ansi/GREEN
     local.set $2
     local.get $3
     local.get $0
     i32.load offset=8
     i32.load offset=4
     i32.const 1
     i32.sub
     i32.eq
     if
      global.get $assembly/ansi/WHITE
      local.set $2
     end
     block (result i32)
      local.get $0
      i32.load offset=8
      local.get $3
      call $~lib/array/Array<u8>#__get
      i32.const 255
      i32.and
      local.set $4
      i32.const 1
      call $~lib/internal/string/allocateUnsafe
      local.tee $5
      local.get $4
      i32.store16 offset=4
      local.get $5
     end
     local.get $2
     call $assembly/ansi/printColor
    end
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $repeat|0
   end
  end
 )
 (func $assembly/utils/getTimeCounter (; 50 ;) (type $FUNCSIG$i) (result i32)
  i32.const 0
  i64.const 1000
  global.get $assembly/utils/timeCounterPointer
  call $clock_time_get_trampoline
  drop
  global.get $assembly/utils/timeCounterPointer
  i64.load
  i64.const 10000000
  i64.div_u
  i32.wrap_i64
 )
 (func $assembly/utils/sleep (; 51 ;) (type $FUNCSIG$vi) (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  call $assembly/utils/getTimeCounter
  local.set $2
  i32.const 1
  local.set $1
  loop $continue|0
   local.get $1
   if
    local.get $2
    call $assembly/utils/getTimeCounter
    i32.sub
    local.tee $3
    i32.const 31
    i32.shr_s
    local.tee $4
    local.get $3
    i32.add
    local.get $4
    i32.xor
    local.get $0
    i32.gt_s
    if
     i32.const 0
     local.set $1
    end
    br $continue|0
   end
  end
 )
 (func $assembly/index/_start (; 52 ;) (type $FUNCSIG$v)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  i32.const 80
  local.set $5
  i32.const 24
  local.set $3
  i32.const 10
  local.set $6
  call $assembly/wasa/CommandLine#constructor
  i32.load
  local.tee $4
  i32.load offset=4
  i32.const 1
  i32.le_s
  if
   call $assembly/cli/showHelp
   return
  end
  loop $repeat|0
   local.get $0
   local.get $4
   i32.load offset=4
   i32.lt_s
   if
    local.get $4
    local.get $0
    call $~lib/array/Array<~lib/string/String>#__get
    local.tee $1
    i32.const 1088
    call $~lib/string/String.__eq
    local.tee $2
    if (result i32)
     local.get $2
    else     
     local.get $1
     i32.const 1096
     call $~lib/string/String.__eq
    end
    if
     local.get $4
     local.get $0
     i32.const 1
     i32.add
     call $~lib/array/Array<~lib/string/String>#__get
     call $~lib/internal/string/parse<f64>
     i32.trunc_f64_s
     local.set $3
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     local.get $3
     i32.const 1
     i32.lt_s
     if
      i32.const 1120
      global.get $assembly/ansi/RED
      call $assembly/ansi/printColor
      return
     end
    else     
     local.get $1
     i32.const 1200
     call $~lib/string/String.__eq
     local.tee $2
     if (result i32)
      local.get $2
     else      
      local.get $1
      i32.const 1208
      call $~lib/string/String.__eq
     end
     if
      local.get $4
      local.get $0
      i32.const 1
      i32.add
      call $~lib/array/Array<~lib/string/String>#__get
      call $~lib/internal/string/parse<f64>
      i32.trunc_f64_s
      local.set $5
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      local.get $5
      i32.const 1
      i32.lt_s
      if
       i32.const 1232
       global.get $assembly/ansi/RED
       call $assembly/ansi/printColor
       return
      end
     else      
      local.get $1
      i32.const 1320
      call $~lib/string/String.__eq
      local.tee $2
      if (result i32)
       local.get $2
      else       
       local.get $1
       i32.const 1328
       call $~lib/string/String.__eq
      end
      if
       local.get $4
       local.get $0
       i32.const 1
       i32.add
       call $~lib/array/Array<~lib/string/String>#__get
       call $~lib/internal/string/parse<f64>
       i32.trunc_f64_s
       local.set $6
       local.get $0
       i32.const 1
       i32.add
       local.set $0
       local.get $6
       i32.const 1
       i32.lt_s
       local.tee $1
       if (result i32)
        local.get $1
       else        
        local.get $6
        i32.const 20
        i32.gt_s
       end
       if
        i32.const 1352
        global.get $assembly/ansi/RED
        call $assembly/ansi/printColor
        return
       end
      else       
       local.get $1
       i32.const 1424
       call $~lib/string/String.__eq
       local.tee $2
       if (result i32)
        local.get $2
       else        
        local.get $1
        i32.const 1432
        call $~lib/string/String.__eq
       end
       if
        call $assembly/cli/showHelp
        return
       end
      end
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
   end
  end
  local.get $5
  call $~lib/array/Array<assembly/droplet/Droplet>#constructor
  local.set $1
  i32.const 0
  local.set $0
  loop $repeat|1
   local.get $0
   local.get $5
   i32.lt_s
   if
    local.get $1
    local.get $0
    local.get $0
    local.get $3
    call $assembly/droplet/createDroplet
    call $~lib/array/Array<assembly/droplet/Droplet>#__set
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|1
   end
  end
  loop $continue|2
   i32.const 0
   local.set $0
   loop $repeat|3
    local.get $0
    local.get $1
    i32.load offset=4
    i32.lt_s
    if
     local.get $1
     local.get $0
     call $~lib/array/Array<~lib/string/String>#__get
     local.get $3
     call $assembly/droplet/updateDroplet
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $repeat|3
    end
   end
   i32.const 8
   i32.const 1448
   call $~lib/string/String.__concat
   i32.const 0
   call $assembly/wasa/Console.write
   i32.const 0
   local.set $0
   loop $repeat|4
    local.get $0
    local.get $1
    i32.load offset=4
    i32.lt_s
    if
     local.get $1
     local.get $0
     call $~lib/array/Array<~lib/string/String>#__get
     local.get $3
     call $assembly/droplet/drawDroplet
     local.get $0
     i32.const 1
     i32.add
     local.set $0
     br $repeat|4
    end
   end
   i32.const 20
   local.get $6
   i32.sub
   call $assembly/utils/sleep
   br $continue|2
   unreachable
  end
  unreachable
 )
 (func $start (; 53 ;) (type $FUNCSIG$v)
  i32.const 1552
  global.set $~lib/allocator/arena/startOffset
  global.get $~lib/allocator/arena/startOffset
  global.set $~lib/allocator/arena/offset
  call $start:assembly/ansi
  i32.const 1
  call $~lib/allocator/arena/__memory_allocate
  global.set $assembly/utils/randomBytePointer
  i32.const 8
  call $~lib/allocator/arena/__memory_allocate
  global.set $assembly/utils/timeCounterPointer
 )
 (func $null (; 54 ;) (type $FUNCSIG$v)
  nop
 )
 (func $assembly/env/wasiabort|trampoline (; 55 ;) (type $FUNCSIG$viiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  block $4of4
   block $3of4
    block $2of4
     block $1of4
      block $0of4
       block $outOfRange
        global.get $~lib/argc
        br_table $0of4 $1of4 $2of4 $3of4 $4of4 $outOfRange
       end
       unreachable
      end
      i32.const 80
      local.set $0
     end
     i32.const 80
     local.set $1
    end
    i32.const 0
    local.set $2
   end
   i32.const 0
   local.set $3
  end
  block
   local.get $0
   call $assembly/env/wasiabort
  end
 )
 (func $~lib/setargc (; 56 ;) (type $FUNCSIG$vi) (param $0 i32)
  local.get $0
  global.set $~lib/argc
 )
 (func $clock_time_get_trampoline (type $clock_time_get_trampoline_SIG) (param $0 i32) (param $1 i64) (param $2 i32) (result i32)
  local.get $0
  local.get $1
  i32.wrap/i64
  local.get $2
  call $~lib/bindings/wasi_unstable/clock_time_get
 )
)
