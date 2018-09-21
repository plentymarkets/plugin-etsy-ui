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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM2MmE3ZjM2OWYzYWFiM2JkNzg5OTI1MmUzYTdiYzQ4OTU1ZTk2OGZhYjA4NTA0NTBjZjQ4MjZhY2ZiMWVjN2JhMDI1MTc2NDc5ZTU5MGJjIn0.eyJhdWQiOiIxIiwianRpIjoiMzYyYTdmMzY5ZjNhYWIzYmQ3ODk5MjUyZTNhN2JjNDg5NTVlOTY4ZmFiMDg1MDQ1MGNmNDgyNmFjZmIxZWM3YmEwMjUxNzY0NzllNTkwYmMiLCJpYXQiOjE1Mzc1MTQwNDEsIm5iZiI6MTUzNzUxNDA0MSwiZXhwIjoxNTM3NjAwNDQxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.0RRTYv9D-RPyRngIq2EBN-ss40D54XbBSV1uWb5i8xvWvvKd03WSvViqxouctxzi3k2VWenC1E_y1Xomlwbn8jPL7cSVulSHTTb_FOQhfbDT0wfIqYODOiVmXCCX_j3Ouw3jaFNVskTjx_8t78yMBNuF4qi0BCXnUQRVcKaHknalpBdl0a4S7u9U4JWc6_Hia7OgA8zanDnjNUTriyAPGHnND79N48hzau8dZg_cVz7q_A0fsVepghdhk5_9d_IZK9Ga_3MITH7lhpb-b7Hk18JoGav3LUNcXnbbC68pDf1Y8bQHf9qEWSrs570Ek5jEMCiVoIOTfAkWSE_cmpLjBV0dO77DxOCEXz3nPo-oxoxmUH3uv_6IPKoCuaFLJz8r1BZc56YPlB3zll0LvC0qLgECGgfdn4MnSbmKp8XSHRgvbNVVEIjhOFzrACFxZuSS0uTLBbqXvFH7pPME_piiE25QbAtYzoDPisJXWmGDx_W3hQ1C5j5aSi894iZ3CsvESHqd_rw0BGlU79hgzjNGwepQHhKk7w1o8nqhVDB9GIvxuw-HFj9CGYxtxgEy1UvQCJudgVZzXR1j50dk6XFiuggQOvaR0nrG7z1UEvSa92ztF1PZYLpbsW5HyFG6OAiZwClx4O0nB4CAs6B60upwVyOzcufm-dXntwpSqdd_M90'),
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