SOURCES := $(shell find ./ -name '*.rs' | sed -e "s/\.rs/\.wasm/g")

%.wasm: $(addprefix ./,%.rs)
	rustc +nightly $< --target=wasm32-wasi -o wasi_snapshot_preview1/$@

all: $(SOURCES)
