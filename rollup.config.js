import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";
import pkg from "./package.json";

const ownKeys = Object.getOwnPropertyNames;
const externalDependencies = Array.from(new Set(ownKeys(pkg.peerDependencies).concat(ownKeys(pkg.dependencies))));

export default [
  {
    input: "./src/index.ts",
    external: externalDependencies,

    output: [
      {
        file: pkg.esnext,
        format: "es",
        exports: "named",
      },
    ],

    plugins: [
      ts({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "esnext",
            // ToDo: FIXME! sadly rollup do not handle optional chaining yet
            target: "es2019",
            declaration: true,
            declarationDir: __dirname + "/dist/types",
          },
        },
      }),
    ],
  },
  {
    input: "./src/index.ts",
    external: externalDependencies,

    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
      {
        file: pkg.module,
        format: "esm",
        exports: "named",
      },
    ],

    plugins: [
      ts({
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "esnext",
            target: "es5",
            declaration: false,
          },
        },
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
                ie: "9",
              },
            },
          ],
        ],
      }),
    ],
  },
];
