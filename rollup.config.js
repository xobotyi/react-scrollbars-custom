import ts from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",

  output: [
    {
      dir: "dist/cjs",
      format: "cjs"
    },
    {
      dir: "dist/esm",
      format: "esm"
    }
  ],

  plugins: [
    ts({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNext",
          declaration: true
        }
      }
    })
  ]
};
