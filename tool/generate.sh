#!/bin/sh
./macosx/generator-bin/protoc -o./out/c/mqtt.pb ./proto/mqtt.proto
python ./macosx/generator/nanopb_generator.py ./out/c/mqtt.pb
./macosx/generator-bin/protoc --proto_path=./proto  --js_out=import_style=commonjs,binary:./out/node ./proto/mqtt.proto