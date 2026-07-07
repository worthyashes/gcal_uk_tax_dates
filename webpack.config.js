const path = require('path');

module.exports = {
  entry: './src/gas-entry.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // Export as a global var so gas-declarations.js can call UkTaxBundle.*
    library: {
      name: 'UkTaxBundle',
      type: 'var',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.build.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  // Keep output readable for GAS debugging
  optimization: {
    minimize: false,
  },
  devtool: false,
};
