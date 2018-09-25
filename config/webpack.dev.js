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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0YWU4M2MyODkyYTViZjI2N2YwODY4MDA2MTM5M2RjOGMyOWNmODdhOTA2YTE1MjYzMWEzZTBkOWY0MjM1NTE1MzJjYTBkYThlYzhkNTk5In0.eyJhdWQiOiIxIiwianRpIjoiMzRhZTgzYzI4OTJhNWJmMjY3ZjA4NjgwMDYxMzkzZGM4YzI5Y2Y4N2E5MDZhMTUyNjMxYTNlMGQ5ZjQyMzU1MTUzMmNhMGRhOGVjOGQ1OTkiLCJpYXQiOjE1Mzc4NTI1MjMsIm5iZiI6MTUzNzg1MjUyMywiZXhwIjoxNTM3OTM4OTIzLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.VX9RSfdjeLz76t4hH1H1sqvrR2uQuCzcVETvNzsykCFCEGsmmlH7Bte9ifezGjfRAo9307wqIaXL8vSY0oJ-ZrMlq5Dsz-YNYWS5zoLSxGWWMBjmiQ_xCcikZRS_ehAnd9KTAcHp8ZwXTRWjecdlJVssDcl4ozeouCFRtnhCHljn0OVGNtPFXSEdFufzsdWsqUyHTTuB7EDBJ06NhvBv6YmZmG1RAphrvQrsewXyJQbeTlNs3jdAxc4Vu5DDqd2ObE4-C58UwkqTAFscSm2ruVbQQ5znIwCNlw_eVv7P7Wh8UVNc5xH5CtAFbGC4BaXmjlzlULwrfM1Q5AtIGue5uK9XyDW4uuLbG2IP6HAcQk5hq0inTGDBLegUKfOwjGumlCscEReU9M5nscKhWtuLOnGo3gXGyO80LrPVgoMwnk8XA9Oi5KfW5dpZSHepAZyW0Ec6-NpeXuUQrNHD4ZcboRQBaHP8aU95IbrhQkgdKnCcytLKM23rrATefRKp0Q3lxerDvjwyyCB8qJ96Vb11RI5IwXIU5dC2qgDHjmpR6iMJRzLN6Sbj9QqLbD2FxUsBE7f3C0KwSS3NZWH0ZUZB4EzmdR8Q442jD12DwP2KnmTlGm8D3tKr_sRonIAVAz9hWcu6_mUQXTm2Szcto6uBWEJQ6PyMDv3Lgowp9PmBclA'),
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