import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, 'src/angular/app.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
      {
        type: 'javascript/auto',
        include: path.resolve(__dirname, 'src'),
        test: /\.(t|j)sx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(le|c)ss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.tpl\.html$/i,
        use: {
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  devServer: {
    compress: true,
    port: 9000,
    open: true,
    static: [
      {
        directory: path.resolve(__dirname, 'src/angular'),
        publicPath: '/templates',
        serveIndex: true,
      },
    ],
    client: {
      overlay: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/angular/app.html',
    }),
  ],
};
