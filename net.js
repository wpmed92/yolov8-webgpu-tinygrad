
const getTensorBuffer = (safetensorBuffer, tensorMetadata) => {
    return safetensorBuffer.subarray(...tensorMetadata.data_offsets);
  }

const getTensorMetadata = (safetensorBuffer) => {
    const metadataLength = Number(new DataView(safetensorBuffer.buffer).getBigUint64(0, true));
    const metadata = JSON.parse(new TextDecoder("utf8").decode(safetensorBuffer.subarray(8, 8 + metadataLength)));
    return Object.fromEntries(Object.entries(metadata).filter(([k, v]) => k !== "__metadata__").map(([k, v]) => [k, {...v, data_offsets: v.data_offsets.map(x => 8 + metadataLength + x)}]));
  };

const createEmptyBuf = (device, size) => {
    return device.createBuffer({size, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST });
};

const createInfinityUniformBuf = (device) => {
  const size = 4;
  const buf = device.createBuffer({
    mappedAtCreation: true,
    size,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
  });
  new Float32Array(buf.getMappedRange())[0] = Infinity;
  buf.unmap();
  return buf;
};

const createWeightBuf = (device, size, data) => {
  const buf = device.createBuffer({ mappedAtCreation: true, size, usage: GPUBufferUsage.STORAGE });
  new Uint8Array(buf.getMappedRange()).set(data);
  buf.unmap();
  return buf;
};

const addComputePass = (device, commandEncoder, pipeline, layout, infinityUniformBuf, bufs, workgroup) => {
  const bindGroup = device.createBindGroup({
    layout: layout,
    entries: [
      { binding: 0, resource: { buffer: infinityUniformBuf } },
      ...bufs.map((buffer, index) => ({ binding: index + 1, resource: { buffer } }))
    ]
  });

  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(...workgroup);
  passEncoder.end();
};

const r_13_4_13_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var lidx0 = i32(lindex.x); /* 4 */
  data0[((lidx0+(gidx0<<2)))] = ((f32((gidx0+gidx0+((lidx0+3)>>2)+gidx0+((lidx0+1)>>2)+gidx0+((lidx0+2)>>2))))+0.5f);
}`;

const r_13_2_26 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@compute @workgroup_size(2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var lidx0 = i32(lindex.x); /* 2 */
  var alu0 = (lidx0+(gidx0<<1));
  data0[(alu0)] = ((f32((select(0,1,((gidx0<12)!=true))+select(0,1,((alu0<25)!=true))+select(0,1,((alu0<23)!=true))+select(0,1,((gidx0<11)!=true))+select(0,1,((alu0<21)!=true))+select(0,1,((gidx0<10)!=true))+select(0,1,((alu0<19)!=true))+select(0,1,((gidx0<9)!=true))+select(0,1,((alu0<17)!=true))+select(0,1,((gidx0<8)!=true))+select(0,1,((alu0<15)!=true))+select(0,1,((gidx0<7)!=true))+select(0,1,((alu0<13)!=true))+select(0,1,((gidx0<6)!=true))+select(0,1,((alu0<11)!=true))+select(0,1,((gidx0<5)!=true))+select(0,1,((alu0<9)!=true))+select(0,1,((gidx0<4)!=true))+select(0,1,((alu0<7)!=true))+select(0,1,((gidx0<3)!=true))+select(0,1,((alu0<5)!=true))+select(0,1,((gidx0<2)!=true))+select(0,1,((alu0<3)!=true))+select(0,1,((gidx0<1)!=true))+select(0,1,(((gidx0+lidx0)<1)!=true)))))+0.5f);
}`;

const r_13_13 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  data0[(gidx0)] = ((f32((select(0,1,((gidx0<11)!=true))+select(0,1,((gidx0<12)!=true))+select(0,1,((gidx0<10)!=true))+select(0,1,((gidx0<9)!=true))+select(0,1,((gidx0<8)!=true))+select(0,1,((gidx0<7)!=true))+select(0,1,((gidx0<6)!=true))+select(0,1,((gidx0<5)!=true))+select(0,1,((gidx0<4)!=true))+select(0,1,((gidx0<3)!=true))+select(0,1,((gidx0<2)!=true))+select(0,1,((gidx0<1)!=true)))))+0.5f);
}`;

const E_27_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 27 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = ((gidx0<<4)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_36_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 36 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_8_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(8) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var lidx0 = i32(lindex.x); /* 8 */
  var alu0 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_8_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_18_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 18 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_12_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 12 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_144_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 144 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_16_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_32_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 32 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_72_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 72 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_64_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 64 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_576_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 576 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_128_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 128 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_288_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 288 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_256_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 256 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_2304_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 2304 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_2_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_512_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 512 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_1152_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1152 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_768_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 768 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_1024_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1024 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_384_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 384 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_192_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 192 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_96_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 96 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_48_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 48 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_360_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 360 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_5_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = ((gidx0<<4)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_450_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 450 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_50_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 50 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_576_32_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 576 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_720_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 720 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_1152_32_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1152 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_1440_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1440 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<<7)+(lidx0<<2));
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_4_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<u32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data1[(alu0)>>1]))[(alu0)&1];
  var alu1 = (alu0+1);
  var val1 = unpack2x16float(bitcast<u32>(data1[(alu1)>>1]))[(alu1)&1];
  var alu2 = (alu0+2);
  var val2 = unpack2x16float(bitcast<u32>(data1[(alu2)>>1]))[(alu2)&1];
  var alu3 = (alu0+3);
  var val3 = unpack2x16float(bitcast<u32>(data1[(alu3)>>1]))[(alu3)&1];
  data0[(alu1)] = (f32(val1));
  data0[(alu2)] = (f32(val2));
  data0[(alu3)] = (f32(val3));
  data0[(alu0)] = (f32(val0));
}`;

const E_1183_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@compute @workgroup_size(1) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var alu0 = (gidx0*3);
  var alu1 = (gidx0<901);
  var alu2 = (gidx0<902);
  var alu3 = (gidx0<1126);
  var alu4 = (gidx0<1127);
  var alu5 = (alu1!=true);
  var alu6 = select(0,8,alu1);
  var alu7 = select(0,32,(alu4!=true));
  data0[((alu0+2))] = (f32((alu6+select(0,16,(alu3&alu5))+select(0,32,(alu3!=true)))));
  data0[((alu0+1))] = (f32((alu6+select(0,16,(alu4&alu5))+alu7)));
  data0[(alu0)] = (f32((select(0,8,alu2)+select(0,16,(alu4&(alu2!=true)))+alu7)));
}`;

const r_2_13_13_2_16_4_3_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(2,16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 2 */
  var lidx1 = i32(lindex.y); /* 16 */
  var lidx2 = i32(lindex.z); /* 4 */
  var alu0 = (((gidx0+lidx2)<1)!=true);
  var alu1 = (((gidx1+lidx1)<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 3; ridx0++) {
    var alu2 = ((gidx2*216)+(lidx0*108)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+27))];
    var val10 = data2[((alu2+28))];
    var val11 = data2[((alu2+29))];
    var val12 = data2[((alu2+30))];
    var val13 = data2[((alu2+31))];
    var val14 = data2[((alu2+32))];
    var val15 = data2[((alu2+33))];
    var val16 = data2[((alu2+34))];
    var val17 = data2[((alu2+35))];
    var val18 = data2[((alu2+54))];
    var val19 = data2[((alu2+55))];
    var val20 = data2[((alu2+56))];
    var val21 = data2[((alu2+57))];
    var val22 = data2[((alu2+58))];
    var val23 = data2[((alu2+59))];
    var val24 = data2[((alu2+60))];
    var val25 = data2[((alu2+61))];
    var val26 = data2[((alu2+62))];
    var val27 = data2[((alu2+81))];
    var val28 = data2[((alu2+82))];
    var val29 = data2[((alu2+83))];
    var val30 = data2[((alu2+84))];
    var val31 = data2[((alu2+85))];
    var val32 = data2[((alu2+86))];
    var val33 = data2[((alu2+87))];
    var val34 = data2[((alu2+88))];
    var val35 = data2[((alu2+89))];
    var alu3 = ((gidx1*13312)+(lidx1*832)+(ridx0*173056)+(gidx0<<5)+(lidx2<<3));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-417))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-416))], alu1);
    var val39 = select(0.0f, data1[((alu3+-415))], alu1);
    var val40 = select(0.0f, data1[((alu3+-414))], alu1);
    var val41 = select(0.0f, data1[((alu3+-413))], alu1);
    var val42 = select(0.0f, data1[((alu3+-412))], alu1);
    var val43 = select(0.0f, data1[((alu3+-411))], alu1);
    var val44 = select(0.0f, data1[((alu3+-410))], alu1);
    var val45 = select(0.0f, data1[((alu3+-409))], alu1);
    var val46 = select(0.0f, data1[((alu3+-1))], alu0);
    var val47 = data1[((alu3+1))];
    var val48 = data1[((alu3+2))];
    var val49 = data1[((alu3+3))];
    var val50 = data1[((alu3+4))];
    var val51 = data1[((alu3+5))];
    var val52 = data1[((alu3+6))];
    var val53 = data1[((alu3+7))];
    var val54 = select(0.0f, data1[((alu3+415))], alu0);
    var val55 = data1[((alu3+416))];
    var val56 = data1[((alu3+417))];
    var val57 = data1[((alu3+418))];
    var val58 = data1[((alu3+419))];
    var val59 = data1[((alu3+420))];
    var val60 = data1[((alu3+421))];
    var val61 = data1[((alu3+422))];
    var val62 = data1[((alu3+423))];
    acc0 = (acc0+(val37*val0)+(val46*val3)+(val54*val6)+(val38*val1)+(val36*val4)+(val55*val7)+(val39*val2)+(val47*val5)+(val56*val8));
    acc1 = (acc1+(val37*val9)+(val46*val12)+(val54*val15)+(val38*val10)+(val36*val13)+(val55*val16)+(val39*val11)+(val47*val14)+(val56*val17));
    acc2 = (acc2+(val37*val18)+(val46*val21)+(val54*val24)+(val38*val19)+(val36*val22)+(val55*val25)+(val39*val20)+(val47*val23)+(val56*val26));
    acc3 = (acc3+(val37*val27)+(val46*val30)+(val54*val33)+(val38*val28)+(val36*val31)+(val55*val34)+(val39*val29)+(val47*val32)+(val56*val35));
    acc4 = (acc4+(val39*val0)+(val47*val3)+(val56*val6)+(val40*val1)+(val48*val4)+(val57*val7)+(val41*val2)+(val49*val5)+(val58*val8));
    acc5 = (acc5+(val39*val9)+(val47*val12)+(val56*val15)+(val40*val10)+(val48*val13)+(val57*val16)+(val41*val11)+(val49*val14)+(val58*val17));
    acc6 = (acc6+(val39*val18)+(val47*val21)+(val56*val24)+(val40*val19)+(val48*val22)+(val57*val25)+(val41*val20)+(val49*val23)+(val58*val26));
    acc7 = (acc7+(val39*val27)+(val47*val30)+(val56*val33)+(val40*val28)+(val48*val31)+(val57*val34)+(val41*val29)+(val49*val32)+(val58*val35));
    acc8 = (acc8+(val41*val0)+(val49*val3)+(val58*val6)+(val42*val1)+(val50*val4)+(val59*val7)+(val43*val2)+(val51*val5)+(val60*val8));
    acc9 = (acc9+(val41*val9)+(val49*val12)+(val58*val15)+(val42*val10)+(val50*val13)+(val59*val16)+(val43*val11)+(val51*val14)+(val60*val17));
    acc10 = (acc10+(val41*val18)+(val49*val21)+(val58*val24)+(val42*val19)+(val50*val22)+(val59*val25)+(val43*val20)+(val51*val23)+(val60*val26));
    acc11 = (acc11+(val41*val27)+(val49*val30)+(val58*val33)+(val42*val28)+(val50*val31)+(val59*val34)+(val43*val29)+(val51*val32)+(val60*val35));
    acc12 = (acc12+(val43*val0)+(val51*val3)+(val60*val6)+(val44*val1)+(val52*val4)+(val61*val7)+(val45*val2)+(val53*val5)+(val62*val8));
    acc13 = (acc13+(val43*val9)+(val51*val12)+(val60*val15)+(val44*val10)+(val52*val13)+(val61*val16)+(val45*val11)+(val53*val14)+(val62*val17));
    acc14 = (acc14+(val43*val18)+(val51*val21)+(val60*val24)+(val44*val19)+(val52*val22)+(val61*val25)+(val45*val20)+(val53*val23)+(val62*val26));
    acc15 = (acc15+(val43*val27)+(val51*val30)+(val60*val33)+(val44*val28)+(val52*val31)+(val61*val34)+(val45*val29)+(val53*val32)+(val62*val35));
  }
  var alu21 = ((gidx2<<3)+(lidx0<<2));
  var val63 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val64 = data3[(alu21)];
  var val65 = data4[(alu21)];
  var val66 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val67 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val68 = data3[(alu22)];
  var val69 = data4[(alu22)];
  var val70 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val71 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val72 = data3[(alu23)];
  var val73 = data4[(alu23)];
  var val74 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val75 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val76 = data3[(alu24)];
  var val77 = data4[(alu24)];
  var val78 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val67+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val71+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val75+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val63+(f32(0.001f)))))));
  var alu25 = ((gidx1*3328)+(gidx2*346112)+(gidx0<<4)+(lidx0*173056)+(lidx1*208)+(lidx2<<2));
  var alu26 = (val66+(cast3*val65*(acc0-val64)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val70+(cast0*val69*(acc1-val68)));
  data0[((alu25+43264))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val74+(cast1*val73*(acc2-val72)));
  data0[((alu25+86528))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val78+(cast2*val77*(acc3-val76)));
  data0[((alu25+129792))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val66+(cast3*val65*(acc4-val64)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val70+(cast0*val69*(acc5-val68)));
  data0[((alu25+43265))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val74+(cast1*val73*(acc6-val72)));
  data0[((alu25+86529))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val78+(cast2*val77*(acc7-val76)));
  data0[((alu25+129793))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val66+(cast3*val65*(acc8-val64)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val70+(cast0*val69*(acc9-val68)));
  data0[((alu25+43266))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val74+(cast1*val73*(acc10-val72)));
  data0[((alu25+86530))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val78+(cast2*val77*(acc11-val76)));
  data0[((alu25+129794))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val66+(cast3*val65*(acc12-val64)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val70+(cast0*val69*(acc13-val68)));
  data0[((alu25+43267))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val74+(cast1*val73*(acc14-val72)));
  data0[((alu25+86531))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val78+(cast2*val77*(acc15-val76)));
  data0[((alu25+129795))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_13_13_8_8_2_16_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(8,8,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 8 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (((gidx0+lidx2)<1)!=true);
  var alu1 = (((gidx1+lidx1)<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu2 = ((lidx0*576)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+144))];
    var val10 = data2[((alu2+145))];
    var val11 = data2[((alu2+146))];
    var val12 = data2[((alu2+147))];
    var val13 = data2[((alu2+148))];
    var val14 = data2[((alu2+149))];
    var val15 = data2[((alu2+150))];
    var val16 = data2[((alu2+151))];
    var val17 = data2[((alu2+152))];
    var val18 = data2[((alu2+288))];
    var val19 = data2[((alu2+289))];
    var val20 = data2[((alu2+290))];
    var val21 = data2[((alu2+291))];
    var val22 = data2[((alu2+292))];
    var val23 = data2[((alu2+293))];
    var val24 = data2[((alu2+294))];
    var val25 = data2[((alu2+295))];
    var val26 = data2[((alu2+296))];
    var val27 = data2[((alu2+432))];
    var val28 = data2[((alu2+433))];
    var val29 = data2[((alu2+434))];
    var val30 = data2[((alu2+435))];
    var val31 = data2[((alu2+436))];
    var val32 = data2[((alu2+437))];
    var val33 = data2[((alu2+438))];
    var val34 = data2[((alu2+439))];
    var val35 = data2[((alu2+440))];
    var alu3 = ((gidx1*3328)+(lidx1*416)+(ridx0*43264)+(gidx0<<4)+(lidx2<<3));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-209))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-208))], alu1);
    var val39 = select(0.0f, data1[((alu3+-207))], alu1);
    var val40 = select(0.0f, data1[((alu3+-206))], alu1);
    var val41 = select(0.0f, data1[((alu3+-205))], alu1);
    var val42 = select(0.0f, data1[((alu3+-204))], alu1);
    var val43 = select(0.0f, data1[((alu3+-203))], alu1);
    var val44 = select(0.0f, data1[((alu3+-202))], alu1);
    var val45 = select(0.0f, data1[((alu3+-201))], alu1);
    var val46 = select(0.0f, data1[((alu3+-1))], alu0);
    var val47 = data1[((alu3+1))];
    var val48 = data1[((alu3+2))];
    var val49 = data1[((alu3+3))];
    var val50 = data1[((alu3+4))];
    var val51 = data1[((alu3+5))];
    var val52 = data1[((alu3+6))];
    var val53 = data1[((alu3+7))];
    var val54 = select(0.0f, data1[((alu3+207))], alu0);
    var val55 = data1[((alu3+208))];
    var val56 = data1[((alu3+209))];
    var val57 = data1[((alu3+210))];
    var val58 = data1[((alu3+211))];
    var val59 = data1[((alu3+212))];
    var val60 = data1[((alu3+213))];
    var val61 = data1[((alu3+214))];
    var val62 = data1[((alu3+215))];
    acc0 = (acc0+(val37*val0)+(val46*val3)+(val54*val6)+(val38*val1)+(val36*val4)+(val55*val7)+(val39*val2)+(val47*val5)+(val56*val8));
    acc1 = (acc1+(val37*val9)+(val46*val12)+(val54*val15)+(val38*val10)+(val36*val13)+(val55*val16)+(val39*val11)+(val47*val14)+(val56*val17));
    acc2 = (acc2+(val37*val18)+(val46*val21)+(val54*val24)+(val38*val19)+(val36*val22)+(val55*val25)+(val39*val20)+(val47*val23)+(val56*val26));
    acc3 = (acc3+(val37*val27)+(val46*val30)+(val54*val33)+(val38*val28)+(val36*val31)+(val55*val34)+(val39*val29)+(val47*val32)+(val56*val35));
    acc4 = (acc4+(val39*val0)+(val47*val3)+(val56*val6)+(val40*val1)+(val48*val4)+(val57*val7)+(val41*val2)+(val49*val5)+(val58*val8));
    acc5 = (acc5+(val39*val9)+(val47*val12)+(val56*val15)+(val40*val10)+(val48*val13)+(val57*val16)+(val41*val11)+(val49*val14)+(val58*val17));
    acc6 = (acc6+(val39*val18)+(val47*val21)+(val56*val24)+(val40*val19)+(val48*val22)+(val57*val25)+(val41*val20)+(val49*val23)+(val58*val26));
    acc7 = (acc7+(val39*val27)+(val47*val30)+(val56*val33)+(val40*val28)+(val48*val31)+(val57*val34)+(val41*val29)+(val49*val32)+(val58*val35));
    acc8 = (acc8+(val41*val0)+(val49*val3)+(val58*val6)+(val42*val1)+(val50*val4)+(val59*val7)+(val43*val2)+(val51*val5)+(val60*val8));
    acc9 = (acc9+(val41*val9)+(val49*val12)+(val58*val15)+(val42*val10)+(val50*val13)+(val59*val16)+(val43*val11)+(val51*val14)+(val60*val17));
    acc10 = (acc10+(val41*val18)+(val49*val21)+(val58*val24)+(val42*val19)+(val50*val22)+(val59*val25)+(val43*val20)+(val51*val23)+(val60*val26));
    acc11 = (acc11+(val41*val27)+(val49*val30)+(val58*val33)+(val42*val28)+(val50*val31)+(val59*val34)+(val43*val29)+(val51*val32)+(val60*val35));
    acc12 = (acc12+(val43*val0)+(val51*val3)+(val60*val6)+(val44*val1)+(val52*val4)+(val61*val7)+(val45*val2)+(val53*val5)+(val62*val8));
    acc13 = (acc13+(val43*val9)+(val51*val12)+(val60*val15)+(val44*val10)+(val52*val13)+(val61*val16)+(val45*val11)+(val53*val14)+(val62*val17));
    acc14 = (acc14+(val43*val18)+(val51*val21)+(val60*val24)+(val44*val19)+(val52*val22)+(val61*val25)+(val45*val20)+(val53*val23)+(val62*val26));
    acc15 = (acc15+(val43*val27)+(val51*val30)+(val60*val33)+(val44*val28)+(val52*val31)+(val61*val34)+(val45*val29)+(val53*val32)+(val62*val35));
  }
  var alu21 = (lidx0<<2);
  var val63 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val64 = data3[(alu21)];
  var val65 = data4[(alu21)];
  var val66 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val67 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val68 = data3[(alu22)];
  var val69 = data4[(alu22)];
  var val70 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val71 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val72 = data3[(alu23)];
  var val73 = data4[(alu23)];
  var val74 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val75 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val76 = data3[(alu24)];
  var val77 = data4[(alu24)];
  var val78 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val67+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val71+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val75+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val63+(f32(0.001f)))))));
  var alu25 = ((gidx0<<3)+(gidx1*832)+(lidx0*43264)+(lidx1*104)+(lidx2<<2));
  var alu26 = (val66+(cast3*val65*(acc0-val64)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val70+(cast0*val69*(acc1-val68)));
  data0[((alu25+10816))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val74+(cast1*val73*(acc2-val72)));
  data0[((alu25+21632))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val78+(cast2*val77*(acc3-val76)));
  data0[((alu25+32448))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val66+(cast3*val65*(acc4-val64)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val70+(cast0*val69*(acc5-val68)));
  data0[((alu25+10817))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val74+(cast1*val73*(acc6-val72)));
  data0[((alu25+21633))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val78+(cast2*val77*(acc7-val76)));
  data0[((alu25+32449))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val66+(cast3*val65*(acc8-val64)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val70+(cast0*val69*(acc9-val68)));
  data0[((alu25+10818))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val74+(cast1*val73*(acc10-val72)));
  data0[((alu25+21634))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val78+(cast2*val77*(acc11-val76)));
  data0[((alu25+32450))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val66+(cast3*val65*(acc12-val64)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val70+(cast0*val69*(acc13-val68)));
  data0[((alu25+10819))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val74+(cast1*val73*(acc14-val72)));
  data0[((alu25+21635))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val78+(cast2*val77*(acc15-val76)));
  data0[((alu25+32451))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_169_8_16_4_4_32 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(8,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 16 */
  var alu0 = (gidx0<<6);
  var alu1 = (lidx0<<2);
  var val0 = unpack2x16float(bitcast<u32>(data5[(alu1)>>1]))[(alu1)&1];
  var val1 = data3[(alu1)];
  var val2 = data4[(alu1)];
  var val3 = data6[(alu1)];
  var alu2 = (alu1+1);
  var val4 = unpack2x16float(bitcast<u32>(data5[(alu2)>>1]))[(alu2)&1];
  var val5 = data3[(alu2)];
  var val6 = data4[(alu2)];
  var val7 = data6[(alu2)];
  var alu3 = (alu1+2);
  var val8 = unpack2x16float(bitcast<u32>(data5[(alu3)>>1]))[(alu3)&1];
  var val9 = data3[(alu3)];
  var val10 = data4[(alu3)];
  var val11 = data6[(alu3)];
  var alu4 = (alu1+3);
  var val12 = unpack2x16float(bitcast<u32>(data5[(alu4)>>1]))[(alu4)&1];
  var val13 = data3[(alu4)];
  var val14 = data4[(alu4)];
  var val15 = data6[(alu4)];
  var alu5 = (lidx0<<7);
  var val16 = data2[(alu5)];
  var val17 = data2[((alu5+1))];
  var val18 = data2[((alu5+2))];
  var val19 = data2[((alu5+3))];
  var val20 = data2[((alu5+4))];
  var val21 = data2[((alu5+5))];
  var val22 = data2[((alu5+6))];
  var val23 = data2[((alu5+7))];
  var val24 = data2[((alu5+8))];
  var val25 = data2[((alu5+9))];
  var val26 = data2[((alu5+10))];
  var val27 = data2[((alu5+11))];
  var val28 = data2[((alu5+12))];
  var val29 = data2[((alu5+13))];
  var val30 = data2[((alu5+14))];
  var val31 = data2[((alu5+15))];
  var val32 = data2[((alu5+16))];
  var val33 = data2[((alu5+17))];
  var val34 = data2[((alu5+18))];
  var val35 = data2[((alu5+19))];
  var val36 = data2[((alu5+20))];
  var val37 = data2[((alu5+21))];
  var val38 = data2[((alu5+22))];
  var val39 = data2[((alu5+23))];
  var val40 = data2[((alu5+24))];
  var val41 = data2[((alu5+25))];
  var val42 = data2[((alu5+26))];
  var val43 = data2[((alu5+27))];
  var val44 = data2[((alu5+28))];
  var val45 = data2[((alu5+29))];
  var val46 = data2[((alu5+30))];
  var val47 = data2[((alu5+31))];
  var val48 = data2[((alu5+32))];
  var val49 = data2[((alu5+33))];
  var val50 = data2[((alu5+34))];
  var val51 = data2[((alu5+35))];
  var val52 = data2[((alu5+36))];
  var val53 = data2[((alu5+37))];
  var val54 = data2[((alu5+38))];
  var val55 = data2[((alu5+39))];
  var val56 = data2[((alu5+40))];
  var val57 = data2[((alu5+41))];
  var val58 = data2[((alu5+42))];
  var val59 = data2[((alu5+43))];
  var val60 = data2[((alu5+44))];
  var val61 = data2[((alu5+45))];
  var val62 = data2[((alu5+46))];
  var val63 = data2[((alu5+47))];
  var val64 = data2[((alu5+48))];
  var val65 = data2[((alu5+49))];
  var val66 = data2[((alu5+50))];
  var val67 = data2[((alu5+51))];
  var val68 = data2[((alu5+52))];
  var val69 = data2[((alu5+53))];
  var val70 = data2[((alu5+54))];
  var val71 = data2[((alu5+55))];
  var val72 = data2[((alu5+56))];
  var val73 = data2[((alu5+57))];
  var val74 = data2[((alu5+58))];
  var val75 = data2[((alu5+59))];
  var val76 = data2[((alu5+60))];
  var val77 = data2[((alu5+61))];
  var val78 = data2[((alu5+62))];
  var val79 = data2[((alu5+63))];
  var val80 = data2[((alu5+64))];
  var val81 = data2[((alu5+65))];
  var val82 = data2[((alu5+66))];
  var val83 = data2[((alu5+67))];
  var val84 = data2[((alu5+68))];
  var val85 = data2[((alu5+69))];
  var val86 = data2[((alu5+70))];
  var val87 = data2[((alu5+71))];
  var val88 = data2[((alu5+72))];
  var val89 = data2[((alu5+73))];
  var val90 = data2[((alu5+74))];
  var val91 = data2[((alu5+75))];
  var val92 = data2[((alu5+76))];
  var val93 = data2[((alu5+77))];
  var val94 = data2[((alu5+78))];
  var val95 = data2[((alu5+79))];
  var val96 = data2[((alu5+80))];
  var val97 = data2[((alu5+81))];
  var val98 = data2[((alu5+82))];
  var val99 = data2[((alu5+83))];
  var val100 = data2[((alu5+84))];
  var val101 = data2[((alu5+85))];
  var val102 = data2[((alu5+86))];
  var val103 = data2[((alu5+87))];
  var val104 = data2[((alu5+88))];
  var val105 = data2[((alu5+89))];
  var val106 = data2[((alu5+90))];
  var val107 = data2[((alu5+91))];
  var val108 = data2[((alu5+92))];
  var val109 = data2[((alu5+93))];
  var val110 = data2[((alu5+94))];
  var val111 = data2[((alu5+95))];
  var val112 = data2[((alu5+96))];
  var val113 = data2[((alu5+97))];
  var val114 = data2[((alu5+98))];
  var val115 = data2[((alu5+99))];
  var val116 = data2[((alu5+100))];
  var val117 = data2[((alu5+101))];
  var val118 = data2[((alu5+102))];
  var val119 = data2[((alu5+103))];
  var val120 = data2[((alu5+104))];
  var val121 = data2[((alu5+105))];
  var val122 = data2[((alu5+106))];
  var val123 = data2[((alu5+107))];
  var val124 = data2[((alu5+108))];
  var val125 = data2[((alu5+109))];
  var val126 = data2[((alu5+110))];
  var val127 = data2[((alu5+111))];
  var val128 = data2[((alu5+112))];
  var val129 = data2[((alu5+113))];
  var val130 = data2[((alu5+114))];
  var val131 = data2[((alu5+115))];
  var val132 = data2[((alu5+116))];
  var val133 = data2[((alu5+117))];
  var val134 = data2[((alu5+118))];
  var val135 = data2[((alu5+119))];
  var val136 = data2[((alu5+120))];
  var val137 = data2[((alu5+121))];
  var val138 = data2[((alu5+122))];
  var val139 = data2[((alu5+123))];
  var val140 = data2[((alu5+124))];
  var val141 = data2[((alu5+125))];
  var val142 = data2[((alu5+126))];
  var val143 = data2[((alu5+127))];
  var alu6 = (lidx1<<2);
  var alu7 = (alu0+alu6);
  var val144 = data1[(alu7)];
  var val145 = data1[((alu7+1))];
  var val146 = data1[((alu7+2))];
  var val147 = data1[((alu7+3))];
  var val148 = data1[((alu7+10816))];
  var val149 = data1[((alu7+10817))];
  var val150 = data1[((alu7+10818))];
  var val151 = data1[((alu7+10819))];
  var val152 = data1[((alu7+21632))];
  var val153 = data1[((alu7+21633))];
  var val154 = data1[((alu7+21634))];
  var val155 = data1[((alu7+21635))];
  var val156 = data1[((alu7+32448))];
  var val157 = data1[((alu7+32449))];
  var val158 = data1[((alu7+32450))];
  var val159 = data1[((alu7+32451))];
  var val160 = data1[((alu7+43264))];
  var val161 = data1[((alu7+43265))];
  var val162 = data1[((alu7+43266))];
  var val163 = data1[((alu7+43267))];
  var val164 = data1[((alu7+54080))];
  var val165 = data1[((alu7+54081))];
  var val166 = data1[((alu7+54082))];
  var val167 = data1[((alu7+54083))];
  var val168 = data1[((alu7+64896))];
  var val169 = data1[((alu7+64897))];
  var val170 = data1[((alu7+64898))];
  var val171 = data1[((alu7+64899))];
  var val172 = data1[((alu7+75712))];
  var val173 = data1[((alu7+75713))];
  var val174 = data1[((alu7+75714))];
  var val175 = data1[((alu7+75715))];
  var val176 = data1[((alu7+86528))];
  var val177 = data1[((alu7+86529))];
  var val178 = data1[((alu7+86530))];
  var val179 = data1[((alu7+86531))];
  var val180 = data1[((alu7+97344))];
  var val181 = data1[((alu7+97345))];
  var val182 = data1[((alu7+97346))];
  var val183 = data1[((alu7+97347))];
  var val184 = data1[((alu7+108160))];
  var val185 = data1[((alu7+108161))];
  var val186 = data1[((alu7+108162))];
  var val187 = data1[((alu7+108163))];
  var val188 = data1[((alu7+118976))];
  var val189 = data1[((alu7+118977))];
  var val190 = data1[((alu7+118978))];
  var val191 = data1[((alu7+118979))];
  var val192 = data1[((alu7+129792))];
  var val193 = data1[((alu7+129793))];
  var val194 = data1[((alu7+129794))];
  var val195 = data1[((alu7+129795))];
  var val196 = data1[((alu7+140608))];
  var val197 = data1[((alu7+140609))];
  var val198 = data1[((alu7+140610))];
  var val199 = data1[((alu7+140611))];
  var val200 = data1[((alu7+151424))];
  var val201 = data1[((alu7+151425))];
  var val202 = data1[((alu7+151426))];
  var val203 = data1[((alu7+151427))];
  var val204 = data1[((alu7+162240))];
  var val205 = data1[((alu7+162241))];
  var val206 = data1[((alu7+162242))];
  var val207 = data1[((alu7+162243))];
  var val208 = data1[((alu7+173056))];
  var val209 = data1[((alu7+173057))];
  var val210 = data1[((alu7+173058))];
  var val211 = data1[((alu7+173059))];
  var val212 = data1[((alu7+183872))];
  var val213 = data1[((alu7+183873))];
  var val214 = data1[((alu7+183874))];
  var val215 = data1[((alu7+183875))];
  var val216 = data1[((alu7+194688))];
  var val217 = data1[((alu7+194689))];
  var val218 = data1[((alu7+194690))];
  var val219 = data1[((alu7+194691))];
  var val220 = data1[((alu7+205504))];
  var val221 = data1[((alu7+205505))];
  var val222 = data1[((alu7+205506))];
  var val223 = data1[((alu7+205507))];
  var val224 = data1[((alu7+216320))];
  var val225 = data1[((alu7+216321))];
  var val226 = data1[((alu7+216322))];
  var val227 = data1[((alu7+216323))];
  var val228 = data1[((alu7+227136))];
  var val229 = data1[((alu7+227137))];
  var val230 = data1[((alu7+227138))];
  var val231 = data1[((alu7+227139))];
  var val232 = data1[((alu7+237952))];
  var val233 = data1[((alu7+237953))];
  var val234 = data1[((alu7+237954))];
  var val235 = data1[((alu7+237955))];
  var val236 = data1[((alu7+248768))];
  var val237 = data1[((alu7+248769))];
  var val238 = data1[((alu7+248770))];
  var val239 = data1[((alu7+248771))];
  var val240 = data1[((alu7+259584))];
  var val241 = data1[((alu7+259585))];
  var val242 = data1[((alu7+259586))];
  var val243 = data1[((alu7+259587))];
  var val244 = data1[((alu7+270400))];
  var val245 = data1[((alu7+270401))];
  var val246 = data1[((alu7+270402))];
  var val247 = data1[((alu7+270403))];
  var val248 = data1[((alu7+281216))];
  var val249 = data1[((alu7+281217))];
  var val250 = data1[((alu7+281218))];
  var val251 = data1[((alu7+281219))];
  var val252 = data1[((alu7+292032))];
  var val253 = data1[((alu7+292033))];
  var val254 = data1[((alu7+292034))];
  var val255 = data1[((alu7+292035))];
  var val256 = data1[((alu7+302848))];
  var val257 = data1[((alu7+302849))];
  var val258 = data1[((alu7+302850))];
  var val259 = data1[((alu7+302851))];
  var val260 = data1[((alu7+313664))];
  var val261 = data1[((alu7+313665))];
  var val262 = data1[((alu7+313666))];
  var val263 = data1[((alu7+313667))];
  var val264 = data1[((alu7+324480))];
  var val265 = data1[((alu7+324481))];
  var val266 = data1[((alu7+324482))];
  var val267 = data1[((alu7+324483))];
  var val268 = data1[((alu7+335296))];
  var val269 = data1[((alu7+335297))];
  var val270 = data1[((alu7+335298))];
  var val271 = data1[((alu7+335299))];
  var cast0 = (f32(sqrt((1/(val4+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val8+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val12+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val0+(f32(0.001f)))))));
  var alu8 = (alu0+(lidx0*43264)+alu6);
  var alu9 = (val7+(cast0*val6*(((val145*val48)+(val149*val49)+(val153*val50)+(val157*val51)+(val161*val52)+(val165*val53)+(val169*val54)+(val173*val55)+(val177*val56)+(val181*val57)+(val185*val58)+(val189*val59)+(val193*val60)+(val197*val61)+(val201*val62)+(val205*val63)+(val209*val64)+(val213*val65)+(val217*val66)+(val221*val67)+(val225*val68)+(val229*val69)+(val233*val70)+(val237*val71)+(val241*val72)+(val245*val73)+(val249*val74)+(val253*val75)+(val257*val76)+(val261*val77)+(val265*val78)+(val269*val79))-val5)));
  data0[((alu8+10817))] = ((1/(exp2((alu9*-1.4426950408889634f))+1.0f))*alu9);
  var alu11 = (val11+(cast1*val10*(((val145*val80)+(val149*val81)+(val153*val82)+(val157*val83)+(val161*val84)+(val165*val85)+(val169*val86)+(val173*val87)+(val177*val88)+(val181*val89)+(val185*val90)+(val189*val91)+(val193*val92)+(val197*val93)+(val201*val94)+(val205*val95)+(val209*val96)+(val213*val97)+(val217*val98)+(val221*val99)+(val225*val100)+(val229*val101)+(val233*val102)+(val237*val103)+(val241*val104)+(val245*val105)+(val249*val106)+(val253*val107)+(val257*val108)+(val261*val109)+(val265*val110)+(val269*val111))-val9)));
  data0[((alu8+21633))] = ((1/(exp2((alu11*-1.4426950408889634f))+1.0f))*alu11);
  var alu13 = (val15+(cast2*val14*(((val145*val112)+(val149*val113)+(val153*val114)+(val157*val115)+(val161*val116)+(val165*val117)+(val169*val118)+(val173*val119)+(val177*val120)+(val181*val121)+(val185*val122)+(val189*val123)+(val193*val124)+(val197*val125)+(val201*val126)+(val205*val127)+(val209*val128)+(val213*val129)+(val217*val130)+(val221*val131)+(val225*val132)+(val229*val133)+(val233*val134)+(val237*val135)+(val241*val136)+(val245*val137)+(val249*val138)+(val253*val139)+(val257*val140)+(val261*val141)+(val265*val142)+(val269*val143))-val13)));
  data0[((alu8+32449))] = ((1/(exp2((alu13*-1.4426950408889634f))+1.0f))*alu13);
  var alu15 = (val3+(cast3*val2*(((val145*val16)+(val149*val17)+(val153*val18)+(val157*val19)+(val161*val20)+(val165*val21)+(val169*val22)+(val173*val23)+(val177*val24)+(val181*val25)+(val185*val26)+(val189*val27)+(val193*val28)+(val197*val29)+(val201*val30)+(val205*val31)+(val209*val32)+(val213*val33)+(val217*val34)+(val221*val35)+(val225*val36)+(val229*val37)+(val233*val38)+(val237*val39)+(val241*val40)+(val245*val41)+(val249*val42)+(val253*val43)+(val257*val44)+(val261*val45)+(val265*val46)+(val269*val47))-val1)));
  data0[((alu8+1))] = ((1/(exp2((alu15*-1.4426950408889634f))+1.0f))*alu15);
  var alu17 = (val7+(cast0*val6*(((val146*val48)+(val150*val49)+(val154*val50)+(val158*val51)+(val162*val52)+(val166*val53)+(val170*val54)+(val174*val55)+(val178*val56)+(val182*val57)+(val186*val58)+(val190*val59)+(val194*val60)+(val198*val61)+(val202*val62)+(val206*val63)+(val210*val64)+(val214*val65)+(val218*val66)+(val222*val67)+(val226*val68)+(val230*val69)+(val234*val70)+(val238*val71)+(val242*val72)+(val246*val73)+(val250*val74)+(val254*val75)+(val258*val76)+(val262*val77)+(val266*val78)+(val270*val79))-val5)));
  data0[((alu8+10818))] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val11+(cast1*val10*(((val146*val80)+(val150*val81)+(val154*val82)+(val158*val83)+(val162*val84)+(val166*val85)+(val170*val86)+(val174*val87)+(val178*val88)+(val182*val89)+(val186*val90)+(val190*val91)+(val194*val92)+(val198*val93)+(val202*val94)+(val206*val95)+(val210*val96)+(val214*val97)+(val218*val98)+(val222*val99)+(val226*val100)+(val230*val101)+(val234*val102)+(val238*val103)+(val242*val104)+(val246*val105)+(val250*val106)+(val254*val107)+(val258*val108)+(val262*val109)+(val266*val110)+(val270*val111))-val9)));
  data0[((alu8+21634))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val15+(cast2*val14*(((val146*val112)+(val150*val113)+(val154*val114)+(val158*val115)+(val162*val116)+(val166*val117)+(val170*val118)+(val174*val119)+(val178*val120)+(val182*val121)+(val186*val122)+(val190*val123)+(val194*val124)+(val198*val125)+(val202*val126)+(val206*val127)+(val210*val128)+(val214*val129)+(val218*val130)+(val222*val131)+(val226*val132)+(val230*val133)+(val234*val134)+(val238*val135)+(val242*val136)+(val246*val137)+(val250*val138)+(val254*val139)+(val258*val140)+(val262*val141)+(val266*val142)+(val270*val143))-val13)));
  data0[((alu8+32450))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val3+(cast3*val2*(((val146*val16)+(val150*val17)+(val154*val18)+(val158*val19)+(val162*val20)+(val166*val21)+(val170*val22)+(val174*val23)+(val178*val24)+(val182*val25)+(val186*val26)+(val190*val27)+(val194*val28)+(val198*val29)+(val202*val30)+(val206*val31)+(val210*val32)+(val214*val33)+(val218*val34)+(val222*val35)+(val226*val36)+(val230*val37)+(val234*val38)+(val238*val39)+(val242*val40)+(val246*val41)+(val250*val42)+(val254*val43)+(val258*val44)+(val262*val45)+(val266*val46)+(val270*val47))-val1)));
  data0[((alu8+2))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
  var alu25 = (val7+(cast0*val6*(((val147*val48)+(val151*val49)+(val155*val50)+(val159*val51)+(val163*val52)+(val167*val53)+(val171*val54)+(val175*val55)+(val179*val56)+(val183*val57)+(val187*val58)+(val191*val59)+(val195*val60)+(val199*val61)+(val203*val62)+(val207*val63)+(val211*val64)+(val215*val65)+(val219*val66)+(val223*val67)+(val227*val68)+(val231*val69)+(val235*val70)+(val239*val71)+(val243*val72)+(val247*val73)+(val251*val74)+(val255*val75)+(val259*val76)+(val263*val77)+(val267*val78)+(val271*val79))-val5)));
  data0[((alu8+10819))] = ((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25);
  var alu27 = (val11+(cast1*val10*(((val147*val80)+(val151*val81)+(val155*val82)+(val159*val83)+(val163*val84)+(val167*val85)+(val171*val86)+(val175*val87)+(val179*val88)+(val183*val89)+(val187*val90)+(val191*val91)+(val195*val92)+(val199*val93)+(val203*val94)+(val207*val95)+(val211*val96)+(val215*val97)+(val219*val98)+(val223*val99)+(val227*val100)+(val231*val101)+(val235*val102)+(val239*val103)+(val243*val104)+(val247*val105)+(val251*val106)+(val255*val107)+(val259*val108)+(val263*val109)+(val267*val110)+(val271*val111))-val9)));
  data0[((alu8+21635))] = ((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27);
  var alu29 = (val15+(cast2*val14*(((val147*val112)+(val151*val113)+(val155*val114)+(val159*val115)+(val163*val116)+(val167*val117)+(val171*val118)+(val175*val119)+(val179*val120)+(val183*val121)+(val187*val122)+(val191*val123)+(val195*val124)+(val199*val125)+(val203*val126)+(val207*val127)+(val211*val128)+(val215*val129)+(val219*val130)+(val223*val131)+(val227*val132)+(val231*val133)+(val235*val134)+(val239*val135)+(val243*val136)+(val247*val137)+(val251*val138)+(val255*val139)+(val259*val140)+(val263*val141)+(val267*val142)+(val271*val143))-val13)));
  data0[((alu8+32451))] = ((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29);
  var alu31 = (val3+(cast3*val2*(((val147*val16)+(val151*val17)+(val155*val18)+(val159*val19)+(val163*val20)+(val167*val21)+(val171*val22)+(val175*val23)+(val179*val24)+(val183*val25)+(val187*val26)+(val191*val27)+(val195*val28)+(val199*val29)+(val203*val30)+(val207*val31)+(val211*val32)+(val215*val33)+(val219*val34)+(val223*val35)+(val227*val36)+(val231*val37)+(val235*val38)+(val239*val39)+(val243*val40)+(val247*val41)+(val251*val42)+(val255*val43)+(val259*val44)+(val263*val45)+(val267*val46)+(val271*val47))-val1)));
  data0[((alu8+3))] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val3+(cast3*val2*(((val148*val17)+(val144*val16)+(val152*val18)+(val156*val19)+(val160*val20)+(val164*val21)+(val168*val22)+(val172*val23)+(val176*val24)+(val180*val25)+(val184*val26)+(val188*val27)+(val192*val28)+(val196*val29)+(val200*val30)+(val204*val31)+(val208*val32)+(val212*val33)+(val216*val34)+(val220*val35)+(val224*val36)+(val228*val37)+(val232*val38)+(val236*val39)+(val240*val40)+(val244*val41)+(val248*val42)+(val252*val43)+(val256*val44)+(val260*val45)+(val264*val46)+(val268*val47))-val1)));
  data0[(alu8)] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val7+(cast0*val6*(((val148*val49)+(val144*val48)+(val152*val50)+(val156*val51)+(val160*val52)+(val164*val53)+(val168*val54)+(val172*val55)+(val176*val56)+(val180*val57)+(val184*val58)+(val188*val59)+(val192*val60)+(val196*val61)+(val200*val62)+(val204*val63)+(val208*val64)+(val212*val65)+(val216*val66)+(val220*val67)+(val224*val68)+(val228*val69)+(val232*val70)+(val236*val71)+(val240*val72)+(val244*val73)+(val248*val74)+(val252*val75)+(val256*val76)+(val260*val77)+(val264*val78)+(val268*val79))-val5)));
  data0[((alu8+10816))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val11+(cast1*val10*(((val148*val81)+(val144*val80)+(val152*val82)+(val156*val83)+(val160*val84)+(val164*val85)+(val168*val86)+(val172*val87)+(val176*val88)+(val180*val89)+(val184*val90)+(val188*val91)+(val192*val92)+(val196*val93)+(val200*val94)+(val204*val95)+(val208*val96)+(val212*val97)+(val216*val98)+(val220*val99)+(val224*val100)+(val228*val101)+(val232*val102)+(val236*val103)+(val240*val104)+(val244*val105)+(val248*val106)+(val252*val107)+(val256*val108)+(val260*val109)+(val264*val110)+(val268*val111))-val9)));
  data0[((alu8+21632))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val15+(cast2*val14*(((val148*val113)+(val144*val112)+(val152*val114)+(val156*val115)+(val160*val116)+(val164*val117)+(val168*val118)+(val172*val119)+(val176*val120)+(val180*val121)+(val184*val122)+(val188*val123)+(val192*val124)+(val196*val125)+(val200*val126)+(val204*val127)+(val208*val128)+(val212*val129)+(val216*val130)+(val220*val131)+(val224*val132)+(val228*val133)+(val232*val134)+(val236*val135)+(val240*val136)+(val244*val137)+(val248*val138)+(val252*val139)+(val256*val140)+(val260*val141)+(val264*val142)+(val268*val143))-val13)));
  data0[((alu8+32448))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
}`;

const r_13_13_4_8_2_16_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4,8,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 8 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<3);
  var alu1 = (gidx1*832);
  var alu2 = (lidx1*104);
  var alu3 = (lidx2<<2);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<3))<103);
  var alu7 = ((lidx2+(gidx0<<1))<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu8 = ((lidx0*576)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+144))];
    var val10 = data2[((alu8+145))];
    var val11 = data2[((alu8+146))];
    var val12 = data2[((alu8+147))];
    var val13 = data2[((alu8+148))];
    var val14 = data2[((alu8+149))];
    var val15 = data2[((alu8+150))];
    var val16 = data2[((alu8+151))];
    var val17 = data2[((alu8+152))];
    var val18 = data2[((alu8+288))];
    var val19 = data2[((alu8+289))];
    var val20 = data2[((alu8+290))];
    var val21 = data2[((alu8+291))];
    var val22 = data2[((alu8+292))];
    var val23 = data2[((alu8+293))];
    var val24 = data2[((alu8+294))];
    var val25 = data2[((alu8+295))];
    var val26 = data2[((alu8+296))];
    var val27 = data2[((alu8+432))];
    var val28 = data2[((alu8+433))];
    var val29 = data2[((alu8+434))];
    var val30 = data2[((alu8+435))];
    var val31 = data2[((alu8+436))];
    var val32 = data2[((alu8+437))];
    var val33 = data2[((alu8+438))];
    var val34 = data2[((alu8+439))];
    var val35 = data2[((alu8+440))];
    var alu9 = (alu1+alu2+(ridx0*10816)+alu0+alu3);
    var val36 = select(0.0f, data1[((alu9+172951))], (alu4&alu5));
    var val37 = select(0.0f, data1[((alu9+172952))], alu5);
    var val38 = select(0.0f, data1[((alu9+172953))], alu5);
    var val39 = select(0.0f, data1[((alu9+172954))], alu5);
    var val40 = select(0.0f, data1[((alu9+172955))], alu5);
    var val41 = select(0.0f, data1[((alu9+172956))], (alu7&alu5));
    var val42 = select(0.0f, data1[((alu9+173055))], alu4);
    var val43 = data1[((alu9+173056))];
    var val44 = data1[((alu9+173057))];
    var val45 = data1[((alu9+173058))];
    var val46 = data1[((alu9+173059))];
    var val47 = select(0.0f, data1[((alu9+173060))], alu7);
    var val48 = select(0.0f, data1[((alu9+173159))], (alu6&alu4));
    var val49 = select(0.0f, data1[((alu9+173160))], alu6);
    var val50 = select(0.0f, data1[((alu9+173161))], alu6);
    var val51 = select(0.0f, data1[((alu9+173162))], alu6);
    var val52 = select(0.0f, data1[((alu9+173163))], alu6);
    var val53 = select(0.0f, data1[((alu9+173164))], (alu6&alu7));
    acc0 = (acc0+(val36*val0)+(val42*val3)+(val48*val6)+(val37*val1)+(val43*val4)+(val49*val7)+(val38*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val36*val9)+(val42*val12)+(val48*val15)+(val37*val10)+(val43*val13)+(val49*val16)+(val38*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val36*val18)+(val42*val21)+(val48*val24)+(val37*val19)+(val43*val22)+(val49*val25)+(val38*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val36*val27)+(val42*val30)+(val48*val33)+(val37*val28)+(val43*val31)+(val49*val34)+(val38*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val37*val0)+(val43*val3)+(val49*val6)+(val38*val1)+(val44*val4)+(val50*val7)+(val39*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val37*val9)+(val43*val12)+(val49*val15)+(val38*val10)+(val44*val13)+(val50*val16)+(val39*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val37*val18)+(val43*val21)+(val49*val24)+(val38*val19)+(val44*val22)+(val50*val25)+(val39*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val37*val27)+(val43*val30)+(val49*val33)+(val38*val28)+(val44*val31)+(val50*val34)+(val39*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val38*val0)+(val44*val3)+(val50*val6)+(val39*val1)+(val45*val4)+(val51*val7)+(val40*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val38*val9)+(val44*val12)+(val50*val15)+(val39*val10)+(val45*val13)+(val51*val16)+(val40*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val38*val18)+(val44*val21)+(val50*val24)+(val39*val19)+(val45*val22)+(val51*val25)+(val40*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val38*val27)+(val44*val30)+(val50*val33)+(val39*val28)+(val45*val31)+(val51*val34)+(val40*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val39*val0)+(val45*val3)+(val51*val6)+(val40*val1)+(val46*val4)+(val52*val7)+(val41*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val39*val9)+(val45*val12)+(val51*val15)+(val40*val10)+(val46*val13)+(val52*val16)+(val41*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val39*val18)+(val45*val21)+(val51*val24)+(val40*val19)+(val46*val22)+(val52*val25)+(val41*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val39*val27)+(val45*val30)+(val51*val33)+(val40*val28)+(val46*val31)+(val52*val34)+(val41*val29)+(val47*val32)+(val53*val35));
  }
  var alu27 = (lidx0<<2);
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val55 = data3[(alu27)];
  var val56 = data4[(alu27)];
  var val57 = data6[(alu27)];
  var alu28 = (alu27+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val59 = data3[(alu28)];
  var val60 = data4[(alu28)];
  var val61 = data6[(alu28)];
  var alu29 = (alu27+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val63 = data3[(alu29)];
  var val64 = data4[(alu29)];
  var val65 = data6[(alu29)];
  var alu30 = (alu27+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu30)>>1]))[(alu30)&1];
  var val67 = data3[(alu30)];
  var val68 = data4[(alu30)];
  var val69 = data6[(alu30)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu31 = (alu0+alu1+(lidx0*43264)+alu2+alu3);
  var alu32 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu31)] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu31+10816))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu31+21632))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu31+32448))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu31+1))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu31+10817))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu31+21633))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu31+32449))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu31+2))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu31+10818))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu31+21634))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu31+32450))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu31+3))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
  var alu58 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu31+10819))] = ((1/(exp2((alu58*-1.4426950408889634f))+1.0f))*alu58);
  var alu60 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu31+21635))] = ((1/(exp2((alu60*-1.4426950408889634f))+1.0f))*alu60);
  var alu62 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu31+32451))] = ((1/(exp2((alu62*-1.4426950408889634f))+1.0f))*alu62);
}`;

const r_13_13_4_8_2_16_4_4_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(4,8,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 8 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<3);
  var alu1 = (gidx1*832);
  var alu2 = (lidx1*104);
  var alu3 = (lidx2<<2);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<3))<103);
  var alu7 = ((lidx2+(gidx0<<1))<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu8 = ((lidx0*576)+(ridx0*9));
    var val0 = data3[(alu8)];
    var val1 = data3[((alu8+1))];
    var val2 = data3[((alu8+2))];
    var val3 = data3[((alu8+3))];
    var val4 = data3[((alu8+4))];
    var val5 = data3[((alu8+5))];
    var val6 = data3[((alu8+6))];
    var val7 = data3[((alu8+7))];
    var val8 = data3[((alu8+8))];
    var val9 = data3[((alu8+144))];
    var val10 = data3[((alu8+145))];
    var val11 = data3[((alu8+146))];
    var val12 = data3[((alu8+147))];
    var val13 = data3[((alu8+148))];
    var val14 = data3[((alu8+149))];
    var val15 = data3[((alu8+150))];
    var val16 = data3[((alu8+151))];
    var val17 = data3[((alu8+152))];
    var val18 = data3[((alu8+288))];
    var val19 = data3[((alu8+289))];
    var val20 = data3[((alu8+290))];
    var val21 = data3[((alu8+291))];
    var val22 = data3[((alu8+292))];
    var val23 = data3[((alu8+293))];
    var val24 = data3[((alu8+294))];
    var val25 = data3[((alu8+295))];
    var val26 = data3[((alu8+296))];
    var val27 = data3[((alu8+432))];
    var val28 = data3[((alu8+433))];
    var val29 = data3[((alu8+434))];
    var val30 = data3[((alu8+435))];
    var val31 = data3[((alu8+436))];
    var val32 = data3[((alu8+437))];
    var val33 = data3[((alu8+438))];
    var val34 = data3[((alu8+439))];
    var val35 = data3[((alu8+440))];
    var alu9 = (alu1+alu2+(ridx0*10816)+alu0+alu3);
    var val36 = data2[(alu9)];
    var val37 = select(0.0f, data2[((alu9+-105))], (alu4&alu5));
    var val38 = select(0.0f, data2[((alu9+-104))], alu5);
    var val39 = select(0.0f, data2[((alu9+-103))], alu5);
    var val40 = select(0.0f, data2[((alu9+-102))], alu5);
    var val41 = select(0.0f, data2[((alu9+-101))], alu5);
    var val42 = select(0.0f, data2[((alu9+-100))], (alu7&alu5));
    var val43 = select(0.0f, data2[((alu9+-1))], alu4);
    var val44 = data2[((alu9+1))];
    var val45 = data2[((alu9+2))];
    var val46 = data2[((alu9+3))];
    var val47 = select(0.0f, data2[((alu9+4))], alu7);
    var val48 = select(0.0f, data2[((alu9+103))], (alu6&alu4));
    var val49 = select(0.0f, data2[((alu9+104))], alu6);
    var val50 = select(0.0f, data2[((alu9+105))], alu6);
    var val51 = select(0.0f, data2[((alu9+106))], alu6);
    var val52 = select(0.0f, data2[((alu9+107))], alu6);
    var val53 = select(0.0f, data2[((alu9+108))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu27 = (alu0+alu1+(lidx0*43264)+alu2+alu3);
  var val54 = data1[((alu27+173056))];
  var val55 = data1[((alu27+173057))];
  var val56 = data1[((alu27+173058))];
  var val57 = data1[((alu27+173059))];
  var val58 = data1[((alu27+183872))];
  var val59 = data1[((alu27+183873))];
  var val60 = data1[((alu27+183874))];
  var val61 = data1[((alu27+183875))];
  var val62 = data1[((alu27+194688))];
  var val63 = data1[((alu27+194689))];
  var val64 = data1[((alu27+194690))];
  var val65 = data1[((alu27+194691))];
  var val66 = data1[((alu27+205504))];
  var val67 = data1[((alu27+205505))];
  var val68 = data1[((alu27+205506))];
  var val69 = data1[((alu27+205507))];
  var alu28 = (lidx0<<2);
  var val70 = unpack2x16float(bitcast<u32>(data6[(alu28)>>1]))[(alu28)&1];
  var val71 = data4[(alu28)];
  var val72 = data5[(alu28)];
  var val73 = data7[(alu28)];
  var alu29 = (alu28+1);
  var val74 = unpack2x16float(bitcast<u32>(data6[(alu29)>>1]))[(alu29)&1];
  var val75 = data4[(alu29)];
  var val76 = data5[(alu29)];
  var val77 = data7[(alu29)];
  var alu30 = (alu28+2);
  var val78 = unpack2x16float(bitcast<u32>(data6[(alu30)>>1]))[(alu30)&1];
  var val79 = data4[(alu30)];
  var val80 = data5[(alu30)];
  var val81 = data7[(alu30)];
  var alu31 = (alu28+3);
  var val82 = unpack2x16float(bitcast<u32>(data6[(alu31)>>1]))[(alu31)&1];
  var val83 = data4[(alu31)];
  var val84 = data5[(alu31)];
  var val85 = data7[(alu31)];
  var cast0 = (f32(sqrt((1/(val74+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val78+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val82+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val70+(f32(0.001f)))))));
  var alu32 = (val73+(cast3*val72*(acc0-val71)));
  data0[(alu27)] = (val54+((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32));
  var alu34 = (val77+(cast0*val76*(acc1-val75)));
  data0[((alu27+10816))] = (val58+((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34));
  var alu36 = (val81+(cast1*val80*(acc2-val79)));
  data0[((alu27+21632))] = (val62+((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36));
  var alu38 = (val85+(cast2*val84*(acc3-val83)));
  data0[((alu27+32448))] = (val66+((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38));
  var alu40 = (val73+(cast3*val72*(acc4-val71)));
  data0[((alu27+1))] = (val55+((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40));
  var alu42 = (val77+(cast0*val76*(acc5-val75)));
  data0[((alu27+10817))] = (val59+((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42));
  var alu44 = (val81+(cast1*val80*(acc6-val79)));
  data0[((alu27+21633))] = (val63+((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44));
  var alu46 = (val85+(cast2*val84*(acc7-val83)));
  data0[((alu27+32449))] = (val67+((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46));
  var alu48 = (val73+(cast3*val72*(acc8-val71)));
  data0[((alu27+2))] = (val56+((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48));
  var alu50 = (val77+(cast0*val76*(acc9-val75)));
  data0[((alu27+10818))] = (val60+((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50));
  var alu52 = (val81+(cast1*val80*(acc10-val79)));
  data0[((alu27+21634))] = (val64+((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52));
  var alu54 = (val85+(cast2*val84*(acc11-val83)));
  data0[((alu27+32450))] = (val68+((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54));
  var alu56 = (val73+(cast3*val72*(acc12-val71)));
  data0[((alu27+3))] = (val57+((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56));
  var alu58 = (val77+(cast0*val76*(acc13-val75)));
  data0[((alu27+10819))] = (val61+((1/(exp2((alu58*-1.4426950408889634f))+1.0f))*alu58));
  var alu60 = (val81+(cast1*val80*(acc14-val79)));
  data0[((alu27+21635))] = (val65+((1/(exp2((alu60*-1.4426950408889634f))+1.0f))*alu60));
  var alu62 = (val85+(cast2*val84*(acc15-val83)));
  data0[((alu27+32451))] = (val69+((1/(exp2((alu62*-1.4426950408889634f))+1.0f))*alu62));
}`;

const E_6_169_8_16_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(8,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 6 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 16 */
  var alu0 = (gidx1<2);
  var alu1 = (gidx1<4);
  var alu2 = (alu1!=true);
  var alu3 = ((gidx0<<6)+(gidx1*86528)+(lidx0*10816)+(lidx1<<2));
  var val0 = select(0.0f, data1[(alu3)], alu0);
  var val1 = select(0.0f, data2[((alu3+-346112))], alu2);
  var val2 = select(0.0f, data2[((alu3+-346111))], alu2);
  var val3 = select(0.0f, data2[((alu3+-346110))], alu2);
  var val4 = select(0.0f, data2[((alu3+-346109))], alu2);
  var alu4 = (alu3+1);
  var val5 = select(0.0f, data1[(alu4)], alu0);
  var alu5 = (alu3+2);
  var val6 = select(0.0f, data1[(alu5)], alu0);
  var alu6 = (alu3+3);
  var val7 = select(0.0f, data1[(alu6)], alu0);
  var alu7 = (alu1&(alu0!=true));
  var val8 = select(0.0f, data1[(alu4)], alu7);
  var val9 = select(0.0f, data1[(alu5)], alu7);
  var val10 = select(0.0f, data1[(alu6)], alu7);
  var val11 = select(0.0f, data1[(alu3)], alu7);
  data0[(alu3)] = (val1+val0+val11);
  data0[(alu4)] = (val2+val5+val8);
  data0[(alu5)] = (val3+val6+val9);
  data0[(alu6)] = (val4+val7+val10);
}`;

const r_169_8_16_12_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(8,16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 16 */
  var alu0 = (gidx0<<6);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 12; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*43264));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+10816))];
    var val5 = data1[((alu2+10817))];
    var val6 = data1[((alu2+10818))];
    var val7 = data1[((alu2+10819))];
    var val8 = data1[((alu2+21632))];
    var val9 = data1[((alu2+21633))];
    var val10 = data1[((alu2+21634))];
    var val11 = data1[((alu2+21635))];
    var val12 = data1[((alu2+32448))];
    var val13 = data1[((alu2+32449))];
    var val14 = data1[((alu2+32450))];
    var val15 = data1[((alu2+32451))];
    var alu3 = ((lidx0*192)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+48))];
    var val21 = data2[((alu3+49))];
    var val22 = data2[((alu3+50))];
    var val23 = data2[((alu3+51))];
    var val24 = data2[((alu3+96))];
    var val25 = data2[((alu3+97))];
    var val26 = data2[((alu3+98))];
    var val27 = data2[((alu3+99))];
    var val28 = data2[((alu3+144))];
    var val29 = data2[((alu3+145))];
    var val30 = data2[((alu3+146))];
    var val31 = data2[((alu3+147))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val33 = data3[(alu21)];
  var val34 = data4[(alu21)];
  var val35 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val37 = data3[(alu22)];
  var val38 = data4[(alu22)];
  var val39 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val41 = data3[(alu23)];
  var val42 = data4[(alu23)];
  var val43 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val45 = data3[(alu24)];
  var val46 = data4[(alu24)];
  var val47 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu25 = (alu0+(lidx0*43264)+alu1);
  var alu26 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu25+10816))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu25+21632))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu25+32448))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu25+10817))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu25+21633))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu25+32449))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu25+10818))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu25+21634))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu25+32450))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu25+10819))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu25+21635))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu25+32451))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_13_13_16_4_32_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = ((gidx0<1)!=true);
  var alu1 = (((gidx1+lidx1)<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu2 = ((lidx0*1152)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+288))];
    var val10 = data2[((alu2+289))];
    var val11 = data2[((alu2+290))];
    var val12 = data2[((alu2+291))];
    var val13 = data2[((alu2+292))];
    var val14 = data2[((alu2+293))];
    var val15 = data2[((alu2+294))];
    var val16 = data2[((alu2+295))];
    var val17 = data2[((alu2+296))];
    var val18 = data2[((alu2+576))];
    var val19 = data2[((alu2+577))];
    var val20 = data2[((alu2+578))];
    var val21 = data2[((alu2+579))];
    var val22 = data2[((alu2+580))];
    var val23 = data2[((alu2+581))];
    var val24 = data2[((alu2+582))];
    var val25 = data2[((alu2+583))];
    var val26 = data2[((alu2+584))];
    var val27 = data2[((alu2+864))];
    var val28 = data2[((alu2+865))];
    var val29 = data2[((alu2+866))];
    var val30 = data2[((alu2+867))];
    var val31 = data2[((alu2+868))];
    var val32 = data2[((alu2+869))];
    var val33 = data2[((alu2+870))];
    var val34 = data2[((alu2+871))];
    var val35 = data2[((alu2+872))];
    var alu3 = ((gidx1*832)+(lidx1*208)+(ridx0*10816)+(gidx0<<3));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-105))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-104))], alu1);
    var val39 = select(0.0f, data1[((alu3+-103))], alu1);
    var val40 = select(0.0f, data1[((alu3+-102))], alu1);
    var val41 = select(0.0f, data1[((alu3+-101))], alu1);
    var val42 = select(0.0f, data1[((alu3+-100))], alu1);
    var val43 = select(0.0f, data1[((alu3+-99))], alu1);
    var val44 = select(0.0f, data1[((alu3+-98))], alu1);
    var val45 = select(0.0f, data1[((alu3+-97))], alu1);
    var val46 = select(0.0f, data1[((alu3+-1))], alu0);
    var val47 = data1[((alu3+1))];
    var val48 = data1[((alu3+2))];
    var val49 = data1[((alu3+3))];
    var val50 = data1[((alu3+4))];
    var val51 = data1[((alu3+5))];
    var val52 = data1[((alu3+6))];
    var val53 = data1[((alu3+7))];
    var val54 = select(0.0f, data1[((alu3+103))], alu0);
    var val55 = data1[((alu3+104))];
    var val56 = data1[((alu3+105))];
    var val57 = data1[((alu3+106))];
    var val58 = data1[((alu3+107))];
    var val59 = data1[((alu3+108))];
    var val60 = data1[((alu3+109))];
    var val61 = data1[((alu3+110))];
    var val62 = data1[((alu3+111))];
    acc0 = (acc0+(val37*val0)+(val46*val3)+(val54*val6)+(val38*val1)+(val36*val4)+(val55*val7)+(val39*val2)+(val47*val5)+(val56*val8));
    acc1 = (acc1+(val37*val9)+(val46*val12)+(val54*val15)+(val38*val10)+(val36*val13)+(val55*val16)+(val39*val11)+(val47*val14)+(val56*val17));
    acc2 = (acc2+(val37*val18)+(val46*val21)+(val54*val24)+(val38*val19)+(val36*val22)+(val55*val25)+(val39*val20)+(val47*val23)+(val56*val26));
    acc3 = (acc3+(val37*val27)+(val46*val30)+(val54*val33)+(val38*val28)+(val36*val31)+(val55*val34)+(val39*val29)+(val47*val32)+(val56*val35));
    acc4 = (acc4+(val39*val0)+(val47*val3)+(val56*val6)+(val40*val1)+(val48*val4)+(val57*val7)+(val41*val2)+(val49*val5)+(val58*val8));
    acc5 = (acc5+(val39*val9)+(val47*val12)+(val56*val15)+(val40*val10)+(val48*val13)+(val57*val16)+(val41*val11)+(val49*val14)+(val58*val17));
    acc6 = (acc6+(val39*val18)+(val47*val21)+(val56*val24)+(val40*val19)+(val48*val22)+(val57*val25)+(val41*val20)+(val49*val23)+(val58*val26));
    acc7 = (acc7+(val39*val27)+(val47*val30)+(val56*val33)+(val40*val28)+(val48*val31)+(val57*val34)+(val41*val29)+(val49*val32)+(val58*val35));
    acc8 = (acc8+(val41*val0)+(val49*val3)+(val58*val6)+(val42*val1)+(val50*val4)+(val59*val7)+(val43*val2)+(val51*val5)+(val60*val8));
    acc9 = (acc9+(val41*val9)+(val49*val12)+(val58*val15)+(val42*val10)+(val50*val13)+(val59*val16)+(val43*val11)+(val51*val14)+(val60*val17));
    acc10 = (acc10+(val41*val18)+(val49*val21)+(val58*val24)+(val42*val19)+(val50*val22)+(val59*val25)+(val43*val20)+(val51*val23)+(val60*val26));
    acc11 = (acc11+(val41*val27)+(val49*val30)+(val58*val33)+(val42*val28)+(val50*val31)+(val59*val34)+(val43*val29)+(val51*val32)+(val60*val35));
    acc12 = (acc12+(val43*val0)+(val51*val3)+(val60*val6)+(val44*val1)+(val52*val4)+(val61*val7)+(val45*val2)+(val53*val5)+(val62*val8));
    acc13 = (acc13+(val43*val9)+(val51*val12)+(val60*val15)+(val44*val10)+(val52*val13)+(val61*val16)+(val45*val11)+(val53*val14)+(val62*val17));
    acc14 = (acc14+(val43*val18)+(val51*val21)+(val60*val24)+(val44*val19)+(val52*val22)+(val61*val25)+(val45*val20)+(val53*val23)+(val62*val26));
    acc15 = (acc15+(val43*val27)+(val51*val30)+(val60*val33)+(val44*val28)+(val52*val31)+(val61*val34)+(val45*val29)+(val53*val32)+(val62*val35));
  }
  var alu21 = (lidx0<<2);
  var val63 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val64 = data3[(alu21)];
  var val65 = data4[(alu21)];
  var val66 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val67 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val68 = data3[(alu22)];
  var val69 = data4[(alu22)];
  var val70 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val71 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val72 = data3[(alu23)];
  var val73 = data4[(alu23)];
  var val74 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val75 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val76 = data3[(alu24)];
  var val77 = data4[(alu24)];
  var val78 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val67+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val71+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val75+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val63+(f32(0.001f)))))));
  var alu25 = ((gidx0<<2)+(gidx1*208)+(lidx0*10816)+(lidx1*52));
  var alu26 = (val66+(cast3*val65*(acc0-val64)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val70+(cast0*val69*(acc1-val68)));
  data0[((alu25+2704))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val74+(cast1*val73*(acc2-val72)));
  data0[((alu25+5408))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val78+(cast2*val77*(acc3-val76)));
  data0[((alu25+8112))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val66+(cast3*val65*(acc4-val64)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val70+(cast0*val69*(acc5-val68)));
  data0[((alu25+2705))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val74+(cast1*val73*(acc6-val72)));
  data0[((alu25+5409))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val78+(cast2*val77*(acc7-val76)));
  data0[((alu25+8113))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val66+(cast3*val65*(acc8-val64)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val70+(cast0*val69*(acc9-val68)));
  data0[((alu25+2706))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val74+(cast1*val73*(acc10-val72)));
  data0[((alu25+5410))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val78+(cast2*val77*(acc11-val76)));
  data0[((alu25+8114))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val66+(cast3*val65*(acc12-val64)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val70+(cast0*val69*(acc13-val68)));
  data0[((alu25+2707))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val74+(cast1*val73*(acc14-val72)));
  data0[((alu25+5411))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val78+(cast2*val77*(acc15-val76)));
  data0[((alu25+8115))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_169_16_4_16_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((lidx0<<8)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+64))];
    var val21 = data2[((alu3+65))];
    var val22 = data2[((alu3+66))];
    var val23 = data2[((alu3+67))];
    var val24 = data2[((alu3+128))];
    var val25 = data2[((alu3+129))];
    var val26 = data2[((alu3+130))];
    var val27 = data2[((alu3+131))];
    var val28 = data2[((alu3+192))];
    var val29 = data2[((alu3+193))];
    var val30 = data2[((alu3+194))];
    var val31 = data2[((alu3+195))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val33 = data3[(alu21)];
  var val34 = data4[(alu21)];
  var val35 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val37 = data3[(alu22)];
  var val38 = data4[(alu22)];
  var val39 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val41 = data3[(alu23)];
  var val42 = data4[(alu23)];
  var val43 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val45 = data3[(alu24)];
  var val46 = data4[(alu24)];
  var val47 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu25 = (alu0+(lidx0*10816)+alu1);
  var alu26 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu25+2704))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu25+5408))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu25+8112))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu25+2705))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu25+5409))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu25+8113))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu25+2706))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu25+5410))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu25+8114))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu25+2707))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu25+5411))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu25+8115))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_13_13_8_4_32_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<2);
  var alu1 = (gidx1*208);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu7 = ((lidx0*1152)+(ridx0*9));
    var val0 = data2[(alu7)];
    var val1 = data2[((alu7+1))];
    var val2 = data2[((alu7+2))];
    var val3 = data2[((alu7+3))];
    var val4 = data2[((alu7+4))];
    var val5 = data2[((alu7+5))];
    var val6 = data2[((alu7+6))];
    var val7 = data2[((alu7+7))];
    var val8 = data2[((alu7+8))];
    var val9 = data2[((alu7+288))];
    var val10 = data2[((alu7+289))];
    var val11 = data2[((alu7+290))];
    var val12 = data2[((alu7+291))];
    var val13 = data2[((alu7+292))];
    var val14 = data2[((alu7+293))];
    var val15 = data2[((alu7+294))];
    var val16 = data2[((alu7+295))];
    var val17 = data2[((alu7+296))];
    var val18 = data2[((alu7+576))];
    var val19 = data2[((alu7+577))];
    var val20 = data2[((alu7+578))];
    var val21 = data2[((alu7+579))];
    var val22 = data2[((alu7+580))];
    var val23 = data2[((alu7+581))];
    var val24 = data2[((alu7+582))];
    var val25 = data2[((alu7+583))];
    var val26 = data2[((alu7+584))];
    var val27 = data2[((alu7+864))];
    var val28 = data2[((alu7+865))];
    var val29 = data2[((alu7+866))];
    var val30 = data2[((alu7+867))];
    var val31 = data2[((alu7+868))];
    var val32 = data2[((alu7+869))];
    var val33 = data2[((alu7+870))];
    var val34 = data2[((alu7+871))];
    var val35 = data2[((alu7+872))];
    var alu8 = (alu1+alu2+(ridx0*2704)+alu0);
    var val36 = select(0.0f, data1[((alu8+86475))], (alu3&alu4));
    var val37 = select(0.0f, data1[((alu8+86476))], alu4);
    var val38 = select(0.0f, data1[((alu8+86477))], alu4);
    var val39 = select(0.0f, data1[((alu8+86478))], alu4);
    var val40 = select(0.0f, data1[((alu8+86479))], alu4);
    var val41 = select(0.0f, data1[((alu8+86480))], (alu6&alu4));
    var val42 = select(0.0f, data1[((alu8+86527))], alu3);
    var val43 = data1[((alu8+86528))];
    var val44 = data1[((alu8+86529))];
    var val45 = data1[((alu8+86530))];
    var val46 = data1[((alu8+86531))];
    var val47 = select(0.0f, data1[((alu8+86532))], alu6);
    var val48 = select(0.0f, data1[((alu8+86579))], (alu5&alu3));
    var val49 = select(0.0f, data1[((alu8+86580))], alu5);
    var val50 = select(0.0f, data1[((alu8+86581))], alu5);
    var val51 = select(0.0f, data1[((alu8+86582))], alu5);
    var val52 = select(0.0f, data1[((alu8+86583))], alu5);
    var val53 = select(0.0f, data1[((alu8+86584))], (alu6&alu5));
    acc0 = (acc0+(val36*val0)+(val42*val3)+(val48*val6)+(val37*val1)+(val43*val4)+(val49*val7)+(val38*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val36*val9)+(val42*val12)+(val48*val15)+(val37*val10)+(val43*val13)+(val49*val16)+(val38*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val36*val18)+(val42*val21)+(val48*val24)+(val37*val19)+(val43*val22)+(val49*val25)+(val38*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val36*val27)+(val42*val30)+(val48*val33)+(val37*val28)+(val43*val31)+(val49*val34)+(val38*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val37*val0)+(val43*val3)+(val49*val6)+(val38*val1)+(val44*val4)+(val50*val7)+(val39*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val37*val9)+(val43*val12)+(val49*val15)+(val38*val10)+(val44*val13)+(val50*val16)+(val39*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val37*val18)+(val43*val21)+(val49*val24)+(val38*val19)+(val44*val22)+(val50*val25)+(val39*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val37*val27)+(val43*val30)+(val49*val33)+(val38*val28)+(val44*val31)+(val50*val34)+(val39*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val38*val0)+(val44*val3)+(val50*val6)+(val39*val1)+(val45*val4)+(val51*val7)+(val40*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val38*val9)+(val44*val12)+(val50*val15)+(val39*val10)+(val45*val13)+(val51*val16)+(val40*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val38*val18)+(val44*val21)+(val50*val24)+(val39*val19)+(val45*val22)+(val51*val25)+(val40*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val38*val27)+(val44*val30)+(val50*val33)+(val39*val28)+(val45*val31)+(val51*val34)+(val40*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val39*val0)+(val45*val3)+(val51*val6)+(val40*val1)+(val46*val4)+(val52*val7)+(val41*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val39*val9)+(val45*val12)+(val51*val15)+(val40*val10)+(val46*val13)+(val52*val16)+(val41*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val39*val18)+(val45*val21)+(val51*val24)+(val40*val19)+(val46*val22)+(val52*val25)+(val41*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val39*val27)+(val45*val30)+(val51*val33)+(val40*val28)+(val46*val31)+(val52*val34)+(val41*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = (lidx0<<2);
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu26)>>1]))[(alu26)&1];
  var val55 = data3[(alu26)];
  var val56 = data4[(alu26)];
  var val57 = data6[(alu26)];
  var alu27 = (alu26+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val59 = data3[(alu27)];
  var val60 = data4[(alu27)];
  var val61 = data6[(alu27)];
  var alu28 = (alu26+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val63 = data3[(alu28)];
  var val64 = data4[(alu28)];
  var val65 = data6[(alu28)];
  var alu29 = (alu26+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val67 = data3[(alu29)];
  var val68 = data4[(alu29)];
  var val69 = data6[(alu29)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu30 = (alu0+alu1+(lidx0*10816)+alu2);
  var alu31 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu30)] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu30+2704))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu30+5408))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu30+8112))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu30+1))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu30+2705))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu30+5409))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu30+8113))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu30+2))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu30+2706))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu30+5410))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu30+8114))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu30+3))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
  var alu57 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu30+2707))] = ((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57);
  var alu59 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu30+5411))] = ((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59);
  var alu61 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu30+8115))] = ((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61);
}`;

const r_13_13_8_4_32_4_4_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<2);
  var alu1 = (gidx1*208);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu7 = ((lidx0*1152)+(ridx0*9));
    var val0 = data3[(alu7)];
    var val1 = data3[((alu7+1))];
    var val2 = data3[((alu7+2))];
    var val3 = data3[((alu7+3))];
    var val4 = data3[((alu7+4))];
    var val5 = data3[((alu7+5))];
    var val6 = data3[((alu7+6))];
    var val7 = data3[((alu7+7))];
    var val8 = data3[((alu7+8))];
    var val9 = data3[((alu7+288))];
    var val10 = data3[((alu7+289))];
    var val11 = data3[((alu7+290))];
    var val12 = data3[((alu7+291))];
    var val13 = data3[((alu7+292))];
    var val14 = data3[((alu7+293))];
    var val15 = data3[((alu7+294))];
    var val16 = data3[((alu7+295))];
    var val17 = data3[((alu7+296))];
    var val18 = data3[((alu7+576))];
    var val19 = data3[((alu7+577))];
    var val20 = data3[((alu7+578))];
    var val21 = data3[((alu7+579))];
    var val22 = data3[((alu7+580))];
    var val23 = data3[((alu7+581))];
    var val24 = data3[((alu7+582))];
    var val25 = data3[((alu7+583))];
    var val26 = data3[((alu7+584))];
    var val27 = data3[((alu7+864))];
    var val28 = data3[((alu7+865))];
    var val29 = data3[((alu7+866))];
    var val30 = data3[((alu7+867))];
    var val31 = data3[((alu7+868))];
    var val32 = data3[((alu7+869))];
    var val33 = data3[((alu7+870))];
    var val34 = data3[((alu7+871))];
    var val35 = data3[((alu7+872))];
    var alu8 = (alu1+alu2+(ridx0*2704)+alu0);
    var val36 = data2[(alu8)];
    var val37 = select(0.0f, data2[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data2[((alu8+-52))], alu4);
    var val39 = select(0.0f, data2[((alu8+-51))], alu4);
    var val40 = select(0.0f, data2[((alu8+-50))], alu4);
    var val41 = select(0.0f, data2[((alu8+-49))], alu4);
    var val42 = select(0.0f, data2[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data2[((alu8+-1))], alu3);
    var val44 = data2[((alu8+1))];
    var val45 = data2[((alu8+2))];
    var val46 = data2[((alu8+3))];
    var val47 = select(0.0f, data2[((alu8+4))], alu6);
    var val48 = select(0.0f, data2[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data2[((alu8+52))], alu5);
    var val50 = select(0.0f, data2[((alu8+53))], alu5);
    var val51 = select(0.0f, data2[((alu8+54))], alu5);
    var val52 = select(0.0f, data2[((alu8+55))], alu5);
    var val53 = select(0.0f, data2[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = (alu0+alu1+(lidx0*10816)+alu2);
  var val54 = data1[((alu26+86528))];
  var val55 = data1[((alu26+86529))];
  var val56 = data1[((alu26+86530))];
  var val57 = data1[((alu26+86531))];
  var val58 = data1[((alu26+89232))];
  var val59 = data1[((alu26+89233))];
  var val60 = data1[((alu26+89234))];
  var val61 = data1[((alu26+89235))];
  var val62 = data1[((alu26+91936))];
  var val63 = data1[((alu26+91937))];
  var val64 = data1[((alu26+91938))];
  var val65 = data1[((alu26+91939))];
  var val66 = data1[((alu26+94640))];
  var val67 = data1[((alu26+94641))];
  var val68 = data1[((alu26+94642))];
  var val69 = data1[((alu26+94643))];
  var alu27 = (lidx0<<2);
  var val70 = unpack2x16float(bitcast<u32>(data6[(alu27)>>1]))[(alu27)&1];
  var val71 = data4[(alu27)];
  var val72 = data5[(alu27)];
  var val73 = data7[(alu27)];
  var alu28 = (alu27+1);
  var val74 = unpack2x16float(bitcast<u32>(data6[(alu28)>>1]))[(alu28)&1];
  var val75 = data4[(alu28)];
  var val76 = data5[(alu28)];
  var val77 = data7[(alu28)];
  var alu29 = (alu27+2);
  var val78 = unpack2x16float(bitcast<u32>(data6[(alu29)>>1]))[(alu29)&1];
  var val79 = data4[(alu29)];
  var val80 = data5[(alu29)];
  var val81 = data7[(alu29)];
  var alu30 = (alu27+3);
  var val82 = unpack2x16float(bitcast<u32>(data6[(alu30)>>1]))[(alu30)&1];
  var val83 = data4[(alu30)];
  var val84 = data5[(alu30)];
  var val85 = data7[(alu30)];
  var cast0 = (f32(sqrt((1/(val74+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val78+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val82+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val70+(f32(0.001f)))))));
  var alu31 = (val73+(cast3*val72*(acc0-val71)));
  data0[(alu26)] = (val54+((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31));
  var alu33 = (val77+(cast0*val76*(acc1-val75)));
  data0[((alu26+2704))] = (val58+((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33));
  var alu35 = (val81+(cast1*val80*(acc2-val79)));
  data0[((alu26+5408))] = (val62+((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35));
  var alu37 = (val85+(cast2*val84*(acc3-val83)));
  data0[((alu26+8112))] = (val66+((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37));
  var alu39 = (val73+(cast3*val72*(acc4-val71)));
  data0[((alu26+1))] = (val55+((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39));
  var alu41 = (val77+(cast0*val76*(acc5-val75)));
  data0[((alu26+2705))] = (val59+((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41));
  var alu43 = (val81+(cast1*val80*(acc6-val79)));
  data0[((alu26+5409))] = (val63+((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43));
  var alu45 = (val85+(cast2*val84*(acc7-val83)));
  data0[((alu26+8113))] = (val67+((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45));
  var alu47 = (val73+(cast3*val72*(acc8-val71)));
  data0[((alu26+2))] = (val56+((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47));
  var alu49 = (val77+(cast0*val76*(acc9-val75)));
  data0[((alu26+2706))] = (val60+((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49));
  var alu51 = (val81+(cast1*val80*(acc10-val79)));
  data0[((alu26+5410))] = (val64+((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51));
  var alu53 = (val85+(cast2*val84*(acc11-val83)));
  data0[((alu26+8114))] = (val68+((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53));
  var alu55 = (val73+(cast3*val72*(acc12-val71)));
  data0[((alu26+3))] = (val57+((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55));
  var alu57 = (val77+(cast0*val76*(acc13-val75)));
  data0[((alu26+2707))] = (val61+((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57));
  var alu59 = (val81+(cast1*val80*(acc14-val79)));
  data0[((alu26+5411))] = (val65+((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59));
  var alu61 = (val85+(cast2*val84*(acc15-val83)));
  data0[((alu26+8115))] = (val69+((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61));
}`;

const r_13_13_8_4_32_4_4_3_3n2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<2);
  var alu1 = (gidx1*208);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu7 = ((lidx0*1152)+(ridx0*9));
    var val0 = data2[(alu7)];
    var val1 = data2[((alu7+1))];
    var val2 = data2[((alu7+2))];
    var val3 = data2[((alu7+3))];
    var val4 = data2[((alu7+4))];
    var val5 = data2[((alu7+5))];
    var val6 = data2[((alu7+6))];
    var val7 = data2[((alu7+7))];
    var val8 = data2[((alu7+8))];
    var val9 = data2[((alu7+288))];
    var val10 = data2[((alu7+289))];
    var val11 = data2[((alu7+290))];
    var val12 = data2[((alu7+291))];
    var val13 = data2[((alu7+292))];
    var val14 = data2[((alu7+293))];
    var val15 = data2[((alu7+294))];
    var val16 = data2[((alu7+295))];
    var val17 = data2[((alu7+296))];
    var val18 = data2[((alu7+576))];
    var val19 = data2[((alu7+577))];
    var val20 = data2[((alu7+578))];
    var val21 = data2[((alu7+579))];
    var val22 = data2[((alu7+580))];
    var val23 = data2[((alu7+581))];
    var val24 = data2[((alu7+582))];
    var val25 = data2[((alu7+583))];
    var val26 = data2[((alu7+584))];
    var val27 = data2[((alu7+864))];
    var val28 = data2[((alu7+865))];
    var val29 = data2[((alu7+866))];
    var val30 = data2[((alu7+867))];
    var val31 = data2[((alu7+868))];
    var val32 = data2[((alu7+869))];
    var val33 = data2[((alu7+870))];
    var val34 = data2[((alu7+871))];
    var val35 = data2[((alu7+872))];
    var alu8 = (alu1+alu2+(ridx0*2704)+alu0);
    var val36 = data1[(alu8)];
    var val37 = select(0.0f, data1[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data1[((alu8+-52))], alu4);
    var val39 = select(0.0f, data1[((alu8+-51))], alu4);
    var val40 = select(0.0f, data1[((alu8+-50))], alu4);
    var val41 = select(0.0f, data1[((alu8+-49))], alu4);
    var val42 = select(0.0f, data1[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu8+-1))], alu3);
    var val44 = data1[((alu8+1))];
    var val45 = data1[((alu8+2))];
    var val46 = data1[((alu8+3))];
    var val47 = select(0.0f, data1[((alu8+4))], alu6);
    var val48 = select(0.0f, data1[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data1[((alu8+52))], alu5);
    var val50 = select(0.0f, data1[((alu8+53))], alu5);
    var val51 = select(0.0f, data1[((alu8+54))], alu5);
    var val52 = select(0.0f, data1[((alu8+55))], alu5);
    var val53 = select(0.0f, data1[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = (lidx0<<2);
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu26)>>1]))[(alu26)&1];
  var val55 = data3[(alu26)];
  var val56 = data4[(alu26)];
  var val57 = data6[(alu26)];
  var alu27 = (alu26+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val59 = data3[(alu27)];
  var val60 = data4[(alu27)];
  var val61 = data6[(alu27)];
  var alu28 = (alu26+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val63 = data3[(alu28)];
  var val64 = data4[(alu28)];
  var val65 = data6[(alu28)];
  var alu29 = (alu26+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val67 = data3[(alu29)];
  var val68 = data4[(alu29)];
  var val69 = data6[(alu29)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu30 = (alu0+alu1+(lidx0*10816)+alu2);
  var alu31 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu30)] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu30+2704))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu30+5408))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu30+8112))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu30+1))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu30+2705))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu30+5409))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu30+8113))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu30+2))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu30+2706))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu30+5410))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu30+8114))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu30+3))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
  var alu57 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu30+2707))] = ((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57);
  var alu59 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu30+5411))] = ((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59);
  var alu61 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu30+8115))] = ((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61);
}`;

const r_13_13_8_4_32_4_4_3_3n3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(8,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 8 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<2);
  var alu1 = (gidx1*208);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu7 = ((lidx0*1152)+(ridx0*9));
    var val0 = data3[(alu7)];
    var val1 = data3[((alu7+1))];
    var val2 = data3[((alu7+2))];
    var val3 = data3[((alu7+3))];
    var val4 = data3[((alu7+4))];
    var val5 = data3[((alu7+5))];
    var val6 = data3[((alu7+6))];
    var val7 = data3[((alu7+7))];
    var val8 = data3[((alu7+8))];
    var val9 = data3[((alu7+288))];
    var val10 = data3[((alu7+289))];
    var val11 = data3[((alu7+290))];
    var val12 = data3[((alu7+291))];
    var val13 = data3[((alu7+292))];
    var val14 = data3[((alu7+293))];
    var val15 = data3[((alu7+294))];
    var val16 = data3[((alu7+295))];
    var val17 = data3[((alu7+296))];
    var val18 = data3[((alu7+576))];
    var val19 = data3[((alu7+577))];
    var val20 = data3[((alu7+578))];
    var val21 = data3[((alu7+579))];
    var val22 = data3[((alu7+580))];
    var val23 = data3[((alu7+581))];
    var val24 = data3[((alu7+582))];
    var val25 = data3[((alu7+583))];
    var val26 = data3[((alu7+584))];
    var val27 = data3[((alu7+864))];
    var val28 = data3[((alu7+865))];
    var val29 = data3[((alu7+866))];
    var val30 = data3[((alu7+867))];
    var val31 = data3[((alu7+868))];
    var val32 = data3[((alu7+869))];
    var val33 = data3[((alu7+870))];
    var val34 = data3[((alu7+871))];
    var val35 = data3[((alu7+872))];
    var alu8 = (alu1+alu2+(ridx0*2704)+alu0);
    var val36 = data2[(alu8)];
    var val37 = select(0.0f, data2[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data2[((alu8+-52))], alu4);
    var val39 = select(0.0f, data2[((alu8+-51))], alu4);
    var val40 = select(0.0f, data2[((alu8+-50))], alu4);
    var val41 = select(0.0f, data2[((alu8+-49))], alu4);
    var val42 = select(0.0f, data2[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data2[((alu8+-1))], alu3);
    var val44 = data2[((alu8+1))];
    var val45 = data2[((alu8+2))];
    var val46 = data2[((alu8+3))];
    var val47 = select(0.0f, data2[((alu8+4))], alu6);
    var val48 = select(0.0f, data2[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data2[((alu8+52))], alu5);
    var val50 = select(0.0f, data2[((alu8+53))], alu5);
    var val51 = select(0.0f, data2[((alu8+54))], alu5);
    var val52 = select(0.0f, data2[((alu8+55))], alu5);
    var val53 = select(0.0f, data2[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = (alu0+alu1+(lidx0*10816)+alu2);
  var val54 = data1[(alu26)];
  var alu27 = (alu26+1);
  var val55 = data1[(alu27)];
  var alu28 = (alu26+2);
  var val56 = data1[(alu28)];
  var alu29 = (alu26+3);
  var val57 = data1[(alu29)];
  var alu30 = (alu26+2704);
  var val58 = data1[(alu30)];
  var alu31 = (alu26+2705);
  var val59 = data1[(alu31)];
  var alu32 = (alu26+2706);
  var val60 = data1[(alu32)];
  var alu33 = (alu26+2707);
  var val61 = data1[(alu33)];
  var alu34 = (alu26+5408);
  var val62 = data1[(alu34)];
  var alu35 = (alu26+5409);
  var val63 = data1[(alu35)];
  var alu36 = (alu26+5410);
  var val64 = data1[(alu36)];
  var alu37 = (alu26+5411);
  var val65 = data1[(alu37)];
  var alu38 = (alu26+8112);
  var val66 = data1[(alu38)];
  var alu39 = (alu26+8113);
  var val67 = data1[(alu39)];
  var alu40 = (alu26+8114);
  var val68 = data1[(alu40)];
  var alu41 = (alu26+8115);
  var val69 = data1[(alu41)];
  var alu42 = (lidx0<<2);
  var val70 = unpack2x16float(bitcast<u32>(data6[(alu42)>>1]))[(alu42)&1];
  var val71 = data4[(alu42)];
  var val72 = data5[(alu42)];
  var val73 = data7[(alu42)];
  var alu43 = (alu42+1);
  var val74 = unpack2x16float(bitcast<u32>(data6[(alu43)>>1]))[(alu43)&1];
  var val75 = data4[(alu43)];
  var val76 = data5[(alu43)];
  var val77 = data7[(alu43)];
  var alu44 = (alu42+2);
  var val78 = unpack2x16float(bitcast<u32>(data6[(alu44)>>1]))[(alu44)&1];
  var val79 = data4[(alu44)];
  var val80 = data5[(alu44)];
  var val81 = data7[(alu44)];
  var alu45 = (alu42+3);
  var val82 = unpack2x16float(bitcast<u32>(data6[(alu45)>>1]))[(alu45)&1];
  var val83 = data4[(alu45)];
  var val84 = data5[(alu45)];
  var val85 = data7[(alu45)];
  var cast0 = (f32(sqrt((1/(val74+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val78+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val82+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val70+(f32(0.001f)))))));
  var alu46 = (val73+(cast3*val72*(acc0-val71)));
  data0[(alu26)] = (val54+((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46));
  var alu48 = (val77+(cast0*val76*(acc1-val75)));
  data0[(alu30)] = (val58+((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48));
  var alu50 = (val81+(cast1*val80*(acc2-val79)));
  data0[(alu34)] = (val62+((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50));
  var alu52 = (val85+(cast2*val84*(acc3-val83)));
  data0[(alu38)] = (val66+((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52));
  var alu54 = (val73+(cast3*val72*(acc4-val71)));
  data0[(alu27)] = (val55+((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54));
  var alu56 = (val77+(cast0*val76*(acc5-val75)));
  data0[(alu31)] = (val59+((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56));
  var alu58 = (val81+(cast1*val80*(acc6-val79)));
  data0[(alu35)] = (val63+((1/(exp2((alu58*-1.4426950408889634f))+1.0f))*alu58));
  var alu60 = (val85+(cast2*val84*(acc7-val83)));
  data0[(alu39)] = (val67+((1/(exp2((alu60*-1.4426950408889634f))+1.0f))*alu60));
  var alu62 = (val73+(cast3*val72*(acc8-val71)));
  data0[(alu28)] = (val56+((1/(exp2((alu62*-1.4426950408889634f))+1.0f))*alu62));
  var alu64 = (val77+(cast0*val76*(acc9-val75)));
  data0[(alu32)] = (val60+((1/(exp2((alu64*-1.4426950408889634f))+1.0f))*alu64));
  var alu66 = (val81+(cast1*val80*(acc10-val79)));
  data0[(alu36)] = (val64+((1/(exp2((alu66*-1.4426950408889634f))+1.0f))*alu66));
  var alu68 = (val85+(cast2*val84*(acc11-val83)));
  data0[(alu40)] = (val68+((1/(exp2((alu68*-1.4426950408889634f))+1.0f))*alu68));
  var alu70 = (val73+(cast3*val72*(acc12-val71)));
  data0[(alu29)] = (val57+((1/(exp2((alu70*-1.4426950408889634f))+1.0f))*alu70));
  var alu72 = (val77+(cast0*val76*(acc13-val75)));
  data0[(alu33)] = (val61+((1/(exp2((alu72*-1.4426950408889634f))+1.0f))*alu72));
  var alu74 = (val81+(cast1*val80*(acc14-val79)));
  data0[(alu37)] = (val65+((1/(exp2((alu74*-1.4426950408889634f))+1.0f))*alu74));
  var alu76 = (val85+(cast2*val84*(acc15-val83)));
  data0[(alu41)] = (val69+((1/(exp2((alu76*-1.4426950408889634f))+1.0f))*alu76));
}`;

const E_4_169_32_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(32,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (lidx0*2704);
  var alu1 = (gidx1<1);
  var alu2 = (gidx1<2);
  var alu3 = (gidx1<3);
  var alu4 = (alu3!=true);
  var alu5 = (gidx0<<4);
  var alu6 = (lidx1<<2);
  var alu7 = (alu5+alu0+alu6);
  var val0 = select(0.0f, data1[(alu7)], alu1);
  var val1 = select(0.0f, data3[(alu7)], alu4);
  var alu8 = (alu7+1);
  var val2 = select(0.0f, data1[(alu8)], alu1);
  var val3 = select(0.0f, data3[(alu8)], alu4);
  var alu9 = (alu7+2);
  var val4 = select(0.0f, data1[(alu9)], alu1);
  var val5 = select(0.0f, data3[(alu9)], alu4);
  var alu10 = (alu7+3);
  var val6 = select(0.0f, data1[(alu10)], alu1);
  var val7 = select(0.0f, data3[(alu10)], alu4);
  var alu11 = (alu2&(alu1!=true));
  var val8 = select(0.0f, data1[((alu7+86528))], alu11);
  var val9 = select(0.0f, data1[((alu7+86529))], alu11);
  var val10 = select(0.0f, data1[((alu7+86530))], alu11);
  var val11 = select(0.0f, data1[((alu7+86531))], alu11);
  var alu12 = (alu3&(alu2!=true));
  var val12 = select(0.0f, data2[(alu8)], alu12);
  var val13 = select(0.0f, data2[(alu9)], alu12);
  var val14 = select(0.0f, data2[(alu10)], alu12);
  var val15 = select(0.0f, data2[(alu7)], alu12);
  var alu13 = (alu5+(gidx1*86528)+alu0+alu6);
  data0[(alu13)] = (val1+val15+val8+val0);
  data0[((alu13+1))] = (val3+val12+val2+val9);
  data0[((alu13+2))] = (val5+val13+val4+val10);
  data0[((alu13+3))] = (val7+val14+val6+val11);
}`;

const r_169_16_4_32_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((lidx0<<9)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+128))];
    var val21 = data2[((alu3+129))];
    var val22 = data2[((alu3+130))];
    var val23 = data2[((alu3+131))];
    var val24 = data2[((alu3+256))];
    var val25 = data2[((alu3+257))];
    var val26 = data2[((alu3+258))];
    var val27 = data2[((alu3+259))];
    var val28 = data2[((alu3+384))];
    var val29 = data2[((alu3+385))];
    var val30 = data2[((alu3+386))];
    var val31 = data2[((alu3+387))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val33 = data3[(alu21)];
  var val34 = data4[(alu21)];
  var val35 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val37 = data3[(alu22)];
  var val38 = data4[(alu22)];
  var val39 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val41 = data3[(alu23)];
  var val42 = data4[(alu23)];
  var val43 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val45 = data3[(alu24)];
  var val46 = data4[(alu24)];
  var val47 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu25 = (alu0+(lidx0*10816)+alu1);
  var alu26 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu25+2704))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu25+5408))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu25+8112))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu25+2705))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu25+5409))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu25+8113))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu25+2706))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu25+5410))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu25+8114))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu25+2707))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu25+5411))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu25+8115))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_13_13_32_2_2_64_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (((gidx0+lidx2)<1)!=true);
  var alu1 = (((gidx1+lidx1)<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu2 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+576))];
    var val10 = data2[((alu2+577))];
    var val11 = data2[((alu2+578))];
    var val12 = data2[((alu2+579))];
    var val13 = data2[((alu2+580))];
    var val14 = data2[((alu2+581))];
    var val15 = data2[((alu2+582))];
    var val16 = data2[((alu2+583))];
    var val17 = data2[((alu2+584))];
    var val18 = data2[((alu2+1152))];
    var val19 = data2[((alu2+1153))];
    var val20 = data2[((alu2+1154))];
    var val21 = data2[((alu2+1155))];
    var val22 = data2[((alu2+1156))];
    var val23 = data2[((alu2+1157))];
    var val24 = data2[((alu2+1158))];
    var val25 = data2[((alu2+1159))];
    var val26 = data2[((alu2+1160))];
    var val27 = data2[((alu2+1728))];
    var val28 = data2[((alu2+1729))];
    var val29 = data2[((alu2+1730))];
    var val30 = data2[((alu2+1731))];
    var val31 = data2[((alu2+1732))];
    var val32 = data2[((alu2+1733))];
    var val33 = data2[((alu2+1734))];
    var val34 = data2[((alu2+1735))];
    var val35 = data2[((alu2+1736))];
    var alu3 = ((gidx1*208)+(lidx1*104)+(ridx0*2704)+(gidx0<<2)+(lidx2<<1));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-53))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-52))], alu1);
    var val39 = select(0.0f, data1[((alu3+-51))], alu1);
    var val40 = select(0.0f, data1[((alu3+-1))], alu0);
    var val41 = data1[((alu3+1))];
    var val42 = select(0.0f, data1[((alu3+51))], alu0);
    var val43 = data1[((alu3+52))];
    var val44 = data1[((alu3+53))];
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu9 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val46 = data3[(alu9)];
  var val47 = data4[(alu9)];
  var val48 = data6[(alu9)];
  var alu10 = (alu9+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val50 = data3[(alu10)];
  var val51 = data4[(alu10)];
  var val52 = data6[(alu10)];
  var alu11 = (alu9+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu11)>>1]))[(alu11)&1];
  var val54 = data3[(alu11)];
  var val55 = data4[(alu11)];
  var val56 = data6[(alu11)];
  var alu12 = (alu9+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val58 = data3[(alu12)];
  var val59 = data4[(alu12)];
  var val60 = data6[(alu12)];
  var alu13 = (lidx2+(gidx0<<1)+(gidx1*52)+(lidx0*2704)+(lidx1*26));
  var alu14 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu13)] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu13+676))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu13+1352))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
  var alu20 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu13+2028))] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
}`;

const r_169_32_32_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 32; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((lidx0<<9)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+128))];
    var val21 = data2[((alu2+129))];
    var val22 = data2[((alu2+130))];
    var val23 = data2[((alu2+131))];
    var val24 = data2[((alu2+256))];
    var val25 = data2[((alu2+257))];
    var val26 = data2[((alu2+258))];
    var val27 = data2[((alu2+259))];
    var val28 = data2[((alu2+384))];
    var val29 = data2[((alu2+385))];
    var val30 = data2[((alu2+386))];
    var val31 = data2[((alu2+387))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu20)>>1]))[(alu20)&1];
  var val33 = data3[(alu20)];
  var val34 = data4[(alu20)];
  var val35 = data6[(alu20)];
  var alu21 = (alu20+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val37 = data3[(alu21)];
  var val38 = data4[(alu21)];
  var val39 = data6[(alu21)];
  var alu22 = (alu20+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val41 = data3[(alu22)];
  var val42 = data4[(alu22)];
  var val43 = data6[(alu22)];
  var alu23 = (alu20+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val45 = data3[(alu23)];
  var val46 = data4[(alu23)];
  var val47 = data6[(alu23)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu24 = (alu0+(lidx0*2704));
  var alu25 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu24)] = ((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25);
  var alu27 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu24+676))] = ((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27);
  var alu29 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu24+1352))] = ((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29);
  var alu31 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu24+2028))] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu24+1))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu24+677))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu24+1353))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu24+2029))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu24+2))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu24+678))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu24+1354))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu24+2030))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu24+3))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu24+679))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu24+1355))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu24+2031))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
}`;

const r_13_13_16_2_2_64_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<1);
  var alu1 = (gidx1*52);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu0);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu8 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+576))];
    var val10 = data2[((alu8+577))];
    var val11 = data2[((alu8+578))];
    var val12 = data2[((alu8+579))];
    var val13 = data2[((alu8+580))];
    var val14 = data2[((alu8+581))];
    var val15 = data2[((alu8+582))];
    var val16 = data2[((alu8+583))];
    var val17 = data2[((alu8+584))];
    var val18 = data2[((alu8+1152))];
    var val19 = data2[((alu8+1153))];
    var val20 = data2[((alu8+1154))];
    var val21 = data2[((alu8+1155))];
    var val22 = data2[((alu8+1156))];
    var val23 = data2[((alu8+1157))];
    var val24 = data2[((alu8+1158))];
    var val25 = data2[((alu8+1159))];
    var val26 = data2[((alu8+1160))];
    var val27 = data2[((alu8+1728))];
    var val28 = data2[((alu8+1729))];
    var val29 = data2[((alu8+1730))];
    var val30 = data2[((alu8+1731))];
    var val31 = data2[((alu8+1732))];
    var val32 = data2[((alu8+1733))];
    var val33 = data2[((alu8+1734))];
    var val34 = data2[((alu8+1735))];
    var val35 = data2[((alu8+1736))];
    var alu9 = (alu3+alu1+alu2+(ridx0*676));
    var val36 = select(0.0f, data1[((alu9+43237))], (alu4&alu5));
    var val37 = select(0.0f, data1[((alu9+43238))], alu5);
    var val38 = select(0.0f, data1[((alu9+43239))], (alu7&alu5));
    var val39 = select(0.0f, data1[((alu9+43263))], alu4);
    var val40 = data1[((alu9+43264))];
    var val41 = select(0.0f, data1[((alu9+43265))], alu7);
    var val42 = select(0.0f, data1[((alu9+43289))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu9+43290))], alu6);
    var val44 = select(0.0f, data1[((alu9+43291))], (alu6&alu7));
    acc0 = (acc0+(val36*val0)+(val39*val3)+(val42*val6)+(val37*val1)+(val40*val4)+(val43*val7)+(val38*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val36*val9)+(val39*val12)+(val42*val15)+(val37*val10)+(val40*val13)+(val43*val16)+(val38*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val36*val18)+(val39*val21)+(val42*val24)+(val37*val19)+(val40*val22)+(val43*val25)+(val38*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val36*val27)+(val39*val30)+(val42*val33)+(val37*val28)+(val40*val31)+(val43*val34)+(val38*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val46 = data3[(alu15)];
  var val47 = data4[(alu15)];
  var val48 = data6[(alu15)];
  var alu16 = (alu15+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu16)>>1]))[(alu16)&1];
  var val50 = data3[(alu16)];
  var val51 = data4[(alu16)];
  var val52 = data6[(alu16)];
  var alu17 = (alu15+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu17)>>1]))[(alu17)&1];
  var val54 = data3[(alu17)];
  var val55 = data4[(alu17)];
  var val56 = data6[(alu17)];
  var alu18 = (alu15+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu18)>>1]))[(alu18)&1];
  var val58 = data3[(alu18)];
  var val59 = data4[(alu18)];
  var val60 = data6[(alu18)];
  var alu19 = (lidx2+alu0+alu1+(lidx0*2704)+alu2);
  var alu20 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu19)] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
  var alu22 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu19+676))] = ((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22);
  var alu24 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu19+1352))] = ((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24);
  var alu26 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu19+2028))] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
}`;

const r_13_13_16_2_2_64_4_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<1);
  var alu1 = (gidx1*52);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu0);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu8 = ((lidx0*2304)+(ridx0*9));
    var val0 = data3[(alu8)];
    var val1 = data3[((alu8+1))];
    var val2 = data3[((alu8+2))];
    var val3 = data3[((alu8+3))];
    var val4 = data3[((alu8+4))];
    var val5 = data3[((alu8+5))];
    var val6 = data3[((alu8+6))];
    var val7 = data3[((alu8+7))];
    var val8 = data3[((alu8+8))];
    var val9 = data3[((alu8+576))];
    var val10 = data3[((alu8+577))];
    var val11 = data3[((alu8+578))];
    var val12 = data3[((alu8+579))];
    var val13 = data3[((alu8+580))];
    var val14 = data3[((alu8+581))];
    var val15 = data3[((alu8+582))];
    var val16 = data3[((alu8+583))];
    var val17 = data3[((alu8+584))];
    var val18 = data3[((alu8+1152))];
    var val19 = data3[((alu8+1153))];
    var val20 = data3[((alu8+1154))];
    var val21 = data3[((alu8+1155))];
    var val22 = data3[((alu8+1156))];
    var val23 = data3[((alu8+1157))];
    var val24 = data3[((alu8+1158))];
    var val25 = data3[((alu8+1159))];
    var val26 = data3[((alu8+1160))];
    var val27 = data3[((alu8+1728))];
    var val28 = data3[((alu8+1729))];
    var val29 = data3[((alu8+1730))];
    var val30 = data3[((alu8+1731))];
    var val31 = data3[((alu8+1732))];
    var val32 = data3[((alu8+1733))];
    var val33 = data3[((alu8+1734))];
    var val34 = data3[((alu8+1735))];
    var val35 = data3[((alu8+1736))];
    var alu9 = (alu3+alu1+alu2+(ridx0*676));
    var val36 = data2[(alu9)];
    var val37 = select(0.0f, data2[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data2[((alu9+-26))], alu5);
    var val39 = select(0.0f, data2[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data2[((alu9+-1))], alu4);
    var val41 = select(0.0f, data2[((alu9+1))], alu7);
    var val42 = select(0.0f, data2[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data2[((alu9+26))], alu6);
    var val44 = select(0.0f, data2[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = (lidx2+alu0+alu1+(lidx0*2704)+alu2);
  var val45 = data1[((alu15+43264))];
  var val46 = data1[((alu15+43940))];
  var val47 = data1[((alu15+44616))];
  var val48 = data1[((alu15+45292))];
  var alu16 = (lidx0<<2);
  var val49 = unpack2x16float(bitcast<u32>(data6[(alu16)>>1]))[(alu16)&1];
  var val50 = data4[(alu16)];
  var val51 = data5[(alu16)];
  var val52 = data7[(alu16)];
  var alu17 = (alu16+1);
  var val53 = unpack2x16float(bitcast<u32>(data6[(alu17)>>1]))[(alu17)&1];
  var val54 = data4[(alu17)];
  var val55 = data5[(alu17)];
  var val56 = data7[(alu17)];
  var alu18 = (alu16+2);
  var val57 = unpack2x16float(bitcast<u32>(data6[(alu18)>>1]))[(alu18)&1];
  var val58 = data4[(alu18)];
  var val59 = data5[(alu18)];
  var val60 = data7[(alu18)];
  var alu19 = (alu16+3);
  var val61 = unpack2x16float(bitcast<u32>(data6[(alu19)>>1]))[(alu19)&1];
  var val62 = data4[(alu19)];
  var val63 = data5[(alu19)];
  var val64 = data7[(alu19)];
  var alu20 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc0-val50)));
  data0[(alu15)] = (val45+((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20));
  var alu22 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc1-val54)));
  data0[((alu15+676))] = (val46+((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22));
  var alu24 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc2-val58)));
  data0[((alu15+1352))] = (val47+((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24));
  var alu26 = (val64+((f32(sqrt((1/(val61+(f32(0.001f)))))))*val63*(acc3-val62)));
  data0[((alu15+2028))] = (val48+((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26));
}`;

const r_13_13_16_2_2_64_4_3_3n2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<1);
  var alu1 = (gidx1*52);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu0);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu8 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+576))];
    var val10 = data2[((alu8+577))];
    var val11 = data2[((alu8+578))];
    var val12 = data2[((alu8+579))];
    var val13 = data2[((alu8+580))];
    var val14 = data2[((alu8+581))];
    var val15 = data2[((alu8+582))];
    var val16 = data2[((alu8+583))];
    var val17 = data2[((alu8+584))];
    var val18 = data2[((alu8+1152))];
    var val19 = data2[((alu8+1153))];
    var val20 = data2[((alu8+1154))];
    var val21 = data2[((alu8+1155))];
    var val22 = data2[((alu8+1156))];
    var val23 = data2[((alu8+1157))];
    var val24 = data2[((alu8+1158))];
    var val25 = data2[((alu8+1159))];
    var val26 = data2[((alu8+1160))];
    var val27 = data2[((alu8+1728))];
    var val28 = data2[((alu8+1729))];
    var val29 = data2[((alu8+1730))];
    var val30 = data2[((alu8+1731))];
    var val31 = data2[((alu8+1732))];
    var val32 = data2[((alu8+1733))];
    var val33 = data2[((alu8+1734))];
    var val34 = data2[((alu8+1735))];
    var val35 = data2[((alu8+1736))];
    var alu9 = (alu3+alu1+alu2+(ridx0*676));
    var val36 = data1[(alu9)];
    var val37 = select(0.0f, data1[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data1[((alu9+-26))], alu5);
    var val39 = select(0.0f, data1[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data1[((alu9+-1))], alu4);
    var val41 = select(0.0f, data1[((alu9+1))], alu7);
    var val42 = select(0.0f, data1[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu9+26))], alu6);
    var val44 = select(0.0f, data1[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val46 = data3[(alu15)];
  var val47 = data4[(alu15)];
  var val48 = data6[(alu15)];
  var alu16 = (alu15+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu16)>>1]))[(alu16)&1];
  var val50 = data3[(alu16)];
  var val51 = data4[(alu16)];
  var val52 = data6[(alu16)];
  var alu17 = (alu15+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu17)>>1]))[(alu17)&1];
  var val54 = data3[(alu17)];
  var val55 = data4[(alu17)];
  var val56 = data6[(alu17)];
  var alu18 = (alu15+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu18)>>1]))[(alu18)&1];
  var val58 = data3[(alu18)];
  var val59 = data4[(alu18)];
  var val60 = data6[(alu18)];
  var alu19 = (lidx2+alu0+alu1+(lidx0*2704)+alu2);
  var alu20 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu19)] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
  var alu22 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu19+676))] = ((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22);
  var alu24 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu19+1352))] = ((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24);
  var alu26 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu19+2028))] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
}`;

const r_13_13_16_2_2_64_4_3_3n3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<1);
  var alu1 = (gidx1*52);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu0);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu8 = ((lidx0*2304)+(ridx0*9));
    var val0 = data3[(alu8)];
    var val1 = data3[((alu8+1))];
    var val2 = data3[((alu8+2))];
    var val3 = data3[((alu8+3))];
    var val4 = data3[((alu8+4))];
    var val5 = data3[((alu8+5))];
    var val6 = data3[((alu8+6))];
    var val7 = data3[((alu8+7))];
    var val8 = data3[((alu8+8))];
    var val9 = data3[((alu8+576))];
    var val10 = data3[((alu8+577))];
    var val11 = data3[((alu8+578))];
    var val12 = data3[((alu8+579))];
    var val13 = data3[((alu8+580))];
    var val14 = data3[((alu8+581))];
    var val15 = data3[((alu8+582))];
    var val16 = data3[((alu8+583))];
    var val17 = data3[((alu8+584))];
    var val18 = data3[((alu8+1152))];
    var val19 = data3[((alu8+1153))];
    var val20 = data3[((alu8+1154))];
    var val21 = data3[((alu8+1155))];
    var val22 = data3[((alu8+1156))];
    var val23 = data3[((alu8+1157))];
    var val24 = data3[((alu8+1158))];
    var val25 = data3[((alu8+1159))];
    var val26 = data3[((alu8+1160))];
    var val27 = data3[((alu8+1728))];
    var val28 = data3[((alu8+1729))];
    var val29 = data3[((alu8+1730))];
    var val30 = data3[((alu8+1731))];
    var val31 = data3[((alu8+1732))];
    var val32 = data3[((alu8+1733))];
    var val33 = data3[((alu8+1734))];
    var val34 = data3[((alu8+1735))];
    var val35 = data3[((alu8+1736))];
    var alu9 = (alu3+alu1+alu2+(ridx0*676));
    var val36 = data2[(alu9)];
    var val37 = select(0.0f, data2[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data2[((alu9+-26))], alu5);
    var val39 = select(0.0f, data2[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data2[((alu9+-1))], alu4);
    var val41 = select(0.0f, data2[((alu9+1))], alu7);
    var val42 = select(0.0f, data2[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data2[((alu9+26))], alu6);
    var val44 = select(0.0f, data2[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = (lidx2+alu0+alu1+(lidx0*2704)+alu2);
  var val45 = data1[(alu15)];
  var alu16 = (alu15+676);
  var val46 = data1[(alu16)];
  var alu17 = (alu15+1352);
  var val47 = data1[(alu17)];
  var alu18 = (alu15+2028);
  var val48 = data1[(alu18)];
  var alu19 = (lidx0<<2);
  var val49 = unpack2x16float(bitcast<u32>(data6[(alu19)>>1]))[(alu19)&1];
  var val50 = data4[(alu19)];
  var val51 = data5[(alu19)];
  var val52 = data7[(alu19)];
  var alu20 = (alu19+1);
  var val53 = unpack2x16float(bitcast<u32>(data6[(alu20)>>1]))[(alu20)&1];
  var val54 = data4[(alu20)];
  var val55 = data5[(alu20)];
  var val56 = data7[(alu20)];
  var alu21 = (alu19+2);
  var val57 = unpack2x16float(bitcast<u32>(data6[(alu21)>>1]))[(alu21)&1];
  var val58 = data4[(alu21)];
  var val59 = data5[(alu21)];
  var val60 = data7[(alu21)];
  var alu22 = (alu19+3);
  var val61 = unpack2x16float(bitcast<u32>(data6[(alu22)>>1]))[(alu22)&1];
  var val62 = data4[(alu22)];
  var val63 = data5[(alu22)];
  var val64 = data7[(alu22)];
  var alu23 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc0-val50)));
  data0[(alu15)] = (val45+((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23));
  var alu25 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc1-val54)));
  data0[(alu16)] = (val46+((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25));
  var alu27 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc2-val58)));
  data0[(alu17)] = (val47+((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27));
  var alu29 = (val64+((f32(sqrt((1/(val61+(f32(0.001f)))))))*val63*(acc3-val62)));
  data0[(alu18)] = (val48+((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29));
}`;

const E_8_169_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 8 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1<2);
  var alu1 = (gidx1<4);
  var alu2 = (gidx1<6);
  var alu3 = (alu2!=true);
  var alu4 = ((gidx0<<2)+(gidx1*21632)+(lidx0*676));
  var val0 = select(0.0f, data1[(alu4)], alu0);
  var val1 = select(0.0f, data3[((alu4+-129792))], alu3);
  var val2 = select(0.0f, data3[((alu4+-129791))], alu3);
  var val3 = select(0.0f, data3[((alu4+-129790))], alu3);
  var val4 = select(0.0f, data3[((alu4+-129789))], alu3);
  var alu5 = (alu4+1);
  var val5 = select(0.0f, data1[(alu5)], alu0);
  var alu6 = (alu4+2);
  var val6 = select(0.0f, data1[(alu6)], alu0);
  var alu7 = (alu4+3);
  var val7 = select(0.0f, data1[(alu7)], alu0);
  var alu8 = (alu1&(alu0!=true));
  var val8 = select(0.0f, data1[(alu5)], alu8);
  var val9 = select(0.0f, data1[(alu6)], alu8);
  var val10 = select(0.0f, data1[(alu7)], alu8);
  var val11 = select(0.0f, data1[(alu4)], alu8);
  var alu9 = (alu2&(alu1!=true));
  var val12 = select(0.0f, data2[((alu4+-86528))], alu9);
  var val13 = select(0.0f, data2[((alu4+-86527))], alu9);
  var val14 = select(0.0f, data2[((alu4+-86526))], alu9);
  var val15 = select(0.0f, data2[((alu4+-86525))], alu9);
  data0[(alu4)] = (val1+val12+val0+val11);
  data0[(alu5)] = (val2+val13+val5+val8);
  data0[(alu6)] = (val3+val14+val6+val9);
  data0[(alu7)] = (val4+val15+val7+val10);
}`;

const r_169_32_64_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((lidx0<<10)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+256))];
    var val21 = data2[((alu2+257))];
    var val22 = data2[((alu2+258))];
    var val23 = data2[((alu2+259))];
    var val24 = data2[((alu2+512))];
    var val25 = data2[((alu2+513))];
    var val26 = data2[((alu2+514))];
    var val27 = data2[((alu2+515))];
    var val28 = data2[((alu2+768))];
    var val29 = data2[((alu2+769))];
    var val30 = data2[((alu2+770))];
    var val31 = data2[((alu2+771))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu20)>>1]))[(alu20)&1];
  var val33 = data3[(alu20)];
  var val34 = data4[(alu20)];
  var val35 = data6[(alu20)];
  var alu21 = (alu20+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val37 = data3[(alu21)];
  var val38 = data4[(alu21)];
  var val39 = data6[(alu21)];
  var alu22 = (alu20+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val41 = data3[(alu22)];
  var val42 = data4[(alu22)];
  var val43 = data6[(alu22)];
  var alu23 = (alu20+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val45 = data3[(alu23)];
  var val46 = data4[(alu23)];
  var val47 = data6[(alu23)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu24 = (alu0+(lidx0*2704));
  var alu25 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu24)] = ((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25);
  var alu27 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu24+676))] = ((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27);
  var alu29 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu24+1352))] = ((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29);
  var alu31 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu24+2028))] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu24+1))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu24+677))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu24+1353))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu24+2029))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu24+2))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu24+678))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu24+1354))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu24+2030))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu24+3))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu24+679))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu24+1355))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu24+2031))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
}`;

const r_2_13_13_32_128_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<1)!=true);
  var alu1 = ((gidx1<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu2 = ((gidx2*147456)+(lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+1152))];
    var val10 = data2[((alu2+1153))];
    var val11 = data2[((alu2+1154))];
    var val12 = data2[((alu2+1155))];
    var val13 = data2[((alu2+1156))];
    var val14 = data2[((alu2+1157))];
    var val15 = data2[((alu2+1158))];
    var val16 = data2[((alu2+1159))];
    var val17 = data2[((alu2+1160))];
    var val18 = data2[((alu2+2304))];
    var val19 = data2[((alu2+2305))];
    var val20 = data2[((alu2+2306))];
    var val21 = data2[((alu2+2307))];
    var val22 = data2[((alu2+2308))];
    var val23 = data2[((alu2+2309))];
    var val24 = data2[((alu2+2310))];
    var val25 = data2[((alu2+2311))];
    var val26 = data2[((alu2+2312))];
    var val27 = data2[((alu2+3456))];
    var val28 = data2[((alu2+3457))];
    var val29 = data2[((alu2+3458))];
    var val30 = data2[((alu2+3459))];
    var val31 = data2[((alu2+3460))];
    var val32 = data2[((alu2+3461))];
    var val33 = data2[((alu2+3462))];
    var val34 = data2[((alu2+3463))];
    var val35 = data2[((alu2+3464))];
    var alu3 = ((gidx1*52)+(ridx0*676)+(gidx0<<1));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-27))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-26))], alu1);
    var val39 = select(0.0f, data1[((alu3+-25))], alu1);
    var val40 = select(0.0f, data1[((alu3+-1))], alu0);
    var val41 = data1[((alu3+1))];
    var val42 = select(0.0f, data1[((alu3+25))], alu0);
    var val43 = data1[((alu3+26))];
    var val44 = data1[((alu3+27))];
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu9 = ((gidx2<<7)+(lidx0<<2));
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val46 = data3[(alu9)];
  var val47 = data4[(alu9)];
  var val48 = data6[(alu9)];
  var alu10 = (alu9+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val50 = data3[(alu10)];
  var val51 = data4[(alu10)];
  var val52 = data6[(alu10)];
  var alu11 = (alu9+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu11)>>1]))[(alu11)&1];
  var val54 = data3[(alu11)];
  var val55 = data4[(alu11)];
  var val56 = data6[(alu11)];
  var alu12 = (alu9+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val58 = data3[(alu12)];
  var val59 = data4[(alu12)];
  var val60 = data6[(alu12)];
  var alu13 = (gidx0+(gidx1*13)+(gidx2*21632)+(lidx0*676));
  var alu14 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu13)] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu13+169))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu13+338))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
  var alu20 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu13+507))] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
}`;

const r_2_169_32_64_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((gidx1<<15)+(lidx0<<10)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+256))];
    var val9 = data2[((alu1+257))];
    var val10 = data2[((alu1+258))];
    var val11 = data2[((alu1+259))];
    var val12 = data2[((alu1+512))];
    var val13 = data2[((alu1+513))];
    var val14 = data2[((alu1+514))];
    var val15 = data2[((alu1+515))];
    var val16 = data2[((alu1+768))];
    var val17 = data2[((alu1+769))];
    var val18 = data2[((alu1+770))];
    var val19 = data2[((alu1+771))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = ((gidx1<<7)+(lidx0<<2));
  var val20 = unpack2x16float(bitcast<u32>(data5[(alu7)>>1]))[(alu7)&1];
  var val21 = data3[(alu7)];
  var val22 = data4[(alu7)];
  var val23 = data6[(alu7)];
  var alu8 = (alu7+1);
  var val24 = unpack2x16float(bitcast<u32>(data5[(alu8)>>1]))[(alu8)&1];
  var val25 = data3[(alu8)];
  var val26 = data4[(alu8)];
  var val27 = data6[(alu8)];
  var alu9 = (alu7+2);
  var val28 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val29 = data3[(alu9)];
  var val30 = data4[(alu9)];
  var val31 = data6[(alu9)];
  var alu10 = (alu7+3);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val33 = data3[(alu10)];
  var val34 = data4[(alu10)];
  var val35 = data6[(alu10)];
  var alu11 = (gidx0+(gidx1*21632)+(lidx0*676));
  var alu12 = (val23+((f32(sqrt((1/(val20+(f32(0.001f)))))))*val22*(acc0-val21)));
  data0[(alu11)] = ((1/(exp2((alu12*-1.4426950408889634f))+1.0f))*alu12);
  var alu14 = (val27+((f32(sqrt((1/(val24+(f32(0.001f)))))))*val26*(acc1-val25)));
  data0[((alu11+169))] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val31+((f32(sqrt((1/(val28+(f32(0.001f)))))))*val30*(acc2-val29)));
  data0[((alu11+338))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val35+((f32(sqrt((1/(val32+(f32(0.001f)))))))*val34*(acc3-val33)));
  data0[((alu11+507))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
}`;

const r_13_13_32_128_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu5 = ((lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+1152))];
    var val10 = data2[((alu5+1153))];
    var val11 = data2[((alu5+1154))];
    var val12 = data2[((alu5+1155))];
    var val13 = data2[((alu5+1156))];
    var val14 = data2[((alu5+1157))];
    var val15 = data2[((alu5+1158))];
    var val16 = data2[((alu5+1159))];
    var val17 = data2[((alu5+1160))];
    var val18 = data2[((alu5+2304))];
    var val19 = data2[((alu5+2305))];
    var val20 = data2[((alu5+2306))];
    var val21 = data2[((alu5+2307))];
    var val22 = data2[((alu5+2308))];
    var val23 = data2[((alu5+2309))];
    var val24 = data2[((alu5+2310))];
    var val25 = data2[((alu5+2311))];
    var val26 = data2[((alu5+2312))];
    var val27 = data2[((alu5+3456))];
    var val28 = data2[((alu5+3457))];
    var val29 = data2[((alu5+3458))];
    var val30 = data2[((alu5+3459))];
    var val31 = data2[((alu5+3460))];
    var val32 = data2[((alu5+3461))];
    var val33 = data2[((alu5+3462))];
    var val34 = data2[((alu5+3463))];
    var val35 = data2[((alu5+3464))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = select(0.0f, data1[((alu6+21618))], (alu1&alu2));
    var val37 = select(0.0f, data1[((alu6+21619))], alu2);
    var val38 = select(0.0f, data1[((alu6+21620))], (alu4&alu2));
    var val39 = select(0.0f, data1[((alu6+21631))], alu1);
    var val40 = data1[((alu6+21632))];
    var val41 = select(0.0f, data1[((alu6+21633))], alu4);
    var val42 = select(0.0f, data1[((alu6+21644))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+21645))], alu3);
    var val44 = select(0.0f, data1[((alu6+21646))], (alu4&alu3));
    acc0 = (acc0+(val36*val0)+(val39*val3)+(val42*val6)+(val37*val1)+(val40*val4)+(val43*val7)+(val38*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val36*val9)+(val39*val12)+(val42*val15)+(val37*val10)+(val40*val13)+(val43*val16)+(val38*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val36*val18)+(val39*val21)+(val42*val24)+(val37*val19)+(val40*val22)+(val43*val25)+(val38*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val36*val27)+(val39*val30)+(val42*val33)+(val37*val28)+(val40*val31)+(val43*val34)+(val38*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_13_13_32_128_4_3_3n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<f32>;
@group(0) @binding(7)var<storage,read_write>data6:array<u32>;
@group(0) @binding(8)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu5 = ((lidx0*4608)+(ridx0*9));
    var val0 = data3[(alu5)];
    var val1 = data3[((alu5+1))];
    var val2 = data3[((alu5+2))];
    var val3 = data3[((alu5+3))];
    var val4 = data3[((alu5+4))];
    var val5 = data3[((alu5+5))];
    var val6 = data3[((alu5+6))];
    var val7 = data3[((alu5+7))];
    var val8 = data3[((alu5+8))];
    var val9 = data3[((alu5+1152))];
    var val10 = data3[((alu5+1153))];
    var val11 = data3[((alu5+1154))];
    var val12 = data3[((alu5+1155))];
    var val13 = data3[((alu5+1156))];
    var val14 = data3[((alu5+1157))];
    var val15 = data3[((alu5+1158))];
    var val16 = data3[((alu5+1159))];
    var val17 = data3[((alu5+1160))];
    var val18 = data3[((alu5+2304))];
    var val19 = data3[((alu5+2305))];
    var val20 = data3[((alu5+2306))];
    var val21 = data3[((alu5+2307))];
    var val22 = data3[((alu5+2308))];
    var val23 = data3[((alu5+2309))];
    var val24 = data3[((alu5+2310))];
    var val25 = data3[((alu5+2311))];
    var val26 = data3[((alu5+2312))];
    var val27 = data3[((alu5+3456))];
    var val28 = data3[((alu5+3457))];
    var val29 = data3[((alu5+3458))];
    var val30 = data3[((alu5+3459))];
    var val31 = data3[((alu5+3460))];
    var val32 = data3[((alu5+3461))];
    var val33 = data3[((alu5+3462))];
    var val34 = data3[((alu5+3463))];
    var val35 = data3[((alu5+3464))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data2[(alu6)];
    var val37 = select(0.0f, data2[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data2[((alu6+-13))], alu2);
    var val39 = select(0.0f, data2[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data2[((alu6+-1))], alu1);
    var val41 = select(0.0f, data2[((alu6+1))], alu4);
    var val42 = select(0.0f, data2[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data2[((alu6+13))], alu3);
    var val44 = select(0.0f, data2[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = (gidx0+alu0+(lidx0*676));
  var val45 = data1[((alu12+21632))];
  var val46 = data1[((alu12+21801))];
  var val47 = data1[((alu12+21970))];
  var val48 = data1[((alu12+22139))];
  var alu13 = (lidx0<<2);
  var val49 = unpack2x16float(bitcast<u32>(data6[(alu13)>>1]))[(alu13)&1];
  var val50 = data4[(alu13)];
  var val51 = data5[(alu13)];
  var val52 = data7[(alu13)];
  var alu14 = (alu13+1);
  var val53 = unpack2x16float(bitcast<u32>(data6[(alu14)>>1]))[(alu14)&1];
  var val54 = data4[(alu14)];
  var val55 = data5[(alu14)];
  var val56 = data7[(alu14)];
  var alu15 = (alu13+2);
  var val57 = unpack2x16float(bitcast<u32>(data6[(alu15)>>1]))[(alu15)&1];
  var val58 = data4[(alu15)];
  var val59 = data5[(alu15)];
  var val60 = data7[(alu15)];
  var alu16 = (alu13+3);
  var val61 = unpack2x16float(bitcast<u32>(data6[(alu16)>>1]))[(alu16)&1];
  var val62 = data4[(alu16)];
  var val63 = data5[(alu16)];
  var val64 = data7[(alu16)];
  var alu17 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc0-val50)));
  data0[(alu12)] = (val45+((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17));
  var alu19 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc1-val54)));
  data0[((alu12+169))] = (val46+((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19));
  var alu21 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc2-val58)));
  data0[((alu12+338))] = (val47+((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21));
  var alu23 = (val64+((f32(sqrt((1/(val61+(f32(0.001f)))))))*val63*(acc3-val62)));
  data0[((alu12+507))] = (val48+((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23));
}`;

const E_12_169_32 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 12 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0+(gidx1*5408)+(lidx0*169));
  var alu1 = (gidx1<4);
  var val0 = select(0.0f, data1[(alu0)], alu1);
  var alu2 = (gidx1<8);
  var val1 = select(0.0f, data2[((alu0+-43264))], (alu2!=true));
  var val2 = select(0.0f, data1[(alu0)], (alu2&(alu1!=true)));
  data0[(alu0)] = (val1+val0+val2);
}`;

const r_2_169_32_96_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 96; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((gidx1*49152)+(lidx0*1536)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+384))];
    var val9 = data2[((alu1+385))];
    var val10 = data2[((alu1+386))];
    var val11 = data2[((alu1+387))];
    var val12 = data2[((alu1+768))];
    var val13 = data2[((alu1+769))];
    var val14 = data2[((alu1+770))];
    var val15 = data2[((alu1+771))];
    var val16 = data2[((alu1+1152))];
    var val17 = data2[((alu1+1153))];
    var val18 = data2[((alu1+1154))];
    var val19 = data2[((alu1+1155))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = ((gidx1<<7)+(lidx0<<2));
  var val20 = unpack2x16float(bitcast<u32>(data5[(alu7)>>1]))[(alu7)&1];
  var val21 = data3[(alu7)];
  var val22 = data4[(alu7)];
  var val23 = data6[(alu7)];
  var alu8 = (alu7+1);
  var val24 = unpack2x16float(bitcast<u32>(data5[(alu8)>>1]))[(alu8)&1];
  var val25 = data3[(alu8)];
  var val26 = data4[(alu8)];
  var val27 = data6[(alu8)];
  var alu9 = (alu7+2);
  var val28 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val29 = data3[(alu9)];
  var val30 = data4[(alu9)];
  var val31 = data6[(alu9)];
  var alu10 = (alu7+3);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val33 = data3[(alu10)];
  var val34 = data4[(alu10)];
  var val35 = data6[(alu10)];
  var alu11 = (gidx0+(gidx1*21632)+(lidx0*676));
  var alu12 = (val23+((f32(sqrt((1/(val20+(f32(0.001f)))))))*val22*(acc0-val21)));
  data0[(alu11)] = ((1/(exp2((alu12*-1.4426950408889634f))+1.0f))*alu12);
  var alu14 = (val27+((f32(sqrt((1/(val24+(f32(0.001f)))))))*val26*(acc1-val25)));
  data0[((alu11+169))] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val31+((f32(sqrt((1/(val28+(f32(0.001f)))))))*val30*(acc2-val29)));
  data0[((alu11+338))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val35+((f32(sqrt((1/(val32+(f32(0.001f)))))))*val34*(acc3-val33)));
  data0[((alu11+507))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
}`;

const r_169_32_64_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 32 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((lidx0<<10)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+256))];
    var val9 = data2[((alu1+257))];
    var val10 = data2[((alu1+258))];
    var val11 = data2[((alu1+259))];
    var val12 = data2[((alu1+512))];
    var val13 = data2[((alu1+513))];
    var val14 = data2[((alu1+514))];
    var val15 = data2[((alu1+515))];
    var val16 = data2[((alu1+768))];
    var val17 = data2[((alu1+769))];
    var val18 = data2[((alu1+770))];
    var val19 = data2[((alu1+771))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = (lidx0<<2);
  var val20 = unpack2x16float(bitcast<u32>(data5[(alu7)>>1]))[(alu7)&1];
  var val21 = data3[(alu7)];
  var val22 = data4[(alu7)];
  var val23 = data6[(alu7)];
  var alu8 = (alu7+1);
  var val24 = unpack2x16float(bitcast<u32>(data5[(alu8)>>1]))[(alu8)&1];
  var val25 = data3[(alu8)];
  var val26 = data4[(alu8)];
  var val27 = data6[(alu8)];
  var alu9 = (alu7+2);
  var val28 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val29 = data3[(alu9)];
  var val30 = data4[(alu9)];
  var val31 = data6[(alu9)];
  var alu10 = (alu7+3);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val33 = data3[(alu10)];
  var val34 = data4[(alu10)];
  var val35 = data6[(alu10)];
  var alu11 = (gidx0+(lidx0*676));
  var alu12 = (val23+((f32(sqrt((1/(val20+(f32(0.001f)))))))*val22*(acc0-val21)));
  data0[(alu11)] = ((1/(exp2((alu12*-1.4426950408889634f))+1.0f))*alu12);
  var alu14 = (val27+((f32(sqrt((1/(val24+(f32(0.001f)))))))*val26*(acc1-val25)));
  data0[((alu11+169))] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val31+((f32(sqrt((1/(val28+(f32(0.001f)))))))*val30*(acc2-val29)));
  data0[((alu11+338))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val35+((f32(sqrt((1/(val32+(f32(0.001f)))))))*val34*(acc3-val33)));
  data0[((alu11+507))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
}`;

const r_4_13_13_32_5_5 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 4 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*13);
  var alu1 = (gidx2*5408);
  var alu2 = (lidx0*169);
  var acc0 = (f32(-INFINITY));
  for (var ridx0 = 0; ridx0 < 5; ridx0++) {
    var alu3 = (gidx1+ridx0);
    var alu4 = (gidx0+alu0+(ridx0*13)+alu1+alu2);
    var alu5 = ((alu3<15)&((alu3<2)!=true));
    var val0 = select(0.0f, data1[((alu4+-26))], alu5);
    var val1 = select(0.0f, data1[((alu4+-24))], ((gidx0<11)&alu5));
    var val2 = select(0.0f, data1[((alu4+-25))], ((gidx0<12)&alu5));
    var val3 = select(0.0f, data1[((alu4+-27))], (((gidx0<1)!=true)&alu5));
    var val4 = select(0.0f, data1[((alu4+-28))], (((gidx0<2)!=true)&alu5));
    var alu6 = select(val4,val3,(val4<val3));
    var alu7 = select(val0,alu6,(val0<alu6));
    var alu8 = select(val2,alu7,(val2<alu7));
    var alu9 = select(val1,alu8,(val1<alu8));
    acc0 = select(acc0,alu9,(acc0<alu9));
  }
  data0[((gidx0+alu0+alu1+alu2))] = acc0;
}`;

const E_16_169_32 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 16 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0+(gidx1*5408)+(lidx0*169));
  var alu1 = (gidx1<4);
  var val0 = select(0.0f, data1[(alu0)], alu1);
  var alu2 = (gidx1<8);
  var alu3 = (gidx1<12);
  var val1 = select(0.0f, data4[((alu0+-64896))], (alu3!=true));
  var val2 = select(0.0f, data2[((alu0+-21632))], (alu2&(alu1!=true)));
  var val3 = select(0.0f, data3[((alu0+-43264))], (alu3&(alu2!=true)));
  data0[(alu0)] = (val1+val3+val0+val2);
}`;

const r_2_169_32_128_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 2 */
  var lidx0 = i32(lindex.x); /* 32 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((gidx1<<16)+(lidx0<<11)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+512))];
    var val9 = data2[((alu1+513))];
    var val10 = data2[((alu1+514))];
    var val11 = data2[((alu1+515))];
    var val12 = data2[((alu1+1024))];
    var val13 = data2[((alu1+1025))];
    var val14 = data2[((alu1+1026))];
    var val15 = data2[((alu1+1027))];
    var val16 = data2[((alu1+1536))];
    var val17 = data2[((alu1+1537))];
    var val18 = data2[((alu1+1538))];
    var val19 = data2[((alu1+1539))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = ((gidx1<<7)+(lidx0<<2));
  var val20 = unpack2x16float(bitcast<u32>(data5[(alu7)>>1]))[(alu7)&1];
  var val21 = data3[(alu7)];
  var val22 = data4[(alu7)];
  var val23 = data6[(alu7)];
  var alu8 = (alu7+1);
  var val24 = unpack2x16float(bitcast<u32>(data5[(alu8)>>1]))[(alu8)&1];
  var val25 = data3[(alu8)];
  var val26 = data4[(alu8)];
  var val27 = data6[(alu8)];
  var alu9 = (alu7+2);
  var val28 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val29 = data3[(alu9)];
  var val30 = data4[(alu9)];
  var val31 = data6[(alu9)];
  var alu10 = (alu7+3);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val33 = data3[(alu10)];
  var val34 = data4[(alu10)];
  var val35 = data6[(alu10)];
  var alu11 = (gidx0+(gidx1*21632)+(lidx0*676));
  var alu12 = (val23+((f32(sqrt((1/(val20+(f32(0.001f)))))))*val22*(acc0-val21)));
  data0[(alu11)] = ((1/(exp2((alu12*-1.4426950408889634f))+1.0f))*alu12);
  var alu14 = (val27+((f32(sqrt((1/(val24+(f32(0.001f)))))))*val26*(acc1-val25)));
  data0[((alu11+169))] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val31+((f32(sqrt((1/(val28+(f32(0.001f)))))))*val30*(acc2-val29)));
  data0[((alu11+338))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val35+((f32(sqrt((1/(val32+(f32(0.001f)))))))*val34*(acc3-val33)));
  data0[((alu11+507))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
}`;

const E_12_13_13_32_2_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 12 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx2<8);
  var val0 = select(0.0f, data1[((gidx0+(gidx1*13)+(gidx2*5408)+(lidx0*169)))], alu0);
  var alu1 = (lidx2+(gidx1*52)+(gidx2*21632)+(gidx0<<1)+(lidx0*676)+(lidx1*26));
  var val1 = select(0.0f, data2[((alu1+-173056))], (alu0!=true));
  data0[(alu1)] = (val0+val1);
}`;

const r_169_32_96_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 96; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((lidx0*1536)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+384))];
    var val21 = data2[((alu2+385))];
    var val22 = data2[((alu2+386))];
    var val23 = data2[((alu2+387))];
    var val24 = data2[((alu2+768))];
    var val25 = data2[((alu2+769))];
    var val26 = data2[((alu2+770))];
    var val27 = data2[((alu2+771))];
    var val28 = data2[((alu2+1152))];
    var val29 = data2[((alu2+1153))];
    var val30 = data2[((alu2+1154))];
    var val31 = data2[((alu2+1155))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu20)>>1]))[(alu20)&1];
  var val33 = data3[(alu20)];
  var val34 = data4[(alu20)];
  var val35 = data6[(alu20)];
  var alu21 = (alu20+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val37 = data3[(alu21)];
  var val38 = data4[(alu21)];
  var val39 = data6[(alu21)];
  var alu22 = (alu20+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val41 = data3[(alu22)];
  var val42 = data4[(alu22)];
  var val43 = data6[(alu22)];
  var alu23 = (alu20+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val45 = data3[(alu23)];
  var val46 = data4[(alu23)];
  var val47 = data6[(alu23)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu24 = (alu0+(lidx0*2704));
  var alu25 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu24)] = ((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25);
  var alu27 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu24+676))] = ((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27);
  var alu29 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu24+1352))] = ((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29);
  var alu31 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu24+2028))] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu24+1))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu24+677))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu24+1353))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu24+2029))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu24+2))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu24+678))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu24+1354))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu24+2030))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu24+3))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu24+679))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu24+1355))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu24+2031))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
}`;

const E_6_169_32_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 6 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1<2);
  var alu1 = (gidx1<4);
  var alu2 = (alu1!=true);
  var alu3 = ((gidx0<<2)+(gidx1*21632)+(lidx0*676));
  var val0 = select(0.0f, data1[(alu3)], alu0);
  var val1 = select(0.0f, data2[((alu3+-86528))], alu2);
  var val2 = select(0.0f, data2[((alu3+-86527))], alu2);
  var val3 = select(0.0f, data2[((alu3+-86526))], alu2);
  var val4 = select(0.0f, data2[((alu3+-86525))], alu2);
  var alu4 = (alu3+1);
  var val5 = select(0.0f, data1[(alu4)], alu0);
  var alu5 = (alu3+2);
  var val6 = select(0.0f, data1[(alu5)], alu0);
  var alu6 = (alu3+3);
  var val7 = select(0.0f, data1[(alu6)], alu0);
  var alu7 = (alu1&(alu0!=true));
  var val8 = select(0.0f, data1[(alu4)], alu7);
  var val9 = select(0.0f, data1[(alu5)], alu7);
  var val10 = select(0.0f, data1[(alu6)], alu7);
  var val11 = select(0.0f, data1[(alu3)], alu7);
  data0[(alu3)] = (val1+val0+val11);
  data0[(alu4)] = (val2+val5+val8);
  data0[(alu5)] = (val3+val6+val9);
  data0[(alu6)] = (val4+val7+val10);
}`;

const r_169_32_48_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 48; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((lidx0*768)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+192))];
    var val21 = data2[((alu2+193))];
    var val22 = data2[((alu2+194))];
    var val23 = data2[((alu2+195))];
    var val24 = data2[((alu2+384))];
    var val25 = data2[((alu2+385))];
    var val26 = data2[((alu2+386))];
    var val27 = data2[((alu2+387))];
    var val28 = data2[((alu2+576))];
    var val29 = data2[((alu2+577))];
    var val30 = data2[((alu2+578))];
    var val31 = data2[((alu2+579))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu20)>>1]))[(alu20)&1];
  var val33 = data3[(alu20)];
  var val34 = data4[(alu20)];
  var val35 = data6[(alu20)];
  var alu21 = (alu20+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val37 = data3[(alu21)];
  var val38 = data4[(alu21)];
  var val39 = data6[(alu21)];
  var alu22 = (alu20+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val41 = data3[(alu22)];
  var val42 = data4[(alu22)];
  var val43 = data6[(alu22)];
  var alu23 = (alu20+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val45 = data3[(alu23)];
  var val46 = data4[(alu23)];
  var val47 = data6[(alu23)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu24 = (alu0+(lidx0*2704));
  var alu25 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu24)] = ((1/(exp2((alu25*-1.4426950408889634f))+1.0f))*alu25);
  var alu27 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu24+676))] = ((1/(exp2((alu27*-1.4426950408889634f))+1.0f))*alu27);
  var alu29 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu24+1352))] = ((1/(exp2((alu29*-1.4426950408889634f))+1.0f))*alu29);
  var alu31 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu24+2028))] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu24+1))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu24+677))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu24+1353))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu24+2029))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu24+2))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu24+678))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu24+1354))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu24+2030))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu24+3))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu24+679))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu24+1355))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu24+2031))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
}`;

const E_6_13_13_32_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 6 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx2<4);
  var alu1 = (alu0!=true);
  var alu2 = ((gidx1*208)+(gidx2*86528)+(gidx0<<2)+(lidx0*2704)+(lidx1*52));
  var val0 = select(0.0f, data2[((alu2+-346112))], alu1);
  var val1 = select(0.0f, data2[((alu2+-346111))], alu1);
  var val2 = select(0.0f, data2[((alu2+-346110))], alu1);
  var val3 = select(0.0f, data2[((alu2+-346109))], alu1);
  var alu3 = ((gidx1*52)+(gidx2*21632)+(lidx0*676)+((lidx1>>1)*26)+(gidx0<<1));
  var val4 = select(0.0f, data1[(alu3)], alu0);
  var val5 = select(0.0f, data1[((alu3+1))], alu0);
  data0[((alu2+2))] = (val5+val2);
  data0[((alu2+3))] = (val5+val3);
  data0[(alu2)] = (val4+val0);
  data0[((alu2+1))] = (val4+val1);
}`;

const r_169_16_4_48_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 48; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((lidx0*768)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+192))];
    var val21 = data2[((alu3+193))];
    var val22 = data2[((alu3+194))];
    var val23 = data2[((alu3+195))];
    var val24 = data2[((alu3+384))];
    var val25 = data2[((alu3+385))];
    var val26 = data2[((alu3+386))];
    var val27 = data2[((alu3+387))];
    var val28 = data2[((alu3+576))];
    var val29 = data2[((alu3+577))];
    var val30 = data2[((alu3+578))];
    var val31 = data2[((alu3+579))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val33 = data3[(alu21)];
  var val34 = data4[(alu21)];
  var val35 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val37 = data3[(alu22)];
  var val38 = data4[(alu22)];
  var val39 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val41 = data3[(alu23)];
  var val42 = data4[(alu23)];
  var val43 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val45 = data3[(alu24)];
  var val46 = data4[(alu24)];
  var val47 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu25 = (alu0+(lidx0*10816)+alu1);
  var alu26 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu25+2704))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu25+5408))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu25+8112))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu25+2705))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu25+5409))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu25+8113))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu25+2706))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu25+5410))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu25+8114))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu25+2707))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu25+5411))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu25+8115))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const E_3_169_32_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 3 */
  var lidx0 = i32(lindex.x); /* 32 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (lidx0*2704);
  var alu1 = (gidx1<1);
  var alu2 = (gidx1<2);
  var alu3 = (alu2!=true);
  var alu4 = (gidx0<<4);
  var alu5 = (lidx1<<2);
  var alu6 = (alu4+alu0+alu5);
  var val0 = select(0.0f, data1[(alu6)], alu1);
  var val1 = select(0.0f, data2[(alu6)], alu3);
  var alu7 = (alu6+1);
  var val2 = select(0.0f, data1[(alu7)], alu1);
  var val3 = select(0.0f, data2[(alu7)], alu3);
  var alu8 = (alu6+2);
  var val4 = select(0.0f, data1[(alu8)], alu1);
  var val5 = select(0.0f, data2[(alu8)], alu3);
  var alu9 = (alu6+3);
  var val6 = select(0.0f, data1[(alu9)], alu1);
  var val7 = select(0.0f, data2[(alu9)], alu3);
  var alu10 = (alu2&(alu1!=true));
  var val8 = select(0.0f, data1[((alu6+86528))], alu10);
  var val9 = select(0.0f, data1[((alu6+86529))], alu10);
  var val10 = select(0.0f, data1[((alu6+86530))], alu10);
  var val11 = select(0.0f, data1[((alu6+86531))], alu10);
  var alu11 = (alu4+(gidx1*86528)+alu0+alu5);
  data0[(alu11)] = (val1+val8+val0);
  data0[((alu11+1))] = (val3+val2+val9);
  data0[((alu11+2))] = (val5+val4+val10);
  data0[((alu11+3))] = (val7+val6+val11);
}`;

const r_169_16_4_24_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 24; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((lidx0*384)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+96))];
    var val21 = data2[((alu3+97))];
    var val22 = data2[((alu3+98))];
    var val23 = data2[((alu3+99))];
    var val24 = data2[((alu3+192))];
    var val25 = data2[((alu3+193))];
    var val26 = data2[((alu3+194))];
    var val27 = data2[((alu3+195))];
    var val28 = data2[((alu3+288))];
    var val29 = data2[((alu3+289))];
    var val30 = data2[((alu3+290))];
    var val31 = data2[((alu3+291))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = unpack2x16float(bitcast<u32>(data5[(alu21)>>1]))[(alu21)&1];
  var val33 = data3[(alu21)];
  var val34 = data4[(alu21)];
  var val35 = data6[(alu21)];
  var alu22 = (alu21+1);
  var val36 = unpack2x16float(bitcast<u32>(data5[(alu22)>>1]))[(alu22)&1];
  var val37 = data3[(alu22)];
  var val38 = data4[(alu22)];
  var val39 = data6[(alu22)];
  var alu23 = (alu21+2);
  var val40 = unpack2x16float(bitcast<u32>(data5[(alu23)>>1]))[(alu23)&1];
  var val41 = data3[(alu23)];
  var val42 = data4[(alu23)];
  var val43 = data6[(alu23)];
  var alu24 = (alu21+3);
  var val44 = unpack2x16float(bitcast<u32>(data5[(alu24)>>1]))[(alu24)&1];
  var val45 = data3[(alu24)];
  var val46 = data4[(alu24)];
  var val47 = data6[(alu24)];
  var cast0 = (f32(sqrt((1/(val36+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val40+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val44+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val32+(f32(0.001f)))))));
  var alu25 = (alu0+(lidx0*10816)+alu1);
  var alu26 = (val35+(cast3*val34*(acc0-val33)));
  data0[(alu25)] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
  var alu28 = (val39+(cast0*val38*(acc1-val37)));
  data0[((alu25+2704))] = ((1/(exp2((alu28*-1.4426950408889634f))+1.0f))*alu28);
  var alu30 = (val43+(cast1*val42*(acc2-val41)));
  data0[((alu25+5408))] = ((1/(exp2((alu30*-1.4426950408889634f))+1.0f))*alu30);
  var alu32 = (val47+(cast2*val46*(acc3-val45)));
  data0[((alu25+8112))] = ((1/(exp2((alu32*-1.4426950408889634f))+1.0f))*alu32);
  var alu34 = (val35+(cast3*val34*(acc4-val33)));
  data0[((alu25+1))] = ((1/(exp2((alu34*-1.4426950408889634f))+1.0f))*alu34);
  var alu36 = (val39+(cast0*val38*(acc5-val37)));
  data0[((alu25+2705))] = ((1/(exp2((alu36*-1.4426950408889634f))+1.0f))*alu36);
  var alu38 = (val43+(cast1*val42*(acc6-val41)));
  data0[((alu25+5409))] = ((1/(exp2((alu38*-1.4426950408889634f))+1.0f))*alu38);
  var alu40 = (val47+(cast2*val46*(acc7-val45)));
  data0[((alu25+8113))] = ((1/(exp2((alu40*-1.4426950408889634f))+1.0f))*alu40);
  var alu42 = (val35+(cast3*val34*(acc8-val33)));
  data0[((alu25+2))] = ((1/(exp2((alu42*-1.4426950408889634f))+1.0f))*alu42);
  var alu44 = (val39+(cast0*val38*(acc9-val37)));
  data0[((alu25+2706))] = ((1/(exp2((alu44*-1.4426950408889634f))+1.0f))*alu44);
  var alu46 = (val43+(cast1*val42*(acc10-val41)));
  data0[((alu25+5410))] = ((1/(exp2((alu46*-1.4426950408889634f))+1.0f))*alu46);
  var alu48 = (val47+(cast2*val46*(acc11-val45)));
  data0[((alu25+8114))] = ((1/(exp2((alu48*-1.4426950408889634f))+1.0f))*alu48);
  var alu50 = (val35+(cast3*val34*(acc12-val33)));
  data0[((alu25+3))] = ((1/(exp2((alu50*-1.4426950408889634f))+1.0f))*alu50);
  var alu52 = (val39+(cast0*val38*(acc13-val37)));
  data0[((alu25+2707))] = ((1/(exp2((alu52*-1.4426950408889634f))+1.0f))*alu52);
  var alu54 = (val43+(cast1*val42*(acc14-val41)));
  data0[((alu25+5411))] = ((1/(exp2((alu54*-1.4426950408889634f))+1.0f))*alu54);
  var alu56 = (val47+(cast2*val46*(acc15-val45)));
  data0[((alu25+8115))] = ((1/(exp2((alu56*-1.4426950408889634f))+1.0f))*alu56);
}`;

const r_13_13_16_4_64_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<2);
  var alu1 = (gidx1*208);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu7 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu7)];
    var val1 = data2[((alu7+1))];
    var val2 = data2[((alu7+2))];
    var val3 = data2[((alu7+3))];
    var val4 = data2[((alu7+4))];
    var val5 = data2[((alu7+5))];
    var val6 = data2[((alu7+6))];
    var val7 = data2[((alu7+7))];
    var val8 = data2[((alu7+8))];
    var val9 = data2[((alu7+576))];
    var val10 = data2[((alu7+577))];
    var val11 = data2[((alu7+578))];
    var val12 = data2[((alu7+579))];
    var val13 = data2[((alu7+580))];
    var val14 = data2[((alu7+581))];
    var val15 = data2[((alu7+582))];
    var val16 = data2[((alu7+583))];
    var val17 = data2[((alu7+584))];
    var val18 = data2[((alu7+1152))];
    var val19 = data2[((alu7+1153))];
    var val20 = data2[((alu7+1154))];
    var val21 = data2[((alu7+1155))];
    var val22 = data2[((alu7+1156))];
    var val23 = data2[((alu7+1157))];
    var val24 = data2[((alu7+1158))];
    var val25 = data2[((alu7+1159))];
    var val26 = data2[((alu7+1160))];
    var val27 = data2[((alu7+1728))];
    var val28 = data2[((alu7+1729))];
    var val29 = data2[((alu7+1730))];
    var val30 = data2[((alu7+1731))];
    var val31 = data2[((alu7+1732))];
    var val32 = data2[((alu7+1733))];
    var val33 = data2[((alu7+1734))];
    var val34 = data2[((alu7+1735))];
    var val35 = data2[((alu7+1736))];
    var alu8 = (alu1+alu2+(ridx0*2704)+alu0);
    var val36 = data1[(alu8)];
    var val37 = select(0.0f, data1[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data1[((alu8+-52))], alu4);
    var val39 = select(0.0f, data1[((alu8+-51))], alu4);
    var val40 = select(0.0f, data1[((alu8+-50))], alu4);
    var val41 = select(0.0f, data1[((alu8+-49))], alu4);
    var val42 = select(0.0f, data1[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu8+-1))], alu3);
    var val44 = data1[((alu8+1))];
    var val45 = data1[((alu8+2))];
    var val46 = data1[((alu8+3))];
    var val47 = select(0.0f, data1[((alu8+4))], alu6);
    var val48 = select(0.0f, data1[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data1[((alu8+52))], alu5);
    var val50 = select(0.0f, data1[((alu8+53))], alu5);
    var val51 = select(0.0f, data1[((alu8+54))], alu5);
    var val52 = select(0.0f, data1[((alu8+55))], alu5);
    var val53 = select(0.0f, data1[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = (lidx0<<2);
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu26)>>1]))[(alu26)&1];
  var val55 = data3[(alu26)];
  var val56 = data4[(alu26)];
  var val57 = data6[(alu26)];
  var alu27 = (alu26+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val59 = data3[(alu27)];
  var val60 = data4[(alu27)];
  var val61 = data6[(alu27)];
  var alu28 = (alu26+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val63 = data3[(alu28)];
  var val64 = data4[(alu28)];
  var val65 = data6[(alu28)];
  var alu29 = (alu26+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val67 = data3[(alu29)];
  var val68 = data4[(alu29)];
  var val69 = data6[(alu29)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu30 = (alu0+alu1+(lidx0*10816)+alu2);
  var alu31 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu30)] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu30+2704))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu30+5408))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu30+8112))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu30+1))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu30+2705))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu30+5409))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu30+8113))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu30+2))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu30+2706))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu30+5410))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu30+8114))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu30+3))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
  var alu57 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu30+2707))] = ((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57);
  var alu59 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu30+5411))] = ((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59);
  var alu61 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu30+8115))] = ((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61);
}`;

const r_5_13_13_4_4_64_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx1*208);
  var alu1 = (gidx0<<2);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu7 = ((gidx2*9216)+(lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu7)];
    var val1 = data2[((alu7+1))];
    var val2 = data2[((alu7+2))];
    var val3 = data2[((alu7+3))];
    var val4 = data2[((alu7+4))];
    var val5 = data2[((alu7+5))];
    var val6 = data2[((alu7+6))];
    var val7 = data2[((alu7+7))];
    var val8 = data2[((alu7+8))];
    var val9 = data2[((alu7+576))];
    var val10 = data2[((alu7+577))];
    var val11 = data2[((alu7+578))];
    var val12 = data2[((alu7+579))];
    var val13 = data2[((alu7+580))];
    var val14 = data2[((alu7+581))];
    var val15 = data2[((alu7+582))];
    var val16 = data2[((alu7+583))];
    var val17 = data2[((alu7+584))];
    var val18 = data2[((alu7+1152))];
    var val19 = data2[((alu7+1153))];
    var val20 = data2[((alu7+1154))];
    var val21 = data2[((alu7+1155))];
    var val22 = data2[((alu7+1156))];
    var val23 = data2[((alu7+1157))];
    var val24 = data2[((alu7+1158))];
    var val25 = data2[((alu7+1159))];
    var val26 = data2[((alu7+1160))];
    var val27 = data2[((alu7+1728))];
    var val28 = data2[((alu7+1729))];
    var val29 = data2[((alu7+1730))];
    var val30 = data2[((alu7+1731))];
    var val31 = data2[((alu7+1732))];
    var val32 = data2[((alu7+1733))];
    var val33 = data2[((alu7+1734))];
    var val34 = data2[((alu7+1735))];
    var val35 = data2[((alu7+1736))];
    var alu8 = (alu0+alu2+(ridx0*2704)+alu1);
    var val36 = data1[(alu8)];
    var val37 = select(0.0f, data1[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data1[((alu8+-52))], alu4);
    var val39 = select(0.0f, data1[((alu8+-51))], alu4);
    var val40 = select(0.0f, data1[((alu8+-50))], alu4);
    var val41 = select(0.0f, data1[((alu8+-49))], alu4);
    var val42 = select(0.0f, data1[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu8+-1))], alu3);
    var val44 = data1[((alu8+1))];
    var val45 = data1[((alu8+2))];
    var val46 = data1[((alu8+3))];
    var val47 = select(0.0f, data1[((alu8+4))], alu6);
    var val48 = select(0.0f, data1[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data1[((alu8+52))], alu5);
    var val50 = select(0.0f, data1[((alu8+53))], alu5);
    var val51 = select(0.0f, data1[((alu8+54))], alu5);
    var val52 = select(0.0f, data1[((alu8+55))], alu5);
    var val53 = select(0.0f, data1[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = ((gidx2<<4)+(lidx0<<2));
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu26)>>1]))[(alu26)&1];
  var val55 = data3[(alu26)];
  var val56 = data4[(alu26)];
  var val57 = data6[(alu26)];
  var alu27 = (alu26+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val59 = data3[(alu27)];
  var val60 = data4[(alu27)];
  var val61 = data6[(alu27)];
  var alu28 = (alu26+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val63 = data3[(alu28)];
  var val64 = data4[(alu28)];
  var val65 = data6[(alu28)];
  var alu29 = (alu26+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val67 = data3[(alu29)];
  var val68 = data4[(alu29)];
  var val69 = data6[(alu29)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu30 = (alu0+(gidx2*43264)+alu1+(lidx0*10816)+alu2);
  var alu31 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu30)] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu30+2704))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu30+5408))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu30+8112))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu30+1))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu30+2705))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu30+5409))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu30+8113))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu30+2))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu30+2706))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu30+5410))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu30+8114))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu30+3))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
  var alu57 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu30+2707))] = ((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57);
  var alu59 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu30+5411))] = ((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59);
  var alu61 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu30+8115))] = ((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61);
}`;

const r_13_13_16_2_2_64_4_3_3n4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (((gidx0+lidx2)<1)!=true);
  var alu1 = (((gidx1+lidx1)<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu2 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+576))];
    var val10 = data2[((alu2+577))];
    var val11 = data2[((alu2+578))];
    var val12 = data2[((alu2+579))];
    var val13 = data2[((alu2+580))];
    var val14 = data2[((alu2+581))];
    var val15 = data2[((alu2+582))];
    var val16 = data2[((alu2+583))];
    var val17 = data2[((alu2+584))];
    var val18 = data2[((alu2+1152))];
    var val19 = data2[((alu2+1153))];
    var val20 = data2[((alu2+1154))];
    var val21 = data2[((alu2+1155))];
    var val22 = data2[((alu2+1156))];
    var val23 = data2[((alu2+1157))];
    var val24 = data2[((alu2+1158))];
    var val25 = data2[((alu2+1159))];
    var val26 = data2[((alu2+1160))];
    var val27 = data2[((alu2+1728))];
    var val28 = data2[((alu2+1729))];
    var val29 = data2[((alu2+1730))];
    var val30 = data2[((alu2+1731))];
    var val31 = data2[((alu2+1732))];
    var val32 = data2[((alu2+1733))];
    var val33 = data2[((alu2+1734))];
    var val34 = data2[((alu2+1735))];
    var val35 = data2[((alu2+1736))];
    var alu3 = ((gidx1*208)+(lidx1*104)+(ridx0*2704)+(gidx0<<2)+(lidx2<<1));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-53))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-52))], alu1);
    var val39 = select(0.0f, data1[((alu3+-51))], alu1);
    var val40 = select(0.0f, data1[((alu3+-1))], alu0);
    var val41 = data1[((alu3+1))];
    var val42 = select(0.0f, data1[((alu3+51))], alu0);
    var val43 = data1[((alu3+52))];
    var val44 = data1[((alu3+53))];
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu9 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val46 = data3[(alu9)];
  var val47 = data4[(alu9)];
  var val48 = data6[(alu9)];
  var alu10 = (alu9+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val50 = data3[(alu10)];
  var val51 = data4[(alu10)];
  var val52 = data6[(alu10)];
  var alu11 = (alu9+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu11)>>1]))[(alu11)&1];
  var val54 = data3[(alu11)];
  var val55 = data4[(alu11)];
  var val56 = data6[(alu11)];
  var alu12 = (alu9+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val58 = data3[(alu12)];
  var val59 = data4[(alu12)];
  var val60 = data6[(alu12)];
  var alu13 = (lidx2+(gidx0<<1)+(gidx1*52)+(lidx0*2704)+(lidx1*26));
  var alu14 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu13)] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu13+676))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu13+1352))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
  var alu20 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu13+2028))] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
}`;

const r_5_13_13_4_4_80_4_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx1*208);
  var alu1 = (gidx0<<2);
  var alu2 = (lidx1*52);
  var alu3 = ((gidx0<1)!=true);
  var alu4 = (((gidx1+lidx1)<1)!=true);
  var alu5 = ((lidx1+(gidx1<<2))<51);
  var alu6 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 80; ridx0++) {
    var alu7 = ((gidx2*11520)+(lidx0*2880)+(ridx0*9));
    var val0 = data2[(alu7)];
    var val1 = data2[((alu7+1))];
    var val2 = data2[((alu7+2))];
    var val3 = data2[((alu7+3))];
    var val4 = data2[((alu7+4))];
    var val5 = data2[((alu7+5))];
    var val6 = data2[((alu7+6))];
    var val7 = data2[((alu7+7))];
    var val8 = data2[((alu7+8))];
    var val9 = data2[((alu7+720))];
    var val10 = data2[((alu7+721))];
    var val11 = data2[((alu7+722))];
    var val12 = data2[((alu7+723))];
    var val13 = data2[((alu7+724))];
    var val14 = data2[((alu7+725))];
    var val15 = data2[((alu7+726))];
    var val16 = data2[((alu7+727))];
    var val17 = data2[((alu7+728))];
    var val18 = data2[((alu7+1440))];
    var val19 = data2[((alu7+1441))];
    var val20 = data2[((alu7+1442))];
    var val21 = data2[((alu7+1443))];
    var val22 = data2[((alu7+1444))];
    var val23 = data2[((alu7+1445))];
    var val24 = data2[((alu7+1446))];
    var val25 = data2[((alu7+1447))];
    var val26 = data2[((alu7+1448))];
    var val27 = data2[((alu7+2160))];
    var val28 = data2[((alu7+2161))];
    var val29 = data2[((alu7+2162))];
    var val30 = data2[((alu7+2163))];
    var val31 = data2[((alu7+2164))];
    var val32 = data2[((alu7+2165))];
    var val33 = data2[((alu7+2166))];
    var val34 = data2[((alu7+2167))];
    var val35 = data2[((alu7+2168))];
    var alu8 = (alu0+alu2+(ridx0*2704)+alu1);
    var val36 = data1[(alu8)];
    var val37 = select(0.0f, data1[((alu8+-53))], (alu3&alu4));
    var val38 = select(0.0f, data1[((alu8+-52))], alu4);
    var val39 = select(0.0f, data1[((alu8+-51))], alu4);
    var val40 = select(0.0f, data1[((alu8+-50))], alu4);
    var val41 = select(0.0f, data1[((alu8+-49))], alu4);
    var val42 = select(0.0f, data1[((alu8+-48))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu8+-1))], alu3);
    var val44 = data1[((alu8+1))];
    var val45 = data1[((alu8+2))];
    var val46 = data1[((alu8+3))];
    var val47 = select(0.0f, data1[((alu8+4))], alu6);
    var val48 = select(0.0f, data1[((alu8+51))], (alu5&alu3));
    var val49 = select(0.0f, data1[((alu8+52))], alu5);
    var val50 = select(0.0f, data1[((alu8+53))], alu5);
    var val51 = select(0.0f, data1[((alu8+54))], alu5);
    var val52 = select(0.0f, data1[((alu8+55))], alu5);
    var val53 = select(0.0f, data1[((alu8+56))], (alu6&alu5));
    acc0 = (acc0+(val37*val0)+(val43*val3)+(val48*val6)+(val38*val1)+(val36*val4)+(val49*val7)+(val39*val2)+(val44*val5)+(val50*val8));
    acc1 = (acc1+(val37*val9)+(val43*val12)+(val48*val15)+(val38*val10)+(val36*val13)+(val49*val16)+(val39*val11)+(val44*val14)+(val50*val17));
    acc2 = (acc2+(val37*val18)+(val43*val21)+(val48*val24)+(val38*val19)+(val36*val22)+(val49*val25)+(val39*val20)+(val44*val23)+(val50*val26));
    acc3 = (acc3+(val37*val27)+(val43*val30)+(val48*val33)+(val38*val28)+(val36*val31)+(val49*val34)+(val39*val29)+(val44*val32)+(val50*val35));
    acc4 = (acc4+(val38*val0)+(val36*val3)+(val49*val6)+(val39*val1)+(val44*val4)+(val50*val7)+(val40*val2)+(val45*val5)+(val51*val8));
    acc5 = (acc5+(val38*val9)+(val36*val12)+(val49*val15)+(val39*val10)+(val44*val13)+(val50*val16)+(val40*val11)+(val45*val14)+(val51*val17));
    acc6 = (acc6+(val38*val18)+(val36*val21)+(val49*val24)+(val39*val19)+(val44*val22)+(val50*val25)+(val40*val20)+(val45*val23)+(val51*val26));
    acc7 = (acc7+(val38*val27)+(val36*val30)+(val49*val33)+(val39*val28)+(val44*val31)+(val50*val34)+(val40*val29)+(val45*val32)+(val51*val35));
    acc8 = (acc8+(val39*val0)+(val44*val3)+(val50*val6)+(val40*val1)+(val45*val4)+(val51*val7)+(val41*val2)+(val46*val5)+(val52*val8));
    acc9 = (acc9+(val39*val9)+(val44*val12)+(val50*val15)+(val40*val10)+(val45*val13)+(val51*val16)+(val41*val11)+(val46*val14)+(val52*val17));
    acc10 = (acc10+(val39*val18)+(val44*val21)+(val50*val24)+(val40*val19)+(val45*val22)+(val51*val25)+(val41*val20)+(val46*val23)+(val52*val26));
    acc11 = (acc11+(val39*val27)+(val44*val30)+(val50*val33)+(val40*val28)+(val45*val31)+(val51*val34)+(val41*val29)+(val46*val32)+(val52*val35));
    acc12 = (acc12+(val40*val0)+(val45*val3)+(val51*val6)+(val41*val1)+(val46*val4)+(val52*val7)+(val42*val2)+(val47*val5)+(val53*val8));
    acc13 = (acc13+(val40*val9)+(val45*val12)+(val51*val15)+(val41*val10)+(val46*val13)+(val52*val16)+(val42*val11)+(val47*val14)+(val53*val17));
    acc14 = (acc14+(val40*val18)+(val45*val21)+(val51*val24)+(val41*val19)+(val46*val22)+(val52*val25)+(val42*val20)+(val47*val23)+(val53*val26));
    acc15 = (acc15+(val40*val27)+(val45*val30)+(val51*val33)+(val41*val28)+(val46*val31)+(val52*val34)+(val42*val29)+(val47*val32)+(val53*val35));
  }
  var alu26 = ((gidx2<<4)+(lidx0<<2));
  var val54 = unpack2x16float(bitcast<u32>(data5[(alu26)>>1]))[(alu26)&1];
  var val55 = data3[(alu26)];
  var val56 = data4[(alu26)];
  var val57 = data6[(alu26)];
  var alu27 = (alu26+1);
  var val58 = unpack2x16float(bitcast<u32>(data5[(alu27)>>1]))[(alu27)&1];
  var val59 = data3[(alu27)];
  var val60 = data4[(alu27)];
  var val61 = data6[(alu27)];
  var alu28 = (alu26+2);
  var val62 = unpack2x16float(bitcast<u32>(data5[(alu28)>>1]))[(alu28)&1];
  var val63 = data3[(alu28)];
  var val64 = data4[(alu28)];
  var val65 = data6[(alu28)];
  var alu29 = (alu26+3);
  var val66 = unpack2x16float(bitcast<u32>(data5[(alu29)>>1]))[(alu29)&1];
  var val67 = data3[(alu29)];
  var val68 = data4[(alu29)];
  var val69 = data6[(alu29)];
  var cast0 = (f32(sqrt((1/(val58+(f32(0.001f)))))));
  var cast1 = (f32(sqrt((1/(val62+(f32(0.001f)))))));
  var cast2 = (f32(sqrt((1/(val66+(f32(0.001f)))))));
  var cast3 = (f32(sqrt((1/(val54+(f32(0.001f)))))));
  var alu30 = (alu0+(gidx2*43264)+alu1+(lidx0*10816)+alu2);
  var alu31 = (val57+(cast3*val56*(acc0-val55)));
  data0[(alu30)] = ((1/(exp2((alu31*-1.4426950408889634f))+1.0f))*alu31);
  var alu33 = (val61+(cast0*val60*(acc1-val59)));
  data0[((alu30+2704))] = ((1/(exp2((alu33*-1.4426950408889634f))+1.0f))*alu33);
  var alu35 = (val65+(cast1*val64*(acc2-val63)));
  data0[((alu30+5408))] = ((1/(exp2((alu35*-1.4426950408889634f))+1.0f))*alu35);
  var alu37 = (val69+(cast2*val68*(acc3-val67)));
  data0[((alu30+8112))] = ((1/(exp2((alu37*-1.4426950408889634f))+1.0f))*alu37);
  var alu39 = (val57+(cast3*val56*(acc4-val55)));
  data0[((alu30+1))] = ((1/(exp2((alu39*-1.4426950408889634f))+1.0f))*alu39);
  var alu41 = (val61+(cast0*val60*(acc5-val59)));
  data0[((alu30+2705))] = ((1/(exp2((alu41*-1.4426950408889634f))+1.0f))*alu41);
  var alu43 = (val65+(cast1*val64*(acc6-val63)));
  data0[((alu30+5409))] = ((1/(exp2((alu43*-1.4426950408889634f))+1.0f))*alu43);
  var alu45 = (val69+(cast2*val68*(acc7-val67)));
  data0[((alu30+8113))] = ((1/(exp2((alu45*-1.4426950408889634f))+1.0f))*alu45);
  var alu47 = (val57+(cast3*val56*(acc8-val55)));
  data0[((alu30+2))] = ((1/(exp2((alu47*-1.4426950408889634f))+1.0f))*alu47);
  var alu49 = (val61+(cast0*val60*(acc9-val59)));
  data0[((alu30+2706))] = ((1/(exp2((alu49*-1.4426950408889634f))+1.0f))*alu49);
  var alu51 = (val65+(cast1*val64*(acc10-val63)));
  data0[((alu30+5410))] = ((1/(exp2((alu51*-1.4426950408889634f))+1.0f))*alu51);
  var alu53 = (val69+(cast2*val68*(acc11-val67)));
  data0[((alu30+8114))] = ((1/(exp2((alu53*-1.4426950408889634f))+1.0f))*alu53);
  var alu55 = (val57+(cast3*val56*(acc12-val55)));
  data0[((alu30+3))] = ((1/(exp2((alu55*-1.4426950408889634f))+1.0f))*alu55);
  var alu57 = (val61+(cast0*val60*(acc13-val59)));
  data0[((alu30+2707))] = ((1/(exp2((alu57*-1.4426950408889634f))+1.0f))*alu57);
  var alu59 = (val65+(cast1*val64*(acc14-val63)));
  data0[((alu30+5411))] = ((1/(exp2((alu59*-1.4426950408889634f))+1.0f))*alu59);
  var alu61 = (val69+(cast2*val68*(acc15-val67)));
  data0[((alu30+8115))] = ((1/(exp2((alu61*-1.4426950408889634f))+1.0f))*alu61);
}`;

const E_6_169_32_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 6 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1<2);
  var alu1 = (alu0!=true);
  var alu2 = ((gidx0<<2)+(gidx1*21632)+(lidx0*676));
  var val0 = select(0.0f, data1[(alu2)], alu0);
  var val1 = select(0.0f, data2[((alu2+-43264))], alu1);
  var val2 = select(0.0f, data2[((alu2+-43263))], alu1);
  var val3 = select(0.0f, data2[((alu2+-43262))], alu1);
  var val4 = select(0.0f, data2[((alu2+-43261))], alu1);
  var alu3 = (alu2+1);
  var val5 = select(0.0f, data1[(alu3)], alu0);
  var alu4 = (alu2+2);
  var val6 = select(0.0f, data1[(alu4)], alu0);
  var alu5 = (alu2+3);
  var val7 = select(0.0f, data1[(alu5)], alu0);
  data0[(alu3)] = (val5+val2);
  data0[(alu4)] = (val6+val3);
  data0[(alu5)] = (val7+val4);
  data0[(alu2)] = (val0+val1);
}`;

const r_169_16_4_16_4_4_4n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(16,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((lidx0<<8)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+64))];
    var val21 = data2[((alu3+65))];
    var val22 = data2[((alu3+66))];
    var val23 = data2[((alu3+67))];
    var val24 = data2[((alu3+128))];
    var val25 = data2[((alu3+129))];
    var val26 = data2[((alu3+130))];
    var val27 = data2[((alu3+131))];
    var val28 = data2[((alu3+192))];
    var val29 = data2[((alu3+193))];
    var val30 = data2[((alu3+194))];
    var val31 = data2[((alu3+195))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = (lidx0<<2);
  var val32 = data3[(alu21)];
  var val33 = data3[((alu21+1))];
  var val34 = data3[((alu21+2))];
  var val35 = data3[((alu21+3))];
  var alu22 = (alu0+(lidx0*10816)+alu1);
  data0[(alu22)] = (val32+acc0);
  data0[((alu22+1))] = (val32+acc4);
  data0[((alu22+2))] = (val32+acc8);
  data0[((alu22+3))] = (val32+acc12);
  data0[((alu22+2704))] = (val33+acc1);
  data0[((alu22+2705))] = (val33+acc5);
  data0[((alu22+2706))] = (val33+acc9);
  data0[((alu22+2707))] = (val33+acc13);
  data0[((alu22+5408))] = (val34+acc2);
  data0[((alu22+5409))] = (val34+acc6);
  data0[((alu22+5410))] = (val34+acc10);
  data0[((alu22+5411))] = (val34+acc14);
  data0[((alu22+8112))] = (val35+acc3);
  data0[((alu22+8113))] = (val35+acc7);
  data0[((alu22+8114))] = (val35+acc11);
  data0[((alu22+8115))] = (val35+acc15);
}`;

const r_5_169_4_4_20_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(4,4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 4 */
  var alu0 = (gidx0<<4);
  var alu1 = (lidx1<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 20; ridx0++) {
    var alu2 = (alu0+alu1+(ridx0*10816));
    var val0 = data1[(alu2)];
    var val1 = data1[((alu2+1))];
    var val2 = data1[((alu2+2))];
    var val3 = data1[((alu2+3))];
    var val4 = data1[((alu2+2704))];
    var val5 = data1[((alu2+2705))];
    var val6 = data1[((alu2+2706))];
    var val7 = data1[((alu2+2707))];
    var val8 = data1[((alu2+5408))];
    var val9 = data1[((alu2+5409))];
    var val10 = data1[((alu2+5410))];
    var val11 = data1[((alu2+5411))];
    var val12 = data1[((alu2+8112))];
    var val13 = data1[((alu2+8113))];
    var val14 = data1[((alu2+8114))];
    var val15 = data1[((alu2+8115))];
    var alu3 = ((gidx1*1280)+(lidx0*320)+(ridx0<<2));
    var val16 = data2[(alu3)];
    var val17 = data2[((alu3+1))];
    var val18 = data2[((alu3+2))];
    var val19 = data2[((alu3+3))];
    var val20 = data2[((alu3+80))];
    var val21 = data2[((alu3+81))];
    var val22 = data2[((alu3+82))];
    var val23 = data2[((alu3+83))];
    var val24 = data2[((alu3+160))];
    var val25 = data2[((alu3+161))];
    var val26 = data2[((alu3+162))];
    var val27 = data2[((alu3+163))];
    var val28 = data2[((alu3+240))];
    var val29 = data2[((alu3+241))];
    var val30 = data2[((alu3+242))];
    var val31 = data2[((alu3+243))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu21 = ((gidx1<<4)+(lidx0<<2));
  var val32 = data3[(alu21)];
  var val33 = data3[((alu21+1))];
  var val34 = data3[((alu21+2))];
  var val35 = data3[((alu21+3))];
  var alu22 = (alu0+(gidx1*43264)+(lidx0*10816)+alu1);
  data0[(alu22)] = (val32+acc0);
  data0[((alu22+1))] = (val32+acc4);
  data0[((alu22+2))] = (val32+acc8);
  data0[((alu22+3))] = (val32+acc12);
  data0[((alu22+2704))] = (val33+acc1);
  data0[((alu22+2705))] = (val33+acc5);
  data0[((alu22+2706))] = (val33+acc9);
  data0[((alu22+2707))] = (val33+acc13);
  data0[((alu22+5408))] = (val34+acc2);
  data0[((alu22+5409))] = (val34+acc6);
  data0[((alu22+5410))] = (val34+acc10);
  data0[((alu22+5411))] = (val34+acc14);
  data0[((alu22+8112))] = (val35+acc3);
  data0[((alu22+8113))] = (val35+acc7);
  data0[((alu22+8114))] = (val35+acc11);
  data0[((alu22+8115))] = (val35+acc15);
}`;

const r_13_13_16_2_2_128_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx0<<1);
  var alu1 = (gidx1*52);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu0);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu8 = ((lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+1152))];
    var val10 = data2[((alu8+1153))];
    var val11 = data2[((alu8+1154))];
    var val12 = data2[((alu8+1155))];
    var val13 = data2[((alu8+1156))];
    var val14 = data2[((alu8+1157))];
    var val15 = data2[((alu8+1158))];
    var val16 = data2[((alu8+1159))];
    var val17 = data2[((alu8+1160))];
    var val18 = data2[((alu8+2304))];
    var val19 = data2[((alu8+2305))];
    var val20 = data2[((alu8+2306))];
    var val21 = data2[((alu8+2307))];
    var val22 = data2[((alu8+2308))];
    var val23 = data2[((alu8+2309))];
    var val24 = data2[((alu8+2310))];
    var val25 = data2[((alu8+2311))];
    var val26 = data2[((alu8+2312))];
    var val27 = data2[((alu8+3456))];
    var val28 = data2[((alu8+3457))];
    var val29 = data2[((alu8+3458))];
    var val30 = data2[((alu8+3459))];
    var val31 = data2[((alu8+3460))];
    var val32 = data2[((alu8+3461))];
    var val33 = data2[((alu8+3462))];
    var val34 = data2[((alu8+3463))];
    var val35 = data2[((alu8+3464))];
    var alu9 = (alu3+alu1+alu2+(ridx0*676));
    var val36 = data1[(alu9)];
    var val37 = select(0.0f, data1[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data1[((alu9+-26))], alu5);
    var val39 = select(0.0f, data1[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data1[((alu9+-1))], alu4);
    var val41 = select(0.0f, data1[((alu9+1))], alu7);
    var val42 = select(0.0f, data1[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu9+26))], alu6);
    var val44 = select(0.0f, data1[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val46 = data3[(alu15)];
  var val47 = data4[(alu15)];
  var val48 = data6[(alu15)];
  var alu16 = (alu15+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu16)>>1]))[(alu16)&1];
  var val50 = data3[(alu16)];
  var val51 = data4[(alu16)];
  var val52 = data6[(alu16)];
  var alu17 = (alu15+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu17)>>1]))[(alu17)&1];
  var val54 = data3[(alu17)];
  var val55 = data4[(alu17)];
  var val56 = data6[(alu17)];
  var alu18 = (alu15+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu18)>>1]))[(alu18)&1];
  var val58 = data3[(alu18)];
  var val59 = data4[(alu18)];
  var val60 = data6[(alu18)];
  var alu19 = (lidx2+alu0+alu1+(lidx0*2704)+alu2);
  var alu20 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu19)] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
  var alu22 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu19+676))] = ((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22);
  var alu24 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu19+1352))] = ((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24);
  var alu26 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu19+2028))] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
}`;

const r_5_13_13_4_2_2_128_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx1*52);
  var alu1 = (gidx0<<1);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu1);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu8 = ((gidx2*18432)+(lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+1152))];
    var val10 = data2[((alu8+1153))];
    var val11 = data2[((alu8+1154))];
    var val12 = data2[((alu8+1155))];
    var val13 = data2[((alu8+1156))];
    var val14 = data2[((alu8+1157))];
    var val15 = data2[((alu8+1158))];
    var val16 = data2[((alu8+1159))];
    var val17 = data2[((alu8+1160))];
    var val18 = data2[((alu8+2304))];
    var val19 = data2[((alu8+2305))];
    var val20 = data2[((alu8+2306))];
    var val21 = data2[((alu8+2307))];
    var val22 = data2[((alu8+2308))];
    var val23 = data2[((alu8+2309))];
    var val24 = data2[((alu8+2310))];
    var val25 = data2[((alu8+2311))];
    var val26 = data2[((alu8+2312))];
    var val27 = data2[((alu8+3456))];
    var val28 = data2[((alu8+3457))];
    var val29 = data2[((alu8+3458))];
    var val30 = data2[((alu8+3459))];
    var val31 = data2[((alu8+3460))];
    var val32 = data2[((alu8+3461))];
    var val33 = data2[((alu8+3462))];
    var val34 = data2[((alu8+3463))];
    var val35 = data2[((alu8+3464))];
    var alu9 = (alu3+alu0+alu2+(ridx0*676));
    var val36 = data1[(alu9)];
    var val37 = select(0.0f, data1[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data1[((alu9+-26))], alu5);
    var val39 = select(0.0f, data1[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data1[((alu9+-1))], alu4);
    var val41 = select(0.0f, data1[((alu9+1))], alu7);
    var val42 = select(0.0f, data1[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu9+26))], alu6);
    var val44 = select(0.0f, data1[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = ((gidx2<<4)+(lidx0<<2));
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val46 = data3[(alu15)];
  var val47 = data4[(alu15)];
  var val48 = data6[(alu15)];
  var alu16 = (alu15+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu16)>>1]))[(alu16)&1];
  var val50 = data3[(alu16)];
  var val51 = data4[(alu16)];
  var val52 = data6[(alu16)];
  var alu17 = (alu15+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu17)>>1]))[(alu17)&1];
  var val54 = data3[(alu17)];
  var val55 = data4[(alu17)];
  var val56 = data6[(alu17)];
  var alu18 = (alu15+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu18)>>1]))[(alu18)&1];
  var val58 = data3[(alu18)];
  var val59 = data4[(alu18)];
  var val60 = data6[(alu18)];
  var alu19 = (lidx2+alu0+(gidx2*10816)+alu1+(lidx0*2704)+alu2);
  var alu20 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu19)] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
  var alu22 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu19+676))] = ((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22);
  var alu24 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu19+1352))] = ((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24);
  var alu26 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu19+2028))] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
}`;

const r_13_13_32_128_4_3_3n2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = ((gidx0<1)!=true);
  var alu1 = ((gidx1<1)!=true);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu2 = ((lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu2)];
    var val1 = data2[((alu2+1))];
    var val2 = data2[((alu2+2))];
    var val3 = data2[((alu2+3))];
    var val4 = data2[((alu2+4))];
    var val5 = data2[((alu2+5))];
    var val6 = data2[((alu2+6))];
    var val7 = data2[((alu2+7))];
    var val8 = data2[((alu2+8))];
    var val9 = data2[((alu2+1152))];
    var val10 = data2[((alu2+1153))];
    var val11 = data2[((alu2+1154))];
    var val12 = data2[((alu2+1155))];
    var val13 = data2[((alu2+1156))];
    var val14 = data2[((alu2+1157))];
    var val15 = data2[((alu2+1158))];
    var val16 = data2[((alu2+1159))];
    var val17 = data2[((alu2+1160))];
    var val18 = data2[((alu2+2304))];
    var val19 = data2[((alu2+2305))];
    var val20 = data2[((alu2+2306))];
    var val21 = data2[((alu2+2307))];
    var val22 = data2[((alu2+2308))];
    var val23 = data2[((alu2+2309))];
    var val24 = data2[((alu2+2310))];
    var val25 = data2[((alu2+2311))];
    var val26 = data2[((alu2+2312))];
    var val27 = data2[((alu2+3456))];
    var val28 = data2[((alu2+3457))];
    var val29 = data2[((alu2+3458))];
    var val30 = data2[((alu2+3459))];
    var val31 = data2[((alu2+3460))];
    var val32 = data2[((alu2+3461))];
    var val33 = data2[((alu2+3462))];
    var val34 = data2[((alu2+3463))];
    var val35 = data2[((alu2+3464))];
    var alu3 = ((gidx1*52)+(ridx0*676)+(gidx0<<1));
    var val36 = data1[(alu3)];
    var val37 = select(0.0f, data1[((alu3+-27))], (alu0&alu1));
    var val38 = select(0.0f, data1[((alu3+-26))], alu1);
    var val39 = select(0.0f, data1[((alu3+-25))], alu1);
    var val40 = select(0.0f, data1[((alu3+-1))], alu0);
    var val41 = data1[((alu3+1))];
    var val42 = select(0.0f, data1[((alu3+25))], alu0);
    var val43 = data1[((alu3+26))];
    var val44 = data1[((alu3+27))];
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu9 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu9)>>1]))[(alu9)&1];
  var val46 = data3[(alu9)];
  var val47 = data4[(alu9)];
  var val48 = data6[(alu9)];
  var alu10 = (alu9+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu10)>>1]))[(alu10)&1];
  var val50 = data3[(alu10)];
  var val51 = data4[(alu10)];
  var val52 = data6[(alu10)];
  var alu11 = (alu9+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu11)>>1]))[(alu11)&1];
  var val54 = data3[(alu11)];
  var val55 = data4[(alu11)];
  var val56 = data6[(alu11)];
  var alu12 = (alu9+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val58 = data3[(alu12)];
  var val59 = data4[(alu12)];
  var val60 = data6[(alu12)];
  var alu13 = (gidx0+(gidx1*13)+(lidx0*676));
  var alu14 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu13)] = ((1/(exp2((alu14*-1.4426950408889634f))+1.0f))*alu14);
  var alu16 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu13+169))] = ((1/(exp2((alu16*-1.4426950408889634f))+1.0f))*alu16);
  var alu18 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu13+338))] = ((1/(exp2((alu18*-1.4426950408889634f))+1.0f))*alu18);
  var alu20 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu13+507))] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
}`;

const r_5_13_13_4_2_2_80_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4,2,2) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 2 */
  var lidx2 = i32(lindex.z); /* 2 */
  var alu0 = (gidx1*52);
  var alu1 = (gidx0<<1);
  var alu2 = (lidx1*26);
  var alu3 = (lidx2+alu1);
  var alu4 = (((gidx0+lidx2)<1)!=true);
  var alu5 = (((gidx1+lidx1)<1)!=true);
  var alu6 = ((lidx1+(gidx1<<1))<25);
  var alu7 = (alu3<25);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 80; ridx0++) {
    var alu8 = ((gidx2*11520)+(lidx0*2880)+(ridx0*9));
    var val0 = data2[(alu8)];
    var val1 = data2[((alu8+1))];
    var val2 = data2[((alu8+2))];
    var val3 = data2[((alu8+3))];
    var val4 = data2[((alu8+4))];
    var val5 = data2[((alu8+5))];
    var val6 = data2[((alu8+6))];
    var val7 = data2[((alu8+7))];
    var val8 = data2[((alu8+8))];
    var val9 = data2[((alu8+720))];
    var val10 = data2[((alu8+721))];
    var val11 = data2[((alu8+722))];
    var val12 = data2[((alu8+723))];
    var val13 = data2[((alu8+724))];
    var val14 = data2[((alu8+725))];
    var val15 = data2[((alu8+726))];
    var val16 = data2[((alu8+727))];
    var val17 = data2[((alu8+728))];
    var val18 = data2[((alu8+1440))];
    var val19 = data2[((alu8+1441))];
    var val20 = data2[((alu8+1442))];
    var val21 = data2[((alu8+1443))];
    var val22 = data2[((alu8+1444))];
    var val23 = data2[((alu8+1445))];
    var val24 = data2[((alu8+1446))];
    var val25 = data2[((alu8+1447))];
    var val26 = data2[((alu8+1448))];
    var val27 = data2[((alu8+2160))];
    var val28 = data2[((alu8+2161))];
    var val29 = data2[((alu8+2162))];
    var val30 = data2[((alu8+2163))];
    var val31 = data2[((alu8+2164))];
    var val32 = data2[((alu8+2165))];
    var val33 = data2[((alu8+2166))];
    var val34 = data2[((alu8+2167))];
    var val35 = data2[((alu8+2168))];
    var alu9 = (alu3+alu0+alu2+(ridx0*676));
    var val36 = data1[(alu9)];
    var val37 = select(0.0f, data1[((alu9+-27))], (alu4&alu5));
    var val38 = select(0.0f, data1[((alu9+-26))], alu5);
    var val39 = select(0.0f, data1[((alu9+-25))], (alu7&alu5));
    var val40 = select(0.0f, data1[((alu9+-1))], alu4);
    var val41 = select(0.0f, data1[((alu9+1))], alu7);
    var val42 = select(0.0f, data1[((alu9+25))], (alu6&alu4));
    var val43 = select(0.0f, data1[((alu9+26))], alu6);
    var val44 = select(0.0f, data1[((alu9+27))], (alu6&alu7));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu15 = ((gidx2<<4)+(lidx0<<2));
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val46 = data3[(alu15)];
  var val47 = data4[(alu15)];
  var val48 = data6[(alu15)];
  var alu16 = (alu15+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu16)>>1]))[(alu16)&1];
  var val50 = data3[(alu16)];
  var val51 = data4[(alu16)];
  var val52 = data6[(alu16)];
  var alu17 = (alu15+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu17)>>1]))[(alu17)&1];
  var val54 = data3[(alu17)];
  var val55 = data4[(alu17)];
  var val56 = data6[(alu17)];
  var alu18 = (alu15+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu18)>>1]))[(alu18)&1];
  var val58 = data3[(alu18)];
  var val59 = data4[(alu18)];
  var val60 = data6[(alu18)];
  var alu19 = (lidx2+alu0+(gidx2*10816)+alu1+(lidx0*2704)+alu2);
  var alu20 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu19)] = ((1/(exp2((alu20*-1.4426950408889634f))+1.0f))*alu20);
  var alu22 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu19+676))] = ((1/(exp2((alu22*-1.4426950408889634f))+1.0f))*alu22);
  var alu24 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu19+1352))] = ((1/(exp2((alu24*-1.4426950408889634f))+1.0f))*alu24);
  var alu26 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu19+2028))] = ((1/(exp2((alu26*-1.4426950408889634f))+1.0f))*alu26);
}`;

const E_12_169_32n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 12 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx0+(gidx1*5408)+(lidx0*169));
  var alu1 = (gidx1<4);
  var val0 = select(0.0f, data1[(alu0)], alu1);
  var val1 = select(0.0f, data2[((alu0+-21632))], (alu1!=true));
  data0[(alu0)] = (val0+val1);
}`;

const r_169_16_16_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((lidx0<<8)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+64))];
    var val21 = data2[((alu2+65))];
    var val22 = data2[((alu2+66))];
    var val23 = data2[((alu2+67))];
    var val24 = data2[((alu2+128))];
    var val25 = data2[((alu2+129))];
    var val26 = data2[((alu2+130))];
    var val27 = data2[((alu2+131))];
    var val28 = data2[((alu2+192))];
    var val29 = data2[((alu2+193))];
    var val30 = data2[((alu2+194))];
    var val31 = data2[((alu2+195))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = (lidx0<<2);
  var val32 = data3[(alu20)];
  var val33 = data3[((alu20+1))];
  var val34 = data3[((alu20+2))];
  var val35 = data3[((alu20+3))];
  var alu21 = (alu0+(lidx0*2704));
  data0[(alu21)] = (val32+acc0);
  data0[((alu21+1))] = (val32+acc4);
  data0[((alu21+2))] = (val32+acc8);
  data0[((alu21+3))] = (val32+acc12);
  data0[((alu21+676))] = (val33+acc1);
  data0[((alu21+677))] = (val33+acc5);
  data0[((alu21+678))] = (val33+acc9);
  data0[((alu21+679))] = (val33+acc13);
  data0[((alu21+1352))] = (val34+acc2);
  data0[((alu21+1353))] = (val34+acc6);
  data0[((alu21+1354))] = (val34+acc10);
  data0[((alu21+1355))] = (val34+acc14);
  data0[((alu21+2028))] = (val35+acc3);
  data0[((alu21+2029))] = (val35+acc7);
  data0[((alu21+2030))] = (val35+acc11);
  data0[((alu21+2031))] = (val35+acc15);
}`;

const r_5_169_4_20_4_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (gidx0<<2);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  var acc4 = 0.0f;
  var acc5 = 0.0f;
  var acc6 = 0.0f;
  var acc7 = 0.0f;
  var acc8 = 0.0f;
  var acc9 = 0.0f;
  var acc10 = 0.0f;
  var acc11 = 0.0f;
  var acc12 = 0.0f;
  var acc13 = 0.0f;
  var acc14 = 0.0f;
  var acc15 = 0.0f;
  for (var ridx0 = 0; ridx0 < 20; ridx0++) {
    var alu1 = (alu0+(ridx0*2704));
    var val0 = data1[(alu1)];
    var val1 = data1[((alu1+1))];
    var val2 = data1[((alu1+2))];
    var val3 = data1[((alu1+3))];
    var val4 = data1[((alu1+676))];
    var val5 = data1[((alu1+677))];
    var val6 = data1[((alu1+678))];
    var val7 = data1[((alu1+679))];
    var val8 = data1[((alu1+1352))];
    var val9 = data1[((alu1+1353))];
    var val10 = data1[((alu1+1354))];
    var val11 = data1[((alu1+1355))];
    var val12 = data1[((alu1+2028))];
    var val13 = data1[((alu1+2029))];
    var val14 = data1[((alu1+2030))];
    var val15 = data1[((alu1+2031))];
    var alu2 = ((gidx1*1280)+(lidx0*320)+(ridx0<<2));
    var val16 = data2[(alu2)];
    var val17 = data2[((alu2+1))];
    var val18 = data2[((alu2+2))];
    var val19 = data2[((alu2+3))];
    var val20 = data2[((alu2+80))];
    var val21 = data2[((alu2+81))];
    var val22 = data2[((alu2+82))];
    var val23 = data2[((alu2+83))];
    var val24 = data2[((alu2+160))];
    var val25 = data2[((alu2+161))];
    var val26 = data2[((alu2+162))];
    var val27 = data2[((alu2+163))];
    var val28 = data2[((alu2+240))];
    var val29 = data2[((alu2+241))];
    var val30 = data2[((alu2+242))];
    var val31 = data2[((alu2+243))];
    acc0 = (acc0+(val4*val17)+(val0*val16)+(val8*val18)+(val12*val19));
    acc1 = (acc1+(val4*val21)+(val0*val20)+(val8*val22)+(val12*val23));
    acc2 = (acc2+(val4*val25)+(val0*val24)+(val8*val26)+(val12*val27));
    acc3 = (acc3+(val4*val29)+(val0*val28)+(val8*val30)+(val12*val31));
    acc4 = (acc4+(val1*val16)+(val5*val17)+(val9*val18)+(val13*val19));
    acc5 = (acc5+(val1*val20)+(val5*val21)+(val9*val22)+(val13*val23));
    acc6 = (acc6+(val1*val24)+(val5*val25)+(val9*val26)+(val13*val27));
    acc7 = (acc7+(val1*val28)+(val5*val29)+(val9*val30)+(val13*val31));
    acc8 = (acc8+(val2*val16)+(val6*val17)+(val10*val18)+(val14*val19));
    acc9 = (acc9+(val2*val20)+(val6*val21)+(val10*val22)+(val14*val23));
    acc10 = (acc10+(val2*val24)+(val6*val25)+(val10*val26)+(val14*val27));
    acc11 = (acc11+(val2*val28)+(val6*val29)+(val10*val30)+(val14*val31));
    acc12 = (acc12+(val3*val16)+(val7*val17)+(val11*val18)+(val15*val19));
    acc13 = (acc13+(val3*val20)+(val7*val21)+(val11*val22)+(val15*val23));
    acc14 = (acc14+(val3*val24)+(val7*val25)+(val11*val26)+(val15*val27));
    acc15 = (acc15+(val3*val28)+(val7*val29)+(val11*val30)+(val15*val31));
  }
  var alu20 = ((gidx1<<4)+(lidx0<<2));
  var val32 = data3[(alu20)];
  var val33 = data3[((alu20+1))];
  var val34 = data3[((alu20+2))];
  var val35 = data3[((alu20+3))];
  var alu21 = (alu0+(gidx1*10816)+(lidx0*2704));
  data0[(alu21)] = (val32+acc0);
  data0[((alu21+1))] = (val32+acc4);
  data0[((alu21+2))] = (val32+acc8);
  data0[((alu21+3))] = (val32+acc12);
  data0[((alu21+676))] = (val33+acc1);
  data0[((alu21+677))] = (val33+acc5);
  data0[((alu21+678))] = (val33+acc9);
  data0[((alu21+679))] = (val33+acc13);
  data0[((alu21+1352))] = (val34+acc2);
  data0[((alu21+1353))] = (val34+acc6);
  data0[((alu21+1354))] = (val34+acc10);
  data0[((alu21+1355))] = (val34+acc14);
  data0[((alu21+2028))] = (val35+acc3);
  data0[((alu21+2029))] = (val35+acc7);
  data0[((alu21+2030))] = (val35+acc11);
  data0[((alu21+2031))] = (val35+acc15);
}`;

const r_13_13_32_128_4_3_3n3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(32) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 32 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 128; ridx0++) {
    var alu5 = ((lidx0*4608)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+1152))];
    var val10 = data2[((alu5+1153))];
    var val11 = data2[((alu5+1154))];
    var val12 = data2[((alu5+1155))];
    var val13 = data2[((alu5+1156))];
    var val14 = data2[((alu5+1157))];
    var val15 = data2[((alu5+1158))];
    var val16 = data2[((alu5+1159))];
    var val17 = data2[((alu5+1160))];
    var val18 = data2[((alu5+2304))];
    var val19 = data2[((alu5+2305))];
    var val20 = data2[((alu5+2306))];
    var val21 = data2[((alu5+2307))];
    var val22 = data2[((alu5+2308))];
    var val23 = data2[((alu5+2309))];
    var val24 = data2[((alu5+2310))];
    var val25 = data2[((alu5+2311))];
    var val26 = data2[((alu5+2312))];
    var val27 = data2[((alu5+3456))];
    var val28 = data2[((alu5+3457))];
    var val29 = data2[((alu5+3458))];
    var val30 = data2[((alu5+3459))];
    var val31 = data2[((alu5+3460))];
    var val32 = data2[((alu5+3461))];
    var val33 = data2[((alu5+3462))];
    var val34 = data2[((alu5+3463))];
    var val35 = data2[((alu5+3464))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data1[(alu6)];
    var val37 = select(0.0f, data1[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data1[((alu6+-13))], alu2);
    var val39 = select(0.0f, data1[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data1[((alu6+-1))], alu1);
    var val41 = select(0.0f, data1[((alu6+1))], alu4);
    var val42 = select(0.0f, data1[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+13))], alu3);
    var val44 = select(0.0f, data1[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_13_13_16_256_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 256; ridx0++) {
    var alu5 = ((lidx0*9216)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+2304))];
    var val10 = data2[((alu5+2305))];
    var val11 = data2[((alu5+2306))];
    var val12 = data2[((alu5+2307))];
    var val13 = data2[((alu5+2308))];
    var val14 = data2[((alu5+2309))];
    var val15 = data2[((alu5+2310))];
    var val16 = data2[((alu5+2311))];
    var val17 = data2[((alu5+2312))];
    var val18 = data2[((alu5+4608))];
    var val19 = data2[((alu5+4609))];
    var val20 = data2[((alu5+4610))];
    var val21 = data2[((alu5+4611))];
    var val22 = data2[((alu5+4612))];
    var val23 = data2[((alu5+4613))];
    var val24 = data2[((alu5+4614))];
    var val25 = data2[((alu5+4615))];
    var val26 = data2[((alu5+4616))];
    var val27 = data2[((alu5+6912))];
    var val28 = data2[((alu5+6913))];
    var val29 = data2[((alu5+6914))];
    var val30 = data2[((alu5+6915))];
    var val31 = data2[((alu5+6916))];
    var val32 = data2[((alu5+6917))];
    var val33 = data2[((alu5+6918))];
    var val34 = data2[((alu5+6919))];
    var val35 = data2[((alu5+6920))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data1[(alu6)];
    var val37 = select(0.0f, data1[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data1[((alu6+-13))], alu2);
    var val39 = select(0.0f, data1[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data1[((alu6+-1))], alu1);
    var val41 = select(0.0f, data1[((alu6+1))], alu4);
    var val42 = select(0.0f, data1[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+13))], alu3);
    var val44 = select(0.0f, data1[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_5_13_13_4_256_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 256; ridx0++) {
    var alu5 = ((gidx2*36864)+(lidx0*9216)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+2304))];
    var val10 = data2[((alu5+2305))];
    var val11 = data2[((alu5+2306))];
    var val12 = data2[((alu5+2307))];
    var val13 = data2[((alu5+2308))];
    var val14 = data2[((alu5+2309))];
    var val15 = data2[((alu5+2310))];
    var val16 = data2[((alu5+2311))];
    var val17 = data2[((alu5+2312))];
    var val18 = data2[((alu5+4608))];
    var val19 = data2[((alu5+4609))];
    var val20 = data2[((alu5+4610))];
    var val21 = data2[((alu5+4611))];
    var val22 = data2[((alu5+4612))];
    var val23 = data2[((alu5+4613))];
    var val24 = data2[((alu5+4614))];
    var val25 = data2[((alu5+4615))];
    var val26 = data2[((alu5+4616))];
    var val27 = data2[((alu5+6912))];
    var val28 = data2[((alu5+6913))];
    var val29 = data2[((alu5+6914))];
    var val30 = data2[((alu5+6915))];
    var val31 = data2[((alu5+6916))];
    var val32 = data2[((alu5+6917))];
    var val33 = data2[((alu5+6918))];
    var val34 = data2[((alu5+6919))];
    var val35 = data2[((alu5+6920))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data1[(alu6)];
    var val37 = select(0.0f, data1[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data1[((alu6+-13))], alu2);
    var val39 = select(0.0f, data1[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data1[((alu6+-1))], alu1);
    var val41 = select(0.0f, data1[((alu6+1))], alu4);
    var val42 = select(0.0f, data1[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+13))], alu3);
    var val44 = select(0.0f, data1[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = ((gidx2<<4)+(lidx0<<2));
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(gidx2*2704)+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_13_13_16_64_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 64; ridx0++) {
    var alu5 = ((lidx0*2304)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+576))];
    var val10 = data2[((alu5+577))];
    var val11 = data2[((alu5+578))];
    var val12 = data2[((alu5+579))];
    var val13 = data2[((alu5+580))];
    var val14 = data2[((alu5+581))];
    var val15 = data2[((alu5+582))];
    var val16 = data2[((alu5+583))];
    var val17 = data2[((alu5+584))];
    var val18 = data2[((alu5+1152))];
    var val19 = data2[((alu5+1153))];
    var val20 = data2[((alu5+1154))];
    var val21 = data2[((alu5+1155))];
    var val22 = data2[((alu5+1156))];
    var val23 = data2[((alu5+1157))];
    var val24 = data2[((alu5+1158))];
    var val25 = data2[((alu5+1159))];
    var val26 = data2[((alu5+1160))];
    var val27 = data2[((alu5+1728))];
    var val28 = data2[((alu5+1729))];
    var val29 = data2[((alu5+1730))];
    var val30 = data2[((alu5+1731))];
    var val31 = data2[((alu5+1732))];
    var val32 = data2[((alu5+1733))];
    var val33 = data2[((alu5+1734))];
    var val34 = data2[((alu5+1735))];
    var val35 = data2[((alu5+1736))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data1[(alu6)];
    var val37 = select(0.0f, data1[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data1[((alu6+-13))], alu2);
    var val39 = select(0.0f, data1[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data1[((alu6+-1))], alu1);
    var val41 = select(0.0f, data1[((alu6+1))], alu4);
    var val42 = select(0.0f, data1[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+13))], alu3);
    var val44 = select(0.0f, data1[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = (lidx0<<2);
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_5_13_13_4_80_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@group(0) @binding(6)var<storage,read_write>data5:array<u32>;
@group(0) @binding(7)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 13 */
  var gidx1 = i32(gindex.y); /* 13 */
  var gidx2 = i32(gindex.z); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (gidx1*13);
  var alu1 = ((gidx0<1)!=true);
  var alu2 = ((gidx1<1)!=true);
  var alu3 = (gidx1<12);
  var alu4 = (gidx0<12);
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 80; ridx0++) {
    var alu5 = ((gidx2*11520)+(lidx0*2880)+(ridx0*9));
    var val0 = data2[(alu5)];
    var val1 = data2[((alu5+1))];
    var val2 = data2[((alu5+2))];
    var val3 = data2[((alu5+3))];
    var val4 = data2[((alu5+4))];
    var val5 = data2[((alu5+5))];
    var val6 = data2[((alu5+6))];
    var val7 = data2[((alu5+7))];
    var val8 = data2[((alu5+8))];
    var val9 = data2[((alu5+720))];
    var val10 = data2[((alu5+721))];
    var val11 = data2[((alu5+722))];
    var val12 = data2[((alu5+723))];
    var val13 = data2[((alu5+724))];
    var val14 = data2[((alu5+725))];
    var val15 = data2[((alu5+726))];
    var val16 = data2[((alu5+727))];
    var val17 = data2[((alu5+728))];
    var val18 = data2[((alu5+1440))];
    var val19 = data2[((alu5+1441))];
    var val20 = data2[((alu5+1442))];
    var val21 = data2[((alu5+1443))];
    var val22 = data2[((alu5+1444))];
    var val23 = data2[((alu5+1445))];
    var val24 = data2[((alu5+1446))];
    var val25 = data2[((alu5+1447))];
    var val26 = data2[((alu5+1448))];
    var val27 = data2[((alu5+2160))];
    var val28 = data2[((alu5+2161))];
    var val29 = data2[((alu5+2162))];
    var val30 = data2[((alu5+2163))];
    var val31 = data2[((alu5+2164))];
    var val32 = data2[((alu5+2165))];
    var val33 = data2[((alu5+2166))];
    var val34 = data2[((alu5+2167))];
    var val35 = data2[((alu5+2168))];
    var alu6 = (gidx0+alu0+(ridx0*169));
    var val36 = data1[(alu6)];
    var val37 = select(0.0f, data1[((alu6+-14))], (alu1&alu2));
    var val38 = select(0.0f, data1[((alu6+-13))], alu2);
    var val39 = select(0.0f, data1[((alu6+-12))], (alu4&alu2));
    var val40 = select(0.0f, data1[((alu6+-1))], alu1);
    var val41 = select(0.0f, data1[((alu6+1))], alu4);
    var val42 = select(0.0f, data1[((alu6+12))], (alu3&alu1));
    var val43 = select(0.0f, data1[((alu6+13))], alu3);
    var val44 = select(0.0f, data1[((alu6+14))], (alu4&alu3));
    acc0 = (acc0+(val37*val0)+(val40*val3)+(val42*val6)+(val38*val1)+(val36*val4)+(val43*val7)+(val39*val2)+(val41*val5)+(val44*val8));
    acc1 = (acc1+(val37*val9)+(val40*val12)+(val42*val15)+(val38*val10)+(val36*val13)+(val43*val16)+(val39*val11)+(val41*val14)+(val44*val17));
    acc2 = (acc2+(val37*val18)+(val40*val21)+(val42*val24)+(val38*val19)+(val36*val22)+(val43*val25)+(val39*val20)+(val41*val23)+(val44*val26));
    acc3 = (acc3+(val37*val27)+(val40*val30)+(val42*val33)+(val38*val28)+(val36*val31)+(val43*val34)+(val39*val29)+(val41*val32)+(val44*val35));
  }
  var alu12 = ((gidx2<<4)+(lidx0<<2));
  var val45 = unpack2x16float(bitcast<u32>(data5[(alu12)>>1]))[(alu12)&1];
  var val46 = data3[(alu12)];
  var val47 = data4[(alu12)];
  var val48 = data6[(alu12)];
  var alu13 = (alu12+1);
  var val49 = unpack2x16float(bitcast<u32>(data5[(alu13)>>1]))[(alu13)&1];
  var val50 = data3[(alu13)];
  var val51 = data4[(alu13)];
  var val52 = data6[(alu13)];
  var alu14 = (alu12+2);
  var val53 = unpack2x16float(bitcast<u32>(data5[(alu14)>>1]))[(alu14)&1];
  var val54 = data3[(alu14)];
  var val55 = data4[(alu14)];
  var val56 = data6[(alu14)];
  var alu15 = (alu12+3);
  var val57 = unpack2x16float(bitcast<u32>(data5[(alu15)>>1]))[(alu15)&1];
  var val58 = data3[(alu15)];
  var val59 = data4[(alu15)];
  var val60 = data6[(alu15)];
  var alu16 = (gidx0+alu0+(gidx2*2704)+(lidx0*676));
  var alu17 = (val48+((f32(sqrt((1/(val45+(f32(0.001f)))))))*val47*(acc0-val46)));
  data0[(alu16)] = ((1/(exp2((alu17*-1.4426950408889634f))+1.0f))*alu17);
  var alu19 = (val52+((f32(sqrt((1/(val49+(f32(0.001f)))))))*val51*(acc1-val50)));
  data0[((alu16+169))] = ((1/(exp2((alu19*-1.4426950408889634f))+1.0f))*alu19);
  var alu21 = (val56+((f32(sqrt((1/(val53+(f32(0.001f)))))))*val55*(acc2-val54)));
  data0[((alu16+338))] = ((1/(exp2((alu21*-1.4426950408889634f))+1.0f))*alu21);
  var alu23 = (val60+((f32(sqrt((1/(val57+(f32(0.001f)))))))*val59*(acc3-val58)));
  data0[((alu16+507))] = ((1/(exp2((alu23*-1.4426950408889634f))+1.0f))*alu23);
}`;

const r_169_16_16_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var lidx0 = i32(lindex.x); /* 16 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 16; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((lidx0<<8)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+64))];
    var val9 = data2[((alu1+65))];
    var val10 = data2[((alu1+66))];
    var val11 = data2[((alu1+67))];
    var val12 = data2[((alu1+128))];
    var val13 = data2[((alu1+129))];
    var val14 = data2[((alu1+130))];
    var val15 = data2[((alu1+131))];
    var val16 = data2[((alu1+192))];
    var val17 = data2[((alu1+193))];
    var val18 = data2[((alu1+194))];
    var val19 = data2[((alu1+195))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = (lidx0<<2);
  var val20 = data3[(alu7)];
  var val21 = data3[((alu7+1))];
  var val22 = data3[((alu7+2))];
  var val23 = data3[((alu7+3))];
  var alu8 = (gidx0+(lidx0*676));
  data0[(alu8)] = (val20+acc0);
  data0[((alu8+169))] = (val21+acc1);
  data0[((alu8+338))] = (val22+acc2);
  data0[((alu8+507))] = (val23+acc3);
}`;

const r_5_169_4_20_4_4 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 169 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 4 */
  var acc0 = 0.0f;
  var acc1 = 0.0f;
  var acc2 = 0.0f;
  var acc3 = 0.0f;
  for (var ridx0 = 0; ridx0 < 20; ridx0++) {
    var alu0 = (gidx0+(ridx0*676));
    var val0 = data1[(alu0)];
    var val1 = data1[((alu0+169))];
    var val2 = data1[((alu0+338))];
    var val3 = data1[((alu0+507))];
    var alu1 = ((gidx1*1280)+(lidx0*320)+(ridx0<<2));
    var val4 = data2[(alu1)];
    var val5 = data2[((alu1+1))];
    var val6 = data2[((alu1+2))];
    var val7 = data2[((alu1+3))];
    var val8 = data2[((alu1+80))];
    var val9 = data2[((alu1+81))];
    var val10 = data2[((alu1+82))];
    var val11 = data2[((alu1+83))];
    var val12 = data2[((alu1+160))];
    var val13 = data2[((alu1+161))];
    var val14 = data2[((alu1+162))];
    var val15 = data2[((alu1+163))];
    var val16 = data2[((alu1+240))];
    var val17 = data2[((alu1+241))];
    var val18 = data2[((alu1+242))];
    var val19 = data2[((alu1+243))];
    acc0 = (acc0+(val0*val4)+(val1*val5)+(val2*val6)+(val3*val7));
    acc1 = (acc1+(val0*val8)+(val1*val9)+(val2*val10)+(val3*val11));
    acc2 = (acc2+(val0*val12)+(val1*val13)+(val2*val14)+(val3*val15));
    acc3 = (acc3+(val0*val16)+(val1*val17)+(val2*val18)+(val3*val19));
  }
  var alu7 = ((gidx1<<4)+(lidx0<<2));
  var val20 = data3[(alu7)];
  var val21 = data3[((alu7+1))];
  var val22 = data3[((alu7+2))];
  var val23 = data3[((alu7+3))];
  var alu8 = (gidx0+(gidx1*2704)+(lidx0*676));
  data0[(alu8)] = (val20+acc0);
  data0[((alu8+169))] = (val21+acc1);
  data0[((alu8+338))] = (val22+acc2);
  data0[((alu8+507))] = (val23+acc3);
}`;

const r_1183_4_3_16 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data3:array<f32>;
@group(0) @binding(4)var<storage,read_write>data5:array<f32>;
@compute @workgroup_size(4,3) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 3 */
  var alu0 = (gidx0*3);
  var alu1 = (lidx1+alu0);
  var alu2 = (alu1+(lidx0*2704));
  var alu3 = (alu1+(lidx0*10816));
  var alu4 = (alu1+(lidx0*43264));
  var alu5 = (alu1<2704);
  var val0 = select(0.0f, data1[(alu4)], alu5);
  var val1 = select(0.0f, data1[((alu4+2704))], alu5);
  var val2 = select(0.0f, data1[((alu4+5408))], alu5);
  var val3 = select(0.0f, data1[((alu4+8112))], alu5);
  var val4 = select(0.0f, data1[((alu4+10816))], alu5);
  var val5 = select(0.0f, data1[((alu4+13520))], alu5);
  var val6 = select(0.0f, data1[((alu4+16224))], alu5);
  var val7 = select(0.0f, data1[((alu4+18928))], alu5);
  var val8 = select(0.0f, data1[((alu4+21632))], alu5);
  var val9 = select(0.0f, data1[((alu4+24336))], alu5);
  var val10 = select(0.0f, data1[((alu4+27040))], alu5);
  var val11 = select(0.0f, data1[((alu4+29744))], alu5);
  var val12 = select(0.0f, data1[((alu4+32448))], alu5);
  var val13 = select(0.0f, data1[((alu4+35152))], alu5);
  var val14 = select(0.0f, data1[((alu4+37856))], alu5);
  var val15 = select(0.0f, data1[((alu4+40560))], alu5);
  var alu6 = (alu1<3380);
  var alu7 = (alu6!=true);
  var val16 = select(0.0f, data5[((alu2+-3380))], alu7);
  var val17 = select(0.0f, data5[((alu2+-3211))], alu7);
  var val18 = select(0.0f, data5[((alu2+-3042))], alu7);
  var val19 = select(0.0f, data5[((alu2+-2873))], alu7);
  var val20 = select(0.0f, data5[((alu2+-2704))], alu7);
  var val21 = select(0.0f, data5[((alu2+-2535))], alu7);
  var val22 = select(0.0f, data5[((alu2+-2366))], alu7);
  var val23 = select(0.0f, data5[((alu2+-2197))], alu7);
  var val24 = select(0.0f, data5[((alu2+-2028))], alu7);
  var val25 = select(0.0f, data5[((alu2+-1859))], alu7);
  var val26 = select(0.0f, data5[((alu2+-1690))], alu7);
  var val27 = select(0.0f, data5[((alu2+-1521))], alu7);
  var val28 = select(0.0f, data5[((alu2+-1352))], alu7);
  var val29 = select(0.0f, data5[((alu2+-1183))], alu7);
  var val30 = select(0.0f, data5[((alu2+-1014))], alu7);
  var val31 = select(0.0f, data5[((alu2+-845))], alu7);
  var alu8 = (alu6&(alu5!=true));
  var val32 = select(0.0f, data3[(alu3)], alu8);
  var val33 = select(0.0f, data3[((alu3+-2704))], alu8);
  var val34 = select(0.0f, data3[((alu3+-2028))], alu8);
  var val35 = select(0.0f, data3[((alu3+-1352))], alu8);
  var val36 = select(0.0f, data3[((alu3+-676))], alu8);
  var val37 = select(0.0f, data3[((alu3+676))], alu8);
  var val38 = select(0.0f, data3[((alu3+1352))], alu8);
  var val39 = select(0.0f, data3[((alu3+2028))], alu8);
  var val40 = select(0.0f, data3[((alu3+2704))], alu8);
  var val41 = select(0.0f, data3[((alu3+3380))], alu8);
  var val42 = select(0.0f, data3[((alu3+4056))], alu8);
  var val43 = select(0.0f, data3[((alu3+4732))], alu8);
  var val44 = select(0.0f, data3[((alu3+5408))], alu8);
  var val45 = select(0.0f, data3[((alu3+6084))], alu8);
  var val46 = select(0.0f, data3[((alu3+6760))], alu8);
  var val47 = select(0.0f, data3[((alu3+7436))], alu8);
  var alu9 = (val16+val0+val33);
  var alu10 = (val17+val1+val34);
  var alu11 = (val18+val2+val35);
  var alu12 = (val19+val3+val36);
  var alu13 = (val20+val4+val32);
  var alu14 = (val21+val5+val37);
  var alu15 = (val22+val6+val38);
  var alu16 = (val23+val7+val39);
  var alu17 = (val24+val8+val40);
  var alu18 = (val25+val9+val41);
  var alu19 = (val26+val10+val42);
  var alu20 = (val27+val11+val43);
  var alu21 = (val28+val12+val44);
  var alu22 = (val29+val13+val45);
  var alu23 = (val30+val14+val46);
  var alu24 = (val31+val15+val47);
  var alu25 = select(alu9,alu10,(alu9<alu10));
  var alu26 = select(alu11,alu25,(alu11<alu25));
  var alu27 = select(alu12,alu26,(alu12<alu26));
  var alu28 = select(alu13,alu27,(alu13<alu27));
  var alu29 = select(alu14,alu28,(alu14<alu28));
  var alu30 = select(alu15,alu29,(alu15<alu29));
  var alu31 = select(alu16,alu30,(alu16<alu30));
  var alu32 = select(alu17,alu31,(alu17<alu31));
  var alu33 = select(alu18,alu32,(alu18<alu32));
  var alu34 = select(alu19,alu33,(alu19<alu33));
  var alu35 = select(alu20,alu34,(alu20<alu34));
  var alu36 = select(alu21,alu35,(alu21<alu35));
  var alu37 = select(alu22,alu36,(alu22<alu36));
  var alu38 = select(alu23,alu37,(alu23<alu37));
  data0[((lidx1+alu0+(lidx0*3549)))] = select(alu24,alu38,(alu24<alu38));
}`;

const E_5_1183_16_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data2:array<f32>;
@group(0) @binding(3)var<storage,read_write>data4:array<f32>;
@group(0) @binding(4)var<storage,read_write>data6:array<f32>;
@compute @workgroup_size(16) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var gidx1 = i32(gindex.y); /* 5 */
  var lidx0 = i32(lindex.x); /* 16 */
  var alu0 = (gidx0*3);
  var alu1 = ((gidx1*2704)+(lidx0*169)+alu0);
  var alu2 = ((gidx1*10816)+(lidx0*676)+alu0);
  var alu3 = ((gidx1*43264)+(lidx0*2704)+alu0);
  var alu4 = (gidx0<901);
  var val0 = select(0.0f, data2[((alu3+1))], alu4);
  var val1 = select(0.0f, data2[((alu3+2))], alu4);
  var alu5 = (gidx0<902);
  var val2 = select(0.0f, data2[(alu3)], alu5);
  var alu6 = (gidx0<1126);
  var alu7 = (gidx0<1127);
  var alu8 = (alu4!=true);
  var val3 = select(0.0f, data6[((alu1+-3378))], (alu6!=true));
  var alu9 = (alu7!=true);
  var val4 = select(0.0f, data6[((alu1+-3380))], alu9);
  var val5 = select(0.0f, data6[((alu1+-3379))], alu9);
  var val6 = select(0.0f, data4[((alu2+-2702))], (alu6&alu8));
  var val7 = select(0.0f, data4[((alu2+-2703))], (alu7&alu8));
  var val8 = select(0.0f, data4[((alu2+-2704))], (alu7&(alu5!=true)));
  var alu10 = (alu0+(gidx1*56784)+(lidx0*3549));
  data0[(alu10)] = (1/(exp2(((val4+val2+val8)*-1.4426950408889634f))+1.0f));
  data0[((alu10+1))] = (1/(exp2(((val5+val0+val7)*-1.4426950408889634f))+1.0f));
  data0[((alu10+2))] = (1/(exp2(((val3+val1+val6)*-1.4426950408889634f))+1.0f));
}`;

const r_1183_4_3_16n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data3:array<f32>;
@group(0) @binding(4)var<storage,read_write>data5:array<f32>;
@group(0) @binding(5)var<storage,read_write>data7:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var lidx0 = i32(lindex.x); /* 4 */
  var alu0 = (gidx0*3);
  var alu1 = (alu0+(lidx0*2704));
  var alu2 = (alu0+(lidx0*3549));
  var val0 = data7[(alu2)];
  var alu3 = (alu2+1);
  var val1 = data7[(alu3)];
  var alu4 = (alu2+2);
  var val2 = data7[(alu4)];
  var alu5 = (alu0+(lidx0*10816));
  var alu6 = (alu0+(lidx0*43264));
  var alu7 = (gidx0<901);
  var val3 = select(0.0f, data1[((alu6+1))], alu7);
  var val4 = select(0.0f, data1[((alu6+2))], alu7);
  var val5 = select(0.0f, data1[((alu6+2705))], alu7);
  var val6 = select(0.0f, data1[((alu6+2706))], alu7);
  var val7 = select(0.0f, data1[((alu6+5409))], alu7);
  var val8 = select(0.0f, data1[((alu6+5410))], alu7);
  var val9 = select(0.0f, data1[((alu6+8113))], alu7);
  var val10 = select(0.0f, data1[((alu6+8114))], alu7);
  var val11 = select(0.0f, data1[((alu6+10817))], alu7);
  var val12 = select(0.0f, data1[((alu6+10818))], alu7);
  var val13 = select(0.0f, data1[((alu6+13521))], alu7);
  var val14 = select(0.0f, data1[((alu6+13522))], alu7);
  var val15 = select(0.0f, data1[((alu6+16225))], alu7);
  var val16 = select(0.0f, data1[((alu6+16226))], alu7);
  var val17 = select(0.0f, data1[((alu6+18929))], alu7);
  var val18 = select(0.0f, data1[((alu6+18930))], alu7);
  var val19 = select(0.0f, data1[((alu6+21633))], alu7);
  var val20 = select(0.0f, data1[((alu6+21634))], alu7);
  var val21 = select(0.0f, data1[((alu6+24337))], alu7);
  var val22 = select(0.0f, data1[((alu6+24338))], alu7);
  var val23 = select(0.0f, data1[((alu6+27041))], alu7);
  var val24 = select(0.0f, data1[((alu6+27042))], alu7);
  var val25 = select(0.0f, data1[((alu6+29745))], alu7);
  var val26 = select(0.0f, data1[((alu6+29746))], alu7);
  var val27 = select(0.0f, data1[((alu6+32449))], alu7);
  var val28 = select(0.0f, data1[((alu6+32450))], alu7);
  var val29 = select(0.0f, data1[((alu6+35153))], alu7);
  var val30 = select(0.0f, data1[((alu6+35154))], alu7);
  var val31 = select(0.0f, data1[((alu6+37857))], alu7);
  var val32 = select(0.0f, data1[((alu6+37858))], alu7);
  var val33 = select(0.0f, data1[((alu6+40561))], alu7);
  var val34 = select(0.0f, data1[((alu6+40562))], alu7);
  var alu8 = (gidx0<902);
  var val35 = select(0.0f, data1[((alu6+2704))], alu8);
  var val36 = select(0.0f, data1[((alu6+5408))], alu8);
  var val37 = select(0.0f, data1[((alu6+8112))], alu8);
  var val38 = select(0.0f, data1[((alu6+10816))], alu8);
  var val39 = select(0.0f, data1[((alu6+13520))], alu8);
  var val40 = select(0.0f, data1[((alu6+16224))], alu8);
  var val41 = select(0.0f, data1[((alu6+18928))], alu8);
  var val42 = select(0.0f, data1[((alu6+21632))], alu8);
  var val43 = select(0.0f, data1[((alu6+24336))], alu8);
  var val44 = select(0.0f, data1[((alu6+27040))], alu8);
  var val45 = select(0.0f, data1[((alu6+29744))], alu8);
  var val46 = select(0.0f, data1[((alu6+32448))], alu8);
  var val47 = select(0.0f, data1[((alu6+35152))], alu8);
  var val48 = select(0.0f, data1[((alu6+37856))], alu8);
  var val49 = select(0.0f, data1[((alu6+40560))], alu8);
  var val50 = select(0.0f, data1[(alu6)], alu8);
  var alu9 = (gidx0<1126);
  var alu10 = (gidx0<1127);
  var alu11 = (alu7!=true);
  var alu12 = (alu9!=true);
  var val51 = select(0.0f, data5[((alu1+-3378))], alu12);
  var val52 = select(0.0f, data5[((alu1+-3209))], alu12);
  var val53 = select(0.0f, data5[((alu1+-3040))], alu12);
  var val54 = select(0.0f, data5[((alu1+-2871))], alu12);
  var val55 = select(0.0f, data5[((alu1+-2702))], alu12);
  var val56 = select(0.0f, data5[((alu1+-2533))], alu12);
  var val57 = select(0.0f, data5[((alu1+-2364))], alu12);
  var val58 = select(0.0f, data5[((alu1+-2195))], alu12);
  var val59 = select(0.0f, data5[((alu1+-2026))], alu12);
  var val60 = select(0.0f, data5[((alu1+-1857))], alu12);
  var val61 = select(0.0f, data5[((alu1+-1688))], alu12);
  var val62 = select(0.0f, data5[((alu1+-1519))], alu12);
  var val63 = select(0.0f, data5[((alu1+-1350))], alu12);
  var val64 = select(0.0f, data5[((alu1+-1181))], alu12);
  var val65 = select(0.0f, data5[((alu1+-1012))], alu12);
  var val66 = select(0.0f, data5[((alu1+-843))], alu12);
  var alu13 = (alu10!=true);
  var val67 = select(0.0f, data5[((alu1+-3380))], alu13);
  var val68 = select(0.0f, data5[((alu1+-3379))], alu13);
  var val69 = select(0.0f, data5[((alu1+-3211))], alu13);
  var val70 = select(0.0f, data5[((alu1+-3210))], alu13);
  var val71 = select(0.0f, data5[((alu1+-3042))], alu13);
  var val72 = select(0.0f, data5[((alu1+-3041))], alu13);
  var val73 = select(0.0f, data5[((alu1+-2873))], alu13);
  var val74 = select(0.0f, data5[((alu1+-2872))], alu13);
  var val75 = select(0.0f, data5[((alu1+-2704))], alu13);
  var val76 = select(0.0f, data5[((alu1+-2703))], alu13);
  var val77 = select(0.0f, data5[((alu1+-2535))], alu13);
  var val78 = select(0.0f, data5[((alu1+-2534))], alu13);
  var val79 = select(0.0f, data5[((alu1+-2366))], alu13);
  var val80 = select(0.0f, data5[((alu1+-2365))], alu13);
  var val81 = select(0.0f, data5[((alu1+-2197))], alu13);
  var val82 = select(0.0f, data5[((alu1+-2196))], alu13);
  var val83 = select(0.0f, data5[((alu1+-2028))], alu13);
  var val84 = select(0.0f, data5[((alu1+-2027))], alu13);
  var val85 = select(0.0f, data5[((alu1+-1859))], alu13);
  var val86 = select(0.0f, data5[((alu1+-1858))], alu13);
  var val87 = select(0.0f, data5[((alu1+-1690))], alu13);
  var val88 = select(0.0f, data5[((alu1+-1689))], alu13);
  var val89 = select(0.0f, data5[((alu1+-1521))], alu13);
  var val90 = select(0.0f, data5[((alu1+-1520))], alu13);
  var val91 = select(0.0f, data5[((alu1+-1352))], alu13);
  var val92 = select(0.0f, data5[((alu1+-1351))], alu13);
  var val93 = select(0.0f, data5[((alu1+-1183))], alu13);
  var val94 = select(0.0f, data5[((alu1+-1182))], alu13);
  var val95 = select(0.0f, data5[((alu1+-1014))], alu13);
  var val96 = select(0.0f, data5[((alu1+-1013))], alu13);
  var val97 = select(0.0f, data5[((alu1+-845))], alu13);
  var val98 = select(0.0f, data5[((alu1+-844))], alu13);
  var alu14 = (alu9&alu11);
  var val99 = select(0.0f, data3[((alu5+-2702))], alu14);
  var val100 = select(0.0f, data3[((alu5+-2026))], alu14);
  var val101 = select(0.0f, data3[((alu5+-1350))], alu14);
  var val102 = select(0.0f, data3[((alu5+-674))], alu14);
  var val103 = select(0.0f, data3[((alu5+2))], alu14);
  var val104 = select(0.0f, data3[((alu5+678))], alu14);
  var val105 = select(0.0f, data3[((alu5+1354))], alu14);
  var val106 = select(0.0f, data3[((alu5+2030))], alu14);
  var val107 = select(0.0f, data3[((alu5+2706))], alu14);
  var val108 = select(0.0f, data3[((alu5+3382))], alu14);
  var val109 = select(0.0f, data3[((alu5+4058))], alu14);
  var val110 = select(0.0f, data3[((alu5+4734))], alu14);
  var val111 = select(0.0f, data3[((alu5+5410))], alu14);
  var val112 = select(0.0f, data3[((alu5+6086))], alu14);
  var val113 = select(0.0f, data3[((alu5+6762))], alu14);
  var val114 = select(0.0f, data3[((alu5+7438))], alu14);
  var alu15 = (alu10&alu11);
  var val115 = select(0.0f, data3[((alu5+-2703))], alu15);
  var val116 = select(0.0f, data3[((alu5+-2027))], alu15);
  var val117 = select(0.0f, data3[((alu5+-1351))], alu15);
  var val118 = select(0.0f, data3[((alu5+-675))], alu15);
  var val119 = select(0.0f, data3[((alu5+1))], alu15);
  var val120 = select(0.0f, data3[((alu5+677))], alu15);
  var val121 = select(0.0f, data3[((alu5+1353))], alu15);
  var val122 = select(0.0f, data3[((alu5+2029))], alu15);
  var val123 = select(0.0f, data3[((alu5+2705))], alu15);
  var val124 = select(0.0f, data3[((alu5+3381))], alu15);
  var val125 = select(0.0f, data3[((alu5+4057))], alu15);
  var val126 = select(0.0f, data3[((alu5+4733))], alu15);
  var val127 = select(0.0f, data3[((alu5+5409))], alu15);
  var val128 = select(0.0f, data3[((alu5+6085))], alu15);
  var val129 = select(0.0f, data3[((alu5+6761))], alu15);
  var val130 = select(0.0f, data3[((alu5+7437))], alu15);
  var alu16 = (alu10&(alu8!=true));
  var val131 = select(0.0f, data3[((alu5+-2704))], alu16);
  var val132 = select(0.0f, data3[((alu5+-2028))], alu16);
  var val133 = select(0.0f, data3[((alu5+-1352))], alu16);
  var val134 = select(0.0f, data3[((alu5+-676))], alu16);
  var val135 = select(0.0f, data3[((alu5+676))], alu16);
  var val136 = select(0.0f, data3[((alu5+1352))], alu16);
  var val137 = select(0.0f, data3[((alu5+2028))], alu16);
  var val138 = select(0.0f, data3[((alu5+2704))], alu16);
  var val139 = select(0.0f, data3[((alu5+3380))], alu16);
  var val140 = select(0.0f, data3[((alu5+4056))], alu16);
  var val141 = select(0.0f, data3[((alu5+4732))], alu16);
  var val142 = select(0.0f, data3[((alu5+5408))], alu16);
  var val143 = select(0.0f, data3[((alu5+6084))], alu16);
  var val144 = select(0.0f, data3[((alu5+6760))], alu16);
  var val145 = select(0.0f, data3[((alu5+7436))], alu16);
  var val146 = select(0.0f, data3[(alu5)], alu16);
  data0[(alu2)] = (exp2((((val97+val49+val145)-val0)*1.4426950408889634f))+exp2((((val95+val48+val144)-val0)*1.4426950408889634f))+exp2((((val93+val47+val143)-val0)*1.4426950408889634f))+exp2((((val91+val46+val142)-val0)*1.4426950408889634f))+exp2((((val89+val45+val141)-val0)*1.4426950408889634f))+exp2((((val87+val44+val140)-val0)*1.4426950408889634f))+exp2((((val85+val43+val139)-val0)*1.4426950408889634f))+exp2((((val83+val42+val138)-val0)*1.4426950408889634f))+exp2((((val81+val41+val137)-val0)*1.4426950408889634f))+exp2((((val79+val40+val136)-val0)*1.4426950408889634f))+exp2((((val77+val39+val135)-val0)*1.4426950408889634f))+exp2((((val75+val38+val146)-val0)*1.4426950408889634f))+exp2((((val73+val37+val134)-val0)*1.4426950408889634f))+exp2((((val71+val36+val133)-val0)*1.4426950408889634f))+exp2((((val67+val50+val131)-val0)*1.4426950408889634f))+exp2((((val69+val35+val132)-val0)*1.4426950408889634f)));
  data0[(alu3)] = (exp2((((val98+val33+val130)-val1)*1.4426950408889634f))+exp2((((val96+val31+val129)-val1)*1.4426950408889634f))+exp2((((val94+val29+val128)-val1)*1.4426950408889634f))+exp2((((val92+val27+val127)-val1)*1.4426950408889634f))+exp2((((val90+val25+val126)-val1)*1.4426950408889634f))+exp2((((val88+val23+val125)-val1)*1.4426950408889634f))+exp2((((val86+val21+val124)-val1)*1.4426950408889634f))+exp2((((val84+val19+val123)-val1)*1.4426950408889634f))+exp2((((val82+val17+val122)-val1)*1.4426950408889634f))+exp2((((val80+val15+val121)-val1)*1.4426950408889634f))+exp2((((val78+val13+val120)-val1)*1.4426950408889634f))+exp2((((val76+val11+val119)-val1)*1.4426950408889634f))+exp2((((val74+val9+val118)-val1)*1.4426950408889634f))+exp2((((val72+val7+val117)-val1)*1.4426950408889634f))+exp2((((val68+val3+val115)-val1)*1.4426950408889634f))+exp2((((val70+val5+val116)-val1)*1.4426950408889634f)));
  data0[(alu4)] = (exp2((((val66+val34+val114)-val2)*1.4426950408889634f))+exp2((((val65+val32+val113)-val2)*1.4426950408889634f))+exp2((((val64+val30+val112)-val2)*1.4426950408889634f))+exp2((((val63+val28+val111)-val2)*1.4426950408889634f))+exp2((((val62+val26+val110)-val2)*1.4426950408889634f))+exp2((((val61+val24+val109)-val2)*1.4426950408889634f))+exp2((((val60+val22+val108)-val2)*1.4426950408889634f))+exp2((((val59+val20+val107)-val2)*1.4426950408889634f))+exp2((((val58+val18+val106)-val2)*1.4426950408889634f))+exp2((((val57+val16+val105)-val2)*1.4426950408889634f))+exp2((((val56+val14+val104)-val2)*1.4426950408889634f))+exp2((((val55+val12+val103)-val2)*1.4426950408889634f))+exp2((((val54+val10+val102)-val2)*1.4426950408889634f))+exp2((((val53+val8+val101)-val2)*1.4426950408889634f))+exp2((((val51+val4+val99)-val2)*1.4426950408889634f))+exp2((((val52+val6+val100)-val2)*1.4426950408889634f)));
}`;

const r_1183_4_3_16n2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data3:array<f32>;
@group(0) @binding(4)var<storage,read_write>data5:array<f32>;
@group(0) @binding(5)var<storage,read_write>data7:array<f32>;
@group(0) @binding(6)var<storage,read_write>data8:array<f32>;
@group(0) @binding(7)var<storage,read_write>data9:array<f32>;
@compute @workgroup_size(4) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var lidx0 = i32(lindex.x); /* 4 */
  var val0 = data9[(0)];
  var val1 = data9[(1)];
  var val2 = data9[(2)];
  var val3 = data9[(3)];
  var val4 = data9[(4)];
  var val5 = data9[(5)];
  var val6 = data9[(6)];
  var val7 = data9[(7)];
  var val8 = data9[(8)];
  var val9 = data9[(9)];
  var val10 = data9[(10)];
  var val11 = data9[(11)];
  var val12 = data9[(12)];
  var val13 = data9[(13)];
  var val14 = data9[(14)];
  var val15 = data9[(15)];
  var alu0 = (gidx0*3);
  var alu1 = (alu0+(lidx0*2704));
  var alu2 = (alu0+(lidx0*3549));
  var val16 = data7[(alu2)];
  var val17 = data8[(alu2)];
  var alu3 = (alu2+1);
  var val18 = data7[(alu3)];
  var val19 = data8[(alu3)];
  var alu4 = (alu2+2);
  var val20 = data7[(alu4)];
  var val21 = data8[(alu4)];
  var alu5 = (alu0+(lidx0*10816));
  var alu6 = (alu0+(lidx0*43264));
  var alu7 = (gidx0<901);
  var val22 = select(0.0f, data1[((alu6+1))], alu7);
  var val23 = select(0.0f, data1[((alu6+2))], alu7);
  var val24 = select(0.0f, data1[((alu6+2705))], alu7);
  var val25 = select(0.0f, data1[((alu6+2706))], alu7);
  var val26 = select(0.0f, data1[((alu6+5409))], alu7);
  var val27 = select(0.0f, data1[((alu6+5410))], alu7);
  var val28 = select(0.0f, data1[((alu6+8113))], alu7);
  var val29 = select(0.0f, data1[((alu6+8114))], alu7);
  var val30 = select(0.0f, data1[((alu6+10817))], alu7);
  var val31 = select(0.0f, data1[((alu6+10818))], alu7);
  var val32 = select(0.0f, data1[((alu6+13521))], alu7);
  var val33 = select(0.0f, data1[((alu6+13522))], alu7);
  var val34 = select(0.0f, data1[((alu6+16225))], alu7);
  var val35 = select(0.0f, data1[((alu6+16226))], alu7);
  var val36 = select(0.0f, data1[((alu6+18929))], alu7);
  var val37 = select(0.0f, data1[((alu6+18930))], alu7);
  var val38 = select(0.0f, data1[((alu6+21633))], alu7);
  var val39 = select(0.0f, data1[((alu6+21634))], alu7);
  var val40 = select(0.0f, data1[((alu6+24337))], alu7);
  var val41 = select(0.0f, data1[((alu6+24338))], alu7);
  var val42 = select(0.0f, data1[((alu6+27041))], alu7);
  var val43 = select(0.0f, data1[((alu6+27042))], alu7);
  var val44 = select(0.0f, data1[((alu6+29745))], alu7);
  var val45 = select(0.0f, data1[((alu6+29746))], alu7);
  var val46 = select(0.0f, data1[((alu6+32449))], alu7);
  var val47 = select(0.0f, data1[((alu6+32450))], alu7);
  var val48 = select(0.0f, data1[((alu6+35153))], alu7);
  var val49 = select(0.0f, data1[((alu6+35154))], alu7);
  var val50 = select(0.0f, data1[((alu6+37857))], alu7);
  var val51 = select(0.0f, data1[((alu6+37858))], alu7);
  var val52 = select(0.0f, data1[((alu6+40561))], alu7);
  var val53 = select(0.0f, data1[((alu6+40562))], alu7);
  var alu8 = (gidx0<902);
  var val54 = select(0.0f, data1[((alu6+2704))], alu8);
  var val55 = select(0.0f, data1[((alu6+5408))], alu8);
  var val56 = select(0.0f, data1[((alu6+8112))], alu8);
  var val57 = select(0.0f, data1[((alu6+10816))], alu8);
  var val58 = select(0.0f, data1[((alu6+13520))], alu8);
  var val59 = select(0.0f, data1[((alu6+16224))], alu8);
  var val60 = select(0.0f, data1[((alu6+18928))], alu8);
  var val61 = select(0.0f, data1[((alu6+21632))], alu8);
  var val62 = select(0.0f, data1[((alu6+24336))], alu8);
  var val63 = select(0.0f, data1[((alu6+27040))], alu8);
  var val64 = select(0.0f, data1[((alu6+29744))], alu8);
  var val65 = select(0.0f, data1[((alu6+32448))], alu8);
  var val66 = select(0.0f, data1[((alu6+35152))], alu8);
  var val67 = select(0.0f, data1[((alu6+37856))], alu8);
  var val68 = select(0.0f, data1[((alu6+40560))], alu8);
  var val69 = select(0.0f, data1[(alu6)], alu8);
  var alu9 = (gidx0<1126);
  var alu10 = (gidx0<1127);
  var alu11 = (alu7!=true);
  var alu12 = (alu9!=true);
  var val70 = select(0.0f, data5[((alu1+-3378))], alu12);
  var val71 = select(0.0f, data5[((alu1+-3209))], alu12);
  var val72 = select(0.0f, data5[((alu1+-3040))], alu12);
  var val73 = select(0.0f, data5[((alu1+-2871))], alu12);
  var val74 = select(0.0f, data5[((alu1+-2702))], alu12);
  var val75 = select(0.0f, data5[((alu1+-2533))], alu12);
  var val76 = select(0.0f, data5[((alu1+-2364))], alu12);
  var val77 = select(0.0f, data5[((alu1+-2195))], alu12);
  var val78 = select(0.0f, data5[((alu1+-2026))], alu12);
  var val79 = select(0.0f, data5[((alu1+-1857))], alu12);
  var val80 = select(0.0f, data5[((alu1+-1688))], alu12);
  var val81 = select(0.0f, data5[((alu1+-1519))], alu12);
  var val82 = select(0.0f, data5[((alu1+-1350))], alu12);
  var val83 = select(0.0f, data5[((alu1+-1181))], alu12);
  var val84 = select(0.0f, data5[((alu1+-1012))], alu12);
  var val85 = select(0.0f, data5[((alu1+-843))], alu12);
  var alu13 = (alu10!=true);
  var val86 = select(0.0f, data5[((alu1+-3380))], alu13);
  var val87 = select(0.0f, data5[((alu1+-3379))], alu13);
  var val88 = select(0.0f, data5[((alu1+-3211))], alu13);
  var val89 = select(0.0f, data5[((alu1+-3210))], alu13);
  var val90 = select(0.0f, data5[((alu1+-3042))], alu13);
  var val91 = select(0.0f, data5[((alu1+-3041))], alu13);
  var val92 = select(0.0f, data5[((alu1+-2873))], alu13);
  var val93 = select(0.0f, data5[((alu1+-2872))], alu13);
  var val94 = select(0.0f, data5[((alu1+-2704))], alu13);
  var val95 = select(0.0f, data5[((alu1+-2703))], alu13);
  var val96 = select(0.0f, data5[((alu1+-2535))], alu13);
  var val97 = select(0.0f, data5[((alu1+-2534))], alu13);
  var val98 = select(0.0f, data5[((alu1+-2366))], alu13);
  var val99 = select(0.0f, data5[((alu1+-2365))], alu13);
  var val100 = select(0.0f, data5[((alu1+-2197))], alu13);
  var val101 = select(0.0f, data5[((alu1+-2196))], alu13);
  var val102 = select(0.0f, data5[((alu1+-2028))], alu13);
  var val103 = select(0.0f, data5[((alu1+-2027))], alu13);
  var val104 = select(0.0f, data5[((alu1+-1859))], alu13);
  var val105 = select(0.0f, data5[((alu1+-1858))], alu13);
  var val106 = select(0.0f, data5[((alu1+-1690))], alu13);
  var val107 = select(0.0f, data5[((alu1+-1689))], alu13);
  var val108 = select(0.0f, data5[((alu1+-1521))], alu13);
  var val109 = select(0.0f, data5[((alu1+-1520))], alu13);
  var val110 = select(0.0f, data5[((alu1+-1352))], alu13);
  var val111 = select(0.0f, data5[((alu1+-1351))], alu13);
  var val112 = select(0.0f, data5[((alu1+-1183))], alu13);
  var val113 = select(0.0f, data5[((alu1+-1182))], alu13);
  var val114 = select(0.0f, data5[((alu1+-1014))], alu13);
  var val115 = select(0.0f, data5[((alu1+-1013))], alu13);
  var val116 = select(0.0f, data5[((alu1+-845))], alu13);
  var val117 = select(0.0f, data5[((alu1+-844))], alu13);
  var alu14 = (alu9&alu11);
  var val118 = select(0.0f, data3[((alu5+-2702))], alu14);
  var val119 = select(0.0f, data3[((alu5+-2026))], alu14);
  var val120 = select(0.0f, data3[((alu5+-1350))], alu14);
  var val121 = select(0.0f, data3[((alu5+-674))], alu14);
  var val122 = select(0.0f, data3[((alu5+2))], alu14);
  var val123 = select(0.0f, data3[((alu5+678))], alu14);
  var val124 = select(0.0f, data3[((alu5+1354))], alu14);
  var val125 = select(0.0f, data3[((alu5+2030))], alu14);
  var val126 = select(0.0f, data3[((alu5+2706))], alu14);
  var val127 = select(0.0f, data3[((alu5+3382))], alu14);
  var val128 = select(0.0f, data3[((alu5+4058))], alu14);
  var val129 = select(0.0f, data3[((alu5+4734))], alu14);
  var val130 = select(0.0f, data3[((alu5+5410))], alu14);
  var val131 = select(0.0f, data3[((alu5+6086))], alu14);
  var val132 = select(0.0f, data3[((alu5+6762))], alu14);
  var val133 = select(0.0f, data3[((alu5+7438))], alu14);
  var alu15 = (alu10&alu11);
  var val134 = select(0.0f, data3[((alu5+-2703))], alu15);
  var val135 = select(0.0f, data3[((alu5+-2027))], alu15);
  var val136 = select(0.0f, data3[((alu5+-1351))], alu15);
  var val137 = select(0.0f, data3[((alu5+-675))], alu15);
  var val138 = select(0.0f, data3[((alu5+1))], alu15);
  var val139 = select(0.0f, data3[((alu5+677))], alu15);
  var val140 = select(0.0f, data3[((alu5+1353))], alu15);
  var val141 = select(0.0f, data3[((alu5+2029))], alu15);
  var val142 = select(0.0f, data3[((alu5+2705))], alu15);
  var val143 = select(0.0f, data3[((alu5+3381))], alu15);
  var val144 = select(0.0f, data3[((alu5+4057))], alu15);
  var val145 = select(0.0f, data3[((alu5+4733))], alu15);
  var val146 = select(0.0f, data3[((alu5+5409))], alu15);
  var val147 = select(0.0f, data3[((alu5+6085))], alu15);
  var val148 = select(0.0f, data3[((alu5+6761))], alu15);
  var val149 = select(0.0f, data3[((alu5+7437))], alu15);
  var alu16 = (alu10&(alu8!=true));
  var val150 = select(0.0f, data3[((alu5+-2704))], alu16);
  var val151 = select(0.0f, data3[((alu5+-2028))], alu16);
  var val152 = select(0.0f, data3[((alu5+-1352))], alu16);
  var val153 = select(0.0f, data3[((alu5+-676))], alu16);
  var val154 = select(0.0f, data3[((alu5+676))], alu16);
  var val155 = select(0.0f, data3[((alu5+1352))], alu16);
  var val156 = select(0.0f, data3[((alu5+2028))], alu16);
  var val157 = select(0.0f, data3[((alu5+2704))], alu16);
  var val158 = select(0.0f, data3[((alu5+3380))], alu16);
  var val159 = select(0.0f, data3[((alu5+4056))], alu16);
  var val160 = select(0.0f, data3[((alu5+4732))], alu16);
  var val161 = select(0.0f, data3[((alu5+5408))], alu16);
  var val162 = select(0.0f, data3[((alu5+6084))], alu16);
  var val163 = select(0.0f, data3[((alu5+6760))], alu16);
  var val164 = select(0.0f, data3[((alu5+7436))], alu16);
  var val165 = select(0.0f, data3[(alu5)], alu16);
  var alu17 = (1/val19);
  var alu18 = (1/val21);
  var alu19 = (1/val17);
  data0[(alu2)] = ((val0*exp2((((val86+val69+val150)-val16)*1.4426950408889634f))*alu19)+(val1*exp2((((val88+val54+val151)-val16)*1.4426950408889634f))*alu19)+(val2*exp2((((val90+val55+val152)-val16)*1.4426950408889634f))*alu19)+(val3*exp2((((val92+val56+val153)-val16)*1.4426950408889634f))*alu19)+(val4*exp2((((val94+val57+val165)-val16)*1.4426950408889634f))*alu19)+(val5*exp2((((val96+val58+val154)-val16)*1.4426950408889634f))*alu19)+(val6*exp2((((val98+val59+val155)-val16)*1.4426950408889634f))*alu19)+(val7*exp2((((val100+val60+val156)-val16)*1.4426950408889634f))*alu19)+(val8*exp2((((val102+val61+val157)-val16)*1.4426950408889634f))*alu19)+(val9*exp2((((val104+val62+val158)-val16)*1.4426950408889634f))*alu19)+(val10*exp2((((val106+val63+val159)-val16)*1.4426950408889634f))*alu19)+(val11*exp2((((val108+val64+val160)-val16)*1.4426950408889634f))*alu19)+(val12*exp2((((val110+val65+val161)-val16)*1.4426950408889634f))*alu19)+(val13*exp2((((val112+val66+val162)-val16)*1.4426950408889634f))*alu19)+(val14*exp2((((val114+val67+val163)-val16)*1.4426950408889634f))*alu19)+(val15*exp2((((val116+val68+val164)-val16)*1.4426950408889634f))*alu19));
  data0[(alu3)] = ((val0*exp2((((val87+val22+val134)-val18)*1.4426950408889634f))*alu17)+(val1*exp2((((val89+val24+val135)-val18)*1.4426950408889634f))*alu17)+(val2*exp2((((val91+val26+val136)-val18)*1.4426950408889634f))*alu17)+(val3*exp2((((val93+val28+val137)-val18)*1.4426950408889634f))*alu17)+(val4*exp2((((val95+val30+val138)-val18)*1.4426950408889634f))*alu17)+(val5*exp2((((val97+val32+val139)-val18)*1.4426950408889634f))*alu17)+(val6*exp2((((val99+val34+val140)-val18)*1.4426950408889634f))*alu17)+(val7*exp2((((val101+val36+val141)-val18)*1.4426950408889634f))*alu17)+(val8*exp2((((val103+val38+val142)-val18)*1.4426950408889634f))*alu17)+(val9*exp2((((val105+val40+val143)-val18)*1.4426950408889634f))*alu17)+(val10*exp2((((val107+val42+val144)-val18)*1.4426950408889634f))*alu17)+(val11*exp2((((val109+val44+val145)-val18)*1.4426950408889634f))*alu17)+(val12*exp2((((val111+val46+val146)-val18)*1.4426950408889634f))*alu17)+(val13*exp2((((val113+val48+val147)-val18)*1.4426950408889634f))*alu17)+(val14*exp2((((val115+val50+val148)-val18)*1.4426950408889634f))*alu17)+(val15*exp2((((val117+val52+val149)-val18)*1.4426950408889634f))*alu17));
  data0[(alu4)] = ((val0*exp2((((val70+val23+val118)-val20)*1.4426950408889634f))*alu18)+(val1*exp2((((val71+val25+val119)-val20)*1.4426950408889634f))*alu18)+(val2*exp2((((val72+val27+val120)-val20)*1.4426950408889634f))*alu18)+(val3*exp2((((val73+val29+val121)-val20)*1.4426950408889634f))*alu18)+(val4*exp2((((val74+val31+val122)-val20)*1.4426950408889634f))*alu18)+(val5*exp2((((val75+val33+val123)-val20)*1.4426950408889634f))*alu18)+(val6*exp2((((val76+val35+val124)-val20)*1.4426950408889634f))*alu18)+(val7*exp2((((val77+val37+val125)-val20)*1.4426950408889634f))*alu18)+(val8*exp2((((val78+val39+val126)-val20)*1.4426950408889634f))*alu18)+(val9*exp2((((val79+val41+val127)-val20)*1.4426950408889634f))*alu18)+(val10*exp2((((val80+val43+val128)-val20)*1.4426950408889634f))*alu18)+(val11*exp2((((val81+val45+val129)-val20)*1.4426950408889634f))*alu18)+(val12*exp2((((val82+val47+val130)-val20)*1.4426950408889634f))*alu18)+(val13*exp2((((val83+val49+val131)-val20)*1.4426950408889634f))*alu18)+(val14*exp2((((val84+val51+val132)-val20)*1.4426950408889634f))*alu18)+(val15*exp2((((val85+val53+val133)-val20)*1.4426950408889634f))*alu18));
}`;

const E_1183_3_2 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@compute @workgroup_size(3) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var lidx0 = i32(lindex.x); /* 3 */
  var alu0 = (lidx0+(gidx0*3));
  var val0 = data4[(alu0)];
  var alu1 = (alu0+3549);
  var val1 = data4[(alu1)];
  var val2 = data4[((alu0+7098))];
  var val3 = data4[((alu0+10647))];
  var alu2 = (alu0<2704);
  var val4 = select(0.0f, data1[((alu0/52))], alu2);
  var val5 = select(0.0f, data1[((alu0%52))], alu2);
  var alu3 = (alu0<3380);
  var alu4 = (alu3!=true);
  var val6 = select(0.0f, data3[(((alu0/13)+-260))], alu4);
  var val7 = select(0.0f, data3[((alu0%13))], alu4);
  var alu5 = (alu3&(alu2!=true));
  var val8 = select(0.0f, data2[(((alu0/26)+-104))], alu5);
  var val9 = select(0.0f, data2[((alu0%26))], alu5);
  var alu6 = (val6+val4+val8);
  var alu7 = (val7+val5+val9);
  data0[(alu1)] = ((val3+alu6+(alu6-val1))*0.5f);
  data0[(alu0)] = ((val2+alu7+(alu7-val0))*0.5f);
}`;

const E_1183_3_2n1 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@compute @workgroup_size(3) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var lidx0 = i32(lindex.x); /* 3 */
  var alu0 = (lidx0+(gidx0*3));
  var val0 = data4[(alu0)];
  var alu1 = (alu0+3549);
  var val1 = data4[(alu1)];
  var val2 = data4[((alu0+7098))];
  var val3 = data4[((alu0+10647))];
  var alu2 = (alu0<2704);
  var val4 = select(0.0f, data1[((alu0/52))], alu2);
  var val5 = select(0.0f, data1[((alu0%52))], alu2);
  var alu3 = (alu0<3380);
  var alu4 = (alu3!=true);
  var val6 = select(0.0f, data3[(((alu0/13)+-260))], alu4);
  var val7 = select(0.0f, data3[((alu0%13))], alu4);
  var alu5 = (alu3&(alu2!=true));
  var val8 = select(0.0f, data2[(((alu0/26)+-104))], alu5);
  var val9 = select(0.0f, data2[((alu0%26))], alu5);
  data0[(alu1)] = (val1+((-val4-val8)-val6)+val3+val6+val4+val8);
  data0[(alu0)] = (val0+((-val5-val9)-val7)+val2+val7+val5+val9);
}`;

const E_7_1183_4_3_3 = `fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn is_nan(v:f32) -> bool { return min(v, 1.0) == 1.0 && max(v, -1.0) == -1.0; }
@group(0) @binding(0)
var<uniform> INFINITY : f32;
@group(0) @binding(1)var<storage,read_write>data0:array<f32>;
@group(0) @binding(2)var<storage,read_write>data1:array<f32>;
@group(0) @binding(3)var<storage,read_write>data2:array<f32>;
@group(0) @binding(4)var<storage,read_write>data3:array<f32>;
@group(0) @binding(5)var<storage,read_write>data4:array<f32>;
@compute @workgroup_size(4,3) fn main(@builtin(workgroup_id) gindex: vec3<u32>,@builtin(local_invocation_id) lindex: vec3<u32>) {
  var gidx0 = i32(gindex.x); /* 1183 */
  var gidx1 = i32(gindex.y); /* 7 */
  var lidx0 = i32(lindex.x); /* 4 */
  var lidx1 = i32(lindex.y); /* 3 */
  var alu0 = (gidx0*3);
  var alu1 = (lidx1+alu0);
  var alu2 = ((gidx1*12)+(lidx0*3));
  var alu3 = (lidx1+alu0+(gidx1*42588)+(lidx0*10647));
  var alu4 = (alu3+-7098);
  var alu5 = (alu2<2);
  var val0 = select(0.0f, data2[(alu3)], alu5);
  var val1 = select(0.0f, data3[(alu1)], alu5);
  var alu6 = (alu2<4);
  var val2 = select(0.0f, data3[(alu1)], alu6);
  var alu7 = (((gidx1+lidx0)<1)!=true);
  var val3 = select(0.0f, data4[((alu3+-10647))], alu7);
  var alu8 = (alu5!=true);
  var val4 = select(0.0f, data4[(alu4)], alu8);
  var val5 = select(0.0f, data4[((alu3+-14196))], (alu6!=true));
  var alu9 = ((lidx0+(gidx1<<2))<1);
  var val6 = select(0.0f, data3[(alu1)], alu9);
  var alu10 = ((gidx1<1)&(lidx0<1));
  var val7 = select(0.0f, data1[(alu1)], alu10);
  var val8 = select(0.0f, data1[((alu1+3549))], alu10);
  var val9 = select(0.0f, data2[((alu3+-3549))], (alu9&alu7));
  var val10 = select(0.0f, data2[(alu4)], (alu6&alu8));
  data0[((alu3+7098))] = (val4+(val0*val1));
  data0[((alu3+3549))] = (val3+(val6*(val8+val9)));
  data0[(alu3)] = (val5+(val2*(val7+val10)));
}`;

const setupNet = async (device, safetensor) => {
    const metadata = getTensorMetadata(safetensor);
    const infinityBuf = createInfinityUniformBuf(device);

    const layouts=[device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 8, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 7, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]}),device.createBindGroupLayout({entries: [{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' }}, {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },{binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } }]})]

    const buf_0 = createEmptyBuf(device, 208);;
    const buf_1 = createEmptyBuf(device, 104);;
    const buf_2 = createEmptyBuf(device, 52);;
    const buf_3 = createEmptyBuf(device, 1728);;
    const buf_4 = createWeightBuf(device, 864, getTensorBuffer(safetensor, metadata['net.b1.0.conv.weight']));
    const buf_5 = createEmptyBuf(device, 64);;
    const buf_6 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b1.0.bn.running_mean']));
    const buf_7 = createEmptyBuf(device, 64);;
    const buf_8 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b1.0.bn.weight']));
    const buf_9 = createEmptyBuf(device, 64);;
    const buf_10 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b1.0.bn.bias']));
    const buf_11 = createEmptyBuf(device, 18432);;
    const buf_12 = createWeightBuf(device, 9216, getTensorBuffer(safetensor, metadata['net.b1.1.conv.weight']));
    const buf_13 = createEmptyBuf(device, 128);;
    const buf_14 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b1.1.bn.running_mean']));
    const buf_15 = createEmptyBuf(device, 128);;
    const buf_16 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b1.1.bn.weight']));
    const buf_17 = createEmptyBuf(device, 128);;
    const buf_18 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b1.1.bn.bias']));
    const buf_19 = createEmptyBuf(device, 4096);;
    const buf_20 = createWeightBuf(device, 2048, getTensorBuffer(safetensor, metadata['net.b2.0.cv1.conv.weight']));
    const buf_21 = createEmptyBuf(device, 128);;
    const buf_22 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv1.bn.running_mean']));
    const buf_23 = createEmptyBuf(device, 128);;
    const buf_24 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv1.bn.weight']));
    const buf_25 = createEmptyBuf(device, 128);;
    const buf_26 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv1.bn.bias']));
    const buf_27 = createEmptyBuf(device, 9216);;
    const buf_28 = createWeightBuf(device, 4608, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv1.conv.weight']));
    const buf_29 = createEmptyBuf(device, 64);;
    const buf_30 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv1.bn.running_mean']));
    const buf_31 = createEmptyBuf(device, 64);;
    const buf_32 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv1.bn.weight']));
    const buf_33 = createEmptyBuf(device, 64);;
    const buf_34 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv1.bn.bias']));
    const buf_35 = createEmptyBuf(device, 9216);;
    const buf_36 = createWeightBuf(device, 4608, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv2.conv.weight']));
    const buf_37 = createEmptyBuf(device, 64);;
    const buf_38 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv2.bn.running_mean']));
    const buf_39 = createEmptyBuf(device, 64);;
    const buf_40 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv2.bn.weight']));
    const buf_41 = createEmptyBuf(device, 64);;
    const buf_42 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv2.bn.bias']));
    const buf_43 = createEmptyBuf(device, 6144);;
    const buf_44 = createWeightBuf(device, 3072, getTensorBuffer(safetensor, metadata['net.b2.0.cv2.conv.weight']));
    const buf_45 = createEmptyBuf(device, 128);;
    const buf_46 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv2.bn.running_mean']));
    const buf_47 = createEmptyBuf(device, 128);;
    const buf_48 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv2.bn.weight']));
    const buf_49 = createEmptyBuf(device, 128);;
    const buf_50 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv2.bn.bias']));
    const buf_51 = createEmptyBuf(device, 73728);;
    const buf_52 = createWeightBuf(device, 36864, getTensorBuffer(safetensor, metadata['net.b2.1.conv.weight']));
    const buf_53 = createEmptyBuf(device, 256);;
    const buf_54 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.1.bn.running_mean']));
    const buf_55 = createEmptyBuf(device, 256);;
    const buf_56 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.1.bn.weight']));
    const buf_57 = createEmptyBuf(device, 256);;
    const buf_58 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.1.bn.bias']));
    const buf_59 = createEmptyBuf(device, 16384);;
    const buf_60 = createWeightBuf(device, 8192, getTensorBuffer(safetensor, metadata['net.b2.2.cv1.conv.weight']));
    const buf_61 = createEmptyBuf(device, 256);;
    const buf_62 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv1.bn.running_mean']));
    const buf_63 = createEmptyBuf(device, 256);;
    const buf_64 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv1.bn.weight']));
    const buf_65 = createEmptyBuf(device, 256);;
    const buf_66 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv1.bn.bias']));
    const buf_67 = createEmptyBuf(device, 36864);;
    const buf_68 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv1.conv.weight']));
    const buf_69 = createEmptyBuf(device, 128);;
    const buf_70 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv1.bn.running_mean']));
    const buf_71 = createEmptyBuf(device, 128);;
    const buf_72 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv1.bn.weight']));
    const buf_73 = createEmptyBuf(device, 128);;
    const buf_74 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv1.bn.bias']));
    const buf_75 = createEmptyBuf(device, 36864);;
    const buf_76 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv2.conv.weight']));
    const buf_77 = createEmptyBuf(device, 128);;
    const buf_78 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv2.bn.running_mean']));
    const buf_79 = createEmptyBuf(device, 128);;
    const buf_80 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv2.bn.weight']));
    const buf_81 = createEmptyBuf(device, 128);;
    const buf_82 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv2.bn.bias']));
    const buf_83 = createEmptyBuf(device, 36864);;
    const buf_84 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv1.conv.weight']));
    const buf_85 = createEmptyBuf(device, 128);;
    const buf_86 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv1.bn.running_mean']));
    const buf_87 = createEmptyBuf(device, 128);;
    const buf_88 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv1.bn.weight']));
    const buf_89 = createEmptyBuf(device, 128);;
    const buf_90 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv1.bn.bias']));
    const buf_91 = createEmptyBuf(device, 36864);;
    const buf_92 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv2.conv.weight']));
    const buf_93 = createEmptyBuf(device, 128);;
    const buf_94 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv2.bn.running_mean']));
    const buf_95 = createEmptyBuf(device, 128);;
    const buf_96 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv2.bn.weight']));
    const buf_97 = createEmptyBuf(device, 128);;
    const buf_98 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv2.bn.bias']));
    const buf_99 = createEmptyBuf(device, 32768);;
    const buf_100 = createWeightBuf(device, 16384, getTensorBuffer(safetensor, metadata['net.b2.2.cv2.conv.weight']));
    const buf_101 = createEmptyBuf(device, 256);;
    const buf_102 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv2.bn.running_mean']));
    const buf_103 = createEmptyBuf(device, 256);;
    const buf_104 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv2.bn.weight']));
    const buf_105 = createEmptyBuf(device, 256);;
    const buf_106 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv2.bn.bias']));
    const buf_107 = createEmptyBuf(device, 294912);;
    const buf_108 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['net.b3.0.conv.weight']));
    const buf_109 = createEmptyBuf(device, 512);;
    const buf_110 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.0.bn.running_mean']));
    const buf_111 = createEmptyBuf(device, 512);;
    const buf_112 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.0.bn.weight']));
    const buf_113 = createEmptyBuf(device, 512);;
    const buf_114 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.0.bn.bias']));
    const buf_115 = createEmptyBuf(device, 65536);;
    const buf_116 = createWeightBuf(device, 32768, getTensorBuffer(safetensor, metadata['net.b3.1.cv1.conv.weight']));
    const buf_117 = createEmptyBuf(device, 512);;
    const buf_118 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv1.bn.running_mean']));
    const buf_119 = createEmptyBuf(device, 512);;
    const buf_120 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv1.bn.weight']));
    const buf_121 = createEmptyBuf(device, 512);;
    const buf_122 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv1.bn.bias']));
    const buf_123 = createEmptyBuf(device, 147456);;
    const buf_124 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv1.conv.weight']));
    const buf_125 = createEmptyBuf(device, 256);;
    const buf_126 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv1.bn.running_mean']));
    const buf_127 = createEmptyBuf(device, 256);;
    const buf_128 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv1.bn.weight']));
    const buf_129 = createEmptyBuf(device, 256);;
    const buf_130 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv1.bn.bias']));
    const buf_131 = createEmptyBuf(device, 147456);;
    const buf_132 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv2.conv.weight']));
    const buf_133 = createEmptyBuf(device, 256);;
    const buf_134 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv2.bn.running_mean']));
    const buf_135 = createEmptyBuf(device, 256);;
    const buf_136 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv2.bn.weight']));
    const buf_137 = createEmptyBuf(device, 256);;
    const buf_138 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv2.bn.bias']));
    const buf_139 = createEmptyBuf(device, 147456);;
    const buf_140 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv1.conv.weight']));
    const buf_141 = createEmptyBuf(device, 256);;
    const buf_142 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv1.bn.running_mean']));
    const buf_143 = createEmptyBuf(device, 256);;
    const buf_144 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv1.bn.weight']));
    const buf_145 = createEmptyBuf(device, 256);;
    const buf_146 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv1.bn.bias']));
    const buf_147 = createEmptyBuf(device, 147456);;
    const buf_148 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv2.conv.weight']));
    const buf_149 = createEmptyBuf(device, 256);;
    const buf_150 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv2.bn.running_mean']));
    const buf_151 = createEmptyBuf(device, 256);;
    const buf_152 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv2.bn.weight']));
    const buf_153 = createEmptyBuf(device, 256);;
    const buf_154 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv2.bn.bias']));
    const buf_155 = createEmptyBuf(device, 131072);;
    const buf_156 = createWeightBuf(device, 65536, getTensorBuffer(safetensor, metadata['net.b3.1.cv2.conv.weight']));
    const buf_157 = createEmptyBuf(device, 512);;
    const buf_158 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv2.bn.running_mean']));
    const buf_159 = createEmptyBuf(device, 512);;
    const buf_160 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv2.bn.weight']));
    const buf_161 = createEmptyBuf(device, 512);;
    const buf_162 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv2.bn.bias']));
    const buf_163 = createEmptyBuf(device, 1179648);;
    const buf_164 = createWeightBuf(device, 589824, getTensorBuffer(safetensor, metadata['net.b4.0.conv.weight']));
    const buf_165 = createEmptyBuf(device, 1024);;
    const buf_166 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.0.bn.running_mean']));
    const buf_167 = createEmptyBuf(device, 1024);;
    const buf_168 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.0.bn.weight']));
    const buf_169 = createEmptyBuf(device, 1024);;
    const buf_170 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.0.bn.bias']));
    const buf_171 = createEmptyBuf(device, 262144);;
    const buf_172 = createWeightBuf(device, 131072, getTensorBuffer(safetensor, metadata['net.b4.1.cv1.conv.weight']));
    const buf_173 = createEmptyBuf(device, 1024);;
    const buf_174 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv1.bn.running_mean']));
    const buf_175 = createEmptyBuf(device, 1024);;
    const buf_176 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv1.bn.weight']));
    const buf_177 = createEmptyBuf(device, 1024);;
    const buf_178 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv1.bn.bias']));
    const buf_179 = createEmptyBuf(device, 589824);;
    const buf_180 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv1.conv.weight']));
    const buf_181 = createEmptyBuf(device, 512);;
    const buf_182 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv1.bn.running_mean']));
    const buf_183 = createEmptyBuf(device, 512);;
    const buf_184 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv1.bn.weight']));
    const buf_185 = createEmptyBuf(device, 512);;
    const buf_186 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv1.bn.bias']));
    const buf_187 = createEmptyBuf(device, 589824);;
    const buf_188 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv2.conv.weight']));
    const buf_189 = createEmptyBuf(device, 512);;
    const buf_190 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv2.bn.running_mean']));
    const buf_191 = createEmptyBuf(device, 512);;
    const buf_192 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv2.bn.weight']));
    const buf_193 = createEmptyBuf(device, 512);;
    const buf_194 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv2.bn.bias']));
    const buf_195 = createEmptyBuf(device, 393216);;
    const buf_196 = createWeightBuf(device, 196608, getTensorBuffer(safetensor, metadata['net.b4.1.cv2.conv.weight']));
    const buf_197 = createEmptyBuf(device, 1024);;
    const buf_198 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv2.bn.running_mean']));
    const buf_199 = createEmptyBuf(device, 1024);;
    const buf_200 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv2.bn.weight']));
    const buf_201 = createEmptyBuf(device, 1024);;
    const buf_202 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv2.bn.bias']));
    const buf_203 = createEmptyBuf(device, 131072);;
    const buf_204 = createWeightBuf(device, 65536, getTensorBuffer(safetensor, metadata['net.b5.0.cv1.conv.weight']));
    const buf_205 = createEmptyBuf(device, 512);;
    const buf_206 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b5.0.cv1.bn.running_mean']));
    const buf_207 = createEmptyBuf(device, 512);;
    const buf_208 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b5.0.cv1.bn.weight']));
    const buf_209 = createEmptyBuf(device, 512);;
    const buf_210 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b5.0.cv1.bn.bias']));
    const buf_211 = createEmptyBuf(device, 524288);;
    const buf_212 = createWeightBuf(device, 262144, getTensorBuffer(safetensor, metadata['net.b5.0.cv2.conv.weight']));
    const buf_213 = createEmptyBuf(device, 1024);;
    const buf_214 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b5.0.cv2.bn.running_mean']));
    const buf_215 = createEmptyBuf(device, 1024);;
    const buf_216 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b5.0.cv2.bn.weight']));
    const buf_217 = createEmptyBuf(device, 1024);;
    const buf_218 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b5.0.cv2.bn.bias']));
    const buf_219 = createEmptyBuf(device, 196608);;
    const buf_220 = createWeightBuf(device, 98304, getTensorBuffer(safetensor, metadata['fpn.n1.cv1.conv.weight']));
    const buf_221 = createEmptyBuf(device, 512);;
    const buf_222 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv1.bn.running_mean']));
    const buf_223 = createEmptyBuf(device, 512);;
    const buf_224 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv1.bn.weight']));
    const buf_225 = createEmptyBuf(device, 512);;
    const buf_226 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv1.bn.bias']));
    const buf_227 = createEmptyBuf(device, 147456);;
    const buf_228 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv1.conv.weight']));
    const buf_229 = createEmptyBuf(device, 256);;
    const buf_230 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv1.bn.running_mean']));
    const buf_231 = createEmptyBuf(device, 256);;
    const buf_232 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv1.bn.weight']));
    const buf_233 = createEmptyBuf(device, 256);;
    const buf_234 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv1.bn.bias']));
    const buf_235 = createEmptyBuf(device, 147456);;
    const buf_236 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv2.conv.weight']));
    const buf_237 = createEmptyBuf(device, 256);;
    const buf_238 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv2.bn.running_mean']));
    const buf_239 = createEmptyBuf(device, 256);;
    const buf_240 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv2.bn.weight']));
    const buf_241 = createEmptyBuf(device, 256);;
    const buf_242 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv2.bn.bias']));
    const buf_243 = createEmptyBuf(device, 98304);;
    const buf_244 = createWeightBuf(device, 49152, getTensorBuffer(safetensor, metadata['fpn.n1.cv2.conv.weight']));
    const buf_245 = createEmptyBuf(device, 512);;
    const buf_246 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv2.bn.running_mean']));
    const buf_247 = createEmptyBuf(device, 512);;
    const buf_248 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv2.bn.weight']));
    const buf_249 = createEmptyBuf(device, 512);;
    const buf_250 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv2.bn.bias']));
    const buf_251 = createEmptyBuf(device, 49152);;
    const buf_252 = createWeightBuf(device, 24576, getTensorBuffer(safetensor, metadata['fpn.n2.cv1.conv.weight']));
    const buf_253 = createEmptyBuf(device, 256);;
    const buf_254 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv1.bn.running_mean']));
    const buf_255 = createEmptyBuf(device, 256);;
    const buf_256 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv1.bn.weight']));
    const buf_257 = createEmptyBuf(device, 256);;
    const buf_258 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv1.bn.bias']));
    const buf_259 = createEmptyBuf(device, 36864);;
    const buf_260 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv1.conv.weight']));
    const buf_261 = createEmptyBuf(device, 128);;
    const buf_262 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv1.bn.running_mean']));
    const buf_263 = createEmptyBuf(device, 128);;
    const buf_264 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv1.bn.weight']));
    const buf_265 = createEmptyBuf(device, 128);;
    const buf_266 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv1.bn.bias']));
    const buf_267 = createEmptyBuf(device, 36864);;
    const buf_268 = createWeightBuf(device, 18432, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv2.conv.weight']));
    const buf_269 = createEmptyBuf(device, 128);;
    const buf_270 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv2.bn.running_mean']));
    const buf_271 = createEmptyBuf(device, 128);;
    const buf_272 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv2.bn.weight']));
    const buf_273 = createEmptyBuf(device, 128);;
    const buf_274 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv2.bn.bias']));
    const buf_275 = createEmptyBuf(device, 24576);;
    const buf_276 = createWeightBuf(device, 12288, getTensorBuffer(safetensor, metadata['fpn.n2.cv2.conv.weight']));
    const buf_277 = createEmptyBuf(device, 256);;
    const buf_278 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv2.bn.running_mean']));
    const buf_279 = createEmptyBuf(device, 256);;
    const buf_280 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv2.bn.weight']));
    const buf_281 = createEmptyBuf(device, 256);;
    const buf_282 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv2.bn.bias']));
    const buf_283 = createEmptyBuf(device, 147456);;
    const buf_284 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['head.cv2.0.0.conv.weight']));
    const buf_285 = createEmptyBuf(device, 256);;
    const buf_286 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.0.bn.running_mean']));
    const buf_287 = createEmptyBuf(device, 256);;
    const buf_288 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.0.bn.weight']));
    const buf_289 = createEmptyBuf(device, 256);;
    const buf_290 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.0.bn.bias']));
    const buf_291 = createEmptyBuf(device, 147456);;
    const buf_292 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['head.cv2.0.1.conv.weight']));
    const buf_293 = createEmptyBuf(device, 256);;
    const buf_294 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.1.bn.running_mean']));
    const buf_295 = createEmptyBuf(device, 256);;
    const buf_296 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.1.bn.weight']));
    const buf_297 = createEmptyBuf(device, 256);;
    const buf_298 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.1.bn.bias']));
    const buf_299 = createEmptyBuf(device, 16384);;
    const buf_300 = createWeightBuf(device, 8192, getTensorBuffer(safetensor, metadata['head.cv2.0.2.weight']));
    const buf_301 = createEmptyBuf(device, 256);;
    const buf_302 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.2.bias']));
    const buf_303 = createEmptyBuf(device, 184320);;
    const buf_304 = createWeightBuf(device, 92160, getTensorBuffer(safetensor, metadata['head.cv3.0.0.conv.weight']));
    const buf_305 = createEmptyBuf(device, 320);;
    const buf_306 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.0.bn.running_mean']));
    const buf_307 = createEmptyBuf(device, 320);;
    const buf_308 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.0.bn.weight']));
    const buf_309 = createEmptyBuf(device, 320);;
    const buf_310 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.0.bn.bias']));
    const buf_311 = createEmptyBuf(device, 230400);;
    const buf_312 = createWeightBuf(device, 115200, getTensorBuffer(safetensor, metadata['head.cv3.0.1.conv.weight']));
    const buf_313 = createEmptyBuf(device, 320);;
    const buf_314 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.1.bn.running_mean']));
    const buf_315 = createEmptyBuf(device, 320);;
    const buf_316 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.1.bn.weight']));
    const buf_317 = createEmptyBuf(device, 320);;
    const buf_318 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.1.bn.bias']));
    const buf_319 = createEmptyBuf(device, 25600);;
    const buf_320 = createWeightBuf(device, 12800, getTensorBuffer(safetensor, metadata['head.cv3.0.2.weight']));
    const buf_321 = createEmptyBuf(device, 320);;
    const buf_322 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.2.bias']));
    const buf_323 = createEmptyBuf(device, 147456);;
    const buf_324 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['fpn.n3.conv.weight']));
    const buf_325 = createEmptyBuf(device, 256);;
    const buf_326 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n3.bn.running_mean']));
    const buf_327 = createEmptyBuf(device, 256);;
    const buf_328 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n3.bn.weight']));
    const buf_329 = createEmptyBuf(device, 256);;
    const buf_330 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n3.bn.bias']));
    const buf_331 = createEmptyBuf(device, 98304);;
    const buf_332 = createWeightBuf(device, 49152, getTensorBuffer(safetensor, metadata['fpn.n4.cv1.conv.weight']));
    const buf_333 = createEmptyBuf(device, 512);;
    const buf_334 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv1.bn.running_mean']));
    const buf_335 = createEmptyBuf(device, 512);;
    const buf_336 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv1.bn.weight']));
    const buf_337 = createEmptyBuf(device, 512);;
    const buf_338 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv1.bn.bias']));
    const buf_339 = createEmptyBuf(device, 147456);;
    const buf_340 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv1.conv.weight']));
    const buf_341 = createEmptyBuf(device, 256);;
    const buf_342 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv1.bn.running_mean']));
    const buf_343 = createEmptyBuf(device, 256);;
    const buf_344 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv1.bn.weight']));
    const buf_345 = createEmptyBuf(device, 256);;
    const buf_346 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv1.bn.bias']));
    const buf_347 = createEmptyBuf(device, 147456);;
    const buf_348 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv2.conv.weight']));
    const buf_349 = createEmptyBuf(device, 256);;
    const buf_350 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv2.bn.running_mean']));
    const buf_351 = createEmptyBuf(device, 256);;
    const buf_352 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv2.bn.weight']));
    const buf_353 = createEmptyBuf(device, 256);;
    const buf_354 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv2.bn.bias']));
    const buf_355 = createEmptyBuf(device, 98304);;
    const buf_356 = createWeightBuf(device, 49152, getTensorBuffer(safetensor, metadata['fpn.n4.cv2.conv.weight']));
    const buf_357 = createEmptyBuf(device, 512);;
    const buf_358 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv2.bn.running_mean']));
    const buf_359 = createEmptyBuf(device, 512);;
    const buf_360 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv2.bn.weight']));
    const buf_361 = createEmptyBuf(device, 512);;
    const buf_362 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv2.bn.bias']));
    const buf_363 = createEmptyBuf(device, 294912);;
    const buf_364 = createWeightBuf(device, 147456, getTensorBuffer(safetensor, metadata['head.cv2.1.0.conv.weight']));
    const buf_365 = createEmptyBuf(device, 256);;
    const buf_366 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.0.bn.running_mean']));
    const buf_367 = createEmptyBuf(device, 256);;
    const buf_368 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.0.bn.weight']));
    const buf_369 = createEmptyBuf(device, 256);;
    const buf_370 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.0.bn.bias']));
    const buf_371 = createEmptyBuf(device, 147456);;
    const buf_372 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['head.cv2.1.1.conv.weight']));
    const buf_373 = createEmptyBuf(device, 256);;
    const buf_374 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.1.bn.running_mean']));
    const buf_375 = createEmptyBuf(device, 256);;
    const buf_376 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.1.bn.weight']));
    const buf_377 = createEmptyBuf(device, 256);;
    const buf_378 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.1.bn.bias']));
    const buf_379 = createEmptyBuf(device, 16384);;
    const buf_380 = createWeightBuf(device, 8192, getTensorBuffer(safetensor, metadata['head.cv2.1.2.weight']));
    const buf_381 = createEmptyBuf(device, 256);;
    const buf_382 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.2.bias']));
    const buf_383 = createEmptyBuf(device, 368640);;
    const buf_384 = createWeightBuf(device, 184320, getTensorBuffer(safetensor, metadata['head.cv3.1.0.conv.weight']));
    const buf_385 = createEmptyBuf(device, 320);;
    const buf_386 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.0.bn.running_mean']));
    const buf_387 = createEmptyBuf(device, 320);;
    const buf_388 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.0.bn.weight']));
    const buf_389 = createEmptyBuf(device, 320);;
    const buf_390 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.0.bn.bias']));
    const buf_391 = createEmptyBuf(device, 230400);;
    const buf_392 = createWeightBuf(device, 115200, getTensorBuffer(safetensor, metadata['head.cv3.1.1.conv.weight']));
    const buf_393 = createEmptyBuf(device, 320);;
    const buf_394 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.1.bn.running_mean']));
    const buf_395 = createEmptyBuf(device, 320);;
    const buf_396 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.1.bn.weight']));
    const buf_397 = createEmptyBuf(device, 320);;
    const buf_398 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.1.bn.bias']));
    const buf_399 = createEmptyBuf(device, 25600);;
    const buf_400 = createWeightBuf(device, 12800, getTensorBuffer(safetensor, metadata['head.cv3.1.2.weight']));
    const buf_401 = createEmptyBuf(device, 320);;
    const buf_402 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.2.bias']));
    const buf_403 = createEmptyBuf(device, 589824);;
    const buf_404 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['fpn.n5.conv.weight']));
    const buf_405 = createEmptyBuf(device, 512);;
    const buf_406 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n5.bn.running_mean']));
    const buf_407 = createEmptyBuf(device, 512);;
    const buf_408 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n5.bn.weight']));
    const buf_409 = createEmptyBuf(device, 512);;
    const buf_410 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n5.bn.bias']));
    const buf_411 = createEmptyBuf(device, 393216);;
    const buf_412 = createWeightBuf(device, 196608, getTensorBuffer(safetensor, metadata['fpn.n6.cv1.conv.weight']));
    const buf_413 = createEmptyBuf(device, 1024);;
    const buf_414 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv1.bn.running_mean']));
    const buf_415 = createEmptyBuf(device, 1024);;
    const buf_416 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv1.bn.weight']));
    const buf_417 = createEmptyBuf(device, 1024);;
    const buf_418 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv1.bn.bias']));
    const buf_419 = createEmptyBuf(device, 589824);;
    const buf_420 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv1.conv.weight']));
    const buf_421 = createEmptyBuf(device, 512);;
    const buf_422 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv1.bn.running_mean']));
    const buf_423 = createEmptyBuf(device, 512);;
    const buf_424 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv1.bn.weight']));
    const buf_425 = createEmptyBuf(device, 512);;
    const buf_426 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv1.bn.bias']));
    const buf_427 = createEmptyBuf(device, 589824);;
    const buf_428 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv2.conv.weight']));
    const buf_429 = createEmptyBuf(device, 512);;
    const buf_430 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv2.bn.running_mean']));
    const buf_431 = createEmptyBuf(device, 512);;
    const buf_432 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv2.bn.weight']));
    const buf_433 = createEmptyBuf(device, 512);;
    const buf_434 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv2.bn.bias']));
    const buf_435 = createEmptyBuf(device, 393216);;
    const buf_436 = createWeightBuf(device, 196608, getTensorBuffer(safetensor, metadata['fpn.n6.cv2.conv.weight']));
    const buf_437 = createEmptyBuf(device, 1024);;
    const buf_438 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv2.bn.running_mean']));
    const buf_439 = createEmptyBuf(device, 1024);;
    const buf_440 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv2.bn.weight']));
    const buf_441 = createEmptyBuf(device, 1024);;
    const buf_442 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv2.bn.bias']));
    const buf_443 = createEmptyBuf(device, 589824);;
    const buf_444 = createWeightBuf(device, 294912, getTensorBuffer(safetensor, metadata['head.cv2.2.0.conv.weight']));
    const buf_445 = createEmptyBuf(device, 256);;
    const buf_446 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.0.bn.running_mean']));
    const buf_447 = createEmptyBuf(device, 256);;
    const buf_448 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.0.bn.weight']));
    const buf_449 = createEmptyBuf(device, 256);;
    const buf_450 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.0.bn.bias']));
    const buf_451 = createEmptyBuf(device, 147456);;
    const buf_452 = createWeightBuf(device, 73728, getTensorBuffer(safetensor, metadata['head.cv2.2.1.conv.weight']));
    const buf_453 = createEmptyBuf(device, 256);;
    const buf_454 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.1.bn.running_mean']));
    const buf_455 = createEmptyBuf(device, 256);;
    const buf_456 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.1.bn.weight']));
    const buf_457 = createEmptyBuf(device, 256);;
    const buf_458 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.1.bn.bias']));
    const buf_459 = createEmptyBuf(device, 16384);;
    const buf_460 = createWeightBuf(device, 8192, getTensorBuffer(safetensor, metadata['head.cv2.2.2.weight']));
    const buf_461 = createEmptyBuf(device, 256);;
    const buf_462 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.2.bias']));
    const buf_463 = createEmptyBuf(device, 737280);;
    const buf_464 = createWeightBuf(device, 368640, getTensorBuffer(safetensor, metadata['head.cv3.2.0.conv.weight']));
    const buf_465 = createEmptyBuf(device, 320);;
    const buf_466 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.0.bn.running_mean']));
    const buf_467 = createEmptyBuf(device, 320);;
    const buf_468 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.0.bn.weight']));
    const buf_469 = createEmptyBuf(device, 320);;
    const buf_470 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.0.bn.bias']));
    const buf_471 = createEmptyBuf(device, 230400);;
    const buf_472 = createWeightBuf(device, 115200, getTensorBuffer(safetensor, metadata['head.cv3.2.1.conv.weight']));
    const buf_473 = createEmptyBuf(device, 320);;
    const buf_474 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.1.bn.running_mean']));
    const buf_475 = createEmptyBuf(device, 320);;
    const buf_476 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.1.bn.weight']));
    const buf_477 = createEmptyBuf(device, 320);;
    const buf_478 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.1.bn.bias']));
    const buf_479 = createEmptyBuf(device, 25600);;
    const buf_480 = createWeightBuf(device, 12800, getTensorBuffer(safetensor, metadata['head.cv3.2.2.weight']));
    const buf_481 = createEmptyBuf(device, 320);;
    const buf_482 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.2.bias']));
    const buf_483 = createEmptyBuf(device, 64);;
    const buf_484 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['head.dfl.conv.weight']));
    const buf_485 = createEmptyBuf(device, 14196);;
    const buf_486 = createEmptyBuf(device, 2768896);;
    const input0 = createEmptyBuf(device, 2076672);;
    const buf_487 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b1.0.bn.running_var']));
    const buf_488 = createEmptyBuf(device, 1384448);;
    const buf_489 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b1.1.bn.running_var']));
    const buf_490 = createEmptyBuf(device, 1384448);;
    const buf_491 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv1.bn.running_var']));
    const buf_492 = createEmptyBuf(device, 692224);;
    const buf_493 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv1.bn.running_var']));
    const buf_494 = createEmptyBuf(device, 692224);;
    const buf_495 = createWeightBuf(device, 32, getTensorBuffer(safetensor, metadata['net.b2.0.bottleneck.0.cv2.bn.running_var']));
    const buf_496 = createEmptyBuf(device, 2076672);;
    const buf_497 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.0.cv2.bn.running_var']));
    const buf_498 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.1.bn.running_var']));
    const buf_499 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv1.bn.running_var']));
    const buf_500 = createEmptyBuf(device, 346112);;
    const buf_501 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv1.bn.running_var']));
    const buf_502 = createEmptyBuf(device, 346112);;
    const buf_503 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.0.cv2.bn.running_var']));
    const buf_504 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv1.bn.running_var']));
    const buf_505 = createEmptyBuf(device, 346112);;
    const buf_506 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['net.b2.2.bottleneck.1.cv2.bn.running_var']));
    const buf_507 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b2.2.cv2.bn.running_var']));
    const buf_508 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.0.bn.running_var']));
    const buf_509 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv1.bn.running_var']));
    const buf_510 = createEmptyBuf(device, 173056);;
    const buf_511 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv1.bn.running_var']));
    const buf_512 = createEmptyBuf(device, 173056);;
    const buf_513 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.0.cv2.bn.running_var']));
    const buf_514 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv1.bn.running_var']));
    const buf_515 = createEmptyBuf(device, 173056);;
    const buf_516 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['net.b3.1.bottleneck.1.cv2.bn.running_var']));
    const buf_517 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b3.1.cv2.bn.running_var']));
    const buf_518 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.0.bn.running_var']));
    const buf_519 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv1.bn.running_var']));
    const buf_520 = createEmptyBuf(device, 86528);;
    const buf_521 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv1.bn.running_var']));
    const buf_522 = createEmptyBuf(device, 86528);;
    const buf_523 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b4.1.bottleneck.0.cv2.bn.running_var']));
    const buf_524 = createEmptyBuf(device, 259584);;
    const buf_525 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b4.1.cv2.bn.running_var']));
    const buf_526 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['net.b5.0.cv1.bn.running_var']));
    const buf_527 = createEmptyBuf(device, 86528);;
    const buf_528 = createEmptyBuf(device, 86528);;
    const buf_529 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['net.b5.0.cv2.bn.running_var']));
    const buf_530 = createEmptyBuf(device, 1038336);;
    const buf_531 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv1.bn.running_var']));
    const buf_532 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv1.bn.running_var']));
    const buf_533 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n1.bottleneck.0.cv2.bn.running_var']));
    const buf_534 = createEmptyBuf(device, 519168);;
    const buf_535 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n1.cv2.bn.running_var']));
    const buf_536 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv1.bn.running_var']));
    const buf_537 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv1.bn.running_var']));
    const buf_538 = createWeightBuf(device, 64, getTensorBuffer(safetensor, metadata['fpn.n2.bottleneck.0.cv2.bn.running_var']));
    const buf_539 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n2.cv2.bn.running_var']));
    const buf_540 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.0.bn.running_var']));
    const buf_541 = createEmptyBuf(device, 865280);;
    const buf_542 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.0.bn.running_var']));
    const buf_543 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n3.bn.running_var']));
    const buf_544 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.0.1.bn.running_var']));
    const buf_545 = createEmptyBuf(device, 865280);;
    const buf_546 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.0.1.bn.running_var']));
    const buf_547 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv1.bn.running_var']));
    const buf_548 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv1.bn.running_var']));
    const buf_549 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['fpn.n4.bottleneck.0.cv2.bn.running_var']));
    const buf_550 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n4.cv2.bn.running_var']));
    const buf_551 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.0.bn.running_var']));
    const buf_552 = createEmptyBuf(device, 216320);;
    const buf_553 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.0.bn.running_var']));
    const buf_554 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n5.bn.running_var']));
    const buf_555 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.1.1.bn.running_var']));
    const buf_556 = createEmptyBuf(device, 216320);;
    const buf_557 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.1.1.bn.running_var']));
    const buf_558 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv1.bn.running_var']));
    const buf_559 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv1.bn.running_var']));
    const buf_560 = createWeightBuf(device, 256, getTensorBuffer(safetensor, metadata['fpn.n6.bottleneck.0.cv2.bn.running_var']));
    const buf_561 = createWeightBuf(device, 512, getTensorBuffer(safetensor, metadata['fpn.n6.cv2.bn.running_var']));
    const buf_562 = createEmptyBuf(device, 43264);;
    const buf_563 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.0.bn.running_var']));
    const buf_564 = createEmptyBuf(device, 54080);;
    const buf_565 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.0.bn.running_var']));
    const buf_566 = createEmptyBuf(device, 43264);;
    const buf_567 = createWeightBuf(device, 128, getTensorBuffer(safetensor, metadata['head.cv2.2.1.bn.running_var']));
    const buf_568 = createEmptyBuf(device, 54080);;
    const buf_569 = createWeightBuf(device, 160, getTensorBuffer(safetensor, metadata['head.cv3.2.1.bn.running_var']));
    const buf_570 = createEmptyBuf(device, 56784);;
    const buf_571 = createEmptyBuf(device, 1135680);;
    const buf_572 = createEmptyBuf(device, 56784);;
    const buf_573 = createEmptyBuf(device, 56784);;
    const buf_574 = createEmptyBuf(device, 28392);;
    const buf_575 = createEmptyBuf(device, 28392);;
    const output0 = createEmptyBuf(device, 1192464);;

    const gpuWriteBuffer0 = device.createBuffer({size:input0.size, usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.MAP_WRITE });

    const gpuReadBuffer0 = device.createBuffer({size:output0.size, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });

    const kernels = [r_13_4_13_4, r_13_2_26, r_13_13, E_27_4_4, E_4_4, E_4_4, E_4_4, E_36_32_4, E_8_4, E_8_4, E_8_4, E_8_32_4, E_8_4, E_8_4, E_8_4, E_18_32_4, E_4_4, E_4_4, E_4_4, E_18_32_4, E_4_4, E_4_4, E_4_4, E_12_32_4, E_8_4, E_8_4, E_8_4, E_144_32_4, E_16_4, E_16_4, E_16_4, E_32_32_4, E_16_4, E_16_4, E_16_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_64_32_4, E_16_4, E_16_4, E_16_4, E_576_32_4, E_32_4, E_32_4, E_32_4, E_128_32_4, E_32_4, E_32_4, E_32_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_256_32_4, E_32_4, E_32_4, E_32_4, E_2304_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_512_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_1152_32_4, E_32_4, E_32_4, E_32_4, E_1152_32_4, E_32_4, E_32_4, E_32_4, E_768_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_256_32_4, E_32_4, E_32_4, E_32_4, E_1024_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_384_32_4, E_32_4, E_32_4, E_32_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_192_32_4, E_32_4, E_32_4, E_32_4, E_96_32_4, E_16_4, E_16_4, E_16_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_72_32_4, E_8_4, E_8_4, E_8_4, E_48_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_32_32_4, E_16_4, E_360_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_450_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_50_32_4, E_5_4_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_192_32_4, E_32_4, E_32_4, E_32_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_192_32_4, E_32_4, E_32_4, E_32_4, E_576_32_4n1, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_32_32_4, E_16_4, E_720_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_450_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_50_32_4, E_5_4_4, E_1152_32_4, E_32_4, E_32_4, E_32_4, E_768_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_1152_32_4, E_32_4, E_32_4, E_32_4, E_1152_32_4, E_32_4, E_32_4, E_32_4, E_768_32_4, E_2_32_4, E_2_32_4, E_2_32_4, E_1152_32_4n1, E_16_4, E_16_4, E_16_4, E_288_32_4, E_16_4, E_16_4, E_16_4, E_32_32_4, E_16_4, E_1440_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_450_32_4, E_5_4_4, E_5_4_4, E_5_4_4, E_50_32_4, E_5_4_4, E_4_4n1, E_1183_3, r_2_13_13_2_16_4_3_4_4_3_3, r_13_13_8_8_2_16_4_4_3_3, r_169_8_16_4_4_32, r_13_13_4_8_2_16_4_4_3_3, r_13_13_4_8_2_16_4_4_3_3n1, E_6_169_8_16_4, r_169_8_16_12_4_4_4, r_13_13_16_4_32_4_4_3_3, r_169_16_4_16_4_4_4, r_13_13_8_4_32_4_4_3_3, r_13_13_8_4_32_4_4_3_3n1, r_13_13_8_4_32_4_4_3_3n2, r_13_13_8_4_32_4_4_3_3n3, E_4_169_32_4_4, r_169_16_4_32_4_4_4, r_13_13_32_2_2_64_4_3_3, r_169_32_32_4_4_4, r_13_13_16_2_2_64_4_3_3, r_13_13_16_2_2_64_4_3_3n1, r_13_13_16_2_2_64_4_3_3n2, r_13_13_16_2_2_64_4_3_3n3, E_8_169_32_4, r_169_32_64_4_4_4, r_2_13_13_32_128_4_3_3, r_2_169_32_64_4_4, r_13_13_32_128_4_3_3, r_13_13_32_128_4_3_3n1, E_12_169_32, r_2_169_32_96_4_4, r_169_32_64_4_4, r_4_13_13_32_5_5, r_4_13_13_32_5_5, r_4_13_13_32_5_5, E_16_169_32, r_2_169_32_128_4_4, E_12_13_13_32_2_2, r_169_32_96_4_4_4, r_13_13_16_2_2_64_4_3_3, r_13_13_16_2_2_64_4_3_3n2, E_6_169_32_4, r_169_32_48_4_4_4, E_6_13_13_32_4_4, r_169_16_4_48_4_4_4, r_13_13_8_4_32_4_4_3_3, r_13_13_8_4_32_4_4_3_3n2, E_3_169_32_4_4, r_169_16_4_24_4_4_4, r_13_13_16_4_64_4_4_3_3, r_5_13_13_4_4_64_4_4_3_3, r_13_13_16_2_2_64_4_3_3n4, r_13_13_16_4_64_4_4_3_3, r_5_13_13_4_4_80_4_4_3_3, E_6_169_32_4n1, r_169_16_4_16_4_4_4n1, r_5_169_4_4_20_4_4_4, r_169_32_48_4_4_4, r_13_13_16_2_2_64_4_3_3, r_13_13_16_2_2_64_4_3_3n2, E_6_169_32_4, r_169_32_48_4_4_4, r_13_13_16_2_2_128_4_3_3, r_5_13_13_4_2_2_128_4_3_3, r_13_13_32_128_4_3_3n2, r_13_13_16_2_2_64_4_3_3n2, r_5_13_13_4_2_2_80_4_3_3, E_12_169_32n1, r_169_16_16_4_4_4, r_5_169_4_20_4_4_4, r_2_169_32_96_4_4, r_13_13_32_128_4_3_3, r_13_13_32_128_4_3_3n3, E_12_169_32, r_2_169_32_96_4_4, r_13_13_16_256_4_3_3, r_5_13_13_4_256_4_3_3, r_13_13_16_64_4_3_3, r_5_13_13_4_80_4_3_3, r_169_16_16_4_4, r_5_169_4_20_4_4, r_1183_4_3_16, E_5_1183_16_3, r_1183_4_3_16n1, r_1183_4_3_16n2, E_1183_3_2, E_1183_3_2n1, E_7_1183_4_3_3];
    const pipelines = await Promise.all(kernels.map(async (name, i) => {
      return await device.createComputePipelineAsync({
          layout: device.createPipelineLayout({
              bindGroupLayouts: [layouts[i]],
          }),
          compute: {
              module: device.createShaderModule({
                  code: name,
              }),
              entryPoint: "main",
          },
      });
  }))

    return async (_input0) => {
        const commandEncoder = device.createCommandEncoder();
        await gpuWriteBuffer0.mapAsync(GPUMapMode.WRITE);
        new Float32Array(gpuWriteBuffer0.getMappedRange()).set(_input0);
        gpuWriteBuffer0.unmap();
        commandEncoder.copyBufferToBuffer(gpuWriteBuffer0, 0, input0, 0, gpuWriteBuffer0.size);
        addComputePass(device, commandEncoder, pipelines[0], layouts[0], infinityBuf, [buf_0], [13, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[1], layouts[1], infinityBuf, [buf_1], [13, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[2], layouts[2], infinityBuf, [buf_2], [13, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[3], layouts[3], infinityBuf, [buf_3, buf_4], [27, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[4], layouts[4], infinityBuf, [buf_5, buf_6], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[5], layouts[5], infinityBuf, [buf_7, buf_8], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[6], layouts[6], infinityBuf, [buf_9, buf_10], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[7], layouts[7], infinityBuf, [buf_11, buf_12], [36, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[8], layouts[8], infinityBuf, [buf_13, buf_14], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[9], layouts[9], infinityBuf, [buf_15, buf_16], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[10], layouts[10], infinityBuf, [buf_17, buf_18], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[11], layouts[11], infinityBuf, [buf_19, buf_20], [8, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[12], layouts[12], infinityBuf, [buf_21, buf_22], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[13], layouts[13], infinityBuf, [buf_23, buf_24], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[14], layouts[14], infinityBuf, [buf_25, buf_26], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[15], layouts[15], infinityBuf, [buf_27, buf_28], [18, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[16], layouts[16], infinityBuf, [buf_29, buf_30], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[17], layouts[17], infinityBuf, [buf_31, buf_32], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[18], layouts[18], infinityBuf, [buf_33, buf_34], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[19], layouts[19], infinityBuf, [buf_35, buf_36], [18, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[20], layouts[20], infinityBuf, [buf_37, buf_38], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[21], layouts[21], infinityBuf, [buf_39, buf_40], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[22], layouts[22], infinityBuf, [buf_41, buf_42], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[23], layouts[23], infinityBuf, [buf_43, buf_44], [12, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[24], layouts[24], infinityBuf, [buf_45, buf_46], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[25], layouts[25], infinityBuf, [buf_47, buf_48], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[26], layouts[26], infinityBuf, [buf_49, buf_50], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[27], layouts[27], infinityBuf, [buf_51, buf_52], [144, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[28], layouts[28], infinityBuf, [buf_53, buf_54], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[29], layouts[29], infinityBuf, [buf_55, buf_56], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[30], layouts[30], infinityBuf, [buf_57, buf_58], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[31], layouts[31], infinityBuf, [buf_59, buf_60], [32, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[32], layouts[32], infinityBuf, [buf_61, buf_62], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[33], layouts[33], infinityBuf, [buf_63, buf_64], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[34], layouts[34], infinityBuf, [buf_65, buf_66], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[35], layouts[35], infinityBuf, [buf_67, buf_68], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[36], layouts[36], infinityBuf, [buf_69, buf_70], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[37], layouts[37], infinityBuf, [buf_71, buf_72], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[38], layouts[38], infinityBuf, [buf_73, buf_74], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[39], layouts[39], infinityBuf, [buf_75, buf_76], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[40], layouts[40], infinityBuf, [buf_77, buf_78], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[41], layouts[41], infinityBuf, [buf_79, buf_80], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[42], layouts[42], infinityBuf, [buf_81, buf_82], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[43], layouts[43], infinityBuf, [buf_83, buf_84], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[44], layouts[44], infinityBuf, [buf_85, buf_86], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[45], layouts[45], infinityBuf, [buf_87, buf_88], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[46], layouts[46], infinityBuf, [buf_89, buf_90], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[47], layouts[47], infinityBuf, [buf_91, buf_92], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[48], layouts[48], infinityBuf, [buf_93, buf_94], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[49], layouts[49], infinityBuf, [buf_95, buf_96], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[50], layouts[50], infinityBuf, [buf_97, buf_98], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[51], layouts[51], infinityBuf, [buf_99, buf_100], [64, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[52], layouts[52], infinityBuf, [buf_101, buf_102], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[53], layouts[53], infinityBuf, [buf_103, buf_104], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[54], layouts[54], infinityBuf, [buf_105, buf_106], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[55], layouts[55], infinityBuf, [buf_107, buf_108], [576, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[56], layouts[56], infinityBuf, [buf_109, buf_110], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[57], layouts[57], infinityBuf, [buf_111, buf_112], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[58], layouts[58], infinityBuf, [buf_113, buf_114], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[59], layouts[59], infinityBuf, [buf_115, buf_116], [128, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[60], layouts[60], infinityBuf, [buf_117, buf_118], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[61], layouts[61], infinityBuf, [buf_119, buf_120], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[62], layouts[62], infinityBuf, [buf_121, buf_122], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[63], layouts[63], infinityBuf, [buf_123, buf_124], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[64], layouts[64], infinityBuf, [buf_125, buf_126], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[65], layouts[65], infinityBuf, [buf_127, buf_128], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[66], layouts[66], infinityBuf, [buf_129, buf_130], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[67], layouts[67], infinityBuf, [buf_131, buf_132], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[68], layouts[68], infinityBuf, [buf_133, buf_134], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[69], layouts[69], infinityBuf, [buf_135, buf_136], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[70], layouts[70], infinityBuf, [buf_137, buf_138], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[71], layouts[71], infinityBuf, [buf_139, buf_140], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[72], layouts[72], infinityBuf, [buf_141, buf_142], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[73], layouts[73], infinityBuf, [buf_143, buf_144], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[74], layouts[74], infinityBuf, [buf_145, buf_146], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[75], layouts[75], infinityBuf, [buf_147, buf_148], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[76], layouts[76], infinityBuf, [buf_149, buf_150], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[77], layouts[77], infinityBuf, [buf_151, buf_152], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[78], layouts[78], infinityBuf, [buf_153, buf_154], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[79], layouts[79], infinityBuf, [buf_155, buf_156], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[80], layouts[80], infinityBuf, [buf_157, buf_158], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[81], layouts[81], infinityBuf, [buf_159, buf_160], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[82], layouts[82], infinityBuf, [buf_161, buf_162], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[83], layouts[83], infinityBuf, [buf_163, buf_164], [2304, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[84], layouts[84], infinityBuf, [buf_165, buf_166], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[85], layouts[85], infinityBuf, [buf_167, buf_168], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[86], layouts[86], infinityBuf, [buf_169, buf_170], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[87], layouts[87], infinityBuf, [buf_171, buf_172], [512, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[88], layouts[88], infinityBuf, [buf_173, buf_174], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[89], layouts[89], infinityBuf, [buf_175, buf_176], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[90], layouts[90], infinityBuf, [buf_177, buf_178], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[91], layouts[91], infinityBuf, [buf_179, buf_180], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[92], layouts[92], infinityBuf, [buf_181, buf_182], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[93], layouts[93], infinityBuf, [buf_183, buf_184], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[94], layouts[94], infinityBuf, [buf_185, buf_186], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[95], layouts[95], infinityBuf, [buf_187, buf_188], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[96], layouts[96], infinityBuf, [buf_189, buf_190], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[97], layouts[97], infinityBuf, [buf_191, buf_192], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[98], layouts[98], infinityBuf, [buf_193, buf_194], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[99], layouts[99], infinityBuf, [buf_195, buf_196], [768, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[100], layouts[100], infinityBuf, [buf_197, buf_198], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[101], layouts[101], infinityBuf, [buf_199, buf_200], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[102], layouts[102], infinityBuf, [buf_201, buf_202], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[103], layouts[103], infinityBuf, [buf_203, buf_204], [256, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[104], layouts[104], infinityBuf, [buf_205, buf_206], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[105], layouts[105], infinityBuf, [buf_207, buf_208], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[106], layouts[106], infinityBuf, [buf_209, buf_210], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[107], layouts[107], infinityBuf, [buf_211, buf_212], [1024, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[108], layouts[108], infinityBuf, [buf_213, buf_214], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[109], layouts[109], infinityBuf, [buf_215, buf_216], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[110], layouts[110], infinityBuf, [buf_217, buf_218], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[111], layouts[111], infinityBuf, [buf_219, buf_220], [384, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[112], layouts[112], infinityBuf, [buf_221, buf_222], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[113], layouts[113], infinityBuf, [buf_223, buf_224], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[114], layouts[114], infinityBuf, [buf_225, buf_226], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[115], layouts[115], infinityBuf, [buf_227, buf_228], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[116], layouts[116], infinityBuf, [buf_229, buf_230], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[117], layouts[117], infinityBuf, [buf_231, buf_232], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[118], layouts[118], infinityBuf, [buf_233, buf_234], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[119], layouts[119], infinityBuf, [buf_235, buf_236], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[120], layouts[120], infinityBuf, [buf_237, buf_238], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[121], layouts[121], infinityBuf, [buf_239, buf_240], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[122], layouts[122], infinityBuf, [buf_241, buf_242], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[123], layouts[123], infinityBuf, [buf_243, buf_244], [192, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[124], layouts[124], infinityBuf, [buf_245, buf_246], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[125], layouts[125], infinityBuf, [buf_247, buf_248], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[126], layouts[126], infinityBuf, [buf_249, buf_250], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[127], layouts[127], infinityBuf, [buf_251, buf_252], [96, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[128], layouts[128], infinityBuf, [buf_253, buf_254], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[129], layouts[129], infinityBuf, [buf_255, buf_256], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[130], layouts[130], infinityBuf, [buf_257, buf_258], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[131], layouts[131], infinityBuf, [buf_259, buf_260], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[132], layouts[132], infinityBuf, [buf_261, buf_262], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[133], layouts[133], infinityBuf, [buf_263, buf_264], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[134], layouts[134], infinityBuf, [buf_265, buf_266], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[135], layouts[135], infinityBuf, [buf_267, buf_268], [72, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[136], layouts[136], infinityBuf, [buf_269, buf_270], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[137], layouts[137], infinityBuf, [buf_271, buf_272], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[138], layouts[138], infinityBuf, [buf_273, buf_274], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[139], layouts[139], infinityBuf, [buf_275, buf_276], [48, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[140], layouts[140], infinityBuf, [buf_277, buf_278], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[141], layouts[141], infinityBuf, [buf_279, buf_280], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[142], layouts[142], infinityBuf, [buf_281, buf_282], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[143], layouts[143], infinityBuf, [buf_283, buf_284], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[144], layouts[144], infinityBuf, [buf_285, buf_286], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[145], layouts[145], infinityBuf, [buf_287, buf_288], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[146], layouts[146], infinityBuf, [buf_289, buf_290], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[147], layouts[147], infinityBuf, [buf_291, buf_292], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[148], layouts[148], infinityBuf, [buf_293, buf_294], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[149], layouts[149], infinityBuf, [buf_295, buf_296], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[150], layouts[150], infinityBuf, [buf_297, buf_298], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[151], layouts[151], infinityBuf, [buf_299, buf_300], [32, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[152], layouts[152], infinityBuf, [buf_301, buf_302], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[153], layouts[153], infinityBuf, [buf_303, buf_304], [360, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[154], layouts[154], infinityBuf, [buf_305, buf_306], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[155], layouts[155], infinityBuf, [buf_307, buf_308], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[156], layouts[156], infinityBuf, [buf_309, buf_310], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[157], layouts[157], infinityBuf, [buf_311, buf_312], [450, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[158], layouts[158], infinityBuf, [buf_313, buf_314], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[159], layouts[159], infinityBuf, [buf_315, buf_316], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[160], layouts[160], infinityBuf, [buf_317, buf_318], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[161], layouts[161], infinityBuf, [buf_319, buf_320], [50, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[162], layouts[162], infinityBuf, [buf_321, buf_322], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[163], layouts[163], infinityBuf, [buf_323, buf_324], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[164], layouts[164], infinityBuf, [buf_325, buf_326], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[165], layouts[165], infinityBuf, [buf_327, buf_328], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[166], layouts[166], infinityBuf, [buf_329, buf_330], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[167], layouts[167], infinityBuf, [buf_331, buf_332], [192, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[168], layouts[168], infinityBuf, [buf_333, buf_334], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[169], layouts[169], infinityBuf, [buf_335, buf_336], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[170], layouts[170], infinityBuf, [buf_337, buf_338], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[171], layouts[171], infinityBuf, [buf_339, buf_340], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[172], layouts[172], infinityBuf, [buf_341, buf_342], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[173], layouts[173], infinityBuf, [buf_343, buf_344], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[174], layouts[174], infinityBuf, [buf_345, buf_346], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[175], layouts[175], infinityBuf, [buf_347, buf_348], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[176], layouts[176], infinityBuf, [buf_349, buf_350], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[177], layouts[177], infinityBuf, [buf_351, buf_352], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[178], layouts[178], infinityBuf, [buf_353, buf_354], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[179], layouts[179], infinityBuf, [buf_355, buf_356], [192, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[180], layouts[180], infinityBuf, [buf_357, buf_358], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[181], layouts[181], infinityBuf, [buf_359, buf_360], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[182], layouts[182], infinityBuf, [buf_361, buf_362], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[183], layouts[183], infinityBuf, [buf_363, buf_364], [576, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[184], layouts[184], infinityBuf, [buf_365, buf_366], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[185], layouts[185], infinityBuf, [buf_367, buf_368], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[186], layouts[186], infinityBuf, [buf_369, buf_370], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[187], layouts[187], infinityBuf, [buf_371, buf_372], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[188], layouts[188], infinityBuf, [buf_373, buf_374], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[189], layouts[189], infinityBuf, [buf_375, buf_376], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[190], layouts[190], infinityBuf, [buf_377, buf_378], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[191], layouts[191], infinityBuf, [buf_379, buf_380], [32, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[192], layouts[192], infinityBuf, [buf_381, buf_382], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[193], layouts[193], infinityBuf, [buf_383, buf_384], [720, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[194], layouts[194], infinityBuf, [buf_385, buf_386], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[195], layouts[195], infinityBuf, [buf_387, buf_388], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[196], layouts[196], infinityBuf, [buf_389, buf_390], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[197], layouts[197], infinityBuf, [buf_391, buf_392], [450, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[198], layouts[198], infinityBuf, [buf_393, buf_394], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[199], layouts[199], infinityBuf, [buf_395, buf_396], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[200], layouts[200], infinityBuf, [buf_397, buf_398], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[201], layouts[201], infinityBuf, [buf_399, buf_400], [50, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[202], layouts[202], infinityBuf, [buf_401, buf_402], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[203], layouts[203], infinityBuf, [buf_403, buf_404], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[204], layouts[204], infinityBuf, [buf_405, buf_406], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[205], layouts[205], infinityBuf, [buf_407, buf_408], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[206], layouts[206], infinityBuf, [buf_409, buf_410], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[207], layouts[207], infinityBuf, [buf_411, buf_412], [768, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[208], layouts[208], infinityBuf, [buf_413, buf_414], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[209], layouts[209], infinityBuf, [buf_415, buf_416], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[210], layouts[210], infinityBuf, [buf_417, buf_418], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[211], layouts[211], infinityBuf, [buf_419, buf_420], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[212], layouts[212], infinityBuf, [buf_421, buf_422], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[213], layouts[213], infinityBuf, [buf_423, buf_424], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[214], layouts[214], infinityBuf, [buf_425, buf_426], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[215], layouts[215], infinityBuf, [buf_427, buf_428], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[216], layouts[216], infinityBuf, [buf_429, buf_430], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[217], layouts[217], infinityBuf, [buf_431, buf_432], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[218], layouts[218], infinityBuf, [buf_433, buf_434], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[219], layouts[219], infinityBuf, [buf_435, buf_436], [768, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[220], layouts[220], infinityBuf, [buf_437, buf_438], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[221], layouts[221], infinityBuf, [buf_439, buf_440], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[222], layouts[222], infinityBuf, [buf_441, buf_442], [2, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[223], layouts[223], infinityBuf, [buf_443, buf_444], [1152, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[224], layouts[224], infinityBuf, [buf_445, buf_446], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[225], layouts[225], infinityBuf, [buf_447, buf_448], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[226], layouts[226], infinityBuf, [buf_449, buf_450], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[227], layouts[227], infinityBuf, [buf_451, buf_452], [288, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[228], layouts[228], infinityBuf, [buf_453, buf_454], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[229], layouts[229], infinityBuf, [buf_455, buf_456], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[230], layouts[230], infinityBuf, [buf_457, buf_458], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[231], layouts[231], infinityBuf, [buf_459, buf_460], [32, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[232], layouts[232], infinityBuf, [buf_461, buf_462], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[233], layouts[233], infinityBuf, [buf_463, buf_464], [1440, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[234], layouts[234], infinityBuf, [buf_465, buf_466], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[235], layouts[235], infinityBuf, [buf_467, buf_468], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[236], layouts[236], infinityBuf, [buf_469, buf_470], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[237], layouts[237], infinityBuf, [buf_471, buf_472], [450, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[238], layouts[238], infinityBuf, [buf_473, buf_474], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[239], layouts[239], infinityBuf, [buf_475, buf_476], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[240], layouts[240], infinityBuf, [buf_477, buf_478], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[241], layouts[241], infinityBuf, [buf_479, buf_480], [50, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[242], layouts[242], infinityBuf, [buf_481, buf_482], [5, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[243], layouts[243], infinityBuf, [buf_483, buf_484], [1, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[244], layouts[244], infinityBuf, [buf_485], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[245], layouts[245], infinityBuf, [buf_486, input0, buf_3, buf_5, buf_7, buf_487, buf_9], [13, 13, 2]);
        addComputePass(device, commandEncoder, pipelines[246], layouts[246], infinityBuf, [buf_488, buf_486, buf_11, buf_13, buf_15, buf_489, buf_17], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[247], layouts[247], infinityBuf, [buf_490, buf_488, buf_19, buf_21, buf_23, buf_491, buf_25], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[248], layouts[248], infinityBuf, [buf_492, buf_490, buf_27, buf_29, buf_31, buf_493, buf_33], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[249], layouts[249], infinityBuf, [buf_494, buf_490, buf_492, buf_35, buf_37, buf_39, buf_495, buf_41], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[250], layouts[250], infinityBuf, [buf_496, buf_490, buf_494], [169, 6, 1]);
        addComputePass(device, commandEncoder, pipelines[251], layouts[251], infinityBuf, [buf_488, buf_496, buf_43, buf_45, buf_47, buf_497, buf_49], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[252], layouts[252], infinityBuf, [buf_492, buf_488, buf_51, buf_53, buf_55, buf_498, buf_57], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[253], layouts[253], infinityBuf, [buf_494, buf_492, buf_59, buf_61, buf_63, buf_499, buf_65], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[254], layouts[254], infinityBuf, [buf_500, buf_494, buf_67, buf_69, buf_71, buf_501, buf_73], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[255], layouts[255], infinityBuf, [buf_502, buf_494, buf_500, buf_75, buf_77, buf_79, buf_503, buf_81], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[256], layouts[256], infinityBuf, [buf_500, buf_502, buf_83, buf_85, buf_87, buf_504, buf_89], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[257], layouts[257], infinityBuf, [buf_505, buf_502, buf_500, buf_91, buf_93, buf_95, buf_506, buf_97], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[258], layouts[258], infinityBuf, [buf_490, buf_494, buf_502, buf_505], [169, 4, 1]);
        addComputePass(device, commandEncoder, pipelines[259], layouts[259], infinityBuf, [buf_492, buf_490, buf_99, buf_101, buf_103, buf_507, buf_105], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[260], layouts[260], infinityBuf, [buf_502, buf_492, buf_107, buf_109, buf_111, buf_508, buf_113], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[261], layouts[261], infinityBuf, [buf_500, buf_502, buf_115, buf_117, buf_119, buf_509, buf_121], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[262], layouts[262], infinityBuf, [buf_510, buf_500, buf_123, buf_125, buf_127, buf_511, buf_129], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[263], layouts[263], infinityBuf, [buf_512, buf_500, buf_510, buf_131, buf_133, buf_135, buf_513, buf_137], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[264], layouts[264], infinityBuf, [buf_510, buf_512, buf_139, buf_141, buf_143, buf_514, buf_145], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[265], layouts[265], infinityBuf, [buf_515, buf_512, buf_510, buf_147, buf_149, buf_151, buf_516, buf_153], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[266], layouts[266], infinityBuf, [buf_494, buf_500, buf_512, buf_515], [169, 8, 1]);
        addComputePass(device, commandEncoder, pipelines[267], layouts[267], infinityBuf, [buf_505, buf_494, buf_155, buf_157, buf_159, buf_517, buf_161], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[268], layouts[268], infinityBuf, [buf_512, buf_505, buf_163, buf_165, buf_167, buf_518, buf_169], [13, 13, 2]);
        addComputePass(device, commandEncoder, pipelines[269], layouts[269], infinityBuf, [buf_510, buf_512, buf_171, buf_173, buf_175, buf_519, buf_177], [169, 2, 1]);
        addComputePass(device, commandEncoder, pipelines[270], layouts[270], infinityBuf, [buf_520, buf_510, buf_179, buf_181, buf_183, buf_521, buf_185], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[271], layouts[271], infinityBuf, [buf_522, buf_510, buf_520, buf_187, buf_189, buf_191, buf_523, buf_193], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[272], layouts[272], infinityBuf, [buf_524, buf_510, buf_522], [169, 12, 1]);
        addComputePass(device, commandEncoder, pipelines[273], layouts[273], infinityBuf, [buf_515, buf_524, buf_195, buf_197, buf_199, buf_525, buf_201], [169, 2, 1]);
        addComputePass(device, commandEncoder, pipelines[274], layouts[274], infinityBuf, [buf_520, buf_515, buf_203, buf_205, buf_207, buf_526, buf_209], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[275], layouts[275], infinityBuf, [buf_522, buf_520], [13, 13, 4]);
        addComputePass(device, commandEncoder, pipelines[276], layouts[276], infinityBuf, [buf_527, buf_522], [13, 13, 4]);
        addComputePass(device, commandEncoder, pipelines[277], layouts[277], infinityBuf, [buf_528, buf_527], [13, 13, 4]);
        addComputePass(device, commandEncoder, pipelines[278], layouts[278], infinityBuf, [buf_502, buf_520, buf_522, buf_527, buf_528], [169, 16, 1]);
        addComputePass(device, commandEncoder, pipelines[279], layouts[279], infinityBuf, [buf_512, buf_502, buf_211, buf_213, buf_215, buf_529, buf_217], [169, 2, 1]);
        addComputePass(device, commandEncoder, pipelines[280], layouts[280], infinityBuf, [buf_530, buf_512, buf_505], [13, 13, 12]);
        addComputePass(device, commandEncoder, pipelines[281], layouts[281], infinityBuf, [buf_500, buf_530, buf_219, buf_221, buf_223, buf_531, buf_225], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[282], layouts[282], infinityBuf, [buf_510, buf_500, buf_227, buf_229, buf_231, buf_532, buf_233], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[283], layouts[283], infinityBuf, [buf_515, buf_510, buf_235, buf_237, buf_239, buf_533, buf_241], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[284], layouts[284], infinityBuf, [buf_534, buf_500, buf_515], [169, 6, 1]);
        addComputePass(device, commandEncoder, pipelines[285], layouts[285], infinityBuf, [buf_505, buf_534, buf_243, buf_245, buf_247, buf_535, buf_249], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[286], layouts[286], infinityBuf, [buf_496, buf_505, buf_492], [13, 13, 6]);
        addComputePass(device, commandEncoder, pipelines[287], layouts[287], infinityBuf, [buf_492, buf_496, buf_251, buf_253, buf_255, buf_536, buf_257], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[288], layouts[288], infinityBuf, [buf_502, buf_492, buf_259, buf_261, buf_263, buf_537, buf_265], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[289], layouts[289], infinityBuf, [buf_500, buf_502, buf_267, buf_269, buf_271, buf_538, buf_273], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[290], layouts[290], infinityBuf, [buf_530, buf_492, buf_500], [169, 3, 1]);
        addComputePass(device, commandEncoder, pipelines[291], layouts[291], infinityBuf, [buf_494, buf_530, buf_275, buf_277, buf_279, buf_539, buf_281], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[292], layouts[292], infinityBuf, [buf_492, buf_494, buf_283, buf_285, buf_287, buf_540, buf_289], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[293], layouts[293], infinityBuf, [buf_541, buf_494, buf_303, buf_305, buf_307, buf_542, buf_309], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[294], layouts[294], infinityBuf, [buf_510, buf_494, buf_323, buf_325, buf_327, buf_543, buf_329], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[295], layouts[295], infinityBuf, [buf_494, buf_492, buf_291, buf_293, buf_295, buf_544, buf_297], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[296], layouts[296], infinityBuf, [buf_545, buf_541, buf_311, buf_313, buf_315, buf_546, buf_317], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[297], layouts[297], infinityBuf, [buf_534, buf_510, buf_505], [169, 6, 1]);
        addComputePass(device, commandEncoder, pipelines[298], layouts[298], infinityBuf, [buf_492, buf_494, buf_299, buf_301], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[299], layouts[299], infinityBuf, [buf_541, buf_545, buf_319, buf_321], [169, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[300], layouts[300], infinityBuf, [buf_505, buf_534, buf_331, buf_333, buf_335, buf_547, buf_337], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[301], layouts[301], infinityBuf, [buf_515, buf_505, buf_339, buf_341, buf_343, buf_548, buf_345], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[302], layouts[302], infinityBuf, [buf_510, buf_515, buf_347, buf_349, buf_351, buf_549, buf_353], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[303], layouts[303], infinityBuf, [buf_534, buf_505, buf_510], [169, 6, 1]);
        addComputePass(device, commandEncoder, pipelines[304], layouts[304], infinityBuf, [buf_502, buf_534, buf_355, buf_357, buf_359, buf_550, buf_361], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[305], layouts[305], infinityBuf, [buf_515, buf_502, buf_363, buf_365, buf_367, buf_551, buf_369], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[306], layouts[306], infinityBuf, [buf_552, buf_502, buf_383, buf_385, buf_387, buf_553, buf_389], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[307], layouts[307], infinityBuf, [buf_520, buf_502, buf_403, buf_405, buf_407, buf_554, buf_409], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[308], layouts[308], infinityBuf, [buf_510, buf_515, buf_371, buf_373, buf_375, buf_555, buf_377], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[309], layouts[309], infinityBuf, [buf_556, buf_552, buf_391, buf_393, buf_395, buf_557, buf_397], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[310], layouts[310], infinityBuf, [buf_524, buf_520, buf_512], [169, 12, 1]);
        addComputePass(device, commandEncoder, pipelines[311], layouts[311], infinityBuf, [buf_512, buf_510, buf_379, buf_381], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[312], layouts[312], infinityBuf, [buf_552, buf_556, buf_399, buf_401], [169, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[313], layouts[313], infinityBuf, [buf_515, buf_524, buf_411, buf_413, buf_415, buf_558, buf_417], [169, 2, 1]);
        addComputePass(device, commandEncoder, pipelines[314], layouts[314], infinityBuf, [buf_522, buf_515, buf_419, buf_421, buf_423, buf_559, buf_425], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[315], layouts[315], infinityBuf, [buf_527, buf_522, buf_427, buf_429, buf_431, buf_560, buf_433], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[316], layouts[316], infinityBuf, [buf_524, buf_515, buf_527], [169, 12, 1]);
        addComputePass(device, commandEncoder, pipelines[317], layouts[317], infinityBuf, [buf_510, buf_524, buf_435, buf_437, buf_439, buf_561, buf_441], [169, 2, 1]);
        addComputePass(device, commandEncoder, pipelines[318], layouts[318], infinityBuf, [buf_562, buf_510, buf_443, buf_445, buf_447, buf_563, buf_449], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[319], layouts[319], infinityBuf, [buf_564, buf_510, buf_463, buf_465, buf_467, buf_565, buf_469], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[320], layouts[320], infinityBuf, [buf_566, buf_562, buf_451, buf_453, buf_455, buf_567, buf_457], [13, 13, 1]);
        addComputePass(device, commandEncoder, pipelines[321], layouts[321], infinityBuf, [buf_568, buf_564, buf_471, buf_473, buf_475, buf_569, buf_477], [13, 13, 5]);
        addComputePass(device, commandEncoder, pipelines[322], layouts[322], infinityBuf, [buf_562, buf_566, buf_459, buf_461], [169, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[323], layouts[323], infinityBuf, [buf_564, buf_568, buf_479, buf_481], [169, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[324], layouts[324], infinityBuf, [buf_570, buf_492, buf_512, buf_562], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[325], layouts[325], infinityBuf, [buf_571, buf_541, buf_552, buf_564], [1183, 5, 1]);
        addComputePass(device, commandEncoder, pipelines[326], layouts[326], infinityBuf, [buf_572, buf_492, buf_512, buf_562, buf_570], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[327], layouts[327], infinityBuf, [buf_573, buf_492, buf_512, buf_562, buf_570, buf_572, buf_483], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[328], layouts[328], infinityBuf, [buf_574, buf_0, buf_1, buf_2, buf_573], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[329], layouts[329], infinityBuf, [buf_575, buf_0, buf_1, buf_2, buf_573], [1183, 1, 1]);
        addComputePass(device, commandEncoder, pipelines[330], layouts[330], infinityBuf, [output0, buf_574, buf_575, buf_485, buf_571], [1183, 7, 1]);
        commandEncoder.copyBufferToBuffer(output0, 0, gpuReadBuffer0, 0, output0.size);
        const gpuCommands = commandEncoder.finish();
        device.queue.submit([gpuCommands]);

        await gpuReadBuffer0.mapAsync(GPUMapMode.READ);
        const resultBuffer0 = new Float32Array(gpuReadBuffer0.size/4);
        resultBuffer0.set(new Float32Array(gpuReadBuffer0.getMappedRange()));
        gpuReadBuffer0.unmap();
        return [resultBuffer0];
    }
}
  

const loadNet = async (device) => { return await fetch('net.safetensors').then(x => x.arrayBuffer()).then(x => setupNet(device, new Uint8Array(x))); }