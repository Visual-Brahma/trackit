import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";

const config: Configuration={
    mode: "development",
    devtool: "eval",
    entry: {
        popup: './src/app/index.tsx',
        background: './src/background/index.ts', // background scripts
    },
    output: {
        // eslint-disable-next-line no-undef
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.svg'],
        plugins: [new TsconfigPathsPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(svg)$/,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "**/!(index.html|robots.txt)",
                    to: './',
                    context: "public"
                },
            ],
        }),
    ],
    watchOptions: {
        ignored: /node_modules/,
    }
}

export default config;