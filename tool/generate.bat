
./win32/generator-bin/protoc.exe -o./out/c/mqtt.pb ./proto/mqtt.proto
python ./win32/generator/nanopb_generator.py ./out/c/mqtt.pb
./win32/generator-bin/protoc.exe --proto_path=./proto  --js_out=import_style=commonjs,binary:./out/node ./proto/mqtt.proto