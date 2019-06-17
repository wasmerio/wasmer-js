SOURCES := $(shell find ./ -name '*.rs')

%.rs: $(addprefix ./,%.wasm)
	rustc +nightly $@ --target=wasm32-wasi -o $<

all: $(SOURCES)
