const babelPlugin = require('rollup-plugin-babel');
const tsPlugin = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

const ownKeys = Object.getOwnPropertyNames;
const externalDependencies = [
  ...new Set([...ownKeys(pkg.peerDependencies), ...ownKeys(pkg.dependencies)]),
];

module.exports = [
  {
    input: './src/index.ts',
    external: externalDependencies,

    output: [
      {
        file: pkg.esnext,
        format: 'es',
        exports: 'named',
      },
    ],

    plugins: [
      tsPlugin({
        clean: true,
        useTsconfigDeclarationDir: true,
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            declaration: true,
            declarationDir: `${__dirname}/dist/types`,
          },
        },
      }),
    ],
  },
  {
    input: './src/index.ts',
    external: externalDependencies,

    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
      },
    ],

    plugins: [
      tsPlugin({
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            target: 'es5',
            declaration: false,
          },
        },
      }),
      babelPlugin({
        babelrc: false,
        exclude: 'node_modules/**',
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                ie: '9',
              },
            },
          ],
        ],
      }),
    ],
  },
];
