const helpers = require('./helpers');
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3002;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR
});

module.exports = function (options) {
    return webpackMerge(commonConfig({env: ENV}), {

        // devtool: 'source-map',
        devtool: 'cheap-module-source-map',

        output: {
            path: helpers.root('dist'),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js'
        },

        plugins: [

            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new DefinePlugin({
                'ENV': JSON.stringify(METADATA.ENV),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify(METADATA.ENV),
                    'NODE_ENV': JSON.stringify(METADATA.ENV),
                    'HMR': METADATA.HMR,
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImM0ZDEzMzExYTc3OTRlMTFmZDgzMTBmYmVkNzg2NjVhNmI4NDQ4MmI4NDFkNGYzOTZjZDhjMDA1NTMzYWNlZTk0ZjU5MmFhMDZjZDhjNGYxIn0.eyJhdWQiOiIxIiwianRpIjoiYzRkMTMzMTFhNzc5NGUxMWZkODMxMGZiZWQ3ODY2NWE2Yjg0NDgyYjg0MWQ0ZjM5NmNkOGMwMDU1MzNhY2VlOTRmNTkyYWEwNmNkOGM0ZjEiLCJpYXQiOjE1MTExMTI0NTUsIm5iZiI6MTUxMTExMjQ1NSwiZXhwIjoxNTExMTk4ODU1LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.UOklOEjYCDJ_uCFCvpvcX_D4ANZqZCXUmjmTB56JSgloSTQHWCblzULdexYRQJmP0DSHINkuR0UWNLjhx8ZcNJ2sEQsS0__ag2bfgvoerTheFfAaiXQm9pQrJS8nRAZMB6wJHLQzGAqhfvRK0dPQGDxMo5EgJsRALBNkDgTO_Rnitb6SZf3PlihwhRuBTBxQOVmSc3Dz0x8vdsGbNQQuXuzo6-GglJWF3b-FmBbgUmn_Nd0WHkw6TvM37xBZ_JEoDKM_0P74p9Q1itr3oHOYb6w7fcH3DYia6aViCPB-ZrZI3DAluDc2GIxvMOiNYAeTElXMKotJ1tefIIBDgYK_Csvt6n4fmTWHsfGLB5UsnqA7Lw_G5Bbwob_W_mPtz8C3LAsnQ6KDCEG2deU4hScJR3KCQFs-NXOQ6idG-q-fiad14ChHxkbooMZH334ebync_ChHcFunHnIf6IQFS-3HqDi3w1dCnyWSqcCRyGOuOSMyjXYzTuumC5-2sa0ZVFefE-63RaUpPzn_E-u8gzGZQOgE9AZnOmwxbGZQkftgwwUy18n8U7UfKTO0_BtS78MC-SSCYqgu3V3ccRNQ8_IL4ybFnlcrT2kndNlaMP-e-ngi1Gzh2D6hk8FtJTWmwVNNIOehKeR6ICH21L_M5BqAHLIBZEbdUXw1tuwy18k54zA'),
                    'BASE_URL': JSON.stringify('http://master.login.plentymarkets.com')
                }
            })
        ],

        devServer: {
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            }
        }

    });
};