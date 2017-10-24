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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjE1OWFiZjQ3YTg5Mzg0YzgxZWI5NmMwMmVhMmRmYWRjMjBjMzgwMjQ2N2ViZjM4NGE2YjdiMTFiMTZjY2Y3OGM3OWQyNzNkMTJkZjdiYzExIn0.eyJhdWQiOiIxIiwianRpIjoiMTU5YWJmNDdhODkzODRjODFlYjk2YzAyZWEyZGZhZGMyMGMzODAyNDY3ZWJmMzg0YTZiN2IxMWIxNmNjZjc4Yzc5ZDI3M2QxMmRmN2JjMTEiLCJpYXQiOjE1MDg4NjYyNTksIm5iZiI6MTUwODg2NjI1OSwiZXhwIjoxNTA4OTUyNjU5LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.mEAM6Byahvvq6jSB0gn_PBoLvYt_58fIknAiQt0Oy-VMWMNwdEtgFPFlC-2JQ9KWRYmVIGbKI_MRNZErnExTMVE-P--2Csb7grg2tLjaybPq91dBOHb5Kn340kjp_SPwyGo7vcSAQXLz25prj9rO0i3OWDOHOIviqX7gmmserd-L4-xHPIZ8uRRxm7_XB_-qKSqzr4U_fvnBbR3cI_m5wQyNlleQNPlUbCaF7cgCJkd7r6H2yJvwegCasPlW-6gZPHYIPYkosh2ErvE5Bzcr8fKtl3r9Tfsle0gvBC3QLortlnQ3khCFCDGREevRhCoH2qBjz4XHpSfY6otUQ2XdH0oUcRgYZzRXmqDQFtjkplofl0ldYBpM6wxayEirKihitFlQw3_TmRQHtB6jcoIXNPQpNqtZO_tSYqGMwIjyd8FV993gPCZqznpO5wcsgbNYVcKh8E0bAhD5EwLD50SRln0N5AtGhbbE0j5MJXlJttzslhTkqhhutoPOy4hryxeVi0sdtw2FCRFKC2SFXmRptnglNrUBxeQ736CJKrpD4rQN0upLmc8Q6-KVYWpcsu8n4DewZcBXXuLPKUc_FIIB-2LvfPf3rIkZmEW03ww2ojBLevbl3ilUu_KOC_S83bQ_dWVuO2kexGxKXQw7iMxKgRWicSzYCXasDwZriDz2RL8'),
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