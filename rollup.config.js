import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.mjs",
        sourcemap: "inline",
        format: "es",
        exports: "named",
      },
      {
        file: "dist/index.cjs",
        sourcemap: "inline",
        format: "cjs",
      },
    ],
    plugins: [
      typescript(),
      nodeResolve({ browser: false }),
      copy({
        targets: [{ src: "src/bin/es.exe", dest: "dist/bin" }],
      }),
    ],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: {
      format: "esm",
      file: "dist/index.d.ts",
    },
  },
];
