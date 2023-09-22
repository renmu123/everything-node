import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    sourcemap: "inline",
    format: "es",
    exports: "named",
  },
  plugins: [
    typescript(),
    nodeResolve({ browser: false }),
    copy({
      targets: [{ src: "src/bin/es.exe", dest: "dist/bin" }],
    }),
  ],
};
