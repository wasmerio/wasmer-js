(module
  (type $t0 (func))
  (type $t1 (func (param i32)))
  (type $t2 (func (param i32) (result i64)))
  (type $t3 (func (param i32 i32) (result i32)))
  (type $t4 (func (param i32 i32 i32 i32)))
  (type $t5 (func (param i32 i32)))
  (type $t6 (func (param i32 i32 i32)))
  (type $t7 (func (param i32) (result i32)))
  (type $t8 (func (param i32 i32 i32) (result i32)))
  (type $t9 (func (param i32 i32 i32 i32) (result i32)))
  (type $t10 (func (result i32)))
  (type $t11 (func (param i32 i32 i32 i32 i32)))
  (type $t12 (func (param i32 i32 i32 i32 i32) (result i32)))
  (type $t13 (func (param i64 i32 i32) (result i32)))
  (type $t14 (func (param i32 i32 i32 i32 i32 i32) (result i32)))
  (type $t15 (func (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (import "wasi_snapshot_preview1" "proc_exit" (func $__wasi_proc_exit (type $t1)))
  (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (type $t9)))
  (import "wasi_snapshot_preview1" "fd_prestat_get" (func $__wasi_fd_prestat_get (type $t3)))
  (import "wasi_snapshot_preview1" "fd_prestat_dir_name" (func $__wasi_fd_prestat_dir_name (type $t8)))
  (import "wasi_snapshot_preview1" "environ_sizes_get" (func $__wasi_environ_sizes_get (type $t3)))
  (import "wasi_snapshot_preview1" "environ_get" (func $__wasi_environ_get (type $t3)))
  (func $__wasm_call_ctors (type $t0)
    call $__wasilibc_populate_environ
    call $__wasilibc_populate_libpreopen)
  (func $_start (type $t0)
    (local $l0 i32)
    call $__wasm_call_ctors
    call $__original_main
    local.set $l0
    call $__prepare_for_exit
    block $B0
      local.get $l0
      i32.eqz
      br_if $B0
      local.get $l0
      call $__wasi_proc_exit
      unreachable
    end)
  (func $_ZN3env4main17h1c163e809403ada2E (type $t0)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i32) (local $l30 i32) (local $l31 i32) (local $l32 i32) (local $l33 i32) (local $l34 i32) (local $l35 i32) (local $l36 i32) (local $l37 i32) (local $l38 i32) (local $l39 i32) (local $l40 i32) (local $l41 i32) (local $l42 i32) (local $l43 i32) (local $l44 i32) (local $l45 i32) (local $l46 i32) (local $l47 i32) (local $l48 i32) (local $l49 i32) (local $l50 i32) (local $l51 i32) (local $l52 i32) (local $l53 i32) (local $l54 i32) (local $l55 i32) (local $l56 i32) (local $l57 i32) (local $l58 i32) (local $l59 i32) (local $l60 i32) (local $l61 i32) (local $l62 i32) (local $l63 i32) (local $l64 i32) (local $l65 i32) (local $l66 i32) (local $l67 i32) (local $l68 i32) (local $l69 i32) (local $l70 i32) (local $l71 i32) (local $l72 i32) (local $l73 i32) (local $l74 i32) (local $l75 i32) (local $l76 i32) (local $l77 i32) (local $l78 i32) (local $l79 i32) (local $l80 i32) (local $l81 i32) (local $l82 i32) (local $l83 i32) (local $l84 i32) (local $l85 i32) (local $l86 i32) (local $l87 i32) (local $l88 i32) (local $l89 i32) (local $l90 i32) (local $l91 i32) (local $l92 i32) (local $l93 i32) (local $l94 i32) (local $l95 i32) (local $l96 i32) (local $l97 i32) (local $l98 i32) (local $l99 i32) (local $l100 i32) (local $l101 i32) (local $l102 i32) (local $l103 i32) (local $l104 i32) (local $l105 i32) (local $l106 i32) (local $l107 i32) (local $l108 i32) (local $l109 i32) (local $l110 i32) (local $l111 i32) (local $l112 i32) (local $l113 i32) (local $l114 i32) (local $l115 i32) (local $l116 i32) (local $l117 i32) (local $l118 i32) (local $l119 i32) (local $l120 i32) (local $l121 i32) (local $l122 i32) (local $l123 i32) (local $l124 i32) (local $l125 i32) (local $l126 i32) (local $l127 i32) (local $l128 i32) (local $l129 i32) (local $l130 i32) (local $l131 i32) (local $l132 i32) (local $l133 i32) (local $l134 i32) (local $l135 i32) (local $l136 i32) (local $l137 i32) (local $l138 i32) (local $l139 i32) (local $l140 i32) (local $l141 i32) (local $l142 i32) (local $l143 i32) (local $l144 i32) (local $l145 i32) (local $l146 i32) (local $l147 i32) (local $l148 i32) (local $l149 i32) (local $l150 i32) (local $l151 i32) (local $l152 i32) (local $l153 i64) (local $l154 i32) (local $l155 i32) (local $l156 i32) (local $l157 i64) (local $l158 i32) (local $l159 i32) (local $l160 i32) (local $l161 i32) (local $l162 i32) (local $l163 i32) (local $l164 i32) (local $l165 i32) (local $l166 i32) (local $l167 i32) (local $l168 i32) (local $l169 i32) (local $l170 i32) (local $l171 i32) (local $l172 i32) (local $l173 i32) (local $l174 i32) (local $l175 i32) (local $l176 i32) (local $l177 i32) (local $l178 i32) (local $l179 i32) (local $l180 i32) (local $l181 i32) (local $l182 i32) (local $l183 i32) (local $l184 i64) (local $l185 i32) (local $l186 i32) (local $l187 i32) (local $l188 i64) (local $l189 i32) (local $l190 i32) (local $l191 i32) (local $l192 i64) (local $l193 i64) (local $l194 i32) (local $l195 i32) (local $l196 i32) (local $l197 i64) (local $l198 i32) (local $l199 i32) (local $l200 i32) (local $l201 i64) (local $l202 i64) (local $l203 i32) (local $l204 i32) (local $l205 i32) (local $l206 i64) (local $l207 i32) (local $l208 i32) (local $l209 i32) (local $l210 i64) (local $l211 i32) (local $l212 i32) (local $l213 i32) (local $l214 i32) (local $l215 i32) (local $l216 i32) (local $l217 i32) (local $l218 i32) (local $l219 i32) (local $l220 i32) (local $l221 i32) (local $l222 i32) (local $l223 i32) (local $l224 i32) (local $l225 i32) (local $l226 i32) (local $l227 i32) (local $l228 i32) (local $l229 i32) (local $l230 i32) (local $l231 i32) (local $l232 i32) (local $l233 i32) (local $l234 i32) (local $l235 i32) (local $l236 i32) (local $l237 i32) (local $l238 i32) (local $l239 i32) (local $l240 i32) (local $l241 i32) (local $l242 i32) (local $l243 i32) (local $l244 i32) (local $l245 i32) (local $l246 i32) (local $l247 i32) (local $l248 i32) (local $l249 i32) (local $l250 i32) (local $l251 i64) (local $l252 i32) (local $l253 i32) (local $l254 i32) (local $l255 i32) (local $l256 i32) (local $l257 i32) (local $l258 i64) (local $l259 i32) (local $l260 i32) (local $l261 i32) (local $l262 i32) (local $l263 i32) (local $l264 i32) (local $l265 i32) (local $l266 i32) (local $l267 i32) (local $l268 i32) (local $l269 i32) (local $l270 i32) (local $l271 i32) (local $l272 i32) (local $l273 i32) (local $l274 i32) (local $l275 i32) (local $l276 i32) (local $l277 i32) (local $l278 i32) (local $l279 i32) (local $l280 i32) (local $l281 i32) (local $l282 i32) (local $l283 i32) (local $l284 i32) (local $l285 i32) (local $l286 i32) (local $l287 i32) (local $l288 i32) (local $l289 i32) (local $l290 i32) (local $l291 i32) (local $l292 i32) (local $l293 i32) (local $l294 i32) (local $l295 i32)
    global.get $g0
    local.set $l0
    i32.const 544
    local.set $l1
    local.get $l0
    local.get $l1
    i32.sub
    local.set $l2
    local.get $l2
    global.set $g0
    i32.const 48
    local.set $l3
    local.get $l2
    local.get $l3
    i32.add
    local.set $l4
    local.get $l4
    local.set $l5
    i32.const 1048576
    local.set $l6
    local.get $l6
    local.set $l7
    i32.const 13
    local.set $l8
    local.get $l5
    local.get $l7
    local.get $l8
    call $_ZN3std3env6var_os17h3361d87dce69b51fE
    i32.const 48
    local.set $l9
    local.get $l2
    local.get $l9
    i32.add
    local.set $l10
    local.get $l10
    local.set $l11
    local.get $l2
    local.get $l11
    i32.store offset=100
    local.get $l2
    i32.load offset=100
    local.set $l12
    i32.const 1
    local.set $l13
    i32.const 40
    local.set $l14
    local.get $l2
    local.get $l14
    i32.add
    local.set $l15
    local.get $l15
    local.get $l12
    local.get $l13
    call $_ZN4core3fmt10ArgumentV13new17h04d3527cc51883cbE
    local.get $l2
    i32.load offset=44 align=1
    local.set $l16
    local.get $l2
    i32.load offset=40 align=1
    local.set $l17
    i32.const 64
    local.set $l18
    local.get $l2
    local.get $l18
    i32.add
    local.set $l19
    local.get $l19
    local.set $l20
    i32.const 1048624
    local.set $l21
    local.get $l21
    local.set $l22
    i32.const 2
    local.set $l23
    i32.const 1
    local.set $l24
    i32.const 88
    local.set $l25
    local.get $l2
    local.get $l25
    i32.add
    local.set $l26
    local.get $l26
    local.set $l27
    local.get $l2
    local.get $l17
    i32.store offset=88
    local.get $l2
    local.get $l16
    i32.store offset=92
    local.get $l20
    local.get $l22
    local.get $l23
    local.get $l27
    local.get $l24
    call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
    i32.const 64
    local.set $l28
    local.get $l2
    local.get $l28
    i32.add
    local.set $l29
    local.get $l29
    local.set $l30
    local.get $l30
    call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
    i32.const 104
    local.set $l31
    local.get $l2
    local.get $l31
    i32.add
    local.set $l32
    local.get $l32
    local.set $l33
    i32.const 1048640
    local.set $l34
    local.get $l34
    local.set $l35
    i32.const 15
    local.set $l36
    local.get $l33
    local.get $l35
    local.get $l36
    call $_ZN3std3env6var_os17h3361d87dce69b51fE
    i32.const 104
    local.set $l37
    local.get $l2
    local.get $l37
    i32.add
    local.set $l38
    local.get $l38
    local.set $l39
    local.get $l2
    local.get $l39
    i32.store offset=156
    local.get $l2
    i32.load offset=156
    local.set $l40
    i32.const 1
    local.set $l41
    i32.const 32
    local.set $l42
    local.get $l2
    local.get $l42
    i32.add
    local.set $l43
    local.get $l43
    local.get $l40
    local.get $l41
    call $_ZN4core3fmt10ArgumentV13new17h04d3527cc51883cbE
    local.get $l2
    i32.load offset=36 align=1
    local.set $l44
    local.get $l2
    i32.load offset=32 align=1
    local.set $l45
    i32.const 120
    local.set $l46
    local.get $l2
    local.get $l46
    i32.add
    local.set $l47
    local.get $l47
    local.set $l48
    i32.const 1048692
    local.set $l49
    local.get $l49
    local.set $l50
    i32.const 2
    local.set $l51
    i32.const 1
    local.set $l52
    i32.const 144
    local.set $l53
    local.get $l2
    local.get $l53
    i32.add
    local.set $l54
    local.get $l54
    local.set $l55
    local.get $l2
    local.get $l45
    i32.store offset=144
    local.get $l2
    local.get $l44
    i32.store offset=148
    local.get $l48
    local.get $l50
    local.get $l51
    local.get $l55
    local.get $l52
    call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
    i32.const 120
    local.set $l56
    local.get $l2
    local.get $l56
    i32.add
    local.set $l57
    local.get $l57
    local.set $l58
    local.get $l58
    call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
    i32.const 1048576
    local.set $l59
    local.get $l59
    local.set $l60
    i32.const 13
    local.set $l61
    i32.const 1048708
    local.set $l62
    local.get $l62
    local.set $l63
    i32.const 9
    local.set $l64
    local.get $l60
    local.get $l61
    local.get $l63
    local.get $l64
    call $_ZN3std3env7set_var17h6839b31bbc669897E
    i32.const 160
    local.set $l65
    local.get $l2
    local.get $l65
    i32.add
    local.set $l66
    local.get $l66
    local.set $l67
    i32.const 1048576
    local.set $l68
    local.get $l68
    local.set $l69
    i32.const 13
    local.set $l70
    local.get $l67
    local.get $l69
    local.get $l70
    call $_ZN3std3env6var_os17h3361d87dce69b51fE
    i32.const 160
    local.set $l71
    local.get $l2
    local.get $l71
    i32.add
    local.set $l72
    local.get $l72
    local.set $l73
    local.get $l2
    local.get $l73
    i32.store offset=212
    local.get $l2
    i32.load offset=212
    local.set $l74
    i32.const 1
    local.set $l75
    i32.const 24
    local.set $l76
    local.get $l2
    local.get $l76
    i32.add
    local.set $l77
    local.get $l77
    local.get $l74
    local.get $l75
    call $_ZN4core3fmt10ArgumentV13new17h04d3527cc51883cbE
    local.get $l2
    i32.load offset=28 align=1
    local.set $l78
    local.get $l2
    i32.load offset=24 align=1
    local.set $l79
    i32.const 176
    local.set $l80
    local.get $l2
    local.get $l80
    i32.add
    local.set $l81
    local.get $l81
    local.set $l82
    i32.const 1048752
    local.set $l83
    local.get $l83
    local.set $l84
    i32.const 2
    local.set $l85
    i32.const 1
    local.set $l86
    i32.const 200
    local.set $l87
    local.get $l2
    local.get $l87
    i32.add
    local.set $l88
    local.get $l88
    local.set $l89
    local.get $l2
    local.get $l79
    i32.store offset=200
    local.get $l2
    local.get $l78
    i32.store offset=204
    local.get $l82
    local.get $l84
    local.get $l85
    local.get $l89
    local.get $l86
    call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
    i32.const 176
    local.set $l90
    local.get $l2
    local.get $l90
    i32.add
    local.set $l91
    local.get $l91
    local.set $l92
    local.get $l92
    call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
    i32.const 1048640
    local.set $l93
    local.get $l93
    local.set $l94
    i32.const 15
    local.set $l95
    i32.const 1048708
    local.set $l96
    local.get $l96
    local.set $l97
    i32.const 9
    local.set $l98
    local.get $l94
    local.get $l95
    local.get $l97
    local.get $l98
    call $_ZN3std3env7set_var17h6839b31bbc669897E
    i32.const 216
    local.set $l99
    local.get $l2
    local.get $l99
    i32.add
    local.set $l100
    local.get $l100
    local.set $l101
    i32.const 1048640
    local.set $l102
    local.get $l102
    local.set $l103
    i32.const 15
    local.set $l104
    local.get $l101
    local.get $l103
    local.get $l104
    call $_ZN3std3env6var_os17h3361d87dce69b51fE
    i32.const 216
    local.set $l105
    local.get $l2
    local.get $l105
    i32.add
    local.set $l106
    local.get $l106
    local.set $l107
    local.get $l2
    local.get $l107
    i32.store offset=268
    local.get $l2
    i32.load offset=268
    local.set $l108
    i32.const 1
    local.set $l109
    i32.const 16
    local.set $l110
    local.get $l2
    local.get $l110
    i32.add
    local.set $l111
    local.get $l111
    local.get $l108
    local.get $l109
    call $_ZN4core3fmt10ArgumentV13new17h04d3527cc51883cbE
    local.get $l2
    i32.load offset=20 align=1
    local.set $l112
    local.get $l2
    i32.load offset=16 align=1
    local.set $l113
    i32.const 232
    local.set $l114
    local.get $l2
    local.get $l114
    i32.add
    local.set $l115
    local.get $l115
    local.set $l116
    i32.const 1048808
    local.set $l117
    local.get $l117
    local.set $l118
    i32.const 2
    local.set $l119
    i32.const 1
    local.set $l120
    i32.const 256
    local.set $l121
    local.get $l2
    local.get $l121
    i32.add
    local.set $l122
    local.get $l122
    local.set $l123
    local.get $l2
    local.get $l113
    i32.store offset=256
    local.get $l2
    local.get $l112
    i32.store offset=260
    local.get $l116
    local.get $l118
    local.get $l119
    local.get $l123
    local.get $l120
    call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
    i32.const 232
    local.set $l124
    local.get $l2
    local.get $l124
    i32.add
    local.set $l125
    local.get $l125
    local.set $l126
    local.get $l126
    call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
    i32.const 272
    local.set $l127
    local.get $l2
    local.get $l127
    i32.add
    local.set $l128
    local.get $l128
    local.set $l129
    i32.const 1048844
    local.set $l130
    local.get $l130
    local.set $l131
    i32.const 1
    local.set $l132
    i32.const 4
    local.set $l133
    i32.const 0
    local.set $l134
    local.get $l129
    local.get $l131
    local.get $l132
    local.get $l133
    local.get $l134
    call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
    i32.const 272
    local.set $l135
    local.get $l2
    local.get $l135
    i32.add
    local.set $l136
    local.get $l136
    local.set $l137
    local.get $l137
    call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
    i32.const 312
    local.set $l138
    local.get $l2
    local.get $l138
    i32.add
    local.set $l139
    local.get $l139
    local.set $l140
    local.get $l140
    call $_ZN3std3env4vars17hcd9e6b77ec763c5eE
    i32.const 296
    local.set $l141
    local.get $l2
    local.get $l141
    i32.add
    local.set $l142
    local.get $l142
    local.set $l143
    i32.const 312
    local.set $l144
    local.get $l2
    local.get $l144
    i32.add
    local.set $l145
    local.get $l145
    local.set $l146
    local.get $l143
    local.get $l146
    call $_ZN63_$LT$I$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h483247e02e300287E
    i32.const 296
    local.set $l147
    local.get $l2
    local.get $l147
    i32.add
    local.set $l148
    local.get $l148
    local.set $l149
    i32.const 328
    local.set $l150
    local.get $l2
    local.get $l150
    i32.add
    local.set $l151
    local.get $l151
    local.set $l152
    local.get $l149
    i64.load align=4
    local.set $l153
    local.get $l152
    local.get $l153
    i64.store align=4
    i32.const 8
    local.set $l154
    local.get $l152
    local.get $l154
    i32.add
    local.set $l155
    local.get $l149
    local.get $l154
    i32.add
    local.set $l156
    local.get $l156
    i64.load align=4
    local.set $l157
    local.get $l155
    local.get $l157
    i64.store align=4
    loop $L0
      i32.const 368
      local.set $l158
      local.get $l2
      local.get $l158
      i32.add
      local.set $l159
      local.get $l159
      local.set $l160
      i32.const 328
      local.set $l161
      local.get $l2
      local.get $l161
      i32.add
      local.set $l162
      local.get $l162
      local.set $l163
      local.get $l160
      local.get $l163
      call $_ZN73_$LT$std..env..Vars$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h5d7dad2d7e713553E
      local.get $l2
      i32.load offset=368
      local.set $l164
      i32.const 0
      local.set $l165
      local.get $l164
      local.get $l165
      i32.ne
      local.set $l166
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                local.get $l166
                br_table $B5 $B4 $B5
              end
              i32.const 368
              local.set $l167
              local.get $l2
              local.get $l167
              i32.add
              local.set $l168
              local.get $l168
              local.set $l169
              local.get $l169
              call $_ZN4core3ptr18real_drop_in_place17hf276b60e84bfb47aE
              br $B3
            end
            i32.const 1
            local.set $l170
            i32.const 0
            local.set $l171
            i32.const 416
            local.set $l172
            local.get $l2
            local.get $l172
            i32.add
            local.set $l173
            local.get $l173
            local.set $l174
            i32.const 344
            local.set $l175
            local.get $l2
            local.get $l175
            i32.add
            local.set $l176
            local.get $l176
            local.set $l177
            i32.const 392
            local.set $l178
            local.get $l2
            local.get $l178
            i32.add
            local.set $l179
            local.get $l179
            local.set $l180
            i32.const 368
            local.set $l181
            local.get $l2
            local.get $l181
            i32.add
            local.set $l182
            local.get $l182
            local.set $l183
            local.get $l183
            i64.load align=4
            local.set $l184
            local.get $l180
            local.get $l184
            i64.store align=4
            i32.const 16
            local.set $l185
            local.get $l180
            local.get $l185
            i32.add
            local.set $l186
            local.get $l183
            local.get $l185
            i32.add
            local.set $l187
            local.get $l187
            i64.load align=4
            local.set $l188
            local.get $l186
            local.get $l188
            i64.store align=4
            i32.const 8
            local.set $l189
            local.get $l180
            local.get $l189
            i32.add
            local.set $l190
            local.get $l183
            local.get $l189
            i32.add
            local.set $l191
            local.get $l191
            i64.load align=4
            local.set $l192
            local.get $l190
            local.get $l192
            i64.store align=4
            local.get $l180
            i64.load align=4
            local.set $l193
            local.get $l174
            local.get $l193
            i64.store align=4
            i32.const 16
            local.set $l194
            local.get $l174
            local.get $l194
            i32.add
            local.set $l195
            local.get $l180
            local.get $l194
            i32.add
            local.set $l196
            local.get $l196
            i64.load align=4
            local.set $l197
            local.get $l195
            local.get $l197
            i64.store align=4
            i32.const 8
            local.set $l198
            local.get $l174
            local.get $l198
            i32.add
            local.set $l199
            local.get $l180
            local.get $l198
            i32.add
            local.set $l200
            local.get $l200
            i64.load align=4
            local.set $l201
            local.get $l199
            local.get $l201
            i64.store align=4
            local.get $l174
            i64.load align=4
            local.set $l202
            local.get $l177
            local.get $l202
            i64.store align=4
            i32.const 16
            local.set $l203
            local.get $l177
            local.get $l203
            i32.add
            local.set $l204
            local.get $l174
            local.get $l203
            i32.add
            local.set $l205
            local.get $l205
            i64.load align=4
            local.set $l206
            local.get $l204
            local.get $l206
            i64.store align=4
            i32.const 8
            local.set $l207
            local.get $l177
            local.get $l207
            i32.add
            local.set $l208
            local.get $l174
            local.get $l207
            i32.add
            local.set $l209
            local.get $l209
            i64.load align=4
            local.set $l210
            local.get $l208
            local.get $l210
            i64.store align=4
            local.get $l2
            i32.load offset=368
            local.set $l211
            local.get $l211
            local.set $l212
            local.get $l171
            local.set $l213
            local.get $l212
            local.get $l213
            i32.le_u
            local.set $l214
            i32.const 1
            local.set $l215
            local.get $l214
            local.get $l215
            i32.and
            local.set $l216
            local.get $l171
            local.get $l170
            local.get $l216
            select
            local.set $l217
            local.get $l217
            local.set $l218
            local.get $l170
            local.set $l219
            local.get $l218
            local.get $l219
            i32.eq
            local.set $l220
            i32.const 1
            local.set $l221
            local.get $l220
            local.get $l221
            i32.and
            local.set $l222
            local.get $l222
            br_if $B1
            br $B2
          end
          i32.const 328
          local.set $l223
          local.get $l2
          local.get $l223
          i32.add
          local.set $l224
          local.get $l224
          local.set $l225
          local.get $l225
          call $_ZN4core3ptr18real_drop_in_place17h355dd14be8a65886E
          i32.const 216
          local.set $l226
          local.get $l2
          local.get $l226
          i32.add
          local.set $l227
          local.get $l227
          local.set $l228
          local.get $l228
          call $_ZN4core3ptr18real_drop_in_place17hd4b0464c12950ff0E
          i32.const 160
          local.set $l229
          local.get $l2
          local.get $l229
          i32.add
          local.set $l230
          local.get $l230
          local.set $l231
          local.get $l231
          call $_ZN4core3ptr18real_drop_in_place17hd4b0464c12950ff0E
          i32.const 104
          local.set $l232
          local.get $l2
          local.get $l232
          i32.add
          local.set $l233
          local.get $l233
          local.set $l234
          local.get $l234
          call $_ZN4core3ptr18real_drop_in_place17hd4b0464c12950ff0E
          i32.const 48
          local.set $l235
          local.get $l2
          local.get $l235
          i32.add
          local.set $l236
          local.get $l236
          local.set $l237
          local.get $l237
          call $_ZN4core3ptr18real_drop_in_place17hd4b0464c12950ff0E
          i32.const 544
          local.set $l238
          local.get $l2
          local.get $l238
          i32.add
          local.set $l239
          local.get $l239
          global.set $g0
          return
        end
        i32.const 368
        local.set $l240
        local.get $l2
        local.get $l240
        i32.add
        local.set $l241
        local.get $l241
        local.set $l242
        local.get $l242
        call $_ZN4core3ptr18real_drop_in_place17hf276b60e84bfb47aE
      end
      i32.const 8
      local.set $l243
      i32.const 440
      local.set $l244
      local.get $l2
      local.get $l244
      i32.add
      local.set $l245
      local.get $l245
      local.get $l243
      i32.add
      local.set $l246
      i32.const 344
      local.set $l247
      local.get $l2
      local.get $l247
      i32.add
      local.set $l248
      local.get $l248
      local.get $l243
      i32.add
      local.set $l249
      local.get $l249
      i32.load
      local.set $l250
      local.get $l246
      local.get $l250
      i32.store
      local.get $l2
      i64.load offset=344
      local.set $l251
      local.get $l2
      local.get $l251
      i64.store offset=440
      i32.const 456
      local.set $l252
      local.get $l2
      local.get $l252
      i32.add
      local.set $l253
      local.get $l253
      local.get $l243
      i32.add
      local.set $l254
      i32.const 364
      local.set $l255
      local.get $l2
      local.get $l255
      i32.add
      local.set $l256
      local.get $l256
      i32.load
      local.set $l257
      local.get $l254
      local.get $l257
      i32.store
      local.get $l2
      i64.load offset=356 align=4
      local.set $l258
      local.get $l2
      local.get $l258
      i64.store offset=456
      i32.const 1048856
      local.set $l259
      local.get $l2
      local.get $l259
      i32.store offset=496
      i32.const 3
      local.set $l260
      local.get $l2
      local.get $l260
      i32.store offset=500
      i32.const 440
      local.set $l261
      local.get $l2
      local.get $l261
      i32.add
      local.set $l262
      local.get $l2
      local.get $l262
      i32.store offset=520
      i32.const 456
      local.set $l263
      local.get $l2
      local.get $l263
      i32.add
      local.set $l264
      local.get $l2
      local.get $l264
      i32.store offset=524
      local.get $l2
      i32.load offset=520
      local.set $l265
      local.get $l2
      i32.load offset=524
      local.set $l266
      local.get $l2
      local.get $l266
      i32.store offset=532
      i32.const 2
      local.set $l267
      i32.const 8
      local.set $l268
      local.get $l2
      local.get $l268
      i32.add
      local.set $l269
      local.get $l269
      local.get $l265
      local.get $l267
      call $_ZN4core3fmt10ArgumentV13new17hd4f8852b746eab15E
      local.get $l2
      i32.load offset=8 align=1
      local.set $l270
      local.get $l2
      i32.load offset=12 align=1
      local.set $l271
      local.get $l2
      local.get $l271
      i32.store offset=540
      local.get $l2
      local.get $l270
      i32.store offset=536
      local.get $l2
      i32.load offset=532
      local.set $l272
      i32.const 2
      local.set $l273
      local.get $l2
      local.get $l272
      local.get $l273
      call $_ZN4core3fmt10ArgumentV13new17hd4f8852b746eab15E
      local.get $l2
      i32.load offset=4 align=1
      local.set $l274
      local.get $l2
      i32.load align=1
      local.set $l275
      i32.const 472
      local.set $l276
      local.get $l2
      local.get $l276
      i32.add
      local.set $l277
      local.get $l277
      local.set $l278
      i32.const 2
      local.set $l279
      i32.const 504
      local.set $l280
      local.get $l2
      local.get $l280
      i32.add
      local.set $l281
      local.get $l281
      local.set $l282
      local.get $l2
      i32.load offset=536
      local.set $l283
      local.get $l2
      i32.load offset=540
      local.set $l284
      local.get $l2
      local.get $l283
      i32.store offset=504
      local.get $l2
      local.get $l284
      i32.store offset=508
      local.get $l2
      local.get $l275
      i32.store offset=512
      local.get $l2
      local.get $l274
      i32.store offset=516
      local.get $l2
      i32.load offset=496
      local.set $l285
      local.get $l2
      i32.load offset=500
      local.set $l286
      local.get $l278
      local.get $l285
      local.get $l286
      local.get $l282
      local.get $l279
      call $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE
      i32.const 472
      local.set $l287
      local.get $l2
      local.get $l287
      i32.add
      local.set $l288
      local.get $l288
      local.set $l289
      local.get $l289
      call $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE
      i32.const 456
      local.set $l290
      local.get $l2
      local.get $l290
      i32.add
      local.set $l291
      local.get $l291
      local.set $l292
      local.get $l292
      call $_ZN4core3ptr18real_drop_in_place17hbaed0630ff0cc972E
      i32.const 440
      local.set $l293
      local.get $l2
      local.get $l293
      i32.add
      local.set $l294
      local.get $l294
      local.set $l295
      local.get $l295
      call $_ZN4core3ptr18real_drop_in_place17hbaed0630ff0cc972E
      br $L0
    end
    unreachable)
  (func $__original_main (type $t10) (result i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32)
    i32.const 3
    local.set $l0
    i32.const 0
    local.set $l1
    local.get $l0
    local.get $l1
    local.get $l1
    call $_ZN3std2rt10lang_start17ha4f1b80a9031c720E
    local.set $l2
    local.get $l2
    return)
  (func $main (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    call $__original_main
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core4iter6traits8iterator8Iterator6by_ref17h5615a1c18546f843E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN5alloc3vec12Vec$LT$T$GT$10as_mut_ptr17h93f4d2bf56e900a2E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    local.get $p0
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$3ptr17h4c3a8a0d9a0d05b9E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr31_$LT$impl$u20$$BP$mut$u20$T$GT$7is_null17hbdaa8b9440c3ba9bE
    drop
    local.get $l1
    return)
  (func $_ZN5alloc3vec12Vec$LT$T$GT$6as_ptr17h18b01b4016b62f79E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    local.get $p0
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$3ptr17h4c3a8a0d9a0d05b9E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr31_$LT$impl$u20$$BP$mut$u20$T$GT$7is_null17hbdaa8b9440c3ba9bE
    drop
    local.get $l1
    return)
  (func $_ZN63_$LT$I$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17he6af52405ad1fdbeE (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN66_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h8b64b9032986cad7E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    i32.const 8
    local.set $l4
    local.get $l3
    local.get $l4
    i32.add
    local.set $l5
    local.get $l5
    local.get $p0
    call $_ZN80_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..index..IndexMut$LT$I$GT$$GT$9index_mut17h1ce86175a0004eacE
    local.get $l3
    i32.load offset=12 align=1
    drop
    local.get $l3
    i32.load offset=8 align=1
    drop
    i32.const 16
    local.set $l6
    local.get $l3
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    global.set $g0
    return)
  (func $_ZN80_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..index..IndexMut$LT$I$GT$$GT$9index_mut17h1ce86175a0004eacE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    i32.const 8
    local.set $l5
    local.get $l4
    local.get $l5
    i32.add
    local.set $l6
    local.get $l6
    local.get $p1
    call $_ZN71_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..deref..DerefMut$GT$9deref_mut17h09c57525ac6df088E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l7
    local.get $l4
    i32.load offset=8 align=1
    local.set $l8
    local.get $l4
    local.get $l8
    local.get $l7
    call $_ZN4core5slice77_$LT$impl$u20$core..ops..index..IndexMut$LT$I$GT$$u20$for$u20$$u5b$T$u5d$$GT$9index_mut17hc733c55ac7a44c31E
    local.get $l4
    i32.load offset=4 align=1
    local.set $l9
    local.get $l4
    i32.load align=1
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l10
    i32.store
    i32.const 16
    local.set $l11
    local.get $l4
    local.get $l11
    i32.add
    local.set $l12
    local.get $l12
    global.set $g0
    return)
  (func $_ZN68_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..deref..Deref$GT$5deref17hc652a6105b069939E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    call $_ZN5alloc3vec12Vec$LT$T$GT$6as_ptr17h18b01b4016b62f79E
    local.set $l5
    local.get $p1
    i32.load offset=8
    local.set $l6
    i32.const 8
    local.set $l7
    local.get $l4
    local.get $l7
    i32.add
    local.set $l8
    local.get $l8
    local.get $l5
    local.get $l6
    call $_ZN4core5slice14from_raw_parts17hbd253abd1a2952e3E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l9
    local.get $l4
    i32.load offset=8 align=1
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l10
    i32.store
    i32.const 16
    local.set $l11
    local.get $l4
    local.get $l11
    i32.add
    local.set $l12
    local.get $l12
    global.set $g0
    return)
  (func $_ZN71_$LT$alloc..vec..IntoIter$LT$T$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hf4afc067e3dcdf93E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i32) (local $l30 i32) (local $l31 i32) (local $l32 i64) (local $l33 i32) (local $l34 i32) (local $l35 i32) (local $l36 i64) (local $l37 i32) (local $l38 i32) (local $l39 i32) (local $l40 i64) (local $l41 i64) (local $l42 i32) (local $l43 i32) (local $l44 i32) (local $l45 i64) (local $l46 i32) (local $l47 i32) (local $l48 i32) (local $l49 i64) (local $l50 i64) (local $l51 i32) (local $l52 i32) (local $l53 i32) (local $l54 i64) (local $l55 i32) (local $l56 i32) (local $l57 i32) (local $l58 i64) (local $l59 i32) (local $l60 i32) (local $l61 i32) (local $l62 i32) (local $l63 i32) (local $l64 i32) (local $l65 i32) (local $l66 i32) (local $l67 i32) (local $l68 i32) (local $l69 i32) (local $l70 i32) (local $l71 i32) (local $l72 i32) (local $l73 i32) (local $l74 i32) (local $l75 i32) (local $l76 i32) (local $l77 i32) (local $l78 i32) (local $l79 i32) (local $l80 i32) (local $l81 i32) (local $l82 i32) (local $l83 i32) (local $l84 i32) (local $l85 i32) (local $l86 i32) (local $l87 i32) (local $l88 i32) (local $l89 i32) (local $l90 i64) (local $l91 i32) (local $l92 i32) (local $l93 i32) (local $l94 i64) (local $l95 i32) (local $l96 i32) (local $l97 i32) (local $l98 i64)
    global.get $g0
    local.set $l1
    i32.const 144
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    local.get $p0
    call $_ZN4core4iter6traits8iterator8Iterator6by_ref17h5615a1c18546f843E
    local.set $l4
    local.get $l4
    call $_ZN63_$LT$I$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17he6af52405ad1fdbeE
    local.set $l5
    local.get $l3
    local.get $l5
    i32.store offset=12
    loop $L0
      i32.const 40
      local.set $l6
      local.get $l3
      local.get $l6
      i32.add
      local.set $l7
      local.get $l7
      local.set $l8
      i32.const 12
      local.set $l9
      local.get $l3
      local.get $l9
      i32.add
      local.set $l10
      local.get $l10
      local.set $l11
      local.get $l8
      local.get $l11
      call $_ZN72_$LT$$RF$mut$u20$I$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17hda9cb6458ba6573dE
      local.get $l3
      i32.load offset=40
      local.set $l12
      i32.const 0
      local.set $l13
      local.get $l12
      local.get $l13
      i32.ne
      local.set $l14
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                local.get $l14
                br_table $B5 $B4 $B5
              end
              i32.const 40
              local.set $l15
              local.get $l3
              local.get $l15
              i32.add
              local.set $l16
              local.get $l16
              local.set $l17
              local.get $l17
              call $_ZN4core3ptr18real_drop_in_place17h17fc7c4de9633c70E
              br $B3
            end
            i32.const 1
            local.set $l18
            i32.const 0
            local.set $l19
            i32.const 88
            local.set $l20
            local.get $l3
            local.get $l20
            i32.add
            local.set $l21
            local.get $l21
            local.set $l22
            i32.const 16
            local.set $l23
            local.get $l3
            local.get $l23
            i32.add
            local.set $l24
            local.get $l24
            local.set $l25
            i32.const 64
            local.set $l26
            local.get $l3
            local.get $l26
            i32.add
            local.set $l27
            local.get $l27
            local.set $l28
            i32.const 40
            local.set $l29
            local.get $l3
            local.get $l29
            i32.add
            local.set $l30
            local.get $l30
            local.set $l31
            local.get $l31
            i64.load align=4
            local.set $l32
            local.get $l28
            local.get $l32
            i64.store align=4
            i32.const 16
            local.set $l33
            local.get $l28
            local.get $l33
            i32.add
            local.set $l34
            local.get $l31
            local.get $l33
            i32.add
            local.set $l35
            local.get $l35
            i64.load align=4
            local.set $l36
            local.get $l34
            local.get $l36
            i64.store align=4
            i32.const 8
            local.set $l37
            local.get $l28
            local.get $l37
            i32.add
            local.set $l38
            local.get $l31
            local.get $l37
            i32.add
            local.set $l39
            local.get $l39
            i64.load align=4
            local.set $l40
            local.get $l38
            local.get $l40
            i64.store align=4
            local.get $l28
            i64.load align=4
            local.set $l41
            local.get $l22
            local.get $l41
            i64.store align=4
            i32.const 16
            local.set $l42
            local.get $l22
            local.get $l42
            i32.add
            local.set $l43
            local.get $l28
            local.get $l42
            i32.add
            local.set $l44
            local.get $l44
            i64.load align=4
            local.set $l45
            local.get $l43
            local.get $l45
            i64.store align=4
            i32.const 8
            local.set $l46
            local.get $l22
            local.get $l46
            i32.add
            local.set $l47
            local.get $l28
            local.get $l46
            i32.add
            local.set $l48
            local.get $l48
            i64.load align=4
            local.set $l49
            local.get $l47
            local.get $l49
            i64.store align=4
            local.get $l22
            i64.load align=4
            local.set $l50
            local.get $l25
            local.get $l50
            i64.store align=4
            i32.const 16
            local.set $l51
            local.get $l25
            local.get $l51
            i32.add
            local.set $l52
            local.get $l22
            local.get $l51
            i32.add
            local.set $l53
            local.get $l53
            i64.load align=4
            local.set $l54
            local.get $l52
            local.get $l54
            i64.store align=4
            i32.const 8
            local.set $l55
            local.get $l25
            local.get $l55
            i32.add
            local.set $l56
            local.get $l22
            local.get $l55
            i32.add
            local.set $l57
            local.get $l57
            i64.load align=4
            local.set $l58
            local.get $l56
            local.get $l58
            i64.store align=4
            local.get $l3
            i32.load offset=40
            local.set $l59
            local.get $l59
            local.set $l60
            local.get $l19
            local.set $l61
            local.get $l60
            local.get $l61
            i32.le_u
            local.set $l62
            i32.const 1
            local.set $l63
            local.get $l62
            local.get $l63
            i32.and
            local.set $l64
            local.get $l19
            local.get $l18
            local.get $l64
            select
            local.set $l65
            local.get $l65
            local.set $l66
            local.get $l18
            local.set $l67
            local.get $l66
            local.get $l67
            i32.eq
            local.set $l68
            i32.const 1
            local.set $l69
            local.get $l68
            local.get $l69
            i32.and
            local.set $l70
            local.get $l70
            br_if $B1
            br $B2
          end
          local.get $p0
          i32.load
          local.set $l71
          local.get $l71
          call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17h07187c673bcaba91E
          local.set $l72
          local.get $p0
          i32.load offset=4
          local.set $l73
          local.get $l3
          local.get $l72
          local.get $l73
          call $_ZN5alloc7raw_vec15RawVec$LT$T$GT$14from_raw_parts17h86ac3ddd57201372E
          local.get $l3
          i32.load align=1
          local.set $l74
          local.get $l3
          i32.load offset=4 align=1
          local.set $l75
          local.get $l3
          local.get $l75
          i32.store offset=140
          local.get $l3
          local.get $l74
          i32.store offset=136
          i32.const 136
          local.set $l76
          local.get $l3
          local.get $l76
          i32.add
          local.set $l77
          local.get $l77
          local.set $l78
          local.get $l78
          call $_ZN4core3ptr18real_drop_in_place17h37aac323d6234dcaE
          i32.const 144
          local.set $l79
          local.get $l3
          local.get $l79
          i32.add
          local.set $l80
          local.get $l80
          global.set $g0
          return
        end
        i32.const 40
        local.set $l81
        local.get $l3
        local.get $l81
        i32.add
        local.set $l82
        local.get $l82
        local.set $l83
        local.get $l83
        call $_ZN4core3ptr18real_drop_in_place17h17fc7c4de9633c70E
      end
      i32.const 112
      local.set $l84
      local.get $l3
      local.get $l84
      i32.add
      local.set $l85
      local.get $l85
      local.set $l86
      i32.const 16
      local.set $l87
      local.get $l3
      local.get $l87
      i32.add
      local.set $l88
      local.get $l88
      local.set $l89
      local.get $l89
      i64.load align=4
      local.set $l90
      local.get $l86
      local.get $l90
      i64.store align=4
      i32.const 16
      local.set $l91
      local.get $l86
      local.get $l91
      i32.add
      local.set $l92
      local.get $l89
      local.get $l91
      i32.add
      local.set $l93
      local.get $l93
      i64.load align=4
      local.set $l94
      local.get $l92
      local.get $l94
      i64.store align=4
      i32.const 8
      local.set $l95
      local.get $l86
      local.get $l95
      i32.add
      local.set $l96
      local.get $l89
      local.get $l95
      i32.add
      local.set $l97
      local.get $l97
      i64.load align=4
      local.set $l98
      local.get $l96
      local.get $l98
      i64.store align=4
      local.get $l86
      call $_ZN4core3ptr18real_drop_in_place17h4f0b8e111cc426fcE
      br $L0
    end
    unreachable)
  (func $_ZN72_$LT$$RF$mut$u20$I$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17hda9cb6458ba6573dE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    local.get $p1
    i32.load
    local.set $l2
    local.get $p0
    local.get $l2
    call $_ZN88_$LT$alloc..vec..IntoIter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h6e7f9bcab3a585f1E
    return)
  (func $_ZN71_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..deref..DerefMut$GT$9deref_mut17h09c57525ac6df088E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    call $_ZN5alloc3vec12Vec$LT$T$GT$10as_mut_ptr17h93f4d2bf56e900a2E
    local.set $l5
    local.get $p1
    i32.load offset=8
    local.set $l6
    i32.const 8
    local.set $l7
    local.get $l4
    local.get $l7
    i32.add
    local.set $l8
    local.get $l8
    local.get $l5
    local.get $l6
    call $_ZN4core5slice18from_raw_parts_mut17h7803c6edf10dab15E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l9
    local.get $l4
    i32.load offset=8 align=1
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l10
    i32.store
    i32.const 16
    local.set $l11
    local.get $l4
    local.get $l11
    i32.add
    local.set $l12
    local.get $l12
    global.set $g0
    return)
  (func $_ZN88_$LT$alloc..vec..IntoIter$LT$T$GT$$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h6e7f9bcab3a585f1E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i64) (local $l30 i32) (local $l31 i32) (local $l32 i32) (local $l33 i64) (local $l34 i32) (local $l35 i32) (local $l36 i32) (local $l37 i64) (local $l38 i32) (local $l39 i32) (local $l40 i32) (local $l41 i32) (local $l42 i32) (local $l43 i32) (local $l44 i64) (local $l45 i32) (local $l46 i32) (local $l47 i32) (local $l48 i64) (local $l49 i32) (local $l50 i32) (local $l51 i32) (local $l52 i64) (local $l53 i32) (local $l54 i32)
    global.get $g0
    local.set $l2
    i32.const 64
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    i32.load offset=8
    local.set $l5
    local.get $p1
    i32.load offset=12
    local.set $l6
    local.get $l5
    local.set $l7
    local.get $l6
    local.set $l8
    local.get $l7
    local.get $l8
    i32.eq
    local.set $l9
    i32.const 1
    local.set $l10
    local.get $l9
    local.get $l10
    i32.and
    local.set $l11
    block $B0
      block $B1
        block $B2
          local.get $l11
          br_if $B2
          i32.const 24
          local.set $l12
          local.get $l4
          local.get $l12
          i32.store offset=60
          local.get $l4
          i32.load offset=60
          local.set $l13
          br $B1
        end
        i32.const 0
        local.set $l14
        local.get $p0
        local.get $l14
        i32.store
        br $B0
      end
      block $B3
        block $B4
          block $B5
            local.get $l13
            i32.eqz
            br_if $B5
            i32.const 1
            local.set $l15
            local.get $p1
            i32.load offset=8
            local.set $l16
            local.get $p1
            i32.load offset=8
            local.set $l17
            local.get $l17
            local.get $l15
            call $_ZN4core3ptr33_$LT$impl$u20$$BP$const$u20$T$GT$6offset17h96744d777fc21e56E
            local.set $l18
            br $B4
          end
          local.get $p1
          i32.load offset=8
          local.set $l19
          i32.const 1
          local.set $l20
          local.get $l19
          local.get $l20
          i32.add
          local.set $l21
          local.get $l4
          local.get $l21
          i32.store offset=56
          local.get $l4
          i32.load offset=56
          local.set $l22
          i32.const 8
          local.set $l23
          local.get $l4
          local.get $l23
          i32.add
          local.set $l24
          local.get $l24
          local.set $l25
          local.get $p1
          local.get $l22
          i32.store offset=8
          local.get $l25
          call $_ZN4core3mem6zeroed17h3b286d6d1c4ae049E
          i32.const 8
          local.set $l26
          local.get $l4
          local.get $l26
          i32.add
          local.set $l27
          local.get $l27
          local.set $l28
          local.get $l28
          i64.load align=4
          local.set $l29
          local.get $p0
          local.get $l29
          i64.store align=4
          i32.const 16
          local.set $l30
          local.get $p0
          local.get $l30
          i32.add
          local.set $l31
          local.get $l28
          local.get $l30
          i32.add
          local.set $l32
          local.get $l32
          i64.load align=4
          local.set $l33
          local.get $l31
          local.get $l33
          i64.store align=4
          i32.const 8
          local.set $l34
          local.get $p0
          local.get $l34
          i32.add
          local.set $l35
          local.get $l28
          local.get $l34
          i32.add
          local.set $l36
          local.get $l36
          i64.load align=4
          local.set $l37
          local.get $l35
          local.get $l37
          i64.store align=4
          br $B3
        end
        i32.const 32
        local.set $l38
        local.get $l4
        local.get $l38
        i32.add
        local.set $l39
        local.get $l39
        local.set $l40
        local.get $p1
        local.get $l18
        i32.store offset=8
        local.get $l40
        local.get $l16
        call $_ZN4core3ptr4read17h5c8ea3f222d9540aE
        i32.const 32
        local.set $l41
        local.get $l4
        local.get $l41
        i32.add
        local.set $l42
        local.get $l42
        local.set $l43
        local.get $l43
        i64.load align=4
        local.set $l44
        local.get $p0
        local.get $l44
        i64.store align=4
        i32.const 16
        local.set $l45
        local.get $p0
        local.get $l45
        i32.add
        local.set $l46
        local.get $l43
        local.get $l45
        i32.add
        local.set $l47
        local.get $l47
        i64.load align=4
        local.set $l48
        local.get $l46
        local.get $l48
        i64.store align=4
        i32.const 8
        local.set $l49
        local.get $p0
        local.get $l49
        i32.add
        local.set $l50
        local.get $l43
        local.get $l49
        i32.add
        local.set $l51
        local.get $l51
        i64.load align=4
        local.set $l52
        local.get $l50
        local.get $l52
        i64.store align=4
      end
    end
    i32.const 64
    local.set $l53
    local.get $l4
    local.get $l53
    i32.add
    local.set $l54
    local.get $l54
    global.set $g0
    return)
  (func $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17hd5bb454499213d6aE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    i32.const 8
    local.set $l5
    local.get $l4
    local.get $l5
    i32.add
    local.set $l6
    local.get $l6
    local.get $p0
    call $_ZN65_$LT$alloc..string..String$u20$as$u20$core..ops..deref..Deref$GT$5deref17h1bf9d4c35bd07b86E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l7
    local.get $l4
    i32.load offset=8 align=1
    local.set $l8
    local.get $l8
    local.get $l7
    local.get $p1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17h5c99f0bd4435cce9E
    local.set $l9
    i32.const 1
    local.set $l10
    local.get $l9
    local.get $l10
    i32.and
    local.set $l11
    i32.const 16
    local.set $l12
    local.get $l4
    local.get $l12
    i32.add
    local.set $l13
    local.get $l13
    global.set $g0
    local.get $l11
    return)
  (func $_ZN65_$LT$alloc..string..String$u20$as$u20$core..ops..deref..Deref$GT$5deref17h1bf9d4c35bd07b86E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    i32.const 8
    local.set $l5
    local.get $l4
    local.get $l5
    i32.add
    local.set $l6
    local.get $l6
    local.get $p1
    call $_ZN68_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..deref..Deref$GT$5deref17hc652a6105b069939E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l7
    local.get $l4
    i32.load offset=8 align=1
    local.set $l8
    local.get $l4
    local.get $l8
    local.get $l7
    call $_ZN4core3str19from_utf8_unchecked17h4bdfd4990ea8866eE
    local.get $l4
    i32.load offset=4 align=1
    local.set $l9
    local.get $l4
    i32.load align=1
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l10
    i32.store
    i32.const 16
    local.set $l11
    local.get $l4
    local.get $l11
    i32.add
    local.set $l12
    local.get $l12
    global.set $g0
    return)
  (func $_ZN3std10sys_common12os_str_bytes5Slice13from_u8_slice17he93e09493a5c00e2E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $p0
    local.get $l7
    i32.store offset=4
    local.get $p0
    local.get $l6
    i32.store
    return)
  (func $_ZN3std10sys_common12os_str_bytes5Slice8from_str17habb139fe228cbb7aE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $l5
    local.get $l6
    local.get $l7
    call $_ZN3std10sys_common12os_str_bytes5Slice13from_u8_slice17he93e09493a5c00e2E
    local.get $l5
    i32.load offset=4 align=1
    local.set $l8
    local.get $l5
    i32.load align=1
    local.set $l9
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l9
    i32.store
    i32.const 16
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    global.set $g0
    return)
  (func $_ZN4core3str19from_utf8_unchecked17h4bdfd4990ea8866eE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store
    return)
  (func $_ZN3std3env6var_os17h3361d87dce69b51fE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l5
    local.get $l7
    call $_ZN55_$LT$$RF$T$u20$as$u20$core..convert..AsRef$LT$U$GT$$GT$6as_ref17h1f11fa8938d54557E
    local.get $l5
    i32.load offset=4 align=1
    local.set $l8
    local.get $l5
    i32.load align=1
    local.set $l9
    local.get $p0
    local.get $l9
    local.get $l8
    call $_ZN3std3env7_var_os17h7939003f6f97acf3E
    i32.const 16
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    global.set $g0
    return)
  (func $_ZN3std3env7set_var17h6839b31bbc669897E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32)
    global.get $g0
    local.set $l4
    i32.const 32
    local.set $l5
    local.get $l4
    local.get $l5
    i32.sub
    local.set $l6
    local.get $l6
    global.set $g0
    local.get $l6
    local.get $p0
    i32.store offset=16
    local.get $l6
    local.get $p1
    i32.store offset=20
    local.get $l6
    local.get $p2
    i32.store offset=24
    local.get $l6
    local.get $p3
    i32.store offset=28
    i32.const 8
    local.set $l7
    local.get $l6
    local.get $l7
    i32.add
    local.set $l8
    i32.const 16
    local.set $l9
    local.get $l6
    local.get $l9
    i32.add
    local.set $l10
    local.get $l8
    local.get $l10
    call $_ZN55_$LT$$RF$T$u20$as$u20$core..convert..AsRef$LT$U$GT$$GT$6as_ref17h1f11fa8938d54557E
    local.get $l6
    i32.load offset=12 align=1
    local.set $l11
    local.get $l6
    i32.load offset=8 align=1
    local.set $l12
    i32.const 24
    local.set $l13
    local.get $l6
    local.get $l13
    i32.add
    local.set $l14
    local.get $l6
    local.get $l14
    call $_ZN55_$LT$$RF$T$u20$as$u20$core..convert..AsRef$LT$U$GT$$GT$6as_ref17h1f11fa8938d54557E
    local.get $l6
    i32.load offset=4 align=1
    local.set $l15
    local.get $l6
    i32.load align=1
    local.set $l16
    local.get $l12
    local.get $l11
    local.get $l16
    local.get $l15
    call $_ZN3std3env8_set_var17h43a480d4c418a9c2E
    i32.const 32
    local.set $l17
    local.get $l6
    local.get $l17
    i32.add
    local.set $l18
    local.get $l18
    global.set $g0
    return)
  (func $_ZN63_$LT$I$u20$as$u20$core..iter..traits..collect..IntoIterator$GT$9into_iter17h483247e02e300287E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i64) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64)
    local.get $p1
    i64.load align=4
    local.set $l2
    local.get $p0
    local.get $l2
    i64.store align=4
    i32.const 8
    local.set $l3
    local.get $p0
    local.get $l3
    i32.add
    local.set $l4
    local.get $p1
    local.get $l3
    i32.add
    local.set $l5
    local.get $l5
    i64.load align=4
    local.set $l6
    local.get $l4
    local.get $l6
    i64.store align=4
    return)
  (func $_ZN3std2rt10lang_start17ha4f1b80a9031c720E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 1048880
    local.set $l6
    local.get $l6
    local.set $l7
    i32.const 12
    local.set $l8
    local.get $l5
    local.get $l8
    i32.add
    local.set $l9
    local.get $l9
    local.set $l10
    local.get $l5
    local.get $p0
    i32.store offset=12
    local.get $l10
    local.get $l7
    local.get $p1
    local.get $p2
    call $_ZN3std2rt19lang_start_internal17hd4a196bff64bdcb8E
    local.set $l11
    i32.const 16
    local.set $l12
    local.get $l5
    local.get $l12
    i32.add
    local.set $l13
    local.get $l13
    global.set $g0
    local.get $l11
    return)
  (func $_ZN3std2rt10lang_start28_$u7b$$u7b$closure$u7d$$u7d$17hb49bfe9f25a93432E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.load
    local.set $l1
    local.get $l1
    call_indirect (type $t0) $T0
    call $_ZN54_$LT$$LP$$RP$$u20$as$u20$std..process..Termination$GT$6report17hd6d7ee3649f82dbeE
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core3ptr6unique15Unique$LT$T$GT$13new_unchecked17hadfeac8bde22732cE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    local.get $p0
    i32.store offset=12
    local.get $l3
    i32.load offset=12
    local.set $l4
    local.get $l4
    return)
  (func $_ZN4core3ptr6unique15Unique$LT$T$GT$6as_ptr17h355f7df71f279253E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN4core3ptr6unique15Unique$LT$T$GT$6as_ptr17hc4e3a5ca71dccab2E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN4core10intrinsics19copy_nonoverlapping17h85a77e423534280fE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    i32.const 24
    local.set $l3
    local.get $p2
    local.get $l3
    i32.mul
    local.set $l4
    local.get $p1
    local.get $p0
    local.get $l4
    call $memcpy
    drop
    return)
  (func $_ZN4core3num12NonZeroUsize13new_unchecked17ha48e33c221a2b92dE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    local.get $p0
    i32.store offset=12
    local.get $l3
    i32.load offset=12
    local.set $l4
    local.get $l4
    return)
  (func $_ZN4core3num12NonZeroUsize3get17h6f6d1e76207ee927E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN55_$LT$$RF$T$u20$as$u20$core..convert..AsRef$LT$U$GT$$GT$6as_ref17h1f11fa8938d54557E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    i32.load
    local.set $l5
    local.get $p1
    i32.load offset=4
    local.set $l6
    i32.const 8
    local.set $l7
    local.get $l4
    local.get $l7
    i32.add
    local.set $l8
    local.get $l8
    local.get $l5
    local.get $l6
    call $_ZN3std3ffi6os_str85_$LT$impl$u20$core..convert..AsRef$LT$std..ffi..os_str..OsStr$GT$$u20$for$u20$str$GT$6as_ref17hbb81930f546745e9E
    local.get $l4
    i32.load offset=12 align=1
    local.set $l9
    local.get $l4
    i32.load offset=8 align=1
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l10
    i32.store
    i32.const 16
    local.set $l11
    local.get $l4
    local.get $l11
    i32.add
    local.set $l12
    local.get $l12
    global.set $g0
    return)
  (func $_ZN59_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Alloc$GT$7dealloc17h8303ddd71cfafc4dE (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32)
    local.get $p1
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17hb8cd63bb78d6b129E
    local.set $l4
    local.get $l4
    local.get $p2
    local.get $p3
    call $_ZN5alloc5alloc7dealloc17h0cead30793056d86E
    return)
  (func $_ZN5alloc5alloc7dealloc17h0cead30793056d86E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    local.set $l8
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l8
    call $_ZN4core5alloc6Layout4size17h520cbffcf199e580E
    local.set $l9
    i32.const 8
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    local.set $l12
    local.get $l12
    call $_ZN4core5alloc6Layout5align17h3fe969e6ec61c32aE
    local.set $l13
    local.get $p0
    local.get $l9
    local.get $l13
    call $__rust_dealloc
    i32.const 16
    local.set $l14
    local.get $l5
    local.get $l14
    i32.add
    local.set $l15
    local.get $l15
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec15RawVec$LT$T$GT$14from_raw_parts17h86ac3ddd57201372E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    local.get $p1
    call $_ZN4core3ptr6unique15Unique$LT$T$GT$13new_unchecked17hadfeac8bde22732cE
    local.set $l6
    local.get $l5
    local.get $l6
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l7
    local.get $l5
    i32.load offset=12
    local.set $l8
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l7
    i32.store
    i32.const 16
    local.set $l9
    local.get $l5
    local.get $l9
    i32.add
    local.set $l10
    local.get $l10
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_layout17h4581b36d07451dc0E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32)
    global.get $g0
    local.set $l2
    i32.const 32
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    i32.load offset=4
    local.set $l5
    block $B0
      block $B1
        block $B2
          local.get $l5
          i32.eqz
          br_if $B2
          i32.const 1
          local.set $l6
          local.get $l4
          local.get $l6
          i32.store offset=24
          local.get $l4
          i32.load offset=24
          local.set $l7
          br $B1
        end
        i32.const 0
        local.set $l8
        local.get $l4
        local.get $l8
        i32.store offset=20
        br $B0
      end
      i32.const 1
      local.set $l9
      local.get $l4
      local.get $l9
      i32.store offset=28
      local.get $l4
      i32.load offset=28
      local.set $l10
      local.get $p1
      i32.load offset=4
      local.set $l11
      local.get $l10
      local.get $l11
      i32.mul
      local.set $l12
      i32.const 8
      local.set $l13
      local.get $l4
      local.get $l13
      i32.add
      local.set $l14
      local.get $l14
      local.get $l12
      local.get $l7
      call $_ZN4core5alloc6Layout25from_size_align_unchecked17h8e195494231b3bc2E
      local.get $l4
      i32.load offset=12 align=1
      local.set $l15
      local.get $l4
      i32.load offset=8 align=1
      local.set $l16
      local.get $l4
      local.get $l16
      i32.store offset=16
      local.get $l4
      local.get $l15
      i32.store offset=20
    end
    local.get $l4
    i32.load offset=16
    local.set $l17
    local.get $l4
    i32.load offset=20
    local.set $l18
    local.get $p0
    local.get $l18
    i32.store offset=4
    local.get $p0
    local.get $l17
    i32.store
    i32.const 32
    local.set $l19
    local.get $l4
    local.get $l19
    i32.add
    local.set $l20
    local.get $l20
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_layout17h79a7fcafb0f76ddfE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32)
    global.get $g0
    local.set $l2
    i32.const 32
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $p1
    i32.load offset=4
    local.set $l5
    block $B0
      block $B1
        block $B2
          local.get $l5
          i32.eqz
          br_if $B2
          i32.const 4
          local.set $l6
          local.get $l4
          local.get $l6
          i32.store offset=24
          local.get $l4
          i32.load offset=24
          local.set $l7
          br $B1
        end
        i32.const 0
        local.set $l8
        local.get $l4
        local.get $l8
        i32.store offset=20
        br $B0
      end
      i32.const 24
      local.set $l9
      local.get $l4
      local.get $l9
      i32.store offset=28
      local.get $l4
      i32.load offset=28
      local.set $l10
      local.get $p1
      i32.load offset=4
      local.set $l11
      local.get $l10
      local.get $l11
      i32.mul
      local.set $l12
      i32.const 8
      local.set $l13
      local.get $l4
      local.get $l13
      i32.add
      local.set $l14
      local.get $l14
      local.get $l12
      local.get $l7
      call $_ZN4core5alloc6Layout25from_size_align_unchecked17h8e195494231b3bc2E
      local.get $l4
      i32.load offset=12 align=1
      local.set $l15
      local.get $l4
      i32.load offset=8 align=1
      local.set $l16
      local.get $l4
      local.get $l16
      i32.store offset=16
      local.get $l4
      local.get $l15
      i32.store offset=20
    end
    local.get $l4
    i32.load offset=16
    local.set $l17
    local.get $l4
    i32.load offset=20
    local.set $l18
    local.get $p0
    local.get $l18
    i32.store offset=4
    local.get $p0
    local.get $l17
    i32.store
    i32.const 32
    local.set $l19
    local.get $l4
    local.get $l19
    i32.add
    local.set $l20
    local.get $l20
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14dealloc_buffer17h50884fb6ccb56584E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i32) (local $l30 i32)
    global.get $g0
    local.set $l1
    i32.const 32
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    i32.const 24
    local.set $l4
    local.get $l3
    local.get $l4
    i32.store offset=28
    local.get $l3
    i32.load offset=28
    local.set $l5
    block $B0
      local.get $l5
      i32.eqz
      br_if $B0
      i32.const 8
      local.set $l6
      local.get $l3
      local.get $l6
      i32.add
      local.set $l7
      local.get $l7
      local.get $p0
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_layout17h79a7fcafb0f76ddfE
      local.get $l3
      i32.load offset=8 align=1
      local.set $l8
      local.get $l3
      i32.load offset=12 align=1
      local.set $l9
      local.get $l3
      local.get $l9
      i32.store offset=20
      local.get $l3
      local.get $l8
      i32.store offset=16
      i32.const 1
      local.set $l10
      i32.const 0
      local.set $l11
      local.get $l3
      i32.load offset=20
      local.set $l12
      local.get $l12
      local.set $l13
      local.get $l11
      local.set $l14
      local.get $l13
      local.get $l14
      i32.le_u
      local.set $l15
      i32.const 1
      local.set $l16
      local.get $l15
      local.get $l16
      i32.and
      local.set $l17
      local.get $l11
      local.get $l10
      local.get $l17
      select
      local.set $l18
      local.get $l18
      local.set $l19
      local.get $l10
      local.set $l20
      local.get $l19
      local.get $l20
      i32.eq
      local.set $l21
      i32.const 1
      local.set $l22
      local.get $l21
      local.get $l22
      i32.and
      local.set $l23
      block $B1
        local.get $l23
        i32.eqz
        br_if $B1
        local.get $l3
        i32.load offset=16
        local.set $l24
        local.get $l3
        i32.load offset=20
        local.set $l25
        local.get $p0
        i32.load
        local.set $l26
        local.get $l26
        call $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17h5e468774acf6424dE
        local.set $l27
        local.get $l27
        call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$4cast17he3ae0f2f94f61ce4E
        local.set $l28
        local.get $p0
        local.get $l28
        local.get $l24
        local.get $l25
        call $_ZN59_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Alloc$GT$7dealloc17h8303ddd71cfafc4dE
      end
    end
    i32.const 32
    local.set $l29
    local.get $l3
    local.get $l29
    i32.add
    local.set $l30
    local.get $l30
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14dealloc_buffer17he4e8cfd729ec6471E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i32) (local $l30 i32)
    global.get $g0
    local.set $l1
    i32.const 32
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    i32.const 1
    local.set $l4
    local.get $l3
    local.get $l4
    i32.store offset=28
    local.get $l3
    i32.load offset=28
    local.set $l5
    block $B0
      local.get $l5
      i32.eqz
      br_if $B0
      i32.const 8
      local.set $l6
      local.get $l3
      local.get $l6
      i32.add
      local.set $l7
      local.get $l7
      local.get $p0
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14current_layout17h4581b36d07451dc0E
      local.get $l3
      i32.load offset=8 align=1
      local.set $l8
      local.get $l3
      i32.load offset=12 align=1
      local.set $l9
      local.get $l3
      local.get $l9
      i32.store offset=20
      local.get $l3
      local.get $l8
      i32.store offset=16
      i32.const 1
      local.set $l10
      i32.const 0
      local.set $l11
      local.get $l3
      i32.load offset=20
      local.set $l12
      local.get $l12
      local.set $l13
      local.get $l11
      local.set $l14
      local.get $l13
      local.get $l14
      i32.le_u
      local.set $l15
      i32.const 1
      local.set $l16
      local.get $l15
      local.get $l16
      i32.and
      local.set $l17
      local.get $l11
      local.get $l10
      local.get $l17
      select
      local.set $l18
      local.get $l18
      local.set $l19
      local.get $l10
      local.set $l20
      local.get $l19
      local.get $l20
      i32.eq
      local.set $l21
      i32.const 1
      local.set $l22
      local.get $l21
      local.get $l22
      i32.and
      local.set $l23
      block $B1
        local.get $l23
        i32.eqz
        br_if $B1
        local.get $l3
        i32.load offset=16
        local.set $l24
        local.get $l3
        i32.load offset=20
        local.set $l25
        local.get $p0
        i32.load
        local.set $l26
        local.get $l26
        call $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17hcac4bc373eb6a68bE
        local.set $l27
        local.get $l27
        call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$4cast17he6f243a11a7ada32E
        local.set $l28
        local.get $p0
        local.get $l28
        local.get $l24
        local.get $l25
        call $_ZN59_$LT$alloc..alloc..Global$u20$as$u20$core..alloc..Alloc$GT$7dealloc17h8303ddd71cfafc4dE
      end
    end
    i32.const 32
    local.set $l29
    local.get $l3
    local.get $l29
    i32.add
    local.set $l30
    local.get $l30
    global.set $g0
    return)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$3ptr17h4c3a8a0d9a0d05b9E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.load
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr6unique15Unique$LT$T$GT$6as_ptr17h355f7df71f279253E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h334b5f09608c17c9E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14dealloc_buffer17he4e8cfd729ec6471E
    return)
  (func $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hce8d337e67c90451E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$14dealloc_buffer17h50884fb6ccb56584E
    return)
  (func $_ZN4core3ptr20slice_from_raw_parts17h9531ee5ff3154f46E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $l5
    local.get $l6
    i32.store
    local.get $l5
    local.get $l7
    i32.store offset=4
    local.get $l5
    i32.load
    local.set $l8
    local.get $l5
    i32.load offset=4
    local.set $l9
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l8
    i32.store
    return)
  (func $_ZN4core3ptr24slice_from_raw_parts_mut17h375fc51e9d160b2cE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $p2
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $l5
    local.get $l6
    i32.store
    local.get $l5
    local.get $l7
    i32.store offset=4
    local.get $l5
    i32.load
    local.set $l8
    local.get $l5
    i32.load offset=4
    local.set $l9
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l8
    i32.store
    return)
  (func $_ZN4core3ptr31_$LT$impl$u20$$BP$mut$u20$T$GT$7is_null17hbdaa8b9440c3ba9bE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    i32.const 0
    local.set $l1
    local.get $p0
    local.set $l2
    local.get $l1
    local.set $l3
    local.get $l2
    local.get $l3
    i32.eq
    local.set $l4
    i32.const 1
    local.set $l5
    local.get $l4
    local.get $l5
    i32.and
    local.set $l6
    local.get $l6
    return)
  (func $_ZN4core3ptr4read17h5c8ea3f222d9540aE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i64) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i64) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i64) (local $l27 i64) (local $l28 i32) (local $l29 i32) (local $l30 i32) (local $l31 i64) (local $l32 i32) (local $l33 i32) (local $l34 i32) (local $l35 i64) (local $l36 i64) (local $l37 i32) (local $l38 i32) (local $l39 i32) (local $l40 i64) (local $l41 i32) (local $l42 i32) (local $l43 i32) (local $l44 i64) (local $l45 i32) (local $l46 i32)
    global.get $g0
    local.set $l2
    i32.const 80
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    i32.const 8
    local.set $l5
    local.get $l4
    local.get $l5
    i32.add
    local.set $l6
    local.get $l6
    local.set $l7
    i32.const 1
    local.set $l8
    local.get $p1
    local.get $l7
    local.get $l8
    call $_ZN4core10intrinsics19copy_nonoverlapping17h85a77e423534280fE
    i32.const 56
    local.set $l9
    local.get $l4
    local.get $l9
    i32.add
    local.set $l10
    local.get $l10
    local.set $l11
    i32.const 32
    local.set $l12
    local.get $l4
    local.get $l12
    i32.add
    local.set $l13
    local.get $l13
    local.set $l14
    i32.const 8
    local.set $l15
    local.get $l4
    local.get $l15
    i32.add
    local.set $l16
    local.get $l16
    local.set $l17
    local.get $l17
    i64.load align=4
    local.set $l18
    local.get $l14
    local.get $l18
    i64.store align=4
    i32.const 16
    local.set $l19
    local.get $l14
    local.get $l19
    i32.add
    local.set $l20
    local.get $l17
    local.get $l19
    i32.add
    local.set $l21
    local.get $l21
    i64.load align=4
    local.set $l22
    local.get $l20
    local.get $l22
    i64.store align=4
    i32.const 8
    local.set $l23
    local.get $l14
    local.get $l23
    i32.add
    local.set $l24
    local.get $l17
    local.get $l23
    i32.add
    local.set $l25
    local.get $l25
    i64.load align=4
    local.set $l26
    local.get $l24
    local.get $l26
    i64.store align=4
    local.get $l14
    i64.load align=4
    local.set $l27
    local.get $l11
    local.get $l27
    i64.store align=4
    i32.const 16
    local.set $l28
    local.get $l11
    local.get $l28
    i32.add
    local.set $l29
    local.get $l14
    local.get $l28
    i32.add
    local.set $l30
    local.get $l30
    i64.load align=4
    local.set $l31
    local.get $l29
    local.get $l31
    i64.store align=4
    i32.const 8
    local.set $l32
    local.get $l11
    local.get $l32
    i32.add
    local.set $l33
    local.get $l14
    local.get $l32
    i32.add
    local.set $l34
    local.get $l34
    i64.load align=4
    local.set $l35
    local.get $l33
    local.get $l35
    i64.store align=4
    local.get $l11
    i64.load align=4
    local.set $l36
    local.get $p0
    local.get $l36
    i64.store align=4
    i32.const 16
    local.set $l37
    local.get $p0
    local.get $l37
    i32.add
    local.set $l38
    local.get $l11
    local.get $l37
    i32.add
    local.set $l39
    local.get $l39
    i64.load align=4
    local.set $l40
    local.get $l38
    local.get $l40
    i64.store align=4
    i32.const 8
    local.set $l41
    local.get $p0
    local.get $l41
    i32.add
    local.set $l42
    local.get $l11
    local.get $l41
    i32.add
    local.set $l43
    local.get $l43
    i64.load align=4
    local.set $l44
    local.get $l42
    local.get $l44
    i64.store align=4
    i32.const 80
    local.set $l45
    local.get $l4
    local.get $l45
    i32.add
    local.set $l46
    local.get $l46
    global.set $g0
    return)
  (func $_ZN66_$LT$core..option..Option$LT$T$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h70f2344e80fb15b6E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32) (local $l17 i32) (local $l18 i32) (local $l19 i32) (local $l20 i32) (local $l21 i32) (local $l22 i32) (local $l23 i32) (local $l24 i32) (local $l25 i32) (local $l26 i32) (local $l27 i32) (local $l28 i32) (local $l29 i32) (local $l30 i32) (local $l31 i32) (local $l32 i32) (local $l33 i32) (local $l34 i32) (local $l35 i32) (local $l36 i32) (local $l37 i32) (local $l38 i32) (local $l39 i32) (local $l40 i32) (local $l41 i32) (local $l42 i32) (local $l43 i32) (local $l44 i32) (local $l45 i32) (local $l46 i32)
    global.get $g0
    local.set $l2
    i32.const 48
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    local.get $l4
    global.set $g0
    local.get $l4
    local.get $p0
    i32.store offset=12
    local.get $l4
    i32.load offset=12
    local.set $l5
    local.get $l5
    i32.load
    local.set $l6
    i32.const 0
    local.set $l7
    local.get $l6
    local.get $l7
    i32.ne
    local.set $l8
    block $B0
      block $B1
        block $B2
          local.get $l8
          br_table $B2 $B1 $B2
        end
        i32.const 16
        local.set $l9
        local.get $l4
        local.get $l9
        i32.add
        local.set $l10
        local.get $l10
        local.set $l11
        i32.const 1048924
        local.set $l12
        local.get $l12
        local.set $l13
        i32.const 4
        local.set $l14
        local.get $l11
        local.get $p1
        local.get $l13
        local.get $l14
        call $_ZN4core3fmt9Formatter11debug_tuple17hc44365651ef7edf1E
        i32.const 16
        local.set $l15
        local.get $l4
        local.get $l15
        i32.add
        local.set $l16
        local.get $l16
        local.set $l17
        local.get $l17
        call $_ZN4core3fmt8builders10DebugTuple6finish17h7c2a8b3deddc969cE
        local.set $l18
        i32.const 1
        local.set $l19
        local.get $l18
        local.get $l19
        i32.and
        local.set $l20
        local.get $l4
        local.get $l20
        i32.store8 offset=11
        br $B0
      end
      i32.const 32
      local.set $l21
      local.get $l4
      local.get $l21
      i32.add
      local.set $l22
      local.get $l22
      local.set $l23
      i32.const 1048904
      local.set $l24
      local.get $l24
      local.set $l25
      i32.const 4
      local.set $l26
      local.get $l4
      i32.load offset=12
      local.set $l27
      local.get $l23
      local.get $p1
      local.get $l25
      local.get $l26
      call $_ZN4core3fmt9Formatter11debug_tuple17hc44365651ef7edf1E
      i32.const 32
      local.set $l28
      local.get $l4
      local.get $l28
      i32.add
      local.set $l29
      local.get $l29
      local.set $l30
      i32.const 1048908
      local.set $l31
      local.get $l31
      local.set $l32
      i32.const 44
      local.set $l33
      local.get $l4
      local.get $l33
      i32.add
      local.set $l34
      local.get $l34
      local.set $l35
      local.get $l4
      local.get $l27
      i32.store offset=44
      local.get $l30
      local.get $l35
      local.get $l32
      call $_ZN4core3fmt8builders10DebugTuple5field17hdc280f3f5bcd284bE
      drop
      i32.const 32
      local.set $l36
      local.get $l4
      local.get $l36
      i32.add
      local.set $l37
      local.get $l37
      local.set $l38
      local.get $l38
      call $_ZN4core3fmt8builders10DebugTuple6finish17h7c2a8b3deddc969cE
      local.set $l39
      i32.const 1
      local.set $l40
      local.get $l39
      local.get $l40
      i32.and
      local.set $l41
      local.get $l4
      local.get $l41
      i32.store8 offset=11
    end
    local.get $l4
    i32.load8_u offset=11
    local.set $l42
    i32.const 1
    local.set $l43
    local.get $l42
    local.get $l43
    i32.and
    local.set $l44
    i32.const 48
    local.set $l45
    local.get $l4
    local.get $l45
    i32.add
    local.set $l46
    local.get $l46
    global.set $g0
    local.get $l44
    return
    unreachable)
  (func $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17h5e468774acf6424dE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr6unique15Unique$LT$T$GT$6as_ptr17hc4e3a5ca71dccab2E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h2bd646b5abbb5d32E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h2bd646b5abbb5d32E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    local.get $p0
    i32.store offset=12
    local.get $l3
    i32.load offset=12
    local.set $l4
    local.get $l4
    return)
  (func $_ZN119_$LT$core..ptr..non_null..NonNull$LT$T$GT$$u20$as$u20$core..convert..From$LT$core..ptr..unique..Unique$LT$T$GT$$GT$$GT$4from17hcac4bc373eb6a68bE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr6unique15Unique$LT$T$GT$6as_ptr17h355f7df71f279253E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h13f96b59d79ca173E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h13f96b59d79ca173E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    local.get $p0
    i32.store offset=12
    local.get $l3
    i32.load offset=12
    local.set $l4
    local.get $l4
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$4cast17he3ae0f2f94f61ce4E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17h07187c673bcaba91E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h13f96b59d79ca173E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17h07187c673bcaba91E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$4cast17he6f243a11a7ada32E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17hb8cd63bb78d6b129E
    local.set $l1
    local.get $l1
    call $_ZN4core3ptr8non_null16NonNull$LT$T$GT$13new_unchecked17h13f96b59d79ca173E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN4core3ptr8non_null16NonNull$LT$T$GT$6as_ptr17hb8cd63bb78d6b129E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    return)
  (func $_ZN4core5slice14from_raw_parts17hbd253abd1a2952e3E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    local.get $p1
    local.get $p2
    call $_ZN4core3ptr20slice_from_raw_parts17h9531ee5ff3154f46E
    local.get $l5
    i32.load offset=12 align=1
    local.set $l8
    local.get $l5
    i32.load offset=8 align=1
    local.set $l9
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l9
    i32.store
    i32.const 16
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    global.set $g0
    return)
  (func $_ZN4core5slice18from_raw_parts_mut17h7803c6edf10dab15E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    local.get $p1
    local.get $p2
    call $_ZN4core3ptr24slice_from_raw_parts_mut17h375fc51e9d160b2cE
    local.get $l5
    i32.load offset=12 align=1
    local.set $l8
    local.get $l5
    i32.load offset=8 align=1
    local.set $l9
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l9
    i32.store
    i32.const 16
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    global.set $g0
    return)
  (func $_ZN4core5slice77_$LT$impl$u20$core..ops..index..IndexMut$LT$I$GT$$u20$for$u20$$u5b$T$u5d$$GT$9index_mut17hc733c55ac7a44c31E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    local.get $p1
    local.get $p2
    call $_ZN90_$LT$core..ops..range..RangeFull$u20$as$u20$core..slice..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17h15488e8e0a1b6a9fE
    local.get $l5
    i32.load offset=12 align=1
    local.set $l8
    local.get $l5
    i32.load offset=8 align=1
    local.set $l9
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l9
    i32.store
    i32.const 16
    local.set $l10
    local.get $l5
    local.get $l10
    i32.add
    local.set $l11
    local.get $l11
    global.set $g0
    return)
  (func $_ZN3std3ffi6os_str5OsStr10from_inner17h234cc387295dc731E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store
    return)
  (func $_ZN3std3ffi6os_str85_$LT$impl$u20$core..convert..AsRef$LT$std..ffi..os_str..OsStr$GT$$u20$for$u20$str$GT$6as_ref17hbb81930f546745e9E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    i32.const 8
    local.set $l6
    local.get $l5
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    local.get $p1
    local.get $p2
    call $_ZN3std10sys_common12os_str_bytes5Slice8from_str17habb139fe228cbb7aE
    local.get $l5
    i32.load offset=12 align=1
    local.set $l8
    local.get $l5
    i32.load offset=8 align=1
    local.set $l9
    local.get $l5
    local.get $l9
    local.get $l8
    call $_ZN3std3ffi6os_str5OsStr10from_inner17h234cc387295dc731E
    local.get $l5
    i32.load offset=4 align=1
    local.set $l10
    local.get $l5
    i32.load align=1
    local.set $l11
    local.get $p0
    local.get $l10
    i32.store offset=4
    local.get $p0
    local.get $l11
    i32.store
    i32.const 16
    local.set $l12
    local.get $l5
    local.get $l12
    i32.add
    local.set $l13
    local.get $l13
    global.set $g0
    return)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h988f253729519155E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    local.get $p0
    i32.load
    local.set $l2
    local.get $l2
    local.get $p1
    call $_ZN55_$LT$std..path..PathBuf$u20$as$u20$core..fmt..Debug$GT$3fmt17h496cc8f02947c32eE
    local.set $l3
    i32.const 1
    local.set $l4
    local.get $l3
    local.get $l4
    i32.and
    local.set $l5
    local.get $l5
    return)
  (func $_ZN4core3ptr33_$LT$impl$u20$$BP$const$u20$T$GT$6offset17h96744d777fc21e56E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    global.get $g0
    local.set $l2
    i32.const 16
    local.set $l3
    local.get $l2
    local.get $l3
    i32.sub
    local.set $l4
    i32.const 24
    local.set $l5
    local.get $p1
    local.get $l5
    i32.mul
    local.set $l6
    local.get $p0
    local.get $l6
    i32.add
    local.set $l7
    local.get $l4
    local.get $l7
    i32.store offset=12
    local.get $l4
    i32.load offset=12
    local.set $l8
    local.get $l8
    return)
  (func $_ZN4core3fmt10ArgumentV13new17h04d3527cc51883cbE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    local.get $p2
    i32.store offset=8
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    local.get $p1
    i32.store offset=12
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $l5
    local.get $l7
    i32.store
    local.get $l5
    local.get $l6
    i32.store offset=4
    local.get $l5
    i32.load
    local.set $l8
    local.get $l5
    i32.load offset=4
    local.set $l9
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l8
    i32.store
    return)
  (func $_ZN4core3fmt10ArgumentV13new17hd4f8852b746eab15E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    local.get $p2
    i32.store offset=8
    local.get $l5
    i32.load offset=8
    local.set $l6
    local.get $l5
    local.get $p1
    i32.store offset=12
    local.get $l5
    i32.load offset=12
    local.set $l7
    local.get $l5
    local.get $l7
    i32.store
    local.get $l5
    local.get $l6
    i32.store offset=4
    local.get $l5
    i32.load
    local.set $l8
    local.get $l5
    i32.load offset=4
    local.set $l9
    local.get $p0
    local.get $l9
    i32.store offset=4
    local.get $p0
    local.get $l8
    i32.store
    return)
  (func $_ZN4core3fmt9Arguments6new_v117he071214f04fa293dE (type $t11) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32)
    (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    global.get $g0
    local.set $l5
    i32.const 16
    local.set $l6
    local.get $l5
    local.get $l6
    i32.sub
    local.set $l7
    i32.const 0
    local.set $l8
    local.get $l7
    local.get $l8
    i32.store offset=8
    local.get $p0
    local.get $p1
    i32.store
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $l7
    i32.load offset=8
    local.set $l9
    local.get $l7
    i32.load offset=12
    local.set $l10
    local.get $p0
    local.get $l9
    i32.store offset=8
    local.get $p0
    local.get $l10
    i32.store offset=12
    local.get $p0
    local.get $p3
    i32.store offset=16
    local.get $p0
    local.get $p4
    i32.store offset=20
    return)
  (func $_ZN4core3mem6zeroed17h3b286d6d1c4ae049E (type $t1) (param $p0 i32)
    (local $l1 i64) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    i64.const 0
    local.set $l1
    local.get $p0
    local.get $l1
    i64.store align=4
    i32.const 16
    local.set $l2
    local.get $p0
    local.get $l2
    i32.add
    local.set $l3
    local.get $l3
    local.get $l1
    i64.store align=4
    i32.const 8
    local.set $l4
    local.get $p0
    local.get $l4
    i32.add
    local.set $l5
    local.get $l5
    local.get $l1
    i64.store align=4
    return)
  (func $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17h095d160050d76d50E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    local.get $p0
    i32.load
    local.set $l4
    local.get $l4
    call $_ZN4core3ops8function6FnOnce9call_once17h18a37bb770587d62E
    local.set $l5
    i32.const 16
    local.set $l6
    local.get $l3
    local.get $l6
    i32.add
    local.set $l7
    local.get $l7
    global.set $g0
    local.get $l5
    return)
  (func $_ZN4core3ops8function6FnOnce9call_once17h18a37bb770587d62E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    i32.const 4
    local.set $l4
    local.get $l3
    local.get $l4
    i32.add
    local.set $l5
    local.get $l5
    local.set $l6
    local.get $l3
    local.get $p0
    i32.store offset=4
    local.get $l6
    call $_ZN3std2rt10lang_start28_$u7b$$u7b$closure$u7d$$u7d$17hb49bfe9f25a93432E
    local.set $l7
    i32.const 16
    local.set $l8
    local.get $l3
    local.get $l8
    i32.add
    local.set $l9
    local.get $l9
    global.set $g0
    local.get $l7
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h17fc7c4de9633c70E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    i32.const 0
    local.set $l1
    i32.const 1
    local.set $l2
    local.get $p0
    i32.load
    local.set $l3
    local.get $l3
    local.set $l4
    local.get $l1
    local.set $l5
    local.get $l4
    local.get $l5
    i32.le_u
    local.set $l6
    i32.const 1
    local.set $l7
    local.get $l6
    local.get $l7
    i32.and
    local.set $l8
    local.get $l1
    local.get $l2
    local.get $l8
    select
    local.set $l9
    block $B0
      local.get $l9
      i32.eqz
      br_if $B0
      local.get $p0
      call $_ZN4core3ptr18real_drop_in_place17h4f0b8e111cc426fcE
    end
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h4f0b8e111cc426fcE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17hd291015c619f7384E
    i32.const 12
    local.set $l1
    local.get $p0
    local.get $l1
    i32.add
    local.set $l2
    local.get $l2
    call $_ZN4core3ptr18real_drop_in_place17hd291015c619f7384E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h25f87f55c457e171E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN66_$LT$alloc..vec..Vec$LT$T$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h8b64b9032986cad7E
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17h6a7027b210660a71E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h6a7027b210660a71E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17h334b5f09608c17c9E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h2c9a6044485496c0E (type $t1) (param $p0 i32)
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h355dd14be8a65886E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17h72effa7875983a35E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h72effa7875983a35E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17hde743e5aed6ebd55E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h37aac323d6234dcaE (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN77_$LT$alloc..raw_vec..RawVec$LT$T$C$A$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hce8d337e67c90451E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hd291015c619f7384E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17h7f5117f34b307ccfE
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h606ea166c6b8ddeaE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17hbaed0630ff0cc972E
    i32.const 12
    local.set $l1
    local.get $p0
    local.get $l1
    i32.add
    local.set $l2
    local.get $l2
    call $_ZN4core3ptr18real_drop_in_place17hbaed0630ff0cc972E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hbaed0630ff0cc972E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17h25f87f55c457e171E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hde743e5aed6ebd55E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17hea1690b6bb597d70E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h7ea229907c1005d3E (type $t1) (param $p0 i32)
    return)
  (func $_ZN4core3ptr18real_drop_in_place17h7f5117f34b307ccfE (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN4core3ptr18real_drop_in_place17h25f87f55c457e171E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hd4b0464c12950ff0E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    i32.const 0
    local.set $l1
    i32.const 1
    local.set $l2
    local.get $p0
    i32.load
    local.set $l3
    local.get $l3
    local.set $l4
    local.get $l1
    local.set $l5
    local.get $l4
    local.get $l5
    i32.le_u
    local.set $l6
    i32.const 1
    local.set $l7
    local.get $l6
    local.get $l7
    i32.and
    local.set $l8
    local.get $l1
    local.get $l2
    local.get $l8
    select
    local.set $l9
    block $B0
      local.get $l9
      i32.eqz
      br_if $B0
      local.get $p0
      call $_ZN4core3ptr18real_drop_in_place17hd291015c619f7384E
    end
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hea1690b6bb597d70E (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN71_$LT$alloc..vec..IntoIter$LT$T$GT$$u20$as$u20$core..ops..drop..Drop$GT$4drop17hf4afc067e3dcdf93E
    return)
  (func $_ZN4core3ptr18real_drop_in_place17hf276b60e84bfb47aE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    i32.const 0
    local.set $l1
    i32.const 1
    local.set $l2
    local.get $p0
    i32.load
    local.set $l3
    local.get $l3
    local.set $l4
    local.get $l1
    local.set $l5
    local.get $l4
    local.get $l5
    i32.le_u
    local.set $l6
    i32.const 1
    local.set $l7
    local.get $l6
    local.get $l7
    i32.and
    local.set $l8
    local.get $l1
    local.get $l2
    local.get $l8
    select
    local.set $l9
    block $B0
      local.get $l9
      i32.eqz
      br_if $B0
      local.get $p0
      call $_ZN4core3ptr18real_drop_in_place17h606ea166c6b8ddeaE
    end
    return)
  (func $_ZN4core5alloc6Layout25from_size_align_unchecked17h8e195494231b3bc2E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    global.get $g0
    local.set $l3
    i32.const 16
    local.set $l4
    local.get $l3
    local.get $l4
    i32.sub
    local.set $l5
    local.get $l5
    global.set $g0
    local.get $p2
    call $_ZN4core3num12NonZeroUsize13new_unchecked17ha48e33c221a2b92dE
    local.set $l6
    local.get $l5
    local.get $p1
    i32.store offset=8
    local.get $l5
    local.get $l6
    i32.store offset=12
    local.get $l5
    i32.load offset=8
    local.set $l7
    local.get $l5
    i32.load offset=12
    local.set $l8
    local.get $p0
    local.get $l8
    i32.store offset=4
    local.get $p0
    local.get $l7
    i32.store
    i32.const 16
    local.set $l9
    local.get $l5
    local.get $l9
    i32.add
    local.set $l10
    local.get $l10
    global.set $g0
    return)
  (func $_ZN4core5alloc6Layout4size17h520cbffcf199e580E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    local.get $p0
    i32.load
    local.set $l1
    local.get $l1
    return)
  (func $_ZN4core5alloc6Layout5align17h3fe969e6ec61c32aE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.load offset=4
    local.set $l1
    local.get $l1
    call $_ZN4core3num12NonZeroUsize3get17h6f6d1e76207ee927E
    local.set $l2
    local.get $l2
    return)
  (func $_ZN54_$LT$$LP$$RP$$u20$as$u20$std..process..Termination$GT$6report17hd6d7ee3649f82dbeE (type $t10) (result i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32)
    i32.const 0
    local.set $l0
    i32.const 1
    local.set $l1
    local.get $l0
    local.get $l1
    i32.and
    local.set $l2
    local.get $l2
    call $_ZN68_$LT$std..process..ExitCode$u20$as$u20$std..process..Termination$GT$6report17hd42ff694cac0d210E
    local.set $l3
    local.get $l3
    return)
  (func $_ZN68_$LT$std..process..ExitCode$u20$as$u20$std..process..Termination$GT$6report17hd42ff694cac0d210E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    global.get $g0
    local.set $l1
    i32.const 16
    local.set $l2
    local.get $l1
    local.get $l2
    i32.sub
    local.set $l3
    local.get $l3
    global.set $g0
    i32.const 15
    local.set $l4
    local.get $l3
    local.get $l4
    i32.add
    local.set $l5
    local.get $l5
    local.set $l6
    local.get $p0
    local.set $l7
    local.get $l3
    local.get $l7
    i32.store8 offset=15
    local.get $l6
    call $_ZN3std3sys4wasi7process8ExitCode6as_i3217hbe10eb2788ccea0eE
    local.set $l8
    i32.const 16
    local.set $l9
    local.get $l3
    local.get $l9
    i32.add
    local.set $l10
    local.get $l10
    global.set $g0
    local.get $l8
    return)
  (func $_ZN90_$LT$core..ops..range..RangeFull$u20$as$u20$core..slice..SliceIndex$LT$$u5b$T$u5d$$GT$$GT$9index_mut17h15488e8e0a1b6a9fE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store
    return)
  (func $__rust_alloc (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    local.get $p0
    local.get $p1
    call $__rdl_alloc
    local.set $l2
    local.get $l2
    return)
  (func $__rust_dealloc (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p1
    local.get $p2
    call $__rdl_dealloc
    return)
  (func $__rust_realloc (type $t9) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (result i32)
    (local $l4 i32)
    local.get $p0
    local.get $p1
    local.get $p2
    local.get $p3
    call $__rdl_realloc
    local.set $l4
    local.get $l4
    return)
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h1e27867f537310e6E (type $t2) (param $p0 i32) (result i64)
    i64.const 1326275122736511237)
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h91a38a0fc041fb55E (type $t2) (param $p0 i32) (result i64)
    i64.const 1229646359891580772)
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hfe16b6f7d37344e8E (type $t2) (param $p0 i32) (result i64)
    i64.const -1497958795881926081)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h08139e7d88af447cE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.set $p0
    block $B0
      local.get $p1
      call $_ZN4core3fmt9Formatter15debug_lower_hex17h5c8baa961fce1ff1E
      br_if $B0
      block $B1
        local.get $p1
        call $_ZN4core3fmt9Formatter15debug_upper_hex17h9d77f5d478fc94a1E
        br_if $B1
        local.get $p0
        local.get $p1
        call $_ZN4core3fmt3num3imp51_$LT$impl$u20$core..fmt..Display$u20$for$u20$u8$GT$3fmt17h1c6088ff968b7edaE
        return
      end
      local.get $p0
      local.get $p1
      call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i8$GT$3fmt17hb4fc7b6daa976529E
      return
    end
    local.get $p0
    local.get $p1
    call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i8$GT$3fmt17h4742f67e24ed992fE)
  (func $_ZN73_$LT$std..sys_common..os_str_bytes..Slice$u20$as$u20$core..fmt..Debug$GT$3fmt17h4c537bfb2d616e72E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 1
    local.set $l4
    block $B0
      local.get $p2
      i32.const 1050100
      i32.const 1
      call $_ZN4core3fmt9Formatter9write_str17ha1697ce05c7e7a6cE
      br_if $B0
      local.get $l3
      i32.const 8
      i32.add
      local.get $p0
      local.get $p1
      call $_ZN4core3str5lossy9Utf8Lossy10from_bytes17h87ecc792cefcf2c6E
      local.get $l3
      local.get $l3
      i32.load offset=8
      local.get $l3
      i32.load offset=12
      call $_ZN4core3str5lossy9Utf8Lossy6chunks17h5764855599d7f6efE
      local.get $l3
      local.get $l3
      i64.load
      i64.store offset=16
      local.get $l3
      i32.const 40
      i32.add
      local.get $l3
      i32.const 16
      i32.add
      call $_ZN96_$LT$core..str..lossy..Utf8LossyChunksIter$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h61f6ad47ee0a8c50E
      block $B1
        local.get $l3
        i32.load offset=40
        local.tee $l4
        i32.eqz
        br_if $B1
        local.get $l3
        i32.const 48
        i32.add
        local.set $l5
        local.get $l3
        i32.const 64
        i32.add
        local.set $l6
        loop $L2
          local.get $l3
          i32.load offset=52
          local.set $l7
          local.get $l3
          i32.load offset=48
          local.set $l8
          local.get $l3
          i32.load offset=44
          local.set $p0
          local.get $l3
          i32.const 4
          i32.store offset=64
          local.get $l3
          i32.const 4
          i32.store offset=48
          local.get $l3
          local.get $l4
          i32.store offset=40
          local.get $l3
          local.get $l4
          local.get $p0
          i32.add
          i32.store offset=44
          i32.const 4
          local.set $l4
          block $B3
            loop $L4
              block $B5
                block $B6
                  block $B7
                    block $B8
                      block $B9
                        block $B10
                          block $B11
                            block $B12
                              block $B13
                                block $B14
                                  block $B15
                                    block $B16
                                      local.get $l4
                                      i32.const 4
                                      i32.eq
                                      br_if $B16
                                      local.get $l5
                                      call $_ZN82_$LT$core..char..EscapeDebug$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17heb2b2e39f0d95f01E
                                      local.tee $l4
                                      i32.const 1114112
                                      i32.ne
                                      br_if $B15
                                    end
                                    block $B17
                                      local.get $l3
                                      i32.load offset=40
                                      local.tee $l4
                                      local.get $l3
                                      i32.load offset=44
                                      local.tee $p0
                                      i32.eq
                                      br_if $B17
                                      local.get $l3
                                      local.get $l4
                                      i32.const 1
                                      i32.add
                                      local.tee $l9
                                      i32.store offset=40
                                      block $B18
                                        block $B19
                                          local.get $l4
                                          i32.load8_s
                                          local.tee $p1
                                          i32.const -1
                                          i32.le_s
                                          br_if $B19
                                          local.get $p1
                                          i32.const 255
                                          i32.and
                                          local.set $p0
                                          br $B18
                                        end
                                        block $B20
                                          block $B21
                                            local.get $l9
                                            local.get $p0
                                            i32.ne
                                            br_if $B21
                                            i32.const 0
                                            local.set $l4
                                            local.get $p0
                                            local.set $l9
                                            br $B20
                                          end
                                          local.get $l3
                                          local.get $l4
                                          i32.const 2
                                          i32.add
                                          local.tee $l9
                                          i32.store offset=40
                                          local.get $l4
                                          i32.load8_u offset=1
                                          i32.const 63
                                          i32.and
                                          local.set $l4
                                        end
                                        local.get $p1
                                        i32.const 31
                                        i32.and
                                        local.set $l10
                                        block $B22
                                          local.get $p1
                                          i32.const 255
                                          i32.and
                                          local.tee $p1
                                          i32.const 223
                                          i32.gt_u
                                          br_if $B22
                                          local.get $l4
                                          local.get $l10
                                          i32.const 6
                                          i32.shl
                                          i32.or
                                          local.set $p0
                                          br $B18
                                        end
                                        block $B23
                                          block $B24
                                            local.get $l9
                                            local.get $p0
                                            i32.ne
                                            br_if $B24
                                            i32.const 0
                                            local.set $l9
                                            local.get $p0
                                            local.set $l11
                                            br $B23
                                          end
                                          local.get $l3
                                          local.get $l9
                                          i32.const 1
                                          i32.add
                                          local.tee $l11
                                          i32.store offset=40
                                          local.get $l9
                                          i32.load8_u
                                          i32.const 63
                                          i32.and
                                          local.set $l9
                                        end
                                        local.get $l9
                                        local.get $l4
                                        i32.const 6
                                        i32.shl
                                        i32.or
                                        local.set $l4
                                        block $B25
                                          local.get $p1
                                          i32.const 240
                                          i32.ge_u
                                          br_if $B25
                                          local.get $l4
                                          local.get $l10
                                          i32.const 12
                                          i32.shl
                                          i32.or
                                          local.set $p0
                                          br $B18
                                        end
                                        block $B26
                                          block $B27
                                            local.get $l11
                                            local.get $p0
                                            i32.ne
                                            br_if $B27
                                            i32.const 0
                                            local.set $p0
                                            br $B26
                                          end
                                          local.get $l3
                                          local.get $l11
                                          i32.const 1
                                          i32.add
                                          i32.store offset=40
                                          local.get $l11
                                          i32.load8_u
                                          i32.const 63
                                          i32.and
                                          local.set $p0
                                        end
                                        local.get $l4
                                        i32.const 6
                                        i32.shl
                                        local.get $l10
                                        i32.const 18
                                        i32.shl
                                        i32.const 1835008
                                        i32.and
                                        i32.or
                                        local.get $p0
                                        i32.or
                                        local.set $p0
                                      end
                                      i32.const 2
                                      local.set $l4
                                      local.get $p0
                                      i32.const -9
                                      i32.add
                                      local.tee $l9
                                      i32.const 30
                                      i32.le_u
                                      br_if $B12
                                      local.get $p0
                                      i32.const 92
                                      i32.eq
                                      br_if $B10
                                      local.get $p0
                                      i32.const 1114112
                                      i32.ne
                                      br_if $B11
                                    end
                                    local.get $l3
                                    i32.load offset=64
                                    i32.const 4
                                    i32.eq
                                    br_if $B14
                                    local.get $l6
                                    call $_ZN82_$LT$core..char..EscapeDebug$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17heb2b2e39f0d95f01E
                                    local.tee $l4
                                    i32.const 1114112
                                    i32.eq
                                    br_if $B14
                                  end
                                  local.get $p2
                                  local.get $l4
                                  call $_ZN57_$LT$core..fmt..Formatter$u20$as$u20$core..fmt..Write$GT$10write_char17he5bfc0a827fcc1c8E
                                  br_if $B13
                                  local.get $l3
                                  i32.load offset=48
                                  local.set $l4
                                  br $L4
                                end
                                loop $L28
                                  local.get $l7
                                  i32.eqz
                                  br_if $B3
                                  local.get $l3
                                  local.get $l8
                                  i32.store offset=28
                                  local.get $l3
                                  i32.const 1
                                  i32.store offset=60
                                  local.get $l3
                                  i32.const 1
                                  i32.store offset=52
                                  local.get $l3
                                  i32.const 1051400
                                  i32.store offset=48
                                  local.get $l3
                                  i32.const 1
                                  i32.store offset=44
                                  local.get $l3
                                  i32.const 1051392
                                  i32.store offset=40
                                  local.get $l3
                                  i32.const 9
                                  i32.store offset=36
                                  local.get $l7
                                  i32.const -1
                                  i32.add
                                  local.set $l7
                                  local.get $l8
                                  i32.const 1
                                  i32.add
                                  local.set $l8
                                  local.get $l3
                                  local.get $l3
                                  i32.const 32
                                  i32.add
                                  i32.store offset=56
                                  local.get $l3
                                  local.get $l3
                                  i32.const 28
                                  i32.add
                                  i32.store offset=32
                                  local.get $p2
                                  local.get $l3
                                  i32.const 40
                                  i32.add
                                  call $_ZN4core3fmt9Formatter9write_fmt17h82e7776a00521c64E
                                  i32.eqz
                                  br_if $L28
                                end
                              end
                              i32.const 1
                              local.set $l4
                              br $B0
                            end
                            i32.const 116
                            local.set $p1
                            block $B29
                              local.get $l9
                              br_table $B5 $B7 $B11 $B11 $B29 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B11 $B10 $B11 $B11 $B11 $B11 $B10 $B5
                            end
                            i32.const 114
                            local.set $p1
                            br $B6
                          end
                          block $B30
                            local.get $p0
                            call $_ZN4core7unicode6tables16derived_property15Grapheme_Extend17he2d071185c45b8b5E
                            i32.eqz
                            br_if $B30
                            local.get $p0
                            i32.const 1
                            i32.or
                            i32.clz
                            i32.const 2
                            i32.shr_u
                            i32.const 7
                            i32.xor
                            i64.extend_i32_u
                            i64.const 21474836480
                            i64.or
                            local.set $l12
                            br $B8
                          end
                          i32.const 1
                          local.set $l4
                          local.get $p0
                          call $_ZN4core7unicode9printable12is_printable17h3288c8d52298f4e7E
                          i32.eqz
                          br_if $B9
                        end
                        local.get $p0
                        local.set $p1
                        br $B5
                      end
                      local.get $p0
                      i32.const 1
                      i32.or
                      i32.clz
                      i32.const 2
                      i32.shr_u
                      i32.const 7
                      i32.xor
                      i64.extend_i32_u
                      i64.const 21474836480
                      i64.or
                      local.set $l12
                    end
                    i32.const 3
                    local.set $l4
                    local.get $p0
                    local.set $p1
                    br $B5
                  end
                  i32.const 110
                  local.set $p1
                end
              end
              local.get $l3
              local.get $l12
              i64.store offset=56
              local.get $l3
              local.get $p1
              i32.store offset=52
              local.get $l3
              local.get $l4
              i32.store offset=48
              br $L4
            end
          end
          local.get $l3
          i32.const 40
          i32.add
          local.get $l3
          i32.const 16
          i32.add
          call $_ZN96_$LT$core..str..lossy..Utf8LossyChunksIter$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h61f6ad47ee0a8c50E
          local.get $l3
          i32.load offset=40
          local.tee $l4
          br_if $L2
        end
      end
      local.get $p2
      i32.const 1050100
      i32.const 1
      call $_ZN4core3fmt9Formatter9write_str17ha1697ce05c7e7a6cE
      local.set $l4
    end
    local.get $l3
    i32.const 80
    i32.add
    global.set $g0
    local.get $l4)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h9684bc776b4eae8bE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.set $p0
    block $B0
      local.get $p1
      call $_ZN4core3fmt9Formatter15debug_lower_hex17h5c8baa961fce1ff1E
      br_if $B0
      block $B1
        local.get $p1
        call $_ZN4core3fmt9Formatter15debug_upper_hex17h9d77f5d478fc94a1E
        br_if $B1
        local.get $p0
        local.get $p1
        call $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17he5d54fd99fa6dba5E
        return
      end
      local.get $p0
      local.get $p1
      call $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i32$GT$3fmt17h49bf7eda3a80c913E
      return
    end
    local.get $p0
    local.get $p1
    call $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i32$GT$3fmt17h68a811187dd0a841E)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hfcda5bc88d78d0c2E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load
    local.tee $p0
    i32.load offset=8
    local.set $l3
    local.get $p0
    i32.load
    local.set $p0
    local.get $l2
    local.get $p1
    call $_ZN4core3fmt9Formatter10debug_list17hf948ec8be33bff4bE
    block $B0
      local.get $l3
      i32.eqz
      br_if $B0
      loop $L1
        local.get $l2
        local.get $p0
        i32.store offset=12
        local.get $l2
        local.get $l2
        i32.const 12
        i32.add
        i32.const 1049000
        call $_ZN4core3fmt8builders8DebugSet5entry17h07b93b5671a0989dE
        drop
        local.get $p0
        i32.const 1
        i32.add
        local.set $p0
        local.get $l3
        i32.const -1
        i32.add
        local.tee $l3
        br_if $L1
      end
    end
    local.get $l2
    call $_ZN4core3fmt8builders9DebugList6finish17hf2c27932dd4a79beE
    local.set $p0
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h1fe4c7feb54d04f2E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=4
    local.get $p1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17h5c99f0bd4435cce9E)
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h6d8cf690c19a707dE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN60_$LT$core..panic..Location$u20$as$u20$core..fmt..Display$GT$3fmt17h4725d5f5dca9851eE)
  (func $_ZN45_$LT$$RF$T$u20$as$u20$core..fmt..UpperHex$GT$3fmt17hafd40081564230c9E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i8$GT$3fmt17hb4fc7b6daa976529E)
  (func $_ZN4core3fmt5Write10write_char17h1c4827100ae065e8E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i64) (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    i32.const 0
    i32.store offset=4
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.const 128
          i32.lt_u
          br_if $B2
          local.get $p1
          i32.const 2048
          i32.lt_u
          br_if $B1
          block $B3
            local.get $p1
            i32.const 65536
            i32.ge_u
            br_if $B3
            local.get $l2
            local.get $p1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=6
            local.get $l2
            local.get $p1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=5
            local.get $l2
            local.get $p1
            i32.const 12
            i32.shr_u
            i32.const 15
            i32.and
            i32.const 224
            i32.or
            i32.store8 offset=4
            i32.const 3
            local.set $p1
            br $B0
          end
          local.get $l2
          local.get $p1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=7
          local.get $l2
          local.get $p1
          i32.const 18
          i32.shr_u
          i32.const 240
          i32.or
          i32.store8 offset=4
          local.get $l2
          local.get $p1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=6
          local.get $l2
          local.get $p1
          i32.const 12
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=5
          i32.const 4
          local.set $p1
          br $B0
        end
        local.get $l2
        local.get $p1
        i32.store8 offset=4
        i32.const 1
        local.set $p1
        br $B0
      end
      local.get $l2
      local.get $p1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=5
      local.get $l2
      local.get $p1
      i32.const 6
      i32.shr_u
      i32.const 31
      i32.and
      i32.const 192
      i32.or
      i32.store8 offset=4
      i32.const 2
      local.set $p1
    end
    local.get $l2
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.get $l2
    i32.const 4
    i32.add
    local.get $p1
    call $_ZN3std2io5Write9write_all17h9cd275f6a8b429a6E
    i32.const 0
    local.set $p1
    block $B4
      local.get $l2
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B4
      local.get $l2
      i64.load offset=8
      local.set $l3
      block $B5
        block $B6
          i32.const 0
          br_if $B6
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B5
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B7
          local.get $p1
          i32.load offset=4
          local.tee $l4
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B7
          local.get $p1
          i32.load
          local.get $l5
          local.get $l4
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l3
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN3std2io5Write9write_all17h9cd275f6a8b429a6E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  local.get $p3
                  i32.eqz
                  br_if $B6
                  loop $L7
                    local.get $l4
                    local.get $p3
                    i32.store offset=12
                    local.get $l4
                    local.get $p2
                    i32.store offset=8
                    local.get $l4
                    i32.const 16
                    i32.add
                    i32.const 2
                    local.get $l4
                    i32.const 8
                    i32.add
                    i32.const 1
                    call $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE
                    block $B8
                      block $B9
                        local.get $l4
                        i32.load16_u offset=16
                        i32.const 1
                        i32.eq
                        br_if $B9
                        block $B10
                          local.get $l4
                          i32.load offset=20
                          local.tee $l5
                          br_if $B10
                          i32.const 28
                          i32.const 1
                          call $__rust_alloc
                          local.tee $p3
                          i32.eqz
                          br_if $B2
                          local.get $p3
                          i32.const 24
                          i32.add
                          i32.const 0
                          i32.load offset=1050654 align=1
                          i32.store align=1
                          local.get $p3
                          i32.const 16
                          i32.add
                          i32.const 0
                          i64.load offset=1050646 align=1
                          i64.store align=1
                          local.get $p3
                          i32.const 8
                          i32.add
                          i32.const 0
                          i64.load offset=1050638 align=1
                          i64.store align=1
                          local.get $p3
                          i32.const 0
                          i64.load offset=1050630 align=1
                          i64.store align=1
                          i32.const 12
                          i32.const 4
                          call $__rust_alloc
                          local.tee $p2
                          i32.eqz
                          br_if $B1
                          local.get $p2
                          i64.const 120259084316
                          i64.store offset=4 align=4
                          local.get $p2
                          local.get $p3
                          i32.store
                          i32.const 12
                          i32.const 4
                          call $__rust_alloc
                          local.tee $p3
                          br_if $B4
                          i32.const 12
                          i32.const 4
                          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                          unreachable
                        end
                        local.get $p3
                        local.get $l5
                        i32.lt_u
                        br_if $B0
                        local.get $p2
                        local.get $l5
                        i32.add
                        local.set $p2
                        local.get $p3
                        local.get $l5
                        i32.sub
                        local.set $p3
                        br $B8
                      end
                      local.get $l4
                      local.get $l4
                      i32.load16_u offset=18
                      i32.store16 offset=30
                      local.get $l4
                      i32.const 30
                      i32.add
                      call $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E
                      i32.const 65535
                      i32.and
                      local.tee $l5
                      call $_ZN3std3sys4wasi17decode_error_kind17h928243d5bc425dc3E
                      i32.const 255
                      i32.and
                      i32.const 15
                      i32.ne
                      br_if $B5
                    end
                    local.get $p3
                    br_if $L7
                  end
                end
                local.get $p0
                i32.const 3
                i32.store8
                br $B3
              end
              local.get $p0
              i32.const 0
              i32.store
              local.get $p0
              i32.const 4
              i32.add
              local.get $l5
              i32.store
              br $B3
            end
            local.get $p3
            i32.const 14
            i32.store8 offset=8
            local.get $p3
            i32.const 1050060
            i32.store offset=4
            local.get $p3
            local.get $p2
            i32.store
            local.get $p3
            local.get $l4
            i32.load16_u offset=16 align=1
            i32.store16 offset=9 align=1
            local.get $p3
            i32.const 11
            i32.add
            local.get $l4
            i32.const 16
            i32.add
            i32.const 2
            i32.add
            i32.load8_u
            i32.store8
            local.get $p0
            i32.const 4
            i32.add
            local.get $p3
            i32.store
            local.get $p0
            i32.const 2
            i32.store
          end
          local.get $l4
          i32.const 32
          i32.add
          global.set $g0
          return
        end
        i32.const 28
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    local.get $l5
    local.get $p3
    call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
    unreachable)
  (func $_ZN4core3fmt5Write10write_char17hef4c7bc74a1b5cc7E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i64) (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    i32.const 0
    i32.store offset=4
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.const 128
          i32.lt_u
          br_if $B2
          local.get $p1
          i32.const 2048
          i32.lt_u
          br_if $B1
          block $B3
            local.get $p1
            i32.const 65536
            i32.ge_u
            br_if $B3
            local.get $l2
            local.get $p1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=6
            local.get $l2
            local.get $p1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=5
            local.get $l2
            local.get $p1
            i32.const 12
            i32.shr_u
            i32.const 15
            i32.and
            i32.const 224
            i32.or
            i32.store8 offset=4
            i32.const 3
            local.set $p1
            br $B0
          end
          local.get $l2
          local.get $p1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=7
          local.get $l2
          local.get $p1
          i32.const 18
          i32.shr_u
          i32.const 240
          i32.or
          i32.store8 offset=4
          local.get $l2
          local.get $p1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=6
          local.get $l2
          local.get $p1
          i32.const 12
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=5
          i32.const 4
          local.set $p1
          br $B0
        end
        local.get $l2
        local.get $p1
        i32.store8 offset=4
        i32.const 1
        local.set $p1
        br $B0
      end
      local.get $l2
      local.get $p1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=5
      local.get $l2
      local.get $p1
      i32.const 6
      i32.shr_u
      i32.const 31
      i32.and
      i32.const 192
      i32.or
      i32.store8 offset=4
      i32.const 2
      local.set $p1
    end
    local.get $l2
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.get $l2
    i32.const 4
    i32.add
    local.get $p1
    call $_ZN3std2io5Write9write_all17h866c64fbad2ec5f1E
    i32.const 0
    local.set $p1
    block $B4
      local.get $l2
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B4
      local.get $l2
      i64.load offset=8
      local.set $l3
      block $B5
        block $B6
          i32.const 0
          br_if $B6
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B5
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B7
          local.get $p1
          i32.load offset=4
          local.tee $l4
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B7
          local.get $p1
          i32.load
          local.get $l5
          local.get $l4
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l3
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN3std2io5Write9write_all17h866c64fbad2ec5f1E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  block $B7
                    local.get $p3
                    i32.eqz
                    br_if $B7
                    loop $L8
                      local.get $p1
                      i32.load
                      local.tee $l5
                      i32.load offset=4
                      br_if $B4
                      local.get $l5
                      i32.const -1
                      i32.store offset=4
                      local.get $l4
                      i32.const 8
                      i32.add
                      local.get $l5
                      i32.const 8
                      i32.add
                      local.get $p2
                      local.get $p3
                      call $_ZN73_$LT$std..io..buffered..LineWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h75e2b3ae5cd680cdE
                      local.get $l5
                      local.get $l5
                      i32.load offset=4
                      i32.const 1
                      i32.add
                      i32.store offset=4
                      block $B9
                        block $B10
                          local.get $l4
                          i32.load offset=8
                          i32.const 1
                          i32.eq
                          br_if $B10
                          block $B11
                            local.get $l4
                            i32.load offset=12
                            local.tee $l5
                            br_if $B11
                            i32.const 28
                            i32.const 1
                            call $__rust_alloc
                            local.tee $l5
                            i32.eqz
                            br_if $B3
                            local.get $l5
                            i32.const 24
                            i32.add
                            i32.const 0
                            i32.load offset=1050654 align=1
                            i32.store align=1
                            local.get $l5
                            i32.const 16
                            i32.add
                            i32.const 0
                            i64.load offset=1050646 align=1
                            i64.store align=1
                            local.get $l5
                            i32.const 8
                            i32.add
                            i32.const 0
                            i64.load offset=1050638 align=1
                            i64.store align=1
                            local.get $l5
                            i32.const 0
                            i64.load offset=1050630 align=1
                            i64.store align=1
                            i32.const 12
                            i32.const 4
                            call $__rust_alloc
                            local.tee $p3
                            i32.eqz
                            br_if $B2
                            local.get $p3
                            i64.const 120259084316
                            i64.store offset=4 align=4
                            local.get $p3
                            local.get $l5
                            i32.store
                            i32.const 12
                            i32.const 4
                            call $__rust_alloc
                            local.tee $l5
                            br_if $B5
                            i32.const 12
                            i32.const 4
                            call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                            unreachable
                          end
                          local.get $p3
                          local.get $l5
                          i32.lt_u
                          br_if $B1
                          local.get $p2
                          local.get $l5
                          i32.add
                          local.set $p2
                          local.get $p3
                          local.get $l5
                          i32.sub
                          local.set $p3
                          br $B9
                        end
                        block $B12
                          block $B13
                            block $B14
                              block $B15
                                local.get $l4
                                i32.load8_u offset=12
                                local.tee $l6
                                br_table $B15 $B13 $B14 $B15
                              end
                              local.get $l4
                              i32.load offset=16
                              call $_ZN3std3sys4wasi17decode_error_kind17h928243d5bc425dc3E
                              i32.const 255
                              i32.and
                              local.set $l5
                              br $B12
                            end
                            local.get $l4
                            i32.load offset=16
                            i32.load8_u offset=8
                            local.set $l5
                            br $B12
                          end
                          local.get $l4
                          i32.load8_u offset=13
                          local.set $l5
                        end
                        local.get $l5
                        i32.const 255
                        i32.and
                        i32.const 15
                        i32.ne
                        br_if $B6
                        local.get $l6
                        i32.const 2
                        i32.lt_u
                        br_if $B9
                        local.get $l4
                        i32.load offset=16
                        local.tee $l5
                        i32.load
                        local.get $l5
                        i32.load offset=4
                        i32.load
                        call_indirect (type $t1) $T0
                        block $B16
                          local.get $l5
                          i32.load offset=4
                          local.tee $l6
                          i32.load offset=4
                          local.tee $l7
                          i32.eqz
                          br_if $B16
                          local.get $l5
                          i32.load
                          local.get $l7
                          local.get $l6
                          i32.load offset=8
                          call $__rust_dealloc
                        end
                        local.get $l5
                        i32.const 12
                        i32.const 4
                        call $__rust_dealloc
                      end
                      local.get $p3
                      br_if $L8
                    end
                  end
                  local.get $p0
                  i32.const 3
                  i32.store8
                  br $B0
                end
                local.get $p0
                local.get $l4
                i64.load offset=12 align=4
                i64.store align=4
                br $B0
              end
              local.get $l5
              i32.const 14
              i32.store8 offset=8
              local.get $l5
              i32.const 1050060
              i32.store offset=4
              local.get $l5
              local.get $p3
              i32.store
              local.get $l5
              local.get $l4
              i32.load16_u offset=24 align=1
              i32.store16 offset=9 align=1
              local.get $l5
              i32.const 11
              i32.add
              local.get $l4
              i32.const 24
              i32.add
              i32.const 2
              i32.add
              i32.load8_u
              i32.store8
              local.get $p0
              i32.const 4
              i32.add
              local.get $l5
              i32.store
              local.get $p0
              i32.const 2
              i32.store
              br $B0
            end
            i32.const 1049016
            i32.const 16
            local.get $l4
            i32.const 24
            i32.add
            i32.const 1049316
            call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
            unreachable
          end
          i32.const 28
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        i32.const 12
        i32.const 4
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      local.get $l5
      local.get $p3
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $l4
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN4core3fmt5Write9write_fmt17h400b66164a24b062E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1048928
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN4core3fmt5Write9write_fmt17ha1d9a7d8628e9dedE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1048952
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN3std9panicking12default_hook17h89bc2ff7722c02f2E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64) (local $l7 i32)
    global.get $g0
    i32.const 96
    i32.sub
    local.tee $l1
    global.set $g0
    i32.const 1
    local.set $l2
    block $B0
      block $B1
        block $B2
          i32.const 0
          i32.load offset=1060264
          i32.const 1
          i32.eq
          br_if $B2
          i32.const 0
          i64.const 1
          i64.store offset=1060264
          br $B1
        end
        i32.const 0
        i32.load offset=1060268
        i32.const 1
        i32.gt_u
        br_if $B0
      end
      block $B3
        i32.const 0
        i32.load offset=1060196
        local.tee $l2
        i32.const 2
        i32.le_u
        br_if $B3
        i32.const 1
        local.set $l2
        br $B0
      end
      block $B4
        block $B5
          block $B6
            local.get $l2
            br_table $B6 $B5 $B4 $B6
          end
          local.get $l1
          i32.const 64
          i32.add
          i32.const 1049872
          i32.const 14
          call $_ZN3std3env7_var_os17h7939003f6f97acf3E
          block $B7
            block $B8
              local.get $l1
              i32.load offset=64
              local.tee $l3
              br_if $B8
              i32.const 5
              local.set $l2
              br $B7
            end
            local.get $l1
            i32.load offset=68
            local.set $l4
            block $B9
              block $B10
                local.get $l1
                i32.const 72
                i32.add
                i32.load
                i32.const -1
                i32.add
                local.tee $l2
                i32.const 3
                i32.gt_u
                br_if $B10
                block $B11
                  block $B12
                    local.get $l2
                    br_table $B12 $B10 $B10 $B11 $B12
                  end
                  i32.const 4
                  local.set $l2
                  i32.const 1
                  local.set $l5
                  local.get $l3
                  i32.const 1049886
                  i32.eq
                  br_if $B9
                  local.get $l3
                  i32.load8_u
                  i32.const 48
                  i32.ne
                  br_if $B10
                  br $B9
                end
                i32.const 1
                local.set $l2
                i32.const 3
                local.set $l5
                local.get $l3
                i32.const 1051220
                i32.eq
                br_if $B9
                local.get $l3
                i32.load align=1
                i32.const 1819047270
                i32.eq
                br_if $B9
              end
              i32.const 0
              local.set $l2
              i32.const 2
              local.set $l5
            end
            local.get $l4
            i32.eqz
            br_if $B7
            local.get $l3
            local.get $l4
            i32.const 1
            call $__rust_dealloc
          end
          i32.const 0
          i32.const 1
          local.get $l5
          local.get $l2
          i32.const 5
          i32.eq
          local.tee $l3
          select
          i32.store offset=1060196
          i32.const 4
          local.get $l2
          local.get $l3
          select
          local.set $l2
          br $B0
        end
        i32.const 4
        local.set $l2
        br $B0
      end
      i32.const 0
      local.set $l2
    end
    local.get $l1
    local.get $l2
    i32.store8 offset=35
    block $B13
      block $B14
        block $B15
          local.get $p0
          call $_ZN4core5panic9PanicInfo8location17h357305d15ad07bb1E
          local.tee $l2
          i32.eqz
          br_if $B15
          local.get $l1
          local.get $l2
          i32.store offset=36
          local.get $l1
          i32.const 24
          i32.add
          local.get $p0
          call $_ZN4core5panic8Location4file17h6490e08da345e876E
          local.get $l1
          i32.load offset=24
          local.tee $l2
          local.get $l1
          i32.load offset=28
          i32.load offset=12
          call_indirect (type $t2) $T0
          local.set $l6
          block $B16
            local.get $l2
            i32.eqz
            br_if $B16
            local.get $l6
            i64.const 1229646359891580772
            i64.eq
            br_if $B14
          end
          local.get $l1
          i32.const 16
          i32.add
          local.get $p0
          call $_ZN4core5panic8Location4file17h6490e08da345e876E
          local.get $l1
          i32.load offset=16
          local.tee $l2
          local.get $l1
          i32.load offset=20
          i32.load offset=12
          call_indirect (type $t2) $T0
          local.set $l6
          i32.const 8
          local.set $p0
          i32.const 1051504
          local.set $l5
          block $B17
            local.get $l2
            i32.eqz
            br_if $B17
            local.get $l6
            i64.const -1497958795881926081
            i64.ne
            br_if $B17
            local.get $l2
            i32.load offset=8
            local.set $p0
            local.get $l2
            i32.load
            local.set $l5
          end
          local.get $l1
          local.get $l5
          i32.store offset=40
          br $B13
        end
        i32.const 1049272
        i32.const 43
        i32.const 1049212
        call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
        unreachable
      end
      local.get $l1
      local.get $l2
      i32.load
      i32.store offset=40
      local.get $l2
      i32.load offset=4
      local.set $p0
    end
    local.get $l1
    local.get $p0
    i32.store offset=44
    i32.const 0
    local.set $p0
    block $B18
      i32.const 0
      i32.load offset=1060252
      i32.const 1
      i32.eq
      br_if $B18
      i32.const 0
      i64.const 1
      i64.store offset=1060252 align=4
      i32.const 0
      i32.const 0
      i32.store offset=1060260
    end
    local.get $l1
    i32.const 1060256
    call $_ZN3std10sys_common11thread_info10ThreadInfo4with28_$u7b$$u7b$closure$u7d$$u7d$17h96d355bc87cdff06E
    local.tee $l2
    i32.store offset=52
    block $B19
      block $B20
        block $B21
          local.get $l2
          i32.load offset=16
          local.tee $l5
          br_if $B21
          br $B20
        end
        local.get $l2
        i32.const 16
        i32.add
        i32.const 0
        local.get $l5
        select
        local.tee $p0
        i32.load offset=4
        local.tee $l3
        i32.const -1
        i32.add
        local.set $l5
        local.get $l3
        i32.eqz
        br_if $B19
        local.get $p0
        i32.load
        local.set $p0
      end
      local.get $l1
      local.get $l5
      i32.const 9
      local.get $p0
      select
      i32.store offset=60
      local.get $l1
      local.get $p0
      i32.const 1051512
      local.get $p0
      select
      i32.store offset=56
      local.get $l1
      local.get $l1
      i32.const 35
      i32.add
      i32.store offset=76
      local.get $l1
      local.get $l1
      i32.const 36
      i32.add
      i32.store offset=72
      local.get $l1
      local.get $l1
      i32.const 40
      i32.add
      i32.store offset=68
      local.get $l1
      local.get $l1
      i32.const 56
      i32.add
      i32.store offset=64
      i32.const 0
      local.set $l3
      local.get $l1
      i32.const 8
      i32.add
      i32.const 0
      local.get $l1
      call $_ZN3std2io5stdio9set_panic17h0fe36b48db669fb3E
      local.get $l1
      i32.load offset=12
      local.set $l5
      block $B22
        block $B23
          local.get $l1
          i32.load offset=8
          local.tee $p0
          i32.eqz
          br_if $B23
          local.get $l1
          local.get $l5
          i32.store offset=84
          local.get $l1
          local.get $p0
          i32.store offset=80
          local.get $l1
          i32.const 64
          i32.add
          local.get $l1
          i32.const 80
          i32.add
          i32.const 1051560
          call $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h6b1ecc93fccebbd3E
          local.get $l1
          local.get $l1
          i32.load offset=80
          local.get $l1
          i32.load offset=84
          call $_ZN3std2io5stdio9set_panic17h0fe36b48db669fb3E
          block $B24
            local.get $l1
            i32.load
            local.tee $l3
            i32.eqz
            br_if $B24
            local.get $l3
            local.get $l1
            i32.load offset=4
            local.tee $l4
            i32.load
            call_indirect (type $t1) $T0
            local.get $l4
            i32.load offset=4
            local.tee $l7
            i32.eqz
            br_if $B24
            local.get $l3
            local.get $l7
            local.get $l4
            i32.load offset=8
            call $__rust_dealloc
          end
          i32.const 1
          local.set $l3
          br $B22
        end
        local.get $l1
        i32.const 64
        i32.add
        local.get $l1
        i32.const 88
        i32.add
        i32.const 1051524
        call $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h6b1ecc93fccebbd3E
      end
      local.get $l2
      local.get $l2
      i32.load
      local.tee $l4
      i32.const -1
      i32.add
      i32.store
      block $B25
        local.get $l4
        i32.const 1
        i32.ne
        br_if $B25
        local.get $l1
        i32.const 52
        i32.add
        call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
      end
      block $B26
        local.get $p0
        i32.const 0
        i32.ne
        local.get $l3
        i32.const 1
        i32.xor
        i32.and
        i32.eqz
        br_if $B26
        local.get $p0
        local.get $l5
        i32.load
        call_indirect (type $t1) $T0
        local.get $l5
        i32.load offset=4
        local.tee $l2
        i32.eqz
        br_if $B26
        local.get $p0
        local.get $l2
        local.get $l5
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $l1
      i32.const 96
      i32.add
      global.set $g0
      return
    end
    local.get $l5
    i32.const 0
    call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
    unreachable)
  (func $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17h3507ea750df20edeE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.load
    i32.store offset=12
    local.get $l2
    i32.const 12
    i32.add
    local.get $p1
    call $_ZN3std4sync4once4Once9call_once28_$u7b$$u7b$closure$u7d$$u7d$17hceefbeec1c95b3e0E
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0)
  (func $_ZN3std4sync4once4Once9call_once28_$u7b$$u7b$closure$u7d$$u7d$17hceefbeec1c95b3e0E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    local.get $p0
    i32.load
    local.tee $p0
    i32.load8_u
    local.set $l2
    local.get $p0
    i32.const 0
    i32.store8
    block $B0
      local.get $l2
      i32.const 1
      i32.and
      i32.eqz
      br_if $B0
      i32.const 1
      local.set $l3
      loop $L1
        block $B2
          block $B3
            block $B4
              block $B5
                i32.const 0
                i32.load8_u offset=1060273
                br_if $B5
                i32.const 0
                i32.load offset=1060192
                local.set $l4
                i32.const 0
                local.get $l3
                i32.const 10
                i32.eq
                i32.store offset=1060192
                i32.const 0
                i32.const 0
                i32.store8 offset=1060273
                block $B6
                  local.get $l4
                  i32.const 1
                  i32.gt_u
                  br_if $B6
                  block $B7
                    local.get $l4
                    br_table $B2 $B7 $B2
                  end
                  i32.const 1051072
                  i32.const 31
                  i32.const 1051056
                  call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
                  unreachable
                end
                local.get $l4
                i32.load
                local.tee $l5
                local.get $l4
                i32.load offset=8
                local.tee $l2
                i32.const 3
                i32.shl
                i32.add
                local.set $l6
                local.get $l4
                i32.load offset=4
                local.set $l7
                local.get $l5
                local.set $p0
                local.get $l2
                i32.eqz
                br_if $B4
                local.get $l5
                local.set $p0
                loop $L8
                  block $B9
                    local.get $p0
                    i32.load
                    local.tee $l2
                    br_if $B9
                    local.get $p0
                    i32.const 8
                    i32.add
                    local.set $p0
                    br $B4
                  end
                  local.get $l2
                  local.get $p0
                  i32.const 4
                  i32.add
                  i32.load
                  call $_ZN83_$LT$alloc..boxed..Box$LT$F$GT$$u20$as$u20$core..ops..function..FnOnce$LT$A$GT$$GT$9call_once17hbba9c8bb6b59dc21E
                  local.get $p0
                  i32.const 8
                  i32.add
                  local.tee $p0
                  local.get $l6
                  i32.ne
                  br_if $L8
                  br $B3
                end
              end
              i32.const 1052132
              i32.const 32
              i32.const 1052116
              call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
              unreachable
            end
            local.get $p0
            local.get $l6
            i32.eq
            br_if $B3
            loop $L10
              local.get $p0
              i32.load
              local.tee $l2
              i32.eqz
              br_if $B3
              local.get $l2
              local.get $p0
              i32.const 4
              i32.add
              i32.load
              local.tee $l8
              i32.load
              call_indirect (type $t1) $T0
              block $B11
                local.get $l8
                i32.load offset=4
                local.tee $l9
                i32.eqz
                br_if $B11
                local.get $l2
                local.get $l9
                local.get $l8
                i32.load offset=8
                call $__rust_dealloc
              end
              local.get $p0
              i32.const 8
              i32.add
              local.tee $p0
              local.get $l6
              i32.ne
              br_if $L10
            end
          end
          block $B12
            local.get $l7
            i32.eqz
            br_if $B12
            local.get $l5
            local.get $l7
            i32.const 3
            i32.shl
            i32.const 4
            call $__rust_dealloc
          end
          local.get $l4
          i32.const 12
          i32.const 4
          call $__rust_dealloc
        end
        local.get $l3
        local.get $l3
        i32.const 10
        i32.lt_u
        local.tee $p0
        i32.add
        local.set $l3
        local.get $p0
        br_if $L1
      end
      return
    end
    i32.const 1049272
    i32.const 43
    i32.const 1049212
    call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
    unreachable)
  (func $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    local.get $p1
    i32.store offset=12
    local.get $l3
    local.get $p0
    i32.store offset=8
    local.get $l3
    i32.const 8
    i32.add
    i32.const 1051780
    i32.const 0
    local.get $p2
    call $_ZN3std9panicking20rust_panic_with_hook17he4dc0f0856de48d3E
    unreachable)
  (func $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17hc7322906b9351a18E (type $t1) (param $p0 i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.load
      local.tee $p0
      i32.load8_u offset=4
      br_if $B0
      local.get $p0
      i32.const 0
      i32.store8 offset=4
      local.get $p0
      i32.load
      local.set $l1
      local.get $p0
      i32.const 1
      i32.store
      local.get $l1
      i32.load
      local.tee $p0
      local.get $p0
      i32.load
      local.tee $p0
      i32.const -1
      i32.add
      i32.store
      block $B1
        local.get $p0
        i32.const 1
        i32.ne
        br_if $B1
        local.get $l1
        call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17he8fdb3a02dfeef57E
      end
      local.get $l1
      i32.const 4
      i32.const 4
      call $__rust_dealloc
      return
    end
    i32.const 1052132
    i32.const 32
    i32.const 1052116
    call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
    unreachable)
  (func $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17he8fdb3a02dfeef57E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $p0
    i32.load
    local.tee $l2
    i32.const 16
    i32.add
    local.set $l3
    block $B0
      local.get $l2
      i32.const 28
      i32.add
      i32.load8_u
      i32.const 2
      i32.eq
      br_if $B0
      local.get $l2
      i32.const 29
      i32.add
      i32.load8_u
      br_if $B0
      local.get $l1
      i32.const 8
      i32.add
      local.get $l3
      call $_ZN3std2io8buffered18BufWriter$LT$W$GT$9flush_buf17hef650b0a0b674a49E
      block $B1
        i32.const 0
        br_if $B1
        local.get $l1
        i32.load8_u offset=8
        i32.const 2
        i32.ne
        br_if $B0
      end
      local.get $l1
      i32.load offset=12
      local.tee $l4
      i32.load
      local.get $l4
      i32.load offset=4
      i32.load
      call_indirect (type $t1) $T0
      block $B2
        local.get $l4
        i32.load offset=4
        local.tee $l5
        i32.load offset=4
        local.tee $l6
        i32.eqz
        br_if $B2
        local.get $l4
        i32.load
        local.get $l6
        local.get $l5
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $l4
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    block $B3
      local.get $l2
      i32.const 20
      i32.add
      i32.load
      local.tee $l2
      i32.eqz
      br_if $B3
      local.get $l3
      i32.load
      local.get $l2
      i32.const 1
      call $__rust_dealloc
    end
    local.get $p0
    i32.load
    local.tee $l2
    local.get $l2
    i32.load offset=4
    local.tee $l2
    i32.const -1
    i32.add
    i32.store offset=4
    block $B4
      local.get $l2
      i32.const 1
      i32.ne
      br_if $B4
      local.get $p0
      i32.load
      i32.const 40
      i32.const 4
      call $__rust_dealloc
    end
    local.get $l1
    i32.const 16
    i32.add
    global.set $g0)
  (func $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17hf451a8ca87320706E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    block $B0
      block $B1
        local.get $p2
        i32.load
        i32.const 1
        i32.ne
        br_if $B1
        i32.const 1051224
        local.set $p2
        i32.const 9
        local.set $l4
        br $B0
      end
      local.get $l3
      i32.const 16
      i32.add
      local.get $p2
      i32.load offset=4
      local.get $p2
      i32.const 8
      i32.add
      i32.load
      call $_ZN4core3str9from_utf817h5f5991ab7674ad2aE
      i32.const 1051224
      local.get $l3
      i32.load offset=20
      local.get $l3
      i32.load offset=16
      i32.const 1
      i32.eq
      local.tee $l4
      select
      local.set $p2
      i32.const 9
      local.get $l3
      i32.const 16
      i32.add
      i32.const 8
      i32.add
      i32.load
      local.get $l4
      select
      local.set $l4
    end
    local.get $l3
    i32.const 8
    i32.add
    local.get $p2
    local.get $l4
    call $_ZN4core3str5lossy9Utf8Lossy10from_bytes17h87ecc792cefcf2c6E
    local.get $l3
    i32.load offset=8
    local.get $l3
    i32.load offset=12
    local.get $p1
    call $_ZN66_$LT$core..str..lossy..Utf8Lossy$u20$as$u20$core..fmt..Display$GT$3fmt17hb36124806d3524c1E
    local.set $p2
    block $B2
      local.get $p0
      i32.load
      local.tee $p1
      i32.eqz
      br_if $B2
      local.get $p0
      i32.load offset=4
      local.tee $p0
      i32.eqz
      br_if $B2
      local.get $p1
      local.get $p0
      i32.const 1
      call $__rust_dealloc
    end
    local.get $l3
    i32.const 32
    i32.add
    global.set $g0
    local.get $p2)
  (func $_ZN4core3ptr18real_drop_in_place17h013771f2bf388bb9E (type $t1) (param $p0 i32))
  (func $_ZN4core3ptr18real_drop_in_place17h063c309cff0257b2E (type $t1) (param $p0 i32))
  (func $_ZN4core3ptr18real_drop_in_place17h066cb17c6cf89873E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    block $B0
      block $B1
        i32.const 0
        br_if $B1
        local.get $p0
        i32.load8_u offset=4
        i32.const 2
        i32.ne
        br_if $B0
      end
      local.get $p0
      i32.const 8
      i32.add
      i32.load
      local.tee $l1
      i32.load
      local.get $l1
      i32.load offset=4
      i32.load
      call_indirect (type $t1) $T0
      block $B2
        local.get $l1
        i32.load offset=4
        local.tee $l2
        i32.load offset=4
        local.tee $l3
        i32.eqz
        br_if $B2
        local.get $l1
        i32.load
        local.get $l3
        local.get $l2
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $p0
      i32.load offset=8
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end)
  (func $_ZN4core3ptr18real_drop_in_place17h0ef29dd94336095cE (type $t1) (param $p0 i32)
    block $B0
      local.get $p0
      i32.load8_u offset=4
      br_if $B0
      block $B1
        i32.const 0
        i32.load offset=1060264
        i32.const 1
        i32.eq
        br_if $B1
        i32.const 0
        i64.const 1
        i64.store offset=1060264
        br $B0
      end
      i32.const 0
      i32.load offset=1060268
      i32.eqz
      br_if $B0
      local.get $p0
      i32.load
      i32.const 1
      i32.store8 offset=4
    end
    local.get $p0
    i32.load
    i32.load
    i32.const 0
    i32.store8)
  (func $_ZN4core3ptr18real_drop_in_place17h1c041de8180dc1f9E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=4
    i32.load
    call_indirect (type $t1) $T0
    block $B0
      local.get $p0
      i32.load offset=4
      local.tee $l1
      i32.load offset=4
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $p0
      i32.load
      local.get $l2
      local.get $l1
      i32.load offset=8
      call $__rust_dealloc
    end)
  (func $_ZN4core3ptr18real_drop_in_place17h366cf060a9bc4440E (type $t1) (param $p0 i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.load offset=4
      local.tee $l1
      i32.eqz
      br_if $B0
      local.get $p0
      i32.load
      local.get $l1
      i32.const 1
      call $__rust_dealloc
    end)
  (func $_ZN4core3ptr18real_drop_in_place17h48b90d0474eebb6aE (type $t1) (param $p0 i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.const 8
      i32.add
      i32.load
      local.tee $l1
      i32.eqz
      br_if $B0
      local.get $p0
      i32.load offset=4
      local.get $l1
      i32.const 1
      call $__rust_dealloc
    end)
  (func $_ZN4core3ptr18real_drop_in_place17h546135adb32a6610E (type $t1) (param $p0 i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.load
      local.tee $l1
      i32.eqz
      br_if $B0
      local.get $p0
      i32.load offset=4
      local.tee $p0
      i32.eqz
      br_if $B0
      local.get $l1
      local.get $p0
      i32.const 1
      call $__rust_dealloc
    end)
  (func $_ZN4core3ptr18real_drop_in_place17he3b2439b3d403da0E (type $t1) (param $p0 i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.load offset=4
      local.tee $l1
      i32.eqz
      br_if $B0
      local.get $p0
      i32.const 8
      i32.add
      i32.load
      local.tee $p0
      i32.eqz
      br_if $B0
      local.get $l1
      local.get $p0
      i32.const 1
      call $__rust_dealloc
    end)
  (func $_ZN4core6option15Option$LT$T$GT$6unwrap17h6709741fa9488087E (type $t7) (param $p0 i32) (result i32)
    block $B0
      local.get $p0
      br_if $B0
      i32.const 1049272
      i32.const 43
      i32.const 1049212
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $p0)
  (func $_ZN4core6option15Option$LT$T$GT$6unwrap17hee975c3246ce38eaE (type $t7) (param $p0 i32) (result i32)
    block $B0
      local.get $p0
      br_if $B0
      i32.const 1049272
      i32.const 43
      i32.const 1049212
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $p0)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h141654bd9ea3e6d5E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN4core3fmt5Write10write_char17h1c4827100ae065e8E)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h5c47392ca2f56a2cE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load
    local.set $p0
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p1
            i32.const 128
            i32.lt_u
            br_if $B3
            local.get $l2
            i32.const 0
            i32.store offset=12
            local.get $p1
            i32.const 2048
            i32.lt_u
            br_if $B2
            block $B4
              local.get $p1
              i32.const 65536
              i32.ge_u
              br_if $B4
              local.get $l2
              local.get $p1
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=14
              local.get $l2
              local.get $p1
              i32.const 6
              i32.shr_u
              i32.const 63
              i32.and
              i32.const 128
              i32.or
              i32.store8 offset=13
              local.get $l2
              local.get $p1
              i32.const 12
              i32.shr_u
              i32.const 15
              i32.and
              i32.const 224
              i32.or
              i32.store8 offset=12
              i32.const 3
              local.set $p1
              br $B1
            end
            local.get $l2
            local.get $p1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=15
            local.get $l2
            local.get $p1
            i32.const 18
            i32.shr_u
            i32.const 240
            i32.or
            i32.store8 offset=12
            local.get $l2
            local.get $p1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get $l2
            local.get $p1
            i32.const 12
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            i32.const 4
            local.set $p1
            br $B1
          end
          block $B5
            local.get $p0
            i32.load offset=8
            local.tee $l3
            local.get $p0
            i32.load offset=4
            i32.ne
            br_if $B5
            local.get $p0
            i32.const 1
            call $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE
            local.get $p0
            i32.load offset=8
            local.set $l3
          end
          local.get $p0
          i32.load
          local.get $l3
          i32.add
          local.get $p1
          i32.store8
          local.get $p0
          local.get $p0
          i32.load offset=8
          i32.const 1
          i32.add
          i32.store offset=8
          br $B0
        end
        local.get $l2
        local.get $p1
        i32.const 63
        i32.and
        i32.const 128
        i32.or
        i32.store8 offset=13
        local.get $l2
        local.get $p1
        i32.const 6
        i32.shr_u
        i32.const 31
        i32.and
        i32.const 192
        i32.or
        i32.store8 offset=12
        i32.const 2
        local.set $p1
      end
      local.get $p0
      local.get $p1
      call $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE
      local.get $p0
      local.get $p0
      i32.load offset=8
      local.tee $l3
      local.get $p1
      i32.add
      i32.store offset=8
      local.get $l3
      local.get $p0
      i32.load
      i32.add
      local.get $l2
      i32.const 12
      i32.add
      local.get $p1
      call $memcpy
      drop
    end
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    i32.const 0)
  (func $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32)
    block $B0
      block $B1
        block $B2
          local.get $p0
          i32.load offset=4
          local.tee $l2
          local.get $p0
          i32.load offset=8
          local.tee $l3
          i32.sub
          local.get $p1
          i32.ge_u
          br_if $B2
          local.get $l3
          local.get $p1
          i32.add
          local.tee $p1
          local.get $l3
          i32.lt_u
          br_if $B0
          local.get $l2
          i32.const 1
          i32.shl
          local.tee $l3
          local.get $p1
          local.get $l3
          local.get $p1
          i32.gt_u
          select
          local.tee $p1
          i32.const 0
          i32.lt_s
          br_if $B0
          block $B3
            block $B4
              local.get $l2
              br_if $B4
              local.get $p1
              i32.const 1
              call $__rust_alloc
              local.set $l2
              br $B3
            end
            local.get $p0
            i32.load
            local.get $l2
            i32.const 1
            local.get $p1
            call $__rust_realloc
            local.set $l2
          end
          local.get $l2
          i32.eqz
          br_if $B1
          local.get $p0
          local.get $p1
          i32.store offset=4
          local.get $p0
          local.get $l2
          i32.store
        end
        return
      end
      local.get $p1
      i32.const 1
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
    unreachable)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h7478aa20d2f05f88E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN4core3fmt5Write10write_char17hef4c7bc74a1b5cc7E)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h17d122a723a1cb8aE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.load
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1048952
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h6c04b9b61dcca382E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.load
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1048928
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hfa1b405e68a915bfE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.load
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1048976
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h0ec301fb86e66d3eE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i64) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.tee $p0
    i32.load
    local.get $p1
    local.get $p2
    call $_ZN3std2io5Write9write_all17h9cd275f6a8b429a6E
    i32.const 0
    local.set $p1
    block $B0
      local.get $l3
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B0
      local.get $l3
      i64.load offset=8
      local.set $l4
      block $B1
        block $B2
          i32.const 0
          br_if $B2
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B3
          local.get $p1
          i32.load offset=4
          local.tee $p2
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B3
          local.get $p1
          i32.load
          local.get $l5
          local.get $p2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l4
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l3
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h96f656062a6232b8E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32)
    local.get $p0
    i32.load
    local.tee $p0
    local.get $p2
    call $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE
    local.get $p0
    local.get $p0
    i32.load offset=8
    local.tee $l3
    local.get $p2
    i32.add
    i32.store offset=8
    local.get $l3
    local.get $p0
    i32.load
    i32.add
    local.get $p1
    local.get $p2
    call $memcpy
    drop
    i32.const 0)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17haedbf6a67ae41aa7E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i64) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.tee $p0
    i32.load
    local.get $p1
    local.get $p2
    call $_ZN3std2io5Write9write_all17h866c64fbad2ec5f1E
    i32.const 0
    local.set $p1
    block $B0
      local.get $l3
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B0
      local.get $l3
      i64.load offset=8
      local.set $l4
      block $B1
        block $B2
          i32.const 0
          br_if $B2
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B3
          local.get $p1
          i32.load offset=4
          local.tee $p2
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B3
          local.get $p1
          i32.load
          local.get $l5
          local.get $p2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l4
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l3
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32)
    block $B0
      local.get $p0
      i32.load
      local.tee $l1
      i32.const 16
      i32.add
      i32.load
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $l2
      i32.const 0
      i32.store8
      local.get $l1
      i32.const 20
      i32.add
      i32.load
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $l1
      i32.load offset=16
      local.get $l2
      i32.const 1
      call $__rust_dealloc
    end
    local.get $l1
    i32.const 28
    i32.add
    i32.load
    i32.const 1
    i32.const 1
    call $__rust_dealloc
    local.get $p0
    i32.load
    local.tee $l1
    local.get $l1
    i32.load offset=4
    local.tee $l1
    i32.const -1
    i32.add
    i32.store offset=4
    block $B1
      local.get $l1
      i32.const 1
      i32.ne
      br_if $B1
      local.get $p0
      i32.load
      i32.const 48
      i32.const 8
      call $__rust_dealloc
    end)
  (func $_ZN3std2io8buffered18BufWriter$LT$W$GT$9flush_buf17hef650b0a0b674a49E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.load offset=8
          local.tee $l3
          br_if $B2
          i32.const 3
          local.set $l4
          br $B1
        end
        i32.const 0
        local.set $l5
        block $B3
          loop $L4
            local.get $p1
            i32.const 1
            i32.store8 offset=13
            block $B5
              block $B6
                block $B7
                  block $B8
                    local.get $p1
                    i32.load8_u offset=12
                    local.tee $l6
                    i32.const 2
                    i32.eq
                    br_if $B8
                    local.get $p1
                    i32.load offset=8
                    local.tee $l4
                    local.get $l5
                    i32.lt_u
                    br_if $B7
                    local.get $l4
                    local.get $l5
                    i32.sub
                    local.set $l4
                    block $B9
                      local.get $l6
                      i32.const 1
                      i32.eq
                      br_if $B9
                      local.get $p1
                      i32.load
                      local.set $l6
                      local.get $l2
                      local.get $l4
                      i32.store offset=12
                      local.get $l2
                      local.get $l6
                      local.get $l5
                      i32.add
                      i32.store offset=8
                      local.get $l2
                      i32.const 16
                      i32.add
                      i32.const 1
                      local.get $l2
                      i32.const 8
                      i32.add
                      i32.const 1
                      call $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE
                      block $B10
                        local.get $l2
                        i32.load16_u offset=16
                        i32.const 1
                        i32.ne
                        br_if $B10
                        local.get $l2
                        local.get $l2
                        i32.load16_u offset=18
                        i32.store16 offset=30
                        local.get $l2
                        i32.const 30
                        i32.add
                        call $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E
                        i32.const 65535
                        i32.and
                        local.tee $l6
                        i32.const 8
                        i32.eq
                        br_if $B9
                        i32.const 0
                        local.set $l4
                        local.get $p1
                        i32.const 0
                        i32.store8 offset=13
                        local.get $l6
                        call $_ZN3std3sys4wasi17decode_error_kind17h928243d5bc425dc3E
                        i32.const 255
                        i32.and
                        i32.const 15
                        i32.ne
                        br_if $B3
                        br $B5
                      end
                      local.get $l2
                      i32.load offset=20
                      local.set $l4
                    end
                    local.get $p1
                    i32.const 0
                    i32.store8 offset=13
                    local.get $l4
                    i32.eqz
                    br_if $B6
                    local.get $l4
                    local.get $l5
                    i32.add
                    local.set $l5
                    br $B5
                  end
                  i32.const 1049272
                  i32.const 43
                  i32.const 1049212
                  call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
                  unreachable
                end
                local.get $l5
                local.get $l4
                call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
                unreachable
              end
              block $B11
                block $B12
                  i32.const 33
                  i32.const 1
                  call $__rust_alloc
                  local.tee $l4
                  i32.eqz
                  br_if $B12
                  local.get $l4
                  i32.const 32
                  i32.add
                  i32.const 0
                  i32.load8_u offset=1050166
                  i32.store8
                  local.get $l4
                  i32.const 24
                  i32.add
                  i32.const 0
                  i64.load offset=1050158 align=1
                  i64.store align=1
                  local.get $l4
                  i32.const 16
                  i32.add
                  i32.const 0
                  i64.load offset=1050150 align=1
                  i64.store align=1
                  local.get $l4
                  i32.const 8
                  i32.add
                  i32.const 0
                  i64.load offset=1050142 align=1
                  i64.store align=1
                  local.get $l4
                  i32.const 0
                  i64.load offset=1050134 align=1
                  i64.store align=1
                  i32.const 12
                  i32.const 4
                  call $__rust_alloc
                  local.tee $l3
                  i32.eqz
                  br_if $B11
                  local.get $l3
                  i64.const 141733920801
                  i64.store offset=4 align=4
                  local.get $l3
                  local.get $l4
                  i32.store
                  block $B13
                    i32.const 12
                    i32.const 4
                    call $__rust_alloc
                    local.tee $l6
                    br_if $B13
                    i32.const 12
                    i32.const 4
                    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                    unreachable
                  end
                  local.get $l6
                  i32.const 14
                  i32.store8 offset=8
                  local.get $l6
                  i32.const 1050060
                  i32.store offset=4
                  local.get $l6
                  local.get $l3
                  i32.store
                  local.get $l6
                  local.get $l2
                  i32.load16_u offset=16 align=1
                  i32.store16 offset=9 align=1
                  i32.const 2
                  local.set $l4
                  local.get $l6
                  i32.const 11
                  i32.add
                  local.get $l2
                  i32.const 16
                  i32.add
                  i32.const 2
                  i32.add
                  i32.load8_u
                  i32.store8
                  br $B3
                end
                i32.const 33
                i32.const 1
                call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                unreachable
              end
              i32.const 12
              i32.const 4
              call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
              unreachable
            end
            local.get $l5
            local.get $l3
            i32.lt_u
            br_if $L4
          end
          i32.const 3
          local.set $l4
        end
        local.get $l5
        i32.eqz
        br_if $B1
        local.get $p1
        i32.load offset=8
        local.tee $l3
        local.get $l5
        i32.lt_u
        br_if $B0
        local.get $p1
        i32.const 0
        i32.store offset=8
        local.get $l3
        local.get $l5
        i32.sub
        local.tee $l3
        i32.eqz
        br_if $B1
        local.get $p1
        i32.load
        local.tee $l7
        local.get $l7
        local.get $l5
        i32.add
        local.get $l3
        call $memmove
        drop
        local.get $p1
        local.get $l3
        i32.store offset=8
      end
      local.get $p0
      local.get $l4
      i32.store
      local.get $p0
      i32.const 4
      i32.add
      local.get $l6
      i32.store
      local.get $l2
      i32.const 32
      i32.add
      global.set $g0
      return
    end
    i32.const 1049504
    i32.const 28
    i32.const 1049488
    call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
    unreachable)
  (func $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in28_$u7b$$u7b$closure$u7d$$u7d$17h014d5d43acd4cf77E (type $t0)
    call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
    unreachable)
  (func $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17ha436af5efe1b855aE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=8
    local.get $p1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17h5c99f0bd4435cce9E)
  (func $_ZN83_$LT$alloc..boxed..Box$LT$F$GT$$u20$as$u20$core..ops..function..FnOnce$LT$A$GT$$GT$9call_once17hbba9c8bb6b59dc21E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    local.tee $l2
    local.set $l3
    local.get $l2
    local.get $p1
    i32.load offset=4
    local.tee $l4
    i32.const 15
    i32.add
    i32.const -16
    i32.and
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    local.get $l4
    call $memcpy
    local.get $p1
    i32.load offset=12
    call_indirect (type $t1) $T0
    block $B0
      local.get $l4
      i32.eqz
      br_if $B0
      local.get $p0
      local.get $l4
      local.get $p1
      i32.load offset=8
      call $__rust_dealloc
    end
    local.get $l3
    global.set $g0)
  (func $_ZN3std10sys_common11thread_info10ThreadInfo4with28_$u7b$$u7b$closure$u7d$$u7d$17h96d355bc87cdff06E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l1
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p0
            i32.load
            local.tee $l2
            i32.const 1
            i32.add
            i32.const 0
            i32.le_s
            br_if $B3
            local.get $p0
            local.get $l2
            i32.store
            block $B4
              local.get $p0
              i32.load offset=4
              local.tee $l3
              br_if $B4
              local.get $l1
              i32.const 0
              i32.store offset=8
              local.get $l1
              i32.const 8
              i32.add
              call $_ZN3std6thread6Thread3new17h11ad3f31af1f9e62E
              local.set $l3
              local.get $p0
              i32.load
              br_if $B2
              local.get $p0
              i32.const -1
              i32.store
              block $B5
                local.get $p0
                i32.load offset=4
                local.tee $l2
                i32.eqz
                br_if $B5
                local.get $l2
                local.get $l2
                i32.load
                local.tee $l4
                i32.const -1
                i32.add
                i32.store
                local.get $l4
                i32.const 1
                i32.ne
                br_if $B5
                local.get $p0
                i32.const 4
                i32.add
                call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
              end
              local.get $p0
              local.get $l3
              i32.store offset=4
              local.get $p0
              local.get $p0
              i32.load
              i32.const 1
              i32.add
              local.tee $l2
              i32.store
            end
            local.get $l2
            br_if $B1
            local.get $p0
            i32.const -1
            i32.store
            local.get $l3
            local.get $l3
            i32.load
            local.tee $l2
            i32.const 1
            i32.add
            i32.store
            local.get $l2
            i32.const -1
            i32.le_s
            br_if $B0
            local.get $p0
            local.get $p0
            i32.load
            i32.const 1
            i32.add
            i32.store
            local.get $l1
            i32.const 32
            i32.add
            global.set $g0
            local.get $l3
            return
          end
          i32.const 1049032
          i32.const 24
          local.get $l1
          i32.const 24
          i32.add
          i32.const 1049332
          call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
          unreachable
        end
        i32.const 1049016
        i32.const 16
        local.get $l1
        i32.const 24
        i32.add
        i32.const 1049316
        call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
        unreachable
      end
      i32.const 1049016
      i32.const 16
      local.get $l1
      i32.const 24
      i32.add
      i32.const 1049316
      call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
      unreachable
    end
    unreachable
    unreachable)
  (func $_ZN3std6thread4park17hebe92512914c513eE (type $t0)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 96
    i32.sub
    local.tee $l0
    global.set $g0
    block $B0
      i32.const 0
      i32.load offset=1060252
      i32.const 1
      i32.eq
      br_if $B0
      i32.const 0
      i64.const 1
      i64.store offset=1060252 align=4
      i32.const 0
      i32.const 0
      i32.store offset=1060260
    end
    i32.const 1060256
    call $_ZN3std10sys_common11thread_info10ThreadInfo4with28_$u7b$$u7b$closure$u7d$$u7d$17h96d355bc87cdff06E
    local.tee $l1
    i32.const 0
    local.get $l1
    i32.load offset=24
    local.tee $l2
    local.get $l2
    i32.const 2
    i32.eq
    local.tee $l2
    select
    i32.store offset=24
    local.get $l0
    local.get $l1
    i32.store offset=8
    block $B1
      local.get $l2
      br_if $B1
      block $B2
        block $B3
          block $B4
            local.get $l0
            i32.load offset=8
            local.tee $l3
            i32.const 28
            i32.add
            local.tee $l4
            i32.load
            local.tee $l1
            i32.load8_u
            br_if $B4
            local.get $l1
            i32.const 1
            i32.store8
            i32.const 0
            local.set $l2
            block $B5
              block $B6
                i32.const 0
                i32.load offset=1060264
                i32.const 1
                i32.ne
                br_if $B6
                i32.const 0
                i32.load offset=1060268
                local.set $l2
                br $B5
              end
              i32.const 0
              i64.const 1
              i64.store offset=1060264
            end
            i32.const 0
            local.get $l2
            i32.store offset=1060268
            local.get $l3
            i32.const 32
            i32.add
            i32.load8_u
            br_if $B3
            local.get $l3
            i32.const 24
            i32.add
            local.tee $l1
            local.get $l1
            i32.load
            local.tee $l1
            i32.const 1
            local.get $l1
            select
            i32.store
            block $B7
              local.get $l1
              i32.eqz
              br_if $B7
              block $B8
                local.get $l1
                i32.const 2
                i32.eq
                br_if $B8
                i32.const 1049624
                i32.const 23
                i32.const 1049608
                call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
                unreachable
              end
              local.get $l0
              i32.load offset=8
              i32.const 24
              i32.add
              local.tee $l5
              i32.load
              local.set $l1
              local.get $l5
              i32.const 0
              i32.store
              local.get $l0
              local.get $l1
              i32.store offset=12
              local.get $l1
              i32.const 2
              i32.ne
              br_if $B2
              block $B9
                local.get $l2
                br_if $B9
                block $B10
                  i32.const 0
                  i32.load offset=1060264
                  i32.const 1
                  i32.eq
                  br_if $B10
                  i32.const 0
                  i64.const 1
                  i64.store offset=1060264
                  br $B9
                end
                i32.const 0
                i32.load offset=1060268
                i32.eqz
                br_if $B9
                local.get $l3
                i32.const 1
                i32.store8 offset=32
              end
              local.get $l4
              i32.load
              i32.const 0
              i32.store8
              br $B1
            end
            local.get $l0
            i32.load offset=8
            i32.const 36
            i32.add
            local.tee $l0
            local.get $l4
            i32.load
            local.tee $l1
            call $_ZN3std4sync7condvar7Condvar6verify17h0b5e0fb99ab5eacaE
            local.get $l0
            i32.load
            local.get $l1
            call $_ZN3std10sys_common7condvar7Condvar4wait17he850d34840cec657E
            unreachable
          end
          i32.const 1052132
          i32.const 32
          i32.const 1052116
          call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
          unreachable
        end
        local.get $l0
        local.get $l4
        i32.store offset=72
        local.get $l0
        local.get $l2
        i32.const 0
        i32.ne
        i32.store8 offset=76
        i32.const 1049364
        i32.const 43
        local.get $l0
        i32.const 72
        i32.add
        i32.const 1049424
        call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
        unreachable
      end
      local.get $l0
      i32.const 40
      i32.add
      i32.const 20
      i32.add
      i32.const 10
      i32.store
      local.get $l0
      i32.const 52
      i32.add
      i32.const 11
      i32.store
      local.get $l0
      i32.const 16
      i32.add
      i32.const 20
      i32.add
      i32.const 3
      i32.store
      local.get $l0
      local.get $l0
      i32.const 12
      i32.add
      i32.store offset=64
      local.get $l0
      i32.const 1049648
      i32.store offset=68
      local.get $l0
      i64.const 3
      i64.store offset=20 align=4
      local.get $l0
      i32.const 1049248
      i32.store offset=16
      local.get $l0
      i32.const 11
      i32.store offset=44
      local.get $l0
      i64.const 4
      i64.store offset=88
      local.get $l0
      i64.const 1
      i64.store offset=76 align=4
      local.get $l0
      i32.const 1049684
      i32.store offset=72
      local.get $l0
      local.get $l0
      i32.const 40
      i32.add
      i32.store offset=32
      local.get $l0
      local.get $l0
      i32.const 72
      i32.add
      i32.store offset=56
      local.get $l0
      local.get $l0
      i32.const 68
      i32.add
      i32.store offset=48
      local.get $l0
      local.get $l0
      i32.const 64
      i32.add
      i32.store offset=40
      local.get $l0
      i32.const 16
      i32.add
      i32.const 1049692
      call $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE
      unreachable
    end
    local.get $l0
    i32.load offset=8
    local.tee $l1
    local.get $l1
    i32.load
    local.tee $l1
    i32.const -1
    i32.add
    i32.store
    block $B11
      local.get $l1
      i32.const 1
      i32.ne
      br_if $B11
      local.get $l0
      i32.const 8
      i32.add
      call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
    end
    local.get $l0
    i32.const 96
    i32.add
    global.set $g0)
  (func $_ZN3std4sync7condvar7Condvar6verify17h0b5e0fb99ab5eacaE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    local.get $p0
    local.get $p0
    i32.load offset=4
    local.tee $l2
    local.get $p1
    local.get $l2
    select
    i32.store offset=4
    block $B0
      local.get $l2
      i32.eqz
      br_if $B0
      local.get $l2
      local.get $p1
      i32.eq
      br_if $B0
      i32.const 1050768
      i32.const 54
      i32.const 1050752
      call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
      unreachable
    end)
  (func $_ZN3std10sys_common7condvar7Condvar4wait17he850d34840cec657E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    local.get $l2
    local.get $l2
    call $_ZN3std3sys4wasi7condvar7Condvar4wait17hfeb5282b98892f36E
    unreachable)
  (func $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.load
    local.get $p1
    i32.load offset=4
    local.get $p1
    i32.load offset=8
    local.get $p1
    i32.load offset=12
    call $_ZN4core5panic8Location20internal_constructor17h8b867236d764bd5aE
    local.get $l2
    local.get $p0
    i32.store offset=24
    local.get $l2
    i32.const 1049228
    i32.store offset=20
    local.get $l2
    i32.const 1
    i32.store offset=16
    local.get $l2
    local.get $l2
    i32.store offset=28
    local.get $l2
    i32.const 16
    i32.add
    call $rust_begin_unwind
    unreachable)
  (func $_ZN3std6thread6Thread3new17h11ad3f31af1f9e62E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i64)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l1
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                local.get $p0
                i32.load
                local.tee $l2
                br_if $B5
                i32.const 0
                local.set $l3
                br $B4
              end
              local.get $l1
              local.get $p0
              i64.load offset=4 align=4
              i64.store offset=36 align=4
              local.get $l1
              local.get $l2
              i32.store offset=32
              local.get $l1
              i32.const 16
              i32.add
              local.get $l1
              i32.const 32
              i32.add
              call $_ZN5alloc6string104_$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..vec..Vec$LT$u8$GT$$GT$4from17heb92b80afb85af14E
              local.get $l1
              i32.const 8
              i32.add
              i32.const 0
              local.get $l1
              i32.load offset=16
              local.tee $p0
              local.get $l1
              i32.load offset=24
              call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
              local.get $l1
              i32.load offset=8
              br_if $B3
              local.get $l1
              i32.const 32
              i32.add
              i32.const 8
              i32.add
              local.get $l1
              i32.const 16
              i32.add
              i32.const 8
              i32.add
              i32.load
              i32.store
              local.get $l1
              local.get $l1
              i64.load offset=16
              i64.store offset=32
              local.get $l1
              local.get $l1
              i32.const 32
              i32.add
              call $_ZN3std3ffi5c_str7CString18from_vec_unchecked17h47c15de8242406d0E
              local.get $l1
              i32.load offset=4
              local.set $l4
              local.get $l1
              i32.load
              local.set $l3
            end
            i32.const 0
            i32.load8_u offset=1060272
            br_if $B2
            i32.const 0
            i32.const 1
            i32.store8 offset=1060272
            block $B6
              block $B7
                i32.const 0
                i64.load offset=1060168
                local.tee $l5
                i64.const -1
                i64.eq
                br_if $B7
                i32.const 0
                local.get $l5
                i64.const 1
                i64.add
                i64.store offset=1060168
                local.get $l5
                i64.const 0
                i64.ne
                br_if $B6
                i32.const 1049272
                i32.const 43
                i32.const 1049212
                call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
                unreachable
              end
              i32.const 1049724
              i32.const 55
              i32.const 1049708
              call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
              unreachable
            end
            i32.const 0
            i32.const 0
            i32.store8 offset=1060272
            i32.const 1
            i32.const 1
            call $__rust_alloc
            local.tee $l2
            i32.eqz
            br_if $B1
            local.get $l2
            i32.const 0
            i32.store8
            i32.const 48
            i32.const 8
            call $__rust_alloc
            local.tee $p0
            i32.eqz
            br_if $B0
            local.get $p0
            i64.const 1
            i64.store offset=36 align=4
            local.get $p0
            i32.const 0
            i32.store offset=24
            local.get $p0
            local.get $l4
            i32.store offset=20
            local.get $p0
            local.get $l3
            i32.store offset=16
            local.get $p0
            local.get $l5
            i64.store offset=8
            local.get $p0
            i64.const 4294967297
            i64.store
            local.get $p0
            local.get $l2
            i64.extend_i32_u
            i64.store offset=28 align=4
            local.get $l1
            i32.const 48
            i32.add
            global.set $g0
            local.get $p0
            return
          end
          local.get $l1
          i32.load offset=12
          local.set $l2
          local.get $l1
          i32.const 40
          i32.add
          local.get $l1
          i64.load offset=20 align=4
          i64.store
          local.get $l1
          local.get $p0
          i32.store offset=36
          local.get $l1
          local.get $l2
          i32.store offset=32
          i32.const 1049779
          i32.const 47
          local.get $l1
          i32.const 32
          i32.add
          i32.const 1049348
          call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
          unreachable
        end
        i32.const 1052132
        i32.const 32
        i32.const 1052116
        call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
        unreachable
      end
      i32.const 1
      i32.const 1
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    i32.const 48
    i32.const 8
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std3ffi5c_str7CString18from_vec_unchecked17h47c15de8242406d0E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $p1
              i32.load offset=4
              local.tee $l2
              local.get $p1
              i32.load offset=8
              local.tee $l3
              i32.ne
              br_if $B4
              local.get $l3
              i32.const 1
              i32.add
              local.tee $l2
              local.get $l3
              i32.lt_u
              br_if $B2
              local.get $l2
              i32.const 0
              i32.lt_s
              br_if $B2
              block $B5
                block $B6
                  local.get $l3
                  br_if $B6
                  local.get $l2
                  i32.const 1
                  call $__rust_alloc
                  local.set $l4
                  br $B5
                end
                local.get $p1
                i32.load
                local.get $l3
                i32.const 1
                local.get $l2
                call $__rust_realloc
                local.set $l4
              end
              local.get $l4
              i32.eqz
              br_if $B3
              local.get $p1
              local.get $l2
              i32.store offset=4
              local.get $p1
              local.get $l4
              i32.store
            end
            block $B7
              local.get $l3
              local.get $l2
              i32.ne
              br_if $B7
              local.get $p1
              i32.const 1
              call $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE
              local.get $p1
              i32.load offset=4
              local.set $l2
              local.get $p1
              i32.load offset=8
              local.set $l3
            end
            local.get $p1
            local.get $l3
            i32.const 1
            i32.add
            local.tee $l4
            i32.store offset=8
            local.get $p1
            i32.load
            local.tee $l5
            local.get $l3
            i32.add
            i32.const 0
            i32.store8
            block $B8
              local.get $l2
              local.get $l4
              i32.ne
              br_if $B8
              local.get $l5
              local.set $p1
              local.get $l2
              local.set $l4
              br $B0
            end
            local.get $l2
            local.get $l4
            i32.lt_u
            br_if $B1
            block $B9
              local.get $l4
              br_if $B9
              i32.const 0
              local.set $l4
              i32.const 1
              local.set $p1
              local.get $l2
              i32.eqz
              br_if $B0
              local.get $l5
              local.get $l2
              i32.const 1
              call $__rust_dealloc
              br $B0
            end
            local.get $l5
            local.get $l2
            i32.const 1
            local.get $l4
            call $__rust_realloc
            local.tee $p1
            br_if $B0
            local.get $l4
            i32.const 1
            call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
            unreachable
          end
          local.get $l2
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
        unreachable
      end
      i32.const 1049532
      i32.const 36
      i32.const 1049488
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $p0
    local.get $l4
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $_ZN3std6thread6Thread6unpark17hcdf1bb531de9b0e3E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $p0
    i32.load
    i32.const 24
    i32.add
    local.tee $l2
    i32.load
    local.set $l3
    local.get $l2
    i32.const 2
    i32.store
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $l3
              i32.const 2
              i32.gt_u
              br_if $B4
              local.get $l3
              br_table $B2 $B3 $B2 $B2
            end
            i32.const 1049844
            i32.const 28
            i32.const 1049828
            call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
            unreachable
          end
          local.get $p0
          i32.load
          local.tee $p0
          i32.const 28
          i32.add
          local.tee $l2
          i32.load
          local.tee $l3
          i32.load8_u
          br_if $B1
          local.get $l3
          i32.const 1
          i32.store8
          i32.const 0
          local.set $l3
          block $B5
            block $B6
              i32.const 0
              i32.load offset=1060264
              i32.const 1
              i32.ne
              br_if $B6
              i32.const 0
              i32.load offset=1060268
              local.set $l3
              br $B5
            end
            i32.const 0
            i64.const 1
            i64.store offset=1060264
          end
          i32.const 0
          local.get $l3
          i32.store offset=1060268
          local.get $p0
          i32.const 32
          i32.add
          i32.load8_u
          br_if $B0
          local.get $l2
          i32.load
          i32.const 0
          i32.store8
        end
        local.get $l1
        i32.const 16
        i32.add
        global.set $g0
        return
      end
      i32.const 1052132
      i32.const 32
      i32.const 1052116
      call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
      unreachable
    end
    local.get $l1
    local.get $l2
    i32.store offset=8
    local.get $l1
    local.get $l3
    i32.const 0
    i32.ne
    i32.store8 offset=12
    i32.const 1049364
    i32.const 43
    local.get $l1
    i32.const 8
    i32.add
    i32.const 1049424
    call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
    unreachable)
  (func $_ZN3std3env7_var_os17h7939003f6f97acf3E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    local.get $p2
    i32.store offset=28
    local.get $l3
    local.get $p1
    i32.store offset=24
    block $B0
      block $B1
        block $B2
          local.get $p2
          i32.const 1
          i32.add
          local.tee $l4
          i32.const -1
          i32.le_s
          br_if $B2
          block $B3
            block $B4
              local.get $l4
              i32.eqz
              br_if $B4
              local.get $l4
              i32.const 1
              call $__rust_alloc
              local.tee $l5
              br_if $B3
              local.get $l4
              i32.const 1
              call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
              unreachable
            end
            call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
            unreachable
          end
          i32.const 0
          local.set $l6
          local.get $l3
          i32.const 16
          i32.add
          i32.const 0
          local.get $l5
          local.get $p1
          local.get $p2
          call $memcpy
          local.tee $p1
          local.get $p2
          call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
          block $B5
            block $B6
              block $B7
                local.get $l3
                i32.load offset=16
                br_if $B7
                local.get $l3
                local.get $p2
                i32.store offset=48
                local.get $l3
                local.get $l4
                i32.store offset=44
                local.get $l3
                local.get $p1
                i32.store offset=40
                local.get $l3
                i32.const 8
                i32.add
                local.get $l3
                i32.const 40
                i32.add
                call $_ZN3std3ffi5c_str7CString18from_vec_unchecked17h47c15de8242406d0E
                local.get $l3
                i32.load offset=12
                local.set $l7
                local.get $l3
                i32.load offset=8
                local.tee $l8
                call $getenv
                local.tee $l5
                br_if $B6
                br $B5
              end
              local.get $l3
              i32.load offset=20
              local.set $l6
              local.get $l3
              i32.const 40
              i32.add
              i32.const 12
              i32.add
              local.get $p2
              i32.store
              local.get $l3
              i32.const 48
              i32.add
              local.get $l4
              i32.store
              local.get $l3
              local.get $p1
              i32.store offset=44
              local.get $l3
              local.get $l6
              i32.store offset=40
              local.get $l3
              i32.const 64
              i32.add
              local.get $l3
              i32.const 40
              i32.add
              call $_ZN3std3ffi5c_str104_$LT$impl$u20$core..convert..From$LT$std..ffi..c_str..NulError$GT$$u20$for$u20$std..io..error..Error$GT$4from17hdc70568937ca6b95E
              local.get $l3
              local.get $l3
              i64.load offset=64
              i64.store offset=32
              local.get $l3
              i32.const 60
              i32.add
              i32.const 2
              i32.store
              local.get $l3
              i32.const 64
              i32.add
              i32.const 12
              i32.add
              i32.const 12
              i32.store
              local.get $l3
              i64.const 2
              i64.store offset=44 align=4
              local.get $l3
              i32.const 1049924
              i32.store offset=40
              local.get $l3
              i32.const 13
              i32.store offset=68
              local.get $l3
              local.get $l3
              i32.const 64
              i32.add
              i32.store offset=56
              local.get $l3
              local.get $l3
              i32.const 32
              i32.add
              i32.store offset=72
              local.get $l3
              local.get $l3
              i32.const 24
              i32.add
              i32.store offset=64
              local.get $l3
              i32.const 40
              i32.add
              i32.const 1049960
              call $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE
              unreachable
            end
            block $B8
              block $B9
                block $B10
                  local.get $l5
                  i32.load8_u
                  i32.eqz
                  br_if $B10
                  local.get $l5
                  i32.const 1
                  i32.add
                  local.set $l6
                  i32.const 0
                  local.set $p2
                  loop $L11
                    local.get $l6
                    local.get $p2
                    i32.add
                    local.set $l4
                    local.get $p2
                    i32.const 1
                    i32.add
                    local.tee $p1
                    local.set $p2
                    local.get $l4
                    i32.load8_u
                    br_if $L11
                  end
                  local.get $p1
                  i32.const -1
                  i32.eq
                  br_if $B1
                  local.get $p1
                  i32.const -1
                  i32.le_s
                  br_if $B2
                  local.get $p1
                  br_if $B9
                end
                i32.const 1
                local.set $l6
                i32.const 0
                local.set $p1
                br $B8
              end
              local.get $p1
              i32.const 1
              call $__rust_alloc
              local.tee $l6
              i32.eqz
              br_if $B0
            end
            local.get $l6
            local.get $l5
            local.get $p1
            call $memcpy
            drop
            local.get $p1
            i64.extend_i32_u
            local.tee $l9
            i64.const 32
            i64.shl
            local.get $l9
            i64.or
            local.set $l9
          end
          local.get $l8
          i32.const 0
          i32.store8
          local.get $l9
          i64.const 32
          i64.shr_u
          i32.wrap_i64
          local.set $p2
          local.get $l9
          i32.wrap_i64
          local.set $l4
          block $B12
            local.get $l7
            i32.eqz
            br_if $B12
            local.get $l8
            local.get $l7
            i32.const 1
            call $__rust_dealloc
          end
          local.get $p0
          local.get $l4
          i32.store offset=4
          local.get $p0
          local.get $l6
          i32.store
          local.get $p0
          i32.const 8
          i32.add
          local.get $p2
          i32.store
          local.get $l3
          i32.const 80
          i32.add
          global.set $g0
          return
        end
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in28_$u7b$$u7b$closure$u7d$$u7d$17h014d5d43acd4cf77E
        unreachable
      end
      local.get $p1
      i32.const 0
      call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
      unreachable
    end
    local.get $p1
    i32.const 1
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std3sys4wasi11unsupported17h11b4db5af84c26cdE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l1
    global.set $g0
    block $B0
      block $B1
        block $B2
          i32.const 35
          i32.const 1
          call $__rust_alloc
          local.tee $l2
          i32.eqz
          br_if $B2
          local.get $l2
          i32.const 31
          i32.add
          i32.const 0
          i32.load offset=1052291 align=1
          i32.store align=1
          local.get $l2
          i32.const 24
          i32.add
          i32.const 0
          i64.load offset=1052284 align=1
          i64.store align=1
          local.get $l2
          i32.const 16
          i32.add
          i32.const 0
          i64.load offset=1052276 align=1
          i64.store align=1
          local.get $l2
          i32.const 8
          i32.add
          i32.const 0
          i64.load offset=1052268 align=1
          i64.store align=1
          local.get $l2
          i32.const 0
          i64.load offset=1052260 align=1
          i64.store align=1
          i32.const 12
          i32.const 4
          call $__rust_alloc
          local.tee $l3
          i32.eqz
          br_if $B1
          local.get $l3
          i64.const 150323855395
          i64.store offset=4 align=4
          local.get $l3
          local.get $l2
          i32.store
          i32.const 12
          i32.const 4
          call $__rust_alloc
          local.tee $l2
          i32.eqz
          br_if $B0
          local.get $l2
          i32.const 16
          i32.store8 offset=8
          local.get $l2
          i32.const 1050060
          i32.store offset=4
          local.get $l2
          local.get $l3
          i32.store
          local.get $l2
          local.get $l1
          i32.load16_u offset=13 align=1
          i32.store16 offset=9 align=1
          local.get $l2
          i32.const 11
          i32.add
          local.get $l1
          i32.const 15
          i32.add
          i32.load8_u
          i32.store8
          local.get $p0
          i32.const 8
          i32.add
          local.get $l2
          i32.store
          local.get $p0
          i64.const 8589934593
          i64.store align=4
          local.get $l1
          i32.const 16
          i32.add
          global.set $g0
          return
        end
        i32.const 35
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    i32.const 12
    i32.const 4
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std3env4vars17hcd9e6b77ec763c5eE (type $t1) (param $p0 i32)
    local.get $p0
    call $_ZN3std3env7vars_os17h89709872ff10819bE)
  (func $_ZN3std3env7vars_os17h89709872ff10819bE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i64)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l1
    global.set $g0
    i32.const 0
    local.set $l2
    i32.const 4
    local.set $l3
    block $B0
      block $B1
        i32.const 0
        i32.load offset=1060180
        local.tee $l4
        br_if $B1
        i32.const 0
        local.set $l5
        br $B0
      end
      i32.const 0
      local.set $l5
      local.get $l4
      i32.load
      local.tee $l6
      i32.eqz
      br_if $B0
      i32.const 0
      local.set $l2
      i32.const 0
      local.set $l5
      i32.const 4
      local.set $l3
      loop $L2
        local.get $l4
        local.set $l7
        block $B3
          local.get $l6
          i32.load8_u
          i32.eqz
          br_if $B3
          local.get $l6
          i32.const 1
          i32.add
          local.set $l8
          i32.const 0
          local.set $l4
          loop $L4
            local.get $l8
            local.get $l4
            i32.add
            local.set $l9
            local.get $l4
            i32.const 1
            i32.add
            local.tee $l10
            local.set $l4
            local.get $l9
            i32.load8_u
            br_if $L4
          end
          block $B5
            block $B6
              block $B7
                block $B8
                  block $B9
                    block $B10
                      block $B11
                        local.get $l10
                        i32.const -1
                        i32.eq
                        br_if $B11
                        local.get $l10
                        i32.eqz
                        br_if $B3
                        local.get $l1
                        i32.const 8
                        i32.add
                        i32.const 61
                        local.get $l8
                        local.get $l10
                        i32.const -1
                        i32.add
                        call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
                        local.get $l1
                        i32.load offset=8
                        i32.eqz
                        br_if $B3
                        local.get $l1
                        i32.load offset=12
                        local.tee $l9
                        i32.const 1
                        i32.add
                        local.tee $l4
                        local.get $l10
                        i32.gt_u
                        br_if $B10
                        local.get $l4
                        i32.const -1
                        i32.le_s
                        br_if $B9
                        block $B12
                          block $B13
                            local.get $l4
                            br_if $B13
                            i32.const 1
                            local.set $l8
                            br $B12
                          end
                          local.get $l4
                          i32.const 1
                          call $__rust_alloc
                          local.tee $l8
                          i32.eqz
                          br_if $B8
                        end
                        local.get $l8
                        local.get $l6
                        local.get $l4
                        call $memcpy
                        local.set $l11
                        local.get $l9
                        i32.const 2
                        i32.add
                        local.set $l8
                        local.get $l4
                        local.get $l10
                        i32.ge_u
                        br_if $B7
                        local.get $l10
                        local.get $l9
                        i32.sub
                        local.tee $l12
                        i32.const -2
                        i32.add
                        local.tee $l10
                        i32.const -1
                        i32.le_s
                        br_if $B9
                        block $B14
                          block $B15
                            local.get $l10
                            br_if $B15
                            i32.const 1
                            local.set $l9
                            br $B14
                          end
                          local.get $l10
                          i32.const 1
                          call $__rust_alloc
                          local.tee $l9
                          i32.eqz
                          br_if $B6
                        end
                        local.get $l9
                        local.get $l6
                        local.get $l8
                        i32.add
                        local.get $l10
                        call $memcpy
                        local.set $l6
                        block $B16
                          local.get $l2
                          local.get $l5
                          i32.eq
                          br_if $B16
                          local.get $l2
                          i32.const 1
                          i32.add
                          local.set $l8
                          br $B5
                        end
                        block $B17
                          local.get $l2
                          i32.const 1
                          i32.add
                          local.tee $l8
                          local.get $l2
                          i32.lt_u
                          br_if $B17
                          local.get $l2
                          i32.const 1
                          i32.shl
                          local.tee $l9
                          local.get $l8
                          local.get $l9
                          local.get $l8
                          i32.gt_u
                          select
                          local.tee $l5
                          i64.extend_i32_u
                          i64.const 24
                          i64.mul
                          local.tee $l13
                          i64.const 32
                          i64.shr_u
                          i32.wrap_i64
                          local.tee $l12
                          br_if $B17
                          local.get $l13
                          i32.wrap_i64
                          local.tee $l9
                          i32.const 0
                          i32.lt_s
                          br_if $B17
                          local.get $l12
                          i32.eqz
                          i32.const 2
                          i32.shl
                          local.set $l12
                          block $B18
                            block $B19
                              local.get $l2
                              br_if $B19
                              local.get $l9
                              local.get $l12
                              call $__rust_alloc
                              local.set $l3
                              br $B18
                            end
                            local.get $l3
                            local.get $l2
                            i32.const 24
                            i32.mul
                            i32.const 4
                            local.get $l9
                            call $__rust_realloc
                            local.set $l3
                          end
                          local.get $l3
                          br_if $B5
                          local.get $l9
                          local.get $l12
                          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                          unreachable
                        end
                        call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
                        unreachable
                      end
                      local.get $l10
                      i32.const 0
                      call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
                      unreachable
                    end
                    local.get $l4
                    local.get $l10
                    call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
                    unreachable
                  end
                  call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in28_$u7b$$u7b$closure$u7d$$u7d$17h014d5d43acd4cf77E
                  unreachable
                end
                local.get $l4
                i32.const 1
                call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                unreachable
              end
              local.get $l8
              local.get $l10
              call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
              unreachable
            end
            local.get $l12
            i32.const -2
            i32.add
            i32.const 1
            call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
            unreachable
          end
          local.get $l3
          local.get $l2
          i32.const 24
          i32.mul
          i32.add
          local.tee $l9
          local.get $l6
          i32.store offset=12
          local.get $l9
          local.get $l4
          i32.store offset=8
          local.get $l9
          local.get $l4
          i32.store offset=4
          local.get $l9
          local.get $l11
          i32.store
          local.get $l9
          i32.const 20
          i32.add
          local.get $l10
          i32.store
          local.get $l9
          i32.const 16
          i32.add
          local.get $l10
          i32.store
          local.get $l8
          local.set $l2
        end
        local.get $l7
        i32.const 4
        i32.add
        local.set $l4
        local.get $l7
        i32.load offset=4
        local.tee $l6
        br_if $L2
      end
    end
    local.get $p0
    local.get $l3
    i32.store offset=8
    local.get $p0
    local.get $l5
    i32.store offset=4
    local.get $p0
    local.get $l3
    i32.store
    local.get $p0
    local.get $l3
    local.get $l2
    i32.const 24
    i32.mul
    i32.add
    i32.store offset=12
    local.get $l1
    i32.const 16
    i32.add
    global.set $g0)
  (func $_ZN73_$LT$std..env..Vars$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h5d7dad2d7e713553E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i64)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p1
            i32.load offset=8
            local.tee $l3
            local.get $p1
            i32.load offset=12
            i32.eq
            br_if $B3
            local.get $p1
            local.get $l3
            i32.const 24
            i32.add
            i32.store offset=8
            local.get $l3
            i32.load
            local.tee $p1
            i32.eqz
            br_if $B3
            local.get $l3
            i32.const 20
            i32.add
            i32.load
            local.set $l4
            local.get $l3
            i32.const 16
            i32.add
            i32.load
            local.set $l5
            local.get $l3
            i32.load offset=12
            local.set $l6
            local.get $l3
            i32.load offset=4
            local.set $l7
            local.get $l2
            i32.const 24
            i32.add
            local.get $p1
            local.get $l3
            i32.load offset=8
            local.tee $l3
            call $_ZN4core3str9from_utf817h5f5991ab7674ad2aE
            local.get $l2
            i32.load offset=24
            i32.const 1
            i32.eq
            br_if $B1
            local.get $l2
            i32.const 24
            i32.add
            local.get $l6
            local.get $l4
            call $_ZN4core3str9from_utf817h5f5991ab7674ad2aE
            local.get $l2
            i32.load offset=24
            i32.const 1
            i32.eq
            br_if $B0
            local.get $p0
            local.get $l7
            i32.store offset=4
            local.get $p0
            local.get $p1
            i32.store
            local.get $p0
            i32.const 20
            i32.add
            local.get $l4
            i32.store
            local.get $p0
            i32.const 16
            i32.add
            local.get $l5
            i32.store
            local.get $p0
            i32.const 12
            i32.add
            local.get $l6
            i32.store
            local.get $p0
            i32.const 8
            i32.add
            local.get $l3
            i32.store
            br $B2
          end
          local.get $p0
          i32.const 0
          i32.store
        end
        local.get $l2
        i32.const 48
        i32.add
        global.set $g0
        return
      end
      local.get $l2
      local.get $l2
      i64.load offset=28 align=4
      i64.store offset=36 align=4
      local.get $l2
      local.get $l3
      i32.store offset=32
      local.get $l2
      local.get $l7
      i32.store offset=28
      local.get $l2
      local.get $p1
      i32.store offset=24
      local.get $l2
      i32.const 8
      i32.add
      local.get $l2
      i32.const 24
      i32.add
      call $_ZN5alloc6string13FromUtf8Error10into_bytes17h556fd87931e20132E
      local.get $l2
      i64.load offset=8
      local.set $l8
      local.get $l2
      local.get $l2
      i32.load offset=16
      i32.store offset=32
      local.get $l2
      local.get $l8
      i64.store offset=24
      i32.const 1049364
      i32.const 43
      local.get $l2
      i32.const 24
      i32.add
      i32.const 1049440
      call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
      unreachable
    end
    local.get $l2
    local.get $l2
    i64.load offset=28 align=4
    i64.store offset=36 align=4
    local.get $l2
    local.get $l4
    i32.store offset=32
    local.get $l2
    local.get $l5
    i32.store offset=28
    local.get $l2
    local.get $l6
    i32.store offset=24
    local.get $l2
    i32.const 8
    i32.add
    local.get $l2
    i32.const 24
    i32.add
    call $_ZN5alloc6string13FromUtf8Error10into_bytes17h556fd87931e20132E
    local.get $l2
    i64.load offset=8
    local.set $l8
    local.get $l2
    local.get $l2
    i32.load offset=16
    i32.store offset=32
    local.get $l2
    local.get $l8
    i64.store offset=24
    i32.const 1049364
    i32.const 43
    local.get $l2
    i32.const 24
    i32.add
    i32.const 1049440
    call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
    unreachable)
  (func $_ZN3std3ffi5c_str104_$LT$impl$u20$core..convert..From$LT$std..ffi..c_str..NulError$GT$$u20$for$u20$std..io..error..Error$GT$4from17hdc70568937ca6b95E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        block $B2
          i32.const 33
          i32.const 1
          call $__rust_alloc
          local.tee $l3
          i32.eqz
          br_if $B2
          local.get $l3
          i32.const 32
          i32.add
          i32.const 0
          i32.load8_u offset=1050133
          i32.store8
          local.get $l3
          i32.const 24
          i32.add
          i32.const 0
          i64.load offset=1050125 align=1
          i64.store align=1
          local.get $l3
          i32.const 16
          i32.add
          i32.const 0
          i64.load offset=1050117 align=1
          i64.store align=1
          local.get $l3
          i32.const 8
          i32.add
          i32.const 0
          i64.load offset=1050109 align=1
          i64.store align=1
          local.get $l3
          i32.const 0
          i64.load offset=1050101 align=1
          i64.store align=1
          i32.const 12
          i32.const 4
          call $__rust_alloc
          local.tee $l4
          i32.eqz
          br_if $B1
          local.get $l4
          i64.const 141733920801
          i64.store offset=4 align=4
          local.get $l4
          local.get $l3
          i32.store
          i32.const 12
          i32.const 4
          call $__rust_alloc
          local.tee $l3
          i32.eqz
          br_if $B0
          local.get $l3
          i32.const 11
          i32.store8 offset=8
          local.get $l3
          i32.const 1050060
          i32.store offset=4
          local.get $l3
          local.get $l4
          i32.store
          local.get $l3
          local.get $l2
          i32.load16_u offset=13 align=1
          i32.store16 offset=9 align=1
          local.get $l3
          i32.const 11
          i32.add
          local.get $l2
          i32.const 13
          i32.add
          i32.const 2
          i32.add
          i32.load8_u
          i32.store8
          local.get $p0
          i32.const 2
          i32.store8
          local.get $p0
          local.get $l2
          i32.load16_u offset=10 align=1
          i32.store16 offset=1 align=1
          local.get $p0
          i32.const 3
          i32.add
          local.get $l2
          i32.const 10
          i32.add
          i32.const 2
          i32.add
          i32.load8_u
          i32.store8
          local.get $p0
          i32.const 4
          i32.add
          local.get $l3
          i32.store
          block $B3
            local.get $p1
            i32.const 8
            i32.add
            i32.load
            local.tee $l3
            i32.eqz
            br_if $B3
            local.get $p1
            i32.load offset=4
            local.get $l3
            i32.const 1
            call $__rust_dealloc
          end
          local.get $l2
          i32.const 16
          i32.add
          global.set $g0
          return
        end
        i32.const 33
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    i32.const 12
    i32.const 4
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN60_$LT$std..io..error..Error$u20$as$u20$core..fmt..Display$GT$3fmt17hd06165d611b0d72eE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p0
            i32.load8_u
            br_table $B3 $B1 $B2 $B3
          end
          local.get $l2
          local.get $p0
          i32.const 4
          i32.add
          i32.load
          local.tee $p0
          i32.store offset=4
          local.get $l2
          i32.const 8
          i32.add
          local.get $p0
          call $_ZN3std3sys4wasi2os12error_string17h8f2d58cdd1224517E
          local.get $l2
          i32.const 60
          i32.add
          i32.const 2
          i32.store
          local.get $l2
          i32.const 36
          i32.add
          i32.const 14
          i32.store
          local.get $l2
          i64.const 3
          i64.store offset=44 align=4
          local.get $l2
          i32.const 1050484
          i32.store offset=40
          local.get $l2
          i32.const 15
          i32.store offset=28
          local.get $l2
          local.get $l2
          i32.const 24
          i32.add
          i32.store offset=56
          local.get $l2
          local.get $l2
          i32.const 4
          i32.add
          i32.store offset=32
          local.get $l2
          local.get $l2
          i32.const 8
          i32.add
          i32.store offset=24
          local.get $p1
          local.get $l2
          i32.const 40
          i32.add
          call $_ZN4core3fmt9Formatter9write_fmt17h82e7776a00521c64E
          local.set $p0
          local.get $l2
          i32.load offset=12
          local.tee $p1
          i32.eqz
          br_if $B0
          local.get $l2
          i32.load offset=8
          local.get $p1
          i32.const 1
          call $__rust_dealloc
          br $B0
        end
        local.get $p0
        i32.const 4
        i32.add
        i32.load
        local.tee $p0
        i32.load
        local.get $p1
        local.get $p0
        i32.load offset=4
        i32.load offset=32
        call_indirect (type $t3) $T0
        local.set $p0
        br $B0
      end
      i32.const 1050167
      local.set $l3
      i32.const 22
      local.set $l4
      block $B4
        block $B5
          block $B6
            block $B7
              block $B8
                block $B9
                  block $B10
                    block $B11
                      block $B12
                        block $B13
                          block $B14
                            block $B15
                              block $B16
                                block $B17
                                  block $B18
                                    block $B19
                                      block $B20
                                        block $B21
                                          block $B22
                                            local.get $p0
                                            i32.load8_u offset=1
                                            br_table $B22 $B21 $B20 $B19 $B18 $B17 $B16 $B15 $B14 $B13 $B12 $B11 $B10 $B9 $B8 $B7 $B6 $B4 $B22
                                          end
                                          i32.const 1050448
                                          local.set $l3
                                          i32.const 16
                                          local.set $l4
                                          br $B4
                                        end
                                        i32.const 1050431
                                        local.set $l3
                                        i32.const 17
                                        local.set $l4
                                        br $B4
                                      end
                                      i32.const 1050413
                                      local.set $l3
                                      i32.const 18
                                      local.set $l4
                                      br $B4
                                    end
                                    i32.const 1050397
                                    local.set $l3
                                    i32.const 16
                                    local.set $l4
                                    br $B4
                                  end
                                  i32.const 1050379
                                  local.set $l3
                                  i32.const 18
                                  local.set $l4
                                  br $B4
                                end
                                i32.const 1050366
                                local.set $l3
                                i32.const 13
                                local.set $l4
                                br $B4
                              end
                              i32.const 1050352
                              local.set $l3
                              br $B5
                            end
                            i32.const 1050331
                            local.set $l3
                            i32.const 21
                            local.set $l4
                            br $B4
                          end
                          i32.const 1050320
                          local.set $l3
                          i32.const 11
                          local.set $l4
                          br $B4
                        end
                        i32.const 1050299
                        local.set $l3
                        i32.const 21
                        local.set $l4
                        br $B4
                      end
                      i32.const 1050278
                      local.set $l3
                      i32.const 21
                      local.set $l4
                      br $B4
                    end
                    i32.const 1050255
                    local.set $l3
                    i32.const 23
                    local.set $l4
                    br $B4
                  end
                  i32.const 1050243
                  local.set $l3
                  i32.const 12
                  local.set $l4
                  br $B4
                end
                i32.const 1050234
                local.set $l3
                i32.const 9
                local.set $l4
                br $B4
              end
              i32.const 1050224
              local.set $l3
              i32.const 10
              local.set $l4
              br $B4
            end
            i32.const 1050203
            local.set $l3
            i32.const 21
            local.set $l4
            br $B4
          end
          i32.const 1050189
          local.set $l3
        end
        i32.const 14
        local.set $l4
      end
      local.get $l2
      i32.const 60
      i32.add
      i32.const 1
      i32.store
      local.get $l2
      local.get $l4
      i32.store offset=28
      local.get $l2
      local.get $l3
      i32.store offset=24
      local.get $l2
      i32.const 16
      i32.store offset=12
      local.get $l2
      i64.const 1
      i64.store offset=44 align=4
      local.get $l2
      i32.const 1050464
      i32.store offset=40
      local.get $l2
      local.get $l2
      i32.const 24
      i32.add
      i32.store offset=8
      local.get $l2
      local.get $l2
      i32.const 8
      i32.add
      i32.store offset=56
      local.get $p1
      local.get $l2
      i32.const 40
      i32.add
      call $_ZN4core3fmt9Formatter9write_fmt17h82e7776a00521c64E
      local.set $p0
    end
    local.get $l2
    i32.const 64
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN55_$LT$std..path..Display$u20$as$u20$core..fmt..Debug$GT$3fmt17hdc6c50e8bd89563dE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=4
    local.get $p1
    call $_ZN73_$LT$std..sys_common..os_str_bytes..Slice$u20$as$u20$core..fmt..Debug$GT$3fmt17h4c537bfb2d616e72E)
  (func $_ZN3std3env8_set_var17h43a480d4c418a9c2E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    local.get $p1
    i32.store offset=44
    local.get $l4
    local.get $p0
    i32.store offset=40
    local.get $l4
    local.get $p3
    i32.store offset=52
    local.get $l4
    local.get $p2
    i32.store offset=48
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.const 1
          i32.add
          local.tee $l5
          i32.const -1
          i32.le_s
          br_if $B2
          block $B3
            block $B4
              block $B5
                local.get $l5
                i32.eqz
                br_if $B5
                local.get $l5
                i32.const 1
                call $__rust_alloc
                local.tee $l6
                i32.eqz
                br_if $B0
                local.get $l4
                i32.const 32
                i32.add
                i32.const 0
                local.get $l6
                local.get $p0
                local.get $p1
                call $memcpy
                local.tee $p0
                local.get $p1
                call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
                block $B6
                  local.get $l4
                  i32.load offset=32
                  i32.eqz
                  br_if $B6
                  local.get $l4
                  i32.load offset=36
                  local.set $p3
                  local.get $l4
                  i32.const 76
                  i32.add
                  local.get $p1
                  i32.store
                  local.get $l4
                  i32.const 72
                  i32.add
                  local.get $l5
                  i32.store
                  local.get $l4
                  local.get $p0
                  i32.store offset=68
                  local.get $l4
                  local.get $p3
                  i32.store offset=64
                  local.get $l4
                  i32.const 56
                  i32.add
                  local.get $l4
                  i32.const 64
                  i32.add
                  call $_ZN3std3ffi5c_str104_$LT$impl$u20$core..convert..From$LT$std..ffi..c_str..NulError$GT$$u20$for$u20$std..io..error..Error$GT$4from17hdc70568937ca6b95E
                  local.get $l4
                  i64.load offset=56
                  local.tee $l7
                  i64.const 8
                  i64.shr_u
                  local.set $l8
                  local.get $l7
                  i32.wrap_i64
                  local.set $p1
                  br $B3
                end
                local.get $l4
                local.get $p1
                i32.store offset=72
                local.get $l4
                local.get $l5
                i32.store offset=68
                local.get $l4
                local.get $p0
                i32.store offset=64
                local.get $l4
                i32.const 24
                i32.add
                local.get $l4
                i32.const 64
                i32.add
                call $_ZN3std3ffi5c_str7CString18from_vec_unchecked17h47c15de8242406d0E
                local.get $p3
                i32.const 1
                i32.add
                local.tee $p1
                i32.const -1
                i32.le_s
                br_if $B2
                local.get $p1
                i32.eqz
                br_if $B5
                local.get $l4
                i32.load offset=28
                local.set $p0
                local.get $l4
                i32.load offset=24
                local.set $l5
                local.get $p1
                i32.const 1
                call $__rust_alloc
                local.tee $l6
                br_if $B4
                local.get $p1
                i32.const 1
                call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
                unreachable
              end
              call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
              unreachable
            end
            local.get $l4
            i32.const 16
            i32.add
            i32.const 0
            local.get $l6
            local.get $p2
            local.get $p3
            call $memcpy
            local.tee $p2
            local.get $p3
            call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
            block $B7
              local.get $l4
              i32.load offset=16
              i32.eqz
              br_if $B7
              local.get $l4
              i32.load offset=20
              local.set $l6
              local.get $l4
              i32.const 76
              i32.add
              local.get $p3
              i32.store
              local.get $l4
              i32.const 72
              i32.add
              local.get $p1
              i32.store
              local.get $l4
              local.get $p2
              i32.store offset=68
              local.get $l4
              local.get $l6
              i32.store offset=64
              local.get $l4
              i32.const 56
              i32.add
              local.get $l4
              i32.const 64
              i32.add
              call $_ZN3std3ffi5c_str104_$LT$impl$u20$core..convert..From$LT$std..ffi..c_str..NulError$GT$$u20$for$u20$std..io..error..Error$GT$4from17hdc70568937ca6b95E
              local.get $l4
              i64.load offset=56
              local.set $l7
              local.get $l5
              i32.const 0
              i32.store8
              local.get $l7
              i64.const 8
              i64.shr_u
              local.set $l8
              local.get $l7
              i32.wrap_i64
              local.set $p1
              local.get $p0
              i32.eqz
              br_if $B3
              local.get $l5
              local.get $p0
              i32.const 1
              call $__rust_dealloc
              br $B3
            end
            local.get $l4
            local.get $p3
            i32.store offset=72
            local.get $l4
            local.get $p1
            i32.store offset=68
            local.get $l4
            local.get $p2
            i32.store offset=64
            local.get $l4
            i32.const 8
            i32.add
            local.get $l4
            i32.const 64
            i32.add
            call $_ZN3std3ffi5c_str7CString18from_vec_unchecked17h47c15de8242406d0E
            local.get $l4
            i32.load offset=12
            local.set $p3
            block $B8
              block $B9
                local.get $l5
                local.get $l4
                i32.load offset=8
                local.tee $p2
                i32.const 1
                call $setenv
                i32.const -1
                i32.eq
                br_if $B9
                i32.const 3
                local.set $p1
                br $B8
              end
              i32.const 0
              local.set $p1
              i32.const 0
              i64.load32_u offset=1060772
              i64.const 24
              i64.shl
              local.set $l8
            end
            local.get $p2
            i32.const 0
            i32.store8
            block $B10
              local.get $p3
              i32.eqz
              br_if $B10
              local.get $p2
              local.get $p3
              i32.const 1
              call $__rust_dealloc
            end
            local.get $l5
            i32.const 0
            i32.store8
            local.get $p0
            i32.eqz
            br_if $B3
            local.get $l5
            local.get $p0
            i32.const 1
            call $__rust_dealloc
          end
          local.get $p1
          i32.const 255
          i32.and
          i32.const 3
          i32.ne
          br_if $B1
          local.get $l4
          i32.const 80
          i32.add
          global.set $g0
          return
        end
        call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in28_$u7b$$u7b$closure$u7d$$u7d$17h014d5d43acd4cf77E
        unreachable
      end
      local.get $l4
      local.get $l8
      i64.const 8
      i64.shl
      local.get $p1
      i64.extend_i32_u
      i64.const 255
      i64.and
      i64.or
      i64.store offset=64
      local.get $l4
      i32.const 40
      i32.add
      local.get $l4
      i32.const 48
      i32.add
      local.get $l4
      i32.const 64
      i32.add
      call $_ZN3std3env8_set_var28_$u7b$$u7b$closure$u7d$$u7d$17h02dee69a0418cd45E
      unreachable
    end
    local.get $l5
    i32.const 1
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std3env8_set_var28_$u7b$$u7b$closure$u7d$$u7d$17h02dee69a0418cd45E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 24
    i32.add
    i32.const 20
    i32.add
    i32.const 12
    i32.store
    local.get $l3
    i32.const 36
    i32.add
    i32.const 13
    i32.store
    local.get $l3
    i32.const 20
    i32.add
    i32.const 3
    i32.store
    local.get $l3
    i64.const 3
    i64.store offset=4 align=4
    local.get $l3
    i32.const 1050020
    i32.store
    local.get $l3
    local.get $p2
    i32.store offset=40
    local.get $l3
    local.get $p1
    i32.store offset=32
    local.get $l3
    i32.const 13
    i32.store offset=28
    local.get $l3
    local.get $p0
    i32.store offset=24
    local.get $l3
    local.get $l3
    i32.const 24
    i32.add
    i32.store offset=16
    local.get $l3
    i32.const 1050044
    call $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE
    unreachable)
  (func $_ZN3std5error5Error5cause17hdcc611f5b660fe7bE (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    i32.const 0
    i32.store)
  (func $_ZN3std5error5Error7type_id17h06f6b51af692fb8cE (type $t2) (param $p0 i32) (result i64)
    i64.const 4474934419947851545)
  (func $_ZN3std5error5Error9backtrace17h06313fcba673025cE (type $t7) (param $p0 i32) (result i32)
    i32.const 0)
  (func $_ZN243_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$std..error..Error$GT$11description17h99876fd1182ecb66E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    i32.load offset=8
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.load
    i32.store)
  (func $_ZN244_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$core..fmt..Display$GT$3fmt17h49fa384e8bf0e2e8E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=8
    local.get $p1
    call $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17h5c99f0bd4435cce9E)
  (func $_ZN242_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$core..fmt..Debug$GT$3fmt17h715599854f44a67aE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=8
    local.get $p1
    call $_ZN40_$LT$str$u20$as$u20$core..fmt..Debug$GT$3fmt17hb0d1558d5b23100eE)
  (func $_ZN3std3sys4wasi17decode_error_kind17h928243d5bc425dc3E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    i32.const 16
    local.set $l1
    block $B0
      local.get $p0
      i32.const 65535
      i32.gt_u
      br_if $B0
      local.get $p0
      i32.const 65535
      i32.and
      i32.const -2
      i32.add
      local.tee $p0
      i32.const 71
      i32.gt_u
      br_if $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  block $B7
                    block $B8
                      block $B9
                        block $B10
                          block $B11
                            block $B12
                              block $B13
                                block $B14
                                  local.get $p0
                                  br_table $B12 $B7 $B8 $B0 $B1 $B0 $B0 $B0 $B0 $B0 $B0 $B9 $B14 $B13 $B0 $B0 $B0 $B0 $B2 $B0 $B0 $B0 $B0 $B0 $B0 $B5 $B4 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B6 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B10 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B12 $B11 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B0 $B3 $B12
                                end
                                i32.const 2
                                return
                              end
                              i32.const 3
                              return
                            end
                            i32.const 1
                            return
                          end
                          i32.const 8
                          return
                        end
                        i32.const 5
                        return
                      end
                      i32.const 4
                      return
                    end
                    i32.const 7
                    return
                  end
                  i32.const 6
                  return
                end
                i32.const 0
                return
              end
              i32.const 15
              return
            end
            i32.const 11
            return
          end
          i32.const 13
          return
        end
        i32.const 9
        return
      end
      i32.const 10
      local.set $l1
    end
    local.get $l1)
  (func $_ZN72_$LT$std..io..buffered..BufWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h0967d121b7f062d4E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i64)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    block $B0
      block $B1
        local.get $p1
        i32.load offset=8
        local.get $p3
        i32.add
        local.get $p1
        i32.load offset=4
        i32.le_u
        br_if $B1
        local.get $l4
        i32.const 16
        i32.add
        local.get $p1
        call $_ZN3std2io8buffered18BufWriter$LT$W$GT$9flush_buf17hef650b0a0b674a49E
        local.get $l4
        i32.load offset=20
        local.set $l5
        block $B2
          local.get $l4
          i32.load offset=16
          local.tee $l6
          i32.const 255
          i32.and
          i32.const 3
          i32.eq
          br_if $B2
          local.get $p0
          i32.const 1
          i32.store
          local.get $p0
          local.get $l5
          i64.extend_i32_u
          i64.const 32
          i64.shl
          local.get $l6
          i64.extend_i32_u
          i64.or
          i64.store offset=4 align=4
          br $B0
        end
        block $B3
          i32.const 0
          br_if $B3
          local.get $l6
          i32.const 3
          i32.and
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $l5
        i32.load
        local.get $l5
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B4
          local.get $l5
          i32.load offset=4
          local.tee $l6
          i32.load offset=4
          local.tee $l7
          i32.eqz
          br_if $B4
          local.get $l5
          i32.load
          local.get $l7
          local.get $l6
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $l5
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      block $B5
        local.get $p1
        i32.load offset=4
        local.get $p3
        i32.le_u
        br_if $B5
        local.get $p1
        local.get $p3
        call $_ZN5alloc3vec12Vec$LT$T$GT$7reserve17h72ae103c51b48d8cE
        local.get $p1
        local.get $p1
        i32.load offset=8
        local.tee $l5
        local.get $p3
        i32.add
        i32.store offset=8
        local.get $l5
        local.get $p1
        i32.load
        i32.add
        local.get $p2
        local.get $p3
        call $memcpy
        drop
        local.get $p0
        i32.const 0
        i32.store
        local.get $p0
        local.get $p3
        i32.store offset=4
        br $B0
      end
      local.get $p1
      i32.const 1
      i32.store8 offset=13
      block $B6
        block $B7
          local.get $p1
          i32.load8_u offset=12
          i32.const -1
          i32.add
          local.tee $l5
          i32.const 1
          i32.gt_u
          br_if $B7
          block $B8
            block $B9
              local.get $l5
              br_table $B8 $B9 $B8
            end
            i32.const 1049272
            i32.const 43
            i32.const 1049212
            call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
            unreachable
          end
          local.get $p3
          i64.extend_i32_u
          local.set $l8
          i32.const 0
          local.set $p3
          br $B6
        end
        local.get $l4
        local.get $p3
        i32.store offset=12
        local.get $l4
        local.get $p2
        i32.store offset=8
        local.get $l4
        i32.const 16
        i32.add
        i32.const 1
        local.get $l4
        i32.const 8
        i32.add
        i32.const 1
        call $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE
        block $B10
          local.get $l4
          i32.load16_u offset=16
          i32.const 1
          i32.eq
          br_if $B10
          local.get $l4
          i64.load32_u offset=20
          local.set $l8
          i32.const 0
          local.set $p3
          br $B6
        end
        local.get $l4
        local.get $l4
        i32.load16_u offset=18
        i32.store16 offset=30
        local.get $p3
        i64.extend_i32_u
        local.get $l4
        i32.const 30
        i32.add
        call $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E
        local.tee $p3
        i64.extend_i32_u
        i64.const 65535
        i64.and
        i64.const 32
        i64.shl
        local.get $p3
        i32.const 65535
        i32.and
        local.tee $p3
        i32.const 8
        i32.eq
        select
        local.set $l8
        local.get $p3
        i32.const 8
        i32.ne
        local.set $p3
      end
      local.get $p0
      local.get $l8
      i64.store offset=4 align=4
      local.get $p0
      local.get $p3
      i32.store
      local.get $p1
      i32.const 0
      i32.store8 offset=13
    end
    local.get $l4
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN73_$LT$std..io..buffered..LineWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h75e2b3ae5cd680cdE (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i64) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    block $B0
      block $B1
        local.get $p1
        i32.load8_u offset=16
        i32.eqz
        br_if $B1
        local.get $l4
        i32.const 16
        i32.add
        local.get $p1
        call $_ZN3std2io8buffered18BufWriter$LT$W$GT$9flush_buf17hef650b0a0b674a49E
        block $B2
          block $B3
            block $B4
              local.get $l4
              i32.load8_u offset=16
              i32.const 3
              i32.ne
              br_if $B4
              local.get $p1
              i32.load8_u offset=12
              i32.const 2
              i32.ne
              br_if $B3
              i32.const 1049272
              i32.const 43
              i32.const 1049212
              call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
              unreachable
            end
            local.get $l4
            i64.load offset=16
            local.tee $l5
            i64.const 255
            i64.and
            i64.const 3
            i64.ne
            br_if $B2
          end
          local.get $p1
          i32.const 0
          i32.store8 offset=16
          br $B1
        end
        block $B5
          local.get $l5
          i32.wrap_i64
          local.tee $l6
          i32.const 255
          i32.and
          i32.const 3
          i32.eq
          br_if $B5
          local.get $p0
          i32.const 1
          i32.store
          local.get $p0
          local.get $l5
          i64.store offset=4 align=4
          br $B0
        end
        block $B6
          i32.const 0
          br_if $B6
          local.get $l6
          i32.const 3
          i32.and
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $l5
        i64.const 32
        i64.shr_u
        i32.wrap_i64
        local.tee $l6
        i32.load
        local.get $l6
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B7
          local.get $l6
          i32.load offset=4
          local.tee $l7
          i32.load offset=4
          local.tee $l8
          i32.eqz
          br_if $B7
          local.get $l6
          i32.load
          local.get $l8
          local.get $l7
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $l6
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $l4
      i32.const 8
      i32.add
      i32.const 10
      local.get $p2
      local.get $p3
      call $_ZN4core5slice6memchr7memrchr17hc5890a38ca2d83a7E
      block $B8
        local.get $l4
        i32.load offset=8
        br_if $B8
        local.get $p0
        local.get $p1
        local.get $p2
        local.get $p3
        call $_ZN72_$LT$std..io..buffered..BufWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h0967d121b7f062d4E
        br $B0
      end
      block $B9
        block $B10
          local.get $l4
          i32.load offset=12
          local.tee $l7
          i32.const -1
          i32.eq
          br_if $B10
          local.get $l7
          i32.const 1
          i32.add
          local.set $l6
          local.get $l7
          local.get $p3
          i32.lt_u
          br_if $B9
          local.get $l6
          local.get $p3
          call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
          unreachable
        end
        call $_ZN4core5slice25slice_index_overflow_fail17h13a0de4601da693aE
        unreachable
      end
      local.get $l4
      i32.const 16
      i32.add
      local.get $p1
      local.get $p2
      local.get $l6
      call $_ZN72_$LT$std..io..buffered..BufWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h0967d121b7f062d4E
      local.get $l4
      i32.const 24
      i32.add
      i32.load
      local.set $l8
      local.get $l4
      i32.load offset=20
      local.set $l7
      block $B11
        block $B12
          local.get $l4
          i32.load offset=16
          local.tee $l9
          i32.const 1
          i32.gt_u
          br_if $B12
          block $B13
            local.get $l9
            br_table $B11 $B13 $B11
          end
          local.get $p0
          i32.const 1
          i32.store
          local.get $p0
          local.get $l8
          i64.extend_i32_u
          i64.const 32
          i64.shl
          local.get $l7
          i64.extend_i32_u
          i64.or
          i64.store offset=4 align=4
          br $B0
        end
        local.get $l7
        i32.const 255
        i32.and
        i32.const 2
        i32.lt_u
        br_if $B11
        local.get $l8
        i32.load
        local.get $l8
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B14
          local.get $l8
          i32.load offset=4
          local.tee $l9
          i32.load offset=4
          local.tee $l10
          i32.eqz
          br_if $B14
          local.get $l8
          i32.load
          local.get $l10
          local.get $l9
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $l8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p1
      i32.const 1
      i32.store8 offset=16
      local.get $l4
      i32.const 16
      i32.add
      local.get $p1
      call $_ZN3std2io8buffered18BufWriter$LT$W$GT$9flush_buf17hef650b0a0b674a49E
      block $B15
        block $B16
          block $B17
            block $B18
              block $B19
                local.get $l4
                i32.load8_u offset=16
                i32.const 3
                i32.ne
                br_if $B19
                local.get $p1
                i32.load8_u offset=12
                i32.const 2
                i32.ne
                br_if $B18
                i32.const 1049272
                i32.const 43
                i32.const 1049212
                call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
                unreachable
              end
              local.get $l4
              i64.load8_u offset=16
              i64.const 3
              i64.ne
              br_if $B17
            end
            local.get $p1
            i32.const 0
            i32.store8 offset=16
            local.get $l7
            local.get $l6
            i32.eq
            br_if $B16
            br $B15
          end
          local.get $l4
          i32.load offset=20
          local.set $l8
          local.get $l7
          local.get $l6
          i32.ne
          local.get $l4
          i32.load offset=16
          local.tee $l10
          i32.const 255
          i32.and
          i32.const 3
          i32.ne
          i32.or
          local.set $l9
          block $B20
            block $B21
              i32.const 0
              br_if $B21
              local.get $l10
              i32.const 3
              i32.and
              i32.const 2
              i32.ne
              br_if $B20
            end
            local.get $l8
            i32.load
            local.get $l8
            i32.load offset=4
            i32.load
            call_indirect (type $t1) $T0
            block $B22
              local.get $l8
              i32.load offset=4
              local.tee $l10
              i32.load offset=4
              local.tee $l11
              i32.eqz
              br_if $B22
              local.get $l8
              i32.load
              local.get $l11
              local.get $l10
              i32.load offset=8
              call $__rust_dealloc
            end
            local.get $l8
            i32.const 12
            i32.const 4
            call $__rust_dealloc
          end
          local.get $l9
          br_if $B15
        end
        local.get $l4
        i32.const 16
        i32.add
        local.get $p1
        local.get $p2
        local.get $l6
        i32.add
        local.get $p3
        local.get $l6
        i32.sub
        call $_ZN72_$LT$std..io..buffered..BufWriter$LT$W$GT$$u20$as$u20$std..io..Write$GT$5write17h0967d121b7f062d4E
        block $B23
          local.get $l4
          i32.load offset=16
          i32.const 1
          i32.eq
          br_if $B23
          local.get $p0
          i32.const 0
          i32.store
          local.get $p0
          local.get $l4
          i32.load offset=20
          local.get $l7
          i32.add
          i32.store offset=4
          br $B0
        end
        local.get $p0
        i32.const 0
        i32.store
        local.get $p0
        local.get $l7
        i32.store offset=4
        local.get $l4
        i32.load8_u offset=20
        i32.const 2
        i32.lt_u
        br_if $B0
        local.get $l4
        i32.const 24
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B24
          local.get $p1
          i32.load offset=4
          local.tee $p2
          i32.load offset=4
          local.tee $p3
          i32.eqz
          br_if $B24
          local.get $p1
          i32.load
          local.get $p3
          local.get $p2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p1
        i32.const 12
        i32.const 4
        call $__rust_dealloc
        br $B0
      end
      local.get $p0
      i32.const 0
      i32.store
      local.get $p0
      local.get $l7
      i32.store offset=4
    end
    local.get $l4
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN3std3sys4wasi2os12error_string17h8f2d58cdd1224517E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 1056
    i32.sub
    local.tee $l2
    global.set $g0
    i32.const 0
    local.set $l3
    local.get $l2
    i32.const 8
    i32.add
    i32.const 0
    i32.const 1024
    call $memset
    drop
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $p1
              local.get $l2
              i32.const 8
              i32.add
              i32.const 1024
              call $strerror_r
              i32.const 0
              i32.lt_s
              br_if $B4
              block $B5
                local.get $l2
                i32.load8_u offset=8
                i32.eqz
                br_if $B5
                local.get $l2
                i32.const 8
                i32.add
                i32.const 1
                i32.add
                local.set $l4
                i32.const 0
                local.set $p1
                loop $L6
                  local.get $l4
                  local.get $p1
                  i32.add
                  local.set $l5
                  local.get $p1
                  i32.const 1
                  i32.add
                  local.tee $l3
                  local.set $p1
                  local.get $l5
                  i32.load8_u
                  br_if $L6
                end
                local.get $l3
                i32.const -1
                i32.eq
                br_if $B3
              end
              local.get $l2
              i32.const 1032
              i32.add
              local.get $l2
              i32.const 8
              i32.add
              local.get $l3
              call $_ZN4core3str9from_utf817h5f5991ab7674ad2aE
              local.get $l2
              i32.load offset=1032
              i32.const 1
              i32.eq
              br_if $B2
              local.get $l2
              i32.const 1040
              i32.add
              i32.load
              local.tee $p1
              i32.const -1
              i32.le_s
              br_if $B1
              local.get $l2
              i32.load offset=1036
              local.set $l5
              block $B7
                block $B8
                  local.get $p1
                  br_if $B8
                  i32.const 1
                  local.set $l3
                  br $B7
                end
                local.get $p1
                i32.const 1
                call $__rust_alloc
                local.tee $l3
                i32.eqz
                br_if $B0
              end
              local.get $l3
              local.get $l5
              local.get $p1
              call $memcpy
              local.set $l5
              local.get $p0
              local.get $p1
              i32.store offset=8
              local.get $p0
              local.get $p1
              i32.store offset=4
              local.get $p0
              local.get $l5
              i32.store
              local.get $l2
              i32.const 1056
              i32.add
              global.set $g0
              return
            end
            i32.const 1052208
            i32.const 18
            i32.const 1052192
            call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
            unreachable
          end
          local.get $l3
          i32.const 0
          call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
          unreachable
        end
        local.get $l2
        local.get $l2
        i64.load offset=1036 align=4
        i64.store offset=1048
        i32.const 1049364
        i32.const 43
        local.get $l2
        i32.const 1048
        i32.add
        i32.const 1049408
        call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
        unreachable
      end
      call $_ZN5alloc7raw_vec19RawVec$LT$T$C$A$GT$11allocate_in28_$u7b$$u7b$closure$u7d$$u7d$17h014d5d43acd4cf77E
      unreachable
    end
    local.get $p1
    i32.const 1
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$5write17haaeff0f2771725aaE (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    local.get $p0
    local.get $p1
    i32.load
    local.get $p2
    local.get $p3
    local.get $p1
    i32.load offset=4
    i32.load offset=12
    call_indirect (type $t4) $T0)
  (func $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$14write_vectored17hc39fb9d518e3ce73E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    local.get $p0
    local.get $p1
    i32.load
    local.get $p2
    local.get $p3
    local.get $p1
    i32.load offset=4
    i32.load offset=16
    call_indirect (type $t4) $T0)
  (func $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$5flush17h90d011ec07347753E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    i32.load
    local.get $p1
    i32.load offset=4
    i32.load offset=20
    call_indirect (type $t5) $T0)
  (func $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$9write_all17h5b1df4198c579a70E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    local.get $p0
    local.get $p1
    i32.load
    local.get $p2
    local.get $p3
    local.get $p1
    i32.load offset=4
    i32.load offset=24
    call_indirect (type $t4) $T0)
  (func $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$9write_fmt17h0a14847ba6c7a120E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $p1
    i32.load
    local.set $l4
    local.get $p1
    i32.load offset=4
    local.set $p1
    local.get $l3
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p2
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p2
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    local.get $p2
    i64.load align=4
    i64.store offset=8
    local.get $p0
    local.get $l4
    local.get $l3
    i32.const 8
    i32.add
    local.get $p1
    i32.load offset=28
    call_indirect (type $t6) $T0
    local.get $l3
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN60_$LT$std..io..stdio..StderrRaw$u20$as$u20$std..io..Write$GT$5write17hf4c537256714add5E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    local.get $p3
    i32.store offset=12
    local.get $l4
    local.get $p2
    i32.store offset=8
    i32.const 1
    local.set $p2
    local.get $l4
    i32.const 16
    i32.add
    i32.const 2
    local.get $l4
    i32.const 8
    i32.add
    i32.const 1
    call $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE
    block $B0
      block $B1
        local.get $l4
        i32.load16_u offset=16
        i32.const 1
        i32.eq
        br_if $B1
        local.get $p0
        local.get $l4
        i32.load offset=20
        i32.store offset=4
        i32.const 0
        local.set $p2
        br $B0
      end
      local.get $l4
      local.get $l4
      i32.load16_u offset=18
      i32.store16 offset=30
      local.get $p0
      local.get $l4
      i32.const 30
      i32.add
      call $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E
      i64.extend_i32_u
      i64.const 65535
      i64.and
      i64.const 32
      i64.shl
      i64.store offset=4 align=4
    end
    local.get $p0
    local.get $p2
    i32.store
    local.get $l4
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN3std10sys_common11at_exit_imp4push17h34b460b71ed8bd3fE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              i32.const 0
              i32.load8_u offset=1060273
              br_if $B4
              i32.const 0
              i32.const 1
              i32.store8 offset=1060273
              block $B5
                block $B6
                  i32.const 0
                  i32.load offset=1060192
                  local.tee $l2
                  i32.const 1
                  i32.gt_u
                  br_if $B6
                  block $B7
                    local.get $l2
                    br_table $B7 $B5 $B7
                  end
                  i32.const 12
                  i32.const 4
                  call $__rust_alloc
                  local.tee $l2
                  i32.eqz
                  br_if $B3
                  local.get $l2
                  i32.const 0
                  i32.store offset=8
                  local.get $l2
                  i64.const 4
                  i64.store align=4
                  i32.const 0
                  local.get $l2
                  i32.store offset=1060192
                end
                block $B8
                  block $B9
                    local.get $l2
                    i32.load offset=8
                    local.tee $l3
                    local.get $l2
                    i32.load offset=4
                    i32.eq
                    br_if $B9
                    local.get $l2
                    i32.load
                    local.set $l4
                    br $B8
                  end
                  local.get $l3
                  i32.const 1
                  i32.add
                  local.tee $l4
                  local.get $l3
                  i32.lt_u
                  br_if $B1
                  local.get $l3
                  i32.const 1
                  i32.shl
                  local.tee $l5
                  local.get $l4
                  local.get $l5
                  local.get $l4
                  i32.gt_u
                  select
                  local.tee $l5
                  i32.const 536870911
                  i32.and
                  local.tee $l4
                  local.get $l5
                  i32.ne
                  br_if $B1
                  local.get $l5
                  i32.const 3
                  i32.shl
                  local.tee $l6
                  i32.const 0
                  i32.lt_s
                  br_if $B1
                  local.get $l4
                  local.get $l5
                  i32.eq
                  i32.const 2
                  i32.shl
                  local.set $l7
                  block $B10
                    block $B11
                      local.get $l3
                      br_if $B11
                      local.get $l6
                      local.get $l7
                      call $__rust_alloc
                      local.set $l4
                      br $B10
                    end
                    local.get $l2
                    i32.load
                    local.get $l3
                    i32.const 3
                    i32.shl
                    i32.const 4
                    local.get $l6
                    call $__rust_realloc
                    local.set $l4
                  end
                  local.get $l4
                  i32.eqz
                  br_if $B2
                  local.get $l2
                  local.get $l5
                  i32.store offset=4
                  local.get $l2
                  local.get $l4
                  i32.store
                  local.get $l2
                  i32.load offset=8
                  local.set $l3
                end
                local.get $l4
                local.get $l3
                i32.const 3
                i32.shl
                i32.add
                local.tee $l3
                local.get $p1
                i32.store offset=4
                local.get $l3
                local.get $p0
                i32.store
                i32.const 1
                local.set $l3
                local.get $l2
                local.get $l2
                i32.load offset=8
                i32.const 1
                i32.add
                i32.store offset=8
                i32.const 0
                i32.const 0
                i32.store8 offset=1060273
                br $B0
              end
              i32.const 0
              local.set $l3
              i32.const 0
              i32.const 0
              i32.store8 offset=1060273
              local.get $p0
              local.get $p1
              i32.load
              call_indirect (type $t1) $T0
              local.get $p1
              i32.load offset=4
              local.tee $l2
              i32.eqz
              br_if $B0
              local.get $p0
              local.get $l2
              local.get $p1
              i32.load offset=8
              call $__rust_dealloc
              i32.const 0
              return
            end
            i32.const 1052132
            i32.const 32
            i32.const 1052116
            call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
            unreachable
          end
          i32.const 12
          i32.const 4
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        local.get $l6
        local.get $l7
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      call $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE
      unreachable
    end
    local.get $l3)
  (func $_ZN3std2io5stdio6stdout17hcaa61cf70468d43dE (type $t10) (result i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l0
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                i32.const 0
                i32.load8_u offset=1060188
                br_if $B5
                i32.const 0
                i32.const 1
                i32.store8 offset=1060188
                block $B6
                  block $B7
                    i32.const 0
                    i32.load offset=1060184
                    local.tee $l1
                    i32.const 1
                    i32.gt_u
                    br_if $B7
                    block $B8
                      block $B9
                        local.get $l1
                        br_table $B8 $B9 $B8
                      end
                      i32.const 0
                      i32.const 0
                      i32.store8 offset=1060188
                      i32.const 1050508
                      i32.const 36
                      call $_ZN4core6option13expect_failed17he2d01222d382a638E
                      unreachable
                    end
                    i32.const 4
                    i32.const 4
                    call $__rust_alloc
                    local.tee $l1
                    i32.eqz
                    br_if $B4
                    local.get $l1
                    i32.const 1060184
                    i32.store
                    local.get $l1
                    i32.const 1051436
                    call $_ZN3std10sys_common11at_exit_imp4push17h34b460b71ed8bd3fE
                    local.set $l2
                    i32.const 1024
                    i32.const 1
                    call $__rust_alloc
                    local.tee $l3
                    i32.eqz
                    br_if $B3
                    local.get $l0
                    i32.const 10
                    i32.add
                    i32.const 2
                    i32.add
                    local.tee $l4
                    local.get $l0
                    i32.const 13
                    i32.add
                    i32.const 2
                    i32.add
                    i32.load8_u
                    i32.store8
                    local.get $l0
                    local.get $l0
                    i32.load16_u offset=13 align=1
                    i32.store16 offset=10
                    i32.const 40
                    i32.const 4
                    call $__rust_alloc
                    local.tee $l1
                    i32.eqz
                    br_if $B2
                    local.get $l1
                    i32.const 0
                    i32.store8 offset=32
                    local.get $l1
                    i32.const 0
                    i32.store16 offset=28
                    local.get $l1
                    i64.const 1024
                    i64.store offset=20 align=4
                    local.get $l1
                    local.get $l3
                    i32.store offset=16
                    local.get $l1
                    i64.const 1
                    i64.store offset=8 align=4
                    local.get $l1
                    i64.const 4294967297
                    i64.store align=4
                    local.get $l1
                    local.get $l0
                    i32.load16_u offset=10
                    i32.store16 offset=33 align=1
                    local.get $l1
                    i32.const 0
                    i32.store8 offset=36
                    local.get $l1
                    local.get $l0
                    i32.load16_u offset=7 align=1
                    i32.store16 offset=37 align=1
                    local.get $l1
                    i32.const 35
                    i32.add
                    local.get $l4
                    i32.load8_u
                    i32.store8
                    local.get $l1
                    i32.const 39
                    i32.add
                    local.get $l0
                    i32.const 7
                    i32.add
                    i32.const 2
                    i32.add
                    i32.load8_u
                    i32.store8
                    local.get $l2
                    i32.eqz
                    br_if $B6
                    local.get $l1
                    local.get $l1
                    i32.load
                    local.tee $l2
                    i32.const 1
                    i32.add
                    i32.store
                    local.get $l2
                    i32.const -1
                    i32.le_s
                    br_if $B1
                    i32.const 4
                    i32.const 4
                    call $__rust_alloc
                    local.tee $l2
                    i32.eqz
                    br_if $B0
                    i32.const 0
                    local.get $l2
                    i32.store offset=1060184
                    local.get $l2
                    local.get $l1
                    i32.store
                    br $B6
                  end
                  local.get $l1
                  i32.load
                  local.tee $l1
                  local.get $l1
                  i32.load
                  local.tee $l2
                  i32.const 1
                  i32.add
                  i32.store
                  local.get $l2
                  i32.const -1
                  i32.le_s
                  br_if $B1
                end
                i32.const 0
                i32.const 0
                i32.store8 offset=1060188
                local.get $l0
                i32.const 16
                i32.add
                global.set $g0
                local.get $l1
                return
              end
              i32.const 1052132
              i32.const 32
              i32.const 1052116
              call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
              unreachable
            end
            i32.const 4
            i32.const 4
            call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
            unreachable
          end
          i32.const 1024
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        i32.const 40
        i32.const 4
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      unreachable
      unreachable
    end
    i32.const 4
    i32.const 4
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN57_$LT$std..io..stdio..Stdout$u20$as$u20$std..io..Write$GT$9write_fmt17h190349de6bf4a46aE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 0
    local.set $l4
    local.get $p1
    i32.load
    local.set $p1
    block $B0
      block $B1
        i32.const 0
        i32.load offset=1060264
        i32.const 1
        i32.ne
        br_if $B1
        i32.const 0
        i32.load offset=1060268
        local.set $l4
        br $B0
      end
      i32.const 0
      i64.const 1
      i64.store offset=1060264
    end
    i32.const 0
    local.get $l4
    i32.store offset=1060268
    local.get $l3
    local.get $l4
    i32.const 0
    i32.ne
    i32.store8 offset=4
    local.get $l3
    local.get $p1
    i32.const 8
    i32.add
    i32.store
    local.get $l3
    i32.const 3
    i32.store8 offset=12
    local.get $l3
    local.get $l3
    i32.store offset=8
    local.get $l3
    i32.const 24
    i32.add
    i32.const 16
    i32.add
    local.get $p2
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    i32.const 24
    i32.add
    i32.const 8
    i32.add
    local.get $p2
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    local.get $p2
    i64.load align=4
    i64.store offset=24
    block $B2
      block $B3
        block $B4
          block $B5
            block $B6
              local.get $l3
              i32.const 8
              i32.add
              i32.const 1050700
              local.get $l3
              i32.const 24
              i32.add
              call $_ZN4core3fmt5write17hfcf1a109ad62a790E
              i32.eqz
              br_if $B6
              block $B7
                local.get $l3
                i32.load8_u offset=12
                i32.const 3
                i32.ne
                br_if $B7
                i32.const 15
                i32.const 1
                call $__rust_alloc
                local.tee $p2
                i32.eqz
                br_if $B4
                local.get $p2
                i32.const 7
                i32.add
                i32.const 0
                i64.load offset=1050691 align=1
                i64.store align=1
                local.get $p2
                i32.const 0
                i64.load offset=1050684 align=1
                i64.store align=1
                i32.const 12
                i32.const 4
                call $__rust_alloc
                local.tee $l4
                i32.eqz
                br_if $B3
                local.get $l4
                i64.const 64424509455
                i64.store offset=4 align=4
                local.get $l4
                local.get $p2
                i32.store
                i32.const 12
                i32.const 4
                call $__rust_alloc
                local.tee $p2
                i32.eqz
                br_if $B2
                local.get $p2
                i32.const 16
                i32.store8 offset=8
                local.get $p2
                i32.const 1050060
                i32.store offset=4
                local.get $p2
                local.get $l4
                i32.store
                local.get $p2
                local.get $l3
                i32.load16_u offset=24 align=1
                i32.store16 offset=9 align=1
                local.get $p2
                i32.const 11
                i32.add
                local.get $l3
                i32.const 24
                i32.add
                i32.const 2
                i32.add
                i32.load8_u
                i32.store8
                local.get $p0
                i32.const 4
                i32.add
                local.get $p2
                i32.store
                local.get $p0
                i32.const 2
                i32.store
                br $B5
              end
              local.get $p0
              local.get $l3
              i64.load offset=12 align=4
              i64.store align=4
              br $B5
            end
            local.get $p0
            i32.const 3
            i32.store8
            block $B8
              i32.const 0
              br_if $B8
              local.get $l3
              i32.load8_u offset=12
              i32.const 2
              i32.ne
              br_if $B5
            end
            local.get $l3
            i32.const 16
            i32.add
            i32.load
            local.tee $p2
            i32.load
            local.get $p2
            i32.load offset=4
            i32.load
            call_indirect (type $t1) $T0
            block $B9
              local.get $p2
              i32.load offset=4
              local.tee $l4
              i32.load offset=4
              local.tee $p0
              i32.eqz
              br_if $B9
              local.get $p2
              i32.load
              local.get $p0
              local.get $l4
              i32.load offset=8
              call $__rust_dealloc
            end
            local.get $l3
            i32.load offset=16
            i32.const 12
            i32.const 4
            call $__rust_dealloc
          end
          block $B10
            local.get $l3
            i32.load8_u offset=4
            br_if $B10
            block $B11
              i32.const 0
              i32.load offset=1060264
              i32.const 1
              i32.eq
              br_if $B11
              i32.const 0
              i64.const 1
              i64.store offset=1060264
              br $B10
            end
            i32.const 0
            i32.load offset=1060268
            i32.eqz
            br_if $B10
            local.get $l3
            i32.load
            i32.const 1
            i32.store8 offset=28
          end
          local.get $l3
          i32.const 48
          i32.add
          global.set $g0
          return
        end
        i32.const 15
        i32.const 1
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    i32.const 12
    i32.const 4
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN3std2io5stdio9set_panic17h0fe36b48db669fb3E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 0
    local.set $l4
    block $B0
      block $B1
        block $B2
          i32.const 0
          i32.load offset=1060236
          i32.const 1
          i32.eq
          br_if $B2
          i32.const 0
          i64.const 1
          i64.store offset=1060236 align=4
          i32.const 0
          i32.const 0
          i32.store offset=1060244
          br $B1
        end
        i32.const 0
        i32.load offset=1060240
        br_if $B0
        i32.const 0
        i32.load offset=1060244
        local.set $l4
      end
      i32.const 0
      local.get $p1
      i32.store offset=1060244
      i32.const 0
      i32.load offset=1060248
      local.set $p1
      i32.const 0
      local.get $p2
      i32.store offset=1060248
      i32.const 0
      i32.const 0
      i32.store offset=1060240
      block $B3
        local.get $l4
        i32.eqz
        br_if $B3
        local.get $l3
        local.get $l4
        local.get $p1
        i32.load offset=20
        call_indirect (type $t5) $T0
        block $B4
          i32.const 0
          br_if $B4
          local.get $l3
          i32.load8_u
          i32.const 2
          i32.ne
          br_if $B3
        end
        local.get $l3
        i32.load offset=4
        local.tee $p2
        i32.load
        local.get $p2
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B5
          local.get $p2
          i32.load offset=4
          local.tee $l5
          i32.load offset=4
          local.tee $l6
          i32.eqz
          br_if $B5
          local.get $p2
          i32.load
          local.get $l6
          local.get $l5
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p2
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l4
      i32.store
      local.get $p0
      local.get $p1
      i32.store offset=4
      local.get $l3
      i32.const 16
      i32.add
      global.set $g0
      return
    end
    i32.const 1049016
    i32.const 16
    local.get $l3
    i32.const 8
    i32.add
    i32.const 1049316
    call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
    unreachable)
  (func $_ZN3std2io5stdio6_print17h73cc2a6cd91a4bddE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 96
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $l1
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p0
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l1
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p0
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l1
    local.get $p0
    i64.load align=4
    i64.store offset=8
    local.get $l1
    i32.const 6
    i32.store offset=36
    local.get $l1
    i32.const 1050624
    i32.store offset=32
    block $B0
      block $B1
        block $B2
          block $B3
            i32.const 0
            i32.load offset=1060220
            i32.const 1
            i32.eq
            br_if $B3
            i32.const 0
            i64.const -4294967295
            i64.store offset=1060220 align=4
            i32.const 0
            i32.const 0
            i32.store offset=1060228
            local.get $l1
            i32.const 56
            i32.add
            local.set $l2
            br $B2
          end
          local.get $l1
          i32.const 56
          i32.add
          local.set $l2
          i32.const 0
          i32.load offset=1060224
          br_if $B1
          i32.const 0
          i32.const -1
          i32.store offset=1060224
          local.get $l1
          i32.const 56
          i32.add
          local.set $l2
          i32.const 0
          i32.load offset=1060228
          local.tee $p0
          i32.eqz
          br_if $B2
          i32.const 0
          i32.load offset=1060232
          local.set $l3
          local.get $l1
          i32.const 72
          i32.add
          i32.const 16
          i32.add
          local.get $l1
          i32.const 8
          i32.add
          i32.const 16
          i32.add
          i64.load
          i64.store
          local.get $l1
          i32.const 72
          i32.add
          i32.const 8
          i32.add
          local.get $l1
          i32.const 8
          i32.add
          i32.const 8
          i32.add
          i64.load
          i64.store
          local.get $l1
          local.get $l1
          i64.load offset=8
          i64.store offset=72
          local.get $l1
          i32.const 56
          i32.add
          local.get $p0
          local.get $l1
          i32.const 72
          i32.add
          local.get $l3
          i32.load offset=28
          call_indirect (type $t6) $T0
          i32.const 0
          i32.const 0
          i32.load offset=1060224
          i32.const 1
          i32.add
          i32.store offset=1060224
          br $B0
        end
        i32.const 0
        i32.const 0
        i32.store offset=1060224
      end
      local.get $l1
      call $_ZN3std2io5stdio6stdout17hcaa61cf70468d43dE
      local.tee $p0
      i32.store offset=48
      local.get $l1
      i32.const 72
      i32.add
      i32.const 16
      i32.add
      local.get $l1
      i32.const 8
      i32.add
      i32.const 16
      i32.add
      i64.load
      i64.store
      local.get $l1
      i32.const 72
      i32.add
      i32.const 8
      i32.add
      local.get $l1
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      i64.load
      i64.store
      local.get $l1
      local.get $l1
      i64.load offset=8
      i64.store offset=72
      local.get $l2
      local.get $l1
      i32.const 48
      i32.add
      local.get $l1
      i32.const 72
      i32.add
      call $_ZN57_$LT$std..io..stdio..Stdout$u20$as$u20$std..io..Write$GT$9write_fmt17h190349de6bf4a46aE
      local.get $p0
      local.get $p0
      i32.load
      local.tee $l2
      i32.const -1
      i32.add
      i32.store
      block $B4
        local.get $l2
        i32.const 1
        i32.ne
        br_if $B4
        local.get $l1
        i32.const 48
        i32.add
        call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17he8fdb3a02dfeef57E
      end
      local.get $l1
      i32.const 56
      i32.add
      local.set $l2
    end
    block $B5
      block $B6
        local.get $l1
        i32.load offset=56
        local.tee $p0
        i32.const 255
        i32.and
        i32.const 4
        i32.eq
        br_if $B6
        local.get $l1
        local.get $l2
        i32.load offset=4
        i32.store offset=44
        local.get $l1
        local.get $p0
        i32.store offset=40
        br $B5
      end
      local.get $l1
      call $_ZN3std2io5stdio6stdout17hcaa61cf70468d43dE
      local.tee $p0
      i32.store offset=56
      local.get $l1
      i32.const 72
      i32.add
      i32.const 16
      i32.add
      local.get $l1
      i32.const 8
      i32.add
      i32.const 16
      i32.add
      i64.load
      i64.store
      local.get $l1
      i32.const 72
      i32.add
      i32.const 8
      i32.add
      local.get $l1
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      i64.load
      i64.store
      local.get $l1
      local.get $l1
      i64.load offset=8
      i64.store offset=72
      local.get $l1
      i32.const 40
      i32.add
      local.get $l1
      i32.const 56
      i32.add
      local.get $l1
      i32.const 72
      i32.add
      call $_ZN57_$LT$std..io..stdio..Stdout$u20$as$u20$std..io..Write$GT$9write_fmt17h190349de6bf4a46aE
      local.get $p0
      local.get $p0
      i32.load
      local.tee $l2
      i32.const -1
      i32.add
      i32.store
      block $B7
        local.get $l2
        i32.const 1
        i32.ne
        br_if $B7
        local.get $l1
        i32.const 56
        i32.add
        call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17he8fdb3a02dfeef57E
      end
      local.get $l1
      i32.load8_u offset=40
      local.set $p0
    end
    block $B8
      local.get $p0
      i32.const 255
      i32.and
      i32.const 3
      i32.ne
      br_if $B8
      block $B9
        block $B10
          i32.const 0
          br_if $B10
          local.get $p0
          i32.const 3
          i32.and
          i32.const 2
          i32.ne
          br_if $B9
        end
        local.get $l1
        i32.load offset=44
        local.tee $p0
        i32.load
        local.get $p0
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B11
          local.get $p0
          i32.load offset=4
          local.tee $l2
          i32.load offset=4
          local.tee $l3
          i32.eqz
          br_if $B11
          local.get $p0
          i32.load
          local.get $l3
          local.get $l2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $l1
      i32.const 96
      i32.add
      global.set $g0
      return
    end
    local.get $l1
    local.get $l1
    i64.load offset=40
    i64.store offset=48
    local.get $l1
    i32.const 92
    i32.add
    i32.const 2
    i32.store
    local.get $l1
    i32.const 68
    i32.add
    i32.const 12
    i32.store
    local.get $l1
    i64.const 2
    i64.store offset=76 align=4
    local.get $l1
    i32.const 1050568
    i32.store offset=72
    local.get $l1
    i32.const 16
    i32.store offset=60
    local.get $l1
    local.get $l1
    i32.const 56
    i32.add
    i32.store offset=88
    local.get $l1
    local.get $l1
    i32.const 48
    i32.add
    i32.store offset=64
    local.get $l1
    local.get $l1
    i32.const 32
    i32.add
    i32.store offset=56
    local.get $l1
    i32.const 72
    i32.add
    i32.const 1050608
    call $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE
    unreachable)
  (func $_ZN3std2io5Write14write_vectored17h86a5bea0959d2979E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $p3
    i32.const 3
    i32.shl
    local.set $p3
    local.get $p2
    i32.const -8
    i32.add
    local.set $l5
    block $B0
      loop $L1
        block $B2
          local.get $p3
          br_if $B2
          i32.const 0
          local.set $l6
          i32.const 1
          local.set $p2
          br $B0
        end
        local.get $p3
        i32.const -8
        i32.add
        local.set $p3
        local.get $l5
        i32.const 8
        i32.add
        local.set $l5
        local.get $p2
        i32.load offset=4
        local.set $l6
        local.get $p2
        i32.const 8
        i32.add
        local.set $p2
        local.get $l6
        i32.eqz
        br_if $L1
      end
      local.get $l5
      i32.load
      local.set $p2
    end
    local.get $l4
    local.get $l6
    i32.store offset=12
    local.get $l4
    local.get $p2
    i32.store offset=8
    local.get $l4
    i32.const 16
    i32.add
    i32.const 2
    local.get $l4
    i32.const 8
    i32.add
    i32.const 1
    call $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE
    block $B3
      block $B4
        local.get $l4
        i32.load16_u offset=16
        i32.const 1
        i32.eq
        br_if $B4
        local.get $p0
        local.get $l4
        i32.load offset=20
        i32.store offset=4
        i32.const 0
        local.set $p2
        br $B3
      end
      local.get $l4
      local.get $l4
      i32.load16_u offset=18
      i32.store16 offset=30
      local.get $p0
      local.get $l4
      i32.const 30
      i32.add
      call $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E
      i64.extend_i32_u
      i64.const 65535
      i64.and
      i64.const 32
      i64.shl
      i64.store offset=4 align=4
      i32.const 1
      local.set $p2
    end
    local.get $p0
    local.get $p2
    i32.store
    local.get $l4
    i32.const 32
    i32.add
    global.set $g0)
  (func $_ZN3std2io5Write9write_fmt17h05096837efcd9a38E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 3
    i32.store8 offset=12
    local.get $l3
    local.get $p1
    i32.store offset=8
    local.get $l3
    i32.const 24
    i32.add
    i32.const 16
    i32.add
    local.get $p2
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    i32.const 24
    i32.add
    i32.const 8
    i32.add
    local.get $p2
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l3
    local.get $p2
    i64.load align=4
    i64.store offset=24
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $l3
              i32.const 8
              i32.add
              i32.const 1050660
              local.get $l3
              i32.const 24
              i32.add
              call $_ZN4core3fmt5write17hfcf1a109ad62a790E
              i32.eqz
              br_if $B4
              block $B5
                local.get $l3
                i32.load8_u offset=12
                i32.const 3
                i32.ne
                br_if $B5
                i32.const 15
                i32.const 1
                call $__rust_alloc
                local.tee $p2
                i32.eqz
                br_if $B3
                local.get $p2
                i32.const 7
                i32.add
                i32.const 0
                i64.load offset=1050691 align=1
                i64.store align=1
                local.get $p2
                i32.const 0
                i64.load offset=1050684 align=1
                i64.store align=1
                i32.const 12
                i32.const 4
                call $__rust_alloc
                local.tee $p1
                i32.eqz
                br_if $B2
                local.get $p1
                i64.const 64424509455
                i64.store offset=4 align=4
                local.get $p1
                local.get $p2
                i32.store
                i32.const 12
                i32.const 4
                call $__rust_alloc
                local.tee $p2
                i32.eqz
                br_if $B1
                local.get $p2
                i32.const 16
                i32.store8 offset=8
                local.get $p2
                i32.const 1050060
                i32.store offset=4
                local.get $p2
                local.get $p1
                i32.store
                local.get $p2
                local.get $l3
                i32.load16_u offset=24 align=1
                i32.store16 offset=9 align=1
                local.get $p2
                i32.const 11
                i32.add
                local.get $l3
                i32.const 24
                i32.add
                i32.const 2
                i32.add
                i32.load8_u
                i32.store8
                local.get $p0
                i32.const 4
                i32.add
                local.get $p2
                i32.store
                local.get $p0
                i32.const 2
                i32.store
                br $B0
              end
              local.get $p0
              local.get $l3
              i64.load offset=12 align=4
              i64.store align=4
              br $B0
            end
            local.get $p0
            i32.const 3
            i32.store8
            block $B6
              i32.const 0
              br_if $B6
              local.get $l3
              i32.load8_u offset=12
              i32.const 2
              i32.ne
              br_if $B0
            end
            local.get $l3
            i32.const 16
            i32.add
            i32.load
            local.tee $p2
            i32.load
            local.get $p2
            i32.load offset=4
            i32.load
            call_indirect (type $t1) $T0
            block $B7
              local.get $p2
              i32.load offset=4
              local.tee $p0
              i32.load offset=4
              local.tee $p1
              i32.eqz
              br_if $B7
              local.get $p2
              i32.load
              local.get $p1
              local.get $p0
              i32.load offset=8
              call $__rust_dealloc
            end
            local.get $l3
            i32.load offset=16
            i32.const 12
            i32.const 4
            call $__rust_dealloc
            br $B0
          end
          i32.const 15
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        i32.const 12
        i32.const 4
        call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
        unreachable
      end
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    local.get $l3
    i32.const 48
    i32.add
    global.set $g0)
  (func $_ZN80_$LT$std..io..Write..write_fmt..Adaptor$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1062aea2e084a64bE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i64) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.get $p1
    local.get $p2
    call $_ZN3std2io5Write9write_all17h866c64fbad2ec5f1E
    i32.const 0
    local.set $p1
    block $B0
      local.get $l3
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B0
      local.get $l3
      i64.load offset=8
      local.set $l4
      block $B1
        block $B2
          i32.const 0
          br_if $B2
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B3
          local.get $p1
          i32.load offset=4
          local.tee $p2
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B3
          local.get $p1
          i32.load
          local.get $l5
          local.get $p2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l4
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l3
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN80_$LT$std..io..Write..write_fmt..Adaptor$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1293f9e8bfbaad59E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i64) (local $l5 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 8
    i32.add
    local.get $p0
    i32.load
    local.get $p1
    local.get $p2
    call $_ZN3std2io5Write9write_all17h9cd275f6a8b429a6E
    i32.const 0
    local.set $p1
    block $B0
      local.get $l3
      i32.load8_u offset=8
      i32.const 3
      i32.eq
      br_if $B0
      local.get $l3
      i64.load offset=8
      local.set $l4
      block $B1
        block $B2
          i32.const 0
          br_if $B2
          local.get $p0
          i32.load8_u offset=4
          i32.const 2
          i32.ne
          br_if $B1
        end
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.load
        local.get $p1
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B3
          local.get $p1
          i32.load offset=4
          local.tee $p2
          i32.load offset=4
          local.tee $l5
          i32.eqz
          br_if $B3
          local.get $p1
          i32.load
          local.get $l5
          local.get $p2
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.load offset=8
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $p0
      local.get $l4
      i64.store offset=4 align=4
      i32.const 1
      local.set $p1
    end
    local.get $l3
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN55_$LT$std..path..PathBuf$u20$as$u20$core..fmt..Debug$GT$3fmt17h496cc8f02947c32eE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=8
    local.get $p1
    call $_ZN73_$LT$std..sys_common..os_str_bytes..Slice$u20$as$u20$core..fmt..Debug$GT$3fmt17h4c537bfb2d616e72E)
  (func $_ZN59_$LT$std..process..ChildStdin$u20$as$u20$std..io..Write$GT$5flush17h8656765d9a5080b1E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    i32.const 3
    i32.store8)
  (func $_ZN3std7process5abort17h362ed0b9dee6f433E (type $t0)
    call $_ZN3std3sys4wasi14abort_internal17heab73aabe0addf7cE
    unreachable)
  (func $_ZN3std3sys4wasi14abort_internal17heab73aabe0addf7cE (type $t0)
    call $abort
    unreachable)
  (func $_ZN3std4sync4once4Once10call_inner17h797b92bb5c8c17f9E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    i32.const 2
    i32.or
    local.set $l5
    local.get $p0
    i32.load
    local.set $l6
    loop $L0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                local.get $l6
                local.tee $l7
                i32.const 3
                i32.gt_u
                br_if $B5
                block $B6
                  block $B7
                    block $B8
                      local.get $l7
                      br_table $B7 $B8 $B5 $B6 $B7
                    end
                    local.get $p1
                    i32.eqz
                    br_if $B4
                  end
                  local.get $p0
                  i32.const 2
                  local.get $p0
                  i32.load
                  local.tee $l6
                  local.get $l6
                  local.get $l7
                  i32.eq
                  select
                  i32.store
                  local.get $l6
                  local.get $l7
                  i32.ne
                  br_if $L0
                  local.get $l4
                  local.get $p0
                  i32.store
                  local.get $p2
                  local.get $l7
                  i32.const 1
                  i32.eq
                  local.get $p3
                  i32.load offset=12
                  call_indirect (type $t5) $T0
                  local.get $l4
                  i32.const 3
                  i32.store offset=4
                  local.get $l4
                  call $_ZN70_$LT$std..sync..once..WaiterQueue$u20$as$u20$core..ops..drop..Drop$GT$4drop17h97630c543e4247abE
                end
                local.get $l4
                i32.const 16
                i32.add
                global.set $g0
                return
              end
              block $B9
                local.get $l7
                i32.const 3
                i32.and
                i32.const 2
                i32.ne
                br_if $B9
                loop $L10
                  local.get $l7
                  local.set $l6
                  block $B11
                    i32.const 0
                    i32.load offset=1060252
                    i32.const 1
                    i32.eq
                    br_if $B11
                    i32.const 0
                    i64.const 1
                    i64.store offset=1060252 align=4
                    i32.const 0
                    i32.const 0
                    i32.store offset=1060260
                  end
                  i32.const 1060256
                  call $_ZN3std10sys_common11thread_info10ThreadInfo4with28_$u7b$$u7b$closure$u7d$$u7d$17h96d355bc87cdff06E
                  local.set $l8
                  local.get $p0
                  local.get $l5
                  local.get $p0
                  i32.load
                  local.tee $l7
                  local.get $l7
                  local.get $l6
                  i32.eq
                  select
                  i32.store
                  local.get $l4
                  i32.const 0
                  i32.store8 offset=8
                  local.get $l4
                  local.get $l8
                  i32.store
                  local.get $l4
                  local.get $l6
                  i32.const -4
                  i32.and
                  i32.store offset=4
                  block $B12
                    local.get $l7
                    local.get $l6
                    i32.ne
                    br_if $B12
                    local.get $l4
                    i32.load8_u offset=8
                    i32.eqz
                    br_if $B3
                    br $B2
                  end
                  block $B13
                    local.get $l4
                    i32.load
                    local.tee $l6
                    i32.eqz
                    br_if $B13
                    local.get $l6
                    local.get $l6
                    i32.load
                    local.tee $l8
                    i32.const -1
                    i32.add
                    i32.store
                    local.get $l8
                    i32.const 1
                    i32.ne
                    br_if $B13
                    local.get $l4
                    call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
                  end
                  local.get $l7
                  i32.const 3
                  i32.and
                  i32.const 2
                  i32.eq
                  br_if $L10
                  br $B1
                end
              end
              i32.const 1050884
              i32.const 57
              i32.const 1050868
              call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
              unreachable
            end
            i32.const 1050960
            i32.const 42
            i32.const 1050944
            call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
            unreachable
          end
          loop $L14
            call $_ZN3std6thread4park17hebe92512914c513eE
            local.get $l4
            i32.load8_u offset=8
            i32.eqz
            br_if $L14
          end
        end
        local.get $l4
        i32.load
        local.tee $l7
        i32.eqz
        br_if $B1
        local.get $l7
        local.get $l7
        i32.load
        local.tee $l6
        i32.const -1
        i32.add
        i32.store
        local.get $l6
        i32.const 1
        i32.ne
        br_if $B1
        local.get $l4
        call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
        local.get $p0
        i32.load
        local.set $l6
        br $L0
      end
      local.get $p0
      i32.load
      local.set $l6
      br $L0
    end)
  (func $_ZN70_$LT$std..sync..once..WaiterQueue$u20$as$u20$core..ops..drop..Drop$GT$4drop17h97630c543e4247abE (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $p0
    i32.load
    local.tee $l2
    i32.load
    local.set $l3
    local.get $l2
    local.get $p0
    i32.load offset=4
    i32.store
    local.get $l1
    local.get $l3
    i32.const 3
    i32.and
    local.tee $p0
    i32.store offset=12
    block $B0
      local.get $p0
      i32.const 2
      i32.ne
      br_if $B0
      block $B1
        block $B2
          local.get $l3
          i32.const -4
          i32.and
          local.tee $p0
          i32.eqz
          br_if $B2
          loop $L3
            local.get $p0
            i32.load offset=4
            local.set $l3
            local.get $p0
            i32.load
            local.set $l2
            local.get $p0
            i32.const 0
            i32.store
            local.get $l2
            i32.eqz
            br_if $B1
            local.get $p0
            i32.const 1
            i32.store8 offset=8
            local.get $l1
            local.get $l2
            i32.store offset=16
            local.get $l1
            i32.const 16
            i32.add
            call $_ZN3std6thread6Thread6unpark17hcdf1bb531de9b0e3E
            local.get $l1
            i32.load offset=16
            local.tee $p0
            local.get $p0
            i32.load
            local.tee $p0
            i32.const -1
            i32.add
            i32.store
            block $B4
              local.get $p0
              i32.const 1
              i32.ne
              br_if $B4
              local.get $l1
              i32.const 16
              i32.add
              call $_ZN5alloc4sync12Arc$LT$T$GT$9drop_slow17hc6546ca9dd6dc1dcE
            end
            local.get $l3
            local.set $p0
            local.get $l3
            br_if $L3
          end
        end
        local.get $l1
        i32.const 64
        i32.add
        global.set $g0
        return
      end
      i32.const 1049272
      i32.const 43
      i32.const 1049212
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $l1
    i32.const 52
    i32.add
    i32.const 11
    i32.store
    local.get $l1
    i32.const 36
    i32.add
    i32.const 2
    i32.store
    local.get $l1
    i64.const 3
    i64.store offset=20 align=4
    local.get $l1
    i32.const 1049188
    i32.store offset=16
    local.get $l1
    i32.const 11
    i32.store offset=44
    local.get $l1
    local.get $l1
    i32.const 12
    i32.add
    i32.store offset=56
    local.get $l1
    i32.const 1049648
    i32.store offset=60
    local.get $l1
    local.get $l1
    i32.const 40
    i32.add
    i32.store offset=32
    local.get $l1
    local.get $l1
    i32.const 60
    i32.add
    i32.store offset=48
    local.get $l1
    local.get $l1
    i32.const 56
    i32.add
    i32.store offset=40
    local.get $l1
    i32.const 16
    i32.add
    i32.const 1051004
    call $_ZN3std9panicking15begin_panic_fmt17h9216cb62aa7580cfE
    unreachable)
  (func $_ZN91_$LT$std..sys_common..backtrace.._print..DisplayBacktrace$u20$as$u20$core..fmt..Display$GT$3fmt17h096f731f418d975eE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i64) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load8_u
    local.set $p0
    local.get $l2
    i32.const 40
    i32.add
    call $_ZN3std3sys4wasi11unsupported17h11b4db5af84c26cdE
    block $B0
      block $B1
        local.get $l2
        i32.load offset=40
        i32.const 1
        i32.eq
        br_if $B1
        local.get $l2
        i32.const 48
        i32.add
        i64.load
        local.set $l3
        local.get $l2
        i32.load offset=44
        local.set $l4
        br $B0
      end
      i32.const 0
      local.set $l4
      block $B2
        local.get $l2
        i32.load8_u offset=44
        i32.const 2
        i32.lt_u
        br_if $B2
        local.get $l2
        i32.const 48
        i32.add
        i32.load
        local.tee $l5
        i32.load
        local.get $l5
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B3
          local.get $l5
          i32.load offset=4
          local.tee $l6
          i32.load offset=4
          local.tee $l7
          i32.eqz
          br_if $B3
          local.get $l5
          i32.load
          local.get $l7
          local.get $l6
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $l5
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
    end
    local.get $l2
    local.get $l3
    i64.store offset=4 align=4
    local.get $l2
    local.get $l4
    i32.store
    local.get $l2
    local.get $p0
    i32.store8 offset=12
    local.get $l2
    i32.const 16
    i32.add
    local.get $p1
    local.get $p0
    local.get $l2
    i32.const 1051104
    call $_ZN9backtrace5print12BacktraceFmt3new17h3562e51bd8d13c0eE
    block $B4
      block $B5
        local.get $l2
        i32.const 16
        i32.add
        call $_ZN9backtrace5print12BacktraceFmt11add_context17h1b4ea7782846643bE
        br_if $B5
        local.get $l2
        i32.const 16
        i32.add
        call $_ZN9backtrace5print12BacktraceFmt6finish17h9017d7f9b2b9c182E
        br_if $B5
        block $B6
          local.get $p0
          i32.const 255
          i32.and
          br_if $B6
          local.get $l2
          i64.const 4
          i64.store offset=56
          local.get $l2
          i64.const 1
          i64.store offset=44 align=4
          local.get $l2
          i32.const 1051212
          i32.store offset=40
          local.get $p1
          local.get $l2
          i32.const 40
          i32.add
          call $_ZN4core3fmt9Formatter9write_fmt17h82e7776a00521c64E
          br_if $B5
        end
        i32.const 0
        local.set $p0
        local.get $l2
        i32.load
        local.tee $p1
        i32.eqz
        br_if $B4
        local.get $l2
        i32.load offset=4
        local.tee $l4
        i32.eqz
        br_if $B4
        local.get $p1
        local.get $l4
        i32.const 1
        call $__rust_dealloc
        br $B4
      end
      i32.const 1
      local.set $p0
      local.get $l2
      i32.load
      local.tee $p1
      i32.eqz
      br_if $B4
      local.get $l2
      i32.load offset=4
      local.tee $l4
      i32.eqz
      br_if $B4
      i32.const 1
      local.set $p0
      local.get $p1
      local.get $l4
      i32.const 1
      call $__rust_dealloc
    end
    local.get $l2
    i32.const 64
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN3std10sys_common9backtrace10_print_fmt28_$u7b$$u7b$closure$u7d$$u7d$17hfe094cc5cdbff206E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    block $B0
      block $B1
        local.get $p2
        i32.load
        i32.const 1
        i32.ne
        br_if $B1
        i32.const 1051224
        local.set $p2
        i32.const 9
        local.set $l4
        br $B0
      end
      local.get $l3
      i32.const 16
      i32.add
      local.get $p2
      i32.load offset=4
      local.get $p2
      i32.const 8
      i32.add
      i32.load
      call $_ZN4core3str9from_utf817h5f5991ab7674ad2aE
      i32.const 1051224
      local.get $l3
      i32.load offset=20
      local.get $l3
      i32.load offset=16
      i32.const 1
      i32.eq
      local.tee $l4
      select
      local.set $p2
      i32.const 9
      local.get $l3
      i32.const 16
      i32.add
      i32.const 8
      i32.add
      i32.load
      local.get $l4
      select
      local.set $l4
    end
    local.get $l3
    i32.const 8
    i32.add
    local.get $p2
    local.get $l4
    call $_ZN4core3str5lossy9Utf8Lossy10from_bytes17h87ecc792cefcf2c6E
    local.get $l3
    i32.load offset=8
    local.get $l3
    i32.load offset=12
    local.get $p1
    call $_ZN66_$LT$core..str..lossy..Utf8Lossy$u20$as$u20$core..fmt..Display$GT$3fmt17hb36124806d3524c1E
    local.set $p2
    local.get $l3
    i32.const 32
    i32.add
    global.set $g0
    local.get $p2)
  (func $_ZN3std10sys_common9backtrace28__rust_begin_short_backtrace17h65c70e0324e09f34E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    local.get $p1
    i32.load offset=12
    call_indirect (type $t7) $T0)
  (func $_ZN3std3sys4wasi7condvar7Condvar4wait17hfeb5282b98892f36E (type $t5) (param $p0 i32) (param $p1 i32)
    i32.const 1052048
    i32.const 29
    i32.const 1052032
    call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
    unreachable)
  (func $_ZN82_$LT$std..sys_common..poison..PoisonError$LT$T$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h1ee80a1fbd3ea532E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    i32.const 1051233
    i32.const 25
    local.get $p1
    call $_ZN40_$LT$str$u20$as$u20$core..fmt..Debug$GT$3fmt17hb0d1558d5b23100eE)
  (func $_ZN76_$LT$std..sys_common..thread_local..Key$u20$as$u20$core..ops..drop..Drop$GT$4drop17h262053133a3af68bE (type $t1) (param $p0 i32))
  (func $_ZN3std10sys_common4util10dumb_print17h46186e5a505e4e83E (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $l1
    i32.const 16
    i32.add
    i32.const 16
    i32.add
    local.get $p0
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l1
    i32.const 16
    i32.add
    i32.const 8
    i32.add
    local.get $p0
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l1
    local.get $p0
    i64.load align=4
    i64.store offset=16
    local.get $l1
    i32.const 8
    i32.add
    local.get $l1
    i32.const 40
    i32.add
    local.get $l1
    i32.const 16
    i32.add
    call $_ZN3std2io5Write9write_fmt17h05096837efcd9a38E
    block $B0
      block $B1
        i32.const 0
        br_if $B1
        local.get $l1
        i32.load8_u offset=8
        i32.const 2
        i32.ne
        br_if $B0
      end
      local.get $l1
      i32.load offset=12
      local.tee $p0
      i32.load
      local.get $p0
      i32.load offset=4
      i32.load
      call_indirect (type $t1) $T0
      block $B2
        local.get $p0
        i32.load offset=4
        local.tee $l2
        i32.load offset=4
        local.tee $l3
        i32.eqz
        br_if $B2
        local.get $p0
        i32.load
        local.get $l3
        local.get $l2
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $p0
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    local.get $l1
    i32.const 48
    i32.add
    global.set $g0)
  (func $_ZN3std10sys_common4util5abort17hfabe9033db580a9dE (type $t1) (param $p0 i32)
    (local $l1 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $l1
    i32.const 20
    i32.add
    i32.const 1
    i32.store
    local.get $l1
    i64.const 2
    i64.store offset=4 align=4
    local.get $l1
    i32.const 1051372
    i32.store
    local.get $l1
    i32.const 10
    i32.store offset=28
    local.get $l1
    local.get $p0
    i32.store offset=24
    local.get $l1
    local.get $l1
    i32.const 24
    i32.add
    i32.store offset=16
    local.get $l1
    call $_ZN3std10sys_common4util10dumb_print17h46186e5a505e4e83E
    call $_ZN3std3sys4wasi14abort_internal17heab73aabe0addf7cE
    unreachable)
  (func $_ZN3std5alloc24default_alloc_error_hook17hb9eeeb3b6d7c3dcbE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    i32.const 17
    i32.store offset=12
    local.get $l2
    local.get $p0
    i32.store offset=20
    local.get $l2
    local.get $l2
    i32.const 20
    i32.add
    i32.store offset=8
    local.get $l2
    i32.const 52
    i32.add
    i32.const 1
    i32.store
    local.get $l2
    i64.const 2
    i64.store offset=36 align=4
    local.get $l2
    i32.const 1051488
    i32.store offset=32
    local.get $l2
    local.get $l2
    i32.const 8
    i32.add
    i32.store offset=48
    local.get $l2
    i32.const 24
    i32.add
    local.get $l2
    i32.const 56
    i32.add
    local.get $l2
    i32.const 32
    i32.add
    call $_ZN3std2io5Write9write_fmt17h05096837efcd9a38E
    block $B0
      block $B1
        i32.const 0
        br_if $B1
        local.get $l2
        i32.load8_u offset=24
        i32.const 2
        i32.ne
        br_if $B0
      end
      local.get $l2
      i32.load offset=28
      local.tee $p0
      i32.load
      local.get $p0
      i32.load offset=4
      i32.load
      call_indirect (type $t1) $T0
      block $B2
        local.get $p0
        i32.load offset=4
        local.tee $l3
        i32.load offset=4
        local.tee $l4
        i32.eqz
        br_if $B2
        local.get $p0
        i32.load
        local.get $l4
        local.get $l3
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $p0
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    local.get $l2
    i32.const 64
    i32.add
    global.set $g0)
  (func $rust_oom (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    local.get $p0
    local.get $p1
    i32.const 0
    i32.load offset=1060204
    local.tee $l2
    i32.const 18
    local.get $l2
    select
    call_indirect (type $t5) $T0
    call $_ZN3std3sys4wasi14abort_internal17heab73aabe0addf7cE
    unreachable)
  (func $__rdl_alloc (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    block $B0
      local.get $p1
      i32.const 8
      i32.gt_u
      br_if $B0
      local.get $p1
      local.get $p0
      i32.gt_u
      br_if $B0
      local.get $p0
      call $malloc
      return
    end
    local.get $p0
    local.get $p1
    call $aligned_alloc)
  (func $__rdl_dealloc (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    call $free)
  (func $__rdl_realloc (type $t9) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (result i32)
    block $B0
      block $B1
        local.get $p2
        i32.const 8
        i32.gt_u
        br_if $B1
        local.get $p2
        local.get $p3
        i32.le_u
        br_if $B0
      end
      block $B2
        local.get $p3
        local.get $p2
        call $aligned_alloc
        local.tee $p2
        br_if $B2
        i32.const 0
        return
      end
      local.get $p2
      local.get $p0
      local.get $p3
      local.get $p1
      local.get $p1
      local.get $p3
      i32.gt_u
      select
      call $memcpy
      local.set $p3
      local.get $p0
      call $free
      local.get $p3
      return
    end
    local.get $p0
    local.get $p3
    call $realloc)
  (func $_ZN3std9panicking12default_hook28_$u7b$$u7b$closure$u7d$$u7d$17h6b1ecc93fccebbd3E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 20
    i32.add
    i32.const 3
    i32.store
    local.get $l3
    i32.const 32
    i32.add
    i32.const 20
    i32.add
    i32.const 19
    i32.store
    local.get $l3
    i32.const 44
    i32.add
    i32.const 16
    i32.store
    local.get $l3
    i64.const 4
    i64.store offset=4 align=4
    local.get $l3
    i32.const 1051624
    i32.store
    local.get $l3
    i32.const 16
    i32.store offset=36
    local.get $l3
    local.get $p0
    i32.load offset=8
    i32.store offset=48
    local.get $l3
    local.get $p0
    i32.load offset=4
    i32.store offset=40
    local.get $l3
    local.get $p0
    i32.load
    i32.store offset=32
    local.get $l3
    local.get $l3
    i32.const 32
    i32.add
    i32.store offset=16
    local.get $l3
    i32.const 24
    i32.add
    local.get $p1
    local.get $l3
    local.get $p2
    i32.load offset=28
    local.tee $p2
    call_indirect (type $t6) $T0
    block $B0
      block $B1
        i32.const 0
        br_if $B1
        local.get $l3
        i32.load8_u offset=24
        i32.const 2
        i32.ne
        br_if $B0
      end
      local.get $l3
      i32.load offset=28
      local.tee $l4
      i32.load
      local.get $l4
      i32.load offset=4
      i32.load
      call_indirect (type $t1) $T0
      block $B2
        local.get $l4
        i32.load offset=4
        local.tee $l5
        i32.load offset=4
        local.tee $l6
        i32.eqz
        br_if $B2
        local.get $l4
        i32.load
        local.get $l6
        local.get $l5
        i32.load offset=8
        call $__rust_dealloc
      end
      local.get $l4
      i32.const 12
      i32.const 4
      call $__rust_dealloc
    end
    block $B3
      block $B4
        block $B5
          block $B6
            local.get $p0
            i32.load offset=12
            i32.load8_u
            local.tee $l4
            i32.const -3
            i32.add
            i32.const 255
            i32.and
            local.tee $p0
            i32.const 1
            i32.add
            i32.const 0
            local.get $p0
            i32.const 2
            i32.lt_u
            select
            br_table $B6 $B4 $B5 $B6
          end
          i32.const 0
          i32.load8_u offset=1060274
          br_if $B3
          i32.const 0
          i32.const 1
          i32.store8 offset=1060274
          local.get $l3
          i32.const 52
          i32.add
          i32.const 1
          i32.store
          local.get $l3
          i64.const 1
          i64.store offset=36 align=4
          local.get $l3
          i32.const 1050464
          i32.store offset=32
          local.get $l3
          i32.const 20
          i32.store offset=4
          local.get $l3
          local.get $l4
          i32.store8 offset=63
          local.get $l3
          local.get $l3
          i32.store offset=48
          local.get $l3
          local.get $l3
          i32.const 63
          i32.add
          i32.store
          local.get $l3
          i32.const 24
          i32.add
          local.get $p1
          local.get $l3
          i32.const 32
          i32.add
          local.get $p2
          call_indirect (type $t6) $T0
          i32.const 0
          i32.const 0
          i32.store8 offset=1060274
          block $B7
            i32.const 0
            br_if $B7
            local.get $l3
            i32.load8_u offset=24
            i32.const 2
            i32.ne
            br_if $B4
          end
          local.get $l3
          i32.load offset=28
          local.tee $p0
          i32.load
          local.get $p0
          i32.load offset=4
          i32.load
          call_indirect (type $t1) $T0
          block $B8
            local.get $p0
            i32.load offset=4
            local.tee $p1
            i32.load offset=4
            local.tee $p2
            i32.eqz
            br_if $B8
            local.get $p0
            i32.load
            local.get $p2
            local.get $p1
            i32.load offset=8
            call $__rust_dealloc
          end
          local.get $p0
          i32.const 12
          i32.const 4
          call $__rust_dealloc
          br $B4
        end
        i32.const 0
        i32.load8_u offset=1060176
        local.set $p0
        i32.const 0
        i32.const 0
        i32.store8 offset=1060176
        local.get $p0
        i32.eqz
        br_if $B4
        local.get $l3
        i64.const 4
        i64.store offset=48
        local.get $l3
        i64.const 1
        i64.store offset=36 align=4
        local.get $l3
        i32.const 1051736
        i32.store offset=32
        local.get $l3
        local.get $p1
        local.get $l3
        i32.const 32
        i32.add
        local.get $p2
        call_indirect (type $t6) $T0
        block $B9
          i32.const 0
          br_if $B9
          local.get $l3
          i32.load8_u
          i32.const 2
          i32.ne
          br_if $B4
        end
        local.get $l3
        i32.load offset=4
        local.tee $p0
        i32.load
        local.get $p0
        i32.load offset=4
        i32.load
        call_indirect (type $t1) $T0
        block $B10
          local.get $p0
          i32.load offset=4
          local.tee $p1
          i32.load offset=4
          local.tee $p2
          i32.eqz
          br_if $B10
          local.get $p0
          i32.load
          local.get $p2
          local.get $p1
          i32.load offset=8
          call $__rust_dealloc
        end
        local.get $p0
        i32.const 12
        i32.const 4
        call $__rust_dealloc
      end
      local.get $l3
      i32.const 64
      i32.add
      global.set $g0
      return
    end
    i32.const 1052132
    i32.const 32
    i32.const 1052116
    call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
    unreachable)
  (func $_ZN3std9panicking3try7do_call17hf5839ff2595c7a9dE (type $t1) (param $p0 i32)
    (local $l1 i32)
    local.get $p0
    local.get $p0
    i32.load
    local.tee $l1
    i32.load
    local.get $l1
    i32.load offset=4
    call $_ZN3std10sys_common9backtrace28__rust_begin_short_backtrace17h65c70e0324e09f34E
    i32.store)
  (func $rust_begin_unwind (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i64) (local $l5 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l1
    global.set $g0
    local.get $p0
    call $_ZN4core5panic9PanicInfo8location17h357305d15ad07bb1E
    call $_ZN4core6option15Option$LT$T$GT$6unwrap17hee975c3246ce38eaE
    local.set $l2
    local.get $p0
    call $_ZN4core5panic9PanicInfo7message17hb84043bc9031cd9eE
    call $_ZN4core6option15Option$LT$T$GT$6unwrap17h6709741fa9488087E
    local.set $l3
    local.get $l1
    i32.const 8
    i32.add
    local.get $l2
    call $_ZN4core5panic8Location4file17h6490e08da345e876E
    local.get $l1
    i64.load offset=8
    local.set $l4
    local.get $l2
    call $_ZN4core5panic8Location4line17h71a3180f1307af29E
    local.set $l5
    local.get $l1
    local.get $l2
    call $_ZN4core5panic8Location6column17hb12aa6066069c5f2E
    i32.store offset=28
    local.get $l1
    local.get $l5
    i32.store offset=24
    local.get $l1
    local.get $l4
    i64.store offset=16
    local.get $l1
    i32.const 0
    i32.store offset=36
    local.get $l1
    local.get $l3
    i32.store offset=32
    local.get $l1
    i32.const 32
    i32.add
    i32.const 1051744
    local.get $p0
    call $_ZN4core5panic9PanicInfo7message17hb84043bc9031cd9eE
    local.get $l1
    i32.const 16
    i32.add
    call $_ZN3std9panicking20rust_panic_with_hook17he4dc0f0856de48d3E
    unreachable)
  (func $_ZN3std9panicking20rust_panic_with_hook17he4dc0f0856de48d3E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l4
    global.set $g0
    i32.const 1
    local.set $l5
    local.get $p3
    i32.load offset=12
    local.set $l6
    local.get $p3
    i32.load offset=8
    local.set $l7
    local.get $p3
    i32.load offset=4
    local.set $l8
    local.get $p3
    i32.load
    local.set $p3
    block $B0
      block $B1
        block $B2
          block $B3
            i32.const 0
            i32.load offset=1060264
            i32.const 1
            i32.eq
            br_if $B3
            i32.const 0
            i64.const 4294967297
            i64.store offset=1060264
            br $B2
          end
          i32.const 0
          i32.const 0
          i32.load offset=1060268
          i32.const 1
          i32.add
          local.tee $l5
          i32.store offset=1060268
          local.get $l5
          i32.const 2
          i32.gt_u
          br_if $B1
        end
        local.get $l4
        i32.const 24
        i32.add
        local.get $p3
        local.get $l8
        local.get $l7
        local.get $l6
        call $_ZN4core5panic8Location20internal_constructor17h8b867236d764bd5aE
        local.get $l4
        local.get $p2
        i32.store offset=48
        local.get $l4
        i32.const 1049228
        i32.store offset=44
        local.get $l4
        i32.const 1
        i32.store offset=40
        i32.const 0
        i32.load offset=1060208
        local.set $p3
        local.get $l4
        local.get $l4
        i32.const 24
        i32.add
        i32.store offset=52
        block $B4
          local.get $p3
          i32.const -1
          i32.le_s
          br_if $B4
          i32.const 0
          local.get $p3
          i32.const 1
          i32.add
          i32.store offset=1060208
          block $B5
            block $B6
              i32.const 0
              i32.load offset=1060216
              local.tee $p3
              br_if $B6
              local.get $l4
              i32.const 8
              i32.add
              local.get $p0
              local.get $p1
              i32.load offset=16
              call_indirect (type $t5) $T0
              local.get $l4
              local.get $l4
              i64.load offset=8
              i64.store offset=40
              local.get $l4
              i32.const 40
              i32.add
              call $_ZN3std9panicking12default_hook17h89bc2ff7722c02f2E
              br $B5
            end
            i32.const 0
            i32.load offset=1060212
            local.set $p2
            local.get $l4
            i32.const 16
            i32.add
            local.get $p0
            local.get $p1
            i32.load offset=16
            call_indirect (type $t5) $T0
            local.get $l4
            local.get $l4
            i64.load offset=16
            i64.store offset=40
            local.get $p2
            local.get $l4
            i32.const 40
            i32.add
            local.get $p3
            i32.load offset=12
            call_indirect (type $t5) $T0
          end
          i32.const 0
          i32.const 0
          i32.load offset=1060208
          i32.const -1
          i32.add
          i32.store offset=1060208
          local.get $l5
          i32.const 1
          i32.le_u
          br_if $B0
          local.get $l4
          i64.const 4
          i64.store offset=72
          local.get $l4
          i64.const 1
          i64.store offset=60 align=4
          local.get $l4
          i32.const 1051920
          i32.store offset=56
          local.get $l4
          i32.const 56
          i32.add
          call $_ZN3std10sys_common4util10dumb_print17h46186e5a505e4e83E
          unreachable
          unreachable
        end
        local.get $l4
        i64.const 4
        i64.store offset=72
        local.get $l4
        i64.const 1
        i64.store offset=60 align=4
        local.get $l4
        i32.const 1052252
        i32.store offset=56
        local.get $l4
        i32.const 56
        i32.add
        call $_ZN3std10sys_common4util5abort17hfabe9033db580a9dE
        unreachable
      end
      local.get $l4
      i64.const 4
      i64.store offset=72
      local.get $l4
      i64.const 1
      i64.store offset=60 align=4
      local.get $l4
      i32.const 1051868
      i32.store offset=56
      local.get $l4
      i32.const 56
      i32.add
      call $_ZN3std10sys_common4util10dumb_print17h46186e5a505e4e83E
      unreachable
      unreachable
    end
    local.get $p0
    local.get $p1
    call $rust_panic
    unreachable)
  (func $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17hc0c5f25526a95900E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      local.get $p1
      i32.load offset=4
      local.tee $l3
      br_if $B0
      local.get $p1
      i32.const 4
      i32.add
      local.set $l3
      local.get $p1
      i32.load
      local.set $l4
      local.get $l2
      i32.const 0
      i32.store offset=32
      local.get $l2
      i64.const 1
      i64.store offset=24
      local.get $l2
      local.get $l2
      i32.const 24
      i32.add
      i32.store offset=36
      local.get $l2
      i32.const 40
      i32.add
      i32.const 16
      i32.add
      local.get $l4
      i32.const 16
      i32.add
      i64.load align=4
      i64.store
      local.get $l2
      i32.const 40
      i32.add
      i32.const 8
      i32.add
      local.get $l4
      i32.const 8
      i32.add
      i64.load align=4
      i64.store
      local.get $l2
      local.get $l4
      i64.load align=4
      i64.store offset=40
      local.get $l2
      i32.const 36
      i32.add
      i32.const 1048976
      local.get $l2
      i32.const 40
      i32.add
      call $_ZN4core3fmt5write17hfcf1a109ad62a790E
      drop
      local.get $l2
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      local.tee $l4
      local.get $l2
      i32.load offset=32
      i32.store
      local.get $l2
      local.get $l2
      i64.load offset=24
      i64.store offset=8
      block $B1
        local.get $p1
        i32.load offset=4
        local.tee $l5
        i32.eqz
        br_if $B1
        local.get $p1
        i32.const 8
        i32.add
        i32.load
        local.tee $l6
        i32.eqz
        br_if $B1
        local.get $l5
        local.get $l6
        i32.const 1
        call $__rust_dealloc
      end
      local.get $l3
      local.get $l2
      i64.load offset=8
      i64.store align=4
      local.get $l3
      i32.const 8
      i32.add
      local.get $l4
      i32.load
      i32.store
      local.get $l3
      i32.load
      local.set $l3
    end
    local.get $p1
    i32.const 1
    i32.store offset=4
    local.get $p1
    i32.const 12
    i32.add
    i32.load
    local.set $l4
    local.get $p1
    i32.const 8
    i32.add
    local.tee $p1
    i32.load
    local.set $l5
    local.get $p1
    i64.const 0
    i64.store align=4
    block $B2
      i32.const 12
      i32.const 4
      call $__rust_alloc
      local.tee $p1
      br_if $B2
      i32.const 12
      i32.const 4
      call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
      unreachable
    end
    local.get $p1
    local.get $l4
    i32.store offset=8
    local.get $p1
    local.get $l5
    i32.store offset=4
    local.get $p1
    local.get $l3
    i32.store
    local.get $p0
    i32.const 1051764
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store
    local.get $l2
    i32.const 64
    i32.add
    global.set $g0)
  (func $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h1588f2a7085685f0E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p1
    i32.const 4
    i32.add
    local.set $l3
    block $B0
      local.get $p1
      i32.load offset=4
      br_if $B0
      local.get $p1
      i32.load
      local.set $l4
      local.get $l2
      i32.const 0
      i32.store offset=32
      local.get $l2
      i64.const 1
      i64.store offset=24
      local.get $l2
      local.get $l2
      i32.const 24
      i32.add
      i32.store offset=36
      local.get $l2
      i32.const 40
      i32.add
      i32.const 16
      i32.add
      local.get $l4
      i32.const 16
      i32.add
      i64.load align=4
      i64.store
      local.get $l2
      i32.const 40
      i32.add
      i32.const 8
      i32.add
      local.get $l4
      i32.const 8
      i32.add
      i64.load align=4
      i64.store
      local.get $l2
      local.get $l4
      i64.load align=4
      i64.store offset=40
      local.get $l2
      i32.const 36
      i32.add
      i32.const 1048976
      local.get $l2
      i32.const 40
      i32.add
      call $_ZN4core3fmt5write17hfcf1a109ad62a790E
      drop
      local.get $l2
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      local.tee $l4
      local.get $l2
      i32.load offset=32
      i32.store
      local.get $l2
      local.get $l2
      i64.load offset=24
      i64.store offset=8
      block $B1
        local.get $p1
        i32.load offset=4
        local.tee $l5
        i32.eqz
        br_if $B1
        local.get $p1
        i32.const 8
        i32.add
        i32.load
        local.tee $p1
        i32.eqz
        br_if $B1
        local.get $l5
        local.get $p1
        i32.const 1
        call $__rust_dealloc
      end
      local.get $l3
      local.get $l2
      i64.load offset=8
      i64.store align=4
      local.get $l3
      i32.const 8
      i32.add
      local.get $l4
      i32.load
      i32.store
    end
    local.get $p0
    i32.const 1051764
    i32.store offset=4
    local.get $p0
    local.get $l3
    i32.store
    local.get $l2
    i32.const 64
    i32.add
    global.set $g0)
  (func $_ZN91_$LT$std..panicking..begin_panic..PanicPayload$LT$A$GT$$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17he53b475dd6514585E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32)
    local.get $p1
    i32.load
    local.set $l2
    local.get $p1
    i32.const 0
    i32.store
    block $B0
      block $B1
        local.get $l2
        i32.eqz
        br_if $B1
        local.get $p1
        i32.load offset=4
        local.set $l3
        i32.const 8
        i32.const 4
        call $__rust_alloc
        local.tee $p1
        i32.eqz
        br_if $B0
        local.get $p1
        local.get $l3
        i32.store offset=4
        local.get $p1
        local.get $l2
        i32.store
        local.get $p0
        i32.const 1051800
        i32.store offset=4
        local.get $p0
        local.get $p1
        i32.store
        return
      end
      call $_ZN3std7process5abort17h362ed0b9dee6f433E
      unreachable
    end
    i32.const 8
    i32.const 4
    call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
    unreachable)
  (func $_ZN91_$LT$std..panicking..begin_panic..PanicPayload$LT$A$GT$$u20$as$u20$core..panic..BoxMeUp$GT$3get17h70c43620f6b1eb23E (type $t5) (param $p0 i32) (param $p1 i32)
    block $B0
      local.get $p1
      i32.load
      br_if $B0
      call $_ZN3std7process5abort17h362ed0b9dee6f433E
      unreachable
    end
    local.get $p0
    i32.const 1051800
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $rust_panic (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.store offset=4
    local.get $l2
    local.get $p0
    i32.store
    local.get $l2
    local.get $l2
    call $__rust_start_panic
    i32.store offset=12
    local.get $l2
    i32.const 36
    i32.add
    i32.const 1
    i32.store
    local.get $l2
    i64.const 1
    i64.store offset=20 align=4
    local.get $l2
    i32.const 1051960
    i32.store offset=16
    local.get $l2
    i32.const 17
    i32.store offset=44
    local.get $l2
    local.get $l2
    i32.const 40
    i32.add
    i32.store offset=32
    local.get $l2
    local.get $l2
    i32.const 12
    i32.add
    i32.store offset=40
    local.get $l2
    i32.const 16
    i32.add
    call $_ZN3std10sys_common4util5abort17hfabe9033db580a9dE
    unreachable)
  (func $_ZN3std2rt19lang_start_internal17hd4a196bff64bdcb8E (type $t9) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (result i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    local.get $p1
    i32.store offset=4
    local.get $l4
    local.get $p0
    i32.store
    block $B0
      block $B1
        block $B2
          block $B3
            i32.const 4
            i32.const 1
            call $__rust_alloc
            local.tee $p0
            i32.eqz
            br_if $B3
            local.get $p0
            i32.const 1852399981
            i32.store align=1
            local.get $l4
            i64.const 17179869188
            i64.store offset=12 align=4
            local.get $l4
            local.get $p0
            i32.store offset=8
            local.get $l4
            i32.const 8
            i32.add
            call $_ZN3std6thread6Thread3new17h11ad3f31af1f9e62E
            local.set $p1
            block $B4
              block $B5
                i32.const 0
                i32.load offset=1060252
                i32.const 1
                i32.eq
                br_if $B5
                i32.const 0
                i64.const 1
                i64.store offset=1060252 align=4
                i32.const 0
                i32.const 0
                i32.store offset=1060260
                br $B4
              end
              i32.const 0
              i32.load offset=1060256
              local.tee $p0
              i32.const 1
              i32.add
              i32.const 0
              i32.le_s
              br_if $B2
              i32.const 0
              i32.load offset=1060260
              br_if $B1
              local.get $p0
              br_if $B0
            end
            i32.const 0
            local.set $p0
            i32.const 0
            local.get $p1
            i32.store offset=1060260
            i32.const 0
            i32.const 0
            i32.store offset=1060256
            local.get $l4
            i32.const 0
            i32.store offset=24
            local.get $l4
            i32.const 0
            i32.store offset=28
            local.get $l4
            local.get $l4
            i32.store offset=8
            block $B6
              block $B7
                i32.const 21
                local.get $l4
                i32.const 8
                i32.add
                local.get $l4
                i32.const 24
                i32.add
                local.get $l4
                i32.const 28
                i32.add
                call $__rust_maybe_catch_panic
                i32.eqz
                br_if $B7
                block $B8
                  block $B9
                    i32.const 0
                    i32.load offset=1060264
                    i32.const 1
                    i32.ne
                    br_if $B9
                    i32.const 0
                    i32.load offset=1060268
                    i32.const -1
                    i32.add
                    local.set $p0
                    br $B8
                  end
                  i32.const 0
                  i64.const 1
                  i64.store offset=1060264
                  i32.const -1
                  local.set $p0
                end
                i32.const 0
                local.get $p0
                i32.store offset=1060268
                i32.const 1
                local.set $p0
                local.get $l4
                i32.load offset=28
                local.set $l5
                local.get $l4
                i32.load offset=24
                local.set $p1
                br $B6
              end
              local.get $l4
              i32.load offset=8
              local.set $p1
            end
            block $B10
              i32.const 0
              i32.load offset=1060200
              i32.const 3
              i32.eq
              br_if $B10
              local.get $l4
              i32.const 1
              i32.store8 offset=28
              local.get $l4
              local.get $l4
              i32.const 28
              i32.add
              i32.store offset=8
              i32.const 1060200
              i32.const 0
              local.get $l4
              i32.const 8
              i32.add
              i32.const 1050824
              call $_ZN3std4sync4once4Once10call_inner17h797b92bb5c8c17f9E
            end
            i32.const 101
            local.get $p1
            local.get $p0
            select
            local.set $l6
            block $B11
              local.get $p0
              i32.eqz
              br_if $B11
              local.get $p1
              local.get $l5
              i32.load
              call_indirect (type $t1) $T0
              local.get $l5
              i32.load offset=4
              local.tee $p0
              i32.eqz
              br_if $B11
              local.get $p1
              local.get $p0
              local.get $l5
              i32.load offset=8
              call $__rust_dealloc
            end
            local.get $l4
            i32.const 32
            i32.add
            global.set $g0
            local.get $l6
            return
          end
          i32.const 4
          i32.const 1
          call $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E
          unreachable
        end
        i32.const 1049032
        i32.const 24
        local.get $l4
        i32.const 8
        i32.add
        i32.const 1049332
        call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
        unreachable
      end
      i32.const 1051312
      i32.const 38
      i32.const 1051296
      call $_ZN3std9panicking11begin_panic17hfe51f8a35b57dcd7E
      unreachable
    end
    i32.const 1049016
    i32.const 16
    local.get $l4
    i32.const 8
    i32.add
    i32.const 1049316
    call $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E
    unreachable)
  (func $_ZN62_$LT$std..ffi..c_str..NulError$u20$as$u20$core..fmt..Debug$GT$3fmt17hdedd92c4e8b03720E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.const 1051968
    i32.const 8
    call $_ZN4core3fmt9Formatter11debug_tuple17hc44365651ef7edf1E
    local.get $l2
    local.get $p0
    i32.store offset=12
    local.get $l2
    local.get $l2
    i32.const 12
    i32.add
    i32.const 1049568
    call $_ZN4core3fmt8builders10DebugTuple5field17hdc280f3f5bcd284bE
    drop
    local.get $l2
    local.get $p0
    i32.const 4
    i32.add
    i32.store offset=12
    local.get $l2
    local.get $l2
    i32.const 12
    i32.add
    i32.const 1051976
    call $_ZN4core3fmt8builders10DebugTuple5field17hdc280f3f5bcd284bE
    drop
    local.get $l2
    call $_ZN4core3fmt8builders10DebugTuple6finish17h7c2a8b3deddc969cE
    local.set $p0
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN3std3sys4wasi7process8ExitCode6as_i3217hbe10eb2788ccea0eE (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load8_u)
  (func $__rust_maybe_catch_panic (type $t9) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (result i32)
    local.get $p1
    local.get $p0
    call_indirect (type $t1) $T0
    i32.const 0)
  (func $__rust_start_panic (type $t7) (param $p0 i32) (result i32)
    unreachable
    unreachable)
  (func $_ZN4wasi5error5Error9raw_error17h073e2e808e6ce886E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load16_u)
  (func $_ZN4wasi13lib_generated8fd_write17h002cb84f11067c7cE (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l4
    global.set $g0
    block $B0
      block $B1
        local.get $p1
        local.get $p2
        local.get $p3
        local.get $l4
        i32.const 12
        i32.add
        call $fd_write
        local.tee $p1
        br_if $B1
        local.get $p0
        i32.const 4
        i32.add
        local.get $l4
        i32.load offset=12
        i32.store
        i32.const 0
        local.set $p1
        br $B0
      end
      local.get $p0
      local.get $p1
      i32.store16 offset=2
      i32.const 1
      local.set $p1
    end
    local.get $p0
    local.get $p1
    i32.store16
    local.get $l4
    i32.const 16
    i32.add
    global.set $g0)
  (func $_ZN9backtrace5print12BacktraceFmt3new17h3562e51bd8d13c0eE (type $t11) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32)
    local.get $p0
    local.get $p2
    i32.store8 offset=16
    local.get $p0
    i32.const 0
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store
    local.get $p0
    local.get $p3
    i32.store offset=8
    local.get $p0
    i32.const 12
    i32.add
    local.get $p4
    i32.store)
  (func $_ZN9backtrace5print12BacktraceFmt11add_context17h1b4ea7782846643bE (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load
    i32.const 1052295
    i32.const 17
    call $_ZN4core3fmt9Formatter9write_str17ha1697ce05c7e7a6cE)
  (func $_ZN9backtrace5print12BacktraceFmt6finish17h9017d7f9b2b9c182E (type $t7) (param $p0 i32) (result i32)
    i32.const 0)
  (func $abort (type $t0)
    unreachable
    unreachable)
  (func $malloc (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    call $dlmalloc)
  (func $dlmalloc (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l1
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  block $B7
                    block $B8
                      block $B9
                        block $B10
                          block $B11
                            local.get $p0
                            i32.const 236
                            i32.gt_u
                            br_if $B11
                            block $B12
                              i32.const 0
                              i32.load offset=1060276
                              local.tee $l2
                              i32.const 16
                              local.get $p0
                              i32.const 19
                              i32.add
                              i32.const -16
                              i32.and
                              local.get $p0
                              i32.const 11
                              i32.lt_u
                              select
                              local.tee $l3
                              i32.const 3
                              i32.shr_u
                              local.tee $l4
                              i32.shr_u
                              local.tee $p0
                              i32.const 3
                              i32.and
                              i32.eqz
                              br_if $B12
                              local.get $p0
                              i32.const 1
                              i32.and
                              local.get $l4
                              i32.or
                              i32.const 1
                              i32.xor
                              local.tee $l3
                              i32.const 3
                              i32.shl
                              local.tee $l5
                              i32.const 1060324
                              i32.add
                              i32.load
                              local.tee $l4
                              i32.const 8
                              i32.add
                              local.set $p0
                              block $B13
                                block $B14
                                  local.get $l4
                                  i32.load offset=8
                                  local.tee $l6
                                  local.get $l5
                                  i32.const 1060316
                                  i32.add
                                  local.tee $l5
                                  i32.ne
                                  br_if $B14
                                  i32.const 0
                                  local.get $l2
                                  i32.const -2
                                  local.get $l3
                                  i32.rotl
                                  i32.and
                                  i32.store offset=1060276
                                  br $B13
                                end
                                i32.const 0
                                i32.load offset=1060292
                                local.get $l6
                                i32.gt_u
                                drop
                                local.get $l5
                                local.get $l6
                                i32.store offset=8
                                local.get $l6
                                local.get $l5
                                i32.store offset=12
                              end
                              local.get $l4
                              local.get $l3
                              i32.const 3
                              i32.shl
                              local.tee $l6
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              local.get $l4
                              local.get $l6
                              i32.add
                              local.tee $l4
                              local.get $l4
                              i32.load offset=4
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              br $B0
                            end
                            local.get $l3
                            i32.const 0
                            i32.load offset=1060284
                            local.tee $l7
                            i32.le_u
                            br_if $B10
                            block $B15
                              local.get $p0
                              i32.eqz
                              br_if $B15
                              block $B16
                                block $B17
                                  local.get $p0
                                  local.get $l4
                                  i32.shl
                                  i32.const 2
                                  local.get $l4
                                  i32.shl
                                  local.tee $p0
                                  i32.const 0
                                  local.get $p0
                                  i32.sub
                                  i32.or
                                  i32.and
                                  local.tee $p0
                                  i32.const 0
                                  local.get $p0
                                  i32.sub
                                  i32.and
                                  i32.const -1
                                  i32.add
                                  local.tee $p0
                                  local.get $p0
                                  i32.const 12
                                  i32.shr_u
                                  i32.const 16
                                  i32.and
                                  local.tee $p0
                                  i32.shr_u
                                  local.tee $l4
                                  i32.const 5
                                  i32.shr_u
                                  i32.const 8
                                  i32.and
                                  local.tee $l6
                                  local.get $p0
                                  i32.or
                                  local.get $l4
                                  local.get $l6
                                  i32.shr_u
                                  local.tee $p0
                                  i32.const 2
                                  i32.shr_u
                                  i32.const 4
                                  i32.and
                                  local.tee $l4
                                  i32.or
                                  local.get $p0
                                  local.get $l4
                                  i32.shr_u
                                  local.tee $p0
                                  i32.const 1
                                  i32.shr_u
                                  i32.const 2
                                  i32.and
                                  local.tee $l4
                                  i32.or
                                  local.get $p0
                                  local.get $l4
                                  i32.shr_u
                                  local.tee $p0
                                  i32.const 1
                                  i32.shr_u
                                  i32.const 1
                                  i32.and
                                  local.tee $l4
                                  i32.or
                                  local.get $p0
                                  local.get $l4
                                  i32.shr_u
                                  i32.add
                                  local.tee $l6
                                  i32.const 3
                                  i32.shl
                                  local.tee $l5
                                  i32.const 1060324
                                  i32.add
                                  i32.load
                                  local.tee $l4
                                  i32.load offset=8
                                  local.tee $p0
                                  local.get $l5
                                  i32.const 1060316
                                  i32.add
                                  local.tee $l5
                                  i32.ne
                                  br_if $B17
                                  i32.const 0
                                  local.get $l2
                                  i32.const -2
                                  local.get $l6
                                  i32.rotl
                                  i32.and
                                  local.tee $l2
                                  i32.store offset=1060276
                                  br $B16
                                end
                                i32.const 0
                                i32.load offset=1060292
                                local.get $p0
                                i32.gt_u
                                drop
                                local.get $l5
                                local.get $p0
                                i32.store offset=8
                                local.get $p0
                                local.get $l5
                                i32.store offset=12
                              end
                              local.get $l4
                              i32.const 8
                              i32.add
                              local.set $p0
                              local.get $l4
                              local.get $l3
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              local.get $l4
                              local.get $l6
                              i32.const 3
                              i32.shl
                              local.tee $l6
                              i32.add
                              local.get $l6
                              local.get $l3
                              i32.sub
                              local.tee $l6
                              i32.store
                              local.get $l4
                              local.get $l3
                              i32.add
                              local.tee $l5
                              local.get $l6
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              block $B18
                                local.get $l7
                                i32.eqz
                                br_if $B18
                                local.get $l7
                                i32.const 3
                                i32.shr_u
                                local.tee $l8
                                i32.const 3
                                i32.shl
                                i32.const 1060316
                                i32.add
                                local.set $l3
                                i32.const 0
                                i32.load offset=1060296
                                local.set $l4
                                block $B19
                                  block $B20
                                    local.get $l2
                                    i32.const 1
                                    local.get $l8
                                    i32.shl
                                    local.tee $l8
                                    i32.and
                                    br_if $B20
                                    i32.const 0
                                    local.get $l2
                                    local.get $l8
                                    i32.or
                                    i32.store offset=1060276
                                    local.get $l3
                                    local.set $l8
                                    br $B19
                                  end
                                  local.get $l3
                                  i32.load offset=8
                                  local.set $l8
                                end
                                local.get $l8
                                local.get $l4
                                i32.store offset=12
                                local.get $l3
                                local.get $l4
                                i32.store offset=8
                                local.get $l4
                                local.get $l3
                                i32.store offset=12
                                local.get $l4
                                local.get $l8
                                i32.store offset=8
                              end
                              i32.const 0
                              local.get $l5
                              i32.store offset=1060296
                              i32.const 0
                              local.get $l6
                              i32.store offset=1060284
                              br $B0
                            end
                            i32.const 0
                            i32.load offset=1060280
                            local.tee $l9
                            i32.eqz
                            br_if $B10
                            local.get $l9
                            i32.const 0
                            local.get $l9
                            i32.sub
                            i32.and
                            i32.const -1
                            i32.add
                            local.tee $p0
                            local.get $p0
                            i32.const 12
                            i32.shr_u
                            i32.const 16
                            i32.and
                            local.tee $p0
                            i32.shr_u
                            local.tee $l4
                            i32.const 5
                            i32.shr_u
                            i32.const 8
                            i32.and
                            local.tee $l6
                            local.get $p0
                            i32.or
                            local.get $l4
                            local.get $l6
                            i32.shr_u
                            local.tee $p0
                            i32.const 2
                            i32.shr_u
                            i32.const 4
                            i32.and
                            local.tee $l4
                            i32.or
                            local.get $p0
                            local.get $l4
                            i32.shr_u
                            local.tee $p0
                            i32.const 1
                            i32.shr_u
                            i32.const 2
                            i32.and
                            local.tee $l4
                            i32.or
                            local.get $p0
                            local.get $l4
                            i32.shr_u
                            local.tee $p0
                            i32.const 1
                            i32.shr_u
                            i32.const 1
                            i32.and
                            local.tee $l4
                            i32.or
                            local.get $p0
                            local.get $l4
                            i32.shr_u
                            i32.add
                            i32.const 2
                            i32.shl
                            i32.const 1060580
                            i32.add
                            i32.load
                            local.tee $l5
                            i32.load offset=4
                            i32.const -8
                            i32.and
                            local.get $l3
                            i32.sub
                            local.set $l4
                            local.get $l5
                            local.set $l6
                            block $B21
                              loop $L22
                                block $B23
                                  local.get $l6
                                  i32.load offset=16
                                  local.tee $p0
                                  br_if $B23
                                  local.get $l6
                                  i32.const 20
                                  i32.add
                                  i32.load
                                  local.tee $p0
                                  i32.eqz
                                  br_if $B21
                                end
                                local.get $p0
                                i32.load offset=4
                                i32.const -8
                                i32.and
                                local.get $l3
                                i32.sub
                                local.tee $l6
                                local.get $l4
                                local.get $l6
                                local.get $l4
                                i32.lt_u
                                local.tee $l6
                                select
                                local.set $l4
                                local.get $p0
                                local.get $l5
                                local.get $l6
                                select
                                local.set $l5
                                local.get $p0
                                local.set $l6
                                br $L22
                              end
                            end
                            local.get $l5
                            i32.load offset=24
                            local.set $l10
                            block $B24
                              local.get $l5
                              i32.load offset=12
                              local.tee $l8
                              local.get $l5
                              i32.eq
                              br_if $B24
                              block $B25
                                i32.const 0
                                i32.load offset=1060292
                                local.get $l5
                                i32.load offset=8
                                local.tee $p0
                                i32.gt_u
                                br_if $B25
                                local.get $p0
                                i32.load offset=12
                                local.get $l5
                                i32.ne
                                drop
                              end
                              local.get $l8
                              local.get $p0
                              i32.store offset=8
                              local.get $p0
                              local.get $l8
                              i32.store offset=12
                              br $B1
                            end
                            block $B26
                              local.get $l5
                              i32.const 20
                              i32.add
                              local.tee $l6
                              i32.load
                              local.tee $p0
                              br_if $B26
                              local.get $l5
                              i32.load offset=16
                              local.tee $p0
                              i32.eqz
                              br_if $B9
                              local.get $l5
                              i32.const 16
                              i32.add
                              local.set $l6
                            end
                            loop $L27
                              local.get $l6
                              local.set $l11
                              local.get $p0
                              local.tee $l8
                              i32.const 20
                              i32.add
                              local.tee $l6
                              i32.load
                              local.tee $p0
                              br_if $L27
                              local.get $l8
                              i32.const 16
                              i32.add
                              local.set $l6
                              local.get $l8
                              i32.load offset=16
                              local.tee $p0
                              br_if $L27
                            end
                            local.get $l11
                            i32.const 0
                            i32.store
                            br $B1
                          end
                          i32.const -1
                          local.set $l3
                          local.get $p0
                          i32.const -65
                          i32.gt_u
                          br_if $B10
                          local.get $p0
                          i32.const 19
                          i32.add
                          local.tee $p0
                          i32.const -16
                          i32.and
                          local.set $l3
                          i32.const 0
                          i32.load offset=1060280
                          local.tee $l7
                          i32.eqz
                          br_if $B10
                          i32.const 0
                          local.set $l11
                          block $B28
                            local.get $p0
                            i32.const 8
                            i32.shr_u
                            local.tee $p0
                            i32.eqz
                            br_if $B28
                            i32.const 31
                            local.set $l11
                            local.get $l3
                            i32.const 16777215
                            i32.gt_u
                            br_if $B28
                            local.get $p0
                            local.get $p0
                            i32.const 1048320
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 8
                            i32.and
                            local.tee $l4
                            i32.shl
                            local.tee $p0
                            local.get $p0
                            i32.const 520192
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 4
                            i32.and
                            local.tee $p0
                            i32.shl
                            local.tee $l6
                            local.get $l6
                            i32.const 245760
                            i32.add
                            i32.const 16
                            i32.shr_u
                            i32.const 2
                            i32.and
                            local.tee $l6
                            i32.shl
                            i32.const 15
                            i32.shr_u
                            local.get $p0
                            local.get $l4
                            i32.or
                            local.get $l6
                            i32.or
                            i32.sub
                            local.tee $p0
                            i32.const 1
                            i32.shl
                            local.get $l3
                            local.get $p0
                            i32.const 21
                            i32.add
                            i32.shr_u
                            i32.const 1
                            i32.and
                            i32.or
                            i32.const 28
                            i32.add
                            local.set $l11
                          end
                          i32.const 0
                          local.get $l3
                          i32.sub
                          local.set $l6
                          block $B29
                            block $B30
                              block $B31
                                block $B32
                                  local.get $l11
                                  i32.const 2
                                  i32.shl
                                  i32.const 1060580
                                  i32.add
                                  i32.load
                                  local.tee $l4
                                  br_if $B32
                                  i32.const 0
                                  local.set $p0
                                  i32.const 0
                                  local.set $l8
                                  br $B31
                                end
                                local.get $l3
                                i32.const 0
                                i32.const 25
                                local.get $l11
                                i32.const 1
                                i32.shr_u
                                i32.sub
                                local.get $l11
                                i32.const 31
                                i32.eq
                                select
                                i32.shl
                                local.set $l5
                                i32.const 0
                                local.set $p0
                                i32.const 0
                                local.set $l8
                                loop $L33
                                  block $B34
                                    local.get $l4
                                    i32.load offset=4
                                    i32.const -8
                                    i32.and
                                    local.get $l3
                                    i32.sub
                                    local.tee $l2
                                    local.get $l6
                                    i32.ge_u
                                    br_if $B34
                                    local.get $l2
                                    local.set $l6
                                    local.get $l4
                                    local.set $l8
                                    local.get $l2
                                    br_if $B34
                                    i32.const 0
                                    local.set $l6
                                    local.get $l4
                                    local.set $l8
                                    local.get $l4
                                    local.set $p0
                                    br $B30
                                  end
                                  local.get $p0
                                  local.get $l4
                                  i32.const 20
                                  i32.add
                                  i32.load
                                  local.tee $l2
                                  local.get $l2
                                  local.get $l4
                                  local.get $l5
                                  i32.const 29
                                  i32.shr_u
                                  i32.const 4
                                  i32.and
                                  i32.add
                                  i32.const 16
                                  i32.add
                                  i32.load
                                  local.tee $l4
                                  i32.eq
                                  select
                                  local.get $p0
                                  local.get $l2
                                  select
                                  local.set $p0
                                  local.get $l5
                                  local.get $l4
                                  i32.const 0
                                  i32.ne
                                  i32.shl
                                  local.set $l5
                                  local.get $l4
                                  br_if $L33
                                end
                              end
                              block $B35
                                local.get $p0
                                local.get $l8
                                i32.or
                                br_if $B35
                                i32.const 2
                                local.get $l11
                                i32.shl
                                local.tee $p0
                                i32.const 0
                                local.get $p0
                                i32.sub
                                i32.or
                                local.get $l7
                                i32.and
                                local.tee $p0
                                i32.eqz
                                br_if $B10
                                local.get $p0
                                i32.const 0
                                local.get $p0
                                i32.sub
                                i32.and
                                i32.const -1
                                i32.add
                                local.tee $p0
                                local.get $p0
                                i32.const 12
                                i32.shr_u
                                i32.const 16
                                i32.and
                                local.tee $p0
                                i32.shr_u
                                local.tee $l4
                                i32.const 5
                                i32.shr_u
                                i32.const 8
                                i32.and
                                local.tee $l5
                                local.get $p0
                                i32.or
                                local.get $l4
                                local.get $l5
                                i32.shr_u
                                local.tee $p0
                                i32.const 2
                                i32.shr_u
                                i32.const 4
                                i32.and
                                local.tee $l4
                                i32.or
                                local.get $p0
                                local.get $l4
                                i32.shr_u
                                local.tee $p0
                                i32.const 1
                                i32.shr_u
                                i32.const 2
                                i32.and
                                local.tee $l4
                                i32.or
                                local.get $p0
                                local.get $l4
                                i32.shr_u
                                local.tee $p0
                                i32.const 1
                                i32.shr_u
                                i32.const 1
                                i32.and
                                local.tee $l4
                                i32.or
                                local.get $p0
                                local.get $l4
                                i32.shr_u
                                i32.add
                                i32.const 2
                                i32.shl
                                i32.const 1060580
                                i32.add
                                i32.load
                                local.set $p0
                              end
                              local.get $p0
                              i32.eqz
                              br_if $B29
                            end
                            loop $L36
                              local.get $p0
                              i32.load offset=4
                              i32.const -8
                              i32.and
                              local.get $l3
                              i32.sub
                              local.tee $l2
                              local.get $l6
                              i32.lt_u
                              local.set $l5
                              block $B37
                                local.get $p0
                                i32.load offset=16
                                local.tee $l4
                                br_if $B37
                                local.get $p0
                                i32.const 20
                                i32.add
                                i32.load
                                local.set $l4
                              end
                              local.get $l2
                              local.get $l6
                              local.get $l5
                              select
                              local.set $l6
                              local.get $p0
                              local.get $l8
                              local.get $l5
                              select
                              local.set $l8
                              local.get $l4
                              local.set $p0
                              local.get $l4
                              br_if $L36
                            end
                          end
                          local.get $l8
                          i32.eqz
                          br_if $B10
                          local.get $l6
                          i32.const 0
                          i32.load offset=1060284
                          local.get $l3
                          i32.sub
                          i32.ge_u
                          br_if $B10
                          local.get $l8
                          i32.load offset=24
                          local.set $l11
                          block $B38
                            local.get $l8
                            i32.load offset=12
                            local.tee $l5
                            local.get $l8
                            i32.eq
                            br_if $B38
                            block $B39
                              i32.const 0
                              i32.load offset=1060292
                              local.get $l8
                              i32.load offset=8
                              local.tee $p0
                              i32.gt_u
                              br_if $B39
                              local.get $p0
                              i32.load offset=12
                              local.get $l8
                              i32.ne
                              drop
                            end
                            local.get $l5
                            local.get $p0
                            i32.store offset=8
                            local.get $p0
                            local.get $l5
                            i32.store offset=12
                            br $B2
                          end
                          block $B40
                            local.get $l8
                            i32.const 20
                            i32.add
                            local.tee $l4
                            i32.load
                            local.tee $p0
                            br_if $B40
                            local.get $l8
                            i32.load offset=16
                            local.tee $p0
                            i32.eqz
                            br_if $B8
                            local.get $l8
                            i32.const 16
                            i32.add
                            local.set $l4
                          end
                          loop $L41
                            local.get $l4
                            local.set $l2
                            local.get $p0
                            local.tee $l5
                            i32.const 20
                            i32.add
                            local.tee $l4
                            i32.load
                            local.tee $p0
                            br_if $L41
                            local.get $l5
                            i32.const 16
                            i32.add
                            local.set $l4
                            local.get $l5
                            i32.load offset=16
                            local.tee $p0
                            br_if $L41
                          end
                          local.get $l2
                          i32.const 0
                          i32.store
                          br $B2
                        end
                        block $B42
                          i32.const 0
                          i32.load offset=1060284
                          local.tee $p0
                          local.get $l3
                          i32.lt_u
                          br_if $B42
                          i32.const 0
                          i32.load offset=1060296
                          local.set $l4
                          block $B43
                            block $B44
                              local.get $p0
                              local.get $l3
                              i32.sub
                              local.tee $l6
                              i32.const 16
                              i32.lt_u
                              br_if $B44
                              local.get $l4
                              local.get $l3
                              i32.add
                              local.tee $l5
                              local.get $l6
                              i32.const 1
                              i32.or
                              i32.store offset=4
                              i32.const 0
                              local.get $l6
                              i32.store offset=1060284
                              i32.const 0
                              local.get $l5
                              i32.store offset=1060296
                              local.get $l4
                              local.get $p0
                              i32.add
                              local.get $l6
                              i32.store
                              local.get $l4
                              local.get $l3
                              i32.const 3
                              i32.or
                              i32.store offset=4
                              br $B43
                            end
                            local.get $l4
                            local.get $p0
                            i32.const 3
                            i32.or
                            i32.store offset=4
                            local.get $l4
                            local.get $p0
                            i32.add
                            local.tee $p0
                            local.get $p0
                            i32.load offset=4
                            i32.const 1
                            i32.or
                            i32.store offset=4
                            i32.const 0
                            i32.const 0
                            i32.store offset=1060296
                            i32.const 0
                            i32.const 0
                            i32.store offset=1060284
                          end
                          local.get $l4
                          i32.const 8
                          i32.add
                          local.set $p0
                          br $B0
                        end
                        block $B45
                          i32.const 0
                          i32.load offset=1060288
                          local.tee $l5
                          local.get $l3
                          i32.le_u
                          br_if $B45
                          i32.const 0
                          i32.load offset=1060300
                          local.tee $p0
                          local.get $l3
                          i32.add
                          local.tee $l4
                          local.get $l5
                          local.get $l3
                          i32.sub
                          local.tee $l6
                          i32.const 1
                          i32.or
                          i32.store offset=4
                          i32.const 0
                          local.get $l6
                          i32.store offset=1060288
                          i32.const 0
                          local.get $l4
                          i32.store offset=1060300
                          local.get $p0
                          local.get $l3
                          i32.const 3
                          i32.or
                          i32.store offset=4
                          local.get $p0
                          i32.const 8
                          i32.add
                          local.set $p0
                          br $B0
                        end
                        block $B46
                          block $B47
                            i32.const 0
                            i32.load offset=1060748
                            i32.eqz
                            br_if $B47
                            i32.const 0
                            i32.load offset=1060756
                            local.set $l4
                            br $B46
                          end
                          i32.const 0
                          i64.const -1
                          i64.store offset=1060760 align=4
                          i32.const 0
                          i64.const 281474976776192
                          i64.store offset=1060752 align=4
                          i32.const 0
                          local.get $l1
                          i32.const 12
                          i32.add
                          i32.const -16
                          i32.and
                          i32.const 1431655768
                          i32.xor
                          i32.store offset=1060748
                          i32.const 0
                          i32.const 0
                          i32.store offset=1060768
                          i32.const 0
                          i32.const 0
                          i32.store offset=1060720
                          i32.const 65536
                          local.set $l4
                        end
                        i32.const 0
                        local.set $p0
                        block $B48
                          local.get $l4
                          local.get $l3
                          i32.const 71
                          i32.add
                          local.tee $l7
                          i32.add
                          local.tee $l2
                          i32.const 0
                          local.get $l4
                          i32.sub
                          local.tee $l11
                          i32.and
                          local.tee $l8
                          local.get $l3
                          i32.gt_u
                          br_if $B48
                          i32.const 0
                          i32.const 48
                          i32.store offset=1060772
                          br $B0
                        end
                        block $B49
                          i32.const 0
                          i32.load offset=1060716
                          local.tee $p0
                          i32.eqz
                          br_if $B49
                          block $B50
                            i32.const 0
                            i32.load offset=1060708
                            local.tee $l4
                            local.get $l8
                            i32.add
                            local.tee $l6
                            local.get $l4
                            i32.le_u
                            br_if $B50
                            local.get $l6
                            local.get $p0
                            i32.le_u
                            br_if $B49
                          end
                          i32.const 0
                          local.set $p0
                          i32.const 0
                          i32.const 48
                          i32.store offset=1060772
                          br $B0
                        end
                        i32.const 0
                        i32.load8_u offset=1060720
                        i32.const 4
                        i32.and
                        br_if $B5
                        block $B51
                          block $B52
                            block $B53
                              i32.const 0
                              i32.load offset=1060300
                              local.tee $l4
                              i32.eqz
                              br_if $B53
                              i32.const 1060724
                              local.set $p0
                              loop $L54
                                block $B55
                                  local.get $p0
                                  i32.load
                                  local.tee $l6
                                  local.get $l4
                                  i32.gt_u
                                  br_if $B55
                                  local.get $l6
                                  local.get $p0
                                  i32.load offset=4
                                  i32.add
                                  local.get $l4
                                  i32.gt_u
                                  br_if $B52
                                end
                                local.get $p0
                                i32.load offset=8
                                local.tee $p0
                                br_if $L54
                              end
                            end
                            i32.const 0
                            call $sbrk
                            local.tee $l5
                            i32.const -1
                            i32.eq
                            br_if $B6
                            local.get $l8
                            local.set $l2
                            block $B56
                              i32.const 0
                              i32.load offset=1060752
                              local.tee $p0
                              i32.const -1
                              i32.add
                              local.tee $l4
                              local.get $l5
                              i32.and
                              i32.eqz
                              br_if $B56
                              local.get $l8
                              local.get $l5
                              i32.sub
                              local.get $l4
                              local.get $l5
                              i32.add
                              i32.const 0
                              local.get $p0
                              i32.sub
                              i32.and
                              i32.add
                              local.set $l2
                            end
                            local.get $l2
                            local.get $l3
                            i32.le_u
                            br_if $B6
                            local.get $l2
                            i32.const 2147483646
                            i32.gt_u
                            br_if $B6
                            block $B57
                              i32.const 0
                              i32.load offset=1060716
                              local.tee $p0
                              i32.eqz
                              br_if $B57
                              i32.const 0
                              i32.load offset=1060708
                              local.tee $l4
                              local.get $l2
                              i32.add
                              local.tee $l6
                              local.get $l4
                              i32.le_u
                              br_if $B6
                              local.get $l6
                              local.get $p0
                              i32.gt_u
                              br_if $B6
                            end
                            local.get $l2
                            call $sbrk
                            local.tee $p0
                            local.get $l5
                            i32.ne
                            br_if $B51
                            br $B4
                          end
                          local.get $l2
                          local.get $l5
                          i32.sub
                          local.get $l11
                          i32.and
                          local.tee $l2
                          i32.const 2147483646
                          i32.gt_u
                          br_if $B6
                          local.get $l2
                          call $sbrk
                          local.tee $l5
                          local.get $p0
                          i32.load
                          local.get $p0
                          i32.load offset=4
                          i32.add
                          i32.eq
                          br_if $B7
                          local.get $l5
                          local.set $p0
                        end
                        local.get $p0
                        local.set $l5
                        block $B58
                          local.get $l3
                          i32.const 72
                          i32.add
                          local.get $l2
                          i32.le_u
                          br_if $B58
                          local.get $l2
                          i32.const 2147483646
                          i32.gt_u
                          br_if $B58
                          local.get $l5
                          i32.const -1
                          i32.eq
                          br_if $B58
                          local.get $l7
                          local.get $l2
                          i32.sub
                          i32.const 0
                          i32.load offset=1060756
                          local.tee $p0
                          i32.add
                          i32.const 0
                          local.get $p0
                          i32.sub
                          i32.and
                          local.tee $p0
                          i32.const 2147483646
                          i32.gt_u
                          br_if $B4
                          block $B59
                            local.get $p0
                            call $sbrk
                            i32.const -1
                            i32.eq
                            br_if $B59
                            local.get $p0
                            local.get $l2
                            i32.add
                            local.set $l2
                            br $B4
                          end
                          i32.const 0
                          local.get $l2
                          i32.sub
                          call $sbrk
                          drop
                          br $B6
                        end
                        local.get $l5
                        i32.const -1
                        i32.ne
                        br_if $B4
                        br $B6
                      end
                      i32.const 0
                      local.set $l8
                      br $B1
                    end
                    i32.const 0
                    local.set $l5
                    br $B2
                  end
                  local.get $l5
                  i32.const -1
                  i32.ne
                  br_if $B4
                end
                i32.const 0
                i32.const 0
                i32.load offset=1060720
                i32.const 4
                i32.or
                i32.store offset=1060720
              end
              local.get $l8
              i32.const 2147483646
              i32.gt_u
              br_if $B3
              local.get $l8
              call $sbrk
              local.tee $l5
              i32.const 0
              call $sbrk
              local.tee $p0
              i32.ge_u
              br_if $B3
              local.get $l5
              i32.const -1
              i32.eq
              br_if $B3
              local.get $p0
              i32.const -1
              i32.eq
              br_if $B3
              local.get $p0
              local.get $l5
              i32.sub
              local.tee $l2
              local.get $l3
              i32.const 56
              i32.add
              i32.le_u
              br_if $B3
            end
            i32.const 0
            i32.const 0
            i32.load offset=1060708
            local.get $l2
            i32.add
            local.tee $p0
            i32.store offset=1060708
            block $B60
              local.get $p0
              i32.const 0
              i32.load offset=1060712
              i32.le_u
              br_if $B60
              i32.const 0
              local.get $p0
              i32.store offset=1060712
            end
            block $B61
              block $B62
                block $B63
                  block $B64
                    i32.const 0
                    i32.load offset=1060300
                    local.tee $l4
                    i32.eqz
                    br_if $B64
                    i32.const 1060724
                    local.set $p0
                    loop $L65
                      local.get $l5
                      local.get $p0
                      i32.load
                      local.tee $l6
                      local.get $p0
                      i32.load offset=4
                      local.tee $l8
                      i32.add
                      i32.eq
                      br_if $B63
                      local.get $p0
                      i32.load offset=8
                      local.tee $p0
                      br_if $L65
                      br $B62
                    end
                  end
                  block $B66
                    block $B67
                      i32.const 0
                      i32.load offset=1060292
                      local.tee $p0
                      i32.eqz
                      br_if $B67
                      local.get $l5
                      local.get $p0
                      i32.ge_u
                      br_if $B66
                    end
                    i32.const 0
                    local.get $l5
                    i32.store offset=1060292
                  end
                  i32.const 0
                  local.set $p0
                  i32.const 0
                  local.get $l2
                  i32.store offset=1060728
                  i32.const 0
                  local.get $l5
                  i32.store offset=1060724
                  i32.const 0
                  i32.const -1
                  i32.store offset=1060308
                  i32.const 0
                  i32.const 0
                  i32.load offset=1060748
                  i32.store offset=1060312
                  i32.const 0
                  i32.const 0
                  i32.store offset=1060736
                  loop $L68
                    local.get $p0
                    i32.const 1060324
                    i32.add
                    local.get $p0
                    i32.const 1060316
                    i32.add
                    local.tee $l4
                    i32.store
                    local.get $p0
                    i32.const 1060328
                    i32.add
                    local.get $l4
                    i32.store
                    local.get $p0
                    i32.const 8
                    i32.add
                    local.tee $p0
                    i32.const 256
                    i32.ne
                    br_if $L68
                  end
                  local.get $l5
                  i32.const -8
                  local.get $l5
                  i32.sub
                  i32.const 15
                  i32.and
                  i32.const 0
                  local.get $l5
                  i32.const 8
                  i32.add
                  i32.const 15
                  i32.and
                  select
                  local.tee $p0
                  i32.add
                  local.tee $l4
                  local.get $l2
                  i32.const -56
                  i32.add
                  local.tee $l6
                  local.get $p0
                  i32.sub
                  local.tee $p0
                  i32.const 1
                  i32.or
                  i32.store offset=4
                  i32.const 0
                  i32.const 0
                  i32.load offset=1060764
                  i32.store offset=1060304
                  i32.const 0
                  local.get $p0
                  i32.store offset=1060288
                  i32.const 0
                  local.get $l4
                  i32.store offset=1060300
                  local.get $l5
                  local.get $l6
                  i32.add
                  i32.const 56
                  i32.store offset=4
                  br $B61
                end
                local.get $p0
                i32.load8_u offset=12
                i32.const 8
                i32.and
                br_if $B62
                local.get $l5
                local.get $l4
                i32.le_u
                br_if $B62
                local.get $l6
                local.get $l4
                i32.gt_u
                br_if $B62
                local.get $l4
                i32.const -8
                local.get $l4
                i32.sub
                i32.const 15
                i32.and
                i32.const 0
                local.get $l4
                i32.const 8
                i32.add
                i32.const 15
                i32.and
                select
                local.tee $l6
                i32.add
                local.tee $l5
                i32.const 0
                i32.load offset=1060288
                local.get $l2
                i32.add
                local.tee $l11
                local.get $l6
                i32.sub
                local.tee $l6
                i32.const 1
                i32.or
                i32.store offset=4
                local.get $p0
                local.get $l8
                local.get $l2
                i32.add
                i32.store offset=4
                i32.const 0
                i32.const 0
                i32.load offset=1060764
                i32.store offset=1060304
                i32.const 0
                local.get $l6
                i32.store offset=1060288
                i32.const 0
                local.get $l5
                i32.store offset=1060300
                local.get $l4
                local.get $l11
                i32.add
                i32.const 56
                i32.store offset=4
                br $B61
              end
              block $B69
                local.get $l5
                i32.const 0
                i32.load offset=1060292
                local.tee $l8
                i32.ge_u
                br_if $B69
                i32.const 0
                local.get $l5
                i32.store offset=1060292
                local.get $l5
                local.set $l8
              end
              local.get $l5
              local.get $l2
              i32.add
              local.set $l6
              i32.const 1060724
              local.set $p0
              block $B70
                block $B71
                  block $B72
                    block $B73
                      block $B74
                        block $B75
                          block $B76
                            loop $L77
                              local.get $p0
                              i32.load
                              local.get $l6
                              i32.eq
                              br_if $B76
                              local.get $p0
                              i32.load offset=8
                              local.tee $p0
                              br_if $L77
                              br $B75
                            end
                          end
                          local.get $p0
                          i32.load8_u offset=12
                          i32.const 8
                          i32.and
                          i32.eqz
                          br_if $B74
                        end
                        i32.const 1060724
                        local.set $p0
                        loop $L78
                          block $B79
                            local.get $p0
                            i32.load
                            local.tee $l6
                            local.get $l4
                            i32.gt_u
                            br_if $B79
                            local.get $l6
                            local.get $p0
                            i32.load offset=4
                            i32.add
                            local.tee $l6
                            local.get $l4
                            i32.gt_u
                            br_if $B73
                          end
                          local.get $p0
                          i32.load offset=8
                          local.set $p0
                          br $L78
                        end
                      end
                      local.get $p0
                      local.get $l5
                      i32.store
                      local.get $p0
                      local.get $p0
                      i32.load offset=4
                      local.get $l2
                      i32.add
                      i32.store offset=4
                      local.get $l5
                      i32.const -8
                      local.get $l5
                      i32.sub
                      i32.const 15
                      i32.and
                      i32.const 0
                      local.get $l5
                      i32.const 8
                      i32.add
                      i32.const 15
                      i32.and
                      select
                      i32.add
                      local.tee $l11
                      local.get $l3
                      i32.const 3
                      i32.or
                      i32.store offset=4
                      local.get $l6
                      i32.const -8
                      local.get $l6
                      i32.sub
                      i32.const 15
                      i32.and
                      i32.const 0
                      local.get $l6
                      i32.const 8
                      i32.add
                      i32.const 15
                      i32.and
                      select
                      i32.add
                      local.tee $l5
                      local.get $l11
                      i32.sub
                      local.get $l3
                      i32.sub
                      local.set $p0
                      local.get $l11
                      local.get $l3
                      i32.add
                      local.set $l6
                      block $B80
                        local.get $l4
                        local.get $l5
                        i32.ne
                        br_if $B80
                        i32.const 0
                        local.get $l6
                        i32.store offset=1060300
                        i32.const 0
                        i32.const 0
                        i32.load offset=1060288
                        local.get $p0
                        i32.add
                        local.tee $p0
                        i32.store offset=1060288
                        local.get $l6
                        local.get $p0
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        br $B71
                      end
                      block $B81
                        i32.const 0
                        i32.load offset=1060296
                        local.get $l5
                        i32.ne
                        br_if $B81
                        i32.const 0
                        local.get $l6
                        i32.store offset=1060296
                        i32.const 0
                        i32.const 0
                        i32.load offset=1060284
                        local.get $p0
                        i32.add
                        local.tee $p0
                        i32.store offset=1060284
                        local.get $l6
                        local.get $p0
                        i32.const 1
                        i32.or
                        i32.store offset=4
                        local.get $l6
                        local.get $p0
                        i32.add
                        local.get $p0
                        i32.store
                        br $B71
                      end
                      block $B82
                        local.get $l5
                        i32.load offset=4
                        local.tee $l4
                        i32.const 3
                        i32.and
                        i32.const 1
                        i32.ne
                        br_if $B82
                        local.get $l4
                        i32.const -8
                        i32.and
                        local.set $l7
                        block $B83
                          block $B84
                            local.get $l4
                            i32.const 255
                            i32.gt_u
                            br_if $B84
                            local.get $l5
                            i32.load offset=12
                            local.set $l3
                            block $B85
                              local.get $l5
                              i32.load offset=8
                              local.tee $l2
                              local.get $l4
                              i32.const 3
                              i32.shr_u
                              local.tee $l9
                              i32.const 3
                              i32.shl
                              i32.const 1060316
                              i32.add
                              local.tee $l4
                              i32.eq
                              br_if $B85
                              local.get $l8
                              local.get $l2
                              i32.gt_u
                              drop
                            end
                            block $B86
                              local.get $l3
                              local.get $l2
                              i32.ne
                              br_if $B86
                              i32.const 0
                              i32.const 0
                              i32.load offset=1060276
                              i32.const -2
                              local.get $l9
                              i32.rotl
                              i32.and
                              i32.store offset=1060276
                              br $B83
                            end
                            block $B87
                              local.get $l3
                              local.get $l4
                              i32.eq
                              br_if $B87
                              local.get $l8
                              local.get $l3
                              i32.gt_u
                              drop
                            end
                            local.get $l3
                            local.get $l2
                            i32.store offset=8
                            local.get $l2
                            local.get $l3
                            i32.store offset=12
                            br $B83
                          end
                          local.get $l5
                          i32.load offset=24
                          local.set $l9
                          block $B88
                            block $B89
                              local.get $l5
                              i32.load offset=12
                              local.tee $l2
                              local.get $l5
                              i32.eq
                              br_if $B89
                              block $B90
                                local.get $l8
                                local.get $l5
                                i32.load offset=8
                                local.tee $l4
                                i32.gt_u
                                br_if $B90
                                local.get $l4
                                i32.load offset=12
                                local.get $l5
                                i32.ne
                                drop
                              end
                              local.get $l2
                              local.get $l4
                              i32.store offset=8
                              local.get $l4
                              local.get $l2
                              i32.store offset=12
                              br $B88
                            end
                            block $B91
                              local.get $l5
                              i32.const 20
                              i32.add
                              local.tee $l4
                              i32.load
                              local.tee $l3
                              br_if $B91
                              local.get $l5
                              i32.const 16
                              i32.add
                              local.tee $l4
                              i32.load
                              local.tee $l3
                              br_if $B91
                              i32.const 0
                              local.set $l2
                              br $B88
                            end
                            loop $L92
                              local.get $l4
                              local.set $l8
                              local.get $l3
                              local.tee $l2
                              i32.const 20
                              i32.add
                              local.tee $l4
                              i32.load
                              local.tee $l3
                              br_if $L92
                              local.get $l2
                              i32.const 16
                              i32.add
                              local.set $l4
                              local.get $l2
                              i32.load offset=16
                              local.tee $l3
                              br_if $L92
                            end
                            local.get $l8
                            i32.const 0
                            i32.store
                          end
                          local.get $l9
                          i32.eqz
                          br_if $B83
                          block $B93
                            block $B94
                              local.get $l5
                              i32.load offset=28
                              local.tee $l3
                              i32.const 2
                              i32.shl
                              i32.const 1060580
                              i32.add
                              local.tee $l4
                              i32.load
                              local.get $l5
                              i32.ne
                              br_if $B94
                              local.get $l4
                              local.get $l2
                              i32.store
                              local.get $l2
                              br_if $B93
                              i32.const 0
                              i32.const 0
                              i32.load offset=1060280
                              i32.const -2
                              local.get $l3
                              i32.rotl
                              i32.and
                              i32.store offset=1060280
                              br $B83
                            end
                            local.get $l9
                            i32.const 16
                            i32.const 20
                            local.get $l9
                            i32.load offset=16
                            local.get $l5
                            i32.eq
                            select
                            i32.add
                            local.get $l2
                            i32.store
                            local.get $l2
                            i32.eqz
                            br_if $B83
                          end
                          local.get $l2
                          local.get $l9
                          i32.store offset=24
                          block $B95
                            local.get $l5
                            i32.load offset=16
                            local.tee $l4
                            i32.eqz
                            br_if $B95
                            local.get $l2
                            local.get $l4
                            i32.store offset=16
                            local.get $l4
                            local.get $l2
                            i32.store offset=24
                          end
                          local.get $l5
                          i32.load offset=20
                          local.tee $l4
                          i32.eqz
                          br_if $B83
                          local.get $l2
                          i32.const 20
                          i32.add
                          local.get $l4
                          i32.store
                          local.get $l4
                          local.get $l2
                          i32.store offset=24
                        end
                        local.get $l7
                        local.get $p0
                        i32.add
                        local.set $p0
                        local.get $l5
                        local.get $l7
                        i32.add
                        local.set $l5
                      end
                      local.get $l5
                      local.get $l5
                      i32.load offset=4
                      i32.const -2
                      i32.and
                      i32.store offset=4
                      local.get $l6
                      local.get $p0
                      i32.add
                      local.get $p0
                      i32.store
                      local.get $l6
                      local.get $p0
                      i32.const 1
                      i32.or
                      i32.store offset=4
                      block $B96
                        local.get $p0
                        i32.const 255
                        i32.gt_u
                        br_if $B96
                        local.get $p0
                        i32.const 3
                        i32.shr_u
                        local.tee $l4
                        i32.const 3
                        i32.shl
                        i32.const 1060316
                        i32.add
                        local.set $p0
                        block $B97
                          block $B98
                            i32.const 0
                            i32.load offset=1060276
                            local.tee $l3
                            i32.const 1
                            local.get $l4
                            i32.shl
                            local.tee $l4
                            i32.and
                            br_if $B98
                            i32.const 0
                            local.get $l3
                            local.get $l4
                            i32.or
                            i32.store offset=1060276
                            local.get $p0
                            local.set $l4
                            br $B97
                          end
                          local.get $p0
                          i32.load offset=8
                          local.set $l4
                        end
                        local.get $l4
                        local.get $l6
                        i32.store offset=12
                        local.get $p0
                        local.get $l6
                        i32.store offset=8
                        local.get $l6
                        local.get $p0
                        i32.store offset=12
                        local.get $l6
                        local.get $l4
                        i32.store offset=8
                        br $B71
                      end
                      i32.const 0
                      local.set $l4
                      block $B99
                        local.get $p0
                        i32.const 8
                        i32.shr_u
                        local.tee $l3
                        i32.eqz
                        br_if $B99
                        i32.const 31
                        local.set $l4
                        local.get $p0
                        i32.const 16777215
                        i32.gt_u
                        br_if $B99
                        local.get $l3
                        local.get $l3
                        i32.const 1048320
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 8
                        i32.and
                        local.tee $l4
                        i32.shl
                        local.tee $l3
                        local.get $l3
                        i32.const 520192
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 4
                        i32.and
                        local.tee $l3
                        i32.shl
                        local.tee $l5
                        local.get $l5
                        i32.const 245760
                        i32.add
                        i32.const 16
                        i32.shr_u
                        i32.const 2
                        i32.and
                        local.tee $l5
                        i32.shl
                        i32.const 15
                        i32.shr_u
                        local.get $l3
                        local.get $l4
                        i32.or
                        local.get $l5
                        i32.or
                        i32.sub
                        local.tee $l4
                        i32.const 1
                        i32.shl
                        local.get $p0
                        local.get $l4
                        i32.const 21
                        i32.add
                        i32.shr_u
                        i32.const 1
                        i32.and
                        i32.or
                        i32.const 28
                        i32.add
                        local.set $l4
                      end
                      local.get $l6
                      local.get $l4
                      i32.store offset=28
                      local.get $l6
                      i64.const 0
                      i64.store offset=16 align=4
                      local.get $l4
                      i32.const 2
                      i32.shl
                      i32.const 1060580
                      i32.add
                      local.set $l3
                      block $B100
                        i32.const 0
                        i32.load offset=1060280
                        local.tee $l5
                        i32.const 1
                        local.get $l4
                        i32.shl
                        local.tee $l8
                        i32.and
                        br_if $B100
                        local.get $l3
                        local.get $l6
                        i32.store
                        i32.const 0
                        local.get $l5
                        local.get $l8
                        i32.or
                        i32.store offset=1060280
                        local.get $l6
                        local.get $l3
                        i32.store offset=24
                        local.get $l6
                        local.get $l6
                        i32.store offset=8
                        local.get $l6
                        local.get $l6
                        i32.store offset=12
                        br $B71
                      end
                      local.get $p0
                      i32.const 0
                      i32.const 25
                      local.get $l4
                      i32.const 1
                      i32.shr_u
                      i32.sub
                      local.get $l4
                      i32.const 31
                      i32.eq
                      select
                      i32.shl
                      local.set $l4
                      local.get $l3
                      i32.load
                      local.set $l5
                      loop $L101
                        local.get $l5
                        local.tee $l3
                        i32.load offset=4
                        i32.const -8
                        i32.and
                        local.get $p0
                        i32.eq
                        br_if $B72
                        local.get $l4
                        i32.const 29
                        i32.shr_u
                        local.set $l5
                        local.get $l4
                        i32.const 1
                        i32.shl
                        local.set $l4
                        local.get $l3
                        local.get $l5
                        i32.const 4
                        i32.and
                        i32.add
                        i32.const 16
                        i32.add
                        local.tee $l8
                        i32.load
                        local.tee $l5
                        br_if $L101
                      end
                      local.get $l8
                      local.get $l6
                      i32.store
                      local.get $l6
                      local.get $l3
                      i32.store offset=24
                      local.get $l6
                      local.get $l6
                      i32.store offset=12
                      local.get $l6
                      local.get $l6
                      i32.store offset=8
                      br $B71
                    end
                    local.get $l5
                    i32.const -8
                    local.get $l5
                    i32.sub
                    i32.const 15
                    i32.and
                    i32.const 0
                    local.get $l5
                    i32.const 8
                    i32.add
                    i32.const 15
                    i32.and
                    select
                    local.tee $p0
                    i32.add
                    local.tee $l11
                    local.get $l2
                    i32.const -56
                    i32.add
                    local.tee $l8
                    local.get $p0
                    i32.sub
                    local.tee $p0
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    local.get $l5
                    local.get $l8
                    i32.add
                    i32.const 56
                    i32.store offset=4
                    local.get $l4
                    local.get $l6
                    i32.const 55
                    local.get $l6
                    i32.sub
                    i32.const 15
                    i32.and
                    i32.const 0
                    local.get $l6
                    i32.const -55
                    i32.add
                    i32.const 15
                    i32.and
                    select
                    i32.add
                    i32.const -63
                    i32.add
                    local.tee $l8
                    local.get $l8
                    local.get $l4
                    i32.const 16
                    i32.add
                    i32.lt_u
                    select
                    local.tee $l8
                    i32.const 35
                    i32.store offset=4
                    i32.const 0
                    i32.const 0
                    i32.load offset=1060764
                    i32.store offset=1060304
                    i32.const 0
                    local.get $p0
                    i32.store offset=1060288
                    i32.const 0
                    local.get $l11
                    i32.store offset=1060300
                    local.get $l8
                    i32.const 16
                    i32.add
                    i32.const 0
                    i64.load offset=1060732 align=4
                    i64.store align=4
                    local.get $l8
                    i32.const 0
                    i64.load offset=1060724 align=4
                    i64.store offset=8 align=4
                    i32.const 0
                    local.get $l8
                    i32.const 8
                    i32.add
                    i32.store offset=1060732
                    i32.const 0
                    local.get $l2
                    i32.store offset=1060728
                    i32.const 0
                    local.get $l5
                    i32.store offset=1060724
                    i32.const 0
                    i32.const 0
                    i32.store offset=1060736
                    local.get $l8
                    i32.const 36
                    i32.add
                    local.set $p0
                    loop $L102
                      local.get $p0
                      i32.const 7
                      i32.store
                      local.get $p0
                      i32.const 4
                      i32.add
                      local.tee $p0
                      local.get $l6
                      i32.lt_u
                      br_if $L102
                    end
                    local.get $l8
                    local.get $l4
                    i32.eq
                    br_if $B61
                    local.get $l8
                    local.get $l8
                    i32.load offset=4
                    i32.const -2
                    i32.and
                    i32.store offset=4
                    local.get $l8
                    local.get $l8
                    local.get $l4
                    i32.sub
                    local.tee $l2
                    i32.store
                    local.get $l4
                    local.get $l2
                    i32.const 1
                    i32.or
                    i32.store offset=4
                    block $B103
                      local.get $l2
                      i32.const 255
                      i32.gt_u
                      br_if $B103
                      local.get $l2
                      i32.const 3
                      i32.shr_u
                      local.tee $l6
                      i32.const 3
                      i32.shl
                      i32.const 1060316
                      i32.add
                      local.set $p0
                      block $B104
                        block $B105
                          i32.const 0
                          i32.load offset=1060276
                          local.tee $l5
                          i32.const 1
                          local.get $l6
                          i32.shl
                          local.tee $l6
                          i32.and
                          br_if $B105
                          i32.const 0
                          local.get $l5
                          local.get $l6
                          i32.or
                          i32.store offset=1060276
                          local.get $p0
                          local.set $l6
                          br $B104
                        end
                        local.get $p0
                        i32.load offset=8
                        local.set $l6
                      end
                      local.get $l6
                      local.get $l4
                      i32.store offset=12
                      local.get $p0
                      local.get $l4
                      i32.store offset=8
                      local.get $l4
                      local.get $p0
                      i32.store offset=12
                      local.get $l4
                      local.get $l6
                      i32.store offset=8
                      br $B61
                    end
                    i32.const 0
                    local.set $p0
                    block $B106
                      local.get $l2
                      i32.const 8
                      i32.shr_u
                      local.tee $l6
                      i32.eqz
                      br_if $B106
                      i32.const 31
                      local.set $p0
                      local.get $l2
                      i32.const 16777215
                      i32.gt_u
                      br_if $B106
                      local.get $l6
                      local.get $l6
                      i32.const 1048320
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 8
                      i32.and
                      local.tee $p0
                      i32.shl
                      local.tee $l6
                      local.get $l6
                      i32.const 520192
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 4
                      i32.and
                      local.tee $l6
                      i32.shl
                      local.tee $l5
                      local.get $l5
                      i32.const 245760
                      i32.add
                      i32.const 16
                      i32.shr_u
                      i32.const 2
                      i32.and
                      local.tee $l5
                      i32.shl
                      i32.const 15
                      i32.shr_u
                      local.get $l6
                      local.get $p0
                      i32.or
                      local.get $l5
                      i32.or
                      i32.sub
                      local.tee $p0
                      i32.const 1
                      i32.shl
                      local.get $l2
                      local.get $p0
                      i32.const 21
                      i32.add
                      i32.shr_u
                      i32.const 1
                      i32.and
                      i32.or
                      i32.const 28
                      i32.add
                      local.set $p0
                    end
                    local.get $l4
                    i64.const 0
                    i64.store offset=16 align=4
                    local.get $l4
                    i32.const 28
                    i32.add
                    local.get $p0
                    i32.store
                    local.get $p0
                    i32.const 2
                    i32.shl
                    i32.const 1060580
                    i32.add
                    local.set $l6
                    block $B107
                      i32.const 0
                      i32.load offset=1060280
                      local.tee $l5
                      i32.const 1
                      local.get $p0
                      i32.shl
                      local.tee $l8
                      i32.and
                      br_if $B107
                      local.get $l6
                      local.get $l4
                      i32.store
                      i32.const 0
                      local.get $l5
                      local.get $l8
                      i32.or
                      i32.store offset=1060280
                      local.get $l4
                      i32.const 24
                      i32.add
                      local.get $l6
                      i32.store
                      local.get $l4
                      local.get $l4
                      i32.store offset=8
                      local.get $l4
                      local.get $l4
                      i32.store offset=12
                      br $B61
                    end
                    local.get $l2
                    i32.const 0
                    i32.const 25
                    local.get $p0
                    i32.const 1
                    i32.shr_u
                    i32.sub
                    local.get $p0
                    i32.const 31
                    i32.eq
                    select
                    i32.shl
                    local.set $p0
                    local.get $l6
                    i32.load
                    local.set $l5
                    loop $L108
                      local.get $l5
                      local.tee $l6
                      i32.load offset=4
                      i32.const -8
                      i32.and
                      local.get $l2
                      i32.eq
                      br_if $B70
                      local.get $p0
                      i32.const 29
                      i32.shr_u
                      local.set $l5
                      local.get $p0
                      i32.const 1
                      i32.shl
                      local.set $p0
                      local.get $l6
                      local.get $l5
                      i32.const 4
                      i32.and
                      i32.add
                      i32.const 16
                      i32.add
                      local.tee $l8
                      i32.load
                      local.tee $l5
                      br_if $L108
                    end
                    local.get $l8
                    local.get $l4
                    i32.store
                    local.get $l4
                    i32.const 24
                    i32.add
                    local.get $l6
                    i32.store
                    local.get $l4
                    local.get $l4
                    i32.store offset=12
                    local.get $l4
                    local.get $l4
                    i32.store offset=8
                    br $B61
                  end
                  local.get $l3
                  i32.load offset=8
                  local.set $p0
                  local.get $l3
                  local.get $l6
                  i32.store offset=8
                  local.get $p0
                  local.get $l6
                  i32.store offset=12
                  local.get $l6
                  i32.const 0
                  i32.store offset=24
                  local.get $l6
                  local.get $p0
                  i32.store offset=8
                  local.get $l6
                  local.get $l3
                  i32.store offset=12
                end
                local.get $l11
                i32.const 8
                i32.add
                local.set $p0
                br $B0
              end
              local.get $l6
              i32.load offset=8
              local.set $p0
              local.get $l6
              local.get $l4
              i32.store offset=8
              local.get $p0
              local.get $l4
              i32.store offset=12
              local.get $l4
              i32.const 24
              i32.add
              i32.const 0
              i32.store
              local.get $l4
              local.get $p0
              i32.store offset=8
              local.get $l4
              local.get $l6
              i32.store offset=12
            end
            i32.const 0
            i32.load offset=1060288
            local.tee $p0
            local.get $l3
            i32.le_u
            br_if $B3
            i32.const 0
            i32.load offset=1060300
            local.tee $l4
            local.get $l3
            i32.add
            local.tee $l6
            local.get $p0
            local.get $l3
            i32.sub
            local.tee $p0
            i32.const 1
            i32.or
            i32.store offset=4
            i32.const 0
            local.get $p0
            i32.store offset=1060288
            i32.const 0
            local.get $l6
            i32.store offset=1060300
            local.get $l4
            local.get $l3
            i32.const 3
            i32.or
            i32.store offset=4
            local.get $l4
            i32.const 8
            i32.add
            local.set $p0
            br $B0
          end
          i32.const 0
          local.set $p0
          i32.const 0
          i32.const 48
          i32.store offset=1060772
          br $B0
        end
        block $B109
          local.get $l11
          i32.eqz
          br_if $B109
          block $B110
            block $B111
              local.get $l8
              local.get $l8
              i32.load offset=28
              local.tee $l4
              i32.const 2
              i32.shl
              i32.const 1060580
              i32.add
              local.tee $p0
              i32.load
              i32.ne
              br_if $B111
              local.get $p0
              local.get $l5
              i32.store
              local.get $l5
              br_if $B110
              i32.const 0
              local.get $l7
              i32.const -2
              local.get $l4
              i32.rotl
              i32.and
              local.tee $l7
              i32.store offset=1060280
              br $B109
            end
            local.get $l11
            i32.const 16
            i32.const 20
            local.get $l11
            i32.load offset=16
            local.get $l8
            i32.eq
            select
            i32.add
            local.get $l5
            i32.store
            local.get $l5
            i32.eqz
            br_if $B109
          end
          local.get $l5
          local.get $l11
          i32.store offset=24
          block $B112
            local.get $l8
            i32.load offset=16
            local.tee $p0
            i32.eqz
            br_if $B112
            local.get $l5
            local.get $p0
            i32.store offset=16
            local.get $p0
            local.get $l5
            i32.store offset=24
          end
          local.get $l8
          i32.const 20
          i32.add
          i32.load
          local.tee $p0
          i32.eqz
          br_if $B109
          local.get $l5
          i32.const 20
          i32.add
          local.get $p0
          i32.store
          local.get $p0
          local.get $l5
          i32.store offset=24
        end
        block $B113
          block $B114
            local.get $l6
            i32.const 15
            i32.gt_u
            br_if $B114
            local.get $l8
            local.get $l6
            local.get $l3
            i32.add
            local.tee $p0
            i32.const 3
            i32.or
            i32.store offset=4
            local.get $l8
            local.get $p0
            i32.add
            local.tee $p0
            local.get $p0
            i32.load offset=4
            i32.const 1
            i32.or
            i32.store offset=4
            br $B113
          end
          local.get $l8
          local.get $l3
          i32.add
          local.tee $l5
          local.get $l6
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $l8
          local.get $l3
          i32.const 3
          i32.or
          i32.store offset=4
          local.get $l5
          local.get $l6
          i32.add
          local.get $l6
          i32.store
          block $B115
            local.get $l6
            i32.const 255
            i32.gt_u
            br_if $B115
            local.get $l6
            i32.const 3
            i32.shr_u
            local.tee $l4
            i32.const 3
            i32.shl
            i32.const 1060316
            i32.add
            local.set $p0
            block $B116
              block $B117
                i32.const 0
                i32.load offset=1060276
                local.tee $l6
                i32.const 1
                local.get $l4
                i32.shl
                local.tee $l4
                i32.and
                br_if $B117
                i32.const 0
                local.get $l6
                local.get $l4
                i32.or
                i32.store offset=1060276
                local.get $p0
                local.set $l4
                br $B116
              end
              local.get $p0
              i32.load offset=8
              local.set $l4
            end
            local.get $l4
            local.get $l5
            i32.store offset=12
            local.get $p0
            local.get $l5
            i32.store offset=8
            local.get $l5
            local.get $p0
            i32.store offset=12
            local.get $l5
            local.get $l4
            i32.store offset=8
            br $B113
          end
          block $B118
            block $B119
              local.get $l6
              i32.const 8
              i32.shr_u
              local.tee $l4
              br_if $B119
              i32.const 0
              local.set $p0
              br $B118
            end
            i32.const 31
            local.set $p0
            local.get $l6
            i32.const 16777215
            i32.gt_u
            br_if $B118
            local.get $l4
            local.get $l4
            i32.const 1048320
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 8
            i32.and
            local.tee $p0
            i32.shl
            local.tee $l4
            local.get $l4
            i32.const 520192
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 4
            i32.and
            local.tee $l4
            i32.shl
            local.tee $l3
            local.get $l3
            i32.const 245760
            i32.add
            i32.const 16
            i32.shr_u
            i32.const 2
            i32.and
            local.tee $l3
            i32.shl
            i32.const 15
            i32.shr_u
            local.get $l4
            local.get $p0
            i32.or
            local.get $l3
            i32.or
            i32.sub
            local.tee $p0
            i32.const 1
            i32.shl
            local.get $l6
            local.get $p0
            i32.const 21
            i32.add
            i32.shr_u
            i32.const 1
            i32.and
            i32.or
            i32.const 28
            i32.add
            local.set $p0
          end
          local.get $l5
          local.get $p0
          i32.store offset=28
          local.get $l5
          i64.const 0
          i64.store offset=16 align=4
          local.get $p0
          i32.const 2
          i32.shl
          i32.const 1060580
          i32.add
          local.set $l4
          block $B120
            local.get $l7
            i32.const 1
            local.get $p0
            i32.shl
            local.tee $l3
            i32.and
            br_if $B120
            local.get $l4
            local.get $l5
            i32.store
            i32.const 0
            local.get $l7
            local.get $l3
            i32.or
            i32.store offset=1060280
            local.get $l5
            local.get $l4
            i32.store offset=24
            local.get $l5
            local.get $l5
            i32.store offset=8
            local.get $l5
            local.get $l5
            i32.store offset=12
            br $B113
          end
          local.get $l6
          i32.const 0
          i32.const 25
          local.get $p0
          i32.const 1
          i32.shr_u
          i32.sub
          local.get $p0
          i32.const 31
          i32.eq
          select
          i32.shl
          local.set $p0
          local.get $l4
          i32.load
          local.set $l3
          block $B121
            loop $L122
              local.get $l3
              local.tee $l4
              i32.load offset=4
              i32.const -8
              i32.and
              local.get $l6
              i32.eq
              br_if $B121
              local.get $p0
              i32.const 29
              i32.shr_u
              local.set $l3
              local.get $p0
              i32.const 1
              i32.shl
              local.set $p0
              local.get $l4
              local.get $l3
              i32.const 4
              i32.and
              i32.add
              i32.const 16
              i32.add
              local.tee $l2
              i32.load
              local.tee $l3
              br_if $L122
            end
            local.get $l2
            local.get $l5
            i32.store
            local.get $l5
            local.get $l4
            i32.store offset=24
            local.get $l5
            local.get $l5
            i32.store offset=12
            local.get $l5
            local.get $l5
            i32.store offset=8
            br $B113
          end
          local.get $l4
          i32.load offset=8
          local.set $p0
          local.get $l4
          local.get $l5
          i32.store offset=8
          local.get $p0
          local.get $l5
          i32.store offset=12
          local.get $l5
          i32.const 0
          i32.store offset=24
          local.get $l5
          local.get $p0
          i32.store offset=8
          local.get $l5
          local.get $l4
          i32.store offset=12
        end
        local.get $l8
        i32.const 8
        i32.add
        local.set $p0
        br $B0
      end
      block $B123
        local.get $l10
        i32.eqz
        br_if $B123
        block $B124
          block $B125
            local.get $l5
            local.get $l5
            i32.load offset=28
            local.tee $l6
            i32.const 2
            i32.shl
            i32.const 1060580
            i32.add
            local.tee $p0
            i32.load
            i32.ne
            br_if $B125
            local.get $p0
            local.get $l8
            i32.store
            local.get $l8
            br_if $B124
            i32.const 0
            local.get $l9
            i32.const -2
            local.get $l6
            i32.rotl
            i32.and
            i32.store offset=1060280
            br $B123
          end
          local.get $l10
          i32.const 16
          i32.const 20
          local.get $l10
          i32.load offset=16
          local.get $l5
          i32.eq
          select
          i32.add
          local.get $l8
          i32.store
          local.get $l8
          i32.eqz
          br_if $B123
        end
        local.get $l8
        local.get $l10
        i32.store offset=24
        block $B126
          local.get $l5
          i32.load offset=16
          local.tee $p0
          i32.eqz
          br_if $B126
          local.get $l8
          local.get $p0
          i32.store offset=16
          local.get $p0
          local.get $l8
          i32.store offset=24
        end
        local.get $l5
        i32.const 20
        i32.add
        i32.load
        local.tee $p0
        i32.eqz
        br_if $B123
        local.get $l8
        i32.const 20
        i32.add
        local.get $p0
        i32.store
        local.get $p0
        local.get $l8
        i32.store offset=24
      end
      block $B127
        block $B128
          local.get $l4
          i32.const 15
          i32.gt_u
          br_if $B128
          local.get $l5
          local.get $l4
          local.get $l3
          i32.add
          local.tee $p0
          i32.const 3
          i32.or
          i32.store offset=4
          local.get $l5
          local.get $p0
          i32.add
          local.tee $p0
          local.get $p0
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          br $B127
        end
        local.get $l5
        local.get $l3
        i32.add
        local.tee $l6
        local.get $l4
        i32.const 1
        i32.or
        i32.store offset=4
        local.get $l5
        local.get $l3
        i32.const 3
        i32.or
        i32.store offset=4
        local.get $l6
        local.get $l4
        i32.add
        local.get $l4
        i32.store
        block $B129
          local.get $l7
          i32.eqz
          br_if $B129
          local.get $l7
          i32.const 3
          i32.shr_u
          local.tee $l8
          i32.const 3
          i32.shl
          i32.const 1060316
          i32.add
          local.set $l3
          i32.const 0
          i32.load offset=1060296
          local.set $p0
          block $B130
            block $B131
              i32.const 1
              local.get $l8
              i32.shl
              local.tee $l8
              local.get $l2
              i32.and
              br_if $B131
              i32.const 0
              local.get $l8
              local.get $l2
              i32.or
              i32.store offset=1060276
              local.get $l3
              local.set $l8
              br $B130
            end
            local.get $l3
            i32.load offset=8
            local.set $l8
          end
          local.get $l8
          local.get $p0
          i32.store offset=12
          local.get $l3
          local.get $p0
          i32.store offset=8
          local.get $p0
          local.get $l3
          i32.store offset=12
          local.get $p0
          local.get $l8
          i32.store offset=8
        end
        i32.const 0
        local.get $l6
        i32.store offset=1060296
        i32.const 0
        local.get $l4
        i32.store offset=1060284
      end
      local.get $l5
      i32.const 8
      i32.add
      local.set $p0
    end
    local.get $l1
    i32.const 16
    i32.add
    global.set $g0
    local.get $p0)
  (func $free (type $t1) (param $p0 i32)
    local.get $p0
    call $dlfree)
  (func $dlfree (type $t1) (param $p0 i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    block $B0
      local.get $p0
      i32.eqz
      br_if $B0
      local.get $p0
      i32.const -8
      i32.add
      local.tee $l1
      local.get $p0
      i32.const -4
      i32.add
      i32.load
      local.tee $l2
      i32.const -8
      i32.and
      local.tee $p0
      i32.add
      local.set $l3
      block $B1
        local.get $l2
        i32.const 1
        i32.and
        br_if $B1
        local.get $l2
        i32.const 3
        i32.and
        i32.eqz
        br_if $B0
        local.get $l1
        local.get $l1
        i32.load
        local.tee $l2
        i32.sub
        local.tee $l1
        i32.const 0
        i32.load offset=1060292
        local.tee $l4
        i32.lt_u
        br_if $B0
        local.get $l2
        local.get $p0
        i32.add
        local.set $p0
        block $B2
          i32.const 0
          i32.load offset=1060296
          local.get $l1
          i32.eq
          br_if $B2
          block $B3
            local.get $l2
            i32.const 255
            i32.gt_u
            br_if $B3
            local.get $l1
            i32.load offset=12
            local.set $l5
            block $B4
              local.get $l1
              i32.load offset=8
              local.tee $l6
              local.get $l2
              i32.const 3
              i32.shr_u
              local.tee $l7
              i32.const 3
              i32.shl
              i32.const 1060316
              i32.add
              local.tee $l2
              i32.eq
              br_if $B4
              local.get $l4
              local.get $l6
              i32.gt_u
              drop
            end
            block $B5
              local.get $l5
              local.get $l6
              i32.ne
              br_if $B5
              i32.const 0
              i32.const 0
              i32.load offset=1060276
              i32.const -2
              local.get $l7
              i32.rotl
              i32.and
              i32.store offset=1060276
              br $B1
            end
            block $B6
              local.get $l5
              local.get $l2
              i32.eq
              br_if $B6
              local.get $l4
              local.get $l5
              i32.gt_u
              drop
            end
            local.get $l5
            local.get $l6
            i32.store offset=8
            local.get $l6
            local.get $l5
            i32.store offset=12
            br $B1
          end
          local.get $l1
          i32.load offset=24
          local.set $l7
          block $B7
            block $B8
              local.get $l1
              i32.load offset=12
              local.tee $l5
              local.get $l1
              i32.eq
              br_if $B8
              block $B9
                local.get $l4
                local.get $l1
                i32.load offset=8
                local.tee $l2
                i32.gt_u
                br_if $B9
                local.get $l2
                i32.load offset=12
                local.get $l1
                i32.ne
                drop
              end
              local.get $l5
              local.get $l2
              i32.store offset=8
              local.get $l2
              local.get $l5
              i32.store offset=12
              br $B7
            end
            block $B10
              local.get $l1
              i32.const 20
              i32.add
              local.tee $l2
              i32.load
              local.tee $l4
              br_if $B10
              local.get $l1
              i32.const 16
              i32.add
              local.tee $l2
              i32.load
              local.tee $l4
              br_if $B10
              i32.const 0
              local.set $l5
              br $B7
            end
            loop $L11
              local.get $l2
              local.set $l6
              local.get $l4
              local.tee $l5
              i32.const 20
              i32.add
              local.tee $l2
              i32.load
              local.tee $l4
              br_if $L11
              local.get $l5
              i32.const 16
              i32.add
              local.set $l2
              local.get $l5
              i32.load offset=16
              local.tee $l4
              br_if $L11
            end
            local.get $l6
            i32.const 0
            i32.store
          end
          local.get $l7
          i32.eqz
          br_if $B1
          block $B12
            block $B13
              local.get $l1
              i32.load offset=28
              local.tee $l4
              i32.const 2
              i32.shl
              i32.const 1060580
              i32.add
              local.tee $l2
              i32.load
              local.get $l1
              i32.ne
              br_if $B13
              local.get $l2
              local.get $l5
              i32.store
              local.get $l5
              br_if $B12
              i32.const 0
              i32.const 0
              i32.load offset=1060280
              i32.const -2
              local.get $l4
              i32.rotl
              i32.and
              i32.store offset=1060280
              br $B1
            end
            local.get $l7
            i32.const 16
            i32.const 20
            local.get $l7
            i32.load offset=16
            local.get $l1
            i32.eq
            select
            i32.add
            local.get $l5
            i32.store
            local.get $l5
            i32.eqz
            br_if $B1
          end
          local.get $l5
          local.get $l7
          i32.store offset=24
          block $B14
            local.get $l1
            i32.load offset=16
            local.tee $l2
            i32.eqz
            br_if $B14
            local.get $l5
            local.get $l2
            i32.store offset=16
            local.get $l2
            local.get $l5
            i32.store offset=24
          end
          local.get $l1
          i32.load offset=20
          local.tee $l2
          i32.eqz
          br_if $B1
          local.get $l5
          i32.const 20
          i32.add
          local.get $l2
          i32.store
          local.get $l2
          local.get $l5
          i32.store offset=24
          br $B1
        end
        local.get $l3
        i32.load offset=4
        local.tee $l2
        i32.const 3
        i32.and
        i32.const 3
        i32.ne
        br_if $B1
        local.get $l3
        local.get $l2
        i32.const -2
        i32.and
        i32.store offset=4
        i32.const 0
        local.get $p0
        i32.store offset=1060284
        local.get $l1
        local.get $p0
        i32.add
        local.get $p0
        i32.store
        local.get $l1
        local.get $p0
        i32.const 1
        i32.or
        i32.store offset=4
        return
      end
      local.get $l3
      local.get $l1
      i32.le_u
      br_if $B0
      local.get $l3
      i32.load offset=4
      local.tee $l2
      i32.const 1
      i32.and
      i32.eqz
      br_if $B0
      block $B15
        block $B16
          local.get $l2
          i32.const 2
          i32.and
          br_if $B16
          block $B17
            i32.const 0
            i32.load offset=1060300
            local.get $l3
            i32.ne
            br_if $B17
            i32.const 0
            local.get $l1
            i32.store offset=1060300
            i32.const 0
            i32.const 0
            i32.load offset=1060288
            local.get $p0
            i32.add
            local.tee $p0
            i32.store offset=1060288
            local.get $l1
            local.get $p0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get $l1
            i32.const 0
            i32.load offset=1060296
            i32.ne
            br_if $B0
            i32.const 0
            i32.const 0
            i32.store offset=1060284
            i32.const 0
            i32.const 0
            i32.store offset=1060296
            return
          end
          block $B18
            i32.const 0
            i32.load offset=1060296
            local.get $l3
            i32.ne
            br_if $B18
            i32.const 0
            local.get $l1
            i32.store offset=1060296
            i32.const 0
            i32.const 0
            i32.load offset=1060284
            local.get $p0
            i32.add
            local.tee $p0
            i32.store offset=1060284
            local.get $l1
            local.get $p0
            i32.const 1
            i32.or
            i32.store offset=4
            local.get $l1
            local.get $p0
            i32.add
            local.get $p0
            i32.store
            return
          end
          local.get $l2
          i32.const -8
          i32.and
          local.get $p0
          i32.add
          local.set $p0
          block $B19
            block $B20
              local.get $l2
              i32.const 255
              i32.gt_u
              br_if $B20
              local.get $l3
              i32.load offset=12
              local.set $l4
              block $B21
                local.get $l3
                i32.load offset=8
                local.tee $l5
                local.get $l2
                i32.const 3
                i32.shr_u
                local.tee $l3
                i32.const 3
                i32.shl
                i32.const 1060316
                i32.add
                local.tee $l2
                i32.eq
                br_if $B21
                i32.const 0
                i32.load offset=1060292
                local.get $l5
                i32.gt_u
                drop
              end
              block $B22
                local.get $l4
                local.get $l5
                i32.ne
                br_if $B22
                i32.const 0
                i32.const 0
                i32.load offset=1060276
                i32.const -2
                local.get $l3
                i32.rotl
                i32.and
                i32.store offset=1060276
                br $B19
              end
              block $B23
                local.get $l4
                local.get $l2
                i32.eq
                br_if $B23
                i32.const 0
                i32.load offset=1060292
                local.get $l4
                i32.gt_u
                drop
              end
              local.get $l4
              local.get $l5
              i32.store offset=8
              local.get $l5
              local.get $l4
              i32.store offset=12
              br $B19
            end
            local.get $l3
            i32.load offset=24
            local.set $l7
            block $B24
              block $B25
                local.get $l3
                i32.load offset=12
                local.tee $l5
                local.get $l3
                i32.eq
                br_if $B25
                block $B26
                  i32.const 0
                  i32.load offset=1060292
                  local.get $l3
                  i32.load offset=8
                  local.tee $l2
                  i32.gt_u
                  br_if $B26
                  local.get $l2
                  i32.load offset=12
                  local.get $l3
                  i32.ne
                  drop
                end
                local.get $l5
                local.get $l2
                i32.store offset=8
                local.get $l2
                local.get $l5
                i32.store offset=12
                br $B24
              end
              block $B27
                local.get $l3
                i32.const 20
                i32.add
                local.tee $l2
                i32.load
                local.tee $l4
                br_if $B27
                local.get $l3
                i32.const 16
                i32.add
                local.tee $l2
                i32.load
                local.tee $l4
                br_if $B27
                i32.const 0
                local.set $l5
                br $B24
              end
              loop $L28
                local.get $l2
                local.set $l6
                local.get $l4
                local.tee $l5
                i32.const 20
                i32.add
                local.tee $l2
                i32.load
                local.tee $l4
                br_if $L28
                local.get $l5
                i32.const 16
                i32.add
                local.set $l2
                local.get $l5
                i32.load offset=16
                local.tee $l4
                br_if $L28
              end
              local.get $l6
              i32.const 0
              i32.store
            end
            local.get $l7
            i32.eqz
            br_if $B19
            block $B29
              block $B30
                local.get $l3
                i32.load offset=28
                local.tee $l4
                i32.const 2
                i32.shl
                i32.const 1060580
                i32.add
                local.tee $l2
                i32.load
                local.get $l3
                i32.ne
                br_if $B30
                local.get $l2
                local.get $l5
                i32.store
                local.get $l5
                br_if $B29
                i32.const 0
                i32.const 0
                i32.load offset=1060280
                i32.const -2
                local.get $l4
                i32.rotl
                i32.and
                i32.store offset=1060280
                br $B19
              end
              local.get $l7
              i32.const 16
              i32.const 20
              local.get $l7
              i32.load offset=16
              local.get $l3
              i32.eq
              select
              i32.add
              local.get $l5
              i32.store
              local.get $l5
              i32.eqz
              br_if $B19
            end
            local.get $l5
            local.get $l7
            i32.store offset=24
            block $B31
              local.get $l3
              i32.load offset=16
              local.tee $l2
              i32.eqz
              br_if $B31
              local.get $l5
              local.get $l2
              i32.store offset=16
              local.get $l2
              local.get $l5
              i32.store offset=24
            end
            local.get $l3
            i32.load offset=20
            local.tee $l2
            i32.eqz
            br_if $B19
            local.get $l5
            i32.const 20
            i32.add
            local.get $l2
            i32.store
            local.get $l2
            local.get $l5
            i32.store offset=24
          end
          local.get $l1
          local.get $p0
          i32.add
          local.get $p0
          i32.store
          local.get $l1
          local.get $p0
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $l1
          i32.const 0
          i32.load offset=1060296
          i32.ne
          br_if $B15
          i32.const 0
          local.get $p0
          i32.store offset=1060284
          return
        end
        local.get $l3
        local.get $l2
        i32.const -2
        i32.and
        i32.store offset=4
        local.get $l1
        local.get $p0
        i32.add
        local.get $p0
        i32.store
        local.get $l1
        local.get $p0
        i32.const 1
        i32.or
        i32.store offset=4
      end
      block $B32
        local.get $p0
        i32.const 255
        i32.gt_u
        br_if $B32
        local.get $p0
        i32.const 3
        i32.shr_u
        local.tee $l2
        i32.const 3
        i32.shl
        i32.const 1060316
        i32.add
        local.set $p0
        block $B33
          block $B34
            i32.const 0
            i32.load offset=1060276
            local.tee $l4
            i32.const 1
            local.get $l2
            i32.shl
            local.tee $l2
            i32.and
            br_if $B34
            i32.const 0
            local.get $l4
            local.get $l2
            i32.or
            i32.store offset=1060276
            local.get $p0
            local.set $l2
            br $B33
          end
          local.get $p0
          i32.load offset=8
          local.set $l2
        end
        local.get $l2
        local.get $l1
        i32.store offset=12
        local.get $p0
        local.get $l1
        i32.store offset=8
        local.get $l1
        local.get $p0
        i32.store offset=12
        local.get $l1
        local.get $l2
        i32.store offset=8
        return
      end
      i32.const 0
      local.set $l2
      block $B35
        local.get $p0
        i32.const 8
        i32.shr_u
        local.tee $l4
        i32.eqz
        br_if $B35
        i32.const 31
        local.set $l2
        local.get $p0
        i32.const 16777215
        i32.gt_u
        br_if $B35
        local.get $l4
        local.get $l4
        i32.const 1048320
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 8
        i32.and
        local.tee $l2
        i32.shl
        local.tee $l4
        local.get $l4
        i32.const 520192
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 4
        i32.and
        local.tee $l4
        i32.shl
        local.tee $l5
        local.get $l5
        i32.const 245760
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 2
        i32.and
        local.tee $l5
        i32.shl
        i32.const 15
        i32.shr_u
        local.get $l4
        local.get $l2
        i32.or
        local.get $l5
        i32.or
        i32.sub
        local.tee $l2
        i32.const 1
        i32.shl
        local.get $p0
        local.get $l2
        i32.const 21
        i32.add
        i32.shr_u
        i32.const 1
        i32.and
        i32.or
        i32.const 28
        i32.add
        local.set $l2
      end
      local.get $l1
      i64.const 0
      i64.store offset=16 align=4
      local.get $l1
      i32.const 28
      i32.add
      local.get $l2
      i32.store
      local.get $l2
      i32.const 2
      i32.shl
      i32.const 1060580
      i32.add
      local.set $l4
      block $B36
        block $B37
          i32.const 0
          i32.load offset=1060280
          local.tee $l5
          i32.const 1
          local.get $l2
          i32.shl
          local.tee $l3
          i32.and
          br_if $B37
          local.get $l4
          local.get $l1
          i32.store
          i32.const 0
          local.get $l5
          local.get $l3
          i32.or
          i32.store offset=1060280
          local.get $l1
          i32.const 24
          i32.add
          local.get $l4
          i32.store
          local.get $l1
          local.get $l1
          i32.store offset=8
          local.get $l1
          local.get $l1
          i32.store offset=12
          br $B36
        end
        local.get $p0
        i32.const 0
        i32.const 25
        local.get $l2
        i32.const 1
        i32.shr_u
        i32.sub
        local.get $l2
        i32.const 31
        i32.eq
        select
        i32.shl
        local.set $l2
        local.get $l4
        i32.load
        local.set $l5
        block $B38
          loop $L39
            local.get $l5
            local.tee $l4
            i32.load offset=4
            i32.const -8
            i32.and
            local.get $p0
            i32.eq
            br_if $B38
            local.get $l2
            i32.const 29
            i32.shr_u
            local.set $l5
            local.get $l2
            i32.const 1
            i32.shl
            local.set $l2
            local.get $l4
            local.get $l5
            i32.const 4
            i32.and
            i32.add
            i32.const 16
            i32.add
            local.tee $l3
            i32.load
            local.tee $l5
            br_if $L39
          end
          local.get $l3
          local.get $l1
          i32.store
          local.get $l1
          local.get $l1
          i32.store offset=12
          local.get $l1
          i32.const 24
          i32.add
          local.get $l4
          i32.store
          local.get $l1
          local.get $l1
          i32.store offset=8
          br $B36
        end
        local.get $l4
        i32.load offset=8
        local.set $p0
        local.get $l4
        local.get $l1
        i32.store offset=8
        local.get $p0
        local.get $l1
        i32.store offset=12
        local.get $l1
        i32.const 24
        i32.add
        i32.const 0
        i32.store
        local.get $l1
        local.get $p0
        i32.store offset=8
        local.get $l1
        local.get $l4
        i32.store offset=12
      end
      i32.const 0
      i32.const 0
      i32.load offset=1060308
      i32.const -1
      i32.add
      local.tee $l1
      i32.store offset=1060308
      local.get $l1
      br_if $B0
      i32.const 1060732
      local.set $l1
      loop $L40
        local.get $l1
        i32.load
        local.tee $p0
        i32.const 8
        i32.add
        local.set $l1
        local.get $p0
        br_if $L40
      end
      i32.const 0
      i32.const -1
      i32.store offset=1060308
    end)
  (func $calloc (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    block $B0
      block $B1
        local.get $p0
        br_if $B1
        i32.const 0
        local.set $l2
        br $B0
      end
      local.get $p1
      local.get $p0
      i32.mul
      local.set $l2
      local.get $p1
      local.get $p0
      i32.or
      i32.const 65536
      i32.lt_u
      br_if $B0
      local.get $l2
      i32.const -1
      local.get $l2
      local.get $p0
      i32.div_u
      local.get $p1
      i32.eq
      select
      local.set $l2
    end
    block $B2
      local.get $l2
      call $dlmalloc
      local.tee $p0
      i32.eqz
      br_if $B2
      local.get $p0
      i32.const -4
      i32.add
      i32.load8_u
      i32.const 3
      i32.and
      i32.eqz
      br_if $B2
      local.get $p0
      i32.const 0
      local.get $l2
      call $memset
      drop
    end
    local.get $p0)
  (func $realloc (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32)
    block $B0
      local.get $p0
      br_if $B0
      local.get $p1
      call $dlmalloc
      return
    end
    block $B1
      local.get $p1
      i32.const -64
      i32.lt_u
      br_if $B1
      i32.const 0
      i32.const 48
      i32.store offset=1060772
      i32.const 0
      return
    end
    local.get $p1
    i32.const 11
    i32.lt_u
    local.set $l2
    local.get $p1
    i32.const 19
    i32.add
    i32.const -16
    i32.and
    local.set $l3
    local.get $p0
    i32.const -8
    i32.add
    local.set $l4
    local.get $p0
    i32.const -4
    i32.add
    local.tee $l5
    i32.load
    local.tee $l6
    i32.const 3
    i32.and
    local.set $l7
    i32.const 0
    i32.load offset=1060292
    local.set $l8
    block $B2
      local.get $l6
      i32.const -8
      i32.and
      local.tee $l9
      i32.const 1
      i32.lt_s
      br_if $B2
      local.get $l7
      i32.const 1
      i32.eq
      br_if $B2
      local.get $l8
      local.get $l4
      i32.gt_u
      drop
    end
    i32.const 16
    local.get $l3
    local.get $l2
    select
    local.set $l2
    block $B3
      block $B4
        block $B5
          local.get $l7
          br_if $B5
          local.get $l2
          i32.const 256
          i32.lt_u
          br_if $B4
          local.get $l9
          local.get $l2
          i32.const 4
          i32.or
          i32.lt_u
          br_if $B4
          local.get $l9
          local.get $l2
          i32.sub
          i32.const 0
          i32.load offset=1060756
          i32.const 1
          i32.shl
          i32.le_u
          br_if $B3
          br $B4
        end
        local.get $l4
        local.get $l9
        i32.add
        local.set $l7
        block $B6
          local.get $l9
          local.get $l2
          i32.lt_u
          br_if $B6
          local.get $l9
          local.get $l2
          i32.sub
          local.tee $p1
          i32.const 16
          i32.lt_u
          br_if $B3
          local.get $l5
          local.get $l2
          local.get $l6
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store
          local.get $l4
          local.get $l2
          i32.add
          local.tee $l2
          local.get $p1
          i32.const 3
          i32.or
          i32.store offset=4
          local.get $l7
          local.get $l7
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $l2
          local.get $p1
          call $dispose_chunk
          local.get $p0
          return
        end
        block $B7
          i32.const 0
          i32.load offset=1060300
          local.get $l7
          i32.ne
          br_if $B7
          i32.const 0
          i32.load offset=1060288
          local.get $l9
          i32.add
          local.tee $l9
          local.get $l2
          i32.le_u
          br_if $B4
          local.get $l5
          local.get $l2
          local.get $l6
          i32.const 1
          i32.and
          i32.or
          i32.const 2
          i32.or
          i32.store
          i32.const 0
          local.get $l4
          local.get $l2
          i32.add
          local.tee $p1
          i32.store offset=1060300
          i32.const 0
          local.get $l9
          local.get $l2
          i32.sub
          local.tee $l2
          i32.store offset=1060288
          local.get $p1
          local.get $l2
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $p0
          return
        end
        block $B8
          i32.const 0
          i32.load offset=1060296
          local.get $l7
          i32.ne
          br_if $B8
          i32.const 0
          i32.load offset=1060284
          local.get $l9
          i32.add
          local.tee $l9
          local.get $l2
          i32.lt_u
          br_if $B4
          block $B9
            block $B10
              local.get $l9
              local.get $l2
              i32.sub
              local.tee $p1
              i32.const 16
              i32.lt_u
              br_if $B10
              local.get $l5
              local.get $l2
              local.get $l6
              i32.const 1
              i32.and
              i32.or
              i32.const 2
              i32.or
              i32.store
              local.get $l4
              local.get $l2
              i32.add
              local.tee $l2
              local.get $p1
              i32.const 1
              i32.or
              i32.store offset=4
              local.get $l4
              local.get $l9
              i32.add
              local.tee $l9
              local.get $p1
              i32.store
              local.get $l9
              local.get $l9
              i32.load offset=4
              i32.const -2
              i32.and
              i32.store offset=4
              br $B9
            end
            local.get $l5
            local.get $l6
            i32.const 1
            i32.and
            local.get $l9
            i32.or
            i32.const 2
            i32.or
            i32.store
            local.get $l4
            local.get $l9
            i32.add
            local.tee $p1
            local.get $p1
            i32.load offset=4
            i32.const 1
            i32.or
            i32.store offset=4
            i32.const 0
            local.set $p1
            i32.const 0
            local.set $l2
          end
          i32.const 0
          local.get $l2
          i32.store offset=1060296
          i32.const 0
          local.get $p1
          i32.store offset=1060284
          local.get $p0
          return
        end
        local.get $l7
        i32.load offset=4
        local.tee $l3
        i32.const 2
        i32.and
        br_if $B4
        local.get $l3
        i32.const -8
        i32.and
        local.get $l9
        i32.add
        local.tee $l10
        local.get $l2
        i32.lt_u
        br_if $B4
        local.get $l10
        local.get $l2
        i32.sub
        local.set $l11
        block $B11
          block $B12
            local.get $l3
            i32.const 255
            i32.gt_u
            br_if $B12
            local.get $l7
            i32.load offset=12
            local.set $p1
            block $B13
              local.get $l7
              i32.load offset=8
              local.tee $l9
              local.get $l3
              i32.const 3
              i32.shr_u
              local.tee $l3
              i32.const 3
              i32.shl
              i32.const 1060316
              i32.add
              local.tee $l7
              i32.eq
              br_if $B13
              local.get $l8
              local.get $l9
              i32.gt_u
              drop
            end
            block $B14
              local.get $p1
              local.get $l9
              i32.ne
              br_if $B14
              i32.const 0
              i32.const 0
              i32.load offset=1060276
              i32.const -2
              local.get $l3
              i32.rotl
              i32.and
              i32.store offset=1060276
              br $B11
            end
            block $B15
              local.get $p1
              local.get $l7
              i32.eq
              br_if $B15
              local.get $l8
              local.get $p1
              i32.gt_u
              drop
            end
            local.get $p1
            local.get $l9
            i32.store offset=8
            local.get $l9
            local.get $p1
            i32.store offset=12
            br $B11
          end
          local.get $l7
          i32.load offset=24
          local.set $l12
          block $B16
            block $B17
              local.get $l7
              i32.load offset=12
              local.tee $l3
              local.get $l7
              i32.eq
              br_if $B17
              block $B18
                local.get $l8
                local.get $l7
                i32.load offset=8
                local.tee $p1
                i32.gt_u
                br_if $B18
                local.get $p1
                i32.load offset=12
                local.get $l7
                i32.ne
                drop
              end
              local.get $l3
              local.get $p1
              i32.store offset=8
              local.get $p1
              local.get $l3
              i32.store offset=12
              br $B16
            end
            block $B19
              local.get $l7
              i32.const 20
              i32.add
              local.tee $p1
              i32.load
              local.tee $l9
              br_if $B19
              local.get $l7
              i32.const 16
              i32.add
              local.tee $p1
              i32.load
              local.tee $l9
              br_if $B19
              i32.const 0
              local.set $l3
              br $B16
            end
            loop $L20
              local.get $p1
              local.set $l8
              local.get $l9
              local.tee $l3
              i32.const 20
              i32.add
              local.tee $p1
              i32.load
              local.tee $l9
              br_if $L20
              local.get $l3
              i32.const 16
              i32.add
              local.set $p1
              local.get $l3
              i32.load offset=16
              local.tee $l9
              br_if $L20
            end
            local.get $l8
            i32.const 0
            i32.store
          end
          local.get $l12
          i32.eqz
          br_if $B11
          block $B21
            block $B22
              local.get $l7
              i32.load offset=28
              local.tee $l9
              i32.const 2
              i32.shl
              i32.const 1060580
              i32.add
              local.tee $p1
              i32.load
              local.get $l7
              i32.ne
              br_if $B22
              local.get $p1
              local.get $l3
              i32.store
              local.get $l3
              br_if $B21
              i32.const 0
              i32.const 0
              i32.load offset=1060280
              i32.const -2
              local.get $l9
              i32.rotl
              i32.and
              i32.store offset=1060280
              br $B11
            end
            local.get $l12
            i32.const 16
            i32.const 20
            local.get $l12
            i32.load offset=16
            local.get $l7
            i32.eq
            select
            i32.add
            local.get $l3
            i32.store
            local.get $l3
            i32.eqz
            br_if $B11
          end
          local.get $l3
          local.get $l12
          i32.store offset=24
          block $B23
            local.get $l7
            i32.load offset=16
            local.tee $p1
            i32.eqz
            br_if $B23
            local.get $l3
            local.get $p1
            i32.store offset=16
            local.get $p1
            local.get $l3
            i32.store offset=24
          end
          local.get $l7
          i32.load offset=20
          local.tee $p1
          i32.eqz
          br_if $B11
          local.get $l3
          i32.const 20
          i32.add
          local.get $p1
          i32.store
          local.get $p1
          local.get $l3
          i32.store offset=24
        end
        block $B24
          local.get $l11
          i32.const 15
          i32.gt_u
          br_if $B24
          local.get $l5
          local.get $l6
          i32.const 1
          i32.and
          local.get $l10
          i32.or
          i32.const 2
          i32.or
          i32.store
          local.get $l4
          local.get $l10
          i32.add
          local.tee $p1
          local.get $p1
          i32.load offset=4
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $p0
          return
        end
        local.get $l5
        local.get $l2
        local.get $l6
        i32.const 1
        i32.and
        i32.or
        i32.const 2
        i32.or
        i32.store
        local.get $l4
        local.get $l2
        i32.add
        local.tee $p1
        local.get $l11
        i32.const 3
        i32.or
        i32.store offset=4
        local.get $l4
        local.get $l10
        i32.add
        local.tee $l2
        local.get $l2
        i32.load offset=4
        i32.const 1
        i32.or
        i32.store offset=4
        local.get $p1
        local.get $l11
        call $dispose_chunk
        local.get $p0
        return
      end
      block $B25
        local.get $p1
        call $dlmalloc
        local.tee $l2
        br_if $B25
        i32.const 0
        return
      end
      local.get $l2
      local.get $p0
      local.get $l5
      i32.load
      local.tee $l9
      i32.const -8
      i32.and
      i32.const 4
      i32.const 8
      local.get $l9
      i32.const 3
      i32.and
      select
      i32.sub
      local.tee $l9
      local.get $p1
      local.get $l9
      local.get $p1
      i32.lt_u
      select
      call $memcpy
      local.set $p1
      local.get $p0
      call $dlfree
      local.get $p1
      local.set $p0
    end
    local.get $p0)
  (func $dispose_chunk (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    local.get $p0
    local.get $p1
    i32.add
    local.set $l2
    block $B0
      block $B1
        local.get $p0
        i32.load offset=4
        local.tee $l3
        i32.const 1
        i32.and
        br_if $B1
        local.get $l3
        i32.const 3
        i32.and
        i32.eqz
        br_if $B0
        local.get $p0
        i32.load
        local.tee $l3
        local.get $p1
        i32.add
        local.set $p1
        block $B2
          i32.const 0
          i32.load offset=1060296
          local.get $p0
          local.get $l3
          i32.sub
          local.tee $p0
          i32.eq
          br_if $B2
          i32.const 0
          i32.load offset=1060292
          local.set $l4
          block $B3
            local.get $l3
            i32.const 255
            i32.gt_u
            br_if $B3
            local.get $p0
            i32.load offset=12
            local.set $l5
            block $B4
              local.get $p0
              i32.load offset=8
              local.tee $l6
              local.get $l3
              i32.const 3
              i32.shr_u
              local.tee $l7
              i32.const 3
              i32.shl
              i32.const 1060316
              i32.add
              local.tee $l3
              i32.eq
              br_if $B4
              local.get $l4
              local.get $l6
              i32.gt_u
              drop
            end
            block $B5
              local.get $l5
              local.get $l6
              i32.ne
              br_if $B5
              i32.const 0
              i32.const 0
              i32.load offset=1060276
              i32.const -2
              local.get $l7
              i32.rotl
              i32.and
              i32.store offset=1060276
              br $B1
            end
            block $B6
              local.get $l5
              local.get $l3
              i32.eq
              br_if $B6
              local.get $l4
              local.get $l5
              i32.gt_u
              drop
            end
            local.get $l5
            local.get $l6
            i32.store offset=8
            local.get $l6
            local.get $l5
            i32.store offset=12
            br $B1
          end
          local.get $p0
          i32.load offset=24
          local.set $l7
          block $B7
            block $B8
              local.get $p0
              i32.load offset=12
              local.tee $l6
              local.get $p0
              i32.eq
              br_if $B8
              block $B9
                local.get $l4
                local.get $p0
                i32.load offset=8
                local.tee $l3
                i32.gt_u
                br_if $B9
                local.get $l3
                i32.load offset=12
                local.get $p0
                i32.ne
                drop
              end
              local.get $l6
              local.get $l3
              i32.store offset=8
              local.get $l3
              local.get $l6
              i32.store offset=12
              br $B7
            end
            block $B10
              local.get $p0
              i32.const 20
              i32.add
              local.tee $l3
              i32.load
              local.tee $l5
              br_if $B10
              local.get $p0
              i32.const 16
              i32.add
              local.tee $l3
              i32.load
              local.tee $l5
              br_if $B10
              i32.const 0
              local.set $l6
              br $B7
            end
            loop $L11
              local.get $l3
              local.set $l4
              local.get $l5
              local.tee $l6
              i32.const 20
              i32.add
              local.tee $l3
              i32.load
              local.tee $l5
              br_if $L11
              local.get $l6
              i32.const 16
              i32.add
              local.set $l3
              local.get $l6
              i32.load offset=16
              local.tee $l5
              br_if $L11
            end
            local.get $l4
            i32.const 0
            i32.store
          end
          local.get $l7
          i32.eqz
          br_if $B1
          block $B12
            block $B13
              local.get $p0
              i32.load offset=28
              local.tee $l5
              i32.const 2
              i32.shl
              i32.const 1060580
              i32.add
              local.tee $l3
              i32.load
              local.get $p0
              i32.ne
              br_if $B13
              local.get $l3
              local.get $l6
              i32.store
              local.get $l6
              br_if $B12
              i32.const 0
              i32.const 0
              i32.load offset=1060280
              i32.const -2
              local.get $l5
              i32.rotl
              i32.and
              i32.store offset=1060280
              br $B1
            end
            local.get $l7
            i32.const 16
            i32.const 20
            local.get $l7
            i32.load offset=16
            local.get $p0
            i32.eq
            select
            i32.add
            local.get $l6
            i32.store
            local.get $l6
            i32.eqz
            br_if $B1
          end
          local.get $l6
          local.get $l7
          i32.store offset=24
          block $B14
            local.get $p0
            i32.load offset=16
            local.tee $l3
            i32.eqz
            br_if $B14
            local.get $l6
            local.get $l3
            i32.store offset=16
            local.get $l3
            local.get $l6
            i32.store offset=24
          end
          local.get $p0
          i32.load offset=20
          local.tee $l3
          i32.eqz
          br_if $B1
          local.get $l6
          i32.const 20
          i32.add
          local.get $l3
          i32.store
          local.get $l3
          local.get $l6
          i32.store offset=24
          br $B1
        end
        local.get $l2
        i32.load offset=4
        local.tee $l3
        i32.const 3
        i32.and
        i32.const 3
        i32.ne
        br_if $B1
        local.get $l2
        local.get $l3
        i32.const -2
        i32.and
        i32.store offset=4
        i32.const 0
        local.get $p1
        i32.store offset=1060284
        local.get $l2
        local.get $p1
        i32.store
        local.get $p0
        local.get $p1
        i32.const 1
        i32.or
        i32.store offset=4
        return
      end
      block $B15
        block $B16
          local.get $l2
          i32.load offset=4
          local.tee $l3
          i32.const 2
          i32.and
          br_if $B16
          block $B17
            i32.const 0
            i32.load offset=1060300
            local.get $l2
            i32.ne
            br_if $B17
            i32.const 0
            local.get $p0
            i32.store offset=1060300
            i32.const 0
            i32.const 0
            i32.load offset=1060288
            local.get $p1
            i32.add
            local.tee $p1
            i32.store offset=1060288
            local.get $p0
            local.get $p1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get $p0
            i32.const 0
            i32.load offset=1060296
            i32.ne
            br_if $B0
            i32.const 0
            i32.const 0
            i32.store offset=1060284
            i32.const 0
            i32.const 0
            i32.store offset=1060296
            return
          end
          block $B18
            i32.const 0
            i32.load offset=1060296
            local.get $l2
            i32.ne
            br_if $B18
            i32.const 0
            local.get $p0
            i32.store offset=1060296
            i32.const 0
            i32.const 0
            i32.load offset=1060284
            local.get $p1
            i32.add
            local.tee $p1
            i32.store offset=1060284
            local.get $p0
            local.get $p1
            i32.const 1
            i32.or
            i32.store offset=4
            local.get $p0
            local.get $p1
            i32.add
            local.get $p1
            i32.store
            return
          end
          i32.const 0
          i32.load offset=1060292
          local.set $l4
          local.get $l3
          i32.const -8
          i32.and
          local.get $p1
          i32.add
          local.set $p1
          block $B19
            block $B20
              local.get $l3
              i32.const 255
              i32.gt_u
              br_if $B20
              local.get $l2
              i32.load offset=12
              local.set $l5
              block $B21
                local.get $l2
                i32.load offset=8
                local.tee $l6
                local.get $l3
                i32.const 3
                i32.shr_u
                local.tee $l2
                i32.const 3
                i32.shl
                i32.const 1060316
                i32.add
                local.tee $l3
                i32.eq
                br_if $B21
                local.get $l4
                local.get $l6
                i32.gt_u
                drop
              end
              block $B22
                local.get $l5
                local.get $l6
                i32.ne
                br_if $B22
                i32.const 0
                i32.const 0
                i32.load offset=1060276
                i32.const -2
                local.get $l2
                i32.rotl
                i32.and
                i32.store offset=1060276
                br $B19
              end
              block $B23
                local.get $l5
                local.get $l3
                i32.eq
                br_if $B23
                local.get $l4
                local.get $l5
                i32.gt_u
                drop
              end
              local.get $l5
              local.get $l6
              i32.store offset=8
              local.get $l6
              local.get $l5
              i32.store offset=12
              br $B19
            end
            local.get $l2
            i32.load offset=24
            local.set $l7
            block $B24
              block $B25
                local.get $l2
                i32.load offset=12
                local.tee $l6
                local.get $l2
                i32.eq
                br_if $B25
                block $B26
                  local.get $l4
                  local.get $l2
                  i32.load offset=8
                  local.tee $l3
                  i32.gt_u
                  br_if $B26
                  local.get $l3
                  i32.load offset=12
                  local.get $l2
                  i32.ne
                  drop
                end
                local.get $l6
                local.get $l3
                i32.store offset=8
                local.get $l3
                local.get $l6
                i32.store offset=12
                br $B24
              end
              block $B27
                local.get $l2
                i32.const 20
                i32.add
                local.tee $l3
                i32.load
                local.tee $l5
                br_if $B27
                local.get $l2
                i32.const 16
                i32.add
                local.tee $l3
                i32.load
                local.tee $l5
                br_if $B27
                i32.const 0
                local.set $l6
                br $B24
              end
              loop $L28
                local.get $l3
                local.set $l4
                local.get $l5
                local.tee $l6
                i32.const 20
                i32.add
                local.tee $l3
                i32.load
                local.tee $l5
                br_if $L28
                local.get $l6
                i32.const 16
                i32.add
                local.set $l3
                local.get $l6
                i32.load offset=16
                local.tee $l5
                br_if $L28
              end
              local.get $l4
              i32.const 0
              i32.store
            end
            local.get $l7
            i32.eqz
            br_if $B19
            block $B29
              block $B30
                local.get $l2
                i32.load offset=28
                local.tee $l5
                i32.const 2
                i32.shl
                i32.const 1060580
                i32.add
                local.tee $l3
                i32.load
                local.get $l2
                i32.ne
                br_if $B30
                local.get $l3
                local.get $l6
                i32.store
                local.get $l6
                br_if $B29
                i32.const 0
                i32.const 0
                i32.load offset=1060280
                i32.const -2
                local.get $l5
                i32.rotl
                i32.and
                i32.store offset=1060280
                br $B19
              end
              local.get $l7
              i32.const 16
              i32.const 20
              local.get $l7
              i32.load offset=16
              local.get $l2
              i32.eq
              select
              i32.add
              local.get $l6
              i32.store
              local.get $l6
              i32.eqz
              br_if $B19
            end
            local.get $l6
            local.get $l7
            i32.store offset=24
            block $B31
              local.get $l2
              i32.load offset=16
              local.tee $l3
              i32.eqz
              br_if $B31
              local.get $l6
              local.get $l3
              i32.store offset=16
              local.get $l3
              local.get $l6
              i32.store offset=24
            end
            local.get $l2
            i32.load offset=20
            local.tee $l3
            i32.eqz
            br_if $B19
            local.get $l6
            i32.const 20
            i32.add
            local.get $l3
            i32.store
            local.get $l3
            local.get $l6
            i32.store offset=24
          end
          local.get $p0
          local.get $p1
          i32.add
          local.get $p1
          i32.store
          local.get $p0
          local.get $p1
          i32.const 1
          i32.or
          i32.store offset=4
          local.get $p0
          i32.const 0
          i32.load offset=1060296
          i32.ne
          br_if $B15
          i32.const 0
          local.get $p1
          i32.store offset=1060284
          return
        end
        local.get $l2
        local.get $l3
        i32.const -2
        i32.and
        i32.store offset=4
        local.get $p0
        local.get $p1
        i32.add
        local.get $p1
        i32.store
        local.get $p0
        local.get $p1
        i32.const 1
        i32.or
        i32.store offset=4
      end
      block $B32
        local.get $p1
        i32.const 255
        i32.gt_u
        br_if $B32
        local.get $p1
        i32.const 3
        i32.shr_u
        local.tee $l3
        i32.const 3
        i32.shl
        i32.const 1060316
        i32.add
        local.set $p1
        block $B33
          block $B34
            i32.const 0
            i32.load offset=1060276
            local.tee $l5
            i32.const 1
            local.get $l3
            i32.shl
            local.tee $l3
            i32.and
            br_if $B34
            i32.const 0
            local.get $l5
            local.get $l3
            i32.or
            i32.store offset=1060276
            local.get $p1
            local.set $l3
            br $B33
          end
          local.get $p1
          i32.load offset=8
          local.set $l3
        end
        local.get $l3
        local.get $p0
        i32.store offset=12
        local.get $p1
        local.get $p0
        i32.store offset=8
        local.get $p0
        local.get $p1
        i32.store offset=12
        local.get $p0
        local.get $l3
        i32.store offset=8
        return
      end
      i32.const 0
      local.set $l3
      block $B35
        local.get $p1
        i32.const 8
        i32.shr_u
        local.tee $l5
        i32.eqz
        br_if $B35
        i32.const 31
        local.set $l3
        local.get $p1
        i32.const 16777215
        i32.gt_u
        br_if $B35
        local.get $l5
        local.get $l5
        i32.const 1048320
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 8
        i32.and
        local.tee $l3
        i32.shl
        local.tee $l5
        local.get $l5
        i32.const 520192
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 4
        i32.and
        local.tee $l5
        i32.shl
        local.tee $l6
        local.get $l6
        i32.const 245760
        i32.add
        i32.const 16
        i32.shr_u
        i32.const 2
        i32.and
        local.tee $l6
        i32.shl
        i32.const 15
        i32.shr_u
        local.get $l5
        local.get $l3
        i32.or
        local.get $l6
        i32.or
        i32.sub
        local.tee $l3
        i32.const 1
        i32.shl
        local.get $p1
        local.get $l3
        i32.const 21
        i32.add
        i32.shr_u
        i32.const 1
        i32.and
        i32.or
        i32.const 28
        i32.add
        local.set $l3
      end
      local.get $p0
      i64.const 0
      i64.store offset=16 align=4
      local.get $p0
      i32.const 28
      i32.add
      local.get $l3
      i32.store
      local.get $l3
      i32.const 2
      i32.shl
      i32.const 1060580
      i32.add
      local.set $l5
      block $B36
        i32.const 0
        i32.load offset=1060280
        local.tee $l6
        i32.const 1
        local.get $l3
        i32.shl
        local.tee $l2
        i32.and
        br_if $B36
        local.get $l5
        local.get $p0
        i32.store
        i32.const 0
        local.get $l6
        local.get $l2
        i32.or
        i32.store offset=1060280
        local.get $p0
        i32.const 24
        i32.add
        local.get $l5
        i32.store
        local.get $p0
        local.get $p0
        i32.store offset=8
        local.get $p0
        local.get $p0
        i32.store offset=12
        return
      end
      local.get $p1
      i32.const 0
      i32.const 25
      local.get $l3
      i32.const 1
      i32.shr_u
      i32.sub
      local.get $l3
      i32.const 31
      i32.eq
      select
      i32.shl
      local.set $l3
      local.get $l5
      i32.load
      local.set $l6
      block $B37
        loop $L38
          local.get $l6
          local.tee $l5
          i32.load offset=4
          i32.const -8
          i32.and
          local.get $p1
          i32.eq
          br_if $B37
          local.get $l3
          i32.const 29
          i32.shr_u
          local.set $l6
          local.get $l3
          i32.const 1
          i32.shl
          local.set $l3
          local.get $l5
          local.get $l6
          i32.const 4
          i32.and
          i32.add
          i32.const 16
          i32.add
          local.tee $l2
          i32.load
          local.tee $l6
          br_if $L38
        end
        local.get $l2
        local.get $p0
        i32.store
        local.get $p0
        i32.const 24
        i32.add
        local.get $l5
        i32.store
        local.get $p0
        local.get $p0
        i32.store offset=12
        local.get $p0
        local.get $p0
        i32.store offset=8
        return
      end
      local.get $l5
      i32.load offset=8
      local.set $p1
      local.get $l5
      local.get $p0
      i32.store offset=8
      local.get $p1
      local.get $p0
      i32.store offset=12
      local.get $p0
      i32.const 24
      i32.add
      i32.const 0
      i32.store
      local.get $p0
      local.get $p1
      i32.store offset=8
      local.get $p0
      local.get $l5
      i32.store offset=12
    end)
  (func $internal_memalign (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    block $B0
      block $B1
        local.get $p0
        i32.const 16
        local.get $p0
        i32.const 16
        i32.gt_u
        select
        local.tee $l2
        local.get $l2
        i32.const -1
        i32.add
        i32.and
        br_if $B1
        local.get $l2
        local.set $p0
        br $B0
      end
      i32.const 32
      local.set $l3
      loop $L2
        local.get $l3
        local.tee $p0
        i32.const 1
        i32.shl
        local.set $l3
        local.get $p0
        local.get $l2
        i32.lt_u
        br_if $L2
      end
    end
    block $B3
      i32.const -64
      local.get $p0
      i32.sub
      local.get $p1
      i32.gt_u
      br_if $B3
      i32.const 0
      i32.const 48
      i32.store offset=1060772
      i32.const 0
      return
    end
    block $B4
      i32.const 16
      local.get $p1
      i32.const 19
      i32.add
      i32.const -16
      i32.and
      local.get $p1
      i32.const 11
      i32.lt_u
      select
      local.tee $p1
      i32.const 12
      i32.or
      local.get $p0
      i32.add
      call $dlmalloc
      local.tee $l3
      br_if $B4
      i32.const 0
      return
    end
    local.get $l3
    i32.const -8
    i32.add
    local.set $l2
    block $B5
      block $B6
        local.get $p0
        i32.const -1
        i32.add
        local.get $l3
        i32.and
        br_if $B6
        local.get $l2
        local.set $p0
        br $B5
      end
      local.get $l3
      i32.const -4
      i32.add
      local.tee $l4
      i32.load
      local.tee $l5
      i32.const -8
      i32.and
      local.get $l3
      local.get $p0
      i32.add
      i32.const -1
      i32.add
      i32.const 0
      local.get $p0
      i32.sub
      i32.and
      i32.const -8
      i32.add
      local.tee $l3
      local.get $l3
      local.get $p0
      i32.add
      local.get $l3
      local.get $l2
      i32.sub
      i32.const 15
      i32.gt_u
      select
      local.tee $p0
      local.get $l2
      i32.sub
      local.tee $l3
      i32.sub
      local.set $l6
      block $B7
        local.get $l5
        i32.const 3
        i32.and
        br_if $B7
        local.get $p0
        local.get $l6
        i32.store offset=4
        local.get $p0
        local.get $l2
        i32.load
        local.get $l3
        i32.add
        i32.store
        br $B5
      end
      local.get $p0
      local.get $l6
      local.get $p0
      i32.load offset=4
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store offset=4
      local.get $p0
      local.get $l6
      i32.add
      local.tee $l6
      local.get $l6
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get $l4
      local.get $l3
      local.get $l4
      i32.load
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store
      local.get $p0
      local.get $p0
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get $l2
      local.get $l3
      call $dispose_chunk
    end
    block $B8
      local.get $p0
      i32.load offset=4
      local.tee $l3
      i32.const 3
      i32.and
      i32.eqz
      br_if $B8
      local.get $l3
      i32.const -8
      i32.and
      local.tee $l2
      local.get $p1
      i32.const 16
      i32.add
      i32.le_u
      br_if $B8
      local.get $p0
      local.get $p1
      local.get $l3
      i32.const 1
      i32.and
      i32.or
      i32.const 2
      i32.or
      i32.store offset=4
      local.get $p0
      local.get $p1
      i32.add
      local.tee $l3
      local.get $l2
      local.get $p1
      i32.sub
      local.tee $p1
      i32.const 3
      i32.or
      i32.store offset=4
      local.get $p0
      local.get $l2
      i32.add
      local.tee $l2
      local.get $l2
      i32.load offset=4
      i32.const 1
      i32.or
      i32.store offset=4
      local.get $l3
      local.get $p1
      call $dispose_chunk
    end
    local.get $p0
    i32.const 8
    i32.add)
  (func $aligned_alloc (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    block $B0
      local.get $p0
      i32.const 16
      i32.gt_u
      br_if $B0
      local.get $p1
      call $dlmalloc
      return
    end
    local.get $p0
    local.get $p1
    call $internal_memalign)
  (func $_Exit (type $t1) (param $p0 i32)
    local.get $p0
    call $__wasi_proc_exit
    unreachable)
  (func $__wasilibc_populate_libpreopen (type $t0)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l0
    global.set $g0
    i32.const 3
    local.set $l1
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              loop $L5
                local.get $l1
                local.get $l0
                i32.const 8
                i32.add
                call $__wasi_fd_prestat_get
                local.tee $l2
                i32.const 8
                i32.gt_u
                br_if $B3
                block $B6
                  block $B7
                    local.get $l2
                    br_table $B7 $B3 $B3 $B3 $B3 $B3 $B3 $B3 $B6 $B7
                  end
                  block $B8
                    local.get $l0
                    i32.load8_u offset=8
                    br_if $B8
                    local.get $l0
                    i32.load offset=12
                    local.tee $l2
                    i32.const 1
                    i32.add
                    call $malloc
                    local.tee $l3
                    i32.eqz
                    br_if $B1
                    local.get $l1
                    local.get $l3
                    local.get $l2
                    call $__wasi_fd_prestat_dir_name
                    br_if $B4
                    local.get $l3
                    local.get $l0
                    i32.load offset=12
                    i32.add
                    i32.const 0
                    i32.store8
                    local.get $l1
                    i32.const -1
                    i32.le_s
                    br_if $B0
                    block $B9
                      block $B10
                        i32.const 0
                        i32.load offset=1060784
                        local.tee $l2
                        i32.const 0
                        i32.load offset=1060780
                        i32.eq
                        br_if $B10
                        i32.const 0
                        i32.load offset=1060776
                        local.set $l4
                        br $B9
                      end
                      i32.const 8
                      local.get $l2
                      i32.const 1
                      i32.shl
                      i32.const 4
                      local.get $l2
                      select
                      local.tee $l5
                      call $calloc
                      local.tee $l4
                      i32.eqz
                      br_if $B2
                      local.get $l4
                      i32.const 0
                      i32.load offset=1060776
                      local.tee $l6
                      local.get $l2
                      i32.const 3
                      i32.shl
                      call $memcpy
                      local.set $l2
                      local.get $l6
                      call $free
                      i32.const 0
                      local.get $l5
                      i32.store offset=1060780
                      i32.const 0
                      local.get $l2
                      i32.store offset=1060776
                      i32.const 0
                      i32.load offset=1060784
                      local.set $l2
                    end
                    i32.const 0
                    local.get $l2
                    i32.const 1
                    i32.add
                    i32.store offset=1060784
                    local.get $l4
                    local.get $l2
                    i32.const 3
                    i32.shl
                    i32.add
                    local.tee $l2
                    local.get $l1
                    i32.store offset=4
                    local.get $l2
                    local.get $l3
                    i32.store
                  end
                  local.get $l1
                  i32.const 1
                  i32.add
                  local.tee $l2
                  local.get $l1
                  i32.lt_u
                  local.set $l3
                  local.get $l2
                  local.set $l1
                  local.get $l3
                  i32.eqz
                  br_if $L5
                end
              end
              local.get $l0
              i32.const 16
              i32.add
              global.set $g0
              return
            end
            local.get $l3
            call $free
          end
          i32.const 71
          call $_Exit
          unreachable
        end
        local.get $l3
        call $free
      end
      i32.const 70
      call $_Exit
      unreachable
    end
    call $abort
    unreachable)
  (func $sbrk (type $t7) (param $p0 i32) (result i32)
    block $B0
      local.get $p0
      br_if $B0
      memory.size
      i32.const 16
      i32.shl
      return
    end
    block $B1
      local.get $p0
      i32.const 65535
      i32.and
      br_if $B1
      local.get $p0
      i32.const -1
      i32.le_s
      br_if $B1
      block $B2
        local.get $p0
        i32.const 16
        i32.shr_u
        memory.grow
        local.tee $p0
        i32.const -1
        i32.ne
        br_if $B2
        i32.const 0
        i32.const 48
        i32.store offset=1060772
        i32.const -1
        return
      end
      local.get $p0
      i32.const 16
      i32.shl
      return
    end
    call $abort
    unreachable)
  (func $__wasilibc_populate_environ (type $t0)
    (local $l0 i32) (local $l1 i32) (local $l2 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l0
    global.set $g0
    block $B0
      block $B1
        local.get $l0
        i32.const 12
        i32.add
        local.get $l0
        i32.const 8
        i32.add
        call $__wasi_environ_sizes_get
        br_if $B1
        local.get $l0
        i32.load offset=12
        local.tee $l1
        i32.eqz
        br_if $B0
        block $B2
          block $B3
            local.get $l1
            i32.const 1
            i32.add
            local.tee $l2
            local.get $l1
            i32.lt_u
            br_if $B3
            local.get $l0
            i32.load offset=8
            call $malloc
            local.tee $l0
            i32.eqz
            br_if $B3
            local.get $l2
            i32.const 4
            call $calloc
            local.tee $l1
            br_if $B2
            local.get $l0
            call $free
          end
          i32.const 70
          call $_Exit
          unreachable
        end
        block $B4
          local.get $l1
          local.get $l0
          call $__wasi_environ_get
          i32.eqz
          br_if $B4
          local.get $l0
          call $free
          local.get $l1
          call $free
          br $B1
        end
        i32.const 0
        local.get $l1
        i32.store offset=1060180
      end
      i32.const 71
      call $_Exit
      unreachable
    end
    local.get $l0
    i32.const 16
    i32.add
    global.set $g0)
  (func $dummy (type $t0))
  (func $__prepare_for_exit (type $t0)
    call $dummy
    call $dummy)
  (func $getenv (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    i32.const 0
    local.set $l1
    block $B0
      local.get $p0
      i32.const 61
      call $__strchrnul
      local.tee $l2
      local.get $p0
      i32.sub
      local.tee $l3
      i32.eqz
      br_if $B0
      local.get $l2
      i32.load8_u
      br_if $B0
      i32.const 0
      i32.load offset=1060180
      local.tee $l4
      i32.eqz
      br_if $B0
      local.get $l4
      i32.load
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $l4
      i32.const 4
      i32.add
      local.set $l4
      block $B1
        loop $L2
          block $B3
            local.get $p0
            local.get $l2
            local.get $l3
            call $strncmp
            br_if $B3
            local.get $l2
            local.get $l3
            i32.add
            local.tee $l2
            i32.load8_u
            i32.const 61
            i32.eq
            br_if $B1
          end
          local.get $l4
          i32.load
          local.set $l2
          local.get $l4
          i32.const 4
          i32.add
          local.set $l4
          local.get $l2
          br_if $L2
          br $B0
        end
      end
      local.get $l2
      i32.const 1
      i32.add
      local.set $l1
    end
    local.get $l1)
  (func $__putenv (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    i32.const 0
    local.set $l3
    block $B0
      i32.const 0
      i32.load offset=1060180
      local.tee $l4
      i32.eqz
      br_if $B0
      i32.const 0
      local.set $l3
      local.get $l4
      i32.load
      local.tee $l5
      i32.eqz
      br_if $B0
      local.get $p1
      i32.const 1
      i32.add
      local.set $l6
      i32.const 0
      local.set $l3
      local.get $l4
      local.set $p1
      loop $L1
        block $B2
          local.get $p0
          local.get $l5
          local.get $l6
          call $strncmp
          br_if $B2
          local.get $p1
          local.get $p0
          i32.store
          local.get $l5
          local.get $p2
          call $__env_rm_add
          i32.const 0
          return
        end
        local.get $l3
        i32.const 1
        i32.add
        local.set $l3
        local.get $p1
        i32.load offset=4
        local.set $l5
        local.get $p1
        i32.const 4
        i32.add
        local.set $p1
        local.get $l5
        br_if $L1
      end
    end
    local.get $l3
    i32.const 2
    i32.shl
    local.tee $l6
    i32.const 8
    i32.add
    local.set $l5
    block $B3
      block $B4
        block $B5
          local.get $l4
          i32.const 0
          i32.load offset=1060792
          local.tee $p1
          i32.ne
          br_if $B5
          local.get $l4
          local.get $l5
          call $realloc
          local.tee $l5
          br_if $B4
          br $B3
        end
        local.get $l5
        call $malloc
        local.tee $l5
        i32.eqz
        br_if $B3
        block $B6
          local.get $l3
          i32.eqz
          br_if $B6
          local.get $l5
          local.get $l4
          local.get $l6
          call $memcpy
          drop
        end
        local.get $p1
        call $free
      end
      i32.const 0
      local.set $p1
      i32.const 0
      local.get $l5
      i32.store offset=1060792
      i32.const 0
      local.get $l5
      i32.store offset=1060180
      local.get $l5
      local.get $l3
      i32.const 2
      i32.shl
      i32.add
      local.tee $l5
      local.get $p0
      i32.store
      local.get $l5
      i32.const 4
      i32.add
      i32.const 0
      i32.store
      block $B7
        local.get $p2
        i32.eqz
        br_if $B7
        i32.const 0
        local.set $p1
        i32.const 0
        local.get $p2
        call $__env_rm_add
      end
      local.get $p1
      return
    end
    local.get $p2
    call $free
    i32.const -1)
  (func $__env_rm_add (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32)
    i32.const 0
    local.set $l2
    block $B0
      i32.const 0
      i32.load offset=1060800
      local.tee $l3
      i32.eqz
      br_if $B0
      i32.const 0
      i32.load offset=1060796
      local.set $l4
      loop $L1
        block $B2
          local.get $l4
          i32.load
          local.tee $l5
          local.get $p0
          i32.ne
          br_if $B2
          local.get $l4
          local.get $p1
          i32.store
          local.get $p0
          call $free
          return
        end
        block $B3
          local.get $p1
          i32.eqz
          br_if $B3
          local.get $l5
          br_if $B3
          local.get $l4
          local.get $p1
          i32.store
          i32.const 0
          local.set $p1
        end
        local.get $l4
        i32.const 4
        i32.add
        local.set $l4
        local.get $l2
        i32.const 1
        i32.add
        local.tee $l2
        local.get $l3
        i32.lt_u
        br_if $L1
      end
    end
    block $B4
      local.get $p1
      i32.eqz
      br_if $B4
      i32.const 0
      i32.load offset=1060796
      local.get $l3
      i32.const 2
      i32.shl
      i32.const 4
      i32.add
      call $realloc
      local.tee $l4
      i32.eqz
      br_if $B4
      i32.const 0
      local.get $l4
      i32.store offset=1060796
      i32.const 0
      i32.const 0
      i32.load offset=1060800
      local.tee $l2
      i32.const 1
      i32.add
      i32.store offset=1060800
      local.get $l4
      local.get $l2
      i32.const 2
      i32.shl
      i32.add
      local.get $p1
      i32.store
    end)
  (func $setenv (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32)
    block $B0
      block $B1
        local.get $p0
        i32.eqz
        br_if $B1
        local.get $p0
        i32.const 61
        call $__strchrnul
        local.tee $l3
        local.get $p0
        i32.sub
        local.tee $l4
        i32.eqz
        br_if $B1
        local.get $l3
        i32.load8_u
        i32.eqz
        br_if $B0
      end
      i32.const 0
      i32.const 28
      i32.store offset=1060772
      i32.const -1
      return
    end
    block $B2
      block $B3
        local.get $p2
        br_if $B3
        i32.const 0
        local.set $p2
        local.get $p0
        call $getenv
        br_if $B2
      end
      block $B4
        local.get $l4
        local.get $p1
        call $strlen
        local.tee $p2
        i32.add
        i32.const 2
        i32.add
        call $malloc
        local.tee $l3
        br_if $B4
        i32.const -1
        return
      end
      local.get $l3
      local.get $p0
      local.get $l4
      call $memcpy
      local.tee $p0
      local.get $l4
      i32.add
      local.tee $l3
      i32.const 61
      i32.store8
      local.get $l3
      i32.const 1
      i32.add
      local.get $p1
      local.get $p2
      i32.const 1
      i32.add
      call $memcpy
      drop
      local.get $p0
      local.get $l4
      local.get $p0
      call $__putenv
      local.set $p2
    end
    local.get $p2)
  (func $memmove (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    block $B0
      local.get $p0
      local.get $p1
      i32.eq
      br_if $B0
      block $B1
        local.get $p1
        local.get $p0
        i32.sub
        local.get $p2
        i32.sub
        i32.const 0
        local.get $p2
        i32.const 1
        i32.shl
        i32.sub
        i32.gt_u
        br_if $B1
        local.get $p0
        local.get $p1
        local.get $p2
        call $memcpy
        drop
        br $B0
      end
      local.get $p1
      local.get $p0
      i32.xor
      i32.const 3
      i32.and
      local.set $l3
      block $B2
        block $B3
          block $B4
            local.get $p0
            local.get $p1
            i32.ge_u
            br_if $B4
            block $B5
              local.get $l3
              i32.eqz
              br_if $B5
              local.get $p0
              local.set $l3
              br $B2
            end
            block $B6
              local.get $p0
              i32.const 3
              i32.and
              br_if $B6
              local.get $p0
              local.set $l3
              br $B3
            end
            local.get $p0
            local.set $l3
            loop $L7
              local.get $p2
              i32.eqz
              br_if $B0
              local.get $l3
              local.get $p1
              i32.load8_u
              i32.store8
              local.get $p1
              i32.const 1
              i32.add
              local.set $p1
              local.get $p2
              i32.const -1
              i32.add
              local.set $p2
              local.get $l3
              i32.const 1
              i32.add
              local.tee $l3
              i32.const 3
              i32.and
              i32.eqz
              br_if $B3
              br $L7
            end
          end
          block $B8
            block $B9
              local.get $l3
              i32.eqz
              br_if $B9
              local.get $p2
              local.set $l3
              br $B8
            end
            block $B10
              block $B11
                local.get $p0
                local.get $p2
                i32.add
                i32.const 3
                i32.and
                br_if $B11
                local.get $p2
                local.set $l3
                br $B10
              end
              local.get $p1
              i32.const -1
              i32.add
              local.set $l4
              local.get $p0
              i32.const -1
              i32.add
              local.set $l5
              loop $L12
                local.get $p2
                i32.eqz
                br_if $B0
                local.get $l5
                local.get $p2
                i32.add
                local.tee $l6
                local.get $l4
                local.get $p2
                i32.add
                i32.load8_u
                i32.store8
                local.get $p2
                i32.const -1
                i32.add
                local.tee $l3
                local.set $p2
                local.get $l6
                i32.const 3
                i32.and
                br_if $L12
              end
            end
            local.get $l3
            i32.const 4
            i32.lt_u
            br_if $B8
            local.get $p0
            i32.const -4
            i32.add
            local.set $p2
            local.get $p1
            i32.const -4
            i32.add
            local.set $l6
            loop $L13
              local.get $p2
              local.get $l3
              i32.add
              local.get $l6
              local.get $l3
              i32.add
              i32.load
              i32.store
              local.get $l3
              i32.const -4
              i32.add
              local.tee $l3
              i32.const 3
              i32.gt_u
              br_if $L13
            end
          end
          local.get $l3
          i32.eqz
          br_if $B0
          local.get $p1
          i32.const -1
          i32.add
          local.set $p1
          local.get $p0
          i32.const -1
          i32.add
          local.set $p2
          loop $L14
            local.get $p2
            local.get $l3
            i32.add
            local.get $p1
            local.get $l3
            i32.add
            i32.load8_u
            i32.store8
            local.get $l3
            i32.const -1
            i32.add
            local.tee $l3
            br_if $L14
            br $B0
          end
        end
        local.get $p2
        i32.const 4
        i32.lt_u
        br_if $B2
        local.get $p2
        local.set $l6
        loop $L15
          local.get $l3
          local.get $p1
          i32.load
          i32.store
          local.get $p1
          i32.const 4
          i32.add
          local.set $p1
          local.get $l3
          i32.const 4
          i32.add
          local.set $l3
          local.get $l6
          i32.const -4
          i32.add
          local.tee $l6
          i32.const 3
          i32.gt_u
          br_if $L15
        end
        local.get $p2
        i32.const 3
        i32.and
        local.set $p2
      end
      local.get $p2
      i32.eqz
      br_if $B0
      loop $L16
        local.get $l3
        local.get $p1
        i32.load8_u
        i32.store8
        local.get $l3
        i32.const 1
        i32.add
        local.set $l3
        local.get $p1
        i32.const 1
        i32.add
        local.set $p1
        local.get $p2
        i32.const -1
        i32.add
        local.tee $p2
        br_if $L16
      end
    end
    local.get $p0)
  (func $strlen (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    local.get $p0
    local.set $l1
    block $B0
      block $B1
        block $B2
          local.get $p0
          i32.const 3
          i32.and
          i32.eqz
          br_if $B2
          block $B3
            local.get $p0
            i32.load8_u
            br_if $B3
            local.get $p0
            local.get $p0
            i32.sub
            return
          end
          local.get $p0
          i32.const 1
          i32.add
          local.set $l1
          loop $L4
            local.get $l1
            i32.const 3
            i32.and
            i32.eqz
            br_if $B2
            local.get $l1
            i32.load8_u
            local.set $l2
            local.get $l1
            i32.const 1
            i32.add
            local.tee $l3
            local.set $l1
            local.get $l2
            i32.eqz
            br_if $B1
            br $L4
          end
        end
        local.get $l1
        i32.const -4
        i32.add
        local.set $l1
        loop $L5
          local.get $l1
          i32.const 4
          i32.add
          local.tee $l1
          i32.load
          local.tee $l2
          i32.const -1
          i32.xor
          local.get $l2
          i32.const -16843009
          i32.add
          i32.and
          i32.const -2139062144
          i32.and
          i32.eqz
          br_if $L5
        end
        block $B6
          local.get $l2
          i32.const 255
          i32.and
          br_if $B6
          local.get $l1
          local.get $p0
          i32.sub
          return
        end
        loop $L7
          local.get $l1
          i32.load8_u offset=1
          local.set $l2
          local.get $l1
          i32.const 1
          i32.add
          local.tee $l3
          local.set $l1
          local.get $l2
          br_if $L7
          br $B0
        end
      end
      local.get $l3
      i32.const -1
      i32.add
      local.set $l3
    end
    local.get $l3
    local.get $p0
    i32.sub)
  (func $__strchrnul (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    block $B0
      local.get $p1
      i32.const 255
      i32.and
      local.tee $l2
      i32.eqz
      br_if $B0
      block $B1
        block $B2
          local.get $p0
          i32.const 3
          i32.and
          i32.eqz
          br_if $B2
          loop $L3
            local.get $p0
            i32.load8_u
            local.tee $l3
            i32.eqz
            br_if $B1
            local.get $l3
            local.get $p1
            i32.const 255
            i32.and
            i32.eq
            br_if $B1
            local.get $p0
            i32.const 1
            i32.add
            local.tee $p0
            i32.const 3
            i32.and
            br_if $L3
          end
        end
        block $B4
          local.get $p0
          i32.load
          local.tee $l3
          i32.const -1
          i32.xor
          local.get $l3
          i32.const -16843009
          i32.add
          i32.and
          i32.const -2139062144
          i32.and
          br_if $B4
          local.get $l2
          i32.const 16843009
          i32.mul
          local.set $l2
          loop $L5
            local.get $l3
            local.get $l2
            i32.xor
            local.tee $l3
            i32.const -1
            i32.xor
            local.get $l3
            i32.const -16843009
            i32.add
            i32.and
            i32.const -2139062144
            i32.and
            br_if $B4
            local.get $p0
            i32.load offset=4
            local.set $l3
            local.get $p0
            i32.const 4
            i32.add
            local.set $p0
            local.get $l3
            i32.const -1
            i32.xor
            local.get $l3
            i32.const -16843009
            i32.add
            i32.and
            i32.const -2139062144
            i32.and
            i32.eqz
            br_if $L5
          end
        end
        local.get $p0
        i32.const -1
        i32.add
        local.set $p0
        loop $L6
          local.get $p0
          i32.const 1
          i32.add
          local.tee $p0
          i32.load8_u
          local.tee $l3
          i32.eqz
          br_if $B1
          local.get $l3
          local.get $p1
          i32.const 255
          i32.and
          i32.ne
          br_if $L6
        end
      end
      local.get $p0
      return
    end
    local.get $p0
    local.get $p0
    call $strlen
    i32.add)
  (func $memcpy (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    block $B0
      block $B1
        local.get $p2
        i32.eqz
        br_if $B1
        local.get $p1
        i32.const 3
        i32.and
        i32.eqz
        br_if $B1
        local.get $p0
        local.set $l3
        loop $L2
          local.get $l3
          local.get $p1
          i32.load8_u
          i32.store8
          local.get $p2
          i32.const -1
          i32.add
          local.set $l4
          local.get $l3
          i32.const 1
          i32.add
          local.set $l3
          local.get $p1
          i32.const 1
          i32.add
          local.set $p1
          local.get $p2
          i32.const 1
          i32.eq
          br_if $B0
          local.get $l4
          local.set $p2
          local.get $p1
          i32.const 3
          i32.and
          br_if $L2
          br $B0
        end
      end
      local.get $p2
      local.set $l4
      local.get $p0
      local.set $l3
    end
    block $B3
      block $B4
        local.get $l3
        i32.const 3
        i32.and
        local.tee $p2
        br_if $B4
        block $B5
          block $B6
            local.get $l4
            i32.const 16
            i32.ge_u
            br_if $B6
            local.get $l4
            local.set $p2
            br $B5
          end
          local.get $l4
          i32.const -16
          i32.add
          local.set $p2
          loop $L7
            local.get $l3
            local.get $p1
            i32.load
            i32.store
            local.get $l3
            i32.const 4
            i32.add
            local.get $p1
            i32.const 4
            i32.add
            i32.load
            i32.store
            local.get $l3
            i32.const 8
            i32.add
            local.get $p1
            i32.const 8
            i32.add
            i32.load
            i32.store
            local.get $l3
            i32.const 12
            i32.add
            local.get $p1
            i32.const 12
            i32.add
            i32.load
            i32.store
            local.get $l3
            i32.const 16
            i32.add
            local.set $l3
            local.get $p1
            i32.const 16
            i32.add
            local.set $p1
            local.get $l4
            i32.const -16
            i32.add
            local.tee $l4
            i32.const 15
            i32.gt_u
            br_if $L7
          end
        end
        block $B8
          local.get $p2
          i32.const 8
          i32.and
          i32.eqz
          br_if $B8
          local.get $l3
          local.get $p1
          i64.load align=4
          i64.store align=4
          local.get $p1
          i32.const 8
          i32.add
          local.set $p1
          local.get $l3
          i32.const 8
          i32.add
          local.set $l3
        end
        block $B9
          local.get $p2
          i32.const 4
          i32.and
          i32.eqz
          br_if $B9
          local.get $l3
          local.get $p1
          i32.load
          i32.store
          local.get $p1
          i32.const 4
          i32.add
          local.set $p1
          local.get $l3
          i32.const 4
          i32.add
          local.set $l3
        end
        block $B10
          local.get $p2
          i32.const 2
          i32.and
          i32.eqz
          br_if $B10
          local.get $l3
          local.get $p1
          i32.load8_u
          i32.store8
          local.get $l3
          local.get $p1
          i32.load8_u offset=1
          i32.store8 offset=1
          local.get $l3
          i32.const 2
          i32.add
          local.set $l3
          local.get $p1
          i32.const 2
          i32.add
          local.set $p1
        end
        local.get $p2
        i32.const 1
        i32.and
        i32.eqz
        br_if $B3
        local.get $l3
        local.get $p1
        i32.load8_u
        i32.store8
        local.get $p0
        return
      end
      block $B11
        local.get $l4
        i32.const 32
        i32.lt_u
        br_if $B11
        local.get $p2
        i32.const -1
        i32.add
        local.tee $p2
        i32.const 2
        i32.gt_u
        br_if $B11
        block $B12
          block $B13
            block $B14
              local.get $p2
              br_table $B14 $B13 $B12 $B14
            end
            local.get $l3
            local.get $p1
            i32.load8_u offset=1
            i32.store8 offset=1
            local.get $l3
            local.get $p1
            i32.load
            local.tee $l5
            i32.store8
            local.get $l3
            local.get $p1
            i32.load8_u offset=2
            i32.store8 offset=2
            local.get $l4
            i32.const -3
            i32.add
            local.set $l6
            local.get $l3
            i32.const 3
            i32.add
            local.set $l7
            local.get $l4
            i32.const -20
            i32.add
            i32.const -16
            i32.and
            local.set $l8
            i32.const 0
            local.set $p2
            loop $L15
              local.get $l7
              local.get $p2
              i32.add
              local.tee $l3
              local.get $p1
              local.get $p2
              i32.add
              local.tee $l9
              i32.const 4
              i32.add
              i32.load
              local.tee $l10
              i32.const 8
              i32.shl
              local.get $l5
              i32.const 24
              i32.shr_u
              i32.or
              i32.store
              local.get $l3
              i32.const 4
              i32.add
              local.get $l9
              i32.const 8
              i32.add
              i32.load
              local.tee $l5
              i32.const 8
              i32.shl
              local.get $l10
              i32.const 24
              i32.shr_u
              i32.or
              i32.store
              local.get $l3
              i32.const 8
              i32.add
              local.get $l9
              i32.const 12
              i32.add
              i32.load
              local.tee $l10
              i32.const 8
              i32.shl
              local.get $l5
              i32.const 24
              i32.shr_u
              i32.or
              i32.store
              local.get $l3
              i32.const 12
              i32.add
              local.get $l9
              i32.const 16
              i32.add
              i32.load
              local.tee $l5
              i32.const 8
              i32.shl
              local.get $l10
              i32.const 24
              i32.shr_u
              i32.or
              i32.store
              local.get $p2
              i32.const 16
              i32.add
              local.set $p2
              local.get $l6
              i32.const -16
              i32.add
              local.tee $l6
              i32.const 16
              i32.gt_u
              br_if $L15
            end
            local.get $l7
            local.get $p2
            i32.add
            local.set $l3
            local.get $p1
            local.get $p2
            i32.add
            i32.const 3
            i32.add
            local.set $p1
            local.get $l4
            local.get $l8
            i32.sub
            i32.const -19
            i32.add
            local.set $l4
            br $B11
          end
          local.get $l3
          local.get $p1
          i32.load
          local.tee $l5
          i32.store8
          local.get $l3
          local.get $p1
          i32.load8_u offset=1
          i32.store8 offset=1
          local.get $l4
          i32.const -2
          i32.add
          local.set $l6
          local.get $l3
          i32.const 2
          i32.add
          local.set $l7
          local.get $l4
          i32.const -20
          i32.add
          i32.const -16
          i32.and
          local.set $l8
          i32.const 0
          local.set $p2
          loop $L16
            local.get $l7
            local.get $p2
            i32.add
            local.tee $l3
            local.get $p1
            local.get $p2
            i32.add
            local.tee $l9
            i32.const 4
            i32.add
            i32.load
            local.tee $l10
            i32.const 16
            i32.shl
            local.get $l5
            i32.const 16
            i32.shr_u
            i32.or
            i32.store
            local.get $l3
            i32.const 4
            i32.add
            local.get $l9
            i32.const 8
            i32.add
            i32.load
            local.tee $l5
            i32.const 16
            i32.shl
            local.get $l10
            i32.const 16
            i32.shr_u
            i32.or
            i32.store
            local.get $l3
            i32.const 8
            i32.add
            local.get $l9
            i32.const 12
            i32.add
            i32.load
            local.tee $l10
            i32.const 16
            i32.shl
            local.get $l5
            i32.const 16
            i32.shr_u
            i32.or
            i32.store
            local.get $l3
            i32.const 12
            i32.add
            local.get $l9
            i32.const 16
            i32.add
            i32.load
            local.tee $l5
            i32.const 16
            i32.shl
            local.get $l10
            i32.const 16
            i32.shr_u
            i32.or
            i32.store
            local.get $p2
            i32.const 16
            i32.add
            local.set $p2
            local.get $l6
            i32.const -16
            i32.add
            local.tee $l6
            i32.const 17
            i32.gt_u
            br_if $L16
          end
          local.get $l7
          local.get $p2
          i32.add
          local.set $l3
          local.get $p1
          local.get $p2
          i32.add
          i32.const 2
          i32.add
          local.set $p1
          local.get $l4
          local.get $l8
          i32.sub
          i32.const -18
          i32.add
          local.set $l4
          br $B11
        end
        local.get $l3
        local.get $p1
        i32.load
        local.tee $l5
        i32.store8
        local.get $l4
        i32.const -1
        i32.add
        local.set $l6
        local.get $l3
        i32.const 1
        i32.add
        local.set $l7
        local.get $l4
        i32.const -20
        i32.add
        i32.const -16
        i32.and
        local.set $l8
        i32.const 0
        local.set $p2
        loop $L17
          local.get $l7
          local.get $p2
          i32.add
          local.tee $l3
          local.get $p1
          local.get $p2
          i32.add
          local.tee $l9
          i32.const 4
          i32.add
          i32.load
          local.tee $l10
          i32.const 24
          i32.shl
          local.get $l5
          i32.const 8
          i32.shr_u
          i32.or
          i32.store
          local.get $l3
          i32.const 4
          i32.add
          local.get $l9
          i32.const 8
          i32.add
          i32.load
          local.tee $l5
          i32.const 24
          i32.shl
          local.get $l10
          i32.const 8
          i32.shr_u
          i32.or
          i32.store
          local.get $l3
          i32.const 8
          i32.add
          local.get $l9
          i32.const 12
          i32.add
          i32.load
          local.tee $l10
          i32.const 24
          i32.shl
          local.get $l5
          i32.const 8
          i32.shr_u
          i32.or
          i32.store
          local.get $l3
          i32.const 12
          i32.add
          local.get $l9
          i32.const 16
          i32.add
          i32.load
          local.tee $l5
          i32.const 24
          i32.shl
          local.get $l10
          i32.const 8
          i32.shr_u
          i32.or
          i32.store
          local.get $p2
          i32.const 16
          i32.add
          local.set $p2
          local.get $l6
          i32.const -16
          i32.add
          local.tee $l6
          i32.const 18
          i32.gt_u
          br_if $L17
        end
        local.get $l7
        local.get $p2
        i32.add
        local.set $l3
        local.get $p1
        local.get $p2
        i32.add
        i32.const 1
        i32.add
        local.set $p1
        local.get $l4
        local.get $l8
        i32.sub
        i32.const -17
        i32.add
        local.set $l4
      end
      block $B18
        local.get $l4
        i32.const 16
        i32.and
        i32.eqz
        br_if $B18
        local.get $l3
        local.get $p1
        i32.load16_u align=1
        i32.store16 align=1
        local.get $l3
        local.get $p1
        i32.load8_u offset=2
        i32.store8 offset=2
        local.get $l3
        local.get $p1
        i32.load8_u offset=3
        i32.store8 offset=3
        local.get $l3
        local.get $p1
        i32.load8_u offset=4
        i32.store8 offset=4
        local.get $l3
        local.get $p1
        i32.load8_u offset=5
        i32.store8 offset=5
        local.get $l3
        local.get $p1
        i32.load8_u offset=6
        i32.store8 offset=6
        local.get $l3
        local.get $p1
        i32.load8_u offset=7
        i32.store8 offset=7
        local.get $l3
        local.get $p1
        i32.load8_u offset=8
        i32.store8 offset=8
        local.get $l3
        local.get $p1
        i32.load8_u offset=9
        i32.store8 offset=9
        local.get $l3
        local.get $p1
        i32.load8_u offset=10
        i32.store8 offset=10
        local.get $l3
        local.get $p1
        i32.load8_u offset=11
        i32.store8 offset=11
        local.get $l3
        local.get $p1
        i32.load8_u offset=12
        i32.store8 offset=12
        local.get $l3
        local.get $p1
        i32.load8_u offset=13
        i32.store8 offset=13
        local.get $l3
        local.get $p1
        i32.load8_u offset=14
        i32.store8 offset=14
        local.get $l3
        local.get $p1
        i32.load8_u offset=15
        i32.store8 offset=15
        local.get $l3
        i32.const 16
        i32.add
        local.set $l3
        local.get $p1
        i32.const 16
        i32.add
        local.set $p1
      end
      block $B19
        local.get $l4
        i32.const 8
        i32.and
        i32.eqz
        br_if $B19
        local.get $l3
        local.get $p1
        i32.load8_u
        i32.store8
        local.get $l3
        local.get $p1
        i32.load8_u offset=1
        i32.store8 offset=1
        local.get $l3
        local.get $p1
        i32.load8_u offset=2
        i32.store8 offset=2
        local.get $l3
        local.get $p1
        i32.load8_u offset=3
        i32.store8 offset=3
        local.get $l3
        local.get $p1
        i32.load8_u offset=4
        i32.store8 offset=4
        local.get $l3
        local.get $p1
        i32.load8_u offset=5
        i32.store8 offset=5
        local.get $l3
        local.get $p1
        i32.load8_u offset=6
        i32.store8 offset=6
        local.get $l3
        local.get $p1
        i32.load8_u offset=7
        i32.store8 offset=7
        local.get $l3
        i32.const 8
        i32.add
        local.set $l3
        local.get $p1
        i32.const 8
        i32.add
        local.set $p1
      end
      block $B20
        local.get $l4
        i32.const 4
        i32.and
        i32.eqz
        br_if $B20
        local.get $l3
        local.get $p1
        i32.load8_u
        i32.store8
        local.get $l3
        local.get $p1
        i32.load8_u offset=1
        i32.store8 offset=1
        local.get $l3
        local.get $p1
        i32.load8_u offset=2
        i32.store8 offset=2
        local.get $l3
        local.get $p1
        i32.load8_u offset=3
        i32.store8 offset=3
        local.get $l3
        i32.const 4
        i32.add
        local.set $l3
        local.get $p1
        i32.const 4
        i32.add
        local.set $p1
      end
      block $B21
        local.get $l4
        i32.const 2
        i32.and
        i32.eqz
        br_if $B21
        local.get $l3
        local.get $p1
        i32.load8_u
        i32.store8
        local.get $l3
        local.get $p1
        i32.load8_u offset=1
        i32.store8 offset=1
        local.get $l3
        i32.const 2
        i32.add
        local.set $l3
        local.get $p1
        i32.const 2
        i32.add
        local.set $p1
      end
      local.get $l4
      i32.const 1
      i32.and
      i32.eqz
      br_if $B3
      local.get $l3
      local.get $p1
      i32.load8_u
      i32.store8
    end
    local.get $p0)
  (func $strncmp (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32)
    block $B0
      local.get $p2
      br_if $B0
      i32.const 0
      return
    end
    i32.const 0
    local.set $l3
    block $B1
      local.get $p0
      i32.load8_u
      local.tee $l4
      i32.eqz
      br_if $B1
      local.get $p0
      i32.const 1
      i32.add
      local.set $p0
      local.get $p2
      i32.const -1
      i32.add
      local.set $p2
      loop $L2
        block $B3
          local.get $l4
          i32.const 255
          i32.and
          local.get $p1
          i32.load8_u
          local.tee $l5
          i32.eq
          br_if $B3
          local.get $l4
          local.set $l3
          br $B1
        end
        block $B4
          local.get $p2
          br_if $B4
          local.get $l4
          local.set $l3
          br $B1
        end
        block $B5
          local.get $l5
          br_if $B5
          local.get $l4
          local.set $l3
          br $B1
        end
        local.get $p2
        i32.const -1
        i32.add
        local.set $p2
        local.get $p1
        i32.const 1
        i32.add
        local.set $p1
        local.get $p0
        i32.load8_u
        local.set $l4
        local.get $p0
        i32.const 1
        i32.add
        local.set $p0
        local.get $l4
        br_if $L2
      end
    end
    local.get $l3
    i32.const 255
    i32.and
    local.get $p1
    i32.load8_u
    i32.sub)
  (func $strerror (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    i32.const 0
    local.set $l1
    block $B0
      i32.const 0
      i32.load offset=1060828
      local.tee $l2
      br_if $B0
      i32.const 1060804
      local.set $l2
      i32.const 0
      i32.const 1060804
      i32.store offset=1060828
    end
    block $B1
      block $B2
        block $B3
          loop $L4
            local.get $l1
            i32.const 1052320
            i32.add
            i32.load8_u
            local.get $p0
            i32.eq
            br_if $B3
            i32.const 77
            local.set $l3
            local.get $l1
            i32.const 1
            i32.add
            local.tee $l1
            i32.const 77
            i32.ne
            br_if $L4
            br $B2
          end
        end
        local.get $l1
        local.set $l3
        local.get $l1
        br_if $B2
        i32.const 1052400
        local.set $l4
        br $B1
      end
      i32.const 1052400
      local.set $l1
      loop $L5
        local.get $l1
        i32.load8_u
        local.set $p0
        local.get $l1
        i32.const 1
        i32.add
        local.tee $l4
        local.set $l1
        local.get $p0
        br_if $L5
        local.get $l4
        local.set $l1
        local.get $l3
        i32.const -1
        i32.add
        local.tee $l3
        br_if $L5
      end
    end
    local.get $l4
    local.get $l2
    i32.load offset=20
    call $__lctrans)
  (func $strerror_r (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32)
    block $B0
      block $B1
        local.get $p0
        call $strerror
        local.tee $p0
        call $strlen
        local.tee $l3
        local.get $p2
        i32.lt_u
        br_if $B1
        i32.const 68
        local.set $l3
        local.get $p2
        i32.eqz
        br_if $B0
        local.get $p1
        local.get $p0
        local.get $p2
        i32.const -1
        i32.add
        local.tee $p2
        call $memcpy
        local.get $p2
        i32.add
        i32.const 0
        i32.store8
        i32.const 68
        return
      end
      local.get $p1
      local.get $p0
      local.get $l3
      i32.const 1
      i32.add
      call $memcpy
      drop
      i32.const 0
      local.set $l3
    end
    local.get $l3)
  (func $memset (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64)
    block $B0
      local.get $p2
      i32.eqz
      br_if $B0
      local.get $p0
      local.get $p1
      i32.store8
      local.get $p2
      local.get $p0
      i32.add
      local.tee $l3
      i32.const -1
      i32.add
      local.get $p1
      i32.store8
      local.get $p2
      i32.const 3
      i32.lt_u
      br_if $B0
      local.get $p0
      local.get $p1
      i32.store8 offset=2
      local.get $p0
      local.get $p1
      i32.store8 offset=1
      local.get $l3
      i32.const -3
      i32.add
      local.get $p1
      i32.store8
      local.get $l3
      i32.const -2
      i32.add
      local.get $p1
      i32.store8
      local.get $p2
      i32.const 7
      i32.lt_u
      br_if $B0
      local.get $p0
      local.get $p1
      i32.store8 offset=3
      local.get $l3
      i32.const -4
      i32.add
      local.get $p1
      i32.store8
      local.get $p2
      i32.const 9
      i32.lt_u
      br_if $B0
      local.get $p0
      i32.const 0
      local.get $p0
      i32.sub
      i32.const 3
      i32.and
      local.tee $l4
      i32.add
      local.tee $l3
      local.get $p1
      i32.const 255
      i32.and
      i32.const 16843009
      i32.mul
      local.tee $p1
      i32.store
      local.get $l3
      local.get $p2
      local.get $l4
      i32.sub
      i32.const -4
      i32.and
      local.tee $l4
      i32.add
      local.tee $p2
      i32.const -4
      i32.add
      local.get $p1
      i32.store
      local.get $l4
      i32.const 9
      i32.lt_u
      br_if $B0
      local.get $l3
      local.get $p1
      i32.store offset=8
      local.get $l3
      local.get $p1
      i32.store offset=4
      local.get $p2
      i32.const -8
      i32.add
      local.get $p1
      i32.store
      local.get $p2
      i32.const -12
      i32.add
      local.get $p1
      i32.store
      local.get $l4
      i32.const 25
      i32.lt_u
      br_if $B0
      local.get $l3
      local.get $p1
      i32.store offset=24
      local.get $l3
      local.get $p1
      i32.store offset=20
      local.get $l3
      local.get $p1
      i32.store offset=16
      local.get $l3
      local.get $p1
      i32.store offset=12
      local.get $p2
      i32.const -16
      i32.add
      local.get $p1
      i32.store
      local.get $p2
      i32.const -20
      i32.add
      local.get $p1
      i32.store
      local.get $p2
      i32.const -24
      i32.add
      local.get $p1
      i32.store
      local.get $p2
      i32.const -28
      i32.add
      local.get $p1
      i32.store
      local.get $l4
      local.get $l3
      i32.const 4
      i32.and
      i32.const 24
      i32.or
      local.tee $l5
      i32.sub
      local.tee $p2
      i32.const 32
      i32.lt_u
      br_if $B0
      local.get $p1
      i64.extend_i32_u
      local.tee $l6
      i64.const 32
      i64.shl
      local.get $l6
      i64.or
      local.set $l6
      local.get $l3
      local.get $l5
      i32.add
      local.set $p1
      loop $L1
        local.get $p1
        local.get $l6
        i64.store
        local.get $p1
        i32.const 24
        i32.add
        local.get $l6
        i64.store
        local.get $p1
        i32.const 16
        i32.add
        local.get $l6
        i64.store
        local.get $p1
        i32.const 8
        i32.add
        local.get $l6
        i64.store
        local.get $p1
        i32.const 32
        i32.add
        local.set $p1
        local.get $p2
        i32.const -32
        i32.add
        local.tee $p2
        i32.const 31
        i32.gt_u
        br_if $L1
      end
    end
    local.get $p0)
  (func $memcmp (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32)
    i32.const 0
    local.set $l3
    block $B0
      local.get $p2
      i32.eqz
      br_if $B0
      block $B1
        loop $L2
          local.get $p0
          i32.load8_u
          local.tee $l4
          local.get $p1
          i32.load8_u
          local.tee $l5
          i32.ne
          br_if $B1
          local.get $p1
          i32.const 1
          i32.add
          local.set $p1
          local.get $p0
          i32.const 1
          i32.add
          local.set $p0
          local.get $p2
          i32.const -1
          i32.add
          local.tee $p2
          br_if $L2
          br $B0
        end
      end
      local.get $l4
      local.get $l5
      i32.sub
      local.set $l3
    end
    local.get $l3)
  (func $dummy.1 (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0)
  (func $__lctrans (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    local.get $p1
    call $dummy.1)
  (func $_ZN5alloc5alloc18handle_alloc_error17hb5a4b989d46c2103E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    call $rust_oom
    unreachable)
  (func $_ZN5alloc7raw_vec17capacity_overflow17h56944cb73ca30eacE (type $t0)
    i32.const 1053997
    i32.const 17
    i32.const 1054016
    call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
    unreachable)
  (func $_ZN5alloc6string13FromUtf8Error10into_bytes17h556fd87931e20132E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    i64.load align=4
    i64.store align=4
    local.get $p0
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i32.load
    i32.store)
  (func $_ZN5alloc6string104_$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..vec..Vec$LT$u8$GT$$GT$4from17heb92b80afb85af14E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    i64.load align=4
    i64.store align=4
    local.get $p0
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i32.load
    i32.store)
  (func $_ZN4core3ptr18real_drop_in_place17h81918940aab47716E (type $t1) (param $p0 i32))
  (func $_ZN4core3ptr18real_drop_in_place17hb11d5440accc08b2E (type $t1) (param $p0 i32))
  (func $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    local.get $p2
    i32.store offset=4
    local.get $l3
    local.get $p1
    i32.store
    local.get $l3
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get $l3
    i32.const 44
    i32.add
    i32.const 17
    i32.store
    local.get $l3
    i64.const 2
    i64.store offset=12 align=4
    local.get $l3
    i32.const 1054168
    i32.store offset=8
    local.get $l3
    i32.const 17
    i32.store offset=36
    local.get $l3
    local.get $l3
    i32.const 32
    i32.add
    i32.store offset=24
    local.get $l3
    local.get $l3
    i32.store offset=40
    local.get $l3
    local.get $l3
    i32.const 4
    i32.add
    i32.store offset=32
    local.get $l3
    i32.const 8
    i32.add
    local.get $p0
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i64.const 4
    i64.store offset=16
    local.get $l3
    i64.const 1
    i64.store offset=4 align=4
    local.get $l3
    local.get $p1
    i32.store offset=28
    local.get $l3
    local.get $p0
    i32.store offset=24
    local.get $l3
    local.get $l3
    i32.const 24
    i32.add
    i32.store
    local.get $l3
    local.get $p2
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.store offset=4
    local.get $l2
    local.get $p0
    i32.store
    local.get $l2
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get $l2
    i32.const 44
    i32.add
    i32.const 17
    i32.store
    local.get $l2
    i64.const 2
    i64.store offset=12 align=4
    local.get $l2
    i32.const 1054412
    i32.store offset=8
    local.get $l2
    i32.const 17
    i32.store offset=36
    local.get $l2
    local.get $l2
    i32.const 32
    i32.add
    i32.store offset=24
    local.get $l2
    local.get $l2
    i32.const 4
    i32.add
    i32.store offset=40
    local.get $l2
    local.get $l2
    i32.store offset=32
    local.get $l2
    i32.const 8
    i32.add
    i32.const 1054428
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.store offset=4
    local.get $l2
    local.get $p0
    i32.store
    local.get $l2
    i32.const 28
    i32.add
    i32.const 2
    i32.store
    local.get $l2
    i32.const 44
    i32.add
    i32.const 17
    i32.store
    local.get $l2
    i64.const 2
    i64.store offset=12 align=4
    local.get $l2
    i32.const 1054480
    i32.store offset=8
    local.get $l2
    i32.const 17
    i32.store offset=36
    local.get $l2
    local.get $l2
    i32.const 32
    i32.add
    i32.store offset=24
    local.get $l2
    local.get $l2
    i32.const 4
    i32.add
    i32.store offset=40
    local.get $l2
    local.get $l2
    i32.store offset=32
    local.get $l2
    i32.const 8
    i32.add
    i32.const 1054496
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN4core3fmt9Formatter3pad17h16ea8f5b109745c2E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32)
    local.get $p0
    i32.load offset=16
    local.set $l3
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p0
            i32.load offset=8
            local.tee $l4
            i32.const 1
            i32.eq
            br_if $B3
            local.get $l3
            br_if $B2
            local.get $p0
            i32.load offset=24
            local.get $p1
            local.get $p2
            local.get $p0
            i32.const 28
            i32.add
            i32.load
            i32.load offset=12
            call_indirect (type $t8) $T0
            local.set $l3
            br $B0
          end
          local.get $l3
          i32.eqz
          br_if $B1
        end
        block $B4
          block $B5
            local.get $p2
            br_if $B5
            i32.const 0
            local.set $p2
            br $B4
          end
          local.get $p1
          local.get $p2
          i32.add
          local.set $l5
          local.get $p0
          i32.const 20
          i32.add
          i32.load
          i32.const 1
          i32.add
          local.set $l6
          i32.const 0
          local.set $l7
          local.get $p1
          local.set $l3
          local.get $p1
          local.set $l8
          loop $L6
            local.get $l3
            i32.const 1
            i32.add
            local.set $l9
            block $B7
              block $B8
                block $B9
                  local.get $l3
                  i32.load8_s
                  local.tee $l10
                  i32.const -1
                  i32.gt_s
                  br_if $B9
                  block $B10
                    block $B11
                      local.get $l9
                      local.get $l5
                      i32.ne
                      br_if $B11
                      i32.const 0
                      local.set $l11
                      local.get $l5
                      local.set $l3
                      br $B10
                    end
                    local.get $l3
                    i32.load8_u offset=1
                    i32.const 63
                    i32.and
                    local.set $l11
                    local.get $l3
                    i32.const 2
                    i32.add
                    local.tee $l9
                    local.set $l3
                  end
                  local.get $l10
                  i32.const 31
                  i32.and
                  local.set $l12
                  block $B12
                    local.get $l10
                    i32.const 255
                    i32.and
                    local.tee $l10
                    i32.const 223
                    i32.gt_u
                    br_if $B12
                    local.get $l11
                    local.get $l12
                    i32.const 6
                    i32.shl
                    i32.or
                    local.set $l10
                    br $B8
                  end
                  block $B13
                    block $B14
                      local.get $l3
                      local.get $l5
                      i32.ne
                      br_if $B14
                      i32.const 0
                      local.set $l13
                      local.get $l5
                      local.set $l14
                      br $B13
                    end
                    local.get $l3
                    i32.load8_u
                    i32.const 63
                    i32.and
                    local.set $l13
                    local.get $l3
                    i32.const 1
                    i32.add
                    local.tee $l9
                    local.set $l14
                  end
                  local.get $l13
                  local.get $l11
                  i32.const 6
                  i32.shl
                  i32.or
                  local.set $l11
                  block $B15
                    local.get $l10
                    i32.const 240
                    i32.ge_u
                    br_if $B15
                    local.get $l11
                    local.get $l12
                    i32.const 12
                    i32.shl
                    i32.or
                    local.set $l10
                    br $B8
                  end
                  block $B16
                    block $B17
                      local.get $l14
                      local.get $l5
                      i32.ne
                      br_if $B17
                      i32.const 0
                      local.set $l10
                      local.get $l9
                      local.set $l3
                      br $B16
                    end
                    local.get $l14
                    i32.const 1
                    i32.add
                    local.set $l3
                    local.get $l14
                    i32.load8_u
                    i32.const 63
                    i32.and
                    local.set $l10
                  end
                  local.get $l11
                  i32.const 6
                  i32.shl
                  local.get $l12
                  i32.const 18
                  i32.shl
                  i32.const 1835008
                  i32.and
                  i32.or
                  local.get $l10
                  i32.or
                  local.tee $l10
                  i32.const 1114112
                  i32.ne
                  br_if $B7
                  br $B4
                end
                local.get $l10
                i32.const 255
                i32.and
                local.set $l10
              end
              local.get $l9
              local.set $l3
            end
            block $B18
              local.get $l6
              i32.const -1
              i32.add
              local.tee $l6
              i32.eqz
              br_if $B18
              local.get $l7
              local.get $l8
              i32.sub
              local.get $l3
              i32.add
              local.set $l7
              local.get $l3
              local.set $l8
              local.get $l5
              local.get $l3
              i32.ne
              br_if $L6
              br $B4
            end
          end
          local.get $l10
          i32.const 1114112
          i32.eq
          br_if $B4
          block $B19
            block $B20
              local.get $l7
              i32.eqz
              br_if $B20
              local.get $l7
              local.get $p2
              i32.eq
              br_if $B20
              i32.const 0
              local.set $l3
              local.get $l7
              local.get $p2
              i32.ge_u
              br_if $B19
              local.get $p1
              local.get $l7
              i32.add
              i32.load8_s
              i32.const -64
              i32.lt_s
              br_if $B19
            end
            local.get $p1
            local.set $l3
          end
          local.get $l7
          local.get $p2
          local.get $l3
          select
          local.set $p2
          local.get $l3
          local.get $p1
          local.get $l3
          select
          local.set $p1
        end
        local.get $l4
        br_if $B1
        local.get $p0
        i32.load offset=24
        local.get $p1
        local.get $p2
        local.get $p0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        return
      end
      i32.const 0
      local.set $l9
      block $B21
        local.get $p2
        i32.eqz
        br_if $B21
        local.get $p2
        local.set $l10
        local.get $p1
        local.set $l3
        loop $L22
          local.get $l9
          local.get $l3
          i32.load8_u
          i32.const 192
          i32.and
          i32.const 128
          i32.eq
          i32.add
          local.set $l9
          local.get $l3
          i32.const 1
          i32.add
          local.set $l3
          local.get $l10
          i32.const -1
          i32.add
          local.tee $l10
          br_if $L22
        end
      end
      block $B23
        local.get $p2
        local.get $l9
        i32.sub
        local.get $p0
        i32.load offset=12
        local.tee $l6
        i32.lt_u
        br_if $B23
        local.get $p0
        i32.load offset=24
        local.get $p1
        local.get $p2
        local.get $p0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        return
      end
      i32.const 0
      local.set $l7
      i32.const 0
      local.set $l9
      block $B24
        local.get $p2
        i32.eqz
        br_if $B24
        i32.const 0
        local.set $l9
        local.get $p2
        local.set $l10
        local.get $p1
        local.set $l3
        loop $L25
          local.get $l9
          local.get $l3
          i32.load8_u
          i32.const 192
          i32.and
          i32.const 128
          i32.eq
          i32.add
          local.set $l9
          local.get $l3
          i32.const 1
          i32.add
          local.set $l3
          local.get $l10
          i32.const -1
          i32.add
          local.tee $l10
          br_if $L25
        end
      end
      local.get $l9
      local.get $p2
      i32.sub
      local.get $l6
      i32.add
      local.tee $l9
      local.set $l10
      block $B26
        block $B27
          block $B28
            i32.const 0
            local.get $p0
            i32.load8_u offset=48
            local.tee $l3
            local.get $l3
            i32.const 3
            i32.eq
            select
            br_table $B26 $B27 $B28 $B27 $B26
          end
          local.get $l9
          i32.const 1
          i32.shr_u
          local.set $l7
          local.get $l9
          i32.const 1
          i32.add
          i32.const 1
          i32.shr_u
          local.set $l10
          br $B26
        end
        i32.const 0
        local.set $l10
        local.get $l9
        local.set $l7
      end
      local.get $l7
      i32.const 1
      i32.add
      local.set $l3
      block $B29
        loop $L30
          local.get $l3
          i32.const -1
          i32.add
          local.tee $l3
          i32.eqz
          br_if $B29
          local.get $p0
          i32.load offset=24
          local.get $p0
          i32.load offset=4
          local.get $p0
          i32.load offset=28
          i32.load offset=16
          call_indirect (type $t3) $T0
          i32.eqz
          br_if $L30
        end
        i32.const 1
        return
      end
      local.get $p0
      i32.load offset=4
      local.set $l9
      i32.const 1
      local.set $l3
      local.get $p0
      i32.load offset=24
      local.get $p1
      local.get $p2
      local.get $p0
      i32.load offset=28
      i32.load offset=12
      call_indirect (type $t8) $T0
      br_if $B0
      local.get $l10
      i32.const 1
      i32.add
      local.set $l3
      local.get $p0
      i32.load offset=28
      local.set $l10
      local.get $p0
      i32.load offset=24
      local.set $p0
      loop $L31
        block $B32
          local.get $l3
          i32.const -1
          i32.add
          local.tee $l3
          br_if $B32
          i32.const 0
          return
        end
        local.get $p0
        local.get $l9
        local.get $l10
        i32.load offset=16
        call_indirect (type $t3) $T0
        i32.eqz
        br_if $L31
      end
      i32.const 1
      return
    end
    local.get $l3)
  (func $_ZN4core3str16slice_error_fail17he7d77f9d4eaf8572E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    i32.const 112
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    local.get $p3
    i32.store offset=12
    local.get $l4
    local.get $p2
    i32.store offset=8
    i32.const 1
    local.set $l5
    local.get $p1
    local.set $l6
    block $B0
      local.get $p1
      i32.const 257
      i32.lt_u
      br_if $B0
      i32.const 0
      local.get $p1
      i32.sub
      local.set $l7
      i32.const 256
      local.set $l8
      loop $L1
        block $B2
          local.get $l8
          local.get $p1
          i32.ge_u
          br_if $B2
          local.get $p0
          local.get $l8
          i32.add
          i32.load8_s
          i32.const -65
          i32.le_s
          br_if $B2
          i32.const 0
          local.set $l5
          local.get $l8
          local.set $l6
          br $B0
        end
        local.get $l8
        i32.const -1
        i32.add
        local.set $l6
        i32.const 0
        local.set $l5
        local.get $l8
        i32.const 1
        i32.eq
        br_if $B0
        local.get $l7
        local.get $l8
        i32.add
        local.set $l9
        local.get $l6
        local.set $l8
        local.get $l9
        i32.const 1
        i32.ne
        br_if $L1
      end
    end
    local.get $l4
    local.get $l6
    i32.store offset=20
    local.get $l4
    local.get $p0
    i32.store offset=16
    local.get $l4
    i32.const 0
    i32.const 5
    local.get $l5
    select
    i32.store offset=28
    local.get $l4
    i32.const 1054032
    i32.const 1054927
    local.get $l5
    select
    i32.store offset=24
    block $B3
      block $B4
        block $B5
          block $B6
            local.get $p2
            local.get $p1
            i32.gt_u
            local.tee $l8
            br_if $B6
            local.get $p3
            local.get $p1
            i32.gt_u
            br_if $B6
            local.get $p2
            local.get $p3
            i32.gt_u
            br_if $B5
            block $B7
              block $B8
                local.get $p2
                i32.eqz
                br_if $B8
                local.get $p1
                local.get $p2
                i32.eq
                br_if $B8
                local.get $p1
                local.get $p2
                i32.le_u
                br_if $B7
                local.get $p0
                local.get $p2
                i32.add
                i32.load8_s
                i32.const -64
                i32.lt_s
                br_if $B7
              end
              local.get $p3
              local.set $p2
            end
            local.get $l4
            local.get $p2
            i32.store offset=32
            local.get $p2
            i32.eqz
            br_if $B4
            local.get $p2
            local.get $p1
            i32.eq
            br_if $B4
            local.get $p1
            i32.const 1
            i32.add
            local.set $l9
            loop $L9
              block $B10
                local.get $p2
                local.get $p1
                i32.ge_u
                br_if $B10
                local.get $p0
                local.get $p2
                i32.add
                i32.load8_s
                i32.const -64
                i32.ge_s
                br_if $B4
              end
              local.get $p2
              i32.const -1
              i32.add
              local.set $l8
              local.get $p2
              i32.const 1
              i32.eq
              br_if $B3
              local.get $l9
              local.get $p2
              i32.eq
              local.set $l6
              local.get $l8
              local.set $p2
              local.get $l6
              i32.eqz
              br_if $L9
              br $B3
            end
          end
          local.get $l4
          local.get $p2
          local.get $p3
          local.get $l8
          select
          i32.store offset=40
          local.get $l4
          i32.const 48
          i32.add
          i32.const 20
          i32.add
          i32.const 3
          i32.store
          local.get $l4
          i32.const 72
          i32.add
          i32.const 20
          i32.add
          i32.const 83
          i32.store
          local.get $l4
          i32.const 84
          i32.add
          i32.const 83
          i32.store
          local.get $l4
          i64.const 3
          i64.store offset=52 align=4
          local.get $l4
          i32.const 1054968
          i32.store offset=48
          local.get $l4
          i32.const 17
          i32.store offset=76
          local.get $l4
          local.get $l4
          i32.const 72
          i32.add
          i32.store offset=64
          local.get $l4
          local.get $l4
          i32.const 24
          i32.add
          i32.store offset=88
          local.get $l4
          local.get $l4
          i32.const 16
          i32.add
          i32.store offset=80
          local.get $l4
          local.get $l4
          i32.const 40
          i32.add
          i32.store offset=72
          local.get $l4
          i32.const 48
          i32.add
          i32.const 1054992
          call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
          unreachable
        end
        local.get $l4
        i32.const 100
        i32.add
        i32.const 83
        i32.store
        local.get $l4
        i32.const 72
        i32.add
        i32.const 20
        i32.add
        i32.const 83
        i32.store
        local.get $l4
        i32.const 84
        i32.add
        i32.const 17
        i32.store
        local.get $l4
        i32.const 48
        i32.add
        i32.const 20
        i32.add
        i32.const 4
        i32.store
        local.get $l4
        i64.const 4
        i64.store offset=52 align=4
        local.get $l4
        i32.const 1055044
        i32.store offset=48
        local.get $l4
        i32.const 17
        i32.store offset=76
        local.get $l4
        local.get $l4
        i32.const 72
        i32.add
        i32.store offset=64
        local.get $l4
        local.get $l4
        i32.const 24
        i32.add
        i32.store offset=96
        local.get $l4
        local.get $l4
        i32.const 16
        i32.add
        i32.store offset=88
        local.get $l4
        local.get $l4
        i32.const 12
        i32.add
        i32.store offset=80
        local.get $l4
        local.get $l4
        i32.const 8
        i32.add
        i32.store offset=72
        local.get $l4
        i32.const 48
        i32.add
        i32.const 1055076
        call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
        unreachable
      end
      local.get $p2
      local.set $l8
    end
    block $B11
      local.get $l8
      local.get $p1
      i32.eq
      br_if $B11
      i32.const 1
      local.set $l6
      block $B12
        block $B13
          block $B14
            block $B15
              local.get $p0
              local.get $l8
              i32.add
              local.tee $l9
              i32.load8_s
              local.tee $p2
              i32.const -1
              i32.gt_s
              br_if $B15
              i32.const 0
              local.set $l5
              local.get $p0
              local.get $p1
              i32.add
              local.tee $l6
              local.set $p1
              block $B16
                local.get $l9
                i32.const 1
                i32.add
                local.get $l6
                i32.eq
                br_if $B16
                local.get $l9
                i32.const 2
                i32.add
                local.set $p1
                local.get $l9
                i32.load8_u offset=1
                i32.const 63
                i32.and
                local.set $l5
              end
              local.get $p2
              i32.const 31
              i32.and
              local.set $l9
              local.get $p2
              i32.const 255
              i32.and
              i32.const 223
              i32.gt_u
              br_if $B14
              local.get $l5
              local.get $l9
              i32.const 6
              i32.shl
              i32.or
              local.set $p1
              br $B13
            end
            local.get $l4
            local.get $p2
            i32.const 255
            i32.and
            i32.store offset=36
            local.get $l4
            i32.const 40
            i32.add
            local.set $p2
            br $B12
          end
          i32.const 0
          local.set $p0
          local.get $l6
          local.set $l7
          block $B17
            local.get $p1
            local.get $l6
            i32.eq
            br_if $B17
            local.get $p1
            i32.const 1
            i32.add
            local.set $l7
            local.get $p1
            i32.load8_u
            i32.const 63
            i32.and
            local.set $p0
          end
          local.get $p0
          local.get $l5
          i32.const 6
          i32.shl
          i32.or
          local.set $p1
          block $B18
            local.get $p2
            i32.const 255
            i32.and
            i32.const 240
            i32.ge_u
            br_if $B18
            local.get $p1
            local.get $l9
            i32.const 12
            i32.shl
            i32.or
            local.set $p1
            br $B13
          end
          i32.const 0
          local.set $p2
          block $B19
            local.get $l7
            local.get $l6
            i32.eq
            br_if $B19
            local.get $l7
            i32.load8_u
            i32.const 63
            i32.and
            local.set $p2
          end
          local.get $p1
          i32.const 6
          i32.shl
          local.get $l9
          i32.const 18
          i32.shl
          i32.const 1835008
          i32.and
          i32.or
          local.get $p2
          i32.or
          local.tee $p1
          i32.const 1114112
          i32.eq
          br_if $B11
        end
        local.get $l4
        local.get $p1
        i32.store offset=36
        i32.const 1
        local.set $l6
        local.get $l4
        i32.const 40
        i32.add
        local.set $p2
        local.get $p1
        i32.const 128
        i32.lt_u
        br_if $B12
        i32.const 2
        local.set $l6
        local.get $p1
        i32.const 2048
        i32.lt_u
        br_if $B12
        i32.const 3
        i32.const 4
        local.get $p1
        i32.const 65536
        i32.lt_u
        select
        local.set $l6
      end
      local.get $l4
      local.get $l8
      i32.store offset=40
      local.get $l4
      local.get $l6
      local.get $l8
      i32.add
      i32.store offset=44
      local.get $l4
      i32.const 48
      i32.add
      i32.const 20
      i32.add
      i32.const 5
      i32.store
      local.get $l4
      i32.const 108
      i32.add
      i32.const 83
      i32.store
      local.get $l4
      i32.const 100
      i32.add
      i32.const 83
      i32.store
      local.get $l4
      i32.const 72
      i32.add
      i32.const 20
      i32.add
      i32.const 84
      i32.store
      local.get $l4
      i32.const 84
      i32.add
      i32.const 85
      i32.store
      local.get $l4
      i64.const 5
      i64.store offset=52 align=4
      local.get $l4
      i32.const 1055144
      i32.store offset=48
      local.get $l4
      local.get $p2
      i32.store offset=88
      local.get $l4
      i32.const 17
      i32.store offset=76
      local.get $l4
      local.get $l4
      i32.const 72
      i32.add
      i32.store offset=64
      local.get $l4
      local.get $l4
      i32.const 24
      i32.add
      i32.store offset=104
      local.get $l4
      local.get $l4
      i32.const 16
      i32.add
      i32.store offset=96
      local.get $l4
      local.get $l4
      i32.const 36
      i32.add
      i32.store offset=80
      local.get $l4
      local.get $l4
      i32.const 32
      i32.add
      i32.store offset=72
      local.get $l4
      i32.const 48
      i32.add
      i32.const 1055184
      call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
      unreachable
    end
    i32.const 1054184
    i32.const 43
    i32.const 1054248
    call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
    unreachable)
  (func $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.store offset=12
    local.get $l2
    local.get $p0
    i32.store offset=8
    local.get $l2
    i32.const 1054072
    i32.store offset=4
    local.get $l2
    i32.const 1
    i32.store
    local.get $l2
    call $rust_begin_unwind
    unreachable)
  (func $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17he5d54fd99fa6dba5E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i64.load32_u
    i32.const 1
    local.get $p1
    call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE)
  (func $_ZN4core3fmt5write17hfcf1a109ad62a790E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 36
    i32.add
    local.get $p1
    i32.store
    local.get $l3
    i32.const 52
    i32.add
    local.get $p2
    i32.const 20
    i32.add
    i32.load
    local.tee $l4
    i32.store
    local.get $l3
    i32.const 3
    i32.store8 offset=56
    local.get $l3
    i32.const 44
    i32.add
    local.get $p2
    i32.load offset=16
    local.tee $l5
    local.get $l4
    i32.const 3
    i32.shl
    i32.add
    i32.store
    local.get $l3
    i64.const 137438953472
    i64.store offset=8
    local.get $l3
    local.get $p0
    i32.store offset=32
    i32.const 0
    local.set $l6
    local.get $l3
    i32.const 0
    i32.store offset=24
    local.get $l3
    i32.const 0
    i32.store offset=16
    local.get $l3
    local.get $l5
    i32.store offset=48
    local.get $l3
    local.get $l5
    i32.store offset=40
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $p2
              i32.load offset=8
              local.tee $l7
              br_if $B4
              local.get $p2
              i32.load
              local.set $l8
              local.get $p2
              i32.load offset=4
              local.tee $l9
              local.get $l4
              local.get $l4
              local.get $l9
              i32.gt_u
              select
              local.tee $l10
              i32.eqz
              br_if $B3
              i32.const 1
              local.set $l4
              local.get $p0
              local.get $l8
              i32.load
              local.get $l8
              i32.load offset=4
              local.get $p1
              i32.load offset=12
              call_indirect (type $t8) $T0
              br_if $B0
              local.get $l8
              i32.const 12
              i32.add
              local.set $p2
              i32.const 1
              local.set $l6
              loop $L5
                block $B6
                  local.get $l5
                  i32.load
                  local.get $l3
                  i32.const 8
                  i32.add
                  local.get $l5
                  i32.const 4
                  i32.add
                  i32.load
                  call_indirect (type $t3) $T0
                  i32.eqz
                  br_if $B6
                  i32.const 1
                  local.set $l4
                  br $B0
                end
                local.get $l6
                local.get $l10
                i32.ge_u
                br_if $B3
                local.get $p2
                i32.const -4
                i32.add
                local.set $p0
                local.get $p2
                i32.load
                local.set $p1
                local.get $p2
                i32.const 8
                i32.add
                local.set $p2
                local.get $l5
                i32.const 8
                i32.add
                local.set $l5
                i32.const 1
                local.set $l4
                local.get $l6
                i32.const 1
                i32.add
                local.set $l6
                local.get $l3
                i32.load offset=32
                local.get $p0
                i32.load
                local.get $p1
                local.get $l3
                i32.load offset=36
                i32.load offset=12
                call_indirect (type $t8) $T0
                i32.eqz
                br_if $L5
                br $B0
              end
            end
            local.get $p2
            i32.load
            local.set $l8
            local.get $p2
            i32.load offset=4
            local.tee $l9
            local.get $p2
            i32.const 12
            i32.add
            i32.load
            local.tee $l5
            local.get $l5
            local.get $l9
            i32.gt_u
            select
            local.tee $l10
            i32.eqz
            br_if $B3
            i32.const 1
            local.set $l4
            local.get $p0
            local.get $l8
            i32.load
            local.get $l8
            i32.load offset=4
            local.get $p1
            i32.load offset=12
            call_indirect (type $t8) $T0
            br_if $B0
            local.get $l8
            i32.const 12
            i32.add
            local.set $p2
            local.get $l7
            i32.const 16
            i32.add
            local.set $l5
            i32.const 1
            local.set $l6
            loop $L7
              local.get $l3
              local.get $l5
              i32.const -8
              i32.add
              i32.load
              i32.store offset=12
              local.get $l3
              local.get $l5
              i32.const 16
              i32.add
              i32.load8_u
              i32.store8 offset=56
              local.get $l3
              local.get $l5
              i32.const -4
              i32.add
              i32.load
              i32.store offset=8
              i32.const 0
              local.set $p1
              i32.const 0
              local.set $p0
              block $B8
                block $B9
                  block $B10
                    block $B11
                      local.get $l5
                      i32.const 8
                      i32.add
                      i32.load
                      br_table $B11 $B10 $B9 $B8 $B11
                    end
                    local.get $l5
                    i32.const 12
                    i32.add
                    i32.load
                    local.set $l4
                    i32.const 1
                    local.set $p0
                    br $B8
                  end
                  block $B12
                    local.get $l5
                    i32.const 12
                    i32.add
                    i32.load
                    local.tee $l7
                    local.get $l3
                    i32.load offset=52
                    local.tee $l4
                    i32.ge_u
                    br_if $B12
                    i32.const 0
                    local.set $p0
                    local.get $l3
                    i32.load offset=48
                    local.get $l7
                    i32.const 3
                    i32.shl
                    i32.add
                    local.tee $l7
                    i32.load offset=4
                    i32.const 86
                    i32.ne
                    br_if $B8
                    local.get $l7
                    i32.load
                    i32.load
                    local.set $l4
                    i32.const 1
                    local.set $p0
                    br $B8
                  end
                  i32.const 1055532
                  local.get $l7
                  local.get $l4
                  call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
                  unreachable
                end
                i32.const 0
                local.set $p0
                local.get $l3
                i32.load offset=40
                local.tee $l7
                local.get $l3
                i32.load offset=44
                i32.eq
                br_if $B8
                local.get $l3
                local.get $l7
                i32.const 8
                i32.add
                i32.store offset=40
                i32.const 0
                local.set $p0
                local.get $l7
                i32.load offset=4
                i32.const 86
                i32.ne
                br_if $B8
                local.get $l7
                i32.load
                i32.load
                local.set $l4
                i32.const 1
                local.set $p0
              end
              local.get $l3
              local.get $l4
              i32.store offset=20
              local.get $l3
              local.get $p0
              i32.store offset=16
              block $B13
                block $B14
                  block $B15
                    block $B16
                      block $B17
                        block $B18
                          block $B19
                            local.get $l5
                            i32.load
                            br_table $B15 $B18 $B19 $B13 $B15
                          end
                          local.get $l3
                          i32.load offset=40
                          local.tee $p0
                          local.get $l3
                          i32.load offset=44
                          i32.ne
                          br_if $B17
                          br $B13
                        end
                        local.get $l5
                        i32.const 4
                        i32.add
                        i32.load
                        local.tee $p0
                        local.get $l3
                        i32.load offset=52
                        local.tee $l4
                        i32.ge_u
                        br_if $B16
                        local.get $l3
                        i32.load offset=48
                        local.get $p0
                        i32.const 3
                        i32.shl
                        i32.add
                        local.tee $p0
                        i32.load offset=4
                        i32.const 86
                        i32.ne
                        br_if $B13
                        local.get $p0
                        i32.load
                        i32.load
                        local.set $l4
                        br $B14
                      end
                      local.get $l3
                      local.get $p0
                      i32.const 8
                      i32.add
                      i32.store offset=40
                      local.get $p0
                      i32.load offset=4
                      i32.const 86
                      i32.ne
                      br_if $B13
                      local.get $p0
                      i32.load
                      i32.load
                      local.set $l4
                      br $B14
                    end
                    i32.const 1055532
                    local.get $p0
                    local.get $l4
                    call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
                    unreachable
                  end
                  local.get $l5
                  i32.const 4
                  i32.add
                  i32.load
                  local.set $l4
                end
                i32.const 1
                local.set $p1
              end
              local.get $l3
              local.get $l4
              i32.store offset=28
              local.get $l3
              local.get $p1
              i32.store offset=24
              block $B20
                block $B21
                  local.get $l5
                  i32.const -16
                  i32.add
                  i32.load
                  i32.const 1
                  i32.eq
                  br_if $B21
                  local.get $l3
                  i32.load offset=40
                  local.tee $l4
                  local.get $l3
                  i32.load offset=44
                  i32.eq
                  br_if $B2
                  local.get $l3
                  local.get $l4
                  i32.const 8
                  i32.add
                  i32.store offset=40
                  br $B20
                end
                local.get $l5
                i32.const -12
                i32.add
                i32.load
                local.tee $l4
                local.get $l3
                i32.load offset=52
                local.tee $p0
                i32.ge_u
                br_if $B1
                local.get $l3
                i32.load offset=48
                local.get $l4
                i32.const 3
                i32.shl
                i32.add
                local.set $l4
              end
              block $B22
                local.get $l4
                i32.load
                local.get $l3
                i32.const 8
                i32.add
                local.get $l4
                i32.const 4
                i32.add
                i32.load
                call_indirect (type $t3) $T0
                i32.eqz
                br_if $B22
                i32.const 1
                local.set $l4
                br $B0
              end
              local.get $l6
              local.get $l10
              i32.ge_u
              br_if $B3
              local.get $p2
              i32.const -4
              i32.add
              local.set $p0
              local.get $p2
              i32.load
              local.set $p1
              local.get $p2
              i32.const 8
              i32.add
              local.set $p2
              local.get $l5
              i32.const 36
              i32.add
              local.set $l5
              i32.const 1
              local.set $l4
              local.get $l6
              i32.const 1
              i32.add
              local.set $l6
              local.get $l3
              i32.load offset=32
              local.get $p0
              i32.load
              local.get $p1
              local.get $l3
              i32.load offset=36
              i32.load offset=12
              call_indirect (type $t8) $T0
              i32.eqz
              br_if $L7
              br $B0
            end
          end
          block $B23
            local.get $l9
            local.get $l6
            i32.le_u
            br_if $B23
            i32.const 1
            local.set $l4
            local.get $l3
            i32.load offset=32
            local.get $l8
            local.get $l6
            i32.const 3
            i32.shl
            i32.add
            local.tee $l5
            i32.load
            local.get $l5
            i32.load offset=4
            local.get $l3
            i32.load offset=36
            i32.load offset=12
            call_indirect (type $t8) $T0
            br_if $B0
          end
          i32.const 0
          local.set $l4
          br $B0
        end
        i32.const 1054184
        i32.const 43
        i32.const 1054248
        call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
        unreachable
      end
      i32.const 1055516
      local.get $l4
      local.get $p0
      call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
      unreachable
    end
    local.get $l3
    i32.const 64
    i32.add
    global.set $g0
    local.get $l4)
  (func $_ZN71_$LT$core..ops..range..Range$LT$Idx$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h83e6c12d2862f0deE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      local.get $p0
      local.get $p1
      call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6531f92922fc1e14E
      br_if $B0
      local.get $p1
      i32.const 28
      i32.add
      i32.load
      local.set $l3
      local.get $p1
      i32.load offset=24
      local.set $l4
      local.get $l2
      i64.const 4
      i64.store offset=24
      local.get $l2
      i64.const 1
      i64.store offset=12 align=4
      local.get $l2
      i32.const 1054036
      i32.store offset=8
      local.get $l4
      local.get $l3
      local.get $l2
      i32.const 8
      i32.add
      call $_ZN4core3fmt5write17hfcf1a109ad62a790E
      br_if $B0
      local.get $p0
      i32.const 4
      i32.add
      local.get $p1
      call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6531f92922fc1e14E
      local.set $p1
      local.get $l2
      i32.const 32
      i32.add
      global.set $g0
      local.get $p1
      return
    end
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    i32.const 1)
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6531f92922fc1e14E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $p1
              i32.load
              local.tee $l3
              i32.const 16
              i32.and
              br_if $B4
              local.get $p0
              i32.load
              local.set $l4
              local.get $l3
              i32.const 32
              i32.and
              br_if $B3
              local.get $l4
              i64.extend_i32_u
              i32.const 1
              local.get $p1
              call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE
              local.set $p0
              br $B2
            end
            local.get $p0
            i32.load
            local.set $l4
            i32.const 0
            local.set $p0
            loop $L5
              local.get $l2
              local.get $p0
              i32.add
              i32.const 127
              i32.add
              local.get $l4
              i32.const 15
              i32.and
              local.tee $l3
              i32.const 48
              i32.or
              local.get $l3
              i32.const 87
              i32.add
              local.get $l3
              i32.const 10
              i32.lt_u
              select
              i32.store8
              local.get $p0
              i32.const -1
              i32.add
              local.set $p0
              local.get $l4
              i32.const 4
              i32.shr_u
              local.tee $l4
              br_if $L5
            end
            local.get $p0
            i32.const 128
            i32.add
            local.tee $l4
            i32.const 129
            i32.ge_u
            br_if $B1
            local.get $p1
            i32.const 1
            i32.const 1055265
            i32.const 2
            local.get $l2
            local.get $p0
            i32.add
            i32.const 128
            i32.add
            i32.const 0
            local.get $p0
            i32.sub
            call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
            local.set $p0
            br $B2
          end
          i32.const 0
          local.set $p0
          loop $L6
            local.get $l2
            local.get $p0
            i32.add
            i32.const 127
            i32.add
            local.get $l4
            i32.const 15
            i32.and
            local.tee $l3
            i32.const 48
            i32.or
            local.get $l3
            i32.const 55
            i32.add
            local.get $l3
            i32.const 10
            i32.lt_u
            select
            i32.store8
            local.get $p0
            i32.const -1
            i32.add
            local.set $p0
            local.get $l4
            i32.const 4
            i32.shr_u
            local.tee $l4
            br_if $L6
          end
          local.get $p0
          i32.const 128
          i32.add
          local.tee $l4
          i32.const 129
          i32.ge_u
          br_if $B0
          local.get $p1
          i32.const 1
          i32.const 1055265
          i32.const 2
          local.get $l2
          local.get $p0
          i32.add
          i32.const 128
          i32.add
          i32.const 0
          local.get $p0
          i32.sub
          call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
          local.set $p0
        end
        local.get $l2
        i32.const 128
        i32.add
        global.set $g0
        local.get $p0
        return
      end
      local.get $l4
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $l4
    i32.const 128
    call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
    unreachable)
  (func $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h12eac008b4b21e1eE (type $t2) (param $p0 i32) (result i64)
    i64.const 1326275122736511237)
  (func $_ZN60_$LT$core..cell..BorrowError$u20$as$u20$core..fmt..Debug$GT$3fmt17h93963e0f8b45f7bfE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p1
    i32.load offset=24
    i32.const 1054044
    i32.const 11
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0)
  (func $_ZN63_$LT$core..cell..BorrowMutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h33a664c2b7f63890E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p1
    i32.load offset=24
    i32.const 1054055
    i32.const 14
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0)
  (func $_ZN82_$LT$core..char..EscapeDebug$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17heb2b2e39f0d95f01E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32)
    i32.const 1114112
    local.set $l1
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p0
            i32.load
            br_table $B0 $B2 $B3 $B1 $B0
          end
          local.get $p0
          i32.const 1
          i32.store
          i32.const 92
          return
        end
        local.get $p0
        i32.const 0
        i32.store
        local.get $p0
        i32.load offset=4
        return
      end
      block $B4
        block $B5
          block $B6
            block $B7
              block $B8
                local.get $p0
                i32.const 12
                i32.add
                i32.load8_u
                br_table $B0 $B4 $B5 $B6 $B7 $B8 $B0
              end
              local.get $p0
              i32.const 4
              i32.store8 offset=12
              i32.const 92
              return
            end
            local.get $p0
            i32.const 3
            i32.store8 offset=12
            i32.const 117
            return
          end
          local.get $p0
          i32.const 2
          i32.store8 offset=12
          i32.const 123
          return
        end
        local.get $p0
        i32.load offset=4
        local.get $p0
        i32.const 8
        i32.add
        i32.load
        local.tee $l2
        i32.const 2
        i32.shl
        i32.const 28
        i32.and
        i32.shr_u
        i32.const 15
        i32.and
        local.tee $l1
        i32.const 48
        i32.or
        local.get $l1
        i32.const 87
        i32.add
        local.get $l1
        i32.const 10
        i32.lt_u
        select
        local.set $l1
        block $B9
          local.get $l2
          i32.eqz
          br_if $B9
          local.get $p0
          local.get $l2
          i32.const -1
          i32.add
          i32.store offset=8
          local.get $l1
          return
        end
        local.get $p0
        i32.const 1
        i32.store8 offset=12
        local.get $l1
        return
      end
      local.get $p0
      i32.const 0
      i32.store8 offset=12
      i32.const 125
      local.set $l1
    end
    local.get $l1)
  (func $_ZN4core5panic9PanicInfo7message17hb84043bc9031cd9eE (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load offset=8)
  (func $_ZN4core5panic9PanicInfo8location17h357305d15ad07bb1E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load offset=12)
  (func $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17hcbc8d7fbf70f6d32E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p1
    local.get $p0
    i32.load
    local.get $p0
    i32.load offset=4
    call $_ZN4core3fmt9Formatter3pad17h16ea8f5b109745c2E)
  (func $_ZN4core5panic8Location20internal_constructor17h8b867236d764bd5aE (type $t11) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32)
    local.get $p0
    local.get $p4
    i32.store offset=12
    local.get $p0
    local.get $p3
    i32.store offset=8
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $_ZN4core5panic8Location4file17h6490e08da345e876E (type $t5) (param $p0 i32) (param $p1 i32)
    local.get $p0
    local.get $p1
    i64.load align=4
    i64.store align=4)
  (func $_ZN4core5panic8Location4line17h71a3180f1307af29E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load offset=8)
  (func $_ZN4core5panic8Location6column17hb12aa6066069c5f2E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load offset=12)
  (func $_ZN60_$LT$core..panic..Location$u20$as$u20$core..fmt..Display$GT$3fmt17h4725d5f5dca9851eE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    i32.const 20
    i32.add
    i32.const 17
    i32.store
    local.get $l2
    i32.const 12
    i32.add
    i32.const 17
    i32.store
    local.get $l2
    i32.const 83
    i32.store offset=4
    local.get $l2
    local.get $p0
    i32.store
    local.get $l2
    local.get $p0
    i32.const 12
    i32.add
    i32.store offset=16
    local.get $l2
    local.get $p0
    i32.const 8
    i32.add
    i32.store offset=8
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    local.set $p0
    local.get $p1
    i32.load offset=24
    local.set $p1
    local.get $l2
    i32.const 24
    i32.add
    i32.const 20
    i32.add
    i32.const 3
    i32.store
    local.get $l2
    i64.const 3
    i64.store offset=28 align=4
    local.get $l2
    i32.const 1054092
    i32.store offset=24
    local.get $l2
    local.get $l2
    i32.store offset=40
    local.get $p1
    local.get $p0
    local.get $l2
    i32.const 24
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p0
    local.get $l2
    i32.const 48
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3fmt8builders11DebugStruct5field17hdbb79d996b523484E (type $t12) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32) (result i32)
    (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i64) (local $l10 i64) (local $l11 i64) (local $l12 i64) (local $l13 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l5
    global.set $g0
    i32.const 1
    local.set $l6
    block $B0
      local.get $p0
      i32.load8_u offset=4
      br_if $B0
      local.get $p0
      i32.load8_u offset=5
      local.set $l7
      block $B1
        local.get $p0
        i32.load
        local.tee $l8
        i32.load8_u
        i32.const 4
        i32.and
        br_if $B1
        i32.const 1
        local.set $l6
        local.get $l8
        i32.load offset=24
        i32.const 1055233
        i32.const 1055235
        local.get $l7
        i32.const 255
        i32.and
        local.tee $l7
        select
        i32.const 2
        i32.const 3
        local.get $l7
        select
        local.get $l8
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        i32.const 1
        local.set $l6
        local.get $p0
        i32.load
        local.tee $l8
        i32.load offset=24
        local.get $p1
        local.get $p2
        local.get $l8
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        i32.const 1
        local.set $l6
        local.get $p0
        i32.load
        local.tee $l8
        i32.load offset=24
        i32.const 1054288
        i32.const 2
        local.get $l8
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        local.get $p3
        local.get $p0
        i32.load
        local.get $p4
        i32.load offset=12
        call_indirect (type $t3) $T0
        local.set $l6
        br $B0
      end
      block $B2
        local.get $l7
        i32.const 255
        i32.and
        br_if $B2
        i32.const 1
        local.set $l6
        local.get $l8
        i32.load offset=24
        i32.const 1055228
        i32.const 3
        local.get $l8
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        local.get $p0
        i32.load
        local.set $l8
      end
      i32.const 1
      local.set $l6
      local.get $l5
      i32.const 1
      i32.store8 offset=23
      local.get $l5
      local.get $l5
      i32.const 23
      i32.add
      i32.store offset=16
      local.get $l8
      i64.load offset=8 align=4
      local.set $l9
      local.get $l8
      i64.load offset=16 align=4
      local.set $l10
      local.get $l5
      i32.const 52
      i32.add
      i32.const 1055200
      i32.store
      local.get $l5
      local.get $l8
      i64.load offset=24 align=4
      i64.store offset=8
      local.get $l8
      i64.load offset=32 align=4
      local.set $l11
      local.get $l8
      i64.load offset=40 align=4
      local.set $l12
      local.get $l5
      local.get $l8
      i32.load8_u offset=48
      i32.store8 offset=72
      local.get $l8
      i64.load align=4
      local.set $l13
      local.get $l5
      local.get $l12
      i64.store offset=64
      local.get $l5
      local.get $l11
      i64.store offset=56
      local.get $l5
      local.get $l10
      i64.store offset=40
      local.get $l5
      local.get $l9
      i64.store offset=32
      local.get $l5
      local.get $l13
      i64.store offset=24
      local.get $l5
      local.get $l5
      i32.const 8
      i32.add
      i32.store offset=48
      local.get $l5
      i32.const 8
      i32.add
      local.get $p1
      local.get $p2
      call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E
      br_if $B0
      local.get $l5
      i32.const 8
      i32.add
      i32.const 1054288
      i32.const 2
      call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E
      br_if $B0
      local.get $p3
      local.get $l5
      i32.const 24
      i32.add
      local.get $p4
      i32.load offset=12
      call_indirect (type $t3) $T0
      br_if $B0
      local.get $l5
      i32.load offset=48
      i32.const 1055231
      i32.const 2
      local.get $l5
      i32.load offset=52
      i32.load offset=12
      call_indirect (type $t8) $T0
      local.set $l6
    end
    local.get $p0
    i32.const 1
    i32.store8 offset=5
    local.get $p0
    local.get $l6
    i32.store8 offset=4
    local.get $l5
    i32.const 80
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core6option13expect_failed17he2d01222d382a638E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p1
    i32.store offset=12
    local.get $l2
    local.get $p0
    i32.store offset=8
    local.get $l2
    i32.const 36
    i32.add
    i32.const 1
    i32.store
    local.get $l2
    i64.const 1
    i64.store offset=20 align=4
    local.get $l2
    i32.const 1054264
    i32.store offset=16
    local.get $l2
    i32.const 83
    i32.store offset=44
    local.get $l2
    local.get $l2
    i32.const 40
    i32.add
    i32.store offset=32
    local.get $l2
    local.get $l2
    i32.const 8
    i32.add
    i32.store offset=40
    local.get $l2
    i32.const 16
    i32.add
    i32.const 1054272
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hedf6bd652ecf88e3E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    local.get $p0
    i32.load offset=4
    i32.load offset=12
    call_indirect (type $t3) $T0)
  (func $_ZN4core6result13unwrap_failed17h1aa7e77e69114517E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32)
    global.get $g0
    i32.const 64
    i32.sub
    local.tee $l4
    global.set $g0
    local.get $l4
    local.get $p1
    i32.store offset=12
    local.get $l4
    local.get $p0
    i32.store offset=8
    local.get $l4
    local.get $p3
    i32.store offset=20
    local.get $l4
    local.get $p2
    i32.store offset=16
    local.get $l4
    i32.const 44
    i32.add
    i32.const 2
    i32.store
    local.get $l4
    i32.const 60
    i32.add
    i32.const 87
    i32.store
    local.get $l4
    i64.const 2
    i64.store offset=28 align=4
    local.get $l4
    i32.const 1054292
    i32.store offset=24
    local.get $l4
    i32.const 83
    i32.store offset=52
    local.get $l4
    local.get $l4
    i32.const 48
    i32.add
    i32.store offset=40
    local.get $l4
    local.get $l4
    i32.const 16
    i32.add
    i32.store offset=56
    local.get $l4
    local.get $l4
    i32.const 8
    i32.add
    i32.store offset=48
    local.get $l4
    i32.const 24
    i32.add
    i32.const 1054332
    call $_ZN4core9panicking9panic_fmt17h869f1556b389ebb6E
    unreachable)
  (func $_ZN63_$LT$core..ffi..VaListImpl$u20$as$u20$core..ops..drop..Drop$GT$4drop17h2c1a13365580a4e5E (type $t1) (param $p0 i32))
  (func $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    i32.const 0
    local.set $l4
    block $B0
      block $B1
        local.get $p2
        i32.const 3
        i32.and
        local.tee $l5
        i32.eqz
        br_if $B1
        i32.const 4
        local.get $l5
        i32.sub
        local.tee $l5
        i32.eqz
        br_if $B1
        local.get $p3
        local.get $l5
        local.get $l5
        local.get $p3
        i32.gt_u
        select
        local.set $l4
        i32.const 0
        local.set $l5
        local.get $p1
        i32.const 255
        i32.and
        local.set $l6
        loop $L2
          local.get $l4
          local.get $l5
          i32.eq
          br_if $B1
          local.get $p2
          local.get $l5
          i32.add
          local.set $l7
          local.get $l5
          i32.const 1
          i32.add
          local.set $l5
          local.get $l7
          i32.load8_u
          local.tee $l7
          local.get $l6
          i32.ne
          br_if $L2
        end
        i32.const 1
        local.set $p3
        local.get $l7
        local.get $p1
        i32.const 255
        i32.and
        i32.eq
        i32.const 1
        i32.add
        i32.const 1
        i32.and
        local.get $l5
        i32.add
        i32.const -1
        i32.add
        local.set $l5
        br $B0
      end
      local.get $p1
      i32.const 255
      i32.and
      local.set $l6
      block $B3
        block $B4
          local.get $p3
          i32.const 8
          i32.lt_u
          br_if $B4
          local.get $l4
          local.get $p3
          i32.const -8
          i32.add
          local.tee $l8
          i32.gt_u
          br_if $B4
          local.get $l6
          i32.const 16843009
          i32.mul
          local.set $l5
          block $B5
            loop $L6
              local.get $p2
              local.get $l4
              i32.add
              local.tee $l7
              i32.const 4
              i32.add
              i32.load
              local.get $l5
              i32.xor
              local.tee $l9
              i32.const -1
              i32.xor
              local.get $l9
              i32.const -16843009
              i32.add
              i32.and
              local.get $l7
              i32.load
              local.get $l5
              i32.xor
              local.tee $l7
              i32.const -1
              i32.xor
              local.get $l7
              i32.const -16843009
              i32.add
              i32.and
              i32.or
              i32.const -2139062144
              i32.and
              br_if $B5
              local.get $l4
              i32.const 8
              i32.add
              local.tee $l4
              local.get $l8
              i32.le_u
              br_if $L6
            end
          end
          local.get $l4
          local.get $p3
          i32.gt_u
          br_if $B3
        end
        local.get $p2
        local.get $l4
        i32.add
        local.set $l9
        local.get $p3
        local.get $l4
        i32.sub
        local.set $p2
        i32.const 0
        local.set $p3
        i32.const 0
        local.set $l5
        block $B7
          loop $L8
            local.get $p2
            local.get $l5
            i32.eq
            br_if $B7
            local.get $l9
            local.get $l5
            i32.add
            local.set $l7
            local.get $l5
            i32.const 1
            i32.add
            local.set $l5
            local.get $l7
            i32.load8_u
            local.tee $l7
            local.get $l6
            i32.ne
            br_if $L8
          end
          i32.const 1
          local.set $p3
          local.get $l7
          local.get $p1
          i32.const 255
          i32.and
          i32.eq
          i32.const 1
          i32.add
          i32.const 1
          i32.and
          local.get $l5
          i32.add
          i32.const -1
          i32.add
          local.set $l5
        end
        local.get $l5
        local.get $l4
        i32.add
        local.set $l5
        br $B0
      end
      local.get $l4
      local.get $p3
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $p0
    local.get $l5
    i32.store offset=4
    local.get $p0
    local.get $p3
    i32.store)
  (func $_ZN4core5slice6memchr7memrchr17hc5890a38ca2d83a7E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    local.get $p3
    i32.const 0
    local.get $p3
    i32.const 4
    local.get $p2
    i32.const 3
    i32.and
    local.tee $l4
    i32.sub
    i32.const 0
    local.get $l4
    select
    local.tee $l5
    i32.sub
    i32.const 7
    i32.and
    local.get $p3
    local.get $l5
    i32.lt_u
    local.tee $l6
    select
    local.tee $l4
    i32.sub
    local.set $l7
    block $B0
      block $B1
        block $B2
          block $B3
            local.get $p3
            local.get $l4
            i32.lt_u
            br_if $B3
            local.get $p3
            local.get $l5
            local.get $l6
            select
            local.set $l8
            local.get $p2
            local.get $l7
            i32.add
            local.get $p2
            local.get $p3
            i32.add
            local.tee $l5
            i32.sub
            local.set $l6
            local.get $l5
            i32.const -1
            i32.add
            local.set $l5
            local.get $p1
            i32.const 255
            i32.and
            local.set $l9
            block $B4
              loop $L5
                local.get $l4
                i32.eqz
                br_if $B4
                local.get $l6
                i32.const 1
                i32.add
                local.set $l6
                local.get $l4
                i32.const -1
                i32.add
                local.set $l4
                local.get $l5
                i32.load8_u
                local.set $l10
                local.get $l5
                i32.const -1
                i32.add
                local.set $l5
                local.get $l10
                local.get $l9
                i32.ne
                br_if $L5
              end
              local.get $l7
              local.get $l6
              i32.sub
              local.set $l4
              br $B1
            end
            local.get $p1
            i32.const 255
            i32.and
            i32.const 16843009
            i32.mul
            local.set $l5
            block $B6
              loop $L7
                local.get $l7
                local.tee $l4
                local.get $l8
                i32.le_u
                br_if $B6
                local.get $l4
                i32.const -8
                i32.add
                local.set $l7
                local.get $p2
                local.get $l4
                i32.add
                local.tee $l6
                i32.const -4
                i32.add
                i32.load
                local.get $l5
                i32.xor
                local.tee $l10
                i32.const -1
                i32.xor
                local.get $l10
                i32.const -16843009
                i32.add
                i32.and
                local.get $l6
                i32.const -8
                i32.add
                i32.load
                local.get $l5
                i32.xor
                local.tee $l6
                i32.const -1
                i32.xor
                local.get $l6
                i32.const -16843009
                i32.add
                i32.and
                i32.or
                i32.const -2139062144
                i32.and
                i32.eqz
                br_if $L7
              end
            end
            local.get $l4
            local.get $p3
            i32.gt_u
            br_if $B2
            local.get $p2
            i32.const -1
            i32.add
            local.set $l6
            local.get $p1
            i32.const 255
            i32.and
            local.set $l10
            loop $L8
              block $B9
                local.get $l4
                br_if $B9
                i32.const 0
                local.set $l5
                br $B0
              end
              local.get $l6
              local.get $l4
              i32.add
              local.set $l5
              local.get $l4
              i32.const -1
              i32.add
              local.set $l4
              local.get $l5
              i32.load8_u
              local.get $l10
              i32.eq
              br_if $B1
              br $L8
            end
          end
          local.get $l7
          local.get $p3
          call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
          unreachable
        end
        local.get $l4
        local.get $p3
        call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
        unreachable
      end
      i32.const 1
      local.set $l5
    end
    local.get $p0
    local.get $l4
    i32.store offset=4
    local.get $p0
    local.get $l5
    i32.store)
  (func $_ZN4core5slice25slice_index_overflow_fail17h13a0de4601da693aE (type $t0)
    i32.const 1054512
    i32.const 44
    i32.const 1054556
    call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
    unreachable)
  (func $_ZN4core3str5lossy9Utf8Lossy10from_bytes17h87ecc792cefcf2c6E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $_ZN4core3str5lossy9Utf8Lossy6chunks17h5764855599d7f6efE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    local.get $p0
    local.get $p2
    i32.store offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $_ZN96_$LT$core..str..lossy..Utf8LossyChunksIter$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h61f6ad47ee0a8c50E (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    block $B0
      local.get $p1
      i32.load offset=4
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $p1
      i32.load
      local.set $l3
      i32.const 0
      local.set $l4
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  block $B7
                    block $B8
                      block $B9
                        block $B10
                          block $B11
                            block $B12
                              loop $L13
                                local.get $l4
                                i32.const 1
                                i32.add
                                local.set $l5
                                block $B14
                                  block $B15
                                    local.get $l3
                                    local.get $l4
                                    i32.add
                                    local.tee $l6
                                    i32.load8_u
                                    local.tee $l7
                                    i32.const 24
                                    i32.shl
                                    i32.const 24
                                    i32.shr_s
                                    local.tee $l8
                                    i32.const -1
                                    i32.le_s
                                    br_if $B15
                                    local.get $l5
                                    local.set $l4
                                    br $B14
                                  end
                                  block $B16
                                    block $B17
                                      block $B18
                                        block $B19
                                          local.get $l7
                                          i32.const 1054671
                                          i32.add
                                          i32.load8_u
                                          i32.const -2
                                          i32.add
                                          local.tee $l9
                                          i32.const 2
                                          i32.gt_u
                                          br_if $B19
                                          local.get $l9
                                          br_table $B18 $B17 $B16 $B18
                                        end
                                        local.get $l2
                                        local.get $l4
                                        i32.lt_u
                                        br_if $B2
                                        local.get $l2
                                        local.get $l4
                                        i32.le_u
                                        br_if $B1
                                        local.get $p0
                                        local.get $l4
                                        i32.store offset=4
                                        local.get $p0
                                        local.get $l3
                                        i32.store
                                        local.get $p1
                                        local.get $l2
                                        local.get $l5
                                        i32.sub
                                        i32.store offset=4
                                        local.get $p1
                                        local.get $l3
                                        local.get $l5
                                        i32.add
                                        i32.store
                                        local.get $p0
                                        i32.const 12
                                        i32.add
                                        i32.const 1
                                        i32.store
                                        local.get $p0
                                        i32.const 8
                                        i32.add
                                        local.get $l6
                                        i32.store
                                        return
                                      end
                                      block $B20
                                        local.get $l3
                                        local.get $l5
                                        i32.add
                                        local.tee $l8
                                        i32.const 0
                                        local.get $l2
                                        local.get $l5
                                        i32.gt_u
                                        select
                                        local.tee $l7
                                        i32.const 1054033
                                        local.get $l7
                                        select
                                        i32.load8_u
                                        i32.const 192
                                        i32.and
                                        i32.const 128
                                        i32.ne
                                        br_if $B20
                                        local.get $l4
                                        i32.const 2
                                        i32.add
                                        local.set $l4
                                        br $B14
                                      end
                                      local.get $l2
                                      local.get $l4
                                      i32.lt_u
                                      br_if $B2
                                      local.get $l2
                                      local.get $l4
                                      i32.le_u
                                      br_if $B1
                                      local.get $p1
                                      local.get $l8
                                      i32.store
                                      local.get $p0
                                      local.get $l4
                                      i32.store offset=4
                                      local.get $p0
                                      local.get $l3
                                      i32.store
                                      local.get $p1
                                      local.get $l2
                                      local.get $l5
                                      i32.sub
                                      i32.store offset=4
                                      local.get $p0
                                      i32.const 12
                                      i32.add
                                      i32.const 1
                                      i32.store
                                      local.get $p0
                                      i32.const 8
                                      i32.add
                                      local.get $l6
                                      i32.store
                                      return
                                    end
                                    local.get $l3
                                    local.get $l5
                                    i32.add
                                    local.tee $l10
                                    i32.const 0
                                    local.get $l2
                                    local.get $l5
                                    i32.gt_u
                                    select
                                    local.tee $l9
                                    i32.const 1054033
                                    local.get $l9
                                    select
                                    i32.load8_u
                                    local.set $l9
                                    block $B21
                                      block $B22
                                        local.get $l7
                                        i32.const -224
                                        i32.add
                                        local.tee $l7
                                        i32.const 13
                                        i32.gt_u
                                        br_if $B22
                                        block $B23
                                          block $B24
                                            local.get $l7
                                            br_table $B24 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B22 $B23 $B24
                                          end
                                          local.get $l9
                                          i32.const 224
                                          i32.and
                                          i32.const 160
                                          i32.eq
                                          br_if $B21
                                          br $B3
                                        end
                                        local.get $l9
                                        i32.const 24
                                        i32.shl
                                        i32.const 24
                                        i32.shr_s
                                        i32.const -1
                                        i32.gt_s
                                        br_if $B3
                                        local.get $l9
                                        i32.const 255
                                        i32.and
                                        i32.const 160
                                        i32.ge_u
                                        br_if $B3
                                        br $B21
                                      end
                                      block $B25
                                        local.get $l8
                                        i32.const 31
                                        i32.add
                                        i32.const 255
                                        i32.and
                                        i32.const 11
                                        i32.gt_u
                                        br_if $B25
                                        local.get $l9
                                        i32.const 24
                                        i32.shl
                                        i32.const 24
                                        i32.shr_s
                                        i32.const -1
                                        i32.gt_s
                                        br_if $B3
                                        local.get $l9
                                        i32.const 255
                                        i32.and
                                        i32.const 192
                                        i32.ge_u
                                        br_if $B3
                                        br $B21
                                      end
                                      local.get $l9
                                      i32.const 255
                                      i32.and
                                      i32.const 191
                                      i32.gt_u
                                      br_if $B3
                                      local.get $l8
                                      i32.const 254
                                      i32.and
                                      i32.const 238
                                      i32.ne
                                      br_if $B3
                                      local.get $l9
                                      i32.const 24
                                      i32.shl
                                      i32.const 24
                                      i32.shr_s
                                      i32.const -1
                                      i32.gt_s
                                      br_if $B3
                                    end
                                    block $B26
                                      local.get $l3
                                      local.get $l4
                                      i32.const 2
                                      i32.add
                                      local.tee $l5
                                      i32.add
                                      local.tee $l8
                                      i32.const 0
                                      local.get $l2
                                      local.get $l5
                                      i32.gt_u
                                      select
                                      local.tee $l7
                                      i32.const 1054033
                                      local.get $l7
                                      select
                                      i32.load8_u
                                      i32.const 192
                                      i32.and
                                      i32.const 128
                                      i32.ne
                                      br_if $B26
                                      local.get $l4
                                      i32.const 3
                                      i32.add
                                      local.set $l4
                                      br $B14
                                    end
                                    local.get $l2
                                    local.get $l4
                                    i32.lt_u
                                    br_if $B2
                                    local.get $l4
                                    i32.const -3
                                    i32.gt_u
                                    br_if $B10
                                    local.get $l2
                                    local.get $l5
                                    i32.lt_u
                                    br_if $B9
                                    local.get $p1
                                    local.get $l8
                                    i32.store
                                    local.get $p0
                                    local.get $l4
                                    i32.store offset=4
                                    local.get $p0
                                    local.get $l3
                                    i32.store
                                    local.get $p1
                                    local.get $l2
                                    local.get $l5
                                    i32.sub
                                    i32.store offset=4
                                    local.get $p0
                                    i32.const 12
                                    i32.add
                                    i32.const 2
                                    i32.store
                                    local.get $p0
                                    i32.const 8
                                    i32.add
                                    local.get $l6
                                    i32.store
                                    return
                                  end
                                  local.get $l3
                                  local.get $l5
                                  i32.add
                                  local.tee $l10
                                  i32.const 0
                                  local.get $l2
                                  local.get $l5
                                  i32.gt_u
                                  select
                                  local.tee $l9
                                  i32.const 1054033
                                  local.get $l9
                                  select
                                  i32.load8_u
                                  local.set $l9
                                  block $B27
                                    block $B28
                                      local.get $l7
                                      i32.const -240
                                      i32.add
                                      local.tee $l7
                                      i32.const 4
                                      i32.gt_u
                                      br_if $B28
                                      block $B29
                                        block $B30
                                          local.get $l7
                                          br_table $B30 $B28 $B28 $B28 $B29 $B30
                                        end
                                        local.get $l9
                                        i32.const 112
                                        i32.add
                                        i32.const 255
                                        i32.and
                                        i32.const 48
                                        i32.lt_u
                                        br_if $B27
                                        br $B4
                                      end
                                      local.get $l9
                                      i32.const 24
                                      i32.shl
                                      i32.const 24
                                      i32.shr_s
                                      i32.const -1
                                      i32.gt_s
                                      br_if $B4
                                      local.get $l9
                                      i32.const 255
                                      i32.and
                                      i32.const 144
                                      i32.ge_u
                                      br_if $B4
                                      br $B27
                                    end
                                    local.get $l9
                                    i32.const 255
                                    i32.and
                                    i32.const 191
                                    i32.gt_u
                                    br_if $B4
                                    local.get $l8
                                    i32.const 15
                                    i32.add
                                    i32.const 255
                                    i32.and
                                    i32.const 2
                                    i32.gt_u
                                    br_if $B4
                                    local.get $l9
                                    i32.const 24
                                    i32.shl
                                    i32.const 24
                                    i32.shr_s
                                    i32.const -1
                                    i32.gt_s
                                    br_if $B4
                                  end
                                  local.get $l3
                                  local.get $l4
                                  i32.const 2
                                  i32.add
                                  local.tee $l5
                                  i32.add
                                  local.tee $l8
                                  i32.const 0
                                  local.get $l2
                                  local.get $l5
                                  i32.gt_u
                                  select
                                  local.tee $l7
                                  i32.const 1054033
                                  local.get $l7
                                  select
                                  i32.load8_u
                                  i32.const 192
                                  i32.and
                                  i32.const 128
                                  i32.ne
                                  br_if $B12
                                  local.get $l3
                                  local.get $l4
                                  i32.const 3
                                  i32.add
                                  local.tee $l5
                                  i32.add
                                  local.tee $l8
                                  i32.const 0
                                  local.get $l2
                                  local.get $l5
                                  i32.gt_u
                                  select
                                  local.tee $l7
                                  i32.const 1054033
                                  local.get $l7
                                  select
                                  i32.load8_u
                                  i32.const 192
                                  i32.and
                                  i32.const 128
                                  i32.ne
                                  br_if $B11
                                  local.get $l4
                                  i32.const 4
                                  i32.add
                                  local.set $l4
                                end
                                local.get $l4
                                local.get $l2
                                i32.lt_u
                                br_if $L13
                              end
                              local.get $p1
                              i64.const 1
                              i64.store align=4
                              local.get $p0
                              local.get $l2
                              i32.store offset=4
                              local.get $p0
                              local.get $l3
                              i32.store
                              local.get $p0
                              i32.const 8
                              i32.add
                              i64.const 1
                              i64.store align=4
                              return
                            end
                            local.get $l2
                            local.get $l4
                            i32.lt_u
                            br_if $B2
                            local.get $l4
                            i32.const -3
                            i32.gt_u
                            br_if $B8
                            local.get $l2
                            local.get $l5
                            i32.lt_u
                            br_if $B7
                            local.get $p1
                            local.get $l8
                            i32.store
                            local.get $p0
                            local.get $l4
                            i32.store offset=4
                            local.get $p0
                            local.get $l3
                            i32.store
                            local.get $p1
                            local.get $l2
                            local.get $l5
                            i32.sub
                            i32.store offset=4
                            local.get $p0
                            i32.const 12
                            i32.add
                            i32.const 2
                            i32.store
                            local.get $p0
                            i32.const 8
                            i32.add
                            local.get $l6
                            i32.store
                            return
                          end
                          local.get $l2
                          local.get $l4
                          i32.lt_u
                          br_if $B2
                          local.get $l4
                          i32.const -4
                          i32.gt_u
                          br_if $B6
                          local.get $l2
                          local.get $l5
                          i32.lt_u
                          br_if $B5
                          local.get $p1
                          local.get $l8
                          i32.store
                          local.get $p0
                          local.get $l4
                          i32.store offset=4
                          local.get $p0
                          local.get $l3
                          i32.store
                          local.get $p1
                          local.get $l2
                          local.get $l5
                          i32.sub
                          i32.store offset=4
                          local.get $p0
                          i32.const 12
                          i32.add
                          i32.const 3
                          i32.store
                          local.get $p0
                          i32.const 8
                          i32.add
                          local.get $l6
                          i32.store
                          return
                        end
                        local.get $l4
                        local.get $l5
                        call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
                        unreachable
                      end
                      local.get $l5
                      local.get $l2
                      call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
                      unreachable
                    end
                    local.get $l4
                    local.get $l5
                    call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
                    unreachable
                  end
                  local.get $l5
                  local.get $l2
                  call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
                  unreachable
                end
                local.get $l4
                local.get $l5
                call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
                unreachable
              end
              local.get $l5
              local.get $l2
              call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
              unreachable
            end
            local.get $l2
            local.get $l4
            i32.lt_u
            br_if $B2
            local.get $l2
            local.get $l4
            i32.le_u
            br_if $B1
            local.get $p1
            local.get $l10
            i32.store
            local.get $p0
            local.get $l4
            i32.store offset=4
            local.get $p0
            local.get $l3
            i32.store
            local.get $p1
            local.get $l2
            local.get $l5
            i32.sub
            i32.store offset=4
            local.get $p0
            i32.const 12
            i32.add
            i32.const 1
            i32.store
            local.get $p0
            i32.const 8
            i32.add
            local.get $l6
            i32.store
            return
          end
          local.get $l2
          local.get $l4
          i32.lt_u
          br_if $B2
          local.get $l2
          local.get $l4
          i32.le_u
          br_if $B1
          local.get $p1
          local.get $l10
          i32.store
          local.get $p0
          local.get $l4
          i32.store offset=4
          local.get $p0
          local.get $l3
          i32.store
          local.get $p1
          local.get $l2
          local.get $l5
          i32.sub
          i32.store offset=4
          local.get $p0
          i32.const 12
          i32.add
          i32.const 1
          i32.store
          local.get $p0
          i32.const 8
          i32.add
          local.get $l6
          i32.store
          return
        end
        local.get $l4
        local.get $l2
        call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
        unreachable
      end
      local.get $l5
      local.get $l2
      call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
      unreachable
    end
    local.get $p0
    i32.const 0
    i32.store)
  (func $_ZN66_$LT$core..str..lossy..Utf8Lossy$u20$as$u20$core..fmt..Display$GT$3fmt17hb36124806d3524c1E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.eqz
          br_if $B2
          local.get $l3
          local.get $p1
          i32.store offset=12
          local.get $l3
          local.get $p0
          i32.store offset=8
          local.get $l3
          i32.const 16
          i32.add
          local.get $l3
          i32.const 8
          i32.add
          call $_ZN96_$LT$core..str..lossy..Utf8LossyChunksIter$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h61f6ad47ee0a8c50E
          block $B3
            local.get $l3
            i32.load offset=16
            local.tee $p0
            i32.eqz
            br_if $B3
            loop $L4
              local.get $l3
              i32.load offset=28
              local.set $l4
              local.get $l3
              i32.load offset=20
              local.tee $l5
              local.get $p1
              i32.eq
              br_if $B1
              i32.const 1
              local.set $l6
              local.get $p2
              i32.load offset=24
              local.get $p0
              local.get $l5
              local.get $p2
              i32.load offset=28
              i32.load offset=12
              call_indirect (type $t8) $T0
              br_if $B0
              block $B5
                local.get $l4
                i32.eqz
                br_if $B5
                local.get $p2
                i32.load offset=24
                i32.const 65533
                local.get $p2
                i32.load offset=28
                i32.load offset=16
                call_indirect (type $t3) $T0
                br_if $B0
              end
              local.get $l3
              i32.const 16
              i32.add
              local.get $l3
              i32.const 8
              i32.add
              call $_ZN96_$LT$core..str..lossy..Utf8LossyChunksIter$u20$as$u20$core..iter..traits..iterator..Iterator$GT$4next17h61f6ad47ee0a8c50E
              local.get $l3
              i32.load offset=16
              local.tee $p0
              br_if $L4
            end
          end
          i32.const 0
          local.set $l6
          br $B0
        end
        local.get $p2
        i32.const 1054032
        i32.const 0
        call $_ZN4core3fmt9Formatter3pad17h16ea8f5b109745c2E
        local.set $l6
        br $B0
      end
      block $B6
        local.get $l4
        br_if $B6
        local.get $p2
        local.get $p0
        local.get $p1
        call $_ZN4core3fmt9Formatter3pad17h16ea8f5b109745c2E
        local.set $l6
        br $B0
      end
      i32.const 1054572
      i32.const 35
      i32.const 1054632
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $l3
    i32.const 32
    i32.add
    global.set $g0
    local.get $l6)
  (func $_ZN4core7unicode9bool_trie8BoolTrie6lookup17h7906549996b02595E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    block $B0
      block $B1
        local.get $p1
        i32.const 2048
        i32.lt_u
        br_if $B1
        block $B2
          block $B3
            block $B4
              block $B5
                block $B6
                  block $B7
                    local.get $p1
                    i32.const 65536
                    i32.lt_u
                    br_if $B7
                    local.get $p1
                    i32.const 12
                    i32.shr_u
                    i32.const -16
                    i32.add
                    local.tee $l2
                    i32.const 256
                    i32.lt_u
                    br_if $B6
                    i32.const 1055612
                    local.get $l2
                    i32.const 256
                    call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
                    unreachable
                  end
                  local.get $p1
                  i32.const 6
                  i32.shr_u
                  i32.const -32
                  i32.add
                  local.tee $l2
                  i32.const 991
                  i32.gt_u
                  br_if $B5
                  local.get $p0
                  i32.const 260
                  i32.add
                  i32.load
                  local.tee $l3
                  local.get $p0
                  local.get $l2
                  i32.add
                  i32.const 280
                  i32.add
                  i32.load8_u
                  local.tee $l2
                  i32.le_u
                  br_if $B4
                  local.get $p0
                  i32.load offset=256
                  local.get $l2
                  i32.const 3
                  i32.shl
                  i32.add
                  local.set $p0
                  br $B0
                end
                local.get $p0
                local.get $l2
                i32.add
                i32.const 1272
                i32.add
                i32.load8_u
                i32.const 6
                i32.shl
                local.get $p1
                i32.const 6
                i32.shr_u
                i32.const 63
                i32.and
                i32.or
                local.tee $l2
                local.get $p0
                i32.const 268
                i32.add
                i32.load
                local.tee $l3
                i32.ge_u
                br_if $B3
                local.get $p0
                i32.const 276
                i32.add
                i32.load
                local.tee $l3
                local.get $p0
                i32.load offset=264
                local.get $l2
                i32.add
                i32.load8_u
                local.tee $l2
                i32.le_u
                br_if $B2
                local.get $p0
                i32.load offset=272
                local.get $l2
                i32.const 3
                i32.shl
                i32.add
                local.set $p0
                br $B0
              end
              i32.const 1055580
              local.get $l2
              i32.const 992
              call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
              unreachable
            end
            i32.const 1055596
            local.get $l2
            local.get $l3
            call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
            unreachable
          end
          i32.const 1055628
          local.get $l2
          local.get $l3
          call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
          unreachable
        end
        i32.const 1055644
        local.get $l2
        local.get $l3
        call $_ZN4core9panicking18panic_bounds_check17hde92670cc6557f45E
        unreachable
      end
      local.get $p0
      local.get $p1
      i32.const 3
      i32.shr_u
      i32.const 536870904
      i32.and
      i32.add
      local.set $p0
    end
    local.get $p0
    i64.load
    i64.const 1
    local.get $p1
    i32.const 63
    i32.and
    i64.extend_i32_u
    i64.shl
    i64.and
    i64.const 0
    i64.ne)
  (func $_ZN4core7unicode9printable12is_printable17h3288c8d52298f4e7E (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    block $B0
      local.get $p0
      i32.const 65536
      i32.lt_u
      br_if $B0
      block $B1
        block $B2
          local.get $p0
          i32.const 131072
          i32.lt_u
          br_if $B2
          i32.const 0
          local.set $l1
          local.get $p0
          i32.const -195102
          i32.add
          i32.const 722658
          i32.lt_u
          br_if $B1
          local.get $p0
          i32.const -191457
          i32.add
          i32.const 3103
          i32.lt_u
          br_if $B1
          local.get $p0
          i32.const -183970
          i32.add
          i32.const 14
          i32.lt_u
          br_if $B1
          local.get $p0
          i32.const 2097150
          i32.and
          i32.const 178206
          i32.eq
          br_if $B1
          local.get $p0
          i32.const -173783
          i32.add
          i32.const 41
          i32.lt_u
          br_if $B1
          local.get $p0
          i32.const -177973
          i32.add
          i32.const 11
          i32.lt_u
          br_if $B1
          local.get $p0
          i32.const -918000
          i32.add
          i32.const 196111
          i32.gt_u
          return
        end
        local.get $p0
        i32.const 1056349
        i32.const 35
        i32.const 1056419
        i32.const 166
        i32.const 1056585
        i32.const 408
        call $_ZN4core7unicode9printable5check17h8643d82a6d21b7f0E
        local.set $l1
      end
      local.get $l1
      return
    end
    local.get $p0
    i32.const 1055660
    i32.const 41
    i32.const 1055742
    i32.const 293
    i32.const 1056035
    i32.const 314
    call $_ZN4core7unicode9printable5check17h8643d82a6d21b7f0E)
  (func $_ZN4core3str6traits101_$LT$impl$u20$core..slice..SliceIndex$LT$str$GT$$u20$for$u20$core..ops..range..Range$LT$usize$GT$$GT$5index28_$u7b$$u7b$closure$u7d$$u7d$17h2ae8a66587ff8d8eE (type $t1) (param $p0 i32)
    (local $l1 i32)
    local.get $p0
    i32.load
    local.tee $l1
    i32.load
    local.get $l1
    i32.load offset=4
    local.get $p0
    i32.load offset=4
    i32.load
    local.get $p0
    i32.load offset=8
    i32.load
    call $_ZN4core3str16slice_error_fail17he7d77f9d4eaf8572E
    unreachable)
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i8$GT$3fmt17h4742f67e24ed992fE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load8_u
    local.set $l3
    i32.const 0
    local.set $p0
    loop $L0
      local.get $l2
      local.get $p0
      i32.add
      i32.const 127
      i32.add
      local.get $l3
      i32.const 15
      i32.and
      local.tee $l4
      i32.const 48
      i32.or
      local.get $l4
      i32.const 87
      i32.add
      local.get $l4
      i32.const 10
      i32.lt_u
      select
      i32.store8
      local.get $p0
      i32.const -1
      i32.add
      local.set $p0
      local.get $l3
      i32.const 4
      i32.shr_u
      i32.const 15
      i32.and
      local.tee $l3
      br_if $L0
    end
    block $B1
      local.get $p0
      i32.const 128
      i32.add
      local.tee $l3
      i32.const 129
      i32.lt_u
      br_if $B1
      local.get $l3
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $p1
    i32.const 1
    i32.const 1055265
    i32.const 2
    local.get $l2
    local.get $p0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get $p0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
    local.set $p0
    local.get $l2
    i32.const 128
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3str9from_utf817h5f5991ab7674ad2aE (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i64)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l3
    global.set $g0
    local.get $l3
    i32.const 8
    i32.add
    local.get $p1
    local.get $p2
    call $_ZN4core3str19run_utf8_validation17h0f281b6dc9b95555E
    block $B0
      block $B1
        local.get $l3
        i64.load offset=8
        local.tee $l4
        i64.const 1095216660480
        i64.and
        i64.const 8589934592
        i64.eq
        br_if $B1
        local.get $p0
        local.get $l4
        i64.store offset=4 align=4
        i32.const 1
        local.set $p1
        br $B0
      end
      local.get $p0
      local.get $p1
      i32.store offset=4
      local.get $p0
      i32.const 8
      i32.add
      local.get $p2
      i32.store
      i32.const 0
      local.set $p1
    end
    local.get $p0
    local.get $p1
    i32.store
    local.get $l3
    i32.const 16
    i32.add
    global.set $g0)
  (func $_ZN4core3str19run_utf8_validation17h0f281b6dc9b95555E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    block $B0
      block $B1
        block $B2
          local.get $p2
          i32.eqz
          br_if $B2
          i32.const 0
          local.get $p1
          i32.sub
          i32.const 0
          local.get $p1
          i32.const 3
          i32.and
          select
          local.set $l3
          local.get $p2
          i32.const -7
          i32.add
          i32.const 0
          local.get $p2
          i32.const 7
          i32.gt_u
          select
          local.set $l4
          i32.const 0
          local.set $l5
          loop $L3
            block $B4
              block $B5
                block $B6
                  block $B7
                    block $B8
                      local.get $p1
                      local.get $l5
                      i32.add
                      i32.load8_u
                      local.tee $l6
                      i32.const 24
                      i32.shl
                      i32.const 24
                      i32.shr_s
                      local.tee $l7
                      i32.const -1
                      i32.gt_s
                      br_if $B8
                      block $B9
                        block $B10
                          block $B11
                            block $B12
                              local.get $l6
                              i32.const 1054671
                              i32.add
                              i32.load8_u
                              i32.const -2
                              i32.add
                              local.tee $l8
                              i32.const 2
                              i32.gt_u
                              br_if $B12
                              local.get $l8
                              br_table $B11 $B10 $B9 $B11
                            end
                            local.get $p0
                            i32.const 257
                            i32.store16 offset=4
                            local.get $p0
                            local.get $l5
                            i32.store
                            return
                          end
                          block $B13
                            local.get $l5
                            i32.const 1
                            i32.add
                            local.tee $l6
                            local.get $p2
                            i32.lt_u
                            br_if $B13
                            local.get $p0
                            i32.const 0
                            i32.store8 offset=4
                            local.get $p0
                            local.get $l5
                            i32.store
                            return
                          end
                          local.get $p1
                          local.get $l6
                          i32.add
                          i32.load8_u
                          i32.const 192
                          i32.and
                          i32.const 128
                          i32.eq
                          br_if $B7
                          local.get $p0
                          i32.const 257
                          i32.store16 offset=4
                          local.get $p0
                          local.get $l5
                          i32.store
                          return
                        end
                        block $B14
                          local.get $l5
                          i32.const 1
                          i32.add
                          local.tee $l8
                          local.get $p2
                          i32.lt_u
                          br_if $B14
                          local.get $p0
                          i32.const 0
                          i32.store8 offset=4
                          local.get $p0
                          local.get $l5
                          i32.store
                          return
                        end
                        local.get $p1
                        local.get $l8
                        i32.add
                        i32.load8_u
                        local.set $l8
                        block $B15
                          block $B16
                            local.get $l6
                            i32.const -224
                            i32.add
                            local.tee $l6
                            i32.const 13
                            i32.gt_u
                            br_if $B16
                            block $B17
                              block $B18
                                local.get $l6
                                br_table $B18 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B16 $B17 $B18
                              end
                              local.get $l8
                              i32.const 224
                              i32.and
                              i32.const 160
                              i32.ne
                              br_if $B0
                              br $B15
                            end
                            local.get $l8
                            i32.const 24
                            i32.shl
                            i32.const 24
                            i32.shr_s
                            i32.const -1
                            i32.gt_s
                            br_if $B0
                            local.get $l8
                            i32.const 255
                            i32.and
                            i32.const 160
                            i32.lt_u
                            br_if $B15
                            br $B0
                          end
                          block $B19
                            local.get $l7
                            i32.const 31
                            i32.add
                            i32.const 255
                            i32.and
                            i32.const 11
                            i32.gt_u
                            br_if $B19
                            local.get $l8
                            i32.const 24
                            i32.shl
                            i32.const 24
                            i32.shr_s
                            i32.const -1
                            i32.gt_s
                            br_if $B0
                            local.get $l8
                            i32.const 255
                            i32.and
                            i32.const 192
                            i32.ge_u
                            br_if $B0
                            br $B15
                          end
                          local.get $l8
                          i32.const 255
                          i32.and
                          i32.const 191
                          i32.gt_u
                          br_if $B0
                          local.get $l7
                          i32.const 254
                          i32.and
                          i32.const 238
                          i32.ne
                          br_if $B0
                          local.get $l8
                          i32.const 24
                          i32.shl
                          i32.const 24
                          i32.shr_s
                          i32.const -1
                          i32.gt_s
                          br_if $B0
                        end
                        block $B20
                          local.get $l5
                          i32.const 2
                          i32.add
                          local.tee $l6
                          local.get $p2
                          i32.lt_u
                          br_if $B20
                          local.get $p0
                          i32.const 0
                          i32.store8 offset=4
                          local.get $p0
                          local.get $l5
                          i32.store
                          return
                        end
                        local.get $p1
                        local.get $l6
                        i32.add
                        i32.load8_u
                        i32.const 192
                        i32.and
                        i32.const 128
                        i32.eq
                        br_if $B7
                        local.get $p0
                        i32.const 513
                        i32.store16 offset=4
                        local.get $p0
                        local.get $l5
                        i32.store
                        return
                      end
                      block $B21
                        local.get $l5
                        i32.const 1
                        i32.add
                        local.tee $l8
                        local.get $p2
                        i32.lt_u
                        br_if $B21
                        local.get $p0
                        i32.const 0
                        i32.store8 offset=4
                        local.get $p0
                        local.get $l5
                        i32.store
                        return
                      end
                      local.get $p1
                      local.get $l8
                      i32.add
                      i32.load8_u
                      local.set $l8
                      block $B22
                        block $B23
                          local.get $l6
                          i32.const -240
                          i32.add
                          local.tee $l6
                          i32.const 4
                          i32.gt_u
                          br_if $B23
                          block $B24
                            block $B25
                              local.get $l6
                              br_table $B25 $B23 $B23 $B23 $B24 $B25
                            end
                            local.get $l8
                            i32.const 112
                            i32.add
                            i32.const 255
                            i32.and
                            i32.const 48
                            i32.ge_u
                            br_if $B1
                            br $B22
                          end
                          local.get $l8
                          i32.const 24
                          i32.shl
                          i32.const 24
                          i32.shr_s
                          i32.const -1
                          i32.gt_s
                          br_if $B1
                          local.get $l8
                          i32.const 255
                          i32.and
                          i32.const 144
                          i32.lt_u
                          br_if $B22
                          br $B1
                        end
                        local.get $l8
                        i32.const 255
                        i32.and
                        i32.const 191
                        i32.gt_u
                        br_if $B1
                        local.get $l7
                        i32.const 15
                        i32.add
                        i32.const 255
                        i32.and
                        i32.const 2
                        i32.gt_u
                        br_if $B1
                        local.get $l8
                        i32.const 24
                        i32.shl
                        i32.const 24
                        i32.shr_s
                        i32.const -1
                        i32.gt_s
                        br_if $B1
                      end
                      block $B26
                        local.get $l5
                        i32.const 2
                        i32.add
                        local.tee $l6
                        local.get $p2
                        i32.lt_u
                        br_if $B26
                        local.get $p0
                        i32.const 0
                        i32.store8 offset=4
                        local.get $p0
                        local.get $l5
                        i32.store
                        return
                      end
                      local.get $p1
                      local.get $l6
                      i32.add
                      i32.load8_u
                      i32.const 192
                      i32.and
                      i32.const 128
                      i32.ne
                      br_if $B6
                      block $B27
                        local.get $l5
                        i32.const 3
                        i32.add
                        local.tee $l6
                        local.get $p2
                        i32.lt_u
                        br_if $B27
                        local.get $p0
                        i32.const 0
                        i32.store8 offset=4
                        local.get $p0
                        local.get $l5
                        i32.store
                        return
                      end
                      local.get $p1
                      local.get $l6
                      i32.add
                      i32.load8_u
                      i32.const 192
                      i32.and
                      i32.const 128
                      i32.eq
                      br_if $B7
                      local.get $p0
                      i32.const 769
                      i32.store16 offset=4
                      local.get $p0
                      local.get $l5
                      i32.store
                      return
                    end
                    local.get $l3
                    local.get $l5
                    i32.sub
                    i32.const 3
                    i32.and
                    br_if $B5
                    block $B28
                      local.get $l5
                      local.get $l4
                      i32.ge_u
                      br_if $B28
                      loop $L29
                        local.get $p1
                        local.get $l5
                        i32.add
                        local.tee $l6
                        i32.const 4
                        i32.add
                        i32.load
                        local.get $l6
                        i32.load
                        i32.or
                        i32.const -2139062144
                        i32.and
                        br_if $B28
                        local.get $l5
                        i32.const 8
                        i32.add
                        local.tee $l5
                        local.get $l4
                        i32.lt_u
                        br_if $L29
                      end
                    end
                    local.get $l5
                    local.get $p2
                    i32.ge_u
                    br_if $B4
                    loop $L30
                      local.get $p1
                      local.get $l5
                      i32.add
                      i32.load8_s
                      i32.const 0
                      i32.lt_s
                      br_if $B4
                      local.get $p2
                      local.get $l5
                      i32.const 1
                      i32.add
                      local.tee $l5
                      i32.ne
                      br_if $L30
                      br $B2
                    end
                  end
                  local.get $l6
                  i32.const 1
                  i32.add
                  local.set $l5
                  br $B4
                end
                local.get $p0
                i32.const 513
                i32.store16 offset=4
                local.get $p0
                local.get $l5
                i32.store
                return
              end
              local.get $l5
              i32.const 1
              i32.add
              local.set $l5
            end
            local.get $l5
            local.get $p2
            i32.lt_u
            br_if $L3
          end
        end
        local.get $p0
        i32.const 2
        i32.store8 offset=4
        return
      end
      local.get $p0
      i32.const 257
      i32.store16 offset=4
      local.get $p0
      local.get $l5
      i32.store
      return
    end
    local.get $p0
    i32.const 257
    i32.store16 offset=4
    local.get $p0
    local.get $l5
    i32.store)
  (func $_ZN4core3fmt3num3imp51_$LT$impl$u20$core..fmt..Display$u20$for$u20$u8$GT$3fmt17h1c6088ff968b7edaE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i64.load8_u
    i32.const 1
    local.get $p1
    call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE)
  (func $_ZN4core3fmt8builders10DebugInner5entry17h2c56fcfe0f664431E (type $t6) (param $p0 i32) (param $p1 i32) (param $p2 i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64) (local $l7 i64) (local $l8 i64) (local $l9 i64) (local $l10 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 1
    local.set $l4
    block $B0
      local.get $p0
      i32.load8_u offset=4
      br_if $B0
      local.get $p0
      i32.load8_u offset=5
      local.set $l4
      block $B1
        local.get $p0
        i32.load
        local.tee $l5
        i32.load8_u
        i32.const 4
        i32.and
        br_if $B1
        block $B2
          local.get $l4
          i32.const 255
          i32.and
          i32.eqz
          br_if $B2
          i32.const 1
          local.set $l4
          local.get $l5
          i32.load offset=24
          i32.const 1055233
          i32.const 2
          local.get $l5
          i32.const 28
          i32.add
          i32.load
          i32.load offset=12
          call_indirect (type $t8) $T0
          br_if $B0
          local.get $p0
          i32.load
          local.set $l5
        end
        local.get $p1
        local.get $l5
        local.get $p2
        i32.load offset=12
        call_indirect (type $t3) $T0
        local.set $l4
        br $B0
      end
      block $B3
        local.get $l4
        i32.const 255
        i32.and
        br_if $B3
        i32.const 1
        local.set $l4
        local.get $l5
        i32.load offset=24
        i32.const 1055245
        i32.const 1
        local.get $l5
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        local.get $p0
        i32.load
        local.set $l5
      end
      i32.const 1
      local.set $l4
      local.get $l3
      i32.const 1
      i32.store8 offset=23
      local.get $l3
      local.get $l3
      i32.const 23
      i32.add
      i32.store offset=16
      local.get $l5
      i64.load offset=8 align=4
      local.set $l6
      local.get $l5
      i64.load offset=16 align=4
      local.set $l7
      local.get $l3
      i32.const 52
      i32.add
      i32.const 1055200
      i32.store
      local.get $l3
      local.get $l5
      i64.load offset=24 align=4
      i64.store offset=8
      local.get $l5
      i64.load offset=32 align=4
      local.set $l8
      local.get $l5
      i64.load offset=40 align=4
      local.set $l9
      local.get $l3
      local.get $l5
      i32.load8_u offset=48
      i32.store8 offset=72
      local.get $l5
      i64.load align=4
      local.set $l10
      local.get $l3
      local.get $l9
      i64.store offset=64
      local.get $l3
      local.get $l8
      i64.store offset=56
      local.get $l3
      local.get $l7
      i64.store offset=40
      local.get $l3
      local.get $l6
      i64.store offset=32
      local.get $l3
      local.get $l10
      i64.store offset=24
      local.get $l3
      local.get $l3
      i32.const 8
      i32.add
      i32.store offset=48
      local.get $p1
      local.get $l3
      i32.const 24
      i32.add
      local.get $p2
      i32.load offset=12
      call_indirect (type $t3) $T0
      br_if $B0
      local.get $l3
      i32.load offset=48
      i32.const 1055231
      i32.const 2
      local.get $l3
      i32.load offset=52
      i32.load offset=12
      call_indirect (type $t8) $T0
      local.set $l4
    end
    local.get $p0
    i32.const 1
    i32.store8 offset=5
    local.get $p0
    local.get $l4
    i32.store8 offset=4
    local.get $l3
    i32.const 80
    i32.add
    global.set $g0)
  (func $_ZN41_$LT$char$u20$as$u20$core..fmt..Debug$GT$3fmt17h7fd369d89fa9ff68E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i64)
    i32.const 1
    local.set $l2
    block $B0
      local.get $p1
      i32.load offset=24
      i32.const 39
      local.get $p1
      i32.const 28
      i32.add
      i32.load
      i32.load offset=16
      call_indirect (type $t3) $T0
      br_if $B0
      i32.const 2
      local.set $l3
      block $B1
        block $B2
          block $B3
            block $B4
              block $B5
                local.get $p0
                i32.load
                local.tee $p0
                i32.const -9
                i32.add
                local.tee $l4
                i32.const 30
                i32.le_u
                br_if $B5
                local.get $p0
                i32.const 92
                i32.ne
                br_if $B4
                br $B3
              end
              i32.const 116
              local.set $l5
              block $B6
                block $B7
                  local.get $l4
                  br_table $B1 $B6 $B4 $B4 $B7 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B4 $B3 $B4 $B4 $B4 $B4 $B3 $B1
                end
                i32.const 114
                local.set $l5
                br $B1
              end
              i32.const 110
              local.set $l5
              br $B1
            end
            block $B8
              block $B9
                block $B10
                  i32.const 1058568
                  local.get $p0
                  call $_ZN4core7unicode9bool_trie8BoolTrie6lookup17h7906549996b02595E
                  br_if $B10
                  local.get $p0
                  call $_ZN4core7unicode9printable12is_printable17h3288c8d52298f4e7E
                  i32.eqz
                  br_if $B9
                  i32.const 1
                  local.set $l3
                  br $B2
                end
                local.get $p0
                i32.const 1
                i32.or
                i32.clz
                i32.const 2
                i32.shr_u
                i32.const 7
                i32.xor
                i64.extend_i32_u
                i64.const 21474836480
                i64.or
                local.set $l6
                br $B8
              end
              local.get $p0
              i32.const 1
              i32.or
              i32.clz
              i32.const 2
              i32.shr_u
              i32.const 7
              i32.xor
              i64.extend_i32_u
              i64.const 21474836480
              i64.or
              local.set $l6
            end
            i32.const 3
            local.set $l3
            br $B2
          end
        end
        local.get $p0
        local.set $l5
      end
      loop $L11
        local.get $l3
        local.set $l4
        i32.const 92
        local.set $p0
        i32.const 1
        local.set $l2
        i32.const 1
        local.set $l3
        block $B12
          block $B13
            block $B14
              block $B15
                local.get $l4
                br_table $B14 $B13 $B12 $B15 $B14
              end
              block $B16
                block $B17
                  block $B18
                    block $B19
                      block $B20
                        local.get $l6
                        i64.const 32
                        i64.shr_u
                        i32.wrap_i64
                        i32.const 255
                        i32.and
                        br_table $B14 $B16 $B17 $B18 $B19 $B20 $B14
                      end
                      local.get $l6
                      i64.const -1095216660481
                      i64.and
                      i64.const 17179869184
                      i64.or
                      local.set $l6
                      i32.const 3
                      local.set $l3
                      br $B12
                    end
                    local.get $l6
                    i64.const -1095216660481
                    i64.and
                    i64.const 12884901888
                    i64.or
                    local.set $l6
                    i32.const 117
                    local.set $p0
                    i32.const 3
                    local.set $l3
                    br $B12
                  end
                  local.get $l6
                  i64.const -1095216660481
                  i64.and
                  i64.const 8589934592
                  i64.or
                  local.set $l6
                  i32.const 123
                  local.set $p0
                  i32.const 3
                  local.set $l3
                  br $B12
                end
                local.get $l5
                local.get $l6
                i32.wrap_i64
                local.tee $l4
                i32.const 2
                i32.shl
                i32.const 28
                i32.and
                i32.shr_u
                i32.const 15
                i32.and
                local.tee $l3
                i32.const 48
                i32.or
                local.get $l3
                i32.const 87
                i32.add
                local.get $l3
                i32.const 10
                i32.lt_u
                select
                local.set $p0
                block $B21
                  local.get $l4
                  i32.eqz
                  br_if $B21
                  local.get $l6
                  i64.const -1
                  i64.add
                  i64.const 4294967295
                  i64.and
                  local.get $l6
                  i64.const -4294967296
                  i64.and
                  i64.or
                  local.set $l6
                  i32.const 3
                  local.set $l3
                  br $B12
                end
                local.get $l6
                i64.const -1095216660481
                i64.and
                i64.const 4294967296
                i64.or
                local.set $l6
                i32.const 3
                local.set $l3
                br $B12
              end
              local.get $l6
              i64.const -1095216660481
              i64.and
              local.set $l6
              i32.const 125
              local.set $p0
              i32.const 3
              local.set $l3
              br $B12
            end
            local.get $p1
            i32.load offset=24
            i32.const 39
            local.get $p1
            i32.load offset=28
            i32.load offset=16
            call_indirect (type $t3) $T0
            return
          end
          i32.const 0
          local.set $l3
          local.get $l5
          local.set $p0
        end
        local.get $p1
        i32.load offset=24
        local.get $p0
        local.get $p1
        i32.load offset=28
        i32.load offset=16
        call_indirect (type $t3) $T0
        i32.eqz
        br_if $L11
      end
    end
    local.get $l2)
  (func $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    block $B0
      block $B1
        local.get $p2
        br_if $B1
        i32.const 0
        local.set $l4
        br $B0
      end
      local.get $l3
      i32.const 40
      i32.add
      local.set $l5
      block $B2
        block $B3
          block $B4
            block $B5
              loop $L6
                block $B7
                  local.get $p0
                  i32.load offset=8
                  i32.load8_u
                  i32.eqz
                  br_if $B7
                  local.get $p0
                  i32.load
                  i32.const 1055224
                  i32.const 4
                  local.get $p0
                  i32.load offset=4
                  i32.load offset=12
                  call_indirect (type $t8) $T0
                  br_if $B2
                end
                local.get $l3
                i32.const 10
                i32.store offset=40
                local.get $l3
                i64.const 4294967306
                i64.store offset=32
                local.get $l3
                local.get $p2
                i32.store offset=28
                local.get $l3
                i32.const 0
                i32.store offset=24
                local.get $l3
                local.get $p2
                i32.store offset=20
                local.get $l3
                local.get $p1
                i32.store offset=16
                local.get $l3
                i32.const 8
                i32.add
                i32.const 10
                local.get $p1
                local.get $p2
                call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
                block $B8
                  block $B9
                    block $B10
                      block $B11
                        local.get $l3
                        i32.load offset=8
                        i32.const 1
                        i32.ne
                        br_if $B11
                        local.get $l3
                        i32.load offset=12
                        local.set $l4
                        loop $L12
                          local.get $l3
                          local.get $l4
                          local.get $l3
                          i32.load offset=24
                          i32.add
                          i32.const 1
                          i32.add
                          local.tee $l4
                          i32.store offset=24
                          block $B13
                            block $B14
                              local.get $l4
                              local.get $l3
                              i32.load offset=36
                              local.tee $l6
                              i32.ge_u
                              br_if $B14
                              local.get $l3
                              i32.load offset=20
                              local.set $l7
                              br $B13
                            end
                            local.get $l3
                            i32.load offset=20
                            local.tee $l7
                            local.get $l4
                            i32.lt_u
                            br_if $B13
                            local.get $l6
                            i32.const 5
                            i32.ge_u
                            br_if $B5
                            local.get $l3
                            i32.load offset=16
                            local.get $l4
                            local.get $l6
                            i32.sub
                            local.tee $l8
                            i32.add
                            local.tee $l9
                            local.get $l5
                            i32.eq
                            br_if $B9
                            local.get $l9
                            local.get $l5
                            local.get $l6
                            call $memcmp
                            i32.eqz
                            br_if $B9
                          end
                          local.get $l3
                          i32.load offset=28
                          local.tee $l9
                          local.get $l4
                          i32.lt_u
                          br_if $B10
                          local.get $l7
                          local.get $l9
                          i32.lt_u
                          br_if $B10
                          local.get $l3
                          local.get $l6
                          local.get $l3
                          i32.const 16
                          i32.add
                          i32.add
                          i32.const 23
                          i32.add
                          i32.load8_u
                          local.get $l3
                          i32.load offset=16
                          local.get $l4
                          i32.add
                          local.get $l9
                          local.get $l4
                          i32.sub
                          call $_ZN4core5slice6memchr6memchr17h68964255420bd3dcE
                          local.get $l3
                          i32.load offset=4
                          local.set $l4
                          local.get $l3
                          i32.load
                          i32.const 1
                          i32.eq
                          br_if $L12
                        end
                      end
                      local.get $l3
                      local.get $l3
                      i32.load offset=28
                      i32.store offset=24
                    end
                    local.get $p0
                    i32.load offset=8
                    i32.const 0
                    i32.store8
                    local.get $p2
                    local.set $l4
                    br $B8
                  end
                  local.get $p0
                  i32.load offset=8
                  i32.const 1
                  i32.store8
                  local.get $l8
                  i32.const 1
                  i32.add
                  local.set $l4
                end
                local.get $p0
                i32.load offset=4
                local.set $l9
                local.get $p0
                i32.load
                local.set $l6
                block $B15
                  local.get $l4
                  i32.eqz
                  local.get $p2
                  local.get $l4
                  i32.eq
                  i32.or
                  local.tee $l7
                  br_if $B15
                  local.get $p2
                  local.get $l4
                  i32.le_u
                  br_if $B4
                  local.get $p1
                  local.get $l4
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.le_s
                  br_if $B4
                end
                local.get $l6
                local.get $p1
                local.get $l4
                local.get $l9
                i32.load offset=12
                call_indirect (type $t8) $T0
                br_if $B2
                block $B16
                  local.get $l7
                  br_if $B16
                  local.get $p2
                  local.get $l4
                  i32.le_u
                  br_if $B3
                  local.get $p1
                  local.get $l4
                  i32.add
                  i32.load8_s
                  i32.const -65
                  i32.le_s
                  br_if $B3
                end
                local.get $p1
                local.get $l4
                i32.add
                local.set $p1
                local.get $p2
                local.get $l4
                i32.sub
                local.tee $p2
                br_if $L6
              end
              i32.const 0
              local.set $l4
              br $B0
            end
            local.get $l6
            i32.const 4
            call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
            unreachable
          end
          local.get $p1
          local.get $p2
          i32.const 0
          local.get $l4
          call $_ZN4core3str16slice_error_fail17he7d77f9d4eaf8572E
          unreachable
        end
        local.get $p1
        local.get $p2
        local.get $l4
        local.get $p2
        call $_ZN4core3str16slice_error_fail17he7d77f9d4eaf8572E
        unreachable
      end
      i32.const 1
      local.set $l4
    end
    local.get $l3
    i32.const 48
    i32.add
    global.set $g0
    local.get $l4)
  (func $_ZN4core3fmt8builders10DebugTuple5field17hdc280f3f5bcd284bE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i64) (local $l8 i64) (local $l9 i64) (local $l10 i64) (local $l11 i64)
    global.get $g0
    i32.const 80
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 1
    local.set $l4
    block $B0
      local.get $p0
      i32.load8_u offset=8
      br_if $B0
      local.get $p0
      i32.load offset=4
      local.set $l5
      block $B1
        local.get $p0
        i32.load
        local.tee $l6
        i32.load8_u
        i32.const 4
        i32.and
        br_if $B1
        i32.const 1
        local.set $l4
        local.get $l6
        i32.load offset=24
        i32.const 1055233
        i32.const 1055243
        local.get $l5
        select
        i32.const 2
        i32.const 1
        local.get $l5
        select
        local.get $l6
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        local.get $p1
        local.get $p0
        i32.load
        local.get $p2
        i32.load offset=12
        call_indirect (type $t3) $T0
        local.set $l4
        br $B0
      end
      block $B2
        local.get $l5
        br_if $B2
        i32.const 1
        local.set $l4
        local.get $l6
        i32.load offset=24
        i32.const 1055241
        i32.const 2
        local.get $l6
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B0
        local.get $p0
        i32.load
        local.set $l6
      end
      i32.const 1
      local.set $l4
      local.get $l3
      i32.const 1
      i32.store8 offset=23
      local.get $l3
      local.get $l3
      i32.const 23
      i32.add
      i32.store offset=16
      local.get $l6
      i64.load offset=8 align=4
      local.set $l7
      local.get $l6
      i64.load offset=16 align=4
      local.set $l8
      local.get $l3
      i32.const 52
      i32.add
      i32.const 1055200
      i32.store
      local.get $l3
      local.get $l6
      i64.load offset=24 align=4
      i64.store offset=8
      local.get $l6
      i64.load offset=32 align=4
      local.set $l9
      local.get $l6
      i64.load offset=40 align=4
      local.set $l10
      local.get $l3
      local.get $l6
      i32.load8_u offset=48
      i32.store8 offset=72
      local.get $l6
      i64.load align=4
      local.set $l11
      local.get $l3
      local.get $l10
      i64.store offset=64
      local.get $l3
      local.get $l9
      i64.store offset=56
      local.get $l3
      local.get $l8
      i64.store offset=40
      local.get $l3
      local.get $l7
      i64.store offset=32
      local.get $l3
      local.get $l11
      i64.store offset=24
      local.get $l3
      local.get $l3
      i32.const 8
      i32.add
      i32.store offset=48
      local.get $p1
      local.get $l3
      i32.const 24
      i32.add
      local.get $p2
      i32.load offset=12
      call_indirect (type $t3) $T0
      br_if $B0
      local.get $l3
      i32.load offset=48
      i32.const 1055231
      i32.const 2
      local.get $l3
      i32.load offset=52
      i32.load offset=12
      call_indirect (type $t8) $T0
      local.set $l4
    end
    local.get $p0
    local.get $l4
    i32.store8 offset=8
    local.get $p0
    local.get $p0
    i32.load offset=4
    i32.const 1
    i32.add
    i32.store offset=4
    local.get $l3
    i32.const 80
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3fmt8builders10DebugTuple6finish17h7c2a8b3deddc969cE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32) (local $l2 i32) (local $l3 i32)
    local.get $p0
    i32.load8_u offset=8
    local.set $l1
    block $B0
      local.get $p0
      i32.load offset=4
      local.tee $l2
      i32.eqz
      br_if $B0
      local.get $l1
      i32.const 255
      i32.and
      local.set $l3
      i32.const 1
      local.set $l1
      block $B1
        local.get $l3
        br_if $B1
        block $B2
          local.get $l2
          i32.const 1
          i32.ne
          br_if $B2
          local.get $p0
          i32.load8_u offset=9
          i32.eqz
          br_if $B2
          local.get $p0
          i32.load
          local.tee $l3
          i32.load8_u
          i32.const 4
          i32.and
          br_if $B2
          i32.const 1
          local.set $l1
          local.get $l3
          i32.load offset=24
          i32.const 1055244
          i32.const 1
          local.get $l3
          i32.const 28
          i32.add
          i32.load
          i32.load offset=12
          call_indirect (type $t8) $T0
          br_if $B1
        end
        local.get $p0
        i32.load
        local.tee $l1
        i32.load offset=24
        i32.const 1054648
        i32.const 1
        local.get $l1
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        local.set $l1
      end
      local.get $p0
      local.get $l1
      i32.store8 offset=8
    end
    local.get $l1
    i32.const 255
    i32.and
    i32.const 0
    i32.ne)
  (func $_ZN4core3fmt8builders8DebugSet5entry17h07b93b5671a0989dE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p0
    local.get $p1
    local.get $p2
    call $_ZN4core3fmt8builders10DebugInner5entry17h2c56fcfe0f664431E
    local.get $p0)
  (func $_ZN4core3fmt8builders9DebugList6finish17hf2c27932dd4a79beE (type $t7) (param $p0 i32) (result i32)
    (local $l1 i32)
    i32.const 1
    local.set $l1
    block $B0
      local.get $p0
      i32.load8_u offset=4
      br_if $B0
      local.get $p0
      i32.load
      local.tee $p0
      i32.load offset=24
      i32.const 1055264
      i32.const 1
      local.get $p0
      i32.const 28
      i32.add
      i32.load
      i32.load offset=12
      call_indirect (type $t8) $T0
      local.set $l1
    end
    local.get $l1)
  (func $_ZN4core3fmt5Write10write_char17hb5290cf8c98d3d42E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    i32.const 0
    i32.store offset=12
    block $B0
      block $B1
        block $B2
          local.get $p1
          i32.const 128
          i32.lt_u
          br_if $B2
          local.get $p1
          i32.const 2048
          i32.lt_u
          br_if $B1
          block $B3
            local.get $p1
            i32.const 65536
            i32.ge_u
            br_if $B3
            local.get $l2
            local.get $p1
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=14
            local.get $l2
            local.get $p1
            i32.const 6
            i32.shr_u
            i32.const 63
            i32.and
            i32.const 128
            i32.or
            i32.store8 offset=13
            local.get $l2
            local.get $p1
            i32.const 12
            i32.shr_u
            i32.const 15
            i32.and
            i32.const 224
            i32.or
            i32.store8 offset=12
            i32.const 3
            local.set $p1
            br $B0
          end
          local.get $l2
          local.get $p1
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=15
          local.get $l2
          local.get $p1
          i32.const 18
          i32.shr_u
          i32.const 240
          i32.or
          i32.store8 offset=12
          local.get $l2
          local.get $p1
          i32.const 6
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=14
          local.get $l2
          local.get $p1
          i32.const 12
          i32.shr_u
          i32.const 63
          i32.and
          i32.const 128
          i32.or
          i32.store8 offset=13
          i32.const 4
          local.set $p1
          br $B0
        end
        local.get $l2
        local.get $p1
        i32.store8 offset=12
        i32.const 1
        local.set $p1
        br $B0
      end
      local.get $l2
      local.get $p1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      i32.store8 offset=13
      local.get $l2
      local.get $p1
      i32.const 6
      i32.shr_u
      i32.const 31
      i32.and
      i32.const 192
      i32.or
      i32.store8 offset=12
      i32.const 2
      local.set $p1
    end
    local.get $p0
    local.get $l2
    i32.const 12
    i32.add
    local.get $p1
    call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E
    local.set $p1
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN4core3fmt5Write9write_fmt17h31215b633a85eefaE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1055468
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h070cb47e5bb2d696E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    local.get $p2
    call $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h6f79f869ac97e6d1E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN4core3fmt5Write10write_char17hb5290cf8c98d3d42E)
  (func $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hd148da967c08c97bE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $l2
    local.get $p0
    i32.load
    i32.store offset=4
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $l2
    i32.const 4
    i32.add
    i32.const 1055468
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN4core3fmt10ArgumentV110show_usize17h3e252c9903987f5fE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i64.load32_u
    i32.const 1
    local.get $p1
    call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE)
  (func $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE (type $t13) (param $p0 i64) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i64) (local $l6 i32) (local $l7 i32) (local $l8 i32)
    global.get $g0
    i32.const 48
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 39
    local.set $l4
    block $B0
      block $B1
        local.get $p0
        i64.const 10000
        i64.ge_u
        br_if $B1
        local.get $p0
        local.set $l5
        br $B0
      end
      i32.const 39
      local.set $l4
      loop $L2
        local.get $l3
        i32.const 9
        i32.add
        local.get $l4
        i32.add
        local.tee $l6
        i32.const -4
        i32.add
        local.get $p0
        local.get $p0
        i64.const 10000
        i64.div_u
        local.tee $l5
        i64.const 10000
        i64.mul
        i64.sub
        i32.wrap_i64
        local.tee $l7
        i32.const 65535
        i32.and
        i32.const 100
        i32.div_u
        local.tee $l8
        i32.const 1
        i32.shl
        i32.const 1055267
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get $l6
        i32.const -2
        i32.add
        local.get $l7
        local.get $l8
        i32.const 100
        i32.mul
        i32.sub
        i32.const 65535
        i32.and
        i32.const 1
        i32.shl
        i32.const 1055267
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        local.get $l4
        i32.const -4
        i32.add
        local.set $l4
        local.get $p0
        i64.const 99999999
        i64.gt_u
        local.set $l6
        local.get $l5
        local.set $p0
        local.get $l6
        br_if $L2
      end
    end
    block $B3
      local.get $l5
      i32.wrap_i64
      local.tee $l6
      i32.const 99
      i32.le_s
      br_if $B3
      local.get $l3
      i32.const 9
      i32.add
      local.get $l4
      i32.const -2
      i32.add
      local.tee $l4
      i32.add
      local.get $l5
      i32.wrap_i64
      local.tee $l6
      local.get $l6
      i32.const 65535
      i32.and
      i32.const 100
      i32.div_u
      local.tee $l6
      i32.const 100
      i32.mul
      i32.sub
      i32.const 65535
      i32.and
      i32.const 1
      i32.shl
      i32.const 1055267
      i32.add
      i32.load16_u align=1
      i32.store16 align=1
    end
    block $B4
      block $B5
        local.get $l6
        i32.const 10
        i32.lt_s
        br_if $B5
        local.get $l3
        i32.const 9
        i32.add
        local.get $l4
        i32.const -2
        i32.add
        local.tee $l4
        i32.add
        local.get $l6
        i32.const 1
        i32.shl
        i32.const 1055267
        i32.add
        i32.load16_u align=1
        i32.store16 align=1
        br $B4
      end
      local.get $l3
      i32.const 9
      i32.add
      local.get $l4
      i32.const -1
      i32.add
      local.tee $l4
      i32.add
      local.get $l6
      i32.const 48
      i32.add
      i32.store8
    end
    local.get $p2
    local.get $p1
    i32.const 1054032
    i32.const 0
    local.get $l3
    i32.const 9
    i32.add
    local.get $l4
    i32.add
    i32.const 39
    local.get $l4
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
    local.set $l4
    local.get $l3
    i32.const 48
    i32.add
    global.set $g0
    local.get $l4)
  (func $_ZN59_$LT$core..fmt..Arguments$u20$as$u20$core..fmt..Display$GT$3fmt17hf64092988781d3dbE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    local.set $l3
    local.get $p1
    i32.load offset=24
    local.set $p1
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p0
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p0
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p0
    i64.load align=4
    i64.store offset=8
    local.get $p1
    local.get $l3
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p0
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E (type $t14) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32) (param $p5 i32) (result i32)
    (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32)
    block $B0
      block $B1
        local.get $p1
        i32.eqz
        br_if $B1
        i32.const 43
        i32.const 1114112
        local.get $p0
        i32.load
        local.tee $l6
        i32.const 1
        i32.and
        local.tee $p1
        select
        local.set $l7
        local.get $p1
        local.get $p5
        i32.add
        local.set $l8
        br $B0
      end
      local.get $p5
      i32.const 1
      i32.add
      local.set $l8
      local.get $p0
      i32.load
      local.set $l6
      i32.const 45
      local.set $l7
    end
    block $B2
      block $B3
        local.get $l6
        i32.const 4
        i32.and
        br_if $B3
        i32.const 0
        local.set $p2
        br $B2
      end
      i32.const 0
      local.set $l9
      block $B4
        local.get $p3
        i32.eqz
        br_if $B4
        local.get $p3
        local.set $l10
        local.get $p2
        local.set $p1
        loop $L5
          local.get $l9
          local.get $p1
          i32.load8_u
          i32.const 192
          i32.and
          i32.const 128
          i32.eq
          i32.add
          local.set $l9
          local.get $p1
          i32.const 1
          i32.add
          local.set $p1
          local.get $l10
          i32.const -1
          i32.add
          local.tee $l10
          br_if $L5
        end
      end
      local.get $l8
      local.get $p3
      i32.add
      local.get $l9
      i32.sub
      local.set $l8
    end
    i32.const 1
    local.set $p1
    block $B6
      block $B7
        local.get $p0
        i32.load offset=8
        i32.const 1
        i32.eq
        br_if $B7
        local.get $p0
        local.get $l7
        local.get $p2
        local.get $p3
        call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17h23eac09b544bf16eE
        br_if $B6
        local.get $p0
        i32.load offset=24
        local.get $p4
        local.get $p5
        local.get $p0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        return
      end
      block $B8
        local.get $p0
        i32.const 12
        i32.add
        i32.load
        local.tee $l9
        local.get $l8
        i32.gt_u
        br_if $B8
        local.get $p0
        local.get $l7
        local.get $p2
        local.get $p3
        call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17h23eac09b544bf16eE
        br_if $B6
        local.get $p0
        i32.load offset=24
        local.get $p4
        local.get $p5
        local.get $p0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        return
      end
      block $B9
        block $B10
          local.get $l6
          i32.const 8
          i32.and
          br_if $B10
          i32.const 0
          local.set $p1
          local.get $l9
          local.get $l8
          i32.sub
          local.tee $l9
          local.set $l8
          block $B11
            block $B12
              block $B13
                i32.const 1
                local.get $p0
                i32.load8_u offset=48
                local.tee $l10
                local.get $l10
                i32.const 3
                i32.eq
                select
                br_table $B11 $B12 $B13 $B12 $B11
              end
              local.get $l9
              i32.const 1
              i32.shr_u
              local.set $p1
              local.get $l9
              i32.const 1
              i32.add
              i32.const 1
              i32.shr_u
              local.set $l8
              br $B11
            end
            i32.const 0
            local.set $l8
            local.get $l9
            local.set $p1
          end
          local.get $p1
          i32.const 1
          i32.add
          local.set $p1
          loop $L14
            local.get $p1
            i32.const -1
            i32.add
            local.tee $p1
            i32.eqz
            br_if $B9
            local.get $p0
            i32.load offset=24
            local.get $p0
            i32.load offset=4
            local.get $p0
            i32.load offset=28
            i32.load offset=16
            call_indirect (type $t3) $T0
            i32.eqz
            br_if $L14
          end
          i32.const 1
          return
        end
        i32.const 1
        local.set $p1
        local.get $p0
        i32.const 1
        i32.store8 offset=48
        local.get $p0
        i32.const 48
        i32.store offset=4
        local.get $p0
        local.get $l7
        local.get $p2
        local.get $p3
        call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17h23eac09b544bf16eE
        br_if $B6
        i32.const 0
        local.set $p1
        local.get $l9
        local.get $l8
        i32.sub
        local.tee $l10
        local.set $p3
        block $B15
          block $B16
            block $B17
              i32.const 1
              local.get $p0
              i32.load8_u offset=48
              local.tee $l9
              local.get $l9
              i32.const 3
              i32.eq
              select
              br_table $B15 $B16 $B17 $B16 $B15
            end
            local.get $l10
            i32.const 1
            i32.shr_u
            local.set $p1
            local.get $l10
            i32.const 1
            i32.add
            i32.const 1
            i32.shr_u
            local.set $p3
            br $B15
          end
          i32.const 0
          local.set $p3
          local.get $l10
          local.set $p1
        end
        local.get $p1
        i32.const 1
        i32.add
        local.set $p1
        block $B18
          loop $L19
            local.get $p1
            i32.const -1
            i32.add
            local.tee $p1
            i32.eqz
            br_if $B18
            local.get $p0
            i32.load offset=24
            local.get $p0
            i32.load offset=4
            local.get $p0
            i32.load offset=28
            i32.load offset=16
            call_indirect (type $t3) $T0
            i32.eqz
            br_if $L19
          end
          i32.const 1
          return
        end
        local.get $p0
        i32.load offset=4
        local.set $l10
        i32.const 1
        local.set $p1
        local.get $p0
        i32.load offset=24
        local.get $p4
        local.get $p5
        local.get $p0
        i32.load offset=28
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B6
        local.get $p3
        i32.const 1
        i32.add
        local.set $l9
        local.get $p0
        i32.load offset=28
        local.set $p3
        local.get $p0
        i32.load offset=24
        local.set $p0
        loop $L20
          block $B21
            local.get $l9
            i32.const -1
            i32.add
            local.tee $l9
            br_if $B21
            i32.const 0
            return
          end
          i32.const 1
          local.set $p1
          local.get $p0
          local.get $l10
          local.get $p3
          i32.load offset=16
          call_indirect (type $t3) $T0
          i32.eqz
          br_if $L20
          br $B6
        end
      end
      local.get $p0
      i32.load offset=4
      local.set $l10
      i32.const 1
      local.set $p1
      local.get $p0
      local.get $l7
      local.get $p2
      local.get $p3
      call $_ZN4core3fmt9Formatter12pad_integral12write_prefix17h23eac09b544bf16eE
      br_if $B6
      local.get $p0
      i32.load offset=24
      local.get $p4
      local.get $p5
      local.get $p0
      i32.load offset=28
      i32.load offset=12
      call_indirect (type $t8) $T0
      br_if $B6
      local.get $l8
      i32.const 1
      i32.add
      local.set $l9
      local.get $p0
      i32.load offset=28
      local.set $p3
      local.get $p0
      i32.load offset=24
      local.set $p0
      loop $L22
        block $B23
          local.get $l9
          i32.const -1
          i32.add
          local.tee $l9
          br_if $B23
          i32.const 0
          return
        end
        i32.const 1
        local.set $p1
        local.get $p0
        local.get $l10
        local.get $p3
        i32.load offset=16
        call_indirect (type $t3) $T0
        i32.eqz
        br_if $L22
      end
    end
    local.get $p1)
  (func $_ZN4core3fmt9Formatter12pad_integral12write_prefix17h23eac09b544bf16eE (type $t9) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (result i32)
    (local $l4 i32)
    block $B0
      block $B1
        local.get $p1
        i32.const 1114112
        i32.eq
        br_if $B1
        i32.const 1
        local.set $l4
        local.get $p0
        i32.load offset=24
        local.get $p1
        local.get $p0
        i32.const 28
        i32.add
        i32.load
        i32.load offset=16
        call_indirect (type $t3) $T0
        br_if $B0
      end
      block $B2
        local.get $p2
        br_if $B2
        i32.const 0
        return
      end
      local.get $p0
      i32.load offset=24
      local.get $p2
      local.get $p3
      local.get $p0
      i32.const 28
      i32.add
      i32.load
      i32.load offset=12
      call_indirect (type $t8) $T0
      local.set $l4
    end
    local.get $l4)
  (func $_ZN4core3fmt9Formatter9write_str17ha1697ce05c7e7a6cE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p0
    i32.load offset=24
    local.get $p1
    local.get $p2
    local.get $p0
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0)
  (func $_ZN4core3fmt9Formatter9write_fmt17h82e7776a00521c64E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.const 28
    i32.add
    i32.load
    local.set $l3
    local.get $p0
    i32.load offset=24
    local.set $p0
    local.get $l2
    i32.const 8
    i32.add
    i32.const 16
    i32.add
    local.get $p1
    i32.const 16
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    i32.const 8
    i32.add
    i32.const 8
    i32.add
    local.get $p1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store
    local.get $l2
    local.get $p1
    i64.load align=4
    i64.store offset=8
    local.get $p0
    local.get $l3
    local.get $l2
    i32.const 8
    i32.add
    call $_ZN4core3fmt5write17hfcf1a109ad62a790E
    local.set $p1
    local.get $l2
    i32.const 32
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN4core3fmt9Formatter15debug_lower_hex17h5c8baa961fce1ff1E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load8_u
    i32.const 16
    i32.and
    i32.const 4
    i32.shr_u)
  (func $_ZN4core3fmt9Formatter15debug_upper_hex17h9d77f5d478fc94a1E (type $t7) (param $p0 i32) (result i32)
    local.get $p0
    i32.load8_u
    i32.const 32
    i32.and
    i32.const 5
    i32.shr_u)
  (func $_ZN4core3fmt9Formatter11debug_tuple17hc44365651ef7edf1E (type $t4) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    local.get $p0
    local.get $p1
    i32.load offset=24
    local.get $p2
    local.get $p3
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0
    i32.store8 offset=8
    local.get $p0
    local.get $p1
    i32.store
    local.get $p0
    local.get $p3
    i32.eqz
    i32.store8 offset=9
    local.get $p0
    i32.const 0
    i32.store offset=4)
  (func $_ZN4core3fmt9Formatter10debug_list17hf948ec8be33bff4bE (type $t5) (param $p0 i32) (param $p1 i32)
    (local $l2 i32)
    local.get $p1
    i32.load offset=24
    i32.const 1055246
    i32.const 1
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0
    local.set $l2
    local.get $p0
    i32.const 0
    i32.store8 offset=5
    local.get $p0
    local.get $l2
    i32.store8 offset=4
    local.get $p0
    local.get $p1
    i32.store)
  (func $_ZN57_$LT$core..fmt..Formatter$u20$as$u20$core..fmt..Write$GT$10write_char17he5bfc0a827fcc1c8E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load offset=24
    local.get $p1
    local.get $p0
    i32.const 28
    i32.add
    i32.load
    i32.load offset=16
    call_indirect (type $t3) $T0)
  (func $_ZN40_$LT$str$u20$as$u20$core..fmt..Debug$GT$3fmt17hb0d1558d5b23100eE (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i64)
    global.get $g0
    i32.const 32
    i32.sub
    local.tee $l3
    global.set $g0
    i32.const 1
    local.set $l4
    block $B0
      block $B1
        local.get $p2
        i32.load offset=24
        i32.const 34
        local.get $p2
        i32.const 28
        i32.add
        i32.load
        i32.load offset=16
        call_indirect (type $t3) $T0
        br_if $B1
        block $B2
          block $B3
            local.get $p1
            br_if $B3
            i32.const 0
            local.set $l5
            br $B2
          end
          local.get $p0
          local.get $p1
          i32.add
          local.set $l6
          i32.const 0
          local.set $l5
          local.get $p0
          local.set $l7
          local.get $p0
          local.set $l8
          i32.const 0
          local.set $l9
          block $B4
            loop $L5
              local.get $l7
              i32.const 1
              i32.add
              local.set $l10
              block $B6
                block $B7
                  block $B8
                    local.get $l7
                    i32.load8_s
                    local.tee $l11
                    i32.const -1
                    i32.gt_s
                    br_if $B8
                    block $B9
                      block $B10
                        local.get $l10
                        local.get $l6
                        i32.ne
                        br_if $B10
                        i32.const 0
                        local.set $l12
                        local.get $l6
                        local.set $l7
                        br $B9
                      end
                      local.get $l7
                      i32.load8_u offset=1
                      i32.const 63
                      i32.and
                      local.set $l12
                      local.get $l7
                      i32.const 2
                      i32.add
                      local.tee $l10
                      local.set $l7
                    end
                    local.get $l11
                    i32.const 31
                    i32.and
                    local.set $l4
                    block $B11
                      local.get $l11
                      i32.const 255
                      i32.and
                      local.tee $l11
                      i32.const 223
                      i32.gt_u
                      br_if $B11
                      local.get $l12
                      local.get $l4
                      i32.const 6
                      i32.shl
                      i32.or
                      local.set $l12
                      br $B7
                    end
                    block $B12
                      block $B13
                        local.get $l7
                        local.get $l6
                        i32.ne
                        br_if $B13
                        i32.const 0
                        local.set $l13
                        local.get $l6
                        local.set $l14
                        br $B12
                      end
                      local.get $l7
                      i32.load8_u
                      i32.const 63
                      i32.and
                      local.set $l13
                      local.get $l7
                      i32.const 1
                      i32.add
                      local.tee $l10
                      local.set $l14
                    end
                    local.get $l13
                    local.get $l12
                    i32.const 6
                    i32.shl
                    i32.or
                    local.set $l12
                    block $B14
                      local.get $l11
                      i32.const 240
                      i32.ge_u
                      br_if $B14
                      local.get $l12
                      local.get $l4
                      i32.const 12
                      i32.shl
                      i32.or
                      local.set $l12
                      br $B7
                    end
                    block $B15
                      block $B16
                        local.get $l14
                        local.get $l6
                        i32.ne
                        br_if $B16
                        i32.const 0
                        local.set $l11
                        local.get $l10
                        local.set $l7
                        br $B15
                      end
                      local.get $l14
                      i32.const 1
                      i32.add
                      local.set $l7
                      local.get $l14
                      i32.load8_u
                      i32.const 63
                      i32.and
                      local.set $l11
                    end
                    local.get $l12
                    i32.const 6
                    i32.shl
                    local.get $l4
                    i32.const 18
                    i32.shl
                    i32.const 1835008
                    i32.and
                    i32.or
                    local.get $l11
                    i32.or
                    local.tee $l12
                    i32.const 1114112
                    i32.ne
                    br_if $B6
                    br $B4
                  end
                  local.get $l11
                  i32.const 255
                  i32.and
                  local.set $l12
                end
                local.get $l10
                local.set $l7
              end
              i32.const 2
              local.set $l10
              block $B17
                block $B18
                  block $B19
                    block $B20
                      block $B21
                        block $B22
                          local.get $l12
                          i32.const -9
                          i32.add
                          local.tee $l11
                          i32.const 30
                          i32.le_u
                          br_if $B22
                          local.get $l12
                          i32.const 92
                          i32.ne
                          br_if $B21
                          br $B20
                        end
                        i32.const 116
                        local.set $l14
                        block $B23
                          block $B24
                            local.get $l11
                            br_table $B18 $B23 $B21 $B21 $B24 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B21 $B20 $B21 $B21 $B21 $B21 $B20 $B18
                          end
                          i32.const 114
                          local.set $l14
                          br $B18
                        end
                        i32.const 110
                        local.set $l14
                        br $B18
                      end
                      block $B25
                        i32.const 1058568
                        local.get $l12
                        call $_ZN4core7unicode9bool_trie8BoolTrie6lookup17h7906549996b02595E
                        br_if $B25
                        local.get $l12
                        call $_ZN4core7unicode9printable12is_printable17h3288c8d52298f4e7E
                        br_if $B17
                      end
                      local.get $l12
                      i32.const 1
                      i32.or
                      i32.clz
                      i32.const 2
                      i32.shr_u
                      i32.const 7
                      i32.xor
                      i64.extend_i32_u
                      i64.const 21474836480
                      i64.or
                      local.set $l15
                      i32.const 3
                      local.set $l10
                      br $B19
                    end
                  end
                  local.get $l12
                  local.set $l14
                end
                local.get $l3
                local.get $p1
                i32.store offset=4
                local.get $l3
                local.get $p0
                i32.store
                local.get $l3
                local.get $l5
                i32.store offset=8
                local.get $l3
                local.get $l9
                i32.store offset=12
                block $B26
                  block $B27
                    local.get $l9
                    local.get $l5
                    i32.lt_u
                    br_if $B27
                    block $B28
                      local.get $l5
                      i32.eqz
                      br_if $B28
                      local.get $l5
                      local.get $p1
                      i32.eq
                      br_if $B28
                      local.get $l5
                      local.get $p1
                      i32.ge_u
                      br_if $B27
                      local.get $p0
                      local.get $l5
                      i32.add
                      i32.load8_s
                      i32.const -65
                      i32.le_s
                      br_if $B27
                    end
                    block $B29
                      local.get $l9
                      i32.eqz
                      br_if $B29
                      local.get $l9
                      local.get $p1
                      i32.eq
                      br_if $B29
                      local.get $l9
                      local.get $p1
                      i32.ge_u
                      br_if $B27
                      local.get $p0
                      local.get $l9
                      i32.add
                      i32.load8_s
                      i32.const -65
                      i32.le_s
                      br_if $B27
                    end
                    local.get $p2
                    i32.load offset=24
                    local.get $p0
                    local.get $l5
                    i32.add
                    local.get $l9
                    local.get $l5
                    i32.sub
                    local.get $p2
                    i32.load offset=28
                    i32.load offset=12
                    call_indirect (type $t8) $T0
                    i32.eqz
                    br_if $B26
                    i32.const 1
                    local.set $l4
                    br $B1
                  end
                  local.get $l3
                  local.get $l3
                  i32.const 12
                  i32.add
                  i32.store offset=24
                  local.get $l3
                  local.get $l3
                  i32.const 8
                  i32.add
                  i32.store offset=20
                  local.get $l3
                  local.get $l3
                  i32.store offset=16
                  local.get $l3
                  i32.const 16
                  i32.add
                  call $_ZN4core3str6traits101_$LT$impl$u20$core..slice..SliceIndex$LT$str$GT$$u20$for$u20$core..ops..range..Range$LT$usize$GT$$GT$5index28_$u7b$$u7b$closure$u7d$$u7d$17h2ae8a66587ff8d8eE
                  unreachable
                end
                loop $L30
                  local.get $l10
                  local.set $l11
                  i32.const 1
                  local.set $l4
                  i32.const 92
                  local.set $l5
                  i32.const 1
                  local.set $l10
                  block $B31
                    block $B32
                      block $B33
                        block $B34
                          block $B35
                            block $B36
                              local.get $l11
                              br_table $B34 $B35 $B31 $B36 $B34
                            end
                            block $B37
                              block $B38
                                block $B39
                                  block $B40
                                    local.get $l15
                                    i64.const 32
                                    i64.shr_u
                                    i32.wrap_i64
                                    i32.const 255
                                    i32.and
                                    br_table $B34 $B37 $B38 $B39 $B40 $B33 $B34
                                  end
                                  local.get $l15
                                  i64.const -1095216660481
                                  i64.and
                                  i64.const 12884901888
                                  i64.or
                                  local.set $l15
                                  i32.const 3
                                  local.set $l10
                                  i32.const 117
                                  local.set $l5
                                  br $B31
                                end
                                local.get $l15
                                i64.const -1095216660481
                                i64.and
                                i64.const 8589934592
                                i64.or
                                local.set $l15
                                i32.const 3
                                local.set $l10
                                i32.const 123
                                local.set $l5
                                br $B31
                              end
                              local.get $l14
                              local.get $l15
                              i32.wrap_i64
                              local.tee $l11
                              i32.const 2
                              i32.shl
                              i32.const 28
                              i32.and
                              i32.shr_u
                              i32.const 15
                              i32.and
                              local.tee $l10
                              i32.const 48
                              i32.or
                              local.get $l10
                              i32.const 87
                              i32.add
                              local.get $l10
                              i32.const 10
                              i32.lt_u
                              select
                              local.set $l5
                              block $B41
                                local.get $l11
                                i32.eqz
                                br_if $B41
                                local.get $l15
                                i64.const -1
                                i64.add
                                i64.const 4294967295
                                i64.and
                                local.get $l15
                                i64.const -4294967296
                                i64.and
                                i64.or
                                local.set $l15
                                br $B32
                              end
                              local.get $l15
                              i64.const -1095216660481
                              i64.and
                              i64.const 4294967296
                              i64.or
                              local.set $l15
                              br $B32
                            end
                            local.get $l15
                            i64.const -1095216660481
                            i64.and
                            local.set $l15
                            i32.const 3
                            local.set $l10
                            i32.const 125
                            local.set $l5
                            br $B31
                          end
                          i32.const 0
                          local.set $l10
                          local.get $l14
                          local.set $l5
                          br $B31
                        end
                        i32.const 1
                        local.set $l10
                        block $B42
                          local.get $l12
                          i32.const 128
                          i32.lt_u
                          br_if $B42
                          i32.const 2
                          local.set $l10
                          local.get $l12
                          i32.const 2048
                          i32.lt_u
                          br_if $B42
                          i32.const 3
                          i32.const 4
                          local.get $l12
                          i32.const 65536
                          i32.lt_u
                          select
                          local.set $l10
                        end
                        local.get $l10
                        local.get $l9
                        i32.add
                        local.set $l5
                        br $B17
                      end
                      local.get $l15
                      i64.const -1095216660481
                      i64.and
                      i64.const 17179869184
                      i64.or
                      local.set $l15
                    end
                    i32.const 3
                    local.set $l10
                  end
                  local.get $p2
                  i32.load offset=24
                  local.get $l5
                  local.get $p2
                  i32.load offset=28
                  i32.load offset=16
                  call_indirect (type $t3) $T0
                  br_if $B1
                  br $L30
                end
              end
              local.get $l9
              local.get $l8
              i32.sub
              local.get $l7
              i32.add
              local.set $l9
              local.get $l7
              local.set $l8
              local.get $l6
              local.get $l7
              i32.ne
              br_if $L5
            end
          end
          local.get $l5
          i32.eqz
          br_if $B2
          local.get $l5
          local.get $p1
          i32.eq
          br_if $B2
          local.get $l5
          local.get $p1
          i32.ge_u
          br_if $B0
          local.get $p0
          local.get $l5
          i32.add
          i32.load8_s
          i32.const -65
          i32.le_s
          br_if $B0
        end
        i32.const 1
        local.set $l4
        local.get $p2
        i32.load offset=24
        local.get $p0
        local.get $l5
        i32.add
        local.get $p1
        local.get $l5
        i32.sub
        local.get $p2
        i32.load offset=28
        i32.load offset=12
        call_indirect (type $t8) $T0
        br_if $B1
        local.get $p2
        i32.load offset=24
        i32.const 34
        local.get $p2
        i32.load offset=28
        i32.load offset=16
        call_indirect (type $t3) $T0
        local.set $l4
      end
      local.get $l3
      i32.const 32
      i32.add
      global.set $g0
      local.get $l4
      return
    end
    local.get $p0
    local.get $p1
    local.get $l5
    local.get $p1
    call $_ZN4core3str16slice_error_fail17he7d77f9d4eaf8572E
    unreachable)
  (func $_ZN42_$LT$str$u20$as$u20$core..fmt..Display$GT$3fmt17h5c99f0bd4435cce9E (type $t8) (param $p0 i32) (param $p1 i32) (param $p2 i32) (result i32)
    local.get $p2
    local.get $p0
    local.get $p1
    call $_ZN4core3fmt9Formatter3pad17h16ea8f5b109745c2E)
  (func $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..LowerHex$u20$for$u20$i32$GT$3fmt17h68a811187dd0a841E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load
    local.set $l3
    i32.const 0
    local.set $p0
    loop $L0
      local.get $l2
      local.get $p0
      i32.add
      i32.const 127
      i32.add
      local.get $l3
      i32.const 15
      i32.and
      local.tee $l4
      i32.const 48
      i32.or
      local.get $l4
      i32.const 87
      i32.add
      local.get $l4
      i32.const 10
      i32.lt_u
      select
      i32.store8
      local.get $p0
      i32.const -1
      i32.add
      local.set $p0
      local.get $l3
      i32.const 4
      i32.shr_u
      local.tee $l3
      br_if $L0
    end
    block $B1
      local.get $p0
      i32.const 128
      i32.add
      local.tee $l3
      i32.const 129
      i32.lt_u
      br_if $B1
      local.get $l3
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $p1
    i32.const 1
    i32.const 1055265
    i32.const 2
    local.get $l2
    local.get $p0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get $p0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
    local.set $p0
    local.get $l2
    i32.const 128
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core7unicode9printable5check17h8643d82a6d21b7f0E (type $t15) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32) (param $p4 i32) (param $p5 i32) (param $p6 i32) (result i32)
    (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32)
    i32.const 1
    local.set $l7
    block $B0
      block $B1
        local.get $p2
        i32.eqz
        br_if $B1
        local.get $p1
        local.get $p2
        i32.const 1
        i32.shl
        i32.add
        local.set $l8
        local.get $p0
        i32.const 65280
        i32.and
        i32.const 8
        i32.shr_u
        local.set $l9
        i32.const 0
        local.set $l10
        local.get $p0
        i32.const 255
        i32.and
        local.set $l11
        block $B2
          loop $L3
            local.get $p1
            i32.const 2
            i32.add
            local.set $l12
            local.get $l10
            local.get $p1
            i32.load8_u offset=1
            local.tee $p2
            i32.add
            local.set $l13
            block $B4
              local.get $p1
              i32.load8_u
              local.tee $p1
              local.get $l9
              i32.eq
              br_if $B4
              local.get $p1
              local.get $l9
              i32.gt_u
              br_if $B1
              local.get $l13
              local.set $l10
              local.get $l12
              local.set $p1
              local.get $l12
              local.get $l8
              i32.ne
              br_if $L3
              br $B1
            end
            block $B5
              local.get $l13
              local.get $l10
              i32.lt_u
              br_if $B5
              local.get $l13
              local.get $p4
              i32.gt_u
              br_if $B2
              local.get $p3
              local.get $l10
              i32.add
              local.set $p1
              block $B6
                loop $L7
                  local.get $p2
                  i32.eqz
                  br_if $B6
                  local.get $p2
                  i32.const -1
                  i32.add
                  local.set $p2
                  local.get $p1
                  i32.load8_u
                  local.set $l10
                  local.get $p1
                  i32.const 1
                  i32.add
                  local.set $p1
                  local.get $l10
                  local.get $l11
                  i32.ne
                  br_if $L7
                end
                i32.const 0
                local.set $l7
                br $B0
              end
              local.get $l13
              local.set $l10
              local.get $l12
              local.set $p1
              local.get $l12
              local.get $l8
              i32.ne
              br_if $L3
              br $B1
            end
          end
          local.get $l10
          local.get $l13
          call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
          unreachable
        end
        local.get $l13
        local.get $p4
        call $_ZN4core5slice20slice_index_len_fail17h649337adfa551a7fE
        unreachable
      end
      local.get $p6
      i32.eqz
      br_if $B0
      local.get $p5
      local.get $p6
      i32.add
      local.set $l11
      local.get $p0
      i32.const 65535
      i32.and
      local.set $p1
      i32.const 1
      local.set $l7
      block $B8
        loop $L9
          local.get $p5
          i32.const 1
          i32.add
          local.set $l10
          block $B10
            block $B11
              local.get $p5
              i32.load8_u
              local.tee $p2
              i32.const 24
              i32.shl
              i32.const 24
              i32.shr_s
              local.tee $l13
              i32.const 0
              i32.lt_s
              br_if $B11
              local.get $l10
              local.set $p5
              br $B10
            end
            local.get $l10
            local.get $l11
            i32.eq
            br_if $B8
            local.get $l13
            i32.const 127
            i32.and
            i32.const 8
            i32.shl
            local.get $p5
            i32.load8_u offset=1
            i32.or
            local.set $p2
            local.get $p5
            i32.const 2
            i32.add
            local.set $p5
          end
          local.get $p1
          local.get $p2
          i32.sub
          local.tee $p1
          i32.const 0
          i32.lt_s
          br_if $B0
          local.get $l7
          i32.const 1
          i32.xor
          local.set $l7
          local.get $p5
          local.get $l11
          i32.ne
          br_if $L9
          br $B0
        end
      end
      i32.const 1054184
      i32.const 43
      i32.const 1054248
      call $_ZN4core9panicking5panic17h1e2c7255fd5aabaeE
      unreachable
    end
    local.get $l7
    i32.const 1
    i32.and)
  (func $_ZN4core7unicode6tables16derived_property15Grapheme_Extend17he2d071185c45b8b5E (type $t7) (param $p0 i32) (result i32)
    i32.const 1058568
    local.get $p0
    call $_ZN4core7unicode9bool_trie8BoolTrie6lookup17h7906549996b02595E)
  (func $_ZN57_$LT$core..str..Utf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h405ba65899a73029E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p1
    i32.load offset=24
    i32.const 1060120
    i32.const 9
    local.get $p1
    i32.const 28
    i32.add
    i32.load
    i32.load offset=12
    call_indirect (type $t8) $T0
    local.set $l3
    local.get $l2
    i32.const 0
    i32.store8 offset=5
    local.get $l2
    local.get $l3
    i32.store8 offset=4
    local.get $l2
    local.get $p1
    i32.store
    local.get $l2
    local.get $p0
    i32.store offset=12
    local.get $l2
    i32.const 1060129
    i32.const 11
    local.get $l2
    i32.const 12
    i32.add
    i32.const 1060096
    call $_ZN4core3fmt8builders11DebugStruct5field17hdbb79d996b523484E
    drop
    local.get $l2
    local.get $p0
    i32.const 4
    i32.add
    i32.store offset=12
    local.get $l2
    i32.const 1060140
    i32.const 9
    local.get $l2
    i32.const 12
    i32.add
    i32.const 1060152
    call $_ZN4core3fmt8builders11DebugStruct5field17hdbb79d996b523484E
    drop
    local.get $l2
    i32.load8_u offset=4
    local.set $p1
    block $B0
      local.get $l2
      i32.load8_u offset=5
      i32.eqz
      br_if $B0
      local.get $p1
      i32.const 255
      i32.and
      local.set $p0
      i32.const 1
      local.set $p1
      block $B1
        local.get $p0
        br_if $B1
        local.get $l2
        i32.load
        local.tee $p1
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        local.set $p0
        local.get $p1
        i32.load offset=24
        local.set $l3
        block $B2
          local.get $p1
          i32.load8_u
          i32.const 4
          i32.and
          br_if $B2
          local.get $l3
          i32.const 1055239
          i32.const 2
          local.get $p0
          call_indirect (type $t8) $T0
          local.set $p1
          br $B1
        end
        local.get $l3
        i32.const 1055238
        i32.const 1
        local.get $p0
        call_indirect (type $t8) $T0
        local.set $p1
      end
      local.get $l2
      local.get $p1
      i32.store8 offset=4
    end
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1
    i32.const 255
    i32.and
    i32.const 0
    i32.ne)
  (func $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i8$GT$3fmt17hb4fc7b6daa976529E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load8_u
    local.set $l3
    i32.const 0
    local.set $p0
    loop $L0
      local.get $l2
      local.get $p0
      i32.add
      i32.const 127
      i32.add
      local.get $l3
      i32.const 15
      i32.and
      local.tee $l4
      i32.const 48
      i32.or
      local.get $l4
      i32.const 55
      i32.add
      local.get $l4
      i32.const 10
      i32.lt_u
      select
      i32.store8
      local.get $p0
      i32.const -1
      i32.add
      local.set $p0
      local.get $l3
      i32.const 4
      i32.shr_u
      i32.const 15
      i32.and
      local.tee $l3
      br_if $L0
    end
    block $B1
      local.get $p0
      i32.const 128
      i32.add
      local.tee $l3
      i32.const 129
      i32.lt_u
      br_if $B1
      local.get $l3
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $p1
    i32.const 1
    i32.const 1055265
    i32.const 2
    local.get $l2
    local.get $p0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get $p0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
    local.set $p0
    local.get $l2
    i32.const 128
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3fmt3num53_$LT$impl$u20$core..fmt..UpperHex$u20$for$u20$i32$GT$3fmt17h49bf7eda3a80c913E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load
    local.set $l3
    i32.const 0
    local.set $p0
    loop $L0
      local.get $l2
      local.get $p0
      i32.add
      i32.const 127
      i32.add
      local.get $l3
      i32.const 15
      i32.and
      local.tee $l4
      i32.const 48
      i32.or
      local.get $l4
      i32.const 55
      i32.add
      local.get $l4
      i32.const 10
      i32.lt_u
      select
      i32.store8
      local.get $p0
      i32.const -1
      i32.add
      local.set $p0
      local.get $l3
      i32.const 4
      i32.shr_u
      local.tee $l3
      br_if $L0
    end
    block $B1
      local.get $p0
      i32.const 128
      i32.add
      local.tee $l3
      i32.const 129
      i32.lt_u
      br_if $B1
      local.get $l3
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $p1
    i32.const 1
    i32.const 1055265
    i32.const 2
    local.get $l2
    local.get $p0
    i32.add
    i32.const 128
    i32.add
    i32.const 0
    local.get $p0
    i32.sub
    call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
    local.set $p0
    local.get $l2
    i32.const 128
    i32.add
    global.set $g0
    local.get $p0)
  (func $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17h971b2e880811727eE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i64)
    local.get $p0
    i32.load
    local.tee $p0
    i64.extend_i32_s
    local.tee $l2
    local.get $l2
    i64.const 63
    i64.shr_s
    local.tee $l2
    i64.add
    local.get $l2
    i64.xor
    local.get $p0
    i32.const -1
    i32.xor
    i32.const 31
    i32.shr_u
    local.get $p1
    call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h02520081dc1789edE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32) (local $l4 i32)
    global.get $g0
    i32.const 128
    i32.sub
    local.tee $l2
    global.set $g0
    local.get $p0
    i32.load
    local.set $p0
    block $B0
      block $B1
        block $B2
          block $B3
            block $B4
              local.get $p1
              i32.load
              local.tee $l3
              i32.const 16
              i32.and
              br_if $B4
              local.get $p0
              i32.load8_u
              local.set $l4
              local.get $l3
              i32.const 32
              i32.and
              br_if $B3
              local.get $l4
              i64.extend_i32_u
              i64.const 255
              i64.and
              i32.const 1
              local.get $p1
              call $_ZN4core3fmt3num3imp7fmt_u6417h8a4e3f2d9702995eE
              local.set $p0
              br $B2
            end
            local.get $p0
            i32.load8_u
            local.set $l4
            i32.const 0
            local.set $p0
            loop $L5
              local.get $l2
              local.get $p0
              i32.add
              i32.const 127
              i32.add
              local.get $l4
              i32.const 15
              i32.and
              local.tee $l3
              i32.const 48
              i32.or
              local.get $l3
              i32.const 87
              i32.add
              local.get $l3
              i32.const 10
              i32.lt_u
              select
              i32.store8
              local.get $p0
              i32.const -1
              i32.add
              local.set $p0
              local.get $l4
              i32.const 4
              i32.shr_u
              i32.const 15
              i32.and
              local.tee $l4
              br_if $L5
            end
            local.get $p0
            i32.const 128
            i32.add
            local.tee $l4
            i32.const 129
            i32.ge_u
            br_if $B1
            local.get $p1
            i32.const 1
            i32.const 1055265
            i32.const 2
            local.get $l2
            local.get $p0
            i32.add
            i32.const 128
            i32.add
            i32.const 0
            local.get $p0
            i32.sub
            call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
            local.set $p0
            br $B2
          end
          i32.const 0
          local.set $p0
          loop $L6
            local.get $l2
            local.get $p0
            i32.add
            i32.const 127
            i32.add
            local.get $l4
            i32.const 15
            i32.and
            local.tee $l3
            i32.const 48
            i32.or
            local.get $l3
            i32.const 55
            i32.add
            local.get $l3
            i32.const 10
            i32.lt_u
            select
            i32.store8
            local.get $p0
            i32.const -1
            i32.add
            local.set $p0
            local.get $l4
            i32.const 4
            i32.shr_u
            i32.const 15
            i32.and
            local.tee $l4
            br_if $L6
          end
          local.get $p0
          i32.const 128
          i32.add
          local.tee $l4
          i32.const 129
          i32.ge_u
          br_if $B0
          local.get $p1
          i32.const 1
          i32.const 1055265
          i32.const 2
          local.get $l2
          local.get $p0
          i32.add
          i32.const 128
          i32.add
          i32.const 0
          local.get $p0
          i32.sub
          call $_ZN4core3fmt9Formatter12pad_integral17h502b4cea1982c1e9E
          local.set $p0
        end
        local.get $l2
        i32.const 128
        i32.add
        global.set $g0
        local.get $p0
        return
      end
      local.get $l4
      i32.const 128
      call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
      unreachable
    end
    local.get $l4
    i32.const 128
    call $_ZN4core5slice22slice_index_order_fail17hc4d876892e42fc8aE
    unreachable)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h5847badd239b2b9aE (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    (local $l2 i32) (local $l3 i32)
    global.get $g0
    i32.const 16
    i32.sub
    local.tee $l2
    global.set $g0
    block $B0
      block $B1
        local.get $p0
        i32.load
        local.tee $p0
        i32.load8_u
        i32.const 1
        i32.eq
        br_if $B1
        local.get $p1
        i32.load offset=24
        i32.const 1060116
        i32.const 4
        local.get $p1
        i32.const 28
        i32.add
        i32.load
        i32.load offset=12
        call_indirect (type $t8) $T0
        local.set $p1
        br $B0
      end
      local.get $l2
      local.get $p1
      i32.load offset=24
      i32.const 1060112
      i32.const 4
      local.get $p1
      i32.const 28
      i32.add
      i32.load
      i32.load offset=12
      call_indirect (type $t8) $T0
      i32.store8 offset=8
      local.get $l2
      local.get $p1
      i32.store
      local.get $l2
      i32.const 0
      i32.store8 offset=9
      local.get $l2
      i32.const 0
      i32.store offset=4
      local.get $l2
      local.get $p0
      i32.const 1
      i32.add
      i32.store offset=12
      local.get $l2
      local.get $l2
      i32.const 12
      i32.add
      i32.const 1055248
      call $_ZN4core3fmt8builders10DebugTuple5field17hdc280f3f5bcd284bE
      drop
      local.get $l2
      i32.load8_u offset=8
      local.set $p1
      block $B2
        local.get $l2
        i32.load offset=4
        local.tee $l3
        i32.eqz
        br_if $B2
        local.get $p1
        i32.const 255
        i32.and
        local.set $p0
        i32.const 1
        local.set $p1
        block $B3
          local.get $p0
          br_if $B3
          block $B4
            local.get $l3
            i32.const 1
            i32.ne
            br_if $B4
            local.get $l2
            i32.load8_u offset=9
            i32.const 255
            i32.and
            i32.eqz
            br_if $B4
            local.get $l2
            i32.load
            local.tee $p0
            i32.load8_u
            i32.const 4
            i32.and
            br_if $B4
            i32.const 1
            local.set $p1
            local.get $p0
            i32.load offset=24
            i32.const 1055244
            i32.const 1
            local.get $p0
            i32.const 28
            i32.add
            i32.load
            i32.load offset=12
            call_indirect (type $t8) $T0
            br_if $B3
          end
          local.get $l2
          i32.load
          local.tee $p1
          i32.load offset=24
          i32.const 1054648
          i32.const 1
          local.get $p1
          i32.const 28
          i32.add
          i32.load
          i32.load offset=12
          call_indirect (type $t8) $T0
          local.set $p1
        end
        local.get $l2
        local.get $p1
        i32.store8 offset=8
      end
      local.get $p1
      i32.const 255
      i32.and
      i32.const 0
      i32.ne
      local.set $p1
    end
    local.get $l2
    i32.const 16
    i32.add
    global.set $g0
    local.get $p1)
  (func $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17ha7d89a72a3f09b77E (type $t3) (param $p0 i32) (param $p1 i32) (result i32)
    local.get $p0
    i32.load
    local.get $p1
    call $_ZN4core3fmt3num52_$LT$impl$u20$core..fmt..Debug$u20$for$u20$usize$GT$3fmt17h6531f92922fc1e14E)
  (table $T0 101 101 funcref)
  (memory $memory 17)
  (global $g0 (mut i32) (i32.const 1048576))
  (global $__data_end i32 (i32.const 1060832))
  (global $__heap_base i32 (i32.const 1060832))
  (export "memory" (memory 0))
  (export "__data_end" (global 1))
  (export "__heap_base" (global 2))
  (export "_start" (func $_start))
  (export "__original_main" (func $__original_main))
  (export "main" (func $main))
  (elem $e0 (i32.const 1) $_ZN66_$LT$core..option..Option$LT$T$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h70f2344e80fb15b6E $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17hd5bb454499213d6aE $_ZN3env4main17h1c163e809403ada2E $_ZN4core3ptr18real_drop_in_place17h7ea229907c1005d3E $_ZN3std2rt10lang_start28_$u7b$$u7b$closure$u7d$$u7d$17hb49bfe9f25a93432E $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17h095d160050d76d50E $_ZN4core3ptr18real_drop_in_place17h2c9a6044485496c0E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h988f253729519155E $_ZN45_$LT$$RF$T$u20$as$u20$core..fmt..UpperHex$GT$3fmt17hafd40081564230c9E $_ZN59_$LT$core..fmt..Arguments$u20$as$u20$core..fmt..Display$GT$3fmt17hf64092988781d3dbE $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h9684bc776b4eae8bE $_ZN60_$LT$std..io..error..Error$u20$as$u20$core..fmt..Display$GT$3fmt17hd06165d611b0d72eE $_ZN55_$LT$std..path..Display$u20$as$u20$core..fmt..Debug$GT$3fmt17hdc6c50e8bd89563dE $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$i32$GT$3fmt17h971b2e880811727eE $_ZN60_$LT$alloc..string..String$u20$as$u20$core..fmt..Display$GT$3fmt17ha436af5efe1b855aE $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h1fe4c7feb54d04f2E $_ZN4core3fmt3num3imp52_$LT$impl$u20$core..fmt..Display$u20$for$u20$u32$GT$3fmt17he5d54fd99fa6dba5E $_ZN3std5alloc24default_alloc_error_hook17hb9eeeb3b6d7c3dcbE $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17h6d8cf690c19a707dE $_ZN91_$LT$std..sys_common..backtrace.._print..DisplayBacktrace$u20$as$u20$core..fmt..Display$GT$3fmt17h096f731f418d975eE $_ZN3std9panicking3try7do_call17hf5839ff2595c7a9dE $_ZN76_$LT$std..sys_common..thread_local..Key$u20$as$u20$core..ops..drop..Drop$GT$4drop17h262053133a3af68bE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17haedbf6a67ae41aa7E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h7478aa20d2f05f88E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h6c04b9b61dcca382E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h0ec301fb86e66d3eE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h141654bd9ea3e6d5E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17h17d122a723a1cb8aE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h96f656062a6232b8E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h5c47392ca2f56a2cE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hfa1b405e68a915bfE $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h08139e7d88af447cE $_ZN4core3ptr18real_drop_in_place17h063c309cff0257b2E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h1e27867f537310e6E $_ZN63_$LT$core..cell..BorrowMutError$u20$as$u20$core..fmt..Debug$GT$3fmt17h33a664c2b7f63890E $_ZN60_$LT$core..cell..BorrowError$u20$as$u20$core..fmt..Debug$GT$3fmt17h93963e0f8b45f7bfE $_ZN4core3ptr18real_drop_in_place17h48b90d0474eebb6aE $_ZN62_$LT$std..ffi..c_str..NulError$u20$as$u20$core..fmt..Debug$GT$3fmt17hdedd92c4e8b03720E $_ZN4core3ptr18real_drop_in_place17h013771f2bf388bb9E $_ZN57_$LT$core..str..Utf8Error$u20$as$u20$core..fmt..Debug$GT$3fmt17h405ba65899a73029E $_ZN4core3ptr18real_drop_in_place17h0ef29dd94336095cE $_ZN82_$LT$std..sys_common..poison..PoisonError$LT$T$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h1ee80a1fbd3ea532E $_ZN4core3ptr18real_drop_in_place17h366cf060a9bc4440E $_ZN55_$LT$std..path..PathBuf$u20$as$u20$core..fmt..Debug$GT$3fmt17h496cc8f02947c32eE $_ZN243_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$std..error..Error$GT$11description17h99876fd1182ecb66E $_ZN3std5error5Error5cause17hdcc611f5b660fe7bE $_ZN3std5error5Error7type_id17h06f6b51af692fb8cE $_ZN3std5error5Error9backtrace17h06313fcba673025cE $_ZN244_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$core..fmt..Display$GT$3fmt17h49fa384e8bf0e2e8E $_ZN242_$LT$std..error..$LT$impl$u20$core..convert..From$LT$alloc..string..String$GT$$u20$for$u20$alloc..boxed..Box$LT$dyn$u20$std..error..Error$u2b$core..marker..Send$u2b$core..marker..Sync$GT$$GT$..from..StringError$u20$as$u20$core..fmt..Debug$GT$3fmt17h715599854f44a67aE $_ZN4core3ptr18real_drop_in_place17h066cb17c6cf89873E $_ZN80_$LT$std..io..Write..write_fmt..Adaptor$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1293f9e8bfbaad59E $_ZN4core3fmt5Write10write_char17h1c4827100ae065e8E $_ZN4core3fmt5Write9write_fmt17ha1d9a7d8628e9dedE $_ZN80_$LT$std..io..Write..write_fmt..Adaptor$LT$T$GT$$u20$as$u20$core..fmt..Write$GT$9write_str17h1062aea2e084a64bE $_ZN4core3fmt5Write10write_char17hef4c7bc74a1b5cc7E $_ZN4core3fmt5Write9write_fmt17h400b66164a24b062E $_ZN3std4sync4once4Once9call_once28_$u7b$$u7b$closure$u7d$$u7d$17hceefbeec1c95b3e0E $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17h3507ea750df20edeE $_ZN4core3ptr18real_drop_in_place17h546135adb32a6610E $_ZN3std10sys_common9backtrace10_print_fmt28_$u7b$$u7b$closure$u7d$$u7d$17hfe094cc5cdbff206E $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17hf451a8ca87320706E $_ZN4core3ops8function6FnOnce40call_once$u7b$$u7b$vtable.shim$u7d$$u7d$17hc7322906b9351a18E $_ZN60_$LT$std..io..stdio..StderrRaw$u20$as$u20$std..io..Write$GT$5write17hf4c537256714add5E $_ZN3std2io5Write14write_vectored17h86a5bea0959d2979E $_ZN59_$LT$std..process..ChildStdin$u20$as$u20$std..io..Write$GT$5flush17h8656765d9a5080b1E $_ZN3std2io5Write9write_all17h9cd275f6a8b429a6E $_ZN3std2io5Write9write_fmt17h05096837efcd9a38E $_ZN4core3ptr18real_drop_in_place17h1c041de8180dc1f9E $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$5write17haaeff0f2771725aaE $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$14write_vectored17hc39fb9d518e3ce73E $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$5flush17h90d011ec07347753E $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$9write_all17h5b1df4198c579a70E $_ZN3std2io5impls71_$LT$impl$u20$std..io..Write$u20$for$u20$alloc..boxed..Box$LT$W$GT$$GT$9write_fmt17h0a14847ba6c7a120E $_ZN4core3ptr18real_drop_in_place17he3b2439b3d403da0E $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17hc0c5f25526a95900E $_ZN90_$LT$std..panicking..begin_panic_handler..PanicPayload$u20$as$u20$core..panic..BoxMeUp$GT$3get17h1588f2a7085685f0E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17hfe16b6f7d37344e8E $_ZN91_$LT$std..panicking..begin_panic..PanicPayload$LT$A$GT$$u20$as$u20$core..panic..BoxMeUp$GT$8take_box17he53b475dd6514585E $_ZN91_$LT$std..panicking..begin_panic..PanicPayload$LT$A$GT$$u20$as$u20$core..panic..BoxMeUp$GT$3get17h70c43620f6b1eb23E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h91a38a0fc041fb55E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hfcda5bc88d78d0c2E $_ZN44_$LT$$RF$T$u20$as$u20$core..fmt..Display$GT$3fmt17hcbc8d7fbf70f6d32E $_ZN71_$LT$core..ops..range..Range$LT$Idx$GT$$u20$as$u20$core..fmt..Debug$GT$3fmt17h83e6c12d2862f0deE $_ZN41_$LT$char$u20$as$u20$core..fmt..Debug$GT$3fmt17h7fd369d89fa9ff68E $_ZN4core3fmt10ArgumentV110show_usize17h3e252c9903987f5fE $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17hedf6bd652ecf88e3E $_ZN4core3ptr18real_drop_in_place17h81918940aab47716E $_ZN36_$LT$T$u20$as$u20$core..any..Any$GT$7type_id17h12eac008b4b21e1eE $_ZN4core3ptr18real_drop_in_place17hb11d5440accc08b2E $_ZN68_$LT$core..fmt..builders..PadAdapter$u20$as$u20$core..fmt..Write$GT$9write_str17h723a9f57044b8c07E $_ZN4core3fmt5Write10write_char17hb5290cf8c98d3d42E $_ZN4core3fmt5Write9write_fmt17h31215b633a85eefaE $_ZN63_$LT$core..ffi..VaListImpl$u20$as$u20$core..ops..drop..Drop$GT$4drop17h2c1a13365580a4e5E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h02520081dc1789edE $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_str17h070cb47e5bb2d696E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$10write_char17h6f79f869ac97e6d1E $_ZN50_$LT$$RF$mut$u20$W$u20$as$u20$core..fmt..Write$GT$9write_fmt17hd148da967c08c97bE $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17ha7d89a72a3f09b77E $_ZN42_$LT$$RF$T$u20$as$u20$core..fmt..Debug$GT$3fmt17h5847badd239b2b9aE)
  (data $d0 (i32.const 1048576) "WASM_EXISTINGshould be set (WASM_EXISTING): \0a\00\00\00\0d\00\10\00\1f\00\00\00,\00\10\00\01\00\00\00WASM_UNEXISTINGshouldn't be set (WASM_UNEXISTING): \00O\00\10\00$\00\00\00,\00\10\00\01\00\00\00NEW_VALUESet existing var (WASM_EXISTING): \00\8d\00\10\00\22\00\00\00,\00\10\00\01\00\00\00Set unexisting var (WASM_UNEXISTING): \00\00\c0\00\10\00&\00\00\00,\00\10\00\01\00\00\00All vars in env:\0a\00\00\00\f8\00\10\00\11\00\00\00: \00\00\14\01\10\00\00\00\00\00\14\01\10\00\02\00\00\00,\00\10\00\01\00\00\00\04\00\00\00\04\00\00\00\04\00\00\00\05\00\00\00\05\00\00\00\06\00\00\00Some\07\00\00\00\04\00\00\00\04\00\00\00\08\00\00\00None\16\00\00\00\04\00\00\00\04\00\00\00\17\00\00\00\18\00\00\00\19\00\00\00\16\00\00\00\04\00\00\00\04\00\00\00\1a\00\00\00\1b\00\00\00\1c\00\00\00\16\00\00\00\04\00\00\00\04\00\00\00\1d\00\00\00\1e\00\00\00\1f\00\00\00\16\00\00\00\04\00\00\00\04\00\00\00 \00\00\00already borrowedalready mutably borrowed/rustc/19bd93467617a447c22ec32cc1cf14d40cb84ccf/src/libcore/macros/mod.rsassertion failed: `(left == right)`\0a  left: ``,\0a right: ``\00)\02\10\00-\00\00\00V\02\10\00\0c\00\00\00b\02\10\00\01\00\00\00\e0\01\10\00I\00\00\00\0f\00\00\00(\00\00\00!\00\00\00\00\00\00\00\01\00\00\00\22\00\00\00`: \00)\02\10\00-\00\00\00V\02\10\00\0c\00\00\00\9c\02\10\00\03\00\00\00called `Option::unwrap()` on a `None` value\00!\00\00\00\00\00\00\00\01\00\00\00#\00\00\00!\00\00\00\00\00\00\00\01\00\00\00$\00\00\00%\00\00\00\10\00\00\00\04\00\00\00&\00\00\00called `Result::unwrap()` on an `Err` value\00'\00\00\00\08\00\00\00\04\00\00\00(\00\00\00)\00\00\00\08\00\00\00\04\00\00\00*\00\00\00+\00\00\00\0c\00\00\00\04\00\00\00,\00\00\00<::core::macros::panic macros>\00\00p\03\10\00\1e\00\00\00\03\00\00\00\0a\00\00\00assertion failed: end <= lenTried to shrink to a larger capacity\16\00\00\00\04\00\00\00\04\00\00\00\0b\00\00\00src/libstd/thread/mod.rs\f0\03\10\00\18\00\00\00\89\03\00\00\13\00\00\00inconsistent park state\00\02\00\00\00park state changed unexpectedly\004\04\10\00\1f\00\00\00\f0\03\10\00\18\00\00\00\86\03\00\00\0d\00\00\00\f0\03\10\00\18\00\00\00\1f\04\00\00\11\00\00\00failed to generate unique thread ID: bitspace exhaustedthread name may not contain interior null bytes\00\00\f0\03\10\00\18\00\00\00\94\04\00\00\12\00\00\00inconsistent state in unparkRUST_BACKTRACE0failed to get environment variable `\00\1f\05\10\00$\00\00\00\9c\02\10\00\03\00\00\00src/libstd/env.rs\00\00\00T\05\10\00\11\00\00\00\fb\00\00\00\1d\00\00\00failed to set environment variable `` to `\00\00x\05\10\00$\00\00\00\9c\05\10\00\06\00\00\00\9c\02\10\00\03\00\00\00T\05\10\00\11\00\00\00K\01\00\00\09\00\00\00+\00\00\00\0c\00\00\00\04\00\00\00-\00\00\00.\00\00\00.\00\00\00/\00\00\000\00\00\001\00\00\002\00\00\00\22data provided contains a nul bytefailed to write the buffered dataunexpected end of fileother os erroroperation interruptedwrite zerotimed outinvalid datainvalid input parameteroperation would blockentity already existsbroken pipeaddress not availableaddress in usenot connectedconnection abortedconnection resetconnection refusedpermission deniedentity not found\16\06\10\00\00\00\00\00 (os error )\16\06\10\00\00\00\00\00h\07\10\00\0b\00\00\00s\07\10\00\01\00\00\00cannot access stdout during shutdownfailed printing to : \00\00\00\b0\07\10\00\13\00\00\00\c3\07\10\00\02\00\00\00src/libstd/io/stdio.rs\00\00\d8\07\10\00\16\00\00\00\18\03\00\00\09\00\00\00stdoutfailed to write whole buffer\00\003\00\00\00\0c\00\00\00\04\00\00\004\00\00\005\00\00\006\00\00\00formatter error\003\00\00\00\0c\00\00\00\04\00\00\007\00\00\008\00\00\009\00\00\00src/libstd/sync/condvar.rs\00\00d\08\10\00\1a\00\00\00H\02\00\00\12\00\00\00attempted to use a condition variable with two mutexes\00\00\16\00\00\00\04\00\00\00\04\00\00\00:\00\00\00;\00\00\00src/libstd/sync/once.rs\00\dc\08\10\00\17\00\00\00\a8\01\00\00\15\00\00\00assertion failed: state_and_queue & STATE_MASK == RUNNING\00\00\00\dc\08\10\00\17\00\00\00\8c\01\00\00\15\00\00\00Once instance has previously been poisoned\00\00\dc\08\10\00\17\00\00\00\e9\01\00\00\09\00\00\00src/libstd/sys_common/at_exit_imp.rs\8c\09\10\00$\00\00\001\00\00\00\0d\00\00\00assertion failed: queue != DONE\00<\00\00\00\10\00\00\00\04\00\00\00=\00\00\00>\00\00\00note: Some details are omitted, run with `RUST_BACKTRACE=full` for a verbose backtrace.\0a\f4\09\10\00X\00\00\00full<unknown>PoisonError { inner: .. }src/libstd/sys_common/thread_info.rs\00\00z\0a\10\00$\00\00\00(\00\00\00\1a\00\00\00assertion failed: c.borrow().is_none()fatal runtime error: \0a\d6\0a\10\00\15\00\00\00\eb\0a\10\00\01\00\00\00\5cx\00\00\fc\0a\10\00\02\00\00\00\01\00\00\00\00\00\00\00 \00\00\00\08\00\00\00\03\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\03\00\00\00\16\00\00\00\04\00\00\00\04\00\00\00?\00\00\00memory allocation of  bytes failed\00\00<\0b\10\00\15\00\00\00Q\0b\10\00\0d\00\00\00Box<Any><unnamed>\00\00\00!\00\00\00\00\00\00\00\01\00\00\00@\00\00\00A\00\00\00B\00\00\00C\00\00\00D\00\00\00\00\00\00\00E\00\00\00\08\00\00\00\04\00\00\00F\00\00\00G\00\00\00H\00\00\00I\00\00\00J\00\00\00\00\00\00\00thread '' panicked at '', \00\00\cc\0b\10\00\08\00\00\00\d4\0b\10\00\0f\00\00\00\e3\0b\10\00\03\00\00\00\eb\0a\10\00\01\00\00\00note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace.\0a\00\08\0c\10\00O\00\00\00K\00\00\00\10\00\00\00\04\00\00\00L\00\00\00M\00\00\00+\00\00\00\0c\00\00\00\04\00\00\00N\00\00\00'\00\00\00\08\00\00\00\04\00\00\00O\00\00\00P\00\00\00'\00\00\00\08\00\00\00\04\00\00\00Q\00\00\00thread panicked while processing panic. aborting.\0a\00\00\a8\0c\10\002\00\00\00thread panicked while panicking. aborting.\0a\00\e4\0c\10\00+\00\00\00failed to initiate panic, error \18\0d\10\00 \00\00\00NulError\16\00\00\00\04\00\00\00\04\00\00\00R\00\00\00src/libstd/sys/wasi/../wasm/condvar.rs\00\00X\0d\10\00&\00\00\00\17\00\00\00\09\00\00\00can't block with web assemblysrc/libstd/sys/wasi/../wasm/mutex.rs\00\00\00\ad\0d\10\00$\00\00\00\16\00\00\00\09\00\00\00cannot recursively acquire mutexsrc/libstd/sys/wasi/os.rs\00\00\00\04\0e\10\00\19\00\00\00$\00\00\00\0d\00\00\00strerror_r failurerwlock locked for writing\00B\0e\10\00\19\00\00\00operation not supported on wasm yetstack backtrace:\0a\00\00\00\00\00\00\00\00\00\19\12D;\02?,G\14=30\0a\1b\06FKE7\0fI\0e\17\03@\1d<+6\1fJ-\1c\01 %)!\08\0c\15\16\22.\108>\0b41\18/A\099\11#C2B:\05\04&('\0d*\1e5\07\1aH\13$L\ff\00\00Success\00Illegal byte sequence\00Domain error\00Result not representable\00Not a tty\00Permission denied\00Operation not permitted\00No such file or directory\00No such process\00File exists\00Value too large for data type\00No space left on device\00Out of memory\00Resource busy\00Interrupted system call\00Resource temporarily unavailable\00Invalid seek\00Cross-device link\00Read-only file system\00Directory not empty\00Connection reset by peer\00Operation timed out\00Connection refused\00Host is unreachable\00Address in use\00Broken pipe\00I/O error\00No such device or address\00No such device\00Not a directory\00Is a directory\00Text file busy\00Exec format error\00Invalid argument\00Argument list too long\00Symbolic link loop\00Filename too long\00Too many open files in system\00No file descriptors available\00Bad file descriptor\00No child process\00Bad address\00File too large\00Too many links\00No locks available\00Resource deadlock would occur\00State not recoverable\00Previous owner died\00Operation canceled\00Function not implemented\00No message of desired type\00Identifier removed\00Link has been severed\00Protocol error\00Bad message\00Not a socket\00Destination address required\00Message too large\00Protocol wrong type for socket\00Protocol not available\00Protocol not supported\00Not supported\00Address family not supported by protocol\00Address not available\00Network is down\00Network unreachable\00Connection reset by network\00Connection aborted\00No buffer space available\00Socket is connected\00Socket not connected\00Operation already in progress\00Operation in progress\00Stale file handle\00Quota exceeded\00Multihop attempted\00Capabilities insufficient\00No error information\00\00src/liballoc/raw_vec.rscapacity overflow\00\00\16\15\10\00\17\00\00\00\09\03\00\00\05\00\00\00`\00..R\15\10\00\02\00\00\00BorrowErrorBorrowMutError\00\00\00X\00\00\00\00\00\00\00\01\00\00\00Y\00\00\00:\00\00\00P\15\10\00\00\00\00\00\88\15\10\00\01\00\00\00\88\15\10\00\01\00\00\00index out of bounds: the len is  but the index is \00\00\a4\15\10\00 \00\00\00\c4\15\10\00\12\00\00\00called `Option::unwrap()` on a `None` valuesrc/libcore/option.rs\13\16\10\00\15\00\00\00}\01\00\00\15\00\00\00P\15\10\00\00\00\00\00\13\16\10\00\15\00\00\00\a4\04\00\00\05\00\00\00: \00\00P\15\10\00\00\00\00\00P\16\10\00\02\00\00\00src/libcore/result.rs\00\00\00d\16\10\00\15\00\00\00\a4\04\00\00\05\00\00\00src/libcore/slice/mod.rsindex  out of range for slice of length \a4\16\10\00\06\00\00\00\aa\16\10\00\22\00\00\00\8c\16\10\00\18\00\00\00r\0a\00\00\05\00\00\00slice index starts at  but ends at \00\ec\16\10\00\16\00\00\00\02\17\10\00\0d\00\00\00\8c\16\10\00\18\00\00\00x\0a\00\00\05\00\00\00attempted to index slice up to maximum usize\8c\16\10\00\18\00\00\00~\0a\00\00\05\00\00\00assertion failed: broken.is_empty()src/libcore/str/lossy.rs\00\8f\17\10\00\18\00\00\00\9b\00\00\00\11\00\00\00)src/libcore/str/mod.rs\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\04\04\04\04\04\00\00\00\00\00\00\00\00\00\00\00[...]byte index  is out of bounds of `\00\00\00\d4\18\10\00\0b\00\00\00\df\18\10\00\16\00\00\00P\15\10\00\01\00\00\00\b9\17\10\00\16\00\00\00\04\08\00\00\09\00\00\00begin <= end ( <= ) when slicing `\00\00 \19\10\00\0e\00\00\00.\19\10\00\04\00\00\002\19\10\00\10\00\00\00P\15\10\00\01\00\00\00\b9\17\10\00\16\00\00\00\08\08\00\00\05\00\00\00 is not a char boundary; it is inside  (bytes ) of `\d4\18\10\00\0b\00\00\00t\19\10\00&\00\00\00\9a\19\10\00\08\00\00\00\a2\19\10\00\06\00\00\00P\15\10\00\01\00\00\00\b9\17\10\00\16\00\00\00\15\08\00\00\05\00\00\00Z\00\00\00\0c\00\00\00\04\00\00\00[\00\00\00\5c\00\00\00]\00\00\00     {\0a,\0a,  { } }(\0a(,\0a[\00^\00\00\00\04\00\00\00\04\00\00\00_\00\00\00]0x00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899\00^\00\00\00\04\00\00\00\04\00\00\00`\00\00\00a\00\00\00b\00\00\00src/libcore/fmt/mod.rs\00\00\04\1b\10\00\16\00\00\00S\04\00\00(\00\00\00\04\1b\10\00\16\00\00\00^\04\00\00(\00\00\00src/libcore/unicode/bool_trie.rs<\1b\10\00 \00\00\00'\00\00\00\19\00\00\00<\1b\10\00 \00\00\00(\00\00\00 \00\00\00<\1b\10\00 \00\00\00*\00\00\00\19\00\00\00<\1b\10\00 \00\00\00+\00\00\00\18\00\00\00<\1b\10\00 \00\00\00,\00\00\00 \00\00\00\00\01\03\05\05\06\06\03\07\06\08\08\09\11\0a\1c\0b\19\0c\14\0d\12\0e\0d\0f\04\10\03\12\12\13\09\16\01\17\05\18\02\19\03\1a\07\1c\02\1d\01\1f\16 \03+\04,\02-\0b.\010\031\022\01\a7\02\a9\02\aa\04\ab\08\fa\02\fb\05\fd\04\fe\03\ff\09\adxy\8b\8d\a20WX\8b\8c\90\1c\1d\dd\0e\0fKL\fb\fc./?\5c]_\b5\e2\84\8d\8e\91\92\a9\b1\ba\bb\c5\c6\c9\ca\de\e4\e5\ff\00\04\11\12)147:;=IJ]\84\8e\92\a9\b1\b4\ba\bb\c6\ca\ce\cf\e4\e5\00\04\0d\0e\11\12)14:;EFIJ^de\84\91\9b\9d\c9\ce\cf\0d\11)EIWde\8d\91\a9\b4\ba\bb\c5\c9\df\e4\e5\f0\04\0d\11EIde\80\81\84\b2\bc\be\bf\d5\d7\f0\f1\83\85\8b\a4\a6\be\bf\c5\c7\ce\cf\da\dbH\98\bd\cd\c6\ce\cfINOWY^_\89\8e\8f\b1\b6\b7\bf\c1\c6\c7\d7\11\16\17[\5c\f6\f7\fe\ff\80\0dmq\de\df\0e\0f\1fno\1c\1d_}~\ae\af\bb\bc\fa\16\17\1e\1fFGNOXZ\5c^~\7f\b5\c5\d4\d5\dc\f0\f1\f5rs\8ftu\96\97/_&./\a7\af\b7\bf\c7\cf\d7\df\9a@\97\980\8f\1f\c0\c1\ce\ffNOZ[\07\08\0f\10'/\ee\efno7=?BE\90\91\fe\ffSgu\c8\c9\d0\d1\d8\d9\e7\fe\ff\00 _\22\82\df\04\82D\08\1b\04\06\11\81\ac\0e\80\ab5\1e\15\80\e0\03\19\08\01\04/\044\04\07\03\01\07\06\07\11\0aP\0f\12\07U\08\02\04\1c\0a\09\03\08\03\07\03\02\03\03\03\0c\04\05\03\0b\06\01\0e\15\05:\03\11\07\06\05\10\07W\07\02\07\15\0dP\04C\03-\03\01\04\11\06\0f\0c:\04\1d%_ m\04j%\80\c8\05\82\b0\03\1a\06\82\fd\03Y\07\15\0b\17\09\14\0c\14\0cj\06\0a\06\1a\06Y\07+\05F\0a,\04\0c\04\01\031\0b,\04\1a\06\0b\03\80\ac\06\0a\06\1fAL\04-\03t\08<\03\0f\03<\078\08+\05\82\ff\11\18\08/\11-\03 \10!\0f\80\8c\04\82\97\19\0b\15\88\94\05/\05;\07\02\0e\18\09\80\b00t\0c\80\d6\1a\0c\05\80\ff\05\80\b6\05$\0c\9b\c6\0a\d20\10\84\8d\037\09\81\5c\14\80\b8\08\80\c705\04\0a\068\08F\08\0c\06t\0b\1e\03Z\04Y\09\80\83\18\1c\0a\16\09H\08\80\8a\06\ab\a4\0c\17\041\a1\04\81\da&\07\0c\05\05\80\a5\11\81m\10x(*\06L\04\80\8d\04\80\be\03\1b\03\0f\0d\00\06\01\01\03\01\04\02\08\08\09\02\0a\05\0b\02\10\01\11\04\12\05\13\11\14\02\15\02\17\02\19\04\1c\05\1d\08$\01j\03k\02\bc\02\d1\02\d4\0c\d5\09\d6\02\d7\02\da\01\e0\05\e1\02\e8\02\ee \f0\04\f9\06\fa\02\0c';>NO\8f\9e\9e\9f\06\07\096=>V\f3\d0\d1\04\14\1867VW\bd5\ce\cf\e0\12\87\89\8e\9e\04\0d\0e\11\12)14:EFIJNOdeZ\5c\b6\b7\1b\1c\a8\a9\d8\d9\097\90\91\a8\07\0a;>fi\8f\92o_\ee\efZb\9a\9b'(U\9d\a0\a1\a3\a4\a7\a8\ad\ba\bc\c4\06\0b\0c\15\1d:?EQ\a6\a7\cc\cd\a0\07\19\1a\22%>?\c5\c6\04 #%&(38:HJLPSUVXZ\5c^`cefksx}\7f\8a\a4\aa\af\b0\c0\d0\0cr\a3\a4\cb\ccno^\22{\05\03\04-\03e\04\01/.\80\82\1d\031\0f\1c\04$\09\1e\05+\05D\04\0e*\80\aa\06$\04$\04(\084\0b\01\80\90\817\09\16\0a\08\80\989\03c\08\090\16\05!\03\1b\05\01@8\04K\05/\04\0a\07\09\07@ '\04\0c\096\03:\05\1a\07\04\0c\07PI73\0d3\07.\08\0a\81&\1f\80\81(\08*\80\86\17\09N\04\1e\0fC\0e\19\07\0a\06G\09'\09u\0b?A*\06;\05\0a\06Q\06\01\05\10\03\05\80\8b` H\08\0a\80\a6^\22E\0b\0a\06\0d\139\07\0a6,\04\10\80\c0<dS\0c\01\80\a0E\1bH\08S\1d9\81\07F\0a\1d\03GI7\03\0e\08\0a\069\07\0a\816\19\80\c72\0d\83\9bfu\0b\80\c4\8a\bc\84/\8f\d1\82G\a1\b9\829\07*\04\02`&\0aF\0a(\05\13\82\b0[eK\049\07\11@\04\1c\97\f8\08\82\f3\a5\0d\81\1f1\03\11\04\08\81\8c\89\04k\05\0d\03\09\07\10\93`\80\f6\0as\08n\17F\80\9a\14\0cW\09\19\80\87\81G\03\85B\0f\15\85P+\80\d5-\03\1a\04\02\81p:\05\01\85\00\80\d7)L\04\0a\04\02\83\11DL=\80\c2<\06\01\04U\05\1b4\02\81\0e,\04d\0cV\0a\0d\03]\03=9\1d\0d,\04\09\07\02\0e\06\80\9a\83\d6\0a\0d\03\0b\05t\0cY\07\0c\14\0c\048\08\0a\06(\08\1eRw\031\03\80\a6\0c\14\04\03\05\03\0d\06\85j\00\00\00\00\00\00\00\00\00\c0\fb\ef>\00\00\00\00\00\0e\00\00\00\00\00\00\00\00\00\00\00\00\00\00\f8\ff\fb\ff\ff\ff\07\00\00\00\00\00\00\14\fe!\fe\00\0c\00\00\00\02\00\00\00\00\00\00P\1e \80\00\0c\00\00@\06\00\00\00\00\00\00\10\869\02\00\00\00#\00\be!\00\00\0c\00\00\fc\02\00\00\00\00\00\00\d0\1e \c0\00\0c\00\00\00\04\00\00\00\00\00\00@\01 \80\00\00\00\00\00\11\00\00\00\00\00\00\c0\c1=`\00\0c\00\00\00\02\00\00\00\00\00\00\90D0`\00\0c\00\00\00\03\00\00\00\00\00\00X\1e \80\00\0c\00\00\00\00\84\5c\80\00\00\00\00\00\00\00\00\00\00\f2\07\80\7f\00\00\00\00\00\00\00\00\00\00\00\00\f2\1f\00?\00\00\00\00\00\00\00\00\00\03\00\00\a0\02\00\00\00\00\00\00\fe\7f\df\e0\ff\fe\ff\ff\ff\1f@\00\00\00\00\00\00\00\00\00\00\00\00\e0\fdf\00\00\00\c3\01\00\1e\00d \00 \00\00\00\00\00\00\00\e0\00\00\00\00\00\00\1c\00\00\00\1c\00\00\00\0c\00\00\00\0c\00\00\00\00\00\00\00\b0?@\fe\0f \00\00\00\00\008\00\00\00\00\00\00`\00\00\00\00\02\00\00\00\00\00\00\87\01\04\0e\00\00\80\09\00\00\00\00\00\00@\7f\e5\1f\f8\9f\00\00\00\00\00\00\ff\7f\0f\00\00\00\00\00\f0\17\04\00\00\00\00\f8\0f\00\03\00\00\00<;\00\00\00\00\00\00@\a3\03\00\00\00\00\00\00\f0\cf\00\00\00\f7\ff\fd!\10\03\ff\ff\ff\ff\ff\ff\ff\fb\00\10\00\00\00\00\00\00\00\00\ff\ff\ff\ff\01\00\00\00\00\00\00\80\03\00\00\00\00\00\00\00\00\80\00\00\00\00\ff\ff\ff\ff\00\00\00\00\00\fc\00\00\00\00\00\06\00\00\00\00\00\00\00\00\00\80\f7?\00\00\00\c0\00\00\00\00\00\00\00\00\00\00\03\00D\08\00\00`\00\00\000\00\00\00\ff\ff\03\80\00\00\00\00\c0?\00\00\80\ff\03\00\00\00\00\00\07\00\00\00\00\00\c83\00\00\00\00 \00\00\00\00\00\00\00\00~f\00\08\10\00\00\00\00\00\10\00\00\00\00\00\00\9d\c1\02\00\00\00\000@\00\00\00\00\00 !\00\00\00\00\00@\00\00\00\00\ff\ff\00\00\ff\ff\00\00\00\00\00\00\00\00\00\01\00\00\00\02\00\03\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\04\00\00\05\00\00\00\00\00\00\00\00\06\00\00\00\00\00\00\00\00\07\00\00\08\09\0a\00\0b\0c\0d\0e\0f\00\00\10\11\12\00\00\13\14\15\16\00\00\17\18\19\1a\1b\00\1c\00\00\00\1d\00\00\00\00\00\00\1e\1f !\00\00\00\00\00\22\00#\00$%&\00\00\00\00'\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00()\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00*+\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00,\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00-.\00\00/\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00012\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\003\00\00\00)\00\00\00\00\00\004\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\005\006\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\0078\00\008889\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00 \00\00\00\00\01\00\00\00\00\00\00\00\00\00\c0\07n\f0\00\00\00\00\00\87\00\00\00\00`\00\00\00\00\00\00\00\f0\00\00\00\c0\ff\01\00\00\00\00\00\02\00\00\00\00\00\00\ff\7f\00\00\00\00\00\00\80\03\00\00\00\00\00x\06\07\00\00\00\80\ef\1f\00\00\00\00\00\00\00\08\00\03\00\00\00\00\00\c0\7f\00\1e\00\00\00\00\00\00\00\00\00\00\00\80\d3@\00\00\00\80\f8\07\00\00\03\00\00\00\00\00\00X\01\00\80\00\c0\1f\1f\00\00\00\00\00\00\00\00\ff\5c\00\00@\00\00\00\00\00\00\00\00\00\00\f9\a5\0d\00\00\00\00\00\00\00\00\00\00\00\00\80<\b0\01\00\000\00\00\00\00\00\00\00\00\00\00\f8\a7\01\00\00\00\00\00\00\00\00\00\00\00\00(\bf\00\00\00\00\e0\bc\0f\00\00\00\00\00\00\00\80\ff\06\00\00\f0\0c\01\00\00\00\fe\07\00\00\00\00\f8y\80\00~\0e\00\00\00\00\00\fc\7f\03\00\00\00\00\00\00\00\00\00\00\7f\bf\00\00\fc\ff\ff\fcm\00\00\00\00\00\00\00~\b4\bf\00\00\00\00\00\00\00\00\00\a3\00\00\00\00\00\00\00\00\00\00\00\18\00\00\00\00\00\00\00\1f\00\00\00\00\00\00\00\7f\00\00\80\00\00\00\00\00\00\00\80\07\00\00\00\00\00\00\00\00`\00\00\00\00\00\00\00\00\a0\c3\07\f8\e7\0f\00\00\00<\00\00\1c\00\00\00\00\00\00\00\ff\ff\ff\ff\ff\ff\7f\f8\ff\ff\ff\ff\ff\1f \00\10\00\00\f8\fe\ff\00\00\7f\ff\ff\f9\db\07\00\00\00\00\00\00\00\f0\00\00\00\00\7f\00\00\00\00\00\f0\07\00\00\00\00\00\00\00\00\00\00\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\ff\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\f8\03\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\fe\ff\ff\ff\ff\bf\b6\00\00\00\00\00\00\00\00\00\ff\07\00\00\00\00\00\f8\ff\ff\00\00\01\00\00\00\00\00\00\00\00\00\00\00\c0\9f\9f=\00\00\00\00\02\00\00\00\ff\ff\ff\07\00\00\00\00\00\00\00\00\00\00\c0\ff\01\00\00\00\00\00\00\f8\0f \e8 \10\00J\00\00\008#\10\00\00\02\00\008%\10\00:\00\00\00\00\01\02\03\04\05\06\07\08\09\08\0a\0b\0c\0d\0e\0f\10\11\12\13\14\02\15\16\17\18\19\1a\1b\1c\1d\1e\1f \02\02\02\02\02\02\02\02\02\02!\02\02\02\02\02\02\02\02\02\02\02\02\02\02\22#$%&\02'\02(\02\02\02)*+\02,-./0\02\021\02\02\022\02\02\02\02\02\02\02\023\02\024\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\025\026\027\02\02\02\02\02\02\02\028\029\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02:;<\02\02\02\02=\02\02>?@ABCDEF\02\02\02G\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02H\02\02\02\02\02\02\02\02\02\02\02I\02\02\02\02\02;\02\00\01\02\02\02\02\03\02\02\02\02\04\02\05\06\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\07\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02^\00\00\00\04\00\00\00\04\00\00\00c\00\00\00SomeNoneUtf8Errorvalid_up_toerror_len\00\00\00^\00\00\00\04\00\00\00\04\00\00\00d\00\00\00")
  (data $d1 (i32.const 1060168) "\01\00\00\00\00\00\00\00\01\00\00\00\b4/\10\00")
  (data $d2 (i32.const 1060184) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"))
