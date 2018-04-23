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
                    'TOKEN': JSON.stringify('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjkwNWU3ZjcwNGEwODdkM2YzYmQyZWVjYzUyZjdhN2FmZTM4ZWZiNTVmNzdkZWM5MjY5NjBmOGEyOGUxMDY5ZDlhOTQ5NGY4NGU4NTRhMmVhIn0.eyJhdWQiOiIxIiwianRpIjoiOTA1ZTdmNzA0YTA4N2QzZjNiZDJlZWNjNTJmN2E3YWZlMzhlZmI1NWY3N2RlYzkyNjk2MGY4YTI4ZTEwNjlkOWE5NDk0Zjg0ZTg1NGEyZWEiLCJpYXQiOjE1MjQ0NjMyNDQsIm5iZiI6MTUyNDQ2MzI0NCwiZXhwIjoxNTI0NTQ5NjQzLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.OM7cL8U6nCTo9C8rl6Fk7XJXyUxaWbUN2cnZh2K12IaaqYWOeIGxBHhJtlI82I1zfrPkfEHr_t414U7djoIE9pEePo7HxHEXlll8_ox2b6xlALuWv-VbXfne_jaVkrI6_mcbewDC9f_SC6mmvzgxVuAyXV39mIKWMkaM2Lg3uNl0agM7oyA1mKPEpQA9AynCv4B8phJ1R8pQ1VgzJYOaaCb7pzhttiTp1uy14Fz-p1DbrC9LhfE2-Hrwq2-fDj3UCYHqCtZ6YKsMOGevDw4i0ZjMFTypY0uAIrDl7v8ByJounrdQ74SHnV4sV8JLVXwiGI_FjClTdMlM8q5qEYIdtqU2p9t4H80z3rEHa_66fqo-FdHF_9LRB1aO-vnThmAAkfLUNcmg3HaL1xJcIrczhrXeB58tK4DxoyKbTHqpaTBz5GQIDxul41lzXGnzsyn46I32SY9o6WLe6nF27BUGggpy_fZxz6OzZN2JKtIk8Ry1dbqGuiQuNHshqoRJdewEQdOLLVrPAnWZSxp9Wt6JlmSR2etwFdBEppENaZai-ZepZDh9WdHWc9g-nPWiCT0o-EzQ8DEq310p4DTXecQq0Wjio7hgUsDKrD18J2dZx0JHx24q8AcCtaTSjDEVvGZfY3fKx-eEG6L0uioP7zbtwpR1uLHYprXRYGjlNkQzw9M'),
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