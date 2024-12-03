# YOLOv8 on [tinygrad](https://github.com/tinygrad/tinygrad) powered by WebGPU

This is a WebGPU port of YOLOv8 using [tinygrad](https://github.com/tinygrad/tinygrad).
Try it [here](https://wpmed92.github.io/yolov8-webgpu-tinygrad/)!

## Compiling YoloV8

The model has been exported using a small compile script in the tinygrad repo. It sets the default device to WebGPU, then exports the kernels of the model in a compact `net.js` file, alongside the model weights in `.safetensor` format.

## License

MIT