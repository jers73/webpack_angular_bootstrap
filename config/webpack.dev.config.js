const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpack = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;
const rootDir = path.resolve(__dirname, '..');

const extractCss = new ExtractTextPlugin('[name].css');

module.exports = () => {
    return {
        devServer: {
            contentBase: path.resolve(rootDir, 'dist'),
            port: 9000
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js', '.json', 'scss']
        },
        module: {
            rules: [
                /*
                 * Typescript loader support for .ts
                 *
                 * Component Template/Style integration using `angular2-template-loader`
                 * Angular 2 lazy loading (async routes) via `ng-router-loader`
                 *
                 * `ng-router-loader` expects vanilla JavaScript code, not TypeScript code. This is why the
                 * order of the loader matter.
                 *
                 * See: https://github.com/s-panferov/awesome-typescript-loader
                 * See: https://github.com/TheLarkInn/angular2-template-loader
                 * See: https://github.com/shlomiassaf/ng-router-loader
                 */
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: '@angularclass/hmr-loader',
                            options: {
                                pretty: true,
                                prod: false
                            }
                        },
                        { // MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
                            loader: 'ng-router-loader',
                            options: {
                                loader: 'async-import',
                                genDir: 'compiled'
                            }
                        },
                        {
                            loader: 'awesome-typescript-loader'
                        },
                        {
                            loader: 'angular2-template-loader'
                        },
                        {
                            loader: 'tslint-loader',
                            options: {
                                configFile: 'tslint.json'
                            }
                        }
                    ],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },

                /*
                 * Json loader support for *.json files.
                 *
                 * See: https://github.com/webpack/json-loader
                 */
                {
                    test: /\.json$/,
                    use: 'json-loader'
                },

                /* Raw loader support for *.html
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.html$/,
                    use: 'raw-loader',
                    exclude: [path.resolve(rootDir, 'src/index.html')]
                },

                /*
                 * File loader for supporting images, for example, in CSS files.
                 */
                {
                    test: /\.(jpg|png|gif)$/,
                    use: 'file-loader'
                },

                /* File loader for supporting fonts, for example, in CSS files.
                 */
                {
                    test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                    use: 'file-loader'
                },

                /*
                 * css loader support for *.css files (styles directory only)
                 * Loads external css styles into the DOM, supports HMR
                 *
                 */
                {
                    test: /\.css$/,
                    use: extractCss.extract(['css-loader?sourceMap'])
                },

                /*
                 * sass loader support for *.scss files (styles directory only)
                 * Loads external sass styles into the DOM, supports HMR
                 *
                 */
                {
                    test: /\.scss$/,
                    use: extractCss.extract(['css-loader?sourceMap', 'sass-loader'])
                }
            ],

        },
        plugins: [
            extractCss,
            new CheckerPlugin(),
            new ChunkWebpack({
                filename: 'vendor.bundle.js',
                minChunks: Infinity,
                name: 'vendor'
            }),
            new HtmlWebpack({
                filename: 'index.html',
                template: path.resolve(rootDir, 'src', 'index.html'),
                hash: true,
                cache: true
            }),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                __dirname
            ),
        ],
        entry: {
            'app': [path.resolve(rootDir, 'src', 'bootstrap')],
            'vendor': [path.resolve(rootDir, 'src', 'vendor')],
        },
        output: {

            /**
             * The output directory as absolute path (required).
             *
             * See: http://webpack.github.io/docs/configuration.html#output-path
             */
            path: path.resolve(rootDir, 'dist'),

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[file].map',

            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].chunk.js',

            library: 'ac_[name]',
            libraryTarget: 'var',
        },
        watch: false
    };
};
