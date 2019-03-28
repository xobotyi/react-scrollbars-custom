import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",

  output: [
    {
      dir: "dist/cjs",
      extend: true,
      format: "cjs",
      exports: "named"
    },
    {
      dir: "dist/esm",
      extend: true,
      format: "esm",
      exports: "named"
    }
  ],

  external: ["react", "prop-types", "cnbuilder", "react-draggable"],

  plugins: [
    ts({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext",
          target: "esnext",
          declaration: true,
          declarationDir: "dist/types"
        }
      }
    }),
    babel({
      babelrc: false,
      exclude: "node_modules/**",
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              esmodules: false,
              chrome: "52",
              ie: "10"
            }
          }
        ]
      ]
    })
  ]
};
