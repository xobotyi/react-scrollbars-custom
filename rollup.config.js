import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";
import pkg from "./package.json";

const ownKeys = Object.getOwnPropertyNames;
const externalDependencies = Array.from(new Set(ownKeys(pkg.peerDependencies).concat(ownKeys(pkg.dependencies))));

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named"
      }
    ],
    external: externalDependencies,
    plugins: [
      ts({
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "esnext",
            target: "es5",
            declaration: false
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
                ie: "9"
              }
            }
          ]
        ]
      })
    ]
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: pkg.module,
        format: "esm"
      }
    ],
    external: externalDependencies,
    plugins: [
      ts({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "esnext",
            target: "esnext",
            declaration: true,
            declarationDir: __dirname + "/dist/types"
          }
        }
      })
    ]
  }
];
