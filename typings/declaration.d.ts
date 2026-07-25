// 不检查cssmodule的定义,当然也可以引用webpack插件来检查它
declare module "*.css";

declare module "*.js";

declare module 'maath/random/dist/maath-random.esm' {
  export function inSphere(positions: Float32Array, options: { radius: number }): Float32Array;
}