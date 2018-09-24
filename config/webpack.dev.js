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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJhOGE1ZWMyNTIxODkwOTZkNDU2YTEwNTYzNzA2Y2Q3N2RmN2NiY2JhMWYzM2NlMjAzNzYzZDFlOWVmMDkzNjY3MjdhZjE4MTY4ZTg1MGRmIn0.eyJhdWQiOiIxIiwianRpIjoiYmE4YTVlYzI1MjE4OTA5NmQ0NTZhMTA1NjM3MDZjZDc3ZGY3Y2JjYmExZjMzY2UyMDM3NjNkMWU5ZWYwOTM2NjcyN2FmMTgxNjhlODUwZGYiLCJpYXQiOjE1Mzc3NzE2NDcsIm5iZiI6MTUzNzc3MTY0NywiZXhwIjoxNTM3ODU4MDQ2LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.G4yAl_xOhsIpPXQSfpMVJcGpkUraSyPvbZ07NFdKBAwDFa2NTa8ofWj6BlJgomRprILo4_CN47CZCpXOfxc88V-3QxHvIPItBUhykyfT_cXS_AXV6mKev00JEaRet7Sq8m1W90Ul7_78PZ7crhNsXUxyLqGX-rVHYqAMTYYOsB7XxA_RTJEChHTcKTdkfE_FG2OUdujB-P1cSElxOIfHa6cXQgtHj8Tlm-1eNGDsZneMivknjK0lLQeGxn7ZHtPB4aqZj_GRf_sN8f3fMCvYva7EpHxQF4DiJIU7CbPRvMAZe6QytP44SnrEJZj5Jlz215OLpjNIF64JW1yxIpFfnckk2rSzLTfNhhiLMuLKS5VAkEIeRluiY7fCAw-H7Xmgqz8CCfdauu36DPDdqXP7ifAz1oLmXBpDLzoCIQ_9hRym0o5jwldm8AcH0S_gEWXUYL2ga4WBDONFLQqUjGI6qD_AIchW5dTYFrpL_kyIQ65FNzOWa2wMqIiqTp9_UHEJL-gfauAYEP3tC9fdUZTLSXU5bvFpTYqiMlXkSD0eVELhxoiWwn1NcEph8dUYFN6XZoj8vdW8_pKjeBhwr6YedTebRtvD71B5--LLnDxwOwImOKtewvPvyvunA5zMFuA847YsgQA2iQbnOQ4fVB-W3otmn-qC0HjXhbDK-R_tV6o'),
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